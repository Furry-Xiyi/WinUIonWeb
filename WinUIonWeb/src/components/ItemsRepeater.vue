<template>
  <div
    ref="rootRef"
    class="win-items-repeater"
    :class="layoutClass"
    :style="repeaterStyle"
    role="list">
    <div
      v-for="(item, index) in items"
      :key="getItemKey(item, index)"
      class="win-items-repeater-element"
      :data-index="index"
      role="listitem"
      @focusin="onGettingFocus"
      @keydown="onKeyDown">
      <component :is="itemComponent(item, index)" />
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
import { computed, defineComponent, Fragment, getCurrentInstance, h, nextTick, onBeforeUnmount, ref, shallowRef, useAttrs, useSlots, watch } from 'vue';
import TextBlock from './TextBlock.vue';
import { getCollectionProperty, getLayoutDescriptor, getVNodeChildren } from './CollectionProperties';
import { materializeXamlVNode, resolveXamlHandler, resolveXamlValue } from './xamlRuntime';

const props = defineProps({
  ItemsSource: { type: [String, Array, Object], default: () => [] },
  ItemTemplate: { type: [String, Object, Function], default: undefined },
  Layout: { type: [String, Object], default: undefined },
  HorizontalAlignment: { type: String, default: 'Stretch' },
  VerticalAlignment: { type: String, default: 'Top' },
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

const rootRef = ref(null);
const slots = useSlots();
const attrs = useAttrs();
const instance = getCurrentInstance();
const slotNodes = shallowRef(slots.default?.() ?? []);
const itemTemplateNodes = computed(() => {
  for (const node of slotNodes.value) {
    if (getCollectionProperty(node) === 'itemTemplate') return getVNodeChildren(node);
  }
  return [];
});
const layoutNodes = computed(() => {
  for (const node of slotNodes.value) {
    if (getCollectionProperty(node) === 'layout') return getVNodeChildren(node);
  }
  return [];
});
const itemComponentCache = new Map();
const itemComponent = (item, index) => {
  const key = item && typeof item === 'object' ? item : `primitive:${index}:${String(item ?? '')}`;
  const cached = itemComponentCache.get(key);
  if (cached) return cached;
  const component = defineComponent({
  name: 'ItemsRepeaterItemTemplate',
  setup() {
    return () => {
      if (itemTemplateNodes.value.length) return h(Fragment, materializeXamlVNode(itemTemplateNodes.value, item, instance));
      const slot = slots.default;
      return slot ? h(Fragment, slot({ item, index })) : h(TextBlock, { Text: String(item ?? '') });
    };
  }
  });
  itemComponentCache.set(key, component);
  return component;
};

const asItemsSourceView = computed(() => {
  const source = resolveXamlValue(props.ItemsSource, instance);
  if (Array.isArray(source)) {
    return {
      Count: source.length,
      GetAt: (index) => source[index],
      IndexOf: (item) => source.indexOf(item),
      Source: source
    };
  }

  if (source && typeof source === 'object' && Number.isFinite(source.Count ?? source.count)) {
    const count = source.Count ?? source.count ?? 0;
    const getAt = source.GetAt ?? source.getAt;
    return {
      Count: count,
      GetAt: (index) => getAt?.call(source, index),
      IndexOf: (item) => source.IndexOf?.(item) ?? source.indexOf?.(item) ?? -1,
      Source: source
    };
  }

  return {
    Count: 0,
    GetAt: () => undefined,
    IndexOf: () => -1,
    Source: []
  };
});

const items = computed(() => {
  const view = asItemsSourceView.value;
  return Array.from({ length: view.Count }, (_, index) => view.GetAt(index));
});

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

  return {
    Type: type,
    Orientation: type === 'HorizontalStackLayout' ? 'Horizontal' : type === 'VerticalStackLayout' ? 'Vertical' : source.Orientation ?? 'Vertical',
    Spacing: Number(source.Spacing ?? 0),
    MinItemWidth: Number(source.MinItemWidth ?? source.ItemWidth ?? source.MinItemSize?.split?.(',')?.[0] ?? 0),
    MinItemHeight: Number(source.MinItemHeight ?? source.ItemHeight ?? source.MinItemSize?.split?.(',')?.[1] ?? 0),
    MinRowSpacing: Number(source.MinRowSpacing ?? source.RowSpacing ?? source.Spacing ?? 0),
    MinColumnSpacing: Number(source.MinColumnSpacing ?? source.ColumnSpacing ?? source.Spacing ?? 0),
    MaximumRowsOrColumns: Number(source.MaximumRowsOrColumns ?? 0)
  };
});

const layoutClass = computed(() => {
  const layout = normalizedLayout.value;
  const stackType = layout.Type === 'HorizontalStackLayout' || layout.Type === 'VerticalStackLayout' || layout.Type === 'StackLayout';
  const orientation = layout.Type === 'HorizontalStackLayout' ? 'Horizontal' : layout.Type === 'VerticalStackLayout' ? 'Vertical' : layout.Orientation;
  return [
    stackType ? 'layout-stacklayout' : `layout-${layout.Type.toLowerCase()}`,
    orientation === 'Horizontal' ? 'orientation-horizontal' : 'orientation-vertical'
  ];
});

const toCssLength = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  return typeof value === 'number' || /^[0-9.]+$/.test(String(value)) ? `${value}px` : String(value);
};

const thicknessToMargin = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const parts = String(value).split(',').map((part) => toCssLength(part.trim()));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return String(value);
};

const repeaterStyle = computed(() => {
  const layout = normalizedLayout.value;
  const style = {
    '--items-repeater-spacing': `${layout.Spacing}px`,
    '--items-repeater-min-item-width': `${layout.MinItemWidth}px`,
    '--items-repeater-min-item-height': `${layout.MinItemHeight}px`,
    '--items-repeater-row-spacing': `${layout.MinRowSpacing}px`,
    '--items-repeater-column-spacing': `${layout.MinColumnSpacing}px`
  };

  if (layout.Type === 'UniformGridLayout') {
    style.display = 'grid';
    style.gridAutoRows = 'minmax(var(--items-repeater-min-item-height), max-content)';
    style.gridTemplateColumns = layout.MaximumRowsOrColumns > 0
      ? `repeat(${layout.MaximumRowsOrColumns}, minmax(var(--items-repeater-min-item-width), max-content))`
      : 'repeat(auto-fill, minmax(var(--items-repeater-min-item-width), max-content))';
  }
  if (String(layout.Type).toLowerCase() === 'activityfeedlayout') {
    style.display = 'grid';
    style.gridAutoRows = 'var(--items-repeater-min-item-height)';
    style.gridTemplateColumns = 'repeat(4, minmax(var(--items-repeater-min-item-width), 1fr))';
  }

  if (props.Margin) style.margin = thicknessToMargin(props.Margin);
  if (props.Width !== undefined) style.width = toCssLength(props.Width);
  if (props.Height !== undefined) style.height = toCssLength(props.Height);
  if (props.MinWidth !== undefined) style.minWidth = toCssLength(props.MinWidth);
  if (props.MinHeight !== undefined) style.minHeight = toCssLength(props.MinHeight);
  if (props.MaxWidth !== undefined) style.maxWidth = toCssLength(props.MaxWidth);
  if (props.MaxHeight !== undefined) style.maxHeight = toCssLength(props.MaxHeight);
  if (props.HorizontalAlignment === 'Left') style.justifyItems = 'start';
  if (props.HorizontalAlignment === 'Center') style.justifyItems = 'center';
  if (props.HorizontalAlignment === 'Right') style.justifyItems = 'end';
  if (props.VerticalAlignment === 'Center') style.alignItems = 'center';
  if (props.VerticalAlignment === 'Bottom') style.alignItems = 'end';
  if (props.Visibility === 'Collapsed') style.display = 'none';
  else if (props.Visibility === 'Hidden') style.visibility = 'hidden';

  return style;
});

const getItemKey = (item, index) => {
  if (item && typeof item === 'object') {
    return item.Id ?? item.ID ?? item.id ?? item.Key ?? item.key ?? index;
  }
  return index;
};

const GetElementIndex = (element) => {
  const index = element?.dataset?.index;
  return index === undefined ? -1 : Number(index);
};

const TryGetElement = (index) => rootRef.value?.querySelector(`[data-index="${index}"]`) ?? null;
const GetOrCreateElement = (index) => TryGetElement(index);

const onGettingFocus = (event) => { emit('GettingFocus', event); resolveXamlHandler(attrs.GettingFocus, instance)?.(event); };
const onKeyDown = (event) => { emit('KeyDown', event); resolveXamlHandler(attrs.KeyDown, instance)?.(event); };

watch(items, async (newItems, oldItems) => {
  if (oldItems?.length) {
    oldItems.forEach((item, index) => {
      if (!newItems.includes(item)) emit('ElementClearing', { Element: TryGetElement(index), Index: index });
    });
  }

  await nextTick();
  newItems.forEach((item, index) => {
    emit('ElementPrepared', { Element: TryGetElement(index), Index: index, Data: item });
  });
}, { immediate: true });

onBeforeUnmount(() => {
  items.value.forEach((item, index) => {
    emit('ElementClearing', { Element: TryGetElement(index), Index: index, Data: item });
  });
});

defineExpose({
  ItemsSourceView: asItemsSourceView,
  GetElementIndex,
  TryGetElement,
  GetOrCreateElement
});
</script>

<style scoped>
.win-items-repeater {
  width: auto;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  color: var(--text-primary);
}

.win-items-repeater.layout-stacklayout {
  display: flex;
  gap: var(--items-repeater-spacing);
  align-items: flex-start;
}

.win-items-repeater.layout-stacklayout.orientation-vertical {
  flex-direction: column;
}

.win-items-repeater.layout-stacklayout.orientation-horizontal {
  flex-direction: row;
  width: max-content;
  max-width: none;
}

.win-items-repeater.layout-stacklayout.orientation-horizontal .win-items-repeater-element {
  flex: 0 0 auto;
}

.win-items-repeater.layout-uniformgridlayout {
  display: grid;
  grid-template-columns: var(--items-repeater-grid-template, repeat(auto-fill, minmax(var(--items-repeater-min-item-width), max-content)));
  grid-auto-rows: minmax(var(--items-repeater-min-item-height), max-content);
  column-gap: var(--items-repeater-column-spacing);
  row-gap: var(--items-repeater-row-spacing);
}

.win-items-repeater.layout-activityfeedlayout,
.win-items-repeater.layout-myfeedlayout {
  display: grid;
  grid-template-columns: repeat(4, minmax(var(--items-repeater-min-item-width), 1fr));
  grid-auto-rows: var(--items-repeater-min-item-height);
  column-gap: var(--items-repeater-column-spacing);
  row-gap: var(--items-repeater-row-spacing);
}

.win-items-repeater.layout-activityfeedlayout .win-items-repeater-element:nth-child(6n + 3),
.win-items-repeater.layout-activityfeedlayout .win-items-repeater-element:nth-child(6n + 4),
.win-items-repeater.layout-myfeedlayout .win-items-repeater-element:nth-child(6n + 3),
.win-items-repeater.layout-myfeedlayout .win-items-repeater-element:nth-child(6n + 4) {
  grid-column: span 2;
}

.win-items-repeater.layout-variedimagesizelayout {
  column-width: var(--items-repeater-min-item-width);
  column-gap: var(--items-repeater-column-spacing);
}

.win-items-repeater.layout-variedimagesizelayout .win-items-repeater-element {
  display: inline-block;
  width: 100%;
  break-inside: avoid;
  margin-bottom: var(--items-repeater-row-spacing);
}

.win-items-repeater-element {
  min-width: 0;
  box-sizing: border-box;
  display: block;
  overflow: visible;
}
</style>
