<template>
  <div
    ref="containerRef"
    class="win-list-view"
    :class="{ disabled: !resolvedIsEnabled }"
    :style="rootStyle"
    role="listbox"
    :aria-disabled="!resolvedIsEnabled"
    :aria-multiselectable="selectionMode === 'Multiple' || selectionMode === 'Extended'">
    <ScrollViewer
      class="win-list-viewport"
      :class="{ 'items-bottom-host': itemsPanelBottom }"
      VerticalScrollMode="Auto"
      VerticalScrollBarVisibility="Auto"
      HorizontalScrollMode="Disabled"
      HorizontalScrollBarVisibility="Disabled">
      <div ref="listRef"
           :class="{ 'items-bottom': itemsPanelBottom, 'drag-sinking': isDragging || isExternalDragOver }"
           class="win-list-content"
           @dragover="onViewportDragOver"
           @drop="onViewportDrop"
           @dragleave="onViewportDragLeave">
        <template v-if="isGrouped">
          <div v-for="(group, gIdx) in items" :key="getGroupKey(group, gIdx)" class="win-list-group">
            <div class="win-list-header" :class="{ sticky: stickyHeader }">
              <div class="win-list-header-content">
                <component :is="groupHeaderComponent(group)" />
              </div>
              <div class="win-list-header-divider" aria-hidden="true"></div>
            </div>
            <div v-for="(item, idx) in getGroupItems(group)" :key="getItemKey(item, idx)"
                 class="win-list-item"
                 :class="itemClasses(item)"
                 :style="itemContainerStyle"
                 :draggable="false"
                 :tabindex="resolvedIsEnabled && selectionMode !== 'None' ? 0 : -1"
                 :aria-selected="selectionMode === 'None' ? undefined : isSelected(item)"
                 @click="onItemClick($event, item)"
                 @pointerdown="onItemPointerDown($event, item)"
                 @pointermove="onItemPointerMove($event, idx)"
                 @pointerup="onItemPointerUp($event)"
                 @pointercancel="onItemPointerCancel($event)"
                 @pointerleave="onItemPointerLeave($event, item)"
                 @lostpointercapture="onItemLostPointerCapture($event)"
                 @keydown.enter.prevent="onItemClick($event, item)"
                 @keydown.space.prevent="onItemClick($event, item)"
                 @dragstart.prevent>
              <div class="win-list-item-visual">
                <CheckBox
                  class="list-selection-check"
                  :class="{ 'is-visible': selectionMode === 'Multiple' }"
                  :IsChecked="isSelected(item)"
                  :IsEnabled="false"
                  aria-hidden="true" />
                <div class="win-list-item-content" :style="itemContentStyle">
                  <component :is="itemComponent(item, idx, group)" />
                </div>
                <div
                  v-if="selectionMode !== 'None' && selectionMode !== 'Multiple'"
                  class="win-list-view-selection-indicator"
                  :class="{ active: isSelected(item) }"
                  :style="selectionIndicatorStyle()"
                  aria-hidden="true"></div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-if="hasHeaderSlot || propertyTemplateNodes.groupHeaderTemplate.length" class="win-list-header" :class="{ sticky: stickyHeader }">
            <div class="win-list-header-content">
              <component :is="groupHeaderComponent(null)" />
            </div>
            <div class="win-list-header-divider" aria-hidden="true"></div>
          </div>
          <div v-for="(item, idx) in internalItems" :key="getItemKey(item, idx)"
               class="win-list-item"
               :class="itemClasses(item, idx)"
               :style="[itemContainerStyle, getItemStyle(idx)]"
               :draggable="false"
               :tabindex="resolvedIsEnabled && selectionMode !== 'None' ? 0 : -1"
               :aria-selected="selectionMode === 'None' ? undefined : isSelected(item)"
               @click="onItemClick($event, item)"
               @pointerdown="onItemPointerDown($event, item)"
               @pointermove="onItemPointerMove($event, idx)"
               @pointerup="onItemPointerUp($event)"
               @pointercancel="onItemPointerCancel($event)"
               @pointerleave="onItemPointerLeave($event, item)"
               @lostpointercapture="onItemLostPointerCapture($event)"
               @keydown.enter.prevent="onItemClick($event, item)"
               @keydown.space.prevent="onItemClick($event, item)"
               @dragstart.prevent>
              <div class="win-list-item-visual">
                <CheckBox
                  class="list-selection-check"
                  :class="{ 'is-visible': selectionMode === 'Multiple' }"
                  :IsChecked="isSelected(item)"
                  :IsEnabled="false"
                  aria-hidden="true" />
                <div class="win-list-item-content" :style="itemContentStyle">
                  <component :is="itemComponent(item, idx)" />
                </div>
                <div
                  v-if="selectionMode !== 'None' && selectionMode !== 'Multiple'"
                  class="win-list-view-selection-indicator"
                  :class="{ active: isSelected(item) }"
                  :style="selectionIndicatorStyle()"
                  aria-hidden="true"></div>
              </div>
          </div>
        </template>
      </div>
    </ScrollViewer>
  </div>
</template>

<script lang="ts">
import { CollectionGroupHeaderTemplate, CollectionGroupStyle, CollectionItemContainerStyle, CollectionItemTemplate, CollectionItemsPanel } from './CollectionProperties'

export default {
  GroupHeaderTemplate: CollectionGroupHeaderTemplate,
  GroupStyle: CollectionGroupStyle,
  ItemTemplate: CollectionItemTemplate,
  ItemsPanel: CollectionItemsPanel,
  ItemContainerStyle: CollectionItemContainerStyle
}
</script>

<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, toRaw, useAttrs, useSlots, watch } from 'vue';
import type { CSSProperties } from 'vue';
import ScrollViewer from './ScrollViewer.vue';
import CheckBox from './CheckBox.vue';
import { getCollectionProperty, getVNodeChildren } from './CollectionProperties';
import { materializeXamlVNode, resolveXamlHandler, resolveXamlValue, xamlItemContextKey } from './xamlRuntime';

defineSlots<{
  item(props: { item: any; index: number; group?: any }): any;
  header(props: { group: any }): any;
}>();

const slots = useSlots();
const attrs = useAttrs();
const hasHeaderSlot = computed(() => Boolean(slots.header));
const instance = getCurrentInstance();
const slotNodes = shallowRef(slots.default?.() ?? []);
const propertyTemplateNodes = computed(() => {
  const result: { itemTemplate: any[]; groupHeaderTemplate: any[]; itemContainerStyle: any[]; itemsPanel: any[] } = { itemTemplate: [], groupHeaderTemplate: [], itemContainerStyle: [], itemsPanel: [] };
  const visit = (nodes: any[]) => {
    for (const node of nodes) {
      if (!node) continue
      const property = getCollectionProperty(node);
      const typeName = typeof node.type === 'string'
        ? node.type
        : String((node.type as { name?: string; __name?: string } | undefined)?.name
          ?? (node.type as { __name?: string } | undefined)?.__name
          ?? '');
      if (property === 'itemTemplate' || property === 'groupHeaderTemplate' || property === 'itemContainerStyle') result[property] = getVNodeChildren(node);
      if (property === 'itemsPanel') result.itemsPanel = getVNodeChildren(node);
      if (property === 'groupStyle' || /(?:^|\.)GroupStyle$/i.test(typeName)) visit(getVNodeChildren(node));
      if (property === 'groupStyleHeaderTemplate') result.groupHeaderTemplate = getVNodeChildren(node);
    }
  };
  visit(slotNodes.value);
  return result;
});
const itemsPanelProperty = (propertyName: string) => {
  const visit = (nodes: any[]): unknown => {
    for (const node of nodes) {
      if (node?.props?.[propertyName] !== undefined) return node.props[propertyName];
      const nested = visit(getVNodeChildren(node));
      if (nested !== undefined) return nested;
    }
    return undefined;
  };
  return visit(propertyTemplateNodes.value.itemsPanel);
};
const itemsPanelBottom = computed(() => (
  String(resolveXamlValue(itemsPanelProperty('VerticalAlignment'), instance) ?? '').toLowerCase() === 'bottom'
));
const keepsLastItemInView = computed(() => (
  String(resolveXamlValue(itemsPanelProperty('ItemsUpdatingScrollMode'), instance) ?? '').toLowerCase() === 'keeplastiteminview'
));
const itemComponentCache = new Map<any, any>();
const itemComponent = (item: any, index: number, group: any = undefined) => {
  const key = item && typeof item === 'object' ? item : `primitive:${group?.Key ?? ''}:${index}:${String(item ?? '')}`;
  const cached = itemComponentCache.get(key);
  if (cached) return cached;
  const component = defineComponent({
  name: 'ListViewItemTemplate',
  setup() {
    provide(xamlItemContextKey, item);
    return () => {
      if (propertyTemplateNodes.value.itemTemplate.length) return h(Fragment, materializeXamlVNode(propertyTemplateNodes.value.itemTemplate, item, instance));
      const slot = slots.item;
      return slot ? h(Fragment, slot({ item, index, group })) : h('span', String(item ?? ''));
    };
  }
  });
  itemComponentCache.set(key, component);
  return component;
};
const xamlItemContainerStyle = computed<CSSProperties>(() => {
  const styleNode = propertyTemplateNodes.value.itemContainerStyle[0];
  const result: CSSProperties = {};
  if (!styleNode) return result;
  for (const setter of getVNodeChildren(styleNode)) {
    const propertyName = setter?.props?.Property;
    if (!propertyName) continue;
    const value = resolveXamlValue(setter?.props?.Value, instance);
    if (value === undefined || value === null) continue;
    if (propertyName === 'Margin') result.margin = xamlThickness(value);
    else if (propertyName === 'Padding') result.padding = xamlThickness(value);
    else if (propertyName === 'Height') result.height = cssLength(value);
    else if (propertyName === 'MinHeight') result.minHeight = cssLength(value);
    else if (propertyName === 'Width') result.width = cssLength(value);
    else if (propertyName === 'MinWidth') result.minWidth = cssLength(value);
    else if (propertyName === 'Background') result.background = String(value);
    else if (propertyName === 'BorderBrush') result.borderColor = String(value);
    else if (propertyName === 'BorderThickness') { result.borderWidth = xamlThickness(value); result.borderStyle = 'solid'; }
    else if (propertyName === 'CornerRadius') result.borderRadius = cssLength(value);
    else if (propertyName === 'HorizontalContentAlignment') result.justifyContent = alignment(String(value)) as CSSProperties['justifyContent'];
    else if (propertyName === 'VerticalContentAlignment') result.alignItems = alignment(String(value)) as CSSProperties['alignItems'];
  }
  return result;
});
const groupHeaderCache = new Map<any, any>();
const groupHeaderComponent = (group) => {
  const key = group ?? '__root__';
  const cached = groupHeaderCache.get(key);
  if (cached) return cached;
  const component = defineComponent({
  name: 'ListViewGroupHeaderTemplate',
  setup() {
    return () => {
      if (propertyTemplateNodes.value.groupHeaderTemplate.length) return h(Fragment, materializeXamlVNode(propertyTemplateNodes.value.groupHeaderTemplate, group, instance));
      const slot = slots.header;
      return slot ? h(Fragment, slot({ group })) : h('span', getGroupTitle(group));
    };
  }
  });
  groupHeaderCache.set(key, component);
  return component;
};

type ListViewSelectionMode = 'None' | 'Single' | 'Multiple' | 'Extended';
type ListViewItemStyle = {
  Width?: string | number;
  MinWidth?: string | number;
  Height?: string | number;
  MinHeight?: string | number;
  Margin?: string | number;
  Padding?: string | number;
  BorderBrush?: string;
  BorderThickness?: string | number;
  CornerRadius?: string | number;
  HorizontalContentAlignment?: 'Left' | 'Center' | 'Right' | 'Stretch';
  VerticalContentAlignment?: 'Top' | 'Center' | 'Bottom' | 'Stretch';
};

const props = withDefaults(defineProps<{
  ItemsSource?: unknown[] | string;
  IsGrouped?: boolean | string;
  IsItemClickEnabled?: boolean | string;
  CanDrag?: boolean | string;
  CanDragItems?: boolean | string;
  CanReorderItems?: boolean | string;
  AllowDrop?: boolean | string;
  AreStickyGroupHeadersEnabled?: boolean | string;
  SelectionMode?: ListViewSelectionMode | string;
  SelectedItems?: unknown[] | string;
  SelectedItem?: unknown | string;
  SelectedIndex?: number | string;
  ItemContainerStyle?: ListViewItemStyle;
  IsEnabled?: boolean | string;
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
  IsItemClickEnabled: false,
  CanDrag: false,
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
  'itemClick',
  'selectionChanged',
  'dragItemsStarting',
  'dragItemsCompleted',
  'dragOver',
  'drop',
  'update:SelectedItems',
  'update:SelectedItem',
  'update:SelectedIndex',
  'update:ItemsSource'
]);

const items = computed(() => {
  const source = resolveXamlValue(props.ItemsSource, instance);
  return Array.isArray(source) ? source : [];
});
const isGrouped = computed(() => {
  const configured = resolveXamlValue(props.IsGrouped, instance);
  const hasGroupItems = items.value.length > 0
    && items.value.every(group => Array.isArray((group as { Items?: unknown[] })?.Items));
  if (configured === true) return true;
  // Vue's Boolean prop casting turns an omitted IsGrouped attribute into
  // false. Treat a collection-shaped source as grouped in that case; an
  // explicit XAML string value of False still opts out of auto-detection.
  if (configured === false && typeof props.IsGrouped === 'string') return false;
  return hasGroupItems;
});
const isItemClickEnabled = computed(() => resolveXamlValue(props.IsItemClickEnabled, instance) === true);
const canDragItems = computed(() => (
  (resolveXamlValue(props.CanDragItems, instance) === true
    || resolveXamlValue(props.CanDrag, instance) === true)
  && resolvedIsEnabled.value
));
const canReorderItems = computed(() => resolveXamlValue(props.CanReorderItems, instance) === true);
const allowDrop = computed(() => resolveXamlValue(props.AllowDrop, instance) === true);
const stickyHeader = computed(() => {
  const panelValue = itemsPanelProperty('AreStickyGroupHeadersEnabled');
  return resolveXamlValue(panelValue === undefined ? props.AreStickyGroupHeadersEnabled : panelValue, instance) === true;
});
const selectionMode = computed(() => resolveXamlValue(props.SelectionMode, instance) ?? 'Single');
const resolvedIsEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance) !== false);
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
const selectedItems = computed(() => (
  selectionMode.value === 'None' ? [] : configuredSelectedItems.value
));

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
  width: cssLength(resolveXamlValue(props.Width, instance) as string | number) || undefined,
  height: cssLength(resolveXamlValue(props.Height, instance) as string | number) || undefined,
  minWidth: cssLength(resolveXamlValue(props.MinWidth, instance) as string | number) || undefined,
  minHeight: cssLength(resolveXamlValue(props.MinHeight, instance) as string | number) || undefined,
  maxWidth: cssLength(resolveXamlValue(props.MaxWidth, instance) as string | number) || undefined,
  maxHeight: cssLength(resolveXamlValue(props.MaxHeight, instance) as string | number) || undefined,
  margin: xamlThickness(resolveXamlValue(props.Margin, instance) as string | number) || undefined,
  padding: xamlThickness(resolveXamlValue(props.Padding, instance) as string | number) || undefined,
  background: resolveXamlValue(props.Background, instance) || undefined,
  borderColor: resolveXamlValue(props.BorderBrush, instance) || undefined,
  borderWidth: xamlThickness(props.BorderThickness) || undefined,
  borderStyle: resolveXamlValue(props.BorderThickness, instance) !== '' && resolveXamlValue(props.BorderThickness, instance) !== 0 ? 'solid' : undefined,
  borderRadius: cssLength(resolveXamlValue(props.CornerRadius, instance) as string | number) || undefined
}));

const propItemContainerStyle = computed<CSSProperties>(() => ({
  height: cssLength(props.ItemContainerStyle.Height) || undefined,
  minHeight: cssLength(props.ItemContainerStyle.MinHeight) || undefined,
  margin: xamlThickness(props.ItemContainerStyle.Margin) || undefined,
  width: cssLength(props.ItemContainerStyle.Width) || undefined,
  minWidth: cssLength(props.ItemContainerStyle.MinWidth) || undefined,
  borderColor: props.ItemContainerStyle.BorderBrush || undefined,
  borderWidth: xamlThickness(props.ItemContainerStyle.BorderThickness) || undefined,
  borderStyle: props.ItemContainerStyle.BorderThickness !== undefined
    && props.ItemContainerStyle.BorderThickness !== 0 ? 'solid' : undefined,
  borderRadius: cssLength(props.ItemContainerStyle.CornerRadius) || undefined
}));
const itemContainerStyle = computed<CSSProperties>(() => ({
  ...propItemContainerStyle.value,
  margin: propItemContainerStyle.value.margin ?? xamlItemContainerStyle.value.margin,
  width: propItemContainerStyle.value.width ?? xamlItemContainerStyle.value.width,
  minWidth: propItemContainerStyle.value.minWidth ?? xamlItemContainerStyle.value.minWidth,
  height: propItemContainerStyle.value.height ?? xamlItemContainerStyle.value.height,
  minHeight: propItemContainerStyle.value.minHeight ?? xamlItemContainerStyle.value.minHeight,
  background: xamlItemContainerStyle.value.background,
  borderColor: propItemContainerStyle.value.borderColor ?? xamlItemContainerStyle.value.borderColor,
  borderWidth: propItemContainerStyle.value.borderWidth ?? xamlItemContainerStyle.value.borderWidth,
  borderStyle: propItemContainerStyle.value.borderStyle ?? xamlItemContainerStyle.value.borderStyle,
  borderRadius: propItemContainerStyle.value.borderRadius ?? xamlItemContainerStyle.value.borderRadius
}));
const styleAlignment = (value: unknown, fallback: 'Left' | 'Center' | 'Right' | 'Stretch') => {
  const normalized = String(value ?? '').trim();
  return (normalized === 'Left' || normalized === 'Center' || normalized === 'Right' || normalized === 'Stretch')
    ? normalized
    : fallback;
};
const contentAlignment = computed(() => styleAlignment(
  xamlItemContainerStyle.value.justifyContent
    ? (xamlItemContainerStyle.value.justifyContent === 'flex-start' ? 'Left'
      : xamlItemContainerStyle.value.justifyContent === 'flex-end' ? 'Right'
        : xamlItemContainerStyle.value.justifyContent === 'center' ? 'Center' : 'Stretch')
    : props.ItemContainerStyle.HorizontalContentAlignment,
  'Stretch'
));
const verticalContentAlignment = computed(() => styleAlignment(
  xamlItemContainerStyle.value.alignItems
    ? (xamlItemContainerStyle.value.alignItems === 'flex-start' ? 'Top'
      : xamlItemContainerStyle.value.alignItems === 'flex-end' ? 'Bottom'
        : xamlItemContainerStyle.value.alignItems === 'center' ? 'Center' : 'Stretch')
    : props.ItemContainerStyle.VerticalContentAlignment,
  'Center'
));

// ListViewItemPresenter applies its ContentMargin to the content presenter,
// while its visual chrome is inset by Margin="4,2,4,2". Keep those two
// responsibilities separate so selection and hover states never remeasure an
// item and the messaging template gets the same usable width as WinUI.
const itemContentStyle = computed<CSSProperties>(() => ({
  margin: '2px 4px',
  // Leave the default padding to CSS so the Multiple-selection rule can
  // reserve the checkbox lane without an inline declaration winning over it.
  padding: xamlThickness(xamlItemContainerStyle.value.padding ?? props.ItemContainerStyle.Padding) || undefined,
  justifyContent: contentAlignment.value === 'Right'
    ? 'flex-end'
    : contentAlignment.value === 'Center' ? 'center' : 'flex-start',
  alignItems: verticalContentAlignment.value === 'Top'
    ? 'flex-start'
    : verticalContentAlignment.value === 'Bottom' ? 'flex-end'
      : verticalContentAlignment.value === 'Stretch' ? 'stretch' : 'center'
}));

// The Gallery messaging sample is identified by the complete XAML recipe,
// rather than by the data shape alone. This keeps a normal SelectionMode=None
// list on the regular ListViewItem presenter path.
const messageLayout = computed(() => (
  selectionMode.value === 'None'
  && itemsPanelBottom.value
  && contentAlignment.value === 'Stretch'
));

const containerRef = ref<HTMLElement>();
const listRef = ref<HTMLElement>();
const internalItems = ref<unknown[]>([...items.value]);
// ListView's default transition collection uses AddDeleteThemeTransition:
// affected containers first settle into their new slots (300ms), then the
// newly materialized container fades in.  Keep this state at the collection
// level so filtering and a source refresh receive the same treatment as the
// messaging sample.
const COLLECTION_REPOSITION_DURATION = 300;
const COLLECTION_FADE_DURATION = 167;
const messageEnterItems = shallowRef<Set<unknown>>(new Set());
const messageRepositionAnimations = new Set<Animation>();
const messageEnterTimers = new Set<number>();

const collectionRows = () => Array.from(listRef.value?.querySelectorAll<HTMLElement>('.win-list-item') ?? []);
const renderedItems = (source: unknown[]) => (
  isGrouped.value ? source.flatMap(group => getGroupItems(group)) : source
);

const stopMessageRepositionAnimations = () => {
  for (const animation of messageRepositionAnimations) animation.cancel();
  messageRepositionAnimations.clear();
};

const animateCollectionMutation = async (
  nextItems: unknown[],
  previousPositions: Map<unknown, number>,
  keepLastItemInView: boolean
) => {
  await nextTick();
  if (!listRef.value) return;

  const viewport = containerRef.value?.querySelector<HTMLElement>('.win-scroll-viewer-viewport');
  if (keepLastItemInView && viewport) {
    viewport.scrollTop = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
  }

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const rows = collectionRows();
  renderedItems(nextItems).forEach((item, index) => {
    const rawItem = toRaw(item);
    if (!rawItem || typeof rawItem !== 'object') return;
    const previousTop = previousPositions.get(rawItem);
    const row = rows[index];
    if (previousTop === undefined || !row) return;
    const offset = previousTop - row.getBoundingClientRect().top;
    if (Math.abs(offset) < 0.5) return;

    const animation = row.animate(
      [
        { transform: `translateY(${offset}px)` },
        { transform: 'translateY(0)' }
      ],
      {
        duration: COLLECTION_REPOSITION_DURATION,
        easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)'
      }
    );
    const forgetAnimation = () => messageRepositionAnimations.delete(animation);
    animation.addEventListener('finish', forgetAnimation, { once: true });
    animation.addEventListener('cancel', forgetAnimation, { once: true });
    messageRepositionAnimations.add(animation);
  });
};

watch(items, (val) => {
  const previousItems = internalItems.value;
  const previousRenderedItems = renderedItems(previousItems);
  const nextRenderedItems = renderedItems(val);
  const previousRaw = new Set(previousRenderedItems.map(item => toRaw(item)));
  const additions = val
    .flatMap(item => isGrouped.value ? getGroupItems(item) : [item])
    .map(item => toRaw(item))
    .filter(item => !previousRaw.has(item));
  const previousOrder = previousRenderedItems.map(item => toRaw(item));
  const nextOrder = nextRenderedItems.map(item => toRaw(item));
  const structureChanged = previousOrder.length !== nextOrder.length
    || previousOrder.some((item, index) => item !== nextOrder[index]);

  // Capture old positions before Vue patches the list.  This is deliberately
  // done for every structural mutation, including pure deletes and moves, so
  // filtering/reloading gets the same affected-item animation as WinUI.
  if (structureChanged && listRef.value) {
    const viewport = containerRef.value?.querySelector<HTMLElement>('.win-scroll-viewer-viewport');
    const keepLastItemInView = keepsLastItemInView.value && (
      !viewport || viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop < 24
    );
    const rows = collectionRows();
    const previousPositions = new Map<unknown, number>();
    previousRenderedItems.forEach((item, index) => {
      const rawItem = toRaw(item);
      if (rawItem !== null && rawItem !== undefined && rows[index]) {
        previousPositions.set(rawItem, rows[index].getBoundingClientRect().top);
      }
    });
    // A new update should continue from the rows' currently painted positions.
    // Cancelling here happens before the next DOM patch, so there is no frame
    // where an interrupted animation snaps back to its layout position.
    stopMessageRepositionAnimations();
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      // Do not leave a newly inserted row in the delayed-opacity state when
      // motion is disabled; it should be visible as soon as the DOM updates.
      const active = new Set(messageEnterItems.value);
      additions.forEach(item => active.delete(item));
      messageEnterItems.value = active;
    } else if (additions.length) {
      const entering = new Set(messageEnterItems.value);
      additions.forEach(item => entering.add(item));
      messageEnterItems.value = entering;
      const enterTimer = window.setTimeout(() => {
        const active = new Set(messageEnterItems.value);
        additions.forEach(item => active.delete(item));
        messageEnterItems.value = active;
        messageEnterTimers.delete(enterTimer);
      }, COLLECTION_REPOSITION_DURATION + COLLECTION_FADE_DURATION + 50);
      messageEnterTimers.add(enterTimer);
    }
    void animateCollectionMutation(val, previousPositions, keepLastItemInView);
  }
  internalItems.value = [...val];
  const availableItems = isGrouped.value ? val.flatMap(group => getGroupItems(group)) : val;
  internalSelectedItems.value = internalSelectedItems.value.filter(selected =>
    availableItems.some(item => toRaw(item) === toRaw(selected)));
}, { deep: true });

onBeforeUnmount(() => {
  for (const timer of messageEnterTimers) window.clearTimeout(timer);
  messageEnterTimers.clear();
  stopMessageRepositionAnimations();
});

const isDragging = ref(false);
const isExternalDragOver = ref(false);
const dragIndices = ref<number[]>([]);
const insertBeforeIndex = ref(-1);
// The reorder target is the row currently underneath the pointer.  Keeping
// this separate from the insertion slot matters when the pointer is in the
// lower half of a row: the item after that row is the insertion candidate,
// but WinUI applies ReorderingTarget to the row being hovered.
const dragOverIndex = ref(-1);
let anchorIndex: number | null = null;
let lastCalcTime = 0;
type DragLayoutEntry = {
  index: number;
  top: number;
  bottom: number;
  midY: number;
  height: number;
  slotSize: number;
};
let cachedMidpoints: DragLayoutEntry[] = [];
const dragLayoutVersion = ref(0);
let dragLayoutScrollTop = 0;
const dragOffsets = new Map<number, number>();
let pendingInsertIndex = -1;
let liveReorderTimer: number | undefined;
let dragPreviewElement: HTMLElement | null = null;
let pointerDropTarget: HTMLElement | null = null;
let pointerDraggedItems: unknown[] = [];
let externalDragHeight = 0;
const pointerDragOwner = Symbol('winuionweb-listview-drag-owner');
const pointerDragOverEvent = 'winuionweb-listview-pointer-drag-over';
const pointerDragLeaveEvent = 'winuionweb-listview-pointer-drag-leave';
const pointerDropEvent = 'winuionweb-listview-pointer-drop';

type PointerListDragDetail = {
  owner: symbol;
  indices: number[];
  items: unknown[];
  dragHeight: number;
  dragWidth: number;
  clientX: number;
  clientY: number;
  accepted: boolean;
  dropResult: 'None' | 'Move';
};

let pointerDragDetail: PointerListDragDetail | null = null;

const LIVE_REORDER_DELAY = 200;
const REORDER_ANIMATION_DURATION = 240;
const DRAG_THRESHOLD = 8;
const EDGE_SCROLL_SIZE = 100;
const EDGE_SCROLL_DELAY = 50;
const EDGE_SCROLL_MIN_SPEED = 150;
const EDGE_SCROLL_MAX_SPEED = 1500;
let edgeScrollStartTimer: number | undefined;
let edgeScrollFrame: number | undefined;
let edgeScrollVelocity = 0;
let edgeScrollLastTime = 0;
let dragScrollViewport: HTMLElement | null = null;
let edgeScrollViewport: HTMLElement | null = null;
let latestPointerPosition: { x: number; y: number } | null = null;
let globalPointerListenersAttached = false;

const isSelected = (item: unknown) => {
  const rawTarget = toRaw(item);
  return selectedItems.value.some(i => toRaw(i) === rawTarget);
};

// The gallery's messaging sample deliberately uses a different item visual:
// its ListViewItem remains a transparent, full-width presenter while the
// message template owns the colored bubble and left/right alignment.
const isMessageItem = (item: unknown) => {
  if (!messageLayout.value) return false;
  if (!item || typeof item !== 'object') return false;
  const value = item as Record<string, unknown>;
  return 'MsgAlignment' in value && 'MsgText' in value;
};
const pointerDrag = shallowRef<{
  pointerId: number;
  index: number;
  startX: number;
  startY: number;
  grabX: number;
  grabY: number;
  source: HTMLElement;
} | null>(null);
const pointerDragActive = ref(false);
let suppressClickUntil = 0;
const intentionallyReleasedPointerCaptures = new Set<number>();
let pendingPointerSelection: {
  pointerId: number;
  item: unknown;
  source: HTMLElement;
} | null = null;
let pointerSelectedItem: unknown = null;
let pointerSelectedUntil = 0;

const messageAlignment = (item: unknown) => {
  if (!isMessageItem(item)) return '';
  const alignmentValue = String((item as Record<string, unknown>).MsgAlignment ?? '').toLowerCase();
  return alignmentValue === 'right' || alignmentValue === 'left' ? alignmentValue : '';
};

// The ten-pixel WinUI reorder hint is a visual hint only.  The live reorder
// displacement itself is the distance between real layout slots, so rows with
// different heights and margins move by the correct amount.
const reorderTargetIndex = () => {
  void dragLayoutVersion.value;
  if (!isDragging.value || !cachedMidpoints.length) return -1;
  const candidates = cachedMidpoints.filter(({ index }) => !dragIndices.value.includes(index));
  if (dragOverIndex.value >= 0 && candidates.some(({ index }) => index === dragOverIndex.value)) {
    return dragOverIndex.value;
  }
  // Do not fall back to the insertion slot.  It points at the next row after
  // the midpoint and is a layout destination, not the ReorderingTarget.
  return -1;
};

const reorderHintOffset = (index: number) => {
  if (index !== reorderTargetIndex() || insertBeforeIndex.value < 0) return 0;
  const sorted = [...dragIndices.value].sort((a, b) => a - b);
  if (!sorted.length) return 0;
  return insertBeforeIndex.value > sorted[sorted.length - 1] ? 10 : -10;
};

const reorderOffset = (index: number) => {
  void dragLayoutVersion.value;
  if (!isDragging.value || dragIndices.value.includes(index)) return 0;
  // The whole list surface supplies the reorder hint. Keep item-level
  // transforms reserved for real slot displacement, so the row next to the
  // pointer does not appear to be the only item that sinks.
  return dragOffsets.get(index) ?? 0;
};

// Resolve the visual item under the pointer independently from the insertion
// slot.  The insertion slot flips at an item's midpoint, while WinUI keeps
// ReorderingTarget on the item being hovered until the pointer enters the
// next item.  Using the slot here made the row below the pointer shrink.
const pointerDragOverIndex = (clientY: number, excludedIndices: number[]) => {
  if (!cachedMidpoints.length) return -1;
  const candidates = cachedMidpoints.filter(({ index }) => !excludedIndices.includes(index));
  if (!candidates.length) return -1;
  const visualEntry = candidates.find((entry) => {
    const offset = dragOffsets.get(entry.index) ?? 0;
    const top = entry.top + offset;
    const height = Math.max(1, entry.bottom - entry.top);
    const relative = (clientY - top) / height;
    // ListViewBaseItem::IsDragOver uses a 20/60/20 vertical drag-over zone.
    return relative > 0.2 && relative < 0.8;
  });
  if (visualEntry) return visualEntry.index;
  return -1;
};

const itemClasses = (item: unknown, index = -1) => ({
  selected: isSelected(item),
  interactive: resolvedIsEnabled.value && selectionMode.value !== 'None',
  'selection-none': selectionMode.value === 'None',
  'message-item': isMessageItem(item),
  'message-left': messageAlignment(item) === 'left',
  'message-right': messageAlignment(item) === 'right',
  'message-enter': isMessageItem(item)
    && messageEnterItems.value.has(toRaw(item)),
  'collection-enter': toRaw(item) !== null
    && toRaw(item) !== undefined
    && messageEnterItems.value.has(toRaw(item)),
  'multi-select': selectionMode.value === 'Multiple',
  'can-drag': canDragItems.value && !isGrouped.value,
  'content-stretch': contentAlignment.value === 'Stretch',
  // ReorderingTarget has its own .5 opacity/0.95 scale. Do not also apply
  // the affected-item .8 opacity to that same row, or the values compound.
  'drag-shrink': index >= 0 && isDragging.value
    && !dragIndices.value.includes(index)
    && index !== reorderTargetIndex(),
  'reorder-target': index >= 0 && index === reorderTargetIndex(),
  'dragging-source': index >= 0 && isDragging.value && dragIndices.value.includes(index)
});

// ListViewItemPresenter sizes the indicator from the arranged item height:
// compact rows use their available height, then the 16px visual minimum is
// retained while the 20px top/bottom presenter margins are reclaimed. Using a
// percentage-based expression keeps variable-height templates in sync.
const selectionIndicatorStyle = (): CSSProperties => ({
  // Native layout returns the available height for compact rows, then keeps
  // a 16px indicator until the 20px top/bottom margins can be reclaimed.
  height: 'max(min(16px, 100%), calc(100% - 40px))',
  minHeight: '0px'
});

const emitSelection = (newSel: unknown[], previous = selectedItems.value) => {
  const addedItems = newSel.filter(item => !previous.some(current => toRaw(current) === toRaw(item)));
  const removedItems = previous.filter(item => !newSel.some(current => toRaw(current) === toRaw(item)));
  for (const removedItem of removedItems) cancelSelectionIndicatorForItem(removedItem);
  const selectedItem = newSel[0] ?? null;
  const selectedIndex = selectedItem === null
    ? -1
    : flatItems.value.findIndex(item => toRaw(item) === toRaw(selectedItem));

  internalSelectedItems.value = [...newSel];
  emit('update:SelectedItems', newSel);
  emit('update:SelectedItem', selectedItem);
  emit('update:SelectedIndex', selectedIndex);
  const args = { AddedItems: addedItems, RemovedItems: removedItems, SelectedItems: newSel };
  emit('selectionChanged', args);
  resolveXamlHandler(attrs.SelectionChanged, instance)?.(args);
};

const selectionIndicatorAnimations = new Set<Animation>();
const selectionIndicatorPresses = new Map<number, {
  indicator: HTMLElement;
  isPressed: boolean;
  pressFinished: boolean;
  releaseStarted: boolean;
  normalHeight: number;
  pressedHeight: number;
  animation?: Animation;
}>();

const itemElement = (item: unknown) => {
  if (!listRef.value) return undefined;
  const itemIndex = flatItems.value.findIndex(candidate => toRaw(candidate) === toRaw(item));
  return listRef.value.querySelectorAll<HTMLElement>('.win-list-item')[itemIndex];
};

// Web Animations with fill: both can keep a deselected indicator painted even
// after Vue removes its active class. Clear that presentation before the next
// selection state is rendered so switching away from an item removes the bar
// immediately and cannot leave a pressed height behind.
const cancelSelectionIndicatorForItem = (item: unknown) => {
  const indicator = itemElement(item)?.querySelector<HTMLElement>('.win-list-view-selection-indicator');
  if (!indicator) return;
  for (const animation of indicator.getAnimations()) {
    animation.cancel();
    selectionIndicatorAnimations.delete(animation);
  }
  for (const [pointerId, press] of selectionIndicatorPresses) {
    if (press.indicator !== indicator) continue;
    press.animation?.cancel();
    selectionIndicatorPresses.delete(pointerId);
  }
  indicator.classList.remove('indicator-pressed');
  indicator.style.removeProperty('--selection-indicator-pressed-height');
};

const trackSelectionIndicatorAnimation = (animation: Animation) => {
  const forgetAnimation = () => selectionIndicatorAnimations.delete(animation);
  animation.addEventListener('finish', forgetAnimation, { once: true });
  animation.addEventListener('cancel', forgetAnimation, { once: true });
  selectionIndicatorAnimations.add(animation);
};

const playSelectionIndicatorReveal = async (item: unknown) => {
  if (selectionMode.value === 'None' || selectionMode.value === 'Multiple') return;
  await nextTick();
  if (!isSelected(item) || !listRef.value || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  const row = itemElement(item);
  const indicator = row?.querySelector<HTMLElement>('.win-list-view-selection-indicator.active');
  if (!indicator) return;

  for (const animation of indicator.getAnimations()) animation.cancel();
  const scaleAnimation = indicator.animate(
    [
      { transform: 'translateY(-50%) scaleY(0)' },
      { transform: 'translateY(-50%) scaleY(1)' }
    ],
    { duration: 167, easing: 'cubic-bezier(0.167, 0.167, 0, 1)', fill: 'both' }
  );
  const opacityAnimation = indicator.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    { duration: 83, easing: 'linear', fill: 'both' }
  );
  trackSelectionIndicatorAnimation(scaleAnimation);
  trackSelectionIndicatorAnimation(opacityAnimation);
};

const readSelectionIndicatorScale = (indicator: HTMLElement) => {
  const transform = window.getComputedStyle(indicator).transform;
  if (!transform || transform === 'none') return 1;
  const matrix3d = transform.match(/^matrix3d\(([^)]+)\)$/);
  if (matrix3d) {
    const values = matrix3d[1].split(',').map(Number);
    return Number.isFinite(values[5]) ? values[5] : 1;
  }
  const matrix = transform.match(/^matrix\(([^)]+)\)$/);
  if (matrix) {
    const values = matrix[1].split(',').map(Number);
    return Number.isFinite(values[3]) ? values[3] : 1;
  }
  return 1;
};

const releaseSelectionIndicator = (pointerId: number) => {
  const press = selectionIndicatorPresses.get(pointerId);
  if (!press || press.releaseStarted) return;
  press.releaseStarted = true;

  // If the pointer is released before the press animation finishes, preserve
  // the currently painted height when the arranged height grows back.  This
  // is the same fromScale hand-off used by ListViewBaseItemChrome.
  const currentScale = readSelectionIndicatorScale(press.indicator);
  press.animation?.cancel();
  press.indicator.classList.remove('indicator-pressed');
  const normalHeight = press.indicator.getBoundingClientRect().height || press.normalHeight;
  const releaseScale = normalHeight > 0
    ? Math.max(0, Math.min(2, currentScale * press.pressedHeight / normalHeight))
    : 1;
  const releaseAnimation = press.indicator.animate(
    [
      { transform: `translateY(-50%) scaleY(${releaseScale})` },
      { transform: 'translateY(-50%) scaleY(1)' }
    ],
    {
      duration: 167,
      easing: 'cubic-bezier(0, 0, 0, 1)',
      fill: 'both'
    }
  );
  press.animation = releaseAnimation;
  trackSelectionIndicatorAnimation(releaseAnimation);
  releaseAnimation.addEventListener('finish', () => {
    if (selectionIndicatorPresses.get(pointerId) !== press) return;
    selectionIndicatorPresses.delete(pointerId);
    releaseAnimation.cancel();
    press.indicator.style.removeProperty('--selection-indicator-pressed-height');
  }, { once: true });
};

const finishSelectionIndicatorPress = (pointerId: number) => {
  const press = selectionIndicatorPresses.get(pointerId);
  if (!press || !press.isPressed) return;
  press.isPressed = false;
  releaseSelectionIndicator(pointerId);
};

const cancelSelectionIndicatorPresses = () => {
  for (const press of selectionIndicatorPresses.values()) {
    press.animation?.cancel();
    press.indicator.classList.remove('indicator-pressed');
    press.indicator.style.removeProperty('--selection-indicator-pressed-height');
  }
  selectionIndicatorPresses.clear();
  // Reveal animations are tracked separately because they can outlive the
  // pointer press. Stop them as soon as selection visuals are no longer
  // applicable (for example when dragging starts or the mode changes).
  for (const animation of selectionIndicatorAnimations) animation.cancel();
  selectionIndicatorAnimations.clear();
};

const beginSelectionIndicatorPress = (event: PointerEvent, item: unknown, reveal = false) => {
  if (selectionMode.value === 'None' || selectionMode.value === 'Multiple' || !isSelected(item)) return;
  const indicator = itemElement(item)?.querySelector<HTMLElement>('.win-list-view-selection-indicator');
  if (!indicator || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  const existing = selectionIndicatorPresses.get(event.pointerId);
  existing?.animation?.cancel();
  existing?.indicator.classList.remove('indicator-pressed');
  existing?.indicator.style.removeProperty('--selection-indicator-pressed-height');
  selectionIndicatorPresses.delete(event.pointerId);

  const normalHeight = indicator.getBoundingClientRect().height;
  if (normalHeight <= 0) return;
  // The native chrome first arranges the pressed target at H - 6, then
  // animates from H / (H - 6) to 1. This preserves the rounded ends while
  // deriving the scale from the item's actual, potentially variable height.
  const targetHeight = Math.max(1, normalHeight - 6);
  indicator.style.setProperty('--selection-indicator-pressed-height', `${targetHeight}px`);
  indicator.classList.add('indicator-pressed');
  const pressedHeight = indicator.getBoundingClientRect().height;
  const pressScale = reveal ? 0 : pressedHeight > 0 ? normalHeight / pressedHeight : 1;
  const press = {
    indicator,
    isPressed: true,
    pressFinished: false,
    releaseStarted: false,
    normalHeight,
    pressedHeight,
    animation: undefined as Animation | undefined
  };
  const pressAnimation = indicator.animate(
    [
      { transform: `translateY(-50%) scaleY(${pressScale})` },
      { transform: 'translateY(-50%) scaleY(1)' }
    ],
    {
      duration: 167,
      easing: 'cubic-bezier(0, 0, 0, 1)',
      fill: 'both'
    }
  );
  if (reveal) {
    const opacityAnimation = indicator.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 83, easing: 'linear' }
    );
    trackSelectionIndicatorAnimation(opacityAnimation);
  }
  press.animation = pressAnimation;
  selectionIndicatorPresses.set(event.pointerId, press);
  trackSelectionIndicatorAnimation(pressAnimation);
  pressAnimation.addEventListener('finish', () => {
    if (selectionIndicatorPresses.get(event.pointerId) !== press) return;
    press.pressFinished = true;
    if (!press.isPressed) releaseSelectionIndicator(event.pointerId);
  }, { once: true });
};

watch(selectionMode, (mode) => {
  anchorIndex = null;
  pendingPointerSelection = null;
  pointerSelectedItem = null;
  pointerSelectedUntil = 0;
  if (mode === 'None' || mode === 'Multiple') cancelSelectionIndicatorPresses();
  if (mode === 'None' && configuredSelectedItems.value.length) {
    emitSelection([], configuredSelectedItems.value);
  } else if (mode === 'Single' && selectedItems.value.length > 1) {
    emitSelection([selectedItems.value[0]]);
  }
}, { immediate: true });

type SelectionInputEvent = Pick<MouseEvent, 'ctrlKey' | 'shiftKey' | 'target'>;

const selectItem = (event: SelectionInputEvent, item: unknown) => {
  if (selectionMode.value === 'None') return false;
  const rawTarget = toRaw(item);
  const wasSelected = isSelected(item);
  let newSel = [...selectedItems.value];
  const itemIndex = flatItems.value.findIndex(candidate => toRaw(candidate) === rawTarget);
  if (selectionMode.value === 'Single') {
    newSel = [rawTarget];
    anchorIndex = itemIndex;
  } else if (selectionMode.value === 'Multiple') {
    if (event.shiftKey && anchorIndex !== null) {
      const start = Math.min(anchorIndex, itemIndex);
      const end = Math.max(anchorIndex, itemIndex);
      const range = flatItems.value.slice(start, end + 1).map(i => toRaw(i));
      const anchor = flatItems.value[anchorIndex];
      const selectRange = anchor !== undefined && isSelected(anchor);
      if (selectRange) {
        for (const rangeItem of range) {
          if (!newSel.some(selected => toRaw(selected) === rangeItem)) newSel.push(rangeItem);
        }
      } else {
        newSel = newSel.filter(selected => !range.some(rangeItem => toRaw(selected) === rangeItem));
      }
    } else {
      const idx = newSel.findIndex(i => toRaw(i) === rawTarget);
      if (idx > -1) newSel.splice(idx, 1);
      else newSel.push(rawTarget);
      anchorIndex = itemIndex;
    }
  } else if (selectionMode.value === 'Extended') {
    if (event.shiftKey && anchorIndex !== null) {
      const start = Math.min(anchorIndex, itemIndex);
      const end = Math.max(anchorIndex, itemIndex);
      const range = flatItems.value.slice(start, end + 1).map(i => toRaw(i));
      if (event.ctrlKey) {
        for (const rangeItem of range) {
          if (!newSel.some(selected => toRaw(selected) === rangeItem)) newSel.push(rangeItem);
        }
      } else {
        newSel = range;
      }
    } else if (event.ctrlKey) {
      const idx = newSel.findIndex(i => toRaw(i) === rawTarget);
      if (idx > -1) newSel.splice(idx, 1);
      else newSel.push(rawTarget);
      anchorIndex = itemIndex;
    } else {
      newSel = [rawTarget];
      anchorIndex = itemIndex;
    }
  }
  const changed = newSel.length !== selectedItems.value.length
    || newSel.some((selected, index) => toRaw(selectedItems.value[index]) !== toRaw(selected));
  if (changed) emitSelection(newSel);
  return !wasSelected && newSel.some(selected => toRaw(selected) === rawTarget);
};

const isPointerInsideElement = (event: PointerEvent, element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return event.clientX >= rect.left
    && event.clientX <= rect.right
    && event.clientY >= rect.top
    && event.clientY <= rect.bottom;
};

const commitPointerSelection = (event: PointerEvent) => {
  const pending = pendingPointerSelection;
  if (!pending || pending.pointerId !== event.pointerId) return true;
  pendingPointerSelection = null;

  // A pointer capture keeps delivering events to the pressed row after the
  // pointer leaves it.  Use the release coordinates, rather than event.target,
  // so a release outside the row does not select it.
  const inside = isPointerInsideElement(event, pending.source);
  if (!inside || isDragging.value || !resolvedIsEnabled.value) return false;

  const selected = selectItem(event, pending.item);
  pointerSelectedItem = pending.item;
  pointerSelectedUntil = Date.now() + 1000;
  if (selected) void playSelectionIndicatorReveal(pending.item);
  return true;
};

const onItemClick = (event: MouseEvent | KeyboardEvent, item: unknown) => {
  if (!resolvedIsEnabled.value || isDragging.value || Date.now() < suppressClickUntil) return;
  if (isItemClickEnabled.value) {
    const args = { ClickedItem: item, OriginalSource: event.target };
    emit('itemClick', args);
    resolveXamlHandler(attrs.ItemClick, instance)?.(args);
  }
  if (event instanceof MouseEvent
    && event.detail > 0
    && pointerSelectedItem !== null
    && Date.now() <= pointerSelectedUntil
    && toRaw(pointerSelectedItem) === toRaw(item)) {
    pointerSelectedItem = null;
    pointerSelectedUntil = 0;
    return;
  }
  if (selectItem(event, item)) void playSelectionIndicatorReveal(item);
};

const onItemPointerDown = (event: PointerEvent, item: unknown) => {
  if (!resolvedIsEnabled.value || !event.isPrimary || event.button !== 0) return;
  intentionallyReleasedPointerCaptures.delete(event.pointerId);
  pointerSelectedItem = null;
  pointerSelectedUntil = 0;
  if (pendingPointerSelection && pendingPointerSelection.pointerId !== event.pointerId) {
    pendingPointerSelection = null;
  }
  const source = event.currentTarget as HTMLElement | null;
  if (selectionMode.value !== 'None' && source) {
    // WinUI commits pointer selection on release.  Keep the candidate until
    // then so pressing and dragging, or releasing outside the row, cannot
    // change SelectedItems.
    pendingPointerSelection = {
      pointerId: event.pointerId,
      item,
      source
    };
  } else {
    pendingPointerSelection = null;
  }
  beginSelectionIndicatorPress(event, item, false);
  if (canDragItems.value && !isGrouped.value) {
    const target = event.currentTarget as HTMLElement | null;
    if (target) {
      const rect = target.getBoundingClientRect();
      const index = flatItems.value.findIndex(candidate => toRaw(candidate) === toRaw(item));
      pointerDrag.value = {
        pointerId: event.pointerId,
        index,
        startX: event.clientX,
        startY: event.clientY,
        grabX: event.clientX - rect.left,
        grabY: event.clientY - rect.top,
        source: target
      };
      try {
        target.setPointerCapture?.(event.pointerId);
      } catch {
        // The platform may reject capture for an already-cancelled pointer.
      }
    }
  }
};
const startPointerDrag = (event: PointerEvent, index: number) => {
  const pending = pointerDrag.value;
  if (!pending || pointerDragActive.value) return;
  const distance = Math.hypot(event.clientX - pending.startX, event.clientY - pending.startY);
  if (distance < DRAG_THRESHOLD) return;

  pointerDragActive.value = true;
  cancelSelectionIndicatorPresses();
  const sourceIndex = pending.index >= 0 ? pending.index : index;
  if (isSelected(internalItems.value[sourceIndex]) && selectedItems.value.length > 1) {
    dragIndices.value = internalItems.value
      .map((candidate, candidateIndex) => selectedItems.value.some(selected => toRaw(selected) === toRaw(candidate)) ? candidateIndex : -1)
      .filter(candidateIndex => candidateIndex >= 0);
  } else {
    dragIndices.value = [sourceIndex];
  }
  pointerDraggedItems = [...dragIndices.value]
    .sort((a, b) => a - b)
    .map(dragIndex => internalItems.value[dragIndex]);
  isDragging.value = true;
  dragOverIndex.value = -1;
  insertBeforeIndex.value = -1;
  pendingInsertIndex = -1;
  cacheMidpoints();
  const draggedHeight = dragIndices.value.reduce((total, dragIndex) => {
    const entry = cachedMidpoints.find(candidate => candidate.index === dragIndex);
    return total + (entry?.slotSize ?? entry?.height ?? 0);
  }, 0);
  // The live drag presenter moves the whole list as one arranged surface.
  const preview = pending.source.cloneNode(true) as HTMLElement;
  preview.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
  preview.removeAttribute('id');
  preview.classList.remove('dragging-source', 'reorder-target');
  preview.classList.add('win-list-drag-preview');
  const sourceRect = pending.source.getBoundingClientRect();
  Object.assign(preview.style, {
    width: `${sourceRect.width}px`,
    height: `${sourceRect.height}px`,
    margin: '0',
    left: '0',
    top: '0'
  });
  document.body.appendChild(preview);
  dragPreviewElement = preview;
  dragScrollViewport = containerRef.value?.querySelector<HTMLElement>('.win-scroll-viewer-viewport') ?? dragScrollViewport;
  pointerDragDetail = {
    owner: pointerDragOwner,
    indices: [...dragIndices.value],
    items: [...pointerDraggedItems],
    dragHeight: Math.max(1, draggedHeight || sourceRect.height),
    dragWidth: sourceRect.width,
    clientX: event.clientX,
    clientY: event.clientY,
    accepted: false,
    dropResult: 'None'
  };
  const args = { Items: [...pointerDraggedItems], OriginalSource: event.target };
  emit('dragItemsStarting', args);
  resolveXamlHandler(attrs.DragItemsStarting, instance)?.(args);
};

const updatePointerDragPosition = (event: PointerEvent, index = pointerDrag.value?.index ?? -1) => {
  const pending = pointerDrag.value;
  if (!pending || pending.pointerId !== event.pointerId || !canDragItems.value) return;
  if (!pointerDragActive.value) startPointerDrag(event, index);
  if (!pointerDragActive.value) return;
  latestPointerPosition = { x: event.clientX, y: event.clientY };
  if (dragPreviewElement) {
    dragPreviewElement.style.transform = `translate3d(${event.clientX - pending.grabX}px, ${event.clientY - pending.grabY}px, 0)`;
  }
  updateEdgeAutoScroll(event.clientY);
  updatePointerDropTarget(event.clientX, event.clientY);
  event.preventDefault();
};

const onItemPointerMove = (event: PointerEvent, index: number) => {
  updatePointerDragPosition(event, index);
};
const releasePointerDragCapture = () => {
  const pending = pointerDrag.value;
  if (!pending) return;
  try {
    if (pending.source.hasPointerCapture?.(pending.pointerId)) {
      intentionallyReleasedPointerCaptures.add(pending.pointerId);
      pending.source.releasePointerCapture?.(pending.pointerId);
    }
  } catch {
    intentionallyReleasedPointerCaptures.delete(pending.pointerId);
  }
};
const onItemPointerUp = (event?: PointerEvent) => {
  if (event) {
    finishSelectionIndicatorPress(event.pointerId);
    if (!pointerDragActive.value && !commitPointerSelection(event)) {
      // Pointer capture can still produce a synthetic click for the source
      // row after an outside release. Do not let that click select the row.
      suppressClickUntil = Date.now() + 250;
    }
  }
  if (pointerDragActive.value && event) {
    pendingPointerSelection = null;
    suppressClickUntil = Date.now() + 250;
    updatePointerDropTarget(event.clientX, event.clientY);
    const detail = pointerDragDetail;
    // Drop handlers can synchronously move or remove the source row. Release
    // capture before dispatching them so Chromium never retains a removed node.
    releasePointerDragCapture();
    if (pointerDropTarget && detail) {
      pointerDropTarget.dispatchEvent(new CustomEvent<PointerListDragDetail>(pointerDropEvent, { detail }));
    }
    const args = {
      Items: [...pointerDraggedItems],
      DropResult: detail?.dropResult ?? 'None',
      OriginalSource: event.target
    };
    emit('dragItemsCompleted', args);
    resolveXamlHandler(attrs.DragItemsCompleted, instance)?.(args);
    resetDrag();
    return;
  }
  if (event && pendingPointerSelection?.pointerId === event.pointerId) {
    pendingPointerSelection = null;
  }
  pointerDrag.value = null;
  pointerDragActive.value = false;
};

const onItemPointerCancel = (event?: PointerEvent) => {
  if (event) finishSelectionIndicatorPress(event.pointerId);
  if (event && pendingPointerSelection?.pointerId === event.pointerId) {
    pendingPointerSelection = null;
  }
  if (!pointerDrag.value && !pointerDragActive.value) {
    return;
  }
  if (pointerDragActive.value && pointerDraggedItems.length) {
    const args = { Items: [...pointerDraggedItems], DropResult: 'None', OriginalSource: event?.target };
    emit('dragItemsCompleted', args);
    resolveXamlHandler(attrs.DragItemsCompleted, instance)?.(args);
  }
  releasePointerDragCapture();
  resetDrag();
};

const onItemPointerLeave = (event: PointerEvent, item: unknown) => {
  finishSelectionIndicatorPress(event.pointerId);
  if (!isSelected(item)) cancelSelectionIndicatorForItem(item);
};

const onItemLostPointerCapture = (event: PointerEvent) => {
  if (intentionallyReleasedPointerCaptures.delete(event.pointerId)) return;
  if (pointerDrag.value?.pointerId !== event.pointerId) return;
  // The session also has document-level pointer listeners. Losing capture is
  // therefore not a cancellation (it commonly happens while scrolling or
  // when the pointer crosses another ListView).
  if (pointerDragActive.value) return;
  resetDrag();
};

const getItemStyle = (idx: number): CSSProperties | undefined => {
  const offset = reorderOffset(idx);
  const target = idx === reorderTargetIndex();
  if (!isDragging.value && !target) return undefined;
  const hint = target ? reorderHintOffset(idx) : 0;
  // Keep the layout slot's transform separate from the presenter transform.
  // WinUI scales ContentBorder (the visual surface), not the arranged item;
  // scaling this outer element makes its measured slot appear to shrink and
  // incorrectly pulls the following row toward the pointer.
  const transform = offset || hint ? `translateY(${offset + hint}px)` : undefined;
  return {
    transform,
    transformOrigin: 'center center',
    transition: `transform ${REORDER_ANIMATION_DURATION}ms cubic-bezier(0.1, 0.9, 0.2, 1)`,
    zIndex: target ? 2 : undefined
  };
};

const cacheMidpoints = () => {
  const viewport = listRef.value;
  if (!viewport) return;
  const els = Array.from(viewport.querySelectorAll<HTMLElement>('.win-list-item'));
  const entries: DragLayoutEntry[] = [];
  els.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    entries.push({
      index: i,
      top: rect.top,
      bottom: rect.bottom,
      midY: rect.top + rect.height / 2,
      height: rect.height,
      slotSize: rect.height
    });
  });
  for (let i = 0; i < entries.length - 1; i++) {
    const distance = entries[i + 1].top - entries[i].top;
    if (distance > 0) entries[i].slotSize = distance;
  }
  cachedMidpoints = entries;
  dragScrollViewport = containerRef.value?.querySelector<HTMLElement>('.win-scroll-viewer-viewport') ?? null;
  dragLayoutScrollTop = dragScrollViewport?.scrollTop ?? 0;
  dragLayoutVersion.value++;
};

const shiftCachedLayoutForScroll = () => {
  const viewport = dragScrollViewport;
  if (!viewport || !cachedMidpoints.length) return;
  const nextScrollTop = viewport.scrollTop;
  const delta = nextScrollTop - dragLayoutScrollTop;
  if (Math.abs(delta) < 0.01) return;
  for (const entry of cachedMidpoints) {
    entry.top -= delta;
    entry.bottom -= delta;
    entry.midY -= delta;
  }
  dragLayoutScrollTop = nextScrollTop;
  dragLayoutVersion.value++;
};

const pointerInsertIndex = (clientY: number, excludedIndices: number[]) => {
  if (!cachedMidpoints.length) cacheMidpoints();
  const candidates = cachedMidpoints.filter(({ index }) => !excludedIndices.includes(index));
  return candidates.find(({ index, midY }) => (
    clientY < midY + (dragOffsets.get(index) ?? 0)
  ))?.index ?? internalItems.value.length;
};

const normalizeOwnInsertIndex = (slot: number) => {
  const sorted = [...dragIndices.value].sort((a, b) => a - b);
  if (!sorted.length) return slot;
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const contiguous = max - min + 1 === sorted.length;
  return contiguous && slot >= min && slot <= max + 1 ? -1 : slot;
};

const updateDragOffsets = () => {
  dragOffsets.clear();
  const sorted = [...dragIndices.value].sort((a, b) => a - b);
  if (!isDragging.value) {
    dragLayoutVersion.value++;
    return;
  }

  if (insertBeforeIndex.value < 0 && sorted.length) {
    dragLayoutVersion.value++;
    return;
  }

  // A drag entering from another ListView has no local source indices. Keep
  // an insertion gap by moving every local slot at/after the destination
  // down by the dragged group's measured extent.
  if (isExternalDragOver.value && !sorted.length) {
    const gap = Math.max(1, externalDragHeight);
    for (const entry of cachedMidpoints) {
      if (entry.index >= insertBeforeIndex.value) dragOffsets.set(entry.index, gap);
    }
    dragLayoutVersion.value++;
    return;
  }

  const sourceSet = new Set(sorted);
  const sourceExtent = sorted.reduce((total, index) => {
    const entry = cachedMidpoints.find(candidate => candidate.index === index);
    return total + (entry?.slotSize ?? entry?.height ?? 0);
  }, 0);
  if (sourceExtent <= 0) {
    dragLayoutVersion.value++;
    return;
  }

  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  if (insertBeforeIndex.value > max) {
    for (const entry of cachedMidpoints) {
      if (!sourceSet.has(entry.index)
        && entry.index > max
        && entry.index < insertBeforeIndex.value) {
        dragOffsets.set(entry.index, -sourceExtent);
      }
    }
  } else if (insertBeforeIndex.value < min) {
    for (const entry of cachedMidpoints) {
      if (!sourceSet.has(entry.index)
        && entry.index >= insertBeforeIndex.value
        && entry.index < min) {
        dragOffsets.set(entry.index, sourceExtent);
      }
    }
  }
  dragLayoutVersion.value++;
};

const applyLiveReorder = (slot: number) => {
  if (!isDragging.value) return;
  if (liveReorderTimer !== undefined) {
    window.clearTimeout(liveReorderTimer);
    liveReorderTimer = undefined;
  }
  insertBeforeIndex.value = normalizeOwnInsertIndex(slot);
  updateDragOffsets();
};

const scheduleLiveReorder = (slot: number, immediate = false) => {
  const normalized = normalizeOwnInsertIndex(slot);
  if (!immediate && normalized === pendingInsertIndex && liveReorderTimer !== undefined) return;
  pendingInsertIndex = normalized;
  if (normalized === insertBeforeIndex.value && liveReorderTimer === undefined) return;
  if (liveReorderTimer !== undefined) window.clearTimeout(liveReorderTimer);
  if (immediate) {
    liveReorderTimer = undefined;
    applyLiveReorder(normalized);
    return;
  }
  liveReorderTimer = window.setTimeout(() => {
    liveReorderTimer = undefined;
    applyLiveReorder(pendingInsertIndex);
  }, LIVE_REORDER_DELAY);
};

const flushLiveReorder = () => {
  const hasPending = liveReorderTimer !== undefined || pendingInsertIndex !== -1;
  if (liveReorderTimer !== undefined) {
    window.clearTimeout(liveReorderTimer);
    liveReorderTimer = undefined;
  }
  if (isDragging.value && hasPending) applyLiveReorder(pendingInsertIndex);
};

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
  const list = hit?.closest<HTMLElement>('.win-list-view');
  return list?.querySelector<HTMLElement>('.win-scroll-viewer-viewport') ?? null;
};

const computeEdgeScrollVelocity = (clientY: number) => {
  const viewport = findPointerViewport()
    ?? dragScrollViewport
    ?? containerRef.value?.querySelector<HTMLElement>('.win-scroll-viewer-viewport');
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
  const speed = EDGE_SCROLL_MAX_SPEED
    - (EDGE_SCROLL_MAX_SPEED - EDGE_SCROLL_MIN_SPEED) * ratio;
  return direction * speed;
};

const recalculateDragTarget = () => {
  if (!isDragging.value || !latestPointerPosition) return;
  const excluded = dragIndices.value;
  dragOverIndex.value = pointerDragOverIndex(latestPointerPosition.y, excluded);
  const slot = pointerInsertIndex(latestPointerPosition.y, excluded);
  scheduleLiveReorder(slot);
};

const runEdgeAutoScroll = (now: number) => {
  if (!isDragging.value || !edgeScrollVelocity || !edgeScrollViewport) {
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
    if (edgeScrollViewport === dragScrollViewport) shiftCachedLayoutForScroll();
    recalculateDragTarget();
  } else {
    stopEdgeAutoScroll();
    return;
  }
  edgeScrollFrame = window.requestAnimationFrame(runEdgeAutoScroll);
};

const updateEdgeAutoScroll = (clientY: number) => {
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
      if (!edgeScrollVelocity || !isDragging.value) return;
      edgeScrollLastTime = 0;
      edgeScrollFrame = window.requestAnimationFrame(runEdgeAutoScroll);
    }, EDGE_SCROLL_DELAY);
  }
};

const onDragViewportScroll = () => {
  if (!isDragging.value) return;
  shiftCachedLayoutForScroll();
  recalculateDragTarget();
};

const clearPointerDropVisual = (detail: PointerListDragDetail) => {
  if (liveReorderTimer !== undefined) {
    window.clearTimeout(liveReorderTimer);
    liveReorderTimer = undefined;
  }
  pendingInsertIndex = -1;
  insertBeforeIndex.value = -1;
  dragOverIndex.value = -1;
  dragOffsets.clear();
  externalDragHeight = 0;
  cachedMidpoints = [];
  dragLayoutVersion.value++;
  if (detail.owner !== pointerDragOwner) {
    isExternalDragOver.value = false;
    isDragging.value = false;
  }
};

const onPointerListDragOver = (event: Event) => {
  const detail = (event as CustomEvent<PointerListDragDetail>).detail;
  if (!detail || isGrouped.value || !resolvedIsEnabled.value) return;
  const ownsDrag = detail.owner === pointerDragOwner;
  if (!ownsDrag && !allowDrop.value) return;
  if (ownsDrag && !canReorderItems.value) return;

  detail.accepted = true;
  isDragging.value = true;
  isExternalDragOver.value = !ownsDrag;
  const excludedIndices = ownsDrag ? detail.indices : [];
  externalDragHeight = ownsDrag ? 0 : Math.max(1, detail.dragHeight || 0);
  const slot = pointerInsertIndex(detail.clientY, excludedIndices);
  dragOverIndex.value = pointerDragOverIndex(detail.clientY, excludedIndices);

  if (ownsDrag && excludedIndices.length) {
    scheduleLiveReorder(slot);
  } else {
    insertBeforeIndex.value = slot;
    pendingInsertIndex = slot;
    updateDragOffsets();
  }

  const args = {
    DataTransfer: null,
    AcceptedOperation: 'Move',
    OriginalSource: document.elementFromPoint(detail.clientX, detail.clientY)
  };
  emit('dragOver', args);
  resolveXamlHandler(attrs.DragOver, instance)?.(args);
};

const onPointerListDragLeave = (event: Event) => {
  const detail = (event as CustomEvent<PointerListDragDetail>).detail;
  if (detail) clearPointerDropVisual(detail);
};

const onPointerListDrop = (event: Event) => {
  const detail = (event as CustomEvent<PointerListDragDetail>).detail;
  if (!detail || isGrouped.value || !resolvedIsEnabled.value) return;
  const ownsDrag = detail.owner === pointerDragOwner;
  if (!ownsDrag && !allowDrop.value) return;
  if (ownsDrag) flushLiveReorder();
  if (ownsDrag && (!canReorderItems.value || insertBeforeIndex.value < 0)) {
    clearPointerDropVisual(detail);
    return;
  }

  let actualInsert = insertBeforeIndex.value < 0 ? internalItems.value.length : insertBeforeIndex.value;
  if (ownsDrag) {
    const excluded = new Set(detail.indices);
    const remaining = internalItems.value.filter((_, index) => !excluded.has(index));
    actualInsert = insertBeforeIndex.value >= internalItems.value.length
      ? remaining.length
      : detail.indices.reduce(
        (result, dragIndex) => dragIndex < insertBeforeIndex.value ? result - 1 : result,
        insertBeforeIndex.value
      );
    const reordered = [...remaining];
    reordered.splice(Math.max(0, actualInsert), 0, ...detail.items);
    internalItems.value = reordered;
    emit('update:ItemsSource', reordered);
  }

  const dropArgs = {
    DataTransfer: null,
    AcceptedOperation: 'Move',
    InsertIndex: Math.max(0, actualInsert),
    Items: [...detail.items],
    OriginalSource: document.elementFromPoint(detail.clientX, detail.clientY)
  };
  emit('drop', dropArgs);
  resolveXamlHandler(attrs.Drop, instance)?.(dropArgs);
  detail.dropResult = 'Move';
  clearPointerDropVisual(detail);
};

const updatePointerDropTarget = (clientX: number, clientY: number) => {
  const detail = pointerDragDetail;
  if (!detail) return;
  detail.clientX = clientX;
  detail.clientY = clientY;
  const hit = document.elementFromPoint(clientX, clientY);
  const nextTarget = hit?.closest<HTMLElement>('.win-list-view') ?? null;

  if (pointerDropTarget && pointerDropTarget !== nextTarget) {
    pointerDropTarget.dispatchEvent(new CustomEvent<PointerListDragDetail>(pointerDragLeaveEvent, { detail }));
    pointerDropTarget = null;
  }
  if (!nextTarget) return;

  detail.accepted = false;
  nextTarget.dispatchEvent(new CustomEvent<PointerListDragDetail>(pointerDragOverEvent, { detail }));
  pointerDropTarget = detail.accepted ? nextTarget : null;
};

const onGlobalPointerMove = (event: PointerEvent) => {
  if (!pointerDrag.value || pointerDrag.value.pointerId !== event.pointerId) return;
  updatePointerDragPosition(event);
};

const onGlobalPointerUp = (event: PointerEvent) => {
  if (pointerDrag.value?.pointerId === event.pointerId) {
    onItemPointerUp(event);
    return;
  }
  if (pendingPointerSelection?.pointerId === event.pointerId) onItemPointerUp(event);
};

const onGlobalPointerCancel = (event: PointerEvent) => {
  if (pointerDrag.value?.pointerId === event.pointerId || pendingPointerSelection?.pointerId === event.pointerId) {
    onItemPointerCancel(event);
  }
};

onMounted(() => {
  const root = containerRef.value;
  root?.addEventListener(pointerDragOverEvent, onPointerListDragOver);
  root?.addEventListener(pointerDragLeaveEvent, onPointerListDragLeave);
  root?.addEventListener(pointerDropEvent, onPointerListDrop);
  dragScrollViewport = root?.querySelector<HTMLElement>('.win-scroll-viewer-viewport') ?? null;
  dragScrollViewport?.addEventListener('scroll', onDragViewportScroll, { passive: true });
  document.addEventListener('pointermove', onGlobalPointerMove);
  document.addEventListener('pointerup', onGlobalPointerUp);
  document.addEventListener('pointercancel', onGlobalPointerCancel);
  globalPointerListenersAttached = true;
});

const onViewportDragOver = (e: DragEvent) => {
  if (!allowDrop.value || isGrouped.value) return;
  e.preventDefault();
  const ownsDrag = dragIndices.value.length > 0;
  if (ownsDrag && !canReorderItems.value) return;
  if (!ownsDrag) isExternalDragOver.value = true;
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  const args = { DataTransfer: e.dataTransfer, AcceptedOperation: 'Move', OriginalSource: e.target };
  emit('dragOver', args);
  resolveXamlHandler(attrs.DragOver, instance)?.(args);

  const now = Date.now();
  if (now - lastCalcTime < 80) return;
  lastCalcTime = now;

  const mouseY = e.clientY;

  if (cachedMidpoints.length === 0) cacheMidpoints();
  if (cachedMidpoints.length === 0) return;

  const nonDragMidpoints = cachedMidpoints.filter(m => !dragIndices.value.includes(m.index));
  if (nonDragMidpoints.length === 0) return;

  dragOverIndex.value = pointerDragOverIndex(mouseY, dragIndices.value);

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
  dragOverIndex.value = -1;
  isExternalDragOver.value = false;
};

const onViewportDrop = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
  const ownsDrag = dragIndices.value.length > 0;
  if (isExternalDragOver.value && !ownsDrag) {
    const insertIndex = insertBeforeIndex.value < 0 ? internalItems.value.length : insertBeforeIndex.value;
    const args = {
      DataTransfer: event.dataTransfer,
      AcceptedOperation: 'Move',
      InsertIndex: insertIndex,
      OriginalSource: event.target
    };
    emit('drop', args);
    resolveXamlHandler(attrs.Drop, instance)?.(args);
    resetDrag();
    return;
  }

  if (!canReorderItems.value || !ownsDrag || insertBeforeIndex.value === -1) {
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
  const dropArgs = {
    DataTransfer: event.dataTransfer,
    AcceptedOperation: 'Move',
    InsertIndex: actualInsert,
    OriginalSource: event.target
  };
  emit('drop', dropArgs);
  resolveXamlHandler(attrs.Drop, instance)?.(dropArgs);
  const completedArgs = { Items: draggedItems, DropResult: 'Move', OriginalSource: event.target };
  emit('dragItemsCompleted', completedArgs);
  resolveXamlHandler(attrs.DragItemsCompleted, instance)?.(completedArgs);
  resetDrag();
};

const resetDrag = () => {
  stopEdgeAutoScroll();
  if (liveReorderTimer !== undefined) {
    window.clearTimeout(liveReorderTimer);
    liveReorderTimer = undefined;
  }
  pendingInsertIndex = -1;
  if (pointerDropTarget && pointerDragDetail) {
    pointerDropTarget.dispatchEvent(new CustomEvent<PointerListDragDetail>(pointerDragLeaveEvent, { detail: pointerDragDetail }));
  }
  pointerDropTarget = null;
  releasePointerDragCapture();
  dragPreviewElement?.remove();
  dragPreviewElement = null;
  isDragging.value = false;
  isExternalDragOver.value = false;
  dragIndices.value = [];
  insertBeforeIndex.value = -1;
  dragOverIndex.value = -1;
  dragOffsets.clear();
  externalDragHeight = 0;
  cachedMidpoints = [];
  dragLayoutVersion.value++;
  dragScrollViewport = null;
  latestPointerPosition = null;
  pointerDraggedItems = [];
  pointerDragDetail = null;
  pointerDrag.value = null;
  pointerDragActive.value = false;
};

onBeforeUnmount(() => {
  cancelSelectionIndicatorPresses();
  for (const animation of selectionIndicatorAnimations) animation.cancel();
  selectionIndicatorAnimations.clear();
  stopEdgeAutoScroll();
  if (liveReorderTimer !== undefined) window.clearTimeout(liveReorderTimer);
  liveReorderTimer = undefined;
  dragScrollViewport?.removeEventListener('scroll', onDragViewportScroll);
  if (globalPointerListenersAttached) {
    document.removeEventListener('pointermove', onGlobalPointerMove);
    document.removeEventListener('pointerup', onGlobalPointerUp);
    document.removeEventListener('pointercancel', onGlobalPointerCancel);
    globalPointerListenersAttached = false;
  }
  const root = containerRef.value;
  root?.removeEventListener(pointerDragOverEvent, onPointerListDragOver);
  root?.removeEventListener(pointerDragLeaveEvent, onPointerListDragLeave);
  root?.removeEventListener(pointerDropEvent, onPointerListDrop);
  dragPreviewElement?.remove();
});
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
    padding: 0;
    transition: transform 240ms cubic-bezier(0.1, 0.9, 0.2, 1);
    will-change: transform;
  }

  .win-list-content.drag-sinking {
    /* ReorderSink is a surface-level presenter animation. Applying it to
       the content host keeps every row, header, and divider moving together
       instead of making only the row below the pointer appear displaced. */
    /* Keep this on the content host rather than the item immediately after
       the pointer.  The host contains every row (and grouped headers), so a
       source drag and an external drop both produce one coherent surface
       motion while the original row's hidden slot remains measurable. */
    transform: translate3d(0, var(--ListViewItemReorderHintThemeOffset, 6px), 0);
  }

  .win-list-content.items-bottom {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .win-list-view > .win-list-viewport.items-bottom-host > .win-scroll-viewer-viewport > .scroll-content {
    display: flex !important;
    flex-direction: column;
    min-height: 100%;
  }

  .win-list-view > .win-list-viewport.items-bottom-host > .win-scroll-viewer-viewport > .scroll-content > .win-list-content.items-bottom {
    flex: 1 0 auto;
  }

  .win-list-group {
    display: block;
    width: 100%;
  }

  .win-list-header {
    min-height: 44px;
    margin: 0 0 4px;
    box-sizing: border-box;
    color: var(--TextFillColorPrimaryBrush, var(--text-primary));
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    /* Group headers sit above scrolling items. Use the active theme's solid
       surface as the fallback rather than transparent, otherwise a sticky
       header reveals the rows underneath while it moves. */
    background-color: var(
      --ListViewHeaderItemBackground,
      var(--SolidBackgroundFillColorBaseBrush, var(--ctrl-solid-fill, #F3F3F3))
    );
    display: flex;
    flex-direction: column;
    z-index: 5;
  }

  .win-list-header-content {
    display: flex;
    align-items: flex-start;
    min-width: 0;
    min-height: 28px;
    margin: 8px 12px 0;
  }

  .win-list-header-divider {
    height: 1px;
    width: auto;
    margin: 8px 12px 0;
    box-sizing: border-box;
    flex: 0 0 1px;
    background: transparent;
    border-top: .5px solid var(--ListViewHeaderItemDividerStroke, color-mix(in srgb, currentColor 20%, transparent));
    pointer-events: none;
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
    /* DefaultListViewItemStyle.Padding belongs to the ContentPresenter. */
    padding: 0;
    border-style: solid;
    border-width: 0;
    border-radius: var(--ListViewItemCornerRadius, 4px);
    display: block;
    overflow: visible;
    cursor: default;
    user-select: none;
    -webkit-user-drag: none;
    transition: transform 240ms cubic-bezier(0.1, 0.9, 0.2, 1),
      background-color var(--faster-duration, 83ms) linear,
      opacity 240ms cubic-bezier(0.1, 0.9, 0.2, 1);
  }

  .win-list-item.can-drag {
    cursor: grab;
  }

  .win-list-item.can-drag *,
  .win-list-item.win-list-drag-preview * {
    -webkit-user-drag: none;
  }

  /* The presenter paints an inset surface inside each ListViewItem. Keeping
     that surface separate from the layout box prevents selection and pointer
     states from changing the item's measured width or height. */
  .win-list-item::before {
    content: '';
    position: absolute;
    z-index: 0;
    inset: 2px 4px;
    border-radius: var(--ListViewItemCornerRadius, 4px);
    background: var(--ListViewItemBackground, var(--SubtleFillColorTransparentBrush, transparent));
    pointer-events: none;
    transition: transform 240ms cubic-bezier(0.1, 0.9, 0.2, 1),
      opacity 240ms cubic-bezier(0.1, 0.9, 0.2, 1),
      background-color var(--faster-duration, 83ms) linear;
  }

  .win-list-item > * {
    position: relative;
    z-index: 1;
  }

  /* ContentBorder in the native presenter is the visual surface that is
     scaled during ReorderingTarget.  Keep a matching surface wrapper inside
     the arranged row so the row's slot and live-reorder translation retain
     their original dimensions. */
  .win-list-item-visual {
    position: relative;
    width: 100%;
    min-height: inherit;
    box-sizing: border-box;
    transform-origin: center center;
    transition: transform 240ms cubic-bezier(0.1, 0.9, 0.2, 1),
      opacity 240ms cubic-bezier(0.1, 0.9, 0.2, 1);
    will-change: transform, opacity;
  }

  /* The hovered row is only an insertion target.  It must keep its normal
     measured and painted size while the dragged preview passes over it; a
     target-scale transform makes the row appear to collapse under the
     pointer and is not part of this ListView's drag interaction. */
  .win-list-item.reorder-target .win-list-item-visual,
  .win-list-item.reorder-target::before {
    transform: none;
    opacity: 1;
  }

  /* This is the ContentPresenter equivalent.  Keeping the padding and the
     measured width here prevents selection chrome from moving the item. */
  .win-list-item-content {
    display: flex;
    align-items: center;
    width: auto;
    max-width: 100%;
    min-width: 0;
    min-height: 36px;
    box-sizing: border-box;
    /* ListViewItemPresenter's Border uses Margin="4,2,4,2".  The
       corresponding content presenter therefore occupies the inset box,
       while its default ContentMargin remains 16,0,12,0. */
    margin: 2px 4px;
    padding: 0 12px 0 16px;
  }

  .win-list-item-content > * {
    flex: 0 1 auto;
    min-width: 0;
    max-width: 100%;
  }

  .win-list-item.content-stretch .win-list-item-content > * {
    flex: 1 1 auto;
  }

  .win-list-item.multi-select {
    /* The native presenter translates its content by 32px while the
       checkbox is shown.  Include that space inside the fixed presenter. */
  }

  .win-list-item.multi-select .win-list-item-content {
    padding-left: 48px;
    transition: padding-left 333ms cubic-bezier(0.1, 0.9, 0.2, 1);
  }

  .win-list-item:not(.multi-select) .win-list-item-content {
    transition: padding-left 333ms cubic-bezier(0.1, 0.9, 0.2, 1);
  }

    .win-list-view:not(.disabled) .win-list-item:hover {
      background: transparent;
    }

    .win-list-view:not(.disabled) .win-list-item:hover::before {
      background: var(--ListViewItemBackgroundPointerOver, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary)));
    }

    .win-list-view:not(.disabled) .win-list-item:active {
      background: transparent;
    }

    .win-list-view:not(.disabled) .win-list-item:active::before {
      background: var(--ListViewItemBackgroundPressed, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary)));
    }

    .win-list-item.selected {
      background: transparent;
    }

    .win-list-item.selected::before {
      background: var(--ListViewItemBackgroundSelected, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary)));
    }

      .win-list-item.selected:hover {
        background: transparent;
      }

      .win-list-item.selected:hover::before {
        background: var(--ListViewItemBackgroundSelectedPointerOver, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary)));
      }

      .win-list-item.selected:active {
        background: transparent;
      }

    .win-list-item.selected:active::before {
      background: var(--ListViewItemBackgroundSelectedPressed, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary)));
    }

  .win-list-item.message-item::before,
    .win-list-item.message-item:hover::before,
    .win-list-item.message-item:active::before {
      background: transparent;
    }

    .win-list-item.message-item,
    .win-list-item.message-item:hover,
    .win-list-item.message-item:active,
    .win-list-item.message-item.selected,
    .win-list-item.message-item.selected:hover,
    .win-list-item.message-item.selected:active {
      background: transparent;
    }

  .win-list-item.message-item .win-list-item-content {
      /* The message DataTemplate is still hosted by the regular
         ListViewItemPresenter. Its bubble owns color and radius; the item
         keeps the native presenter inset and ContentMargin. */
      min-height: 36px;
      width: auto;
      display: flex;
      flex: 1 1 auto;
      align-items: stretch;
      max-width: 100%;
      overflow: visible;
      /* SelectionMode=None has no indicator lane.  Use the same presenter
         inset on both sides so Grid Margin="4" produces equal message edges. */
      padding-left: 12px;
      padding-right: 12px;
    }

    .win-list-item.message-item .win-list-item-content > * {
      flex: 0 1 auto;
      min-width: 0;
      max-width: 100%;
    }

    .win-list-item.message-item .win-list-item-content > .win-grid {
      box-sizing: border-box;
      max-width: 100%;
    }

    .win-list-item.message-item .win-list-item-content .win-stack-panel {
      max-width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      overflow-wrap: anywhere;
    }

    .win-list-item.message-item .win-list-item-content > .win-grid {
      /* Grid carries an inline Margin="4" from the official template.  The
         auto side must win so Right/Left messages keep their bubble edge. */
      margin-left: auto !important;
      margin-right: 4px !important;
      width: auto !important;
      animation: none;
      flex: 0 1 auto !important;
      border-radius: 4px;
      overflow: hidden;
      clip-path: inset(0 round 4px);
    }

    .win-list-item.message-item.message-left .win-list-item-content > .win-grid {
      margin-left: 4px !important;
      margin-right: auto !important;
      width: auto !important;
    }

    .win-list-item.message-item.message-right .win-list-item-content > .win-grid {
      margin-left: auto !important;
      margin-right: 4px !important;
    }

  .win-list-item.message-item .win-list-item-content > .win-grid .win-stack-panel {
      width: min(350px, calc(100vw - 96px)) !important;
      max-width: 350px;
      border-radius: 4px;
      box-sizing: border-box;
      overflow: hidden;
      clip-path: inset(0 round 4px);
    }

    /* AddDeleteThemeTransition keeps the new container in its arranged slot
       while the affected rows finish their 300ms reposition. The fade starts
       only after that push, so a message grows upward instead of entering
       from either side. The same class is used for filtering/reload adds. */
    .win-list-item.collection-enter .win-list-item-content {
      animation: list-item-fade-in 167ms linear 300ms both;
    }

    @keyframes list-item-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Image templates in the gallery use an Auto/Star Grid.  Constrain the
       rendered media to the item presenter so a remote bitmap cannot paint
       over the options column or the ListView border. */
    .win-list-item:not(.message-item) .win-list-item-content > .win-grid {
      width: 100%;
      max-width: 100%;
      min-width: 0;
      overflow: hidden;
    }

    .win-list-item-content .win-image-host,
    .win-list-item-content .win-image {
      max-width: 100%;
      max-height: 100px;
      min-width: 0;
      box-sizing: border-box;
    }

    .win-list-item-content .win-image-host {
      overflow: hidden;
    }

    .win-list-item:focus-visible {
      outline: 2px solid var(--ListViewItemFocusVisualPrimaryBrush, var(--FocusStrokeColorOuterBrush, var(--text-primary)));
      outline-offset: -3px;
    }

    .win-list-item.dragging-source {
      /* Keep the original layout slot as an invisible placeholder while the
         fixed preview follows the pointer. */
      visibility: hidden;
      opacity: 0;
      pointer-events: none;
      cursor: grabbing;
    }

  .win-list-item.drag-shrink {
      /* The native affected-item presenter settles with the whole list
         surface slightly lowered; keep the measured row height unchanged so
         scrolling and insertion geometry remain stable. */
    opacity: 1;
    will-change: transform, opacity;
  }

  .win-list-item.drag-shrink .win-list-item-visual,
  .win-list-item.drag-shrink::before {
    opacity: var(--ListViewItemReorderThemeOpacity, .8);
  }

    .win-list-item.win-list-drag-preview {
      position: fixed;
      z-index: 2147483647;
      pointer-events: none;
      opacity: var(--ListViewItemDragThemeOpacity, .8);
      transition: none !important;
      will-change: transform;
      box-shadow: 0 8px 20px rgba(0, 0, 0, .18);
    }

  .win-list-item.reorder-target {
      /* ReorderingTarget's opacity/scale live on the visual wrapper above;
         this outer element only owns the arranged slot and its offset. */
      opacity: 1;
    }

  .win-list-view-selection-indicator {
    position: absolute;
    z-index: 3;
    left: 4px;
    top: 50%;
    bottom: auto;
    width: 3px;
    /* The native presenter uses max(16px, itemHeight - 40px): the indicator
       grows with a tall DataTemplate while retaining its 16px compact size. */
    height: max(min(16px, 100%), calc(100% - 40px));
    min-height: 0;
    transform: translateY(-50%) scaleY(1);
    transform-origin: center center;
    border-radius: var(--ListViewItemSelectionIndicatorCornerRadius, 1.5px);
    background: var(--ListViewItemSelectionIndicatorBrush, var(--AccentFillColorDefaultBrush, var(--accent-base)));
    opacity: 0;
    pointer-events: none;
    transition: opacity 83ms linear;
  }

    .win-list-view-selection-indicator.active {
      opacity: 1;
      transform: translateY(-50%) scaleY(1);
      animation: none;
    }

    .win-list-view-selection-indicator.indicator-pressed {
      /* JS resolves H from the rendered item, then applies H - 6 (with a
         compact-row floor). A measured value keeps variable-height templates
         on the same curve. */
      height: var(--selection-indicator-pressed-height, 1px) !important;
      min-height: 0 !important;
    }

  .win-list-item:hover .win-list-view-selection-indicator.active {
    background: var(--ListViewItemSelectionIndicatorPointerOverBrush, var(--AccentFillColorDefaultBrush, var(--accent-base)));
  }

  .win-list-item:active .win-list-view-selection-indicator.active {
    background: var(--ListViewItemSelectionIndicatorPressedBrush, var(--AccentFillColorDefaultBrush, var(--accent-base)));
  }

  /* ListViewItemPresenter uses the platform CheckBox visual in multiple
     selection mode.  Keep it in a fixed lane and animate that lane exactly
     like the native 333ms MultiSelectEnabled transition. */
  .list-selection-check {
    position: absolute;
    left: 12px;
    top: 50%;
    z-index: 2;
    transform: translate(-32px, -50%);
    transform-origin: center center;
    display: flex;
    width: 20px;
    height: 20px;
    min-width: 20px;
    min-height: 20px;
    margin: 0;
    box-sizing: border-box;
    opacity: 0;
    pointer-events: none;
    transition: transform 333ms cubic-bezier(0.1, 0.9, 0.2, 1), opacity 167ms linear;
    --CheckBoxCheckBackgroundFill: var(--ListViewItemCheckBoxBrush, var(--ControlAltFillColorSecondaryBrush, var(--ctrl-fill-secondary)));
    --CheckBoxCheckBackgroundStroke: var(--ListViewItemCheckBoxBorderBrush, var(--ControlStrongStrokeColorDefaultBrush, var(--ctrl-strong-stroke)));
    --CheckBoxCheckGlyphForeground: var(--ListViewItemCheckBrush, var(--TextOnAccentFillColorPrimaryBrush, #fff));
  }

  .list-selection-check.is-visible {
    transform: translate(0, -50%);
    opacity: 1;
  }

  .list-selection-check.is-checked {
    --CheckBoxCheckBackgroundFill: var(--ListViewItemCheckBoxSelectedBrush, var(--AccentFillColorDefaultBrush, var(--accent-base)));
    --CheckBoxCheckBackgroundStroke: var(--ListViewItemCheckBoxSelectedBrush, var(--AccentFillColorDefaultBrush, var(--accent-base)));
    --CheckBoxCheckGlyphForeground: var(--ListViewItemCheckBrush, var(--TextOnAccentFillColorPrimaryBrush, #fff));
  }

  .list-selection-check .checkbox-content {
    display: none;
  }

  .list-selection-check .checkbox-box {
    width: 20px;
    height: 20px;
    min-width: 20px;
    min-height: 20px;
    border-radius: var(--ListViewItemCheckBoxCornerRadius, 3px);
  }

  .list-selection-check.is-disabled .checkbox-box,
  .list-selection-check.is-disabled.is-checked .checkbox-box {
    /* The internal presenter check is not disabled when the ListView itself
       is enabled; only its input surface is inert. */
    opacity: 1;
    background: var(--CheckBoxCheckBackgroundFill);
    border-color: var(--CheckBoxCheckBackgroundStroke);
  }

  .list-selection-check.is-disabled .checkbox-glyph {
    color: var(--CheckBoxCheckGlyphForeground);
  }

  /* HorizontalAlignment is a child alignment in XAML. The message template
     is the one child that must keep its intrinsic bubble width inside the
     stretched presenter. */
  .win-list-item.message-item .win-list-item-content > .win-grid[data-horizontal-alignment='Right'],
  .win-list-item.content-stretch .win-list-item-content > .win-grid[data-horizontal-alignment='Right'],
  .win-list-item.message-right .win-list-item-content > .win-grid {
    flex: 0 1 auto;
    margin-left: auto;
  }

  .win-list-item.message-item .win-list-item-content > .win-grid[data-horizontal-alignment='Left'],
  .win-list-item.content-stretch .win-list-item-content > .win-grid[data-horizontal-alignment='Left'],
  .win-list-item.message-left .win-list-item-content > .win-grid {
    flex: 0 1 auto;
    margin-right: auto;
  }

  .win-list-item.message-item .win-list-item-content > .win-grid[data-horizontal-alignment='Right'],
  .win-list-item.message-item .win-list-item-content > .win-grid[data-horizontal-alignment='Left'] {
    max-width: 100%;
  }

  .win-list-item.message-item:hover::before,
  .win-list-item.message-item:active::before,
  .win-list-item.message-item:hover,
  .win-list-item.message-item:active {
    background: transparent !important;
  }

  .win-list-item.message-item .win-list-item-content > .win-grid > .win-stack-panel:hover,
  .win-list-item.message-item .win-list-item-content > .win-grid > .win-stack-panel:active {
    background: var(--SystemColorHighlightColor, var(--AccentFillColorDefaultBrush, var(--accent-base))) !important;
  }
</style>
