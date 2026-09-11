<template>
  <!-- 对应官方 WinUIGallery/Pages/SearchResultsPage.xaml 的 NoResultsFound 状态 -->
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="search-no-results">
      <h1 class="search-no-results-title">{{ t('search.no-results') }}</h1>
    </div>
  </ScrollViewer>
</template>

<script setup lang="ts">
import ScrollViewer from '../../components/ScrollViewer.vue';
import { useI18n } from '../../components/i18n/index';

const { t } = useI18n();
</script>

<style scoped>
.search-no-results {
  padding: 0;
}

.search-no-results-title {
  margin: 24px 24px 0 0;
  color: var(--text-primary);
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  text-align: left;
}
</style>
