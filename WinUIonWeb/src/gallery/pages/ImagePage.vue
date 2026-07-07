<template>
  <h1 class="page-header">{{ $t('text.image') }}</h1>
  <WinSettingsCard
    Header="Image from a local file"
    Description="A basic Image element with a fixed height.">
    <WinImage :src="media('treetops.jpg')" height="100px" alt="Treetops" />
  </WinSettingsCard>

  <WinSettingsCard
    Header="Decoded rendering size"
    Description="Render an image at a decoded target height.">
    <WinImage :src="media('treetops.jpg')" height="100px" alt="Decoded treetops" />
  </WinSettingsCard>

  <WinSettingsCard
    ContentAlignment="Vertical"
    Header="Image stretch mode"
    Description="Change how the source is fitted into a 100 x 100 layout slot.">
    <div class="image-demo-row">
      <WinImage :src="media('valley.jpg')" width="100px" height="100px" :stretch="stretchMode" alt="Valley" />
      <div class="image-options">
        <span class="image-options-title">Image stretch mode</span>
        <WinRadioButton v-model="stretchMode" value="None">None</WinRadioButton>
        <WinRadioButton v-model="stretchMode" value="Fill">Fill</WinRadioButton>
        <WinRadioButton v-model="stretchMode" value="Uniform">Uniform</WinRadioButton>
        <WinRadioButton v-model="stretchMode" value="UniformToFill">UniformToFill</WinRadioButton>
      </div>
    </div>
  </WinSettingsCard>

  <WinSettingsCard
    ContentAlignment="Vertical"
    Header="Nine-grid images"
    Description="Compare normal stretching with nine-grid style slicing.">
    <div class="nine-grid-demo">
      <span>The normal image</span>
      <WinImage :src="media('ninegrid.gif')" height="82px" alt="Nine grid normal" />
      <span>Image stretched evenly</span>
      <WinImage class="nine-grid-even" :src="media('ninegrid.gif')" height="164px" alt="Nine grid stretched" />
      <span>Image stretched using nine grid</span>
      <div class="nine-grid-css"></div>
    </div>
  </WinSettingsCard>

  <WinSettingsCard
    Header="SVG image"
    Description="Image can render SVG sources.">
    <WinImage :src="media('MirrorPCConsent.svg')" height="100px" alt="SVG" />
  </WinSettingsCard>

  <WinSettingsCard
    ContentAlignment="Vertical"
    Header="Animated GIF"
    Description="Animated image playback can be automatic or controlled.">
    <div class="gif-demo">
      <span>An Image element automatically plays an animated GIF source.</span>
      <WinImage :src="media('animated.gif')" height="40px" alt="Animated" />
      <span>Set AutoPlay to False to prevent the GIF from playing automatically.</span>
      <div class="gif-paused">GIF</div>
      <span>Control playback manually using Play and Stop.</span>
      <WinImage v-if="gifPlaying" :src="media('animated.gif')" height="40px" alt="Controlled animated" />
      <div v-else class="gif-paused">GIF</div>
      <div class="gif-buttons">
        <WinButton @click="gifPlaying = true">Play</WinButton>
        <WinButton @click="gifPlaying = false">Stop</WinButton>
      </div>
    </div>
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinImage from '../../components/WinImage.vue';
import WinRadioButton from '../../components/WinRadioButton.vue';
import WinSettingsCard from '../../components/WinSettingsCard.vue';

const base = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/';
const media = name => base + name;
const stretchMode = ref('None');
const gifPlaying = ref(false);
</script>

<style>
  .image-demo-row {
    display: flex;
    align-items: flex-start;
    gap: 24px;
  }

  .image-options,
  .gif-demo,
  .nine-grid-demo {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: var(--text-primary);
    font-size: 14px;
  }

  .image-options-title {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .nine-grid-even {
    width: 260px;
  }

  .nine-grid-css {
    width: 260px;
    height: 164px;
    border-image-source: url('https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/ninegrid.gif');
    border-image-slice: 30 20 30 20 fill;
    border-image-width: 30px 20px 30px 20px;
    border-image-repeat: stretch;
  }

  .gif-paused {
    width: 88px;
    height: 40px;
    display: grid;
    place-items: center;
    border-radius: 3px;
    color: white;
    background: linear-gradient(135deg, #2d69b3, #7b3fb5);
    font-weight: 600;
  }

  .gif-buttons {
    display: flex;
    gap: 8px;
  }
</style>
