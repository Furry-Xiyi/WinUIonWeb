<template>
  <button
    v-bind="buttonAttrs"
    class="win-toggle-button"
    :class="[stateClasses, attrs.class]"
    :style="buttonStyle"
    :disabled="isDisabled"
    :aria-pressed="ariaPressed"
    @click="onClick">
    <slot>{{ Content }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { CSSProperties } from 'vue';

defineOptions({
  inheritAttrs: false
});

type ToggleButtonChecked = boolean | null;

const props = withDefaults(defineProps<{
  IsChecked?: ToggleButtonChecked;
  IsThreeState?: boolean;
  IsEnabled?: boolean;
  Content?: string | number;
  Background?: string;
  BackgroundSizing?: string;
  Foreground?: string;
  BorderBrush?: string;
  BorderThickness?: string | number;
  Padding?: string;
  Margin?: string;
  Width?: string | number;
  Height?: string | number;
  MaxWidth?: string | number;
  MaxHeight?: string | number;
  MinWidth?: string | number;
  MinHeight?: string | number;
  HorizontalAlignment?: string;
  VerticalAlignment?: string;
  FontFamily?: string;
  FontWeight?: string | number;
  FontSize?: string | number;
  UseSystemFocusVisuals?: boolean;
  FocusVisualMargin?: string | number;
  CornerRadius?: string | number;
}>(), {
  IsChecked: false,
  IsThreeState: false,
  IsEnabled: true,
  Content: '',
  Background: '',
  BackgroundSizing: 'InnerBorderEdge',
  Foreground: '',
  BorderBrush: '',
  BorderThickness: '',
  Padding: '',
  Margin: '',
  Width: '',
  Height: '',
  MaxWidth: '',
  MaxHeight: '',
  MinWidth: '',
  MinHeight: '',
  HorizontalAlignment: '',
  VerticalAlignment: '',
  FontFamily: '',
  FontWeight: '',
  FontSize: '',
  UseSystemFocusVisuals: true,
  FocusVisualMargin: '',
  CornerRadius: ''
});

const emit = defineEmits<{
  'update:IsChecked': [value: ToggleButtonChecked];
  Click: [event: MouseEvent];
  Checked: [event: MouseEvent];
  Unchecked: [event: MouseEvent];
  Indeterminate: [event: MouseEvent];
}>();

const attrs = useAttrs();

const buttonAttrs = computed(() => {
  const { class: _class, style: _style, disabled: _disabled, ...rest } = attrs;
  return rest;
});

const isDisabled = computed(() => props.IsEnabled === false);
const isChecked = computed(() => props.IsChecked === true);
const isIndeterminate = computed(() => props.IsChecked === null);
const ariaPressed = computed(() => isIndeterminate.value ? 'mixed' : String(isChecked.value));

const stateClasses = computed(() => ({
  'is-checked': isChecked.value,
  'is-indeterminate': isIndeterminate.value,
  'is-disabled': isDisabled.value,
  'use-system-focus-visuals': props.UseSystemFocusVisuals
}));

const cssLength = (value: string | number | undefined) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) {
    return `${Number(value.trim())}px`;
  }
  return typeof value === 'number' ? `${value}px` : value;
};

const xamlThickness = (value: string | number | undefined) => {
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

const buttonStyle = computed(() => {
  const style: CSSProperties & Record<string, string | number | undefined> = {};

  if (props.Background) style['--ToggleButtonBackground'] = props.Background;
  if (props.Foreground) style['--ToggleButtonForeground'] = props.Foreground;
  if (props.BorderBrush) style['--ToggleButtonBorderBrush'] = props.BorderBrush;
  if (props.BorderThickness !== '') style['--ToggleButtonBorderThemeThickness'] = cssLength(props.BorderThickness);
  if (props.Padding) style.padding = props.Padding;
  if (props.Margin) style.margin = xamlThickness(props.Margin);
  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.Height !== '') style.height = cssLength(props.Height);
  if (props.MaxWidth !== '') style.maxWidth = cssLength(props.MaxWidth);
  if (props.MaxHeight !== '') style.maxHeight = cssLength(props.MaxHeight);
  if (props.MinWidth !== '') style.minWidth = cssLength(props.MinWidth);
  if (props.MinHeight !== '') style.minHeight = cssLength(props.MinHeight);
  if (props.HorizontalAlignment) style.justifySelf = props.HorizontalAlignment.toLowerCase();
  if (props.VerticalAlignment) style.alignSelf = props.VerticalAlignment.toLowerCase();
  if (props.FontFamily) style.fontFamily = props.FontFamily;
  if (props.FontWeight !== '') style.fontWeight = props.FontWeight;
  if (props.FontSize !== '') style.fontSize = cssLength(props.FontSize);
  if (props.FocusVisualMargin !== '') style.outlineOffset = cssLength(props.FocusVisualMargin);
  if (props.CornerRadius !== '') style.borderRadius = cssLength(props.CornerRadius);

  return [attrs.style as CSSProperties | undefined, style];
});

const nextCheckedValue = () => {
  if (!props.IsThreeState) {
    return !isChecked.value;
  }

  if (props.IsChecked === false) return true;
  if (props.IsChecked === true) return null;
  return false;
};

const onClick = (event: MouseEvent) => {
  if (isDisabled.value) return;

  const nextValue = nextCheckedValue();
  emit('Click', event);
  emit('update:IsChecked', nextValue);

  if (nextValue === true) emit('Checked', event);
  else if (nextValue === false) emit('Unchecked', event);
  else emit('Indeterminate', event);
};
</script>

<style scoped>
.win-toggle-button {
  --ToggleButtonBorderThemeThickness: 1px;
  --ToggleButtonCheckedStateBackgroundSizing: OuterBorderEdge;
  --ToggleButtonBackground: var(--control-fill-color-default, var(--ctrl-fill-default));
  --ToggleButtonBackgroundPointerOver: var(--control-fill-color-secondary, var(--ctrl-fill-secondary));
  --ToggleButtonBackgroundPressed: var(--control-fill-color-tertiary, var(--ctrl-fill-tertiary));
  --ToggleButtonBackgroundDisabled: var(--control-fill-color-disabled, var(--ctrl-fill-disabled));
  --ToggleButtonBackgroundChecked: var(--accent-fill-color-default, var(--accent-base));
  --ToggleButtonBackgroundCheckedPointerOver: var(--accent-fill-color-secondary, var(--accent-hover));
  --ToggleButtonBackgroundCheckedPressed: var(--accent-fill-color-tertiary, var(--accent-pressed));
  --ToggleButtonBackgroundCheckedDisabled: var(--accent-fill-color-disabled, var(--accent-fill-disabled));
  --ToggleButtonBackgroundIndeterminate: var(--control-fill-color-default, var(--ctrl-fill-default));
  --ToggleButtonBackgroundIndeterminatePointerOver: var(--control-fill-color-secondary, var(--ctrl-fill-secondary));
  --ToggleButtonBackgroundIndeterminatePressed: var(--control-fill-color-tertiary, var(--ctrl-fill-tertiary));
  --ToggleButtonBackgroundIndeterminateDisabled: var(--control-fill-color-disabled, var(--ctrl-fill-disabled));
  --ToggleButtonForeground: var(--text-fill-color-primary, var(--text-primary));
  --ToggleButtonForegroundPointerOver: var(--text-fill-color-primary, var(--text-primary));
  --ToggleButtonForegroundPressed: var(--text-fill-color-secondary, var(--text-secondary));
  --ToggleButtonForegroundDisabled: var(--text-fill-color-disabled, var(--text-disabled));
  --ToggleButtonForegroundChecked: var(--text-on-accent-fill-color-primary, var(--accent-text));
  --ToggleButtonForegroundCheckedPointerOver: var(--text-on-accent-fill-color-primary, var(--accent-text));
  --ToggleButtonForegroundCheckedPressed: var(--text-on-accent-fill-color-secondary, var(--accent-text-secondary));
  --ToggleButtonForegroundCheckedDisabled: var(--text-on-accent-fill-color-disabled, var(--text-disabled));
  --ToggleButtonForegroundIndeterminate: var(--text-fill-color-primary, var(--text-primary));
  --ToggleButtonForegroundIndeterminatePointerOver: var(--text-fill-color-primary, var(--text-primary));
  --ToggleButtonForegroundIndeterminatePressed: var(--text-fill-color-secondary, var(--text-secondary));
  --ToggleButtonForegroundIndeterminateDisabled: var(--text-fill-color-disabled, var(--text-disabled));
  --ToggleButtonBorderBrush: var(--control-elevation-border-brush, var(--ctrl-border));
  --ToggleButtonBorderBrushPointerOver: var(--control-elevation-border-brush, var(--ctrl-border));
  --ToggleButtonBorderBrushPressed: var(--control-stroke-color-default, var(--ctrl-border));
  --ToggleButtonBorderBrushDisabled: var(--control-stroke-color-default, var(--ctrl-border));
  --ToggleButtonBorderBrushChecked: var(--accent-control-elevation-border-brush, var(--accent-border));
  --ToggleButtonBorderBrushCheckedPointerOver: var(--accent-control-elevation-border-brush, var(--accent-border));
  --ToggleButtonBorderBrushCheckedPressed: transparent;
  --ToggleButtonBorderBrushCheckedDisabled: transparent;
  --ToggleButtonBorderBrushIndeterminate: var(--control-elevation-border-brush, var(--ctrl-border));
  --ToggleButtonBorderBrushIndeterminatePointerOver: var(--control-elevation-border-brush, var(--ctrl-border));
  --ToggleButtonBorderBrushIndeterminatePressed: var(--control-stroke-color-default, var(--ctrl-border));
  --ToggleButtonBorderBrushIndeterminateDisabled: var(--control-stroke-color-default, var(--ctrl-border));
  --ToggleButtonBorderBrushBottom: var(--ctrl-elevation-bottom);
  --ToggleButtonBorderBrushPointerOverBottom: var(--ctrl-elevation-bottom);
  --ToggleButtonBorderBrushPressedBottom: var(--control-stroke-color-default, var(--ctrl-border));
  --ToggleButtonBorderBrushCheckedBottom: var(--accent-border-accent);
  --ToggleButtonBorderBrushCheckedPointerOverBottom: var(--accent-border-accent);
  appearance: none;
  position: relative;
  min-height: 32px;
  min-width: 0;
  padding: var(--ButtonPadding, 5px 11px 6px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--ToggleButtonForeground);
  background: var(--ToggleButtonBackground);
  border: 0;
  border-radius: var(--ControlCornerRadius, 4px);
  cursor: pointer;
  font-family: var(--ContentControlThemeFontFamily, "Segoe UI Variable", "Segoe UI", system-ui, sans-serif);
  font-size: var(--ControlContentThemeFontSize, 14px);
  font-weight: normal;
  line-height: 20px;
  user-select: none;
  white-space: nowrap;
  transition:
    background var(--faster-duration, 83ms),
    color var(--fast-duration, 167ms);
}

.win-toggle-button::after {
  content: "";
  position: absolute;
  inset: 0;
  border: var(--ToggleButtonBorderThemeThickness) solid var(--ToggleButtonBorderBrush);
  border-bottom-color: var(--ToggleButtonBorderBrushBottom);
  border-radius: inherit;
  pointer-events: none;
}

.win-toggle-button:hover {
  color: var(--ToggleButtonForegroundPointerOver);
  background: var(--ToggleButtonBackgroundPointerOver);
}

.win-toggle-button:hover::after {
  border-color: var(--ToggleButtonBorderBrushPointerOver);
  border-bottom-color: var(--ToggleButtonBorderBrushPointerOverBottom);
}

.win-toggle-button:active {
  color: var(--ToggleButtonForegroundPressed);
  background: var(--ToggleButtonBackgroundPressed);
}

.win-toggle-button:active::after {
  border-color: var(--ToggleButtonBorderBrushPressed);
  border-bottom-color: var(--ToggleButtonBorderBrushPressedBottom);
}

.win-toggle-button.is-checked {
  color: var(--ToggleButtonForegroundChecked);
  background: var(--ToggleButtonBackgroundChecked);
}

.win-toggle-button.is-checked::after {
  border-color: var(--ToggleButtonBorderBrushChecked);
  border-bottom-color: var(--ToggleButtonBorderBrushCheckedBottom);
}

.win-toggle-button.is-checked:hover {
  color: var(--ToggleButtonForegroundCheckedPointerOver);
  background: var(--ToggleButtonBackgroundCheckedPointerOver);
}

.win-toggle-button.is-checked:hover::after {
  border-color: var(--ToggleButtonBorderBrushCheckedPointerOver);
  border-bottom-color: var(--ToggleButtonBorderBrushCheckedPointerOverBottom);
}

.win-toggle-button.is-checked:active {
  color: var(--ToggleButtonForegroundCheckedPressed);
  background: var(--ToggleButtonBackgroundCheckedPressed);
}

.win-toggle-button.is-checked:active::after {
  border-color: var(--ToggleButtonBorderBrushCheckedPressed);
  border-bottom-color: var(--ToggleButtonBorderBrushCheckedPressed);
}

.win-toggle-button.is-indeterminate {
  color: var(--ToggleButtonForegroundIndeterminate);
  background: var(--ToggleButtonBackgroundIndeterminate);
}

.win-toggle-button.is-indeterminate::after {
  border-color: var(--ToggleButtonBorderBrushIndeterminate);
}

.win-toggle-button.is-indeterminate:hover {
  color: var(--ToggleButtonForegroundIndeterminatePointerOver);
  background: var(--ToggleButtonBackgroundIndeterminatePointerOver);
}

.win-toggle-button.is-indeterminate:hover::after {
  border-color: var(--ToggleButtonBorderBrushIndeterminatePointerOver);
}

.win-toggle-button.is-indeterminate:active {
  color: var(--ToggleButtonForegroundIndeterminatePressed);
  background: var(--ToggleButtonBackgroundIndeterminatePressed);
}

.win-toggle-button.is-indeterminate:active::after {
  border-color: var(--ToggleButtonBorderBrushIndeterminatePressed);
}

.win-toggle-button:disabled {
  cursor: default;
  pointer-events: none;
}

.win-toggle-button.is-disabled {
  color: var(--ToggleButtonForegroundDisabled);
  background: var(--ToggleButtonBackgroundDisabled);
}

.win-toggle-button.is-disabled::after {
  border-color: var(--ToggleButtonBorderBrushDisabled);
}

.win-toggle-button.is-checked.is-disabled {
  color: var(--ToggleButtonForegroundCheckedDisabled);
  background: var(--ToggleButtonBackgroundCheckedDisabled);
}

.win-toggle-button.is-checked.is-disabled::after {
  border-color: var(--ToggleButtonBorderBrushCheckedDisabled);
}

.win-toggle-button.is-indeterminate.is-disabled {
  color: var(--ToggleButtonForegroundIndeterminateDisabled);
  background: var(--ToggleButtonBackgroundIndeterminateDisabled);
}

.win-toggle-button.is-indeterminate.is-disabled::after {
  border-color: var(--ToggleButtonBorderBrushIndeterminateDisabled);
}

.win-toggle-button.use-system-focus-visuals:focus-visible {
  outline: 2px solid var(--focus-stroke-color-outer, var(--text-primary));
  outline-offset: 2px;
}

:global(html.theme-dark) .win-toggle-button,
:global(.example-theme-wrapper.theme-dark) .win-toggle-button {
  --ToggleButtonBorderBrush: rgba(255, 255, 255, 0.05);
  --ToggleButtonBorderBrushPointerOver: rgba(255, 255, 255, 0.05);
  --ToggleButtonBorderBrushBottom: rgba(255, 255, 255, 0.0075);
  --ToggleButtonBorderBrushPointerOverBottom: rgba(255, 255, 255, 0.0075);
}

@media (prefers-color-scheme: dark) {
  :global(html:not(.theme-light)) .win-toggle-button {
    --ToggleButtonBorderBrush: rgba(255, 255, 255, 0.05);
    --ToggleButtonBorderBrushPointerOver: rgba(255, 255, 255, 0.05);
    --ToggleButtonBorderBrushBottom: rgba(255, 255, 255, 0.0075);
    --ToggleButtonBorderBrushPointerOverBottom: rgba(255, 255, 255, 0.0075);
  }
}
</style>
