<template>
  <div
    class="example-theme-wrapper"
    :class="themeClass"
    :data-theme="resolvedTheme">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';

const props = defineProps<{
  theme?: 'light' | 'dark' | 'system';
}>();

const resolvedTheme = computed(() => {
  if (!props.theme || props.theme === 'system') {
    // 使用全局主题
    const html = document.documentElement;
    if (html.classList.contains('theme-dark')) return 'dark';
    if (html.classList.contains('theme-light')) return 'light';
    // 检查系统偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
  return props.theme;
});

const themeClass = computed(() => {
  return `theme-${resolvedTheme.value}`;
});

provide('winuiTheme', resolvedTheme);
</script>

<style>
/* 主题包装器为子组件提供独立的主题上下文 */
.example-theme-wrapper {
  display: contents;
}

/* Light theme overrides */
.example-theme-wrapper.theme-light,
.win-theme-scope.theme-light {
  --text-primary: rgba(0, 0, 0, 0.8956);
  --text-secondary: rgba(0, 0, 0, 0.6063);
  --text-tertiary: rgba(0, 0, 0, 0.4458);
  --text-disabled: rgba(0, 0, 0, 0.3614);

  --accent-base: #0067C0;
  --accent-hover: rgba(0, 103, 192, 0.90);
  --accent-pressed: rgba(0, 103, 192, 0.80);
  --accent-fill-disabled: rgba(0, 0, 0, 0.22);
  --AccentFillColorDefaultBrush: var(--accent-base);
  --AccentFillColorSecondaryBrush: var(--accent-hover);
  --AccentFillColorTertiaryBrush: var(--accent-pressed);
  --AccentFillColorDisabledBrush: var(--accent-fill-disabled);
  --accent-aa-fill: #004E8C;
  --accent-aa-text: #FFFFFF;
  --accent-text: #FFFFFF;
  --accent-text-secondary: rgba(255, 255, 255, 0.70);
  --TextOnAccentFillColorPrimaryBrush: #FFFFFF;
  --TextOnAccentFillColorSecondaryBrush: rgba(255, 255, 255, 0.70);

  --ctrl-fill-default: rgba(255, 255, 255, 0.7);
  --ctrl-fill-secondary: rgba(249, 249, 249, 0.5);
  --ctrl-fill-tertiary: rgba(249, 249, 249, 0.3);
  --ctrl-fill-disabled: rgba(249, 249, 249, 0.3);
  --ctrl-fill-input-active: #FFFFFF;
  --control-fill-color-input-active: var(--ctrl-fill-input-active);
  --control-fill-input-active: var(--ctrl-fill-input-active);

  --ctrl-border-rest: rgba(0, 0, 0, 0.06);
  --ctrl-border: rgba(0, 0, 0, 0.06);
  --ctrl-border-accent: rgba(0, 0, 0, 0.16);
  --ctrl-strong-fill: rgba(0, 0, 0, 0.45);
  --ctrl-strong-fill-disabled: rgba(0, 0, 0, 0.32);
  --ctrl-solid-fill: #FFFFFF;
  --accent-border: rgba(255, 255, 255, 0.08);
  --accent-border-accent: rgba(0, 0, 0, 0.40);
  --ButtonBorderBrushDefaultTop: var(--ctrl-border);
  --ButtonBorderBrushDefaultBottom: var(--ctrl-border-accent);
  --AccentButtonBorderBrushDefault: var(--accent-border);
  --AccentButtonBorderBrushDefaultBottom: var(--accent-border-accent);
  --ctrl-elevation-top: rgba(255, 255, 255, 0.08);
  --ctrl-elevation-bottom: rgba(0, 0, 0, 0.16);
  --ControlElevationBorderBrush: linear-gradient(180deg, var(--ctrl-border) 0px, var(--ctrl-border-accent) 2px, var(--ctrl-border-accent) 100%);
  --AccentControlElevationBorderBrush: linear-gradient(180deg, var(--accent-border) 0px, var(--accent-border-accent) 2px, var(--accent-border-accent) 100%);
  --ctrl-stroke-default: rgba(0, 0, 0, 0.0578);
  --ctrl-strong-stroke: rgba(0, 0, 0, 0.6555);
  --ctrl-strong-stroke-disabled: rgba(0, 0, 0, 0.3665);

  --subtle-secondary: rgba(0, 0, 0, 0.0373);
  --subtle-tertiary: rgba(0, 0, 0, 0.0241);
  --subtle-fill-color-secondary: var(--subtle-secondary);
  --subtle-fill-color-tertiary: var(--subtle-tertiary);
  --SubtleFillColorSecondaryBrush: var(--subtle-secondary);
  --SubtleFillColorTertiaryBrush: var(--subtle-tertiary);

  --TextFillColorPrimaryBrush: var(--text-primary);
  --TextFillColorSecondaryBrush: var(--text-secondary);
  --TextFillColorTertiaryBrush: var(--text-tertiary);
  --TextFillColorDisabledBrush: var(--text-disabled);
  --TextFillColorInverseBrush: #FFFFFF;
  --ControlFillColorDefaultBrush: var(--ctrl-fill-default);
  --ControlFillColorSecondaryBrush: var(--ctrl-fill-secondary);
  --ControlFillColorTertiaryBrush: var(--ctrl-fill-tertiary);
  --ControlFillColorDisabledBrush: var(--ctrl-fill-disabled);
  --ControlFillColorInputActiveBrush: var(--ctrl-fill-input-active);
  --ControlStrokeColorDefaultBrush: var(--ctrl-border);
  --control-stroke-color-default: var(--ctrl-border);
  --ControlStrongStrokeColorDefaultBrush: var(--ctrl-strong-stroke);
  --TextControlBackground: var(--ControlFillColorDefaultBrush);
  --TextControlBackgroundPointerOver: var(--ControlFillColorSecondaryBrush);
  --TextControlBackgroundFocused: var(--ControlFillColorInputActiveBrush);
  --TextControlBackgroundDisabled: var(--ControlFillColorDisabledBrush);
  --TextControlForeground: var(--TextFillColorPrimaryBrush);
  --TextControlForegroundPointerOver: var(--TextFillColorPrimaryBrush);
  --TextControlForegroundFocused: var(--TextFillColorPrimaryBrush);
  --TextControlForegroundDisabled: var(--TextFillColorDisabledBrush);
  --TextControlPlaceholderForeground: var(--TextFillColorSecondaryBrush);
  --TextControlPlaceholderForegroundPointerOver: var(--TextFillColorSecondaryBrush);
  --TextControlPlaceholderForegroundFocused: var(--TextFillColorSecondaryBrush);
  --TextControlPlaceholderForegroundDisabled: var(--TextFillColorDisabledBrush);
  --TextControlButtonBackgroundPointerOver: var(--SubtleFillColorSecondaryBrush);
  --TextControlButtonBackgroundPressed: var(--SubtleFillColorTertiaryBrush);
  --TextControlButtonForeground: var(--TextFillColorSecondaryBrush);
  --TextControlButtonForegroundPointerOver: var(--TextFillColorSecondaryBrush);
  --TextControlButtonForegroundPressed: var(--TextFillColorTertiaryBrush);

  --card-bg-default: rgba(255, 255, 255, 0.7);
  --card-bg-secondary: rgba(246, 246, 246, 0.5);
  --card-bg: var(--card-bg-default);
  --CardBackgroundFillColorDefaultBrush: var(--card-bg-default);
  --CardBackgroundFillColorSecondaryBrush: var(--card-bg-secondary);
  --card-stroke: rgba(0, 0, 0, 0.06);
  --CardStrokeColorDefaultBrush: rgba(0, 0, 0, 0.06);
  --SystemFillColorAttentionBrush: #0067C0;
  --SystemFillColorSuccessBrush: #0F7B0F;
  --SystemFillColorCautionBrush: #9D5D00;
  --SystemFillColorCriticalBrush: #C42B1C;
  --SystemFillColorSolidNeutralBrush: #8A8A8A;
  --SystemFillColorAttentionBackgroundBrush: rgba(246, 246, 246, 0.50);
  --SystemFillColorSuccessBackgroundBrush: #DFF6DD;
  --SystemFillColorCautionBackgroundBrush: #FFF4CE;
  --SystemFillColorCriticalBackgroundBrush: #FDE7E9;
  --SystemFillColorSolidNeutralBackgroundBrush: #F3F3F3;
  --stroke-divider: rgba(0, 0, 0, 0.06);
  --stroke-surface-flyout: rgba(0, 0, 0, 0.06);
  --flyout-border: rgba(0, 0, 0, 0.06);
  --flyout-bg: rgba(252, 252, 252, 0.92);
  --flyout-background: var(--flyout-bg);
  --flyout-backdrop: blur(30px) saturate(160%) brightness(1.02);
  --AcrylicInAppFillColorDefaultBrush: var(--flyout-bg);
  --ToolTipBackgroundBrush: var(--AcrylicInAppFillColorDefaultBrush);
  --ToolTipForegroundBrush: var(--text-primary);
  --ToolTipBorderBrush: var(--surface-stroke-color-flyout);
  --layer-default: rgba(255, 255, 255, 0.50);
  --layer-fill-color-default: var(--layer-default);
  --surface-stroke-color-flyout: var(--stroke-surface-flyout);
  --divider-stroke: var(--stroke-divider);
}

/* Dark theme overrides */
.example-theme-wrapper.theme-dark,
.win-theme-scope.theme-dark {
  --text-primary: rgba(255, 255, 255, 1);
  --text-secondary: rgba(255, 255, 255, 0.786);
  --text-tertiary: rgba(255, 255, 255, 0.5442);
  --text-disabled: rgba(255, 255, 255, 0.3628);

  --accent-base: #4CC2FF;
  --accent-hover: rgba(96, 205, 255, 0.90);
  --accent-pressed: rgba(96, 205, 255, 0.80);
  --accent-fill-disabled: rgba(255, 255, 255, 0.16);
  --AccentFillColorDefaultBrush: var(--accent-base);
  --AccentFillColorSecondaryBrush: var(--accent-hover);
  --AccentFillColorTertiaryBrush: var(--accent-pressed);
  --AccentFillColorDisabledBrush: var(--accent-fill-disabled);
  --accent-aa-fill: #79D2FF;
  --accent-aa-text: #000000;
  --accent-text: #000000;
  --accent-text-secondary: rgba(0, 0, 0, 0.50);
  --TextOnAccentFillColorPrimaryBrush: #000000;
  --TextOnAccentFillColorSecondaryBrush: rgba(0, 0, 0, 0.50);

  --ctrl-fill-default: rgba(255, 255, 255, 0.0605);
  --ctrl-fill-secondary: rgba(255, 255, 255, 0.0837);
  --ctrl-fill-tertiary: rgba(255, 255, 255, 0.0326);
  --ctrl-fill-disabled: rgba(255, 255, 255, 0.0419);
  --ctrl-fill-input-active: rgba(30, 30, 30, 0.70);
  --control-fill-color-input-active: var(--ctrl-fill-input-active);
  --control-fill-input-active: var(--ctrl-fill-input-active);

  --ctrl-border-rest: rgba(0, 0, 0, 0.07);
  --ctrl-border: rgba(255, 255, 255, 0.0706);
  --ctrl-border-accent: rgba(255, 255, 255, 0.0941);
  --ctrl-strong-fill: rgba(255, 255, 255, 0.54);
  --ctrl-strong-fill-disabled: rgba(255, 255, 255, 0.25);
  --ctrl-solid-fill: #202020;
  --accent-border: rgba(0, 0, 0, 0.1373);
  --accent-border-accent: rgba(255, 255, 255, 0.0784);
  --ButtonBorderBrushDefaultTop: var(--ctrl-border-accent);
  --ButtonBorderBrushDefaultBottom: var(--ctrl-border);
  --AccentButtonBorderBrushDefault: var(--accent-border-accent);
  --AccentButtonBorderBrushDefaultBottom: var(--accent-border);
  --ctrl-elevation-top: rgba(255, 255, 255, 0.0941);
  --ctrl-elevation-bottom: rgba(255, 255, 255, 0.0706);
  --ControlElevationBorderBrush: linear-gradient(180deg, var(--ctrl-border-accent) 0px, var(--ctrl-border-accent) 1px, var(--ctrl-border) 3px, var(--ctrl-border) 100%);
  --AccentControlElevationBorderBrush: linear-gradient(180deg, var(--accent-border-accent) 0px, var(--accent-border) 2px, var(--accent-border) 100%);
  --ctrl-stroke-default: rgba(255, 255, 255, 0.0706);
  --ctrl-strong-stroke: rgba(255, 255, 255, 0.5442);
  --ctrl-strong-stroke-disabled: rgba(255, 255, 255, 0.1581);

  --subtle-secondary: rgba(255, 255, 255, 0.0605);
  --subtle-tertiary: rgba(255, 255, 255, 0.0419);
  --subtle-fill-color-secondary: var(--subtle-secondary);
  --subtle-fill-color-tertiary: var(--subtle-tertiary);
  --SubtleFillColorSecondaryBrush: var(--subtle-secondary);
  --SubtleFillColorTertiaryBrush: var(--subtle-tertiary);

  --TextFillColorPrimaryBrush: var(--text-primary);
  --TextFillColorSecondaryBrush: var(--text-secondary);
  --TextFillColorTertiaryBrush: var(--text-tertiary);
  --TextFillColorDisabledBrush: var(--text-disabled);
  --TextFillColorInverseBrush: rgba(0, 0, 0, 0.89);
  --ControlFillColorDefaultBrush: var(--ctrl-fill-default);
  --ControlFillColorSecondaryBrush: var(--ctrl-fill-secondary);
  --ControlFillColorTertiaryBrush: var(--ctrl-fill-tertiary);
  --ControlFillColorDisabledBrush: var(--ctrl-fill-disabled);
  --ControlFillColorInputActiveBrush: var(--ctrl-fill-input-active);
  --ControlStrokeColorDefaultBrush: var(--ctrl-border);
  --control-stroke-color-default: var(--ctrl-border);
  --ControlStrongStrokeColorDefaultBrush: var(--ctrl-strong-stroke);
  --TextControlBackground: var(--ControlFillColorDefaultBrush);
  --TextControlBackgroundPointerOver: var(--ControlFillColorSecondaryBrush);
  --TextControlBackgroundFocused: var(--ControlFillColorInputActiveBrush);
  --TextControlBackgroundDisabled: var(--ControlFillColorDisabledBrush);
  --TextControlForeground: var(--TextFillColorPrimaryBrush);
  --TextControlForegroundPointerOver: var(--TextFillColorPrimaryBrush);
  --TextControlForegroundFocused: var(--TextFillColorPrimaryBrush);
  --TextControlForegroundDisabled: var(--TextFillColorDisabledBrush);
  --TextControlPlaceholderForeground: var(--TextFillColorSecondaryBrush);
  --TextControlPlaceholderForegroundPointerOver: var(--TextFillColorSecondaryBrush);
  --TextControlPlaceholderForegroundFocused: var(--TextFillColorSecondaryBrush);
  --TextControlPlaceholderForegroundDisabled: var(--TextFillColorDisabledBrush);
  --TextControlButtonBackgroundPointerOver: var(--SubtleFillColorSecondaryBrush);
  --TextControlButtonBackgroundPressed: var(--SubtleFillColorTertiaryBrush);
  --TextControlButtonForeground: var(--TextFillColorSecondaryBrush);
  --TextControlButtonForegroundPointerOver: var(--TextFillColorSecondaryBrush);
  --TextControlButtonForegroundPressed: var(--TextFillColorTertiaryBrush);

  --card-bg-default: rgba(255, 255, 255, 0.0512);
  --card-bg-secondary: rgba(255, 255, 255, 0.0326);
  --card-bg: var(--card-bg-default);
  --CardBackgroundFillColorDefaultBrush: var(--card-bg-default);
  --CardBackgroundFillColorSecondaryBrush: var(--card-bg-secondary);
  --card-stroke: rgba(0, 0, 0, 0.10);
  --CardStrokeColorDefaultBrush: rgba(0, 0, 0, 0.10);
  --SystemFillColorAttentionBrush: #4CC2FF;
  --SystemFillColorSuccessBrush: #6CCB5F;
  --SystemFillColorCautionBrush: #FCE100;
  --SystemFillColorCriticalBrush: #FF99A4;
  --SystemFillColorSolidNeutralBrush: #9D9D9D;
  --SystemFillColorAttentionBackgroundBrush: rgba(255, 255, 255, 0.0314);
  --SystemFillColorSuccessBackgroundBrush: #393D1B;
  --SystemFillColorCautionBackgroundBrush: #433519;
  --SystemFillColorCriticalBackgroundBrush: #442726;
  --SystemFillColorSolidNeutralBackgroundBrush: #2E2E2E;
  --stroke-divider: rgba(255, 255, 255, 0.08);
  --stroke-surface-flyout: rgba(0, 0, 0, 0.20);
  --flyout-border: rgba(0, 0, 0, 0.20);
  --flyout-bg: rgba(44, 44, 44, 0.86);
  --flyout-background: var(--flyout-bg);
  --flyout-backdrop: blur(44px) saturate(190%) brightness(1.22) contrast(1.05);
  --AcrylicInAppFillColorDefaultBrush: var(--flyout-bg);
  --ToolTipBackgroundBrush: var(--AcrylicInAppFillColorDefaultBrush);
  --ToolTipForegroundBrush: var(--text-primary);
  --ToolTipBorderBrush: var(--surface-stroke-color-flyout);
  --layer-default: rgba(58, 58, 58, 0.50);
  --layer-fill-color-default: var(--layer-default);
  --surface-stroke-color-flyout: var(--stroke-surface-flyout);
  --divider-stroke: var(--stroke-divider);
}
</style>
