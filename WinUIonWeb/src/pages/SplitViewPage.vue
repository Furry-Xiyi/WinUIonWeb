<template>
  <h1 class="page-header">SplitView</h1>
  <p class="page-description">A container with two views; one view for the main content and another view that is typically used for navigation commands.</p>

  <WinControlExample headerText="A basic SplitView">
    <template #example>
      <WinSplitView :isPaneOpen="isPaneOpen"
                    :displayMode="displayMode"
                    :placement="placement"
                    :openPaneLength="openPaneLength"
                    :compactPaneLength="compactPaneLength"
                    :paneBackground="paneBackground"
                    @update:isPaneOpen="isPaneOpen = $event"
                    class="split-view-demo">
        <template #pane>
          <WinListView :items="navItems" selectionMode="Single" v-model:selectedItems="selectedNav">
            <template #item="{ item }">
              <span class="icon split-nav-icon">{{ item.icon }}</span>
              <span class="split-nav-label">{{ item.label }}</span>
            </template>
          </WinListView>
        </template>
        <div class="split-view-content-body">
          <div class="split-view-content-title">Content</div>
          <p>DisplayMode: {{ displayMode }}</p>
          <p>Placement: {{ placement }}</p>
        </div>
      </WinSplitView>
    </template>
    <template #options>
      <div class="split-view-options-list">
        <div class="split-option-item">
          <span class="split-option-label"></span>
          <WinToggleButton v-model="isPaneOpen">IsPaneOpen</WinToggleButton>
        </div>
        <div class="split-option-item">
          <span class="split-option-label">Placement</span>
          <WinToggleSwitch v-model="isRight" onContent="Right" offContent="Left" />
        </div>
        <div class="split-option-item">
          <span class="split-option-label">DisplayMode</span>
          <WinComboBox :options="displayModeOptions" v-model="displayModeIndex" />
        </div>
        <div class="split-option-item">
          <span class="split-option-label">PaneBackground</span>
          <WinComboBox :options="paneBgOptions" v-model="paneBgIndex" />
        </div>
        <div class="split-option-item">
          <span class="split-option-label">OpenPaneLength</span>
          <WinSlider v-model="openPaneLength" :min="160" :max="400" />
          <span class="split-option-value">{{ openPaneLength }}px</span>
        </div>
        <div class="split-option-item">
          <span class="split-option-label">CompactPaneLength</span>
          <WinSlider v-model="compactPaneLength" :min="40" :max="96" />
          <span class="split-option-value">{{ compactPaneLength }}px</span>
        </div>
      </div>
    </template>
  </WinControlExample>
</template>

<script setup>
import { ref, computed } from 'vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinSplitView from '../components/WinSplitView.vue';
import WinListView from '../components/WinListView.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import WinToggleSwitch from '../components/WinToggleSwitch.vue';
import WinComboBox from '../components/WinComboBox.vue';
import WinSlider from '../components/WinSlider.vue';

const isPaneOpen = ref(true);
const isRight = ref(false);
const displayModeIndex = ref(0);
const paneBgIndex = ref(0);
const openPaneLength = ref(256);
const compactPaneLength = ref(48);

const displayModes = ['Inline', 'CompactInline', 'Overlay', 'CompactOverlay'];
const displayModeOptions = [
  { label: 'Inline' },
  { label: 'CompactInline' },
  { label: 'Overlay' },
  { label: 'CompactOverlay' }
];
const paneBgOptions = [
  { label: 'SystemBackground' },
  { label: 'Red' },
  { label: 'Blue' },
  { label: 'Green' }
];
const paneBgColors = ['', '#C42B1C', '#005FB8', '#0F7B0F'];

const navItems = ref([
  { icon: '\uE80F', label: 'Home' },
  { icon: '\uE716', label: 'Account' },
  { icon: '\uE8A5', label: 'Documents' },
  { icon: '\uE713', label: 'Settings' }
]);
const selectedNav = ref([navItems.value[0]]);

const placement = computed(() => (isRight.value ? 'Right' : 'Left'));
const displayMode = computed(() => displayModes[displayModeIndex.value]);
const paneBackground = computed(() => paneBgColors[paneBgIndex.value]);
</script>

<style scoped>
.split-view-demo {
  height: 420px;
  overflow: hidden;
}

.split-view-content-body {
  padding: 24px;
}

.split-view-content-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.split-nav-icon {
  width: 24px;
  text-align: center;
  flex-shrink: 0;
  font-size: 16px;
}

.split-nav-label {
  white-space: nowrap;
}

.split-view-options-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.split-option-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.split-option-label {
  font-size: 13px;
  color: var(--text-primary);
}

.split-option-value {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
