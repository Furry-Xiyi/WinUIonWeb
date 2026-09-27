<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollMode="Auto" VerticalScrollBarVisibility="Auto" HorizontalScrollMode="Disabled" HorizontalScrollBarVisibility="Disabled">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind Labels.title, Mode=OneWay}" />
          <StackPanel class="page-header-actions" Orientation="Horizontal" Spacing="4">
            <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind Labels.toggleTheme, Mode=OneWay}"><FontIcon Glyph="&#xE793;" /></Button>
            <ToggleButton class="header-action" Click="toggleFavorite" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" AutomationProperties.Name="{x:Bind Labels.favorite, Mode=OneWay}"><FontIcon Glyph="{x:Bind favoriteGlyph, Mode=OneWay}" /></ToggleButton>
          </StackPanel>
        </StackPanel>
        <StackPanel class="gallery-page-content" Margin="0,12,0,0">
          <RichTextBlock><Paragraph><Run Text="{x:Bind Labels.customizationIntro, Mode=OneWay}" /><Hyperlink Click="Hyperlink_Click"><Run Text="{x:Bind Labels.appWindowTitleBar, Mode=OneWay}" /></Hyperlink><Run Text="{x:Bind Labels.sampleSuffix, Mode=OneWay}" /></Paragraph></RichTextBlock>
          <ControlExample HorizontalContentAlignment="Stretch" HeaderText="{x:Bind Labels.configurationHeader, Mode=OneWay}" SampleDefinition="TitleBar\TitlebarConfiguration.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind configurationXaml, Mode=OneWay}">
            <ControlExample.Example>
              <Grid HorizontalAlignment="Stretch" VerticalAlignment="Center" Background="{ThemeResource CardBackgroundFillColorDefaultBrush}" BorderBrush="{ThemeResource SurfaceStrokeColorDefaultBrush}" BorderThickness="1" CornerRadius="{StaticResource OverlayCornerRadius}">
                <TitleBar x:Name="TitleBarControl" Title="{Binding ElementName=TitleBox, Path=Text, Mode=OneWay}" Subtitle="{Binding ElementName=SubtitleBox, Path=Text, Mode=OneWay}" IsBackButtonVisible="{Binding ElementName=BackButtonToggle, Path=IsOn, Mode=OneWay}" IsPaneToggleButtonVisible="{Binding ElementName=PaneToggle, Path=IsOn, Mode=OneWay}" LayoutUpdated="TitleBar_LayoutUpdated">
                  <TitleBar.Resources><HorizontalAlignment x:Key="TitleBarContentHorizontalAlignment">Stretch</HorizontalAlignment></TitleBar.Resources>
                  <TitleBar.IconSource><ImageIconSource ImageSource="https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/Tiles/GalleryIcon.ico" /></TitleBar.IconSource>
                  <TitleBar.RightHeader><PersonPicture Width="30" Height="30" Initials="JD" /></TitleBar.RightHeader>
                  <TitleBar.Content><AutoSuggestBox MaxWidth="580" HorizontalAlignment="Stretch" VerticalAlignment="Center" PlaceholderText="{x:Bind Labels.search, Mode=OneWay}" QueryIcon="Find" /></TitleBar.Content>
                </TitleBar>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options>
              <StackPanel Width="240" Orientation="Vertical" Spacing="12">
                <TextBox x:Name="TitleBox" Header="{x:Bind Labels.titleOption, Mode=OneWay}" Text="{x:Bind Labels.defaultTitle, Mode=OneWay}" />
                <TextBox x:Name="SubtitleBox" Header="{x:Bind Labels.subtitleOption, Mode=OneWay}" Text="{x:Bind Labels.defaultSubtitle, Mode=OneWay}" />
                <ToggleSwitch x:Name="BackButtonToggle" Header="{x:Bind Labels.backButtonOption, Mode=OneWay}" IsOn="False" />
                <ToggleSwitch x:Name="PaneToggle" Header="{x:Bind Labels.paneToggleOption, Mode=OneWay}" IsOn="False" />
              </StackPanel>
            </ControlExample.Options>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="Title" Value="{x:Bind TitleBox.Text, Mode=OneWay}" />
              <ControlExampleSubstitution Key="Subtitle" Value="{x:Bind SubtitleBox.Text, Mode=OneWay}" />
              <ControlExampleSubstitution Key="BackButtonVisibility" Value="{x:Bind BackButtonToggle.IsOn, Mode=OneWay}" />
              <ControlExampleSubstitution Key="PaneToggleVisibility" Value="{x:Bind PaneToggle.IsOn, Mode=OneWay}" />
            </ControlExample.Substitutions>
          </ControlExample>
          <ControlExample HorizontalContentAlignment="Stretch" HeaderText="{x:Bind Labels.dragHeader, Mode=OneWay}" SampleDefinition="TitleBar\TitlebarDragRegions.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind dragXaml, Mode=OneWay}" CSharp="{x:Bind dragCSharp, Mode=OneWay}">
            <ControlExample.Example><StackPanel MaxWidth="560" Orientation="Vertical" Spacing="12"><TextBlock HorizontalAlignment="Center" TextAlignment="Center" TextWrapping="WrapWholeWords" Text="{x:Bind Labels.dragDescription, Mode=OneWay}" /><Button HorizontalAlignment="Center" Click="CreateTitleBarDragRegionsWindowClick" Content="{x:Bind Labels.showWindow, Mode=OneWay}" Style="{StaticResource AccentButtonStyle}" /></StackPanel></ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind dragOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>
          <ControlExample HorizontalContentAlignment="Stretch" HeaderText="{x:Bind Labels.endToEndHeader, Mode=OneWay}" SampleDefinition="TitleBar\EndEndTitlebarSample.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind endToEndXaml, Mode=OneWay}" CSharp="{x:Bind endToEndCSharp, Mode=OneWay}">
            <ControlExample.Example><StackPanel MaxWidth="560" Orientation="Vertical" Spacing="12"><TextBlock HorizontalAlignment="Center" TextAlignment="Center" TextWrapping="WrapWholeWords" Text="{x:Bind Labels.endToEndDescription, Mode=OneWay}" /><Button HorizontalAlignment="Center" Click="CreateTitleBarWindowClick" Content="{x:Bind Labels.showWindow, Mode=OneWay}" Style="{StaticResource AccentButtonStyle}" /></StackPanel></ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind endToEndOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed, defineComponent, inject, onBeforeUnmount, provide, ref, shallowReactive } from 'vue'
import AutoSuggestBox from '../../components/AutoSuggestBox.vue'
import Button from '../../components/Button.vue'
import ControlExample from '../../components/ControlExample.vue'
import FontIcon from '../../components/FontIcon.vue'
import Grid from '../../components/Grid.vue'
import Page from '../../components/Page.vue'
import PersonPicture from '../../components/PersonPicture.vue'
import RichTextBlock from '../../components/RichTextBlock.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import TextBox from '../../components/TextBox.vue'
import TitleBar from '../../components/TitleBar.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import ToggleSwitch from '../../components/ToggleSwitch.vue'
import { ImageIconSource } from '../../components/IconSource'
import { Hyperlink, Paragraph, Run } from '../../components/TextInline'
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties'
import { useI18n } from '../../components/i18n/index'
import { createSystemBackdropWindow } from '../../components/systemBackdropHostAdapter'
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import { syncPwaWindowChrome } from '../../utils/pwaWindowChrome'
import { mountTitleBarSampleWindow } from '../samples/TitleBar/mountTitleBarSampleWindow'
import configurationDefinition from '../samples/TitleBar/TitlebarConfiguration.txt?raw'
import dragDefinition from '../samples/TitleBar/TitlebarDragRegions.txt?raw'
import endToEndDefinition from '../samples/TitleBar/EndEndTitlebarSample.txt?raw'
const HorizontalAlignment = defineComponent({ name: 'HorizontalAlignment', __xamlPrimitive: 'HorizontalAlignment', setup: () => () => null })
const i18n = useI18n()
const { t } = i18n
const currentPage = inject<{ value: string }>('currentPage')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'titlebar')
const Labels = computed(() => ({ title: t('text.titlebar'), toggleTheme: t('gallery.page-header.toggle-theme'), favorite: t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'), customizationIntro: t('sample.titlebar.customization-intro'), appWindowTitleBar: t('sample.titlebar.app-window-title-bar'), sampleSuffix: t('sample.titlebar.sample-suffix'), configurationHeader: t('sample.titlebar.configuration-header'), dragHeader: t('sample.titlebar.drag-header'), endToEndHeader: t('sample.titlebar.end-to-end-header'), search: t('sample.titlebar.search'), titleOption: t('sample.titlebar.title-option'), subtitleOption: t('sample.titlebar.subtitle-option'), defaultTitle: t('sample.titlebar.default-title'), defaultSubtitle: t('sample.titlebar.default-subtitle'), backButtonOption: t('sample.titlebar.back-button-option'), paneToggleOption: t('sample.titlebar.pane-toggle-option'), dragDescription: t('sample.titlebar.drag-description'), endToEndDescription: t('sample.titlebar.end-to-end-description'), showWindow: t('sample.systembackdrops.show-window') }))
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const names = shallowReactive<Record<string, any>>({})
const section = (definition: string, name: string) => definition.match(new RegExp('(?:^|\\r?\\n)--- ' + name + '\\r?\\n([\\s\\S]*?)(?=\\r?\\n--- |$)'))?.[1]?.trim() ?? ''
const configurationXaml = section(configurationDefinition, 'xaml'), dragXaml = section(dragDefinition, 'xaml'), dragCSharp = section(dragDefinition, 'c#'), endToEndXaml = section(endToEndDefinition, 'xaml'), endToEndCSharp = section(endToEndDefinition, 'c#')
const dragOutput = ref(''), endToEndOutput = ref('')
const subscriptions = new Set<() => void>()
onBeforeUnmount(() => { subscriptions.forEach(stop => stop()); subscriptions.clear() })
const openSample = async (kind: 'TitleBarDragRegions' | 'TitleBarEndToEnd') => {
  const output = kind === 'TitleBarDragRegions' ? dragOutput : endToEndOutput
  try {
    const handle = await createSystemBackdropWindow({ title: t(kind === 'TitleBarDragRegions' ? 'sample.titlebar.drag-window-title' : 'sample.titlebar.end-window-title'), width: 1000, height: 700, theme: 'Default', backdrop: { Type: 'Mica', Kind: 'Base' }, mountContent: (element, windowHandle) => mountTitleBarSampleWindow(element, windowHandle, kind, i18n.locale) })
    const stop = handle.Subscribe(state => { output.value = t(state.Status === 'Closed' ? 'sample.systembackdrops.closed' : state.Reason === 'NativeBackdropUnavailable' ? 'sample.titlebar.browser-host-unavailable' : 'sample.systembackdrops.window-opened') })
    subscriptions.add(stop)
  } catch (error) { output.value = t((error as { Code?: string }).Code === 'PopupBlocked' ? 'sample.systembackdrops.popup-blocked' : 'sample.systembackdrops.window-failed') }
}
const CreateTitleBarDragRegionsWindowClick = () => openSample('TitleBarDragRegions')
const CreateTitleBarWindowClick = () => openSample('TitleBarEndToEnd')
const TitleBar_LayoutUpdated = () => { syncPwaWindowChrome(window, pageTheme.value, document.getElementById('app') ?? undefined) }
const Hyperlink_Click = () => { window.open('https://github.com/microsoft/WinUI-Gallery/tree/main/WinUIGallery/Samples/AppWindowTitleBar', '_blank', 'noopener') }
provide(xamlNameScopeKey, names)
provide(xamlScopeKey, { Labels, favoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite, configurationXaml, dragXaml, dragCSharp, endToEndXaml, endToEndCSharp, dragOutput, endToEndOutput, CreateTitleBarDragRegionsWindowClick, CreateTitleBarWindowClick, TitleBar_LayoutUpdated, Hyperlink_Click })
</script>

<style scoped>
:deep(.page-heading) { position: relative; min-width: 0; }
:deep(.page-header) { font-size: 28px; font-weight: 600; margin: 0 80px 8px 0; color: var(--text-primary); }
:deep(.page-header-actions) { position: absolute; right: 0; top: 0; }
:deep(.win-titlebar) { min-width: 0; max-width: 100%; }
:deep(.win-textblock) { overflow-wrap: anywhere; }
</style>
