<template>
  <div
    class="win-settings-card"
    :class="{
      clickable: isClickEnabled,
      'content-left': contentAlignment === 'Left',
      'content-vertical': contentAlignment === 'Vertical'
    }"
    @click="handleClick"
    role="group">
    <div class="win-settings-card-header">
      <span v-if="headerIcon" class="win-settings-card-icon icon" v-html="headerIcon"></span>
      <div class="win-settings-card-text">
        <span v-if="header" class="win-settings-card-title">{{ header }}</span>
        <span v-if="description" class="win-settings-card-desc">{{ description }}</span>
        <div v-if="$slots.description" class="win-settings-card-desc-slot">
          <slot name="description"></slot>
        </div>
      </div>
    </div>
    <div
      class="win-settings-card-content"
      :class="{ 'align-left': horizontalContentAlignment === 'Left' }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  header: String,
  description: String,
  headerIcon: String,
  isClickEnabled: { type: Boolean, default: false },
  contentAlignment: { type: String, default: 'Right' }, // 'Right', 'Left', 'Vertical'
  horizontalContentAlignment: { type: String, default: 'Right' } // 'Right', 'Left'
});

const emit = defineEmits(['click']);

const handleClick = (e) => {
  if (props.isClickEnabled) {
    emit('click', e);
  }
};
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
    min-height: 68px;
  }

  .win-settings-card.clickable {
    cursor: pointer;
    transition: background 60ms ease, border-color 60ms ease;
  }

  .win-settings-card.clickable:hover {
    background: var(--subtle-fill-secondary);
    border-color: var(--card-stroke-secondary);
  }

  .win-settings-card.clickable:active {
    background: var(--subtle-fill-tertiary);
  }

  .win-settings-card.content-left {
    flex-direction: row;
    align-items: center;
  }

  .win-settings-card.content-left .win-settings-card-header {
    flex: 0 0 auto;
  }

  .win-settings-card.content-left .win-settings-card-content {
    flex: 1;
    justify-content: flex-start;
  }

  .win-settings-card.content-vertical {
    flex-direction: column;
    align-items: stretch;
  }

  .win-settings-card.content-vertical .win-settings-card-content {
    width: 100%;
  }

  .win-settings-card-header {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
    flex: 1;
  }

  .win-settings-card-icon {
    font-size: 16px;
    color: var(--text-secondary);
    flex-shrink: 0;
  }

  .win-settings-card-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .win-settings-card-title {
    font-size: 14px;
    color: var(--text-primary);
    line-height: 20px;
  }

  .win-settings-card-desc {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 2px;
    line-height: 16px;
  }

  .win-settings-card-desc-slot {
    margin-top: 2px;
  }

  .win-settings-card-content {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .win-settings-card-content.align-left {
    justify-content: flex-start;
  }
</style>
