<template>
  <button
    ref="buttonRef"
    :class="buttonClasses"
    :disabled="!effectiveIsEnabled"
    :aria-label="automationName || effectiveLabel || undefined"
    :aria-haspopup="hasFlyout ? (hasMenuFlyout ? 'menu' : 'dialog') : undefined"
    :aria-expanded="hasFlyout ? isFlyoutOpen : undefined"
    :style="buttonStyle"
    v-bind="{ ...$attrs, ...(effectiveToolTip ? { 'tooltipservice.tooltip': effectiveToolTip } : {}) }"
    type="button"
    @click="handleClick"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @pointerdown="onPointerDown"
    @pointerup="clearPressed"
    @pointercancel="clearPressed"
    @lostpointercapture="clearPressed">
    <span class="appbar-button-inner-border" aria-hidden="true"></span>
    <span class="appbar-button-content-root">
      <span v-if="hasIconContent" class="appbar-button-icon">
        <slot name="content">
          <span v-if="effectiveIcon" class="symbol-icon" :data-symbol="effectiveIcon">
            {{ getSymbolGlyph(effectiveIcon) }}
          </span>
        </slot>
      </span>
      <span v-if="!effectiveIsCompact && !isLabelCollapsed && effectiveLabel" class="appbar-button-label">
        {{ effectiveLabel }}
      </span>
      <span v-if="hasFlyout" class="icon appbar-button-chevron" aria-hidden="true">&#xE974;</span>
    </span>

  </button>

  <WinMenuFlyout
    v-if="hasMenuFlyout"
    :Open="showFlyout"
    :AnchorRect="anchorRect"
    :Items="menuFlyoutItems"
    :Placement="menuFlyoutDefinition.Placement || 'Bottom'"
    :Theme="menuFlyoutDefinition.Theme || ''"
    @Close="closeFlyout"
    @PointerEnter="clearPointerVisuals"
    @Select="onMenuSelect" />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from 'vue';
import WinMenuFlyout from './WinMenuFlyout.vue';

interface UICommandLike {
  Label?: string;
  Description?: string;
  IconSource?: unknown;
  CanExecute?: (parameter?: unknown) => boolean;
  Execute?: (parameter?: unknown) => void;
}

interface AppBarButtonFlyoutDefinition {
  Items?: Array<Record<string, unknown>>;
  Placement?: string;
  Theme?: string;
}

interface AppBarButtonFlyoutController {
  ShowAt?: (target?: HTMLElement) => void;
  Hide?: () => void;
  Toggle?: () => void;
  readonly IsOpen?: boolean;
}

type AppBarButtonFlyoutValue = AppBarButtonFlyoutDefinition | AppBarButtonFlyoutController;

const isFlyoutController = (flyout: AppBarButtonFlyoutValue): flyout is AppBarButtonFlyoutController => (
  !('Items' in flyout)
  && (
    ('ShowAt' in flyout && typeof flyout.ShowAt === 'function')
    || ('Hide' in flyout && typeof flyout.Hide === 'function')
    || ('Toggle' in flyout && typeof flyout.Toggle === 'function')
    || 'IsOpen' in flyout
  )
);

const props = withDefaults(defineProps<{
  Command?: UICommandLike;
  CommandParameter?: unknown;
  Flyout?: AppBarButtonFlyoutDefinition | AppBarButtonFlyoutController | Array<Record<string, unknown>> | null;
  Icon?: string;
  Label?: string;
  IsCompact?: boolean;
  LabelPosition?: 'Default' | 'Right' | 'Collapsed';
  IsEnabled?: boolean;
  Visibility?: 'Visible' | 'Collapsed';
  'ToolTipService.ToolTip'?: string;
  'AutomationProperties.Name'?: string;
  AllowFocusOnInteraction?: boolean;
  KeyboardAccelerators?: Array<{ Key: string; Modifiers?: string[] }>;
  KeyboardAcceleratorTextOverride?: string;
  Background?: string;
  Foreground?: string;
  BorderBrush?: string;
  BorderThickness?: string | number;
  CornerRadius?: string | number;
  Margin?: string | number;
  Padding?: string | number;
  Width?: string | number;
  Height?: string | number;
  MinWidth?: string | number;
  MinHeight?: string | number;
  MaxWidth?: string | number;
  MaxHeight?: string | number;
  FontFamily?: string;
  FontWeight?: string | number;
  FontSize?: string | number;
  HorizontalAlignment?: 'Left' | 'Center' | 'Right' | 'Stretch';
  VerticalAlignment?: 'Top' | 'Center' | 'Bottom' | 'Stretch';
}>(), {
  Command: undefined,
  CommandParameter: undefined,
  Flyout: undefined,
  Icon: undefined,
  Label: '',
  IsCompact: false,
  LabelPosition: 'Default',
  IsEnabled: undefined,
  Visibility: 'Visible',
  'ToolTipService.ToolTip': undefined,
  'AutomationProperties.Name': undefined,
  AllowFocusOnInteraction: false,
  KeyboardAccelerators: undefined,
  KeyboardAcceleratorTextOverride: undefined,
  Background: undefined,
  Foreground: undefined,
  BorderBrush: undefined,
  BorderThickness: undefined,
  CornerRadius: undefined,
  Margin: undefined,
  Padding: undefined,
  Width: undefined,
  Height: undefined,
  MinWidth: undefined,
  MinHeight: undefined,
  MaxWidth: undefined,
  MaxHeight: undefined,
  FontFamily: undefined,
  FontWeight: undefined,
  FontSize: undefined,
  HorizontalAlignment: undefined,
  VerticalAlignment: undefined
});

const emit = defineEmits<{
  Click: [event: MouseEvent];
  Select: [item: unknown];
}>();
const slots = useSlots();
const buttonRef = ref<HTMLButtonElement>();
const anchorRect = ref<DOMRect>();
const isPointerOver = ref(false);
const isPressed = ref(false);
const showFlyout = ref(false);
const hasMenuFlyout = computed(() => Array.isArray(props.Flyout)
  || Boolean(props.Flyout && 'Items' in props.Flyout));
const externalFlyout = computed<AppBarButtonFlyoutController | null>(() => {
  const flyout = props.Flyout;
  if (!flyout || Array.isArray(flyout) || !isFlyoutController(flyout)) return null;
  return flyout;
});
const hasFlyout = computed(() => hasMenuFlyout.value || externalFlyout.value !== null);
const isFlyoutOpen = computed(() => externalFlyout.value?.IsOpen ?? showFlyout.value);
const menuFlyoutDefinition = computed<AppBarButtonFlyoutDefinition>(() => {
  if (Array.isArray(props.Flyout)) return { Items: props.Flyout };
  if (props.Flyout && 'Items' in props.Flyout) return props.Flyout;
  return { Items: [] };
});
const menuFlyoutItems = computed(() => menuFlyoutDefinition.value.Items || []);

const commandIcon = computed(() => {
  const source = props.Command?.IconSource as { Symbol?: string } | string | undefined;
  return typeof source === 'string' ? source : source?.Symbol;
});
const effectiveIcon = computed(() => props.Icon ?? commandIcon.value);
const effectiveLabel = computed(() => props.Label || props.Command?.Label || '');
const effectiveIsCompact = computed(() => props.IsCompact);
const isLabelCollapsed = computed(() => props.LabelPosition === 'Collapsed');
const effectiveIsEnabled = computed(() => {
  if (props.IsEnabled !== undefined) return props.IsEnabled;
  return props.Command?.CanExecute?.(props.CommandParameter) ?? true;
});
const effectiveToolTip = computed(() => props['ToolTipService.ToolTip']
  || (effectiveIsCompact.value || isLabelCollapsed.value ? props.Command?.Description || effectiveLabel.value : ''));
const automationName = computed(() => props['AutomationProperties.Name']);
const hasIconContent = computed(() => Boolean(slots.content || effectiveIcon.value));
const cssLength = (value: string | number | undefined) => {
  if (value === undefined || value === '') return undefined;
  return typeof value === 'number' || !Number.isNaN(Number(value)) ? `${Number(value)}px` : value;
};
const xamlThickness = (value: string | number | undefined) => {
  if (value === undefined || value === '') return undefined;
  const parts = String(value).split(',').map((part) => cssLength(part.trim()) || '0');
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return String(value);
};
const buttonStyle = computed(() => ({
  '--AppBarButtonBackground': props.Background || undefined,
  '--AppBarButtonForeground': props.Foreground || undefined,
  '--AppBarButtonBorderBrush': props.BorderBrush || undefined,
  '--AppBarButtonBorderThickness': xamlThickness(props.BorderThickness),
  '--AppBarButtonCornerRadius': cssLength(props.CornerRadius),
  margin: xamlThickness(props.Margin),
  width: cssLength(props.Width),
  height: cssLength(props.Height),
  minWidth: cssLength(props.MinWidth),
  minHeight: cssLength(props.MinHeight),
  maxWidth: cssLength(props.MaxWidth),
  maxHeight: cssLength(props.MaxHeight),
  fontFamily: props.FontFamily,
  fontWeight: props.FontWeight,
  fontSize: cssLength(props.FontSize),
  justifySelf: props.HorizontalAlignment ? {
    Left: 'start', Center: 'center', Right: 'end', Stretch: 'stretch'
  }[props.HorizontalAlignment] : undefined,
  alignSelf: props.VerticalAlignment ? {
    Top: 'start', Center: 'center', Bottom: 'end', Stretch: 'stretch'
  }[props.VerticalAlignment] : undefined
}));

const buttonClasses = computed(() => ({
  'win-appbar-button': true,
  compact: effectiveIsCompact.value,
  collapsed: props.Visibility === 'Collapsed',
  'pointer-over': isPointerOver.value && effectiveIsEnabled.value,
  pressed: isPressed.value && effectiveIsEnabled.value,
  'label-right': props.LabelPosition === 'Right',
  'label-collapsed': isLabelCollapsed.value,
  'has-flyout': hasFlyout.value
}));

const symbolGlyphs: Record<string, string> = {
  Accept: '\uE8FB', Add: '\uE710', AttachCamera: '\uE8A2', Back: '\uE72B', Cancel: '\uE711', Close: '\uE711',
  Copy: '\uE8C8', Cut: '\uE8C6', Delete: '\uE74D', Dislike: '\uE8E0', Edit: '\uE70F', Favorite: '\uE734',
  Flag: '\uE7C1', FontDecrease: '\uE8A0', FontIncrease: '\uE8A1', Forward: '\uE72A', Like: '\uE8E1',
  Help: '\uE897', More: '\uE712', OpenFile: '\uE8E5', Paste: '\uE77F', Pause: '\uE769',
  Play: '\uE768', Redo: '\uE7A6', Refresh: '\uE72C', Save: '\uE74E', SelectAll: '\uE8B3',
  Send: '\uE724', Setting: '\uE713', Share: '\uE72D', Sort: '\uE8CB', Stop: '\uE71A', Orientation: '\uE8B4',
  Undo: '\uE7A7'
};

const getSymbolGlyph = (symbolName: string) => symbolGlyphs[symbolName] ?? '\uE8A5';

const updateAnchor = () => {
  const rect = buttonRef.value?.getBoundingClientRect();
  if (rect) anchorRect.value = rect;
};
const closeFlyout = () => { showFlyout.value = false; };
const onMenuSelect = (item: unknown) => emit('Select', item);
const onPointerDown = (event: PointerEvent) => {
  isPressed.value = true;
  isPointerOver.value = event.pointerType !== 'touch';
  if (!props.AllowFocusOnInteraction) event.preventDefault();
};
const onPointerEnter = (event: PointerEvent) => {
  isPointerOver.value = event.pointerType !== 'touch';
};
const onPointerLeave = () => {
  isPointerOver.value = false;
  isPressed.value = false;
};
const clearPressed = () => { isPressed.value = false; };
const clearPointerVisuals = () => {
  isPointerOver.value = false;
  isPressed.value = false;
};
const syncPointerState = (event: PointerEvent) => {
  if (event.pointerType === 'touch') {
    isPointerOver.value = false;
    return;
  }
  const hit = document.elementFromPoint(event.clientX, event.clientY);
  isPointerOver.value = Boolean(buttonRef.value && hit && buttonRef.value.contains(hit));
};

const handleClick = (event: MouseEvent) => {
  if (!effectiveIsEnabled.value) return;
  props.Command?.Execute?.(props.CommandParameter);
  if (externalFlyout.value) {
    externalFlyout.value.ShowAt?.(buttonRef.value);
  } else if (hasMenuFlyout.value) {
    updateAnchor();
    showFlyout.value = !showFlyout.value;
  }
  isPressed.value = false;
  emit('Click', event);
};

const onDocumentPointerDown = (event: PointerEvent) => {
  if (!showFlyout.value || buttonRef.value?.contains(event.target as Node)) return;
  if (event.target instanceof Element && event.target.closest('.win-menu-flyout-wrap')) return;
  closeFlyout();
};
const onWindowBlur = () => closeFlyout();
const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showFlyout.value) {
    event.preventDefault();
    closeFlyout();
    return;
  }
  const accelerator = props.KeyboardAccelerators?.[0];
  if (!accelerator || !effectiveIsEnabled.value) return;
  const modifiers = accelerator.Modifiers || [];
  const matches = event.key.toLowerCase() === accelerator.Key.toLowerCase()
    && event.ctrlKey === modifiers.includes('Control')
    && event.shiftKey === modifiers.includes('Shift')
    && event.altKey === modifiers.includes('Alt');
  if (!matches) return;
  event.preventDefault();
  buttonRef.value?.click();
};

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown, true);
  document.addEventListener('pointermove', syncPointerState, true);
  document.addEventListener('pointerup', clearPressed, true);
  document.addEventListener('pointercancel', clearPressed, true);
  window.addEventListener('blur', onWindowBlur);
  window.addEventListener('resize', updateAnchor);
  document.addEventListener('keydown', onKeyDown, true);
});
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown, true);
  document.removeEventListener('pointermove', syncPointerState, true);
  document.removeEventListener('pointerup', clearPressed, true);
  document.removeEventListener('pointercancel', clearPressed, true);
  window.removeEventListener('blur', onWindowBlur);
  window.removeEventListener('resize', updateAnchor);
  document.removeEventListener('keydown', onKeyDown, true);
});
</script>

<style scoped>
.win-appbar-button {
  position: relative;
  display: inline-grid;
  place-items: stretch;
  min-width: 68px;
  min-height: 64px;
  width: 68px;
  height: auto;
  padding: 0;
  border: 0;
  border-radius: var(--ControlCornerRadius, 4px);
  background: transparent;
  color: var(--AppBarButtonForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  font-family: 'Segoe UI Variable', 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  cursor: default;
  user-select: none;
  box-sizing: border-box;
  overflow: visible;
  justify-self: start;
  align-self: start;
  transition: background-color var(--faster-duration, 83ms) linear, color var(--faster-duration, 83ms) linear;
}

.appbar-button-inner-border {
  position: absolute;
  inset: 6px 2px;
  border: var(--AppBarButtonBorderThickness, 0) solid var(--AppBarButtonBorderBrush, transparent);
  border-radius: var(--AppBarButtonCornerRadius, var(--ControlCornerRadius, 4px));
  background: var(--AppBarButtonBackground, var(--SubtleFillColorTransparentBrush, transparent));
  transition: background-color var(--faster-duration, 83ms) linear;
}
.win-appbar-button.compact .appbar-button-inner-border { bottom: 22px; }
.win-appbar-button.compact {
  min-height: 64px;
  height: auto;
}
.win-appbar-button.pointer-over { color: var(--AppBarButtonForegroundPointerOver, var(--TextFillColorPrimaryBrush, var(--text-primary))); }
.win-appbar-button.pressed { color: var(--AppBarButtonForegroundPressed, var(--TextFillColorSecondaryBrush, var(--text-secondary))); }
.win-appbar-button.pointer-over .appbar-button-inner-border { background: var(--AppBarButtonBackgroundPointerOver, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary))); }
.win-appbar-button.pressed .appbar-button-inner-border { background: var(--AppBarButtonBackgroundPressed, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary))); }
.appbar-button-content-root { position: relative; z-index: 1; display: grid; min-width: 0; grid-template-columns: 1fr auto auto; grid-template-rows: auto auto; min-height: 64px; align-content: start; align-items: start; }
.win-appbar-button.compact .appbar-button-content-root {
  min-height: 64px;
  grid-template-rows: auto auto;
}
.win-appbar-button:disabled { color: var(--AppBarButtonForegroundDisabled, var(--text-disabled)); cursor: default; opacity: 1; }
.win-appbar-button:disabled .appbar-button-inner-border { background: var(--AppBarButtonBackgroundDisabled, var(--SubtleFillColorDisabledBrush, transparent)); }
.win-appbar-button.collapsed { display: none; }

.appbar-button-icon { grid-column: 1 / 3; grid-row: 1; justify-self: center; display: grid; place-items: center; width: 16px; height: 16px; margin: 16px 0 10px; font-size: 16px; line-height: 1; }
.win-appbar-button.compact .appbar-button-icon { margin: 16px 0 2px; }
.symbol-icon { font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif; font-size: 16px; font-weight: 400; }
.appbar-button-label { grid-column: 1 / 4; grid-row: 2; display: block; min-width: 0; width: 64px; max-width: 64px; margin: 0 2px 8px; overflow: visible; text-align: center; text-overflow: clip; white-space: normal; overflow-wrap: break-word; word-break: break-word; font-size: 12px; line-height: 16px; }

.win-appbar-button.label-right { width: auto; min-width: 68px; min-height: 48px; }
.win-appbar-button.label-right .appbar-button-content-root { grid-template-columns: auto auto auto; grid-template-rows: 48px; min-height: 48px; }
.win-appbar-button.label-right .appbar-button-icon { grid-column: 1; grid-row: 1; margin: 16px 0 0 12px; }
.win-appbar-button.label-right .appbar-button-label { grid-column: 2; grid-row: 1; width: auto; max-width: none; margin: 16px 12px 10px 8px; text-align: left; white-space: nowrap; }
.win-appbar-button.compact .appbar-button-label,
.win-appbar-button.label-collapsed .appbar-button-label { display: none; }
.win-appbar-button.label-collapsed { min-height: 48px; }
.win-appbar-button.label-collapsed .appbar-button-content-root { min-height: 48px; }
.appbar-button-chevron { position: absolute; top: 20px; right: 12px; color: var(--AppBarButtonSubItemChevronForeground, var(--TextFillColorSecondaryBrush, var(--text-secondary))); font-family: var(--SymbolThemeFontFamily, 'Segoe Fluent Icons', 'Segoe MDL2 Assets'); font-size: 8px; line-height: 1; }
.win-appbar-button.pointer-over .appbar-button-chevron { color: var(--AppBarButtonSubItemChevronForegroundPointerOver, var(--TextFillColorSecondaryBrush, var(--text-secondary))); }
.win-appbar-button.pressed .appbar-button-chevron { color: var(--AppBarButtonSubItemChevronForegroundPressed, var(--TextFillColorTertiaryBrush, var(--text-tertiary))); }
.win-appbar-button:disabled .appbar-button-chevron { color: var(--AppBarButtonSubItemChevronForegroundDisabled, var(--text-disabled)); }
.win-appbar-button.label-right .appbar-button-chevron { font-size: 8px; }
.win-appbar-button:focus-visible { outline: 2px solid var(--FocusStrokeColorOuterBrush, var(--text-primary)); outline-offset: -3px; }

</style>
