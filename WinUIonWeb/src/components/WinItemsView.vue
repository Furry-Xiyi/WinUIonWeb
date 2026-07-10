<template>
  <div ref="rootRef" class="win-items-view" :class="layoutClass" :style="viewStyle" role="listbox">
    <div
      v-for="(item, index) in items"
      :key="getItemKey(item, index)"
      class="win-items-view-item"
      :class="{ selected: isSelected(item), invokable: IsItemInvokedEnabled }"
      :data-index="index"
      :aria-selected="isSelected(item)"
      :tabindex="0"
      role="option"
      @click="onItemClick($event, item, index)"
      @dblclick="invokeItem($event, item, index)"
      @keydown.enter.prevent="invokeItem($event, item, index)"
      @keydown.space.prevent="onItemClick($event, item, index)">
      <WinCheckBox
        v-if="showsSelectionCheckBox"
        class="selection-checkbox"
        :IsChecked="isSelected(item)"
        @update:IsChecked="onCheckBoxChanged($event, item, index)"
        @click.stop
        @keydown.stop />

      <slot name="item" :item="item" :index="index">
        <slot :item="item" :index="index">
          <WinTextBlock :Text="String(item)" />
        </slot>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, toRaw, watch } from 'vue';
import WinCheckBox from './WinCheckBox.vue';
import WinTextBlock from './WinTextBlock.vue';

const props = defineProps({
  ItemsSource: { type: Array, default: () => [] },
  ItemTemplate: { type: [String, Object, Function], default: undefined },
  Layout: { type: [String, Object], default: 'StackLayout' },
  SelectionMode: {
    type: String,
    default: 'None',
    validator: (value) => ['None', 'Single', 'Multiple', 'Extended'].includes(value)
  },
  SelectedItem: { type: null, default: undefined },
  SelectedItems: { type: Array, default: () => [] },
  IsItemInvokedEnabled: { type: Boolean, default: false }
});

const emit = defineEmits([
  'ItemInvoked',
  'SelectionChanged',
  'update:SelectedItem',
  'update:SelectedItems'
]);

const rootRef = ref(null);
const selectionAnchorIndex = ref(-1);

const items = computed(() => props.ItemsSource ?? []);

const normalizedLayout = computed(() => {
  const layout = props.Layout;
  const source = typeof layout === 'object' && layout !== null ? layout : { Type: layout };
  const type = source.Type ?? source.type ?? 'StackLayout';

  return {
    Type: type,
    Orientation: source.Orientation ?? source.orientation ?? 'Vertical',
    Spacing: Number(source.Spacing ?? source.spacing ?? source.LineSpacing ?? source.lineSpacing ?? 0),
    MinItemWidth: Number(source.MinItemWidth ?? source.minItemWidth ?? source.ItemWidth ?? source.itemWidth ?? 150),
    MinItemHeight: Number(source.MinItemHeight ?? source.minItemHeight ?? source.ItemHeight ?? source.itemHeight ?? 80),
    MinRowSpacing: Number(source.MinRowSpacing ?? source.minRowSpacing ?? source.LineSpacing ?? source.lineSpacing ?? 0),
    MinColumnSpacing: Number(source.MinColumnSpacing ?? source.minColumnSpacing ?? source.MinItemSpacing ?? source.minItemSpacing ?? 0),
    MaximumRowsOrColumns: Number(source.MaximumRowsOrColumns ?? source.maximumRowsOrColumns ?? 0),
    LineHeight: Number(source.LineHeight ?? source.lineHeight ?? 160)
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

  if (layout.MaximumRowsOrColumns > 0) {
    style['--items-view-grid-template'] = `repeat(${layout.MaximumRowsOrColumns}, max-content)`;
  }

  return style;
});

const selectedItemsValue = computed(() => {
  if (props.SelectionMode === 'Single') {
    return props.SelectedItem === undefined ? props.SelectedItems : [props.SelectedItem];
  }
  return props.SelectedItems;
});

const showsSelectionCheckBox = computed(() => props.SelectionMode === 'Multiple' || props.SelectionMode === 'Extended');

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
};

const selectItem = (event, item, index, checkedValue = undefined) => {
  if (props.SelectionMode === 'None') return;

  if (props.SelectionMode === 'Single') {
    selectionAnchorIndex.value = index;
    setSelection([item], event?.target);
    return;
  }

  let newSelection = [...selectedItemsValue.value];
  const selectedIndex = newSelection.findIndex((selected) => isSameItem(selected, item));

  if (props.SelectionMode === 'Multiple') {
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

const onItemClick = (event, item, index) => selectItem(event, item, index);
const onCheckBoxChanged = (checked, item, index) => selectItem({ target: rootRef.value }, item, index, checked === true);

const invokeItem = (event, item, index) => {
  if (!props.IsItemInvokedEnabled) return;
  emit('ItemInvoked', { InvokedItem: item, OriginalSource: event?.target, Index: index });
};

watch(() => props.SelectionMode, () => {
  selectionAnchorIndex.value = -1;
});
</script>

<style scoped>
.win-items-view {
  width: 100%;
  height: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow: auto;
  color: var(--text-primary);
  scrollbar-width: thin;
}

.win-items-view.layout-stacklayout {
  display: flex;
  flex-direction: column;
  gap: var(--items-view-spacing);
}

.win-items-view.layout-uniformgridlayout {
  display: grid;
  grid-template-columns: var(--items-view-grid-template, repeat(auto-fill, minmax(var(--items-view-min-item-width), 1fr)));
  grid-auto-rows: minmax(var(--items-view-min-item-height), max-content);
  column-gap: var(--items-view-column-spacing);
  row-gap: var(--items-view-row-spacing);
}

.win-items-view.layout-linedflowlayout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--items-view-min-item-width), 1fr));
  grid-auto-rows: var(--items-view-line-height);
  column-gap: var(--items-view-column-spacing);
  row-gap: var(--items-view-row-spacing);
}

.win-items-view-item {
  position: relative;
  min-width: 0;
  box-sizing: border-box;
  border-radius: 4px;
  outline: none;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid transparent;
}

.win-items-view-item.invokable {
  cursor: pointer;
}

.win-items-view-item:hover {
  background: var(--subtle-secondary);
}

.win-items-view-item:active {
  background: var(--subtle-tertiary);
}

.win-items-view-item:focus-visible {
  outline: 2px solid var(--focus-stroke-outer, var(--text-primary));
  outline-offset: 1px;
}

.win-items-view-item.selected {
  background: var(--subtle-secondary);
  border-color: var(--accent-base);
}

.layout-stacklayout .win-items-view-item.selected {
  border-left-width: 3px;
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
