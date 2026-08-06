<template>
  <Teleport to="body">
    <Transition name="cbf-flyout">
      <div
        v-if="isOpen"
        ref="flyoutRef"
        class="win-commandbar-flyout"
        :class="[themeClass, `placement-${actualPlacement.toLowerCase()}`, panelStateClasses]"
        :style="flyoutStyle"
        role="menu"
        @keydown="onKeydown"
        @pointerdown.stop>
        <div class="win-cbf-layout-root">
          <div class="win-cbf-outer-content-root">
            <div class="win-cbf-content-root">
              <div class="win-cbf-primary-items-root">
                <div v-if="primaryCommands.length" class="win-cbf-primary-items-control" role="toolbar">
                  <button
                    v-for="command in primaryCommands"
                    :key="commandKey(command)"
                    class="win-cbf-appbar-button"
                    :class="{ 'is-toggle': command.IsToggle, 'is-checked': command.IsChecked }"
                    type="button"
                    role="menuitem"
                    :aria-label="command.Label"
                    :aria-pressed="command.IsToggle ? Boolean(command.IsChecked) : undefined"
                    v-bind="commandToolTipAttrs(command)"
                    :disabled="command.IsEnabled === false"
                    @click="invoke(command, $event)">
                    <span class="win-cbf-appbar-content-root" aria-hidden="true">
                      <span class="win-cbf-icon-and-label-panel">
                        <span v-if="command.Icon" class="win-cbf-content-viewbox">
                          <span class="win-cbf-icon">{{ iconGlyph(command.Icon) }}</span>
                        </span>
                        <span v-if="showPrimaryLabels" class="win-cbf-text-label">{{ command.Label }}</span>
                      </span>
                    </span>
                  </button>
                </div>

                <button
                  v-if="secondaryCommands.length && !AlwaysExpanded"
                  class="win-cbf-more-button"
                  type="button"
                  :aria-label="t('text.more')"
                  v-bind="{ 'tooltipservice.tooltip': t('text.more') }"
                  :aria-expanded="secondaryOpen"
                  @click="toggleSecondary">
                  <span class="win-cbf-ellipsis-icon" aria-hidden="true">&#xE712;</span>
                </button>
              </div>

              <div v-if="secondaryPanelVisible" class="win-cbf-outer-overflow-content-root">
                <div class="win-cbf-overflow-content-root">
                  <div class="win-cbf-secondary-items-control" role="menu">
                    <button
                      v-for="command in secondaryCommands"
                      :key="commandKey(command)"
                      class="win-cbf-overflow-button"
                      :class="secondaryCommandClasses(command)"
                      type="button"
                      role="menuitem"
                      :aria-label="command.Label"
                      :aria-haspopup="command.Flyout ? 'menu' : undefined"
                      :aria-pressed="command.IsToggle ? Boolean(command.IsChecked) : undefined"
                      v-bind="commandToolTipAttrs(command)"
                      :disabled="command.IsEnabled === false"
                      @click="invoke(command, $event)">
                      <span v-if="command.IsToggle" class="win-cbf-overflow-check" aria-hidden="true">&#xE73E;</span>
                      <span v-if="command.Icon" class="win-cbf-overflow-icon" aria-hidden="true">{{ iconGlyph(command.Icon) }}</span>
                      <span class="win-cbf-overflow-label">{{ command.Label }}</span>
                      <span v-if="command.KeyboardAcceleratorTextOverride" class="win-cbf-overflow-accelerator">
                        {{ command.KeyboardAcceleratorTextOverride }}
                      </span>
                      <span v-if="command.Flyout" class="win-cbf-overflow-chevron" aria-hidden="true">&#xE76C;</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { CSSProperties } from 'vue';
import { useI18n } from './i18n/index';

const { t } = useI18n();

type Placement =
  | 'Auto'
  | 'Top'
  | 'Bottom'
  | 'Left'
  | 'Right'
  | 'TopEdgeAlignedLeft'
  | 'TopEdgeAlignedRight'
  | 'BottomEdgeAlignedLeft'
  | 'BottomEdgeAlignedRight'
  | 'LeftEdgeAlignedTop'
  | 'LeftEdgeAlignedBottom'
  | 'RightEdgeAlignedTop'
  | 'RightEdgeAlignedBottom';

type ShowMode = 'Standard' | 'Transient';
type AnchorRect = DOMRect | { top: number; bottom: number; left: number; right: number; width: number; height: number; x?: number; y?: number };
type CommandBarFlyoutCommand = {
  Name?: string;
  Label: string;
  Icon?: string;
  Click?: (command: CommandBarFlyoutCommand, event: MouseEvent) => void;
  'ToolTipService.ToolTip'?: string;
  KeyboardAcceleratorTextOverride?: string;
  Flyout?: unknown;
  IsEnabled?: boolean;
  IsToggle?: boolean;
  IsChecked?: boolean;
};

const props = withDefaults(defineProps<{
  Open?: boolean;
  AnchorRect?: AnchorRect | null;
  PrimaryCommands?: CommandBarFlyoutCommand[];
  SecondaryCommands?: CommandBarFlyoutCommand[];
  AlwaysExpanded?: boolean;
  Placement?: Placement;
  ShowMode?: ShowMode;
  MinWidth?: number;
  ShowPrimaryLabels?: boolean;
  Theme?: string;
}>(), {
  Open: false,
  AnchorRect: null,
  PrimaryCommands: () => [],
  SecondaryCommands: () => [],
  AlwaysExpanded: false,
  Placement: 'Auto',
  ShowMode: 'Standard',
  MinWidth: 0,
  ShowPrimaryLabels: false,
  Theme: ''
});

const emit = defineEmits<{
  Close: [];
  Click: [command: CommandBarFlyoutCommand, event: MouseEvent];
  Opening: [];
  Opened: [];
  Closing: [];
  Closed: [];
}>();

const flyoutRef = ref<HTMLElement | null>(null);
const isOpen = ref(props.Open);
const secondaryOpen = ref(props.AlwaysExpanded);
const secondaryRendered = ref(props.AlwaysExpanded);
const panelAnimation = ref<'expanding-setup' | 'expanding' | 'collapsing' | ''>('');
const collapsedClip = ref({ right: '0px', bottom: '0px' });
const anchorRect = ref<AnchorRect | null>(props.AnchorRect);
const actualPlacement = ref<Placement>(props.Placement);
const position = ref({ top: 0, left: 0 });
const primaryCommands = computed(() => props.PrimaryCommands ?? []);
const secondaryCommands = computed(() => props.SecondaryCommands ?? []);
const AlwaysExpanded = computed(() => props.AlwaysExpanded);
const showPrimaryLabels = computed(() => props.ShowPrimaryLabels);
const themeClass = computed(() => props.Theme === 'light' || props.Theme === 'dark' ? `win-theme-scope theme-${props.Theme}` : '');
let secondaryAnimationTimer = 0;

const secondaryPanelVisible = computed(() => secondaryCommands.value.length > 0 && secondaryRendered.value);
const panelStateClasses = computed(() => ({
  'is-expanded': secondaryRendered.value,
  'has-primary-labels': showPrimaryLabels.value,
  'is-panel-expanding-setup': panelAnimation.value === 'expanding-setup',
  'is-panel-expanding': panelAnimation.value === 'expanding',
  'is-panel-collapsing': panelAnimation.value === 'collapsing'
}));

const flyoutStyle = computed<CSSProperties>(() => ({
  top: `${position.value.top}px`,
  left: `${position.value.left}px`,
  minWidth: props.MinWidth ? `${props.MinWidth}px` : undefined,
  '--cbf-collapsed-right': collapsedClip.value.right,
  '--cbf-collapsed-bottom': collapsedClip.value.bottom
} as CSSProperties & Record<string, string | undefined>));

const commandKey = (command: CommandBarFlyoutCommand) => command.Name || command.Label;
const commandToolTipAttrs = (command: CommandBarFlyoutCommand) => (
  command['ToolTipService.ToolTip'] ? { 'tooltipservice.tooltip': command['ToolTipService.ToolTip'] } : {}
);

const secondaryCommandClasses = (command: CommandBarFlyoutCommand) => ({
  'is-toggle': command.IsToggle,
  'is-checked': command.IsChecked,
  'has-check': command.IsToggle,
  'has-menu-icon': Boolean(command.Icon),
  'has-keyboard-accelerator': Boolean(command.KeyboardAcceleratorTextOverride),
  'has-flyout': Boolean(command.Flyout)
});

const iconMap: Record<string, string> = {
  Share: '\uE72D',
  Save: '\uE74E',
  Delete: '\uE74D',
  Cut: '\uE8C6',
  Copy: '\uE8C8',
  Paste: '\uE77F',
  Undo: '\uE7A7',
  Redo: '\uE7A6',
  SelectAll: '\uE8B3',
  Bold: '\uE8DD',
  Italic: '\uE8DB',
  Underline: '\uE8DC'
};

const iconGlyph = (icon: string) => iconMap[icon] ?? icon;

const collapsedSize = () => {
  const flyout = flyoutRef.value;
  if (!flyout) return { width: 0, height: 0 };
  const primaryRoot = flyout.querySelector<HTMLElement>('.win-cbf-primary-items-root');
  return {
    width: Math.max(1, primaryRoot?.offsetWidth ?? 0),
    height: Math.max(1, primaryRoot?.offsetHeight ?? 0)
  };
};

const setCollapsedClipFromSize = (expandedRect: DOMRect, size = collapsedSize()) => {
  collapsedClip.value = {
    right: `${Math.max(0, expandedRect.width - size.width)}px`,
    bottom: `${Math.max(0, expandedRect.height - size.height)}px`
  };
};

const clearSecondaryAnimationTimer = () => {
  if (!secondaryAnimationTimer) return;
  window.clearTimeout(secondaryAnimationTimer);
  secondaryAnimationTimer = 0;
};

const finishSecondaryAnimation = () => {
  if (panelAnimation.value === 'collapsing') {
    secondaryRendered.value = false;
  }
  panelAnimation.value = '';
  secondaryAnimationTimer = 0;
  void nextTick(updatePosition);
};

const scheduleSecondaryAnimationEnd = (duration = 200) => {
  clearSecondaryAnimationTimer();
  secondaryAnimationTimer = window.setTimeout(finishSecondaryAnimation, duration);
};

const nextAnimationFrame = () => new Promise<void>(resolve => window.requestAnimationFrame(() => resolve()));

const choosePlacement = (rect: AnchorRect, requested: Placement) => {
  if (requested !== 'Auto') return requested;
  const below = window.innerHeight - rect.bottom;
  const above = rect.top;
  const right = window.innerWidth - rect.right;
  const left = rect.left;
  if (below >= 120) return 'Bottom';
  if (above >= 120) return 'Top';
  if (right >= 180) return 'Right';
  if (left >= 180) return 'Left';
  return 'Bottom';
};

const updatePosition = async () => {
  const rect = anchorRect.value;
  if (!rect) return;
  actualPlacement.value = choosePlacement(rect, props.Placement);

  let top = rect.bottom;
  let left = rect.left;

  if (actualPlacement.value.includes('Top')) top = rect.top;
  if (actualPlacement.value.includes('Bottom')) top = rect.bottom;
  if (actualPlacement.value.includes('Left')) {
    top = rect.top;
    left = rect.left;
  }
  if (actualPlacement.value.includes('Right')) {
    top = rect.top;
    left = rect.right;
  }
  if (actualPlacement.value.includes('AlignedBottom')) top = rect.bottom;
  if (actualPlacement.value.includes('AlignedRight')) left = rect.right;

  position.value = { top, left };
  await nextTick();

  const flyout = flyoutRef.value;
  if (!flyout) return;
  const flyoutRect = flyout.getBoundingClientRect();
  let nextTop = position.value.top;
  let nextLeft = position.value.left;

  if (actualPlacement.value.includes('Top')) nextTop -= flyoutRect.height;
  if (actualPlacement.value.includes('Left')) nextLeft -= flyoutRect.width;
  if (actualPlacement.value.includes('AlignedRight')) nextLeft -= flyoutRect.width;

  nextLeft = Math.max(8, Math.min(window.innerWidth - flyoutRect.width - 8, nextLeft));
  nextTop = Math.max(8, Math.min(window.innerHeight - flyoutRect.height - 8, nextTop));
  position.value = { top: nextTop, left: nextLeft };
};

const openAt = async (rect: AnchorRect, options: { Placement?: Placement; ShowMode?: ShowMode } = {}) => {
  anchorRect.value = rect;
  actualPlacement.value = options.Placement ?? props.Placement;
  secondaryOpen.value = props.AlwaysExpanded;
  secondaryRendered.value = props.AlwaysExpanded;
  panelAnimation.value = '';
  emit('Opening');
  isOpen.value = true;
  await nextTick();
  await updatePosition();
  emit('Opened');
};

const showAt = async (target: HTMLElement, options: { Placement?: Placement; ShowMode?: ShowMode } = {}) => {
  await openAt(target.getBoundingClientRect(), {
    Placement: options.Placement,
    ShowMode: options.ShowMode
  });
};

const hide = () => {
  if (!isOpen.value) return;
  emit('Closing');
  clearSecondaryAnimationTimer();
  isOpen.value = false;
  secondaryOpen.value = props.AlwaysExpanded;
  secondaryRendered.value = props.AlwaysExpanded;
  panelAnimation.value = '';
  emit('Close');
  emit('Closed');
};

const toggleSecondary = async () => {
  if (!secondaryCommands.value.length || props.AlwaysExpanded) return;

  if (secondaryOpen.value) {
    const flyout = flyoutRef.value;
    if (flyout) setCollapsedClipFromSize(flyout.getBoundingClientRect());
    secondaryOpen.value = false;
    panelAnimation.value = 'collapsing';
    scheduleSecondaryAnimationEnd(167);
    return;
  }

  const startSize = collapsedSize();
  secondaryRendered.value = true;
  secondaryOpen.value = true;
  await nextTick();
  await updatePosition();
  if (flyoutRef.value) setCollapsedClipFromSize(flyoutRef.value.getBoundingClientRect(), startSize);
  panelAnimation.value = 'expanding-setup';
  await nextAnimationFrame();
  panelAnimation.value = 'expanding';
  scheduleSecondaryAnimationEnd(200);
};

const invoke = (command: CommandBarFlyoutCommand, event: MouseEvent) => {
  if (command.IsEnabled === false) return;
  command.Click?.(command, event);
  emit('Click', command, event);
  hide();
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    hide();
  }
};

const onPointerDown = (event: PointerEvent) => {
  if (!isOpen.value) return;
  if (flyoutRef.value?.contains(event.target as Node)) return;
  hide();
};

watch(() => props.Open, (value) => {
  if (value && props.AnchorRect) void openAt(props.AnchorRect);
  else if (!value) hide();
});

watch(() => props.AnchorRect, (value) => {
  anchorRect.value = value;
  if (isOpen.value) void updatePosition();
});

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition, true);
});

onBeforeUnmount(() => {
  clearSecondaryAnimationTimer();
  document.removeEventListener('pointerdown', onPointerDown);
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('scroll', updatePosition, true);
});

defineExpose({ showAt, hide, openAt, isOpen });
</script>

<style scoped>
.win-commandbar-flyout {
  position: fixed;
  z-index: 9100;
  max-width: 440px;
  color: var(--CommandBarFlyoutForeground, var(--text-primary));
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  font-size: var(--ControlContentThemeFontSize, 14px);
  font-weight: 400;
  --win-acrylic-fill: var(--CommandBarFlyoutBackground, var(--flyout-background, var(--layer-fill-color-default)));
  isolation: isolate;
  background: transparent;
  border-radius: var(--OverlayCornerRadius, var(--overlay-corner-radius, var(--muxc-overlay-corner-radius, 8px)));
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
  --win-cbf-shadow-bleed: 24px;
  -webkit-backdrop-filter: var(--flyout-backdrop, blur(30px));
  backdrop-filter: var(--flyout-backdrop, blur(30px));
  overflow: hidden;
  clip-path: inset(calc(-1 * var(--win-cbf-shadow-bleed)));
  will-change: clip-path, opacity;
}

.win-cbf-layout-root,
.win-cbf-outer-content-root,
.win-cbf-content-root {
  border-radius: inherit;
}

.win-cbf-content-root {
  display: flex;
  flex-direction: column;
  background: transparent;
}

.win-cbf-primary-items-root {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  min-height: 46px;
  overflow: hidden;
  background: var(--CommandBarFlyoutBackground, var(--flyout-background, var(--layer-fill-color-default)));
  border: 1px solid var(--CommandBarFlyoutBorderBrush, var(--control-stroke-color-default, var(--ControlStrokeColorDefaultBrush, var(--flyout-border))));
  border-radius: inherit;
}

.win-commandbar-flyout.is-expanded .win-cbf-primary-items-root {
  border-radius: var(--OverlayCornerRadius, var(--overlay-corner-radius, var(--muxc-overlay-corner-radius, 8px)))
    var(--OverlayCornerRadius, var(--overlay-corner-radius, var(--muxc-overlay-corner-radius, 8px))) 0 0;
}

.win-cbf-primary-items-control {
  display: flex;
  grid-column: 1;
  align-items: stretch;
  height: 40px;
  min-width: 0;
  margin: 3px 0 3px 3px;
}

.win-commandbar-flyout.has-primary-labels .win-cbf-primary-items-control {
  min-height: 52px;
  height: auto;
}

.win-cbf-appbar-button,
.win-cbf-more-button,
.win-cbf-overflow-button {
  appearance: none;
  position: relative;
  isolation: isolate;
  border: 0;
  border-radius: var(--ControlCornerRadius, var(--control-corner-radius, 4px));
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.win-cbf-appbar-button::before,
.win-cbf-overflow-button::before {
  content: '';
  position: absolute;
  inset: 2px;
  z-index: 0;
  border-radius: inherit;
  background: transparent;
  transition: background-color 83ms linear;
}

.win-cbf-more-button::before {
  content: '';
  position: absolute;
  inset: 2px;
  z-index: 0;
  border-radius: inherit;
  background: transparent;
  transition: background-color 83ms linear;
}

.win-cbf-appbar-button > *,
.win-cbf-more-button > *,
.win-cbf-overflow-button > * {
  position: relative;
  z-index: 1;
}

.win-cbf-appbar-button {
  width: 40px;
  min-width: 40px;
  height: 40px;
  padding: 0;
}

.win-cbf-appbar-content-root {
  display: grid;
  min-width: 40px;
  height: 100%;
  place-items: center;
}

.win-cbf-icon-and-label-panel {
  display: grid;
  place-items: center;
}

.win-cbf-content-viewbox {
  display: grid;
  width: 16px;
  height: 16px;
  place-items: center;
}

.win-cbf-icon,
.win-cbf-overflow-icon,
.win-cbf-ellipsis-icon,
.win-cbf-overflow-check,
.win-cbf-overflow-chevron {
  font-family: var(--SymbolThemeFontFamily, 'Segoe Fluent Icons', 'Segoe MDL2 Assets');
}

.win-cbf-icon,
.win-cbf-overflow-icon,
.win-cbf-ellipsis-icon {
  font-size: 16px;
  line-height: 16px;
}

.win-commandbar-flyout.has-primary-labels .win-cbf-appbar-button {
  width: 60px;
  min-width: 60px;
  height: 52px;
}

.win-commandbar-flyout.has-primary-labels .win-cbf-appbar-content-root {
  min-width: 60px;
  align-items: start;
  padding-top: 9px;
}

.win-commandbar-flyout.has-primary-labels .win-cbf-icon-and-label-panel {
  width: 60px;
  align-content: start;
}

.win-cbf-text-label {
  display: block;
  width: 60px;
  margin: 6px 0 2px;
  color: inherit;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  white-space: normal;
  overflow: hidden;
  text-overflow: clip;
}

.win-cbf-more-button {
  display: grid;
  grid-column: 2;
  align-self: stretch;
  justify-self: stretch;
  width: 44px;
  min-width: 44px;
  height: auto;
  min-height: 40px;
  margin: 3px 3px 3px 0;
  padding: 0;
  place-items: center;
  font-size: var(--ControlContentThemeFontSize, 14px);
  font-weight: 600;
}

.win-cbf-ellipsis-icon {
  display: grid;
  width: 16px;
  height: 16px;
  place-items: center;
  text-align: center;
}

.win-cbf-appbar-button:hover,
.win-cbf-more-button:hover,
.win-cbf-overflow-button:hover {
  color: var(--CommandBarFlyoutAppBarButtonForegroundPointerOver, var(--text-primary));
}

.win-cbf-appbar-button:hover::before,
.win-cbf-more-button:hover::before,
.win-cbf-overflow-button:hover::before {
  background: var(--CommandBarFlyoutAppBarButtonBackgroundPointerOver, var(--subtle-fill-color-secondary, var(--subtle-secondary)));
}

.win-cbf-appbar-button:active,
.win-cbf-more-button:active,
.win-cbf-overflow-button:active {
  color: var(--CommandBarFlyoutAppBarButtonForegroundPressed, var(--text-secondary));
}

.win-cbf-appbar-button:active::before,
.win-cbf-more-button:active::before,
.win-cbf-overflow-button:active::before {
  background: var(--CommandBarFlyoutAppBarButtonBackgroundPressed, var(--subtle-fill-color-tertiary, var(--subtle-tertiary)));
}

.win-cbf-appbar-button.is-checked {
  color: var(--CommandBarFlyoutAppBarButtonForegroundChecked, var(--accent-text));
}

.win-cbf-appbar-button.is-checked::before {
  background: var(--CommandBarFlyoutAppBarButtonBackgroundChecked, var(--accent-base));
}

.win-cbf-appbar-button.is-checked:hover {
  color: var(--CommandBarFlyoutAppBarButtonForegroundCheckedPointerOver, var(--accent-text));
}

.win-cbf-appbar-button.is-checked:hover::before {
  background: var(--CommandBarFlyoutAppBarButtonBackgroundCheckedPointerOver, var(--accent-hover, var(--accent-base)));
}

.win-cbf-appbar-button.is-checked:active {
  color: var(--CommandBarFlyoutAppBarButtonForegroundCheckedPressed, var(--accent-text));
}

.win-cbf-appbar-button.is-checked:active::before {
  background: var(--CommandBarFlyoutAppBarButtonBackgroundCheckedPressed, var(--accent-pressed, var(--accent-base)));
}

.win-cbf-appbar-button:disabled,
.win-cbf-more-button:disabled,
.win-cbf-overflow-button:disabled {
  color: var(--CommandBarFlyoutAppBarButtonForegroundDisabled, var(--text-disabled));
  cursor: default;
}

.win-cbf-appbar-button:focus-visible,
.win-cbf-more-button:focus-visible,
.win-cbf-overflow-button:focus-visible {
  outline: 2px solid var(--focus-stroke-color-outer, var(--accent-default, #005FB8));
  outline-offset: -2px;
}

.win-cbf-outer-overflow-content-root {
  width: 100%;
  background: transparent;
}

.win-cbf-overflow-content-root {
  background: var(--CommandBarFlyoutButtonBackground, var(--flyout-background, var(--layer-fill-color-default)));
  border: solid var(--CommandBarFlyoutBorderBrush, var(--control-stroke-color-default, var(--ControlStrokeColorDefaultBrush, var(--flyout-border))));
  border-width: 0 1px 1px;
  border-radius: 0 0 var(--OverlayCornerRadius, var(--overlay-corner-radius, var(--muxc-overlay-corner-radius, 8px)))
    var(--OverlayCornerRadius, var(--overlay-corner-radius, var(--muxc-overlay-corner-radius, 8px)));
}

.win-cbf-secondary-items-control {
  display: flex;
  flex-direction: column;
  min-width: 136px;
  max-width: 440px;
  max-height: 480px;
  margin: 0;
  padding: 3px;
  overflow-x: hidden;
  overflow-y: auto;
}

.win-cbf-overflow-button {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  width: 100%;
  min-height: 33px;
  padding: 0;
  text-align: left;
}

.win-cbf-overflow-button.has-check,
.win-cbf-overflow-button.has-menu-icon {
  grid-template-columns: 39px minmax(0, 1fr) auto auto;
}

.win-cbf-overflow-button.has-check.has-menu-icon {
  grid-template-columns: 39px 28px minmax(0, 1fr) auto auto;
}

.win-cbf-overflow-check {
  display: grid;
  width: 39px;
  margin: 4px 0;
  place-items: center;
  color: inherit;
  font-size: 12px;
  line-height: 16px;
  opacity: 0;
}

.win-cbf-overflow-button.is-checked .win-cbf-overflow-check {
  opacity: 1;
}

.win-cbf-overflow-icon {
  display: grid;
  width: 16px;
  height: 16px;
  place-items: center;
}

.win-cbf-overflow-button.has-menu-icon:not(.has-check) .win-cbf-overflow-icon {
  margin: 0 11px 0 12px;
}

.win-cbf-overflow-button.has-check.has-menu-icon .win-cbf-overflow-icon {
  margin: 0 12px 0 0;
}

.win-cbf-overflow-label {
  min-width: 0;
  margin: 0 12px;
  padding: 6px 0 7px;
  color: inherit;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
}

.win-cbf-overflow-button.has-check .win-cbf-overflow-label,
.win-cbf-overflow-button.has-menu-icon .win-cbf-overflow-label {
  margin-left: 0;
}

.win-cbf-overflow-accelerator {
  min-width: 0;
  margin: 0 12px 0 24px;
  color: var(--CommandBarFlyoutAppBarButtonKeyboardTextLabelForeground, var(--text-secondary));
  font-size: 12px;
  line-height: 16px;
  text-align: right;
  white-space: nowrap;
}

.win-cbf-overflow-chevron {
  margin: 0 12px;
  color: var(--CommandBarFlyoutAppBarButtonSubItemChevronForeground, var(--text-secondary));
  font-size: 12px;
  line-height: 16px;
}

.win-cbf-overflow-button:hover .win-cbf-overflow-accelerator {
  color: var(--CommandBarFlyoutAppBarButtonKeyboardTextLabelForegroundPointerOver, var(--text-secondary));
}

.win-cbf-overflow-button:active .win-cbf-overflow-accelerator {
  color: var(--CommandBarFlyoutAppBarButtonKeyboardTextLabelForegroundPressed, var(--text-tertiary, var(--text-secondary)));
}

.win-cbf-overflow-button:hover .win-cbf-overflow-chevron {
  color: var(--CommandBarFlyoutAppBarButtonSubItemChevronPointerOverForeground, var(--text-secondary));
}

.win-cbf-overflow-button:active .win-cbf-overflow-chevron {
  color: var(--CommandBarFlyoutAppBarButtonSubItemChevronPressedForeground, var(--text-tertiary, var(--text-secondary)));
}

.cbf-flyout-enter-active { animation: cbf-flyout-fade-in 83ms linear both; }
.cbf-flyout-leave-active { animation: cbf-flyout-fade-out 83ms linear both; }

.win-commandbar-flyout.is-panel-expanding-setup {
  clip-path: inset(calc(-1 * var(--win-cbf-shadow-bleed)) var(--cbf-collapsed-right) var(--cbf-collapsed-bottom) calc(-1 * var(--win-cbf-shadow-bleed)));
}

.win-commandbar-flyout.is-panel-expanding {
  animation: cbf-panel-expand 200ms cubic-bezier(0.1, 0.9, 0.2, 1) both;
}

.win-commandbar-flyout.is-panel-collapsing {
  animation: cbf-panel-collapse 167ms cubic-bezier(0.1, 0.9, 0.2, 1) both;
  pointer-events: none;
}

@keyframes cbf-flyout-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes cbf-flyout-fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes cbf-panel-expand {
  from {
    clip-path: inset(calc(-1 * var(--win-cbf-shadow-bleed)) var(--cbf-collapsed-right) var(--cbf-collapsed-bottom) calc(-1 * var(--win-cbf-shadow-bleed)));
  }
  to {
    clip-path: inset(calc(-1 * var(--win-cbf-shadow-bleed)));
  }
}

@keyframes cbf-panel-collapse {
  from {
    clip-path: inset(calc(-1 * var(--win-cbf-shadow-bleed)));
  }
  to {
    clip-path: inset(calc(-1 * var(--win-cbf-shadow-bleed)) var(--cbf-collapsed-right) var(--cbf-collapsed-bottom) calc(-1 * var(--win-cbf-shadow-bleed)));
  }
}
</style>
