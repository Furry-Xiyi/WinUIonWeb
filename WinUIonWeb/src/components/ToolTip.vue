<template>
  <span
    v-if="!IsServiceHost"
    ref="anchorRef"
    class="win-tooltip-anchor"
    :aria-describedby="isVisible ? tooltipId : undefined"
    :aria-label="contentText || undefined"
    @pointerenter="onPointerEnter"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
    @pointerdown="onPointerDown"
    @focusin="onFocusIn"
    @focusout="onFocusOut">
    <slot name="target"><slot></slot></slot>
  </span>

  <Teleport :to="teleportTarget">
    <Transition name="win-tooltip">
      <div
        v-if="isVisible"
        :id="tooltipId"
        ref="tooltipRef"
        class="win-tooltip"
        :class="[themeClass, `placement-${actualPlacement.toLowerCase()}`]"
        :style="tooltipStyle"
        role="tooltip"
        @pointerenter="onToolTipPointerEnter"
        @pointerleave="onToolTipPointerLeave">
        <slot v-if="$slots.content" name="content"></slot>
        <WinTextBlock v-else :Text="contentText" TextWrapping="WrapWholeWords" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, unref, useSlots, watch } from 'vue';
import type { ComponentPublicInstance, CSSProperties, Ref } from 'vue';
import WinTextBlock from './WinTextBlock.vue';

type PlacementKey = 'bottom' | 'left' | 'mouse' | 'right' | 'top';
type Position = { top: number; left: number };
type Point = { x: number; y: number };
type PlacementTargetValue = HTMLElement | ComponentPublicInstance | { value?: unknown; $el?: unknown } | string | null;
type PlacementRectValue = { x?: number; y?: number; left?: number; top?: number; width?: number; height?: number; getBoundingClientRect?: () => DOMRect } | string | null;

defineOptions({ inheritAttrs: false });

const props = defineProps({
  Content: { type: [String, Number, Object], default: '' },
  IsOpen: { type: Boolean, default: undefined },
  IsEnabled: { type: Boolean, default: true },
  Placement: { type: String, default: 'Mouse' },
  PlacementTarget: { type: [Object, String], default: null },
  PlacementPoint: { type: Object, default: null },
  PlacementRect: { type: [Object, String], default: null },
  HorizontalOffset: { type: [String, Number], default: 0 },
  VerticalOffset: { type: [String, Number], default: 0 },
  Background: { type: String, default: '' },
  Foreground: { type: String, default: '' },
  BorderBrush: { type: String, default: '' },
  BorderThickness: { type: [String, Number], default: '' },
  Padding: { type: String, default: '' },
  FontFamily: { type: String, default: '' },
  FontSize: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: 320 },
  CornerRadius: { type: [String, Number], default: '' },
  BackgroundSizing: { type: String, default: 'InnerBorderEdge' },
  InitialShowDelay: { type: Number, default: 800 },
  BetweenShowDelay: { type: Number, default: 200 },
  ShowOnDisabled: { type: Boolean, default: false },
  IsServiceHost: { type: Boolean, default: false },
  Theme: { type: String, default: '' },
  UseNativeToolTip: { type: Boolean, default: true },
  NativeToolTip: { type: [String, Boolean], default: '' },
  'ToolTipService.ToolTip': { type: [String, Number, Object], default: '' },
  'ToolTipService.Placement': { type: String, default: '' },
  'ToolTipService.PlacementTarget': { type: [Object, String], default: null }
});

const emit = defineEmits(['update:IsOpen', 'Opened', 'Closed', 'Opening', 'Closing', 'tooltip-pointer-enter', 'tooltip-pointer-leave']);
const slots = useSlots();
const inheritedTheme = inject<string | Ref<string> | null>('winuiTheme', null);
const anchorRef = ref<HTMLElement | null>(null);
const tooltipRef = ref<HTMLElement | null>(null);
const localIsOpen = ref(false);
const isHoveringTarget = ref(false);
const isHoveringTooltip = ref(false);
const pointer = ref<Point | null>(null);
const position = ref({ top: 0, left: 0 });
const isPositioned = ref(false);
const isSuppressedUntilPointerLeave = ref(false);
const actualPlacement = ref('Mouse');
const teleportTarget = ref<HTMLElement | string>('body');
const tooltipId = `win-tooltip-${Math.random().toString(36).slice(2, 10)}`;
let openTimer: number | undefined;
let closeTimer: number | undefined;
let suppressFocusShowUntil = 0;

const isEnabled = computed(() => props.IsEnabled !== false);
const effectiveIsOpen = computed(() => props.IsOpen ?? localIsOpen.value);
const isVisible = computed(() => effectiveIsOpen.value && isEnabled.value);
const serviceContent = computed(() => props['ToolTipService.ToolTip']);
const contentValue = computed(() => props.Content !== '' && props.Content !== null ? props.Content : serviceContent.value);
const contentText = computed(() => {
  const value = contentValue.value;
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return String(record.Content ?? record.content ?? '');
  }
  return String(value ?? '');
});
const placement = computed(() => props['ToolTipService.Placement'] || props.Placement || 'Mouse');
const placementTarget = computed(() => props['ToolTipService.PlacementTarget'] || props.PlacementTarget);
const effectiveTheme = computed(() => {
  const explicitTheme = String(props.Theme || '').toLowerCase();
  if (explicitTheme === 'light' || explicitTheme === 'dark') return explicitTheme;
  const providedTheme = String(unref(inheritedTheme) || '').toLowerCase();
  return providedTheme === 'light' || providedTheme === 'dark' ? providedTheme : '';
});
const themeClass = computed(() => effectiveTheme.value
  ? `win-theme-scope theme-${effectiveTheme.value}`
  : 'win-tooltip-theme');
const templateSettings = computed(() => ({
  FromHorizontalOffset: Number(props.HorizontalOffset || 0),
  FromVerticalOffset: Number(props.VerticalOffset || 0)
}));

const cssLength = (value: string | number | null | undefined) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'number' || (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value.trim()))) return `${value}px`;
  return value;
};

const xamlThickness = (value: string | number | null | undefined) => {
  if (!value) return '';
  const parts = String(value).split(',').map(part => cssLength(part.trim()));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return value;
};

const tooltipStyle = computed<CSSProperties>(() => ({
  top: `${position.value.top}px`,
  left: `${position.value.left}px`,
  visibility: isPositioned.value ? undefined : 'hidden',
  animationPlayState: isPositioned.value ? 'running' : 'paused',
  background: props.Background || undefined,
  backgroundImage: props.Background ? 'none' : undefined,
  color: props.Foreground || undefined,
  borderColor: props.BorderBrush || undefined,
  borderWidth: props.BorderThickness !== '' ? cssLength(props.BorderThickness) : undefined,
  padding: props.Padding ? xamlThickness(props.Padding) : undefined,
  fontFamily: props.FontFamily || undefined,
  fontSize: props.FontSize !== '' ? cssLength(props.FontSize) : undefined,
  maxWidth: cssLength(props.MaxWidth),
  borderRadius: props.CornerRadius !== '' ? cssLength(props.CornerRadius) : undefined,
  boxSizing: props.BackgroundSizing === 'InnerBorderEdge' ? 'border-box' : undefined
}));

function targetElement(): HTMLElement | null {
  const target = placementTarget.value as PlacementTargetValue;
  if (!target) return anchorRef.value;
  if (typeof target === 'string') return document.querySelector<HTMLElement>(target) || anchorRef.value;
  if (target instanceof HTMLElement) return target;
  const targetObject = target as { value?: unknown; $el?: unknown };
  if (targetObject.$el instanceof HTMLElement) return targetObject.$el;
  if (targetObject.value instanceof HTMLElement) return targetObject.value;
  if ((targetObject.value as ComponentPublicInstance | undefined)?.$el instanceof HTMLElement) {
    return (targetObject.value as ComponentPublicInstance).$el as HTMLElement;
  }
  return anchorRef.value;
}

function rectFromPlacementRect(): DOMRect | Position & { right: number; bottom: number; width: number; height: number } | null {
  const rect = props.PlacementRect as PlacementRectValue;
  if (!rect) return null;
  if (typeof rect !== 'string' && typeof rect.getBoundingClientRect === 'function') return rect.getBoundingClientRect();
  const values = typeof rect === 'string'
    ? rect.split(',').map(value => Number(value.trim()))
    : null;
  if (values && (values.length !== 4 || values.some(value => !Number.isFinite(value)))) return null;
  const targetRect = targetElement()?.getBoundingClientRect();
  const rectValue = typeof rect === 'string' ? null : rect;
  const x = values ? values[0] : Number(rectValue?.x ?? rectValue?.left ?? 0);
  const y = values ? values[1] : Number(rectValue?.y ?? rectValue?.top ?? 0);
  const width = values ? values[2] : Number(rectValue?.width ?? 0);
  const height = values ? values[3] : Number(rectValue?.height ?? 0);
  const left = (targetRect?.left ?? 0) + x;
  const top = (targetRect?.top ?? 0) + y;
  return { left, top, right: left + width, bottom: top + height, width, height };
}

function setOpen(value: boolean, immediate = false, preservePosition = false) {
  if (value === effectiveIsOpen.value && !immediate) return;
  if (value && !preservePosition) isPositioned.value = false;
  else isHoveringTooltip.value = false;
  localIsOpen.value = value;
  emit('update:IsOpen', value);
}

function clearTimers() {
  if (openTimer !== undefined) window.clearTimeout(openTimer);
  if (closeTimer !== undefined) window.clearTimeout(closeTimer);
  openTimer = undefined;
  closeTimer = undefined;
}

function show(immediate = false, delayOverride?: number) {
  const target = targetElement();
  const targetIsDisabled = Boolean(target?.matches?.(':disabled') || target?.querySelector?.(':disabled'));
  if (!isEnabled.value || (targetIsDisabled && !props.ShowOnDisabled) || (!contentText.value && !slots.content)) return;
  clearTimers();
  if (effectiveIsOpen.value) return;
  const delay = immediate ? 0 : Math.max(0, delayOverride ?? props.InitialShowDelay);
  openTimer = window.setTimeout(async () => {
    setOpen(true);
    await nextTick();
    await updatePosition();
  }, delay);
}

function hide(force = false) {
  clearTimers();
  if (!force && (isHoveringTarget.value || isHoveringTooltip.value)) return;
  if (!effectiveIsOpen.value) return;
  setOpen(false);
}

function toggle() {
  if (effectiveIsOpen.value) hide(true);
  else show(true);
}

function onPointerEnter(event: PointerEvent) {
  if (event.pointerType === 'touch') return;
  if (isSuppressedUntilPointerLeave.value) return;
  isHoveringTarget.value = true;
  if (!effectiveIsOpen.value) pointer.value = { x: event.clientX, y: event.clientY };
  show(false);
}
function onPointerMove(event: PointerEvent) {
  if (event.pointerType === 'touch' || effectiveIsOpen.value || !isHoveringTarget.value) return;
  pointer.value = { x: event.clientX, y: event.clientY };
}
function onPointerLeave() {
  isHoveringTarget.value = false;
  isSuppressedUntilPointerLeave.value = false;
  hide();
}
function onPointerDown(event: PointerEvent) {
  pointer.value = { x: event.clientX, y: event.clientY };
  if (event.pointerType === 'touch') {
    isHoveringTarget.value = true;
    suppressFocusShowUntil = performance.now() + 100;
    show(false, props.InitialShowDelay / 2);
  } else {
    isSuppressedUntilPointerLeave.value = true;
    hide(true);
  }
}
function onFocusIn() {
  if (isSuppressedUntilPointerLeave.value || performance.now() < suppressFocusShowUntil) return;
  const rect = targetElement()?.getBoundingClientRect();
  if (rect) pointer.value = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  show(false);
}
function onFocusOut() {
  isHoveringTarget.value = false;
  hide();
}
function onToolTipPointerEnter() {
  isHoveringTooltip.value = true;
  if (closeTimer !== undefined) window.clearTimeout(closeTimer);
  closeTimer = undefined;
  emit('tooltip-pointer-enter');
  if (props.IsOpen === undefined && !effectiveIsOpen.value) setOpen(true, true, true);
}
function onToolTipPointerLeave() {
  isHoveringTooltip.value = false;
  emit('tooltip-pointer-leave');
  hide();
}
function clamp(value: number, min: number, max: number) {
  if (max < min) return min;
  return Math.max(min, Math.min(max, value));
}

async function updatePosition() {
  await nextTick();
  const tooltip = tooltipRef.value;
  if (!tooltip) return;
  const placementRect = rectFromPlacementRect();
  const targetRect = placementRect || targetElement()?.getBoundingClientRect();
  if (!targetRect) return;
  const tipRect = tooltip.getBoundingClientRect();
  const gap = 20;
  const viewportMargin = 8;
  const requestedMode = String(placement.value || 'Mouse').toLowerCase();
  const mode: PlacementKey = ['bottom', 'left', 'mouse', 'right', 'top'].includes(requestedMode)
    ? requestedMode as PlacementKey
    : 'mouse';
  const placementPoint = props.PlacementPoint as { x?: number; y?: number } | null;
  const mousePoint = placementPoint && Number.isFinite(placementPoint.x) && Number.isFinite(placementPoint.y)
    ? { x: Number(placementPoint.x), y: Number(placementPoint.y) }
    : pointer.value || { x: targetRect.left + targetRect.width / 2, y: targetRect.top + targetRect.height / 2 };
  const horizontalOffset = Number(props.HorizontalOffset || 0);
  const verticalOffset = Number(props.VerticalOffset || 0);
  const horizontalCenter = placementRect
    ? mousePoint.x - tipRect.width / 2
    : targetRect.left + (targetRect.width - tipRect.width) / 2;
  const verticalCenter = placementRect
    ? mousePoint.y - tipRect.height / 2
    : targetRect.top + (targetRect.height - tipRect.height) / 2;
  const candidates: Record<Exclude<PlacementKey, 'mouse'>, Position> = {
    top: { top: targetRect.top - tipRect.height - gap - verticalOffset, left: horizontalCenter },
    bottom: { top: targetRect.bottom + gap + verticalOffset, left: horizontalCenter },
    left: { top: verticalCenter, left: targetRect.left - tipRect.width - gap - horizontalOffset },
    right: { top: verticalCenter, left: targetRect.right + gap + horizontalOffset }
  };
  const fallbackOrder: Record<Exclude<PlacementKey, 'mouse'>, Exclude<PlacementKey, 'mouse'>[]> = {
    top: ['top', 'bottom', 'left', 'right'],
    bottom: ['bottom', 'top', 'left', 'right'],
    left: ['left', 'right', 'top', 'bottom'],
    right: ['right', 'left', 'top', 'bottom']
  };
  const canPlaceOnSide = (candidateMode: Exclude<PlacementKey, 'mouse'>) => {
    const candidate = candidates[candidateMode];
    if (candidateMode === 'top') return candidate.top >= viewportMargin;
    if (candidateMode === 'bottom') return candidate.top + tipRect.height <= window.innerHeight - viewportMargin;
    if (candidateMode === 'left') return candidate.left >= viewportMargin;
    return candidate.left + tipRect.width <= window.innerWidth - viewportMargin;
  };

  let resolved: PlacementKey;
  let resolvedPosition: Position;
  if (mode === 'mouse') {
    const mouseLeft = mousePoint.x - tipRect.width / 2 + horizontalOffset;
    const above = {
      top: mousePoint.y - tipRect.height - gap,
      left: mouseLeft
    };
    const below = {
      top: mousePoint.y + gap,
      left: mouseLeft
    };
    if (verticalOffset !== 0) {
      const offsetPosition = {
        top: mousePoint.y - verticalOffset,
        left: mouseLeft
      };
      const offsetIsAbove = offsetPosition.top + tipRect.height / 2 < mousePoint.y;
      const offsetFits = offsetPosition.top >= viewportMargin
        && offsetPosition.top + tipRect.height <= window.innerHeight - viewportMargin;
      const opposite = offsetIsAbove ? below : above;
      const oppositeFits = opposite.top >= viewportMargin
        && opposite.top + tipRect.height <= window.innerHeight - viewportMargin;
      if (offsetFits) {
        resolved = offsetIsAbove ? 'top' : 'bottom';
        resolvedPosition = offsetPosition;
      } else if (oppositeFits) {
        resolved = offsetIsAbove ? 'bottom' : 'top';
        resolvedPosition = opposite;
      } else {
        resolved = offsetIsAbove ? 'top' : 'bottom';
        resolvedPosition = offsetPosition;
      }
    } else if (above.top >= viewportMargin) {
      resolved = 'top';
      resolvedPosition = above;
    } else if (below.top + tipRect.height <= window.innerHeight - viewportMargin) {
      resolved = 'bottom';
      resolvedPosition = below;
    } else {
      resolved = 'top';
      resolvedPosition = above;
    }
  } else {
    resolved = fallbackOrder[mode].find(canPlaceOnSide) || mode;
    resolvedPosition = candidates[resolved];
  }

  position.value = {
    top: clamp(resolvedPosition.top, viewportMargin, window.innerHeight - tipRect.height - viewportMargin),
    left: clamp(resolvedPosition.left, viewportMargin, window.innerWidth - tipRect.width - viewportMargin)
  };
  actualPlacement.value = resolved[0].toUpperCase() + resolved.slice(1);
  isPositioned.value = true;
}

watch(effectiveIsOpen, async (value, oldValue) => {
  if (value === oldValue) return;
  clearTimers();
  emit(value ? 'Opening' : 'Closing');
  if (value) {
    await nextTick();
    await updatePosition();
  }
  emit(value ? 'Opened' : 'Closed');
});
watch(
  [isVisible, placement, placementTarget, () => props.PlacementPoint, () => props.PlacementRect, () => props.HorizontalOffset, () => props.VerticalOffset, contentText],
  () => { if (isVisible.value) void updatePosition(); },
  { deep: true }
);

function onViewportChanged() {
  if (isVisible.value) void updatePosition();
}

function onFullscreenChanged() {
  teleportTarget.value = (document.fullscreenElement as HTMLElement | null) || 'body';
  if (isVisible.value) void updatePosition();
}

onMounted(() => {
  teleportTarget.value = (document.fullscreenElement as HTMLElement | null) || 'body';
  window.addEventListener('resize', onViewportChanged);
  window.addEventListener('scroll', onViewportChanged, true);
  document.addEventListener('fullscreenchange', onFullscreenChanged);
  if (isVisible.value) void updatePosition();
});
onBeforeUnmount(() => {
  clearTimers();
  window.removeEventListener('resize', onViewportChanged);
  window.removeEventListener('scroll', onViewportChanged, true);
  document.removeEventListener('fullscreenchange', onFullscreenChanged);
});

defineExpose({ show, hide, toggle, updatePosition, IsOpen: isVisible, TemplateSettings: templateSettings });
</script>

<style>
.win-tooltip-anchor { display: inline-flex; position: relative; }
.win-tooltip {
  position: fixed;
  z-index: var(--win-tooltip-z-index, var(--win-tip-z-index, 2147483647));
  min-width: max-content;
  max-width: 320px;
  padding: 6px 9px 8px;
  overflow-wrap: anywhere;
  color: var(--ToolTipForegroundBrush, var(--text-primary));
  --win-acrylic-fill: color-mix(
    in srgb,
    var(--ToolTipBackgroundBrush, var(--AcrylicInAppFillColorDefaultBrush, var(--flyout-background, var(--flyout-bg)))) 78%,
    transparent
  );
  background: transparent;
  background-clip: padding-box;
  border: 1px solid var(--ToolTipBorderBrush, var(--surface-stroke-color-flyout, var(--flyout-border)));
  border-radius: var(--ControlCornerRadius, 4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, .14), 0 0 2px rgba(0, 0, 0, .18);
  -webkit-backdrop-filter: var(--flyout-backdrop, blur(30px) saturate(160%));
  backdrop-filter: var(--flyout-backdrop, blur(30px) saturate(160%));
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  font-size: 12px;
  line-height: 16px;
  pointer-events: auto;
  isolation: isolate;
}

.win-tooltip .win-text-block {
  display: inline;
  color: inherit;
  font-size: inherit;
  line-height: inherit;
}
.win-tooltip-enter-active { animation: win-tooltip-fade-in 167ms linear both; }
.win-tooltip-leave-active { animation: win-tooltip-fade-out 167ms linear both; }
@keyframes win-tooltip-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes win-tooltip-fade-out { from { opacity: 1; } to { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .win-tooltip-enter-active, .win-tooltip-leave-active { animation-duration: 1ms; }
}
</style>
