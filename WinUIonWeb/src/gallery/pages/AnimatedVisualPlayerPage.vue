<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.animatedvisualplayer')" />
        <TextBlock class="page-description" :Text="$t('text.animatedvisualplayer-description')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" v-bind="{ 'tooltipservice.tooltip': $t('sample.navigationview.change-theme') }" @Click="toggleTheme"><span class="icon">&#xE793;</span></Button>
          <ToggleButton :IsChecked="isFavoriteState" class="header-action" v-bind="{ 'tooltipservice.tooltip': isFavoriteState ? $t('sample.navigationview.remove-favorite') : $t('sample.navigationview.add-favorite') }" @update:IsChecked="toggleFavorite"><span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span></ToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" :headerText="$t('sample.animatedvisualplayer.playback')" :theme="pageTheme" :vue="playerCode">
          <template #example>
            <div class="animated-visual-player-sample">
              <TextBlock class="animated-visual-player-copy" :Text="$t('sample.animatedvisualplayer.description')" TextWrapping="WrapWholeWords" />
              <div class="animated-visual-player-frame">
                <AnimatedVisualPlayer ref="playerRef" :AutoPlay="false" :PlaybackRate="playbackRate" />
              </div>
              <div class="animated-visual-player-buttons">
                <Button AutomationProperties.Name="Play" v-bind="{ 'tooltipservice.tooltip': playTooltip }" @Click="play"><span class="icon">&#xE768;</span></Button>
                <ToggleButton AutomationProperties.Name="Pause" :IsChecked="paused" v-bind="{ 'tooltipservice.tooltip': pauseTooltip }" @update:IsChecked="onPausedChanged"><span class="icon">&#xE769;</span></ToggleButton>
                <Button AutomationProperties.Name="Stop" v-bind="{ 'tooltipservice.tooltip': stopTooltip }" @Click="stop"><span class="icon">&#xE71A;</span></Button>
                <Button AutomationProperties.Name="Reverse" v-bind="{ 'tooltipservice.tooltip': reverseTooltip }" @Click="reverse"><span class="icon">&#xE892;</span></Button>
              </div>
            </div>
          </template>
        </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import AnimatedVisualPlayer from '../../components/AnimatedVisualPlayer.vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'animatedvisualplayer');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const playerRef = ref(null);
const paused = ref(false);
const playbackRate = ref(1);
const playTooltip = computed(() => t('text.play'));
const pauseTooltip = computed(() => t('text.pause'));
const stopTooltip = computed(() => t('text.stop'));
const reverseTooltip = computed(() => t('sample.animatedvisualplayer.reverse'));

const play = () => {
  playbackRate.value = 1;
  paused.value = false;
  playerRef.value?.PlayAsync(0, 1, false);
};

const onPausedChanged = (value) => {
  paused.value = Boolean(value);
  if (paused.value) playerRef.value?.Pause();
  else playerRef.value?.Resume();
};

const stop = () => {
  paused.value = false;
  playbackRate.value = 1;
  playerRef.value?.Stop();
};

const reverse = () => {
  playbackRate.value = -1;
  paused.value = false;
  playerRef.value?.PlayAsync(1, 0, false);
};

const playerCode = computed(() => '<AnimatedVisualPlayer AutoPlay="False" />');

</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 0 8px; color: var(--text-primary); font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.animated-visual-player-sample { display: flex; flex-direction: column; align-items: center; width: 100%; }
.animated-visual-player-copy { max-width: 720px; align-self: center; line-height: 20px; }
.animated-visual-player-frame { width: 400px; height: 400px; max-width: 100%; margin: 20px 0; box-sizing: border-box; background: var(--card-bg); border: 1px solid var(--card-stroke); }
.animated-visual-player-buttons { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; width: 400px; max-width: 100%; margin: 12px; }
</style>
