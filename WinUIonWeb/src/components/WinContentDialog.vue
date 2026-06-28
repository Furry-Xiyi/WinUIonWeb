<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="visible" class="win-dialog-overlay" @click.self="onLightDismiss">
        <div class="win-dialog" role="dialog" aria-modal="true">
          <div class="win-dialog-body">
            <div v-if="title" class="win-dialog-title">{{ title }}</div>
            <div class="win-dialog-content">
              <slot></slot>
            </div>
          </div>
          <div class="win-dialog-commands">
            <WinButton v-if="primaryText" :primary="defaultButton === 'primary'" @click="$emit('primary')">{{ primaryText }}</WinButton>
            <WinButton v-if="secondaryText" :primary="defaultButton === 'secondary'" @click="$emit('secondary')">{{ secondaryText }}</WinButton>
            <WinButton v-if="closeText" :primary="defaultButton === 'close'" @click="$emit('close')">{{ closeText }}</WinButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import WinButton from './WinButton.vue';

defineProps({
  visible: Boolean,
  title: String,
  primaryText: String,
  secondaryText: String,
  closeText: String,
  defaultButton: { type: String, default: '' }
});

defineEmits(['primary', 'secondary', 'close']);

const onLightDismiss = () => {};
</script>

<style>
.win-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.30);
}

  .win-dialog {
    background: var(--flyout-bg);
    border: 1px solid var(--flyout-border);
    border-radius: 8px;
    min-width: 320px;
    max-width: 480px;
    width: 100%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

.win-dialog-body {
  padding: 24px 24px 0 24px;
  flex: 1;
  background: var(--dialog-content-bg, rgba(255, 255, 255, 0.95));
}

.win-dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.win-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.win-dialog-content p {
  margin: 0;
}

  .win-dialog-commands {
    display: flex;
    gap: 8px;
    padding: 16px 24px;
    border-top: 1px solid var(--dialog-divider);
    background: var(--dialog-button-bg);
  }

.win-dialog-commands .win-btn {
  flex: 1;
}

.dialog-enter-active {
  transition: opacity 0.167s ease;
}

.dialog-enter-active .win-dialog {
  animation: dialog-scale-in 0.333s cubic-bezier(0.1, 0.9, 0.2, 1) both;
}

.dialog-leave-active {
  transition: opacity 0.083s ease;
}

.dialog-leave-active .win-dialog {
  animation: dialog-scale-out 0.083s ease both;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

@keyframes dialog-scale-in {
  from {
    transform: scale(1.05);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes dialog-scale-out {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(1.05);
    opacity: 0;
  }
}
</style>
