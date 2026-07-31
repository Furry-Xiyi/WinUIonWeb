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
      <slot :item="item" :index="index">
        <WinTextBlock :Text="String(item)" />
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import WinTextBlock from './WinTextBlock.vue';

const props = defineProps({
  ItemsSource: { type: [Array, Object], default: () => [] },
  ItemTemplate: { type: [String, Object, Function], default: undefined },
  Layout: { type: [String, Object], default: 'StackLayout' },
  HorizontalAlignment: { type: String, default: 'Stretch' },
  VerticalAlignment: { type: String, default: 'Top' },
  Margin: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: undefined }
});

const emit = defineEmits([
  'ElementPrepared',
  'ElementClearing',
  'ElementIndexChanged',
  'GettingFocus',
  'KeyDown'
]);

const rootRef = ref(null);

const asItemsSourceView = computed(() => {
  const source = props.ItemsSource;
  if (Array.isArray(source)) {
    return {
      Count: source.length,
      GetAt: (index) => source[index],
      IndexOf: (item) => source.indexOf(item),
      Source: source
    };
  }

  if (source && typeof source === 'object') {
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
  const layout = props.Layout;
  const source = typeof layout === 'object' && layout !== null ? layout : { Type: layout };
  const type = source.Type ?? source.type ?? source.Name ?? source.name ?? 'StackLayout';

  return {
    Type: type,
    Orientation: source.Orientation ?? source.orientation ?? 'Vertical',
    Spacing: Number(source.Spacing ?? source.spacing ?? 0),
    MinItemWidth: Number(source.MinItemWidth ?? source.minItemWidth ?? source.ItemWidth ?? source.itemWidth ?? 120),
    MinItemHeight: Number(source.MinItemHeight ?? source.minItemHeight ?? source.ItemHeight ?? source.itemHeight ?? 80),
    MinRowSpacing: Number(source.MinRowSpacing ?? source.minRowSpacing ?? source.RowSpacing ?? source.rowSpacing ?? source.Spacing ?? 0),
    MinColumnSpacing: Number(source.MinColumnSpacing ?? source.minColumnSpacing ?? source.ColumnSpacing ?? source.columnSpacing ?? source.Spacing ?? 0),
    MaximumRowsOrColumns: Number(source.MaximumRowsOrColumns ?? source.maximumRowsOrColumns ?? 0)
  };
});

const layoutClass = computed(() => {
  const layout = normalizedLayout.value;
  return [
    `layout-${layout.Type.toLowerCase()}`,
    layout.Orientation === 'Horizontal' ? 'orientation-horizontal' : 'orientation-vertical'
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

  const maxColumns = layout.MaximumRowsOrColumns;
  if (maxColumns > 0) {
    style['--items-repeater-grid-template'] = `repeat(${maxColumns}, minmax(${layout.MinItemWidth}px, 1fr))`;
  }

  if (props.Margin) style.margin = thicknessToMargin(props.Margin);
  if (props.MaxWidth !== undefined) style.maxWidth = toCssLength(props.MaxWidth);
  if (props.HorizontalAlignment === 'Left') style.justifyItems = 'start';
  if (props.HorizontalAlignment === 'Center') style.justifyItems = 'center';
  if (props.HorizontalAlignment === 'Right') style.justifyItems = 'end';
  if (props.VerticalAlignment === 'Center') style.alignItems = 'center';
  if (props.VerticalAlignment === 'Bottom') style.alignItems = 'end';

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

const onGettingFocus = (event) => emit('GettingFocus', event);
const onKeyDown = (event) => emit('KeyDown', event);

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
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  color: var(--text-primary);
}

.win-items-repeater.layout-stacklayout {
  display: flex;
  gap: var(--items-repeater-spacing);
}

.win-items-repeater.layout-stacklayout.orientation-vertical {
  flex-direction: column;
}

.win-items-repeater.layout-stacklayout.orientation-horizontal {
  flex-direction: row;
  width: max-content;
}

.win-items-repeater.layout-stacklayout.orientation-horizontal .win-items-repeater-element {
  flex: 0 0 auto;
}

.win-items-repeater.layout-uniformgridlayout {
  display: grid;
  grid-template-columns: var(--items-repeater-grid-template, repeat(auto-fill, minmax(var(--items-repeater-min-item-width), 1fr)));
  grid-auto-rows: minmax(var(--items-repeater-min-item-height), auto);
  column-gap: var(--items-repeater-column-spacing);
  row-gap: var(--items-repeater-row-spacing);
}

.win-items-repeater.layout-activityfeedlayout {
  display: grid;
  grid-template-columns: repeat(4, minmax(var(--items-repeater-min-item-width), 1fr));
  grid-auto-rows: var(--items-repeater-min-item-height);
  column-gap: var(--items-repeater-column-spacing);
  row-gap: var(--items-repeater-row-spacing);
}

.win-items-repeater.layout-activityfeedlayout .win-items-repeater-element:nth-child(6n + 3),
.win-items-repeater.layout-activityfeedlayout .win-items-repeater-element:nth-child(6n + 4) {
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
}
</style>
