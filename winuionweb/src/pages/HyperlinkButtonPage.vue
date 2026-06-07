<template>
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
</template>

<script setup>
import WinHyperlinkButton from '../components/WinHyperlinkButton.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
</script>
