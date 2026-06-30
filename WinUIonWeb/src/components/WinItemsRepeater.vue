<template>
  <div
    class="win-items-repeater"
    :class="layoutClass"
    :style="containerStyle"
    ref="containerRef"
  >
    <div
      v-for="(item, index) in visibleItems"
      :key="getItemKey(item, index)"
      :data-index="item.originalIndex"
      class="repeater-item"
      :style="getItemStyle(item, index)"
      @focusin="handleFocusIn"
      @keydown="handleKeyDown"
    >
      <slot :item="item.data" :index="item.originalIndex">
        {{ item.data }}
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';

const props = defineProps({
  // 官方属性：ItemsSource
  itemsSource: {
    type: [Array, Object],
    default: null
  },
  // 官方属性：Layout (StackLayout | UniformGridLayout)
  layout: {
    type: String,
    default: 'StackLayout',
    validator: (value) => ['StackLayout', 'UniformGridLayout'].includes(value)
  },
  // Layout方向 (Vertical | Horizontal)
  orientation: {
    type: String,
    default: 'Vertical',
    validator: (value) => ['Vertical', 'Horizontal'].includes(value)
  },
  // UniformGridLayout特定属性
  itemWidth: {
    type: Number,
    default: 100
  },
  itemHeight: {
    type: Number,
    default: 100
  },
  minimumItemSpacing: {
    type: Number,
    default: 0
  },
  // 官方属性：HorizontalAlignment
  horizontalAlignment: {
    type: String,
    default: 'Left',
    validator: (value) => ['Left', 'Center', 'Right', 'Stretch'].includes(value)
  },
  // 官方属性：VerticalAlignment
  verticalAlignment: {
    type: String,
    default: 'Top',
    validator: (value) => ['Top', 'Center', 'Bottom', 'Stretch'].includes(value)
  },
  // 官方属性：Margin
  margin: {
    type: [String, Number, Object],
    default: '0'
  },
  // 官方属性：MaxWidth
  maxWidth: {
    type: Number,
    default: Infinity
  },
  // 虚拟化配置
  enableVirtualization: {
    type: Boolean,
    default: true
  },
  overscanCount: {
    type: Number,
    default: 3
  },
  // 自定义key生成器
  keyExtractor: {
    type: Function,
    default: null
  }
});

const emit = defineEmits([
  'elementPrepared',    // 官方事件：ElementPrepared
  'elementClearing',    // 官方事件：ElementClearing
  'elementIndexChanged', // 官方事件：ElementIndexChanged
  'gettingFocus',       // 官方事件：GettingFocus
  'keyDown'             // 官方事件：KeyDown
]);

const containerRef = ref(null);
const scrollTop = ref(0);
const scrollLeft = ref(0);
const containerHeight = ref(0);
const containerWidth = ref(0);
const elementCache = new Map();

// 计算布局类名
const layoutClass = computed(() => {
  const classes = [`layout-${props.layout.toLowerCase()}`];
  if (props.layout === 'StackLayout') {
    classes.push(`orientation-${props.orientation.toLowerCase()}`);
  }
  return classes;
});

// 计算容器样式
const containerStyle = computed(() => {
  const styles = {};

  // Margin
  if (typeof props.margin === 'string') {
    styles.margin = props.margin;
  } else if (typeof props.margin === 'number') {
    styles.margin = `${props.margin}px`;
  } else if (typeof props.margin === 'object') {
    styles.margin = `${props.margin.top || 0}px ${props.margin.right || 0}px ${props.margin.bottom || 0}px ${props.margin.left || 0}px`;
  }

  // MaxWidth
  if (props.maxWidth !== Infinity) {
    styles.maxWidth = `${props.maxWidth}px`;
  }

  // HorizontalAlignment
  if (props.horizontalAlignment === 'Center') {
    styles.marginLeft = 'auto';
    styles.marginRight = 'auto';
  } else if (props.horizontalAlignment === 'Right') {
    styles.marginLeft = 'auto';
  } else if (props.horizontalAlignment === 'Stretch') {
    styles.width = '100%';
  }

  // VerticalAlignment
  if (props.verticalAlignment === 'Center') {
    styles.marginTop = 'auto';
    styles.marginBottom = 'auto';
  } else if (props.verticalAlignment === 'Bottom') {
    styles.marginTop = 'auto';
  } else if (props.verticalAlignment === 'Stretch') {
    styles.height = '100%';
  }

  return styles;
});

// 获取ItemsSourceView
const itemsSourceView = computed(() => {
  if (!props.itemsSource) {
    return { count: 0, items: [] };
  }

  if (Array.isArray(props.itemsSource)) {
    return {
      count: props.itemsSource.length,
      items: props.itemsSource,
      getAt: (index) => props.itemsSource[index]
    };
  }

  // 支持自定义ItemsSourceView对象
  if (props.itemsSource.count !== undefined && props.itemsSource.getAt) {
    return props.itemsSource;
  }

  return { count: 0, items: [] };
});

// 计算可见项（虚拟化）
const visibleItems = computed(() => {
  const view = itemsSourceView.value;
  if (view.count === 0) return [];

  // 如果禁用虚拟化，返回所有项
  if (!props.enableVirtualization) {
    return view.items.map((data, index) => ({
      data,
      originalIndex: index
    }));
  }

  // 虚拟化计算
  const { start, end } = getVisibleRange();
  const items = [];

  for (let i = start; i <= end && i < view.count; i++) {
    items.push({
      data: view.getAt ? view.getAt(i) : view.items[i],
      originalIndex: i
    });
  }

  return items;
});

// 计算可见范围（虚拟化）
const getVisibleRange = () => {
  if (props.layout === 'StackLayout') {
    return getStackLayoutVisibleRange();
  } else {
    return getUniformGridLayoutVisibleRange();
  }
};

const getStackLayoutVisibleRange = () => {
  const isVertical = props.orientation === 'Vertical';
  const scroll = isVertical ? scrollTop.value : scrollLeft.value;
  const containerSize = isVertical ? containerHeight.value : containerWidth.value;
  const itemSize = isVertical ? props.itemHeight : props.itemWidth;

  if (itemSize === 0 || containerSize === 0) {
    return { start: 0, end: Math.min(props.overscanCount * 2, itemsSourceView.value.count - 1) };
  }

  const start = Math.max(0, Math.floor(scroll / itemSize) - props.overscanCount);
  const end = Math.min(
    itemsSourceView.value.count - 1,
    Math.ceil((scroll + containerSize) / itemSize) + props.overscanCount
  );

  return { start, end };
};

const getUniformGridLayoutVisibleRange = () => {
  const isVertical = props.orientation === 'Vertical';
  const scroll = isVertical ? scrollTop.value : scrollLeft.value;
  const containerSize = isVertical ? containerHeight.value : containerWidth.value;
  const itemSize = isVertical ? props.itemHeight : props.itemWidth;
  const crossSize = isVertical ? containerWidth.value : containerHeight.value;

  if (itemSize === 0 || containerSize === 0 || crossSize === 0) {
    return { start: 0, end: Math.min(props.overscanCount * 2, itemsSourceView.value.count - 1) };
  }

  const itemsPerRow = Math.floor(crossSize / (itemSize + props.minimumItemSpacing));
  const rowSize = itemSize + props.minimumItemSpacing;

  const startRow = Math.max(0, Math.floor(scroll / rowSize) - props.overscanCount);
  const endRow = Math.ceil((scroll + containerSize) / rowSize) + props.overscanCount;

  const start = Math.max(0, startRow * itemsPerRow);
  const end = Math.min(itemsSourceView.value.count - 1, endRow * itemsPerRow + itemsPerRow - 1);

  return { start, end };
};

// 获取项样式
const getItemStyle = (item, index) => {
  if (props.layout === 'UniformGridLayout') {
    return {
      width: `${props.itemWidth}px`,
      height: `${props.itemHeight}px`,
      margin: `${props.minimumItemSpacing / 2}px`
    };
  }
  return {};
};

// 获取项key
const getItemKey = (item, index) => {
  if (props.keyExtractor) {
    return props.keyExtractor(item.data, item.originalIndex);
  }

  // 默认key策略
  if (item.data && typeof item.data === 'object') {
    if (item.data.id !== undefined) return `item-${item.data.id}`;
    if (item.data.key !== undefined) return `item-${item.data.key}`;
  }

  return `item-${item.originalIndex}`;
};

// 官方方法：GetElementIndex
const getElementIndex = (element) => {
  if (!element) return -1;
  const index = element.dataset.index;
  return index !== undefined ? parseInt(index) : -1;
};

// 官方方法：TryGetElement
const tryGetElement = (index) => {
  if (!containerRef.value) return null;
  const element = containerRef.value.querySelector(`[data-index="${index}"]`);
  return element || null;
};

// 官方方法：GetOrCreateElement
const getOrCreateElement = (index) => {
  const existing = tryGetElement(index);
  if (existing) return existing;

  // 触发ElementPrepared事件
  emit('elementPrepared', { index });

  return null; // Vue会自动创建元素
};

// 滚动监听（用于虚拟化）
const handleScroll = () => {
  if (!containerRef.value) return;

  const parent = containerRef.value.parentElement;
  if (parent && parent.classList.contains('win-scroll-viewer')) {
    scrollTop.value = parent.scrollTop;
    scrollLeft.value = parent.scrollLeft;
  }
};

// 尺寸监听
const resizeObserver = ref(null);
const setupResizeObserver = () => {
  if (!containerRef.value) return;

  resizeObserver.value = new ResizeObserver((entries) => {
    for (const entry of entries) {
      containerHeight.value = entry.contentRect.height;
      containerWidth.value = entry.contentRect.width;
    }
  });

  resizeObserver.value.observe(containerRef.value);

  const parent = containerRef.value.parentElement;
  if (parent && parent.classList.contains('win-scroll-viewer')) {
    resizeObserver.value.observe(parent);
  }
};

// 焦点事件
const handleFocusIn = (event) => {
  emit('gettingFocus', event);
};

// 键盘事件
const handleKeyDown = (event) => {
  emit('keyDown', event);
};

// 监听ItemsSource变化
watch(() => props.itemsSource, (newVal, oldVal) => {
  // 清理旧元素缓存
  elementCache.clear();

  // 触发ElementClearing事件
  if (oldVal) {
    emit('elementClearing');
  }
}, { deep: true });

// 监听可见项变化
watch(visibleItems, (newItems, oldItems) => {
  if (!oldItems) return;

  const oldIndices = new Set(oldItems.map(item => item.originalIndex));
  const newIndices = new Set(newItems.map(item => item.originalIndex));

  // 检测索引变化
  newItems.forEach(item => {
    if (!oldIndices.has(item.originalIndex)) {
      emit('elementPrepared', { index: item.originalIndex });
    }
  });

  oldItems.forEach(item => {
    if (!newIndices.has(item.originalIndex)) {
      emit('elementClearing', { index: item.originalIndex });
    }
  });
});

onMounted(() => {
  setupResizeObserver();

  // 设置滚动监听
  if (containerRef.value && containerRef.value.parentElement) {
    const parent = containerRef.value.parentElement;
    if (parent.classList.contains('win-scroll-viewer')) {
      parent.addEventListener('scroll', handleScroll, { passive: true });
    }
  }

  // 初始化尺寸
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight;
    containerWidth.value = containerRef.value.clientWidth;
  }
});

onBeforeUnmount(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }

  if (containerRef.value && containerRef.value.parentElement) {
    const parent = containerRef.value.parentElement;
    if (parent.classList.contains('win-scroll-viewer')) {
      parent.removeEventListener('scroll', handleScroll);
    }
  }

  elementCache.clear();
});

// 暴露官方方法
defineExpose({
  getElementIndex,
  tryGetElement,
  getOrCreateElement,
  itemsSourceView
});
</script>

<style scoped>
.win-items-repeater {
  display: flex;
  position: relative;
  width: 100%;
}

/* StackLayout - Vertical */
.win-items-repeater.layout-stacklayout.orientation-vertical {
  flex-direction: column;
}

/* StackLayout - Horizontal */
.win-items-repeater.layout-stacklayout.orientation-horizontal {
  flex-direction: row;
}

/* UniformGridLayout */
.win-items-repeater.layout-uniformgridlayout {
  flex-wrap: wrap;
  align-content: flex-start;
}

/* 项容器 */
.repeater-item {
  flex-shrink: 0;
}

/* StackLayout项 */
.layout-stacklayout .repeater-item {
  width: 100%;
}

.layout-stacklayout.orientation-horizontal .repeater-item {
  width: auto;
}

/* UniformGridLayout项 */
.layout-uniformgridlayout .repeater-item {
  box-sizing: border-box;
}

/* 性能优化 */
.win-items-repeater {
  contain: layout style paint;
  will-change: transform;
}

.repeater-item {
  contain: layout style paint;
}
</style>
