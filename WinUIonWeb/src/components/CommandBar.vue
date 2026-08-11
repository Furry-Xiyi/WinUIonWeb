<template>
  <div
    ref="commandBarRoot"
    :class="commandBarClasses"
    role="toolbar"
    :aria-label="resolvedAriaLabel"
    :aria-expanded="effectiveIsOpen"
    :style="commandBarStyle"
    @keydown="handleKeyDown">
    <div class="commandbar-surface">
      <div ref="primaryContent" class="commandbar-primary-content">
        <component
          v-for="(command, index) in visiblePrimaryCommands"
          :key="getCommandKey(command, index)"
          :is="getCommandComponent(command)"
          v-bind="getCommandProps(command)"
          :LabelPosition="effectiveLabelPosition"
          @Click="(event: MouseEvent) => handleCommandInvoked(command, event)" />
      </div>

      <button
        v-if="showOverflowButton"
        ref="overflowButton"
        class="commandbar-overflow-button"
        :class="{ 'is-active': effectiveIsOpen }"
        type="button"
        :aria-label="effectiveIsOpen ? t('text.less-app-bar') : t('text.more-options')"
        :aria-expanded="effectiveIsOpen"
        v-bind="{ 'tooltipservice.tooltip': effectiveIsOpen ? t('text.see-less') : t('text.see-more') }"
        @click.stop="toggleOverflow">
        <span class="commandbar-ellipsis" aria-hidden="true">&#xE712;</span>
      </button>
    </div>

    <WinMenuFlyout
      v-if="overflowAnchorRect && overflowMenuItems.length"
      :Open="overflowIsOpen"
      :AnchorRect="overflowAnchorRect"
      :Items="overflowMenuItems"
      Placement="BottomEdgeAlignedRight"
      :MinWidth="160"
      :Gap="0"
      OverlayInputPassThroughElement
      CloseAnimation="CommandBar"
      :Theme="Theme"
      @Close="handleFlyoutClose"
      @Select="handleOverflowSelect" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from './i18n/index';
import WinAppBarSeparator from './WinAppBarSeparator.vue';
import WinMenuFlyout from './WinMenuFlyout.vue';

const { t } = useI18n();

export interface CommandBarCommand {
  Component?: unknown;
  Props?: Record<string, unknown>;
  Key?: string;
  Click?: (event?: MouseEvent) => void;
}

interface CommandBarUICommand {
  Label?: string;
  IconSource?: string | { Symbol?: string };
  KeyboardAccelerators?: unknown[];
  CanExecute?: (parameter?: unknown) => boolean;
  Execute?: (parameter?: unknown) => void;
}

export interface CommandBarProps {
  IsOpen?: boolean;
  IsSticky?: boolean;
  DefaultLabelPosition?: 'Bottom' | 'Right' | 'Collapsed';
  PrimaryCommands?: CommandBarCommand[];
  SecondaryCommands?: CommandBarCommand[];
  IsDynamicOverflowEnabled?: boolean;
  OverflowButtonVisibility?: 'Auto' | 'Visible' | 'Collapsed';
  Background?: string;
  Foreground?: string;
  CornerRadius?: string | number;
  HorizontalAlignment?: 'Left' | 'Center' | 'Right' | 'Stretch';
  'AutomationProperties.Name'?: string;
  Theme?: string;
}

const props = defineProps<CommandBarProps>();
const emit = defineEmits<{
  Opening: [];
  Opened: [];
  Closing: [];
  Closed: [];
  DynamicOverflowItemsChanging: [];
  'update:IsOpen': [value: boolean];
}>();

const commandBarRoot = ref<HTMLElement>();
const primaryContent = ref<HTMLElement>();
const overflowButton = ref<HTMLButtonElement>();
const overflowAnchorRect = ref<DOMRect | null>(null);
const localIsOpen = ref(props.IsOpen ?? false);
const overflowIsOpen = ref(false);
const visiblePrimaryCommands = ref<CommandBarCommand[]>([]);
const overflowPrimaryCommands = ref<CommandBarCommand[]>([]);
let resizeObserver: ResizeObserver | undefined;
let overflowCalculation = 0;

const effectivePrimaryCommands = computed(() => props.PrimaryCommands ?? []);
const effectiveSecondaryCommands = computed(() => props.SecondaryCommands ?? []);
const effectiveIsSticky = computed(() => props.IsSticky ?? false);
const effectiveDefaultLabelPosition = computed(() => props.DefaultLabelPosition ?? 'Bottom');
const effectiveDynamicOverflow = computed(() => props.IsDynamicOverflowEnabled ?? true);
const effectiveOverflowVisibility = computed(() => props.OverflowButtonVisibility ?? 'Auto');
const resolvedAriaLabel = computed(() => props['AutomationProperties.Name'] || t('text.command-bar'));
const effectiveIsOpen = computed(() => localIsOpen.value);
const cssLength = (value: string | number | undefined) => {
  if (value === undefined || value === '') return undefined;
  return typeof value === 'number' || !Number.isNaN(Number(value)) ? `${Number(value)}px` : value;
};
const horizontalAlignment = computed(() => props.HorizontalAlignment ?? 'Stretch');
const isHorizontallyStretched = computed(() => horizontalAlignment.value === 'Stretch');
const commandBarStyle = computed(() => ({
  '--CommandBarBackground': props.Background || undefined,
  '--CommandBarForeground': props.Foreground || undefined,
  '--CommandBarCornerRadius': cssLength(props.CornerRadius),
  width: isHorizontallyStretched.value ? undefined : 'max-content',
  maxWidth: isHorizontallyStretched.value ? undefined : '100%',
  alignSelf: {
    Left: 'flex-start',
    Center: 'center',
    Right: 'flex-end',
    Stretch: 'stretch'
  }[horizontalAlignment.value],
  justifySelf: {
    Left: 'start',
    Center: 'center',
    Right: 'end',
    Stretch: 'stretch'
  }[horizontalAlignment.value]
}));

const effectiveLabelPosition = computed(() => ({
  Bottom: 'Default',
  Right: 'Right',
  Collapsed: 'Collapsed'
}[effectiveDefaultLabelPosition.value]));

const hasSecondaryCommands = computed(() => effectiveSecondaryCommands.value.length > 0);
const showOverflowButton = computed(() => {
  if (effectiveOverflowVisibility.value === 'Collapsed') return false;
  if (effectiveOverflowVisibility.value === 'Visible') return true;
  return effectivePrimaryCommands.value.length > 0
    || hasSecondaryCommands.value
    || overflowPrimaryCommands.value.length > 0;
});

const commandBarClasses = computed(() => ({
  'win-commandbar': true,
  open: effectiveIsOpen.value,
  'has-overflow': showOverflowButton.value,
  'label-bottom': effectiveDefaultLabelPosition.value === 'Bottom',
  'label-right': effectiveDefaultLabelPosition.value === 'Right',
  'label-collapsed': effectiveDefaultLabelPosition.value === 'Collapsed'
}));

const getCommandComponent = (command: CommandBarCommand) => command.Component;
const getCommandProps = (command: CommandBarCommand) => command.Props ?? {};
const getCommandKey = (command: CommandBarCommand, index: number, prefix = 'primary') => (
  command.Key ?? `${prefix}-${index}`
);

const fluentSymbolGlyphs: Record<string, string> = {
  Accept: '\uE8FB', Add: '\uE710', Back: '\uE72B', Cancel: '\uE711', Close: '\uE711',
  Copy: '\uE8C8', Cut: '\uE8C6', Delete: '\uE74D', Edit: '\uE70F', Favorite: '\uE734',
  Flag: '\uE7C1', FontDecrease: '\uE8A0', FontIncrease: '\uE8A1', Forward: '\uE72A',
  Help: '\uE897', More: '\uE712', OpenFile: '\uE8E5', Paste: '\uE77F', Pause: '\uE769',
  Play: '\uE768', Redo: '\uE7A6', Refresh: '\uE72C', Save: '\uE74E', SelectAll: '\uE8B3',
  Send: '\uE724', Setting: '\uE713', Share: '\uE72D', Sort: '\uE8CB', Stop: '\uE71A',
  Undo: '\uE7A7'
};

const isSeparatorCommand = (command: CommandBarCommand) => command.Component === WinAppBarSeparator;
const getUICommand = (command: CommandBarCommand) => command.Props?.Command as CommandBarUICommand | undefined;
const getCommandLabel = (command: CommandBarCommand) => {
  const label = command.Props?.Label;
  if (typeof label === 'string') return label;
  return getUICommand(command)?.Label ?? '';
};
const getCommandIcon = (command: CommandBarCommand) => {
  const icon = command.Props?.Icon ?? getUICommand(command)?.IconSource;
  const symbol = typeof icon === 'string'
    ? icon
    : icon && typeof icon === 'object' && 'Symbol' in icon && typeof icon.Symbol === 'string'
      ? icon.Symbol
      : '';
  if (!symbol) return '';
  return fluentSymbolGlyphs[symbol] ?? symbol;
};
const toMenuFlyoutItem = (command: CommandBarCommand) => {
  if (isSeparatorCommand(command)) return { Kind: 'MenuFlyoutSeparator' };
  const uiCommand = getUICommand(command);
  const commandParameter = command.Props?.CommandParameter;
  const isEnabled = command.Props?.IsEnabled;
  return {
    Kind: 'MenuFlyoutItem',
    Text: getCommandLabel(command),
    Icon: getCommandIcon(command),
    IsEnabled: isEnabled === undefined ? uiCommand?.CanExecute?.(commandParameter) ?? true : isEnabled !== false,
    KeyboardAccelerators: command.Props?.KeyboardAccelerators ?? uiCommand?.KeyboardAccelerators,
    KeyboardAcceleratorTextOverride: command.Props?.KeyboardAcceleratorTextOverride,
    Command: {
      Execute: () => {
        uiCommand?.Execute?.(commandParameter);
        command.Click?.();
      }
    }
  };
};

const overflowMenuItems = computed(() => {
  const primaryItems = overflowPrimaryCommands.value.map(toMenuFlyoutItem);
  const secondaryItems = effectiveSecondaryCommands.value.map(toMenuFlyoutItem);
  if (primaryItems.length && secondaryItems.length) {
    return [...primaryItems, { Kind: 'MenuFlyoutSeparator' }, ...secondaryItems];
  }
  return [...primaryItems, ...secondaryItems];
});

const updateOpenState = (value: boolean) => {
  localIsOpen.value = value;
  emit('update:IsOpen', value);
};

const updateOverflowAnchor = () => {
  overflowAnchorRect.value = overflowButton.value?.getBoundingClientRect() ?? null;
};

const openOverflow = async () => {
  if (!showOverflowButton.value || !overflowMenuItems.value.length) return;
  await nextTick();
  updateOverflowAnchor();
  if (!overflowAnchorRect.value) return;
  overflowIsOpen.value = true;
};

const open = async () => {
  if (!effectiveIsOpen.value) {
    updateOverflowAnchor();
    emit('Opening');
    updateOpenState(true);
    await nextTick();
    updateOverflowAnchor();
    emit('Opened');
  }
  await openOverflow();
};

const close = async (force = true) => {
  if (!effectiveIsOpen.value) return;
  if (!force && effectiveIsSticky.value) return;
  emit('Closing');
  overflowIsOpen.value = false;
  updateOpenState(false);
  await nextTick();
  emit('Closed');
};

const toggle = () => {
  if (effectiveIsOpen.value) void close(true);
  else void open();
};

const toggleOverflow = async () => {
  if (effectiveIsOpen.value) {
    if (overflowIsOpen.value) closeOverflow();
    else await close(true);
    return;
  }
  await open();
};

// Overflow is the transient expanded state of CommandBar. Once its flyout
// closes, the bar must leave the active/open visual state as well.
const closeOverflow = () => {
  overflowIsOpen.value = false;
  if (effectiveIsOpen.value) void close(true);
};

const handleCommandInvoked = (command: CommandBarCommand, event: MouseEvent) => {
  command.Click?.(event);
  if (effectiveIsOpen.value && !effectiveIsSticky.value) void close(false);
};

const handleFlyoutClose = () => {
  closeOverflow();
};

const handleOverflowSelect = () => {
  closeOverflow();
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return;
  if (overflowIsOpen.value) {
    event.preventDefault();
    closeOverflow();
    return;
  }
  if (effectiveIsOpen.value) {
    event.preventDefault();
    void close(true);
  }
};

// A CommandBar with no secondary items has no MenuFlyout overlay to receive
// outside clicks. Keep its expanded state dismissible in the same way as the
// overflow presenter, while preserving interactions inside the bar itself.
const closeOnDocumentPointerDown = (event: PointerEvent) => {
  if (!effectiveIsOpen.value || overflowMenuItems.value.length || effectiveIsSticky.value) return;
  const path = event.composedPath?.() || [];
  if (path.some((element) => element instanceof Element && element.classList.contains('win-commandbar'))) return;
  void close(true);
};

const calculateOverflow = async () => {
  const calculationId = ++overflowCalculation;
  visiblePrimaryCommands.value = [...effectivePrimaryCommands.value];
  overflowPrimaryCommands.value = [];
  await nextTick();
  if (calculationId !== overflowCalculation || !effectiveDynamicOverflow.value || !commandBarRoot.value || !primaryContent.value) return;

  const children = Array.from(primaryContent.value.children) as HTMLElement[];
  if (!children.length) return;
  const rootWidth = commandBarRoot.value.clientWidth;
  const contentWidth = children.reduce((width, child) => width + child.getBoundingClientRect().width, 0);
  const needsPermanentOverflow = hasSecondaryCommands.value || effectiveOverflowVisibility.value === 'Visible';
  const availableWithoutButton = Math.max(0, rootWidth - 4);
  if (!needsPermanentOverflow && contentWidth <= availableWithoutButton) return;

  const available = Math.max(0, rootWidth - 52);
  let occupied = 0;
  let visibleCount = 0;
  for (const child of children) {
    const width = child.getBoundingClientRect().width;
    if (occupied + width > available) break;
    occupied += width;
    visibleCount += 1;
  }

  if (visibleCount < effectivePrimaryCommands.value.length) {
    emit('DynamicOverflowItemsChanging');
    visiblePrimaryCommands.value = effectivePrimaryCommands.value.slice(0, visibleCount);
    overflowPrimaryCommands.value = effectivePrimaryCommands.value.slice(visibleCount);
  }
};

watch(() => props.IsOpen, (value) => {
  if (value === undefined || value === effectiveIsOpen.value) return;
  if (value) void open();
  else void close(true);
});

watch(effectivePrimaryCommands, () => void calculateOverflow(), { deep: true, immediate: true });
watch(effectiveSecondaryCommands, () => void calculateOverflow(), { deep: true });
watch(
  [effectiveDynamicOverflow, effectiveOverflowVisibility, effectiveDefaultLabelPosition],
  () => void calculateOverflow()
);

onMounted(async () => {
  if (typeof ResizeObserver !== 'undefined' && commandBarRoot.value) {
    resizeObserver = new ResizeObserver(() => {
      void calculateOverflow();
      if (effectiveIsOpen.value || overflowIsOpen.value) updateOverflowAnchor();
    });
    resizeObserver.observe(commandBarRoot.value);
  }
  window.addEventListener('resize', updateOverflowAnchor);
  document.addEventListener('pointerdown', closeOnDocumentPointerDown, true);
  updateOverflowAnchor();
  await calculateOverflow();
  if (effectiveIsOpen.value) await openOverflow();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener('resize', updateOverflowAnchor);
  document.removeEventListener('pointerdown', closeOnDocumentPointerDown, true);
});

defineExpose({ Open: open, Close: close, Toggle: toggle, IsOpen: effectiveIsOpen });
</script>

<style scoped>
.win-commandbar {
  --CommandBarHeightTransitionDuration: 167ms;
  position: relative;
  z-index: 20;
  width: 100%;
  min-width: 0;
  height: 48px;
  min-height: 48px;
  color: var(--CommandBarForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  font-family: 'Segoe UI Variable', 'Segoe UI', sans-serif;
  transition: height var(--CommandBarHeightTransitionDuration) var(--fast-out-slow-in, cubic-bezier(0, 0, 0, 1)),
    min-height var(--CommandBarHeightTransitionDuration) var(--fast-out-slow-in, cubic-bezier(0, 0, 0, 1));
}

.win-commandbar.open {
  --CommandBarHeightTransitionDuration: 250ms;
}

.commandbar-surface {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  height: 48px;
  min-height: 48px;
  padding-left: 4px;
  overflow: hidden;
  border: 0;
  border-radius: var(--CommandBarCornerRadius, var(--ControlCornerRadius, 4px));
  background: var(--CommandBarBackground, transparent);
  box-shadow: inset 0 0 0 1px transparent;
  box-sizing: border-box;
  transition: height var(--CommandBarHeightTransitionDuration) var(--fast-out-slow-in, cubic-bezier(0, 0, 0, 1)),
    min-height var(--CommandBarHeightTransitionDuration) var(--fast-out-slow-in, cubic-bezier(0, 0, 0, 1));
}

.win-commandbar.open .commandbar-surface {
  box-shadow: inset 0 0 0 1px var(--CommandBarBorderBrushOpen, var(--card-stroke));
  background: var(--CommandBarBackgroundOpen, var(--AcrylicInAppFillColorDefaultBrush, var(--flyout-bg)));
  -webkit-backdrop-filter: var(--flyout-backdrop, blur(30px) saturate(160%));
  backdrop-filter: var(--flyout-backdrop, blur(30px) saturate(160%));
}

.commandbar-primary-content {
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  height: 48px;
  min-width: 0;
  min-height: 48px;
  overflow: hidden;
  transition: height var(--CommandBarHeightTransitionDuration) var(--fast-out-slow-in, cubic-bezier(0, 0, 0, 1)),
    min-height var(--CommandBarHeightTransitionDuration) var(--fast-out-slow-in, cubic-bezier(0, 0, 0, 1));
}

.commandbar-primary-content :deep(.win-appbar-button),
.commandbar-primary-content :deep(.win-appbar-toggle-button) {
  flex: 0 0 auto;
  min-height: 48px;
  height: 48px;
  padding-top: 0;
  padding-bottom: 0;
  transition: min-height var(--CommandBarHeightTransitionDuration) var(--fast-out-slow-in, cubic-bezier(0, 0, 0, 1)),
    height var(--CommandBarHeightTransitionDuration) var(--fast-out-slow-in, cubic-bezier(0, 0, 0, 1));
}

.win-commandbar.label-collapsed .commandbar-primary-content :deep(.appbar-button-label),
.win-commandbar.label-bottom:not(.open) .commandbar-primary-content :deep(.appbar-button-label) {
  display: none;
}

.win-commandbar.label-bottom.open,
.win-commandbar.label-bottom.open .commandbar-surface,
.win-commandbar.label-bottom.open .commandbar-primary-content {
  height: 64px;
  min-height: 64px;
}

.win-commandbar.label-bottom.open .commandbar-primary-content :deep(.win-appbar-button),
.win-commandbar.label-bottom.open .commandbar-primary-content :deep(.win-appbar-toggle-button) {
  min-height: 64px;
  height: 64px;
}

.commandbar-overflow-button {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 48px;
  min-width: 48px;
  height: 48px;
  min-height: 48px;
  align-self: stretch;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: var(--ControlCornerRadius, 4px);
  background: transparent;
  color: inherit;
  cursor: default;
  box-sizing: border-box;
  transition: height var(--CommandBarHeightTransitionDuration) var(--fast-out-slow-in, cubic-bezier(0, 0, 0, 1)),
    min-height var(--CommandBarHeightTransitionDuration) var(--fast-out-slow-in, cubic-bezier(0, 0, 0, 1)),
    background-color var(--faster-duration, 83ms) linear,
    color var(--faster-duration, 83ms) linear;
}

.commandbar-overflow-button::before {
  content: '';
  position: absolute;
  inset: 6px 6px 6px 2px;
  border-radius: var(--ControlCornerRadius, 4px);
  background: var(--SubtleFillColorTransparentBrush, transparent);
  transition: background-color var(--faster-duration, 83ms) linear;
}

.win-commandbar.label-bottom.open .commandbar-overflow-button {
  height: 64px;
  min-height: 64px;
}

.commandbar-overflow-button:hover {
  background: transparent;
}

.commandbar-overflow-button:hover::before {
  background: var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary));
}

.win-commandbar.open .commandbar-overflow-button:hover::before {
  background: var(--SubtleFillColorTransparentBrush, transparent);
}

.commandbar-overflow-button:active {
  background: transparent;
  color: var(--TextFillColorSecondaryBrush, var(--text-secondary));
}

.commandbar-overflow-button:active::before {
  background: var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary));
}

.commandbar-overflow-button:focus-visible {
  outline: 2px solid var(--FocusStrokeColorOuterBrush, var(--text-primary));
  outline-offset: -3px;
}

.commandbar-ellipsis {
  position: absolute;
  top: 50%;
  left: calc(50% - 2px);
  z-index: 1;
  display: block;
  width: 20px;
  height: 20px;
  overflow: visible;
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif;
  font-size: 20px;
  line-height: 20px;
  text-align: center;
  transform: translate(-50%, -50%);
}

@media (prefers-reduced-motion: reduce) {
  .commandbar-surface,
  .commandbar-primary-content,
  .commandbar-overflow-button,
  .win-commandbar,
  .commandbar-primary-content :deep(.win-appbar-button),
  .commandbar-primary-content :deep(.win-appbar-toggle-button) {
    transition-duration: 0.01ms;
  }
}
</style>
