<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">RadioButton</h1>
      <p class="page-description">
        RadioButton controls let the user select one option from a set of mutually exclusive options. In contrast, CheckBox controls allow the user to select multiple options. Use RadioButton controls when there are 2-7 options, and ensure that only one option can be selected at a time.
      </p>
      <div class="page-header-actions">
        <WinButton
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model:IsChecked="isFavoriteState"
          @update:IsChecked="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example 1: Basic RadioButton group -->
    <WinControlExample
      headerText="RadioButton group"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="font-size: 14px; font-weight: 600; margin-bottom: 4px; color: var(--text-primary);">Options:</label>
          <WinRadioButton
            name="options"
            value="option1"
            v-model="selectedOption"
            @checked="onOptionChecked">
            Option 1
          </WinRadioButton>
          <WinRadioButton
            name="options"
            value="option2"
            v-model="selectedOption"
            @checked="onOptionChecked">
            Option 2
          </WinRadioButton>
          <WinRadioButton
            name="options"
            value="option3"
            v-model="selectedOption"
            @checked="onOptionChecked">
            Option 3
          </WinRadioButton>
        </div>
      </template>
      <template #options>
        <p class="output-text">{{ option1Output }}</p>
      </template>
    </WinControlExample>

    <!-- Example 2: Styled RadioButton groups with visual output -->
    <WinControlExample
      headerText="RadioButton groups with visual feedback"
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <label style="font-size: 14px; font-weight: 600; margin-bottom: 4px; color: var(--text-primary);">Background</label>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-width: 400px;">
              <WinRadioButton
                name="background"
                value="green"
                v-model="selectedBackground"
                @checked="updateBorderDisplay">
                Green
              </WinRadioButton>
              <WinRadioButton
                name="background"
                value="yellow"
                v-model="selectedBackground"
                @checked="updateBorderDisplay">
                Yellow
              </WinRadioButton>
              <WinRadioButton
                name="background"
                value="white"
                v-model="selectedBackground"
                @checked="updateBorderDisplay">
                White
              </WinRadioButton>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <label style="font-size: 14px; font-weight: 600; margin-bottom: 4px; color: var(--text-primary);">Border</label>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-width: 400px;">
              <WinRadioButton
                name="border"
                value="green"
                v-model="selectedBorder"
                @checked="updateBorderDisplay">
                Green
              </WinRadioButton>
              <WinRadioButton
                name="border"
                value="yellow"
                v-model="selectedBorder"
                @checked="updateBorderDisplay">
                Yellow
              </WinRadioButton>
              <WinRadioButton
                name="border"
                value="white"
                v-model="selectedBorder"
                @checked="updateBorderDisplay">
                White
              </WinRadioButton>
            </div>
          </div>

          <div
            class="border-preview"
            :style="{
              backgroundColor: backgroundColorValue,
              borderColor: borderColorValue
            }">
          </div>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinRadioButton from '../components/WinRadioButton.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'radiobutton');

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

// Example 1: Basic RadioButton group
const selectedOption = ref('option1');
const option1Output = ref('Select an option.');

const onOptionChecked = () => {
  const optionMap = {
    'option1': 'You selected Option 1',
    'option2': 'You selected Option 2',
    'option3': 'You selected Option 3'
  };
  option1Output.value = optionMap[selectedOption.value] || 'Select an option.';
};

// 示例1代码
const example1Template = `<div style="display: flex; flex-direction: column; gap: 8px;">
  <label>Options:</label>
  <WinRadioButton
    name="options"
    value="option1"
    v-model="selectedOption"
    @checked="onOptionChecked">
    Option 1
  </WinRadioButton>
  <WinRadioButton
    name="options"
    value="option2"
    v-model="selectedOption"
    @checked="onOptionChecked">
    Option 2
  </WinRadioButton>
  <WinRadioButton
    name="options"
    value="option3"
    v-model="selectedOption"
    @checked="onOptionChecked">
    Option 3
  </WinRadioButton>
</div>`;

const example1Vue = `const selectedOption = ref('option1');

const onOptionChecked = () => {
  console.log('Selected:', selectedOption.value);
};`;

// Example 2: Styled groups with visual output
const selectedBackground = ref('green');
const selectedBorder = ref('yellow');

const colorMap = {
  'green': '#FF00FF00',
  'yellow': '#FFFFD700',
  'white': '#FFFFFFFF'
};

const backgroundColorValue = computed(() => colorMap[selectedBackground.value]);
const borderColorValue = computed(() => colorMap[selectedBorder.value]);

const updateBorderDisplay = () => {
  // Computed properties handle the update automatically
};

// 示例2代码
const example2Template = `<div style="display: flex; flex-direction: column; gap: 16px;">
  <div>
    <label>Background</label>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
      <WinRadioButton name="bg" value="green" v-model="selectedBackground">
        Green
      </WinRadioButton>
      <WinRadioButton name="bg" value="yellow" v-model="selectedBackground">
        Yellow
      </WinRadioButton>
      <WinRadioButton name="bg" value="white" v-model="selectedBackground">
        White
      </WinRadioButton>
    </div>
  </div>

  <div>
    <label>Border</label>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
      <WinRadioButton name="border" value="green" v-model="selectedBorder">
        Green
      </WinRadioButton>
      <WinRadioButton name="border" value="yellow" v-model="selectedBorder">
        Yellow
      </WinRadioButton>
      <WinRadioButton name="border" value="white" v-model="selectedBorder">
        White
      </WinRadioButton>
    </div>
  </div>

  <div
    style="height: 50px; border-width: 10px; border-style: solid;"
    :style="{
      backgroundColor: backgroundColorValue,
      borderColor: borderColorValue
    }">
  </div>
</div>`;

const example2Vue = `const selectedBackground = ref('green');
const selectedBorder = ref('yellow');

const colorMap = {
  'green': '#FF00FF00',
  'yellow': '#FFFFD700',
  'white': '#FFFFFFFF'
};

const backgroundColorValue = computed(() => colorMap[selectedBackground.value]);
const borderColorValue = computed(() => colorMap[selectedBorder.value]);`;
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

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}

.border-preview {
  height: 50px;
  margin: 10px 0;
  border-width: 10px;
  border-style: solid;
  border-radius: 4px;
}
</style>
