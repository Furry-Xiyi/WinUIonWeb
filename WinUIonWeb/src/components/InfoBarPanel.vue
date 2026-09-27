<template>
  <div ref="root" class="win-infobar-panel" :class="{ 'is-vertical': isVertical }" :style="panelStyle"><ChildrenOutlet /></div>
</template>

<script setup lang="ts">
import { cloneVNode, computed, defineComponent, Fragment, getCurrentInstance, h, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, useSlots, type VNode } from 'vue'
import { attachedValue, xamlThickness } from './layout'
import { normalizeXamlNodes, resolveXamlValue } from './xamlRuntime'

defineOptions({ name: 'InfoBarPanel' })
const props = defineProps({ HorizontalOrientationPadding: { type: [String, Number], default: 0 }, VerticalOrientationPadding: { type: [String, Number], default: 0 }, Margin: { type: [String, Number], default: 0 } })
const instance = getCurrentInstance()
const slots = useSlots()
const root = ref<HTMLElement | null>(null)
const isVertical = ref(true)
const resolve = (value: unknown) => resolveXamlValue(value, instance)
const panelStyle = computed(() => ({ padding: xamlThickness(resolve(isVertical.value ? props.VerticalOrientationPadding : props.HorizontalOrientationPadding)), margin: xamlThickness(resolve(props.Margin)) }))
const thickness = (value: unknown) => {
  const parts = String(resolve(value) ?? 0).split(',').map(part => Number(part.trim()) || 0)
  return parts.length === 4 ? parts : parts.length === 2 ? [parts[0], parts[1], parts[0], parts[1]] : Array(4).fill(parts[0])
}
const ChildrenOutlet = defineComponent({ name: 'InfoBarPanelChildren', setup() { return () => h(Fragment, normalizeXamlNodes(slots.default?.() ?? [], instance).map((node: VNode) => {
  const childProps = { ...(node.props ?? {}) }
  delete childProps.ref
  for (const key of ['InfoBarPanel.HorizontalOrientationMargin', 'InfoBarPanel.VerticalOrientationMargin']) if (key in childProps) childProps[key] = resolve(childProps[key])
  const clone = cloneVNode(node, childProps)
  clone.ref = node.ref
  return clone
})) } })
let observer: ResizeObserver | undefined
let mutations: MutationObserver | undefined
let frame = 0
let disposed = false
const children = () => [...(root.value?.children ?? [])].filter(element => element instanceof HTMLElement && !element.hidden && getComputedStyle(element).display !== 'none') as HTMLElement[]

// InfoBarPanel.cpp measures each child with the whole star column before
// comparing their summed widths and tallest horizontal height. This host
// stays out of flow and cannot change the owning Grid's desired size.
const measure = () => {
  frame = 0
  const element = root.value
  if (!element || !element.getClientRects().length || disposed) return
  const available = element.clientWidth
  if (!available) return
  const host = document.createElement('div')
  Object.assign(host.style, { position: 'absolute', inset: '0 auto auto 0', width: `${available}px`, visibility: 'hidden', pointerEvents: 'none', contain: 'layout style', zIndex: '-1' })
  const visualChildren = children()
  const sizes = visualChildren.map(child => {
    const clone = child.cloneNode(true) as HTMLElement
    clone.removeAttribute('id')
    clone.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'))
    Object.assign(clone.style, { position: 'relative', width: 'max-content', minWidth: '0', maxWidth: `${available}px`, flex: 'none', margin: '0', alignSelf: 'start' })
    host.appendChild(clone)
    return { child, clone, horizontal: thickness(attachedValue(child, 'InfoBarPanel.HorizontalOrientationMargin')), vertical: thickness(attachedValue(child, 'InfoBarPanel.VerticalOrientationMargin')) }
  })
  host.dataset.infoBarMeasureHost = 'true'
  element.appendChild(host)
  const measured = sizes.map(item => ({ ...item, width: item.clone.getBoundingClientRect().width, height: item.clone.getBoundingClientRect().height })).filter(item => item.width > 0 && item.height > 0)
  host.remove()
  const width = measured.reduce((sum, item, index) => sum + item.width + (index ? item.horizontal[0] : 0) + (index < measured.length - 1 ? item.horizontal[2] : 0), 0)
  const parentMinHeight = Number.parseFloat(getComputedStyle(element.parentElement!).minHeight) || 0
  const vertical = measured.length === 1 || width > available + 0.01 || (parentMinHeight > 0 && measured.some(item => item.height + item.horizontal[1] + item.horizontal[3] > parentMinHeight))
  isVertical.value = vertical
  for (const child of visualChildren) { child.style.margin = '0'; child.style.flex = '0 0 auto'; child.style.maxWidth = '100%'; child.style.minWidth = '0' }
  measured.forEach((item, index) => {
    const [left, top, right, bottom] = vertical ? item.vertical : item.horizontal
    item.child.style.margin = vertical ? `${index ? top : 0}px ${right}px ${bottom}px ${left}px` : `${top}px ${index < measured.length - 1 ? right : 0}px ${bottom}px ${index ? left : 0}px`
    item.child.style.width = vertical ? `${Math.min(available - left - right, item.width)}px` : `${item.width}px`
    if (!vertical && index === measured.length - 1) item.child.style.flex = '1 1 auto'
  })
  visualChildren.forEach(child => observer?.observe(child))
}
const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(measure) }
onMounted(() => {
  observer = new ResizeObserver(schedule)
  if (root.value) observer.observe(root.value)
  mutations = new MutationObserver(records => {
    if (records.some(record => record.type !== 'childList' || [...record.addedNodes, ...record.removedNodes].some(node => !(node instanceof HTMLElement && node.dataset.infoBarMeasureHost === 'true')))) schedule()
  })
  if (root.value) mutations.observe(root.value, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['hidden', 'class'] })
  document.fonts?.ready.then(schedule)
  void nextTick(schedule)
})
onUpdated(() => { void nextTick(schedule) })
onBeforeUnmount(() => { disposed = true; observer?.disconnect(); mutations?.disconnect(); if (frame) cancelAnimationFrame(frame) })
</script>

<style scoped>
.win-infobar-panel { position: relative; display: flex; flex-direction: row; box-sizing: border-box; min-width: 0; align-items: start; }
.win-infobar-panel.is-vertical { flex-direction: column; }
</style>
