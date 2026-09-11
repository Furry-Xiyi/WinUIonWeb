<template>
  <div v-if="isGroup" class="win-radio-buttons" :class="{ 'is-disabled': !resolvedIsEnabled }" :style="rootStyle">
    <TextBlock v-if="resolvedHeader" class="win-radio-buttons-header" :Text="resolvedHeader" />
    <div class="win-radio-buttons-items" :style="itemsStyle">
      <label
        v-for="(item, index) in normalizedItems"
        :key="index"
        class="win-radio-button"
        :class="{ 'is-checked': selectedIndexValue === index, 'is-disabled': !resolvedIsEnabled }">
        <input
          class="win-radio-input"
          type="radio"
          :name="groupName"
          :checked="selectedIndexValue === index"
          :disabled="!resolvedIsEnabled"
          @change="select(index)" />
        <span class="win-radio-glyph" aria-hidden="true"><span class="win-radio-check" /></span>
        <TextBlock class="win-radio-content" :Text="item.Text" />
      </label>
      <slot v-if="normalizedItems.length === 0" />
    </div>
  </div>

  <label
    v-else
    class="win-radio-button"
    :class="{ 'is-checked': resolvedChecked, 'is-disabled': !resolvedIsEnabled }"
    :style="rootStyle">
    <input
      class="win-radio-input"
      type="radio"
      :name="radioGroupName || undefined"
      :checked="resolvedChecked"
      :disabled="!resolvedIsEnabled"
      @change="check" />
    <span class="win-radio-glyph" aria-hidden="true"><span class="win-radio-check" /></span>
    <TextBlock class="win-radio-content" :Text="contentText">
      <slot>{{ contentText }}</slot>
    </TextBlock>
  </label>
</template>

<script setup>
import { computed, getCurrentInstance, inject, provide, ref } from 'vue';
import TextBlock from './TextBlock.vue';
import { resolveXamlValue } from './xamlRuntime';

const radioButtonsGroupKey = Symbol.for('WinUIonWeb.RadioButtons');

const props = defineProps({
  Content: { type: [String, Number], default: '' },
  IsChecked: { type: [Boolean, String], default: undefined },
  IsEnabled: { type: [Boolean, String], default: true },
  GroupName: { type: String, default: '' },
  name: { type: String, default: '' },
  Header: { type: String, default: '' },
  ItemsSource: { type: [Array, String], default: () => [] },
  SelectedIndex: { type: [Number, String], default: undefined },
  SelectedItem: { type: null, default: undefined },
  MaxColumns: { type: [Number, String], default: 1 },
  Margin: { type: String, default: '' },
  value: { type: [String, Number, Boolean, Object], default: undefined },
  modelValue: { type: [String, Number, Boolean, Object], default: undefined }
});

const emit = defineEmits(['update:IsChecked', 'Checked', 'Unchecked', 'update:modelValue', 'update:SelectedIndex', 'update:SelectedItem', 'SelectionChanged']);

const groupName = `win-radio-buttons-${Math.random().toString(36).slice(2)}`;
const instance = getCurrentInstance();
const resolvedItemsSource = computed(() => {
  const value = resolveXamlValue(props.ItemsSource, instance);
  return Array.isArray(value) ? value : [];
});
const resolvedHeader = computed(() => resolveXamlValue(props.Header, instance));
const resolvedIsEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance) !== false);
const resolvedIsChecked = computed(() => resolveXamlValue(props.IsChecked, instance));
const resolvedSelectedIndex = computed(() => {
  const value = resolveXamlValue(props.SelectedIndex, instance);
  return value === undefined || value === '' ? undefined : Number(value);
});
const internalSelectedIndex = ref(resolvedSelectedIndex.value ?? -1);
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

const isGroup = computed(() => resolvedHeader.value !== '' || resolvedItemsSource.value.length > 0 || resolvedSelectedIndex.value !== undefined || props.SelectedItem !== undefined);
const normalizedItems = computed(() => resolvedItemsSource.value.map((item) => {
  if (typeof item === 'string' || typeof item === 'number') return { Text: String(item), Value: item };
  return { ...item, Text: item.Text ?? item.Content ?? item.label ?? String(item), Value: item.Value ?? item };
}));
const selectedIndexValue = computed(() => resolvedSelectedIndex.value ?? internalSelectedIndex.value);
const radioGroupName = computed(() => props.GroupName || props.name);
const resolvedChecked = computed(() => {
  if (resolvedIsChecked.value !== undefined) return resolvedIsChecked.value === true;
  if (group && groupIndex !== undefined) return group.selectedIndex.value === groupIndex;
  return props.modelValue === props.value;
});
const contentText = computed(() => {
  const value = resolveXamlValue(props.Content, instance);
  return value === undefined || value === null ? '' : String(value);
});
const rootStyle = computed(() => props.Margin ? { margin: xamlThickness(resolveXamlValue(props.Margin, instance)) } : {});
const itemsStyle = computed(() => {
  const maxColumns = Math.max(1, Number(props.MaxColumns) || 1);
  return maxColumns > 1
    ? { gridTemplateColumns: `repeat(${maxColumns}, max-content)` }
    : { gridTemplateColumns: 'max-content' };
});

const check = () => {
  if (!resolvedIsEnabled.value) return;
  if (group && groupIndex !== undefined) group.select(groupIndex);
  emit('update:IsChecked', true);
  emit('Checked');
  if (props.value !== undefined) emit('update:modelValue', props.value);
};

const select = (index) => {
  if (!resolvedIsEnabled.value) return;
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
