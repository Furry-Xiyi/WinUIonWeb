<template>
  <div class="win-radio-buttons" :class="{ 'is-disabled': !IsEnabled }" :style="rootStyle">
    <WinTextBlock v-if="Header" class="win-radio-buttons-header" :Text="Header" />
    <div class="win-radio-buttons-items" :style="itemsStyle">
      <WinRadioButton
        v-for="(item, index) in normalizedItems"
        :key="index"
        :Content="item.Text"
        :IsChecked="selectedIndexValue === index"
        :IsEnabled="IsEnabled"
        @Checked="select(index)" />
      <slot v-if="normalizedItems.length === 0" />
    </div>
  </div>
</template>

<script setup>
import { computed, provide, ref } from 'vue';
import WinRadioButton from './WinRadioButton.vue';
import WinTextBlock from './WinTextBlock.vue';

const radioButtonsGroupKey = Symbol.for('WinUIonWeb.RadioButtons');

const props = defineProps({
  Header: { type: String, default: '' },
  ItemsSource: { type: Array, default: () => [] },
  SelectedIndex: { type: Number, default: undefined },
  SelectedItem: { type: null, default: undefined },
  MaxColumns: { type: [Number, String], default: 1 },
  IsEnabled: { type: Boolean, default: true },
  Margin: { type: String, default: '' }
});

const emit = defineEmits(['update:SelectedIndex', 'update:SelectedItem', 'SelectionChanged']);

const internalSelectedIndex = ref(props.SelectedIndex ?? -1);
let nextSlotIndex = 0;

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
  return typeof value === 'number' ? `${value}px` : value;
};

const xamlThickness = (value) => {
  if (!value) return '';
  const parts = String(value).split(',').map((part) => cssLength(Number.isNaN(Number(part.trim())) ? part.trim() : Number(part.trim())));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return value;
};

const normalizedItems = computed(() => props.ItemsSource.map((item) => {
  if (typeof item === 'string' || typeof item === 'number') return { Text: String(item), Value: item };
  return { ...item, Text: item.Text ?? item.Content ?? String(item), Value: item.Value ?? item };
}));
const selectedIndexValue = computed(() => props.SelectedIndex ?? internalSelectedIndex.value);
const rootStyle = computed(() => props.Margin ? { margin: xamlThickness(props.Margin) } : {});
const itemsStyle = computed(() => {
  const maxColumns = Math.max(1, Number(props.MaxColumns) || 1);
  return { gridTemplateColumns: maxColumns > 1 ? `repeat(${maxColumns}, max-content)` : 'max-content' };
});

const select = (index) => {
  if (!props.IsEnabled) return;
  const oldItem = normalizedItems.value[selectedIndexValue.value];
  const newItem = normalizedItems.value[index];
  internalSelectedIndex.value = index;
  emit('update:SelectedIndex', index);
  emit('update:SelectedItem', newItem?.Value ?? newItem);
  emit('SelectionChanged', {
    SelectedIndex: index,
    SelectedItem: newItem?.Value ?? newItem,
    AddedItems: newItem ? [newItem.Value ?? newItem] : [],
    RemovedItems: oldItem ? [oldItem.Value ?? oldItem] : []
  });
};

provide(radioButtonsGroupKey, {
  selectedIndex: selectedIndexValue,
  register: () => nextSlotIndex++,
  select
});
</script>
