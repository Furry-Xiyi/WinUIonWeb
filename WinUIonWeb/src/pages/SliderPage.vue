<template>
  <h1 class="page-header">Slider</h1>
  <WinSettingsCard>
    <template #header>
      Slider
    </template>
    <template #description>
      A control for selecting a value from a range.
    </template>
    <WinSlider v-model="val" />
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinSlider from '../components/WinSlider.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
const val = ref(50);
</script>
