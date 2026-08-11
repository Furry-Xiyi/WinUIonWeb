<template>
  <span class="win-popup-anchor" ref="anchorRef">
    <slot name="trigger"></slot>
    <Teleport to="body">
      <div v-if="effectiveIsOpen && IsLightDismissEnabled" class="win-popup-dismiss-layer" @pointerdown="close"></div>
      <Transition name="win-popup">
        <div
          v-if="effectiveIsOpen"
          ref="popupRef"
          class="win-popup"
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
  visible: { type: Boolean, default: undefined },
  HorizontalOffset: { type: Number, default: undefined },
  VerticalOffset: { type: Number, default: undefined },
  IsLightDismissEnabled: { type: Boolean, default: true },
  horizontalOffset: { type: Number, default: 0 },
  verticalOffset: { type: Number, default: 0 },
  lightDismiss: { type: Boolean, default: true }
});

const emit = defineEmits(['update:IsOpen', 'update:visible', 'Opened', 'Closed']);

const anchorRef = ref(null);
const popupRef = ref(null);
const localIsOpen = ref(false);
const position = ref({ top: 0, left: 0 });

const effectiveIsOpen = computed(() => props.IsOpen ?? props.visible ?? localIsOpen.value);
const HorizontalOffset = computed(() => props.HorizontalOffset ?? props.horizontalOffset);
const VerticalOffset = computed(() => props.VerticalOffset ?? props.verticalOffset);
const IsLightDismissEnabled = computed(() => props.IsLightDismissEnabled ?? props.lightDismiss);
const popupStyle = computed(() => ({
  top: `${position.value.top}px`,
  left: `${position.value.left}px`
}));

const setOpen = (value) => {
  localIsOpen.value = value;
  emit('update:IsOpen', value);
  emit('update:visible', value);
  emit(value ? 'Opened' : 'Closed');
};

const updatePosition = async () => {
  await nextTick();
  const anchor = anchorRef.value;
  const popup = popupRef.value;
  if (!anchor || !popup) return;
  const trigger = anchor.querySelector('[data-popup-trigger]') || anchor.firstElementChild || anchor;
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
.win-popup-anchor {
  display: inline-flex;
}

.win-popup-dismiss-layer {
  position: fixed;
  inset: 0;
  z-index: 949;
}

.win-popup {
  position: fixed;
  z-index: 950;
  color: var(--text-primary);
}

.win-popup-enter-active {
  animation: win-popup-enter 250ms cubic-bezier(0.1, 0.9, 0.2, 1) both;
}

.win-popup-leave-active {
  animation: win-popup-exit 167ms cubic-bezier(0.7, 0, 1, 0.5) both;
}

@keyframes win-popup-enter {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes win-popup-exit {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>
