<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">RelativePanel</h1>
        <p class="page-description">
          A panel that allows you to position and align child elements in relation to each other or the parent panel.
        </p>
      </div>
      <div class="header-actions">
        <button class="icon-button" @click="toggleTheme" :title="`Switch to ${isDark ? 'light' : 'dark'} theme`">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path v-if="isDark" d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-1a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-8.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V3a.5.5 0 0 1 .5-.5zm0 11a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5zm5.5-5.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm-11 0a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5z"/>
            <path v-else d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 1a7 7 0 0 1 0 14V1z"/>
          </svg>
        </button>
        <button class="icon-button" @click="toggleFavorite" :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'">
          <svg width="16" height="16" viewBox="0 0 16 16" :fill="isFavorite ? 'currentColor' : 'none'" :stroke="isFavorite ? 'none' : 'currentColor'" stroke-width="1.5">
            <path d="M8 1.5l2.5 5 5.5.5-4 4 1 5.5-5-3-5 3 1-5.5-4-4 5.5-.5z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 基础示例 -->
    <WinControlExample
      headerText="A basic RelativePanel layout"
      :templateCode="basicTemplateCode"
      :vueCode="basicVueCode">
      <template #example>
        <div class="relative-panel" style="width: 300px; height: 120px; position: relative;">
          <div
            class="relative-item"
            style="width: 50px; height: 50px; background: #E81123; position: absolute; left: 0; top: 0;">
          </div>
          <div
            class="relative-item"
            style="width: 50px; height: 50px; background: #0078D4; position: absolute; left: 58px; top: 0;">
          </div>
          <div
            class="relative-item"
            style="width: 50px; height: 50px; background: #107C10; position: absolute; right: 0; top: 0;">
          </div>
          <div
            class="relative-item"
            style="width: 50px; height: 50px; background: #FFB900; position: absolute; right: 125px; top: 58px;">
          </div>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinControlExample from '../components/WinControlExample.vue';

const isDark = ref(false);
const isFavorite = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
};

const basicTemplateCode = `<RelativePanel Width="300">
  <Rectangle x:Name="Rectangle1" Fill="Red" Height="50" Width="50"/>
  <Rectangle x:Name="Rectangle2" Fill="Blue" Height="50" Width="50"
             RelativePanel.RightOf="Rectangle1" Margin="8,0,0,0"/>
  <Rectangle x:Name="Rectangle3" Fill="Green" Height="50" Width="50"
             RelativePanel.AlignRightWithPanel="True"/>
  <Rectangle x:Name="Rectangle4" Fill="Yellow" Height="50" Width="50"
             RelativePanel.Below="Rectangle3"
             RelativePanel.AlignHorizontalCenterWith="Rectangle3"
             Margin="0,8,0,0"/>
</RelativePanel>`;

const basicVueCode = `<div class="relative-panel" style="width: 300px; height: 120px; position: relative;">
  <!-- Rectangle1: positioned at top-left -->
  <div style="width: 50px; height: 50px; background: #E81123;
              position: absolute; left: 0; top: 0;">
  </div>

  <!-- Rectangle2: right of Rectangle1 -->
  <div style="width: 50px; height: 50px; background: #0078D4;
              position: absolute; left: 58px; top: 0;">
  </div>

  <!-- Rectangle3: aligned to right of panel -->
  <div style="width: 50px; height: 50px; background: #107C10;
              position: absolute; right: 0; top: 0;">
  </div>

  <!-- Rectangle4: below Rectangle3, centered horizontally with it -->
  <div style="width: 50px; height: 50px; background: #FFB900;
              position: absolute; right: 125px; top: 58px;">
  </div>
</div>`;
</script>

<style scoped>
.page-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
}

.header-content {
  flex: 1;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
}

.page-description {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.icon-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: var(--ctrl-fill-default);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.1s ease;
}

.icon-button:hover {
  background: var(--ctrl-fill-secondary);
}

.icon-button:active {
  background: var(--ctrl-fill-tertiary);
}

.relative-panel {
  border: 1px solid var(--ctrl-border-rest);
  border-radius: 4px;
}

.relative-item {
  border-radius: 2px;
}
</style>
