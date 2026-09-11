<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.pulltorefresh')" />
          <TextBlock class="page-description" :Text="$t('text.a-container-that-allows-users-to-refresh-content')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" @click="toggleTheme"><span class="icon">&#xE793;</span></Button>
            <ToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" :headerText="$t('sample.pulltorefresh.basic')" :theme="pageTheme" :vue="basicPullToRefreshVue">
              <template #example>
                <PullToRefresh class="refresh-surface" @RefreshRequested="rc_RefreshRequested">
                  <div class="refresh-row">
                    <TextBlock :Text="$t('sample.pulltorefresh.pull-down')" />
                    <TextBlock class="accent-output" :Text="`${$t('sample.pulltorefresh.refresh-count')}: ${count}`" />
                  </div>
                </PullToRefresh>
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :headerText="$t('sample.pulltorefresh.custom-icon')" :theme="pageTheme" :vue="customIconPullToRefreshVue">
              <template #example>
                <PullToRefresh class="refresh-surface" icon="&#xE1E2" @RefreshRequested="rc_CustomIconRefreshRequested">
                  <div class="refresh-row">
                    <TextBlock :Text="$t('sample.pulltorefresh.pull-down-custom')" />
                    <TextBlock class="accent-output" :Text="`${$t('sample.pulltorefresh.sync-count')}: ${customCount}`" />
                  </div>
                </PullToRefresh>
              </template>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import PullToRefresh from '../../components/PullToRefresh.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
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

const basicPullToRefreshVue = `<PullToRefresh @RefreshRequested="rc_RefreshRequested">
  <div>
    <TextBlock Text="Pull down to refresh" />
  </div>
</PullToRefresh>`;

const customIconPullToRefreshVue = `<PullToRefresh icon="&#xE1E2;" @RefreshRequested="rc_CustomIconRefreshRequested">
  <div>
    <TextBlock Text="Pull down to sync data" />
  </div>
</PullToRefresh>`;
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
