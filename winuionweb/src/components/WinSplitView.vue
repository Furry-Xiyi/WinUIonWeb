<template>
  <div class="win-split-view"
       :class="[displayModeClass, placement === 'Right' ? 'placement-right' : 'placement-left', { 'is-open': isPaneOpen }]"
       @click="onContentClick">
    <div class="split-view-pane" :style="paneStyle" @click.stop>
      <div class="split-view-pane-inner" :style="{ width: openPaneLength + 'px' }">
        <div class="split-view-pane-title">NavigationView</div>
        <div class="split-view-pane-list">
          <slot name="pane"></slot>
        </div>
      </div>
    </div>
    <div class="split-view-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isPaneOpen: { type: Boolean, default: true },
  displayMode: { type: String, default: 'Inline' },
  placement: { type: String, default: 'Left' },
  openPaneLength: { type: Number, default: 256 },
  compactPaneLength: { type: Number, default: 48 },
  paneBackground: { type: String, default: '' }
});

const emit = defineEmits(['update:isPaneOpen']);

const displayModeClass = computed(() => ({
  Inline: 'mode-inline',
  CompactInline: 'mode-compact-inline',
  Overlay: 'mode-overlay',
  CompactOverlay: 'mode-compact-overlay'
}[props.displayMode] || 'mode-inline'));

const paneWidth = computed(() => {
  if (props.isPaneOpen) return props.openPaneLength;
  switch (props.displayMode) {
    case 'CompactInline':
    case 'CompactOverlay':
      return props.compactPaneLength;
    default:
      return 0;
  }
});

const paneStyle = computed(() => {
  const s = { width: paneWidth.value + 'px' };
  if (props.paneBackground) s.background = props.paneBackground;
  return s;
});

const onContentClick = () => {
  if (!props.isPaneOpen) return;
  if (props.displayMode === 'Overlay') {
    emit('update:isPaneOpen', false);
  } else if (props.displayMode === 'CompactOverlay') {
    emit('update:isPaneOpen', false);
  }
};
</script>

<style>
  .win-split-view {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

    .win-split-view.placement-right {
      flex-direction: row-reverse;
    }

  .split-view-pane {
    position: relative;
    flex-shrink: 0;
    display: flex;
    justify-content: flex-start;
    overflow: hidden;
    background: var(--app-bg);
    transition: width var(--normal-duration) var(--fast-out-slow-in), background var(--normal-duration) var(--fast-out-slow-in);
  }

  .placement-right .split-view-pane {
    justify-content: flex-end;
  }

  .win-split-view.mode-overlay .split-view-pane,
  .win-split-view.mode-compact-overlay .split-view-pane {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 10;
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.14);
  }

  .win-split-view.mode-overlay:not(.is-open) .split-view-pane {
    box-shadow: none;
  }

  .placement-left.mode-overlay .split-view-pane,
  .placement-left.mode-compact-overlay .split-view-pane {
    left: 0;
  }

  .placement-right.mode-overlay .split-view-pane,
  .placement-right.mode-compact-overlay .split-view-pane {
    right: 0;
  }

  .split-view-pane-inner {
    height: 100%;
    flex-shrink: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .split-view-pane-title {
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    color: var(--text-primary);
    padding: 12px 8px 8px;
    white-space: nowrap;
  }

  .split-view-pane-list {
    flex: 1;
    overflow: hidden;
    padding: 0 2px;
  }

  .split-view-content {
    flex: 1;
    min-width: 0;
    height: 100%;
    overflow: auto;
  }
</style>
