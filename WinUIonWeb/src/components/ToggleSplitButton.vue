<template>
  <WinSplitButton
    :class="[attrs.class, { 'is-checked': checkedState }]"
    :style="attrs.style"
    :Flyout="splitFlyout"
    :IsEnabled="IsEnabled"
    :Options="splitOptions"
    :Theme="Theme"
    :MinWidth="MinWidth"
    :MinHeight="MinHeight"
    :Padding="Padding"
    :Margin="Margin"
    :VerticalAlignment="VerticalAlignment"
    @Click="onSplitClick"
    @Select="onSelect">
    <slot>{{ Content }}</slot>
    <template #flyout="{ close }">
      <slot name="flyout" :close="close"></slot>
    </template>
  </WinSplitButton>
</template>

<script setup>
import { computed, useAttrs } from 'vue';
import WinSplitButton from './WinSplitButton.vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  Content: { type: [String, Number], default: '' },
  IsChecked: { type: Boolean, default: undefined },
  Flyout: { type: [Object, Array], default: () => ({ Items: [] }) },
  IsEnabled: { type: Boolean, default: true },
  modelValue: { type: Boolean, default: false },
  options: { type: Array, default: () => [] },
  Options: { type: Array, default: () => [] },
  Theme: { type: String, default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  Padding: { type: String, default: '' },
  Margin: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue', 'update:IsChecked', 'Click', 'IsCheckedChanged', 'Select', 'click', 'optionClick']);
const attrs = useAttrs();

const checkedState = computed(() => props.IsChecked ?? props.modelValue);
const isDisabled = computed(() => props.IsEnabled === false);
const flyoutDefinition = computed(() => Array.isArray(props.Flyout) ? { Items: props.Flyout } : props.Flyout || { Items: [] });
const sourceItems = computed(() => flyoutDefinition.value.Items?.length ? flyoutDefinition.value.Items : props.Options.length ? props.Options : props.options);
const splitOptions = computed(() => sourceItems.value.map((item, idx) => {
  if (typeof item === 'string') return { Text: item, Value: idx };
  return { ...item, Text: item.Text ?? item.Content ?? item.label ?? String(item), Value: item.Value ?? idx };
}));
const splitFlyout = computed(() => ({ ...flyoutDefinition.value, Items: splitOptions.value }));

const setChecked = (next, event) => {
  if (isDisabled.value) return;
  emit('update:modelValue', next);
  emit('update:IsChecked', next);
  emit('Click', event);
  emit('click', event);
  emit('IsCheckedChanged', { IsChecked: next });
};

const onSplitClick = (event) => {
  setChecked(!checkedState.value, event);
};

const onSelect = (item) => {
  emit('Select', item);
  emit('optionClick', item.Value);
};
</script>
