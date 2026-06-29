<template>
  <h1 class="page-header">AnimatedVisualPlayer</h1>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>Playback Lottie animation</template>
    <template #description>Consumes an animation source and exposes playback commands.</template>
    <div class="media-center">
      <p class="media-copy">
        This AnimatedVisualPlayer consumes an animation created using Adobe AfterEffects and translated into composition objects using Lottie-Windows.
      </p>
      <div class="avp-frame">
        <WinAnimatedVisualPlayer :key="playerKey" :playing="playing" :reversed="reversed" :duration="duration" />
      </div>
      <div class="avp-buttons">
        <WinButton @click="play" title="Play"><span class="icon">&#xE768;</span></WinButton>
        <WinToggleButton v-model="paused" title="Pause"><span class="icon">&#xE769;</span></WinToggleButton>
        <WinButton @click="stop" title="Stop"><span class="icon">&#xE71A;</span></WinButton>
        <WinButton @click="reverse" title="Reverse"><span class="icon">&#xE892;</span></WinButton>
      </div>
    </div>
  </WinSettingsCard>
</template>

<script setup>
import { ref, watch } from 'vue';
import WinAnimatedVisualPlayer from '../components/WinAnimatedVisualPlayer.vue';
import WinButton from '../components/WinButton.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinToggleButton from '../components/WinToggleButton.vue';

const playing = ref(false);
const paused = ref(false);
const reversed = ref(false);
const duration = ref(1800);
const playerKey = ref(0);
let stopping = false;

const play = () => { reversed.value = false; paused.value = false; playing.value = true; };
const stop = () => {
  stopping = true;
  playing.value = false;
  paused.value = false;
  reversed.value = false;
  playerKey.value += 1;
  requestAnimationFrame(() => { stopping = false; });
};
const reverse = () => { reversed.value = true; paused.value = false; playing.value = true; };

watch(paused, value => {
  if (stopping) return;
  if (value) {
    playing.value = false;
  } else if (!playing.value) {
    playing.value = true;
  }
});
</script>

<style>
  .media-center {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .media-copy {
    max-width: 720px;
    margin: 0 0 16px;
    color: var(--text-primary);
    font-size: 14px;
    line-height: 1.45;
  }

  .avp-frame {
    width: 400px;
    height: 400px;
    max-width: 100%;
    margin: 0 0 20px;
    background: var(--card-bg-secondary);
    border: 1px solid var(--card-stroke);
  }

  .avp-buttons {
    width: 400px;
    max-width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
</style>
