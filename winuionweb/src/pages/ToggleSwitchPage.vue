<template>
  <h1 class="page-header">ToggleSwitch</h1>
  <WinSettingsCard>
    <template #header>
      ToggleSwitch
    </template>
    <template #description>
      A switch for toggling between two states.
    </template>
    <WinToggleSwitch v-model="val1" />
  </WinSettingsCard>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      ToggleSwitch with content
    </template>
    <template #description>
      Control a loading ring animation.
    </template>
    <WinToggleSwitch v-model="val2" onContent="Playing" offContent="Stopped" />
    <img v-if="val2" :src="gifSrc" class="loading-ring-gif" />
  </WinSettingsCard>
</template>

<script setup>
import { ref, computed } from 'vue';
import WinToggleSwitch from '../components/WinToggleSwitch.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

const val1 = ref(false);
const val2 = ref(false);

const gifSrc = computed(() => {
  const dark = document.documentElement.classList.contains('dark')
    || document.documentElement.classList.contains('theme-dark');
  return dark
    ? new URL('../styles/gif/LoadingRing_Dark.gif', import.meta.url).href
    : new URL('../styles/gif/LoadingRing_Light.gif', import.meta.url).href;
});
</script>

<style scoped>
  .loading-ring-gif {
    width: 48px;
    height: 48px;
    margin-top: 12px;
  }
</style>
