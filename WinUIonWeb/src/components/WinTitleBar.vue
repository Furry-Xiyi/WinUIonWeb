<template>
  <!--
    WinTitleBar - 对应 WinUI 官方 Microsoft.UI.Xaml.Controls.TitleBar
    官方源码：ref/microsoft-ui-xaml-main/controls/dev/TitleBar/
      TitleBar.idl（API）/ TitleBar.xaml（默认模板与 12 列布局）/ TitleBar_themeresources.xaml（主题资源）

    属性、事件、资源名与官方一致：
      Title / Subtitle / IconSource
      LeftHeader / Content / RightHeader（Content 同时支持默认插槽）
      IsBackButtonVisible / IsBackButtonEnabled / IsPaneToggleButtonVisible
      PreferredHeightOption（Default / Tall；Tall 使用 48px）
      AutoRefreshDragRegions / RecomputeDragRegions()
      IsDragRegion（附加属性：在子元素上写 IsDragRegion="true|false"）
      资源：TitleBarContentHorizontalAlignment、TitleBarLeftHeaderHorizontalAlignment、
            TitleBarRightHeaderHorizontalAlignment 及对应 VerticalAlignment
      事件：BackRequested / PaneToggleRequested

    用法（与官方 XAML 同名同大小写）：
    <WinTitleBar
      Title="WinUI Gallery"
      Subtitle="Preview"
      :IsBackButtonVisible="true"
      :IsBackButtonEnabled="canGoBack"
      :IsPaneToggleButtonVisible="true"
      TitleBarContentHorizontalAlignment="Stretch"
      :IconSource="{ Glyph: '\\uE72B' }"
      @BackRequested="onBack"
      @PaneToggleRequested="onPaneToggle">
      <WinAutoSuggestBox ... />
      <template #RightHeader>...</template>
    </WinTitleBar>
  -->
  <div
    ref="rootRef"
    class="win-titlebar"
    :class="rootClasses"
    :style="rootStyle">
    <div class="win-titlebar-left-padding" aria-hidden="true"></div>

    <button
      v-if="IsBackButtonVisible"
      class="win-titlebar-back-button"
      type="button"
      :disabled="!IsBackButtonEnabled"
      :aria-label="t('text.back')"
      v-bind="{ 'tooltipservice.tooltip': t('text.back') }"
      @mousedown="onBackDown"
      @mouseup="onBackUp"
      @mouseleave="onBackLeave"
      @click="emit('BackRequested')">
      <span
        class="icon animated-icon animated-icon-back"
        :class="backClass"
        aria-hidden="true"
        @animationend="onBackAnimEnd">&#xE72B;</span>
    </button>

    <button
      v-if="IsPaneToggleButtonVisible"
      class="win-titlebar-pane-toggle-button"
      type="button"
      data-nav-pane-toggle
      :aria-label="t('text.navigation-menu')"
      v-bind="{ 'tooltipservice.tooltip': t('text.navigation-menu') }"
      @mousedown="onHamburgerDown"
      @mouseup="onHamburgerUp"
      @mouseleave="onHamburgerLeave"
      @click="emit('PaneToggleRequested')">
      <span
        class="icon animated-icon animated-icon-hamburger"
        :class="hamburgerClass"
        aria-hidden="true"
        @animationend="onHamburgerAnimEnd">&#xE700;</span>
    </button>

    <div v-if="$slots.LeftHeader" class="win-titlebar-left-header" :style="leftHeaderStyle">
      <slot name="LeftHeader" />
    </div>

    <div class="win-titlebar-left-header-padding" aria-hidden="true"></div>

    <div v-if="iconKind" class="win-titlebar-icon" aria-hidden="true">
      <img v-if="iconKind === 'image'" :src="iconSourceValue" alt="" />
      <span v-else class="win-titlebar-icon-glyph" :style="iconGlyphStyle">{{ iconGlyph }}</span>
    </div>

    <WinTextBlock
      v-if="showTitle"
      class="win-titlebar-title"
      :Text="Title"
      TextTrimming="CharacterEllipsis"
      TextWrapping="NoWrap" />

    <WinTextBlock
      v-if="showSubtitle"
      class="win-titlebar-subtitle"
      :Text="Subtitle"
      TextTrimming="CharacterEllipsis"
      TextWrapping="NoWrap" />

    <div
      v-if="hasContent"
      ref="contentAreaRef"
      class="win-titlebar-content"
      :class="{ 'is-compact': isCompact, 'is-content-stretch': contentIsStretch }"
      :style="contentStyle">
      <slot name="Content"><slot /></slot>
    </div>

    <div v-if="$slots.RightHeader" class="win-titlebar-right-header" :style="rightHeaderStyle">
      <slot name="RightHeader" />
    </div>

    <div class="win-titlebar-min-drag-region" aria-hidden="true"></div>
    <div class="win-titlebar-right-padding" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue';
import WinTextBlock from './WinTextBlock.vue';
import { useI18n } from './i18n/index';
import { clearIsDragRegion, getIsDragRegion, setIsDragRegion } from './winTitleBarDragRegion';

const { t } = useI18n();
const slots = useSlots();

const props = defineProps({
  Title: { type: String, default: '' },
  Subtitle: { type: String, default: '' },
  IconSource: { type: [String, Object], default: null },
  IsBackButtonVisible: { type: Boolean, default: false },
  IsBackButtonEnabled: { type: Boolean, default: true },
  IsPaneToggleButtonVisible: { type: Boolean, default: false },
  PreferredHeightOption: { type: String, default: 'Default' },
  AutoRefreshDragRegions: { type: Boolean, default: false },
  TitleBarContentHorizontalAlignment: { type: String, default: 'Center' },
  TitleBarContentVerticalAlignment: { type: String, default: 'Center' },
  TitleBarLeftHeaderHorizontalAlignment: { type: String, default: 'Left' },
  TitleBarLeftHeaderVerticalAlignment: { type: String, default: 'Center' },
  TitleBarRightHeaderHorizontalAlignment: { type: String, default: 'Right' },
  TitleBarRightHeaderVerticalAlignment: { type: String, default: 'Center' },
  Background: { type: String, default: '' },
  Foreground: { type: String, default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }
});

const emit = defineEmits(['BackRequested', 'PaneToggleRequested']);

const rootRef = ref(null);
const contentAreaRef = ref(null);
const isDeactivated = ref(false);
const isCompact = ref(false);
const isNarrow = ref(false);
const dragRegionRevision = ref(0);

let compactModeThresholdWidth = 0;
let contentDesiredWidth = 240;
const COMPACT_EXIT_HYSTERESIS = 32;
const NARROW_TITLEBAR_WIDTH = 480;
let defaultDocumentTitle = '';
let lastAppliedTitle = '';
let focusHandler = null;
let blurHandler = null;
let resizeObserver = null;
let contentObserver = null;

const hasContent = computed(() => Boolean(slots.Content || slots.default));
const isTallHeight = computed(() => props.PreferredHeightOption === 'Tall');
const hasExpandedHeight = computed(() => isTallHeight.value || hasContent.value || Boolean(slots.LeftHeader || slots.RightHeader));
// 标题/副标题始终跟随图标显示，不随紧凑模式隐藏；
// 空间不足时由网格收缩 + 省略号处理，而不是直接丢掉标题。
const showTitle = computed(() => props.Title !== '');
const showSubtitle = computed(() => props.Subtitle !== '');
const isNegativeInsetSpacing = computed(() => props.IsBackButtonVisible !== props.IsPaneToggleButtonVisible);

const rootClasses = computed(() => ({
  'is-expanded-height': hasExpandedHeight.value,
  'is-compact-height': !hasExpandedHeight.value,
  'is-compact': isCompact.value,
  'is-deactivated': isDeactivated.value,
  'is-narrow': isNarrow.value,
  'is-negative-inset-spacing': isNegativeInsetSpacing.value
}));

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) {
    return `${Number(value.trim())}px`;
  }
  return typeof value === 'number' ? `${value}px` : value;
};

const xamlThickness = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  const parts = String(value).split(',').map((part) => cssLength(part.trim()));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return String(value);
};

const alignment = (value) => ({
  Left: 'start',
  Center: 'center',
  Right: 'end',
  Stretch: 'stretch'
}[value] ?? 'center');

const verticalAlignment = (value) => ({
  Top: 'start',
  Center: 'center',
  Bottom: 'end',
  Stretch: 'stretch'
}[value] ?? 'center');

const flexAlignment = (value) => ({
  Left: 'flex-start',
  Center: 'center',
  Right: 'flex-end'
}[value] ?? 'center');

const rootStyle = computed(() => {
  const style = {};
  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.Height !== '') style.height = cssLength(props.Height);
  if (props.MinWidth !== '') style.minWidth = cssLength(props.MinWidth);
  if (props.MinHeight !== '') style.minHeight = cssLength(props.MinHeight);
  if (props.MaxWidth !== '') style.maxWidth = cssLength(props.MaxWidth);
  if (props.MaxHeight !== '') style.maxHeight = cssLength(props.MaxHeight);
  if (props.Margin !== '') style.margin = xamlThickness(props.Margin);
  if (props.HorizontalAlignment !== '') style.justifySelf = alignment(props.HorizontalAlignment);
  if (props.VerticalAlignment !== '') style.alignSelf = verticalAlignment(props.VerticalAlignment);
  if (props.Background !== '') style.background = props.Background;
  if (props.Foreground !== '') {
    style.color = props.Foreground;
    style['--TitleBarForegroundBrush'] = props.Foreground;
  }
  return style;
});

const leftHeaderStyle = computed(() => ({
  justifySelf: alignment(props.TitleBarLeftHeaderHorizontalAlignment),
  alignSelf: verticalAlignment(props.TitleBarLeftHeaderVerticalAlignment)
}));

const rightHeaderStyle = computed(() => ({
  justifySelf: alignment(props.TitleBarRightHeaderHorizontalAlignment),
  alignSelf: verticalAlignment(props.TitleBarRightHeaderVerticalAlignment)
}));

const contentIsStretch = computed(() => props.TitleBarContentHorizontalAlignment === 'Stretch');

const contentStyle = computed(() => {
  const style = {
    alignItems: verticalAlignment(props.TitleBarContentVerticalAlignment)
  };
  if (isCompact.value) {
    style.justifyContent = 'flex-start';
    style.padding = 'var(--TitleBarCompactContentMargin)';
  } else {
    style.justifyContent = flexAlignment(props.TitleBarContentHorizontalAlignment);
  }
  return style;
});

const looksLikeImageSource = (value) => {
  const source = String(value ?? '');
  return /^(data:|blob:|https?:|\/)/i.test(source) || /\.(png|jpe?g|gif|svg|ico|webp|bmp)([?#]|$)/i.test(source);
};

const decodeGlyph = (value) => {
  const glyph = String(value ?? '');
  if (glyph.startsWith('\\u')) return String.fromCodePoint(Number.parseInt(glyph.slice(2), 16));
  if (glyph.startsWith('&#x') && glyph.endsWith(';')) return String.fromCodePoint(Number.parseInt(glyph.slice(3, -1), 16));
  if (glyph.startsWith('0x')) return String.fromCodePoint(Number.parseInt(glyph, 16));
  if (/^[0-9A-Fa-f]{4,5}$/.test(glyph)) return String.fromCodePoint(Number.parseInt(glyph, 16));
  return glyph;
};

const symbolGlyphs = {
  Accept: '\uE8FB',
  Cancel: '\uE711',
  Home: '\uE80F',
  Refresh: '\uE72C',
  Find: '\uE721',
  Settings: '\uE713',
  Favorite: '\uE734'
};

const iconSourceObject = computed(() => (
  props.IconSource && typeof props.IconSource === 'object' ? props.IconSource : null
));

const iconKind = computed(() => {
  if (!props.IconSource) return null;
  if (typeof props.IconSource === 'string') {
    return looksLikeImageSource(props.IconSource) ? 'image' : 'glyph';
  }
  const source = iconSourceObject.value;
  if (source?.ImageSource || source?.UriSource || source?.Source || source?.src) return 'image';
  if (source?.Glyph !== undefined || source?.Symbol !== undefined) return 'glyph';
  return null;
});

const iconSourceValue = computed(() => {
  if (typeof props.IconSource === 'string') return props.IconSource;
  const source = iconSourceObject.value;
  return source?.ImageSource ?? source?.UriSource ?? source?.Source ?? source?.src ?? '';
});

const iconGlyph = computed(() => {
  const source = iconSourceObject.value;
  if (typeof props.IconSource === 'string') return decodeGlyph(props.IconSource);
  if (source?.Glyph !== undefined) return decodeGlyph(source.Glyph);
  if (source?.Symbol !== undefined) return symbolGlyphs[source.Symbol] ?? String(source.Symbol);
  return '';
});

const iconGlyphStyle = computed(() => ({
  fontFamily: iconSourceObject.value?.FontFamily || 'WinUIonWebIcons',
  fontSize: iconSourceObject.value?.FontSize !== undefined ? cssLength(iconSourceObject.value.FontSize) : '16px',
  color: iconSourceObject.value?.Foreground || ''
}));

const updateWindowTitle = () => {
  if (props.Title === '') return;
  if (document.title !== props.Title) {
    lastAppliedTitle = props.Title;
    document.title = props.Title;
  }
};

const resetWindowTitle = () => {
  if (lastAppliedTitle && document.title === lastAppliedTitle) {
    document.title = defaultDocumentTitle;
  }
  lastAppliedTitle = '';
};

const updateCompactMode = () => {
  const root = rootRef.value;
  const content = contentAreaRef.value;
  if (!root || !content) return;

  // 记录 Content 第一个子元素曾达到的宽度作为“期望宽度”，
  // 等价于官方的 contentArea.DesiredSize().Width。
  const contentChild = content.firstElementChild;
  if (contentChild) {
    const childWidth = contentChild.getBoundingClientRect().width;
    if (childWidth > contentDesiredWidth) contentDesiredWidth = childWidth;
  }

  const available = content.clientWidth;
  const rootWidth = root.getBoundingClientRect().width;
  // 标题栏实际宽度过窄时标记 is-narrow（不依赖视口媒体查询），
  // 让 PWA overlay / WebView2 里标题栏区域比视口窄的情况也能隐藏搜索框、保住标题。
  isNarrow.value = rootWidth < NARROW_TITLEBAR_WIDTH;
  const overflows = available < contentDesiredWidth - 1;

  if (!isCompact.value) {
    if (overflows && !compactModeThresholdWidth) {
      compactModeThresholdWidth = rootWidth;
      isCompact.value = true;
    }
  } else if (rootWidth >= compactModeThresholdWidth + COMPACT_EXIT_HYSTERESIS) {
    compactModeThresholdWidth = 0;
    isCompact.value = false;
  }
};

const stopContentObserver = () => {
  if (contentObserver) {
    contentObserver.disconnect();
    contentObserver = null;
  }
};

const startContentObserver = () => {
  stopContentObserver();
  const content = contentAreaRef.value;
  if (!content) return;
  contentObserver = new MutationObserver(() => {
    updateCompactMode();
    if (props.AutoRefreshDragRegions) {
      recomputeDragRegions();
    } else {
      stopContentObserver();
    }
  });
  contentObserver.observe(content, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });
};

const recomputeDragRegions = () => {
  const root = rootRef.value;
  if (!root) return;
  root.querySelectorAll('[IsDragRegion]').forEach((element) => {
    const value = element.getAttribute('IsDragRegion');
    if (value !== 'true' && value !== 'false') element.removeAttribute('IsDragRegion');
  });
  void root.getBoundingClientRect();
  dragRegionRevision.value += 1;
  updateCompactMode();
};

const onFocus = () => {
  isDeactivated.value = false;
};

const onBlur = () => {
  isDeactivated.value = true;
};

const backClass = ref('');
const hamburgerClass = ref('');
let backPressed = false;
let backPressDone = false;
let hamburgerPressed = false;
let hamburgerPressDone = false;

const onBackDown = () => {
  backPressed = true;
  backPressDone = false;
  backClass.value = 'pressing';
};

const onBackUp = () => {
  if (!backPressed) return;
  backPressed = false;
  if (backPressDone) backClass.value = 'releasing';
};

const onBackLeave = () => {
  if (!backPressed) return;
  backPressed = false;
  if (backPressDone) backClass.value = 'releasing';
};

const onBackAnimEnd = (event) => {
  if (backClass.value === 'pressing' && event.animationName === 'animated-icon-back-press') {
    backPressDone = true;
    if (!backPressed) backClass.value = 'releasing';
  } else if (backClass.value === 'releasing' && event.animationName === 'animated-icon-back-release') {
    backClass.value = '';
    backPressDone = false;
  }
};

const resetBackAnimationState = () => {
  backPressed = false;
  backPressDone = false;
  backClass.value = '';
};

const onHamburgerDown = () => {
  hamburgerPressed = true;
  hamburgerPressDone = false;
  hamburgerClass.value = 'pressing';
};

const onHamburgerUp = () => {
  if (!hamburgerPressed) return;
  hamburgerPressed = false;
  if (hamburgerPressDone) hamburgerClass.value = 'releasing';
};

const onHamburgerLeave = () => {
  if (!hamburgerPressed) return;
  hamburgerPressed = false;
  if (hamburgerPressDone) hamburgerClass.value = 'releasing';
};

const onHamburgerAnimEnd = (event) => {
  if (hamburgerClass.value === 'pressing' && event.animationName === 'hamburger-press') {
    hamburgerPressDone = true;
    if (!hamburgerPressed) hamburgerClass.value = 'releasing';
  } else if (hamburgerClass.value === 'releasing' && event.animationName === 'hamburger-release') {
    hamburgerClass.value = '';
    hamburgerPressDone = false;
  }
};

onMounted(async () => {
  isDeactivated.value = !document.hasFocus();
  defaultDocumentTitle = document.title;
  updateWindowTitle();
  focusHandler = onFocus;
  blurHandler = onBlur;
  window.addEventListener('focus', focusHandler);
  window.addEventListener('blur', blurHandler);

  await nextTick();
  updateCompactMode();
  if (contentAreaRef.value) startContentObserver();

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => updateCompactMode());
    if (rootRef.value) resizeObserver.observe(rootRef.value);
  }
});

onBeforeUnmount(() => {
  if (focusHandler) window.removeEventListener('focus', focusHandler);
  if (blurHandler) window.removeEventListener('blur', blurHandler);
  if (resizeObserver) resizeObserver.disconnect();
  stopContentObserver();
  resetWindowTitle();
});

watch(() => props.Title, (newTitle, oldTitle) => {
  if (oldTitle !== '' && newTitle === '') {
    resetWindowTitle();
  } else {
    updateWindowTitle();
  }
});

watch(() => props.IsBackButtonVisible, (isVisible) => {
  // v-if removes the icon before animationend can clear its state. Reset the
  // state as it is hidden so a later mount cannot resume a stale press cycle.
  if (!isVisible) resetBackAnimationState();
}, { flush: 'sync' });

watch(() => props.AutoRefreshDragRegions, (autoRefresh) => {
  if (autoRefresh && contentAreaRef.value) {
    startContentObserver();
  } else {
    stopContentObserver();
  }
});

watch(hasContent, (has) => {
  if (has) {
    void nextTick(() => {
      updateCompactMode();
      startContentObserver();
    });
  } else {
    stopContentObserver();
  }
});

defineExpose({
  RecomputeDragRegions: recomputeDragRegions,
  isCompact,
  isNarrow,
  setIsDragRegion,
  getIsDragRegion,
  clearIsDragRegion
});
</script>

<style scoped>
  .win-titlebar {
    --TitleBarCompactHeight: 32px;
    --TitleBarExpandedHeight: 48px;
    --TitleBarBackButtonWidth: 40px;
    --TitleBarPaneToggleButtonWidth: 40px;
    --TitleBarLeftPaddingWidth: 2px;
    --TitleBarRightPaddingWidth: 0px;
    --TitleBarLeftHeaderPaddingWidth: 14px;
    --TitleBarHeaderNegativeInsetPaddingWidth: 2px;
    --TitleBarMinDragRegionWidth: 48px;
    --TitleBarDeactivatedOpacity: 0.5;
    --TitleBarCompactContentMargin: 0 16px 0 0;
    --TitleBarIconMaxWidth: 16px;
    --TitleBarIconMaxHeight: 16px;
    --TitleBarIconMargin: 0 16px 0 0;
    --TitleBarTitleMargin: 0 8px 0 0;
    --TitleBarSubtitleMargin: 0 16px 0 0;
    --TitleBarForegroundBrush: var(--text-primary);
    --TitleBarDeactivatedForegroundBrush: var(--text-tertiary);
    --TitleBarSubtitleForegroundBrush: var(--text-secondary);
    --TitleBarSubtitleDeactivatedForegroundBrush: var(--text-tertiary);
    --TitleBarBackButtonBackground: transparent;
    --TitleBarBackButtonBackgroundPointerOver: var(--subtle-secondary);
    --TitleBarBackButtonBackgroundPressed: var(--subtle-tertiary);
    --TitleBarBackButtonForegroundDisabled: var(--text-disabled);
    --TitleBarPaneToggleButtonBackground: transparent;
    --TitleBarPaneToggleButtonBackgroundPointerOver: var(--subtle-secondary);
    --TitleBarPaneToggleButtonBackgroundPressed: var(--subtle-tertiary);

    position: fixed;
    top: 0;
    top: env(titlebar-area-y, 0);
    left: 0;
    left: env(titlebar-area-x, 0);
    width: 100%;
    width: env(titlebar-area-width, 100%);
    height: var(--TitleBarExpandedHeight);
    height: max(env(titlebar-area-height, 0px), var(--TitleBarExpandedHeight));
    box-sizing: border-box;
    display: grid;
    grid-template-columns:
      var(--TitleBarLeftPaddingWidth)
      auto
      auto
      auto
      var(--TitleBarLeftHeaderPaddingWidth)
      auto
      auto
      auto
      1fr
      auto
      var(--TitleBarMinDragRegionWidth)
      var(--TitleBarRightPaddingWidth);
    align-items: stretch;
    overflow: hidden;
    background: transparent;
    color: var(--TitleBarForegroundBrush);
    font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
    user-select: none;
    app-region: drag;
    -webkit-app-region: drag;
    z-index: 9999;
  }

  .win-titlebar.is-compact-height {
    height: var(--TitleBarCompactHeight);
    height: max(env(titlebar-area-height, 0px), var(--TitleBarCompactHeight));
  }

  .win-titlebar.is-negative-inset-spacing {
    --TitleBarLeftHeaderPaddingWidth: var(--TitleBarHeaderNegativeInsetPaddingWidth);
  }

  .win-titlebar-left-padding {
    grid-column: 1;
  }

  .win-titlebar-back-button {
    grid-column: 2;
  }

  .win-titlebar-pane-toggle-button {
    grid-column: 3;
  }

  .win-titlebar-left-header {
    grid-column: 4;
  }

  .win-titlebar-left-header-padding {
    grid-column: 5;
  }

  .win-titlebar-icon {
    grid-column: 6;
  }

  .win-titlebar-title {
    grid-column: 7;
  }

  .win-titlebar-subtitle {
    grid-column: 8;
  }

  .win-titlebar-content {
    grid-column: 9;
  }

  .win-titlebar-right-header {
    grid-column: 10;
  }

  .win-titlebar-min-drag-region {
    grid-column: 11;
  }

  .win-titlebar-right-padding {
    grid-column: 12;
  }

  .win-titlebar-back-button,
  .win-titlebar-pane-toggle-button {
    box-sizing: border-box;
    width: var(--TitleBarBackButtonWidth);
    margin: 2px;
    padding: 0;
    border: 0;
    border-radius: var(--ControlCornerRadius, 4px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--TitleBarForegroundBrush);
    background: var(--TitleBarBackButtonBackground);
    cursor: pointer;
    font-family: var(--SymbolThemeFontFamily, 'WinUIOnWebIcons');
    font-size: 16px;
    transition: background var(--fast-duration) var(--fast-out-slow-in), color var(--fast-duration) var(--fast-out-slow-in);
  }

  .win-titlebar-pane-toggle-button {
    width: var(--TitleBarPaneToggleButtonWidth);
  }

  .win-titlebar-back-button .icon,
  .win-titlebar-pane-toggle-button .icon {
    width: 16px;
    height: 16px;
    font-size: 16px;
    line-height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .win-titlebar-back-button .animated-icon-back {
    font-size: 11px;
  }

  .win-titlebar-back-button:hover:not(:disabled),
  .win-titlebar-pane-toggle-button:hover {
    background: var(--TitleBarBackButtonBackgroundPointerOver);
  }

  .win-titlebar-back-button:active:not(:disabled),
  .win-titlebar-pane-toggle-button:active {
    background: var(--TitleBarBackButtonBackgroundPressed);
    color: var(--text-secondary);
  }

  .win-titlebar-back-button:disabled {
    color: var(--TitleBarBackButtonForegroundDisabled);
    cursor: default;
  }

  .win-titlebar.is-deactivated .win-titlebar-back-button,
  .win-titlebar.is-deactivated .win-titlebar-pane-toggle-button {
    color: var(--TitleBarDeactivatedForegroundBrush);
  }

  .win-titlebar-left-header,
  .win-titlebar-right-header {
    min-width: 0;
    min-height: 0;
    display: flex;
    align-items: center;
  }

  .win-titlebar.is-deactivated .win-titlebar-left-header,
  .win-titlebar.is-deactivated .win-titlebar-right-header,
  .win-titlebar.is-deactivated .win-titlebar-content,
  .win-titlebar.is-deactivated .win-titlebar-icon {
    opacity: var(--TitleBarDeactivatedOpacity);
  }

  .win-titlebar-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    min-width: var(--TitleBarIconMaxWidth);
    min-height: var(--TitleBarIconMaxHeight);
    max-width: var(--TitleBarIconMaxWidth);
    max-height: var(--TitleBarIconMaxHeight);
    margin: var(--TitleBarIconMargin);
    overflow: hidden;
    flex-shrink: 0;
  }

  .win-titlebar-icon img,
  .win-titlebar-icon-glyph {
    max-width: 100%;
    max-height: 100%;
    display: block;
    font-size: 16px;
    line-height: 1;
  }

  .win-titlebar-icon-glyph {
    font-family: 'WinUIonWebIcons';
  }

  .win-titlebar :deep(.win-titlebar-title),
  .win-titlebar :deep(.win-titlebar-subtitle) {
    min-width: 0;
    max-width: 100%;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: center;
  }

  .win-titlebar :deep(.win-titlebar-title) {
    margin: var(--TitleBarTitleMargin);
    color: var(--TitleBarForegroundBrush);
  }

  .win-titlebar :deep(.win-titlebar-subtitle) {
    margin: var(--TitleBarSubtitleMargin);
    color: var(--TitleBarSubtitleForegroundBrush);
  }

  .win-titlebar.is-deactivated :deep(.win-titlebar-title) {
    color: var(--TitleBarDeactivatedForegroundBrush);
  }

  .win-titlebar.is-deactivated :deep(.win-titlebar-subtitle) {
    color: var(--TitleBarSubtitleDeactivatedForegroundBrush);
  }

  .win-titlebar-content {
    position: relative;
    min-width: 0;
    min-height: 0;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .win-titlebar-content.is-content-stretch :deep(> *) {
    flex: 1 1 auto;
    min-width: 0;
  }

  .win-titlebar-min-drag-region {
    min-width: var(--TitleBarMinDragRegionWidth);
  }

  .win-titlebar :deep(button),
  .win-titlebar :deep(input),
  .win-titlebar :deep(select),
  .win-titlebar :deep(textarea),
  .win-titlebar :deep(a[href]),
  .win-titlebar :deep([role='button']),
  .win-titlebar :deep([tabindex]:not([tabindex='-1'])),
  .win-titlebar :deep([contenteditable='true']) {
    app-region: no-drag;
    -webkit-app-region: no-drag;
  }

  .win-titlebar :deep([IsDragRegion='true']) {
    app-region: drag !important;
    -webkit-app-region: drag !important;
  }

  .win-titlebar :deep([IsDragRegion='false']) {
    app-region: no-drag !important;
    -webkit-app-region: no-drag !important;
  }
</style>
