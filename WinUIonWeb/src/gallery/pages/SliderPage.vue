<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.slider')" />
          <WinTextBlock class="page-description" :Text="$t('text.use-a-slider-to-let-users-set-a-value-by-moving')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="sliderSimpleVue" :headerText="$t('text.a-simple-slider')">
              <template #example>
                <WinSlider Width="200" :Value="slider1" @update:Value="slider1 = $event" />
              </template>
              <template #options>
                <WinTextBlock :Text="String(slider1)" />
              </template>
            </WinControlExample>
            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="sliderRangeVue" :headerText="$t('sample.slider.range')">
              <template #example>
                <WinSlider
                  Width="200"
                  Margin="0,0,10,0"
                  :Header="$t('sample.slider.control-header')"
                  :Maximum="maximumValue"
                  :Minimum="minimumValue"
                  :SmallChange="smallChangeValue"
                  :StepFrequency="stepFrequencyValue"
                  :Value="slider2"
                  @update:Value="slider2 = $event" />
              </template>
              <template #options>
                <div class="slider-options">
                  <WinTextBlock :Text="String(slider2)" />
                  <div class="options-grid">
                    <WinTextBlock Text="Minimum:" />
                    <WinNumberBox :Value="minimumValue" SpinButtonPlacementMode="Compact" @update:Value="minimumValue = $event" />
                    <WinTextBlock Text="Maximum:" />
                    <WinNumberBox :Value="maximumValue" SpinButtonPlacementMode="Compact" @update:Value="maximumValue = $event" />
                    <WinTextBlock Text="StepFrequency:" />
                    <WinNumberBox :Value="stepFrequencyValue" :Minimum="1" SpinButtonPlacementMode="Compact" @update:Value="stepFrequencyValue = $event" />
                    <WinTextBlock Text="SmallChange:" />
                    <WinNumberBox :Value="smallChangeValue" SpinButtonPlacementMode="Compact" @update:Value="smallChangeValue = $event" />
                  </div>
                </div>
              </template>
            </WinControlExample>
            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="sliderTicksVue" :headerText="$t('sample.slider.ticks')">
              <template #example>
                <WinSlider Width="290" TickFrequency="20" TickPlacement="Outside" :SnapsTo="snapsTo" :Value="slider3" @update:Value="slider3 = $event" />
              </template>
              <template #options>
                <div class="slider-options">
                  <WinTextBlock :Text="String(slider3)" />
                  <WinRadioButton
                    :Header="$t('sample.slider.snaps-to')"
                    :ItemsSource="snapItems"
                    :SelectedIndex="snapsToIndex"
                    @SelectionChanged="snapsToIndex = $event.SelectedIndex" />
                </div>
              </template>
            </WinControlExample>
            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="sliderVerticalVue" :headerText="$t('sample.slider.vertical')">
              <template #example>
                <WinSlider Width="100" Height="100" :Maximum="50" :Minimum="-50" Orientation="Vertical" TickFrequency="10" TickPlacement="Outside" :Value="slider4" @update:Value="slider4 = $event" />
              </template>
              <template #options>
                <WinTextBlock :Text="String(slider4)" />
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinNumberBox from '../../components/WinNumberBox.vue';
import WinRadioButton from '../../components/WinRadioButton.vue';
import WinSlider from '../../components/WinSlider.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'slider');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const slider1 = ref(0);
const slider2 = ref(800);
const minimumValue = ref(500);
const maximumValue = ref(1000);
const stepFrequencyValue = ref(10);
const smallChangeValue = ref(10);
const slider3 = ref(0);
const snapsToIndex = ref(0);
const slider4 = ref(0);

const snapItems = computed(() => [t('sample.step-values'), t('sample.ticks')]);
const snapsTo = computed(() => snapsToIndex.value === 0 ? 'StepValues' : 'Ticks');

const sliderSimpleVue = `<WinSlider AutomationProperties.Name="simple slider" Width="200" />`;
const sliderRangeVue = `<WinSlider
  Width="200"
  Header="Control header"
  :Maximum="maximumValue"
  :Minimum="minimumValue"
  :SmallChange="smallChangeValue"
  :StepFrequency="stepFrequencyValue"
  :Value="800" />`;
const sliderTicksVue = `<WinSlider AutomationProperties.Name="Slider with ticks" Width="290" TickFrequency="20" TickPlacement="Outside" />`;
const sliderVerticalVue = `<WinSlider
  AutomationProperties.Name="vertical slider"
  Width="100"
  Height="100"
  :Maximum="50"
  :Minimum="-50"
  Orientation="Vertical"
  TickFrequency="10"
  TickPlacement="Outside" />`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.slider-options { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.options-grid { display: grid; grid-template-columns: auto minmax(80px, auto); gap: 8px 10px; align-items: center; }
.options-grid :deep(.win-number-box) { width: 92px; }
</style>
