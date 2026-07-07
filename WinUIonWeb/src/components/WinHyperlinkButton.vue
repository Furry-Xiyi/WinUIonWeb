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
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  Margin: { type: String, default: '' },
  Padding: { type: String, default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }
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
  if (props.HorizontalAlignment) style.justifySelf = props.HorizontalAlignment.toLowerCase();
  if (props.VerticalAlignment) style.alignSelf = props.VerticalAlignment.toLowerCase();
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
  gap: 4px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--accent-base);
  font-size: 14px;
  font-family: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: background var(--fast-duration) var(--fast-out-slow-in),
              color var(--fast-duration) var(--fast-out-slow-in);
  user-select: none;
}

.win-hyperlink-button:hover {
  background: var(--subtle-secondary);
  color: var(--accent-hover);
  text-decoration: underline;
}

.win-hyperlink-button:active {
  background: var(--subtle-tertiary);
  color: var(--accent-pressed);
}

.win-hyperlink-button:disabled,
.win-hyperlink-button.disabled {
  color: var(--text-disabled);
  cursor: not-allowed;
  pointer-events: none;
}
</style>
