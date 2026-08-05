<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock class="page-header" :Text="$t('text.capture-element-camera-preview')" />
        <WinTextBlock class="page-description" :Text="$t('text.capture-element-description')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <WinButton class="header-action" v-bind="{ 'tooltipservice.tooltip': $t('sample.navigationview.change-theme') }" @Click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
          <WinToggleButton :IsChecked="isFavoriteState" class="header-action" v-bind="{ 'tooltipservice.tooltip': isFavoriteState ? $t('sample.navigationview.remove-favorite') : $t('sample.navigationview.add-favorite') }" @update:IsChecked="toggleFavorite"><span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span></WinToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.capture.preview')" :theme="pageTheme" :vue="captureCode">
          <template #example>
            <WinCaptureElement ref="captureRef" />
          </template>
          <template #options>
            <WinToggleSwitch :IsOn="mirrorPreview" :Header="$t('sample.capture.mirror-preview')" v-bind="{ 'tooltipservice.tooltip': $t('sample.capture.mirror-tooltip') }" @update:IsOn="onMirrorChanged" />
            <WinButton @Click="capturePhoto">{{ $t('sample.capture.capture-photo') }}</WinButton>
          </template>
        </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinCaptureElement from '../../components/WinCaptureElement.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinToggleSwitch from '../../components/WinToggleSwitch.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'captureelement');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const captureRef = ref(null);
const mirrorPreview = ref(false);

const onMirrorChanged = (value) => {
  mirrorPreview.value = Boolean(value);
  captureRef.value?.SetMirrorPreview(mirrorPreview.value);
};
const capturePhoto = () => captureRef.value?.CapturePhoto();

onMounted(() => captureRef.value?.StartCaptureElement());

const captureCode = computed(() => `<WinGrid RowDefinitions="Auto,*" ColumnDefinitions="*,100" MinWidth="400" MinHeight="300" RowSpacing="10" ColumnSpacing="4">
  <WinTextBlock x:Name="frameSourceName" />
  <WinMediaPlayerElement x:Name="captureElement" Stretch="Uniform" AutoPlay="True" />
  <WinTextBlock x:Name="capturedText" Text="Captured:" Visibility="Collapsed" />
  <WinGrid Grid.Row="1" Grid.Column="1">
    <WinScrollViewer VerticalScrollMode="Auto" VerticalScrollBarVisibility="Auto">
      <WinStackPanel Spacing="2" />
    </WinScrollViewer>
  </WinGrid>
</WinGrid>`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 0 8px; color: var(--text-primary); font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
</style>
