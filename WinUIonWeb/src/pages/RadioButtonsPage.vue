<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">RadioButtons</h1>
      <p class="page-description">
        RadioButtons are used to select a single option from a group of related options. The RadioButtons control provides a modern layout and interaction model, while individual RadioButton elements can be used for more custom layouts.
      </p>
      <div class="page-header-actions">
        <WinButton
          subtle
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model="isFavoriteState"
          subtle
          @update:modelValue="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example 1: A group of RadioButtons -->
    <WinControlExample headerText="A group of RadioButtons" :theme="pageTheme">
      <template #example>
        <div class="radio-group">
          <div class="radio-header">Options:</div>
          <WinRadioButton value="1" v-model="selectedOption" @update:modelValue="onOptionChanged">
            Option 1
          </WinRadioButton>
          <WinRadioButton value="2" v-model="selectedOption" @update:modelValue="onOptionChanged">
            Option 2
          </WinRadioButton>
          <WinRadioButton value="3" v-model="selectedOption" @update:modelValue="onOptionChanged">
            Option 3
          </WinRadioButton>
        </div>
      </template>
      <template #output>
        <p class="output-text">{{ outputText }}</p>
      </template>
    </WinControlExample>

    <!-- Example 2: RadioButtons with visual output -->
    <WinControlExample headerText="RadioButtons with visual output" :theme="pageTheme">
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
import { ref, inject, computed, watch } from 'vue';
import WinRadioButton from '../components/WinRadioButton.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'radiobuttons');

const { isFavorite: checkFavorite, toggleFavorite: toggleFav } = useFavorites();
const isFavorite = computed(() => checkFavorite(pageKey.value));
const isFavoriteState = ref(isFavorite.value);

watch(isFavorite, (newVal) => {
  isFavoriteState.value = newVal;
});

const toggleFavorite = () => {
  toggleFav(pageKey.value);
};

const { pageTheme, toggleTheme: doToggleTheme } = usePageTheme('system');
const toggleTheme = () => doToggleTheme();

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
