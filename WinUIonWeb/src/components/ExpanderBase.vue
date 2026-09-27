<template>
  <div
    class="win-expander"
    :class="{
      'is-expanded': isExpandedState,
      'is-disabled': !isEnabled,
      'expand-up': resolvedExpandDirection === 'Up',
      'has-header-content': hasHeaderContent,
      'has-header-controls': hasHeaderControls
    }"
    :style="rootStyle">
    <div
      ref="headerRef"
      class="win-expander-header"
      @click="onHeaderClick"
      @keydown="onHeaderKeyDown"
      @pointerenter="AnimatedGlyphInput.PointerEntered"
      @pointerleave="AnimatedGlyphInput.PointerExited"
      @pointerdown="AnimatedGlyphInput.PointerPressed"
      @pointerup="AnimatedGlyphInput.PointerReleased"
      @pointercancel="AnimatedGlyphInput.PointerExited"
      @lostpointercapture="AnimatedGlyphInput.PointerReleased"
      @keyup="AnimatedGlyphInput.KeyUp"
      @blur="AnimatedGlyphInput.LostFocus"
      :aria-expanded="isExpandedState"
      :aria-disabled="!isEnabled"
      role="button"
      :tabindex="isEnabled ? 0 : -1">
      <div class="win-expander-header-main">
        <span v-if="hasHeaderIcon" class="win-expander-header-icon icon" aria-hidden="true">
          <slot name="HeaderIcon">
            <span v-if="isHeaderIconMarkup" v-html="resolvedHeaderIcon"></span>
            <template v-else>{{ resolvedHeaderIcon }}</template>
          </slot>
        </span>
        <div class="win-expander-header-content">
          <slot name="Header">
            <TextBlock
              v-if="resolvedHeader"
              class="win-expander-header-text"
              :Text="resolvedHeader"
              FontSize="14"
              LineHeight="20"
              TextWrapping="Wrap" />
          </slot>
          <slot name="Description">
            <TextBlock
              v-if="resolvedDescription"
              class="win-expander-description"
              :Text="resolvedDescription"
              FontSize="var(--SettingsCardDescriptionFontSize, 12px)"
              LineHeight="16"
              Foreground="var(--TextFillColorSecondaryBrush, var(--text-secondary))"
              TextWrapping="Wrap" />
          </slot>
        </div>
      </div>
      <div v-if="hasHeaderControls" class="win-expander-header-controls">
        <slot name="HeaderControls"></slot>
      </div>
      <span class="win-expander-chevron" aria-hidden="true">
        <AnimatedIcon class="win-expander-arrow" x:Name="ExpandCollapseChevron" Width="12" Height="12" Foreground="{ThemeResource ExpanderChevronForeground}" HorizontalAlignment="Center" VerticalAlignment="Center" AutomationProperties.AccessibilityView="Raw">
          <AnimatedIcon.Source><animatedvisuals:AnimatedChevronUpDownSmallVisualSource /></AnimatedIcon.Source>
          <AnimatedIcon.FallbackIconSource><FontIconSource Glyph="&#xE70D;" FontFamily="{ThemeResource SymbolThemeFontFamily}" FontSize="12" IsTextScaleFactorEnabled="False" /></AnimatedIcon.FallbackIconSource>
        </AnimatedIcon>
      </span>
    </div>
    <div class="win-expander-grid" :style="{ display: contentVisible ? '' : 'none' }" :aria-hidden="!isExpandedState" :inert="!isExpandedState">
      <div class="win-expander-inner">
        <div ref="contentRef" class="win-expander-content" :style="contentStyle"><slot>{{ resolvedContent }}</slot></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue';
import AnimatedIcon from './AnimatedIcon.vue';
import { useAnimatedIconInput } from './animatedIconInput';
import TextBlock from './TextBlock.vue';
import { resolveXamlValue, updateXamlBinding } from './xamlRuntime';
import { resolveBrushStyle } from './AcrylicBrush';
import { cssColor, isSolidColorBrush } from './brushCore';

const props = defineProps({
  Header: { type: [String, Number], default: '' },
  Content: { type: [String, Number], default: '' },
  Description: { type: [String, Number], default: '' },
  HeaderIcon: { type: String, default: '' },
  HeaderTemplate: { type: [Object, Function, String], default: null },
  HeaderTemplateSelector: { type: [Object, Function, String], default: null },
  IsExpanded: { type: [Boolean, String], default: false },
  ExpandDirection: { type: [String, Number], default: 'Down' },
  Padding: { type: [String, Number], default: '16' },
  Background: { type: [String, Object], default: '{ThemeResource ExpanderContentBackground}' },
  BorderBrush: { type: [String, Object], default: '{ThemeResource ExpanderContentBorderBrush}' },
  BorderThickness: { type: [String, Number], default: '' },
  CornerRadius: { type: [String, Number], default: '{ThemeResource ControlCornerRadius}' },
  IsEnabled: { type: [Boolean, String], default: true },
  HorizontalContentAlignment: { type: String, default: 'Stretch' },
  VerticalContentAlignment: { type: String, default: 'Stretch' },
  Width: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }
});

const emit = defineEmits(['update:IsExpanded', 'Expanding', 'Collapsed']);

const slots = useSlots();
const instance = getCurrentInstance();
const xamlBoolean = value => value === true || String(value).toLowerCase() === 'true';
const resolvedIsExpanded = computed(() => xamlBoolean(resolveXamlValue(props.IsExpanded, instance)));
const isEnabled = computed(() => xamlBoolean(resolveXamlValue(props.IsEnabled, instance)));
const resolvedExpandDirection = computed(() => resolveXamlValue(props.ExpandDirection, instance) || 'Down');
const resolvedPadding = computed(() => resolveXamlValue(props.Padding, instance));
const resolvedHorizontalContentAlignment = computed(() => resolveXamlValue(props.HorizontalContentAlignment, instance));
const resolvedVerticalContentAlignment = computed(() => resolveXamlValue(props.VerticalContentAlignment, instance));
const isExpandedState = ref(resolvedIsExpanded.value);
const contentVisible = ref(isExpandedState.value);
const contentRef = ref(null);
let contentAnimation;
let collapseTimer;
let transitionVersion = 0;
const animateContent = async (expanded) => {
  const version = ++transitionVersion;
  clearTimeout(collapseTimer);
  const currentTransform = contentRef.value && contentVisible.value ? getComputedStyle(contentRef.value).transform : null;
  contentAnimation?.cancel();
  contentVisible.value = true;
  await nextTick();
  if (version !== transitionVersion || !contentRef.value) return;
  const content = contentRef.value;
  const distance = content.getBoundingClientRect().height * (resolvedExpandDirection.value === 'Up' ? 1 : -1);
  const shifted = `translateY(${distance}px)`;
  const from = currentTransform && currentTransform !== 'none' ? currentTransform : expanded ? shifted : 'translateY(0px)';
  const duration = expanded ? 333 : 167;
  contentAnimation = content.animate([{ transform: from }, { transform: expanded ? 'translateY(0px)' : shifted }], {
    duration,
    easing: expanded ? 'cubic-bezier(0, 0, 0, 1)' : 'cubic-bezier(1, 1, 0, 1)',
    fill: 'forwards'
  });
  if (expanded) contentAnimation.onfinish = () => { if (version === transitionVersion) contentAnimation?.cancel(); };
  else collapseTimer = setTimeout(() => {
    if (version !== transitionVersion) return;
    contentVisible.value = false;
    contentAnimation?.cancel();
  }, resolvedExpandDirection.value === 'Up' ? 200 : 167);
};
onBeforeUnmount(() => { transitionVersion += 1; clearTimeout(collapseTimer); contentAnimation?.cancel(); });
const headerRef = ref(null);
const AnimatedGlyphInput = useAnimatedIconInput(false, state => {
  const isOn = isExpandedState.value !== (resolvedExpandDirection.value === 'Up');
  return `${state === 'Disabled' ? 'Normal' : state}${isOn ? 'On' : 'Off'}`;
});
onMounted(() => AnimatedGlyphInput.Attach(headerRef.value));
watch([isExpandedState, resolvedExpandDirection, isEnabled], AnimatedGlyphInput.Refresh, { flush: 'post' });
watch(isEnabled, enabled => { if (!enabled) AnimatedGlyphInput.Reset(); });
const resolvedHeader = computed(() => resolveXamlValue(props.Header, instance));
const resolvedContent = computed(() => resolveXamlValue(props.Content, instance));
const resolvedDescription = computed(() => resolveXamlValue(props.Description, instance));
const resolvedHeaderIcon = computed(() => resolveXamlValue(props.HeaderIcon, instance));
const hasHeaderIcon = computed(() => Boolean(resolvedHeaderIcon.value) || Boolean(slots.HeaderIcon));
const hasHeaderControls = computed(() => Boolean(slots.HeaderControls));
const hasHeaderContent = computed(() => (
  Boolean(resolvedHeader.value)
  || Boolean(resolvedDescription.value)
  || hasHeaderIcon.value
  || Boolean(slots.Header)
  || Boolean(slots.Description)
  || hasHeaderControls.value
));
const isHeaderIconMarkup = computed(() => String(resolvedHeaderIcon.value || '').trim().startsWith('<'));
const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) {
    return `${Number(value.trim())}px`;
  }
  return typeof value === 'number' ? `${value}px` : value;
};

const expanderHeaderHeight = (value) => {
  const length = cssLength(value);
  if (!length || length === 'auto') return '';

  const numericValue = typeof value === 'number'
    ? value
    : (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))
      ? Number(value.trim())
      : null);

  return numericValue === null
    ? `calc(${length} - 2px)`
    : `${Math.max(numericValue - 2, 0)}px`;
};

const xamlThickness = (value) => {
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

const flexAlignment = (value) => ({
  Left: 'flex-start',
  Center: 'center',
  Right: 'flex-end',
  Stretch: 'stretch'
}[value] ?? 'stretch');

const flexDistribution = (value) => ({
  Top: 'flex-start',
  Center: 'center',
  Bottom: 'flex-end',
  Stretch: 'flex-start'
}[value] ?? 'flex-start');

const selfAlignment = (value) => ({
  Top: 'flex-start',
  Center: 'center',
  Bottom: 'flex-end',
  Stretch: 'stretch'
}[value] ?? 'stretch');

const justifySelfAlignment = (value) => ({
  Left: 'start',
  Center: 'center',
  Right: 'end',
  Stretch: 'stretch'
}[value] ?? 'stretch');

const contentStyle = computed(() => ({
  ...resolveBrushStyle(props.Background, instance),
  borderColor: brushColor(resolveXamlValue(props.BorderBrush, instance)),
  ...(props.BorderThickness === '' ? {} : { borderWidth: xamlThickness(resolveXamlValue(props.BorderThickness, instance)) }),
  padding: xamlThickness(resolvedPadding.value),
  alignItems: flexAlignment(resolvedHorizontalContentAlignment.value),
  justifyContent: flexDistribution(resolvedVerticalContentAlignment.value)
}));

const brushColor = brush => isSolidColorBrush(brush)
  ? `color-mix(in srgb, ${cssColor(brush.Color)} ${brush.Opacity * 100}%, transparent)`
  : brush === null || brush === undefined ? undefined : cssColor(brush);

const rootStyle = computed(() => {
  const style = {};
  const radius = String(resolveXamlValue(props.CornerRadius, instance) ?? '4').split(',').map(value => cssLength(value.trim()));
  const corners = radius.length === 4 ? radius : [radius[0], radius[0], radius[0], radius[0]];
  style['--win-expander-corner-radius'] = corners.join(' ');
  style['--win-expander-top-corner-radius'] = `${corners[0]} ${corners[1]} 0 0`;
  style['--win-expander-bottom-corner-radius'] = `0 0 ${corners[2]} ${corners[3]}`;
  if (props.Height !== '') {
    const height = cssLength(props.Height);
    if (height) {
      style.minHeight = height;
      const headerHeight = expanderHeaderHeight(props.Height);
      if (headerHeight) style['--win-expander-header-height'] = headerHeight;
    }
  }
  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.MinWidth !== '') style.minWidth = cssLength(props.MinWidth);
  if (props.MaxWidth !== '') style.maxWidth = cssLength(props.MaxWidth);
  if (props.HorizontalAlignment) style.justifySelf = justifySelfAlignment(props.HorizontalAlignment);
  if (props.VerticalAlignment) style.alignSelf = selfAlignment(props.VerticalAlignment);
  return style;
});

watch(resolvedIsExpanded, (newVal) => {
  isExpandedState.value = newVal;
});
watch(isExpandedState, (expanded) => {
  // XAML event names start with a capital. Vue's emit case diagnostic maps
  // both Expanding and expanding to onExpanding and warns even for an SFC.
  const listeners = instance?.vnode.props?.[expanded ? 'onExpanding' : 'onCollapsed'];
  for (const callback of Array.isArray(listeners) ? listeners : [listeners]) {
    if (typeof callback === 'function') callback(instance?.exposeProxy ?? instance?.proxy, null);
  }
  animateContent(expanded);
});
watch(resolvedExpandDirection, () => { if (contentVisible.value) animateContent(isExpandedState.value); });

const interactiveHeaderSelector = [
  'button',
  'a[href]',
  'input',
  'select',
  'textarea',
  'summary',
  '[contenteditable=""]',
  '[contenteditable="true"]',
  '[role="button"]',
  '[role="checkbox"]',
  '[role="link"]',
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '[role="option"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="tab"]',
  '[role="textbox"]',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

const isInteractiveHeaderChild = (event) => {
  const target = event.target;
  const currentTarget = event.currentTarget;
  if (!target?.closest || !currentTarget?.contains) return false;

  const interactiveElement = target.closest(interactiveHeaderSelector);
  return Boolean(interactiveElement && interactiveElement !== currentTarget && currentTarget.contains(interactiveElement));
};

const onHeaderClick = (event) => {
  if (!isEnabled.value || event.defaultPrevented || isInteractiveHeaderChild(event)) return;
  toggleExpanded();
};

const onHeaderKeyDown = (event) => {
  if (!isEnabled.value || event.defaultPrevented || isInteractiveHeaderChild(event)) return;
  AnimatedGlyphInput.KeyDown(event);
  if (event.repeat || event.key !== 'Enter' && event.key !== ' ') return;

  event.preventDefault();
  toggleExpanded();
};

const setIsExpanded = (value) => {
  const nextValue = xamlBoolean(value);
  if (nextValue === isExpandedState.value) return;
  isExpandedState.value = nextValue;
  emit('update:IsExpanded', nextValue);
  updateXamlBinding(props.IsExpanded, nextValue, instance);
};
const toggleExpanded = () => { if (isEnabled.value) setIsExpanded(!isExpandedState.value); };
defineExpose({
  get IsExpanded() { return isExpandedState.value; },
  set IsExpanded(value) { setIsExpanded(value); }
});
</script>

<style scoped>
.win-expander {
  min-width: 0;
  border-radius: var(--win-expander-corner-radius, 4px);
}

.win-expander-header {
  position: relative;
  isolation: isolate;
  width: 100%;
  height: var(--win-expander-header-height, auto);
  min-height: 48px;
  padding: 0 0 0 16px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0;
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--ExpanderHeaderBorderBrush, var(--CardStrokeColorDefaultBrush, var(--card-stroke)));
  border-radius: var(--win-expander-corner-radius, 4px);
  color: var(--ExpanderHeaderForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  font-size: 14px;
  text-align: left;
}

.win-expander-header::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
  background: var(--ExpanderHeaderBackground, var(--CardBackgroundFillColorDefaultBrush, var(--card-bg)));
}

.win-expander-header-main {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0;
  flex: 1;
}

.win-expander-header-icon {
  width: 20px;
  height: 20px;
  max-width: 20px;
  max-height: 20px;
  margin: 0 20px 0 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--TextFillColorSecondaryBrush, var(--text-secondary));
  font-size: 20px;
  line-height: 20px;
  flex-shrink: 0;
}

.win-expander-header-content {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.win-expander-header-content :slotted(*) {
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;
}

.win-expander-header-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  min-width: 0;
}

.win-expander-header-text {
  color: inherit;
  line-height: 20px;
}

.win-expander-description {
  color: var(--TextFillColorSecondaryBrush, var(--text-secondary));
  font-size: var(--SettingsCardDescriptionFontSize, 12px);
  line-height: 16px;
  margin-top: 0;
}

.win-expander.is-expanded .win-expander-header {
  border-radius: var(--win-expander-top-corner-radius, 4px 4px 0 0);
}

.win-expander.expand-up {
  display: flex;
  flex-direction: column-reverse;
}

.win-expander.expand-up.is-expanded .win-expander-header {
  border-radius: var(--win-expander-bottom-corner-radius, 0 0 4px 4px);
}

.win-expander-chevron {
  width: 32px;
  height: 32px;
  margin: 0 8px 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--ControlCornerRadius, 4px);
  background: var(--ExpanderChevronBackground, transparent);
  font-size: 12px;
  flex-shrink: 0;
}

.win-expander:not(.is-disabled) .win-expander-header:hover {
  border-color: var(--ExpanderHeaderBorderPointerOverBrush, var(--CardStrokeColorDefaultBrush, var(--card-stroke)));
  color: var(--ExpanderHeaderForegroundPointerOver, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  --ExpanderChevronForeground: var(--ExpanderChevronPointerOverForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
}

.win-expander:not(.is-disabled) .win-expander-header:hover .win-expander-chevron {
  background: var(--ExpanderChevronPointerOverBackground, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary)));
}

.win-expander:not(.is-disabled) .win-expander-header:active {
  border-color: var(--ExpanderHeaderBorderPressedBrush, var(--CardStrokeColorDefaultBrush, var(--card-stroke)));
  color: var(--ExpanderHeaderForegroundPressed, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  --ExpanderChevronForeground: var(--ExpanderChevronPressedForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
}

.win-expander:not(.is-disabled) .win-expander-header:active .win-expander-chevron {
  background: var(--ExpanderChevronPressedBackground, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary)));
}

.win-expander.is-disabled .win-expander-header {
  cursor: default;
  border-color: var(--ExpanderHeaderDisabledBorderBrush, var(--CardStrokeColorDefaultBrush, var(--card-stroke)));
  color: var(--ExpanderHeaderDisabledForeground, var(--TextFillColorDisabledBrush, var(--text-disabled)));
  --ExpanderChevronForeground: var(--ExpanderHeaderDisabledForeground, var(--TextFillColorDisabledBrush, var(--text-disabled)));
}

.win-expander.is-disabled .win-expander-header :deep(.win-text-block) {
  color: var(--ExpanderHeaderDisabledForeground, var(--TextFillColorDisabledBrush, var(--text-disabled)));
}

.win-expander-header:focus-visible {
  outline: 2px solid var(--FocusStrokeColorOuterBrush, var(--text-primary));
  outline-offset: -3px;
}

.win-expander-arrow {
  display: block;
  pointer-events: none;
}

.win-expander-grid {
  min-width: 0;
}

.win-expander-inner {
  overflow: hidden;
}

.win-expander-content {
  position: relative;
  isolation: isolate;
  min-height: 48px;
  min-width: 0;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-direction: column;
  background: transparent;
  border: 1px solid var(--ExpanderContentBorderBrush, var(--CardStrokeColorDefaultBrush, var(--card-stroke)));
  border-top-width: 0;
  border-radius: var(--win-expander-bottom-corner-radius, 0 0 4px 4px);
}

.win-expander.expand-up .win-expander-content {
  border-top-width: 1px;
  border-bottom-width: 0;
  border-radius: var(--win-expander-top-corner-radius, 4px 4px 0 0);
}

@media (max-width: 640px) {
  .win-expander.has-header-content.has-header-controls .win-expander-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    column-gap: 16px;
    row-gap: 8px;
    height: auto;
    min-height: var(--win-expander-header-height, 48px);
    padding-top: 16px;
    padding-bottom: 16px;
    align-items: center;
  }

  .win-expander.has-header-content.has-header-controls .win-expander-header-main {
    grid-column: 1;
    grid-row: 1;
    align-items: flex-start;
  }

  .win-expander.has-header-controls .win-expander-header-controls {
    grid-column: 1;
    grid-row: 2;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .win-expander.has-header-content.has-header-controls .win-expander-chevron {
    grid-column: 2;
    grid-row: 1;
    align-self: center;
  }
}
</style>
