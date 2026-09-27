<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" AutomationProperties.Name="{x:Bind toggleThemeLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind toggleThemeLabel, Mode=OneWay}" Click="toggleTheme"><TextBlock class="icon" Text="&#xE793;" FontFamily="{ThemeResource SymbolThemeFontFamily}" /></Button>
            <ToggleButton class="header-action" AutomationProperties.Name="{x:Bind favoriteLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind favoriteLabel, Mode=OneWay}" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite"><TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" FontFamily="{ThemeResource SymbolThemeFontFamily}" /></ToggleButton>
          </StackPanel>
        </StackPanel>
        <StackPanel class="gallery-page-content">
          <ControlExample x:Name="Example1" HeaderText="{x:Bind integratedHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind integratedXaml, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel class="pips-gallery-stack">
                <FlipView x:Name="Gallery" Height="270" MaxWidth="400" AutomationProperties.AutomationControlType="List" AutomationProperties.LocalizedControlType="list" ItemsSource="{x:Bind Pictures}">
                  <FlipView.ItemTemplate>
                    <DataTemplate x:DataType="x:String"><Image Source="{x:Bind Mode=OneTime}" /></DataTemplate>
                  </FlipView.ItemTemplate>
                </FlipView>
                <PipsPager x:Name="FlipViewPipsPager" Margin="0,12,0,0" HorizontalAlignment="Center" NumberOfPages="{x:Bind Pictures.Count}" SelectedPageIndex="{x:Bind Path=Gallery.SelectedIndex, Mode=TwoWay}" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>
          <ControlExample x:Name="Example2" HeaderText="{x:Bind optionsHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind optionsXaml, Mode=OneWay}" CSharp="{x:Bind optionsCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <PipsPager x:Name="TestPipsPager2" NumberOfPages="10" Orientation="{x:Bind Orientation, Mode=OneWay}" PreviousButtonVisibility="{x:Bind PreviousButtonVisibility, Mode=OneWay}" NextButtonVisibility="{x:Bind NextButtonVisibility, Mode=OneWay}" SelectedIndexChanged="TestPipsPager2_SelectedIndexChanged" />
            </ControlExample.Example>
            <ControlExample.Output><TextBlock class="pips-selection-output" Text="{x:Bind selectionAnnouncement, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
            <ControlExample.Options>
              <StackPanel>
                <ComboBox x:Name="OrientationComboBox" Header="{x:Bind orientationLabel, Mode=OneWay}" SelectedValue="{x:Bind horizontalLabel, Mode=OneWay}" SelectionChanged="OrientationComboBox_SelectionChanged">
                  <x:String x:Uid="text.horizontal" />
                  <x:String x:Uid="text.vertical" />
                </ComboBox>
                <ComboBox x:Name="PrevButtonComboBox" Header="{x:Bind previousVisibilityLabel, Mode=OneWay}" SelectedValue="{x:Bind visibleLabel, Mode=OneWay}" SelectionChanged="PrevButtonComboBox_SelectionChanged">
                  <x:String x:Uid="text.visible" />
                  <x:String x:Uid="text.visible-on-pointer-over" />
                  <x:String x:Uid="text.collapsed" />
                </ComboBox>
                <ComboBox x:Name="NextButtonComboBox" Header="{x:Bind nextVisibilityLabel, Mode=OneWay}" SelectedValue="{x:Bind visibleLabel, Mode=OneWay}" SelectionChanged="NextButtonComboBox_SelectionChanged">
                  <x:String x:Uid="text.visible" />
                  <x:String x:Uid="text.visible-on-pointer-over" />
                  <x:String x:Uid="text.collapsed" />
                </ComboBox>
              </StackPanel>
            </ControlExample.Options>
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import Button from '../../components/Button.vue'
import ComboBox from '../../components/ComboBox.vue'
import ControlExample from '../../components/ControlExample.vue'
import FlipView from '../../components/FlipView.vue'
import Image from '../../components/Image.vue'
import Page from '../../components/Page.vue'
import PipsPager from '../../components/PipsPager.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { DataTemplate } from '../../components/CollectionProperties'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'
import integratedDefinition from '../samples/PipsPager/PipspagerIntegratedFlipview.txt?raw'
import optionsDefinition from '../samples/PipsPager/PipspagerOptionsChangeOrientation.txt?raw'
import optionsCSharp from '../samples/PipsPager/PipsPagerPage.xaml.cs?raw'

const currentPage = inject<{ value: string }>('currentPage')
const pageKey = computed(() => currentPage?.value || 'pipspager')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const { t } = useI18n()
const pageTitle = computed(() => t('text.pipspager'))
const pageDescription = computed(() => t('text.pipspager-description'))
const integratedHeader = computed(() => t('sample.pipspager.integrated-flipview'))
const optionsHeader = computed(() => t('sample.pipspager.options'))
const toggleThemeLabel = computed(() => t('gallery.page-header.toggle-theme'))
const favoriteLabel = computed(() => t('gallery.page-header.favorite'))
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const orientationLabel = computed(() => t('text.orientation'))
const horizontalLabel = computed(() => t('text.horizontal'))
const visibleLabel = computed(() => t('text.visible'))
const previousVisibilityLabel = computed(() => t('text.previous-button-visibility'))
const nextVisibilityLabel = computed(() => t('text.next-button-visibility'))
const sampleMedia = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia'
const Pictures = Array.from({ length: 8 }, (_, index) => `${sampleMedia}/LandscapeImage${index + 1}.jpg`)
const Orientation = ref('Horizontal')
const PreviousButtonVisibility = ref('Visible')
const NextButtonVisibility = ref('Visible')
const selectionAnnouncement = ref('')
interface ComboBoxSender { SelectedIndex: number }
interface SelectionChangedEventArgs { AddedItems: unknown[]; RemovedItems: unknown[] }
const OrientationComboBox_SelectionChanged = (sender: ComboBoxSender, _args: SelectionChangedEventArgs) => {
  Orientation.value = ['Horizontal', 'Vertical'][sender.SelectedIndex] ?? 'Horizontal'
}
const PrevButtonComboBox_SelectionChanged = (sender: ComboBoxSender, _args: SelectionChangedEventArgs) => {
  PreviousButtonVisibility.value = ['Visible', 'VisibleOnPointerOver', 'Collapsed'][sender.SelectedIndex] ?? 'Collapsed'
}
const NextButtonComboBox_SelectionChanged = (sender: ComboBoxSender, _args: SelectionChangedEventArgs) => {
  NextButtonVisibility.value = ['Visible', 'VisibleOnPointerOver', 'Collapsed'][sender.SelectedIndex] ?? 'Collapsed'
}
const TestPipsPager2_SelectedIndexChanged = (sender: { SelectedPageIndex: number; NumberOfPages: number }) => {
  selectionAnnouncement.value = t('text.page-selection-announcement', { page: sender.SelectedPageIndex + 1, total: sender.NumberOfPages })
  window.dispatchEvent(new CustomEvent('winui-announce', { detail: selectionAnnouncement.value }))
}
const sampleSection = (definition: string, section: string) => {
  const match = definition.match(new RegExp('(?:^|\\r?\\n)--- ' + section + '\\r?\\n([\\s\\S]*?)(?=\\r?\\n--- |$)'))
  return match?.[1].trim() ?? ''
}
const integratedXaml = sampleSection(integratedDefinition, 'xaml')
const optionsXaml = computed(() => sampleSection(optionsDefinition, 'xaml')
  .replaceAll('$(Orientation)', Orientation.value)
  .replaceAll('$(PrevButton)', PreviousButtonVisibility.value)
  .replaceAll('$(NextButton)', NextButtonVisibility.value))
</script>

<style scoped>
:deep(.page-heading) { position: relative; }
:deep(.page-header) { margin: 0 72px 8px 0; font-size: 28px; font-weight: 600; color: var(--text-primary); }
:deep(.page-description) { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
:deep(.page-header-actions) { position: absolute; top: 0; right: 0; gap: 4px; }
:deep(.pips-gallery-stack) {
  /* The official sample's StackPanel is measured by its 400px FlipView.
     ControlExample's display host grows its direct child by default; keep
     this sample sized to that measured width so the pager is centered under
     the FlipView rather than under the whole display card. */
  width: min(400px, 100%);
  max-width: 100%;
  min-width: 0;
  flex: 0 1 auto !important;
  align-self: flex-start;
}
:deep(.pips-selection-output) { min-width: 0; overflow-wrap: anywhere; }
:deep(.icon) { font-size: 16px; }
</style>
