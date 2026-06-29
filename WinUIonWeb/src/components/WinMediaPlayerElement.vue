<template>
  <div class="win-media-player" :class="{ 'controls-visible': controlsVisible }" :style="{ maxWidth: maxWidth + 'px' }" @mouseenter="showControls" @mouseleave="scheduleHideControls">
    <div class="win-media-surface">
      <video
        ref="videoRef"
        :src="src"
        :autoplay="autoPlay"
        :loop="loop"
        :muted="muted"
        :controls="nativeControls"
        :poster="poster"
        @timeupdate="syncFromVideo"
        @loadedmetadata="syncFromVideo"
        @play="isPlaying = true"
        @pause="isPlaying = false"></video>
      <div v-if="areTransportControlsEnabled && !nativeControls" class="win-media-controls" @mouseenter="showControls">
        <div class="win-media-row seek-row">
          <WinSlider class="win-media-seek" v-model="progressValue" :min="0" :max="duration || 100" />
        </div>
        <div class="win-media-row time-row">
          <span>{{ elapsedTime }}</span>
          <span>{{ remainingTime }}</span>
        </div>
        <div class="win-media-row command-row">
          <WinFlyout ref="volumeFlyout" direction="up" align="center">
            <template #trigger>
              <button class="win-media-icon-button" @click.stop="volumeFlyout?.toggle()" :aria-label="mutedState ? 'Unmute' : 'Volume'">
                <span class="icon">{{ muteIcon }}</span>
              </button>
            </template>
            <div class="win-media-volume-panel">
              <WinButton subtle class="win-media-volume-subtle" @click="toggleMute">
                <span class="icon">{{ muteIcon }}</span>
              </WinButton>
              <WinSlider v-model="volumeValue" :min="0" :max="100" />
            </div>
          </WinFlyout>
          <button class="win-media-icon-button play-button" @click="togglePlay" :aria-label="isPlaying ? 'Pause' : 'Play'">
            <span class="icon">{{ playIcon }}</span>
          </button>
          <button class="win-media-icon-button" @click="showCastPanel" aria-label="Cast">
            <span class="icon">&#xEC16;</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import WinButton from './WinButton.vue';
import WinFlyout from './WinFlyout.vue';
import WinSlider from './WinSlider.vue';

const props = defineProps({
  src: { type: String, required: true },
  poster: String,
  autoPlay: Boolean,
  loop: Boolean,
  muted: Boolean,
  areTransportControlsEnabled: { type: Boolean, default: true },
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
let hideTimer = null;

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
const progressValue = computed({
  get: () => currentTime.value,
  set: value => {
    const video = videoRef.value;
    if (!video) return;
    video.currentTime = Number(value);
    syncFromVideo();
  }
});

const showCastPanel = () => {
  const video = videoRef.value;
  if (!video || !video.remote) {
    alert('此浏览器不支持投放功能');
    return;
  }

  if (typeof video.remote.prompt !== 'function') {
    alert('投放功能不可用');
    return;
  }

  // 直接同步调用 prompt()
  video.remote.prompt().then(() => {
    console.log('投放面板已打开或正在连接');
  }).catch((err) => {
    if (err.name === 'NotFoundError') {
      alert('未找到投放设备\n\n请确保投放设备（如 Chromecast、智能电视）已开机并连接到同一网络。');
    } else if (err.name === 'NotAllowedError') {
      // 本地开发环境可能因为证书问题而被阻止，部署到 HTTPS 环境后应该正常
      console.log('投放权限被拒绝（本地开发环境下可能正常，请在 HTTPS 生产环境下测试）');
    } else if (err.name === 'AbortError') {
      console.log('用户取消了投放');
    }
  });
};

watch(() => props.muted, value => {
  mutedState.value = value;
  if (videoRef.value) videoRef.value.muted = value;
});

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.muted = props.muted;
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
    border-radius: 8px;
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
    left: 12px;
    right: 12px;
    bottom: 10px;
    min-height: 112px;
    padding: 10px 12px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.10);
    background: color-mix(in srgb, #202020 88%, transparent);
    backdrop-filter: blur(18px) saturate(1.25);
    -webkit-backdrop-filter: blur(18px) saturate(1.25);
    color: white;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.26);
    opacity: 0;
    transform: translateY(18px);
    pointer-events: none;
    transition: opacity 260ms cubic-bezier(0.1, 0.9, 0.2, 1), transform 260ms cubic-bezier(0.1, 0.9, 0.2, 1);
    z-index: 5;
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
    height: 24px;
  }

  .time-row {
    justify-content: space-between;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.82);
  }

  .command-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
  }

  .command-row > :last-child {
    justify-self: end;
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

  .win-media-volume-panel {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 260px;
  }

  .win-media-volume-subtle {
    width: 32px;
    padding: 0;
  }

  .play-button {
    justify-self: center;
  }
</style>
