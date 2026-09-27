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
import { computed, defineComponent, Fragment, getCurrentInstance, h, isVNode, ref, useSlots } from 'vue'
import Border from './Border.vue'
import { alignment, applyContentPresenterChildren, useLayoutObserver } from './layout'
import { getVNodeChildren } from './CollectionProperties'
import { normalizeXamlNodes, resolveXamlValue, xamlTemplateComponent } from './xamlRuntime'
import { clampOpacity, cssColor } from './brushCore'

defineOptions({ inheritAttrs: false })

// Border supplies the shared XAML sizing, padding, brush and corner properties.
const props = defineProps({
  Content: { type: null, default: '' },
  ContentTemplate: { type: null, default: undefined },
  ContentTransitions: { type: null, default: undefined },
  Foreground: { type: [String, Object], default: '' },
  HorizontalContentAlignment: { type: String, default: 'Stretch' },
  VerticalContentAlignment: { type: String, default: 'Stretch' }
})

const instance = getCurrentInstance()
const slots = useSlots()
const root = ref<HTMLElement | null>(null)
const registerRoot = (value: { Element?: HTMLElement; $el?: HTMLElement } | null) => { root.value = value?.Element ?? value?.$el ?? null }
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
    return value.Opacity === undefined || value.Opacity === 1 ? color
      : `color-mix(in srgb, ${color} ${clampOpacity(value.Opacity) * 100}%, transparent)`
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
