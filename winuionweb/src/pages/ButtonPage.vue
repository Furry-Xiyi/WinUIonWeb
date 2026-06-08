<template>
  <h1 class="page-header">Button</h1>
  <WinSettingsCard>
    <template #header>
      Standard Button
    </template>
    <template #description>
      A basic button with optional disabled state.
    </template>
    <div style="display: flex; align-items: center; gap: 12px;">
      <WinButton :disabled="btnDisabled">Standard</WinButton>
      <WinCheckBox v-model="btnDisabled">Disabled</WinCheckBox>
    </div>
  </WinSettingsCard>
  <WinSettingsCard>
    <template #header>
      Button Styles
    </template>
    <template #description>
      Accent (primary) and Subtle (borderless) styles.
    </template>
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      <WinButton primary>Accent Style</WinButton>
      <WinButton subtle>Subtle Style</WinButton>
    </div>
  </WinSettingsCard>
  <WinSettingsCard>
    <template #header>
      Text Wrapping
    </template>
    <template #description>
      Default stretches the button. Wrap mode breaks text within max-width.
    </template>
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <WinButton>This is a long text button that stretches horizontally</WinButton>
      <WinButton :wrap="true" style="max-width: 200px;">This is a long text button that wraps within max-width</WinButton>
    </div>
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinButton from '../components/WinButton.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinCheckBox from '../components/WinCheckBox.vue';

const btnDisabled = ref(false);
</script>
