<template>
  <a
    v-if="navigateUri"
    class="win-hyperlink-button"
    :class="{ disabled }"
    :href="navigateUri"
    :target="openInNewWindow ? '_blank' : '_self'"
    :rel="openInNewWindow ? 'noopener noreferrer' : undefined"
    :aria-disabled="disabled"
    @click="onAnchorClick">
    <slot></slot>
  </a>
  <button
    v-else
    class="win-hyperlink-button"
    :disabled="disabled"
    @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>

<script setup>
const props = defineProps({
  navigateUri: { type: String, default: '' },
  openInNewWindow: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
});

defineEmits(['click']);

const onAnchorClick = (event) => {
  if (!props.disabled) return;
  event.preventDefault();
  event.stopPropagation();
};
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

.win-hyperlink-button:disabled,
.win-hyperlink-button.disabled {
  color: var(--text-disabled);
  cursor: not-allowed;
  pointer-events: none;
}
</style>
