<template>
  <Border
    :ref="registerRoot"
    v-bind="$attrs"
    class="win-content-presenter"
    :style="contentStyle">
    <ContentOutlet />
  </Border>
</template>

<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, isVNode, ref, useSlots, type ComponentPublicInstance, type PropType } from 'vue'
import Border from './Border.vue'
import { alignment, applyContentPresenterChildren, useLayoutObserver } from './layout'
import { getVNodeChildren } from './CollectionProperties'
import { normalizeXamlNodes, resolveXamlValue, xamlTemplateComponent } from './xamlRuntime'
import { clampOpacity, cssColor } from './brushCore'

defineOptions({ inheritAttrs: false })

// Border supplies the shared XAML sizing, padding, brush and corner properties.
const props = defineProps({
  Content: { type: null as unknown as PropType<unknown>, default: '' as unknown },
  ContentTemplate: { type: null as unknown as PropType<unknown>, default: undefined as unknown },
  ContentTransitions: { type: null as unknown as PropType<unknown>, default: undefined as unknown },
  Foreground: { type: [String, Object], default: '' },
  HorizontalContentAlignment: { type: String, default: 'Stretch' },
  VerticalContentAlignment: { type: String, default: 'Stretch' }
})

const instance = getCurrentInstance()
const slots = useSlots()
const root = ref<HTMLElement | null>(null)
const registerRoot = (value: Element | ComponentPublicInstance | null) => {
  if (value instanceof HTMLElement) root.value = value
  else {
    const component = value as { Element?: HTMLElement; $el?: HTMLElement } | null
    root.value = component?.Element ?? component?.$el ?? null
  }
}
useLayoutObserver(root, () => {
  if (root.value) applyContentPresenterChildren(root.value, resolveXamlValue(props.HorizontalContentAlignment, instance), resolveXamlValue(props.VerticalContentAlignment, instance))
})
const resolvedContent = computed(() => resolveXamlValue(props.Content, instance))
const resolvedTemplate = computed(() => resolveXamlValue(props.ContentTemplate, instance))
const foreground = computed(() => {
  const value = resolveXamlValue(props.Foreground, instance)
  if (!value) return undefined
  if (typeof value === 'object' && 'Color' in value) {
    const color = cssColor(value.Color)
    const opacity = 'Opacity' in value ? value.Opacity : undefined
    return opacity === undefined || opacity === 1 ? color
      : `color-mix(in srgb, ${color} ${clampOpacity(opacity) * 100}%, transparent)`
  }
  return cssColor(value)
})
const ContentOutlet = defineComponent({ setup: () => () => {
  if (slots.default) return h(Fragment, normalizeXamlNodes(slots.default(), instance))
  const template = resolvedTemplate.value
  if (isVNode(template)) {
    const type = template.type as { name?: string; __name?: string }
    return xamlTemplateComponent((type?.name ?? type?.__name) === 'DataTemplate' ? getVNodeChildren(template) : [template], resolvedContent.value, instance)
  }
  if (typeof template === 'function') return template(resolvedContent.value)
  const content = resolvedContent.value
  return isVNode(content) ? h(Fragment, normalizeXamlNodes([content], instance))
    : typeof content === 'string' || typeof content === 'number' ? String(content) : null
} })
const contentStyle = computed(() => ({
  color: foreground.value,
  justifyItems: alignment(resolveXamlValue(props.HorizontalContentAlignment, instance), 'horizontal'),
  alignItems: alignment(resolveXamlValue(props.VerticalContentAlignment, instance), 'vertical')
}))
</script>

<style scoped>
.win-content-presenter {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  color: inherit;
}
.win-content-presenter :deep(.win-text-block) { color: inherit; }
</style>
