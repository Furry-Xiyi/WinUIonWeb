<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.scrollviewer')" />
          <WinTextBlock class="page-description" :Text="$t('text.scrollviewer-description')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.scrollviewer.content')" :theme="pageTheme" :vue="scrollViewerCode">
              <template #example>
                <WinScrollViewer
                  ref="scrollViewerRef"
                  Width="400"
                  Height="266"
                  HorizontalAlignment="Left"
                  VerticalAlignment="Top"
                  :IsTabStop="true"
                  :IsVerticalScrollChainingEnabled="true"
                  :ZoomMode="zoomMode"
                  :ZoomFactor="zoomFactor"
                  :HorizontalScrollMode="horizontalScrollMode"
                  :VerticalScrollMode="verticalScrollMode"
                  :HorizontalScrollBarVisibility="horizontalScrollBarVisibility"
                  :VerticalScrollBarVisibility="verticalScrollBarVisibility">
                  <img class="cliff-image-none" :src="cliffImage" alt="" />
                </WinScrollViewer>
              </template>
              <template #options>
                <WinGrid MinWidth="200" ColumnDefinitions="Auto,*" RowDefinitions="Auto,Auto,Auto,Auto,Auto,Auto,Auto,Auto">
                  <WinTextBlock Margin="0,0,10,0" VerticalAlignment="Center" Text="ZoomMode" style="grid-column: 1; grid-row: 1;" />
                  <WinComboBox v-model:SelectedIndex="zoomModeIndex" Width="130" :ItemsSource="scrollViewerZoomModeItems" DisplayMemberPath="Text" style="grid-column: 2; grid-row: 1;" />
                  <WinSlider v-model:Value="zoomFactor" Header="Zoom" :IsEnabled="zoomMode !== 'Disabled'" :Maximum="10" :Minimum="0.1" Margin="0,10,0,0" style="grid-column: 1 / span 2; grid-row: 2;" />
                  <WinTextBlock HorizontalTextAlignment="Center" Margin="0,12" Text="ScrollMode" style="grid-column: 1 / span 2; grid-row: 3;" />
                  <WinTextBlock Margin="0,0,10,0" VerticalAlignment="Center" Text="Horizontal" style="grid-column: 1; grid-row: 4;" />
                  <WinComboBox v-model:SelectedIndex="horizontalScrollModeIndex" Width="130" :ItemsSource="scrollModeItems" DisplayMemberPath="Text" style="grid-column: 2; grid-row: 4;" />
                  <WinTextBlock Margin="0,8,10,0" VerticalAlignment="Center" Text="Vertical" style="grid-column: 1; grid-row: 5;" />
                  <WinComboBox v-model:SelectedIndex="verticalScrollModeIndex" Width="130" :ItemsSource="scrollModeItems" DisplayMemberPath="Text" style="grid-column: 2; grid-row: 5; margin-top: 8px;" />
                  <WinTextBlock HorizontalTextAlignment="Center" Margin="0,20,0,12" Text="ScrollbarVisibility" style="grid-column: 1 / span 2; grid-row: 6;" />
                  <WinTextBlock Margin="0,0,10,0" VerticalAlignment="Center" Text="Horizontal" style="grid-column: 1; grid-row: 7;" />
                  <WinComboBox v-model:SelectedIndex="horizontalScrollBarVisibilityIndex" Width="130" :ItemsSource="scrollViewerScrollBarVisibilityItems" DisplayMemberPath="Text" style="grid-column: 2; grid-row: 7;" />
                  <WinTextBlock Margin="0,8,10,0" VerticalAlignment="Center" Text="Vertical" style="grid-column: 1; grid-row: 8;" />
                  <WinComboBox v-model:SelectedIndex="verticalScrollBarVisibilityIndex" Width="130" :ItemsSource="scrollViewerScrollBarVisibilityItems" DisplayMemberPath="Text" style="grid-column: 2; grid-row: 8; margin-top: 8px;" />
                </WinGrid>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinGrid from '../../components/WinGrid.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinSlider from '../../components/WinSlider.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'scrollviewer');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const cliffImage = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/cliff.jpg';
const scrollViewerZoomModeItems = [{ Text: 'Disabled' }, { Text: 'Enabled' }];
const scrollModeItems = [{ Text: 'Disabled' }, { Text: 'Enabled' }, { Text: 'Auto' }];
const scrollViewerScrollBarVisibilityItems = [{ Text: 'Disabled' }, { Text: 'Auto' }, { Text: 'Hidden' }, { Text: 'Visible' }];
const zoomModeIndex = ref(1);
const zoomFactor = ref(4);
const horizontalScrollModeIndex = ref(1);
const verticalScrollModeIndex = ref(1);
const horizontalScrollBarVisibilityIndex = ref(1);
const verticalScrollBarVisibilityIndex = ref(1);
const zoomMode = computed(() => scrollViewerZoomModeItems[zoomModeIndex.value]?.Text || 'Enabled');
const horizontalScrollMode = computed(() => scrollModeItems[horizontalScrollModeIndex.value]?.Text || 'Enabled');
const verticalScrollMode = computed(() => scrollModeItems[verticalScrollModeIndex.value]?.Text || 'Enabled');
const horizontalScrollBarVisibility = computed(() => scrollViewerScrollBarVisibilityItems[horizontalScrollBarVisibilityIndex.value]?.Text || 'Auto');
const verticalScrollBarVisibility = computed(() => scrollViewerScrollBarVisibilityItems[verticalScrollBarVisibilityIndex.value]?.Text || 'Auto');

const scrollViewerCode = computed(() => `<WinScrollViewer
  Width="400"
  Height="266"
  HorizontalAlignment="Left"
  VerticalAlignment="Top"
  IsTabStop="True"
  IsVerticalScrollChainingEnabled="True"
  ZoomMode="${zoomMode.value}"
  HorizontalScrollMode="${horizontalScrollMode.value}"
  HorizontalScrollBarVisibility="${horizontalScrollBarVisibility.value}"
  VerticalScrollMode="${verticalScrollMode.value}"
  VerticalScrollBarVisibility="${verticalScrollBarVisibility.value}">
  <Image Source="${cliffImage}" Stretch="None" AutomationProperties.Name="cliff" />
</WinScrollViewer>`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.cliff-image-none { display: block; width: auto; height: auto; max-width: none; }
</style>
