<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.colorpicker')" />
          <WinTextBlock class="page-description" :Text="$t('text.a-control-that-lets-users-pick-a-color-from-a-sp')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="colorPickerPropertiesVue" :headerText="$t('sample.colorpicker.properties')">
              <template #example>
                <WinColorPicker
                  v-model:Color="color"
                  :ColorSpectrumShape="ColorSpectrumShape"
                  :IsMoreButtonVisible="IsMoreButtonVisible"
                  :IsColorSliderVisible="IsColorSliderVisible"
                  :IsColorChannelTextInputVisible="IsColorChannelTextInputVisible"
                  :IsHexInputVisible="IsHexInputVisible"
                  :IsAlphaEnabled="IsAlphaEnabled"
                  :IsAlphaSliderVisible="IsAlphaSliderVisible"
                  :IsAlphaTextInputVisible="IsAlphaTextInputVisible" />
              </template>
              <template #options>
                <div class="options-panel">
                  <WinCheckBox v-model:IsChecked="IsMoreButtonVisible"><WinTextBlock Text="IsMoreButtonVisible" /></WinCheckBox>
                  <WinCheckBox v-model:IsChecked="IsColorSliderVisible"><WinTextBlock Text="IsColorSliderVisible" /></WinCheckBox>
                  <WinCheckBox v-model:IsChecked="IsColorChannelTextInputVisible"><WinTextBlock Text="IsColorChannelTextInputVisible" /></WinCheckBox>
                  <WinCheckBox v-model:IsChecked="IsHexInputVisible"><WinTextBlock Text="IsHexInputVisible" /></WinCheckBox>
                  <WinCheckBox v-model:IsChecked="IsAlphaEnabled"><WinTextBlock :Text="$t('sample.alpha-enabled')" /></WinCheckBox>
                  <WinCheckBox v-model:IsChecked="IsAlphaSliderVisible" :IsEnabled="IsAlphaEnabled"><WinTextBlock Text="IsAlphaSliderVisible" /></WinCheckBox>
                  <WinCheckBox v-model:IsChecked="IsAlphaTextInputVisible" :IsEnabled="IsAlphaEnabled"><WinTextBlock Text="IsAlphaTextInputVisible" /></WinCheckBox>
                  <div class="radio-group">
                    <WinTextBlock class="radio-header" :Text="$t('sample.colorspectrum-shape')" />
                    <WinRadioButton v-model="ColorSpectrumShape" value="Box"><WinTextBlock :Text="$t('sample.box')" /></WinRadioButton>
                    <WinRadioButton v-model="ColorSpectrumShape" value="Ring"><WinTextBlock :Text="$t('sample.ring')" /></WinRadioButton>
                  </div>
                  <div class="preview-section">
                    <WinTextBlock :Text="$t('sample.colorpicker.applied-rectangle')" />
                    <div class="preview-rect" :style="{ background: color }"></div>
                  </div>
                </div>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinColorPicker from '../../components/WinColorPicker.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinRadioButton from '../../components/WinRadioButton.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'colorpicker');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const color = ref('#0067C0');
const IsMoreButtonVisible = ref(false);
const IsColorSliderVisible = ref(true);
const IsColorChannelTextInputVisible = ref(true);
const IsHexInputVisible = ref(true);
const IsAlphaEnabled = ref(false);
const IsAlphaSliderVisible = ref(true);
const IsAlphaTextInputVisible = ref(true);
const ColorSpectrumShape = ref('Box');

const colorPickerPropertiesVue = `<WinColorPicker
  v-model:Color="color"
  ColorSpectrumShape="Box"
  :IsMoreButtonVisible="IsMoreButtonVisible"
  :IsColorSliderVisible="IsColorSliderVisible"
  :IsColorChannelTextInputVisible="IsColorChannelTextInputVisible"
  :IsHexInputVisible="IsHexInputVisible"
  :IsAlphaEnabled="IsAlphaEnabled"
  :IsAlphaSliderVisible="IsAlphaSliderVisible"
  :IsAlphaTextInputVisible="IsAlphaTextInputVisible" />`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.options-panel { width: 250px; margin: -5px 0 0 0; display: flex; flex-direction: column; gap: 8px; }
.radio-group { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
.radio-header { font-weight: 600; }
.preview-section { display: flex; flex-direction: column; gap: 12px; margin-top: 12px; }
.preview-rect { height: 100px; border-radius: 4px; border: 1px solid var(--ctrl-border); }
</style>
