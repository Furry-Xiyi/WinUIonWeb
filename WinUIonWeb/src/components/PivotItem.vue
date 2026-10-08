<template>
  <div ref="rootRef" v-bind="rootAttrs" class="win-pivot-item" :class="attrs.class" :style="[attrs.style, rootStyle]"
    :aria-disabled="enabled ? undefined : 'true'" :inert="!enabled || !visible" :tabindex="property('IsTabStop') === true ? 0 : -1">
    <div class="win-pivot-item-content-presenter" :style="presenterStyle"><ContentOutlet /></div>
  </div>
</template>

<script lang="ts">
import { pivotItemProperties } from './PivotProperties'
export default { ...pivotItemProperties }
</script>

<script setup lang="ts">
import { computed, defineComponent, getCurrentInstance, inject, ref, shallowReactive, useAttrs, useSlots, watch, type PropType } from 'vue'
import { frameworkLayoutStyle } from './frameworkLayout'
import { alignment, xamlThickness } from './layout'
import { getPivotProperty, pivotItemContextKey, pivotItemIdentityKey, pivotNodes, pivotPropertyChildren, pivotRootAttributes, renderPivotPresenter } from './PivotProperties'
import { resolveXamlValue, updateXamlBinding } from './xamlRuntime'

defineOptions({ name: 'PivotItem', inheritAttrs: false })
const props = defineProps({
  Header: { type: null as unknown as PropType<unknown>, default: null as unknown }, Content: { type: null as unknown as PropType<unknown>, default: null as unknown }, ContentTemplate: { type: null as unknown as PropType<unknown>, default: null as unknown },
  Background: { type: null as unknown as PropType<unknown>, default: '{ThemeResource PivotItemBackground}' as unknown }, Foreground: { type: null as unknown as PropType<unknown>, default: '' as unknown },
  Margin: { type: null as unknown as PropType<unknown>, default: '{ThemeResource PivotItemMargin}' as unknown }, Padding: { type: null as unknown as PropType<unknown>, default: 0 as unknown },
  HorizontalContentAlignment: { type: null as unknown as PropType<unknown>, default: 'Stretch' as unknown }, VerticalContentAlignment: { type: null as unknown as PropType<unknown>, default: 'Stretch' as unknown },
  IsEnabled: { type: null as unknown as PropType<unknown>, default: true as unknown }, IsTabStop: { type: null as unknown as PropType<unknown>, default: false as unknown }, Visibility: { type: null as unknown as PropType<unknown>, default: 'Visible' as unknown },
  Width: { type: null as unknown as PropType<unknown>, default: '' as unknown }, Height: { type: null as unknown as PropType<unknown>, default: '' as unknown }, MinWidth: { type: null as unknown as PropType<unknown>, default: '' as unknown }, MinHeight: { type: null as unknown as PropType<unknown>, default: '' as unknown },
  MaxWidth: { type: null as unknown as PropType<unknown>, default: '' as unknown }, MaxHeight: { type: null as unknown as PropType<unknown>, default: '' as unknown }, HorizontalAlignment: { type: null as unknown as PropType<unknown>, default: 'Stretch' as unknown }, VerticalAlignment: { type: null as unknown as PropType<unknown>, default: 'Stretch' as unknown },
  Opacity: { type: null as unknown as PropType<unknown>, default: 1 as unknown }, IsHitTestVisible: { type: null as unknown as PropType<unknown>, default: true as unknown }, AccessKey: { type: null as unknown as PropType<unknown>, default: '' as unknown }
})
const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
const rootRef = ref<HTMLElement | null>(null)
const owner = inject(pivotItemContextKey, null)
const value = (source: unknown) => resolveXamlValue(source, instance)
const overrides = shallowReactive<Record<string, unknown>>({})
const property = (name: keyof typeof props): unknown => {
  const source = name in overrides ? overrides[name] : props[name]
  return name === 'ContentTemplate' && typeof source === 'string' && /^\{(?:StaticResource|ThemeResource)\s/.test(source) ? source : value(source)
}
const itemKey = () => instance?.vnode.key
const visible = computed(() => !owner || owner.isVisible(itemKey()))
const enabled = computed(() => property('IsEnabled') !== false && (!owner || owner.isEnabled()))
const nodes = computed(() => pivotNodes(slots.default?.() ?? []))
const contentNodes = computed(() => {
  const explicit = pivotPropertyChildren(nodes.value, 'PivotItem', 'content')
  return explicit.length ? explicit : nodes.value.filter(node => !getPivotProperty(node, 'PivotItem'))
})
const ContentOutlet = defineComponent({ setup: () => () => owner && !owner.isLoaded(itemKey()) ? null
  : renderPivotPresenter(property('Content'), 'Content' in overrides ? [] : contentNodes.value, property('ContentTemplate'), pivotPropertyChildren(nodes.value, 'PivotItem', 'contentTemplate'), instance) })
const rootAttrs = computed(() => pivotRootAttributes(attrs, instance))
const rootStyle = computed(() => ({ ...frameworkLayoutStyle({ ...Object.fromEntries(Object.keys(props).map(name => [name, property(name as keyof typeof props)])), Padding: '' }, instance), margin: xamlThickness(property('Margin')), color: property('Foreground') ? String(property('Foreground')) : undefined, display: visible.value && property('Visibility') !== 'Collapsed' ? 'grid' : 'none' }))
const presenterStyle = computed(() => ({ margin: xamlThickness(property('Padding')), justifyItems: alignment(property('HorizontalContentAlignment'), 'horizontal'), alignItems: alignment(property('VerticalContentAlignment'), 'vertical') }))
const publicApi = {
  [pivotItemIdentityKey]: `pivot-item-${instance?.uid}`,
  get ActualWidth() { return rootRef.value?.clientWidth ?? 0 }, get ActualHeight() { return rootRef.value?.clientHeight ?? 0 },
  Focus() { rootRef.value?.focus(); return Boolean(rootRef.value) }, InvokeAccessKey() { owner?.select(itemKey()) }
}
for (const name of Object.keys(props) as (keyof typeof props)[]) {
  Object.defineProperty(publicApi, name, { enumerable: true, configurable: true,
    get: () => name === 'IsEnabled' ? enabled.value : property(name),
    set: next => { overrides[name] = next; updateXamlBinding(props[name], next, instance); owner?.setProperty(itemKey(), name, next) }
  })
  watch(() => value(props[name]), () => { delete overrides[name]; owner?.setProperty(itemKey(), name, undefined) })
}
defineExpose(publicApi)
</script>

<style scoped>
.win-pivot-item { grid-area: 1 / 1; min-width: 0; min-height: 0; box-sizing: border-box; overflow: clip; background: var(--PivotItemBackground, transparent); }
.win-pivot-item-content-presenter { display: grid; min-width: 0; min-height: 0; }
.win-pivot-item-content-presenter > :deep(*) { grid-area: 1 / 1; min-width: 0; max-width: 100%; }
</style>
