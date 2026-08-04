<template>
  <div class="gallery-item-page">
    <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.listbox')" />
          <WinTextBlock class="page-description" :Text="$t('text.a-control-that-presents-an-inline-list-of-items')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
          <WinControlExample class="basic-input-example-theme" :headerText="$t('text.a-simple-listbox')" :theme="pageTheme">
            <template #example>
              <WinListBox :ItemsSource="['Blue', 'Green', 'Red', 'Yellow']" v-model:SelectedIndex="idx" style="width: 200px;" />
            </template>
            <template #options>
              <WinTextBlock :Text="`Selected color: ${['Blue', 'Green', 'Red', 'Yellow'][idx] || 'None'}`" />
            </template>
          </WinControlExample>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinListBox from '../../components/WinListBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'listbox');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const idx = ref(0);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
</style>
