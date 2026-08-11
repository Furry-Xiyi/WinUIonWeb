<template>
  <div
    ref="rootRef"
    v-bind="forwardedAttrs"
    class="win-progress-ring"
    :class="stateClasses"
    :style="rootStyle"
    :tabindex="IsTabStop ? 0 : -1"
    role="progressbar"
    :aria-valuenow="isIndeterminate || !isActive ? undefined : progressValue"
    :aria-valuemin="isIndeterminate || !isActive ? undefined : minimum"
    :aria-valuemax="isIndeterminate || !isActive ? undefined : maximum"
    :aria-busy="isIndeterminate && isActive ? 'true' : undefined"
    :aria-hidden="!isActive ? 'true' : undefined">
    <div class="LayoutRoot">
      <svg
        class="ProgressRingVisual"
        viewBox="0 0 100 100"
        role="presentation"
        aria-hidden="true">
        <circle
          class="ProgressRingTrack"
          cx="50"
          cy="50"
          r="42" />
        <circle
          class="ProgressRingDeterminateIndicator"
          cx="50"
          cy="50"
          r="42"
          pathLength="100"
          :style="determinateStyle" />
        <circle
          ref="indeterminateRef"
          class="ProgressRingIndeterminateIndicator ProgressRingIndeterminateIndicatorA"
          cx="50"
          cy="50"
          r="42"
          pathLength="100" />
        <circle
          ref="indeterminateBRef"
          class="ProgressRingIndeterminateIndicator ProgressRingIndeterminateIndicatorB"
          cx="50"
          cy="50"
          r="42"
          pathLength="100" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  IsActive: { type: [Boolean, String], default: true },
  IsIndeterminate: { type: [Boolean, String], default: true },
  DeterminateSource: { type: Object, default: null },
  IndeterminateSource: { type: Object, default: null },
  Value: { type: Number, default: 0 },
  Minimum: { type: Number, default: 0 },
  Maximum: { type: Number, default: 100 },

  Width: { type: [Number, String], default: 32 },
  Height: { type: [Number, String], default: 32 },
  MinWidth: { type: [Number, String], default: 16 },
  MinHeight: { type: [Number, String], default: 16 },
  MaxWidth: { type: [Number, String], default: '' },
  MaxHeight: { type: [Number, String], default: '' },
  Margin: { type: [Number, String], default: '' },
  Foreground: { type: [String, Object], default: '' },
  Background: { type: [String, Object], default: '' },
  HorizontalAlignment: { type: String, default: 'Center' },
  VerticalAlignment: { type: String, default: 'Center' },
  IsHitTestVisible: { type: Boolean, default: false },
  IsTabStop: { type: Boolean, default: false },
  IsEnabled: { type: Boolean, default: true },
  Visibility: { type: String, default: 'Visible' }
});

const emit = defineEmits(['ValueChanged']);
const attrs = useAttrs();
const rootRef = ref(null);
const indeterminateRef = ref(null);
const indeterminateBRef = ref(null);
const measuredSize = ref({ width: 0, height: 0 });
let resizeObserver;
let animationFrame = 0;
let animationStart = 0;

const isTrue = (value) => value === true || value === 'True' || value === 'true';
const isActive = computed(() => isTrue(props.IsActive));
const isIndeterminate = computed(() => isTrue(props.IsIndeterminate));
const minimum = computed(() => Number.isFinite(Number(props.Minimum)) ? Number(props.Minimum) : 0);
const maximum = computed(() => {
  const value = Number.isFinite(Number(props.Maximum)) ? Number(props.Maximum) : 100;
  return Math.max(minimum.value, value);
});
const progressValue = computed(() => {
  const value = Number(props.Value);
  if (!Number.isFinite(value)) return minimum.value;
  return Math.min(maximum.value, Math.max(minimum.value, value));
});
const progressFraction = computed(() => {
  const range = maximum.value - minimum.value;
  return range > 0 ? (progressValue.value - minimum.value) / range : 0;
});

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
  return { left: 'flex-start', center: 'center', right: 'flex-end', stretch: 'stretch' }[value] || 'center';
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
  delete next['aria-hidden'];
  const automationName = next['AutomationProperties.Name'];
  if (automationName && !next['aria-label']) next['aria-label'] = automationName;
  delete next['AutomationProperties.Name'];
  return next;
});

const stateClasses = computed(() => ({
  'is-active': isActive.value,
  'is-inactive': !isActive.value,
  'is-indeterminate': isIndeterminate.value,
  'is-determinate': !isIndeterminate.value,
  'is-disabled': !props.IsEnabled,
  'is-hidden': props.Visibility === 'Hidden',
  'is-collapsed': props.Visibility === 'Collapsed'
}));

const rootStyle = computed(() => {
  const foreground = brushValue(props.Foreground);
  const background = brushValue(props.Background);
  return [attrs.style, {
    width: cssLength(props.Width),
    height: cssLength(props.Height),
    minWidth: cssLength(props.MinWidth),
    minHeight: cssLength(props.MinHeight),
    maxWidth: cssLength(props.MaxWidth),
    maxHeight: cssLength(props.MaxHeight),
    margin: xamlThickness(props.Margin),
    alignSelf: alignmentStyle(props.VerticalAlignment, 'vertical'),
    justifySelf: alignmentStyle(props.HorizontalAlignment, 'horizontal'),
    pointerEvents: props.IsHitTestVisible ? undefined : 'none',
    '--ProgressRingForeground': foreground || 'var(--AccentFillColorDefaultBrush, var(--accent-base))',
    '--ProgressRingBackground': background || 'transparent'
  }];
});

const determinateStyle = computed(() => ({
  strokeDashoffset: `${100 - progressFraction.value * 100}`
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

defineExpose({ TemplateSettings });

const updateMeasuredSize = () => {
  if (!rootRef.value) return;
  measuredSize.value = {
    width: rootRef.value.getBoundingClientRect().width,
    height: rootRef.value.getBoundingClientRect().height
  };
};

const officialEasing = (value) => {
  // Official control points are (.167,.167) and (.833,.833), which lie on
  // the diagonal and therefore produce a linear progress mapping.
  return value;
};

const setTrim = (element, start, end, opacity) => {
  if (!element) return;
  const length = Math.max(0.0001, (end - start) * 100);
  const gap = Math.max(0.0001, 100 - length);
  element.style.strokeDasharray = `${length} ${gap}`;
  element.style.strokeDashoffset = `${-start * 100}`;
  element.style.opacity = String(opacity);
};

const renderIndeterminateFrame = (timestamp) => {
  if (!animationStart) animationStart = timestamp;
  const progress = ((timestamp - animationStart) % 2000) / 2000;
  const firstHalf = progress < 0.5;
  const localProgress = officialEasing(firstHalf ? progress * 2 : (progress - 0.5) * 2);
  const rotationProgress = firstHalf ? localProgress * 0.5 : 0.5 + localProgress * 0.5;
  const rotation = rotationProgress * 900 - 90;
  const transform = `rotate(${rotation} 50 50)`;

  // ProgressRingIndeterminate.cpp: the same rotation is applied to both
  // shapes while their trim values are changed by the shared Progress.
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
  if (isActive.value && isIndeterminate.value && typeof window !== 'undefined') {
    animationFrame = window.requestAnimationFrame(renderIndeterminateFrame);
  }
};

watch(() => props.Value, (newValue, oldValue) => {
  if (oldValue !== undefined && !Object.is(newValue, oldValue)) {
    emit('ValueChanged', { OldValue: oldValue, NewValue: newValue });
  }
});

watch([isActive, isIndeterminate], syncIndeterminateAnimation);

onMounted(async () => {
  await nextTick();
  updateMeasuredSize();
  syncIndeterminateAnimation();
  if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
    resizeObserver = new ResizeObserver(updateMeasuredSize);
    resizeObserver.observe(rootRef.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  stopIndeterminateAnimation();
});
</script>

<style>
.win-progress-ring {
  --ProgressRingStrokeThickness: 8;
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  box-sizing: border-box;
  vertical-align: middle;
  color: var(--ProgressRingForeground);
  opacity: 1;
  transition: opacity 167ms linear;
}

.win-progress-ring.is-inactive,
.win-progress-ring.is-collapsed {
  opacity: 0;
}

.win-progress-ring.is-hidden {
  visibility: hidden;
}

.win-progress-ring.is-collapsed {
  display: none;
}

.win-progress-ring.is-disabled:not(.is-inactive):not(.is-collapsed) {
  opacity: 0.6;
}

.LayoutRoot,
.ProgressRingVisual {
  display: block;
  width: 100%;
  height: 100%;
}

.ProgressRingVisual {
  overflow: visible;
}

.ProgressRingTrack,
.ProgressRingDeterminateIndicator,
.ProgressRingIndeterminateIndicator {
  fill: none;
  stroke-width: var(--ProgressRingStrokeThickness);
  stroke-linecap: round;
}

.ProgressRingTrack {
  stroke: var(--ProgressRingBackground);
}

.ProgressRingDeterminateIndicator {
  stroke: var(--ProgressRingForeground);
  stroke-dasharray: 100;
  transform: rotate(-90deg);
  transform-origin: center;
}

.ProgressRingIndeterminateIndicator {
  display: none;
  stroke: var(--ProgressRingForeground);
  stroke-dasharray: 0.01 100;
  stroke-dashoffset: 0;
}

.is-indeterminate .ProgressRingDeterminateIndicator {
  display: none;
}

.is-indeterminate .ProgressRingIndeterminateIndicator {
  display: block;
}

.is-inactive .ProgressRingIndeterminateIndicator {
  display: none;
}
</style>
