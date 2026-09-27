<template>
  <Grid class="titlebar-sample-window">
    <Grid.RowDefinitions><RowDefinition Height="Auto" /><RowDefinition Height="*" /></Grid.RowDefinitions>
    <TitleBar x:Name="titleBar" Title="{x:Bind Labels.title, Mode=OneWay}" Subtitle="{x:Bind Labels.subtitle, Mode=OneWay}" BackRequested="TitleBar_BackRequested" IsBackButtonVisible="{x:Bind navFrame.CanGoBack, Mode=OneWay}" IsPaneToggleButtonVisible="True" PaneToggleRequested="TitleBar_PaneToggleRequested">
      <TitleBar.Resources><HorizontalAlignment x:Key="TitleBarContentHorizontalAlignment">Stretch</HorizontalAlignment></TitleBar.Resources>
      <TitleBar.IconSource><ImageIconSource ImageSource="https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/Tiles/GalleryIcon.ico" /></TitleBar.IconSource>
      <TitleBar.RightHeader><PersonPicture Width="30" Height="30" Initials="JD" /></TitleBar.RightHeader>
      <TitleBar.Content><AutoSuggestBox MaxWidth="580" HorizontalAlignment="Stretch" VerticalAlignment="Center" PlaceholderText="{x:Bind Labels.search, Mode=OneWay}" QueryIcon="Find" /></TitleBar.Content>
    </TitleBar>
    <NavigationView x:Name="navView" Grid.Row="1" IsBackButtonVisible="Collapsed" IsPaneToggleButtonVisible="False" IsSettingsVisible="False" SelectionChanged="navView_SelectionChanged">
      <NavigationView.MenuItems>
        <NavigationViewItem Content="{x:Bind Labels.menu1, Mode=OneWay}" Icon="Play" Tag="SamplePage1" />
        <NavigationViewItem Content="{x:Bind Labels.menu2, Mode=OneWay}" Icon="Save" Tag="SamplePage2" />
        <NavigationViewItem Content="{x:Bind Labels.menu3, Mode=OneWay}" Icon="Refresh" Tag="SamplePage3" />
        <NavigationViewItem Content="{x:Bind Labels.menu4, Mode=OneWay}" Icon="Download" Tag="SamplePage4" />
      </NavigationView.MenuItems>
      <Frame x:Name="navFrame" Navigated="navFrame_Navigated" />
    </NavigationView>
  </Grid>
</template>

<script setup lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, provide, shallowReactive } from 'vue'
import AutoSuggestBox from '../../../components/AutoSuggestBox.vue'
import Frame from '../../../components/Frame.vue'
import Grid from '../../../components/Grid.vue'
import NavigationView from '../../../components/NavigationView.vue'
import PersonPicture from '../../../components/PersonPicture.vue'
import RowDefinition from '../../../components/RowDefinition.vue'
import TitleBar from '../../../components/TitleBar.vue'
import { ImageIconSource } from '../../../components/IconSource'
import { NavigationViewItem } from '../../../components/NavigationViewProperties'
import { useI18n } from '../../../components/i18n/index'
import { xamlNameScopeKey, xamlScopeKey } from '../../../components/xamlRuntime'
import type { SystemBackdropWindowHandle } from '../../../components/systemBackdropHostAdapter'
import { readWindowSampleState, writeWindowSampleState } from '../SystemBackdrops/mountSystemBackdropsWindow'
import SamplePage1 from './SamplePage1.vue'
import SamplePage2 from './SamplePage2.vue'
import SamplePage3 from './SamplePage3.vue'
import SamplePage4 from './SamplePage4.vue'
const HorizontalAlignment = defineComponent({ name: 'HorizontalAlignment', __xamlPrimitive: 'HorizontalAlignment', setup: () => () => null })
defineProps<{ handle: SystemBackdropWindowHandle }>()
const { t } = useI18n()
const Labels = computed(() => ({ title: t('sample.titlebar.default-title'), subtitle: t('sample.titlebar.end-subtitle'), search: t('sample.titlebar.search'), menu1: t('sample.titlebar.menu-item', { index: 1 }), menu2: t('sample.titlebar.menu-item', { index: 2 }), menu3: t('sample.titlebar.menu-item', { index: 3 }), menu4: t('sample.titlebar.menu-item', { index: 4 }) }))
const names = shallowReactive<Record<string, any>>({})
const pages = { SamplePage1, SamplePage2, SamplePage3, SamplePage4 }
type PageTag = keyof typeof pages
const restored = readWindowSampleState<{ History: string[]; SelectedTag: string; IsPaneOpen: boolean }>()
let history = Array.isArray(restored.History) ? restored.History.filter((tag): tag is PageTag => Object.hasOwn(pages, tag)) : []
if (!history.length) history = ['SamplePage1']
let restoring = true, restorationIndex = 0
const saveState = () => writeWindowSampleState({ History: history, SelectedTag: names.navView?.SelectedItem?.Tag ?? history.at(-1), IsPaneOpen: names.navView?.IsPaneOpen ?? true })
const setHeader = (tag: PageTag) => { names.navView.Header = t('sample.titlebar.sample-page', { index: tag.slice(-1) }) }
const TitleBar_PaneToggleRequested = () => { if (names.navView) { names.navView.IsPaneOpen = !names.navView.IsPaneOpen; saveState() } }
const TitleBar_BackRequested = () => { if (names.navFrame?.CanGoBack) names.navFrame.GoBack() }
const navView_SelectionChanged = (_sender: unknown, args: { SelectedItem?: { Tag?: string } }) => { const tag = args.SelectedItem?.Tag as PageTag; if (!restoring && pages[tag] && names.navFrame) { setHeader(tag); names.navFrame.Navigate(pages[tag]) } }
const navFrame_Navigated = (_sender: unknown, args: { SourcePageType?: unknown; NavigationMode?: string }) => {
  if (restoring) {
    if (++restorationIndex < history.length) { names.navFrame.Navigate(pages[history[restorationIndex]]); return }
    restoring = false
  } else if (args.NavigationMode === 'Back') history.pop()
  else {
    const tag = (Object.keys(pages) as PageTag[]).find(key => pages[key] === args.SourcePageType)
    if (tag) history.push(tag)
  }
  saveState()
}
onMounted(() => {
  if (!names.navView || !names.navFrame) return
  const selected = names.navView.MenuItems.find((item: { Tag: string }) => item.Tag === (restored.SelectedTag ?? history.at(-1))) ?? names.navView.MenuItems[0]
  names.navView.SelectedItem = selected
  if (typeof restored.IsPaneOpen === 'boolean') names.navView.IsPaneOpen = restored.IsPaneOpen
  setHeader(selected.Tag)
  names.navFrame.Navigate(pages[history[0]])
})
onBeforeUnmount(saveState)
provide(xamlNameScopeKey, names)
provide(xamlScopeKey, { Labels, TitleBar_BackRequested, TitleBar_PaneToggleRequested, navView_SelectionChanged, navFrame_Navigated })
</script>

<style>
.titlebar-sample-window { width: 100%; height: 100%; min-width: 0; min-height: 0; color: var(--text-primary); }
.titlebar-sample-window .win-textblock { overflow-wrap: anywhere; }
</style>
