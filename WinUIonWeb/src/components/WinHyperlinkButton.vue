<template>
  <a
    v-if="NavigateUri"
    v-bind="buttonAttrs"
    class="win-hyperlink-button"
    :class="[{ disabled: isDisabled }, attrs.class]"
    :style="buttonStyle"
    :href="NavigateUri"
    :target="TargetName || '_self'"
    :rel="TargetName === '_blank' ? 'noopener noreferrer' : undefined"
    :aria-disabled="isDisabled"
    @click="onAnchorClick">
    <slot>{{ Content }}</slot>
  </a>
  <button
    v-else
    v-bind="buttonAttrs"
    class="win-hyperlink-button"
    :class="attrs.class"
    :style="buttonStyle"
    :disabled="isDisabled"
    @click="emit('Click', $event)">
    <slot>{{ Content }}</slot>
  </button>
</template>

<script setup>
import { computed, useAttrs } from 'vue';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  Content: { type: [String, Number], default: '' },
  NavigateUri: { type: String, default: '' },
  TargetName: { type: String, default: '' },
  IsEnabled: { type: Boolean, default: true },
  Background: { type: String, default: '' },
  Foreground: { type: String, default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  Margin: { type: String, default: '' },
  Padding: { type: String, default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' },
  FontFamily: { type: String, default: '' },
  FontSize: { type: [String, Number], default: '' },
  CornerRadius: { type: [String, Number], default: '' }
});

const emit = defineEmits(['Click']);
const attrs = useAttrs();

const buttonAttrs = computed(() => {
  const { class: _class, style: _style, disabled: _disabled, ...rest } = attrs;
  return rest;
});

const isDisabled = computed(() => props.IsEnabled === false);

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) {
    return `${Number(value.trim())}px`;
  }
  return typeof value === 'number' ? `${value}px` : value;
};

const xamlThickness = (value) => {
  if (!value) return '';
  const parts = String(value).split(',').map((part) => cssLength(Number.isNaN(Number(part.trim())) ? part.trim() : Number(part.trim())));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return value;
};

const buttonStyle = computed(() => {
  const style = {};
  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.Height !== '') style.height = cssLength(props.Height);
  if (props.Margin) style.margin = xamlThickness(props.Margin);
  if (props.Padding) style.padding = xamlThickness(props.Padding);
  if (props.Background) style.background = props.Background;
  if (props.Foreground) style.color = props.Foreground;
  if (props.FontFamily) style.fontFamily = props.FontFamily;
  if (props.FontSize !== '') style.fontSize = cssLength(props.FontSize);
  if (props.CornerRadius !== '') style.borderRadius = cssLength(props.CornerRadius);
  if (props.HorizontalAlignment) {
    const map = { left: 'flex-start', center: 'center', right: 'flex-end', stretch: 'stretch', auto: 'auto' };
    style.alignSelf = map[props.HorizontalAlignment.toLowerCase()] || props.HorizontalAlignment.toLowerCase();
  }
  if (props.VerticalAlignment) {
    const vmap = { top: 'flex-start', center: 'center', bottom: 'flex-end', stretch: 'stretch', auto: 'auto' };
    style.justifySelf = vmap[props.VerticalAlignment.toLowerCase()] || props.VerticalAlignment.toLowerCase();
  }
  return [attrs.style, style];
});

const onAnchorClick = (event) => {
  if (!isDisabled.value) {
    emit('Click', event);
    return;
  }
  event.preventDefault();
  event.stopPropagation();
};
</script>

<style>
.win-hyperlink-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: var(--ButtonPadding, 5px 11px 6px);
  border: none;
  border-radius: var(--ControlCornerRadius, 4px);
  background: transparent;
  color: var(--accent-text-fill-color-primary);
  font-size: var(--ControlContentThemeFontSize, 14px);
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  font-weight: normal;
  text-decoration: none;
  cursor: pointer;
  transition: background 83ms cubic-bezier(0.1, 0.9, 0.2, 1),
              color 83ms cubic-bezier(0.1, 0.9, 0.2, 1);
  user-select: none;
  min-height: 32px;
  outline: none;
  flex: 0 0 auto;
}

.win-hyperlink-button:hover:not(:disabled):not(.disabled) {
  background: var(--subtle-fill-color-secondary, var(--subtle-secondary));
  color: var(--accent-text-fill-color-primary);
}

.win-hyperlink-button:active:not(:disabled):not(.disabled) {
  background: var(--subtle-fill-color-tertiary, var(--subtle-tertiary));
  color: var(--accent-text-fill-color-primary);
}

.win-hyperlink-button:disabled,
.win-hyperlink-button.disabled {
  color: var(--accent-text-fill-color-disabled, var(--text-disabled));
  cursor: not-allowed;
  pointer-events: none;
  opacity: 0.5;
}

.win-hyperlink-button:focus-visible {
  outline: 2px solid var(--accent-base);
  outline-offset: -3px;
}
</style>
