<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">Slider</h1>
      <p class="page-description">
        Use a Slider to let users set a value by moving a thumb along a track. A Slider is a good choice when you know that users think of the value as a relative quantity, not a numeric value.
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

    <!-- Example 1: Simple Slider -->
    <WinControlExample header-text="A simple Slider." :theme="pageTheme">
      <template #example>
        <WinSlider
          v-model="sliderValue1"
          style="width: 200px;" />
      </template>
      <template #output>
        <p class="output-text">{{ sliderValue1 }}</p>
      </template>
    </WinControlExample>

    <!-- Example 2: Slider with Range and Steps -->
    <WinControlExample header-text="A Slider with range and steps specified." :theme="pageTheme">
      <template #example>
        <WinSlider
          v-model="sliderValue2"
          :min="minimumValue"
          :max="maximumValue"
          :step="stepFrequencyValue"
          header="Control header"
          style="width: 200px;" />
      </template>
      <template #output>
        <p class="output-text">{{ sliderValue2 }}</p>
      </template>
      <template #options>
        <div class="options-grid">
          <label class="option-label">Minimum:</label>
          <input
            type="number"
            v-model.number="minimumValue"
            class="number-input" />

          <label class="option-label">Maximum:</label>
          <input
            type="number"
            v-model.number="maximumValue"
            class="number-input" />

          <label class="option-label">StepFrequency:</label>
          <input
            type="number"
            v-model.number="stepFrequencyValue"
            :min="1"
            class="number-input" />

          <label class="option-label">SmallChange:</label>
          <input
            type="number"
            v-model.number="smallChangeValue"
            class="number-input" />
        </div>
      </template>
    </WinControlExample>

    <!-- Example 3: Slider with Tick Marks -->
    <WinControlExample header-text="A Slider with tick marks." :theme="pageTheme">
      <template #example>
        <WinSlider
          v-model="sliderValue3"
          :show-ticks="true"
          :tick-frequency="20"
          :snap-to-ticks="snapsToTicks"
          style="width: 290px;" />
      </template>
      <template #output>
        <p class="output-text">{{ sliderValue3 }}</p>
      </template>
      <template #options>
        <div class="radio-group">
          <div class="radio-header">Snaps to:</div>
          <WinRadioButton value="step" v-model="snapsToMode">
            StepValues
          </WinRadioButton>
          <WinRadioButton value="ticks" v-model="snapsToMode">
            Ticks
          </WinRadioButton>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 4: Vertical Slider -->
    <WinControlExample header-text="A vertical Slider." :theme="pageTheme">
      <template #example>
        <WinSlider
          v-model="sliderValue4"
          :min="-50"
          :max="50"
          :vertical="true"
          :show-ticks="true"
          :tick-frequency="10"
          style="width: 100px; height: 100px;" />
      </template>
      <template #output>
        <p class="output-text">{{ sliderValue4 }}</p>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue';
import WinSlider from '../components/WinSlider.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinRadioButton from '../components/WinRadioButton.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'slider');

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

// Example 1: Simple Slider
const sliderValue1 = ref(0);

// Example 2: Slider with Range and Steps
const sliderValue2 = ref(800);
const minimumValue = ref(500);
const maximumValue = ref(1000);
const stepFrequencyValue = ref(10);
const smallChangeValue = ref(10);

// Example 3: Slider with Tick Marks
const sliderValue3 = ref(0);
const snapsToMode = ref('step');
const snapsToTicks = computed(() => snapsToMode.value === 'ticks');

// Example 4: Vertical Slider
const sliderValue4 = ref(0);
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

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}

.options-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 12px;
  align-items: center;
}

.option-label {
  font-size: 14px;
  color: var(--text-primary);
}

.number-input {
  width: 100%;
  padding: 4px 8px;
  font-size: 14px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: var(--ctrl-fill-default);
  border: 1px solid var(--ctrl-border);
  border-radius: 4px;
  color: var(--text-primary);
}

.number-input:focus {
  outline: 2px solid var(--accent-base);
  outline-offset: -1px;
}
</style>
