<template>
  <div ref="rootRef" v-bind="forwardedAttrs" class="win-progress-ring" :class="[attrs.class, stateClasses]"
    :style="rootStyle" :tabindex="isTabStop && isEnabled ? 0 : undefined"
    role="progressbar" :aria-valuenow="isIndeterminate || !isActive ? undefined : progressValue"
    :aria-valuemin="isIndeterminate || !isActive ? undefined : minimum"
    :aria-valuemax="isIndeterminate || !isActive ? undefined : maximum"
    :aria-busy="isIndeterminate && isActive ? 'true' : undefined"
    :aria-hidden="!isActive ? 'true' : undefined" :aria-disabled="!isEnabled || undefined">
    <div class="LayoutRoot">
      <div class="LottiePlayer">
        <svg class="ProgressRingVisual" viewBox="0 0 100 100" preserveAspectRatio="none" role="presentation" aria-hidden="true">
          <circle class="ProgressRingTrack" cx="50" cy="50" :r="isIndeterminate ? 42 : 44.25" />
          <circle class="ProgressRingDeterminateIndicator" cx="50" cy="50" r="44.25" pathLength="100" :style="determinateStyle" />
          <circle ref="indeterminateRef" class="ProgressRingIndeterminateIndicator ProgressRingIndeterminateIndicatorA"
            cx="50" cy="50" r="42" pathLength="100" />
          <circle ref="indeterminateBRef" class="ProgressRingIndeterminateIndicator ProgressRingIndeterminateIndicatorB"
            cx="50" cy="50" r="42" pathLength="100" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';
import { resolveXamlHandler, resolveXamlValue } from './xamlRuntime';
import { alignment, cssLength, xamlThickness } from './layout';
import { determinateRingTrim, progressBoolean, progressBrush, useProgressProperty, useProgressRange } from './progressRuntime';

defineOptions({ inheritAttrs: false });
const props = defineProps({
  IsActive: { type: [Boolean, String], default: true },
  IsIndeterminate: { type: [Boolean, String], default: true },
  DeterminateSource: { type: Object, default: null },
  IndeterminateSource: { type: Object, default: null },
  Value: { type: [Number, String], default: 0 },
  Minimum: { type: [Number, String], default: 0 },
  Maximum: { type: [Number, String], default: 100 },
  Width: { type: [Number, String], default: 32 },
  Height: { type: [Number, String], default: 32 },
  MinWidth: { type: [Number, String], default: 16 },
  MinHeight: { type: [Number, String], default: 16 },
  MaxWidth: { type: [Number, String], default: '' },
  MaxHeight: { type: [Number, String], default: '' },
  Margin: { type: [Number, String], default: '' },
  Foreground: { type: [String, Object], default: '{ThemeResource ProgressRingForegroundThemeBrush}' },
  Background: { type: [String, Object], default: '{ThemeResource ProgressRingBackgroundThemeBrush}' },
  HorizontalAlignment: { type: String, default: 'Center' },
  VerticalAlignment: { type: String, default: 'Center' },
  IsHitTestVisible: { type: [Boolean, String], default: false },
  IsTabStop: { type: [Boolean, String], default: false },
  IsEnabled: { type: [Boolean, String], default: true },
  Visibility: { type: String, default: 'Visible' }
});
const emit = defineEmits(['ValueChanged', 'update:Value', 'update:Minimum', 'update:Maximum', 'update:IsActive', 'update:IsIndeterminate', 'update:Background', 'update:Foreground']);
const attrs = useAttrs();
const instance = getCurrentInstance();
const resolve = value => resolveXamlValue(value, instance);
const publish = (name, value) => emit('update:' + name, value);
const { Value, Minimum, Maximum, minimum, maximum, fraction: progressFraction, coercedValue: progressValue } = useProgressRange(props, instance, publish);
const IsActive = useProgressProperty(props, 'IsActive', instance, publish);
const IsIndeterminate = useProgressProperty(props, 'IsIndeterminate', instance, publish);
const Background = useProgressProperty(props, 'Background', instance, publish);
const Foreground = useProgressProperty(props, 'Foreground', instance, publish);
const isActive = computed(() => progressBoolean(IsActive.value, true));
const isIndeterminate = computed(() => progressBoolean(IsIndeterminate.value, true));
const visibility = computed(() => resolve(props.Visibility));
const isEnabled = computed(() => progressBoolean(resolve(props.IsEnabled), true));
const isTabStop = computed(() => progressBoolean(resolve(props.IsTabStop)));
const rootRef = ref(null);
const indeterminateRef = ref(null);
const indeterminateBRef = ref(null);
const measuredSize = ref({ width: 0, height: 0 });
const displayedProgress = ref(progressFraction.value);
let resizeObserver;
let animationFrame = 0;
let animationStart = 0;
let determinateFrame = 0;
let mounted = false;

const forwardedAttrs = computed(() => {
  const next = { ...attrs };
  for (const name of ['class', 'style', 'role', 'aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-busy', 'aria-hidden', 'ValueChanged']) delete next[name];
  if (next['AutomationProperties.Name']) next['aria-label'] = resolve(next['AutomationProperties.Name']);
  delete next['AutomationProperties.Name'];
  return next;
});
const stateClasses = computed(() => ({
  'is-active': isActive.value,
  'is-inactive': !isActive.value,
  'is-indeterminate': isIndeterminate.value,
  'is-determinate': !isIndeterminate.value,
  'is-disabled': !isEnabled.value,
  'is-collapsed': visibility.value === 'Collapsed'
}));
const rootStyle = computed(() => [attrs.style, {
  width: cssLength(resolve(props.Width)), height: cssLength(resolve(props.Height)),
  flex: cssLength(resolve(props.Width)) ? '0 0 auto' : undefined,
  minWidth: cssLength(resolve(props.MinWidth)), minHeight: cssLength(resolve(props.MinHeight)),
  maxWidth: cssLength(resolve(props.MaxWidth)) || undefined, maxHeight: cssLength(resolve(props.MaxHeight)) || undefined,
  margin: xamlThickness(resolve(props.Margin)) || undefined,
  alignSelf: alignment(resolve(props.VerticalAlignment), 'vertical'),
  justifySelf: alignment(resolve(props.HorizontalAlignment), 'horizontal'),
  pointerEvents: progressBoolean(resolve(props.IsHitTestVisible)) ? undefined : 'none',
  display: visibility.value === 'Collapsed' ? 'none' : undefined,
  '--progress-ring-foreground': progressBrush(Foreground.value),
  '--progress-ring-background': progressBrush(Background.value)
}]);
const determinateStyle = computed(() => ({
  strokeDashoffset: String(100 - determinateRingTrim(displayedProgress.value) * 100),
  // ShapeVisibilityAnimation in the official source hides the first frame.
  opacity: displayedProgress.value < 0.00833333377 ? 0 : 1
}));
const TemplateSettings = computed(() => {
  const width = measuredSize.value.width;
  const diameter = width > 0 ? width * 0.1 + (width <= 40 ? 1 : 0) : 0;
  return {
    EllipseDiameter: diameter,
    EllipseOffset: { Left: 0, Top: width * 0.5 - diameter, Right: 0, Bottom: 0 },
    MaxSideLength: width
  };
});
defineExpose({ Value, Minimum, Maximum, IsActive, IsIndeterminate, Background, Foreground, TemplateSettings });

const updateMeasuredSize = () => {
  if (!rootRef.value) return;
  measuredSize.value = { width: rootRef.value.clientWidth, height: rootRef.value.clientHeight };
};
const officialEasing = value => {
  // These official control points lie on the diagonal, so the mapping is linear.
  return value;
};
const setTrim = (element, start, end, opacity) => {
  if (!element) return;
  const length = Math.max(0.0001, (end - start) * 100);
  const gap = Math.max(0.0001, 100 - length);
  element.style.strokeDasharray = length + ' ' + gap;
  element.style.strokeDashoffset = String(-start * 100);
  element.style.opacity = String(opacity);
};
const renderIndeterminateFrame = timestamp => {
  if (!animationStart) animationStart = timestamp;
  const progress = ((timestamp - animationStart) % 2000) / 2000;
  const firstHalf = progress < 0.5;
  const localProgress = officialEasing(firstHalf ? progress * 2 : (progress - 0.5) * 2);
  const rotationProgress = firstHalf ? localProgress * 0.5 : 0.5 + localProgress * 0.5;
  const rotation = rotationProgress * 900 - 90;
  const transform = 'rotate(' + rotation + ' 50 50)';
  // Preserve the existing indeterminate double-arc appearance and 2s timeline.
  indeterminateRef.value?.setAttribute('transform', transform);
  indeterminateBRef.value?.setAttribute('transform', transform);
  if (firstHalf) {
    setTrim(indeterminateRef.value, 0, 0.5, 0);
    setTrim(indeterminateBRef.value, 0, 0.0001 + localProgress * 0.5, 1);
  } else {
    setTrim(indeterminateRef.value, localProgress * 0.5, 0.5, 1);
    setTrim(indeterminateBRef.value, 0, 0.5, 0);
  }
  animationFrame = window.requestAnimationFrame(renderIndeterminateFrame);
};
const stopIndeterminateAnimation = () => {
  if (animationFrame) window.cancelAnimationFrame(animationFrame);
  animationFrame = 0;
  animationStart = 0;
};
const syncIndeterminateAnimation = () => {
  stopIndeterminateAnimation();
  if (mounted && isActive.value && isIndeterminate.value && visibility.value === 'Visible') {
    animationFrame = window.requestAnimationFrame(renderIndeterminateFrame);
  }
};
const stopDeterminateAnimation = () => {
  if (determinateFrame) window.cancelAnimationFrame(determinateFrame);
  determinateFrame = 0;
};
const updateDeterminateProgress = (target, previous) => {
  stopDeterminateAnimation();
  // UpdateLottieProgress plays increases; decreases use SetProgress immediately.
  if (!mounted || isIndeterminate.value || !isActive.value || target <= previous || !Number.isFinite(previous)) {
    displayedProgress.value = target;
    return;
  }
  const from = Math.max(0, Math.min(target, displayedProgress.value));
  const duration = Math.max(0, (target - previous) * 2000);
  let start = 0;
  const frame = timestamp => {
    if (!start) start = timestamp;
    const fraction = duration > 0 ? Math.min(1, (timestamp - start) / duration) : 1;
    displayedProgress.value = from + (target - from) * fraction;
    if (fraction < 1) determinateFrame = window.requestAnimationFrame(frame);
    else determinateFrame = 0;
  };
  determinateFrame = window.requestAnimationFrame(frame);
};
watch(progressFraction, updateDeterminateProgress);
watch(progressValue, (newValue, oldValue) => {
  if (Object.is(newValue, oldValue)) return;
  const args = { OldValue: oldValue, NewValue: newValue };
  resolveXamlHandler(attrs.ValueChanged, instance)?.(instance?.exposed, args);
  emit('ValueChanged', args);
});
watch([isActive, isIndeterminate, visibility], () => {
  syncIndeterminateAnimation();
  stopDeterminateAnimation();
  displayedProgress.value = progressFraction.value;
});
onMounted(async () => {
  await nextTick();
  mounted = true;
  updateMeasuredSize();
  syncIndeterminateAnimation();
  if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
    resizeObserver = new ResizeObserver(updateMeasuredSize);
    resizeObserver.observe(rootRef.value);
  }
});
onBeforeUnmount(() => {
  mounted = false;
  resizeObserver?.disconnect();
  stopIndeterminateAnimation();
  stopDeterminateAnimation();
});
</script>

<style scoped>
.win-progress-ring {
  position: relative; display: inline-flex; flex: 0 0 auto; box-sizing: border-box; vertical-align: middle;
}
.LayoutRoot, .LottiePlayer, .ProgressRingVisual { display: block; width: 100%; height: 100%; }
.LayoutRoot, .LottiePlayer { background: transparent; }
.is-inactive .LayoutRoot { opacity: 0; }
.ProgressRingVisual { overflow: hidden; }
.ProgressRingTrack, .ProgressRingDeterminateIndicator, .ProgressRingIndeterminateIndicator {
  fill: none; stroke-width: 8; stroke-linecap: round;
}
.ProgressRingTrack { stroke: var(--progress-ring-background, transparent); }
.ProgressRingDeterminateIndicator {
  stroke: var(--progress-ring-foreground, var(--AccentFillColorDefaultBrush));
  stroke-width: 8.296875; stroke-dasharray: 100;
  transform: rotate(-90deg); transform-origin: center;
}
.is-determinate .ProgressRingTrack { stroke-width: 8.296875; }
.ProgressRingIndeterminateIndicator {
  display: none; stroke: var(--progress-ring-foreground, var(--AccentFillColorDefaultBrush));
  stroke-dasharray: 0.01 100; stroke-dashoffset: 0;
}
.is-indeterminate .ProgressRingDeterminateIndicator { display: none; }
.is-indeterminate .ProgressRingIndeterminateIndicator { display: block; }
.is-inactive .ProgressRingIndeterminateIndicator { display: none; }
</style>
