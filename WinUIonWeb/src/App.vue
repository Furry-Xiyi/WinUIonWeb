<template>
  <WinTitleBar title="WinUI on Web Gallery" :theme="themeSetting" />
  <WinNavigationView v-model:selectedValue="currentPage"
                     :paneDisplayMode="navPosition"
                     :menuItems="navMenuItems"
                     :footerItems="[]"
                     :showBackButton="true">
    <div v-if="pageComponent" :key="currentPage" :class="['page-view active', pageTransition]">
      <component :is="pageComponent" />
    </div>
  </WinNavigationView>
</template>

<script setup>
import { ref, watch, provide, computed, onMounted } from 'vue';
import WinTitleBar from './components/WinTitleBar.vue';
import WinNavigationView from './components/WinNavigationView.vue';

import HomePage from './pages/HomePage.vue';
import ButtonPage from './pages/ButtonPage.vue';
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
import RadioButtonsPage from './pages/RadioButtonsPage.vue';
import RatingPage from './pages/RatingPage.vue';
import SliderPage from './pages/SliderPage.vue';
import ToggleSwitchPage from './pages/ToggleSwitchPage.vue';
import ExpanderPage from './pages/ExpanderPage.vue';
import SplitViewPage from './pages/SplitViewPage.vue';
import FlipViewPage from './pages/FlipViewPage.vue';
import GridViewPage from './pages/GridViewPage.vue';
import ListBoxPage from './pages/ListBoxPage.vue';
import ListViewPage from './pages/ListViewPage.vue';
import PullToRefreshPage from './pages/PullToRefreshPage.vue';
import TreeViewPage from './pages/TreeViewPage.vue';
import TimePickerPage from './pages/TimePickerPage.vue';
import AnimatedVisualPlayerPage from './pages/AnimatedVisualPlayerPage.vue';
import CaptureElementPage from './pages/CaptureElementPage.vue';
import ImagePage from './pages/ImagePage.vue';
import MediaPlayerElementPage from './pages/MediaPlayerElementPage.vue';
import PersonPicturePage from './pages/PersonPicturePage.vue';
import ContentDialogPage from './pages/ContentDialogPage.vue';
import FlyoutPage from './pages/FlyoutPage.vue';
import PopupPage from './pages/PopupPage.vue';
import TeachingTipPage from './pages/TeachingTipPage.vue';
import SettingsPage from './pages/SettingsPage.vue';

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
  radiobuttons: RadioButtonsPage,
  rating: RatingPage,
  slider: SliderPage,
  timepicker: TimePickerPage,
  toggleswitch: ToggleSwitchPage,
  expander: ExpanderPage,
  splitview: SplitViewPage,
  flipview: FlipViewPage,
  gridview: GridViewPage,
  listbox: ListBoxPage,
  listview: ListViewPage,
  pulltorefresh: PullToRefreshPage,
  treeview: TreeViewPage,
  animatedvisualplayer: AnimatedVisualPlayerPage,
  captureelement: CaptureElementPage,
  image: ImagePage,
  mediaplayerelement: MediaPlayerElementPage,
  personpicture: PersonPicturePage,
  contentdialog: ContentDialogPage,
  flyout: FlyoutPage,
  popup: PopupPage,
  teachingtip: TeachingTipPage,
  settings: SettingsPage
};

const titleBarActive = ref(false);
provide('winTitleBarVisible', titleBarActive);

const readStoredSetting = (key, fallback, allowedValues) => {
  const value = localStorage.getItem(key);
  return allowedValues.includes(value) ? value : fallback;
};

const persistSetting = (key, source) => {
  watch(source, (value) => {
    localStorage.setItem(key, value);
  }, { immediate: true });
};

const currentPage = ref('home');
const navPosition = ref(readStoredSetting('winui-nav-position', 'Auto', ['Auto', 'Top', 'Left']));
if (navPosition.value === 'Left') navPosition.value = 'Auto';
const themeSetting = ref(readStoredSetting('winui-theme-setting', 'system', ['system', 'light', 'dark']));
const materialSetting = ref(readStoredSetting('winui-material-setting', 'mica', ['mica', 'acrylic']));
const animSetting = ref(readStoredSetting('winui-animation-setting', 'entrance', ['entrance', 'drill', 'fade']));
const pageTransition = ref('page-transition-up');
const isHostedInUwpWebView = ref(false);

provide('themeSetting', themeSetting);
provide('materialSetting', materialSetting);
provide('animSetting', animSetting);
provide('navPosition', navPosition);
provide('currentPage', currentPage);
provide('isHostedInUwpWebView', isHostedInUwpWebView);

const pageComponent = computed(() => pageMap[currentPage.value] || HomePage);

const navMenuItems = [
  { value: 'home', icon: '\uE80F', label: 'Home' },
  {
    value: 'buttons', icon: '\uE73A', label: 'Basic Input', selectsOnInvoked: false, children: [
      { value: 'button', icon: '\uE71A', label: 'Button' },
      { value: 'dropdownbutton', icon: '\uE70D', label: 'DropDownButton' },
      { value: 'hyperlinkbutton', icon: '\uE71B', label: 'HyperlinkButton' },
      { value: 'repeatbutton', icon: '\uE8AB', label: 'RepeatButton' },
      { value: 'togglebutton', icon: '\uEF1F', label: 'ToggleButton' },
      { value: 'splitbutton', icon: '\uE90D', label: 'SplitButton' },
      { value: 'togglesplitbutton', icon: '\uE90D', label: 'ToggleSplitButton' },
      { value: 'checkbox', icon: '\uE73D', label: 'CheckBox' },
      { value: 'colorpicker', icon: '\uEF3C', label: 'ColorPicker' },
      { value: 'combobox', icon: '\uE7FB', label: 'ComboBox' },
      { value: 'radiobuttons', icon: '\uECCB', label: 'RadioButtons' },
      { value: 'rating', icon: '\uE734', label: 'RatingControl' },
      { value: 'slider', icon: '\uE9E9', label: 'Slider' },
      { value: 'toggleswitch', icon: '\uF19F', label: 'ToggleSwitch' }
    ]
  },
  { value: 'collections', icon: '\uE80A', label: 'Collections', selectsOnInvoked: false, children: [
    { value: 'flipview', icon: '\uF1CB', label: 'FlipView' },
    { value: 'gridview', icon: '\uF0E2', label: 'GridView' },
    { value: 'listbox', icon: '\uEA37', label: 'ListBox' },
    { value: 'listview', icon: '\uE8FD', label: 'ListView' },
    { value: 'pulltorefresh', icon: '\uE72C', label: 'PullToRefresh' },
    { value: 'treeview', icon: '\uED41', label: 'TreeView' }
  ]},
  {
    value: 'dateandtime', icon: '\uEC92', label: 'Date and Time', selectsOnInvoked: false, children: [
      { value: 'calendardatepicker', icon: '\uE787', label: 'CalendarDatePicker' },
      { value: 'calendarview', icon: '\uF763', label: 'CalendarView' },
      { value: 'datepicker', icon: '\uE8BF', label: 'DatePicker' },
      { value: 'timepicker', icon: '\uE823', label: 'TimePicker' }
    ]
  },
  { value: 'dialogsandflyouts', icon: '\uE8BD', label: 'Dialogs and Flyouts', selectsOnInvoked: false, children: [
    { value: 'contentdialog', icon: '\uE8F2', label: 'ContentDialog' },
    { value: 'flyout', icon: '\uE8A8', label: 'Flyout' },
    { value: 'popup', icon: '\uE7C4', label: 'Popup' },
    { value: 'teachingtip', icon: '\uEC42', label: 'TeachingTip' }
  ]},
  { value: 'layout', icon: '\uE8A1', label: 'Layout', selectsOnInvoked: false, children: [
    { value: 'expander', icon: '\uE8C4', label: 'Expander' },
    { value: 'splitview', icon: '\uE8BC', label: 'SplitView' }
  ]},
  { value: 'media', icon: '\uE786', label: 'Media', selectsOnInvoked: false, children: [
    { value: 'animatedvisualplayer', icon: '\uF5B0', label: 'AnimatedVisualPlayer' },
    { value: 'captureelement', icon: '\uE722', label: 'Capture Element / Camera' },
    { value: 'image', icon: '\uE8B9', label: 'Image' },
    { value: 'mediaplayerelement', icon: '\uE714', label: 'MediaPlayerElement' },
    { value: 'personpicture', icon: '\uE77B', label: 'PersonPicture' }
  ]}
];

const allPages = Object.keys(pageMap);

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
persistSetting('winui-animation-setting', animSetting);

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
});

watch(themeSetting, (value) => postUwpSetting('theme', value));
watch(materialSetting, (value) => postUwpSetting('material', value));

watch(currentPage, (newVal, oldVal) => {
  const ni = allPages.indexOf(newVal);
  const oi = allPages.indexOf(oldVal);
  if (animSetting.value === 'entrance') {
    pageTransition.value = 'page-transition-up';
  } else if (animSetting.value === 'fade') {
    pageTransition.value = 'page-transition-fade';
  } else {
    pageTransition.value = ni > oi ? 'page-transition-left' : 'page-transition-right';
  }
});
</script>

<style>
  @import './styles/theme.css';
  @import './styles/animations.css';

  @font-face {
    font-family: 'WinUIOnWebIcons';
    src: url('./assets/Fonts/SEGOEICONS.TTF') format('truetype');
    font-display: block;
  }

  body .icon,
  body .icon-btn,
  body .ptr-icon-wrapper {
    font-family: 'WinUIOnWebIcons', 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif;
  }

  .page-header {
    font-size: 28px;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 24px;
    color: var(--text-primary);
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
    display: none;
  }

    .page-view.active {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
</style>
