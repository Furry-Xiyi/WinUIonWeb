<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" />
        <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind themeActionLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind themeActionLabel, Mode=OneWay}">
            <FontIcon Glyph="&#xE793;" />
          </Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind favoriteActionLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind favoriteActionLabel, Mode=OneWay}">
            <FontIcon Glyph="{x:Bind favoriteGlyph, Mode=OneWay}" />
          </ToggleButton>
        </div>
      </div>
      <div class="gallery-page-content">
        <ControlExample
          SampleDefinition="Grid\3x3GridControl.txt"
          HeaderText="{x:Bind sampleHeader, Mode=OneWay}"
          Theme="{x:Bind pageTheme, Mode=OneWay}"
          Xaml="{x:Bind gridXaml, Mode=OneWay}">
          <ControlExample.Example>
            <Grid
              x:Name="Control1"
              Width="240"
              Height="160"
              Background="Gray"
              ColumnSpacing="{x:Bind (x:Int32)ColumnSpacingSlider.Value, Mode=OneWay}"
              RowSpacing="{x:Bind (x:Int32)RowSpacingSlider.Value, Mode=OneWay}">
              <Grid.Resources>
                <Style TargetType="Rectangle">
                  <Setter Property="Height" Value="40" />
                  <Setter Property="Width" Value="40" />
                </Style>
              </Grid.Resources>
              <Grid.ColumnDefinitions>
                <ColumnDefinition Width="50" />
                <ColumnDefinition Width="50" />
                <ColumnDefinition Width="50" />
              </Grid.ColumnDefinitions>
              <Grid.RowDefinitions>
                <RowDefinition Height="50" />
                <RowDefinition Height="50" />
                <RowDefinition Height="50" />
              </Grid.RowDefinitions>
              <Rectangle
                x:Name="Rectangle1"
                Grid.Column="{x:Bind (x:Int32)ColumnSlider.Value, Mode=OneWay}"
                Grid.Row="{x:Bind (x:Int32)RowSlider.Value, Mode=OneWay}"
                Width="50"
                Height="50"
                Fill="Red" />
              <Rectangle Grid.Row="1" Fill="Blue" Width="50" Height="50" />
              <Rectangle Grid.Column="1" Fill="Green" Width="50" Height="50" />
              <Rectangle Grid.Column="1" Grid.Row="1" Fill="Yellow" Width="50" Height="50" />
            </Grid>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options>
            <Grid ColumnSpacing="12" RowSpacing="12">
              <Grid.ColumnDefinitions>
                <ColumnDefinition Width="Auto" />
                <ColumnDefinition Width="Auto" />
              </Grid.ColumnDefinitions>
              <Grid.RowDefinitions>
                <RowDefinition Height="Auto" />
                <RowDefinition Height="Auto" />
                <RowDefinition Height="Auto" />
                <RowDefinition Height="Auto" />
              </Grid.RowDefinitions>
              <TextBlock Grid.Column="0" Grid.Row="0" Text="{x:Bind gridLabel, Mode=OneWay}" />
              <Slider
                x:Name="ColumnSpacingSlider"
                Grid.Column="0"
                Grid.Row="1"
                Margin="16,0,0,0"
                Header="{x:Bind columnSpacingLabel, Mode=OneWay}"
                Maximum="16"
                Minimum="0"
                SnapsTo="Ticks"
                StepFrequency="1"
                TickFrequency="1"
                Value="{x:Bind ColumnSpacingSlider.Value, Mode=TwoWay}" />
              <Slider
                x:Name="RowSpacingSlider"
                Grid.Column="1"
                Grid.Row="1"
                Height="100"
                VerticalAlignment="Top"
                IsDirectionReversed="True"
                Maximum="16"
                Minimum="0"
                Orientation="Vertical"
                SnapsTo="Ticks"
                StepFrequency="1"
                TickFrequency="1"
                Value="{x:Bind RowSpacingSlider.Value, Mode=TwoWay}">
                <Slider.Header>
                  <TextBlock Margin="0,0,0,10" Text="{x:Bind rowSpacingLabel, Mode=OneWay}" />
                </Slider.Header>
              </Slider>
              <TextBlock Grid.Column="0" Grid.Row="2" Text="{x:Bind redBlockLabel, Mode=OneWay}" />
              <Slider
                x:Name="ColumnSlider"
                Grid.Column="0"
                Grid.Row="3"
                Margin="16,0,0,0"
                Header="{x:Bind columnLabel, Mode=OneWay}"
                Maximum="2"
                Minimum="0"
                SnapsTo="Ticks"
                StepFrequency="1"
                TickFrequency="1"
                Value="{x:Bind ColumnSlider.Value, Mode=TwoWay}" />
              <Slider
                x:Name="RowSlider"
                Grid.Column="1"
                Grid.Row="3"
                Height="100"
                VerticalAlignment="Top"
                IsDirectionReversed="True"
                Maximum="2"
                Minimum="0"
                Orientation="Vertical"
                SnapsTo="Ticks"
                StepFrequency="1"
                TickFrequency="1"
                Value="{x:Bind RowSlider.Value, Mode=TwoWay}">
                <Slider.Header>
                  <TextBlock Margin="0,0,0,10" Text="{x:Bind rowLabel, Mode=OneWay}" />
                </Slider.Header>
              </Slider>
            </Grid>
          </ControlExample.Options>
        </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, provide, reactive, type Ref } from 'vue'
import Button from '../../components/Button.vue'
import ColumnDefinition from '../../components/ColumnDefinition.vue'
import ControlExample from '../../components/ControlExample.vue'
import FontIcon from '../../components/FontIcon.vue'
import Grid from '../../components/Grid.vue'
import Rectangle from '../../components/Rectangle.vue'
import RowDefinition from '../../components/RowDefinition.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import Slider from '../../components/Slider.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { xamlScopeKey } from '../../components/xamlRuntime'
import { Setter, Style } from '../../components/gridResources'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'

const { t: translate } = useI18n()
const currentPage = inject<Ref<string> | undefined>('currentPage', undefined)
const pageKey = computed(() => currentPage?.value || 'grid')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const pageTitle = computed(() => translate('text.grid'))
const pageDescription = computed(() => translate('text.grid-description'))
const sampleHeader = computed(() => translate('sample.grid.3x3'))
const themeActionLabel = computed(() => translate('gallery.page-header.toggle-theme'))
const favoriteActionLabel = computed(() => translate('gallery.page-header.favorite'))
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const gridLabel = computed(() => translate('sample.grid.options.grid'))
const redBlockLabel = computed(() => translate('sample.grid.options.red-block'))
const columnSpacingLabel = computed(() => translate('sample.grid.options.column-spacing'))
const rowSpacingLabel = computed(() => translate('sample.grid.options.row-spacing'))
const columnLabel = computed(() => translate('sample.grid.options.column'))
const rowLabel = computed(() => translate('sample.grid.options.row'))
const ColumnSpacingSlider = reactive({ Value: 8 })
const RowSpacingSlider = reactive({ Value: 8 })
const ColumnSlider = reactive({ Value: 0 })
const RowSlider = reactive({ Value: 0 })
const values = computed(() => ({
  column: Math.trunc(ColumnSlider.Value),
  row: Math.trunc(RowSlider.Value),
  columnSpacing: Math.trunc(ColumnSpacingSlider.Value),
  rowSpacing: Math.trunc(RowSpacingSlider.Value)
}))
const gridXaml = computed(() => `<Grid Width="240" Height="120" Background="Gray"
      ColumnSpacing="${values.value.columnSpacing}" RowSpacing="${values.value.rowSpacing}">
    <Grid.ColumnDefinitions>
        <ColumnDefinition Width="50" />
        <ColumnDefinition Width="50" />
        <ColumnDefinition Width="50" />
    </Grid.ColumnDefinitions>
    <Grid.RowDefinitions>
        <RowDefinition Height="50" />
        <RowDefinition Height="50" />
        <RowDefinition Height="50" />
    </Grid.RowDefinitions>
    <Grid.Resources>
        <Style TargetType="Rectangle">
            <Setter Property="Height" Value="40" />
            <Setter Property="Width" Value="40" />
        </Style>
    </Grid.Resources>
    <Rectangle Grid.Column="${values.value.column}" Grid.Row="${values.value.row}"
               Width="50" Height="50" Fill="Red" />
    <Rectangle Grid.Row="1" Width="50" Height="50" Fill="Blue" />
    <Rectangle Grid.Column="1" Width="50" Height="50" Fill="Green" />
    <Rectangle Grid.Column="1" Grid.Row="1" Width="50" Height="50" Fill="Yellow" />
</Grid>`)
provide(xamlScopeKey, {
  pageTitle, pageDescription, sampleHeader, themeActionLabel, favoriteActionLabel,
  favoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite,
  gridLabel, redBlockLabel, columnSpacingLabel, rowSpacingLabel, columnLabel, rowLabel,
  ColumnSpacingSlider, RowSpacingSlider, ColumnSlider, RowSlider, gridXaml
})
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 80px 8px 0; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 80px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
</style>
