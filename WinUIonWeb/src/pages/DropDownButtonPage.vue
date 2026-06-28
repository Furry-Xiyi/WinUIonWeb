<template>
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
</template>

<script setup>
import WinDropDownButton from '../components/WinDropDownButton.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
</script>
