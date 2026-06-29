<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">SplitButton</h1>
      <p class="page-description">
        The SplitButton is a dropdown button, but with an addition execution hit target. It's used for scenarios where you want a user to be able to invoke a command or make a choice.
      </p>
      <div class="page-header-actions">
        <WinButton
          subtle
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model="isFavoriteState"
          subtle
          @update:modelValue="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <WinControlExample headerText="A SplitButton for color picking." :theme="pageTheme">
      <template #example>
        <WinSplitButton
          :options="colorOptions"
          @click="applyColor"
          @select="selectColor">
          <template #default>
            <div
              class="color-swatch"
              :style="{ backgroundColor: currentColor }">
            </div>
          </template>
        </WinSplitButton>
      </template>
      <template #options>
        <textarea
          v-model="outputText"
          placeholder="Type something here"
          rows="4"
          style="width: 100%; font-family: 'Segoe UI'; font-size: 14px; padding: 8px; border: 1px solid var(--ctrl-border); border-radius: 4px; background: var(--ctrl-fill-default); color: var(--text-primary); resize: vertical;">
        </textarea>
      </template>
    </WinControlExample>

    <WinControlExample headerText="A SplitButton with text content." :theme="pageTheme">
      <template #example>
        <WinSplitButton
          :options="colorOptions"
          @select="selectColor2">
          Choose color
        </WinSplitButton>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue';
import WinSplitButton from '../components/WinSplitButton.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'splitbutton');

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

const currentColor = ref('Green');
const outputText = ref('');

const colorOptions = [
  'Red',
  'Orange',
  'Yellow',
  'Green',
  'Blue',
  'Indigo',
  'Violet',
  'Gray'
];

const applyColor = () => {
  console.log('Apply current color:', currentColor.value);
};

const selectColor = (color) => {
  currentColor.value = color;
};

const selectColor2 = (color) => {
  console.log('Selected color:', color);
};
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

.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 4px 0 0 4px;
}
</style>
