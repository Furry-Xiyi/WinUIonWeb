<template>
  <div ref="rootEl" v-bind="rootAttrs" class="picker-col-root" :class="[attrs.class, { 'column-pointer-over': columnPointerOver }]" :style="attrs.style">
    <div
      ref="scrollEl"
      class="picker-col-scroll"
      tabindex="0"
      role="listbox"
      :aria-label="automationName"
      :aria-activedescendant="activeItemId">
      <div class="picker-list" :style="listStyle">
        <div v-for="(item, slot) in listItems" :key="slot" class="picker-item-slot" :data-slot="slot">
          <div
            :id="`${columnId}-item-${slot}`"
            class="picker-item"
            :class="itemClasses(item, slot)"
            role="option"
            :aria-hidden="item === null"
            :aria-selected="settled && slot === settledSlot">
            {{ item === null ? '' : itemText(item) }}
          </div>
        </div>
      </div>
    </div>
    <div class="picker-mask" :style="maskStyle" aria-hidden="true">
      <div ref="maskEl" class="picker-list picker-mask-list" :style="listStyle">
        <div v-for="(item, slot) in listItems" :key="slot" class="picker-item-slot">
          <div class="picker-item picker-mask-item" :class="itemClasses(item, slot)">
            {{ item === null ? '' : itemText(item) }}
          </div>
        </div>
      </div>
    </div>
    <svg class="picker-filter" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <filter :id="overlayFilterId" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
          <feFlood style="flood-color: var(--picker-selected-foreground)" result="replacement" />
          <feComposite in="replacement" in2="SourceAlpha" operator="in" />
        </filter>
      </defs>
    </svg>
    <div
      class="picker-arrow-host picker-arrow-up"
      :class="{ 'picker-arrow-unavailable': !canScrollUp }"
      data-xaml-background="{ThemeResource LoopingSelectorUpDownButtonBackground}"
      v-acrylic-brush.host-backdrop="NavigationBackgroundStyle"
      :style="NavigationBackgroundStyle">
      <RepeatButton
        class="picker-arrow"
        Background="Transparent"
        Foreground="{ThemeResource LoopingSelectorUpDownButtonForeground}"
        Style="{StaticResource DateTimePickerFlyoutLoopingSelectorNavigationButtonStyle}"
        IsEnabled="{x:Bind canScrollUp, Mode=OneWay}"
        Content="&#xEDDB;"
        FontFamily="{ThemeResource SymbolThemeFontFamily}"
        FontSize="8"
        Height="34"
        Padding="0"
        Margin="0"
        BorderThickness="0"
        CornerRadius="0"
        IsTabStop="False"
        Click="OnUpButtonClicked">
        <span class="picker-arrow-glyph" aria-hidden="true">&#xEDDB;</span>
      </RepeatButton>
    </div>
    <div
      class="picker-arrow-host picker-arrow-down"
      :class="{ 'picker-arrow-unavailable': !canScrollDown }"
      data-xaml-background="{ThemeResource LoopingSelectorUpDownButtonBackground}"
      v-acrylic-brush.host-backdrop="NavigationBackgroundStyle"
      :style="NavigationBackgroundStyle">
      <RepeatButton
        class="picker-arrow"
        Background="Transparent"
        Foreground="{ThemeResource LoopingSelectorUpDownButtonForeground}"
        Style="{StaticResource DateTimePickerFlyoutLoopingSelectorNavigationButtonStyle}"
        IsEnabled="{x:Bind canScrollDown, Mode=OneWay}"
        Content="&#xEDDC;"
        FontFamily="{ThemeResource SymbolThemeFontFamily}"
        FontSize="8"
        Height="34"
        Padding="0"
        Margin="0"
        BorderThickness="0"
        CornerRadius="0"
        IsTabStop="False"
        Click="OnDownButtonClicked">
        <span class="picker-arrow-glyph" aria-hidden="true">&#xEDDC;</span>
      </RepeatButton>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, provide, ref, useAttrs, watch } from 'vue';
import RepeatButton from './RepeatButton.vue';
import { useAcrylicBrushStyle } from './AcrylicBrush';
import { vAcrylicBrush } from './acrylicBrushVisual';
import { resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime';
import { useI18n } from './i18n/index';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  Items: { type: [Array, String], default: () => [] },
  SelectedIndex: { type: [Number, String], default: 0 },
  ShouldLoop: { type: [Boolean, String], default: true },
  IsEnabled: { type: [Boolean, String], default: true },
  AutomationName: { type: String, default: '' },
  UpLabel: { type: String, default: '' },
  DownLabel: { type: String, default: '' }
});

const emit = defineEmits(['update:SelectedIndex', 'SelectionChanged']);
const instance = getCurrentInstance();
const NavigationBackgroundStyle = useAcrylicBrushStyle('{ThemeResource LoopingSelectorUpDownButtonBackground}', instance);
const attrs = useAttrs();
const { t } = useI18n();
const resolve = (value) => resolveXamlValue(value, instance);
const booleanValue = (value) => value === true || value === 'True' || value === 'true';
const items = computed(() => {
  const value = resolve(props.Items);
  return Array.isArray(value) ? value : [];
});
const shouldLoop = computed(() => booleanValue(resolve(props.ShouldLoop)));
const isEnabled = computed(() => booleanValue(resolve(props.IsEnabled)));
const boundIndex = computed(() => {
  const value = Number(resolve(props.SelectedIndex));
  return Number.isFinite(value) ? Math.max(0, Math.min(items.value.length - 1, Math.trunc(value))) : 0;
});
const automationName = computed(() => String(resolve(props.AutomationName) || ''));
const upLabel = computed(() => String(resolve(props.UpLabel) || t('control.loopingselector.previous')));
const downLabel = computed(() => String(resolve(props.DownLabel) || t('control.loopingselector.next')));
const rootAttrs = computed(() => {
  const { class: _class, style: _style, SelectionChanged: _changed, ...rest } = attrs;
  return rest;
});

const ITEM_HEIGHT = 40;
const VIEWPORT_HEIGHT = ITEM_HEIGHT * 7;
const REPEAT_COUNT = 5;
const rootEl = ref(null);
const columnPointerOver = ref(false);
const scrollEl = ref(null);
const maskEl = ref(null);
const localIndex = ref(boundIndex.value);
const viewportHeight = ref(VIEWPORT_HEIGHT);
const centerOffset = computed(() => Math.max(0, (viewportHeight.value - ITEM_HEIGHT) / 2));
const settled = ref(false);
const settledSlot = ref(-1);
const hoveredSlot = ref(-1);
const pressedSlot = ref(-1);
const columnId = `looping-selector-${instance?.uid ?? 0}`;
const overlayFilterId = `${columnId}-monochrome`;
const itemClasses = (item, slot) => ({
  empty: item === null,
  selected: settled.value && slot === settledSlot.value,
  hovered: slot === hoveredSlot.value,
  pressed: slot === pressedSlot.value
});
const activeItemId = computed(() => settledSlot.value >= 0 ? `${columnId}-item-${settledSlot.value}` : undefined);
const canScrollUp = computed(() => isEnabled.value && items.value.length > 1 && (shouldLoop.value || localIndex.value > 0));
const canScrollDown = computed(() => isEnabled.value && items.value.length > 1 && (shouldLoop.value || localIndex.value < items.value.length - 1));
const slotCount = computed(() => shouldLoop.value ? items.value.length * REPEAT_COUNT : items.value.length);
const contentHeight = computed(() => slotCount.value * ITEM_HEIGHT + centerOffset.value * 2);
const listStyle = computed(() => ({ height: `${contentHeight.value}px`, padding: `${centerOffset.value}px 0` }));
const maskStyle = computed(() => ({ clipPath: `inset(${centerOffset.value}px 0 ${centerOffset.value}px)`, filter: `url("#${overlayFilterId}")` }));
const listItems = computed(() => {
  if (!items.value.length) return [];
  return Array.from({ length: slotCount.value }, (_, slot) => items.value[slot % items.value.length] ?? null);
});
const itemText = (item) => {
  if (item === null || item === undefined) return '';
  if (typeof item === 'string' || typeof item === 'number') return String(item);
  return String(item.PrimaryText ?? item.Text ?? '');
};
const normalizedIndex = (index) => {
  const count = items.value.length;
  if (!count) return 0;
  return shouldLoop.value ? ((index % count) + count) % count : Math.max(0, Math.min(count - 1, index));
};
const canonicalSlot = (index) => (shouldLoop.value ? items.value.length * 2 : 0) + normalizedIndex(index);
const selectedSlot = () => Math.round((scrollEl.value?.scrollTop ?? 0) / ITEM_HEIGHT);
const getSelectedIndex = () => items.value.length ? normalizedIndex(selectedSlot()) : 0;

let frameId = 0;
let snapTimer = 0;
let animating = false;
let targetSlot = null;
let lastNotifiedIndex = boundIndex.value;
let pointer = null;
let suppressClickUntil = 0;
let disposed = false;
let resizeObserver = null;
const nativeListeners = [];

const syncMask = () => {
  if (scrollEl.value && maskEl.value) maskEl.value.style.transform = `translate3d(0, ${-scrollEl.value.scrollTop}px, 0)`;
};
const resetSettleTimer = () => {
  window.clearTimeout(snapTimer);
  snapTimer = 0;
};
const cancelAnimation = () => {
  cancelAnimationFrame(frameId);
  frameId = 0;
  animating = false;
  targetSlot = null;
};
const cancelMotion = () => {
  resetSettleTimer();
  cancelAnimation();
};
const notifySelection = (index) => {
  localIndex.value = index;
  if (index === lastNotifiedIndex) return;
  const previous = lastNotifiedIndex;
  lastNotifiedIndex = index;
  const args = {
    RemovedItems: previous >= 0 && previous < items.value.length ? [items.value[previous]] : [],
    AddedItems: items.value.length ? [items.value[index]] : [],
    OldSelectedIndex: previous,
    SelectedIndex: index
  };
  updateXamlBinding(props.SelectedIndex, index, instance);
  emit('update:SelectedIndex', index);
  emit('SelectionChanged', exposedApi, args);
  resolveXamlHandler(attrs.SelectionChanged, instance)?.(exposedApi, args);
};
const rebase = () => {
  const el = scrollEl.value;
  const count = items.value.length;
  if (!el || !shouldLoop.value || !count) return;
  const block = count * ITEM_HEIGHT;
  if (el.scrollTop < block || el.scrollTop >= block * 4) {
    const fractionalSlot = el.scrollTop / ITEM_HEIGHT;
    const wrappedSlot = ((fractionalSlot % count) + count) % count;
    el.scrollTop = (count * 2 + wrappedSlot) * ITEM_HEIGHT;
  }
};
const finishMotion = () => {
  animating = false;
  frameId = 0;
  targetSlot = null;
  rebase();
  syncMask();
  settledSlot.value = selectedSlot();
  settled.value = true;
  notifySelection(getSelectedIndex());
};
const clampSlot = (slot) => shouldLoop.value
  ? Math.max(0, Math.min(slotCount.value - 1, slot))
  : normalizedIndex(slot);
const animateTo = (slot, duration = 150) => {
  const el = scrollEl.value;
  if (!el || !items.value.length || !isEnabled.value) return;
  resetSettleTimer();
  cancelAnimationFrame(frameId);
  targetSlot = clampSlot(slot);
  const from = el.scrollTop;
  const target = targetSlot * ITEM_HEIGHT;
  if (Math.abs(target - from) < 0.5) {
    el.scrollTop = target;
    finishMotion();
    return;
  }
  settled.value = false;
  animating = true;
  const started = performance.now();
  const frame = (now) => {
    const progress = Math.min(1, (now - started) / duration);
    el.scrollTop = from + (target - from) * (1 - (1 - progress) ** 3);
    syncMask();
    if (progress < 1) frameId = requestAnimationFrame(frame);
    else finishMotion();
  };
  frameId = requestAnimationFrame(frame);
};
const snap = () => {
  if (!scrollEl.value || !items.value.length || pointer) return;
  animateTo(selectedSlot(), 120);
};
const scheduleSnap = () => {
  resetSettleTimer();
  if (!pointer && !animating) snapTimer = window.setTimeout(snap, 100);
};
const stepBy = (direction) => {
  if (!items.value.length || !isEnabled.value) return;
  if (direction < 0 && !canScrollUp.value || direction > 0 && !canScrollDown.value) return;
  const slot = (targetSlot ?? selectedSlot()) + direction;
  if (shouldLoop.value && (slot < items.value.length || slot >= items.value.length * 4)) {
    rebase();
    animateTo(selectedSlot() + direction);
  } else animateTo(slot);
};
const onScroll = () => {
  syncMask();
  if (animating) return;
  settled.value = false;
  localIndex.value = getSelectedIndex();
  if (!pointer) {
    rebase();
    syncMask();
    scheduleSnap();
  }
};
const onWheel = (event) => {
  if (!isEnabled.value || !items.value.length || !event.deltaY) return;
  event.preventDefault();
  const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * viewportHeight.value : event.deltaY;
  if (Math.abs(delta) >= ITEM_HEIGHT) {
    stepBy(delta > 0 ? 1 : -1);
    return;
  }
  cancelMotion();
  settled.value = false;
  scrollEl.value.scrollTop += delta;
  rebase();
  syncMask();
  scheduleSnap();
};
const onKeyDown = (event) => {
  if (!isEnabled.value || event.altKey) return;
  let direction = 0;
  if (event.key === 'ArrowUp') direction = -1;
  else if (event.key === 'ArrowDown') direction = 1;
  if (direction) {
    event.preventDefault();
    stepBy(direction);
  } else if (event.key === 'PageUp' || event.key === 'PageDown') {
    event.preventDefault();
    const pageSize = Math.max(1, Math.floor(viewportHeight.value / ITEM_HEIGHT));
    animateTo((targetSlot ?? selectedSlot()) + (event.key === 'PageUp' ? -pageSize : pageSize), 200);
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    const index = event.key === 'Home' ? 0 : items.value.length - 1;
    animateTo(canonicalSlot(index), 200);
  }
};
const onItemClick = (event) => {
  if (performance.now() < suppressClickUntil || !isEnabled.value) return;
  const row = event.target.closest('.picker-item-slot[data-slot]');
  if (!row || !scrollEl.value?.contains(row)) return;
  const slot = Number(row.dataset.slot);
  if (!Number.isFinite(slot) || listItems.value[slot] === null) return;
  animateTo(slot, Math.min(300, 150 + Math.abs(slot - selectedSlot()) * 20));
};
const onPointerDown = (event) => {
  if (!isEnabled.value || !items.value.length || event.button !== 0 || pointer) return;
  if (!scrollEl.value?.contains(event.target)) return;
  cancelMotion();
  scrollEl.value.focus({ preventScroll: true });
  pointer = {
    id: event.pointerId,
    type: event.pointerType,
    startY: event.clientY,
    startScroll: scrollEl.value.scrollTop,
    lastY: event.clientY,
    lastTime: performance.now(),
    velocity: 0,
    moved: false,
    slot: Number(event.target.closest('.picker-item-slot[data-slot]')?.dataset.slot)
  };
  pressedSlot.value = Number.isFinite(pointer.slot) ? pointer.slot : -1;
  scrollEl.value.setPointerCapture(event.pointerId);
};
const onPointerMove = (event) => {
  const row = event.target.closest('.picker-item-slot[data-slot]');
  hoveredSlot.value = event.pointerType === 'mouse' && row && scrollEl.value?.contains(row) ? Number(row.dataset.slot) : -1;
  if (!pointer || pointer.id !== event.pointerId || !scrollEl.value) return;
  const distance = pointer.startY - event.clientY;
  if (!pointer.moved && Math.abs(distance) < 4) return;
  event.preventDefault();
  pointer.moved = true;
  settled.value = false;
  const now = performance.now();
  pointer.velocity = (pointer.lastY - event.clientY) / Math.max(1, now - pointer.lastTime);
  pointer.lastY = event.clientY;
  pointer.lastTime = now;
  scrollEl.value.scrollTop = pointer.startScroll + distance;
  syncMask();
};
const releasePointer = (cancelled = false) => {
  pressedSlot.value = -1;
  if (cancelled || pointer?.type !== 'mouse') hoveredSlot.value = -1;
  if (!pointer) return;
  const contact = pointer;
  pointer = null;
  if (scrollEl.value?.hasPointerCapture(contact.id)) scrollEl.value.releasePointerCapture(contact.id);
  if (contact.moved) {
    suppressClickUntil = performance.now() + 250;
    const velocity = !cancelled && performance.now() - contact.lastTime < 100 ? contact.velocity : 0;
    const projected = (scrollEl.value?.scrollTop ?? 0) + Math.max(-320, Math.min(320, velocity * 180));
    animateTo(Math.round(projected / ITEM_HEIGHT), Math.min(350, 150 + Math.abs(velocity) * 80));
  } else if (!cancelled && Number.isFinite(contact.slot)) {
    suppressClickUntil = performance.now() + 250;
    animateTo(contact.slot, Math.min(300, 150 + Math.abs(contact.slot - selectedSlot()) * 20));
  } else scheduleSnap();
};
const onPointerUp = (event) => {
  if (pointer?.id === event.pointerId) releasePointer();
};
const onPointerCancel = (event) => {
  if (pointer?.id === event.pointerId) releasePointer(true);
};
const jumpToSelected = async () => {
  await nextTick();
  if (disposed || !scrollEl.value) return;
  cancelMotion();
  scrollEl.value.scrollTop = canonicalSlot(boundIndex.value) * ITEM_HEIGHT;
  localIndex.value = boundIndex.value;
  lastNotifiedIndex = boundIndex.value;
  settledSlot.value = selectedSlot();
  settled.value = true;
  syncMask();
};
const flush = () => {
  if (!scrollEl.value || !items.value.length) return boundIndex.value;
  const target = targetSlot;
  releasePointer(true);
  cancelMotion();
  scrollEl.value.scrollTop = clampSlot(target ?? selectedSlot()) * ITEM_HEIGHT;
  finishMotion();
  return getSelectedIndex();
};
const focus = () => scrollEl.value?.focus({ preventScroll: true });
const containsFocus = () => Boolean(rootEl.value?.contains(document.activeElement));
const onWindowBlur = () => {
  columnPointerOver.value = false;
  hoveredSlot.value = -1;
  releasePointer(true);
  flush();
  cancelArrowPresses();
};
const cancelArrowPresses = () => {
  for (const arrow of rootEl.value?.querySelectorAll('.picker-arrow') ?? []) {
    arrow.dispatchEvent(new PointerEvent('pointercancel', { bubbles: false }));
  }
};
const bind = (target, name, handler, options) => {
  target?.addEventListener(name, handler, options);
  nativeListeners.push(() => target?.removeEventListener(name, handler, options));
};
const exposedApi = {
  SelectedIndex: localIndex,
  Flush: flush,
  GetSelectedIndex: getSelectedIndex,
  GetPendingIndex: () => normalizedIndex(targetSlot ?? selectedSlot()),
  Focus: focus,
  ContainsFocus: containsFocus
};
provide(xamlScopeKey, {
  canScrollUp,
  canScrollDown,
  upLabel,
  downLabel,
  OnUpButtonClicked: () => stepBy(-1),
  OnDownButtonClicked: () => stepBy(1)
});
defineExpose(exposedApi);

watch([items, shouldLoop], jumpToSelected, { deep: true });
watch(viewportHeight, jumpToSelected);
watch(boundIndex, (index) => {
  if (index !== lastNotifiedIndex) jumpToSelected();
});
watch(isEnabled, (enabled) => {
  if (!enabled) {
    columnPointerOver.value = false;
    hoveredSlot.value = -1;
    releasePointer(true);
    cancelMotion();
  }
});
watch([upLabel, downLabel], () => {
  for (const arrow of rootEl.value?.querySelectorAll('.picker-arrow') ?? []) {
    arrow.setAttribute('aria-label', arrow.closest('.picker-arrow-up') ? upLabel.value : downLabel.value);
  }
});
onMounted(() => {
  resizeObserver = new ResizeObserver((entries) => {
    const height = entries[0]?.contentRect.height;
    if (height && Math.abs(viewportHeight.value - height) > 0.5) viewportHeight.value = height;
  });
  resizeObserver.observe(rootEl.value);
  viewportHeight.value = rootEl.value.clientHeight || VIEWPORT_HEIGHT;
  bind(rootEl.value, 'pointerenter', (event) => { columnPointerOver.value = isEnabled.value && event.pointerType !== 'touch'; });
  bind(rootEl.value, 'pointerleave', () => { columnPointerOver.value = false; });
  bind(rootEl.value, 'pointerdown', (event) => { if (event.pointerType === 'touch') columnPointerOver.value = false; });
  bind(rootEl.value, 'pointercancel', () => { columnPointerOver.value = false; });
  bind(scrollEl.value, 'scroll', onScroll, { passive: true });
  bind(scrollEl.value, 'wheel', onWheel, { passive: false });
  bind(scrollEl.value, 'keydown', onKeyDown);
  bind(scrollEl.value, 'click', onItemClick);
  bind(scrollEl.value, 'pointerdown', onPointerDown);
  bind(scrollEl.value, 'pointermove', onPointerMove, { passive: false });
  bind(scrollEl.value, 'pointerleave', () => { hoveredSlot.value = -1; });
  bind(scrollEl.value, 'pointerup', onPointerUp);
  bind(scrollEl.value, 'pointercancel', onPointerCancel);
  bind(scrollEl.value, 'lostpointercapture', onPointerCancel);
  bind(window, 'blur', onWindowBlur);
  bind(window, 'pointerup', cancelArrowPresses, true);
  bind(window, 'pointercancel', cancelArrowPresses);
  jumpToSelected();
  const arrows = rootEl.value?.querySelectorAll('.picker-arrow') ?? [];
  for (const arrow of arrows) {
    arrow.setAttribute('aria-label', arrow.closest('.picker-arrow-up') ? upLabel.value : downLabel.value);
    bind(arrow, 'lostpointercapture', cancelArrowPresses);
  }
});
onBeforeUnmount(() => {
  disposed = true;
  if (pointer && scrollEl.value?.hasPointerCapture(pointer.id)) scrollEl.value.releasePointerCapture(pointer.id);
  pointer = null;
  resizeObserver?.disconnect();
  cancelMotion();
  for (const unbind of nativeListeners) unbind();
});
</script>

<style scoped>
.picker-col-root {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  height: var(--picker-columns-height, 280px);
  overflow: hidden;
}
.picker-col-scroll {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  overscroll-behavior: contain;
  touch-action: none;
  user-select: none;
  outline: none;
  /* MonochromaticOverlayPresenter replaces the source pixels in the 40px
     selection band. Hide those pixels beneath our recolored copy as well. */
  mask-image: linear-gradient(to bottom, black calc(50% - 20px), transparent calc(50% - 20px), transparent calc(50% + 20px), black calc(50% + 20px));
}
.picker-col-scroll::-webkit-scrollbar { display: none; }
.picker-col-scroll:focus-visible {
  outline: 2px solid var(--TextFillColorPrimaryBrush, var(--text-primary));
  outline-offset: -2px;
}
.picker-list {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}
.picker-item-slot {
  width: 100%;
  height: 40px;
  min-height: 40px;
  box-sizing: border-box;
  padding: 2px 4px;
}
.picker-item {
  display: flex;
  align-items: center;
  justify-content: var(--picker-item-justify, center);
  height: 36px;
  min-width: 0;
  width: 100%;
  padding: var(--picker-item-padding, 3px 0 6px);
  padding-left: var(--picker-item-padding-left, 0);
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  font-size: 14px;
  color: var(--LoopingSelectorItemForeground, var(--TextFillColorPrimaryBrush));
  border-radius: var(--ControlCornerRadius, 4px);
}
.picker-item.selected {
  color: var(--LoopingSelectorItemForegroundSelected, var(--TextFillColorPrimaryBrush));
  background: var(--LoopingSelectorItemBackgroundSelected, var(--SubtleFillColorSecondaryBrush));
}
.picker-item:not(.selected):hover,
.picker-item.hovered:not(.selected) {
  color: var(--LoopingSelectorItemForegroundPointerOver, var(--TextFillColorPrimaryBrush));
  background: var(--LoopingSelectorItemBackgroundPointerOver, var(--SubtleFillColorSecondaryBrush));
}
.picker-item:not(.selected):active,
.picker-item.pressed:not(.selected) {
  color: var(--LoopingSelectorItemForegroundPressed, var(--TextFillColorSecondaryBrush));
  background: var(--LoopingSelectorItemBackgroundPressed, var(--SubtleFillColorTertiaryBrush));
}
.picker-item.empty { color: transparent; background: transparent; pointer-events: none; }
.picker-mask {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 3;
}
.picker-mask-list { will-change: transform; }
.picker-filter { position: absolute; pointer-events: none; }
@media (forced-colors: active) {
  .picker-mask { filter: none !important; }
  .picker-item.selected { color: HighlightText; background: Highlight; }
}
.picker-col-root :deep(.picker-arrow-host) {
  position: absolute;
  z-index: 4;
  left: 0;
  right: 0;
  width: 100%;
  min-width: 0;
  height: 34px;
  min-height: 34px;
  overflow: hidden;
  visibility: hidden;
}
.picker-col-root.column-pointer-over :deep(.picker-arrow-host:not(.picker-arrow-unavailable)) { visibility: visible; }
.picker-col-root :deep(.picker-arrow.win-btn) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  height: 34px;
  min-height: 34px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif;
  font-size: 8px;
  background: transparent;
  color: var(--LoopingSelectorUpDownButtonForeground, var(--TextFillColorSecondaryBrush));
  --ButtonBackground: transparent;
  --ButtonBackgroundPointerOver: var(--LoopingSelectorUpDownButtonBackgroundPointerOver, transparent);
  --ButtonBackgroundPressed: var(--LoopingSelectorUpDownButtonBackgroundPressed, transparent);
  --ButtonBackgroundDisabled: transparent;
  --ButtonForegroundPointerOver: var(--LoopingSelectorUpDownButtonForegroundPointerOver, var(--TextFillColorPrimaryBrush));
  --ButtonForegroundPressed: var(--LoopingSelectorUpDownButtonForegroundPressed, var(--TextFillColorPrimaryBrush));
  --ButtonForegroundDisabled: var(--LoopingSelectorUpDownButtonForeground, var(--TextFillColorSecondaryBrush));
  --ButtonBorderBrush: transparent;
  --ButtonBorderBrushPointerOver: transparent;
  --ButtonBorderBrushPressed: transparent;
  --ButtonBorderBrushDisabled: transparent;
}
.picker-col-root :deep(.picker-arrow.win-btn::after) { display: none; }
.picker-col-root :deep(.picker-arrow.win-btn > .win-button-content-presenter) {
  padding: 0 !important;
  border-width: 0 !important;
  border-radius: 0 !important;
}
.picker-col-root :deep(.picker-arrow.win-btn:hover:not(:disabled)) {
  color: var(--LoopingSelectorUpDownButtonForegroundPointerOver, var(--TextFillColorPrimaryBrush));
}
.picker-col-root :deep(.picker-arrow.win-btn:active:not(:disabled)),
.picker-col-root :deep(.picker-arrow.win-btn.is-pressed:not(:disabled)) {
  color: var(--LoopingSelectorUpDownButtonForegroundPressed, var(--TextFillColorPrimaryBrush));
}
.picker-arrow-glyph { display: block; transform: scale(1); }
.picker-col-root :deep(.picker-arrow.win-btn:active:not(:disabled) .picker-arrow-glyph),
.picker-col-root :deep(.picker-arrow.win-btn.is-pressed:not(:disabled) .picker-arrow-glyph) {
  transform: scale(.875);
  transition: transform 0s 16ms;
}
.picker-col-root :deep(.picker-arrow-up) { top: 0; }
.picker-col-root :deep(.picker-arrow-down) { bottom: 0; }
</style>
