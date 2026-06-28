<template>
  <h1 class="page-header">ListBox</h1>
  <WinSettingsCard>
    <template #header>
      Basic ListBox
    </template>
    <template #description>
      Select a single item from a flat list.
    </template>
    <WinListBox :items="['Blue', 'Green', 'Red', 'Yellow']" v-model:selectedIndex="idx" style="width: 200px;" />
  </WinSettingsCard>
  <WinSettingsCard>
    <template #header>
      Output
    </template>
    <template #description>
      Currently selected color.
    </template>
    <span>{{ ['Blue', 'Green', 'Red', 'Yellow'][idx] || 'None' }}</span>
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinListBox from '../components/WinListBox.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
const idx = ref(0);
</script>
