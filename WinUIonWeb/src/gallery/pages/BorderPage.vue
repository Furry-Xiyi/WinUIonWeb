<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div style="position: relative;" class="page-heading">
          <h1 class="page-header">Border</h1>
          <p class="page-description">
            A Border is a container control that draws a border, background, or both, around another object.
          </p>
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"
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
      <div class="gallery-page-content">
        <!-- Example 1: A Border around a TextBlock -->
            <WinControlExample
              headerText="A Border around a TextBlock."
              :theme="pageTheme"
              :templateCode="example1Template"
              :vueCode="example1Vue">
              <template #example>
                <div
                  :style="{
                    display: 'inline-block',
                    verticalAlign: 'top',
                    border: `${borderThickness}px solid ${borderBrushColor}`,
                    background: backgroundColor,
                    padding: '8px 5px'
                  }">
                  <span style="font-size: 18px; color: black;">Text inside a border</span>
                </div>
              </template>
              <template #options>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                  <WinSlider
                    v-model="borderThickness"
                    header="BorderThickness"
                    :minimum="0"
                    :maximum="10"
                    :stepFrequency="1" />

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div>
                      <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Background</p>
                      <div style="display: flex; flex-direction: column; gap: 4px;">
                        <WinRadioButton
                          v-model="selectedBackground"
                          value="Green"
                          name="bgColor">
                          Green
                        </WinRadioButton>
                        <WinRadioButton
                          v-model="selectedBackground"
                          value="Yellow"
                          name="bgColor">
                          Yellow
                        </WinRadioButton>
                        <WinRadioButton
                          v-model="selectedBackground"
                          value="Blue"
                          name="bgColor">
                          Blue
                        </WinRadioButton>
                        <WinRadioButton
                          v-model="selectedBackground"
                          value="White"
                          name="bgColor">
                          White
                        </WinRadioButton>
                      </div>
                    </div>

                    <div>
                      <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">BorderBrush</p>
                      <div style="display: flex; flex-direction: column; gap: 4px;">
                        <WinRadioButton
                          v-model="selectedBorderBrush"
                          value="Green"
                          name="borderBrush">
                          Green
                        </WinRadioButton>
                        <WinRadioButton
                          v-model="selectedBorderBrush"
                          value="Yellow"
                          name="borderBrush">
                          Yellow
                        </WinRadioButton>
                        <WinRadioButton
                          v-model="selectedBorderBrush"
                          value="Blue"
                          name="borderBrush">
                          Blue
                        </WinRadioButton>
                        <WinRadioButton
                          v-model="selectedBorderBrush"
                          value="White"
                          name="borderBrush">
                          White
                        </WinRadioButton>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinSlider from '../../components/WinSlider.vue';
import WinRadioButton from '../../components/WinRadioButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'border');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

// Border properties
const borderThickness = ref(2);
const selectedBackground = ref('White');
const selectedBorderBrush = ref('Yellow');

// Computed colors based on official WinUI color mapping
const backgroundColor = computed(() => {
  const colors = {
    'Green': '#00FF00',
    'Yellow': '#FFFF00',
    'Blue': '#0000FF',
    'White': '#FFFFFF'
  };
  return colors[selectedBackground.value] || '#FFFFFF';
});

const borderBrushColor = computed(() => {
  const colors = {
    'Green': '#006400',    // DarkGreen
    'Yellow': '#FFD700',   // Gold
    'Blue': '#00008B',     // DarkBlue
    'White': '#FFFFFF'
  };
  return colors[selectedBorderBrush.value] || '#FFD700';
});

// Code examples
const example1Template = `<Border
  BorderThickness="${computed(() => borderThickness.value)}"
  BorderBrush="${computed(() => borderBrushColor.value)}"
  Background="${computed(() => backgroundColor.value)}">
  <TextBlock Text="Text inside a border" FontSize="18" Foreground="Black" />
</Border>`;

const example1Vue = `const borderThickness = ref(2);
const selectedBackground = ref('White');
const selectedBorderBrush = ref('Yellow');

const backgroundColor = computed(() => {
  const colors = {
    'Green': '#00FF00',
    'Yellow': '#FFFF00',
    'Blue': '#0000FF',
    'White': '#FFFFFF'
  };
  return colors[selectedBackground.value];
});

const borderBrushColor = computed(() => {
  const colors = {
    'Green': '#006400',
    'Yellow': '#FFD700',
    'Blue': '#00008B',
    'White': '#FFFFFF'
  };
  return colors[selectedBorderBrush.value];
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
</style>
