<template>
  <h1 class="page-header">PullToRefresh</h1>

  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      Default Style
    </template>
    <template #description>
      Pull down from the top on a touch device to refresh content.
    </template>
    <WinPullToRefresh @refresh="onRefresh" style="height: 200px; background: var(--card-bg-secondary); border-radius: 4px; overflow: auto;">
      <div style="padding: 20px; display: flex; justify-content: space-between; align-items: center;">
        <p style="margin: 0;">Pull down to refresh: </p>
        <p style="margin: 0; font-weight: 600; color: var(--accent-base);">Refresh count: {{ count }}</p>
      </div>
    </WinPullToRefresh>
  </WinSettingsCard>

  <WinSettingsCard contentPlacement="bottom" style="margin-top: 16px;">
    <template #header>
      Custom Symbol
    </template>
    <template #description>
      Override the default symbol using the 'icon' prop.
    </template>
    <!-- 这里传递 unicode 字符直接通过 JS 字符串形式 -->
    <WinPullToRefresh icon="&#xE117" @refresh="onRefreshCustom" style="height: 200px; background: var(--card-bg-secondary); border-radius: 4px; overflow: auto;">
      <div style="padding: 20px; display: flex; justify-content: space-between; align-items: center;">
        <p style="margin: 0;">Pull down to sync data: </p>
        <p style="margin: 0; font-weight: 600; color: var(--accent-base);">Sync count: {{ customCount }}</p>
      </div>
    </WinPullToRefresh>
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinPullToRefresh from '../components/WinPullToRefresh.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

const count = ref(0);
const customCount = ref(0);

const onRefresh = (done) => {
  setTimeout(() => { count.value++; done(); }, 1500);
};

const onRefreshCustom = (done) => {
  setTimeout(() => { customCount.value++; done(); }, 1500);
};
</script>
