<template>
  <div ref="element" v-bind="forwardedAttrs" :class="['win-system-backdrop-element', attrs.class]" :style="[attrs.style, layoutStyle]" aria-hidden="true">
    <BackdropDeclarationOutlet />
  </div>
</template>

<script lang="ts">
import { SystemBackdropElementSystemBackdrop } from './systemBackdropXaml'
export default { SystemBackdrop: SystemBackdropElementSystemBackdrop }
</script>

<script setup lang="ts">
import { cloneVNode, Comment, computed, defineComponent, Fragment, getCurrentInstance, inject, markRaw, onBeforeUnmount, onMounted, ref, shallowRef, unref, useAttrs, useSlots, watch, type VNode } from 'vue'
import { xamlBrushResourceKey, xamlThemeKey } from './brushCore'
import { frameworkLayoutStyle } from './frameworkLayout'
import { normalizeXamlNodes, resolveXamlValue, updateXamlBinding } from './xamlRuntime'
import { SystemBackdrop as SystemBackdropValue, toSystemBackdropConfig } from './systemBackdrop'
import { createSystemBackdropSurface, systemBackdropHostAdapterKey, type SystemBackdropHostAdapter, type SystemBackdropState, type SystemBackdropTheme, type SystemBackdropWindowHandle } from './systemBackdropHostAdapter'

defineOptions({ name: 'SystemBackdropElement', inheritAttrs: false })
const props = defineProps({
  SystemBackdrop: { type: [String, Object], default: null },
  CornerRadius: { type: [String, Number], default: 0 },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: 0 }, MinHeight: { type: [String, Number], default: 0 },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: 0 },
  HorizontalAlignment: { type: String, default: 'Stretch' }, VerticalAlignment: { type: String, default: 'Stretch' },
  Visibility: { type: String, default: 'Visible' }, Opacity: { type: [String, Number], default: 1 },
  RequestedTheme: { type: String, default: 'Default' }, IsHitTestVisible: { type: [Boolean, String], default: true },
})
const emit = defineEmits(['update:SystemBackdrop', 'update:CornerRadius'])
const instance = getCurrentInstance(), attrs = useAttrs(), slots = useSlots()
const element = ref<HTMLElement | null>(null), declaration = shallowRef<unknown>(null), assigned = shallowRef<unknown>(undefined)
const inheritedTheme = inject(xamlThemeKey, null) ?? inject('winuiTheme', null)
const resourceScope = inject<Record<string, unknown>>(xamlBrushResourceKey, {})
const adapter = inject<SystemBackdropHostAdapter | undefined>(systemBackdropHostAdapterKey, undefined)
const resolve = (value: unknown) => resolveXamlValue(value, instance)
const theme = computed<SystemBackdropTheme>(() => {
  const requested = resolve(props.RequestedTheme)
  const inherited = unref(inheritedTheme)
  return requested === 'Light' || requested === 'Dark' ? requested
    : inherited === 'Light' || inherited === 'light' ? 'Light'
      : inherited === 'Dark' || inherited === 'dark' ? 'Dark' : 'Default'
})
const providedBackdrop = () => {
  const expression = props.SystemBackdrop
  const resource = typeof expression === 'string' ? expression.match(/^\{(?:StaticResource|ThemeResource)\s+([^}]+)\}$/)?.[1]?.trim() : undefined
  if (resource) {
    const values = unref(resourceScope)
    const entry = values?.[resource]
    if (entry && typeof entry === 'object' && '__xamlThemeResource' in entry) {
      const variants = entry as Record<string, unknown>
      return variants[theme.value] ?? variants.Default
    }
    if (entry) return entry
  }
  return resolve(expression)
}
const SystemBackdropProperty = computed({
  get: () => assigned.value === undefined ? providedBackdrop() ?? declaration.value : assigned.value,
  set: (value: unknown) => {
    if (value !== null && !toSystemBackdropConfig(value)) throw new TypeError('SystemBackdropElement.SystemBackdrop must be a SystemBackdrop or null.')
    assigned.value = typeof value === 'object' && value !== null ? markRaw(value) : value
    updateXamlBinding(props.SystemBackdrop, value, instance)
    emit('update:SystemBackdrop', value)
  },
})
watch(() => resolve(props.SystemBackdrop), () => { assigned.value = undefined })
const localCornerRadius = shallowRef<unknown>(undefined)
const CornerRadius = computed({
  get: () => localCornerRadius.value === undefined ? resolve(props.CornerRadius) : localCornerRadius.value,
  set: (value: unknown) => { localCornerRadius.value = value; updateXamlBinding(props.CornerRadius, value, instance); emit('update:CornerRadius', value) },
})
watch(() => resolve(props.CornerRadius), () => { localCornerRadius.value = undefined })
const layoutStyle = computed(() => ({ ...frameworkLayoutStyle({ ...props, CornerRadius: CornerRadius.value }, instance) }))
const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'style' && key !== 'class')))
const children = (node: VNode): VNode[] => Array.isArray(node.children) ? node.children as VNode[] : (node.children as { default?: () => VNode[] })?.default?.() ?? []
const flatten = (nodes: VNode[]): VNode[] => nodes.flatMap(node => node.type === Fragment ? flatten(children(node)) : node.type === Comment ? [] : [node])
const BackdropDeclarationOutlet = defineComponent({ setup: () => () => {
  const properties = flatten(slots.default?.() ?? []).filter(node => (node.type as { __systemBackdropProperty?: boolean }).__systemBackdropProperty)
  const definitions = properties.flatMap(node => flatten(children(node))).filter(node => (node.type as { __systemBackdropDeclaration?: boolean }).__systemBackdropDeclaration)
  if (definitions.length > 1) throw new TypeError('SystemBackdropElement.SystemBackdrop accepts one SystemBackdrop.')
  if (!definitions.length) return null
  return cloneVNode(normalizeXamlNodes(definitions, instance)[0]!, { ref: (value: unknown) => { declaration.value = value } }, true)
} })
const State = shallowRef<SystemBackdropState | null>(null)
const revision = ref(0)
let unsubscribeBackdrop: (() => void) | undefined
watch(SystemBackdropProperty, value => {
  unsubscribeBackdrop?.()
  unsubscribeBackdrop = value instanceof SystemBackdropValue ? value.Subscribe(() => { revision.value += 1 }) : undefined
}, { immediate: true })
const config = computed(() => { void revision.value; return toSystemBackdropConfig(SystemBackdropProperty.value) })
let handle: SystemBackdropWindowHandle | undefined, unsubscribeState: (() => void) | undefined
let connectionAbort: AbortController | undefined
let version = 0, disposed = false, connecting = false, observer: MutationObserver | undefined
const disconnect = () => {
  version += 1
  connectionAbort?.abort(); connectionAbort = undefined
  const previous = handle
  handle = undefined
  unsubscribeState?.(); unsubscribeState = undefined
  State.value = null
  void previous?.Close().catch(error => { console.error(error) })
}
const connect = async () => {
  if (disposed || handle || connecting || !element.value?.isConnected) return
  const generation = ++version
  connecting = true
  connectionAbort = new AbortController()
  try {
    const connected = await createSystemBackdropSurface(element.value, { theme: theme.value, backdrop: config.value, adapter, signal: connectionAbort.signal })
    if (disposed || generation !== version || !element.value?.isConnected) { await connected.Close(); return }
    handle = connected
    unsubscribeState = connected.Subscribe(state => { State.value = state })
    await connected.SetTheme(theme.value)
    await connected.SetSystemBackdrop(config.value)
  } catch (error) {
    if (!disposed && generation === version) throw error
  } finally {
    connecting = false
    if (!disposed && !handle && element.value?.isConnected && generation !== version) void connect().catch(error => { console.error(error) })
  }
}
watch(config, value => { if (handle) void handle.SetSystemBackdrop(value) }, { deep: true })
watch(theme, value => { if (handle) void handle.SetTheme(value) })
onMounted(() => {
  void connect().catch(error => { console.error(error) })
  observer = new MutationObserver(() => {
    if (!element.value?.isConnected) disconnect()
    else if (!handle) void connect().catch(error => { console.error(error) })
  })
  observer.observe(element.value!.ownerDocument, { childList: true, subtree: true })
})
onBeforeUnmount(() => { disposed = true; observer?.disconnect(); unsubscribeBackdrop?.(); disconnect() })
defineExpose({ SystemBackdrop: SystemBackdropProperty, CornerRadius, Element: element, State })
</script>

<style scoped>
.win-system-backdrop-element {
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
</style>
