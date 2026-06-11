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
<style>
  .win-expander {
    border: 1px solid var(--card-stroke);
    border-radius: 4px;
    margin-bottom: 4px;
  }

  .win-expander-header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background: var(--card-bg);
    border-radius: 4px;
    transition: background var(--fast-duration) var(--fast-out-slow-in);
  }

  .win-expander.is-open .win-expander-header {
    border-radius: 4px 4px 0 0;
  }

  .win-expander-chevron {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 12px;
    transition: background var(--fast-duration) var(--fast-out-slow-in);
  }

  .win-expander-header:hover .win-expander-chevron {
    background: var(--subtle-secondary);
  }

  .win-expander-header:active .win-expander-chevron {
    background: var(--subtle-tertiary);
  }

  .win-expander.is-open .win-expander-chevron {
    transform: none;
  }

  .win-expander-arrow {
    font-size: 12px;
    display: block;
    transition: transform var(--fast-duration) var(--fast-out-slow-in);
  }

  .win-expander.is-open .win-expander-arrow {
    transform: rotate(180deg);
  }

  .win-expander-grid {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--normal-duration) var(--fast-out-slow-in);
  }

  .win-expander.is-open .win-expander-grid {
    grid-template-rows: 1fr;
  }

  .win-expander-inner {
    min-height: 0;
    overflow: hidden;
  }

  .win-expander.is-open .win-expander-inner {
    border-top: 1px solid var(--stroke-divider);
  }

  .win-expander-content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    background: var(--card-bg-secondary);
    border-radius: 0 0 3px 3px;
  }
</style>
