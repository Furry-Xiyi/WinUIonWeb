<template>
  <WinTextBlock class="page-header" :Text="$t('text.pulltorefresh')" />
  <WinTextBlock class="page-description" :Text="$t('text.a-container-that-allows-users-to-refresh-content')" TextWrapping="WrapWholeWords" />

  <WinTextBlock class="control-example-description" :Text="$t('text.default-style')" />

  <WinControlExample>
    <template #example>
      <WinPullToRefresh @RefreshRequested="onRefresh" style="width: 100%; height: 200px; background: var(--card-bg-secondary); border-radius: 4px; overflow: auto;">
        <div style="padding: 20px; display: flex; justify-content: space-between; align-items: center;">
          <WinTextBlock :Text="$t('text.pull-down-to-refresh')" />
          <WinTextBlock style="font-weight: 600; color: var(--accent-base);" :Text="`Refresh count: ${count}`" />
        </div>
      </WinPullToRefresh>
    </template>
  </WinControlExample>

  <WinTextBlock class="control-example-description" Text="Custom Symbol" />

  <WinControlExample>
    <template #example>
      <WinPullToRefresh icon="&#xE117" @RefreshRequested="onRefreshCustom" style="width: 100%; height: 200px; background: var(--card-bg-secondary); border-radius: 4px; overflow: auto;">
        <div style="padding: 20px; display: flex; justify-content: space-between; align-items: center;">
          <WinTextBlock Text="Pull down to sync data" />
          <WinTextBlock style="font-weight: 600; color: var(--accent-base);" :Text="`Sync count: ${customCount}`" />
        </div>
      </WinPullToRefresh>
    </template>
  </WinControlExample>
</template>

<script setup>
import { ref } from 'vue';
import WinPullToRefresh from '../../components/WinPullToRefresh.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';

const count = ref(0);
const customCount = ref(0);

const onRefresh = (event) => {
  setTimeout(() => { count.value++; event.Complete(); }, 1500);
};

const onRefreshCustom = (event) => {
  setTimeout(() => { customCount.value++; event.Complete(); }, 1500);
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
.control-example-description {
  margin-top: 16px;
  font-weight: 600;
}
</style>
