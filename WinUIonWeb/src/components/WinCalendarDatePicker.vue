<template>
  <div class="win-calendar-date-picker" ref="containerRef">
    <WinTextBlock v-if="Header" class="picker-header" :Text="Header" />
    <WinButton
      class="calendar-date-picker-button"
      Padding="0"
      MinHeight="32"
      :IsEnabled="IsEnabled"
      @Click="toggleOpen">
      <span class="picker-text" :class="{ placeholder: !effectiveDate }">{{ displayText }}</span>
      <span class="picker-icon" aria-hidden="true">&#xE787;</span>
    </WinButton>
    <WinTextBlock v-if="Description" class="picker-description" :Text="Description" />

    <Teleport to="body">
      <div v-if="showFlyout" class="picker-overlay" @click="closeCalendar"></div>
      <div
        v-if="showFlyout"
        ref="flyoutRef"
        class="picker-flyout"
        :class="isClosing ? 'picker-flyout-closing' : 'picker-flyout-animate'"
        :style="flyoutStyle"
        @animationend="onFlyoutAnimEnd">
        <WinCalendarView
          :CalendarIdentifier="CalendarIdentifier"
          :DayOfWeekFormat="DayOfWeekFormat"
          :DisplayMode="DisplayMode"
          :FirstDayOfWeek="FirstDayOfWeek"
          :IsGroupLabelVisible="IsGroupLabelVisible"
          :IsEnabled="IsEnabled"
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
import WinButton from './WinButton.vue';
import WinCalendarView from './WinCalendarView.vue';
import WinTextBlock from './WinTextBlock.vue';

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
  IsEnabled: { type: Boolean, default: true },
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
const flyoutRef = ref(null);
const flyoutStyle = ref({});
const localIsCalendarOpen = ref(false);
const showFlyout = ref(false);
const isClosing = ref(false);
const localDate = ref(null);
const FLYOUT_MARGIN = 8;
const FLYOUT_GAP = 4;

const effectiveDate = computed(() => props.Date ?? localDate.value);
const selectedDates = computed(() => effectiveDate.value ? [effectiveDate.value] : []);
const isCalendarOpen = computed(() => props.IsCalendarOpen || localIsCalendarOpen.value);

const displayText = computed(() => {
  if (!effectiveDate.value) return props.PlaceholderText;
  if (props.DateFormat === 'longdate') return effectiveDate.value.toLocaleDateString(undefined, { dateStyle: 'long' });
  return effectiveDate.value.toLocaleDateString();
});

const toggleOpen = async () => {
  if (!props.IsEnabled) return;
  if (isCalendarOpen.value) {
    closeCalendar();
    return;
  }
  localIsCalendarOpen.value = true;
  showFlyout.value = true;
  isClosing.value = false;
  emit('update:IsCalendarOpen', true);
  emit('Opened');
  await nextTick();
  const rect = containerRef.value.getBoundingClientRect();
  const flyoutRect = flyoutRef.value?.getBoundingClientRect();
  const flyoutWidth = flyoutRect?.width || 304;
  const flyoutHeight = flyoutRect?.height || 404;
  const belowTop = rect.bottom + FLYOUT_GAP;
  const aboveTop = rect.top - flyoutHeight - FLYOUT_GAP;
  const fitsBelow = belowTop + flyoutHeight <= window.innerHeight - FLYOUT_MARGIN;
  const fitsAbove = aboveTop >= FLYOUT_MARGIN;
  const maxTop = Math.max(FLYOUT_MARGIN, window.innerHeight - flyoutHeight - FLYOUT_MARGIN);
  const top = fitsBelow
    ? belowTop
    : fitsAbove
      ? aboveTop
      : Math.min(Math.max(FLYOUT_MARGIN, belowTop), maxTop);
  const left = Math.min(Math.max(FLYOUT_MARGIN, rect.left), Math.max(FLYOUT_MARGIN, window.innerWidth - flyoutWidth - FLYOUT_MARGIN));
  flyoutStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    transformOrigin: top < rect.top ? 'bottom center' : 'top center'
  };
};

const closeCalendar = () => {
  if (!showFlyout.value || isClosing.value) return;
  localIsCalendarOpen.value = false;
  emit('update:IsCalendarOpen', false);
  isClosing.value = true;
};

const onFlyoutAnimEnd = () => {
  if (isClosing.value) {
    showFlyout.value = false;
    isClosing.value = false;
    emit('Closed');
  }
};

const onDateSelect = (dates) => {
  const oldDate = effectiveDate.value;
  const newDate = dates[0] ?? null;
  if (props.Date === null) localDate.value = newDate;
  emit('update:Date', newDate);
  emit('DateChanged', { oldDate, newDate });
  closeCalendar();
};
</script>

<style scoped>
  .win-calendar-date-picker {
    display: inline-flex;
    flex-direction: column;
    gap: 0;
    position: relative;
  }

  .picker-header {
    color: var(--text-primary);
    font-size: 14px;
    line-height: 20px;
    margin: 0 0 8px;
  }

  .picker-description {
    color: var(--text-secondary);
    font-size: 12px;
    line-height: 16px;
    margin-top: 4px;
  }

  .calendar-date-picker-button {
    display: grid;
    grid-template-columns: minmax(0, auto) 32px;
    min-width: 0;
    width: auto;
    height: 32px;
    border-radius: 4px;
    gap: 0;
    --ButtonBorderBrush: var(--ctrl-border-rest);
    --ButtonBorderBrushTop: var(--ButtonBorderBrush);
    --ButtonBorderBrushPointerOver: var(--ctrl-border-rest);
    --ButtonBorderBrushPointerOverTop: var(--ButtonBorderBrushPointerOver);
    --ButtonBorderBrushPressed: var(--ctrl-border);
    --ButtonBorderBrushPressedTop: var(--ButtonBorderBrushPressed);
    --ButtonBorderBrushBottom: var(--ctrl-elevation-bottom);
    --ButtonBorderBrushPointerOverBottom: var(--ctrl-elevation-bottom);
    --ButtonBorderBrushPressedBottom: var(--ctrl-border);
  }

  .picker-text {
    min-width: 0;
    padding: 0 12px 2px;
    color: var(--text-primary);
    font-size: 14px;
    line-height: 20px;
    text-align: left;
    white-space: nowrap;
  }

  .picker-text.placeholder {
    color: var(--text-secondary);
  }

  .picker-icon {
    width: 32px;
    color: var(--text-secondary);
    font-size: 12px;
    line-height: 32px;
    text-align: center;
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
    --calendar-view-fill: transparent;
    --calendar-view-backdrop: none;
    isolation: isolate;
    background: transparent;
    border: 1px solid var(--ctrl-border);
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.14);
    -webkit-backdrop-filter: var(--flyout-backdrop);
    backdrop-filter: var(--flyout-backdrop);
    min-width: 304px;
  }

  .picker-flyout-animate,
  .picker-flyout-closing {
    transform-origin: top center;
  }
</style>
