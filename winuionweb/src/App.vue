<template>
  <WinTitleBar title="WinUI on Web Gallery" :theme="themeSetting" />
  <WinNavigationView :position="navPosition" v-model:selectedValue="currentPage">
    <template #menuItems>
      <WinNavItem value="home" icon="&#xE80F;">Home</WinNavItem>
      <WinNavItem value="controls" icon="&#xE73A;">Basic Inputs</WinNavItem>
    </template>
    <template #footerItems>
    </template>

    <div v-if="currentPage === 'home'" :key="'home'" :class="['page-view active', pageTransition]">
      <h1 class="page-header">WinUI 3 Web Gallery</h1>
      <WinSettingsCard>
        <template #header>
          Welcome
        </template>
        <template #description>
          A pure Vue 3 / CSS implementation of Fluent Design.
        </template>
        <WinButton primary @click="currentPage = 'controls'">Get Started</WinButton>
      </WinSettingsCard>
    </div>

    <div v-if="currentPage === 'controls'" :key="'controls'" :class="['page-view active', pageTransition]">
      <h1 class="page-header">Basic Inputs</h1>

      <WinSettingsCard>
        <template #header>
          Buttons
        </template>
        <template #description>
          Standard, Toggle, Hyperlink, and Split Buttons.
        </template>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <WinButton primary>Primary</WinButton>
          <WinToggleButton v-model="toggleBtnVal">Toggle Me</WinToggleButton>
          <WinDropDownButton :items="['Action 1', 'Action 2', 'Action 3']">DropDown</WinDropDownButton>
          <WinSplitButton :options="['Action 1', 'Action 2']" @click="() => {}">Split</WinSplitButton>
          <WinHyperlinkButton>Hyperlink</WinHyperlinkButton>
        </div>
      </WinSettingsCard>

      <WinSettingsCard>
        <template #header>
          Checkboxes & Ratings
        </template>
        <template #description>
          Fluent checkbox and rating controls.
        </template>
        <div style="display: flex; gap: 24px; align-items: center;">
          <WinCheckBox v-model="checkVal">I agree</WinCheckBox>
          <WinRating v-model="ratingVal" />
        </div>
      </WinSettingsCard>

      <WinSettingsCard>
        <template #header>
          ComboBox
        </template>
        <template #description>
          Click outside to dismiss.
        </template>
        <WinComboBox :options="[{label:'Arial'}, {label:'Comic Sans MS'}, {label:'Segoe UI'}]" v-model="comboVal" />
      </WinSettingsCard>

      <WinSettingsCard>
        <template #header>
          Toggle Switch
        </template>
        <template #description>
          Drag or click to toggle.
        </template>
        <WinToggleSwitch v-model="toggleVal" />
      </WinSettingsCard>

      <WinSettingsCard>
        <template #header>
          Radio & Slider
        </template>
        <template #description>
          Hover scales the inner dot.
        </template>
        <div style="display: flex; gap: 24px; align-items: center;">
          <WinRadioButton value="A" v-model="radioVal">A</WinRadioButton>
          <WinRadioButton value="B" v-model="radioVal">B</WinRadioButton>
          <WinSlider v-model="sliderVal" />
        </div>
      </WinSettingsCard>

      <WinExpander>
        <template #header>
          <div style="display: flex; flex-direction: column;">
            <span style="font-size: 14px;">Expander Control</span>
            <span style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">Smooth Grid expansion.</span>
          </div>
        </template>
        <div>Here is the inner content.</div>
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
              <span style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">Select the navigation bar position to display</span>
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
import WinNavItem from './components/WinNavItem.vue';
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
const pages = ['home', 'controls', 'settings'];

function applyTheme(mode) {
  const html = document.documentElement;
  html.classList.remove('theme-light', 'theme-dark');
  if (mode === 'light') html.classList.add('theme-light');
  else if (mode === 'dark') html.classList.add('theme-dark');
}

watch(themeSetting, (val) => applyTheme(val), { immediate: true });

watch(currentPage, (newVal, oldVal) => {
  const ni = pages.indexOf(newVal);
  const oi = pages.indexOf(oldVal);
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
