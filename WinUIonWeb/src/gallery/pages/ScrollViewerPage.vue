<template>
  <ScrollViewer
    class="gallery-page-scroll"
    Width="100%"
    Height="100%"
    VerticalScrollBarVisibility="Auto"
    VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock
          class="page-description"
          :Text="$t('text.scrollviewer-description')"
          TextWrapping="WrapWholeWords" />
      </div>
      <div class="gallery-page-content">
        <ControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.scrollviewer.content')"
          :theme="pageTheme"
          :vue="contentInsideScrollViewerCode">
          <template #example>
            <ScrollViewer
              ref="ScrollViewerControl"
              Width="400"
              Height="266"
              HorizontalAlignment="Left"
              VerticalAlignment="Top"
              :IsTabStop="true"
              :IsVerticalScrollChainingEnabled="true"
              :ZoomMode="ZoomMode"
              :ZoomFactor="ZoomFactor"
              :HorizontalScrollMode="HorizontalScrollMode"
              :HorizontalScrollBarVisibility="HorizontalScrollBarVisibility"
              :VerticalScrollMode="VerticalScrollMode"
              :VerticalScrollBarVisibility="VerticalScrollBarVisibility"
              @ViewChanged="onViewChanged">
              <Image
                HorizontalAlignment="Left"
                VerticalAlignment="Top"
                v-bind="{ 'AutomationProperties.Name': $t('text.cliff') }"
                :Source="cliffImage"
                Stretch="None" />
            </ScrollViewer>
          </template>

          <template #options>
            <Grid
              Width="100%"
              MinWidth="200"
              ColumnDefinitions="Auto,*"
              RowDefinitions="Auto,Auto,Auto,Auto,Auto,Auto,Auto,Auto">
              <TextBlock Margin="0,0,10,0" VerticalAlignment="Center" :Text="$t('text.zoom-mode')" style="grid-column: 1; grid-row: 1;" />
              <ComboBox
                v-model:SelectedIndex="ZoomModeSelectedIndex"
                Width="100%"
                HorizontalAlignment="Stretch"
                v-bind="{ 'AutomationProperties.Name': $t('text.zoom-mode-automation-name') }"
                :ItemsSource="ZoomModeItems"
                style="grid-column: 2; grid-row: 1;" />

              <Slider
                v-model:Value="ZoomFactor"
                Width="100%"
                :Header="$t('text.zoom')"
                :IsEnabled="ZoomMode === 'Enabled'"
                :Maximum="10"
                :Minimum="0.1"
                Margin="0,10,0,0"
                style="grid-column: 1 / span 2; grid-row: 2;" />

              <TextBlock
                HorizontalAlignment="Center"
                Margin="0,12"
                :Text="$t('text.scroll-mode')"
                style="grid-column: 1 / span 2; grid-row: 3;" />

              <TextBlock Margin="0,0,10,0" VerticalAlignment="Center" :Text="$t('text.horizontal')" style="grid-column: 1; grid-row: 4;" />
              <ComboBox
                v-model:SelectedIndex="HorizontalScrollModeSelectedIndex"
                Width="100%"
                HorizontalAlignment="Stretch"
                v-bind="{ 'AutomationProperties.Name': $t('text.horizontal-scroll-mode-automation-name') }"
                :ItemsSource="ScrollModeItems"
                style="grid-column: 2; grid-row: 4;" />

              <TextBlock Margin="0,8,10,0" VerticalAlignment="Center" :Text="$t('text.vertical')" style="grid-column: 1; grid-row: 5;" />
              <ComboBox
                v-model:SelectedIndex="VerticalScrollModeSelectedIndex"
                Width="100%"
                Margin="0,8,0,0"
                HorizontalAlignment="Stretch"
                v-bind="{ 'AutomationProperties.Name': $t('text.vertical-scroll-mode-automation-name') }"
                :ItemsSource="ScrollModeItems"
                style="grid-column: 2; grid-row: 5; margin-top: 8px;" />

              <TextBlock
                HorizontalAlignment="Center"
                Margin="0,20,0,12"
                :Text="$t('text.scrollbar-visibility')"
                style="grid-column: 1 / span 2; grid-row: 6;" />

              <TextBlock Margin="0,0,10,0" VerticalAlignment="Center" :Text="$t('text.horizontal')" style="grid-column: 1; grid-row: 7;" />
              <ComboBox
                v-model:SelectedIndex="HorizontalScrollBarVisibilitySelectedIndex"
                Width="100%"
                HorizontalAlignment="Stretch"
                v-bind="{ 'AutomationProperties.Name': $t('text.horizontal-scrollbar-visibility-automation-name') }"
                :ItemsSource="ScrollBarVisibilityItems"
                style="grid-column: 2; grid-row: 7;" />

              <TextBlock Margin="0,8,10,0" VerticalAlignment="Center" :Text="$t('text.vertical')" style="grid-column: 1; grid-row: 8;" />
              <ComboBox
                v-model:SelectedIndex="VerticalScrollBarVisibilitySelectedIndex"
                Width="100%"
                Margin="0,8,0,0"
                HorizontalAlignment="Stretch"
                v-bind="{ 'AutomationProperties.Name': $t('text.vertical-scrollbar-visibility-automation-name') }"
                :ItemsSource="ScrollBarVisibilityItems"
                style="grid-column: 2; grid-row: 8; margin-top: 8px;" />
            </Grid>
          </template>
        </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import ComboBox from '../../components/ComboBox.vue'
import ControlExample from '../../components/ControlExample.vue'
import Grid from '../../components/Grid.vue'
import Image from '../../components/Image.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import Slider from '../../components/Slider.vue'
import TextBlock from '../../components/TextBlock.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'

const currentPage = inject<{ value: string }>('currentPage')
const pageKey = computed(() => currentPage?.value || 'scrollviewer')
const { pageTheme } = createPageState(pageKey.value)
const { t } = useI18n()

const cliffImage = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/cliff.jpg'
const ScrollViewerControl = ref<InstanceType<typeof ScrollViewer>>()
const ZoomModeValues = ['Disabled', 'Enabled'] as const
const ScrollModeValues = ['Disabled', 'Enabled', 'Auto'] as const
const ScrollBarVisibilityValues = ['Disabled', 'Auto', 'Hidden', 'Visible'] as const
const ZoomModeItems = computed(() => [t('text.disabled'), t('text.enabled')])
const ScrollModeItems = computed(() => [t('text.disabled'), t('text.enabled'), t('text.auto')])
const ScrollBarVisibilityItems = computed(() => [t('text.disabled'), t('text.auto'), t('text.hidden'), t('text.visible')])
const ZoomModeSelectedIndex = ref(1)
const ZoomFactor = ref(4)
const HorizontalScrollModeSelectedIndex = ref(1)
const VerticalScrollModeSelectedIndex = ref(1)
const HorizontalScrollBarVisibilitySelectedIndex = ref(1)
const VerticalScrollBarVisibilitySelectedIndex = ref(1)
const ZoomMode = computed(() => ZoomModeValues[ZoomModeSelectedIndex.value] ?? 'Enabled')
const HorizontalScrollMode = computed(() => ScrollModeValues[HorizontalScrollModeSelectedIndex.value] ?? 'Enabled')
const VerticalScrollMode = computed(() => ScrollModeValues[VerticalScrollModeSelectedIndex.value] ?? 'Enabled')
const HorizontalScrollBarVisibility = computed(() => ScrollBarVisibilityValues[HorizontalScrollBarVisibilitySelectedIndex.value] ?? 'Auto')
const VerticalScrollBarVisibility = computed(() => ScrollBarVisibilityValues[VerticalScrollBarVisibilitySelectedIndex.value] ?? 'Auto')

watch(ZoomMode, (value) => {
  if (value === 'Disabled') ZoomFactor.value = 2
})

const onViewChanged = ({ IsIntermediate }: { IsIntermediate: boolean }) => {
  if (IsIntermediate) return
  const currentZoomFactor = ScrollViewerControl.value?.ZoomFactor
  if (typeof currentZoomFactor === 'number') ZoomFactor.value = currentZoomFactor
}

const contentInsideScrollViewerCode = computed(() => `<ScrollViewer
  Height="266"
  Width="400"
  ZoomMode="${ZoomMode.value}"
  :ZoomFactor="${ZoomFactor.value}"
  :IsTabStop="true"
  :IsVerticalScrollChainingEnabled="true"
  HorizontalAlignment="Left"
  VerticalAlignment="Top"
  HorizontalScrollMode="${HorizontalScrollMode.value}"
  HorizontalScrollBarVisibility="${HorizontalScrollBarVisibility.value}"
  VerticalScrollMode="${VerticalScrollMode.value}"
  VerticalScrollBarVisibility="${VerticalScrollBarVisibility.value}">
  <Image
    Source="${cliffImage}"
    AutomationProperties.Name="cliff"
    Stretch="None"
    HorizontalAlignment="Left"
    VerticalAlignment="Top" />
</ScrollViewer>`)
</script>

<style scoped>
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); }
</style>
