<!-- WinTimePicker.vue -->
<template>
  <div class="win-time-picker" ref="containerRef">
    <div v-if="header" class="picker-header">{{ header }}</div>
    <button class="picker-btn" @click="toggleOpen">
      <div class="picker-column-text">{{ hourText }}</div>
      <div class="picker-column-text">{{ minuteText }}</div>
      <div v-if="clockIdentifier === '12HourClock'" class="picker-column-text">{{ amPmText }}</div>
    </button>

    <Teleport to="body">
      <div v-if="isOpen" class="picker-overlay" @click="close(false)"></div>
      <div v-if="isOpen" class="picker-flyout flyout-animate" :style="flyoutStyle">
        <div class="picker-columns">
          <div class="picker-column" @scroll="onScroll($event, 'hour')" ref="hourCol">
            <div class="spacer"></div>
            <div v-for="(h, i) in hours" :key="'h'+i" class="picker-item" :class="{ active: tempHour === h }">
              {{ clockIdentifier === '12HourClock' ? (h === 0 ? 12 : h > 12 ? h - 12 : h) : h.toString().padStart(2, '0') }}
            </div>
            <div class="spacer"></div>
          </div>
          <div class="picker-column" @scroll="onScroll($event, 'minute')" ref="minuteCol">
            <div class="spacer"></div>
            <div v-for="(m, i) in minutes" :key="'m'+i" class="picker-item" :class="{ active: tempMinute === m }">
              {{ m.toString().padStart(2, '0') }}
            </div>
            <div class="spacer"></div>
          </div>
          <div v-if="clockIdentifier === '12HourClock'" class="picker-column" @scroll="onScroll($event, 'ampm')" ref="ampmCol">
            <div class="spacer"></div>
            <div v-for="ap in ['AM', 'PM']" :key="ap" class="picker-item" :class="{ active: tempAmPm === ap }">
              {{ ap }}
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
import { ref, computed, nextTick } from 'vue';

const props = defineProps({
  modelValue: { type: Date, default: () => new Date() },
  header: { type: String, default: '' },
  minuteIncrement: { type: Number, default: 1 },
  clockIdentifier: { type: String, default: '12HourClock' }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const containerRef = ref(null);
const flyoutStyle = ref({});

const hourCol = ref(null);
const minuteCol = ref(null);
const ampmCol = ref(null);

const tempHour = ref(props.modelValue.getHours());
const tempMinute = ref(props.modelValue.getMinutes() - (props.modelValue.getMinutes() % props.minuteIncrement));
const tempAmPm = ref(tempHour.value >= 12 ? 'PM' : 'AM');

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: Math.floor(60 / props.minuteIncrement) }, (_, i) => i * props.minuteIncrement);

const hourText = computed(() => {
  const h = props.modelValue.getHours();
  if (props.clockIdentifier === '24HourClock') return h.toString().padStart(2, '0');
  return h === 0 ? 12 : h > 12 ? h - 12 : h;
});
const minuteText = computed(() => props.modelValue.getMinutes().toString().padStart(2, '0'));
const amPmText = computed(() => props.modelValue.getHours() >= 12 ? 'PM' : 'AM');

const ITEM_HEIGHT = 44;

const toggleOpen = async () => {
  tempHour.value = props.modelValue.getHours();
  const m = props.modelValue.getMinutes();
  tempMinute.value = m - (m % props.minuteIncrement);
  tempAmPm.value = tempHour.value >= 12 ? 'PM' : 'AM';

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
    const newDate = new Date(props.modelValue);
    let finalHour = tempHour.value;
    if (props.clockIdentifier === '12HourClock') {
      const isPm = tempAmPm.value === 'PM';
      if (isPm && finalHour < 12) finalHour += 12;
      if (!isPm && finalHour >= 12) finalHour -= 12;
    }
    newDate.setHours(finalHour);
    newDate.setMinutes(tempMinute.value);
    emit('update:modelValue', newDate);
  }
  isOpen.value = false;
};

const syncScroll = () => {
  if (hourCol.value) hourCol.value.scrollTop = hours.indexOf(tempHour.value) * ITEM_HEIGHT;
  if (minuteCol.value) minuteCol.value.scrollTop = minutes.indexOf(tempMinute.value) * ITEM_HEIGHT;
  if (ampmCol.value && props.clockIdentifier === '12HourClock') {
    ampmCol.value.scrollTop = (tempAmPm.value === 'PM' ? 1 : 0) * ITEM_HEIGHT;
  }
};

let scrollTimeout = null;
const onScroll = (e, type) => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const index = Math.round(e.target.scrollTop / ITEM_HEIGHT);
    if (type === 'hour') tempHour.value = hours[Math.min(index, hours.length - 1)];
    if (type === 'minute') tempMinute.value = minutes[Math.min(index, minutes.length - 1)];
    if (type === 'ampm') tempAmPm.value = index === 0 ? 'AM' : 'PM';
    e.target.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
  }, 100);
};
</script>

<style scoped>
  .win-time-picker {
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
