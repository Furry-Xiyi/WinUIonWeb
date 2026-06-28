<template>
  <h1 class="page-header">ToggleSplitButton</h1>
  <WinSettingsCard>
    <template #header>
      ToggleSplitButton
    </template>
    <template #description>
      Click the left part to toggle on/off (accent color). Use the chevron for more options.
    </template>
    <div style="display: flex; gap: 12px; align-items: center;">
      <WinToggleSplitButton v-model="toggled" :options="['Option A', 'Option B', 'Option C']">
        Toggle
      </WinToggleSplitButton>
      <span style="font-size: 13px; color: var(--text-secondary);">{{ toggled ? 'On' : 'Off' }}</span>
    </div>
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinToggleSplitButton from '../components/WinToggleSplitButton.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

const toggled = ref(false);
</script>
