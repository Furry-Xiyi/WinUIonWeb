<template>
  <div
    ref="rootRef"
    class="win-animated-visual-player"
    :class="{ 'is-playing': IsPlaying, 'is-loaded': IsAnimatedVisualLoaded }"
    :style="rootStyle"
    role="img">
    <img v-if="fallbackSource" class="win-animated-visual-fallback" :src="fallbackSource" alt="" />
    <svg v-else class="win-animated-visual" viewBox="0 0 375 667" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <rect class="lottie-background" x="0" y="0" width="375" height="667" />
      <g class="lottie-mark">
        <path class="mark-stroke mark-stroke-1" d="M112 333h151" />
        <path class="mark-stroke mark-stroke-2" d="M145 287v92" />
        <path class="mark-stroke mark-stroke-3" d="M188 268v131" />
        <path class="mark-stroke mark-stroke-4" d="M231 287v92" />
        <circle class="mark-dot mark-dot-1" cx="112" cy="333" r="10" />
        <circle class="mark-dot mark-dot-2" cx="145" cy="287" r="10" />
        <circle class="mark-dot mark-dot-3" cx="188" cy="268" r="10" />
        <circle class="mark-dot mark-dot-4" cx="231" cy="287" r="10" />
        <circle class="mark-dot mark-dot-5" cx="263" cy="333" r="10" />
      </g>
    </svg>
    <div v-if="!IsAnimatedVisualLoaded && $slots.FallbackContent" class="win-animated-visual-fallback-content">
      <slot name="FallbackContent" />
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  Source: { type: [String, Object], default: null },
  FallbackContent: { type: [String, Object], default: null },
  AutoPlay: { type: Boolean, default: true },
  AnimationOptimization: { type: String, default: 'Latency' },
  PlaybackRate: { type: Number, default: 1 },
  Stretch: { type: String, default: 'Uniform' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }
});

const rootRef = ref(null);
const IsPlaying = ref(false);
const IsAnimatedVisualLoaded = ref(false);
const progress = ref(0);
const Duration = ref(5967);
let playTimer = null;
let playResolve = null;

const cssLength = (value) => {
  if (value === '' || value === null || value === undefined) return undefined;
  return typeof value === 'number' || /^-?\d+(\.\d+)?$/.test(String(value).trim())
    ? `${value}px`
    : String(value);
};

const fallbackSource = computed(() => {
  if (typeof props.Source === 'string') return props.Source;
  if (props.Source && typeof props.Source === 'object') {
    return props.Source.UriSource || '';
  }
  if (typeof props.FallbackContent === 'string' && /^(https?:|data:|\/)/.test(props.FallbackContent)) {
    return props.FallbackContent;
  }
  return '';
});

const rootStyle = computed(() => ({
  width: cssLength(props.Width),
  height: cssLength(props.Height),
  minWidth: cssLength(props.MinWidth),
  minHeight: cssLength(props.MinHeight),
  maxWidth: cssLength(props.MaxWidth),
  maxHeight: cssLength(props.MaxHeight),
  justifySelf: ({ Left: 'start', Center: 'center', Right: 'end', Stretch: 'stretch' })[props.HorizontalAlignment] || undefined,
  alignSelf: ({ Top: 'start', Center: 'center', Bottom: 'end', Stretch: 'stretch' })[props.VerticalAlignment] || undefined,
  '--win-avp-rate': String(Math.abs(props.PlaybackRate) || 1),
  '--win-avp-direction': props.PlaybackRate < 0 ? 'reverse' : 'normal',
  '--win-avp-progress': String(progress.value)
}));

const clearPlayTimer = () => {
  if (playTimer) window.clearTimeout(playTimer);
  playTimer = null;
  if (playResolve) {
    playResolve();
    playResolve = null;
  }
};

const Pause = () => {
  IsPlaying.value = false;
  if (playTimer) {
    window.clearTimeout(playTimer);
    playTimer = null;
  }
};

const Resume = () => {
  if (props.PlaybackRate !== 0) IsPlaying.value = true;
};

const Stop = () => {
  clearPlayTimer();
  IsPlaying.value = false;
  progress.value = 0;
};

const PlayAsync = (fromProgress = 0, toProgress = 1, looped = false) => {
  clearPlayTimer();
  progress.value = Math.max(0, Math.min(1, Number(fromProgress)));
  IsPlaying.value = props.PlaybackRate !== 0;
  if (!IsPlaying.value) return Promise.resolve();
  return new Promise((resolve) => {
    playResolve = resolve;
    if (looped) return;
    playTimer = window.setTimeout(() => {
      progress.value = Math.max(0, Math.min(1, Number(toProgress)));
      IsPlaying.value = false;
      playTimer = null;
      playResolve = null;
      resolve();
    }, Duration.value / Math.max(Math.abs(props.PlaybackRate), 0.01));
  });
};

const SetProgress = (value) => {
  progress.value = Math.max(0, Math.min(1, Number(value)));
};

onMounted(() => {
  IsAnimatedVisualLoaded.value = true;
  if (props.AutoPlay) PlayAsync(0, 1, true);
});

watch(() => props.AutoPlay, (value) => {
  if (value) PlayAsync(progress.value, 1, true);
  else Pause();
});

watch(() => props.PlaybackRate, (value) => {
  if (value === 0) Pause();
});

watch(() => props.Source, () => {
  IsAnimatedVisualLoaded.value = false;
  requestAnimationFrame(() => { IsAnimatedVisualLoaded.value = true; });
});

onBeforeUnmount(clearPlayTimer);

defineExpose({
  Diagnostics: null,
  Duration,
  IsAnimatedVisualLoaded,
  IsPlaying,
  ProgressObject: null,
  Pause,
  PlayAsync,
  Resume,
  SetProgress,
  Stop,
  rootRef
});
</script>

<style>
.win-animated-visual-player {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  min-height: 48px;
  overflow: hidden;
  color: #007a87;
}

.win-animated-visual,
.win-animated-visual-fallback {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

.win-animated-visual-fallback-content {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}

.lottie-mark {
  transform-origin: 187.5px 333.5px;
  transform: rotate(calc(var(--win-avp-progress, 0) * 360deg));
  animation: win-lottie-logo 5.967s linear infinite paused;
}

.is-playing .lottie-mark {
  animation-play-state: running;
  animation-duration: calc(5.967s / var(--win-avp-rate, 1));
  animation-direction: var(--win-avp-direction, normal);
}

.mark-stroke {
  fill: none;
  stroke: #007a87;
  stroke-linecap: round;
  stroke-width: 11;
  stroke-dasharray: 1 1;
  transform-box: fill-box;
  transform-origin: center;
  opacity: .78;
}

.mark-stroke-1 { stroke: #00d1c1; stroke-width: 9; }
.mark-stroke-2 { stroke-width: 14; }
.mark-stroke-3 { stroke: #fff; stroke-width: 16; }
.mark-stroke-4 { stroke-width: 14; }

.mark-dot { fill: #fff; }
.mark-dot-1,
.mark-dot-5 { fill: #00d1c1; }

.lottie-background { fill: #00d1c1; }

@keyframes win-lottie-logo {
  0% { transform: rotate(0deg) scale(.92); }
  45% { transform: rotate(180deg) scale(1); }
  100% { transform: rotate(360deg) scale(.92); }
}
</style>
