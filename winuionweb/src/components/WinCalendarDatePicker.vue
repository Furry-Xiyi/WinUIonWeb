<!-- WinCalendarDatePicker.vue -->
<template>
  <div class="win-calendar-date-picker" ref="containerRef">
    <button class="picker-btn" @click="toggleOpen">
      <span class="picker-text" :class="{ 'placeholder': !modelValue }">{{ displayText }}</span>
      <span class="icon picker-icon">&#xE787;</span>
    </button>
    <Teleport to="body">
      <div v-if="isOpen" class="picker-overlay" @click="isOpen = false"></div>
      <div v-if="isOpen" class="picker-flyout flyout-animate" :style="flyoutStyle">
        <WinCalendarView :modelValue="modelValue"
                         @update:modelValue="onDateSelect"
                         selectionMode="Single" />
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import WinCalendarView from './WinCalendarView.vue';

const props = defineProps({
  modelValue: { type: Date, default: null },
  placeholder: { type: String, default: 'pick a date' }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const containerRef = ref(null);
const flyoutStyle = ref({});

const displayText = computed(() => {
  if (!props.modelValue) return props.placeholder;
  return props.modelValue.toLocaleDateString();
});

const toggleOpen = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    const rect = containerRef.value.getBoundingClientRect();
    flyoutStyle.value = {
      top: `${rect.bottom + 4}px`,
      left: `${rect.left}px`
    };
  }
};

const onDateSelect = (date) => {
  emit('update:modelValue', date);
  isOpen.value = false;
};
</script>

<style scoped>
  .win-calendar-date-picker {
    display: inline-block;
    position: relative;
  }

  .picker-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 296px;
    height: 32px;
    background: var(--ctrl-fill-default);
    border: 1px solid var(--ctrl-border-rest);
    border-bottom-color: var(--ctrl-border-accent);
    border-radius: 4px;
    padding: 0 12px;
    color: var(--text-primary);
    font-family: inherit;
    font-size: 14px;
    text-align: left;
  }

    .picker-btn:hover {
      background: var(--ctrl-fill-secondary);
    }

    .picker-btn:active {
      background: var(--ctrl-fill-tertiary);
      color: var(--text-secondary);
    }

  .picker-text.placeholder {
    color: var(--text-secondary);
  }

  .picker-icon {
    font-size: 16px;
    color: var(--text-secondary);
  }

  .picker-overlay {
    position: fixed;
    inset: 0;
    z-index: 99;
  }

  .picker-flyout {
    position: fixed;
    z-index: 100;
    background: var(--flyout-bg);
    border: 1px solid var(--stroke-surface-flyout);
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.14);
    backdrop-filter: var(--flyout-backdrop);
  }
</style>
