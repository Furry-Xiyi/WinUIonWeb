<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.pulltorefresh')" />
          <WinTextBlock class="page-description" :Text="$t('text.a-container-that-allows-users-to-refresh-content')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.pulltorefresh.basic')" :theme="pageTheme" :vue="basicPullToRefreshVue">
              <template #example>
                <WinPullToRefresh class="refresh-surface" @RefreshRequested="rc_RefreshRequested">
                  <div class="refresh-row">
                    <WinTextBlock :Text="$t('sample.pulltorefresh.pull-down')" />
                    <WinTextBlock class="accent-output" :Text="`${$t('sample.pulltorefresh.refresh-count')}: ${count}`" />
                  </div>
                </WinPullToRefresh>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.pulltorefresh.custom-icon')" :theme="pageTheme" :vue="customIconPullToRefreshVue">
              <template #example>
                <WinPullToRefresh class="refresh-surface" icon="&#xE1E2" @RefreshRequested="rc_CustomIconRefreshRequested">
                  <div class="refresh-row">
                    <WinTextBlock :Text="$t('sample.pulltorefresh.pull-down-custom')" />
                    <WinTextBlock class="accent-output" :Text="`${$t('sample.pulltorefresh.sync-count')}: ${customCount}`" />
                  </div>
                </WinPullToRefresh>
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
import WinPullToRefresh from '../../components/WinPullToRefresh.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'pulltorefresh');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const count = ref(0);
const customCount = ref(0);

const completeRefresh = (event, callback) => {
  window.setTimeout(() => {
    callback();
    event.Complete();
  }, 1500);
};

const rc_RefreshRequested = (event) => {
  completeRefresh(event, () => { count.value += 1; });
};

const rc_CustomIconRefreshRequested = (event) => {
  completeRefresh(event, () => { customCount.value += 1; });
};

const basicPullToRefreshVue = `<WinPullToRefresh @RefreshRequested="rc_RefreshRequested">
  <div>
    <WinTextBlock Text="Pull down to refresh" />
  </div>
</WinPullToRefresh>`;

const customIconPullToRefreshVue = `<WinPullToRefresh icon="&#xE1E2;" @RefreshRequested="rc_CustomIconRefreshRequested">
  <div>
    <WinTextBlock Text="Pull down to sync data" />
  </div>
</WinPullToRefresh>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.refresh-surface { width: 300px; height: 300px; background: var(--card-bg-secondary); border: 1px solid var(--text-primary); }
.refresh-row { padding: 20px; display: flex; justify-content: space-between; align-items: center; gap: 24px; }
.accent-output { color: var(--accent-base); font-weight: 600; }
</style>
