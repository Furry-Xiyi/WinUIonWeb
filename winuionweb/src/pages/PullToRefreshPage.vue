<template>
  <h1 class="page-header">PullToRefresh</h1>
  <WinSettingsCard>
    <template #header>
      Touch Only
    </template>
    <template #description>
      Pull down from the top on a touch device to refresh content.
    </template>
    <WinPullToRefresh @refresh="onRefresh" style="height: 200px; background: var(--card-bg-secondary); border-radius: 4px; overflow: auto;">
      <div style="padding: 20px;">
        <p>Pull down to refresh (touch input only)</p>
        <p>Refresh count: {{ count }}</p>
      </div>
    </WinPullToRefresh>
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinPullToRefresh from '../components/WinPullToRefresh.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

const count = ref(0);
const onRefresh = (done) => {
  setTimeout(() => { count.value++; done(); }, 1500);
};
</script>
