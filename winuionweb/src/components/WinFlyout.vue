<template>
  <div class="win-flyout-anchor" ref="anchorRef">
    <slot name="trigger"></slot>
    <Transition name="flyout-anim">
      <div v-if="visible" class="win-flyout" :class="['placement-' + placement]">
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  placement: { type: String, default: 'bottom' }
});

const visible = ref(false);
const anchorRef = ref(null);

const show = () => {
  visible.value = true;
};

const hide = () => {
  visible.value = false;
};

const toggle = () => {
  if (visible.value) hide();
  else show();
};

const onDocClick = (e) => {
  if (!visible.value) return;
  if (anchorRef.value && !anchorRef.value.contains(e.target)) {
    hide();
  }
};

onMounted(() => document.addEventListener('pointerdown', onDocClick));
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocClick));

defineExpose({ show, hide, toggle, visible });
</script>

<style>
.win-flyout-anchor {
  position: relative;
  display: inline-flex;
}

.win-flyout {
  position: absolute;
  z-index: 9000;
  background: var(--flyout-bg);
  backdrop-filter: var(--flyout-backdrop);
  border: 1px solid var(--stroke-surface-flyout);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14);
  min-width: 200px;
}

.win-flyout.placement-bottom {
  top: calc(100% + 8px);
  left: 0;
  transform-origin: top center;
}

.win-flyout.placement-top {
  bottom: calc(100% + 8px);
  left: 0;
  transform-origin: bottom center;
}

.flyout-anim-enter-active {
  transition: opacity 0.250s cubic-bezier(0, 0, 0, 1), transform 0.250s cubic-bezier(0, 0, 0, 1);
}

.flyout-anim-leave-active {
  transition: opacity 0.083s ease, transform 0.083s ease;
}

.flyout-anim-enter-from {
  opacity: 0;
  transform: scaleY(0.9) translateY(-4px);
}

.flyout-anim-leave-to {
  opacity: 0;
  transform: scaleY(0.9) translateY(-4px);
}
</style>
