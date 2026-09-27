<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" AutomationProperties.Name="{x:Bind themeButtonName, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind themeButtonName, Mode=OneWay}" Click="toggleTheme">
              <TextBlock class="icon" Text="&#xE793;" />
            </Button>
            <ToggleButton class="header-action" AutomationProperties.Name="{x:Bind favoriteButtonName, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind favoriteButtonName, Mode=OneWay}" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite">
              <TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" />
            </ToggleButton>
          </StackPanel>
        </StackPanel>

        <StackPanel class="gallery-page-content">
          <ControlExample class="popup-example" SampleDefinition="Popup\PopupOffsetPositioning.txt" HeaderText="{x:Bind sampleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind popupXaml, Mode=OneWay}" CSharp="{x:Bind popupCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <Grid x:Name="Output" HorizontalAlignment="Left" VerticalAlignment="Top">
                <Button Click="ShowPopupOffsetClicked" Content="{x:Bind sampleText.Show, Mode=OneWay}" />
                <Popup
                  x:Name="StandardPopup"
                  Closed="PopupClosed"
                  HorizontalOffset="{x:Bind HorizontalOffset.Value, Mode=OneWay}"
                  IsLightDismissEnabled="{x:Bind IsLightDismissEnabledToggleSwitch.IsOn, Mode=OneWay}"
                  VerticalOffset="{x:Bind VerticalOffset.Value, Mode=OneWay}">
                  <Grid
                    MinWidth="240"
                    Padding="16"
                    Background="{ThemeResource AcrylicBackgroundFillColorDefaultBrush}"
                    BorderBrush="{ThemeResource SurfaceStrokeColorDefaultBrush}"
                    BorderThickness="1"
                    CornerRadius="{StaticResource OverlayCornerRadius}">
                    <StackPanel Spacing="8">
                      <TextBlock FontSize="16" Text="{x:Bind sampleText.Simple, Mode=OneWay}" />
                      <Button Click="ClosePopupClicked" Content="{x:Bind sampleText.Close, Mode=OneWay}" />
                    </StackPanel>
                  </Grid>
                </Popup>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options>
              <StackPanel Spacing="8">
                <ToggleSwitch
                  x:Name="IsLightDismissEnabledToggleSwitch"
                  Header="{x:Bind sampleText.LightDismiss, Mode=OneWay}"
                  IsOn="True"
                  OffContent="{x:Bind sampleText.False, Mode=OneWay}"
                  OnContent="{x:Bind sampleText.True, Mode=OneWay}" />
                <NumberBox
                  x:Name="VerticalOffset"
                  Header="{x:Bind sampleText.VerticalOffset, Mode=OneWay}"
                  LargeChange="100"
                  Maximum="100"
                  Minimum="-100"
                  SmallChange="10"
                  SpinButtonPlacementMode="Inline"
                  Value="0" />
                <NumberBox
                  x:Name="HorizontalOffset"
                  Header="{x:Bind sampleText.HorizontalOffset, Mode=OneWay}"
                  LargeChange="100"
                  Maximum="500"
                  Minimum="-100"
                  SmallChange="10"
                  SpinButtonPlacementMode="Inline"
                  Value="200" />
              </StackPanel>
            </ControlExample.Options>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="VerticalOffset" Value="{x:Bind VerticalOffset.Value, Mode=OneWay}" />
              <ControlExampleSubstitution Key="HorizontalOffset" Value="{x:Bind HorizontalOffset.Value, Mode=OneWay}" />
              <ControlExampleSubstitution Key="IsLightDismissEnabled" Value="{x:Bind IsLightDismissEnabledToggleSwitch.IsOn, Mode=OneWay}" />
            </ControlExample.Substitutions>
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed, inject, provide, shallowReactive } from 'vue'
import Button from '../../components/Button.vue'
import ControlExample from '../../components/ControlExample.vue'
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties'
import Grid from '../../components/Grid.vue'
import NumberBox from '../../components/NumberBox.vue'
import Page from '../../components/Page.vue'
import Popup from '../../components/Popup.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import ToggleSwitch from '../../components/ToggleSwitch.vue'
import { useI18n } from '../../components/i18n/index'
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import popupSampleDefinition from '../samples/Popup/PopupOffsetPositioning.txt?raw'

const { t } = useI18n()
const currentPage = inject<{ value?: string }>('currentPage')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'popup')
const pageTitle = computed(() => t('text.popup'))
const pageDescription = computed(() => t('sample.popup.description'))
const sampleHeader = computed(() => t('text.popup-with-offset-positioning'))
const themeButtonName = computed(() => t('gallery.toggle-theme'))
const favoriteButtonName = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'))
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const sampleText = computed(() => ({
  Show: t('text.show-popup-using-offset'),
  Simple: t('sample.popup.simple'),
  Close: t('sample.popup.close'),
  LightDismiss: t('sample.popup.light-dismiss'),
  VerticalOffset: t('sample.popup.vertical-offset'),
  HorizontalOffset: t('sample.popup.horizontal-offset'),
  True: t('sample.true'), False: t('sample.false')
}))

type NamedControl = { IsOpen?: boolean; IsOn?: boolean; IsEnabled?: boolean; Value?: number }
const names = shallowReactive<Record<string, NamedControl>>({})
provide(xamlNameScopeKey, names)
const ShowPopupOffsetClicked = () => {
  if (names.StandardPopup && !names.StandardPopup.IsOpen) names.StandardPopup.IsOpen = true
  if (names.IsLightDismissEnabledToggleSwitch) names.IsLightDismissEnabledToggleSwitch.IsEnabled = false
}
const ClosePopupClicked = () => {
  if (names.StandardPopup?.IsOpen) names.StandardPopup.IsOpen = false
  if (names.IsLightDismissEnabledToggleSwitch) names.IsLightDismissEnabledToggleSwitch.IsEnabled = true
}
const PopupClosed = () => {
  if (names.IsLightDismissEnabledToggleSwitch) names.IsLightDismissEnabledToggleSwitch.IsEnabled = true
}
const escapeAttribute = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const sampleSections: Record<string, string> = {}
let section = ''
for (const line of popupSampleDefinition.split(/\r?\n/)) {
  const marker = line.match(/^--- (header|xaml|c#)$/)
  if (marker) { section = marker[1]; sampleSections[section] = ''; continue }
  if (section) sampleSections[section] += `${line}\n`
}
const popupXaml = computed(() => {
  const substitutions: Record<string, string> = {
    VerticalOffset: String(names.VerticalOffset?.Value ?? 0),
    HorizontalOffset: String(names.HorizontalOffset?.Value ?? 200),
    IsLightDismissEnabled: names.IsLightDismissEnabledToggleSwitch?.IsOn === false ? 'False' : 'True'
  }
  return sampleSections.xaml.trim()
    .replace(/\$\((\w+)\)/g, (_match, key: string) => substitutions[key] ?? '')
    .replace('Content="Show Popup (using Offset)"', `Content="${escapeAttribute(sampleText.value.Show)}"`)
    .replace('Text="Simple Popup"', `Text="${escapeAttribute(sampleText.value.Simple)}"`)
    .replace('Content="Close"', `Content="${escapeAttribute(sampleText.value.Close)}"`)
})
const popupCSharp = sampleSections['c#'].trim()
provide(xamlScopeKey, {
  pageTitle, pageDescription, sampleHeader, sampleText,
  themeButtonName, favoriteButtonName, favoriteGlyph,
  isFavoriteState, pageTheme, toggleTheme, toggleFavorite,
  popupXaml, popupCSharp,
  ShowPopupOffsetClicked, ClosePopupClicked, PopupClosed
})
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 80px 8px 0; color: var(--text-primary); overflow-wrap: anywhere; }
.page-description { margin: 0 0 16px; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif; font-size: 16px; }
</style>
