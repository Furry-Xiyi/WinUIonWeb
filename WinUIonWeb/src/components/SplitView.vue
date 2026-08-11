<template>
  <div class="win-split-view"
       :class="[displayModeClass, PanePlacement === 'Right' ? 'placement-right' : 'placement-left', { 'is-open': IsPaneOpen }]"
       :style="rootStyle"
       @click="onContentClick">
    <div class="split-view-pane" :style="paneStyle" @click.stop>
      <div class="split-view-pane-inner" :style="{ width: OpenPaneLength + 'px' }">
        <slot name="Pane"><slot name="pane"></slot></slot>
      </div>
    </div>
    <WinScrollViewer
      class="split-view-content"
      VerticalScrollMode="Auto"
      VerticalScrollBarVisibility="Auto"
      HorizontalScrollMode="Disabled"
      HorizontalScrollBarVisibility="Disabled">
      <slot></slot>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import WinScrollViewer from './WinScrollViewer.vue';

const props = defineProps({
  IsPaneOpen: { type: Boolean, default: undefined },
  DisplayMode: { type: String, default: '' },
  PanePlacement: { type: String, default: '' },
  OpenPaneLength: { type: Number, default: undefined },
  CompactPaneLength: { type: Number, default: undefined },
  PaneBackground: { type: String, default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  IsTabStop: { type: Boolean, default: false },
  isPaneOpen: { type: Boolean, default: true },
  displayMode: { type: String, default: 'Inline' },
  placement: { type: String, default: 'Left' },
  openPaneLength: { type: Number, default: 256 },
  compactPaneLength: { type: Number, default: 48 },
  paneBackground: { type: String, default: '' }
});

const emit = defineEmits(['update:IsPaneOpen', 'update:isPaneOpen']);

const IsPaneOpen = computed(() => props.IsPaneOpen ?? props.isPaneOpen);
const DisplayMode = computed(() => props.DisplayMode || props.displayMode);
const PanePlacement = computed(() => props.PanePlacement || props.placement);
const OpenPaneLength = computed(() => props.OpenPaneLength ?? props.openPaneLength);
const CompactPaneLength = computed(() => props.CompactPaneLength ?? props.compactPaneLength);
const PaneBackground = computed(() => props.PaneBackground || props.paneBackground);
const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
  return typeof value === 'number' ? `${value}px` : value;
};

const displayModeClass = computed(() => ({
  Inline: 'mode-inline',
  CompactInline: 'mode-compact-inline',
  Overlay: 'mode-overlay',
  CompactOverlay: 'mode-compact-overlay'
}[DisplayMode.value] || 'mode-inline'));

const paneWidth = computed(() => {
  if (IsPaneOpen.value) return OpenPaneLength.value;
  switch (DisplayMode.value) {
    case 'CompactInline':
    case 'CompactOverlay':
      return CompactPaneLength.value;
    default:
      return 0;
  }
});

const paneStyle = computed(() => {
  const s = { width: paneWidth.value + 'px' };
  if (PaneBackground.value) s.background = PaneBackground.value;
  return s;
});

const rootStyle = computed(() => {
  const style = {};
  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.Height !== '') style.height = cssLength(props.Height);
  if (props.MaxWidth !== '') style.maxWidth = cssLength(props.MaxWidth);
  return style;
});

const onContentClick = () => {
  if (!IsPaneOpen.value) return;
  if (DisplayMode.value === 'Overlay' || DisplayMode.value === 'CompactOverlay') {
    emit('update:IsPaneOpen', false);
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
    background: transparent;
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
    background: var(--layer-default);
    border-right: 1px solid var(--stroke-divider);
    transition: width 200ms cubic-bezier(0.1, 0.9, 0.2, 1), background var(--normal-duration) var(--fast-out-slow-in);
  }

  .placement-right .split-view-pane {
    justify-content: flex-end;
    border-right: 0;
    border-left: 1px solid var(--stroke-divider);
  }

  .win-split-view.mode-overlay .split-view-pane,
  .win-split-view.mode-compact-overlay .split-view-pane {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 10;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
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

  .split-view-content {
    flex: 1;
    min-width: 0;
    height: 100%;
  }
</style>
