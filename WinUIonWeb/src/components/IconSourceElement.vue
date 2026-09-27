<script lang="ts">
import { IconSourceProperty } from './IconSource'
export default { IconSource: IconSourceProperty }
</script>

<script setup lang="ts">
import { cloneVNode, computed, defineComponent, Fragment, getCurrentInstance, h, isVNode, provide, ref, shallowRef, useAttrs, useSlots, watch, type VNode } from 'vue'
import Grid from './Grid.vue'
import { createIconSourceElementVNode, iconSourceContextKey, iconSourceKind, type IconSourceModel } from './IconSource'
import { iconElementProps, useIconElement } from './iconElementRuntime'
import { normalizeXamlNodes, resolveXamlResourceObject, updateXamlBinding } from './xamlRuntime'

defineOptions({ inheritAttrs: false })
const props = defineProps({ ...iconElementProps, IconSource: { type: [String, Object], default: null } })
const attrs = useAttrs()
const slots = useSlots()
const instance = getCurrentInstance()
const icon = useIconElement(props, attrs, instance)
const sourceOverride = ref<unknown>()
watch(() => icon.resolve(props.IconSource), () => { sourceOverride.value = undefined })
const Element = icon.Element
const registeredSource = shallowRef<IconSourceModel | null>(null)
provide(iconSourceContextKey, source => { registeredSource.value = source })
const sourceInput = computed(() => {
  const raw = sourceOverride.value === undefined ? props.IconSource : sourceOverride.value
  const input = icon.resolve(raw)
  const resource = typeof raw === 'string' ? raw.match(/^\{(?:StaticResource|ThemeResource)\s+([^\s}]+)\}$/)?.[1] : undefined
  return resource ? resolveXamlResourceObject(resource, instance) ?? input : input
})
const children = (node: VNode): VNode[] => Array.isArray(node.children)
  ? node.children.filter(isVNode) as VNode[]
  : (node.children as { default?: () => VNode[] } | null)?.default?.() ?? []
const declarations = (nodes: VNode[]): VNode[] => nodes.flatMap(node => {
  if (node.type === Fragment) return declarations(children(node))
  if (iconSourceKind(node)) return [node]
  if ((node.type as { __iconSourceProperty?: string }).__iconSourceProperty === 'IconSource') return declarations(children(node))
  // Normalized property-element slots can add transparent wrappers.
  return declarations(children(node))
})
const SourceOutlet = defineComponent({
  setup: () => () => {
    if (isVNode(sourceInput.value)) return h(Fragment, normalizeXamlNodes([cloneVNode(sourceInput.value)], instance))
    return sourceInput.value || sourceOverride.value !== undefined ? null : h(Fragment, normalizeXamlNodes(declarations(slots.default?.() ?? []), instance))
  }
})
const source = computed(() => registeredSource.value ?? (!isVNode(sourceInput.value) && sourceInput.value && typeof sourceInput.value === 'object' ? sourceInput.value as Record<string, unknown> : null))
const IconOutlet = defineComponent({ setup: () => () => source.value ? createIconSourceElementVNode(source.value) : null })
Object.defineProperty(icon.api, 'IconSource', {
  enumerable: true, configurable: true,
  get: () => source.value,
  set: (value: unknown) => { sourceOverride.value = value; updateXamlBinding(props.IconSource, value, instance) }
})
defineExpose(icon.api)
</script>

<template>
  <span ref="Element" v-bind="icon.rootAttrs.value" class="win-icon-element win-icon-source-element" :class="attrs.class" :style="[attrs.style, icon.layoutStyle.value]">
    <Grid Background="Transparent" class="win-icon-grid"><IconOutlet /></Grid>
    <SourceOutlet />
  </span>
</template>
