import { cloneVNode, Fragment, getCurrentInstance, h, isRef, type ComponentInternalInstance, type VNode } from 'vue'

type Scope = Record<string, unknown>

export const xamlScopeKey = Symbol('WinUIonWeb.xamlScope')
export const xamlNameScopeKey = Symbol('WinUIonWeb.xamlNameScope')
// Collection item templates provide their current data item through this
// scope so structural flyouts can invoke handlers with the same DataContext
// that WinUI supplies to a MenuFlyoutItem.
export const xamlItemContextKey = Symbol('WinUIonWeb.xamlItemContext')

// Internal Vue contexts can contain keys that are not valid JavaScript
// parameter names (or are reserved words).  Exclude those keys before
// constructing the small expression evaluator below.
const RESERVED_FUNCTION_PARAMETERS = new Set([
  'arguments', 'eval', 'await', 'yield', 'class', 'function', 'var', 'let',
  'const', 'if', 'else', 'return', 'switch', 'case', 'default', 'delete',
  'new', 'this', 'super', 'typeof', 'void', 'in', 'instanceof', 'true',
  'false', 'null', 'undefined'
])

export const eventNames = new Set([
  'Click', 'Checked', 'Unchecked', 'Indeterminate', 'SelectionChanged',
  'Selected', 'Select', 'ValueChanged', 'TextChanged', 'TextSubmitted',
  'IsCheckedChanged', 'IsOnChanged', 'Toggled',
  'DropDownOpened', 'DropDownClosed', 'Opening', 'Opened', 'Closing', 'Closed',
  'Expanding', 'Expanded', 'Collapsing', 'Collapsed',
  'DateChanged', 'ColorChanged', 'QuerySubmitted', 'ItemClick', 'GettingFocus',
  'KeyDown', 'PointerPressed', 'PointerReleased', 'Tapped', 'Loaded', 'ItemInvoked',
  'DragItemsStarting', 'DragItemsCompleted', 'DragOver', 'Drop', 'RefreshRequested',
  'PrimaryButtonClick', 'SecondaryButtonClick', 'CloseButtonClick', 'ActionButtonClick'
])

const eventProp = (name: string) => `on${name}`
const xamlPropSources = new WeakMap<object, Record<string, unknown>>()

// Components that call resolveXamlValue themselves must receive the original
// expression so bindings stay reactive. Layout-only components do not have a
// resolver and continue receiving the materialized value below.
const reactiveComponentNames = new Set([
  'AutoSuggestBox', 'Border', 'Button', 'CheckBox', 'ColorPicker', 'ComboBox',
  'ContentDialog', 'ControlExample', 'DropDownButton', 'Expander', 'ExpanderBase', 'Flyout',
  'FontIcon', 'HyperlinkButton', 'Image', 'Popup', 'RadioButton', 'RadioButtons',
  'Rating', 'Rectangle', 'RepeatButton', 'RichEditBox', 'RichTextBlock', 'Slider', 'NumberBox',
  'SplitButton', 'SymbolIcon', 'TeachingTip', 'TextBlock', 'TextBox', 'ToggleButton',
  'ToggleSplitButton', 'ToggleSwitch', 'ToolTip'
  , 'FlipView', 'GridView', 'ItemsRepeater', 'ItemsView', 'ListView', 'PullToRefresh', 'RefreshContainer', 'RefreshVisualizer', 'TreeView'
  // ItemsStackPanel is a structural ItemsPanel child. Collection controls
  // read its dependency properties from the VNode and resolve bindings on
  // each computed pass, so keep those expressions live as well.
  , 'ItemsStackPanel'
])

const componentName = (type: unknown) => {
  if (!type || typeof type !== 'object') return ''
  const value = type as { name?: string; __name?: string; __file?: string }
  return value.name || value.__name || value.__file?.split(/[\\/]/).pop()?.replace(/\.vue$/, '') || ''
}

const unwrap = (value: unknown): unknown => {
  if (isRef(value)) return value.value
  return value
}

/** Convert XAML's alpha-first 8-digit colors to the CSS rgba form. */
export const xamlColor = (value: unknown): unknown => {
  if (typeof value !== 'string') return value
  const match = value.trim().match(/^#([\da-f]{8})$/i)
  if (!match) return value
  const hex = match[1]
  const alpha = Number.parseInt(hex.slice(0, 2), 16) / 255
  const red = Number.parseInt(hex.slice(2, 4), 16)
  const green = Number.parseInt(hex.slice(4, 6), 16)
  const blue = Number.parseInt(hex.slice(6, 8), 16)
  return `rgba(${red}, ${green}, ${blue}, ${Number(alpha.toFixed(4))})`
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

  // Control templates can contain child controls whose event attributes use
  // normal XAML handler names. Owners provide that small template scope
  // without exposing their entire implementation state to the evaluator.
  // A control provides template bindings for its children. Resolving the
  // control's own XAML properties against instance.provides would also read
  // the scope it just provided, which can recursively evaluate implementation
  // computeds and hide the owning parent control's handlers. The parent
  // provides object is the XAML namescope that owns this component.
  const providedScope = instance?.parent?.provides?.[xamlScopeKey] as Record<string, unknown> | undefined
  merge(providedScope)

  // XAML namescopes expose x:Name controls to sibling bindings such as
  // PlaceholderValue="{x:Bind slider.Value, Mode=TwoWay}".  The registry is
  // populated by normalizeXamlVNode when the named component is mounted.
  const providedNameScope = instance?.parent?.provides?.[xamlNameScopeKey] as Record<string, unknown> | undefined
  merge(providedNameScope)

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
  const match = value.match(/^\{(?:x:Bind|Binding)(?:\s+([\s\S]*?))?\}$/)
  if (!match) return value
  return (match[1] ?? '').replace(/,\s*Mode\s*=\s*(?:OneWay|TwoWay|OneTime)\s*$/, '').trim()
}

const canonicalXamlProperty = (value: string) => {
  const aliases: Record<string, string> = {
    'ControlExample.example': 'ControlExample.Example',
    'ControlExample.options': 'ControlExample.Options',
    'ControlExample.output': 'ControlExample.Output',
    'Expander.header': 'Expander.Header',
    'Expander.content': 'Expander.Content',
    'ItemsRepeater.itemTemplate': 'ItemsRepeater.ItemTemplate',
    'ItemsRepeater.layout': 'ItemsRepeater.Layout',
    'ItemsView.itemTemplate': 'ItemsView.ItemTemplate',
    'ItemsView.layout': 'ItemsView.Layout',
    'ListView.itemTemplate': 'ListView.ItemTemplate',
    'ListView.groupHeaderTemplate': 'ListView.GroupHeaderTemplate',
    'ListView.groupStyle': 'ListView.GroupStyle',
    'GroupStyle.headerTemplate': 'GroupStyle.HeaderTemplate',
    'GridView.itemTemplate': 'GridView.ItemTemplate',
    'GridView.itemTemplateSelector': 'GridView.ItemTemplateSelector',
    'FlipView.itemTemplate': 'FlipView.ItemTemplate',
    'TreeView.itemTemplate': 'TreeView.ItemTemplate',
    'RefreshContainer.visualizer': 'RefreshContainer.Visualizer',
    'RefreshVisualizer.content': 'RefreshVisualizer.Content'
  }
  return aliases[value] ?? value
}

const resourceName = (value: string) => {
  const match = value.trim().match(/^\{\s*(?:ThemeResource|StaticResource)\s+([^\s}]+)\s*\}$/i)
  return match?.[1] ?? ''
}

const resourceCssVariable = (name: string) => {
  if (!name) return ''
  const aliases: Record<string, string> = {
    AcrylicBackgroundFillColorDefaultBrush: 'AcrylicInAppFillColorDefaultBrush',
    OverlayCornerRadius: 'OverlayCornerRadius',
    SurfaceStrokeColorDefaultBrush: 'SurfaceStrokeColorDefaultBrush',
    SurfaceStrokeColorFlyoutBrush: 'SurfaceStrokeColorFlyoutBrush',
    LayerFillColorAltBrush: 'LayerFillColorAltBrush',
    SolidBackgroundFillColorBaseBrush: 'SolidBackgroundFillColorBaseBrush',
    SolidBackgroundFillColorTertiaryBrush: 'SolidBackgroundFillColorTertiaryBrush',
    SmokeFillColorDefaultBrush: 'SmokeFillColorDefaultBrush'
  }
  const key = aliases[name] ?? name
  return `var(--${key})`
}

const bindingDetails = (value: string) => {
  const match = value.match(/^\{(?:x:Bind|Binding)(?:\s+([\s\S]*?))?\}$/)
  if (!match) return { expression: value, twoWay: false }
  const body = match[1] ?? ''
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

export const resolveXamlValue = (value: unknown, instance: ComponentInternalInstance | null, extraScope?: Scope): unknown => {
  if (typeof value !== 'string') return value
  if (value === 'True') return true
  if (value === 'False') return false
  const trimmed = value.trim()
  const resource = resourceName(trimmed)
  if (resource) return resourceCssVariable(resource)
  const expression = stripBinding(value)
  const directExpression = isExpressionString(trimmed)
    ? trimmed.replace(/^\$\{\s*/, '').replace(/\s*\}$/, '')
    : expression
  if (!directExpression.trim() && extraScope && Object.prototype.hasOwnProperty.call(extraScope, 'item')) return extraScope.item
  if (directExpression === value && !value.includes('{') && !isExpressionString(value)) return xamlColor(value)
  let resolved: unknown
  try {
    const scope = scopeFor(instance)
    if (extraScope) {
      for (const [key, scopedValue] of Object.entries(extraScope)) scope[key] = unwrap(scopedValue)
    }
    resolved = resolvePath(directExpression, scope)
  } catch {
    // A malformed or unavailable binding must not break rendering of the
    // containing page.  XAML treats an unresolved value as its default.
    resolved = undefined
  }
  if (resolved !== undefined) return xamlColor(resolved)

  // Never leak an unresolved binding expression into a visual control.  A
  // static-resource marker is intentionally preserved because controls use
  // that literal to select a style/resource by name.
  if (/^\{\s*(?:x:Bind|Binding)\b/.test(value) || isExpressionString(value)) return undefined
  return xamlColor(value)
}

/**
 * Materialize an XAML DataTemplate against the current item.  Vue's compiler
 * keeps property-element children as VNodes, so the collection controls can
 * render the same tree for every item while resolving `{x:Bind Property}` in
 * the item's data context.
 */
export const materializeXamlVNode = (node: unknown, item: unknown, instance: ComponentInternalInstance | null): unknown => {
  if (!node || typeof node !== 'object') return node
  if (Array.isArray(node)) return node.map((child) => materializeXamlVNode(child, item, instance))
  const vnode = node as VNode
  const propertyName = typeof vnode.type === 'string' ? canonicalXamlProperty(vnode.type).split('.').pop()?.replace(/^[A-Z]/, (letter) => letter.toLowerCase()) : undefined
  const collectionProperty = (vnode.type as { __collectionProperty?: string; __controlExampleProperty?: string } | undefined)?.__collectionProperty
    ?? (vnode.type as { __controlExampleProperty?: string } | undefined)?.__controlExampleProperty
    ?? propertyName
  // normalizeXamlVNode may have visited a DataTemplate before the collection
  // control had an item context. Keep the original XAML values alongside the
  // normalized props so item bindings such as `{x:Bind MsgAlignment}` can be
  // resolved when the template is materialized for its actual item.
  const originalProps = xamlPropSources.get(vnode as object)
  const props = vnode.props
    ? { ...vnode.props }
    : originalProps ? { ...originalProps } : undefined
  if (props) {
    // Layout components are normalized before a collection item exists, so
    // their item bindings may have become undefined. Restore only those
    // binding-valued keys; normalized event listeners and static attributes
    // must remain intact.
    if (originalProps) {
      for (const [key, value] of Object.entries(originalProps)) {
        if (typeof value !== 'string' || (!value.includes('{') && !isExpressionString(value))) continue
        if (props[key] === undefined || props[key] === null) props[key] = value
      }
    }
    const itemScope: Scope = { item, Item: item }
    if (item && typeof item === 'object') Object.assign(itemScope, item as Record<string, unknown>)
    // The ListView messaging sample binds the template Grid's alignment to
    // `MsgAlignment`. A parent ControlExample can normalize that binding
    // before a collection item exists, leaving an undefined prop on the
    // cached VNode. Recover the official item-context value here so the Grid
    // keeps its left/right placement when the DataTemplate is materialized.
    if (componentName(vnode.type) === 'Grid'
      && props.HorizontalAlignment === undefined
      && item && typeof item === 'object'
      && 'MsgAlignment' in item) {
      props.HorizontalAlignment = (item as Record<string, unknown>).MsgAlignment
    }
    for (const [key, value] of Object.entries(props)) {
      if (key === 'key' || key === 'ref' || key.startsWith('on')) continue
      if (eventNames.has(key)) {
        props[`on${key}`] = resolveXamlHandler(value, instance, { item, Item: item, ...(item && typeof item === 'object' ? item as Record<string, unknown> : {}) })
        delete props[key]
        continue
      }
      if (typeof value === 'string' && (value.includes('{') || isExpressionString(value))) {
        props[key] = resolveXamlValue(value, instance, itemScope)
      }
    }
  }
  // A nested DataTemplate owns a new item data context. Resolve the nested
  // collection control itself against the current item, but leave the
  // ItemTemplate body untouched until that collection materializes its item.
  if (collectionProperty === 'itemTemplate' || collectionProperty === 'groupHeaderTemplate') {
    return cloneVNode(vnode, props, true)
  }
  let children = vnode.children
  if (Array.isArray(children)) children = children.map((child) => materializeXamlVNode(child, item, instance)) as VNode['children']
  else if (children && typeof children === 'object') {
    const slots = { ...(children as Record<string, unknown>) }
    for (const [name, slot] of Object.entries(slots)) {
      if (typeof slot !== 'function') continue
      slots[name] = (...args: unknown[]) => {
        const result = (slot as (...args: unknown[]) => unknown)(...args)
        return materializeXamlVNode(result, item, instance)
      }
    }
    children = slots
  }
  const clone = cloneVNode(vnode, props, true)
  clone.children = children
  return clone
}

export const xamlTemplateComponent = (nodes: unknown[], item: unknown, instance: ComponentInternalInstance | null) =>
  h(Fragment, (materializeXamlVNode(nodes, item, instance) as VNode[]) ?? [])

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

  // TwoWay bindings may target a control registered through x:Name rather
  // than a page setup ref. Resolve the named component and assign its exposed
  // dependency-property-shaped value.
  cursor = instance
  while (cursor) {
    const names = cursor.provides?.[xamlNameScopeKey] as Record<string, unknown> | undefined
    if (names && Object.prototype.hasOwnProperty.call(names, parts[0])) {
      let target: unknown = unwrap(names[parts[0]])
      for (let index = 1; index < parts.length - 1; index += 1) {
        target = unwrap((target as Record<string, unknown> | undefined)?.[parts[index]])
        if (target === null || target === undefined) return
      }
      const finalPart = parts[parts.length - 1]
      const objectTarget = target as Record<string, unknown> | null
      if (!objectTarget) return
      const current = objectTarget[finalPart]
      if (isRef(current)) current.value = value
      else objectTarget[finalPart] = value
      return
    }
    cursor = cursor.parent
  }
}

/** Write a control value back to the source of a XAML TwoWay binding. */
export const updateXamlBinding = (binding: unknown, value: unknown, instance: ComponentInternalInstance | null) => {
  if (typeof binding !== 'string') return
  const details = bindingDetails(binding)
  if (!details.twoWay) return
  assignPath(details.expression, value, instance)
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

export const resolveXamlHandler = (value: unknown, instance: ComponentInternalInstance | null, extraScope?: Scope) => {
  if (typeof value === 'function') return value
  if (typeof value !== 'string') return undefined
  const expression = stripBinding(value)
  const scope = scopeFor(instance)
  if (extraScope) Object.assign(scope, extraScope)
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
  const sourceProps = xamlPropSources.get(node as object) ?? { ...props }
  xamlPropSources.set(node as object, sourceProps)
  for (const [name, value] of Object.entries(sourceProps)) {
    if (name.startsWith('on') || name === 'key' || name === 'class' || name === 'style') continue
    if (name === 'ref' || /^x:name$/i.test(name)) {
      // Keep Vue's ref registration, and expose the XAML name on the DOM so
      // Target="{x:Bind testButton}" can still resolve after a slot is
      // teleported outside the page subtree.
      if (typeof value === 'string' && value.trim()) props['data-xaml-ref'] = value.trim()
      if (/^x:name$/i.test(name) && typeof value === 'string' && value.trim()) {
        const nameScope = instance?.provides?.[xamlNameScopeKey] as Record<string, unknown> | undefined
        if (nameScope) {
          const xamlName = value.trim()
          let exposedTarget: Record<string, unknown> | null = null
          let exposedBindingProxy: Record<string, unknown> | null = null
          const register = (vnode: VNode) => {
            const component = vnode.component as {
              exposed?: Record<string, unknown> | null
              exposeProxy?: unknown
              proxy?: unknown
            } | null
            const exposed = component?.exposed
            if (exposed) {
              // Keep a stable XAML namescope object around the component's
              // exposed refs. Vue's public expose proxy unwraps refs on read,
              // but assigning through it can miss a computed setter. XAML
              // TwoWay bindings need both operations to be dependency-property
              // shaped, so unwrap on get and write through the original ref.
              if (exposedTarget !== exposed || !exposedBindingProxy) {
                exposedTarget = exposed
                exposedBindingProxy = new Proxy(exposed, {
                  get(target, property, receiver) {
                    return unwrap(Reflect.get(target, property, receiver))
                  },
                  set(target, property, next, receiver) {
                    const current = Reflect.get(target, property, receiver)
                    if (isRef(current) && !isRef(next)) {
                      current.value = next
                      return true
                    }
                    return Reflect.set(target, property, next, receiver)
                  }
                })
              }
              nameScope[xamlName] = exposedBindingProxy
              return
            }
            nameScope[xamlName] = component?.exposeProxy ?? component?.proxy ?? vnode.el ?? undefined
          }
          const previousMounted = props.onVnodeMounted
          const previousUpdated = props.onVnodeUpdated
          const previousBeforeUnmount = props.onVnodeBeforeUnmount
          props.onVnodeMounted = (vnode: VNode) => {
            if (typeof previousMounted === 'function') previousMounted(vnode)
            register(vnode)
          }
          props.onVnodeUpdated = (vnode: VNode) => {
            if (typeof previousUpdated === 'function') previousUpdated(vnode)
            register(vnode)
          }
          props.onVnodeBeforeUnmount = (vnode: VNode) => {
            if (typeof previousBeforeUnmount === 'function') previousBeforeUnmount(vnode)
            delete nameScope[xamlName]
          }
        }
      }
      if (/^x:name$/i.test(name)) delete props[name]
      continue
    }
    if (eventNames.has(name)) {
      const handler = resolveXamlHandler(value, instance)
      if (handler) props[eventProp(name)] = handler
      delete props[name]
      continue
    }
    if (typeof value === 'string' && value.startsWith('{')) {
      const details = bindingDetails(value)
      const resolved = resolveXamlValue(value, instance)
      // Vue component props keep the XAML expression so their computed
      // resolvers remain reactive to page state. Native nodes need the
      // current value, and resources are always materialized as CSS vars.
      // ItemTemplate and GroupHeaderTemplate use StaticResource as an object
      // lookup, not as a CSS brush. Preserve that XAML marker for collection
      // controls so `<GridView ItemTemplate="{StaticResource ImageTemplate}" />`
      // can resolve the actual DataTemplate from Page.Resources.
      const collectionTemplateResource = resourceName(value)
        && (name === 'ItemTemplate' || name === 'GroupHeaderTemplate')
      // Collection property elements are structural markers. Their values
      // are consumed by the owning collection control (for example
      // ItemsStackPanel.AreStickyGroupHeadersEnabled), so keep the original
      // binding expression instead of freezing it to the value seen while
      // the page's VNode tree is normalized. The control resolves it against
      // the live page scope on every computed pass.
      const collectionPropertyNode = Boolean((node.type as { __collectionProperty?: string } | undefined)?.__collectionProperty)
      props[name] = collectionPropertyNode
        ? value
        : typeof node.type === 'string'
          || (resourceName(value) && !collectionTemplateResource)
          || !reactiveComponentNames.has(componentName(node.type))
          ? resolved
          : value
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
