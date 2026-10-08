<template>
  <div
    ref="rootRef"
    class="win-items-view"
    :class="prepareRender()"
    :style="rootStyle"
    v-acrylic-brush="backgroundStyle"
    :dir="flowDirection === 'RightToLeft' ? 'rtl' : 'ltr'"
    role="listbox"
    :aria-disabled="!isEnabled"
    :aria-multiselectable="isMultiSelectMode || undefined"
    @pointerdown.capture="captureModifiers"
    @keydown.capture="captureModifiers"
    @keyup.capture="captureModifiers"
    @keydown="onNavigationKeyDown">
    <!-- DefaultItemsViewStyle's ControlTemplate: a ScrollView hosting a single,
         top-aligned ItemsRepeater inset by the control's Padding. -->
    <ScrollView
      ref="scrollViewRef"
      class="win-items-view-scroll"
      HorizontalAnchorRatio="NaN"
      VerticalScrollMode="Auto"
      VerticalScrollBarVisibility="Auto"
      HorizontalScrollMode="Auto"
      HorizontalScrollBarVisibility="Auto"
      ContentOrientation="{x:Bind ScrollContentOrientation, Mode=OneWay}"
      Height="{x:Bind ScrollTemplateHeight, Mode=OneWay}"
      IsEnabled="{x:Bind ScrollTemplateIsEnabled, Mode=OneWay}"
      IsTabStop="False">
      <div ref="repeaterRef" class="win-items-view-repeater" :class="layoutClass" :style="repeaterStyle">
        <!-- The ItemsRepeater realizes one element per item. The DataTemplate's
             ItemContainer root is that element, so layout geometry is handed to
             the container instead of to an extra wrapper. -->
        <ItemsOutlet />
      </div>
    </ScrollView>
  </div>
</template>

<script>
import { CollectionItemTemplate, CollectionLayout } from './CollectionProperties'

export default {
  ItemTemplate: CollectionItemTemplate,
  Layout: CollectionLayout
}
</script>

<script setup>
import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, toRaw, useAttrs, useSlots, watch } from 'vue';
import ScrollView from './ScrollView.vue';
import TextBlock from './TextBlock.vue';
import { useAcrylicBrushStyle } from './AcrylicBrush';
import { vAcrylicBrush } from './acrylicBrushVisual';
import { getCollectionProperty, getLayoutDescriptor, getVNodeChildren } from './CollectionProperties';
import { itemsViewItemContextKey, itemContainerControllerKey, itemsViewElementKey } from './ItemsViewState';
import { xamlResourceDictionaryKey } from './Page.vue';
import { materializeXamlVNode, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlItemContextKey, xamlScopeKey } from './xamlRuntime';

const props = defineProps({
  ItemsSource: { type: [String, Array, Object], default: () => [] },
  ItemTemplate: { type: [String, Object, Function], default: undefined },
  ItemTemplateSelector: { type: [String, Object, Function], default: undefined },
  Layout: { type: [String, Object], default: 'StackLayout' },
  SelectionMode: {
    type: String,
    default: 'Single',
    validator: (value) => typeof value === 'string' && (value.startsWith('{') || ['None', 'Single', 'Multiple', 'Extended'].includes(value))
  },
  SelectedItem: { type: null, default: undefined },
  SelectedItems: { type: [String, Array], default: () => [] },
  IsItemInvokedEnabled: { type: [Boolean, String], default: false },
  IsEnabled: { type: [Boolean, String], default: true },
  IsTabStop: { type: [Boolean, String], default: true },
  TabNavigation: { type: String, default: 'Once' },
  FlowDirection: { type: String, default: 'LeftToRight' },
  Width: { type: [String, Number], default: undefined },
  Height: { type: [String, Number], default: undefined },
  MinWidth: { type: [String, Number], default: undefined },
  MinHeight: { type: [String, Number], default: undefined },
  MaxWidth: { type: [String, Number], default: undefined },
  MaxHeight: { type: [String, Number], default: undefined },
  Margin: { type: [String, Number], default: '' },
  Padding: { type: [String, Number], default: '' },
  Background: { type: [String, Object], default: 'Transparent' },
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
const slots = useSlots();
const instance = getCurrentInstance();
const rootRef = ref(null);
const scrollViewRef = ref(null);
provide(xamlScopeKey, { ...inject(xamlScopeKey, {}), get ScrollContentOrientation() { return isStackLayout.value && normalizedLayout.value.Orientation === 'Horizontal' ? 'Horizontal' : 'Vertical' }, get ScrollTemplateHeight() { return scrollTemplateHeight.value; }, get ScrollTemplateIsEnabled() { return isEnabled.value } });
const repeaterRef = ref(null);
const flowDirection = computed(() => resolveXamlValue(props.FlowDirection, instance));

// Read structural slots in the owning render. Calling the slot in setup loses
// its dependency tracking and prevents bound Layout/DataTemplate changes.
const slotNodes = shallowRef([]);
const prepareRender = () => {
  slotNodes.value = slots.default?.() ?? [];
  return { disabled: !isEnabled.value };
};

const pageResources = inject(xamlResourceDictionaryKey, null);
const typeNameOf = (node) => {
  const type = node?.type;
  return typeof type === 'string' ? type : type?.name || type?.__name || '';
};
const directChildren = (node) => {
  if (!node) return [];
  if (Array.isArray(node.children)) return node.children;
  if (node.children && typeof node.children === 'object') {
    const slot = node.children.default;
    return typeof slot === 'function' ? slot() : [];
  }
  return [];
};
const templateKeyOf = (node) => {
  const props_ = node?.props ?? {};
  const key = props_['x:Key'] ?? props_['x:key'] ?? props_.Key ?? props_.key;
  return typeof key === 'string' ? key : '';
};
const selectedTemplateKey = computed(() => {
  const value = resolveXamlValue(props.ItemTemplate, instance);
  if (typeof value !== 'string') return '';
  const resource = value.match(/^\{\s*StaticResource\s+([^\s}]+)\s*\}$/i);
  if (resource) return resource[1];
  // A normalized VNode may have materialized this marker as a CSS variable.
  const cssVariable = value.match(/^var\(--([^,)]+)\)$/);
  if (cssVariable) return cssVariable[1];
  // A page may bind ItemTemplate to a resource name (the Gallery's swappable
  // layout sample does this through a x:Bind), so accept a bare key too.
  return pageResources?.[value] ? value : '';
});
const itemTemplateNodes = computed(() => {
  for (const node of slotNodes.value) {
    if (getCollectionProperty(node) === 'itemTemplate') {
      const candidates = getVNodeChildren(node);
      const key = selectedTemplateKey.value;
      const templates = candidates.filter((candidate) => /DataTemplate$/i.test(typeNameOf(candidate)));
      if (templates.length) {
        const selected = key ? templates.find((candidate) => templateKeyOf(candidate) === key) : templates[0];
        return getVNodeChildren(selected ?? templates[0]);
      }
      return candidates;
    }
  }
  return [];
});
const layoutNodes = computed(() => {
  for (const node of slotNodes.value) {
    if (getCollectionProperty(node) === 'layout') return getVNodeChildren(node);
  }
  return [];
});

// Official defaults: StackLayout has no default Spacing; UniformGridLayout
// defaults Orientation to Horizontal, MinItemWidth/MinItemHeight to NaN (so the
// first realized item decides the effective size), both spacings to 0, and
// MaximumRowsOrColumns to -1 (unlimited); LinedFlowLayout defaults LineHeight to
// NaN (content driven) and falls back to a 1.0 aspect ratio when no
// ItemsInfoRequested handler supplies one.
const normalizedLayout = computed(() => {
  const boundLayout = resolveXamlValue(props.Layout, instance);
  const boundDescriptor = typeof boundLayout === 'object' && boundLayout !== null ? boundLayout : null;
  const matchingNode = layoutNodes.value.find((node) => typeNameOf(node) === boundLayout);
  const rawLayout = boundDescriptor
    ?? (matchingNode ? getLayoutDescriptor([matchingNode]) : layoutNodes.value.length ? getLayoutDescriptor([layoutNodes.value[0]]) : boundLayout);
  const source = typeof rawLayout === 'object' && rawLayout !== null
    ? Object.fromEntries(Object.entries(rawLayout).map(([key, value]) => [key, resolveXamlValue(value, instance)]))
    : { Type: rawLayout };

  return {
    Type: source.Type ?? 'StackLayout',
    Orientation: source.Orientation ?? (source.Type === 'UniformGridLayout' ? 'Horizontal' : 'Vertical'),
    Spacing: Number(source.Spacing ?? 0),
    MinItemWidth: source.MinItemWidth === undefined ? NaN : Number(source.MinItemWidth),
    MinItemHeight: source.MinItemHeight === undefined ? NaN : Number(source.MinItemHeight),
    MinRowSpacing: Number(source.MinRowSpacing ?? 0),
    MinColumnSpacing: Number(source.MinColumnSpacing ?? 0),
    ItemsStretch: source.ItemsStretch ?? 'None',
    ItemsJustification: source.ItemsJustification ?? 'Start',
    MaximumRowsOrColumns: source.MaximumRowsOrColumns === undefined ? -1 : Number(source.MaximumRowsOrColumns),
    LineHeight: source.LineHeight === undefined ? NaN : Number(source.LineHeight),
    LineSpacing: Number(source.LineSpacing ?? 0),
    MinItemSpacing: Number(source.MinItemSpacing ?? 0)
  };
});

const layoutType = computed(() => normalizedLayout.value.Type);
const isStackLayout = computed(() => layoutType.value === 'StackLayout');
const isUniformGridLayout = computed(() => layoutType.value === 'UniformGridLayout');
const isLinedFlowLayout = computed(() => layoutType.value === 'LinedFlowLayout');
const layoutClass = computed(() => [
  `layout-${layoutType.value.toLowerCase()}`,
  normalizedLayout.value.Orientation === 'Horizontal' ? 'orientation-horizontal' : 'orientation-vertical',
  normalizedLayout.value.ItemsStretch === 'Fill' ? 'items-stretch-fill' : ''
]);

const repeaterStyle = computed(() => {
  const layout = normalizedLayout.value;
  const style = {
    '--items-view-spacing': `${layout.Spacing}px`,
    '--items-view-min-item-width': Number.isNaN(layout.MinItemWidth) ? '0px' : `${layout.MinItemWidth}px`,
    '--items-view-min-item-height': Number.isNaN(layout.MinItemHeight) ? '0px' : `${layout.MinItemHeight}px`,
    '--items-view-row-spacing': `${layout.MinRowSpacing}px`,
    '--items-view-column-spacing': `${layout.MinColumnSpacing}px`,
    '--items-view-line-height': Number.isNaN(layout.LineHeight) ? 'auto' : `${layout.LineHeight}px`,
    '--items-view-line-spacing': `${layout.LineSpacing}px`,
    '--items-view-min-item-spacing': `${layout.MinItemSpacing}px`
  };
  // DefaultItemsViewStyle applies Padding as the repeater's Margin inside
  // PART_ScrollView, so it participates in the scrollable content extent.
  style.margin = xamlThickness(resolveXamlValue(props.Padding, instance));
  if (isUniformGridLayout.value) Object.assign(style, uniformGridStyle.value);
  return style;
});

const resolvedSelectionMode = computed(() => resolveXamlValue(props.SelectionMode, instance) ?? 'Single');
const isSelectionEnabled = computed(() => resolvedSelectionMode.value !== 'None');
const isMultiSelectMode = computed(() => resolvedSelectionMode.value === 'Multiple' || resolvedSelectionMode.value === 'Extended');
const resolvedIsItemInvokedEnabled = computed(() => resolveXamlValue(props.IsItemInvokedEnabled, instance) === true);
const isEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance) !== false);

const localItemsSource = shallowRef(undefined);
const items = computed(() => {
  const source = localItemsSource.value ?? resolveXamlValue(props.ItemsSource, instance);
  return Array.isArray(source) ? source : [];
});
watch(() => resolveXamlValue(props.ItemsSource, instance), () => { localItemsSource.value = undefined; });

const cssLength = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  return typeof value === 'number' || /^-?\d+(?:\.\d+)?$/.test(String(value)) ? `${value}px` : String(value);
};
const xamlThickness = (value) => {
  const parts = String(value ?? '').split(',').map((part) => cssLength(part.trim())).filter(Boolean);
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return undefined;
};
// A horizontal repeater reports its desired cross-axis size to the template.
// ScrollPresenter content is absolutely positioned; percentage Height alone
// cannot propagate that size through an Auto-sized StackPanel slot.
const scrollTemplateHeight = computed(() => {
  const height = resolveXamlValue(props.Height, instance);
  const autoHeight = height === undefined || height === null || height === '' || height === 'Auto';
  if (!autoHeight || !isStackLayout.value || normalizedLayout.value.Orientation !== 'Horizontal') return '100%';
  const minHeight = Math.max(0, Number(resolveXamlValue(props.MinHeight, instance)) || 0);
  const maxHeight = Number(resolveXamlValue(props.MaxHeight, instance));
  const desiredHeight = Math.max(minHeight, repeaterDesiredHeight.value);
  return Number.isFinite(maxHeight) && maxHeight > 0 ? Math.max(minHeight, Math.min(maxHeight, desiredHeight)) : desiredHeight;
});

const backgroundStyle = useAcrylicBrushStyle(() => props.Background === 'Transparent' ? undefined : props.Background || undefined, instance);
const rootStyle = computed(() => {
  const borderWidth = xamlThickness(resolveXamlValue(props.BorderThickness, instance));
  return {
    width: cssLength(resolveXamlValue(props.Width, instance)),
    height: cssLength(resolveXamlValue(props.Height, instance)),
    minWidth: cssLength(resolveXamlValue(props.MinWidth, instance)),
    minHeight: cssLength(isStackLayout.value && normalizedLayout.value.Orientation === 'Horizontal' && typeof scrollTemplateHeight.value === 'number'
      ? scrollTemplateHeight.value
      : resolveXamlValue(props.MinHeight, instance)),
    maxWidth: cssLength(resolveXamlValue(props.MaxWidth, instance)),
    maxHeight: cssLength(resolveXamlValue(props.MaxHeight, instance)),
    margin: xamlThickness(resolveXamlValue(props.Margin, instance)),
    borderColor: resolveXamlValue(props.BorderBrush, instance) || undefined,
    borderWidth,
    borderStyle: borderWidth ? 'solid' : undefined,
    borderRadius: cssLength(resolveXamlValue(props.CornerRadius, instance)),
    ...backgroundStyle.value
  };
});

// SelectionModel tracks indices, not data equality: two occurrences of the
// same brush/string are independent selectable elements. Stable records retain
// each UIElement's selection and focus when the source collection is reordered.
let realizationKey = 0;
const createRecord = item => ({ item, key: ++realizationKey });
const realizedItems = shallowRef(items.value.map(createRecord));
const selectedIndices = ref([]);
const selectedItemsValue = computed(() => selectedIndices.value.map(index => realizedItems.value[index]?.item));
function isSameItem(left, right) { return toRaw(left) === toRaw(right); }
const indicesFromValues = values => {
  const used = new Set();
  return values.flatMap(value => {
    const index = realizedItems.value.findIndex((entry, candidate) => !used.has(candidate) && isSameItem(entry.item, value));
    if (index < 0) return [];
    used.add(index);
    return [index];
  });
};
const boundSelection = computed(() => {
  const boundSelectedItems = resolveXamlValue(props.SelectedItems, instance);
  const list = Array.isArray(boundSelectedItems) ? boundSelectedItems : [];
  if (resolvedSelectionMode.value === 'Single') {
    const boundSelectedItem = resolveXamlValue(props.SelectedItem, instance);
    return boundSelectedItem === undefined ? list : [boundSelectedItem];
  }
  return list;
});
watch(boundSelection, selected => {
  const indices = indicesFromValues(selected.filter(item => item != null));
  selectedIndices.value = resolvedSelectionMode.value === 'Single' ? indices.slice(0, 1) : indices;
}, { immediate: true });
const isSelectedIndex = index => selectedIndices.value.includes(index);

// --- LinedFlowLayout measurement -------------------------------------------
// The layout measures each item with an infinite width at the actual line
// height, so a template that pins a Width — or an Image with a fixed Height and
// a known natural ratio — reports the desired width the layout then scales.
const naturalImageSizes = new Map();
// The image dimensions arrive asynchronously, so bump a version counter to
// invalidate the cached template metrics once a ratio becomes known.
const imageMetricsVersion = ref(0);
const itemWidthCache = new Map();
const templateMetricsFor = (item) => {
  // Reading the version keeps the cached metrics reactive to late image loads.
  void imageMetricsVersion.value;
  const cached = itemWidthCache.get(item);
  if (cached) return cached;
  let width = NaN;
  let minWidth = 0;
  let maxWidth = Infinity;
  let aspectRatio = NaN;
  const scope = item && typeof item === 'object' ? { item, Item: item, ...item } : { item };
  const readNumber = (value) => {
    if (value === undefined || value === null || value === '') return NaN;
    const number = Number(resolveXamlValue(value, instance, scope));
    return Number.isFinite(number) ? number : NaN;
  };
  const visit = (nodes) => {
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue;
      const nodeProps = node.props ?? {};
      const declaredWidth = readNumber(nodeProps.Width);
      const declaredHeight = readNumber(nodeProps.Height);
      const declaredMinWidth = readNumber(nodeProps.MinWidth);
      const declaredMaxWidth = readNumber(nodeProps.MaxWidth);
      if (Number.isFinite(declaredWidth)) width = Number.isFinite(width) ? Math.max(width, declaredWidth) : declaredWidth;
      if (Number.isFinite(declaredMinWidth)) minWidth = Math.max(minWidth, declaredMinWidth);
      if (Number.isFinite(declaredMaxWidth)) maxWidth = Math.min(maxWidth, declaredMaxWidth);
      // An Image with no explicit Width reports its natural ratio at the line
      // height, which is what LinedFlowLayout then scales.
      if (!Number.isFinite(declaredWidth) && /image/i.test(typeNameOf(node))) {
        const source = nodeProps.Source ? resolveXamlValue(nodeProps.Source, instance, scope) : '';
        const natural = typeof source === 'string' ? naturalImageSizes.get(source) : null;
        if (natural?.height) {
          const ratio = natural.width / natural.height;
          if (Number.isFinite(ratio) && ratio > 0 && !Number.isFinite(aspectRatio)) aspectRatio = ratio;
        }
      }
      visit(directChildren(node));
    }
  };
  visit(activeTemplateNodes.value);
  const metrics = { width, minWidth, maxWidth, aspectRatio };
  itemWidthCache.set(item, metrics);
  return metrics;
};

const repeaterWidth = ref(0);
const repeaterDesiredHeight = ref(0);
let repeaterObserver;
let repeaterMeasureFrame;
const measureImageRatios = () => {
  const urls = new Set();
  for (const item of items.value) {
    if (item && typeof item === 'object' && typeof item.ImageLocation === 'string' && item.ImageLocation) urls.add(item.ImageLocation);
  }
  for (const url of urls) {
    if (naturalImageSizes.has(url)) continue;
    naturalImageSizes.set(url, null);
    const image = new Image();
    image.onload = () => {
      naturalImageSizes.set(url, { width: image.naturalWidth, height: image.naturalHeight });
      itemWidthCache.clear();
      imageMetricsVersion.value += 1;
    };
    image.src = url;
  }
};

// LinedFlowLayout packing: lines fill greedily at each item's desired width,
// overflowing lines shrink by a shared factor, and — with ItemsStretch=Fill —
// every line but the last expands to exactly fill the available width. This
// mirrors ComputeItemsLayoutRegularPath with ComputeLineExpandFactor and
// ComputeLineShrinkFactor.
const linedFlowLines = computed(() => {
  const layout = normalizedLayout.value;
  const availableWidth = repeaterWidth.value;
  const spacing = layout.MinItemSpacing;
  const lineHeight = Number.isNaN(layout.LineHeight) ? 0 : layout.LineHeight;
  if (!availableWidth || !lineHeight || !items.value.length) return [];

  const metrics = items.value.map((item) => templateMetricsFor(item));
  const desiredWidths = metrics.map((metric) => {
    if (Number.isFinite(metric.width) && metric.width > 0) return Math.max(metric.width, metric.minWidth);
    if (Number.isFinite(metric.aspectRatio) && metric.aspectRatio > 0) return metric.aspectRatio * lineHeight;
    return lineHeight;
  });
  const clampWidth = (value, metric) => {
    let result = Math.max(metric.minWidth, value);
    if (Number.isFinite(metric.maxWidth)) result = Math.min(metric.maxWidth, result);
    return result;
  };

  const packed = [];
  let line = [];
  let lineWidth = 0;
  desiredWidths.forEach((desiredWidth, index) => {
    if (line.length && lineWidth + spacing + desiredWidth > availableWidth) {
      packed.push({ start: line[0], count: line.length, width: lineWidth });
      line = [];
      lineWidth = 0;
    }
    lineWidth += (line.length ? spacing : 0) + desiredWidth;
    line.push(index);
  });
  if (line.length) packed.push({ start: line[0], count: line.length, width: lineWidth });

  const stretchFill = layout.ItemsStretch === 'Fill';
  return packed.map((entry, lineIndex) => {
    const indices = Array.from({ length: entry.count }, (_, offset) => entry.start + offset);
    const spacings = entry.count > 1 ? (entry.count - 1) * spacing : 0;
    const contentWidth = entry.width - spacings;
    const isLast = lineIndex === packed.length - 1;
    let scale = 1;

    if (contentWidth > 0 && entry.width > availableWidth) {
      const shrink = (availableWidth - spacings) / contentWidth;
      // Items whose MinWidth would be violated keep their desired width.
      if (indices.every((index) => clampWidth(desiredWidths[index] * shrink, metrics[index]) === desiredWidths[index] * shrink)) {
        scale = shrink;
      }
    } else if (contentWidth > 0 && stretchFill && !isLast && entry.width < availableWidth) {
      const ignored = new Set();
      let budget = availableWidth - spacings;
      let base = contentWidth;
      let expand = 1;
      for (let guard = 0; guard <= indices.length; guard += 1) {
        if (base <= 0) break;
        expand = budget / base;
        let restart = false;
        for (const index of indices) {
          if (ignored.has(index)) continue;
          const desired = desiredWidths[index] * expand;
          if (Number.isFinite(metrics[index].maxWidth) && metrics[index].maxWidth < desired) {
            budget -= metrics[index].maxWidth;
            base -= desiredWidths[index];
            ignored.add(index);
            restart = true;
          }
        }
        if (!restart) break;
      }
      if (expand > 1) scale = expand;
    }

    const itemWidths = indices.map((index) => clampWidth(desiredWidths[index] * scale, metrics[index]));
    return { start: entry.start, count: entry.count, itemWidths, lineHeight };
  });
});

const linedFlowStyleFor = (index) => {
  const line = linedFlowLines.value.find((entry) => index >= entry.start && index < entry.start + entry.count);
  if (!line) return undefined;
  const width = line.itemWidths[index - line.start];
  return { width: `${width}px`, height: `${line.lineHeight}px`, flex: `0 0 ${width}px` };
};

// UniformGridLayout geometry. The layout derives one effective item size from
// the first realized element, caps the line at MaximumRowsOrColumns (or at how
// many whole items fit), and — with ItemsStretch=Fill — spreads the leftover
// whole pixels across the line. A CSS auto-fill track cannot express the item
// cap, so the grid's column template is resolved here.
const uniformGridStyle = computed(() => {
  const layout = normalizedLayout.value;
  const availableWidth = repeaterWidth.value;
  const spacing = layout.MinColumnSpacing;
  const minItemWidth = Number.isNaN(layout.MinItemWidth) ? 0 : layout.MinItemWidth;
  const metrics = items.value.length ? templateMetricsFor(items.value[0]) : { width: NaN, minWidth: 0 };
  let itemWidth = minItemWidth > 0 ? minItemWidth : metrics.width;
  if (!Number.isFinite(itemWidth) || itemWidth <= 0) itemWidth = 150;

  let itemsPerLine = Math.max(1, layout.MaximumRowsOrColumns > 0 ? layout.MaximumRowsOrColumns : Number.MAX_SAFE_INTEGER);
  if (availableWidth > 0) {
    const fit = Math.floor((availableWidth + spacing) / (itemWidth + spacing));
    itemsPerLine = Math.min(itemsPerLine, Math.max(1, fit));
  }
  if (itemsPerLine === Number.MAX_SAFE_INTEGER) itemsPerLine = 1;

  let columnWidth = itemWidth;
  if (layout.ItemsStretch === 'Fill' && availableWidth > 0) {
    // CalculateExtraPixelsInLine distributes the whole leftover pixels across
    // the line so every column grows by the same integer amount.
    const usedSpace = itemsPerLine * (itemWidth + spacing) - spacing;
    const remainingSpace = Math.trunc(availableWidth - usedSpace);
    columnWidth = itemWidth + Math.trunc(remainingSpace / itemsPerLine);
  }

  const style = { '--items-view-uniform-column': `${columnWidth}px` };
  if (layout.ItemsStretch === 'Fill' && availableWidth > 0) {
    style.gridTemplateColumns = `repeat(${itemsPerLine}, ${columnWidth}px)`;
  } else {
    style.gridTemplateColumns = `repeat(${itemsPerLine}, minmax(${itemWidth}px, max-content))`;
  }
  return style;
});

// The active layout owns each realized element's box.
const containerGeometry = (index) => isLinedFlowLayout.value ? linedFlowStyleFor(index) : undefined;

// ItemsView keeps a single current element and redirects focus back to it.
const currentItemIndex = ref(-1);
const selectionAnchorIndex = ref(-1);
const modifierState = { ctrl: false, shift: false };
const captureModifiers = event => {
  modifierState.ctrl = Boolean(event.ctrlKey || event.metaKey);
  modifierState.shift = Boolean(event.shiftKey);
};
const clearModifiers = () => { modifierState.ctrl = false; modifierState.shift = false; };
const itemEnabled = index => {
  const item = realizedItems.value[index]?.item;
  if (!isEnabled.value || item == null) return false;
  return typeof item !== 'object' || (item.IsEnabled !== false && item.IsEnabled !== 'False');
};
const focusable = index => {
  const item = realizedItems.value[index]?.item;
  if (!itemEnabled(index)) return false;
  return typeof item !== 'object' || (item.IsTabStop !== false && item.IsTabStop !== 'False'
    && item.Visibility !== 'Collapsed' && item.Visibility !== 'Hidden');
};
const itemTabIndex = index => {
  if (!focusable(index) || resolveXamlValue(props.IsTabStop, instance) === false
    || (!isSelectionEnabled.value && !resolvedIsItemInvokedEnabled.value)) return -1;
  const current = focusable(currentItemIndex.value) ? currentItemIndex.value
    : realizedItems.value.findIndex((_, candidate) => focusable(candidate));
  return index === current ? 0 : -1;
};
const normalizedIndices = values => [...new Set(values.filter(index => Number.isInteger(index)
  && index >= 0 && index < realizedItems.value.length))].sort((left, right) => left - right);
const raiseSelectionChanged = (indices, originalSource, previous = null) => {
  const oldRecords = previous?.records ?? realizedItems.value;
  const oldIndices = previous?.indices ?? selectedIndices.value;
  const nextIndices = normalizedIndices(indices);
  const oldSelected = oldIndices.map(index => oldRecords[index]).filter(Boolean);
  const nextSelected = nextIndices.map(index => realizedItems.value[index]);
  const addedRecords = nextSelected.filter(entry => !oldSelected.includes(entry));
  const removedRecords = oldSelected.filter(entry => !nextSelected.includes(entry));
  selectedIndices.value = nextIndices;
  if (!addedRecords.length && !removedRecords.length) return;
  const newSelection = nextSelected.map(entry => entry.item);
  const args = { AddedItems: addedRecords.map(entry => entry.item), RemovedItems: removedRecords.map(entry => entry.item),
    SelectedItems: newSelection, OriginalSource: originalSource };
  emit('update:SelectedItems', newSelection);
  emit('update:SelectedItem', newSelection[0] ?? null);
  updateXamlBinding(props.SelectedItem, newSelection[0] ?? null, instance);
  updateXamlBinding(props.SelectedItems, newSelection, instance);
  const sender = instance?.exposeProxy ?? instance?.proxy;
  emit('SelectionChanged', sender, args);
  resolveXamlHandler(attrs.SelectionChanged, instance)?.(sender, args);
};
const indexRange = (anchor, index) => Array.from({ length: Math.abs(index - anchor) + 1 },
  (_, offset) => Math.min(anchor, index) + offset);

// SingleSelector.OnInteractedAction
const selectSingle = (index, ctrl) => {
  raiseSelectionChanged(ctrl && isSelectedIndex(index) ? [] : [index], realizedItems.value[index].item);
  selectionAnchorIndex.value = index;
};
// MultipleSelector.OnInteractedAction
const selectMultiple = (index, shift) => {
  const current = selectedIndices.value;
  const item = realizedItems.value[index].item;
  if (shift) {
    const anchor = selectionAnchorIndex.value;
    if (anchor >= 0 && isSelectedIndex(anchor) !== isSelectedIndex(index)) {
      const range = indexRange(anchor, index);
      raiseSelectionChanged(isSelectedIndex(anchor) ? [...current, ...range] : current.filter(value => !range.includes(value)), item);
    }
    return;
  }
  raiseSelectionChanged(isSelectedIndex(index) ? current.filter(value => value !== index) : [...current, index], item);
  selectionAnchorIndex.value = index;
};
// ExtendedSelector.OnInteractedAction
const selectExtended = (index, ctrl, shift) => {
  const item = realizedItems.value[index].item;
  if (shift) {
    const anchor = selectionAnchorIndex.value;
    if (anchor >= 0) raiseSelectionChanged(indexRange(anchor, index), item);
    return;
  }
  if (ctrl) raiseSelectionChanged(isSelectedIndex(index) ? selectedIndices.value.filter(value => value !== index)
    : [...selectedIndices.value, index], item);
  else if (!isSelectedIndex(index)) raiseSelectionChanged([index], item);
  selectionAnchorIndex.value = index;
};
const selectItem = (index, { ctrl = false, shift = false } = {}) => {
  if (!isSelectionEnabled.value || !itemEnabled(index)) return;
  if (resolvedSelectionMode.value === 'Single') selectSingle(index, ctrl);
  else if (resolvedSelectionMode.value === 'Multiple') selectMultiple(index, shift);
  else selectExtended(index, ctrl, shift);
};
const onFocusedAction = (index, { ctrl = false, shift = false } = modifierState) => {
  if (!focusable(index)) return;
  currentItemIndex.value = index;
  if (!isSelectionEnabled.value) return;
  const item = realizedItems.value[index].item;
  if (resolvedSelectionMode.value === 'Single') {
    if (!ctrl) raiseSelectionChanged([index], item);
  } else if (resolvedSelectionMode.value === 'Multiple') {
    const anchor = selectionAnchorIndex.value;
    if (shift && anchor >= 0) {
      const range = indexRange(anchor, index);
      raiseSelectionChanged(isSelectedIndex(anchor) ? [...selectedIndices.value, ...range]
        : selectedIndices.value.filter(value => !range.includes(value)), item);
    }
  } else if (shift) {
    const anchor = selectionAnchorIndex.value;
    if (anchor >= 0) raiseSelectionChanged(ctrl ? [...selectedIndices.value, ...indexRange(anchor, index)] : indexRange(anchor, index), item);
  } else if (!ctrl) {
    raiseSelectionChanged([index], item);
    selectionAnchorIndex.value = index;
  }
};

// Select(index) operates on SelectionModel even while the control is disabled.
const selectProgrammatically = index => {
  if (!Number.isInteger(index) || index < 0 || index >= realizedItems.value.length) return;
  const indices = resolvedSelectionMode.value === 'Single' ? [index] : [...selectedIndices.value, index];
  raiseSelectionChanged(indices, realizedItems.value[index].item);
  selectionAnchorIndex.value = index;
};

// ItemsView.CanRaiseItemInvoked
const canRaiseItemInvoked = trigger => {
  if (!isEnabled.value || !resolvedIsItemInvokedEnabled.value) return false;
  if (!isSelectionEnabled.value && trigger === 'DoubleTap') return false;
  if (isSelectionEnabled.value && (trigger === 'Tap' || trigger === 'SpaceKey')) return false;
  return true;
};
const raiseItemInvoked = (item, trigger, originalSource) => {
  if (!canRaiseItemInvoked(trigger)) return;
  const args = { InvokedItem: item, OriginalSource: originalSource, InteractionTrigger: trigger };
  const sender = instance?.exposeProxy ?? instance?.proxy;
  emit('ItemInvoked', sender, args);
  resolveXamlHandler(attrs.ItemInvoked, instance)?.(sender, args);
};
const handleContainerItemInvoked = (index, trigger, event) => {
  if (!itemEnabled(index)) return;
  const item = realizedItems.value[index].item;
  if (['PointerReleased', 'EnterKey', 'SpaceKey'].includes(trigger)) {
    currentItemIndex.value = index;
    selectItem(index, { ctrl: Boolean(event?.ctrlKey || event?.metaKey), shift: Boolean(event?.shiftKey) });
  } else if (trigger !== 'Tap' && trigger !== 'DoubleTap') return;
  if (trigger !== 'PointerReleased' && canRaiseItemInvoked(trigger)) raiseItemInvoked(item, trigger, event?.target);
};

// Each occurrence supplies its own geometry and controller. ItemContainer's
// existing item-based callbacks are scoped to this realized element's index.
const RealizedItem = defineComponent({
  name: 'ItemsViewItemTemplate',
  props: { Entry: { type: Object, required: true } },
  setup(itemProps) {
    const index = () => realizedItems.value.findIndex(entry => entry.key === itemProps.Entry.key);
    let preparedSelection = false;
    const onElementPrepared = node => {
      if (preparedSelection || !isSelectionEnabled.value) return;
      preparedSelection = true;
      const item = itemProps.Entry.item;
      const scope = item && typeof item === 'object' ? { item, Item: item, ...item } : { item, Item: item };
      const declared = item && typeof item === 'object' ? item.IsSelected : undefined;
      const initiallySelected = declared === true || declared === 'True'
        || (node?.props?.IsSelected !== undefined && resolveXamlValue(node.props.IsSelected, instance, scope) === true);
      if (initiallySelected) selectProgrammatically(index());
    };
    provide(xamlItemContextKey, itemProps.Entry.item);
    provide(itemsViewItemContextKey, {
      get index() { return index(); },
      geometry: () => containerGeometry(index()),
      tabIndex: () => itemTabIndex(index())
    });
    provide(itemContainerControllerKey, {
      isEnabled: () => itemEnabled(index()),
      isSelected: () => isSelectedIndex(index()),
      selectionMode: () => resolvedSelectionMode.value,
      multiSelectMode: () => resolvedSelectionMode.value,
      canUserInvoke: () => resolvedIsItemInvokedEnabled.value,
      canUserSelect: () => isSelectionEnabled.value,
      isCurrent: () => index() === currentItemIndex.value,
      setCurrent: (_item, options) => {
        currentItemIndex.value = index();
        if (!options?.preserveSelection) onFocusedAction(index());
      },
      itemInvoked: (_item, trigger, event) => handleContainerItemInvoked(index(), trigger, event)
    });
    return () => {
      const item = itemProps.Entry.item;
      const nodes = activeTemplateNodes.value;
      if (nodes.length) {
        const materialized = materializeXamlVNode(nodes, item, instance);
        if (!preparedSelection) {
          const root = materialized[0];
          if (root) {
            const previous = root.props?.onVnodeMounted;
            root.props = { ...root.props, onVnodeMounted: vnode => { previous?.(vnode); onElementPrepared(vnode); } };
          }
        }
        return h(Fragment, materialized);
      }
      if (typeof item?.[itemsViewElementKey] === 'function') {
        const element = item[itemsViewElementKey]();
        if (!preparedSelection) {
          const previous = element.props?.onVnodeMounted;
          element.props = { ...element.props, onVnodeMounted: vnode => { previous?.(vnode); onElementPrepared(vnode); } };
        }
        return element;
      }
      if (isVNode(item)) return item;
      return h(TextBlock, { Text: String(item ?? '') });
    };
  }
});
const ItemsOutlet = defineComponent({
  name: 'ItemsViewItemsOutlet',
  setup() { return () => h(Fragment, realizedItems.value.map(entry => h(RealizedItem, { Entry: entry, key: entry.key }))); }
});

const activeTemplateNodes = computed(() => {
  const key = selectedTemplateKey.value;
  if (key && pageResources?.[key]) return getVNodeChildren(pageResources[key]);
  if (key) {
    // A layout swap also swaps the DataTemplate the sample pairs with it.
    const layoutTemplate = pageResources?.[`${layoutType.value}ItemTemplate`];
    if (layoutTemplate) return getVNodeChildren(layoutTemplate);
  }
  return itemTemplateNodes.value;
});

watch(resolvedSelectionMode, () => { selectionAnchorIndex.value = -1; });
watch(items, () => {
  itemWidthCache.clear();
  measureImageRatios();
}, { immediate: true });

onMounted(() => {
  window.addEventListener('keydown', captureModifiers);
  window.addEventListener('keyup', captureModifiers);
  window.addEventListener('blur', clearModifiers);
  const element = repeaterRef.value;
  if (!element) return;
  const update = () => {
    repeaterWidth.value = element.clientWidth;
    const style = getComputedStyle(element);
    repeaterDesiredHeight.value = element.offsetHeight + (parseFloat(style.marginTop) || 0) + (parseFloat(style.marginBottom) || 0);
  };
  update();
  repeaterObserver = new ResizeObserver(() => {
    if (repeaterMeasureFrame !== undefined) return;
    // Publishing the new height can resize the containing ScrollView.
    // Arrange it in the next frame, outside ResizeObserver delivery.
    repeaterMeasureFrame = requestAnimationFrame(() => {
      repeaterMeasureFrame = undefined;
      update();
    });
  });
  repeaterObserver.observe(element);
});
onBeforeUnmount(() => {
  repeaterObserver?.disconnect();
  if (repeaterMeasureFrame !== undefined) cancelAnimationFrame(repeaterMeasureFrame);
  window.removeEventListener('keydown', captureModifiers);
  window.removeEventListener('keyup', captureModifiers);
  window.removeEventListener('blur', clearModifiers);
});

// Match occurrences by identity in source order. Reorder preserves the actual
// control object, while removing its occurrence clears selection and current.
const reconcileItems = next => {
  const previousRecords = realizedItems.value;
  if (next.length === previousRecords.length && next.every((item, index) => isSameItem(item, previousRecords[index].item))) return;
  const oldIndices = [...selectedIndices.value];
  const currentRecord = previousRecords[currentItemIndex.value];
  const anchorRecord = previousRecords[selectionAnchorIndex.value];
  const pools = new Map();
  for (const entry of previousRecords) {
    const identity = toRaw(entry.item);
    const pool = pools.get(identity) ?? [];
    pool.push(entry);
    pools.set(identity, pool);
  }
  const nextRecords = next.map(item => pools.get(toRaw(item))?.shift() ?? createRecord(item));
  realizedItems.value = nextRecords;
  const retainedIndices = oldIndices.map(index => nextRecords.indexOf(previousRecords[index])).filter(index => index >= 0);
  raiseSelectionChanged(retainedIndices, null, { records: previousRecords, indices: oldIndices });
  currentItemIndex.value = currentRecord ? nextRecords.indexOf(currentRecord) : -1;
  selectionAnchorIndex.value = anchorRecord ? nextRecords.indexOf(anchorRecord) : -1;
};
watch(() => [...items.value], reconcileItems);
const focusItem = async index => {
  currentItemIndex.value = index;
  await nextTick();
  const element = repeaterRef.value?.children[index];
  element?.focus?.({ preventScroll: true });
  element?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
};
const onNavigationKeyDown = event => {
  if (event.defaultPrevented || !isEnabled.value || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
  const horizontal = normalizedLayout.value.Orientation === 'Horizontal';
  if (isStackLayout.value && (horizontal ? ['ArrowUp', 'ArrowDown'].includes(event.key) : ['ArrowLeft', 'ArrowRight'].includes(event.key))) return;
  const candidates = realizedItems.value.map((_, index) => index).filter(focusable);
  if (!candidates.length) return;
  let position = candidates.indexOf(currentItemIndex.value);
  if (event.key === 'Home') position = 0;
  else if (event.key === 'End') position = candidates.length - 1;
  else {
    let delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    if (horizontal && flowDirection.value === 'RightToLeft') delta *= -1;
    position = Math.max(0, Math.min(candidates.length - 1, position + delta));
  }
  const index = candidates[position];
  event.preventDefault();
  onFocusedAction(index, { ctrl: Boolean(event.ctrlKey || event.metaKey), shift: Boolean(event.shiftKey) });
  focusItem(index);
};

defineExpose({
  get ItemsSource() { return items.value; },
  set ItemsSource(value) {
    const source = Array.isArray(value) ? value : [];
    reconcileItems(source);
    localItemsSource.value = source;
  },
  get SelectedItem() { return selectedItemsValue.value[0] ?? null; },
  set SelectedItem(value) {
    if (value == null) raiseSelectionChanged([], null);
    else {
      const index = realizedItems.value.findIndex(entry => isSameItem(entry.item, value));
      if (index >= 0) selectProgrammatically(index);
    }
  },
  SelectedItems: selectedItemsValue,
  CurrentItemIndex: currentItemIndex,
  ScrollView: scrollViewRef,
  Select: selectProgrammatically,
  Deselect: index => {
    if (isSelectedIndex(index)) raiseSelectionChanged(selectedIndices.value.filter(value => value !== index), realizedItems.value[index]?.item);
  },
  IsSelected: isSelectedIndex,
  SelectAll: () => raiseSelectionChanged(realizedItems.value.map((_, index) => index), null),
  DeselectAll: () => raiseSelectionChanged([], null)
});
</script>

<style scoped>
.win-items-view {
  display: block;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  border-style: solid;
  border-width: 0;
  color: var(--TextFillColorPrimaryBrush, var(--text-primary));
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  font-size: var(--ControlContentThemeFontSize, 14px);
  line-height: 20px;
}

.win-items-view.disabled {
  opacity: var(--ItemContainerDisabledOpacity, .3);
}

.win-items-view-scroll {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}

.win-items-view-repeater {
  display: block;
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  flex: 0 0 auto;
  align-self: stretch;
  /* The ItemsRepeater is top-aligned inside the ScrollView. */
  vertical-align: top;
}

/* StackLayout measures each element with the full available size and arranges
   it at its own desired size, so items keep their intrinsic width. */
.win-items-view-repeater.layout-stacklayout {
  display: flex;
  flex-direction: column;
  gap: var(--items-view-spacing);
  align-items: flex-start;
  width: auto;
}

.win-items-view-repeater.layout-stacklayout.orientation-horizontal {
  flex-direction: row;
  width: max-content;
}

.win-items-view-repeater.layout-stacklayout > * {
  flex: 0 0 auto;
  max-width: 100%;
  min-width: 0;
}

/* UniformGridLayout flows items along the minor axis and wraps at
   MaximumRowsOrColumns. The column template is resolved in script because a CSS
   auto-fill track cannot express the item cap. */
.win-items-view-repeater.layout-uniformgridlayout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--items-view-min-item-width, 0px), max-content));
  grid-auto-rows: minmax(var(--items-view-min-item-height, 0px), max-content);
  column-gap: var(--items-view-column-spacing);
  row-gap: var(--items-view-row-spacing);
  width: auto;
  justify-content: start;
  align-content: start;
}

.win-items-view-repeater.layout-uniformgridlayout > * {
  min-width: 0;
  min-height: 0;
  width: 100%;
  align-self: stretch;
}

/* LinedFlowLayout computes its own line packing, so the per-item width and
   height arrive as inline styles and the flow only lays out finished lines. */
.win-items-view-repeater.layout-linedflowlayout {
  display: flex;
  flex-wrap: wrap;
  gap: var(--items-view-line-spacing) var(--items-view-min-item-spacing);
  width: auto;
  align-content: start;
}

.win-items-view-repeater.layout-linedflowlayout > * {
  min-width: 0;
  overflow: hidden;
}
</style>
