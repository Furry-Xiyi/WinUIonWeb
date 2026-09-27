import { computed, defineComponent, h, provide, ref, type PropType } from 'vue'
import ToolTip from './ToolTip.vue'
import { toolTipOwnerContextKey, type ToolTipInputMode, type ToolTipPoint } from './toolTipRuntime'

/** ToolTipService.SetToolTip for native hosts in TabView's control template. */
export const TabViewTemplateToolTip = defineComponent({
  name: 'TabViewTemplateToolTip',
  props: {
    Owner: { type: Object as PropType<HTMLElement | null>, default: null },
    Content: { type: String, default: '' },
    Placement: { type: String, default: 'Top' },
    IsEnabled: { type: Boolean, default: true }
  },
  setup(props) {
    const owner = computed(() => props.Owner)
    const inputMode = ref<ToolTipInputMode>('none')
    const point = ref<ToolTipPoint | null>(null)
    const theme = ref('')
    provide(toolTipOwnerContextKey, { owner, inputMode, point, theme, attached: true })
    return () => h(ToolTip, {
      Content: props.Content,
      Placement: props.Placement,
      PlacementTarget: props.Owner,
      IsEnabled: props.IsEnabled && props.Content.length > 0
    })
  }
})
