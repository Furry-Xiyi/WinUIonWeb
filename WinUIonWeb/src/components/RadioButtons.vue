<template>
  <div class="win-radio-buttons" :class="{ 'is-disabled': !resolvedIsEnabled }" :style="rootStyle">
    <TextBlock v-if="resolvedHeader" class="win-radio-buttons-header" :Text="resolvedHeader" />
    <div class="win-radio-buttons-items" :style="itemsStyle">
      <RadioButton
        v-for="(item, index) in normalizedItems"
        :key="index"
        :Content="item.Text"
        :IsChecked="selectedIndexValue === index"
        :IsEnabled="resolvedIsEnabled" />
      <slot v-if="normalizedItems.length === 0" />
    </div>
  </div>
</template>

<script setup>
import { computed, Fragment, getCurrentInstance, nextTick, onMounted, provide, ref, useAttrs, useSlots, watch } from 'vue';
import RadioButton from './RadioButton.vue';
import TextBlock from './TextBlock.vue';
import { useI18n } from './i18n/index';
import { resolveXamlHandler, resolveXamlValue, updateXamlBinding } from './xamlRuntime';

const radioButtonsGroupKey = Symbol.for('WinUIonWeb.RadioButtons');

const props = defineProps({
  Header: { type: [String, Number], default: '' },
  ItemsSource: { type: [Array, String], default: () => [] },
  SelectedIndex: { type: [Number, String], default: undefined },
  SelectedItem: { type: null, default: undefined },
  MaxColumns: { type: [Number, String], default: 1 },
  IsEnabled: { type: [Boolean, String], default: true },
  Margin: { type: String, default: '' },
  DisplayMemberPath: { type: [String, Number], default: '' }
});

const emit = defineEmits(['update:SelectedIndex', 'update:SelectedItem', 'SelectionChanged']);

const instance = getCurrentInstance();
const attrs = useAttrs();
const slots = useSlots();
const groupName = `win-radio-buttons-${instance.uid}`;
const registeredItems = new Map();
const registrationVersion = ref(0);
const inlineRadioItems = computed(() => {
  const visit = (nodes) => (Array.isArray(nodes) ? nodes : [nodes]).flatMap((node) => {
    if (!node) return [];
    if (node.type === Fragment) return visit(node.children);
    const name = typeof node.type === 'string' ? node.type : node.type?.name ?? node.type?.__name;
    return name === 'RadioButton' ? [{ ...node.props }] : [];
  });
  return visit(slots.default?.() ?? []);
});
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
      if (type === Fragment) { visit(node.children); return; }
      if (type?.__xamlString || typeName === 'x:String') {
        const resourceId = node.props?.['x:Uid'];
        const text = resourceId ? t(String(resourceId)) : textFromNode(node).trim();
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
let nextSlotIndex = 0;
let isLoaded = false;

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
const GetPathValue = (item, path) => path ? path.split('.').reduce((value, key) => value?.[key], item) : item;
const normalizedItems = computed(() => resolvedItemsSource.value.map((item) => {
  if (typeof item === 'string' || typeof item === 'number') return { Text: localizedString(item), Value: item };
  const displayPath = resolveXamlValue(props.DisplayMemberPath, instance);
  const display = displayPath ? GetPathValue(item, displayPath) : (item.Text ?? item.Content ?? item.label ?? item.Name ?? item.Value);
  return { ...item, Text: display === undefined || display === null ? '' : String(display), Value: item.Value ?? item };
}));
// A OneWay XAML binding supplies the initial selection but does not make the
// control read-only. Keep the local selection authoritative until the source
// sends a newer value back (TwoWay bindings do that through the emitted update).
const selectedIndexValue = computed(() => internalSelectedIndex.value);
const rootStyle = computed(() => props.Margin ? { margin: xamlThickness(resolveXamlValue(props.Margin, instance)) } : {});
const itemsStyle = computed(() => {
  const maxColumns = Math.max(1, Number(resolveXamlValue(props.MaxColumns, instance)) || 1);
  return { gridTemplateColumns: maxColumns > 1 ? `repeat(${maxColumns}, max-content)` : 'max-content' };
});

const itemAt = (index) => {
  registrationVersion.value;
  if (index < 0) return undefined;
  if (normalizedItems.value.length) return normalizedItems.value[index]?.Value;
  return registeredItems.get(index)?.getItem() ?? inlineRadioItems.value[index];
};
const selectedItemValue = computed(() => itemAt(selectedIndexValue.value));
const eventSender = {
  get SelectedIndex() { return selectedIndexValue.value; },
  set SelectedIndex(value) { select(Number(value), false); },
  get SelectedItem() { return selectedItemValue.value; },
  set SelectedItem(value) { selectItem(value); },
  get Header() { return resolvedHeader.value; },
  get IsEnabled() { return resolvedIsEnabled.value; }
};
const notifySelection = (previousIndex) => {
  const oldItem = itemAt(previousIndex);
  const newItem = selectedItemValue.value;
  const index = selectedIndexValue.value;
  emit('update:SelectedIndex', index);
  emit('update:SelectedItem', newItem);
  updateXamlBinding(props.SelectedIndex, index, instance);
  updateXamlBinding(props.SelectedItem, newItem, instance);
  const args = {
    SelectedIndex: index,
    SelectedItem: newItem,
    AddedItems: newItem === undefined ? [] : [newItem],
    RemovedItems: oldItem === undefined ? [] : [oldItem]
  };
  emit('SelectionChanged', eventSender, args);
  resolveXamlHandler(attrs.SelectionChanged, instance)?.(eventSender, args);
};
const select = (index, userInitiated = true) => {
  if (userInitiated && (!resolvedIsEnabled.value || registeredItems.get(index)?.isEnabled() === false)) return;
  const count = normalizedItems.value.length || inlineRadioItems.value.length;
  const nextIndex = Number.isInteger(index) && index >= 0 && index < count ? index : -1;
  if (nextIndex === selectedIndexValue.value) return;
  const previousIndex = selectedIndexValue.value;
  internalSelectedIndex.value = nextIndex;
  if (isLoaded) notifySelection(previousIndex);
};
const selectItem = (item) => {
  const count = normalizedItems.value.length || inlineRadioItems.value.length;
  const index = Array.from({ length: count }, (_, index) => index).find((index) => Object.is(itemAt(index), item));
  select(index ?? -1, false);
};
const navigate = (index, event) => {
  const direction = { ArrowDown: 1, ArrowUp: -1, ArrowRight: 1, ArrowLeft: -1 }[event.key];
  if (direction === undefined) return;
  // Prevent the browser's radio-group wraparound: WinUI contains directional
  // focus at the first and last item, and left/right move spatially.
  event.preventDefault();
  if (!resolvedIsEnabled.value) return;
  const horizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
  const currentBounds = registeredItems.get(index)?.getBounds();
  let candidates = [...registeredItems.entries()].filter(([candidateIndex, item]) => candidateIndex !== index && item.isEnabled());
  if (horizontal && currentBounds) {
    candidates = candidates.filter(([, item]) => {
      const bounds = item.getBounds();
      return bounds && bounds.top < currentBounds.bottom && bounds.bottom > currentBounds.top
        && (direction > 0 ? bounds.left >= currentBounds.right : bounds.right <= currentBounds.left);
    }).sort(([, a], [, b]) => Math.abs(a.getBounds().left - currentBounds.left) - Math.abs(b.getBounds().left - currentBounds.left));
  } else {
    candidates = candidates.filter(([candidateIndex]) => direction > 0 ? candidateIndex > index : candidateIndex < index)
      .sort(([a], [b]) => direction > 0 ? a - b : b - a);
  }
  const target = candidates[0];
  if (!target) return;
  target[1].focus();
  if (!event.ctrlKey) select(target[0]);
};

watch(resolvedSelectedIndex, (value) => {
  if (value !== undefined) select(value, false);
});
watch(() => resolveXamlValue(props.SelectedItem, instance), (item) => {
  if (item !== undefined) selectItem(item);
});
onMounted(async () => {
  // All x:Name children must be registered before the page's initial handler
  // reads their IsChecked values, just as the official repeater Loaded path.
  await nextTick();
  if (resolvedSelectedIndex.value === undefined && props.SelectedItem !== undefined) selectItem(resolveXamlValue(props.SelectedItem, instance));
  const count = normalizedItems.value.length || inlineRadioItems.value.length;
  if (selectedIndexValue.value >= count) internalSelectedIndex.value = -1;
  isLoaded = true;
  if (selectedIndexValue.value >= 0) notifySelection(-1);
});

provide(radioButtonsGroupKey, {
  name: groupName,
  isEnabled: resolvedIsEnabled,
  selectedIndex: selectedIndexValue,
  register: (item) => {
    const index = nextSlotIndex++;
    registeredItems.set(index, item);
    registrationVersion.value++;
    return index;
  },
  unregister: (index) => {
    registeredItems.delete(index);
    registrationVersion.value++;
  },
  initialize: (index) => {
    if (selectedIndexValue.value < 0 && resolvedSelectedIndex.value === undefined) select(index, false);
  },
  tabIndex: (index) => {
    registrationVersion.value;
    const entry = [...registeredItems.entries()].find(([, item]) => item.isEnabled());
    return index === (selectedIndexValue.value >= 0 ? selectedIndexValue.value : entry?.[0]) ? 0 : -1;
  },
  navigate,
  select
});

defineExpose({
  SelectedIndex: computed({ get: () => selectedIndexValue.value, set: (value) => select(Number(value), false) }),
  SelectedItem: computed({ get: () => selectedItemValue.value, set: selectItem }),
  Header: resolvedHeader,
  IsEnabled: resolvedIsEnabled
});
</script>
