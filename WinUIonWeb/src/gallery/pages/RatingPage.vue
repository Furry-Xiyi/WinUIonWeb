<template>
  <div>
    <div class="page-heading">
      <WinTextBlock class="page-header" :Text="$t('text.ratingcontrol')" />
      <WinTextBlock class="page-description" :Text="$t('text.the-ratingcontrol-allows-users-to-view-and-set-r')" TextWrapping="WrapWholeWords" />
      <div class="page-header-actions">
        <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
        <WinToggleButton v-model:IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <WinControlExample class="basic-input-example-theme" :headerText="$t('text.a-simple-ratingcontrol')" :theme="pageTheme" :vue="ratingSimpleVue">
      <template #example>
        <WinRating
          :Value="ratingValue"
          :Caption="ratingCaption"
          :IsClearEnabled="clearEnabled"
          :IsReadOnly="readOnly"
          @update:Value="ratingValue = $event"
          @ValueChanged="onRatingValueChanged" />
      </template>
      <template #options>
        <div class="rating-options">
          <WinTextBlock FontWeight="Bold" :Text="String(ratingValue)" />
          <WinCheckBox v-model:IsChecked="clearEnabled"><WinTextBlock Text="IsClearEnabled" /></WinCheckBox>
          <WinTextBlock :Text="$t('sample.rating.clear-note')" TextWrapping="WrapWholeWords" />
          <WinCheckBox Margin="0,12,0,0" v-model:IsChecked="readOnly"><WinTextBlock Text="IsReadOnly" /></WinCheckBox>
        </div>
      </template>
    </WinControlExample>

    <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.rating.placeholder')" :theme="pageTheme" :vue="ratingPlaceholderVue">
      <template #example>
        <WinRating :PlaceholderValue="placeholderValue" />
      </template>
      <template #options>
        <div
          class="rating-options"
          @pointerdown="isPlaceholderSliderDragging = true"
          @pointerup="commitPlaceholderSlider"
          @pointercancel="commitPlaceholderSlider">
          <WinSlider
            :Header="$t('sample.placeholder-value')"
            :Value="placeholderSliderValue"
            :Minimum="0"
            :Maximum="5"
            :SmallChange="0.5"
            :StepFrequency="0.5"
            @update:Value="onPlaceholderSliderValueChanged" />
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinRating from '../../components/WinRating.vue';
import WinSlider from '../../components/WinSlider.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'rating');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const { t } = useI18n();

const ratingValue = ref(-1);
const clearEnabled = ref(false);
const readOnly = ref(false);
const placeholderSliderValue = ref(1);
const isPlaceholderSliderDragging = ref(false);
const placeholderValue = computed(() => Math.max(1, placeholderSliderValue.value));
const ratingCaptionChanged = ref(false);
const ratingCaption = ref(t('sample.rating.caption'));

const onRatingValueChanged = () => {
  ratingCaptionChanged.value = true;
  ratingCaption.value = t('sample.rating.your-rating');
};

const onPlaceholderSliderValueChanged = (value) => {
  placeholderSliderValue.value = !isPlaceholderSliderDragging.value && value < 1 ? 1 : value;
};

const commitPlaceholderSlider = () => {
  isPlaceholderSliderDragging.value = false;
  if (placeholderSliderValue.value < 1) placeholderSliderValue.value = 1;
};

const ratingSimpleVue = `<WinRating
  AutomationProperties.Name="Simple RatingControl"
  :Caption="ratingCaption"
  :IsClearEnabled="clearEnabled"
  :IsReadOnly="readOnly"
  @ValueChanged="ratingCaption = 'Your rating'" />`;

const ratingPlaceholderVue = `<WinRating AutomationProperties.Name="RatingControl with placeholder" :PlaceholderValue="placeholderValue" />

<WinSlider Header="PlaceholderValue" :Minimum="0" :Maximum="5" :SmallChange="0.5" :StepFrequency="0.5" :Value="placeholderSliderValue" />`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.header-action { width: 32px; height: 32px; min-width: 0; padding: 0; }
.icon { font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets", "WinUIOnWebIcons"; font-size: 16px; }
.rating-options { width: 220px; display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
</style>
