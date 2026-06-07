<template>
  <h1 class="page-header">CheckBox</h1>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      CheckBox
    </template>
    <template #description>
      A control for boolean input.
    </template>
    <WinCheckBox v-model="val">I agree</WinCheckBox>
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinCheckBox from '../components/WinCheckBox.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
const val = ref(true);
</script>
