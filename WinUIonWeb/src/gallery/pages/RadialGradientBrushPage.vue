<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind PageTitle, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind PageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind ThemeButtonLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind ThemeButtonLabel, Mode=OneWay}"><FontIcon Glyph="&#xE793;" /></Button>
            <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind FavoriteButtonLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind FavoriteButtonLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" /></ToggleButton>
          </StackPanel>
        </StackPanel>
        <StackPanel class="gallery-page-content">
          <ControlExample class="radial-gradient-example" SampleDefinition="RadialGradientBrush\RadialgradientbrushSample.txt" HeaderText="{x:Bind SampleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SampleXaml, Mode=OneWay}" Loaded="OnPageLoaded">
            <ControlExample.Example>
              <StackPanel HorizontalAlignment="Center" VerticalAlignment="Center" Orientation="Horizontal">
                <Rectangle x:Name="Rect" Width="200" Height="200">
                  <Rectangle.Fill>
                    <media:RadialGradientBrush x:Name="RadialGradientBrushExample" Center="0.25,0.25" GradientOrigin="0.5,.25" MappingMode="RelativeToBoundingBox" RadiusX=".5" RadiusY=".5" SpreadMethod="Pad">
                      <GradientStop Offset="0.0" Color="Yellow" />
                      <GradientStop Offset="1" Color="Blue" />
                    </media:RadialGradientBrush>
                  </Rectangle.Fill>
                </Rectangle>
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output>
              <TextBlock Text="{x:Bind SampleOutput, Mode=OneWay}" TextWrapping="Wrap" />
            </ControlExample.Output>
            <ControlExample.Options>
              <Grid class="radial-gradient-options">
                <Grid.RowDefinitions><RowDefinition /><RowDefinition /><RowDefinition /><RowDefinition /><RowDefinition /></Grid.RowDefinitions>
                <Grid.ColumnDefinitions><ColumnDefinition /><ColumnDefinition /></Grid.ColumnDefinitions>
                <ComboBox x:Name="MappingModeComboBox" Grid.ColumnSpan="2" Header="{x:Bind MappingModeHeader, Mode=OneWay}" SelectedIndex="0" SelectionChanged="OnMappingModeChanged">
                  <x:String x:Uid="ComboBoxMigration_RelativeToBoundingBox" />
                  <x:String x:Uid="ComboBoxMigration_Absolute" />
                </ComboBox>
                <Slider x:Name="CenterXSlider" Grid.Row="1" Header="{x:Bind CenterXHeader, Mode=OneWay}" SmallChange="0.05" ValueChanged="OnSliderValueChanged" />
                <Slider x:Name="CenterYSlider" Grid.Row="1" Grid.Column="1" Header="{x:Bind CenterYHeader, Mode=OneWay}" SmallChange="0.05" ValueChanged="OnSliderValueChanged" />
                <Slider x:Name="RadiusXSlider" Grid.Row="2" Header="{x:Bind RadiusXHeader, Mode=OneWay}" SmallChange="0.05" ValueChanged="OnSliderValueChanged" />
                <Slider x:Name="RadiusYSlider" Grid.Row="2" Grid.Column="1" Header="{x:Bind RadiusYHeader, Mode=OneWay}" SmallChange="0.05" ValueChanged="OnSliderValueChanged" />
                <Slider x:Name="OriginXSlider" Grid.Row="3" Header="{x:Bind OriginXHeader, Mode=OneWay}" SmallChange="0.05" ValueChanged="OnSliderValueChanged" />
                <Slider x:Name="OriginYSlider" Grid.Row="3" Grid.Column="1" Header="{x:Bind OriginYHeader, Mode=OneWay}" SmallChange="0.05" ValueChanged="OnSliderValueChanged" />
                <ComboBox x:Name="SpreadMethodComboBox" Grid.Row="4" Grid.ColumnSpan="2" Margin="0,10,0,0" Header="{x:Bind SpreadMethodHeader, Mode=OneWay}" SelectedIndex="0" SelectionChanged="OnSpreadMethodChanged">
                  <x:String x:Uid="ComboBoxMigration_Pad" />
                  <x:String x:Uid="ComboBoxMigration_Reflect" />
                  <x:String x:Uid="ComboBoxMigration_Repeat" />
                </ComboBox>
              </Grid>
            </ControlExample.Options>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="SpreadMethod" Value="{x:Bind RadialGradientBrushExample.SpreadMethod, Mode=OneWay}" />
              <ControlExampleSubstitution Key="MappingMode" Value="{x:Bind RadialGradientBrushExample.MappingMode, Mode=OneWay}" />
              <ControlExampleSubstitution Key="CenterX" Value="{x:Bind CenterXSlider.Value, Mode=OneWay}" />
              <ControlExampleSubstitution Key="CenterY" Value="{x:Bind CenterYSlider.Value, Mode=OneWay}" />
              <ControlExampleSubstitution Key="RadiusX" Value="{x:Bind RadiusXSlider.Value, Mode=OneWay}" />
              <ControlExampleSubstitution Key="RadiusY" Value="{x:Bind RadiusYSlider.Value, Mode=OneWay}" />
              <ControlExampleSubstitution Key="OriginX" Value="{x:Bind OriginXSlider.Value, Mode=OneWay}" />
              <ControlExampleSubstitution Key="OriginY" Value="{x:Bind OriginYSlider.Value, Mode=OneWay}" />
            </ControlExample.Substitutions>
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, provide, shallowReactive } from 'vue'
import Button from '../../components/Button.vue'
import ColumnDefinition from '../../components/ColumnDefinition.vue'
import ComboBox, { XamlString } from '../../components/ComboBox.vue'
import ControlExample from '../../components/ControlExample.vue'
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties'
import FontIcon from '../../components/FontIcon.vue'
import Grid from '../../components/Grid.vue'
import Page from '../../components/Page.vue'
import RadialGradientBrush, { GradientStop } from '../../components/RadialGradientBrush.vue'
import Rectangle from '../../components/Rectangle.vue'
import RowDefinition from '../../components/RowDefinition.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import Slider from '../../components/Slider.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import sample from '../samples/RadialGradientBrush/RadialgradientbrushSample.txt?raw'

defineOptions({ components: { 'media:RadialGradientBrush': RadialGradientBrush, 'x:String': XamlString } })
const { t } = useI18n()
const currentPage = inject('currentPage')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'radialgradientbrush')
const namescope = shallowReactive({})
provide(xamlNameScopeKey, namescope)
const resource = key => computed(() => t(key))
const PageTitle = resource('sample.radialgradient.page-title')
const PageDescription = resource('sample.radialgradient.page-description')
const SampleHeader = resource('sample.radialgradient.header')
const MappingModeHeader = resource('ComboBoxMigration_MappingMode')
const SpreadMethodHeader = resource('ComboBoxMigration_SpreadMethod')
const CenterXHeader = resource('sample.radialgradient.center-x')
const CenterYHeader = resource('sample.radialgradient.center-y')
const RadiusXHeader = resource('sample.radialgradient.radius-x')
const RadiusYHeader = resource('sample.radialgradient.radius-y')
const OriginXHeader = resource('sample.radialgradient.origin-x')
const OriginYHeader = resource('sample.radialgradient.origin-y')
const ThemeButtonLabel = resource('gallery.toggle-theme')
const FavoriteButtonLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'))
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const SampleXaml = sample.split(/--- xaml\s*\r?\n/)[1]?.trim() ?? ''
const formatNumber = value => String(Number(Number(value).toFixed(4)))
const SampleOutput = computed(() => {
  const brush = namescope.RadialGradientBrushExample
  if (!brush) return ''
  return t('sample.radialgradient.output-format', {
    mappingMode: t(`ComboBoxMigration_${brush.MappingMode}`),
    center: `${formatNumber(brush.Center.X)}, ${formatNumber(brush.Center.Y)}`,
    radiusX: formatNumber(brush.RadiusX), radiusY: formatNumber(brush.RadiusY),
    origin: `${formatNumber(brush.GradientOrigin.X)}, ${formatNumber(brush.GradientOrigin.Y)}`,
    spreadMethod: t(`ComboBoxMigration_${brush.SpreadMethod}`)
  })
})
let initialized = false
let initializing = false
const sliderNames = ['CenterXSlider', 'CenterYSlider', 'RadiusXSlider', 'RadiusYSlider', 'OriginXSlider', 'OriginYSlider']
const OnSliderValueChanged = () => {
  const brush = namescope.RadialGradientBrushExample
  if (!brush || !initialized || initializing) return
  brush.Center = { X: namescope.CenterXSlider.Value, Y: namescope.CenterYSlider.Value }
  brush.RadiusX = namescope.RadiusXSlider.Value
  brush.RadiusY = namescope.RadiusYSlider.Value
  brush.GradientOrigin = { X: namescope.OriginXSlider.Value, Y: namescope.OriginYSlider.Value }
}
const InitializeSliders = () => {
  if (!namescope.RadialGradientBrushExample || sliderNames.some(name => !namescope[name])) return
  initializing = true
  const absolute = namescope.RadialGradientBrushExample.MappingMode === 'Absolute'
  const { X: width = 200, Y: height = 200 } = namescope.Rect?.ActualSize ?? {}
  try {
    for (const name of sliderNames) {
      const slider = namescope[name]
      slider.Maximum = absolute ? width : 1
      slider.Value = absolute ? width / 2 : .5
      slider.StepFrequency = absolute ? (name.includes('Y') ? height : width) / 50 : .02
      slider.SmallChange = absolute ? 10 : .05
    }
  } finally {
    initializing = false
  }
  initialized = true
  OnSliderValueChanged()
}
const OnMappingModeChanged = () => {
  if (!initialized) return
  const value = ['RelativeToBoundingBox', 'Absolute'][namescope.MappingModeComboBox.SelectedIndex]
  if (value !== 'Absolute' && value !== 'RelativeToBoundingBox') return
  namescope.RadialGradientBrushExample.MappingMode = value
  InitializeSliders()
}
const OnSpreadMethodChanged = () => {
  if (!initialized) return
  const value = ['Pad', 'Reflect', 'Repeat'][namescope.SpreadMethodComboBox.SelectedIndex]
  if (value === 'Pad' || value === 'Reflect' || value === 'Repeat') namescope.RadialGradientBrushExample.SpreadMethod = value
}
const OnPageLoaded = () => {
  if (!initialized) InitializeSliders()
}
provide(xamlScopeKey, { PageTitle, PageDescription, SampleHeader, MappingModeHeader, SpreadMethodHeader,
  CenterXHeader, CenterYHeader,
  RadiusXHeader, RadiusYHeader, OriginXHeader, OriginYHeader, ThemeButtonLabel, FavoriteButtonLabel,
  FavoriteGlyph, SampleXaml, SampleOutput, isFavoriteState, pageTheme, toggleTheme, toggleFavorite,
  OnPageLoaded, OnSliderValueChanged, OnMappingModeChanged, OnSpreadMethodChanged })
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 72px 8px 0; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.page-heading { min-width: 0; }
.page-header, .page-description { overflow-wrap: anywhere; }
.gallery-page-content { container-type: inline-size; }
.gallery-page-content :deep(.radial-gradient-example .example-container.has-output.has-options) {
  grid-template-columns: minmax(224px, 1fr) 252px 320px;
}
.gallery-page-content :deep(.radial-gradient-example .example-output) {
  width: 240px;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}
.gallery-page-content :deep(.radial-gradient-example .example-options) {
  width: 320px;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}
.radial-gradient-options { width: 100%; max-width: 100%; min-width: 0; }
@container (max-width: 820px) {
  .gallery-page-content :deep(.radial-gradient-example .example-container.has-output.has-options) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto auto;
  }
  .gallery-page-content :deep(.radial-gradient-example .example-display) { grid-column: 1; grid-row: 1; min-height: 224px; }
  .gallery-page-content :deep(.radial-gradient-example .example-output) { grid-column: 1; grid-row: 2; width: 100%; margin: 0; align-self: stretch; }
  .gallery-page-content :deep(.radial-gradient-example .example-options) {
    grid-column: 1;
    grid-row: 3;
    width: 100%;
    border-left: 0;
    border-top: 1px solid var(--DividerStrokeColorDefaultBrush, var(--stroke-divider));
  }
}
</style>
