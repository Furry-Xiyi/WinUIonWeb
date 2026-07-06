<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, useSlots } from 'vue'

export interface PivotItem {
  header: string
  content?: string
  disabled?: boolean
}

// Props - 完全对齐官方API
const props = defineProps<{
  title?: string
  selectedIndex?: number
  selectedItem?: PivotItem
  isLocked?: boolean
  isHeaderItemsCarouselEnabled?: boolean
  headerTemplate?: any
  minHeight?: number
}>()

// Emits - 完全对齐官方事件
const emit = defineEmits<{
  selectionChanged: [index: number, item: PivotItem]
  pivotItemLoading: [index: number, item: PivotItem]
  pivotItemLoaded: [index: number, item: PivotItem]
  pivotItemUnloading: [index: number, item: PivotItem]
  pivotItemUnloaded: [index: number, item: PivotItem]
  'update:selectedIndex': [index: number]
  'update:selectedItem': [item: PivotItem]
}>()

// Slots for PivotItems
const slots = useSlots()

// 内部状态
const internalSelectedIndex = ref(props.selectedIndex ?? 0)
const headerContainerRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
const headerRefs = ref<HTMLElement[]>([])
const items = ref<PivotItem[]>([])
const isAnimating = ref(false)
const hoveredIndex = ref<number | null>(null)
const pressedIndex = ref<number | null>(null)

// 从slots中提取PivotItems
onMounted(() => {
  updateItemsFromSlots()
  updateIndicator()
})

// 提取items
const updateItemsFromSlots = () => {
  if (!slots.default) return

  const slotContent = slots.default()
  items.value = slotContent
    .filter((vnode: any) => vnode.type?.name === 'WinPivotItem' || vnode.props)
    .map((vnode: any) => ({
      header: vnode.props?.header || vnode.props?.Header || '',
      content: vnode.children,
      disabled: vnode.props?.disabled || vnode.props?.Disabled || false
    }))

  // 确保selectedIndex有效
  if (internalSelectedIndex.value >= items.value.length) {
    internalSelectedIndex.value = Math.max(0, items.value.length - 1)
  }
}

// Watch selectedIndex prop
watch(() => props.selectedIndex, (newIndex) => {
  if (newIndex !== undefined && newIndex !== internalSelectedIndex.value) {
    selectTab(newIndex)
  }
})

// Watch selectedItem prop
watch(() => props.selectedItem, (newItem) => {
  if (newItem) {
    const index = items.value.findIndex(item => item === newItem)
    if (index !== -1 && index !== internalSelectedIndex.value) {
      selectTab(index)
    }
  }
})

// 选择Tab
const selectTab = async (index: number) => {
  if (index === internalSelectedIndex.value) return
  if (index < 0 || index >= items.value.length) return
  if (items.value[index].disabled) return
  if (isAnimating.value) return

  const oldIndex = internalSelectedIndex.value
  const oldItem = items.value[oldIndex]
  const newItem = items.value[index]

  // Emit unloading/unloaded events
  emit('pivotItemUnloading', oldIndex, oldItem)

  isAnimating.value = true

  // Emit loading event
  emit('pivotItemLoading', index, newItem)

  internalSelectedIndex.value = index

  // Update v-model
  emit('update:selectedIndex', index)
  emit('update:selectedItem', newItem)

  // Emit selection changed
  emit('selectionChanged', index, newItem)

  await nextTick()
  updateIndicator()

  // Scroll header into view if carousel enabled
  if (props.isHeaderItemsCarouselEnabled !== false && headerRefs.value[index]) {
    scrollHeaderIntoView(index)
  }

  // Emit loaded/unloaded events
  setTimeout(() => {
    emit('pivotItemUnloaded', oldIndex, oldItem)
    emit('pivotItemLoaded', index, newItem)
    isAnimating.value = false
  }, 300)
}

// 更新下划线指示器
const updateIndicator = () => {
  if (!indicatorRef.value || !headerRefs.value[internalSelectedIndex.value]) return

  const activeHeader = headerRefs.value[internalSelectedIndex.value]
  const indicator = indicatorRef.value

  indicator.style.width = `${activeHeader.offsetWidth}px`
  indicator.style.transform = `translateX(${activeHeader.offsetLeft}px)`
}

// 滚动header到视野中
const scrollHeaderIntoView = (index: number) => {
  if (!headerContainerRef.value || !headerRefs.value[index]) return

  const container = headerContainerRef.value
  const header = headerRefs.value[index]

  const containerRect = container.getBoundingClientRect()
  const headerRect = header.getBoundingClientRect()

  if (headerRect.left < containerRect.left) {
    container.scrollLeft -= containerRect.left - headerRect.left + 20
  } else if (headerRect.right > containerRect.right) {
    container.scrollLeft += headerRect.right - containerRect.right + 20
  }
}

// 键盘导航
const handleKeydown = (event: KeyboardEvent, index: number) => {
  if (props.isLocked) return

  let newIndex = index

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      newIndex = index - 1
      if (props.isHeaderItemsCarouselEnabled !== false && newIndex < 0) {
        newIndex = items.value.length - 1
      }
      break
    case 'ArrowRight':
      event.preventDefault()
      newIndex = index + 1
      if (props.isHeaderItemsCarouselEnabled !== false && newIndex >= items.value.length) {
        newIndex = 0
      }
      break
    case 'Home':
      event.preventDefault()
      newIndex = 0
      break
    case 'End':
      event.preventDefault()
      newIndex = items.value.length - 1
      break
    default:
      return
  }

  // 跳过disabled项
  while (newIndex >= 0 && newIndex < items.value.length && items.value[newIndex].disabled) {
    newIndex += event.key === 'ArrowLeft' ? -1 : 1
  }

  if (newIndex >= 0 && newIndex < items.value.length) {
    selectTab(newIndex)
    headerRefs.value[newIndex]?.focus()
  }
}

// 鼠标事件
const handleMouseEnter = (index: number) => {
  if (!items.value[index].disabled) {
    hoveredIndex.value = index
  }
}

const handleMouseLeave = () => {
  hoveredIndex.value = null
}

const handleMouseDown = (index: number) => {
  if (!items.value[index].disabled) {
    pressedIndex.value = index
  }
}

const handleMouseUp = () => {
  pressedIndex.value = null
}

// 计算视觉状态
const getHeaderState = (index: number) => {
  const item = items.value[index]
  if (item.disabled) return 'disabled'
  if (pressedIndex.value === index) return 'pressed'
  if (internalSelectedIndex.value === index) return 'selected'
  if (hoveredIndex.value === index) return 'pointer-over'
  return 'normal'
}

// 最小高度样式
const contentStyle = computed(() => ({
  minHeight: props.minHeight ? `${props.minHeight}px` : undefined
}))

// 设置header ref
const setHeaderRef = (el: any, index: number) => {
  if (el) {
    headerRefs.value[index] = el
  }
}

// Expose methods
defineExpose({
  selectTab,
  updateIndicator
})
</script>

<template>
  <div class="win-pivot" role="tablist">
    <!-- Title -->
    <div v-if="title" class="win-pivot-title">{{ title }}</div>

    <!-- Headers -->
    <div
      ref="headerContainerRef"
      class="win-pivot-headers"
      :class="{ 'is-carousel': isHeaderItemsCarouselEnabled !== false }"
    >
      <button
        v-for="(item, index) in items"
        :key="index"
        :ref="(el) => setHeaderRef(el, index)"
        type="button"
        role="tab"
        class="win-pivot-header"
        :class="[
          `state-${getHeaderState(index)}`,
          { 'is-selected': index === internalSelectedIndex }
        ]"
        :aria-selected="index === internalSelectedIndex"
        :aria-disabled="item.disabled"
        :disabled="item.disabled || isLocked"
        :tabindex="index === internalSelectedIndex ? 0 : -1"
        @click="selectTab(index)"
        @keydown="(e) => handleKeydown(e, index)"
        @mouseenter="handleMouseEnter(index)"
        @mouseleave="handleMouseLeave"
        @mousedown="handleMouseDown(index)"
        @mouseup="handleMouseUp"
      >
        <slot v-if="headerTemplate" name="headerTemplate" :item="item" :index="index">
          {{ item.header }}
        </slot>
        <span v-else>{{ item.header }}</span>
      </button>

      <!-- Selection Indicator -->
      <div ref="indicatorRef" class="win-pivot-indicator" aria-hidden="true" />
    </div>

    <!-- Content -->
    <div class="win-pivot-content" :style="contentStyle" role="tabpanel">
      <div
        v-for="(item, index) in items"
        v-show="index === internalSelectedIndex"
        :key="index"
        class="win-pivot-item-content"
      >
        <slot :name="`item-${index}`" :item="item" :index="index">
          <slot />
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.win-pivot {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Title */
.win-pivot-title {
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  margin: 0 0 4px 0;
  color: var(--text-fill-color-primary);
}

/* Headers Container */
.win-pivot-headers {
  position: relative;
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--control-stroke-color-default);
  overflow: visible;
}

.win-pivot-headers.is-carousel {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.win-pivot-headers.is-carousel::-webkit-scrollbar {
  display: none;
}

/* Header Button */
.win-pivot-header {
  position: relative;
  flex-shrink: 0;
  padding: 12px 16px;
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-fill-color-secondary);
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease;
  white-space: nowrap;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

/* Visual States */
.win-pivot-header.state-normal {
  color: var(--text-fill-color-secondary);
}

.win-pivot-header.state-pointer-over {
  color: var(--text-fill-color-primary);
  background: var(--subtle-fill-color-secondary);
}

.win-pivot-header.state-pressed {
  color: var(--text-fill-color-primary);
  background: var(--subtle-fill-tertiary);
}

.win-pivot-header.state-selected {
  color: var(--accent-text-primary);
}

.win-pivot-header.state-disabled {
  color: var(--text-fill-color-disabled);
  cursor: not-allowed;
  opacity: 0.5;
}

/* Focus State */
.win-pivot-header:focus-visible {
  outline: 2px solid var(--focus-stroke-outer);
  outline-offset: -2px;
}

/* Selection Indicator */
.win-pivot-indicator {
  position: absolute;
  bottom: -1px;
  left: 0;
  height: 2px;
  background: var(--accent-fill-color-default);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

/* Content */
.win-pivot-content {
  padding: 16px 0 0 0;
}

.win-pivot-item-content {
  animation: pivot-content-fade-in 0.3s ease;
}

@keyframes pivot-content-fade-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Locked State */
.win-pivot-headers .win-pivot-header:disabled {
  cursor: default;
}

/* High Contrast Support */
@media (prefers-contrast: high) {
  .win-pivot-header.state-selected {
    text-decoration: underline;
    text-decoration-thickness: 2px;
  }

  .win-pivot-indicator {
    height: 3px;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .win-pivot-indicator {
    transition: none;
  }

  .win-pivot-item-content {
    animation: none;
  }
}
</style>
