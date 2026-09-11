<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.variablesizedwrapgrid')" />
          <TextBlock class="page-description" :Text="$t('text.variablesizedwrapgrid-description')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" @Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" SampleDefinition="VariableSizedWrapGrid\VariablesizedwrapgridControl.txt" :HeaderText="$t('sample.variablesizedwrapgrid.control')" :Theme="pageTheme" :Vue="wrapGridCode">
              <ControlExample.Example>
                <VariableSizedWrapGrid Width="400" ItemHeight="44" ItemWidth="44" MaximumRowsOrColumns="3" :Orientation="orientation">
                  <div class="grid-item red" />
                  <div class="grid-item blue" style="grid-row: span 2;" />
                  <div class="grid-item green" style="grid-column: span 2;" />
                  <div class="grid-item yellow" style="grid-column: span 2; grid-row: span 2;" />
                </VariableSizedWrapGrid>
              </ControlExample.Example>
              <ControlExample.Options>
                <RadioButtons Header="Orientation" :ItemsSource="orientationItems" :SelectedIndex="orientationIndex" @SelectionChanged="onOrientationChanged" />
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
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import VariableSizedWrapGrid from '../../components/VariableSizedWrapGrid.vue';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'variablesizedwrapgrid');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const orientationItems = [{ Text: 'Horizontal' }, { Text: 'Vertical' }];
const orientationIndex = ref(1);
const orientation = computed(() => orientationItems[orientationIndex.value]?.Text || 'Vertical');
const onOrientationChanged = ({ SelectedIndex }) => {
  orientationIndex.value = SelectedIndex;
};

const wrapGridCode = computed(() => `<VariableSizedWrapGrid Width="400" ItemHeight="44" ItemWidth="44" MaximumRowsOrColumns="3" Orientation="${orientation.value}">
  <Rectangle Fill="Red" />
  <Rectangle Fill="Blue" VariableSizedWrapGrid.RowSpan="2" />
  <Rectangle Fill="Green" VariableSizedWrapGrid.ColumnSpan="2" />
  <Rectangle Fill="Yellow" VariableSizedWrapGrid.ColumnSpan="2" VariableSizedWrapGrid.RowSpan="2" />
</VariableSizedWrapGrid>`);
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
