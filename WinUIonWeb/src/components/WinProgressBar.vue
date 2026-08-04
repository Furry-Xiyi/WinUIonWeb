<template>
  <div
    ref="rootRef"
    v-bind="forwardedAttrs"
    class="win-progress-bar"
    :class="stateClasses"
    :style="rootStyle"
    role="progressbar"
    :aria-valuenow="isIndeterminate ? undefined : progressValue"
    :aria-valuemin="isIndeterminate ? undefined : minimum"
    :aria-valuemax="isIndeterminate ? undefined : maximum"
    :aria-busy="isIndeterminate ? 'true' : undefined">
    <div class="LayoutRoot">
      <div class="ProgressBarRoot">
        <div class="ProgressBarClip">
          <div class="ProgressBarTrack" />
          <div class="DeterminateProgressBarIndicator" :style="determinateIndicatorStyle" />
          <div class="IndeterminateProgressBarIndicator" />
          <div class="IndeterminateProgressBarIndicator2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  // RangeBase properties used by the official ProgressBar.
  Value: { type: Number, default: 0 },
  Minimum: { type: Number, default: 0 },
  Maximum: { type: Number, default: 100 },
  IsIndeterminate: { type: [Boolean, String], default: false },
  ShowError: { type: [Boolean, String], default: false },
  ShowPaused: { type: [Boolean, String], default: false },

  // FrameworkElement, Control and Border properties used by the default style.
  Width: { type: [Number, String], default: '' },
  Height: { type: [Number, String], default: '' },
  MinHeight: { type: [Number, String], default: 3 },
  Margin: { type: [Number, String], default: '' },
  Padding: { type: [Number, String], default: '' },
  BorderThickness: { type: [Number, String], default: 0 },
  BorderBrush: { type: [String, Object], default: '' },
  Background: { type: [String, Object], default: '' },
  Foreground: { type: [String, Object], default: '' },
  CornerRadius: { type: [Number, String], default: 1.5 },
  HorizontalAlignment: { type: String, default: 'Stretch' },
  VerticalAlignment: { type: String, default: 'Center' },
  Visibility: { type: String, default: 'Visible' },
  IsEnabled: { type: Boolean, default: true }
});

const emit = defineEmits(['update:Value', 'ValueChanged']);
const attrs = useAttrs();
const rootRef = ref(null);
const measuredSize = ref({ width: 0, height: 0 });
let resizeObserver;

const toFiniteNumber = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const isTrue = (value) => value === true || value === 'True' || value === 'true';

const minimum = computed(() => toFiniteNumber(props.Minimum, 0));
const maximum = computed(() => toFiniteNumber(props.Maximum, 100));
const range = computed(() => maximum.value - minimum.value);
const progressValue = computed(() => {
  const value = toFiniteNumber(props.Value, minimum.value);
  if (range.value <= 0) return minimum.value;
  return Math.min(maximum.value, Math.max(minimum.value, value));
});
const progressPercent = computed(() => {
  if (range.value <= 0) return 0;
  return ((progressValue.value - minimum.value) / range.value) * 100;
});
const isCollapsed = computed(() => props.Visibility === 'Collapsed');
const isIndeterminate = computed(() => isTrue(props.IsIndeterminate) && props.Visibility === 'Visible');
const visualState = computed(() => {
  if (isIndeterminate.value) {
    if (isTrue(props.ShowError)) return 'IndeterminateError';
    if (isTrue(props.ShowPaused)) return 'IndeterminatePaused';
    return 'Indeterminate';
  }
  if (isTrue(props.ShowError)) return 'Error';
  if (isTrue(props.ShowPaused)) return 'Paused';
  return 'Determinate';
});

const stateClasses = computed(() => ({
  'is-indeterminate': isIndeterminate.value,
  'is-paused': visualState.value === 'Paused' || visualState.value === 'IndeterminatePaused',
  'is-error': visualState.value === 'Error' || visualState.value === 'IndeterminateError',
  'is-disabled': !props.IsEnabled,
  'is-collapsed': isCollapsed.value,
  [`state-${visualState.value}`]: true
}));

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return undefined;
  if (typeof value === 'number') return `${value}px`;
  const text = String(value).trim();
  if (!text) return undefined;
  return /^-?\d+(?:\.\d+)?$/.test(text) ? `${text}px` : text;
};

const xamlThickness = (value) => {
  if (value === '' || value === undefined || value === null) return undefined;
  const parts = String(value).split(',').map((part) => cssLength(part.trim()));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return cssLength(value);
};

const cssCornerRadius = (value) => {
  if (value === '' || value === undefined || value === null) return undefined;
  const parts = String(value).split(',').map((part) => cssLength(part.trim()));
  if (parts.length === 1) return parts[0];
  if (parts.length === 4) return `${parts[0]} ${parts[1]} ${parts[2]} ${parts[3]}`;
  return cssLength(value);
};

const brushValue = (brush) => {
  if (!brush) return undefined;
  if (typeof brush === 'string') return brush;
  if (typeof brush === 'object') return brush.Color || brush.color || brush.Value || brush.value;
  return undefined;
};

const alignmentStyle = (alignment, axis) => {
  const value = String(alignment || '').toLowerCase();
  if (axis === 'vertical') {
    return { center: 'center', top: 'flex-start', bottom: 'flex-end', stretch: 'stretch' }[value] || 'center';
  }
  return { left: 'flex-start', center: 'center', right: 'flex-end', stretch: 'stretch' }[value] || 'stretch';
};

const forwardedAttrs = computed(() => {
  const next = { ...attrs };
  delete next.class;
  delete next.style;
  delete next.role;
  delete next['aria-valuenow'];
  delete next['aria-valuemin'];
  delete next['aria-valuemax'];
  delete next['aria-busy'];
  const automationName = next['AutomationProperties.Name'];
  if (automationName && !next['aria-label']) next['aria-label'] = automationName;
  delete next['AutomationProperties.Name'];
  return next;
});

const rootStyle = computed(() => {
  const foreground = brushValue(props.Foreground);
  const background = brushValue(props.Background);
  const borderBrush = brushValue(props.BorderBrush);
  return [attrs.style, {
    width: props.Width === '' ? '100%' : cssLength(props.Width),
    // The default template binds its grid height to MinHeight (3px).
    height: cssLength(props.Height) || cssLength(props.MinHeight),
    minHeight: cssLength(props.MinHeight),
    margin: xamlThickness(props.Margin),
    padding: xamlThickness(props.Padding),
    borderWidth: xamlThickness(props.BorderThickness),
    borderStyle: xamlThickness(props.BorderThickness) ? 'solid' : undefined,
    borderColor: borderBrush || 'var(--ProgressBarBorderBrush, var(--ControlStrokeColorDefaultBrush, var(--ctrl-border)))',
    borderRadius: cssCornerRadius(props.CornerRadius),
    display: isCollapsed.value ? 'none' : 'inline-block',
    visibility: props.Visibility === 'Hidden' ? 'hidden' : undefined,
    alignSelf: alignmentStyle(props.VerticalAlignment, 'vertical'),
    justifySelf: alignmentStyle(props.HorizontalAlignment, 'horizontal'),
    '--ProgressBarForeground': foreground,
    '--ProgressBarBackground': background,
    '--ProgressBarBorderBrush': borderBrush,
    '--ProgressBarMinHeight': cssLength(props.MinHeight),
    '--ProgressBarCornerRadius': cssCornerRadius(props.CornerRadius)
  }];
});

const determinateIndicatorStyle = computed(() => ({ width: `${progressPercent.value}%` }));

// These are the official ProgressBarTemplateSettings values, expressed in pixels
// for consumers that inspect the component through the exposed WinUI-shaped API.
const TemplateSettings = computed(() => {
  const width = measuredSize.value.width;
  const height = measuredSize.value.height;
  const indicatorWidth = width * 0.4;
  const indicatorWidth2 = width * 0.6;
  return {
    ContainerAnimationStartPosition: indicatorWidth * -1,
    ContainerAnimationEndPosition: indicatorWidth * 3,
    Container2AnimationStartPosition: indicatorWidth2 * -1.5,
    Container2AnimationEndPosition: indicatorWidth2 * (1.66),
    ContainerAnimationMidPosition: 0,
    IndicatorLengthDelta: 0,
    ClipRect: { X: 0, Y: 0, Width: width, Height: height },
    EllipseAnimationEndPosition: width / 3,
    EllipseAnimationWellPosition: (width * 2) / 3,
    EllipseDiameter: width <= 180 ? 4 : width <= 280 ? 5 : 6,
    EllipseOffset: width <= 180 ? 4 : width <= 280 ? 7 : 9
  };
});

defineExpose({ TemplateSettings });

const updateMeasuredSize = () => {
  if (!rootRef.value) return;
  measuredSize.value = {
    width: rootRef.value.clientWidth,
    height: rootRef.value.clientHeight
  };
};

onMounted(async () => {
  await nextTick();
  updateMeasuredSize();
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updateMeasuredSize);
    resizeObserver.observe(rootRef.value);
  }
});

onBeforeUnmount(() => resizeObserver?.disconnect());

watch(() => props.Value, (newValue, oldValue) => {
  if (oldValue === undefined || Object.is(newValue, oldValue)) return;
  emit('ValueChanged', { OldValue: oldValue, NewValue: newValue });
});
</script>

<style>
.win-progress-bar {
  --ProgressBarForeground: var(--AccentFillColorDefaultBrush, var(--accent-base));
  --ProgressBarBackground: var(--ControlStrongStrokeColorDefaultBrush, var(--ctrl-strong-stroke));
  --ProgressBarBorderBrush: var(--ControlStrokeColorDefaultBrush, var(--ctrl-border));
  --ProgressBarPausedForegroundColor: var(--SystemFillColorCautionBrush, #9D5D00);
  --ProgressBarErrorForegroundColor: var(--SystemFillColorCriticalBrush, #C42B1C);
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  min-width: 1px;
  vertical-align: middle;
  color: var(--ProgressBarForeground);
}

.LayoutRoot,
.ProgressBarRoot,
.ProgressBarClip {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: inherit;
  box-sizing: border-box;
}

.ProgressBarRoot {
  overflow: visible;
  border-radius: inherit;
}

.ProgressBarClip {
  overflow: visible;
  border-radius: inherit;
}

.state-Indeterminate .ProgressBarClip,
.state-IndeterminatePaused .ProgressBarClip,
.state-IndeterminateError .ProgressBarClip {
  overflow: hidden;
}

.ProgressBarTrack,
.DeterminateProgressBarIndicator,
.IndeterminateProgressBarIndicator,
.IndeterminateProgressBarIndicator2 {
  position: absolute;
  left: 0;
  box-sizing: border-box;
  transform-origin: left center;
  pointer-events: none;
}

.ProgressBarTrack {
  top: 50%;
  width: 100%;
  height: 1px;
  min-height: 1px;
  background: var(--ProgressBarBackground);
  transform: translateY(-50%);
  border-radius: 0.5px;
  transition: opacity 167ms linear, transform 750ms cubic-bezier(0, 0, 0, 1);
}

.DeterminateProgressBarIndicator,
.IndeterminateProgressBarIndicator,
.IndeterminateProgressBarIndicator2 {
  top: 0;
  height: 3px;
  min-height: 1px;
  border-radius: 1.5px;
  transform: none;
}

.DeterminateProgressBarIndicator {
  background: var(--ProgressBarForeground);
  transition: width 167ms cubic-bezier(0.4, 0, 0.6, 1), background-color 167ms linear;
}

.IndeterminateProgressBarIndicator,
.IndeterminateProgressBarIndicator2 {
  width: 40%;
  opacity: 0;
  background: var(--ProgressBarForeground);
}

.IndeterminateProgressBarIndicator2 {
  width: 60%;
}

.state-Indeterminate .ProgressBarTrack {
  opacity: 0;
}

.state-Indeterminate .IndeterminateProgressBarIndicator,
.state-Indeterminate .IndeterminateProgressBarIndicator2 {
  opacity: 1;
}

.state-Indeterminate .IndeterminateProgressBarIndicator {
  animation: win-progress-bar-indeterminate 2s infinite;
}

.state-Indeterminate .IndeterminateProgressBarIndicator2 {
  animation: win-progress-bar-indeterminate-2 2s infinite;
}

.state-IndeterminatePaused .ProgressBarTrack,
.state-IndeterminateError .ProgressBarTrack {
  opacity: 0;
}

.state-IndeterminatePaused .DeterminateProgressBarIndicator,
.state-IndeterminateError .DeterminateProgressBarIndicator,
.state-IndeterminatePaused .IndeterminateProgressBarIndicator,
.state-IndeterminateError .IndeterminateProgressBarIndicator {
  opacity: 0;
}

.state-IndeterminatePaused .IndeterminateProgressBarIndicator2,
.state-IndeterminateError .IndeterminateProgressBarIndicator2 {
  width: 100%;
  opacity: 1;
  animation: none;
  transform: translateX(0);
  transition: transform 750ms cubic-bezier(0, 0, 0, 1), background-color 167ms linear;
}

.state-IndeterminatePaused .IndeterminateProgressBarIndicator2 {
  background: var(--ProgressBarPausedForegroundColor);
}

.state-IndeterminateError .IndeterminateProgressBarIndicator2 {
  background: var(--ProgressBarErrorForegroundColor);
}

.state-Paused .DeterminateProgressBarIndicator {
  background: var(--ProgressBarPausedForegroundColor);
}

.state-Error .DeterminateProgressBarIndicator {
  background: var(--ProgressBarErrorForegroundColor);
}

.state-Paused .ProgressBarTrack,
.state-Error .ProgressBarTrack,
.state-Determinate .ProgressBarTrack {
  opacity: 1;
}

.is-disabled {
  opacity: 0.6;
}

@keyframes win-progress-bar-indeterminate {
  0% {
    transform: translateX(-100%);
  }
  75% {
    transform: translateX(300%);
  }
  100% {
    transform: translateX(300%);
  }
}

@keyframes win-progress-bar-indeterminate-2 {
  0% {
    transform: translateX(-150%);
  }
  37.5% {
    transform: translateX(-150%);
  }
  100% {
    transform: translateX(166%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .state-Indeterminate .IndeterminateProgressBarIndicator,
  .state-Indeterminate .IndeterminateProgressBarIndicator2 {
    animation-duration: 0.001ms;
    animation-iteration-count: 1;
  }

  .DeterminateProgressBarIndicator,
  .ProgressBarTrack,
  .IndeterminateProgressBarIndicator2 {
    transition-duration: 0.001ms;
  }
}
</style>
