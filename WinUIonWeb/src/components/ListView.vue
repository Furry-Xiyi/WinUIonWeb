<template>
  <div
    ref="containerRef"
    class="win-list-view"
    :class="{ disabled: !IsEnabled }"
    :style="rootStyle"
    role="listbox"
    :aria-disabled="!IsEnabled"
    :aria-multiselectable="SelectionMode === 'Multiple' || SelectionMode === 'Extended'">
    <WinScrollViewer
      class="win-list-viewport"
      VerticalScrollMode="Auto"
      VerticalScrollBarVisibility="Auto"
      HorizontalScrollMode="Disabled"
      HorizontalScrollBarVisibility="Disabled">
      <div ref="listRef"
           class="win-list-content"
           @dragover.prevent="onViewportDragOver"
           @drop.prevent="onViewportDrop"
           @dragleave="onViewportDragLeave">
        <template v-if="isGrouped">
          <div v-for="(group, gIdx) in items" :key="getGroupKey(group, gIdx)" class="win-list-group">
            <div class="win-list-header" :class="{ sticky: stickyHeader }">
              <slot name="header" :group="group">{{ getGroupTitle(group) }}</slot>
            </div>
            <div v-for="(item, idx) in getGroupItems(group)" :key="getItemKey(item, idx)"
                 class="win-list-item"
                 :class="itemClasses(item)"
                 :style="itemContainerStyle"
                 :draggable="canDragItems"
                 :tabindex="IsEnabled && SelectionMode !== 'None' ? 0 : -1"
                 :aria-selected="SelectionMode === 'None' ? undefined : isSelected(item)"
                 @click="onItemClick($event, item)"
                 @keydown.enter.prevent="onItemClick($event, item)"
                 @keydown.space.prevent="onItemClick($event, item)"
                 @dragstart="onDragStartGrouped($event, {gIdx, idx})"
                 @dragover.prevent
                 @drop.prevent>
              <span
                v-if="selectionMode === 'Multiple'"
                class="list-selection-box"
                :class="{ checked: isSelected(item) }"
                aria-hidden="true">&#xE73E;</span>
              <slot name="item" :item="item" :index="idx" :group="group"></slot>
              <div
                v-if="selectionMode === 'Single' || selectionMode === 'Extended'"
                class="win-list-view-selection-indicator"
                :class="{ active: isSelected(item) }"
                aria-hidden="true"></div>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-for="(item, idx) in internalItems" :key="getItemKey(item, idx)"
               ref="itemEls"
               class="win-list-item"
               :class="itemClasses(item, idx)"
               :style="[itemContainerStyle, getItemStyle(idx)]"
               :draggable="canDragItems"
               :tabindex="IsEnabled && SelectionMode !== 'None' ? 0 : -1"
               :aria-selected="SelectionMode === 'None' ? undefined : isSelected(item)"
               @click="onItemClick($event, item)"
               @keydown.enter.prevent="onItemClick($event, item)"
               @keydown.space.prevent="onItemClick($event, item)"
               @dragstart="onDragStart($event, idx)"
               @dragend="onDragEnd">
            <span
              v-if="selectionMode === 'Multiple'"
              class="list-selection-box"
              :class="{ checked: isSelected(item) }"
              aria-hidden="true">&#xE73E;</span>
            <slot name="item" :item="item" :index="idx"></slot>
            <div
              v-if="selectionMode === 'Single' || selectionMode === 'Extended'"
              class="win-list-view-selection-indicator"
              :class="{ active: isSelected(item) }"
              aria-hidden="true"></div>
          </div>
        </template>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, toRaw, watch } from 'vue';
import type { CSSProperties } from 'vue';
import WinScrollViewer from './WinScrollViewer.vue';

defineSlots<{
  item(props: { item: any; index: number; group?: any }): any;
  header(props: { group: any }): any;
}>();

type ListViewSelectionMode = 'None' | 'Single' | 'Multiple' | 'Extended';
type ListViewItemStyle = {
  Height?: string | number;
  MinHeight?: string | number;
  Padding?: string | number;
  BorderBrush?: string;
  BorderThickness?: string | number;
  CornerRadius?: string | number;
  HorizontalContentAlignment?: 'Left' | 'Center' | 'Right' | 'Stretch';
  VerticalContentAlignment?: 'Top' | 'Center' | 'Bottom' | 'Stretch';
};

const props = withDefaults(defineProps<{
  ItemsSource?: unknown[];
  IsGrouped?: boolean;
  IsItemClickEnabled?: boolean;
  CanDragItems?: boolean;
  CanReorderItems?: boolean;
  AllowDrop?: boolean;
  AreStickyGroupHeadersEnabled?: boolean;
  SelectionMode?: ListViewSelectionMode;
  SelectedItems?: unknown[];
  SelectedItem?: unknown;
  SelectedIndex?: number;
  ItemContainerStyle?: ListViewItemStyle;
  IsEnabled?: boolean;
  Width?: string | number;
  Height?: string | number;
  MinWidth?: string | number;
  MinHeight?: string | number;
  MaxWidth?: string | number;
  MaxHeight?: string | number;
  Margin?: string | number;
  Padding?: string | number;
  Background?: string;
  BorderBrush?: string;
  BorderThickness?: string | number;
  CornerRadius?: string | number;
}>(), {
  ItemsSource: () => [],
  IsGrouped: false,
  IsItemClickEnabled: false,
  CanDragItems: false,
  CanReorderItems: false,
  AllowDrop: false,
  AreStickyGroupHeadersEnabled: false,
  SelectionMode: 'Single',
  SelectedItems: undefined,
  SelectedItem: undefined,
  SelectedIndex: -1,
  ItemContainerStyle: () => ({}),
  IsEnabled: true,
  Width: '',
  Height: '',
  MinWidth: '',
  MinHeight: '',
  MaxWidth: '',
  MaxHeight: '',
  Margin: '',
  Padding: '',
  Background: '',
  BorderBrush: '',
  BorderThickness: '',
  CornerRadius: ''
});

const emit = defineEmits([
  'ItemClick',
  'SelectionChanged',
  'DragItemsStarting',
  'DragItemsCompleted',
  'DragOver',
  'Drop',
  'update:SelectedItems',
  'update:SelectedItem',
  'update:SelectedIndex',
  'update:ItemsSource'
]);

const items = computed(() => props.ItemsSource);
const isGrouped = computed(() => props.IsGrouped);
const isItemClickEnabled = computed(() => props.IsItemClickEnabled);
const canDragItems = computed(() => props.CanDragItems && props.IsEnabled);
const canReorderItems = computed(() => props.CanReorderItems);
const allowDrop = computed(() => props.AllowDrop);
const stickyHeader = computed(() => props.AreStickyGroupHeadersEnabled);
const selectionMode = computed(() => props.SelectionMode);
const getGroupItems = (group: unknown) => ((group as { Items?: unknown[] })?.Items ?? []);
const getGroupKey = (group: unknown, index: number) => {
  const value = group as { Key?: string | number };
  return value?.Key ?? index;
};
const getGroupTitle = (group: unknown) => (group as { Key?: string | number })?.Key ?? '';
const getItemKey = (item: unknown, index: number) => {
  const value = item as { Key?: string | number; Id?: string | number };
  return value?.Key ?? value?.Id ?? index;
};
const internalSelectedItems = ref<unknown[]>([]);
const flatItems = computed(() => isGrouped.value
  ? items.value.flatMap((group) => getGroupItems(group))
  : internalItems.value);
const selectedItems = computed(() => {
  if (props.SelectedItems !== undefined) return props.SelectedItems;
  if (props.SelectedItem !== undefined && props.SelectedItem !== null) return [props.SelectedItem];
  return props.SelectedIndex >= 0 && flatItems.value[props.SelectedIndex] !== undefined
    ? [flatItems.value[props.SelectedIndex]]
    : internalSelectedItems.value;
});

const cssLength = (value: string | number | undefined) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'number' || !Number.isNaN(Number(String(value).trim()))) return `${Number(value)}px`;
  return String(value);
};

const xamlThickness = (value: string | number | undefined) => {
  if (value === '' || value === undefined || value === null) return '';
  const parts = String(value).split(',').map((part) => cssLength(part.trim()));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return String(value);
};

const alignment = (value: string | undefined) => ({
  Left: 'flex-start', Center: 'center', Right: 'flex-end', Stretch: 'stretch',
  Top: 'flex-start', Bottom: 'flex-end'
}[value || ''] || undefined) as CSSProperties['justifyContent'] & CSSProperties['alignItems'];

const rootStyle = computed<CSSProperties>(() => ({
  width: cssLength(props.Width) || undefined,
  height: cssLength(props.Height) || undefined,
  minWidth: cssLength(props.MinWidth) || undefined,
  minHeight: cssLength(props.MinHeight) || undefined,
  maxWidth: cssLength(props.MaxWidth) || undefined,
  maxHeight: cssLength(props.MaxHeight) || undefined,
  margin: xamlThickness(props.Margin) || undefined,
  padding: xamlThickness(props.Padding) || undefined,
  background: props.Background || undefined,
  borderColor: props.BorderBrush || undefined,
  borderWidth: xamlThickness(props.BorderThickness) || undefined,
  borderStyle: props.BorderThickness !== '' && props.BorderThickness !== 0 ? 'solid' : undefined,
  borderRadius: cssLength(props.CornerRadius) || undefined
}));

const itemContainerStyle = computed<CSSProperties>(() => ({
  height: cssLength(props.ItemContainerStyle.Height) || undefined,
  minHeight: cssLength(props.ItemContainerStyle.MinHeight) || undefined,
  padding: xamlThickness(props.ItemContainerStyle.Padding) || undefined,
  borderColor: props.ItemContainerStyle.BorderBrush || undefined,
  borderWidth: xamlThickness(props.ItemContainerStyle.BorderThickness) || undefined,
  borderStyle: props.ItemContainerStyle.BorderThickness !== undefined
    && props.ItemContainerStyle.BorderThickness !== 0 ? 'solid' : undefined,
  borderRadius: cssLength(props.ItemContainerStyle.CornerRadius) || undefined,
  justifyContent: alignment(props.ItemContainerStyle.HorizontalContentAlignment),
  alignItems: alignment(props.ItemContainerStyle.VerticalContentAlignment)
}));

const internalItems = ref<unknown[]>([...items.value]);

watch(items, (val) => {
  internalItems.value = [...val];
  const availableItems = props.IsGrouped ? val.flatMap(group => getGroupItems(group)) : val;
  internalSelectedItems.value = internalSelectedItems.value.filter(selected =>
    availableItems.some(item => toRaw(item) === toRaw(selected)));
}, { deep: true });

const containerRef = ref<HTMLElement>();
const listRef = ref<HTMLElement>();
const itemEls = ref<HTMLElement[]>([]);
const isDragging = ref(false);
const isExternalDragOver = ref(false);
const dragIndices = ref<number[]>([]);
const insertBeforeIndex = ref(-1);
let dragItemHeight = 0;
let anchorIndex: number | null = null;
let lastCalcTime = 0;
let cachedMidpoints: Array<{ index: number; midY: number }> = [];

const isSelected = (item: unknown) => {
  const rawTarget = toRaw(item);
  return selectedItems.value.some(i => toRaw(i) === rawTarget);
};

const itemClasses = (item: unknown, index = -1) => ({
  selected: isSelected(item),
  interactive: props.IsEnabled && selectionMode.value !== 'None',
  'content-stretch': (props.ItemContainerStyle.HorizontalContentAlignment ?? 'Stretch') === 'Stretch',
  'drag-shrink': index >= 0 && isDragging.value && !dragIndices.value.includes(index),
  'dragging-source': index >= 0 && isDragging.value && dragIndices.value.includes(index)
});

const emitSelection = (newSel: unknown[]) => {
  const previous = selectedItems.value;
  const addedItems = newSel.filter(item => !previous.some(current => toRaw(current) === toRaw(item)));
  const removedItems = previous.filter(item => !newSel.some(current => toRaw(current) === toRaw(item)));
  const selectedItem = newSel[0] ?? null;
  const selectedIndex = selectedItem === null
    ? -1
    : flatItems.value.findIndex(item => toRaw(item) === toRaw(selectedItem));

  internalSelectedItems.value = [...newSel];
  emit('update:SelectedItems', newSel);
  emit('update:SelectedItem', selectedItem);
  emit('update:SelectedIndex', selectedIndex);
  emit('SelectionChanged', { AddedItems: addedItems, RemovedItems: removedItems, SelectedItems: newSel });
};

const onItemClick = (event: MouseEvent | KeyboardEvent, item: unknown) => {
  if (!props.IsEnabled || isDragging.value) return;
  const rawTarget = toRaw(item);
  if (isItemClickEnabled.value) {
    emit('ItemClick', { ClickedItem: item, OriginalSource: event.target });
  }
  if (selectionMode.value === 'None') return;

  let newSel = [...selectedItems.value];
  const itemIndex = flatItems.value.findIndex(candidate => toRaw(candidate) === rawTarget);
  if (selectionMode.value === 'Single') {
    newSel = [rawTarget];
    anchorIndex = itemIndex;
  } else if (selectionMode.value === 'Multiple') {
    const idx = newSel.findIndex(i => toRaw(i) === rawTarget);
    if (idx > -1) newSel.splice(idx, 1);
    else newSel.push(rawTarget);
    anchorIndex = itemIndex;
  } else if (selectionMode.value === 'Extended') {
    if (event.ctrlKey) {
      const idx = newSel.findIndex(i => toRaw(i) === rawTarget);
      if (idx > -1) newSel.splice(idx, 1);
      else newSel.push(rawTarget);
      anchorIndex = itemIndex;
    } else if (event.shiftKey && anchorIndex !== null) {
      const currentIdx = itemIndex;
      const start = Math.min(anchorIndex, currentIdx);
      const end = Math.max(anchorIndex, currentIdx);
      newSel = flatItems.value.slice(start, end + 1).map(i => toRaw(i));
    } else {
      newSel = [rawTarget];
      anchorIndex = itemIndex;
    }
  }
  emitSelection(newSel);
};

const getItemStyle = (idx: number): CSSProperties | undefined => {
  if (!isDragging.value) return undefined;
  if (dragIndices.value.includes(idx)) return undefined;

  const shrinkScale = 'scale(0.99)';

  if (insertBeforeIndex.value === -1) {
    return { transform: shrinkScale };
  }

  let nonDragPos = 0;
  for (let i = 0; i < idx; i++) {
    if (!dragIndices.value.includes(i)) nonDragPos++;
  }

  let insertNonDragPos;
  if (insertBeforeIndex.value >= items.value.length) {
    insertNonDragPos = items.value.length - dragIndices.value.length;
  } else {
    insertNonDragPos = 0;
    for (let i = 0; i < insertBeforeIndex.value; i++) {
      if (!dragIndices.value.includes(i)) insertNonDragPos++;
    }
  }

  if (nonDragPos >= insertNonDragPos) {
    return { transform: `${shrinkScale} translateY(${dragItemHeight}px)` };
  }
  return { transform: shrinkScale };
};

const cacheMidpoints = () => {
  const viewport = listRef.value;
  if (!viewport) return;
  const els = viewport.querySelectorAll('.win-list-item');
  cachedMidpoints = [];
  els.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    cachedMidpoints.push({ index: i, midY: rect.top + rect.height / 2 });
  });
};

const onDragStart = (e: DragEvent, index: number) => {
  if (!canDragItems.value || isGrouped.value) return;

  const el = e.currentTarget as HTMLElement | null;
  if (el) dragItemHeight = el.offsetHeight;

  if (isSelected(items.value[index]) && selectedItems.value.length > 1) {
    dragIndices.value = items.value
      .map((it, i) => selectedItems.value.some(s => toRaw(s) === toRaw(it)) ? i : -1)
      .filter(i => i !== -1);
  } else {
    dragIndices.value = [index];
  }

  emit('DragItemsStarting', { Items: dragIndices.value.map(i => internalItems.value[i]) });
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  }

  requestAnimationFrame(() => {
    isDragging.value = true;
    nextTick(() => { cacheMidpoints(); });
  });
};

const onDragStartGrouped = (e: DragEvent, _target: { gIdx: number; idx: number }) => {
  if (!canDragItems.value) return;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  }
};

const onViewportDragOver = (e: DragEvent) => {
  if (!allowDrop.value || isGrouped.value) return;
  if (isDragging.value && !canReorderItems.value) return;
  if (!isDragging.value) isExternalDragOver.value = true;
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  emit('DragOver', { DataTransfer: e.dataTransfer, AcceptedOperation: 'Move', OriginalSource: e.target });

  const now = Date.now();
  if (now - lastCalcTime < 40) return;
  lastCalcTime = now;

  const mouseY = e.clientY;

  if (cachedMidpoints.length === 0) cacheMidpoints();

  const nonDragMidpoints = cachedMidpoints.filter(m => !dragIndices.value.includes(m.index));
  if (nonDragMidpoints.length === 0) return;

  let slot = items.value.length;
  for (let k = 0; k < nonDragMidpoints.length; k++) {
    if (mouseY < nonDragMidpoints[k].midY) {
      slot = nonDragMidpoints[k].index;
      break;
    }
  }

  const sorted = [...dragIndices.value].sort((a, b) => a - b);
  const minD = sorted[0];
  const maxD = sorted[sorted.length - 1];
  const contiguous = (maxD - minD + 1) === sorted.length;
  if (contiguous && slot >= minD && slot <= maxD + 1) {
    if (insertBeforeIndex.value !== -1) insertBeforeIndex.value = -1;
    return;
  }

  if (slot !== insertBeforeIndex.value) {
    insertBeforeIndex.value = slot;
  }
};

const onViewportDragLeave = (e: DragEvent) => {
  const viewport = listRef.value;
  if (!viewport) return;
  const related = e.relatedTarget;
  if (related instanceof Node && viewport.contains(related)) return;
  insertBeforeIndex.value = -1;
  isExternalDragOver.value = false;
};

const onViewportDrop = (event: DragEvent) => {
  if (isExternalDragOver.value && !isDragging.value) {
    const insertIndex = insertBeforeIndex.value < 0 ? internalItems.value.length : insertBeforeIndex.value;
    emit('Drop', {
      DataTransfer: event.dataTransfer,
      AcceptedOperation: 'Move',
      InsertIndex: insertIndex,
      OriginalSource: event.target
    });
    resetDrag();
    return;
  }

  if (!canReorderItems.value || !isDragging.value || insertBeforeIndex.value === -1) {
    resetDrag();
    return;
  }

  const draggedItems = dragIndices.value.sort((a, b) => a - b).map(i => internalItems.value[i]);
  const remaining = internalItems.value.filter((_, i) => !dragIndices.value.includes(i));

  let actualInsert;
  if (insertBeforeIndex.value >= internalItems.value.length) {
    actualInsert = remaining.length;
  } else {
    actualInsert = 0;
    for (let i = 0; i < insertBeforeIndex.value; i++) {
      if (!dragIndices.value.includes(i)) actualInsert++;
    }
  }

  const newItems = [...remaining];
  newItems.splice(actualInsert, 0, ...draggedItems);
  internalItems.value = newItems;
  emit('update:ItemsSource', newItems);
  emit('Drop', {
    DataTransfer: event.dataTransfer,
    AcceptedOperation: 'Move',
    InsertIndex: actualInsert,
    OriginalSource: event.target
  });
  emit('DragItemsCompleted', { Items: draggedItems, DropResult: 'Move' });
  resetDrag();
};

const resetDrag = () => {
  isDragging.value = false;
  isExternalDragOver.value = false;
  dragIndices.value = [];
  insertBeforeIndex.value = -1;
  cachedMidpoints = [];
};

const onDragEnd = () => { resetDrag(); };
</script>

<style>
  .win-list-view {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    border-style: solid;
    border-width: 0;
    color: var(--ListViewItemForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
    font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', sans-serif);
    font-size: var(--ControlContentThemeFontSize, 14px);
    line-height: 20px;
    letter-spacing: 0;
  }

  .win-list-view.disabled { opacity: 0.3; }

  .win-list-viewport {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: relative;
  }

  .win-list-content {
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    position: relative;
  }

  .win-list-group {
    display: block;
    width: 100%;
  }

  .win-list-header {
    min-height: 40px;
    padding: 8px 12px;
    box-sizing: border-box;
    color: var(--TextFillColorPrimaryBrush, var(--text-primary));
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    background: var(--LayerFillColorDefaultBrush, var(--app-bg));
    z-index: 5;
  }

    .win-list-header.sticky {
      position: sticky;
      top: 0;
    }

  .win-list-item {
    position: relative;
    isolation: isolate;
    width: 100%;
    min-width: 88px;
    min-height: 40px;
    box-sizing: border-box;
    padding: 0 12px 0 16px;
    border-style: solid;
    border-width: 0;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 0;
    overflow: hidden;
    cursor: default;
    user-select: none;
    transition:
      background-color var(--faster-duration, 83ms) linear,
      transform 250ms cubic-bezier(0.1, 0.9, 0.2, 1),
      opacity 200ms ease;
  }

    .win-list-item.content-stretch > :not(.win-list-view-selection-indicator):not(.list-selection-box) {
      flex: 1 1 auto;
      min-width: 0;
    }

    .win-list-view:not(.disabled) .win-list-item:hover {
      background: var(--ListViewItemBackgroundPointerOver, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary)));
    }

    .win-list-view:not(.disabled) .win-list-item:active {
      background: var(--ListViewItemBackgroundPressed, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary)));
    }

    .win-list-item.selected {
      background: var(--ListViewItemBackgroundSelected, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary)));
    }

      .win-list-item.selected:hover {
        background: var(--ListViewItemBackgroundSelectedPointerOver, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary)));
      }

      .win-list-item.selected:active {
        background: var(--ListViewItemBackgroundSelectedPressed, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary)));
      }

    .win-list-item:focus-visible {
      outline: 2px solid var(--ListViewItemFocusVisualPrimaryBrush, var(--FocusStrokeColorOuterBrush, var(--text-primary)));
      outline-offset: -3px;
    }

    .win-list-item.dragging-source {
      opacity: 0.3;
      pointer-events: none;
    }

    .win-list-item.drag-shrink {
      padding-top: 6px;
      padding-bottom: 6px;
    }

      .win-list-item.drag-shrink::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(128, 128, 128, 0.08);
        border-radius: 4px;
        pointer-events: none;
      }

  .win-list-view-selection-indicator {
    position: absolute;
    z-index: 3;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 16px;
    border-radius: var(--ListViewItemSelectionIndicatorCornerRadius, 1.5px);
    background: var(--ListViewItemSelectionIndicatorBrush, var(--AccentFillColorDefaultBrush, var(--accent-base)));
    opacity: 0;
    pointer-events: none;
    transition: height var(--fast-duration, 167ms) var(--fast-out-slow-in, cubic-bezier(0, 0, 0, 1)), opacity var(--fast-duration, 167ms) linear;
  }

    .win-list-view-selection-indicator.active {
      height: max(16px, calc(100% - 40px));
      opacity: 1;
    }

  .win-list-item:hover .win-list-view-selection-indicator.active {
    background: var(--ListViewItemSelectionIndicatorPointerOverBrush, var(--AccentFillColorDefaultBrush, var(--accent-base)));
  }

  .win-list-item:active .win-list-view-selection-indicator.active {
    height: max(10px, calc(100% - 46px));
    background: var(--ListViewItemSelectionIndicatorPressedBrush, var(--AccentFillColorDefaultBrush, var(--accent-base)));
  }

  .list-selection-box {
    display: inline-grid;
    place-items: center;
    flex: 0 0 20px;
    width: 20px;
    height: 20px;
    margin-right: 12px;
    box-sizing: border-box;
    border: 1px solid var(--ListViewItemCheckBoxBorderBrush, var(--ControlStrongStrokeColorDefaultBrush, var(--ctrl-strong-stroke)));
    border-radius: var(--ListViewItemCheckBoxCornerRadius, 3px);
    color: transparent;
    font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif;
    font-size: 12px;
    line-height: 1;
  }

  .list-selection-box.checked {
    border-color: var(--ListViewItemCheckBoxSelectedBrush, var(--AccentFillColorDefaultBrush, var(--accent-base)));
    background: var(--ListViewItemCheckBoxSelectedBrush, var(--AccentFillColorDefaultBrush, var(--accent-base)));
    color: var(--ListViewItemCheckBrush, var(--TextOnAccentFillColorPrimaryBrush, #fff));
  }
</style>
