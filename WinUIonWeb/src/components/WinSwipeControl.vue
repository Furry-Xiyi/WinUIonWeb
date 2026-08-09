<template>
  <div
    ref="swipeControlRoot"
    class="win-swipe-control"
    :class="rootClasses"
    :style="rootStyle"
    :aria-label="automationName || undefined"
    @pointerenter="emit('PointerEntered', $event)"
    @pointerleave="emit('PointerExited', $event)"
    @contextmenu.prevent="onContextRequested"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointercancel="handlePointerCancel"
    @lostpointercapture="handleLostPointerCapture">
    <div
      v-if="activeItems"
      class="swipe-content-root"
      :class="[`side-${activeSide?.toLowerCase()}`, `mode-${activeMode.toLowerCase()}`]"
      :style="underlayStyle">
      <div class="swipe-items-panel" :style="itemsPanelStyle">
        <button
          v-for="(item, index) in activeItems.Items"
          :key="index"
          type="button"
          class="swipe-item"
          :style="getItemStyle(item)"
          :aria-label="getItemText(item) || automationName || undefined"
          :disabled="!canExecuteItem(item)"
          @pointerdown.stop
          @click.stop="invokeItem(item)">
          <span class="swipe-item-content">
            <span
              v-if="getIconUri(getItemIcon(item))"
              class="swipe-item-bitmap"
              :style="getBitmapStyle(getItemIcon(item))"
              aria-hidden="true" />
            <span v-else-if="getIconGlyph(getItemIcon(item))" class="swipe-item-icon" aria-hidden="true">
              {{ getIconGlyph(getItemIcon(item)) }}
            </span>
            <span v-if="getItemText(item)" class="swipe-item-text">{{ getItemText(item) }}</span>
          </span>
        </button>
      </div>
    </div>

    <div ref="contentRoot" class="swipe-control-content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { CSSProperties } from 'vue';
import type { SwipeItem, SwipeItems, SwipeSide } from './WinSwipeControl.types';

const props = withDefaults(defineProps<{
  LeftItems?: SwipeItems;
  RightItems?: SwipeItems;
  TopItems?: SwipeItems;
  BottomItems?: SwipeItems;
  Background?: string;
  BorderBrush?: string;
  BorderThickness?: string | number;
  CornerRadius?: string | number;
  Padding?: string | number;
  Margin?: string | number;
  Width?: string | number;
  Height?: string | number;
  MinWidth?: string | number;
  MinHeight?: string | number;
  'AutomationProperties.Name'?: string;
}>(), {
  LeftItems: undefined,
  RightItems: undefined,
  TopItems: undefined,
  BottomItems: undefined,
  Background: 'transparent',
  BorderBrush: 'transparent',
  BorderThickness: 0,
  CornerRadius: 0,
  Padding: 0,
  Margin: 0,
  Width: undefined,
  Height: undefined,
  MinWidth: 40,
  MinHeight: 40,
  'AutomationProperties.Name': ''
});
const emit = defineEmits<{
  PointerEntered: [event: PointerEvent];
  PointerExited: [event: PointerEvent];
  ContextRequested: [event: MouseEvent];
}>();

const automationName = computed(() => props['AutomationProperties.Name']);
const onContextRequested = (event: MouseEvent) => emit('ContextRequested', event);

const ITEM_WIDTH = 68;
const ITEM_HEIGHT = 60;
const OPEN_THRESHOLD = 100;
const DIRECTION_THRESHOLD = 10;
const SETTLE_DURATION = 200;

const swipeControlRoot = ref<HTMLElement>();
const contentRoot = ref<HTMLElement>();
const isInteracting = ref(false);
const isOpen = ref(false);
const thresholdReached = ref(false);
const activeSide = ref<SwipeSide>();
const activeItems = ref<SwipeItems>();
const contentOffsetX = ref(0);
const contentOffsetY = ref(0);
let pointerId: number | undefined;
let startX = 0;
let startY = 0;

const toCssLength = (value: string | number | undefined) => {
  if (value === undefined || value === '') return undefined;
  if (typeof value === 'number') return `${value}px`;
  const trimmed = value.trim();
  return trimmed !== '' && !Number.isNaN(Number(trimmed)) ? `${Number(trimmed)}px` : trimmed;
};

const toCssThickness = (value: string | number | undefined) => {
  if (value === undefined || value === '') return undefined;
  if (typeof value === 'number') return `${value}px`;
  const values = value.split(',').map((part) => toCssLength(part.trim()));
  if (values.length !== 4) return toCssLength(value) ?? value;
  const [left, top, right, bottom] = values;
  return `${top} ${right} ${bottom} ${left}`;
};

const hasHorizontalItems = computed(() => Boolean(props.LeftItems?.Items.length || props.RightItems?.Items.length));
const hasVerticalItems = computed(() => Boolean(props.TopItems?.Items.length || props.BottomItems?.Items.length));

const rootStyle = computed<CSSProperties>(() => ({
  width: toCssLength(props.Width),
  height: toCssLength(props.Height),
  minWidth: toCssLength(props.MinWidth),
  minHeight: toCssLength(props.MinHeight),
  margin: toCssThickness(props.Margin),
  touchAction: hasHorizontalItems.value && hasVerticalItems.value
    ? 'none'
    : hasHorizontalItems.value ? 'pan-y' : hasVerticalItems.value ? 'pan-x' : 'auto'
}));

const rootClasses = computed(() => ({
  interacting: isInteracting.value,
  open: isOpen.value,
  'threshold-reached': thresholdReached.value
}));

const contentStyle = computed<CSSProperties>(() => ({
  transform: `translate3d(${contentOffsetX.value}px, ${contentOffsetY.value}px, 0)`,
  padding: toCssThickness(props.Padding),
  borderColor: props.BorderBrush,
  borderWidth: toCssThickness(props.BorderThickness),
  borderRadius: toCssLength(props.CornerRadius),
  background: props.Background
}));

const activeMode = computed(() => activeItems.value?.Mode ?? 'Reveal');

const revealExtent = computed(() => {
  if (!activeItems.value || !activeSide.value) return 0;
  if (activeMode.value === 'Execute') {
    return activeSide.value === 'Left' || activeSide.value === 'Right'
      ? swipeControlRoot.value?.clientWidth ?? 0
      : swipeControlRoot.value?.clientHeight ?? 0;
  }
  return activeItems.value.Items.length * (
    activeSide.value === 'Left' || activeSide.value === 'Right' ? ITEM_WIDTH : ITEM_HEIGHT
  );
});

const currentRevealAmount = computed(() => Math.abs(
  activeSide.value === 'Left' || activeSide.value === 'Right' ? contentOffsetX.value : contentOffsetY.value
));

const underlayStyle = computed<CSSProperties>(() => {
  const amount = Math.max(0, currentRevealAmount.value);
  const width = swipeControlRoot.value?.clientWidth ?? 0;
  const height = swipeControlRoot.value?.clientHeight ?? 0;
  const rightInset = Math.max(0, width - amount);
  const bottomInset = Math.max(0, height - amount);
  const clipPath = activeSide.value === 'Left'
    ? `inset(0 ${rightInset}px 0 0)`
    : activeSide.value === 'Right'
      ? `inset(0 0 0 ${rightInset}px)`
      : activeSide.value === 'Top'
        ? `inset(0 0 ${bottomInset}px 0)`
        : `inset(${bottomInset}px 0 0 0)`;
  return { clipPath };
});

const itemsPanelStyle = computed<CSSProperties>(() => {
  if (!activeItems.value || !activeSide.value) return {};
  const horizontal = activeSide.value === 'Left' || activeSide.value === 'Right';
  const execute = activeMode.value === 'Execute';
  const executeItem = activeItems.value.Items[0];
  let transform: string | undefined;
  if (execute) {
    const width = swipeControlRoot.value?.clientWidth ?? 0;
    const height = swipeControlRoot.value?.clientHeight ?? 0;
    if (activeSide.value === 'Left') transform = `translate3d(${(contentOffsetX.value - width) / 2}px, 0, 0)`;
    if (activeSide.value === 'Right') transform = `translate3d(${(contentOffsetX.value + width) / 2}px, 0, 0)`;
    if (activeSide.value === 'Top') transform = `translate3d(0, ${(contentOffsetY.value - height) / 2}px, 0)`;
    if (activeSide.value === 'Bottom') transform = `translate3d(0, ${(contentOffsetY.value + height) / 2}px, 0)`;
  }
  return {
    width: horizontal ? (execute ? '100%' : `${revealExtent.value}px`) : '100%',
    height: horizontal ? '100%' : (execute ? '100%' : `${revealExtent.value}px`),
    flexDirection: horizontal ? 'row' : 'column',
    transform,
    background: execute
      ? executeItem?.Background ?? (thresholdReached.value
        ? 'var(--SwipeItemPostThresholdExecuteBackground, var(--accent-base))'
        : 'var(--SwipeItemPreThresholdExecuteBackground, var(--ctrl-fill-tertiary))')
      : undefined
  };
});

const collectionForSide = (side: SwipeSide): SwipeItems | undefined => ({
  Left: props.LeftItems,
  Right: props.RightItems,
  Top: props.TopItems,
  Bottom: props.BottomItems
}[side]);

const validateItems = (items: SwipeItems | undefined) => {
  if (!items?.Items.length) return false;
  if ((items.Mode ?? 'Reveal') === 'Execute' && items.Items.length > 1) {
    throw new Error('SwipeItems in Execute mode must contain exactly one SwipeItem.');
  }
  return true;
};

watch(
  () => [props.LeftItems, props.RightItems, props.TopItems, props.BottomItems] as const,
  ([leftItems, rightItems, topItems, bottomItems]) => {
    [leftItems, rightItems, topItems, bottomItems].forEach((items) => validateItems(items));
    const horizontal = Boolean(leftItems?.Items.length || rightItems?.Items.length);
    const vertical = Boolean(topItems?.Items.length || bottomItems?.Items.length);
    if (horizontal && vertical) {
      throw new Error("SwipeControl can't have both horizontal items and vertical items set at the same time.");
    }
  },
  { immediate: true, deep: true }
);

const sideFromDelta = (deltaX: number, deltaY: number): SwipeSide | undefined => {
  if (Math.abs(deltaX) < DIRECTION_THRESHOLD && Math.abs(deltaY) < DIRECTION_THRESHOLD) return undefined;
  if (Math.abs(deltaX) >= Math.abs(deltaY)) return deltaX > 0 ? 'Left' : 'Right';
  return deltaY > 0 ? 'Top' : 'Bottom';
};

const setActiveSide = (side: SwipeSide) => {
  const items = collectionForSide(side);
  if (!validateItems(items)) return false;
  activeSide.value = side;
  activeItems.value = items;
  return true;
};

const getMaximumDrag = () => Math.max(0, revealExtent.value);

const updateOffset = (deltaX: number, deltaY: number) => {
  if (!activeSide.value) return;
  const maximum = getMaximumDrag();
  if (activeSide.value === 'Left') contentOffsetX.value = Math.min(Math.max(0, deltaX), maximum);
  if (activeSide.value === 'Right') contentOffsetX.value = Math.max(Math.min(0, deltaX), -maximum);
  if (activeSide.value === 'Top') contentOffsetY.value = Math.min(Math.max(0, deltaY), maximum);
  if (activeSide.value === 'Bottom') contentOffsetY.value = Math.max(Math.min(0, deltaY), -maximum);
  const threshold = Math.min(revealExtent.value, OPEN_THRESHOLD);
  thresholdReached.value = currentRevealAmount.value > Math.max(0, threshold - 1);
};

const handlePointerDown = (event: PointerEvent) => {
  if (event.pointerType !== 'touch') return;
  if (event.button !== 0 || pointerId !== undefined) return;
  if (isOpen.value) {
    Close();
    event.preventDefault();
    return;
  }
  pointerId = event.pointerId;
  startX = event.clientX;
  startY = event.clientY;
  isInteracting.value = true;
  swipeControlRoot.value?.setPointerCapture(event.pointerId);
};

const handlePointerMove = (event: PointerEvent) => {
  if (!isInteracting.value || pointerId !== event.pointerId) return;
  const deltaX = event.clientX - startX;
  const deltaY = event.clientY - startY;
  if (!activeSide.value) {
    const side = sideFromDelta(deltaX, deltaY);
    if (!side || !setActiveSide(side)) return;
  }
  updateOffset(deltaX, deltaY);
  event.preventDefault();
};

const releasePointer = () => {
  const capturedPointerId = pointerId;
  pointerId = undefined;
  isInteracting.value = false;
  if (capturedPointerId !== undefined && swipeControlRoot.value?.hasPointerCapture(capturedPointerId)) {
    swipeControlRoot.value.releasePointerCapture(capturedPointerId);
  }
};

const settleOpen = () => {
  if (!activeSide.value) return;
  isOpen.value = true;
  if (activeSide.value === 'Left') contentOffsetX.value = revealExtent.value;
  if (activeSide.value === 'Right') contentOffsetX.value = -revealExtent.value;
  if (activeSide.value === 'Top') contentOffsetY.value = revealExtent.value;
  if (activeSide.value === 'Bottom') contentOffsetY.value = -revealExtent.value;
};

const handlePointerUp = (event: PointerEvent) => {
  if (pointerId !== event.pointerId) return;
  const shouldInvoke = thresholdReached.value && activeMode.value === 'Execute';
  const shouldReveal = thresholdReached.value && activeMode.value === 'Reveal';
  releasePointer();
  if (shouldInvoke && activeItems.value) invokeItem(activeItems.value.Items[0]);
  else if (shouldReveal) settleOpen();
  else Close();
};

const handlePointerCancel = (event: PointerEvent) => {
  if (pointerId !== event.pointerId) return;
  releasePointer();
  Close();
};

const handleLostPointerCapture = (event: PointerEvent) => {
  if (pointerId !== event.pointerId) return;
  pointerId = undefined;
  isInteracting.value = false;
  Close();
};

const getIconUri = (source: SwipeItem['IconSource']) => {
  if (typeof source === 'object') return source.UriSource;
  if (typeof source === 'string' && /^(?:https?:|data:|\/|\.\/|\.\.\/)/.test(source)) return source;
  return undefined;
};

const getBitmapStyle = (source: SwipeItem['IconSource']): CSSProperties => {
  const uri = getIconUri(source);
  return uri
    ? { '--swipe-item-bitmap-source': `url("${uri}")` } as CSSProperties
    : {};
};

const getItemText = (item: SwipeItem) => item.Text || item.Command?.Label || '';
const getItemIcon = (item: SwipeItem) => item.IconSource ?? item.Command?.IconSource;

const symbolGlyphs: Record<string, string> = {
  Accept: '\uE8FB', Add: '\uE710', Back: '\uE72B', Cancel: '\uE711', Close: '\uE711',
  Copy: '\uE8C8', Cut: '\uE8C6', Delete: '\uE74D', Edit: '\uE70F', Favorite: '\uE734',
  Flag: '\uE7C1', FontDecrease: '\uE8A0', FontIncrease: '\uE8A1', Forward: '\uE72A',
  OpenFile: '\uE8E5', Paste: '\uE77F', Pause: '\uE769', Play: '\uE768', Redo: '\uE7A6',
  Save: '\uE74E', SelectAll: '\uE8B3', Share: '\uE72D', Stop: '\uE71A', Undo: '\uE7A7'
};

const getIconGlyph = (source: SwipeItem['IconSource']) => {
  if (typeof source === 'object') return source.Glyph ?? (source.Symbol ? symbolGlyphs[source.Symbol] : undefined);
  return getIconUri(source) ? undefined : source;
};

const canExecuteItem = (item: SwipeItem) => item.Command?.CanExecute?.(item.CommandParameter) ?? true;

const getItemStyle = (item: SwipeItem): CSSProperties => {
  const execute = activeMode.value === 'Execute';
  return {
    background: execute
      ? 'transparent'
      : item.Background ?? 'var(--SwipeItemBackground, var(--ctrl-fill-tertiary))',
    color: item.Foreground ?? (execute
      ? thresholdReached.value
        ? 'var(--SwipeItemPostThresholdExecuteForeground, var(--accent-text))'
        : 'var(--SwipeItemPreThresholdExecuteForeground, var(--ctrl-strong-fill))'
      : 'var(--SwipeItemForeground, var(--text-primary))')
  };
};

const swipeControlApi = {
  Close: () => Close(),
  get Content() { return contentRoot.value; },
  get Element() { return swipeControlRoot.value; }
};

const invokeItem = (item: SwipeItem) => {
  if (!canExecuteItem(item)) return;
  item.Invoked?.(item, { SwipeControl: swipeControlApi });
  item.Command?.Execute(item.CommandParameter);
  if ((item.BehaviorOnInvoked ?? 'Auto') === 'RemainOpen') {
    settleOpen();
  } else {
    Close();
  }
};

function Close() {
  isOpen.value = false;
  thresholdReached.value = false;
  contentOffsetX.value = 0;
  contentOffsetY.value = 0;
  window.setTimeout(() => {
    if (isOpen.value || isInteracting.value) return;
    activeSide.value = undefined;
    activeItems.value = undefined;
  }, SETTLE_DURATION);
}

const shouldRemainOpen = () => activeMode.value === 'Execute'
  && activeItems.value?.Items[0]?.BehaviorOnInvoked === 'RemainOpen';

const handleDocumentPointerDown = (event: PointerEvent) => {
  if (isOpen.value && !shouldRemainOpen() && !swipeControlRoot.value?.contains(event.target as Node)) Close();
};

onMounted(() => document.addEventListener('pointerdown', handleDocumentPointerDown, true));
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleDocumentPointerDown, true));

defineExpose({ Close });
</script>

<style scoped>
.win-swipe-control {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background: transparent;
  box-sizing: border-box;
  color: var(--TextFillColorPrimaryBrush, var(--text-primary));
  font-family: 'Segoe UI Variable', 'Segoe UI', sans-serif;
  user-select: none;
}

.swipe-content-root {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  will-change: clip-path;
  transition: clip-path var(--normal-duration, 200ms) var(--fast-out-slow-in, cubic-bezier(0, 0, 0, 1));
}

.swipe-items-panel {
  position: absolute;
  display: flex;
  will-change: transform;
  transition: transform var(--normal-duration, 200ms) var(--fast-out-slow-in, cubic-bezier(0, 0, 0, 1));
}

.side-left .swipe-items-panel { inset: 0 auto 0 0; }
.side-right .swipe-items-panel { inset: 0 0 0 auto; }
.side-top .swipe-items-panel { inset: 0 0 auto 0; }
.side-bottom .swipe-items-panel { inset: auto 0 0 0; }

.swipe-item {
  display: grid;
  flex: 1 0 auto;
  place-items: center;
  min-width: 68px;
  min-height: 40px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  color: inherit;
  font: inherit;
  pointer-events: auto;
  box-sizing: border-box;
  cursor: default;
  transition: background-color var(--faster-duration, 83ms) linear, color var(--faster-duration, 83ms) linear;
}

.side-left .swipe-item,
.side-right .swipe-item {
  width: 68px;
  height: 100%;
}

.side-top .swipe-item,
.side-bottom .swipe-item {
  width: 100%;
  height: 60px;
}

.mode-execute .swipe-item {
  width: 100%;
  height: 100%;
}

.swipe-item:active {
  background: var(--SwipeItemBackgroundPressed, var(--subtle-pressed)) !important;
}

.swipe-item:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: -3px;
}

.swipe-item-content {
  display: grid;
  grid-template-rows: auto auto;
  place-items: center;
  align-content: center;
  min-width: 16px;
  margin: 4px 4px 2px;
}

.swipe-item-icon,
.swipe-item-bitmap {
  display: block;
  width: 16px;
  height: 16px;
  margin: 0 0 2px;
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif;
  font-size: 16px;
  line-height: 16px;
}

.swipe-item-bitmap {
  background: currentColor;
  -webkit-mask: var(--swipe-item-bitmap-source) center / contain no-repeat;
  mask: var(--swipe-item-bitmap-source) center / contain no-repeat;
}

.swipe-item-text {
  max-width: 64px;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  white-space: normal;
  overflow-wrap: anywhere;
}

.swipe-control-content {
  position: relative;
  z-index: 1;
  display: grid;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: inherit;
  border-style: solid;
  box-sizing: border-box;
  will-change: transform;
  transition: transform var(--normal-duration, 200ms) var(--fast-out-slow-in, cubic-bezier(0, 0, 0, 1));
}

.swipe-control-content > :deep(.win-text-block) {
  place-self: center;
  text-align: center;
}

.win-swipe-control.interacting .swipe-content-root,
.win-swipe-control.interacting .swipe-items-panel,
.win-swipe-control.interacting .swipe-control-content {
  transition: none;
}

@media (prefers-reduced-motion: reduce) {
  .swipe-content-root,
  .swipe-items-panel,
  .swipe-control-content,
  .swipe-item {
    transition-duration: 0.01ms;
  }
}
</style>
