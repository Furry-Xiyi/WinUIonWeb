<template>
  <ExpanderBase
    v-bind="$attrs"
    :Header="Header"
    :Content="Content"
    :Description="Description"
    :HeaderIcon="HeaderIcon"
    :IsExpanded="IsExpanded"
    :ExpandDirection="ExpandDirection"
    :Padding="Padding"
    :HorizontalContentAlignment="HorizontalContentAlignment"
    :VerticalContentAlignment="VerticalContentAlignment"
    :Width="Width"
    :MinWidth="MinWidth"
    :Height="Height"
    :MaxWidth="MaxWidth"
    :HorizontalAlignment="HorizontalAlignment"
    :VerticalAlignment="VerticalAlignment"
    @update:IsExpanded="$emit('update:IsExpanded', $event)"
    @Expanding="$emit('Expanding', $event)"
    @Collapsed="$emit('Collapsed', $event)">
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
import { computed, defineComponent, Fragment, h, useSlots } from 'vue'
import ExpanderBase from './ExpanderBase.vue'
import { getExpanderProperty, type ExpanderPropertyName } from './ExpanderProperties'

defineOptions({ inheritAttrs: false })
defineEmits(['update:IsExpanded', 'Expanding', 'Collapsed'])
defineProps({
  Header: { type: [String, Number], default: '' }, Content: { type: [String, Number], default: '' }, Description: { type: [String, Number], default: '' },
  HeaderIcon: { type: String, default: '' }, IsExpanded: { type: [Boolean, String], default: false },
  ExpandDirection: { type: [String, Number], default: 'Down' }, Padding: { type: [String, Number], default: '16' },
  HorizontalContentAlignment: { type: String, default: 'Stretch' }, VerticalContentAlignment: { type: String, default: 'Stretch' },
  Width: { type: [String, Number], default: '' }, MinWidth: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' }, MaxWidth: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: '' }, VerticalAlignment: { type: String, default: '' }
})

const slots = useSlots()
const propertyNodes = computed(() => {
  const result: Record<ExpanderPropertyName, ReturnType<NonNullable<typeof slots.default>>> = {
    header: [], content: [], description: [], headerIcon: [], headerControls: []
  }
  const defaultContent: ReturnType<NonNullable<typeof slots.default>> = []
  for (const node of slots.default?.() ?? []) {
    const propertyName = getExpanderProperty(node)
    if (!propertyName || !node.children || typeof node.children !== 'object') {
      defaultContent.push(node)
      continue
    }
    const propertySlot = (node.children as { default?: () => ReturnType<NonNullable<typeof slots.default>> }).default
    if (propertySlot) result[propertyName] = propertySlot()
  }
  if (!result.content.length) result.content = defaultContent
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
