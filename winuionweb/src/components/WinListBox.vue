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
<style>
  /* styles/listbox.css */
  .win-list-box {
    background: var(--card-bg);
    border: 1px solid var(--card-stroke);
    border-radius: 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .win-list-box-item {
    padding: 8px 12px;
    border-radius: 0;
    cursor: pointer;
    transition: background var(--fast-duration);
  }

    .win-list-box-item:hover {
      background: var(--subtle-secondary);
    }

    .win-list-box-item.selected {
      background: var(--accent-base);
      color: var(--accent-text);
    }
</style>
