<template>
  <div ref="rootEl" class="picker-col-root" @mouseenter="hovered = true" @mouseleave="hovered = false">
    <WinButton
      v-show="hovered && canScrollUp"
      Style="SubtleButtonStyle"
      class="picker-arrow picker-arrow-up"
      Padding="0"
      MinWidth="0"
      MinHeight="0"
      CornerRadius="0"
      FontSize="8"
      @pointerdown="startRepeating(-1)"
      @pointerup="stopRepeating"
      @pointercancel="stopRepeating"
      @pointerleave="stopRepeating"
      @Click="stepBy(-1)">
      <span class="icon" aria-hidden="true">&#xEDDB;</span>
    </WinButton>

    <div
      ref="scrollEl"
      class="picker-col-scroll"
      tabindex="0"
      :aria-label="ariaLabel"
      @scroll="onScroll"
      @keydown="onKeydown">
      <div class="picker-list" :style="{ height: contentHeight + 'px' }">
        <div
          v-for="(label, slot) in listItems"
          :key="'o' + slot"
          class="picker-item"
          :class="{ empty: !label }"
          @click="onItemClick(slot)">
          {{ label }}
        </div>
      </div>
    </div>

    <div class="picker-mask" aria-hidden="true">
      <div ref="maskEl" class="picker-list picker-mask-list" :style="{ height: contentHeight + 'px' }">
        <div
          v-for="(label, slot) in listItems"
          :key="'m' + slot"
          class="picker-item picker-mask-item"
          :class="{ empty: !label, settled: settled && slot === settledSlot }">
          {{ label }}
        </div>
      </div>
    </div>

    <WinButton
      v-show="hovered && canScrollDown"
      Style="SubtleButtonStyle"
      class="picker-arrow picker-arrow-down"
      Padding="0"
      MinWidth="0"
      MinHeight="0"
      CornerRadius="0"
      FontSize="8"
      @pointerdown="startRepeating(1)"
      @pointerup="stopRepeating"
      @pointercancel="stopRepeating"
      @pointerleave="stopRepeating"
      @Click="stepBy(1)">
      <span class="icon" aria-hidden="true">&#xEDDC;</span>
    </WinButton>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import WinButton from './WinButton.vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  value: { type: Number, default: 0 },
  wrap: { type: Boolean, default: true },
  canScrollUp: { type: Boolean, default: true },
  canScrollDown: { type: Boolean, default: true },
  ariaLabel: { type: String, default: '' }
});

const emit = defineEmits(['change']);

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 7;
const COLUMNS_HEIGHT = VISIBLE_ITEMS * ITEM_HEIGHT;
const OFFSET = (COLUMNS_HEIGHT - ITEM_HEIGHT) / 2;
const MOUSE_THRESHOLD = 40;
const ITEM_STEP = ITEM_HEIGHT;
const STEP_MS = 150;
const SNAP_MS = 120;
const SNAP_IDLE_MS = 80;
const SNAP_POLL_MS = 50;
const MOMENTUM_GAP_MS = 40;
const NO_MOMENTUM_SNAP_IDLE_MS = 800;
const TOUCH_LIFT_SNAP_GRACE_MS = 120;
const GESTURE_RESET_MS = 400;
const REPEAT_DELAY_MS = 400;
const REPEAT_INTERVAL_MS = 80;
const USE_SCROLLEND = true;
const SCROLLEND_BACKSTOP_MS = 3000;
const supportsScrollEnd = typeof window !== 'undefined' && (
  'onscrollend' in window ||
  (typeof Element !== 'undefined' && ('onscrollend' in Element.prototype || 'scrollend' in Element.prototype))
);
const scrollEndActive = USE_SCROLLEND && supportsScrollEnd;

const rootEl = ref(null);
const scrollEl = ref(null);
const maskEl = ref(null);
const hovered = ref(false);
const settled = ref(false);
const settledSlot = ref(-1);

const itemCount = computed(() => props.items.length);
const blockHeight = computed(() => Math.max(ITEM_HEIGHT, itemCount.value * ITEM_HEIGHT));
const middleBlock = computed(() => Math.max(2, Math.ceil(OFFSET / blockHeight.value) + 1));
const repeatCount = computed(() => middleBlock.value + 1 + Math.ceil((COLUMNS_HEIGHT - OFFSET) / blockHeight.value));
const slotCount = computed(() => props.wrap
  ? itemCount.value * repeatCount.value
  : Math.max(VISIBLE_ITEMS + 2, itemCount.value));
const startSlot = computed(() => props.wrap
  ? 0
  : Math.max(0, Math.ceil((slotCount.value - itemCount.value) / 2)));
const base = computed(() => props.wrap
  ? middleBlock.value * blockHeight.value - OFFSET
  : -OFFSET);
const contentHeight = computed(() => slotCount.value * ITEM_HEIGHT);

const listItems = computed(() => {
  if (props.wrap) {
    const out = [];
    for (let r = 0; r < repeatCount.value; r++) {
      out.push(...props.items);
    }
    return out;
  }
  const out = [];
  for (let slot = 0; slot < slotCount.value; slot++) {
    const idx = slot - startSlot.value;
    out.push(idx >= 0 && idx < itemCount.value ? props.items[idx] : '');
  }
  return out;
});

let gestureMode = 'none'; // 'none' | 'mouse' | 'trackpad' | 'touch'
let lastWheelTime = 0;
let lastScrollTime = 0;
let eventCount = 0;
let wheelAccum = 0;
let snapTimer = 0;
let rafId = 0;
let animating = false;
let currentTargetRaw = null;
let repeatDelayTimer = 0;
let repeatTimer = 0;
let selfChange = false;
let lastEmitted = -1;
let touchContact = false;
let touchContactActive = false;
let lastTouchPointerTime = 0;
let momentumDetected = false;
let fingerOffConfirmed = false;
let ownScrollPending = 0;
let backstopTimer = 0;

const clampIndex = (i) => Math.max(0, Math.min(itemCount.value - 1, i));
const wrapIndex = (i) => {
  if (itemCount.value === 0) return 0;
  return ((i % itemCount.value) + itemCount.value) % itemCount.value;
};

const scrollTopForIndex = (i) => {
  const logical = props.wrap ? wrapIndex(i) : clampIndex(i);
  if (props.wrap) return base.value + logical * ITEM_HEIGHT;
  return (startSlot.value + logical) * ITEM_HEIGHT - OFFSET;
};

const pickTargetCopy = (from, absoluteTarget, dir) => {
  if (!props.wrap) return absoluteTarget;
  const block = blockHeight.value;
  const maxScroll = slotCount.value * ITEM_HEIGHT - COLUMNS_HEIGHT;
  const reachable = [];
  for (let k = -1; k <= 1; k++) {
    const copy = absoluteTarget + k * block;
    if (copy >= 0 && copy <= maxScroll) reachable.push(copy);
  }
  let best = null;
  for (const copy of reachable) {
    if (dir > 0 && copy < from) continue;
    if (dir < 0 && copy > from) continue;
    if (best === null || Math.abs(copy - from) < Math.abs(best - from)) best = copy;
  }
  if (best === null) {
    for (const copy of reachable) {
      if (best === null || Math.abs(copy - from) < Math.abs(best - from)) best = copy;
    }
  }
  return best ?? absoluteTarget;
};

const rawFloat = () => {
  const el = scrollEl.value;
  if (!el || !props.wrap) return 0;
  return (el.scrollTop - base.value) / ITEM_HEIGHT;
};

const selectedIndex = () => {
  const el = scrollEl.value;
  if (!el || itemCount.value === 0) return 0;
  const st = el.scrollTop;
  if (props.wrap) {
    return wrapIndex(Math.round((st - base.value) / ITEM_HEIGHT));
  }
  const minSlot = startSlot.value;
  const maxSlot = startSlot.value + itemCount.value - 1;
  const rawSlot = Math.round((st + OFFSET) / ITEM_HEIGHT);
  return clampIndex(Math.max(minSlot, Math.min(maxSlot, rawSlot)) - startSlot.value);
};

const syncMask = () => {
  const el = scrollEl.value;
  const mask = maskEl.value;
  if (!el || !mask) return;
  mask.style.transform = `translate3d(0, ${-el.scrollTop}px, 0)`;
};

const rebase = () => {
  const el = scrollEl.value;
  if (!el || !props.wrap) return;
  const st = el.scrollTop;
  if (st < base.value - blockHeight.value) {
    ownScrollPending++;
    el.scrollTop = st + blockHeight.value;
  } else if (st > base.value + blockHeight.value) {
    ownScrollPending++;
    el.scrollTop = st - blockHeight.value;
  }
};

const cancelBackstop = () => {
  window.clearTimeout(backstopTimer);
  backstopTimer = 0;
};

const interruptScroll = () => {
  cancelAnimationFrame(rafId);
  rafId = 0;
  animating = false;
  currentTargetRaw = null;
  ownScrollPending = 0;
  cancelSnap();
  cancelBackstop();
  settled.value = false;
  settledSlot.value = -1;
};

const snapToNearest = () => {
  const el = scrollEl.value;
  if (!el || itemCount.value === 0) return;
  const target = props.wrap
    ? base.value + Math.round(rawFloat()) * ITEM_HEIGHT
    : scrollTopForIndex(selectedIndex());
  animateTo(target, SNAP_MS);
};

const scheduleBackstop = () => {
  if (!scrollEndActive) return;
  cancelBackstop();
  backstopTimer = window.setTimeout(() => {
    backstopTimer = 0;
    if (ownScrollPending > 0 || animating) return;
    rebase();
    syncMask();
    snapToNearest();
  }, SCROLLEND_BACKSTOP_MS);
};

const onScrollEnd = () => {
  if (!scrollEndActive) return;
  if (ownScrollPending > 0) {
    ownScrollPending--;
    return;
  }
  cancelBackstop();
  if (animating || gestureMode === 'mouse') return;
  cancelSnap();
  settled.value = false;
  settledSlot.value = -1;
  rebase();
  syncMask();
  snapToNearest();
};

const emitChange = (index) => {
  selfChange = index !== props.value;
  lastEmitted = index;
  emit('change', index);
};

const setSettled = () => {
  const el = scrollEl.value;
  if (!el) return;
  settled.value = true;
  settledSlot.value = (((Math.round((el.scrollTop + OFFSET) / ITEM_HEIGHT)) % slotCount.value) + slotCount.value) % slotCount.value;
};

const emitSettledChange = () => {
  const idx = selectedIndex();
  if (idx !== lastEmitted) {
    emitChange(idx);
  }
  setSettled();
};

const cancelSnap = () => {
  window.clearTimeout(snapTimer);
  snapTimer = 0;
};

const onScroll = () => {
  const now = performance.now();
  lastScrollTime = now;
  if (gestureMode === 'touch') {
    // Native touch momentum: scroll events that keep arriving after the
    // finger lifts mean the browser is still flinging the list.
    if (fingerOffConfirmed) momentumDetected = true;
  } else if (gestureMode === 'trackpad' && now - lastWheelTime > MOMENTUM_GAP_MS) {
    momentumDetected = true;
  }
  if (!animating && !scrollEndActive) {
    rebase();
  }
  syncMask();
  if (scrollEndActive) {
    if (!animating && ownScrollPending === 0) {
      settled.value = false;
      settledSlot.value = -1;
      scheduleBackstop();
    }
    return;
  }
  if (gestureMode === 'trackpad' && !animating) {
    scheduleSnap();
  }
};

const maybeSnap = () => {
  const isFlingGesture = gestureMode === 'trackpad' || gestureMode === 'touch';
  if (!isFlingGesture || animating || !scrollEl.value || itemCount.value === 0) return;
  const now = performance.now();
  if (touchContactActive && now - lastTouchPointerTime > 3000) {
    touchContactActive = false;
  }
  const fingerStillDown = touchContactActive && touchContact;
  const idleNeeded = fingerOffConfirmed
    ? (momentumDetected ? SNAP_IDLE_MS : 0)
    : (momentumDetected ? SNAP_IDLE_MS : NO_MOMENTUM_SNAP_IDLE_MS);
  const quiet = now - lastScrollTime >= idleNeeded && now - lastWheelTime >= idleNeeded;
  // For touch, wait a short grace period after the finger lifts so a fling's
  // first momentum scroll event has a chance to arrive before snapping.
  const touchLiftGrace = gestureMode === 'touch' && fingerOffConfirmed && !momentumDetected
    ? now - lastScrollTime >= TOUCH_LIFT_SNAP_GRACE_MS
    : true;
  if (fingerStillDown || !quiet || !touchLiftGrace) {
    snapTimer = window.setTimeout(maybeSnap, SNAP_POLL_MS);
    return;
  }
  // scrollend may already have snapped the column; don't run a second snap.
  if (settled.value && selectedIndex() === lastEmitted) return;
  const target = props.wrap
    ? base.value + Math.round(rawFloat()) * ITEM_HEIGHT
    : scrollTopForIndex(selectedIndex());
  animateTo(target, SNAP_MS);
};

const scheduleSnap = () => {
  cancelSnap();
  snapTimer = window.setTimeout(maybeSnap, SNAP_POLL_MS);
};

const finishAnimation = () => {
  const el = scrollEl.value;
  if (!el) return;
  rebase();
  syncMask();
  if (props.wrap) {
    currentTargetRaw = Math.round((el.scrollTop - base.value) / ITEM_HEIGHT);
  } else {
    currentTargetRaw = null;
  }
  emitSettledChange();
};

const animateTo = (target, duration) => {
  const el = scrollEl.value;
  if (!el || itemCount.value === 0) return;
  cancelAnimationFrame(rafId);
  cancelSnap();
  settled.value = false;
  settledSlot.value = -1;
  const from = el.scrollTop;
  const to = target;
  if (Math.abs(to - from) < 1) {
    el.scrollTop = target;
    ownScrollPending++;
    animating = false;
    finishAnimation();
    return;
  }
  animating = true;
  ownScrollPending++;
  const t0 = performance.now();
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const frame = (now) => {
    const t = Math.min(1, (now - t0) / duration);
    const cursor = from + (to - from) * easeOutCubic(t);
    el.scrollTop = cursor;
    syncMask();
    if (t < 1) {
      rafId = requestAnimationFrame(frame);
    } else {
      animating = false;
      finishAnimation();
    }
  };
  rafId = requestAnimationFrame(frame);
};

const stepBy = (dir) => {
  const el = scrollEl.value;
  if (!el || itemCount.value === 0) return;
  if (props.wrap) {
    const raw = currentTargetRaw !== null
      ? currentTargetRaw + dir
      : Math.round(rawFloat()) + dir;
    const target = pickTargetCopy(el.scrollTop, base.value + raw * ITEM_HEIGHT, dir);
    currentTargetRaw = Math.round((target - base.value) / ITEM_HEIGHT);
    animateTo(target, STEP_MS);
  } else {
    const current = currentTargetRaw !== null ? currentTargetRaw : selectedIndex();
    const target = clampIndex(current + dir);
    if (target === current) return;
    currentTargetRaw = target;
    animateTo(scrollTopForIndex(target), STEP_MS);
  }
};

const onItemClick = (slot) => {
  const label = listItems.value[slot];
  if (!label) return;
  currentTargetRaw = null;
  const el = scrollEl.value;
  const from = el?.scrollTop ?? 0;
  const target = slot * ITEM_HEIGHT - OFFSET;
  const dir = target >= from ? 1 : -1;
  const finalTarget = pickTargetCopy(from, target, dir);
  const distance = Math.abs(finalTarget - from);
  animateTo(finalTarget, Math.min(400, STEP_MS + distance * 0.25));
};

const onKeydown = (event) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (props.canScrollUp) stepBy(-1);
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (props.canScrollDown) stepBy(1);
  }
};

const wheelDeltaPx = (event) => {
  if (event.deltaMode === 1) return event.deltaY * 16;
  if (event.deltaMode === 2) return event.deltaY * COLUMNS_HEIGHT;
  return event.deltaY;
};

const onWheel = (event) => {
  interruptScroll();
  const now = performance.now();
  settled.value = false;
  settledSlot.value = -1;
  touchContact = true;
  fingerOffConfirmed = false;
  momentumDetected = false;
  if (touchContactActive && now - lastTouchPointerTime > 3000) {
    touchContactActive = false;
  }
  if (now - lastWheelTime > GESTURE_RESET_MS) {
    gestureMode = 'none';
    wheelAccum = 0;
    eventCount = 0;
  }
  lastWheelTime = now;
  eventCount++;
  const delta = wheelDeltaPx(event);

  if (gestureMode === 'none') {
    gestureMode = Math.abs(delta) >= MOUSE_THRESHOLD ? 'mouse' : 'trackpad';
  } else if (gestureMode === 'mouse' && eventCount >= 6 && Math.abs(delta) < 25) {
    gestureMode = 'trackpad';
  }

  if (gestureMode === 'mouse') {
    event.preventDefault();
    cancelSnap();
    if (Math.abs(delta) >= MOUSE_THRESHOLD) {
      stepBy(delta > 0 ? 1 : -1);
      wheelAccum = 0;
    } else {
      wheelAccum += delta;
      if (Math.abs(wheelAccum) >= ITEM_STEP) {
        stepBy(wheelAccum > 0 ? 1 : -1);
        wheelAccum = 0;
      }
    }
  }
};

const isContactPointer = (event) =>
  event.pointerType === 'touch' || event.pointerType === 'pen' || event.pointerType === 'touchpad';

const onPointerDown = (event) => {
  if (!isContactPointer(event)) return;
  interruptScroll();
  lastTouchPointerTime = performance.now();
  touchContactActive = true;
  touchContact = true;
  fingerOffConfirmed = false;
  momentumDetected = false;
  if (event.pointerType === 'touch' || event.pointerType === 'pen') {
    gestureMode = 'touch';
  }
};

const onPointerMove = (event) => {
  if (!isContactPointer(event)) return;
  if (event.pointerType !== 'touchpad' && event.buttons === 0) return;
  interruptScroll();
  lastTouchPointerTime = performance.now();
  touchContactActive = true;
  touchContact = true;
};

const onPointerUp = (event) => {
  if (!isContactPointer(event)) return;
  lastTouchPointerTime = performance.now();
  touchContactActive = true;
  touchContact = false;
  fingerOffConfirmed = true;
  cancelBackstop();
  if (gestureMode === 'touch' || (!scrollEndActive && gestureMode === 'trackpad')) {
    scheduleSnap();
  }
};

const startRepeating = (dir) => {
  stopRepeating();
  repeatDelayTimer = window.setTimeout(() => {
    stepBy(dir);
    repeatTimer = window.setInterval(() => stepBy(dir), REPEAT_INTERVAL_MS);
  }, REPEAT_DELAY_MS);
};

const stopRepeating = () => {
  window.clearTimeout(repeatDelayTimer);
  window.clearInterval(repeatTimer);
  repeatDelayTimer = 0;
  repeatTimer = 0;
};

const jumpToValue = async () => {
  await nextTick();
  const el = scrollEl.value;
  if (!el) return;
  cancelAnimationFrame(rafId);
  cancelSnap();
  cancelBackstop();
  animating = false;
  currentTargetRaw = null;
  ownScrollPending++;
  el.scrollTop = scrollTopForIndex(props.value);
  syncMask();
  lastEmitted = props.value;
  setSettled();
};

const flush = () => {
  if (!scrollEl.value) return;
  cancelSnap();
  cancelBackstop();
  animating = false;
  currentTargetRaw = null;
  const idx = selectedIndex();
  if (idx !== lastEmitted) {
    emitChange(idx);
  }
  setSettled();
};

defineExpose({ flush });

watch([() => props.items, () => props.value], () => {
  if (selfChange) {
    selfChange = false;
    return;
  }
  jumpToValue();
});

onMounted(() => {
  scrollEl.value?.addEventListener('wheel', onWheel, { passive: false });
  if (scrollEndActive) {
    scrollEl.value?.addEventListener('scrollend', onScrollEnd);
  }
  window.addEventListener('pointerdown', onPointerDown, true);
  window.addEventListener('pointermove', onPointerMove, true);
  window.addEventListener('pointerup', onPointerUp, true);
  window.addEventListener('pointercancel', onPointerUp, true);
  jumpToValue();
});

onUnmounted(() => {
  scrollEl.value?.removeEventListener('wheel', onWheel);
  if (scrollEndActive) {
    scrollEl.value?.removeEventListener('scrollend', onScrollEnd);
  }
  window.removeEventListener('pointerdown', onPointerDown, true);
  window.removeEventListener('pointermove', onPointerMove, true);
  window.removeEventListener('pointerup', onPointerUp, true);
  window.removeEventListener('pointercancel', onPointerUp, true);
  cancelAnimationFrame(rafId);
  cancelSnap();
  cancelBackstop();
  stopRepeating();
});
</script>

<style scoped>
  .picker-col-root {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
  }

  .picker-col-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    overscroll-behavior: contain;
    touch-action: pan-y;
    outline: none;
  }

  .picker-col-scroll::-webkit-scrollbar {
    display: none;
  }

  .picker-col-scroll:focus-visible {
    box-shadow: inset 0 0 0 1px var(--accent-base, var(--accent-aa-fill));
  }

  .picker-list {
    position: relative;
    width: 100%;
  }

  .picker-item {
    height: 40px;
    min-height: 40px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: var(--picker-item-justify, center);
    font-size: 14px;
    color: var(--text-secondary);
    width: 100%;
    margin: 0;
    padding: 3px 0 6px;
    padding-left: var(--picker-item-padding-left, 0);
    border-radius: 4px;
    position: relative;
    z-index: 1;
    isolation: isolate;
    transition: color 0.1s;
  }

  .picker-item:hover {
    color: var(--text-primary);
  }

  .picker-item::before {
    content: '';
    position: absolute;
    inset: 2px 4px;
    border-radius: 4px;
    z-index: -1;
  }

  .picker-item:hover::before {
    background: var(--subtle-secondary);
  }

  .picker-item.empty {
    pointer-events: none;
  }

  .picker-item.empty::before {
    display: none;
  }

  .picker-mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 40px;
    overflow: hidden;
    pointer-events: none;
    z-index: 2;
  }

  .picker-mask-list {
    position: absolute;
    top: -120px;
    left: 0;
    right: 0;
    will-change: transform;
  }

  .picker-mask-item,
  .picker-mask-item:hover {
    color: var(--accent-aa-text, var(--accent-text));
  }

  .picker-mask-item::before {
    display: none;
  }

  .picker-mask-item.settled::before {
    display: block;
    inset: 2px 8px;
    background: rgba(255, 255, 255, 0.14);
  }

  .picker-col-root:first-child .picker-mask-item.settled::before {
    left: 4px;
  }

  .picker-col-root:last-child .picker-mask-item.settled::before {
    right: 4px;
  }

  .picker-arrow {
    position: absolute;
    left: 0;
    right: 0;
    height: 34px;
    z-index: 3;
    --SubtleButtonBackground: var(--ctrl-solid-fill);
    --SubtleButtonBackgroundPointerOver: var(--ctrl-solid-fill);
    --SubtleButtonBackgroundPressed: var(--ctrl-solid-fill);
    --SubtleButtonBackgroundDisabled: var(--ctrl-solid-fill);
    --SubtleButtonForeground: var(--text-secondary);
    --SubtleButtonForegroundPointerOver: var(--text-primary);
    --SubtleButtonForegroundPressed: var(--text-primary);
  }

  .picker-arrow-up {
    top: 0;
  }

  .picker-arrow-down {
    bottom: 0;
  }
</style>
