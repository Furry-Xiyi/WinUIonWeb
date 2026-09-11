<template>
  <span class="popup-anchor" ref="anchorRef">
    <slot name="trigger"></slot>
    <Teleport to="body">
      <div v-if="effectiveIsOpen && IsLightDismissEnabled" class="popup-dismiss-layer" @pointerdown="close"></div>
      <Transition name="popup">
        <div
          v-if="effectiveIsOpen"
          ref="popupRef"
          class="popup"
          :style="popupStyle"
          @pointerdown.stop>
          <slot></slot>
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';

const props = defineProps({
  IsOpen: { type: Boolean, default: undefined },
  HorizontalOffset: { type: Number, default: 0 },
  VerticalOffset: { type: Number, default: 0 },
  IsLightDismissEnabled: { type: Boolean, default: true }
});

defineOptions({ name: 'Popup' });
const emit = defineEmits(['update:IsOpen', 'Opened', 'Closed']);

const anchorRef = ref(null);
const popupRef = ref(null);
const localIsOpen = ref(false);
const position = ref({ top: 0, left: 0 });

const effectiveIsOpen = computed(() => props.IsOpen ?? localIsOpen.value);
const HorizontalOffset = computed(() => props.HorizontalOffset ?? 0);
const VerticalOffset = computed(() => props.VerticalOffset ?? 0);
const IsLightDismissEnabled = computed(() => props.IsLightDismissEnabled);
const popupStyle = computed(() => ({
  top: `${position.value.top}px`,
  left: `${position.value.left}px`
}));

const setOpen = (value) => {
  localIsOpen.value = value;
  emit('update:IsOpen', value);
  emit(value ? 'Opened' : 'Closed');
};

const updatePosition = async () => {
  await nextTick();
  const anchor = anchorRef.value;
  const popup = popupRef.value;
  if (!anchor || !popup) return;
  const trigger = anchor.querySelector('[data-popup-trigger]') || anchor.firstElementChild || anchor.parentElement || anchor;
  const rect = trigger.getBoundingClientRect();
  const popupRect = popup.getBoundingClientRect();
  const margin = 8;
  const left = Math.max(margin, Math.min(window.innerWidth - popupRect.width - margin, rect.left + HorizontalOffset.value));
  const top = Math.max(margin, Math.min(window.innerHeight - popupRect.height - margin, rect.top + VerticalOffset.value));
  position.value = { top, left };
};

const open = async () => {
  setOpen(true);
  await updatePosition();
};

const close = () => {
  if (effectiveIsOpen.value) setOpen(false);
};

watch(effectiveIsOpen, (value) => {
  if (value) void updatePosition();
});

watch([HorizontalOffset, VerticalOffset], () => {
  if (effectiveIsOpen.value) void updatePosition();
});

defineExpose({ open, close });
</script>

<style>
.popup-anchor {
  display: inline-flex;
}

.popup-dismiss-layer {
  position: fixed;
  inset: 0;
  z-index: 949;
}

.popup {
  position: fixed;
  z-index: 950;
  color: var(--text-primary);
}

.popup-enter-active {
  animation: popup-enter 250ms cubic-bezier(0.1, 0.9, 0.2, 1) both;
}

.popup-leave-active {
  animation: popup-exit 167ms cubic-bezier(0.7, 0, 1, 0.5) both;
}

@keyframes popup-enter {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes popup-exit {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>
