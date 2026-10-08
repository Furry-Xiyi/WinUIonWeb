<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind PageTitle, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind PageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind ThemeButtonLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind ThemeButtonLabel, Mode=OneWay}">
              <FontIcon Glyph="&#xE793;" />
            </Button>
            <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind FavoriteButtonLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind FavoriteButtonLabel, Mode=OneWay}">
              <FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" />
            </ToggleButton>
          </StackPanel>
        </StackPanel>

        <StackPanel class="gallery-page-content">
          <ControlExample x:Name="Example1" SampleDefinition="Slider\SliderSimple.txt" HeaderText="{x:Bind SimpleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SimpleXaml, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel Orientation="Horizontal">
                <Slider x:Name="Slider1" Width="200" AutomationProperties.Name="{x:Bind SimpleName, Mode=OneWay}" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output>
              <TextBlock Text="{x:Bind Slider1.Value.ToString(), Mode=OneWay}" />
            </ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>

          <ControlExample x:Name="Example2" SampleDefinition="Slider\SliderRange.txt" HeaderText="{x:Bind RangeHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind RangeXaml, Mode=OneWay}">
            <ControlExample.Options>
              <Grid>
                <Grid.RowDefinitions>
                  <RowDefinition />
                  <RowDefinition />
                  <RowDefinition />
                  <RowDefinition />
                  <RowDefinition />
                </Grid.RowDefinitions>
                <Grid.ColumnDefinitions>
                  <ColumnDefinition Width="Auto" />
                  <ColumnDefinition Width="Auto" MinWidth="80" />
                </Grid.ColumnDefinitions>
                <TextBlock x:Name="MinimumLabel" Grid.Row="0" Grid.Column="0" Margin="0,0,0,0" Text="{x:Bind MinimumText, Mode=OneWay}" />
                <NumberBox x:Name="MinimumValue" Grid.Row="0" Grid.Column="1" Margin="10,-5,0,0" AutomationProperties.AccessibilityView="Raw" AutomationProperties.Name="{x:Bind MinimumName, Mode=OneWay}" SpinButtonPlacementMode="Compact" Value="500" />
                <TextBlock x:Name="MaximumLabel" Grid.Row="1" Grid.Column="0" Margin="0,7,0,0" Text="{x:Bind MaximumText, Mode=OneWay}" />
                <NumberBox x:Name="MaximumValue" Grid.Row="1" Grid.Column="1" Margin="10,5,0,0" AutomationProperties.AccessibilityView="Raw" AutomationProperties.Name="{x:Bind MaximumName, Mode=OneWay}" SpinButtonPlacementMode="Compact" Value="1000" />
                <TextBlock x:Name="StepFrequencyLabel" Grid.Row="2" Grid.Column="0" Margin="0,5,0,0" Text="{x:Bind StepFrequencyText, Mode=OneWay}" />
                <NumberBox x:Name="StepFrequencyValue" Grid.Row="2" Grid.Column="1" Margin="10,5,0,0" AutomationProperties.AccessibilityView="Raw" AutomationProperties.Name="{x:Bind StepFrequencyName, Mode=OneWay}" Minimum="1" SpinButtonPlacementMode="Compact" Value="10" />
                <TextBlock x:Name="SmallChangeLabel" Grid.Row="3" Grid.Column="0" Margin="0,5,0,0" Text="{x:Bind SmallChangeText, Mode=OneWay}" />
                <NumberBox x:Name="SmallChangeValue" Grid.Row="3" Grid.Column="1" Margin="10,5,0,0" AutomationProperties.AccessibilityView="Raw" AutomationProperties.Name="{x:Bind SmallChangeName, Mode=OneWay}" SpinButtonPlacementMode="Compact" Value="10" />
              </Grid>
            </ControlExample.Options>
            <ControlExample.Example>
              <StackPanel x:Name="Control2" VerticalAlignment="Center" Orientation="Horizontal">
                <Slider x:Name="Slider2" Width="200" Margin="0,0,10,0" Header="{x:Bind ControlHeader, Mode=OneWay}" Maximum="{x:Bind MaximumValue.Value, Mode=OneWay}" Minimum="{x:Bind MinimumValue.Value, Mode=OneWay}" SmallChange="{x:Bind SmallChangeValue.Value, Mode=OneWay}" StepFrequency="{x:Bind StepFrequencyValue.Value, Mode=OneWay}" Value="800" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output>
              <TextBlock Text="{x:Bind Slider2.Value.ToString(), Mode=OneWay}" />
            </ControlExample.Output>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="MinimumValue" Value="{x:Bind MinimumValue.Value, Mode=OneWay}" />
              <ControlExampleSubstitution Key="MaximumValue" Value="{x:Bind MaximumValue.Value, Mode=OneWay}" />
              <ControlExampleSubstitution Key="StepFrequencyValue" Value="{x:Bind StepFrequencyValue.Value, Mode=OneWay}" />
              <ControlExampleSubstitution Key="SmallChangeValue" Value="{x:Bind SmallChangeValue.Value, Mode=OneWay}" />
              <ControlExampleSubstitution Key="Value" Value="{x:Bind Slider2.Value, Mode=OneWay}" />
            </ControlExample.Substitutions>
          </ControlExample>

          <ControlExample x:Name="Example3" SampleDefinition="Slider\SliderTicks.txt" HeaderText="{x:Bind TicksHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind TicksXaml, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel Orientation="Horizontal">
                <Slider x:Name="Slider3" Width="290" AutomationProperties.Name="{x:Bind TicksName, Mode=OneWay}" TickFrequency="20" TickPlacement="Outside" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output>
              <TextBlock Text="{x:Bind Slider3.Value.ToString(), Mode=OneWay}" />
            </ControlExample.Output>
            <ControlExample.Options>
              <StackPanel>
                <RadioButtons x:Name="SnapsToRadioButtons" Header="{x:Bind SnapsToText, Mode=OneWay}" SelectedIndex="0" SelectionChanged="SnapsToRadioButtons_SelectionChanged">
                  <x:String>StepValues</x:String>
                  <x:String>Ticks</x:String>
                </RadioButtons>
              </StackPanel>
            </ControlExample.Options>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="SnapsTo" Value="{x:Bind SnapsToRadioButtons.SelectedItem, Mode=OneWay}" />
            </ControlExample.Substitutions>
          </ControlExample>

          <ControlExample x:Name="Example4" SampleDefinition="Slider\SliderVertical.txt" HeaderText="{x:Bind VerticalHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind VerticalXaml, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel Orientation="Horizontal">
                <Slider x:Name="Slider4" Width="100" Height="100" AutomationProperties.Name="{x:Bind VerticalName, Mode=OneWay}" Maximum="50" Minimum="-50" Orientation="Vertical" TickFrequency="10" TickPlacement="Outside" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output>
              <TextBlock Text="{x:Bind Slider4.Value.ToString(), Mode=OneWay}" />
            </ControlExample.Output>
            <ControlExample.Options />
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
import { XamlString } from '../../components/inlineControlProperties'
import ControlExample from '../../components/ControlExample.vue'
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties'
import FontIcon from '../../components/FontIcon.vue'
import Grid from '../../components/Grid.vue'
import NumberBox from '../../components/NumberBox.vue'
import Page from '../../components/Page.vue'
import RadioButtons from '../../components/RadioButtons.vue'
import RowDefinition from '../../components/RowDefinition.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import Slider from '../../components/Slider.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import simpleSample from '../samples/Slider/SliderSimple.txt?raw'
import rangeSample from '../samples/Slider/SliderRange.txt?raw'
import ticksSample from '../samples/Slider/SliderTicks.txt?raw'
import verticalSample from '../samples/Slider/SliderVertical.txt?raw'

defineOptions({ components: { 'x:String': XamlString } })
const { t } = useI18n()
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'slider')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const namescope = shallowReactive({})
provide(xamlNameScopeKey, namescope)

const resource = key => computed(() => t(key))
const PageTitle = resource('text.slider')
const PageDescription = resource('text.use-a-slider-to-let-users-set-a-value-by-moving')
const SimpleHeader = resource('text.a-simple-slider')
const RangeHeader = resource('sample.slider.range')
const TicksHeader = resource('sample.slider.ticks')
const VerticalHeader = resource('sample.slider.vertical')
const ControlHeader = resource('sample.slider.control-header')
const MinimumText = resource('sample.slider.minimum')
const MaximumText = resource('sample.slider.maximum')
const StepFrequencyText = resource('sample.slider.step-frequency')
const SmallChangeText = resource('sample.slider.small-change')
const SnapsToText = resource('sample.slider.snaps-to')
const SimpleName = resource('sample.slider.simple-name')
const TicksName = resource('sample.slider.ticks-name')
const VerticalName = resource('sample.slider.vertical-name')
const MinimumName = resource('sample.slider.minimum-name')
const MaximumName = resource('sample.slider.maximum-name')
const StepFrequencyName = resource('sample.slider.step-frequency-name')
const SmallChangeName = resource('sample.slider.small-change-name')
const ThemeButtonLabel = resource('gallery.toggle-theme')
const FavoriteButtonLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'))
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const sampleXaml = source => source.split(/--- xaml\s*\r?\n/)[1]?.trim() ?? ''
const escapeXaml = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const SimpleXaml = computed(() => sampleXaml(simpleSample).replace('simple slider', escapeXaml(SimpleName.value)))
const RangeXaml = sampleXaml(rangeSample)
const TicksXaml = computed(() => sampleXaml(ticksSample).replace('Slider with ticks', escapeXaml(TicksName.value)))
const VerticalXaml = computed(() => sampleXaml(verticalSample).replace('vertical slider', escapeXaml(VerticalName.value)))
const SnapsToRadioButtons_SelectionChanged = () => {
  if (namescope.Slider3) namescope.Slider3.SnapsTo = namescope.SnapsToRadioButtons?.SelectedItem === 'StepValues' ? 'StepValues' : 'Ticks'
}

provide(xamlScopeKey, {
  PageTitle, PageDescription, SimpleHeader, RangeHeader, TicksHeader, VerticalHeader,
  ControlHeader, MinimumText, MaximumText, StepFrequencyText, SmallChangeText, SnapsToText,
  SimpleName, TicksName, VerticalName, MinimumName, MaximumName, StepFrequencyName, SmallChangeName,
  ThemeButtonLabel, FavoriteButtonLabel, FavoriteGlyph, SimpleXaml, RangeXaml, TicksXaml, VerticalXaml,
  isFavoriteState, pageTheme, toggleTheme, toggleFavorite, SnapsToRadioButtons_SelectionChanged
})
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 72px 8px 0; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
</style>
