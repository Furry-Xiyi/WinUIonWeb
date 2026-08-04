<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.variablesizedwrapgrid')" />
          <WinTextBlock class="page-description" :Text="$t('text.variablesizedwrapgrid-description')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.variablesizedwrapgrid.control')" :theme="pageTheme" :vue="wrapGridCode">
              <template #example>
                <WinVariableSizedWrapGrid Width="400" ItemHeight="44" ItemWidth="44" MaximumRowsOrColumns="3" :Orientation="orientation">
                  <div class="grid-item red" />
                  <div class="grid-item blue" style="grid-row: span 2;" />
                  <div class="grid-item green" style="grid-column: span 2;" />
                  <div class="grid-item yellow" style="grid-column: span 2; grid-row: span 2;" />
                </WinVariableSizedWrapGrid>
              </template>
              <template #options>
                <WinRadioButtons Header="Orientation" :ItemsSource="orientationItems" :SelectedIndex="orientationIndex" @SelectionChanged="onOrientationChanged" />
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
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinVariableSizedWrapGrid from '../../components/WinVariableSizedWrapGrid.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'variablesizedwrapgrid');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const orientationItems = [{ Text: 'Horizontal' }, { Text: 'Vertical' }];
const orientationIndex = ref(1);
const orientation = computed(() => orientationItems[orientationIndex.value]?.Text || 'Vertical');
const onOrientationChanged = ({ SelectedIndex }) => {
  orientationIndex.value = SelectedIndex;
};

const wrapGridCode = computed(() => `<WinVariableSizedWrapGrid Width="400" ItemHeight="44" ItemWidth="44" MaximumRowsOrColumns="3" Orientation="${orientation.value}">
  <Rectangle Fill="Red" />
  <Rectangle Fill="Blue" VariableSizedWrapGrid.RowSpan="2" />
  <Rectangle Fill="Green" VariableSizedWrapGrid.ColumnSpan="2" />
  <Rectangle Fill="Yellow" VariableSizedWrapGrid.ColumnSpan="2" VariableSizedWrapGrid.RowSpan="2" />
</WinVariableSizedWrapGrid>`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.grid-item { min-width: 44px; min-height: 44px; }
.red { background: Red; }
.blue { background: Blue; }
.green { background: Green; }
.yellow { background: Yellow; }
</style>
