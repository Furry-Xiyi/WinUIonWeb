<!-- WinDatePicker.vue -->
<template>
  <div class="win-date-picker" ref="containerRef">
    <div v-if="header" class="picker-header">{{ header }}</div>
    <button class="picker-btn" @click="toggleOpen">
      <div class="picker-column-text">{{ monthText }}</div>
      <div class="picker-column-text">{{ dayText }}</div>
      <div v-if="yearVisible" class="picker-column-text">{{ yearText }}</div>
    </button>

    <Teleport to="body">
      <div v-if="isOpen" class="picker-overlay" @click="close(false)"></div>
      <div v-if="isOpen" class="picker-flyout flyout-animate" :style="flyoutStyle">
        <div class="picker-columns">
          <div class="picker-column" @scroll="onScroll($event, 'month')" ref="monthCol">
            <div class="spacer"></div>
            <div v-for="m in 12" :key="'m'+m" class="picker-item" :class="{ active: tempMonth === m }">
              {{ monthNames[m - 1] }}
            </div>
            <div class="spacer"></div>
          </div>
          <div class="picker-column" @scroll="onScroll($event, 'day')" ref="dayCol">
            <div class="spacer"></div>
            <div v-for="d in daysInTempMonth" :key="'d'+d" class="picker-item" :class="{ active: tempDay === d }">
              {{ dayFormatted ? d.toString().padStart(2, '0') : d }}
            </div>
            <div class="spacer"></div>
          </div>
          <div v-if="yearVisible" class="picker-column" @scroll="onScroll($event, 'year')" ref="yearCol">
            <div class="spacer"></div>
            <div v-for="y in years" :key="'y'+y" class="picker-item" :class="{ active: tempYear === y }">
              {{ y }}
            </div>
            <div class="spacer"></div>
          </div>
        </div>
        <div class="picker-actions">
          <button class="action-btn icon" @click="close(true)">&#xE8FB;</button>
          <button class="action-btn icon" @click="close(false)">&#xE711;</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Date, default: () => new Date() },
  header: { type: String, default: '' },
  yearVisible: { type: Boolean, default: true },
  dayFormatted: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const containerRef = ref(null);
const flyoutStyle = ref({});

const monthCol = ref(null);
const dayCol = ref(null);
const yearCol = ref(null);

const tempMonth = ref(props.modelValue.getMonth() + 1);
const tempDay = ref(props.modelValue.getDate());
const tempYear = ref(props.modelValue.getFullYear());

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const years = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - 50 + i);

const daysInTempMonth = computed(() => {
  return new Date(tempYear.value, tempMonth.value, 0).getDate();
});

const monthText = computed(() => monthNames[props.modelValue.getMonth()]);
const dayText = computed(() => {
  const d = props.modelValue.getDate();
  return props.dayFormatted ? d.toString().padStart(2, '0') : d;
});
const yearText = computed(() => props.modelValue.getFullYear());

const ITEM_HEIGHT = 44;

const toggleOpen = async () => {
  tempMonth.value = props.modelValue.getMonth() + 1;
  tempDay.value = props.modelValue.getDate();
  tempYear.value = props.modelValue.getFullYear();
  isOpen.value = true;
  await nextTick();
  const rect = containerRef.value.getBoundingClientRect();
  flyoutStyle.value = {
    top: `${Math.max(10, rect.top - 120)}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`
  };
  syncScroll();
};

const close = (accept) => {
  if (accept) {
    const maxDay = new Date(tempYear.value, tempMonth.value, 0).getDate();
    const finalDay = tempDay.value > maxDay ? maxDay : tempDay.value;
    emit('update:modelValue', new Date(tempYear.value, tempMonth.value - 1, finalDay));
  }
  isOpen.value = false;
};

const syncScroll = () => {
  if (monthCol.value) monthCol.value.scrollTop = (tempMonth.value - 1) * ITEM_HEIGHT;
  if (dayCol.value) dayCol.value.scrollTop = (tempDay.value - 1) * ITEM_HEIGHT;
  if (yearCol.value && props.yearVisible) yearCol.value.scrollTop = years.indexOf(tempYear.value) * ITEM_HEIGHT;
};

let scrollTimeout = null;
const onScroll = (e, type) => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const index = Math.round(e.target.scrollTop / ITEM_HEIGHT);
    if (type === 'month') tempMonth.value = index + 1;
    if (type === 'day') tempDay.value = index + 1;
    if (type === 'year') tempYear.value = years[index];
    e.target.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
  }, 100);
};
</script>

<style scoped>
  .win-date-picker {
    display: inline-flex;
    flex-direction: column;
    gap: 8px;
  }

  .picker-header {
    font-size: 14px;
    color: var(--text-primary);
  }

  .picker-btn {
    display: flex;
    width: 320px;
    height: 32px;
    background: var(--ctrl-fill-default);
    border: 1px solid var(--ctrl-border-rest);
    border-bottom-color: var(--ctrl-border-accent);
    border-radius: 4px;
    padding: 0;
    color: var(--text-primary);
    font-family: inherit;
    font-size: 14px;
  }

    .picker-btn:hover {
      background: var(--ctrl-fill-secondary);
    }

    .picker-btn:active {
      background: var(--ctrl-fill-tertiary);
      color: var(--text-secondary);
    }

  .picker-column-text {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid var(--stroke-divider);
  }

    .picker-column-text:last-child {
      border-right: none;
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
    display: flex;
    flex-direction: column;
  }

  .picker-columns {
    display: flex;
    height: 250px;
  }

  .picker-column {
    flex: 1;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    scrollbar-width: none;
  }

    .picker-column::-webkit-scrollbar {
      display: none;
    }

  .spacer {
    height: 103px;
  }

  .picker-item {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    scroll-snap-align: center;
    font-size: 14px;
    color: var(--text-secondary);
    transition: all 0.2s;
  }

    .picker-item.active {
      color: var(--text-primary);
      font-weight: 600;
      font-size: 16px;
    }

  .picker-actions {
    display: flex;
    height: 44px;
    border-top: 1px solid var(--stroke-divider);
  }

  .action-btn {
    flex: 1;
    background: transparent;
    border: none;
    border-right: 1px solid var(--stroke-divider);
    color: var(--text-primary);
    font-size: 16px;
  }

    .action-btn:last-child {
      border-right: none;
    }

    .action-btn:hover {
      background: var(--subtle-secondary);
    }

    .action-btn:active {
      background: var(--subtle-tertiary);
    }
</style>
