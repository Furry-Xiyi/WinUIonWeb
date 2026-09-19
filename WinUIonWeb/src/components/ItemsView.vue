<template>
  <ScrollViewer
    ref="rootRef"
    class="win-items-view"
    role="listbox"
    :Width="resolvedWidth"
    :Height="resolvedHeight"
    :HorizontalAlignment="resolvedHorizontalAlignment"
    :VerticalAlignment="resolvedVerticalAlignment"
    :style="rootStyle"
    VerticalScrollMode="Auto"
    VerticalScrollBarVisibility="Auto"
    HorizontalScrollMode="Auto"
    HorizontalScrollBarVisibility="Auto">
    <div class="win-items-view-layout" :class="layoutClass" :style="viewStyle">
      <div
        v-for="(item, index) in items"
        :key="getItemKey(item, index)"
        class="win-items-view-item"
        :class="{ selected: isSelected(item), invokable: resolvedIsItemInvokedEnabled }"
        :data-index="index"
        :aria-selected="isSelected(item)"
        :tabindex="isEnabled && (resolvedSelectionMode !== 'None' || resolvedIsItemInvokedEnabled) ? 0 : -1"
        role="option"
        @click="onItemClick($event, item, index)"
        @dblclick="onItemDoubleClick($event, item, index)"
        @keydown.enter.prevent="onItemEnter($event, item, index)"
        @keydown.space.prevent="onItemClick($event, item, index)">
        <CheckBox
          v-if="showsSelectionCheckBox"
          class="selection-checkbox"
          :IsChecked="isSelected(item)"
          @update:IsChecked="onCheckBoxChanged($event, item, index)"
          @click.stop
          @keydown.stop />

        <component :is="itemComponent(item, index)" />
      </div>
    </div>
  </ScrollViewer>
</template>

<script>
import { CollectionItemTemplate, CollectionLayout } from './CollectionProperties'

export default {
  ItemTemplate: CollectionItemTemplate,
  Layout: CollectionLayout
}
</script>

<script setup>
import { computed, defineComponent, Fragment, getCurrentInstance, h, ref, shallowRef, toRaw, useAttrs, useSlots, watch } from 'vue';
import CheckBox from './CheckBox.vue';
import ScrollViewer from './ScrollViewer.vue';
import TextBlock from './TextBlock.vue';
import { getCollectionProperty, getLayoutDescriptor, getVNodeChildren } from './CollectionProperties';
import { xamlResourceDictionaryKey } from './Page.vue';
import { materializeXamlVNode, resolveXamlHandler, resolveXamlValue } from './xamlRuntime';

const props = defineProps({
  ItemsSource: { type: [String, Array, Object], default: () => [] },
  ItemTemplate: { type: [String, Object, Function], default: undefined },
  ItemTemplateSelector: { type: [String, Object, Function], default: undefined },
  Layout: { type: [String, Object], default: 'StackLayout' },
  SelectionMode: {
    type: String,
    default: 'None',
    validator: (value) => typeof value === 'string' && (value.startsWith('{') || ['None', 'Single', 'Multiple', 'Extended'].includes(value))
  },
  SelectedItem: { type: null, default: undefined },
  SelectedItems: { type: Array, default: () => [] },
  IsItemInvokedEnabled: { type: Boolean, default: false },
  IsEnabled: { type: [Boolean, String], default: true },
  Width: { type: [String, Number], default: undefined },
  Height: { type: [String, Number], default: undefined },
  MinWidth: { type: [String, Number], default: undefined },
  MinHeight: { type: [String, Number], default: undefined },
  MaxWidth: { type: [String, Number], default: undefined },
  MaxHeight: { type: [String, Number], default: undefined },
  Margin: { type: [String, Number], default: '' },
  Padding: { type: [String, Number], default: '' },
  Background: { type: String, default: 'Transparent' },
  BorderBrush: { type: String, default: '' },
  BorderThickness: { type: [String, Number], default: '' },
  CornerRadius: { type: [String, Number], default: '4' },
  HorizontalAlignment: { type: String, default: 'Stretch' },
  VerticalAlignment: { type: String, default: 'Stretch' }
});

const emit = defineEmits([
  'ItemInvoked',
  'SelectionChanged',
  'update:SelectedItem',
  'update:SelectedItems'
]);

const attrs = useAttrs();

const rootRef = ref(null);
const slots = useSlots();
const instance = getCurrentInstance();
// Property-element VNodes are structural input.  Calling the slot function from
// every item render creates a fresh tree and makes Vue treat the template as a
// changing component definition.  Keep one stable snapshot for the lifetime of
// this ItemsView; bindings inside the snapshot are still resolved per item.
const slotNodes = shallowRef(slots.default?.() ?? []);
const itemTemplateNodes = computed(() => {
  for (const node of slotNodes.value) {
    if (getCollectionProperty(node) === 'itemTemplate') return getVNodeChildren(node);
  }
  return [];
});
const boundItemTemplate = computed(() => resolveXamlValue(props.ItemTemplate, instance));
const itemTemplateForLayout = (layoutName) => {
  const templateName = `${layoutName}ItemTemplate`;
  let owner = instance;
  while (owner && !owner.provides?.[xamlResourceDictionaryKey]) owner = owner.parent;
  const resources = owner?.provides?.[xamlResourceDictionaryKey];
  const candidate = resources?.[templateName];
  if (!candidate || typeof candidate !== 'object') return undefined;
  const rootNodes = Array.isArray(candidate.children) ? candidate.children : typeof candidate.children === 'object' ? candidate.children.default?.() ?? [] : [];
  const template = rootNodes.find((node) => node.type?.name === 'DataTemplate' || node.type?.__name === 'DataTemplate');
  return template ? getVNodeChildren({ ...template, children: template.children }) : undefined;
};
const layoutNodes = computed(() => {
  for (const node of slotNodes.value) {
    if (getCollectionProperty(node) === 'layout') return getVNodeChildren(node);
  }
  return [];
});
const itemComponentCache = new Map();
const itemComponent = (item, index) => {
  const key = item && typeof item === 'object'
    ? item
    : `primitive:${index}:${String(item ?? '')}`;
  let component = itemComponentCache.get(key);
  if (component) return component;
  component = defineComponent({
    name: 'ItemsViewItemTemplate',
    setup() {
      return () => {
        if (Array.isArray(boundItemTemplate.value)) return h(Fragment, materializeXamlVNode(boundItemTemplate.value, item, instance));
        const template = itemTemplateForLayout(normalizedLayout.value.Type);
        if (Array.isArray(template)) return h(Fragment, materializeXamlVNode(template, item, instance));
        if (itemTemplateNodes.value.length) return h(Fragment, materializeXamlVNode(itemTemplateNodes.value, item, instance));
        const slot = slots.item;
        return slot ? h(Fragment, slot({ item, index })) : h(TextBlock, { Text: String(item ?? '') });
      };
    }
  });
  itemComponentCache.set(key, component);
  return component;
};
const selectionAnchorIndex = ref(-1);

const items = computed(() => {
  const source = resolveXamlValue(props.ItemsSource, instance);
  return Array.isArray(source) ? source : [];
});
const isEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance) !== false);

const normalizedLayout = computed(() => {
  const boundLayout = resolveXamlValue(props.Layout, instance);
  const boundDescriptor = typeof boundLayout === 'object' && boundLayout !== null ? boundLayout : null;
  const selectedNode = layoutNodes.value.find((node) => {
    const nodeType = node.type;
    const typeName = typeof nodeType === 'string' ? nodeType : nodeType?.__layoutType || nodeType?.name || nodeType?.__name;
    return typeName === boundLayout;
  });
  const rawLayout = boundDescriptor ?? (selectedNode ? getLayoutDescriptor([selectedNode]) : layoutNodes.value.length ? getLayoutDescriptor([layoutNodes.value[0]]) : boundLayout);
  const source = typeof rawLayout === 'object' && rawLayout !== null
    ? Object.fromEntries(Object.entries(rawLayout).map(([key, value]) => [key, resolveXamlValue(value, instance)]))
    : { Type: rawLayout };
  const type = source.Type ?? 'StackLayout';
  const linedFlowTemplate = type === 'LinedFlowLayout';

  return {
    Type: type,
    Orientation: source.Orientation ?? 'Vertical',
    Spacing: Number(source.Spacing ?? source.LineSpacing ?? 0),
    MinItemWidth: Number(source.MinItemWidth ?? source.ItemWidth ?? (linedFlowTemplate ? 70 : 150)),
    MinItemHeight: Number(source.MinItemHeight ?? source.ItemHeight ?? (linedFlowTemplate ? 0 : 80)),
    MinRowSpacing: Number(source.MinRowSpacing ?? source.LineSpacing ?? 0),
    MinColumnSpacing: Number(source.MinColumnSpacing ?? source.MinItemSpacing ?? 0),
    MaximumRowsOrColumns: Number(source.MaximumRowsOrColumns ?? 0),
    LineHeight: Number(source.LineHeight ?? 160),
    ItemsStretch: source.ItemsStretch ?? 'None'
  };
});

const layoutClass = computed(() => {
  const layout = normalizedLayout.value;
  return [
    `layout-${layout.Type.toLowerCase()}`,
    layout.Orientation === 'Horizontal' ? 'orientation-horizontal' : 'orientation-vertical'
  ];
});

const viewStyle = computed(() => {
  const layout = normalizedLayout.value;
  const style = {
    '--items-view-spacing': `${layout.Spacing}px`,
    '--items-view-min-item-width': `${layout.MinItemWidth}px`,
    '--items-view-min-item-height': `${layout.MinItemHeight}px`,
    '--items-view-row-spacing': `${layout.MinRowSpacing}px`,
    '--items-view-column-spacing': `${layout.MinColumnSpacing}px`,
    '--items-view-line-height': `${layout.LineHeight}px`
  };

  if (layout.MaximumRowsOrColumns > 0 && layout.Type === 'UniformGridLayout') {
    style['--items-view-grid-template'] = `repeat(${layout.MaximumRowsOrColumns}, max-content)`;
  }

  if (layout.Type === 'LinedFlowLayout') {
    style['--items-view-lined-grid-template'] = `repeat(auto-fill, minmax(${Math.max(70, layout.MinItemWidth)}px, max-content))`;
    style['--items-view-lined-item-height'] = `${layout.LineHeight}px`;
    style['--items-view-lined-item-width'] = `${Math.max(70, layout.MinItemWidth)}px`;
  }

  return style;
});

const resolvedSelectionMode = computed(() => resolveXamlValue(props.SelectionMode, instance) ?? 'None');
const resolvedIsItemInvokedEnabled = computed(() => resolveXamlValue(props.IsItemInvokedEnabled, instance) === true);
const resolvedWidth = computed(() => resolveXamlValue(props.Width, instance));
const resolvedHeight = computed(() => resolveXamlValue(props.Height, instance));
const resolvedHorizontalAlignment = computed(() => resolveXamlValue(props.HorizontalAlignment, instance) ?? 'Stretch');
const resolvedVerticalAlignment = computed(() => resolveXamlValue(props.VerticalAlignment, instance) ?? 'Stretch');
const cssLength = (value) => value === undefined || value === null || value === '' ? undefined : (typeof value === 'number' || /^-?\d+(?:\.\d+)?$/.test(String(value)) ? `${value}px` : String(value));
const xamlThickness = (value) => {
  const parts = String(value ?? '').split(',').map((part) => cssLength(part.trim())).filter(Boolean);
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return undefined;
};
const rootStyle = computed(() => ({
  width: cssLength(resolveXamlValue(props.Width, instance)),
  height: cssLength(resolveXamlValue(props.Height, instance)),
  minWidth: cssLength(resolveXamlValue(props.MinWidth, instance)),
  minHeight: cssLength(resolveXamlValue(props.MinHeight, instance)),
  maxWidth: cssLength(resolveXamlValue(props.MaxWidth, instance)),
  maxHeight: cssLength(resolveXamlValue(props.MaxHeight, instance)),
  margin: xamlThickness(resolveXamlValue(props.Margin, instance)),
  padding: xamlThickness(resolveXamlValue(props.Padding, instance)),
  background: resolveXamlValue(props.Background, instance) === 'Transparent' ? 'transparent' : resolveXamlValue(props.Background, instance),
  borderColor: resolveXamlValue(props.BorderBrush, instance) || undefined,
  borderWidth: xamlThickness(resolveXamlValue(props.BorderThickness, instance)) || undefined,
  borderStyle: props.BorderThickness !== '' && props.BorderThickness !== 0 ? 'solid' : undefined,
  borderRadius: cssLength(resolveXamlValue(props.CornerRadius, instance))
}));
const selectedItemsValue = computed(() => {
  const boundSelectedItems = resolveXamlValue(props.SelectedItems, instance);
  const boundSelectedItem = resolveXamlValue(props.SelectedItem, instance);
  if (resolvedSelectionMode.value === 'Single') {
    return boundSelectedItem === undefined ? (Array.isArray(boundSelectedItems) ? boundSelectedItems : []) : [boundSelectedItem];
  }
  return Array.isArray(boundSelectedItems) ? boundSelectedItems : [];
});

const showsSelectionCheckBox = computed(() => resolvedSelectionMode.value === 'Multiple' || resolvedSelectionMode.value === 'Extended');

const isSameItem = (left, right) => toRaw(left) === toRaw(right);
const isSelected = (item) => selectedItemsValue.value.some((selected) => isSameItem(selected, item));

const getItemKey = (item, index) => {
  if (item && typeof item === 'object') {
    return item.Id ?? item.ID ?? item.id ?? item.Key ?? item.key ?? item.Title ?? item.title ?? index;
  }
  return index;
};

const setSelection = (newSelection, originalSource) => {
  const oldSelection = selectedItemsValue.value;
  const addedItems = newSelection.filter((item) => !oldSelection.some((oldItem) => isSameItem(oldItem, item)));
  const removedItems = oldSelection.filter((item) => !newSelection.some((newItem) => isSameItem(newItem, item)));

  emit('update:SelectedItems', newSelection);
  emit('update:SelectedItem', newSelection[0] ?? null);
  emit('SelectionChanged', { AddedItems: addedItems, RemovedItems: removedItems, SelectedItems: newSelection, OriginalSource: originalSource });
  resolveXamlHandler(attrs.SelectionChanged, instance)?.({ AddedItems: addedItems, RemovedItems: removedItems, SelectedItems: newSelection, OriginalSource: originalSource });
};

const selectItem = (event, item, index, checkedValue = undefined) => {
  if (!isEnabled.value) return;
  if (resolvedSelectionMode.value === 'None') return;

  if (resolvedSelectionMode.value === 'Single') {
    selectionAnchorIndex.value = index;
    setSelection([item], event?.target);
    return;
  }

  let newSelection = [...selectedItemsValue.value];
  const selectedIndex = newSelection.findIndex((selected) => isSameItem(selected, item));

  if (resolvedSelectionMode.value === 'Multiple') {
    if (checkedValue === true || (checkedValue === undefined && selectedIndex === -1)) {
      if (selectedIndex === -1) newSelection.push(item);
    } else if (selectedIndex !== -1) {
      newSelection.splice(selectedIndex, 1);
    }
    selectionAnchorIndex.value = index;
    setSelection(newSelection, event?.target);
    return;
  }

  if (event?.shiftKey && selectionAnchorIndex.value !== -1) {
    const start = Math.min(selectionAnchorIndex.value, index);
    const end = Math.max(selectionAnchorIndex.value, index);
    newSelection = items.value.slice(start, end + 1);
  } else if (event?.ctrlKey || checkedValue !== undefined) {
    if (checkedValue === true || (checkedValue === undefined && selectedIndex === -1)) {
      if (selectedIndex === -1) newSelection.push(item);
    } else if (selectedIndex !== -1) {
      newSelection.splice(selectedIndex, 1);
    }
    selectionAnchorIndex.value = index;
  } else {
    newSelection = [item];
    selectionAnchorIndex.value = index;
  }

  setSelection(newSelection, event?.target);
};

const onItemClick = (event, item, index) => {
  if (resolvedIsItemInvokedEnabled.value && resolvedSelectionMode.value !== 'None') invokeItem(event, item, index);
  selectItem(event, item, index);
};
const onItemDoubleClick = (event, item, index) => {
  if (resolvedSelectionMode.value === 'None') invokeItem(event, item, index);
};
const onItemEnter = (event, item, index) => {
  if (resolvedSelectionMode.value !== 'None') invokeItem(event, item, index);
};
const onCheckBoxChanged = (checked, item, index) => selectItem({ target: rootRef.value }, item, index, checked === true);

const invokeItem = (event, item, index) => {
  if (!isEnabled.value || !resolvedIsItemInvokedEnabled.value) return;
  emit('ItemInvoked', { InvokedItem: item, OriginalSource: event?.target, Index: index });
  resolveXamlHandler(attrs.ItemInvoked, instance)?.({ InvokedItem: item, OriginalSource: event?.target, Index: index });
};

watch(resolvedSelectionMode, () => {
  selectionAnchorIndex.value = -1;
});
</script>

<style scoped>
.win-items-view {
  width: 100%;
  height: auto;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  color: var(--text-primary);
  background: var(--ItemsViewBackground, var(--ControlFillColorTransparent, transparent));
  padding: 0;
  border: 0;
  border-radius: var(--ControlCornerRadius, 4px);
}

.win-items-view-layout {
  display: block;
  width: 100%;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
}

.win-items-view-layout.layout-stacklayout {
  display: flex;
  flex-direction: column;
  gap: var(--items-view-spacing);
  align-items: flex-start;
  width: max-content;
  min-width: 100%;
  min-height: max-content;
}

.win-items-view-layout.layout-stacklayout.orientation-horizontal {
  flex-direction: row;
  width: max-content;
}

.win-items-view-layout.layout-uniformgridlayout {
  display: grid;
  grid-template-columns: var(--items-view-grid-template, repeat(auto-fill, minmax(var(--items-view-min-item-width), max-content)));
  grid-auto-rows: minmax(var(--items-view-min-item-height), max-content);
  column-gap: var(--items-view-column-spacing);
  row-gap: var(--items-view-row-spacing);
  width: max-content;
  min-width: 100%;
  align-content: start;
}

.win-items-view-layout.layout-uniformgridlayout .win-items-view-item {
  width: var(--items-view-min-item-width);
  min-height: var(--items-view-min-item-height);
}

.win-items-view-layout.layout-linedflowlayout {
  display: grid;
  grid-template-columns: var(--items-view-lined-grid-template, repeat(auto-fill, minmax(70px, 1fr)));
  grid-auto-rows: var(--items-view-lined-item-height, 160px);
  column-gap: var(--items-view-column-spacing);
  row-gap: var(--items-view-row-spacing);
  width: 100%;
  align-content: start;
}

.win-items-view-layout.layout-linedflowlayout .win-items-view-item {
  width: 100%;
  min-height: var(--items-view-lined-item-height, 160px);
}

.win-items-view-item {
  position: relative;
  min-width: 0;
  box-sizing: border-box;
  border-radius: var(--ControlCornerRadius, 4px);
  outline: none;
  color: var(--text-primary);
  background: var(--ItemsViewItemBackground, var(--ControlFillColorTransparentBrush, transparent));
  border: 1px solid transparent;
  padding: 0;
  overflow: hidden;
  flex: 0 0 auto;
  min-height: var(--items-view-min-item-height, 0px);
}

.win-items-view-layout.layout-stacklayout .win-items-view-item {
  width: max-content;
  max-width: 100%;
  min-height: max-content;
}

.win-items-view-item.invokable {
  cursor: pointer;
}

.win-items-view-item:hover {
  background: var(--ItemsViewItemBackgroundPointerOver, var(--subtle-secondary));
}

.win-items-view-item:active {
  background: var(--subtle-tertiary);
}

.win-items-view-item:focus-visible {
  outline: 2px solid var(--focus-stroke-outer, var(--text-primary));
  outline-offset: 1px;
}

.win-items-view-item.selected {
  background: var(--ItemsViewItemBackgroundSelected, var(--subtle-secondary));
  outline: 1px solid var(--ItemsViewItemBorderBrushSelected, var(--accent-base));
  outline-offset: -1px;
}

/* ItemsView owns the ScrollViewer viewport.  The content must be measured from
   the collection panel instead of stretching a flex child to the viewport's
   height; otherwise the default StackLayout leaves the first item at the
   bottom of a fixed-height view. */
.win-items-view :deep(.win-scroll-viewer-viewport) {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}

.win-items-view :deep(.scroll-content) {
  width: max-content;
  min-width: 100%;
  min-height: 100%;
  height: max-content;
}

.selection-checkbox {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 1;
  background: transparent;
  border-radius: 0;
  padding: 0;
}
</style>
