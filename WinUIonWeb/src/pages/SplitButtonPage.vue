<template>
  <div class="control-page">
    <h1 class="page-header">SplitButton</h1>
    <p class="page-description">
      The SplitButton is a dropdown button, but with an addition execution hit target. It's used for scenarios where you want a user to be able to invoke a command or make a choice.
    </p>

    <WinSettingsCard
      header="A SplitButton for color picking."
      description="Click the left side to apply the current color, or click the dropdown to choose a new color.">
      <template #default>
        <WinSplitButton
          :options="colorOptions"
          @click="applyColor"
          @select="selectColor">
          <template #default>
            <div
              class="color-swatch"
              :style="{ backgroundColor: currentColor }">
            </div>
          </template>
        </WinSplitButton>
      </template>
    </WinSettingsCard>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinSplitButton from '../components/WinSplitButton.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

const currentColor = ref('Green');

const colorOptions = [
  'Red',
  'Orange',
  'Yellow',
  'Green',
  'Blue',
  'Indigo',
  'Violet',
  'Gray'
];

const applyColor = () => {
  console.log('Apply current color:', currentColor.value);
};

const selectColor = (color) => {
  currentColor.value = color;
};
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

.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 4px 0 0 4px;
}
</style>
