<template>
  <div class="win-capture-grid">
    <div class="win-capture-title">{{ deviceName }}</div>
    <div class="win-capture-title captured" :class="{ visible: snapshots.length }">Captured:</div>
    <div class="win-capture-preview" ref="previewRef" :class="{ mirrored }">
      <video ref="videoRef" class="win-capture-video" autoplay muted playsinline></video>
      <div v-if="!streamActive" class="win-capture-camera">
        <div class="win-capture-lens"></div>
        <div class="win-capture-scan"></div>
        <span class="win-capture-message">{{ errorMessage || 'Requesting camera permission...' }}</span>
      </div>
    </div>
    <div class="win-capture-shots" ref="shotsRef">
      <div v-for="shot in snapshots" :key="shot.id" class="win-capture-shot" :style="{ backgroundImage: shot.image ? `url(${shot.image})` : shot.background }">
        <span>{{ shot.time }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, nextTick } from 'vue';

const props = defineProps({
  mirrored: Boolean,
  deviceName: { type: String, default: 'Integrated camera' }
});

const emit = defineEmits(['ready']);

const snapshots = ref([]);
const videoRef = ref(null);
const streamActive = ref(false);
const errorMessage = ref('');
const previewRef = ref(null);
const shotsRef = ref(null);
let mediaStream = null;

const syncHeights = () => {
  if (previewRef.value && shotsRef.value) {
    const previewHeight = previewRef.value.offsetHeight;
    shotsRef.value.style.height = `${previewHeight}px`;
  }
};

const start = async () => {
  errorMessage.value = '';
  emit('ready', false);

  if (!navigator.mediaDevices?.getUserMedia) {
    errorMessage.value = 'Camera API is not available in this browser.';
    emit('ready', false);
    return;
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream;

      // 等待视频元数据加载完成
      await new Promise((resolve, reject) => {
        videoRef.value.onloadedmetadata = resolve;
        videoRef.value.onerror = reject;
      });

      await videoRef.value.play();

      // 视频加载后同步高度
      await nextTick();
      syncHeights();
    }
    streamActive.value = true;
    emit('ready', true);
  } catch (error) {
    errorMessage.value = error?.name === 'NotAllowedError'
      ? 'Camera permission was denied.'
      : 'Unable to start the camera.';
    streamActive.value = false;
    emit('ready', false);
  }
};

const stop = () => {
  mediaStream?.getTracks().forEach(track => track.stop());
  mediaStream = null;
  streamActive.value = false;
  emit('ready', false);
  if (videoRef.value) videoRef.value.srcObject = null;
};

const capture = () => {
  let image = '';
  const video = videoRef.value;
  if (streamActive.value && video?.videoWidth) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (props.mirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      image = canvas.toDataURL('image/jpeg', 0.82);
    }
  }

  const colors = [
    'linear-gradient(135deg, #315fba, #0f9f89)',
    'linear-gradient(135deg, #5b3cc4, #d24678)',
    'linear-gradient(135deg, #1f7a5f, #dab245)',
    'linear-gradient(135deg, #2d5d86, #9c5e31)'
  ];
  snapshots.value.unshift({
    id: Date.now(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    image,
    background: colors[snapshots.value.length % colors.length]
  });
  // 不限制截图数量
};

onMounted(() => {
  // 初始同步一次
  nextTick(syncHeights);
  // 监听窗口大小变化
  window.addEventListener('resize', syncHeights);
});

onBeforeUnmount(() => {
  stop();
  window.removeEventListener('resize', syncHeights);
});

defineExpose({ start, stop, capture });
</script>

<style>
  .win-capture-grid {
    display: grid;
    grid-template-columns: 1fr 100px;
    grid-template-rows: auto auto;
    gap: 10px 4px;
  }

  .win-capture-title {
    min-height: 20px;
    display: flex;
    align-items: center;
    color: var(--text-secondary);
    font-size: 13px;
  }

  .win-capture-title.captured {
    visibility: hidden;
  }

  .win-capture-title.captured.visible {
    visibility: visible;
  }

  .win-capture-preview {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #111;
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid var(--card-stroke);
  }

  .win-capture-preview.mirrored .win-capture-camera {
    transform: scaleX(-1);
  }

  .win-capture-preview.mirrored .win-capture-video {
    transform: scaleX(-1);
  }

  .win-capture-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    background: #111;
  }

  .win-capture-camera {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 50% 48%, rgba(255,255,255,0.18), transparent 18%),
      linear-gradient(135deg, #18365c, #0f776e 48%, #1c1c1c);
  }

  .win-capture-lens {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 112px;
    height: 112px;
    border-radius: 50%;
    border: 8px solid rgba(255,255,255,0.18);
    transform: translate(-50%, -50%);
  }

  .win-capture-scan {
    position: absolute;
    left: 0;
    right: 0;
    top: 30%;
    height: 2px;
    background: rgba(255, 255, 255, 0.32);
    animation: win-capture-scan 2.4s ease-in-out infinite;
  }

  .win-capture-message {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 16px;
    color: rgba(255,255,255,0.86);
    font-size: 13px;
    text-align: center;
  }

  .win-capture-shots {
    width: 100px;
    max-height: 450px;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 2px;
    scrollbar-width: thin;
    scrollbar-color: var(--ctrl-stroke) transparent;
  }

  /* 注释掉 webkit-scrollbar 自定义样式，让 Edge FluentScrollBarStyle 完全接管 */
  /*
  .win-capture-shots::-webkit-scrollbar {
  }

  .win-capture-shots::-webkit-scrollbar-track {
    background: transparent;
  }

  .win-capture-shots::-webkit-scrollbar-thumb {
    background: var(--ctrl-stroke);
    border-radius: 4px;
  }

  .win-capture-shots::-webkit-scrollbar-thumb:hover {
    background: var(--ctrl-strong-stroke);
  }
  */

  .win-capture-shot {
    aspect-ratio: 16 / 9;
    width: 100%;
    flex-shrink: 0;
    border-radius: 3px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 4px;
    color: white;
    font-size: 11px;
    background-size: cover;
    background-position: center;
  }

  @keyframes win-capture-scan {
    0%, 100% { transform: translateY(-55px); opacity: 0.25; }
    50% { transform: translateY(92px); opacity: 0.65; }
  }
</style>
