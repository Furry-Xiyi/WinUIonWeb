<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.stackpanel')" />
          <WinTextBlock class="page-description" :Text="$t('text.stackpanel-description')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.stackpanel.control')" :theme="pageTheme" :vue="stackPanelCode">
              <template #example>
                <WinStackPanel :Orientation="orientation" :Spacing="spacing" VerticalAlignment="Top">
                  <div v-for="color in rectangleColors" :key="color" class="layout-rectangle" :style="{ background: color }" />
                </WinStackPanel>
              </template>
              <template #options>
                <div class="options-stack">
                  <WinRadioButtons Header="Orientation" :ItemsSource="orientationItems" :SelectedIndex="orientationIndex" @SelectionChanged="onOrientationChanged" />
                  <WinSlider v-model:Value="spacing" Header="Spacing" :Maximum="16" :Minimum="0" :StepFrequency="1" :TickFrequency="1" TickPlacement="Outside" SnapsTo="Ticks" />
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
import WinControlExample from '../../components/WinControlExample.vue';
import WinRadioButtons from '../../components/WinRadioButtons.vue';
import WinSlider from '../../components/WinSlider.vue';
import WinStackPanel from '../../components/WinStackPanel.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'stackpanel');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const rectangleColors = ['Red', 'Blue', 'Green', 'Yellow'];
const orientationItems = [{ Text: 'Horizontal' }, { Text: 'Vertical' }];
const orientationIndex = ref(1);
const spacing = ref(8);
const orientation = computed(() => orientationItems[orientationIndex.value]?.Text || 'Vertical');

const onOrientationChanged = ({ SelectedIndex }) => {
  orientationIndex.value = SelectedIndex;
};

const stackPanelCode = computed(() => `<WinStackPanel Orientation="${orientation.value}" Spacing="${spacing.value}">
  <Rectangle Fill="Red" />
  <Rectangle Fill="Blue" />
  <Rectangle Fill="Green" />
  <Rectangle Fill="Yellow" />
</WinStackPanel>`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.layout-rectangle { width: 40px; height: 40px; }
.options-stack { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
</style>
