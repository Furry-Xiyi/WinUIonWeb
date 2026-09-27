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
          <ControlExample x:Name="Example3" SampleDefinition="ThemeShadow\ThemeshadowAppliedBorder.txt" HeaderText="{x:Bind SampleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SampleXaml, Mode=OneWay}" CSharp="{x:Bind SampleCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <Grid x:Name="Example3Grid" Padding="36">
                <Grid x:Name="ShadowCastGrid" />
                <Border x:Name="ShadowRect" Width="200" Height="200" Background="{ThemeResource CardBackgroundFillColorDefaultBrush}" CornerRadius="{ThemeResource OverlayCornerRadius}" Loaded="ShadowRect_Loaded">
                  <Border.Shadow>
                    <ThemeShadow x:Name="shadow" />
                  </Border.Shadow>
                </Border>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output>
              <StackPanel>
                <TextBlock Text="{x:Bind TranslationOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <TextBlock Text="{x:Bind ReceiversOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" />
              </StackPanel>
            </ControlExample.Output>
            <ControlExample.Options>
              <Slider x:Name="TranslationSliderInApp" Width="200" HorizontalAlignment="Left" AutomationProperties.Name="{x:Bind ShadowIntensityName, Mode=OneWay}" Header="{x:Bind TranslationHeader, Mode=OneWay}" IsFocusEngagementEnabled="False" Maximum="64" Minimum="0" SmallChange="1" StepFrequency="1" ValueChanged="TranslationSliderInApp_ValueChanged" Value="32" />
            </ControlExample.Options>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="TranslationSlider" Value="{x:Bind TranslationSliderInApp.Value, Mode=OneWay}" />
            </ControlExample.Substitutions>
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, provide, shallowReactive } from 'vue'
import Border from '../../components/Border.vue'
import Button from '../../components/Button.vue'
import ControlExample from '../../components/ControlExample.vue'
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties'
import FontIcon from '../../components/FontIcon.vue'
import Grid from '../../components/Grid.vue'
import Page from '../../components/Page.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import Slider from '../../components/Slider.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ThemeShadow from '../../components/ThemeShadow.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import sample from '../samples/ThemeShadow/ThemeshadowAppliedBorder.txt?raw'

const { t } = useI18n()
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'themeshadow')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const namescope = shallowReactive({})
provide(xamlNameScopeKey, namescope)
const resource = key => computed(() => t(key))
const PageTitle = resource('text.theme-shadow')
const PageDescription = resource('text.theme-shadow-description')
const SampleHeader = resource('sample.themeshadow.applied-border')
const ShadowIntensityName = resource('sample.themeshadow.shadow-intensity')
const TranslationHeader = resource('sample.themeshadow.z-translation')
const ThemeButtonLabel = resource('gallery.toggle-theme')
const FavoriteButtonLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'))
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const SampleXaml = sample.split(/--- xaml\s*\r?\n/)[1]?.split(/--- c#\s*\r?\n/)[0]?.trim()
  ?? ''
const SampleCSharp = sample.split(/--- c#\s*\r?\n/)[1]?.trim() ?? ''
const TranslationOutput = computed(() => {
  const vector = namescope.ShadowRect?.Translation ?? { X: 0, Y: 0, Z: 0 }
  return t('sample.themeshadow.translation-output', { x: vector.X, y: vector.Y, z: vector.Z })
})
const ReceiversOutput = computed(() => t('sample.themeshadow.receivers-output', {
  count: namescope.shadow?.Receivers.Count ?? 0
}))
const TranslationSliderInApp_ValueChanged = (sender, args) => {
  if (namescope.ShadowRect) namescope.ShadowRect.Translation = { X: 0, Y: 0, Z: Number(args?.NewValue ?? sender?.Value ?? 32) }
}
const ShadowRect_Loaded = () => {
  namescope.shadow?.Receivers.Add(namescope.ShadowCastGrid)
  if (namescope.ShadowRect && namescope.TranslationSliderInApp) {
    namescope.ShadowRect.Translation = { X: 0, Y: 0, Z: Number(namescope.TranslationSliderInApp.Value) }
  }
}
onBeforeUnmount(() => {
  if (namescope.shadow && namescope.ShadowCastGrid) namescope.shadow.Receivers.Remove(namescope.ShadowCastGrid)
})

provide(xamlScopeKey, {
  PageTitle, PageDescription, SampleHeader, ShadowIntensityName, TranslationHeader,
  ThemeButtonLabel, FavoriteButtonLabel, FavoriteGlyph, SampleXaml, SampleCSharp, TranslationOutput, ReceiversOutput,
  isFavoriteState, pageTheme, toggleTheme, toggleFavorite,
  TranslationSliderInApp_ValueChanged, ShadowRect_Loaded
})
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 72px 8px 0; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.gallery-page-content :deep(.example-container) { grid-template-columns: minmax(272px, 1fr) 252px 252px; }
.gallery-page-content :deep(.example-output) { width: 240px; max-width: 240px; }
.gallery-page-content :deep(.example-options) { width: 252px; max-width: 252px; }
@media (max-width: 1199px) {
  .gallery-page-content :deep(.example-container) { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto auto auto; }
  .gallery-page-content :deep(.example-display) { grid-column: 1; grid-row: 1; min-height: 272px; }
  .gallery-page-content :deep(.example-output) { grid-column: 1; grid-row: 2; width: calc(100% - 24px); max-width: none; margin: 12px; }
  .gallery-page-content :deep(.example-options) { grid-column: 1; grid-row: 3; width: 100%; max-width: none; margin: 0; border-left: 0; border-top: 1px solid var(--DividerStrokeColorDefaultBrush, var(--stroke-divider)); }
}
</style>
