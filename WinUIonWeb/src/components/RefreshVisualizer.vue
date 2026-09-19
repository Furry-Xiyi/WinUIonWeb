<template>
  <div class="win-refresh-visualizer" :class="stateClass" :style="rootStyle">
    <ContentOutlet v-if="contentNodes.length" />
  </div>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue'
export const RefreshVisualizerContent = defineComponent({
  name: 'RefreshVisualizer.Content',
  __refreshVisualizerProperty: 'content',
  setup() { return () => null }
})
export default { Content: RefreshVisualizerContent }
</script>

<script setup lang="ts">
import { computed, defineComponent, h, useSlots, watch } from 'vue'
import type { VNode } from 'vue'

const props = defineProps<{
  RefreshState?: 'Idle' | 'Peeking' | 'Interacting' | 'Pending' | 'Refreshing'
  Height?: string | number
  MinHeight?: string | number
  Background?: string
  Foreground?: string
}>()
const slots = useSlots()
const directChildren = (node: VNode) => {
  if (Array.isArray(node.children)) return node.children as VNode[]
  const children = node.children as { default?: () => VNode[] } | null
  return typeof children?.default === 'function' ? children.default() : []
}
const emit = defineEmits<{ RefreshStateChanged: [sender: unknown, args: { OldState: string; NewState: string }] }>()
const contentNodes = computed(() => {
  const property = (slots.default?.() ?? []).find((node) => Boolean((node.type as { __refreshVisualizerProperty?: string } | undefined)?.__refreshVisualizerProperty === 'content'))
  if (!property) return slots.default?.() ?? []
  return directChildren(property)
})
const ContentOutlet = defineComponent({
  name: 'RefreshVisualizerContentOutlet',
  setup() { return () => h('span', { class: 'refresh-visualizer-content' }, contentNodes.value) }
})
const rootStyle = computed(() => ({
  height: props.Height === undefined ? undefined : length(props.Height),
  minHeight: props.MinHeight === undefined ? undefined : length(props.MinHeight),
  background: props.Background || 'var(--RefreshVisualizerBackground, transparent)',
  color: props.Foreground || 'var(--RefreshVisualizerForeground, var(--text-primary))'
}))
const stateClass = computed(() => `refresh-state-${props.RefreshState ?? 'Idle'}`.toLowerCase())
function length(value: string | number) { return typeof value === 'number' || /^\d+(?:\.\d+)?$/.test(String(value)) ? `${value}px` : String(value) }
watch(() => props.RefreshState, (newState, oldState) => {
  if (newState !== oldState) emit('RefreshStateChanged', undefined, { OldState: oldState ?? 'Idle', NewState: newState ?? 'Idle' })
})
</script>

<style scoped>
.win-refresh-visualizer { display: flex; align-items: center; justify-content: center; box-sizing: border-box; }
.refresh-visualizer-content { display: inline-flex; align-items: center; justify-content: center; }
</style>
