<template>
  <Teleport to="body">
    <Transition name="teaching-tip">
      <section
        v-if="effectiveIsOpen"
        ref="tipRef"
        class="teaching-tip"
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
        <div v-if="hasHeroContent" class="teaching-tip-hero">
          <HeroContentOutlet v-if="propertyNodes.heroContent.length" />
          <slot v-else name="HeroContent">
            <slot name="hero">
              <template v-if="typeof HeroContent === 'string' || typeof HeroContent === 'number'">{{ HeroContent }}</template>
            </slot>
          </slot>
        </div>
        <div class="teaching-tip-main" :class="{ 'has-alternate-close': ShowAlternateCloseButton }">
          <div v-if="hasIconSource" class="teaching-tip-icon">
            <IconSourceOutlet v-if="propertyNodes.iconSource.length" />
            <slot v-else name="IconSource"><slot name="icon">{{ iconGlyph }}</slot></slot>
          </div>
          <div class="teaching-tip-text">
            <TextBlock v-if="Title" class="teaching-tip-title" Text="{x:Bind TipTitle}" TextWrapping="WrapWholeWords" />
            <TextBlock v-if="Subtitle" class="teaching-tip-subtitle" Text="{x:Bind TipSubtitle}" TextWrapping="WrapWholeWords" />
            <div v-if="hasContent" class="teaching-tip-content">
              <ContentOutlet v-if="propertyNodes.content.length" />
              <slot v-else>{{ Content }}</slot>
            </div>
          </div>
          <Button
            v-if="ShowAlternateCloseButton"
            class="teaching-tip-close"
            Style="SubtleButtonStyle"
            Width="40"
            Height="40"
            Padding="4"
            Margin="0"
            BorderThickness="1"
            CornerRadius="var(--ControlCornerRadius, 4px)"
            FocusVisualMargin="-3"
            Content="&#xE711;"
            FontFamily="var(--SymbolThemeFontFamily, 'Segoe Fluent Icons', 'Segoe MDL2 Assets')"
            FontSize="16"
            AutomationProperties.Name="{x:Bind CloseButtonLabel}"
            ToolTipService.ToolTip="{x:Bind CloseButtonLabel}"
            Click="OnTeachingTipCloseButtonClick" />
        </div>
        <div
          v-if="ActionButtonContent || CloseButtonContent || $slots.actions"
          class="teaching-tip-actions"
          :class="{ 'both-buttons-visible': ActionButtonContent && CloseButtonContent }">
          <slot name="actions">
            <Button
              v-if="ActionButtonContent"
              class="teaching-tip-action-button"
              Style="{x:Bind ActionButtonStyleName}"
              Click="OnTeachingTipActionButtonClick">
              <TextBlock Text="{x:Bind ActionButtonContent}" />
            </Button>
            <Button
              v-if="CloseButtonContent"
              class="teaching-tip-close-button"
              Style="{x:Bind CloseButtonStyleName}"
              Click="OnTeachingTipCloseButtonClick">
              <TextBlock Text="{x:Bind CloseButtonContent}" />
            </Button>
          </slot>
        </div>
        <svg
          v-if="hasVisibleTail"
          class="teaching-tip-tail"
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

<script lang="ts">
import { TeachingTipContent, TeachingTipHeroContent, TeachingTipIconSource } from './TeachingTipProperties'

export default {
  HeroContent: TeachingTipHeroContent,
  Content: TeachingTipContent,
  IconSource: TeachingTipIconSource
}
</script>

<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, unref, useAttrs, useSlots, watch } from 'vue';
import Button from './Button.vue';
import TextBlock from './TextBlock.vue';
import { useI18n } from './i18n/index';
import { getTeachingTipProperty, type TeachingTipPropertyName } from './TeachingTipProperties';
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, xamlScopeKey } from './xamlRuntime';

const { t } = useI18n();

defineOptions({ name: 'TeachingTip' });

const props = defineProps({
  IsOpen: { type: [Boolean, String], default: undefined },
  Target: { type: [Object, String], default: null },
  Title: { type: String, default: '' },
  Subtitle: { type: String, default: '' },
  Content: { type: [String, Number, Object], default: '' },
  HeroContent: { type: [String, Number, Object], default: null },
  TailVisibility: { type: String, default: 'Auto' },
  PreferredPlacement: { type: String, default: 'Auto' },
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

const emit = defineEmits(['update:IsOpen', 'ActionButtonClick', 'CloseButtonClick', 'Opened', 'Closed']);

const tipRef = ref(null);
const instance = getCurrentInstance();
const attrs = useAttrs();
const slots = useSlots();
const localIsOpen = ref(false);
const position = ref({ top: 0, left: 0, tailLeft: 160 });
const actualPlacement = ref('Bottom');
const inheritedTheme = inject('winuiTheme', null);
const anchorTheme = ref('');
const documentTheme = ref('');
let themeObserver = null;

const resolve = (value: unknown) => resolveXamlValue(value, instance);
const effectiveIsOpen = computed(() => resolve(props.IsOpen) ?? localIsOpen.value);
const targetValue = computed(() => resolve(props.Target));
const isTargeted = computed(() => props.isTargeted ?? Boolean(targetElement()));
const Title = computed(() => resolve(props.Title));
const Subtitle = computed(() => resolve(props.Subtitle));
const PreferredPlacement = computed(() => resolve(props.PreferredPlacement) || 'Auto');
const ActionButtonContent = computed(() => resolve(props.ActionButtonContent));
const ActionButtonStyle = computed(() => typeof resolve(props.ActionButtonStyle) === 'string' ? resolve(props.ActionButtonStyle) : '');
const CloseButtonContent = computed(() => resolve(props.CloseButtonContent));
const CloseButtonStyle = computed(() => typeof resolve(props.CloseButtonStyle) === 'string' ? resolve(props.CloseButtonStyle) : '');
const ActionButtonStyleName = computed(() => ActionButtonStyle.value || 'DefaultButtonStyle');
const CloseButtonStyleName = computed(() => CloseButtonStyle.value || 'DefaultButtonStyle');
const TipTitle = computed(() => Title.value);
const TipSubtitle = computed(() => Subtitle.value);
const CloseButtonLabel = computed(() => t('text.close'));
const IsLightDismissEnabled = computed(() => resolve(props.IsLightDismissEnabled) === true);
const TailVisibility = computed(() => normalizeTailVisibility(resolve(props.TailVisibility)));
const ShouldConstrainToRootBounds = computed(() => resolve(props.ShouldConstrainToRootBounds) !== false);
const HeroContentPlacement = computed(() => normalizeHeroContentPlacement(resolve(props.HeroContentPlacement)));
const effectiveTheme = computed(() => {
  const explicitTheme = normalizeTheme(resolve(props.Theme));
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
const propertyNodes = computed(() => {
  const result: Record<TeachingTipPropertyName, ReturnType<NonNullable<typeof slots.default>>> = {
    heroContent: [], content: [], iconSource: []
  };
  const defaultContent: ReturnType<NonNullable<typeof slots.default>> = [];
  for (const node of slots.default?.() ?? []) {
    const property = getTeachingTipProperty(node);
    if (!property || !node.children || typeof node.children !== 'object') {
      defaultContent.push(node);
      continue;
    }
    const propertySlot = (node.children as { default?: () => ReturnType<NonNullable<typeof slots.default>> }).default;
    if (propertySlot) result[property] = normalizeXamlNodes(propertySlot(), instance);
  }
  if (!result.content.length) result.content = normalizeXamlNodes(defaultContent, instance);
  return result;
});
const outlet = (name: TeachingTipPropertyName) => defineComponent({
  name: `TeachingTip${name[0].toUpperCase()}${name.slice(1)}Outlet`,
  setup() { return () => h(Fragment, propertyNodes.value[name]); }
});
const HeroContentOutlet = outlet('heroContent');
const ContentOutlet = outlet('content');
const IconSourceOutlet = outlet('iconSource');
const HeroContent = computed(() => resolve(props.HeroContent));
const IconSource = computed(() => resolve(props.IconSource));
const Content = computed(() => resolve(props.Content));
const hasHeroContent = computed(() => propertyNodes.value.heroContent.length > 0 || Boolean(HeroContent.value) || Boolean(slots.HeroContent || slots.hero));
const hasContent = computed(() => propertyNodes.value.content.length > 0 || Boolean(Content.value) || Boolean(slots.content));
const hasIconSource = computed(() => propertyNodes.value.iconSource.length > 0 || Boolean(IconSource.value) || Boolean(slots.IconSource || slots.icon));
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

function targetElementFallback() {
  const expression = typeof props.Target === 'string'
    ? props.Target.match(/^\{(?:x:Bind|Binding)\s+([A-Za-z_$][\w$]*)[\s\S]*\}$/)?.[1]
    : '';
  if (!expression) return null;
  const escaped = typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
    ? CSS.escape(expression)
    : expression.replace(/[^A-Za-z0-9_-]/g, '\\$&');
  return document.querySelector<HTMLElement>(`[data-xaml-ref="${escaped}"]`)
    || document.querySelector<HTMLElement>(`[data-xaml-ref~="${escaped}"]`);
}

function targetElement() {
  const value = targetValue.value;
  const fallback = targetElementFallback();
  if (!value) return fallback;
  if (value instanceof HTMLElement) return value;
  if (value && typeof value === 'object' && value.$el instanceof HTMLElement) return value.$el;
  if (value && typeof value === 'object' && value.value instanceof HTMLElement) return value.value;
  if (value && typeof value === 'object' && value.value?.$el instanceof HTMLElement) return value.value.$el;
  return fallback;
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
  const binding = typeof props.IsOpen === 'string'
    ? props.IsOpen.match(/^\{(?:x:Bind|Binding)\s+([\s\S]*?)\}$/)
    : null;
  if (binding) {
    const expression = binding[1]
      .replace(/,\s*Mode\s*=\s*(?:OneWay|TwoWay|OneTime)\s*$/, '')
      .trim();
    resolveXamlHandler(`${expression} = $event`, instance)?.(value);
  }
  emit(value ? 'Opened' : 'Closed');
};

const close = () => {
  if (!effectiveIsOpen.value) return;
  emit('CloseButtonClick');
  resolveXamlHandler(attrs.CloseButtonClick, instance)?.();
  setOpen(false);
};

const onAction = () => {
  executeCommand(props.ActionButtonCommand, props.ActionButtonCommandParameter);
  emit('ActionButtonClick');
  resolveXamlHandler(attrs.ActionButtonClick, instance)?.();
};

const onCloseButton = () => {
  executeCommand(props.CloseButtonCommand, props.CloseButtonCommandParameter);
  close();
};

const OnTeachingTipCloseButtonClick = () => onCloseButton();
const OnTeachingTipActionButtonClick = () => onAction();
provide(xamlScopeKey, {
  OnTeachingTipCloseButtonClick,
  OnTeachingTipActionButtonClick,
  TipTitle,
  TipSubtitle,
  ActionButtonContent,
  CloseButtonContent,
  ActionButtonStyleName,
  CloseButtonStyleName,
  CloseButtonLabel
});

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
  if (effectiveIsOpen.value) {
    void nextTick(() => updatePosition());
    requestAnimationFrame(() => { if (effectiveIsOpen.value) void updatePosition(); });
  }
});

watch(effectiveIsOpen, (open) => {
  if (open) {
    // Component refs are registered after the first render. Reposition once
    // more after Vue commits the button element so the tail anchors to it.
    void nextTick(() => updatePosition());
    requestAnimationFrame(() => { if (effectiveIsOpen.value) void updatePosition(); });
  }
});

watch(
  () => [
    props.PlacementMargin,
    props.PreferredPlacement,
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

const onDocumentPointerDown = (event: PointerEvent) => {
  if (!effectiveIsOpen.value || !IsLightDismissEnabled.value) return;
  const target = event.target;
  if (!(target instanceof Node)) return;
  if (tipRef.value?.contains(target) || targetElement()?.contains(target)) return;
  // Light-dismiss closes the tip without reporting a close-button click.
  setOpen(false);
};

onMounted(() => {
  observeTheme();
  window.addEventListener('resize', onViewportChanged);
  window.addEventListener('scroll', onViewportChanged, true);
  document.addEventListener('pointerdown', onDocumentPointerDown, true);
});

onBeforeUnmount(() => {
  themeObserver?.disconnect();
  window.removeEventListener('resize', onViewportChanged);
  window.removeEventListener('scroll', onViewportChanged, true);
  document.removeEventListener('pointerdown', onDocumentPointerDown, true);
});

defineExpose({ close, updatePosition });
</script>

<style>
.teaching-tip {
  position: fixed;
  z-index: var(--teaching-tip-z-index, var(--win-tip-z-index, 2147483646));
  width: max-content;
  min-width: min(var(--TeachingTipMinWidth, 320px), calc(100vw - 16px));
  max-width: min(var(--TeachingTipMaxWidth, 336px), calc(100vw - 16px));
  min-height: var(--TeachingTipMinHeight, 40px);
  max-height: min(var(--TeachingTipMaxHeight, 520px), calc(100vh - 16px));
  overflow: visible;
  display: flex;
  flex-direction: column;
  color: var(--TeachingTipForegroundBrush, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  --teaching-tip-background: var(--TeachingTipBackgroundBrush, var(--SolidBackgroundFillColorTertiaryBrush, #F9F9F9));
  --win-acrylic-fill: var(--teaching-tip-background);
  --teaching-tip-backdrop: none;
  --teaching-tip-border: var(--TeachingTipBorderBrush, var(--SurfaceStrokeColorDefaultBrush, var(--ControlStrokeColorDefaultBrush, var(--flyout-border))));
  isolation: isolate;
  background: var(--teaching-tip-background);
  border: 1px solid var(--teaching-tip-border);
  border-radius: var(--OverlayCornerRadius, 8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  -webkit-backdrop-filter: var(--teaching-tip-backdrop);
  backdrop-filter: var(--teaching-tip-backdrop);
}

.teaching-tip.is-light-dismiss {
  --teaching-tip-backdrop: var(--flyout-backdrop);
}

.teaching-tip-hero {
  /* HeroContentBorder is an Auto row in the WinUI template. */
  min-height: 0;
  overflow: hidden;
  flex: 0 0 auto;
  background: var(--teaching-tip-background);
  border-radius: var(--OverlayCornerRadius, 8px) var(--OverlayCornerRadius, 8px) 0 0;
}

.teaching-tip-hero .win-image-host {
  display: flex;
  width: 100%;
  max-width: 100%;
  height: 160px;
}

.teaching-tip-hero .win-image {
  width: 100%;
  max-width: 100%;
  height: 160px;
  object-fit: cover;
}

.teaching-tip.hero-placement-bottom .teaching-tip-hero {
  order: 3;
  border-radius: 0 0 var(--OverlayCornerRadius, 8px) var(--OverlayCornerRadius, 8px);
}

.teaching-tip.hero-placement-bottom .teaching-tip-main {
  order: 1;
}

.teaching-tip.hero-placement-bottom .teaching-tip-actions {
  order: 2;
}

.teaching-tip-main {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
}

.teaching-tip-icon {
  flex: 0 0 auto;
  width: 20px;
  color: var(--TeachingTipForegroundBrush, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  font-size: 16px;
  line-height: 20px;
  text-align: center;
}

.teaching-tip-text {
  min-width: 0;
  flex: 1;
}

.teaching-tip-main.has-alternate-close .teaching-tip-text {
  padding-right: 28px;
}

.teaching-tip-title {
  color: var(--TeachingTipTitleForegroundBrush, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.teaching-tip-subtitle,
.teaching-tip-content {
  margin-top: 0;
  color: var(--TeachingTipSubtitleForegroundBrush, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  font-size: 14px;
  line-height: 20px;
}

.teaching-tip-close {
  position: absolute;
  top: 0;
  right: 0;
}

.teaching-tip-actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  justify-content: stretch;
  gap: 0;
  padding: 0 12px 12px;
}

.teaching-tip-actions.both-buttons-visible {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: 0;
}

.teaching-tip-action-button,
.teaching-tip-close-button {
  width: 100%;
  margin-top: 12px;
}

.teaching-tip-actions.both-buttons-visible .teaching-tip-action-button {
  margin-right: 4px;
}

.teaching-tip-actions.both-buttons-visible .teaching-tip-close-button {
  margin-left: 4px;
}

.teaching-tip-tail {
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

.teaching-tip-tail polyline {
  fill: none;
}

.teaching-tip-tail polygon {
  stroke: none;
}

.teaching-tip.placement-bottom .teaching-tip-tail {
  top: -9px;
}

.teaching-tip.placement-bottom {
  transform-origin: var(--teaching-tip-tail-left, 50%) 0;
}

.teaching-tip.placement-top .teaching-tip-tail {
  bottom: -9px;
}

.teaching-tip.placement-top {
  transform-origin: var(--teaching-tip-tail-left, 50%) 100%;
}

.teaching-tip-enter-active {
  animation: teaching-tip-enter 167ms cubic-bezier(0, 0, 0, 1) both;
}

.teaching-tip-leave-active {
  animation: teaching-tip-exit 167ms cubic-bezier(0.7, 0, 1, 0.5) both;
}

@keyframes teaching-tip-enter {
  from {
    opacity: 0;
    transform: scale(0.08);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes teaching-tip-exit {
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
