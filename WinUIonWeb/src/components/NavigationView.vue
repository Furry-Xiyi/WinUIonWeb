<template>
  <!-- NavigationView.xaml: RootGrid, TopNavGrid, PaneContentGrid and ContentGrid. -->
  <div class="win-nav-shell" :class="shellClasses" :style="navigationStyle" v-acrylic-brush="navigationBackgroundStyle" ref="shellRef" :aria-disabled="!officialProps.IsEnabled || undefined">
    <div class="win-nav-shadow-caster" data-template-part="ShadowCaster" :class="{ 'is-overlaying': paneShadowOpen }" v-theme-shadow="{ Translation: paneShadowDepth, Enabled: paneShadowPresent }" aria-hidden="true"></div>
    <nav v-if="isTopNavigation" class="win-nav-top-bar" data-template-part="TopNavGrid" ref="navRef" @keydown="onNavigationKeydown" @focusin="onNavigationFocusIn" @pointerdown.capture="onNavigationPointerDown">
      <div class="win-nav-indicator-track" ref="indicatorTrack"><div class="win-nav-indicator" :style="indicatorStyle"></div></div>
      <div class="win-nav-indicator-track" ref="outgoingIndicatorTrack" aria-hidden="true"><div class="win-nav-indicator win-nav-indicator-outgoing" style="opacity: 0"></div></div>
      <button v-if="showBackButtonResolved" class="win-nav-back-button" :disabled="!canGoBack" :aria-label="t('text.back')" v-bind="{ 'ToolTipService.ToolTip': t('text.back') }" @click="onBackClick" @pointerenter="commandIconInput.PointerEntered" @pointerdown="onBackDown" @pointerup="onBackUp" @pointercancel="onBackLeave" @pointerleave="onBackLeave" @keydown="commandIconInput.KeyDown" @keyup="commandIconInput.KeyUp" @focusout="commandIconInput.LostFocus" ref="topBackButtonRef">
        <AnimatedIcon class="icon" Source="{x:Bind backVisualSource}" Width="16" Height="16" HorizontalAlignment="Center" VerticalAlignment="Center" MirroredWhenRightToLeft="True">
          <AnimatedIcon.FallbackIconSource><FontIconSource Glyph="&#xE72B;" FontSize="16" FontFamily="{ThemeResource SymbolThemeFontFamily}" MirroredWhenRightToLeft="True" /></AnimatedIcon.FallbackIconSource>
        </AnimatedIcon>
      </button>
      <div v-if="hasProperty('paneHeader')" class="win-nav-top-fixed win-nav-top-pane-header"><PropertyOutlet Property="paneHeader" /></div>
      <div v-else-if="paneTitle" class="win-nav-top-fixed win-nav-top-pane-title">{{ paneTitle }}</div>
      <div class="win-nav-menu win-nav-top-primary-menu" data-template-part="TopNavMenuItemsHost" ref="topPrimaryMenuRef">
        <NavigationItems Mode="Top" />
        <button v-if="topOverflowMenuItems.length" class="win-nav-item win-nav-more-button" :disabled="!officialProps.IsEnabled" :aria-label="t('text.more')" :aria-expanded="moreFlyoutOpen" v-bind="{ 'ToolTipService.ToolTip': t('text.more') }" @click="toggleMoreFlyout" ref="moreButtonRef">
          <span class="icon">&#xE712;</span><span v-if="officialProps.OverflowLabelMode === 'MoreLabel'" class="label">{{ t('text.more') }}</span>
        </button>
      </div>
      <div class="win-nav-top-pane-custom-content"><PropertyOutlet Property="paneCustomContent" /></div>
      <div v-if="hasProperty('autoSuggestBox')" class="win-nav-top-fixed win-nav-top-pane-search"><PropertyOutlet Property="autoSuggestBox" /></div>
      <div v-if="hasProperty('paneFooter')" class="win-nav-top-fixed win-nav-top-pane-footer"><PropertyOutlet Property="paneFooter" /></div>
      <div class="win-nav-menu win-nav-top-footer-menu" data-template-part="TopNavFooterMenuItemsHost" ref="topFooterMenuRef"><NavigationItems Mode="TopFooter" /></div>
      <div class="win-nav-top-measure" ref="topMeasureRef" aria-hidden="true" inert><NavigationItems Mode="Measure" /><div class="win-nav-item win-nav-more-button" data-value="__more"><span class="icon">&#xE712;</span><span v-if="officialProps.OverflowLabelMode === 'MoreLabel'" class="label">{{ t('text.more') }}</span></div></div>
    </nav>
    <nav v-else class="win-nav-left-panel" data-template-part="PaneContentGrid" :class="[{ 'is-compact': isCompact, 'is-closed-compact': isClosedCompact, 'is-minimal': isLeftMinimalMode, 'has-back-button': showBackButtonInLeftNav, 'has-pane-toggle-button': isPaneToggleButtonVisible }, paneTransition ? `is-pane-${paneTransition}` : '']" :style="[paneStyle, paneBackgroundStyle]" v-acrylic-brush.host-backdrop="paneBackgroundStyle" ref="navRef" @keydown="onNavigationKeydown" @focusin="onNavigationFocusIn" @pointerdown.capture="onNavigationPointerDown">
      <button v-if="showBackButtonInLeftNav" class="win-nav-back-button" :disabled="!canGoBack" :aria-label="t('text.back')" v-bind="{ 'ToolTipService.ToolTip': t('text.back') }" @click="onBackClick" @pointerenter="commandIconInput.PointerEntered" @pointerdown="onBackDown" @pointerup="onBackUp" @pointerleave="onBackLeave" @pointercancel="onBackLeave" @keydown="commandIconInput.KeyDown" @keyup="commandIconInput.KeyUp" @focusout="commandIconInput.LostFocus"><AnimatedIcon class="icon" Source="{x:Bind backVisualSource}" Width="16" Height="16" HorizontalAlignment="Center" VerticalAlignment="Center" MirroredWhenRightToLeft="True"><AnimatedIcon.FallbackIconSource><FontIconSource Glyph="&#xE72B;" FontSize="16" FontFamily="{ThemeResource SymbolThemeFontFamily}" MirroredWhenRightToLeft="True" /></AnimatedIcon.FallbackIconSource></AnimatedIcon></button>
      <div v-if="isPaneToggleButtonVisible" class="win-nav-pane-command-row" data-template-part="PaneContentGridToggleButtonRow">
        <button class="win-nav-hamburger" :disabled="!officialProps.IsEnabled" :class="{ 'has-pane-title': paneTitle && paneTitleSpaceVisible }" :aria-label="paneToggleLabel" :aria-expanded="!isCompact" v-bind="{ 'ToolTipService.ToolTip': paneToggleLabel }" @click="toggleCompact" @pointerenter="commandIconInput.PointerEntered" @pointerdown="onHamburgerDown" @pointerup="onHamburgerUp" @pointerleave="onHamburgerLeave" @pointercancel="onHamburgerLeave" @keydown="commandIconInput.KeyDown" @keyup="commandIconInput.KeyUp" @focusout="commandIconInput.LostFocus">
          <AnimatedIcon class="icon" Source="{x:Bind hamburgerVisualSource}" Width="16" Height="16" HorizontalAlignment="Center" VerticalAlignment="Center"><AnimatedIcon.FallbackIconSource><FontIconSource Glyph="&#xE700;" FontSize="16" /></AnimatedIcon.FallbackIconSource></AnimatedIcon><span v-if="paneTitle && showPaneTitle" class="win-nav-pane-title">{{ paneTitle }}</span>
        </button>
      </div>
      <div class="win-nav-pane-surface" v-show="isLeftPaneContentVisible" :style="isLeftMinimalMode ? minimalPaneBackgroundStyle : undefined" v-acrylic-brush.host-backdrop="isLeftMinimalMode ? minimalPaneBackgroundStyle : undefined" :aria-hidden="isLeftMinimalMode && isCompact || undefined" :inert="isLeftMinimalMode && isCompact">
        <div class="win-nav-indicator-track" ref="indicatorTrack"><div class="win-nav-indicator" :class="{ 'is-child': indicatorIsChild }" :style="leftIndicatorStyle"></div></div>
        <div class="win-nav-indicator-track" ref="outgoingIndicatorTrack" aria-hidden="true"><div class="win-nav-indicator win-nav-indicator-outgoing" style="opacity: 0"></div></div>
        <div v-if="!isPaneToggleButtonVisible && paneTitle && showPaneTitle" class="win-nav-pane-title-holder"><span class="win-nav-pane-title">{{ paneTitle }}</span></div>
        <div v-if="hasProperty('paneHeader')" v-show="isFullPaneList" class="win-nav-pane-header" :class="{ 'has-pane-toggle': isPaneToggleButtonVisible }"><PropertyOutlet Property="paneHeader" /></div>
        <div v-if="hasProperty('autoSuggestBox')" class="win-nav-pane-top" :class="{ 'is-closed-compact': isClosedCompact }">
          <div class="win-nav-pane-search"><div v-show="!isClosedCompact" class="win-nav-pane-search-presenter" ref="paneAutoSuggestPresenterRef"><PropertyOutlet Property="autoSuggestBox" /></div><button v-show="isClosedCompact" class="win-nav-pane-search-button" :aria-label="t('text.search')" @click="onPaneSearchButtonClick"><span class="icon">&#xE721;</span></button></div>
        </div>
        <div v-if="hasProperty('paneCustomContent')" class="win-nav-pane-custom-content"><PropertyOutlet Property="paneCustomContent" /></div>
        <PaneItemsScrollHost />
        <div class="win-nav-footer" data-template-part="FooterMenuItemsHost"><div v-if="hasProperty('paneFooter')" class="win-nav-pane-footer"><PropertyOutlet Property="paneFooter" /></div><NavigationItems Mode="Footer" /></div>
      </div>
    </nav>
    <main class="win-nav-content" data-template-part="ContentGrid">
      <div v-if="shouldShowHeader" class="win-nav-page-header" data-template-part="HeaderContent"><PropertyOutlet Property="header" /></div>
      <div class="win-nav-content-inner" data-template-part="ContentPresenter"><PropertyOutlet v-if="hasProperty('content')" Property="content" /><ContentOutlet v-else /></div>
      <div v-if="hasProperty('contentOverlay')" class="win-nav-content-overlay"><PropertyOutlet Property="contentOverlay" /></div>
    </main>
    <NavigationFlyouts />
  </div>
</template>
<script>
import * as NavigationProperties from './NavigationViewProperties';
export default {
  MenuItems: NavigationProperties.NavigationViewMenuItems,
  MenuItemsSource: NavigationProperties.NavigationViewMenuItemsSource,
  FooterMenuItems: NavigationProperties.NavigationViewFooterMenuItems,
  FooterMenuItemsSource: NavigationProperties.NavigationViewFooterMenuItemsSource,
  Header: NavigationProperties.NavigationViewHeader,
  HeaderTemplate: NavigationProperties.NavigationViewHeaderTemplate,
  Content: NavigationProperties.NavigationViewContent,
  PaneHeader: NavigationProperties.NavigationViewPaneHeader,
  PaneFooter: NavigationProperties.NavigationViewPaneFooter,
  PaneCustomContent: NavigationProperties.NavigationViewPaneCustomContent,
  AutoSuggestBox: NavigationProperties.NavigationViewAutoSuggestBox,
  ContentOverlay: NavigationProperties.NavigationViewContentOverlay,
  MenuItemTemplate: NavigationProperties.NavigationViewMenuItemTemplate,
  MenuItemTemplateSelector: NavigationProperties.NavigationViewMenuItemTemplateSelector,
  MenuItemContainerStyle: NavigationProperties.NavigationViewMenuItemContainerStyle,
  MenuItemContainerStyleSelector: NavigationProperties.NavigationViewMenuItemContainerStyleSelector,
  PaneToggleButtonStyle: NavigationProperties.NavigationViewPaneToggleButtonStyle
};
</script>
<script setup>
import { ref, reactive, computed, defineComponent, Fragment, h, getCurrentInstance, onMounted, onBeforeUnmount, watch, nextTick, useSlots, useAttrs, toRaw, inject, provide, isVNode, markRaw, shallowReactive } from 'vue';
import Flyout from './Flyout.vue';
import ScrollViewer from './ScrollViewer.vue';
import InfoBadge from './InfoBadge.vue';
import ContentPresenter from './ContentPresenter.vue';
import Viewbox from './Viewbox.vue';
import TextBlock from './TextBlock.vue';
import AnimatedIcon from './AnimatedIcon.vue';
import { FontIconSource } from './IconSource';
import { createAnimatedIconSource } from './animatedIconVisuals';
import { useAnimatedIconInput } from './animatedIconInput';
import { captureFrameNavigationCommit, hasPendingRouteNavigation, navigationInputFrozen, pendingNavigationCompletion, pendingRouteNavigationCompletion } from './frameNavigationRuntime';
import { useI18n } from './i18n/index';
import { getNavigationViewProperty, navigationItemType, navigationVNodeChildren, navigationViewItemRendererKey } from './NavigationViewProperties';
import { normalizeXamlNodes, resolveXamlValue, resolveXamlHandler, materializeXamlVNode, resolveXamlResourceObject, updateXamlBinding, xamlNameScopeKey, xamlScopeKey } from './xamlRuntime';
import { xamlResourceDictionaryKey } from './Page.vue';
import { resolveSymbolGlyph } from './symbolGlyphs';
import { resolveAcrylicResource, useAcrylicBrushStyle } from './AcrylicBrush';
import { vAcrylicBrush } from './acrylicBrushVisual';
import { vThemeShadow } from './themeShadowVisual';
import {
  createEntranceNavigationTransitionInfo,
  createSlideNavigationTransitionInfo
} from '../utils/navigationTransitionInfo';

const { t } = useI18n();
const slots = useSlots();
const attrs = useAttrs();
const commandIconInput = useAnimatedIconInput();
const itemIconInput = useAnimatedIconInput();
const backVisualSource = createAnimatedIconSource('AnimatedBackVisualSource');
const hamburgerVisualSource = createAnimatedIconSource('AnimatedGlobalNavigationButtonVisualSource');
const settingsVisualSource = createAnimatedIconSource('AnimatedSettingsVisualSource');
const groupChevronVisualSource = createAnimatedIconSource('AnimatedChevronUpDownSmallVisualSource');
const groupChevronInput = useAnimatedIconInput(false, (state, element) => {
  const expanded = element.dataset.expanded === 'true';
  const base = state === 'Disabled' ? 'Normal' : state;
  return `${base}${expanded ? 'On' : 'Off'}`;
});
provide(xamlScopeKey, { ...inject(xamlScopeKey, {}), backVisualSource, hamburgerVisualSource });

const declaredProps = defineProps({
  PaneDisplayMode: { type: String, default: 'Auto' },
  SelectedItem: { type: [Object, String, Number], default: null },
  MenuItems: { type: [Array, String], default: () => [] },
  MenuItemsSource: { type: [Array, Object, String], default: null },
  FooterMenuItems: { type: [Array, String], default: () => [] },
  FooterMenuItemsSource: { type: [Array, Object, String], default: null },
  IsBackButtonVisible: { type: String, default: 'Auto' },
  IsBackEnabled: { type: [Boolean, String], default: false },
  IsSettingsVisible: { type: [Boolean, String], default: true },
  IsPaneToggleButtonVisible: { type: [Boolean, String], default: true },
  IsPaneOpen: { type: [Boolean, String], default: true },
  IsPaneVisible: { type: [Boolean, String], default: true },
  OpenPaneLength: { type: [Number, String], default: 320 },
  CompactPaneLength: { type: [Number, String], default: 48 },
  CompactModeThresholdWidth: { type: [Number, String], default: 641 },
  ExpandedModeThresholdWidth: { type: [Number, String], default: 1008 },
  PaneTitle: { type: String, default: '' },
  Header: { type: [String, Number, Object], default: '' },
  HeaderTemplate: { type: [Object, Function, String], default: null },
  PaneToggleButtonStyle: { type: [Object, String], default: null },
  MenuItemTemplate: { type: [Object, Function, String], default: null },
  MenuItemTemplateSelector: { type: [Object, Function, String], default: null },
  MenuItemContainerStyle: { type: [Object, String], default: null },
  MenuItemContainerStyleSelector: { type: [Object, Function, String], default: null },
  AutoSuggestBox: { type: [Object, String], default: null },
  PaneFooter: { type: [Object, String], default: null },
  PaneHeader: { type: [Object, String], default: null },
  PaneCustomContent: { type: [Object, String], default: null },
  ContentOverlay: { type: [Object, String], default: null },
  AlwaysShowHeader: { type: [Boolean, String], default: true },
  SelectionFollowsFocus: { type: String, default: 'Disabled' },
  ShoulderNavigationEnabled: { type: String, default: 'Never' },
  OverflowLabelMode: { type: String, default: 'MoreLabel' },
  IsTitleBarAutoPaddingEnabled: { type: [Boolean, String], default: true },
  IsEnabled: { type: [Boolean, String], default: true },
  IsTabStop: { type: [Boolean, String], default: false },
  Background: { type: [String, Object], default: 'Transparent' },
  Content: { type: null, default: undefined },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' },
});

const componentInstance = getCurrentInstance();
const localProperties = reactive({});
const coercedLengthProperties = new Set(['OpenPaneLength', 'CompactPaneLength', 'CompactModeThresholdWidth', 'ExpandedModeThresholdWidth']);
const officialProps = new Proxy(declaredProps, {
  get(target, property) {
    const value = property in localProperties ? localProperties[property] : resolveXamlValue(Reflect.get(target, property), componentInstance);
    return coercedLengthProperties.has(property) ? Math.max(Number(value) || 0, 0) : value;
  }
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
  const parts = String(value).split(',').map((part) => cssLength(part.trim()));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return String(value);
};

const selfAlignment = (value) => ({
  Left: 'start',
  Center: 'center',
  Right: 'end',
  Stretch: 'stretch',
  Top: 'start',
  Bottom: 'end'
}[value] ?? '');

const getItemTag = item => item && typeof item === 'object'
  ? (item.Tag ?? item.Name)
  : item;
const sourceIdentityMap = new WeakMap();
let nextSourceIdentity = 0;
const getSourceIdentity = (item, fallbackKey) => {
  if (!item || typeof item !== 'object') return getItemTag(item) ?? fallbackKey;
  // Binding refs can expose either a Vue proxy or the original
  // source object. Identity must survive that boundary, especially when
  // footer items intentionally share a Tag (for example Cart and Help).
  const source = toRaw(item);
  if (!sourceIdentityMap.has(source)) {
    nextSourceIdentity += 1;
    sourceIdentityMap.set(source, `nvi-${nextSourceIdentity}`);
  }
  return sourceIdentityMap.get(source);
};
const normalizeItem = (item, fallbackKey = 'item') => {
  const declaredType = item?.Type ?? 'Item';
  const type = declaredType === 'NavigationViewItemHeader'
    ? 'Header'
    : declaredType === 'NavigationViewItemSeparator'
      ? 'Separator'
      : declaredType;
  const children = item?.MenuItemsSource ?? item?.MenuItems;
  const iconNode = item?.__IconNodes?.[0];
  const iconProps = iconNode?.props;
  return {
    value: getSourceIdentity(item, `__${String(type).toLowerCase()}-${fallbackKey}`),
    tag: getItemTag(item),
    label: item?.Content ?? (typeof item === 'string' || typeof item === 'number' ? String(item) : ''),
    icon: resolveSymbolGlyph(item?.Icon ?? iconProps?.Symbol) || item?.Icon?.Glyph || iconProps?.Glyph || item?.Icon || '',
    iconNodes: item?.__IconNodes,
    contentNodes: item?.__ContentNodes,
    infoBadge: item?.InfoBadge ?? null,
    automationName: item?.['AutomationProperties.Name'] ?? item?.AutomationProperties?.Name ?? '',
    tooltip: item?.['ToolTipService.ToolTip'] ?? '',
    type,
    children: Array.isArray(children)
      ? children.map((child, index) => normalizeItem(child, `${fallbackKey}-${index}`))
      : null,
    isEnabled: item?.IsEnabled !== false && item?.IsEnabled !== 'False' && officialProps.IsEnabled !== false,
    selectsOnInvoked: item?.SelectsOnInvoked !== false && item?.SelectsOnInvoked !== 'False',
    hasChildren: Boolean(item?.HasUnrealizedChildren) || (Array.isArray(children) && children.length > 0),
    source: item?.__DataItem ?? item,
    container: item
  };
};

const flattenNavigationNodes = nodes => (Array.isArray(nodes) ? nodes : [nodes]).flatMap(node =>
  node?.type === Fragment ? flattenNavigationNodes(navigationVNodeChildren(node)) : node ? [node] : []);
const navigationNodes = () => flattenNavigationNodes(slots.default?.() ?? []);
const names = inject(xamlNameScopeKey, null);
const pageResources = inject(xamlResourceDictionaryKey, null);
const propertyNodes = property => navigationNodes()
  .filter(node => getNavigationViewProperty(node) === property).flatMap(navigationVNodeChildren);
const propertyName = property => property.charAt(0).toUpperCase() + property.slice(1);
const propertyValue = property => officialProps[propertyName(property)];
const hasProperty = property => propertyName(property) in localProperties
  ? propertyValue(property) !== null && propertyValue(property) !== undefined && propertyValue(property) !== ''
  : propertyNodes(property).length > 0 || propertyValue(property) !== null && propertyValue(property) !== undefined && propertyValue(property) !== '';
const PropertyOutlet = defineComponent({
  props: { Property: { type: String, required: true } },
  setup(outletProps) {
    return () => {
      const overridden = propertyName(outletProps.Property) in localProperties;
      const nodes = overridden ? [] : propertyNodes(outletProps.Property);
      if (nodes.length) return h(Fragment, normalizeXamlNodes(nodes, componentInstance));
      const value = propertyValue(outletProps.Property);
      if (isVNode(value)) return h(Fragment, normalizeXamlNodes([value], componentInstance));
      if (outletProps.Property === 'header') {
        const template = propertyNodes('headerTemplate')[0] ?? resourceObject(declaredProps.HeaderTemplate);
        const roots = templateRoots(template);
        if (roots.length) return h(Fragment, normalizeXamlNodes(roots.map(node => materializeXamlVNode(node, value, componentInstance)), componentInstance));
      }
      return value !== undefined && value !== null && typeof value !== 'object' ? h(TextBlock, { Text: String(value) }) : null;
    };
  }
});
const ContentOutlet = defineComponent({
  setup() {
    return () => h(Fragment, normalizeXamlNodes(navigationNodes().filter(node =>
      !getNavigationViewProperty(node) && !navigationItemType(node)), componentInstance));
  }
});

const xamlItemSources = new Map();
const xamlItemDescriptors = new WeakMap();
const sameNodes = (left, right) => left?.length === right.length && right.every((node, index) => {
  const previous = left[index];
  if (node === previous) return true;
  if (node?.type !== previous?.type) return false;
  const props = node?.props ?? {};
  const previousProps = previous?.props ?? {};
  const keys = Object.keys(props).filter(key => !key.startsWith('on') && !['ref', 'key'].includes(key));
  if (keys.length !== Object.keys(previousProps).filter(key => !key.startsWith('on') && !['ref', 'key'].includes(key)).length) return false;
  if (keys.some(key => props[key] !== previousProps[key])) return false;
  return typeof node.children === 'string' ? node.children === previous.children
    : sameNodes(navigationVNodeChildren(previous), navigationVNodeChildren(node));
});
const readNavigationItem = (node, key) => {
  const type = navigationItemType(node);
  if (!type) return null;
  const declared = node.props ?? {};
  const name = declared['x:Name'] ?? declared['data-xaml-ref'];
  const identity = name || declared.key || key;
  let item = xamlItemSources.get(identity);
  if (!item) {
    const values = {};
    const overrides = shallowReactive({});
    item = markRaw(new Proxy(values, {
      get(target, property) {
        const override = overrides[property];
        return override && override.original === target[property] ? override.value : target[property];
      },
      set(target, property, value) {
        const current = overrides[property];
        if (!current || current.value !== value || current.original !== target[property]) overrides[property] = { original: target[property], value };
        return true;
      },
      ownKeys(target) { return [...new Set([...Reflect.ownKeys(target), ...Reflect.ownKeys(overrides)])]; },
      getOwnPropertyDescriptor(target, property) {
        return Reflect.getOwnPropertyDescriptor(target, property) ?? (property in overrides ? { configurable: true, enumerable: true } : undefined);
      }
    }));
    xamlItemSources.set(identity, item);
    xamlItemDescriptors.set(item, values);
  }
  // Parsing changes the declaration snapshot only. Runtime dependency-property
  // overrides live in a separate reactive record, so evaluating the visual tree
  // cannot invalidate its own computed dependencies.
  const values = xamlItemDescriptors.get(item);
  const retained = new Set();
  for (const [property, value] of Object.entries(declared)) {
    if (property.startsWith('on') || ['ref', 'key', 'class', 'style'].includes(property)) continue;
    retained.add(property);
    values[property] = resolveXamlValue(value, componentInstance);
  }
  for (const property of Object.keys(values)) {
    if (!retained.has(property) && !['Type', 'Tag', 'MenuItems', '__DataItem', '__IconNodes', '__ContentNodes', 'InfoBadge'].includes(property)) delete values[property];
  }
  values.Type = type;
  values.Tag ??= name || key;
  const children = navigationVNodeChildren(node);
  for (const child of children) {
    const property = getNavigationViewProperty(child);
    if (property === 'icon' || property === 'content') {
      const field = property === 'icon' ? '__IconNodes' : '__ContentNodes';
      const nextNodes = navigationVNodeChildren(child);
      if (!sameNodes(values[field], nextNodes)) values[field] = markRaw(nextNodes);
    } else if (property === 'infoBadge') {
      const badge = navigationVNodeChildren(child).find(value => {
        const badgeType = value.type;
        return (typeof badgeType === 'string' ? badgeType : badgeType?.name ?? badgeType?.__name) === 'InfoBadge';
      });
      if (badge) {
        const badgeValues = {};
        for (const [property, value] of Object.entries(badge.props ?? {})) {
          if (property.startsWith('on') || ['ref', 'key', 'class', 'style'].includes(property)) continue;
          const resolved = resolveXamlValue(value, componentInstance);
          if (resolved !== undefined) badgeValues[property] = ['Value', 'Opacity'].includes(property) ? Number(resolved) : resolved;
        }
        values.InfoBadge = badgeValues;
      }
    } else if (property === 'menuItems') {
      values.MenuItems = navigationVNodeChildren(child).map((value, index) => readNavigationItem(value, `${key}-${index}`)).filter(Boolean);
    } else if (property === 'menuItemsSource') {
      const source = navigationVNodeChildren(child)[0];
      values.MenuItemsSource = source?.props?.ItemsSource ? resolveXamlValue(source.props.ItemsSource, componentInstance) : [];
    }
  }
  const directContent = children.filter(child => !getNavigationViewProperty(child) && !navigationItemType(child));
  if (directContent.length && !values.__ContentNodes) values.__ContentNodes = markRaw(directContent);
  if (name && names && names[name] !== item) names[name] = item;
  return item;
};

const readPropertyItems = property => navigationNodes()
  .filter(node => getNavigationViewProperty(node) === property)
  .flatMap(navigationVNodeChildren)
  .map((node, index) => readNavigationItem(node, `${property}-${index}`))
  .filter(Boolean);
const resolveItems = (items, source) => Array.isArray(items) && items.length ? items : (Array.isArray(source) ? source : []);
const resourceObject = value => {
  if (typeof value !== 'string') return value;
  const key = value.match(/^\{StaticResource\s+([^}]+)\}$/)?.[1]?.trim() ?? value.match(/^var\(--([^,)]+)/)?.[1];
  return key ? pageResources?.[key] ?? resolveXamlResourceObject(key, componentInstance) : value;
};
const templateRoots = template => {
  if (Array.isArray(template)) return template.flatMap(templateRoots);
  if (!isVNode(template)) return [];
  const name = typeof template.type === 'string' ? template.type : template.type?.name ?? template.type?.__name;
  return name === 'DataTemplate' ? navigationVNodeChildren(template) : [template];
};
const sourceItemContainer = (source, key) => {
  let template = propertyNodes('menuItemTemplate')[0] ?? resourceObject(declaredProps.MenuItemTemplate);
  const selector = propertyNodes('menuItemTemplateSelector')[0] ?? resourceObject(declaredProps.MenuItemTemplateSelector);
  if (typeof selector === 'function') template = selector(source);
  else if (selector?.SelectTemplate) template = selector.SelectTemplate(source);
  else if (selector?.SelectTemplateCore) template = selector.SelectTemplateCore(source);
  else if (isVNode(selector)) {
    const selectedProperty = navigationVNodeChildren(selector).find(node => getNavigationViewProperty(node) === 'itemTemplate');
    template = selectedProperty ? navigationVNodeChildren(selectedProperty)[0] : template;
  } else if (selector?.ItemTemplate) template = resourceObject(selector.ItemTemplate);
  const nodes = templateRoots(template);
  const node = nodes.map(value => materializeXamlVNode(value, source, componentInstance)).find(value => navigationItemType(value));
  if (!node) return source;
  const container = readNavigationItem(node, key);
  xamlItemDescriptors.get(container).__DataItem = source;
  return container;
};
const menuItems = computed(() => {
  const declared = readPropertyItems('menuItems');
  return (declared.length ? declared : resolveItems(officialProps.MenuItems, officialProps.MenuItemsSource).map((source, index) => sourceItemContainer(source, `menu-source-${getSourceIdentity(source, index)}`)))
    .map((item, index) => normalizeItem(item, `menu-${index}`));
});
const footerItems = computed(() => {
  const declared = readPropertyItems('footerMenuItems');
  return (declared.length ? declared : resolveItems(officialProps.FooterMenuItems, officialProps.FooterMenuItemsSource).map((source, index) => sourceItemContainer(source, `footer-source-${getSourceIdentity(source, index)}`)))
    .map((item, index) => normalizeItem(item, `footer-${index}`));
});
const internalSelectedItem = ref(officialProps.SelectedItem);
const flattenItems = items => items.flatMap(item => [item, ...flattenItems(item.children ?? [])]);
const flattenedItems = computed(() => flattenItems([...menuItems.value, ...footerItems.value]));
const resolveSelectedValue = (selectedItem) => {
  if (selectedItem?.IsSettingsItem || getItemTag(selectedItem) === 'settings') return 'settings';
  if (selectedItem && typeof selectedItem === 'object') {
    const rawSelectedItem = toRaw(selectedItem);
    const exactItem = flattenedItems.value.find(item => item.source === selectedItem || toRaw(item.source) === rawSelectedItem || toRaw(item.container) === rawSelectedItem);
    if (exactItem) return exactItem.value;
  }
  const selectedTag = getItemTag(selectedItem);
  return flattenedItems.value.find(item => item.tag === selectedTag)?.value ?? selectedTag;
};
const selectedValue = computed(() => resolveSelectedValue(internalSelectedItem.value));
// SelectedItem drives navigation before its destination Page is mounted.
// Keep selection visuals on the current item until that Page commits.
const visualSelectedValue = ref(selectedValue.value);
const synchronizeItemSelection = value => {
  for (const item of flattenedItems.value) {
    if (item.container && typeof item.container === 'object' && item.container.IsSelected !== (item.value === value)) item.container.IsSelected = item.value === value;
  }
};

// Internal aliases keep the rendering code focused on layout while the public surface mirrors WinUI.
const props = {
  get paneDisplayMode() { return officialProps.PaneDisplayMode; },
  get selectedValue() { return selectedValue.value; },
  get menuItems() { return menuItems.value; },
  get footerItems() { return footerItems.value; },
  get isBackButtonVisible() { return officialProps.IsBackButtonVisible; },
  get isSettingsVisible() { return officialProps.IsSettingsVisible; },
  get isPaneToggleButtonVisible() { return officialProps.IsPaneToggleButtonVisible; },
  get isPaneOpen() { return officialProps.IsPaneOpen; },
  get openPaneLength() { return officialProps.OpenPaneLength; },
  get compactPaneLength() { return officialProps.CompactPaneLength; },
  get compactModeThresholdWidth() { return officialProps.CompactModeThresholdWidth; },
  get expandedModeThresholdWidth() { return officialProps.ExpandedModeThresholdWidth; },
  get paneTitle() { return officialProps.PaneTitle; },
  get header() { return officialProps.Header; },
  get settingsValue() { return 'settings'; },
  get settingsLabel() { return t('text.settings'); },
  get settingsIcon() { return '\uE713'; }
};

const resolvedSettingsLabel = computed(() => props.settingsLabel);
const nativeEmit = defineEmits([
  'update:SelectedItem',
  'update:IsPaneOpen',
  'SelectionChanged',
  'ItemInvoked',
  'DisplayModeChanged',
  'BackRequested',
  'PaneOpening',
  'PaneOpened',
  'PaneClosing',
  'PaneClosed',
  'Expanding',
  'Collapsed'
]);
const emit = (name, args) => {
  if (name.startsWith('update:')) { nativeEmit(name, args); return; }
  nativeEmit(name, dependencyPropertySender, args);
  if (attrs[name] !== undefined) resolveXamlHandler(attrs[name], componentInstance)?.(dependencyPropertySender, args);
};
const isCompact = ref(!officialProps.IsPaneOpen || officialProps.PaneDisplayMode === 'LeftMinimal');
const paneTransition = ref('');
const shellRef = ref(null);
const navRef = ref(null);
const indicatorTrack = ref(null);
const outgoingIndicatorTrack = ref(null);
const scrollArea = ref(null);
const paneAutoSuggestPresenterRef = ref(null);
const topPrimaryMenuRef = ref(null);
const topFooterMenuRef = ref(null);
const topMeasureRef = ref(null);
const moreButtonRef = ref(null);
const topBackButtonRef = ref(null);
const indicatorStyle = ref({ opacity: '0' });
const indicatorIsChild = ref(false);
const indicatorLeftPx = ref(4);
const pressedItemValue = ref(null);
const groupExpanded = reactive({});
const manuallyCollapsedGroups = reactive({});
const groupHeights = reactive({});
const flyoutOpen = ref(false);
const childrenFlyoutRef = ref(null);
const flyoutGroupValue = ref(null);
const moreFlyoutOpen = ref(false);
const overflowFlyoutRef = ref(null);
const moreFlyoutItems = ref([]);
let flyoutShowVersion = 0;
const topAvailableWidth = ref(Number.POSITIVE_INFINITY);
const topItemWidths = ref({});
const topMoreButtonWidth = ref(40);
const containerWidth = ref(typeof window === 'undefined' ? props.expandedModeThresholdWidth : window.innerWidth);

const normalizedPaneDisplayMode = computed(() => props.paneDisplayMode);
const resolvedPaneDisplayMode = computed(() => {
  if (normalizedPaneDisplayMode.value !== 'Auto') return normalizedPaneDisplayMode.value;
  const width = containerWidth.value || (typeof window === 'undefined' ? props.expandedModeThresholdWidth : window.innerWidth);
  if (width >= props.expandedModeThresholdWidth) return 'Left';
  if (width >= props.compactModeThresholdWidth) return 'LeftCompact';
  return 'LeftMinimal';
});
const isTopNavigation = computed(() => resolvedPaneDisplayMode.value === 'Top');
const flyoutPlacement = computed(() => isTopNavigation.value ? 'BottomEdgeAlignedLeft' : 'RightEdgeAlignedTop');
const isLeftMinimalMode = computed(() => resolvedPaneDisplayMode.value === 'LeftMinimal');
const isLeftCompactMode = computed(() => resolvedPaneDisplayMode.value === 'LeftCompact');
const isLeftOverlayMode = computed(() => isLeftMinimalMode.value || isLeftCompactMode.value);
// NavigationView::SetDropShadow uses the separate ShadowCaster in overlay modes.
const paneShadowDepth = computed(() => {
  const depth = Number(resolveXamlValue('{ThemeResource PaneOverlayShadowDepth}', componentInstance));
  return Number.isFinite(depth) ? depth : 16;
});
const paneShadowOpen = computed(() => isLeftOverlayMode.value && !isCompact.value && officialProps.IsPaneVisible !== false);
const paneShadowPresent = ref(false);
let paneShadowTimer = null;
watch(paneShadowOpen, open => {
  if (paneShadowTimer) clearTimeout(paneShadowTimer);
  paneShadowTimer = null;
  if (open) paneShadowPresent.value = true;
  else if (paneShadowPresent.value) {
    // ShadowCasterEaseOutStoryboard_Completed clears Shadow after the 120ms fade.
    paneShadowTimer = setTimeout(() => { paneShadowPresent.value = false; paneShadowTimer = null; }, 120);
  }
}, { immediate: true });
const isLeftPaneContentVisible = computed(() => !isLeftMinimalMode.value || !isCompact.value || paneTransition.value === 'closing');
const isClosedCompact = computed(() => !isTopNavigation.value && isCompact.value && !isLeftMinimalMode.value);
// Preserve expansion state while closed, but animate expanded child presenters
// out of the layout using the same height transition as a normal group toggle.
const isPaneGroupChildrenVisible = computed(() => (
  !isClosedCompact.value && (!isLeftMinimalMode.value || !isCompact.value)
));
const itemToolTipAttrs = (item) => {
  const toolTip = item?.tooltip || (!isTopNavigation.value && isClosedCompact.value ? item?.label : '');
  return {
    tabindex: item?.isEnabled === false ? -1 : 0,
    ...(item?.automationName ? { 'aria-label': item.automationName } : {}),
    ...(toolTip ? { 'ToolTipService.ToolTip': toolTip } : {})
  };
};

const isMinimalClosing = computed(() => isLeftMinimalMode.value && isCompact.value && paneTransition.value === 'closing');
const isFullPaneList = computed(() => isLeftPaneContentVisible.value && !isClosedCompact.value);
// Minimal is an overlay, so its closing frame keeps the full pane content in
// the tree while the pane surface plays the reverse of the opening motion.
// Minimal closed state exposes only the back and hamburger buttons. The title
// is removed as soon as the pane starts closing so the hamburger keeps its
// compact hit target while the surface runs the reverse opening animation.
const showPaneTitle = computed(() => isFullPaneList.value && !isCompact.value);
const paneTitleSpaceVisible = computed(() => showPaneTitle.value);
const paneToggleLabel = computed(() => t(isCompact.value ? 'text.open-navigation' : 'text.close-navigation'));
const displayMode = computed(() => {
  if (isTopNavigation.value || isLeftMinimalMode.value) return 'Minimal';
  if (isLeftCompactMode.value) return 'Compact';
  return 'Expanded';
});
const isSettingsVisible = computed(() => props.isSettingsVisible);
const isPaneToggleButtonVisible = computed(() => props.isPaneToggleButtonVisible);
const paneTitle = computed(() => props.paneTitle);
const header = computed(() => props.header);
const shouldShowHeader = computed(() => (
  hasProperty('header') &&
  (officialProps.AlwaysShowHeader || (!isTopNavigation.value && displayMode.value === 'Minimal'))
));
const settingsValue = computed(() => props.settingsValue);
const settingsLabel = computed(() => props.settingsLabel);
const settingsIcon = computed(() => props.settingsIcon);
const showBackButtonResolved = computed(() => {
  if (props.isBackButtonVisible === 'Visible') return true;
  if (props.isBackButtonVisible === 'Collapsed') return false;
  // WinUI's Auto value follows the platform default (visible outside Xbox),
  // rather than being limited to the minimal responsive state.
  return true;
});
const showBackButtonInLeftNav = computed(() => showBackButtonResolved.value && !isTopNavigation.value);
// Keep the three left-pane modes on the same transition contracts as the
// native NavigationView/SplitView template. Left uses CompactInline; the
// other two modes use the overlay transitions.
const paneTransitionSpec = computed(() => {
  if (isLeftMinimalMode.value || isLeftCompactMode.value) {
    return {
      openDurationMs: 350,
      closeDurationMs: 120,
      easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)'
    };
  }

  return {
    openDurationMs: 200,
    // CompactInline closes to ClosedCompactLeft. The native template uses
    // SplitViewPaneAnimationOpenDuration (200ms) for that transition; the
    // 100ms close resource is only used when the pane leaves the layout
    // entirely (Closed), which NavigationView does not use for Left.
    closeDurationMs: 200,
    easing: 'cubic-bezier(0, 0.35, 0.15, 1)'
  };
});
const paneTransitionDurationMs = (compact, mode = paneTransitionSpec.value) => (
  compact ? mode.closeDurationMs : mode.openDurationMs
);
const paneBackgroundStyle = useAcrylicBrushStyle(() => {
  if (isLeftMinimalMode.value) return 'Transparent';
  const name = isLeftOverlayMode.value && (!isCompact.value || paneTransition.value === 'closing')
    ? 'NavigationViewDefaultPaneBackground' : 'NavigationViewExpandedPaneBackground';
  return resolveAcrylicResource(name, componentInstance) ?? `{ThemeResource ${name}}`;
}, componentInstance);
const minimalPaneBackgroundStyle = useAcrylicBrushStyle(() => isLeftMinimalMode.value && (!isCompact.value || paneTransition.value === 'closing') ? '{ThemeResource NavigationViewDefaultPaneBackground}' : 'Transparent', componentInstance);
const navigationBackgroundStyle = useAcrylicBrushStyle(() => declaredProps.Background, componentInstance);
const paneStyle = computed(() => ({
  // A fixed Left pane is measured against the NavigationView's own arranged
  // width. Gallery examples can be narrower than the default 320px pane;
  // clamp the pane to that width so its item badges stay inside the display.
  '--win-nav-open-pane-length': `${Math.max(props.compactPaneLength, Math.min(props.openPaneLength, containerWidth.value || props.openPaneLength))}px`,
  '--win-nav-compact-pane-length': `${props.compactPaneLength}px`,
  // NavigationViewMinimalHeaderMargin is -24,44,0,0 in the native theme and
  // follows the command-row padding in ContentLeftPadding. The page header
  // is a direct child here, so apply the resulting effective inset instead
  // of the raw negative XAML margin.
  '--win-nav-header-margin-left': `${isLeftMinimalMode.value
    ? (isPaneToggleButtonVisible.value ? 40 : 0) + (showBackButtonInLeftNav.value ? 40 : 0) - 24
    : 56}px`,
  '--win-nav-pane-duration': `${paneTransitionDurationMs(isCompact.value)}ms`,
  '--win-nav-pane-open-duration': `${paneTransitionSpec.value.openDurationMs}ms`,
  '--win-nav-pane-close-duration': `${paneTransitionSpec.value.closeDurationMs}ms`,
  '--win-nav-pane-easing': paneTransitionSpec.value.easing
}));
const navigationStyle = computed(() => {
  const style = { ...paneStyle.value, ...navigationBackgroundStyle.value };
  if (officialProps.Width !== '') style.width = cssLength(officialProps.Width);
  if (officialProps.Height !== '') style.height = cssLength(officialProps.Height);
  if (officialProps.MinWidth !== '') style.minWidth = cssLength(officialProps.MinWidth);
  if (officialProps.MinHeight !== '') style.minHeight = cssLength(officialProps.MinHeight);
  if (officialProps.MaxWidth !== '') style.maxWidth = cssLength(officialProps.MaxWidth);
  if (officialProps.MaxHeight !== '') style.maxHeight = cssLength(officialProps.MaxHeight);
  if (officialProps.Margin !== '') style.margin = xamlThickness(officialProps.Margin);
  if (officialProps.HorizontalAlignment) style.justifySelf = selfAlignment(officialProps.HorizontalAlignment);
  if (officialProps.VerticalAlignment) style.alignSelf = selfAlignment(officialProps.VerticalAlignment);
  return style;
});
const shellClasses = computed(() => [
  isTopNavigation.value ? 'is-top' : 'is-left',
  isLeftOverlayMode.value ? 'is-overlay-left' : '',
  isLeftMinimalMode.value ? 'is-left-minimal' : '',
  isLeftCompactMode.value ? 'is-left-compact' : '',
  officialProps.IsPaneVisible ? '' : 'is-pane-hidden'
]);

let itemRefs = {};
let childrenRefs = {};
let prevSelectedEl = null;
let lastSelectedEl = null;
let lastIsChild = false;
let ro = null;
let layoutObserver = null;
let layoutObserverFrame = null;
let skipTransition = false;
let indicatorAnimationId = 0;
let activeIndicatorTarget = null;
let activeIndicatorGeometry = null;
let indicatorLayoutFrame = null;
let pendingPaneIndicatorSource = null;
let paneIndicatorCommitFrame = null;
let paneClipAnimation = null;
let indicatorHiddenByScroll = false;
let paneTransitionTimer = null;
let paneTransitionGeneration = 0;
// Mirrors NavigationView::m_wasForceClosed: adaptive resize closes do not
// count as a user close, so Auto can reopen the pane on Expanded.
let wasForceClosed = officialProps.IsPaneOpen === false;
let suppressNextTopChildWatcherMove = false;
let lastNavigationPointerDownTime = Number.NEGATIVE_INFINITY;
let lastResizeShellWidth = 0;
let expandedPaneVerticalOffset = 0;
let paneLayoutSyncFrame = null;
let isRestoringPaneScroll = false;

const canGoBack = computed(() => officialProps.IsBackEnabled && officialProps.IsEnabled);

const INDICATOR_SIZE = 16;
const EASE_OUT = 'cubic-bezier(0.1, 0.9, 0.2, 1)';
// Navigation transitions can apply perspective transforms to an ancestor.
// Screen-space rectangles cannot be converted back with a single scale value,
// so measure in layout space and account for scrolling explicitly.
const getLayoutPosition = (element) => {
  let left = 0;
  let top = 0;
  let offsetNode = element;
  while (offsetNode) {
    left += offsetNode.offsetLeft || 0;
    top += offsetNode.offsetTop || 0;
    offsetNode = offsetNode.offsetParent;
  }

  let parent = element?.parentElement;
  while (parent) {
    left -= parent.scrollLeft || 0;
    top -= parent.scrollTop || 0;
    parent = parent.parentElement;
  }

  return { left, top };
};

const getTrackMetrics = (track) => {
  const position = getLayoutPosition(track);
  return {
    left: position.left,
    top: position.top,
    width: track.offsetWidth || 1,
    height: track.offsetHeight || 1
  };
};

const getTrackRelativeRect = (element, track, metrics = getTrackMetrics(track)) => {
  const position = getLayoutPosition(element);
  const left = position.left - metrics.left;
  const top = position.top - metrics.top;
  return {
    left,
    right: left + element.offsetWidth,
    top,
    bottom: top + element.offsetHeight
  };
};

const getIndicatorClip = (element, track, metrics = getTrackMetrics(track)) => {
  const rect = getTrackRelativeRect(element, track, metrics);
  let ancestor = element.parentElement;
  while (ancestor && navRef.value?.contains(ancestor)) {
    const style = getComputedStyle(ancestor);
    if (style.display === 'none' || style.visibility === 'hidden') {
      rect.right = rect.left;
      rect.bottom = rect.top;
      return rect;
    }
    const bounds = getTrackRelativeRect(ancestor, track, metrics);
    if (style.overflowX !== 'visible') {
      rect.left = Math.max(rect.left, bounds.left);
      rect.right = Math.min(rect.right, bounds.right);
    }
    if (style.overflowY !== 'visible') {
      rect.top = Math.max(rect.top, bounds.top);
      rect.bottom = Math.min(rect.bottom, bounds.bottom);
    }
    ancestor = ancestor.parentElement;
  }
  return rect;
};

const getIndicatorPosition = (element, track) => {
  const rect = getTrackRelativeRect(element, track);
  return isTopNavigation.value
    ? { x: (rect.left + rect.right) / 2 - 8, y: 0 }
    : { x: indicatorLeftForElement(element) - 4, y: (rect.top + rect.bottom) / 2 - 8 };
};

const retireOutgoingIndicator = () => {
  const track = outgoingIndicatorTrack.value;
  const indicator = track?.querySelector('.win-nav-indicator');
  indicator?.getAnimations().forEach(animation => animation.cancel());
  if (indicator) {
    indicator.style.opacity = '0';
    indicator.style.translate = '';
  }
  if (track) setIndicatorVisibility(track, isTopNavigation.value ? 'x' : 'y', null);
  if (activeIndicatorGeometry) {
    activeIndicatorGeometry.source = null;
    activeIndicatorGeometry.sourceSnapshot = null;
  }
};

const syncAnimatingIndicatorLayout = () => {
  const geometry = activeIndicatorGeometry;
  const track = indicatorTrack.value;
  const outgoingTrack = outgoingIndicatorTrack.value;
  if (!geometry || !track || !outgoingTrack) return;
  for (const [element, layer, origin] of [
    [geometry.target, track, geometry.targetPosition],
    [geometry.source, outgoingTrack, geometry.sourcePosition]
  ]) {
    if (layer === outgoingTrack && geometry.sourceSnapshot) {
      const indicator = layer.querySelector('.win-nav-indicator');
      indicator.style.translate = '';
      if (!element || !navRef.value?.contains(element)) {
        retireOutgoingIndicator();
        continue;
      }
      // Freeze the source position, but keep the native item host's live clip.
      // A folded child must not paint through the shared indicator layer.
      const currentClip = getIndicatorClip(element, layer);
      const snapshotClip = geometry.sourceSnapshot.clip;
      const clip = {
        left: Math.max(snapshotClip.left, currentClip.left),
        right: Math.min(snapshotClip.right, currentClip.right),
        top: Math.max(snapshotClip.top, currentClip.top),
        bottom: Math.min(snapshotClip.bottom, currentClip.bottom)
      };
      if (clip.left >= clip.right || clip.top >= clip.bottom) retireOutgoingIndicator();
      else setIndicatorVisibility(layer, geometry.axis, clip);
      continue;
    }
    if (!element || !navRef.value?.contains(element)) {
      setIndicatorVisibility(layer, geometry.axis, null);
      continue;
    }
    const position = getIndicatorPosition(element, layer);
    const indicator = layer.querySelector('.win-nav-indicator');
    indicator.style.translate = `${position.x - origin.x}px ${position.y - origin.y}px`;
    const clip = getIndicatorClip(element, layer);
    if (layer === outgoingTrack && (clip.left >= clip.right || clip.top >= clip.bottom)) retireOutgoingIndicator();
    else setIndicatorVisibility(layer, geometry.axis, clip);
  }
};

const clearIndicatorMask = (track) => {
  track.style.maskImage = '';
  track.style.maskSize = '';
  track.style.maskPosition = '';
  track.style.maskRepeat = '';
  track.style.removeProperty('-webkit-mask-image');
  track.style.removeProperty('-webkit-mask-size');
  track.style.removeProperty('-webkit-mask-position');
  track.style.removeProperty('-webkit-mask-repeat');
};

// Each native SelectionIndicator is clipped by its own NavigationViewItem.
// Separate tracks retain that boundary while their composition visuals stretch.
const setIndicatorVisibility = (track, axis, targetRect) => {
  const trackMetrics = getTrackMetrics(track);
  clearIndicatorMask(track);
  if (!targetRect) {
    track.style.clipPath = 'inset(0 100% 0 0)';
    return;
  }
  const left = Math.max(0, Math.min(trackMetrics.width, targetRect.left));
  const right = Math.max(left, Math.min(trackMetrics.width, targetRect.right));
  const top = axis === 'x' ? 0 : Math.max(0, Math.min(trackMetrics.height, targetRect.top));
  const bottom = axis === 'x' ? trackMetrics.height : Math.max(top, Math.min(trackMetrics.height, targetRect.bottom));
  track.style.clipPath = `inset(${top}px ${trackMetrics.width - right}px ${trackMetrics.height - bottom}px ${left}px)`;
};

const setIndicatorRestingStyle = (indicatorEl, style) => {
  const previousStyle = indicatorStyle.value || {};
  for (const property of Object.keys(previousStyle)) {
    if (!(property in style)) indicatorEl.style[property] = '';
  }
  for (const [property, value] of Object.entries(style)) {
    indicatorEl.style[property] = value;
  }
  indicatorStyle.value = style;
};

const nextIndicatorAnimation = (indicatorEl) => {
  indicatorAnimationId += 1;
  indicatorEl?.getAnimations().forEach(a => a.cancel());
  const outgoingIndicator = outgoingIndicatorTrack.value?.querySelector('.win-nav-indicator');
  outgoingIndicator?.getAnimations().forEach(animation => animation.cancel());
  if (outgoingIndicator) {
    outgoingIndicator.style.opacity = '0';
    outgoingIndicator.style.translate = '';
  }
  if (indicatorLayoutFrame) cancelAnimationFrame(indicatorLayoutFrame);
  indicatorLayoutFrame = null;
  activeIndicatorGeometry = null;
  return indicatorAnimationId;
};

const childParentMap = computed(() => {
  const map = {};
  for (const item of flattenedItems.value) {
    if (item.children) {
      for (const child of item.children) {
        map[child.value] = item.value;
      }
    }
  }
  return map;
});

const pendingTopSelectionValue = ref(undefined);
const selectedTopRootValue = computed(() => {
  const value = pendingTopSelectionValue.value === undefined ? props.selectedValue : pendingTopSelectionValue.value;
  let parentGroup = findParentGroup(value);
  if (parentGroup) {
    while (findParentGroup(parentGroup.value)) parentGroup = findParentGroup(parentGroup.value);
    return parentGroup.value;
  }
  return props.menuItems.some(item => item.value === value) ? value : null;
});

const measureTopItemWidth = (value) => {
  const measured = topItemWidths.value[value];
  if (Number.isFinite(measured) && measured > 0) return measured;
  const item = props.menuItems.find(entry => entry.value === value);
  if (!item) return 84;
  const labelWidth = String(item.label || '').length * 7.5;
  const itemChromeWidth = item.icon ? 56 : 32;
  const badgeWidth = item.infoBadge ? 28 : 0;
  const chevronWidth = item.children ? (item.icon ? 24 : 28) : 0;
  return Math.ceil(labelWidth + itemChromeWidth + badgeWidth + chevronWidth);
};

const getTopItemsWidth = (values) => {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + measureTopItemWidth(value), 0);
};

const topLayout = computed(() => {
  if (!isTopNavigation.value) {
    return { visibleValues: props.menuItems.map(item => item.value), overflowValues: [] };
  }

  const orderedValues = props.menuItems.map(item => item.value);
  const available = topAvailableWidth.value;
  if (!Number.isFinite(available)) {
    return { visibleValues: orderedValues, overflowValues: [] };
  }

  const allWidth = getTopItemsWidth(orderedValues);
  if (allWidth <= available) {
    return { visibleValues: orderedValues, overflowValues: [] };
  }

  const selectedRoot = selectedTopRootValue.value;
  const protectedValue = orderedValues.includes(selectedRoot) ? selectedRoot : orderedValues[0];
  const moreReserve = topMoreButtonWidth.value;
  const capacity = Math.max(0, available - moreReserve);
  let visibleValues = [];

  for (const value of orderedValues) {
    const nextValues = [...visibleValues, value];
    const nextFits = getTopItemsWidth(nextValues) <= capacity;
    if (nextFits || value === protectedValue) {
      visibleValues.push(value);
    }
    while (getTopItemsWidth(visibleValues) > capacity && visibleValues.length > 1) {
      const removableIndex = [...visibleValues].reverse().findIndex(value => value !== protectedValue);
      if (removableIndex < 0) break;
      visibleValues.splice(visibleValues.length - 1 - removableIndex, 1);
    }
  }

  if (protectedValue && !visibleValues.includes(protectedValue)) {
    visibleValues = [protectedValue];
  }

  const visibleSet = new Set(visibleValues);
  return {
    visibleValues,
    overflowValues: orderedValues.filter(value => !visibleSet.has(value))
  };
});

const topVisibleMenuItems = computed(() => {
  if (!isTopNavigation.value) return props.menuItems;
  const visibleSet = new Set(topLayout.value.visibleValues);
  return props.menuItems.filter(item => visibleSet.has(item.value));
});

const topOverflowMenuItems = computed(() => {
  if (!isTopNavigation.value) return [];
  const overflowSet = new Set(topLayout.value.overflowValues);
  return props.menuItems.filter(item => overflowSet.has(item.value));
});

const isChildOfGroup = (groupItem) => {
  if (!groupItem.children) return false;
  return flattenItems(groupItem.children).some(c => c.value === visualSelectedValue.value);
};

const findParentGroup = (val) => {
  return flattenedItems.value.find(item => item.children?.some(c => c.value === val));
};

const findNormalizedItem = (value) => {
  return flattenedItems.value.find(item => item.value === value) ?? null;
};

const settingsItem = {
  get Content() { return resolvedSettingsLabel.value; },
  get IsSelected() { return visualSelectedValue.value === props.settingsValue; },
  set IsSelected(value) {
    if (pendingSelectionRequest || Boolean(value) === settingsItem.IsSelected) return;
    if (value) commitNavigationValue(props.settingsValue, { invoked: false, isSettings: true });
    else if (visualSelectedValue.value === props.settingsValue) dependencyPropertySender.SelectedItem = null;
  },
  Tag: props.settingsValue,
  Icon: props.settingsIcon,
  IsSettingsItem: true
};
const createSettingsItem = () => settingsItem;

const getNavigationTransitionIndex = (value, isSettings = false) => {
  if (isSettings || value === settingsValue.value) return props.menuItems.length + props.footerItems.length;
  const parentGroup = findParentGroup(value);
  const effectiveValue = parentGroup && isTopNavigation.value ? parentGroup.value : value;
  const orderedItems = [...props.menuItems, ...props.footerItems];
  return orderedItems.findIndex((item) => item.value === effectiveValue);
};

const createRecommendedNavigationTransitionInfo = (value, isSettings = false) => {
  if (!isTopNavigation.value) return createEntranceNavigationTransitionInfo();

  const oldIndex = getNavigationTransitionIndex(selectedValue.value, selectedValue.value === settingsValue.value);
  const newIndex = getNavigationTransitionIndex(value, isSettings);
  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return createEntranceNavigationTransitionInfo();

  return createSlideNavigationTransitionInfo(newIndex > oldIndex ? 'FromRight' : 'FromLeft');
};

let pendingSelectionRequest = null;
let selectionVisualGeneration = 0;
let navigationViewUnmounted = false;
let invocationPress = null;
let pressedElement = null;
let pressedReleaseFrame = null;

const clearCommittedItemPress = () => {
  if (pressedReleaseFrame) cancelAnimationFrame(pressedReleaseFrame);
  pressedReleaseFrame = null;
  pressedItemValue.value = null;
  if (!pressedElement) return;
  pressedElement.classList.remove('is-pressed');
  itemIconInput.PointerReleased({ currentTarget: pressedElement });
  const chevron = pressedElement.querySelector('.win-nav-group-chevron');
  if (chevron) groupChevronInput.PointerReleased({ currentTarget: chevron });
  pressedElement = null;
};

const invokeNavigationItem = (element, event, action) => {
  const previousPress = invocationPress;
  invocationPress = { element, value: getValueForElement(element), pointerType: event.pointerType ?? 'mouse' };
  try { return action(); }
  finally { invocationPress = previousPress; }
};

const showCommittedItemPress = (press, targetValue) => {
  clearCommittedItemPress();
  if (!press || navigationViewUnmounted) return;
  const element = press.element?.isConnected ? press.element : itemRefs[press.value] ?? itemRefs[targetValue];
  if (!element || element.classList.contains('is-disabled')) return;
  pressedElement = element;
  pressedItemValue.value = getValueForElement(element);
  element.classList.add('is-pressed');
  const input = { currentTarget: element, button: 0, pointerType: press.pointerType };
  if (element.matches(':hover')) itemIconInput.PointerEntered(input);
  if (!element.classList.contains('win-nav-settings-item')) itemIconInput.PointerPressed(input);
  const chevron = element.querySelector('.win-nav-group-chevron');
  if (chevron) groupChevronInput.PointerPressed({ ...input, currentTarget: chevron });
  // The click has already released. Present its deferred Pressed state for
  // a paint, then restore the current pointer/keyboard state.
  pressedReleaseFrame = requestAnimationFrame(() => {
    pressedReleaseFrame = requestAnimationFrame(clearCommittedItemPress);
  });
};

const completeNavigationSelection = async (request) => {
  try {
    const completed = await request.commit.completion;
    if (navigationViewUnmounted || pendingSelectionRequest !== request) return;
    if (!completed) {
      const restoreFromBinding = (request.boundRouteNavigation || request.commit.hasRouteNavigation) && declaredProps.SelectedItem != null;
      const restoredItem = restoreFromBinding ? resolveXamlValue(declaredProps.SelectedItem, componentInstance) : request.previousItem;
      if (request.hadLocalSelectedItem && !restoreFromBinding) localProperties.SelectedItem = request.previousLocalSelectedItem;
      else delete localProperties.SelectedItem;
      internalSelectedItem.value = restoredItem;
      visualSelectedValue.value = resolveSelectedValue(restoredItem);
      updateXamlBinding(declaredProps.SelectedItem, restoredItem, componentInstance);
      emit('update:SelectedItem', restoredItem);
      await nextTick();
      if (pendingSelectionRequest === request) pendingSelectionRequest = null;
      pendingTopSelectionValue.value = undefined;
      if (resolveSelectedValue(restoredItem) !== request.previousValue) syncIndicatorForSelectedItem();
      return;
    }
    prepareSelectionTarget(request.value);
    pendingTopSelectionValue.value = request.value;
    await nextTick();
    updateTopNavigationLayout();
    await nextTick();
    if (navigationViewUnmounted || pendingSelectionRequest !== request) return;
    pendingSelectionRequest = null;
    pendingTopSelectionValue.value = undefined;
    visualSelectedValue.value = request.value;
    if (request.value === null || request.value === undefined || request.value === '') {
      lastSelectedEl = null;
      lastIsChild = false;
      indicatorStyle.value = { opacity: '0', transition: 'none' };
      return;
    }
    const target = getIndicatorTargetForValue(request.value);
    showCommittedItemPress(request.press, target.value);
    const compactPaneCollapsed = request.collapsePane && !isLeftMinimalMode.value && collapseOverlayAfterNavigation();
    if (isLeftMinimalMode.value && isCompact.value && paneTransition.value !== 'closing') {
      lastSelectedEl = itemRefs[target.value] || null;
      lastIsChild = target.isChild;
      indicatorStyle.value = { opacity: '0', transition: 'none' };
    } else if (!compactPaneCollapsed) {
      moveIndicatorTo(target.value, target.isChild);
    }
    if (request.collapsePane && isLeftMinimalMode.value) collapseOverlayAfterNavigation();
    await nextTick();
  } finally {
    if (pendingSelectionRequest === request) {
      pendingSelectionRequest = null;
      pendingTopSelectionValue.value = undefined;
    }
    request.commit.release();
  }
};

// Native navigation completes synchronously. Retain the previous indicator
// until the browser's Frame/router has committed the destination Page.
const dispatchNavigationSelection = (value, action, collapsePane = false, externalBinding = false) => {
  if (pendingSelectionRequest || navigationViewUnmounted) return false;
  clearCommittedItemPress();
  releaseAnimatedIconPresses();
  const request = {
    press: invocationPress,
    value, collapsePane, boundRouteNavigation: externalBinding && hasPendingRouteNavigation(), previousValue: selectedValue.value,
    previousItem: internalSelectedItem.value,
    hadLocalSelectedItem: Object.prototype.hasOwnProperty.call(localProperties, 'SelectedItem'),
    previousLocalSelectedItem: localProperties.SelectedItem, commit: null
  };
  visualSelectedValue.value = request.previousValue;
  selectionVisualGeneration += 1;
  pendingTopSelectionValue.value = request.previousValue;
  pendingSelectionRequest = request;
  try {
    const previousCompletion = pendingNavigationCompletion();
    const routeCompletion = externalBinding ? pendingRouteNavigationCompletion() : Promise.resolve(true);
    request.commit = captureFrameNavigationCommit(action);
    synchronizeItemSelection(visualSelectedValue.value);
    // Other Frames are a layout barrier; only this selection's navigation can fail it.
    request.commit.completion = Promise.all([previousCompletion, routeCompletion, request.commit.completion])
      .then(([, routeCompleted, selectionCompleted]) => routeCompleted && selectionCompleted);
  } catch (error) {
    pendingSelectionRequest = null;
    pendingTopSelectionValue.value = undefined;
    throw error;
  }
  if (request.commit.result === false) {
    request.collapsePane = false;
    request.value = request.previousValue;
    request.press = null;
  }
  void completeNavigationSelection(request);
  return request.commit.result !== false;
};

const commitNavigationValue = (value, { invoked = true, isSettings = false, collapsePane = false } = {}) => {
  if (pendingSelectionRequest) return false;
  const normalizedItem = isSettings ? null : findNormalizedItem(value);
  const item = isSettings ? createSettingsItem() : normalizedItem?.source;
  if (!item) return false;
  if (!isSettings && normalizedItem.isEnabled === false) return false;
  const RecommendedNavigationTransitionInfo = createRecommendedNavigationTransitionInfo(value, isSettings);

  const shouldCollapsePane = collapsePane && (isSettings || !normalizedItem?.hasChildren);
  return dispatchNavigationSelection(value, () => {
    if (invoked) {
      emit('ItemInvoked', {
        InvokedItem: normalizedItem?.container?.Content ?? item.Content,
        IsSettingsInvoked: isSettings,
        InvokedItemContainer: normalizedItem?.container ?? item,
        RecommendedNavigationTransitionInfo
      });
    }

    if (!isSettings && normalizedItem.selectsOnInvoked === false) return false;
    if (selectedValue.value === value) return true;

    internalSelectedItem.value = item;
    updateXamlBinding(declaredProps.SelectedItem, item, componentInstance);
    emit('update:SelectedItem', item);
    emit('SelectionChanged', {
      SelectedItem: item,
      IsSettingsSelected: isSettings,
      SelectedItemContainer: normalizedItem?.container ?? item,
      RecommendedNavigationTransitionInfo
    });
    return true;
  }, shouldCollapsePane);
};

const isFooterValue = (value) => {
  return value === settingsValue.value || props.footerItems.some(item => item.value === value);
};

const getValueForElement = (el) => {
  const declared = el?.getAttribute?.('data-navigation-value');
  if (declared) return declared;
  for (const [value, itemEl] of Object.entries(itemRefs)) {
    if (itemEl === el) return value;
  }
  return null;
};

const setItemRef = (value, el) => {
  if (el) {
    itemRefs[value] = el;
  } else {
    delete itemRefs[value];
  }
};

const setChildrenRef = (value, el) => {
  if (el) {
    childrenRefs[value] = el;
  } else {
    delete childrenRefs[value];
  }
};

const Expand = (item) => {
  const value = resolveSelectedValue(item);
  const normalizedItem = findNormalizedItem(value);
  if (!normalizedItem?.hasChildren) return;
  if (groupExpanded[value]) {
    delete manuallyCollapsedGroups[value];
    return;
  }
  emit('Expanding', { ExpandingItemContainer: normalizedItem.container, ExpandingItem: normalizedItem.source });
  delete manuallyCollapsedGroups[value];
  groupExpanded[value] = true;
  if (normalizedItem.container && normalizedItem.container.IsExpanded !== true) normalizedItem.container.IsExpanded = true;
  nextTick(() => measureGroup(value));
  nextTick(() => {
    const item = findNormalizedItem(value);
    const compactTopLevelItem = isClosedCompact.value && !findParentGroup(value);
    const topPrimaryItem = isTopNavigation.value && topVisibleMenuItems.value.some(candidate => candidate.value === value);
    if (item && groupExpanded[value] && (compactTopLevelItem || topPrimaryItem) && !(flyoutOpen.value && flyoutGroupValue.value === value)) showChildrenFlyout(item);
  });
};

const Collapse = (item) => {
  const value = resolveSelectedValue(item);
  const normalizedItem = findNormalizedItem(value);
  if (!normalizedItem?.hasChildren || !groupExpanded[value]) return;
  manuallyCollapsedGroups[value] = true;
  groupExpanded[value] = false;
  if (normalizedItem.container && normalizedItem.container.IsExpanded !== false) normalizedItem.container.IsExpanded = false;
  emit('Collapsed', { CollapsedItemContainer: normalizedItem.container, CollapsedItem: normalizedItem.source });
  nextTick(() => measureGroup(value));
  if (flyoutOpen.value && flyoutGroupValue.value === value) closeFlyout();
};

const MenuItemFromContainer = container => {
  const value = container?.IsSettingsItem ? props.settingsValue
    : container?.nodeType ? getValueForElement(container) : resolveSelectedValue(container);
  return value === props.settingsValue ? createSettingsItem() : findNormalizedItem(value)?.source ?? null;
};

const ContainerFromMenuItem = item => {
  const value = resolveSelectedValue(item);
  return value === props.settingsValue ? settingsItem : findNormalizedItem(value)?.container ?? null;
};

const controlSender = {
  DisplayMode: displayMode,
  SettingsItem: computed(createSettingsItem),
  TemplateSettings: computed(() => ({
    TopPadding: 0,
    OverflowButtonVisibility: topOverflowMenuItems.value.length ? 'Visible' : 'Collapsed',
    PaneToggleButtonVisibility: isPaneToggleButtonVisible.value && !isTopNavigation.value ? 'Visible' : 'Collapsed',
    BackButtonVisibility: showBackButtonResolved.value ? 'Visible' : 'Collapsed',
    TopPaneVisibility: officialProps.IsPaneVisible && isTopNavigation.value ? 'Visible' : 'Collapsed',
    LeftPaneVisibility: officialProps.IsPaneVisible && !isTopNavigation.value ? 'Visible' : 'Collapsed',
    SingleSelectionFollowsFocus: officialProps.SelectionFollowsFocus === 'Enabled',
    PaneToggleButtonWidth: officialProps.CompactPaneLength,
    SmallerPaneToggleButtonWidth: Math.max(0, officialProps.CompactPaneLength - 8),
    OpenPaneLength: Math.min(officialProps.OpenPaneLength, containerWidth.value || officialProps.OpenPaneLength)
  })),
  MenuItemFromContainer,
  ContainerFromMenuItem,
  Expand,
  Collapse
};
for (const property of Object.keys(declaredProps)) {
  controlSender[property] = computed({
    get: () => property === 'SelectedItem' ? internalSelectedItem.value : property === 'IsPaneOpen' ? !isCompact.value
      : property === 'MenuItems' ? menuItems.value.map(item => item.source)
      : property === 'FooterMenuItems' ? footerItems.value.map(item => item.source)
      : !Object.prototype.hasOwnProperty.call(localProperties, property) && ['AutoSuggestBox', 'PaneHeader', 'PaneFooter', 'PaneCustomContent', 'ContentOverlay'].includes(property)
        ? propertyNodes(property.charAt(0).toLowerCase() + property.slice(1))[0] ?? officialProps[property] : officialProps[property],
    set: value => {
      const previousSelection = property === 'SelectedItem' ? selectedValue.value : null;
      const nextSelection = property === 'SelectedItem' ? resolveSelectedValue(value) : null;
      const transition = property === 'SelectedItem' ? createRecommendedNavigationTransitionInfo(nextSelection, nextSelection === props.settingsValue) : null;
      if (property === 'SelectedItem') {
        const setSelection = () => {
          localProperties.SelectedItem = isVNode(value) ? markRaw(value) : value;
          internalSelectedItem.value = value;
          updateXamlBinding(declaredProps.SelectedItem, value, componentInstance);
          emit('update:SelectedItem', value);
        };
        if (pendingSelectionRequest) {
          pendingSelectionRequest.value = nextSelection;
          setSelection();
        } else if (previousSelection !== nextSelection) {
          dispatchNavigationSelection(nextSelection, () => {
            setSelection();
            const item = findNormalizedItem(nextSelection);
            emit('SelectionChanged', { SelectedItem: value, SelectedItemContainer: item?.container ?? (nextSelection === props.settingsValue ? settingsItem : null), IsSettingsSelected: nextSelection === props.settingsValue, RecommendedNavigationTransitionInfo: transition });
            return true;
          });
        } else setSelection();
        return;
      }
      if (property === 'IsPaneOpen' && !setCompact(!value)) return;
      localProperties[property] = isVNode(value) ? markRaw(value) : value;
      if (property !== 'IsPaneOpen') updateXamlBinding(declaredProps[property], value, componentInstance);
    }
  });
}
// XAML handlers receive an object with dependency-property values, not refs.
const dependencyPropertySender = new Proxy(controlSender, {
  get: (target, property) => target[property]?.__v_isRef ? target[property].value : target[property],
  set: (target, property, value) => {
    if (target[property]?.__v_isRef) { target[property].value = value; return true; }
    target[property] = value; return true;
  }
});
defineExpose(controlSender);
for (const property of Object.keys(declaredProps)) {
  watch(() => resolveXamlValue(declaredProps[property], componentInstance), value => {
    if (property in localProperties && localProperties[property] !== value) delete localProperties[property];
  });
}

const measureGroupContent = (value) => {
  const inner = childrenRefs[value];
  if (!inner) return groupHeights[value] ?? 0;
  const outerHeight = element => {
    const style = getComputedStyle(element);
    return element.offsetHeight + (Number.parseFloat(style.marginTop) || 0) + (Number.parseFloat(style.marginBottom) || 0);
  };
  const rows = Array.from(inner.children);
  const innerStyle = getComputedStyle(inner);
  let height = (Number.parseFloat(innerStyle.paddingTop) || 0) + (Number.parseFloat(innerStyle.paddingBottom) || 0);
  height += Math.max(0, rows.length - 1) * (Number.parseFloat(innerStyle.rowGap) || 0);
  for (const row of rows) {
    if (!row.classList.contains('win-nav-group')) {
      height += outerHeight(row);
      continue;
    }
    const presenter = row.firstElementChild;
    if (!presenter) continue;
    const childValue = getValueForElement(presenter);
    const childHeight = measureGroupContent(childValue);
    height += outerHeight(presenter);
    // Measure the final hierarchy, rather than the descendant's in-flight
    // height. Every ancestor then shares the same expansion target and timing.
    if (groupExpanded[childValue] && isPaneGroupChildrenVisible.value) height += childHeight;
  }
  groupHeights[value] = height;
  return height;
};

const measureGroup = (value) => {
  measureGroupContent(value);
  let ancestor = findParentGroup(value);
  while (ancestor) {
    measureGroupContent(ancestor.value);
    ancestor = findParentGroup(ancestor.value);
  }
};

const measureAllGroups = () => {
  for (const item of [...props.menuItems, ...props.footerItems]) {
    if (item.children) measureGroupContent(item.value);
  }
};

const collapseOverlayAfterNavigation = () => {
  if (!isLeftOverlayMode.value || isCompact.value) return false;
  return ClosePane();
};

const getIndicatorTargetForValue = (value) => {
  let parentGroup = findParentGroup(value);
  if (parentGroup && (isTopNavigation.value || isClosedCompact.value)) {
    while (findParentGroup(parentGroup.value)) parentGroup = findParentGroup(parentGroup.value);
    return { value: parentGroup.value, isChild: false };
  }
  let collapsedParent = parentGroup;
  let visibleCollapsedParent = null;
  while (collapsedParent) {
    if (!groupExpanded[collapsedParent.value]) visibleCollapsedParent = collapsedParent;
    collapsedParent = findParentGroup(collapsedParent.value);
  }
  if (visibleCollapsedParent) return { value: visibleCollapsedParent.value, isChild: Boolean(findParentGroup(visibleCollapsedParent.value)) };
  return { value, isChild: !!parentGroup };
};
const indicatorLeftForElement = element => {
  let depth = 0;
  let parent = findParentGroup(getValueForElement(element));
  while (parent) { depth += 1; parent = findParentGroup(parent.value); }
  return 4 + depth * 31;
};
const leftIndicatorStyle = computed(() => ({ ...indicatorStyle.value, left: `${indicatorLeftPx.value}px` }));

const moveIndicatorForValue = (value) => {
  const target = getIndicatorTargetForValue(value);
  moveIndicatorTo(target.value, target.isChild);
};

const prepareSelectionTarget = (value) => {
  let parentGroup = findParentGroup(value);
  while (parentGroup && !isTopNavigation.value && !isClosedCompact.value) {
    delete manuallyCollapsedGroups[parentGroup.value];
    groupExpanded[parentGroup.value] = true;
    const groupValue = parentGroup.value;
    nextTick(() => measureGroup(groupValue));
    parentGroup = findParentGroup(parentGroup.value);
  }
};

const syncIndicatorForSelectedItem = (value, { collapsePane = false } = {}) => {
  if (pendingSelectionRequest || navigationViewUnmounted) return;
  const generation = selectionVisualGeneration;
  if (value === null || value === undefined || value === '') {
    lastSelectedEl = null;
    lastIsChild = false;
    indicatorHiddenByScroll = false;
    indicatorStyle.value = { opacity: '0', transition: 'none' };
    return;
  }

  prepareSelectionTarget(value);
  nextTick(() => {
    if (pendingSelectionRequest || generation !== selectionVisualGeneration || navigationViewUnmounted) return;
    updateTopNavigationLayout();
    nextTick(() => {
      if (pendingSelectionRequest || generation !== selectionVisualGeneration || navigationViewUnmounted) return;
      const target = getIndicatorTargetForValue(value);
      if (isLeftMinimalMode.value && isCompact.value && paneTransition.value !== 'closing') {
        lastSelectedEl = itemRefs[target.value] || null;
        lastIsChild = target.isChild;
        indicatorIsChild.value = target.isChild;
        indicatorHiddenByScroll = false;
        indicatorStyle.value = { opacity: '0', transition: 'none' };
        return;
      }
      const compactPaneCollapsed = collapsePane && !isLeftMinimalMode.value && collapseOverlayAfterNavigation();
      if (!compactPaneCollapsed) moveIndicatorTo(target.value, target.isChild);
      if (collapsePane && isLeftMinimalMode.value) collapseOverlayAfterNavigation();
    });
  });
};

const selectNavigationValue = (value, isChild = null, { collapsePane = true } = {}) => {
  commitNavigationValue(value, { collapsePane });
};

const onItemClick = (item) => {
  if (!item.isEnabled) return;
  selectNavigationValue(item.value, false);
};

const onChildClick = (group, child) => {
  if (!child.isEnabled) return;
  selectNavigationValue(child.value, true);
};

const onNavigationKeydown = (event) => {
  lastNavigationPointerDownTime = Number.NEGATIVE_INFINITY;
  if (event.key === ' ' && event.altKey) return;
  if ((event.key === 'Enter' || event.key === ' ') && event.repeat) { event.preventDefault(); return; }
  if (event.key === 'Escape' && (flyoutOpen.value || moreFlyoutOpen.value || isLeftOverlayMode.value && !isCompact.value)) {
    event.preventDefault();
    if (flyoutOpen.value) closeFlyout();
    else if (moreFlyoutOpen.value) closeMoreFlyout();
    else ClosePane();
    return;
  }
  const target = event.target?.closest?.('.win-nav-item');
  if (!target) return;
  const menu = target.closest('.win-nav-more-panel') ?? navRef.value;
  const interactive = Array.from(menu?.querySelectorAll('.win-nav-item:not(.is-disabled)') ?? [])
    .filter(element => element.getClientRects().length && !element.closest('[inert]') && !element.closest('.win-nav-top-measure'));
  const index = interactive.indexOf(target);
  const value = getValueForElement(target);
  const item = findNormalizedItem(value);
  const horizontal = isTopNavigation.value && !target.closest('.win-nav-more-panel');
  if (event.key === 'Escape') {
    event.preventDefault();
    if (flyoutOpen.value) closeFlyout();
    else if (moreFlyoutOpen.value) closeMoreFlyout();
    else if (isLeftOverlayMode.value && !isCompact.value) ClosePane();
    return;
  }
  const forward = horizontal ? 'ArrowRight' : 'ArrowDown';
  const backward = horizontal ? 'ArrowLeft' : 'ArrowUp';
  if ([forward, backward, 'Home', 'End'].includes(event.key)) {
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? interactive.length - 1 : index + (event.key === forward ? 1 : -1);
    interactive[Math.max(0, Math.min(interactive.length - 1, next))]?.focus({ preventScroll: true });
    return;
  }
  if (!horizontal && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
    event.preventDefault();
    if (event.key === 'ArrowRight' && item?.hasChildren) {
      if (!groupExpanded[value]) Expand(item.container);
      else nextTick(() => itemRefs[item.children?.find(child => child.isEnabled)?.value]?.focus({ preventScroll: true }));
    } else if (event.key === 'ArrowLeft') {
      if (item?.hasChildren && groupExpanded[value]) Collapse(item.container);
      else itemRefs[findParentGroup(value)?.value]?.focus({ preventScroll: true });
    }
    return;
  }
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  if (target === moreButtonRef.value) { toggleMoreFlyout(); return; }
  if (!value) return;
  invokeNavigationItem(target, event, () => {
    if (value === settingsValue.value) { selectSettings(); return; }
    if (!item || !item.isEnabled) return;
    const parentGroup = findParentGroup(value);
    if (target.closest('.win-nav-more-panel')) {
      if (item.hasChildren) onMoreGroupHeaderClick(item); else { closeFlyout(); onMoreItemClick(item); }
    } else if (item.hasChildren) {
      onGroupHeaderClick(item);
    } else if (parentGroup) {
      onChildClick(parentGroup, item);
    } else {
      onItemClick(item);
    }
  });
};

const onNavigationPointerDown = () => {
  lastNavigationPointerDownTime = performance.now();
};

const onNavigationFocusIn = (event) => {
  if (officialProps.SelectionFollowsFocus !== 'Enabled') return;
  const target = event.target?.closest?.('.win-nav-item');
  if (!target || target.classList.contains('is-disabled')) return;
  // Pointer focus is followed by click invocation. Handling both would move
  // the indicator during focusin, leaving the click with no distance to animate.
  // WebKit can report touch focus as :focus-visible, so input modality must be
  // tracked independently instead of relying on that selector alone.
  if (performance.now() - lastNavigationPointerDownTime < 1000) return;
  if (!target.matches(':focus-visible')) return;
  const value = getValueForElement(target);
  if (!value || value === selectedValue.value || isTopNavigation.value && target.closest('.win-nav-overflow-panel')) return;

  if (value === settingsValue.value) {
    selectSettings();
    return;
  }

  const item = findNormalizedItem(value);
  if (!item || !item.isEnabled || !item.selectsOnInvoked) return;
  commitNavigationValue(item.value, { collapsePane: false });
};

const updateTopNavigationLayout = () => {
  if (!isTopNavigation.value) return;

  const navEl = navRef.value;
  const footerEl = topFooterMenuRef.value;
  const topBackEl = topBackButtonRef.value;
  const measureEl = topMeasureRef.value;
  if (!navEl) return;

  const navWidth = navEl.clientWidth || navEl.offsetWidth;
  const footerWidth = footerEl?.offsetWidth || 0;
  const topBackWidth = topBackEl?.offsetWidth || 0;
  const fixedContentWidth = Array.from(navEl.children)
    .filter(el => el.classList.contains('win-nav-top-fixed'))
    .reduce((width, el) => width + el.offsetWidth, 0);
  const customElement = navEl.querySelector('.win-nav-top-pane-custom-content');
  let customWidth = 48;
  if (customElement?.children.length) {
    // The star column stretches to consume leftover space. Measure its
    // content at its desired width instead of subtracting that arranged space.
    const measurement = customElement.cloneNode(true);
    Object.assign(measurement.style, {
      position: 'fixed', left: '-10000px', top: '0', visibility: 'hidden',
      pointerEvents: 'none', width: 'max-content', minWidth: '0', maxWidth: 'none',
      flex: 'none', font: getComputedStyle(customElement).font
    });
    document.body.appendChild(measurement);
    try { customWidth = Math.max(48, measurement.scrollWidth); }
    finally { measurement.remove(); }
  }
  const nextAvailableWidth = Math.max(0, navWidth - footerWidth - topBackWidth - fixedContentWidth - customWidth);
  if (Math.abs(topAvailableWidth.value - nextAvailableWidth) >= 0.5) {
    topAvailableWidth.value = nextAvailableWidth;
  }

  if (measureEl) {
    const nextWidths = {};
    measureEl.querySelectorAll('[data-value]').forEach((el) => {
      const value = el.getAttribute('data-value');
      const style = getComputedStyle(el);
      const marginWidth = Number.parseFloat(style.marginLeft || '0') + Number.parseFloat(style.marginRight || '0');
      const width = Math.ceil(el.offsetWidth + marginWidth);
      if (value === '__more') {
        topMoreButtonWidth.value = width;
      } else if (value) {
        nextWidths[value] = width;
      }
    });
    const previousWidths = topItemWidths.value;
    const nextKeys = Object.keys(nextWidths);
    const widthsChanged = Object.keys(previousWidths).length !== nextKeys.length
      || nextKeys.some(value => previousWidths[value] !== nextWidths[value]);
    if (widthsChanged) topItemWidths.value = nextWidths;
  }
};

let flyoutFocusFrame = null;
let flyoutFocusVersion = 0;
const cancelFlyoutFocus = () => {
  flyoutFocusVersion += 1;
  if (flyoutFocusFrame) cancelAnimationFrame(flyoutFocusFrame);
  flyoutFocusFrame = null;
};
const focusFlyoutItems = (overflow = false) => {
  cancelFlyoutFocus();
  const version = flyoutFocusVersion;
  // Flyout.Opened runs after its content is mounted and positioned. Retain a
  // version guard so a close or a new popup cannot receive the old focus task.
  nextTick(() => {
    if (version !== flyoutFocusVersion) return;
    flyoutFocusFrame = requestAnimationFrame(() => {
      flyoutFocusFrame = null;
      if (version !== flyoutFocusVersion || !(overflow ? moreFlyoutOpen.value : flyoutOpen.value)) return;
      const panel = document.querySelector(`.flyout-presenter ${overflow ? '.win-nav-overflow-panel' : '.win-nav-more-panel:not(.win-nav-overflow-panel)'}[data-navigation-owner="${componentInstance.uid}"]`);
      panel?.querySelector('.win-nav-item:not(.is-disabled)')?.focus({ preventScroll: true });
    });
  });
};

const openMoreFlyout = () => {
  const el = moreButtonRef.value;
  if (!el) return;
  closeFlyout();
  moreFlyoutItems.value = topOverflowMenuItems.value.slice();
  moreFlyoutOpen.value = true;
  const version = ++flyoutShowVersion;
  nextTick(() => {
    if (version === flyoutShowVersion && moreFlyoutOpen.value) overflowFlyoutRef.value?.ShowAt(el, { Placement: 'BottomEdgeAlignedRight' });
  });
};

const finishMoreFlyoutClosing = () => {
  if (!moreFlyoutOpen.value) return;
  flyoutShowVersion += 1;
  cancelFlyoutFocus();
  moreFlyoutOpen.value = false;
};
const closeMoreFlyout = () => {
  if (overflowFlyoutRef.value?.IsOpen) overflowFlyoutRef.value.Hide();
  else finishMoreFlyoutClosing();
};

const toggleMoreFlyout = () => {
  if (moreFlyoutOpen.value) {
    closeMoreFlyout();
  } else {
    openMoreFlyout();
  }
};

const onMoreItemClick = (item) => {
  if (!item.isEnabled) return;
  closeMoreFlyout();
  selectNavigationValue(item.value, false);
};

const onMoreChildClick = (group, child) => {
  if (!child.isEnabled) return;
  closeMoreFlyout();
  selectNavigationValue(child.value, true);
};

const onMoreGroupHeaderClick = (item) => {
  if (!item.isEnabled) return;
  if (item.selectsOnInvoked) selectNavigationValue(item.value, false, { collapsePane: false });
  else commitNavigationValue(item.value);
  if (groupExpanded[item.value]) Collapse(item.container); else Expand(item.container);
};

const onMoreGroupChevronClick = (item) => {
  if (!item.isEnabled) return;
  if (groupExpanded[item.value]) Collapse(item.source); else Expand(item.source);
};

const toggleLeftGroup = (item) => {
  const wasExpanded = groupExpanded[item.value];
  const selectedChild = isChildOfGroup(item);

  if (wasExpanded) {
    manuallyCollapsedGroups[item.value] = true;
    Collapse(item.source);
  } else {
    delete manuallyCollapsedGroups[item.value];
    Expand(item.source);
  }
  nextTick(() => measureGroup(item.value));
  if (selectedChild) {
    nextTick(() => {
      measureGroup(item.value);
      const target = wasExpanded ? itemRefs[item.value] : itemRefs[props.selectedValue];
      if (!target) return;
      prevSelectedEl = lastSelectedEl;
      lastSelectedEl = target;
      lastIsChild = !wasExpanded;
      if (wasExpanded) {
        if (!animatePaneIndicatorTransition({
          target,
          targetIsChild: false
        })) {
          skipTransition = true;
          calcIndicator();
          requestAnimationFrame(() => { skipTransition = false; });
        }
        return;
      }
      if (!animatePaneIndicatorTransition({
        target,
        targetIsChild: true
      })) {
        skipTransition = true;
        calcIndicator();
        requestAnimationFrame(() => { skipTransition = false; });
      }
    });
  } else {
    trackIndicatorDuringTransition();
  }
};

const onGroupChevronClick = (item) => {
  if (!item.isEnabled) return;
  if (isTopNavigation.value || isCompact.value) {
    onGroupHeaderClick(item, false);
    return;
  }
  toggleLeftGroup(item);
};

const showChildrenFlyout = item => {
  closeMoreFlyout();
  if (flyoutOpen.value) closeFlyout();
  const element = itemRefs[item.value];
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const paneRect = navRef.value?.getBoundingClientRect();
  const options = { Placement: flyoutPlacement.value };
  if (!isTopNavigation.value) options.Position = {
    X: (paneRect?.left ?? rect.left) + Number(props.compactPaneLength) - rect.left,
    Y: 0
  };
  flyoutGroupValue.value = item.value;
  Expand(item.container);
  flyoutOpen.value = true;
  const version = ++flyoutShowVersion;
  nextTick(() => {
    if (version === flyoutShowVersion && flyoutOpen.value && flyoutGroupValue.value === item.value) childrenFlyoutRef.value?.ShowAt(element, options);
  });
};

const onGroupHeaderClick = (item, invokeItem = true) => {
  if (!item.isEnabled) return;
  if (invokeItem) {
    if (item.selectsOnInvoked) selectNavigationValue(item.value, false, { collapsePane: false });
    else commitNavigationValue(item.value);
  }
  if (isTopNavigation.value || isClosedCompact.value) {
    if (flyoutOpen.value && flyoutGroupValue.value === item.value) closeFlyout();
    else showChildrenFlyout(item);
    return;
  }
  toggleLeftGroup(item);
};

let trackingRaf = null;
const trackIndicatorDuringTransition = () => {
  if (trackingRaf) cancelAnimationFrame(trackingRaf);
  const track = indicatorTrack.value;
  const indicatorEl = track?.querySelector('.win-nav-indicator');
  if (!track || !indicatorEl || !lastSelectedEl || !navRef.value) return;
  const startTime = performance.now();
  const duration = 350;
  const tick = () => {
    if (!lastSelectedEl || !navRef.value || !navRef.value.contains(lastSelectedEl)) {
      trackingRaf = null;
      return;
    }
    const targetRect = getTrackRelativeRect(lastSelectedEl, track);
    const newY = targetRect.top + (targetRect.bottom - targetRect.top) / 2 - 8;
    if (indicatorEl.getAnimations().some(animation => animation.playState === 'running')) {
      syncAnimatingIndicatorLayout();
    } else {
      setIndicatorVisibility(track, 'y', getIndicatorClip(lastSelectedEl, track));
      indicatorStyle.value = { transform: `translate3d(${indicatorLeftForElement(lastSelectedEl) - 4}px,${newY}px,0)`, height: '16px', opacity: '1', transition: 'none' };
    }
    if (performance.now() - startTime < duration) {
      trackingRaf = requestAnimationFrame(tick);
    } else {
      trackingRaf = null;
    }
  };
  trackingRaf = requestAnimationFrame(tick);
};

const finishChildrenFlyoutClosing = () => {
  const wasOpen = flyoutOpen.value;
  if (!wasOpen) return;
  flyoutShowVersion += 1;
  cancelFlyoutFocus();
  flyoutOpen.value = false;
  if (flyoutGroupValue.value) {
    const group = findNormalizedItem(flyoutGroupValue.value);
    if (wasOpen && group) Collapse(group.container);
  }
};
const closeFlyout = () => {
  if (childrenFlyoutRef.value?.IsOpen) childrenFlyoutRef.value.Hide();
  else finishChildrenFlyoutClosing();
};


const moveIndicatorTo = (value, isChild) => {
  const el = itemRefs[value];
  if (!el) return;
  moveIndicatorToEl(el, isChild);
};

const moveIndicatorToEl = (el, isChild) => {
  if (pendingSelectionRequest || navigationViewUnmounted) return;
  prevSelectedEl = lastSelectedEl;
  lastSelectedEl = el;
  lastIsChild = isChild;
  calcIndicator({ animateSelectionChange: true });
};

const goBack = () => {
  if (canGoBack.value) emit('BackRequested', {});
};

const onBackClick = () => {
  if (!canGoBack.value) return;
  goBack();
};

const selectSettings = () => {
  if (!isSettingsVisible.value || officialProps.IsEnabled === false) return;
  commitNavigationValue(settingsValue.value, { isSettings: true, collapsePane: true });
};

const toggleCompact = () => {
  if (officialProps.IsEnabled === false) return;
  if (isCompact.value) {
    wasForceClosed = false;
    OpenPane();
  } else {
    wasForceClosed = true;
    ClosePane();
  }
};

const setCompact = (compact, emitUpdate = true) => {
  if (compact === isCompact.value) return true;
  if (compact) {
    const args = { Cancel: false };
    emit('PaneClosing', args);
    if (args.Cancel) return false;
  } else {
    emit('PaneOpening', {});
  }
  const pane = navRef.value;
  const sourceClip = pane ? getComputedStyle(pane).clipPath : null;
  if (isLeftMinimalMode.value && pane) {
    const surface = pane.querySelector('.win-nav-pane-surface');
    const visual = surface ? getComputedStyle(surface) : null;
    const sourceTransform = visual && visual.display !== 'none'
      ? visual.transform === 'none' ? 'translateX(0)' : visual.transform
      : 'translateX(calc(-1 * var(--win-nav-open-pane-length, 320px)))';
    pane.style.setProperty('--win-nav-pane-transition-start', sourceTransform);
  }
  paneClipAnimation?.cancel();
  paneClipAnimation = null;
  const phase = compact ? 'closing' : 'opening';
  const generation = ++paneTransitionGeneration;
  paneTransition.value = phase;
  if (paneTransitionTimer) clearTimeout(paneTransitionTimer);
  paneTransitionTimer = null;
  const transitionDuration = paneTransitionDurationMs(compact);
  isCompact.value = compact;
  nextTick(() => {
    if (!pane?.isConnected || navigationViewUnmounted || generation !== paneTransitionGeneration || paneTransition.value !== phase || isCompact.value !== compact) return;
    const finish = () => {
      if (generation !== paneTransitionGeneration || navigationViewUnmounted || paneTransition.value !== phase) return;
      if (compact) {
        const indicator = indicatorTrack.value?.querySelector('.win-nav-indicator');
        if (isLeftMinimalMode.value) {
          nextIndicatorAnimation(indicator);
          indicatorStyle.value = { opacity: '0', transition: 'none' };
        } else if (activeIndicatorGeometry?.source && findParentGroup(getValueForElement(activeIndicatorGeometry.source))) {
          retireOutgoingIndicator();
        }
      }
      paneTransition.value = '';
      paneTransitionTimer = null;
      emit(compact ? 'PaneClosed' : 'PaneOpened', {});
      nextTick(() => restoreIndicatorAfterPaneLayout());
    };
    if (isLeftMinimalMode.value) {
      const surface = pane.querySelector('.win-nav-pane-surface');
      // Flush the committed visual state before starting its completion clock.
      if (surface) getComputedStyle(surface).animationName;
      const animation = surface?.getAnimations().find(item => item.animationName?.startsWith('win-nav-minimal-pane'));
      if (animation) void animation.finished.then(finish, () => {});
      else paneTransitionTimer = setTimeout(finish, transitionDuration);
      return;
    }
    // The native PaneContentGrid extends one pixel beyond each side of the
    // arranged SplitView pane. Clip that negative margin as well as the right
    // extension, so the closed surface still occupies CompactPaneLength.
    const paneComputedStyle = getComputedStyle(pane);
    const paneWidth = Math.max(0, Number.parseFloat(paneComputedStyle.width) || pane.offsetWidth);
    const leftInset = Math.min(paneWidth, Math.max(0, -(Number.parseFloat(paneComputedStyle.marginLeft) || 0)));
    const compactWidth = Math.min(Math.max(0, Number(props.compactPaneLength)), paneWidth - leftInset);
    const closedClip = `inset(0px ${Math.max(0, paneWidth - leftInset - compactWidth)}px 0px ${leftInset}px)`;
    const targetClip = compact ? closedClip : 'inset(-30px -30px -30px -30px)';
    const fromClip = sourceClip && sourceClip !== 'none' ? sourceClip : compact ? 'inset(-30px -30px -30px -30px)' : closedClip;
    paneClipAnimation = pane.animate([{ clipPath: fromClip }, { clipPath: targetClip }], { duration: transitionDuration, easing: paneTransitionSpec.value.easing, fill: 'both' });
    const animation = paneClipAnimation;
    void animation.finished.then(() => {
      if (paneClipAnimation !== animation) return;
      finish();
      animation.cancel();
      paneClipAnimation = null;
    }, () => {});
  });
  updateXamlBinding(declaredProps.IsPaneOpen, !compact, componentInstance);
  if (emitUpdate) emit('update:IsPaneOpen', !compact);
  return true;
};

const OpenPane = (emitUpdate = true) => setCompact(false, emitUpdate);
const ClosePane = (emitUpdate = true) => setCompact(true, emitUpdate);

const onPaneSearchButtonClick = () => {
  if (!isClosedCompact.value) return;
  wasForceClosed = false;
  OpenPane();
  nextTick(() => {
    requestAnimationFrame(() => {
      const presenter = paneAutoSuggestPresenterRef.value;
      const focusTarget = presenter?.querySelector?.('input, textarea, [contenteditable="true"], [tabindex]:not([tabindex="-1"])');
      focusTarget?.focus?.({ preventScroll: true });
    });
  });
};

const syncDisplayMode = () => {
  const automaticMode = normalizedPaneDisplayMode.value === 'Auto';
  if (automaticMode && isLeftOverlayMode.value) {
    // Native adaptive layout enters Compact/Minimal already folded. A window
    // breakpoint is a state sync, not a user pane-toggle animation.
    if (!isCompact.value) {
      if (paneTransitionTimer) clearTimeout(paneTransitionTimer);
      paneTransitionTimer = null;
      paneTransition.value = '';
      isCompact.value = true;
      updateXamlBinding(declaredProps.IsPaneOpen, false, componentInstance);
      emit('update:IsPaneOpen', false);
      nextTick(() => restoreIndicatorAfterPaneLayout());
    }
    return;
  }

  if (automaticMode && resolvedPaneDisplayMode.value === 'Left') {
    // NavigationView::UpdateAdaptiveLayout calls OpenPane when Auto returns
    // to Expanded, unless the user explicitly closed the pane.
    if (!wasForceClosed) OpenPane();
    return;
  }

  // Explicit display modes are stable layout contracts. Only Auto is allowed
  // to resolve a breakpoint into LeftCompact/LeftMinimal. Keep the controlled
  // IsPaneOpen value for a fixed Left pane, without letting resize state leak
  // into the display-mode resolver.
  if (normalizedPaneDisplayMode.value === 'Left') {
    if (typeof props.isPaneOpen === 'boolean') isCompact.value = !props.isPaneOpen;
    return;
  }

  if (isLeftMinimalMode.value) {
    isCompact.value = true;
  } else if (typeof props.isPaneOpen === 'boolean') {
    isCompact.value = !props.isPaneOpen;
    return;
  }
  if (isLeftOverlayMode.value) {
    isCompact.value = true;
  } else if (!isTopNavigation.value) {
    isCompact.value = false;
  }
};

const onDocumentPointerDown = (event) => {
  if (pendingSelectionRequest || navigationInputFrozen.value) return;
  if (!isLeftOverlayMode.value || isCompact.value) return;
  const target = event.target;
  if (navRef.value?.contains(target)) return;
  if (target?.closest?.('.flyout-presenter')) return;
  // 标题栏的展开/收起按钮（TitleBar.PaneToggleRequested）属于面板切换控件，
  // 不应被当成“点击外部关闭面板”处理，否则关闭后按钮 click 又会把它重新打开。
  if (target?.closest?.('[data-nav-pane-toggle]')) return;
  ClosePane();
};

const onHamburgerDown = commandIconInput.PointerPressed;
const onHamburgerUp = commandIconInput.PointerReleased;
const onHamburgerLeave = commandIconInput.PointerExited;
const onBackDown = commandIconInput.PointerPressed;
const onBackUp = commandIconInput.PointerReleased;
const onBackLeave = commandIconInput.PointerExited;
const releaseAnimatedIconPresses = () => {
  itemIconInput.Reset();
  commandIconInput.Reset();
  groupChevronInput.Reset();
};
const onWindowBlur = () => {
  clearCommittedItemPress();
  releaseAnimatedIconPresses();
  closeFlyout();
  closeMoreFlyout();
};

const onScroll = () => {
  if (isRestoringPaneScroll) return;
  const scrollElement = getScrollAreaElement();
  if (scrollElement && !isCompact.value) {
    expandedPaneVerticalOffset = scrollElement.scrollTop;
  }
  if (lastSelectedEl && navRef.value && navRef.value.contains(lastSelectedEl)) {
    skipTransition = true;
    calcIndicator();
    requestAnimationFrame(() => { skipTransition = false; });
  }
};

const queueLayoutRefresh = () => {
  if (layoutObserverFrame) cancelAnimationFrame(layoutObserverFrame);
  layoutObserverFrame = requestAnimationFrame(() => {
    layoutObserverFrame = null;
    // A child insertion/removal only invalidates measurements. Do not feed it
    // through the responsive resize path, which can rewrite the top layout and
    // patch the whole navigation tree again.
    observeLayoutElements();
    measureAllGroups();
    if (isTopNavigation.value) updateTopNavigationLayout();
    restoreIndicatorAfterPaneLayout();
  });
};

const getScrollAreaElement = () => scrollArea.value?.scrollViewerRef?.value ?? scrollArea.value?.scrollViewerRef ?? scrollArea.value ?? null;

const synchronizePaneLayoutTransition = ({ restoreScrollOffset = false } = {}) => {
  if (paneLayoutSyncFrame) cancelAnimationFrame(paneLayoutSyncFrame);
  let settlingFrames = 0;
  // Suppress scroll-driven indicator recalculation for the complete pane
  // transition. The viewport can be clamped while child groups animate to
  // zero; restoring the saved offset happens only on the opening leg.
  isRestoringPaneScroll = true;
  skipTransition = true;

  const synchronize = () => {
    const scrollElement = getScrollAreaElement();
    if (restoreScrollOffset && scrollElement) {
      const maximumOffset = Math.max(0, scrollElement.scrollHeight - scrollElement.clientHeight);
      scrollElement.scrollTop = Math.min(expandedPaneVerticalOffset, maximumOffset);
    }

    const indicatorElement = indicatorTrack.value?.querySelector('.win-nav-indicator');
    const indicatorIsAnimating = indicatorElement?.getAnimations()
      .some(animation => animation.playState === 'running');
    if (indicatorIsAnimating && activeIndicatorGeometry) {
      syncAnimatingIndicatorLayout();
    } else {
      if (indicatorElement) indicatorElement.style.translate = '';
      restoreIndicatorAfterPaneLayout();
    }

    const childrenAnimating = Array.from(navRef.value?.querySelectorAll('.win-nav-group-children') ?? [])
      .some(element => element.getAnimations().some(animation => animation.playState === 'running'));
    if (paneTransition.value || pendingPaneIndicatorSource || indicatorIsAnimating || childrenAnimating) settlingFrames = 0;
    else settlingFrames += 1;
    if (settlingFrames < 2) {
      paneLayoutSyncFrame = requestAnimationFrame(synchronize);
      return;
    }

    if (restoreScrollOffset && scrollElement) {
      const maximumOffset = Math.max(0, scrollElement.scrollHeight - scrollElement.clientHeight);
      scrollElement.scrollTop = Math.min(expandedPaneVerticalOffset, maximumOffset);
    }
    paneLayoutSyncFrame = requestAnimationFrame(() => {
      paneLayoutSyncFrame = null;
      isRestoringPaneScroll = false;
      const indicatorElement = indicatorTrack.value?.querySelector('.win-nav-indicator');
      if (indicatorElement) indicatorElement.style.translate = '';
      restoreIndicatorAfterPaneLayout();
      skipTransition = false;
    });
  };

  paneLayoutSyncFrame = requestAnimationFrame(synchronize);
};

const calcIndicator = ({ animateSelectionChange = false, sourceSnapshot = null } = {}) => {
  if (pendingSelectionRequest || navigationViewUnmounted) return;
  if (pendingPaneIndicatorSource && !sourceSnapshot) return;
  if (!navRef.value || !lastSelectedEl || !navRef.value.contains(lastSelectedEl)) return;
  const track = indicatorTrack.value;
  const indicatorEl = track?.querySelector('.win-nav-indicator');
  if (!track || !indicatorEl) return;
  const running = indicatorEl.getAnimations().some(animation => animation.playState === 'running');
  // Layout observers and confirmation bindings can report the same target
  // again while the compositor is moving. Preserve that animation.
  if (running && activeIndicatorTarget === lastSelectedEl) return;
  const source = sourceSnapshot?.element ?? (prevSelectedEl && prevSelectedEl !== lastSelectedEl ? prevSelectedEl : null);
  prevSelectedEl = lastSelectedEl;
  const metrics = getTrackMetrics(track);
  const targetRect = getTrackRelativeRect(lastSelectedEl, track, metrics);
  const sourceRect = sourceSnapshot?.rect ?? (source && navRef.value.contains(source) ? getTrackRelativeRect(source, track, metrics) : null);
  const top = isTopNavigation.value;
  const toX = top ? (targetRect.left + targetRect.right) / 2 - 8 : indicatorLeftForElement(lastSelectedEl) - 4;
  const toY = top ? 0 : (targetRect.top + targetRect.bottom) / 2 - 8;
  const axis = top ? 'x' : 'y';
  const size = top ? 'width' : 'height';
  const targetClip = getIndicatorClip(lastSelectedEl, track, metrics);
  if (targetClip.top >= targetClip.bottom || targetClip.left >= targetClip.right) {
    nextIndicatorAnimation(indicatorEl);
    activeIndicatorTarget = null;
    indicatorHiddenByScroll = true;
    setIndicatorRestingStyle(indicatorEl, { transform: `translate3d(${toX}px,${toY}px,0)`, [size]: '16px', opacity: '0', transition: 'none' });
    return;
  }
  const snap = () => {
    const { x, y } = getIndicatorPosition(lastSelectedEl, track);
    indicatorEl.style.translate = '';
    indicatorLeftPx.value = 4;
    indicatorIsChild.value = lastIsChild;
    setIndicatorVisibility(track, axis, getIndicatorClip(lastSelectedEl, track));
    setIndicatorRestingStyle(indicatorEl, { transform: `translate3d(${x}px,${y}px,0)`, transformOrigin: '0 0', [size]: '16px', opacity: '1', transition: 'none' });
  };
  indicatorHiddenByScroll = false;
  const outgoingTrack = outgoingIndicatorTrack.value;
  const outgoingIndicator = outgoingTrack?.querySelector('.win-nav-indicator');
  if ((!animateSelectionChange && skipTransition && !running) || !sourceRect || !outgoingIndicator) {
    nextIndicatorAnimation(indicatorEl);
    activeIndicatorTarget = lastSelectedEl;
    snap();
    return;
  }
  const fromX = sourceSnapshot?.position.x ?? (top ? (sourceRect.left + sourceRect.right) / 2 - 8 : indicatorLeftForElement(source) - 4);
  const fromY = sourceSnapshot?.position.y ?? (top ? 0 : (sourceRect.top + sourceRect.bottom) / 2 - 8);
  if (Math.hypot(toX - fromX, toY - fromY) < 1) {
    nextIndicatorAnimation(indicatorEl);
    activeIndicatorTarget = lastSelectedEl;
    snap();
    return;
  }
  const animationId = nextIndicatorAnimation(indicatorEl);
  activeIndicatorTarget = lastSelectedEl;
  indicatorEl.style.translate = '';
  indicatorLeftPx.value = 4;
  indicatorIsChild.value = lastIsChild;
  setIndicatorRestingStyle(indicatorEl, { transform: `translate3d(${toX}px,${toY}px,0)`, transformOrigin: '0 0', [size]: '16px', opacity: '1', transition: 'none' });
  Object.assign(outgoingIndicator.style, {
    transform: `translate3d(${fromX}px,${fromY}px,0)`, transformOrigin: '0 0',
    [size]: '16px', opacity: '1', transition: 'none'
  });
  activeIndicatorGeometry = {
    source, target: lastSelectedEl, axis,
    sourcePosition: { x: fromX, y: fromY }, targetPosition: { x: toX, y: toY }, sourceSnapshot
  };
  syncAnimatingIndicatorLayout();
  const sameDepth = top ? Math.abs(fromY - toY) < 0.5 : Math.abs(fromX - toX) < 0.5;
  const options = { duration: 600, fill: 'both' };
  let animation;
  if (sameDepth) {
    const from = top ? fromX : fromY;
    const to = top ? toX : toY;
    const edge = Math.min(from, to);
    const frames = [
      { transform: `translate3d(${fromX}px,${fromY}px,0)`, [size]: '16px', offset: 0, easing: 'cubic-bezier(0.9,0.1,1,0.2)' },
      { transform: `translate3d(${top ? edge : toX}px,${top ? toY : edge}px,0)`, [size]: `${Math.abs(to - from) + 16}px`, offset: .333, easing: EASE_OUT },
      { transform: `translate3d(${toX}px,${toY}px,0)`, [size]: '16px', offset: 1 }
    ];
    animation = indicatorEl.animate(frames, options);
    if (activeIndicatorGeometry.source) {
      outgoingIndicator.animate(frames, options);
      outgoingIndicator.animate([
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: .333, easing: EASE_OUT },
        { opacity: 0, offset: 1 }
      ], options);
    }
  } else {
    // NonSameLevel animations keep each indicator at its item; their shrinking
    // and growing edges point toward each other without crossing blank space.
    const downward = fromY < toY;
    const scale = top ? 'scaleX' : 'scaleY';
    outgoingIndicator.style.transformOrigin = top ? '8px 0' : (downward ? '0 16px' : '0 0');
    const incomingOrigin = top ? '8px 0' : (downward ? '0 0' : '0 16px');
    const outgoingBase = `translate3d(${fromX}px,${fromY}px,0)`;
    const incomingBase = `translate3d(${toX}px,${toY}px,0)`;
    if (activeIndicatorGeometry.source) outgoingIndicator.animate([
      { transform: `${outgoingBase} ${scale}(1)`, easing: 'cubic-bezier(0.5,0,0.5,1)' },
      { transform: `${outgoingBase} ${scale}(0)` }
    ], options);
    animation = indicatorEl.animate([
      { transform: `${incomingBase} ${scale}(0)`, transformOrigin: incomingOrigin, easing: 'cubic-bezier(0.5,0,0.5,1)' },
      { transform: `${incomingBase} ${scale}(1)`, transformOrigin: incomingOrigin }
    ], options);
  }
  const synchronize = () => {
    if (animationId !== indicatorAnimationId) return;
    syncAnimatingIndicatorLayout();
    indicatorLayoutFrame = requestAnimationFrame(synchronize);
  };
  indicatorLayoutFrame = requestAnimationFrame(synchronize);
  animation.onfinish = () => {
    if (animationId !== indicatorAnimationId) return;
    nextIndicatorAnimation(indicatorEl);
    snap();
  };
};

const restoreIndicatorAfterPaneLayout = () => {
  if (pendingSelectionRequest || pendingPaneIndicatorSource || navigationViewUnmounted) return;
  // Minimal mode intentionally hides the indicator while closed. It must be
  // recalculated after the pane becomes visible again.
  if (isLeftMinimalMode.value && isCompact.value) return;
  const value = props.selectedValue;
  if (!value || !navRef.value) return;
  const targetDescriptor = getIndicatorTargetForValue(value);
  const target = itemRefs[targetDescriptor.value] || null;
  const indicatorEl = indicatorTrack.value?.querySelector('.win-nav-indicator');
  if (!target || !indicatorEl) return;
  if (indicatorEl.getAnimations().some(animation => animation.playState === 'running')) return;
  // Layout state changes (ClosedCompact hides headers and labels) move every
  // item. Always snap/recalculate after the layout settles so the indicator
  // cannot remain at a stale position or stay hidden after a fold.
  lastSelectedEl = target;
  lastIsChild = targetDescriptor.isChild;
  skipTransition = true;
  calcIndicator();
  requestAnimationFrame(() => { skipTransition = false; });
};

let resizeTimer = null;
const onResize = () => {
  const nextShellWidth = shellRef.value?.clientWidth || shellRef.value?.offsetWidth || window.innerWidth;
  const shellWidthChanged = Math.abs(nextShellWidth - lastResizeShellWidth) >= 0.5;
  lastResizeShellWidth = nextShellWidth;
  // Arranged width also constrains the pane in fixed display modes. Only
  // resolvedPaneDisplayMode interprets this value as a mode threshold, and
  // does so solely for Auto; explicit modes retain their requested value.
  containerWidth.value = nextShellWidth || (typeof window === 'undefined' ? props.expandedModeThresholdWidth : window.innerWidth);
  updateTopNavigationLayout();
  const activeIndicator = indicatorTrack.value?.querySelector('.win-nav-indicator');
  const indicatorIsAnimating = activeIndicator?.getAnimations().some(animation => animation.playState === 'running');
  // iOS changes the visual viewport height as browser chrome moves and emits
  // resize during a tap. The item geometry is unchanged, so do not cancel and
  // restart an in-flight selection animation for a height-only resize.
  if (!shellWidthChanged && indicatorIsAnimating) return;
  skipTransition = true;
  if (resizeTimer) cancelAnimationFrame(resizeTimer);
  if (!lastSelectedEl || !navRef.value || !navRef.value.contains(lastSelectedEl)) {
    const val = props.selectedValue;
    if (val) {
      const parentGroup = findParentGroup(val);
      if (parentGroup && (isTopNavigation.value || isClosedCompact.value)) {
        lastSelectedEl = itemRefs[parentGroup.value] || null;
        lastIsChild = false;
      } else {
        lastSelectedEl = itemRefs[val] || null;
        lastIsChild = !!parentGroup && !isClosedCompact.value;
      }
    }
  }
  calcIndicator();
  resizeTimer = requestAnimationFrame(() => {
    calcIndicator();
    resizeTimer = requestAnimationFrame(() => {
      calcIndicator();
      resizeTimer = requestAnimationFrame(() => {
        skipTransition = false;
      });
    });
  });
};
const observeLayoutElements = () => {
  if (!ro) return;
  if (shellRef.value) ro.observe(shellRef.value);
  if (navRef.value) ro.observe(navRef.value);
  if (topFooterMenuRef.value) ro.observe(topFooterMenuRef.value);
  if (topBackButtonRef.value) ro.observe(topBackButtonRef.value);
  if (navRef.value) {
    navRef.value.querySelectorAll('.win-nav-pane-top, .win-nav-pane-header, .win-nav-pane-custom-content, .win-nav-pane-footer')
      .forEach(element => ro.observe(element));
  }
};
const rebindRo = () => {
  if (ro) ro.disconnect();
  ro = new ResizeObserver(onResize);
  observeLayoutElements();
};
const rebindLayoutMutationObserver = () => {
  if (!layoutObserver) return;
  layoutObserver.disconnect();
  if (navRef.value) layoutObserver.observe(navRef.value, { childList: true, subtree: true, characterData: true });
};

const refreshAfterPositionChange = () => {
  skipTransition = true;
  nextTick(() => {
    rebindRo();
    rebindLayoutMutationObserver();
    measureAllGroups();
    updateTopNavigationLayout();
    const val = props.selectedValue;
    if (val) {
      const parentGroup = findParentGroup(val);
      if (parentGroup) {
        if (isTopNavigation.value) {
          lastSelectedEl = itemRefs[parentGroup.value];
          lastIsChild = false;
        } else if (isClosedCompact.value) {
          lastSelectedEl = itemRefs[parentGroup.value];
          lastIsChild = false;
        } else {
          lastSelectedEl = itemRefs[val];
          lastIsChild = true;
        }
      } else {
        lastSelectedEl = itemRefs[val];
        lastIsChild = false;
      }
      calcIndicator();
    }
    requestAnimationFrame(() => { skipTransition = false; });
  });
};

const initIndicator = () => {
  skipTransition = true;
  const settleInitialIndicator = () => {
    requestAnimationFrame(() => {
      restoreIndicatorAfterPaneLayout();
      requestAnimationFrame(() => {
        restoreIndicatorAfterPaneLayout();
        skipTransition = false;
      });
    });
  };
  nextTick(() => {
    measureAllGroups();
    updateTopNavigationLayout();
    const val = props.selectedValue;
    if (val) {
      const parentGroup = findParentGroup(val);
      if (parentGroup) {
        if (!isTopNavigation.value && !isClosedCompact.value) {
          if (!groupExpanded[parentGroup.value]) {
            groupExpanded[parentGroup.value] = true;
            nextTick(() => {
              measureGroup(parentGroup.value);
              nextTick(() => {
                lastSelectedEl = itemRefs[val];
                lastIsChild = true;
                indicatorIsChild.value = true;
                calcIndicator();
                settleInitialIndicator();
              });
            });
            return;
          }
          lastSelectedEl = itemRefs[val];
          lastIsChild = true;
          indicatorIsChild.value = true;
        } else {
          lastSelectedEl = itemRefs[parentGroup.value];
          lastIsChild = false;
        }
      } else {
        lastSelectedEl = itemRefs[val];
        lastIsChild = false;
      }
      calcIndicator();
    }
    settleInitialIndicator();
  });
};

// NavigationViewItem.xaml owns the presenter and a nested ItemsRepeater.
// One renderer is shared by left, top, overflow and standalone pane items so
// their selection and hierarchy contracts cannot drift between visual trees.
const renderNavigationItem = (item, mode = 'Left', depth = 0) => {
  const measure = mode === 'Measure';
  const overflow = mode === 'Overflow' || mode === 'ChildrenFlyout';
  const top = mode === 'Top' || mode === 'TopFooter' || measure;
  if (item.type === 'Header') return h('div', {
    key: item.value, class: 'win-nav-item-header', 'data-value': measure ? item.value : undefined,
    style: depth ? { marginLeft: `${depth * 31}px` } : undefined,
    'data-template-part': 'InnerHeaderGrid'
  }, [h(TextBlock, { Text: item.label })]);
  if (item.type === 'Separator') return h('div', {
    key: item.value, class: 'win-nav-item-separator', 'data-value': measure ? item.value : undefined,
    style: depth ? { marginLeft: `${depth * 31}px` } : undefined,
    role: 'separator', 'data-template-part': 'SeparatorLine'
  });
  const expanded = Boolean(groupExpanded[item.value]);
  const selected = item.selectsOnInvoked && visualSelectedValue.value === item.value;
  const content = [];
  if (item.iconNodes?.length || item.icon) content.push(h(Viewbox, {
    class: 'icon', Height: 16, Width: top || overflow ? 16 : '',
    HorizontalAlignment: 'Center', VerticalAlignment: 'Center',
    'data-template-part': 'IconBox'
  }, { default: () => h(ContentPresenter, {
    HorizontalContentAlignment: 'Center', VerticalContentAlignment: 'Center',
    'data-template-part': 'Icon'
  }, { default: () => item.iconNodes?.length
    ? normalizeXamlNodes(item.iconNodes, componentInstance)
    : h('span', String(item.icon)) }) }));
  if (item.contentNodes?.length) content.push(h('div', { class: 'label', 'data-template-part': 'ContentPresenter' }, normalizeXamlNodes(item.contentNodes, componentInstance)));
  else content.push(h(TextBlock, { class: 'label', Text: item.label, 'data-template-part': 'ContentPresenter' }));
  if (item.infoBadge) content.push(h(ContentPresenter, {
    class: 'win-nav-infobadge-presenter', VerticalAlignment: 'Center',
    HorizontalAlignment: top ? 'Center' : 'Right', Margin: top ? '-16,0,2,13' : '0',
    'data-template-part': 'InfoBadgePresenter'
  }, { default: () => h(InfoBadge, { ...item.infoBadge, class: 'win-nav-infobadge' }) }));
  if (item.hasChildren) content.push(h('span', {
    class: ['icon', 'win-nav-group-chevron'],
    'data-template-part': 'ExpandCollapseChevron',
    'data-expanded': String(expanded),
    'aria-disabled': !item.isEnabled || undefined,
    'AnimatedIcon.State': expanded ? 'NormalOn' : 'NormalOff',
    ref: element => { groupChevronInput.Attach(element); },
    onClick: event => {
      event.stopPropagation();
      if (overflow) onMoreGroupChevronClick(item); else onGroupChevronClick(item);
    }
  }, [h(AnimatedIcon, {
    Source: groupChevronVisualSource, Width: 12, Height: 12,
    HorizontalAlignment: 'Center', VerticalAlignment: 'Center',
    'data-template-part': 'ExpandCollapseChevronIcon',
    'AutomationProperties.AccessibilityView': 'Raw'
  }, { default: () => h(AnimatedIcon.FallbackIconSource, {}, {
    default: () => h(FontIconSource, {
      Foreground: '{ThemeResource NavigationViewItemForeground}', FontSize: 8,
      Glyph: '\uE70D', FontFamily: '{StaticResource SymbolThemeFontFamily}'
    })
  }) })]));
  const handleItemInput = (name, event) => {
    // Item navigation replays Pressed after the Page commits. The chevron's
    // separate expand/collapse command keeps its own immediate feedback.
    if (name === 'PointerPressed' || name === 'KeyDown') {
      const chevron = event.target?.closest?.('.win-nav-group-chevron');
      if (chevron && event.currentTarget?.contains(chevron)) groupChevronInput[name]({
        currentTarget: chevron, pointerType: event.pointerType, button: event.button,
        pointerId: event.pointerId, key: event.key, repeat: event.repeat
      });
      return;
    }
    if (event.currentTarget === pressedElement && ['PointerExited', 'LostFocus'].includes(name)) clearCommittedItemPress();
    itemIconInput[name](event);
    const chevron = event.currentTarget?.querySelector('.win-nav-group-chevron');
    if (chevron) groupChevronInput[name]({
      currentTarget: chevron,
      pointerType: event.pointerType, button: event.button, pointerId: event.pointerId,
      key: event.key, repeat: event.repeat
    });
  };
  const presenter = h('div', {
    key: item.value,
    class: ['win-nav-item', { 'win-nav-group-header': item.hasChildren, 'win-nav-group-child': depth > 0, 'is-selected': selected, 'is-disabled': !item.isEnabled, 'is-pressed': !measure && pressedItemValue.value === item.value }],
    role: 'menuitem', 'aria-current': selected ? 'page' : undefined,
    'aria-disabled': !item.isEnabled || undefined, 'aria-expanded': item.hasChildren ? expanded : undefined,
    'aria-level': depth + 1,
    'data-value': measure ? item.value : undefined,
    'data-navigation-value': item.value,
    'data-xaml-ref': item.container?.['x:Name'] ?? item.container?.['data-xaml-ref'],
    'data-template-part': 'LayoutRoot',
    style: depth ? { paddingLeft: `${(overflow ? 0 : 12) + depth * 31}px` } : undefined,
    ...(!measure ? itemToolTipAttrs(item) : {}),
    ref: element => {
      itemIconInput.Attach(element);
      if (!measure && !overflow) setItemRef(item.value, element);
    },
    onPointerenter: event => handleItemInput('PointerEntered', event),
    onPointerleave: event => handleItemInput('PointerExited', event),
    onPointerdown: event => handleItemInput('PointerPressed', event),
    onPointerup: event => handleItemInput('PointerReleased', event),
    onPointercancel: event => handleItemInput('PointerExited', event),
    onLostpointercapture: event => handleItemInput('PointerExited', event),
    onKeydown: event => handleItemInput('KeyDown', event),
    onKeyup: event => handleItemInput('KeyUp', event),
    onFocusout: event => handleItemInput('LostFocus', event),
    onClick: measure ? undefined : event => invokeNavigationItem(event.currentTarget, event, () => {
      if (!item.isEnabled) return;
      if (overflow) {
        if (item.hasChildren) onMoreGroupHeaderClick(item); else { closeFlyout(); onMoreItemClick(item); }
      } else if (item.hasChildren) onGroupHeaderClick(item);
      else selectNavigationValue(item.value, depth > 0);
    })
  }, content);
  if (!item.hasChildren) return presenter;
  const childrenVisible = expanded && (overflow || !top && isPaneGroupChildrenVisible.value);
  return h('div', {
    key: item.value, class: ['win-nav-group', { 'is-expanded': childrenVisible, 'is-child-selected': isChildOfGroup(item) }]
  }, [presenter, !top ? h('div', {
    class: ['win-nav-group-children', { 'is-pane-collapsing': !isPaneGroupChildrenVisible.value && paneTransition.value === 'closing' }],
    style: { height: childrenVisible ? overflow ? 'auto' : `${groupHeights[item.value] ?? 0}px` : '0px' },
    'aria-hidden': !childrenVisible || undefined, inert: !childrenVisible
  }, [h('div', {
    class: 'win-nav-group-children-inner', 'data-template-part': 'NavigationViewItemMenuItemsHost',
    ref: overflow ? undefined : element => setChildrenRef(item.value, element)
  }, (item.children ?? []).map(child => renderNavigationItem(child, mode, depth + 1)))]) : null]);
};
const renderSettingsItem = mode => h('div', {
  class: ['win-nav-item', 'win-nav-settings-item', { 'is-selected': visualSelectedValue.value === settingsValue.value, 'is-disabled': !officialProps.IsEnabled, 'is-pressed': pressedItemValue.value === settingsValue.value }],
  role: 'menuitem', tabindex: officialProps.IsEnabled ? 0 : -1,
  'ToolTipService.ToolTip': isTopNavigation.value || isCompact.value ? resolvedSettingsLabel.value : undefined,
  'aria-label': resolvedSettingsLabel.value, 'aria-current': visualSelectedValue.value === settingsValue.value ? 'page' : undefined,
  'data-template-part': 'SettingsNavPaneItem', 'data-navigation-value': settingsValue.value,
  ref: element => { setItemRef(settingsValue.value, element); itemIconInput.Attach(element); },
  onPointerenter: itemIconInput.PointerEntered,
  onPointerdown: itemIconInput.PointerPressed, onKeydown: itemIconInput.KeyDown,
  onKeyup: itemIconInput.KeyUp, onFocusout: event => { clearCommittedItemPress(); itemIconInput.LostFocus(event); },
  onClick: event => invokeNavigationItem(event.currentTarget, event, selectSettings),
  onPointerup: itemIconInput.PointerReleased,
  onPointerleave: event => { clearCommittedItemPress(); itemIconInput.PointerExited(event); },
  onPointercancel: event => { clearCommittedItemPress(); itemIconInput.PointerExited(event); },
  onLostpointercapture: event => { clearCommittedItemPress(); itemIconInput.PointerExited(event); }
}, [h(AnimatedIcon, { class: 'icon', Source: settingsVisualSource, Width: 16, Height: 16, HorizontalAlignment: 'Center', VerticalAlignment: 'Center', IsHitTestVisible: 'False' }), h(TextBlock, { class: 'label', Text: resolvedSettingsLabel.value })]);
const NavigationItems = defineComponent({
  props: { Mode: { type: String, default: 'Left' } },
  setup(renderProps) {
    return () => {
      const mode = renderProps.Mode;
      const items = mode === 'Top' ? topVisibleMenuItems.value : mode === 'Overflow' ? moreFlyoutItems.value
        : mode === 'Footer' || mode === 'TopFooter' ? footerItems.value
        : mode === 'ChildrenFlyout' ? findNormalizedItem(flyoutGroupValue.value)?.children ?? [] : menuItems.value;
      const nodes = items.map(item => renderNavigationItem(item, mode));
      if ((mode === 'Footer' || mode === 'TopFooter') && isSettingsVisible.value) nodes.push(renderSettingsItem(mode));
      return h(Fragment, nodes);
    };
  }
});
const PaneItemsScrollHost = defineComponent({
  setup() {
    provide(xamlScopeKey, { ...inject(xamlScopeKey, {}), OnPaneViewChanged: onScroll });
    return () => h(ScrollViewer, {
      class: 'win-nav-left-scrollable', ref: scrollArea,
      VerticalScrollMode: 'Auto', VerticalScrollBarVisibility: 'Auto',
      HorizontalScrollMode: 'Disabled', HorizontalScrollBarVisibility: 'Disabled',
      ViewChanged: 'OnPaneViewChanged', IsTabStop: 'False'
    }, { default: () => h('div', { class: 'win-nav-menu', 'data-template-part': 'MenuItemsHost' }, [h(NavigationItems, { Mode: 'Left' })]) });
  }
});
const NavigationFlyouts = defineComponent({
  setup() {
    const presenterStyle = overflow => h(Flyout.FlyoutPresenterStyle, null, { default: () => [h('Style', { TargetType: 'FlyoutPresenter' }, [
      h('Setter', { Property: 'Padding', Value: overflow ? '{ThemeResource TopNavigationViewOverflowMenuPadding}' : '{ThemeResource NavigationViewItemChildrenMenuFlyoutPadding}' }),
      ...(!overflow ? [h('Setter', { Property: 'Margin', Value: '0,-4,0,0' })] : []),
      h('Setter', { Property: 'ScrollViewer.HorizontalScrollMode', Value: 'Auto' }),
      h('Setter', { Property: 'ScrollViewer.HorizontalScrollBarVisibility', Value: 'Auto' }),
      h('Setter', { Property: 'ScrollViewer.VerticalScrollMode', Value: 'Auto' }),
      h('Setter', { Property: 'ScrollViewer.VerticalScrollBarVisibility', Value: 'Auto' }),
      h('Setter', { Property: 'ScrollViewer.ZoomMode', Value: 'Disabled' }),
      h('Setter', { Property: 'CornerRadius', Value: '{ThemeResource OverlayCornerRadius}' })
    ])] });
    const content = overflow => h(Flyout.Content, null, { default: () => [h('div', {
      class: ['win-nav-more-panel', { 'win-nav-overflow-panel': overflow }],
      'data-navigation-owner': componentInstance.uid,
      'data-template-part': overflow ? 'TopNavMenuItemsOverflowHost' : 'FlyoutContentGrid',
      onKeydown: onNavigationKeydown, onFocusin: onNavigationFocusIn, onPointerdownCapture: onNavigationPointerDown
    }, [h(NavigationItems, { Mode: overflow ? 'Overflow' : 'ChildrenFlyout' })])] });
    return () => h(Fragment, [
      h(Flyout, {
        ref: childrenFlyoutRef, Placement: flyoutPlacement.value,
        onOpened: () => focusFlyoutItems(), onClosing: finishChildrenFlyoutClosing,
        onClosed: () => { if (!flyoutOpen.value) flyoutGroupValue.value = null; }
      }, {
        default: () => [presenterStyle(false), content(false)]
      }),
      h(Flyout, {
        ref: overflowFlyoutRef, Placement: 'BottomEdgeAlignedRight',
        onOpened: () => focusFlyoutItems(true), onClosing: finishMoreFlyoutClosing,
        onClosed: () => { if (!moreFlyoutOpen.value) moreFlyoutItems.value = []; }
      }, {
        default: () => [presenterStyle(true), content(true)]
      })
    ]);
  }
});
watch(topOverflowMenuItems, items => { if (moreFlyoutOpen.value) moreFlyoutItems.value = items.slice(); });
provide(navigationViewItemRendererKey, node => {
  const source = readNavigationItem(node, `pane-item-${node.props?.['x:Name'] ?? node.props?.Icon ?? ''}`);
  return source ? renderNavigationItem(normalizeItem(source), isTopNavigation.value ? 'TopFooter' : 'Left') : null;
});

watch(() => flattenedItems.value.map(item => [item.value, item.container?.IsExpanded, item.container?.IsSelected]), states => {
  for (const [value, expanded, selected] of states) {
    const item = findNormalizedItem(value);
    if (item?.hasChildren && expanded !== undefined && Boolean(expanded) !== Boolean(groupExpanded[value])) {
      if (expanded) Expand(item.container); else Collapse(item.container);
    }
    if (!pendingSelectionRequest && selected === true && selectedValue.value !== value) {
      commitNavigationValue(value, { invoked: false });
      syncIndicatorForSelectedItem(value);
    }
  }
  if (pendingSelectionRequest) synchronizeItemSelection(visualSelectedValue.value);
}, { immediate: true });
watch(selectedValue, value => {
  if (!pendingSelectionRequest) visualSelectedValue.value = value;
});
watch(visualSelectedValue, synchronizeItemSelection, { immediate: true });
watch(() => flattenedItems.value.map(item => item.value).join('|'), () => nextTick(() => {
  measureAllGroups();
  updateTopNavigationLayout();
  if (flyoutOpen.value && !findNormalizedItem(flyoutGroupValue.value)?.hasChildren) closeFlyout();
  if (moreFlyoutOpen.value && !topOverflowMenuItems.value.length) closeMoreFlyout();
  if (selectedValue.value !== null && selectedValue.value !== undefined && selectedValue.value !== '' && selectedValue.value !== settingsValue.value && !findNormalizedItem(selectedValue.value)) {
    internalSelectedItem.value = null;
    updateXamlBinding(declaredProps.SelectedItem, null, componentInstance);
    emit('update:SelectedItem', null);
    emit('SelectionChanged', { SelectedItem: null, SelectedItemContainer: null, IsSettingsSelected: false, RecommendedNavigationTransitionInfo: createEntranceNavigationTransitionInfo() });
  }
  restoreIndicatorAfterPaneLayout();
}));

const attachCommandIconHosts = () => {
  for (const element of shellRef.value?.querySelectorAll('.win-nav-hamburger, .win-nav-back-button') ?? []) commandIconInput.Attach(element);
  commandIconInput.Refresh();
};
watch(() => [isTopNavigation.value, showBackButtonResolved.value, showBackButtonInLeftNav.value, isPaneToggleButtonVisible.value, officialProps.IsEnabled, canGoBack.value], () => {
  nextTick(attachCommandIconHosts);
}, { flush: 'post' });
watch(groupExpanded, () => { groupChevronInput.Refresh(); }, { deep: true, flush: 'post' });

onMounted(() => {
  attachCommandIconHosts();
  containerWidth.value = shellRef.value?.clientWidth || shellRef.value?.offsetWidth || window.innerWidth;
  lastResizeShellWidth = containerWidth.value;
  syncDisplayMode();
  rebindRo();
  layoutObserver = new MutationObserver(queueLayoutRefresh);
  // Page content is a sibling of the navigation tree. Observing the shell
  // caused every page switch to refresh navigation layout unnecessarily.
  rebindLayoutMutationObserver();
  window.addEventListener('resize', onResize);
  window.addEventListener('blur', onWindowBlur);
  document.addEventListener('pointerdown', onDocumentPointerDown, true);
  initIndicator();
});

onBeforeUnmount(() => {
  if (paneShadowTimer) clearTimeout(paneShadowTimer);
  navigationViewUnmounted = true;
  clearCommittedItemPress();
  selectionVisualGeneration += 1;
  pendingSelectionRequest?.commit?.release();
  pendingSelectionRequest = null;
  pendingPaneIndicatorSource = null;
  if (paneIndicatorCommitFrame) cancelAnimationFrame(paneIndicatorCommitFrame);
  cancelFlyoutFocus();
  if (ro) ro.disconnect();
  if (layoutObserver) layoutObserver.disconnect();
  if (layoutObserverFrame) cancelAnimationFrame(layoutObserverFrame);
  if (paneLayoutSyncFrame) cancelAnimationFrame(paneLayoutSyncFrame);
  if (paneTransitionTimer) clearTimeout(paneTransitionTimer);
  paneClipAnimation?.cancel();
  if (trackingRaf) cancelAnimationFrame(trackingRaf);
  if (resizeTimer) cancelAnimationFrame(resizeTimer);
  nextIndicatorAnimation(indicatorTrack.value?.querySelector('.win-nav-indicator'));
  for (const item of xamlItemSources.values()) {
    const name = item['x:Name'] ?? item['data-xaml-ref'];
    if (name && names?.[name] === item) delete names[name];
  }
  window.removeEventListener('resize', onResize);
  window.removeEventListener('blur', onWindowBlur);
  document.removeEventListener('pointerdown', onDocumentPointerDown, true);
});

watch(() => props.paneDisplayMode, (value, oldValue) => {
  if (value !== oldValue) wasForceClosed = false;
  syncDisplayMode();
});

watch(resolvedPaneDisplayMode, (value, oldValue) => {
  if (value !== oldValue) {
    clearCommittedItemPress();
    closeFlyout();
    closeMoreFlyout();
    releaseAnimatedIconPresses();
    if (paneTransitionTimer) clearTimeout(paneTransitionTimer);
    paneClipAnimation?.cancel();
    paneClipAnimation = null;
    paneTransitionTimer = null;
    paneTransition.value = '';
  }
  syncDisplayMode();
  if (value !== oldValue) nextTick(syncDisplayMode);
  refreshAfterPositionChange();
  if (value !== oldValue) emit('DisplayModeChanged', { DisplayMode: displayMode.value });
});
watch(() => officialProps.IsPaneVisible, visible => {
  if (!visible) {
    closeFlyout();
    closeMoreFlyout();
    ClosePane();
  } else if (displayMode.value === 'Expanded') OpenPane();
});
watch(() => officialProps.IsEnabled, enabled => {
  if (!enabled) { releaseAnimatedIconPresses(); closeFlyout(); closeMoreFlyout(); }
});

watch(() => props.isPaneOpen, (value) => {
  const compact = !value;
  // An external IsPaneOpen write is an explicit customer request. An
  // adaptive close has already updated isCompact before its binding event
  // reaches this watcher, so it deliberately does not set the force flag.
  if (compact !== isCompact.value) wasForceClosed = compact;
  if (compact) ClosePane(false); else OpenPane(false);
});

watch(() => officialProps.SelectedItem, (item) => {
  const previousValue = resolveSelectedValue(internalSelectedItem.value);
  const nextValue = resolveSelectedValue(item);
  const confirmedSelectionRequest = pendingSelectionRequest?.value === nextValue
    ? pendingSelectionRequest
    : null;
  if (pendingSelectionRequest) {
    if (!confirmedSelectionRequest) {
      pendingSelectionRequest.value = nextValue;
      internalSelectedItem.value = item;
    }
    return;
  }
  if (previousValue === nextValue) return;
  if (previousValue !== nextValue && isTopNavigation.value && findParentGroup(nextValue)) {
    suppressNextTopChildWatcherMove = true;
  }
  const transition = createRecommendedNavigationTransitionInfo(nextValue, nextValue === props.settingsValue);
  if (previousValue !== nextValue) {
    const selectedItem = findNormalizedItem(nextValue);
    dispatchNavigationSelection(nextValue, () => {
      internalSelectedItem.value = item;
      emit('SelectionChanged', {
        SelectedItem: item,
        SelectedItemContainer: selectedItem?.container ?? (nextValue === props.settingsValue ? settingsItem : null),
        IsSettingsSelected: nextValue === props.settingsValue,
        RecommendedNavigationTransitionInfo: transition
      });
      return true;
    }, false, true);
  }
});

watch(isSettingsVisible, (visible) => {
  if (visible) return;
  delete itemRefs[settingsValue.value];
  if (props.selectedValue === settingsValue.value) {
    selectNavigationValue(props.menuItems[0]?.value || '', false);
  }
});

const animatePaneIndicatorTransition = ({ target, targetIsChild, sourceSnapshot = null }) => {
  if (!target || !indicatorTrack.value) return false;
  lastSelectedEl = target;
  lastIsChild = targetIsChild;
  calcIndicator({ animateSelectionChange: true, sourceSnapshot });
  return true;
};

watch(isCompact, compact => {
  if (paneIndicatorCommitFrame) cancelAnimationFrame(paneIndicatorCommitFrame);
  paneIndicatorCommitFrame = null;
  const source = lastSelectedEl;
  const track = indicatorTrack.value;
  // Capture the selected child before ClosedCompact hides its presenter and
  // layout observers remap the selection to the visible root ancestor.
  const sourceSnapshot = !isLeftMinimalMode.value && !isTopNavigation.value && source && track && navRef.value?.contains(source)
    ? { element: source, track, rect: getTrackRelativeRect(source, track), position: getIndicatorPosition(source, track), clip: getIndicatorClip(source, track) }
    : null;
  pendingPaneIndicatorSource = sourceSnapshot;
  const scrollElement = getScrollAreaElement();
  if (compact && scrollElement) expandedPaneVerticalOffset = scrollElement.scrollTop;
  // Expansion state belongs to each item, independently from the pane. Restore
  // every ancestor of the selection while preserving explicit group collapses.
  if (!compact) {
    let ancestor = findParentGroup(props.selectedValue);
    while (ancestor) {
      if (!manuallyCollapsedGroups[ancestor.value]) groupExpanded[ancestor.value] = true;
      ancestor = findParentGroup(ancestor.value);
    }
  }
  nextTick(() => {
    if (pendingPaneIndicatorSource !== sourceSnapshot) return;
    measureAllGroups();
    const commitIndicator = () => {
      if (pendingPaneIndicatorSource !== sourceSnapshot || navigationViewUnmounted) return;
      if (sourceSnapshot && indicatorTrack.value !== sourceSnapshot.track) {
        pendingPaneIndicatorSource = null;
        restoreIndicatorAfterPaneLayout();
        return;
      }
      // Expanded child presenters begin their height transition at zero. Wait
      // for their first visible frame before creating the incoming animation.
      const target = getIndicatorTargetForValue(props.selectedValue);
      const targetElement = itemRefs[target.value];
      if (sourceSnapshot && !compact && targetElement && paneTransition.value === 'opening') {
        const clip = getIndicatorClip(targetElement, indicatorTrack.value);
        if (clip.top >= clip.bottom || clip.left >= clip.right) {
          paneIndicatorCommitFrame = requestAnimationFrame(() => {
            paneIndicatorCommitFrame = null;
            commitIndicator();
          });
          return;
        }
      }
      pendingPaneIndicatorSource = null;
      if (!(isLeftMinimalMode.value && compact)) {
        // ClosedCompact maps arbitrary descendants to the visible root ancestor.
        if (sourceSnapshot) animatePaneIndicatorTransition({ target: targetElement, targetIsChild: target.isChild, sourceSnapshot });
        else moveIndicatorForValue(props.selectedValue);
      }
    };
    commitIndicator();
    synchronizePaneLayoutTransition({ restoreScrollOffset: !compact });
  });
}, { flush: 'sync' });

watch(() => props.selectedValue, (val) => {
  if (pendingSelectionRequest) return;
  if (!val) return;
  const parentGroup = findParentGroup(val);
  if (isTopNavigation.value) {
    updateTopNavigationLayout();
  }

  if (isTopNavigation.value && parentGroup) {
    if (suppressNextTopChildWatcherMove) {
      suppressNextTopChildWatcherMove = false;
      return;
    }

    nextTick(() => {
      moveIndicatorForValue(val);
    });
  }
});</script>
<style>
  @font-face {
    font-family: 'WinUIOnWebNavigationIcons';
    src: local('Segoe Fluent Icons'), local('Segoe MDL2 Assets'), url('../assets/Fonts/SEGOEICONS.TTF') format('truetype');
    font-display: block;
  }

  .win-nav-shell .icon {
    font-family: 'WinUIOnWebNavigationIcons', var(--SymbolThemeFontFamily);
    font-weight: 400;
    font-style: normal;
    font-synthesis: none;
  }
  .win-nav-shell {
    display: flex;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    position: relative;
    isolation: isolate;
    overflow: hidden;
    background: transparent;
  }

  .win-nav-shell.is-left {
      flex-direction: row;
    }

    .win-nav-shell.is-top {
      flex-direction: column;
    }

    .win-nav-shell.is-overlay-left {
      position: relative;
    }

  .win-nav-content {
    position: relative;
    isolation: isolate;
    box-sizing: border-box;
    width: 100%;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    margin: 0;
    padding: 0;
    background: transparent;
    overflow: hidden;
    overflow-x: hidden;
    transition: background var(--normal-duration) var(--fast-out-slow-in);
  }

  .win-nav-content::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    border-radius: inherit;
    background: var(--NavigationViewContentBackground, var(--layer-fill-color-default, var(--layer-default)));
    transition: background var(--normal-duration) var(--fast-out-slow-in);
  }

  .win-nav-shell.is-left > .win-nav-content {
    border-radius: 8px 0 0 0;
    border-top: 1px solid var(--NavigationViewContentGridBorderBrush, var(--CardStrokeColorDefaultBrush, var(--card-stroke)));
    border-left: 1px solid var(--NavigationViewContentGridBorderBrush, var(--CardStrokeColorDefaultBrush, var(--card-stroke)));
  }

  .win-nav-shell.is-overlay-left > .win-nav-content {
    margin-left: 0;
  }

  .win-nav-shell.is-left-compact > .win-nav-content {
    /* Keep the compact rail in the layout at all times.  The overlay pane
       opens above this fixed rail, so toggling it never remeasures the page. */
    margin-left: var(--win-nav-compact-pane-length, 48px);
  }

  .win-nav-shell.is-left-minimal > .win-nav-content {
    /* Minimal uses the native overlay composition: ContentGrid remains the
       full root surface while the pane is layered above it. Keeping this
       layer out of the flex width negotiation prevents pane open/close from
       changing the hosted page's available width or its own gutters. */
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    flex: none;
    border-left: 0;
    border-radius: 0;
  }

  .win-nav-shell.is-top > .win-nav-content {
    border-top: 1px solid var(--NavigationViewContentGridBorderBrush, var(--CardStrokeColorDefaultBrush, var(--card-stroke)));
    border-radius: 0;
  }

  .win-nav-content-inner {
    box-sizing: border-box;
    width: 100%;
    flex: 1 1 auto;
    height: auto;
    min-height: 0;
    margin: 0;
    padding: 0;
    overflow: hidden;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
  }

  .win-nav-content-inner > * {
    min-width: 0;
    min-height: 0;
    max-height: 100%;
    align-self: stretch;
  }
  .win-nav-content-inner > .win-stack-panel {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    height: 100%;
    overflow: hidden;
  }
  .win-nav-content-inner .win-frame {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    max-height: 100%;
    overflow: hidden;
  }

  .win-nav-content-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    pointer-events: none;
  }

  .win-nav-shell.is-pane-hidden > .win-nav-left-panel,
  .win-nav-shell.is-pane-hidden > .win-nav-top-bar {
    display: none;
  }

  .win-nav-shell.is-pane-hidden.is-left-compact > .win-nav-content {
    margin-left: 0;
  }

  .win-nav-page-header {
    min-height: 36px;
    margin: 44px 0 0 var(--win-nav-header-margin-left, 56px);
    padding: 0;
    display: flex;
    align-items: center;
    font-size: 28px;
    line-height: 36px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .win-nav-page-header .win-text-block {
    color: inherit;
    font-size: inherit;
    line-height: inherit;
    font-weight: inherit;
  }

    .win-nav-page-header + .win-nav-content-inner {
      padding-top: 0;
    }

  .win-nav-left-panel {
    position: relative;
    box-sizing: border-box;
    background: var(--NavigationViewExpandedPaneBackground, transparent);
    /* NavigationViewPaneContentGridMargin is -1,3 in WinUI. Keep the
       SplitView's arranged outer width while extending the content grid by
       one pixel on each side and leaving three pixels above and below. */
    width: calc(var(--win-nav-open-pane-length, 320px) + 2px);
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: var(--NavigationViewPaneContentGridMargin, 3px -1px);
    --win-nav-shadow-bleed: 30px;
    clip-path: inset(calc(-1 * var(--win-nav-shadow-bleed)));
    transition: clip-path var(--win-nav-pane-duration, 200ms) var(--win-nav-pane-easing, cubic-bezier(0, 0.35, 0.15, 1)), background var(--normal-duration) var(--fast-out-slow-in);
    flex-shrink: 0;
    overflow: hidden;
  }

  .win-nav-pane-surface {
    display: contents;
  }

  .win-nav-shadow-caster {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: var(--win-nav-open-pane-length, 320px);
    z-index: 20;
    pointer-events: none;
    overflow: visible;
    opacity: 0;
    transform: translateX(calc(var(--win-nav-compact-pane-length, 48px) - var(--win-nav-open-pane-length, 320px)));
    transition: transform 120ms cubic-bezier(0.1, 0.9, 0.2, 1), opacity 120ms linear;
  }

  .win-nav-shadow-caster.is-overlaying {
    opacity: 1;
    transform: translateX(0);
    transition-duration: 350ms;
  }

    .win-nav-shell.is-overlay-left > .win-nav-left-panel {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 20;
      isolation: isolate;
      background: transparent;
      border-radius: 0 8px 8px 0;
      width: calc(var(--win-nav-open-pane-length, 320px) + 2px);
      clip-path: inset(calc(-1 * var(--win-nav-shadow-bleed)));
      transition: clip-path var(--win-nav-pane-duration, 350ms) var(--win-nav-pane-easing, cubic-bezier(0.1, 0.9, 0.2, 1)), background var(--normal-duration) var(--fast-out-slow-in);
    }

    .win-nav-shell.is-overlay-left > .win-nav-left-panel::before {
      content: none;
    }

    html.winui-webview-host .win-nav-shell.is-overlay-left > .win-nav-left-panel:not(.is-compact) {
      background: transparent;
    }

    .win-nav-shell.is-overlay-left > .win-nav-left-panel.is-compact {
      width: calc(var(--win-nav-open-pane-length, 320px) + 2px);
      clip-path: inset(0 calc(var(--win-nav-open-pane-length, 320px) - var(--win-nav-compact-pane-length, 48px) + 1px) 0 1px);
      box-shadow: none;
      border-radius: 0;
    }

    .win-nav-shell.is-left-compact > .win-nav-left-panel.is-compact {
      background: var(--NavigationViewExpandedPaneBackground, transparent);
    }

    .win-nav-shell.is-left-compact > .win-nav-left-panel,
    html.winui-webview-host .win-nav-shell.is-overlay-left.is-left-compact > .win-nav-left-panel {
      background: transparent;
      box-shadow: none;
    }

    .win-nav-shell.is-left-compact > .win-nav-left-panel:not(.is-compact),
    html.winui-webview-host .win-nav-shell.is-overlay-left.is-left-compact > .win-nav-left-panel:not(.is-compact) {
    }

    .win-nav-shell.is-left-compact > .win-nav-left-panel::before {
      content: none;
    }

    .win-nav-shell.is-left-compact > .win-nav-left-panel::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 4;
      pointer-events: none;
      border: 1px solid var(--NavigationViewItemSeparatorForeground, var(--DividerStrokeColorDefaultBrush, var(--stroke-divider)));
      border-radius: 0 8px 8px 0;
      opacity: 1;
    }

    .win-nav-shell.is-left-compact > .win-nav-left-panel.is-compact::before,
    .win-nav-shell.is-left-compact > .win-nav-left-panel.is-compact::after {
      opacity: 0;
    }

    .win-nav-shell.is-left-compact > .win-nav-left-panel.is-compact.is-pane-closing::before,
    .win-nav-shell.is-left-compact > .win-nav-left-panel.is-compact.is-pane-closing::after {
      opacity: 1;
    }

    .win-nav-shell.is-left-compact > .win-nav-left-panel > .win-nav-back-button,
    .win-nav-shell.is-left-compact > .win-nav-left-panel > .win-nav-pane-command-row,
    .win-nav-shell.is-left-compact > .win-nav-left-panel > .win-nav-pane-surface > *:not(.win-nav-indicator-track) {
      position: relative;
      z-index: 2;
    }

    .win-nav-shell.is-left-compact > .win-nav-left-panel > .win-nav-pane-surface > .win-nav-indicator-track {
      position: absolute;
      z-index: 3;
    }

    .win-nav-shell:not(.is-overlay-left) > .win-nav-left-panel.is-compact {
      width: calc(var(--win-nav-open-pane-length, 320px) + 2px);
      margin-right: calc(var(--win-nav-compact-pane-length, 48px) - var(--win-nav-open-pane-length, 320px) - 1px);
      clip-path: inset(0 calc(var(--win-nav-open-pane-length, 320px) - var(--win-nav-compact-pane-length, 48px) + 1px) 0 1px);
    }

    .win-nav-shell.is-left-minimal > .win-nav-left-panel.is-compact {
      background: transparent;
      width: calc(var(--win-nav-open-pane-length, 320px) + 2px);
      clip-path: none;
      pointer-events: none;
    }

    .win-nav-shell.is-left-minimal > .win-nav-left-panel.is-compact.is-pane-closing {
      background: transparent;
      box-shadow: none;
    }

    .win-nav-left-panel > .win-nav-pane-surface > .win-nav-pane-top,
    .win-nav-left-panel > .win-nav-pane-surface > .win-nav-pane-custom-content,
    .win-nav-left-panel > .win-nav-pane-surface > .win-nav-left-scrollable,
    .win-nav-left-panel > .win-nav-pane-surface > .win-nav-footer,
    .win-nav-left-panel .win-nav-menu {
      box-sizing: border-box;
      width: 100%;
    }

    .win-nav-left-panel.is-closed-compact > .win-nav-pane-surface > .win-nav-left-scrollable,
    .win-nav-left-panel.is-closed-compact .win-nav-menu {
      width: calc(var(--win-nav-compact-pane-length, 48px) + 2px);
    }

    .win-nav-left-panel .win-nav-indicator-track {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      overflow: visible;
      z-index: 3;
    }

  .win-nav-shell.is-left-minimal > .win-nav-left-panel {
    background: var(--NavigationViewExpandedPaneBackground, transparent);
    box-shadow: none;
    clip-path: none;
  }

  .win-nav-shell.is-left-minimal > .win-nav-left-panel::before {
    content: none;
  }

  .win-nav-shell.is-overlay-left.is-left-minimal > .win-nav-left-panel,
  html.winui-webview-host .win-nav-shell.is-overlay-left.is-left-minimal > .win-nav-left-panel {
    background: transparent;
    box-shadow: none;
  }

  .win-nav-shell.is-left-minimal > .win-nav-left-panel > .win-nav-pane-surface {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    box-sizing: border-box;
    width: auto;
    padding: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    isolation: isolate;
    border-radius: 0 8px 8px 0;
    transform: translateX(0);
    transform-origin: left center;
  }

  .win-nav-shell.is-left-minimal > .win-nav-left-panel > .win-nav-pane-surface::before {
    content: none;
  }

  .win-nav-shell.is-left-minimal > .win-nav-left-panel > .win-nav-pane-surface::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 5;
    pointer-events: none;
    border: 1px solid var(--NavigationViewItemSeparatorForeground, var(--DividerStrokeColorDefaultBrush, var(--stroke-divider)));
    border-radius: inherit;
  }

  .win-nav-shell.is-left-minimal > .win-nav-left-panel.has-back-button > .win-nav-pane-surface,
  .win-nav-shell.is-left-minimal > .win-nav-left-panel.has-pane-toggle-button > .win-nav-pane-surface {
    padding-top: 48px;
  }

  .win-nav-shell.is-left-minimal > .win-nav-left-panel.has-back-button.has-pane-toggle-button > .win-nav-pane-surface {
    padding-top: 88px;
  }

  .win-nav-shell.is-left-minimal > .win-nav-left-panel.is-pane-opening > .win-nav-pane-surface {
    animation: win-nav-minimal-pane-opening var(--win-nav-pane-open-duration, 350ms) var(--win-nav-pane-easing, cubic-bezier(0.1, 0.9, 0.2, 1)) both;
  }

  .win-nav-shell.is-left-minimal > .win-nav-left-panel.is-pane-closing > .win-nav-pane-surface {
    animation: win-nav-minimal-pane-closing var(--win-nav-pane-close-duration, 120ms) var(--win-nav-pane-easing, cubic-bezier(0.1, 0.9, 0.2, 1)) both;
    pointer-events: none;
  }

  .win-nav-shell.is-left-minimal > .win-nav-left-panel > .win-nav-back-button,
  .win-nav-shell.is-left-minimal > .win-nav-left-panel > .win-nav-pane-command-row {
    position: relative;
    z-index: 4;
    pointer-events: auto;
  }

  @keyframes win-nav-minimal-pane-opening {
    from { transform: var(--win-nav-pane-transition-start, translateX(calc(-1 * var(--win-nav-open-pane-length, 320px)))); }
    to { transform: translateX(0); }
  }

  @keyframes win-nav-minimal-pane-closing {
    from { transform: var(--win-nav-pane-transition-start, translateX(0)); }
    to { transform: translateX(calc(-1 * var(--win-nav-open-pane-length, 320px))); }
  }

  .win-nav-shell:not(.is-overlay-left):not(.is-left-compact) > .win-nav-left-panel.is-pane-opening + .win-nav-content {
    animation: win-nav-inline-content-opening var(--win-nav-pane-open-duration, 200ms) var(--win-nav-pane-easing, cubic-bezier(0, 0.35, 0.15, 1)) both;
  }

  .win-nav-shell:not(.is-overlay-left):not(.is-left-compact) > .win-nav-left-panel.is-pane-closing + .win-nav-content {
    animation: win-nav-inline-content-closing var(--win-nav-pane-close-duration, 200ms) var(--win-nav-pane-easing, cubic-bezier(0, 0.35, 0.15, 1)) both;
  }

  @keyframes win-nav-inline-content-opening {
    from { transform: translateX(calc(var(--win-nav-compact-pane-length, 48px) - var(--win-nav-open-pane-length, 320px))); }
    to { transform: translateX(0); }
  }

  @keyframes win-nav-inline-content-closing {
    from { transform: translateX(calc(var(--win-nav-open-pane-length, 320px) - var(--win-nav-compact-pane-length, 48px))); }
    to { transform: translateX(0); }
  }

  .win-nav-left-scrollable {
    flex: 1;
    min-height: 0;
    position: relative;
  }

  .win-nav-footer {
    display: flex;
    flex-direction: column;
    gap: 0;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
    background: transparent;
  }

  .win-nav-pane-command-row {
    box-sizing: border-box;
    width: 100%;
    min-height: 40px;
    display: flex;
    align-items: flex-start;
    flex-shrink: 0;
    position: relative;
    z-index: 4;
  }

  .win-nav-pane-top {
    display: flex;
    flex-direction: column;
    gap: 0;
    flex-shrink: 0;
    padding: 0 12px 8px;
    position: relative;
    z-index: 2;
  }

  .win-nav-pane-top.is-closed-compact {
    padding-left: 0;
    padding-right: 0;
  }

  .win-nav-pane-header,
  .win-nav-pane-footer,
  .win-nav-pane-custom-content {
    box-sizing: border-box;
    width: 100%;
    min-height: 32px;
    display: flex;
    align-items: center;
    color: var(--text-primary);
  }

  .win-nav-pane-footer {
    flex: 0 0 auto;
    flex-direction: row;
    justify-content: flex-start;
    align-self: stretch;
    overflow: hidden;
    /* FooterContentBorder shares PaneContentGrid; its hosted controls own
       their own content padding, as NavigationViewItem does. */
    padding: 0;
    margin-bottom: 4px;
  }

  .win-nav-pane-footer > .win-stack-panel,
  .win-nav-pane-footer > * {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
  }

  .win-nav-pane-footer .win-stack-panel {
    flex: 1 1 auto;
    align-items: stretch !important;
  }

  .win-nav-pane-footer .win-btn {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    height: 36px;
    min-height: 36px;
    margin: 2px 0;
    padding: 0 12px;
    border-radius: 4px;
    gap: 0;
    justify-content: flex-start;
  }

  .win-nav-pane-footer .win-btn > .icon {
    width: 16px;
    min-width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
  }

  .win-nav-left-panel.is-closed-compact .win-nav-pane-footer {
    width: calc(var(--win-nav-compact-pane-length, 48px) + 2px);
    min-width: calc(var(--win-nav-compact-pane-length, 48px) + 2px);
    padding: 0;
  }

  .win-nav-left-panel.is-closed-compact .win-nav-pane-footer > *,
  .win-nav-left-panel.is-closed-compact .win-nav-pane-footer .win-stack-panel {
    width: calc(var(--win-nav-compact-pane-length, 48px) + 2px);
    min-width: calc(var(--win-nav-compact-pane-length, 48px) + 2px);
  }

  .win-nav-left-panel.is-closed-compact .win-nav-pane-footer .win-btn {
    width: calc(var(--win-nav-compact-pane-length, 48px) + 2px);
    min-width: calc(var(--win-nav-compact-pane-length, 48px) + 2px);
    margin: 2px 0;
    padding: 0;
    justify-content: center;
  }

  .win-nav-pane-header.has-pane-toggle {
    min-height: 40px;
    margin-top: -40px;
    margin-left: 40px;
    padding-right: 8px;
    position: relative;
    z-index: 2;
  }

  .win-nav-pane-title-holder {
    box-sizing: border-box;
    height: 40px;
    min-height: 40px;
    padding: 4px 8px 0;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .win-nav-pane-title {
    min-height: 32px;
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .win-nav-hamburger.has-pane-title {
    width: auto;
    min-width: calc(100% - 8px);
    max-width: calc(100% - 8px);
    justify-content: flex-start;
    overflow: hidden;
  }

  .win-nav-hamburger.has-pane-title > .icon {
    margin: 0 12px;
    flex-shrink: 0;
  }

  .win-nav-hamburger .win-nav-pane-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .win-nav-pane-search {
    display: flex;
    align-items: center;
    min-height: 40px;
  }

    .win-nav-pane-search-presenter,
    .win-nav-pane-search-presenter > * {
      width: 100%;
    }

  .win-nav-pane-search-button {
    box-sizing: border-box;
    width: calc(var(--win-nav-compact-pane-length, 48px) - 8px);
    min-width: calc(var(--win-nav-compact-pane-length, 48px) - 8px);
    height: 36px;
    min-height: 36px;
    padding: 0;
    border: 0;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--text-primary);
    background: transparent;
    cursor: pointer;
    transition: background var(--fast-duration) var(--fast-out-slow-in);
  }

  .win-nav-pane-search-button:hover {
    background: var(--subtle-secondary);
  }

  .win-nav-pane-search-button:active {
    background: var(--subtle-tertiary);
  }

  .win-nav-pane-search-button .icon {
    width: 16px;
    height: 16px;
    font-size: 12px;
    line-height: 16px;
  }

  .win-nav-shell.is-overlay-left > .win-nav-left-panel .win-nav-footer {
    background: transparent;
  }

  .win-nav-back-button,
  .win-nav-hamburger {
    padding: 0;
    border: 0;
    color: var(--text-primary);
    font: inherit;
    width: 40px;
    height: 36px;
    margin: 2px 0;
    border-radius: 4px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: transparent;
    transition: background var(--fast-duration) var(--fast-out-slow-in);
  }

    .win-nav-hamburger .icon {
      width: 16px;
      height: 16px;
      font-size: 16px;
      line-height: 16px;
    }

    .win-nav-back-button .icon {
      width: 16px;
      height: 16px;
      font-size: 11px;
      line-height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }


  .win-nav-left-panel > .win-nav-back-button,
  .win-nav-left-panel .win-nav-hamburger {
    margin: var(--NavigationViewItemButtonMargin, 2px 4px);
  }

    .win-nav-back-button:disabled {
      color: var(--text-disabled);
      cursor: default;
    }

    .win-nav-back-button:not(:disabled):hover,
    .win-nav-hamburger:hover {
      background: var(--subtle-secondary);
    }

    .win-nav-back-button:not(:disabled):active,
    .win-nav-hamburger:active {
      background: var(--subtle-tertiary);
    }

  .win-nav-menu {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .win-nav-top-bar {
    position: relative;
    box-sizing: border-box;
    background: var(--NavigationViewTopPaneBackground, transparent);
    width: calc(100% - 8px);
    height: 48px;
    margin: 0 4px;
    flex-shrink: 0;
    transition: width var(--normal-duration) var(--fast-out-slow-in), background var(--normal-duration) var(--fast-out-slow-in);
    display: flex;
    align-items: center;
  }

  .win-nav-top-fixed {
    flex-shrink: 0;
  }

  .win-nav-top-pane-header,
  .win-nav-top-pane-title,
  .win-nav-top-pane-footer {
    min-height: 40px;
    display: flex;
    align-items: center;
    color: var(--text-primary);
  }

  .win-nav-top-pane-title {
    margin: 0 16px;
  }

  .win-nav-top-pane-footer > .win-stack-panel {
    height: 40px;
    align-items: stretch;
  }

  .win-nav-top-pane-footer .win-btn {
    box-sizing: border-box;
    width: 36px;
    min-width: 36px;
    height: 36px;
    min-height: 36px;
    margin: 2px 0;
    padding: 0;
  }

  .win-nav-top-pane-custom-content {
    min-width: 48px;
    height: 48px;
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .win-nav-top-primary-menu {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
  }

  .win-nav-top-footer-menu {
    flex: 0 0 auto;
    margin-left: auto;
  }

  .win-nav-top-pane-search {
    min-width: 216px;
    height: 48px;
    margin: 0 4px;
    display: flex;
    align-items: center;
  }

  .win-nav-top-pane-search > * {
    width: 100%;
  }

  .win-nav-top-measure {
    position: absolute;
    left: -10000px;
    top: -10000px;
    display: flex;
    align-items: center;
    gap: 0;
    height: 48px;
    visibility: hidden;
    pointer-events: none;
  }

    .win-nav-top-bar .win-nav-indicator-track {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: visible;
    }

    .win-nav-top-bar .win-nav-menu {
      flex-direction: row;
      align-items: center;
      gap: 0;
      height: 100%;
    }

  .win-nav-item {
    position: relative;
    box-sizing: border-box;
    height: 36px;
    margin: 2px 0;
    padding: 0 12px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    cursor: pointer;
    background: transparent;
    transition: background var(--fast-duration) var(--fast-out-slow-in);
    white-space: nowrap;
    user-select: none;
    color: var(--NavigationViewItemForeground, var(--text-primary));
    background: var(--NavigationViewItemBackground, transparent);
    outline-offset: -2px;
  }

  .win-nav-left-panel .win-nav-item {
    margin: var(--NavigationViewItemButtonMargin, 2px 4px);
    height: var(--NavigationViewItemOnLeftMinHeight, 36px);
    min-height: var(--NavigationViewItemOnLeftMinHeight, 36px);
  }

  .win-nav-item.is-pressed {
    transition: none;
  }

    .win-nav-item:not(.is-disabled):hover {
      background: var(--NavigationViewItemBackgroundPointerOver, var(--subtle-secondary));
      color: var(--NavigationViewItemForegroundPointerOver, var(--text-primary));
    }

    .win-nav-item:not(.is-disabled).is-pressed,
    .win-nav-more-button:not(.is-disabled):active {
      background: var(--NavigationViewItemBackgroundPressed, var(--subtle-tertiary));
      color: var(--NavigationViewItemForegroundPressed, var(--text-secondary));
    }

  .win-nav-left-panel .win-nav-item:not(.is-disabled).is-pressed {
    color: var(--text-secondary);
  }

  .win-nav-item.is-selected {
    background: var(--NavigationViewItemBackgroundSelected, var(--subtle-secondary));
  }

    .win-nav-item.is-selected:not(.is-disabled):hover {
      background: var(--NavigationViewItemBackgroundSelectedPointerOver, var(--subtle-tertiary));
    }

    .win-nav-item.is-selected:not(.is-disabled).is-pressed {
      background: var(--NavigationViewItemBackgroundSelectedPressed, var(--subtle-secondary));
      color: var(--text-secondary);
    }

  .win-nav-item.is-disabled {
    color: var(--text-disabled);
    cursor: default;
  }

    .win-nav-item.is-disabled:not(.is-selected),
    .win-nav-item.is-disabled:not(.is-selected):hover,
    .win-nav-item.is-disabled:not(.is-selected).is-pressed {
      background: transparent;
      color: var(--text-disabled);
    }

    .win-nav-item.is-disabled.is-selected,
    .win-nav-item.is-disabled.is-selected:hover,
    .win-nav-item.is-disabled.is-selected.is-pressed {
      background: var(--subtle-secondary);
      color: var(--text-disabled);
    }

  .win-nav-item .icon {
    margin-right: 16px;
    min-width: 16px;
    width: 16px;
    text-align: center;
    font-size: 16px;
    line-height: 1;
    position: relative;
  }

  .win-nav-item .label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 20px;
    color: inherit;
  }

  .win-nav-left-panel:not(.is-closed-compact) .win-nav-item {
    padding-right: 14px;
  }

  .win-nav-left-panel:not(.is-closed-compact) .win-nav-item > .label {
    flex: 1 1 0;
  }

  /* The default InfoBadgePresenter occupies the Auto badge column beside
     content and centers vertically. ClosedCompact alone moves the presenter
     to the upper-right corner over all four item columns. */
  .win-nav-item .win-nav-infobadge-presenter {
    margin-left: auto;
    width: max-content;
    height: max-content;
    flex: 0 0 auto;
    align-self: center;
  }

  .win-nav-item-header {
    box-sizing: border-box;
    height: 40px;
    min-height: 40px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    user-select: none;
  }

  .win-nav-item-header .win-text-block {
    color: inherit;
    font-size: inherit;
    line-height: inherit;
    font-weight: inherit;
  }

  .win-nav-item-separator {
    height: 1px;
    margin: 3px 0 4px;
    background: var(--stroke-divider);
  }


  .win-nav-left-panel.is-closed-compact .win-nav-item .label {
    opacity: 0;
    pointer-events: none;
  }

  .win-nav-left-panel.is-closed-compact .win-nav-item {
    /* PaneContentGrid adds two pixels through its -1 horizontal margin;
       each presenter then owns the official four-pixel button margin.
       Footer items also need this bound because FooterMenuItemsHost stretches
       across the full pane surface during its clipped transition. */
    width: calc(var(--win-nav-compact-pane-length, 48px) - 6px);
    min-width: calc(var(--win-nav-compact-pane-length, 48px) - 6px);
    max-width: calc(var(--win-nav-compact-pane-length, 48px) - 6px);
    overflow: hidden;
  }

  .win-nav-left-panel.is-closed-compact .win-nav-item > .win-nav-infobadge-presenter {
    position: absolute;
    top: 2px;
    right: 2px;
    margin: 0;
  }

  .win-nav-left-panel.is-closed-compact .win-nav-item-header {
    height: 0;
    min-height: 0;
    padding: 0;
    opacity: 0;
    overflow: hidden;
  }

  .win-nav-left-panel.is-closed-compact .win-nav-group-chevron {
    opacity: 0;
    pointer-events: none;
  }

  .win-nav-indicator {
    position: absolute;
    background: var(--accent-base);
    border-radius: 2px;
    pointer-events: none;
    z-index: 10;
    contain: layout paint;
    will-change: transform, width, height;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  .win-nav-left-panel .win-nav-indicator {
    left: 4px;
    top: 0;
    width: 3px;
    height: 16px;
    transition: none;
  }

  .win-nav-top-bar .win-nav-indicator {
    top: auto;
    bottom: 4px;
    left: 0;
    height: 3px;
  }

  .win-nav-top-bar .win-nav-item,
  .win-nav-top-measure .win-nav-item {
    color: var(--text-primary);
  }

  .win-nav-top-bar .win-nav-item:not(.win-nav-more-button):not(.win-nav-settings-item),
  .win-nav-top-measure .win-nav-item:not(.win-nav-more-button) {
    box-sizing: border-box;
    width: max-content;
    height: 40px;
    min-height: 40px;
    margin: 2px 4px;
    padding: 0;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    align-items: center;
    justify-content: start;
  }

  .win-nav-top-bar .win-nav-item:not(.win-nav-more-button):not(.win-nav-settings-item) > .icon:not(.win-nav-group-chevron),
  .win-nav-top-measure .win-nav-item:not(.win-nav-more-button) > .icon:not(.win-nav-group-chevron) {
    grid-column: 1;
    grid-row: 1;
    width: 16px;
    min-width: 16px;
    margin: 0 0 0 12px;
    top: 0;
  }

  .win-nav-top-bar .win-nav-item:not(.win-nav-more-button):not(.win-nav-settings-item) > .label,
  .win-nav-top-measure .win-nav-item:not(.win-nav-more-button) > .label {
    grid-column: 2;
    grid-row: 1;
    margin: 0 12px;
  }

  .win-nav-top-bar .win-nav-item:not(.win-nav-more-button):not(.win-nav-settings-item) > .win-nav-infobadge-presenter,
  .win-nav-top-measure .win-nav-item:not(.win-nav-more-button) > .win-nav-infobadge-presenter {
    grid-column: 4;
    grid-row: 1;
    margin: 0 2px 13px -16px;
    align-self: center;
    justify-self: center;
  }

  .win-nav-top-bar .win-nav-item:has(> .icon:not(.win-nav-group-chevron)):not(.win-nav-more-button):not(.win-nav-settings-item) > .label,
  .win-nav-top-measure .win-nav-item:has(> .icon:not(.win-nav-group-chevron)):not(.win-nav-more-button) > .label {
    margin-left: 8px;
  }

  .win-nav-top-bar .win-nav-item-header,
  .win-nav-top-measure .win-nav-item-header {
    padding: 0 12px;
  }

  .win-nav-top-bar .win-nav-item-separator,
  .win-nav-top-measure .win-nav-item-separator {
    align-self: center;
    width: 1px;
    min-width: 1px;
    height: 24px;
    margin: 0 4px 0 3px;
  }

    .win-nav-top-bar .win-nav-more-button,
    .win-nav-top-measure .win-nav-more-button {
      box-sizing: border-box;
      width: 40px;
      min-width: 40px;
      max-width: 40px;
      height: 40px;
      min-height: 40px;
      max-height: 40px;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

      .win-nav-top-bar .win-nav-more-button .icon,
      .win-nav-top-measure .win-nav-more-button .icon {
        top: 0;
        width: 20px;
        min-width: 20px;
        height: 20px;
        margin: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        line-height: 20px;
      }

      .win-nav-top-bar .win-nav-more-button .icon:only-child,
      .win-nav-top-measure .win-nav-more-button .icon:only-child {
        margin-right: 0;
      }

      .win-nav-top-bar .win-nav-more-button .label,
      .win-nav-top-measure .win-nav-more-button .label {
        display: none;
      }

    .win-nav-top-bar .win-nav-item:not(.is-disabled):hover {
      background: var(--subtle-secondary);
      color: var(--text-primary);
    }

    .win-nav-top-bar .win-nav-item:not(.is-disabled).is-pressed,
    .win-nav-top-bar .win-nav-more-button:not(.is-disabled):active {
      background: var(--subtle-tertiary);
      color: var(--text-secondary);
    }

    .win-nav-top-bar .win-nav-item.is-selected {
      background: transparent;
      color: var(--text-primary);
    }

      .win-nav-top-bar .win-nav-item.is-selected:not(.is-disabled):hover {
        background: transparent;
        color: var(--text-primary);
      }

      .win-nav-top-bar .win-nav-item.is-selected:not(.is-disabled).is-pressed {
        background: transparent;
        color: var(--text-secondary);
      }

  .win-nav-top-bar .win-nav-settings-item .label {
    display: none;
  }

  .win-nav-top-bar .win-nav-settings-item {
    box-sizing: border-box;
    width: 40px;
    min-width: 40px;
    max-width: 40px;
    height: 40px;
    min-height: 40px;
    max-height: 40px;
    padding: 0;
    margin: 2px 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .win-nav-top-bar .win-nav-settings-item .icon {
    margin: 0;
    top: 0;
  }

  .win-nav-shell.is-top > .win-nav-content,
  .win-nav-shell.is-top > .win-nav-content > .win-nav-content-inner {
    border-radius: 0 !important;
  }

  .win-nav-group-header {
    position: relative;
  }

    .win-nav-group-header .win-nav-group-chevron {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      min-width: 40px;
      height: 36px;
      margin-left: auto;
      margin-right: -14px;
      overflow: hidden;
    }

  .win-nav-group-children {
    overflow: hidden;
    transition: height var(--normal-duration) var(--fast-out-slow-in);
  }

  .win-nav-group-children.is-pane-collapsing {
    transition-duration: var(--win-nav-pane-close-duration);
    transition-timing-function: var(--win-nav-pane-easing);
  }

  .win-nav-group-children-inner {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding-top: 0;
  }

  .win-nav-group-child {
    padding-left: 43px;
  }

    .win-nav-group-child .icon {
      margin-right: 16px;
    }

  .win-nav-left-panel .win-nav-group.is-child-selected > .win-nav-group-header {
    background: transparent;
  }

    .win-nav-left-panel .win-nav-group.is-child-selected > .win-nav-group-header:not(.is-disabled):hover {
      background: var(--subtle-secondary);
    }

  .win-nav-left-panel.is-closed-compact .win-nav-group.is-child-selected > .win-nav-group-header {
    background: transparent;
  }

  .win-nav-top-bar .win-nav-group-header > .win-nav-group-chevron,
  .win-nav-top-measure .win-nav-item > .win-nav-group-chevron {
    grid-column: 3;
    grid-row: 1;
    width: 40px;
    min-width: 40px;
    height: 40px;
    margin: 0 0 0 -12px;
  }

  .win-nav-top-bar .win-nav-group-header:has(> .icon:not(.win-nav-group-chevron)) > .win-nav-group-chevron,
  .win-nav-top-measure .win-nav-item:has(> .icon:not(.win-nav-group-chevron)) > .win-nav-group-chevron {
    margin-left: -16px;
  }

  .win-nav-top-bar .win-nav-group.is-child-selected > .win-nav-group-header {
    background: transparent;
  }

  .win-nav-top-bar .win-nav-group {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .win-nav-more-panel {
    width: max-content;
    min-width: 0;
    max-width: min(320px, calc(100vw - 16px));
    display: grid;
    grid-template-columns: max-content;
    justify-items: stretch;
  }

  .win-nav-more-button { border: 0; font: inherit; }
  .win-nav-item:focus-visible,
  .win-nav-back-button:focus-visible,
  .win-nav-hamburger:focus-visible,
  .win-nav-pane-search-button:focus-visible {
    outline: 2px solid var(--FocusStrokeColorOuterBrush, var(--text-primary));
    outline-offset: -2px;
  }
  .win-nav-shell[aria-disabled="true"] .win-nav-item { pointer-events: none; }
  .win-nav-pane-footer .win-nav-item { flex: 0 0 40px; width: 40px; padding: 0 12px; }
  .win-nav-top-bar .win-nav-item .label { max-width: 100%; }
  .win-nav-top-bar .win-nav-item { min-width: 0; }
  .win-nav-more-panel .win-nav-item .label { max-width: 100%; }

  .win-nav-more-title {
    min-height: 32px;
    padding: 4px 12px;
    display: flex;
    align-items: center;
    color: var(--text-secondary);
    font-size: 12px;
  }

  .win-nav-more-panel .win-nav-item {
    box-sizing: border-box;
    width: auto;
    height: 36px;
    min-height: 36px;
    margin: 0;
    padding: 0 14px 0 0;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    align-items: center;
    border-radius: 0;
    background: transparent;
    color: var(--text-primary);
  }

  .win-nav-more-panel > .win-nav-group {
    width: 100%;
  }

  .win-nav-more-panel .win-nav-item > .icon:not(.win-nav-group-chevron) {
    grid-column: 1;
    width: 16px;
    min-width: 16px;
    margin: 0 0 0 16px;
  }

  .win-nav-more-panel .win-nav-item > .label {
    grid-column: 2;
    margin: 0 20px 0 16px;
  }

  .win-nav-more-panel .win-nav-item:has(> .icon:not(.win-nav-group-chevron)) > .label {
    margin-left: 12px;
  }

  .win-nav-more-panel .win-nav-item > .win-nav-infobadge-presenter {
    grid-column: 3;
    margin: 0 12px 0 0;
  }

  .win-nav-more-panel .win-nav-group-header > .win-nav-group-chevron {
    grid-column: 4;
    box-sizing: border-box;
    width: 40px;
    min-width: 40px;
    height: 36px;
    margin: 0 -8px 0 -4px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .win-nav-more-panel .win-nav-item:not(.is-disabled):hover {
    background: var(--subtle-secondary);
    color: var(--text-primary);
  }

  .win-nav-more-panel .win-nav-item:not(.is-disabled).is-pressed {
    background: var(--subtle-tertiary);
    color: var(--text-secondary);
  }

  .win-nav-more-panel .win-nav-item.is-selected {
    background: var(--subtle-secondary);
    color: var(--text-primary);
  }

  .win-nav-more-panel .win-nav-item.is-selected:not(.is-disabled):hover {
    background: var(--subtle-tertiary);
    color: var(--text-primary);
  }

  .win-nav-more-panel .win-nav-item.is-selected:not(.is-disabled).is-pressed {
    background: var(--subtle-secondary);
    color: var(--text-secondary);
  }

  .win-nav-more-panel .win-nav-group-child {
    padding-left: 31px;
  }

  .win-nav-shell.is-left-compact > .win-nav-left-panel:not(.is-compact)::before,
  html.winui-webview-host .win-nav-shell.is-overlay-left.is-left-compact > .win-nav-left-panel:not(.is-compact)::before {
    content: none;
  }

  .win-nav-shell.is-left-compact > .win-nav-left-panel.is-compact,
  html.winui-webview-host .win-nav-shell.is-overlay-left.is-left-compact > .win-nav-left-panel.is-compact {
    background: var(--NavigationViewExpandedPaneBackground, transparent);
  }

  .win-nav-shell.is-left-minimal > .win-nav-left-panel > .win-nav-pane-surface {
  }

  .win-menu-flyout:has(.win-nav-more-panel) {
    --flyout-scroll-max-height: calc(var(--flyout-max-height, 70vh) - 6px);
    padding: 2px 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .win-nav-left-panel,
    .win-nav-pane-surface,
    .win-nav-content,
    .win-nav-indicator,
    .win-nav-group-children,
    .win-nav-group-chevron {
      transition-duration: 0ms !important;
      animation-duration: 0ms !important;
    }
  }

</style>
