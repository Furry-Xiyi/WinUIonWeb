<template>
  <span ref="Element" v-bind="rootAttrs" class="win-icon-element win-font-icon" :class="attrs.class" :style="[attrs.style, layoutStyle]">
    <Grid class="win-icon-grid" data-icon-part="LayoutRoot" Background="Transparent">
      <TextBlock class="win-icon-text-block win-font-icon-glyph" data-icon-part="TextBlock"
        Style="{x:Null}" Text="{x:Bind FontIconTemplateGlyph, Mode=OneWay}" FontFamily="{x:Bind FontIconTemplateFontFamily, Mode=OneWay}"
        FontSize="{x:Bind FontIconTemplateFontSize, Mode=OneWay}" FontStyle="{x:Bind FontIconTemplateFontStyle, Mode=OneWay}" FontWeight="{x:Bind FontIconTemplateFontWeight, Mode=OneWay}"
        HorizontalAlignment="Stretch" VerticalAlignment="Center"
        TextAlignment="Center" IsTextScaleFactorEnabled="False" AutomationProperties.AccessibilityView="Raw"
        aria-hidden="true" />
    </Grid>
  </span>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, provide, useAttrs, watch } from 'vue'
import { cssLength } from './layout'
import { iconBoolean, iconElementProps, iconFontFamily, iconFontWeight, useIconElement } from './iconElementRuntime'
import Grid from './Grid.vue'
import TextBlock from './TextBlock.vue'
import { xamlScopeKey } from './xamlRuntime'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  Glyph: { type: [String, Number], default: '' },
  FontFamily: { type: String, default: 'Segoe Fluent Icons,Segoe MDL2 Assets' },
  FontSize: { type: [String, Number], default: 20 },
  FontStyle: { type: String, default: 'Normal' },
  FontWeight: { type: [String, Number], default: 'Normal' },
  IsTextScaleFactorEnabled: { type: [Boolean, String], default: true },
  MirroredWhenRightToLeft: { type: [Boolean, String], default: false },
  ...iconElementProps
})

const attrs = useAttrs()
const instance = getCurrentInstance()
const { Element, read, layoutStyle, rootAttrs, api } = useIconElement(props, attrs, instance,
  ['Glyph', 'FontFamily', 'FontSize', 'FontStyle', 'FontWeight', 'IsTextScaleFactorEnabled', 'MirroredWhenRightToLeft'])
defineExpose(api)
const glyph = computed(() => {
  const value = read('Glyph')
  return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
})
let directionObserver: MutationObserver | null = null
const updateDirection = () => {
  const element = Element.value
  const glyphElement = element?.querySelector<HTMLElement>('.win-font-icon-glyph')
  if (!element || !glyphElement) return
  glyphElement.style.transform = iconBoolean(read('MirroredWhenRightToLeft')) && getComputedStyle(element).direction === 'rtl' ? 'scaleX(-1)' : ''
}
const observeDirection = () => {
  directionObserver?.disconnect()
  directionObserver = null
  updateDirection()
  if (!iconBoolean(read('MirroredWhenRightToLeft')) || !Element.value) return
  directionObserver = new MutationObserver(updateDirection)
  for (let ancestor: HTMLElement | null = Element.value; ancestor; ancestor = ancestor.parentElement) {
    directionObserver.observe(ancestor, { attributes: true, attributeFilter: ['dir', 'style', 'class', 'FlowDirection'] })
  }
}
watch(() => [read('FlowDirection'), read('MirroredWhenRightToLeft')], () => { void nextTick(observeDirection) })
onMounted(observeDirection)
onBeforeUnmount(() => directionObserver?.disconnect())
provide(xamlScopeKey, {
  FontIconTemplateGlyph: glyph,
  FontIconTemplateFontFamily: computed(() => iconFontFamily(read('FontFamily'))),
  FontIconTemplateFontSize: computed(() => iconBoolean(read('IsTextScaleFactorEnabled'), true)
    ? `calc(${cssLength(read('FontSize')) || '20px'} * var(--TextScaleFactor, 1))` : read('FontSize')),
  FontIconTemplateFontStyle: computed(() => read('FontStyle')),
  FontIconTemplateFontWeight: computed(() => iconFontWeight(read('FontWeight')))
})
</script>
