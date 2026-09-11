<template>
  <div class="gallery-item-page">
    <div class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.listbox')" />
          <TextBlock class="page-description" :Text="$t('text.a-control-that-presents-an-inline-list-of-items')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" @click="toggleTheme"><span class="icon">&#xE793;</span></Button>
            <ToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
          <ControlExample class="basic-input-example-theme" :headerText="$t('text.a-simple-listbox')" :theme="pageTheme">
            <template #example>
              <ListBox :ItemsSource="['Blue', 'Green', 'Red', 'Yellow']" v-model:SelectedIndex="idx" style="width: 200px;" />
            </template>
            <template #options>
              <TextBlock :Text="`Selected color: ${['Blue', 'Green', 'Red', 'Yellow'][idx] || 'None'}`" />
            </template>
          </ControlExample>
      </div>
    </ScrollViewer>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import ListBox from '../../components/ListBox.vue';
import ControlExample from '../../components/ControlExample.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
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
