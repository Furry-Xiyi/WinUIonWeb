<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.flyout')" />
          <WinTextBlock class="page-description" :Text="$t('text.a-flyout-displays-lightweight-ui-that-is-either')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('text.a-button-with-a-flyout')" :theme="pageTheme" :vue="buttonFlyoutCode">
              <template #example>
                <WinFlyout ref="flyoutRef" Placement="Bottom">
                  <template #trigger>
                    <WinButton @click="flyoutRef?.toggle()">
                      <WinTextBlock :Text="$t('sample.flyout.empty-cart')" />
                    </WinButton>
                  </template>
                  <div class="flyout-stack">
                    <WinTextBlock class="flyout-message" :Text="$t('sample.flyout.remove-all')" TextWrapping="WrapWholeWords" />
                    <WinButton @click="flyoutRef?.hide()">
                      <WinTextBlock :Text="$t('sample.flyout.confirm-empty')" />
                    </WinButton>
                  </div>
                </WinFlyout>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinFlyout from '../../components/WinFlyout.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'flyout');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const flyoutRef = ref(null);

const buttonFlyoutCode = `<WinFlyout ref="flyoutRef" Placement="Bottom">
  <template #trigger>
    <WinButton @click="flyoutRef?.toggle()">
      <WinTextBlock Text="Empty cart" />
    </WinButton>
  </template>
  <WinTextBlock Text="All items will be removed. Do you want to continue?" Margin="0,0,0,12" />
  <WinButton @click="flyoutRef?.hide()">
    <WinTextBlock Text="Yes, empty my cart" />
  </WinButton>
</WinFlyout>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.flyout-stack { min-width: 220px; display: flex; flex-direction: column; gap: 12px; }
.flyout-message { max-width: 260px; }
</style>
