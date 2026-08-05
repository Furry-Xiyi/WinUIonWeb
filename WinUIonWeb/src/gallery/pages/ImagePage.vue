<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock class="page-header" :Text="$t('text.image')" />
        <WinTextBlock class="page-description" :Text="$t('text.image-description')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <WinButton class="header-action" v-bind="{ 'tooltipservice.tooltip': $t('sample.navigationview.change-theme') }" @Click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
          <WinToggleButton :IsChecked="isFavoriteState" class="header-action" v-bind="{ 'tooltipservice.tooltip': isFavoriteState ? $t('sample.navigationview.remove-favorite') : $t('sample.navigationview.add-favorite') }" @update:IsChecked="toggleFavorite"><span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span></WinToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.image.basic-local-file')" :theme="pageTheme" :vue="basicCode">
          <template #example><WinImage :Source="treetops" Height="100" AutomationProperties.Name="Treetops" /></template>
        </WinControlExample>

        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.image.decoded-rendering-size')" :theme="pageTheme" :vue="decodedCode">
          <template #example><WinImage :Source="treetopsDecoded" Height="100" AutomationProperties.Name="Treetops" /></template>
        </WinControlExample>

        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.image.stretching')" :theme="pageTheme" :vue="stretchCode">
          <template #example><WinImage :Source="valley" Width="100" Height="100" :Stretch="stretchMode" AutomationProperties.Name="Valley" /></template>
          <template #options><WinRadioButton :Header="$t('sample.image.stretch-mode')" :ItemsSource="stretchItems" :SelectedIndex="stretchIndex" @update:SelectedIndex="stretchIndex = $event" /></template>
        </WinControlExample>

        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.image.nine-grid')" :theme="pageTheme" :vue="nineGridCode">
          <template #example>
            <div class="image-stack">
              <WinTextBlock :Text="$t('sample.image.normal-image')" />
              <WinImage :Source="nineGridImage" Height="82" AutomationProperties.Name="Nine grid" />
              <WinTextBlock :Text="$t('sample.image.stretched-evenly')" />
              <WinImage :Source="nineGridImage" Height="164" NineGrid="3,3,3,3" AutomationProperties.Name="Image stretched evenly" />
              <WinTextBlock :Text="$t('sample.image.stretched-nine-grid')" />
              <WinImage :Source="nineGridImage" Height="164" NineGrid="30,20,30,20" AutomationProperties.Name="Image stretched using nine grid" />
            </div>
          </template>
        </WinControlExample>

        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.image.svg')" :theme="pageTheme" :vue="svgCode">
          <template #example><WinImage :Source="mirrorConsent" Height="100" AutomationProperties.Name="SVG" /></template>
        </WinControlExample>

        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.image.animated-gif')" :theme="pageTheme" :vue="gifCode">
          <template #example>
            <div class="image-stack gif-stack">
              <WinTextBlock :Text="$t('sample.image.gif-auto')" TextWrapping="Wrap" />
              <WinImage :Source="animatedGif" Height="40" HorizontalAlignment="Left" AutomationProperties.Name="Animated GIF" />
              <WinTextBlock :Text="$t('sample.image.gif-autoplay-false')" TextWrapping="Wrap" />
              <WinImage :Source="pausedGif" Height="40" HorizontalAlignment="Left" AutomationProperties.Name="Animated GIF" />
              <WinTextBlock :Text="$t('sample.image.gif-manual')" TextWrapping="Wrap" />
              <WinImage ref="manualGifRef" :Source="pausedGif" Height="40" HorizontalAlignment="Left" AutomationProperties.Name="Animated GIF" @ImageOpened="gifReady = true" />
            </div>
          </template>
          <template #options>
            <div v-if="gifReady" class="gif-buttons">
              <WinButton @Click="playGif">{{ $t('text.play') }}</WinButton>
              <WinButton @Click="stopGif">{{ $t('text.stop') }}</WinButton>
            </div>
          </template>
        </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinImage from '../../components/WinImage.vue';
import WinRadioButton from '../../components/WinRadioButton.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
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

const basicCode = computed(() => `<WinImage Source="${officialMediaRoot}/treetops.jpg" Height="100" />`);
const decodedCode = computed(() => `<WinImage :Source="{ UriSource: '${officialMediaRoot}/treetops.jpg', DecodePixelHeight: 100 }" Height="100" />`);
const stretchCode = computed(() => `<WinImage Stretch="${stretchMode.value}" Height="100" Width="100" Source="${officialMediaRoot}/valley.jpg" />`);
const nineGridCode = computed(() => `<WinImage Source="${officialMediaRoot}/ninegrid.gif" Height="82" />
<WinImage Source="${officialMediaRoot}/ninegrid.gif" NineGrid="3,3,3,3" Height="164" />
<WinImage Source="${officialMediaRoot}/ninegrid.gif" NineGrid="30,20,30,20" Height="164" />`);
const svgCode = computed(() => `<WinImage Source="${officialMediaRoot}/MirrorPCConsent.svg" Height="100" />`);
const gifCode = computed(() => `<WinTextBlock Text="${t('sample.image.gif-auto')}" TextWrapping="Wrap" />
<WinImage Height="40" HorizontalAlignment="Left" Source="${officialMediaRoot}/animated.gif" />
<WinTextBlock Text="${t('sample.image.gif-autoplay-false')}" TextWrapping="Wrap" />
<WinImage :Source="{ UriSource: '${officialMediaRoot}/animated.gif', AutoPlay: false }" Height="40" HorizontalAlignment="Left" />
<WinTextBlock Text="${t('sample.image.gif-manual')}" TextWrapping="Wrap" />`);
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
