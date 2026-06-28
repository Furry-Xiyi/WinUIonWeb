<template>
  <Teleport v-if="!isTargeted" to="body">
    <Transition name="teaching-tip-pop">
      <div v-if="visible" class="win-teaching-tip untargeted" ref="untargetedRef">
        <div v-if="hasHero" class="teaching-tip-hero">
          <slot name="hero"></slot>
        </div>
        <div class="teaching-tip-body">
          <div v-if="$slots.icon" class="teaching-tip-icon">
            <slot name="icon"></slot>
          </div>
          <div class="teaching-tip-content">
            <div v-if="title" class="teaching-tip-title">{{ title }}</div>
            <div v-if="subtitle" class="teaching-tip-subtitle">{{ subtitle }}</div>
            <slot></slot>
          </div>
        </div>
        <div v-if="$slots.actions" class="teaching-tip-actions">
          <slot name="actions"></slot>
        </div>
      </div>
    </Transition>
  </Teleport>

  <Transition v-else name="teaching-tip-pop">
    <div v-if="visible" class="win-teaching-tip targeted">
      <div v-if="hasHero" class="teaching-tip-hero">
        <slot name="hero"></slot>
      </div>
      <div class="teaching-tip-body">
        <div v-if="$slots.icon" class="teaching-tip-icon">
          <slot name="icon"></slot>
        </div>
        <div class="teaching-tip-content">
          <div v-if="title" class="teaching-tip-title">{{ title }}</div>
          <div v-if="subtitle" class="teaching-tip-subtitle">{{ subtitle }}</div>
          <slot></slot>
        </div>
        <button v-if="showCloseButton" class="teaching-tip-close" @click="$emit('close')">
          <span class="icon">&#xE711;</span>
        </button>
      </div>
      <div v-if="$slots.actions" class="teaching-tip-actions">
        <slot name="actions"></slot>
      </div>
      <div class="teaching-tip-tail"></div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  visible: Boolean,
  title: String,
  subtitle: String,
  isTargeted: { type: Boolean, default: true },
  hasHero: Boolean,
  showCloseButton: { type: Boolean, default: true }
});

const emit = defineEmits(['close']);
const untargetedRef = ref(null);

const onDocClick = (e) => {
  if (!props.visible || props.isTargeted) return;
  if (untargetedRef.value && !untargetedRef.value.contains(e.target)) {
    emit('close');
  }
};

onMounted(() => document.addEventListener('pointerdown', onDocClick));
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocClick));
</script>

<style>
  .win-teaching-tip {
    background: var(--flyout-bg);
    backdrop-filter: var(--flyout-backdrop);
    border: 1px solid var(--flyout-border);
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
    white-space: nowrap;
    width: max-content;
    overflow: visible;
    z-index: 9800;
  }

.win-teaching-tip.untargeted {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  transform-origin: center center;
}

.win-teaching-tip.targeted {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  transform-origin: center bottom;
}

.teaching-tip-hero {
  width: 100%;
  height: 100px;
  overflow: hidden;
  border-radius: 7px 7px 0 0;
}

.teaching-tip-body {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
}

.targeted .teaching-tip-close {
  margin-top: -4px;
}

.teaching-tip-icon {
  font-size: 20px;
  flex-shrink: 0;
  color: var(--text-primary);
}

.teaching-tip-content {
  flex: 1;
  min-width: 0;
}

.teaching-tip-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.teaching-tip-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
}

.teaching-tip-close {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 13px;
  padding-bottom: 2px;
  transition: background var(--fast-duration);
}

.teaching-tip-close:hover {
  background: var(--subtle-secondary);
}

.teaching-tip-close:active {
  background: var(--subtle-tertiary);
}

.teaching-tip-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 0 16px 16px;
}

  .teaching-tip-tail {
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 16px;
    height: 16px;
    background: var(--flyout-bg);
    border-right: 1px solid var(--flyout-border);
    border-bottom: 1px solid var(--flyout-border);
  }

.teaching-tip-pop-enter-active {
  animation: teaching-tip-scale-in 0.167s cubic-bezier(0, 0, 0, 1) both;
}

.teaching-tip-pop-leave-active {
  animation: teaching-tip-scale-out 0.167s cubic-bezier(0.7, 0, 1, 0.5) both;
}

@keyframes teaching-tip-scale-in {
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.5);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}

@keyframes teaching-tip-scale-out {
  from {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) scale(0.5);
  }
}

</style>
