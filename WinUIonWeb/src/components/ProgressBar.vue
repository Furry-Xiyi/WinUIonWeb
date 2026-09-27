<template>
  <div ref="rootRef" v-bind="forwardedAttrs" class="win-progress-bar" :class="[attrs.class, 'state-' + visualState]"
    :style="rootStyle" role="progressbar" :tabindex="isTabStop && isEnabled ? 0 : undefined"
    :aria-valuenow="isIndeterminate ? undefined : progressValue"
    :aria-valuemin="isIndeterminate ? undefined : minimum" :aria-valuemax="isIndeterminate ? undefined : maximum"
    :aria-busy="isIndeterminate ? 'true' : undefined" :aria-disabled="!isEnabled || undefined">
    <div ref="layoutRef" class="LayoutRoot">
      <div class="ProgressBarRoot" :style="borderStyle">
        <div class="ProgressBarClip">
          <div class="ProgressBarGrid" :style="gridStyle">
            <div ref="trackRef" class="ProgressBarTrack" />
            <div ref="determinateRef" class="DeterminateProgressBarIndicator" :style="determinateIndicatorStyle" />
            <div ref="indeterminateRef" class="IndeterminateProgressBarIndicator" :style="indeterminateIndicatorStyle" />
            <div ref="indeterminate2Ref" class="IndeterminateProgressBarIndicator2" :style="indeterminateIndicator2Style" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';
import { resolveXamlHandler, resolveXamlValue } from './xamlRuntime';
import { alignment, cssLength, xamlThickness } from './layout';
import { progressBoolean, progressBrush, progressCornerRadius, progressNumber, progressThickness, useProgressProperty, useProgressRange } from './progressRuntime';

defineOptions({ inheritAttrs: false });
const props = defineProps({
  Value: { type: [Number, String], default: 0 },
  Minimum: { type: [Number, String], default: 0 },
  Maximum: { type: [Number, String], default: 100 },
  IsIndeterminate: { type: [Boolean, String], default: false },
  ShowError: { type: [Boolean, String], default: false },
  ShowPaused: { type: [Boolean, String], default: false },
  Width: { type: [Number, String], default: '' },
  Height: { type: [Number, String], default: '' },
  MinWidth: { type: [Number, String], default: 0 },
  MinHeight: { type: [Number, String], default: 3 },
  MaxWidth: { type: [Number, String], default: '' },
  MaxHeight: { type: [Number, String], default: '' },
  Margin: { type: [Number, String], default: '' },
  Padding: { type: [Number, String], default: 0 },
  BorderThickness: { type: [Number, String], default: 0 },
  BorderBrush: { type: [String, Object], default: '{ThemeResource ProgressBarBorderBrush}' },
  Background: { type: [String, Object], default: '{ThemeResource ProgressBarBackground}' },
  Foreground: { type: [String, Object], default: '{ThemeResource ProgressBarForeground}' },
  CornerRadius: { type: [Number, String], default: 1.5 },
  HorizontalAlignment: { type: String, default: 'Stretch' },
  VerticalAlignment: { type: String, default: 'Center' },
  Visibility: { type: String, default: 'Visible' },
  IsEnabled: { type: [Boolean, String], default: true },
  IsTabStop: { type: [Boolean, String], default: false },
  IsHitTestVisible: { type: [Boolean, String], default: true }
});
const emit = defineEmits(['update:Value', 'update:Minimum', 'update:Maximum', 'update:Background', 'update:Foreground', 'update:IsIndeterminate', 'update:ShowError', 'update:ShowPaused', 'ValueChanged']);
const instance = getCurrentInstance();
const attrs = useAttrs();
const publish = (name, value) => emit('update:' + name, value);
const { Value, Minimum, Maximum, minimum, maximum, fraction, coercedValue: progressValue } = useProgressRange(props, instance, publish);
const IsIndeterminate = useProgressProperty(props, 'IsIndeterminate', instance, publish);
const ShowError = useProgressProperty(props, 'ShowError', instance, publish);
const ShowPaused = useProgressProperty(props, 'ShowPaused', instance, publish);
const Background = useProgressProperty(props, 'Background', instance, publish);
const Foreground = useProgressProperty(props, 'Foreground', instance, publish);
const rootRef = ref(null);
const layoutRef = ref(null);
const trackRef = ref(null);
const determinateRef = ref(null);
const indeterminateRef = ref(null);
const indeterminate2Ref = ref(null);
const measuredSize = ref({ width: 0, height: 0 });
const indicatorLengthDelta = ref(0);
const resolve = value => resolveXamlValue(value, instance);
const visibility = computed(() => resolve(props.Visibility));
const isIndeterminate = computed(() => progressBoolean(IsIndeterminate.value) && visibility.value === 'Visible');
const isEnabled = computed(() => progressBoolean(resolve(props.IsEnabled), true));
const isTabStop = computed(() => progressBoolean(resolve(props.IsTabStop)));
const visualState = computed(() => {
  const prefix = isIndeterminate.value ? 'Indeterminate' : '';
  if (progressBoolean(ShowError.value)) return prefix + 'Error';
  if (progressBoolean(ShowPaused.value)) return prefix + 'Paused';
  return isIndeterminate.value ? 'Indeterminate' : 'Determinate';
});
const forwardedAttrs = computed(() => {
  const next = { ...attrs };
  for (const name of ['class', 'style', 'role', 'aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-busy', 'ValueChanged']) delete next[name];
  if (next['AutomationProperties.Name']) next['aria-label'] = resolve(next['AutomationProperties.Name']);
  delete next['AutomationProperties.Name'];
  return next;
});
const padding = computed(() => progressThickness(resolve(props.Padding)));
const border = computed(() => progressThickness(resolve(props.BorderThickness)));
const contentWidth = computed(() => Math.max(0, measuredSize.value.width - padding.value.left - padding.value.right - border.value.left - border.value.right));
const indicatorWidth = computed(() => progressBoolean(IsIndeterminate.value) ? 0 : contentWidth.value * fraction.value);
const rootStyle = computed(() => {
  const minimumHeight = progressNumber(resolve(props.MinHeight), 3);
  const naturalHeight = minimumHeight + padding.value.top + padding.value.bottom + border.value.top + border.value.bottom;
  return [attrs.style, {
    width: cssLength(resolve(props.Width)) || (resolve(props.HorizontalAlignment) === 'Stretch' ? '100%' : undefined),
    flex: cssLength(resolve(props.Width)) ? '0 0 auto' : undefined,
    height: cssLength(resolve(props.Height)) || naturalHeight + 'px',
    maxInlineSize: '100%',
    minWidth: cssLength(resolve(props.MinWidth)), minHeight: minimumHeight + 'px',
    maxWidth: cssLength(resolve(props.MaxWidth)) || undefined, maxHeight: cssLength(resolve(props.MaxHeight)) || undefined,
    margin: xamlThickness(resolve(props.Margin)) || undefined,
    display: visibility.value === 'Collapsed' ? 'none' : 'inline-block',
    alignSelf: alignment(resolve(props.VerticalAlignment), 'vertical'),
    justifySelf: alignment(resolve(props.HorizontalAlignment), 'horizontal'),
    pointerEvents: progressBoolean(resolve(props.IsHitTestVisible), true) ? undefined : 'none',
    '--progress-bar-foreground': progressBrush(Foreground.value),
    '--progress-bar-background': progressBrush(Background.value),
    '--progress-bar-corner-radius': progressCornerRadius(resolve(props.CornerRadius))
  }];
});
const borderStyle = computed(() => ({
  borderWidth: xamlThickness(resolve(props.BorderThickness)),
  borderColor: progressBrush(resolve(props.BorderBrush)),
  borderRadius: progressCornerRadius(resolve(props.CornerRadius)),
  padding: xamlThickness(resolve(props.Padding))
}));
const gridStyle = computed(() => ({ height: cssLength(resolve(props.MinHeight)) || '3px' }));
const determinateIndicatorStyle = computed(() => ({ width: indicatorWidth.value + 'px' }));
const indeterminateIndicatorStyle = computed(() => ({ width: contentWidth.value * 0.4 + 'px' }));
const indeterminateIndicator2Style = computed(() => ({ width: contentWidth.value * (progressBoolean(ShowPaused.value) || progressBoolean(ShowError.value) ? 1 : 0.6) + 'px' }));
const TemplateSettings = computed(() => {
  const { width, height } = measuredSize.value;
  const pad = padding.value;
  return {
    ContainerAnimationStartPosition: width * -0.4, ContainerAnimationEndPosition: width * 1.2,
    Container2AnimationStartPosition: width * -0.9, Container2AnimationEndPosition: width * 0.6 * 1.66,
    ContainerAnimationMidPosition: 0, IndicatorLengthDelta: indicatorLengthDelta.value,
    ClipRect: { X: pad.left, Y: pad.top, Width: Math.max(0, width - pad.left - pad.right), Height: Math.max(0, height - pad.top - pad.bottom) },
    EllipseAnimationEndPosition: width / 3, EllipseAnimationWellPosition: width * 2 / 3,
    EllipseDiameter: width <= 180 ? 4 : width <= 280 ? 5 : 6, EllipseOffset: width <= 180 ? 4 : width <= 280 ? 7 : 9
  };
});
defineExpose({ Value, Minimum, Maximum, IsIndeterminate, ShowError, ShowPaused, Background, Foreground, TemplateSettings });

let resizeObserver;
let mounted = false;
let stateGeneration = 0;
const stateAnimations = new Set();
let repositionAnimation;
const animate = (element, frames, options) => {
  if (!element?.animate) return null;
  const animation = element.animate(frames, options);
  stateAnimations.add(animation);
  // A cancelled VisualState storyboard is an expected state change.
  animation.finished?.catch(() => {});
  return animation;
};
const cancelStateAnimations = () => {
  for (const animation of stateAnimations) animation.cancel();
  stateAnimations.clear();
};
const translate = value => 'translateX(' + value + 'px)';
const trackTranslate = value => 'translate(' + value + 'px, -50%)';
const startIndeterminateStoryboard = () => {
  const settings = TemplateSettings.value;
  animate(indeterminateRef.value, [
    { transform: translate(settings.ContainerAnimationStartPosition), offset: 0, easing: 'cubic-bezier(0.4, 0, 0.6, 1)' },
    { transform: translate(settings.ContainerAnimationEndPosition), offset: 0.75 },
    { transform: translate(settings.ContainerAnimationEndPosition), offset: 1 }
  ], { duration: 2000, iterations: Infinity });
  animate(indeterminate2Ref.value, [
    { transform: translate(settings.Container2AnimationStartPosition), offset: 0 },
    { transform: translate(settings.Container2AnimationStartPosition), offset: 0.375, easing: 'cubic-bezier(0.4, 0, 0.6, 1)' },
    { transform: translate(settings.Container2AnimationEndPosition), offset: 1 }
  ], { duration: 2000, iterations: Infinity });
};
const updateVisualState = async (state, previousState) => {
  if (!mounted) return;
  const generation = ++stateGeneration;
  const secondTransform = indeterminate2Ref.value ? getComputedStyle(indeterminate2Ref.value).transform : 'none';
  cancelStateAnimations();
  if (state === 'Indeterminate') {
    if (previousState === 'IndeterminatePaused' || previousState === 'IndeterminateError') {
      const settings = TemplateSettings.value;
      animate(indeterminateRef.value, [{ opacity: 0 }, { opacity: 0 }], { duration: 500 });
      animate(indeterminate2Ref.value, [
        { transform: secondTransform, easing: 'cubic-bezier(1, 0, 1, 1)' },
        { transform: translate(settings.ContainerAnimationEndPosition) }
      ], { duration: 333, fill: 'forwards' });
      const transition = animate(trackRef.value, [
        { transform: trackTranslate(0), easing: 'cubic-bezier(1, 0, 1, 1)' },
        { transform: trackTranslate(settings.ContainerAnimationEndPosition) }
      ], { duration: 500 });
      if (transition) await transition.finished.catch(() => {});
      if (generation !== stateGeneration) return;
      cancelStateAnimations();
    }
    startIndeterminateStoryboard();
  } else if (state === 'IndeterminatePaused' || state === 'IndeterminateError') {
    const settings = TemplateSettings.value;
    // The duplicate 167ms keyframe in ProgressBar.xaml exits the previous
    // segment and resets it before its 750ms settling animation.
    animate(indeterminate2Ref.value, [
      { transform: secondTransform, offset: 0, easing: 'cubic-bezier(1, 1, 0, 1)' },
      { transform: translate(settings.Container2AnimationEndPosition), offset: 0.166 / 0.75, easing: 'steps(1, end)' },
      { transform: translate(settings.Container2AnimationStartPosition), offset: 0.167 / 0.75, easing: 'cubic-bezier(0, 0, 0, 1)' },
      { transform: translate(settings.ContainerAnimationMidPosition), offset: 1 }
    ], { duration: 750, fill: 'forwards' });
    animate(trackRef.value, [
      { transform: trackTranslate(settings.Container2AnimationStartPosition), easing: 'cubic-bezier(0, 0, 0, 1)' },
      { transform: trackTranslate(0) }
    ], { duration: 750 });
  } else if (previousState === 'Indeterminate') {
    for (const element of [indeterminateRef.value, indeterminate2Ref.value, trackRef.value]) {
      animate(element, [{ opacity: 0 }, { opacity: 1 }], { duration: 167 });
    }
  }
};
const updateMeasuredSize = () => {
  if (!layoutRef.value) return;
  measuredSize.value = { width: layoutRef.value.clientWidth, height: layoutRef.value.clientHeight };
};
watch([visualState, () => measuredSize.value.width], ([state], [previousState]) => updateVisualState(state, previousState), { flush: 'post' });
watch(indicatorWidth, (width, oldWidth) => {
  indicatorLengthDelta.value = oldWidth - width;
  if (!mounted || isIndeterminate.value || visualState.value === 'Paused') return;
  repositionAnimation?.cancel();
  // RepositionThemeAnimation changes only the visual offset after Width is
  // updated. It does not animate the surrounding layout.
  repositionAnimation = determinateRef.value?.animate?.([
    { transform: translate(indicatorLengthDelta.value), easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)' },
    { transform: translate(0) }
  ], { duration: 200 });
  repositionAnimation?.finished?.catch(() => {});
}, { flush: 'post' });
watch(progressValue, (newValue, oldValue) => {
  if (Object.is(newValue, oldValue)) return;
  const args = { OldValue: oldValue, NewValue: newValue };
  resolveXamlHandler(attrs.ValueChanged, instance)?.(instance?.exposed, args);
  emit('ValueChanged', args);
});
onMounted(async () => {
  await nextTick();
  updateMeasuredSize();
  mounted = true;
  updateVisualState(visualState.value);
  if (typeof ResizeObserver !== 'undefined' && layoutRef.value) {
    resizeObserver = new ResizeObserver(updateMeasuredSize);
    resizeObserver.observe(layoutRef.value);
  }
});
onBeforeUnmount(() => {
  mounted = false;
  stateGeneration++;
  resizeObserver?.disconnect();
  cancelStateAnimations();
  repositionAnimation?.cancel();
});
</script>

<style scoped>
.win-progress-bar {
  --progress-bar-foreground: var(--ProgressBarForeground, var(--AccentFillColorDefaultBrush));
  --progress-bar-background: var(--ProgressBarBackground, var(--ControlStrongStrokeColorDefaultBrush));
  --progress-bar-corner-radius: var(--ProgressBarCornerRadius, 1.5px);
  position: relative;
  display: inline-block;
  flex: 0 0 auto;
  box-sizing: border-box;
  min-width: 0;
  vertical-align: middle;
}
.LayoutRoot, .ProgressBarRoot { position: relative; box-sizing: border-box; width: 100%; height: 100%; }
.ProgressBarRoot { display: flex; flex-direction: column; justify-content: center; border-style: solid; }
.ProgressBarClip { position: relative; flex: 0 0 auto; width: 100%; overflow: hidden; }
.ProgressBarGrid { position: relative; width: 100%; }
.ProgressBarTrack, .DeterminateProgressBarIndicator, .IndeterminateProgressBarIndicator, .IndeterminateProgressBarIndicator2 {
  position: absolute; left: 0; box-sizing: border-box; pointer-events: none;
}
.ProgressBarTrack {
  top: 50%; width: 100%; height: var(--ProgressBarTrackHeight, 1px); transform: translateY(-50%);
  background: var(--progress-bar-background); border-radius: var(--ProgressBarTrackCornerRadius, 0.5px);
}
.DeterminateProgressBarIndicator, .IndeterminateProgressBarIndicator, .IndeterminateProgressBarIndicator2 {
  top: 0; height: 100%; background: var(--progress-bar-foreground); border-radius: var(--progress-bar-corner-radius);
  transition: background-color 167ms linear;
}
.IndeterminateProgressBarIndicator, .IndeterminateProgressBarIndicator2 { opacity: 0; }
.state-Indeterminate .IndeterminateProgressBarIndicator, .state-Indeterminate .IndeterminateProgressBarIndicator2 { opacity: 1; }
.state-Indeterminate .ProgressBarTrack, .state-IndeterminatePaused .ProgressBarTrack, .state-IndeterminateError .ProgressBarTrack { opacity: 0; }
.state-IndeterminatePaused .DeterminateProgressBarIndicator, .state-IndeterminateError .DeterminateProgressBarIndicator { opacity: 0; }
.state-IndeterminatePaused .IndeterminateProgressBarIndicator2, .state-IndeterminateError .IndeterminateProgressBarIndicator2 { opacity: 1; }
.state-Paused .DeterminateProgressBarIndicator, .state-IndeterminatePaused .IndeterminateProgressBarIndicator2 {
  background: var(--ProgressBarPausedForegroundColor, var(--SystemFillColorCautionBrush));
}
.state-Error .DeterminateProgressBarIndicator, .state-IndeterminateError .IndeterminateProgressBarIndicator2 {
  background: var(--ProgressBarErrorForegroundColor, var(--SystemFillColorCriticalBrush));
}
</style>
