import { getCurrentInstance, isRef, type ComponentInternalInstance, type VNode } from 'vue'

type Scope = Record<string, unknown>

// Internal Vue contexts can contain keys that are not valid JavaScript
// parameter names (or are reserved words).  Exclude those keys before
// constructing the small expression evaluator below.
const RESERVED_FUNCTION_PARAMETERS = new Set([
  'arguments', 'eval', 'await', 'yield', 'class', 'function', 'var', 'let',
  'const', 'if', 'else', 'return', 'switch', 'case', 'default', 'delete',
  'new', 'this', 'super', 'typeof', 'void', 'in', 'instanceof', 'true',
  'false', 'null', 'undefined'
])

const eventNames = new Set([
  'Click', 'Checked', 'Unchecked', 'Indeterminate', 'SelectionChanged',
  'Selected', 'ValueChanged', 'TextChanged', 'TextSubmitted', 'IsCheckedChanged',
  'IsOnChanged', 'Opening', 'Opened', 'Closing', 'Closed', 'Expanding', 'Collapsed',
  'DateChanged', 'ColorChanged', 'QuerySubmitted', 'ItemClick', 'GettingFocus',
  'KeyDown', 'PointerPressed', 'PointerReleased', 'Tapped', 'Loaded',
  'PrimaryButtonClick', 'SecondaryButtonClick', 'CloseButtonClick', 'ActionButtonClick'
])

const eventProp = (name: string) => `on${name}`

const unwrap = (value: unknown): unknown => {
  if (isRef(value)) return value.value
  return value
}

const scopeFor = (instance: ComponentInternalInstance | null): Scope => {
  const scope: Scope = {}
  const merge = (source: Record<string, unknown> | undefined) => {
    if (!source) return
    let keys: string[] = []
    try {
      keys = Object.keys(source)
    } catch {
      return
    }
    for (const key of keys) {
      // The nearest component owns a name.  Do not let a parent setup scope
      // overwrite a child binding with the same identifier.
      if (key in scope) continue
      try {
        scope[key] = unwrap(source[key])
      } catch {
        // Vue exposes a few internal context getters that are not safe to read
        // while a render is being evaluated. They are not XAML bindings.
      }
    }
  }
  // Bindings belong to the owning XAML page/view model. Starting at the
  // control itself would enumerate implementation computeds such as
  // ControlExample.propertyNodes and recursively evaluate the same VNodes.
  let cursor = instance?.parent ?? null
  while (cursor) {
    const sourceFile = String((cursor.type as { __file?: string } | undefined)?.__file ?? '').replace(/\\/g, '/')
    const isPageScope = /\/gallery\/(?:pages|components)\//.test(sourceFile)
    if (isPageScope) {
      merge(cursor.setupState)
    }
    cursor = cursor.parent
  }

  // Vue global properties are exposed through the component proxy, not the
  // internal setup/context objects.  XAML samples use the application
  // translator as `$t(...)`, so make that property explicit in the evaluator
  // scope instead of relying on proxy lookup.
  const globalProperties = instance?.appContext.config.globalProperties
  if (globalProperties) {
    let keys: string[] = []
    try {
      keys = Object.keys(globalProperties)
    } catch {
      keys = []
    }
    for (const key of keys) {
      if (key !== '$t' && key in scope) continue
      try {
        scope[key] = unwrap(globalProperties[key])
      } catch {
        // Ignore non-binding global getters.
      }
    }
    try {
      if (typeof globalProperties.$t === 'function') scope.$t = globalProperties.$t
    } catch {
      // Translation is optional for the runtime evaluator.
    }
  }

  // Generated sample strings use both the Vue-style `$t(...)` spelling and
  // the compact `t(...)` form inside XAML attribute values.
  if (typeof scope.$t === 'function' && !scope.t) scope.t = scope.$t

  return scope
}

const stripBinding = (value: string) => {
  const match = value.match(/^\{(?:x:Bind|Binding)\s+([\s\S]*?)\}$/)
  if (!match) return value
  return match[1].replace(/,\s*Mode\s*=\s*(?:OneWay|TwoWay|OneTime)\s*$/, '').trim()
}

const bindingDetails = (value: string) => {
  const match = value.match(/^\{(?:x:Bind|Binding)\s+([\s\S]*?)\}$/)
  if (!match) return { expression: value, twoWay: false }
  const body = match[1]
  return {
    expression: body.replace(/,\s*Mode\s*=\s*(?:OneWay|TwoWay|OneTime)\s*$/, '').trim(),
    twoWay: /,\s*Mode\s*=\s*TwoWay\s*$/i.test(body)
  }
}

const splitPath = (value: string) => value
  .replace(/^\((?:x:Double|x:Int32|x:String)\)/, '')
  .replace(/\?\./g, '.')
  .split('.')
  .map((part) => part.trim())
  .filter(Boolean)

const resolvePath = (expression: string, scope: Scope): unknown => {
  let source = expression.trim()
  if (source === 'x:True' || source === 'True') return true
  if (source === 'x:False' || source === 'False') return false
  if (source === 'x:Null' || source === 'Null') return null
  if (/^-?\d+(?:\.\d+)?$/.test(source)) return Number(source)
  if (/^'.*'$|^".*"$/.test(source)) return source.slice(1, -1)

  // Localized XAML samples frequently bind directly to the application
  // translator. Resolve this common call explicitly before the generic
  // evaluator so it also works when Vue stores global properties outside the
  // enumerable proxy keys.
  const translatorCall = source.match(/^\$?t\(\s*(['"])(.*?)\1\s*\)$/s)
  if (translatorCall && typeof (scope.$t ?? scope.t) === 'function') {
    return ((scope.$t ?? scope.t) as (key: string) => unknown)(translatorCall[2])
  }

  const equals = source.match(/^(.*)\.Equals\((x:)?(True|False|Null)\)$/)
  if (equals) {
    const left = resolvePath(equals[1], scope)
    const right = resolvePath(`${equals[2] ?? ''}${equals[3]}`, scope)
    return unwrap(left) === right
  }
  const toString = source.match(/^(.*)\.ToString\(\)$/)
  if (toString) return String(unwrap(resolvePath(toString[1], scope)) ?? '')
  if (source.startsWith('String(') && source.endsWith(')')) {
    return String(unwrap(resolvePath(source.slice(7, -1), scope)) ?? '')
  }

  // x:Bind permits method calls and conditional expressions. The gallery uses
  // these for localized labels and simple value projections, so evaluate the
  // expression against the component setup scope after handling XAML literals.
  if (/[$A-Za-z_(]/.test(source)) {
    try {
      const jsSource = source.replace(/\bx:(True|False|Null)\b/g, (_, literal: string) => literal === 'True' ? 'true' : literal === 'False' ? 'false' : 'null')
      const entries = Object.entries(scope).filter(([key]) =>
        /^[A-Za-z_$][\w$]*$/.test(key) && !RESERVED_FUNCTION_PARAMETERS.has(key)
      )
      return unwrap(Function(...entries.map(([key]) => key), `return (${jsSource})`)(...entries.map(([, value]) => value)))
    } catch {
      // Fall through to path lookup for unresolved binding text.
    }
  }

  const rootMatch = source.match(/^([A-Za-z_$][\w$]*)/)
  if (!rootMatch) return undefined
  let value: unknown = scope[rootMatch[1]]
  source = source.slice(rootMatch[0].length)
  for (const part of splitPath(source)) {
    value = unwrap(value)
    if (value === null || value === undefined) return undefined
    // XAML bindings commonly spell a boolean ref as Foo.IsChecked.Value.
    // Vue setup refs expose the boolean directly, so these wrapper segments
    // are intentionally transparent at runtime.
    if ((part === 'IsChecked' || part === 'Value') && (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string')) continue
    value = (value as Record<string, unknown>)[part]
  }
  return unwrap(value)
}

const isExpressionString = (value: string) => {
  const trimmed = value.trim()
  return /^\$t\s*\(/.test(trimmed)
    || /^t\s*\(/.test(trimmed)
    || /^\$\{\s*t\s*\(/.test(trimmed)
}

export const resolveXamlValue = (value: unknown, instance: ComponentInternalInstance | null): unknown => {
  if (typeof value !== 'string') return value
  if (value === 'True') return true
  if (value === 'False') return false
  const trimmed = value.trim()
  const expression = stripBinding(value)
  const directExpression = isExpressionString(trimmed)
    ? trimmed.replace(/^\$\{\s*/, '').replace(/\s*\}$/, '')
    : expression
  if (directExpression === value && !value.includes('{') && !isExpressionString(value)) return value
  let resolved: unknown
  try {
    resolved = resolvePath(directExpression, scopeFor(instance))
  } catch {
    // A malformed or unavailable binding must not break rendering of the
    // containing page.  XAML treats an unresolved value as its default.
    resolved = undefined
  }
  if (resolved !== undefined) return resolved

  // Never leak an unresolved binding expression into a visual control.  A
  // static-resource marker is intentionally preserved because controls use
  // that literal to select a style/resource by name.
  if (/^\{\s*(?:x:Bind|Binding)\b/.test(value) || isExpressionString(value)) return undefined
  return value
}

const assignPath = (expression: string, value: unknown, instance: ComponentInternalInstance | null) => {
  const parts = splitPath(expression)
  if (!parts.length) return
  let cursor = instance
  while (cursor) {
    if (Object.prototype.hasOwnProperty.call(cursor.setupState, parts[0])) {
      let target: unknown = cursor.setupState
      for (let index = 0; index < parts.length - 1; index += 1) {
        const part = parts[index]
        target = unwrap((target as Record<string, unknown>)[part])
        if (target === null || target === undefined) return
      }
      const finalPart = parts[parts.length - 1]
      const objectTarget = target as Record<string, unknown>
      // setupState is a shallow-unwrapped proxy: assigning its final key
      // normally updates a ref, but nested paths can still expose the ref
      // object itself. Preserve the ref in both cases so TwoWay bindings keep
      // their reactive identity.
      const current = objectTarget[finalPart]
      if (isRef(current)) current.value = value
      else if (isRef(objectTarget)) objectTarget.value = value
      else objectTarget[finalPart] = value
      return
    }
    cursor = cursor.parent
  }
}

const evaluateHandler = (expression: string, scope: Scope, event: unknown) => {
  const source = expression.trim()
  const direct = resolvePath(source, scope)
  if (typeof direct === 'function') return (...args: unknown[]) => direct(...args)
  const call = source.match(/^([A-Za-z_$][\w$]*)\((.*)\)$/s)
  if (!call || typeof scope[call[1]] !== 'function') return undefined
  const args = call[2].trim()
  try {
    const entries = Object.entries(scope).filter(([key]) =>
      /^[A-Za-z_$][\w$]*$/.test(key) && !RESERVED_FUNCTION_PARAMETERS.has(key)
    )
    const values = args
      ? Function(...entries.map(([key]) => key), '$event', `return [${args}]`)(...entries.map(([, value]) => value), event)
      : []
    return (...eventArgs: unknown[]) => (scope[call[1]] as (...args: unknown[]) => unknown)(...values, ...eventArgs)
  } catch {
    return (...eventArgs: unknown[]) => (scope[call[1]] as (...args: unknown[]) => unknown)(...eventArgs)
  }
}

export const resolveXamlHandler = (value: unknown, instance: ComponentInternalInstance | null) => {
  if (typeof value === 'function') return value
  if (typeof value !== 'string') return undefined
  const expression = stripBinding(value)
  const scope = scopeFor(instance)
  const assignment = expression.match(/^([A-Za-z_$][\w$]*)\s*=\s*\$event(?:\.([A-Za-z_$][\w$]*))?(?:\s*(===|!==|==|!=)\s*(['"]?[^\s'"]+['"]?))?$/)
  if (assignment) {
    return (event: unknown) => {
      let next: unknown = event
      if (assignment[2]) next = (next as Record<string, unknown> | undefined)?.[assignment[2]]
      if (assignment[3]) {
        const right = assignment[4]?.replace(/^['"]|['"]$/g, '')
        const comparable = right === 'true' ? true : right === 'false' ? false : Number.isNaN(Number(right)) ? right : Number(right)
        next = assignment[3] === '===' ? next === comparable : assignment[3] === '!==' ? next !== comparable : assignment[3] === '==' ? next == comparable : next != comparable
      }
      assignPath(assignment[1], next, instance)
    }
  }
  const literalAssignment = expression.match(/^([A-Za-z_$][\w$]*)\s*=\s*(['"].*['"])$/s)
  if (literalAssignment) {
    return () => assignPath(literalAssignment[1], literalAssignment[2].slice(1, -1), instance)
  }
  return evaluateHandler(expression, scope, undefined)
}

export const normalizeXamlVNode = (node: VNode, instance: ComponentInternalInstance | null): VNode => {
  // Fragments and structural wrapper nodes normally have no props. Their
  // children can still contain XAML bindings and event names, so do not stop
  // traversal at the wrapper.
  const props = { ...(node.props ?? {}) }
  for (const [name, value] of Object.entries(props)) {
    if (name.startsWith('on') || name === 'key' || name === 'ref' || name === 'class' || name === 'style') continue
    if (eventNames.has(name)) {
      const handler = resolveXamlHandler(value, instance)
      if (handler) props[eventProp(name)] = handler
      delete props[name]
      continue
    }
    if (typeof value === 'string' && value.startsWith('{')) {
      const details = bindingDetails(value)
      const resolved = resolveXamlValue(value, instance)
      props[name] = resolved
      if (details.twoWay && !name.includes('.')) {
        props[`onUpdate:${name}`] = (next: unknown) => assignPath(details.expression, next, instance)
      }
    }
    if (typeof node.type === 'string' && (name === 'Background' || name === 'BorderBrush' || name === 'Foreground')) {
      const resolved = resolveXamlValue(value, instance)
      const style = typeof props.style === 'object' && props.style !== null ? { ...(props.style as Record<string, unknown>) } : {}
      if (name === 'Background') style.background = resolved
      if (name === 'BorderBrush') style.borderColor = resolved
      if (name === 'Foreground') style.color = resolved
      props.style = style
      delete props[name]
    }
    if (typeof node.type === 'string' && name === 'Source') {
      props.src = resolveXamlValue(value, instance)
      delete props[name]
    }
  }
  if (Array.isArray(node.children)) {
    node.children = node.children.map((child) => child && typeof child === 'object' && 'type' in child
      ? normalizeXamlVNode(child as VNode, instance)
      : child)
  }
  if (node.children && typeof node.children === 'object' && !Array.isArray(node.children)) {
    const children = { ...node.children } as Record<string, unknown>
    for (const [slotName, slot] of Object.entries(children)) {
      if (typeof slot !== 'function') continue
      children[slotName] = (...args: unknown[]) => {
        const result = (slot as (...args: unknown[]) => unknown)(...args)
        return Array.isArray(result)
          ? result.map((child) => child && typeof child === 'object' && 'type' in child ? normalizeXamlVNode(child as VNode, instance) : child)
          : result
      }
    }
    node.children = children
  }
  node.props = Object.keys(props).length || node.props ? props : node.props
  return node
}

export const normalizeXamlNodes = (nodes: VNode[], instance = getCurrentInstance()) =>
  nodes.map((node) => normalizeXamlVNode(node, instance))
