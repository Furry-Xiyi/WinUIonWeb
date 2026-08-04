<template>
  <WinButton
    v-bind="buttonAttrs"
    class="win-toggle-button"
    :class="[stateClasses, attrs.class]"
    :style="buttonStyle"
    :IsEnabled="props.IsEnabled"
    @Click="onClick">
    <slot>{{ Content }}</slot>
  </WinButton>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { CSSProperties } from 'vue';
import WinButton from './WinButton.vue';

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
  return { ...rest, 'aria-pressed': ariaPressed.value };
});

const isDisabled = computed(() => props.IsEnabled === false);
const isChecked = computed(() => props.IsChecked === true);
const isIndeterminate = computed(() => props.IsChecked === null);
const ariaPressed = computed<boolean | 'mixed'>(() => isIndeterminate.value ? 'mixed' : isChecked.value);

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
    style['--ButtonBorderBrushTop'] = props.BorderBrush;
    style['--ButtonBorderBrushBottom'] = props.BorderBrush;
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
  --ToggleButtonCheckedStateBackgroundSizing: OuterBorderEdge;
  --ToggleButtonBackgroundChecked: var(--accent-base);
  --ToggleButtonBackgroundCheckedPointerOver: var(--accent-hover);
  --ToggleButtonBackgroundCheckedPressed: var(--accent-pressed);
  --ToggleButtonBackgroundCheckedDisabled: var(--accent-fill-disabled);
  --ToggleButtonForegroundChecked: var(--accent-text);
  --ToggleButtonForegroundCheckedPointerOver: var(--accent-text);
  --ToggleButtonForegroundCheckedPressed: var(--accent-text-secondary);
  --ToggleButtonForegroundCheckedDisabled: var(--text-disabled);
  --ToggleButtonBorderBrushChecked: var(--accent-border);
  --ToggleButtonBorderBrushCheckedTop: var(--ToggleButtonBorderBrushChecked);
  --ToggleButtonBorderBrushCheckedPointerOver: var(--accent-border);
  --ToggleButtonBorderBrushCheckedPointerOverTop: var(--ToggleButtonBorderBrushCheckedPointerOver);
  --ToggleButtonBorderBrushCheckedPressed: transparent;
  --ToggleButtonBorderBrushCheckedPressedTop: var(--ToggleButtonBorderBrushCheckedPressed);
  --ToggleButtonBorderBrushCheckedDisabled: transparent;
  --ToggleButtonBorderBrushCheckedDisabledTop: var(--ToggleButtonBorderBrushCheckedDisabled);
  --ToggleButtonBorderBrushCheckedBottom: var(--accent-border-accent);
  --ToggleButtonBorderBrushCheckedPointerOverBottom: var(--accent-border-accent);
  --ToggleButtonBorderBrushCheckedPressedBottom: var(--ToggleButtonBorderBrushCheckedPressed);
  --ToggleButtonBorderBrushCheckedDisabledBottom: var(--ToggleButtonBorderBrushCheckedDisabled);
}

.win-toggle-button.is-checked {
  --ButtonBackground: var(--ToggleButtonBackgroundChecked);
  --ButtonBackgroundPointerOver: var(--ToggleButtonBackgroundCheckedPointerOver);
  --ButtonBackgroundPressed: var(--ToggleButtonBackgroundCheckedPressed);
  --ButtonBackgroundDisabled: var(--ToggleButtonBackgroundCheckedDisabled);
  --ButtonForeground: var(--ToggleButtonForegroundChecked);
  --ButtonForegroundPointerOver: var(--ToggleButtonForegroundCheckedPointerOver);
  --ButtonForegroundPressed: var(--ToggleButtonForegroundCheckedPressed);
  --ButtonForegroundDisabled: var(--ToggleButtonForegroundCheckedDisabled);
  --ButtonBorderBrush: var(--ToggleButtonBorderBrushChecked);
  --ButtonBorderBrushTop: var(--ToggleButtonBorderBrushCheckedTop);
  --ButtonBorderBrushPointerOver: var(--ToggleButtonBorderBrushCheckedPointerOver);
  --ButtonBorderBrushPointerOverTop: var(--ToggleButtonBorderBrushCheckedPointerOverTop);
  --ButtonBorderBrushPressed: var(--ToggleButtonBorderBrushCheckedPressed);
  --ButtonBorderBrushPressedTop: var(--ToggleButtonBorderBrushCheckedPressedTop);
  --ButtonBorderBrushDisabled: var(--ToggleButtonBorderBrushCheckedDisabled);
  --ButtonBorderBrushDisabledTop: var(--ToggleButtonBorderBrushCheckedDisabledTop);
  --ButtonBorderBrushBottom: var(--ToggleButtonBorderBrushCheckedBottom);
  --ButtonBorderBrushPointerOverBottom: var(--ToggleButtonBorderBrushCheckedPointerOverBottom);
  --ButtonBorderBrushPressedBottom: var(--ToggleButtonBorderBrushCheckedPressedBottom);
  --ButtonBorderBrushDisabledBottom: var(--ToggleButtonBorderBrushCheckedDisabledBottom);
}

@media (prefers-color-scheme: dark) {
  :global(html:not(.theme-light)) .win-toggle-button.is-checked {
    --ToggleButtonBorderBrushCheckedTop: var(--accent-border-accent);
    --ToggleButtonBorderBrushCheckedPointerOverTop: var(--accent-border-accent);
    --ToggleButtonBorderBrushCheckedBottom: var(--accent-border);
    --ToggleButtonBorderBrushCheckedPointerOverBottom: var(--accent-border);
  }
}

:global(html.theme-dark) .win-toggle-button.is-checked,
:global(.example-theme-wrapper.theme-dark) .win-toggle-button.is-checked,
:global(.win-theme-scope.theme-dark) .win-toggle-button.is-checked {
  --ToggleButtonBorderBrushCheckedTop: var(--accent-border-accent);
  --ToggleButtonBorderBrushCheckedPointerOverTop: var(--accent-border-accent);
  --ToggleButtonBorderBrushCheckedBottom: var(--accent-border);
  --ToggleButtonBorderBrushCheckedPointerOverBottom: var(--accent-border);
}

:global(.example-theme-wrapper.theme-light) .win-toggle-button.is-checked,
:global(.win-theme-scope.theme-light) .win-toggle-button.is-checked {
  --ToggleButtonBorderBrushCheckedTop: var(--accent-border);
  --ToggleButtonBorderBrushCheckedPointerOverTop: var(--accent-border);
  --ToggleButtonBorderBrushCheckedPressedTop: var(--ToggleButtonBorderBrushCheckedPressed);
  --ToggleButtonBorderBrushCheckedDisabledTop: var(--ToggleButtonBorderBrushCheckedDisabled);
  --ToggleButtonBorderBrushCheckedBottom: var(--accent-border-accent);
  --ToggleButtonBorderBrushCheckedPointerOverBottom: var(--accent-border-accent);
  --ToggleButtonBorderBrushCheckedPressedBottom: var(--ToggleButtonBorderBrushCheckedPressed);
  --ToggleButtonBorderBrushCheckedDisabledBottom: var(--ToggleButtonBorderBrushCheckedDisabled);
}

</style>
