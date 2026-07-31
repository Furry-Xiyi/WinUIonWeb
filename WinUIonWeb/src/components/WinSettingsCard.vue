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
    @click="handleClick"
    :type="IsClickEnabled ? 'button' : undefined"
    :role="IsClickEnabled ? undefined : 'group'"
    v-bind="ActionIconToolTip ? { 'tooltipservice.tooltip': ActionIconToolTip } : {}">
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
            FontSize="12"
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
  IsActionIconVisible: { type: Boolean, default: true }
});

const emit = defineEmits(['Click']);

const slots = useSlots();
const hasHeaderIcon = computed(() => Boolean(props.HeaderIcon) || Boolean(slots.HeaderIcon));
const hasHeaderContent = computed(() => Boolean(props.Header) || Boolean(props.Description) || hasHeaderIcon.value || Boolean(slots.Header) || Boolean(slots.Description));
const isHeaderIconMarkup = computed(() => props.HeaderIcon.trim().startsWith('<'));
const isActionIconMarkup = computed(() => props.ActionIcon.trim().startsWith('<'));

const handleClick = (e) => {
  if (props.IsClickEnabled) {
    emit('Click', e);
  }
};
</script>

<style>
  .win-settings-card {
    width: 100%;
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
    color: var(--text-primary);
    font: inherit;
    text-align: left;
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
    justify-content: flex-start;
    align-items: center;
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
    font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
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
    font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
    font-size: 13px;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .win-settings-card.has-header-content:not(.content-left) {
      flex-direction: column;
      align-items: stretch;
    }

    .win-settings-card.has-header-content:not(.content-left) .win-settings-card-content {
      justify-content: flex-start;
    }
  }
</style>
