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
          <ControlExample x:Name="Example1" SampleDefinition="RatingControl\RatingControlSimple.txt" HeaderText="{x:Bind SimpleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SimpleXaml, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel VerticalAlignment="Top">
                <RatingControl x:Name="RatingControl1" HorizontalAlignment="Left" AutomationProperties.Name="{x:Bind SimpleName, Mode=OneWay}" Caption="{x:Bind CaptionText, Mode=OneWay}" IsClearEnabled="{x:Bind clearEnabledCheck.IsChecked.Value, Mode=OneWay}" IsReadOnly="{x:Bind readOnlyCheck.IsChecked.Value, Mode=OneWay}" ValueChanged="RatingControl1_ValueChanged" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output>
              <TextBlock FontWeight="Bold" Text="{x:Bind RatingControl1.Value, Mode=OneWay}" />
            </ControlExample.Output>
            <ControlExample.Options>
              <StackPanel Width="220">
                <CheckBox x:Name="clearEnabledCheck" Content="{x:Bind IsClearEnabledText, Mode=OneWay}" />
                <TextBlock Text="{x:Bind ClearNote, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <CheckBox x:Name="readOnlyCheck" Margin="0,12,0,0" Content="{x:Bind IsReadOnlyText, Mode=OneWay}" />
              </StackPanel>
            </ControlExample.Options>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="IsClearEnabled" Value="{x:Bind clearEnabledCheck.IsChecked, Mode=OneWay}" />
              <ControlExampleSubstitution Key="IsReadOnly" Value="{x:Bind readOnlyCheck.IsChecked, Mode=OneWay}" />
              <ControlExampleSubstitution x:Name="SampleCodeCaption" Key="Caption" Value="{x:Bind RatingControl1.Caption, Mode=OneWay}" />
            </ControlExample.Substitutions>
          </ControlExample>

          <ControlExample x:Name="Example2" SampleDefinition="RatingControl\RatingControlPlaceholder.txt" HeaderText="{x:Bind PlaceholderHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind PlaceholderXaml, Mode=OneWay}">
            <ControlExample.Example>
              <RatingControl x:Name="RatingControl2" HorizontalAlignment="Left" VerticalAlignment="Top" AutomationProperties.Name="{x:Bind PlaceholderName, Mode=OneWay}" PlaceholderValue="{x:Bind slider.Value, Mode=TwoWay}" />
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options>
              <StackPanel Width="220">
                <Slider x:Name="slider" Header="{x:Bind PlaceholderValueText, Mode=OneWay}" IsFocusEngagementEnabled="False" Maximum="5" Minimum="0" SmallChange="0.5" StepFrequency="0.5" />
              </StackPanel>
            </ControlExample.Options>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="Slider" Value="{x:Bind slider.Value, Mode=OneWay}" />
            </ControlExample.Substitutions>
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, provide, ref, shallowReactive } from 'vue'
import Button from '../../components/Button.vue'
import CheckBox from '../../components/CheckBox.vue'
import ControlExample from '../../components/ControlExample.vue'
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties'
import FontIcon from '../../components/FontIcon.vue'
import Page from '../../components/Page.vue'
import RatingControl from '../../components/Rating.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import Slider from '../../components/Slider.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import simpleSample from '../samples/RatingControl/RatingControlSimple.txt?raw'
import placeholderSample from '../samples/RatingControl/RatingControlPlaceholder.txt?raw'

const { t } = useI18n()
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'rating')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const namescope = shallowReactive({})
provide(xamlNameScopeKey, namescope)
const resource = key => computed(() => t(key))
const PageTitle = resource('text.ratingcontrol')
const PageDescription = resource('text.the-ratingcontrol-allows-users-to-view-and-set-r')
const SimpleHeader = resource('text.a-simple-ratingcontrol')
const PlaceholderHeader = resource('sample.rating.placeholder')
const SimpleName = resource('sample.rating.simple-name')
const PlaceholderName = resource('sample.rating.placeholder-name')
const IsClearEnabledText = resource('sample.rating.is-clear-enabled')
const ClearNote = resource('sample.rating.clear-note')
const IsReadOnlyText = resource('sample.rating.is-read-only')
const PlaceholderValueText = resource('sample.placeholder-value')
const captionChanged = ref(false)
const CaptionText = computed(() => t(captionChanged.value ? 'sample.rating.your-rating' : 'sample.rating.caption'))
const ThemeButtonLabel = resource('gallery.toggle-theme')
const FavoriteButtonLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'))
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const sampleXaml = source => source.split(/--- xaml\s*\r?\n/)[1]?.trim() ?? ''
const escapeXaml = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const SimpleXaml = computed(() => sampleXaml(simpleSample).replace('Simple RatingControl', escapeXaml(SimpleName.value)))
const PlaceholderXaml = computed(() => sampleXaml(placeholderSample).replace('RatingControl with placeholder', escapeXaml(PlaceholderName.value)))
const RatingControl1_ValueChanged = () => {
  captionChanged.value = true
  if (namescope.RatingControl1) namescope.RatingControl1.Caption = CaptionText.value
}

provide(xamlScopeKey, {
  PageTitle, PageDescription, SimpleHeader, PlaceholderHeader, SimpleName, PlaceholderName,
  IsClearEnabledText, ClearNote, IsReadOnlyText, PlaceholderValueText, CaptionText,
  ThemeButtonLabel, FavoriteButtonLabel, FavoriteGlyph, SimpleXaml, PlaceholderXaml,
  isFavoriteState, pageTheme, toggleTheme, toggleFavorite, RatingControl1_ValueChanged
})
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 72px 8px 0; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
</style>
