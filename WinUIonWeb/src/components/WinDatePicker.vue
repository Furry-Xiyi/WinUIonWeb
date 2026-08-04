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
        :class="flyoutAnimClass"
        :style="flyoutStyle"
        @animationend="onFlyoutAnimEnd">
        <div class="picker-columns">
          <div
            v-if="MonthVisible"
            class="picker-col-wrapper picker-month"
            :class="{ wide: !YearVisible }"
            @mouseenter="hoverCol = 'month'"
            @mouseleave="hoverCol = ''">
            <button
              v-show="hoverCol === 'month'"
              class="picker-arrow picker-arrow-up"
              :class="{ pressed: pressedKey === 'month-up' }"
              @pointerdown="startRepeating('month', -1)"
              @pointerup="stopRepeating"
              @pointercancel="stopRepeating"
              @pointerleave="stopRepeating"
              @click="scrollUp('month')">
              <span class="icon" aria-hidden="true">&#xEDDB;</span>
            </button>
            <div class="picker-column" @wheel.prevent="onWheel($event, 'month')">
              <div v-for="(item, i) in monthDisplay" :key="'m' + i" class="picker-item" :class="{ active: item.active }">{{ item.label }}</div>
            </div>
            <button
              v-show="hoverCol === 'month'"
              class="picker-arrow picker-arrow-down"
              :class="{ pressed: pressedKey === 'month-down' }"
              @pointerdown="startRepeating('month', 1)"
              @pointerup="stopRepeating"
              @pointercancel="stopRepeating"
              @pointerleave="stopRepeating"
              @click="scrollDown('month')">
              <span class="icon" aria-hidden="true">&#xEDDC;</span>
            </button>
          </div>

          <div v-if="MonthVisible && DayVisible" class="picker-col-divider"></div>

          <div
            v-if="DayVisible"
            class="picker-col-wrapper picker-day"
            @mouseenter="hoverCol = 'day'"
            @mouseleave="hoverCol = ''">
            <button
              v-show="hoverCol === 'day'"
              class="picker-arrow picker-arrow-up"
              :class="{ pressed: pressedKey === 'day-up' }"
              @pointerdown="startRepeating('day', -1)"
              @pointerup="stopRepeating"
              @pointercancel="stopRepeating"
              @pointerleave="stopRepeating"
              @click="scrollUp('day')">
              <span class="icon" aria-hidden="true">&#xEDDB;</span>
            </button>
            <div class="picker-column" @wheel.prevent="onWheel($event, 'day')">
              <div v-for="(item, i) in dayDisplay" :key="'d' + i" class="picker-item" :class="{ active: item.active }">{{ item.label }}</div>
            </div>
            <button
              v-show="hoverCol === 'day'"
              class="picker-arrow picker-arrow-down"
              :class="{ pressed: pressedKey === 'day-down' }"
              @pointerdown="startRepeating('day', 1)"
              @pointerup="stopRepeating"
              @pointercancel="stopRepeating"
              @pointerleave="stopRepeating"
              @click="scrollDown('day')">
              <span class="icon" aria-hidden="true">&#xEDDC;</span>
            </button>
          </div>

          <template v-if="YearVisible">
            <div v-if="MonthVisible || DayVisible" class="picker-col-divider"></div>
            <div
              class="picker-col-wrapper picker-year"
              @mouseenter="hoverCol = 'year'"
              @mouseleave="hoverCol = ''">
              <button
                v-show="hoverCol === 'year'"
                class="picker-arrow picker-arrow-up"
                :class="{ pressed: pressedKey === 'year-up' }"
                @pointerdown="startRepeating('year', -1)"
                @pointerup="stopRepeating"
                @pointercancel="stopRepeating"
                @pointerleave="stopRepeating"
                @click="scrollUp('year')">
                <span class="icon" aria-hidden="true">&#xEDDB;</span>
              </button>
              <div class="picker-column" @wheel.prevent="onWheel($event, 'year')">
                <div v-for="(item, i) in yearDisplay" :key="'y' + i" class="picker-item" :class="{ active: item.active }">{{ item.label }}</div>
              </div>
              <button
                v-show="hoverCol === 'year'"
                class="picker-arrow picker-arrow-down"
                :class="{ pressed: pressedKey === 'year-down' }"
                @pointerdown="startRepeating('year', 1)"
                @pointerup="stopRepeating"
                @pointercancel="stopRepeating"
                @pointerleave="stopRepeating"
                @click="scrollDown('year')">
                <span class="icon" aria-hidden="true">&#xEDDC;</span>
              </button>
            </div>
          </template>

          <div class="picker-highlight"></div>
        </div>
        <div class="picker-actions">
          <button class="picker-action-btn" :aria-label="t('text.accept')" v-bind="{ 'tooltipservice.tooltip': t('text.accept') }" @click="close(true)"><span class="icon" aria-hidden="true">&#xE8FB;</span></button>
          <button class="picker-action-btn" :aria-label="t('text.cancel')" v-bind="{ 'tooltipservice.tooltip': t('text.cancel') }" @click="close(false)"><span class="icon" aria-hidden="true">&#xE711;</span></button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import WinButton from './WinButton.vue';
import WinTextBlock from './WinTextBlock.vue';
import { useI18n } from './i18n/index';

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
const hoverCol = ref('');
const pressedKey = ref('');
let repeatDelayTimer = 0;
let repeatTimer = 0;

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

const flyoutAnimClass = computed(() => {
  if (isClosing.value) return 'picker-flyout-closing';
  if (isOpen.value) return 'picker-flyout-animate';
  return '';
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

function loopingWindow(items, currentIndex, count) {
  const half = Math.floor(count / 2);
  const result = [];
  for (let offset = -half; offset <= half; offset++) {
    let idx = (currentIndex + offset) % items.length;
    if (idx < 0) idx += items.length;
    result.push({ label: items[idx], active: offset === 0 });
  }
  return result;
}

const monthDisplay = computed(() => loopingWindow(monthNames.value, tempMonth.value - 1, VISIBLE_ITEMS));
const dayDisplay = computed(() => {
  const items = Array.from({ length: daysInTempMonth.value }, (_, i) => formatDay(new globalThis.Date(tempYear.value, tempMonth.value - 1, i + 1)));
  return loopingWindow(items, tempDay.value - 1, VISIBLE_ITEMS);
});
const yearDisplay = computed(() => {
  const idx = years.value.indexOf(tempYear.value);
  return loopingWindow(years.value.map(String), idx >= 0 ? idx : 0, VISIBLE_ITEMS);
});

function scrollUp(type) {
  if (type === 'month') tempMonth.value = tempMonth.value <= 1 ? 12 : tempMonth.value - 1;
  if (type === 'day') tempDay.value = tempDay.value <= 1 ? daysInTempMonth.value : tempDay.value - 1;
  if (type === 'year') {
    const idx = years.value.indexOf(tempYear.value);
    tempYear.value = years.value[(idx - 1 + years.value.length) % years.value.length];
  }
}

function scrollDown(type) {
  if (type === 'month') tempMonth.value = tempMonth.value >= 12 ? 1 : tempMonth.value + 1;
  if (type === 'day') tempDay.value = tempDay.value >= daysInTempMonth.value ? 1 : tempDay.value + 1;
  if (type === 'year') {
    const idx = years.value.indexOf(tempYear.value);
    tempYear.value = years.value[(idx + 1) % years.value.length];
  }
}

function repeatStep(type, direction) {
  if (direction < 0) scrollUp(type);
  else scrollDown(type);
}

function startRepeating(type, direction) {
  stopRepeating();
  pressedKey.value = `${type}-${direction < 0 ? 'up' : 'down'}`;
  repeatDelayTimer = window.setTimeout(() => {
    repeatStep(type, direction);
    repeatTimer = window.setInterval(() => repeatStep(type, direction), 80);
  }, 400);
}

function stopRepeating() {
  window.clearTimeout(repeatDelayTimer);
  window.clearInterval(repeatTimer);
  repeatDelayTimer = 0;
  repeatTimer = 0;
  pressedKey.value = '';
}

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
    transformOrigin: `center ${buttonCenter - top}px`
  };
};

const close = (accept) => {
  if (accept) {
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

function onWheel(event, type) {
  if (event.deltaY > 0) scrollDown(type);
  else scrollUp(type);
}
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
    --ButtonBackground: var(--ctrl-fill-default);
    --ButtonBackgroundPointerOver: var(--ctrl-fill-secondary);
    --ButtonBackgroundPressed: var(--ctrl-fill-tertiary);
    --ButtonBackgroundDisabled: var(--ctrl-fill-disabled, var(--ctrl-fill-tertiary));
    --ButtonBorderBrush: var(--ctrl-border-rest);
    --ButtonBorderBrushTop: var(--ButtonBorderBrush);
    --ButtonBorderBrushPointerOver: var(--ctrl-border-rest);
    --ButtonBorderBrushPointerOverTop: var(--ButtonBorderBrushPointerOver);
    --ButtonBorderBrushPressed: var(--ctrl-border-rest);
    --ButtonBorderBrushPressedTop: var(--ButtonBorderBrushPressed);
    --ButtonBorderBrushDisabled: var(--ctrl-border-disabled, var(--ctrl-border-rest));
    --ButtonBorderBrushDisabledTop: var(--ButtonBorderBrushDisabled);
    --ButtonBorderBrushBottom: var(--ctrl-border-accent);
    --ButtonBorderBrushPointerOverBottom: var(--ctrl-border-accent);
    --ButtonBorderBrushPressedBottom: var(--ctrl-border-rest);
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

  .picker-col-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .picker-month {
    flex: 132 1 0;
  }

  .picker-day,
  .picker-year {
    flex: 78 1 0;
  }

  .picker-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .picker-col-divider {
    width: 1px;
    align-self: stretch;
    background: var(--divider-stroke-default, var(--stroke-divider));
    pointer-events: none;
    position: relative;
    z-index: 3;
  }

  .picker-item {
    height: 40px;
    min-height: 40px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
    color: var(--text-secondary);
    width: 100%;
    margin: 0;
    padding: 3px 0 6px;
    border-radius: 4px;
    position: relative;
    z-index: 1;
    isolation: isolate;
    transition: color 0.1s, font-size 0.1s;
  }

  .picker-item:hover {
    color: var(--text-primary);
  }

  .picker-item::before {
    content: '';
    position: absolute;
    inset: 2px 4px;
    border-radius: 4px;
    z-index: -1;
  }

  .picker-item:hover::before {
    background: var(--subtle-secondary);
  }

  .picker-item.active::before {
    background: rgba(255, 255, 255, 0.14);
  }

  .picker-month .picker-item {
    padding-left: 9px;
  }

  .picker-day .picker-item,
  .picker-year .picker-item {
    justify-content: center;
    padding-left: 0;
  }

  .picker-item.active {
      color: var(--accent-text, var(--accent-aa-text));
      font-weight: 600;
      font-size: 14px;
  }

  .picker-highlight {
    position: absolute;
    left: 4px;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    height: 40px;
    background: var(--accent-base, var(--accent-aa-fill));
    border-radius: 4px;
    pointer-events: none;
    z-index: 0;
  }

  .picker-arrow {
    position: absolute;
    left: 0;
    right: 0;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--ctrl-solid-fill);
    border: none;
    color: var(--text-secondary);
    font-size: 8px;
    cursor: pointer;
    z-index: 3;
    border-radius: 0;
    transition: color var(--fast-duration);
  }

  .picker-arrow-up {
    top: 0;
  }

  .picker-arrow-down {
    bottom: 0;
  }

  .picker-arrow:hover {
    background: var(--ctrl-solid-fill);
    color: var(--text-secondary);
  }

  .picker-arrow.pressed {
    background: var(--ctrl-solid-fill);
  }

  .picker-arrow.pressed .icon {
    display: inline-flex;
    transform: scale(0.875);
  }

  .picker-actions {
    display: flex;
    height: 41px;
    border-top: 1px solid var(--stroke-divider);
  }

  .picker-action-btn {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 4px;
    border-radius: 4px;
  }

    .picker-action-btn:hover {
      background: var(--subtle-secondary);
    }

    .picker-action-btn:active {
      background: var(--subtle-tertiary);
    }
</style>
