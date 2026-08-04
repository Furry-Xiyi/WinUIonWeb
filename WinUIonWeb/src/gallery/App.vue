<template>
  <WinTitleBar :title="appTitle" :theme="themeSetting" />
  <WinToolTipService />
  <div class="gallery-app-content" :class="{ 'has-titlebar': titleBarActive || isHostedInUwpWebView }">
    <WinNavigationView :SelectedItem="selectedNavigationItem"
                     :PaneDisplayMode="navPosition"
                     :MenuItems="navMenuItems"
                     :FooterMenuItems="[]"
                     IsBackButtonVisible="Visible"
                     :IsBackEnabled="isBackEnabled"
                     @ItemInvoked="onNavigationItemInvoked"
                     @BackRequested="onBackRequested">
      <Transition
        appear
        :enter-active-class="pageTransitionEnter"
        :leave-active-class="pageTransitionLeave">
        <div v-if="pageComponent" :key="currentPage" class="page-view active">
          <component :is="pageComponent" />
        </div>
      </Transition>
    </WinNavigationView>
  </div>
</template>

<script setup>
import { ref, watch, provide, computed, onMounted } from 'vue';
import WinTitleBar from '../components/WinTitleBar.vue';
import WinNavigationView from '../components/WinNavigationView.vue';
import WinToolTipService from '../components/WinToolTipService.vue';
import appManifest from '../manifest.json';

import HomePage from './pages/HomePage.vue';
import ButtonPage from './pages/ButtonPage.vue';
import BorderPage from './pages/BorderPage.vue';
import CalendarViewPage from './pages/CalendarViewPage.vue';
import CalendarDatePickerPage from './pages/CalendarDatePickerPage.vue';
import DatePickerPage from './pages/DatePickerPage.vue';
import DropDownButtonPage from './pages/DropDownButtonPage.vue';
import HyperlinkButtonPage from './pages/HyperlinkButtonPage.vue';
import RepeatButtonPage from './pages/RepeatButtonPage.vue';
import ToggleButtonPage from './pages/ToggleButtonPage.vue';
import SplitButtonPage from './pages/SplitButtonPage.vue';
import ToggleSplitButtonPage from './pages/ToggleSplitButtonPage.vue';
import CheckBoxPage from './pages/CheckBoxPage.vue';
import ColorPickerPage from './pages/ColorPickerPage.vue';
import ComboBoxPage from './pages/ComboBoxPage.vue';
import RadioButtonPage from './pages/RadioButtonPage.vue';
import RatingPage from './pages/RatingPage.vue';
import SliderPage from './pages/SliderPage.vue';
import ToggleSwitchPage from './pages/ToggleSwitchPage.vue';
import CanvasPage from './pages/CanvasPage.vue';
import ExpanderPage from './pages/ExpanderPage.vue';
import GridPage from './pages/GridPage.vue';
import ParallaxViewPage from './pages/ParallaxViewPage.vue';
import RelativePanelPage from './pages/RelativePanelPage.vue';
import ScrollViewPage from './pages/ScrollViewPage.vue';
import ScrollViewerPage from './pages/ScrollViewerPage.vue';
import SplitViewPage from './pages/SplitViewPage.vue';
import StackPanelPage from './pages/StackPanelPage.vue';
import VariableSizedWrapGridPage from './pages/VariableSizedWrapGridPage.vue';
import ViewboxPage from './pages/ViewboxPage.vue';
import FlipViewPage from './pages/FlipViewPage.vue';
import GridViewPage from './pages/GridViewPage.vue';
import ItemsRepeaterPage from './pages/ItemsRepeaterPage.vue';
import ItemsViewPage from './pages/ItemsViewPage.vue';
import ListBoxPage from './pages/ListBoxPage.vue';
import ListViewPage from './pages/ListViewPage.vue';
import PullToRefreshPage from './pages/PullToRefreshPage.vue';
import TreeViewPage from './pages/TreeViewPage.vue';
import PipsPagerPage from './pages/PipsPagerPage.vue';
import SemanticZoomPage from './pages/SemanticZoomPage.vue';
import TimePickerPage from './pages/TimePickerPage.vue';
import AnimatedVisualPlayerPage from './pages/AnimatedVisualPlayerPage.vue';
import CaptureElementPage from './pages/CaptureElementPage.vue';
import ImagePage from './pages/ImagePage.vue';
import MediaPlayerElementPage from './pages/MediaPlayerElementPage.vue';
import PersonPicturePage from './pages/PersonPicturePage.vue';
import CommandBarPage from './pages/CommandBarPage.vue';
import ContentDialogPage from './pages/ContentDialogPage.vue';
import CommandBarFlyoutPage from './pages/CommandBarFlyoutPage.vue';
import FlyoutPage from './pages/FlyoutPage.vue';
import MenuBarPage from './pages/MenuBarPage.vue';
import MenuFlyoutPage from './pages/MenuFlyoutPage.vue';
import SwipeControlPage from './pages/SwipeControlPage.vue';
import StandardUICommandPage from './pages/StandardUICommandPage.vue';
import XamlUICommandPage from './pages/XamlUICommandPage.vue';
import AcrylicBrushPage from './pages/AcrylicBrushPage.vue';
import AnimatedIconPage from './pages/AnimatedIconPage.vue';
import CompactSizingPage from './pages/CompactSizingPage.vue';
import GeometryPage from './pages/GeometryPage.vue';
import IconElementPage from './pages/IconElementPage.vue';
import IconographyPage from './pages/IconographyPage.vue';
import LinePage from './pages/LinePage.vue';
import RadialGradientBrushPage from './pages/RadialGradientBrushPage.vue';
import ResourcesPage from './pages/ResourcesPage.vue';
import StylePage from './pages/StylePage.vue';
import SystemBackdropsPage from './pages/SystemBackdrops(MicaAcrylic)Page.vue';
import ThemeShadowPage from './pages/ThemeShadowPage.vue';
import TypographyPage from './pages/TypographyPage.vue';
import PopupPage from './pages/PopupPage.vue';
import TeachingTipPage from './pages/TeachingTipPage.vue';
import ToolTipPage from './pages/ToolTipPage.vue';
import InfoBadgePage from './pages/InfoBadgePage.vue';
import InfoBarPage from './pages/InfoBarPage.vue';
import ProgressBarPage from './pages/ProgressBarPage.vue';
import ProgressRingPage from './pages/ProgressRingPage.vue';
import BreadcrumbBarPage from './pages/BreadcrumbBarPage.vue';
import NavigationViewPage from './pages/NavigationViewPage.vue';
import PivotPage from './pages/PivotPage.vue';
import SelectorBarPage from './pages/SelectorBarPage.vue';
import SettingsPage from './pages/SettingsPage.vue';
import TextBoxPage from './pages/TextBoxPage.vue';
import TextBlockPage from './pages/TextBlockPage.vue';
import AutoSuggestBoxPage from './pages/AutoSuggestBoxPage.vue';
import NumberBoxPage from './pages/NumberBoxPage.vue';
import PasswordBoxPage from './pages/PasswordBoxPage.vue';
import RichEditBoxPage from './pages/RichEditBoxPage.vue';
import RichTextBlockPage from './pages/RichTextBlockPage.vue';

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

const { t } = useI18n();
const pageMap = {
  home: HomePage,
  button: ButtonPage,
  calendardatepicker: CalendarDatePickerPage,
  calendarview: CalendarViewPage,
  datepicker: DatePickerPage,
  dropdownbutton: DropDownButtonPage,
  hyperlinkbutton: HyperlinkButtonPage,
  repeatbutton: RepeatButtonPage,
  togglebutton: ToggleButtonPage,
  splitbutton: SplitButtonPage,
  togglesplitbutton: ToggleSplitButtonPage,
  checkbox: CheckBoxPage,
  colorpicker: ColorPickerPage,
  combobox: ComboBoxPage,
  radiobutton: RadioButtonPage,
  rating: RatingPage,
  slider: SliderPage,
  timepicker: TimePickerPage,
  toggleswitch: ToggleSwitchPage,
  border: BorderPage,
  canvas: CanvasPage,
  expander: ExpanderPage,
  grid: GridPage,
  parallaxview: ParallaxViewPage,
  relativepanel: RelativePanelPage,
  scrollview: ScrollViewPage,
  scrollviewer: ScrollViewerPage,
  splitview: SplitViewPage,
  stackpanel: StackPanelPage,
  variablesizedwrapgrid: VariableSizedWrapGridPage,
  viewbox: ViewboxPage,
  flipview: FlipViewPage,
  gridview: GridViewPage,
  itemsrepeater: ItemsRepeaterPage,
  itemsview: ItemsViewPage,
  listbox: ListBoxPage,
  listview: ListViewPage,
  pulltorefresh: PullToRefreshPage,
  treeview: TreeViewPage,
  pipspager: PipsPagerPage,
  semanticzoom: SemanticZoomPage,
  animatedvisualplayer: AnimatedVisualPlayerPage,
  captureelement: CaptureElementPage,
  image: ImagePage,
  mediaplayerelement: MediaPlayerElementPage,
  personpicture: PersonPicturePage,
  commandbar: CommandBarPage,
  contentdialog: ContentDialogPage,
  commandbarflyout: CommandBarFlyoutPage,
  flyout: FlyoutPage,
  menubar: MenuBarPage,
  menuflyout: MenuFlyoutPage,
  swipecontrol: SwipeControlPage,
  standarduicommand: StandardUICommandPage,
  xamluicommand: XamlUICommandPage,
  popup: PopupPage,
  teachingtip: TeachingTipPage,
  tooltip: ToolTipPage,
  infobadge: InfoBadgePage,
  infobar: InfoBarPage,
  progressbar: ProgressBarPage,
  progressring: ProgressRingPage,
  breadcrumbbar: BreadcrumbBarPage,
  navigationview: NavigationViewPage,
  pivot: PivotPage,
  selectorbar: SelectorBarPage,
  autosuggestbox: AutoSuggestBoxPage,
  numberbox: NumberBoxPage,
  passwordbox: PasswordBoxPage,
  richeditbox: RichEditBoxPage,
  richtextblock: RichTextBlockPage,
  textbox: TextBoxPage,
  textblock: TextBlockPage,
  settings: SettingsPage,
  xamlresources: ResourcesPage,
  xamlstyles: StylePage,
  geometry: GeometryPage,
  iconography: IconographyPage,
  typography: TypographyPage,
  acrylic: AcrylicBrushPage,
  animatedicon: AnimatedIconPage,
  compactsizing: CompactSizingPage,
  iconelement: IconElementPage,
  line: LinePage,
  radialgradientbrush: RadialGradientBrushPage,
  systembackdrops: SystemBackdropsPage,
  themeshadow: ThemeShadowPage
};

const titleBarActive = ref(false);
provide('winTitleBarVisible', titleBarActive);

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

const currentPage = ref('home');
const navPosition = ref(readStoredSetting('winui-nav-position', 'Auto', ['Auto', 'Top', 'Left', 'LeftCompact', 'LeftMinimal']));
const themeSetting = ref(readStoredSetting('winui-theme-setting', 'system', ['system', 'light', 'dark']));
const materialSetting = ref(readStoredSetting('winui-material-setting', 'mica', ['mica', 'acrylic']));
const navigationTransitionInfo = ref(readStoredNavigationTransitionInfo());
const pageTransitionEnter = ref(getNavigationTransitionInfoClassName(navigationTransitionInfo.value, NavigationTrigger_NavigatingTo));
const pageTransitionLeave = ref(getNavigationTransitionInfoClassName(navigationTransitionInfo.value, NavigationTrigger_NavigatingAway));
const isHostedInUwpWebView = ref(false);

provide('themeSetting', themeSetting);
provide('materialSetting', materialSetting);
provide('navigationTransitionInfo', navigationTransitionInfo);
provide('navPosition', navPosition);
provide('currentPage', currentPage);
provide('isHostedInUwpWebView', isHostedInUwpWebView);

const pageComponent = computed(() => pageMap[currentPage.value] || HomePage);
const appTitle = computed(() => t(appManifest.resources?.title ?? 'app.title'));

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
    { Tag: 'animatedvisualplayer', Icon: '\uF5B0', Content: t('text.animatedvisualplayer') },
    { Tag: 'captureelement', Icon: '\uE722', Content: t('text.capture-element-camera') },
    { Tag: 'image', Icon: '\uE8B9', Content: t('text.image') },
    { Tag: 'mediaplayerelement', Icon: '\uE714', Content: t('text.mediaplayerelement') },
    { Tag: 'personpicture', Icon: '\uE77B', Content: t('text.personpicture') }
  ]},
  { Tag: 'menusandtoolbars', Icon: '\uE74E', Content: t('text.menus-and-toolbars'), SelectsOnInvoked: false, MenuItems: [
    { Tag: 'commandbar', Icon: '\uE76F', Content: t('text.commandbar') },
    { Tag: 'commandbarflyout', Icon: '\uF0E2', Content: t('text.commandbarflyout') },
    { Tag: 'menubar', Icon: '\uE76F', Content: t('text.menubar') },
    { Tag: 'menuflyout', Icon: '\uF0E2', Content: t('text.menuflyout') },
    { Tag: 'swipecontrol', Icon: '\uE8D7', Content: t('text.swipecontrol') },
    { Tag: 'standarduicommand', Icon: '\uE8A5', Content: t('text.standarduicommand') },
    { Tag: 'xamluicommand', Icon: '\uE8A5', Content: t('text.xamluicommand') }
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
    { Tag: 'pipspager', Icon: '\uE8A7', Content: t('text.pipspager') },
    { Tag: 'scrollview', Icon: '\uE7F4', Content: t('text.scrollview') },
    { Tag: 'scrollviewer', Icon: '\uE7F4', Content: t('text.scrollviewer') },
    { Tag: 'semanticzoom', Icon: '\uE8A7', Content: t('text.semanticzoom') }
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
    if (item?.Tag) navigate(item.Tag, navigationTransitionInfo.value);
  }
});

const navigationHistory = ref([]);
const isBackEnabled = computed(() => navigationHistory.value.length > 0);
const suppressHistoryPush = ref(false);
const navigate = (
  tag,
  NavigationTransitionInfo = navigationTransitionInfo.value,
  NavigationTrigger = NavigationTrigger_NavigatingTo
) => {
  if (!tag || tag === currentPage.value) return;
  const normalizedNavigationTransitionInfo = normalizeNavigationTransitionInfo(NavigationTransitionInfo);
  const NavigationLeaveTrigger = NavigationTrigger === NavigationTrigger_BackNavigatingTo
    ? NavigationTrigger_BackNavigatingAway
    : NavigationTrigger_NavigatingAway;
  pageTransitionEnter.value = getNavigationTransitionInfoClassName(normalizedNavigationTransitionInfo, NavigationTrigger);
  pageTransitionLeave.value = getNavigationTransitionInfoClassName(normalizedNavigationTransitionInfo, NavigationLeaveTrigger);
  currentPage.value = tag;
};
provide('navigate', navigate);
const onNavigationItemInvoked = args => {
  const item = args?.InvokedItemContainer;
  if (!item || item.SelectsOnInvoked === false) return;
  const tag = item.Tag;
  if (tag) navigate(tag, navigationTransitionInfo.value);
};
const onBackRequested = () => {
  const previousPage = navigationHistory.value.pop();
  if (previousPage) {
    suppressHistoryPush.value = true;
    navigate(previousPage, navigationTransitionInfo.value, NavigationTrigger_BackNavigatingTo);
  }
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
  isHostedInUwpWebView.value = Boolean(window.__WINUI_ON_WEB_UWP_APP__ || window.chrome?.webview);
  postUwpSetting('theme', themeSetting.value);
  postUwpSetting('material', materialSetting.value);
  postUwpSetting('NavigationTransitionInfo', stringifyNavigationTransitionInfo(navigationTransitionInfo.value));
});

watch(themeSetting, (value) => postUwpSetting('theme', value));
watch(materialSetting, (value) => postUwpSetting('material', value));
watch(navigationTransitionInfo, (value) => postUwpSetting('NavigationTransitionInfo', stringifyNavigationTransitionInfo(value)));

watch(currentPage, (newVal, oldVal) => {
  if (suppressHistoryPush.value) {
    suppressHistoryPush.value = false;
  } else if (oldVal && oldVal !== newVal && navigationHistory.value[navigationHistory.value.length - 1] !== oldVal) {
    navigationHistory.value.push(oldVal);
  }
});
</script>

<style>
  @import '../styles/theme.css';
  @import '../styles/animations.css';

  .gallery-app-content {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
  }

  .gallery-app-content.has-titlebar {
    --gallery-titlebar-height: var(--win-titlebar-height, env(titlebar-area-height, 32px));
    height: calc(100% - var(--gallery-titlebar-height));
    margin-top: var(--gallery-titlebar-height);
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
    --layer-default: rgba(58, 58, 58, 0.50);
    --card-bg: #2B2B2B;
    --card-bg-secondary: #252525;
    --card-stroke: rgba(0, 0, 0, 0.10);
    --stroke-divider: rgba(255, 255, 255, 0.08);
    --stroke-surface-flyout: rgba(0, 0, 0, 0.20);
    --flyout-bg: rgba(44, 44, 44, 0.86);
    --flyout-backdrop: blur(44px) saturate(190%) brightness(1.22) contrast(1.05);
    --ctrl-fill-default: #2D2D2D;
    --ctrl-fill-secondary: #333333;
    --ctrl-fill-tertiary: #272727;
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

  .win-nav-content-inner {
    position: relative;
  }
</style>
