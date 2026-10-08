<template>
  <ControlExampleBase
    :height="resolveProp(Height)"
    v-bind="$attrs"
    :headerText="resolveProp(HeaderText)"
    :exampleHeight="resolveProp(ExampleHeight)"
    :webViewHeight="Number(resolveProp(WebViewHeight))"
    :webViewWidth="Number(resolveProp(WebViewWidth))"
    :HorizontalContentAlignment="resolveProp(HorizontalContentAlignment)"
    :sourceCodeVisibility="resolveProp(SourceCodeVisibility)"
    :theme="resolveProp(Theme)"
    :options="resolveProp(Options)"
    :xaml="resolveProp(Xaml)"
    :cSharp="resolveProp(CSharp)"
    :vue="resolveProp(Vue)"
    :xamlSource="resolveProp(XamlSource)"
    :cSharpSource="resolveProp(CSharpSource)"
    :sampleDefinition="resolveProp(SampleDefinition)"
    :substitutions="resolvedSubstitutions">
    <template #example><ExampleOutlet /></template>
    <template v-if="hasOutput" #output><OutputOutlet /></template>
    <template v-if="hasOptions" #options><OptionsOutlet /></template>
  </ControlExampleBase>
  <SubstitutionsOutlet />
</template>

<script lang="ts">
import {
  ControlExampleExample,
  ControlExampleOptions,
  ControlExampleOutput,
  ControlExampleSubstitutions
} from './ControlExampleProperties'

// Vue compiles <ControlExample.Example> as ControlExample.Example when the
// parent imports ControlExample. Expose the XAML property elements on the
// component object so that syntax resolves in both local and global usage.
export default {
  Example: ControlExampleExample,
  Output: ControlExampleOutput,
  Options: ControlExampleOptions,
  Substitutions: ControlExampleSubstitutions
}
</script>

<script setup lang="ts">
import { computed, defineComponent, Fragment, h, inject, nextTick, onMounted, onBeforeUnmount, provide, shallowReactive, useSlots, getCurrentInstance, type PropType } from 'vue'
import ControlExampleBase from './ControlExampleBase.vue'
import { getControlExampleProperty, type ControlExamplePropertyName, type ControlExampleSubstitutionValue } from './ControlExampleProperties'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, xamlNameScopeKey } from './xamlRuntime'

defineOptions({ inheritAttrs: false })
const slots = useSlots()
const instance = getCurrentInstance()
defineEmits(['Loaded'])
let loaded = false
onMounted(async () => {
  // Suspense and Teleport child mount hooks populate the XAML namescope.
  // Loaded must observe that completed subtree before running page handlers.
  await nextTick()
  if (loaded) return
  loaded = true
  const sender = instance?.exposeProxy ?? instance?.proxy
  const args = { OriginalSource: sender, Handled: false }
  const listener = instance?.vnode.props?.onLoaded
  for (const callback of Array.isArray(listener) ? listener : [listener]) if (typeof callback === 'function') callback(sender, args)
  resolveXamlHandler(instance?.attrs.Loaded, instance)?.(sender, args)
})
onBeforeUnmount(() => { loaded = true })
const xamlNameScope = inject<Record<string, unknown> | null>(xamlNameScopeKey, null) ?? shallowReactive<Record<string, unknown>>({})
provide(xamlNameScopeKey, xamlNameScope)
// Bindings retain the receiving dependency property's declared value type.
const resolveProp = <T,>(value: T): T => resolveXamlValue(value, instance) as T
const propertyNodes = computed(() => {
  const result: Record<ControlExamplePropertyName, ReturnType<NonNullable<typeof slots.default>>> = {
    example: [],
    output: [],
    options: [],
    substitutions: []
  }
  const defaultContent: ReturnType<NonNullable<typeof slots.default>> = []
  const collect = (nodes: ReturnType<NonNullable<typeof slots.default>>) => {
    for (const node of nodes) {
      // Multiple XAML property elements can be wrapped in a Fragment by the
      // Vue compiler. Ignore that wrapper while preserving the property
      // element's ownership of its children.
      if (node?.type === Fragment && Array.isArray(node.children)) {
        collect(node.children as ReturnType<NonNullable<typeof slots.default>>)
        continue
      }
      const propertyName = getControlExampleProperty(node)
      if (!propertyName) {
        defaultContent.push(node)
        continue
      }
      if (!node.children || typeof node.children !== 'object') continue
      const propertySlot = (node.children as { default?: () => ReturnType<NonNullable<typeof slots.default>> }).default
      if (propertySlot) result[propertyName] = normalizeXamlNodes(propertySlot(), instance)
    }
  }
  collect(slots.default?.() ?? [])
  if (!result.example.length) result.example = normalizeXamlNodes(defaultContent, instance)
  return result
})

const outlet = (name: ControlExamplePropertyName) => defineComponent({
  name: `ControlExample${name[0].toUpperCase()}${name.slice(1)}Outlet`,
  setup() {
    return () => h(Fragment, propertyNodes.value[name])
  }
})

const ExampleOutlet = outlet('example')
const OutputOutlet = outlet('output')
const OptionsOutlet = outlet('options')
const SubstitutionsOutlet = outlet('substitutions')
const hasOutput = computed(() => propertyNodes.value.output.length > 0)
const hasOptions = computed(() => propertyNodes.value.options.length > 0)
const resolvedSubstitutions = computed(() => propertyNodes.value.substitutions.length
  ? propertyNodes.value.substitutions.map(node => {
    const name = String(node.props?.['data-xaml-ref'] ?? '')
    const named = name ? xamlNameScope[name] as { Value?: unknown; IsEnabled?: unknown } | undefined : undefined
    return {
      Key: node.props?.Key,
      Value: named ? named.Value : resolveProp(node.props?.Value),
      IsEnabled: named ? named.IsEnabled : resolveProp(node.props?.IsEnabled) !== false
    }
  })
  : resolveProp(props.Substitutions))
const props = defineProps({
  HeaderText: { type: String, default: '' },
  Height: { type: [String, Number], default: 'auto' },
  ExampleHeight: { type: [String, Number], default: 'auto' },
  WebViewHeight: { type: [Number, String], default: 400 },
  WebViewWidth: { type: [Number, String], default: 800 },
  HorizontalContentAlignment: { type: String, default: 'Left' },
  SourceCodeVisibility: { type: [Boolean, String], default: true },
  Theme: { type: String, default: 'light' },
  Options: { type: [String, Number, Boolean, Object], default: null },
  Xaml: { type: String, default: '' },
  CSharp: { type: String, default: '' },
  Vue: { type: String, default: '' },
  XamlSource: { type: String, default: '' },
  CSharpSource: { type: String, default: '' },
  SampleDefinition: { type: String, default: '' },
  Substitutions: { type: Array as PropType<ControlExampleSubstitutionValue[]>, default: () => [] }
})
</script>
