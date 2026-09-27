<template>
  <Grid
    x:Name="PART_LayoutRoot"
    :ref="registerRoot"
    v-bind="rootAttrs"
    class="win-titlebar"
    :class="rootClasses"
    :style="rootStyle"
    :dir="FlowDirection === 'RightToLeft' ? 'rtl' : 'ltr'">
    <Grid.ColumnDefinitions>
      <ColumnDefinition x:Name="LeftPaddingColumn" Width="{ThemeResource TitleBarLeftPaddingWidth}" />
      <ColumnDefinition Width="Auto" /><ColumnDefinition Width="Auto" /><ColumnDefinition Width="Auto" />
      <ColumnDefinition Width="{x:Bind HeaderInset, Mode=OneWay}" />
      <ColumnDefinition Width="Auto" /><ColumnDefinition Width="Auto" /><ColumnDefinition Width="Auto" />
      <ColumnDefinition Width="*" /><ColumnDefinition Width="Auto" />
      <ColumnDefinition Width="{ThemeResource TitleBarMinDragRegionWidth}" />
      <ColumnDefinition x:Name="RightPaddingColumn" Width="{ThemeResource TitleBarRightPaddingWidth}" />
    </Grid.ColumnDefinitions>
    <div Grid.Column="0" class="win-titlebar-left-padding" aria-hidden="true"></div>

    <Button
      v-if="IsBackButtonVisible"
      x:Name="PART_BackButton"
      Grid.Column="1"
      class="win-titlebar-back-button"
      Style="{ThemeResource TitleBarBackButtonStyle}"
      VerticalAlignment="Stretch" HorizontalContentAlignment="Center" VerticalContentAlignment="Center" FontSize="16"
      IsEnabled="{x:Bind BackButtonEnabled, Mode=OneWay}"
      AutomationProperties.Name="{x:Bind BackLabel, Mode=OneWay}"
      ToolTipService.ToolTip="{x:Bind BackLabel, Mode=OneWay}"
      Click="requestBack">
      <AnimatedIcon class="icon" Width="16" Height="16" HorizontalAlignment="Center" VerticalAlignment="Center">
        <AnimatedIcon.Source><animatedvisuals:AnimatedBackVisualSource /></AnimatedIcon.Source>
        <AnimatedIcon.FallbackIconSource><FontIconSource Glyph="&#xE72B;" /></AnimatedIcon.FallbackIconSource>
      </AnimatedIcon>
    </Button>

    <Button
      v-if="IsPaneToggleButtonVisible"
      x:Name="PART_PaneToggleButton"
      Grid.Column="2"
      class="win-titlebar-pane-toggle-button"
      Style="{ThemeResource TitleBarPaneToggleButtonStyle}"
      VerticalAlignment="Stretch" HorizontalContentAlignment="Center" VerticalContentAlignment="Center" FontSize="16"
      IsEnabled="{x:Bind IsEnabled, Mode=OneWay}"
      data-nav-pane-toggle
      AutomationProperties.Name="{x:Bind PaneLabel, Mode=OneWay}"
      ToolTipService.ToolTip="{x:Bind PaneLabel, Mode=OneWay}"
      Click="requestPaneToggle">
      <AnimatedIcon class="icon" Width="16" Height="16" HorizontalAlignment="Center" VerticalAlignment="Center">
        <AnimatedIcon.Source><animatedvisuals:AnimatedGlobalNavigationButtonVisualSource /></AnimatedIcon.Source>
        <AnimatedIcon.FallbackIconSource><FontIconSource Glyph="&#xE700;" /></AnimatedIcon.FallbackIconSource>
      </AnimatedIcon>
    </Button>

    <ContentPresenter v-if="hasLeftHeader" x:Name="PART_LeftHeaderPresenter" Grid.Column="3" class="win-titlebar-left-header" HorizontalAlignment="{ThemeResource TitleBarLeftHeaderHorizontalAlignment}" VerticalAlignment="{ThemeResource TitleBarLeftHeaderVerticalAlignment}"><LeftHeaderOutlet /></ContentPresenter>

    <div Grid.Column="4" class="win-titlebar-left-header-padding" aria-hidden="true"></div>

    <Viewbox v-if="hasIcon" x:Name="PART_Icon" Grid.Column="5" class="win-titlebar-icon" MaxWidth="{ThemeResource TitleBarIconMaxWidth}" MaxHeight="{ThemeResource TitleBarIconMaxHeight}" Margin="{ThemeResource TitleBarIconMargin}" VerticalAlignment="Center">
      <IconElementOutlet />
    </Viewbox>

    <TextBlock
      v-if="showTitle"
      x:Name="PART_TitleText"
      Grid.Column="6"
      class="win-titlebar-title"
      Text="{x:Bind Title, Mode=OneWay}"
      Style="{StaticResource CaptionTextBlockStyle}"
      Margin="{ThemeResource TitleBarTitleMargin}" MinWidth="{ThemeResource TitleBarTitleMinWidth}"
      HorizontalAlignment="Left" VerticalAlignment="Center"
      TextTrimming="CharacterEllipsis"
      TextWrapping="NoWrap" />

    <TextBlock
      v-if="showSubtitle"
      x:Name="PART_SubtitleText"
      Grid.Column="7"
      class="win-titlebar-subtitle"
      Text="{x:Bind Subtitle, Mode=OneWay}"
      Style="{StaticResource CaptionTextBlockStyle}"
      Foreground="{ThemeResource TitleBarSubtitleForegroundBrush}" Margin="{ThemeResource TitleBarSubtitleMargin}" MinWidth="{ThemeResource TitleBarSubtitleMinWidth}"
      HorizontalAlignment="Left" VerticalAlignment="Center"
      TextTrimming="CharacterEllipsis"
      TextWrapping="NoWrap" />

    <Grid
      v-if="hasContent"
      x:Name="PART_ContentPresenterGrid"
      Grid.Column="8"
      :ref="registerContentArea"
      class="win-titlebar-content"
      :class="{ 'is-compact': isCompact }">
      <ContentPresenter x:Name="PART_ContentPresenter" class="win-titlebar-content-presenter"
        HorizontalAlignment="{x:Bind ContentAlignment, Mode=OneWay}" VerticalAlignment="{ThemeResource TitleBarContentVerticalAlignment}"
        Margin="{x:Bind ContentMargin, Mode=OneWay}"><ContentOutlet /></ContentPresenter>
    </Grid>

    <ContentPresenter v-if="hasRightHeader" x:Name="PART_RightHeaderPresenter" Grid.Column="9" class="win-titlebar-right-header" HorizontalAlignment="{ThemeResource TitleBarRightHeaderHorizontalAlignment}" VerticalAlignment="{ThemeResource TitleBarRightHeaderVerticalAlignment}"><RightHeaderOutlet /></ContentPresenter>

    <div Grid.Column="10" class="win-titlebar-min-drag-region" aria-hidden="true"></div>
    <div Grid.Column="11" class="win-titlebar-right-padding" aria-hidden="true"></div>
  </Grid>
</template>

<script lang="ts">
import { TitleBarIconSource, TitleBarLeftHeader, TitleBarContent, TitleBarRightHeader, TitleBarResources } from './TitleBarProperties'
import { getIsDragRegion, setIsDragRegion, IsDragRegionProperty } from './TitleBarDragRegion'
import { animatedIconVisualSourceComponents } from './animatedIconVisuals'
export default { components: { 'animatedvisuals:AnimatedBackVisualSource': animatedIconVisualSourceComponents.AnimatedBackVisualSource, 'animatedvisuals:AnimatedGlobalNavigationButtonVisualSource': animatedIconVisualSourceComponents.AnimatedGlobalNavigationButtonVisualSource }, IconSource: TitleBarIconSource, LeftHeader: TitleBarLeftHeader, Content: TitleBarContent, RightHeader: TitleBarRightHeader, Resources: TitleBarResources, GetIsDragRegion: getIsDragRegion, SetIsDragRegion: setIsDragRegion, IsDragRegionProperty }
</script>

<script setup lang="ts">
import { cloneVNode, Comment, computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, provide, proxyRefs, ref, shallowRef, Text, useAttrs, useSlots, watch } from 'vue';
import Grid from './Grid.vue';
import Button from './Button.vue';
import ColumnDefinition from './ColumnDefinition.vue';
import ContentPresenter from './ContentPresenter.vue';
import Viewbox from './Viewbox.vue';
import IconSourceElement from './IconSourceElement.vue';
import { primitiveResourceScope, xamlPrimitiveResourceKey } from './xamlPrimitives';
import { titleBarResources, titleBarBrushAliases, titleBarHighContrastBrushAliases } from './titleBarResources';
import { uiSettings } from './uiSettings';
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime';
import TextBlock from './TextBlock.vue';
import AnimatedIcon from './AnimatedIcon.vue';
import { FontIconSource } from './IconSource';
import { useI18n } from './i18n/index';
import { findTitleBarInteractableElements } from './TitleBarDragRegion';
import { connectTitleBarWindowHost, getTitleBarHostPadding, titleBarHostAdapterKey, type TitleBarHostAdapter, type TitleBarInsets, type TitleBarRegion, type TitleBarWindowHost } from './titleBarHostAdapter';

defineOptions({ inheritAttrs: false });
const { t } = useI18n();
const slots = useSlots();
const hostAdapter = inject<TitleBarHostAdapter | null>(titleBarHostAdapterKey, null);
const forcedHighContrast = ref(false);
const highContrast = computed(() => forcedHighContrast.value || uiSettings.IsHighContrast);
const brushAliases = computed(() => highContrast.value ? titleBarHighContrastBrushAliases : titleBarBrushAliases);
const highContrastColors = { SystemControlForegroundBaseHighBrush: 'CanvasText', SystemControlHighlightAltBaseHighBrush: 'HighlightText', SystemControlDisabledBaseMediumLowBrush: 'GrayText', SystemControlBackgroundBaseLowBrush: 'Canvas', SystemControlHighlightListLowBrush: 'Highlight', SystemControlHighlightListMediumBrush: 'Highlight' };

const xamlProps = defineProps({
  Title: { type: String, default: '' },
  Subtitle: { type: String, default: '' },
  IconSource: { type: [String, Object], default: null },
  IsBackButtonVisible: { type: [Boolean, String], default: false },
  IsBackButtonEnabled: { type: [Boolean, String], default: true },
  IsPaneToggleButtonVisible: { type: [Boolean, String], default: false },
  LeftHeader: { type: null, default: null }, Content: { type: null, default: null }, RightHeader: { type: null, default: null },
  IsEnabled: { type: [Boolean, String], default: true }, FlowDirection: { type: String, default: 'LeftToRight' }, Visibility: { type: String, default: 'Visible' },
  AutoRefreshDragRegions: { type: [Boolean, String], default: false },
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

const emit = defineEmits(['BackRequested', 'PaneToggleRequested', 'LayoutUpdated']);
const instance = getCurrentInstance(), attrs = useAttrs();
const overrides = shallowRef({});
const props = new Proxy(xamlProps, { get: (target, key) => resolveXamlValue(key in overrides.value ? overrides.value[key] : Reflect.get(target, key), instance) });
const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([name]) => !['BackRequested', 'PaneToggleRequested', 'LayoutUpdated'].includes(name))));
const slotNodes = computed(() => flatten(slots.default?.() ?? []));
const children = node => Array.isArray(node.children) ? node.children : node.children?.default?.() ?? [];
const flatten = nodes => nodes.flatMap(node => node.type === Fragment ? flatten(children(node)) : node.type === Comment || node.type === Text && !String(node.children ?? '').trim() ? [] : [node]);
const property = node => node.type?.__titleBarProperty;
const propertyNodes = name => slotNodes.value.filter(node => property(node) === name).flatMap(children);
const defaultContent = () => slotNodes.value.filter(node => !property(node));
const inheritedResources = inject(xamlPrimitiveResourceKey, null);
const localResources = primitiveResourceScope(() => slotNodes.value.filter(node => property(node) === 'Resources'), inheritedResources);
const resources = computed(() => ({ ...titleBarResources, ...localResources.value }));
provide(xamlPrimitiveResourceKey, resources);
const resource = name => {
  if (resources.value[name] !== undefined) return resources.value[name];
  const alias = brushAliases.value[name] ?? name;
  const value = resolveXamlValue(`{ThemeResource ${alias}}`, instance);
  return highContrast.value && value === `var(--${alias})` ? highContrastColors[alias] ?? value : value;
};
const IconSource = computed(() => props.IconSource);
const FlowDirection = computed(() => props.FlowDirection);
const IsEnabled = computed(() => props.IsEnabled !== false);
const hasProperty = name => name in overrides.value ? props[name] !== null : propertyNodes(name).length > 0 || props[name] !== null;
const hasIcon = computed(() => hasProperty('IconSource'));
const hasLeftHeader = computed(() => hasProperty('LeftHeader'));
const hasRightHeader = computed(() => hasProperty('RightHeader'));
const IconElementOutlet = defineComponent({ setup: () => () => h(IconSourceElement, { ref: iconElementRef, IconSource: props.IconSource }, {
  default: () => props.IconSource || 'IconSource' in overrides.value ? [] : normalizeXamlNodes(propertyNodes('IconSource'), instance)
}) });
const ElementOutlet = defineComponent({ props: { element: { type: Object, required: true } }, setup(value) {
  const host = ref<HTMLElement | null>(null);
  let element: HTMLElement | undefined, parent: Node | null = null, sibling: Node | null = null;
  const release = () => {
    if (element && element.parentNode === host.value) {
      if (parent) parent.insertBefore(element, sibling?.parentNode === parent ? sibling : null);
      else element.remove();
    }
    element = undefined; parent = sibling = null;
  };
  const adopt = () => {
    const next = value.element as HTMLElement;
    if (!host.value || next === element) return;
    release(); element = next; parent = next.parentNode; sibling = next.nextSibling;
    host.value.appendChild(next);
  };
  onMounted(adopt); watch(() => value.element, adopt, { flush: 'post' }); onBeforeUnmount(release);
  return () => h('span', { ref: host, style: { display: 'contents' } });
} });
const outlet = name => defineComponent({ setup: () => () => {
  const nodes = name in overrides.value ? [] : name === 'Content' ? propertyNodes('Content').length ? propertyNodes('Content') : defaultContent() : propertyNodes(name);
  if (nodes.length) return h(Fragment, normalizeXamlNodes(nodes.map(node => cloneVNode(node)), instance));
  const value = props[name];
  const element = value?.nodeType === 1 ? value : value?.Element ?? value?.$el;
  if (element?.nodeType === 1) return h(ElementOutlet, { element });
  return isVNode(value) ? h(Fragment, normalizeXamlNodes([value], instance)) : typeof value === 'string' || typeof value === 'number' ? String(value) : null;
} });
const LeftHeaderOutlet = outlet('LeftHeader'), RightHeaderOutlet = outlet('RightHeader'), ContentOutlet = outlet('Content');
const HeaderInset = computed(() => resource(IsBackButtonVisible.value !== IsPaneToggleButtonVisible.value ? 'TitleBarHeaderNegativeInsetPaddingWidth' : 'TitleBarLeftHeaderPaddingWidth'));
const Title = computed(() => props.Title);
const Subtitle = computed(() => props.Subtitle);
const IsBackButtonVisible = computed(() => props.IsBackButtonVisible === true);
const IsBackButtonEnabled = computed(() => props.IsBackButtonEnabled === true);
const IsPaneToggleButtonVisible = computed(() => props.IsPaneToggleButtonVisible === true);
const BackButtonEnabled = computed(() => IsEnabled.value && IsBackButtonEnabled.value);
const BackLabel = computed(() => t('text.back')), PaneLabel = computed(() => t('text.navigation-menu'));
const ContentAlignment = computed(() => isCompact.value ? 'Left' : resource('TitleBarContentHorizontalAlignment'));
const ContentMargin = computed(() => isCompact.value ? resource('TitleBarCompactContentMargin') : 0);
const requestBack = () => {
  if (!IsEnabled.value || !IsBackButtonEnabled.value || !IsBackButtonVisible.value) return;
  emit('BackRequested', publicApi, null);
  if (!instance?.vnode.props?.onBackRequested) resolveXamlHandler(attrs.BackRequested, instance)?.(publicApi, null);
};
const requestPaneToggle = () => {
  if (!IsEnabled.value || !IsPaneToggleButtonVisible.value) return;
  emit('PaneToggleRequested', publicApi, null);
  if (!instance?.vnode.props?.onPaneToggleRequested) resolveXamlHandler(attrs.PaneToggleRequested, instance)?.(publicApi, null);
};
provide(xamlScopeKey, { ...inject(xamlScopeKey, {}), Title, Subtitle, IconSource, HeaderInset, IsEnabled, BackButtonEnabled, BackLabel, PaneLabel, ContentAlignment, ContentMargin, requestBack, requestPaneToggle });

const rootRef = ref(null);
const registerRoot = value => { rootRef.value = value?.Element ?? value?.$el ?? null; };
const iconElementRef = ref(null);
const contentAreaRef = ref(null);
const registerContentArea = value => { contentAreaRef.value = value?.Element ?? value?.$el ?? null; };
const isDeactivated = ref(false);
const isCompact = ref(false);
const isNarrow = ref(false);
const captionPadding = ref<TitleBarInsets | null>(null);
const dragRegionRevision = ref(0);

const NARROW_TITLEBAR_WIDTH = 480;
let defaultDocumentTitle = '';
let lastAppliedTitle = '';
let focusHandler = null;
let blurHandler = null;
let resizeObserver = null;
let contentObserver = null;
let attachedPropertyObserver: MutationObserver | undefined;
let interactableElements: HTMLElement[] = [];
let observedIcon: Element | null = null;
let compactMeasureFrame = 0;
let compactModeThresholdWidth = 0;
let lastMeasuredWidth = -1;
let ownerWindow = null;
let windowHost: TitleBarWindowHost | null = null;
let unsubscribeActivation: (() => void) | undefined;
let unsubscribeInsets: (() => void) | undefined;
let insetResizeHandler: (() => void) | undefined;
let contrastQuery: MediaQueryList | undefined;
const contrastChanged = () => { forcedHighContrast.value = Boolean(contrastQuery?.matches) };
let disposed = false;

const hasContent = computed(() => 'Content' in overrides.value ? props.Content !== null : propertyNodes('Content').length > 0 || defaultContent().length > 0 || props.Content !== null);
const hasExpandedHeight = computed(() => hasContent.value || hasLeftHeader.value || hasRightHeader.value);
// Compact matches the official DisplayModeGroup: title and subtitle collapse.
const showTitle = computed(() => props.Title !== '' && !isCompact.value);
const showSubtitle = computed(() => props.Subtitle !== '' && !isCompact.value);
const isNegativeInsetSpacing = computed(() => props.IsBackButtonVisible !== props.IsPaneToggleButtonVisible);

const rootClasses = computed(() => {
  return ({
  'is-expanded-height': hasExpandedHeight.value,
  'is-compact-height': !hasExpandedHeight.value,
  'is-compact': isCompact.value,
  'is-deactivated': isDeactivated.value,
  'is-narrow': isNarrow.value,
  'is-negative-inset-spacing': isNegativeInsetSpacing.value
}); });

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

const rootStyle = computed(() => {
  const style = {};
  for (const name of Object.keys(brushAliases.value)) style[`--${name}`] = resource(name);
  for (const name of ['TitleBarLeftPaddingWidth', 'TitleBarRightPaddingWidth', 'TitleBarMinDragRegionWidth', 'TitleBarBackButtonWidth', 'TitleBarPaneToggleButtonWidth']) {
    if (localResources.value[name] !== undefined) style[`--${name}`] = cssLength(localResources.value[name]);
  }
  if (captionPadding.value) {
    const { LeftInset, RightInset } = captionPadding.value;
    const rtl = props.FlowDirection === 'RightToLeft';
    style['--TitleBarLeftPaddingWidth'] = cssLength(rtl ? RightInset : LeftInset);
    style['--TitleBarRightPaddingWidth'] = cssLength(rtl ? LeftInset : RightInset);
    style.clipPath = `inset(0 ${RightInset}px 0 ${LeftInset}px)`;
  }
  style['--TitleBarLeftHeaderPaddingWidth'] = cssLength(HeaderInset.value);
  for (const name of ['TitleBarIconMaxWidth', 'TitleBarIconMaxHeight', 'TitleBarTitleMinWidth', 'TitleBarSubtitleMinWidth']) style[`--${name}`] = cssLength(resource(name));
  for (const name of ['TitleBarIconMargin', 'TitleBarTitleMargin', 'TitleBarSubtitleMargin', 'TitleBarCompactContentMargin']) style[`--${name}`] = xamlThickness(resource(name));
  style['--TitleBarDeactivatedOpacity'] = String(resource('TitleBarDeactivatedOpacity'));
  style.height = cssLength(props.Height || resource(hasExpandedHeight.value ? 'TitleBarExpandedHeight' : 'TitleBarCompactHeight'));
  style.gridTemplateColumns = 'var(--TitleBarLeftPaddingWidth, 2px) auto auto auto var(--TitleBarLeftHeaderPaddingWidth, 14px) auto auto auto minmax(0, 1fr) auto var(--TitleBarMinDragRegionWidth, 48px) var(--TitleBarRightPaddingWidth, 0px)';
  if (props.FlowDirection === 'RightToLeft') style.direction = 'rtl';
  if (props.Visibility === 'Collapsed') style.display = 'none';
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


const updateWindowTitle = () => {
  if (!windowHost || props.Title === '') return;
  if (windowHost.GetTitle() !== props.Title) {
    lastAppliedTitle = props.Title;
    windowHost.SetTitle(props.Title);
  }
};

const resetWindowTitle = () => {
  if (windowHost && lastAppliedTitle && windowHost.GetTitle() === lastAppliedTitle) {
    windowHost.SetTitle(defaultDocumentTitle);
  }
  lastAppliedTitle = '';
};

const measureContentDesiredWidth = (root, content) => {
  // DesiredSize is measured before the content is stretched or compacted.
  const measurement = root.cloneNode(false);
  const measuredContent = content.cloneNode(true);
  measurement.classList.remove('is-compact', 'is-narrow');
  measurement.setAttribute('aria-hidden', 'true');
  measurement.inert = true;
  Object.assign(measurement.style, {
    position: 'fixed', left: '-100000px', top: '0', width: 'max-content',
    minWidth: '0', maxWidth: 'none', height: 'auto', display: 'block',
    visibility: 'hidden', pointerEvents: 'none', overflow: 'visible'
  });
  measuredContent.classList.remove('is-compact', 'is-content-stretch');
  Object.assign(measuredContent.style, {
    width: 'max-content', minWidth: '0', maxWidth: 'none', padding: '0',
    justifyContent: 'flex-start', overflow: 'visible'
  });
  for (const child of measuredContent.children) child.style.flex = '0 0 auto';
  measurement.appendChild(measuredContent);
  root.ownerDocument.body.appendChild(measurement);
  try {
    return measuredContent.getBoundingClientRect().width;
  } finally {
    measurement.remove();
  }
};

const updateCompactMode = () => {
  const root = rootRef.value;
  const content = contentAreaRef.value;
  if (!root || !content) return;

  const presenter = content.querySelector('.win-titlebar-content-presenter');
  const desired = measureContentDesiredWidth(root, presenter ?? content);
  const available = content.clientWidth;
  const rootWidth = root.getBoundingClientRect().width;
  // 标题栏实际宽度过窄时标记 is-narrow（不依赖视口媒体查询），
  // 让 PWA overlay / WebView2 里标题栏区域比视口窄的情况也能隐藏搜索框、保住标题。
  isNarrow.value = rootWidth < NARROW_TITLEBAR_WIDTH;
  if (rootWidth === lastMeasuredWidth) return;
  lastMeasuredWidth = rootWidth;
  if (!compactModeThresholdWidth && desired >= available) { compactModeThresholdWidth = rootWidth; isCompact.value = true; }
  else if (isCompact.value && rootWidth >= compactModeThresholdWidth) { compactModeThresholdWidth = 0; isCompact.value = false; }
};

const scheduleCompactModeUpdate = () => {
  if (disposed || compactMeasureFrame) return;
  compactMeasureFrame = (ownerWindow ?? window).requestAnimationFrame(() => {
    compactMeasureFrame = 0;
    updatePadding();
    updateCompactMode();
    if (props.AutoRefreshDragRegions) recomputeDragRegions();
    else updateDragRegions();
    notifyLayoutUpdated();
  });
};

const updatePadding = () => {
  const root = rootRef.value;
  if (!root || disposed) return;
  const rect = root.getBoundingClientRect();
  const next = getTitleBarHostPadding({ X: rect.x, Y: rect.y, Width: rect.width, Height: rect.height }, ownerWindow?.innerWidth ?? 0, windowHost?.GetTitleBarInsets?.() ?? null);
  if (captionPadding.value?.LeftInset === next?.LeftInset && captionPadding.value?.RightInset === next?.RightInset) return;
  captionPadding.value = next;
  compactModeThresholdWidth = 0;
  lastMeasuredWidth = -1;
  isCompact.value = false;
  void nextTick(scheduleCompactModeUpdate);
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
  contentObserver = new (ownerWindow?.MutationObserver ?? MutationObserver)(() => {
    scheduleCompactModeUpdate();
    if (props.AutoRefreshDragRegions) {
      recomputeDragRegions();
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
  const elements = findTitleBarInteractableElements(root);
  interactableElements = elements;
  const interactive = new Set(elements);
  for (const element of root.querySelectorAll('[data-titlebar-passthrough]')) {
    if (!interactive.has(element)) element.removeAttribute('data-titlebar-passthrough');
  }
  for (const element of elements) {
    if (!element.hasAttribute('data-titlebar-passthrough')) element.setAttribute('data-titlebar-passthrough', '');
  }
  updateDragRegions();
  dragRegionRevision.value += 1;
  updateCompactMode();
};
const updateDragRegions = () => {
  const root = rootRef.value;
  if (!root) return;
  const bounds = root.getBoundingClientRect();
  const region = (element): TitleBarRegion => {
    const rect = element.getBoundingClientRect();
    const left = Math.max(bounds.left + (captionPadding.value?.LeftInset ?? 0), rect.left), top = Math.max(bounds.top, rect.top);
    return { X: left, Y: top, Width: Math.max(0, Math.min(bounds.right - (captionPadding.value?.RightInset ?? 0), rect.right) - left), Height: Math.max(0, Math.min(bounds.bottom, rect.bottom) - top) };
  };
  const icon = root.querySelector('.win-titlebar-icon');
  if (resizeObserver && observedIcon !== icon) {
    if (observedIcon) resizeObserver.unobserve(observedIcon);
    if (icon) resizeObserver.observe(icon);
    observedIcon = icon;
  }
  windowHost?.SetDragRegions?.({ Caption: region(root), Passthrough: interactableElements.filter(element => element.isConnected).map(region).filter(rect => rect.Width > 0 && rect.Height > 0), Icon: icon ? region(icon) : null });
};
const notifyLayoutUpdated = () => {
  if (disposed) return;
  emit('LayoutUpdated', publicApi, null);
  if (!instance?.vnode.props?.onLayoutUpdated) resolveXamlHandler(attrs.LayoutUpdated, instance)?.(publicApi, null);
};

const onFocus = () => {
  isDeactivated.value = false;
  updateDragRegions();
};

const onBlur = () => {
  isDeactivated.value = true;
  updateDragRegions();
};

onMounted(async () => {
  ownerWindow = rootRef.value?.ownerDocument.defaultView ?? window;
  contrastQuery = ownerWindow.matchMedia?.('(forced-colors: active)');
  contrastChanged();
  contrastQuery?.addEventListener('change', contrastChanged);
  windowHost = connectTitleBarWindowHost(rootRef.value, hostAdapter);
  updatePadding();
  unsubscribeInsets = windowHost?.SubscribeTitleBarInsets?.(updatePadding);
  if (windowHost?.GetTitleBarInsets && !unsubscribeInsets) {
    insetResizeHandler = updatePadding;
    ownerWindow.addEventListener('resize', insetResizeHandler);
  }
  isDeactivated.value = !(windowHost?.IsInputActive?.() ?? rootRef.value.ownerDocument.hasFocus());
  defaultDocumentTitle = windowHost?.GetTitle() ?? '';
  updateWindowTitle();
  unsubscribeActivation = windowHost?.SubscribeActivation?.(active => { if (active) onFocus(); else onBlur(); });
  if (!unsubscribeActivation) {
    focusHandler = onFocus; blurHandler = onBlur;
    ownerWindow.addEventListener('focus', focusHandler);
    ownerWindow.addEventListener('blur', blurHandler);
  }
  rootRef.value.addEventListener('winui-titlebar-drag-region-changed', recomputeDragRegions);
  attachedPropertyObserver = new ownerWindow.MutationObserver(recomputeDragRegions);
  attachedPropertyObserver.observe(rootRef.value, { attributes: true, subtree: true, attributeFilter: ['titlebar.isdragregion'] });

  await nextTick();
  if (disposed) return;
  updateCompactMode();
  recomputeDragRegions();
  notifyLayoutUpdated();
  if (contentAreaRef.value) startContentObserver();

  if (ownerWindow?.ResizeObserver) {
    resizeObserver = new ownerWindow.ResizeObserver(scheduleCompactModeUpdate);
    if (rootRef.value) resizeObserver.observe(rootRef.value);
    if (contentAreaRef.value) resizeObserver.observe(contentAreaRef.value);
    updateDragRegions();
  }
});

onBeforeUnmount(() => {
  disposed = true;
  if (focusHandler) ownerWindow?.removeEventListener('focus', focusHandler);
  if (blurHandler) ownerWindow?.removeEventListener('blur', blurHandler);
  if (resizeObserver) resizeObserver.disconnect();
  unsubscribeActivation?.();
  unsubscribeInsets?.();
  if (insetResizeHandler) ownerWindow?.removeEventListener('resize', insetResizeHandler);
  contrastQuery?.removeEventListener('change', contrastChanged);
  attachedPropertyObserver?.disconnect();
  rootRef.value?.removeEventListener('winui-titlebar-drag-region-changed', recomputeDragRegions);
  windowHost?.ClearDragRegions?.();
  ownerWindow?.cancelAnimationFrame(compactMeasureFrame);
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


watch(() => props.AutoRefreshDragRegions, (autoRefresh) => {
  if (contentAreaRef.value) startContentObserver();
  if (autoRefresh) recomputeDragRegions();
});

watch(hasContent, (has) => {
  if (has) {
    void nextTick(() => {
      updateCompactMode();
      startContentObserver();
    });
  } else {
    stopContentObserver();
    isCompact.value = false;
    compactModeThresholdWidth = 0;
    lastMeasuredWidth = -1;
  }
});
watch([IsBackButtonVisible, IsBackButtonEnabled, IsPaneToggleButtonVisible, hasLeftHeader, hasRightHeader, hasIcon], () => { void nextTick(recomputeDragRegions); }, { flush: 'post' });
watch(() => props.FlowDirection, () => { lastMeasuredWidth = -1; void nextTick(scheduleCompactModeUpdate); });

const dependencyProperty = name => computed({ get: () => name in overrides.value || props[name] !== null ? props[name] : name === 'IconSource' ? iconElementRef.value?.IconSource ?? null : propertyNodes(name)[0] ?? props[name], set: value => { overrides.value = { ...overrides.value, [name]: value }; updateXamlBinding(xamlProps[name], value, instance); } });
for (const name of Object.keys(xamlProps)) watch(() => resolveXamlValue(xamlProps[name], instance), () => { if (name in overrides.value) { const next = { ...overrides.value }; delete next[name]; overrides.value = next; } });
const publicApi = proxyRefs({
  Element: rootRef,
  ...Object.fromEntries(['Title', 'Subtitle', 'IconSource', 'LeftHeader', 'Content', 'RightHeader', 'IsBackButtonVisible', 'IsBackButtonEnabled', 'IsPaneToggleButtonVisible', 'AutoRefreshDragRegions', 'FlowDirection'].map(name => [name, dependencyProperty(name)])),
  TemplateSettings: computed(() => ({ IconElement: hasIcon.value ? iconElementRef.value : null })),
  RecomputeDragRegions: recomputeDragRegions
});
defineExpose(publicApi);
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

    position: relative;
    width: 100%;
    height: var(--TitleBarExpandedHeight);
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
  }

  .win-titlebar.is-compact-height {
    height: var(--TitleBarCompactHeight);
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
    forced-color-adjust: none;
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
    color: var(--ButtonForegroundCurrent);
    background: transparent;
    cursor: default;
    font-family: var(--SymbolThemeFontFamily, 'WinUIOnWebIcons');
    font-size: 16px;
    transition: none;
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


  .win-titlebar.is-deactivated .win-titlebar-back-button:not(:disabled),
  .win-titlebar.is-deactivated .win-titlebar-pane-toggle-button {
    --TitleBarBackButtonForeground: var(--TitleBarDeactivatedForegroundBrush);
    --TitleBarPaneToggleButtonForeground: var(--TitleBarDeactivatedForegroundBrush);
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
  .win-titlebar.is-deactivated .win-titlebar-content {
    opacity: var(--TitleBarDeactivatedOpacity);
  }

  .win-titlebar-icon {
    opacity: 1;
    filter: none;
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
    display: grid;
    align-items: center;
    overflow: hidden;
  }

  .win-titlebar-content-presenter { min-width: 0; min-height: 0; max-width: 100%; overflow: hidden; }

  .win-titlebar-min-drag-region {
    min-width: var(--TitleBarMinDragRegionWidth);
  }

  .win-titlebar :deep([data-titlebar-passthrough]) {
    app-region: no-drag;
    -webkit-app-region: no-drag;
  }
</style>
