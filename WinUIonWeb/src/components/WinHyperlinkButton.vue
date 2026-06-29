<template>
  <a
    v-if="navigateUri"
    class="win-hyperlink-button"
    :href="navigateUri"
    :target="openInNewWindow ? '_blank' : '_self'"
    :rel="openInNewWindow ? 'noopener noreferrer' : undefined">
    <slot></slot>
  </a>
  <button
    v-else
    class="win-hyperlink-button"
    @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  navigateUri: { type: String, default: '' },
  openInNewWindow: { type: Boolean, default: false }
});

defineEmits(['click']);
</script>

<style>
.win-hyperlink-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--accent-base);
  font-size: 14px;
  font-family: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: background var(--fast-duration) var(--fast-out-slow-in),
              color var(--fast-duration) var(--fast-out-slow-in);
  user-select: none;
}

.win-hyperlink-button:hover {
  background: var(--subtle-secondary);
  color: var(--accent-hover);
  text-decoration: underline;
}

.win-hyperlink-button:active {
  background: var(--subtle-tertiary);
  color: var(--accent-pressed);
}

.win-hyperlink-button:disabled {
  color: var(--text-disabled);
  cursor: not-allowed;
  pointer-events: none;
}
</style>
