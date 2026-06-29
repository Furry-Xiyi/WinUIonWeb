<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">ComboBox</h1>
      <p class="page-description">
        Use a ComboBox (also known as a drop-down list) to present a list of items a user can select from. A ComboBox starts in a compact state and expands to show a list of selectable items.
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

    <WinControlExample headerText="A ComboBox with inline items." :theme="pageTheme">
      <template #example>
        <WinComboBox
          :options="colors"
          v-model="selectedColorIndex"
          placeholder="Pick a color"
          header="Colors"
          style="width: 200px;" />
      </template>
      <template #output>
        <div
          v-if="selectedColorIndex !== null && selectedColorIndex >= 0"
          class="color-preview"
          :style="{ backgroundColor: colors[selectedColorIndex].value }">
        </div>
      </template>
    </WinControlExample>

    <WinControlExample headerText="A ComboBox with an ItemsSource." :theme="pageTheme">
      <template #example>
        <WinComboBox
          :options="fonts"
          v-model="selectedFontIndex"
          header="Font"
          style="min-width: 200px;" />
      </template>
      <template #output>
        <div
          v-if="selectedFontIndex !== null && selectedFontIndex >= 0"
          class="output-text"
          :style="{ fontFamily: fonts[selectedFontIndex].value }">
          You can set the font used for this text.
        </div>
      </template>
    </WinControlExample>

    <WinControlExample headerText="An editable ComboBox." :theme="pageTheme">
      <template #example>
        <WinComboBox
          :options="fontSizes"
          v-model="selectedFontSizeIndex"
          :editable="true"
          header="Font Size"
          style="width: 200px;" />
      </template>
      <template #output>
        <div
          v-if="selectedFontSizeIndex !== null && selectedFontSizeIndex >= 0"
          class="output-text"
          :style="{ fontSize: fontSizes[selectedFontSizeIndex].value }">
          You can set the font size used for this text.
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue';
import WinComboBox from '../components/WinComboBox.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'combobox');

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

// Color options
const colors = [
  { label: 'Blue', value: '#0078D4' },
  { label: 'Green', value: '#10893E' },
  { label: 'Red', value: '#D13438' },
  { label: 'Yellow', value: '#FFB900' }
];
const selectedColorIndex = ref(null);

// Font options
const fonts = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Comic Sans MS', value: 'Comic Sans MS' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Segoe UI', value: 'Segoe UI' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Trebuchet MS', value: 'Trebuchet MS' },
  { label: 'Verdana', value: 'Verdana' }
];
const selectedFontIndex = ref(4); // Default to Segoe UI

// Font size options
const fontSizes = [
  { label: '8', value: '8px' },
  { label: '9', value: '9px' },
  { label: '10', value: '10px' },
  { label: '11', value: '11px' },
  { label: '12', value: '12px' },
  { label: '14', value: '14px' },
  { label: '16', value: '16px' },
  { label: '18', value: '18px' },
  { label: '20', value: '20px' },
  { label: '24', value: '24px' },
  { label: '28', value: '28px' },
  { label: '36', value: '36px' },
  { label: '48', value: '48px' },
  { label: '72', value: '72px' }
];
const selectedFontSizeIndex = ref(5); // Default to 14
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

.color-preview {
  width: 100px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid var(--control-stroke-default);
}

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}
</style>
