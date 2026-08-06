<template>
  <Transition name="win-switch-presenter-case" :duration="transitionDuration">
    <div v-if="isActive" class="win-case-content">
      <slot>{{ Content }}</slot>
    </div>
  </Transition>
</template>

<script setup>
import { computed, inject, onBeforeUnmount } from 'vue';

const props = defineProps({
  Content: { type: [String, Number, Object, Array], default: null },
  Value: { type: [String, Number, Boolean, Object], default: null },
  IsDefault: { type: Boolean, default: false }
});

const presenter = inject('win-switch-presenter', null);
const unregister = presenter?.registerCase(() => ({
  Value: props.Value,
  IsDefault: props.IsDefault,
  Content: props.Content
}));
const isActive = computed(() => presenter
  ? presenter.isCaseActive(props.Value, props.IsDefault)
  : props.IsDefault);
const transitionDuration = { enter: 400, leave: 200 };

defineExpose({
  Content: computed(() => props.Content),
  IsDefault: computed(() => props.IsDefault),
  Value: computed(() => props.Value)
});

onBeforeUnmount(() => unregister?.());
</script>

<style>
.win-case-content {
  min-width: 0;
}

.win-switch-presenter-case-enter-active {
  animation:
    win-switch-presenter-case-offset-in 400ms cubic-bezier(0.1, 0.9, 0.2, 1) both,
    win-switch-presenter-case-opacity-in 200ms ease-out both;
}

.win-switch-presenter-case-leave-active {
  position: absolute;
  inset: 0;
  width: 100%;
  animation:
    win-switch-presenter-case-offset-out 200ms cubic-bezier(0.1, 0.9, 0.2, 1) both,
    win-switch-presenter-case-opacity-out 100ms ease-out both;
}

@keyframes win-switch-presenter-case-offset-in {
  from { transform: translateY(24px); }
  to { transform: translateY(0); }
}

@keyframes win-switch-presenter-case-offset-out {
  from { transform: translateY(0); }
  to { transform: translateY(24px); }
}

@keyframes win-switch-presenter-case-opacity-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes win-switch-presenter-case-opacity-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>
