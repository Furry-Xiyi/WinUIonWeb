<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.image')" />
          <WinTextBlock class="page-description" :Text="$t('text.displays-an-image')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton v-model:IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.image.basic-local-file')" :theme="pageTheme" :vue="basicCode">
              <template #example>
                <WinImage :Source="media('treetops.jpg')" Height="100" :alt="$t('sample.image.treetops')" />
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.image.decoded-rendering-size')" :theme="pageTheme" :vue="decodedCode">
              <template #example>
                <WinImage :Source="media('treetops.jpg')" Height="100" DecodePixelHeight="100" :alt="$t('sample.image.treetops')" />
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.image.stretching')" :theme="pageTheme" :vue="stretchCode">
              <template #example>
                <WinImage :Source="media('valley.jpg')" Width="100" Height="100" :Stretch="stretchMode" :alt="$t('sample.image.valley')" />
              </template>
              <template #options>
                <WinRadioButton :Header="$t('sample.image.stretch-mode')" :ItemsSource="stretchItems" v-model:SelectedIndex="stretchIndex" />
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.image.nine-grid')" :theme="pageTheme" :vue="nineGridCode">
              <template #example>
                <div class="image-stack">
                  <WinTextBlock :Text="$t('sample.image.normal-image')" />
                  <WinImage :Source="media('ninegrid.gif')" Height="82" :alt="$t('sample.image.nine-grid')" />
                  <WinTextBlock :Text="$t('sample.image.stretched-evenly')" />
                  <WinImage class="nine-grid-even" :Source="media('ninegrid.gif')" Height="164" :alt="$t('sample.image.stretched-evenly')" />
                  <WinTextBlock :Text="$t('sample.image.stretched-nine-grid')" />
                  <div class="nine-grid-css" role="img" :aria-label="$t('sample.image.stretched-nine-grid')"></div>
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.image.svg')" :theme="pageTheme" :vue="svgCode">
              <template #example>
                <WinImage :Source="media('MirrorPCConsent.svg')" Height="100" alt="SVG" />
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.image.animated-gif')" :theme="pageTheme" :vue="gifCode">
              <template #example>
                <div class="image-stack">
                  <WinTextBlock :Text="$t('sample.image.gif-auto')" TextWrapping="Wrap" />
                  <WinImage :Source="media('animated.gif')" Height="40" HorizontalAlignment="Left" :alt="$t('sample.image.animated-gif')" />
                  <WinTextBlock :Text="$t('sample.image.gif-autoplay-false')" TextWrapping="Wrap" />
                  <div class="gif-paused">GIF</div>
                  <WinTextBlock :Text="$t('sample.image.gif-manual')" TextWrapping="Wrap" />
                  <WinImage v-if="gifPlaying" :Source="media('animated.gif')" Height="40" HorizontalAlignment="Left" :alt="$t('sample.image.animated-gif')" />
                  <div v-else class="gif-paused">GIF</div>
                </div>
              </template>
              <template #options>
                <div class="gif-buttons">
                  <WinButton @Click="gifPlaying = true"><WinTextBlock :Text="$t('text.play')" /></WinButton>
                  <WinButton @Click="gifPlaying = false"><WinTextBlock :Text="$t('text.stop')" /></WinButton>
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
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'image');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const base = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/';
const media = (name) => base + name;
const stretchValues = ['None', 'Fill', 'Uniform', 'UniformToFill'];
const stretchIndex = ref(0);
const stretchMode = computed(() => stretchValues[stretchIndex.value]);
const stretchItems = stretchValues.map((Text) => ({ Text }));
const gifPlaying = ref(false);

const basicCode = computed(() => `<WinImage Source="${media('treetops.jpg')}" Height="100" />`);
const decodedCode = computed(() => `<WinImage Source="${media('treetops.jpg')}" Height="100" DecodePixelHeight="100" />`);
const stretchCode = computed(() => `<WinImage Stretch="${stretchMode.value}" Height="100" Width="100" Source="${media('valley.jpg')}" />`);
const nineGridCode = computed(() => `<WinImage Source="${media('ninegrid.gif')}" Height="82" />
<WinImage Source="${media('ninegrid.gif')}" NineGrid="3,3,3,3" Height="164" />
<WinImage Source="${media('ninegrid.gif')}" NineGrid="30,20,30,20" Height="164" />`);
const svgCode = computed(() => `<WinImage Source="${media('MirrorPCConsent.svg')}" Height="100" />`);
const gifCode = computed(() => `<WinTextBlock Text="${t('sample.image.gif-auto')}" TextWrapping="Wrap" />
<WinImage Height="40" HorizontalAlignment="Left" Source="${media('animated.gif')}" />
<WinTextBlock Text="${t('sample.image.gif-autoplay-false')}" TextWrapping="Wrap" />
<WinImage Height="40" HorizontalAlignment="Left" AutoPlay="False" Source="${media('animated.gif')}" />
<WinTextBlock Text="${t('sample.image.gif-manual')}" TextWrapping="Wrap" />`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.header-action { width: 32px; height: 32px; min-width: 0; padding: 0; }
.icon { font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets"; font-size: 16px; }
.image-stack { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; color: var(--text-primary); }
.nine-grid-even { width: 260px; }
.nine-grid-css { width: 260px; height: 164px; border-image-source: url('https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/ninegrid.gif'); border-image-slice: 30 20 30 20 fill; border-image-width: 30px 20px 30px 20px; border-image-repeat: stretch; }
.gif-paused { width: 88px; height: 40px; display: grid; place-items: center; border-radius: 3px; color: white; background: linear-gradient(135deg, #2d69b3, #7b3fb5); font-weight: 600; }
.gif-buttons { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
</style>
