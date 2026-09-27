<template>
  <Page xmlns:controlPages="using:WinUIGallery.ControlPages">
    <Page.Resources>
      <DataTemplate x:Key="LeftIconNavLinkItemTemplate" x:DataType="controlPages:NavLink">
        <Grid Margin="2,0,0,0" AutomationProperties.Name="{x:Bind Label}">
          <Grid.ColumnDefinitions>
            <ColumnDefinition Width="Auto" />
            <ColumnDefinition Width="*" />
          </Grid.ColumnDefinitions>
          <SymbolIcon Grid.Column="0" Symbol="{x:Bind Symbol}" />
          <TextBlock Grid.Column="1" Margin="24,0,0,0" VerticalAlignment="Center" Text="{x:Bind Label}" />
        </Grid>
      </DataTemplate>
      <DataTemplate x:Key="RightIconNavLinkItemTemplate" x:DataType="controlPages:NavLink">
        <Grid Margin="0,0,2,0" AutomationProperties.Name="{x:Bind Label}">
          <Grid.ColumnDefinitions>
            <ColumnDefinition Width="*" />
            <ColumnDefinition Width="Auto" />
          </Grid.ColumnDefinitions>
          <TextBlock Grid.Column="0" Margin="0,0,24,0" VerticalAlignment="Center" Text="{x:Bind Label}" />
          <SymbolIcon Grid.Column="1" Symbol="{x:Bind Symbol}" />
        </Grid>
      </DataTemplate>
    </Page.Resources>

    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" AutomationProperties.Name="{x:Bind themeButtonName, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind themeButtonName, Mode=OneWay}" Click="toggleTheme">
              <TextBlock class="icon" Text="&#xE793;" />
            </Button>
            <ToggleButton class="header-action" AutomationProperties.Name="{x:Bind favoriteButtonName, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind favoriteButtonName, Mode=OneWay}" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite">
              <TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" />
            </ToggleButton>
          </StackPanel>
        </StackPanel>

        <StackPanel class="gallery-page-content">
          <ControlExample class="splitview-example" x:Name="Example1" SampleDefinition="SplitView\BasicSplitview.txt" HeaderText="{x:Bind sampleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind splitViewXaml, Mode=OneWay}" CSharp="{x:Bind splitViewCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <Grid class="split-view-sample-host" Height="300" Width="400" VerticalAlignment="Top">
                <SplitView
                  x:Name="splitView"
                  CompactPaneLength="{x:Bind compactPaneLengthSlider.Value, Mode=OneWay}"
                  DisplayMode="CompactOverlay"
                  IsPaneOpen="{x:Bind togglePaneButton.IsChecked, Mode=TwoWay, Converter={StaticResource nullableBooleanToBooleanConverter}}"
                  IsTabStop="False"
                  MaxWidth="400"
                  OpenPaneLength="{x:Bind openPaneLengthSlider.Value, Mode=OneWay}"
                  PaneBackground="{ThemeResource SystemControlBackgroundChromeMediumLowBrush}">
                  <SplitView.Pane>
                    <Grid class="split-pane-layout">
                      <Grid.RowDefinitions>
                        <RowDefinition Height="Auto" />
                        <RowDefinition Height="*" />
                        <RowDefinition Height="Auto" />
                      </Grid.RowDefinitions>
                      <TextBlock x:Name="PaneHeader" Margin="60,12,0,0" Style="{StaticResource BaseTextBlockStyle}" Text="{x:Bind paneContentLabel, Mode=OneWay}" />
                      <ListView x:Name="NavLinksList" class="nav-links-list" Grid.Row="1" Margin="0,12,0,0" VerticalAlignment="Stretch" IsItemClickEnabled="True" ItemClick="NavLinksList_ItemClick" ItemsSource="{x:Bind NavLinks, Mode=OneWay}" ItemTemplate="{StaticResource LeftIconNavLinkItemTemplate}" SelectionChanged="NavLinksList_SelectionChanged" SelectionMode="Single" />
                    </Grid>
                  </SplitView.Pane>
                  <SplitView.Content>
                    <Grid class="split-content-layout">
                      <Grid.RowDefinitions>
                        <RowDefinition Height="Auto" />
                        <RowDefinition Height="*" />
                      </Grid.RowDefinitions>
                      <TextBlock Margin="12,12,0,0" Style="{StaticResource BaseTextBlockStyle}" Text="{x:Bind splitViewContentLabel, Mode=OneWay}" />
                      <TextBlock x:Name="content" Grid.Row="1" Margin="12,12,0,0" Style="{StaticResource BodyTextBlockStyle}" Text="{x:Bind selectedContent, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                    </Grid>
                  </SplitView.Content>
                </SplitView>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output>
              <TextBlock class="splitview-output" Text="{x:Bind selectedContent, Mode=OneWay}" TextWrapping="WrapWholeWords" />
            </ControlExample.Output>
            <ControlExample.Options>
              <StackPanel class="split-options">
                <ToggleButton x:Name="togglePaneButton" Content="{x:Bind isPaneOpenLabel, Mode=OneWay}" Checked="togglePaneButton_CheckedChanged" Unchecked="togglePaneButton_CheckedChanged" IsChecked="True" />
                <ToggleSwitch MinWidth="120" Margin="0,12,0,0" Header="{x:Bind placementLabel, Mode=OneWay}" OffContent="{x:Bind leftLabel, Mode=OneWay}" OnContent="{x:Bind rightLabel, Mode=OneWay}" Toggled="PanePlacement_Toggled" />
                <ComboBox x:Name="displayModeCombobox" Width="196" Margin="0,4,0,0" VerticalAlignment="Center" Header="{x:Bind displayModeLabel, Mode=OneWay}" SelectedIndex="0" SelectionChanged="displayModeCombobox_SelectionChanged">
                  <ComboBoxItem Content="{x:Bind inlineLabel, Mode=OneWay}" Tag="Inline" />
                  <ComboBoxItem Content="{x:Bind compactInlineLabel, Mode=OneWay}" Tag="CompactInline" />
                  <ComboBoxItem Content="{x:Bind overlayLabel, Mode=OneWay}" Tag="Overlay" />
                  <ComboBoxItem Content="{x:Bind compactOverlayLabel, Mode=OneWay}" Tag="CompactOverlay" />
                </ComboBox>
                <ComboBox x:Name="paneBackgroundCombobox" Width="196" Margin="0,12,0,0" VerticalAlignment="Center" Header="{x:Bind paneBackgroundLabel, Mode=OneWay}" SelectedIndex="0" SelectionChanged="paneBackgroundCombobox_SelectionChanged">
                  <ComboBoxItem Content="{x:Bind themeBackgroundLabel, Mode=OneWay}" Tag="{}{ThemeResource SystemControlBackgroundChromeMediumLowBrush}" />
                  <ComboBoxItem Content="{x:Bind redLabel, Mode=OneWay}" Tag="Red" />
                  <ComboBoxItem Content="{x:Bind blueLabel, Mode=OneWay}" Tag="Blue" />
                  <ComboBoxItem Content="{x:Bind greenLabel, Mode=OneWay}" Tag="Green" />
                </ComboBox>
                <Slider x:Name="openPaneLengthSlider" Width="196" Margin="0,12,0,0" Header="{x:Bind openPaneLengthLabel, Mode=OneWay}" IsFocusEngagementEnabled="False" Maximum="500" Minimum="128" SnapsTo="StepValues" StepFrequency="8" Value="256" />
                <Slider x:Name="compactPaneLengthSlider" Width="196" Header="{x:Bind compactPaneLengthLabel, Mode=OneWay}" IsFocusEngagementEnabled="False" Maximum="128" Minimum="24" SnapsTo="StepValues" StepFrequency="8" Value="48" />
              </StackPanel>
            </ControlExample.Options>
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, onMounted, provide, ref, shallowReactive } from 'vue'
import Button from '../../components/Button.vue'
import ComboBox, { ComboBoxItem } from '../../components/ComboBox.vue'
import ControlExample from '../../components/ControlExample.vue'
import Grid from '../../components/Grid.vue'
import ListView from '../../components/ListView.vue'
import Page from '../../components/Page.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import Slider from '../../components/Slider.vue'
import SplitView from '../../components/SplitView.vue'
import StackPanel from '../../components/StackPanel.vue'
import SymbolIcon from '../../components/SymbolIcon.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import ToggleSwitch from '../../components/ToggleSwitch.vue'
import { useI18n } from '../../components/i18n/index'
import { xamlNameScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import basicSplitViewSample from '../samples/SplitView/BasicSplitview.txt?raw'
import splitViewCSharp from '../samples/SplitView/SplitViewPage.xaml.cs?raw'

const { t } = useI18n()
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'splitview')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const namescope = shallowReactive({})
provide(xamlNameScopeKey, namescope)
const pageTitle = computed(() => t('text.splitview'))
const pageDescription = computed(() => t('text.a-container-with-two-views-one-view-for-the-main'))
const sampleHeader = computed(() => t('text.a-basic-splitview'))
const themeButtonName = computed(() => t('gallery.page-header.toggle-theme'))
const favoriteButtonName = computed(() => t('gallery.page-header.favorite'))
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const paneContentLabel = computed(() => t('sample.splitview.pane-content'))
const splitViewContentLabel = computed(() => t('sample.splitview.splitview-content'))
const isPaneOpenLabel = computed(() => t('sample.splitview.is-pane-open'))
const placementLabel = computed(() => t('sample.splitview.placement'))
const leftLabel = computed(() => t('sample.splitview.left'))
const rightLabel = computed(() => t('sample.splitview.right'))
const displayModeLabel = computed(() => t('sample.splitview.display-mode'))
const paneBackgroundLabel = computed(() => t('sample.splitview.pane-background'))
const openPaneLengthLabel = computed(() => t('sample.splitview.open-pane-length'))
const compactPaneLengthLabel = computed(() => t('sample.splitview.compact-pane-length'))
const inlineLabel = computed(() => t('sample.splitview.inline'))
const compactInlineLabel = computed(() => t('sample.splitview.compact-inline'))
const overlayLabel = computed(() => t('sample.splitview.overlay'))
const compactOverlayLabel = computed(() => t('sample.splitview.compact-overlay'))
const themeBackgroundLabel = computed(() => t('sample.splitview.theme-background'))
const redLabel = computed(() => t('sample.splitview.red'))
const blueLabel = computed(() => t('sample.splitview.blue'))
const greenLabel = computed(() => t('sample.splitview.green'))

const NavLinks = computed(() => [
  { Label: t('sample.splitview.people'), Symbol: 'People' },
  { Label: t('sample.splitview.globe'), Symbol: 'Globe' },
  { Label: t('sample.splitview.message'), Symbol: 'Message' },
  { Label: t('sample.splitview.mail'), Symbol: 'Mail' }
])
const selectedNavSymbol = ref('')
const selectedContent = computed(() => {
  const selectedLink = NavLinks.value.find((link) => link.Symbol === selectedNavSymbol.value)
  return selectedLink ? t('sample.splitview.navigation-page', { page: selectedLink.Label }) : ''
})

const NavLinksList_ItemClick = (_sender, args) => {
  const navLink = args?.ClickedItem
  if (navLink?.Symbol) selectedNavSymbol.value = navLink.Symbol
}
const NavLinksList_SelectionChanged = (_sender, args) => {
  const navLink = args?.AddedItems?.[0]
  if (navLink?.Symbol) selectedNavSymbol.value = navLink.Symbol
}
const UpdateNavLinkItemLayout = () => {
  if (!namescope.NavLinksList) return
  namescope.NavLinksList.ItemTemplate = namescope.splitView?.PanePlacement === 'Right'
    ? '{StaticResource RightIconNavLinkItemTemplate}'
    : '{StaticResource LeftIconNavLinkItemTemplate}'
}
const PanePlacement_Toggled = (sender, args = sender) => {
  if (!namescope.splitView) return
  namescope.splitView.PanePlacement = Boolean(args?.IsOn ?? sender?.IsOn) ? 'Right' : 'Left'
  UpdateNavLinkItemLayout()
}
const togglePaneButton_CheckedChanged = () => UpdateNavLinkItemLayout()
const displayModeCombobox_SelectionChanged = (sender) => {
  const item = sender?.SelectedItem
  if (namescope.splitView && ['Inline', 'CompactInline', 'Overlay', 'CompactOverlay'].includes(item?.Tag)) {
    namescope.splitView.DisplayMode = item.Tag
  }
}
const paneBackgroundCombobox_SelectionChanged = (sender) => {
  const item = sender?.SelectedItem
  if (!namescope.splitView || typeof item?.Tag !== 'string') return
  namescope.splitView.PaneBackground = item.Tag.replace(/^\{\}/, '')
}
onMounted(() => {
  // Gallery's SelectedIndex=0 selection applies Inline after InitializeComponent.
  displayModeCombobox_SelectionChanged(namescope.displayModeCombobox)
  UpdateNavLinkItemLayout()
})

const escapeXaml = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const splitViewXaml = computed(() => {
  const selectedBackground = namescope.paneBackgroundCombobox?.SelectedItem?.Tag
  const substitutions = {
    PaneBackground: typeof selectedBackground === 'string' ? selectedBackground.replace(/^\{\}/, '') : '{ThemeResource SystemControlBackgroundChromeMediumLowBrush}',
    IsPaneOpen: namescope.splitView?.IsPaneOpen === false ? 'False' : 'True',
    OpenPaneLength: namescope.openPaneLengthSlider?.Value ?? 256,
    CompactPaneLength: namescope.compactPaneLengthSlider?.Value ?? 48,
    DisplayMode: namescope.splitView?.DisplayMode ?? 'Inline'
  }
  const templateKey = namescope.splitView?.PanePlacement === 'Right' ? 'RightIconNavLinkItemTemplate' : 'LeftIconNavLinkItemTemplate'
  return basicSplitViewSample.split(/--- xaml\s*\r?\n/)[1]?.trim()
    .replace(/\$\((\w+)\)/g, (_, key) => escapeXaml(substitutions[key] ?? ''))
    .replace('Text="PANE CONTENT"', `Text="${escapeXaml(paneContentLabel.value)}"`)
    .replace('Text="SPLITVIEW CONTENT"', `Text="${escapeXaml(splitViewContentLabel.value)}"`)
    .replace('StaticResource NavLinkItemTemplate', `StaticResource ${templateKey}`) ?? ''
})
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 72px 8px 0; }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
.split-view-sample-host { overflow: hidden; }
.split-pane-layout, .split-content-layout { height: 100%; min-width: 0; min-height: 0; overflow: hidden; }
.nav-links-list { min-width: 0; min-height: 0; overflow: hidden; }
.split-options { min-width: 196px; }
.splitview-output { white-space: normal; overflow-wrap: anywhere; }
@media (max-width: 739px) {
  .splitview-example :deep(.example-container) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto auto;
  }
  .splitview-example :deep(.example-display) { grid-column: 1; grid-row: 1; }
  .splitview-example :deep(.example-output) {
    grid-column: 1;
    grid-row: 2;
    justify-self: stretch;
    max-width: none;
    margin: 0 12px 12px;
  }
  .splitview-example :deep(.example-options) { grid-column: 1; grid-row: 3; margin-top: 0; }
}
</style>
