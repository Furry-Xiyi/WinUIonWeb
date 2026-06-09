<template>
  <div class="win-date-picker" ref="containerRef">
    <div v-if="header" class="picker-header">{{ header }}</div>
    <button class="picker-btn" @click="toggleOpen">
      <div class="picker-column-text" :class="{ wide: !yearVisible }">{{ monthText }}</div>
      <div class="picker-column-text">{{ dayText }}</div>
      <div v-if="yearVisible" class="picker-column-text">{{ yearText }}</div>
    </button>

    <Teleport to="body">
      <div v-if="showFlyout" class="picker-overlay" @click="close(false)"></div>
      <div v-if="showFlyout"
           class="picker-flyout"
           :class="flyoutAnimClass"
           :style="flyoutStyle"
           @animationend="onFlyoutAnimEnd">
        <div class="picker-columns">
          <div class="picker-col-wrapper" :class="{ wide: !yearVisible }"
               @mouseenter="hoverCol = 'month'" @mouseleave="hoverCol = ''">
            <button v-show="hoverCol === 'month'" class="picker-arrow picker-arrow-up"
                    :class="{ pressed: pressedKey === 'month-up' }"
                    @mousedown="pressedKey = 'month-up'" @mouseup="pressedKey = ''" @mouseleave="pressedKey = ''"
                    @click="scrollUp('month')">
              <span class="icon">&#xEDDB;</span>
            </button>
            <div class="picker-column" ref="monthCol">
              <div class="picker-item" v-for="(item, i) in monthDisplay" :key="'m'+i"
                   :class="{ active: item.active }">
                {{ item.label }}
              </div>
            </div>
            <button v-show="hoverCol === 'month'" class="picker-arrow picker-arrow-down"
                    :class="{ pressed: pressedKey === 'month-down' }"
                    @mousedown="pressedKey = 'month-down'" @mouseup="pressedKey = ''" @mouseleave="pressedKey = ''"
                    @click="scrollDown('month')">
              <span class="icon">&#xEDDC;</span>
            </button>
          </div>
          <div class="picker-col-divider"></div>
          <div class="picker-col-wrapper"
               @mouseenter="hoverCol = 'day'" @mouseleave="hoverCol = ''">
            <button v-show="hoverCol === 'day'" class="picker-arrow picker-arrow-up"
                    :class="{ pressed: pressedKey === 'day-up' }"
                    @mousedown="pressedKey = 'day-up'" @mouseup="pressedKey = ''" @mouseleave="pressedKey = ''"
                    @click="scrollUp('day')">
              <span class="icon">&#xEDDB;</span>
            </button>
            <div class="picker-column" ref="dayCol">
              <div class="picker-item" v-for="(item, i) in dayDisplay" :key="'d'+i"
                   :class="{ active: item.active }">
                {{ item.label }}
              </div>
            </div>
            <button v-show="hoverCol === 'day'" class="picker-arrow picker-arrow-down"
                    :class="{ pressed: pressedKey === 'day-down' }"
                    @mousedown="pressedKey = 'day-down'" @mouseup="pressedKey = ''" @mouseleave="pressedKey = ''"
                    @click="scrollDown('day')">
              <span class="icon">&#xEDDC;</span>
            </button>
          </div>
          <template v-if="yearVisible">
            <div class="picker-col-divider"></div>
            <div class="picker-col-wrapper"
                 @mouseenter="hoverCol = 'year'" @mouseleave="hoverCol = ''">
              <button v-show="hoverCol === 'year'" class="picker-arrow picker-arrow-up"
                      :class="{ pressed: pressedKey === 'year-up' }"
                      @mousedown="pressedKey = 'year-up'" @mouseup="pressedKey = ''" @mouseleave="pressedKey = ''"
                      @click="scrollUp('year')">
                <span class="icon">&#xEDDB;</span>
              </button>
              <div class="picker-column" ref="yearCol">
                <div class="picker-item" v-for="(item, i) in yearDisplay" :key="'y'+i"
                     :class="{ active: item.active }">
                  {{ item.label }}
                </div>
              </div>
              <button v-show="hoverCol === 'year'" class="picker-arrow picker-arrow-down"
                      :class="{ pressed: pressedKey === 'year-down' }"
                      @mousedown="pressedKey = 'year-down'" @mouseup="pressedKey = ''" @mouseleave="pressedKey = ''"
                      @click="scrollDown('year')">
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
  yearVisible: { type: Boolean, default: true },
  dayFormatted: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue']);

const showFlyout = ref(false);
const isOpen = ref(false);
const isClosing = ref(false);
const containerRef = ref(null);
const flyoutStyle = ref({});
const hoverCol = ref('');
const pressedKey = ref('');

const monthCol = ref(null);
const dayCol = ref(null);
const yearCol = ref(null);

const tempMonth = ref(1);
const tempDay = ref(1);
const tempYear = ref(2024);

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const years = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - 50 + i);

const VISIBLE_ITEMS = 7;
const ITEM_HEIGHT = 40;
const COLUMNS_HEIGHT = VISIBLE_ITEMS * ITEM_HEIGHT;
const BAND_CENTER_FROM_TOP = 1 + COLUMNS_HEIGHT / 2;

const flyoutAnimClass = computed(() => {
  if (isClosing.value) return 'picker-flyout-closing';
  if (isOpen.value) return 'picker-flyout-animate';
  return '';
});

const daysInTempMonth = computed(() => new Date(tempYear.value, tempMonth.value, 0).getDate());

const monthText = computed(() => monthNames[props.modelValue.getMonth()]);
const dayText = computed(() => {
  const d = props.modelValue.getDate();
  return props.dayFormatted ? d.toString().padStart(2, '0') : d;
});
const yearText = computed(() => props.modelValue.getFullYear());

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

const monthDisplay = computed(() => loopingWindow(monthNames, tempMonth.value - 1, VISIBLE_ITEMS));

const dayDisplay = computed(() => {
  const total = daysInTempMonth.value;
  const items = Array.from({ length: total }, (_, i) => props.dayFormatted ? (i + 1).toString().padStart(2, '0') : String(i + 1));
  return loopingWindow(items, tempDay.value - 1, VISIBLE_ITEMS);
});

const yearDisplay = computed(() => {
  const items = years.map(String);
  const idx = years.indexOf(tempYear.value);
  return loopingWindow(items, idx >= 0 ? idx : 0, VISIBLE_ITEMS);
});

function scrollUp(type) {
  if (type === 'month') {
    tempMonth.value = tempMonth.value <= 1 ? 12 : tempMonth.value - 1;
  } else if (type === 'day') {
    const max = daysInTempMonth.value;
    tempDay.value = tempDay.value <= 1 ? max : tempDay.value - 1;
  } else if (type === 'year') {
    const idx = years.indexOf(tempYear.value);
    tempYear.value = years[(idx - 1 + years.length) % years.length];
  }
}

function scrollDown(type) {
  if (type === 'month') {
    tempMonth.value = tempMonth.value >= 12 ? 1 : tempMonth.value + 1;
  } else if (type === 'day') {
    const max = daysInTempMonth.value;
    tempDay.value = tempDay.value >= max ? 1 : tempDay.value + 1;
  } else if (type === 'year') {
    const idx = years.indexOf(tempYear.value);
    tempYear.value = years[(idx + 1) % years.length];
  }
}

const toggleOpen = async () => {
  if (isOpen.value) { close(false); return; }
  tempMonth.value = props.modelValue.getMonth() + 1;
  tempDay.value = props.modelValue.getDate();
  tempYear.value = props.modelValue.getFullYear();
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
    const maxDay = new Date(tempYear.value, tempMonth.value, 0).getDate();
    const finalDay = tempDay.value > maxDay ? maxDay : tempDay.value;
    emit('update:modelValue', new Date(tempYear.value, tempMonth.value - 1, finalDay));
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
  if (monthCol.value) monthCol.value.addEventListener('wheel', (e) => onWheel(e, 'month'), { passive: false });
  if (dayCol.value) dayCol.value.addEventListener('wheel', (e) => onWheel(e, 'day'), { passive: false });
  if (yearCol.value) yearCol.value.addEventListener('wheel', (e) => onWheel(e, 'year'), { passive: false });
};

watch(showFlyout, (val) => { if (val) setupWheel(); });
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

    .picker-column-text.wide {
      flex: 2;
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

    .picker-col-wrapper.wide {
      flex: 2;
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
