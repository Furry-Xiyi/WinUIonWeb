<template>
  <div>
    <h1 class="page-header">SplitButton</h1>
    <p class="page-description">
      The SplitButton is a dropdown button, but with an addition execution hit target. It's used for scenarios where you want a user to be able to invoke a command or make a choice.
    </p>

    <WinControlExample headerText="A SplitButton for color picking.">
      <template #example>
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
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinSplitButton from '../components/WinSplitButton.vue';
import WinControlExample from '../components/WinControlExample.vue';

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

.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 4px 0 0 4px;
}
</style>
