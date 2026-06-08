<template>
  <WinTitleBar title="WinUI on Web Gallery" :theme="themeSetting" />
  <WinNavigationView v-model:selectedValue="currentPage"
                     :position="navPosition"
                     :menuItems="navMenuItems"
                     :footerItems="[]">
    <div v-if="pageComponent" :key="currentPage" :class="['page-view active', pageTransition]">
      <component :is="pageComponent" />
    </div>
  </WinNavigationView>
</template>

<script setup>
import { ref, watch, provide, computed } from 'vue';
import WinTitleBar from './components/WinTitleBar.vue';
import WinNavigationView from './components/WinNavigationView.vue';

import HomePage from './pages/HomePage.vue';
import ButtonPage from './pages/ButtonPage.vue';
import DropDownButtonPage from './pages/DropDownButtonPage.vue';
import HyperlinkButtonPage from './pages/HyperlinkButtonPage.vue';
import ToggleButtonPage from './pages/ToggleButtonPage.vue';
import SplitButtonPage from './pages/SplitButtonPage.vue';
import ToggleSplitButtonPage from './pages/ToggleSplitButtonPage.vue';
import CheckBoxPage from './pages/CheckBoxPage.vue';
import ComboBoxPage from './pages/ComboBoxPage.vue';
import RadioButtonsPage from './pages/RadioButtonsPage.vue';
import RatingPage from './pages/RatingPage.vue';
import SliderPage from './pages/SliderPage.vue';
import ToggleSwitchPage from './pages/ToggleSwitchPage.vue';
import ExpanderPage from './pages/ExpanderPage.vue';
import FlipViewPage from './pages/FlipViewPage.vue';
import GridViewPage from './pages/GridViewPage.vue';
import ListBoxPage from './pages/ListBoxPage.vue';
import ListViewPage from './pages/ListViewPage.vue';
import PullToRefreshPage from './pages/PullToRefreshPage.vue';
import TreeViewPage from './pages/TreeViewPage.vue';
import SettingsPage from './pages/SettingsPage.vue';

const pageMap = {
  home: HomePage,
  button: ButtonPage,
  dropdownbutton: DropDownButtonPage,
  hyperlinkbutton: HyperlinkButtonPage,
  togglebutton: ToggleButtonPage,
  splitbutton: SplitButtonPage,
  togglesplitbutton: ToggleSplitButtonPage,
  checkbox: CheckBoxPage,
  combobox: ComboBoxPage,
  radiobuttons: RadioButtonsPage,
  rating: RatingPage,
  slider: SliderPage,
  toggleswitch: ToggleSwitchPage,
  expander: ExpanderPage,
  flipview: FlipViewPage,
  gridview: GridViewPage,
  listbox: ListBoxPage,
  listview: ListViewPage,
  pulltorefresh: PullToRefreshPage,
  treeview: TreeViewPage,
  settings: SettingsPage
};

const titleBarActive = ref(false);
provide('winTitleBarVisible', titleBarActive);

const currentPage = ref('home');
const navPosition = ref('Left');
const themeSetting = ref('system');
const animSetting = ref('entrance');
const pageTransition = ref('page-transition-up');

provide('themeSetting', themeSetting);
provide('animSetting', animSetting);
provide('navPosition', navPosition);
provide('currentPage', currentPage);

const pageComponent = computed(() => pageMap[currentPage.value] || HomePage);

const navMenuItems = [
  { value: 'home', icon: '\uE80F', label: 'Home' },
  {
    value: 'buttons', icon: '\uE73A', label: 'Basic Input', selectsOnInvoked: false, children: [
      { value: 'button', icon: '\uE71A', label: 'Button' },
      { value: 'dropdownbutton', icon: '\uEB42', label: 'DropDownButton' },
      { value: 'hyperlinkbutton', icon: '\uE71B', label: 'HyperlinkButton' },
      { value: 'togglebutton', icon: '\uEF1F', label: 'ToggleButton' },
      { value: 'splitbutton', icon: '\uE90D', label: 'SplitButton' },
      { value: 'togglesplitbutton', icon: '\uE90D', label: 'ToggleSplitButton' },
      { value: 'checkbox', icon: '\uE73D', label: 'CheckBox' },
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
  { value: 'layout', icon: '\uEB3B', label: 'Layout', selectsOnInvoked: false, children: [
    { value: 'expander', icon: '\uE8C4', label: 'Expander' }
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
