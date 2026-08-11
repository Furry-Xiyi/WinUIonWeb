<template>
  <button
    v-bind="buttonAttrs"
    class="win-btn"
    :class="[
      styleClass,
      {
        'content-horizontal-stretch': HorizontalContentAlignment === 'Stretch',
        'content-vertical-stretch': VerticalContentAlignment === 'Stretch'
      },
      attrs.class
    ]"
    :style="buttonStyle"
    :disabled="isDisabled"
    @click="onClick">
    <slot>{{ Content }}</slot>
  </button>
</template>
<script setup>
import { computed, useAttrs } from 'vue';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  Style: { type: String, default: '' },
  Content: { type: [String, Number], default: '' },
  IsEnabled: { type: Boolean, default: true },
  Background: { type: String, default: '' },
  BackgroundSizing: { type: String, default: '' },
  Foreground: { type: String, default: '' },
  BorderBrush: { type: String, default: '' },
  BorderThickness: { type: [String, Number], default: '' },
  Padding: { type: String, default: '' },
  Margin: { type: String, default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' },
  HorizontalContentAlignment: { type: String, default: '' },
  VerticalContentAlignment: { type: String, default: '' },
  FontFamily: { type: String, default: '' },
  FontWeight: { type: String, default: '' },
  FontSize: { type: [String, Number], default: '' },
  UseSystemFocusVisuals: { type: Boolean, default: true },
  FocusVisualMargin: { type: [String, Number], default: '' },
  CornerRadius: { type: [String, Number], default: '' }
});

const emit = defineEmits(['Click']);

const attrs = useAttrs();

const buttonAttrs = computed(() => {
  const { class: _class, style: _style, disabled: _disabled, ...rest } = attrs;
  return rest;
});

const isDisabled = computed(() => props.IsEnabled === false);

const contentAlignment = (value) => ({
  Left: 'flex-start',
  Center: 'center',
  Right: 'flex-end',
  Stretch: 'stretch',
  Top: 'flex-start',
  Bottom: 'flex-end'
}[value] ?? '');

const styleClass = computed(() => {
  return {
    DefaultButtonStyle: !props.Style || props.Style.includes('DefaultButtonStyle'),
    AccentButtonStyle: props.Style.includes('AccentButtonStyle'),
    SubtleButtonStyle: props.Style.includes('SubtleButtonStyle')
  };
});

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) {
    return '';
  }

  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) {
    return `${Number(value.trim())}px`;
  }

  return typeof value === 'number' ? `${value}px` : value;
};

const xamlThickness = (value) => {
  if (!value) {
    return '';
  }

  const parts = String(value).split(',').map((part) => cssLength(Number.isNaN(Number(part.trim())) ? part.trim() : Number(part.trim())));

  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;

  return value;
};

const buttonStyle = computed(() => {
  const style = {};

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
  if (props.HorizontalContentAlignment) {
    style.justifyContent = props.HorizontalContentAlignment === 'Stretch'
      ? 'flex-start'
      : contentAlignment(props.HorizontalContentAlignment);
  }
  if (props.VerticalContentAlignment) style.alignItems = contentAlignment(props.VerticalContentAlignment);
  if (props.FontFamily) style.fontFamily = props.FontFamily;
  if (props.FontWeight) style.fontWeight = props.FontWeight;
  if (props.FontSize !== '') style.fontSize = cssLength(props.FontSize);
  if (props.FocusVisualMargin !== '') style.outlineOffset = cssLength(props.FocusVisualMargin);
  if (props.CornerRadius !== '') style['--ButtonCornerRadius'] = cssLength(props.CornerRadius);

  return [attrs.style, style];
});

const onClick = (event) => {
  if (isDisabled.value) return;
  emit('Click', event);
};
</script>
<style>
  .win-btn {
    position: relative;
    box-sizing: border-box;
    border-left: var(--ButtonBorderThemeThickness) solid var(--ButtonBorderBrushCurrent);
    border-top: var(--ButtonBorderThemeThickness) solid var(--ButtonBorderBrushTopCurrent);
    border-right: var(--ButtonBorderThemeThickness) solid var(--ButtonBorderBrushCurrent);
    border-bottom: var(--ButtonBorderThemeThickness) solid var(--ButtonBorderBrushBottomCurrent);
    border-radius: var(--ButtonCornerRadius);
    padding: var(--ButtonPadding, 5px 11px 6px);
    font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
    font-size: var(--ControlContentThemeFontSize, 14px);
    font-weight: normal;
    min-height: 32px;
    height: auto;
    background: padding-box var(--ButtonBackgroundCurrent);
    color: var(--ButtonForegroundCurrent);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background var(--fast-duration) var(--fast-out-slow-in), color var(--fast-duration);
    user-select: none;
    --ButtonPadding: 5px 11px 6px;
    --ButtonBorderThemeThickness: 1px;
    --ButtonCornerRadius: var(--ControlCornerRadius, 4px);
    --ButtonBackground: var(--ctrl-fill-default);
    --ButtonBackgroundPointerOver: var(--ctrl-fill-secondary);
    --ButtonBackgroundPressed: var(--ctrl-fill-tertiary);
    --ButtonBackgroundDisabled: var(--ctrl-fill-disabled);
    --ButtonForeground: var(--text-primary);
    --ButtonForegroundPointerOver: var(--text-primary);
    --ButtonForegroundPressed: var(--text-secondary);
    --ButtonForegroundDisabled: var(--text-disabled);
    --ButtonBorderBrush: var(--ControlStrokeColorDefaultBrush, var(--ctrl-border));
    --ButtonBorderBrushTop: var(--ButtonBorderBrushDefaultTop, var(--ButtonBorderBrush));
    --ButtonBorderBrushBottom: var(--ButtonBorderBrushDefaultBottom, var(--ctrl-border-accent));
    --ButtonBorderBrushPointerOver: var(--ButtonBorderBrush);
    --ButtonBorderBrushPointerOverTop: var(--ButtonBorderBrushTop);
    --ButtonBorderBrushPointerOverBottom: var(--ButtonBorderBrushBottom);
    --ButtonBorderBrushPressed: var(--ControlStrokeColorDefaultBrush);
    --ButtonBorderBrushPressedTop: var(--ButtonBorderBrushPressed);
    --ButtonBorderBrushPressedBottom: var(--ButtonBorderBrushPressed);
    --ButtonBorderBrushDisabled: var(--ControlStrokeColorDefaultBrush);
    --ButtonBorderBrushDisabledTop: var(--ButtonBorderBrushDisabled);
    --ButtonBorderBrushDisabledBottom: var(--ButtonBorderBrushDisabled);
    --ButtonBackgroundCurrent: var(--ButtonBackground);
    --ButtonForegroundCurrent: var(--ButtonForeground);
    --ButtonBorderBrushCurrent: var(--ButtonBorderBrush);
    --ButtonBorderBrushTopCurrent: var(--ButtonBorderBrushTop);
    --ButtonBorderBrushBottomCurrent: var(--ButtonBorderBrushBottom);
  }

    .win-btn:hover {
      --ButtonBackgroundCurrent: var(--ButtonBackgroundPointerOver);
      --ButtonForegroundCurrent: var(--ButtonForegroundPointerOver);
      --ButtonBorderBrushCurrent: var(--ButtonBorderBrushPointerOver);
      --ButtonBorderBrushTopCurrent: var(--ButtonBorderBrushPointerOverTop);
      --ButtonBorderBrushBottomCurrent: var(--ButtonBorderBrushPointerOverBottom);
    }

    .win-btn:active {
      --ButtonBackgroundCurrent: var(--ButtonBackgroundPressed);
      --ButtonForegroundCurrent: var(--ButtonForegroundPressed);
      --ButtonBorderBrushCurrent: var(--ButtonBorderBrushPressed);
      --ButtonBorderBrushTopCurrent: var(--ButtonBorderBrushPressedTop);
      --ButtonBorderBrushBottomCurrent: var(--ButtonBorderBrushPressedBottom);
    }

    .win-btn:disabled {
      --ButtonBackgroundCurrent: var(--ButtonBackgroundDisabled);
      --ButtonForegroundCurrent: var(--ButtonForegroundDisabled);
      --ButtonBorderBrushCurrent: var(--ButtonBorderBrushDisabled);
      --ButtonBorderBrushTopCurrent: var(--ButtonBorderBrushDisabledTop);
      --ButtonBorderBrushBottomCurrent: var(--ButtonBorderBrushDisabledBottom);
      cursor: not-allowed;
      pointer-events: none;
    }

    .win-btn.AccentButtonStyle {
      --ButtonBackground: var(--AccentButtonBackground);
      --ButtonBackgroundPointerOver: var(--AccentButtonBackgroundPointerOver);
      --ButtonBackgroundPressed: var(--AccentButtonBackgroundPressed);
      --ButtonBackgroundDisabled: var(--AccentButtonBackgroundDisabled);
      --ButtonForeground: var(--AccentButtonForeground);
      --ButtonForegroundPointerOver: var(--AccentButtonForegroundPointerOver);
      --ButtonForegroundPressed: var(--AccentButtonForegroundPressed);
      --ButtonForegroundDisabled: var(--AccentButtonForegroundDisabled);
      --ButtonBorderBrush: var(--AccentButtonBorderBrush);
      --ButtonBorderBrushTop: var(--AccentButtonBorderBrush);
      --ButtonBorderBrushBottom: var(--AccentButtonBorderBrushBottom);
      --ButtonBorderBrushPointerOver: var(--AccentButtonBorderBrushPointerOver);
      --ButtonBorderBrushPointerOverTop: var(--AccentButtonBorderBrushPointerOver);
      --ButtonBorderBrushPointerOverBottom: var(--AccentButtonBorderBrushPointerOverBottom);
      --ButtonBorderBrushPressed: var(--AccentButtonBorderBrushPressed);
      --ButtonBorderBrushPressedTop: var(--AccentButtonBorderBrushPressed);
      --ButtonBorderBrushPressedBottom: var(--AccentButtonBorderBrushPressed);
      --ButtonBorderBrushDisabled: var(--AccentButtonBorderBrushDisabled);
      --ButtonBorderBrushDisabledTop: var(--AccentButtonBorderBrushDisabled);
      --ButtonBorderBrushDisabledBottom: var(--AccentButtonBorderBrushDisabled);
      --AccentButtonBackground: var(--accent-base);
      --AccentButtonBackgroundPointerOver: var(--accent-hover);
      --AccentButtonBackgroundPressed: var(--accent-pressed);
      --AccentButtonBackgroundDisabled: var(--accent-fill-disabled);
      --AccentButtonForeground: var(--accent-text);
      --AccentButtonForegroundPointerOver: var(--accent-text);
      --AccentButtonForegroundPressed: var(--accent-text-secondary);
      --AccentButtonForegroundDisabled: var(--text-disabled);
      --AccentButtonBorderBrush: var(--AccentButtonBorderBrushDefault, var(--accent-border));
      --AccentButtonBorderBrushBottom: var(--AccentButtonBorderBrushDefaultBottom, var(--accent-border-accent));
      --AccentButtonBorderBrushPointerOver: var(--AccentButtonBorderBrush);
      --AccentButtonBorderBrushPointerOverBottom: var(--AccentButtonBorderBrushBottom);
      --AccentButtonBorderBrushPressed: var(--ControlFillColorTransparentBrush, transparent);
      --AccentButtonBorderBrushDisabled: var(--ControlFillColorTransparentBrush, transparent);
    }

  .win-btn .win-text-block {
      color: inherit;
    }

  .win-btn.content-horizontal-stretch > * {
    flex: 1 1 auto;
    min-width: 0;
  }

  .win-btn.content-vertical-stretch > * {
    align-self: stretch;
  }

    .win-btn.SubtleButtonStyle {
      --ButtonBackground: var(--SubtleButtonBackground);
      --ButtonBackgroundPointerOver: var(--SubtleButtonBackgroundPointerOver);
      --ButtonBackgroundPressed: var(--SubtleButtonBackgroundPressed);
      --ButtonBackgroundDisabled: var(--SubtleButtonBackgroundDisabled);
      --ButtonForeground: var(--SubtleButtonForeground);
      --ButtonForegroundPointerOver: var(--SubtleButtonForegroundPointerOver);
      --ButtonForegroundPressed: var(--SubtleButtonForegroundPressed);
      --ButtonForegroundDisabled: var(--SubtleButtonForegroundDisabled);
      --ButtonBorderBrush: var(--SubtleButtonBorderBrush);
      --ButtonBorderBrushTop: var(--SubtleButtonBorderBrush);
      --ButtonBorderBrushBottom: var(--SubtleButtonBorderBrush);
      --ButtonBorderBrushPointerOver: var(--SubtleButtonBorderBrushPointerOver);
      --ButtonBorderBrushPointerOverTop: var(--SubtleButtonBorderBrushPointerOver);
      --ButtonBorderBrushPointerOverBottom: var(--SubtleButtonBorderBrushPointerOver);
      --ButtonBorderBrushPressed: var(--SubtleButtonBorderBrushPressed);
      --ButtonBorderBrushPressedTop: var(--SubtleButtonBorderBrushPressed);
      --ButtonBorderBrushPressedBottom: var(--SubtleButtonBorderBrushPressed);
      --ButtonBorderBrushDisabled: var(--SubtleButtonBorderBrushDisabled);
      --ButtonBorderBrushDisabledTop: var(--SubtleButtonBorderBrushDisabled);
      --ButtonBorderBrushDisabledBottom: var(--SubtleButtonBorderBrushDisabled);
      --SubtleButtonBackground: var(--subtle-transparent);
      --SubtleButtonBackgroundPointerOver: var(--subtle-secondary);
      --SubtleButtonBackgroundPressed: var(--subtle-tertiary);
      --SubtleButtonBackgroundDisabled: var(--subtle-transparent);
      --SubtleButtonForeground: var(--text-primary);
      --SubtleButtonForegroundPointerOver: var(--text-primary);
      --SubtleButtonForegroundPressed: var(--text-secondary);
      --SubtleButtonForegroundDisabled: var(--text-disabled);
      --SubtleButtonBorderBrush: var(--subtle-transparent);
      --SubtleButtonBorderBrushPointerOver: var(--subtle-transparent);
      --SubtleButtonBorderBrushPressed: var(--subtle-transparent);
      --SubtleButtonBorderBrushDisabled: var(--subtle-transparent);
    }

  .win-btn {
    white-space: nowrap;
  }

</style>
