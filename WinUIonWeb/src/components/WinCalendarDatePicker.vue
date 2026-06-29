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
    position: relative;
    border: none;
    border-radius: 4px;
    padding: 0 11px;
    font-size: 14px;
    height: 32px;
    background: var(--ctrl-fill-default);
    color: var(--text-primary);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background var(--fast-duration) var(--fast-out-slow-in), color var(--fast-duration);
    user-select: none;
  }

  .picker-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-bottom: 1px solid rgba(0, 0, 0, 0.16);
    pointer-events: none;
  }

  .picker-btn:active::after {
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .picker-btn.primary::after {
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(0, 0, 0, 0.40);
  }

  .picker-btn.primary:active::after {
    border-color: transparent;
  }

  .picker-btn:hover {
    background: var(--ctrl-fill-secondary);
  }

  .picker-btn:active {
    background: color-mix(in srgb, var(--ctrl-fill-tertiary) 100%, black 8%);
    color: var(--text-secondary);
  }

    .picker-btn:active::after {
      border-bottom-color: var(--ctrl-border);
    }

  .picker-btn.primary {
    background: var(--accent-base);
    color: var(--accent-text);
  }

    .picker-btn.primary::after {
      border-color: var(--accent-border);
      border-bottom-color: var(--accent-border-accent);
    }

    .picker-btn.primary:hover {
      background: var(--accent-hover);
    }

    .picker-btn.primary:active {
      background: var(--accent-pressed);
      color: var(--accent-text-secondary);
    }

      .picker-btn.primary:active::after {
        border-color: transparent;
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
    border: 1px solid var(--ctrl-border);
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.14);
    backdrop-filter: var(--flyout-backdrop);
  }
</style>
