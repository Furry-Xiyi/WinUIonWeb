<template>
  <h1 class="page-header">{{ $t('text.capture-element-camera') }}</h1>
  <WinSettingsCard
    ContentAlignment="Vertical"
    Header="MediaCapture preview displayed via MediaPlayerElement"
    Description="Preview a camera stream, mirror the preview, and capture photos.">
    <div class="capture-actions">
      <WinToggleSwitch v-model="mirrored">Mirror preview</WinToggleSwitch>
      <WinButton @click="capture" :disabled="!cameraReady">Capture Photo</WinButton>
    </div>
    <WinCaptureElementPreview ref="previewRef" :mirrored="mirrored" @ready="onCameraReady" />
  </WinSettingsCard>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinCaptureElementPreview from '../../components/WinCaptureElementPreview.vue';
import WinSettingsCard from '../../components/WinSettingsCard.vue';
import WinToggleSwitch from '../../components/WinToggleSwitch.vue';

const mirrored = ref(false);
const previewRef = ref(null);
const cameraReady = ref(false);

const capture = () => previewRef.value?.capture();
const startCamera = () => previewRef.value?.start();

const onCameraReady = (ready) => {
  cameraReady.value = ready;
};

onMounted(() => {
  startCamera();
});
</script>

<style scoped>
.capture-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
