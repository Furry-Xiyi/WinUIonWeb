<template>
  <div ref="rootRef" class="win-refresh-container" :class="{ 'is-refreshing': isRefreshing }" :style="rootStyle"
    @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerUp" @pointercancel="onPointerCancel">
    <div class="refresh-container-root" :style="contentStyle"><ContentOutlet /></div>
    <div class="refresh-visualizer-presenter" :style="presenterStyle" aria-hidden="true">
      <VisualizerOutlet v-if="visualizerOutlet" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue'
export const RefreshContainerVisualizer = defineComponent({
  name: 'RefreshContainer.Visualizer',
  __refreshContainerProperty: 'visualizer',
  setup() { return () => null }
})
export const RefreshContainerContent = defineComponent({
  name: 'RefreshContainer.Content',
  __refreshContainerProperty: 'content',
  setup() { return () => null }
})
export default { Visualizer: RefreshContainerVisualizer, Content: RefreshContainerContent }
</script>

<script setup lang="ts">
import { cloneVNode, computed, defineComponent, getCurrentInstance, h, ref, useAttrs, useSlots } from 'vue'
import type { Component, VNode } from 'vue'
import { resolveXamlHandler, resolveXamlValue } from './xamlRuntime'

type RefreshState = 'Idle' | 'Peeking' | 'Interacting' | 'Pending' | 'Refreshing'
type Deferral = { Complete: () => void }
type RefreshRequestedEventArgs = { GetDeferral: () => Deferral }

const props = defineProps<{
  Visualizer?: unknown
  PullDirection?: 'TopToBottom' | 'BottomToTop' | 'LeftToRight' | 'RightToLeft'
  IsEnabled?: boolean | string
  Width?: string | number; Height?: string | number
  MinWidth?: string | number; MinHeight?: string | number
  MaxWidth?: string | number; MaxHeight?: string | number
  Margin?: string | number; Padding?: string | number; Background?: string
}>()
const emit = defineEmits<{ RefreshRequested: [args: RefreshRequestedEventArgs]; refreshRequested: [args: RefreshRequestedEventArgs] }>()
const attrs = useAttrs(); const slots = useSlots(); const instance = getCurrentInstance()
const directChildren = (node: VNode) => {
  if (Array.isArray(node.children)) return node.children as VNode[]
  const children = node.children as { default?: () => VNode[] } | null
  return typeof children?.default === 'function' ? children.default() : []
}
const rootRef = ref<HTMLElement | null>(null); const refreshState = ref<RefreshState>('Idle')
const isRefreshing = ref(false); const pointerId = ref<number | null>(null)
const pointerStart = ref(0); const pullDistance = ref(0); const contentOffset = ref(0)
let completionTimer: number | undefined
const threshold = 100
const enabled = computed(() => resolveXamlValue(props.IsEnabled ?? true, instance) !== false)

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  for (const [key, value] of Object.entries({ Width: props.Width, Height: props.Height, MinWidth: props.MinWidth, MinHeight: props.MinHeight, MaxWidth: props.MaxWidth, MaxHeight: props.MaxHeight })) {
    const resolved = cssLength(value); if (resolved) style[key.charAt(0).toLowerCase() + key.slice(1)] = resolved
  }
  const margin = thickness(props.Margin); const padding = thickness(props.Padding)
  if (margin) style.margin = margin; if (padding) style.padding = padding
  if (props.Background) style.background = String(resolveXamlValue(props.Background, instance))
  return style
})
const contentStyle = computed(() => ({ '--refresh-content-offset': `${contentOffset.value}px`, transform: `translateY(${contentOffset.value}px)`, transition: pointerId.value === null ? 'transform 220ms cubic-bezier(0.2, 0, 0, 1)' : 'none' }))
const presenterStyle = computed(() => ({ height: '100px', minHeight: '80px', transform: `translateY(${Math.max(0, pullDistance.value - 100)}px)`, opacity: pullDistance.value > 0 || isRefreshing.value ? '1' : '0', transition: pointerId.value === null ? 'opacity 120ms linear, transform 220ms cubic-bezier(0.2, 0, 0, 1)' : 'none' }))

const visualizerOutlet = computed<Component | null>(() => {
  const property = slots.default?.().find((node) => isVisualizerProperty(node))
  const child = property ? directChildren(property)[0] : null
  const bound = resolveXamlValue(props.Visualizer, instance)
  if (!child && !bound) return null
  if (child) return defineComponent({ name: 'RefreshVisualizerOutlet', setup() { return () => cloneVNode(child, { RefreshState: refreshState.value }) } })
  return defineComponent({ name: 'RefreshVisualizerBoundOutlet', setup() { return () => h('span', { class: 'refresh-visualizer-glyph' }, iconFor(bound)) } })
})
const contentNodes = computed(() => {
  const property = slots.default?.().find((node) => isContentProperty(node))
  return property ? directChildren(property) : slots.default?.().filter((node) => !isVisualizerProperty(node)) ?? []
})
const ContentOutlet = defineComponent({
  name: 'RefreshContainerContentOutlet',
  setup() { return () => h('div', { class: 'refresh-container-content' }, contentNodes.value) }
})
const VisualizerOutlet = defineComponent({
  name: 'RefreshContainerVisualizerOutlet',
  setup() { return () => visualizerOutlet.value ? h(visualizerOutlet.value) : null }
})
function isVisualizerProperty(node: VNode) { return Boolean((node.type as { __refreshContainerProperty?: string } | undefined)?.__refreshContainerProperty === 'visualizer') }
function isContentProperty(node: VNode) { return Boolean((node.type as { __refreshContainerProperty?: string } | undefined)?.__refreshContainerProperty === 'content') }
function propertyChildren(node: VNode): VNode[] { if (Array.isArray(node.children)) return node.children as VNode[]; const slot = node.children && typeof node.children === 'object' ? (node.children as { default?: () => VNode[] }).default : undefined; return typeof slot === 'function' ? slot() : [] }
function iconFor(value: unknown) { const record = value && typeof value === 'object' ? value as Record<string, any> : {}; return String(record.IconSource?.Glyph ?? record.iconSource?.glyph ?? record.Glyph ?? record.glyph ?? '') }
function cssLength(value: unknown) { if (value === undefined || value === null || value === '') return ''; return typeof value === 'number' || /^-?\d+(?:\.\d+)?$/.test(String(value).trim()) ? `${value}px` : String(value) }
function thickness(value: unknown) { if (value === undefined || value === null || value === '') return ''; const parts = String(value).trim().split(/[ ,]+/).filter(Boolean).map(cssLength); if (parts.length === 1) return parts[0]; if (parts.length === 2) return `${parts[0]} ${parts[1]}`; if (parts.length === 3) return `${parts[0]} ${parts[1]} ${parts[2]} ${parts[1]}`; return parts.join(' ') }
function scrollTopAt(target: EventTarget | null) { let element = target instanceof HTMLElement ? target : null; while (element && element !== rootRef.value) { if (element.scrollTop > 0 || element.classList.contains('win-scroll-viewer-viewport')) return element.scrollTop; element = element.parentElement } return 0 }
function onPointerDown(event: PointerEvent) { if (!enabled.value || isRefreshing.value || event.button > 0 || scrollTopAt(event.target) > 0) return; pointerId.value = event.pointerId; pointerStart.value = event.clientY; pullDistance.value = 0; refreshState.value = 'Peeking'; (event.currentTarget as HTMLElement)?.setPointerCapture?.(event.pointerId) }
function onPointerMove(event: PointerEvent) { if (pointerId.value !== event.pointerId || isRefreshing.value) return; const delta = event.clientY - pointerStart.value; if (delta <= 0) return; event.preventDefault(); pullDistance.value = Math.min(delta * 0.8, threshold * 1.5); contentOffset.value = pullDistance.value; refreshState.value = pullDistance.value >= threshold ? 'Pending' : 'Interacting' }
function onPointerUp(event: PointerEvent) { if (pointerId.value !== event.pointerId) return; pointerId.value = null; if (pullDistance.value >= threshold) triggerRefresh(); else resetPull() }
function onPointerCancel(event: PointerEvent) { if (pointerId.value !== event.pointerId) return; pointerId.value = null; resetPull() }
function triggerRefresh() { if (isRefreshing.value || !enabled.value) return; isRefreshing.value = true; refreshState.value = 'Refreshing'; pullDistance.value = threshold; contentOffset.value = threshold; let completed = false; const complete = () => { if (completed) return; completed = true; window.clearTimeout(completionTimer); window.setTimeout(resetPull, 220) }; const args: RefreshRequestedEventArgs = { GetDeferral: () => ({ Complete: complete }) }; emit('RefreshRequested', args); resolveXamlHandler(attrs.RefreshRequested, instance)?.(args); completionTimer = window.setTimeout(complete, 10000) }
function resetPull() { isRefreshing.value = false; refreshState.value = 'Idle'; pullDistance.value = 0; contentOffset.value = 0 }
defineExpose({ requestRefresh: triggerRefresh })
</script>

<style scoped>
.win-refresh-container { position: relative; display: block; min-width: 0; min-height: 0; overflow: hidden; box-sizing: border-box; background: var(--RefreshContainerBackgroundBrush, transparent); color: var(--RefreshContainerForegroundBrush, var(--text-primary)); touch-action: pan-y; }
.refresh-container-root { position: relative; z-index: 1; min-width: 0; min-height: 0; background: transparent; will-change: transform; }
.refresh-container-content { position: relative; z-index: 1; min-width: 0; min-height: 0; transform: translateY(var(--refresh-content-offset, 0px)); will-change: transform; }
.refresh-visualizer-presenter { position: absolute; inset: 0 0 auto; z-index: 2; display: flex; align-items: flex-end; justify-content: center; pointer-events: none; color: var(--RefreshVisualizerForeground, var(--text-primary)); background: var(--RefreshVisualizerBackground, transparent); will-change: transform, opacity; }
.refresh-visualizer-glyph { display: inline-flex; align-items: center; justify-content: center; min-height: 80px; height: 100px; font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif; font-size: 24px; color: currentColor; }
</style>
