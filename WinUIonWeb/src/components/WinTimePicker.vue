<template>
  <div class="win-time-picker" ref="containerRef">
    <WinTextBlock v-if="Header" class="picker-header" :Text="Header" />
    <WinButton class="picker-btn" :class="{ 'has-no-time': !hasSelectedTime }" Padding="0" MinHeight="32" :IsEnabled="IsEnabled" @Click="toggleOpen">
      <div class="picker-column-text">{{ hourText }}</div>
      <div class="picker-column-text">{{ minuteText }}</div>
      <div v-if="ClockIdentifier === '12HourClock'" class="picker-column-text">{{ amPmText }}</div>
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
          <div class="picker-col-wrapper" @mouseenter="hoverCol = 'hour'" @mouseleave="hoverCol = ''">
            <button
              v-show="hoverCol === 'hour'"
              class="picker-arrow picker-arrow-up"
              :class="{ pressed: pressedKey === 'hour-up' }"
              @pointerdown="startRepeating('hour', -1)"
              @pointerup="stopRepeating"
              @pointercancel="stopRepeating"
              @pointerleave="stopRepeating"
              @click="scrollUp('hour')">
              <span class="icon" aria-hidden="true">&#xEDDB;</span>
            </button>
            <div class="picker-column" @wheel.prevent="onWheel($event, 'hour')">
              <div v-for="(item, i) in hourDisplay" :key="'h' + i" class="picker-item" :class="{ active: item.active }">{{ item.label }}</div>
            </div>
            <button
              v-show="hoverCol === 'hour'"
              class="picker-arrow picker-arrow-down"
              :class="{ pressed: pressedKey === 'hour-down' }"
              @pointerdown="startRepeating('hour', 1)"
              @pointerup="stopRepeating"
              @pointercancel="stopRepeating"
              @pointerleave="stopRepeating"
              @click="scrollDown('hour')">
              <span class="icon" aria-hidden="true">&#xEDDC;</span>
            </button>
          </div>
          <div class="picker-col-divider"></div>
          <div class="picker-col-wrapper" @mouseenter="hoverCol = 'minute'" @mouseleave="hoverCol = ''">
            <button
              v-show="hoverCol === 'minute'"
              class="picker-arrow picker-arrow-up"
              :class="{ pressed: pressedKey === 'minute-up' }"
              @pointerdown="startRepeating('minute', -1)"
              @pointerup="stopRepeating"
              @pointercancel="stopRepeating"
              @pointerleave="stopRepeating"
              @click="scrollUp('minute')">
              <span class="icon" aria-hidden="true">&#xEDDB;</span>
            </button>
            <div class="picker-column" @wheel.prevent="onWheel($event, 'minute')">
              <div v-for="(item, i) in minuteDisplay" :key="'m' + i" class="picker-item" :class="{ active: item.active }">{{ item.label }}</div>
            </div>
            <button
              v-show="hoverCol === 'minute'"
              class="picker-arrow picker-arrow-down"
              :class="{ pressed: pressedKey === 'minute-down' }"
              @pointerdown="startRepeating('minute', 1)"
              @pointerup="stopRepeating"
              @pointercancel="stopRepeating"
              @pointerleave="stopRepeating"
              @click="scrollDown('minute')">
              <span class="icon" aria-hidden="true">&#xEDDC;</span>
            </button>
          </div>
          <template v-if="ClockIdentifier === '12HourClock'">
            <div class="picker-col-divider"></div>
            <div class="picker-col-wrapper" @mouseenter="hoverCol = 'ampm'" @mouseleave="hoverCol = ''">
              <button
                v-show="hoverCol === 'ampm' && tempAmPm === 'PM'"
                class="picker-arrow picker-arrow-up"
                :class="{ pressed: pressedKey === 'ampm-up' }"
                @pointerdown="startRepeating('ampm', -1)"
                @pointerup="stopRepeating"
                @pointercancel="stopRepeating"
                @pointerleave="stopRepeating"
                @click="scrollUp('ampm')">
                <span class="icon" aria-hidden="true">&#xEDDB;</span>
              </button>
              <div class="picker-column" @wheel.prevent="onWheel($event, 'ampm')">
                <div v-for="(item, i) in ampmDisplay" :key="'ap' + i" class="picker-item" :class="{ active: item.active, empty: !item.label }">{{ item.label }}</div>
              </div>
              <button
                v-show="hoverCol === 'ampm' && tempAmPm === 'AM'"
                class="picker-arrow picker-arrow-down"
                :class="{ pressed: pressedKey === 'ampm-down' }"
                @pointerdown="startRepeating('ampm', 1)"
                @pointerup="stopRepeating"
                @pointercancel="stopRepeating"
                @pointerleave="stopRepeating"
                @click="scrollDown('ampm')">
                <span class="icon" aria-hidden="true">&#xEDDC;</span>
              </button>
            </div>
          </template>
          <div class="picker-highlight"></div>
        </div>
        <div class="picker-actions">
          <button class="picker-action-btn" @click="close(true)"><span class="icon" aria-hidden="true">&#xE8FB;</span></button>
          <button class="picker-action-btn" @click="close(false)"><span class="icon" aria-hidden="true">&#xE711;</span></button>
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
  ClockIdentifier: { type: String, default: '12HourClock' },
  Header: { type: String, default: '' },
  HeaderPlacement: { type: String, default: 'Top' },
  HeaderTemplate: { type: Object, default: null },
  IsEnabled: { type: Boolean, default: true },
  Language: { type: String, default: '' },
  LightDismissOverlayMode: { type: String, default: 'Auto' },
  MinuteIncrement: { type: Number, default: 1 },
  SelectedTime: { type: Object, default: null },
  Time: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:Time', 'update:SelectedTime', 'TimeChanged', 'SelectedTimeChanged']);
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

const tempHour = ref(0);
const tempMinute = ref(0);
const tempAmPm = ref('AM');
const localTime = ref(null);

const VISIBLE_ITEMS = 7;
const ITEM_HEIGHT = 40;
const COLUMNS_HEIGHT = VISIBLE_ITEMS * ITEM_HEIGHT;
const ACTIONS_HEIGHT = 41;
const FLYOUT_BORDER_HEIGHT = 2;
const FLYOUT_MARGIN = 8;
const BAND_CENTER_FROM_TOP = 1 + COLUMNS_HEIGHT / 2;

const normalizedMinuteIncrement = computed(() => {
  const value = Math.trunc(props.MinuteIncrement);
  return value > 0 && value <= 59 ? value : 1;
});

const pickerLocale = computed(() => props.Language || locale);
const formatPeriod = (hour) => {
  const parts = new Intl.DateTimeFormat(pickerLocale.value, { hour: 'numeric', hour12: true })
    .formatToParts(new globalThis.Date(2024, 0, 1, hour));
  return parts.find((part) => part.type === 'dayPeriod')?.value || (hour < 12 ? t('control.timepicker.am') : t('control.timepicker.pm'));
};
const amLabel = computed(() => formatPeriod(9));
const pmLabel = computed(() => formatPeriod(15));
const isTimeValue = (value) => Number.isFinite(value?.hour) && Number.isFinite(value?.minute);
const hasSelectedTime = computed(() => isTimeValue(props.SelectedTime) || isTimeValue(props.Time) || isTimeValue(localTime.value));

const timeValue = computed(() => {
  return normalizeTime(props.SelectedTime ?? props.Time ?? localTime.value ?? { hour: 0, minute: 0 });
});
const hours = computed(() => {
  if (props.ClockIdentifier === '12HourClock') return Array.from({ length: 12 }, (_, i) => i + 1);
  return Array.from({ length: 24 }, (_, i) => i);
});
const minutes = computed(() => {
  const count = Math.ceil(60 / normalizedMinuteIncrement.value);
  return Array.from({ length: count }, (_, i) => Math.min(59, i * normalizedMinuteIncrement.value));
});

const flyoutAnimClass = computed(() => {
  if (isClosing.value) return 'picker-flyout-closing';
  if (isOpen.value) return 'picker-flyout-animate';
  return '';
});

const hourText = computed(() => {
  if (!hasSelectedTime.value) return t('control.timepicker.hour');
  const h = timeValue.value.hour;
  if (props.ClockIdentifier === '24HourClock') return String(h).padStart(2, '0');
  const h12 = h % 12;
  return h12 === 0 ? 12 : h12;
});
const minuteText = computed(() => hasSelectedTime.value ? String(timeValue.value.minute).padStart(2, '0') : t('control.timepicker.minute'));
const amPmText = computed(() => hasSelectedTime.value ? (timeValue.value.hour >= 12 ? pmLabel.value : amLabel.value) : amLabel.value);

function normalizeTime(value) {
  const hour = Number.isFinite(value?.hour) ? value.hour : 0;
  const minute = Number.isFinite(value?.minute) ? value.minute : 0;
  return {
    hour: Math.max(0, Math.min(23, Math.trunc(hour))),
    minute: Math.max(0, Math.min(59, Math.trunc(minute)))
  };
}

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

const hourDisplay = computed(() => {
  const items = hours.value.map((h) => props.ClockIdentifier === '12HourClock' ? String(h) : String(h).padStart(2, '0'));
  const idx = hours.value.indexOf(tempHour.value);
  return loopingWindow(items, idx >= 0 ? idx : 0, VISIBLE_ITEMS);
});

const minuteDisplay = computed(() => {
  const items = minutes.value.map((m) => String(m).padStart(2, '0'));
  const idx = minutes.value.indexOf(tempMinute.value);
  return loopingWindow(items, idx >= 0 ? idx : 0, VISIBLE_ITEMS);
});

const ampmDisplay = computed(() => {
  const items = [amLabel.value, pmLabel.value];
  const idx = tempAmPm.value === 'PM' ? 1 : 0;
  const half = Math.floor(VISIBLE_ITEMS / 2);
  const result = [];
  for (let offset = -half; offset <= half; offset++) {
    const i = idx + offset;
    result.push(i < 0 || i >= items.length ? { label: '', active: false } : { label: items[i], active: offset === 0 });
  }
  return result;
});

function scrollUp(type) {
  if (type === 'hour') {
    const idx = hours.value.indexOf(tempHour.value);
    tempHour.value = hours.value[(idx - 1 + hours.value.length) % hours.value.length];
  }
  if (type === 'minute') {
    const idx = minutes.value.indexOf(tempMinute.value);
    tempMinute.value = minutes.value[(idx - 1 + minutes.value.length) % minutes.value.length];
  }
  if (type === 'ampm' && tempAmPm.value === 'PM') tempAmPm.value = 'AM';
}

function scrollDown(type) {
  if (type === 'hour') {
    const idx = hours.value.indexOf(tempHour.value);
    tempHour.value = hours.value[(idx + 1) % hours.value.length];
  }
  if (type === 'minute') {
    const idx = minutes.value.indexOf(tempMinute.value);
    tempMinute.value = minutes.value[(idx + 1) % minutes.value.length];
  }
  if (type === 'ampm' && tempAmPm.value === 'AM') tempAmPm.value = 'PM';
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

const toggleOpen = async () => {
  if (!props.IsEnabled) return;
  if (isOpen.value) {
    close(false);
    return;
  }
  const h = timeValue.value.hour;
  if (props.ClockIdentifier === '12HourClock') {
    const h12 = h % 12;
    tempHour.value = h12 === 0 ? 12 : h12;
    tempAmPm.value = h >= 12 ? 'PM' : 'AM';
  } else {
    tempHour.value = h;
  }
  tempMinute.value = timeValue.value.minute - (timeValue.value.minute % normalizedMinuteIncrement.value);
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
    const oldTime = timeValue.value;
    let finalHour = tempHour.value;
    if (props.ClockIdentifier === '12HourClock') {
      if (tempAmPm.value === 'PM' && finalHour !== 12) finalHour += 12;
      if (tempAmPm.value === 'AM' && finalHour === 12) finalHour = 0;
    }
    const newTime = { hour: finalHour, minute: tempMinute.value };
    if (!props.SelectedTime && !props.Time) localTime.value = newTime;
    emit('update:Time', newTime);
    emit('update:SelectedTime', newTime);
    emit('TimeChanged', { oldTime, newTime });
    emit('SelectedTimeChanged', { oldTime, newTime });
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
    align-items: stretch;
    justify-content: stretch;
    width: 242px;
    min-width: 242px;
    height: 32px;
    border-radius: 4px;
    font-size: 14px;
    gap: 0;
    --ButtonBackground: var(--ctrl-fill-default);
    --ButtonBackgroundPointerOver: var(--ctrl-fill-secondary);
    --ButtonBackgroundPressed: var(--ctrl-fill-tertiary);
    --ButtonBackgroundDisabled: var(--ctrl-fill-disabled, var(--ctrl-fill-tertiary));
    --ButtonBorderBrush: var(--ctrl-border-rest);
    --ButtonBorderBrushPointerOver: var(--ctrl-border-rest);
    --ButtonBorderBrushPressed: var(--ctrl-border-rest);
    --ButtonBorderBrushDisabled: var(--ctrl-border-disabled, var(--ctrl-border-rest));
    --ButtonBorderBrushBottom: var(--ctrl-border-accent);
    --ButtonBorderBrushPointerOverBottom: var(--ctrl-border-accent);
    --ButtonBorderBrushPressedBottom: var(--ctrl-border-rest);
  }

  .picker-btn.has-no-time {
    --ButtonForeground: var(--text-secondary);
    --ButtonForegroundPointerOver: var(--text-primary);
    --ButtonForegroundPressed: var(--text-secondary);
  }

  .picker-column-text {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid var(--ctrl-border, var(--stroke-divider));
    height: 100%;
    box-sizing: border-box;
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
    background-image: var(--flyout-material-overlay);
    border: 1px solid var(--stroke-surface-flyout);
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.14);
    backdrop-filter: var(--flyout-backdrop);
    -webkit-backdrop-filter: var(--flyout-backdrop);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 242px;
    max-height: 398px;
  }

  .picker-columns {
    position: relative;
    display: flex;
    height: 280px;
    overflow: hidden;
  }

  .picker-col-wrapper {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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
    justify-content: center;
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

  .picker-item.empty {
    pointer-events: none;
  }

  .picker-item.empty::before {
    display: none;
  }

  .picker-item.active::before {
    background: rgba(255, 255, 255, 0.14);
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
