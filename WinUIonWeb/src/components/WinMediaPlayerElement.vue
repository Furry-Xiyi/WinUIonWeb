<template>
  <div class="win-media-player" :class="{ 'controls-visible': controlsVisible }" :style="{ maxWidth: cssLength(MaxWidth) }" @mouseenter="showControls" @mouseleave="scheduleHideControls">
    <div class="win-media-surface">
      <video
        ref="videoRef"
        :src="Source"
        :autoplay="AutoPlay"
        :loop="Loop"
        :muted="Muted"
        :controls="nativeControls"
        :poster="Poster"
        :disableRemotePlayback="false"
        :style="{ objectFit: aspectMode }"
        @timeupdate="syncFromVideo"
        @loadedmetadata="syncFromVideo"
        @play="isPlaying = true"
        @pause="isPlaying = false"></video>
      <div v-if="AreTransportControlsEnabled && !nativeControls" class="win-media-controls" @mouseenter="showControls">
        <div class="win-media-row command-row">
          <WinFlyout ref="volumeFlyout" direction="up" align="center">
            <template #trigger>
              <button
                class="win-media-icon-button"
                :aria-label="mutedState ? t('text.unmute') : t('text.volume')"
                v-bind="{ 'tooltipservice.tooltip': mutedState ? t('text.unmute') : t('text.volume') }"
                @click.stop="volumeFlyout?.toggle()">
                <span class="icon">{{ muteIcon }}</span>
              </button>
            </template>
            <div class="win-media-volume-panel">
              <WinButton
                Style="SubtleButtonStyle"
                class="win-media-volume-subtle"
                v-bind="{ 'tooltipservice.tooltip': mutedState ? t('text.unmute') : t('text.mute') }"
                @Click="toggleMute">
                <span class="icon">{{ muteIcon }}</span>
              </WinButton>
              <input class="win-media-range volume-range" type="range" min="0" max="100" step="1" :value="volumeValue" @input="setVolume" />
            </div>
          </WinFlyout>
          <button
            class="win-media-icon-button play-button"
            :aria-label="isPlaying ? t('text.pause') : t('text.play')"
            v-bind="{ 'tooltipservice.tooltip': isPlaying ? t('text.pause') : t('text.play') }"
            @click="togglePlay">
            <span class="icon">{{ playIcon }}</span>
          </button>
          <div class="right-command-group">
            <button class="win-media-icon-button" :aria-label="t('text.aspect-ratio')" v-bind="{ 'tooltipservice.tooltip': t('text.aspect-ratio') }" @click="toggleAspectMode">
              <span class="icon">&#xE9A6;</span>
            </button>
            <button class="win-media-icon-button" :aria-label="t('text.cast')" v-bind="{ 'tooltipservice.tooltip': t('text.cast') }" @click="showCastPanel">
              <span class="icon">&#xEC16;</span>
            </button>
          </div>
        </div>
        <div class="win-media-row seek-row">
          <span class="time-label">{{ elapsedTime }}</span>
          <input class="win-media-range win-media-seek" type="range" min="0" :max="duration || 100" step="0.01" :value="currentTime" @input="seekTo" />
          <span class="time-label">{{ remainingTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import WinButton from './WinButton.vue';
import WinFlyout from './WinFlyout.vue';
import { useI18n } from './i18n/index';

const { t } = useI18n();

const props = defineProps({
  Source: { type: String, default: '' },
  PosterSource: { type: String, default: '' },
  AutoPlay: { type: Boolean, default: false },
  Loop: { type: Boolean, default: false },
  Muted: { type: Boolean, default: false },
  AreTransportControlsEnabled: { type: Boolean, default: true },
  MaxWidth: { type: [String, Number], default: 400 },
  src: { type: String, default: '' },
  poster: String,
  autoPlay: Boolean,
  loop: Boolean,
  muted: Boolean,
  areTransportControlsEnabled: { type: Boolean, default: undefined },
  nativeControls: Boolean,
  maxWidth: { type: Number, default: 400 }
});

const videoRef = ref(null);
const isPlaying = ref(false);
const mutedState = ref(props.muted);
const currentTime = ref(0);
const duration = ref(0);
const volumeValue = ref(100);
const volumeFlyout = ref(null);
const controlsVisible = ref(true);
const aspectMode = ref('contain');
let hideTimer = null;
const Source = computed(() => props.Source || props.src);
const Poster = computed(() => props.PosterSource || props.poster);
const AutoPlay = computed(() => props.AutoPlay || props.autoPlay);
const Loop = computed(() => props.Loop || props.loop);
const Muted = computed(() => props.Muted || props.muted);
const AreTransportControlsEnabled = computed(() => props.AreTransportControlsEnabled ?? props.areTransportControlsEnabled ?? true);
const MaxWidth = computed(() => props.MaxWidth || props.maxWidth);

const syncFromVideo = () => {
  const video = videoRef.value;
  if (!video) return;
  currentTime.value = video.currentTime || 0;
  duration.value = Number.isFinite(video.duration) ? video.duration : 0;
  mutedState.value = video.muted;
};

const togglePlay = () => {
  const video = videoRef.value;
  if (!video) return;
  if (video.paused) video.play();
  else video.pause();
};

const showControls = () => {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  controlsVisible.value = true;
};

const scheduleHideControls = () => {
  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    controlsVisible.value = false;
  }, 1000);
};

const toggleMute = () => {
  const video = videoRef.value;
  if (!video) return;
  video.muted = !video.muted;
  syncFromVideo();
};

const format = (value) => {
  const safe = Math.max(0, Math.floor(value || 0));
  const hours = Math.floor(safe / 3600);
  const min = Math.floor((safe % 3600) / 60);
  const sec = String(safe % 60).padStart(2, '0');
  return `${hours}:${String(min).padStart(2, '0')}:${sec}`;
};

const elapsedTime = computed(() => format(currentTime.value));
const remainingTime = computed(() => format(Math.max(0, duration.value - currentTime.value)));
const playIcon = computed(() => isPlaying.value ? '\uE769' : '\uE768');
const muteIcon = computed(() => mutedState.value ? '\uE74F' : '\uE767');
const seekTo = (event) => {
  const video = videoRef.value;
  if (!video) return;
  video.currentTime = Number(event.target.value);
  syncFromVideo();
};

const setVolume = (event) => {
  volumeValue.value = Number(event.target.value);
};

const toggleAspectMode = () => {
  aspectMode.value = aspectMode.value === 'contain' ? 'cover' : 'contain';
};

const showCastPanel = async () => {
  const video = videoRef.value;
  if (typeof video?.webkitShowPlaybackTargetPicker === 'function') {
    video.webkitShowPlaybackTargetPicker();
    return;
  }

  if (!video || !video.remote) {
    alert(t('text.browser-does-not-support-casting'));
    return;
  }

  if (typeof video.remote.prompt !== 'function') {
    alert(t('text.casting-is-not-available'));
    return;
  }

  // 直接同步调用 prompt()
  video.remote.prompt().then(() => {
    console.log(t('text.casting-panel-opened-or-connecting'));
  }).catch((err) => {
    if (err.name === 'NotFoundError') {
      alert(t('text.no-casting-devices-found'));
    } else if (err.name === 'NotAllowedError') {
      console.log(t('text.casting-permission-denied'));
    } else if (err.name === 'AbortError') {
      console.log(t('text.casting-cancelled'));
    }
  });
};

watch(Muted, value => {
  mutedState.value = Muted.value;
  if (videoRef.value) videoRef.value.muted = Muted.value;
});

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.muted = Muted.value;
    volumeValue.value = Math.round((videoRef.value.volume ?? 1) * 100);
  }
});

onBeforeUnmount(() => {
  if (hideTimer) clearTimeout(hideTimer);
});

watch(volumeValue, value => {
  const video = videoRef.value;
  if (!video) return;
  const next = Math.max(0, Math.min(100, Number(value))) / 100;
  video.volume = next;
  if (next > 0 && video.muted) video.muted = false;
  if (next === 0) video.muted = true;
  syncFromVideo();
});

function cssLength(value) {
  if (value === '' || value === undefined || value === null) return undefined;
  return typeof value === 'number' ? `${value}px` : String(value).trim().match(/^\d+$/) ? `${value}px` : value;
}
</script>

<style>
  .win-media-player {
    position: relative;
    width: 100%;
    overflow: visible;
  }

.win-media-surface {
    position: relative;
    width: 100%;
    background: #000;
    border-radius: 0;
    overflow: hidden;
    border: 1px solid var(--card-stroke);
  }

  .win-media-player video {
    width: 100%;
    aspect-ratio: 16 / 9;
    display: block;
    background: #000;
  }

  .win-media-controls {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    min-height: 92px;
    padding: 10px 12px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 0;
    border: 0;
    isolation: isolate;
    background: transparent;
    color: white;
    box-shadow: none;
    opacity: 0;
    transform: translateY(18px);
    pointer-events: none;
    transition: opacity 260ms cubic-bezier(0.1, 0.9, 0.2, 1), transform 260ms cubic-bezier(0.1, 0.9, 0.2, 1);
    z-index: 5;
    -webkit-backdrop-filter: var(--flyout-backdrop, blur(30px));
    backdrop-filter: var(--flyout-backdrop, blur(30px));
  }

  .win-media-controls::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    border-radius: inherit;
    background: var(--MediaTransportControlsPanelBackground, rgba(0, 0, 0, 0.72));
  }

  .win-media-player.controls-visible .win-media-controls,
  .win-media-player:hover .win-media-controls {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .win-media-row {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .seek-row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 12px;
    height: 28px;
  }

  .command-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
  }

  .command-row > :last-child {
    justify-self: end;
  }

  .right-command-group {
    display: flex;
    justify-self: end;
    gap: 2px;
  }

  .win-media-icon-button {
    width: 36px;
    height: 36px;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: white;
    display: grid;
    place-items: center;
    cursor: pointer;
  }

  .win-media-icon-button:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  .win-media-icon-button:active {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.72);
  }

  .win-media-seek {
    width: 100%;
    min-width: 80px;
  }

  .win-media-range {
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    height: 20px;
    background: transparent;
    accent-color: var(--accent-base);
    cursor: pointer;
  }

  .win-media-range::-webkit-slider-runnable-track {
    height: 3px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.38);
  }

  .win-media-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    margin-top: -4.5px;
    border-radius: 50%;
    background: #fff;
    border: 0;
  }

  .win-media-range::-moz-range-track {
    height: 3px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.38);
  }

  .win-media-range::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fff;
    border: 0;
  }

  .time-label {
    min-width: 54px;
    color: rgba(255, 255, 255, 0.82);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }

  .win-media-volume-panel {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 260px;
  }

  .volume-range {
    min-width: 180px;
  }

  .win-media-volume-subtle {
    width: 32px;
    padding: 0;
  }

  .play-button {
    justify-self: center;
  }
</style>
