<template>
  <div class="win-popup-anchor" ref="anchorRef">
    <slot name="trigger"></slot>
    <Transition name="popup-anim" @before-enter="onBeforeEnter" @enter="onEnter">
      <div v-if="visible" class="win-popup" ref="popupRef">
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  visible: Boolean,
  horizontalOffset: { type: Number, default: 0 },
  verticalOffset: { type: Number, default: 0 },
  lightDismiss: { type: Boolean, default: true }
});

const emit = defineEmits(['update:visible']);

const anchorRef = ref(null);
const popupRef = ref(null);

const onBeforeEnter = (el) => {
  el.style.visibility = 'hidden';
};

const onEnter = (el) => {
  const anchor = anchorRef.value.querySelector('[data-popup-trigger]') || anchorRef.value.children[0];
  if (!anchor) { el.style.visibility = ''; return; }
  const anchorRect = anchor.getBoundingClientRect();
  const anchorParent = anchorRef.value.getBoundingClientRect();
  const top = (anchorRect.bottom - anchorParent.top) + 4 + props.verticalOffset;
  const left = (anchorRect.left - anchorParent.left) + props.horizontalOffset;
  el.style.top = top + 'px';
  el.style.left = left + 'px';
  el.style.visibility = '';
};

const onDocClick = (e) => {
  if (!props.visible || !props.lightDismiss) return;
  if (anchorRef.value && !anchorRef.value.contains(e.target)) {
    emit('update:visible', false);
  }
};

onMounted(() => document.addEventListener('pointerdown', onDocClick));
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocClick));
</script>

<style>
.win-popup-anchor {
  position: relative;
  display: inline-flex;
}

  .win-popup {
    position: absolute;
    z-index: 9500;
    background: var(--flyout-bg);
    backdrop-filter: var(--flyout-backdrop);
    border: 1px solid var(--flyout-border);
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    min-width: 240px;
  }

.popup-anim-enter-active {
  animation: popup-fade-in 0.250s cubic-bezier(0.1, 0.9, 0.2, 1) both;
}

.popup-anim-leave-active {
  animation: popup-fade-out 0.167s cubic-bezier(0.7, 0, 1, 0.5) both;
}

@keyframes popup-fade-in {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes popup-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
