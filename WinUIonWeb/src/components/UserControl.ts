import {
  computed, defineComponent, Fragment, getCurrentInstance, h, inject, isRef,
  onBeforeUnmount, provide, ref, shallowReactive, type VNode
} from 'vue'
import { frameworkLayoutStyle } from './frameworkLayout'
import {
  normalizeXamlNodes, resolveXamlHandler, resolveXamlValue,
  xamlControlIdentityKey, xamlItemContextKey, xamlNameScopeKey
} from './xamlRuntime'

const childrenOf = (node: VNode): VNode[] => Array.isArray(node.children)
  ? node.children as VNode[]
  : (node.children as { default?: () => VNode[] } | null)?.default?.() ?? []

const typeName = (node: VNode) => typeof node.type === 'string'
  ? node.type
  : (node.type as { name?: string; __name?: string }).name ?? (node.type as { __name?: string }).__name ?? ''

const Content = defineComponent({ name: 'UserControl.Content', setup: () => () => null })

export default Object.assign(defineComponent({
  name: 'UserControl',
  inheritAttrs: false,
  props: {
    Content: { default: undefined }, DataContext: { default: undefined },
    Width: { default: undefined }, Height: { default: undefined },
    MinWidth: { default: undefined }, MinHeight: { default: undefined },
    MaxWidth: { default: undefined }, MaxHeight: { default: undefined },
    Margin: { default: undefined }, Padding: { default: undefined },
    HorizontalAlignment: { default: 'Stretch' }, VerticalAlignment: { default: 'Stretch' },
    Visibility: { default: 'Visible' }, Background: { default: undefined }
  },
  emits: ['PointerEntered', 'PointerExited'],
  setup(props, { attrs, slots, emit, expose }) {
    const instance = getCurrentInstance()
    const element = ref<HTMLElement>()
    const names = shallowReactive<Record<string, unknown>>({})
    provide(xamlNameScopeKey, names)
    const inheritedItem = inject(xamlItemContextKey, undefined)
    const dataContext = computed(() => resolveXamlValue(props.DataContext, instance) ?? (isRef(inheritedItem) ? inheritedItem.value : inheritedItem))
    provide(xamlItemContextKey, dataContext)
    const originalValues = new Map<string, unknown>()

    let stateSetters = new Map<string, VNode[]>()
    const readStates = (content: VNode[]) => {
      const states = new Map<string, VNode[]>()
      const visit = (nodes: VNode[]) => {
        for (const node of nodes) {
          if (!node || typeof node !== 'object') continue
          if (typeName(node) === 'VisualState') {
            const name = String(node.props?.['x:Name'] ?? '')
            const setters: VNode[] = []
            const collect = (children: VNode[]) => children.forEach(child => {
              if (typeName(child) === 'Setter') setters.push(child)
              else collect(childrenOf(child))
            })
            collect(childrenOf(node))
            if (name) states.set(name, setters)
          } else visit(childrenOf(node))
        }
      }
      visit(content)
      return states
    }
    const propertyTarget = (target: string) => {
      const [name, ...path] = target.split('.')
      let owner = names[name] as Record<string, unknown> | undefined
      for (const member of path.slice(0, -1)) {
        const value = owner?.[member]
        owner = (isRef(value) ? value.value : value) as Record<string, unknown> | undefined
      }
      return owner && path.length ? { owner, property: path[path.length - 1] } : undefined
    }
    const setProperty = (target: string, value: unknown) => {
      const destination = propertyTarget(target)
      if (!destination) return
      const current = destination.owner[destination.property]
      if (isRef(current)) current.value = value
      else destination.owner[destination.property] = value
    }
    const restoreState = () => {
      originalValues.forEach((value, target) => setProperty(target, value))
      originalValues.clear()
    }
    const sender = {
      [xamlControlIdentityKey]: true,
      get Element() { return element.value },
      get $el() { return element.value },
      get DataContext() { return dataContext.value },
      GoToState(stateName: string, _useTransitions = true) {
        const setters = stateSetters.get(stateName)
        if (!setters) return false
        restoreState()
        setters.forEach(setter => {
          const target = String(setter.props?.Target ?? '')
          const destination = propertyTarget(target)
          if (!destination) return
          const current = destination.owner[destination.property]
          originalValues.set(target, isRef(current) ? current.value : current)
          setProperty(target, resolveXamlValue(setter.props?.Value, instance))
        })
        return true
      }
    }
    expose(sender)
    onBeforeUnmount(restoreState)

    const pointerEvent = (name: 'PointerEntered' | 'PointerExited', event: PointerEvent) => {
      const args = {
        OriginalSource: sender, OriginalEvent: event, Handled: false,
        Pointer: {
          PointerId: event.pointerId,
          PointerDeviceType: event.pointerType === 'touch' ? 'Touch' : event.pointerType === 'pen' ? 'Pen' : 'Mouse',
          IsInContact: event.buttons !== 0
        }
      }
      emit(name, sender, args)
      if (attrs[name] !== undefined && !instance?.vnode.props?.[`on${name}`]) {
        resolveXamlHandler(attrs[name], instance)?.(sender, args)
      }
      if (args.Handled) { event.preventDefault(); event.stopPropagation() }
    }
    return () => {
      let content = slots.default?.() ?? []
      stateSetters = readStates(content)
      const property = content.find(node => typeName(node) === 'UserControl.Content')
      if (property) content = childrenOf(property)
      else if (props.Content !== undefined) {
        const value = resolveXamlValue(props.Content, instance)
        content = Array.isArray(value) ? value as VNode[] : [h(Fragment, String(value ?? ''))]
      }
      return h('div', {
        class: ['win-user-control', attrs.class],
        'data-xaml-ref': attrs['data-xaml-ref'] ?? attrs['x:Name'],
        ref: element,
        style: { display: 'grid', width: '100%', height: '100%', minWidth: 0, minHeight: 0, overflow: 'hidden', ...frameworkLayoutStyle(props, instance) },
        onPointerenter: (event: PointerEvent) => pointerEvent('PointerEntered', event),
        onPointerleave: (event: PointerEvent) => pointerEvent('PointerExited', event)
      }, normalizeXamlNodes(content, instance))
    }
  }
}), { Content })
