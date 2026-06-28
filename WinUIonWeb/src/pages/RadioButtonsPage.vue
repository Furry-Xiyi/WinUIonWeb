<template>
  <h1 class="page-header">RadioButtons</h1>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      RadioButtons
    </template>
    <template #description>
      A group of mutually exclusive options.
    </template>
    <div style="display: flex; gap: 24px;">
      <WinRadioButton value="A" v-model="val">Option A</WinRadioButton>
      <WinRadioButton value="B" v-model="val">Option B</WinRadioButton>
      <WinRadioButton value="C" v-model="val">Option C</WinRadioButton>
    </div>
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinRadioButton from '../components/WinRadioButton.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
const val = ref('A');
</script>
