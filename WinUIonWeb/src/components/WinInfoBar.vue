<template>
  <transition name="infobar-slide">
    <div v-if="isOpen"
         class="win-infobar"
         :class="[`severity-${severity.toLowerCase()}`, { 'no-icon': !isIconVisible }]"
         role="alert"
         :aria-live="severity === 'Error' ? 'assertive' : 'polite'">

      <!-- Icon -->
      <div v-if="isIconVisible" class="infobar-icon">
        <span class="icon" :class="`icon-${severity.toLowerCase()}`"></span>
      </div>

      <!-- Content Area -->
      <div class="infobar-content">
        <!-- Title -->
        <div v-if="title" class="infobar-title">{{ title }}</div>

        <!-- Message -->
        <div v-if="message" class="infobar-message">{{ message }}</div>

        <!-- Custom Content Slot -->
        <div v-if="$slots.default" class="infobar-custom-content">
          <slot></slot>
        </div>
      </div>

      <!-- Action Button Slot -->
      <div v-if="$slots.actionButton" class="infobar-action">
        <slot name="actionButton"></slot>
      </div>

      <!-- Close Button -->
      <button v-if="isClosable"
              class="infobar-close-button"
              @click="handleClose"
              aria-label="Close"
              type="button">
        <span class="close-icon">&#xE711;</span>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  severity: {
    type: String,
    default: 'Informational',
    validator: (value) => ['Informational', 'Success', 'Warning', 'Error'].includes(value)
  },
  isIconVisible: { type: Boolean, default: true },
  isClosable: { type: Boolean, default: true },
  // iconSource prop would be for custom icons - currently using default severity-based icons
  iconSource: { type: String, default: null }
});

const emit = defineEmits(['update:isOpen', 'closeButtonClick', 'closing', 'closed']);

// Internal open state
const internalIsOpen = ref(props.isOpen);

watch(() => props.isOpen, (newValue) => {
  internalIsOpen.value = newValue;
});

const handleClose = () => {
  // Emit Closing event (cancelable)
  emit('closing');

  // Emit CloseButtonClick event
  emit('closeButtonClick');

  // Update model
  emit('update:isOpen', false);
  internalIsOpen.value = false;

  // Emit Closed event after animation
  setTimeout(() => {
    emit('closed');
  }, 200); // Match transition duration
};
</script>

<style scoped>
.win-infobar {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 4px;
  border: 1px solid;
  background: var(--layer-alt);
  min-height: 48px;
  box-sizing: border-box;
}

/* Severity-based colors */
.severity-informational {
  border-color: var(--accent-fill-color-default);
  background: var(--accent-fill-secondary);
}

.severity-success {
  border-color: #107c10;
  background: rgba(16, 124, 16, 0.1);
}

.severity-warning {
  border-color: #fce100;
  background: rgba(252, 225, 0, 0.1);
}

.severity-error {
  border-color: #c42b1c;
  background: rgba(196, 43, 28, 0.1);
}

/* Icon */
.infobar-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.icon {
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-informational {
  color: var(--accent-fill-color-default);
}

.icon-informational::before {
  content: "\E946"; /* Info icon */
}

.icon-success {
  color: #107c10;
}

.icon-success::before {
  content: "\E73E"; /* CheckMark icon */
}

.icon-warning {
  color: #fce100;
}

.icon-warning::before {
  content: "\E7BA"; /* Warning icon */
}

.icon-error {
  color: #c42b1c;
}

.icon-error::before {
  content: "\E783"; /* Error/StatusErrorFull icon */
}

/* Content */
.infobar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.infobar-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-fill-color-primary);
  line-height: 20px;
}

.infobar-message {
  font-size: 14px;
  color: var(--text-fill-color-secondary);
  line-height: 20px;
  word-wrap: break-word;
}

.infobar-custom-content {
  font-size: 14px;
  color: var(--text-fill-color-secondary);
  line-height: 20px;
}

/* Action Button Area */
.infobar-action {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-top: 2px;
}

/* Close Button */
.infobar-close-button {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-fill-color-secondary);
  transition: all var(--fast-duration) var(--fast-out-slow-in);
  margin: -4px -4px -4px 0;
}

.infobar-close-button:hover {
  background: var(--subtle-fill-color-secondary);
  color: var(--text-fill-color-primary);
}

.infobar-close-button:active {
  background: var(--subtle-fill-tertiary);
  color: var(--text-fill-color-primary);
}

.close-icon {
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
  font-size: 12px;
}

/* No icon variant */
.win-infobar.no-icon {
  padding-left: 16px;
}

/* Animation */
.infobar-slide-enter-active,
.infobar-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.1, 0.9, 0.2, 1);
  transform-origin: top;
}

.infobar-slide-enter-from {
  opacity: 0;
  transform: scaleY(0.8);
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.infobar-slide-leave-to {
  opacity: 0;
  transform: scaleY(0.8);
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.infobar-slide-enter-to,
.infobar-slide-leave-from {
  opacity: 1;
  transform: scaleY(1);
  max-height: 500px;
}
</style>
