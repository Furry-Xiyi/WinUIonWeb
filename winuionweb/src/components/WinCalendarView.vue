<!-- WinCalendarView.vue -->
<template>
  <div class="win-calendar-view" :class="{ 'hide-group-label': !isGroupLabelVisible }">
    <div class="calendar-header">
      <div class="calendar-title">{{ monthNames[currentMonth] }} {{ currentYear }}</div>
      <div class="calendar-nav">
        <button class="icon-btn" @click="changeMonth(-1)">&#xE76B;</button>
        <button class="icon-btn" @click="changeMonth(1)">&#xE76C;</button>
      </div>
    </div>
    <div class="calendar-days-header">
      <span v-for="day in dayNames" :key="day">{{ day }}</span>
    </div>
    <div class="calendar-grid">
      <button v-for="(day, index) in calendarDays"
              :key="index"
              class="calendar-day"
              :class="{
          'out-of-scope': day.isOutOfScope,
          'hidden': day.isOutOfScope && !isOutOfScopeEnabled,
          'selected': isSelected(day),
          'today': day.isToday
        }"
              @click="selectDay(day)">
        <div class="day-text">{{ day.date }}</div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: { type: [Date, Array], default: null },
  selectionMode: { type: String, default: 'Single' },
  isOutOfScopeEnabled: { type: Boolean, default: true },
  isGroupLabelVisible: { type: Boolean, default: true },
  language: { type: String, default: 'English' },
  calendarIdentifier: { type: String, default: 'Gregorian' }
});

const emit = defineEmits(['update:modelValue']);

const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

const monthNames = computed(() => {
  return props.language === 'English'
    ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
});

const dayNames = computed(() => {
  return props.language === 'English'
    ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    : ['日', '一', '二', '三', '四', '五', '六'];
});

const calendarDays = computed(() => {
  const days = [];
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear.value, currentMonth.value, 0).getDate();
  const today = new Date();

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: daysInPrevMonth - i,
      month: currentMonth.value - 1,
      year: currentYear.value,
      isOutOfScope: true,
      isToday: false,
      fullDate: new Date(currentYear.value, currentMonth.value - 1, daysInPrevMonth - i)
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const fullDate = new Date(currentYear.value, currentMonth.value, i);
    days.push({
      date: i,
      month: currentMonth.value,
      year: currentYear.value,
      isOutOfScope: false,
      isToday: fullDate.toDateString() === today.toDateString(),
      fullDate
    });
  }

  let nextMonthDay = 1;
  while (days.length % 7 !== 0 || days.length < 42) {
    days.push({
      date: nextMonthDay++,
      month: currentMonth.value + 1,
      year: currentYear.value,
      isOutOfScope: true,
      isToday: false,
      fullDate: new Date(currentYear.value, currentMonth.value + 1, nextMonthDay - 1)
    });
  }

  return days;
});

const changeMonth = (offset) => {
  const newDate = new Date(currentYear.value, currentMonth.value + offset, 1);
  currentMonth.value = newDate.getMonth();
  currentYear.value = newDate.getFullYear();
};

const isSelected = (day) => {
  if (props.selectionMode === 'None' || !props.modelValue) return false;
  if (props.selectionMode === 'Single') {
    return props.modelValue.toDateString() === day.fullDate.toDateString();
  }
  if (props.selectionMode === 'Multiple' && Array.isArray(props.modelValue)) {
    return props.modelValue.some(d => d.toDateString() === day.fullDate.toDateString());
  }
  return false;
};

const selectDay = (day) => {
  if (props.selectionMode === 'None') return;
  if (day.isOutOfScope && !props.isOutOfScopeEnabled) return;

  if (props.selectionMode === 'Single') {
    emit('update:modelValue', day.fullDate);
  } else if (props.selectionMode === 'Multiple') {
    const currentList = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const index = currentList.findIndex(d => d.toDateString() === day.fullDate.toDateString());
    if (index >= 0) currentList.splice(index, 1);
    else currentList.push(day.fullDate);
    emit('update:modelValue', currentList);
  }
};
</script>

<style scoped>
  .win-calendar-view {
    width: 300px;
    background: var(--layer-default);
    border: 1px solid var(--card-stroke);
    border-radius: 8px;
    padding: 12px;
    box-sizing: border-box;
  }

  .hide-group-label .calendar-title {
    visibility: hidden;
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 0 4px;
  }

  .calendar-title {
    font-weight: 600;
    font-size: 14px;
    cursor: default;
  }

  .calendar-nav {
    display: flex;
    gap: 4px;
  }

  .icon-btn {
    font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
    background: transparent;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }

    .icon-btn:hover {
      background: var(--subtle-secondary);
    }

    .icon-btn:active {
      background: var(--subtle-tertiary);
      color: var(--text-secondary);
    }

  .calendar-days-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-weight: 600;
    font-size: 12px;
    margin-bottom: 8px;
    color: var(--text-primary);
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  .calendar-day {
    width: 38px;
    height: 38px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: var(--text-primary);
    margin: 0 auto;
  }

    .calendar-day:hover:not(.hidden) {
      background: var(--subtle-secondary);
    }

    .calendar-day:active:not(.hidden) {
      background: var(--subtle-tertiary);
    }

    .calendar-day.out-of-scope {
      color: var(--text-disabled);
    }

    .calendar-day.hidden {
      visibility: hidden;
    }

    .calendar-day.today {
      background: var(--accent-base);
      color: var(--accent-text);
      font-weight: 600;
    }

      .calendar-day.today:hover {
        background: var(--accent-hover);
      }

    .calendar-day.selected {
      background: var(--subtle-transparent);
      border: 1px solid var(--accent-base);
      color: var(--text-primary);
    }

      .calendar-day.selected.today {
        border-color: var(--text-primary);
      }
</style>
