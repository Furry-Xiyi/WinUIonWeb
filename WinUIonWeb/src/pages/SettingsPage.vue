<template>
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
    <WinComboBox :options="navPositionOptions" :modelValue="navPositionIndex" @update:modelValue="v => navPosition = navPositionValues[v]" />
  </WinSettingsCard>
</template>

<script setup>
import { computed, inject } from 'vue';
import WinExpander from '../components/WinExpander.vue';
import WinRadioButton from '../components/WinRadioButton.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinComboBox from '../components/WinComboBox.vue';
const themeSetting = inject('themeSetting');
const animSetting = inject('animSetting');
const navPosition = inject('navPosition');
const navPositionOptions = [
  { label: 'Left', value: 'Left' },
  { label: 'Top', value: 'Top' }
];
const navPositionValues = navPositionOptions.map(option => option.value);
const navPositionIndex = computed(() => Math.max(0, navPositionValues.indexOf(navPosition.value)));
</script>
