<template>
  <div class="win-calendar-view">
    <div class="calendar-header">
      <button
        class="win-btn subtle calendar-title-btn"
        @click="onLabelClick"
        :disabled="viewMode === 2"
      >
        {{ labelText }}
      </button>
      <div class="calendar-nav">
        <button class="icon-btn" @click="onNav(-1)">&#xF090;</button>
        <button class="icon-btn" @click="onNav(1)">&#xF08E;</button>
      </div>
    </div>

    <div class="calendar-divider"></div>

    <div class="calendar-view-body">
      <Transition
        :css="false"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
      >
        <!-- 日视图 (7列) -->
        <div v-if="viewMode === 0" key="day" class="calendar-panel">
          <div class="calendar-day-headers">
            <div v-for="d in dayNames" :key="d" class="calendar-day-header">
              {{ d }}
            </div>
          </div>
          <div class="calendar-scroll" ref="dayScrollEl" @scroll="onDayScroll">
            <div :style="{ height: dayTotalHeight + 'px', position: 'relative' }">
              <div
                :style="{
                  position: 'absolute',
                  top: dayRenderTop + 'px',
                  left: 0,
                  right: 0,
                }"
              >
                <div class="calendar-grid">
                  <button
                    v-for="cell in dayRenderCells"
                    :key="cell.key"
                    class="calendar-day"
                    :class="{
                      'out-of-scope': cell.outOfScope,
                      hidden: cell.outOfScope && !isOutOfScopeEnabled,
                      today: cell.isToday,
                      selected: isSelected(cell),
                    }"
                    @click="onSelectDay(cell)"
                  >
                    <span
                      v-if="cell.showLabel && isGroupLabelVisible"
                      class="group-label"
                      :class="{ 'label-accent': isDayLabelAccent(cell) }"
                    >
                      {{ cell.labelText }}
                    </span>
                    <span class="day-text">{{ cell.date }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 月视图 (4列) -->
        <div v-else-if="viewMode === 1" key="month" class="calendar-panel">
          <div class="calendar-scroll large-scroll" ref="monthScrollEl" @scroll="onMonthScroll">
            <div :style="{ height: monthTotalHeight + 'px', position: 'relative' }">
              <div
                :style="{
                  position: 'absolute',
                  top: monthRenderTop + 'px',
                  left: 0,
                  right: 0,
                }"
              >
                <div class="calendar-large-grid">
                  <button
                    v-for="item in monthRenderItems"
                    :key="item.key"
                    class="calendar-large-btn"
                    :class="{
                      'out-of-scope': item.outOfScope,
                      current: item.isTodayMonth,
                      selected: isMonthSelected(item),
                    }"
                    @click="onSelectMonth(item)"
                  >
                    <span
                      v-if="item.showLabel && isGroupLabelVisible"
                      class="group-label"
                      :class="{ 'label-accent': isMonthLabelAccent(item) }"
                    >
                      {{ item.labelText }}
                    </span>
                    {{ item.text }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 年视图 (4列) -->
        <div v-else key="year" class="calendar-panel">
          <div class="calendar-scroll large-scroll" ref="yearScrollEl" @scroll="onYearScroll">
            <div :style="{ height: yearTotalHeight + 'px', position: 'relative' }">
              <div
                :style="{
                  position: 'absolute',
                  top: yearRenderTop + 'px',
                  left: 0,
                  right: 0,
                }"
              >
                <div class="calendar-large-grid">
                  <button
                    v-for="item in yearRenderItems"
                    :key="item.key"
                    class="calendar-large-btn"
                    :class="{
                      'out-of-scope': item.outOfScope,
                      current: item.year === todayYear,
                    }"
                    @click="onSelectYear(item)"
                  >
                    {{ item.year }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from "vue";

const props = defineProps({
  modelValue: { type: [Date, Array], default: null },
  selectionMode: { type: String, default: "Single" },
  isOutOfScopeEnabled: { type: Boolean, default: true },
  isGroupLabelVisible: { type: Boolean, default: true },
  language: { type: String, default: "English" },
});

const emit = defineEmits(["update:modelValue"]);

const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth();
const todayStr = today.toDateString();

const viewMode = ref(0);
const transitionDir = ref("out");

const dayScrollEl = ref(null);
const monthScrollEl = ref(null);
const yearScrollEl = ref(null);

const headerMonth = ref(todayMonth);
const headerYear = ref(todayYear);
const headerDecade = ref(Math.floor(todayYear / 10) * 10);

const shortMonths = computed(() =>
  props.language === "English"
    ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    : ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
);
const monthNames = computed(() =>
  props.language === "English"
    ? [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]
    : [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
      ],
);
const dayNames = computed(() =>
  props.language === "English"
    ? ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    : ["日", "一", "二", "三", "四", "五", "六"],
);

const labelText = computed(() => {
  if (viewMode.value === 0) return `${monthNames.value[headerMonth.value]} ${headerYear.value}`;
  if (viewMode.value === 1) return `${headerYear.value}`;
  return `${headerDecade.value} - ${headerDecade.value + 9}`;
});

const MIN_YEAR = 1920;
const MAX_YEAR = 2120;
const ROW_H = 40;
const LARGE_ROW_H = 60;
const LARGE_PAGE_ROWS = 4;
const LARGE_PAGE_H = LARGE_ROW_H * LARGE_PAGE_ROWS;
const MONTH_PAGE_ROWS = 3;
const MONTH_PAGE_H = LARGE_ROW_H * MONTH_PAGE_ROWS;
const DAY_MS = 24 * 60 * 60 * 1000;

const dateSerial = (y, m, d) => Math.floor(Date.UTC(y, m, d) / DAY_MS);
const weekdayOfSerial = (serial) => new Date(serial * DAY_MS).getUTCDay();
const dateFromSerial = (serial) => {
  const d = new Date(serial * DAY_MS);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};

const monthMeta = (() => {
  const firstDay = dateSerial(MIN_YEAR, 0, 1);
  const lastDay = dateSerial(MAX_YEAR, 11, 31);
  const startSerial = firstDay - weekdayOfSerial(firstDay);
  const endSerial = lastDay + (6 - weekdayOfSerial(lastDay));
  const arr = [];
  for (let y = MIN_YEAR; y <= MAX_YEAR; y++) {
    for (let m = 0; m < 12; m++) {
      const firstSerial = dateSerial(y, m, 1);
      arr.push({
        y,
        m,
        startRow: Math.floor((firstSerial - startSerial) / 7),
      });
    }
  }
  return {
    data: arr,
    startSerial,
    totalRows: Math.floor((endSerial - startSerial) / 7) + 1,
  };
})();

const dayScrollTop = ref(0);
const dayRenderTop = ref(0);
const dayRenderCells = ref([]);
const dayTotalHeight = computed(() => monthMeta.totalRows * ROW_H);

const computeDayView = () => {
  const st = dayScrollTop.value;
  const scrollH = 240;
  const startRow = Math.max(0, Math.floor(st / ROW_H) - 4);
  const endRow = Math.min(monthMeta.totalRows, Math.floor((st + scrollH) / ROW_H) + 5);
  dayRenderTop.value = startRow * ROW_H;

  const visibleTopPx = st;
  const visibleBotPx = st + scrollH;
  const visibleFirstRow = Math.max(0, Math.floor(visibleTopPx / ROW_H));
  const visibleLastRow = Math.min(monthMeta.totalRows - 1, Math.floor((visibleBotPx - 1) / ROW_H));

  const visibleMonths = new Map();
  for (let row = visibleFirstRow; row <= visibleLastRow; row++) {
    const rowTopPx = row * ROW_H;
    const rowBotPx = rowTopPx + ROW_H;
    const rowVisiblePx = Math.min(rowBotPx, visibleBotPx) - Math.max(rowTopPx, visibleTopPx);
    if (rowVisiblePx <= 0) continue;

    for (let c = 0; c < 7; c++) {
      const fullDate = dateFromSerial(monthMeta.startSerial + row * 7 + c);
      const key = `${fullDate.getFullYear()}-${fullDate.getMonth()}`;
      const prev = visibleMonths.get(key);
      if (prev) prev.px += rowVisiblePx;
      else
        visibleMonths.set(key, {
          year: fullDate.getFullYear(),
          month: fullDate.getMonth(),
          px: rowVisiblePx,
        });
    }
  }

  let bestMonth = null;
  visibleMonths.forEach((item) => {
    if (!bestMonth || item.px > bestMonth.px) bestMonth = item;
  });
  if (bestMonth) {
    headerMonth.value = bestMonth.month;
    headerYear.value = bestMonth.year;
  }

  const scopeMonth = headerMonth.value;
  const scopeYear = headerYear.value;

  const cells = [];
  for (let row = startRow; row < endRow; row++) {
    for (let c = 0; c < 7; c++) {
      const fullDate = dateFromSerial(monthMeta.startSerial + row * 7 + c);
      const cy = fullDate.getFullYear();
      const cm = fullDate.getMonth();
      const cd = fullDate.getDate();
      cells.push({
        key: `${row}-${c}`,
        date: cd,
        month: cm,
        year: cy,
        outOfScope: cy !== scopeYear || cm !== scopeMonth,
        isToday: fullDate.toDateString() === todayStr,
        showLabel: cd === 1,
        labelText: shortMonths.value[cm],
        fullDate,
      });
    }
  }
  dayRenderCells.value = cells;
};

const monthScrollTop = ref(0);
const monthRenderTop = ref(0);
const monthRenderItems = ref([]);
const totalMonthPages = MAX_YEAR - MIN_YEAR + 1;
const monthTotalHeight = computed(() => totalMonthPages * MONTH_PAGE_H);

const computeMonthView = () => {
  const st = monthScrollTop.value;
  const viewH = LARGE_PAGE_H;
  const visibleTopPx = st;
  const visibleBotPx = st + viewH;

  const startRow = Math.max(0, Math.floor(st / LARGE_ROW_H) - 1);
  const endRow = Math.min(
    totalMonthPages * MONTH_PAGE_ROWS,
    Math.ceil(visibleBotPx / LARGE_ROW_H) + 1,
  );
  monthRenderTop.value = startRow * LARGE_ROW_H;

  const visibleFirstRow = Math.floor(visibleTopPx / LARGE_ROW_H);
  const visibleLastRow = Math.floor((visibleBotPx - 1) / LARGE_ROW_H);
  let bestYear = MIN_YEAR;
  let bestPx = 0;
  let r = visibleFirstRow;
  while (r <= visibleLastRow) {
    const yr = MIN_YEAR + Math.floor(r / MONTH_PAGE_ROWS);
    const yearEndRow = (yr - MIN_YEAR + 1) * MONTH_PAGE_ROWS - 1;
    const segLastRow = Math.min(yearEndRow, visibleLastRow);
    const segTopPx = Math.max(r * LARGE_ROW_H, visibleTopPx);
    const segBotPx = Math.min((segLastRow + 1) * LARGE_ROW_H, visibleBotPx);
    const px = segBotPx - segTopPx;
    if (px > bestPx) {
      bestPx = px;
      bestYear = yr;
    }
    r = segLastRow + 1;
  }
  headerYear.value = bestYear;

  const items = [];
  for (let row = startRow; row < endRow; row++) {
    const pageIdx = Math.floor(row / MONTH_PAGE_ROWS);
    const localRow = row - pageIdx * MONTH_PAGE_ROWS;
    const yr = MIN_YEAR + pageIdx;
    for (let c = 0; c < 4; c++) {
      const m = localRow * 4 + c;
      items.push({
        key: `m${row}-${c}`,
        month: m,
        year: yr,
        text: shortMonths.value[m],
        outOfScope: yr !== headerYear.value,
        isTodayMonth: m === todayMonth && yr === todayYear,
        showLabel: m === 0 && c === 0,
        labelText: `${yr}`,
      });
    }
  }
  monthRenderItems.value = items;
};

const isMonthSelected = (item) => {
  if (!props.modelValue) return false;
  const dates = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue];
  return dates.some((d) => d && d.getFullYear() === item.year && d.getMonth() === item.month);
};

const DECADE_SIZE = 10;
const YEARS_PER_ROW = 4;

const yearScrollTop = ref(0);
const yearRenderTop = ref(0);
const yearRenderItems = ref([]);
const totalYearRows = Math.ceil((MAX_YEAR - MIN_YEAR + 1) / YEARS_PER_ROW);
const yearTotalHeight = computed(() => totalYearRows * LARGE_ROW_H);

const computeYearView = () => {
  const st = yearScrollTop.value;
  const viewH = LARGE_PAGE_H;
  const visibleTopPx = st;
  const visibleBotPx = st + viewH;

  const startRow = Math.max(0, Math.floor(st / LARGE_ROW_H) - 1);
  const endRow = Math.min(totalYearRows, Math.ceil(visibleBotPx / LARGE_ROW_H) + 1);
  yearRenderTop.value = startRow * LARGE_ROW_H;

  const visibleFirstRow = Math.max(0, Math.floor(visibleTopPx / LARGE_ROW_H));
  const visibleLastRow = Math.min(totalYearRows - 1, Math.floor((visibleBotPx - 1) / LARGE_ROW_H));

  const visibleDecades = new Map();
  for (let row = visibleFirstRow; row <= visibleLastRow; row++) {
    const rowTopPx = row * LARGE_ROW_H;
    const rowBotPx = rowTopPx + LARGE_ROW_H;
    const rowVisiblePx = Math.min(rowBotPx, visibleBotPx) - Math.max(rowTopPx, visibleTopPx);
    if (rowVisiblePx <= 0) continue;

    for (let c = 0; c < YEARS_PER_ROW; c++) {
      const yr = MIN_YEAR + row * YEARS_PER_ROW + c;
      if (yr > MAX_YEAR) continue;
      const decadeStart = Math.floor(yr / DECADE_SIZE) * DECADE_SIZE;
      const prev = visibleDecades.get(decadeStart);
      visibleDecades.set(decadeStart, (prev || 0) + rowVisiblePx);
    }
  }

  let bestDecadeStart = headerDecade.value;
  let bestPx = 0;
  visibleDecades.forEach((px, decadeStart) => {
    if (px > bestPx) {
      bestPx = px;
      bestDecadeStart = decadeStart;
    }
  });
  headerDecade.value = bestDecadeStart;

  const items = [];
  for (let row = startRow; row < endRow; row++) {
    for (let c = 0; c < YEARS_PER_ROW; c++) {
      const yr = MIN_YEAR + row * YEARS_PER_ROW + c;
      if (yr > MAX_YEAR) continue;
      items.push({
        key: `y${row}-${c}`,
        year: yr,
        outOfScope: yr < headerDecade.value || yr >= headerDecade.value + DECADE_SIZE,
      });
    }
  }
  yearRenderItems.value = items;
};

const isSelected = (cell) => {
  if (!props.modelValue) return false;
  const d = cell.fullDate;
  if (props.selectionMode === "Single") return props.modelValue.toDateString() === d.toDateString();
  return (
    Array.isArray(props.modelValue) &&
    props.modelValue.some((v) => v.toDateString() === d.toDateString())
  );
};

const isMonthLabelAccent = (item) => {
  if (item.isTodayMonth) return false;
  return isMonthSelected(item);
};

const isDayLabelAccent = (cell) => {
  if (cell.isToday) return false;
  return isSelected(cell);
};

const onDayScroll = () => {
  if (dayScrollEl.value) {
    dayScrollTop.value = dayScrollEl.value.scrollTop;
    computeDayView();
  }
};
const onMonthScroll = () => {
  if (monthScrollEl.value) {
    monthScrollTop.value = monthScrollEl.value.scrollTop;
    computeMonthView();
  }
};
const onYearScroll = () => {
  if (yearScrollEl.value) {
    yearScrollTop.value = yearScrollEl.value.scrollTop;
    computeYearView();
  }
};

const absMonthOf = (y, m) => (y - MIN_YEAR) * 12 + m;

const scrollDayTo = (y, m, smooth = false) => {
  const idx = absMonthOf(y, m);
  const meta = monthMeta.data[idx];
  if (!meta) return;
  const top = meta.startRow * ROW_H;
  nextTick(() => {
    if (!dayScrollEl.value) return;
    if (smooth) dayScrollEl.value.scrollTo({ top, behavior: "smooth" });
    else {
      dayScrollEl.value.scrollTop = top;
      dayScrollTop.value = top;
      computeDayView();
    }
  });
};

const scrollMonthTo = (y, smooth = false) => {
  const pageIdx = y - MIN_YEAR;
  const top = pageIdx * MONTH_PAGE_H;
  nextTick(() => {
    if (!monthScrollEl.value) return;
    if (smooth) monthScrollEl.value.scrollTo({ top, behavior: "smooth" });
    else {
      monthScrollEl.value.scrollTop = top;
      monthScrollTop.value = top;
      computeMonthView();
    }
  });
};

const scrollYearTo = (dec, smooth = false) => {
  const row = Math.max(
    0,
    Math.min(totalYearRows - 1, Math.floor((dec - MIN_YEAR) / YEARS_PER_ROW)),
  );
  const top = row * LARGE_ROW_H;
  nextTick(() => {
    if (!yearScrollEl.value) return;
    if (smooth) yearScrollEl.value.scrollTo({ top, behavior: "smooth" });
    else {
      yearScrollEl.value.scrollTop = top;
      yearScrollTop.value = top;
      computeYearView();
    }
  });
};

const onNav = (dir) => {
  if (viewMode.value === 0) {
    let m = headerMonth.value + dir,
      y = headerYear.value;
    if (m > 11) {
      m = 0;
      y++;
    } else if (m < 0) {
      m = 11;
      y--;
    }
    scrollDayTo(y, m, true);
  } else if (viewMode.value === 1) scrollMonthTo(headerYear.value + dir, true);
  else scrollYearTo(headerDecade.value + dir * DECADE_SIZE, true);
};

const onLabelClick = () => {
  if (viewMode.value === 0) {
    transitionDir.value = "out";
    viewMode.value = 1;
    nextTick(() => scrollMonthTo(headerYear.value));
  } else if (viewMode.value === 1) {
    transitionDir.value = "out";
    viewMode.value = 2;
    nextTick(() => scrollYearTo(headerDecade.value));
  }
};

const onSelectMonth = (item) => {
  transitionDir.value = "in";
  headerMonth.value = item.month;
  headerYear.value = item.year;
  viewMode.value = 0;
};

const onSelectYear = (item) => {
  transitionDir.value = "in";
  headerYear.value = item.year;
  viewMode.value = 1;
};

const onSelectDay = (cell) => {
  if (cell.outOfScope && !props.isOutOfScopeEnabled) return;
  if (props.selectionMode === "Single") emit("update:modelValue", cell.fullDate);
  else if (props.selectionMode === "Multiple") {
    const list = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const idx = list.findIndex((d) => d.toDateString() === cell.fullDate.toDateString());
    if (idx >= 0) list.splice(idx, 1);
    else list.push(cell.fullDate);
    emit("update:modelValue", list);
  }
};

const onBeforeEnter = (el) => {
  el.style.position = "absolute";
  el.style.inset = "0";
};
const onEnter = (el, done) => {
  const cls =
    transitionDir.value === "out" ? "page-transition-fade-reverse" : "page-transition-fade";
  el.classList.add(cls);
  const finish = () => {
    el.classList.remove(cls);
    el.style.position = "";
    el.style.inset = "";
    done();
  };
  el.addEventListener("animationend", finish, { once: true });
  setTimeout(finish, 200);
  nextTick(() => {
    if (viewMode.value === 0) scrollDayTo(headerYear.value, headerMonth.value);
    else if (viewMode.value === 1) scrollMonthTo(headerYear.value);
    else scrollYearTo(headerDecade.value);
  });
};
const onBeforeLeave = (el) => {
  el.style.position = "absolute";
  el.style.inset = "0";
};
const onLeave = (el, done) => {
  const cls =
    transitionDir.value === "out" ? "page-transition-fade" : "page-transition-fade-reverse";
  el.style.animationDirection = "reverse";
  el.classList.add(cls);
  el.addEventListener(
    "animationend",
    () => {
      el.classList.remove(cls);
      el.style.animationDirection = "";
      done();
    },
    { once: true },
  );
};

onMounted(() => {
  nextTick(() => nextTick(() => scrollDayTo(todayYear, todayMonth)));
});
</script>

<style scoped>
  .win-calendar-view {
    width: 300px;
    background: var(--layer-default);
    backdrop-filter: var(--flyout-backdrop);
    border: 1px solid var(--ctrl-border-rest);
    border-radius: 4px;
    padding: 12px;
    box-sizing: border-box;
    user-select: none;
  }

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.calendar-title-btn {
  font-weight: 600;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  height: 32px;
  flex: 1;
  margin-right: 4px;
  justify-content: flex-start;
}

.calendar-nav {
  display: flex;
  gap: 4px;
}

.icon-btn {
  font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets";
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  cursor: pointer;
}

.icon-btn:hover {
  background: var(--subtle-secondary);
}

.calendar-divider {
  height: 1px;
  background: var(--ctrl-border-rest);
  margin: 8px -12px;
}

.calendar-view-body {
  height: 268px;
  overflow: hidden;
  position: relative;
}

.calendar-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: absolute;
  inset: 0;
}

.calendar-day-headers {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  flex-shrink: 0;
}

.calendar-day-header {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  color: var(--text-primary);
  height: 28px;
}

.calendar-scroll {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
}

.calendar-scroll::-webkit-scrollbar {
  display: none;
}

.large-scroll {
  height: 240px;
  margin: auto 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-large-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 65px;
  width: 100%;
}

.calendar-day {
  height: 40px;
  border-radius: 20px;
  background: transparent;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--text-primary);
  position: relative;
  cursor: pointer;
}

.calendar-large-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin: auto;
  background: transparent;
  border: 1px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--text-primary);
  position: relative;
  cursor: pointer;
}

.calendar-day:hover,
.calendar-large-btn:hover {
  background: var(--subtle-secondary);
}

.out-of-scope {
  color: var(--text-disabled);
}

.hidden {
  visibility: hidden;
}

  .calendar-day.today {
    position: relative;
    border: 1px solid transparent;
  }

    .calendar-day.today::before {
      content: "";
      position: absolute;
      inset: 1px;
      background: var(--accent-base);
      border-radius: 50%;
      z-index: 0;
    }

    .calendar-day.today .day-text,
    .calendar-day.today .group-label {
      color: var(--accent-text);
      position: relative;
      z-index: 1;
    }

    .calendar-day.today.selected {
      border-color: var(--accent-base);
    }

      .calendar-day.today.selected::before {
        inset: 1px;
      }

.calendar-day.selected:not(.today) {
  border-color: var(--accent-base);
  color: var(--accent-base);
}

.calendar-large-btn.current {
  background: var(--accent-base);
  color: var(--accent-text);
}

.calendar-large-btn.current .group-label {
  color: var(--accent-text);
}

.calendar-large-btn.selected:not(.current) {
  border-color: var(--accent-base);
  color: var(--accent-base);
}

.group-label {
  position: absolute;
  top: 2px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 8px;
  color: var(--text-secondary);
  pointer-events: none;
}

.calendar-large-btn .group-label {
  top: 6px;
}

.label-accent {
  color: var(--accent-base) !important;
}

@keyframes page-transition-fade {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.page-transition-fade {
  animation: page-transition-fade 0.15s ease-out forwards;
}

.page-transition-fade-reverse {
  animation: page-transition-fade 0.15s ease-in forwards;
  animation-direction: reverse;
}
</style>
