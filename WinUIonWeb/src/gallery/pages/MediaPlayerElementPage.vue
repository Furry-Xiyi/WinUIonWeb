<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock class="page-header" :Text="$t('text.mediaplayerelement')" />
        <WinTextBlock class="page-description" :Text="$t('text.mediaplayerelement-description')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <WinButton class="header-action" v-bind="{ 'tooltipservice.tooltip': $t('sample.navigationview.change-theme') }" @Click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
          <WinToggleButton :IsChecked="isFavoriteState" class="header-action" v-bind="{ 'tooltipservice.tooltip': isFavoriteState ? $t('sample.navigationview.remove-favorite') : $t('sample.navigationview.add-favorite') }" @update:IsChecked="toggleFavorite"><span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span></WinToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.media.transport-controls')" :theme="pageTheme" :vue="transportCode">
          <template #example>
            <WinMediaPlayerElement :Source="player1Source" MaxWidth="400" :AutoPlay="false" :AreTransportControlsEnabled="true" />
          </template>
          <template #options>
            <WinButton AutomationProperties.Name="Open file button" @Click="openFile">{{ $t('sample.media.open-file') }}</WinButton>
            <input
              ref="fileInput"
              class="media-file-input"
              type="file"
              @change="onFileSelected" />
          </template>
        </WinControlExample>

        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.media.autoplay-video')" :theme="pageTheme" :vue="autoplayCode">
          <template #example>
            <WinMediaPlayerElement :Source="player2Source" MaxWidth="400" :AutoPlay="true" />
          </template>
        </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, type Ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinMediaPlayerElement from '../../components/WinMediaPlayerElement.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject<Ref<string | undefined>>('currentPage');
const pageKey = computed(() => currentPage?.value || 'mediaplayerelement');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const officialGalleryMediaRoot = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia';
const officialVideo = `${officialGalleryMediaRoot}/ladybug.wmv`;
const officialAutoplayVideo = `${officialGalleryMediaRoot}/fishes.wmv`;
const fileInput = ref<HTMLInputElement | null>(null);
const player1Source = ref(officialVideo);
const player2Source = officialAutoplayVideo;
let objectUrl = '';

const openFile = () => fileInput.value?.click();
const onFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement | null;
  const file = input?.files?.[0];
  if (!file) return;
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = URL.createObjectURL(file);
  player1Source.value = objectUrl;
};

onBeforeUnmount(() => {
  if (objectUrl) URL.revokeObjectURL(objectUrl);
});

const transportCode = computed(() => `<WinMediaPlayerElement Source="${officialVideo}"
  MaxWidth="400"
  AutoPlay="False"
  AreTransportControlsEnabled="True" />`);
const autoplayCode = computed(() => `<WinMediaPlayerElement Source="${officialAutoplayVideo}"
  MaxWidth="400"
  AutoPlay="True" />`);

</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 0 8px; color: var(--text-primary); font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.media-file-input { display: none; }
</style>
