<template>
  <div class="win-calendar-date-picker" ref="containerRef">
    <div v-if="Header" class="picker-header">{{ Header }}</div>
    <button class="picker-btn" @click="toggleOpen">
      <span class="picker-text" :class="{ placeholder: !Date }">{{ displayText }}</span>
      <span class="icon picker-icon"></span>
    </button>
    <div v-if="Description" class="picker-description">{{ Description }}</div>

    <Teleport to="body">
      <div v-if="isCalendarOpen" class="picker-overlay" @click="closeCalendar"></div>
      <div v-if="isCalendarOpen" class="picker-flyout flyout-animate" :style="flyoutStyle">
        <WinCalendarView
          :CalendarIdentifier="CalendarIdentifier"
          :DayOfWeekFormat="DayOfWeekFormat"
          :DisplayMode="DisplayMode"
          :FirstDayOfWeek="FirstDayOfWeek"
          :IsGroupLabelVisible="IsGroupLabelVisible"
          :IsOutOfScopeEnabled="IsOutOfScopeEnabled"
          :IsTodayHighlighted="IsTodayHighlighted"
          :MinDate="MinDate"
          :MaxDate="MaxDate"
          :SelectedDates="selectedDates"
          SelectionMode="Single"
          @update:SelectedDates="onDateSelect" />
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue';
import WinCalendarView from './WinCalendarView.vue';

const props = defineProps({
  CalendarIdentifier: { type: String, default: 'GregorianCalendar' },
  CalendarViewStyle: { type: Object, default: null },
  Date: { type: Date, default: null },
  DateFormat: { type: String, default: 'shortdate' },
  DayOfWeekFormat: { type: String, default: '{dayofweek.abbreviated(2)}' },
  Description: { type: String, default: '' },
  DisplayMode: { type: String, default: 'Month' },
  FirstDayOfWeek: { type: String, default: 'Sunday' },
  Header: { type: String, default: '' },
  HeaderPlacement: { type: String, default: 'Top' },
  HeaderTemplate: { type: Object, default: null },
  IsCalendarOpen: { type: Boolean, default: false },
  IsGroupLabelVisible: { type: Boolean, default: true },
  IsOutOfScopeEnabled: { type: Boolean, default: true },
  IsTodayHighlighted: { type: Boolean, default: true },
  LightDismissOverlayMode: { type: String, default: 'Auto' },
  MaxDate: { type: Date, default: () => new globalThis.Date(2120, 11, 31) },
  MinDate: { type: Date, default: () => new globalThis.Date(1920, 0, 1) },
  PlaceholderText: { type: String, default: 'Select a date' }
});

const emit = defineEmits(['update:Date', 'update:IsCalendarOpen', 'DateChanged', 'Opened', 'Closed', 'CalendarViewDayItemChanging']);

const containerRef = ref(null);
const flyoutStyle = ref({});
const localIsCalendarOpen = ref(false);

const selectedDates = computed(() => props.Date ? [props.Date] : []);
const isCalendarOpen = computed(() => props.IsCalendarOpen || localIsCalendarOpen.value);

const displayText = computed(() => {
  if (!props.Date) return props.PlaceholderText;
  if (props.DateFormat === 'longdate') return props.Date.toLocaleDateString(undefined, { dateStyle: 'long' });
  return props.Date.toLocaleDateString();
});

const toggleOpen = async () => {
  if (isCalendarOpen.value) {
    closeCalendar();
    return;
  }
  localIsCalendarOpen.value = true;
  emit('update:IsCalendarOpen', true);
  emit('Opened');
  await nextTick();
  const rect = containerRef.value.getBoundingClientRect();
  flyoutStyle.value = {
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`
  };
};

const closeCalendar = () => {
  localIsCalendarOpen.value = false;
  emit('update:IsCalendarOpen', false);
  emit('Closed');
};

const onDateSelect = (dates) => {
  const oldDate = props.Date;
  const newDate = dates[0] ?? null;
  emit('update:Date', newDate);
  emit('DateChanged', { oldDate, newDate });
  closeCalendar();
};
</script>

<style scoped>
  .win-calendar-date-picker {
    display: inline-flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
  }

  .picker-header {
    color: var(--text-primary);
    font-size: 14px;
    line-height: 20px;
  }

  .picker-description {
    color: var(--text-secondary);
    font-size: 12px;
    line-height: 16px;
  }

  .picker-btn {
    position: relative;
    border: none;
    border-radius: 4px;
    padding: 0 11px;
    font-size: 14px;
    width: 296px;
    height: 32px;
    background: var(--ctrl-fill-default);
    color: var(--text-primary);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
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

  .picker-btn:hover {
    background: var(--ctrl-fill-secondary);
  }

  .picker-btn:active {
    background: color-mix(in srgb, var(--ctrl-fill-tertiary) 100%, black 8%);
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
    background-image: var(--flyout-material-overlay);
    border: 1px solid var(--ctrl-border);
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.14);
    backdrop-filter: var(--flyout-backdrop);
    -webkit-backdrop-filter: var(--flyout-backdrop);
  }
</style>
