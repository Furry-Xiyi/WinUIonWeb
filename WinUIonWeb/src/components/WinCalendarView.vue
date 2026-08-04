<template>
  <div class="win-calendar-view">
    <div class="calendar-header">
      <button
        class="win-btn DefaultButtonStyle subtle calendar-title-btn"
        @click="onLabelClick"
        :disabled="!IsEnabled || viewMode === 2"
      >
        <span>{{ labelText }}</span>
      </button>
      <div class="calendar-nav">
        <button class="icon-btn" :disabled="!IsEnabled" :aria-label="t('text.previous')" v-bind="{ 'tooltipservice.tooltip': t('text.previous') }" @click="onNav(-1)">&#xEDDB;</button>
        <button class="icon-btn" :disabled="!IsEnabled" :aria-label="t('text.next')" v-bind="{ 'tooltipservice.tooltip': t('text.next') }" @click="onNav(1)">&#xEDDC;</button>
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
            <div v-for="d in dayNames" :key="d" class="calendar-day-header">{{ d }}</div>
          </div>
          <WinScrollViewer
            class="calendar-scroll"
            ref="dayScrollEl"
            VerticalScrollMode="Auto"
            VerticalScrollBarVisibility="Hidden"
            HorizontalScrollMode="Disabled"
            HorizontalScrollBarVisibility="Disabled"
            @ViewChanged="onDayScroll">
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
                      hidden: cell.outOfScope && !IsOutOfScopeEnabled,
                      today: cell.isToday && IsTodayHighlighted,
                      selected: isSelected(cell),
                    }"
                    :disabled="!IsEnabled"
                    @click="onSelectDay(cell)"
                  >
                    <span
                      v-if="cell.showLabel && IsGroupLabelVisible"
                      class="group-label"
                      :class="{ 'label-accent': isDayLabelAccent(cell) }"
                    >{{ cell.labelText }}</span>
                    <span class="day-text">{{ cell.date }}</span>
                  </button>
                </div>
              </div>
            </div>
          </WinScrollViewer>
        </div>

        <!-- 月视图 (4列) -->
        <div v-else-if="viewMode === 1" key="month" class="calendar-panel">
          <WinScrollViewer
            class="calendar-scroll large-scroll"
            ref="monthScrollEl"
            VerticalScrollMode="Auto"
            VerticalScrollBarVisibility="Hidden"
            HorizontalScrollMode="Disabled"
            HorizontalScrollBarVisibility="Disabled"
            @ViewChanged="onMonthScroll">
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
                    :disabled="!IsEnabled"
                    @click="onSelectMonth(item)"
                  >
                    <span
                      v-if="item.showLabel && IsGroupLabelVisible"
                      class="group-label"
                      :class="{ 'label-accent': isMonthLabelAccent(item) }"
                    >{{ item.labelText }}</span>
                    <span>{{ item.text }}</span>
                  </button>
                </div>
              </div>
            </div>
          </WinScrollViewer>
        </div>

        <!-- 年视图 (4列) -->
        <div v-else key="year" class="calendar-panel">
          <WinScrollViewer
            class="calendar-scroll large-scroll"
            ref="yearScrollEl"
            VerticalScrollMode="Auto"
            VerticalScrollBarVisibility="Hidden"
            HorizontalScrollMode="Disabled"
            HorizontalScrollBarVisibility="Disabled"
            @ViewChanged="onYearScroll">
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
                    :disabled="!IsEnabled"
                    @click="onSelectYear(item)"
                  >
                    <span>{{ item.year }}</span>
                  </button>
                </div>
              </div>
            </div>
          </WinScrollViewer>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from "vue";
import WinScrollViewer from "./WinScrollViewer.vue";
import { useI18n } from "./i18n/index";

const { t } = useI18n();

const props = defineProps({
  CalendarIdentifier: { type: String, default: "GregorianCalendar" },
  DayOfWeekFormat: { type: String, default: "{dayofweek.abbreviated(2)}" },
  DisplayMode: { type: String, default: "Month" },
  FirstDayOfWeek: { type: String, default: "Sunday" },
  IsGroupLabelVisible: { type: Boolean, default: true },
  IsEnabled: { type: Boolean, default: true },
  IsOutOfScopeEnabled: { type: Boolean, default: true },
  IsTodayHighlighted: { type: Boolean, default: true },
  MaxDate: { type: Date, default: () => new globalThis.Date(2120, 11, 31) },
  MinDate: { type: Date, default: () => new globalThis.Date(1920, 0, 1) },
  NumberOfWeeksInView: { type: Number, default: 6 },
  SelectedDates: { type: Array, default: null },
  SelectionMode: { type: String, default: "Single" },
  Language: { type: String, default: "en-US" },
});

const emit = defineEmits(["update:SelectedDates", "SelectedDatesChanged", "CalendarViewDayItemChanging"]);

const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth();
const todayStr = today.toDateString();

const displayModeIndexes = {
  Month: 0,
  Year: 1,
  Decade: 2,
};
const viewMode = ref(displayModeIndexes[props.DisplayMode] ?? 0);
const transitionDir = ref("out");

const dayScrollEl = ref(null);
const monthScrollEl = ref(null);
const yearScrollEl = ref(null);
const pendingViewTarget = ref(null);

const headerMonth = ref(todayMonth);
const headerYear = ref(todayYear);
const headerDecade = ref(Math.floor(todayYear / 10) * 10);
const localSelectedDates = ref([]);
const selectedDates = computed(() => Array.isArray(props.SelectedDates) ? props.SelectedDates : localSelectedDates.value);

const calendarNames = {
  GregorianCalendar: "gregory",
  HebrewCalendar: "hebrew",
  HijriCalendar: "islamic",
  JapaneseCalendar: "japanese",
  JulianCalendar: "gregory",
  KoreanCalendar: "gregory",
  PersianCalendar: "persian",
  TaiwanCalendar: "roc",
  ThaiCalendar: "buddhist",
  UmAlQuraCalendar: "islamic-umalqura",
};
const calendarLocale = computed(() => {
  const locale = `${props.Language}-u-ca-${calendarNames[props.CalendarIdentifier] ?? "gregory"}`;
  try {
    new Intl.DateTimeFormat(locale).format();
    return locale;
  } catch {
    return props.Language;
  }
});
const formatMonthName = (month, style) => new Intl.DateTimeFormat(calendarLocale.value, { month: style }).format(new Date(2024, month, 1));
const shortMonths = computed(() => Array.from({ length: 12 }, (_, month) => formatMonthName(month, "short")));
const monthNames = computed(() => Array.from({ length: 12 }, (_, month) => formatMonthName(month, "long")));
const dayOfWeekIndexes = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};
const firstDayIndex = dayOfWeekIndexes[props.FirstDayOfWeek] ?? 0;
const dayNames = computed(() => {
  const formatter = new Intl.DateTimeFormat(calendarLocale.value, { weekday: "short" });
  const names = Array.from({ length: 7 }, (_, day) => formatter.format(new Date(2024, 0, 7 + day)).slice(0, 2));
  return [...names.slice(firstDayIndex), ...names.slice(0, firstDayIndex)];
});
const formatDayNumber = (date) => new Intl.NumberFormat(calendarLocale.value, { useGrouping: false }).format(date.getDate());

const labelText = computed(() => {
  const currentHeaderDate = new Date(headerYear.value, headerMonth.value, 1);
  if (viewMode.value === 0) return new Intl.DateTimeFormat(calendarLocale.value, { month: "long", year: "numeric" }).format(currentHeaderDate);
  if (viewMode.value === 1) return new Intl.DateTimeFormat(calendarLocale.value, { year: "numeric" }).format(currentHeaderDate);
  return `${headerDecade.value} - ${headerDecade.value + 9}`;
});

const MIN_YEAR = props.MinDate.getFullYear();
const MAX_YEAR = props.MaxDate.getFullYear();
const ROW_H = 40;
const LARGE_ROW_H = 60;
const LARGE_PAGE_ROWS = 4;
const LARGE_PAGE_H = LARGE_ROW_H * LARGE_PAGE_ROWS;
const MONTH_PAGE_ROWS = 3;
const MONTH_PAGE_H = LARGE_ROW_H * MONTH_PAGE_ROWS;
const DAY_MS = 24 * 60 * 60 * 1000;

const dateSerial = (y, m, d) => Math.floor(Date.UTC(y, m, d) / DAY_MS);
const weekdayOfSerial = (serial) => (new Date(serial * DAY_MS).getUTCDay() - firstDayIndex + 7) % 7;
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
        date: formatDayNumber(fullDate),
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
  if (!selectedDates.value.length) return false;
  const dates = selectedDates.value;
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
  if (!selectedDates.value.length) return false;
  const d = cell.fullDate;
  return selectedDates.value.some((v) => v.toDateString() === d.toDateString());
};

const isMonthLabelAccent = (item) => {
  if (item.isTodayMonth) return false;
  return isMonthSelected(item);
};

const isDayLabelAccent = (cell) => {
  if (cell.isToday) return false;
  return isSelected(cell);
};

const onDayScroll = (args) => {
  dayScrollTop.value = args?.verticalOffset ?? dayScrollEl.value?.scrollTop ?? 0;
  computeDayView();
};
const onMonthScroll = (args) => {
  monthScrollTop.value = args?.verticalOffset ?? monthScrollEl.value?.scrollTop ?? 0;
  computeMonthView();
};
const onYearScroll = (args) => {
  yearScrollTop.value = args?.verticalOffset ?? yearScrollEl.value?.scrollTop ?? 0;
  computeYearView();
};

const scrollViewerElement = (viewer) => viewer?.scrollViewerRef?.value ?? viewer?.scrollViewerRef ?? null;
const afterScrollLayout = (callback) => {
  nextTick(() => {
    const raf = globalThis.requestAnimationFrame ?? ((fn) => globalThis.setTimeout(fn, 0));
    raf(() => raf(callback));
  });
};

const setViewerTop = (viewer, top, smooth = false) => {
  const element = scrollViewerElement(viewer);
  if (smooth && element?.scrollTo) {
    element.scrollTo({ top, behavior: "smooth" });
    return;
  }
  if (viewer?.ChangeView) viewer.ChangeView(null, top, null);
  else viewer?.ScrollTo?.(0, top);
};

const absMonthOf = (y, m) => (y - MIN_YEAR) * 12 + m;

const scrollDayTo = (y, m, smooth = false) => {
  const idx = absMonthOf(y, m);
  const meta = monthMeta.data[idx];
  if (!meta) return;
  const top = meta.startRow * ROW_H;
  afterScrollLayout(() => {
    if (!dayScrollEl.value) return;
    if (smooth) setViewerTop(dayScrollEl.value, top, true);
    else {
      setViewerTop(dayScrollEl.value, top);
      dayScrollTop.value = top;
      computeDayView();
    }
  });
};

const scrollMonthTo = (y, smooth = false) => {
  const pageIdx = y - MIN_YEAR;
  const top = pageIdx * MONTH_PAGE_H;
  afterScrollLayout(() => {
    if (!monthScrollEl.value) return;
    if (smooth) setViewerTop(monthScrollEl.value, top, true);
    else {
      setViewerTop(monthScrollEl.value, top);
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
  afterScrollLayout(() => {
    if (!yearScrollEl.value) return;
    if (smooth) setViewerTop(yearScrollEl.value, top, true);
    else {
      setViewerTop(yearScrollEl.value, top);
      yearScrollTop.value = top;
      computeYearView();
    }
  });
};

const onNav = (dir) => {
  transitionDir.value = dir > 0 ? "forward" : "backward";
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
    const targetYear = headerYear.value;
    transitionDir.value = "out";
    pendingViewTarget.value = { mode: 1, year: targetYear };
    viewMode.value = 1;
    scrollMonthTo(targetYear);
  } else if (viewMode.value === 1) {
    const targetDecade = Math.floor(headerYear.value / DECADE_SIZE) * DECADE_SIZE;
    transitionDir.value = "out";
    pendingViewTarget.value = { mode: 2, decade: targetDecade };
    viewMode.value = 2;
    scrollYearTo(targetDecade);
  }
};

const onSelectMonth = (item) => {
  transitionDir.value = "in";
  headerMonth.value = item.month;
  headerYear.value = item.year;
  pendingViewTarget.value = { mode: 0, year: item.year, month: item.month };
  viewMode.value = 0;
};

const onSelectYear = (item) => {
  transitionDir.value = "in";
  headerYear.value = item.year;
  pendingViewTarget.value = { mode: 1, year: item.year };
  viewMode.value = 1;
};

const onSelectDay = (cell) => {
  if (!props.IsEnabled) return;
  if (cell.outOfScope && !props.IsOutOfScopeEnabled) return;
  if (props.SelectionMode === "None") return;

  const oldDates = [...selectedDates.value];
  if (props.SelectionMode === "Single") {
    const wasSelected = selectedDates.value.some((date) => date.toDateString() === cell.fullDate.toDateString());
    const newDates = wasSelected ? [] : [cell.fullDate];
    if (!Array.isArray(props.SelectedDates)) localSelectedDates.value = newDates;
    emit("update:SelectedDates", newDates);
    emit("SelectedDatesChanged", {
      addedDates: wasSelected ? [] : newDates,
      removedDates: wasSelected ? oldDates : oldDates.filter((date) => date.toDateString() !== cell.fullDate.toDateString())
    });
  } else if (props.SelectionMode === "Multiple") {
    const list = [...selectedDates.value];
    const idx = list.findIndex((d) => d.toDateString() === cell.fullDate.toDateString());
    const addedDates = [];
    const removedDates = [];
    if (idx >= 0) removedDates.push(...list.splice(idx, 1));
    else {
      list.push(cell.fullDate);
      addedDates.push(cell.fullDate);
    }
    emit("update:SelectedDates", list);
    if (!Array.isArray(props.SelectedDates)) localSelectedDates.value = list;
    emit("SelectedDatesChanged", { addedDates, removedDates });
  }
};

const onBeforeEnter = (el) => {
  el.style.position = "absolute";
  el.style.inset = "0";
};
const onEnter = (el, done) => {
  const cls = transitionDir.value === "forward"
    ? "calendar-view-enter-forward"
    : transitionDir.value === "backward"
      ? "calendar-view-enter-backward"
      : transitionDir.value === "out"
      ? "calendar-view-enter-out"
        : "calendar-view-enter-in";
  el.classList.add(cls);
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    el.classList.remove(cls);
    el.style.position = "";
    el.style.inset = "";
    done();
  };
  el.addEventListener("animationend", finish, { once: true });
  setTimeout(finish, 333);
  const target = pendingViewTarget.value;
  if (target?.mode === viewMode.value) {
    pendingViewTarget.value = null;
    if (target.mode === 0) scrollDayTo(target.year, target.month);
    else if (target.mode === 1) scrollMonthTo(target.year);
    else scrollYearTo(target.decade);
    return;
  }
  if (viewMode.value === 0) scrollDayTo(headerYear.value, headerMonth.value);
  else if (viewMode.value === 1) scrollMonthTo(headerYear.value);
  else scrollYearTo(headerDecade.value);
};
const onBeforeLeave = (el) => {
  el.style.position = "absolute";
  el.style.inset = "0";
};
const onLeave = (el, done) => {
  const cls = transitionDir.value === "forward"
    ? "calendar-view-leave-forward"
    : transitionDir.value === "backward"
      ? "calendar-view-leave-backward"
      : transitionDir.value === "out"
        ? "calendar-view-leave-out"
        : "calendar-view-leave-in";
  el.classList.add(cls);
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    el.classList.remove(cls);
    done();
  };
  el.addEventListener(
    "animationend",
    finish,
    { once: true },
  );
  setTimeout(finish, 333);
};

onMounted(() => {
  nextTick(() => nextTick(() => scrollDayTo(todayYear, todayMonth)));
});

watch([() => props.Language, () => props.CalendarIdentifier], () => {
  nextTick(() => {
    computeDayView();
    computeMonthView();
    computeYearView();
  });
});
</script>

<style scoped>
  .win-calendar-view {
    position: relative;
    width: 304px;
    min-width: 304px;
    flex: 0 0 304px;
    isolation: isolate;
    background: transparent;
    -webkit-backdrop-filter: var(--calendar-view-backdrop, var(--flyout-backdrop));
    backdrop-filter: var(--calendar-view-backdrop, var(--flyout-backdrop));
    border: 1px solid var(--ctrl-border-rest);
    border-radius: 4px;
    padding: 12px;
    box-sizing: border-box;
    user-select: none;
  }

  .win-calendar-view::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    border-radius: inherit;
    background: var(--calendar-view-fill, var(--layer-default));
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

.icon-btn:disabled,
.calendar-title-btn:disabled {
  color: var(--text-disabled, var(--text-secondary));
  cursor: default;
}

.icon-btn:disabled:hover,
.calendar-title-btn:disabled:hover {
  background: transparent;
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
  grid-template-columns: repeat(7, minmax(40px, 1fr));
  min-width: 280px;
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
  min-height: 0;
}

.large-scroll {
  height: 240px;
  margin: auto 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(40px, 1fr));
  min-width: 280px;
}

.calendar-large-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 65px;
  width: 100%;
}

.calendar-day {
  width: 40px;
  min-width: 40px;
  height: 40px;
  box-sizing: border-box;
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

.calendar-day:disabled,
.calendar-large-btn:disabled {
  color: var(--text-disabled, var(--text-secondary));
  cursor: default;
}

.calendar-day:disabled:hover,
.calendar-large-btn:disabled:hover {
  background: transparent;
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

@keyframes calendar-view-enter-forward {
  from { opacity: 0; transform: translateX(16px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes calendar-view-enter-backward {
  from { opacity: 0; transform: translateX(-16px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes calendar-view-leave-forward {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(-16px); }
}

@keyframes calendar-view-leave-backward {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(16px); }
}

@keyframes calendar-view-enter-out {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes calendar-view-enter-in {
  from { opacity: 0; transform: translateY(-8px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes calendar-view-leave-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-8px) scale(1.02); }
}

@keyframes calendar-view-leave-in {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(8px) scale(1.02); }
}

.calendar-view-enter-forward,
.calendar-view-enter-backward,
.calendar-view-enter-out,
.calendar-view-enter-in {
  animation-duration: 333ms;
  animation-timing-function: cubic-bezier(0.1, 0.9, 0.2, 1);
  animation-fill-mode: both;
}

.calendar-view-enter-forward { animation-name: calendar-view-enter-forward; }
.calendar-view-enter-backward { animation-name: calendar-view-enter-backward; }
.calendar-view-enter-out { animation-name: calendar-view-enter-out; }
.calendar-view-enter-in { animation-name: calendar-view-enter-in; }

.calendar-view-leave-forward,
.calendar-view-leave-backward,
.calendar-view-leave-out,
.calendar-view-leave-in {
  animation-duration: 167ms;
  animation-timing-function: cubic-bezier(0.7, 0, 1, 0.5);
  animation-fill-mode: both;
}

.calendar-view-leave-forward { animation-name: calendar-view-leave-forward; }
.calendar-view-leave-backward { animation-name: calendar-view-leave-backward; }
.calendar-view-leave-out { animation-name: calendar-view-leave-out; }
.calendar-view-leave-in { animation-name: calendar-view-leave-in; }
</style>
