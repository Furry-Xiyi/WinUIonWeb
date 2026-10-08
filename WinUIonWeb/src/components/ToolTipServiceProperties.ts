import { defineComponent, Fragment, getCurrentInstance, h, onMounted, onUpdated, provide, ref, shallowRef, type VNode } from 'vue'
import { toolTipOwnerContextKey, type ToolTipInputMode, type ToolTipPoint } from './toolTipRuntime'

export const ToolTipServiceToolTip = defineComponent({
  name: 'ToolTipService.ToolTip', __toolTipServiceProperty: true,
  setup(_, { slots }) {
    const instance = getCurrentInstance()
    const owner = shallowRef<HTMLElement | null>(null)
    const inputMode = ref<ToolTipInputMode>('none'), point = ref<ToolTipPoint | null>(null), theme = ref('')
    provide(toolTipOwnerContextKey, { owner, inputMode, point, theme, attached: true })
    const findOwner = () => {
      let parent = instance?.parent
      while (parent) {
        const root = parent.subTree
        const element = parent.vnode.el instanceof HTMLElement ? parent.vnode.el
          : Array.isArray(root?.children) ? (root.children.find(child => child && typeof child === 'object' && 'el' in child && child.el instanceof HTMLElement) as VNode | undefined)?.el
            : undefined
        if (element instanceof HTMLElement) { owner.value = element; return }
        parent = parent.parent
      }
    }
    onMounted(findOwner); onUpdated(findOwner)
    return () => h(Fragment, slots.default?.())
  }
})
export const getToolTipServiceProperty = (node: VNode) => Boolean((node.type as { __toolTipServiceProperty?: boolean } | undefined)?.__toolTipServiceProperty)
export const ToolTipContent = defineComponent({
  name: 'ToolTip.Content', __toolTipContentProperty: true,
  setup(_, { slots }) { return () => h(Fragment, slots.default?.()) }
})
export const isToolTipContentProperty = (node: VNode) => Boolean((node.type as { __toolTipContentProperty?: boolean } | undefined)?.__toolTipContentProperty)
const property = (name: string) => defineComponent({
  name: `ToolTip.${name}`, __toolTipProperty: name,
  setup(_, { slots }) { return () => h(Fragment, slots.default?.()) }
})
export const ToolTipContentTemplate = property('ContentTemplate')
export const ToolTipContentTransitions = property('ContentTransitions')
