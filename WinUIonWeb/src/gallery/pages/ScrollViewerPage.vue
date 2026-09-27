<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <StackPanel class="gallery-item-page">
      <StackPanel class="page-heading">
        <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
      </StackPanel>
      <StackPanel class="gallery-page-content">
        <ControlExample x:Name="Example1" class="scrollviewer-example" SampleDefinition="ScrollViewer\ContentInsideScrollviewer.txt" HeaderText="{x:Bind sampleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind sampleXaml, Mode=OneWay}" CSharp="{x:Bind sampleCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <ScrollViewer x:Name="ScrollViewerControl" class="scrollviewer-sample" Width="400" Height="266" HorizontalAlignment="Left" VerticalAlignment="Top" IsTabStop="True" IsVerticalScrollChainingEnabled="True" ZoomMode="{x:Bind zoomMode, Mode=OneWay}" HorizontalScrollMode="{x:Bind horizontalScrollMode, Mode=OneWay}" VerticalScrollMode="{x:Bind verticalScrollMode, Mode=OneWay}" HorizontalScrollBarVisibility="{x:Bind horizontalScrollBarVisibility, Mode=OneWay}" VerticalScrollBarVisibility="{x:Bind verticalScrollBarVisibility, Mode=OneWay}" Loaded="ScrollViewerControl_Loaded" ViewChanged="ScrollViewerControl_ViewChanged">
              <Image HorizontalAlignment="Left" VerticalAlignment="Top" AutomationProperties.Name="{x:Bind cliffName, Mode=OneWay}" Source="{x:Bind cliffImage}" Stretch="None" />
            </ScrollViewer>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options>
            <Grid class="scrollviewer-options" MinWidth="200">
              <Grid.ColumnDefinitions>
                <ColumnDefinition Width="Auto" />
                <ColumnDefinition Width="*" />
              </Grid.ColumnDefinitions>
              <Grid.RowDefinitions>
                <RowDefinition Height="Auto" />
                <RowDefinition Height="Auto" />
                <RowDefinition Height="Auto" />
                <RowDefinition Height="Auto" />
                <RowDefinition Height="Auto" />
                <RowDefinition Height="Auto" />
                <RowDefinition Height="Auto" />
                <RowDefinition Height="Auto" />
              </Grid.RowDefinitions>
              <TextBlock Margin="0,0,10,0" VerticalAlignment="Center" Text="{x:Bind zoomModeLabel, Mode=OneWay}" />
              <ComboBox x:Name="zoomCombo" Grid.Column="1" HorizontalAlignment="Stretch" AutomationProperties.Name="{x:Bind zoomModeAutomationName, Mode=OneWay}" SelectedIndex="1" SelectionChanged="ZoomModeComboBox_SelectionChanged">
                <ComboBoxItem Content="{x:Bind disabledLabel, Mode=OneWay}" />
                <ComboBoxItem Content="{x:Bind enabledLabel, Mode=OneWay}" />
              </ComboBox>
              <Slider x:Name="ZoomSlider" Grid.Row="1" Grid.ColumnSpan="2" Width="100%" Margin="0,10,0,0" Header="{x:Bind zoomLabel, Mode=OneWay}" IsEnabled="{x:Bind zoomEnabled, Mode=OneWay}" Maximum="{x:Bind ScrollViewerControl.MaxZoomFactor, Mode=OneWay}" Minimum="{x:Bind ScrollViewerControl.MinZoomFactor, Mode=OneWay}" Value="{x:Bind zoomValue, Mode=TwoWay}" ValueChanged="ZoomSlider_ValueChanged" />
              <TextBlock Grid.Row="2" Grid.ColumnSpan="2" Margin="0,12" HorizontalAlignment="Center" Text="{x:Bind scrollModeLabel, Mode=OneWay}" />
              <TextBlock Grid.Row="3" Margin="0,0,10,0" VerticalAlignment="Center" Text="{x:Bind horizontalLabel, Mode=OneWay}" />
              <ComboBox x:Name="hsmCombo" Grid.Row="3" Grid.Column="1" HorizontalAlignment="Stretch" AutomationProperties.Name="{x:Bind horizontalScrollModeAutomationName, Mode=OneWay}" SelectedIndex="1" SelectionChanged="hsmCombo_SelectionChanged">
                <ComboBoxItem Content="{x:Bind disabledLabel, Mode=OneWay}" />
                <ComboBoxItem Content="{x:Bind enabledLabel, Mode=OneWay}" />
                <ComboBoxItem Content="{x:Bind autoLabel, Mode=OneWay}" />
              </ComboBox>
              <TextBlock Grid.Row="4" Margin="0,8,10,0" VerticalAlignment="Center" Text="{x:Bind verticalLabel, Mode=OneWay}" />
              <ComboBox x:Name="vsmCombo" Grid.Row="4" Grid.Column="1" Margin="0,8,0,0" HorizontalAlignment="Stretch" AutomationProperties.Name="{x:Bind verticalScrollModeAutomationName, Mode=OneWay}" SelectedIndex="1" SelectionChanged="vsmCombo_SelectionChanged">
                <ComboBoxItem Content="{x:Bind disabledLabel, Mode=OneWay}" />
                <ComboBoxItem Content="{x:Bind enabledLabel, Mode=OneWay}" />
                <ComboBoxItem Content="{x:Bind autoLabel, Mode=OneWay}" />
              </ComboBox>
              <TextBlock Grid.Row="5" Grid.ColumnSpan="2" Margin="0,20,0,12" HorizontalAlignment="Center" Text="{x:Bind scrollbarVisibilityLabel, Mode=OneWay}" />
              <TextBlock Grid.Row="6" Margin="0,0,10,0" VerticalAlignment="Center" Text="{x:Bind horizontalLabel, Mode=OneWay}" />
              <ComboBox x:Name="hsbvCombo" Grid.Row="6" Grid.Column="1" HorizontalAlignment="Stretch" AutomationProperties.Name="{x:Bind horizontalScrollbarVisibilityAutomationName, Mode=OneWay}" SelectedIndex="1" SelectionChanged="hsbvCombo_SelectionChanged">
                <ComboBoxItem Content="{x:Bind disabledLabel, Mode=OneWay}" />
                <ComboBoxItem Content="{x:Bind autoLabel, Mode=OneWay}" />
                <ComboBoxItem Content="{x:Bind hiddenLabel, Mode=OneWay}" />
                <ComboBoxItem Content="{x:Bind visibleLabel, Mode=OneWay}" />
              </ComboBox>
              <TextBlock Grid.Row="7" Margin="0,8,10,0" VerticalAlignment="Center" Text="{x:Bind verticalLabel, Mode=OneWay}" />
              <ComboBox x:Name="vsbvCombo" Grid.Row="7" Grid.Column="1" Margin="0,8,0,0" HorizontalAlignment="Stretch" AutomationProperties.Name="{x:Bind verticalScrollbarVisibilityAutomationName, Mode=OneWay}" SelectedIndex="1" SelectionChanged="vsbvCombo_SelectionChanged">
                <ComboBoxItem Content="{x:Bind disabledLabel, Mode=OneWay}" />
                <ComboBoxItem Content="{x:Bind autoLabel, Mode=OneWay}" />
                <ComboBoxItem Content="{x:Bind hiddenLabel, Mode=OneWay}" />
                <ComboBoxItem Content="{x:Bind visibleLabel, Mode=OneWay}" />
              </ComboBox>
            </Grid>
          </ControlExample.Options>
        </ControlExample>
      </StackPanel>
    </StackPanel>
  </ScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import ComboBox, { ComboBoxItem } from '../../components/ComboBox.vue'
import ControlExample from '../../components/ControlExample.vue'
import Grid from '../../components/Grid.vue'
import ColumnDefinition from '../../components/ColumnDefinition.vue'
import RowDefinition from '../../components/RowDefinition.vue'
import Image from '../../components/Image.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import Slider from '../../components/Slider.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'
import officialSample from '../samples/ScrollViewer/ContentInsideScrollviewer.txt?raw'
import sampleCSharp from '../samples/ScrollViewer/ScrollViewerPage.xaml.cs?raw'

const currentPage = inject<{ value: string }>('currentPage')
const pageKey = computed(() => currentPage?.value || 'scrollviewer')
const { pageTheme } = createPageState(pageKey.value)
const { t } = useI18n()
const pageDescription = computed(() => t('text.scrollviewer-description'))
const sampleHeader = computed(() => t('sample.scrollviewer.content'))
const cliffName = computed(() => t('text.cliff'))
const zoomModeLabel = computed(() => t('text.zoom-mode'))
const zoomLabel = computed(() => t('text.zoom'))
const scrollModeLabel = computed(() => t('text.scroll-mode'))
const horizontalLabel = computed(() => t('text.horizontal'))
const verticalLabel = computed(() => t('text.vertical'))
const scrollbarVisibilityLabel = computed(() => t('text.scrollbar-visibility'))
const disabledLabel = computed(() => t('text.disabled'))
const enabledLabel = computed(() => t('text.enabled'))
const autoLabel = computed(() => t('text.auto'))
const hiddenLabel = computed(() => t('text.hidden'))
const visibleLabel = computed(() => t('text.visible'))
const zoomModeAutomationName = computed(() => t('text.zoom-mode-automation-name'))
const horizontalScrollModeAutomationName = computed(() => t('text.horizontal-scroll-mode-automation-name'))
const verticalScrollModeAutomationName = computed(() => t('text.vertical-scroll-mode-automation-name'))
const horizontalScrollbarVisibilityAutomationName = computed(() => t('text.horizontal-scrollbar-visibility-automation-name'))
const verticalScrollbarVisibilityAutomationName = computed(() => t('text.vertical-scrollbar-visibility-automation-name'))
const cliffImage = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/cliff.jpg'

type ZoomMode = 'Disabled' | 'Enabled'
type ScrollMode = 'Disabled' | 'Enabled' | 'Auto'
type ScrollBarVisibility = 'Disabled' | 'Auto' | 'Hidden' | 'Visible'
type Viewer = { ZoomFactor: number; MaxZoomFactor?: number; MinZoomFactor?: number; ChangeView: (horizontal: number | null, vertical: number | null, zoom: number | null) => boolean; ZoomToFactor: (zoom: number) => void }
type SelectionSender = { SelectedIndex: number }
const zoomModes: ZoomMode[] = ['Disabled', 'Enabled']
const scrollModes: ScrollMode[] = ['Disabled', 'Enabled', 'Auto']
const scrollbarVisibilities: ScrollBarVisibility[] = ['Disabled', 'Auto', 'Hidden', 'Visible']
const zoomMode = ref<ZoomMode>('Enabled')
const horizontalScrollMode = ref<ScrollMode>('Enabled')
const verticalScrollMode = ref<ScrollMode>('Enabled')
const horizontalScrollBarVisibility = ref<ScrollBarVisibility>('Auto')
const verticalScrollBarVisibility = ref<ScrollBarVisibility>('Auto')
const zoomEnabled = computed(() => zoomMode.value === 'Enabled')
const zoomValue = ref(4)
let scrollViewerControl: Viewer | undefined

const ScrollViewerControl_Loaded = (sender: Viewer) => {
  scrollViewerControl = sender
  sender.ZoomToFactor(4)
}
const ZoomModeComboBox_SelectionChanged = (sender: SelectionSender) => {
  zoomMode.value = zoomModes[sender.SelectedIndex] ?? 'Disabled'
  if (!zoomEnabled.value) scrollViewerControl?.ZoomToFactor(2)
}
const ZoomSlider_ValueChanged = (_sender: unknown, args: { NewValue: number }) => {
  if (scrollViewerControl && Math.abs(scrollViewerControl.ZoomFactor - args.NewValue) > 0.0001) {
    scrollViewerControl.ChangeView(null, null, args.NewValue)
  }
}
const hsmCombo_SelectionChanged = (sender: SelectionSender) => { horizontalScrollMode.value = scrollModes[sender.SelectedIndex] ?? 'Auto' }
const vsmCombo_SelectionChanged = (sender: SelectionSender) => { verticalScrollMode.value = scrollModes[sender.SelectedIndex] ?? 'Auto' }
const hsbvCombo_SelectionChanged = (sender: SelectionSender) => { horizontalScrollBarVisibility.value = scrollbarVisibilities[sender.SelectedIndex] ?? 'Auto' }
const vsbvCombo_SelectionChanged = (sender: SelectionSender) => { verticalScrollBarVisibility.value = scrollbarVisibilities[sender.SelectedIndex] ?? 'Auto' }
const ScrollViewerControl_ViewChanged = (sender: Viewer, args: { IsIntermediate: boolean }) => {
  if (!args.IsIntermediate) zoomValue.value = sender.ZoomFactor
}
const sampleXaml = computed(() => {
  const source = officialSample.split(/--- xaml\s*\r?\n/)[1]?.trim() ?? ''
  const substitutions: Record<string, string> = {
    ZoomMode: zoomMode.value,
    HorizontalScrollMode: horizontalScrollMode.value,
    VerticalScrollMode: verticalScrollMode.value,
    HorizontalScrollBarVisibility: horizontalScrollBarVisibility.value,
    VerticalScrollBarVisibility: verticalScrollBarVisibility.value
  }
  return source.replace(/\$\((\w+)\)/g, (_match: string, key: string) => substitutions[key] ?? '')
})
</script>

<style scoped>
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); }
.scrollviewer-sample { max-width: 100%; flex-shrink: 1; }
.scrollviewer-options { width: 100%; min-width: 200px; }
.scrollviewer-options :deep(.win-combo-box) { min-width: 0; max-width: 100%; }
.scrollviewer-example :deep(.example-display) { min-width: 0; overflow: hidden; }
.scrollviewer-example :deep(.example-options) { min-width: 0; overflow: hidden; }
</style>
