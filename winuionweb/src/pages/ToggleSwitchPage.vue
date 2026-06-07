<template>
  <h1 class="page-header">ToggleSwitch</h1>
  <WinSettingsCard>
    <template #header>
      ToggleSwitch
    </template>
    <template #description>
      A switch for toggling between two states.
    </template>
    <WinToggleSwitch v-model="val" />
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinToggleSwitch from '../components/WinToggleSwitch.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
const val = ref(false);
</script>
