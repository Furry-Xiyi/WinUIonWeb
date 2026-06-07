<template>
  <h1 class="page-header">SplitButton</h1>
  <WinSettingsCard>
    <template #header>
      SplitButton
    </template>
    <template #description>
      A two-part button with primary action and flyout.
    </template>
    <WinSplitButton :options="['Action 1', 'Action 2']" @click="() => {}">Split</WinSplitButton>
  </WinSettingsCard>
</template>

<script setup>
import WinSplitButton from '../components/WinSplitButton.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
</script>
