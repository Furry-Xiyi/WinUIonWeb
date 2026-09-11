<template>
  <div class="gallery-item-page">
    <div style="position: relative;" class="page-heading">
          <h1 class="page-header">IconElement</h1>
          <p class="page-description">
            Represents the base class for an icon UI element. IconElement is the parent class for BitmapIcon, FontIcon, ImageIcon, PathIcon, and SymbolIcon.
          </p>
          <div class="page-header-actions">
            <Button class="header-action" @click="toggleTheme"
             >
              <span class="icon">&#xE793;</span>
            </Button>
            <ToggleButton class="header-action" :IsChecked="isFavoriteState"
              @update:IsChecked="toggleFavorite"
             >
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <!-- Example 1: BitmapIcon with ShowAsMonochrome -->
            <ControlExample
              headerText="BitmapIcon"
              :theme="pageTheme"
              :templateCode="example1Template"
              :vueCode="example1Vue">
              <template #example>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                  <p style="margin: 0; font-size: 14px; color: var(--text-secondary); line-height: 1.5;">
                    The ShowAsMonochrome property (true by default) will result in a solid block of the foreground color if the property is set to true and the icon is more than one color. This behavior can be ignored by setting the ShowAsMonochrome property to false.
                  </p>
                  <div
                    class="bitmap-icon"
                    :class="{ monochrome: showAsMonochrome }"
                    :style="{
                      width: '50px',
                      height: '50px',
                      backgroundImage: 'url(https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/Slices.png)',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center'
                    }">
                  </div>
                </div>
              </template>
              <template #options>
                <CheckBox v-model="showAsMonochrome">
                  Monochrome
                </CheckBox>
              </template>
            </ControlExample>

            <!-- Example 2: FontIcon -->
            <ControlExample
              headerText="FontIcon"
              :theme="pageTheme"
              :templateCode="example2Template"
              :vueCode="example2Vue">
              <template #example>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                  <p style="margin: 0; font-size: 14px; color: var(--text-secondary); line-height: 1.5;">
                    Use FontIcon as the icon for a control if you want to specify a Glyph value from a FontFamily. Windows 10 uses the Segoe MDL2 Assets FontFamily and that is what this example is showing.
                  </p>
                  <Button style="width: auto;">
                    <span class="font-icon">&#xE790;</span>
                  </Button>
                </div>
              </template>
            </ControlExample>

            <!-- Example 3: ImageIcon (PNG) -->
            <ControlExample
              headerText="ImageIcon (PNG)"
              :theme="pageTheme"
              :templateCode="example3Template"
              :vueCode="example3Vue">
              <template #example>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                  <p style="margin: 0; font-size: 14px; color: var(--text-secondary); line-height: 1.5;">
                    To use an ImageIcon as the icon for a control, you can set image that has a file format supported by the Image class. The two examples here show a PNG and SVG image as the icon.
                  </p>
                  <Button style="width: 100px;">
                    <img src="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/Slices.png" alt="Slices" style="width: 20px; height: 20px; object-fit: contain;" />
                  </Button>
                </div>
              </template>
            </ControlExample>

            <!-- Example 4: ImageIcon (SVG) -->
            <ControlExample
              headerText="ImageIcon (SVG)"
              :theme="pageTheme"
              :templateCode="example4Template"
              :vueCode="example4Vue">
              <template #example>
                <Button style="width: auto;">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </Button>
              </template>
            </ControlExample>

            <!-- Example 5: PathIcon -->
            <ControlExample
              headerText="PathIcon"
              :theme="pageTheme"
              :templateCode="example5Template"
              :vueCode="example5Vue">
              <template #example>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                  <p style="margin: 0; font-size: 14px; color: var(--text-secondary); line-height: 1.5;">
                    To use a PathIcon as the icon for a control, you specify the path data of the image you are trying to display. The path data draws a series of connected lines and curves.
                  </p>
                  <Button style="width: auto;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M 16,12 20,2 L 20,16 1,16" />
                    </svg>
                  </Button>
                </div>
              </template>
            </ControlExample>

            <!-- Example 6: SymbolIcon -->
            <ControlExample
              headerText="SymbolIcon"
              :theme="pageTheme"
              :templateCode="example6Template"
              :vueCode="example6Vue">
              <template #example>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                  <p style="margin: 0; font-size: 14px; color: var(--text-secondary); line-height: 1.5;">
                    To use a SymbolIcon as the icon for a control, you specify the enum value for the glyph you would like to display. SymbolIcon's enum is based off of icons from the Segoe MDL2 font used by Windows 10.
                  </p>
                  <Button style="width: auto;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                      <span class="symbol-icon">&#xE8FB;</span>
                      <span style="font-size: 12px;">Accept</span>
                    </div>
                  </Button>
                </div>
              </template>
            </ControlExample>
      </div>
    </ScrollViewer>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import CheckBox from '../../components/CheckBox.vue';
import ControlExample from '../../components/ControlExample.vue';
import Button from '../../components/Button.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'iconelement');

const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

// Example 1: BitmapIcon
const showAsMonochrome = ref(false);

const example1Template = `<div class="bitmap-icon" :class="{ monochrome: showAsMonochrome }">
  <!-- Image: https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/Slices.png -->
</div>`;

const example1Vue = `const showAsMonochrome = ref(false);`;

// Example 2: FontIcon
const example2Template = `<Button>
  <span class="font-icon">&#xE790;</span>
</Button>`;

const example2Vue = `// FontFamily: Segoe MDL2 Assets
// Glyph: &#xE790;`;

// Example 3: ImageIcon (PNG)
const example3Template = `<Button>
  <img src="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/Slices.png" alt="Icon" />
</Button>`;

const example3Vue = `// Source: https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/Slices.png`;

// Example 4: ImageIcon (SVG)
const example4Template = `<Button>
  <svg width="50" height="50" viewBox="0 0 24 24">
    <path d="..." fill="currentColor" />
  </svg>
</Button>`;

const example4Vue = `// Source: SVG path data`;

// Example 5: PathIcon
const example5Template = `<Button>
  <svg width="20" height="20" viewBox="0 0 20 20">
    <path d="M 16,12 20,2 L 20,16 1,16" />
  </svg>
</Button>`;

const example5Vue = `// Data: "M 16,12 20,2 L 20,16 1,16"`;

// Example 6: SymbolIcon
const example6Template = `<Button>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <span class="symbol-icon">&#xE8FB;</span>
    <span>Accept</span>
  </div>
</Button>`;

const example6Vue = `// Symbol: Accept (&#xE8FB;)`;
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

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
  align-items: center;
}

.icon {
  font-size: 16px;
}

.font-icon,
.symbol-icon {
  font-size: 20px;
  display: inline-block;
}

.bitmap-icon {
  display: inline-block;
}

.bitmap-icon.monochrome {
  filter: grayscale(1) brightness(0) invert(var(--is-dark-theme, 0));
}
</style>
