<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.mediaplayerelement')" />
        <TextBlock class="page-description" :Text="$t('text.mediaplayerelement-description')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" v-bind="{ 'tooltipservice.tooltip': $t('sample.navigationview.change-theme') }" @Click="toggleTheme"><span class="icon">&#xE793;</span></Button>
          <ToggleButton :IsChecked="isFavoriteState" class="header-action" v-bind="{ 'tooltipservice.tooltip': isFavoriteState ? $t('sample.navigationview.remove-favorite') : $t('sample.navigationview.add-favorite') }" @update:IsChecked="toggleFavorite"><span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span></ToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" :headerText="$t('sample.media.transport-controls')" :theme="pageTheme" :vue="transportCode">
          <template #example>
            <MediaPlayerElement :Source="player1Source" MaxWidth="400" :AutoPlay="false" :AreTransportControlsEnabled="true" />
          </template>
          <template #options>
            <Button AutomationProperties.Name="Open file button" @Click="openFile">{{ $t('sample.media.open-file') }}</Button>
            <input
              ref="fileInput"
              class="media-file-input"
              type="file"
              @change="onFileSelected" />
          </template>
        </ControlExample>

        <ControlExample class="basic-input-example-theme" :headerText="$t('sample.media.autoplay-video')" :theme="pageTheme" :vue="autoplayCode">
          <template #example>
            <MediaPlayerElement :Source="player2Source" MaxWidth="400" :AutoPlay="true" />
          </template>
        </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, type Ref } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import MediaPlayerElement from '../../components/MediaPlayerElement.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
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

const transportCode = computed(() => `<MediaPlayerElement Source="${officialVideo}"
  MaxWidth="400"
  AutoPlay="False"
  AreTransportControlsEnabled="True" />`);
const autoplayCode = computed(() => `<MediaPlayerElement Source="${officialAutoplayVideo}"
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
