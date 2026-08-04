<template>
  <component
    :is="IsClickEnabled ? 'button' : 'div'"
    class="win-settings-card"
    :class="{
      clickable: IsClickEnabled,
      'content-left': ContentAlignment === 'Left',
      'content-vertical': ContentAlignment === 'Vertical',
      'has-header-content': hasHeaderContent
    }"
    :style="rootStyle"
    @click="handleClick"
    :type="IsClickEnabled ? 'button' : undefined"
    :role="IsClickEnabled ? undefined : 'group'"
    v-bind="ActionIconToolTip ? { 'tooltipservice.tooltip': ActionIconToolTip } : {}">
    <div class="win-settings-card-surface">
      <div v-if="ContentAlignment !== 'Left'" class="win-settings-card-header">
        <span v-if="hasHeaderIcon" class="win-settings-card-icon icon" aria-hidden="true">
          <slot name="HeaderIcon">
            <span v-if="isHeaderIconMarkup" v-html="HeaderIcon"></span>
            <template v-else>{{ HeaderIcon }}</template>
          </slot>
        </span>
        <div class="win-settings-card-text">
          <slot name="Header">
            <WinTextBlock
              v-if="Header"
              class="win-settings-card-title"
              :Text="Header"
              FontSize="14"
              LineHeight="20"
              TextWrapping="Wrap" />
          </slot>
          <slot name="Description">
            <WinTextBlock
              v-if="Description"
              class="win-settings-card-desc"
              :Text="Description"
              FontSize="var(--SettingsCardDescriptionFontSize, 12px)"
              LineHeight="16"
              Foreground="var(--TextFillColorSecondaryBrush, var(--text-secondary))"
              TextWrapping="Wrap" />
          </slot>
        </div>
      </div>
      <div class="win-settings-card-content">
        <slot></slot>
      </div>
      <span
        v-if="IsClickEnabled && IsActionIconVisible"
        class="win-settings-card-action-icon icon"
        aria-hidden="true">
        <slot name="ActionIcon">
          <span v-if="isActionIconMarkup" v-html="ActionIcon"></span>
          <template v-else>{{ ActionIcon }}</template>
        </slot>
      </span>
    </div>
  </component>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import WinTextBlock from './WinTextBlock.vue';

const props = defineProps({
  Header: { type: [String, Number], default: '' },
  Description: { type: [String, Number], default: '' },
  HeaderIcon: { type: String, default: '' },
  ActionIcon: { type: String, default: '\uE974' },
  ActionIconToolTip: { type: String, default: '' },
  IsClickEnabled: { type: Boolean, default: false },
  ContentAlignment: { type: String, default: 'Right' },
  IsActionIconVisible: { type: Boolean, default: true },
  Height: { type: [String, Number], default: '' },
  Width: { type: [String, Number], default: '' }
});

const emit = defineEmits(['Click']);

const slots = useSlots();
const hasHeaderIcon = computed(() => Boolean(props.HeaderIcon) || Boolean(slots.HeaderIcon));
const hasHeaderContent = computed(() => Boolean(props.Header) || Boolean(props.Description) || hasHeaderIcon.value || Boolean(slots.Header) || Boolean(slots.Description));
const isHeaderIconMarkup = computed(() => props.HeaderIcon.trim().startsWith('<'));
const isActionIconMarkup = computed(() => props.ActionIcon.trim().startsWith('<'));
const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) {
    return `${Number(value.trim())}px`;
  }
  return typeof value === 'number' ? `${value}px` : value;
};

const rootStyle = computed(() => {
  const style = {};
  if (props.Height !== '') style.minHeight = cssLength(props.Height);
  if (props.Width !== '') style.width = cssLength(props.Width);
  return style;
});

const handleClick = (e) => {
  if (props.IsClickEnabled) {
    emit('Click', e);
  }
};
</script>

<style>
  .win-settings-card {
    width: 100%;
    border: 1px solid var(--card-stroke);
    border-radius: 4px;
    margin-bottom: 4px;
    padding: 0;
    display: block;
    min-height: 68px;
    background: transparent;
    color: var(--text-primary);
    font: inherit;
    text-align: left;
    --settings-card-fill: var(--CardBackgroundFillColorDefaultBrush, var(--card-bg));
  }

  .win-settings-card-surface {
    position: relative;
    isolation: isolate;
    width: 100%;
    background: transparent;
    border-radius: 4px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    color: var(--text-primary);
    font: inherit;
    text-align: left;
  }

  .win-settings-card-surface::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    border-radius: inherit;
    background: var(--settings-card-fill);
    transition: background var(--faster-duration, 83ms) linear;
  }

  .win-settings-card.clickable {
    cursor: pointer;
  }

  .win-settings-card.clickable .win-settings-card-surface {
    cursor: pointer;
  }

  .win-settings-card.clickable:hover:not(:active) {
    color: var(--text-primary);
    --settings-card-fill: var(--control-fill-color-secondary, var(--ctrl-fill-secondary));
  }

  .win-settings-card.clickable:hover:not(:active) {
    border-color: var(--control-stroke-color-default, var(--ctrl-border));
  }

  .win-settings-card.clickable:active {
    color: var(--text-secondary);
    --settings-card-fill: var(--control-fill-color-tertiary, var(--ctrl-fill-tertiary));
  }

  .win-settings-card.clickable:active {
    border-color: var(--control-stroke-color-default, var(--ctrl-border));
  }

  .win-settings-card.clickable:active .win-settings-card-icon,
  .win-settings-card.clickable:active .win-settings-card-title,
  .win-settings-card.clickable:active .win-settings-card-desc {
    color: var(--text-secondary);
  }

  html.theme-light .win-settings-card.clickable:hover:not(:active),
  html[data-theme='light'] .win-settings-card.clickable:hover:not(:active) {
    border-bottom-color: var(--control-stroke-color-secondary, var(--ctrl-border-accent));
  }

  html.theme-dark .win-settings-card.clickable:hover:not(:active),
  html[data-theme='dark'] .win-settings-card.clickable:hover:not(:active) {
    border-top-color: var(--control-stroke-color-secondary, var(--ctrl-border-accent));
  }

  @media (prefers-color-scheme: light) {
    html:not(.theme-dark):not([data-theme='dark']) .win-settings-card.clickable:hover:not(:active) {
      border-bottom-color: var(--control-stroke-color-secondary, var(--ctrl-border-accent));
    }
  }

  @media (prefers-color-scheme: dark) {
    html:not(.theme-light):not([data-theme='light']) .win-settings-card.clickable:hover:not(:active) {
      border-top-color: var(--control-stroke-color-secondary, var(--ctrl-border-accent));
    }
  }

  .win-settings-card.content-left .win-settings-card-surface {
    justify-content: flex-start;
    align-items: center;
  }

  .win-settings-card.content-left .win-settings-card-content {
    flex: 1;
    justify-content: flex-start;
  }

  .win-settings-card.content-vertical .win-settings-card-surface {
    flex-direction: column;
    align-items: stretch;
  }

  .win-settings-card.content-vertical .win-settings-card-content {
    width: 100%;
    justify-content: flex-start;
  }

  .win-settings-card-header {
    display: flex;
    align-items: center;
    gap: 0;
    min-width: 0;
    flex: 1;
  }

  .win-settings-card-icon {
    width: 20px;
    height: 20px;
    max-width: 20px;
    max-height: 20px;
    margin: 0 20px 0 2px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--TextFillColorSecondaryBrush, var(--text-secondary));
    flex-shrink: 0;
    font-size: 20px;
    line-height: 20px;
  }

  .win-settings-card-text {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 0;
  }

  .win-settings-card-title {
    font-size: 14px;
    color: var(--text-primary);
    line-height: 20px;
  }

  .win-settings-card-desc {
    font-size: var(--SettingsCardDescriptionFontSize, 12px);
    color: var(--TextFillColorSecondaryBrush, var(--text-secondary));
    margin-top: 0;
    line-height: 16px;
  }

  .win-settings-card-content {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .win-settings-card-action-icon {
    margin-left: -2px;
    color: var(--text-secondary);
    font-size: 13px;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .win-settings-card.has-header-content:not(.content-left) .win-settings-card-surface {
      flex-direction: column;
      align-items: stretch;
    }

    .win-settings-card.has-header-content:not(.content-left) .win-settings-card-content {
      justify-content: flex-start;
    }
  }
</style>
