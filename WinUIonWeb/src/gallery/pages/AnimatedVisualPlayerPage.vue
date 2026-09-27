<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.animatedvisualplayer')" />
        <TextBlock class="page-description" :Text="$t('text.animatedvisualplayer-description')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" ToolTipService.ToolTip="{x:Bind ThemeToolTip, Mode=OneWay}" Click="toggleTheme"><FontIcon class="icon" Glyph="&#xe793;" /></Button>
          <ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" class="header-action" ToolTipService.ToolTip="{x:Bind FavoriteToolTip, Mode=OneWay}" Click="toggleFavorite"><FontIcon class="icon" Glyph="{x:Bind ButtonContent1, Mode=OneWay}" /></ToggleButton>
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
                <Button AutomationProperties.Name="{x:Bind playTooltip, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind playTooltip, Mode=OneWay}" Click="play"><FontIcon class="icon" Glyph="&#xe768;" /></Button>
                <ToggleButton AutomationProperties.Name="{x:Bind pauseTooltip, Mode=OneWay}" IsChecked="{x:Bind paused, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind pauseTooltip, Mode=OneWay}" Click="OnPauseButtonClick"><FontIcon class="icon" Glyph="&#xe769;" /></ToggleButton>
                <Button AutomationProperties.Name="{x:Bind stopTooltip, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind stopTooltip, Mode=OneWay}" Click="stop"><FontIcon class="icon" Glyph="&#xe71a;" /></Button>
                <Button AutomationProperties.Name="{x:Bind reverseTooltip, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind reverseTooltip, Mode=OneWay}" Click="reverse"><FontIcon class="icon" Glyph="&#xe892;" /></Button>
              </div>
            </div>
          </template>
        </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import FontIcon from '../../components/FontIcon.vue';
import { computed as ButtonContentComputed, unref as ButtonContentUnref } from 'vue';
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
const ThemeToolTip = computed(() => t('gallery.page-header.toggle-theme'));
const FavoriteToolTip = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const OnPauseButtonClick = (sender) => onPausedChanged(Boolean(sender.IsChecked));

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

const ButtonContent1 = ButtonContentComputed(() => ButtonContentUnref(isFavoriteState) ? '' : '');
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
