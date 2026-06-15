<template>
  <h1 class="page-header">ToggleSwitch</h1>
  <WinSettingsCard>
    <template #header>
      ToggleSwitch
    </template>
    <template #description>
      A switch for toggling between two states.
    </template>
    <WinToggleSwitch v-model="val1" />
  </WinSettingsCard>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      ToggleSwitch with content
    </template>
    <template #description>
      Control a loading ring animation.
    </template>
    <WinToggleSwitch v-model="val2" onContent="Playing" offContent="Stopped" />
    <img v-if="val2" :src="gifSrc" class="loading-ring-gif" />
  </WinSettingsCard>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import WinToggleSwitch from '../components/WinToggleSwitch.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

const val1 = ref(false);
const val2 = ref(false);

const themeSetting = inject('themeSetting');

const getEffectiveDark = () => {
  const val = themeSetting.value;
  if (val === 'dark') return true;
  if (val === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const isDark = ref(getEffectiveDark());

let mediaQuery;
const onMediaChange = () => { isDark.value = getEffectiveDark(); };

watch(themeSetting, () => { isDark.value = getEffectiveDark(); });

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', onMediaChange);
});
onUnmounted(() => {
  mediaQuery?.removeEventListener('change', onMediaChange);
});

const gifSrc = computed(() => {
  return isDark.value
    ? new URL('../assets/LoadingRing/LoadingRing_Dark.gif', import.meta.url).href
    : new URL('../assets/LoadingRing/LoadingRing_Light.gif', import.meta.url).href;
});
</script>

<style scoped>
  .loading-ring-gif {
    width: 48px;
    height: 48px;
    margin-top: 12px;
  }
</style>
