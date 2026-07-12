<template>
  <button
    v-bind="buttonAttrs"
    class="win-btn"
    :class="[styleClass, attrs.class]"
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

  if (props.Background) style.background = props.Background;
  if (props.Foreground) style.color = props.Foreground;
  if (props.BorderBrush) {
    style['--ButtonBorderBrush'] = props.BorderBrush;
    style['--ButtonBorderBrushBottom'] = props.BorderBrush;
  }
  if (props.BorderThickness !== '') style['--ButtonBorderThemeThickness'] = cssLength(props.BorderThickness);
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
  if (props.FontWeight) style.fontWeight = props.FontWeight;
  if (props.FontSize !== '') style.fontSize = cssLength(props.FontSize);
  if (props.FocusVisualMargin !== '') style.outlineOffset = cssLength(props.FocusVisualMargin);
  if (props.CornerRadius !== '') style.borderRadius = cssLength(props.CornerRadius);

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
    border: none;
    border-radius: var(--ControlCornerRadius, 4px);
    padding: var(--ButtonPadding, 5px 11px 6px);
    font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
    font-size: var(--ControlContentThemeFontSize, 14px);
    font-weight: normal;
    min-height: 32px;
    height: auto;
    background: var(--ButtonBackground);
    color: var(--ButtonForeground);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background var(--fast-duration) var(--fast-out-slow-in), color var(--fast-duration);
    user-select: none;
    --ButtonPadding: 5px 11px 6px;
    --ButtonBorderThemeThickness: 1px;
    --ButtonBackground: var(--ctrl-fill-default);
    --ButtonBackgroundPointerOver: var(--ctrl-fill-secondary);
    --ButtonBackgroundPressed: var(--ctrl-fill-tertiary);
    --ButtonBackgroundDisabled: var(--ctrl-fill-disabled);
    --ButtonForeground: var(--text-primary);
    --ButtonForegroundPointerOver: var(--text-primary);
    --ButtonForegroundPressed: var(--text-secondary);
    --ButtonForegroundDisabled: var(--text-disabled);
    --ButtonBorderBrush: var(--ctrl-border);
    --ButtonBorderBrushPointerOver: var(--ctrl-border);
    --ButtonBorderBrushPressed: var(--ctrl-border);
    --ButtonBorderBrushDisabled: var(--ctrl-border);
    --ButtonBorderBrushBottom: var(--ctrl-elevation-bottom);
    --ButtonBorderBrushPointerOverBottom: var(--ctrl-elevation-bottom);
    --ButtonBorderBrushPressedBottom: var(--ctrl-border);
    --ButtonBorderBrushDisabledBottom: var(--ctrl-border);
  }

    .win-btn::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      border: var(--ButtonBorderThemeThickness) solid var(--ButtonBorderBrush);
      border-bottom-color: var(--ButtonBorderBrushBottom);
      pointer-events: none;
    }

    .win-btn:hover {
      background: var(--ButtonBackgroundPointerOver);
      color: var(--ButtonForegroundPointerOver);
    }

    .win-btn:hover::after {
      border-color: var(--ButtonBorderBrushPointerOver);
      border-bottom-color: var(--ButtonBorderBrushPointerOverBottom);
    }

    .win-btn:active {
      background: var(--ButtonBackgroundPressed);
      color: var(--ButtonForegroundPressed);
    }

    .win-btn:active::after {
      border-color: var(--ButtonBorderBrushPressed);
      border-bottom-color: var(--ButtonBorderBrushPressedBottom);
    }

    .win-btn:disabled {
      background: var(--ButtonBackgroundDisabled);
      color: var(--ButtonForegroundDisabled);
      cursor: not-allowed;
      pointer-events: none;
    }

    .win-btn:disabled::after {
      border-color: var(--ButtonBorderBrushDisabled);
      border-bottom-color: var(--ButtonBorderBrushDisabledBottom);
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
      --ButtonBorderBrushPointerOver: var(--AccentButtonBorderBrushPointerOver);
      --ButtonBorderBrushPressed: var(--AccentButtonBorderBrushPressed);
      --ButtonBorderBrushDisabled: var(--AccentButtonBorderBrushDisabled);
      --ButtonBorderBrushBottom: var(--AccentButtonBorderBrushBottom);
      --ButtonBorderBrushPointerOverBottom: var(--AccentButtonBorderBrushPointerOverBottom);
      --ButtonBorderBrushPressedBottom: var(--AccentButtonBorderBrushPressed);
      --ButtonBorderBrushDisabledBottom: var(--AccentButtonBorderBrushDisabled);
      --AccentButtonBackground: var(--accent-base);
      --AccentButtonBackgroundPointerOver: var(--accent-hover);
      --AccentButtonBackgroundPressed: var(--accent-pressed);
      --AccentButtonBackgroundDisabled: var(--accent-fill-disabled);
      --AccentButtonForeground: var(--accent-text);
      --AccentButtonForegroundPointerOver: var(--accent-text);
      --AccentButtonForegroundPressed: var(--accent-text-secondary);
      --AccentButtonForegroundDisabled: var(--text-disabled);
      --AccentButtonBorderBrush: var(--accent-border);
      --AccentButtonBorderBrushBottom: var(--accent-border-accent);
      --AccentButtonBorderBrushPointerOver: var(--accent-border);
      --AccentButtonBorderBrushPointerOverBottom: var(--accent-border-accent);
      --AccentButtonBorderBrushPressed: transparent;
      --AccentButtonBorderBrushDisabled: transparent;
    }

    .win-btn .win-text-block {
      color: inherit;
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
      --ButtonBorderBrushPointerOver: var(--SubtleButtonBorderBrushPointerOver);
      --ButtonBorderBrushPressed: var(--SubtleButtonBorderBrushPressed);
      --ButtonBorderBrushDisabled: var(--SubtleButtonBorderBrushDisabled);
      --ButtonBorderBrushBottom: var(--SubtleButtonBorderBrush);
      --ButtonBorderBrushPointerOverBottom: var(--SubtleButtonBorderBrushPointerOver);
      --ButtonBorderBrushPressedBottom: var(--SubtleButtonBorderBrushPressed);
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
      --SubtleButtonBorderBrushPointerOver: var(--SubtleButtonBackgroundPointerOver);
      --SubtleButtonBorderBrushPressed: var(--SubtleButtonBackgroundPressed);
      --SubtleButtonBorderBrushDisabled: var(--subtle-transparent);
    }

    .win-btn.SubtleButtonStyle::after {
      display: none;
    }

  .win-btn {
    white-space: nowrap;
  }

  .example-theme-wrapper.theme-dark .win-btn {
    --ButtonBorderBrush: rgba(255, 255, 255, 0.05);
    --ButtonBorderBrushPointerOver: rgba(255, 255, 255, 0.05);
    --ButtonBorderBrushBottom: rgba(255, 255, 255, 0.0075);
    --ButtonBorderBrushPointerOverBottom: rgba(255, 255, 255, 0.0075);
  }

  .example-theme-wrapper.theme-dark .win-btn:active,
  .example-theme-wrapper.theme-dark .win-btn:disabled {
    --ButtonBorderBrushBottom: var(--ctrl-border);
  }

  .example-theme-wrapper.theme-dark .win-btn.AccentButtonStyle {
    --ButtonBorderBrush: var(--AccentButtonBorderBrush);
    --ButtonBorderBrushPointerOver: var(--AccentButtonBorderBrushPointerOver);
    --ButtonBorderBrushBottom: var(--AccentButtonBorderBrushBottom);
    --ButtonBorderBrushPointerOverBottom: var(--AccentButtonBorderBrushPointerOverBottom);
  }

  .example-theme-wrapper.theme-dark .win-btn.SubtleButtonStyle {
    --ButtonBorderBrush: var(--SubtleButtonBorderBrush);
    --ButtonBorderBrushPointerOver: var(--SubtleButtonBorderBrushPointerOver);
    --ButtonBorderBrushPressed: var(--SubtleButtonBorderBrushPressed);
    --ButtonBorderBrushBottom: var(--SubtleButtonBorderBrush);
    --ButtonBorderBrushPointerOverBottom: var(--SubtleButtonBorderBrushPointerOver);
    --ButtonBorderBrushPressedBottom: var(--SubtleButtonBorderBrushPressed);
  }

  .example-theme-wrapper.theme-dark .win-btn.SubtleButtonStyle:active {
    --ButtonBorderBrushBottom: var(--SubtleButtonBorderBrushPressed);
  }

  .example-theme-wrapper.theme-dark .win-btn.SubtleButtonStyle:disabled {
    --ButtonBorderBrushBottom: var(--SubtleButtonBorderBrushDisabled);
  }

</style>
