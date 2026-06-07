<template>
  <div class="win-settings-card" :class="{ 'content-bottom': contentPlacement === 'bottom' }">
    <template v-if="contentPlacement === 'bottom'">
      <div class="win-settings-card-header">
        <div class="win-settings-card-left">
          <slot name="icon"></slot>
          <div class="win-settings-card-text">
            <span class="win-settings-card-title"><slot name="header"></slot></span>
            <span class="win-settings-card-desc"><slot name="description"></slot></span>
          </div>
        </div>
      </div>
      <div class="win-settings-card-right"><slot></slot></div>
    </template>
    <template v-else>
      <div class="win-settings-card-left">
        <slot name="icon"></slot>
        <div class="win-settings-card-text">
          <span class="win-settings-card-title"><slot name="header"></slot></span>
          <span class="win-settings-card-desc"><slot name="description"></slot></span>
        </div>
      </div>
      <div class="win-settings-card-right"><slot></slot></div>
    </template>
  </div>
</template>
<script setup>
defineProps({
  contentPlacement: { type: String, default: 'right' }
});
</script>
<style src="../styles/settingscard.css"></style>
