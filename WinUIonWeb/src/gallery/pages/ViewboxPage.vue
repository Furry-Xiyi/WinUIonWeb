<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">Viewbox</h1>
      <p class="page-description">
        A container control that scales its content to fill the available space. Viewbox is useful for ensuring that content maintains its aspect ratio and scales appropriately when the available space changes.
      </p>
      <div class="page-header-actions">
        <WinButton
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model:IsChecked="isFavoriteState"
          @update:IsChecked="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example 1: Content inside of a Viewbox -->
    <WinControlExample
      headerText="Content inside of a Viewbox"
      :theme="pageTheme"
      :xamlCode="xamlCode"
      :csharpCode="vueCode">
      <template #example>
        <div
          class="viewbox-container"
          :style="{
            width: size + 'px',
            height: size + 'px',
            display: 'flex',
            alignItems: stretch === 'None' ? 'flex-start' : 'stretch',
            justifyContent: stretch === 'None' ? 'flex-start' : 'stretch'
          }">
          <div
            class="viewbox-content"
            :style="viewboxStyle">
            <div class="content-border">
              <div class="content-stack">
                <div class="color-bars">
                  <div class="color-bar" style="background-color: #0078D4;"></div>
                  <div class="color-bar" style="background-color: #10893E;"></div>
                  <div class="color-bar" style="background-color: #E81123;"></div>
                  <div class="color-bar" style="background-color: #FFB900;"></div>
                </div>
                <img src="https://picsum.photos/160/120?random=1" alt="Sample" class="sample-image" />
                <div class="sample-text">This is text.</div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #options>
        <div style="display: flex; flex-direction: column; gap: 16px; width: 200px;">
          <WinSlider
            v-model="size"
            :minimum="20"
            :maximum="300"
            header="Width/Height"
          />

          <div class="radio-group">
            <div class="radio-header">Stretch</div>
            <WinRadioButton value="None" v-model="stretch">
              None
            </WinRadioButton>
            <WinRadioButton value="Fill" v-model="stretch">
              Fill
            </WinRadioButton>
            <WinRadioButton value="Uniform" v-model="stretch">
              Uniform
            </WinRadioButton>
            <WinRadioButton value="UniformToFill" v-model="stretch">
              UniformToFill
            </WinRadioButton>
          </div>

          <div class="radio-group">
            <div class="radio-header">StretchDirection</div>
            <WinRadioButton value="UpOnly" v-model="stretchDirection">
              UpOnly
            </WinRadioButton>
            <WinRadioButton value="DownOnly" v-model="stretchDirection">
              DownOnly
            </WinRadioButton>
            <WinRadioButton value="Both" v-model="stretchDirection">
              Both
            </WinRadioButton>
          </div>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinSlider from '../../components/WinSlider.vue';
import WinRadioButton from '../../components/WinRadioButton.vue';

// Page theme
const pageTheme = ref('light');
const toggleTheme = () => {
  pageTheme.value = pageTheme.value === 'light' ? 'dark' : 'light';
};

// Favorite state
const isFavoriteState = ref(false);
const toggleFavorite = inject('toggleFavorite', () => {});

// Viewbox properties
const size = ref(200);
const stretch = ref('Uniform');
const stretchDirection = ref('Both');

// Computed style for viewbox content
const viewboxStyle = computed(() => {
  const contentNaturalWidth = 160;
  const contentNaturalHeight = 145;
  const containerWidth = size.value;
  const containerHeight = size.value;

  let width = contentNaturalWidth;
  let height = contentNaturalHeight;
  let transform = 'none';

  // Calculate scale based on stretch mode
  if (stretch.value !== 'None') {
    const scaleX = containerWidth / contentNaturalWidth;
    const scaleY = containerHeight / contentNaturalHeight;

    let scale = 1;

    switch (stretch.value) {
      case 'Fill':
        // Different scales for width and height
        transform = `scale(${scaleX}, ${scaleY})`;
        break;
      case 'Uniform':
        // Same scale, fit within container
        scale = Math.min(scaleX, scaleY);
        break;
      case 'UniformToFill':
        // Same scale, fill container (may crop)
        scale = Math.max(scaleX, scaleY);
        break;
    }

    // Apply stretch direction constraints
    if (stretch.value === 'Uniform' || stretch.value === 'UniformToFill') {
      if (stretchDirection.value === 'UpOnly' && scale < 1) {
        scale = 1;
      } else if (stretchDirection.value === 'DownOnly' && scale > 1) {
        scale = 1;
      }

      if (stretch.value !== 'Fill') {
        transform = `scale(${scale})`;
      }
    }
  }

  return {
    width: width + 'px',
    height: height + 'px',
    transform: transform,
    transformOrigin: 'top left'
  };
});

// Code examples
const xamlCode = computed(() => `<Viewbox Height="${size.value}" Width="${size.value}" Stretch="${stretch.value}" StretchDirection="${stretchDirection.value}">
    <Border BorderBrush="Gray" BorderThickness="15">
        <StackPanel Background="DarkGray">
            <StackPanel Orientation="Horizontal">
                <Rectangle Fill="Blue" Height="10" Width="40"/>
                <Rectangle Fill="Green" Height="10" Width="40"/>
                <Rectangle Fill="Red" Height="10" Width="40"/>
                <Rectangle Fill="Yellow" Height="10" Width="40"/>
            </StackPanel>
            <Image Source="ms-appx:///Assets/SampleMedia/Slices.png"/>
            <TextBlock Text="This is text." HorizontalAlignment="Center"/>
        </StackPanel>
    </Border>
</Viewbox>`);

const vueCode = computed(() => `<WinViewbox
  :width="${size.value}"
  :height="${size.value}"
  stretch="${stretch.value}"
  stretchDirection="${stretchDirection.value}">
  <div class="content-border">
    <div class="content-stack">
      <div class="color-bars">
        <div style="background: blue; width: 40px; height: 10px;"></div>
        <div style="background: green; width: 40px; height: 10px;"></div>
        <div style="background: red; width: 40px; height: 10px;"></div>
        <div style="background: yellow; width: 40px; height: 10px;"></div>
      </div>
      <img src="sample.png" />
      <div>This is text.</div>
    </div>
  </div>
</WinViewbox>`);
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
  line-height: 20px;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
  max-width: 800px;
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 8px;
}

.icon {
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
  font-size: 16px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-header {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.viewbox-container {
  border: 1px solid var(--control-stroke-default);
  background: var(--layer-fill-color-default);
  overflow: hidden;
  position: relative;
}

.viewbox-content {
  position: relative;
}

.content-border {
  border: 15px solid #808080;
  box-sizing: border-box;
}

.content-stack {
  background-color: #A9A9A9;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.color-bars {
  display: flex;
  width: 100%;
}

.color-bar {
  width: 40px;
  height: 10px;
  flex-shrink: 0;
}

.sample-image {
  width: 160px;
  height: 120px;
  display: block;
  object-fit: cover;
}

.sample-text {
  text-align: center;
  padding: 8px;
  color: #000;
  font-size: 14px;
}
</style>
