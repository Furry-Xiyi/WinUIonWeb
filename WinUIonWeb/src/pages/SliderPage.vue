<template>
  <div class="control-page">
    <h1 class="page-header">Slider</h1>
    <p class="page-description">
      Use a Slider to let users set a value by moving a thumb along a track. A Slider is a good choice when you know that users think of the value as a relative quantity, not a numeric value.
    </p>

    <!-- Example 1: Simple Slider -->
    <WinSettingsCard
      header="A simple Slider."
      description="Drag the slider to change its value.">
      <template #default>
        <WinSlider
          v-model="sliderValue1"
          style="width: 200px;" />
      </template>
      <template #output>
        <div class="output-text">{{ sliderValue1 }}</div>
      </template>
    </WinSettingsCard>

    <!-- Example 2: Slider with Range and Steps -->
    <WinSettingsCard
      header="A Slider with range and steps specified."
      description="Configure the Slider's range and step behavior.">
      <template #default>
        <WinSlider
          v-model="sliderValue2"
          :min="minimumValue"
          :max="maximumValue"
          :step="stepFrequencyValue"
          header="Control header"
          style="width: 200px;" />
      </template>
      <template #output>
        <div class="output-text">{{ sliderValue2 }}</div>
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
    </WinSettingsCard>

    <!-- Example 3: Slider with Tick Marks -->
    <WinSettingsCard
      header="A Slider with tick marks."
      description="Tick marks provide visual reference points for the Slider.">
      <template #default>
        <WinSlider
          v-model="sliderValue3"
          :show-ticks="true"
          :tick-frequency="20"
          :snap-to-ticks="snapsToTicks"
          style="width: 290px;" />
      </template>
      <template #output>
        <div class="output-text">{{ sliderValue3 }}</div>
      </template>
      <template #options>
        <div>
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">Snaps to:</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <WinRadioButton value="step" v-model="snapsToMode">
              StepValues
            </WinRadioButton>
            <WinRadioButton value="ticks" v-model="snapsToMode">
              Ticks
            </WinRadioButton>
          </div>
        </div>
      </template>
    </WinSettingsCard>

    <!-- Example 4: Vertical Slider -->
    <WinSettingsCard
      header="A vertical Slider."
      description="Set the Orientation property to Vertical to make the Slider vertical.">
      <template #default>
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
        <div class="output-text">{{ sliderValue4 }}</div>
      </template>
    </WinSettingsCard>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import WinSlider from '../components/WinSlider.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinRadioButton from '../components/WinRadioButton.vue';

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

.output-text {
  padding: 8px 12px;
  background: var(--card-background-secondary);
  border-radius: 4px;
  font-family: 'Cascadia Code', 'Consolas', monospace;
  font-size: 13px;
  margin-top: 12px;
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
  padding: 4px 8px;
  border: 1px solid var(--control-stroke-default);
  border-radius: 4px;
  background: var(--control-fill-default);
  color: var(--text-primary);
  font-size: 14px;
  min-width: 80px;
}

.number-input:focus {
  outline: none;
  border-color: var(--accent-default);
}
</style>
