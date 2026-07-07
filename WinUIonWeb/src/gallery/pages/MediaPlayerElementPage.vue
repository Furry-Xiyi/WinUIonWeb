<template>
  <h1 class="page-header">{{ $t('text.mediaplayerelement') }}</h1>
  <WinSettingsCard
    ContentAlignment="Vertical"
    Header="Transport controls"
    Description="MediaPlayerElement with transport controls enabled.">
    <div class="media-actions">
      <WinToggleSwitch v-model="controlsEnabled">Transport controls</WinToggleSwitch>
      <WinButton @click="openFile">Open a file</WinButton>
      <input ref="fileInput" class="media-file-input" type="file" accept="video/*" @change="onFileSelected" />
    </div>
    <WinMediaPlayerElement
      :src="videoSource"
      :poster="poster"
      :areTransportControlsEnabled="controlsEnabled"
      :autoPlay="false"
      :muted="muted"
      :loop="loop"
      :maxWidth="400" />
  </WinSettingsCard>

  <WinSettingsCard
    ContentAlignment="Vertical"
    Header="AutoPlay video"
    Description="MediaPlayerElement can start playback automatically when loaded.">
    <div class="media-actions">
      <WinToggleSwitch v-model="muted">Muted</WinToggleSwitch>
      <WinToggleSwitch v-model="loop">Loop</WinToggleSwitch>
    </div>
    <WinMediaPlayerElement
      :src="videoSource"
      :poster="poster"
      :areTransportControlsEnabled="false"
      :autoPlay="true"
      :muted="true"
      :loop="loop"
      :maxWidth="400" />
  </WinSettingsCard>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinMediaPlayerElement from '../../components/WinMediaPlayerElement.vue';
import WinSettingsCard from '../../components/WinSettingsCard.vue';
import WinToggleSwitch from '../../components/WinToggleSwitch.vue';

const controlsEnabled = ref(true);
const muted = ref(false);
const loop = ref(false);
const fileInput = ref(null);
const videoSource = ref('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
const poster = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage5.jpg';
let objectUrl = '';

const openFile = () => {
  controlsEnabled.value = true;
  fileInput.value?.click();
};

const onFileSelected = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = URL.createObjectURL(file);
  videoSource.value = objectUrl;
};

onBeforeUnmount(() => {
  if (objectUrl) URL.revokeObjectURL(objectUrl);
});
</script>

<style>
  .media-file-input {
    display: none;
  }

  .media-actions {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }
</style>
