<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.stackpanel')" />
          <TextBlock class="page-description" :Text="$t('text.stackpanel-description')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" @Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" SampleDefinition="StackPanel\StackpanelControl.txt" :HeaderText="$t('sample.stackpanel.control')" :Theme="pageTheme" :Vue="stackPanelCode">
              <ControlExample.Example>
                <StackPanel :Orientation="orientation" :Spacing="spacing" VerticalAlignment="Top">
                  <div v-for="color in rectangleColors" :key="color" class="layout-rectangle" :style="{ background: color }" />
                </StackPanel>
              </ControlExample.Example>
              <ControlExample.Options>
                <div class="options-stack">
                  <RadioButtons Header="Orientation" :ItemsSource="orientationItems" :SelectedIndex="orientationIndex" @SelectionChanged="onOrientationChanged" />
                  <Slider v-model:Value="spacing" Header="Spacing" :Maximum="16" :Minimum="0" :StepFrequency="1" :TickFrequency="1" TickPlacement="Outside" SnapsTo="Ticks" />
                </div>
              </ControlExample.Options>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import RadioButtons from '../../components/RadioButtons.vue';
import Slider from '../../components/Slider.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
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

const stackPanelCode = computed(() => `<StackPanel Orientation="${orientation.value}" Spacing="${spacing.value}">
  <Rectangle Fill="Red" />
  <Rectangle Fill="Blue" />
  <Rectangle Fill="Green" />
  <Rectangle Fill="Yellow" />
</StackPanel>`);
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
