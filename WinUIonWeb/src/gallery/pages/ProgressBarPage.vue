<template>
  <div class="gallery-item-page">
    <div style="position: relative;" class="page-heading">
          <h1 class="page-header">ProgressBar</h1>
          <p class="page-description">
            The ProgressBar has two different visual representations: Determinate (shows specific progress toward completion), and Indeterminate (shows that an operation is underway, but doesn't block user interaction).
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
            <!-- Example 1: An indeterminate progress bar -->
            <WinControlExample
              headerText="An indeterminate progress bar"
              :theme="pageTheme"
              :templateCode="example1Template"
              :vueCode="example1Vue">
              <template #example>
                <WinProgressBar
                  :width="130"
                  :isIndeterminate="true"
                  :showError="progressState === 'error'"
                  :showPaused="progressState === 'paused'" />
              </template>
              <template #options>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <p style="margin: 0 0 4px 0; font-weight: 600; font-size: 14px;">Progress state</p>
                  <WinRadioButton
                    v-model="progressState"
                    value="running">
                    Running
                  </WinRadioButton>
                  <WinRadioButton
                    v-model="progressState"
                    value="paused">
                    Paused
                  </WinRadioButton>
                  <WinRadioButton
                    v-model="progressState"
                    value="error">
                    Error
                  </WinRadioButton>
                </div>
              </template>
            </WinControlExample>

            <!-- Example 2: A determinate progress bar -->
            <WinControlExample
              headerText="A determinate progress bar"
              :theme="pageTheme"
              :templateCode="example2Template"
              :vueCode="example2Vue">
              <template #example>
                <div style="display: flex; align-items: center; gap: 16px;">
                  <WinProgressBar
                    :width="130"
                    :value="progressValue" />
                  <span class="output-text">{{ progressValue }}%</span>
                </div>

                <div style="display: flex; align-items: center; gap: 8px;">
                  <label style="margin: 0; font-size: 14px; color: var(--text-primary);">Progress</label>
                  <WinNumberBox
                    v-model="progressValue"
                    :minimum="0"
                    :maximum="100"
                    :spinButtonPlacementMode="'Inline'"
                    style="width: 120px;" />
                </div>
              </template>
            </WinControlExample>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import WinProgressBar from '../../components/WinProgressBar.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinRadioButton from '../../components/WinRadioButton.vue';
import WinNumberBox from '../../components/WinNumberBox.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'progressbar');

const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

// Example 1: Indeterminate ProgressBar with states
const progressState = ref('running');

const example1Template = `<WinProgressBar
  :width="130"
  :isIndeterminate="true"
  :showError="progressState === 'error'"
  :showPaused="progressState === 'paused'" />`;

const example1Vue = `const progressState = ref('running');`;

// Example 2: Determinate ProgressBar
const progressValue = ref(0);

const example2Template = `<div style="display: flex; align-items: center; gap: 16px;">
  <WinProgressBar
    :width="130"
    :value="progressValue" />
  <span>{{ progressValue }}%</span>
</div>`;

const example2Vue = `const progressValue = ref(0);`;
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

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}
</style>
