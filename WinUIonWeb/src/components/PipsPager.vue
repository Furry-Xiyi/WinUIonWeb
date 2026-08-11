<template>
  <div
    class="win-pips-pager"
    :class="[
      `orientation-${Orientation.toLowerCase()}`,
      { 'is-disabled': !IsEnabled }
    ]"
    :style="rootStyle"
    role="group"
    @pointerenter="isPointerOver = true"
    @pointerleave="isPointerOver = false"
    @focusin="isFocused = true"
    @focusout="isFocused = false"
    @keydown="onKeyDown">
    <button
      v-if="PreviousButtonVisibility !== 'Collapsed'"
      class="navigation-button previous-page-button"
      :class="{ hidden: !isPreviousButtonVisible }"
      :disabled="!IsEnabled || !canGoPrevious"
      :style="PreviousButtonStyle"
      type="button"
      :aria-label="t('text.previous-page')"
      v-bind="{ 'tooltipservice.tooltip': t('text.previous-page') }"
      @click="goToPreviousPage">
      <span aria-hidden="true">&#xEDDB;</span>
    </button>

    <div class="pips-viewport" :style="viewportStyle">
      <div class="pips-repeater" :style="repeaterStyle">
        <button
          v-for="pageIndex in pageIndexes"
          :key="pageIndex"
          class="pip-button"
          :class="{ selected: pageIndex === selectedIndex }"
          :disabled="!IsEnabled"
          :style="pageIndex === selectedIndex ? SelectedPipStyle : NormalPipStyle"
          type="button"
          :aria-label="t('text.page-number', { page: pageIndex + 1 })"
          :aria-posinset="pageIndex + 1"
          :aria-setsize="NumberOfPages > 0 ? NumberOfPages : undefined"
          @click="setSelectedPageIndex(pageIndex)">
          <span class="pip-glyph" aria-hidden="true">&#xEA3B;</span>
        </button>
      </div>
    </div>

    <button
      v-if="NextButtonVisibility !== 'Collapsed'"
      class="navigation-button next-page-button"
      :class="{ hidden: !isNextButtonVisible }"
      :disabled="!IsEnabled || !canGoNext"
      :style="NextButtonStyle"
      type="button"
      :aria-label="t('text.next-page')"
      v-bind="{ 'tooltipservice.tooltip': t('text.next-page') }"
      @click="goToNextPage">
      <span aria-hidden="true">&#xEDDC;</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from './i18n/index'

type PipsPagerOrientation = 'Horizontal' | 'Vertical'
type PipsPagerButtonVisibility = 'Visible' | 'VisibleOnPointerOver' | 'Collapsed'
type PipsPagerWrapMode = 'None' | 'Wrap'
type StyleValue = string | Record<string, string | number> | undefined

interface Props {
  NumberOfPages?: number
  SelectedPageIndex?: number
  MaxVisiblePips?: number
  Orientation?: PipsPagerOrientation
  PreviousButtonVisibility?: PipsPagerButtonVisibility
  NextButtonVisibility?: PipsPagerButtonVisibility
  PreviousButtonStyle?: StyleValue
  NextButtonStyle?: StyleValue
  SelectedPipStyle?: StyleValue
  NormalPipStyle?: StyleValue
  WrapMode?: PipsPagerWrapMode
  IsEnabled?: boolean
  Background?: string
  Width?: number | string
  Height?: number | string
  Margin?: number | string
  HorizontalAlignment?: 'Left' | 'Center' | 'Right' | 'Stretch'
  VerticalAlignment?: 'Top' | 'Center' | 'Bottom' | 'Stretch'
}

const props = withDefaults(defineProps<Props>(), {
  NumberOfPages: -1,
  SelectedPageIndex: 0,
  MaxVisiblePips: 5,
  Orientation: 'Horizontal',
  PreviousButtonVisibility: 'Collapsed',
  NextButtonVisibility: 'Collapsed',
  WrapMode: 'None',
  IsEnabled: true,
  Background: 'transparent',
  HorizontalAlignment: 'Left',
  VerticalAlignment: 'Top'
})

const { t } = useI18n()

const emit = defineEmits<{
  'update:SelectedPageIndex': [value: number]
  SelectedIndexChanged: [args: Record<string, never>]
}>()

const isPointerOver = ref(false)
const isFocused = ref(false)
const internalSelectedPageIndex = ref(props.SelectedPageIndex)

const pageCount = computed(() => {
  if (props.NumberOfPages === 0 || props.MaxVisiblePips <= 0) return 0
  if (props.NumberOfPages > 0) return props.NumberOfPages
  return Math.max(props.MaxVisiblePips, internalSelectedPageIndex.value + 2)
})

const selectedIndex = computed(() => {
  if (props.NumberOfPages > 0) {
    return Math.min(Math.max(0, internalSelectedPageIndex.value), props.NumberOfPages - 1)
  }
  return Math.max(0, internalSelectedPageIndex.value)
})

const pageIndexes = computed(() => Array.from({ length: pageCount.value }, (_, index) => index))
const visiblePipCount = computed(() => Math.min(Math.max(0, props.MaxVisiblePips), pageCount.value))
const isHorizontal = computed(() => props.Orientation === 'Horizontal')
const canWrap = computed(() => props.WrapMode === 'Wrap' && props.NumberOfPages > 1)
const canGoPrevious = computed(() => pageCount.value > 0 && (selectedIndex.value > 0 || canWrap.value))
const canGoNext = computed(() => pageCount.value > 0 && (props.NumberOfPages < 0 || selectedIndex.value < props.NumberOfPages - 1 || canWrap.value))
const pointerVisibilityActive = computed(() => isPointerOver.value || isFocused.value)

const isPreviousButtonVisible = computed(() => (
  pageCount.value > 0 &&
  canGoPrevious.value &&
  (props.PreviousButtonVisibility === 'Visible' || pointerVisibilityActive.value)
))

const isNextButtonVisible = computed(() => (
  pageCount.value > 0 &&
  canGoNext.value &&
  (props.NextButtonVisibility === 'Visible' || pointerVisibilityActive.value)
))

const firstVisibleIndex = computed(() => {
  const count = visiblePipCount.value
  if (count <= 0 || pageCount.value <= count) return 0
  const centeredStart = selectedIndex.value - Math.floor(count / 2)
  return Math.min(Math.max(0, centeredStart), pageCount.value - count)
})

const cssLength = (value: number | string | undefined) => {
  if (value === undefined || value === '') return undefined
  return typeof value === 'number' || !Number.isNaN(Number(value)) ? `${Number(value)}px` : value
}

const xamlThickness = (value: number | string | undefined) => {
  if (value === undefined || value === '') return undefined
  const parts = String(value).split(',').map(part => cssLength(part.trim()))
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`
  return parts[0]
}

const horizontalAlignment = computed(() => ({
  Left: 'flex-start',
  Center: 'center',
  Right: 'flex-end',
  Stretch: 'stretch'
}[props.HorizontalAlignment] ?? 'flex-start'))

const rootStyle = computed(() => ({
  width: cssLength(props.Width),
  height: cssLength(props.Height),
  margin: xamlThickness(props.Margin),
  justifySelf: horizontalAlignment.value,
  alignSelf: horizontalAlignment.value,
  background: props.Background
}))
const viewportStyle = computed(() => isHorizontal.value
  ? { width: `${visiblePipCount.value * 12}px`, height: pageCount.value ? '24px' : '0px' }
  : { width: pageCount.value ? '24px' : '0px', height: `${visiblePipCount.value * 12}px` })
const repeaterStyle = computed(() => ({
  transform: isHorizontal.value
    ? `translateX(${-firstVisibleIndex.value * 12}px)`
    : `translateY(${-firstVisibleIndex.value * 12}px)`
}))

const setSelectedPageIndex = (nextIndex: number) => {
  if (!props.IsEnabled || pageCount.value === 0) return
  let normalizedIndex = nextIndex
  if (props.NumberOfPages > 0) {
    if (canWrap.value) {
      normalizedIndex = (nextIndex + props.NumberOfPages) % props.NumberOfPages
    } else {
      normalizedIndex = Math.min(Math.max(0, nextIndex), props.NumberOfPages - 1)
    }
  } else {
    normalizedIndex = Math.max(0, nextIndex)
  }
  if (normalizedIndex === selectedIndex.value) return

  internalSelectedPageIndex.value = normalizedIndex
  emit('update:SelectedPageIndex', normalizedIndex)
  emit('SelectedIndexChanged', {})
}

const goToPreviousPage = () => setSelectedPageIndex(selectedIndex.value - 1)
const goToNextPage = () => setSelectedPageIndex(selectedIndex.value + 1)

const onKeyDown = (event: KeyboardEvent) => {
  if (!props.IsEnabled) return
  const previousKey = isHorizontal.value ? 'ArrowLeft' : 'ArrowUp'
  const nextKey = isHorizontal.value ? 'ArrowRight' : 'ArrowDown'
  if (event.key === previousKey) {
    event.preventDefault()
    goToPreviousPage()
  } else if (event.key === nextKey) {
    event.preventDefault()
    goToNextPage()
  } else if (event.key === 'Home') {
    event.preventDefault()
    setSelectedPageIndex(0)
  } else if (event.key === 'End' && props.NumberOfPages > 0) {
    event.preventDefault()
    setSelectedPageIndex(props.NumberOfPages - 1)
  }
}

watch(() => props.SelectedPageIndex, value => {
  internalSelectedPageIndex.value = value
})

watch(() => props.NumberOfPages, () => {
  if (props.NumberOfPages <= 0 || internalSelectedPageIndex.value === selectedIndex.value) return
  internalSelectedPageIndex.value = selectedIndex.value
  emit('update:SelectedPageIndex', selectedIndex.value)
})

defineExpose({
  GoToPreviousPage: goToPreviousPage,
  GoToNextPage: goToNextPage,
  SetSelectedPageIndex: setSelectedPageIndex
})
</script>

<style scoped>
.win-pips-pager {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 0;
  user-select: none;
}

.win-pips-pager.orientation-vertical {
  flex-direction: column;
}

.navigation-button,
.pip-button {
  box-sizing: border-box;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  margin: 0;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: var(--ctrl-strong-fill, var(--text-primary));
  font-family: 'WinUIOnWebIcons';
  line-height: 1;
}

.navigation-button {
  width: 24px;
  height: 24px;
  font-size: 8px;
  transition: opacity 83ms linear, color 83ms linear;
}

.orientation-horizontal .navigation-button {
  transform: rotate(-90deg);
}

.navigation-button.hidden {
  opacity: 0;
  pointer-events: none;
}

.navigation-button:disabled {
  color: var(--ctrl-strong-fill-disabled, var(--text-disabled));
}

.navigation-button:not(:disabled):hover {
  color: var(--text-secondary);
}

.navigation-button:not(:disabled):active span {
  transform: scale(0.875);
}

.navigation-button > span {
  display: block;
}

.pips-viewport {
  flex: 0 0 auto;
  overflow: hidden;
}

.pips-repeater {
  display: flex;
  align-items: center;
  transition: transform 250ms cubic-bezier(0.1, 0.9, 0.2, 1);
}

.orientation-vertical .pips-repeater {
  flex-direction: column;
}

.pip-button {
  width: 12px;
  height: 24px;
  cursor: default;
}

.orientation-vertical .pip-button {
  width: 24px;
  height: 12px;
}

.orientation-vertical .pip-button.selected {
  width: 24px;
  height: 12px;
}

.pip-glyph {
  display: block;
  font-size: 4px;
  transition: color 83ms linear;
}

.pip-button.selected .pip-glyph,
.pip-button:not(:disabled):hover .pip-glyph {
  font-size: 6px;
}

.pip-button:not(:disabled):hover,
.pip-button:not(:disabled):active {
  color: var(--text-secondary);
}

.pip-button:disabled {
  color: var(--ctrl-strong-fill-disabled, var(--text-disabled));
}

.navigation-button:focus-visible,
.pip-button:focus-visible {
  outline: 2px solid var(--text-primary);
  outline-offset: -2px;
}

.win-pips-pager.is-disabled {
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .pips-repeater,
  .navigation-button,
  .pip-glyph {
    transition-duration: 0ms;
  }
}

@media (forced-colors: active) {
  .navigation-button,
  .pip-button {
    color: ButtonText;
  }

  .navigation-button:focus-visible,
  .pip-button:focus-visible {
    outline-color: Highlight;
  }
}
</style>
