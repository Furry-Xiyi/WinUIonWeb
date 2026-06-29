<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">ColorPicker</h1>
      <p class="page-description">
        A control that lets users pick a color from a spectrum, sliders, and text input.
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

    <WinControlExample headerText="A simple ColorPicker" :theme="pageTheme">
      <template #example>
        <WinColorPicker v-model="color"
                        :isColorSliderVisible="colorSliderVisible"
                        :isColorChannelTextInputVisible="colorChannelInputVisible"
                        :isHexInputVisible="hexInputVisible"
                        :isAlphaEnabled="alphaEnabled"
                        :isAlphaSliderVisible="alphaSliderVisible"
                        :isColorPreviewVisible="previewVisible"
                        :colorSpectrumShape="spectrumShape" />
      </template>
      <template #options>
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
        <div class="cp-preview-section">
          <span class="cp-preview-label">ColorPicker applied on a Rectangle</span>
          <div class="cp-preview-rect" :style="{ background: color }"></div>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinColorPicker from '../components/WinColorPicker.vue';
import WinCheckBox from '../components/WinCheckBox.vue';
import WinRadioButton from '../components/WinRadioButton.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'colorpicker');

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

.cp-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.cp-radio-header {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.cp-preview-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.cp-preview-label {
  font-size: 14px;
  color: var(--text-primary);
}

.cp-preview-rect {
  width: 100%;
  height: 100px;
  border-radius: 4px;
  border: 1px solid var(--ctrl-border);
}
</style>
