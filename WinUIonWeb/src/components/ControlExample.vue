<template>
  <ControlExampleBase
    v-bind="$attrs"
    :headerText="resolveProp(HeaderText)"
    :exampleHeight="resolveProp(ExampleHeight)"
    :webViewHeight="resolveProp(WebViewHeight)"
    :webViewWidth="resolveProp(WebViewWidth)"
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
    :substitutions="resolveProp(Substitutions)">
    <template #example><ExampleOutlet /></template>
    <template v-if="hasOutput" #output><OutputOutlet /></template>
    <template v-if="hasOptions" #options><OptionsOutlet /></template>
  </ControlExampleBase>
</template>

<script lang="ts">
import {
  ControlExampleExample,
  ControlExampleOptions,
  ControlExampleOutput
} from './ControlExampleProperties'

// Vue compiles <ControlExample.Example> as ControlExample.Example when the
// parent imports ControlExample. Expose the XAML property elements on the
// component object so that syntax resolves in both local and global usage.
export default {
  Example: ControlExampleExample,
  Output: ControlExampleOutput,
  Options: ControlExampleOptions
}
</script>

<script setup lang="ts">
import { computed, defineComponent, Fragment, h, useSlots, getCurrentInstance } from 'vue'
import ControlExampleBase from './ControlExampleBase.vue'
import { getControlExampleProperty, type ControlExamplePropertyName } from './ControlExampleProperties'
import { normalizeXamlNodes, resolveXamlValue } from './xamlRuntime'

defineOptions({ inheritAttrs: false })
const slots = useSlots()
const instance = getCurrentInstance()
const resolveProp = (value: unknown) => resolveXamlValue(value, instance)
const propertyNodes = computed(() => {
  const result: Record<ControlExamplePropertyName, ReturnType<NonNullable<typeof slots.default>>> = {
    example: [],
    output: [],
    options: []
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
const hasOutput = computed(() => propertyNodes.value.output.length > 0)
const hasOptions = computed(() => propertyNodes.value.options.length > 0)
defineProps({
  HeaderText: { type: String, default: '' },
  ExampleHeight: { type: [String, Number], default: 'auto' },
  WebViewHeight: { type: Number, default: 400 },
  WebViewWidth: { type: Number, default: 800 },
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
  Substitutions: { type: Array, default: () => [] }
})
</script>
