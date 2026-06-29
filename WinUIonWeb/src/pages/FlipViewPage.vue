<template>
  <div>
    <h1 class="page-header">FlipView</h1>
    <p class="page-description">
      The FlipView lets you flip through a collection of items, one item at a time. It's great for displaying images from a gallery or items in a product details page.
    </p>

    <WinControlExample
      headerText="A simple FlipView with items declared inline."
      exampleHeight="270px">
      <template #example>
        <WinFlipView :items="imageItems" orientation="horizontal" style="width: 100%; max-width: 400px; height: 270px;">
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
      headerText="A FlipView showing data-bound content."
      exampleHeight="180px">
      <template #example>
        <WinFlipView :items="controlItems" orientation="horizontal" style="width: 100%; max-width: 400px; height: 180px;">
          <template #item="{ item }">
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
              <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: var(--card-background-secondary);">
                <div style="font-size: 36px;">{{ item.icon }}</div>
              </div>
              <div style="height: 60px; background: rgba(165, 165, 165, 0.2); display: flex; align-items: center; justify-content: center;">
                <div style="font-size: 20px; font-weight: 600;">{{ item.title }}</div>
              </div>
            </div>
          </template>
        </WinFlipView>
      </template>
    </WinControlExample>

    <WinControlExample
      headerText="A vertical FlipView."
      exampleHeight="270px">
      <template #example>
        <WinFlipView :items="imageItems" orientation="vertical" style="width: 100%; max-width: 400px; height: 270px;">
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
</template>

<script setup>
import WinFlipView from '../components/WinFlipView.vue';
import WinControlExample from '../components/WinControlExample.vue';

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
  { icon: '🔘', title: 'Button' },
  { icon: '☑️', title: 'CheckBox' },
  { icon: '📋', title: 'ComboBox' },
  { icon: '🔲', title: 'RadioButtons' },
  { icon: '🎚️', title: 'Slider' }
];
</script>

<style scoped>
.page-header {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.5;
}
</style>
