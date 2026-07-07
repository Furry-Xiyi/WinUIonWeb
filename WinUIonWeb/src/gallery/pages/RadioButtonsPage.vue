<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">{{ $t('text.radiobuttons') }}</h1>
      <p class="page-description">
        {{ $t('text.radiobuttons-are-used-to-select-a-single-option') }}
      </p>
      <div class="page-header-actions">
        <WinButton
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon"></span>
        </WinButton>
        <WinToggleButton
          v-model:IsChecked="isFavoriteState"
          @update:IsChecked="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example 1: A group of RadioButtons -->
    <p class="control-example-description">{{ $t('text.a-group-of-radiobuttons') }}</p>
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme">
      <template #example>
        <div class="radio-group">
          <div class="radio-header">{{ $t('text.options') }}</div>
          <WinRadioButton value="1" v-model="selectedOption" @update:modelValue="onOptionChanged">
            {{ $t('text.option-1') }}
          </WinRadioButton>
          <WinRadioButton value="2" v-model="selectedOption" @update:modelValue="onOptionChanged">
            {{ $t('text.option-2') }}
          </WinRadioButton>
          <WinRadioButton value="3" v-model="selectedOption" @update:modelValue="onOptionChanged">
            {{ $t('text.option-3') }}
          </WinRadioButton>
        </div>
      </template>
      <template #options>
        <p class="output-text">{{ outputText }}</p>
      </template>
    </WinControlExample>

    <!-- Example 2: RadioButtons with visual output -->
    <p class="control-example-description">RadioButtons with visual output</p>
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Background color selection -->
          <div class="radio-group">
            <div class="radio-header">Background</div>
            <div class="radio-row">
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
          <div class="radio-group">
            <div class="radio-header">Border</div>
            <div class="radio-row">
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
import { ref, inject, computed } from 'vue';
import WinRadioButton from '../../components/WinRadioButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'radiobuttons');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

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

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
  align-items: center;
}

.icon {
  font-size: 16px;
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
}

/* RadioButtons容器 - 垂直布局，对齐官方间距 */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-header {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  color: var(--text-primary);
}

/* RadioButtons水平布局 - MaxColumns模式 */
.radio-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
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




