<template>
  <div v-if="isGroup" class="win-radio-buttons" :class="{ 'is-disabled': !IsEnabled }" :style="rootStyle">
    <WinTextBlock v-if="Header" class="win-radio-buttons-header" :Text="Header" />
    <div class="win-radio-buttons-items" :style="itemsStyle">
      <label
        v-for="(item, index) in normalizedItems"
        :key="index"
        class="win-radio-button"
        :class="{ 'is-checked': selectedIndexValue === index, 'is-disabled': !IsEnabled }">
        <input
          class="win-radio-input"
          type="radio"
          :name="groupName"
          :checked="selectedIndexValue === index"
          :disabled="!IsEnabled"
          @change="select(index)" />
        <span class="win-radio-glyph" aria-hidden="true"><span class="win-radio-check" /></span>
        <WinTextBlock class="win-radio-content" :Text="item.Text" />
      </label>
      <slot v-if="normalizedItems.length === 0" />
    </div>
  </div>

  <label
    v-else
    class="win-radio-button"
    :class="{ 'is-checked': resolvedChecked, 'is-disabled': !IsEnabled }"
    :style="rootStyle">
    <input
      class="win-radio-input"
      type="radio"
      :name="radioGroupName || undefined"
      :checked="resolvedChecked"
      :disabled="!IsEnabled"
      @change="check" />
    <span class="win-radio-glyph" aria-hidden="true"><span class="win-radio-check" /></span>
    <WinTextBlock class="win-radio-content" :Text="contentText">
      <slot>{{ Content }}</slot>
    </WinTextBlock>
  </label>
</template>

<script setup>
import { computed, inject, provide, ref } from 'vue';
import WinTextBlock from './WinTextBlock.vue';

const radioButtonsGroupKey = Symbol.for('WinUIonWeb.RadioButtons');

const props = defineProps({
  Content: { type: [String, Number], default: '' },
  IsChecked: { type: Boolean, default: undefined },
  IsEnabled: { type: Boolean, default: true },
  GroupName: { type: String, default: '' },
  name: { type: String, default: '' },
  Header: { type: String, default: '' },
  ItemsSource: { type: Array, default: () => [] },
  SelectedIndex: { type: Number, default: undefined },
  SelectedItem: { type: null, default: undefined },
  MaxColumns: { type: [Number, String], default: 1 },
  Margin: { type: String, default: '' },
  value: { type: [String, Number, Boolean, Object], default: undefined },
  modelValue: { type: [String, Number, Boolean, Object], default: undefined }
});

const emit = defineEmits(['update:IsChecked', 'Checked', 'Unchecked', 'update:modelValue', 'update:SelectedIndex', 'update:SelectedItem', 'SelectionChanged']);

const groupName = `win-radio-buttons-${Math.random().toString(36).slice(2)}`;
const internalSelectedIndex = ref(props.SelectedIndex ?? -1);
const group = inject(radioButtonsGroupKey, null);
const groupIndex = group?.register?.();
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

const isGroup = computed(() => props.Header !== '' || props.ItemsSource.length > 0 || props.SelectedIndex !== undefined || props.SelectedItem !== undefined);
const normalizedItems = computed(() => props.ItemsSource.map((item) => {
  if (typeof item === 'string' || typeof item === 'number') return { Text: String(item), Value: item };
  return { ...item, Text: item.Text ?? item.Content ?? item.label ?? String(item), Value: item.Value ?? item };
}));
const selectedIndexValue = computed(() => props.SelectedIndex ?? internalSelectedIndex.value);
const radioGroupName = computed(() => props.GroupName || props.name);
const resolvedChecked = computed(() => {
  if (props.IsChecked !== undefined) return props.IsChecked === true;
  if (group && groupIndex !== undefined) return group.selectedIndex.value === groupIndex;
  return props.modelValue === props.value;
});
const contentText = computed(() => props.Content === undefined || props.Content === null ? '' : String(props.Content));
const rootStyle = computed(() => props.Margin ? { margin: xamlThickness(props.Margin) } : {});
const itemsStyle = computed(() => {
  const maxColumns = Math.max(1, Number(props.MaxColumns) || 1);
  return maxColumns > 1
    ? { gridTemplateColumns: `repeat(${maxColumns}, max-content)` }
    : { gridTemplateColumns: 'max-content' };
});

const check = () => {
  if (!props.IsEnabled) return;
  if (group && groupIndex !== undefined) group.select(groupIndex);
  emit('update:IsChecked', true);
  emit('Checked');
  if (props.value !== undefined) emit('update:modelValue', props.value);
};

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

<style>
.win-radio-buttons {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
}

.win-radio-buttons-header {
  margin: 0 0 8px;
}

.win-radio-buttons-items {
  display: grid;
  column-gap: 7px;
  row-gap: 8px;
  align-items: start;
}

.win-radio-button {
  display: inline-flex;
  align-items: flex-start;
  gap: 8px;
  box-sizing: border-box;
  min-width: 120px;
  min-height: 32px;
  padding: 0;
  color: var(--text-primary);
  cursor: pointer;
  user-select: none;
}

.win-radio-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.win-radio-glyph {
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  display: inline-grid;
  place-items: center;
  flex: 0 0 20px;
  border: 1px solid var(--radio-border, var(--ctrl-strong-stroke-default));
  border-radius: 50%;
  background: transparent;
  margin-top: 6px;
}

.win-radio-check {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: transparent;
  transform: scale(0);
  transition: transform var(--fast-duration) var(--fast-out-slow-in);
}

.win-radio-button:hover .win-radio-glyph {
  border-color: var(--text-primary);
  background: var(--subtle-secondary);
}

.win-radio-button:active .win-radio-glyph {
  border-color: var(--text-secondary);
  background: var(--subtle-tertiary);
}

.win-radio-button.is-checked .win-radio-glyph {
  border-color: var(--accent-base);
  background: var(--accent-base);
}

.win-radio-button.is-checked:hover .win-radio-glyph {
  border-color: var(--accent-hover);
  background: var(--accent-hover);
}

.win-radio-button.is-checked:active .win-radio-glyph {
  border-color: var(--accent-pressed);
  background: var(--accent-pressed);
}

.win-radio-button.is-checked .win-radio-check {
  background: var(--accent-text);
  transform: scale(1);
}

.win-radio-button.is-checked:hover .win-radio-check {
  transform: scale(1.2);
}

.win-radio-button.is-checked:active .win-radio-check {
  transform: scale(0.8);
}

.win-radio-content {
  line-height: 20px;
  padding-top: 6px;
}

.win-radio-button.is-disabled {
  cursor: default;
  color: var(--text-disabled);
}

.win-radio-button.is-disabled .win-radio-glyph {
  border-color: var(--ctrl-strong-stroke-disabled);
  background: transparent;
}

.win-radio-button.is-disabled.is-checked .win-radio-glyph {
  background: var(--ctrl-strong-stroke-disabled);
}
</style>
