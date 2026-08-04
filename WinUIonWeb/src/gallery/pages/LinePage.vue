<template>
  <div class="gallery-item-page">
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <!-- 页面头部 -->
            <div class="page-header">
              <div class="page-title-section">
                <h1 class="page-title">Line</h1>
                <p class="page-description">
                  Line, Polyline, Path, and GeometryGroup allow you to draw shapes and curves on the screen.
                </p>
              </div>
              <div class="page-actions">
                <WinButton class="header-action" v-bind="{ 'tooltipservice.tooltip': 'Toggle theme' }" @Click="toggleTheme">
                  <span class="icon">&#xE793;</span>
                </WinButton>
                <WinToggleButton :IsChecked="isFavorite" class="header-action" v-bind="{ 'tooltipservice.tooltip': isFavorite ? 'Remove from favorites' : 'Add to favorites' }" @update:IsChecked="toggleFavorite">
                  <span class="icon">{{ isFavorite ? '&#xE735;' : '&#xE734;' }}</span>
                </WinToggleButton>
              </div>
            </div>

            <!-- Line 示例 -->
            <WinControlExample
              headerText="Line"
              :templateCode="lineTemplateCode"
              :vueCode="lineVueCode">
              <template #example>
                <svg width="320" height="200" style="background: transparent;">
                  <line
                    :x1="lineX1"
                    :y1="lineY1"
                    :x2="lineX2"
                    :y2="lineY2"
                    :stroke-width="lineThickness"
                    stroke="SteelBlue"
                    :transform="`translate(0, 50)`" />
                </svg>
              </template>

              <template #options>
                <WinSlider
                  v-model="lineX1"
                  header="Start point X"
                  :minimum="0"
                  :maximum="100"
                  :stepFrequency="0.5" />
                <WinSlider
                  v-model="lineY1"
                  header="Start point Y"
                  :minimum="0"
                  :maximum="100"
                  :stepFrequency="0.5" />
                <WinSlider
                  v-model="lineX2"
                  header="End point X"
                  :minimum="200"
                  :maximum="300"
                  :stepFrequency="0.5" />
                <WinSlider
                  v-model="lineY2"
                  header="End point Y"
                  :minimum="0"
                  :maximum="100"
                  :stepFrequency="0.5" />
                <WinSlider
                  v-model="lineThickness"
                  header="Stroke Thickness"
                  :minimum="5"
                  :maximum="10"
                  :stepFrequency="0.5" />
              </template>
            </WinControlExample>

            <!-- Polyline 示例 -->
            <WinControlExample
              headerText="Polyline"
              :templateCode="polylineTemplateCode"
              :vueCode="polylineVueCode">
              <template #example>
                <div style="position: relative; width: 320px; height: 170px;">
                  <p style="margin: 0 0 10px 0; color: var(--text-primary);">
                    Draws a series of connected straight lines.
                  </p>
                  <svg width="320" height="170" style="position: absolute; top: 20px; left: 0;">
                    <polyline
                      points="10,100 60,40 200,40 250,100"
                      fill="none"
                      stroke="black"
                      :stroke-width="polylineThickness" />
                    <text v-if="showPolylinePoints" x="0" y="140" font-size="12" fill="var(--text-primary)">Point #1: (10,100)</text>
                    <text v-if="showPolylinePoints" x="50" y="40" font-size="12" fill="var(--text-primary)">Point #2: (60,40)</text>
                    <text v-if="showPolylinePoints" x="200" y="40" font-size="12" fill="var(--text-primary)">Point #3: (200,40)</text>
                    <text v-if="showPolylinePoints" x="240" y="140" font-size="12" fill="var(--text-primary)">Point #4: (250,100)</text>
                  </svg>
                </div>

                <WinToggleSwitch
                  v-model="showPolylinePoints"
                  header="Show points" />
                <WinSlider
                  v-model="polylineThickness"
                  header="Stroke Thickness"
                  :minimum="2"
                  :maximum="10"
                  :stepFrequency="0.5" />
              </template>
            </WinControlExample>

            <!-- Path 示例 -->
            <WinControlExample
              headerText="Path"
              :templateCode="pathTemplateCode"
              :vueCode="pathVueCode">
              <template #example>
                <div style="position: relative; width: 320px; height: 200px;">
                  <p style="margin: 0 0 10px 0; color: var(--text-primary);">
                    Draws a series of connected lines and curves.
                  </p>
                  <svg width="420" height="200" style="position: absolute; top: 20px; left: 0;">
                    <path
                      d="M 10,100 C 100,25 300,250 400,75 H 200"
                      fill="none"
                      stroke="DarkGoldenRod"
                      :stroke-width="pathThickness" />
                    <text v-if="showPathPoints" x="0" y="130" font-size="12" fill="var(--text-primary)">Point #1: (10,100)</text>
                    <text v-if="showPathPoints" x="40" y="75" font-size="12" fill="var(--text-primary)">Point #2: (100,25)</text>
                    <text v-if="showPathPoints" x="280" y="175" font-size="12" fill="var(--text-primary)">Point #3: (300,250)</text>
                    <text v-if="showPathPoints" x="360" y="60" font-size="12" fill="var(--text-primary)">Point #4: (400,75)</text>
                    <text v-if="showPathPoints" x="170" y="60" font-size="12" fill="var(--text-primary)">Point #5: (200,75)</text>
                  </svg>
                </div>

                <WinToggleSwitch
                  v-model="showPathPoints"
                  header="Show points" />
                <WinSlider
                  v-model="pathThickness"
                  header="Stroke Thickness"
                  :minimum="2"
                  :maximum="10"
                  :stepFrequency="0.5" />
              </template>
            </WinControlExample>

            <!-- GeometryGroup 示例 -->
            <WinControlExample
              headerText="GeometryGroup"
              :templateCode="geometryTemplateCode"
              :vueCode="geometryVueCode">
              <template #example>
                <div style="width: 200px; height: 170px;">
                  <p style="margin: 0 0 15px 0; color: var(--text-primary);">
                    Composite geometry objects can be created using a GeometryGroup.
                  </p>
                  <svg width="200" height="150">
                    <defs>
                      <g id="compositeShape">
                        <line x1="10" y1="10" x2="50" y2="30" stroke="black" stroke-width="4" />
                        <ellipse
                          cx="40"
                          cy="70"
                          :rx="ellipseRadiusX"
                          :ry="ellipseRadiusY"
                          fill="#CCCCFF"
                          stroke="black"
                          stroke-width="4" />
                        <rect x="30" y="55" width="100" height="30" fill="#CCCCFF" stroke="black" stroke-width="4" />
                      </g>
                    </defs>
                    <use href="#compositeShape" />
                  </svg>
                </div>

                <WinSlider
                  v-model="ellipseRadiusX"
                  header="RadiusX"
                  :minimum="30"
                  :maximum="40"
                  :stepFrequency="0.5" />
                <WinSlider
                  v-model="ellipseRadiusY"
                  header="RadiusY"
                  :minimum="30"
                  :maximum="50"
                  :stepFrequency="0.5" />
              </template>
            </WinControlExample>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinSlider from '../../components/WinSlider.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinToggleSwitch from '../../components/WinToggleSwitch.vue';

// 页面状态
const currentTheme = ref('system');
const isFavorite = ref(false);

const toggleTheme = () => {
  const themes = ['system', 'light', 'dark'];
  const currentIndex = themes.indexOf(currentTheme.value);
  currentTheme.value = themes[(currentIndex + 1) % themes.length];
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
};

// Line 示例状态
const lineX1 = ref(0);
const lineY1 = ref(0);
const lineX2 = ref(200);
const lineY2 = ref(0);
const lineThickness = ref(5);

// Polyline 示例状态
const showPolylinePoints = ref(false);
const polylineThickness = ref(2);

// Path 示例状态
const showPathPoints = ref(false);
const pathThickness = ref(2);

// GeometryGroup 示例状态
const ellipseRadiusX = ref(30);
const ellipseRadiusY = ref(30);

// 代码示例
const lineTemplateCode = `<svg width="320" height="200">
  <line
    x1="${lineX1.value}"
    y1="${lineY1.value}"
    x2="${lineX2.value}"
    y2="${lineY2.value}"
    stroke-width="${lineThickness.value}"
    stroke="SteelBlue"
    transform="translate(0, 50)" />
</svg>`;

const lineVueCode = `<script setup>
import { ref } from 'vue';

const lineX1 = ref(0);
const lineY1 = ref(0);
const lineX2 = ref(200);
const lineY2 = ref(0);
const lineThickness = ref(5);
<\/script>`;

const polylineTemplateCode = `<svg width="320" height="170">
  <polyline
    points="10,100 60,40 200,40 250,100"
    fill="none"
    stroke="black"
    :stroke-width="${polylineThickness.value}" />
</svg>`;

const polylineVueCode = `<script setup>
import { ref } from 'vue';

const showPolylinePoints = ref(false);
const polylineThickness = ref(2);
<\/script>`;

const pathTemplateCode = `<svg width="420" height="200">
  <path
    d="M 10,100 C 100,25 300,250 400,75 H 200"
    fill="none"
    stroke="DarkGoldenRod"
    :stroke-width="${pathThickness.value}" />
</svg>`;

const pathVueCode = `<script setup>
import { ref } from 'vue';

const showPathPoints = ref(false);
const pathThickness = ref(2);
<\/script>`;

const geometryTemplateCode = `<svg width="200" height="150">
  <defs>
    <g id="compositeShape">
      <line x1="10" y1="10" x2="50" y2="30" stroke="black" stroke-width="4" />
      <ellipse
        cx="40"
        cy="70"
        :rx="${ellipseRadiusX.value}"
        :ry="${ellipseRadiusY.value}"
        fill="#CCCCFF"
        stroke="black"
        stroke-width="4" />
      <rect x="30" y="55" width="100" height="30" fill="#CCCCFF" stroke="black" stroke-width="4" />
    </g>
  </defs>
  <use href="#compositeShape" />
</svg>`;

const geometryVueCode = `<script setup>
import { ref } from 'vue';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const ellipseRadiusX = ref(30);
const ellipseRadiusY = ref(30);
<\/script>`;
</script>

<style scoped>
.line-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--divider-default);
}

.page-title-section {
  flex: 1;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
}

.page-description {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.page-actions {
  display: flex;
  gap: 4px;
}

.icon {
  font-size: 16px;
}
</style>
