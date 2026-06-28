<template>
  <h1 class="page-header">ToggleButton</h1>
  <WinSettingsCard>
    <template #header>
      ToggleButton
    </template>
    <template #description>
      A button that can be toggled on or off.
    </template>
    <WinToggleButton v-model="val">Toggle Me</WinToggleButton>
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
const val = ref(false);
</script>
