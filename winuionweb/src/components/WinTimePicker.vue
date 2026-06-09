<template>
  <div class="win-time-picker" ref="containerRef">
    <div v-if="header" class="picker-header">{{ header }}</div>
    <button class="picker-btn" @click="toggleOpen">
      <div class="picker-column-text">{{ hourText }}</div>
      <div class="picker-column-text">{{ minuteText }}</div>
      <div v-if="clockIdentifier === '12HourClock'" class="picker-column-text">{{ amPmText }}</div>
    </button>

    <Teleport to="body">
      <div v-if="showFlyout" class="picker-overlay" @click="close(false)"></div>
      <div v-if="showFlyout"
           class="picker-flyout"
           :class="flyoutAnimClass"
           :style="flyoutStyle"
           @animationend="onFlyoutAnimEnd">
        <div class="picker-columns">
          <div class="picker-col-wrapper"
               @mouseenter="hoverCol = 'hour'" @mouseleave="hoverCol = ''">
            <button v-show="hoverCol === 'hour'" class="picker-arrow picker-arrow-up"
                    :class="{ pressed: pressedKey === 'hour-up' }"
                    @mousedown="pressedKey = 'hour-up'" @mouseup="pressedKey = ''" @mouseleave="pressedKey = ''"
                    @click="scrollUp('hour')">
              <span class="icon">&#xEDDB;</span>
            </button>
            <div class="picker-column" ref="hourCol">
              <div class="picker-item" v-for="(item, i) in hourDisplay" :key="'h'+i"
                   :class="{ active: item.active }">
                {{ item.label }}
              </div>
            </div>
            <button v-show="hoverCol === 'hour'" class="picker-arrow picker-arrow-down"
                    :class="{ pressed: pressedKey === 'hour-down' }"
                    @mousedown="pressedKey = 'hour-down'" @mouseup="pressedKey = ''" @mouseleave="pressedKey = ''"
                    @click="scrollDown('hour')">
              <span class="icon">&#xEDDC;</span>
            </button>
          </div>
          <div class="picker-col-divider"></div>
          <div class="picker-col-wrapper"
               @mouseenter="hoverCol = 'minute'" @mouseleave="hoverCol = ''">
            <button v-show="hoverCol === 'minute'" class="picker-arrow picker-arrow-up"
                    :class="{ pressed: pressedKey === 'minute-up' }"
                    @mousedown="pressedKey = 'minute-up'" @mouseup="pressedKey = ''" @mouseleave="pressedKey = ''"
                    @click="scrollUp('minute')">
              <span class="icon">&#xEDDB;</span>
            </button>
            <div class="picker-column" ref="minuteCol">
              <div class="picker-item" v-for="(item, i) in minuteDisplay" :key="'m'+i"
                   :class="{ active: item.active }">
                {{ item.label }}
              </div>
            </div>
            <button v-show="hoverCol === 'minute'" class="picker-arrow picker-arrow-down"
                    :class="{ pressed: pressedKey === 'minute-down' }"
                    @mousedown="pressedKey = 'minute-down'" @mouseup="pressedKey = ''" @mouseleave="pressedKey = ''"
                    @click="scrollDown('minute')">
              <span class="icon">&#xEDDC;</span>
            </button>
          </div>
          <template v-if="clockIdentifier === '12HourClock'">
            <div class="picker-col-divider"></div>
            <div class="picker-col-wrapper"
                 @mouseenter="hoverCol = 'ampm'" @mouseleave="hoverCol = ''">
              <button v-show="hoverCol === 'ampm' && tempAmPm === 'PM'" class="picker-arrow picker-arrow-up"
                      :class="{ pressed: pressedKey === 'ampm-up' }"
                      @mousedown="pressedKey = 'ampm-up'" @mouseup="pressedKey = ''" @mouseleave="pressedKey = ''"
                      @click="scrollUp('ampm')">
                <span class="icon">&#xEDDB;</span>
              </button>
              <div class="picker-column" ref="ampmCol">
                <div class="picker-item" v-for="(item, i) in ampmDisplay" :key="'ap'+i"
                     :class="{ active: item.active }">
                  {{ item.label }}
                </div>
              </div>
              <button v-show="hoverCol === 'ampm' && tempAmPm === 'AM'" class="picker-arrow picker-arrow-down"
                      :class="{ pressed: pressedKey === 'ampm-down' }"
                      @mousedown="pressedKey = 'ampm-down'" @mouseup="pressedKey = ''" @mouseleave="pressedKey = ''"
                      @click="scrollDown('ampm')">
                <span class="icon">&#xEDDC;</span>
              </button>
            </div>
          </template>
          <div class="picker-highlight"></div>
        </div>
        <div class="picker-actions">
          <button class="picker-action-btn" @click="close(true)"><span class="icon">&#xE8FB;</span></button>
          <button class="picker-action-btn" @click="close(false)"><span class="icon">&#xE711;</span></button>
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
  minuteIncrement: { type: Number, default: 1 },
  clockIdentifier: { type: String, default: '12HourClock' }
});

const emit = defineEmits(['update:modelValue']);

const showFlyout = ref(false);
const isOpen = ref(false);
const isClosing = ref(false);
const containerRef = ref(null);
const flyoutStyle = ref({});
const hoverCol = ref('');
const pressedKey = ref('');

const hourCol = ref(null);
const minuteCol = ref(null);
const ampmCol = ref(null);

const tempHour = ref(0);
const tempMinute = ref(0);
const tempAmPm = ref('AM');

const hours = computed(() => {
  if (props.clockIdentifier === '12HourClock') return Array.from({ length: 12 }, (_, i) => i + 1);
  return Array.from({ length: 24 }, (_, i) => i);
});
const minutes = computed(() => Array.from({ length: Math.floor(60 / props.minuteIncrement) }, (_, i) => i * props.minuteIncrement));

const VISIBLE_ITEMS = 7;
const ITEM_HEIGHT = 40;
const COLUMNS_HEIGHT = VISIBLE_ITEMS * ITEM_HEIGHT;
const BAND_CENTER_FROM_TOP = 1 + COLUMNS_HEIGHT / 2;

const flyoutAnimClass = computed(() => {
  if (isClosing.value) return 'picker-flyout-closing';
  if (isOpen.value) return 'picker-flyout-animate';
  return '';
});

const hourText = computed(() => {
  const h = props.modelValue.getHours();
  if (props.clockIdentifier === '24HourClock') return h.toString().padStart(2, '0');
  const h12 = h % 12;
  return h12 === 0 ? 12 : h12;
});
const minuteText = computed(() => props.modelValue.getMinutes().toString().padStart(2, '0'));
const amPmText = computed(() => props.modelValue.getHours() >= 12 ? 'PM' : 'AM');

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
  const items = hours.value.map(h => {
    if (props.clockIdentifier === '12HourClock') return String(h);
    return h.toString().padStart(2, '0');
  });
  const idx = hours.value.indexOf(tempHour.value);
  return loopingWindow(items, idx >= 0 ? idx : 0, VISIBLE_ITEMS);
});

const minuteDisplay = computed(() => {
  const items = minutes.value.map(m => m.toString().padStart(2, '0'));
  const idx = minutes.value.indexOf(tempMinute.value);
  return loopingWindow(items, idx >= 0 ? idx : 0, VISIBLE_ITEMS);
});

const ampmDisplay = computed(() => {
  const items = ['AM', 'PM'];
  const idx = tempAmPm.value === 'PM' ? 1 : 0;
  const half = Math.floor(VISIBLE_ITEMS / 2);
  const result = [];
  for (let offset = -half; offset <= half; offset++) {
    const i = idx + offset;
    if (i < 0 || i >= items.length) {
      result.push({ label: '', active: false });
    } else {
      result.push({ label: items[i], active: offset === 0 });
    }
  }
  return result;
});

function scrollUp(type) {
  if (type === 'hour') {
    const idx = hours.value.indexOf(tempHour.value);
    tempHour.value = hours.value[(idx - 1 + hours.value.length) % hours.value.length];
  } else if (type === 'minute') {
    const idx = minutes.value.indexOf(tempMinute.value);
    tempMinute.value = minutes.value[(idx - 1 + minutes.value.length) % minutes.value.length];
  } else if (type === 'ampm') {
    if (tempAmPm.value === 'PM') tempAmPm.value = 'AM';
  }
}

function scrollDown(type) {
  if (type === 'hour') {
    const idx = hours.value.indexOf(tempHour.value);
    tempHour.value = hours.value[(idx + 1) % hours.value.length];
  } else if (type === 'minute') {
    const idx = minutes.value.indexOf(tempMinute.value);
    tempMinute.value = minutes.value[(idx + 1) % minutes.value.length];
  } else if (type === 'ampm') {
    if (tempAmPm.value === 'AM') tempAmPm.value = 'PM';
  }
}

const toggleOpen = async () => {
  if (isOpen.value) { close(false); return; }
  const h = props.modelValue.getHours();
  if (props.clockIdentifier === '12HourClock') {
    const h12 = h % 12;
    tempHour.value = h12 === 0 ? 12 : h12;
    tempAmPm.value = h >= 12 ? 'PM' : 'AM';
  } else {
    tempHour.value = h;
  }
  const m = props.modelValue.getMinutes();
  tempMinute.value = m - (m % props.minuteIncrement);

  showFlyout.value = true;
  isOpen.value = true;
  isClosing.value = false;
  await nextTick();
  const rect = containerRef.value.getBoundingClientRect();
  const buttonCenter = rect.top + rect.height / 2;
  const top = buttonCenter - BAND_CENTER_FROM_TOP;
  flyoutStyle.value = {
    top: `${top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    transformOrigin: `center ${BAND_CENTER_FROM_TOP}px`
  };
};

const close = (accept) => {
  if (accept) {
    const newDate = new Date(props.modelValue);
    let finalHour = tempHour.value;
    if (props.clockIdentifier === '12HourClock') {
      if (tempAmPm.value === 'PM' && finalHour !== 12) finalHour += 12;
      if (tempAmPm.value === 'AM' && finalHour === 12) finalHour = 0;
    }
    newDate.setHours(finalHour);
    newDate.setMinutes(tempMinute.value);
    emit('update:modelValue', newDate);
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

function onWheel(e, type) {
  e.preventDefault();
  if (e.deltaY > 0) scrollDown(type);
  else scrollUp(type);
}

const setupWheel = async () => {
  await nextTick();
  if (hourCol.value) hourCol.value.addEventListener('wheel', (e) => onWheel(e, 'hour'), { passive: false });
  if (minuteCol.value) minuteCol.value.addEventListener('wheel', (e) => onWheel(e, 'minute'), { passive: false });
  if (ampmCol.value) ampmCol.value.addEventListener('wheel', (e) => onWheel(e, 'ampm'), { passive: false });
};

watch(showFlyout, (val) => { if (val) setupWheel(); });
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
    width: 296px;
    height: 32px;
    background: var(--ctrl-fill-default);
    border: 1px solid var(--ctrl-border-rest);
    border-bottom-color: var(--ctrl-border-accent);
    border-radius: 4px;
    padding: 0;
    color: var(--text-primary);
    font-family: inherit;
    font-size: 14px;
    cursor: pointer;
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
    border-right: 1px solid var(--ctrl-border-rest);
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
    overflow: hidden;
  }

  .picker-columns {
    position: relative;
    display: flex;
    height: 280px;
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
    background: var(--stroke-divider);
    z-index: 2;
  }

  .picker-item {
    height: 40px;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: var(--text-secondary);
    width: 100%;
    position: relative;
    z-index: 1;
    transition: color 0.1s, font-size 0.1s;
  }

    .picker-item.active {
      color: var(--accent-text);
      font-weight: 600;
      font-size: 15px;
    }

  .picker-highlight {
    position: absolute;
    left: 4px;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    height: 40px;
    background: var(--accent-base);
    border-radius: 4px;
    pointer-events: none;
    z-index: 0;
  }

  .picker-arrow {
    position: absolute;
    left: 0;
    right: 0;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--flyout-bg);
    border: none;
    color: var(--text-secondary);
    font-size: 8px;
    cursor: pointer;
    z-index: 3;
    transition: transform 0.083s ease-out;
  }

  .picker-arrow-up {
    top: 0;
  }

  .picker-arrow-down {
    bottom: 0;
  }

  .picker-arrow:hover {
    color: var(--text-primary);
  }

  .picker-arrow.pressed {
    transform: scale(0.75);
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
