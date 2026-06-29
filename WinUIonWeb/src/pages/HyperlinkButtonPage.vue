<template>
  <div>
    <h1 class="page-header">HyperlinkButton</h1>
    <p class="page-description">A button that appears as a hyperlink.</p>

    <WinControlExample headerText="A simple HyperlinkButton">
      <template #example>
        <WinHyperlinkButton>Click me</WinHyperlinkButton>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import WinHyperlinkButton from '../components/WinHyperlinkButton.vue';
import WinControlExample from '../components/WinControlExample.vue';
</script>
