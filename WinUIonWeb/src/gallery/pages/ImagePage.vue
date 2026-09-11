<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.image')" />
        <TextBlock class="page-description" :Text="$t('text.image-description')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" v-bind="{ 'tooltipservice.tooltip': $t('sample.navigationview.change-theme') }" @Click="toggleTheme"><span class="icon">&#xE793;</span></Button>
          <ToggleButton :IsChecked="isFavoriteState" class="header-action" v-bind="{ 'tooltipservice.tooltip': isFavoriteState ? $t('sample.navigationview.remove-favorite') : $t('sample.navigationview.add-favorite') }" @update:IsChecked="toggleFavorite"><span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span></ToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" :headerText="$t('sample.image.basic-local-file')" :theme="pageTheme" :vue="basicCode">
          <template #example><Image :Source="treetops" Height="100" AutomationProperties.Name="Treetops" /></template>
        </ControlExample>

        <ControlExample class="basic-input-example-theme" :headerText="$t('sample.image.decoded-rendering-size')" :theme="pageTheme" :vue="decodedCode">
          <template #example><Image :Source="treetopsDecoded" Height="100" AutomationProperties.Name="Treetops" /></template>
        </ControlExample>

        <ControlExample class="basic-input-example-theme" :headerText="$t('sample.image.stretching')" :theme="pageTheme" :vue="stretchCode">
          <template #example><Image :Source="valley" Width="100" Height="100" :Stretch="stretchMode" AutomationProperties.Name="Valley" /></template>
          <template #options><RadioButton :Header="$t('sample.image.stretch-mode')" :ItemsSource="stretchItems" :SelectedIndex="stretchIndex" @update:SelectedIndex="stretchIndex = $event" /></template>
        </ControlExample>

        <ControlExample class="basic-input-example-theme" :headerText="$t('sample.image.nine-grid')" :theme="pageTheme" :vue="nineGridCode">
          <template #example>
            <div class="image-stack">
              <TextBlock :Text="$t('sample.image.normal-image')" />
              <Image :Source="nineGridImage" Height="82" AutomationProperties.Name="Nine grid" />
              <TextBlock :Text="$t('sample.image.stretched-evenly')" />
              <Image :Source="nineGridImage" Height="164" NineGrid="3,3,3,3" AutomationProperties.Name="Image stretched evenly" />
              <TextBlock :Text="$t('sample.image.stretched-nine-grid')" />
              <Image :Source="nineGridImage" Height="164" NineGrid="30,20,30,20" AutomationProperties.Name="Image stretched using nine grid" />
            </div>
          </template>
        </ControlExample>

        <ControlExample class="basic-input-example-theme" :headerText="$t('sample.image.svg')" :theme="pageTheme" :vue="svgCode">
          <template #example><Image :Source="mirrorConsent" Height="100" AutomationProperties.Name="SVG" /></template>
        </ControlExample>

        <ControlExample class="basic-input-example-theme" :headerText="$t('sample.image.animated-gif')" :theme="pageTheme" :vue="gifCode">
          <template #example>
            <div class="image-stack gif-stack">
              <TextBlock :Text="$t('sample.image.gif-auto')" TextWrapping="Wrap" />
              <Image :Source="animatedGif" Height="40" HorizontalAlignment="Left" AutomationProperties.Name="Animated GIF" />
              <TextBlock :Text="$t('sample.image.gif-autoplay-false')" TextWrapping="Wrap" />
              <Image :Source="pausedGif" Height="40" HorizontalAlignment="Left" AutomationProperties.Name="Animated GIF" />
              <TextBlock :Text="$t('sample.image.gif-manual')" TextWrapping="Wrap" />
              <Image ref="manualGifRef" :Source="pausedGif" Height="40" HorizontalAlignment="Left" AutomationProperties.Name="Animated GIF" @ImageOpened="gifReady = true" />
            </div>
          </template>
          <template #options>
            <div v-if="gifReady" class="gif-buttons">
              <Button @Click="playGif">{{ $t('text.play') }}</Button>
              <Button @Click="stopGif">{{ $t('text.stop') }}</Button>
            </div>
          </template>
        </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import Image from '../../components/Image.vue';
import RadioButton from '../../components/RadioButton.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'image');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const officialMediaRoot = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia';
const animatedGif = `${officialMediaRoot}/animated.gif`;
const mirrorConsent = `${officialMediaRoot}/MirrorPCConsent.svg`;
const nineGridImage = `${officialMediaRoot}/ninegrid.gif`;
const treetops = `${officialMediaRoot}/treetops.jpg`;
const valley = `${officialMediaRoot}/valley.jpg`;

const stretchValues = ['None', 'Fill', 'Uniform', 'UniformToFill'];
const stretchIndex = ref(0);
const stretchMode = computed(() => stretchValues[stretchIndex.value]);
const stretchItems = stretchValues.map((Text) => ({ Text }));
const treetopsDecoded = { UriSource: treetops, DecodePixelHeight: 100 };
const pausedGif = { UriSource: animatedGif, AutoPlay: false };
const manualGifRef = ref(null);
const gifReady = ref(false);

const playGif = () => manualGifRef.value?.Play();
const stopGif = () => manualGifRef.value?.Stop();

const basicCode = computed(() => `<Image Source="${officialMediaRoot}/treetops.jpg" Height="100" />`);
const decodedCode = computed(() => `<Image :Source="{ UriSource: '${officialMediaRoot}/treetops.jpg', DecodePixelHeight: 100 }" Height="100" />`);
const stretchCode = computed(() => `<Image Stretch="${stretchMode.value}" Height="100" Width="100" Source="${officialMediaRoot}/valley.jpg" />`);
const nineGridCode = computed(() => `<Image Source="${officialMediaRoot}/ninegrid.gif" Height="82" />
<Image Source="${officialMediaRoot}/ninegrid.gif" NineGrid="3,3,3,3" Height="164" />
<Image Source="${officialMediaRoot}/ninegrid.gif" NineGrid="30,20,30,20" Height="164" />`);
const svgCode = computed(() => `<Image Source="${officialMediaRoot}/MirrorPCConsent.svg" Height="100" />`);
const gifCode = computed(() => `<TextBlock Text="${t('sample.image.gif-auto')}" TextWrapping="Wrap" />
<Image Height="40" HorizontalAlignment="Left" Source="${officialMediaRoot}/animated.gif" />
<TextBlock Text="${t('sample.image.gif-autoplay-false')}" TextWrapping="Wrap" />
<Image :Source="{ UriSource: '${officialMediaRoot}/animated.gif', AutoPlay: false }" Height="40" HorizontalAlignment="Left" />
<TextBlock Text="${t('sample.image.gif-manual')}" TextWrapping="Wrap" />`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 0 8px; color: var(--text-primary); font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.image-stack { display: flex; flex-direction: column; align-items: flex-start; gap: 0; color: var(--text-primary); }
.gif-stack { gap: 12px; }
.gif-buttons { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
</style>
