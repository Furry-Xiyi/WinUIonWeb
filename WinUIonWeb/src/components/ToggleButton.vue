<template>
  <Button
    v-bind="buttonAttrs"
    class="win-toggle-button"
    :class="[stateClasses, attrs.class]"
    :style="buttonStyle"
    :Style="buttonStyleName"
    :IsEnabled="props.IsEnabled"
    @Click="onClick">
    <slot>{{ resolvedContent }}</slot>
  </Button>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, useAttrs } from 'vue';
import type { CSSProperties } from 'vue';
import Button from './Button.vue';
import { resolveXamlHandler, resolveXamlValue } from './xamlRuntime';

defineOptions({
  inheritAttrs: false
});

type ToggleButtonChecked = boolean | null;

const props = withDefaults(defineProps<{
  IsChecked?: ToggleButtonChecked | string;
  IsThreeState?: boolean;
  IsEnabled?: boolean | string;
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
const instance = getCurrentInstance();

const buttonAttrs = computed(() => {
  const { class: _class, style: _style, disabled: _disabled, Click: _click, ...rest } = attrs;
  return { ...rest, 'aria-pressed': ariaPressed.value };
});

const resolvedIsEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance));
const resolvedIsChecked = computed(() => resolveXamlValue(props.IsChecked, instance));
const resolvedContent = computed(() => resolveXamlValue(props.Content, instance));
const isDisabled = computed(() => resolvedIsEnabled.value === false);
const isChecked = computed(() => resolvedIsChecked.value === true);
const isIndeterminate = computed(() => resolvedIsChecked.value === null);
const ariaPressed = computed<boolean | 'mixed'>(() => isIndeterminate.value ? 'mixed' : isChecked.value);
const buttonStyleName = computed(() => (isChecked.value || isIndeterminate.value ? 'AccentButtonStyle' : ''));

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

  if (props.Background) style['--ButtonBackground'] = props.Background;
  if (props.Foreground) style['--ButtonForeground'] = props.Foreground;
  if (props.BorderBrush) {
    style['--ButtonBorderBrush'] = props.BorderBrush;
  }
  if (props.BorderThickness !== '') style['--ButtonBorderThemeThickness'] = cssLength(props.BorderThickness);
  if (props.Padding) style.padding = xamlThickness(props.Padding);
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

  if (resolvedIsChecked.value === false) return true;
  if (resolvedIsChecked.value === true) return null;
  return false;
};

const onClick = (event: MouseEvent) => {
  if (isDisabled.value) return;

  const nextValue = nextCheckedValue();
  emit('Click', event);
  resolveXamlHandler(attrs.Click, instance)?.(event);
  emit('update:IsChecked', nextValue);

  if (nextValue === true) emit('Checked', event);
  else if (nextValue === false) emit('Unchecked', event);
  else emit('Indeterminate', event);
};
</script>
