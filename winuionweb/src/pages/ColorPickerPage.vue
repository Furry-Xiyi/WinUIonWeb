<template>
  <h1 class="page-header">ColorPicker</h1>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      ColorPicker
    </template>
    <template #description>
      A control that lets users pick a color from a spectrum, sliders, and text input.
    </template>
    <div class="cp-page-layout">
      <div class="cp-page-left">
        <WinColorPicker v-model="color"
                        :isColorSliderVisible="colorSliderVisible"
                        :isColorChannelTextInputVisible="colorChannelInputVisible"
                        :isHexInputVisible="hexInputVisible"
                        :isAlphaEnabled="alphaEnabled"
                        :isAlphaSliderVisible="alphaSliderVisible"
                        :isColorPreviewVisible="previewVisible"
                        :colorSpectrumShape="spectrumShape" />
      </div>
      <div class="cp-page-right">
        <WinCheckBox v-model="colorSliderVisible">IsColorSliderVisible</WinCheckBox>
        <WinCheckBox v-model="colorChannelInputVisible">IsColorChannelTextInputVisible</WinCheckBox>
        <WinCheckBox v-model="hexInputVisible">IsHexInputVisible</WinCheckBox>
        <WinCheckBox v-model="previewVisible">IsColorPreviewVisible</WinCheckBox>
        <WinCheckBox v-model="alphaEnabled">Alpha Enabled</WinCheckBox>
        <WinCheckBox v-model="alphaSliderVisible" :disabled="!alphaEnabled">IsAlphaSliderVisible</WinCheckBox>
        <div class="cp-radio-group">
          <span class="cp-radio-header">ColorSpectrum shape</span>
          <WinRadioButton v-model="spectrumShape" value="Box">Box</WinRadioButton>
          <WinRadioButton v-model="spectrumShape" value="Ring">Ring</WinRadioButton>
        </div>
        <div class="cp-result-block">
          <span class="cp-result-label">Selected color</span>
          <div class="cp-result-rect" :style="{ background: color }"></div>
          <span class="cp-result-hex">{{ color }}</span>
        </div>
      </div>
    </div>
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinColorPicker from '../components/WinColorPicker.vue';
import WinCheckBox from '../components/WinCheckBox.vue';
import WinRadioButton from '../components/WinRadioButton.vue';

const color = ref('#0067C0');
const colorSliderVisible = ref(true);
const colorChannelInputVisible = ref(true);
const hexInputVisible = ref(true);
const previewVisible = ref(true);
const alphaEnabled = ref(false);
const alphaSliderVisible = ref(true);
const spectrumShape = ref('Box');
</script>

<style scoped>
  .cp-page-layout {
    display: flex;
    gap: 32px;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .cp-page-left {
    flex-shrink: 0;
  }

  .cp-page-right {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 200px;
  }

  .cp-radio-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 4px;
  }

  .cp-radio-header {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .cp-result-block {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }

  .cp-result-label {
    font-size: 13px;
    color: var(--text-secondary);
  }

  .cp-result-rect {
    width: 100%;
    height: 80px;
    border-radius: 4px;
    border: 1px solid var(--card-stroke);
  }

  .cp-result-hex {
    font-size: 12px;
    font-family: 'Cascadia Code', 'Consolas', monospace;
    color: var(--text-primary);
  }
</style>
