<template>
  <Page>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <StackPanel class="gallery-item-page">
      <StackPanel class="page-heading">
        <TextBlock class="page-header" FontSize="28" FontWeight="SemiBold" Text="{x:Bind PageTitle, Mode=OneWay}" />
        <TextBlock class="page-description" Text="{x:Bind PageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <StackPanel class="page-header-actions" Orientation="Horizontal">
          <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind ThemeButtonLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind ThemeButtonLabel, Mode=OneWay}">
            <TextBlock class="icon" Text="&#xE793;" />
          </Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind FavoriteButtonLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind FavoriteButtonLabel, Mode=OneWay}">
            <TextBlock class="icon" Text="{x:Bind FavoriteGlyph, Mode=OneWay}" />
          </ToggleButton>
        </StackPanel>
      </StackPanel>

      <StackPanel class="gallery-page-content">
        <ControlExample SampleDefinition="ProgressRing\IndeterminateProgressRing.txt" HeaderText="{x:Bind IndeterminateHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind IndeterminateXaml, Mode=OneWay}">
          <ControlExample.Example>
            <ProgressRing x:Name="ProgressRing1" Width="60" Height="60" Margin="10,10,0,0" VerticalAlignment="Top" AutomationProperties.Name="{x:Bind ProgressImageLabel, Mode=OneWay}" IsActive="{x:Bind ProgressToggle.IsOn, Mode=OneWay}" />
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options>
            <StackPanel>
              <ToggleSwitch x:Name="ProgressToggle" AutomationProperties.Name="{x:Bind ProgressOptionsLabel, Mode=OneWay}" Header="{x:Bind ProgressOptionsLabel, Mode=OneWay}" IsOn="True" OffContent="{x:Bind DoWorkLabel, Mode=OneWay}" OnContent="{x:Bind WorkingLabel, Mode=OneWay}" />
              <ComboBox x:Name="BackgroundComboBox1" Width="200" Header="{x:Bind BackgroundColorLabel, Mode=OneWay}" PlaceholderText="{x:Bind PickColorLabel, Mode=OneWay}" SelectionChanged="Background_SelectionChanged">
                <x:String x:Uid="sample.progressring.transparent" />
                <x:String x:Uid="sample.progressring.lightgray" />
              </ComboBox>
            </StackPanel>
          </ControlExample.Options>
          <ControlExample.Substitutions>
            <ControlExampleSubstitution Key="IsActive" Value="{x:Bind ProgressToggle.IsOn, Mode=OneWay}" />
            <ControlExampleSubstitution x:Name="RevealBackgroundProperty1" Key="Background" Value="Background=&quot;LightGray&quot;" IsEnabled="False" />
          </ControlExample.Substitutions>
        </ControlExample>

        <ControlExample SampleDefinition="ProgressRing\DeterminateProgressRing.txt" HeaderText="{x:Bind DeterminateHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind DeterminateXaml, Mode=OneWay}">
          <ControlExample.Example>
            <ScrollViewer HorizontalScrollMode="Auto" HorizontalScrollBarVisibility="Auto" VerticalScrollMode="Disabled" VerticalScrollBarVisibility="Disabled">
            <StackPanel x:Name="Control2" class="determinate-example" Orientation="Horizontal">
              <ProgressRing x:Name="ProgressRing2" Width="60" Height="60" Margin="0,0,60,0" AutomationProperties.Name="{x:Bind ProgressImageLabel, Mode=OneWay}" IsIndeterminate="False" />
              <NumberBox x:Name="ProgressValue" MinWidth="120" VerticalAlignment="Center" AutomationProperties.Name="{x:Bind ProgressAmountLabel, Mode=OneWay}" Header="{x:Bind ProgressLabel, Mode=OneWay}" Maximum="100" Minimum="0" SpinButtonPlacementMode="Inline" ValueChanged="ProgressValue_ValueChanged" Value="0" />
            </StackPanel>
            </ScrollViewer>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options>
            <StackPanel>
              <ComboBox x:Name="BackgroundComboBox2" Width="200" Header="{x:Bind BackgroundColorLabel, Mode=OneWay}" PlaceholderText="{x:Bind PickColorLabel, Mode=OneWay}" SelectionChanged="Background_SelectionChanged">
                <x:String x:Uid="sample.progressring.transparent" />
                <x:String x:Uid="sample.progressring.lightgray" />
              </ComboBox>
            </StackPanel>
          </ControlExample.Options>
          <ControlExample.Substitutions>
            <ControlExampleSubstitution Key="DeterminateProgressValue" Value="{x:Bind ProgressRing2.Value, Mode=OneWay}" />
            <ControlExampleSubstitution x:Name="RevealBackgroundProperty2" Key="Background" Value="Background=&quot;LightGray&quot;" IsEnabled="False" />
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
import ComboBox, { XamlString } from '../../components/ComboBox.vue'
import ControlExample from '../../components/ControlExample.vue'
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties'
import NumberBox from '../../components/NumberBox.vue'
import Page from '../../components/Page.vue'
import ProgressRing from '../../components/ProgressRing.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import ToggleSwitch from '../../components/ToggleSwitch.vue'
import { useI18n } from '../../components/i18n/index'
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import indeterminateSample from '../samples/ProgressRing/IndeterminateProgressRing.txt?raw'
import determinateSample from '../samples/ProgressRing/DeterminateProgressRing.txt?raw'

defineOptions({ components: { 'x:String': XamlString } })

const { t } = useI18n()
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'progressring')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const namescope = shallowReactive({})
provide(xamlNameScopeKey, namescope)

const resource = key => computed(() => t(key))
const PageTitle = resource('text.progressring')
const PageDescription = resource('text.progressring-description')
const IndeterminateHeader = resource('sample.progressring.indeterminate')
const DeterminateHeader = resource('sample.progressring.determinate')
const ProgressImageLabel = resource('sample.progressring.progress-image')
const ProgressAmountLabel = resource('sample.progressring.progress-amount')
const ProgressOptionsLabel = resource('sample.progressring.progress-options')
const WorkingLabel = resource('sample.progressring.working')
const DoWorkLabel = resource('sample.progressring.do-work')
const BackgroundColorLabel = resource('sample.progressring.background-color')
const PickColorLabel = resource('sample.progressring.pick-color')
const ProgressLabel = resource('sample.progressring.progress')
const ThemeButtonLabel = resource('gallery.toggle-theme')
const FavoriteButtonLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'))
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const sampleXaml = source => source.split(/--- xaml\s*\r?\n/)[1]?.trim() ?? ''
const IndeterminateXaml = sampleXaml(indeterminateSample)
const DeterminateXaml = sampleXaml(determinateSample)

const ProgressValue_ValueChanged = (sender, args) => {
  if (!Number.isNaN(sender.Value)) namescope.ProgressRing2.Value = sender.Value
  else sender.Value = 0
}

const Background_SelectionChanged = (sender, args) => {
  if (!args.AddedItems.length) return
  const first = sender === namescope.BackgroundComboBox1
  const progressRing = first ? namescope.ProgressRing1 : namescope.ProgressRing2
  const revealBackgroundProperty = first ? namescope.RevealBackgroundProperty1 : namescope.RevealBackgroundProperty2
  // x:Uid localizes Gallery's inline x:String items; the brush keeps its
  // official color value independently of the visible language.
  const colorName = ['Transparent', 'LightGray'][sender.SelectedIndex]
  if (colorName === undefined) return
  progressRing.Background = colorName
  revealBackgroundProperty.IsEnabled = colorName === 'LightGray'
}

provide(xamlScopeKey, {
  PageTitle, PageDescription, IndeterminateHeader, DeterminateHeader,
  ProgressImageLabel, ProgressAmountLabel, ProgressOptionsLabel, WorkingLabel,
  DoWorkLabel, BackgroundColorLabel, PickColorLabel, ProgressLabel,
  ThemeButtonLabel, FavoriteButtonLabel, FavoriteGlyph,
  IndeterminateXaml, DeterminateXaml,
  isFavoriteState, pageTheme, toggleTheme, toggleFavorite,
  ProgressValue_ValueChanged, Background_SelectionChanged
})
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 72px 8px 0; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
.determinate-example { min-width: 0; }
</style>
