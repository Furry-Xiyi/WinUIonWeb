<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">{{ $t('text.dropdownbutton') }}</h1>
      <p class="page-description">
        {{ $t('text.a-dropdownbutton-is-a-button-that-displays-a-che') }}
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

    <p class="control-example-description">{{ $t('text.a-simple-dropdownbutton-with-text-content') }}</p>
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme">
      <template #example>
        <WinDropDownButton :items="emailActions">
          {{ $t('text.email') }}
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
import WinDropDownButton from '../../components/WinDropDownButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import { useI18n } from '../../components/i18n';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'dropdownbutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const emailActions = ['Send', 'Reply', 'Reply All'];

const emailActionsWithIcons = [
  { label: t('text.send'), icon: '' },
  { label: t('text.reply'), icon: '' },
  { label: t('text.reply-all'), icon: '' }
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


