<template>
    <div class="win-grid-view" ref="containerRef" :style="rootStyle"
       @dragover.prevent="onContainerDragOver"
       @drop="onContainerDrop"
       @dragleave="onContainerDragLeave">
    <div v-if="isGrouped" class="win-grid-groups">
      <section
        v-for="(group, groupIndex) in items"
        :key="getGroupKey(group, groupIndex)"
        :ref="element => setGroupElement(group, element)"
        class="win-grid-group">
        <button
          class="win-grid-group-header"
          type="button"
          @click="onGroupHeaderClick($event, group)">
          <slot name="groupHeader" :group="group" :index="groupIndex">
            {{ getGroupTitle(group) }}
          </slot>
          <span class="win-grid-group-divider" aria-hidden="true"></span>
        </button>
        <div class="win-grid-view-inner win-grid-group-items" :style="itemsPanelStyle">
          <div
            v-for="(item, itemIndex) in getGroupItems(group)"
            :key="'group-' + groupIndex + '-' + getItemKey(item, itemIndex)"
            class="win-grid-item"
            :style="itemStyle"
            :class="{ selected: isSelected(item), clickEnabled: isItemClickEnabled }"
            @click="onItemClick($event, item, itemIndex)">
            <div class="grid-item-inner"><component :is="itemComponent(item, itemIndex, group)" /></div>
          </div>
        </div>
      </section>
    </div>

    <div v-else class="win-grid-view-inner" ref="innerRef" :style="itemsPanelStyle">
      <div v-for="entry in flatList" :key="entry.key"
           :class="entry.type === 'placeholder' ? 'win-grid-drop-placeholder' : {
             'win-grid-item': true,
             selected: isSelected(entry.item),
             clickEnabled: isItemClickEnabled && !isDragging,
             'drag-shrink': isDragging && !dragIndices.includes(entry.index),
             'dragging-source': isDragging && dragIndices.includes(entry.index)
           }"
           :style="entry.type === 'placeholder' ? { ...itemStyle, width: dragItemWidth + 'px', height: dragItemHeight + 'px' } : itemStyle"
           :draggable="entry.type === 'item' ? canDragItems : false"
           @click="entry.type === 'item' ? onItemClick($event, entry.item, entry.index) : null"
           @dragstart="entry.type === 'item' ? onDragStart($event, entry.index) : null"
           @dragend="entry.type === 'item' ? onDragEnd() : null">

        <template v-if="entry.type === 'item'">
          <div v-if="selectionMode === 'Multiple' || selectionMode === 'Extended'"
               class="grid-checkbox" @click.stop @mousedown.stop>
            <CheckBox :modelValue="isSelected(entry.item)" @update:modelValue="onCheckboxToggle($event, entry.item)" />
          </div>

          <div class="grid-item-inner"><component :is="itemComponent(entry.item, entry.index)" /></div>

          <div v-if="isDragging && entry.index === dragOriginIndex && dragIndices.length > 1"
               class="drag-count-badge">
            {{ dragIndices.length }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CollectionItemContainerStyle, CollectionItemTemplate, CollectionItemTemplateSelector, CollectionItemsPanel } from './CollectionProperties'

export default {
  ItemTemplate: CollectionItemTemplate,
  ItemTemplateSelector: CollectionItemTemplateSelector,
  ItemsPanel: CollectionItemsPanel,
  ItemContainerStyle: CollectionItemContainerStyle
}
</script>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck Legacy JavaScript implementation; public casing is preserved for WinUI compatibility.
import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, nextTick, ref, shallowRef, useAttrs, useSlots } from 'vue';
import CheckBox from './CheckBox.vue';
import { getCollectionProperty, getVNodeChildren } from './CollectionProperties';
import { xamlResourceDictionaryKey } from './Page.vue';
import { materializeXamlVNode } from './xamlRuntime';
import { resolveXamlHandler, resolveXamlValue } from './xamlRuntime';

const props = defineProps({
  ItemsSource: { type: [String, Array, Object], default: null },
  IsItemClickEnabled: { type: [Boolean, String], default: undefined },
  CanDragItems: { type: [Boolean, String], default: undefined },
  CanReorderItems: { type: [Boolean, String], default: undefined },
  AllowDrop: { type: [Boolean, String], default: undefined },
  FlowDirection: { type: String, default: 'LeftToRight' },
  SelectionMode: { type: String, default: undefined },
  SelectedItems: { type: Array, default: null },
  ItemTemplate: { type: [String, Object], default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' },
  Padding: { type: [String, Number], default: '' },
  Background: { type: String, default: '' },
  BorderBrush: { type: String, default: '' },
  BorderThickness: { type: [String, Number], default: '' },
  CornerRadius: { type: [String, Number], default: '' },
});

const emit = defineEmits(['ItemClick', 'SelectionChanged', 'DragItemsStarting', 'DragItemsCompleted', 'update:SelectedItems', 'reorder']);

const containerRef = ref(null);
const innerRef = ref(null);
const isDragging = ref(false);
const dragIndices = ref([]);
const dragOriginIndex = ref(-1);
const insertSlotIndex = ref(-1);
const dragItemWidth = ref(0);
const dragItemHeight = ref(0);
let anchorIndex = null;
let lastSlotUpdateTime = 0;
let cachedRects = [];
const groupElements = new Map();

const slots = useSlots();
const attrs = useAttrs();
const instance = getCurrentInstance();
const slotNodes = shallowRef(slots.default?.() ?? []);
const flowDirectionStyle = computed(() => resolveXamlValue(props.FlowDirection, instance) === 'RightToLeft' ? 'rtl' : 'ltr');
const pageResources = inject(xamlResourceDictionaryKey, null);
const directChildren = (node) => {
  if (!node) return [];
  if (Array.isArray(node.children)) return node.children;
  if (node.children && typeof node.children === 'object') {
    const slot = node.children.default;
    return typeof slot === 'function' ? slot() : [];
  }
  return [];
};
const typeName = (node) => {
  const type = node?.type;
  return typeof type === 'string' ? type : type?.name || type?.__name || '';
};
const flattenTemplateNodes = (nodes) => nodes.flatMap((node) => {
  if (!node) return [];
  const name = typeName(node);
  // ItemTemplateSelector is a structural XAML node.  Unwrap it while keeping
  // each keyed DataTemplate intact so the selected template can be materialized
  // for one item without rendering all selector branches.
  return node.type === Fragment || /DataTemplateSelector$/i.test(name)
    ? flattenTemplateNodes(directChildren(node))
    : [node];
});
const templateKey = (node) => {
  const props = node?.props ?? {};
  const key = props['x:Key'] ?? props['x:key'] ?? props.Key ?? props.key;
  return typeof key === 'string' ? key : '';
};
const selectedTemplateKey = computed(() => {
  const value = resolveXamlValue(props.ItemTemplate, instance);
  if (typeof value !== 'string') return '';
  const resource = value.match(/^\{\s*StaticResource\s+([^\s}]+)\s*\}$/i);
  if (resource) return resource[1];
  // Older normalized VNodes may have materialized this marker as a CSS var.
  const cssVariable = value.match(/^var\(--([^,)]+)\)$/);
  return cssVariable?.[1] ?? value;
});
const itemTemplateNodes = computed(() => {
  const key = selectedTemplateKey.value;
  if (key && pageResources?.[key]) return getVNodeChildren(pageResources[key]);
  for (const node of slotNodes.value) {
    const property = getCollectionProperty(node);
    if (property !== 'itemTemplate' && property !== 'itemTemplateSelector') continue;
    const candidates = flattenTemplateNodes(directChildren(node));
    const templates = candidates.filter((candidate) => /DataTemplate$/i.test(typeName(candidate)));
    if (templates.length) {
      const selected = key ? templates.find((candidate) => templateKey(candidate) === key) : templates[0];
      return getVNodeChildren(selected ?? templates[0]);
    }
    return getVNodeChildren(node);
  }
  return [];
});
const itemContainerStyle = computed(() => {
  const property = slotNodes.value.find((node) => getCollectionProperty(node) === 'itemContainerStyle');
  const styleNode = property ? getVNodeChildren(property)[0] : null;
  if (!styleNode) return undefined;
  const result = {};
  for (const setter of getVNodeChildren(styleNode)) {
    const propertyName = setter?.props?.Property;
    if (!propertyName) continue;
    const value = resolveXamlValue(setter?.props?.Value, instance);
    if (value === undefined || value === null) continue;
    if (propertyName === 'Margin') result.margin = xamlThickness(value);
    else if (propertyName === 'Padding') result.padding = xamlThickness(value);
    else if (propertyName === 'Width') result.width = cssLength(value);
    else if (propertyName === 'Height') result.height = cssLength(value);
    else if (propertyName === 'MinWidth') result.minWidth = cssLength(value);
    else if (propertyName === 'MinHeight') result.minHeight = cssLength(value);
    else if (propertyName === 'Background') result.background = String(value);
    else if (propertyName === 'BorderBrush') result.borderColor = String(value);
    else if (propertyName === 'BorderThickness') { result.borderWidth = xamlThickness(value); result.borderStyle = 'solid'; }
    else if (propertyName === 'CornerRadius') result.borderRadius = cssLength(value);
  }
  return result;
});
const itemStyle = computed(() => ({ margin: '0 4px 4px 0', ...itemContainerStyle.value }));
const itemsPanelStyle = computed(() => {
  const panelElement = slotNodes.value.find((node) => getCollectionProperty(node) === 'itemsPanel');
  const panel = panelElement ? getVNodeChildren(panelElement)[0] : null;
  const maximum = Number(resolveXamlValue(panel?.props?.MaximumRowsOrColumns, instance));
  const resolvedMargin = itemContainerStyle.value?.margin;
  const orientation = resolveXamlValue(panel?.props?.Orientation, instance);
  const style = {};
  if (resolvedMargin) {
    const values = String(resolvedMargin).split(/\s+/).map((value) => Number.parseFloat(value) || 0);
    style.columnGap = `${values.length === 1 ? values[0] * 2 : values[1] + values[3]}px`;
    style.rowGap = `${values.length === 1 ? values[0] * 2 : values[0] + values[2]}px`;
  }
  if (maximum > 0) {
    style.display = 'grid';
    style.gridAutoRows = 'max-content';
    style.gridAutoFlow = orientation === 'Vertical' ? 'column' : 'row';
    if (orientation === 'Vertical') style.gridTemplateRows = `repeat(${maximum}, max-content)`;
    else style.gridTemplateColumns = `repeat(${maximum}, max-content)`;
  } else {
    style.gridTemplateColumns = 'repeat(auto-fill, max-content)';
  }
  return style;
});
const cssLength = (value) => {
  if (value === '' || value === null || value === undefined) return undefined;
  if (typeof value === 'number' || /^-?\d+(?:\.\d+)?$/.test(String(value).trim())) return `${value}px`;
  return String(value);
};
const xamlThickness = (value) => {
  if (value === '' || value === null || value === undefined) return undefined;
  const parts = String(value).split(',').map((part) => cssLength(part.trim()));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return String(value);
};
const rootStyle = computed(() => ({
  width: cssLength(props.Width), height: cssLength(props.Height),
  minWidth: cssLength(props.MinWidth), minHeight: cssLength(props.MinHeight),
  maxWidth: cssLength(props.MaxWidth), maxHeight: cssLength(props.MaxHeight),
  margin: xamlThickness(props.Margin), padding: xamlThickness(props.Padding),
  background: resolveXamlValue(props.Background, instance) || undefined,
  borderColor: resolveXamlValue(props.BorderBrush, instance) || undefined,
  borderWidth: xamlThickness(props.BorderThickness),
  borderStyle: props.BorderBrush || props.BorderThickness !== '' ? 'solid' : undefined,
  borderRadius: cssLength(props.CornerRadius)
}));
const items = computed(() => {
  const source = resolveXamlValue(props.ItemsSource, instance);
  return Array.isArray(source) ? source : [];
});
const isGrouped = computed(() => Boolean(slots.groupHeader) && items.value.some(item => Array.isArray(item?.Items) || Array.isArray(item?.items)));
const isItemClickEnabled = computed(() => resolveXamlValue(props.IsItemClickEnabled, instance) === true);
const canDragItems = computed(() => resolveXamlValue(props.CanDragItems, instance) === true);
const canReorderItems = computed(() => resolveXamlValue(props.CanReorderItems, instance) === true);
const allowDrop = computed(() => resolveXamlValue(props.AllowDrop, instance) === true);
const selectionMode = computed(() => resolveXamlValue(props.SelectionMode, instance) ?? 'Single');
const internalSelectedItems = ref([]);
const selectedItems = computed(() => {
  const bound = resolveXamlValue(props.SelectedItems, instance);
  return Array.isArray(bound) ? bound : internalSelectedItems.value;
});

const getItemKey = (item, index) => item.id || item.title || item.Title || index;
const getGroupItems = (group) => group?.Items ?? group?.items ?? [];
const getGroupKey = (group, index) => group?.id || group?.key || group?.title || group?.Title || index;
const getGroupTitle = (group) => group?.title || group?.Title || group?.key || '';
const isSelected = (item) => selectedItems.value.includes(item);

const itemComponentCache = new Map();
const itemComponent = (item, index, group) => {
  const key = item && typeof item === 'object' ? item : `primitive:${group ? getGroupKey(group, 0) : ''}:${index}:${String(item)}`;
  let component = itemComponentCache.get(key);
  if (!component) {
    component = defineComponent({
      name: 'GridViewItemTemplate',
      setup() {
        return () => {
          if (itemTemplateNodes.value.length) return h(Fragment, materializeXamlVNode(itemTemplateNodes.value, item, instance));
          const slot = slots.item;
          return slot ? h(Fragment, slot({ item, index, group })) : h(Fragment, [h('span', String(item ?? ''))]);
        };
      }
    });
    itemComponentCache.set(key, component);
  }
  return component;
};

const setGroupElement = (group, element) => {
  if (element) groupElements.set(group, element);
  else groupElements.delete(group);
};

const ScrollIntoGroup = (group) => {
  const groupElement = groupElements.get(group);
  if (!groupElement) return false;

  // Keep semantic-zoom navigation inside its own view. scrollIntoView() also
  // moves the Gallery page's outer ScrollViewer, which shifts the control
  // itself when a group near the bottom is selected.
  const viewport = groupElement.closest('.win-scroll-viewer-viewport');
  if (viewport instanceof HTMLElement) {
    const groupBounds = groupElement.getBoundingClientRect();
    const viewportBounds = viewport.getBoundingClientRect();
    const targetTop = viewport.scrollTop + groupBounds.top - viewportBounds.top;
    const maximumTop = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    viewport.scrollTop = Math.max(0, Math.min(maximumTop, targetTop));
    return true;
  }

  return false;
};

const onGroupHeaderClick = (event, group) => {
  event.currentTarget.dispatchEvent(new CustomEvent('semanticzoomrequest', {
    bubbles: true,
    detail: { Item: group, OriginalSource: event.currentTarget }
  }));
};

const emitSelection = (newSel) => {
  const previous = selectedItems.value;
  internalSelectedItems.value = [...newSel];
  emit('update:SelectedItems', newSel);
  const args = {
    AddedItems: newSel.filter(item => !previous.includes(item)),
    RemovedItems: previous.filter(item => !newSel.includes(item)),
    SelectedItems: newSel
  };
  emit('SelectionChanged', args);
  resolveXamlHandler(attrs.SelectionChanged, instance)?.(args);
};

const onCheckboxToggle = (val, item) => {
  const newSel = [...selectedItems.value];
  const pos = newSel.indexOf(item);
  if (val && pos === -1) newSel.push(item);
  else if (!val && pos > -1) newSel.splice(pos, 1);
  emitSelection(newSel);
};

const onItemClick = (e, item, index) => {
  if (selectionMode.value === 'None') {
    if (isItemClickEnabled.value) {
      const args = { ClickedItem: item, OriginalSource: e.target };
      emit('ItemClick', args);
      resolveXamlHandler(attrs.ItemClick, instance)?.(args);
    }
    return;
  }
  if (selectionMode.value === 'Single') {
    if (isItemClickEnabled.value) {
      const args = { ClickedItem: item, OriginalSource: e.target };
      emit('ItemClick', args);
      resolveXamlHandler(attrs.ItemClick, instance)?.(args);
    }
    emitSelection([item]);
    anchorIndex = index;
    return;
  }
  if (selectionMode.value === 'Multiple') {
    const newSel = [...selectedItems.value];
    const pos = newSel.indexOf(item);
    if (pos > -1) newSel.splice(pos, 1);
    else newSel.push(item);
    emitSelection(newSel);
    if (isItemClickEnabled.value) {
      const args = { ClickedItem: item, OriginalSource: e.target };
      emit('ItemClick', args);
      resolveXamlHandler(attrs.ItemClick, instance)?.(args);
    }
    return;
  }
  if (selectionMode.value === 'Extended') {
    let newSel = [...selectedItems.value];
    if (e.ctrlKey) {
      const pos = newSel.indexOf(item);
      if (pos > -1) newSel.splice(pos, 1);
      else newSel.push(item);
      anchorIndex = index;
    } else if (e.shiftKey && anchorIndex !== null) {
      const start = Math.min(anchorIndex, index);
      const end = Math.max(anchorIndex, index);
      newSel = items.value.slice(start, end + 1);
    } else {
      newSel = [item];
      anchorIndex = index;
    }
    emitSelection(newSel);
    if (isItemClickEnabled.value) {
      const args = { ClickedItem: item, OriginalSource: e.target };
      emit('ItemClick', args);
      resolveXamlHandler(attrs.ItemClick, instance)?.(args);
    }
  }
};

const cacheNonDragRects = () => {
  const container = innerRef.value?.$el || innerRef.value;
  if (!container) return;
  const els = Array.from(container.querySelectorAll('.win-grid-item:not(.dragging-source)'));
  const nonDragIndices = [];
  for (let i = 0; i < items.value.length; i++) {
    if (!dragIndices.value.includes(i)) nonDragIndices.push(i);
  }
  cachedRects = [];
  for (let k = 0; k < Math.min(nonDragIndices.length, els.length); k++) {
    cachedRects.push({ itemIndex: nonDragIndices[k], rect: els[k].getBoundingClientRect() });
  }
};

const calcInsertSlot = (mouseX, mouseY) => {
  if (cachedRects.length === 0) return -1;

  const entries = cachedRects;
  const rows = [];
  let currentRowTop = -Infinity;
  for (const entry of entries) {
    if (Math.abs(entry.rect.top - currentRowTop) > entry.rect.height * 0.4) {
      rows.push([]);
      currentRowTop = entry.rect.top;
    }
    rows[rows.length - 1].push(entry);
  }

  let targetRow = null;
  for (const row of rows) {
    const rowTop = Math.min(...row.map(e => e.rect.top));
    const rowBottom = Math.max(...row.map(e => e.rect.bottom));
    if (mouseY >= rowTop && mouseY <= rowBottom) {
      targetRow = row;
      break;
    }
  }
  if (!targetRow) {
    if (rows.length > 0 && mouseY < rows[0][0].rect.top) {
      targetRow = rows[0];
    } else if (rows.length > 0) {
      targetRow = rows[rows.length - 1];
    } else {
      return -1;
    }
  }

  for (let k = 0; k < targetRow.length; k++) {
    const entry = targetRow[k];
    const itemCenter = entry.rect.left + entry.rect.width / 2;
    if (mouseX < itemCenter) {
      return entry.itemIndex;
    }
  }

  return items.value.length;
};

const showPlaceholderBefore = (index) => {
  if (!isDragging.value || insertSlotIndex.value === -1) return false;
  if (dragIndices.value.includes(index)) return false;

  if (insertSlotIndex.value >= items.value.length) return false;

  let nonDragPos = 0;
  for (let i = 0; i < index; i++) {
    if (!dragIndices.value.includes(i)) nonDragPos++;
  }

  let targetPos = 0;
  for (let i = 0; i < insertSlotIndex.value; i++) {
    if (!dragIndices.value.includes(i)) targetPos++;
  }

  return nonDragPos === targetPos && !dragIndices.value.includes(index);
};

const flatList = computed(() => {
  const list = [];
  for (let i = 0; i < items.value.length; i++) {
    if (showPlaceholderBefore(i)) {
      list.push({ type: 'placeholder', key: 'ph' });
    }
    list.push({ type: 'item', key: 'item-' + getItemKey(items.value[i], i), item: items.value[i], index: i });
  }
  if (isDragging.value && insertSlotIndex.value !== -1 && insertSlotIndex.value >= items.value.length) {
    list.push({ type: 'placeholder', key: 'ph' });
  }
  return list;
});

const onDragStart = (e, index) => {
  if (!canDragItems.value) return;
  const el = e.currentTarget;
  if (el) {
    dragItemWidth.value = el.offsetWidth;
    dragItemHeight.value = el.offsetHeight;
  }
  if (isSelected(items.value[index]) && selectedItems.value.length > 1) {
    dragIndices.value = items.value
      .map((it, i) => selectedItems.value.includes(it) ? i : -1)
      .filter(i => i !== -1);
  } else {
    dragIndices.value = [index];
  }
  dragOriginIndex.value = index;
  insertSlotIndex.value = -1;
  emit('DragItemsStarting', { Items: dragIndices.value.map(i => items.value[i]) });
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', '');

  requestAnimationFrame(() => {
    isDragging.value = true;
    nextTick(() => {
      cacheNonDragRects();
    });
  });
};

const onContainerDragOver = (e) => {
  if (!canReorderItems.value || !allowDrop.value) return;
  e.dataTransfer.dropEffect = 'move';

  const now = Date.now();
  if (now - lastSlotUpdateTime < 50) return;
  lastSlotUpdateTime = now;

  const slot = calcInsertSlot(e.clientX, e.clientY);
  if (slot === insertSlotIndex.value) return;
  if (slot === -1) return;

  const sorted = [...dragIndices.value].sort((a, b) => a - b);
  const minDrag = sorted[0];
  const maxDrag = sorted[sorted.length - 1];
  let contiguous = true;
  for (let i = minDrag; i <= maxDrag; i++) {
    if (!dragIndices.value.includes(i)) { contiguous = false; break; }
  }
  if (contiguous && slot >= minDrag && slot <= maxDrag + 1) {
    if (insertSlotIndex.value !== -1) insertSlotIndex.value = -1;
    return;
  }

  insertSlotIndex.value = slot;
};

const onContainerDragLeave = (e) => {
  if (!containerRef.value) return;
  const related = e.relatedTarget;
  if (related && containerRef.value.contains(related)) return;
  insertSlotIndex.value = -1;
};

const onContainerDrop = (e) => {
  if (!canReorderItems.value || !isDragging.value) return;
  e.preventDefault();
  performReorder();
};

const performReorder = () => {
  if (dragIndices.value.length === 0 || insertSlotIndex.value === -1) {
    resetDrag();
    return;
  }

  const draggedItems = dragIndices.value.map(i => items.value[i]);
  const remaining = items.value.filter((_, i) => !dragIndices.value.includes(i));

  let insertAt;
  if (insertSlotIndex.value >= items.value.length) {
    insertAt = remaining.length;
  } else {
    const targetItem = items.value[insertSlotIndex.value];
    insertAt = remaining.indexOf(targetItem);
    if (insertAt === -1) insertAt = remaining.length;
  }

  const newItems = [...remaining];
  newItems.splice(insertAt, 0, ...draggedItems);

  resetDrag();
  emit('DragItemsCompleted', { Items: draggedItems, DropResult: 'Move' });
  emit('reorder', newItems);
};

const resetDrag = () => {
  isDragging.value = false;
  dragIndices.value = [];
  dragOriginIndex.value = -1;
  insertSlotIndex.value = -1;
  cachedRects = [];
};

const onDragEnd = () => {
  resetDrag();
};

defineExpose({ ScrollIntoGroup });
</script>

<style>
  .win-grid-view {
    display: flex;
    flex-direction: column;
    direction: v-bind(flowDirectionStyle);
  }

  .win-grid-groups,
  .win-grid-group {
    width: 100%;
    min-width: 0;
  }

  .win-grid-group-header {
    appearance: none;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    box-sizing: border-box;
    width: 100%;
    min-height: 44px;
    margin: 0 0 4px;
    padding: 8px 12px 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: inherit;
    font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
    font-size: 20px;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0;
    text-align: left;
    cursor: default;
  }

  .win-grid-group-header:focus-visible {
    outline: 2px solid var(--FocusStrokeColorOuterBrush, var(--accent-base));
    outline-offset: -2px;
  }

  .win-grid-group-divider {
    display: block;
    flex: 0 0 1px;
    width: 100%;
    height: 1px;
    margin-top: 8px;
    background: transparent;
  }

  .win-grid-group-items {
    padding-bottom: 4px;
  }

  .win-grid-view-inner {
    display: grid;
    grid-template-columns: repeat(auto-fill, max-content);
    grid-auto-rows: max-content;
    grid-auto-flow: row;
    column-gap: 4px;
    row-gap: 4px;
    align-content: start;
    position: relative;
  }

  .win-grid-item {
    position: relative;
    border-radius: var(--GridViewItemCornerRadius, 4px);
    overflow: hidden;
    border: 0 solid transparent;
    margin: 0;
    min-width: var(--GridViewItemMinWidth, 44px);
    min-height: var(--GridViewItemMinHeight, 44px);
    background: var(--GridViewItemBackground, var(--SubtleFillColorTransparentBrush, transparent));
    box-sizing: border-box;
    cursor: default;
    outline: none;
    transition: transform 0.3s cubic-bezier(0.1, 0.9, 0.2, 1), filter 0.2s ease, opacity 0.2s ease, outline-color 0.1s ease;
  }

    .win-grid-item.clickEnabled {
      cursor: pointer;
    }

      .win-grid-item:hover {
        outline: 1px solid var(--GridViewItemPointerOverBorderBrush, var(--ControlStrokeColorOnAccentTertiaryBrush, rgba(150, 150, 150, 0.4)));
        outline-offset: -1px;
        background: var(--GridViewItemBackgroundPointerOver, var(--subtle-secondary));
      }

  .win-grid-item:not(.clickEnabled) { cursor: default; }

      .win-grid-item:active {
        background: var(--GridViewItemBackgroundPressed, var(--subtle-tertiary));
        outline: 0;
      }

    .win-grid-item.selected {
      outline: var(--GridViewItemSelectedBorderThickness, 2px) solid var(--GridViewItemSelectedBorderBrush, var(--AccentFillColorDefaultBrush, var(--accent-base)));
      outline-offset: -2px;
      background: var(--GridViewItemBackgroundSelected, var(--subtle-tertiary));
    }

      .win-grid-item.selected:hover {
        outline-color: var(--GridViewItemSelectedPointerOverBorderBrush, var(--AccentFillColorSecondaryBrush, var(--accent-base)));
      }

      .win-grid-item.selected:active {
        background: var(--GridViewItemBackgroundSelectedPressed, var(--subtle-secondary));
        outline: 0;
      }

    .win-grid-item.dragging-source {
      visibility: hidden;
      pointer-events: none;
    }

    .win-grid-item.drag-shrink {
      transform: scale(0.95);
      filter: grayscale(0.15) brightness(0.92);
      opacity: 0.7;
    }

      .win-grid-item.drag-shrink::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.08);
        border-radius: 4px;
        pointer-events: none;
      }

  .grid-flip-move {
    transition: transform 0.3s cubic-bezier(0.1, 0.9, 0.2, 1);
  }

  .grid-flip-enter-active,
  .grid-flip-leave-active {
    transition: opacity 0.15s ease;
  }

  .grid-flip-enter-from,
  .grid-flip-leave-to {
    opacity: 0;
  }

  .grid-flip-leave-active {
    position: absolute;
  }

  .win-grid-drop-placeholder {
    border-radius: 4px;
    background: var(--accent-base, #0078d4);
    opacity: 0.15;
    flex-shrink: 0;
  }

  .grid-item-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
  }

  .grid-checkbox {
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 2;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .drag-count-badge {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--accent-base);
    color: #fff;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    z-index: 3;
    pointer-events: none;
  }
</style>
