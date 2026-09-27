<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <TextBlock Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" Margin="0,0,0,16" />
        <ControlExample x:Name="Example1" HeaderText="{x:Bind Labels.Header, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SampleXaml, Mode=OneWay}">
          <ControlExample.Example>
            <Grid Width="300" Height="200" HorizontalAlignment="Center" class="backdrop-element-example">
              <SystemBackdropElement x:Name="DynamicBackdropHost" CornerRadius="8">
                <SystemBackdropElement.SystemBackdrop>
                  <DesktopAcrylicBackdrop />
                </SystemBackdropElement.SystemBackdrop>
              </SystemBackdropElement>
              <Button HorizontalAlignment="Center" VerticalAlignment="Center" Content="{x:Bind Labels.ClickMe, Mode=OneWay}" />
            </Grid>
          </ControlExample.Example>
          <ControlExample.Output>
            <TextBlock Text="{x:Bind BackdropOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" />
            <TextBlock Text="{x:Bind BackdropSupportOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          </ControlExample.Output>
          <ControlExample.Options>
            <StackPanel Spacing="12">
              <ComboBox x:Name="BackdropTypeComboBox" Header="{x:Bind Labels.BackdropType, Mode=OneWay}" SelectedIndex="0" SelectionChanged="BackdropTypeComboBox_SelectionChanged">
                <ComboBoxItem Content="{x:Bind Labels.Acrylic, Mode=OneWay}" Tag="Acrylic" />
                <ComboBoxItem Content="{x:Bind Labels.Mica, Mode=OneWay}" Tag="Mica" />
                <ComboBoxItem Content="{x:Bind Labels.MicaAlt, Mode=OneWay}" Tag="MicaAlt" />
              </ComboBox>
              <Slider x:Name="CornerRadiusSlider" Header="{x:Bind Labels.CornerRadius, Mode=OneWay}" Maximum="50" Minimum="0" StepFrequency="1" ValueChanged="CornerRadiusSlider_ValueChanged" Value="8" />
            </StackPanel>
          </ControlExample.Options>
          <ControlExample.Substitutions>
            <ControlExampleSubstitution Key="CornerRadius" Value="{x:Bind CornerRadiusSlider.Value, Mode=OneWay}" />
          </ControlExample.Substitutions>
        </ControlExample>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, provide, shallowReactive } from 'vue'
import Button from '../../components/Button.vue'
import ComboBox, { ComboBoxItem } from '../../components/ComboBox.vue'
import ControlExample from '../../components/ControlExample.vue'
import Grid from '../../components/Grid.vue'
import Page from '../../components/Page.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import Slider from '../../components/Slider.vue'
import StackPanel from '../../components/StackPanel.vue'
import SystemBackdropElement from '../../components/SystemBackdropElement.vue'
import TextBlock from '../../components/TextBlock.vue'
import { MicaBackdrop, DesktopAcrylicBackdrop as AcrylicMaterial } from '../../components/systemBackdrop'
import { DesktopAcrylicBackdrop } from '../../components/systemBackdropXaml'
import { useI18n } from '../../components/i18n/index'
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import acrylicSource from '../samples/SystemBackdropElement/SystemBackdropElementAcrylic_xaml.txt?raw'
import micaSource from '../samples/SystemBackdropElement/SystemBackdropElementMica_xaml.txt?raw'
import micaAltSource from '../samples/SystemBackdropElement/SystemBackdropElementMicaAlt_xaml.txt?raw'

const { t } = useI18n()
const currentPage = inject('currentPage')
const pageKey = computed(() => typeof currentPage === 'string' ? currentPage : currentPage?.value || 'systembackdropelement')
const { pageTheme } = createPageState(pageKey.value)
const namescope = shallowReactive({})
provide(xamlNameScopeKey, namescope)
const Labels = computed(() => ({
  Description: t('sample.systembackdropelement.description'),
  Header: t('sample.systembackdropelement.header'),
  ClickMe: t('sample.systembackdropelement.click-me'),
  BackdropType: t('sample.systembackdropelement.backdrop-type'),
  CornerRadius: t('sample.systembackdropelement.corner-radius'),
  Acrylic: t('sample.systembackdropelement.acrylic'),
  Mica: t('sample.systembackdropelement.mica'),
  MicaAlt: t('sample.systembackdropelement.mica-alt')
}))
const SelectedBackdrop = computed(() => {
  const type = namescope.DynamicBackdropHost?.SystemBackdrop?.Type
  if (type === 'Mica') return namescope.DynamicBackdropHost.SystemBackdrop.Kind === 'BaseAlt' ? 'MicaAlt' : 'Mica'
  return 'Acrylic'
})
const SampleXaml = computed(() => SelectedBackdrop.value === 'Mica'
  ? micaSource : SelectedBackdrop.value === 'MicaAlt' ? micaAltSource : acrylicSource)
const BackdropOutput = computed(() => t('sample.systembackdropelement.state', {
  backdrop: Labels.value[SelectedBackdrop.value],
  radius: namescope.DynamicBackdropHost?.CornerRadius ?? 8
}))
const BackdropSupportOutput = computed(() => {
  const state = namescope.DynamicBackdropHost?.State
  if (!state) return ''
  if (state.Reason === 'NativeBackdropUnavailable') return t('sample.systembackdrops.native-unavailable')
  if (state.Status === 'HighContrast') return t('sample.systembackdrops.high-contrast')
  if (state.Status === 'Fallback') return t(state.Reason === 'Inactive'
    ? 'sample.systembackdrops.inactive' : 'sample.systembackdrops.effect-unavailable')
  return t('sample.systembackdropelement.native')
})
const BackdropTypeComboBox_SelectionChanged = sender => {
  if (!namescope.DynamicBackdropHost) return
  const selected = sender?.SelectedItem?.Tag
  if (selected === 'Mica' || selected === 'MicaAlt') {
    const mica = new MicaBackdrop()
    mica.Kind = selected === 'MicaAlt' ? 'BaseAlt' : 'Base'
    namescope.DynamicBackdropHost.SystemBackdrop = mica
  } else namescope.DynamicBackdropHost.SystemBackdrop = new AcrylicMaterial()
}
const CornerRadiusSlider_ValueChanged = (sender, args) => {
  if (namescope.DynamicBackdropHost) namescope.DynamicBackdropHost.CornerRadius = Number(args?.NewValue ?? sender?.Value ?? 8)
}
provide(xamlScopeKey, { Labels, pageTheme, SampleXaml, BackdropOutput, BackdropSupportOutput,
  BackdropTypeComboBox_SelectionChanged, CornerRadiusSlider_ValueChanged })
</script>

<style scoped>
.gallery-item-page { min-width: 0; }
.backdrop-element-example { max-width: 100%; }
:deep(.example-container) { grid-template-columns: minmax(324px, 1fr) minmax(0, 240px) minmax(0, 240px); }
@media (max-width: 1199px) {
  :deep(.example-container) { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto auto auto; }
  :deep(.example-display) { grid-column: 1; grid-row: 1; }
  :deep(.example-output) { grid-column: 1; grid-row: 2; width: calc(100% - 24px); max-width: none; margin: 12px; justify-self: stretch; }
  :deep(.example-options) { grid-column: 1; grid-row: 3; width: 100%; max-width: none; margin: 0; border-left: 0; border-top: 1px solid var(--DividerStrokeColorDefaultBrush); border-radius: 0; }
}
</style>
