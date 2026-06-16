<template>
  <div class="win-loading-ring" :style="customStyle"></div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  color: { type: String, default: null } 
});

const customStyle = computed(() => {
  if (props.color) {
    return { '--ring-color': props.color };
  }
  return {}; // If not provided, it will fallback to CSS variable
});
</script>

<style scoped>
.win-loading-ring {
  display: inline-block;
  width: 48px;
  height: 48px;
  /* Mask uses the base URL to find the single LoadingRing.gif */
  -webkit-mask-image: url('../assets/LoadingRing/LoadingRing.gif');
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-image: url('../assets/LoadingRing/LoadingRing.gif');
  mask-size: contain;
  mask-repeat: no-repeat;
  
  /* Use user color, or fallback to theme text primary (or accent based on your design) */
  background-color: var(--ring-color, var(--text-primary));
}
</style>
