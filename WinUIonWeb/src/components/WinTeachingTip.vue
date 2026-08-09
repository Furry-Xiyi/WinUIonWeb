<template>
  <Teleport to="body">
    <Transition name="win-teaching-tip">
      <section
        v-if="effectiveIsOpen"
        ref="tipRef"
        class="win-teaching-tip"
        :class="[
          isTargeted ? 'is-targeted' : 'is-untargeted',
          IsLightDismissEnabled ? 'is-light-dismiss' : 'is-normal-dismiss',
          themeClass,
          `placement-${actualPlacement.toLowerCase()}`,
          `hero-placement-${HeroContentPlacement.toLowerCase()}`
        ]"
        :style="tipStyle"
        role="dialog"
        @pointerdown.stop>
        <div v-if="$slots.HeroContent || $slots.hero || HeroContent" class="win-teaching-tip-hero">
          <slot name="HeroContent">
            <slot name="hero">
              <template v-if="typeof HeroContent === 'string' || typeof HeroContent === 'number'">{{ HeroContent }}</template>
            </slot>
          </slot>
        </div>
        <div class="win-teaching-tip-main" :class="{ 'has-alternate-close': ShowAlternateCloseButton }">
          <div v-if="$slots.IconSource || $slots.icon || IconSource" class="win-teaching-tip-icon">
            <slot name="IconSource"><slot name="icon">{{ iconGlyph }}</slot></slot>
          </div>
          <div class="win-teaching-tip-text">
            <WinTextBlock v-if="Title" class="win-teaching-tip-title" :Text="Title" TextWrapping="WrapWholeWords" />
            <WinTextBlock v-if="Subtitle" class="win-teaching-tip-subtitle" :Text="Subtitle" TextWrapping="WrapWholeWords" />
            <div v-if="$slots.default || Content" class="win-teaching-tip-content">
              <slot>{{ Content }}</slot>
            </div>
          </div>
          <WinButton
            v-if="ShowAlternateCloseButton"
            class="win-teaching-tip-close"
            Style="SubtleButtonStyle"
            Width="32"
            Height="32"
            Padding="4"
            Margin="4"
            BorderThickness="1"
            CornerRadius="var(--ControlCornerRadius, 4px)"
            FocusVisualMargin="-3"
            Content="&#xE711;"
            FontFamily="var(--SymbolThemeFontFamily, 'Segoe Fluent Icons', 'Segoe MDL2 Assets')"
            FontSize="16"
            type="button"
            :aria-label="t('text.close')"
            v-bind="{ 'tooltipservice.tooltip': t('text.close') }"
            @Click="close" />
        </div>
        <div
          v-if="ActionButtonContent || CloseButtonContent || $slots.actions"
          class="win-teaching-tip-actions"
          :class="{ 'both-buttons-visible': ActionButtonContent && CloseButtonContent }">
          <slot name="actions">
            <WinButton
              v-if="ActionButtonContent"
              class="win-teaching-tip-action-button"
              :Style="ActionButtonStyle"
              v-bind="actionButtonStyleAttrs"
              @Click="onAction">
              <WinTextBlock :Text="ActionButtonContent" />
            </WinButton>
            <WinButton
              v-if="CloseButtonContent"
              class="win-teaching-tip-close-button"
              :Style="CloseButtonStyle"
              v-bind="closeButtonStyleAttrs"
              @Click="onCloseButton">
              <WinTextBlock :Text="CloseButtonContent" />
            </WinButton>
          </slot>
        </div>
        <svg
          v-if="hasVisibleTail"
          class="win-teaching-tip-tail"
          viewBox="0 0 20 10"
          preserveAspectRatio="none"
          aria-hidden="true">
          <polygon :points="tailPoints" />
          <polyline :points="tailPoints" />
        </svg>
      </section>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue';
import WinButton from './WinButton.vue';
import WinTextBlock from './WinTextBlock.vue';
import { useI18n } from './i18n/index';

const { t } = useI18n();

const props = defineProps({
  IsOpen: { type: Boolean, default: undefined },
  visible: { type: Boolean, default: undefined },
  Target: { type: Object, default: null },
  target: { type: Object, default: null },
  Title: { type: String, default: '' },
  title: { type: String, default: '' },
  Subtitle: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  Content: { type: [String, Number, Object], default: '' },
  HeroContent: { type: [String, Number, Object], default: null },
  TailVisibility: { type: String, default: 'Auto' },
  PreferredPlacement: { type: String, default: 'Auto' },
  preferredPlacement: { type: String, default: '' },
  PlacementMargin: { type: [String, Number, Object], default: 0 },
  ShouldConstrainToRootBounds: { type: Boolean, default: true },
  IsLightDismissEnabled: { type: Boolean, default: false },
  HeroContentPlacement: { type: String, default: 'Auto' },
  Theme: { type: String, default: '' },
  ActionButtonContent: { type: [String, Number, Object], default: '' },
  ActionButtonStyle: { type: [String, Object], default: '' },
  ActionButtonCommand: { type: [Function, Object], default: null },
  ActionButtonCommandParameter: { type: [String, Number, Boolean, Object], default: null },
  CloseButtonContent: { type: [String, Number, Object], default: '' },
  CloseButtonStyle: { type: [String, Object], default: '' },
  CloseButtonCommand: { type: [Function, Object], default: null },
  CloseButtonCommandParameter: { type: [String, Number, Boolean, Object], default: null },
  IconSource: { type: [String, Object], default: '' },
  isTargeted: { type: Boolean, default: undefined }
});

const emit = defineEmits(['update:IsOpen', 'update:visible', 'ActionButtonClick', 'CloseButtonClick', 'Opened', 'Closed', 'action', 'close']);

const tipRef = ref(null);
const localIsOpen = ref(false);
const position = ref({ top: 0, left: 0, tailLeft: 160 });
const actualPlacement = ref('Bottom');
const inheritedTheme = inject('winuiTheme', null);
const anchorTheme = ref('');
const documentTheme = ref('');
let themeObserver = null;

const effectiveIsOpen = computed(() => props.IsOpen ?? props.visible ?? localIsOpen.value);
const targetValue = computed(() => props.Target || props.target);
const isTargeted = computed(() => props.isTargeted ?? Boolean(targetElement()));
const Title = computed(() => props.Title || props.title);
const Subtitle = computed(() => props.Subtitle || props.subtitle);
const PreferredPlacement = computed(() => props.PreferredPlacement || props.preferredPlacement || 'Auto');
const HeroContent = computed(() => props.HeroContent);
const ActionButtonContent = computed(() => props.ActionButtonContent);
const ActionButtonStyle = computed(() => typeof props.ActionButtonStyle === 'string' ? props.ActionButtonStyle : '');
const actionButtonStyleAttrs = computed(() => typeof props.ActionButtonStyle === 'object'
  ? { style: props.ActionButtonStyle }
  : {});
const CloseButtonContent = computed(() => props.CloseButtonContent);
const CloseButtonStyle = computed(() => typeof props.CloseButtonStyle === 'string' ? props.CloseButtonStyle : '');
const closeButtonStyleAttrs = computed(() => typeof props.CloseButtonStyle === 'object'
  ? { style: props.CloseButtonStyle }
  : {});
const IsLightDismissEnabled = computed(() => props.IsLightDismissEnabled);
const TailVisibility = computed(() => normalizeTailVisibility(props.TailVisibility));
const ShouldConstrainToRootBounds = computed(() => props.ShouldConstrainToRootBounds);
const HeroContentPlacement = computed(() => normalizeHeroContentPlacement(props.HeroContentPlacement));
const effectiveTheme = computed(() => {
  const explicitTheme = normalizeTheme(props.Theme);
  if (explicitTheme) return explicitTheme;
  if (anchorTheme.value) return anchorTheme.value;
  const providedTheme = normalizeTheme(unref(inheritedTheme));
  return providedTheme || documentTheme.value;
});
const themeClass = computed(() => effectiveTheme.value
  ? `win-theme-scope theme-${effectiveTheme.value}`
  : '');
const ShowAlternateCloseButton = computed(() => !CloseButtonContent.value && !IsLightDismissEnabled.value);
const hasVisibleTail = computed(() => isTargeted.value && TailVisibility.value !== 'Collapsed');
const tailPoints = computed(() => actualPlacement.value === 'Top'
  ? '0,0 10,10 20,0'
  : '0,10 10,0 20,10');
const IconSource = computed(() => props.IconSource);
const Content = computed(() => props.Content);
const iconGlyph = computed(() => IconSource.value === 'Refresh' ? '\uE72C' : IconSource.value);
const tipStyle = computed(() => {
  const background = IsLightDismissEnabled.value
    ? 'var(--TeachingTipTransientBackground, var(--AcrylicInAppFillColorDefaultBrush, var(--flyout-bg)))'
    : 'var(--TeachingTipBackgroundBrush, var(--SolidBackgroundFillColorTertiaryBrush, var(--ctrl-fill-tertiary, var(--flyout-bg))))';

  return {
    top: `${position.value.top}px`,
    left: `${position.value.left}px`,
    '--teaching-tip-tail-left': `${position.value.tailLeft}px`,
    '--teaching-tip-background': background,
    '--win-acrylic-fill': background
  };
});

function targetElement() {
  const value = targetValue.value;
  if (!value) return null;
  if (value instanceof HTMLElement) return value;
  if (value.$el instanceof HTMLElement) return value.$el;
  if (value.value instanceof HTMLElement) return value.value;
  if (value.value?.$el instanceof HTMLElement) return value.value.$el;
  return null;
}

function normalizeTheme(value) {
  const theme = String(value || '').toLowerCase();
  return theme === 'light' || theme === 'dark' ? theme : '';
}

function resolveAnchorTheme() {
  const scope = targetElement()?.closest?.('.theme-light, .theme-dark');
  if (scope?.classList.contains('theme-dark')) return 'dark';
  if (scope?.classList.contains('theme-light')) return 'light';
  return '';
}

function resolveDocumentTheme() {
  const root = document.documentElement;
  if (root.classList.contains('theme-dark') || root.dataset.theme === 'dark') return 'dark';
  if (root.classList.contains('theme-light') || root.dataset.theme === 'light') return 'light';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function observeTheme() {
  themeObserver?.disconnect();
  anchorTheme.value = resolveAnchorTheme();
  documentTheme.value = resolveDocumentTheme();
  themeObserver = new MutationObserver(() => {
    anchorTheme.value = resolveAnchorTheme();
    documentTheme.value = resolveDocumentTheme();
  });
  const scope = targetElement()?.closest?.('.theme-light, .theme-dark');
  if (scope) themeObserver.observe(scope, { attributes: true, attributeFilter: ['class', 'data-theme'] });
  if (document.documentElement !== scope) {
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
  }
}

const setOpen = (value) => {
  localIsOpen.value = value;
  emit('update:IsOpen', value);
  emit('update:visible', value);
  emit(value ? 'Opened' : 'Closed');
};

const close = () => {
  if (!effectiveIsOpen.value) return;
  emit('CloseButtonClick');
  emit('close');
  setOpen(false);
};

const onAction = () => {
  executeCommand(props.ActionButtonCommand, props.ActionButtonCommandParameter);
  emit('ActionButtonClick');
  emit('action');
  setOpen(false);
};

const onCloseButton = () => {
  executeCommand(props.CloseButtonCommand, props.CloseButtonCommandParameter);
  close();
};

function executeCommand(command, parameter) {
  if (typeof command === 'function') {
    command(parameter);
  } else if (command && typeof command.Execute === 'function') {
    command.Execute(parameter);
  }
}

const updatePosition = async () => {
  await nextTick();
  const tip = tipRef.value;
  if (!tip) return;
  // The enter animation scales the element, so getBoundingClientRect() would
  // measure the transient scaled size and place the tip at the wrong offset.
  const tipRect = {
    width: tip.offsetWidth,
    height: tip.offsetHeight
  };
  const margin = parseThickness(props.PlacementMargin);
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const target = targetElement();

  if (!target) {
    const edgeMargin = 24;
    const bottomTop = viewportHeight - tipRect.height - edgeMargin - margin.bottom;
    const topTop = edgeMargin + margin.top;
    const fitsBottom = bottomTop >= edgeMargin;
    const fitsTop = topTop + tipRect.height <= viewportHeight - edgeMargin;
    actualPlacement.value = fitsBottom || !fitsTop ? 'Bottom' : 'Top';
    position.value = {
      top: clamp(actualPlacement.value === 'Bottom' ? bottomTop : topTop, edgeMargin, viewportHeight - tipRect.height - edgeMargin),
      left: clamp((viewportWidth - tipRect.width) / 2, margin.left, viewportWidth - tipRect.width - margin.right),
      tailLeft: tipRect.width / 2
    };
    return;
  }

  const rect = target.getBoundingClientRect();
  const preferred = normalizePlacement(PreferredPlacement.value);
  const tailInset = hasVisibleTail.value ? 9 : 0;
  const verticalExtent = tipRect.height + tailInset;
  const spaceBelow = viewportHeight - rect.bottom - margin.bottom;
  const spaceAbove = rect.top - margin.top;
  const placement = choosePlacement(preferred, verticalExtent, spaceAbove, spaceBelow);
  actualPlacement.value = placement;

  let top = placement === 'Top'
    ? rect.top - tipRect.height - tailInset - margin.top
    : rect.bottom + tailInset + margin.bottom;
  let left = rect.left + rect.width / 2 - tipRect.width / 2;
  if (ShouldConstrainToRootBounds.value) {
    const minTop = placement === 'Bottom' ? margin.top + tailInset : margin.top;
    const maxTop = viewportHeight - tipRect.height - margin.bottom - (placement === 'Top' ? tailInset : 0);
    top = clamp(top, minTop, maxTop);
    left = clamp(left, margin.left, viewportWidth - tipRect.width - margin.right);
  }
  const targetCenter = rect.left + rect.width / 2;
  const tailLeft = clamp(targetCenter - left, 18, tipRect.width - 18);
  position.value = { top, left, tailLeft };
};

function parseThickness(value) {
  if (value && typeof value === 'object') {
    return {
      top: finiteNumber(value.top ?? value.Top),
      right: finiteNumber(value.right ?? value.Right),
      bottom: finiteNumber(value.bottom ?? value.Bottom),
      left: finiteNumber(value.left ?? value.Left)
    };
  }

  const parts = String(value ?? '0')
    .split(',')
    .map((part) => Number(part.trim()))
    .filter(Number.isFinite);

  if (parts.length === 1) return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
  if (parts.length === 2) return { top: parts[1], right: parts[0], bottom: parts[1], left: parts[0] };
  if (parts.length === 4) return { top: parts[1], right: parts[2], bottom: parts[3], left: parts[0] };
  return { top: 0, right: 0, bottom: 0, left: 0 };
}

function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function normalizePlacement(value) {
  const placement = String(value || 'Auto').toLowerCase();
  const knownPlacements = ['Top', 'Bottom', 'Left', 'Right', 'TopRight', 'TopLeft', 'BottomRight', 'BottomLeft', 'LeftTop', 'LeftBottom', 'RightTop', 'RightBottom', 'Center'];
  const normalized = knownPlacements.find((item) => item.toLowerCase() === placement);
  if (normalized) return normalized;
  return 'Auto';
}

function normalizeTailVisibility(value) {
  const visibility = String(value || 'Auto').toLowerCase();
  if (visibility === 'visible') return 'Visible';
  if (visibility === 'collapsed') return 'Collapsed';
  return 'Auto';
}

function normalizeHeroContentPlacement(value) {
  const placement = String(value || 'Auto').toLowerCase();
  if (placement === 'bottom') return 'Bottom';
  if (placement === 'top') return 'Top';
  return 'Auto';
}

function choosePlacement(preferred, tipExtent, spaceAbove, spaceBelow) {
  const fitsTop = spaceAbove >= tipExtent;
  const fitsBottom = spaceBelow >= tipExtent;
  if (preferred === 'Top') return fitsTop || !fitsBottom ? 'Top' : 'Bottom';
  if (preferred === 'Bottom') return fitsBottom || !fitsTop ? 'Bottom' : 'Top';
  if (fitsTop) return 'Top';
  if (fitsBottom) return 'Bottom';
  return spaceAbove >= spaceBelow ? 'Top' : 'Bottom';
}

function clamp(value, min, max) {
  if (max < min) return min;
  return Math.max(min, Math.min(max, value));
}

watch(effectiveIsOpen, (value) => {
  if (value) {
    observeTheme();
    void updatePosition();
  }
});

watch(targetValue, () => {
  void nextTick(observeTheme);
});

watch(
  () => [
    props.PlacementMargin,
    props.PreferredPlacement,
    props.preferredPlacement,
    props.ShouldConstrainToRootBounds,
    props.TailVisibility,
    props.Title,
    props.Subtitle,
    props.Content,
    props.ActionButtonContent,
    props.CloseButtonContent
  ],
  () => {
    if (effectiveIsOpen.value) void updatePosition();
  }
);

const onViewportChanged = () => {
  if (effectiveIsOpen.value) void updatePosition();
};

onMounted(() => {
  observeTheme();
  window.addEventListener('resize', onViewportChanged);
  window.addEventListener('scroll', onViewportChanged, true);
});

onBeforeUnmount(() => {
  themeObserver?.disconnect();
  window.removeEventListener('resize', onViewportChanged);
  window.removeEventListener('scroll', onViewportChanged, true);
});

defineExpose({ close, updatePosition });
</script>

<style>
.win-teaching-tip {
  position: fixed;
  z-index: var(--win-teaching-tip-z-index, var(--win-tip-z-index, 2147483646));
  width: max-content;
  min-width: min(320px, calc(100vw - 16px));
  max-width: min(336px, calc(100vw - 16px));
  min-height: 40px;
  max-height: min(520px, calc(100vh - 16px));
  overflow: visible;
  display: flex;
  flex-direction: column;
  color: var(--TeachingTipForegroundBrush, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  --teaching-tip-background: var(--TeachingTipBackgroundBrush, var(--SolidBackgroundFillColorTertiaryBrush, var(--ctrl-fill-tertiary, var(--flyout-bg))));
  --win-acrylic-fill: var(--teaching-tip-background);
  --teaching-tip-backdrop: none;
  --teaching-tip-border: var(--TeachingTipBorderBrush, var(--SurfaceStrokeColorDefaultBrush, var(--ControlStrokeColorDefaultBrush, var(--surface-stroke-color-flyout, var(--flyout-border)))));
  isolation: isolate;
  background: transparent;
  border: 1px solid var(--teaching-tip-border);
  border-radius: var(--OverlayCornerRadius, var(--overlay-corner-radius, 8px));
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  -webkit-backdrop-filter: var(--teaching-tip-backdrop);
  backdrop-filter: var(--teaching-tip-backdrop);
}

.win-teaching-tip.is-light-dismiss {
  --teaching-tip-backdrop: var(--flyout-backdrop);
}

.win-teaching-tip-hero {
  height: 100px;
  overflow: hidden;
  flex: 0 0 auto;
  background: transparent;
  border-radius: var(--OverlayCornerRadius, var(--overlay-corner-radius, 8px)) var(--OverlayCornerRadius, var(--overlay-corner-radius, 8px)) 0 0;
}

.win-teaching-tip.hero-placement-bottom .win-teaching-tip-hero {
  order: 3;
  border-radius: 0 0 var(--OverlayCornerRadius, var(--overlay-corner-radius, 8px)) var(--OverlayCornerRadius, var(--overlay-corner-radius, 8px));
}

.win-teaching-tip.hero-placement-bottom .win-teaching-tip-main {
  order: 1;
}

.win-teaching-tip.hero-placement-bottom .win-teaching-tip-actions {
  order: 2;
}

.win-teaching-tip-main {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
}

.win-teaching-tip-icon {
  flex: 0 0 auto;
  width: 20px;
  color: var(--text-primary);
  font-size: 16px;
  line-height: 20px;
  text-align: center;
}

.win-teaching-tip-text {
  min-width: 0;
  flex: 1;
}

.win-teaching-tip-main.has-alternate-close .win-teaching-tip-text {
  padding-right: 28px;
}

.win-teaching-tip-title {
  color: var(--TeachingTipTitleForegroundBrush, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.win-teaching-tip-subtitle,
.win-teaching-tip-content {
  margin-top: 0;
  color: var(--TeachingTipSubtitleForegroundBrush, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  font-size: 14px;
  line-height: 20px;
}

.win-teaching-tip-close {
  position: absolute;
  top: 0;
  right: 0;
}

.win-teaching-tip-actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  justify-content: stretch;
  gap: 0;
  padding: 0 12px 12px;
}

.win-teaching-tip-actions.both-buttons-visible {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: 8px;
}

.win-teaching-tip-action-button,
.win-teaching-tip-close-button {
  width: 100%;
  margin-top: 12px;
}

.win-teaching-tip-tail {
  position: absolute;
  left: var(--teaching-tip-tail-left, 50%);
  z-index: 2;
  width: 20px;
  height: 10px;
  display: block;
  overflow: visible;
  pointer-events: none;
  transform: translateX(-50%);
  fill: var(--teaching-tip-background);
  stroke: var(--teaching-tip-border);
  stroke-width: 1;
  stroke-linecap: butt;
  stroke-linejoin: miter;
}

.win-teaching-tip-tail polyline {
  fill: none;
}

.win-teaching-tip-tail polygon {
  stroke: none;
}

.win-teaching-tip.placement-bottom .win-teaching-tip-tail {
  top: -9px;
}

.win-teaching-tip.placement-bottom {
  transform-origin: var(--teaching-tip-tail-left, 50%) 0;
}

.win-teaching-tip.placement-top .win-teaching-tip-tail {
  bottom: -9px;
}

.win-teaching-tip.placement-top {
  transform-origin: var(--teaching-tip-tail-left, 50%) 100%;
}

.win-teaching-tip-enter-active {
  animation: win-teaching-tip-enter 167ms cubic-bezier(0, 0, 0, 1) both;
}

.win-teaching-tip-leave-active {
  animation: win-teaching-tip-exit 167ms cubic-bezier(0.7, 0, 1, 0.5) both;
}

@keyframes win-teaching-tip-enter {
  from {
    opacity: 0;
    transform: scale(0.08);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes win-teaching-tip-exit {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.08);
  }
}
</style>
