<template>
  <div class="win-slider-root" :class="{ 'is-disabled': !resolvedIsEnabled }" :style="rootStyle">
    <TextBlock v-if="resolvedHeader" class="win-slider-header" Text="{x:Bind SliderHeader}" />
    <div
      ref="trackRef"
      class="win-slider"
      :class="{ vertical: orientation === 'Vertical', 'has-ticks': showTicks }"
      :style="sliderStyle"
      @pointerdown="onPointerDown">
      <div class="win-slider-track">
        <div class="win-slider-fill" :style="fillStyle" />
      </div>
      <div v-if="showTicks" class="win-slider-ticks" :class="tickPlacementClass">
        <template v-if="showTopLeftTicks">
          <span v-for="tick in ticks" :key="`top-left-${tick}`" class="win-slider-tick top-left" :style="tickStyle(tick)" />
        </template>
        <template v-if="showBottomRightTicks">
          <span v-for="tick in ticks" :key="`bottom-right-${tick}`" class="win-slider-tick bottom-right" :style="tickStyle(tick)" />
        </template>
      </div>
      <div
        ref="thumbRef"
        class="win-slider-thumb"
        :class="{ 'is-pointer-over': isThumbPointerOver && !isTrackInteraction, 'is-pressed': isThumbPressed }"
        :style="thumbStyle"
        @pointerdown.stop="onThumbPointerDown"
        @pointerenter="onThumbPointerEnter"
        @pointerleave="onThumbPointerLeave" />
    </div>
    <ToolTip
      ref="thumbToolTipRef"
      IsServiceHost
      IsOpen="{x:Bind IsThumbToolTipOpen, Mode=TwoWay}"
      IsEnabled="{x:Bind IsThumbToolTipActive}"
      Content="{x:Bind ThumbToolTipContent}"
      Placement="{x:Bind ThumbToolTipPlacement}"
      PlacementTarget="{x:Bind ThumbToolTipTarget}"
      Padding="8,3,8,5"
      FontSize="15" />
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, provide, ref, useAttrs, watch } from 'vue';
import TextBlock from './TextBlock.vue';
import ToolTip from './ToolTip.vue';
import { resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  Value: { type: [Number, String], default: 0 },
  Minimum: { type: [Number, String], default: 0 },
  Maximum: { type: [Number, String], default: 100 },
  SmallChange: { type: [Number, String], default: 1 },
  StepFrequency: { type: [Number, String], default: 1 },
  Header: { type: [String, Number], default: '' },
  Orientation: { type: String, default: 'Horizontal' },
  TickFrequency: { type: [Number, String], default: 0 },
  TickPlacement: { type: String, default: 'None' },
  SnapsTo: { type: String, default: 'StepValues' },
  IsEnabled: { type: [Boolean, String], default: true },
  IsThumbToolTipEnabled: { type: [Boolean, String], default: true },
  ThumbToolTipValueConverter: { type: [Function, Object], default: null },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  Margin: { type: String, default: '' },
  modelValue: { type: Number, default: undefined },
  min: { type: Number, default: undefined },
  max: { type: Number, default: undefined },
  step: { type: Number, default: undefined },
  vertical: { type: Boolean, default: false },
  showTicks: { type: Boolean, default: false },
  tickFrequency: { type: Number, default: undefined }
});

const emit = defineEmits(['update:Value', 'ValueChanged', 'update:modelValue']);
const attrs = useAttrs();
const instance = getCurrentInstance();
const resolvedHeader = computed(() => resolveXamlValue(props.Header, instance));
const SliderHeader = computed(() => resolvedHeader.value);
const resolvedValue = computed(() => resolveXamlValue(props.Value, instance));
const resolvedMinimum = computed(() => resolveXamlValue(props.Minimum, instance));
const resolvedMaximum = computed(() => resolveXamlValue(props.Maximum, instance));
const resolvedSmallChange = computed(() => resolveXamlValue(props.SmallChange, instance));
const resolvedStepFrequency = computed(() => resolveXamlValue(props.StepFrequency, instance));
const resolvedTickFrequency = computed(() => resolveXamlValue(props.TickFrequency, instance));
const resolvedIsEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance) !== false);
const resolvedIsThumbToolTipEnabled = computed(() => resolveXamlValue(props.IsThumbToolTipEnabled, instance) !== false);
const resolvedSnapsTo = computed(() => resolveXamlValue(props.SnapsTo, instance));
const resolvedOrientation = computed(() => resolveXamlValue(props.Orientation, instance));
const resolvedWidth = computed(() => resolveXamlValue(props.Width, instance));
const resolvedHeight = computed(() => resolveXamlValue(props.Height, instance));
const resolvedTickPlacement = computed(() => resolveXamlValue(props.TickPlacement, instance));
const resolvedShowTicks = computed(() => props.showTicks === true || (resolvedTickPlacement.value && resolvedTickPlacement.value !== 'None' && tickFrequencyValue.value > 0));
const trackRef = ref(null);
const thumbRef = ref(null);
const thumbToolTipRef = ref(null);
const dragValue = ref(null);
// Keep a local value while a XAML TwoWay binding is being updated.  A pointer
// move can arrive before the page's ref/computed value has propagated back
// through the vnode, so deriving the thumb only from props makes it jump back
// to the old value and leaves the tooltip stale.
const internalValue = ref(null);
const isThumbPointerOver = ref(false);
const isThumbPressed = ref(false);
const isTrackInteraction = ref(false);
const isThumbToolTipOpen = ref(false);
const isDraggingState = ref(false);
const thumbLength = 18;
const thumbCenterOffset = thumbLength / 2;
const tickOffset = (thumbLength - 1) / 2;
const minTickMarkGap = 20;

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const minimum = computed(() => toNumber(props.min ?? resolvedMinimum.value));
const maximum = computed(() => Math.max(minimum.value, toNumber(props.max ?? resolvedMaximum.value, 100)));
const externalValue = computed(() => props.modelValue ?? resolvedValue.value);
const effectiveValue = computed(() => Math.max(
  minimum.value,
  Math.min(maximum.value, toNumber(dragValue.value ?? internalValue.value ?? externalValue.value))
));
const stepFrequency = computed(() => Math.max(0, toNumber(props.step ?? resolvedStepFrequency.value, 1)));
const orientation = computed(() => props.vertical ? 'Vertical' : resolvedOrientation.value);
const tickFrequencyValue = computed(() => Math.max(0, toNumber(props.tickFrequency ?? resolvedTickFrequency.value)));
const showTicks = computed(() => resolvedShowTicks.value);
const tickPlacement = computed(() => String(resolvedTickPlacement.value || (props.showTicks ? 'Outside' : 'None')).toLowerCase());
const tickPlacementClass = computed(() => `placement-${tickPlacement.value}`);
const showTopLeftTicks = computed(() => tickPlacement.value === 'outside' || tickPlacement.value === 'topleft');
const showBottomRightTicks = computed(() => tickPlacement.value === 'outside' || tickPlacement.value === 'bottomright' || tickPlacement.value === 'inline' || resolvedShowTicks.value);
const range = computed(() => Math.max(0.0001, maximum.value - minimum.value));
const percent = computed(() => Math.max(0, Math.min(100, ((effectiveValue.value - minimum.value) / range.value) * 100)));
const tooltipPlacement = computed(() => orientation.value === 'Vertical' ? 'Left' : 'Top');

const sliderValueDecimals = computed(() => {
  const frequency = stepFrequency.value;
  let decimals = 0;
  let scaled = frequency;
  while (decimals < 4 && Math.abs(scaled - Math.round(scaled)) > 0.00001) {
    decimals += 1;
    scaled *= 10;
  }
  return decimals;
});

const formatSliderValue = (value) => {
  const converter = props.ThumbToolTipValueConverter;
  if (converter) {
    try {
      const converted = typeof converter === 'function'
        ? converter(value)
        : typeof converter.convert === 'function'
          ? converter.convert(value)
          : typeof converter.Convert === 'function'
            ? converter.Convert(value)
            : undefined;
      if (converted !== undefined && converted !== null) return String(converted);
    } catch {
      // Fall back to the platform's default numeric formatter.
    }
  }
  return Number(value).toFixed(sliderValueDecimals.value);
};

// The thumb itself follows the pointer continuously while dragging.  WinUI's
// tooltip, however, reports the value the slider would commit at the current
// position when snapping is enabled, so it must use the snapped projection.
const thumbToolTipContent = computed(() => formatSliderValue(snap(effectiveValue.value)));
const IsThumbToolTipOpen = isThumbToolTipOpen;
const IsThumbToolTipActive = computed(() => resolvedIsEnabled.value && resolvedIsThumbToolTipEnabled.value);
const ThumbToolTipContent = computed(() => thumbToolTipContent.value);
const ThumbToolTipPlacement = computed(() => tooltipPlacement.value);
const ThumbToolTipTarget = computed(() => thumbRef.value);

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
  return typeof value === 'number' ? `${value}px` : value;
};

const xamlThickness = (value) => {
  if (!value) return '';
  const parts = String(value).split(',').map((part) => cssLength(Number.isNaN(Number(part.trim())) ? part.trim() : Number(part.trim())));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return value;
};

const rootStyle = computed(() => [attrs.style, props.Margin ? { margin: xamlThickness(resolveXamlValue(props.Margin, instance)) } : {}]);
const sliderStyle = computed(() => ({
  width: resolvedWidth.value !== '' ? cssLength(resolvedWidth.value) : orientation.value === 'Vertical' ? '100px' : '200px',
  height: resolvedHeight.value !== '' ? cssLength(resolvedHeight.value) : orientation.value === 'Vertical' ? '100px' : '32px'
}));
const numericLength = (value, fallback) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const match = value.trim().match(/^(-?\d+(?:\.\d+)?)(px)?$/);
    if (match) return Number(match[1]);
  }
  return fallback;
};
const sliderLength = computed(() => orientation.value === 'Vertical'
  ? numericLength(resolvedHeight.value, 100)
  : numericLength(resolvedWidth.value, 200));
const fillStyle = computed(() => orientation.value === 'Vertical'
  ? { height: `calc(${percent.value}% - ${(percent.value * thumbLength) / 100}px)` }
  : { width: `calc(${percent.value}% - ${(percent.value * thumbLength) / 100}px)` });
const thumbStyle = computed(() => orientation.value === 'Vertical'
  ? { bottom: `calc(${thumbCenterOffset}px + ${percent.value}% - ${(percent.value * thumbLength) / 100}px)` }
  : { left: `calc(${thumbCenterOffset}px + ${percent.value}% - ${(percent.value * thumbLength) / 100}px)` });

const ticks = computed(() => {
  if (!showTicks.value) return [];
  const frequency = tickFrequencyValue.value || stepFrequency.value || 1;
  if (!Number.isFinite(frequency) || frequency <= 0) return [];
  const numIntervals = Math.max(1, (maximum.value - minimum.value) / frequency);
  const visualRange = Math.max(1, sliderLength.value - thumbLength);
  let tickInterval = Math.max(1, visualRange / numIntervals);
  let tickMarkNumber = Math.floor(numIntervals);
  let visibleRatio = 1;
  if (tickInterval < minTickMarkGap) {
    visibleRatio = Math.ceil(minTickMarkGap / tickInterval);
    tickInterval *= visibleRatio;
    tickMarkNumber = Math.floor(tickMarkNumber / visibleRatio);
  }
  const values = [];
  for (let index = 0; index <= tickMarkNumber && values.length < 1000; index += 1) {
    const value = minimum.value + index * frequency * visibleRatio;
    if (value <= maximum.value + 0.0001) values.push(value);
  }
  return values;
});

const tickStyle = (tick) => {
  const tickPercent = ((tick - minimum.value) / range.value) * 100;
  const verticalPercent = 100 - tickPercent;
  return orientation.value === 'Vertical'
    ? { top: `calc(${tickOffset}px + ${verticalPercent}% - ${(verticalPercent * thumbLength) / 100}px)` }
    : { left: `calc(${tickOffset}px + ${tickPercent}% - ${(tickPercent * thumbLength) / 100}px)` };
};

const snap = (value) => {
  const frequency = String(resolvedSnapsTo.value).toLowerCase() === 'ticks' && tickFrequencyValue.value > 0 ? tickFrequencyValue.value : stepFrequency.value;
  const clamped = Math.max(minimum.value, Math.min(maximum.value, value));
  if (!Number.isFinite(frequency) || frequency <= 0) return Number(clamped.toFixed(4));
  const snapped = minimum.value + Math.round((clamped - minimum.value) / frequency) * frequency;
  return Number(Math.max(minimum.value, Math.min(maximum.value, snapped)).toFixed(4));
};

const setValue = (value, { commit = true } = {}) => {
  const oldValue = toNumber(internalValue.value ?? externalValue.value, minimum.value);
  const numericValue = Number(value);
  const rawValue = Number(Math.max(
    minimum.value,
    Math.min(maximum.value, Number.isFinite(numericValue) ? numericValue : minimum.value)
  ).toFixed(4));
  // Keep pointer movement continuous.  Snapping is only committed on release;
  // the tooltip projects the continuous value through snap() independently.
  const snappedValue = snap(rawValue);
  const nextValue = commit ? snappedValue : rawValue;
  dragValue.value = nextValue;
  if (!commit) {
    // RangeBase.Value is a TwoWay property in the official Gallery. Publish
    // the snapped Value while the thumb follows the pointer continuously.
    // This keeps StepFrequency/Ticks output and bound controls on the official
    // increments without making the thumb itself jump between tick positions.
    emit('update:Value', snappedValue);
    emit('update:modelValue', snappedValue);
    updateXamlBinding(props.Value, snappedValue, instance);
    return;
  }
  internalValue.value = nextValue;
  emit('update:Value', nextValue);
  emit('update:modelValue', nextValue);
  updateXamlBinding(props.Value, nextValue, instance);
  if (oldValue !== nextValue) {
    const args = { OldValue: oldValue, NewValue: nextValue };
    emit('ValueChanged', args);
    resolveXamlHandler(attrs.ValueChanged, instance)?.(args);
  }
};

const exposedValue = computed({
  // XAML consumers observe the RangeBase.Value after StepFrequency/Ticks
  // snapping, while the visual thumb continues to follow the pointer.
  get: () => snap(effectiveValue.value),
  set: (value) => setValue(value, { commit: true })
});
defineExpose({ Value: exposedValue, IsDragging: isDraggingState });

provide(xamlScopeKey, {
  SliderHeader,
  IsThumbToolTipOpen,
  IsThumbToolTipActive,
  ThumbToolTipContent,
  ThumbToolTipPlacement,
  ThumbToolTipTarget
});

const showThumbToolTip = (immediate = true) => {
  if (!resolvedIsEnabled.value || !resolvedIsThumbToolTipEnabled.value) return;
  if (immediate) {
    isThumbToolTipOpen.value = true;
    nextTick(() => thumbToolTipRef.value?.updatePosition?.());
    return;
  }
  thumbToolTipRef.value?.show?.(false);
};

const hideThumbToolTip = () => {
  thumbToolTipRef.value?.hide?.(true);
  isThumbToolTipOpen.value = false;
};

const onThumbPointerEnter = () => {
  isThumbPointerOver.value = true;
  if (!isThumbPressed.value && !isTrackInteraction.value) showThumbToolTip(false);
};

const onThumbPointerLeave = () => {
  isThumbPointerOver.value = false;
  if (!isThumbPressed.value && !isTrackInteraction.value) hideThumbToolTip();
};

const updateFromPointer = (event) => {
  const rect = trackRef.value.getBoundingClientRect();
  const usableSize = Math.max(1, (orientation.value === 'Vertical' ? rect.height : rect.width) - thumbLength);
  const adjustedClientX = event.clientX - pointerGrabOffset;
  const adjustedClientY = event.clientY - pointerGrabOffset;
  const ratio = orientation.value === 'Vertical'
    ? ((rect.bottom - adjustedClientY - thumbCenterOffset) / usableSize)
    : ((adjustedClientX - rect.left - thumbCenterOffset) / usableSize);
  setValue(minimum.value + Math.max(0, Math.min(1, ratio)) * range.value, { commit: false });
};

let activePointerId = null;
let pointerCaptureElement = null;
let pointerGrabOffset = 0;
const addPointerListeners = () => {
  window.addEventListener('pointermove', onWindowPointerMove, { capture: true, passive: false });
  window.addEventListener('pointerup', onWindowPointerUp, true);
  window.addEventListener('pointercancel', onWindowPointerCancel, true);
};
const removePointerListeners = () => {
  window.removeEventListener('pointermove', onWindowPointerMove, true);
  window.removeEventListener('pointerup', onWindowPointerUp, true);
  window.removeEventListener('pointercancel', onWindowPointerCancel, true);
};
const finishPointerInteraction = (commit = true) => {
  if (activePointerId === null) return;
  if (commit && dragValue.value !== null) setValue(dragValue.value, { commit: true });
  const pointerId = activePointerId;
  const captureElement = pointerCaptureElement;
  activePointerId = null;
  pointerCaptureElement = null;
  pointerGrabOffset = 0;
  dragValue.value = null;
  isDraggingState.value = false;
  isThumbPressed.value = false;
  isTrackInteraction.value = false;
  removePointerListeners();
  if (captureElement?.hasPointerCapture?.(pointerId)) captureElement.releasePointerCapture(pointerId);
  hideThumbToolTip();
};
const onWindowPointerMove = (event) => {
  if (event.pointerId !== activePointerId) return;
  event.preventDefault();
  updateFromPointer(event);
};
const onWindowPointerUp = (event) => {
  if (event.pointerId === activePointerId) finishPointerInteraction(true);
};
const onWindowPointerCancel = (event) => {
  if (event.pointerId === activePointerId) finishPointerInteraction(false);
};

const beginPointerInteraction = (event, startedOnThumb) => {
  if (!resolvedIsEnabled.value || !trackRef.value) return;
  if (activePointerId !== null) finishPointerInteraction(false);
  event.preventDefault();
  event.stopPropagation();
  isThumbPressed.value = startedOnThumb;
  isTrackInteraction.value = !startedOnThumb;
  isDraggingState.value = true;
  activePointerId = event.pointerId;
  pointerCaptureElement = startedOnThumb ? thumbRef.value : trackRef.value;
  if (startedOnThumb && thumbRef.value) {
    const thumbRect = thumbRef.value.getBoundingClientRect();
    pointerGrabOffset = orientation.value === 'Vertical'
      ? event.clientY - (thumbRect.top + thumbRect.height / 2)
      : event.clientX - (thumbRect.left + thumbRect.width / 2);
  } else {
    pointerGrabOffset = 0;
  }
  addPointerListeners();
  try {
    pointerCaptureElement?.setPointerCapture?.(event.pointerId);
  } catch {
    // The capture listeners above keep mouse, pen and touch dragging active
    // even if a browser declines pointer capture for this pointer.
  }
  if (!startedOnThumb) updateFromPointer(event);
  showThumbToolTip(true);
};

const onPointerDown = (event) => beginPointerInteraction(event, false);
const onThumbPointerDown = (event) => beginPointerInteraction(event, true);

onBeforeUnmount(() => finishPointerInteraction(false));

watch(externalValue, (value) => {
  if (dragValue.value === null) internalValue.value = toNumber(value, internalValue.value ?? minimum.value);
}, { immediate: true });

watch(effectiveValue, () => {
  if (isThumbToolTipOpen.value) nextTick(() => thumbToolTipRef.value?.updatePosition?.());
});

watch([resolvedIsEnabled, resolvedIsThumbToolTipEnabled], ([isEnabled, isToolTipEnabled]) => {
  if (!isEnabled || !isToolTipEnabled) hideThumbToolTip();
});
</script>

<style>
.win-slider-root {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
}

.win-slider-header {
  margin: 0 0 8px;
}

.win-slider {
  position: relative;
  display: flex;
  align-items: center;
  touch-action: none;
  cursor: pointer;
  flex-shrink: 0;
  min-width: 32px;
  min-height: 32px;
}

.win-slider.vertical {
  justify-content: center;
  align-items: stretch;
  min-width: 24px;
  min-height: 32px;
}

.win-slider-track {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  border-radius: 2px;
  background: var(--ctrl-strong-fill);
  overflow: hidden;
  z-index: 0;
}

.win-slider.vertical .win-slider-track {
  top: 0;
  bottom: 0;
  left: 50%;
  right: auto;
  transform: translateX(-50%);
  width: 4px;
  height: auto;
  margin: 0;
  display: flex;
  align-items: flex-end;
}

.win-slider-fill {
  height: 100%;
  background: var(--accent-base);
  border-radius: 2px;
}

.win-slider.vertical .win-slider-fill {
  width: 100%;
  height: 0;
}

.win-slider-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--SliderOuterThumbBackground, var(--control-solid-fill-color-default, var(--ctrl-solid-fill)));
  border-left: 1px solid var(--ControlStrokeColorDefaultBrush, var(--ctrl-border));
  border-top: 1px solid var(--ButtonBorderBrushDefaultTop, var(--ControlStrokeColorDefaultBrush, var(--ctrl-border)));
  border-right: 1px solid var(--ControlStrokeColorDefaultBrush, var(--ctrl-border));
  border-bottom: 1px solid var(--ButtonBorderBrushDefaultBottom, var(--ctrl-border-accent));
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  display: grid;
  place-items: center;
  z-index: 2;
  pointer-events: auto;
  touch-action: none;
}

.win-slider.vertical .win-slider-thumb {
  left: 50%;
  top: auto;
  transform: translate(-50%, 50%);
}

.win-slider-thumb::after {
  content: "";
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent-base);
  transform: scale(0.86);
  transition: transform var(--fast-duration) var(--fast-out-slow-in);
}

.win-slider-thumb.is-pointer-over::after {
  background: var(--accent-hover);
  transform: scale(1.167);
}

.win-slider-thumb.is-pressed::after {
  background: var(--accent-pressed);
  transform: scale(0.71);
}

.win-slider-ticks {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.win-slider-tick {
  position: absolute;
  width: 1px;
  height: 4px;
  background: var(--SliderTickBarFill, var(--control-strong-fill-color-default, var(--ctrl-strong-fill)));
  transform: translateX(-50%);
}

.win-slider-tick.top-left {
  top: calc(50% - 10px);
}

.win-slider-tick.bottom-right {
  top: calc(50% + 6px);
}

.win-slider-ticks.placement-inline .win-slider-tick.bottom-right {
  top: 50%;
  height: 4px;
  background: var(--SliderInlineTickBarFill, var(--control-fill-color-input-active, var(--ctrl-fill-input-active)));
  transform: translate(-50%, -50%);
}

.win-slider.vertical .win-slider-tick {
  width: 4px;
  height: 1px;
  transform: none;
}

.win-slider.vertical .win-slider-tick.top-left {
  left: calc(50% - 10px);
}

.win-slider.vertical .win-slider-tick.bottom-right {
  left: calc(50% + 6px);
}

.win-slider.vertical .win-slider-ticks.placement-inline .win-slider-tick.bottom-right {
  left: 50%;
  width: 4px;
  height: 1px;
  transform: translateX(-50%);
}

.example-theme-wrapper.theme-light .win-slider,
.win-theme-scope.theme-light .win-slider {
  --SliderOuterThumbBackground: #ffffff;
}

.example-theme-wrapper.theme-dark .win-slider,
.win-theme-scope.theme-dark .win-slider {
  --SliderOuterThumbBackground: #454545;
}

.win-slider-root.is-disabled {
  opacity: 0.6;
  cursor: default;
}
</style>
