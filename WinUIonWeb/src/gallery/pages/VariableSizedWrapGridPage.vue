<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">VariableSizedWrapGrid</h1>
      <p class="page-description">
        Positions child elements in sequential position from left to right, breaking content to the next line at the edge of the containing box. Subsequent ordering happens sequentially from top to bottom or from right to left, depending on the value of the Orientation property. Use the attached properties VariableSizedWrapGrid.ColumnSpan and VariableSizedWrapGrid.RowSpan on child elements to span multiple rows or columns.
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

    <!-- Example 1: VariableSizedWrapGrid with spanning items -->
    <WinControlExample
      headerText="VariableSizedWrapGrid"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <div class="variable-sized-wrap-grid" :class="orientationClass">
          <div class="grid-item" style="background: #E81123;"></div>
          <div class="grid-item" :class="item2SpanClass" style="background: #0078D7;"></div>
          <div class="grid-item" :class="item3SpanClass" style="background: #107C10;"></div>
          <div class="grid-item" :class="item4SpanClass" style="background: #FFB900;"></div>
        </div>
      </template>
      <template #options>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">Orientation</div>
          <WinRadioButton v-model="orientation" value="horizontal">
            Horizontal
          </WinRadioButton>
          <WinRadioButton v-model="orientation" value="vertical">
            Vertical
          </WinRadioButton>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinRadioButton from '../../components/WinRadioButton.vue';

// Page theme management
const pageTheme = ref('system');
const isFavoriteState = ref(false);

const toggleTheme = () => {
  const themes = ['system', 'light', 'dark'];
  const currentIndex = themes.indexOf(pageTheme.value);
  pageTheme.value = themes[(currentIndex + 1) % themes.length];
};

const toggleFavorite = (value) => {
  console.log('Favorite:', value);
};

// Example 1: VariableSizedWrapGrid
const orientation = ref('vertical');

const orientationClass = computed(() => {
  return orientation.value === 'horizontal' ? 'orientation-horizontal' : 'orientation-vertical';
});

const item2SpanClass = computed(() => {
  return orientation.value === 'horizontal' ? 'col-span-2' : 'row-span-2';
});

const item3SpanClass = computed(() => {
  return orientation.value === 'horizontal' ? 'row-span-2' : 'col-span-2';
});

const item4SpanClass = computed(() => {
  return orientation.value === 'horizontal' ? 'col-span-2 row-span-2' : 'col-span-2 row-span-2';
});

// Code examples
const example1Template = `<div class="variable-sized-wrap-grid" :class="orientationClass">
  <div class="grid-item" style="background: #E81123;"></div>
  <div class="grid-item" :class="item2SpanClass" style="background: #0078D7;"></div>
  <div class="grid-item" :class="item3SpanClass" style="background: #107C10;"></div>
  <div class="grid-item" :class="item4SpanClass" style="background: #FFB900;"></div>
</div>`;

const example1Vue = `const orientation = ref('vertical');

const orientationClass = computed(() => {
  return orientation.value === 'horizontal' ? 'orientation-horizontal' : 'orientation-vertical';
});

const item2SpanClass = computed(() => {
  return orientation.value === 'horizontal' ? 'col-span-2' : 'row-span-2';
});

const item3SpanClass = computed(() => {
  return orientation.value === 'horizontal' ? 'row-span-2' : 'col-span-2';
});

const item4SpanClass = computed(() => {
  return orientation.value === 'horizontal' ? 'col-span-2 row-span-2' : 'col-span-2 row-span-2';
});`;
</script>

<style scoped>
.page-header {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
}

.page-description {
  margin: 0 0 24px 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 800px;
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 8px;
}

.icon {
  font-family: 'Segoe MDL2 Assets', 'Segoe Fluent Icons', 'Segoe UI Symbol';
  font-size: 16px;
}

/* VariableSizedWrapGrid styles */
.variable-sized-wrap-grid {
  width: 400px;
  display: grid;
  gap: 4px;
}

.variable-sized-wrap-grid.orientation-vertical {
  grid-template-columns: repeat(3, 44px);
  grid-auto-rows: 44px;
  grid-auto-flow: row;
}

.variable-sized-wrap-grid.orientation-horizontal {
  grid-template-rows: repeat(3, 44px);
  grid-auto-columns: 44px;
  grid-auto-flow: column;
}

.grid-item {
  border-radius: 4px;
}

.row-span-2 {
  grid-row: span 2;
}

.col-span-2 {
  grid-column: span 2;
}
</style>
