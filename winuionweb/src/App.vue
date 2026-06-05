<template>
  <WinTitleBar title="WinUI on Web Gallery" :theme="themeSetting" />
  <WinNavigationView v-model:selectedValue="currentPage"
                     :position="navPosition"
                     :menuItems="navMenuItems"
                     :footerItems="[]">

    <div v-if="currentPage === 'home'" :key="'home'" :class="['page-view active', pageTransition]">
      <h1 class="page-header">WinUI 3 Web Gallery</h1>
      <WinSettingsCard>
        <template #header>
          Welcome
        </template>
        <template #description>
          A pure Vue 3 / CSS implementation of Fluent Design.
        </template>
        <WinButton primary @click="currentPage = 'button'">Get Started</WinButton>
      </WinSettingsCard>
    </div>

    <div v-if="currentPage === 'button'" :key="'button'" :class="['page-view active', pageTransition]">
      <h1 class="page-header">Button</h1>
      <WinSettingsCard>
        <template #header>
          Standard Buttons
        </template>
        <template #description>
          A basic button control.
        </template>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <WinButton>Standard</WinButton>
          <WinButton primary>Primary</WinButton>
        </div>
      </WinSettingsCard>
    </div>

    <div v-if="currentPage === 'dropdownbutton'" :key="'dropdownbutton'" :class="['page-view active', pageTransition]">
      <h1 class="page-header">DropDownButton</h1>
      <WinSettingsCard>
        <template #header>
          DropDownButton
        </template>
        <template #description>
          A button with a flyout of actions.
        </template>
        <WinDropDownButton :items="['Action 1', 'Action 2', 'Action 3']">DropDown</WinDropDownButton>
      </WinSettingsCard>
    </div>

    <div v-if="currentPage === 'hyperlinkbutton'" :key="'hyperlinkbutton'" :class="['page-view active', pageTransition]">
      <h1 class="page-header">HyperlinkButton</h1>
      <WinSettingsCard>
        <template #header>
          HyperlinkButton
        </template>
        <template #description>
          A button that appears as a hyperlink.
        </template>
        <WinHyperlinkButton>Click me</WinHyperlinkButton>
      </WinSettingsCard>
    </div>

    <div v-if="currentPage === 'togglebutton'" :key="'togglebutton'" :class="['page-view active', pageTransition]">
      <h1 class="page-header">ToggleButton</h1>
      <WinSettingsCard>
        <template #header>
          ToggleButton
        </template>
        <template #description>
          A button that can be toggled on or off.
        </template>
        <WinToggleButton v-model="toggleBtnVal">Toggle Me</WinToggleButton>
      </WinSettingsCard>
    </div>

    <div v-if="currentPage === 'splitbutton'" :key="'splitbutton'" :class="['page-view active', pageTransition]">
      <h1 class="page-header">SplitButton</h1>
      <WinSettingsCard>
        <template #header>
          SplitButton
        </template>
        <template #description>
          A two-part button with primary action and flyout.
        </template>
        <WinSplitButton :options="['Action 1', 'Action 2']" @click="() => {}">Split</WinSplitButton>
      </WinSettingsCard>
    </div>

    <div v-if="currentPage === 'checkbox'" :key="'checkbox'" :class="['page-view active', pageTransition]">
      <h1 class="page-header">CheckBox</h1>
      <WinSettingsCard>
        <template #header>
          CheckBox
        </template>
        <template #description>
          A control for boolean input.
        </template>
        <WinCheckBox v-model="checkVal">I agree</WinCheckBox>
      </WinSettingsCard>
    </div>

    <div v-if="currentPage === 'combobox'" :key="'combobox'" :class="['page-view active', pageTransition]">
      <h1 class="page-header">ComboBox</h1>
      <WinSettingsCard>
        <template #header>
          ComboBox
        </template>
        <template #description>
          A drop-down list of items.
        </template>
        <WinComboBox :options="[{label:'Arial'}, {label:'Comic Sans MS'}, {label:'Segoe UI'}]" v-model="comboVal" />
      </WinSettingsCard>
    </div>

    <div v-if="currentPage === 'radiobuttons'" :key="'radiobuttons'" :class="['page-view active', pageTransition]">
      <h1 class="page-header">RadioButtons</h1>
      <WinSettingsCard>
        <template #header>
          RadioButtons
        </template>
        <template #description>
          A group of mutually exclusive options.
        </template>
        <div style="display: flex; gap: 24px;">
          <WinRadioButton value="A" v-model="radioVal">Option A</WinRadioButton>
          <WinRadioButton value="B" v-model="radioVal">Option B</WinRadioButton>
          <WinRadioButton value="C" v-model="radioVal">Option C</WinRadioButton>
        </div>
      </WinSettingsCard>
    </div>

    <div v-if="currentPage === 'rating'" :key="'rating'" :class="['page-view active', pageTransition]">
      <h1 class="page-header">RatingControl</h1>
      <WinSettingsCard>
        <template #header>
          RatingControl
        </template>
        <template #description>
          A star-based rating input.
        </template>
        <WinRating v-model="ratingVal" />
      </WinSettingsCard>
    </div>

    <div v-if="currentPage === 'slider'" :key="'slider'" :class="['page-view active', pageTransition]">
      <h1 class="page-header">Slider</h1>
      <WinSettingsCard>
        <template #header>
          Slider
        </template>
        <template #description>
          A control for selecting a value from a range.
        </template>
        <WinSlider v-model="sliderVal" />
      </WinSettingsCard>
    </div>

    <div v-if="currentPage === 'toggleswitch'" :key="'toggleswitch'" :class="['page-view active', pageTransition]">
      <h1 class="page-header">ToggleSwitch</h1>
      <WinSettingsCard>
        <template #header>
          ToggleSwitch
        </template>
        <template #description>
          A switch for toggling between two states.
        </template>
        <WinToggleSwitch v-model="toggleVal" />
      </WinSettingsCard>
    </div>

    <div v-if="currentPage === 'expander'" :key="'expander'" :class="['page-view active', pageTransition]">
      <h1 class="page-header">Expander</h1>
      <WinExpander>
        <template #header>
          <div style="display: flex; flex-direction: column;">
            <span style="font-size: 14px;">Expander Control</span>
            <span style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">Smooth Grid expansion.</span>
          </div>
        </template>
        <div>Here is the inner content of the expander.</div>
      </WinExpander>
    </div>

    <div v-if="currentPage === 'settings'" :key="'settings'" :class="['page-view active', pageTransition]">
      <h1 class="page-header">Settings</h1>
      <span style="font-size: 14px; font-weight: 600; margin-bottom: 6px;">Appearance</span>
      <WinExpander>
        <template #header>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="icon" style="font-size: 20px; width: 25px; text-align: center;">&#xE706;</span>
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 14px;">Theme</span>
              <span style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">Choose your app color mode</span>
            </div>
          </div>
        </template>
        <WinRadioButton value="system" v-model="themeSetting">Use system setting</WinRadioButton>
        <WinRadioButton value="light" v-model="themeSetting">Light</WinRadioButton>
        <WinRadioButton value="dark" v-model="themeSetting">Dark</WinRadioButton>
      </WinExpander>
      <WinExpander>
        <template #header>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="icon" style="font-size: 20px; width: 25px; text-align: center;">&#xE8AB;</span>
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 14px;">Page Transition</span>
              <span style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">Animation style when switching pages</span>
            </div>
          </div>
        </template>
        <WinRadioButton value="entrance" v-model="animSetting">Entrance (slide up)</WinRadioButton>
        <WinRadioButton value="drill" v-model="animSetting">Drill (left / right)</WinRadioButton>
        <WinRadioButton value="fade" v-model="animSetting">Fade</WinRadioButton>
      </WinExpander>
      <WinSettingsCard>
        <template #header>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="icon" style="font-size: 20px; width: 25px; text-align: center;">&#xF594;</span>
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 14px;">Navigation pane position</span>
              <span style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">Select the navigation bar position</span>
            </div>
          </div>
        </template>
        <WinComboBox :options="[{label:'Left'}, {label:'Top'}]" :modelValue="navPosition === 'Left' ? 0 : 1" @update:modelValue="v => navPosition = v === 0 ? 'Left' : 'Top'" />
      </WinSettingsCard>
    </div>
  </WinNavigationView>
</template>

<script setup>
import WinTitleBar from './components/WinTitleBar.vue';
import { ref, watch, provide } from 'vue';
import WinNavigationView from './components/WinNavigationView.vue';
import WinButton from './components/WinButton.vue';
import WinToggleButton from './components/WinToggleButton.vue';
import WinHyperlinkButton from './components/WinHyperlinkButton.vue';
import WinSplitButton from './components/WinSplitButton.vue';
import WinCheckBox from './components/WinCheckBox.vue';
import WinRating from './components/WinRating.vue';
import WinComboBox from './components/WinComboBox.vue';
import WinToggleSwitch from './components/WinToggleSwitch.vue';
import WinRadioButton from './components/WinRadioButton.vue';
import WinSlider from './components/WinSlider.vue';
import WinExpander from './components/WinExpander.vue';
import WinSettingsCard from './components/WinSettingsCard.vue';
import WinDropDownButton from './components/WinDropDownButton.vue';

const titleBarActive = ref(false);
provide('winTitleBarVisible', titleBarActive);
const currentPage = ref('home');
const navPosition = ref('Left');
const toggleBtnVal = ref(false);
const checkVal = ref(true);
const ratingVal = ref(3);
const comboVal = ref(0);
const toggleVal = ref(false);
const radioVal = ref('A');
const sliderVal = ref(50);
const themeSetting = ref('system');
const animSetting = ref('entrance');
const pageTransition = ref('page-transition-up');

const navMenuItems = [
  { value: 'home', icon: '\uE80F', label: 'Home' },
  { value: 'buttons', icon: '\uE73A', label: 'Basic Input', selectsOnInvoked: false, children: [
    { value: 'button', icon: '\uE71A', label: 'Button' },
    { value: 'dropdownbutton', icon: '\uEB42', label: 'DropDownButton' },
    { value: 'hyperlinkbutton', icon: '\uE71B', label: 'HyperlinkButton' },
    { value: 'togglebutton', icon: '\uEF1F', label: 'ToggleButton' },
    { value: 'splitbutton', icon: '\uE90D', label: 'SplitButton' },
    { value: 'checkbox', icon: '\uE73D', label: 'CheckBox' },
    { value: 'combobox', icon: '\uE7FB', label: 'ComboBox' },
    { value: 'radiobuttons', icon: '\uECCB', label: 'RadioButtons' },
    { value: 'rating', icon: '\uE734', label: 'RatingControl' },
    { value: 'slider', icon: '\uE9E9', label: 'Slider' },
    { value: 'toggleswitch', icon: '\uF19F', label: 'ToggleSwitch' }
  ]},
  { value: 'layout', icon: '\uEB3B', label: 'Layout', selectsOnInvoked: false, children: [
    { value: 'expander', icon: '\uE8C4', label: 'Expander' }
  ]}
];

const allPages = ['home', 'button', 'dropdownbutton', 'hyperlinkbutton', 'togglebutton', 'splitbutton', 'checkbox', 'combobox', 'radiobuttons', 'rating', 'slider', 'toggleswitch', 'expander', 'settings'];

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

  .page-view {
    display: none;
  }

    .page-view.active {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
</style>
