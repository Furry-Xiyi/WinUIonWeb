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
import CommandBarPage from './pages/CommandBarPage.vue';
import ContentDialogPage from './pages/ContentDialogPage.vue';
import CommandBarFlyoutPage from './pages/CommandBarFlyoutPage.vue';
import FlyoutPage from './pages/FlyoutPage.vue';
import MenuBarPage from './pages/MenuBarPage.vue';
import MenuFlyoutPage from './pages/MenuFlyoutPage.vue';
import PopupPage from './pages/PopupPage.vue';
import TeachingTipPage from './pages/TeachingTipPage.vue';
import SettingsPage from './pages/SettingsPage.vue';
import TextBoxPage from './pages/TextBoxPage.vue';
import TextBlockPage from './pages/TextBlockPage.vue';
import AutoSuggestBoxPage from './pages/AutoSuggestBoxPage.vue';
import NumberBoxPage from './pages/NumberBoxPage.vue';
import PasswordBoxPage from './pages/PasswordBoxPage.vue';
import RichEditBoxPage from './pages/RichEditBoxPage.vue';

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
  commandbar: CommandBarPage,
  contentdialog: ContentDialogPage,
  commandbarflyout: CommandBarFlyoutPage,
  flyout: FlyoutPage,
  menubar: MenuBarPage,
  menuflyout: MenuFlyoutPage,
  popup: PopupPage,
  teachingtip: TeachingTipPage,
  autosuggestbox: AutoSuggestBoxPage,
  numberbox: NumberBoxPage,
  passwordbox: PasswordBoxPage,
  richeditbox: RichEditBoxPage,
  textbox: TextBoxPage,
  textblock: TextBlockPage,
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
  { value: 'menusandtoolbars', icon: '\uE74E', label: 'Menus & toolbars', selectsOnInvoked: false, children: [
    { value: 'commandbar', icon: '\uE76F', label: 'CommandBar' },
    { value: 'commandbarflyout', icon: '\uF0E2', label: 'CommandBarFlyout' },
    { value: 'menubar', icon: '\uE76F', label: 'MenuBar' },
    { value: 'menuflyout', icon: '\uF0E2', label: 'MenuFlyout' }
  ]},
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
  ]},
  { value: 'text', icon: '\uE8D2', label: 'Text', selectsOnInvoked: false, children: [
    { value: 'autosuggestbox', icon: '\uE721', label: 'AutoSuggestBox' },
    { value: 'numberbox', icon: '\uF261', label: 'NumberBox' },
    { value: 'passwordbox', icon: '\uE7B3', label: 'PasswordBox' },
    { value: 'richeditbox', icon: '\uE8D3', label: 'RichEditBox' },
    { value: 'textbox', icon: '\uE8AC', label: 'TextBox' },
    { value: 'textblock', icon: '\uE8E4', label: 'TextBlock' }
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
    --layer-default: rgba(255, 255, 255, 0.50);
    --card-bg: rgba(255, 255, 255, 0.70);
    --card-bg-secondary: rgba(246, 246, 246, 0.50);
    --card-stroke: rgba(0, 0, 0, 0.06);
    --stroke-divider: rgba(0, 0, 0, 0.06);
    --stroke-surface-flyout: rgba(0, 0, 0, 0.06);
    --flyout-bg: rgba(252, 252, 252, 0.78);
    --flyout-backdrop: blur(30px) saturate(160%) brightness(1.02);
    --flyout-material-overlay: linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06));
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
    --accent-fill-disabled: rgba(0, 0, 0, 0.22);
    --accent-text: #FFFFFF;
    --accent-text-secondary: rgba(255, 255, 255, 0.70);
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
    --layer-default: rgba(58, 58, 58, 0.50);
    --card-bg: #2B2B2B;
    --card-bg-secondary: #252525;
    --card-stroke: rgba(0, 0, 0, 0.10);
    --stroke-divider: rgba(255, 255, 255, 0.08);
    --stroke-surface-flyout: rgba(0, 0, 0, 0.20);
    --flyout-bg: rgba(44, 44, 44, 0.58);
    --flyout-backdrop: blur(44px) saturate(190%) brightness(1.22) contrast(1.05);
    --flyout-material-overlay: linear-gradient(135deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.025) 45%, rgba(0, 0, 0, 0.12));
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
    --accent-fill-disabled: rgba(255, 255, 255, 0.16);
    --accent-text: #000000;
    --accent-text-secondary: rgba(0, 0, 0, 0.50);
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
    display: none;
  }

    .page-view.active {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
</style>
