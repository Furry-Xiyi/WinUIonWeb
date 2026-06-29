<template>
  <div class="win-selector-bar">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="selector-bar-item"
      :class="{ 'is-selected': selectedIndex === index }"
      @click="selectItem(index)">
      <span class="item-icon" v-if="item.icon">
        <span class="icon" v-html="getIconCode(item.icon)"></span>
      </span>
      <span class="item-text">{{ item.text }}</span>
      <div v-if="selectedIndex === index" class="selector-indicator"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  items: { type: Array, required: true },
  selectedIndex: { type: Number, default: 0 }
});

const emit = defineEmits(['update:selectedIndex', 'selectionChanged']);

const currentIndex = ref(props.selectedIndex);

watch(() => props.selectedIndex, (newVal) => {
  currentIndex.value = newVal;
});

const selectItem = (index) => {
  if (currentIndex.value === index) return;
  currentIndex.value = index;
  emit('update:selectedIndex', index);
  emit('selectionChanged', { selectedIndex: index, selectedItem: props.items[index] });
};

const iconMap = {
  'Code': '&#xE943;',
  'Clock': '&#xE823;',
  'Share': '&#xE72D;',
  'Favorite': '&#xE734;'
};

const getIconCode = (iconName) => {
  return iconMap[iconName] || '';
};
</script>

<style scoped>
.win-selector-bar {
  display: inline-flex;
  align-items: center;
  gap: 0;
  border-bottom: 1px solid var(--stroke-divider);
}

.selector-bar-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 400;
  color: var(--text-secondary);
  background: transparent;
  cursor: pointer;
  transition: all 0.083s ease;
  user-select: none;
  white-space: nowrap;
}

.selector-bar-item:hover {
  background: var(--subtle-secondary);
  color: var(--text-primary);
}

.selector-bar-item.is-selected {
  color: var(--text-primary);
  font-weight: 600;
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-icon .icon {
  font-size: 16px;
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
}

.item-text {
  line-height: 1;
}

/* 底部指示条 - 从ComboBox借鉴并改为横版 */
.selector-indicator {
  position: absolute;
  left: 50%;
  bottom: -1px;
  transform: translateX(-50%);
  height: 3px;
  width: 16px;
  background: var(--accent-base);
  border-radius: 3px 3px 0 0;
  transition: width var(--fast-duration) var(--fast-out-slow-in);
}

.selector-bar-item.is-selected:active .selector-indicator {
  width: 10px;
}
</style>
