<template>
  <div class="gallery-item-page">
    <div class="page-header-section page-heading">
          <h1 class="page-header">Color</h1>
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
            <div class="page-intro">
              <p class="intro-text">
                The brushes below are part of WinUI 3 and you can reference them in your app. For example:
              </p>
              <div class="code-sample">
                <code>&lt;TextBlock Text="..." Foreground="{ThemeResource TextFillColorPrimaryBrush}" /&gt;</code>
              </div>
            </div>

            <WinSelectorBar
              :Items="selectorItems"
              :SelectedItem="selectorItems[selectedSection]"
              @SelectionChanged="onSectionChanged"
              class="section-selector" />

            <div class="color-content">
              <component :is="currentSectionComponent" />
            </div>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { computed, inject, ref, shallowRef } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinSelectorBar from '../../components/WinSelectorBar.vue';
import TextColorSection from '../../components/ColorSections/TextColorSection.vue';
import FillColorSection from '../../components/ColorSections/FillColorSection.vue';
import StrokeColorSection from '../../components/ColorSections/StrokeColorSection.vue';
import BackgroundColorSection from '../../components/ColorSections/BackgroundColorSection.vue';
import SignalColorSection from '../../components/ColorSections/SignalColorSection.vue';
import HighContrastColorSection from '../../components/ColorSections/HighContrastColorSection.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'color');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const selectorItems = [
  { Text: 'Text' },
  { Text: 'Fill' },
  { Text: 'Stroke' },
  { Text: 'Background' },
  { Text: 'Signal' },
  { Text: 'High Contrast' }
];

const selectedSection = ref(0);

const sections = [
  TextColorSection,
  FillColorSection,
  StrokeColorSection,
  BackgroundColorSection,
  SignalColorSection,
  HighContrastColorSection
];

const currentSectionComponent = shallowRef(sections[0]);


const onSectionChanged = (sender) => {
  const index = Math.max(0, sender?.Items?.indexOf(sender?.SelectedItem) ?? 0);
  selectedSection.value = index;
  currentSectionComponent.value = sections[index];
};
</script>

<style scoped>
.page-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.page-header-actions {
  display: flex;
  gap: 8px;
}

.page-intro {
  margin-bottom: 24px;
}

.intro-text {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 16px;
}

.code-sample {
  background: var(--card-bg-secondary);
  border: 1px solid var(--card-stroke);
  border-radius: 4px;
  padding: 12px 16px;
}

.code-sample code {
  font-family: 'Cascadia Code', 'Consolas', monospace;
  font-size: 13px;
  color: var(--text-primary);
}

.section-selector {
  margin-bottom: 24px;
}

.color-content {
  margin-top: 20px;
}
</style>
