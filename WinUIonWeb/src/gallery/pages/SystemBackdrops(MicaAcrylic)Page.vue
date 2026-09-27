<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto" HorizontalScrollBarVisibility="Disabled" HorizontalScrollMode="Disabled">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind Labels.title, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind Labels.description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal" Spacing="4">
            <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind Labels.toggleTheme, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind Labels.toggleTheme, Mode=OneWay}"><FontIcon Glyph="&#xE793;" FontSize="16" /></Button>
            <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" /></ToggleButton>
          </StackPanel>
        </StackPanel>
        <StackPanel class="gallery-page-content">
          <ControlExample SampleDefinition="SystemBackdrops\SystemBackdropsBackdropTypes.txt" HeaderText="{x:Bind Labels.typesHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind backdropTypesXaml, Mode=OneWay}" CSharp="{x:Bind backdropTypesCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel class="system-backdrop-example">
                <TextBlock TextWrapping="WrapWholeWords">
                  <Run Text="{x:Bind Labels.typesIntro, Mode=OneWay}" /><LineBreak />
                  <Run FontWeight="Bold" Text="{x:Bind Labels.micaName, Mode=OneWay}" /><Run Text="{x:Bind Labels.micaDescription, Mode=OneWay}" /><LineBreak />
                  <Run FontWeight="Bold" Text="{x:Bind Labels.micaAltName, Mode=OneWay}" /><Run Text="{x:Bind Labels.micaAltDescription, Mode=OneWay}" /><LineBreak />
                  <Run FontWeight="Bold" Text="{x:Bind Labels.acrylicName, Mode=OneWay}" /><Run Text="{x:Bind Labels.acrylicDescription, Mode=OneWay}" /><LineBreak />
                  <Run FontWeight="Bold" Text="{x:Bind Labels.acrylicThinName, Mode=OneWay}" /><Run Text="{x:Bind Labels.acrylicThinDescription, Mode=OneWay}" /><LineBreak /><LineBreak />
                  <Run FontWeight="Bold" Text="{x:Bind Labels.comparisonTitle, Mode=OneWay}" /><Run Text="{x:Bind Labels.comparisonDescription, Mode=OneWay}" /><LineBreak /><LineBreak />
                  <Run Text="{x:Bind Labels.apiIntro, Mode=OneWay}" /><LineBreak />
                  <Run FontWeight="Bold" Text="{x:Bind Labels.apiSystemName, Mode=OneWay}" /><Run Text="{x:Bind Labels.apiSystemDescription, Mode=OneWay}" /><LineBreak />
                  <Run FontWeight="Bold" Text="{x:Bind Labels.apiMicaName, Mode=OneWay}" /><Run Text="{x:Bind Labels.apiMicaDescription, Mode=OneWay}" /><LineBreak />
                  <Run FontWeight="Bold" Text="{x:Bind Labels.apiAcrylicName, Mode=OneWay}" /><Run Text="{x:Bind Labels.apiAcrylicDescription, Mode=OneWay}" /><LineBreak /><LineBreak />
                  <Run Text="{x:Bind Labels.requirements, Mode=OneWay}" />
                </TextBlock>
                <Button Margin="0,10,0,0" HorizontalAlignment="Left" Click="createBuiltInWindow_Click" Content="{x:Bind Labels.showWindow, Mode=OneWay}" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind BuiltInOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>
          <ControlExample SampleDefinition="SystemBackdrops\SystemBackdropsMicacontroller.txt" HeaderText="{x:Bind Labels.micaHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" CSharp="{x:Bind micaControllerCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel class="system-backdrop-example">
                <TextBlock TextWrapping="WrapWholeWords">
                  <Run Text="{x:Bind Labels.micaControllerDescription, Mode=OneWay}" /><LineBreak /><LineBreak />
                  <Run Text="{x:Bind Labels.micaKindsIntro, Mode=OneWay}" /><LineBreak />
                  <Run FontWeight="Bold" Text="{x:Bind Labels.micaBaseName, Mode=OneWay}" /><Run Text="{x:Bind Labels.micaBaseDescription, Mode=OneWay}" /><LineBreak />
                  <Run FontWeight="Bold" Text="{x:Bind Labels.micaControllerAltName, Mode=OneWay}" /><Run Text="{x:Bind Labels.micaControllerAltDescription, Mode=OneWay}" /><LineBreak />
                </TextBlock>
                <Button Margin="0,10,0,0" HorizontalAlignment="Left" Click="createCustomMicaWindow_Click" Content="{x:Bind Labels.showWindow, Mode=OneWay}" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind MicaOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>
          <ControlExample SampleDefinition="SystemBackdrops\SystemBackdropsDesktopacryliccontroller.txt" HeaderText="{x:Bind Labels.acrylicHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" CSharp="{x:Bind desktopAcrylicControllerCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel class="system-backdrop-example">
                <TextBlock TextWrapping="WrapWholeWords">
                  <Run Text="{x:Bind Labels.acrylicControllerDescription, Mode=OneWay}" /><LineBreak /><LineBreak />
                  <Run Text="{x:Bind Labels.acrylicKindsIntro, Mode=OneWay}" /><LineBreak />
                  <Run FontWeight="Bold" Text="{x:Bind Labels.acrylicBaseName, Mode=OneWay}" /><Run Text="{x:Bind Labels.acrylicBaseDescription, Mode=OneWay}" /><LineBreak />
                  <Run FontWeight="Bold" Text="{x:Bind Labels.acrylicControllerThinName, Mode=OneWay}" /><Run Text="{x:Bind Labels.acrylicControllerThinDescription, Mode=OneWay}" /><LineBreak /><LineBreak />
                  <Run Text="{x:Bind Labels.acrylicControllerNote, Mode=OneWay}" />
                </TextBlock>
                <Button Margin="0,10,0,0" HorizontalAlignment="Left" Click="createCustomDesktopAcrylicWindow_Click" Content="{x:Bind Labels.showWindow, Mode=OneWay}" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind AcrylicOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, provide, ref, shallowReactive } from 'vue'
import Button from '../../components/Button.vue'
import ControlExample from '../../components/ControlExample.vue'
import FontIcon from '../../components/FontIcon.vue'
import Page from '../../components/Page.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { Run, LineBreak } from '../../components/TextInline'
import { useI18n } from '../../components/i18n/index'
import { createSystemBackdropWindow, type SystemBackdropWindowHandle, type SystemBackdropState } from '../../components/systemBackdropHostAdapter'
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import { mountSystemBackdropsWindow, type SampleBackdropType } from '../samples/SystemBackdrops/mountSystemBackdropsWindow'
import backdropTypesDefinition from '../samples/SystemBackdrops/SystemBackdropsBackdropTypes.txt?raw'
import micaControllerDefinition from '../samples/SystemBackdrops/SystemBackdropsMicacontroller.txt?raw'
import acrylicControllerDefinition from '../samples/SystemBackdrops/SystemBackdropsDesktopacryliccontroller.txt?raw'

const currentPage = inject<{ value: string }>('currentPage')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'systembackdrops')
const i18n = useI18n()
const { t } = i18n
const Labels = computed(() => ({
  title: t('catalog.item.systembackdrops.title'), description: t('catalog.item.systembackdrops.subtitle'), toggleTheme: t('gallery.page-header.toggle-theme'),
  typesHeader: t('sample.systembackdrops.types-header'), micaHeader: t('sample.systembackdrops.mica-header'), acrylicHeader: t('sample.systembackdrops.acrylic-header'), showWindow: t('sample.systembackdrops.show-window'),
  typesIntro: t('sample.systembackdrops.types-intro'), micaName: t('sample.systembackdrops.mica-name'), micaDescription: t('sample.systembackdrops.mica-description'), micaAltName: t('sample.systembackdrops.mica-alt-name'), micaAltDescription: t('sample.systembackdrops.mica-alt-description'),
  acrylicName: t('sample.systembackdrops.acrylic-name'), acrylicDescription: t('sample.systembackdrops.acrylic-description'), acrylicThinName: t('sample.systembackdrops.acrylic-thin-name'), acrylicThinDescription: t('sample.systembackdrops.acrylic-thin-description'),
  comparisonTitle: t('sample.systembackdrops.comparison-title'), comparisonDescription: t('sample.systembackdrops.comparison-description'), apiIntro: t('sample.systembackdrops.api-intro'),
  apiSystemName: t('sample.systembackdrops.api-system-name'), apiSystemDescription: t('sample.systembackdrops.api-system-description'), apiMicaName: t('sample.systembackdrops.api-mica-name'), apiMicaDescription: t('sample.systembackdrops.api-mica-description'), apiAcrylicName: t('sample.systembackdrops.api-acrylic-name'), apiAcrylicDescription: t('sample.systembackdrops.api-acrylic-description'), requirements: t('sample.systembackdrops.requirements'),
  micaControllerDescription: t('sample.systembackdrops.mica-controller-description'), micaKindsIntro: t('sample.systembackdrops.mica-kinds-intro'), micaBaseName: t('sample.systembackdrops.mica-base-name'), micaBaseDescription: t('sample.systembackdrops.mica-base-description'), micaControllerAltName: t('sample.systembackdrops.mica-controller-alt-name'), micaControllerAltDescription: t('sample.systembackdrops.mica-controller-alt-description'),
  acrylicControllerDescription: t('sample.systembackdrops.acrylic-controller-description'), acrylicKindsIntro: t('sample.systembackdrops.acrylic-kinds-intro'), acrylicBaseName: t('sample.systembackdrops.acrylic-base-name'), acrylicBaseDescription: t('sample.systembackdrops.acrylic-base-description'), acrylicControllerThinName: t('sample.systembackdrops.acrylic-controller-thin-name'), acrylicControllerThinDescription: t('sample.systembackdrops.acrylic-controller-thin-description'), acrylicControllerNote: t('sample.systembackdrops.acrylic-controller-note')
}))
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'))
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const BuiltInOutput = ref('')
const MicaOutput = ref('')
const AcrylicOutput = ref('')
const outputSubscriptions = new Set<() => void>()
onBeforeUnmount(() => { outputSubscriptions.forEach(stop => stop()); outputSubscriptions.clear() })
const sampleSection = (definition: string, section: string) => definition.match(new RegExp('(?:^|\\r?\\n)--- ' + section + '\\r?\\n([\\s\\S]*?)(?=\\r?\\n--- |$)'))?.[1]?.trim() ?? ''
const backdropTypesXaml = sampleSection(backdropTypesDefinition, 'xaml')
const backdropTypesCSharp = sampleSection(backdropTypesDefinition, 'c#')
const micaControllerCSharp = sampleSection(micaControllerDefinition, 'c#')
const desktopAcrylicControllerCSharp = sampleSection(acrylicControllerDefinition, 'c#')
const outputForState = (state: SystemBackdropState) => {
  if (state.Status === 'Closed') return t('sample.systembackdrops.closed')
  if (state.Status === 'HighContrast') return t('sample.systembackdrops.high-contrast')
  if (state.Status === 'Fallback') return t(state.Reason === 'Inactive' ? 'sample.systembackdrops.inactive' : state.Reason === 'MaterialUnsupported' ? 'sample.systembackdrops.effect-unavailable' : state.Reason === 'TransparencyDisabled' ? 'sample.systembackdrops.transparency-disabled' : state.Reason === 'EnergySaver' ? 'sample.systembackdrops.energy-saver' : state.Reason === 'HostError' ? 'sample.systembackdrops.operation-failed' : 'sample.systembackdrops.native-unavailable')
  const material = state.AppliedBackdrop?.Type === 'DesktopAcrylic' ? state.AppliedBackdrop.Kind === 'Thin' ? 'acrylic-thin' : 'acrylic' : state.AppliedBackdrop?.Kind === 'BaseAlt' ? 'mica-alt' : state.AppliedBackdrop ? 'mica' : 'none'
  return t('sample.systembackdrops.applied', { backdrop: t(`sample.systembackdrops.backdrop.${material}`) })
}
const openSample = async (mode: 'builtIn' | 'mica' | 'acrylic') => {
  const output = mode === 'builtIn' ? BuiltInOutput : mode === 'mica' ? MicaOutput : AcrylicOutput
  const allowed: SampleBackdropType[] = mode === 'builtIn' ? ['Mica', 'MicaAlt', 'Acrylic', 'None'] : mode === 'mica' ? ['Mica', 'MicaAlt', 'None'] : ['Acrylic', 'AcrylicThin', 'None']
  try {
    const handle = await createSystemBackdropWindow({ title: t('sample.systembackdrops.window-title'), width: 640, height: 480, theme: 'Default', backdrop: mode === 'acrylic' ? { Type: 'DesktopAcrylic', Kind: 'Base' } : { Type: 'Mica', Kind: 'Base' }, mountContent: (element: HTMLElement, windowHandle: SystemBackdropWindowHandle) => mountSystemBackdropsWindow(element, windowHandle, allowed, i18n.locale) })
    let unsubscribe: (() => void) | undefined
    unsubscribe = handle.Subscribe(state => {
      output.value = outputForState(state)
      if (state.Status === 'Closed' && unsubscribe) { unsubscribe(); outputSubscriptions.delete(unsubscribe) }
    })
    if (handle.State.Status !== 'Closed') outputSubscriptions.add(unsubscribe)
  } catch (error) {
    const code = (error as { Code?: string })?.Code
    output.value = t(code === 'PopupBlocked' ? 'sample.systembackdrops.popup-blocked' : code === 'HostUnavailable' ? 'sample.systembackdrops.window-unavailable' : 'sample.systembackdrops.window-failed')
  }
}
const createBuiltInWindow_Click = () => openSample('builtIn')
const createCustomMicaWindow_Click = () => openSample('mica')
const createCustomDesktopAcrylicWindow_Click = () => openSample('acrylic')
provide(xamlNameScopeKey, shallowReactive({}))
provide(xamlScopeKey, { Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite, backdropTypesXaml, backdropTypesCSharp, micaControllerCSharp, desktopAcrylicControllerCSharp, BuiltInOutput, MicaOutput, AcrylicOutput, createBuiltInWindow_Click, createCustomMicaWindow_Click, createCustomDesktopAcrylicWindow_Click })
</script>

<style scoped>
:deep(.page-heading) { position: relative; min-width: 0; }
:deep(.page-header) { font-size: 28px; font-weight: 600; margin: 0 80px 8px 0; color: var(--text-primary); overflow-wrap: anywhere; }
:deep(.page-description) { color: var(--text-secondary); margin: 0 80px 16px 0; }
:deep(.page-header-actions) { position: absolute; top: 0; right: 0; }
:deep(.system-backdrop-example) { min-width: 0; max-width: 100%; }
:deep(.system-backdrop-example .win-textblock) { overflow-wrap: anywhere; }
</style>
