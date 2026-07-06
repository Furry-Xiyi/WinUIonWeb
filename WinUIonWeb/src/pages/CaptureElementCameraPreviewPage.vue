<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">Capture Element / Camera Preview</h1>
      <div class="page-header-actions">
        <WinButton @click="toggleTheme">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model:IsChecked="isFavoriteState"
          @update:IsChecked="toggleFavorite">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Page Description -->
    <div class="page-description">
      <p>A MediaCapture preview displayed via a MediaPlayerElement.</p>
    </div>

    <!-- Example: Camera Preview with Capture -->
    <WinControlExample headerText="Media capture preview displayed via a CaptureElement">
      <template #example>
        <WinCaptureElementPreview
          ref="captureRef"
          :mirrored="isMirrored"
          :deviceName="deviceName"
          @ready="onCameraReady"
        />
      </template>
      <template #options>
        <WinToggleSwitch
          v-model="isMirrored"
          header="Mirror preview"
          onContent="On"
          offContent="Off"
        />
        <WinButton
          :isEnabled="cameraReady"
          @click="capturePhoto"
          style="margin-top: 12px;"
        >
          Capture Photo
        </WinButton>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import WinToggleSwitch from '../components/WinToggleSwitch.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinCaptureElementPreview from '../components/WinCaptureElementPreview.vue';
import { createPageState } from '../utils/pageState';

// Theme and Favorite
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'captureelementcamerapreview');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

// Camera Preview
const captureRef = ref(null);
const isMirrored = ref(false);
const cameraReady = ref(false);
const deviceName = ref('Requesting camera access...');

const onCameraReady = (ready) => {
  cameraReady.value = ready;
  if (ready) {
    deviceName.value = 'Viewing: Integrated camera';
  } else {
    deviceName.value = 'Camera not available';
  }
};

const capturePhoto = () => {
  if (captureRef.value && cameraReady.value) {
    captureRef.value.capture();
  }
};

onMounted(() => {
  // Start camera when component is mounted
  if (captureRef.value) {
    captureRef.value.start();
  }
});
</script>

<style scoped>
.page-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 8px;
}

.page-description {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--stroke-card);
}

.page-description p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
}
</style>
