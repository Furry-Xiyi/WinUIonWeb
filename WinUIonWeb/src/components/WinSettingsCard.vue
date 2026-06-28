<template>
  <div class="win-settings-card" :class="{ 'content-bottom': contentPlacement === 'bottom' }">
    <template v-if="contentPlacement === 'bottom'">
      <div class="win-settings-card-header">
        <div class="win-settings-card-left">
          <slot name="icon"></slot>
          <div class="win-settings-card-text">
            <span class="win-settings-card-title"><slot name="header"></slot></span>
            <span class="win-settings-card-desc"><slot name="description"></slot></span>
          </div>
        </div>
        <div class="win-settings-card-header-action"><slot name="headerAction"></slot></div>
      </div>
      <div class="win-settings-card-right"><slot></slot></div>
    </template>
    <template v-else>
      <div class="win-settings-card-left">
        <slot name="icon"></slot>
        <div class="win-settings-card-text">
          <span class="win-settings-card-title"><slot name="header"></slot></span>
          <span class="win-settings-card-desc"><slot name="description"></slot></span>
        </div>
      </div>
      <div class="win-settings-card-right"><slot></slot></div>
    </template>
  </div>
</template>
<script setup>
defineProps({
  contentPlacement: { type: String, default: 'right' }
});
</script>
<style>
  .win-settings-card {
    background: var(--card-bg);
    border: 1px solid var(--card-stroke);
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

    .win-settings-card.content-bottom {
      flex-direction: column;
      align-items: stretch;
    }

      .win-settings-card.content-bottom .win-settings-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }

      .win-settings-card.content-bottom .win-settings-card-right {
        width: 100%;
      }

  .win-settings-card-left {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
    flex: 1;
  }

  .win-settings-card-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .win-settings-card-title {
    font-size: 14px;
    color: var(--text-primary);
  }

  .win-settings-card-desc {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 2px;
  }

  .win-settings-card-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .win-settings-card-header-action {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    margin-left: auto;
  }
</style>
