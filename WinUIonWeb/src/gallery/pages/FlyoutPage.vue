<template>
  <div>
    <h1 class="page-header">{{ $t('text.flyout') }}</h1>
    <p class="page-description">
      {{ $t('text.a-flyout-displays-lightweight-ui-that-is-either') }}
    </p>

    <WinControlExample :headerText="$t('text.a-button-with-a-flyout')">
      <template #example>
        <WinFlyout ref="flyoutRef">
          <template #trigger>
            <WinButton @click="flyoutRef?.toggle()">{{ $t('text.empty-cart') }}</WinButton>
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
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinFlyout from '../../components/WinFlyout.vue';

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
