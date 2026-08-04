<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.mediaplayerelement')" />
          <WinTextBlock class="page-description" :Text="$t('text.plays-media-content')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.media.transport-controls')" :theme="pageTheme" :vue="transportCode">
              <template #example>
                <WinMediaPlayerElement
                  :Source="player1Source"
                  :PosterSource="poster"
                  MaxWidth="400"
                  :AutoPlay="false"
                  :AreTransportControlsEnabled="true" />
              </template>
              <template #options>
                <WinButton AutomationProperties.Name="Open file button" @Click="openFile">
                  <WinTextBlock :Text="$t('sample.media.open-file')" />
                </WinButton>
                <input ref="fileInput" class="media-file-input" type="file" accept="video/*" @change="onFileSelected" />
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.media.autoplay-video')" :theme="pageTheme" :vue="autoplayCode">
              <template #example>
                <WinMediaPlayerElement
                  :Source="fishesSource"
                  :PosterSource="poster"
                  MaxWidth="400"
                  :AutoPlay="true"
                  :Muted="true"
                  :AreTransportControlsEnabled="false" />
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinMediaPlayerElement from '../../components/WinMediaPlayerElement.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'mediaplayerelement');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const fileInput = ref(null);
const sampleRoot = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia';
const player1Source = ref(`${sampleRoot}/ladybug.wmv`);
const fishesSource = `${sampleRoot}/fishes.wmv`;
const poster = `${sampleRoot}/LandscapeImage5.jpg`;
let objectUrl = '';

const openFile = () => fileInput.value?.click();
const onFileSelected = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = URL.createObjectURL(file);
  player1Source.value = objectUrl;
};

onBeforeUnmount(() => {
  if (objectUrl) URL.revokeObjectURL(objectUrl);
});

const transportCode = computed(() => `<WinMediaPlayerElement Source="${sampleRoot}/ladybug.wmv"
                       MaxWidth="400"
                       AutoPlay="False"
                       AreTransportControlsEnabled="True" />`);
const autoplayCode = computed(() => `<WinMediaPlayerElement Source="${sampleRoot}/fishes.wmv"
                       MaxWidth="400"
                       AutoPlay="True" />`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.media-file-input { display: none; }
</style>
