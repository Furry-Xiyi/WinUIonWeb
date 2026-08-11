<template>
  <section
    v-if="isVisible"
    ref="rootRef"
    v-bind="infoBarAttrs"
    class="win-infobar"
    :class="[severityClass, contentStateClass, attrs.class]"
    :style="infoBarStyle"
    role="alert"
    :aria-live="Severity === 'Error' ? 'assertive' : 'polite'">
    <div ref="layoutRef" class="win-infobar-layout">
      <div
        v-if="showStandardIcon"
        class="win-infobar-standard-icon-area"
        aria-hidden="true">
        <WinTextBlock
          class="win-infobar-standard-icon"
          :Text="severityIconGlyph"
          :Foreground="standardIconForeground"
          FontFamily="WinUIOnWebIcons"
          FontSize="16"
          LineHeight="16" />
      </div>

      <div
        v-else-if="showUserIcon"
        class="win-infobar-user-icon-box"
        aria-hidden="true">
        <WinTextBlock
          class="win-infobar-user-icon"
          :Text="userIconGlyph"
          :FontFamily="userIconFontFamily"
          :Foreground="userIconForeground"
          FontSize="16"
          LineHeight="16" />
      </div>

      <div
        ref="panelRef"
        class="win-infobar-panel"
        :class="panelStateClass">
        <WinTextBlock
          v-if="Title"
          class="win-infobar-title"
          :Text="Title"
          :Foreground="bannerForeground"
          TextWrapping="WrapWholeWords"
          FontSize="14"
          FontWeight="600"
          LineHeight="20" />
        <WinTextBlock
          v-if="Message"
          class="win-infobar-message"
          :Text="Message"
          :Foreground="bannerForeground"
          TextWrapping="WrapWholeWords"
          FontSize="14"
          FontWeight="400"
          LineHeight="20" />
        <div
          ref="actionRef"
          class="win-infobar-action">
          <slot name="ActionButton">
            <component
              :is="ActionButton"
              v-if="ActionButton" />
          </slot>
        </div>

        <div
          ref="measureLayerRef"
          class="win-infobar-measure-layer"
          aria-hidden="true">
          <div
            ref="actionMeasureRef"
            class="win-infobar-action-measure" />
        </div>
      </div>

      <div class="win-infobar-content-area">
        <slot>
          <component
            :is="ContentTemplate"
            v-if="ContentTemplate"
            :Content="Content" />
          <WinTextBlock
            v-else-if="Content !== null && Content !== undefined"
            :Text="Content"
            TextWrapping="WrapWholeWords" />
        </slot>
      </div>

      <WinButton
        v-if="IsClosable"
        class="win-infobar-close-button"
        :class="{ 'uses-default-close-button-style': usesDefaultCloseButtonStyle }"
        :Style="CloseButtonStyle"
        :aria-label="t('control.infobar.close-button-name')"
        v-bind="{ 'tooltipservice.tooltip': t('control.infobar.close-button-tooltip') }"
        @Click="onCloseButtonClick">
        <WinTextBlock
          class="win-infobar-close-glyph"
          Text="&#xE711;"
          FontFamily="WinUIOnWebIcons"
          FontSize="12"
          LineHeight="16" />
      </WinButton>
    </div>
  </section>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  useAttrs,
  watch
} from 'vue';
import WinButton from './WinButton.vue';
import WinTextBlock from './WinTextBlock.vue';
import { useI18n } from './i18n/index';

defineOptions({
  inheritAttrs: false
});

const { t } = useI18n();
const attrs = useAttrs();

const props = defineProps({
  IsOpen: { type: Boolean, default: false },
  Title: { type: String, default: '' },
  Message: { type: String, default: '' },
  Severity: {
    type: String,
    default: 'Informational',
    validator: (value) => ['Informational', 'Success', 'Warning', 'Error'].includes(value)
  },
  IconSource: { type: Object, default: null },
  IsIconVisible: { type: Boolean, default: true },
  IsClosable: { type: Boolean, default: true },
  CloseButtonStyle: { type: String, default: '{StaticResource InfoBarCloseButtonStyle}' },
  CloseButtonCommand: { type: [Function, Object], default: null },
  CloseButtonCommandParameter: { type: null, default: null },
  ActionButton: { type: [Object, Function], default: null },
  Content: { type: null, default: null },
  ContentTemplate: { type: [Object, Function], default: null },
  Background: { type: String, default: '' },
  Foreground: { type: String, default: '' },
  BorderBrush: { type: String, default: '' },
  BorderThickness: { type: [String, Number], default: '' },
  CornerRadius: { type: [String, Number], default: '' },
  Width: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' }
});

const emit = defineEmits([
  'update:IsOpen',
  'CloseButtonClick',
  'Closing',
  'Closed',
  'Opened'
]);

const rootRef = ref(null);
const layoutRef = ref(null);
const panelRef = ref(null);
const actionRef = ref(null);
const measureLayerRef = ref(null);
const actionMeasureRef = ref(null);
const isVisible = ref(props.IsOpen);
const isPanelVertical = ref(false);
const hasRenderedActionButton = ref(Boolean(props.ActionButton));

const showStandardIcon = computed(() => props.IsIconVisible && !props.IconSource);
const showUserIcon = computed(() => props.IsIconVisible && Boolean(props.IconSource));
const usesDefaultCloseButtonStyle = computed(() => (
  props.CloseButtonStyle === '{StaticResource InfoBarCloseButtonStyle}'
));

const severityGlyphs = {
  Informational: '\uF167',
  Success: '\uEC61',
  Warning: '\uE814',
  Error: '\uEB90'
};
const symbolGlyphs = {
  Accept: '\uE8FB',
  Cancel: '\uE711',
  Important: '\uE7BA',
  Sync: '\uE895',
  Warning: '\uF13C',
  Info: '\uF13F'
};

const decodeGlyph = (value) => {
  const glyph = String(value ?? '');
  if (glyph.startsWith('\\u')) return String.fromCodePoint(Number.parseInt(glyph.slice(2), 16));
  if (glyph.startsWith('&#x') && glyph.endsWith(';')) return String.fromCodePoint(Number.parseInt(glyph.slice(3, -1), 16));
  if (glyph.startsWith('0x')) return String.fromCodePoint(Number.parseInt(glyph, 16));
  if (/^[0-9A-Fa-f]{4,5}$/.test(glyph)) return String.fromCodePoint(Number.parseInt(glyph, 16));
  return glyph;
};

const severityIconGlyph = computed(() => severityGlyphs[props.Severity] ?? severityGlyphs.Informational);
const standardIconForeground = computed(() => 'var(--InfoBarSeverityIconBackground)');
const userIconGlyph = computed(() => {
  if (props.IconSource?.Glyph !== undefined) return decodeGlyph(props.IconSource.Glyph);
  if (props.IconSource?.Symbol !== undefined) {
    return symbolGlyphs[props.IconSource.Symbol] ?? String(props.IconSource.Symbol);
  }
  return '';
});
const userIconFontFamily = computed(() => props.IconSource?.FontFamily || 'WinUIOnWebIcons');
const userIconForeground = computed(() => props.IconSource?.Foreground || '');
const bannerForeground = computed(() => (
  props.Foreground || 'var(--InfoBarTitleForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)))'
));

const severityClass = computed(() => `win-infobar-${props.Severity.toLowerCase()}`);
const contentStateClass = computed(() => ({
  'banner-content': props.Title || props.Message || hasRenderedActionButton.value,
  'no-banner-content': !props.Title && !props.Message && !hasRenderedActionButton.value
}));
const panelStateClass = computed(() => ({
  'is-vertical': isPanelVertical.value,
  'has-title': Boolean(props.Title),
  'has-message': Boolean(props.Message),
  'has-action': hasRenderedActionButton.value
}));

const infoBarAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) {
    return `${Number(value.trim())}px`;
  }
  return typeof value === 'number' ? `${value}px` : value;
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

const xamlCornerRadius = (value) => {
  const parts = String(value).split(',').map((part) => cssLength(part.trim()));
  return parts.length === 4 ? parts.join(' ') : cssLength(value);
};

const infoBarStyle = computed(() => {
  const style = {};
  if (props.Background) style['--InfoBarBackground'] = props.Background;
  if (props.Foreground) style['--InfoBarForeground'] = props.Foreground;
  if (props.BorderBrush) style['--InfoBarBorderBrush'] = props.BorderBrush;
  if (props.BorderThickness !== '') style['--InfoBarBorderThickness'] = xamlThickness(props.BorderThickness);
  if (props.CornerRadius !== '') style['--InfoBarCornerRadius'] = xamlCornerRadius(props.CornerRadius);
  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.MinWidth !== '') style.minWidth = cssLength(props.MinWidth);
  if (props.MaxWidth !== '') style.maxWidth = cssLength(props.MaxWidth);
  if (props.Margin !== '') style.margin = xamlThickness(props.Margin);
  return [attrs.style, style];
});

const elementFromRef = (value) => value?.$el ?? value ?? null;
const titleElement = () => panelRef.value?.querySelector(':scope > .win-infobar-title') ?? null;
const messageElement = () => panelRef.value?.querySelector(':scope > .win-infobar-message') ?? null;
const measuredSize = (value) => {
  const element = elementFromRef(value);
  if (!element) return { Width: 0, Height: 0 };
  const bounds = element.getBoundingClientRect();
  return { Width: bounds.width, Height: bounds.height };
};

const visibleActionNodes = () => {
  if (!actionRef.value) return [];
  return Array.from(actionRef.value.childNodes).filter((node) => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
    if (node.nodeType !== Node.ELEMENT_NODE) return false;
    return !node.hidden && window.getComputedStyle(node).display !== 'none';
  });
};

const removeCloneIds = (node) => {
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  node.removeAttribute('id');
  node.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
};

const syncActionMeasurement = (nodes) => {
  if (!actionMeasureRef.value) return;
  const clones = nodes.map((node) => {
    const clone = node.cloneNode(true);
    removeCloneIds(clone);
    return clone;
  });
  actionMeasureRef.value.replaceChildren(...clones);
};

let resizeObserver = null;
let actionObserver = null;
let measureFrame = 0;

const updateRenderedActionButton = () => {
  const nodes = visibleActionNodes();
  const nextValue = Boolean(props.ActionButton) || nodes.length > 0;
  if (hasRenderedActionButton.value !== nextValue) {
    hasRenderedActionButton.value = nextValue;
  }
  syncActionMeasurement(nodes);
};

const naturalTextSize = (source, text) => {
  const element = elementFromRef(source);
  if (!element) return { Width: 0, Height: 0 };

  const clone = element.cloneNode(true);
  Object.assign(clone.style, {
    position: 'fixed',
    left: '-10000px',
    top: '0',
    width: 'max-content',
    minWidth: '0',
    maxWidth: 'none',
    margin: '0',
    whiteSpace: 'pre',
    visibility: 'hidden',
    pointerEvents: 'none'
  });
  clone.textContent = String(text ?? '');
  document.body.appendChild(clone);
  const size = measuredSize(clone);
  clone.remove();
  return size;
};

const measurePanelOrientation = () => {
  measureFrame = 0;
  if (!isVisible.value || !panelRef.value) return;

  updateRenderedActionButton();

  const measureLayer = measureLayerRef.value;
  if (measureLayer) {
    measureLayer.style.display = 'block';
  }

  try {
    const availableWidth = panelRef.value.getBoundingClientRect().width;
    if (availableWidth <= 0) return;

    const items = [];
    if (props.Title) {
      items.push({
        ...naturalTextSize(titleElement(), props.Title),
        HorizontalMarginLeft: 0,
        HorizontalMarginTop: 14
      });
    }
    if (props.Message) {
      items.push({
        ...naturalTextSize(messageElement(), props.Message),
        HorizontalMarginLeft: 12,
        HorizontalMarginTop: 14
      });
    }
    if (hasRenderedActionButton.value) {
      items.push({
        ...measuredSize(actionMeasureRef.value),
        HorizontalMarginLeft: 16,
        HorizontalMarginTop: 8
      });
    }

    const visibleItems = items.filter((item) => item.Width > 0 && item.Height > 0);
    const totalWidth = visibleItems.reduce((width, item, index) => (
      width + item.Width + (index > 0 ? item.HorizontalMarginLeft : 0)
    ), 0);
    const tallestHorizontalItem = visibleItems.reduce((height, item) => (
      Math.max(height, item.Height + item.HorizontalMarginTop)
    ), 0);

    isPanelVertical.value = (
      visibleItems.length === 1 ||
      totalWidth > availableWidth ||
      tallestHorizontalItem > 48
    );
  } finally {
    if (measureLayer) measureLayer.style.display = 'none';
  }
};

const schedulePanelMeasure = () => {
  if (measureFrame) cancelAnimationFrame(measureFrame);
  measureFrame = requestAnimationFrame(measurePanelOrientation);
};

const observeLayout = () => {
  resizeObserver?.disconnect();
  resizeObserver = new ResizeObserver(schedulePanelMeasure);
  if (rootRef.value) resizeObserver.observe(rootRef.value);
  if (layoutRef.value) resizeObserver.observe(layoutRef.value);
  if (panelRef.value) resizeObserver.observe(panelRef.value);
  if (actionRef.value) resizeObserver.observe(actionRef.value);

  actionObserver?.disconnect();
  actionObserver = new MutationObserver(() => nextTick(schedulePanelMeasure));
  if (actionRef.value) {
    actionObserver.observe(actionRef.value, {
      attributes: true,
      attributeFilter: ['class', 'hidden', 'style'],
      childList: true,
      subtree: true
    });
  }

  schedulePanelMeasure();
};

const open = () => {
  if (isVisible.value) return;
  isVisible.value = true;
  emit('Opened', {});
  nextTick(observeLayout);
};

const close = (reason, shouldUpdateModel) => {
  if (!isVisible.value) return;

  const args = { Reason: reason, Cancel: false };
  emit('Closing', args);

  if (args.Cancel) {
    if (!props.IsOpen) emit('update:IsOpen', true);
    return;
  }

  if (shouldUpdateModel) emit('update:IsOpen', false);
  isVisible.value = false;
  resizeObserver?.disconnect();
  actionObserver?.disconnect();
  emit('Closed', { Reason: reason });
};

const onCloseButtonClick = () => {
  emit('CloseButtonClick', null);
  if (typeof props.CloseButtonCommand === 'function') {
    props.CloseButtonCommand(props.CloseButtonCommandParameter);
  } else {
    props.CloseButtonCommand?.Execute?.(props.CloseButtonCommandParameter);
  }
  close('CloseButton', true);
};

watch(() => props.IsOpen, (value) => {
  if (value) {
    open();
  } else {
    close('Programmatic', false);
  }
});

watch(
  () => [
    props.Title,
    props.Message,
    props.IsClosable,
    props.IsIconVisible,
    props.IconSource,
    props.ActionButton
  ],
  () => nextTick(schedulePanelMeasure),
  { deep: true }
);

onMounted(() => {
  if (isVisible.value) observeLayout();
  document.fonts?.ready.then(schedulePanelMeasure);
});

onUpdated(() => {
  updateRenderedActionButton();
  schedulePanelMeasure();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  actionObserver?.disconnect();
  if (measureFrame) cancelAnimationFrame(measureFrame);
});
</script>

<style scoped>
.win-infobar {
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  color: var(--InfoBarForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  background: var(--InfoBarSeverityBackgroundBrush, var(--InfoBarInformationalSeverityBackgroundBrush));
  border-color: var(--InfoBarBorderBrush, var(--CardStrokeColorDefaultBrush, var(--card-stroke)));
  border-style: solid;
  border-width: var(--InfoBarBorderThickness, 1px);
  border-radius: var(--InfoBarCornerRadius, var(--ControlCornerRadius, 4px));
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  --InfoBarInformationalSeverityBackgroundBrush: var(--SystemFillColorAttentionBackgroundBrush, light-dark(rgb(246 246 246 / 50%), rgb(255 255 255 / 3.14%)));
  --InfoBarSuccessSeverityBackgroundBrush: var(--SystemFillColorSuccessBackgroundBrush, light-dark(#dff6dd, #393d1b));
  --InfoBarWarningSeverityBackgroundBrush: var(--SystemFillColorCautionBackgroundBrush, light-dark(#fff4ce, #433519));
  --InfoBarErrorSeverityBackgroundBrush: var(--SystemFillColorCriticalBackgroundBrush, light-dark(#fde7e9, #442726));
  --InfoBarInformationalSeverityIconBackground: var(--SystemFillColorAttentionBrush, var(--AccentFillColorDefaultBrush, var(--accent-base)));
  --InfoBarSuccessSeverityIconBackground: var(--SystemFillColorSuccessBrush, light-dark(#0f7b0f, #6ccb5f));
  --InfoBarWarningSeverityIconBackground: var(--SystemFillColorCautionBrush, light-dark(#9d5d00, #fce100));
  --InfoBarErrorSeverityIconBackground: var(--SystemFillColorCriticalBrush, light-dark(#c42b1c, #ff99a4));
  --InfoBarHyperlinkButtonForeground: var(--AccentTextFillColorPrimaryBrush, var(--accent-text-fill-color-primary));
}

.win-infobar-layout {
  box-sizing: border-box;
  min-height: 48px;
  padding: 0 0 0 16px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  grid-template-rows: auto auto;
  align-items: start;
  background: var(--InfoBarBackground, transparent);
  border-radius: inherit;
}

.win-infobar-standard-icon-area,
.win-infobar-user-icon-box {
  grid-column: 1;
  grid-row: 1;
  box-sizing: content-box;
  width: 16px;
  height: 16px;
  margin: 16px 14px 16px 0;
  align-self: start;
}

.win-infobar-standard-icon-area {
  display: grid;
  place-items: center;
}

.win-infobar-standard-icon-area :deep(.win-infobar-standard-icon),
.win-infobar-user-icon-box :deep(.win-infobar-user-icon) {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  color: inherit;
  font-size: 16px;
  line-height: 16px;
  text-align: center;
  white-space: nowrap;
}

.win-infobar-user-icon-box {
  display: grid;
  place-items: center;
  overflow: hidden;
}

.win-infobar-panel {
  position: relative;
  grid-column: 2;
  grid-row: 1;
  box-sizing: border-box;
  min-width: 0;
  margin: 0 16px 0 0;
  padding: 0;
  display: flex;
  align-items: start;
}

.win-infobar-panel :deep(.win-infobar-title),
.win-infobar-panel :deep(.win-infobar-message) {
  box-sizing: border-box;
  display: block;
  min-width: 0;
  max-width: 100%;
  color: var(--InfoBarForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  font-size: 14px;
  line-height: 20px;
  white-space: normal;
  overflow-wrap: normal;
}

.win-infobar-panel :deep(.win-infobar-title) {
  font-weight: 600;
}

.win-infobar-panel :deep(.win-infobar-message) {
  font-weight: 400;
}

.win-infobar-action {
  box-sizing: border-box;
  min-width: 0;
  display: grid;
  align-items: start;
  justify-items: start;
}

.win-infobar-action:empty {
  display: none;
}

.win-infobar-action :deep(.win-hyperlink-button),
.win-infobar-action-measure :deep(.win-hyperlink-button) {
  margin: 0 0 0 -12px;
  color: var(--InfoBarHyperlinkButtonForeground);
}

.win-infobar-action :deep(.win-hyperlink-button .win-text-block),
.win-infobar-action-measure :deep(.win-hyperlink-button .win-text-block) {
  color: inherit;
}

.win-infobar-panel.is-vertical {
  flex-direction: column;
  padding: 14px 0 18px;
}

.win-infobar-panel.is-vertical :deep(.win-infobar-title),
.win-infobar-panel.is-vertical :deep(.win-infobar-message),
.win-infobar-panel.is-vertical .win-infobar-action {
  flex: 0 0 auto;
  margin-left: 0;
  margin-top: 0;
}

.win-infobar-panel.is-vertical :deep(.win-infobar-title),
.win-infobar-panel.is-vertical :deep(.win-infobar-message) {
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.win-infobar-panel.is-vertical.has-title :deep(.win-infobar-message) {
  margin-top: 4px;
}

.win-infobar-panel.is-vertical.has-title .win-infobar-action,
.win-infobar-panel.is-vertical.has-message .win-infobar-action {
  margin-top: 12px;
}

.win-infobar-panel.is-vertical .win-infobar-action {
  width: fit-content;
  max-width: 100%;
  min-width: 0;
}

.win-infobar-panel:not(.is-vertical) {
  flex-direction: row;
  min-height: 48px;
}

.win-infobar-panel:not(.is-vertical) :deep(.win-infobar-title),
.win-infobar-panel:not(.is-vertical) :deep(.win-infobar-message) {
  flex: 0 0 auto;
  width: max-content;
  max-width: none;
  margin-top: 14px;
  white-space: nowrap;
}

.win-infobar-panel:not(.is-vertical).has-title :deep(.win-infobar-message) {
  margin-left: 12px;
}

.win-infobar-panel:not(.is-vertical) .win-infobar-action {
  flex: 1 1 auto;
  margin-top: 8px;
}

.win-infobar-panel:not(.is-vertical).has-title .win-infobar-action,
.win-infobar-panel:not(.is-vertical).has-message .win-infobar-action {
  margin-left: 16px;
}

.win-infobar-panel:not(.is-vertical):not(.has-action) :deep(.win-infobar-message) {
  flex-grow: 1;
}

.win-infobar-measure-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: max-content;
  height: auto;
  display: none;
  overflow: visible;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
}

.win-infobar-measure-text {
  box-sizing: border-box;
  display: block;
  width: max-content;
  max-width: none;
  min-width: max-content;
  margin: 0;
  color: var(--InfoBarForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
  overflow-wrap: normal;
}

.win-infobar-action-measure {
  box-sizing: border-box;
  width: max-content;
  max-width: none;
  min-width: max-content;
  margin: 0;
  display: inline-grid;
  align-items: start;
  justify-items: start;
}

.win-infobar-content-area {
  grid-column: 2;
  grid-row: 2;
  min-width: 0;
  align-self: center;
}

.no-banner-content .win-infobar-content-area {
  grid-row: 1;
}

.win-infobar-close-button {
  grid-column: 3;
  grid-row: 1;
  align-self: start;
  box-sizing: border-box;
  width: 38px;
  height: 38px;
  min-width: 38px;
  min-height: 38px;
  margin: 5px;
  padding: 0;
}

.win-infobar-close-button.uses-default-close-button-style {
  --ButtonBackground: transparent;
  --ButtonBackgroundPointerOver: var(--subtle-secondary);
  --ButtonBackgroundPressed: var(--subtle-tertiary);
  --ButtonBackgroundDisabled: transparent;
  --ButtonForeground: var(--TextFillColorPrimaryBrush, var(--text-primary));
  --ButtonForegroundPointerOver: var(--TextFillColorPrimaryBrush, var(--text-primary));
  --ButtonForegroundPressed: var(--TextFillColorSecondaryBrush, var(--text-secondary));
  --ButtonForegroundDisabled: var(--TextFillColorDisabledBrush, var(--text-disabled));
  --ButtonBorderBrush: transparent;
  --ButtonBorderBrushTop: transparent;
  --ButtonBorderBrushBottom: transparent;
  --ButtonBorderBrushPointerOver: transparent;
  --ButtonBorderBrushPressed: transparent;
  --ButtonBorderBrushDisabled: transparent;
}

.win-infobar-close-button :deep(.win-infobar-close-glyph) {
  width: 16px;
  height: 16px;
  color: inherit;
  text-align: center;
}

.win-infobar-informational {
  --InfoBarSeverityBackgroundBrush: var(--InfoBarInformationalSeverityBackgroundBrush);
  --InfoBarSeverityIconBackground: var(--InfoBarInformationalSeverityIconBackground);
}

.win-infobar-success {
  --InfoBarSeverityBackgroundBrush: var(--InfoBarSuccessSeverityBackgroundBrush);
  --InfoBarSeverityIconBackground: var(--InfoBarSuccessSeverityIconBackground);
}

.win-infobar-warning {
  --InfoBarSeverityBackgroundBrush: var(--InfoBarWarningSeverityBackgroundBrush);
  --InfoBarSeverityIconBackground: var(--InfoBarWarningSeverityIconBackground);
}

.win-infobar-error {
  --InfoBarSeverityBackgroundBrush: var(--InfoBarErrorSeverityBackgroundBrush);
  --InfoBarSeverityIconBackground: var(--InfoBarErrorSeverityIconBackground);
}
</style>
