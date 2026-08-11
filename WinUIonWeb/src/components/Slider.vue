<template>
  <div class="win-slider-root" :class="{ 'is-disabled': !IsEnabled }" :style="rootStyle">
    <WinTextBlock v-if="Header" class="win-slider-header" :Text="Header" />
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
        @pointerenter="onThumbPointerEnter"
        @pointerleave="onThumbPointerLeave" />
    </div>
    <WinToolTip
      ref="thumbToolTipRef"
      IsServiceHost
      v-model:IsOpen="isThumbToolTipOpen"
      :IsEnabled="IsEnabled && IsThumbToolTipEnabled"
      :Content="thumbToolTipContent"
      :Placement="tooltipPlacement"
      :PlacementTarget="thumbRef"
      Padding="8,3,8,5"
      FontSize="15" />
  </div>
</template>

<script setup>
import { computed, nextTick, ref, useAttrs, watch } from 'vue';
import WinTextBlock from './WinTextBlock.vue';
import WinToolTip from './WinToolTip.vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  Value: { type: Number, default: 0 },
  Minimum: { type: Number, default: 0 },
  Maximum: { type: Number, default: 100 },
  SmallChange: { type: Number, default: 1 },
  StepFrequency: { type: Number, default: 1 },
  Header: { type: String, default: '' },
  Orientation: { type: String, default: 'Horizontal' },
  TickFrequency: { type: Number, default: 0 },
  TickPlacement: { type: String, default: 'None' },
  SnapsTo: { type: String, default: 'StepValues' },
  IsEnabled: { type: Boolean, default: true },
  IsThumbToolTipEnabled: { type: Boolean, default: true },
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
const trackRef = ref(null);
const thumbRef = ref(null);
const thumbToolTipRef = ref(null);
const dragValue = ref(null);
const isThumbPointerOver = ref(false);
const isThumbPressed = ref(false);
const isTrackInteraction = ref(false);
const isThumbToolTipOpen = ref(false);
const thumbLength = 18;
const thumbCenterOffset = thumbLength / 2;
const tickOffset = (thumbLength - 1) / 2;
const minTickMarkGap = 20;

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const minimum = computed(() => toNumber(props.min ?? props.Minimum));
const maximum = computed(() => Math.max(minimum.value, toNumber(props.max ?? props.Maximum, 100)));
const effectiveValue = computed(() => Math.max(minimum.value, Math.min(maximum.value, toNumber(dragValue.value ?? props.modelValue ?? props.Value))));
const stepFrequency = computed(() => Math.max(0, toNumber(props.step ?? props.StepFrequency, 1)));
const orientation = computed(() => props.vertical ? 'Vertical' : props.Orientation);
const tickFrequencyValue = computed(() => Math.max(0, toNumber(props.tickFrequency ?? props.TickFrequency)));
const showTicks = computed(() => props.showTicks || (props.TickPlacement && props.TickPlacement !== 'None' && tickFrequencyValue.value > 0));
const tickPlacement = computed(() => String(props.TickPlacement || (props.showTicks ? 'Outside' : 'None')).toLowerCase());
const tickPlacementClass = computed(() => `placement-${tickPlacement.value}`);
const showTopLeftTicks = computed(() => tickPlacement.value === 'outside' || tickPlacement.value === 'topleft');
const showBottomRightTicks = computed(() => tickPlacement.value === 'outside' || tickPlacement.value === 'bottomright' || tickPlacement.value === 'inline' || props.showTicks);
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

const thumbToolTipContent = computed(() => formatSliderValue(effectiveValue.value));

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

const rootStyle = computed(() => [attrs.style, props.Margin ? { margin: xamlThickness(props.Margin) } : {}]);
const sliderStyle = computed(() => ({
  width: props.Width !== '' ? cssLength(props.Width) : orientation.value === 'Vertical' ? '100px' : '200px',
  height: props.Height !== '' ? cssLength(props.Height) : orientation.value === 'Vertical' ? '100px' : '32px'
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
  ? numericLength(props.Height, 100)
  : numericLength(props.Width, 200));
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
  const frequency = String(props.SnapsTo).toLowerCase() === 'ticks' && tickFrequencyValue.value > 0 ? tickFrequencyValue.value : stepFrequency.value;
  const clamped = Math.max(minimum.value, Math.min(maximum.value, value));
  if (!Number.isFinite(frequency) || frequency <= 0) return Number(clamped.toFixed(4));
  const snapped = minimum.value + Math.round((clamped - minimum.value) / frequency) * frequency;
  return Number(Math.max(minimum.value, Math.min(maximum.value, snapped)).toFixed(4));
};

const setValue = (value, { commit = true } = {}) => {
  const oldValue = effectiveValue.value;
  const nextValue = commit ? snap(value) : Number(Math.max(minimum.value, Math.min(maximum.value, value)).toFixed(4));
  if (!commit) dragValue.value = nextValue;
  emit('update:Value', nextValue);
  emit('update:modelValue', nextValue);
  if (oldValue !== nextValue) emit('ValueChanged', { OldValue: oldValue, NewValue: nextValue });
};

const showThumbToolTip = (immediate = true) => {
  if (!props.IsEnabled || !props.IsThumbToolTipEnabled) return;
  if (immediate) isThumbToolTipOpen.value = true;
  thumbToolTipRef.value?.show?.(immediate);
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
  const ratio = orientation.value === 'Vertical'
    ? ((rect.bottom - event.clientY - thumbCenterOffset) / usableSize)
    : ((event.clientX - rect.left - thumbCenterOffset) / usableSize);
  setValue(minimum.value + Math.max(0, Math.min(1, ratio)) * range.value, { commit: String(props.SnapsTo).toLowerCase() !== 'ticks' });
};

const onPointerDown = (event) => {
  if (!props.IsEnabled || !trackRef.value) return;
  const startedOnThumb = event.target?.closest?.('.win-slider-thumb');
  isThumbPressed.value = Boolean(startedOnThumb);
  isTrackInteraction.value = !startedOnThumb;
  trackRef.value.setPointerCapture(event.pointerId);
  updateFromPointer(event);
  showThumbToolTip(true);
  const finishPointerInteraction = () => {
    if (!isThumbPressed.value && !isTrackInteraction.value) return;
    if (String(props.SnapsTo).toLowerCase() === 'ticks' && dragValue.value !== null) setValue(dragValue.value, { commit: true });
    dragValue.value = null;
    isThumbPressed.value = false;
    isTrackInteraction.value = false;
    trackRef.value.onpointermove = null;
    trackRef.value.onpointerup = null;
    trackRef.value.onpointercancel = null;
    trackRef.value.onlostpointercapture = null;
    if (trackRef.value?.hasPointerCapture?.(event.pointerId)) trackRef.value.releasePointerCapture(event.pointerId);
    hideThumbToolTip();
  };
  trackRef.value.onpointermove = updateFromPointer;
  trackRef.value.onpointerup = finishPointerInteraction;
  trackRef.value.onpointercancel = finishPointerInteraction;
  trackRef.value.onlostpointercapture = finishPointerInteraction;
};

watch(effectiveValue, () => {
  if (isThumbToolTipOpen.value) nextTick(() => thumbToolTipRef.value?.updatePosition?.());
});

watch([() => props.IsEnabled, () => props.IsThumbToolTipEnabled], ([isEnabled, isToolTipEnabled]) => {
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
