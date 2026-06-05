<template>
  <Teleport to="body">
    <div v-if="visible" class="win-menu-flyout-overlay" @pointerdown="close"></div>
    <div v-if="visible" class="win-menu-flyout-wrap"
         :class="[isClosing ? 'is-closing' : '', openDirection === 'up' ? 'from-bottom' : '', shadowVisible ? 'shadow-visible' : '']"
         :style="posStyle">
      <div class="win-menu-flyout"
           @animationend="onAnimEnd">
        <div class="win-menu-flyout-scroll">
          <div v-for="(item, i) in items" :key="i"
               class="win-menu-flyout-item"
               @click="onItemClick(item, i)">{{ item.label || item }}</div>
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
const props = defineProps({
  open: Boolean,
  anchorRect: Object,
  items: { type: Array, default: () => [] }
});
const emit = defineEmits(['close', 'select']);
const shadowVisible = ref(false);
const visible = ref(false);
const isClosing = ref(false);
const openDirection = ref('down');

watch(() => props.open, (val) => {
  if (val) {
    visible.value = true;
    isClosing.value = false;
    shadowVisible.value = false;
  } else if (visible.value) {
    isClosing.value = true;
    setTimeout(() => {
      visible.value = false;
      isClosing.value = false;
    }, 150);
  }
}, { immediate: true });

const close = () => { emit('close'); };
const onItemClick = (item, index) => { emit('select', item, index); };
const onAnimEnd = () => { if (!isClosing.value) shadowVisible.value = true; };

const posStyle = computed(() => {
  if (!props.anchorRect) return {};
  const r = props.anchorRect;
  const viewH = window.innerHeight;
  const margin = 8;
  const gap = 6;

  if (r.width === 0) {
    const maxH = viewH - r.top - margin;
    openDirection.value = 'down';
    return {
      top: r.top + 'px',
      left: (r.left + gap) + 'px',
      '--flyout-max-height': maxH + 'px'
    };
  }

  const spaceBelow = viewH - r.bottom - gap - margin;
  const spaceAbove = r.top - gap - margin;

  if (spaceBelow >= spaceAbove) {
    openDirection.value = 'down';
    return {
      top: (r.bottom + gap) + 'px',
      left: (r.left + r.width / 2) + 'px',
      transform: 'translateX(-50%)',
      '--flyout-max-height': spaceBelow + 'px'
    };
  } else {
    openDirection.value = 'up';
    return {
      bottom: (viewH - r.top + gap) + 'px',
      left: (r.left + r.width / 2) + 'px',
      transform: 'translateX(-50%)',
      '--flyout-max-height': spaceAbove + 'px'
    };
  }
});
</script>
<style src="../styles/menuflyout.css"></style>
