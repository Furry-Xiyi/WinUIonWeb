import { defineComponent, effectScope, watchEffect, type ComponentInternalInstance, type VNode } from 'vue'
import { XamlUICommand, type KeyboardAccelerator } from './XamlUICommand'
import { StandardUICommand, type StandardUICommandKind } from './StandardUICommand'
import { resolveXamlHandler, resolveXamlValue } from './xamlRuntime'

export interface XamlResourceFactoryContext {
  instance: ComponentInternalInstance | null
  Node: () => VNode
  Dispose: (callback: () => void) => void
}

const children = (node: VNode): VNode[] => Array.isArray(node.children)
  ? node.children as VNode[]
  : (node.children as { default?: () => VNode[] } | null)?.default?.() ?? []
const property = (owner: string, name: string) => defineComponent({
  name: `${owner}.${name}`, __uiCommandProperty: name, setup: () => () => null
})

const declaration = (name: 'XamlUICommand' | 'StandardUICommand') => {
  const properties = { IconSource: property(name, 'IconSource'), KeyboardAccelerators: property(name, 'KeyboardAccelerators') }
  return Object.assign(defineComponent({
    name, setup: () => () => null,
    __createXamlResource: (read: (name: string) => unknown, context: XamlResourceFactoryContext) => {
      const command = name === 'StandardUICommand'
        ? new StandardUICommand((read('Kind') ?? 'None') as StandardUICommandKind)
        : new XamlUICommand()
      const scope = effectScope(true)
      context.Dispose(() => scope.stop())
      scope.run(() => watchEffect(() => {
        const node = context.Node()
        const resolve = (value: unknown) => resolveXamlValue(value, context.instance)
        if (command instanceof StandardUICommand && node.props?.Kind !== undefined) command.Kind = read('Kind') as StandardUICommandKind
        for (const key of ['Label', 'Description', 'AccessKey', 'Command'] as const) {
          if (node.props && key in node.props && !Object.is(command[key], read(key))) Object.assign(command, { [key]: read(key) })
        }
        for (const event of ['ExecuteRequested', 'CanExecuteRequested', 'CanExecuteChanged'] as const) {
          const source = node.props?.[event] ?? node.props?.[`on${event}`]
          if (source !== undefined) Object.assign(command, { [event]: resolveXamlHandler(source, context.instance) })
        }
        const declarations = children(node)
        const iconProperty = declarations.find(child => (child.type as { __uiCommandProperty?: string }).__uiCommandProperty === 'IconSource')
        const iconNode = iconProperty && children(iconProperty)[0]
        if (iconNode) {
          const icon = Object.fromEntries(Object.entries(iconNode.props ?? {}).filter(([key]) => !key.startsWith('x:')).map(([key, value]) => [key, resolve(value)]))
          if (JSON.stringify(command.IconSource) !== JSON.stringify(icon)) command.IconSource = icon
        } else if (node.props && 'IconSource' in node.props && !Object.is(command.IconSource, read('IconSource'))) command.IconSource = read('IconSource') as XamlUICommand['IconSource']
        const acceleratorsProperty = declarations.find(child => (child.type as { __uiCommandProperty?: string }).__uiCommandProperty === 'KeyboardAccelerators')
        if (acceleratorsProperty) {
          const accelerators = children(acceleratorsProperty).map(child => Object.fromEntries(Object.entries(child.props ?? {}).filter(([key]) => !key.startsWith('x:')).map(([key, value]) => [key, resolve(value)]))) as unknown as KeyboardAccelerator[]
          if (JSON.stringify(command.KeyboardAccelerators) !== JSON.stringify(accelerators)) command.KeyboardAccelerators.splice(0, command.KeyboardAccelerators.length, ...accelerators)
        } else if (node.props && 'KeyboardAccelerators' in node.props) {
          const accelerators = read('KeyboardAccelerators') as KeyboardAccelerator[]
          if (Array.isArray(accelerators) && JSON.stringify(command.KeyboardAccelerators) !== JSON.stringify(accelerators)) command.KeyboardAccelerators.splice(0, command.KeyboardAccelerators.length, ...accelerators)
        }
      }))
      return command
    }
  }), properties)
}

export const XamlUICommandElement = declaration('XamlUICommand')
export const StandardUICommandElement = declaration('StandardUICommand')
