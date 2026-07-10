<template>
  <div class="gallery-item-page">
    <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.animatedvisualplayer')" />
          <WinTextBlock class="page-description" :Text="$t('text.plays-animated-content')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton v-model:IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.animatedvisualplayer.playback')" :theme="pageTheme" :vue="playerCode">
              <template #example>
                <div class="avp-stack">
                  <WinTextBlock class="avp-copy" :Text="$t('sample.animatedvisualplayer.description')" TextWrapping="WrapWholeWords" />
                  <div class="avp-frame">
                    <WinAnimatedVisualPlayer :key="playerKey" :playing="playing" :reversed="reversed" :duration="duration" />
                  </div>
                  <div class="avp-buttons">
                    <WinButton AutomationProperties.Name="Play" :title="$t('text.play')" @Click="play"><span class="icon">&#xE768;</span></WinButton>
                    <WinToggleButton AutomationProperties.Name="Pause" v-model:IsChecked="paused" :title="$t('text.pause')"><span class="icon">&#xE769;</span></WinToggleButton>
                    <WinButton AutomationProperties.Name="Stop" :title="$t('text.stop')" @Click="stop"><span class="icon">&#xE71A;</span></WinButton>
                    <WinButton AutomationProperties.Name="Reverse" :title="$t('sample.animatedvisualplayer.reverse')" @Click="reverse"><span class="icon">&#xE892;</span></WinButton>
                  </div>
                </div>
              </template>
            </WinControlExample>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { computed, inject, ref, watch } from 'vue';
import WinAnimatedVisualPlayer from '../../components/WinAnimatedVisualPlayer.vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'animatedvisualplayer');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const playing = ref(false);
const paused = ref(false);
const reversed = ref(false);
const duration = ref(1800);
const playerKey = ref(0);
let stopping = false;

const play = () => { reversed.value = false; paused.value = false; playing.value = true; };
const stop = () => {
  stopping = true;
  playing.value = false;
  paused.value = false;
  reversed.value = false;
  playerKey.value += 1;
  requestAnimationFrame(() => { stopping = false; });
};
const reverse = () => { reversed.value = true; paused.value = false; playing.value = true; };

watch(paused, (value) => {
  if (stopping) return;
  playing.value = !value;
});

const playerCode = computed(() => `<WinAnimatedVisualPlayer AutoPlay="False" />`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.header-action { width: 32px; height: 32px; min-width: 0; padding: 0; }
.icon { font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets"; font-size: 16px; }
.avp-stack { display: flex; flex-direction: column; align-items: center; }
.avp-copy { max-width: 720px; color: var(--text-primary); line-height: 20px; }
.avp-frame { width: 400px; height: 400px; max-width: 100%; margin: 20px 0; background: var(--card-bg); border: 1px solid var(--card-stroke); }
.avp-buttons { width: 400px; max-width: 100%; margin: 12px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
</style>
