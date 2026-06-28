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
    <WinLoadingRing v-if="val2" class="loading-ring-gif" color="var(--accent-base)" />
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinToggleSwitch from '../components/WinToggleSwitch.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinLoadingRing from '../components/WinLoadingRing.vue';

const val1 = ref(false);
const val2 = ref(false);
</script>

<style scoped>
  .loading-ring-gif {
    margin-top: 12px;
  }
</style>
