<template>
  <div>
    <h1 class="page-header">ToggleSwitch</h1>
    <p class="page-description">
      Use ToggleSwitch controls to present users with exactly two mutually exclusive options (like on/off), where choosing an option results in an immediate commit. A toggle switch should have a single label.
    </p>

    <!-- Example 1: Simple ToggleSwitch -->
    <WinControlExample headerText="A simple ToggleSwitch.">
      <template #example>
        <WinToggleSwitch v-model="simpleToggle" />
      </template>
    </WinControlExample>

    <!-- Example 2: ToggleSwitch with Custom Content -->
    <WinControlExample headerText="A ToggleSwitch with custom labels.">
      <template #example>
        <div style="display: flex; align-items: center; gap: 16px;">
          <WinToggleSwitch
            v-model="workToggle"
            header="Toggle work"
            onContent="Working"
            offContent="Do work" />
          <WinProgressRing
            v-if="workToggle"
            style="width: 32px; height: 32px; color: var(--accent-default);" />
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinToggleSwitch from '../components/WinToggleSwitch.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinProgressRing from '../components/WinProgressRing.vue';

// Example 1: Simple ToggleSwitch
const simpleToggle = ref(false);

// Example 2: ToggleSwitch with custom content
const workToggle = ref(true);
</script>

<style scoped>
.page-header {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.5;
}
</style>
