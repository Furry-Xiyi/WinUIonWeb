<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">ProgressRing</h1>
      <p class="page-description">
        Progress controls provide feedback to the user that a long-running operation is underway. The ProgressRing can indicate that the user cannot interact with the app when the ring is visible, and can also indicate an approximate wait time when the progress is determinate.
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

    <!-- Example 1: An indeterminate progress ring -->
    <WinControlExample
      headerText="An indeterminate progress ring"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <WinProgressRing
          v-if="isActive"
          :style="{ width: '60px', height: '60px', backgroundColor: backgroundColorValue1 }"
        />
        <div v-else style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); font-size: 14px;">
          Stopped
        </div>
      </template>
      <template #options>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <WinToggleSwitch
            v-model="isActive"
            header="Progress Options"
            onContent="Working"
            offContent="Do work"
          />
          <WinComboBox
            v-model="selectedBackground1"
            header="Background color"
            placeholder="Pick a color"
            :options="backgroundOptions"
            style="width: 200px;"
          />
        </div>
      </template>
    </WinControlExample>

    <!-- Example 2: A determinate progress ring -->
    <WinControlExample
      headerText="A determinate progress ring"
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
      <template #example>
        <div style="display: flex; align-items: center; gap: 60px;">
          <div style="position: relative; width: 60px; height: 60px;">
            <WinProgressRing
              :style="{
                width: '60px',
                height: '60px',
                backgroundColor: backgroundColorValue2,
                opacity: progressValue / 100
              }"
            />
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 14px; color: var(--text-primary); font-weight: 600;">
              {{ Math.round(progressValue) }}%
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; min-width: 120px;">
            <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Progress</label>
            <WinSlider
              v-model="progressValue"
              :min="0"
              :max="100"
              style="width: 200px;"
            />
            <div style="font-size: 14px; color: var(--text-primary);">
              {{ Math.round(progressValue) }}
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <WinComboBox
            v-model="selectedBackground2"
            header="Background color"
            placeholder="Pick a color"
            :options="backgroundOptions"
            style="width: 200px;"
          />
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinProgressRing from '../../components/WinProgressRing.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinToggleSwitch from '../../components/WinToggleSwitch.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinSlider from '../../components/WinSlider.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'progressring');

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

// Background options
const backgroundOptions = [
  { value: 'transparent', label: 'Transparent' },
  { value: 'lightgray', label: 'LightGray' }
];

// Example 1: Indeterminate ProgressRing
const isActive = ref(true);
const selectedBackground1 = ref('transparent');

const backgroundColorValue1 = computed(() => {
  return selectedBackground1.value === 'lightgray' ? '#D3D3D3' : 'transparent';
});

const example1Template = `<WinProgressRing
  v-if="isActive"
  :style="{
    width: '60px',
    height: '60px',
    backgroundColor: backgroundColor
  }"
/>`;

const example1Vue = `const isActive = ref(true);
const backgroundColor = ref('transparent');

// Toggle isActive to start/stop the ring
// Set backgroundColor to 'lightgray' or 'transparent'`;

// Example 2: Determinate ProgressRing
const progressValue = ref(0);
const selectedBackground2 = ref('transparent');

const backgroundColorValue2 = computed(() => {
  return selectedBackground2.value === 'lightgray' ? '#D3D3D3' : 'transparent';
});

const example2Template = `<div style="position: relative; width: 60px; height: 60px;">
  <WinProgressRing
    :style="{
      width: '60px',
      height: '60px',
      backgroundColor: backgroundColor,
      opacity: progressValue / 100
    }"
  />
  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
    {{ Math.round(progressValue) }}%
  </div>
</div>`;

const example2Vue = `const progressValue = ref(0);
const backgroundColor = ref('transparent');

// Use WinSlider to control progressValue (0-100)
// Opacity simulates determinate progress`;
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
</style>
