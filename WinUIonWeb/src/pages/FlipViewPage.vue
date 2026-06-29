<template>
  <div class="control-page">
    <h1 class="page-header">FlipView</h1>
    <p class="page-description">
      The FlipView lets you flip through a collection of items, one item at a time. It's great for displaying images from a gallery or items in a product details page.
    </p>

    <!-- Example 1: Simple FlipView with images -->
    <WinSettingsCard
      header="A simple FlipView with items declared inline."
      description="Use the arrows to navigate through the images.">
      <template #default>
        <div style="width: 100%; max-width: 400px; height: 270px; border: 1px solid var(--control-stroke-default); border-radius: 4px; overflow: hidden;">
          <WinFlipView :items="imageItems" orientation="horizontal">
            <template #item="{ item }">
              <img
                :src="item.src"
                :alt="item.alt"
                style="width: 100%; height: 100%; object-fit: cover;" />
            </template>
          </WinFlipView>
        </div>
      </template>
    </WinSettingsCard>

    <!-- Example 2: FlipView with bound data -->
    <WinSettingsCard
      header="A FlipView showing data-bound content."
      description="FlipView with custom item templates.">
      <template #default>
        <div style="width: 100%; max-width: 400px; height: 180px; border: 1px solid var(--control-stroke-default); border-radius: 4px; overflow: hidden;">
          <WinFlipView :items="controlItems" orientation="horizontal">
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
        </div>
      </template>
    </WinSettingsCard>

    <!-- Example 3: Vertical FlipView -->
    <WinSettingsCard
      header="A vertical FlipView."
      description="Set the orientation to vertical to flip up and down.">
      <template #default>
        <div style="width: 100%; max-width: 400px; height: 270px; border: 1px solid var(--control-stroke-default); border-radius: 4px; overflow: hidden;">
          <WinFlipView :items="imageItems" orientation="vertical">
            <template #item="{ item }">
              <img
                :src="item.src"
                :alt="item.alt"
                style="width: 100%; height: 100%; object-fit: cover;" />
            </template>
          </WinFlipView>
        </div>
      </template>
    </WinSettingsCard>
  </div>
</template>

<script setup>
import WinFlipView from '../components/WinFlipView.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

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
.control-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
  line-height: 1.5;
}
</style>
