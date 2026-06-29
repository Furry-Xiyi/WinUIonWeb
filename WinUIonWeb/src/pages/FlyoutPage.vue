<template>
  <div>
    <h1 class="page-header">Flyout</h1>
    <p class="page-description">
      A Flyout displays lightweight UI that is either information, or requires user interaction. Unlike a dialog, a Flyout can be light dismissed by clicking or tapping outside of it, pressing the device's back button, or pressing the 'Esc' key.
    </p>

    <WinControlExample headerText="A button with a flyout">
      <template #example>
        <WinFlyout ref="flyoutRef">
          <template #trigger>
            <WinButton @click="flyoutRef?.toggle()">Empty cart</WinButton>
          </template>
          <template #default>
            <div class="flyout-content">
              <p class="flyout-text">All items will be removed. Do you want to continue?</p>
              <WinButton @click="handleConfirm">Yes, empty my cart</WinButton>
            </div>
          </template>
        </WinFlyout>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinFlyout from '../components/WinFlyout.vue';

const flyoutRef = ref(null);

const handleConfirm = () => {
  flyoutRef.value?.hide();
  // Handle cart empty action here
};
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

.flyout-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 200px;
}

.flyout-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}
</style>
