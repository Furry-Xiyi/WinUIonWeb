<template>
  <div ref="root" class="win-ellipse" v-acrylic-brush="ellipseStyle" :class="attrs.class" :style="ellipseStyle" v-bind="forwardedAttrs">
    <Image
      v-if="imageBrush"
      class="win-ellipse-image-fill"
      Source="{x:Bind EllipseFill.Source, Mode=OneWay}"
      Stretch="{x:Bind EllipseFill.Stretch, Mode=OneWay}"
      Width="{x:Bind EllipseFill.Width, Mode=OneWay}"
      Height="{x:Bind EllipseFill.Height, Mode=OneWay}"
      IsHitTestVisible="False"
      AutomationProperties.AccessibilityView="Raw"
      aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, provide, reactive, ref, useAttrs, watch, type CSSProperties } from 'vue'
import Image from './Image.vue'
import { alignment, cssLength, xamlThickness } from './layout'
import { resolveXamlResourceObject, resolveXamlValue, xamlScopeKey } from './xamlRuntime'
import { resolveBrushStyle } from './AcrylicBrush'
import { vAcrylicBrush } from './acrylicBrushVisual'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  Fill: { type: [String, Object], default: '' },
  Stroke: { type: [String, Object], default: '' },
  StrokeThickness: { type: [String, Number], default: '' },
  StrokeDashArray: { type: [String, Array], default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' },
  Opacity: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' },
  Visibility: { type: String, default: 'Visible' }
})
const attrs = useAttrs()
const instance = getCurrentInstance()
const root = ref<HTMLElement | null>(null)
const fill = computed(() => {
  const resourceKey = typeof props.Fill === 'string'
    ? props.Fill.match(/^\{(?:StaticResource|ThemeResource)\s+([^\s}]+)\}$/)?.[1]
    : undefined
  return resourceKey && resolveXamlResourceObject(resourceKey, instance) !== undefined
    ? resolveXamlResourceObject(resourceKey, instance)
    : resolveXamlValue(props.Fill, instance)
})
const imageBrush = computed(() => fill.value && typeof fill.value === 'object' && 'ImageSource' in fill.value
  ? fill.value as { ImageSource: unknown; Stretch?: unknown }
  : null)
const fillSize = ref<{ width: number; height: number } | null>(null)
const stroke = computed(() => resolveXamlValue(props.Stroke, instance))
const numericDimension = (input: unknown) => {
  const resolved = resolveXamlValue(input, instance)
  const number = Number(resolved)
  return Number.isFinite(number) && number >= 0 ? number : 0
}
const strokeInset = computed(() => {
  if (!stroke.value) return 0
  const input = resolveXamlValue(props.StrokeThickness, instance)
  return input === '' || input === null || input === undefined ? 1 : numericDimension(input)
})
const EllipseFill = reactive({
  Source: computed(() => resolveXamlValue(imageBrush.value?.ImageSource, instance)),
  Stretch: computed(() => {
    const candidate = String(resolveXamlValue(imageBrush.value?.Stretch, instance) ?? 'Fill')
    return ['None', 'Fill', 'Uniform', 'UniformToFill'].includes(candidate) ? candidate : 'Fill'
  }),
  Width: computed(() => fillSize.value?.width
    ?? Math.max(0, numericDimension(props.Width) - 2 * strokeInset.value)),
  Height: computed(() => fillSize.value?.height
    ?? Math.max(0, numericDimension(props.Height) - 2 * strokeInset.value))
})
provide(xamlScopeKey, { EllipseFill })
let observer: ResizeObserver | null = null
function measureFill() {
  const element = root.value
  if (!element) return
  const computedStyle = getComputedStyle(element)
  const inset = (name: string) => Number.parseFloat(computedStyle.getPropertyValue(name)) || 0
  // An ImageBrush never contributes its source dimensions to Shape's measure.
  // Image receives the arranged fill region after the shape's stroke insets.
  const width = Math.max(0, (Number.parseFloat(computedStyle.width) || element.clientWidth)
    - inset('border-left-width') - inset('border-right-width'))
  const height = Math.max(0, (Number.parseFloat(computedStyle.height) || element.clientHeight)
    - inset('border-top-width') - inset('border-bottom-width'))
  if (fillSize.value?.width !== width || fillSize.value?.height !== height) fillSize.value = { width, height }
}
watch(() => [props.Width, props.Height, props.Stroke, props.StrokeThickness].map(input => resolveXamlValue(input, instance)), measureFill, { flush: 'post' })
onMounted(() => {
  measureFill()
  if (typeof ResizeObserver !== 'undefined' && root.value) {
    observer = new ResizeObserver(measureFill)
    observer.observe(root.value)
  }
})
onBeforeUnmount(() => observer?.disconnect())
const forwardedAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
const ellipseStyle = computed(() => {
  const strokeThickness = cssLength(resolveXamlValue(props.StrokeThickness, instance))
  const color = imageBrush.value ? undefined
    : fill.value && typeof fill.value === 'object' && 'Color' in fill.value
      ? resolveXamlValue(fill.value.Color, instance)
      : fill.value
  const strokeColor = stroke.value && typeof stroke.value === 'object' && 'Color' in stroke.value
    ? resolveXamlValue(stroke.value.Color, instance)
    : stroke.value
  const style: CSSProperties = {
    width: cssLength(resolveXamlValue(props.Width, instance)) || undefined,
    height: cssLength(resolveXamlValue(props.Height, instance)) || undefined,
    minWidth: cssLength(resolveXamlValue(props.MinWidth, instance)) || undefined,
    minHeight: cssLength(resolveXamlValue(props.MinHeight, instance)) || undefined,
    maxWidth: cssLength(resolveXamlValue(props.MaxWidth, instance)) || undefined,
    maxHeight: cssLength(resolveXamlValue(props.MaxHeight, instance)) || undefined,
    margin: xamlThickness(resolveXamlValue(props.Margin, instance)) || undefined,
    ...resolveBrushStyle(fill.value, instance),
    boxSizing: 'border-box',
    borderRadius: '50%'
  }
  if (strokeColor) {
    style.borderStyle = 'solid'
    style.borderColor = String(strokeColor)
    style.borderWidth = strokeThickness || '1px'
  }
  if (props.Opacity !== '') style.opacity = String(resolveXamlValue(props.Opacity, instance))
  if (props.HorizontalAlignment) style.justifySelf = alignment(props.HorizontalAlignment, 'horizontal')
  if (props.VerticalAlignment) style.alignSelf = alignment(props.VerticalAlignment, 'vertical')
  const visibility = resolveXamlValue(props.Visibility, instance) ?? props.Visibility
  if (visibility === 'Collapsed') style.display = 'none'
  else if (visibility === 'Hidden') style.visibility = 'hidden'
  return [attrs.style, style]
})
</script>

<style scoped>
.win-ellipse { display: block; position: relative; overflow: hidden; box-sizing: border-box; min-width: 0; min-height: 0; flex: 0 0 auto; }
.win-ellipse-image-fill { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; }
</style>
