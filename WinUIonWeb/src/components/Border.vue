<template>
  <div ref="root" v-bind="attrs" class="win-border" :class="{ 'has-theme-shadow': hasThemeShadow }" v-acrylic-brush="resolveBorderStyle()" v-radial-gradient-brush="backgroundBrush.value.value" :style="[attrs.style, resolveBorderStyle()]">
    <ShadowOutlet />
    <div v-if="hasThemeShadow" class="win-theme-shadow-visual" aria-hidden="true" :style="shadowVisualStyle" />
    <div v-if="hasThemeShadow" class="win-border-content"><ChildOutlet /></div>
    <ChildOutlet v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { brushProperty } from './brushProperties'
export const BorderChild = defineComponent({ name: 'Border.Child', __borderChildProperty: true, setup() { return () => null } })
export const BorderResources = defineComponent({ name: 'Border.Resources', __xamlResourceProperty: 'resources', setup() { return () => null } })
export const BorderShadow = defineComponent({ name: 'Border.Shadow', __borderShadowProperty: true, setup() { return () => null } })
export default { Child: BorderChild, Resources: BorderResources, Background: brushProperty('Border', 'Background'), Shadow: BorderShadow }
</script>

<script setup lang="ts">
import { cloneVNode, Comment, computed, defineComponent, Fragment, getCurrentInstance, h, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, Text, unref, useAttrs, useSlots, watch, type VNode } from 'vue'
import { frameworkLayoutStyle } from './frameworkLayout'
import { normalizeXamlNodes, resolveXamlValue, updateXamlBinding } from './xamlRuntime'
import { xamlThemeKey } from './brushCore'
import { xamlResourceDictionaryKey } from './Page.vue'
import { isBrushProperty, useBrushProperty } from './brushProperties'
import { vAcrylicBrush } from './acrylicBrushVisual'
import { collectXamlResources, useXamlBrushResources } from './xamlBrushResources'
import { vRadialGradientBrush } from './RadialGradientVisual'
import { getThemeShadowRecipe, isThemeShadow, shadowCornerRadius, themeShadowVisualStyle } from './themeShadowRuntime'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  Background: { type: [String, Object], default: '' }, BackgroundSizing: { type: String, default: 'InnerBorderEdge' },
  BorderBrush: { type: [String, Object], default: '' }, BorderThickness: { type: [String, Number], default: 0 },
  CornerRadius: { type: [String, Number], default: 0 }, Padding: { type: [String, Number], default: 0 },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: 0 }, MinHeight: { type: [String, Number], default: 0 },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: 0 },
  HorizontalAlignment: { type: String, default: 'Stretch' }, VerticalAlignment: { type: String, default: 'Stretch' },
  Visibility: { type: String, default: 'Visible' }, IsHitTestVisible: { type: [String, Boolean], default: true },
  Opacity: { type: [String, Number], default: 1 },
  Translation: { type: [String, Object], default: () => ({ X: 0, Y: 0, Z: 0 }) },
  Shadow: { type: [String, Object], default: null }
})
const emit = defineEmits(['Loaded', 'update:Translation', 'update:Shadow'])
const attrs = useAttrs()
const slots = useSlots()
const instance = getCurrentInstance()
const root = ref<HTMLElement>()
const currentTranslation = ref(resolveXamlValue(props.Translation, instance))
watch(() => resolveXamlValue(props.Translation, instance), value => { currentTranslation.value = value })
const Translation = computed({ get: () => currentTranslation.value, set: value => {
  currentTranslation.value = value
  updateXamlBinding(props.Translation, value, instance)
  emit('update:Translation', value)
} })
const shadow = shallowRef<unknown>()
const Shadow = computed({
  get: () => shadow.value === undefined ? resolveXamlValue(props.Shadow, instance) : shadow.value,
  set: value => { shadow.value = value; updateXamlBinding(props.Shadow, value, instance); emit('update:Shadow', value) }
})
const theme = inject(xamlThemeKey, null) ?? inject('winuiTheme', null)
const Element = computed(() => root.value)
const hasThemeShadow = computed(() => isThemeShadow(Shadow.value) && !Shadow.value.IsDisposed)
let detachCaster: (() => void) | undefined
watch([Shadow, root], ([value, element]) => {
  detachCaster?.(); detachCaster = undefined
  if (element && isThemeShadow(value) && !value.IsDisposed) detachCaster = value.AttachCaster(element)
}, { flush: 'post' })
onBeforeUnmount(() => detachCaster?.())
defineExpose({ Translation, Shadow, Element })
onMounted(async () => { await nextTick(); emit('Loaded', instance?.exposeProxy ?? instance?.proxy, { OriginalSource: root.value }) })
const inheritedResources = inject<Record<string, VNode>>(xamlResourceDictionaryKey, {})
const collectResources = () => {
  const dictionary: Record<string, VNode> = {}
  const visit = (nodes: VNode[]) => {
    for (const node of nodes) {
      if (node.type === Fragment && Array.isArray(node.children)) visit(node.children as VNode[])
      else collectXamlResources([node], dictionary)
    }
  }
  for (const node of slots.default?.() ?? []) {
    if ((node.type as { __xamlResourceProperty?: string })?.__xamlResourceProperty) {
      visit((node.children as { default?: () => VNode[] })?.default?.() ?? [])
    }
  }
  return dictionary
}
const resourceNodes = computed(collectResources)
provide(xamlResourceDictionaryKey, new Proxy(inheritedResources, {
  get: (dictionary, key: string) => resourceNodes.value[key] ?? dictionary[key]
}))
const brushResources = useXamlBrushResources(instance)
const backgroundBrush = useBrushProperty('Background', () => props.Background, () => slots.default?.() ?? [], instance)
const shadowStyle = computed(() => {
  const vector = Translation.value
  const coordinates = typeof vector === 'string' ? vector.split(',').map(Number) : [vector?.X ?? 0, vector?.Y ?? 0, vector?.Z ?? 0]
  return {
    transform: Number(coordinates[0]) || Number(coordinates[1]) ? `translate(${Number(coordinates[0]) || 0}px, ${Number(coordinates[1]) || 0}px)` : undefined
  }
})
const inheritedCornerRadius = ref(0)
const measureCornerRadius = () => {
  let element = root.value
  while (element) {
    const style = getComputedStyle(element)
    const radius = Math.max(...['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'].map(key => Number.parseFloat(style[key as keyof CSSStyleDeclaration] as string) || 0))
    if (radius > 0) { inheritedCornerRadius.value = radius; return }
    element = element.parentElement ?? undefined
  }
  inheritedCornerRadius.value = 0
}
onMounted(measureCornerRadius)
watch([() => resolveXamlValue(props.CornerRadius, instance), () => unref(theme)], () => { void nextTick(measureCornerRadius) })
const shadowVisualStyle = computed(() => {
  const vector = Translation.value
  const z = typeof vector === 'string' ? vector.split(',')[2] : vector?.Z ?? 0
  const radius = shadowCornerRadius(resolveXamlValue(props.CornerRadius, instance)) || inheritedCornerRadius.value
  return themeShadowVisualStyle(getThemeShadowRecipe(z, unref(theme)), radius)
})
const borderStyle = computed(() => ({ ...frameworkLayoutStyle(props, instance), ...backgroundBrush.style.value, ...shadowStyle.value }))
const resolveBorderStyle = () => {
  brushResources.sync(collectResources())
  return borderStyle.value
}
const ShadowOutlet = defineComponent({
  setup() { return () => {
    const property = (slots.default?.() ?? []).find(node => (node.type as { __borderShadowProperty?: boolean })?.__borderShadowProperty)
    const children = property ? (property.children as { default?: () => VNode[] })?.default?.() ?? [] : []
    return h(Fragment, normalizeXamlNodes(children, instance).map(node => cloneVNode(node, { ref: (value: unknown) => { shadow.value = value } }, true)))
  } }
})
const ChildOutlet = defineComponent({
  setup() {
    return () => {
      const children: VNode[] = []
      const collect = (nodes: VNode[]) => {
        for (const node of nodes) {
          if (node.type === Comment || (node.type === Text && !String(node.children ?? '').trim())) continue
          if ((node.type as { __xamlResourceProperty?: string })?.__xamlResourceProperty) continue
          if ((node.type as { __borderShadowProperty?: boolean })?.__borderShadowProperty) continue
          if (isBrushProperty(node)) continue
          if (node.type === Fragment && Array.isArray(node.children)) collect(node.children as VNode[])
          else if ((node.type as { __borderChildProperty?: boolean })?.__borderChildProperty) {
            collect((node.children as { default?: () => VNode[] })?.default?.() ?? [])
          } else children.push(node)
        }
      }
      collect(slots.default?.() ?? [])
      if (children.length > 1) throw new Error('Border.Child must contain a single UIElement.')
      return children.length ? normalizeXamlNodes(children, instance)[0] : null
    }
  }
})
</script>

<style>
.win-border {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  border: 0 solid transparent;
  overflow: hidden;
}
.win-border.has-theme-shadow { position: relative; overflow: visible; }
.win-border.has-theme-shadow > .win-border-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border-radius: inherit;
}
@media (forced-colors: active) {
  .win-theme-shadow-visual { display: none !important; }
}
</style>
