<template>
  <div class="gallery-item-page">
    <div style="position: relative;" class="page-heading">
          <h1 class="page-header">RadialGradientBrush</h1>
          <p class="page-description">
            Paints an area with a radial gradient. A center point defines the origin of the gradient, and an ellipse defines the outer bounds of the gradient.
          </p>
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"
             >
              <span class="icon">&#xE793;</span>
            </WinButton>
            <WinToggleButton class="header-action" :IsChecked="isFavoriteState"
              @update:IsChecked="toggleFavorite"
             >
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <!-- Example: RadialGradientBrush Sample -->
            <WinControlExample
              headerText="RadialGradientBrush Sample"
              :theme="pageTheme"
              :templateCode="exampleTemplate"
              :vueCode="exampleVue">
              <template #example>
                <div class="gradient-container">
                  <div
                    class="gradient-rectangle"
                    :style="gradientStyle"></div>
                </div>
              </template>
              <template #options>
                <div class="options-grid">
                  <WinComboBox
                    v-model:SelectedValue="mappingMode"
                    Header="MappingMode"
                    :ItemsSource="mappingModeOptions"
                    DisplayMemberPath="label"
                    SelectedValuePath="value"
                    style="grid-column: span 2;" />

                  <WinSlider
                    v-model="centerX"
                    header="Center.X"
                    :minimum="0"
                    :maximum="sliderMaximum"
                    :stepFrequency="sliderStepFrequency"
                    :smallChange="sliderSmallChange" />

                  <WinSlider
                    v-model="centerY"
                    header="Center.Y"
                    :minimum="0"
                    :maximum="sliderMaximum"
                    :stepFrequency="sliderStepFrequency"
                    :smallChange="sliderSmallChange" />

                  <WinSlider
                    v-model="radiusX"
                    header="RadiusX"
                    :minimum="0"
                    :maximum="sliderMaximum"
                    :stepFrequency="sliderStepFrequency"
                    :smallChange="sliderSmallChange" />

                  <WinSlider
                    v-model="radiusY"
                    header="RadiusY"
                    :minimum="0"
                    :maximum="sliderMaximum"
                    :stepFrequency="sliderStepFrequency"
                    :smallChange="sliderSmallChange" />

                  <WinSlider
                    v-model="originX"
                    header="GradientOrigin.X"
                    :minimum="0"
                    :maximum="sliderMaximum"
                    :stepFrequency="sliderStepFrequency"
                    :smallChange="sliderSmallChange" />

                  <WinSlider
                    v-model="originY"
                    header="GradientOrigin.Y"
                    :minimum="0"
                    :maximum="sliderMaximum"
                    :stepFrequency="sliderStepFrequency"
                    :smallChange="sliderSmallChange" />

                  <WinComboBox
                    v-model:SelectedValue="spreadMethod"
                    Header="SpreadMethod"
                    :ItemsSource="spreadMethodOptions"
                    DisplayMemberPath="label"
                    SelectedValuePath="value"
                    style="grid-column: span 2; margin-top: 10px;" />
                </div>
              </template>
            </WinControlExample>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch, onMounted } from 'vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinSlider from '../../components/WinSlider.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'radialgradientbrush');

const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

// RadialGradientBrush properties
const mappingMode = ref('RelativeToBoundingBox');
const centerX = ref(0.25);
const centerY = ref(0.25);
const radiusX = ref(0.5);
const radiusY = ref(0.5);
const originX = ref(0.5);
const originY = ref(0.25);
const spreadMethod = ref('Pad');

const mappingModeOptions = [
  { label: 'RelativeToBoundingBox', value: 'RelativeToBoundingBox' },
  { label: 'Absolute', value: 'Absolute' }
];

const spreadMethodOptions = [
  { label: 'Pad', value: 'Pad' },
  { label: 'Reflect', value: 'Reflect' },
  { label: 'Repeat', value: 'Repeat' }
];

// Slider configuration based on mapping mode
const sliderMaximum = computed(() => {
  return mappingMode.value === 'Absolute' ? 200 : 1.0;
});

const sliderStepFrequency = computed(() => {
  return mappingMode.value === 'Absolute' ? 4 : 0.02;
});

const sliderSmallChange = computed(() => {
  return mappingMode.value === 'Absolute' ? 10 : 0.05;
});

// Initialize slider values when mapping mode changes
watch(mappingMode, (newMode) => {
  if (newMode === 'Absolute') {
    centerX.value = 100;
    centerY.value = 100;
    radiusX.value = 100;
    radiusY.value = 100;
    originX.value = 100;
    originY.value = 100;
  } else {
    centerX.value = 0.5;
    centerY.value = 0.5;
    radiusX.value = 0.5;
    radiusY.value = 0.5;
    originX.value = 0.5;
    originY.value = 0.5;
  }
});

// Compute CSS gradient style
const gradientStyle = computed(() => {
  const isRelative = mappingMode.value === 'RelativeToBoundingBox';

  let cx, cy, rx, ry, ox, oy;

  if (isRelative) {
    // Convert to percentage
    cx = centerX.value * 100;
    cy = centerY.value * 100;
    rx = radiusX.value * 100;
    ry = radiusY.value * 100;
    ox = originX.value * 100;
    oy = originY.value * 100;
  } else {
    // Use pixel values directly
    cx = centerX.value;
    cy = centerY.value;
    rx = radiusX.value;
    ry = radiusY.value;
    ox = originX.value;
    oy = originY.value;
  }

  const unit = isRelative ? '%' : 'px';

  // CSS radial-gradient syntax
  // Note: CSS doesn't support all WinUI RadialGradientBrush features like separate GradientOrigin
  // This is a simplified representation
  let gradient = `radial-gradient(ellipse ${rx}${unit} ${ry}${unit} at ${cx}${unit} ${cy}${unit}, yellow 0%, blue 100%)`;

  return {
    background: gradient
  };
});

// Code examples
const exampleTemplate = computed(() => {
  const isRelative = mappingMode.value === 'RelativeToBoundingBox';
  const cx = isRelative ? centerX.value.toFixed(2) : Math.round(centerX.value);
  const cy = isRelative ? centerY.value.toFixed(2) : Math.round(centerY.value);
  const rx = isRelative ? radiusX.value.toFixed(2) : Math.round(radiusX.value);
  const ry = isRelative ? radiusY.value.toFixed(2) : Math.round(radiusY.value);
  const ox = isRelative ? originX.value.toFixed(2) : Math.round(originX.value);
  const oy = isRelative ? originY.value.toFixed(2) : Math.round(originY.value);

  return `<Rectangle Width="200" Height="200">
  <Rectangle.Fill>
    <media:RadialGradientBrush
      MappingMode="${mappingMode.value}"
      Center="${cx},${cy}"
      RadiusX="${rx}"
      RadiusY="${ry}"
      GradientOrigin="${ox},${oy}"
      SpreadMethod="${spreadMethod.value}">
      <GradientStop Color="Yellow" Offset="0.0" />
      <GradientStop Color="Blue" Offset="1" />
    </media:RadialGradientBrush>
  </Rectangle.Fill>
</Rectangle>`;
});

const exampleVue = `const mappingMode = ref('RelativeToBoundingBox');
const centerX = ref(0.25);
const centerY = ref(0.25);
const radiusX = ref(0.5);
const radiusY = ref(0.5);
const originX = ref(0.5);
const originY = ref(0.25);
const spreadMethod = ref('Pad');

const gradientStyle = computed(() => {
  const cx = centerX.value * 100;
  const cy = centerY.value * 100;
  const rx = radiusX.value * 100;
  const ry = radiusY.value * 100;

  return {
    background: \`radial-gradient(
      ellipse \${rx}% \${ry}% at \${cx}% \${cy}%,
      yellow 0%, blue 100%
    )\`
  };
});`;
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

.gradient-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.gradient-rectangle {
  width: 200px;
  height: 200px;
  border-radius: 4px;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 12px;
  width: 100%;
}
</style>
