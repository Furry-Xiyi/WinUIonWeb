<template>
  <div>
    <WinTextBlock class="page-header" :Text="$t('text.flipview')" />
    <WinTextBlock class="page-description" :Text="$t('text.the-flipview-lets-you-flip-through-a-collection')" TextWrapping="WrapWholeWords" />

    <WinTextBlock class="control-example-description" :Text="$t('text.a-simple-flipview-with-items-declared-inline')" />
    <WinControlExample
      exampleHeight="270px">
      <template #example>
        <WinFlipView :ItemsSource="imageItems" Orientation="horizontal" style="width: 100%; max-width: 400px; height: 270px;">
          <template #item="{ item }">
            <img
              :src="item.src"
              :alt="item.alt"
              style="width: 100%; height: 100%; object-fit: cover;" />
          </template>
        </WinFlipView>
      </template>
    </WinControlExample>

    <WinTextBlock class="control-example-description" Text="A FlipView showing data-bound content." />
    <WinControlExample
      exampleHeight="180px">
      <template #example>
        <WinFlipView :ItemsSource="controlItems" Orientation="horizontal" style="width: 100%; max-width: 400px; height: 180px;">
          <template #item="{ item }">
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
              <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: var(--card-background-secondary);">
                <WinTextBlock style="font-size: 36px;" :Text="item.icon" />
              </div>
              <div style="height: 60px; background: rgba(165, 165, 165, 0.2); display: flex; align-items: center; justify-content: center;">
                <WinTextBlock style="font-size: 20px; font-weight: 600;" :Text="item.title" />
              </div>
            </div>
          </template>
        </WinFlipView>
      </template>
    </WinControlExample>

    <WinTextBlock class="control-example-description" Text="A vertical FlipView." />
    <WinControlExample
      exampleHeight="270px">
      <template #example>
        <WinFlipView :ItemsSource="imageItems" Orientation="vertical" style="width: 100%; max-width: 400px; height: 270px;">
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
import WinFlipView from '../../components/WinFlipView.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';

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
.control-example-description {
  margin-top: 16px;
  font-weight: 600;
}
</style>
