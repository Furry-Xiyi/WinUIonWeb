<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">{{ $t('text.splitbutton') }}</h1>
      <p class="page-description">
        {{ $t('text.the-splitbutton-is-a-dropdown-button-but-with-an') }}
      </p>
      <div class="page-header-actions">
        <WinButton
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon"></span>
        </WinButton>
        <WinToggleButton
          v-model:IsChecked="isFavoriteState"
          @update:IsChecked="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <p class="control-example-description">{{ $t('text.a-splitbutton-for-color-picking') }}</p>
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme">
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

    <p class="control-example-description">A SplitButton with text content.</p>
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme">
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
import { ref, inject, computed } from 'vue';
import WinSplitButton from '../../components/WinSplitButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'splitbutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

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




