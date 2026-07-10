<template>
  <div class="gallery-item-page">
    <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.capture-element-camera')" />
          <WinTextBlock class="page-description" :Text="$t('text.captures-media-from-a-camera')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton v-model:IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.capture.preview')" :theme="pageTheme" :vue="captureCode">
              <template #example>
                <WinCaptureElementPreview ref="previewRef" :mirrored="mirrored" @ready="onCameraReady" />
              </template>
              <template #options>
                <div class="capture-options">
                  <WinToggleSwitch v-model:IsOn="mirrored" :Header="$t('sample.capture.mirror-preview')" :title="$t('sample.capture.mirror-tooltip')" />
                  <WinButton :IsEnabled="cameraReady" @Click="capture">
                    <WinTextBlock :Text="$t('sample.capture.capture-photo')" />
                  </WinButton>
                </div>
              </template>
            </WinControlExample>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinCaptureElementPreview from '../../components/WinCaptureElementPreview.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinToggleSwitch from '../../components/WinToggleSwitch.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'captureelement');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const mirrored = ref(false);
const previewRef = ref(null);
const cameraReady = ref(false);

const capture = () => previewRef.value?.capture();
const onCameraReady = (ready) => { cameraReady.value = ready; };

onMounted(() => {
  previewRef.value?.start();
});

const captureCode = computed(() => `<Grid RowDefinitions="Auto,*" ColumnDefinitions="*,100" MinWidth="400" MinHeight="300" RowSpacing="10" ColumnSpacing="4">
  <TextBlock x:Name="frameSourceName" />
  <MediaPlayerElement x:Name="captureElement" Stretch="Uniform" AutoPlay="True" />
  <TextBlock x:Name="capturedText" Text="${t('text.captured')}:" Visibility="Collapsed" />
</Grid>`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.header-action { width: 32px; height: 32px; min-width: 0; padding: 0; }
.icon { font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets"; font-size: 16px; }
.capture-options { width: 196px; display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
</style>
