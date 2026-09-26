<template>
  <div
    ref="containerRef"
    class="win-grid-view"
    :class="{ disabled: !isEnabled, 'drag-over': isExternalDragOver }"
    :style="rootStyle"
    role="grid"
    :aria-disabled="!isEnabled"
    :aria-multiselectable="selectionMode === 'Multiple' || selectionMode === 'Extended'"
    @dragover="onContainerDragOver"
    @dragenter="onContainerDragEnter"
    @drop="onContainerDrop"
    @dragleave="onContainerDragLeave">
    <div class="win-grid-border">
      <ScrollViewer
        class="win-grid-scroll-viewer"
        VerticalScrollMode="Enabled"
        VerticalScrollBarVisibility="Auto"
        HorizontalScrollMode="Disabled"
        HorizontalScrollBarVisibility="Disabled"
        BringIntoViewOnFocusChange="True"
        :IsTabStop="false">
        <div ref="innerRef" class="win-grid-view-content" :style="contentPaddingStyle">
          <div v-if="isGrouped" class="win-grid-groups">
      <section
        v-for="(group, groupIndex) in items"
        :key="getGroupKey(group, groupIndex)"
        :ref="element => setGroupElement(group, element)"
        class="win-grid-group">
        <div
          class="win-grid-group-header"
          @click="onGroupHeaderClick($event, group)">
          <div class="win-grid-group-header-content">
            <slot name="groupHeader" :group="group" :index="groupIndex">
              {{ getGroupTitle(group) }}
            </slot>
          </div>
          <span class="win-grid-group-divider" aria-hidden="true"></span>
        </div>
        <div class="win-grid-view-inner win-grid-group-items" :style="itemsPanelStyle">
          <div
            v-for="(item, itemIndex) in getGroupItems(group)"
            :key="'group-' + groupIndex + '-' + getItemKey(item, itemIndex)"
            class="win-grid-item"
            :style="itemStyle"
            :class="{ selected: isSelected(item), clickEnabled: isItemClickEnabled }"
             role="gridcell"
             :aria-selected="selectionMode === 'None' ? undefined : isSelected(item)"
             :aria-disabled="!isEnabled"
            :tabindex="itemTabIndex(getFlatIndex(item, group, itemIndex))"
            @click="onItemClick($event, item, getFlatIndex(item, group, itemIndex))"
             @keydown="onItemKeyDown($event, item, getFlatIndex(item, group, itemIndex))"
             @focus="onItemFocus(getFlatIndex(item, group, itemIndex))">
            <div class="grid-item-presenter">
              <CheckBox
                v-if="selectionMode === 'Multiple' || selectionMode === 'Extended'"
                class="grid-checkbox"
                IsEnabled="True"
                :IsChecked="isSelected(item)"
                @pointerdown.stop
                @click.stop
                @update:IsChecked="onCheckboxToggle($event, item)" />
              <div class="grid-item-inner"><component :is="itemComponent(item, itemIndex, group)" /></div>
            </div>
          </div>
        </div>
      </section>
          </div>

          <div v-else class="win-grid-view-inner" :style="itemsPanelStyle">
      <div v-for="entry in flatList" :key="entry.key"
             :class="entry.type === 'placeholder' ? 'win-grid-drop-placeholder' : {
             'win-grid-item': true,
             selected: isSelected(entry.item),
             clickEnabled: isItemClickEnabled && !dragVisualActive,
             'can-drag': canStartPointerDrag && !dragVisualActive,
             // ListView keeps affected neighbours at their measured size and
             // only lowers their presenter opacity.  ReorderingTarget owns
             // the separate .95 scale/.5 opacity animation.
             'drag-shrink': dragVisualActive && !dragIndices.includes(entry.index) && !isReorderTarget(entry.index),
             'dragging-source': isDragging && dragIndices.includes(entry.index),
             'reorder-target': isReorderTarget(entry.index)
           }"
           :style="entry.type === 'placeholder' ? { ...itemStyle, width: dragItemWidth + 'px', height: dragItemHeight + 'px' } : { ...itemStyle, transform: reorderTransform(entry.index), zIndex: isReorderTarget(entry.index) ? 2 : undefined, ...reorderHintStyle(entry.index) }"
           :draggable="false"
           :role="entry.type === 'item' ? 'gridcell' : undefined"
           :aria-selected="entry.type === 'item' && selectionMode !== 'None' ? isSelected(entry.item) : undefined"
           :aria-disabled="entry.type === 'item' ? !isEnabled : undefined"
           :tabindex="entry.type === 'item' ? itemTabIndex(entry.index) : -1"
           @click="entry.type === 'item' ? onItemClick($event, entry.item, entry.index) : null"
           @keydown="entry.type === 'item' ? onItemKeyDown($event, entry.item, entry.index) : null"
           @focus="entry.type === 'item' ? onItemFocus(entry.index) : null"
           @dragstart="entry.type === 'item' ? onDragStart($event, entry.index) : null"
           @dragenter="entry.type === 'item' ? onItemDragEnter($event, entry.index) : null"
           @dragover="entry.type === 'item' ? onItemDragOver($event, entry.index) : null"
           @pointerdown="entry.type === 'item' ? onItemPointerDown($event, entry.index) : null"
           @pointermove="entry.type === 'item' ? onItemPointerMove($event, entry.index) : null"
           @pointerup="entry.type === 'item' ? onItemPointerUp($event) : null"
           @pointercancel="entry.type === 'item' ? onItemPointerCancel($event) : null"
           @lostpointercapture="entry.type === 'item' ? onItemLostPointerCapture($event) : null"
           @dragend="entry.type === 'item' ? onDragEnd($event) : null">

        <template v-if="entry.type === 'item'">
          <div class="grid-item-presenter">
            <CheckBox
              v-if="selectionMode === 'Multiple' || selectionMode === 'Extended'"
              class="grid-checkbox"
              IsEnabled="True"
              :IsChecked="isSelected(entry.item)"
              @pointerdown.stop
              @click.stop
              @update:IsChecked="onCheckboxToggle($event, entry.item)" />
            <div class="grid-item-inner"><component :is="itemComponent(entry.item, entry.index)" /></div>

          <div v-if="isDragging && entry.index === dragOriginIndex && dragIndices.length > 1"
               class="drag-count-badge">
            {{ dragIndices.length }}
          </div>
          </div>
        </template>
      </div>
          </div>
        </div>
      </ScrollViewer>
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
// @ts-nocheck Legacy JavaScript implementation; public casing is preserved for WinUI compatibility.
import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, toRaw, useAttrs, useSlots, watch } from 'vue';
import ScrollViewer from './ScrollViewer.vue';
import CheckBox from './CheckBox.vue';
import { getCollectionProperty, getVNodeChildren } from './CollectionProperties';
import { xamlResourceDictionaryKey } from './Page.vue';
import { materializeXamlVNode } from './xamlRuntime';
import { resolveXamlHandler, resolveXamlValue } from './xamlRuntime';

const props = defineProps({
  ItemsSource: { type: [String, Array, Object], default: null },
  IsGrouped: { type: [Boolean, String], default: undefined },
  IsEnabled: { type: [Boolean, String], default: true },
  IsItemClickEnabled: { type: [Boolean, String], default: undefined },
  CanDragItems: { type: [Boolean, String], default: undefined },
  CanReorderItems: { type: [Boolean, String], default: undefined },
  AllowDrop: { type: [Boolean, String], default: undefined },
  FlowDirection: { type: String, default: 'LeftToRight' },
  SelectionMode: { type: String, default: undefined },
  SelectedItems: { type: Array, default: undefined },
  SelectedItem: { type: null, default: undefined },
  SelectedIndex: { type: [Number, String], default: -1 },
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

const emit = defineEmits([
  'ItemClick', 'SelectionChanged', 'DragItemsStarting', 'DragItemsCompleted', 'DragOver', 'Drop',
  'update:SelectedItems', 'update:SelectedItem', 'update:SelectedIndex', 'update:ItemsSource', 'reorder'
]);

const containerRef = ref(null);
const innerRef = ref(null);
const isDragging = ref(false);
const isExternalDragOver = ref(false);
const dragIndices = ref([]);
const dragOriginIndex = ref(-1);
const insertSlotIndex = ref(-1);
// Keep the visual item under the pointer separate from the insertion slot.
// This mirrors ListView's ReorderingTarget/InsertBefore split: the target is
// painted while the slot drives the collection order and neighbour offsets.
const dragOverIndex = ref(-1);
const dragItemWidth = ref(0);
const dragItemHeight = ref(0);
const activeDragItems = ref([]);
const dragDropAccepted = ref(false);
const dragToken = ref('');
const externalDragToken = ref('');
let dragImageElement = null;
let pointerPreviewElement = null;
const pointerDrag = ref(null);
const pointerDragActive = ref(false);
const intentionallyReleasedPointerCaptures = new Set();
let suppressClickUntil = 0;
let anchorIndex = null;
let cachedRects = [];
const dragLayoutVersion = ref(0);
let dragScrollViewport = null;
let dragLayoutScrollLeft = 0;
let dragLayoutScrollTop = 0;
const DRAG_THRESHOLD = 8;
const EDGE_SCROLL_SIZE = 100;
const EDGE_SCROLL_DELAY = 50;
const EDGE_SCROLL_MIN_SPEED = 150;
const EDGE_SCROLL_MAX_SPEED = 1500;
// WinUI uses a slightly longer live-reorder delay for GridView than for
// ListView.  The target visual follows the pointer immediately, while the
// arranged neighbours move only after this delay and settle over 240ms.
const LIVE_REORDER_DELAY = 300;
const GRID_REORDER_HINT_OFFSET = 16;
let edgeScrollStartTimer;
let edgeScrollFrame;
let edgeScrollVelocity = 0;
let edgeScrollLastTime = 0;
let edgeScrollViewport = null;
let latestPointerPosition = null;
const reorderOffsets = new Map();
// insertSlotIndex is the latest pointer-derived destination used by Drop.
// liveInsertSlotIndex is the destination whose neighbour offsets have already
// been committed by the live-reorder timer. Keeping them separate prevents a
// quick pointer move from changing layout measurement before WinUI's delay.
const liveInsertSlotIndex = ref(-1);
let pendingLiveInsertIndex = -1;
let pendingLiveSourceIndices = [];
let liveReorderTimer;
// Keep pointer drags consistent with ListView: a drag session is broadcast
// to the GridView under the pointer, allowing cross-container drops without
// relying on browser HTML drag events (which are unavailable for touch/pen).
const pointerDragOwner = Symbol('winuionweb-gridview-drag-owner');
const pointerDragOverEvent = 'winuionweb-gridview-pointer-drag-over';
const pointerDragLeaveEvent = 'winuionweb-gridview-pointer-drag-leave';
const pointerDropEvent = 'winuionweb-gridview-pointer-drop';
let pointerDragDetail = null;
let pointerDropTarget = null;
const groupElements = new Map();

// Native HTML drag events only carry serializable DataTransfer payloads. Keep
// the actual item references in a short-lived registry so two GridView
// instances on the same page can move objects without stringifying templates.
const gridDragRegistry = (() => {
  const host = typeof globalThis !== 'undefined' ? globalThis : {};
  host.__winuionwebGridDragRegistry ||= new Map();
  return host.__winuionwebGridDragRegistry;
})();

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
// GridViewItem's margin is the spacing contract for an ItemsWrapGrid. Keep the
// panel free of a second, derived gap so an ItemContainerStyle margin is never
// counted twice.
// GridViewItem's default margin is part of the item container style in the
// WinUI template.  A user supplied ItemContainerStyle replaces that value;
// it must not be merged with a second panel gap.
const itemStyle = computed(() => ({
  margin: '0 4px 4px 0',
  ...itemContainerStyle.value
}));
const panelDimension = (value) => {
  const resolved = resolveXamlValue(value, instance);
  if (resolved === '' || resolved === null || resolved === undefined) return undefined;
  const numeric = Number(resolved);
  return Number.isFinite(numeric) && numeric >= 0 ? numeric : undefined;
};
const itemsPanelStyle = computed(() => {
  const panelElement = slotNodes.value.find((node) => getCollectionProperty(node) === 'itemsPanel');
  const panel = panelElement ? getVNodeChildren(panelElement)[0] : null;
  const maximum = Number(resolveXamlValue(panel?.props?.MaximumRowsOrColumns, instance));
  const itemWidth = panelDimension(panel?.props?.ItemWidth);
  const itemHeight = panelDimension(panel?.props?.ItemHeight);
  const widthTrack = itemWidth === undefined ? 'max-content' : `${itemWidth}px`;
  const heightTrack = itemHeight === undefined ? 'max-content' : `${itemHeight}px`;
  // GridView's default ItemsWrapGrid is horizontal. Horizontal stacking
  // fills a row before wrapping to the next row; vertical stacking fills a
  // column before wrapping to the next column.
  const orientation = resolveXamlValue(panel?.props?.Orientation, instance) || 'Horizontal';
  const style = {
    columnGap: '0px',
    rowGap: '0px',
    '--GridViewItemWidth': itemWidth === undefined ? undefined : `${itemWidth}px`,
    '--GridViewItemHeight': itemHeight === undefined ? undefined : `${itemHeight}px`
  };
  if (maximum > 0) {
    style.display = 'grid';
    if (orientation === 'Horizontal') {
      style.gridAutoFlow = 'row';
      style.gridTemplateColumns = `repeat(${maximum}, ${widthTrack})`;
      style.gridAutoRows = heightTrack;
    } else {
      style.gridAutoFlow = 'column';
      style.gridTemplateRows = `repeat(${maximum}, ${heightTrack})`;
      style.gridAutoColumns = widthTrack;
    }
  } else {
    // The default ItemsWrapGrid is a content-sized, wrapping panel.  A flex
    // line gives the browser the same measure/arrange contract as the WinUI
    // panel: items fill the available row and continue on the next line.
    style.display = 'flex';
    style.flexWrap = 'wrap';
    style.alignItems = 'flex-start';
    style.alignContent = 'flex-start';
    style.gridAutoFlow = orientation === 'Horizontal' ? 'row' : 'column';
    if (orientation === 'Horizontal') {
      style.flexDirection = 'row';
    } else {
      style.flexDirection = 'column';
    }
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
  width: cssLength(resolveXamlValue(props.Width, instance)), height: cssLength(resolveXamlValue(props.Height, instance)),
  minWidth: cssLength(resolveXamlValue(props.MinWidth, instance)), minHeight: cssLength(resolveXamlValue(props.MinHeight, instance)),
  maxWidth: cssLength(resolveXamlValue(props.MaxWidth, instance)), maxHeight: cssLength(resolveXamlValue(props.MaxHeight, instance)),
  margin: xamlThickness(resolveXamlValue(props.Margin, instance)),
  '--GridViewBackground': resolveXamlValue(props.Background, instance) || undefined,
  '--GridViewBorderBrush': resolveXamlValue(props.BorderBrush, instance) || undefined,
  '--GridViewBorderThickness': xamlThickness(resolveXamlValue(props.BorderThickness, instance)) || '0',
  '--GridViewCornerRadius': cssLength(resolveXamlValue(props.CornerRadius, instance)) || '0'
}));
const contentPaddingStyle = computed(() => ({
  padding: xamlThickness(resolveXamlValue(props.Padding, instance)) || '0 0 10px'
}));
const items = computed(() => {
  const source = resolveXamlValue(props.ItemsSource, instance);
  return Array.isArray(source) ? source : [];
});
const configuredIsGrouped = computed(() => resolveXamlValue(props.IsGrouped, instance));
const isGrouped = computed(() => {
  if (configuredIsGrouped.value === true) return true;
  if (configuredIsGrouped.value === false && typeof props.IsGrouped === 'string') return false;
  return items.value.length > 0
    && items.value.every(item => Array.isArray(item?.Items) || Array.isArray(item?.items));
});
const isEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance) !== false);
const isItemClickEnabled = computed(() => isEnabled.value && resolveXamlValue(props.IsItemClickEnabled, instance) === true);
const canDragItems = computed(() => isEnabled.value && resolveXamlValue(props.CanDragItems, instance) === true);
const canReorderItems = computed(() => isEnabled.value && resolveXamlValue(props.CanReorderItems, instance) === true);
const allowDrop = computed(() => isEnabled.value && resolveXamlValue(props.AllowDrop, instance) === true);
// ListViewBaseItem marks a container draggable when either CanDragItems or
// CanReorderItems is enabled. Whether the owning view accepts a reorder is a
// separate CanReorderItems + AllowDrop decision made during DragOver.
const canStartPointerDrag = computed(() => isEnabled.value
  && !isGrouped.value
  && (canDragItems.value || canReorderItems.value));
const dragVisualActive = computed(() => isDragging.value || isExternalDragOver.value);
const selectionMode = computed(() => resolveXamlValue(props.SelectionMode, instance) ?? 'Single');
const internalItems = ref([]);
let pendingItemsSource = null;
let lastItemsSource = [];
const sameItems = (left, right) => left.length === right.length && left.every((item, index) => toRaw(item) === toRaw(right[index]));
watch(() => items.value.slice(), (next) => {
  if (pendingItemsSource && sameItems(next, pendingItemsSource)) {
    pendingItemsSource = null;
    internalItems.value = [...next];
  } else if (!pendingItemsSource || !sameItems(next, lastItemsSource)) {
    pendingItemsSource = null;
    internalItems.value = [...next];
  }
  lastItemsSource = [...next];
}, { immediate: true });
const flatItems = computed(() => isGrouped.value
  ? items.value.flatMap(group => getGroupItems(group))
  : internalItems.value);
const internalSelectedItems = ref([]);
const configuredSelectedItems = computed(() => {
  const boundItems = resolveXamlValue(props.SelectedItems, instance);
  const boundItem = resolveXamlValue(props.SelectedItem, instance);
  if (Array.isArray(boundItems)) return boundItems;
  if (boundItem !== undefined && boundItem !== null) return [boundItem];
  const selectedIndex = Number(resolveXamlValue(props.SelectedIndex, instance));
  return selectedIndex >= 0 && flatItems.value[selectedIndex] !== undefined
    ? [flatItems.value[selectedIndex]]
    : internalSelectedItems.value;
});
const selectedItems = computed(() => selectionMode.value === 'None' ? [] : configuredSelectedItems.value);
const initialSelectedIndex = Number(resolveXamlValue(props.SelectedIndex, instance));
const focusedIndex = ref(initialSelectedIndex >= 0 ? initialSelectedIndex : 0);

const getItemKey = (item, index) => {
  if (item && typeof item === 'object') {
    return item.id ?? item.Id ?? item.key ?? item.Key ?? item.title ?? item.Title ?? index;
  }
  return item ?? index;
};
const getGroupItems = (group) => group?.Items ?? group?.items ?? [];
const getGroupKey = (group, index) => group?.id ?? group?.Id ?? group?.key ?? group?.Key ?? group?.title ?? group?.Title ?? index;
const getGroupTitle = (group) => group?.title ?? group?.Title ?? group?.key ?? group?.Key ?? '';
const isSameItem = (left, right) => toRaw(left) === toRaw(right);
const isSelected = (item) => selectedItems.value.some(candidate => isSameItem(candidate, item));
const getFlatIndex = (item, group, itemIndex) => {
  if (!isGrouped.value) return flatItems.value.findIndex(candidate => isSameItem(candidate, item));
  let offset = 0;
  for (const candidateGroup of items.value) {
    const groupItems = getGroupItems(candidateGroup);
    if (candidateGroup === group) return offset + itemIndex;
    const found = groupItems.findIndex(candidate => isSameItem(candidate, item));
    if (found >= 0) return offset + found;
    offset += groupItems.length;
  }
  return -1;
};
const itemTabIndex = (index) => isEnabled.value && index === focusedIndex.value ? 0 : -1;
const onItemFocus = (index) => {
  if (index >= 0) focusedIndex.value = index;
};

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

const emitSelection = (newSel, originalSource = null) => {
  const previous = [...selectedItems.value];
  const addedItems = newSel.filter(item => !previous.some(current => isSameItem(current, item)));
  const removedItems = previous.filter(item => !newSel.some(current => isSameItem(current, item)));
  if (!addedItems.length && !removedItems.length) return;
  const selectedItem = newSel[0] ?? null;
  const selectedIndex = selectedItem === null
    ? -1
    : flatItems.value.findIndex(item => isSameItem(item, selectedItem));
  internalSelectedItems.value = [...newSel];
  emit('update:SelectedItems', newSel);
  emit('update:SelectedItem', selectedItem);
  emit('update:SelectedIndex', selectedIndex);
  const args = {
    AddedItems: addedItems,
    RemovedItems: removedItems,
    SelectedItems: newSel,
    SelectedItem: selectedItem,
    SelectedIndex: selectedIndex,
    OriginalSource: originalSource
  };
  emit('SelectionChanged', args);
  resolveXamlHandler(attrs.SelectionChanged, instance)?.(args);
};

const onCheckboxToggle = (val, item) => {
  if (!isEnabled.value) return;
  const newSel = [...selectedItems.value];
  const pos = newSel.findIndex(candidate => isSameItem(candidate, item));
  if (val && pos === -1) newSel.push(item);
  else if (!val && pos > -1) newSel.splice(pos, 1);
  emitSelection(newSel, item);
};

const invokeItemClick = (e, item) => {
  if (!isItemClickEnabled.value) return;
  const args = { ClickedItem: item, OriginalSource: e?.currentTarget ?? e?.target ?? null };
  emit('ItemClick', args);
  resolveXamlHandler(attrs.ItemClick, instance)?.(args);
};

const onItemClick = (e, item, index) => {
  if (!isEnabled.value || isDragging.value || Date.now() < suppressClickUntil) return;
  focusedIndex.value = index;
  if (selectionMode.value === 'None') {
    invokeItemClick(e, item);
    return;
  }
  if (selectionMode.value === 'Single') {
    invokeItemClick(e, item);
    emitSelection([item], e?.currentTarget ?? e?.target);
    anchorIndex = index;
    return;
  }
  if (selectionMode.value === 'Multiple') {
    const newSel = [...selectedItems.value];
    const pos = newSel.indexOf(item);
    if (pos > -1) newSel.splice(pos, 1);
    else newSel.push(item);
    emitSelection(newSel, e?.currentTarget ?? e?.target);
    invokeItemClick(e, item);
    return;
  }
  if (selectionMode.value === 'Extended') {
    let newSel = [...selectedItems.value];
    if (e.ctrlKey || e.metaKey) {
      const pos = newSel.indexOf(item);
      if (pos > -1) newSel.splice(pos, 1);
      else newSel.push(item);
      anchorIndex = index;
    } else if (e.shiftKey && anchorIndex !== null) {
      const start = Math.min(anchorIndex, index);
      const end = Math.max(anchorIndex, index);
      newSel = flatItems.value.slice(start, end + 1);
    } else {
      newSel = [item];
      anchorIndex = index;
    }
    emitSelection(newSel, e?.currentTarget ?? e?.target);
    invokeItemClick(e, item);
  }
};

const itemsPanelDefinition = () => {
  const panelElement = slotNodes.value.find((node) => getCollectionProperty(node) === 'itemsPanel');
  const panel = panelElement ? getVNodeChildren(panelElement)[0] : null;
  return {
    // GridView's default ItemsWrapGrid is horizontal.  In that mode the
    // panel fills a row before starting the next row, matching WinUI's
    // stacking-line semantics.
    orientation: resolveXamlValue(panel?.props?.Orientation, instance) || 'Horizontal',
    maximum: Number(resolveXamlValue(panel?.props?.MaximumRowsOrColumns, instance)) || 0
  };
};

const geometryNavigationIndex = (index, key) => {
  const root = innerRef.value?.$el || innerRef.value || containerRef.value;
  const elements = root?.querySelectorAll?.('[role="gridcell"]') ?? [];
  const current = elements[index];
  if (!current) return index;
  const currentRect = current.getBoundingClientRect();
  const horizontal = key === 'ArrowLeft' || key === 'ArrowRight';
  const isRtl = flowDirectionStyle.value === 'rtl';
  const leftKey = isRtl ? 'ArrowRight' : 'ArrowLeft';
  const rightKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
  const sign = key === leftKey || key === 'ArrowUp' ? -1 : 1;
  let best = -1;
  let bestDistance = Number.POSITIVE_INFINITY;
  elements.forEach((element, candidateIndex) => {
    if (candidateIndex === index) return;
    const rect = element.getBoundingClientRect();
    const primary = horizontal ? rect.left - currentRect.left : rect.top - currentRect.top;
    const cross = horizontal ? Math.abs(rect.top - currentRect.top) : Math.abs(rect.left - currentRect.left);
    if ((sign < 0 && primary >= -1) || (sign > 0 && primary <= 1)) return;
    const distance = Math.abs(primary) * 1000 + cross;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = candidateIndex;
    }
  });
  return best < 0 ? index : best;
};

const navigationIndex = (index, key) => {
  const count = flatItems.value.length;
  if (!count) return -1;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  const { orientation, maximum } = itemsPanelDefinition();
  if (!maximum) return geometryNavigationIndex(index, key);
  const horizontal = orientation === 'Horizontal';
  const step = horizontal ? 1 : maximum;
  const crossStep = horizontal ? maximum : 1;
  let next = index;
  const isRtl = flowDirectionStyle.value === 'rtl';
  if (key === (isRtl ? 'ArrowRight' : 'ArrowLeft')) next -= step;
  else if (key === (isRtl ? 'ArrowLeft' : 'ArrowRight')) next += step;
  else if (key === 'ArrowUp') next -= crossStep;
  else if (key === 'ArrowDown') next += crossStep;
  return Math.max(0, Math.min(count - 1, next));
};

const selectFromKeyboard = (index, event) => {
  const item = flatItems.value[index];
  if (item === undefined || selectionMode.value === 'None') return;
  let next = [...selectedItems.value];
  if (selectionMode.value === 'Multiple' && (event.ctrlKey || event.metaKey)) return;
  if (selectionMode.value === 'Extended' && event.shiftKey && anchorIndex !== null) {
    const start = Math.min(anchorIndex, index);
    const end = Math.max(anchorIndex, index);
    next = flatItems.value.slice(start, end + 1);
  } else {
    next = [item];
    anchorIndex = index;
  }
  emitSelection(next, event.currentTarget);
};

const onItemKeyDown = (event, item, index) => {
  if (!isEnabled.value) return;
  const key = event.key;
  if (key === 'Enter' || key === ' ') {
    event.preventDefault();
    onItemClick(event, item, index);
    return;
  }
  if (!['Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) return;
  event.preventDefault();
  const nextIndex = navigationIndex(index, key);
  if (nextIndex < 0) return;
  focusedIndex.value = nextIndex;
  if (selectionMode.value === 'Single' || selectionMode.value === 'Extended') selectFromKeyboard(nextIndex, event);
  nextTick(() => {
    const root = innerRef.value?.$el || innerRef.value || containerRef.value;
    const target = root?.querySelectorAll?.('[role="gridcell"]')?.[nextIndex];
    target?.focus?.();
  });
};

const cacheNonDragRects = () => {
  const container = innerRef.value?.$el || innerRef.value;
  if (!container) return;

  // Cache every arranged slot, including the source items.  The old
  // implementation queried only `:not(.dragging-source)` and then paired the
  // remaining elements with the original indices.  As soon as an item was
  // dragged from the middle of a grid, every following midpoint was shifted
  // onto the wrong item.  ListView keeps the complete arranged surface and
  // excludes source indices only while calculating a destination.
  const els = Array.from(container.querySelectorAll('.win-grid-item'));
  const entries = [];
  for (let index = 0; index < Math.min(flatItems.value.length, els.length); index++) {
    const rect = els[index].getBoundingClientRect();
    entries.push({
      itemIndex: index,
      rect,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      midX: rect.left + rect.width / 2,
      midY: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
      slotSizeX: rect.width,
      slotSizeY: rect.height
    });
  }
  cachedRects = entries;
  reorderOffsets.clear();
  dragLayoutVersion.value++;
  dragScrollViewport = containerRef.value?.querySelector?.('.win-scroll-viewer-viewport') ?? null;
  dragLayoutScrollLeft = dragScrollViewport?.scrollLeft ?? 0;
  dragLayoutScrollTop = dragScrollViewport?.scrollTop ?? 0;
};

const shiftCachedLayoutForScroll = () => {
  const viewport = dragScrollViewport;
  if (!viewport || !cachedRects.length) return;
  const nextLeft = viewport.scrollLeft ?? 0;
  const nextTop = viewport.scrollTop ?? 0;
  const deltaX = nextLeft - dragLayoutScrollLeft;
  const deltaY = nextTop - dragLayoutScrollTop;
  if (Math.abs(deltaX) < 0.01 && Math.abs(deltaY) < 0.01) return;
  for (const entry of cachedRects) {
    entry.left -= deltaX;
    entry.right -= deltaX;
    entry.midX -= deltaX;
    entry.top -= deltaY;
    entry.bottom -= deltaY;
    entry.midY -= deltaY;
    entry.rect = {
      ...entry.rect,
      left: entry.left,
      right: entry.right,
      top: entry.top,
      bottom: entry.bottom
    };
  }
  dragLayoutScrollLeft = nextLeft;
  dragLayoutScrollTop = nextTop;
  dragLayoutVersion.value++;
};

const readGridDragPayload = (event) => {
  const dataTransfer = event?.dataTransfer;
  if (!dataTransfer) return null;
  let token = '';
  try {
    token = dataTransfer.getData('application/x-winuionweb-gridview')
      || dataTransfer.getData('text/plain')
      || '';
  } catch {
    token = '';
  }
  return token ? gridDragRegistry.get(token) ?? null : null;
};

const isReorderTarget = (index) => dragVisualActive.value
  && dragOverIndex.value === index
  && !dragIndices.value.includes(index);

// Keep the arranged grid slot stable while the visual surface moves. The
// offset is computed from the same cached rectangles used for insertion, so
// a dragged cell never changes the wrap measurement of its neighbours.
const reorderTransform = (index) => {
  if (!dragVisualActive.value || dragIndices.value.includes(index)) return undefined;
  void dragLayoutVersion.value;
  const offset = reorderOffsets.get(index);
  return offset && (offset.x || offset.y)
    ? `translate3d(${offset.x}px, ${offset.y}px, 0)`
    : undefined;
};

// GridViewItemPresenter's ReorderHintStates translate the visual surface by
// 16px toward the insertion side. Keep this paint-only hint on the presenter;
// the outer item continues to own the arranged-slot transform above.
const reorderHintStyle = (index) => {
  if (!isReorderTarget(index) || insertSlotIndex.value < 0) {
    return {
      '--grid-reorder-hint-x': '0px',
      '--grid-reorder-hint-y': '0px'
    };
  }
  const orientation = gridOrientation();
  const after = insertSlotIndex.value > index;
  let sign = after ? 1 : -1;
  if (orientation === 'Horizontal' && flowDirectionStyle.value === 'rtl') sign *= -1;
  return orientation === 'Horizontal'
    ? { '--grid-reorder-hint-x': `${sign * GRID_REORDER_HINT_OFFSET}px`, '--grid-reorder-hint-y': '0px' }
    : { '--grid-reorder-hint-x': '0px', '--grid-reorder-hint-y': `${sign * GRID_REORDER_HINT_OFFSET}px` };
};

const removeDragImage = () => {
  if (dragImageElement?.parentNode) dragImageElement.parentNode.removeChild(dragImageElement);
  dragImageElement = null;
};

const removePointerPreview = () => {
  if (pointerPreviewElement?.parentNode) pointerPreviewElement.parentNode.removeChild(pointerPreviewElement);
  pointerPreviewElement = null;
};

const createPointerPreview = (source, count) => {
  if (!source || typeof document === 'undefined') return null;
  removePointerPreview();
  const preview = source.cloneNode(true);
  preview.querySelectorAll?.('[id]').forEach(node => node.removeAttribute('id'));
  preview.removeAttribute?.('id');
  preview.classList?.remove('dragging-source', 'reorder-target');
  preview.classList?.add('win-grid-pointer-drag-preview');
  const rect = source.getBoundingClientRect();
  Object.assign(preview.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: `${Math.max(1, rect.width)}px`,
    height: `${Math.max(1, rect.height)}px`,
    margin: '0',
    pointerEvents: 'none',
    transform: 'translate3d(-10000px, -10000px, 0)'
  });
  if (count > 1) {
    const badge = document.createElement('span');
    badge.className = 'drag-count-badge';
    badge.textContent = String(count);
    preview.appendChild(badge);
  }
  document.body.appendChild(preview);
  pointerPreviewElement = preview;
  return preview;
};

const createDragImage = (source, count, event) => {
  if (!source || typeof document === 'undefined') return;
  removeDragImage();
  const preview = source.cloneNode(true);
  preview.querySelectorAll?.('[id]').forEach(node => node.removeAttribute('id'));
  preview.removeAttribute?.('id');
  preview.classList?.remove('dragging-source', 'reorder-target');
  preview.classList?.add('win-grid-drag-image');
  const rect = source.getBoundingClientRect();
  Object.assign(preview.style, {
    position: 'fixed',
    left: '-10000px',
    top: '-10000px',
    width: `${Math.max(1, rect.width)}px`,
    height: `${Math.max(1, rect.height)}px`,
    margin: '0',
    pointerEvents: 'none',
    transform: 'none'
  });
  if (count > 1) {
    const badge = document.createElement('span');
    badge.className = 'drag-count-badge';
    badge.textContent = String(count);
    preview.appendChild(badge);
  }
  document.body.appendChild(preview);
  dragImageElement = preview;
  const offsetX = Number.isFinite(event?.clientX) ? event.clientX - rect.left : rect.width / 2;
  const offsetY = Number.isFinite(event?.clientY) ? event.clientY - rect.top : rect.height / 2;
  try {
    event?.dataTransfer?.setDragImage(preview, Math.max(0, Math.min(rect.width, offsetX)), Math.max(0, Math.min(rect.height, offsetY)));
  } catch {
    // Some WebKit versions reject detached/non-image drag previews.
  }
};

const gridOrientation = () => itemsPanelDefinition().orientation === 'Vertical' ? 'Vertical' : 'Horizontal';

const gridRowsOrColumns = (entries, orientation) => {
  const groups = [];
  const sorted = [...entries].sort((a, b) => a.itemIndex - b.itemIndex);
  for (const entry of sorted) {
    const mainStart = orientation === 'Horizontal' ? entry.top : entry.left;
    const mainEnd = orientation === 'Horizontal' ? entry.bottom : entry.right;
    let group = groups[groups.length - 1];
    // ItemsWrapGrid rows/columns are separated by the panel's actual gap.
    // A height/width percentage tolerance incorrectly merged adjacent rows
    // whenever the gap was smaller than 40% of an item (the gallery's normal
    // 4-10px spacing), so a drag over the first item of the next row was read
    // as a horizontal move in the previous row.  Only overlapping arranged
    // intervals belong to the same row/column; any real gap starts a group.
    if (!group || mainStart > group.end + 1) {
      group = { entries: [], start: mainStart, end: mainEnd, center: (mainStart + mainEnd) / 2 };
      groups.push(group);
    }
    group.entries.push(entry);
    group.start = Math.min(group.start, mainStart);
    group.end = Math.max(group.end, mainEnd);
    group.center = (group.start + group.end) / 2;
  }
  for (const group of groups) {
    group.entries.sort((a, b) => orientation === 'Horizontal'
      ? (flowDirectionStyle.value === 'rtl' ? b.left - a.left : a.left - b.left)
      : a.top - b.top);
  }
  return groups;
};

// Return the raw item index immediately before which a drag should be
// inserted.  The calculation uses arranged rows/columns and item midpoints,
// just like ListView's vertical midpoint algorithm, while retaining the
// ItemsWrapGrid's two-dimensional geometry.
const calcInsertSlot = (mouseX, mouseY, excludedIndices = dragIndices.value) => {
  if (cachedRects.length === 0) return -1;
  const candidates = cachedRects.filter(entry => !excludedIndices.includes(entry.itemIndex));
  if (!candidates.length) return flatItems.value.length;
  const orientation = gridOrientation();
  // Keep source entries while discovering rows/columns.  Removing a hidden
  // source before grouping can erase a one-item row and shifts the row
  // boundary used by the remaining candidates.  Sources are filtered only
  // when selecting the insertion item below.
  const groups = gridRowsOrColumns(cachedRects, orientation);
  const pointerMain = orientation === 'Horizontal' ? mouseY : mouseX;
  let group = groups[0];
  if (pointerMain < groups[0].start) group = groups[0];
  else if (pointerMain > groups[groups.length - 1].end) group = groups[groups.length - 1];
  else {
    // Flip groups at the midpoint between adjacent rows/columns. This keeps
    // the insertion destination stable while crossing the inter-line gap.
    for (let index = 0; index < groups.length - 1; index++) {
      const boundary = (groups[index].center + groups[index + 1].center) / 2;
      if (pointerMain < boundary) {
        group = groups[index];
        break;
      }
      group = groups[index + 1];
    }
  }

  const pointerCross = orientation === 'Horizontal' ? mouseX : mouseY;
  const groupCandidates = group.entries.filter(entry => !excludedIndices.includes(entry.itemIndex));
  // WrapGrid chooses the first item whose midpoint is beyond the pointer.
  // Once the pointer passes an item, the insertion point is immediately after
  // that item, not at the end of the entire row. The old implementation only
  // handled the first branch and therefore skipped every position after the
  // first cell in a row (most visible when dragging into the final row).
  for (const entry of groupCandidates) {
    const midpoint = orientation === 'Horizontal' ? entry.midX : entry.midY;
    const before = orientation === 'Horizontal' && flowDirectionStyle.value === 'rtl'
      ? pointerCross > midpoint
      : pointerCross < midpoint;
    if (before) return entry.itemIndex;
  }

  // Search by the last arranged entry in this row, rather than the last
  // non-source entry. When the dragged item is the row's final cell, using
  // the filtered list makes the algorithm return the wrong row boundary.
  const lastIndex = Math.max(...group.entries.map(entry => entry.itemIndex));
  const next = candidates.find(entry => entry.itemIndex > lastIndex);
  return next?.itemIndex ?? flatItems.value.length;
};

const pointerGridOverIndex = (mouseX, mouseY, excludedIndices = dragIndices.value) => {
  if (!cachedRects.length) return -1;
  const orientation = gridOrientation();
  const groups = gridRowsOrColumns(cachedRects, orientation);
  if (!groups.length) return -1;
  const pointerMain = orientation === 'Horizontal' ? mouseY : mouseX;
  const pointerCross = orientation === 'Horizontal' ? mouseX : mouseY;
  let group = groups[0];
  if (pointerMain < groups[0].start) group = groups[0];
  else if (pointerMain > groups[groups.length - 1].end) group = groups[groups.length - 1];
  else {
    for (let index = 0; index < groups.length - 1; index++) {
      const boundary = (groups[index].center + groups[index + 1].center) / 2;
      if (pointerMain < boundary) {
        group = groups[index];
        break;
      }
      group = groups[index + 1];
    }
  }
  const candidates = group.entries.filter(entry => !excludedIndices.includes(entry.itemIndex));
  let nearest = null;
  let nearestDistance = Number.POSITIVE_INFINITY;
  for (const entry of candidates) {
    const offset = reorderOffsets.get(entry.itemIndex) || { x: 0, y: 0 };
    const left = entry.left + offset.x;
    const top = entry.top + offset.y;
    const width = Math.max(1, entry.width);
    const height = Math.max(1, entry.height);
    const relative = orientation === 'Horizontal'
      ? (pointerCross - left) / width
      : (pointerCross - top) / height;
    // ListViewBaseItem uses a 30/40/30 drag-over zone for GridViewItem. The
    // zone is measured on the panel's logical axis only; applying it to both
    // axes makes a valid target disappear near row boundaries.
    if (relative > .3 && relative < .7) return entry.itemIndex;
    const crossCenter = orientation === 'Horizontal' ? left + width / 2 : top + height / 2;
    const distance = Math.abs(pointerCross - crossCenter) + Math.abs(pointerMain - (orientation === 'Horizontal' ? entry.midY : entry.midX));
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = entry.itemIndex;
    }
  }
  // WrapGrid still reports the closest realized item when the pointer lies in
  // the inter-row/column gap. This keeps the last row targetable instead of
  // losing DragOver as soon as the pointer crosses its leading edge.
  return nearest ?? -1;
};

const flatList = computed(() => flatItems.value.map((item, index) => ({
  type: 'item',
  key: 'item-' + getItemKey(item, index),
  item,
  index
})));

const clearExternalDropVisual = () => {
  if (!isExternalDragOver.value && !externalDragToken.value && !activeDragItems.value.length) return;
  stopEdgeAutoScroll();
  isExternalDragOver.value = false;
  // The target borrows the drag state only for the external session. Clear
  // the source-like visual as soon as the pointer leaves or the drag cancels.
  isDragging.value = false;
  externalDragToken.value = '';
  insertSlotIndex.value = -1;
  dragOverIndex.value = -1;
  dragItemWidth.value = 0;
  dragItemHeight.value = 0;
  cachedRects = [];
  clearLiveReorder();
  dragLayoutVersion.value++;
  activeDragItems.value = [];
  dragDropAccepted.value = false;
  latestPointerPosition = null;
  edgeScrollViewport = null;
};

const normalizeOwnInsertIndex = (slot, sourceIndices = dragIndices.value) => {
  const sorted = [...new Set(sourceIndices)].sort((a, b) => a - b);
  if (!sorted.length || slot < 0) return slot;

  // Compare the prospective order with the current order instead of relying
  // on a contiguous-selection shortcut. This also handles non-contiguous
  // multi-selection and the boundary immediately after the last item.
  const sourceSet = new Set(sorted);
  const remaining = flatItems.value
    .map((_, index) => index)
    .filter(index => !sourceSet.has(index));
  const insertAt = slot >= flatItems.value.length
    ? remaining.length
    : remaining.filter(index => index < slot).length;
  const result = [
    ...remaining.slice(0, insertAt),
    ...sorted,
    ...remaining.slice(insertAt)
  ];
  const unchanged = result.length === flatItems.value.length
    && result.every((itemIndex, index) => itemIndex === index);
  return unchanged ? -1 : Math.min(flatItems.value.length, slot);
};

const collectionInsertIndex = (slot, sourceIndices = dragIndices.value) => {
  const sourceSet = new Set(sourceIndices);
  const remaining = flatItems.value.filter((_, index) => !sourceSet.has(index));
  if (slot >= flatItems.value.length) return remaining.length;
  return Math.max(0, flatItems.value
    .slice(0, slot)
    .filter((_, index) => !sourceSet.has(index)).length);
};

const updateInsertSlot = (event, excludedIndices = null, ownDrag = null, sourceIndices = null) => {
  if ((!isDragging.value && !isExternalDragOver.value) || !cachedRects.length) {
    nextTick(cacheNonDragRects);
  }
  if ((!isDragging.value && !isExternalDragOver.value) || cachedRects.length === 0) return;
  shiftCachedLayoutForScroll();
  const excluded = Array.isArray(excludedIndices)
    ? excludedIndices
    : isDragging.value && !isExternalDragOver.value ? dragIndices.value : [];
  const isOwnDrag = ownDrag === null ? (isDragging.value && !isExternalDragOver.value) : ownDrag;
  const activeSourceIndices = Array.isArray(sourceIndices) ? sourceIndices : dragIndices.value;
  const slot = calcInsertSlot(event.clientX, event.clientY, excluded);
  if (slot < 0) return;

  const normalized = isOwnDrag ? normalizeOwnInsertIndex(slot, activeSourceIndices) : slot;
  insertSlotIndex.value = normalized;
  dragOverIndex.value = pointerGridOverIndex(event.clientX, event.clientY, excluded);
  if (isOwnDrag) {
    scheduleLiveReorder(normalized, activeSourceIndices);
  } else {
    // External drops have no local source item to animate through the panel;
    // reserve their destination immediately so the insertion gap is visible.
    scheduleLiveReorder(normalized, activeSourceIndices, true);
  }
};

// GridView's ScrollViewer is the same drag viewport used by ListView. Keep
// the pointer session alive at its edge and continuously recompute the row,
// target and insertion slot while the viewport advances.
const stopEdgeAutoScroll = () => {
  if (edgeScrollStartTimer !== undefined) {
    window.clearTimeout(edgeScrollStartTimer);
    edgeScrollStartTimer = undefined;
  }
  if (edgeScrollFrame !== undefined) {
    window.cancelAnimationFrame(edgeScrollFrame);
    edgeScrollFrame = undefined;
  }
  edgeScrollVelocity = 0;
  edgeScrollLastTime = 0;
  edgeScrollViewport = null;
};

const findPointerViewport = () => {
  if (!latestPointerPosition) return null;
  const hit = document.elementFromPoint(latestPointerPosition.x, latestPointerPosition.y);
  const grid = hit?.closest?.('.win-grid-view');
  return grid?.querySelector?.('.win-scroll-viewer-viewport') ?? null;
};

const computeEdgeScrollVelocity = (clientY) => {
  const viewport = findPointerViewport()
    || dragScrollViewport
    || containerRef.value?.querySelector?.('.win-scroll-viewer-viewport');
  if (!viewport) return 0;
  edgeScrollViewport = viewport;
  const rect = viewport.getBoundingClientRect();
  const maxScrollTop = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
  if (maxScrollTop <= 0) return 0;
  if (clientY < rect.top - EDGE_SCROLL_SIZE || clientY > rect.bottom + EDGE_SCROLL_SIZE) return 0;
  const topDistance = clientY - rect.top;
  const bottomDistance = rect.bottom - clientY;
  if (topDistance >= EDGE_SCROLL_SIZE && bottomDistance >= EDGE_SCROLL_SIZE) return 0;
  const distance = Math.max(0, Math.min(topDistance, bottomDistance));
  const direction = topDistance < EDGE_SCROLL_SIZE ? -1 : 1;
  if (direction < 0 && viewport.scrollTop <= 0) return 0;
  if (direction > 0 && viewport.scrollTop >= maxScrollTop) return 0;
  const ratio = Math.max(0, Math.min(1, distance / EDGE_SCROLL_SIZE));
  return direction * (EDGE_SCROLL_MAX_SPEED
    - (EDGE_SCROLL_MAX_SPEED - EDGE_SCROLL_MIN_SPEED) * ratio);
};

const recalculateGridDragTarget = () => {
  if (!dragVisualActive.value || !latestPointerPosition) return;
  updateInsertSlot(
    { clientX: latestPointerPosition.x, clientY: latestPointerPosition.y },
    isExternalDragOver.value ? [] : dragIndices.value,
    !isExternalDragOver.value,
    isExternalDragOver.value ? [] : dragIndices.value
  );
};

const runEdgeAutoScroll = (now) => {
  if (!dragVisualActive.value || !edgeScrollVelocity || !edgeScrollViewport) {
    edgeScrollFrame = undefined;
    return;
  }
  const elapsed = edgeScrollLastTime > 0 ? Math.min(50, now - edgeScrollLastTime) : 16;
  edgeScrollLastTime = now;
  const previous = edgeScrollViewport.scrollTop;
  const maxScrollTop = Math.max(0, edgeScrollViewport.scrollHeight - edgeScrollViewport.clientHeight);
  edgeScrollViewport.scrollTop = Math.max(
    0,
    Math.min(maxScrollTop, previous + edgeScrollVelocity * elapsed / 1000)
  );
  if (Math.abs(edgeScrollViewport.scrollTop - previous) > 0.01) {
    // A pointer drag can scroll a different GridView than the one that owns
    // this closure.  Its layout cache belongs to that target view, so applying
    // the source view's scroll delta here would shift unrelated rectangles and
    // make the insertion slot jump.  The target's native scroll listener (and
    // its pointer-drag-over event below) owns target-cache invalidation.
    if (edgeScrollViewport === dragScrollViewport) {
      shiftCachedLayoutForScroll();
      recalculateGridDragTarget();
    } else if (pointerDropTarget && pointerDragDetail) {
      // Pointer coordinates remain stationary while auto-scroll advances the
      // target. Re-dispatch the same routed drag-over event so the target can
      // recompute its two-dimensional insertion slot and live-reorder state.
      pointerDragDetail.clientX = latestPointerPosition?.x ?? pointerDragDetail.clientX;
      pointerDragDetail.clientY = latestPointerPosition?.y ?? pointerDragDetail.clientY;
      pointerDragDetail.accepted = false;
      pointerDropTarget.dispatchEvent(new CustomEvent(pointerDragOverEvent, {
        detail: pointerDragDetail
      }));
      if (!pointerDragDetail.accepted) pointerDropTarget = null;
    }
  } else {
    stopEdgeAutoScroll();
    return;
  }
  edgeScrollFrame = window.requestAnimationFrame(runEdgeAutoScroll);
};

const updateEdgeAutoScroll = (clientY) => {
  const nextVelocity = computeEdgeScrollVelocity(clientY);
  if (!nextVelocity) {
    stopEdgeAutoScroll();
    return;
  }
  edgeScrollVelocity = nextVelocity;
  if (edgeScrollFrame !== undefined) return;
  if (edgeScrollStartTimer === undefined) {
    edgeScrollStartTimer = window.setTimeout(() => {
      edgeScrollStartTimer = undefined;
      if (!edgeScrollVelocity || !dragVisualActive.value) return;
      edgeScrollLastTime = 0;
      edgeScrollFrame = window.requestAnimationFrame(runEdgeAutoScroll);
    }, EDGE_SCROLL_DELAY);
  }
};

const onDragViewportScroll = () => {
  if (!dragVisualActive.value) return;
  shiftCachedLayoutForScroll();
  recalculateGridDragTarget();
};

const updateReorderOffsets = (slot, sourceIndices = dragIndices.value) => {
  reorderOffsets.clear();
  if (!dragVisualActive.value || slot < 0 || !cachedRects.length) {
    dragLayoutVersion.value++;
    return;
  }
  const source = [...sourceIndices].sort((a, b) => a - b);
  if (!source.length) {
    // An external drag reserves a group of arranged slots at the destination.
    const gapCount = Math.max(1, activeDragItems.value.length || 1);
    const candidates = cachedRects.slice().sort((a, b) => a.itemIndex - b.itemIndex);
    const destination = slot >= flatItems.value.length
      ? candidates.length
      : candidates.findIndex(entry => entry.itemIndex >= slot);
    const insertPosition = destination < 0 ? candidates.length : destination;
    for (let position = insertPosition; position < candidates.length; position++) {
      const entry = candidates[position];
      const target = candidates[position + gapCount];
      if (target) reorderOffsets.set(entry.itemIndex, {
        x: target.left - entry.left,
        y: target.top - entry.top
      });
    }
    dragLayoutVersion.value++;
    return;
  }

  // Keep the arranged grid slots fixed and move the affected neighbours to
  // the slots they would occupy after insertion. This handles row wrapping,
  // variable item sizes and multi-selection without the old one-dimensional
  // +/- average-width approximation.
  const sourceSet = new Set(source);
  const entries = cachedRects.slice().sort((a, b) => a.itemIndex - b.itemIndex);
  const remaining = entries.filter(entry => !sourceSet.has(entry.itemIndex));
  const before = slot >= flatItems.value.length
    ? remaining.length
    : remaining.filter(entry => entry.itemIndex < slot).length;
  const result = [
    ...remaining.slice(0, before).map(entry => entry.itemIndex),
    ...source,
    ...remaining.slice(before).map(entry => entry.itemIndex)
  ];
  const slots = entries.map(entry => entry);
  const entryByIndex = new Map(entries.map(entry => [entry.itemIndex, entry]));
  result.forEach((itemIndex, position) => {
    if (sourceSet.has(itemIndex)) return;
    const current = entryByIndex.get(itemIndex);
    const target = slots[position];
    if (!current || !target) return;
    const x = target.left - current.left;
    const y = target.top - current.top;
    if (Math.abs(x) > .1 || Math.abs(y) > .1) reorderOffsets.set(itemIndex, { x, y });
  });
  dragLayoutVersion.value++;
};

const clearLiveReorderTimer = () => {
  if (liveReorderTimer !== undefined) {
    window.clearTimeout(liveReorderTimer);
    liveReorderTimer = undefined;
  }
};

const applyLiveReorder = (slot, sourceIndices = dragIndices.value) => {
  clearLiveReorderTimer();
  const normalized = normalizeOwnInsertIndex(slot, sourceIndices);
  liveInsertSlotIndex.value = normalized;
  updateReorderOffsets(normalized, sourceIndices);
};

// GridView's ReorderThemeTransition is driven by a delayed live-reorder
// operation. The pointer target and insertion candidate are still updated on
// every DragOver; only the neighbour translations wait for the 300ms timer.
const scheduleLiveReorder = (slot, sourceIndices = dragIndices.value, immediate = false) => {
  const normalized = normalizeOwnInsertIndex(slot, sourceIndices);
  const nextSources = [...sourceIndices].sort((a, b) => a - b);
  const samePending = normalized === pendingLiveInsertIndex
    && nextSources.length === pendingLiveSourceIndices.length
    && nextSources.every((value, index) => value === pendingLiveSourceIndices[index]);

  pendingLiveInsertIndex = normalized;
  pendingLiveSourceIndices = nextSources;

  if (immediate) {
    applyLiveReorder(normalized, nextSources);
    return;
  }

  // Returning to the currently applied slot cancels a not-yet-fired move and
  // restores the stable arranged surface immediately.
  if (normalized === liveInsertSlotIndex.value) {
    clearLiveReorderTimer();
    return;
  }
  if (samePending && liveReorderTimer !== undefined) return;

  clearLiveReorderTimer();
  liveReorderTimer = window.setTimeout(() => {
    liveReorderTimer = undefined;
    if (!dragVisualActive.value) return;
    applyLiveReorder(pendingLiveInsertIndex, pendingLiveSourceIndices);
  }, LIVE_REORDER_DELAY);
};

const flushLiveReorder = () => {
  const hasPending = liveReorderTimer !== undefined
    || pendingLiveInsertIndex !== liveInsertSlotIndex.value;
  clearLiveReorderTimer();
  if (!dragVisualActive.value || !hasPending) return;
  applyLiveReorder(pendingLiveInsertIndex, pendingLiveSourceIndices);
};

const clearLiveReorder = () => {
  clearLiveReorderTimer();
  pendingLiveInsertIndex = -1;
  pendingLiveSourceIndices = [];
  liveInsertSlotIndex.value = -1;
  reorderOffsets.clear();
  dragLayoutVersion.value++;
};

const onDragStart = (e, index) => {
  if (!canStartPointerDrag.value || isGrouped.value) {
    e.preventDefault?.();
    return;
  }
  const el = e.currentTarget;
  if (el) {
    dragItemWidth.value = el.offsetWidth;
    dragItemHeight.value = el.offsetHeight;
  }
  if (isSelected(flatItems.value[index]) && selectedItems.value.length > 1) {
    dragIndices.value = flatItems.value
      .map((it, i) => isSelected(it) ? i : -1)
      .filter(i => i !== -1);
  } else {
    dragIndices.value = [index];
  }
  dragOriginIndex.value = index;
  insertSlotIndex.value = -1;
  dragOverIndex.value = -1;
  clearLiveReorder();
  const args = {
    Items: dragIndices.value.map(i => flatItems.value[i]),
    OriginalSource: e.target ?? e.currentTarget,
    Cancel: false
  };
  activeDragItems.value = [...args.Items];
  emit('DragItemsStarting', args);
  resolveXamlHandler(attrs.DragItemsStarting, instance)?.(args);
  if (args.Cancel) {
    e.preventDefault?.();
    cancelDrag(args.OriginalSource);
    return;
  }

  const token = `grid-${instance?.uid ?? 'view'}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  dragToken.value = token;
  gridDragRegistry.set(token, {
    token,
    source: instance,
    items: [...args.Items],
    indices: [...dragIndices.value],
    width: dragItemWidth.value,
    height: dragItemHeight.value,
    complete: originalSource => completeExternalSourceDrop(token, originalSource)
  });
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('application/x-winuionweb-gridview', token);
      e.dataTransfer.setData('text/plain', token);
    } catch {
      // Firefox may reject custom data in sandboxed documents; the local
      // isDragging state still provides same-control reordering.
    }
    createDragImage(el, args.Items.length, e);
  }
  isDragging.value = true;
  isExternalDragOver.value = false;
  dragDropAccepted.value = false;
  nextTick(cacheNonDragRects);
};

const releasePointerCapture = () => {
  const pending = pointerDrag.value;
  if (!pending?.source) return;
  try {
    if (pending.source.hasPointerCapture?.(pending.pointerId)) {
      intentionallyReleasedPointerCaptures.add(pending.pointerId);
      pending.source.releasePointerCapture?.(pending.pointerId);
    }
  } catch {
    intentionallyReleasedPointerCaptures.delete(pending.pointerId);
  }
};

const startPointerDrag = (event, index) => {
  const pending = pointerDrag.value;
  if (!pending || pointerDragActive.value || pending.pointerId !== event.pointerId) return;
  const distance = Math.hypot(event.clientX - pending.startX, event.clientY - pending.startY);
  if (distance < DRAG_THRESHOLD) return;

  pointerDragActive.value = true;
  const sourceIndex = pending.index >= 0 ? pending.index : index;
  if (isSelected(flatItems.value[sourceIndex]) && selectedItems.value.length > 1) {
    dragIndices.value = flatItems.value
      .map((item, itemIndex) => isSelected(item) ? itemIndex : -1)
      .filter(itemIndex => itemIndex >= 0);
  } else {
    dragIndices.value = [sourceIndex];
  }
  dragOriginIndex.value = sourceIndex;
  activeDragItems.value = [...dragIndices.value].sort((a, b) => a - b).map(itemIndex => flatItems.value[itemIndex]);
  const rect = pending.source.getBoundingClientRect();
  dragItemWidth.value = rect.width;
  dragItemHeight.value = rect.height;
  const args = {
    Items: [...activeDragItems.value],
    OriginalSource: event.target ?? pending.source,
    Cancel: false
  };
  emit('DragItemsStarting', args);
  resolveXamlHandler(attrs.DragItemsStarting, instance)?.(args);
  if (args.Cancel) {
    pointerDragActive.value = false;
    pointerDrag.value = null;
    resetDrag();
    return;
  }
  pointerDragDetail = {
    owner: pointerDragOwner,
    source: instance,
    indices: [...dragIndices.value],
    items: [...activeDragItems.value],
    dragWidth: rect.width,
    dragHeight: rect.height,
    clientX: event.clientX,
    clientY: event.clientY,
    accepted: false,
    dropResult: 'None'
  };
  isDragging.value = true;
  isExternalDragOver.value = false;
  dragDropAccepted.value = true;
  insertSlotIndex.value = -1;
  dragOverIndex.value = -1;
  clearLiveReorder();
  createPointerPreview(pending.source, activeDragItems.value.length);
  nextTick(cacheNonDragRects);
  event.preventDefault();
};

const onItemPointerDown = (event, index) => {
  // Use the same pointer session for mouse, touch and pen. ListView uses this
  // path so a drag remains alive after the pointer leaves the original item.
  if (!isEnabled.value || !canStartPointerDrag.value || isGrouped.value
    || !event.isPrimary || event.button !== 0) return;
  const source = event.currentTarget;
  if (!source) return;
  const rect = source.getBoundingClientRect();
  pointerDrag.value = {
    pointerId: event.pointerId,
    index,
    startX: event.clientX,
    startY: event.clientY,
    grabX: event.clientX - rect.left,
    grabY: event.clientY - rect.top,
    source
  };
  try {
    source.setPointerCapture?.(event.pointerId);
  } catch {
    // The pointer may already have been cancelled by the browser.
  }
};

const onItemPointerMove = (event, index) => {
  const pending = pointerDrag.value;
  if (!pending || pending.pointerId !== event.pointerId || !canStartPointerDrag.value) return;
  startPointerDrag(event, index);
  if (!pointerDragActive.value) return;
  latestPointerPosition = { x: event.clientX, y: event.clientY };
  if (pointerPreviewElement) {
    pointerPreviewElement.style.transform = `translate3d(${event.clientX - pending.grabX}px, ${event.clientY - pending.grabY}px, 0)`;
  }
  updateEdgeAutoScroll(event.clientY);
  updatePointerDropTarget(event.clientX, event.clientY);
  event.preventDefault();
};

const updatePointerDropTarget = (clientX, clientY) => {
  if (!pointerDragDetail) return;
  pointerDragDetail.clientX = clientX;
  pointerDragDetail.clientY = clientY;
  const hit = document.elementFromPoint(clientX, clientY);
  const next = hit?.closest?.('.win-grid-view') ?? null;
  if (pointerDropTarget && pointerDropTarget !== next) {
    pointerDropTarget.dispatchEvent(new CustomEvent(pointerDragLeaveEvent, { detail: pointerDragDetail }));
    pointerDropTarget = null;
  }
  if (!next) return;
  pointerDragDetail.accepted = false;
  next.dispatchEvent(new CustomEvent(pointerDragOverEvent, { detail: pointerDragDetail }));
  pointerDropTarget = pointerDragDetail.accepted ? next : null;
};

const clearPointerGridVisual = () => {
  stopEdgeAutoScroll();
  insertSlotIndex.value = -1;
  dragOverIndex.value = -1;
  clearLiveReorder();
};

const onPointerGridDragOver = (event) => {
  const detail = event.detail;
  if (!detail || !isEnabled.value || isGrouped.value) return;
  const sameView = detail.source === instance;
  if (sameView && (!canReorderItems.value || !allowDrop.value)) {
    detail.accepted = false;
    clearPointerGridVisual();
    return;
  }
  if (!sameView && !allowDrop.value) {
    detail.accepted = false;
    clearPointerGridVisual();
    return;
  }
  isDragging.value = true;
  isExternalDragOver.value = !sameView;
  // Keep a target-local pointer position for ScrollViewer's scroll callback.
  // During a stationary edge drag no PointerMove is delivered to this view;
  // without this value recalculateGridDragTarget() returns early forever.
  latestPointerPosition = { x: detail.clientX, y: detail.clientY };
  if (!sameView) {
    activeDragItems.value = Array.isArray(detail.items) ? [...detail.items] : [];
    dragItemWidth.value = Math.max(1, Number(detail.dragWidth) || 44);
    dragItemHeight.value = Math.max(1, Number(detail.dragHeight) || 44);
  }

  const dragItems = Array.isArray(detail.items) ? [...detail.items] : [...activeDragItems.value];
  const dragOverArgs = {
    DataTransfer: null,
    AcceptedOperation: 'Move',
    OriginalSource: document.elementFromPoint(detail.clientX, detail.clientY),
    Items: dragItems
  };
  emit('DragOver', dragOverArgs);
  resolveXamlHandler(attrs.DragOver, instance)?.(dragOverArgs);
  if (dragOverArgs.AcceptedOperation === 'None') {
    detail.accepted = false;
    dragDropAccepted.value = false;
    if (isExternalDragOver.value) clearExternalDropVisual();
    else clearPointerGridVisual();
    return;
  }
  detail.accepted = true;

  if (!cachedRects.length) cacheNonDragRects();
  updateInsertSlot(
    { clientX: detail.clientX, clientY: detail.clientY },
    sameView ? detail.indices : [],
    sameView,
    sameView ? detail.indices : []
  );
  dragDropAccepted.value = true;
};

const onPointerGridDragLeave = (event) => {
  if (event?.detail) event.detail.accepted = false;
  if (!isDragging.value && !isExternalDragOver.value) return;
  clearPointerGridVisual();
  if (isExternalDragOver.value) clearExternalDropVisual();
};

const onPointerGridDrop = (event) => {
  const detail = event.detail;
  if (!detail || !detail.accepted || isGrouped.value) {
    if (detail) detail.accepted = false;
    if (isExternalDragOver.value) clearExternalDropVisual();
    else if (detail) clearPointerGridVisual();
    return;
  }
  const sameView = detail.source === instance;
  if ((sameView && (!canReorderItems.value || !allowDrop.value))
    || (!sameView && !allowDrop.value)) {
    detail.accepted = false;
    if (isExternalDragOver.value) clearExternalDropVisual();
    else clearPointerGridVisual();
    return;
  }
  if (sameView) flushLiveReorder();
  const draggedItems = Array.isArray(detail.items) ? [...detail.items] : [];
  if (!draggedItems.length || insertSlotIndex.value < 0) {
    detail.accepted = false;
    if (isExternalDragOver.value) clearExternalDropVisual();
    else clearPointerGridVisual();
    return;
  }
  const sourceIndices = sameView ? new Set(detail.indices ?? []) : new Set();
  const remaining = flatItems.value.filter((_, index) => !sourceIndices.has(index));
  const insertAt = sameView
    ? collectionInsertIndex(insertSlotIndex.value, [...sourceIndices])
    : Math.min(insertSlotIndex.value, remaining.length);
  const nextItems = [...remaining];
  nextItems.splice(insertAt, 0, ...draggedItems);
  internalItems.value = nextItems;
  pendingItemsSource = nextItems;
  emit('update:ItemsSource', nextItems);
  const dropArgs = {
    DataTransfer: null,
    AcceptedOperation: 'Move',
    InsertIndex: insertAt,
    Items: draggedItems,
    OriginalSource: document.elementFromPoint(detail.clientX, detail.clientY)
  };
  emit('Drop', dropArgs);
  resolveXamlHandler(attrs.Drop, instance)?.(dropArgs);
  emit('reorder', nextItems);
  detail.dropResult = 'Move';
  resetDrag();
};

const onItemPointerUp = (event) => {
  const pending = pointerDrag.value;
  if (!pending || pending.pointerId !== event.pointerId) return;
  if (pointerDragActive.value) {
    suppressClickUntil = Date.now() + 300;
    updatePointerDropTarget(event.clientX, event.clientY);
    const detail = pointerDragDetail;
    releasePointerCapture();
    if (pointerDropTarget && detail) {
      pointerDropTarget.dispatchEvent(new CustomEvent(pointerDropEvent, { detail }));
    } else {
      cancelDrag(event.target ?? event.currentTarget ?? null);
    }
    if (detail?.dropResult === 'Move' && detail.source === instance
      && pointerDropTarget && pointerDropTarget !== containerRef.value) {
      const sourceSet = new Set(detail.indices ?? []);
      const remaining = flatItems.value.filter((_, index) => !sourceSet.has(index));
      internalItems.value = remaining;
      pendingItemsSource = remaining;
      emit('update:ItemsSource', remaining);
    }
    if (detail && detail.dropResult === 'Move') {
      const completedArgs = {
        Items: [...(detail.items ?? [])],
        DropResult: 'Move',
        OriginalSource: event.target ?? event.currentTarget ?? null
      };
      emit('DragItemsCompleted', completedArgs);
      resolveXamlHandler(attrs.DragItemsCompleted, instance)?.(completedArgs);
    }
    pointerDropTarget = null;
    resetDrag();
    pointerDrag.value = null;
    pointerDragActive.value = false;
    event.preventDefault();
    return;
  }
  releasePointerCapture();
  pointerDrag.value = null;
};

const onItemPointerCancel = (event) => {
  const pending = pointerDrag.value;
  if (!pending || pending.pointerId !== event.pointerId) return;
  releasePointerCapture();
  if (pointerDragActive.value) cancelDrag(event.target ?? event.currentTarget ?? null);
  pointerDrag.value = null;
  pointerDragActive.value = false;
};

const onItemLostPointerCapture = (event) => {
  if (intentionallyReleasedPointerCaptures.delete(event.pointerId)) return;
  if (pointerDrag.value?.pointerId !== event.pointerId) return;
  // Document-level listeners keep an active drag alive while capture moves
  // between GridViews. PointerCancel/blur performs the actual cancellation.
  if (pointerDragActive.value) return;
  pointerDrag.value = null;
  pointerDragActive.value = false;
};

const onGlobalPointerMove = (event) => {
  if (pointerDrag.value?.pointerId === event.pointerId) onItemPointerMove(event, pointerDrag.value.index);
};
const onGlobalPointerUp = (event) => {
  if (pointerDrag.value?.pointerId === event.pointerId) onItemPointerUp(event);
};
const onGlobalPointerCancel = (event) => {
  if (pointerDrag.value?.pointerId === event.pointerId) onItemPointerCancel(event);
};

const onContainerDragEnter = (e) => {
  const payload = readGridDragPayload(e);
  const external = Boolean(payload && payload.source !== instance);
  const local = isDragging.value || Boolean(payload && payload.source === instance);
  const canAccept = external ? allowDrop.value : local
    ? canReorderItems.value && allowDrop.value
    : allowDrop.value;
  if (!canAccept) return;
  e.preventDefault();
  if (external) {
    isExternalDragOver.value = true;
    externalDragToken.value = payload.token;
    activeDragItems.value = [...payload.items];
    dragItemWidth.value = payload.width || dragItemWidth.value || 44;
    dragItemHeight.value = payload.height || dragItemHeight.value || 44;
    nextTick(cacheNonDragRects);
  }
  onContainerDragOver(e);
};

const onContainerDragOver = (e) => {
  const payload = readGridDragPayload(e);
  const external = Boolean(payload && payload.source !== instance);
  const local = isDragging.value || Boolean(payload && payload.source === instance);
  const canAccept = external ? allowDrop.value : local
    ? canReorderItems.value && allowDrop.value
    : allowDrop.value;
  if (!canAccept) return;
  e.preventDefault();
  latestPointerPosition = { x: e.clientX, y: e.clientY };
  updateEdgeAutoScroll(e.clientY);
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  if (external && !isExternalDragOver.value) {
    isExternalDragOver.value = true;
    externalDragToken.value = payload.token;
    activeDragItems.value = [...payload.items];
    dragItemWidth.value = payload.width || 44;
    dragItemHeight.value = payload.height || 44;
    nextTick(cacheNonDragRects);
  }
  const dragOverArgs = {
    DataTransfer: e.dataTransfer ?? null,
    AcceptedOperation: 'Move',
    OriginalSource: e.target ?? e.currentTarget,
    Items: external ? [...payload.items] : [...activeDragItems.value]
  };
  emit('DragOver', dragOverArgs);
  resolveXamlHandler(attrs.DragOver, instance)?.(dragOverArgs);
  dragDropAccepted.value = dragOverArgs.AcceptedOperation !== 'None';
  if (!dragDropAccepted.value) {
    if (external) clearExternalDropVisual();
    else clearPointerGridVisual();
    return;
  }
  if ((isDragging.value && canReorderItems.value && allowDrop.value) || external) updateInsertSlot(e);
};

const onItemDragEnter = (event, index) => {
  event.stopPropagation?.();
  onContainerDragEnter(event, index);
};

const onItemDragOver = (event, index) => {
  event.stopPropagation?.();
  onContainerDragOver(event, index);
};

const onContainerDragLeave = (e) => {
  if (!containerRef.value) return;
  const related = e.relatedTarget;
  if (related && containerRef.value.contains(related)) return;
  stopEdgeAutoScroll();
  dragDropAccepted.value = false;
  if (isExternalDragOver.value) clearExternalDropVisual();
  else clearPointerGridVisual();
};

const onContainerDrop = (e) => {
  const payload = readGridDragPayload(e);
  const external = Boolean(payload && payload.source !== instance);
  const canAccept = external ? allowDrop.value : isDragging.value
    ? canReorderItems.value && allowDrop.value
    : allowDrop.value;
  if (!canAccept) return;
  e.preventDefault();
  if (!dragDropAccepted.value && (isDragging.value || external)) {
    // A rejected external native drag is owned by another GridView; do not
    // raise DragItemsCompleted from this target view.
    if (external) clearExternalDropVisual();
    else cancelDrag(e.target ?? e.currentTarget);
    return;
  }
  if (external) {
    performExternalDrop(e, payload);
    return;
  }
  if (isDragging.value && canReorderItems.value && allowDrop.value) {
    flushLiveReorder();
    performReorder(e);
    return;
  }
  const dropArgs = {
    DataTransfer: e.dataTransfer ?? null,
    AcceptedOperation: 'Move',
    InsertIndex: flatItems.value.length,
    OriginalSource: e.target ?? e.currentTarget
  };
  emit('Drop', dropArgs);
  resolveXamlHandler(attrs.Drop, instance)?.(dropArgs);
};

const performReorder = (event = null) => {
  if (dragIndices.value.length === 0 || insertSlotIndex.value === -1) {
    cancelDrag(event?.target ?? event?.currentTarget ?? null);
    return;
  }

  const sortedIndices = [...dragIndices.value].sort((a, b) => a - b);
  const draggedItems = sortedIndices.map(i => flatItems.value[i]);
  const remaining = flatItems.value.filter((_, i) => !dragIndices.value.includes(i));

  // insertSlotIndex is an index in the original arranged sequence. Convert
  // it to the remaining collection before splicing, exactly as ListView does
  // for InsertBeforeIndex.
  const insertAt = collectionInsertIndex(insertSlotIndex.value, dragIndices.value);

  const newItems = [...remaining];
  newItems.splice(insertAt, 0, ...draggedItems);

  internalItems.value = newItems;
  pendingItemsSource = newItems;
  emit('update:ItemsSource', newItems);
  const dropArgs = {
    DataTransfer: event?.dataTransfer ?? null,
    AcceptedOperation: 'Move',
    InsertIndex: insertAt,
    Items: draggedItems,
    OriginalSource: event?.target ?? event?.currentTarget ?? null
  };
  emit('Drop', dropArgs);
  resolveXamlHandler(attrs.Drop, instance)?.(dropArgs);
  const completedArgs = {
    Items: draggedItems,
    DropResult: 'Move',
    OriginalSource: event?.target ?? event?.currentTarget ?? null
  };
  emit('DragItemsCompleted', completedArgs);
  resolveXamlHandler(attrs.DragItemsCompleted, instance)?.(completedArgs);
  emit('reorder', newItems);
  resetDrag();
};

const completeExternalSourceDrop = (token, originalSource = null) => {
  if (!isDragging.value || dragToken.value !== token) return;
  const draggedItems = [...activeDragItems.value];
  const draggedIndices = new Set(dragIndices.value);
  const remaining = flatItems.value.filter((_, index) => !draggedIndices.has(index));
  internalItems.value = remaining;
  pendingItemsSource = remaining;
  emit('update:ItemsSource', remaining);
  const completedArgs = {
    Items: draggedItems,
    DropResult: 'Move',
    OriginalSource: originalSource
  };
  emit('DragItemsCompleted', completedArgs);
  resolveXamlHandler(attrs.DragItemsCompleted, instance)?.(completedArgs);
  resetDrag();
};

const performExternalDrop = (event, payload) => {
  const draggedItems = Array.isArray(payload?.items) ? [...payload.items] : [];
  if (!draggedItems.length || insertSlotIndex.value < 0) {
    clearExternalDropVisual();
    return;
  }
  const insertAt = insertSlotIndex.value >= flatItems.value.length
    ? flatItems.value.length
    : Math.max(0, Math.min(flatItems.value.length, insertSlotIndex.value));
  const newItems = [...flatItems.value];
  newItems.splice(insertAt, 0, ...draggedItems);
  internalItems.value = newItems;
  pendingItemsSource = newItems;
  emit('update:ItemsSource', newItems);
  const dropArgs = {
    DataTransfer: event?.dataTransfer ?? null,
    AcceptedOperation: 'Move',
    InsertIndex: insertAt,
    Items: draggedItems,
    OriginalSource: event?.target ?? event?.currentTarget ?? null
  };
  emit('Drop', dropArgs);
  resolveXamlHandler(attrs.Drop, instance)?.(dropArgs);
  if (typeof payload.complete === 'function') payload.complete(event?.target ?? event?.currentTarget ?? null);
  emit('reorder', newItems);
  clearExternalDropVisual();
};

const resetDrag = () => {
  stopEdgeAutoScroll();
  clearLiveReorder();
  // A cross-container pointer session owns its routed target from the source
  // view. Leave that target before dropping the reference so its hover,
  // reorder-hint and scroll state cannot survive cancellation or unmount.
  const activeDropTarget = pointerDropTarget;
  const activeDragDetail = pointerDragDetail;
  pointerDropTarget = null;
  pointerDragDetail = null;
  if (activeDropTarget && activeDragDetail) {
    activeDropTarget.dispatchEvent(new CustomEvent(pointerDragLeaveEvent, {
      detail: activeDragDetail
    }));
  }
  const token = dragToken.value;
  if (token) gridDragRegistry.delete(token);
  removeDragImage();
  removePointerPreview();
  pointerDrag.value = null;
  pointerDragActive.value = false;
  intentionallyReleasedPointerCaptures.clear();
  isDragging.value = false;
  isExternalDragOver.value = false;
  dragIndices.value = [];
  dragOriginIndex.value = -1;
  insertSlotIndex.value = -1;
  dragOverIndex.value = -1;
  cachedRects = [];
  reorderOffsets.clear();
  activeDragItems.value = [];
  dragDropAccepted.value = false;
  dragToken.value = '';
  externalDragToken.value = '';
  dragItemWidth.value = 0;
  dragItemHeight.value = 0;
  latestPointerPosition = null;
  dragScrollViewport = null;
  edgeScrollViewport = null;
  dragLayoutScrollLeft = 0;
  dragLayoutScrollTop = 0;
};

const cancelDrag = (originalSource = null) => {
  if (!activeDragItems.value.length) {
    resetDrag();
    return;
  }
  const args = { Items: [...activeDragItems.value], DropResult: 'None', OriginalSource: originalSource };
  emit('DragItemsCompleted', args);
  resolveXamlHandler(attrs.DragItemsCompleted, instance)?.(args);
  resetDrag();
};

const onDragEnd = (event) => cancelDrag(event?.target ?? event?.currentTarget ?? null);

const onWindowDragEnd = (event) => {
  if (isDragging.value) onDragEnd(event);
  else if (isExternalDragOver.value) clearExternalDropVisual();
};

onMounted(() => {
  const root = containerRef.value;
  root?.addEventListener(pointerDragOverEvent, onPointerGridDragOver);
  root?.addEventListener(pointerDragLeaveEvent, onPointerGridDragLeave);
  root?.addEventListener(pointerDropEvent, onPointerGridDrop);
  dragScrollViewport = root?.querySelector?.('.win-scroll-viewer-viewport') ?? null;
  dragScrollViewport?.addEventListener?.('scroll', onDragViewportScroll, { passive: true });
  document.addEventListener('pointermove', onGlobalPointerMove);
  document.addEventListener('pointerup', onGlobalPointerUp);
  document.addEventListener('pointercancel', onGlobalPointerCancel);
  if (typeof window !== 'undefined') {
    window.addEventListener('blur', cancelDrag);
    window.addEventListener('dragend', onWindowDragEnd);
  }
});
onBeforeUnmount(() => {
  const root = containerRef.value;
  root?.removeEventListener(pointerDragOverEvent, onPointerGridDragOver);
  root?.removeEventListener(pointerDragLeaveEvent, onPointerGridDragLeave);
  root?.removeEventListener(pointerDropEvent, onPointerGridDrop);
  dragScrollViewport?.removeEventListener?.('scroll', onDragViewportScroll);
  document.removeEventListener('pointermove', onGlobalPointerMove);
  document.removeEventListener('pointerup', onGlobalPointerUp);
  document.removeEventListener('pointercancel', onGlobalPointerCancel);
  if (typeof window !== 'undefined') {
    window.removeEventListener('blur', cancelDrag);
    window.removeEventListener('dragend', onWindowDragEnd);
  }
  cancelDrag();
  clearExternalDropVisual();
});

defineExpose({ ScrollIntoGroup });
</script>

<style>
  /* GridView's template is Border -> ScrollViewer -> ItemsPresenter.  Keep
     the arranged surface separate from the item presenter so hover, focus,
     selection and drag animations never change the panel's measured slots. */
  .win-grid-view {
    display: block;
    width: 100%;
    /* GridView is content-sized unless the caller supplies Height. */
    height: auto;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    box-sizing: border-box;
    direction: v-bind(flowDirectionStyle);
    color: var(--GridViewItemForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
    font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', sans-serif);
    font-size: var(--ControlContentThemeFontSize, 14px);
    line-height: 20px;
    letter-spacing: 0;
  }

  .win-grid-border {
    display: block;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    box-sizing: border-box;
    overflow: hidden;
    background: var(--GridViewBackground, transparent);
    border: var(--GridViewBorderThickness, 0) solid var(--GridViewBorderBrush, transparent);
    border-radius: var(--GridViewCornerRadius, 0);
  }

  .win-grid-scroll-viewer {
    display: block;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
  }

  .win-grid-scroll-viewer > .win-scroll-viewer-viewport,
  .win-grid-scroll-viewer .win-scroll-viewer-viewport {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
  }

  .win-grid-view-content {
    display: block;
    width: 100%;
    min-width: 0;
    min-height: max-content;
    box-sizing: border-box;
    position: relative;
  }

  .win-grid-groups,
  .win-grid-group {
    display: block;
    width: 100%;
    min-width: 0;
  }

  .win-grid-group-header {
    position: sticky;
    top: 0;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    box-sizing: border-box;
    width: 100%;
    min-height: 44px;
    margin: 0 0 4px;
    padding: 8px 12px 0;
    background: var(--GridViewHeaderItemBackground, var(--SolidBackgroundFillColorBaseBrush, var(--ctrl-solid-fill, Canvas)));
    color: var(--GridViewHeaderItemForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
    font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', sans-serif);
    font-size: var(--GridViewHeaderItemThemeFontSize, 20px);
    font-weight: 400;
    line-height: 28px;
    letter-spacing: 0;
    text-align: start;
  }

  .win-grid-group-header-content {
    display: flex;
    align-items: flex-start;
    min-width: 0;
    min-height: 28px;
  }

  .win-grid-group-divider {
    display: block;
    flex: 0 0 .5px;
    width: auto;
    height: .5px;
    margin: 8px 12px 0;
    background: var(--GridViewHeaderItemDividerStroke, color-mix(in srgb, currentColor 20%, transparent));
  }

  .win-grid-group-items {
    padding-bottom: 4px;
  }

  .win-grid-view.disabled {
    pointer-events: none;
  }

  .win-grid-view-inner {
    display: flex;
    align-content: start;
    justify-content: start;
    position: relative;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  .win-grid-item {
    position: relative;
    display: block;
    width: var(--GridViewItemWidth, max-content);
    height: var(--GridViewItemHeight, auto);
    max-width: 100%;
    min-width: var(--GridViewItemMinWidth, 44px);
    min-height: var(--GridViewItemMinHeight, 44px);
    box-sizing: border-box;
    border: 0;
    border-radius: var(--GridViewItemCornerRadius, 4px);
    overflow: hidden;
    /* The native item owns the base Background rectangle; Overlay state
       chrome is painted above it without replacing this surface. */
    background: var(--GridViewItemBackground, var(--SystemControlTransparentBrush, transparent));
    cursor: default;
    outline: none;
    user-select: none;
    -webkit-user-drag: none;
    transition: transform .24s cubic-bezier(.1,.9,.2,1), opacity .24s cubic-bezier(.1,.9,.2,1);
  }

  .win-grid-item.clickEnabled { cursor: pointer; }
  .win-grid-item.can-drag { cursor: grab; -webkit-user-drag: none; }
  .win-grid-item.can-drag:active { cursor: grabbing; }

  .grid-item-presenter {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: inherit;
    box-sizing: border-box;
    border-radius: inherit;
    overflow: hidden;
    background: transparent;
    color: var(--GridViewItemForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
    transition: background-color 83ms linear, opacity 240ms cubic-bezier(.1,.9,.2,1), transform 240ms cubic-bezier(.1,.9,.2,1);
  }

  /* GridViewItemPresenter owns paint-only layers inside the arranged cell.
     Overlay chrome covers the complete GridViewItem bounds; the margin
     remains the item's inter-cell spacing rather than part of the state frame. */
  .grid-item-presenter::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    box-sizing: border-box;
    border-radius: inherit;
    /* Overlay GridViewItemPresenter paints its state as a hollow frame.  The
       item/container background remains visible below the content instead of
       being filled by a second state surface. */
    background: transparent;
    pointer-events: none;
    transition: opacity 83ms linear;
  }

  /* The native outer border is appended above the content.  Keeping it in a
     separate pseudo-element means an edge-to-edge image cannot hide the
     selected frame, while the border remains outside layout measurement. */
  .grid-item-presenter::after {
    content: '';
    position: absolute;
    /* Keep the selection frame on the original item bounds. The content
       surface, rather than this frame, owns the one-pixel inner crop. */
    inset: 0;
    z-index: 2;
    box-sizing: border-box;
    /* The default GridView uses the Overlay check mode.  Keep a constant
       paint-only 2px frame so state changes never alter the arranged cell. */
    border: 2px solid transparent;
    border-radius: inherit;
    pointer-events: none;
    transition: none;
  }

  .grid-item-presenter > * {
    position: relative;
    z-index: 1;
  }

  /* The selected item's content surface is inset inside the unchanged
     arranged slot. Keep the presenter and its selection chrome at the native
     bounds; only the item surface is cropped by 4px. */
  .win-grid-item.selected .grid-item-inner {
    clip-path: inset(3px round var(--GridViewItemCornerRadius, 2px));
  }

  .win-grid-item:hover .grid-item-presenter {
    color: var(--GridViewItemForegroundPointerOver, var(--TextFillColorSecondaryBrush, var(--text-secondary)));
  }

  /* Overlay chrome uses the theme background as a full paint surface. */
  .win-grid-item:hover .grid-item-presenter::before {
    background: var(--GridViewItemBackgroundPointerOver, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary)));
  }

  .win-grid-item:active .grid-item-presenter {
    color: var(--GridViewItemForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  }

  .win-grid-item:active .grid-item-presenter::before {
    background: var(--GridViewItemBackgroundPressed, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary)));
  }

  .win-grid-item:focus-visible {
    outline: 2px solid var(--GridViewItemFocusBorderBrush, var(--FocusStrokeColorOuterBrush, var(--accent-base)));
    outline-offset: -2px;
  }

  .win-grid-item.selected .grid-item-presenter {
    color: var(--GridViewItemForegroundSelected, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  }

  .win-grid-item.selected .grid-item-presenter::before {
    background: var(--GridViewItemBackgroundSelected, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary)));
  }

  .win-grid-item.selected .grid-item-presenter::after {
    border-color: var(--GridViewItemBackgroundSelected, var(--AccentFillColorDefaultBrush, var(--accent-base)));
    opacity: 1;
  }

  .win-grid-item.selected:hover .grid-item-presenter {
    color: var(--GridViewItemForegroundSelected, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  }

  .win-grid-item.selected:hover .grid-item-presenter::before {
    background: var(--GridViewItemBackgroundSelectedPointerOver, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary)));
  }

  .win-grid-item.selected:active .grid-item-presenter {
    color: var(--GridViewItemForegroundSelected, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  }

  .win-grid-item.selected:active .grid-item-presenter::before {
    background: var(--GridViewItemBackgroundSelectedPressed, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary)));
  }

  /* Keep one stable selection frame across hover and pressed states. */

  /* Keep the state background aligned with the unchanged presenter bounds;
     the content surface above owns the 2px inner crop. */
  .win-grid-item.selected .grid-item-presenter::before {
    clip-path: none;
  }

  .win-grid-view.disabled .grid-item-presenter,
  .win-grid-item[aria-disabled='true'] .grid-item-presenter {
    opacity: var(--ListViewItemDisabledThemeOpacity, .3);
    color: var(--TextFillColorDisabledBrush, var(--text-secondary));
  }

  /* Keep the source cell in the ItemsWrapGrid so its measured slot does not
     collapse while it is being dragged, but remove the source paint. Reorder
     offsets move neighbouring cells into this now-empty slot without stacking
     over the live source visual. */
  .win-grid-item.dragging-source {
    /* Match ListView's arranged placeholder: hide the complete source paint
       immediately while retaining this element's measured grid slot. */
    visibility: hidden;
    pointer-events: none;
    opacity: 0;
    cursor: grabbing;
  }

  .win-grid-item.dragging-source .grid-item-presenter {
    transform: none;
    opacity: 1;
  }

  .win-grid-item.dragging-source .grid-item-presenter::before {
    background: transparent;
  }

  .win-grid-item.dragging-source .grid-item-presenter::after {
    inset: 0;
    border-width: 0;
    border-color: transparent;
  }

  .win-grid-item.dragging-source .grid-item-inner,
  .win-grid-item.dragging-source .grid-checkbox,
  .win-grid-item.dragging-source .drag-count-badge {
    visibility: hidden;
  }

  .win-grid-item.drag-shrink .grid-item-presenter {
    transform: none;
    opacity: var(--ListViewItemReorderThemeOpacity, .8);
  }

  /* GridViewItemPresenter's ReorderingTarget state scales the visual surface,
     while the arranged cell and its insertion slot retain their dimensions. */
  .win-grid-item.reorder-target .grid-item-presenter {
    transform: translate3d(var(--grid-reorder-hint-x, 0px), var(--grid-reorder-hint-y, 0px), 0)
      scale(var(--ListViewItemReorderTargetThemeScale, .95));
    opacity: var(--ListViewItemReorderTargetThemeOpacity, .5);
    transform-origin: center center;
  }

  .win-grid-item.reorder-target::after {
    content: '';
    position: absolute;
    inset-inline-start: 2px;
    top: 4px;
    bottom: 4px;
    z-index: 3;
    width: 3px;
    border-radius: 2px;
    background: var(--AccentFillColorDefaultBrush, var(--accent-base));
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--AccentFillColorDefaultBrush, var(--accent-base)) 24%, transparent);
    pointer-events: none;
    animation: grid-drop-target-pulse 900ms ease-in-out infinite;
  }

  .win-grid-view[dir='rtl'] .win-grid-item.reorder-target::after {
    inset-inline-start: auto;
    inset-inline-end: 2px;
  }

  .grid-item-inner {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-width: 0;
    min-height: 100%;
    box-sizing: border-box;
  }

  .grid-item-inner > * {
    max-width: 100%;
    min-width: 0;
  }

  .win-checkbox.grid-checkbox {
    position: absolute;
    top: 2px;
    right: 2px;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    min-width: 20px;
    height: 20px;
    min-height: 20px;
    margin: 0;
    padding: 0;
    gap: 0;
    align-self: auto;
    box-sizing: border-box;
    pointer-events: auto;
    visibility: visible;
    opacity: 1;
    --CheckBoxCheckBackgroundFill: var(--GridViewItemCheckBoxBrush, var(--ControlOnImageFillColorDefaultBrush, var(--ctrl-fill-secondary)));
    --CheckBoxCheckBackgroundStroke: var(--GridViewItemCheckBoxBorderBrush, var(--ControlStrongStrokeColorDefaultBrush, var(--ctrl-strong-stroke)));
    --CheckBoxCheckGlyphForeground: var(--GridViewItemCheckBrush, var(--TextOnAccentFillColorPrimaryBrush, #fff));
  }

  /* CheckBox.vue owns the common state rules. These more-specific selectors
     map GridViewItemPresenter's official resources onto the reused control,
     keeping the selection box painted over image/data templates. */
  .win-checkbox.grid-checkbox.is-unchecked {
    --CheckBoxCheckBackgroundFill: var(--GridViewItemCheckBoxBrush, var(--ControlOnImageFillColorDefaultBrush, var(--ctrl-fill-secondary)));
    --CheckBoxCheckBackgroundStroke: var(--GridViewItemCheckBoxBorderBrush, var(--ControlStrongStrokeColorDefaultBrush, var(--ctrl-strong-stroke)));
    --CheckBoxCheckGlyphForeground: var(--GridViewItemCheckBrush, var(--TextOnAccentFillColorPrimaryBrush, #fff));
  }

  .win-checkbox.grid-checkbox.is-unchecked:hover {
    --CheckBoxCheckBackgroundFill: var(--GridViewItemCheckBoxPointerOverBrush, var(--ControlOnImageFillColorSecondaryBrush, var(--ctrl-fill-secondary)));
    --CheckBoxCheckBackgroundStroke: var(--GridViewItemCheckBoxPointerOverBorderBrush, var(--ControlStrongStrokeColorDefaultBrush, var(--ctrl-strong-stroke)));
  }

  .win-checkbox.grid-checkbox.is-unchecked:active {
    --CheckBoxCheckBackgroundFill: var(--GridViewItemCheckBoxPressedBrush, var(--ControlOnImageFillColorTertiaryBrush, var(--ctrl-fill-tertiary)));
    --CheckBoxCheckBackgroundStroke: var(--GridViewItemCheckBoxPressedBorderBrush, var(--ControlStrongStrokeColorDisabledBrush, var(--ctrl-strong-stroke-disabled)));
  }

  .win-checkbox.grid-checkbox.is-checked,
  .win-checkbox.grid-checkbox.is-indeterminate {
    --CheckBoxCheckBackgroundFill: var(--GridViewItemCheckBoxSelectedBrush, var(--AccentFillColorDefaultBrush, var(--accent-base)));
    --CheckBoxCheckBackgroundStroke: var(--GridViewItemCheckBoxSelectedBrush, var(--AccentFillColorDefaultBrush, var(--accent-base)));
    --CheckBoxCheckGlyphForeground: var(--GridViewItemCheckBrush, var(--TextOnAccentFillColorPrimaryBrush, #fff));
  }

  .win-checkbox.grid-checkbox.is-checked:hover,
  .win-checkbox.grid-checkbox.is-indeterminate:hover {
    --CheckBoxCheckBackgroundFill: var(--GridViewItemCheckBoxSelectedPointerOverBrush, var(--AccentFillColorSecondaryBrush, var(--accent-hover)));
    --CheckBoxCheckBackgroundStroke: var(--GridViewItemCheckBoxSelectedPointerOverBrush, var(--AccentFillColorSecondaryBrush, var(--accent-hover)));
  }

  .win-checkbox.grid-checkbox.is-checked:active,
  .win-checkbox.grid-checkbox.is-indeterminate:active {
    --CheckBoxCheckBackgroundFill: var(--GridViewItemCheckBoxSelectedPressedBrush, var(--AccentFillColorTertiaryBrush, var(--accent-pressed)));
    --CheckBoxCheckBackgroundStroke: var(--GridViewItemCheckBoxSelectedPressedBrush, var(--AccentFillColorTertiaryBrush, var(--accent-pressed)));
    --CheckBoxCheckGlyphForeground: var(--GridViewItemCheckPressedBrush, var(--TextOnAccentFillColorSecondaryBrush, #fff));
  }

  .win-checkbox.grid-checkbox .checkbox-box {
    visibility: visible;
    opacity: 1;
  }

  .win-checkbox.grid-checkbox .checkbox-content {
    display: none;
  }

  .win-checkbox.grid-checkbox .checkbox-box {
    width: 20px;
    min-width: 20px;
    height: 20px;
    margin: 0;
    border-radius: var(--GridViewItemCheckBoxCornerRadius, 3px);
  }

  .win-grid-drop-placeholder {
    display: block;
    flex: 0 0 auto;
    min-width: 44px;
    min-height: 44px;
    box-sizing: border-box;
    border: 2px dashed var(--AccentFillColorDefaultBrush, var(--accent-base));
    border-radius: var(--GridViewItemCornerRadius, 4px);
    background: var(--GridViewItemBackgroundSelected, transparent);
    opacity: .55;
    animation: grid-drop-placeholder-pulse 900ms ease-in-out infinite;
    transition: width 180ms cubic-bezier(.1,.9,.2,1), height 180ms cubic-bezier(.1,.9,.2,1), opacity 120ms linear;
  }

  .win-grid-drag-image {
    z-index: 2147483647;
    overflow: hidden;
    box-sizing: border-box;
    border-radius: var(--GridViewItemCornerRadius, 4px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, .24);
    opacity: .9;
  }

  .win-grid-pointer-drag-preview {
    z-index: 2147483647;
    overflow: hidden;
    box-sizing: border-box;
    border-radius: var(--GridViewItemCornerRadius, 4px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, .24);
    opacity: .9;
    will-change: transform;
  }

  @keyframes grid-drop-placeholder-pulse {
    0%, 100% { opacity: .42; }
    50% { opacity: .82; }
  }

  @keyframes grid-drop-target-pulse {
    0%, 100% { opacity: .68; }
    50% { opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    .win-grid-item,
    .win-grid-item .grid-item-presenter,
    .win-grid-drop-placeholder,
    .win-grid-item.reorder-target::after,
    .win-grid-item.reorder-target .grid-item-presenter::after {
      transition-duration: 0ms;
      animation: none;
    }
  }

  .drag-count-badge {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: var(--AccentFillColorDefaultBrush, var(--accent-base));
    color: var(--TextOnAccentFillColorPrimaryBrush, #fff);
    font-size: 13px;
    font-weight: 600;
    pointer-events: none;
  }

  @media (max-width: 739px) {
    .win-grid-view { max-width: 100%; }
    .win-grid-view-inner { overflow: hidden; }
  }
</style>
