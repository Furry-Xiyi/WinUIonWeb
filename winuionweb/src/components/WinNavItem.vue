<template>
  <div class="win-nav-item" :class="{ 'is-selected': isSelected }" @click="nav.select(value)" ref="el">
    <span class="icon">{{ icon }}</span><span class="label"><slot></slot></span>
  </div>
</template>
<script setup>
import { inject, computed, ref, watch, onMounted } from 'vue';
const props = defineProps({ value: String, icon: String });
const nav = inject('navContext');
const isSelected = computed(() => nav.selectedValue() === props.value);
const el = ref(null);

const report = () => {
  if (isSelected.value && el.value) {
    el.value.dispatchEvent(new CustomEvent('nav-indicator-update', { detail: { el: el.value }, bubbles: true }));
  }
};
watch(isSelected, (v) => { if (v) requestAnimationFrame(report); });
onMounted(() => { if (isSelected.value) requestAnimationFrame(report); });
</script>
