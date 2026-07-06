<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">Canvas</h1>
      <p class="page-description">
        Defines an area within which you can explicitly position child elements by using coordinates that are relative to the Canvas area.
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

    <!-- Example 1: Canvas with absolute positioning -->
    <WinControlExample
      headerText="A Canvas control."
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <div class="canvas-container">
          <div
            class="rectangle red-rect"
            :style="{
              left: `${leftValue}px`,
              top: `${topValue}px`,
              zIndex: zIndexValue
            }">
          </div>
          <div
            class="rectangle blue-rect"
            style="left: 20px; top: 20px; z-index: 1;">
          </div>
          <div
            class="rectangle green-rect"
            style="left: 40px; top: 40px; z-index: 2;">
          </div>
          <div
            class="rectangle yellow-rect"
            style="left: 60px; top: 60px; z-index: 3;">
          </div>
        </div>
      </template>
      <template #options>
        <div style="display: flex; gap: 16px;">
          <div style="display: flex; flex-direction: column;">
            <WinSlider
              v-model="topValue"
              :minimum="0"
              :maximum="100"
              :stepFrequency="1"
              orientation="vertical"
              :isDirectionReversed="true"
              style="height: 110px;">
              <template #header>
                <div style="margin-bottom: 10px;">Canvas.Top</div>
              </template>
            </WinSlider>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <WinSlider
              v-model="leftValue"
              :minimum="0"
              :maximum="100"
              :stepFrequency="1"
              style="width: 100px;">
              <template #header>Canvas.Left</template>
            </WinSlider>
            <WinSlider
              v-model="zIndexValue"
              :minimum="0"
              :maximum="4"
              :stepFrequency="1"
              style="width: 100px;">
              <template #header>Canvas.ZIndex</template>
            </WinSlider>
          </div>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinSlider from '../components/WinSlider.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'canvas');

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

// Canvas positioning values
const leftValue = ref(0);
const topValue = ref(0);
const zIndexValue = ref(0);

// Example code
const example1Template = `<div class="canvas-container">
  <div
    class="rectangle red-rect"
    :style="{
      left: \`\${leftValue}px\`,
      top: \`\${topValue}px\`,
      zIndex: zIndexValue
    }">
  </div>
  <div class="rectangle blue-rect" style="left: 20px; top: 20px; z-index: 1;"></div>
  <div class="rectangle green-rect" style="left: 40px; top: 40px; z-index: 2;"></div>
  <div class="rectangle yellow-rect" style="left: 60px; top: 60px; z-index: 3;"></div>
</div>`;

const example1Vue = `const leftValue = ref(0);
const topValue = ref(0);
const zIndexValue = ref(0);`;
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

.canvas-container {
  position: relative;
  width: 140px;
  height: 140px;
  background-color: #808080;
}

.rectangle {
  position: absolute;
  width: 40px;
  height: 40px;
}

.red-rect {
  background-color: #ff0000;
}

.blue-rect {
  background-color: #0000ff;
}

.green-rect {
  background-color: #008000;
}

.yellow-rect {
  background-color: #ffff00;
}
</style>
