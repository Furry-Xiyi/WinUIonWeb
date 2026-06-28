<template>
  <div class="win-loading-ring" :style="customStyle"></div>
</template>

<script setup>
import { computed } from 'vue';
import loadingRingGif from '../assets/LoadingRing/LoadingRing.gif';

const props = defineProps({
  color: { type: String, default: null } 
});

const customStyle = computed(() => {
  const style = {
    '--ring-mask': `url(${loadingRingGif})`
  };
  if (props.color) {
    style['--ring-color'] = props.color;
  }
  return style;
});
</script>

<style scoped>
.win-loading-ring {
  display: inline-block;
  width: 48px;
  height: 48px;
  /* Mask uses the imported base64 or bundled URL to find the single LoadingRing.gif */
  -webkit-mask-image: var(--ring-mask);
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-image: var(--ring-mask);
  mask-size: contain;
  mask-repeat: no-repeat;
  
  /* Use user color, or fallback to theme text primary (or accent based on your design) */
  background-color: var(--ring-color, var(--text-primary));
}
</style>
