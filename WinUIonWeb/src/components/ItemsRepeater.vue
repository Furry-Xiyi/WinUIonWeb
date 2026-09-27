<template>
  <div
    ref="rootRef"
    v-bind="forwardedAttrs"
    class="win-items-repeater"
    :class="{ 'is-horizontal': layoutResult.horizontal }"
    :style="rootStyle" v-acrylic-brush="backgroundStyle">
    <!-- Items remain out of flow during measurement; only the layout extent
         contributes to the host's size. -->
    <div
      v-for="index in renderedIndices"
      :key="itemKey(items[index], index)"
      class="win-items-repeater-element"
      :class="{ 'is-realized': isRealized(index) }"
      :data-index="index"
      :style="elementStyle(index)"
      @focusin="onGettingFocus"
      @keydown="onKeyDown">
      <component :is="itemComponent(items[index], index)" />
    </div>
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
// @ts-nocheck The public XAML property casing is intentionally preserved.
import {
  computed,
  defineComponent,
  Fragment,
  getCurrentInstance,
  h,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowReactive,
  shallowRef,
  useAttrs,
  useSlots,
  watch
} from 'vue';
import TextBlock from './TextBlock.vue';
import { useAcrylicBrushStyle } from './AcrylicBrush';
import { vAcrylicBrush } from './acrylicBrushVisual';
import { getCollectionProperty, getLayoutDescriptor, getVNodeChildren } from './CollectionProperties';
import { xamlResourceDictionaryKey } from './Page.vue';
import { computeRepeaterLayout, measureBoxFor, normalizeLayoutKind } from './repeaterLayouts';
import {
  materializeXamlVNode,
  normalizeXamlNodes,
  resolveXamlHandler,
  resolveXamlResourceObject,
  resolveXamlValue,
  xamlItemContextKey,
  xamlNameScopeKey
} from './xamlRuntime';

const props = defineProps({
  ItemsSource: { type: [String, Array, Object], default: null },
  ItemTemplate: { type: [String, Object, Function], default: undefined },
  Layout: { type: [String, Object], default: undefined },
  HorizontalCacheLength: { type: [String, Number], default: 2 },
  VerticalCacheLength: { type: [String, Number], default: 2 },
  Background: { type: [String, Object], default: '' },
  HorizontalAlignment: { type: String, default: 'Stretch' },
  VerticalAlignment: { type: String, default: 'Stretch' },
  Margin: { type: [String, Number], default: '' },
  Width: { type: [String, Number], default: undefined },
  Height: { type: [String, Number], default: undefined },
  MinWidth: { type: [String, Number], default: undefined },
  MinHeight: { type: [String, Number], default: undefined },
  MaxWidth: { type: [String, Number], default: undefined },
  MaxHeight: { type: [String, Number], default: undefined },
  Visibility: { type: String, default: 'Visible' }
});

const emit = defineEmits([
  'ElementPrepared',
  'ElementClearing',
  'ElementIndexChanged',
  'GettingFocus',
  'KeyDown'
]);

defineOptions({ inheritAttrs: false });
const rootRef = ref(null);
const slots = useSlots();
const attrs = useAttrs();
const instance = getCurrentInstance();
const propertyOverrides = shallowRef({});
const propertyValue = (name) => name in propertyOverrides.value ? propertyOverrides.value[name] : props[name];
const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([name]) =>
  !['ElementPrepared', 'ElementClearing', 'ElementIndexChanged', 'GettingFocus', 'KeyDown'].includes(name)
)));
const pageResources = inject(xamlResourceDictionaryKey, null);
// Property-element VNodes are structural input.  Keep one stable snapshot for
// the lifetime of this repeater; bindings inside are still resolved per item.
// A slot with a single child returns that VNode rather than an array, so
// normalize here before anything indexes into it.
const initialSlotNodes = slots.default?.();
const slotNodes = shallowRef(
  Array.isArray(initialSlotNodes) ? initialSlotNodes : initialSlotNodes ? [initialSlotNodes] : []
);

const toCssLength = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  return typeof value === 'number' || /^-?\d+(?:\.\d+)?$/.test(String(value)) ? `${value}px` : String(value);
};

const thicknessToCss = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const parts = String(value).split(',').map((part) => toCssLength(part.trim()));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return String(value);
};

const alignmentValue = (value, axis) => {
  const name = String(value ?? '');
  const table = axis === 'horizontal'
    ? { Left: 'flex-start', Center: 'center', Right: 'flex-end', Stretch: 'stretch' }
    : { Top: 'flex-start', Center: 'center', Bottom: 'flex-end', Stretch: 'stretch' };
  return table[name] ?? '';
};

const resolvedNumber = (value, fallback) => {
  const resolved = resolveXamlValue(value, instance);
  if (resolved === undefined || resolved === null || resolved === '') return fallback;
  const parsed = Number(resolved);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const explicitLength = (value) => {
  const resolved = resolveXamlValue(value, instance);
  if (resolved === undefined || resolved === null || resolved === '') return null;
  const parsed = Number(resolved);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

/* ------------------------------------------------------------------ *
 * ItemsSource / ItemsSourceView
 * ------------------------------------------------------------------ */

const sourceVersion = ref(0);
const sourceData = computed(() => resolveXamlValue(propertyValue('ItemsSource'), instance));
let unsubscribeSource;
watch(sourceData, (source) => {
  unsubscribeSource?.();
  unsubscribeSource = undefined;
  if (typeof source?.addEventListener === 'function') {
    const changed = () => { sourceVersion.value += 1; };
    source.addEventListener('CollectionChanged', changed);
    unsubscribeSource = () => source.removeEventListener('CollectionChanged', changed);
  }
}, { immediate: true });
const asItemsSourceView = computed(() => {
  void sourceVersion.value;
  const source = sourceData.value;
  if (Array.isArray(source)) {
    return {
      Count: source.length,
      GetAt: (index) => source[index],
      IndexOf: (item) => source.indexOf(item),
      Source: source
    };
  }

  if (source && typeof source === 'object') {
    // ObservableVector-shaped sources expose Count/GetAt like ItemsSourceView.
    if (Number.isFinite(source.Count)) {
      const count = source.Count;
      const getAt = source.GetAt;
      return {
        Count: count,
        GetAt: (index) => getAt ? getAt.call(source, index) : source[index],
        IndexOf: (item) => source.IndexOf?.(item) ?? -1,
        Source: source
      };
    }
    if (typeof source[Symbol.iterator] === 'function') {
      const list = Array.from(source);
      return {
        Count: list.length,
        GetAt: (index) => list[index],
        IndexOf: (item) => list.indexOf(item),
        Source: list
      };
    }
  }

  return { Count: 0, GetAt: () => undefined, IndexOf: () => -1, Source: [] };
});

const items = computed(() => {
  const view = asItemsSourceView.value;
  return Array.from({ length: view.Count }, (_, index) => view.GetAt(index));
});

/* ------------------------------------------------------------------ *
 * Layout
 * ------------------------------------------------------------------ */

const layoutNodes = computed(() => {
  for (const node of slotNodes.value) {
    if (getCollectionProperty(node) === 'layout') return getVNodeChildren(node);
  }
  return [];
});

/**
 * Read the `{StaticResource Key}` marker out of a prop.  resolveXamlValue turns
 * such a marker into `var(--Key)` because that is how brush resources resolve,
 * so the raw prop value is checked first and the normalized form second.
 */
const resourceKeyOf = (raw, resolved) => {
  const marker = (value) => {
    if (typeof value !== 'string') return '';
    const staticMatch = value.trim().match(/^\{\s*(?:StaticResource|ThemeResource)\s+([^\s}]+)\s*\}$/i);
    if (staticMatch) return staticMatch[1];
    return value.trim().match(/^var\(--([^,)]+)\)$/)?.[1] ?? '';
  };
  return marker(raw) || marker(resolved);
};

/**
 * A layout may be declared inline (`<ItemsRepeater.Layout><StackLayout/></ItemsRepeater.Layout>`)
 * or as a page resource referenced by `Layout="{StaticResource Key}"`.  In the
 * resource case the node itself is the layout, so it must be read directly —
 * descending into its children would drop every layout property.
 */
const layoutDescriptor = computed(() => {
  const resourceName = resourceKeyOf(propertyValue('Layout'), resolveXamlValue(propertyValue('Layout'), instance));
  if (resourceName && pageResources?.[resourceName]) {
    const resourceNode = pageResources[resourceName];
    const typeName = typeNameOf(resourceNode);
    if (/Layout$/.test(typeName) && !/^Collection\./i.test(typeName)) {
      return getLayoutDescriptor([resourceNode]);
    }
    const nodes = getVNodeChildren(resourceNode);
    // getVNodeChildren unwraps a layout component down to its (empty) children,
    // so fall back to the node itself when nothing concrete was found.
    return getLayoutDescriptor(nodes.length ? nodes : [resourceNode]);
  }
  const boundLayout = resolveXamlValue(propertyValue('Layout'), instance);
  if (typeof boundLayout === 'object' && boundLayout !== null) return boundLayout;
  if (layoutNodes.value.length) return getLayoutDescriptor(layoutNodes.value);
  // ItemsRepeater.Layout defaults to StackLayout when it is never set.
  return { Type: 'StackLayout' };
});

const resolvedLayoutProps = computed(() => {
  const descriptor = layoutDescriptor.value ?? {};
  const resolved = {};
  for (const [key, value] of Object.entries(descriptor)) {
    resolved[key] = resolveXamlValue(value, instance);
  }
  resolved.Type = normalizeLayoutKind(resolved.Type ?? descriptor.__layoutType ?? 'StackLayout');
  return resolved;
});

/* ------------------------------------------------------------------ *
 * Item template (DataTemplate or DataTemplateSelector)
 * ------------------------------------------------------------------ */

const templateResourceKey = (value) => {
  if (typeof value !== 'string') return '';
  const marker = value.trim().match(/^\{\s*StaticResource\s+([^\s}]+)\s*\}$/i);
  if (marker) return marker[1];
  // A normalized VNode may have frozen this marker as a CSS variable.
  return value.trim().match(/^var\(--([^,)]+)\)$/)?.[1] ?? '';
};

const typeNameOf = (node) => {
  const type = node?.type;
  return typeof type === 'string' ? type : type?.name || type?.__name || '';
};

const unwrapTemplates = (nodes) => nodes.flatMap((node) => {
  if (!node) return [];
  return node.type === Fragment || /DataTemplateSelector$/i.test(typeNameOf(node))
    ? unwrapTemplates(getVNodeChildren(node))
    : [node];
});

const templateNodeKey = (node) => {
  const value = node?.props?.['x:Key'];
  return typeof value === 'string' ? value : '';
};

const templateNodesForKey = (key) => (key && pageResources?.[key] ? getVNodeChildren(pageResources[key]) : null);

const inlineTemplateCandidates = computed(() => slotNodes.value.flatMap((node) => {
  const property = getCollectionProperty(node);
  return property === 'itemTemplate' ? getVNodeChildren(node) : [];
}));

/**
 * Read a DataTemplateSelector declared as a XAML resource: its named properties
 * hold `{StaticResource Branch}` markers naming the DataTemplates it chooses
 * between.  Returns those branch names in declaration order.
 */
const selectorBranchesForKey = (key) => {
  const node = key ? pageResources?.[key] : null;
  if (!node) return null;
  const props = node.props ?? {};
  const branches = [];
  for (const [name, value] of Object.entries(props)) {
    if (name === 'x:Key') continue;
    const branchKey = templateResourceKey(resolveXamlValue(value, instance) ?? value);
    if (branchKey) branches.push({ Name: name, Key: branchKey });
  }
  return branches.length ? branches : null;
};

// A selector executes its declared SelectTemplateCore; branch names carry no
// implicit selection rule.
const makeSelectorPicker = (selectorName, branches) => {
  const selectorObject = resolveXamlResourceObject(selectorName, instance);
  if (selectorObject && typeof selectorObject.SelectTemplate === 'function') {
    return (item) => selectorObject.SelectTemplate(item);
  }
  const select = pageResources?.[selectorName]?.type?.SelectTemplateCore;
  if (typeof select === 'function') {
    return (item) => branches?.find((branch) => branch.Name === select(item))?.Key;
  }
  return null;
};

/**
 * ItemTemplate accepts a DataTemplate or a DataTemplateSelector.  A selector is
 * either supplied by the code-behind as an object exposing SelectTemplate(item)
 * -> template resource name, or declared in XAML as a resource whose named
 * properties name the templates it chooses between.  Both are the WinUI
 * contract (see StringOrIntTemplateSelector / MyDataTemplateSelector).
 */
const itemTemplateResolver = computed(() => {
  const key = resourceKeyOf(propertyValue('ItemTemplate'), resolveXamlValue(propertyValue('ItemTemplate'), instance));
  const bound = resolveXamlValue(propertyValue('ItemTemplate'), instance);
  if (bound && typeof bound.SelectTemplate === 'function') return { select: bound.SelectTemplate.bind(bound) };

  const branches = selectorBranchesForKey(key);
  const picker = makeSelectorPicker(key, branches);
  if (picker) return { select: picker };

  const fromPage = templateNodesForKey(key);
  if (fromPage) return { nodes: fromPage };

  for (const node of slotNodes.value) {
    const property = getCollectionProperty(node);
    if (property !== 'itemTemplate') continue;
    const declared = unwrapTemplates(getVNodeChildren(node)).filter((candidate) => /DataTemplate$/i.test(typeNameOf(candidate)));
    if (declared.length) {
      const selected = key ? declared.find((candidate) => templateNodeKey(candidate) === key) : declared[0];
      return { nodes: getVNodeChildren(selected ?? declared[0]) };
    }
    return { nodes: getVNodeChildren(node) };
  }

  const direct = slotNodes.value.find((node) => typeNameOf(node) === 'DataTemplate');
  if (direct) return { nodes: getVNodeChildren(direct) };
  return { nodes: null };
});

const resolveItemTemplateNodes = (item) => {
  const resolver = itemTemplateResolver.value;
  if (!resolver.select) return resolver.nodes ?? [];
  const selectedKey = resolver.select(item);
  if (typeof selectedKey !== 'string' || !selectedKey) return [];
  const fromPage = templateNodesForKey(selectedKey);
  if (fromPage) return fromPage;
  const match = inlineTemplateCandidates.value.find((candidate) => templateNodeKey(candidate) === selectedKey);
  return match ? getVNodeChildren(match) : [];
};
const itemComponentCache = new Map();

/**
 * XAML keys a realized element by identity when the ItemsSource supports
 * IKeyIndexMapping; otherwise the index identifies the container.  The DOM key
 * mirrors that so Vue reuses an element for the same item.
 */
const itemKey = (item, index) => {
  const source = asItemsSourceView.value.Source;
  if (typeof source.KeyFromIndex === 'function') return `key:${source.KeyFromIndex(index)}`;
  if (typeof item === 'object' && item !== null) return item;
  return `index:${index}:${String(item ?? '')}`;
};

const itemComponent = (item, index) => {
  const key = item && typeof item === 'object' ? item : `primitive:${index}:${String(item ?? '')}`;
  const cached = itemComponentCache.get(key);
  if (cached) return cached;
  const component = defineComponent({
    name: 'ItemsRepeaterItemTemplate',
    setup() {
      const templateInstance = getCurrentInstance();
      provide(xamlItemContextKey, item);
      provide(xamlNameScopeKey, shallowReactive({}));
      return () => {
        void sourceVersion.value;
        const nodes = resolveItemTemplateNodes(item);
        if (nodes.length) return h(Fragment, normalizeXamlNodes(materializeXamlVNode(nodes, item, templateInstance), templateInstance));
        return h(TextBlock, { Text: item && typeof item === 'object' && item.toString === Object.prototype.toString ? '' : String(item ?? '') });
      };
    }
  });
  itemComponentCache.set(key, component);
  return component;
};

/* ------------------------------------------------------------------ *
 * Measure then arrange
 * ------------------------------------------------------------------ *
 * WinUI runs a measure pass (each item reports its DesiredSize) followed by an
 * arrange pass (the layout assigns every item its rect).  The DOM needs the
 * same two phases. Measure constraints are applied and restored synchronously
 * before paint. Displayed items keep their arranged positions and the panel's
 * size comes only from the layout extent.
 */

const itemNaturals = shallowRef([]);
let isMeasuring = false;
/**
 * The viewport the repeater sits in, and which axes a surrounding ScrollViewer
 * is free to scroll.  A ScrollViewer measures its content with an infinite
 * available size on the axes it scrolls, which the repeater must reproduce.
 *
 * The scroll modes are read from the ScrollViewer's own viewport element rather
 * than from generic `overflow` heuristics: its computed overflow is the declared
 * mode and therefore stable, whereas an overflow test based on scrollWidth would
 * flip the moment this panel rendered its measure layer and send the repeater
 * into a measure loop.  Only clientWidth/clientHeight are used for the size,
 * which no descendant can influence.
 */
const hostBox = ref({ width: 0, height: 0, scrollableX: false, scrollableY: false, scrollX: 0, scrollY: 0 });
let hostObserver;
let hostResizeFrame;
let hostScrollViewport = null;
let settleObserver = null;
let settleScheduled = false;
let settleFrame;

/**
 * The nearest ancestor that actually scrolls this repeater, which is the
 * ScrollViewer's viewport element.  Its scroll offset drives realization.
 */
const findScrollHost = () => {
  let node = rootRef.value?.parentElement ?? null;
  while (node) {
    if (node.classList?.contains('win-scroll-viewer-viewport') || node.classList?.contains('win-scroll-presenter')) return node;
    node = node.parentElement;
  }
  return null;
};

/**
 * The viewport the repeater measures against: the nearest ScrollViewer viewport
 * if there is one, otherwise the first ancestor with a real width.
 *
 * Only the *nearest* viewport is consulted.  A gallery sample sits inside the
 * ControlExample display, which may itself scroll; a repeater further out would
 * then be measured against that outer viewport and lose the finite width its own
 * ScrollViewer provides.
 */
const readHostBox = () => {
  const previous = hostBox.value;
  const nearest = findScrollHost();
  if (nearest && nearest.clientWidth > 0) {
    const style = getComputedStyle(nearest);
    const scrollableX = /auto|scroll/.test(style.overflowX);
    const scrollableY = /auto|scroll/.test(style.overflowY);
    // The declared scrolling axes determine the measure constraint, including
    // before any content overflows. A finite viewport still drives realization.
    return {
      width: Math.min(nearest.clientWidth, rootRef.value?.parentElement?.clientWidth || nearest.clientWidth),
      height: nearest.clientHeight,
      scrollableX,
      scrollableY,
      scrollX: nearest.getBoundingClientRect().left - rootRef.value.getBoundingClientRect().left,
      scrollY: nearest.getBoundingClientRect().top - rootRef.value.getBoundingClientRect().top
    };
  }

  let node = rootRef.value?.parentElement ?? null;
  let fallback = null;
  while (node) {
    if (node.clientWidth > 0 && !fallback) {
      fallback = {
        width: node.clientWidth,
        height: node.clientHeight,
        scrollableX: false,
        scrollableY: false,
        scrollX: previous.scrollX,
        scrollY: previous.scrollY
      };
    }
    node = node.parentElement;
  }
  return fallback ?? previous;
};

/**
 * A scroll changes the realization rect. The window watcher measures newly
 * realized items; already measured content keeps its arranged geometry.
 */
const onHostScroll = () => {
  const node = hostScrollViewport;
  if (!node) return;
  const next = readHostBox();
  if (next.scrollX === hostBox.value.scrollX && next.scrollY === hostBox.value.scrollY) return;
  hostBox.value = next;
};

/**
 * The size the layout is offered.  An explicit Width/Height (or MaxWidth/
 * MaxHeight) pins that axis; otherwise a scrolling host makes the axis
 * infinite and a non-scrolling host supplies its real measurement.
 */
const availableSize = computed(() => {
  const maxWidth = resolvedNumber(propertyValue('MaxWidth'), Number.POSITIVE_INFINITY);
  const maxHeight = resolvedNumber(props.MaxHeight, Number.POSITIVE_INFINITY);
  const box = hostBox.value;
  const width = explicitLength(props.Width)
    ?? Math.min(maxWidth, box.scrollableX ? Number.POSITIVE_INFINITY : box.width);
  const height = explicitLength(props.Height)
    ?? Math.min(maxHeight, box.scrollableY ? Number.POSITIVE_INFINITY : box.height);
  return {
    width: Number.isFinite(width) && width > 0 ? width : Number.POSITIVE_INFINITY,
    height: Number.isFinite(height) && height > 0 ? height : Number.POSITIVE_INFINITY
  };
});

const layoutResult = computed(() => computeRepeaterLayout({
  count: items.value.length,
  naturals: itemNaturals.value,
  available: availableSize.value,
  props: resolvedLayoutProps.value
}));

/**
 * The box an item is measured in.  Grid and flow layouts measure each item in
 * the box the layout derived, so content never creates gaps; stack and column
 * layouts constrain one axis to the available size and let the other be natural.
 */
const measureBox = computed(() => measureBoxFor(
  resolvedLayoutProps.value.Type,
  resolvedLayoutProps.value,
  availableSize.value,
  layoutResult.value.itemSize ?? null
));

/**
 * The box an item is measured in.  A finite axis becomes that exact width or
 * height.  An unconstrained axis is left at `max-content` so the item reports
 * its content size — WinUI's DesiredSize is content-based, and a measure box
 * that stretched to the panel would make a grid layout derive a one-item line.
 */
const measureElementStyle = (index) => {
  const box = measureBox.value;
  const style = {
    width: 'max-content',
    height: 'auto'
  };
  if (box && Number.isFinite(box.width)) style.width = `${box.width}px`;
  if (box && Number.isFinite(box.height)) style.height = `${box.height}px`;
  if (resolvedLayoutProps.value.Type === 'ActivityFeedLayout') style.width = `${layoutResult.value.rects[index]?.width ?? box?.width ?? 0}px`;
  return style;
};

const arrangeStyle = (index) => {
  const rect = layoutResult.value.rects[index];
  if (!rect) return { display: 'none' };
  return {
    position: 'absolute',
    left: `${rect.x}px`,
    top: `${rect.y}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`
  };
};

/** Scrolling never switches visible items back to a measurement layout. */
const elementStyle = arrangeStyle;

const isRealized = (index) => Boolean(elementForIndex(index));

const backgroundStyle = useAcrylicBrushStyle(() => props.Background || undefined, instance);
const rootStyle = computed(() => {
  const result = layoutResult.value;
  const horizontal = resolvedLayoutProps.value.Type === 'StackLayout'
    ? String(resolvedLayoutProps.value.Orientation ?? 'Vertical').toLowerCase() === 'horizontal'
    : result.horizontal;
  const style = {
    ...backgroundStyle.value,
    position: 'relative',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: horizontal ? 'row' : 'column',
    alignItems: 'stretch',
    minWidth: toCssLength(resolveXamlValue(props.MinWidth, instance)),
    minHeight: toCssLength(resolveXamlValue(props.MinHeight, instance)),
    maxWidth: toCssLength(resolveXamlValue(propertyValue('MaxWidth'), instance)),
    maxHeight: toCssLength(resolveXamlValue(props.MaxHeight, instance)),
    margin: thicknessToCss(resolveXamlValue(props.Margin, instance)),
    justifySelf: alignmentValue(resolveXamlValue(props.HorizontalAlignment, instance), 'horizontal'),
    alignSelf: alignmentValue(resolveXamlValue(props.VerticalAlignment, instance), 'vertical')
  };

  const visibility = resolveXamlValue(props.Visibility, instance) ?? props.Visibility;
  if (visibility === 'Collapsed') style.display = 'none';
  else if (visibility === 'Hidden') style.visibility = 'hidden';

  const explicitWidth = toCssLength(resolveXamlValue(props.Width, instance));
  const explicitHeight = toCssLength(resolveXamlValue(props.Height, instance));
  // The panel's desired size is the layout's extent: content-sized on the major
  // axis and stretched to the available size on the minor axis, matching
  // FlowLayoutAlgorithm::Arrange's max(finalSize, extent) contract.
  style.width = explicitWidth ?? (result.horizontal || !Number.isFinite(availableSize.value.width) ? `${result.extent.width}px` : '100%');
  style.height = explicitHeight ?? `${result.extent.height}px`;
  return style;
});

/* ------------------------------------------------------------------ *
 * Realization events + public API
 * ------------------------------------------------------------------ */

const wrapperForIndex = (index) => rootRef.value?.querySelector(`:scope > [data-index="${index}"]`) ?? null;
const elementForIndex = (index) => wrapperForIndex(index)?.firstElementChild ?? null;
const GetElementIndex = (element) => {
  const wrapper = element?.closest?.('.win-items-repeater-element');
  return wrapper?.parentElement === rootRef.value ? Number(wrapper.dataset.index) : -1;
};
const TryGetElement = (index) => {
  const element = elementForIndex(index);
  return element && isRealized(index) ? element : null;
};
const forcedIndices = ref(new Set());
const GetOrCreateElement = (index) => {
  if (!Number.isInteger(index) || index < 0 || index >= items.value.length) throw new RangeError('ItemsRepeater index is outside ItemsSourceView');
  if (!TryGetElement(index)) {
    forcedIndices.value = new Set([...forcedIndices.value, index]);
    instance.update();
    void measureItems();
  }
  return TryGetElement(index);
};

let realizedElements = new Map();
const dispatch = (name, args) => {
  emit(name, args);
  resolveXamlHandler(attrs[name], instance)?.(args);
};

const raiseRealizationEvents = () => {
  const next = new Map();
  for (const index of renderedIndices.value) {
    const Element = elementForIndex(index);
    if (!Element) continue;
    const key = itemKey(items.value[index], index);
    const previous = realizedElements.get(key);
    next.set(key, { Element, Index: index });
    if (!previous || previous.Element !== Element) {
      if (previous) dispatch('ElementClearing', { Element: previous.Element });
      dispatch('ElementPrepared', { Element, Index: index });
    } else if (previous.Index !== index) dispatch('ElementIndexChanged', { Element, OldIndex: previous.Index, NewIndex: index });
  }
  for (const [key, previous] of realizedElements) if (!next.has(key)) dispatch('ElementClearing', { Element: previous.Element });
  realizedElements = next;
};

/**
 * Items report a natural size under a temporary measure constraint, and the
 * layout then arranges them. A layout that derives a uniform item box
 * needs one extra pass so content honors that box; the pass count is fixed at
 * two, so the loop always terminates.
 *
 * A template that itself grows after the first arrange — the nested-repeater
 * sample, where the inner repeater settles one frame later — is handled by the
 * settle observer below rather than by more passes here.
 */
let measureToken = 0;
let measureRunning = false;
let measureQueued = false;
const MEASURE_PASSES = 2;

/**
 * The window of items whose natural size is read this pass.  WinUI realizes only
 * the items intersecting the viewport plus a cache buffer, which is what makes a
 * 1000-item repeater cheap; every item outside the window is estimated from the
 * average measured size, exactly as StackLayout::GetAverageElementSize does.
 *
 * A scan also handles variable-height columns whose bottom edges are not
 * monotonic in item order.
 */
const VIRTUALIZE_THRESHOLD = 120;

const measureWindow = computed(() => {
  const total = items.value.length;
  if (total <= VIRTUALIZE_THRESHOLD) return { start: 0, end: total };

  const naturals = itemNaturals.value;
  const result = layoutResult.value;
  const horizontal = result.horizontal;
  const offset = horizontal ? hostBox.value.scrollX : hostBox.value.scrollY;
  const viewport = horizontal ? hostBox.value.width : hostBox.value.height;
  const cache = resolvedNumber(horizontal ? props.HorizontalCacheLength : props.VerticalCacheLength, 2);
  const buffer = Math.max(0, viewport * cache / 2);

  // Before the first measure pass finishes, nothing has a size, so the window
  // is the bounded head of the list.  The measure pass reads those items, the
  // layout positions all of them from the average, and the next pass widens the
  // window from real geometry.
  const measuredCount = naturals.reduce((count, size) => count + (size ? 1 : 0), 0);
  if (measuredCount === 0 || viewport <= 0) {
    return { start: 0, end: Math.min(total, VIRTUALIZE_THRESHOLD) };
  }

  const majorStart = (index) => {
    const rect = result.rects[index];
    if (!rect) return Number.POSITIVE_INFINITY;
    return horizontal ? rect.x : rect.y;
  };
  const majorEnd = (index) => {
    const rect = result.rects[index];
    if (!rect) return Number.POSITIVE_INFINITY;
    return horizontal ? rect.x + rect.width : rect.y + rect.height;
  };

  let start = total;
  let end = 0;
  for (let index = 0; index < total; index += 1) {
    if (majorEnd(index) >= offset - buffer && majorStart(index) <= offset + viewport + buffer) {
      start = Math.min(start, index);
      end = index + 1;
    }
  }
  return { start, end };
});

/** Indices rendered this pass, by both the measure layer and the arrange layer. */
const renderedIndices = computed(() => {
  const total = items.value.length;
  const range = measureWindow.value;
  const indices = [];
  for (let index = range.start; index < range.end && index < total; index += 1) indices.push(index);
  for (const index of forcedIndices.value) if (index < total && !indices.includes(index)) indices.push(index);
  const active = GetElementIndex(document.activeElement);
  if (active >= 0 && !indices.includes(active)) indices.push(active);
  return indices.sort((left, right) => left - right);
});

watch(renderedIndices, async (next, previous = []) => {
  if (next.length === previous.length && next.every((index, offset) => index === previous[offset])) return;
  if (next.some((index) => !itemNaturals.value[index])) {
    void measureItems();
    return;
  }
  await nextTick();
  if (!rootRef.value) return;
  raiseRealizationEvents();
  observeSettleTargets();
});

const readNaturals = (root) => {
  const total = items.value.length;
  const previous = itemNaturals.value;
  const naturals = new Array(total).fill(null);
  const elements = [...root.querySelectorAll(':scope > .win-items-repeater-element')];
  const savedStyles = elements.map((element) => element.getAttribute('style'));
  try {
    // Measure under the temporary constraint but restore the arranged rect in
    // the same JavaScript turn. A scroll frame can therefore never paint every
    // realized item at (0, 0).
    for (const element of elements) Object.assign(element.style, measureElementStyle(Number(element.dataset.index)));
    for (const element of elements) {
      const index = Number(element.dataset.index);
      if (!Number.isInteger(index) || index < 0 || index >= total) continue;
      const child = element.firstElementChild;
      if (!child) continue;
      const style = getComputedStyle(child);
      naturals[index] = {
        width: child.offsetWidth + (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0),
        height: child.offsetHeight + (parseFloat(style.marginTop) || 0) + (parseFloat(style.marginBottom) || 0)
      };
    }
  } finally {
    elements.forEach((element, index) => {
      if (savedStyles[index] === null) element.removeAttribute('style');
      else element.setAttribute('style', savedStyles[index]);
    });
  }
  // Items outside the realization window keep their previous measurement, so an
  // item that scrolls out of the cache still occupies the same slot.
  for (let index = 0; index < total; index += 1) {
    if (!naturals[index] && previous[index]) naturals[index] = previous[index];
  }
  return naturals;
};

const naturalsDiffer = (next, previous) => next.length !== previous.length
  || next.some((size, index) => {
    const prior = previous[index];
    if (!size || !prior) return Boolean(size) !== Boolean(prior);
    return Math.abs(prior.width - size.width) > 0.5 || Math.abs(prior.height - size.height) > 0.5;
  });

const runMeasure = async () => {
  const token = ++measureToken;
  isMeasuring = true;
  try {
    for (let pass = 0; pass < MEASURE_PASSES; pass += 1) {
      await nextTick();
      if (token !== measureToken) return;
      const root = rootRef.value;
      if (!root) break;
      const naturals = readNaturals(root);
      const changed = naturalsDiffer(naturals, itemNaturals.value);
      itemNaturals.value = naturals;
      if (!changed) break;
    }
  } finally {
    isMeasuring = false;
  }
  await nextTick();
  if (token !== measureToken) return;
  raiseRealizationEvents();
  observeSettleTargets();
};

const measureItems = async () => {
  if (measureRunning) { measureQueued = true; return; }
  measureRunning = true;
  try {
    do {
      measureQueued = false;
      await runMeasure();
    } while (measureQueued);
  } finally {
    measureRunning = false;
  }
};

const layoutSignature = computed(() => JSON.stringify({
  type: resolvedLayoutProps.value.Type,
  props: resolvedLayoutProps.value,
  width: availableSize.value.width,
  height: availableSize.value.height,
  template: propertyValue('ItemTemplate')
}));

watch(layoutSignature, () => { itemNaturals.value = []; void measureItems(); });
watch(items, (next, previous = []) => {
  const measurements = new Map(previous.map((item, index) => [item, itemNaturals.value[index]]));
  itemNaturals.value = next.map((item) => measurements.get(item) ?? null);
  forcedIndices.value = new Set();
  const keys = new Set(next.map((item, index) => item && typeof item === 'object' ? item : `primitive:${index}:${String(item ?? '')}`));
  for (const key of itemComponentCache.keys()) if (!keys.has(key)) itemComponentCache.delete(key);
  void measureItems();
});

onMounted(() => {
  hostScrollViewport = findScrollHost();
  hostBox.value = readHostBox();
  hostScrollViewport?.addEventListener('scroll', onHostScroll, { passive: true });
  const host = rootRef.value?.parentElement;
  if (host && typeof ResizeObserver === 'function') {
    // Only the viewport's own box matters, and clientWidth/Height cannot be
    // affected by this panel's subtree, so the observer is inherently stable.
    hostObserver = new ResizeObserver(() => {
      cancelAnimationFrame(hostResizeFrame);
      hostResizeFrame = requestAnimationFrame(() => {
        const next = readHostBox();
        if (next.width !== hostBox.value.width
          || next.height !== hostBox.value.height
          || next.scrollableX !== hostBox.value.scrollableX
          || next.scrollableY !== hostBox.value.scrollableY) {
          hostBox.value = { ...next, scrollX: hostBox.value.scrollX, scrollY: hostBox.value.scrollY };
          void measureItems();
        }
      });
    });
    hostObserver.observe(host);
  }
  if (typeof ResizeObserver === 'function' && rootRef.value) {
    // A template can settle after the arrange pass — the nested-repeater sample
    // is the common case, where the inner repeater reports its extent one frame
    // after the outer one measured it.  Each realized item is observed so a
    // template that grows afterwards re-runs the measure pass, and the pass stops
    // as soon as the reported naturals match what the layout already arranged.
    settleObserver = new ResizeObserver(() => {
      if (isMeasuring || settleScheduled) return;
      settleScheduled = true;
      settleFrame = requestAnimationFrame(() => {
        settleScheduled = false;
        if (isMeasuring) return;
        const root = rootRef.value;
        if (!root) return;
        const naturals = readNaturals(root);
        if (naturalsDiffer(naturals, itemNaturals.value)) void measureItems();
      });
    });
    observeSettleTargets();
  }
  void measureItems();
});

/** Re-point the settle observer at the currently rendered items. */
const observeSettleTargets = () => {
  if (!settleObserver || !rootRef.value) return;
  settleObserver.disconnect();
  for (const element of rootRef.value.querySelectorAll(':scope > .win-items-repeater-element')) {
    if (element.firstElementChild) settleObserver.observe(element.firstElementChild);
  }
};

const onGettingFocus = (event) => {
  const args = { OldFocusedElement: event.relatedTarget, NewFocusedElement: event.target, OriginalSource: event.target };
  dispatch('GettingFocus', args);
  if (args.NewFocusedElement !== event.target) args.NewFocusedElement?.focus({ preventScroll: true });
};
const onKeyDown = (event) => {
  const args = { Key: event.key, Handled: false, OriginalSource: event.target, NativeEvent: event };
  dispatch('KeyDown', args);
  if (args.Handled) event.preventDefault();
  else if (['ArrowUp', 'ArrowDown'].includes(event.key) && event.target.matches('button')) {
    const target = GetElementIndex(event.target) + (event.key === 'ArrowUp' ? -1 : 1);
    if (target >= 0 && target < items.value.length) {
      event.preventDefault();
      GetOrCreateElement(target)?.focus({ preventScroll: true });
    }
  }
};

onBeforeUnmount(() => {
  measureToken += 1;
  unsubscribeSource?.();
  hostObserver?.disconnect();
  cancelAnimationFrame(hostResizeFrame);
  settleObserver?.disconnect();
  cancelAnimationFrame(settleFrame);
  hostScrollViewport?.removeEventListener('scroll', onHostScroll);
  for (const entry of realizedElements.values()) dispatch('ElementClearing', { Element: entry.Element });
  realizedElements.clear();
});

const dependencyProperty = (name) => computed({
  get: () => resolveXamlValue(propertyValue(name), instance),
  set: (value) => { propertyOverrides.value = { ...propertyOverrides.value, [name]: value }; }
});
const publicItemsSourceView = computed(() => ({
  ...asItemsSourceView.value,
  HasKeyIndexMapping: typeof sourceData.value?.KeyFromIndex === 'function' && typeof sourceData.value?.IndexFromKey === 'function',
  KeyFromIndex: (index) => sourceData.value?.KeyFromIndex?.(index),
  IndexFromKey: (key) => sourceData.value?.IndexFromKey?.(key) ?? -1
}));
defineExpose({
  ItemsSourceView: publicItemsSourceView,
  ItemsSource: dependencyProperty('ItemsSource'),
  ItemTemplate: dependencyProperty('ItemTemplate'),
  Layout: dependencyProperty('Layout'),
  MaxWidth: dependencyProperty('MaxWidth'),
  GetElementIndex,
  TryGetElement,
  GetOrCreateElement
});
</script>

<style scoped>
.win-items-repeater {
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  flex-shrink: 0;
  color: var(--text-primary);
  /* Every rect — including the gutters — comes from the layout, so the panel
     must not add any spacing or gap of its own. */
}

.win-items-repeater-element {
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  /* A layout that stretches an item along the minor axis (StackLayout) relies
     on the item filling the rect the layout arranged. */
  display: grid;
  overflow: hidden;
}

.win-items-repeater-element > :deep(*) {
  min-width: 0;
  min-height: 0;
}

</style>
