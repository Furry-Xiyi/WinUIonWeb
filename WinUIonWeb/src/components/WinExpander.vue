<template>
  <div
    class="win-expander"
    :class="{ 'is-expanded': isExpandedState, 'expand-up': ExpandDirection === 'Up' }"
    :style="rootStyle">
    <button
      class="win-expander-header"
      @click="toggleExpanded"
      :aria-expanded="isExpandedState"
      type="button">
      <div class="win-expander-header-main">
        <span v-if="hasHeaderIcon" class="win-expander-header-icon icon" aria-hidden="true">
          <slot name="HeaderIcon">
            <span v-if="isHeaderIconMarkup" v-html="HeaderIcon"></span>
            <template v-else>{{ HeaderIcon }}</template>
          </slot>
        </span>
        <div class="win-expander-header-content">
          <slot name="Header">
            <WinTextBlock
              v-if="Header"
              class="win-expander-header-text"
              :Text="Header"
              FontSize="14"
              LineHeight="20"
              TextWrapping="Wrap" />
          </slot>
          <slot name="Description">
            <WinTextBlock
              v-if="Description"
              class="win-expander-description"
              :Text="Description"
              FontSize="var(--SettingsCardDescriptionFontSize, 12px)"
              LineHeight="16"
              Foreground="var(--TextFillColorSecondaryBrush, var(--text-secondary))"
              TextWrapping="Wrap" />
          </slot>
        </div>
      </div>
      <span class="win-expander-chevron" aria-hidden="true">
        <span class="icon win-expander-arrow"></span>
      </span>
    </button>
    <div class="win-expander-grid">
      <div class="win-expander-inner">
        <div class="win-expander-content" :style="contentStyle"><slot></slot></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, useSlots, watch } from 'vue';
import WinTextBlock from './WinTextBlock.vue';

const props = defineProps({
  Header: { type: [String, Number], default: '' },
  Description: { type: [String, Number], default: '' },
  HeaderIcon: { type: String, default: '' },
  HeaderTemplate: { type: [Object, Function, String], default: null },
  HeaderTemplateSelector: { type: [Object, Function, String], default: null },
  IsExpanded: { type: Boolean, default: false },
  ExpandDirection: { type: String, default: 'Down' },
  Padding: { type: [String, Number], default: '16' },
  HorizontalContentAlignment: { type: String, default: 'Stretch' },
  VerticalContentAlignment: { type: String, default: 'Stretch' },
  Width: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }
});

const emit = defineEmits(['update:IsExpanded', 'Expanding', 'Collapsed']);

const isExpandedState = ref(props.IsExpanded);
const slots = useSlots();
const hasHeaderIcon = computed(() => Boolean(props.HeaderIcon) || Boolean(slots.HeaderIcon));
const isHeaderIconMarkup = computed(() => props.HeaderIcon.trim().startsWith('<'));
const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) {
    return `${Number(value.trim())}px`;
  }
  return typeof value === 'number' ? `${value}px` : value;
};

const expanderHeaderHeight = (value) => {
  const length = cssLength(value);
  if (!length || length === 'auto') return '';

  const numericValue = typeof value === 'number'
    ? value
    : (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))
      ? Number(value.trim())
      : null);

  return numericValue === null
    ? `calc(${length} - 2px)`
    : `${Math.max(numericValue - 2, 0)}px`;
};

const xamlThickness = (value) => {
  if (value === '' || value === undefined || value === null) return '';

  const parts = String(value)
    .split(',')
    .map((part) => {
      const trimmed = part.trim();
      return cssLength(Number.isNaN(Number(trimmed)) ? trimmed : Number(trimmed));
    });

  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return String(value);
};

const flexAlignment = (value) => ({
  Left: 'flex-start',
  Center: 'center',
  Right: 'flex-end',
  Stretch: 'stretch'
}[value] ?? 'stretch');

const flexDistribution = (value) => ({
  Top: 'flex-start',
  Center: 'center',
  Bottom: 'flex-end',
  Stretch: 'flex-start'
}[value] ?? 'flex-start');

const selfAlignment = (value) => ({
  Top: 'flex-start',
  Center: 'center',
  Bottom: 'flex-end',
  Stretch: 'stretch'
}[value] ?? 'stretch');

const justifySelfAlignment = (value) => ({
  Left: 'start',
  Center: 'center',
  Right: 'end',
  Stretch: 'stretch'
}[value] ?? 'stretch');

const contentStyle = computed(() => ({
  padding: xamlThickness(props.Padding),
  alignItems: flexAlignment(props.HorizontalContentAlignment),
  justifyContent: flexDistribution(props.VerticalContentAlignment)
}));

const rootStyle = computed(() => {
  const style = {};
  if (props.Height !== '') {
    const height = cssLength(props.Height);
    if (height) {
      style.minHeight = height;
      const headerHeight = expanderHeaderHeight(props.Height);
      if (headerHeight) style['--win-expander-header-height'] = headerHeight;
    }
  }
  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.MinWidth !== '') style.minWidth = cssLength(props.MinWidth);
  if (props.MaxWidth !== '') style.maxWidth = cssLength(props.MaxWidth);
  if (props.HorizontalAlignment) style.justifySelf = justifySelfAlignment(props.HorizontalAlignment);
  if (props.VerticalAlignment) style.alignSelf = selfAlignment(props.VerticalAlignment);
  return style;
});

watch(() => props.IsExpanded, (newVal) => {
  isExpandedState.value = newVal;
});

const toggleExpanded = () => {
  const nextValue = !isExpandedState.value;
  isExpandedState.value = nextValue;
  emit('update:IsExpanded', nextValue);

  if (nextValue) {
    emit('Expanding');
  } else {
    emit('Collapsed');
  }
};
</script>

<style scoped>
.win-expander {
  border: 1px solid var(--card-stroke);
  border-radius: 4px;
  margin-bottom: 4px;
}

.win-expander-header {
  position: relative;
  isolation: isolate;
  width: 100%;
  height: var(--win-expander-header-height, auto);
  min-height: 48px;
  padding: 0 16px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 4px;
  transition: background var(--fast-duration) var(--fast-out-slow-in);
  color: var(--text-primary);
  font-size: 14px;
  text-align: left;
}

.win-expander-header::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
  background: var(--win-expander-header-fill, var(--CardBackgroundFillColorDefaultBrush, var(--card-bg)));
}

.win-expander-header-main {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0;
  flex: 1;
}

.win-expander-header-icon {
  width: 20px;
  height: 20px;
  max-width: 20px;
  max-height: 20px;
  margin: 0 20px 0 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--TextFillColorSecondaryBrush, var(--text-secondary));
  font-size: 20px;
  line-height: 20px;
  flex-shrink: 0;
}

.win-expander-header-content {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.win-expander-header-text {
  color: var(--text-primary);
  line-height: 20px;
}

.win-expander-description {
  color: var(--TextFillColorSecondaryBrush, var(--text-secondary));
  font-size: var(--SettingsCardDescriptionFontSize, 12px);
  line-height: 16px;
  margin-top: 0;
}

.win-expander.is-expanded .win-expander-header {
  border-radius: 4px 4px 0 0;
}

.win-expander.expand-up {
  display: flex;
  flex-direction: column-reverse;
}

.win-expander.expand-up.is-expanded .win-expander-header {
  border-radius: 0 0 4px 4px;
}

.win-expander-chevron {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 12px;
  transition: background var(--fast-duration) var(--fast-out-slow-in);
  flex-shrink: 0;
}

.win-expander-header:hover .win-expander-chevron {
  background: var(--subtle-secondary);
}

.win-expander-header:active .win-expander-chevron {
  background: var(--subtle-tertiary);
}

.win-expander-arrow {
  position: relative;
  top: 0;
  font-size: 12px;
  display: block;
  transition: transform var(--fast-duration) var(--fast-out-slow-in), top var(--fast-duration) var(--fast-out-slow-in);
}

.win-expander:not(.expand-up):not(.is-expanded) .win-expander-header:active .win-expander-arrow,
.win-expander.expand-up.is-expanded .win-expander-header:active .win-expander-arrow {
  top: -1px;
}

.win-expander:not(.expand-up).is-expanded .win-expander-header:active .win-expander-arrow,
.win-expander.expand-up:not(.is-expanded) .win-expander-header:active .win-expander-arrow {
  top: 1px;
}

.win-expander:not(.expand-up).is-expanded .win-expander-arrow {
  transform: rotate(180deg);
}

.win-expander.expand-up.is-expanded .win-expander-arrow {
  transform: rotate(0deg);
}

.win-expander.expand-up:not(.is-expanded) .win-expander-arrow {
  transform: rotate(180deg);
}

.win-expander-grid {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--normal-duration) var(--fast-out-slow-in);
}

.win-expander.is-expanded .win-expander-grid {
  grid-template-rows: 1fr;
}

.win-expander-inner {
  overflow: hidden;
}

.win-expander.is-expanded .win-expander-inner {
  border-top: 1px solid var(--stroke-divider);
}

.win-expander.expand-up.is-expanded .win-expander-inner {
  border-top: none;
  border-bottom: 1px solid var(--stroke-divider);
}

.win-expander-content {
  position: relative;
  isolation: isolate;
  min-height: 48px;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-direction: column;
  background: transparent;
  border-radius: 0 0 3px 3px;
}

.win-expander-content::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
  background: var(--win-expander-content-fill, var(--CardBackgroundFillColorSecondaryBrush, var(--card-bg-secondary)));
}

.win-expander.expand-up .win-expander-content {
  border-radius: 3px 3px 0 0;
}
</style>
