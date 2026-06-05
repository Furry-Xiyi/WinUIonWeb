<template>
  <div class="win-expander" :class="{ 'is-open': isOpen }">
    <div class="win-expander-header" @click="isOpen = !isOpen">
      <slot name="header"></slot>
      <span class="win-expander-chevron">
        <span class="icon win-expander-arrow">&#xE70D;</span>
      </span>
    </div>
    <div class="win-expander-grid">
      <div class="win-expander-inner">
        <div class="win-expander-content"><slot></slot></div>
      </div>
    </div>
  </div>
</template>
<script setup>import { ref } from 'vue'; const isOpen = ref(false);</script>
<style src="../styles/expander.css"></style>
