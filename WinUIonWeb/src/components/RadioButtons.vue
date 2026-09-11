<template>
  <div class="win-radio-buttons" :class="{ 'is-disabled': !resolvedIsEnabled }" :style="rootStyle">
    <TextBlock v-if="resolvedHeader" class="win-radio-buttons-header" :Text="resolvedHeader" />
    <div class="win-radio-buttons-items" :style="itemsStyle">
      <RadioButton
        v-for="(item, index) in normalizedItems"
        :key="index"
        :Content="item.Text"
        :IsChecked="selectedIndexValue === index"
        :IsEnabled="resolvedIsEnabled"
        @Checked="select(index)" />
      <slot v-if="normalizedItems.length === 0" />
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, provide, ref, useSlots, watch } from 'vue';
import RadioButton from './RadioButton.vue';
import TextBlock from './TextBlock.vue';
import { useI18n } from './i18n/index';
import { resolveXamlValue } from './xamlRuntime';

const radioButtonsGroupKey = Symbol.for('WinUIonWeb.RadioButtons');

const props = defineProps({
  Header: { type: [String, Number], default: '' },
  ItemsSource: { type: [Array, String], default: () => [] },
  SelectedIndex: { type: [Number, String], default: undefined },
  SelectedItem: { type: null, default: undefined },
  MaxColumns: { type: [Number, String], default: 1 },
  IsEnabled: { type: [Boolean, String], default: true },
  Margin: { type: String, default: '' }
});

const emit = defineEmits(['update:SelectedIndex', 'update:SelectedItem', 'SelectionChanged']);

const instance = getCurrentInstance();
const slots = useSlots();
const { t } = useI18n();
const resolvedHeader = computed(() => resolveXamlValue(props.Header, instance));
const resolvedIsEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance) !== false);
const inlineItems = computed(() => {
  const items = [];
  const textFromNode = (node) => {
    if (node === null || node === undefined) return '';
    if (Array.isArray(node)) return node.map(textFromNode).join('');
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (typeof node !== 'object') return '';

    // The Vue compiler represents an inline XAML value such as
    // <x:String>Green</x:String> as a component VNode whose default slot
    // contains a Text VNode. Reading only node.children as a string drops
    // these values and leaves RadioButtons with no items.
    const children = node.children;
    if (typeof children === 'string' || typeof children === 'number') return String(children);
    if (children && typeof children === 'object' && typeof children.default === 'function') {
      try {
        return textFromNode(children.default());
      } catch {
        return '';
      }
    }
    return textFromNode(children);
  };
  const visit = (node) => {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (typeof node === 'object') {
      const type = node.type;
      const typeName = typeof type === 'string' ? type : type?.name || type?.__name || '';
      if (String(typeName).toLowerCase() === 'x:string') {
        const text = textFromNode(node.children).trim();
        if (text) items.push(text);
      }
    }
  };
  visit(slots.default?.());
  return items;
});
const resolvedItemsSource = computed(() => {
  const value = resolveXamlValue(props.ItemsSource, instance);
  if (Array.isArray(value) && value.length) return value;
  return inlineItems.value;
});
const resolvedSelectedIndex = computed(() => {
  const value = resolveXamlValue(props.SelectedIndex, instance);
  return value === undefined || value === '' ? undefined : Number(value);
});
const internalSelectedIndex = ref(resolvedSelectedIndex.value ?? -1);
watch(resolvedSelectedIndex, (value) => {
  if (value !== undefined && value !== internalSelectedIndex.value) internalSelectedIndex.value = value;
});
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

const localizedString = (value) => {
  const key = {
    Blue: 'text.blue',
    Green: 'text.green',
    Red: 'text.red',
    Yellow: 'text.yellow',
    White: 'text.white',
    Black: 'sample.black',
    StepValues: 'sample.step-values',
    Ticks: 'sample.ticks'
  }[String(value)];
  return key ? t(key) : String(value);
};
const normalizedItems = computed(() => resolvedItemsSource.value.map((item) => {
  if (typeof item === 'string' || typeof item === 'number') return { Text: localizedString(item), Value: item };
  return { ...item, Text: item.Text ?? item.Content ?? String(item), Value: item.Value ?? item };
}));
// A OneWay XAML binding supplies the initial selection but does not make the
// control read-only. Keep the local selection authoritative until the source
// sends a newer value back (TwoWay bindings do that through the emitted update).
const selectedIndexValue = computed(() => internalSelectedIndex.value);
const rootStyle = computed(() => props.Margin ? { margin: xamlThickness(props.Margin) } : {});
const itemsStyle = computed(() => {
  const maxColumns = Math.max(1, Number(props.MaxColumns) || 1);
  return { gridTemplateColumns: maxColumns > 1 ? `repeat(${maxColumns}, max-content)` : 'max-content' };
});

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
