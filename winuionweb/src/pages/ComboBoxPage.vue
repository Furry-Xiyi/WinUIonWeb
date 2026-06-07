<template>
  <h1 class="page-header">ComboBox</h1>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      ComboBox
    </template>
    <template #description>
      A drop-down list of items.
    </template>
    <WinComboBox :options="[{label:'Arial'}, {label:'Comic Sans MS'}, {label:'Segoe UI'}]" v-model="val" />
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinComboBox from '../components/WinComboBox.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
const val = ref(0);
</script>
