<template>
  <h1 class="page-header">Button</h1>
  <WinSettingsCard>
    <template #header>
      Standard Buttons
    </template>
    <template #description>
      A basic button control.
    </template>
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      <WinButton>Standard</WinButton>
      <WinButton primary>Primary</WinButton>
    </div>
  </WinSettingsCard>
</template>

<script setup>
import WinButton from '../components/WinButton.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
</script>
