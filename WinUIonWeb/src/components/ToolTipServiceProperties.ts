import { computed, defineComponent, h, type VNode } from 'vue'

export const ToolTipServiceToolTip = defineComponent({
  name: 'ToolTipService.ToolTip',
  __toolTipServiceProperty: true,
  setup(_, { slots }) {
    const tooltip = computed(() => (slots.default?.() ?? [])[0] as VNode | undefined)
    return () => {
      const props = (tooltip.value?.props ?? {}) as Record<string, unknown>
      const content = props.Content ?? props.content ?? ''
      const placement = props.Placement ?? props.placement
      const placementRect = props.PlacementRect ?? props.placementRect
      return h('span', {
        class: 'tooltip-service-property',
        'tooltipservice.tooltip': content,
        ...(placement ? { 'tooltipservice.placement': placement } : {}),
        ...(placementRect ? { 'tooltipservice.placementrect': placementRect } : {})
      })
    }
  }
})

export const getToolTipServiceProperty = (node: VNode) => {
  const type = node.type as { __toolTipServiceProperty?: boolean } | undefined
  return Boolean(type?.__toolTipServiceProperty)
}
