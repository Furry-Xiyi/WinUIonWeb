<template>
  <div class="win-capture-element">
    <div class="win-capture-frame-source" :class="{ empty: !frameSourceName }">{{ frameSourceName }}</div>
    <div class="win-capture-captured-label" :class="{ visible: snapshots.length > 0 }">Captured:</div>

    <div class="win-capture-preview" :class="{ mirrored: mirrorPreview }">
      <video ref="videoRef" autoplay muted playsinline></video>
    </div>

    <div class="win-capture-container">
      <WinScrollViewer
        class="win-capture-snapshots-scroll"
        VerticalScrollMode="Auto"
        VerticalScrollBarVisibility="Auto"
        HorizontalScrollMode="Disabled"
        HorizontalScrollBarVisibility="Disabled">
        <div class="win-capture-snapshots">
          <img v-for="snapshot in snapshots" :key="snapshot.id" :src="snapshot.source" alt="Captured photo" />
        </div>
      </WinScrollViewer>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref } from 'vue';
import WinScrollViewer from './WinScrollViewer.vue';

const emit = defineEmits(['Ready', 'PhotoCaptured']);
const videoRef = ref(null);
const frameSourceName = ref('');
const snapshots = ref([]);
const mirrorPreview = ref(false);
let mediaStream = null;

const StartCaptureElement = async () => {
  emit('Ready', false);
  if (!navigator.mediaDevices?.getUserMedia) {
    frameSourceName.value = 'No camera devices found.';
    return false;
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    if (!videoRef.value) return false;
    videoRef.value.srcObject = mediaStream;
    await new Promise((resolve, reject) => {
      videoRef.value.onloadedmetadata = resolve;
      videoRef.value.onerror = reject;
    });
    await videoRef.value.play();
    const track = mediaStream.getVideoTracks()[0];
    frameSourceName.value = `Viewing: ${track?.label || 'Integrated camera'}`;
    await nextTick();
    emit('Ready', true);
    return true;
  } catch (error) {
    frameSourceName.value = 'No camera devices found.';
    frameSourceName.value = error?.name === 'NotAllowedError'
      ? 'Camera access denied.'
      : 'Unable to start the camera.';
    emit('Ready', false);
    return false;
  }
};

const StopCaptureElement = () => {
  mediaStream?.getTracks().forEach((track) => track.stop());
  mediaStream = null;
  if (videoRef.value) videoRef.value.srcObject = null;
  emit('Ready', false);
};

const CapturePhoto = () => {
  const video = videoRef.value;
  if (!video || !mediaStream || !video.videoWidth) return null;
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  if (!context) return null;
  // The WinUI sample mirrors only the live preview; captured photos keep the camera orientation.
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const source = canvas.toDataURL('image/jpeg', .92);
  const photo = { id: `${Date.now()}-${snapshots.value.length}`, source };
  snapshots.value.unshift(photo);
  emit('PhotoCaptured', photo);
  return photo;
};

const SetMirrorPreview = (value) => {
  mirrorPreview.value = Boolean(value);
};

onBeforeUnmount(StopCaptureElement);

defineExpose({
  StartCaptureElement,
  StopCaptureElement,
  CapturePhoto,
  SetMirrorPreview,
  snapshots,
  mirrorPreview
});
</script>

<style>
.win-capture-element {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 100px;
  grid-template-rows: auto minmax(0, 1fr);
  width: 100%;
  height: 300px;
  min-width: 400px;
  min-height: 300px;
  max-height: 300px;
  gap: 10px 4px;
  color: var(--text-primary);
  box-sizing: border-box;
}

.win-capture-frame-source,
.win-capture-captured-label {
  min-height: 20px;
  align-self: center;
  font-size: 14px;
  line-height: 20px;
}

.win-capture-frame-source.empty { color: var(--text-secondary); }
.win-capture-captured-label { visibility: hidden; }
.win-capture-captured-label.visible { visibility: visible; }

.win-capture-preview {
  position: relative;
  min-width: 0;
  min-height: 240px;
  overflow: hidden;
  background: #000;
}

.win-capture-preview.mirrored video { transform: scaleX(-1); }
.win-capture-preview video { display: block; width: 100%; height: 100%; min-height: 240px; object-fit: contain; background: #000; }
.win-capture-container { min-width: 0; min-height: 0; height: 100%; overflow: hidden; }
.win-capture-snapshots-scroll { width: 100%; height: 100%; min-height: 0; }
.win-capture-snapshots-scroll .win-scroll-viewer-viewport { height: 100%; }
.win-capture-snapshots { min-height: 100%; display: flex; flex-direction: column; gap: 2px; }
.win-capture-snapshots img { display: block; width: 100%; height: auto; object-fit: contain; }

@media (max-width: 520px) {
  .win-capture-element { min-width: 0; grid-template-columns: minmax(0, 1fr) 84px; }
}
</style>
