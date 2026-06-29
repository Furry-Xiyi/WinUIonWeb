<template>
  <div class="control-page">
    <h1 class="page-header">ToggleSwitch</h1>
    <p class="page-description">
      Use ToggleSwitch controls to present users with exactly two mutually exclusive options (like on/off), where choosing an option results in an immediate commit. A toggle switch should have a single label.
    </p>

    <!-- Example 1: Simple ToggleSwitch -->
    <WinSettingsCard
      header="A simple ToggleSwitch."
      description="A ToggleSwitch with default on/off labels.">
      <template #default>
        <WinToggleSwitch v-model="simpleToggle" />
      </template>
    </WinSettingsCard>

    <!-- Example 2: ToggleSwitch with Custom Content -->
    <WinSettingsCard
      header="A ToggleSwitch with custom labels."
      description="Toggle the switch to control the ProgressRing.">
      <template #default>
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
    </WinSettingsCard>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinToggleSwitch from '../components/WinToggleSwitch.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinProgressRing from '../components/WinProgressRing.vue';

// Example 1: Simple ToggleSwitch
const simpleToggle = ref(false);

// Example 2: ToggleSwitch with custom content
const workToggle = ref(true);
</script>

<style scoped>
.control-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
  line-height: 1.5;
}
</style>
