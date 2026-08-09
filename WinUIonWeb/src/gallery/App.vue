<template>
  <!-- 对应官方 WinUIGallery/MainWindow.xaml(.cs)：Gallery 主窗口壳（TitleBar + NavigationView + 搜索 + 页面导航） -->
  <WinToolTipService />
  <Teleport to="body">
    <div v-if="isNavigationFrozen" class="gallery-navigation-freeze" aria-hidden="true"></div>
  </Teleport>
  <WinTitleBar
    ref="titleBarRef"
    class="gallery-titlebar"
    :class="{ 'is-uwp-webview': isHostedInUwpWebView }"
    :Title="t('app.title')"
    PreferredHeightOption="Tall"
    :IsBackButtonVisible="canGoBack"
    :IsPaneToggleButtonVisible="!isTopNavMode"
    TitleBarContentHorizontalAlignment="Stretch"
    :IconSource="appIcon"
    @BackRequested="onBackRequested"
    @PaneToggleRequested="onTopBarToggle">
    <WinAutoSuggestBox
      ref="searchBoxRef"
      v-model:Text="searchQuery"
      :ItemsSource="searchResults"
      TextMemberPath="title"
      :PlaceholderText="t('search.placeholder')"
      QueryIcon="Find"
      :OpenOnFocus="false"
      class="gallery-titlebar-search"
      @QuerySubmitted="onSearchQuerySubmitted" />
    <button
      type="button"
      class="gallery-titlebar-search-button"
      :aria-label="t('text.submit-query')"
      v-bind="{ 'tooltipservice.tooltip': t('text.submit-query') }"
      @click="onCompactSearchButtonClick">
      <span class="gallery-titlebar-search-button-icon" aria-hidden="true">&#xE721;</span>
    </button>
  </WinTitleBar>
  <div class="gallery-app-content" :class="{ 'has-titlebar': isHostedInUwpWebView, 'wco-titlebar': !isHostedInUwpWebView }">
    <div class="gallery-nav-host">
      <WinNavigationView :SelectedItem="selectedNavigationItem"
                       :PaneDisplayMode="navPosition"
                       :MenuItems="navMenuItems"
                       :FooterMenuItems="[]"
                       v-model:IsPaneOpen="isPaneOpen"
                       IsBackButtonVisible="Collapsed"
                       :IsPaneToggleButtonVisible="false"
                       :IsBackEnabled="canGoBack"
                       :IsNavigationPending="isNavigationFrozen"
                       @ItemInvoked="onNavigationItemInvoked"
                       @BackRequested="onBackRequested">
        <router-view v-slot="{ Component }">
          <Transition
            appear
            :enter-active-class="pageTransitionEnter"
            :leave-active-class="pageTransitionLeave">
            <div
              v-if="Component"
              :key="route.fullPath"
              class="page-view active"
              :class="{ 'has-page-header': currentPage !== 'home' && currentPage !== 'settings' && currentPage !== 'search' }">
              <WinPageHeader
                v-if="currentPage !== 'home' && currentPage !== 'settings' && currentPage !== 'search'"
                :Item="currentPageItem"
                :PageName="pageName"
                :CopyLinkAction="copyCurrentPageLink"
                :ToggleThemeAction="toggleCurrentPageTheme" />
              <component :is="Component" />
            </div>
          </Transition>
        </router-view>
      </WinNavigationView>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="compactSearchOpen"
      ref="compactSearchRef"
      class="gallery-compact-search-popup"
      role="search">
      <WinAutoSuggestBox
        ref="compactSearchBoxRef"
        v-model:Text="searchQuery"
        :ItemsSource="searchResults"
        TextMemberPath="title"
        :PlaceholderText="t('search.placeholder')"
        QueryIcon="Find"
        :OpenOnFocus="false"
        class="gallery-compact-search"
        @QuerySubmitted="onSearchQuerySubmitted" />
    </div>
  </Teleport>
</template>

<script setup>
import { nextTick, ref, watch, provide, computed, onMounted, onBeforeUnmount } from 'vue';
import WinTitleBar from '../components/WinTitleBar.vue';
import WinNavigationView from '../components/WinNavigationView.vue';
import WinToolTipService from '../components/WinToolTipService.vue';
import WinAutoSuggestBox from '../components/WinAutoSuggestBox.vue';
import WinPageHeader from './components/WinPageHeader.vue';
import appIcon from '../assets/AppIcon.ico';
import { useRoute, useRouter } from 'vue-router';
import { pageTags } from './router';
import { searchAll } from './searchIndex';

import { useI18n } from '../components/i18n/index';
import {
  DefaultNavigationTransitionInfo,
  NavigationTrigger_BackNavigatingAway,
  NavigationTrigger_BackNavigatingTo,
  NavigationTrigger_NavigatingAway,
  NavigationTrigger_NavigatingTo,
  getNavigationTransitionInfoClassName,
  normalizeNavigationTransitionInfo,
  parseNavigationTransitionInfo,
  stringifyNavigationTransitionInfo
} from '../utils/navigationTransitionInfo';

const { t, locale } = useI18n();

const titleBarRef = ref(null);
const searchBoxRef = ref(null);
const compactSearchOpen = ref(false);
const compactSearchRef = ref(null);
const compactSearchBoxRef = ref(null);
const titlebarCompact = computed(() => Boolean(titleBarRef.value?.isCompact));
const titlebarNarrow = computed(() => Boolean(titleBarRef.value?.isNarrow));
const searchQuery = ref('');
const searchResults = computed(() => {
  const query = searchQuery.value.trim();
  const items = searchAll(searchQuery.value, locale);
  if (query !== '' && items.length === 0) {
    return [{ title: t('text.no-results-found'), tag: '', noResults: true }];
  }
  return items.map((item) => ({
    title: locale === 'zh-CN' ? item.zh : item.en,
    tag: item.tag
  }));
});

const readStoredSetting = (key, fallback, allowedValues) => {
  const value = localStorage.getItem(key);
  return allowedValues.includes(value) ? value : fallback;
};

const readStoredNavigationTransitionInfo = () => parseNavigationTransitionInfo(
  localStorage.getItem('winui-navigation-transition-info'),
  DefaultNavigationTransitionInfo
);

const persistSetting = (key, source) => {
  watch(source, (value) => {
    localStorage.setItem(key, value);
  }, { immediate: true });
};

const persistNavigationTransitionInfo = (source) => {
  watch(source, (value) => {
    localStorage.setItem('winui-navigation-transition-info', stringifyNavigationTransitionInfo(value));
  }, { immediate: true });
};

const route = useRoute();
const router = useRouter();
const currentPage = computed(() => (typeof route.name === 'string' ? route.name : 'home'));
const navPosition = ref(readStoredSetting('winui-nav-position', 'Auto', ['Auto', 'Top', 'Left', 'LeftCompact', 'LeftMinimal']));
const isTopNavMode = computed(() => navPosition.value === 'Top');
const isPaneOpen = ref(true);
const themeSetting = ref(readStoredSetting('winui-theme-setting', 'system', ['system', 'light', 'dark']));
const materialSetting = ref(readStoredSetting('winui-material-setting', 'mica', ['mica', 'acrylic']));
const navigationTransitionInfo = ref(readStoredNavigationTransitionInfo());
const pageTransitionEnter = ref(getNavigationTransitionInfoClassName(navigationTransitionInfo.value, NavigationTrigger_NavigatingTo));
const pageTransitionLeave = ref(getNavigationTransitionInfoClassName(navigationTransitionInfo.value, NavigationTrigger_NavigatingAway));
const isHostedInUwpWebView = ref(
  typeof window !== 'undefined' && Boolean(window.__WINUI_ON_WEB_UWP_APP__)
);
const canGoBack = ref(Boolean(router.options.history.state?.back));
const isNavigationFrozen = ref(false);
let navigationReleaseSequence = 0;
let navigationReleaseFrame = null;

const freezeNavigation = () => {
  navigationReleaseSequence += 1;
  if (navigationReleaseFrame) cancelAnimationFrame(navigationReleaseFrame);
  navigationReleaseFrame = null;
  isNavigationFrozen.value = true;
};

const releaseNavigation = () => {
  const sequence = ++navigationReleaseSequence;
  if (navigationReleaseFrame) cancelAnimationFrame(navigationReleaseFrame);
  void nextTick(() => {
    navigationReleaseFrame = requestAnimationFrame(() => {
      if (sequence === navigationReleaseSequence) {
        isNavigationFrozen.value = false;
        navigationReleaseFrame = null;
      }
    });
  });
};

const syncNavigationFreezeState = (frozen) => {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;
  appRoot.toggleAttribute('inert', frozen);
  if (frozen) appRoot.setAttribute('aria-busy', 'true');
  else appRoot.removeAttribute('aria-busy');
};

watch(isNavigationFrozen, syncNavigationFreezeState, { flush: 'post' });

const removeNavigationBeforeEach = router.beforeEach(() => {
  freezeNavigation();
});

const removeNavigationAfterEach = router.afterEach((to, from, failure) => {
  if (failure) {
    releaseNavigation();
    return;
  }
  const historyState = router.options.history.state;
  const isBack = historyState?.forward === from.fullPath;
  const NavigationTrigger = isBack
    ? NavigationTrigger_BackNavigatingTo
    : NavigationTrigger_NavigatingTo;
  const NavigationLeaveTrigger = isBack
    ? NavigationTrigger_BackNavigatingAway
    : NavigationTrigger_NavigatingAway;
  pageTransitionEnter.value = getNavigationTransitionInfoClassName(navigationTransitionInfo.value, NavigationTrigger);
  pageTransitionLeave.value = getNavigationTransitionInfoClassName(navigationTransitionInfo.value, NavigationLeaveTrigger);
  canGoBack.value = Boolean(historyState?.back);
  releaseNavigation();
});

const removeNavigationErrorHandler = router.onError(() => releaseNavigation());

provide('themeSetting', themeSetting);
provide('materialSetting', materialSetting);
provide('navigationTransitionInfo', navigationTransitionInfo);
provide('navPosition', navPosition);
provide('currentPage', currentPage);
provide('isHostedInUwpWebView', isHostedInUwpWebView);

const navMenuItems = [
  { Tag: 'home', Icon: '\uE80F', Content: t('text.home') },
  { Tag: 'buttons', Icon: '\uE73A', Content: t('text.basic-input'), SelectsOnInvoked: false, MenuItems: [
    { Tag: 'button', Icon: '\uE71A', Content: t('text.button') },
    { Tag: 'dropdownbutton', Icon: '\uE70D', Content: t('text.dropdownbutton') },
    { Tag: 'hyperlinkbutton', Icon: '\uE71B', Content: t('text.hyperlinkbutton') },
    { Tag: 'repeatbutton', Icon: '\uE8AB', Content: t('text.repeatbutton') },
    { Tag: 'togglebutton', Icon: '\uEF1F', Content: t('text.togglebutton') },
    { Tag: 'splitbutton', Icon: '\uE90D', Content: t('text.splitbutton') },
    { Tag: 'togglesplitbutton', Icon: '\uE90D', Content: t('text.togglesplitbutton') },
    { Tag: 'checkbox', Icon: '\uE73D', Content: t('text.checkbox') },
    { Tag: 'colorpicker', Icon: '\uEF3C', Content: t('text.colorpicker') },
    { Tag: 'combobox', Icon: '\uE7FB', Content: t('text.combobox') },
    { Tag: 'radiobutton', Icon: '\uECCB', Content: t('text.radiobuttons') },
    { Tag: 'rating', Icon: '\uE734', Content: t('text.ratingcontrol') },
    { Tag: 'slider', Icon: '\uE9E9', Content: t('text.slider') },
    { Tag: 'toggleswitch', Icon: '\uF19F', Content: t('text.toggleswitch') }
  ]},
  { Tag: 'collections', Icon: '\uE80A', Content: t('text.collections'), SelectsOnInvoked: false, MenuItems: [
    { Tag: 'flipview', Icon: '\uF1CB', Content: t('text.flipview') },
    { Tag: 'gridview', Icon: '\uF0E2', Content: t('text.gridview') },
    { Tag: 'itemsrepeater', Icon: '\uE8FD', Content: t('text.itemsrepeater') },
    { Tag: 'itemsview', Icon: '\uF0E2', Content: t('text.itemsview') },
    { Tag: 'listview', Icon: '\uE8FD', Content: t('text.listview') },
    { Tag: 'pulltorefresh', Icon: '\uE72C', Content: t('text.pulltorefresh') },
    { Tag: 'treeview', Icon: '\uED41', Content: t('text.treeview') }
  ]},
  {
    Tag: 'dateandtime', Icon: '\uEC92', Content: t('text.date-and-time'), SelectsOnInvoked: false, MenuItems: [
      { Tag: 'calendardatepicker', Icon: '\uE787', Content: t('text.calendardatepicker') },
      { Tag: 'calendarview', Icon: '\uF763', Content: t('text.calendarview') },
      { Tag: 'datepicker', Icon: '\uE8BF', Content: t('text.datepicker') },
      { Tag: 'timepicker', Icon: '\uE823', Content: t('text.timepicker') }
    ]
  },
  { Tag: 'dialogsandflyouts', Icon: '\uE15F', Content: t('text.dialogs-and-flyouts'), SelectsOnInvoked: false, MenuItems: [
    { Tag: 'contentdialog', Icon: '\uE8F2', Content: t('text.contentdialog') },
    { Tag: 'flyout', Icon: '\uE8A8', Content: t('text.flyout') },
    { Tag: 'popup', Icon: '\uE7C4', Content: t('text.popup') },
    { Tag: 'teachingtip', Icon: '\uEC42', Content: t('text.teachingtip') }
  ]},
  { Tag: 'layout', Icon: '\uE8A1', Content: t('text.layout'), SelectsOnInvoked: false, MenuItems: [
    { Tag: 'border', Icon: '\uE8A1', Content: t('text.border') },
    { Tag: 'canvas', Icon: '\uE7C3', Content: t('text.canvas') },
    { Tag: 'expander', Icon: '\uE8C4', Content: t('text.expander') },
    { Tag: 'grid', Icon: '\uECA5', Content: t('text.grid') },
    { Tag: 'relativepanel', Icon: '\uE8A1', Content: t('text.relativepanel') },
    { Tag: 'splitview', Icon: '\uE8BC', Content: t('text.splitview') },
    { Tag: 'stackpanel', Icon: '\uE8FD', Content: t('text.stackpanel') },
    { Tag: 'variablesizedwrapgrid', Icon: '\uE8A9', Content: t('text.variablesizedwrapgrid') },
    { Tag: 'viewbox', Icon: '\uE8A7', Content: t('text.viewbox') }
  ]},
  { Tag: 'media', Icon: '\uE173', Content: t('text.media'), SelectsOnInvoked: false, MenuItems: [
    { Tag: 'captureelement', Icon: '\uE722', Content: t('text.capture-element-camera') },
    { Tag: 'image', Icon: '\uE8B9', Content: t('text.image') },
    { Tag: 'mediaplayerelement', Icon: '\uE714', Content: t('text.mediaplayerelement') },
    { Tag: 'personpicture', Icon: '\uE77B', Content: t('text.personpicture') }
  ]},
  { Tag: 'menusandtoolbars', Icon: '\uE74E', Content: t('text.menus-and-toolbars'), SelectsOnInvoked: false, MenuItems: [
    { Tag: 'appbarbutton', Icon: '\uE76F', Content: t('text.appbarbutton') },
    { Tag: 'appbarseparator', Icon: '\uF464', Content: t('text.appbarseparator') },
    { Tag: 'toggleappbarbutton', Icon: '\uE76F', Content: t('text.appbar-toggle-button') },
    { Tag: 'commandbar', Icon: '\uE76F', Content: t('text.commandbar') },
    { Tag: 'commandbarflyout', Icon: '\uF0E2', Content: t('text.commandbarflyout') },
    { Tag: 'menubar', Icon: '\uE76F', Content: t('text.menubar') },
    { Tag: 'menuflyout', Icon: '\uF0E2', Content: t('text.menuflyout') },
    { Tag: 'swipecontrol', Icon: '\uE927', Content: t('text.swipecontrol') },
    { Tag: 'standarduicommand', Icon: '\uE756', Content: t('text.standarduicommand') },
    { Tag: 'xamluicommand', Icon: '\uE756', Content: t('text.xamluicommand') }
  ]},
  { Tag: 'motion', Icon: '\uE945', Content: t('text.motion'), SelectsOnInvoked: false, MenuItems: [
    { Tag: 'parallaxview', Icon: '\uE7F4', Content: t('text.parallaxview') }
  ]},
  { Tag: 'navigation', Icon: '\uE700', Content: t('text.navigation'), SelectsOnInvoked: false, MenuItems: [
    { Tag: 'breadcrumbbar', Icon: '\uE76C', Content: t('text.breadcrumbbar') },
    { Tag: 'navigationview', Icon: '\uE700', Content: t('text.navigationview') },
    { Tag: 'pivot', Icon: '\uE8F9', Content: t('text.pivot') },
    { Tag: 'selectorbar', Icon: '\uE8AB', Content: t('text.selectorbar') }
  ]},
  { Tag: 'scrolling', Icon: '\uE174', Content: t('text.scrolling'), SelectsOnInvoked: false, MenuItems: [
    { Tag: 'pipspager', Icon: '\uE712', Content: t('text.pipspager') },
    { Tag: 'scrollview', Icon: '\uECE7', Content: t('text.scrollview') },
    { Tag: 'scrollviewer', Icon: '\uEC8F', Content: t('text.scrollviewer') },
    { Tag: 'semanticzoom', Icon: '\uE773', Content: t('text.semanticzoom') }
  ]},
  { Tag: 'statusandinfo', Icon: '\uE8F2', Content: t('text.status-and-info'), SelectsOnInvoked: false, MenuItems: [
    { Tag: 'infobadge', Icon: '\uEDAF', Content: t('text.infobadge') },
    { Tag: 'infobar', Icon: '\uF167', Content: t('text.infobar') },
    { Tag: 'progressbar', Icon: '\uE76F', Content: t('text.progressbar') },
    { Tag: 'progressring', Icon: '\uF16A', Content: t('text.progressring') },
    { Tag: 'tooltip', Icon: '\uE946', Content: t('text.tooltip') }
  ]},
  { Tag: 'text', Icon: '\uE8D2', Content: t('text.text'), SelectsOnInvoked: false, MenuItems: [
    { Tag: 'autosuggestbox', Icon: '\uE721', Content: t('text.autosuggestbox') },
    { Tag: 'numberbox', Icon: '\uF261', Content: t('text.numberbox') },
    { Tag: 'passwordbox', Icon: '\uE7B3', Content: t('text.passwordbox') },
    { Tag: 'richeditbox', Icon: '\uE8D3', Content: t('text.richeditbox') },
    { Tag: 'richtextblock', Icon: '\uE8D2', Content: t('text.richtextblock') },
    { Tag: 'textblock', Icon: '\uE8E4', Content: t('text.textblock') },
    { Tag: 'textbox', Icon: '\uE8AC', Content: t('text.textbox') }
  ]}
];

const selectedNavigationItem = computed({
  get: () => {
    if (currentPage.value === 'settings') return { Tag: 'settings', Content: t('text.settings'), Icon: '\uE713' };
    const find = items => {
      for (const item of items) {
        if (item.Tag === currentPage.value) return item;
        const child = item.MenuItems?.find(entry => entry.Tag === currentPage.value);
        if (child) return child;
      }
      return items[0] ?? null;
    };
    return find(navMenuItems);
  },
  set: item => {
    if (item?.Tag) void navigate(item.Tag, navigationTransitionInfo.value);
  }
});

const pageSourceNames = {
  appbarbutton: 'AppBarButtonPage',
  appbarseparator: 'AppBarSeparatorPage',
  toggleappbarbutton: 'AppBarToggleButtonPage',
  commandbar: 'CommandBarPage',
  commandbarflyout: 'CommandBarFlyoutPage',
  listview: 'ListViewPage',
  menubar: 'MenuBarPage',
  menuflyout: 'MenuFlyoutPage',
  standarduicommand: 'StandardUICommandPage',
  swipecontrol: 'SwipeControlPage',
  xamluicommand: 'XamlUICommandPage',
  xamlresources: 'ResourcesPage',
  xamlstyles: 'StylePage',
  acrylic: 'AcrylicBrushPage',
  animatedicon: 'AnimatedIconPage',
  compactsizing: 'CompactSizingPage',
  iconelement: 'IconElementPage',
  radialgradientbrush: 'RadialGradientBrushPage',
  systembackdrops: 'SystemBackdrops(MicaAcrylic)Page',
  themeshadow: 'ThemeShadowPage',
  colors: 'ColorPage'
};

const pageName = computed(() => pageSourceNames[currentPage.value]
  || `${currentPage.value.charAt(0).toUpperCase()}${currentPage.value.slice(1)}Page`);

const currentPageItem = computed(() => {
  const selected = selectedNavigationItem.value;
  const selectedPage = selected?.Tag === currentPage.value ? selected : null;
  const pageSourceUri = `https://github.com/Furry-Xiyi/WinUIonWeb/tree/main/WinUIonWeb/src/gallery/pages/${pageName.value}.vue`;
  return {
    ...(selectedPage || {}),
    Title: selectedPage?.Content || t(`text.${currentPage.value}`),
    UniqueId: currentPage.value,
    ApiNamespace: selected?.ApiNamespace || '',
    BaseClasses: selected?.BaseClasses || [],
    Docs: selected?.Docs?.length ? selected.Docs : [{
      Title: 'WinUI on Web',
      Uri: 'https://github.com/Furry-Xiyi/WinUIonWeb/'
    }],
    SourceLink: 'https://github.com/Furry-Xiyi/WinUIonWeb/',
    PageMarkupUri: pageSourceUri,
    PageCodeUri: pageSourceUri
  };
});

const copyCurrentPageLink = () => {
  const url = new URL(window.location.href);
  url.hash = currentPage.value;
  void navigator.clipboard?.writeText(url.toString());
};

const toggleCurrentPageTheme = () => {
  window.dispatchEvent(new CustomEvent('win-gallery-theme-toggle', { detail: currentPage.value }));
};

const navigateToRoute = async (location, prepareTransition = null) => {
  if (isNavigationFrozen.value) return false;

  let target;
  try {
    target = router.resolve(location);
  } catch (error) {
    console.error('Unable to resolve navigation target.', error);
    return false;
  }
  if (target.fullPath === route.fullPath) return false;

  const previousTransition = {
    enter: pageTransitionEnter.value,
    leave: pageTransitionLeave.value
  };
  prepareTransition?.();
  freezeNavigation();

  try {
    const failure = await router.push(location);
    if (failure) {
      pageTransitionEnter.value = previousTransition.enter;
      pageTransitionLeave.value = previousTransition.leave;
      return false;
    }
    return true;
  } catch (error) {
    pageTransitionEnter.value = previousTransition.enter;
    pageTransitionLeave.value = previousTransition.leave;
    console.error('Navigation failed.', error);
    return false;
  } finally {
    releaseNavigation();
  }
};

const navigate = async (
  tag,
  NavigationTransitionInfo = navigationTransitionInfo.value,
  NavigationTrigger = NavigationTrigger_NavigatingTo
) => {
  if (!tag || tag === currentPage.value || !pageTags.has(tag)) return false;
  return navigateToRoute({ name: tag }, () => {
    const normalizedNavigationTransitionInfo = normalizeNavigationTransitionInfo(NavigationTransitionInfo);
    const NavigationLeaveTrigger = NavigationTrigger === NavigationTrigger_BackNavigatingTo
      ? NavigationTrigger_BackNavigatingAway
      : NavigationTrigger_NavigatingAway;
    pageTransitionEnter.value = getNavigationTransitionInfoClassName(normalizedNavigationTransitionInfo, NavigationTrigger);
    pageTransitionLeave.value = getNavigationTransitionInfoClassName(normalizedNavigationTransitionInfo, NavigationLeaveTrigger);
  });
};
provide('navigate', navigate);
const onNavigationItemInvoked = args => {
  const item = args?.InvokedItemContainer;
  if (!item || item.SelectsOnInvoked === false) return;
  const tag = item.Tag;
  if (tag) void navigate(tag, navigationTransitionInfo.value);
};
const onBackRequested = () => {
  if (!canGoBack.value || isNavigationFrozen.value) return;
  freezeNavigation();
  router.back();
};
const onTopBarToggle = () => {
  isPaneOpen.value = !isPaneOpen.value;
};
const onCompactSearchButtonClick = () => {
  compactSearchOpen.value = !compactSearchOpen.value;
  if (compactSearchOpen.value) {
    void nextTick(() => {
      compactSearchRef.value?.querySelector('input')?.focus({ preventScroll: true });
    });
  }
};
const onDocumentClickForCompactSearch = (event) => {
  const target = event.target;
  if (target?.closest?.('.gallery-titlebar-search-button')) return;
  if (compactSearchRef.value?.contains(target)) return;
  if (target?.closest?.('.win-asb-popup, .win-menu-flyout-wrap')) return;
  compactSearchOpen.value = false;
};
const onDocumentPointerDownForCompactSearch = (event) => {
  const target = event.target;
  if (target?.closest?.('.gallery-titlebar-search-button')) return;
  if (!compactSearchOpen.value) return;
  if (compactSearchRef.value?.contains(target)) return;
  if (target?.closest?.('.win-asb-popup, .win-menu-flyout-wrap')) return;
  // Let a suggestion's click handler finish before v-if removes the popup.
  window.setTimeout(() => {
    compactSearchOpen.value = false;
  }, 0);
};
const onDocumentKeydownForCompactSearch = (event) => {
  if (event.key === 'Escape') compactSearchOpen.value = false;
};
const onWindowBlurForCompactSearch = () => {
  compactSearchOpen.value = false;
};
const onDocumentVisibilityChangeForCompactSearch = () => {
  if (document.visibilityState !== 'visible') compactSearchOpen.value = false;
};
const onDocumentFocusOutForCompactSearch = (event) => {
  if (!compactSearchOpen.value) return;
  const target = event.target;
  const relatedTarget = event.relatedTarget;
  if (!compactSearchRef.value?.contains(target)) return;
  if (compactSearchRef.value?.contains(relatedTarget)) return;
  if (relatedTarget?.closest?.('.win-asb-popup, .win-menu-flyout-wrap')) return;
  compactSearchOpen.value = false;
};
const onSearchQuerySubmitted = ({ QueryText, ChosenSuggestion }) => {
  compactSearchOpen.value = false;
  const query = String(QueryText ?? '').trim();
  if (!query) return;
  if (ChosenSuggestion?.tag && pageTags.has(ChosenSuggestion.tag)) {
    void navigate(ChosenSuggestion.tag, navigationTransitionInfo.value);
    return;
  }
  const items = searchAll(query, locale);
  if (items.length === 0) {
    void navigateToRoute({ path: '/search', query: { q: query } });
    return;
  }
  const nameKey = locale === 'zh-CN' ? 'zh' : 'en';
  const lower = query.toLowerCase();
  const exact = items.find((item) => (
    item.tag.toLowerCase() === lower || item[nameKey].toLowerCase() === lower
  ));
  void navigate((exact ?? items[0]).tag, navigationTransitionInfo.value);
};
const focusSearchBox = () => {
  if (titlebarNarrow.value || titlebarCompact.value) {
    if (!compactSearchOpen.value) compactSearchOpen.value = true;
    void nextTick(() => {
      compactSearchRef.value?.querySelector('input')?.focus({ preventScroll: true });
    });
  } else {
    searchBoxRef.value?.$el?.querySelector('input')?.focus({ preventScroll: true });
  }
};
const onWindowKeydown = (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') {
    event.preventDefault();
    focusSearchBox();
  }
};
const onWindowResize = () => {
  void nextTick(() => {
    const titleBarElement = titleBarRef.value?.$el;
    const searchElement = titleBarElement?.querySelector('.gallery-titlebar-search');
    const searchVisible = searchElement && getComputedStyle(searchElement).display !== 'none';
    if ((!titlebarNarrow.value && !titlebarCompact.value) || searchVisible) {
      compactSearchOpen.value = false;
    }
  });
};

function applyTheme(mode) {
  const html = document.documentElement;
  html.classList.remove('theme-light', 'theme-dark');
  if (mode === 'light') html.classList.add('theme-light');
  else if (mode === 'dark') html.classList.add('theme-dark');
}

watch(themeSetting, (val) => applyTheme(val), { immediate: true });
persistSetting('winui-nav-position', navPosition);
persistSetting('winui-theme-setting', themeSetting);
persistSetting('winui-material-setting', materialSetting);
persistNavigationTransitionInfo(navigationTransitionInfo);

const updateThemeColor = () => {
  const mode = themeSetting.value;
  const isDark = mode === 'dark' || (
    mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const color = isDark ? '#202020' : '#f3f3f3';
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', color);
};
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
const onSystemThemeChange = () => {
  if (themeSetting.value === 'system') updateThemeColor();
};
watch(themeSetting, () => updateThemeColor(), { immediate: true });
systemThemeQuery.addEventListener('change', onSystemThemeChange);

function postUwpSetting(key, value) {
  if (!isHostedInUwpWebView.value || !window.chrome?.webview?.postMessage) return;
  window.chrome.webview.postMessage({
    source: 'WinUIonWeb',
    type: 'appSettingChanged',
    key,
    value
  });
}

onMounted(() => {
  // WebView2 exposes window.chrome.webview in every host. Only the explicit
  // marker identifies the UWP host that owns the custom title bar.
  isHostedInUwpWebView.value = Boolean(window.__WINUI_ON_WEB_UWP_APP__);
  syncNavigationFreezeState(isNavigationFrozen.value);
  window.addEventListener('keydown', onWindowKeydown);
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('blur', onWindowBlurForCompactSearch);
  document.addEventListener('visibilitychange', onDocumentVisibilityChangeForCompactSearch);
  postUwpSetting('theme', themeSetting.value);
  postUwpSetting('material', materialSetting.value);
  postUwpSetting('NavigationTransitionInfo', stringifyNavigationTransitionInfo(navigationTransitionInfo.value));
});

onBeforeUnmount(() => {
  if (navigationReleaseFrame) cancelAnimationFrame(navigationReleaseFrame);
  removeNavigationBeforeEach();
  removeNavigationAfterEach();
  removeNavigationErrorHandler();
  document.getElementById('app')?.removeAttribute('inert');
  document.getElementById('app')?.removeAttribute('aria-busy');
  document.removeEventListener('click', onDocumentClickForCompactSearch, true);
  document.removeEventListener('keydown', onDocumentKeydownForCompactSearch);
  systemThemeQuery.removeEventListener('change', onSystemThemeChange);
  window.removeEventListener('keydown', onWindowKeydown);
  window.removeEventListener('resize', onWindowResize);
  window.removeEventListener('blur', onWindowBlurForCompactSearch);
  document.removeEventListener('visibilitychange', onDocumentVisibilityChangeForCompactSearch);
  document.removeEventListener('focusout', onDocumentFocusOutForCompactSearch, true);
});

watch(themeSetting, (value) => postUwpSetting('theme', value));
watch(materialSetting, (value) => postUwpSetting('material', value));
watch(navigationTransitionInfo, (value) => postUwpSetting('NavigationTransitionInfo', stringifyNavigationTransitionInfo(value)));
watch(compactSearchOpen, (open) => {
  if (open) {
    document.addEventListener('pointerdown', onDocumentPointerDownForCompactSearch, true);
    document.addEventListener('click', onDocumentClickForCompactSearch, true);
    document.addEventListener('focusout', onDocumentFocusOutForCompactSearch, true);
    document.addEventListener('keydown', onDocumentKeydownForCompactSearch);
  } else {
    document.removeEventListener('pointerdown', onDocumentPointerDownForCompactSearch, true);
    document.removeEventListener('click', onDocumentClickForCompactSearch, true);
    document.removeEventListener('focusout', onDocumentFocusOutForCompactSearch, true);
    document.removeEventListener('keydown', onDocumentKeydownForCompactSearch);
  }
});
watch(titlebarNarrow, (narrow) => {
  if (!narrow) compactSearchOpen.value = false;
});
watch(titlebarCompact, (compact) => {
  if (!compact) compactSearchOpen.value = false;
});
</script>

<style>
  @import '../styles/theme.css';
  @import '../styles/animations.css';

  .gallery-navigation-freeze {
    position: fixed;
    inset: 0;
    z-index: 2147483646;
    cursor: progress;
    touch-action: none;
  }

  .gallery-app-content {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .gallery-nav-host {
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    display: flex;
  }

  .gallery-nav-host > .win-nav-shell {
    width: 100%;
    height: 100%;
  }

  .gallery-app-content.has-titlebar {
    /* WebView2 does not expose titlebar-area-height. WinTitleBar with the
       search content uses the expanded 48px template height in that host. */
    --gallery-titlebar-height: max(env(titlebar-area-height, 0px), 46px);
    height: calc(100% - var(--gallery-titlebar-height));
    margin-top: var(--gallery-titlebar-height);
  }

  .gallery-app-content.wco-titlebar {
    box-sizing: border-box;
    padding-top: max(env(titlebar-area-height, 0px), 48px);
  }

  .gallery-titlebar-search {
    width: 100%;
    max-width: 350px;
  }

  /* The UWP WebView host owns the caption buttons outside the web content.
     Its browser shell does not expose AppWindow.TitleBar.RightInset, so keep
     the standard three-button 138px inset. WinTitleBar already reserves the
     official 48px minimum drag region beside it (186px total). */
  .gallery-titlebar.is-uwp-webview {
    --TitleBarRightPaddingWidth: 138px;
  }

  /* 搜索框在标题右侧的内容列内居中；内容列会随窗口收缩，
     不会像绝对居中那样盖住左侧的图标和标题。 */
  .gallery-titlebar .win-titlebar-content {
    position: static;
    overflow: visible;
  }

  /* 标题栏实际宽度过窄时优先保留标题，隐藏搜索框；
     由 WinTitleBar 根据自身宽度添加 is-narrow，不依赖视口媒体查询，
     这样 PWA overlay / WebView2 中标题栏区域比视口窄时也能生效。 */
  .gallery-titlebar.is-narrow .gallery-titlebar-search,
  .gallery-titlebar.is-compact .gallery-titlebar-search {
    display: none !important;
  }

  /* 窄标题栏时标题后的搜索按钮：样式与返回/汉堡按钮保持一致 */
  .gallery-titlebar-search-button {
    display: none;
    box-sizing: border-box;
    width: 40px;
    margin: 2px;
    padding: 0;
    border: 0;
    border-radius: var(--ControlCornerRadius, 4px);
    flex: 0 0 auto !important;
    align-self: stretch;
    align-items: center;
    justify-content: center;
    color: var(--TitleBarForegroundBrush, var(--text-primary));
    background: var(--TitleBarBackButtonBackground, transparent);
    cursor: pointer;
    font-family: var(--SymbolThemeFontFamily, 'WinUIOnWebIcons');
    font-size: 16px;
    transition: background var(--fast-duration) var(--fast-out-slow-in), color var(--fast-duration) var(--fast-out-slow-in);
  }

  .gallery-titlebar.is-narrow .gallery-titlebar-search-button,
  .gallery-titlebar.is-compact .gallery-titlebar-search-button {
    display: flex;
  }

  .gallery-titlebar-search-button:hover {
    background: var(--TitleBarBackButtonBackgroundPointerOver, var(--subtle-secondary));
  }

  .gallery-titlebar-search-button:active {
    background: var(--TitleBarBackButtonBackgroundPressed, var(--subtle-tertiary));
    color: var(--text-secondary);
  }

  .gallery-titlebar-search-button-icon {
    width: 16px;
    height: 16px;
    font-size: 16px;
    line-height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 窄标题栏时内容列左对齐，让搜索按钮紧跟标题 */
  .gallery-titlebar.is-narrow .win-titlebar-content,
  .gallery-titlebar.is-compact .win-titlebar-content {
    justify-content: flex-start;
    padding: var(--TitleBarCompactContentMargin, 0 16px 0 0);
  }

  /* 弹出的单个搜索框：位于标题栏下方，距视口左侧 16px */
  .gallery-compact-search-popup {
    position: fixed;
    top: max(env(titlebar-area-height, 0px), 48px);
    left: 16px;
    width: min(350px, calc(100vw - 32px));
    z-index: 10000;
  }

  .gallery-compact-search {
    width: 100%;
  }

  /* The compact title-bar search is the only Gallery search surface that
     uses an Acrylic input fill. Replace WinTextBox's normal translucent
     control layer in every interaction state so it does not stack over the
     Acrylic backdrop. */
  .gallery-compact-search.win-auto-suggest-box .win-textbox {
    --textbox-background: var(--AcrylicInAppFillColorDefaultBrush);
    --textbox-background-pointer-over: var(--AcrylicInAppFillColorDefaultBrush);
    --textbox-background-pressed: var(--AcrylicInAppFillColorDefaultBrush);
    --textbox-background-focused: var(--AcrylicInAppFillColorDefaultBrush);
    isolation: isolate;
  }

  .gallery-compact-search.win-auto-suggest-box .win-textbox-border {
    -webkit-backdrop-filter: var(--flyout-backdrop);
    backdrop-filter: var(--flyout-backdrop);
  }

  @font-face {
    font-family: 'WinUIOnWebIcons';
    src: url('../assets/Fonts/SEGOEICONS.TTF') format('truetype');
    font-display: block;
  }

  body .icon,
  body .icon-btn,
  body .ptr-icon-wrapper,
  body .symbol-icon,
  body .win-symbol-icon,
  body .win-asb-icon,
  body .picker-icon,
  body .checkbox-glyph,
  body .win-combo-chevron,
  body .win-cbf-icon,
  body .win-cbf-overflow-icon,
  body .win-expander-header-icon,
  body .win-expander-arrow,
  body .infobadge-icon,
  body .close-icon,
  body .win-menu-flyout-icon,
  body .win-menu-flyout-check,
  body .win-menu-flyout-check-placeholder,
  body .win-menu-flyout-chevron,
  body .win-number-spin-button span,
  body .win-number-compact-indicator span,
  body .win-number-popup-button span,
  body .win-password-reveal span,
  body .win-rating-glyph,
  body .scrollbar-button,
  body .win-settings-card-icon,
  body .win-settings-card-action-icon,
  body .win-teaching-tip-icon,
  body .win-teaching-tip-close,
  body .win-textbox-delete-glyph,
  body .font-icon,
  body .icon-glyph,
  body .icon-preview-glyph,
  body .group-icon,
  body .tree-icon {
    font-family: 'WinUIOnWebIcons';
  }

  .page-header {
    font-size: 28px;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 24px;
    color: var(--text-primary);
  }

  .control-example-description {
    margin: 28px 0 -4px 0;
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }

  .basic-input-example-theme:has(.example-display[data-theme='light']) .example-container {
    color-scheme: light;
    --text-primary: rgba(0, 0, 0, 0.89);
    --text-secondary: rgba(0, 0, 0, 0.62);
    --text-tertiary: rgba(0, 0, 0, 0.45);
    --text-disabled: rgba(0, 0, 0, 0.36);
    --SystemControlForegroundBaseMediumBrush: rgba(0, 0, 0, 0.60);
    --SystemControlHighlightAltBaseMediumHighBrush: rgba(0, 0, 0, 0.80);
    --SystemControlHighlightAltBaseHighBrush: #000000;
    --SystemControlDisabledBaseMediumLowBrush: rgba(0, 0, 0, 0.40);
    --layer-default: rgba(255, 255, 255, 0.50);
    --card-bg: rgba(255, 255, 255, 0.70);
    --card-bg-secondary: rgba(246, 246, 246, 0.50);
    --card-stroke: rgba(0, 0, 0, 0.06);
    --stroke-divider: rgba(0, 0, 0, 0.06);
    --NavigationViewItemSeparatorForeground: var(--stroke-divider);
    --stroke-surface-flyout: rgba(0, 0, 0, 0.06);
    --flyout-bg: rgba(252, 252, 252, 0.92);
    --flyout-backdrop: blur(30px) saturate(160%) brightness(1.02);
    --ctrl-fill-default: rgba(255, 255, 255, 0.70);
    --ctrl-fill-secondary: rgba(249, 249, 249, 0.50);
    --ctrl-fill-tertiary: rgba(249, 249, 249, 0.30);
    --ctrl-fill-disabled: rgba(249, 249, 249, 0.30);
    --ctrl-fill-input-active: #FFFFFF;
    --control-fill-color-default: var(--ctrl-fill-default);
    --control-fill-color-secondary: var(--ctrl-fill-secondary);
    --control-fill-color-tertiary: var(--ctrl-fill-tertiary);
    --control-fill-color-disabled: var(--ctrl-fill-disabled);
    --control-fill-color-input-active: var(--ctrl-fill-input-active);
    --control-fill-input-active: var(--ctrl-fill-input-active);
    --ctrl-solid-fill: #FFFFFF;
    --ctrl-border: rgba(0, 0, 0, 0.06);
    --ctrl-border-rest: rgba(0, 0, 0, 0.06);
    --ctrl-border-accent: rgba(0, 0, 0, 0.16);
    --control-stroke-color-default: var(--ctrl-border-rest);
    --control-strong-stroke-color-default: rgba(0, 0, 0, 0.45);
    --ctrl-strong-fill: rgba(0, 0, 0, 0.45);
    --ctrl-strong-stroke: rgba(0, 0, 0, 0.45);
    --ctrl-strong-stroke-disabled: rgba(0, 0, 0, 0.22);
    --ctrl-elevation-top: rgba(255, 255, 255, 0.08);
    --ctrl-elevation-bottom: rgba(0, 0, 0, 0.16);
    --subtle-secondary: rgba(0, 0, 0, 0.04);
    --subtle-tertiary: rgba(0, 0, 0, 0.02);
    --subtle-pressed: rgba(0, 0, 0, 0.06);
    --accent-base: #0067C0;
    --accent-hover: rgba(0, 103, 192, 0.90);
    --accent-pressed: rgba(0, 103, 192, 0.80);
    --accent-aa-fill: #004E8C;
    --accent-aa-text: #FFFFFF;
    --accent-fill-disabled: rgba(0, 0, 0, 0.22);
    --accent-text: #FFFFFF;
    --accent-text-secondary: rgba(255, 255, 255, 0.70);
    --TextOnAccentFillColorPrimaryBrush: #FFFFFF;
    --TextOnAccentFillColorSecondaryBrush: rgba(255, 255, 255, 0.70);
    --accent-border: rgba(255, 255, 255, 0.08);
    --accent-border-accent: rgba(0, 0, 0, 0.40);
    --button-stroke: rgba(0, 0, 0, 0.06);
    --button-stroke-bottom: rgba(0, 0, 0, 0.16);
    --button-stroke-pressed: rgba(0, 0, 0, 0.06);
    --button-stroke-pressed-bottom: rgba(0, 0, 0, 0.06);
    --toggle-border: rgba(0, 0, 0, 0.45);
    --toggle-thumb: rgba(0, 0, 0, 0.61);
    --toggle-thumb-hover: rgba(0, 0, 0, 0.89);
    --toggle-on-thumb: #FFFFFF;
    --radio-border: rgba(0, 0, 0, 0.45);
    --system-accent-color-dark-1: var(--accent-base);
    --AccentFillColorDefaultBrush: #0067C0;
    --TextFillColorInverseBrush: #FFFFFF;
    --CardStrokeColorDefaultBrush: rgba(0, 0, 0, 0.06);
    --NavigationViewContentGridBorderBrush: #E5E5E5;
    --NavigationViewContentBackground: rgba(249, 249, 249, 0.50);
    --SystemFillColorAttentionBrush: #0067C0;
    --SystemFillColorSuccessBrush: #0F7B0F;
    --SystemFillColorCautionBrush: #9D5D00;
    --SystemFillColorCriticalBrush: #C42B1C;
    --SystemFillColorSolidNeutralBrush: #8A8A8A;
    --SystemFillColorAttentionBackgroundBrush: rgba(246, 246, 246, 0.50);
    --SystemFillColorSuccessBackgroundBrush: #DFF6DD;
    --SystemFillColorCautionBackgroundBrush: #FFF4CE;
    --SystemFillColorCriticalBackgroundBrush: #FDE7E9;
    --SystemFillColorSolidNeutralBackgroundBrush: #F3F3F3;
    --control-example-display-bg: #FFFFFF;
    --layer-fill-color-default: var(--layer-default);
    --layer-on-acrylic-fill-color-default: var(--layer-default);
    --surface-stroke-color-flyout: var(--stroke-surface-flyout);
    --subtle-fill-color-secondary: var(--subtle-secondary);
    --subtle-fill-color-tertiary: var(--subtle-tertiary);
    --divider-stroke: var(--stroke-divider);
    --divider-stroke-default: var(--stroke-divider);
    --divider-stroke-color-default: var(--stroke-divider);
    --flyout-background: var(--flyout-bg);
  }

  .basic-input-example-theme:has(.example-display[data-theme='dark']) .example-container {
    color-scheme: dark;
    --text-primary: #FFFFFF;
    --text-secondary: rgba(255, 255, 255, 0.77);
    --text-tertiary: rgba(255, 255, 255, 0.53);
    --text-disabled: rgba(255, 255, 255, 0.36);
    --SystemControlForegroundBaseMediumBrush: rgba(255, 255, 255, 0.60);
    --SystemControlHighlightAltBaseMediumHighBrush: rgba(255, 255, 255, 0.80);
    --SystemControlHighlightAltBaseHighBrush: #FFFFFF;
    --SystemControlDisabledBaseMediumLowBrush: rgba(255, 255, 255, 0.40);
    --layer-default: rgba(58, 58, 58, 0.30);
    --card-bg: #2B2B2B;
    --card-bg-secondary: #252525;
    --card-stroke: rgba(0, 0, 0, 0.10);
    --stroke-divider: rgba(255, 255, 255, 0.08);
    --NavigationViewItemSeparatorForeground: var(--stroke-divider);
    --stroke-surface-flyout: rgba(0, 0, 0, 0.20);
    --flyout-bg: rgba(44, 44, 44, 0.86);
    --flyout-backdrop: blur(44px) saturate(190%) brightness(1.22) contrast(1.05);
    --ctrl-fill-default: rgba(255, 255, 255, 0.0605);
    --ctrl-fill-secondary: rgba(255, 255, 255, 0.0837);
    --ctrl-fill-tertiary: rgba(255, 255, 255, 0.0326);
    --ctrl-fill-disabled: rgba(255, 255, 255, 0.04);
    --ctrl-fill-input-active: rgba(30, 30, 30, 0.70);
    --control-fill-color-default: var(--ctrl-fill-default);
    --control-fill-color-secondary: var(--ctrl-fill-secondary);
    --control-fill-color-tertiary: var(--ctrl-fill-tertiary);
    --control-fill-color-disabled: var(--ctrl-fill-disabled);
    --control-fill-color-input-active: var(--ctrl-fill-input-active);
    --control-fill-input-active: var(--ctrl-fill-input-active);
    --ctrl-solid-fill: #202020;
    --ctrl-border: rgba(255, 255, 255, 0.07);
    --ctrl-border-rest: rgba(0, 0, 0, 0.07);
    --ctrl-border-accent: rgba(255, 255, 255, 0.09);
    --control-stroke-color-default: var(--ctrl-border);
    --control-strong-stroke-color-default: rgba(255, 255, 255, 0.54);
    --ctrl-strong-fill: rgba(255, 255, 255, 0.54);
    --ctrl-strong-stroke: rgba(255, 255, 255, 0.54);
    --ctrl-strong-stroke-disabled: rgba(255, 255, 255, 0.16);
    --ctrl-elevation-top: rgba(255, 255, 255, 0.09);
    --ctrl-elevation-bottom: rgba(0, 0, 0, 0.14);
    --subtle-secondary: rgba(255, 255, 255, 0.06);
    --subtle-tertiary: rgba(255, 255, 255, 0.04);
    --subtle-pressed: rgba(255, 255, 255, 0.03);
    --accent-base: #4CC2FF;
    --accent-hover: rgba(96, 205, 255, 0.90);
    --accent-pressed: rgba(96, 205, 255, 0.80);
    --accent-aa-fill: #79D2FF;
    --accent-aa-text: #000000;
    --accent-fill-disabled: rgba(255, 255, 255, 0.16);
    --accent-text: #000000;
    --accent-text-secondary: rgba(0, 0, 0, 0.50);
    --TextOnAccentFillColorPrimaryBrush: #000000;
    --TextOnAccentFillColorSecondaryBrush: rgba(0, 0, 0, 0.50);
    --accent-border: rgba(0, 0, 0, 0.14);
    --accent-border-accent: rgba(255, 255, 255, 0.08);
    --button-stroke: rgba(255, 255, 255, 0.0075);
    --button-stroke-bottom: rgba(255, 255, 255, 0.05);
    --button-stroke-pressed: rgba(255, 255, 255, 0.07);
    --button-stroke-pressed-bottom: rgba(255, 255, 255, 0.07);
    --toggle-border: rgba(255, 255, 255, 0.54);
    --toggle-thumb: rgba(255, 255, 255, 0.79);
    --toggle-thumb-hover: #FFFFFF;
    --toggle-on-thumb: #000000;
    --radio-border: rgba(255, 255, 255, 0.54);
    --system-accent-color-light-2: var(--accent-base);
    --AccentFillColorDefaultBrush: #4CC2FF;
    --TextFillColorInverseBrush: rgba(0, 0, 0, 0.89);
    --CardStrokeColorDefaultBrush: rgba(0, 0, 0, 0.10);
    --NavigationViewContentGridBorderBrush: #1D1D1D;
    --NavigationViewContentBackground: rgba(48, 48, 48, 0.30);
    --SystemFillColorAttentionBrush: #4CC2FF;
    --SystemFillColorSuccessBrush: #6CCB5F;
    --SystemFillColorCautionBrush: #FCE100;
    --SystemFillColorCriticalBrush: #FF99A4;
    --SystemFillColorSolidNeutralBrush: #9D9D9D;
    --SystemFillColorAttentionBackgroundBrush: rgba(255, 255, 255, 0.0314);
    --SystemFillColorSuccessBackgroundBrush: #393D1B;
    --SystemFillColorCautionBackgroundBrush: #433519;
    --SystemFillColorCriticalBackgroundBrush: #442726;
    --SystemFillColorSolidNeutralBackgroundBrush: #2E2E2E;
    --control-example-display-bg: #202020;
    --layer-fill-color-default: var(--layer-default);
    --layer-on-acrylic-fill-color-default: var(--layer-default);
    --surface-stroke-color-flyout: var(--stroke-surface-flyout);
    --subtle-fill-color-secondary: var(--subtle-secondary);
    --subtle-fill-color-tertiary: var(--subtle-tertiary);
    --divider-stroke: var(--stroke-divider);
    --divider-stroke-default: var(--stroke-divider);
    --divider-stroke-color-default: var(--stroke-divider);
    --flyout-background: var(--flyout-bg);
  }

  .grid-sample-item {
    width: 190px;
    height: 160px;
    background: var(--card-bg-secondary);
    display: flex;
    flex-direction: column;
  }

  .grid-img {
    width: 100%;
    height: 130px;
  }

  .page-view {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    flex: 1 1 auto;
    overflow: hidden;
  }

    .page-view.active {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      gap: 4px;
    }

    .page-view.active > .gallery-page-scroll,
    .page-view.active > .gallery-home-scroll {
      flex: 1 1 auto;
      min-height: 0;
    }

    .page-view.active > .win-page-header {
      flex: 0 0 auto;
    }

    .page-view.active.has-page-header > .gallery-item-page {
      flex: 1 1 auto;
      height: 100%;
      min-height: 0;
      padding-top: 0;
      overflow: hidden;
    }

    .page-view.active.has-page-header > .gallery-page-scroll {
      flex: 1 1 auto;
      min-height: 0;
    }

    /* PageHeader is owned by the gallery shell. Hide the legacy per-page
       title/action row so merged pages do not render duplicate headers. */
    .page-view.active.has-page-header .page-heading.page-header,
    .page-view.active.has-page-header .page-heading > .page-header,
    .page-view.active.has-page-header .page-heading > h1.page-header,
    .page-view.active.has-page-header .page-heading .page-title,
    .page-view.active.has-page-header .page-heading .page-header-actions,
    .page-view.active.has-page-header .page-heading .header-actions,
    .page-view.active.has-page-header .page-heading .page-actions,
    .page-view.active.has-page-header .gallery-page-content > .page-header,
    .page-view.active.has-page-header .gallery-page-content > .page-header-section,
    .page-view.active.has-page-header .gallery-page-content > .win-text-block.page-header,
    .page-view.active.has-page-header .gallery-page-content > h1.page-header {
      display: none;
    }

    .page-view.active.has-page-header .page-heading {
      margin: 0;
      padding: 0;
      border: 0;
    }

  .win-nav-content-inner {
    position: relative;
  }
</style>
