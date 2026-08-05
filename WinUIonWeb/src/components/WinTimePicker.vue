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
        :class="{ 'picker-flyout-closing': isClosing }"
        :style="flyoutStyle"
        @animationend="onFlyoutAnimEnd">
        <div class="picker-columns">
          <WinPickerColumn
            ref="hourColRef"
            class="picker-col-flex"
            :items="hourItems"
            :value="hourIndex"
            :wrap="true"
            :aria-label="t('control.timepicker.hour')"
            @change="onHourChange" />
          <div class="picker-col-divider"></div>
          <WinPickerColumn
            ref="minuteColRef"
            class="picker-col-flex"
            :items="minuteItems"
            :value="minuteIndex"
            :wrap="true"
            :aria-label="t('control.timepicker.minute')"
            @change="onMinuteChange" />
          <template v-if="ClockIdentifier === '12HourClock'">
            <div class="picker-col-divider"></div>
            <WinPickerColumn
              ref="ampmColRef"
              class="picker-col-flex"
              :items="ampmItems"
              :value="ampmIndex"
              :wrap="false"
              :can-scroll-up="ampmIndex > 0"
              :can-scroll-down="ampmIndex < ampmItems.length - 1"
              :aria-label="`${t('control.timepicker.am')}/${t('control.timepicker.pm')}`"
              @change="onAmpmChange" />
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
import { ref, computed, nextTick } from 'vue';
import WinButton from './WinButton.vue';
import WinPickerColumn from './WinPickerColumn.vue';
import WinTextBlock from './WinTextBlock.vue';
import { useI18n } from './i18n/index';
import { useFlyoutAnimation } from './useFlyoutAnimation';

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
const hourColRef = ref(null);
const minuteColRef = ref(null);
const ampmColRef = ref(null);

const flyoutAnimation = useFlyoutAnimation(flyoutRef, { Origin: 'center' });

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

const hourItems = computed(() => hours.value.map((h) => props.ClockIdentifier === '12HourClock' ? String(h) : String(h).padStart(2, '0')));
const hourIndex = computed(() => {
  const idx = hours.value.indexOf(tempHour.value);
  return idx >= 0 ? idx : 0;
});
const minuteItems = computed(() => minutes.value.map((m) => String(m).padStart(2, '0')));
const minuteIndex = computed(() => {
  const idx = minutes.value.indexOf(tempMinute.value);
  return idx >= 0 ? idx : 0;
});
const ampmItems = computed(() => [amLabel.value, pmLabel.value]);
const ampmIndex = computed(() => tempAmPm.value === 'PM' ? 1 : 0);

const onHourChange = (index) => {
  tempHour.value = hours.value[index];
};

const onMinuteChange = (index) => {
  tempMinute.value = minutes.value[index];
};

const onAmpmChange = (index) => {
  tempAmPm.value = index === 1 ? 'PM' : 'AM';
};

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
    transformOrigin: 'center center'
  };
  await nextTick();
  flyoutAnimation.play();
};

const close = (accept) => {
  flyoutAnimation.cancel();
  if (accept) {
    hourColRef.value?.flush();
    minuteColRef.value?.flush();
    ampmColRef.value?.flush();
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
    width: 242px;
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

  .picker-col-flex {
    flex: 1 1 0;
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
