<template>
  <h1 class="page-header">Capture Element / Camera</h1>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>MediaCapture preview displayed via MediaPlayerElement</template>
    <template #description>Preview a camera stream, mirror the preview, and capture photos.</template>
    <template #headerAction>
      <WinToggleSwitch v-model="mirrored">Mirror preview</WinToggleSwitch>
      <WinButton @click="capture" :disabled="!cameraReady">Capture Photo</WinButton>
    </template>
    <WinCaptureElementPreview ref="previewRef" :mirrored="mirrored" @ready="onCameraReady" />
  </WinSettingsCard>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import WinButton from '../components/WinButton.vue';
import WinCaptureElementPreview from '../components/WinCaptureElementPreview.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinToggleSwitch from '../components/WinToggleSwitch.vue';

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
