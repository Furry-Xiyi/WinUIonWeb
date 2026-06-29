<template>
  <h1 class="page-header">ListBox</h1>
  <p class="page-description">A control that presents an inline list of items that the user can select from.</p>

  <WinControlExample headerText="A simple ListBox">
    <template #example>
      <WinListBox :items="['Blue', 'Green', 'Red', 'Yellow']" v-model:selectedIndex="idx" style="width: 200px;" />
    </template>
    <template #output>
      <span>Selected color: {{ ['Blue', 'Green', 'Red', 'Yellow'][idx] || 'None' }}</span>
    </template>
  </WinControlExample>
</template>

<script setup>
import { ref } from 'vue';
import WinListBox from '../components/WinListBox.vue';
import WinControlExample from '../components/WinControlExample.vue';

const idx = ref(0);
</script>
