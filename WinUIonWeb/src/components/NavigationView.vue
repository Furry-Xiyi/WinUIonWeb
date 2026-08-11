<template>
  <!-- 对应官方 Microsoft.UI.Xaml.Controls.NavigationView（ref/microsoft-ui-xaml-main/controls/dev/NavigationView） -->
  <div class="win-nav-shell" :class="shellClasses" :style="navigationStyle" ref="shellRef">
    <nav v-if="isTopNavigation" class="win-nav-top-bar" ref="navRef" @keydown="onNavigationKeydown" @focusin="onNavigationFocusIn" @pointerdown.capture="onNavigationPointerDown" @touchstart.capture="onNavigationPointerDown">
      <div class="win-nav-indicator-track" ref="indicatorTrack">
        <div class="win-nav-indicator" :style="indicatorStyle"></div>
      </div>
      <button v-if="showBackButtonResolved" class="win-nav-back-button" :disabled="!canGoBack" :aria-label="t('text.back')" v-bind="{ 'tooltipservice.tooltip': t('text.back') }" @click="onBackClick" @mousedown="onBackDown" @mouseup="onBackUp" @mouseleave="onBackLeave" ref="topBackButtonRef">
        <span class="icon animated-icon animated-icon-back" :class="backClass" @animationend="onBackAnimEnd">&#xE72B;</span>
      </button>
      <div v-if="$slots.PaneHeader" class="win-nav-top-fixed win-nav-top-pane-header"><slot name="PaneHeader"></slot></div>
      <WinTextBlock v-else-if="paneTitle && !isPaneToggleButtonVisible" class="win-nav-top-fixed win-nav-top-pane-title" :Text="paneTitle" />
      <div class="win-nav-menu win-nav-top-primary-menu" ref="topPrimaryMenuRef">
        <template v-for="item in topVisibleMenuItems" :key="item.value">
          <div v-if="item.type === 'Header'" class="win-nav-item-header">
            <WinTextBlock :Text="item.label" />
          </div>
          <div v-else-if="item.type === 'Separator'" class="win-nav-item-separator"></div>
          <div v-else-if="!item.children" class="win-nav-item" role="button" :class="{ 'is-selected': selectedValue === item.value, 'is-disabled': !item.isEnabled }" :aria-disabled="!item.isEnabled || undefined" v-bind="itemToolTipAttrs(item)" @click="onItemClick(item)" :ref="el => setItemRef(item.value, el)">
            <span v-if="item.icon" class="icon">{{ item.icon }}</span>
            <WinTextBlock class="label" :Text="item.label" />
            <WinInfoBadge v-if="item.infoBadge" class="win-nav-infobadge" v-bind="item.infoBadge" />
          </div>
          <div v-else class="win-nav-group" :class="{ 'is-child-selected': isChildOfGroup(item) }">
            <div class="win-nav-item win-nav-group-header" role="button" :class="{ 'is-selected': item.selectsOnInvoked !== false && selectedValue === item.value, 'is-disabled': !item.isEnabled }" :aria-disabled="!item.isEnabled || undefined" v-bind="itemToolTipAttrs(item)" @click="onGroupHeaderClick(item)" :ref="el => setItemRef(item.value, el)">
              <span v-if="item.icon" class="icon">{{ item.icon }}</span>
              <WinTextBlock class="label" :Text="item.label" />
              <WinInfoBadge v-if="item.infoBadge" class="win-nav-infobadge" v-bind="item.infoBadge" />
              <span class="icon win-nav-group-chevron" :class="groupChevronClass(item.value)" @click.stop="onGroupChevronClick(item)"></span>
            </div>
          </div>
        </template>
        <div v-if="topOverflowMenuItems.length" class="win-nav-item win-nav-more-button" role="button" tabindex="0" :aria-label="t('text.more')" v-bind="{ 'tooltipservice.tooltip': t('text.more') }" @click="toggleMoreFlyout" ref="moreButtonRef">
          <span class="icon">&#xE712;</span>
          <WinTextBlock v-if="officialProps.OverflowLabelMode === 'MoreLabel'" class="label" :Text="t('text.more')" />
        </div>
      </div>
      <div class="win-nav-top-pane-custom-content"><slot name="PaneCustomContent"></slot></div>
      <div v-if="$slots.AutoSuggestBox" class="win-nav-top-fixed win-nav-top-pane-search"><slot name="AutoSuggestBox"></slot></div>
      <div v-if="$slots.PaneFooter" class="win-nav-top-fixed win-nav-top-pane-footer"><slot name="PaneFooter"></slot></div>
      <div class="win-nav-menu win-nav-top-footer-menu" ref="topFooterMenuRef">
        <template v-for="item in footerItems" :key="item.value">
          <div v-if="item.type === 'Header'" class="win-nav-item-header"><WinTextBlock :Text="item.label" /></div>
          <div v-else-if="item.type === 'Separator'" class="win-nav-item-separator"></div>
          <div v-else class="win-nav-item" role="button" :class="{ 'is-selected': selectedValue === item.value, 'is-disabled': !item.isEnabled }" :aria-disabled="!item.isEnabled || undefined" v-bind="itemToolTipAttrs(item)" @click="onItemClick(item)" :ref="el => setItemRef(item.value, el)">
            <span v-if="item.icon" class="icon">{{ item.icon }}</span>
            <WinTextBlock class="label" :Text="item.label" />
            <WinInfoBadge v-if="item.infoBadge" class="win-nav-infobadge" v-bind="item.infoBadge" />
          </div>
        </template>
        <div v-if="isSettingsVisible" class="win-nav-item win-nav-settings-item" role="button" :class="{ 'is-selected': selectedValue === settingsValue }" tabindex="0" v-bind="{ 'tooltipservice.tooltip': resolvedSettingsLabel }" @click="selectSettings" @mousedown="onGearDown" @mouseup="onGearUp" @mouseleave="onGearLeave" :ref="el => setItemRef(settingsValue, el)">
          <span class="icon animated-icon animated-icon-gear" :class="gearClass" @animationend="onGearAnimEnd">{{ settingsIcon }}</span>
          <WinTextBlock class="label" :Text="resolvedSettingsLabel" />
        </div>
      </div>
      <div class="win-nav-top-measure" ref="topMeasureRef" aria-hidden="true">
        <template v-for="item in menuItems" :key="item.value">
          <div v-if="item.type === 'Header'" class="win-nav-item-header" :data-value="item.value"><WinTextBlock :Text="item.label" /></div>
          <div v-else-if="item.type === 'Separator'" class="win-nav-item-separator" :data-value="item.value"></div>
          <div v-else class="win-nav-item" :data-value="item.value">
            <span v-if="item.icon" class="icon">{{ item.icon }}</span>
            <WinTextBlock class="label" :Text="item.label" />
            <WinInfoBadge v-if="item.infoBadge" class="win-nav-infobadge" v-bind="item.infoBadge" />
            <span v-if="item.children" class="icon win-nav-group-chevron">&#xE70D;</span>
          </div>
        </template>
        <div class="win-nav-item win-nav-more-button" data-value="__more">
          <span class="icon">&#xE712;</span>
          <WinTextBlock v-if="officialProps.OverflowLabelMode === 'MoreLabel'" class="label" :Text="t('text.more')" />
        </div>
      </div>
    </nav>
    <nav v-else class="win-nav-left-panel" :class="['win-nav-left-panel', { 'is-compact': isCompact, 'is-closed-compact': isClosedCompact, 'is-minimal': isLeftMinimalMode, 'has-back-button': showBackButtonInLeftNav, 'has-pane-toggle-button': isPaneToggleButtonVisible }, paneTransition ? `is-pane-${paneTransition}` : '']" :style="paneStyle" ref="navRef" @keydown="onNavigationKeydown" @focusin="onNavigationFocusIn" @pointerdown.capture="onNavigationPointerDown" @touchstart.capture="onNavigationPointerDown">
      <button v-if="showBackButtonInLeftNav" class="win-nav-back-button" :disabled="!canGoBack" :aria-label="t('text.back')" v-bind="{ 'tooltipservice.tooltip': t('text.back') }" @click="onBackClick" @mousedown="onBackDown" @mouseup="onBackUp" @mouseleave="onBackLeave">
        <span class="icon animated-icon animated-icon-back" :class="backClass" @animationend="onBackAnimEnd">&#xE72B;</span>
      </button>
      <div v-if="isPaneToggleButtonVisible" class="win-nav-pane-command-row">
        <button v-if="isPaneToggleButtonVisible" class="win-nav-hamburger" :class="{ 'has-pane-title': paneTitle && paneTitleSpaceVisible }" :aria-label="paneToggleLabel" v-bind="{ 'tooltipservice.tooltip': paneToggleLabel }" @click="toggleCompact" @mousedown="onHamburgerDown" @mouseup="onHamburgerUp" @mouseleave="onHamburgerLeave">
          <span class="icon animated-icon animated-icon-hamburger" :class="hamburgerClass" @animationend="onHamburgerAnimEnd">&#xE700;</span>
          <WinTextBlock v-if="paneTitle && showPaneTitle" class="win-nav-pane-title" :Text="paneTitle" />
        </button>
      </div>
      <div class="win-nav-pane-surface" v-show="isLeftPaneContentVisible" :aria-hidden="isLeftMinimalMode && isCompact ? 'true' : undefined" :inert="isLeftMinimalMode && isCompact">
        <div class="win-nav-indicator-track" ref="indicatorTrack">
          <div class="win-nav-indicator" :class="{ 'is-child': indicatorIsChild }" :style="indicatorStyle"></div>
        </div>
        <div v-if="!isPaneToggleButtonVisible && paneTitle && showPaneTitle" class="win-nav-pane-title-holder">
          <WinTextBlock class="win-nav-pane-title" :Text="paneTitle" />
        </div>
        <div v-if="$slots.PaneHeader" v-show="isFullPaneList" class="win-nav-pane-header" :class="{ 'has-pane-toggle': isPaneToggleButtonVisible }"><slot name="PaneHeader"></slot></div>
        <div v-if="$slots.AutoSuggestBox" class="win-nav-pane-top" :class="{ 'is-closed-compact': isClosedCompact }">
          <div class="win-nav-pane-search">
            <div v-show="!isClosedCompact" class="win-nav-pane-search-presenter" ref="paneAutoSuggestPresenterRef"><slot name="AutoSuggestBox"></slot></div>
            <button v-show="isClosedCompact" class="win-nav-pane-search-button" :aria-label="t('text.search')" v-bind="{ 'tooltipservice.tooltip': t('text.search') }" @click="onPaneSearchButtonClick">
              <span class="icon">&#xE721;</span>
            </button>
          </div>
        </div>
        <div v-if="$slots.PaneCustomContent" class="win-nav-pane-custom-content"><slot name="PaneCustomContent"></slot></div>
        <WinScrollViewer
          class="win-nav-left-scrollable"
          ref="scrollArea"
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
              <div v-else-if="!item.children" class="win-nav-item" role="button" :class="{ 'is-selected': selectedValue === item.value, 'is-disabled': !item.isEnabled }" :aria-disabled="!item.isEnabled || undefined" v-bind="itemToolTipAttrs(item)" @click="onItemClick(item)" :ref="el => setItemRef(item.value, el)">
                <span v-if="item.icon" class="icon">{{ item.icon }}</span>
                <WinTextBlock class="label" :Text="item.label" />
                <WinInfoBadge v-if="item.infoBadge" class="win-nav-infobadge" v-bind="item.infoBadge" />
              </div>
              <div v-else class="win-nav-group" :class="{ 'is-expanded': groupExpanded[item.value] && isPaneGroupChildrenVisible, 'is-child-selected': isChildOfGroup(item) }">
                <div class="win-nav-item win-nav-group-header" role="button" :class="{ 'is-selected': item.selectsOnInvoked !== false && selectedValue === item.value, 'is-disabled': !item.isEnabled }" :aria-disabled="!item.isEnabled || undefined" v-bind="itemToolTipAttrs(item)" @click="onGroupHeaderClick(item)" :ref="el => setItemRef(item.value, el)">
                  <span v-if="item.icon" class="icon">{{ item.icon }}</span>
                  <WinTextBlock class="label" :Text="item.label" />
                  <WinInfoBadge v-if="item.infoBadge" class="win-nav-infobadge" v-bind="item.infoBadge" />
                  <span class="icon win-nav-group-chevron" :class="groupChevronClass(item.value)" @click.stop="onGroupChevronClick(item)">&#xE70D;</span>
                </div>
                <div
                  class="win-nav-group-children"
                  :style="{ height: groupExpanded[item.value] && isPaneGroupChildrenVisible ? (groupHeights[item.value] || 0) + 'px' : '0px' }"
                  :aria-hidden="isPaneGroupChildrenVisible ? undefined : 'true'"
                  :inert="isPaneGroupChildrenVisible ? undefined : ''">
                  <div class="win-nav-group-children-inner" :ref="el => setChildrenRef(item.value, el)">
                    <div v-for="child in item.children" :key="child.value" class="win-nav-item win-nav-group-child" role="button" :class="{ 'is-selected': selectedValue === child.value, 'is-disabled': !child.isEnabled }" :aria-disabled="!child.isEnabled || undefined" v-bind="itemToolTipAttrs(child)" @click="onChildClick(item, child)" :ref="el => setItemRef(child.value, el)">
                      <span v-if="child.icon" class="icon">{{ child.icon }}</span>
                      <WinTextBlock class="label" :Text="child.label" />
                      <WinInfoBadge v-if="child.infoBadge" class="win-nav-infobadge" v-bind="child.infoBadge" />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </WinScrollViewer>
        <div class="win-nav-footer">
          <div v-if="$slots.PaneFooter" class="win-nav-pane-footer"><slot name="PaneFooter"></slot></div>
          <template v-for="item in footerItems" :key="item.value">
            <div v-if="item.type === 'Header'" class="win-nav-item-header"><WinTextBlock :Text="item.label" /></div>
            <div v-else-if="item.type === 'Separator'" class="win-nav-item-separator"></div>
            <div v-else class="win-nav-item" role="button" :class="{ 'is-selected': selectedValue === item.value, 'is-disabled': !item.isEnabled }" :aria-disabled="!item.isEnabled || undefined" v-bind="itemToolTipAttrs(item)" @click="onItemClick(item)" :ref="el => setItemRef(item.value, el)">
              <span v-if="item.icon" class="icon">{{ item.icon }}</span>
              <WinTextBlock class="label" :Text="item.label" />
              <WinInfoBadge v-if="item.infoBadge" class="win-nav-infobadge" v-bind="item.infoBadge" />
            </div>
          </template>
          <div v-if="isSettingsVisible" class="win-nav-item win-nav-settings-item" role="button" :class="{ 'is-selected': selectedValue === settingsValue }" tabindex="0" v-bind="(isTopNavigation || isClosedCompact) ? { 'tooltipservice.tooltip': resolvedSettingsLabel } : {}" @click="selectSettings" @mousedown="onGearDown" @mouseup="onGearUp" @mouseleave="onGearLeave" :ref="el => setItemRef(settingsValue, el)">
            <span class="icon animated-icon animated-icon-gear" :class="gearClass" @animationend="onGearAnimEnd">{{ settingsIcon }}</span>
            <WinTextBlock class="label" :Text="resolvedSettingsLabel" />
          </div>
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
          <div v-else-if="!item.children" class="win-nav-item" role="button" :class="{ 'is-selected': selectedValue === item.value, 'is-disabled': !item.isEnabled }" :aria-disabled="!item.isEnabled || undefined" v-bind="itemToolTipAttrs(item)" @click="onMoreItemClick(item)">
            <span v-if="item.icon" class="icon">{{ item.icon }}</span>
            <WinTextBlock class="label" :Text="item.label" />
            <WinInfoBadge v-if="item.infoBadge" class="win-nav-infobadge" v-bind="item.infoBadge" />
          </div>
          <div v-else class="win-nav-group" :class="{ 'is-expanded': groupExpanded[item.value], 'is-child-selected': isChildOfGroup(item) }">
            <div class="win-nav-item win-nav-group-header" role="button" :class="{ 'is-selected': item.selectsOnInvoked !== false && selectedValue === item.value, 'is-disabled': !item.isEnabled }" :aria-disabled="!item.isEnabled || undefined" v-bind="itemToolTipAttrs(item)" @click="onMoreGroupHeaderClick(item)">
              <span v-if="item.icon" class="icon">{{ item.icon }}</span>
              <WinTextBlock class="label" :Text="item.label" />
              <WinInfoBadge v-if="item.infoBadge" class="win-nav-infobadge" v-bind="item.infoBadge" />
              <span class="icon win-nav-group-chevron" :class="groupChevronClass(item.value)" @click.stop="onMoreGroupChevronClick(item)">&#xE70D;</span>
            </div>
            <div class="win-nav-group-children" :style="{ height: groupExpanded[item.value] ? ((item.children?.length || 0) * 36) + 'px' : '0px' }">
              <div class="win-nav-group-children-inner">
                <div v-for="child in item.children" :key="child.value" class="win-nav-item win-nav-group-child" role="button" :class="{ 'is-selected': selectedValue === child.value, 'is-disabled': !child.isEnabled }" :aria-disabled="!child.isEnabled || undefined" v-bind="itemToolTipAttrs(child)" @click="onMoreChildClick(item, child)">
                  <span v-if="child.icon" class="icon">{{ child.icon }}</span>
                  <WinTextBlock class="label" :Text="child.label" />
                  <WinInfoBadge v-if="child.infoBadge" class="win-nav-infobadge" v-bind="child.infoBadge" />
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
import { ref, reactive, computed, getCurrentInstance, onMounted, onBeforeUnmount, watch, nextTick, useSlots, toRaw } from 'vue';
import WinMenuFlyout from './WinMenuFlyout.vue';
import WinScrollViewer from './WinScrollViewer.vue';
import WinInfoBadge from './WinInfoBadge.vue';
import WinTextBlock from './WinTextBlock.vue';
import { useI18n } from './i18n/index';
import {
  createEntranceNavigationTransitionInfo,
  createSlideNavigationTransitionInfo
} from '../utils/navigationTransitionInfo';

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
  IsNavigationPending: { type: Boolean, default: false },
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
  OverflowLabelMode: { type: String, default: 'NoLabel' },
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
const isSelectedItemControlled = Object.keys(componentInstance?.vnode.props ?? {})
  .some(key => key.replace(/-/g, '').toLowerCase() === 'selecteditem');

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
  ? (item.Tag ?? item.Value ?? item.Name ?? item.value)
  : item;
const sourceIdentityMap = new WeakMap();
let nextSourceIdentity = 0;
const getSourceIdentity = (item, fallbackKey) => {
  if (!item || typeof item !== 'object') return getItemTag(item) ?? fallbackKey;
  // Props and v-model refs can expose either a Vue proxy or the original
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
  const declaredType = item?.Type ?? item?.type ?? (item?.IsHeader ? 'Header' : item?.IsSeparator ? 'Separator' : 'Item');
  const type = declaredType === 'NavigationViewItemHeader'
    ? 'Header'
    : declaredType === 'NavigationViewItemSeparator'
      ? 'Separator'
      : declaredType;
  const children = item?.MenuItems ?? item?.children;
  return {
    value: getSourceIdentity(item, `__${String(type).toLowerCase()}-${fallbackKey}`),
    tag: getItemTag(item),
    label: item?.Content ?? item?.Name ?? item?.Text ?? item?.label ?? '',
    icon: item?.Icon ?? item?.Glyph ?? item?.icon ?? '',
    infoBadge: item?.InfoBadge ?? null,
    automationName: item?.['AutomationProperties.Name'] ?? item?.AutomationProperties?.Name ?? '',
    tooltip: item?.ToolTip ?? item?.Tooltip ?? item?.tooltip ?? '',
    type,
    children: Array.isArray(children)
      ? children.map((child, index) => normalizeItem(child, `${fallbackKey}-${index}`))
      : null,
    isEnabled: (item?.IsEnabled ?? item?.isEnabled ?? !(item?.Disabled ?? item?.disabled ?? false)) !== false,
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
const flattenedItems = computed(() => [...menuItems.value, ...footerItems.value]
  .flatMap(item => [item, ...(item.children || [])]));
const resolveSelectedValue = (selectedItem) => {
  if (selectedItem?.IsSettingsItem || getItemTag(selectedItem) === 'settings') return 'settings';
  if (selectedItem && typeof selectedItem === 'object') {
    const rawSelectedItem = toRaw(selectedItem);
    const exactItem = flattenedItems.value.find(item => item.source === selectedItem || toRaw(item.source) === rawSelectedItem);
    if (exactItem) return exactItem.value;
  }
  const selectedTag = getItemTag(selectedItem);
  return flattenedItems.value.find(item => item.tag === selectedTag)?.value ?? selectedTag;
};
const selectedValue = computed(() => resolveSelectedValue(internalSelectedItem.value));

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
const paneAutoSuggestPresenterRef = ref(null);
const topPrimaryMenuRef = ref(null);
const topFooterMenuRef = ref(null);
const topMeasureRef = ref(null);
const moreButtonRef = ref(null);
const topBackButtonRef = ref(null);
const indicatorStyle = ref({ opacity: '0' });
const indicatorIsChild = ref(false);
const groupExpanded = reactive({});
const manuallyCollapsedGroups = reactive({});
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
const flyoutPlacement = computed(() => isTopNavigation.value ? 'Bottom' : 'RightEdgeAlignedTop');
const isLeftMinimalMode = computed(() => resolvedPaneDisplayMode.value === 'LeftMinimal');
const isLeftCompactMode = computed(() => resolvedPaneDisplayMode.value === 'LeftCompact');
const isLeftOverlayMode = computed(() => isLeftMinimalMode.value || isLeftCompactMode.value);
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
    ...(toolTip ? { 'tooltipservice.tooltip': toolTip } : {})
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
  !!(header.value || slots.Header) &&
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
const paneStyle = computed(() => ({
  '--win-nav-open-pane-length': `${props.openPaneLength}px`,
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
  const style = { ...paneStyle.value };
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
let indicatorHiddenByScroll = false;
let paneTransitionTimer = null;
// Mirrors NavigationView::m_wasForceClosed: adaptive resize closes do not
// count as a user close, so Auto can reopen the pane on Expanded.
let wasForceClosed = officialProps.IsPaneOpen === false;
let suppressNextTopChildWatcherMove = false;
let lastNavigationPointerDownTime = Number.NEGATIVE_INFINITY;
let lastResizeShellWidth = 0;
let expandedPaneVerticalOffset = 0;
let paneLayoutSyncFrame = null;
let isRestoringPaneScroll = false;

const gearClass = ref('');
const hamburgerClass = ref('');
const backClass = ref('');
let gearPressed = false;
let gearRewindDone = false;
let gearAwaitingSettingsNavigation = false;
let gearNavigationHeld = false;
let hamburgerPressed = false;
let hamburgerPressDone = false;
let backPressed = false;
let backPressDone = false;

const canGoBack = computed(() => officialProps.IsBackEnabled);

const INDICATOR_SIZE = 16;
const EASE_OUT = 'cubic-bezier(0.1, 0.9, 0.2, 1)';
const EASE_COLLAPSE = 'cubic-bezier(0.4, 0.0, 0.7, 0.3)';
// The native control uses one stretch path for a same-level move. Generating
// the path from the ordered endpoints gives the exact spatial mirror for
// right-to-left and left-to-right motion instead of maintaining two variants.
const makeStretchIndicatorKeyframes = (axis, from, to) => {
  const distance = Math.abs(to - from);
  const edge = Math.min(from, to);
  const transform = value => axis === 'x' ? `translateX(${value}px)` : `translateY(${value}px)`;
  const size = axis === 'x' ? 'width' : 'height';
  return [
    { transform: transform(from), [size]: `${INDICATOR_SIZE}px`, offset: 0, easing: 'cubic-bezier(0.9, 0.1, 1, 0.2)' },
    { transform: transform(edge), [size]: `${distance + INDICATOR_SIZE}px`, offset: 0.333, easing: EASE_OUT },
    { transform: transform(to), [size]: `${INDICATOR_SIZE}px`, offset: 1 }
  ];
};

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

// Native NavigationView animates the indicators owned by only the previous
// and next item containers. Two additive masks reproduce those item-local
// bounds without the self-intersecting clip polygon that WebKit rasterizes
// inconsistently while the indicator is stretching.
const setIndicatorVisibility = (track, axis, targetRect, sourceRect = null) => {
  const trackMetrics = getTrackMetrics(track);
  const extent = axis === 'x' ? trackMetrics.width : trackMetrics.height;
  const startKey = axis === 'x' ? 'left' : 'top';
  const endKey = axis === 'x' ? 'right' : 'bottom';
  const clampRect = (rect) => {
    if (!rect) return null;
    const start = Math.max(0, Math.min(extent, rect[startKey]));
    const end = Math.max(start, Math.min(extent, rect[endKey]));
    return end > start ? { start, end } : null;
  };

  const target = clampRect(targetRect);
  const source = clampRect(sourceRect);
  if (!target) {
    clearIndicatorMask(track);
    track.style.clipPath = 'inset(0 100% 0 0)';
    return;
  }

  const overlaps = source && target.start <= source.end && source.start <= target.end;
  if (!source || overlaps) {
    clearIndicatorMask(track);
    const start = source ? Math.min(target.start, source.start) : target.start;
    const end = source ? Math.max(target.end, source.end) : target.end;
    track.style.clipPath = axis === 'x'
      ? `inset(0px ${Math.max(0, extent - end)}px 0px ${start}px)`
      : `inset(${start}px 0px ${Math.max(0, extent - end)}px 0px)`;
    return;
  }

  const maskImage = 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)';
  const maskSize = axis === 'x'
    ? `${target.end - target.start}px 100%, ${source.end - source.start}px 100%`
    : `100% ${target.end - target.start}px, 100% ${source.end - source.start}px`;
  const maskPosition = axis === 'x'
    ? `${target.start}px 0px, ${source.start}px 0px`
    : `0px ${target.start}px, 0px ${source.start}px`;

  track.style.clipPath = 'none';
  track.style.maskImage = maskImage;
  track.style.maskSize = maskSize;
  track.style.maskPosition = maskPosition;
  track.style.maskRepeat = 'no-repeat';
  track.style.setProperty('-webkit-mask-image', maskImage);
  track.style.setProperty('-webkit-mask-size', maskSize);
  track.style.setProperty('-webkit-mask-position', maskPosition);
  track.style.setProperty('-webkit-mask-repeat', 'no-repeat');
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
  if (!Number.isFinite(available) || available <= 0) {
    return { visibleValues: orderedValues, overflowValues: [] };
  }

  const allWidth = getTopItemsWidth(orderedValues);
  if (allWidth <= available) {
    return { visibleValues: orderedValues, overflowValues: [] };
  }

  const selectedRoot = selectedTopRootValue.value;
  const protectedValue = orderedValues.includes(selectedRoot) ? selectedRoot : null;
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

const commitNavigationValue = (value, { invoked = true, isSettings = false, collapsePane = false } = {}) => {
  const normalizedItem = isSettings ? null : findNormalizedItem(value);
  const item = isSettings ? createSettingsItem() : normalizedItem?.source;
  if (!item) return false;
  if (!isSettings && normalizedItem.isEnabled === false) return false;
  const RecommendedNavigationTransitionInfo = createRecommendedNavigationTransitionInfo(value, isSettings);

  if (invoked) {
    emit('ItemInvoked', {
      InvokedItem: item.Content ?? item.label,
      IsSettingsInvoked: isSettings,
      InvokedItemContainer: item,
      RecommendedNavigationTransitionInfo
    });
  }

  if (!isSettings && (item.SelectsOnInvoked ?? item.selectsOnInvoked) === false) return false;
  if (selectedValue.value === value) return true;

  if (isSelectedItemControlled) {
    pendingSelectionRequest = { value, collapsePane };
  } else {
    internalSelectedItem.value = item;
  }
  emit('update:SelectedItem', typeof officialProps.SelectedItem === 'object' ? item : getItemTag(item));
  emit('SelectionChanged', {
    SelectedItem: item,
    IsSettingsSelected: isSettings,
    SelectedItemContainer: item,
    RecommendedNavigationTransitionInfo
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
  const value = resolveSelectedValue(item);
  const normalizedItem = findNormalizedItem(value);
  if (!normalizedItem?.children) return;
  if (groupExpanded[value]) {
    delete manuallyCollapsedGroups[value];
    return;
  }
  emit('Expanding', { ExpandingItemContainer: normalizedItem.source, ExpandingItem: normalizedItem.source });
  delete manuallyCollapsedGroups[value];
  groupExpanded[value] = true;
  nextTick(() => measureGroup(value));
};

const Collapse = (item) => {
  const value = resolveSelectedValue(item);
  const normalizedItem = findNormalizedItem(value);
  if (!normalizedItem?.children || !groupExpanded[value]) return;
  manuallyCollapsedGroups[value] = true;
  groupExpanded[value] = false;
  emit('Collapsed', { CollapsedItemContainer: normalizedItem.source, CollapsedItem: normalizedItem.source });
};

const MenuItemFromContainer = container => {
  const value = getValueForElement(container);
  return value === props.settingsValue ? createSettingsItem() : findNormalizedItem(value)?.source ?? null;
};

const ContainerFromMenuItem = item => itemRefs[resolveSelectedValue(item)] ?? null;

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
      ClosePane();
    }
  });
};

const getIndicatorTargetForValue = (value) => {
  const parentGroup = findParentGroup(value);
  if (parentGroup && (isTopNavigation.value || isClosedCompact.value)) {
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
  if (parentGroup && !isTopNavigation.value && !isClosedCompact.value && !groupExpanded[parentGroup.value]) {
    delete manuallyCollapsedGroups[parentGroup.value];
    groupExpanded[parentGroup.value] = true;
    nextTick(() => measureGroup(parentGroup.value));
  }
};

const syncIndicatorForSelectedItem = (value, { collapsePane = false } = {}) => {
  if (value === null || value === undefined || value === '') {
    lastSelectedEl = null;
    lastIsChild = false;
    indicatorHiddenByScroll = false;
    indicatorStyle.value = { opacity: '0', transition: 'none' };
    return;
  }

  prepareSelectionTarget(value);
  nextTick(() => {
    updateTopNavigationLayout();
    nextTick(() => {
      const target = getIndicatorTargetForValue(value);
      if (isLeftMinimalMode.value && isCompact.value && paneTransition.value !== 'closing') {
        lastSelectedEl = itemRefs[target.value] || null;
        lastIsChild = target.isChild;
        indicatorIsChild.value = target.isChild;
        indicatorHiddenByScroll = false;
        indicatorStyle.value = { opacity: '0', transition: 'none' };
        return;
      }
      moveIndicatorTo(target.value, target.isChild);
      if (collapsePane) collapseOverlayAfterNavigation();
    });
  });
};

const selectNavigationValue = (value, isChild = null, { collapsePane = true } = {}) => {
  if (!commitNavigationValue(value, { collapsePane })) return;
  if (isSelectedItemControlled) {
    if (selectedValue.value === value && collapsePane) collapseOverlayAfterNavigation();
    return;
  }
  prepareSelectionTarget(value);
  nextTick(() => {
    updateTopNavigationLayout();
    nextTick(() => {
      if (isChild === null) {
        moveIndicatorForValue(value);
      } else {
        moveIndicatorTo(value, isChild);
      }
      if (collapsePane) collapseOverlayAfterNavigation();
    });
  });
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
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const target = event.target?.closest?.('.win-nav-item');
  if (!target) return;

  const value = getValueForElement(target);
  if (!value) return;

  event.preventDefault();
  if (value === settingsValue.value) {
    selectSettings();
    return;
  }

  const item = findNormalizedItem(value);
  if (!item || !item.isEnabled) return;

  const parentGroup = findParentGroup(value);
  if (parentGroup) {
    onChildClick(parentGroup, item);
  } else if (item.children) {
    onGroupHeaderClick(item);
  } else {
    onItemClick(item);
  }
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
  if (!value) return;

  if (value === settingsValue.value) {
    selectSettings();
    return;
  }

  const item = findNormalizedItem(value);
  if (!item || !item.isEnabled || item.children) return;
  onItemClick(item);
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
  const nextAvailableWidth = Math.max(0, navWidth - footerWidth - topBackWidth - fixedContentWidth);
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
  if (item.selectsOnInvoked !== false && !isChildOfGroup(item)) {
    selectNavigationValue(item.value, false);
    closeMoreFlyout();
    return;
  }

  if (item.selectsOnInvoked === false) commitNavigationValue(item.value);
  if (groupExpanded[item.value]) Collapse(item.source); else Expand(item.source);
  groupChevrons[item.value] = groupExpanded[item.value] ? 'chevron-open' : 'chevron-close';
};

const onMoreGroupChevronClick = (item) => {
  if (!item.isEnabled) return;
  if (groupExpanded[item.value]) Collapse(item.source); else Expand(item.source);
  groupChevrons[item.value] = groupExpanded[item.value] ? 'chevron-open' : 'chevron-close';
};

const toggleLeftGroup = (item) => {
  const wasExpanded = groupExpanded[item.value];
  const selectedChild = isChildOfGroup(item);
  const track = indicatorTrack.value;
  const source = selectedChild && !wasExpanded ? itemRefs[item.value] : null;
  const sourceRect = source && track ? getTrackRelativeRect(source, track) : null;
  const sourceY = sourceRect
    ? sourceRect.top + (sourceRect.bottom - sourceRect.top) / 2 - 8
    : null;

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
          sourceY,
          sourceRect,
          sourceIsChild: true,
          target,
          targetIsChild: false,
          hideSourceImmediately: true
        })) {
          skipTransition = true;
          calcIndicator();
          requestAnimationFrame(() => { skipTransition = false; });
        }
        return;
      }
      if (!animatePaneIndicatorTransition({
        sourceY,
        sourceRect,
        sourceIsChild: false,
        target,
        targetIsChild: true,
        expandDown: true
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

const onGroupHeaderClick = (item, invokeItem = true) => {
  if (!item.isEnabled) return;
  if (isTopNavigation.value) {
    if (invokeItem) {
      if (item.selectsOnInvoked !== false) {
        selectNavigationValue(item.value, false, { collapsePane: false });
      } else {
        commitNavigationValue(item.value);
      }
    }
    const el = itemRefs[item.value];
    if (el) {
      const rect = el.getBoundingClientRect();
      flyoutAnchor.value = rect;
      flyoutGroupValue.value = item.value;
      const items = [];
      if (item.selectsOnInvoked !== false) {
        items.push({ Text: item.label, Value: item.value, Icon: item.icon, IsHeader: true, IsEnabled: item.isEnabled });
      }
      for (const child of (item.children || [])) {
        items.push({ Text: child.label, Value: child.value, Icon: child.icon, IsEnabled: child.isEnabled });
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
    if (invokeItem) {
      if (item.selectsOnInvoked !== false) {
        selectNavigationValue(item.value, false, { collapsePane: false });
      } else {
        commitNavigationValue(item.value);
      }
    }
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
        items.push({ Text: item.label, Value: item.value, Icon: item.icon, IsHeader: true, IsEnabled: item.isEnabled });
      }
      for (const child of (item.children || [])) {
        items.push({ Text: child.label, Value: child.value, Icon: child.icon, IsEnabled: child.isEnabled });
      }
      flyoutItems.value = items;
      flyoutOpen.value = true;
      emit('Expanding', { ExpandingItemContainer: item.source, ExpandingItem: item.source });
      groupChevrons[item.value] = 'chevron-open';
    }
    return;
  }
  if (item.selectsOnInvoked !== false) {
    selectNavigationValue(item.value, false, { collapsePane: false });
  } else if (item.selectsOnInvoked === false) {
    commitNavigationValue(item.value);
  }
  toggleLeftGroup(item);
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
    const targetRect = getTrackRelativeRect(lastSelectedEl, track);
    const newY = targetRect.top + (targetRect.bottom - targetRect.top) / 2 - 8;
    setIndicatorVisibility(track, 'y', targetRect);
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
  if (item.IsEnabled === false) return;
  const itemValue = item.Value;
  const isHeader = item.IsHeader;
  const movesTopChildToGroup = isTopNavigation.value && flyoutGroupValue.value && !isHeader;
  if (movesTopChildToGroup) suppressNextTopChildWatcherMove = true;

  if (!commitNavigationValue(itemValue, { collapsePane: true })) return;
  flyoutOpen.value = false;
  if (flyoutGroupValue.value) {
    groupChevrons[flyoutGroupValue.value] = 'chevron-close';
  }
  if (isSelectedItemControlled) {
    if (selectedValue.value === itemValue) collapseOverlayAfterNavigation();
    return;
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
  if (!isSettingsVisible.value) return;
  gearAwaitingSettingsNavigation = true;
  if (!commitNavigationValue(settingsValue.value, { isSettings: true, collapsePane: true })) {
    gearAwaitingSettingsNavigation = false;
    return;
  }
  void nextTick(() => {
    // ItemInvoked is synchronous. If the host did not begin navigation during
    // this update, leave the normal press/release animation untouched.
    if (gearAwaitingSettingsNavigation && !officialProps.IsNavigationPending) {
      gearAwaitingSettingsNavigation = false;
    }
  });
  if (isSelectedItemControlled) {
    if (selectedValue.value === settingsValue.value) collapseOverlayAfterNavigation();
    return;
  }
  nextTick(() => {
    moveIndicatorTo(settingsValue.value, false);
    collapseOverlayAfterNavigation();
  });
};

const toggleCompact = () => {
  if (isCompact.value) {
    wasForceClosed = false;
    OpenPane();
  } else {
    wasForceClosed = true;
    ClosePane();
  }
};

const setCompact = (compact, emitUpdate = true) => {
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
  if (emitUpdate) emit('update:IsPaneOpen', !compact);
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
  if (!isLeftOverlayMode.value || isCompact.value) return;
  const target = event.target;
  if (navRef.value?.contains(target)) return;
  if (target?.closest?.('.win-menu-flyout-wrap')) return;
  // 标题栏的展开/收起按钮（TitleBar.PaneToggleRequested）属于面板切换控件，
  // 不应被当成“点击外部关闭面板”处理，否则关闭后按钮 click 又会把它重新打开。
  if (target?.closest?.('[data-nav-pane-toggle]')) return;
  ClosePane();
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
  const startTime = performance.now();
  // The panel transition and the parent/child indicator transition run in
  // parallel. Keep syncing until both contracts have had time to settle.
  const duration = Math.max(400, paneTransitionDurationMs(isCompact.value) + 200);
  let settlingFrames = 0;
  let trackedIndicatorTarget = null;
  let trackedIndicatorTargetY = null;
  // Suppress scroll-driven indicator recalculation for the complete pane
  // transition. The viewport can be clamped while child groups animate to
  // zero; restoring the saved offset happens only on the opening leg.
  isRestoringPaneScroll = true;
  skipTransition = true;

  const synchronize = (timestamp) => {
    const scrollElement = getScrollAreaElement();
    if (restoreScrollOffset && scrollElement) {
      const maximumOffset = Math.max(0, scrollElement.scrollHeight - scrollElement.clientHeight);
      scrollElement.scrollTop = Math.min(expandedPaneVerticalOffset, maximumOffset);
    }

    const indicatorElement = indicatorTrack.value?.querySelector('.win-nav-indicator');
    const indicatorIsAnimating = indicatorElement?.getAnimations()
      .some(animation => animation.playState === 'running');
    if (indicatorIsAnimating && lastSelectedEl && indicatorTrack.value) {
      const targetRect = getTrackRelativeRect(lastSelectedEl, indicatorTrack.value);
      const targetY = targetRect.top + (targetRect.bottom - targetRect.top) / 2 - 8;
      if (trackedIndicatorTarget !== lastSelectedEl) {
        trackedIndicatorTarget = lastSelectedEl;
        trackedIndicatorTargetY = targetY;
      }
      indicatorElement.style.translate = `0 ${targetY - trackedIndicatorTargetY}px`;
    } else {
      if (indicatorElement) indicatorElement.style.translate = '';
      trackedIndicatorTarget = null;
      trackedIndicatorTargetY = null;
      restoreIndicatorAfterPaneLayout();
    }

    if (timestamp - startTime < duration || settlingFrames < 2) {
      if (timestamp - startTime >= duration) settlingFrames += 1;
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

const calcIndicator = ({ animateSelectionChange = false } = {}) => {
  const sourceEl = prevSelectedEl && prevSelectedEl !== lastSelectedEl ? prevSelectedEl : null;
  const sourceWasChild = indicatorIsChild.value;
  prevSelectedEl = lastSelectedEl;
  if (!navRef.value || !lastSelectedEl) return;
  if (!navRef.value.contains(lastSelectedEl)) return;

  const track = indicatorTrack.value;
  const indicatorEl = track?.querySelector('.win-nav-indicator');
  if (!track || !indicatorEl) return;

  const trackMetrics = getTrackMetrics(track);
  const getItemRectRelTrack = el => getTrackRelativeRect(el, track, trackMetrics);

  const targetRect = getItemRectRelTrack(lastSelectedEl);
  const sourceRect = sourceEl && navRef.value.contains(sourceEl) ? getItemRectRelTrack(sourceEl) : null;

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

  const snapToFinal = (finalTransform, dimension, finalSize) => {
    requestAnimationFrame(() => {
      if (!lastSelectedEl || !navRef.value || !navRef.value.contains(lastSelectedEl)) return;
      const freshTargetRect = getTrackRelativeRect(lastSelectedEl, track);
      let expectedPos;
      if (dimension === 'x') {
        expectedPos = freshTargetRect.left + (freshTargetRect.right - freshTargetRect.left) / 2 - 8;
        setIndicatorVisibility(track, 'x', freshTargetRect);
        setIndicatorRestingStyle(indicatorEl, { transform: `translateX(${expectedPos}px)`, width: '16px', opacity: '1', transition: 'none' });
      } else {
        expectedPos = freshTargetRect.top + (freshTargetRect.bottom - freshTargetRect.top) / 2 - 8;
        setIndicatorVisibility(track, 'y', freshTargetRect);
        setIndicatorRestingStyle(indicatorEl, { transform: `translateY(${expectedPos}px)`, height: '16px', opacity: '1', transition: 'none' });
      }
      // WebKit exposes the underlying style for a frame when a fill-forwards
      // animation is cancelled. Commit the final resting style first so that
      // handoff cannot replay the stretched intermediate width or height.
      nextIndicatorAnimation(indicatorEl);
    });
  };

  if (isTopNavigation.value) {
    indicatorHiddenByScroll = false;
    const newX = targetRect.left + (targetRect.right - targetRect.left) / 2 - 8;
    if ((!animateSelectionChange && skipTransition) || indicatorStyle.value.opacity === '0') {
      nextIndicatorAnimation(indicatorEl);
      setIndicatorVisibility(track, 'x', targetRect);
      indicatorStyle.value = { transition: 'none', transform: `translateX(${newX}px)`, width: '16px', opacity: '1' };
      return;
    }
    const oldX = readTranslate(indicatorEl, 'x', newX);
    const dist = Math.abs(newX - oldX);
    if (dist < 1) {
      setIndicatorVisibility(track, 'x', targetRect);
      indicatorStyle.value = { transform: `translateX(${newX}px)`, width: '16px', opacity: '1' };
      return;
    }

    setIndicatorRestingStyle(indicatorEl, { transform: `translateX(${newX}px)`, width: '16px', opacity: '1', transition: 'none' });
    const animationId = nextIndicatorAnimation(indicatorEl);
    const sourceRegion = sourceEl ? getRegion(sourceEl) : getRegion(lastSelectedEl);
    const targetRegion = getRegion(lastSelectedEl);
    const topContinuousMove = !!sourceRect
      && Math.abs(sourceRect.top - targetRect.top) < 1
      && sourceRegion === targetRegion;

    if (topContinuousMove) {
      setIndicatorVisibility(track, 'x', targetRect, sourceRect);
      const dur = 600;
      const keyframes = makeStretchIndicatorKeyframes('x', oldX, newX);
      const anim = indicatorEl.animate(keyframes, { duration: dur, fill: 'forwards' });
      anim.onfinish = () => { if (animationId === indicatorAnimationId) snapToFinal(`translateX(${newX}px)`, 'x', '16px'); };
      return;
    }

    setIndicatorVisibility(track, 'x', targetRect, sourceRect);
    const movingRight = newX > oldX;
    const collapseKf = movingRight
      ? [{ transform: `translateX(${oldX}px)`, width: '16px', offset: 0, easing: EASE_COLLAPSE }, { transform: `translateX(${oldX + 16}px)`, width: '0px', offset: 1 }]
      : [{ transform: `translateX(${oldX}px)`, width: '16px', offset: 0, easing: EASE_COLLAPSE }, { transform: `translateX(${oldX}px)`, width: '0px', offset: 1 }];
    const expandKf = movingRight
      ? [{ transform: `translateX(${newX}px)`, width: '0px', offset: 0, easing: EASE_OUT }, { transform: `translateX(${newX}px)`, width: '16px', offset: 1 }]
      : [{ transform: `translateX(${newX + 16}px)`, width: '0px', offset: 0, easing: EASE_OUT }, { transform: `translateX(${newX}px)`, width: '16px', offset: 1 }];
    const collapseAnim = indicatorEl.animate(collapseKf, { duration: 300, fill: 'forwards' });
    collapseAnim.onfinish = () => {
      if (animationId !== indicatorAnimationId) return;
      collapseAnim.cancel();
      const expandAnim = indicatorEl.animate(expandKf, { duration: 300, fill: 'forwards' });
      expandAnim.onfinish = () => { if (animationId === indicatorAnimationId) snapToFinal(`translateX(${newX}px)`, 'x', '16px'); };
    };

  } else {
    const newY = targetRect.top + (targetRect.bottom - targetRect.top) / 2 - 8;

    const scrollEl = getScrollAreaElement();
    let visibleTop = 0;
    let visibleBottom = trackMetrics.height;
    if (scrollEl) {
      const scrollRect = getTrackRelativeRect(scrollEl, track, trackMetrics);
      visibleTop = scrollRect.top;
      visibleBottom = scrollRect.bottom;
    }

    const isInFooter = !scrollEl || !scrollEl.contains(lastSelectedEl);
    if (isInFooter) {
      visibleTop = 0;
      visibleBottom = trackMetrics.height;
    }

    const clampedTargetRect = {
      top: isInFooter ? targetRect.top : Math.max(targetRect.top, visibleTop),
      bottom: isInFooter ? targetRect.bottom : Math.min(targetRect.bottom, visibleBottom),
      left: targetRect.left,
      right: targetRect.right
    };

    if (clampedTargetRect.top >= clampedTargetRect.bottom) {
      nextIndicatorAnimation(indicatorEl);
      // Preserve the off-screen source geometry for the next selection move.
      indicatorHiddenByScroll = true;
      setIndicatorRestingStyle(indicatorEl, {
        transform: `translateY(${newY}px)`,
        height: '16px',
        opacity: '0',
        transition: 'none'
      });
      return;
    }

    const wasHiddenByScroll = indicatorHiddenByScroll;
    indicatorHiddenByScroll = false;
    if ((!animateSelectionChange && skipTransition) || (indicatorStyle.value.opacity === '0' && !wasHiddenByScroll)) {
      nextIndicatorAnimation(indicatorEl);
      setIndicatorVisibility(track, 'y', clampedTargetRect);
      indicatorStyle.value = { transition: 'none', transform: `translateY(${newY}px)`, height: '16px', opacity: '1' };
      indicatorIsChild.value = lastIsChild;
      return;
    }
    const oldY = wasHiddenByScroll && sourceRect
      ? sourceRect.top + (sourceRect.bottom - sourceRect.top) / 2 - 8
      : readTranslate(indicatorEl, 'y', newY);
    const dist = Math.abs(newY - oldY);
    if (dist < 1) { setIndicatorVisibility(track, 'y', clampedTargetRect); indicatorStyle.value = { transform: `translateY(${newY}px)`, height: '16px', opacity: '1' }; indicatorIsChild.value = lastIsChild; return; }

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

    const movingDown = newY > oldY;
    const changesItemDepth = !!sourceRect && sourceWasChild !== lastIsChild;
    if (changesItemDepth && animatePaneIndicatorTransition({
      sourceY: oldY,
      sourceRect: clampedSourceRect ?? sourceRect,
      sourceIsChild: sourceWasChild,
      target: lastSelectedEl,
      targetIsChild: lastIsChild,
      expandDown: movingDown
    })) {
      return;
    }

    setIndicatorVisibility(track, 'y', clampedTargetRect, clampedSourceRect);
    setIndicatorRestingStyle(indicatorEl, { transform: `translateY(${newY}px)`, height: '16px', opacity: '1', transition: 'none' });
    const animationId = nextIndicatorAnimation(indicatorEl);

    indicatorIsChild.value = lastIsChild;
    // Left menu and footer items share the normal same-level stretch motion.
    // Only the explicit depth transition above uses the parent/child motion.
    const dur = 600;

    const keyframes = makeStretchIndicatorKeyframes('y', oldY, newY);
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
  const selectedGroupCollapsed = parentGroup && !groupExpanded[parentGroup.value];
  const target = parentGroup && (isClosedCompact.value || selectedGroupCollapsed)
    ? itemRefs[parentGroup.value]
    : itemRefs[value] || (value === settingsValue.value ? itemRefs[settingsValue.value] : null);
  const indicatorEl = indicatorTrack.value?.querySelector('.win-nav-indicator');
  if (!target || !indicatorEl) return;
  if (indicatorEl.getAnimations().some(animation => animation.playState === 'running')) return;
  // Layout state changes (ClosedCompact hides headers and labels) move every
  // item. Always snap/recalculate after the layout settles so the indicator
  // cannot remain at a stale position or stay hidden after a fold.
  lastSelectedEl = target;
  lastIsChild = !!parentGroup && !isClosedCompact.value && !selectedGroupCollapsed;
  indicatorIsChild.value = lastIsChild;
  skipTransition = true;
  nextIndicatorAnimation(indicatorEl);
  calcIndicator();
  requestAnimationFrame(() => { skipTransition = false; });
};

let resizeTimer = null;
const onResize = () => {
  const nextShellWidth = shellRef.value?.clientWidth || shellRef.value?.offsetWidth || window.innerWidth;
  const shellWidthChanged = Math.abs(nextShellWidth - lastResizeShellWidth) >= 0.5;
  lastResizeShellWidth = nextShellWidth;
  // Width participates in display-mode resolution only for Auto. Fixed Left,
  // LeftCompact, LeftMinimal, and Top instances must not re-enter responsive
  // mode merely because their parent example is resized.
  if (normalizedPaneDisplayMode.value === 'Auto') {
    containerWidth.value = nextShellWidth || (typeof window === 'undefined' ? props.expandedModeThresholdWidth : window.innerWidth);
  }
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

onMounted(() => {
  containerWidth.value = shellRef.value?.clientWidth || shellRef.value?.offsetWidth || window.innerWidth;
  lastResizeShellWidth = containerWidth.value;
  syncDisplayMode();
  rebindRo();
  layoutObserver = new MutationObserver(queueLayoutRefresh);
  // Page content is a sibling of the navigation tree. Observing the shell
  // caused every page switch to refresh navigation layout unnecessarily.
  rebindLayoutMutationObserver();
  window.addEventListener('resize', onResize);
  document.addEventListener('pointerdown', onDocumentPointerDown, true);
  initIndicator();
});

onBeforeUnmount(() => {
  if (ro) ro.disconnect();
  if (layoutObserver) layoutObserver.disconnect();
  if (layoutObserverFrame) cancelAnimationFrame(layoutObserverFrame);
  if (paneLayoutSyncFrame) cancelAnimationFrame(paneLayoutSyncFrame);
  if (paneTransitionTimer) clearTimeout(paneTransitionTimer);
  window.removeEventListener('resize', onResize);
  document.removeEventListener('pointerdown', onDocumentPointerDown, true);
});

watch(() => props.paneDisplayMode, (value, oldValue) => {
  if (value !== oldValue) wasForceClosed = false;
  syncDisplayMode();
});

watch(resolvedPaneDisplayMode, (value, oldValue) => {
  if (value !== oldValue) {
    if (paneTransitionTimer) clearTimeout(paneTransitionTimer);
    paneTransitionTimer = null;
    paneTransition.value = '';
  }
  syncDisplayMode();
  if (value !== oldValue) nextTick(syncDisplayMode);
  refreshAfterPositionChange();
  if (value !== oldValue) emit('DisplayModeChanged', { DisplayMode: displayMode.value });
});

watch(() => props.isPaneOpen, (value) => {
  const compact = !value;
  // An external IsPaneOpen write is an explicit customer request. An
  // adaptive close has already updated isCompact before its v-model event
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
  if (confirmedSelectionRequest || previousValue !== nextValue) {
    pendingSelectionRequest = null;
  }
  if (previousValue !== nextValue && isTopNavigation.value && findParentGroup(nextValue)) {
    suppressNextTopChildWatcherMove = true;
  }
  internalSelectedItem.value = item;
  if (previousValue !== nextValue) {
    syncIndicatorForSelectedItem(nextValue, {
      collapsePane: confirmedSelectionRequest?.collapsePane === true
    });
  }
});

watch(() => officialProps.IsNavigationPending, (pending, wasPending) => {
  if (pending) {
    if (!gearAwaitingSettingsNavigation) return;
    gearAwaitingSettingsNavigation = false;
    gearNavigationHeld = true;
    gearClass.value = 'gear-navigation-hold';
    return;
  }

  if (wasPending && gearNavigationHeld) {
    gearNavigationHeld = false;
    gearClass.value = 'gear-spin';
  }
});

watch(isSettingsVisible, (visible) => {
  if (visible) return;
  delete itemRefs[settingsValue.value];
  if (props.selectedValue === settingsValue.value) {
    selectNavigationValue(props.menuItems[0]?.value || '', false);
  }
});

const animatePaneIndicatorTransition = ({
  sourceY,
  sourceRect,
  sourceIsChild,
  target,
  targetIsChild,
  expandDown = false,
  hideSourceImmediately = false,
  onComplete
}) => {
  const track = indicatorTrack.value;
  const indicatorEl = track?.querySelector('.win-nav-indicator');
  if (!track || !indicatorEl || !target || (!hideSourceImmediately && !Number.isFinite(sourceY))) return false;

  const animationId = nextIndicatorAnimation(indicatorEl);
  const animateTarget = (collapseAnim = null) => {
    if (animationId !== indicatorAnimationId) return;
    const targetRect = getTrackRelativeRect(target, track);
    const targetY = targetRect.top + (targetRect.bottom - targetRect.top) / 2 - 8;
    const targetStartY = targetY + (expandDown ? 0 : 16);
    indicatorIsChild.value = targetIsChild;
    setIndicatorVisibility(track, 'y', targetRect);
    setIndicatorRestingStyle(indicatorEl, { transform: `translateY(${targetStartY}px)`, height: '0px', opacity: '1', transition: 'none' });
    collapseAnim?.cancel();

    const expandAnim = indicatorEl.animate([
      { transform: `translateY(${targetStartY}px)`, height: '0px', offset: 0, easing: EASE_OUT },
      { transform: `translateY(${targetY}px)`, height: '16px', offset: 1 }
    ], { duration: 300, fill: 'forwards' });

    expandAnim.onfinish = () => {
      if (animationId !== indicatorAnimationId) return;
      const finalRect = getTrackRelativeRect(target, track);
      const finalY = finalRect.top + (finalRect.bottom - finalRect.top) / 2 - 8;
      setIndicatorVisibility(track, 'y', finalRect);
      setIndicatorRestingStyle(indicatorEl, { transform: `translateY(${finalY}px)`, height: '16px', opacity: '1', transition: 'none' });
      nextIndicatorAnimation(indicatorEl);
      onComplete?.();
    };
  };

  if (hideSourceImmediately) {
    // The child repeater is disappearing. Drop its indicator without an
    // outgoing animation, then retain the parent's original incoming motion.
    animateTarget();
    return true;
  }

  const sourceClip = sourceRect ?? { top: sourceY, bottom: sourceY + 16 };
  indicatorIsChild.value = sourceIsChild;
  setIndicatorVisibility(track, 'y', sourceClip);
  indicatorStyle.value = { transform: `translateY(${sourceY}px)`, height: '16px', opacity: '1', transition: 'none' };

  const collapseAnim = indicatorEl.animate([
    { transform: `translateY(${sourceY}px)`, height: '16px', offset: 0, easing: EASE_COLLAPSE },
    { transform: `translateY(${sourceY + (expandDown ? 16 : 0)}px)`, height: '0px', offset: 1 }
  ], { duration: 200, fill: 'forwards' });

  collapseAnim.onfinish = () => animateTarget(collapseAnim);
  return true;
};

watch(isCompact, (compact) => {
  const scrollElement = getScrollAreaElement();
  if (compact && scrollElement) expandedPaneVerticalOffset = scrollElement.scrollTop;
  nextTick(() => synchronizePaneLayoutTransition({ restoreScrollOffset: !compact }));

  // LeftMinimal uses an overlay pane, not ClosedCompact. Keep its complete
  // menu (including expanded children and the child indicator) intact while
  // the pane surface plays the reverse opening animation.
  if (isLeftMinimalMode.value) {
    if (!compact) {
      const parentGroup = findParentGroup(props.selectedValue);
      if (parentGroup) {
        if (manuallyCollapsedGroups[parentGroup.value]) {
          nextTick(() => {
            measureAllGroups();
            restoreIndicatorAfterPaneLayout();
          });
        } else {
          groupExpanded[parentGroup.value] = true;
          nextTick(() => {
            measureGroup(parentGroup.value);
            requestAnimationFrame(() => restoreIndicatorAfterPaneLayout());
          });
        }
      } else {
        requestAnimationFrame(() => restoreIndicatorAfterPaneLayout());
      }
    }
    return;
  }

  if (compact) {
    const parentGroup = findParentGroup(props.selectedValue);
    // ClosedCompact collapses child presenters to height zero, but it must not
    // discard their expansion state. Native NavigationView restores every
    // group that was open when the pane is opened again, rather than reopening
    // only the selected item's parent.
    if (parentGroup && manuallyCollapsedGroups[parentGroup.value]) {
      // The selected child was already moved to its parent by the manual
      // group collapse. The pane fold only changes visibility; do not replay
      // the child-to-parent indicator collapse animation.
      nextTick(() => restoreIndicatorAfterPaneLayout());
    } else if (parentGroup) {
      nextTick(() => {
        const header = itemRefs[parentGroup.value];
        if (header) {
          prevSelectedEl = lastSelectedEl;
          lastSelectedEl = header;
          lastIsChild = false;
          if (!animatePaneIndicatorTransition({
            sourceY: null,
            sourceRect: null,
            sourceIsChild: true,
            target: header,
            targetIsChild: false,
            hideSourceImmediately: true
          })) {
            skipTransition = true;
            calcIndicator();
            requestAnimationFrame(() => { skipTransition = false; });
          }
        }
      });
    }
  } else {
    const parentGroup = findParentGroup(props.selectedValue);
    if (parentGroup && manuallyCollapsedGroups[parentGroup.value]) {
      // Keep a manually collapsed selected group closed when the pane opens.
      // Recalculate the parent indicator after the pane layout settles.
      nextTick(() => {
        measureAllGroups();
        restoreIndicatorAfterPaneLayout();
      });
    } else if (parentGroup) {
      const track = indicatorTrack.value;
      const header = itemRefs[parentGroup.value];
      const headerRect = header && track ? getTrackRelativeRect(header, track) : null;
      const sourceY = headerRect
        ? headerRect.top + (headerRect.bottom - headerRect.top) / 2 - 8
        : null;
      const sourceRect = headerRect;
      groupExpanded[parentGroup.value] = true;
      nextTick(() => {
        measureAllGroups();
        measureGroup(parentGroup.value);
        const sel = itemRefs[props.selectedValue];
        if (!sel) return;
        prevSelectedEl = lastSelectedEl;
        lastSelectedEl = sel;
        lastIsChild = true;
        if (!animatePaneIndicatorTransition({
          sourceY,
          sourceRect,
          sourceIsChild: false,
          target: sel,
          targetIsChild: true,
          expandDown: true
        })) {
          skipTransition = true;
          calcIndicator();
          requestAnimationFrame(() => { skipTransition = false; });
        }
      });
    } else {
      nextTick(() => {
        measureAllGroups();
        restoreIndicatorAfterPaneLayout();
      });
    }
  }
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
    min-width: 0;
    min-height: 0;
    position: relative;
    isolation: isolate;
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
    min-height: 40px;
    margin: 44px 0 0 var(--win-nav-header-margin-left, 56px);
    padding: 0;
    display: flex;
    align-items: center;
    font-size: 28px;
    line-height: 36px;
    font-weight: 600;
    color: var(--text-primary);
    border-bottom: 1px solid transparent;
  }

  .win-nav-page-header .win-text-block {
    color: inherit;
    font-size: inherit;
    line-height: inherit;
    font-weight: inherit;
  }

  .win-nav-shell.is-top > .win-nav-content > .win-nav-page-header {
    min-height: 36px;
    margin: 0;
    padding: 0 32px;
    font-size: 20px;
    line-height: 28px;
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
    --win-nav-shadow-bleed: 30px;
    clip-path: inset(calc(-1 * var(--win-nav-shadow-bleed)));
    transition: clip-path var(--win-nav-pane-duration, 200ms) var(--win-nav-pane-easing, cubic-bezier(0, 0.35, 0.15, 1)), background var(--normal-duration) var(--fast-out-slow-in);
    flex-shrink: 0;
    overflow: hidden;
  }

  .win-nav-pane-surface {
    display: contents;
  }

    .win-nav-shell.is-overlay-left > .win-nav-left-panel {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 20;
      --win-nav-pane-fill: var(--AcrylicInAppFillColorDefaultBrush, var(--host-nav-pane-bg));
      isolation: isolate;
      background: transparent;
      -webkit-backdrop-filter: var(--flyout-backdrop);
      backdrop-filter: var(--flyout-backdrop);
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16);
      border-radius: 0 8px 8px 0;
      width: var(--win-nav-open-pane-length, 320px);
      clip-path: inset(calc(-1 * var(--win-nav-shadow-bleed)));
      transition: clip-path var(--win-nav-pane-duration, 350ms) var(--win-nav-pane-easing, cubic-bezier(0.1, 0.9, 0.2, 1)), background var(--normal-duration) var(--fast-out-slow-in), box-shadow var(--win-nav-pane-duration, 350ms) linear;
    }

    .win-nav-shell.is-overlay-left > .win-nav-left-panel::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      border-radius: inherit;
      background: var(--win-nav-pane-fill);
      transition: background var(--normal-duration) var(--fast-out-slow-in);
    }

    html.winui-webview-host .win-nav-shell.is-overlay-left > .win-nav-left-panel:not(.is-compact) {
      --win-nav-pane-fill: var(--AcrylicInAppFillColorDefaultBrush, var(--host-nav-pane-bg));
      background: transparent;
      -webkit-backdrop-filter: var(--flyout-backdrop);
      backdrop-filter: var(--flyout-backdrop);
    }

    .win-nav-shell.is-overlay-left > .win-nav-left-panel.is-compact {
      width: var(--win-nav-open-pane-length, 320px);
      clip-path: inset(0 calc(var(--win-nav-open-pane-length, 320px) - var(--win-nav-compact-pane-length, 48px)) 0 0);
      box-shadow: none;
      border-radius: 0;
    }

    .win-nav-shell.is-left-compact > .win-nav-left-panel.is-compact {
      /* The closed compact pane shares the normal Left rail surface. The
         shell background supplies the solid fill; the pane itself remains
         transparent just like PaneNotOverlaying in the native template. */
      background: transparent;
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
    }

    .win-nav-shell.is-left-compact > .win-nav-left-panel,
    html.winui-webview-host .win-nav-shell.is-overlay-left.is-left-compact > .win-nav-left-panel {
      background: transparent;
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
      box-shadow: none;
    }

    .win-nav-shell.is-left-compact > .win-nav-left-panel:not(.is-compact),
    html.winui-webview-host .win-nav-shell.is-overlay-left.is-left-compact > .win-nav-left-panel:not(.is-compact) {
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
    }

    .win-nav-shell.is-left-compact > .win-nav-left-panel::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
      width: 100%;
      pointer-events: none;
      background: var(--win-nav-pane-fill, var(--AcrylicInAppFillColorDefaultBrush, var(--host-nav-pane-bg)));
      border-radius: 0 8px 8px 0;
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16);
      -webkit-backdrop-filter: var(--flyout-backdrop);
      backdrop-filter: var(--flyout-backdrop);
      opacity: 1;
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
      width: var(--win-nav-open-pane-length, 320px);
      margin-right: calc(var(--win-nav-compact-pane-length, 48px) - var(--win-nav-open-pane-length, 320px));
      clip-path: inset(0 calc(var(--win-nav-open-pane-length, 320px) - var(--win-nav-compact-pane-length, 48px)) 0 0);
    }

    .win-nav-shell.is-left-minimal > .win-nav-left-panel.is-compact {
      background: transparent;
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
      width: var(--win-nav-open-pane-length, 320px);
      clip-path: none;
      pointer-events: none;
    }

    .win-nav-shell.is-left-minimal > .win-nav-left-panel.is-compact.is-pane-closing {
      background: transparent;
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
      box-shadow: none;
    }

    .win-nav-left-panel > .win-nav-pane-surface > .win-nav-pane-top,
    .win-nav-left-panel > .win-nav-pane-surface > .win-nav-pane-custom-content,
    .win-nav-left-panel > .win-nav-pane-surface > .win-nav-left-scrollable,
    .win-nav-left-panel > .win-nav-pane-surface > .win-nav-footer,
    .win-nav-left-panel .win-nav-menu {
      box-sizing: border-box;
      width: calc(var(--win-nav-open-pane-length, 320px) - 8px);
    }

    .win-nav-left-panel.is-closed-compact > .win-nav-pane-surface > .win-nav-left-scrollable,
    .win-nav-left-panel.is-closed-compact .win-nav-menu {
      width: calc(var(--win-nav-compact-pane-length, 48px) - 8px);
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
    background: transparent;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    box-shadow: none;
    clip-path: none;
  }

  .win-nav-shell.is-left-minimal > .win-nav-left-panel::before {
    content: none;
  }

  /* The host acrylic rule has a stronger selector than the minimal reset.
     Keep minimal to one pane surface instead of stacking a second translucent
     overlay behind it. */
  .win-nav-shell.is-overlay-left.is-left-minimal > .win-nav-left-panel,
  html.winui-webview-host .win-nav-shell.is-overlay-left.is-left-minimal > .win-nav-left-panel {
    background: transparent;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
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
    padding: 4px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    --win-nav-pane-fill: var(--AcrylicInAppFillColorDefaultBrush, var(--host-nav-pane-bg));
    isolation: isolate;
    background: var(--win-nav-pane-fill);
    -webkit-backdrop-filter: var(--flyout-backdrop);
    backdrop-filter: var(--flyout-backdrop);
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16);
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
    animation: win-nav-minimal-pane var(--win-nav-pane-open-duration, 350ms) var(--win-nav-pane-easing, cubic-bezier(0.1, 0.9, 0.2, 1)) both;
  }

  .win-nav-shell.is-left-minimal > .win-nav-left-panel.is-pane-closing > .win-nav-pane-surface {
    animation: win-nav-minimal-pane var(--win-nav-pane-close-duration, 120ms) var(--win-nav-pane-easing, cubic-bezier(0.1, 0.9, 0.2, 1)) reverse both;
    pointer-events: none;
  }

  .win-nav-shell.is-left-minimal > .win-nav-left-panel > .win-nav-back-button,
  .win-nav-shell.is-left-minimal > .win-nav-left-panel > .win-nav-pane-command-row {
    position: relative;
    z-index: 4;
    pointer-events: auto;
  }

  @keyframes win-nav-minimal-pane {
    from { transform: translateX(calc(-1 * var(--win-nav-open-pane-length, 320px))); }
    to { transform: translateX(0); }
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

  .win-nav-left-panel .win-nav-left-scrollable > .scrollbar-vertical {
    right: -4px;
  }

  .win-nav-footer {
    display: flex;
    flex-direction: column;
    gap: 0;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
    background: var(--app-bg);
  }

  .win-nav-pane-command-row {
    box-sizing: border-box;
    width: calc(var(--win-nav-open-pane-length, 320px) - 8px);
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
    /* PaneFooter is hosted by the same content grid as footer items.  Keep
       its content edge at the pane's 4px inset; individual controls provide
       their own content padding, just like NavigationViewItem. */
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
    width: calc(var(--win-nav-compact-pane-length, 48px) - 8px);
    min-width: calc(var(--win-nav-compact-pane-length, 48px) - 8px);
    padding: 0;
  }

  .win-nav-left-panel.is-closed-compact .win-nav-pane-footer > *,
  .win-nav-left-panel.is-closed-compact .win-nav-pane-footer .win-stack-panel {
    width: calc(var(--win-nav-compact-pane-length, 48px) - 8px);
    min-width: calc(var(--win-nav-compact-pane-length, 48px) - 8px);
  }

  .win-nav-left-panel.is-closed-compact .win-nav-pane-footer .win-btn {
    width: calc(var(--win-nav-compact-pane-length, 48px) - 8px);
    min-width: calc(var(--win-nav-compact-pane-length, 48px) - 8px);
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
    min-width: calc(var(--win-nav-open-pane-length, 320px) - 8px);
    max-width: calc(var(--win-nav-open-pane-length, 320px) - 8px);
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

  .win-nav-settings-item .animated-icon-gear {
    font-size: 11px;
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
    min-width: 0;
    height: 48px;
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .win-nav-top-primary-menu {
    flex: 0 1 auto;
    min-width: 0;
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
  }

    .win-nav-item:not(.is-disabled):hover {
      background: var(--subtle-secondary);
    }

    .win-nav-item:not(.is-disabled):active {
      background: var(--subtle-tertiary);
    }

  .win-nav-left-panel .win-nav-item:not(.is-disabled):active {
    color: var(--text-secondary);
  }

  .win-nav-item.is-selected {
    background: var(--subtle-secondary);
  }

    .win-nav-item.is-selected:not(.is-disabled):hover {
      background: var(--subtle-tertiary);
    }

    .win-nav-item.is-selected:not(.is-disabled):active {
      background: var(--subtle-secondary);
      color: var(--text-secondary);
    }

  .win-nav-item.is-disabled {
    color: var(--text-disabled);
    cursor: default;
  }

    .win-nav-item.is-disabled:not(.is-selected),
    .win-nav-item.is-disabled:not(.is-selected):hover,
    .win-nav-item.is-disabled:not(.is-selected):active {
      background: transparent;
      color: var(--text-disabled);
    }

    .win-nav-item.is-disabled.is-selected,
    .win-nav-item.is-disabled.is-selected:hover,
    .win-nav-item.is-disabled.is-selected:active {
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

  .win-nav-item .win-nav-infobadge {
    margin-left: auto;
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

  .win-nav-item.win-nav-settings-item .icon.animated-icon-gear {
    font-size: 14px;
  }

  .win-nav-left-panel.is-closed-compact .win-nav-item .label {
    opacity: 0;
    pointer-events: none;
  }

  .win-nav-left-panel.is-closed-compact .win-nav-item {
    width: calc(var(--win-nav-compact-pane-length, 48px) - 8px);
    min-width: calc(var(--win-nav-compact-pane-length, 48px) - 8px);
    max-width: calc(var(--win-nav-compact-pane-length, 48px) - 8px);
    overflow: hidden;
  }

  .win-nav-left-panel.is-closed-compact .win-nav-item > .win-nav-infobadge {
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
    width: 16px;
    min-width: 16px;
    margin: 0 0 0 12px;
    top: 0;
  }

  .win-nav-top-bar .win-nav-item:not(.win-nav-more-button):not(.win-nav-settings-item) > .label,
  .win-nav-top-measure .win-nav-item:not(.win-nav-more-button) > .label {
    grid-column: 2;
    margin: 0 12px;
  }

  .win-nav-top-bar .win-nav-item:not(.win-nav-more-button):not(.win-nav-settings-item) > .win-nav-infobadge,
  .win-nav-top-measure .win-nav-item:not(.win-nav-more-button) > .win-nav-infobadge {
    grid-column: 3;
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
        font-size: 20px;
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

    .win-nav-top-bar .win-nav-item:not(.is-disabled):active {
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

      .win-nav-top-bar .win-nav-item.is-selected:not(.is-disabled):active {
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
      font-size: 8px;
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

  /* During a pane fold the logical group remains expanded for restoration,
     while its child presenter is animating closed. Keep the arrow in the
     same visual state as the height animation. */
  .win-nav-left-panel .win-nav-group:not(.is-expanded) > .win-nav-group-header .win-nav-group-chevron {
    transform: rotate(0deg);
  }

  .win-nav-group-children {
    overflow: hidden;
    transition: height var(--normal-duration) var(--fast-out-slow-in);
  }

  .win-nav-group-children-inner {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding-top: 0;
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

    .win-nav-left-panel .win-nav-group.is-child-selected > .win-nav-group-header:not(.is-disabled):hover {
      background: var(--subtle-secondary);
    }

  .win-nav-left-panel.is-closed-compact .win-nav-group.is-child-selected > .win-nav-group-header {
    background: transparent;
  }

  .win-nav-top-bar .win-nav-group-header > .win-nav-group-chevron,
  .win-nav-top-measure .win-nav-item > .win-nav-group-chevron {
    grid-column: 4;
    width: 40px;
    min-width: 40px;
    height: 40px;
    margin: 0 0 0 -12px;
    font-size: 8px;
    transform: rotate(0deg);
    transition: transform 200ms var(--fast-out-slow-in);
  }

  .win-nav-top-bar .win-nav-group-header:has(> .icon:not(.win-nav-group-chevron)) > .win-nav-group-chevron,
  .win-nav-top-measure .win-nav-item:has(> .icon:not(.win-nav-group-chevron)) > .win-nav-group-chevron {
    margin-left: -16px;
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
    width: max-content;
    min-width: 0;
    max-width: min(320px, calc(100vw - 16px));
    display: grid;
    grid-template-columns: max-content;
    justify-items: stretch;
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
    box-sizing: border-box;
    width: auto;
    height: 36px;
    min-height: 36px;
    margin: 0;
    padding: 0 14px 0 0;
    display: grid;
    grid-template-columns: auto minmax(max-content, 1fr) auto auto;
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

  .win-nav-more-panel .win-nav-item > .win-nav-infobadge {
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

  .win-nav-more-panel .win-nav-item:not(.is-disabled):active {
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

  .win-nav-more-panel .win-nav-item.is-selected:not(.is-disabled):active {
    background: var(--subtle-secondary);
    color: var(--text-secondary);
  }

  .win-nav-more-panel .win-nav-group-child {
    padding-left: 28px;
  }

  /* Expanded Compact/Minimal panes use one direct tinted acrylic surface.
     The Compact pseudo layer is reserved for the closed-pane transition so
     it cannot hide the material behind a separate stacking context. */
  .win-nav-shell.is-left-compact > .win-nav-left-panel:not(.is-compact),
  html.winui-webview-host .win-nav-shell.is-overlay-left.is-left-compact > .win-nav-left-panel:not(.is-compact) {
    --win-nav-pane-fill: var(--AcrylicInAppFillColorDefaultBrush, var(--host-nav-pane-bg));
    background: var(--win-nav-pane-fill);
    -webkit-backdrop-filter: var(--flyout-backdrop);
    backdrop-filter: var(--flyout-backdrop);
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16);
  }

  .win-nav-shell.is-left-compact > .win-nav-left-panel:not(.is-compact)::before,
  html.winui-webview-host .win-nav-shell.is-overlay-left.is-left-compact > .win-nav-left-panel:not(.is-compact)::before {
    content: none;
  }

  .win-nav-shell.is-left-minimal > .win-nav-left-panel > .win-nav-pane-surface {
    --win-nav-pane-fill: var(--AcrylicInAppFillColorDefaultBrush, var(--host-nav-pane-bg));
    background: var(--win-nav-pane-fill);
    -webkit-backdrop-filter: var(--flyout-backdrop);
    backdrop-filter: var(--flyout-backdrop);
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
