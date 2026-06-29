<template>
  <h1 class="page-header">ToggleButton</h1>
  <p class="page-description">A button that can be toggled on or off.</p>

  <WinControlExample headerText="A simple ToggleButton">
    <template #example>
      <WinToggleButton v-model="val">Toggle Me</WinToggleButton>
    </template>
  </WinControlExample>
</template>

<script setup>
import { ref } from 'vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import WinControlExample from '../components/WinControlExample.vue';

const val = ref(false);
</script>
