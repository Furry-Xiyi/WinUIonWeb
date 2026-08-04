<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.grid')" />
          <WinTextBlock class="page-description" :Text="$t('text.grid-description')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.grid.3x3')" :theme="pageTheme" :vue="gridCode">
              <template #example>
                <WinGrid
                  Width="240"
                  Height="160"
                  Background="Gray"
                  ColumnDefinitions="50, 50, 50"
                  RowDefinitions="50, 50, 50"
                  :ColumnSpacing="columnSpacing"
                  :RowSpacing="rowSpacing">
                  <div class="grid-rectangle red" :style="{ gridColumn: redBlockColumn + 1, gridRow: redBlockRow + 1 }" />
                  <div class="grid-rectangle blue" style="grid-column: 1; grid-row: 2;" />
                  <div class="grid-rectangle green" style="grid-column: 2; grid-row: 1;" />
                  <div class="grid-rectangle yellow" style="grid-column: 2; grid-row: 2;" />
                </WinGrid>
              </template>
              <template #options>
                <WinGrid MinWidth="200" ColumnDefinitions="Auto,Auto" RowDefinitions="Auto,Auto,Auto,Auto" ColumnSpacing="12" RowSpacing="12">
                  <WinTextBlock Text="Grid" style="grid-column: 1; grid-row: 1;" />
                  <WinSlider v-model:Value="columnSpacing" Width="100" Margin="16,0,0,0" Header="ColumnSpacing" :Maximum="16" :Minimum="0" :StepFrequency="1" :TickFrequency="1" TickPlacement="Outside" SnapsTo="Ticks" style="grid-column: 1; grid-row: 2;" />
                  <WinSlider v-model:Value="rowSpacing" Height="100" Header="RowSpacing" Orientation="Vertical" :Maximum="16" :Minimum="0" :StepFrequency="1" :TickFrequency="1" TickPlacement="Outside" SnapsTo="Ticks" style="grid-column: 2; grid-row: 2; align-self: start;" />
                  <WinTextBlock Text="Red block" style="grid-column: 1; grid-row: 3;" />
                  <WinSlider v-model:Value="redBlockColumn" Width="100" Margin="16,0,0,0" Header="Grid.Column" :Maximum="2" :Minimum="0" :StepFrequency="1" :TickFrequency="1" TickPlacement="Outside" SnapsTo="Ticks" style="grid-column: 1; grid-row: 4;" />
                  <WinSlider v-model:Value="redBlockRow" Height="100" Header="Grid.Row" Orientation="Vertical" :Maximum="2" :Minimum="0" :StepFrequency="1" :TickFrequency="1" TickPlacement="Outside" SnapsTo="Ticks" style="grid-column: 2; grid-row: 4; align-self: start;" />
                </WinGrid>
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
import WinGrid from '../../components/WinGrid.vue';
import WinSlider from '../../components/WinSlider.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'grid');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const columnSpacing = ref(8);
const rowSpacing = ref(8);
const redBlockColumn = ref(0);
const redBlockRow = ref(0);

const gridCode = computed(() => `<WinGrid Width="240" Height="120" Background="Gray"
  ColumnDefinitions="50, 50, 50"
  RowDefinitions="50, 50, 50"
  ColumnSpacing="${columnSpacing.value}"
  RowSpacing="${rowSpacing.value}">
  <Rectangle Fill="Red" Grid.Column="${redBlockColumn.value}" Grid.Row="${redBlockRow.value}" />
  <Rectangle Fill="Blue" Grid.Row="1" />
  <Rectangle Fill="Green" Grid.Column="1" />
  <Rectangle Fill="Yellow" Grid.Column="1" Grid.Row="1" />
</WinGrid>`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.grid-rectangle { width: 50px; height: 50px; }
.red { background: Red; }
.blue { background: Blue; }
.green { background: Green; }
.yellow { background: Yellow; }
</style>
