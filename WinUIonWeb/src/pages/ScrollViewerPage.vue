<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">ScrollViewer</h1>
      <p class="page-description">
        Content inside of a ScrollViewer.
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

    <!-- Example 1: Content inside ScrollViewer -->
    <WinControlExample
      headerText="Content inside of a ScrollViewer"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <WinScrollViewer
          ref="scrollViewerControl"
          :width="400"
          :height="266"
          horizontalAlignment="Left"
          verticalAlignment="Top"
          :isTabStop="true"
          :isVerticalScrollChainingEnabled="true"
          :zoomMode="zoomMode"
          :horizontalScrollMode="horizontalScrollMode"
          :verticalScrollMode="verticalScrollMode"
          :horizontalScrollBarVisibility="horizontalScrollBarVisibility"
          :verticalScrollBarVisibility="verticalScrollBarVisibility"
          :minZoomFactor="minZoomFactor"
          :maxZoomFactor="maxZoomFactor"
          :zoomFactor="currentZoomFactor"
          @viewChanged="onViewChanged">
          <img
            src="/assets/cliff.jpg"
            alt="cliff"
            style="display: block; object-fit: none; object-position: left top;" />
        </WinScrollViewer>
      </template>

      <template #options>
        <div class="options-grid">
          <label class="option-label">ZoomMode</label>
          <WinComboBox
            v-model="zoomModeIndex"
            :options="zoomModeOptions"
            style="width: 100%;" />

          <div class="slider-container">
            <label class="slider-label">Zoom</label>
            <WinSlider
              v-model="currentZoomFactor"
              :min="minZoomFactor"
              :max="maxZoomFactor"
              :disabled="zoomMode === 'Disabled'"
              style="width: 100%;" />
          </div>

          <div class="section-header">ScrollMode</div>

          <label class="option-label">Horizontal</label>
          <WinComboBox
            v-model="horizontalScrollModeIndex"
            :options="scrollModeOptions"
            style="width: 100%;" />

          <label class="option-label" style="margin-top: 8px;">Vertical</label>
          <WinComboBox
            v-model="verticalScrollModeIndex"
            :options="scrollModeOptions"
            style="width: 100%; margin-top: 8px;" />

          <div class="section-header" style="margin-top: 20px;">ScrollbarVisibility</div>

          <label class="option-label">Horizontal</label>
          <WinComboBox
            v-model="horizontalScrollBarVisibilityIndex"
            :options="scrollBarVisibilityOptions"
            style="width: 100%;" />

          <label class="option-label" style="margin-top: 8px;">Vertical</label>
          <WinComboBox
            v-model="verticalScrollBarVisibilityIndex"
            :options="scrollBarVisibilityOptions"
            style="width: 100%; margin-top: 8px;" />
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinScrollViewer from '../components/WinScrollViewer.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import WinComboBox from '../components/WinComboBox.vue';
import WinSlider from '../components/WinSlider.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'scrollviewer');

const { isFavorite: checkFavorite, toggleFavorite: toggleFav } = useFavorites();
const isFavorite = computed(() => checkFavorite(pageKey.value));
const isFavoriteState = ref(isFavorite.value);

watch(isFavorite, (newVal) => {
  isFavoriteState.value = newVal;
});

const toggleFavorite = () => {
  toggleFav(pageKey.value);
};

const { pageTheme, toggleTheme: doToggleTheme } = usePageTheme('system');
const toggleTheme = () => doToggleTheme();

// ScrollViewer ref
const scrollViewerControl = ref(null);

// Zoom options
const zoomModeOptions = [
  { label: 'Disabled' },
  { label: 'Enabled' }
];
const zoomModeIndex = ref(1); // Default: Enabled
const zoomMode = computed(() => zoomModeOptions[zoomModeIndex.value].label);

const minZoomFactor = ref(0.1);
const maxZoomFactor = ref(10.0);
const currentZoomFactor = ref(4.0);

// Scroll mode options
const scrollModeOptions = [
  { label: 'Disabled' },
  { label: 'Enabled' },
  { label: 'Auto' }
];

const horizontalScrollModeIndex = ref(1); // Default: Enabled
const verticalScrollModeIndex = ref(1); // Default: Enabled

const horizontalScrollMode = computed(() => scrollModeOptions[horizontalScrollModeIndex.value].label);
const verticalScrollMode = computed(() => scrollModeOptions[verticalScrollModeIndex.value].label);

// ScrollBar visibility options
const scrollBarVisibilityOptions = [
  { label: 'Disabled' },
  { label: 'Auto' },
  { label: 'Hidden' },
  { label: 'Visible' }
];

const horizontalScrollBarVisibilityIndex = ref(1); // Default: Auto
const verticalScrollBarVisibilityIndex = ref(1); // Default: Auto

const horizontalScrollBarVisibility = computed(() => scrollBarVisibilityOptions[horizontalScrollBarVisibilityIndex.value].label);
const verticalScrollBarVisibility = computed(() => scrollBarVisibilityOptions[verticalScrollBarVisibilityIndex.value].label);

// ViewChanged event handler
const onViewChanged = (args) => {
  // Handle view changed event
  // args contains: { isIntermediate, horizontalOffset, verticalOffset, zoomFactor }
  console.log('View changed:', args);
};

// Watch zoom mode changes to reset zoom factor if disabled
watch(zoomMode, (newMode) => {
  if (newMode === 'Disabled') {
    currentZoomFactor.value = 1.0;
  }
});

// Code examples
const example1Template = `<WinScrollViewer
  :width="400"
  :height="266"
  horizontalAlignment="Left"
  verticalAlignment="Top"
  :isTabStop="true"
  :isVerticalScrollChainingEnabled="true"
  :zoomMode="zoomMode"
  :horizontalScrollMode="horizontalScrollMode"
  :verticalScrollMode="verticalScrollMode"
  :horizontalScrollBarVisibility="horizontalScrollBarVisibility"
  :verticalScrollBarVisibility="verticalScrollBarVisibility"
  @viewChanged="onViewChanged">
  <img src="/assets/cliff.jpg" alt="cliff" />
</WinScrollViewer>`;

const example1Vue = `const zoomMode = ref('Enabled');
const horizontalScrollMode = ref('Enabled');
const verticalScrollMode = ref('Enabled');
const horizontalScrollBarVisibility = ref('Auto');
const verticalScrollBarVisibility = ref('Auto');

const onViewChanged = (args) => {
  console.log('Horizontal offset:', args.horizontalOffset);
  console.log('Vertical offset:', args.verticalOffset);
  console.log('Zoom factor:', args.zoomFactor);
  console.log('Is intermediate:', args.isIntermediate);
};`;
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
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
}

.options-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 10px;
  align-items: center;
  min-width: 200px;
}

.option-label {
  font-size: 14px;
  color: var(--text-primary);
  white-space: nowrap;
}

.slider-container {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.slider-label {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.section-header {
  grid-column: 1 / -1;
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 600;
  text-align: center;
  margin: 12px 0;
}
</style>
