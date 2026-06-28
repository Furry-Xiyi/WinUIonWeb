<template>
  <h1 class="page-header">Flyout</h1>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>A button with a flyout</template>
    <template #description>Click the button to show a confirmation flyout.</template>
    <WinFlyout ref="flyoutRef">
      <template #trigger>
        <WinButton @click="flyoutRef.toggle()">Empty cart</WinButton>
      </template>
      <div class="flyout-content">
        <p class="flyout-text">All items will be removed. Do you want to continue?</p>
        <WinButton @click="flyoutRef.hide()">Yes, empty my cart</WinButton>
      </div>
    </WinFlyout>
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinButton from '../components/WinButton.vue';
import WinFlyout from '../components/WinFlyout.vue';

const flyoutRef = ref(null);
</script>

<style scoped>
.flyout-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.flyout-text {
  margin: 0;
  font-size: 14px;
  color: var(--text-primary);
}
</style>
