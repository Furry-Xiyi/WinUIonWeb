<!-- components/WinListBox.vue -->
<template>
  <div class="win-list-box">
    <div v-for="(item, index) in items" :key="index"
         class="win-list-box-item"
         :class="{ selected: selectedIndex === index }"
         @click="select(index)">
      <slot name="item" :item="item">{{ item }}</slot>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  items: { type: Array, default: () => [] },
  selectedIndex: { type: Number, default: -1 }
});

const emit = defineEmits(['update:selectedIndex', 'selectionChanged']);

const select = (index) => {
  emit('update:selectedIndex', index);
  emit('selectionChanged', index);
};
</script>
<style src="../styles/listbox.css"></style>
