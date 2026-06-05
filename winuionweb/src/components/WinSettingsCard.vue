<template>
  <div class="win-settings-card">
    <div class="win-settings-card-left">
      <slot name="icon"></slot>
      <div class="win-settings-card-text">
        <span class="win-settings-card-title"><slot name="header"></slot></span>
        <span class="win-settings-card-desc"><slot name="description"></slot></span>
      </div>
    </div>
    <div class="win-settings-card-right"><slot></slot></div>
  </div>
</template>
<script setup></script>
<style src="../styles/settingscard.css"></style>
