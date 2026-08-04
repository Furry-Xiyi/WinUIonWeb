<template>
  <div class="gallery-item-page">
    <div class="page-header page-heading">
          <h1 class="page-title">AcrylicBrush</h1>
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme">
              <span class="icon">&#xE793;</span>
            </WinButton>
            <WinToggleButton class="header-action" :IsChecked="isFavoriteState"
              @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <!-- Page Description -->
            <div class="page-description">
              <p>
                Acrylic Brush might fall back to SolidColorbrush in certain scenarios.
                If you can't see the Acrylic effect, please refer to
                <WinHyperlinkButton navigateUri="https://learn.microsoft.com/windows/apps/design/style/acrylic#usability-and-adaptability">
                  Acrylic brush adaptability documentation
                </WinHyperlinkButton>.
                Acrylic Brush uses in-app acrylic.
              </p>
            </div>

            <!-- Example 1: Default Acrylic -->
            <WinControlExample headerText="Default In-App Acrylic">
              <template #example>
                <div class="acrylic-demo" :style="{ width: demoWidth + 'px', height: demoHeight + 'px' }">
                  <div class="background-shapes">
                    <div class="shape rect-aqua"></div>
                    <div class="shape ellipse-magenta"></div>
                    <div class="shape rect-yellow"></div>
                  </div>
                  <div class="acrylic-layer default-acrylic"></div>
                </div>
              </template>
            </WinControlExample>

            <!-- Example 2: Custom Acrylic with Options -->
            <WinControlExample headerText="Custom In-App Acrylic">
              <template #example>
                <div class="acrylic-demo" :style="{ width: demoWidth + 'px', height: demoHeight + 'px' }">
                  <div class="background-shapes">
                    <div class="shape rect-aqua"></div>
                    <div class="shape ellipse-magenta"></div>
                    <div class="shape rect-yellow"></div>
                  </div>
                  <div
                    class="acrylic-layer"
                    :style="{
                      '--tint-color': tintColor,
                      '--tint-opacity': tintOpacity,
                      '--fallback-color': fallbackColor,
                    }"
                  ></div>
                </div>
              </template>
              <template #options>
                <div class="options-group">
                  <label class="option-label">Tint Opacity:</label>
                  <WinSlider v-model="tintOpacity" :min="0" :max="1" />
                  <span class="option-value">{{ tintOpacity.toFixed(3) }}</span>
                </div>
                <div class="options-group">
                  <label class="option-label">Tint Color:</label>
                  <WinComboBox v-model:SelectedIndex="tintColorIndex" :ItemsSource="colorOptions" DisplayMemberPath="label" />
                </div>
                <div class="options-group">
                  <label class="option-label">Fallback Color:</label>
                  <WinComboBox v-model:SelectedIndex="fallbackColorIndex" :ItemsSource="fallbackColorOptions" DisplayMemberPath="label" />
                </div>
              </template>
            </WinControlExample>

            <!-- Example 3: Luminosity Acrylic -->
            <WinControlExample headerText="Luminosity In-App Acrylic">
              <template #example>
                <div class="acrylic-demo" :style="{ width: demoWidth + 'px', height: demoHeight + 'px' }">
                  <div class="background-shapes">
                    <div class="shape rect-aqua"></div>
                    <div class="shape ellipse-magenta"></div>
                    <div class="shape rect-yellow"></div>
                  </div>
                  <div
                    class="acrylic-layer luminosity-acrylic"
                    :style="{
                      '--tint-opacity': luminosityTintOpacity,
                      '--luminosity-opacity': luminosityOpacity,
                    }"
                  ></div>
                </div>

                <div class="options-group">
                  <label class="option-label">Tint Opacity:</label>
                  <WinSlider v-model="luminosityTintOpacity" :min="0" :max="1" />
                  <span class="option-value">{{ luminosityTintOpacity.toFixed(3) }}</span>
                </div>
                <div class="options-group">
                  <label class="option-label">Tint Luminosity Opacity:</label>
                  <WinSlider v-model="luminosityOpacity" :min="0" :max="1" />
                  <span class="option-value">{{ luminosityOpacity.toFixed(3) }}</span>
                </div>
              </template>
            </WinControlExample>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinHyperlinkButton from '../../components/WinHyperlinkButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinSlider from '../../components/WinSlider.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
// Theme and Favorite
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'acrylicbrush');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

// Demo sizing (responsive)
const demoWidth = ref(320);
const demoHeight = ref(200);

onMounted(() => {
  updateDemoSize();
  window.addEventListener('resize', updateDemoSize);
});

const updateDemoSize = () => {
  const width = window.innerWidth;
  if (width >= 800) {
    demoWidth.value = 652;
    demoHeight.value = 252;
  } else if (width >= 500) {
    demoWidth.value = 500;
    demoHeight.value = 252;
  } else {
    demoWidth.value = 320;
    demoHeight.value = 200;
  }
};

// Custom Acrylic Options
const tintOpacity = ref(0.8);
const tintColorIndex = ref(0);
const fallbackColorIndex = ref(0);

const colorOptions = [
  { label: 'Black', value: 'rgba(0, 0, 0, 1)' },
  { label: 'Red', value: 'rgba(255, 0, 0, 1)' },
  { label: 'Blue', value: 'rgba(0, 0, 255, 1)' },
];

const fallbackColorOptions = [
  { label: 'Green', value: 'rgb(0, 128, 0)' },
  { label: 'Yellow', value: 'rgb(255, 255, 0)' },
];

const tintColor = computed(() => colorOptions[tintColorIndex.value].value);
const fallbackColor = computed(() => fallbackColorOptions[fallbackColorIndex.value].value);

// Luminosity Acrylic Options
const luminosityTintOpacity = ref(0.8);
const luminosityOpacity = ref(0.8);
</script>

<style scoped>
.page-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.page-header-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  font-size: 16px;
  line-height: 1;
}

.page-description {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--stroke-card);
}

.page-description p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Acrylic Demo */
.acrylic-demo {
  position: relative;
  min-width: 320px;
  min-height: 200px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--stroke-card);
}

.background-shapes {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shape {
  position: absolute;
}

.rect-aqua {
  width: 100px;
  height: 200px;
  background: aqua;
  left: 0;
  top: 0;
}

.ellipse-magenta {
  width: 152px;
  height: 152px;
  background: magenta;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.rect-yellow {
  width: 80px;
  height: 100px;
  background: yellow;
  right: 0;
  bottom: 0;
}

.acrylic-layer {
  position: absolute;
  inset: 12px;
  isolation: isolate;
  background: transparent;
  border-radius: 6px;
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
}

.acrylic-layer::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
  background: var(--acrylic-demo-fill);
}

/* Default Acrylic */
.default-acrylic {
  --acrylic-demo-fill: rgba(252, 252, 252, 0.8);
}

[data-theme='dark'] .default-acrylic {
  --acrylic-demo-fill: rgba(44, 44, 44, 0.8);
}

/* Custom Acrylic */
.acrylic-layer:not(.default-acrylic):not(.luminosity-acrylic) {
  --acrylic-demo-fill: color-mix(
    in srgb,
    var(--tint-color) calc(var(--tint-opacity) * 100%),
    transparent
  );
}

/* Luminosity Acrylic */
.luminosity-acrylic {
  --acrylic-demo-fill: rgba(135, 206, 235, calc(var(--tint-opacity)));
  mix-blend-mode: luminosity;
  opacity: var(--luminosity-opacity);
}

/* Options Styling */
.options-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.option-label {
  min-width: 140px;
  color: var(--text-primary);
  font-size: 14px;
}

.option-value {
  min-width: 60px;
  color: var(--text-secondary);
  font-size: 13px;
  font-family: 'Consolas', monospace;
}
</style>
