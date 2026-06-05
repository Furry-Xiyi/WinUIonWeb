<template>
  <Teleport to="body">
    <div v-if="open" class="win-menu-flyout-overlay" @pointerdown="$emit('close')"></div>
    <div v-if="open" class="win-menu-flyout-wrap" :style="posStyle">
      <div class="win-menu-flyout flyout-animate"
           :class="{ 'shadow-visible': shadowVisible }"
           @animationend="shadowVisible = true">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>
<script setup>import { computed, ref, watch } from 'vue';
const props = defineProps({ open: Boolean, anchorRect: Object });
defineEmits(['close']);
const shadowVisible = ref(false);

watch(() => props.open, (val) => {
  if (val) shadowVisible.value = false;
});

const posStyle = computed(() => {
  if (!props.anchorRect) return {};
  const centerX = props.anchorRect.left + props.anchorRect.width / 2;
  return {
    top: props.anchorRect.bottom + 4 + 'px',
    left: centerX + 'px',
    transform: 'translateX(-50%)'
  };
});
</script>
<style src="../styles/menuflyout.css"></style>
