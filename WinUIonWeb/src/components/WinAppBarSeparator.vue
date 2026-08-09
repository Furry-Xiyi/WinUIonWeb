<template>
  <div
    v-if="Visibility !== 'Collapsed'"
    :class="separatorClasses"
    :style="separatorStyle"
    role="separator"
    :tabindex="xamlTrue(IsTabStop) ? 0 : -1"
    :aria-orientation="isOverflowStyle || isHorizontal ? 'horizontal' : 'vertical'"
    :aria-hidden="Visibility === 'Hidden' ? 'true' : undefined">
    <div class="separator-line" aria-hidden="true"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

defineOptions({ inheritAttrs: true });

type XamlBoolean = boolean | 'True' | 'False';

const props = withDefaults(defineProps<{
  /** Switches the separator to the compact AppBar visual state. */
  IsCompact?: XamlBoolean;
  /** Uses the horizontal separator template used by CommandBar overflow. */
  UseOverflowStyle?: XamlBoolean;
  /** Read-only in WinUI; accepted here so a command container can describe its state. */
  IsInOverflow?: XamlBoolean;
  /** Dynamic overflow ordering metadata inherited from ICommandBarElement. */
  DynamicOverflowOrder?: number;
  /** AppBarSeparator is not a tab stop in the WinUI template. */
  IsTabStop?: XamlBoolean;
  Visibility?: 'Visible' | 'Collapsed' | 'Hidden';
  IsEnabled?: XamlBoolean;
  Foreground?: string;
  Padding?: string | number;
  Margin?: string | number;
  Width?: string | number;
  Height?: string | number;
  HorizontalAlignment?: 'Left' | 'Center' | 'Right' | 'Stretch';
  VerticalAlignment?: 'Top' | 'Center' | 'Bottom' | 'Stretch';
}>(), {
  IsCompact: false,
  UseOverflowStyle: false,
  IsInOverflow: false,
  DynamicOverflowOrder: -1,
  IsTabStop: false,
  Visibility: 'Visible',
  IsEnabled: true,
  Foreground: undefined,
  Padding: undefined,
  Margin: undefined,
  Width: undefined,
  Height: undefined,
  HorizontalAlignment: undefined,
  VerticalAlignment: undefined
});

const attrs = useAttrs();
const isHorizontal = computed(() => Boolean((attrs.class as string | undefined)?.split(' ').includes('is-horizontal')));
const xamlTrue = (value: XamlBoolean | undefined) => value === true || value === 'True';
const isOverflowStyle = computed(() => xamlTrue(props.UseOverflowStyle) || xamlTrue(props.IsInOverflow));

const cssLength = (value: string | number | undefined) => {
  if (value === undefined || value === '') return undefined;
  return typeof value === 'number' || !Number.isNaN(Number(value)) ? `${Number(value)}px` : String(value);
};

const xamlThickness = (value: string | number | undefined) => {
  if (value === undefined || value === '') return undefined;
  const parts = String(value).split(',').map((part) => cssLength(part.trim()) || '0');
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return String(value);
};

const separatorClasses = computed(() => ({
  'win-appbar-separator': true,
  'is-compact': xamlTrue(props.IsCompact),
  'is-overflow': isOverflowStyle.value,
  'is-disabled': !xamlTrue(props.IsEnabled),
  'is-hidden': props.Visibility === 'Hidden'
}));

const separatorStyle = computed(() => ({
  '--AppBarSeparatorForeground': props.Foreground || undefined,
  padding: xamlThickness(props.Padding),
  margin: xamlThickness(props.Margin),
  width: cssLength(props.Width),
  height: cssLength(props.Height),
  justifySelf: props.HorizontalAlignment ? {
    Left: 'start', Center: 'center', Right: 'end', Stretch: 'stretch'
  }[props.HorizontalAlignment] : undefined,
  alignSelf: props.VerticalAlignment ? {
    Top: 'start', Center: 'center', Bottom: 'end', Stretch: 'stretch'
  }[props.VerticalAlignment] : undefined,
}));
</script>

<style scoped>
.win-appbar-separator {
  display: grid;
  flex: 0 0 auto;
  box-sizing: border-box;
  width: 5px;
  /* FullSize is stretched by CommandBar's primary-items presenter. */
  height: auto;
  min-height: 0;
  padding: 8px 2px;
  align-self: stretch;
  place-items: stretch;
  color: var(--AppBarSeparatorForeground, var(--stroke-divider));
  transition: opacity var(--fast-duration, 167ms) var(--fast-out-slow-in, cubic-bezier(0.1, 0.9, 0.2, 1));
}

.separator-line {
  width: 1px;
  height: auto;
  min-height: 0;
  border-radius: 0.5px;
  background: currentColor;
}

.win-appbar-separator.is-compact {
  height: 48px;
  min-height: 0;
  align-self: start;
}

.win-appbar-separator.is-overflow {
  width: 100%;
  min-width: 0;
  height: 9px;
  padding: 4px 0;
  align-self: stretch;
}

.win-appbar-separator.is-overflow .separator-line {
  width: auto;
  height: 1px;
  align-self: stretch;
}

.win-appbar-separator.is-horizontal {
  width: 100%;
  min-width: 0;
  height: 9px;
  padding: 4px 0;
  align-self: stretch;
}

.win-appbar-separator.is-horizontal .separator-line {
  width: auto;
  height: 1px;
}

.win-appbar-separator.is-disabled {
  color: var(--ControlStrongStrokeColorDisabledBrush, var(--text-disabled));
  opacity: 0.55;
}

.win-appbar-separator.is-hidden {
  visibility: hidden;
}
</style>
