<template>
  <ExpanderBase
    ref="expanderBase"
    v-bind="$attrs"
    :Header="Header"
    :Content="Content"
    :Description="Description"
    :HeaderIcon="HeaderIcon"
    :IsExpanded="IsExpanded"
    :ExpandDirection="ExpandDirection"
    :Padding="Padding"
    :Background="Background"
    :BorderBrush="BorderBrush"
    :BorderThickness="BorderThickness"
    :CornerRadius="CornerRadius"
    :IsEnabled="IsEnabled"
    :HorizontalContentAlignment="HorizontalContentAlignment"
    :VerticalContentAlignment="VerticalContentAlignment"
    :Width="Width"
    :MinWidth="MinWidth"
    :Height="Height"
    :MaxWidth="MaxWidth"
    :HorizontalAlignment="HorizontalAlignment"
    :VerticalAlignment="VerticalAlignment"
    @update:IsExpanded="$emit('update:IsExpanded', $event)"
    @Expanding="forwardExpanding"
    @Collapsed="forwardCollapsed">
    <template v-if="headerNodes.length" #Header><HeaderOutlet /></template>
    <template v-if="descriptionNodes.length" #Description><DescriptionOutlet /></template>
    <template v-if="headerIconNodes.length" #HeaderIcon><HeaderIconOutlet /></template>
    <template v-if="headerControlsNodes.length" #HeaderControls><HeaderControlsOutlet /></template>
    <ContentOutlet v-if="contentNodes.length" />
  </ExpanderBase>
</template>

<script lang="ts">
import {
  ExpanderContent,
  ExpanderDescription,
  ExpanderHeader,
  ExpanderHeaderControls,
  ExpanderHeaderIcon
} from './ExpanderProperties'

// Vue compiles <Expander.Header> as Expander.Header when the parent imports
// Expander. Keep the XAML property-element names available on that object.
export default {
  Header: ExpanderHeader,
  Content: ExpanderContent,
  Description: ExpanderDescription,
  HeaderIcon: ExpanderHeaderIcon,
  HeaderControls: ExpanderHeaderControls
}
</script>

<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, ref, useSlots } from 'vue'
import ExpanderBase from './ExpanderBase.vue'
import { getExpanderProperty, type ExpanderPropertyName } from './ExpanderProperties'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue } from './xamlRuntime'

defineOptions({ inheritAttrs: false })
defineEmits(['update:IsExpanded', 'Expanding', 'Collapsed'])
const instance = getCurrentInstance()
const expanderBase = ref<{ IsExpanded: boolean } | null>(null)
const forwardLifecycleEvent = (name: string, _sender: unknown, args: unknown) => {
  const sender = instance?.exposeProxy ?? instance?.exposed ?? instance?.proxy
  const handler = instance?.vnode.props?.[`on${name}`]
  for (const callback of Array.isArray(handler) ? handler : [handler]) {
    if (typeof callback === 'function') callback(sender, args)
  }
  resolveXamlHandler(instance?.attrs[name], instance)?.(sender, args)
}
const forwardExpanding = (sender: unknown, args: unknown) => forwardLifecycleEvent('Expanding', sender, args)
const forwardCollapsed = (sender: unknown, args: unknown) => forwardLifecycleEvent('Collapsed', sender, args)
const props = defineProps({
  Header: { type: [String, Number], default: '' }, Content: { type: [String, Number], default: '' }, Description: { type: [String, Number], default: '' },
  HeaderIcon: { type: String, default: '' }, IsExpanded: { type: [Boolean, String], default: false },
  ExpandDirection: { type: [String, Number], default: 'Down' }, Padding: { type: [String, Number], default: '16' },
  Background: { type: [String, Object], default: '{ThemeResource ExpanderContentBackground}' },
  BorderBrush: { type: [String, Object], default: '{ThemeResource ExpanderContentBorderBrush}' },
  BorderThickness: { type: [String, Number], default: '' }, CornerRadius: { type: [String, Number], default: '{ThemeResource ControlCornerRadius}' },
  IsEnabled: { type: [Boolean, String], default: true },
  HorizontalContentAlignment: { type: String, default: 'Stretch' }, VerticalContentAlignment: { type: String, default: 'Stretch' },
  Width: { type: [String, Number], default: '' }, MinWidth: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' }, MaxWidth: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: '' }, VerticalAlignment: { type: String, default: '' }
})
defineExpose({
  get IsExpanded() { return expanderBase.value?.IsExpanded ?? resolveXamlValue(props.IsExpanded, instance) === true },
  set IsExpanded(value: boolean) { if (expanderBase.value) expanderBase.value.IsExpanded = value }
})

const slots = useSlots()
const propertyNodes = computed(() => {
  const result: Record<ExpanderPropertyName, ReturnType<NonNullable<typeof slots.default>>> = {
    header: [], content: [], description: [], headerIcon: [], headerControls: []
  }
  const defaultContent: ReturnType<NonNullable<typeof slots.default>> = []
  const collect = (nodes: ReturnType<NonNullable<typeof slots.default>>) => { for (const node of nodes) {
    if (node.type === Fragment && Array.isArray(node.children)) { collect(node.children as ReturnType<NonNullable<typeof slots.default>>); continue }
    const propertyName = getExpanderProperty(node)
    if (!propertyName || !node.children || typeof node.children !== 'object') {
      defaultContent.push(node)
      continue
    }
    const propertySlot = (node.children as { default?: () => ReturnType<NonNullable<typeof slots.default>> }).default
    if (propertySlot) result[propertyName] = normalizeXamlNodes(propertySlot(), instance)
  } }
  collect(slots.default?.() ?? [])
  if (!result.content.length) result.content = normalizeXamlNodes(defaultContent, instance)
  return result
})

const outlet = (name: ExpanderPropertyName) => defineComponent({
  name: `Expander${name[0].toUpperCase()}${name.slice(1)}Outlet`,
  setup() {
    return () => h(Fragment, propertyNodes.value[name])
  }
})
const HeaderOutlet = outlet('header')
const DescriptionOutlet = outlet('description')
const HeaderIconOutlet = outlet('headerIcon')
const HeaderControlsOutlet = outlet('headerControls')
const ContentOutlet = outlet('content')
const headerNodes = computed(() => propertyNodes.value.header)
const descriptionNodes = computed(() => propertyNodes.value.description)
const headerIconNodes = computed(() => propertyNodes.value.headerIcon)
const headerControlsNodes = computed(() => propertyNodes.value.headerControls)
const contentNodes = computed(() => propertyNodes.value.content)
</script>
