<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.grid')" />
          <TextBlock class="page-description" :Text="$t('text.grid-description')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" @Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" SampleDefinition="Grid\3x3GridControl.txt" :HeaderText="$t('sample.grid.3x3')" :Theme="pageTheme" :Vue="gridCode">
              <ControlExample.Example>
                <Grid
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
                </Grid>
              </ControlExample.Example>
              <ControlExample.Options>
                <Grid MinWidth="200" ColumnDefinitions="Auto,Auto" RowDefinitions="Auto,Auto,Auto,Auto" ColumnSpacing="12" RowSpacing="12">
                  <TextBlock Text="Grid" style="grid-column: 1; grid-row: 1;" />
                  <Slider v-model:Value="columnSpacing" Width="100" Margin="16,0,0,0" Header="ColumnSpacing" :Maximum="16" :Minimum="0" :StepFrequency="1" :TickFrequency="1" TickPlacement="Outside" SnapsTo="Ticks" style="grid-column: 1; grid-row: 2;" />
                  <Slider v-model:Value="rowSpacing" Height="100" Header="RowSpacing" Orientation="Vertical" :Maximum="16" :Minimum="0" :StepFrequency="1" :TickFrequency="1" TickPlacement="Outside" SnapsTo="Ticks" style="grid-column: 2; grid-row: 2; align-self: start;" />
                  <TextBlock Text="Red block" style="grid-column: 1; grid-row: 3;" />
                  <Slider v-model:Value="redBlockColumn" Width="100" Margin="16,0,0,0" Header="Grid.Column" :Maximum="2" :Minimum="0" :StepFrequency="1" :TickFrequency="1" TickPlacement="Outside" SnapsTo="Ticks" style="grid-column: 1; grid-row: 4;" />
                  <Slider v-model:Value="redBlockRow" Height="100" Header="Grid.Row" Orientation="Vertical" :Maximum="2" :Minimum="0" :StepFrequency="1" :TickFrequency="1" TickPlacement="Outside" SnapsTo="Ticks" style="grid-column: 2; grid-row: 4; align-self: start;" />
                </Grid>
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
import Grid from '../../components/Grid.vue';
import Slider from '../../components/Slider.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'grid');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const columnSpacing = ref(8);
const rowSpacing = ref(8);
const redBlockColumn = ref(0);
const redBlockRow = ref(0);

const gridCode = computed(() => `<Grid Width="240" Height="120" Background="Gray"
  ColumnDefinitions="50, 50, 50"
  RowDefinitions="50, 50, 50"
  ColumnSpacing="${columnSpacing.value}"
  RowSpacing="${rowSpacing.value}">
  <Rectangle Fill="Red" Grid.Column="${redBlockColumn.value}" Grid.Row="${redBlockRow.value}" />
  <Rectangle Fill="Blue" Grid.Row="1" />
  <Rectangle Fill="Green" Grid.Column="1" />
  <Rectangle Fill="Yellow" Grid.Column="1" Grid.Row="1" />
</Grid>`);
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
