<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">DropDownButton</h1>
      <p class="page-description">
        A DropDownButton is a button that displays a chevron as a visual indicator that it has an attached flyout that contains more options. It has the same behavior as a standard Button with a flyout; only the appearance is different.
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

    <p class="control-example-description">A simple DropDownButton with text content</p>
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme">
      <template #example>
        <WinDropDownButton :items="emailActions">
          Email
        </WinDropDownButton>
      </template>
    </WinControlExample>

    <p class="control-example-description">A DropDownButton with an icon</p>
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme">
      <template #example>
        <WinDropDownButton :items="emailActionsWithIcons">
          <template #default>
            <span class="icon">&#xE715;</span>
          </template>
        </WinDropDownButton>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import WinDropDownButton from '../components/WinDropDownButton.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { createPageState } from '../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'dropdownbutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const emailActions = ['Send', 'Reply', 'Reply All'];

const emailActionsWithIcons = [
  { label: 'Send', icon: '' },
  { label: 'Reply', icon: '' },
  { label: 'Reply All', icon: '' }
];
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
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets', 'WinUIOnWebIcons';
  font-size: 16px;
}
</style>


