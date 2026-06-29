<template>
  <div>
    <h1 class="page-header">RadioButtons</h1>
    <p class="page-description">
      RadioButtons are used to select a single option from a group of related options. The RadioButtons control provides a modern layout and interaction model, while individual RadioButton elements can be used for more custom layouts.
    </p>

    <!-- Example 1: A group of RadioButtons -->
    <WinControlExample headerText="A group of RadioButtons">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">Options:</div>
          <WinRadioButton value="1" v-model="selectedOption" @change="onOptionChanged">
            Option 1
          </WinRadioButton>
          <WinRadioButton value="2" v-model="selectedOption" @change="onOptionChanged">
            Option 2
          </WinRadioButton>
          <WinRadioButton value="3" v-model="selectedOption" @change="onOptionChanged">
            Option 3
          </WinRadioButton>
        </div>
      </template>
      <template #output>
        <p class="output-text">{{ outputText }}</p>
      </template>
    </WinControlExample>

    <!-- Example 2: RadioButtons with visual output -->
    <WinControlExample headerText="RadioButtons with visual output">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Background color selection -->
          <div>
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">Background</div>
            <div style="display: flex; gap: 16px;">
              <WinRadioButton value="green" v-model="backgroundColor">
                Green
              </WinRadioButton>
              <WinRadioButton value="yellow" v-model="backgroundColor">
                Yellow
              </WinRadioButton>
              <WinRadioButton value="white" v-model="backgroundColor">
                White
              </WinRadioButton>
            </div>
          </div>

          <!-- Border color selection -->
          <div>
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">Border</div>
            <div style="display: flex; gap: 16px;">
              <WinRadioButton value="green" v-model="borderColor">
                Green
              </WinRadioButton>
              <WinRadioButton value="yellow" v-model="borderColor">
                Yellow
              </WinRadioButton>
              <WinRadioButton value="white" v-model="borderColor">
                White
              </WinRadioButton>
            </div>
          </div>

          <!-- Visual output -->
          <div
            class="color-output"
            :style="{
              backgroundColor: getColorValue(backgroundColor),
              borderColor: getColorValue(borderColor)
            }">
          </div>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinRadioButton from '../components/WinRadioButton.vue';
import WinControlExample from '../components/WinControlExample.vue';

// Example 1: Basic RadioButtons
const selectedOption = ref('1');
const outputText = ref('You selected Option 1.');

const onOptionChanged = () => {
  outputText.value = `You selected Option ${selectedOption.value}.`;
};

// Example 2: RadioButtons with colors
const backgroundColor = ref('white');
const borderColor = ref('yellow');

const colorMap = {
  green: '#10893E',
  yellow: '#FFB900',
  white: '#FFFFFF'
};

const getColorValue = (colorName) => {
  return colorMap[colorName] || '#FFFFFF';
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

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}

.color-output {
  height: 50px;
  border: 10px solid;
  border-radius: 4px;
  margin-top: 8px;
}
</style>
