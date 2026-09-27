<template>
  <Page>
    <Page.Resources>
      <MenuFlyout x:Name="TabViewContextMenu" Opening="TabViewContextMenu_Opening" />
    </Page.Resources>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <TextBlock MaxWidth="1064" HorizontalAlignment="Left" Margin="0,4,24,0" Style="{ThemeResource BodyTextBlockStyle}" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <StackPanel class="gallery-page-content" HorizontalAlignment="Stretch">
          <ControlExample SampleDefinition="TabView\TabviewSupportAddingClosing.txt" HeaderText="{x:Bind Text.AddingHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Samples.Adding.xaml, Mode=OneWay}" CSharp="{x:Bind Samples.Adding.cSharp, Mode=OneWay}">
            <ControlExample.Example>
              <TabView x:Name="TabView1" MinHeight="475" Margin="-12" AddTabButtonClick="TabView_AddButtonClick" Loaded="TabView_Loaded" SelectedIndex="0" TabCloseRequested="TabView_TabCloseRequested" SelectionChanged="TabView_Changed" TabItemsChanged="TabView_Changed" />
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind Outputs.TabView1, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>

          <ControlExample SampleDefinition="TabView\TabviewTabviewitemsDefinedMarkup.txt" HeaderText="{x:Bind Text.MarkupHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Samples.Markup.xaml, Mode=OneWay}" CSharp="{x:Bind Samples.Adding.cSharp, Mode=OneWay}">
            <ControlExample.Example>
              <TabView x:Name="MarkupTabs" MinHeight="475" Margin="-12" AddTabButtonClick="TabView_AddButtonClick" Loaded="TabView_Changed" SelectedIndex="0" TabCloseRequested="TabView_TabCloseRequested" SelectionChanged="TabView_Changed" TabItemsChanged="TabView_Changed">
                <TabView.TabItems>
                  <TabViewItem Header="{x:Bind Text.Document0, Mode=OneWay}" ContextFlyout="{x:Bind TabViewContextMenu}">
                    <TabViewItem.IconSource><SymbolIconSource Symbol="Placeholder" /></TabViewItem.IconSource>
                    <samplepages:SamplePage1 />
                  </TabViewItem>
                  <TabViewItem Header="{x:Bind Text.Document1, Mode=OneWay}" ContextFlyout="{x:Bind TabViewContextMenu}">
                    <TabViewItem.IconSource><SymbolIconSource Symbol="Placeholder" /></TabViewItem.IconSource>
                    <samplepages:SamplePage2 />
                  </TabViewItem>
                  <TabViewItem Header="{x:Bind Text.Document2, Mode=OneWay}" ContextFlyout="{x:Bind TabViewContextMenu}">
                    <TabViewItem.IconSource><SymbolIconSource Symbol="Placeholder" /></TabViewItem.IconSource>
                    <samplepages:SamplePage3 />
                  </TabViewItem>
                </TabView.TabItems>
              </TabView>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind Outputs.MarkupTabs, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>

          <ControlExample SampleDefinition="TabView\TabviewBoundCollectionMydata.txt" HeaderText="{x:Bind Text.BindingHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Samples.Binding.xaml, Mode=OneWay}" CSharp="{x:Bind Samples.Binding.cSharp, Mode=OneWay}">
            <ControlExample.Example>
              <TabView x:Name="TabViewItemsSourceSample" MinHeight="475" Margin="-12" AddTabButtonClick="TabViewItemsSourceSample_AddTabButtonClick" Loaded="TabView_Changed" SelectedIndex="0" TabCloseRequested="TabViewItemsSourceSample_TabCloseRequested" TabItemsSource="{x:Bind myDatas, Mode=OneWay}" SelectionChanged="TabView_Changed" TabItemsChanged="TabView_Changed">
                <TabView.TabItemTemplate>
                  <DataTemplate x:DataType="local:MyData">
                    <TabViewItem Content="{x:Bind DataContent}" Header="{x:Bind DataHeader}" IconSource="{x:Bind DataIconSource}" />
                  </DataTemplate>
                </TabView.TabItemTemplate>
              </TabView>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind Outputs.TabViewItemsSourceSample, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>

          <ControlExample SampleDefinition="TabView\TabviewKeyboardingSupport.txt" HeaderText="{x:Bind Text.KeyboardHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Samples.Keyboard.xaml, Mode=OneWay}" CSharp="{x:Bind Samples.Keyboard.cSharp, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel>
                <TextBlock Margin="0,0,0,0" Text="{x:Bind Text.KeyboardNew, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <TextBlock Margin="0,0,0,0" Text="{x:Bind Text.KeyboardClose, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <TextBlock Margin="0,0,0,0" Text="{x:Bind Text.KeyboardNumber, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <TextBlock Margin="0,0,0,24" Text="{x:Bind Text.KeyboardLast, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <TabView x:Name="TabView2" MinHeight="475" Margin="-12" AddTabButtonClick="TabView_AddButtonClick" Loaded="TabView_Loaded" SelectedIndex="0" TabCloseRequested="TabView_TabCloseRequested" SelectionChanged="TabView_Changed" TabItemsChanged="TabView_Changed">
                  <TabView.KeyboardAccelerators>
                    <KeyboardAccelerator Key="T" Invoked="NewTabKeyboardAccelerator_Invoked" Modifiers="Control" />
                    <KeyboardAccelerator Key="W" Invoked="CloseSelectedTabKeyboardAccelerator_Invoked" Modifiers="Control" />
                    <KeyboardAccelerator Key="Number1" Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked" Modifiers="Control" />
                    <KeyboardAccelerator Key="Number2" Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked" Modifiers="Control" />
                    <KeyboardAccelerator Key="Number3" Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked" Modifiers="Control" />
                    <KeyboardAccelerator Key="Number4" Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked" Modifiers="Control" />
                    <KeyboardAccelerator Key="Number5" Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked" Modifiers="Control" />
                    <KeyboardAccelerator Key="Number6" Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked" Modifiers="Control" />
                    <KeyboardAccelerator Key="Number7" Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked" Modifiers="Control" />
                    <KeyboardAccelerator Key="Number8" Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked" Modifiers="Control" />
                    <KeyboardAccelerator Key="Number9" Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked" Modifiers="Control" />
                  </TabView.KeyboardAccelerators>
                </TabView>
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind Outputs.TabView2, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>

          <ControlExample SampleDefinition="TabView\TabViewYouPutCustomContent.txt" HeaderText="{x:Bind Text.CustomHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Samples.Custom.xaml, Mode=OneWay}" CSharp="{x:Bind Samples.Adding.cSharp, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel>
                <TextBlock Margin="0,0,0,12" Text="{x:Bind Text.CustomDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <TextBlock Margin="0,0,0,12" Text="{x:Bind Text.CustomDragRegion, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <TextBlock Margin="0,0,0,24" Text="{x:Bind Text.WindowSourceDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <TabView x:Name="CustomTabs" BringIntoViewRequested="TabView_BringIntoViewRequested" MinHeight="475" Margin="-12" AddTabButtonClick="TabView_AddButtonClick" Loaded="TabView_Loaded" SelectedIndex="0" TabCloseRequested="TabView_TabCloseRequested" TabWidthMode="SizeToContent" SelectionChanged="TabView_Changed" TabItemsChanged="TabView_Changed">
                  <TabView.TabStripHeader>
                    <TextBlock Margin="8,6" VerticalAlignment="Center" Style="{ThemeResource BaseTextBlockStyle}" Text="{x:Bind Text.StripHeader, Mode=OneWay}" />
                  </TabView.TabStripHeader>
                  <TabView.TabStripFooter>
                    <TextBlock Margin="6" HorizontalAlignment="Right" VerticalAlignment="Center" Style="{ThemeResource BaseTextBlockStyle}" Text="{x:Bind Text.StripFooter, Mode=OneWay}" />
                  </TabView.TabStripFooter>
                </TabView>
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind Outputs.CustomTabs, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>

          <ControlExample SampleDefinition="TabView\TabViewTabWidthsEitherBe.txt" HeaderText="{x:Bind Text.WidthHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Samples.Width.xaml, Mode=OneWay}">
            <ControlExample.Example>
              <TabView x:Name="TabView3" BringIntoViewRequested="TabView_BringIntoViewRequested" MinHeight="475" Margin="-12" IsAddTabButtonVisible="False" Loaded="TabView_Changed" SelectedIndex="0" TabWidthMode="SizeToContent" SelectionChanged="TabView_Changed" TabItemsChanged="TabView_Changed">
                <TabView.TabItems>
                  <TabViewItem Header="{x:Bind Text.Home, Mode=OneWay}" IsClosable="False" ContextFlyout="{x:Bind TabViewContextMenu}">
                    <TabViewItem.IconSource><SymbolIconSource Symbol="Home" /></TabViewItem.IconSource>
                    <samplepages:SamplePage1 />
                  </TabViewItem>
                  <TabViewItem Header="{x:Bind Text.LongTab, Mode=OneWay}" IsClosable="False" ContextFlyout="{x:Bind TabViewContextMenu}">
                    <TabViewItem.IconSource><SymbolIconSource Symbol="MusicInfo" /></TabViewItem.IconSource>
                    <samplepages:SamplePage2 />
                  </TabViewItem>
                  <TabViewItem Header="{x:Bind Text.ThirdTab, Mode=OneWay}" IsClosable="False" ContextFlyout="{x:Bind TabViewContextMenu}">
                    <TabViewItem.IconSource><SymbolIconSource Symbol="Placeholder" /></TabViewItem.IconSource>
                    <samplepages:SamplePage3 />
                  </TabViewItem>
                </TabView.TabItems>
              </TabView>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind Outputs.TabView3, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
            <ControlExample.Options>
              <ComboBox Width="150" Header="{x:Bind Text.WidthOptionHeader, Mode=OneWay}" SelectedIndex="0" SelectionChanged="TabWidthBehaviorComboBox_SelectionChanged">
                <ComboBoxItem Content="{x:Bind Text.SizeToContent, Mode=OneWay}" />
                <ComboBoxItem Content="{x:Bind Text.Equal, Mode=OneWay}" />
                <ComboBoxItem Content="{x:Bind Text.Compact, Mode=OneWay}" />
              </ComboBox>
            </ControlExample.Options>
            <ControlExample.Substitutions><ControlExampleSubstitution Key="TabWidthMode" Value="{x:Bind TabView3.TabWidthMode, Mode=OneWay}" /></ControlExample.Substitutions>
          </ControlExample>

          <ControlExample SampleDefinition="TabView\TabViewCloseButtonBePersistent.txt" HeaderText="{x:Bind Text.CloseHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Samples.Close.xaml, Mode=OneWay}">
            <ControlExample.Example>
              <TabView x:Name="TabView4" MinHeight="475" Margin="-12" IsAddTabButtonVisible="False" CloseButtonOverlayMode="Always" Loaded="TabView_Changed" SelectedIndex="0" TabCloseRequested="TabView_TabCloseRequested" SelectionChanged="TabView_Changed" TabItemsChanged="TabView_Changed">
                <TabView.TabItems>
                  <TabViewItem Header="{x:Bind Text.Home, Mode=OneWay}" ContextFlyout="{x:Bind TabViewContextMenu}">
                    <TabViewItem.IconSource><SymbolIconSource Symbol="Home" /></TabViewItem.IconSource>
                    <samplepages:SamplePage1 />
                  </TabViewItem>
                  <TabViewItem Header="{x:Bind Text.LongTab, Mode=OneWay}" ContextFlyout="{x:Bind TabViewContextMenu}">
                    <TabViewItem.IconSource><SymbolIconSource Symbol="MusicInfo" /></TabViewItem.IconSource>
                    <samplepages:SamplePage2 />
                  </TabViewItem>
                  <TabViewItem Header="{x:Bind Text.ThirdTab, Mode=OneWay}" ContextFlyout="{x:Bind TabViewContextMenu}">
                    <TabViewItem.IconSource><SymbolIconSource Symbol="Placeholder" /></TabViewItem.IconSource>
                    <samplepages:SamplePage3 />
                  </TabViewItem>
                </TabView.TabItems>
              </TabView>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind Outputs.TabView4, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
            <ControlExample.Options>
              <ComboBox Width="150" Header="{x:Bind Text.CloseOptionHeader, Mode=OneWay}" SelectedIndex="1" SelectionChanged="TabCloseButtonOverlayModeComboBox_SelectionChanged">
                <ComboBoxItem Content="{x:Bind Text.Auto, Mode=OneWay}" />
                <ComboBoxItem Content="{x:Bind Text.Always, Mode=OneWay}" />
                <ComboBoxItem Content="{x:Bind Text.OnHover, Mode=OneWay}" />
              </ComboBox>
            </ControlExample.Options>
            <ControlExample.Substitutions><ControlExampleSubstitution Key="CloseButtonOverlayMode" Value="{x:Bind TabView4.CloseButtonOverlayMode, Mode=OneWay}" /></ControlExample.Substitutions>
          </ControlExample>

          <ControlExample SampleDefinition="TabView\TabviewColorTabIcons.txt" HeaderText="{x:Bind Text.ColorHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Samples.Color.xaml, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel>
                <TextBlock Margin="0,0,0,12" Text="{x:Bind Text.ColorDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <TabView x:Name="ColorTabs" BringIntoViewRequested="TabView_BringIntoViewRequested" MinWidth="490" IsAddTabButtonVisible="False" Loaded="TabView_Changed" SelectedIndex="0" TabWidthMode="SizeToContent" SelectionChanged="TabView_Changed" TabItemsChanged="TabView_Changed">
                  <TabView.TabItems>
                    <TabViewItem Header="{x:Bind Text.CommandPrompt, Mode=OneWay}" IsClosable="False" ContextFlyout="{x:Bind TabViewContextMenu}">
                      <TabViewItem.IconSource><BitmapIconSource ShowAsMonochrome="False" UriSource="https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/SampleMedia/cmd.png" /></TabViewItem.IconSource>
                    </TabViewItem>
                    <TabViewItem Header="{x:Bind Text.PowerShell, Mode=OneWay}" IsClosable="False" ContextFlyout="{x:Bind TabViewContextMenu}">
                      <TabViewItem.IconSource><BitmapIconSource ShowAsMonochrome="False" UriSource="https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/SampleMedia/powershell.png" /></TabViewItem.IconSource>
                    </TabViewItem>
                    <TabViewItem Header="{x:Bind Text.Linux, Mode=OneWay}" IsClosable="False" ContextFlyout="{x:Bind TabViewContextMenu}">
                      <TabViewItem.IconSource><BitmapIconSource ShowAsMonochrome="False" UriSource="https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/SampleMedia/linux.png" /></TabViewItem.IconSource>
                    </TabViewItem>
                  </TabView.TabItems>
                </TabView>
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind Outputs.ColorTabs, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>

          <ControlExample SampleDefinition="TabView\TabviewAccentColoredTabstrip.txt" HeaderText="{x:Bind Text.AccentHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Samples.Accent.xaml, Mode=OneWay}" CSharp="{x:Bind Samples.Adding.cSharp, Mode=OneWay}">
            <ControlExample.Example>
              <TabView x:Name="AccentTabs" MinHeight="475" Margin="-12" AddTabButtonClick="TabView_AddButtonClick" Loaded="TabView_Loaded" SelectedIndex="0" TabCloseRequested="TabView_TabCloseRequested" SelectionChanged="TabView_Changed" TabItemsChanged="TabView_Changed">
                <TabView.Resources>
                  <ResourceDictionary>
                    <ResourceDictionary.ThemeDictionaries>
                      <ResourceDictionary x:Key="Light"><SolidColorBrush x:Key="TabViewBackground" Color="{ThemeResource SystemAccentColorLight2}" /></ResourceDictionary>
                      <ResourceDictionary x:Key="Dark"><SolidColorBrush x:Key="TabViewBackground" Color="{ThemeResource SystemAccentColorDark2}" /></ResourceDictionary>
                    </ResourceDictionary.ThemeDictionaries>
                  </ResourceDictionary>
                </TabView.Resources>
              </TabView>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind Outputs.AccentTabs, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>

          <ControlExample x:Name="LaunchExample" SampleDefinition="TabView\CompleteTabviewWindowingSample.txt" HeaderText="{x:Bind Text.WindowHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Samples.Window.xaml, Mode=OneWay}" CSharp="{x:Bind Samples.Window.cSharp, Mode=OneWay}">
            <ControlExample.Example><Button Click="TabViewWindowingButton_Click" Content="{x:Bind Text.Launch, Mode=OneWay}" IsEnabled="{x:Bind CanLaunch, Mode=OneWay}" /></ControlExample.Example>
            <ControlExample.Output>
              <StackPanel Spacing="8">
                <TextBlock Text="{x:Bind windowCapabilityOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <TextBlock Text="{x:Bind windowOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" />
              </StackPanel>
            </ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed, h, inject, markRaw, nextTick, onBeforeUnmount, provide, reactive, ref, shallowReactive, shallowRef, type VNode } from 'vue'
import Button from '../../components/Button.vue'
import ComboBox from '../../components/ComboBox.vue'
import ControlExample from '../../components/ControlExample.vue'
import Frame from '../../components/Frame.vue'
import MenuFlyout from '../../components/MenuFlyout.vue'
import { MenuFlyoutItem } from '../../components/MenuFlyoutItems'
import Page from '../../components/Page.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TabView from '../../components/TabView.vue'
import TextBlock from '../../components/TextBlock.vue'
import { useI18n } from '../../components/i18n/index'
import { createTabViewCallbackSource, createTabViewHostAdapter, tabViewHostAdapterKey, type TabViewHostAdapter } from '../../components/tabViewHostAdapter'
import { xamlNameScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import SamplePage1 from '../samples/TabView/SamplePage1.vue'
import SamplePage2 from '../samples/TabView/SamplePage2.vue'
import SamplePage3 from '../samples/TabView/SamplePage3.vue'
import { createTabViewPwaHost, tabViewPwaHostKey, type TabViewPwaCapabilities, type TabViewPwaDocument, type TabViewPwaHost } from '../../components/tabViewPwaHost'
import { tabViewCapabilityText, tabViewDisplayModeText, tabViewOperationFailure } from '../samples/TabView/tabViewWindowStatus'

type Tab = { Header?: unknown; DataHeader?: string; IsClosable?: boolean; [key: string]: unknown }
type TabCollection = { Count: number; Add: (tab: unknown) => void; Remove: (tab: unknown) => void; RemoveAt: (index: number) => void; Insert: (index: number, tab: unknown) => void; GetAt: (index: number) => unknown }
type TabControl = { TabItems: TabCollection; TabItemsSource?: unknown[]; SelectedIndex: number; SelectedItem: Tab | null; TabWidthMode: string; CloseButtonOverlayMode: string; ContainerFromItem: (item: unknown) => Tab | null }
type Sample = { xaml: string; cSharp: string }

const definitions = import.meta.glob('../samples/TabView/*.txt', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const parseSample = (file: string): Sample => {
  const source = definitions[`../samples/TabView/${file}`] ?? ''
  const parts: Record<string, string[]> = {}
  let section = ''
  for (const line of source.split(/\r?\n/)) {
    const marker = /^---\s+(.+?)\s*$/.exec(line)
    if (marker) { section = marker[1].toLowerCase(); parts[section] = [] }
    else if (section) parts[section].push(line)
  }
  return { xaml: (parts.xaml ?? []).join('\n').trim(), cSharp: (parts['c#'] ?? []).join('\n').trim() }
}
const Samples = {
  Adding: parseSample('TabviewSupportAddingClosing.txt'), Markup: parseSample('TabviewTabviewitemsDefinedMarkup.txt'),
  Binding: parseSample('TabviewBoundCollectionMydata.txt'), Keyboard: parseSample('TabviewKeyboardingSupport.txt'),
  Custom: parseSample('TabViewYouPutCustomContent.txt'), Width: parseSample('TabViewTabWidthsEitherBe.txt'),
  Close: parseSample('TabViewCloseButtonBePersistent.txt'), Color: parseSample('TabviewColorTabIcons.txt'),
  Accent: parseSample('TabviewAccentColoredTabstrip.txt'), Window: parseSample('CompleteTabviewWindowingSample.txt')
}
const { t, locale } = useI18n()
const pageDescription = computed(() => t('TextControls.Control.TabView'))
const currentPage = inject<{ value: string }>('currentPage')
const { pageTheme } = createPageState(currentPage?.value || 'tabview')
const names = shallowReactive<Record<string, unknown>>({})
provide(xamlNameScopeKey, names)
const TabViewContextMenu = computed(() => names.TabViewContextMenu)
const TabView3 = computed(() => names.TabView3 as TabControl | undefined)
const TabView4 = computed(() => names.TabView4 as TabControl | undefined)
const textKeys: Record<string, string> = {
  AddingHeader: 'adding-header', MarkupHeader: 'markup-header', BindingHeader: 'binding-header', KeyboardHeader: 'keyboard-header',
  CustomHeader: 'custom-header', WidthHeader: 'width-header', CloseHeader: 'close-header', ColorHeader: 'color-header',
  AccentHeader: 'accent-header', WindowHeader: 'window-header', KeyboardNew: 'keyboard-new', KeyboardClose: 'keyboard-close',
  KeyboardNumber: 'keyboard-number', KeyboardLast: 'keyboard-last', CustomDescription: 'custom-description', CustomDragRegion: 'custom-drag-region',
  WindowSourceDescription: 'window-source-description', StripHeader: 'strip-header', StripFooter: 'strip-footer', Home: 'home',
  LongTab: 'long-tab', ThirdTab: 'third-tab', WidthOptionHeader: 'width-option-header', CloseOptionHeader: 'close-option-header',
  SizeToContent: 'size-to-content', Equal: 'equal', Compact: 'compact', Auto: 'auto', Always: 'always', OnHover: 'on-hover',
  ColorDescription: 'color-description', CommandPrompt: 'command-prompt', PowerShell: 'powershell', Linux: 'linux', Launch: 'launch'
}
const Text = computed(() => ({
  ...Object.fromEntries(Object.entries(textKeys).map(([key, resource]) => [key, t(`sample.tabview.${resource}`)])),
  Document0: t('sample.tabview.document', { index: 0 }), Document1: t('sample.tabview.document', { index: 1 }), Document2: t('sample.tabview.document', { index: 2 })
}))
const Outputs = reactive<Record<string, string>>({})
const pages = [SamplePage1, SamplePage2, SamplePage3]
const CreatePageContent = (index: number): VNode => markRaw(h(Frame, { Content: markRaw(h(pages[index % pages.length])) }))
const CreateNewTab = (index: number) => markRaw({
  Header: t('sample.tabview.document', { index }), IconSource: { Symbol: 'Document' },
  ContextFlyout: TabViewContextMenu.value, Content: CreatePageContent(index), IsClosable: true
})
const CreateNewMyData = (index: number) => markRaw({
  DataHeader: t('sample.tabview.mydata-document', { index }), DataIconSource: { Symbol: 'Placeholder' }, DataContent: CreatePageContent(index)
})
const myDatas = shallowReactive(Array.from({ length: 3 }, (_, index) => CreateNewMyData(index)))
const OutputName = (sender: TabControl) => Object.keys(names).find(key => {
  const control = names[key] as TabControl | undefined
  return control === sender || control?.TabItems === sender.TabItems
})
function TabView_Changed(sender: TabControl) {
  void nextTick(() => {
    if (!sender?.TabItems) return
    const name = OutputName(sender)
    if (!name) return
    const selected = sender.SelectedItem
    const header = selected?.Header ?? selected?.DataHeader ?? sender.ContainerFromItem?.(selected)?.Header ?? t('sample.tabview.none')
    Outputs[name] = t('sample.tabview.selection-output', { count: sender.TabItems.Count, index: sender.SelectedIndex, header: String(header) })
  })
}
async function TabView_Loaded(sender: TabControl) {
  if (sender.TabItems.Count === 0) for (let index = 0; index < 3; index++) sender.TabItems.Add(CreateNewTab(index))
  await nextTick()
  TabView_Changed(sender)
}
function TabView_AddButtonClick(sender: TabControl) { sender.TabItems.Add(CreateNewTab(sender.TabItems.Count)); TabView_Changed(sender) }
function TabView_TabCloseRequested(sender: TabControl, args: { Tab: unknown }) { sender.TabItems.Remove(args.Tab); TabView_Changed(sender) }
function TabView_BringIntoViewRequested(_sender: unknown, args: { Handled: boolean }) { args.Handled = true }
function TabViewItemsSourceSample_AddTabButtonClick(sender: TabControl) { myDatas.push(CreateNewMyData(myDatas.length)); void nextTick(() => TabView_Changed(sender)) }
function TabViewItemsSourceSample_TabCloseRequested(sender: TabControl, args: { Item: unknown }) {
  const index = myDatas.indexOf(args.Item as typeof myDatas[number])
  if (index !== -1) myDatas.splice(index, 1)
  void nextTick(() => TabView_Changed(sender))
}
function NewTabKeyboardAccelerator_Invoked(_sender: unknown, args: { Element: TabControl; Handled: boolean }) { TabView_AddButtonClick(args.Element); args.Handled = true }
function CloseSelectedTabKeyboardAccelerator_Invoked(_sender: unknown, args: { Element: TabControl; Handled: boolean }) {
  if (args.Element.SelectedItem?.IsClosable !== false) args.Element.TabItems.Remove(args.Element.SelectedItem)
  TabView_Changed(args.Element)
  args.Handled = true
}
function NavigateToNumberedTabKeyboardAccelerator_Invoked(sender: { Key: string }, args: { Element: TabControl; Handled: boolean }) {
  const number = Number(sender.Key.replace('Number', ''))
  const index = number === 9 ? args.Element.TabItems.Count - 1 : number - 1
  if (index >= 0 && index < args.Element.TabItems.Count) args.Element.SelectedIndex = index
  TabView_Changed(args.Element)
  args.Handled = true
}
function TabWidthBehaviorComboBox_SelectionChanged(sender: { SelectedIndex: number }) {
  const tabView = TabView3.value
  if (!tabView) return
  tabView.TabWidthMode = ['SizeToContent', 'Equal', 'Compact'][sender.SelectedIndex] ?? 'SizeToContent'
  TabView_Changed(tabView)
}
function TabCloseButtonOverlayModeComboBox_SelectionChanged(sender: { SelectedIndex: number }) {
  const tabView = TabView4.value
  if (!tabView) return
  tabView.CloseButtonOverlayMode = ['Auto', 'Always', 'OnPointerOver'][sender.SelectedIndex] ?? 'Always'
  TabView_Changed(tabView)
}
function TabViewContextMenu_Opening(menu: { Target: unknown; Items: { Clear: () => void; Add: (item: unknown) => void }; Hide: () => void }) {
  menu.Items.Clear()
  const element = menu.Target as { TabViewItem?: unknown } | null
  const target = (element?.TabViewItem ?? element) as { TabView?: TabControl; ParentTabView?: TabControl; Item?: unknown } | null
  const owner = target?.TabView ?? target?.ParentTabView ?? Object.values(names).find(value => {
    const control = value as TabControl
    return !!control?.TabItems && Array.from({ length: control.TabItems.Count }, (_, index) => control.TabItems.GetAt(index)).some(item => item === target || control.ContainerFromItem?.(item) === target)
  }) as TabControl | undefined
  if (!owner) { menu.Hide(); return }
  const items = owner.TabItemsSource ?? Array.from({ length: owner.TabItems.Count }, (_, index) => owner.TabItems.GetAt(index))
  const index = items.findIndex(item => item === target?.Item || item === target || owner.ContainerFromItem?.(item) === target)
  if (index === -1) { menu.Hide(); return }
  const move = (offset: number) => {
    const item = items[index]
    if (owner.TabItemsSource) { owner.TabItemsSource.splice(index, 1); owner.TabItemsSource.splice(index + offset, 0, item) }
    else { owner.TabItems.RemoveAt(index); owner.TabItems.Insert(index + offset, item) }
    owner.SelectedIndex = index + offset
    TabView_Changed(owner)
  }
  if (index > 0) menu.Items.Add(h(MenuFlyoutItem, { Text: t('sample.tabview.move-left'), onClick: () => move(-1) }))
  if (index < items.length - 1) menu.Items.Add(h(MenuFlyoutItem, { Text: t('sample.tabview.move-right'), onClick: () => move(1) }))
  if (items.length < 2) menu.Hide()
}
const suppliedAdapter = inject<TabViewHostAdapter<TabViewPwaDocument> | null>(tabViewHostAdapterKey, null)
const suppliedPwaHost = inject<TabViewPwaHost | null>(tabViewPwaHostKey, null)
// A page-owned browser host captures its selected example theme, including
// when the Gallery theme differs from the application's outer theme.
const pwaHost = !suppliedAdapter || suppliedPwaHost ? createTabViewPwaHost({
  BaseUrl: new URL(import.meta.env.BASE_URL, window.location.href).href,
  Locale: () => locale,
  Theme: () => pageTheme.value === 'dark' ? 'Dark' : 'Light'
}) : null
const hostAdapter = pwaHost?.Adapter ?? suppliedAdapter ?? createTabViewHostAdapter<TabViewPwaDocument>()
const hostCapabilities = shallowRef<TabViewPwaCapabilities | null>(pwaHost?.Capabilities ?? null)
const releaseHostSubscription = pwaHost?.Subscribe(capabilities => { hostCapabilities.value = capabilities })
const windowCapabilityOutput = computed(() => tabViewCapabilityText(hostCapabilities.value, t, true))
const launching = ref(false)
const CanLaunch = computed(() => !launching.value)
const windowOutput = ref('')
const abortController = new AbortController()
onBeforeUnmount(() => { abortController.abort(); releaseHostSubscription?.(); if (pwaHost) void pwaHost.Dispose() })
async function TabViewWindowingButton_Click() {
  if (launching.value) return
  launching.value = true
  const items = shallowRef<TabViewPwaDocument[]>(Array.from({ length: 3 }, (_, index) => ({
    Id: `tabview-${crypto.randomUUID()}`, Header: t('sample.tabview.window-item', { index }),
    Title: t('sample.tabview.window-page', { index }), IsOn: false, Icon: 'Placeholder'
  })))
  const source = createTabViewCallbackSource({ Read: () => items.value, Write: next => { items.value = [...next] as typeof items.value } })
  try {
    const result = await hostAdapter.OpenWindow({ Source: source, Items: items.value, Tabs: items.value, Signal: abortController.signal })
    windowOutput.value = result.Status === 'Accepted'
      ? t('sample.tabview.window-connected', { count: result.Items.length, mode: tabViewDisplayModeText(hostCapabilities.value?.LastWindowDisplayMode ?? null, t) })
      : tabViewOperationFailure(result, hostCapabilities.value, t)
  } catch { windowOutput.value = t('sample.tabview.window-failed') }
  finally { launching.value = false }
}
</script>

<style scoped>
.gallery-page-content { min-width: 0; width: 100%; }
.gallery-page-content :deep(.example-display) { min-width: 0; overflow: hidden; }
.gallery-page-content :deep(.win-frame) { min-width: 0; min-height: 0; max-width: 100%; }
</style>
