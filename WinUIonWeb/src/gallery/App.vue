<template>
  <!-- 对应官方 WinUIGallery/MainWindow.xaml(.cs)：Gallery 主窗口壳（TitleBar + NavigationView + 搜索 + 页面导航） -->
  <ToolTipService />
  <Teleport to="body">
    <div v-if="isNavigationFrozen" class="gallery-navigation-freeze" aria-hidden="true"></div>
  </Teleport>
  <TitleBar
    ref="titleBarRef"
    class="gallery-titlebar"
    :class="{ 'is-uwp-webview': isHostedInUwpWebView }"
    Title="{x:Bind appTitle}"
    IsBackButtonVisible="{x:Bind canGoBack, Mode=OneWay}"
    IsBackButtonEnabled="{x:Bind canGoBack, Mode=OneWay}"
    IsPaneToggleButtonVisible="{x:Bind isPaneToggleVisible, Mode=OneWay}"
    BackRequested="onBackRequested"
    PaneToggleRequested="onTopBarToggle">
    <TitleBar.IconSource>
      <ImageIconSource ImageSource="{x:Bind appIcon}" />
    </TitleBar.IconSource>
    <TitleBar.Resources>
      <HorizontalAlignment x:Key="TitleBarContentHorizontalAlignment">Stretch</HorizontalAlignment>
    </TitleBar.Resources>
    <TitleBar.Content>
    <Grid class="gallery-titlebar-content" HorizontalAlignment="Stretch">
      <Grid.ColumnDefinitions><ColumnDefinition Width="*" /><ColumnDefinition Width="Auto" /></Grid.ColumnDefinitions>
    <AutoSuggestBox
      Grid.Column="0"
      HorizontalAlignment="Center"
      VerticalAlignment="Center"
      ref="searchBoxRef"
      Text="{x:Bind searchQuery, Mode=TwoWay}"
      ItemsSource="{x:Bind searchResults, Mode=OneWay}"
      TextMemberPath="title"
      PlaceholderText="{x:Bind searchPlaceholder}"
      QueryIcon="Find"
      OpenOnFocus="False"
      class="gallery-titlebar-search"
      Width="350"
      QuerySubmitted="onSearchQuerySubmitted" />
    <Button
      Grid.Column="1"
      class="gallery-titlebar-search-button"
      AutomationProperties.Name="{x:Bind searchSubmitLabel}"
      ToolTipService.ToolTip="{x:Bind searchSubmitLabel}"
      Click="onCompactSearchButtonClick">
      <FontIcon class="gallery-titlebar-search-button-icon" Glyph="&#xE721;" />
    </Button>
    </Grid>
    </TitleBar.Content>
  </TitleBar>
  <div class="gallery-app-content" :class="{ 'has-titlebar': isHostedInUwpWebView, 'wco-titlebar': !isHostedInUwpWebView }">
    <div class="gallery-nav-host">
      <NavigationView SelectedItem="{x:Bind selectedNavigationItem, Mode=OneWay}"
                       PaneDisplayMode="{x:Bind navPosition, Mode=OneWay}"
                       MenuItemsSource="{x:Bind navMenuItems, Mode=OneWay}"
                       IsPaneOpen="{x:Bind isPaneOpen, Mode=TwoWay}"
                       IsBackButtonVisible="Collapsed"
                       IsPaneToggleButtonVisible="False"
                       IsBackEnabled="{x:Bind canGoBack, Mode=OneWay}"
                       ItemInvoked="onNavigationItemInvoked"
                       BackRequested="onBackRequested">
        <router-view v-slot="{ Component }">
          <Transition
            appear
            :css="false"
            :onBeforeEnter="routeEnterHooks.before"
            :onEnter="routeEnterHooks.run"
            :onEnterCancelled="routeEnterHooks.cancel"
            :onBeforeAppear="routeEnterHooks.before"
            :onAppear="routeEnterHooks.run"
            :onAppearCancelled="routeEnterHooks.cancel"
            :onBeforeLeave="routeLeaveHooks.before"
            :onLeave="routeLeaveHooks.run"
            :onLeaveCancelled="routeLeaveHooks.cancel">
            <div
              v-if="Component"
              :key="route.fullPath"
              class="page-view active"
              :class="{ 'has-page-header': hasControlPageHeader }">
              <PageHeader
                v-if="hasControlPageHeader"
                Item="{x:Bind currentPageItem, Mode=OneWay}"
                PageName="{x:Bind pageName, Mode=OneWay}"
                CopyLinkAction="{x:Bind copyCurrentPageLink}"
                ToggleThemeAction="{x:Bind toggleCurrentPageTheme}" />
              <Suspense :onResolve="createRoutePageReadyHandler(route.fullPath)">
                <component :is="Component" />
              </Suspense>
            </div>
          </Transition>
        </router-view>
      </NavigationView>
    </div>
  </div>

  <ContentDialog
    x:Name="UnofficialNoticeDialog"
    ref="unofficialNoticeDialog"
    Title="{x:Bind unofficialNoticeTitle}"
    Content="{x:Bind unofficialNoticeMessage}"
    CloseButtonText="{x:Bind unofficialNoticeAcknowledgement}"
    DefaultButton="Close" />

  <Teleport to="#app">
    <div
      v-if="compactSearchOpen"
      ref="compactSearchRef"
      class="gallery-compact-search-popup"
      role="search">
      <AutoSuggestBox
        ref="compactSearchBoxRef"
        Text="{x:Bind searchQuery, Mode=TwoWay}"
        ItemsSource="{x:Bind searchResults, Mode=OneWay}"
        TextMemberPath="title"
        PlaceholderText="{x:Bind searchPlaceholder}"
        QueryIcon="Find"
        OpenOnFocus="False"
        class="gallery-compact-search"
        QuerySubmitted="onSearchQuerySubmitted" />
    </div>
  </Teleport>
</template>

<script setup>
import { h, markRaw, nextTick, ref, shallowRef, watch, provide, inject, computed, onMounted, onBeforeUnmount, onErrorCaptured } from 'vue';
import TitleBar from '../components/TitleBar.vue';
import NavigationView from '../components/NavigationView.vue';
import { beginNavigationCommit, navigationInputFrozen } from '../components/frameNavigationRuntime';
import { getNavigationTransitionStoryboard, resolveNavigationPageStoryboards } from '../components/navigationTransitionRuntime';
import { xamlScopeKey } from '../components/xamlRuntime';
import ToolTipService from '../components/ToolTipService.vue';
import AutoSuggestBox from '../components/AutoSuggestBox.vue';
import PageHeader from './components/PageHeader.vue';
import Button from '../components/Button.vue';
import ContentDialog from '../components/ContentDialog.vue';
import FontIcon from '../components/FontIcon.vue';
import ImageIcon from '../components/ImageIcon.vue';
import Grid from '../components/Grid.vue';
import ColumnDefinition from '../components/ColumnDefinition.vue';
import { getGalleryGroups, getGalleryItems } from './data/galleryCatalog';
import { recordRecentlyVisited } from './data/recentlyVisited';
import appIcon from '../assets/AppIcon.ico';
import { useRoute, useRouter } from 'vue-router';
import { pageTags } from './router';
import { searchAll } from './searchIndex';

import { useI18n } from '../components/i18n/index';
import { syncPwaWindowChrome } from '../utils/pwaWindowChrome';
import { galleryWindowBackdropKey } from '../utils/galleryWindowBackdrop';
import { multipleWindowManagerKey } from '../components/multipleWindowHostAdapter';
import {
  DefaultNavigationTransitionInfo,
  NavigationTrigger_BackNavigatingTo,
  NavigationTrigger_NavigatingTo,
  normalizeNavigationTransitionInfo,
  parseNavigationTransitionInfo,
  stringifyNavigationTransitionInfo
} from '../utils/navigationTransitionInfo';

const { t, locale } = useI18n();
const appTitle = t('app.title');
const unofficialNoticeTitle = t('app.unofficial-notice.title');
const unofficialNoticeMessage = t('app.unofficial-notice.message');
const unofficialNoticeAcknowledgement = t('app.unofficial-notice.acknowledge');
const searchPlaceholder = t('search.placeholder');
const searchSubmitLabel = t('text.submit-query');
const galleryGroups = getGalleryGroups(t);
const sectionTags = new Set(galleryGroups.map(group => group.UniqueId));
const controlTags = new Set(getGalleryItems(t).map(item => item.UniqueId));

const titleBarRef = ref(null);
const unofficialNoticeDialog = ref(null);
let unofficialNoticeRequested = false;
let isGalleryMounted = false;
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
const hasControlPageHeader = computed(() => !sectionTags.has(currentPage.value)
  && !['home', 'settings', 'search'].includes(currentPage.value));
const navPosition = ref(readStoredSetting('winui-nav-position', 'Auto', ['Auto', 'Top', 'Left', 'LeftCompact', 'LeftMinimal']));
const isTopNavMode = computed(() => navPosition.value === 'Top');
const isPaneToggleVisible = computed(() => !isTopNavMode.value);
const isPaneOpen = ref(true);
const themeSetting = ref(readStoredSetting('winui-theme-setting', 'system', ['system', 'light', 'dark']));
const galleryWindowBackdrop = inject(galleryWindowBackdropKey, shallowRef(null));
const multipleWindowManager = inject(multipleWindowManagerKey, null);
const materialSetting = ref(readStoredSetting('winui-material-setting', 'mica', ['mica', 'acrylic']));
const navigationTransitionInfo = ref(readStoredNavigationTransitionInfo());
const pageTransitionInfo = shallowRef(normalizeNavigationTransitionInfo(navigationTransitionInfo.value));
const pageTransitionMode = ref('New');
let pendingRouteTransition = null;
const routePageAnimations = new Map();
const routeMotionReduced = () => typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const createRouteAnimationHooks = (info, mode, incoming) => {
  const storyboard = getNavigationTransitionStoryboard(info, mode, true);
  const source = storyboard ? incoming ? storyboard.Entrance : storyboard.Exit : null;
  const before = element => {
    routePageAnimations.get(element)?.finish(true);
    if (!source || routeMotionReduced()) return;
    const restorers = [];
    const preserved = new WeakMap();
    const preserveStyle = (target, property, value) => {
      let properties = preserved.get(target);
      if (!properties) { properties = new Set(); preserved.set(target, properties); }
      if (!properties.has(property)) {
        const previous = target.style.getPropertyValue(property);
        const priority = target.style.getPropertyPriority(property);
        restorers.push(() => {
          if (previous) target.style.setProperty(property, previous, priority);
          else target.style.removeProperty(property);
        });
        properties.add(property);
      }
      if (value !== undefined) target.style.setProperty(property, String(value));
    };
    const state = { source, animations: [], done: null, restorePreparation: null, preserveStyle,
      finish: cancelled => {
        if (routePageAnimations.get(element) !== state) return;
        routePageAnimations.delete(element);
        for (const animation of state.animations) animation.cancel();
        for (const restore of restorers.reverse()) restore();
        if (!cancelled) state.done?.();
      } };
    const originalTransform = element.style.transform;
    const originalOpacity = element.style.opacity;
    state.restorePreparation = () => {
      if (originalTransform) element.style.transform = originalTransform;
      else element.style.removeProperty('transform');
      if (originalOpacity) element.style.opacity = originalOpacity;
      else element.style.removeProperty('opacity');
    };
    routePageAnimations.set(element, state);
    preserveStyle(element, 'opacity');
    preserveStyle(element, 'transform');
    if (source.TransformOrigin) preserveStyle(element, 'transform-origin', source.TransformOrigin);
    for (const [property, value] of Object.entries(source.InitialStyle)) preserveStyle(element, property, value);
  };
  const run = (element, done) => {
    if (!source || routeMotionReduced() || typeof element.animate !== 'function') {
      routePageAnimations.get(element)?.finish(true);
      done();
      return;
    }
    if (routePageAnimations.get(element)?.source !== source) before(element);
    const state = routePageAnimations.get(element);
    if (!state) { done(); return; }
    state.done = done;
    // Attached targets are measured in their original layout, before the
    // projection/translation storyboards begin in this same frame.
    state.restorePreparation();
    const wasInert = element.hasAttribute('inert');
    const originalInert = element.getAttribute('inert');
    if (storyboard.DisableHitTesting) {
      state.preserveStyle(element, 'pointer-events', 'none');
      element.setAttribute('inert', '');
    }
    const finish = state.finish;
    state.finish = cancelled => {
      if (routePageAnimations.get(element) !== state) return;
      if (wasInert) element.setAttribute('inert', originalInert ?? '');
      else element.removeAttribute('inert');
      finish(cancelled);
    };
    try {
      for (const target of resolveNavigationPageStoryboards(storyboard, element, incoming)) {
        if (target.Storyboard.TransformOrigin) {
          state.preserveStyle(target.Element, 'transform-origin', target.Storyboard.TransformOrigin);
        }
        for (const track of target.Storyboard.Tracks) {
          state.animations.push(target.Element.animate(track.Keyframes, {
            delay: track.Delay ?? 0, duration: track.Duration,
            easing: track.Easing ?? 'linear', fill: track.Fill ?? 'both'
          }));
        }
      }
      void Promise.all(state.animations.map(animation => animation.finished)).then(
        () => state.finish(false), () => state.finish(false));
    } catch {
      state.finish(false);
    }
  };
  return { before, run, cancel: element => routePageAnimations.get(element)?.finish(true) };
};
const routeEnterHooks = computed(() => createRouteAnimationHooks(pageTransitionInfo.value, pageTransitionMode.value, true));
const routeLeaveHooks = computed(() => createRouteAnimationHooks(pageTransitionInfo.value, pageTransitionMode.value, false));
const restorePendingRouteTransition = (pending = pendingRouteTransition) => {
  if (!pending || pending !== pendingRouteTransition) return;
  pageTransitionInfo.value = pending.Previous.Info;
  pageTransitionMode.value = pending.Previous.Mode;
  pendingRouteTransition = null;
};
const isHostedInUwpWebView = ref(
  typeof window !== 'undefined' && Boolean(window.__WINUI_ON_WEB_UWP_APP__)
);
const canGoBack = ref(Boolean(router.options.history.state?.back));
const isRouteNavigationFrozen = ref(false);
const isNavigationFrozen = computed(() => isRouteNavigationFrozen.value || navigationInputFrozen.value);
let navigationReleaseSequence = 0;
let navigationReleaseFrame = null;
let routeNavigationCommit = null;
let routeNavigationTarget = null;
let routeNavigationOrigin = null;
let routeNavigationTransitionOrigin = null;
let routeNavigationRestoring = false;
let routeNavigationResult = true;
let readyRoutePath = null;
let routeNavigationCommitted = false;

const freezeNavigation = (targetPath = null, sourcePath = null) => {
  navigationReleaseSequence += 1;
  if (navigationReleaseFrame) cancelAnimationFrame(navigationReleaseFrame);
  navigationReleaseFrame = null;
  if (!routeNavigationCommit) {
    routeNavigationCommit = beginNavigationCommit(undefined, 'Route');
    routeNavigationOrigin = readyRoutePath ?? sourcePath ?? route.fullPath;
    routeNavigationTransitionOrigin = { Info: pageTransitionInfo.value, Mode: pageTransitionMode.value };
    routeNavigationRestoring = false;
    routeNavigationResult = true;
    routeNavigationCommitted = false;
  }
  if (targetPath) routeNavigationTarget = targetPath;
  isRouteNavigationFrozen.value = true;
};

const releaseNavigation = (navigated = true) => {
  if (!routeNavigationCommit) return;
  if (navigated && (!routeNavigationCommitted || readyRoutePath !== routeNavigationTarget)) return;
  if ((!navigated || !routeNavigationResult) && routeNavigationTransitionOrigin) {
    pageTransitionInfo.value = routeNavigationTransitionOrigin.Info;
    pageTransitionMode.value = routeNavigationTransitionOrigin.Mode;
  }
  const sequence = ++navigationReleaseSequence;
  if (navigationReleaseFrame) cancelAnimationFrame(navigationReleaseFrame);
  void nextTick(() => {
    navigationReleaseFrame = requestAnimationFrame(() => {
      if (sequence === navigationReleaseSequence) {
        const commit = routeNavigationCommit;
        const succeeded = navigated && routeNavigationResult;
        routeNavigationCommit = null;
        routeNavigationTarget = null;
        routeNavigationOrigin = null;
        routeNavigationTransitionOrigin = null;
        routeNavigationRestoring = false;
        routeNavigationResult = true;
        isRouteNavigationFrozen.value = false;
        navigationReleaseFrame = null;
        commit?.complete(succeeded);
      }
    });
  });
};

const onRoutePageReady = (path) => {
  if (path !== route.fullPath) return;
  if (controlTags.has(currentPage.value)) recordRecentlyVisited(currentPage.value);
  readyRoutePath = path;
  releaseNavigation();
};
const createRoutePageReadyHandler = path => () => onRoutePageReady(path);

const restoreNavigationAfterError = () => {
  restorePendingRouteTransition();
  const commit = routeNavigationCommit;
  if (!commit) return;
  if (routeNavigationRestoring) {
    if (routeNavigationCommitted) releaseNavigation(false);
    return;
  }
  const origin = routeNavigationOrigin;
  if (!origin || origin === route.fullPath) {
    releaseNavigation(false);
    return;
  }
  // Keep the original transaction locked while the previously rendered Page
  // is restored. Its completion reports the failed destination, not the rollback.
  freezeNavigation(origin);
  routeNavigationRestoring = true;
  routeNavigationResult = false;
  routeNavigationCommitted = false;
  void router.replace(origin).then(failure => {
    if (routeNavigationCommit !== commit) return;
    if (failure) releaseNavigation(false);
    else releaseNavigation();
  }, () => {
    if (routeNavigationCommit === commit) releaseNavigation(false);
  });
};

const removeNavigationBeforeEach = router.beforeEach((to, from) => {
  freezeNavigation(to.fullPath, from.fullPath);
});

const removeNavigationAfterEach = router.afterEach((to, from, failure) => {
  const pending = pendingRouteTransition;
  const hasPreparedTransition = pending && (pending.TargetPath === to.fullPath
    || pending.TargetPath === to.redirectedFrom?.fullPath);
  if (failure) {
    if (hasPreparedTransition) restorePendingRouteTransition(pending);
    releaseNavigation(false);
    return;
  }
  // Complete every interrupted transition before Vue replaces the active page.
  // Leave completion removes obsolete layers; enter completion restores the
  // current page so its next exit starts from the official initial state.
  for (const state of routePageAnimations.values()) state.finish(false);
  const historyState = router.options.history.state;
  const isBack = historyState?.forward === from.fullPath;
  pageTransitionInfo.value = hasPreparedTransition
    ? pending.Info : normalizeNavigationTransitionInfo(navigationTransitionInfo.value);
  pageTransitionMode.value = hasPreparedTransition ? pending.Mode : isBack ? 'Back' : 'New';
  pendingRouteTransition = null;
  canGoBack.value = Boolean(historyState?.back);
  routeNavigationCommitted = true;
  releaseNavigation();
});

const removeNavigationErrorHandler = router.onError(restoreNavigationAfterError);
onErrorCaptured(() => {
  restoreNavigationAfterError();
});

provide('themeSetting', themeSetting);
provide('materialSetting', materialSetting);
provide('navigationTransitionInfo', navigationTransitionInfo);
provide('navPosition', navPosition);
provide('currentPage', currentPage);
provide('isHostedInUwpWebView', isHostedInUwpWebView);

const navMenuItems = computed(() => [
  { Tag: 'home', Icon: '\uE80F', Content: t('text.home') },
  ...galleryGroups.map(group => ({
    Tag: group.UniqueId,
    Icon: group.Icon,
    Content: group.Title,
    MenuItems: group.Items.map(item => ({
      Tag: item.UniqueId,
      Icon: markRaw(h(ImageIcon, { Source: item.ImagePath, Width: 16, Height: 16 })),
      Content: item.Title
    }))
  }))
]);

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
    return find(navMenuItems.value);
  },
  set: item => {
    if (item?.Tag) void navigate(item.Tag, navigationTransitionInfo.value);
  }
});

const pageSourceNames = {
  titlebar: 'TitleBarPage',
  createmultiplewindows: 'CreateMultipleWindowsPage',
  tabview: 'TabViewPage',
  button: 'ButtonPage',
  hyperlinkbutton: 'HyperlinkButtonPage',
  repeatbutton: 'RepeatButtonPage',
  togglebutton: 'ToggleButtonPage',
  splitbutton: 'SplitButtonPage',
  togglesplitbutton: 'ToggleSplitButtonPage',
  dropdownbutton: 'DropDownButtonPage',
  combobox: 'ComboBoxPage',
  appbarbutton: 'AppBarButtonPage',
  appbarseparator: 'AppBarSeparatorPage',
  toggleappbarbutton: 'AppBarToggleButtonPage',
  commandbar: 'CommandBarPage',
  commandbarflyout: 'CommandBarFlyoutPage',
  listview: 'ListViewPage',
  pagetransition: 'PageTransitionPage',
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
  systembackdropelement: 'SystemBackdropElementPage',
  themeshadow: 'ThemeShadowPage',
  colors: 'ColorPage'
};

const pageName = computed(() => pageSourceNames[currentPage.value]
  || `${currentPage.value.charAt(0).toUpperCase()}${currentPage.value.slice(1)}Page`);

// Route tag → localized resource key for the page title. Mirrors searchIndex's
// LABEL_KEYS so pages whose route tag differs from their resource key (e.g.
// xamlresources → text.resources) get a correct localized header title instead
// of the raw tag.
const pageTitle = {
  radiobutton: 'text.radiobuttons',
  rating: 'text.ratingcontrol',
  pagetransition: 'text.page-transition',
  captureelement: 'text.capture-element-camera',
  toggleappbarbutton: 'text.appbar-toggle-button',
  xamlresources: 'text.resources',
  xamlstyles: 'text.style',
  animatedicon: 'text.animated-icon',
  compactsizing: 'text.compact-sizing',
  iconelement: 'text.icon-element',
  radialgradientbrush: 'text.radial-gradient-brush',
  systembackdrops: 'text.system-backdrops',
  systembackdropelement: 'text.system-backdrop-element',
  themeshadow: 'text.theme-shadow'
};

// ControlInfoData.json supplies the source paths and inheritance used by the
// official Gallery header for these controls.
const buttonPageMetadata = {
  button: { Type: 'Button', SourcePath: '/CommonStyles/Button_themeresources.xaml', Base: 'ButtonBase' },
  hyperlinkbutton: { Type: 'HyperlinkButton', SourcePath: '/CommonStyles/HyperlinkButton_themeresources.xaml', Base: 'ButtonBase' },
  repeatbutton: { Type: 'RepeatButton', SourcePath: '/CommonStyles/RepeatButton_themeresources.xaml', Base: 'ButtonBase', Primitives: true },
  togglebutton: { Type: 'ToggleButton', SourcePath: '/CommonStyles/ToggleButton_themeresources.xaml', Base: 'ButtonBase', Primitives: true, GuidelinesAnchor: '#create-a-toggle-split-button' },
  splitbutton: { Type: 'SplitButton', SourcePath: '/SplitButton', Base: 'ContentControl', GuidelinesAnchor: '#create-a-split-button' },
  togglesplitbutton: { Type: 'ToggleSplitButton', SourcePath: '/SplitButton', Base: 'SplitButton' },
  dropdownbutton: { Type: 'DropDownButton', SourcePath: '/DropDownButton', Base: 'Button' },
  combobox: { Type: 'ComboBox', SourcePath: '/ComboBox', Base: 'Selector' }
};
const currentPageItem = computed(() => {
  const selected = selectedNavigationItem.value;
  const selectedPage = selected?.Tag === currentPage.value ? selected : null;
  const pageSourceUri = `https://github.com/Furry-Xiyi/WinUIonWeb/tree/main/WinUIonWeb/src/gallery/pages/${pageName.value}.vue`;
  if (['systembackdrops', 'systembackdropelement'].includes(currentPage.value)) {
    const isElement = currentPage.value === 'systembackdropelement';
    const type = isElement ? 'SystemBackdropElement' : 'SystemBackdrop';
    const sample = isElement ? 'SystemBackdropElement' : 'SystemBackdrops';
    const namespace = isElement ? 'Microsoft.UI.Xaml.Controls' : 'Microsoft.UI.Xaml.Media';
    const sampleUri = `https://github.com/microsoft/WinUI-Gallery/blob/main/WinUIGallery/Samples/${sample}/${sample}Page.xaml`;
    return {
      Title: t(isElement ? 'text.system-backdrop-element' : 'text.system-backdrops'),
      UniqueId: currentPage.value, ApiNamespace: namespace,
      BaseClasses: isElement ? ['Object', 'DependencyObject', 'UIElement', 'FrameworkElement'] : ['Object', 'DependencyObject'],
      Docs: [{ Title: t('gallery.page-header.api-link', { 0: type }),
        Uri: `https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/${namespace.toLowerCase()}.${type.toLowerCase()}` }],
      SourceLink: `https://github.com/microsoft/microsoft-ui-xaml/tree/main/controls/dev/${isElement ? 'SystemBackdropElement' : 'Materials'}`,
      PageMarkupUri: sampleUri, PageCodeUri: `${sampleUri}.cs`
    };
  }
  if (currentPage.value === 'tabview') {
    const sampleUri = 'https://github.com/microsoft/WinUI-Gallery/blob/main/WinUIGallery/Samples/TabView/TabViewPage.xaml';
    return {
      Title: t('text.tabview'), UniqueId: 'tabview',
      ApiNamespace: 'Microsoft.UI.Xaml.Controls',
      BaseClasses: ['Object', 'DependencyObject', 'UIElement', 'FrameworkElement', 'Control'],
      Docs: [{ Title: t('gallery.page-header.api-link', { 0: 'TabView' }),
        Uri: 'https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.controls.tabview' },
      { Title: t('gallery.page-header.guidelines'), Uri: 'https://learn.microsoft.com/windows/apps/design/controls/tab-view' },
      { Title: t('sample.tabview.multiple-views'), Uri: 'https://learn.microsoft.com/windows/apps/design/layout/show-multiple-views' }],
      SourceLink: 'https://github.com/microsoft/microsoft-ui-xaml/tree/main/controls/dev/TabView',
      PageMarkupUri: sampleUri, PageCodeUri: `${sampleUri}.cs`
    };
  }
  if (currentPage.value === 'titlebar') {
    const sampleUri = 'https://github.com/microsoft/WinUI-Gallery/blob/main/WinUIGallery/Samples/TitleBar/TitleBarPage.xaml';
    return {
      Title: t('text.titlebar'), UniqueId: 'titlebar', ApiNamespace: 'Microsoft.UI.Xaml.Controls',
      BaseClasses: ['Object', 'DependencyObject', 'UIElement', 'FrameworkElement', 'Control'],
      Docs: [{ Title: t('gallery.page-header.api-link', { 0: 'TitleBar' }),
        Uri: 'https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.controls.titlebar' },
      { Title: t('gallery.page-header.guidelines'), Uri: 'https://learn.microsoft.com/windows/apps/design/basics/titlebar-design' }],
      SourceLink: 'https://github.com/microsoft/microsoft-ui-xaml/tree/main/controls/dev/TitleBar',
      PageMarkupUri: sampleUri, PageCodeUri: `${sampleUri}.cs`
    };
  }
  if (currentPage.value === 'createmultiplewindows') {
    const sampleUri = 'https://github.com/microsoft/WinUI-Gallery/blob/main/WinUIGallery/Samples/CreateMultipleWindows/CreateMultipleWindowsPage.xaml';
    return {
      Title: t('text.createmultiplewindows'), UniqueId: 'createmultiplewindows', ApiNamespace: 'Microsoft.UI.Xaml',
      BaseClasses: [],
      Docs: [{ Title: t('gallery.page-header.api-link', { 0: 'MultipleWindow' }),
        Uri: 'https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.window' },
      { Title: t('gallery.page-header.guidelines'), Uri: 'https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.window' }],
      Description: t('sample.multiplewindows.description'),
      SourceLink: 'https://github.com/microsoft/WinUI-Gallery/tree/main/WinUIGallery/Samples/CreateMultipleWindows',
      PageMarkupUri: sampleUri, PageCodeUri: `${sampleUri}.cs`
    };
  }
  if (currentPage.value === 'pagetransition') {
    const sampleUri = 'https://github.com/microsoft/WinUI-Gallery/blob/main/WinUIGallery/Samples/PageTransition/PageTransitionPage.xaml';
    return {
      Title: t('catalog.item.pagetransition.title'), UniqueId: 'pagetransition',
      ApiNamespace: 'Microsoft.UI.Xaml.Media.Animation', BaseClasses: [],
      Docs: [{ Title: t('gallery.page-header.api-link', { 0: 'NavigationThemeTransition' }),
        Uri: 'https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.media.animation.navigationthemetransition' },
      { Title: t('gallery.page-header.guidelines'), Uri: 'https://learn.microsoft.com/windows/apps/design/motion/page-transitions' },
      { Title: t('sample.page-transition.quickstart'), Uri: 'https://learn.microsoft.com/windows/apps/design/motion' }],
      SourceLink: 'https://github.com/microsoft/microsoft-ui-xaml/blob/main/dxaml/phone/lib/ThemeTransitions.cpp',
      PageMarkupUri: sampleUri, PageCodeUri: `${sampleUri}.cs`
    };
  }
  const titleKey = pageTitle[currentPage.value] ?? `text.${currentPage.value}`;
  const official = buttonPageMetadata[currentPage.value];
  const namespace = official?.Primitives ? 'Microsoft.UI.Xaml.Controls.Primitives' : 'Microsoft.UI.Xaml.Controls';
  const baseClasses = ['Object', 'DependencyObject', 'UIElement', 'FrameworkElement', 'Control'];
  if (official?.Base === 'Selector') baseClasses.push('ItemsControl', 'Selector');
  else if (official) {
    baseClasses.push('ContentControl');
    if (['ButtonBase', 'Button'].includes(official.Base)) baseClasses.push('ButtonBase');
    if (['Button', 'SplitButton'].includes(official.Base)) baseClasses.push(official.Base);
  }
  const docs = official ? [{
    Title: t('gallery.page-header.api-link', { 0: t(titleKey) }),
    Uri: `https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/${namespace.toLowerCase()}.${official.Type.toLowerCase()}`
  }, ...(official.Type === 'ComboBox' ? [{
    Title: t('gallery.page-header.comboboxitem-api'),
    Uri: 'https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.controls.comboboxitem'
  }] : []), {
    Title: t('gallery.page-header.guidelines'),
    Uri: `https://learn.microsoft.com/windows/apps/design/controls/${official.Type === 'ComboBox' ? 'combo-box' : official.Type === 'HyperlinkButton' ? 'hyperlinks' : 'buttons'}${official.GuidelinesAnchor || ''}`
  }] : null;
  const officialSampleUri = official ? `https://github.com/microsoft/WinUI-Gallery/blob/main/WinUIGallery/Samples/${official.Type}/${pageName.value}.xaml` : '';
  return {
    ...(selectedPage || {}),
    Title: selectedPage?.Content || t(titleKey) || currentPage.value,
    UniqueId: currentPage.value,
    ApiNamespace: official ? namespace : selected?.ApiNamespace || '',
    BaseClasses: official ? baseClasses : selected?.BaseClasses || [],
    Docs: docs || (selected?.Docs?.length ? selected.Docs : [{
      Title: 'WinUI on Web',
      Uri: 'https://github.com/Furry-Xiyi/WinUIonWeb/'
    }]),
    SourceLink: official ? `https://github.com/microsoft/microsoft-ui-xaml/tree/main/controls/dev${official.SourcePath}` : 'https://github.com/Furry-Xiyi/WinUIonWeb/',
    PageMarkupUri: officialSampleUri || pageSourceUri,
    PageCodeUri: officialSampleUri ? `${officialSampleUri}.cs` : pageSourceUri
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
  if (isRouteNavigationFrozen.value) return false;

  let target;
  try {
    target = router.resolve(location);
  } catch (error) {
    console.error('Unable to resolve navigation target.', error);
    return false;
  }
  if (target.fullPath === route.fullPath) return false;

  const previousTransition = {
    Info: pageTransitionInfo.value,
    Mode: pageTransitionMode.value
  };
  const preparedTransition = prepareTransition?.();
  const pending = preparedTransition ? {
    TargetPath: target.fullPath,
    Info: preparedTransition.Info,
    Mode: preparedTransition.Mode,
    Previous: previousTransition
  } : null;
  freezeNavigation(target.fullPath);
  if (pending) {
    pendingRouteTransition = pending;
    pageTransitionInfo.value = pending.Info;
    pageTransitionMode.value = pending.Mode;
  }

  let navigated = false;
  try {
    const failure = await router.push(location);
    if (failure) {
      restorePendingRouteTransition(pending);
      return false;
    }
    navigated = true;
    return true;
  } catch (error) {
    restorePendingRouteTransition(pending);
    console.error('Navigation failed.', error);
    return false;
  } finally {
    if (!routeNavigationRestoring || navigated) releaseNavigation(navigated);
  }
};

const navigate = async (
  tag,
  NavigationTransitionInfo = navigationTransitionInfo.value,
  NavigationTrigger = NavigationTrigger_NavigatingTo
) => {
  if (!tag || tag === currentPage.value || !pageTags.has(tag)) return false;
  return navigateToRoute({ name: tag }, () => ({
    Info: normalizeNavigationTransitionInfo(NavigationTransitionInfo),
    Mode: NavigationTrigger === NavigationTrigger_BackNavigatingTo ? 'Back' : 'New'
  }));
};
provide('navigate', navigate);
const onNavigationItemInvoked = (sender, args) => {
  const item = args?.InvokedItemContainer;
  if (!item) return;
  const tag = item.Tag;
  if (tag) void navigate(tag, navigationTransitionInfo.value);
};
const onBackRequested = () => {
  if (!canGoBack.value || isRouteNavigationFrozen.value) return;
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
  if (target?.closest?.('.win-asb-popup, .win-menu-flyout-presenter, .win-commandbar-flyout')) return;
  compactSearchOpen.value = false;
};
const onDocumentPointerDownForCompactSearch = (event) => {
  const target = event.target;
  if (target?.closest?.('.gallery-titlebar-search-button')) return;
  if (!compactSearchOpen.value) return;
  if (compactSearchRef.value?.contains(target)) return;
  if (target?.closest?.('.win-asb-popup, .win-menu-flyout-presenter, .win-commandbar-flyout')) return;
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
  if (relatedTarget?.closest?.('.win-asb-popup, .win-menu-flyout-presenter, .win-commandbar-flyout')) return;
  compactSearchOpen.value = false;
};
const onSearchQuerySubmitted = (_sender, { QueryText, ChosenSuggestion }) => {
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
    // During route transitions a component ref can briefly expose a comment
    // node (or another Vue proxy) instead of the title-bar element. Restrict
    // DOM access to an actual Element so a resize cannot abort rendering.
    const searchElement = typeof Element !== 'undefined' && titleBarElement instanceof Element
      ? titleBarElement.querySelector('.gallery-titlebar-search')
      : null;
    const searchVisible = searchElement instanceof Element
      && getComputedStyle(searchElement).display !== 'none';
    if ((!titlebarNarrow.value && !titlebarCompact.value) || searchVisible) {
      compactSearchOpen.value = false;
    }
  });
};

provide(xamlScopeKey, {
  selectedNavigationItem, navPosition, navMenuItems, isPaneOpen, canGoBack,
  appTitle, appIcon, isPaneToggleVisible, searchQuery, searchResults, searchPlaceholder, searchSubmitLabel,
  unofficialNoticeTitle, unofficialNoticeMessage, unofficialNoticeAcknowledgement,
  onNavigationItemInvoked, onBackRequested, onTopBarToggle, onCompactSearchButtonClick, onSearchQuerySubmitted,
  currentPageItem, pageName, copyCurrentPageLink, toggleCurrentPageTheme
});

function applyTheme(mode) {
  const html = document.documentElement;
  const resolvedTheme = mode === 'system'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    : mode;
  html.classList.remove('theme-light', 'theme-dark');
  html.classList.add(`theme-${resolvedTheme}`);
  void multipleWindowManager?.SetTheme(resolvedTheme === 'dark' ? 'Dark' : 'Light').catch(error => console.error(error));
}

watch(themeSetting, (val) => applyTheme(val), { immediate: true });
watch([galleryWindowBackdrop, themeSetting], ([connection, mode]) => {
  if (!connection) return;
  const theme = mode === 'dark' ? 'Dark' : mode === 'light' ? 'Light' : 'Default';
  void connection.SetTheme(theme).catch(error => console.error(error));
}, { immediate: true });
persistSetting('winui-nav-position', navPosition);
persistSetting('winui-theme-setting', themeSetting);
persistSetting('winui-material-setting', materialSetting);
persistNavigationTransitionInfo(navigationTransitionInfo);

const updateThemeColor = () => { syncPwaWindowChrome(window, themeSetting.value, document.getElementById('app') ?? undefined); };
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
const onSystemThemeChange = () => {
  if (themeSetting.value === 'system') {
    applyTheme('system');
    updateThemeColor();
  }
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
  isGalleryMounted = true;
  void nextTick().then(() => {
    if (!isGalleryMounted || unofficialNoticeRequested || !unofficialNoticeDialog.value) return;
    unofficialNoticeRequested = true;
    return unofficialNoticeDialog.value.ShowAsync();
  }).catch(error => console.error(error));
  // WebView2 exposes window.chrome.webview in every host. Only the explicit
  // marker identifies the UWP host that owns the custom title bar.
  isHostedInUwpWebView.value = Boolean(window.__WINUI_ON_WEB_UWP_APP__);
  window.addEventListener('keydown', onWindowKeydown);
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('blur', onWindowBlurForCompactSearch);
  document.addEventListener('visibilitychange', onDocumentVisibilityChangeForCompactSearch);
  postUwpSetting('theme', themeSetting.value);
  postUwpSetting('material', materialSetting.value);
  postUwpSetting('NavigationTransitionInfo', stringifyNavigationTransitionInfo(navigationTransitionInfo.value));
});

onBeforeUnmount(() => {
  isGalleryMounted = false;
  for (const state of routePageAnimations.values()) state.finish(true);
  if (navigationReleaseFrame) cancelAnimationFrame(navigationReleaseFrame);
  removeNavigationBeforeEach();
  removeNavigationAfterEach();
  removeNavigationErrorHandler();
  routeNavigationCommit?.complete(false);
  routeNavigationCommit = null;
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

  .gallery-titlebar {
    /* Grid's layout primitive uses an inline relative position. The window
       shell owns this fixed row, so it must override that local layout. */
    position: fixed !important;
    top: var(--WindowTitleBarY, env(titlebar-area-y, 0px));
    left: 0;
    width: 100%;
    z-index: 1000;
  }

  .gallery-titlebar-content { width: 100%; min-width: 0; height: 100%; }

  .gallery-app-content {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    --gallery-titlebar-bottom: calc(var(--WindowTitleBarY, env(titlebar-area-y, 0px)) + 48px);
    --gallery-caption-band-bottom: var(--WindowCaptionBandBottom, calc(env(titlebar-area-y, 0px) + env(titlebar-area-height, 0px)));
    padding-top: max(var(--gallery-titlebar-bottom), var(--gallery-caption-band-bottom));
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

  .gallery-titlebar .gallery-titlebar-search {
    width: 350px;
    max-width: 350px;
    flex: 0 1 350px;
  }

  /* The UWP WebView host owns the caption buttons outside the web content.
     Its browser shell does not expose AppWindow.TitleBar.RightInset, so keep
     the standard three-button 138px inset. TitleBar already reserves the
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
     由 TitleBar 根据自身宽度添加 is-narrow，不依赖视口媒体查询，
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
    top: max(calc(var(--WindowTitleBarY, env(titlebar-area-y, 0px)) + 48px), var(--WindowCaptionBandBottom, calc(env(titlebar-area-y, 0px) + env(titlebar-area-height, 0px))));
    left: 16px;
    width: min(350px, calc(100vw - 32px));
    z-index: 10000;
  }

  .gallery-compact-search {
    width: 100%;
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
    --CardStrokeColorDefaultBrush: #0000000f;
    --NavigationViewContentGridBorderBrush: var(--CardStrokeColorDefaultBrush);
    --NavigationViewContentBackground: var(--LayerFillColorDefaultBrush);
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
    --CardStrokeColorDefaultBrush: #00000019;
    --NavigationViewContentGridBorderBrush: var(--CardStrokeColorDefaultBrush);
    --NavigationViewContentBackground: var(--LayerFillColorDefaultBrush);
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
