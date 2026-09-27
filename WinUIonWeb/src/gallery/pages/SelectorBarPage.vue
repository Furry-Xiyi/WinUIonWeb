<template>
  <Page>
    <Page.Resources>
      <DataTemplate x:Key="ColorsTemplate" x:DataType="media:SolidColorBrush">
        <ItemContainer Width="112" Height="82" Margin="4" Background="{x:Bind}" />
      </DataTemplate>
    </Page.Resources>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind Labels.Title, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}" Click="toggleTheme">
              <TextBlock class="icon" Text="&#xE793;" FontFamily="{ThemeResource SymbolThemeFontFamily}" />
            </Button>
            <ToggleButton class="header-action" AutomationProperties.Name="{x:Bind Labels.Favorite, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind Labels.Favorite, Mode=OneWay}" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite">
              <TextBlock class="icon" Text="{x:Bind FavoriteGlyph, Mode=OneWay}" FontFamily="{ThemeResource SymbolThemeFontFamily}" />
            </ToggleButton>
          </StackPanel>
        </StackPanel>
        <StackPanel class="gallery-page-content">
          <ControlExample x:Name="Example1" SampleDefinition="SelectorBar\BasicSelectorbar.txt" HeaderText="{x:Bind Labels.BasicHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind BasicXaml, Mode=OneWay}">
            <ControlExample.Example>
              <SelectorBar x:Name="SelectorBar1">
                <SelectorBarItem x:Name="SelectorBarItemRecent" Icon="Clock" Text="{x:Bind Labels.Recent, Mode=OneWay}" />
                <SelectorBarItem x:Name="SelectorBarItemShared" Icon="Share" Text="{x:Bind Labels.Shared, Mode=OneWay}" />
                <SelectorBarItem x:Name="SelectorBarItemFavorites" Icon="Favorite" Text="{x:Bind Labels.Favorites, Mode=OneWay}" />
              </SelectorBar>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>
          <ControlExample x:Name="Example2" SampleDefinition="SelectorBar\SelectorbarFrameSlideTransitions.txt" HeaderText="{x:Bind Labels.FrameHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind FrameXaml, Mode=OneWay}" CSharp="{x:Bind FrameCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel class="selectorbar-sample-stack">
                <SelectorBar x:Name="SelectorBar2" SelectionChanged="SelectorBar2_SelectionChanged">
                  <SelectorBarItem x:Name="SelectorBarItemPage1" IsSelected="True" Text="{x:Bind Labels.Page1, Mode=OneWay}" />
                  <SelectorBarItem x:Name="SelectorBarItemPage2" Text="{x:Bind Labels.Page2, Mode=OneWay}" />
                  <SelectorBarItem x:Name="SelectorBarItemPage3" Text="{x:Bind Labels.Page3, Mode=OneWay}" />
                  <SelectorBarItem x:Name="SelectorBarItemPage4" Text="{x:Bind Labels.Page4, Mode=OneWay}" />
                  <SelectorBarItem x:Name="SelectorBarItemPage5" Text="{x:Bind Labels.Page5, Mode=OneWay}" />
                </SelectorBar>
                <Frame x:Name="ContentFrame" class="selectorbar-content-frame" IsNavigationStackEnabled="False" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>
          <ControlExample x:Name="Example3" SampleDefinition="SelectorBar\SelectorbarDisplayingDifferentCollections.txt" HeaderText="{x:Bind Labels.CollectionsHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind CollectionsXaml, Mode=OneWay}" CSharp="{x:Bind CollectionsCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel class="selectorbar-sample-stack">
                <SelectorBar x:Name="SelectorBar3" SelectionChanged="SelectorBar3_SelectionChanged">
                  <SelectorBarItem x:Name="SelectorBarItemPink" IsSelected="True" Text="{x:Bind Labels.Pink, Mode=OneWay}" />
                  <SelectorBarItem x:Name="SelectorBarItemPlum" Text="{x:Bind Labels.Plum, Mode=OneWay}" />
                  <SelectorBarItem x:Name="SelectorBarItemPowderBlue" Text="{x:Bind Labels.PowderBlue, Mode=OneWay}" />
                </SelectorBar>
                <ItemsView x:Name="ItemsView3" class="selectorbar-colors-view" ItemTemplate="{StaticResource ColorsTemplate}">
                  <ItemsView.Layout>
                    <StackLayout Orientation="Horizontal" />
                  </ItemsView.Layout>
                </ItemsView>
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onMounted, provide, shallowReactive, type Component } from 'vue'
import Button from '../../components/Button.vue'
import ControlExample from '../../components/ControlExample.vue'
import Frame from '../../components/Frame.vue'
import ItemContainer from '../../components/ItemContainer.vue'
import ItemsView from '../../components/ItemsView.vue'
import Page from '../../components/Page.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import SelectorBar from '../../components/SelectorBar.vue'
import SelectorBarItem from '../../components/SelectorBarItem.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { DataTemplate, StackLayout } from '../../components/CollectionProperties'
import { useI18n } from '../../components/i18n/index'
import { xamlNameScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import { createSlideNavigationTransitionInfo } from '../../utils/navigationTransitionInfo'
import SamplePage1 from '../components/navigationview/SamplePage1.vue'
import SamplePage2 from '../components/navigationview/SamplePage2.vue'
import SamplePage3 from '../components/navigationview/SamplePage3.vue'
import SamplePage4 from '../components/navigationview/SamplePage4.vue'
import SamplePage5 from '../components/navigationview/SamplePage5.vue'
import basicDefinition from '../samples/SelectorBar/BasicSelectorbar.txt?raw'
import frameDefinition from '../samples/SelectorBar/SelectorbarFrameSlideTransitions.txt?raw'
import collectionsDefinition from '../samples/SelectorBar/SelectorbarDisplayingDifferentCollections.txt?raw'

defineOptions({ name: 'SelectorBarPage' })
const { t } = useI18n()
const currentPage = inject<{ value: string } | null>('currentPage', null)
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'selectorbar')
const namescope = shallowReactive<Record<string, unknown>>({})
provide(xamlNameScopeKey, namescope)
const Labels = computed(() => ({
  Title: t('text.selectorbar'), Description: t('text.selectorbar-description'),
  ToggleTheme: t('gallery.page-header.toggle-theme'), Favorite: t('gallery.page-header.favorite'),
  BasicHeader: t('sample.selectorbar.basic'), FrameHeader: t('sample.selectorbar.frame-slide-transitions'),
  CollectionsHeader: t('sample.selectorbar.collections'),
  Recent: t('text.recent'), Shared: t('text.shared'), Favorites: t('text.favorites'),
  Page1: t('sample.selectorbar.page-1'), Page2: t('sample.selectorbar.page-2'),
  Page3: t('sample.selectorbar.page-3'), Page4: t('sample.selectorbar.page-4'), Page5: t('sample.selectorbar.page-5'),
  Pink: t('sample.selectorbar.pink'), Plum: t('sample.selectorbar.plum'), PowderBlue: t('sample.selectorbar.powder-blue')
}))
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const PinkColorCollection = Array.from({ length: 5 }, () => 'Pink')
const PlumColorCollection = Array.from({ length: 7 }, () => 'Plum')
const PowderBlueColorCollection = Array.from({ length: 4 }, () => 'PowderBlue')
const SamplePages = [SamplePage1, SamplePage2, SamplePage3, SamplePage4, SamplePage5]
let previousSelectedIndex = 0
let navigationRequest = 0
let collectionRequest = 0

interface SelectorBarSender { Items: unknown[]; SelectedItem: unknown }
interface ContentFrameApi {
  CurrentSourcePageType: Component | null
  Navigate: (pageType: Component, parameter: unknown, transitionInfo: unknown) => boolean
}
const SelectorBar2_SelectionChanged = (sender: SelectorBarSender) => {
  const currentSelectedIndex = sender.Items.indexOf(sender.SelectedItem)
  if (currentSelectedIndex < 0) return
  const pageType = SamplePages[currentSelectedIndex]
  if (!pageType) return
  const effect = currentSelectedIndex - previousSelectedIndex > 0 ? 'FromRight' : 'FromLeft'
  const request = ++navigationRequest
  const navigate = () => {
    if (request !== navigationRequest) return
    const contentFrame = namescope.ContentFrame as ContentFrameApi | undefined
    if (contentFrame?.Navigate(pageType, null, createSlideNavigationTransitionInfo(effect))) {
      previousSelectedIndex = currentSelectedIndex
    }
  }
  if (namescope.ContentFrame) navigate()
  else void nextTick(navigate)
}
const SelectorBar3_SelectionChanged = (sender: SelectorBarSender) => {
  if (!sender.SelectedItem) return
  const selectedItem = sender.SelectedItem
  const request = ++collectionRequest
  const updateItemsSource = () => {
    if (request !== collectionRequest) return
    const itemsView = namescope.ItemsView3 as { ItemsSource: string[] } | undefined
    if (!itemsView) return
    if (selectedItem === namescope.SelectorBarItemPink) {
      itemsView.ItemsSource = PinkColorCollection
    } else if (selectedItem === namescope.SelectorBarItemPlum) {
      itemsView.ItemsSource = PlumColorCollection
    } else {
      itemsView.ItemsSource = PowderBlueColorCollection
    }
  }
  if (namescope.ItemsView3) updateItemsSource()
  else void nextTick(updateItemsSource)
}
onMounted(() => {
  // x:Name siblings register after the initial selected item is realized.
  // Complete initial navigation through the selected controls' public API.
  const contentFrame = namescope.ContentFrame as ContentFrameApi | undefined
  const selectorBar2 = namescope.SelectorBar2 as SelectorBarSender | undefined
  if (selectorBar2 && contentFrame && !contentFrame.CurrentSourcePageType) SelectorBar2_SelectionChanged(selectorBar2)
  const selectorBar3 = namescope.SelectorBar3 as SelectorBarSender | undefined
  if (selectorBar3) SelectorBar3_SelectionChanged(selectorBar3)
})
const sampleSection = (definition: string, section: string) => {
  const match = definition.match(new RegExp('(?:^|\\r?\\n)--- ' + section + '\\r?\\n([\\s\\S]*?)(?=\\r?\\n--- |$)'))
  return match?.[1].trim() ?? ''
}
const BasicXaml = sampleSection(basicDefinition, 'xaml')
const FrameXaml = sampleSection(frameDefinition, 'xaml')
const FrameCSharp = sampleSection(frameDefinition, 'c#')
const CollectionsXaml = sampleSection(collectionsDefinition, 'xaml')
const CollectionsCSharp = sampleSection(collectionsDefinition, 'c#')
</script>

<style scoped>
:deep(.page-heading) { position: relative; }
:deep(.page-header) { margin: 0 72px 8px 0; color: var(--text-primary); font-size: 28px; font-weight: 600; }
:deep(.page-description) { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
:deep(.page-header-actions) { position: absolute; top: 0; right: 0; gap: 4px; }
:deep(.icon) { font-size: 16px; }
:deep(.selectorbar-sample-stack) { width: 100%; min-width: 0; max-width: 100%; }
:deep(.selectorbar-content-frame) { width: 100%; min-width: 0; max-width: 100%; }
:deep(.selectorbar-colors-view) { width: 100%; height: auto; min-width: 0; max-width: 100%; }
</style>
