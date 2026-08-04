<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.flipview')" />
          <WinTextBlock class="page-description" :Text="$t('text.the-flipview-lets-you-flip-through-a-collection')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample
              class="basic-input-example-theme"
              :headerText="$t('sample.flipview.simple')"
              exampleHeight="270px"
              :theme="pageTheme"
              :vue="simpleFlipViewVue">
              <template #example>
                <WinFlipView :ItemsSource="imageItems" Orientation="Horizontal" style="width: 100%; max-width: 400px; height: 270px;">
                  <template #item="{ item }">
                    <img
                      :src="item.src"
                      :alt="item.alt"
                      style="width: 100%; height: 100%; object-fit: cover;" />
                  </template>
                </WinFlipView>
              </template>
            </WinControlExample>

            <WinControlExample
              class="basic-input-example-theme"
              :headerText="$t('sample.flipview.bound-data-template')"
              exampleHeight="180px"
              :theme="pageTheme"
              :vue="boundFlipViewVue">
              <template #example>
                <WinFlipView :ItemsSource="controlItems" Orientation="Horizontal" style="width: 100%; max-width: 400px; height: 180px; border: 1px solid Black;">
                  <template #item="{ item }">
                    <div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
                      <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: var(--card-background-secondary);">
                        <img :src="item.ImagePath" :alt="item.Title" style="width: 36px; height: 36px; object-fit: contain;" />
                      </div>
                      <div style="height: 60px; background: rgba(165, 165, 165, 0.2); display: flex; align-items: center; justify-content: center;">
                        <WinTextBlock style="font-size: 20px; font-weight: 600;" :Text="item.Title" />
                      </div>
                    </div>
                  </template>
                </WinFlipView>
              </template>
            </WinControlExample>

            <WinControlExample
              class="basic-input-example-theme"
              :headerText="$t('sample.flipview.vertical')"
              exampleHeight="270px"
              :theme="pageTheme"
              :vue="verticalFlipViewVue">
              <template #example>
                <WinFlipView :ItemsSource="imageItems" Orientation="Vertical" style="width: 100%; max-width: 400px; height: 270px;">
                  <template #item="{ item }">
                    <img
                      :src="item.src"
                      :alt="item.alt"
                      style="width: 100%; height: 100%; object-fit: cover;" />
                  </template>
                </WinFlipView>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinFlipView from '../../components/WinFlipView.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'flipview');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

// Image items for examples 1 and 3
const imageItems = [
  {
    src: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/cliff.jpg',
    alt: 'Cliff'
  },
  {
    src: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/grapes.jpg',
    alt: 'Grapes'
  },
  {
    src: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/rainier.jpg',
    alt: 'Rainier'
  },
  {
    src: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/sunset.jpg',
    alt: 'Sunset'
  },
  {
    src: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/valley.jpg',
    alt: 'Valley'
  }
];

// Control items for example 2
const controlItems = [
  { Title: 'Button', ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/Button.png' },
  { Title: 'CheckBox', ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/Checkbox.png' },
  { Title: 'ComboBox', ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/ComboBox.png' },
  { Title: 'RadioButtons', ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/RadioButton.png' },
  { Title: 'Slider', ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/Slider.png' }
];

const simpleFlipViewVue = `<WinFlipView :ItemsSource="imageItems" Orientation="Horizontal" style="max-width: 400px; height: 270px;">
  <template #item="{ item }">
    <img :src="item.src" :alt="item.alt" style="width: 100%; height: 100%; object-fit: cover;" />
  </template>
</WinFlipView>`;

const boundFlipViewVue = `<WinFlipView :ItemsSource="controlItems" Orientation="Horizontal" style="max-width: 400px; height: 180px; border: 1px solid Black;">
  <template #item="{ item }">
    <img :src="item.ImagePath" :alt="item.Title" />
    <WinTextBlock :Text="item.Title" />
  </template>
</WinFlipView>`;

const verticalFlipViewVue = `<WinFlipView :ItemsSource="imageItems" Orientation="Vertical" style="max-width: 400px; height: 270px;">
  <template #item="{ item }">
    <img :src="item.src" :alt="item.alt" style="width: 100%; height: 100%; object-fit: cover;" />
  </template>
</WinFlipView>`;
</script>

<style scoped>
.page-header {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.page-heading {
  position: relative;
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
}

.icon {
  font-size: 16px;
}
</style>
