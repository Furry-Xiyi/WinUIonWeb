<template>
  <div class="win-date-picker" ref="containerRef">
    <WinTextBlock v-if="Header" class="picker-header" :Text="Header" />
    <WinButton class="picker-btn" :class="{ 'has-no-date': !hasSelectedDate }" Padding="0" MinHeight="32" :IsEnabled="IsEnabled" @Click="toggleOpen">
      <div v-if="MonthVisible" class="picker-column-text picker-month-text">{{ monthText }}</div>
      <div v-if="DayVisible" class="picker-column-text picker-day-text">{{ dayText }}</div>
      <div v-if="YearVisible" class="picker-column-text picker-year-text">{{ yearText }}</div>
    </WinButton>

    <Teleport to="body">
      <div v-if="showFlyout" class="picker-overlay" @click="close(false)"></div>
      <div
        v-if="showFlyout"
        ref="flyoutRef"
        class="picker-flyout"
        :class="{ 'picker-flyout-closing': isClosing }"
        :style="flyoutStyle"
        @animationend="onFlyoutAnimEnd">
        <div class="picker-columns">
          <WinPickerColumn
            ref="monthColRef"
            v-if="MonthVisible"
            class="picker-month"
            :items="monthItems"
            :value="monthIndex"
            :wrap="true"
            :aria-label="t('control.datepicker.month')"
            @change="onMonthChange" />

          <div v-if="MonthVisible && DayVisible" class="picker-col-divider"></div>

          <WinPickerColumn
            ref="dayColRef"
            v-if="DayVisible"
            class="picker-day"
            :items="dayItems"
            :value="dayIndex"
            :wrap="true"
            :aria-label="t('control.datepicker.day')"
            @change="onDayChange" />

          <template v-if="YearVisible">
            <div v-if="MonthVisible || DayVisible" class="picker-col-divider"></div>
            <WinPickerColumn
              ref="yearColRef"
              class="picker-year"
              :items="yearItems"
              :value="yearIndex"
              :wrap="true"
              :aria-label="t('control.datepicker.year')"
              @change="onYearChange" />
          </template>
        </div>
        <div class="picker-actions">
          <WinButton Style="SubtleButtonStyle" class="picker-action-btn" :aria-label="t('text.accept')" v-bind="{ 'tooltipservice.tooltip': t('text.accept') }" Padding="0" Margin="4" MinWidth="0" MinHeight="0" FontSize="16" @Click="close(true)"><span class="icon" aria-hidden="true">&#xE8FB;</span></WinButton>
          <WinButton Style="SubtleButtonStyle" class="picker-action-btn" :aria-label="t('text.cancel')" v-bind="{ 'tooltipservice.tooltip': t('text.cancel') }" Padding="0" Margin="4" MinWidth="0" MinHeight="0" FontSize="16" @Click="close(false)"><span class="icon" aria-hidden="true">&#xE711;</span></WinButton>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue';
import WinButton from './WinButton.vue';
import WinPickerColumn from './WinPickerColumn.vue';
import WinTextBlock from './WinTextBlock.vue';
import { useI18n } from './i18n/index';
import { useFlyoutAnimation } from './useFlyoutAnimation';

const props = defineProps({
  CalendarIdentifier: { type: String, default: 'GregorianCalendar' },
  Date: { type: Date, default: null },
  DayFormat: { type: String, default: 'day.integer' },
  DayVisible: { type: Boolean, default: true },
  Header: { type: String, default: '' },
  HeaderPlacement: { type: String, default: 'Top' },
  HeaderTemplate: { type: Object, default: null },
  IsEnabled: { type: Boolean, default: true },
  Language: { type: String, default: '' },
  LightDismissOverlayMode: { type: String, default: 'Auto' },
  MaxYear: { type: Date, default: () => new globalThis.Date(new globalThis.Date().getFullYear() + 50, 11, 31) },
  MinYear: { type: Date, default: () => new globalThis.Date(new globalThis.Date().getFullYear() - 50, 0, 1) },
  MonthFormat: { type: String, default: 'month.full' },
  MonthVisible: { type: Boolean, default: true },
  Orientation: { type: String, default: 'Horizontal' },
  SelectedDate: { type: Date, default: null },
  YearFormat: { type: String, default: 'year.full' },
  YearVisible: { type: Boolean, default: true }
});

const emit = defineEmits(['update:Date', 'update:SelectedDate', 'DateChanged', 'SelectedDateChanged']);
const { t, locale } = useI18n();

const showFlyout = ref(false);
const isOpen = ref(false);
const isClosing = ref(false);
const containerRef = ref(null);
const flyoutRef = ref(null);
const flyoutStyle = ref({});
const monthColRef = ref(null);
const dayColRef = ref(null);
const yearColRef = ref(null);

const flyoutAnimation = useFlyoutAnimation(flyoutRef, { Origin: 'center' });

const tempMonth = ref(1);
const tempDay = ref(1);
const tempYear = ref(2024);
const localDate = ref(null);

const pickerLocale = computed(() => props.Language || locale);
const monthNames = computed(() => Array.from(
  { length: 12 },
  (_, month) => new Intl.DateTimeFormat(pickerLocale.value, { month: 'long' }).format(new globalThis.Date(2024, month, 1))
));
const monthNamesShort = computed(() => Array.from(
  { length: 12 },
  (_, month) => new Intl.DateTimeFormat(pickerLocale.value, { month: 'short' }).format(new globalThis.Date(2024, month, 1))
));

const VISIBLE_ITEMS = 7;
const ITEM_HEIGHT = 40;
const COLUMNS_HEIGHT = VISIBLE_ITEMS * ITEM_HEIGHT;
const ACTIONS_HEIGHT = 41;
const FLYOUT_BORDER_HEIGHT = 2;
const FLYOUT_MARGIN = 8;
const BAND_CENTER_FROM_TOP = 1 + COLUMNS_HEIGHT / 2;

const isValidDate = (value) => value instanceof globalThis.Date && !Number.isNaN(value.getTime());
const hasSelectedDate = computed(() => isValidDate(props.SelectedDate) || isValidDate(props.Date) || isValidDate(localDate.value));
const currentDate = computed(() => {
  if (isValidDate(props.SelectedDate)) return props.SelectedDate;
  if (isValidDate(props.Date)) return props.Date;
  if (isValidDate(localDate.value)) return localDate.value;
  return new globalThis.Date();
});
const minYearValue = computed(() => isValidDate(props.MinYear) ? props.MinYear.getFullYear() : new globalThis.Date().getFullYear() - 50);
const maxYearValue = computed(() => isValidDate(props.MaxYear) ? props.MaxYear.getFullYear() : new globalThis.Date().getFullYear() + 50);
const years = computed(() => {
  const min = Math.min(minYearValue.value, maxYearValue.value);
  const max = Math.max(minYearValue.value, maxYearValue.value);
  return Array.from({ length: max - min + 1 }, (_, i) => min + i);
});

const daysInTempMonth = computed(() => new globalThis.Date(tempYear.value, tempMonth.value, 0).getDate());

const formatMonth = (date) => {
  if (props.MonthFormat.includes('abbreviated')) return monthNamesShort.value[date.getMonth()];
  if (props.MonthFormat.includes('integer')) return String(date.getMonth() + 1);
  return monthNames.value[date.getMonth()];
};

const formatDay = (date) => {
  const day = date.getDate();
  const text = props.DayFormat.includes('integer(2)') ? String(day).padStart(2, '0') : String(day);
  if (props.DayFormat.includes('dayofweek.abbreviated')) {
    return `${text} (${date.toLocaleDateString(pickerLocale.value, { weekday: 'short' })})`;
  }
  if (props.DayFormat.includes('dayofweek.full')) {
    return `${text} (${date.toLocaleDateString(pickerLocale.value, { weekday: 'long' })})`;
  }
  return text;
};

const formatYear = (date) => props.YearFormat.includes('abbreviated')
  ? String(date.getFullYear()).slice(-2)
  : String(date.getFullYear());

const monthText = computed(() => hasSelectedDate.value ? formatMonth(currentDate.value) : t('control.datepicker.month'));
const dayText = computed(() => hasSelectedDate.value ? formatDay(currentDate.value) : t('control.datepicker.day'));
const yearText = computed(() => hasSelectedDate.value ? formatYear(currentDate.value) : t('control.datepicker.year'));

const monthItems = computed(() => monthNames.value);
const monthIndex = computed(() => Math.max(0, tempMonth.value - 1));
const dayItems = computed(() => Array.from(
  { length: daysInTempMonth.value },
  (_, i) => formatDay(new globalThis.Date(tempYear.value, tempMonth.value - 1, i + 1))
));
const dayIndex = computed(() => Math.min(tempDay.value - 1, dayItems.value.length - 1));
const yearItems = computed(() => years.value.map(String));
const yearIndex = computed(() => {
  const idx = years.value.indexOf(tempYear.value);
  return idx >= 0 ? idx : 0;
});

const onMonthChange = (index) => {
  tempMonth.value = index + 1;
};

const onDayChange = (index) => {
  tempDay.value = index + 1;
};

const onYearChange = (index) => {
  tempYear.value = years.value[index];
};

watch([tempMonth, tempYear], () => {
  if (tempDay.value > daysInTempMonth.value) {
    tempDay.value = daysInTempMonth.value;
  }
});

const clampDate = (date) => {
  if (isValidDate(props.MinYear) && date < props.MinYear) return new globalThis.Date(props.MinYear);
  if (isValidDate(props.MaxYear) && date > props.MaxYear) return new globalThis.Date(props.MaxYear);
  return date;
};

const toggleOpen = async () => {
  if (!props.IsEnabled) return;
  if (isOpen.value) {
    close(false);
    return;
  }
  const date = clampDate(currentDate.value);
  tempMonth.value = date.getMonth() + 1;
  tempDay.value = date.getDate();
  tempYear.value = Math.max(minYearValue.value, Math.min(maxYearValue.value, date.getFullYear()));
  showFlyout.value = true;
  isOpen.value = true;
  isClosing.value = false;
  await nextTick();
  const rect = containerRef.value.getBoundingClientRect();
  const buttonCenter = rect.top + rect.height / 2;
  const flyoutRect = flyoutRef.value?.getBoundingClientRect();
  const flyoutHeight = flyoutRect?.height || COLUMNS_HEIGHT + ACTIONS_HEIGHT + FLYOUT_BORDER_HEIGHT;
  const flyoutWidth = flyoutRect?.width || rect.width;
  const idealTop = buttonCenter - BAND_CENTER_FROM_TOP;
  const maxTop = Math.max(FLYOUT_MARGIN, window.innerHeight - flyoutHeight - FLYOUT_MARGIN);
  const top = Math.min(Math.max(FLYOUT_MARGIN, idealTop), maxTop);
  const left = Math.min(Math.max(FLYOUT_MARGIN, rect.left), Math.max(FLYOUT_MARGIN, window.innerWidth - flyoutWidth - FLYOUT_MARGIN));
  flyoutStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    width: `${rect.width}px`,
    transformOrigin: 'center center'
  };
  await nextTick();
  flyoutAnimation.play();
};

const close = (accept) => {
  flyoutAnimation.cancel();
  if (accept) {
    monthColRef.value?.flush();
    dayColRef.value?.flush();
    yearColRef.value?.flush();
    const finalDay = Math.min(tempDay.value, new globalThis.Date(tempYear.value, tempMonth.value, 0).getDate());
    const oldDate = currentDate.value;
    const newDate = clampDate(new globalThis.Date(tempYear.value, tempMonth.value - 1, finalDay));
    if (!isValidDate(props.Date) && !isValidDate(props.SelectedDate)) localDate.value = newDate;
    emit('update:Date', newDate);
    emit('update:SelectedDate', newDate);
    emit('DateChanged', { oldDate, newDate });
    emit('SelectedDateChanged', { oldDate, newDate });
  }
  isClosing.value = true;
  isOpen.value = false;
};

const onFlyoutAnimEnd = () => {
  if (isClosing.value) {
    showFlyout.value = false;
    isClosing.value = false;
  }
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
    align-items: stretch;
    justify-content: stretch;
    width: 296px;
    height: 32px;
    min-width: 296px;
    border-radius: 4px;
    font-size: 14px;
    gap: 0;
  }

  .picker-btn.has-no-date {
    --ButtonForeground: var(--text-secondary);
    --ButtonForegroundPointerOver: var(--text-primary);
    --ButtonForegroundPressed: var(--text-secondary);
  }

  .picker-column-text {
    display: flex;
    align-items: center;
    border-right: 1px solid var(--ctrl-border, var(--stroke-divider));
    min-width: 0;
    height: 100%;
    box-sizing: border-box;
  }

  .picker-month-text {
    flex: 132 1 0;
    justify-content: flex-start;
    padding-left: 12px;
  }

  .picker-day-text,
  .picker-year-text {
    flex: 78 1 0;
    justify-content: center;
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
    --win-acrylic-fill: var(--flyout-bg);
    isolation: isolate;
    background: transparent;
    border: 1px solid var(--stroke-surface-flyout);
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.14);
    -webkit-backdrop-filter: var(--flyout-backdrop);
    backdrop-filter: var(--flyout-backdrop);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 296px;
    max-height: 398px;
  }

  .picker-columns {
    position: relative;
    display: flex;
    height: 280px;
    overflow: hidden;
  }

  .picker-columns::before {
    content: '';
    position: absolute;
    left: 4px;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    height: 40px;
    border-radius: 4px;
    background: var(--accent-base, var(--accent-aa-fill));
    pointer-events: none;
    z-index: 0;
  }

  .picker-month {
    flex: 132 1 0;
    --picker-item-justify: flex-start;
    --picker-item-padding-left: 9px;
  }

  .picker-day,
  .picker-year {
    flex: 78 1 0;
    --picker-item-justify: center;
  }

  .picker-col-divider {
    width: 1px;
    align-self: stretch;
    background: linear-gradient(
      to bottom,
      var(--divider-stroke-default, var(--stroke-divider)) 0,
      var(--divider-stroke-default, var(--stroke-divider)) calc(50% - 20px),
      transparent calc(50% - 20px),
      transparent calc(50% + 20px),
      var(--divider-stroke-default, var(--stroke-divider)) calc(50% + 20px),
      var(--divider-stroke-default, var(--stroke-divider)) 100%
    );
    pointer-events: none;
    position: relative;
    z-index: 3;
  }

  .picker-actions {
    display: flex;
    height: 41px;
    border-top: 1px solid var(--stroke-divider);
  }

  .picker-action-btn {
    flex: 1;
  }
</style>
