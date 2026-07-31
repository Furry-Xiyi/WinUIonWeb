<template>
  <div class="win-nav-shell" :class="shellClasses" :style="paneStyle" ref="shellRef">
    <nav v-if="isTopNavigation" class="win-nav-top-bar" ref="navRef">
      <div class="win-nav-indicator-track" ref="indicatorTrack">
        <div class="win-nav-indicator" :style="indicatorStyle"></div>
      </div>
      <button v-if="showBackButtonResolved" class="win-nav-back-button" :disabled="!canGoBack" :aria-label="t('text.back')" v-bind="{ 'tooltipservice.tooltip': t('text.back') }" @click="onBackClick" @mousedown="onBackDown" @mouseup="onBackUp" @mouseleave="onBackLeave" ref="topBackButtonRef">
        <span class="icon animated-icon animated-icon-back" :class="backClass" @animationend="onBackAnimEnd"></span>
      </button>
      <div class="win-nav-menu win-nav-top-primary-menu" ref="topPrimaryMenuRef">
        <template v-for="item in topVisibleMenuItems" :key="item.value">
          <div v-if="item.type === 'Header'" class="win-nav-item-header">
            <WinTextBlock :Text="item.label" />
          </div>
          <div v-else-if="item.type === 'Separator'" class="win-nav-item-separator"></div>
          <div v-else-if="!item.children" class="win-nav-item" :class="{ 'is-selected': selectedValue === item.value }" v-bind="itemToolTipAttrs(item)" @click="onItemClick(item)" :ref="el => setItemRef(item.value, el)">
            <span class="icon">{{ item.icon }}</span>
            <WinTextBlock class="label" :Text="item.label" />
          </div>
          <div v-else class="win-nav-group" :class="{ 'is-child-selected': isChildOfGroup(item) }">
            <div class="win-nav-item win-nav-group-header" :class="{ 'is-selected': item.selectsOnInvoked !== false && selectedValue === item.value }" v-bind="itemToolTipAttrs(item)" @click="onGroupHeaderClick(item)" :ref="el => setItemRef(item.value, el)">
              <span class="icon">{{ item.icon }}</span>
              <WinTextBlock class="label" :Text="item.label" />
              <span class="icon win-nav-group-chevron" :class="groupChevronClass(item.value)"></span>
            </div>
          </div>
        </template>
        <div v-if="topOverflowMenuItems.length" class="win-nav-item win-nav-more-button" :aria-label="t('text.more')" v-bind="{ 'tooltipservice.tooltip': t('text.more') }" @click="toggleMoreFlyout" ref="moreButtonRef">
          <span class="icon">&#xE712;</span>
          <WinTextBlock v-if="officialProps.OverflowLabelMode === 'MoreLabel'" class="label" :Text="t('text.more')" />
        </div>
      </div>
      <div style="flex:1"></div>
      <div class="win-nav-menu win-nav-top-footer-menu" ref="topFooterMenuRef">
        <template v-for="item in footerItems" :key="item.value">
          <div v-if="item.type === 'Header'" class="win-nav-item-header"><WinTextBlock :Text="item.label" /></div>
          <div v-else-if="item.type === 'Separator'" class="win-nav-item-separator"></div>
          <div v-else class="win-nav-item" :class="{ 'is-selected': selectedValue === item.value }" v-bind="itemToolTipAttrs(item)" @click="onItemClick(item)" :ref="el => setItemRef(item.value, el)">
            <span class="icon">{{ item.icon }}</span>
            <WinTextBlock class="label" :Text="item.label" />
          </div>
        </template>
        <div v-if="isSettingsVisible" class="win-nav-item win-nav-settings-item" :class="{ 'is-selected': selectedValue === settingsValue }" @click="selectSettings" @mousedown="onGearDown" @mouseup="onGearUp" @mouseleave="onGearLeave" :ref="el => setItemRef(settingsValue, el)">
          <span class="icon animated-icon animated-icon-gear" :class="gearClass" @animationend="onGearAnimEnd">{{ settingsIcon }}</span>
          <WinTextBlock class="label" :Text="resolvedSettingsLabel" />
        </div>
      </div>
      <div class="win-nav-top-measure" ref="topMeasureRef" aria-hidden="true">
        <template v-for="item in menuItems" :key="item.value">
          <div v-if="item.type === 'Header'" class="win-nav-item-header" :data-value="item.value"><WinTextBlock :Text="item.label" /></div>
          <div v-else-if="item.type === 'Separator'" class="win-nav-item-separator" :data-value="item.value"></div>
          <div v-else class="win-nav-item" :data-value="item.value">
            <span class="icon">{{ item.icon }}</span>
            <WinTextBlock class="label" :Text="item.label" />
            <span v-if="item.children" class="icon win-nav-group-chevron">&#xE70D;</span>
          </div>
        </template>
        <div class="win-nav-item win-nav-more-button" data-value="__more">
          <span class="icon">&#xE712;</span>
          <WinTextBlock v-if="officialProps.OverflowLabelMode === 'MoreLabel'" class="label" :Text="t('text.more')" />
        </div>
      </div>
    </nav>
    <nav v-else class="win-nav-left-panel" :class="['win-nav-left-panel', { 'is-compact': isCompact, 'is-minimal': isLeftMinimalMode }, paneTransition ? `is-pane-${paneTransition}` : '']" :style="paneStyle" ref="navRef">
      <div class="win-nav-indicator-track" ref="indicatorTrack" v-show="!isLeftMinimalMode || !isCompact || paneTransition === 'closing'">
        <div class="win-nav-indicator" :class="{ 'is-child': indicatorIsChild }" :style="indicatorStyle"></div>
      </div>
      <button v-if="showBackButtonInLeftNav" class="win-nav-back-button" :disabled="!canGoBack" :aria-label="t('text.back')" v-bind="{ 'tooltipservice.tooltip': t('text.back') }" @click="onBackClick" @mousedown="onBackDown" @mouseup="onBackUp" @mouseleave="onBackLeave">
        <span class="icon animated-icon animated-icon-back" :class="backClass" @animationend="onBackAnimEnd">&#xE72B;</span>
      </button>
      <button v-if="isPaneToggleButtonVisible" class="win-nav-hamburger" :aria-label="t('text.navigation-menu')" v-bind="{ 'tooltipservice.tooltip': t('text.navigation-menu') }" @click="toggleCompact" @mousedown="onHamburgerDown" @mouseup="onHamburgerUp" @mouseleave="onHamburgerLeave">
        <span class="icon animated-icon animated-icon-hamburger" :class="hamburgerClass" @animationend="onHamburgerAnimEnd">&#xE700;</span>
      </button>
      <div v-if="$slots.PaneHeader || paneTitle || $slots.AutoSuggestBox" class="win-nav-pane-top" v-show="!isLeftMinimalMode || !isCompact || paneTransition === 'closing'">
        <div v-if="$slots.PaneHeader" class="win-nav-pane-header"><slot name="PaneHeader"></slot></div>
        <WinTextBlock v-if="paneTitle" class="win-nav-pane-title" :Text="paneTitle" />
        <div v-if="$slots.AutoSuggestBox" class="win-nav-pane-search"><slot name="AutoSuggestBox"></slot></div>
      </div>
      <div v-if="$slots.PaneCustomContent" class="win-nav-pane-custom-content" v-show="!isLeftMinimalMode || !isCompact || paneTransition === 'closing'"><slot name="PaneCustomContent"></slot></div>
      <WinScrollViewer
        class="win-nav-left-scrollable"
        ref="scrollArea"
        v-show="!isLeftMinimalMode || !isCompact || paneTransition === 'closing'"
        VerticalScrollMode="Auto"
        VerticalScrollBarVisibility="Auto"
        HorizontalScrollMode="Disabled"
        HorizontalScrollBarVisibility="Disabled"
        @ViewChanged="onScroll">
        <div class="win-nav-menu">
          <template v-for="item in menuItems" :key="item.value">
            <div v-if="item.type === 'Header'" class="win-nav-item-header">
              <WinTextBlock :Text="item.label" />
            </div>
            <div v-else-if="item.type === 'Separator'" class="win-nav-item-separator"></div>
            <div v-else-if="!item.children" class="win-nav-item" :class="{ 'is-selected': selectedValue === item.value }" v-bind="itemToolTipAttrs(item)" @click="onItemClick(item)" :ref="el => setItemRef(item.value, el)">
              <span class="icon">{{ item.icon }}</span>
              <WinTextBlock class="label" :Text="item.label" />
            </div>
            <div v-else class="win-nav-group" :class="{ 'is-expanded': groupExpanded[item.value], 'is-child-selected': isChildOfGroup(item) }">
              <div class="win-nav-item win-nav-group-header" :class="{ 'is-selected': item.selectsOnInvoked !== false && selectedValue === item.value }" v-bind="itemToolTipAttrs(item)" @click="onGroupHeaderClick(item)" :ref="el => setItemRef(item.value, el)">
                <span class="icon">{{ item.icon }}</span>
                <WinTextBlock class="label" :Text="item.label" />
                <span class="icon win-nav-group-chevron" :class="groupChevronClass(item.value)">&#xE70D;</span>
              </div>
              <div v-if="!isCompact" class="win-nav-group-children" :style="{ height: groupExpanded[item.value] ? (groupHeights[item.value] || 0) + 'px' : '0px' }">
                <div class="win-nav-group-children-inner" :ref="el => setChildrenRef(item.value, el)">
                  <div v-for="child in item.children" :key="child.value" class="win-nav-item win-nav-group-child" :class="{ 'is-selected': selectedValue === child.value }" v-bind="itemToolTipAttrs(child)" @click="onChildClick(item, child)" :ref="el => setItemRef(child.value, el)">
                    <span class="icon">{{ child.icon }}</span>
                    <WinTextBlock class="label" :Text="child.label" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </WinScrollViewer>
      <div class="win-nav-footer" v-show="!isLeftMinimalMode || !isCompact || paneTransition === 'closing'">
        <div v-if="$slots.PaneFooter" class="win-nav-pane-footer"><slot name="PaneFooter"></slot></div>
        <template v-for="item in footerItems" :key="item.value">
          <div v-if="item.type === 'Header'" class="win-nav-item-header"><WinTextBlock :Text="item.label" /></div>
          <div v-else-if="item.type === 'Separator'" class="win-nav-item-separator"></div>
          <div v-else class="win-nav-item" :class="{ 'is-selected': selectedValue === item.value }" v-bind="itemToolTipAttrs(item)" @click="onItemClick(item)" :ref="el => setItemRef(item.value, el)">
            <span class="icon">{{ item.icon }}</span>
            <WinTextBlock class="label" :Text="item.label" />
          </div>
        </template>
        <div v-if="isSettingsVisible" class="win-nav-item win-nav-settings-item" :class="{ 'is-selected': selectedValue === settingsValue }" v-bind="isCompact ? { 'tooltipservice.tooltip': resolvedSettingsLabel } : {}" @click="selectSettings" @mousedown="onGearDown" @mouseup="onGearUp" @mouseleave="onGearLeave" :ref="el => setItemRef(settingsValue, el)">
          <span class="icon animated-icon animated-icon-gear" :class="gearClass" @animationend="onGearAnimEnd">{{ settingsIcon }}</span>
          <WinTextBlock class="label" :Text="resolvedSettingsLabel" />
        </div>
      </div>
    </nav>
    <main class="win-nav-content">
      <div v-if="shouldShowHeader" class="win-nav-page-header">
        <slot name="Header"><WinTextBlock :Text="header" /></slot>
      </div>
      <div class="win-nav-content-inner"><slot></slot></div>
      <div v-if="$slots.ContentOverlay" class="win-nav-content-overlay"><slot name="ContentOverlay"></slot></div>
    </main>
    <WinMenuFlyout :Open="flyoutOpen" :AnchorRect="flyoutAnchor" :Items="flyoutItems" :Placement="flyoutPlacement" @Close="closeFlyout" @Select="onFlyoutSelect" />
    <WinMenuFlyout :Open="moreFlyoutOpen" :AnchorRect="moreFlyoutAnchor" :Items="[]" Placement="BottomEdgeAlignedRight" @Close="closeMoreFlyout">
      <div class="win-nav-more-panel">
        <template v-for="item in topOverflowMenuItems" :key="item.value">
          <div v-if="item.type === 'Header'" class="win-nav-item-header"><WinTextBlock :Text="item.label" /></div>
          <div v-else-if="item.type === 'Separator'" class="win-nav-item-separator"></div>
          <div v-else-if="!item.children" class="win-nav-item" :class="{ 'is-selected': selectedValue === item.value }" v-bind="itemToolTipAttrs(item)" @click="onMoreItemClick(item)">
            <span class="icon">{{ item.icon }}</span>
            <WinTextBlock class="label" :Text="item.label" />
          </div>
          <div v-else class="win-nav-group" :class="{ 'is-expanded': groupExpanded[item.value], 'is-child-selected': isChildOfGroup(item) }">
            <div class="win-nav-item win-nav-group-header" :class="{ 'is-selected': item.selectsOnInvoked !== false && selectedValue === item.value }" v-bind="itemToolTipAttrs(item)" @click="onMoreGroupHeaderClick(item)">
              <span class="icon">{{ item.icon }}</span>
              <WinTextBlock class="label" :Text="item.label" />
              <span class="icon win-nav-group-chevron" :class="groupChevronClass(item.value)">&#xE70D;</span>
            </div>
            <div class="win-nav-group-children" :style="{ height: groupExpanded[item.value] ? ((item.children?.length || 0) * 38 + 2) + 'px' : '0px' }">
              <div class="win-nav-group-children-inner">
                <div v-for="child in item.children" :key="child.value" class="win-nav-item win-nav-group-child" :class="{ 'is-selected': selectedValue === child.value }" v-bind="itemToolTipAttrs(child)" @click="onMoreChildClick(item, child)">
                  <span class="icon">{{ child.icon }}</span>
                  <WinTextBlock class="label" :Text="child.label" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </WinMenuFlyout>
  </div>
</template>
<script setup>
import { ref, reactive, inject, computed, onMounted, onBeforeUnmount, watch, nextTick, useSlots } from 'vue';
import WinMenuFlyout from './WinMenuFlyout.vue';
import WinScrollViewer from './WinScrollViewer.vue';
import WinTextBlock from './WinTextBlock.vue';
import { useI18n } from './i18n/index';

const { t } = useI18n();
const slots = useSlots();

const officialProps = defineProps({
  PaneDisplayMode: { type: String, default: 'Auto' },
  SelectedItem: { type: [Object, String, Number], default: null },
  MenuItems: { type: Array, default: () => [] },
  MenuItemsSource: { type: [Array, Object], default: null },
  FooterMenuItems: { type: Array, default: () => [] },
  FooterMenuItemsSource: { type: [Array, Object], default: null },
  IsBackButtonVisible: { type: String, default: 'Auto' },
  IsBackEnabled: { type: Boolean, default: false },
  IsSettingsVisible: { type: Boolean, default: true },
  IsPaneToggleButtonVisible: { type: Boolean, default: true },
  IsPaneOpen: { type: Boolean, default: true },
  IsPaneVisible: { type: Boolean, default: true },
  OpenPaneLength: { type: Number, default: 320 },
  CompactPaneLength: { type: Number, default: 48 },
  CompactModeThresholdWidth: { type: Number, default: 641 },
  ExpandedModeThresholdWidth: { type: Number, default: 1008 },
  PaneTitle: { type: String, default: '' },
  Header: { type: [String, Number, Object], default: '' },
  HeaderTemplate: { type: [Object, Function], default: null },
  PaneToggleButtonStyle: { type: [Object, String], default: null },
  MenuItemTemplate: { type: [Object, Function], default: null },
  MenuItemTemplateSelector: { type: [Object, Function], default: null },
  MenuItemContainerStyle: { type: [Object, String], default: null },
  MenuItemContainerStyleSelector: { type: [Object, Function], default: null },
  AutoSuggestBox: { type: Object, default: null },
  PaneFooter: { type: Object, default: null },
  PaneHeader: { type: Object, default: null },
  PaneCustomContent: { type: Object, default: null },
  ContentOverlay: { type: Object, default: null },
  AlwaysShowHeader: { type: Boolean, default: true },
  SelectionFollowsFocus: { type: String, default: 'Disabled' },
  ShoulderNavigationEnabled: { type: String, default: 'Never' },
  OverflowLabelMode: { type: String, default: 'MoreLabel' },
  IsTitleBarAutoPaddingEnabled: { type: Boolean, default: true }
});

const getItemTag = item => item && typeof item === 'object'
  ? (item.Tag ?? item.Value ?? item.Name ?? item.value)
  : item;
const normalizeItem = (item, fallbackKey = 'item') => {
  const declaredType = item?.Type ?? item?.type ?? (item?.IsHeader ? 'Header' : item?.IsSeparator ? 'Separator' : 'Item');
  const type = declaredType === 'NavigationViewItemHeader'
    ? 'Header'
    : declaredType === 'NavigationViewItemSeparator'
      ? 'Separator'
      : declaredType;
  const children = item?.MenuItems ?? item?.children;
  return {
    value: getItemTag(item) ?? `__${String(type).toLowerCase()}-${fallbackKey}`,
    label: item?.Content ?? item?.Name ?? item?.Text ?? item?.label ?? '',
    icon: item?.Icon ?? item?.Glyph ?? item?.icon ?? '',
    tooltip: item?.ToolTip ?? item?.Tooltip ?? item?.tooltip ?? '',
    type,
    children: Array.isArray(children)
      ? children.map((child, index) => normalizeItem(child, `${fallbackKey}-${index}`))
      : null,
    selectsOnInvoked: (item?.SelectsOnInvoked ?? item?.selectsOnInvoked) !== false,
    source: item
  };
};

const resolveItems = (items, source) => Array.isArray(items) && items.length ? items : (Array.isArray(source) ? source : []);
const menuItems = computed(() => resolveItems(officialProps.MenuItems, officialProps.MenuItemsSource)
  .map((item, index) => normalizeItem(item, `menu-${index}`)));
const footerItems = computed(() => resolveItems(officialProps.FooterMenuItems, officialProps.FooterMenuItemsSource)
  .map((item, index) => normalizeItem(item, `footer-${index}`)));
const internalSelectedItem = ref(officialProps.SelectedItem);
const selectedValue = computed(() => getItemTag(internalSelectedItem.value));

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

const titleBarVisible = inject('winTitleBarVisible', ref(false));
const hasTitlebar = computed(() => titleBarVisible.value);
const resolvedSettingsLabel = computed(() => props.settingsLabel);
const emit = defineEmits([
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
const isCompact = ref(!officialProps.IsPaneOpen || officialProps.PaneDisplayMode === 'LeftMinimal');
const paneTransition = ref('');
const shellRef = ref(null);
const navRef = ref(null);
const indicatorTrack = ref(null);
const scrollArea = ref(null);
const topPrimaryMenuRef = ref(null);
const topFooterMenuRef = ref(null);
const topMeasureRef = ref(null);
const moreButtonRef = ref(null);
const topBackButtonRef = ref(null);
const indicatorStyle = ref({ opacity: '0' });
const indicatorIsChild = ref(false);
const groupExpanded = reactive({});
const groupHeights = reactive({});
const groupChevrons = reactive({});
const flyoutOpen = ref(false);
const flyoutAnchor = ref(null);
const flyoutItems = ref([]);
const flyoutGroupValue = ref(null);
const moreFlyoutOpen = ref(false);
const moreFlyoutAnchor = ref(null);
const topAvailableWidth = ref(Number.POSITIVE_INFINITY);
const topItemWidths = ref({});
const topMoreButtonWidth = ref(72);
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
const itemToolTipAttrs = (item) => {
  const toolTip = item?.tooltip || (!isTopNavigation.value && isCompact.value ? item?.label : '');
  return toolTip ? { 'tooltipservice.tooltip': toolTip } : {};
};
const flyoutPlacement = computed(() => isTopNavigation.value ? 'Bottom' : 'RightEdgeAlignedTop');
const isLeftMinimalMode = computed(() => resolvedPaneDisplayMode.value === 'LeftMinimal');
const isLeftCompactMode = computed(() => resolvedPaneDisplayMode.value === 'LeftCompact');
const isLeftOverlayMode = computed(() => isLeftMinimalMode.value || isLeftCompactMode.value);
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
  !!(header.value || slots.Header) &&
  (officialProps.AlwaysShowHeader || displayMode.value === 'Expanded')
));
const settingsValue = computed(() => props.settingsValue);
const settingsLabel = computed(() => props.settingsLabel);
const settingsIcon = computed(() => props.settingsIcon);
const showBackButtonResolved = computed(() => {
  if (props.isBackButtonVisible === 'Visible') return true;
  if (props.isBackButtonVisible === 'Collapsed') return false;
  return !isTopNavigation.value && displayMode.value === 'Minimal';
});
const showBackButtonInLeftNav = computed(() => showBackButtonResolved.value && !isTopNavigation.value);
const paneTransitionDurationMs = compact => isLeftOverlayMode.value
  ? (compact ? 120 : 350)
  : 200;
const paneStyle = computed(() => ({
  '--win-nav-open-pane-length': `${props.openPaneLength}px`,
  '--win-nav-compact-pane-length': `${props.compactPaneLength}px`,
  '--win-nav-pane-duration': `${paneTransitionDurationMs(isCompact.value)}ms`,
  '--win-nav-pane-easing': isLeftOverlayMode.value
    ? 'cubic-bezier(0.1, 0.9, 0.2, 1)'
    : 'cubic-bezier(0, 0.35, 0.15, 1)'
}));
const shellClasses = computed(() => [
  isTopNavigation.value ? 'is-top' : 'is-left',
  isLeftOverlayMode.value ? 'is-overlay-left' : '',
  isLeftMinimalMode.value ? 'is-left-minimal' : '',
  isLeftCompactMode.value ? 'is-left-compact' : '',
  hasTitlebar.value && officialProps.IsTitleBarAutoPaddingEnabled ? 'has-titlebar' : '',
  officialProps.IsPaneVisible ? '' : 'is-pane-hidden'
]);

let itemRefs = {};
let childrenRefs = {};
let prevSelectedEl = null;
let lastSelectedEl = null;
let lastIsChild = false;
let prevIsChild = false;
let lastIndicatorRegion = null;
let ro = null;
let skipTransition = false;
let indicatorAnimationId = 0;
let compactTransitionTimer = null;
let paneTransitionTimer = null;
let responsiveCollapsePending = false;
let suppressNextTopChildWatcherMove = false;

const gearClass = ref('');
const hamburgerClass = ref('');
const backClass = ref('');
let gearPressed = false;
let gearRewindDone = false;
let hamburgerPressed = false;
let hamburgerPressDone = false;
let backPressed = false;
let backPressDone = false;

const canGoBack = computed(() => officialProps.IsBackEnabled);

const INDICATOR_SIZE = 16;
const TOP_INDICATOR_MAX_STRETCH = INDICATOR_SIZE * 2.75;
const LEFT_INDICATOR_MAX_STRETCH = INDICATOR_SIZE * 2.5;
const EASE_OUT = 'cubic-bezier(0.1, 0.9, 0.2, 1)';
const EASE_COLLAPSE = 'cubic-bezier(0.4, 0.0, 0.7, 0.3)';

const readTranslate = (el, axis, fallback) => {
  const transform = getComputedStyle(el).transform;
  if (transform && transform !== 'none') {
    const matrix3d = transform.match(/^matrix3d\((.+)\)$/);
    if (matrix3d) {
      const parts = matrix3d[1].split(',').map(v => Number.parseFloat(v.trim()));
      const value = axis === 'x' ? parts[12] : parts[13];
      if (Number.isFinite(value)) return value;
    }

    const matrix = transform.match(/^matrix\((.+)\)$/);
    if (matrix) {
      const parts = matrix[1].split(',').map(v => Number.parseFloat(v.trim()));
      const value = axis === 'x' ? parts[4] : parts[5];
      if (Number.isFinite(value)) return value;
    }
  }

  const styleTransform = indicatorStyle.value.transform || '';
  const match = styleTransform.match(axis === 'x' ? /translateX\(([-\d.]+)px\)/ : /translateY\(([-\d.]+)px\)/);
  return match ? Number.parseFloat(match[1]) : fallback;
};

const nextIndicatorAnimation = (indicatorEl) => {
  indicatorAnimationId += 1;
  indicatorEl?.getAnimations().forEach(a => a.cancel());
  return indicatorAnimationId;
};

const childParentMap = computed(() => {
  const map = {};
  for (const item of props.menuItems) {
    if (item.children) {
      for (const child of item.children) {
        map[child.value] = item.value;
      }
    }
  }
  return map;
});

const selectedTopRootValue = computed(() => {
  const parentGroup = findParentGroup(props.selectedValue);
  if (parentGroup) return parentGroup.value;
  return props.menuItems.some(item => item.value === props.selectedValue) ? props.selectedValue : null;
});

const measureTopItemWidth = (value) => {
  const measured = topItemWidths.value[value];
  if (Number.isFinite(measured) && measured > 0) return measured;
  const item = props.menuItems.find(entry => entry.value === value);
  if (!item) return 84;
  const labelWidth = String(item.label || '').length * 7.5;
  return Math.ceil(labelWidth + 48 + (item.children ? 24 : 0));
};

const getTopItemsWidth = (values) => {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + measureTopItemWidth(value), 0) + (values.length - 1) * 4;
};

const topLayout = computed(() => {
  if (!isTopNavigation.value) {
    return { visibleValues: props.menuItems.map(item => item.value), overflowValues: [] };
  }

  const orderedValues = props.menuItems.map(item => item.value);
  const available = topAvailableWidth.value;
  if (!Number.isFinite(available) || available <= 0) {
    return { visibleValues: orderedValues, overflowValues: [] };
  }

  const allWidth = getTopItemsWidth(orderedValues);
  if (allWidth <= available) {
    return { visibleValues: orderedValues, overflowValues: [] };
  }

  const selectedRoot = selectedTopRootValue.value;
  const protectedValue = orderedValues.includes(selectedRoot) ? selectedRoot : null;
  const moreReserve = topMoreButtonWidth.value + 4;
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
  return groupItem.children.some(c => c.value === props.selectedValue);
};

const findParentGroup = (val) => {
  return props.menuItems.find(item => item.children && item.children.some(c => c.value === val));
};

const findNormalizedItem = (value) => {
  for (const item of [...props.menuItems, ...props.footerItems]) {
    if (item.value === value) return item;
    const child = item.children?.find(entry => entry.value === value);
    if (child) return child;
  }
  return null;
};

const createSettingsItem = () => ({
  Content: resolvedSettingsLabel.value,
  Tag: props.settingsValue,
  Icon: props.settingsIcon,
  IsSettingsItem: true
});

const commitNavigationValue = (value, { invoked = true, isSettings = false } = {}) => {
  const normalizedItem = isSettings ? null : findNormalizedItem(value);
  const item = isSettings ? createSettingsItem() : normalizedItem?.source;
  if (!item) return false;

  if (invoked) {
    emit('ItemInvoked', {
      InvokedItem: item.Content ?? item.label,
      IsSettingsInvoked: isSettings,
      InvokedItemContainer: item,
      RecommendedNavigationTransitionInfo: { Type: 'EntranceNavigationTransitionInfo' }
    });
  }

  if (!isSettings && (item.SelectsOnInvoked ?? item.selectsOnInvoked) === false) return false;
  if (getItemTag(internalSelectedItem.value) === value) return true;

  internalSelectedItem.value = item;
  emit('update:SelectedItem', typeof officialProps.SelectedItem === 'object' ? item : getItemTag(item));
  emit('SelectionChanged', {
    SelectedItem: item,
    IsSettingsSelected: isSettings,
    SelectedItemContainer: item,
    RecommendedNavigationTransitionInfo: { Type: 'EntranceNavigationTransitionInfo' }
  });
  return true;
};

const isFooterValue = (value) => {
  return value === settingsValue.value || props.footerItems.some(item => item.value === value);
};

const getValueForElement = (el) => {
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
  const value = getItemTag(item);
  const normalizedItem = findNormalizedItem(value);
  if (!normalizedItem?.children || groupExpanded[value]) return;
  emit('Expanding', { ExpandingItemContainer: normalizedItem.source, ExpandingItem: normalizedItem.source });
  groupExpanded[value] = true;
  nextTick(() => measureGroup(value));
};

const Collapse = (item) => {
  const value = getItemTag(item);
  const normalizedItem = findNormalizedItem(value);
  if (!normalizedItem?.children || !groupExpanded[value]) return;
  groupExpanded[value] = false;
  emit('Collapsed', { CollapsedItemContainer: normalizedItem.source, CollapsedItem: normalizedItem.source });
};

const MenuItemFromContainer = container => {
  const value = getValueForElement(container);
  return value === props.settingsValue ? createSettingsItem() : findNormalizedItem(value)?.source ?? null;
};

const ContainerFromMenuItem = item => itemRefs[getItemTag(item)] ?? null;

defineExpose({
  DisplayMode: displayMode,
  SettingsItem: computed(createSettingsItem),
  MenuItemFromContainer,
  ContainerFromMenuItem,
  Expand,
  Collapse
});

const groupChevronClass = (value) => {
  return groupChevrons[value] || '';
};

const measureGroup = (value) => {
  const el = childrenRefs[value];
  if (el) {
    groupHeights[value] = el.scrollHeight;
  }
};

const measureAllGroups = () => {
  for (const item of props.menuItems) {
    if (item.children) measureGroup(item.value);
  }
};

const collapseOverlayAfterNavigation = () => {
  if (!isLeftOverlayMode.value || isCompact.value) return;
  requestAnimationFrame(() => {
    if (isLeftOverlayMode.value && !isCompact.value) {
      setCompact(true);
    }
  });
};

const getIndicatorTargetForValue = (value) => {
  const parentGroup = findParentGroup(value);
  if (parentGroup && (isTopNavigation.value || isCompact.value)) {
    return { value: parentGroup.value, isChild: false };
  }
  return { value, isChild: !!parentGroup };
};

const moveIndicatorForValue = (value) => {
  const target = getIndicatorTargetForValue(value);
  moveIndicatorTo(target.value, target.isChild);
};

const prepareSelectionTarget = (value) => {
  const parentGroup = findParentGroup(value);
  if (parentGroup && !isTopNavigation.value && !isCompact.value && !groupExpanded[parentGroup.value]) {
    groupExpanded[parentGroup.value] = true;
    nextTick(() => measureGroup(parentGroup.value));
  }
};

const selectNavigationValue = (value, isChild = null) => {
  if (!commitNavigationValue(value)) return;
  prepareSelectionTarget(value);
  nextTick(() => {
    updateTopNavigationLayout();
    nextTick(() => {
      if (isChild === null) {
        moveIndicatorForValue(value);
      } else {
        moveIndicatorTo(value, isChild);
      }
      collapseOverlayAfterNavigation();
    });
  });
};

const onItemClick = (item) => {
  selectNavigationValue(item.value, false);
};

const onChildClick = (group, child) => {
  selectNavigationValue(child.value, true);
};

const updateTopNavigationLayout = () => {
  if (!isTopNavigation.value) return;

  const navEl = navRef.value;
  const footerEl = topFooterMenuRef.value;
  const topBackEl = topBackButtonRef.value;
  const measureEl = topMeasureRef.value;
  if (!navEl) return;

  const navWidth = navEl.getBoundingClientRect().width;
  const footerWidth = footerEl?.getBoundingClientRect().width || 0;
  const topBackWidth = topBackEl?.getBoundingClientRect().width || 0;
  topAvailableWidth.value = Math.max(0, navWidth - footerWidth - topBackWidth - 12);

  if (measureEl) {
    const nextWidths = {};
    measureEl.querySelectorAll('[data-value]').forEach((el) => {
      const value = el.getAttribute('data-value');
      const width = Math.ceil(el.getBoundingClientRect().width);
      if (value === '__more') {
        topMoreButtonWidth.value = width;
      } else if (value) {
        nextWidths[value] = width;
      }
    });
    topItemWidths.value = nextWidths;
  }
};

const openMoreFlyout = () => {
  const el = moreButtonRef.value;
  if (!el) return;
  moreFlyoutAnchor.value = el.getBoundingClientRect();
  moreFlyoutOpen.value = true;
};

const closeMoreFlyout = () => {
  moreFlyoutOpen.value = false;
};

const toggleMoreFlyout = () => {
  if (moreFlyoutOpen.value) {
    closeMoreFlyout();
  } else {
    openMoreFlyout();
  }
};

const onMoreItemClick = (item) => {
  closeMoreFlyout();
  selectNavigationValue(item.value, false);
};

const onMoreChildClick = (group, child) => {
  closeMoreFlyout();
  selectNavigationValue(child.value, true);
};

const onMoreGroupHeaderClick = (item) => {
  if (item.selectsOnInvoked !== false && !isChildOfGroup(item)) {
    selectNavigationValue(item.value, false);
    closeMoreFlyout();
    return;
  }

  if (item.selectsOnInvoked === false) commitNavigationValue(item.value);
  if (groupExpanded[item.value]) Collapse(item.source); else Expand(item.source);
  groupChevrons[item.value] = groupExpanded[item.value] ? 'chevron-open' : 'chevron-close';
};

const onGroupHeaderClick = (item) => {
  if (isTopNavigation.value) {
    const el = itemRefs[item.value];
    if (el) {
      const rect = el.getBoundingClientRect();
      flyoutAnchor.value = rect;
      flyoutGroupValue.value = item.value;
      const items = [];
      if (item.selectsOnInvoked !== false) {
        items.push({ Text: item.label, Value: item.value, Icon: item.icon, IsHeader: true });
      }
      for (const child of (item.children || [])) {
        items.push({ Text: child.label, Value: child.value, Icon: child.icon });
      }
      flyoutItems.value = items;
      flyoutOpen.value = !flyoutOpen.value;
      if (flyoutOpen.value) {
        emit('Expanding', { ExpandingItemContainer: item.source, ExpandingItem: item.source });
      } else {
        emit('Collapsed', { CollapsedItemContainer: item.source, CollapsedItem: item.source });
      }
      groupChevrons[item.value] = flyoutOpen.value ? 'chevron-open' : 'chevron-close';
    }
    return;
  }
  if (isCompact.value) {
    const el = itemRefs[item.value];
    if (el) {
      const itemRect = el.getBoundingClientRect();
      const paneRect = navRef.value?.getBoundingClientRect();
      const paneRight = paneRect
        ? paneRect.left + props.compactPaneLength
        : itemRect.right;
      flyoutAnchor.value = {
        left: paneRight,
        right: paneRight,
        top: itemRect.top,
        bottom: itemRect.bottom,
        width: 0,
        height: itemRect.height
      };
      flyoutGroupValue.value = item.value;
      const items = [];
      if (item.selectsOnInvoked !== false) {
        items.push({ Text: item.label, Value: item.value, Icon: item.icon, IsHeader: true });
      }
      for (const child of (item.children || [])) {
        items.push({ Text: child.label, Value: child.value, Icon: child.icon });
      }
      flyoutItems.value = items;
      flyoutOpen.value = true;
      emit('Expanding', { ExpandingItemContainer: item.source, ExpandingItem: item.source });
      groupChevrons[item.value] = 'chevron-open';
    }
    return;
  }
  if (item.selectsOnInvoked !== false && !isChildOfGroup(item)) {
    selectNavigationValue(item.value, false);
  } else if (item.selectsOnInvoked === false) {
    commitNavigationValue(item.value);
  }
  const wasExpanded = groupExpanded[item.value];
  if (wasExpanded) Collapse(item.source); else Expand(item.source);
  nextTick(() => measureGroup(item.value));
  if (wasExpanded && isChildOfGroup(item)) {
    const header = itemRefs[item.value];
    if (header) {
      prevSelectedEl = lastSelectedEl;
      prevIsChild = lastIsChild;
      lastSelectedEl = header;
      lastIsChild = false;
      skipTransition = false;
      calcIndicator();
    }
  } else if (!wasExpanded && isChildOfGroup(item)) {
    nextTick(() => {
      measureGroup(item.value);
      setTimeout(() => {
        const sel = itemRefs[props.selectedValue];
        if (sel) {
          prevSelectedEl = lastSelectedEl;
          prevIsChild = lastIsChild;
          lastSelectedEl = sel;
          lastIsChild = true;
          skipTransition = false;
          calcIndicator();
        }
      }, 300);
    });
  } else {
    trackIndicatorDuringTransition();
  }
};

let trackingRaf = null;
const trackIndicatorDuringTransition = () => {
  if (trackingRaf) cancelAnimationFrame(trackingRaf);
  const track = indicatorTrack.value;
  const indicatorEl = track?.querySelector('.win-nav-indicator');
  if (!track || !indicatorEl || !lastSelectedEl || !navRef.value) return;
  indicatorEl.getAnimations().forEach(a => a.cancel());
  const startTime = performance.now();
  const duration = 350;
  const tick = () => {
    if (!lastSelectedEl || !navRef.value || !navRef.value.contains(lastSelectedEl)) {
      trackingRaf = null;
      return;
    }
    const trackRect = track.getBoundingClientRect();
    const elRect = lastSelectedEl.getBoundingClientRect();
    const newY = elRect.top - trackRect.top + elRect.height / 2 - 8;
    const targetRect = {
      top: elRect.top - trackRect.top,
      bottom: elRect.bottom - trackRect.top
    };
    track.style.clipPath = `polygon(0% ${targetRect.top}px, 100% ${targetRect.top}px, 100% ${targetRect.bottom}px, 0% ${targetRect.bottom}px)`;
    indicatorStyle.value = { transform: `translateY(${newY}px)`, height: '16px', opacity: '1', transition: 'none' };
    if (performance.now() - startTime < duration) {
      trackingRaf = requestAnimationFrame(tick);
    } else {
      trackingRaf = null;
    }
  };
  trackingRaf = requestAnimationFrame(tick);
};

const closeFlyout = () => {
  flyoutOpen.value = false;
  if (flyoutGroupValue.value) {
    groupChevrons[flyoutGroupValue.value] = 'chevron-close';
  }
};

const onFlyoutSelect = (item) => {
  const itemValue = item.Value;
  const isHeader = item.IsHeader;
  const movesTopChildToGroup = isTopNavigation.value && flyoutGroupValue.value && !isHeader;
  if (movesTopChildToGroup) suppressNextTopChildWatcherMove = true;

  if (!commitNavigationValue(itemValue)) return;
  flyoutOpen.value = false;
  if (flyoutGroupValue.value) {
    groupChevrons[flyoutGroupValue.value] = 'chevron-close';
  }
  nextTick(() => {
    if (isTopNavigation.value) {
      const groupEl = itemRefs[flyoutGroupValue.value];
      if (groupEl && !isHeader) {
        moveIndicatorToEl(groupEl, false);
      } else {
        moveIndicatorTo(itemValue, false);
      }
    } else {
      const parentGroup = findParentGroup(itemValue);
      if (parentGroup) {
        moveIndicatorToEl(itemRefs[parentGroup.value], false);
      } else {
        moveIndicatorTo(itemValue, false);
      }
    }
    collapseOverlayAfterNavigation();
  });
};

const moveIndicatorTo = (value, isChild) => {
  const el = itemRefs[value];
  if (!el) return;
  moveIndicatorToEl(el, isChild);
};

const moveIndicatorToEl = (el, isChild) => {
  prevSelectedEl = lastSelectedEl;
  prevIsChild = lastIsChild;
  lastSelectedEl = el;
  lastIsChild = isChild;
  calcIndicator();
};

const goBack = () => {
  if (canGoBack.value) emit('BackRequested', {});
};

const onBackClick = () => {
  if (!canGoBack.value) return;
  goBack();
};

const selectSettings = () => {
  if (!isSettingsVisible.value) return;
  if (!commitNavigationValue(settingsValue.value, { isSettings: true })) return;
  nextTick(() => {
    moveIndicatorTo(settingsValue.value, false);
    collapseOverlayAfterNavigation();
  });
};

const toggleCompact = () => {
  setCompact(!isCompact.value);
};

const setCompact = (compact) => {
  if (compact === isCompact.value) return;
  if (compact) {
    const args = { Cancel: false };
    emit('PaneClosing', args);
    if (args.Cancel) return;
  } else {
    emit('PaneOpening', {});
  }
  paneTransition.value = compact ? 'closing' : 'opening';
  if (paneTransitionTimer) clearTimeout(paneTransitionTimer);
  const transitionDuration = paneTransitionDurationMs(compact);
  paneTransitionTimer = setTimeout(() => {
    paneTransition.value = '';
    paneTransitionTimer = null;
    emit(compact ? 'PaneClosed' : 'PaneOpened', {});
    nextTick(() => restoreIndicatorAfterPaneLayout());
  }, transitionDuration);
  isCompact.value = compact;
  emit('update:IsPaneOpen', !compact);
};

const syncDisplayMode = () => {
  const automaticMode = normalizedPaneDisplayMode.value === 'Auto';
  if (automaticMode && isLeftOverlayMode.value) {
    // Auto owns the compact/minimal transition. Keep the pane folded when the
    // host crosses a responsive breakpoint instead of reopening from IsPaneOpen.
    if (!isCompact.value && !responsiveCollapsePending) {
      responsiveCollapsePending = true;
      nextTick(() => {
        responsiveCollapsePending = false;
        if (normalizedPaneDisplayMode.value === 'Auto' && isLeftOverlayMode.value) setCompact(true);
      });
    }
    return;
  } else if (isLeftMinimalMode.value) {
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
  if (!isLeftOverlayMode.value || isCompact.value) return;
  const target = event.target;
  if (navRef.value?.contains(target)) return;
  if (target?.closest?.('.win-menu-flyout-wrap')) return;
  setCompact(true);
};

const onGearDown = () => { gearPressed = true; gearRewindDone = false; gearClass.value = 'gear-rewind'; };
const onGearUp = () => { if (!gearPressed) return; gearPressed = false; if (gearRewindDone) gearClass.value = 'gear-spin'; };
const onGearLeave = () => { if (!gearPressed) return; gearPressed = false; if (gearRewindDone) gearClass.value = 'gear-spin'; };
const onGearAnimEnd = () => {
  if (gearClass.value === 'gear-rewind') { gearRewindDone = true; if (!gearPressed) gearClass.value = 'gear-spin'; }
  else if (gearClass.value === 'gear-spin') { gearClass.value = ''; gearRewindDone = false; }
};

const onHamburgerDown = () => { hamburgerPressed = true; hamburgerPressDone = false; hamburgerClass.value = 'pressing'; };
const onHamburgerUp = () => { if (!hamburgerPressed) return; hamburgerPressed = false; if (hamburgerPressDone) hamburgerClass.value = 'releasing'; };
const onHamburgerLeave = () => { if (!hamburgerPressed) return; hamburgerPressed = false; if (hamburgerPressDone) hamburgerClass.value = 'releasing'; };
const onHamburgerAnimEnd = (event) => {
  if (hamburgerClass.value === 'pressing' && event.animationName === 'hamburger-press') { hamburgerPressDone = true; if (!hamburgerPressed) hamburgerClass.value = 'releasing'; }
  else if (hamburgerClass.value === 'releasing' && event.animationName === 'hamburger-release') { hamburgerClass.value = ''; hamburgerPressDone = false; }
};

const onBackDown = () => { if (!canGoBack.value) return; backPressed = true; backPressDone = false; backClass.value = 'pressing'; };
const onBackUp = () => { if (!backPressed) return; backPressed = false; if (backPressDone) backClass.value = 'releasing'; };
const onBackLeave = () => { if (!backPressed) return; backPressed = false; if (backPressDone) backClass.value = 'releasing'; };
const onBackAnimEnd = (event) => {
  if (backClass.value === 'pressing' && event.animationName === 'animated-icon-back-press') { backPressDone = true; if (!backPressed) backClass.value = 'releasing'; }
  else if (backClass.value === 'releasing' && event.animationName === 'animated-icon-back-release') { backClass.value = ''; backPressDone = false; }
};

const onScroll = () => {
  if (lastSelectedEl && navRef.value && navRef.value.contains(lastSelectedEl)) {
    skipTransition = true;
    calcIndicator();
    requestAnimationFrame(() => { skipTransition = false; });
  }
};

const getScrollAreaElement = () => scrollArea.value?.scrollViewerRef?.value ?? scrollArea.value?.scrollViewerRef ?? scrollArea.value ?? null;

const calcIndicator = () => {
  const sourceEl = prevSelectedEl && prevSelectedEl !== lastSelectedEl ? prevSelectedEl : null;
  prevSelectedEl = lastSelectedEl;
  if (!navRef.value || !lastSelectedEl) return;
  if (!navRef.value.contains(lastSelectedEl)) return;

  const track = indicatorTrack.value;
  const indicatorEl = track?.querySelector('.win-nav-indicator');
  if (!track || !indicatorEl) return;

  const trackRect = track.getBoundingClientRect();
  const elRect = lastSelectedEl.getBoundingClientRect();

  const getItemRectRelTrack = (el) => {
    const r = el.getBoundingClientRect();
    return { left: r.left - trackRect.left, right: r.right - trackRect.left, top: r.top - trackRect.top, bottom: r.bottom - trackRect.top };
  };

  const targetRect = getItemRectRelTrack(lastSelectedEl);
  const sourceRect = sourceEl && navRef.value.contains(sourceEl) ? getItemRectRelTrack(sourceEl) : null;

  const makeClipX = (r1, r2) => {
    if (!r2) return `polygon(${r1.left}px 0%, ${r1.right}px 0%, ${r1.right}px 100%, ${r1.left}px 100%)`;
    const left1 = Math.min(r1.left, r2.left);
    const right1 = r1.left < r2.left ? r1.right : r2.right;
    const left2 = r1.left < r2.left ? r2.left : r1.left;
    const right2 = Math.max(r1.right, r2.right);
    if (right1 >= left2) return `polygon(${left1}px 0%, ${right2}px 0%, ${right2}px 100%, ${left1}px 100%)`;
    return `polygon(${left1}px 0%, ${right1}px 0%, ${right1}px 100%, ${left1}px 100%, ${left1}px 0%, ${left2}px 0%, ${left2}px 100%, ${right2}px 100%, ${right2}px 0%, ${left2}px 0%)`;
  };

  const makeClipY = (r1, r2) => {
    if (!r2) return `polygon(0% ${r1.top}px, 100% ${r1.top}px, 100% ${r1.bottom}px, 0% ${r1.bottom}px)`;
    const top1 = Math.min(r1.top, r2.top);
    const bottom1 = r1.top < r2.top ? r1.bottom : r2.bottom;
    const top2 = r1.top < r2.top ? r2.top : r1.top;
    const bottom2 = Math.max(r1.bottom, r2.bottom);
    if (bottom1 >= top2) return `polygon(0% ${top1}px, 100% ${top1}px, 100% ${bottom2}px, 0% ${bottom2}px)`;
    return `polygon(0% ${top1}px, 100% ${top1}px, 100% ${bottom1}px, 0% ${bottom1}px, 0% ${top2}px, 100% ${top2}px, 100% ${bottom2}px, 0% ${bottom2}px)`;
  };

  const getRegion = (el) => {
    const scrollEl = getScrollAreaElement();
    if (isTopNavigation.value) {
      const value = getValueForElement(el);
      if (value) return isFooterValue(value) ? 'top-footer' : 'top-menu';
      const menus = navRef.value ? Array.from(navRef.value.querySelectorAll('.win-nav-menu')) : [];
      const menu = el?.closest?.('.win-nav-menu');
      return menus.indexOf(menu) <= 0 ? 'top-menu' : 'top-footer';
    }
    return scrollEl && scrollEl.contains(el) ? 'menu' : 'footer';
  };

  const crossLevel = (lastIsChild !== prevIsChild) && sourceEl;

  const snapToFinal = (finalTransform, dimension, finalSize) => {
    requestAnimationFrame(() => {
      if (!lastSelectedEl || !navRef.value || !navRef.value.contains(lastSelectedEl)) return;
      const freshTrackRect = track.getBoundingClientRect();
      const freshElRect = lastSelectedEl.getBoundingClientRect();
      const freshTargetRect = {
        left: freshElRect.left - freshTrackRect.left,
        right: freshElRect.right - freshTrackRect.left,
        top: freshElRect.top - freshTrackRect.top,
        bottom: freshElRect.bottom - freshTrackRect.top
      };
      let expectedPos;
      if (dimension === 'x') {
        expectedPos = freshElRect.left - freshTrackRect.left + freshElRect.width / 2 - 8;
        track.style.clipPath = makeClipX(freshTargetRect, null);
        indicatorStyle.value = { transform: `translateX(${expectedPos}px)`, width: '16px', opacity: '1', transition: 'none' };
      } else {
        expectedPos = freshElRect.top - freshTrackRect.top + freshElRect.height / 2 - 8;
        track.style.clipPath = makeClipY(freshTargetRect, null);
        indicatorStyle.value = { transform: `translateY(${expectedPos}px)`, height: '16px', opacity: '1', transition: 'none' };
      }
    });
  };

  if (isTopNavigation.value) {
    const newX = elRect.left - trackRect.left + elRect.width / 2 - 8;
    if (skipTransition || indicatorStyle.value.opacity === '0') {
      nextIndicatorAnimation(indicatorEl);
      track.style.clipPath = makeClipX(targetRect, null);
      indicatorStyle.value = { transition: 'none', transform: `translateX(${newX}px)`, width: '16px', opacity: '1' };
      lastIndicatorRegion = getRegion(lastSelectedEl);
      return;
    }
    const oldX = readTranslate(indicatorEl, 'x', newX);
    const dist = Math.abs(newX - oldX);
    if (dist < 1) {
      track.style.clipPath = makeClipX(targetRect, null);
      indicatorStyle.value = { transform: `translateX(${newX}px)`, width: '16px', opacity: '1' };
      lastIndicatorRegion = getRegion(lastSelectedEl);
      return;
    }

    const animationId = nextIndicatorAnimation(indicatorEl);
    const hideThreshold = 160;
    const sourceRegion = sourceEl ? getRegion(sourceEl) : lastIndicatorRegion;
    const targetRegion = getRegion(lastSelectedEl);
    const topContinuousMove = sourceRegion === targetRegion || dist <= hideThreshold;
    lastIndicatorRegion = targetRegion;

    if (topContinuousMove) {
      indicatorStyle.value = { transform: `translateX(${oldX}px)`, width: '16px', opacity: '1', transition: 'none' };
      track.style.clipPath = makeClipX(targetRect, sourceRect);
      const movingRight = newX > oldX;
      const dur = 600;
      const stretchW = Math.min(dist + INDICATOR_SIZE, TOP_INDICATOR_MAX_STRETCH);
      let keyframes;
      if (movingRight) {
        keyframes = [
          { transform: `translateX(${oldX}px)`, width: '16px', offset: 0, easing: EASE_OUT },
          { transform: `translateX(${oldX}px)`, width: `${stretchW}px`, offset: 0.333, easing: EASE_OUT },
          { transform: `translateX(${newX}px)`, width: '16px', offset: 1 }
        ];
      } else {
        keyframes = [
          { transform: `translateX(${oldX}px)`, width: '16px', offset: 0, easing: EASE_OUT },
          { transform: `translateX(${newX}px)`, width: `${stretchW}px`, offset: 0.333, easing: EASE_OUT },
          { transform: `translateX(${newX}px)`, width: '16px', offset: 1 }
        ];
      }
      const anim = indicatorEl.animate(keyframes, { duration: dur, fill: 'forwards' });
      anim.onfinish = () => { if (animationId === indicatorAnimationId) snapToFinal(`translateX(${newX}px)`, 'x', '16px'); };
      return;
    }

    const movingRight = newX > oldX;
    indicatorStyle.value = { transform: `translateX(${oldX}px)`, width: '16px', opacity: '1', transition: 'none' };
    const fallbackSourceRect = sourceRect || {
      left: oldX,
      right: oldX + INDICATOR_SIZE,
      top: targetRect.top,
      bottom: targetRect.bottom
    };
    track.style.clipPath = makeClipX(targetRect, fallbackSourceRect);
    const collapseDur = 350; const expandDur = 350;
    let collapseKeyframes, expandKeyframes;
    if (movingRight) {
      collapseKeyframes = [{ transform: `translateX(${oldX}px)`, width: '16px', offset: 0, easing: EASE_COLLAPSE }, { transform: `translateX(${oldX + 16}px)`, width: '0px', offset: 1 }];
      expandKeyframes = [{ transform: `translateX(${newX}px)`, width: '0px', offset: 0, easing: EASE_OUT }, { transform: `translateX(${newX}px)`, width: '16px', offset: 1 }];
    } else {
      collapseKeyframes = [{ transform: `translateX(${oldX}px)`, width: '16px', offset: 0, easing: EASE_COLLAPSE }, { transform: `translateX(${oldX}px)`, width: '0px', offset: 1 }];
      expandKeyframes = [{ transform: `translateX(${newX + 16}px)`, width: '0px', offset: 0, easing: EASE_OUT }, { transform: `translateX(${newX}px)`, width: '16px', offset: 1 }];
    }
    const collapseAnim = indicatorEl.animate(collapseKeyframes, { duration: collapseDur, fill: 'forwards' });
    collapseAnim.onfinish = () => {
      if (animationId !== indicatorAnimationId) return;
      const expandAnim = indicatorEl.animate(expandKeyframes, { duration: expandDur, fill: 'forwards' });
      expandAnim.onfinish = () => { if (animationId === indicatorAnimationId) snapToFinal(`translateX(${newX}px)`, 'x', '16px'); };
    };

  } else {
    const newY = elRect.top - trackRect.top + elRect.height / 2 - 8;

    const scrollEl = getScrollAreaElement();
    let visibleTop = 0;
    let visibleBottom = trackRect.height;
    if (scrollEl) {
      const scrollRect = scrollEl.getBoundingClientRect();
      visibleTop = scrollRect.top - trackRect.top;
      visibleBottom = scrollRect.bottom - trackRect.top;
    }

    const isInFooter = !scrollEl || !scrollEl.contains(lastSelectedEl);
    if (isInFooter) {
      visibleTop = 0;
      visibleBottom = trackRect.height;
    }

    const clampedTargetRect = {
      top: isInFooter ? targetRect.top : Math.max(targetRect.top, visibleTop),
      bottom: isInFooter ? targetRect.bottom : Math.min(targetRect.bottom, visibleBottom),
      left: targetRect.left,
      right: targetRect.right
    };

    if (clampedTargetRect.top >= clampedTargetRect.bottom) {
      nextIndicatorAnimation(indicatorEl);
      indicatorStyle.value = { opacity: '0', transition: 'none' };
      return;
    }

    if (skipTransition || indicatorStyle.value.opacity === '0') {
      nextIndicatorAnimation(indicatorEl);
      track.style.clipPath = makeClipY(clampedTargetRect, null);
      indicatorStyle.value = { transition: 'none', transform: `translateY(${newY}px)`, height: '16px', opacity: '1' };
      indicatorIsChild.value = lastIsChild;
      return;
    }
    const oldY = readTranslate(indicatorEl, 'y', newY);
    const dist = Math.abs(newY - oldY);
    if (dist < 1) { track.style.clipPath = makeClipY(clampedTargetRect, null); indicatorStyle.value = { transform: `translateY(${newY}px)`, height: '16px', opacity: '1' }; indicatorIsChild.value = lastIsChild; return; }

    let clampedSourceRect = sourceRect;
    if (sourceRect && scrollEl) {
      const sourceInFooter = sourceEl && !scrollEl.contains(sourceEl);
      if (!sourceInFooter) {
        clampedSourceRect = {
          top: Math.max(sourceRect.top, visibleTop),
          bottom: Math.min(sourceRect.bottom, visibleBottom),
          left: sourceRect.left,
          right: sourceRect.right
        };
        if (clampedSourceRect.top >= clampedSourceRect.bottom) clampedSourceRect = null;
      }
    }

    track.style.clipPath = makeClipY(clampedTargetRect, clampedSourceRect);
    const animationId = nextIndicatorAnimation(indicatorEl);

    if (crossLevel) {
      indicatorStyle.value = { transform: `translateY(${oldY}px)`, height: '16px', opacity: '1', transition: 'none' };
      const movingDown = newY > oldY;
      const collapseDur = 300; const expandDur = 300;
      let collapseKf, expandKf;
      if (movingDown) {
        collapseKf = [{ transform: `translateY(${oldY}px)`, height: '16px', offset: 0, easing: EASE_COLLAPSE }, { transform: `translateY(${oldY + 16}px)`, height: '0px', offset: 1 }];
        expandKf = [{ transform: `translateY(${newY}px)`, height: '0px', offset: 0, easing: EASE_OUT }, { transform: `translateY(${newY}px)`, height: '16px', offset: 1 }];
      } else {
        collapseKf = [{ transform: `translateY(${oldY}px)`, height: '16px', offset: 0, easing: EASE_COLLAPSE }, { transform: `translateY(${oldY}px)`, height: '0px', offset: 1 }];
        expandKf = [{ transform: `translateY(${newY + 16}px)`, height: '0px', offset: 0, easing: EASE_OUT }, { transform: `translateY(${newY}px)`, height: '16px', offset: 1 }];
      }
      const collapseAnim = indicatorEl.animate(collapseKf, { duration: collapseDur, fill: 'forwards' });
      collapseAnim.onfinish = () => {
        if (animationId !== indicatorAnimationId) return;
        indicatorIsChild.value = lastIsChild;
        const expandAnim = indicatorEl.animate(expandKf, { duration: expandDur, fill: 'forwards' });
        expandAnim.onfinish = () => { if (animationId === indicatorAnimationId) snapToFinal(`translateY(${newY}px)`, 'y', '16px'); };
      };
      return;
    }

    indicatorIsChild.value = lastIsChild;
    const movingDown = newY > oldY;
    indicatorStyle.value = { transform: `translateY(${newY}px)`, height: '16px', opacity: '1', transition: 'none' };
    const sourceRegion = sourceEl ? getRegion(sourceEl) : getRegion(lastSelectedEl);
    const targetRegion = getRegion(lastSelectedEl);
    const forceMove = sourceRegion !== targetRegion;
    // A long-distance collapse/expand is reserved for crossing the menu/footer
    // boundary. Items within the same region use the continuous stretch motion.
    const useStretchMove = !forceMove;
    const dur = 600;
    let keyframes;

    if (!useStretchMove) {
      const collapseKf = movingDown
        ? [{ transform: `translateY(${oldY}px)`, height: '16px', offset: 0, easing: EASE_COLLAPSE }, { transform: `translateY(${oldY + 16}px)`, height: '0px', offset: 1 }]
        : [{ transform: `translateY(${oldY}px)`, height: '16px', offset: 0, easing: EASE_COLLAPSE }, { transform: `translateY(${oldY}px)`, height: '0px', offset: 1 }];
      const expandKf = movingDown
        ? [{ transform: `translateY(${newY}px)`, height: '0px', offset: 0, easing: EASE_OUT }, { transform: `translateY(${newY}px)`, height: '16px', offset: 1 }]
        : [{ transform: `translateY(${newY + 16}px)`, height: '0px', offset: 0, easing: EASE_OUT }, { transform: `translateY(${newY}px)`, height: '16px', offset: 1 }];
      const collapseAnim = indicatorEl.animate(collapseKf, { duration: 300, fill: 'forwards' });
      collapseAnim.onfinish = () => {
        if (animationId !== indicatorAnimationId) return;
        const expandAnim = indicatorEl.animate(expandKf, { duration: 300, fill: 'forwards' });
        expandAnim.onfinish = () => { if (animationId === indicatorAnimationId) snapToFinal(`translateY(${newY}px)`, 'y', '16px'); };
      };
      return;
    }

    const stretchH = Math.min(dist + INDICATOR_SIZE, LEFT_INDICATOR_MAX_STRETCH);
    if (movingDown) {
      keyframes = [{ transform: `translateY(${oldY}px)`, height: '16px', offset: 0, easing: EASE_OUT }, { transform: `translateY(${oldY}px)`, height: `${stretchH}px`, offset: 0.2, easing: EASE_OUT }, { transform: `translateY(${newY}px)`, height: '16px', offset: 1 }];
    } else {
      keyframes = [{ transform: `translateY(${oldY}px)`, height: '16px', offset: 0, easing: EASE_OUT }, { transform: `translateY(${newY}px)`, height: `${stretchH}px`, offset: 0.2, easing: EASE_OUT }, { transform: `translateY(${newY}px)`, height: '16px', offset: 1 }];
    }
    const anim = indicatorEl.animate(keyframes, { duration: dur, fill: 'forwards' });
    anim.onfinish = () => { if (animationId === indicatorAnimationId) snapToFinal(`translateY(${newY}px)`, 'y', '16px'); };
  }
};

const restoreIndicatorAfterPaneLayout = () => {
  // Minimal mode intentionally hides the indicator while closed. It must be
  // recalculated after the pane becomes visible again.
  if (isLeftMinimalMode.value && isCompact.value) return;
  const value = props.selectedValue;
  if (!value || !navRef.value) return;
  const parentGroup = findParentGroup(value);
  const target = parentGroup && isCompact.value
    ? itemRefs[parentGroup.value]
    : itemRefs[value] || (value === settingsValue.value ? itemRefs[settingsValue.value] : null);
  const indicatorEl = indicatorTrack.value?.querySelector('.win-nav-indicator');
  if (!target || !indicatorEl) return;
  const targetIsMissing = !navRef.value.contains(lastSelectedEl);
  const indicatorHidden = indicatorStyle.value.opacity !== '1';
  const minimalPaneRevealed = isLeftMinimalMode.value && paneTransition.value === 'opening';
  if (!targetIsMissing && !indicatorHidden && !minimalPaneRevealed) return;
  lastSelectedEl = target;
  lastIsChild = !!parentGroup && !isCompact.value;
  indicatorIsChild.value = lastIsChild;
  skipTransition = true;
  nextIndicatorAnimation(indicatorEl);
  calcIndicator();
  requestAnimationFrame(() => { skipTransition = false; });
};

let resizeTimer = null;
const onResize = () => {
  containerWidth.value = shellRef.value?.getBoundingClientRect().width || (typeof window === 'undefined' ? props.expandedModeThresholdWidth : window.innerWidth);
  updateTopNavigationLayout();
  skipTransition = true;
  if (resizeTimer) cancelAnimationFrame(resizeTimer);
  if (!lastSelectedEl || !navRef.value || !navRef.value.contains(lastSelectedEl)) {
    const val = props.selectedValue;
    if (val) {
      const parentGroup = findParentGroup(val);
      if (parentGroup && (isTopNavigation.value || isCompact.value)) {
        lastSelectedEl = itemRefs[parentGroup.value] || null;
        lastIsChild = false;
      } else {
        lastSelectedEl = itemRefs[val] || null;
        lastIsChild = !!parentGroup;
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
const rebindRo = () => {
  if (ro) ro.disconnect();
  ro = new ResizeObserver(onResize);
  if (shellRef.value) ro.observe(shellRef.value);
  if (navRef.value) ro.observe(navRef.value);
  if (topFooterMenuRef.value) ro.observe(topFooterMenuRef.value);
  if (topBackButtonRef.value) ro.observe(topBackButtonRef.value);
};

const refreshAfterPositionChange = () => {
  skipTransition = true;
  nextTick(() => {
    rebindRo();
    measureAllGroups();
    updateTopNavigationLayout();
    const val = props.selectedValue;
    if (val) {
      const parentGroup = findParentGroup(val);
      if (parentGroup) {
        if (isTopNavigation.value) {
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
  nextTick(() => {
    measureAllGroups();
    updateTopNavigationLayout();
    const val = props.selectedValue;
    if (val) {
      const parentGroup = findParentGroup(val);
      if (parentGroup) {
        if (!isTopNavigation.value) {
          if (!groupExpanded[parentGroup.value]) {
            groupExpanded[parentGroup.value] = true;
            nextTick(() => {
              measureGroup(parentGroup.value);
              nextTick(() => {
                lastSelectedEl = itemRefs[val];
                lastIsChild = true;
                indicatorIsChild.value = true;
                calcIndicator();
                requestAnimationFrame(() => { skipTransition = false; });
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
    requestAnimationFrame(() => { skipTransition = false; });
  });
};

onMounted(() => {
  containerWidth.value = shellRef.value?.getBoundingClientRect().width || window.innerWidth;
  syncDisplayMode();
  rebindRo();
  window.addEventListener('resize', onResize);
  document.addEventListener('pointerdown', onDocumentPointerDown, true);
  initIndicator();
});

onBeforeUnmount(() => {
  if (ro) ro.disconnect();
  if (paneTransitionTimer) clearTimeout(paneTransitionTimer);
  window.removeEventListener('resize', onResize);
  document.removeEventListener('pointerdown', onDocumentPointerDown, true);
});

watch(() => props.paneDisplayMode, () => {
  syncDisplayMode();
  refreshAfterPositionChange();
});

watch(resolvedPaneDisplayMode, (value, oldValue) => {
  syncDisplayMode();
  refreshAfterPositionChange();
  if (value !== oldValue) emit('DisplayModeChanged', { DisplayMode: displayMode.value });
});

watch(() => props.isPaneOpen, (value) => {
  isCompact.value = !value;
});

watch(() => officialProps.SelectedItem, (item) => {
  internalSelectedItem.value = item;
});

watch(isSettingsVisible, (visible) => {
  if (visible) return;
  delete itemRefs[settingsValue.value];
  if (props.selectedValue === settingsValue.value) {
    selectNavigationValue(props.menuItems[0]?.value || '', false);
  }
});

watch(isCompact, (compact) => {
  const activeIndicator = indicatorTrack.value?.querySelector('.win-nav-indicator');
  nextIndicatorAnimation(activeIndicator);

  if (compactTransitionTimer) {
    clearTimeout(compactTransitionTimer);
    compactTransitionTimer = null;
  }

  if (compact) {
    const parentGroup = findParentGroup(props.selectedValue);
    const track = indicatorTrack.value;
    const indicatorEl = track?.querySelector('.win-nav-indicator');
    const childEl = parentGroup ? itemRefs[props.selectedValue] : null;
    const savedOldY = parentGroup && childEl && track
      ? childEl.getBoundingClientRect().top - track.getBoundingClientRect().top + childEl.getBoundingClientRect().height / 2 - 8
      : null;
    const wasChild = lastIsChild;
    for (const item of props.menuItems) {
      if (item.children && groupExpanded[item.value]) {
        groupExpanded[item.value] = false;
      }
    }
    if (parentGroup) {
      let animating = false;
      nextTick(() => {
        const header = itemRefs[parentGroup.value];
        if (header) {
          lastSelectedEl = header;
          lastIsChild = false;
          if (savedOldY !== null && wasChild && track && indicatorEl) {
            animating = true;
            const animationId = nextIndicatorAnimation(indicatorEl);
            const trackRect = track.getBoundingClientRect();
            const childRect = childEl?.getBoundingClientRect();
            const childClip = childRect
              ? { top: childRect.top - trackRect.top, bottom: childRect.bottom - trackRect.top }
              : { top: savedOldY, bottom: savedOldY + 16 };
            indicatorIsChild.value = true;
            track.style.clipPath = `polygon(0% ${childClip.top}px, 100% ${childClip.top}px, 100% ${childClip.bottom}px, 0% ${childClip.bottom}px)`;
            indicatorStyle.value = { transform: `translateY(${savedOldY}px)`, height: '16px', opacity: '1', transition: 'none' };

            const collapseAnim = indicatorEl.animate([
              { transform: `translateY(${savedOldY}px)`, height: '16px', offset: 0, easing: EASE_COLLAPSE },
              { transform: `translateY(${savedOldY}px)`, height: '0px', offset: 1 }
            ], { duration: 200, fill: 'forwards' });

            collapseAnim.onfinish = () => {
              if (animationId !== indicatorAnimationId) return;
              const freshTrackRect = track.getBoundingClientRect();
              const freshHeaderRect = header.getBoundingClientRect();
              const freshNewY = freshHeaderRect.top - freshTrackRect.top + freshHeaderRect.height / 2 - 8;
              const freshTargetR = { top: freshHeaderRect.top - freshTrackRect.top, bottom: freshHeaderRect.bottom - freshTrackRect.top };
              indicatorIsChild.value = false;
              track.style.clipPath = `polygon(0% ${freshTargetR.top}px, 100% ${freshTargetR.top}px, 100% ${freshTargetR.bottom}px, 0% ${freshTargetR.bottom}px)`;
              indicatorStyle.value = { transform: `translateY(${freshNewY + 16}px)`, height: '0px', opacity: '1', transition: 'none' };

              const expandAnim = indicatorEl.animate([
                { transform: `translateY(${freshNewY + 16}px)`, height: '0px', offset: 0, easing: EASE_OUT },
                { transform: `translateY(${freshNewY}px)`, height: '16px', offset: 1 }
              ], { duration: 300, fill: 'forwards' });

              expandAnim.onfinish = () => {
                if (animationId !== indicatorAnimationId) return;
                animating = false;
                const ft = track.getBoundingClientRect();
                const fh = header.getBoundingClientRect();
                const fy = fh.top - ft.top + fh.height / 2 - 8;
                const ftr = { top: fh.top - ft.top, bottom: fh.bottom - ft.top };
                track.style.clipPath = `polygon(0% ${ftr.top}px, 100% ${ftr.top}px, 100% ${ftr.bottom}px, 0% ${ftr.bottom}px)`;
                indicatorStyle.value = { transform: `translateY(${fy}px)`, height: '16px', opacity: '1', transition: 'none' };
              };
            };
          } else {
            skipTransition = true;
            calcIndicator();
            requestAnimationFrame(() => { skipTransition = false; });
          }
        }
        requestAnimationFrame(() => { if (!animating) calcIndicator(); });
      });
    }
  } else {
    const parentGroup = findParentGroup(props.selectedValue);
    if (parentGroup) {
      groupExpanded[parentGroup.value] = true;
      nextTick(() => {
        measureGroup(parentGroup.value);
        compactTransitionTimer = setTimeout(() => {
          const sel = itemRefs[props.selectedValue];
          if (sel) {
            prevSelectedEl = lastSelectedEl;
            prevIsChild = lastIsChild;
            lastSelectedEl = sel;
            lastIsChild = true;
            skipTransition = false;
            calcIndicator();
          }
        }, 300);
      });
    }
  }
});

watch(isCompact, () => {
  requestAnimationFrame(() => restoreIndicatorAfterPaneLayout());
});

watch(() => props.selectedValue, (val) => {
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
      const groupEl = itemRefs[parentGroup.value];
      if (groupEl) {
        moveIndicatorToEl(groupEl, false);
      }
    });
  }
});</script>
<style>
  .win-nav-shell {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: var(--app-bg);
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
    flex: 1;
    min-width: 0;
    min-height: 0;
    background: var(--layer-default);
    overflow: hidden;
    overflow-x: hidden;
    transition: margin-left var(--win-nav-pane-duration, 350ms) var(--win-nav-pane-easing, cubic-bezier(0.1, 0.9, 0.2, 1)), background var(--normal-duration) var(--fast-out-slow-in);
  }

  .win-nav-shell.is-left .win-nav-content {
    border-radius: 8px 0 0 0;
    border-top: 1px solid var(--ctrl-border-rest);
    border-left: 1px solid var(--ctrl-border-rest);
  }

  .win-nav-shell.is-overlay-left .win-nav-content {
    margin-left: 0;
  }

  .win-nav-shell.is-left-compact .win-nav-content {
    margin-left: var(--win-nav-compact-pane-length, 48px);
  }

  .win-nav-shell.is-left-minimal .win-nav-content {
    border-left: 0;
    border-radius: 0;
  }

  .win-nav-shell.is-top .win-nav-content {
    border-top: 1px solid var(--ctrl-border-rest);
    border-radius: 0;
  }

  .win-nav-content-inner {
    height: 100%;
    min-height: 0;
    padding: 0;
  }

  .win-nav-content-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    pointer-events: none;
  }

  .win-nav-shell.is-pane-hidden .win-nav-left-panel,
  .win-nav-shell.is-pane-hidden .win-nav-top-bar {
    display: none;
  }

  .win-nav-shell.is-pane-hidden.is-left-compact .win-nav-content {
    margin-left: 0;
  }

  .win-nav-page-header {
    min-height: 48px;
    padding: 0 32px;
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
    border-bottom: 1px solid transparent;
  }

    .win-nav-page-header + .win-nav-content-inner {
      padding-top: 0;
    }

  .win-nav-left-panel {
    position: relative;
    box-sizing: border-box;
    width: var(--win-nav-open-pane-length, 320px);
    display: flex;
    flex-direction: column;
    padding: 4px 4px;
    margin-right: 0;
    clip-path: inset(0 0 0 0);
    transition: clip-path var(--win-nav-pane-duration, 350ms) var(--win-nav-pane-easing, cubic-bezier(0.1, 0.9, 0.2, 1)), background var(--normal-duration) var(--fast-out-slow-in);
    flex-shrink: 0;
    overflow: hidden;
  }

    .win-nav-shell.is-overlay-left .win-nav-left-panel {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 20;
      background: var(--host-nav-pane-bg);
      backdrop-filter: var(--flyout-backdrop);
      -webkit-backdrop-filter: var(--flyout-backdrop);
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16);
      width: var(--win-nav-open-pane-length, 320px);
      clip-path: inset(0 0 0 0);
      transition: clip-path var(--win-nav-pane-duration, 350ms) var(--win-nav-pane-easing, cubic-bezier(0.1, 0.9, 0.2, 1)), background var(--normal-duration) var(--fast-out-slow-in), box-shadow var(--win-nav-pane-duration, 350ms) linear;
    }

    html.winui-webview-host .win-nav-shell.is-overlay-left .win-nav-left-panel:not(.is-compact) {
      background: var(--host-nav-pane-bg);
      backdrop-filter: var(--flyout-backdrop);
      -webkit-backdrop-filter: var(--flyout-backdrop);
    }

    .win-nav-shell.is-overlay-left .win-nav-left-panel.is-compact {
      width: var(--win-nav-open-pane-length, 320px);
      clip-path: inset(0 calc(var(--win-nav-open-pane-length, 320px) - var(--win-nav-compact-pane-length, 48px)) 0 0);
      box-shadow: none;
    }

    .win-nav-shell:not(.is-overlay-left) .win-nav-left-panel.is-compact {
      width: var(--win-nav-open-pane-length, 320px);
      margin-right: calc(var(--win-nav-compact-pane-length, 48px) - var(--win-nav-open-pane-length, 320px));
      clip-path: inset(0 calc(var(--win-nav-open-pane-length, 320px) - var(--win-nav-compact-pane-length, 48px)) 0 0);
    }

    .win-nav-shell.is-left-minimal .win-nav-left-panel.is-compact {
      background: transparent;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
    }

    .win-nav-shell.is-left-minimal .win-nav-left-panel.is-compact.is-pane-closing {
      background: var(--host-nav-pane-bg);
      backdrop-filter: var(--flyout-backdrop);
      -webkit-backdrop-filter: var(--flyout-backdrop);
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16);
    }

    .win-nav-left-panel > .win-nav-pane-top,
    .win-nav-left-panel > .win-nav-pane-custom-content,
    .win-nav-left-panel > .win-nav-left-scrollable,
    .win-nav-left-panel > .win-nav-footer,
    .win-nav-left-panel .win-nav-menu {
      box-sizing: border-box;
      width: calc(var(--win-nav-open-pane-length, 320px) - 8px);
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

  .win-nav-shell:not(.is-overlay-left) .win-nav-left-panel.is-pane-opening + .win-nav-content {
    animation: win-nav-inline-content-opening var(--win-nav-pane-duration, 200ms) var(--win-nav-pane-easing, cubic-bezier(0, 0.35, 0.15, 1)) both;
  }

  .win-nav-shell:not(.is-overlay-left) .win-nav-left-panel.is-pane-closing + .win-nav-content {
    animation: win-nav-inline-content-closing var(--win-nav-pane-duration, 200ms) var(--win-nav-pane-easing, cubic-bezier(0, 0.35, 0.15, 1)) both;
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
    margin-top: 2px;
    position: relative;
  }

  .win-nav-footer {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex-shrink: 0;
    padding-top: 4px;
    position: relative;
    z-index: 2;
    background: var(--app-bg);
  }

  .win-nav-pane-top {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0;
    padding: 6px 8px 8px;
    position: relative;
    z-index: 2;
  }

  .win-nav-pane-header,
  .win-nav-pane-footer,
  .win-nav-pane-custom-content {
    min-height: 32px;
    display: flex;
    align-items: center;
    color: var(--text-primary);
  }

  .win-nav-pane-title {
    min-height: 32px;
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .win-nav-pane-search {
    display: flex;
    align-items: center;
  }

    .win-nav-pane-search > * {
      width: 100%;
    }

  .win-nav-shell.is-overlay-left .win-nav-footer {
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

  .win-nav-settings-item .animated-icon-gear {
    font-size: 11px;
  }

    .win-nav-back-button:disabled {
      color: var(--text-disabled);
      cursor: default;
      opacity: 0.65;
    }

    .win-nav-back-button:hover,
    .win-nav-hamburger:hover {
      background: var(--subtle-secondary);
    }

    .win-nav-back-button:active,
    .win-nav-hamburger:active {
      background: var(--subtle-tertiary);
    }

  .win-nav-menu {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .win-nav-top-bar {
    position: relative;
    width: 100%;
    height: 48px;
    transition: width var(--normal-duration) var(--fast-out-slow-in), background var(--normal-duration) var(--fast-out-slow-in);
    display: flex;
    align-items: center;
  }

  .win-nav-top-measure {
    position: absolute;
    left: -10000px;
    top: -10000px;
    display: flex;
    align-items: center;
    gap: 4px;
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
      gap: 4px;
      height: 100%;
    }

  .win-nav-item {
    position: relative;
    height: 36px;
    padding: 0 12px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    cursor: pointer;
    background: transparent;
    transition: background var(--fast-duration) var(--fast-out-slow-in);
    white-space: nowrap;
    user-select: none;
  }

    .win-nav-item:hover {
      background: var(--subtle-secondary);
    }

    .win-nav-item:active {
      background: var(--subtle-tertiary);
    }

  .win-nav-left-panel .win-nav-item:active {
    color: var(--text-secondary);
  }

  .win-nav-item.is-selected {
    background: var(--subtle-secondary);
  }

    .win-nav-item.is-selected:hover {
      background: var(--subtle-tertiary);
    }

    .win-nav-item.is-selected:active {
      background: var(--subtle-pressed);
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

  .win-nav-item-header {
    min-height: 32px;
    padding: 8px 16px 4px;
    display: flex;
    align-items: flex-end;
    color: var(--text-secondary);
    font-size: 12px;
    line-height: 16px;
    user-select: none;
  }

  .win-nav-item-header .win-text-block {
    color: inherit;
  }

  .win-nav-item-separator {
    height: 1px;
    margin: 4px 12px;
    background: var(--stroke-divider);
  }

  .win-nav-item.win-nav-settings-item .icon.animated-icon-gear {
    font-size: 14px;
  }

  .win-nav-left-panel.is-compact .win-nav-item .label {
    opacity: 0;
    pointer-events: none;
  }

  .win-nav-left-panel.is-compact.is-pane-closing .win-nav-item .label {
    opacity: 1;
  }

  .win-nav-left-panel.is-compact .win-nav-group-chevron {
    opacity: 0;
    pointer-events: none;
  }

  .win-nav-left-panel.is-compact.is-pane-closing .win-nav-group-chevron {
    opacity: 1;
  }

  .win-nav-indicator {
    position: absolute;
    background: var(--accent-base);
    border-radius: 2px;
    pointer-events: none;
    z-index: 10;
  }

  .win-nav-left-panel .win-nav-indicator {
    left: 4px;
    top: 0;
    width: 3px;
    height: 16px;
    transition: left 200ms var(--fast-out-slow-in);
  }

    .win-nav-left-panel .win-nav-indicator.is-child {
      left: 36px;
    }

  .win-nav-top-bar .win-nav-indicator {
    top: auto;
    bottom: 4px;
    left: 0;
    height: 3px;
  }

  .win-nav-top-bar .win-nav-item {
    justify-content: center;
    padding: 0 16px;
  }

    .win-nav-top-bar .win-nav-more-button,
    .win-nav-top-measure .win-nav-more-button {
      min-width: 40px;
      padding: 0 12px;
    }

      .win-nav-top-bar .win-nav-more-button .icon,
      .win-nav-top-measure .win-nav-more-button .icon {
        margin-right: 8px;
      }

      .win-nav-top-bar .win-nav-more-button .icon:only-child,
      .win-nav-top-measure .win-nav-more-button .icon:only-child {
        margin-right: 0;
      }

    .win-nav-top-bar .win-nav-item:hover {
      background: transparent;
      opacity: 0.8;
    }

    .win-nav-top-bar .win-nav-item:active {
      opacity: 0.6;
      transition: opacity 0.06s ease-out;
    }

    .win-nav-top-bar .win-nav-item.is-selected:active {
      opacity: 0.6;
    }

    .win-nav-top-bar .win-nav-item.is-selected {
      background: transparent;
    }

      .win-nav-top-bar .win-nav-item.is-selected:hover {
        background: transparent;
      }

    .win-nav-top-bar .win-nav-item .icon {
      margin-right: 8px;
      top: 0.5px;
    }

  .win-nav-top-bar .win-nav-settings-item .label {
    display: none;
  }

  .win-nav-top-bar .win-nav-settings-item .icon {
    margin-right: 0;
  }

  .win-nav-shell.has-titlebar.is-left .win-nav-left-panel {
    padding-top: calc(env(titlebar-area-height, 32px) + 8px);
  }

  .win-nav-shell.has-titlebar.is-overlay-left .win-nav-left-panel {
    padding-top: calc(env(titlebar-area-height, 32px) + 8px);
  }

  .win-nav-shell.has-titlebar.is-left .win-nav-content {
    margin-top: env(titlebar-area-height, 32px);
    border-radius: 8px 0 0 0;
  }

  .win-nav-shell.has-titlebar.is-overlay-left .win-nav-content {
    margin-top: env(titlebar-area-height, 32px);
    border-radius: 8px 0 0 0;
  }

  .win-nav-shell.has-titlebar.is-left-minimal .win-nav-content {
    border-left: 0;
    border-radius: 0;
  }

  .win-nav-shell.has-titlebar.is-top {
    padding-top: env(titlebar-area-height, 32px);
  }

  .win-nav-group-header {
    position: relative;
  }

    .win-nav-group-header .win-nav-group-chevron {
      margin-left: auto;
      margin-right: 0;
      font-size: 12px;
      transition: transform 200ms var(--fast-out-slow-in), opacity var(--fast-duration) var(--fast-out-slow-in);
      transform: rotate(0deg);
    }

      .win-nav-group-header .win-nav-group-chevron.chevron-open {
        transform: rotate(180deg);
      }

      .win-nav-group-header .win-nav-group-chevron.chevron-close {
        transform: rotate(0deg);
      }

  .win-nav-group.is-expanded > .win-nav-group-header .win-nav-group-chevron {
    transform: rotate(180deg);
  }

  .win-nav-group-children {
    overflow: hidden;
    transition: height var(--normal-duration) var(--fast-out-slow-in);
  }

  .win-nav-group-children-inner {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: 2px;
  }

  .win-nav-group-child {
    padding-left: 44px;
  }

    .win-nav-group-child .icon {
      margin-right: 16px;
    }

  .win-nav-left-panel .win-nav-group.is-child-selected > .win-nav-group-header {
    background: transparent;
  }

    .win-nav-left-panel .win-nav-group.is-child-selected > .win-nav-group-header:hover {
      background: var(--subtle-secondary);
    }

  .win-nav-left-panel.is-compact .win-nav-group.is-child-selected > .win-nav-group-header {
    background: transparent;
  }

  .win-nav-top-bar .win-nav-group-header .win-nav-group-chevron {
    margin-left: 8px;
    margin-right: 0;
    font-size: 10px;
    transform: rotate(0deg);
    transition: transform 200ms var(--fast-out-slow-in);
  }

    .win-nav-top-bar .win-nav-group-header .win-nav-group-chevron.chevron-open {
      transform: rotate(180deg);
    }

    .win-nav-top-bar .win-nav-group-header .win-nav-group-chevron.chevron-close {
      transform: rotate(0deg);
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
    min-width: 220px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .win-nav-more-title {
    min-height: 32px;
    padding: 4px 12px;
    display: flex;
    align-items: center;
    color: var(--text-secondary);
    font-size: 12px;
  }

  .win-nav-more-panel .win-nav-item {
    width: 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    .win-nav-left-panel,
    .win-nav-content,
    .win-nav-group-children,
    .win-nav-group-chevron {
      transition-duration: 0ms !important;
      animation-duration: 0ms !important;
    }
  }

</style>
