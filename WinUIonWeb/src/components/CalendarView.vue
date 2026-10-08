<template>
  <div ref="root" class="win-calendar-view" v-bind="rootAttrs">
    <div class="calendar-header">
      <button type="button" class="calendar-header-button" data-cmd="header" v-bind="headerAttrs"><span>{{ headerText }}</span></button>
      <button type="button" class="calendar-nav-button" data-cmd="previous" v-bind="previousAttrs">&#xEDDB;</button>
      <button type="button" class="calendar-nav-button" data-cmd="next" v-bind="nextAttrs">&#xEDDC;</button>
    </div>
    <div class="calendar-separator" aria-hidden="true"></div>
    <div ref="views" class="calendar-views">
      <div class="calendar-background-layer" aria-hidden="true"></div>
      <div class="calendar-view-panel" data-panel="Month">
        <div class="calendar-weekday-names"><span v-for="(name, i) in weekdayNames" v-bind="{ key: i }">{{ name }}</span></div>
        <ScrollViewer ref="monthViewer" class="calendar-scroll" Template="{StaticResource ScrollViewerScrollBarlessTemplate}" HorizontalScrollMode="Disabled" VerticalScrollMode="Enabled" HorizontalScrollBarVisibility="Disabled" VerticalScrollBarVisibility="Hidden" IsVerticalScrollChainingEnabled="False" IsTabStop="False">
          <div class="calendar-extent" v-bind="{ style: { height: dayExtent + 'px' } }"><div class="calendar-day-grid" v-bind="{ style: { top: dayRenderTop + 'px' } }">
            <div v-for="cell in dayCells" class="calendar-slot" v-bind="{ key: cell.serial, style: { height: rowHeight + 'px' } }"><button type="button" class="calendar-item calendar-day-item" v-bind="dayAttrs(cell)"><span v-if="cell.showLabel && groupLabels" class="calendar-label month-label">{{ cell.month.text }}</span><span class="calendar-text">{{ model.dayNumber(cell.serial) }}</span><span v-if="cell.state.DensityColors.length" class="calendar-density"><span v-for="(color, i) in cell.state.DensityColors" v-bind="{ key: i, style: { background: color } }"></span></span></button></div>
          </div></div>
        </ScrollViewer>
      </div>
      <div class="calendar-view-panel" data-panel="Year"><ScrollViewer ref="yearViewer" class="calendar-scroll" Template="{StaticResource ScrollViewerScrollBarlessTemplate}" HorizontalScrollMode="Disabled" VerticalScrollMode="Enabled" HorizontalScrollBarVisibility="Disabled" VerticalScrollBarVisibility="Hidden" IsVerticalScrollChainingEnabled="False" IsTabStop="False">
        <div class="calendar-extent" v-bind="{ style: { height: yearExtent + 'px' } }"><div class="calendar-large-grid" v-bind="{ style: { top: monthRenderTop + 'px', gridTemplateColumns: 'repeat(' + columns + ', minmax(0, 1fr))' } }"><div v-for="item in monthCells" class="calendar-slot" v-bind="{ key: item.index, style: { height: largeRowHeight + 'px' } }"><button type="button" class="calendar-item calendar-large-item" v-bind="monthAttrs(item)"><span v-if="item.index === model.years[item.yearIndex].firstMonth && groupLabels" class="calendar-label year-label">{{ item.label }}</span><span class="calendar-text">{{ item.text }}</span></button></div></div></div>
      </ScrollViewer></div>
      <div class="calendar-view-panel" data-panel="Decade"><ScrollViewer ref="decadeViewer" class="calendar-scroll" Template="{StaticResource ScrollViewerScrollBarlessTemplate}" HorizontalScrollMode="Disabled" VerticalScrollMode="Enabled" HorizontalScrollBarVisibility="Disabled" VerticalScrollBarVisibility="Hidden" IsVerticalScrollChainingEnabled="False" IsTabStop="False">
        <div class="calendar-extent" v-bind="{ style: { height: decadeExtent + 'px' } }"><div class="calendar-large-grid" v-bind="{ style: { top: yearRenderTop + 'px', gridTemplateColumns: 'repeat(' + columns + ', minmax(0, 1fr))' } }"><div v-for="item in yearCells" class="calendar-slot" v-bind="{ key: item.index, style: { height: largeRowHeight + 'px' } }"><button type="button" class="calendar-item calendar-large-item" v-bind="yearAttrs(item)"><span class="calendar-text">{{ item.text }}</span></button></div></div></div>
      </ScrollViewer></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch, type ButtonHTMLAttributes } from 'vue';
import ScrollViewer from './ScrollViewer.vue';
import { useI18n } from './i18n/index';
import { resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlColor } from './xamlRuntime';
import { calendarDateFromSerial, calendarDateSerial, createCalendarModel, parseCalendarDate } from './calendarEngine';
import type { CalendarMonth, CalendarYear } from './calendarEngine';
type Mode = 'Month' | 'Year' | 'Decade';
type DayState = {
    Date: Date;
    IsBlackout: boolean;
    DensityColors: string[];
    SetDensityColors: (colors: Iterable<unknown>) => void;
};
type DayCell = {
    serial: number;
    month: CalendarMonth;
    outOfScope: boolean;
    showLabel: boolean;
    state: DayState;
};
const props = defineProps({
    CalendarIdentifier: { type: String, default: 'GregorianCalendar' }, DayOfWeekFormat: { type: String, default: '{dayofweek.abbreviated(2)}' }, DisplayMode: { type: String, default: 'Month' }, FirstDayOfWeek: { type: [String, Number], default: 'Sunday' },
    IsGroupLabelVisible: { type: [Boolean, String], default: false }, IsEnabled: { type: [Boolean, String], default: true }, IsOutOfScopeEnabled: { type: [Boolean, String], default: true }, IsTodayHighlighted: { type: [Boolean, String], default: true },
    MaxDate: { type: [Date, String, Number], default: undefined }, MinDate: { type: [Date, String, Number], default: undefined }, NumberOfWeeksInView: { type: [Number, String], default: 6 }, SelectedDates: { type: [Array, String], default: undefined }, SelectionMode: { type: String, default: 'Single' }, Language: { type: String, default: '' }, RequestedTheme: { type: String, default: 'Default' }, SelectedDatesChanged: { type: [String, Function], default: undefined }, CalendarViewDayItemChanging: { type: [String, Function], default: undefined },
    Style: [Object, String], Width: [Number, String], Height: [Number, String], MinWidth: [Number, String], MinHeight: [Number, String], MaxWidth: [Number, String], MaxHeight: [Number, String], Margin: [Number, String], Padding: [Number, String], HorizontalAlignment: { type: String, default: 'Left' }, VerticalAlignment: { type: String, default: 'Center' }, CornerRadius: [Number, String], BorderThickness: [Number, String], CalendarItemBorderThickness: [Number, String], CalendarItemCornerRadius: [Number, String],
    DayItemFontFamily: String, DayItemFontSize: [Number, String], DayItemFontWeight: [Number, String], DayItemMargin: [Number, String], FirstOfMonthLabelFontFamily: String, FirstOfMonthLabelFontSize: [Number, String], FirstOfMonthLabelFontWeight: [Number, String], FirstOfMonthLabelMargin: [Number, String], MonthYearItemFontFamily: String, MonthYearItemFontSize: [Number, String], MonthYearItemFontWeight: [Number, String], MonthYearItemMargin: [Number, String], FirstOfYearDecadeLabelFontFamily: String, FirstOfYearDecadeLabelFontSize: [Number, String], FirstOfYearDecadeLabelFontWeight: [Number, String], FirstOfYearDecadeLabelMargin: [Number, String], TodayFontWeight: [Number, String], Foreground: String, Background: String, BorderBrush: String, BlackoutStrikethroughBrush: String, SelectedHoverBorderBrush: String, SelectedPressedBorderBrush: String, SelectedDisabledBorderBrush: String, SelectedBorderBrush: String, HoverBorderBrush: String, PressedBorderBrush: String, CalendarItemBorderBrush: String, TodaySelectedInnerBorderBrush: String, TodayForeground: String, DisabledForeground: String, BlackoutForeground: String, SelectedForeground: String, SelectedHoverForeground: String, SelectedPressedForeground: String, SelectedDisabledForeground: String, PressedForeground: String, OutOfScopeForeground: String, OutOfScopeHoverForeground: String, OutOfScopePressedForeground: String, CalendarItemForeground: String, TodayBackground: String, TodayBlackoutBackground: String, TodayBlackoutForeground: String, TodayHoverBackground: String, TodayPressedBackground: String, TodayDisabledBackground: String, BlackoutBackground: String, OutOfScopeBackground: String, CalendarItemBackground: String, CalendarItemHoverBackground: String, CalendarItemPressedBackground: String, CalendarItemDisabledBackground: String
});
const emit = defineEmits(['SelectedDatesChanged', 'CalendarViewDayItemChanging', 'update:SelectedDates', 'update:DisplayMode']);
const instance = getCurrentInstance();
const { t, locale } = useI18n();
const resolve = (value: unknown) => resolveXamlValue(value, instance);
const text = (value: unknown, fallback: string) => String(resolve(value) ?? fallback);
const number = (value: unknown, fallback: number) => { const n = Number(resolve(value)); return Number.isFinite(n) ? n : fallback; };
const bool = (value: unknown, fallback: boolean) => { const v = resolve(value); return typeof v === 'boolean' ? v : typeof v === 'string' && /^(true|false)$/i.test(v) ? v.toLowerCase() === 'true' : fallback; };
const enabled = computed(() => bool(props.IsEnabled, true));
const groupLabels = computed(() => bool(props.IsGroupLabelVisible, false));
const outOfScope = computed(() => bool(props.IsOutOfScopeEnabled, true));
const todayHighlight = computed(() => bool(props.IsTodayHighlighted, true));
const langOverride = ref<string>();
const idOverride = ref<string>();
const modeOverride = ref<string>();
const language = computed(() => langOverride.value ?? (text(props.Language, '') || locale));
const identifier = computed(() => idOverride.value ?? text(props.CalendarIdentifier, 'GregorianCalendar'));
const selectionMode = computed(() => modeOverride.value ?? text(props.SelectionMode, 'Single'));
const today = calendarDateSerial(new Date());
const defaultMin = new Date(new Date().getFullYear() - 100, 0, 1);
const defaultMax = new Date(new Date().getFullYear() + 100, 11, 31);
const minimum = computed(() => calendarDateSerial(parseCalendarDate(resolve(props.MinDate)) ?? defaultMin));
const maximum = computed(() => Math.max(minimum.value, calendarDateSerial(parseCalendarDate(resolve(props.MaxDate)) ?? defaultMax)));
const clamp = (serial: number) => Math.max(minimum.value, Math.min(maximum.value, serial));
const model = computed(() => createCalendarModel(identifier.value, language.value, minimum.value, maximum.value));
const firstDay = computed(() => { const v = resolve(props.FirstDayOfWeek); const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; const n = typeof v === 'number' ? v : names.indexOf(String(v)); return n < 0 || n > 6 ? 0 : n; });
const weeks = computed(() => Math.max(2, Math.min(8, Math.trunc(number(props.NumberOfWeeksInView, 6)))));
const weekdayNames = computed(() => Array.from({ length: 7 }, (_, i) => model.value.weekdayText(19729 + firstDay.value + i, text(props.DayOfWeekFormat, '{dayofweek.abbreviated(2)}'))));
const root = ref<HTMLElement>();
const views = ref<HTMLElement>();
const monthViewer = ref<any>();
const yearViewer = ref<any>();
const decadeViewer = ref<any>();
const currentMode = ref<Mode>('Month');
const displayDate = ref(clamp(today));
const anchorDate = ref(clamp(today));
const focusedDate = ref(clamp(today));
const columns = ref(4);
const rows = ref(4);
const rowHeight = ref(42);
const viewHeight = ref(294);
const offsets = reactive<Record<Mode, number>>({ Month: 0, Year: 0, Decade: 0 });
const dayStates = reactive(new Map<number, DayState>());
const localSelected = ref<Date[]>([]);
const selectedSerials = computed(() => new Set(localSelected.value.map(calendarDateSerial)));
const dayStart = computed(() => minimum.value - ((new Date(minimum.value * 86400000).getUTCDay() - firstDay.value + 7) % 7));
const dayRows = computed(() => Math.ceil((maximum.value - dayStart.value + 1) / 7));
const dayExtent = computed(() => dayRows.value * rowHeight.value + 4);
const largeRowHeight = computed(() => Math.max(40, viewHeight.value / rows.value));
const yearExtent = computed(() => Math.ceil(model.value.months.length / columns.value) * largeRowHeight.value + 4);
const decadeExtent = computed(() => Math.ceil(model.value.years.length / columns.value) * largeRowHeight.value + 4);
const dayStartRow = computed(() => Math.max(0, Math.floor(offsets.Month / rowHeight.value) - 2));
const dayRenderTop = computed(() => dayStartRow.value * rowHeight.value + 2);
const monthStartRow = computed(() => Math.max(0, Math.floor(offsets.Year / largeRowHeight.value) - 1));
const monthRenderTop = computed(() => monthStartRow.value * largeRowHeight.value + 2);
const yearStartRow = computed(() => Math.max(0, Math.floor(offsets.Decade / largeRowHeight.value) - 1));
const yearRenderTop = computed(() => yearStartRow.value * largeRowHeight.value + 2);
const getDayState = (serial: number): DayState => { let state = dayStates.get(serial); if (!state) {
    state = reactive({ Date: calendarDateFromSerial(serial), IsBlackout: false, DensityColors: [] as string[], SetDensityColors(colors: Iterable<unknown>) { this.DensityColors = Array.from(colors ?? []).slice(0, 10).map(color => String(xamlColor(color))); } });
    dayStates.set(serial, state);
} return state; };
const scopeMonth = computed(() => model.value.monthAt(displayDate.value));
const scopeYear = computed(() => model.value.yearAt(displayDate.value));
const decade = computed(() => Math.floor(model.value.displayYear(scopeYear.value) / 10) * 10);
const dayCells = computed<DayCell[]>(() => { const cells: DayCell[] = []; const end = Math.min(dayRows.value, dayStartRow.value + weeks.value + 5); for (let row = dayStartRow.value; row < end; row++)
    for (let col = 0; col < 7; col++) {
        const serial = dayStart.value + row * 7 + col;
        const month = model.value.monthAt(serial);
        cells.push({ serial, month, outOfScope: month.index !== scopeMonth.value.index, showLabel: model.value.day(serial) === 1, state: getDayState(serial) });
    } return cells; });
const monthCells = computed(() => model.value.months.slice(monthStartRow.value * columns.value, (monthStartRow.value + rows.value + 3) * columns.value));
const yearCells = computed(() => model.value.years.slice(yearStartRow.value * columns.value, (yearStartRow.value + rows.value + 3) * columns.value));
const headerText = computed(() => currentMode.value === 'Month' ? model.value.headerText(displayDate.value) : currentMode.value === 'Year' ? scopeYear.value.text : `${model.value.formatNumber(decade.value)} - ${model.value.formatNumber(decade.value + 9)}`);
const canNavigate = (direction: number) => currentMode.value === 'Month' ? scopeMonth.value.index + direction >= 0 && scopeMonth.value.index + direction < model.value.months.length : currentMode.value === 'Year' ? scopeYear.value.index + direction >= 0 && scopeYear.value.index + direction < model.value.years.length : !!(direction > 0 ? model.value.years.find(year => model.value.displayYear(year) >= decade.value + 10) : [...model.value.years].reverse().find(year => model.value.displayYear(year) <= decade.value - 10));
const headerAttrs = computed(() => ({ disabled: !enabled.value || currentMode.value === 'Decade', 'aria-label': headerText.value }));
const previousAttrs = computed(() => ({ disabled: !enabled.value || !canNavigate(-1), 'aria-label': t('text.previous'), title: t('text.previous') }));
const nextAttrs = computed(() => ({ disabled: !enabled.value || !canNavigate(1), 'aria-label': t('text.next'), title: t('text.next') }));
const thickness = (value: unknown, fallback: string) => { const v = resolve(value); if (v === undefined || v === '')
    return fallback; if (typeof v === 'string' && v.startsWith('var('))
    return v; const parts = String(v).split(/[,\s]+/).map(Number); return parts.some(Number.isNaN) ? fallback : (parts.length === 4 ? [parts[1], parts[2], parts[3], parts[0]] : parts.length === 2 ? [parts[1], parts[0]] : parts).map(part => part + 'px').join(' '); };
const weight = (value: unknown, fallback: string) => ({ Normal: '400', SemiBold: '600', Bold: '700', Light: '300' } as Record<string, string>)[text(value, fallback)] ?? text(value, fallback);
const styleSetters = computed<Record<string, unknown>>(() => {
    const style = resolve(props.Style);
    if (!style || typeof style !== 'object')
        return {};
    const object = style as {
        Setters?: Array<{
            Property: string;
            Value: unknown;
        }>;
    };
    return Array.isArray(object.Setters) ? Object.fromEntries(object.Setters.map(setter => [setter.Property, setter.Value])) : style as Record<string, unknown>;
});
const styled = new Proxy(props as Record<string, unknown>, { get(target, key: string) { return target[key] ?? styleSetters.value[key]; } });
const rootAttrs = computed(() => {
    const style: Record<string, string | number> = { width: number(styled.Width, 300) + 'px', minWidth: number(styled.MinWidth, 300) + 'px', maxWidth: styled.MaxWidth === undefined ? '100%' : number(styled.MaxWidth, 300) + 'px', height: styled.Height === undefined ? 'auto' : number(styled.Height, 347) + 'px', minHeight: number(styled.MinHeight, 0) + 'px', maxHeight: styled.MaxHeight === undefined ? 'none' : number(styled.MaxHeight, 347) + 'px', margin: thickness(styled.Margin, '0'), padding: thickness(styled.Padding, '0'), borderWidth: thickness(styled.BorderThickness, '1px'), borderRadius: thickness(styled.CornerRadius, 'var(--ControlCornerRadius, 4px)'), '--calendar-weeks': weeks.value, '--calendar-item-border-thickness': thickness(styled.CalendarItemBorderThickness, '1px'), '--calendar-item-radius': thickness(styled.CalendarItemCornerRadius, '999px'), '--calendar-today-font-weight': weight(styled.TodayFontWeight, '400') };
    for (const name of new Set([...Object.keys(props), ...Object.keys(styleSetters.value)])) {
        if (!/(Brush|Foreground|Background)$/.test(name))
            continue;
        const v = resolve(styled[name]);
        if (typeof v === 'string' && v)
            style['--CalendarView' + name] = v;
    }
    for (const [prefix, defaults] of Object.entries({ DayItem: ['14', '3px 0 0'], MonthYearItem: ['14', '0'], FirstOfMonthLabel: ['8', '2px 0 0'], FirstOfYearDecadeLabel: ['8', '9px 0 0'] })) {
        const properties = styled;
        style['--calendar-' + prefix + '-size'] = number(properties[prefix + 'FontSize'], Number(defaults[0])) + 'px';
        style['--calendar-' + prefix + '-family'] = text(properties[prefix + 'FontFamily'], 'inherit');
        style['--calendar-' + prefix + '-weight'] = weight(properties[prefix + 'FontWeight'], '400');
        style['--calendar-' + prefix + '-margin'] = thickness(properties[prefix + 'Margin'], defaults[1]!);
    }
    style.alignSelf = ({ Top: 'flex-start', Center: 'center', Bottom: 'flex-end', Stretch: 'stretch' } as Record<string, string>)[text(props.VerticalAlignment, 'Center')]!;
    style.justifySelf = ({ Left: 'start', Center: 'center', Right: 'end', Stretch: 'stretch' } as Record<string, string>)[text(props.HorizontalAlignment, 'Left')]!;
    return { style, class: { 'is-disabled': !enabled.value, 'has-explicit-height': styled.Height !== undefined, 'win-theme-scope': true, 'theme-dark': text(props.RequestedTheme, 'Default') === 'Dark', 'theme-light': text(props.RequestedTheme, 'Default') === 'Light' }, lang: language.value, 'aria-disabled': !enabled.value, 'data-display-mode': currentMode.value };
});
const dayAttrs = (cell: DayCell): ButtonHTMLAttributes & Record<string, unknown> => { const bounds = cell.serial < minimum.value || cell.serial > maximum.value; const visibility: 'hidden' | 'visible' = bounds ? 'hidden' : 'visible'; return { 'data-date': cell.serial, 'data-kind': 'day', disabled: !enabled.value, tabindex: !bounds && cell.serial === focusedDate.value ? 0 : -1, 'aria-label': model.value.fullDateText(cell.serial), 'aria-pressed': selectedSerials.value.has(cell.serial), 'aria-disabled': !enabled.value || cell.state.IsBlackout || bounds, class: { 'out-of-scope': cell.outOfScope && outOfScope.value, 'is-today': todayHighlight.value && cell.serial === today, 'is-selected': selectedSerials.value.has(cell.serial), 'is-blackout': cell.state.IsBlackout }, style: { visibility } }; };
const monthAttrs = (item: CalendarMonth) => ({ 'data-date': item.start, 'data-kind': 'month', disabled: !enabled.value, tabindex: model.value.monthAt(focusedDate.value).index === item.index ? 0 : -1, 'aria-label': model.value.headerText(item.start), class: { 'out-of-scope': outOfScope.value && item.yearIndex !== scopeYear.value.index, 'is-today': todayHighlight.value && today >= item.start && today <= item.end } });
const yearAttrs = (item: CalendarYear) => ({ 'data-date': item.start, 'data-kind': 'year', disabled: !enabled.value, tabindex: model.value.yearAt(focusedDate.value).index === item.index ? 0 : -1, 'aria-label': item.text, class: { 'out-of-scope': outOfScope.value && (model.value.displayYear(item) < decade.value || model.value.displayYear(item) >= decade.value + 10), 'is-today': todayHighlight.value && today >= item.start && today <= item.end } });
const viewport = (mode: Mode): HTMLElement | undefined => { const viewer = mode === 'Month' ? monthViewer.value : mode === 'Year' ? yearViewer.value : decadeViewer.value; return viewer?.scrollViewerRef?.value ?? viewer?.scrollViewerRef; };
const dateTop = (serial: number, mode: Mode) => mode === 'Month' ? Math.floor((serial - dayStart.value) / 7) * rowHeight.value : mode === 'Year' ? Math.floor(model.value.monthAt(serial).index / columns.value) * largeRowHeight.value : Math.floor(model.value.yearAt(serial).index / columns.value) * largeRowHeight.value;
let preserveAnchorUntil = 0;
const scrollToDate = (serial: number, mode = currentMode.value, smooth = false, revealOnly = false, preserveAnchor = false) => {
    preserveAnchorUntil = performance.now() + 500;
    const target = clamp(serial);
    if (!preserveAnchor)
        anchorDate.value = target;
    // Animated navigation updates the header only when the visible scope changes.
    if (!smooth)
        displayDate.value = target;
    const element = viewport(mode);
    let top = dateTop(mode === 'Month' ? model.value.monthAt(target).start : mode === 'Year' ? model.value.yearAt(target).start : target, mode);
    if (revealOnly && element) {
        const itemTop = dateTop(target, mode);
        const height = mode === 'Month' ? rowHeight.value : largeRowHeight.value;
        if (itemTop >= element.scrollTop && itemTop + height <= element.scrollTop + element.clientHeight)
            return;
        top = itemTop < element.scrollTop ? itemTop : itemTop + height - element.clientHeight;
    }
    if (element)
        element.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'instant' });
    if (!smooth)
        offsets[mode] = element?.scrollTop ?? Math.max(0, top);
};
const updateScope = (mode: Mode, top: number) => {
    if (mode !== currentMode.value)
        return;
    const height = viewport(mode)?.clientHeight ?? viewHeight.value;
    const itemHeight = mode === 'Month' ? rowHeight.value : largeRowHeight.value;
    const cols = mode === 'Month' ? 7 : columns.value;
    const counts = new Map<number, number>();
    for (let row = Math.floor(top / itemHeight); row < Math.ceil((top + height) / itemHeight); row++) {
        const visible = Math.max(0, Math.min((row + 1) * itemHeight, top + height) - Math.max(row * itemHeight, top));
        for (let col = 0; col < cols; col++) {
            const index = row * cols + col;
            let key: number;
            if (mode === 'Month') {
                const serial = dayStart.value + index;
                if (serial < minimum.value || serial > maximum.value)
                    continue;
                key = model.value.monthAt(serial).index;
            }
            else if (mode === 'Year') {
                const item = model.value.months[index];
                if (!item)
                    continue;
                key = item.yearIndex;
            }
            else {
                const item = model.value.years[index];
                if (!item)
                    continue;
                key = Math.floor(model.value.displayYear(item) / 10) * 10;
            }
            counts.set(key, (counts.get(key) ?? 0) + visible);
        }
    }
    let best = -1, total = -1;
    for (const [key, count] of counts)
        if (count > total) {
            best = key;
            total = count;
        }
    if (best < 0)
        return;
    const item = mode === 'Month' ? model.value.months[best] : mode === 'Year' ? model.value.years[best] : model.value.years.find(year => Math.floor(model.value.displayYear(year) / 10) * 10 === best);
    if (item)
        displayDate.value = clamp(item.start);
};
const onScroll = (event: Event) => { const element = event.target as HTMLElement; const mode = element.closest('[data-panel]')?.getAttribute('data-panel') as Mode; if (!mode)
    return; offsets[mode] = element.scrollTop; updateScope(mode, element.scrollTop); if (performance.now() > preserveAnchorUntil)
    anchorDate.value = displayDate.value; };
const onUserScroll = () => { preserveAnchorUntil = 0; };
let animations: Animation[] = [];
let transition = 0;
const setPanelVisibility = (mode: Mode, transitionModes: Mode[] = []) => { for (const panel of views.value?.querySelectorAll<HTMLElement>('[data-panel]') ?? []) {
    const active = panel.dataset.panel === mode;
    panel.style.visibility = active || transitionModes.includes(panel.dataset.panel as Mode) ? 'visible' : 'hidden';
    panel.style.opacity = active ? '1' : '0';
    panel.style.pointerEvents = active && enabled.value ? 'auto' : 'none';
    panel.inert = !active || !enabled.value;
    panel.setAttribute('aria-hidden', String(!active));
} };
const stopAnimations = () => { transition++; animations.forEach(animation => animation.cancel()); animations = []; setPanelVisibility(currentMode.value); };
const setMode = async (mode: Mode, target = displayDate.value, animate = true, focus = false) => {
    if (!['Month', 'Year', 'Decade'].includes(mode))
        return;
    const old = currentMode.value;
    stopAnimations();
    const token = transition;
    currentMode.value = mode;
    focusedDate.value = clamp(target);
    displayDate.value = clamp(target);
    updateXamlBinding(props.DisplayMode, mode, instance);
    emit('update:DisplayMode', mode);
    await nextTick();
    setPanelVisibility(mode);
    scrollToDate(target, mode);
    if (old !== mode && animate && !globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        const outgoing = views.value?.querySelector<HTMLElement>(`[data-panel="${old}"]`);
        const incoming = views.value?.querySelector<HTMLElement>(`[data-panel="${mode}"]`);
        if (outgoing?.animate && incoming?.animate) {
            setPanelVisibility(mode, [old, mode]);
            const zoomOut = ['Month', 'Year', 'Decade'].indexOf(mode) > ['Month', 'Year', 'Decade'].indexOf(old);
            const easing = 'cubic-bezier(0,0,0,1)';
            animations = [outgoing.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: `scale(${zoomOut ? .84 : 1.29})` }], { duration: 150, easing, fill: 'forwards' }), incoming.animate([{ opacity: 0, transform: `scale(${zoomOut ? 1.29 : .84})` }, { opacity: 1, transform: 'scale(1)' }], { delay: 150, duration: 350, easing, fill: 'both' })];
            await Promise.allSettled(animations.map(animation => animation.finished));
            if (token !== transition)
                return;
            stopAnimations();
        }
    }
    if (focus)
        await focusDate(focusedDate.value);
};
const sender = {
    get SelectedDates() { return selectedCollection; },
    set SelectedDates(value: Date[]) { changeSelection(value); },
    get SelectionMode() { return selectionMode.value; },
    set SelectionMode(value: string) { modeOverride.value = value; },
    get Language() { return language.value; },
    set Language(value: string) { langOverride.value = value; },
    get CalendarIdentifier() { return identifier.value; },
    set CalendarIdentifier(value: string) { idOverride.value = value; },
    get DisplayMode() { return currentMode.value; },
    set DisplayMode(value: Mode) { void setMode(value); },
    SetDisplayDate(date: Date | string) {
        const value = parseCalendarDate(date);
        if (value) {
            focusedDate.value = clamp(calendarDateSerial(value));
            void nextTick(() => scrollToDate(focusedDate.value));
        }
    },
    SetYearDecadeDisplayDimensions(columnCount: number, rowCount: number) {
        columns.value = Math.max(1, Math.min(16, Math.trunc(columnCount)));
        rows.value = Math.max(1, Math.min(16, Math.trunc(rowCount)));
        void nextTick(() => scrollToDate(displayDate.value));
    },
    Focus: () => focusDate(localSelected.value[0] ?? calendarDateFromSerial(focusedDate.value)),
    FocusFirst: () => focusDate(localSelected.value[0] ?? calendarDateFromSerial(clamp(today))),
    FocusDate: (date: Date | number) => focusDate(date)
};
const normalizeDates = (v: unknown): Date[] => Array.isArray(v) ? v.map(parseCalendarDate).filter((date): date is Date => date !== null) : [];
const changeSelection = (dates: Date[]) => {
    const next = normalizeDates(dates).filter(date => { const serial = calendarDateSerial(date); return serial >= minimum.value && serial <= maximum.value && !dayStates.get(serial)?.IsBlackout; });
    const unique = [...new Map(next.map(date => [calendarDateSerial(date), date])).values()];
    const normalized = selectionMode.value === 'None' ? [] : selectionMode.value === 'Single' ? unique.slice(0, 1) : unique;
    const old = localSelected.value;
    const oldKeys = new Set(old.map(calendarDateSerial));
    const newKeys = new Set(normalized.map(calendarDateSerial));
    const AddedDates = normalized.filter(date => !oldKeys.has(calendarDateSerial(date)));
    const RemovedDates = old.filter(date => !newKeys.has(calendarDateSerial(date)));
    localSelected.value = normalized;
    if (!AddedDates.length && !RemovedDates.length)
        return;
    updateXamlBinding(props.SelectedDates, normalized, instance);
    emit('update:SelectedDates', normalized);
    const args = { AddedDates, RemovedDates };
    resolveXamlHandler(props.SelectedDatesChanged, instance)?.(sender, args);
    emit('SelectedDatesChanged', sender, args);
};
const selectedCollection = new Proxy([] as Date[], { get(_target, key) { const dates = localSelected.value; if (key === 'Clear')
        return () => changeSelection([]); if (key === 'Add' || key === 'Append')
        return (date: Date) => changeSelection([...dates, date]); if (key === 'Remove')
        return (date: Date) => changeSelection(dates.filter(item => calendarDateSerial(item) !== calendarDateSerial(date))); if (key === 'RemoveAt')
        return (index: number) => changeSelection(dates.filter((_, i) => i !== index)); if (key === 'GetAt')
        return (index: number) => dates[index]; if (key === 'Size' || key === 'Count')
        return dates.length; if (['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].includes(String(key)))
        return (...args: any[]) => { const copy = [...dates]; const result = (Array.prototype as any)[key].apply(copy, args); changeSelection(copy); return result; }; const value = (dates as any)[key]; return typeof value === 'function' ? value.bind(dates) : value; }, set(_target, key, v) { const copy = [...localSelected.value]; (copy as any)[key] = v; changeSelection(copy); return true; } });
const selectDay = (serial: number) => { if (!enabled.value || serial < minimum.value || serial > maximum.value || getDayState(serial).IsBlackout || selectionMode.value === 'None')
    return; focusedDate.value = serial; changeSelection(selectedSerials.value.has(serial) ? localSelected.value.filter(date => calendarDateSerial(date) !== serial) : selectionMode.value === 'Single' ? [calendarDateFromSerial(serial)] : [...localSelected.value, calendarDateFromSerial(serial)]); };
const navigationTarget = (direction: number) => { if (currentMode.value === 'Month')
    return model.value.months[scopeMonth.value.index + direction]?.start; if (currentMode.value === 'Year')
    return model.value.years[scopeYear.value.index + direction]?.start; const desired = decade.value + direction * 10; return (direction > 0 ? model.value.years.find(year => model.value.displayYear(year) >= desired) : [...model.value.years].reverse().find(year => model.value.displayYear(year) <= desired))?.start; };
const onClick = (event: Event) => { const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button'); if (!button || !root.value?.contains(button) || button.disabled || !enabled.value)
    return; const cmd = button.dataset.cmd; if (cmd === 'header') {
    void setMode(currentMode.value === 'Month' ? 'Year' : 'Decade');
    return;
} if (cmd === 'previous' || cmd === 'next') {
    const target = navigationTarget(cmd === 'previous' ? -1 : 1);
    if (target !== undefined) {
        focusedDate.value = clamp(target);
        scrollToDate(target, currentMode.value, true);
    }
    return;
} const serial = Number(button.dataset.date); if (!Number.isFinite(serial))
    return; if (button.dataset.kind === 'day')
    selectDay(serial);
else
    void setMode(button.dataset.kind === 'month' ? 'Month' : 'Year', serial, true, true); };
const focusDate = async (date: Date | number = focusedDate.value) => { focusedDate.value = clamp(date instanceof Date ? calendarDateSerial(date) : date); scrollToDate(focusedDate.value, currentMode.value, false, true); await nextTick(); const serial = currentMode.value === 'Month' ? focusedDate.value : currentMode.value === 'Year' ? model.value.monthAt(focusedDate.value).start : model.value.yearAt(focusedDate.value).start; root.value?.querySelector<HTMLButtonElement>(`[data-panel="${currentMode.value}"] [data-date="${serial}"]`)?.focus({ preventScroll: true }); return !!root.value?.contains(document.activeElement); };
const onFocus = (event: FocusEvent) => { const button = event.target as HTMLElement; if (button.dataset.date)
    focusedDate.value = clamp(Number(button.dataset.date)); };
const onKeydown = (event: KeyboardEvent) => {
    if (!enabled.value || !(event.target as HTMLElement).dataset.date)
        return;
    const key = event.key;
    const cols = currentMode.value === 'Month' ? 7 : columns.value;
    let offset = key === 'ArrowLeft' ? -1 : key === 'ArrowRight' ? 1 : key === 'ArrowUp' ? -cols : key === 'ArrowDown' ? cols : 0;
    if (getComputedStyle(root.value!).direction === 'rtl' && (key === 'ArrowLeft' || key === 'ArrowRight'))
        offset *= -1;
    let target = focusedDate.value;
    if (key === 'Enter' || key === ' ')
        return;
    if (key === 'Escape' && currentMode.value !== 'Month') {
        event.preventDefault();
        void setMode(currentMode.value === 'Decade' ? 'Year' : 'Month', target, true, true);
        return;
    }
    if (event.ctrlKey && key === 'ArrowUp' && currentMode.value !== 'Decade') {
        event.preventDefault();
        void setMode(currentMode.value === 'Month' ? 'Year' : 'Decade', target, true, true);
        return;
    }
    if (event.ctrlKey && key === 'ArrowDown' && currentMode.value !== 'Month') {
        event.preventDefault();
        void setMode(currentMode.value === 'Decade' ? 'Year' : 'Month', target, true, true);
        return;
    }
    if (key === 'PageUp' || key === 'PageDown') {
        const direction = key === 'PageUp' ? -1 : 1;
        const month = model.value.monthAt(target);
        if (currentMode.value === 'Month') {
            const next = model.value.months[month.index + direction * (event.ctrlKey ? 12 : 1)];
            if (next)
                target = Math.min(next.end, next.start + target - month.start);
        }
        else
            target = navigationTarget(direction) ?? target;
    }
    else if (key === 'Home' || key === 'End') {
        if (event.ctrlKey)
            target = key === 'Home' ? minimum.value : maximum.value;
        else if (currentMode.value === 'Month')
            target = key === 'Home' ? model.value.monthAt(target).start : model.value.monthAt(target).end;
        else if (currentMode.value === 'Year')
            target = key === 'Home' ? model.value.yearAt(target).start : model.value.yearAt(target).end;
        else {
            const years = model.value.years.filter(year => model.value.displayYear(year) >= decade.value && model.value.displayYear(year) <= decade.value + 9);
            target = (key === 'Home' ? years[0] : years[years.length - 1])?.start ?? target;
        }
    }
    else if (offset) {
        if (currentMode.value === 'Month')
            target += offset;
        else if (currentMode.value === 'Year')
            target = model.value.months[model.value.monthAt(target).index + offset]?.start ?? target;
        else
            target = model.value.years[model.value.yearAt(target).index + offset]?.start ?? target;
    }
    else
        return;
    event.preventDefault();
    void focusDate(clamp(target));
};
const prepared = new Set<number>();
let dayItemsActive = true;
const changingArgs = (serial: number, phase: number, recycle = false) => ({
    Item: getDayState(serial), Phase: phase, InRecycleQueue: recycle,
    RegisterUpdateCallback(phaseOrCallback: number | Function, registeredCallback?: Function) {
        const nextPhase = typeof phaseOrCallback === 'number' ? phaseOrCallback : phase + 1;
        const callback = typeof phaseOrCallback === 'function' ? phaseOrCallback : registeredCallback;
        if (!callback || recycle)
            return;
        queueMicrotask(() => { if (dayItemsActive && prepared.has(serial))
            callback(sender, changingArgs(serial, nextPhase)); });
    }
});
const notifyChanging = (serial: number, recycle = false) => {
    const args = changingArgs(serial, 0, recycle);
    resolveXamlHandler(props.CalendarViewDayItemChanging, instance)?.(sender, args);
    emit('CalendarViewDayItemChanging', sender, args);
};
watch(dayCells, cells => {
    const rendered = new Set(cells.map(cell => cell.serial));
    for (const serial of prepared)
        if (!rendered.has(serial)) {
            notifyChanging(serial, true);
            prepared.delete(serial);
        }
    for (const cell of cells) {
        if (prepared.has(cell.serial) || cell.serial < minimum.value || cell.serial > maximum.value)
            continue;
        prepared.add(cell.serial);
        notifyChanging(cell.serial);
    }
}, { flush: 'post', immediate: true });
watch(() => localSelected.value.some(date => dayStates.get(calendarDateSerial(date))?.IsBlackout), blackout => { if (blackout)
    changeSelection(localSelected.value); });
watch(() => resolve(props.SelectedDates), v => changeSelection(normalizeDates(v)), { immediate: true, deep: true });
watch(selectionMode, () => changeSelection(localSelected.value));
watch(() => text(props.DisplayMode, 'Month'), mode => { void setMode(mode as Mode, displayDate.value, false); }, { immediate: true });
watch(enabled, () => setPanelVisibility(currentMode.value));
watch(() => resolve(props.Language), () => { langOverride.value = undefined; });
watch(() => resolve(props.CalendarIdentifier), () => { idOverride.value = undefined; });
watch(() => resolve(props.SelectionMode), () => { modeOverride.value = undefined; });
watch([model, firstDay, weeks], async () => { prepared.clear(); changeSelection(localSelected.value); displayDate.value = clamp(anchorDate.value); focusedDate.value = clamp(focusedDate.value); await nextTick(); measure(); scrollToDate(anchorDate.value, currentMode.value, false, false, true); });
let observer: ResizeObserver | undefined;
const measure = () => { const element = viewport('Month'); if (element?.clientHeight)
    rowHeight.value = Math.max(42, (element.clientHeight - 4) / weeks.value); if (views.value?.clientHeight)
    viewHeight.value = views.value.clientHeight - 4; };
onMounted(async () => { root.value?.addEventListener('click', onClick); root.value?.addEventListener('keydown', onKeydown); root.value?.addEventListener('focusin', onFocus); root.value?.addEventListener('scroll', onScroll, true); root.value?.addEventListener('wheel', onUserScroll, { capture: true, passive: true }); root.value?.addEventListener('touchstart', onUserScroll, { capture: true, passive: true }); observer = new ResizeObserver(measure); if (views.value)
    observer.observe(views.value); await nextTick(); measure(); setPanelVisibility(currentMode.value); scrollToDate(displayDate.value); });
onBeforeUnmount(() => { dayItemsActive = false; stopAnimations(); observer?.disconnect(); root.value?.removeEventListener('click', onClick); root.value?.removeEventListener('keydown', onKeydown); root.value?.removeEventListener('focusin', onFocus); root.value?.removeEventListener('scroll', onScroll, true); root.value?.removeEventListener('wheel', onUserScroll, true); root.value?.removeEventListener('touchstart', onUserScroll, true); });
defineExpose(sender);
</script>

<style scoped>
.win-calendar-view { position: relative; display: grid; grid-template-rows: auto 1px minmax(0, 1fr); flex: 0 0 auto; box-sizing: border-box; border-style: solid; border-color: var(--CalendarViewBorderBrush, var(--ctrl-border-rest)); background: var(--CalendarViewBackground, var(--ctrl-input-active)); color: var(--CalendarViewForeground, var(--text-primary)); font-family: var(--font-family, 'Segoe UI', sans-serif); user-select: none; overflow: hidden; isolation: isolate; }
.calendar-header { display: grid; grid-template-columns: 5fr 1fr 1fr; min-width: 0; }
.calendar-header button { box-sizing: border-box; min-width: 0; border: 0; background: var(--CalendarViewNavigationButtonBackground, transparent); border-radius: var(--ControlCornerRadius, 4px); outline: none; cursor: default; }
.calendar-header-button { margin: 6px 3px 7px 7px; padding: 7px 8px 8px; color: var(--CalendarViewHeaderNavigationButtonForeground, var(--text-primary)); font: 600 14px/20px var(--font-family, 'Segoe UI', sans-serif); text-align: left; white-space: nowrap; overflow: hidden; }
.calendar-header-button span { display: block; overflow: hidden; text-overflow: ellipsis; }
.calendar-nav-button { margin: 6px 3px 7px; padding: 11.5px 12px; font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif; font-size: 8px; line-height: 12px; color: var(--CalendarViewNavigationButtonForeground, var(--text-secondary)); }
.calendar-nav-button:last-child { margin-right: 7px; }
.calendar-header button:hover:enabled { background: var(--CalendarViewNavigationButtonBackgroundPointerOver, var(--subtle-fill-secondary)); }
.calendar-header button:active:enabled { background: var(--CalendarViewNavigationButtonBackgroundPressed, var(--subtle-fill-tertiary)); }
.calendar-header-button:hover:enabled { color: var(--CalendarViewHeaderNavigationButtonForegroundPointerOver, var(--text-primary)); }
.calendar-header-button:active:enabled { color: var(--CalendarViewHeaderNavigationButtonForegroundPressed, var(--text-secondary)); }
.calendar-header-button:disabled { color: var(--CalendarViewHeaderNavigationButtonForegroundDisabled, var(--text-disabled)); }
.calendar-nav-button:hover:enabled { color: var(--CalendarViewNavigationButtonForegroundPointerOver, var(--text-secondary)); }
.calendar-nav-button:active:enabled { color: var(--CalendarViewNavigationButtonForegroundPressed, var(--text-secondary)); }
.calendar-nav-button:disabled { color: var(--CalendarViewNavigationButtonForegroundDisabled, var(--text-disabled)); }
.calendar-header button:focus-visible { outline: 2px solid var(--CalendarViewFocusVisualPrimaryBrush, var(--text-primary)); outline-offset: 2px; }
.calendar-separator { height: 1px; background: var(--CalendarViewBorderBrush, var(--ctrl-border-rest)); }
.calendar-views { position: relative; height: calc(var(--calendar-weeks) * 42px + 48px); min-height: 0; overflow: hidden; }
.has-explicit-height .calendar-views { height: auto; }
.calendar-background-layer { position: absolute; inset: 0; background: var(--CalendarViewBorderBrush, var(--ctrl-border-rest)); pointer-events: none; }
.calendar-view-panel { position: absolute; inset: 0; transform-origin: center; min-width: 0; min-height: 0; background: var(--CalendarViewBackground, var(--ctrl-input-active)); }
.calendar-view-panel[data-panel="Month"] { display: grid; grid-template-rows: 44px minmax(0, 1fr); }
.calendar-weekday-names { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); margin: 2px 2px 0; background: var(--CalendarViewBackground, var(--ctrl-input-active)); }
.calendar-weekday-names span { min-width: 0; margin: 1px; padding: 12px; display: grid; place-content: center; font-size: 12px; font-weight: 600; line-height: 16px; text-align: center; white-space: nowrap; color: var(--CalendarViewCalendarItemForeground, var(--text-primary)); }
.is-disabled .calendar-weekday-names span { color: var(--CalendarViewWeekDayForegroundDisabled, var(--text-disabled)); }
.calendar-scroll { width: 100%; height: 100%; min-width: 0; min-height: 0; }
.calendar-scroll :deep(.win-scroll-viewer-viewport) { scroll-snap-type: y proximity; overscroll-behavior: contain; }
.calendar-scroll :deep(.scroll-content) { width: 100%; min-width: 0; }
.calendar-extent { position: relative; width: 100%; }
.calendar-day-grid, .calendar-large-grid { position: absolute; left: 2px; right: 2px; display: grid; }
.calendar-day-grid { grid-template-columns: repeat(7, minmax(0, 1fr)); }
.calendar-slot { box-sizing: border-box; display: grid; min-width: 0; min-height: 0; padding: 1px; scroll-snap-align: start; }
.calendar-item { position: relative; box-sizing: border-box; width: 100%; height: 100%; min-width: 0; min-height: 0; display: grid; place-content: center; padding: 0 0 4px; border: 0; border-radius: var(--calendar-item-radius, 999px); background: var(--CalendarViewCalendarItemBackground, transparent); color: var(--CalendarViewCalendarItemForeground, var(--text-primary)); outline: none; cursor: default; overflow: hidden; }
.calendar-item::before { content: ''; position: absolute; inset: 0; border-radius: inherit; border: var(--calendar-item-border-thickness) solid var(--CalendarViewCalendarItemBorderBrush, transparent); box-sizing: border-box; pointer-events: none; }
.calendar-day-item { font-weight: var(--calendar-DayItem-weight); font-size: var(--calendar-DayItem-size); line-height: 20px; font-family: var(--calendar-DayItem-family); }
.calendar-day-item .calendar-text { margin: var(--calendar-DayItem-margin); }
.calendar-large-item { font-weight: var(--calendar-MonthYearItem-weight); font-size: var(--calendar-MonthYearItem-size); line-height: 20px; font-family: var(--calendar-MonthYearItem-family); padding: 0; }
.calendar-large-item .calendar-text { margin: var(--calendar-MonthYearItem-margin); }
.calendar-text { z-index: 1; max-width: 100%; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
.calendar-label { position: absolute; left: 2px; right: 2px; top: 0; line-height: 10px; text-align: center; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; color: inherit; pointer-events: none; }
.month-label { margin: var(--calendar-FirstOfMonthLabel-margin); font-weight: var(--calendar-FirstOfMonthLabel-weight); font-size: var(--calendar-FirstOfMonthLabel-size); line-height: 10px; font-family: var(--calendar-FirstOfMonthLabel-family); }
.year-label { margin: var(--calendar-FirstOfYearDecadeLabel-margin); font-weight: var(--calendar-FirstOfYearDecadeLabel-weight); font-size: var(--calendar-FirstOfYearDecadeLabel-size); line-height: 10px; font-family: var(--calendar-FirstOfYearDecadeLabel-family); }
.calendar-item.out-of-scope { background: var(--CalendarViewOutOfScopeBackground, transparent); color: var(--CalendarViewOutOfScopeForeground, var(--text-secondary)); }
.calendar-item:hover:enabled { background: var(--CalendarViewCalendarItemHoverBackground, var(--subtle-fill-secondary)); }
.calendar-item:hover:enabled::before { border-color: var(--CalendarViewHoverBorderBrush, var(--subtle-fill-secondary)); }
.calendar-item:active:enabled { background: var(--CalendarViewCalendarItemPressedBackground, var(--subtle-fill-tertiary)); color: var(--CalendarViewPressedForeground, var(--text-secondary)); }
.calendar-item:active:enabled::before { border-color: var(--CalendarViewPressedBorderBrush, var(--subtle-fill-tertiary)); }
.calendar-item.out-of-scope:hover:enabled { color: var(--CalendarViewOutOfScopeHoverForeground, var(--text-primary)); }
.calendar-item.out-of-scope:active:enabled { color: var(--CalendarViewOutOfScopePressedForeground, var(--text-tertiary)); }
.calendar-item.is-selected { color: var(--CalendarViewSelectedForeground, var(--accent-text)); }
.calendar-item.is-selected::before { border-color: var(--CalendarViewSelectedBorderBrush, var(--accent-default)); }
.calendar-item.is-selected:hover:enabled { color: var(--CalendarViewSelectedHoverForeground, var(--accent-text)); }
.calendar-item.is-selected:hover:enabled::before { border-color: var(--CalendarViewSelectedHoverBorderBrush, var(--accent-secondary)); }
.calendar-item.is-selected:active:enabled { color: var(--CalendarViewSelectedPressedForeground, var(--accent-text)); }
.calendar-item.is-selected:active:enabled::before { border-color: var(--CalendarViewSelectedPressedBorderBrush, var(--subtle-fill-tertiary)); }
.calendar-item.is-blackout { color: var(--CalendarViewBlackoutForeground, var(--text-primary)); background: var(--CalendarViewBlackoutBackground, transparent); }
.calendar-item.is-blackout .calendar-text::after { content: ''; position: absolute; width: calc(var(--calendar-DayItem-size) * 1.76777); height: 1px; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); background: var(--CalendarViewBlackoutStrikethroughBrush, var(--text-secondary)); }
.calendar-item.is-blackout::before { border-color: var(--CalendarViewCalendarItemBorderBrush, transparent); }
.calendar-item.is-today { background: var(--CalendarViewTodayBackground, var(--accent-default)); color: var(--CalendarViewTodayForeground, white); font-weight: var(--calendar-today-font-weight); }
.calendar-item.is-today::before { border-color: transparent; }
.calendar-item.is-today:hover:enabled { background: var(--CalendarViewTodayHoverBackground, var(--accent-secondary)); color: var(--CalendarViewTodayForeground, white); }
.calendar-item.is-today:hover:enabled::before, .calendar-item.is-today:active:enabled::before { border-color: transparent; }
.calendar-item.is-today:active:enabled { background: var(--CalendarViewTodayPressedBackground, var(--accent-tertiary)); color: var(--CalendarViewTodayForeground, white); }
.calendar-item.is-today.is-blackout { background: var(--CalendarViewTodayBlackoutBackground, var(--accent-tertiary)); color: var(--CalendarViewTodayBlackoutForeground, white); }
.calendar-item.is-today.is-selected::after { content: ''; position: absolute; inset: var(--calendar-item-border-thickness); border: 1px solid var(--CalendarViewTodaySelectedInnerBorderBrush, white); border-radius: inherit; pointer-events: none; }
.calendar-item:disabled { color: var(--CalendarViewDisabledForeground, var(--text-disabled)); background: var(--CalendarViewCalendarItemDisabledBackground, transparent); }
.calendar-item.is-selected:disabled { color: var(--CalendarViewSelectedDisabledForeground, var(--text-disabled)); }
.calendar-item.is-selected:disabled::before { border-color: var(--CalendarViewSelectedDisabledBorderBrush, var(--text-disabled)); }
.calendar-item.is-today:disabled { color: var(--CalendarViewTodayForeground, white); background: var(--CalendarViewTodayDisabledBackground, var(--accent-disabled)); }
.calendar-item.is-today:disabled::before { border-color: var(--CalendarViewSelectedDisabledBorderBrush, var(--accent-disabled)); }
.calendar-item.is-blackout:disabled .calendar-text::after { background: var(--CalendarViewDisabledForeground, var(--text-disabled)); }
.calendar-item.is-today.is-blackout .calendar-text::after { background: var(--CalendarViewTodayForeground, white); }
.calendar-item:focus-visible { outline: 2px solid var(--CalendarViewFocusVisualPrimaryBrush, var(--text-primary)); outline-offset: -2px; box-shadow: inset 0 0 0 3px var(--CalendarViewFocusVisualSecondaryBrush, white); }
.calendar-density { position: absolute; inset: auto 0 0; display: flex; flex-direction: column-reverse; gap: 1px; opacity: .35; pointer-events: none; }
.calendar-density span { display: block; height: 3px; }
.out-of-scope .calendar-density { opacity: .1; }
@media (forced-colors: active) { .calendar-item, .calendar-item::before, .calendar-item::after { forced-color-adjust: none; } }
</style>
