<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind $t('text.ratingcontrol'), Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind $t('text.the-ratingcontrol-allows-users-to-view-and-set-r'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" class="header-action" Click="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" SampleDefinition="RatingControl\RatingControlSimple.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind ratingSimpleVue, Mode=OneWay}" HeaderText="{x:Bind $t('text.a-simple-ratingcontrol'), Mode=OneWay}">
              <ControlExample.Example>
                <StackPanel VerticalAlignment="Top">
                  <RatingControl
                    HorizontalAlignment="Left"
                    Caption="{x:Bind ratingCaption, Mode=OneWay}"
                    IsClearEnabled="{x:Bind clearEnabled, Mode=OneWay}"
                    IsReadOnly="{x:Bind readOnly, Mode=OneWay}"
                    Value="{x:Bind ratingValue, Mode=TwoWay}"
                    ValueChanged="onRatingValueChanged" />
                </StackPanel>
              </ControlExample.Example>
              <ControlExample.Output>
                <TextBlock FontWeight="Bold" Text="{x:Bind String(ratingValue), Mode=OneWay}" />
              </ControlExample.Output>
              <ControlExample.Options>
                <StackPanel Width="220">
                  <CheckBox IsChecked="{x:Bind clearEnabled, Mode=TwoWay}"><TextBlock Text="{x:Bind $t('sample.rating.is-clear-enabled'), Mode=OneWay}" /></CheckBox>
                  <TextBlock Text="{x:Bind $t('sample.rating.clear-note'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
                  <CheckBox Margin="0,12,0,0" IsChecked="{x:Bind readOnly, Mode=TwoWay}"><TextBlock Text="{x:Bind $t('sample.rating.is-read-only'), Mode=OneWay}" /></CheckBox>
                </StackPanel>
              </ControlExample.Options>
            </ControlExample>
            <ControlExample class="basic-input-example-theme" SampleDefinition="RatingControl\RatingControlPlaceholder.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind ratingPlaceholderVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.rating.placeholder'), Mode=OneWay}">
              <ControlExample.Example>
                <RatingControl
                  HorizontalAlignment="Left"
                  VerticalAlignment="Top"
                  AutomationProperties.Name="RatingControl with placeholder"
                  PlaceholderValue="{x:Bind placeholderValue, Mode=OneWay}" />
              </ControlExample.Example>
              <ControlExample.Options>
                <StackPanel Width="220">
                  <Slider
                    Header="{x:Bind $t('sample.placeholder-value'), Mode=OneWay}"
                    Value="{x:Bind placeholderSliderValue, Mode=TwoWay}"
                    Minimum="{x:Bind 0, Mode=OneWay}"
                    Maximum="{x:Bind 5, Mode=OneWay}"
                    SmallChange="{x:Bind 0.5, Mode=OneWay}"
                    StepFrequency="{x:Bind 0.5, Mode=OneWay}"
                    ValueChanged="onPlaceholderSliderValueChanged" />
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
import ControlExample from '../../components/ControlExample.vue';
import RatingControl from '../../components/Rating.vue';
import Slider from '../../components/Slider.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'rating');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const { t } = useI18n();

const ratingValue = ref(-1);
const clearEnabled = ref(false);
const readOnly = ref(false);
const placeholderSliderValue = ref(1);
const placeholderValue = computed(() => {
  const numericValue = Number(placeholderSliderValue.value);
  return Number.isFinite(numericValue) ? Math.max(1, Math.min(5, numericValue)) : 1;
});
const ratingCaptionChanged = ref(false);
const ratingCaption = ref(t('sample.rating.caption'));

const onRatingValueChanged = () => {
  ratingCaptionChanged.value = true;
  ratingCaption.value = t('sample.rating.your-rating');
};

const onPlaceholderSliderValueChanged = (event) => {
  // Slider raises the XAML-shaped ValueChanged payload. The previous
  // handler stored that object in the bound ref, which made the value NaN
  // and left the placeholder/rating display stuck at zero.
  const rawValue = typeof event === 'number'
    ? event
    : event?.NewValue ?? event?.Value ?? event?.value;
  const numericValue = Number(rawValue);
  const steppedValue = Number.isFinite(numericValue)
    ? Math.round(numericValue * 2) / 2
    : 1;
  // RatingControl's effective minimum is 1.0. Dragging the options slider
  // to zero therefore returns to 1.0, while retaining the official 0.5 step.
  placeholderSliderValue.value = Math.max(1, Math.min(5, steppedValue));
};
const RatingControl1_ValueChanged = () => onRatingValueChanged();

const ratingSimpleVue = `<RatingControl
  AutomationProperties.Name="Simple RatingControl"
  Caption="{x:Bind ratingCaption, Mode=OneWay}"
  IsClearEnabled="{x:Bind clearEnabled, Mode=OneWay}"
  IsReadOnly="{x:Bind readOnly, Mode=OneWay}"
  ValueChanged="RatingControl1_ValueChanged" />`;

const ratingPlaceholderVue = `<RatingControl AutomationProperties.Name="RatingControl with placeholder" PlaceholderValue="{x:Bind placeholderValue, Mode=OneWay}" />

<Slider Header="{x:Bind $t('sample.placeholder-value'), Mode=OneWay}" Minimum="{x:Bind 0, Mode=OneWay}" Maximum="{x:Bind 5, Mode=OneWay}" SmallChange="{x:Bind 0.5, Mode=OneWay}" StepFrequency="{x:Bind 0.5, Mode=OneWay}" Value="{x:Bind placeholderSliderValue, Mode=OneWay}" />`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.rating-options { width: 220px; display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
</style>
