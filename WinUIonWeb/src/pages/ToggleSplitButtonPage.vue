<template>
  <h1 class="page-header">ToggleSplitButton</h1>
  <p class="page-description">
    A button that can be toggled on/off with additional dropdown options.
  </p>

  <WinControlExample headerText="A simple ToggleSplitButton">
    <template #example>
      <WinToggleSplitButton v-model="toggled" :options="['Option A', 'Option B', 'Option C']">
        Toggle
      </WinToggleSplitButton>
    </template>
    <template #output>
      <div>State: {{ toggled ? 'On' : 'Off' }}</div>
    </template>
  </WinControlExample>
</template>

<script setup>
import { ref } from 'vue';
import WinToggleSplitButton from '../components/WinToggleSplitButton.vue';
import WinControlExample from '../components/WinControlExample.vue';

const toggled = ref(false);
</script>
