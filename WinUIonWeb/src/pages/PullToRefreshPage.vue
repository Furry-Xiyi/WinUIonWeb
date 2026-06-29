<template>
  <h1 class="page-header">PullToRefresh</h1>
  <p class="page-description">A container that allows users to refresh content by pulling down from the top on touch devices.</p>

  <WinControlExample headerText="Default Style">
    <template #example>
      <WinPullToRefresh @refresh="onRefresh" style="width: 100%; height: 200px; background: var(--card-bg-secondary); border-radius: 4px; overflow: auto;">
        <div style="padding: 20px; display: flex; justify-content: space-between; align-items: center;">
          <p style="margin: 0;">Pull down to refresh</p>
          <p style="margin: 0; font-weight: 600; color: var(--accent-base);">Refresh count: {{ count }}</p>
        </div>
      </WinPullToRefresh>
    </template>
  </WinControlExample>

  <WinControlExample headerText="Custom Symbol">
    <template #example>
      <WinPullToRefresh icon="&#xE117" @refresh="onRefreshCustom" style="width: 100%; height: 200px; background: var(--card-bg-secondary); border-radius: 4px; overflow: auto;">
        <div style="padding: 20px; display: flex; justify-content: space-between; align-items: center;">
          <p style="margin: 0;">Pull down to sync data</p>
          <p style="margin: 0; font-weight: 600; color: var(--accent-base);">Sync count: {{ customCount }}</p>
        </div>
      </WinPullToRefresh>
    </template>
  </WinControlExample>
</template>

<script setup>
import { ref } from 'vue';
import WinPullToRefresh from '../components/WinPullToRefresh.vue';
import WinControlExample from '../components/WinControlExample.vue';

const count = ref(0);
const customCount = ref(0);

const onRefresh = (done) => {
  setTimeout(() => { count.value++; done(); }, 1500);
};

const onRefreshCustom = (done) => {
  setTimeout(() => { customCount.value++; done(); }, 1500);
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
  margin: 0 0 24px 0;
  line-height: 20px;
}
</style>
