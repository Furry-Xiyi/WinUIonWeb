<template>
  <h1 class="page-header">WinUI 3 Web Gallery</h1>
  <WinSettingsCard >
    <template #header>
      Welcome
    </template>
    <template #description>
      A pure Vue 3 / CSS implementation of Fluent Design.
    </template>
    <WinButton primary @click="currentPage = 'button'">Get Started</WinButton>
  </WinSettingsCard>
</template>

<script setup>
import { inject } from 'vue';
import WinButton from '../components/WinButton.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
const currentPage = inject('currentPage');
</script>
