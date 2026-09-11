<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind $t('text.colorpicker'), Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind $t('text.a-control-that-lets-users-pick-a-color-from-a-sp'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" class="header-action" Click="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" SampleDefinition="ColorPicker\ColorPickerProperties.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind colorPickerPropertiesVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.colorpicker.properties'), Mode=OneWay}">
              <ControlExample.Example>
                <ColorPicker
                  Color="{x:Bind color, Mode=TwoWay}"
                  ColorSpectrumShape="{x:Bind ColorSpectrumShape, Mode=OneWay}"
                  IsMoreButtonVisible="{x:Bind IsMoreButtonVisible, Mode=OneWay}"
                  IsColorSliderVisible="{x:Bind IsColorSliderVisible, Mode=OneWay}"
                  IsColorChannelTextInputVisible="{x:Bind IsColorChannelTextInputVisible, Mode=OneWay}"
                  IsHexInputVisible="{x:Bind IsHexInputVisible, Mode=OneWay}"
                  IsAlphaEnabled="{x:Bind IsAlphaEnabled, Mode=OneWay}"
                  IsAlphaSliderVisible="{x:Bind IsAlphaSliderVisible, Mode=OneWay}"
                  IsAlphaTextInputVisible="{x:Bind IsAlphaTextInputVisible, Mode=OneWay}" />
              </ControlExample.Example>
              <ControlExample.Options>
                <StackPanel Width="250" Margin="0,-5,0,0">
                  <CheckBox IsChecked="{x:Bind IsMoreButtonVisible, Mode=TwoWay}"><TextBlock Text="{x:Bind $t('sample.colorpicker.more-button-visible'), Mode=OneWay}" /></CheckBox>
                  <CheckBox IsChecked="{x:Bind IsColorSliderVisible, Mode=TwoWay}"><TextBlock Text="{x:Bind $t('sample.colorpicker.color-slider-visible'), Mode=OneWay}" /></CheckBox>
                  <CheckBox IsChecked="{x:Bind IsColorChannelTextInputVisible, Mode=TwoWay}"><TextBlock Text="{x:Bind $t('sample.colorpicker.color-channel-text-input-visible'), Mode=OneWay}" /></CheckBox>
                  <CheckBox IsChecked="{x:Bind IsHexInputVisible, Mode=TwoWay}"><TextBlock Text="{x:Bind $t('sample.colorpicker.hex-input-visible'), Mode=OneWay}" /></CheckBox>
                  <CheckBox IsChecked="{x:Bind IsAlphaEnabled, Mode=TwoWay}"><TextBlock Text="{x:Bind $t('sample.alpha-enabled'), Mode=OneWay}" /></CheckBox>
                  <CheckBox IsChecked="{x:Bind IsAlphaSliderVisible, Mode=TwoWay}" IsEnabled="{x:Bind IsAlphaEnabled, Mode=OneWay}"><TextBlock Text="{x:Bind $t('sample.colorpicker.alpha-slider-visible'), Mode=OneWay}" /></CheckBox>
                  <CheckBox IsChecked="{x:Bind IsAlphaTextInputVisible, Mode=TwoWay}" IsEnabled="{x:Bind IsAlphaEnabled, Mode=OneWay}"><TextBlock Text="{x:Bind $t('sample.colorpicker.alpha-text-input-visible'), Mode=OneWay}" /></CheckBox>
                  <RadioButtons
                    Header="{x:Bind $t('sample.colorspectrum-shape'), Mode=OneWay}"
                    SelectedIndex="{x:Bind ColorSpectrumShape === 'Box' ? 0 : 1, Mode=OneWay}"
                    SelectionChanged="ColorSpectrumShape_SelectionChanged">
                    <RadioButton Content="{x:Bind $t('sample.box'), Mode=OneWay}" />
                    <RadioButton Content="{x:Bind $t('sample.ring'), Mode=OneWay}" />
                  </RadioButtons>
                  <StackPanel Margin="0,12,0,0">
                    <TextBlock Text="{x:Bind $t('sample.colorpicker.applied-rectangle'), Mode=OneWay}" />
                    <Border class="preview-rect" Background="{x:Bind color, Mode=OneWay}" />
                  </StackPanel>
                </StackPanel>
              </ControlExample.Options>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import CheckBox from '../../components/CheckBox.vue';
import ColorPicker from '../../components/ColorPicker.vue';
import ControlExample from '../../components/ControlExample.vue';
import Border from '../../components/Border.vue';
import RadioButton from '../../components/RadioButton.vue';
import RadioButtons from '../../components/RadioButtons.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
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

const ColorSpectrumShape_SelectionChanged = (args) => {
  ColorSpectrumShape.value = args?.SelectedIndex === 0 ? 'Box' : 'Ring';
};

const colorPickerPropertiesVue = `<ColorPicker
  Color="{x:Bind color, Mode=TwoWay}"
  ColorSpectrumShape="Box"
  IsMoreButtonVisible="{x:Bind IsMoreButtonVisible, Mode=OneWay}"
  IsColorSliderVisible="{x:Bind IsColorSliderVisible, Mode=OneWay}"
  IsColorChannelTextInputVisible="{x:Bind IsColorChannelTextInputVisible, Mode=OneWay}"
  IsHexInputVisible="{x:Bind IsHexInputVisible, Mode=OneWay}"
  IsAlphaEnabled="{x:Bind IsAlphaEnabled, Mode=OneWay}"
  IsAlphaSliderVisible="{x:Bind IsAlphaSliderVisible, Mode=OneWay}"
  IsAlphaTextInputVisible="{x:Bind IsAlphaTextInputVisible, Mode=OneWay}" />`;
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
