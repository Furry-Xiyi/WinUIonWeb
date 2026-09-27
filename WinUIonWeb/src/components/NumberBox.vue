<template>
  <div ref="rootRef" class="win-number-box" :class="{ 'is-disabled': !resolvedIsEnabled, 'is-inline': resolvedSpinButtonPlacementMode === 'Inline', 'is-compact': resolvedSpinButtonPlacementMode === 'Compact' }" :style="rootStyle" @keyup="onKeyup" @wheel="onWheel">
    <div class="win-number-shell">
      <TextBox
        class="win-number-textbox"
        Text="{x:Bind NumberBoxTemplate.Text, Mode=OneWay}"
        Header="{x:Bind NumberBoxTemplate.Header, Mode=OneWay}"
        HeaderTemplate="{x:Bind NumberBoxTemplate.HeaderTemplate, Mode=OneWay}"
        Description="{x:Bind NumberBoxTemplate.Description, Mode=OneWay}"
        PlaceholderText="{x:Bind NumberBoxTemplate.PlaceholderText, Mode=OneWay}"
        IsEnabled="{x:Bind NumberBoxTemplate.IsEnabled, Mode=OneWay}"
        InputScope="{x:Bind NumberBoxTemplate.InputScope, Mode=OneWay}"
        TextAlignment="{x:Bind NumberBoxTemplate.TextAlignment, Mode=OneWay}"
        SelectionHighlightColor="{x:Bind NumberBoxTemplate.SelectionHighlightColor, Mode=OneWay}"
        PreventKeyboardDisplayOnProgrammaticFocus="{x:Bind NumberBoxTemplate.PreventKeyboardDisplayOnProgrammaticFocus, Mode=OneWay}"
        TextChanged="OnNumberBoxTextChanged"
        GotFocus="OnNumberBoxGotFocus"
        LostFocus="OnNumberBoxLostFocus" />
    </div>

    <Teleport to="body">
      <div
        v-if="compactPopupOpen"
        class="win-number-compact-popup win-theme-scope"
        :class="compactPopupThemeClass"
        :style="[compactPopupStyle, compactPopupBackgroundStyle]"
        v-acrylic-brush="compactPopupBackgroundStyle"
        v-theme-shadow="{ Translation: compactPopupShadowDepth }"
        @pointerdown.prevent>
        <RepeatButton class="win-number-popup-button" Content="&#xE70E;" Padding="0" IsEnabled="{x:Bind NumberBoxTemplate.CanIncrease, Mode=OneWay}" IsTabStop="False" AutomationProperties.Name="{x:Bind NumberBoxTemplate.IncreaseLabel, Mode=OneWay}" Click="OnNumberBoxSpinUp" />
        <RepeatButton class="win-number-popup-button" Content="&#xE70D;" Padding="0" IsEnabled="{x:Bind NumberBoxTemplate.CanDecrease, Mode=OneWay}" IsTabStop="False" AutomationProperties.Name="{x:Bind NumberBoxTemplate.DecreaseLabel, Mode=OneWay}" Click="OnNumberBoxSpinDown" />
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export const NumberBoxHeaderTemplate = defineComponent({ name: 'NumberBox.HeaderTemplate', __numberBoxProperty: 'HeaderTemplate', setup: () => () => null });
export default { HeaderTemplate: NumberBoxHeaderTemplate };
</script>

<script setup lang="ts">
import { computed, Fragment, getCurrentInstance, h, inject, nextTick, onBeforeUnmount, onMounted, provide, proxyRefs, ref, useAttrs, useSlots, watch, watchPostEffect } from 'vue';
import type { ComputedRef, CSSProperties, VNode } from 'vue';
import TextBox from './TextBox.vue';
import RepeatButton from './RepeatButton.vue';
import { resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime';
import { textInputTemplateKey } from './textInputTemplate';
import { useI18n } from './i18n/index';
import { useAcrylicBrushStyle } from './AcrylicBrush';
import { vAcrylicBrush } from './acrylicBrushVisual';
import { vThemeShadow } from './themeShadowVisual';
import { getVNodeChildren } from './CollectionProperties';
import { xamlResourceDictionaryKey } from './Page.vue';

type SpinPlacement = 'Hidden' | 'Compact' | 'Inline';
type ValidationMode = 'InvalidInputOverwritten' | 'Disabled';
type TextAlignment = 'Left' | 'Center' | 'Right' | 'Justify';
type NumberFormatter = Intl.NumberFormat | { format?: (value: number) => string; FormatDouble?: (value: number) => string; ParseDouble?: (text: string) => number | null };

defineOptions({ inheritAttrs: false });
const { t } = useI18n();

const props = withDefaults(defineProps<{
  Value?: number | string;
  Text?: string;
  Minimum?: number | string;
  Maximum?: number | string;
  SmallChange?: number | string;
  LargeChange?: number | string;
  Header?: unknown;
  HeaderTemplate?: unknown | null;
  Description?: string;
  PlaceholderText?: string;
  InputScope?: string;
  SelectionFlyout?: unknown | null;
  SelectionHighlightColor?: string;
  TextReadingOrder?: string;
  PreventKeyboardDisplayOnProgrammaticFocus?: boolean | string;
  NumberFormatter?: NumberFormatter | string | null;
  SpinButtonPlacementMode?: SpinPlacement | string;
  ValidationMode?: ValidationMode | string;
  IsWrapEnabled?: boolean | string;
  AcceptsExpression?: boolean | string;
  IsEnabled?: boolean | string;
  TextAlignment?: TextAlignment | string;
  MinWidth?: number | string;
  MinHeight?: number | string;
  MaxWidth?: number | string;
  MaxHeight?: number | string;
  VerticalAlignment?: string;
  HorizontalAlignment?: string;
  Width?: number | string;
  Margin?: number | string;
}>(), {
  Value: Number.NaN,
  Text: '',
  Minimum: Number.NEGATIVE_INFINITY,
  Maximum: Number.POSITIVE_INFINITY,
  SmallChange: 1,
  LargeChange: 10,
  Header: '',
  HeaderTemplate: undefined,
  Description: '',
  PlaceholderText: '',
  InputScope: 'Decimal',
  SelectionFlyout: undefined,
  SelectionHighlightColor: '',
  TextReadingOrder: 'Default',
  PreventKeyboardDisplayOnProgrammaticFocus: false,
  NumberFormatter: null,
  SpinButtonPlacementMode: 'Hidden',
  ValidationMode: 'InvalidInputOverwritten',
  IsWrapEnabled: false,
  AcceptsExpression: false,
  IsEnabled: true,
  TextAlignment: 'Left',
  MinWidth: 64,
  MinHeight: '',
  MaxWidth: '',
  MaxHeight: '',
  VerticalAlignment: 'Stretch',
  HorizontalAlignment: 'Stretch',
  Width: '',
  Margin: ''
});

const emit = defineEmits<{
  'update:Value': [value: number];
  'update:Text': [value: string];
  ValueChanged: [args: { OldValue: number; NewValue: number }];
}>();

const rootRef = ref<HTMLElement | null>(null);
const isFocused = ref(false);
const compactPopupStyle = ref<CSSProperties>({});
const inheritedTheme = inject<ComputedRef<'light' | 'dark'> | null>('winuiTheme', null);
const anchorTheme = ref<'light' | 'dark' | ''>('');
const attrs = useAttrs();
const instance = getCurrentInstance();
const slots = useSlots();
const resources = inject(xamlResourceDictionaryKey, {});
const desiredInputWidth = ref(64);
const headerTemplateNodes = computed(() => {
  const visit = (nodes: VNode[]): VNode[] => nodes.flatMap(node => {
    if (node.type === Fragment) return visit(getVNodeChildren(node));
    const type = node.type as { __numberBoxProperty?: string } | string;
    return typeof type === 'string' ? type === 'NumberBox.HeaderTemplate' ? getVNodeChildren(node) : []
      : type?.__numberBoxProperty === 'HeaderTemplate' ? getVNodeChildren(node) : [];
  });
  return visit(slots.default?.() ?? []);
});
const resolvedHeaderTemplate = computed(() => {
  if (headerTemplateNodes.value.length) return h(Fragment, headerTemplateNodes.value);
  const key = typeof props.HeaderTemplate === 'string' ? props.HeaderTemplate.match(/^\{(?:StaticResource|ThemeResource)\s+([^}]+)\}$/)?.[1] : undefined;
  return key && resources[key] ? resources[key] : resolveXamlValue(props.HeaderTemplate, instance);
});
const localHeaderTemplate = ref<unknown>();
const compactPopupBackgroundStyle = useAcrylicBrushStyle('{ThemeResource NumberBoxPopupBackground}', instance);
// NumberBox::OnApplyTemplate assigns ThemeShadow to PopupContentRoot, with
// its Z translation coming from the application resource (official default 16).
const compactPopupShadowDepth = computed(() => {
  const depth = Number(resolveXamlValue('{ThemeResource NumberBoxPopupShadowDepth}', instance));
  return Number.isFinite(depth) ? depth : 16;
});
// Automation names belong to the editable field in the NumberBox template.
// ElementName bindings stay live until the label's named control mounts.
watchPostEffect(() => {
  const field = rootRef.value?.querySelector('input, textarea');
  if (!field) return;
  const getAttr = (name: string) => attrs[name] ?? attrs[name.toLowerCase()] ?? attrs[name.replaceAll('.', '').toLowerCase()];
  const name = resolveXamlValue(getAttr('AutomationProperties.Name'), instance);
  if (name) field.setAttribute('aria-label', String(name));
  else field.removeAttribute('aria-label');
  const target = resolveXamlValue(getAttr('AutomationProperties.LabeledBy'), instance) as { Element?: HTMLElement; $el?: HTMLElement } | HTMLElement | undefined;
  const label = target instanceof HTMLElement ? target : target?.Element ?? target?.$el;
  if (label instanceof HTMLElement) {
    if (!label.id) label.id = `numberbox-label-${instance?.uid ?? 0}`;
    field.setAttribute('aria-labelledby', label.id);
  } else field.removeAttribute('aria-labelledby');
});

const resolveNumber = (value: unknown, fallback: number) => {
  const resolved = resolveXamlValue(value, instance);
  if (resolved === undefined || resolved === null || (typeof resolved === 'string' && resolved.trim() === '')) return fallback;
  const numeric = typeof resolved === 'number' ? resolved : Number(resolved);
  return Number.isNaN(numeric) ? fallback : numeric;
};

const resolveBoolean = (value: unknown, fallback: boolean) => {
  const resolved = resolveXamlValue(value, instance);
  if (typeof resolved === 'boolean') return resolved;
  if (typeof resolved === 'string') {
    if (resolved.trim().toLowerCase() === 'true') return true;
    if (resolved.trim().toLowerCase() === 'false') return false;
  }
  return fallback;
};

const dependency = <T,>(source: () => T, binding: () => unknown) => {
  const initial = computed(source);
  const local = ref<T>();
  watch(initial, () => { local.value = undefined; });
  return computed({
    get: () => (local.value ?? initial.value) as T,
    set: (value: T) => { local.value = value; updateXamlBinding(binding(), value, instance); }
  });
};

const sourceValue = computed(() => resolveNumber(props.Value, Number.NaN));
const localValue = ref(sourceValue.value);
const resolvedValue = computed(() => localValue.value);
watch(sourceValue, (value) => { localValue.value = value; });
const resolvedMinimum = dependency(() => resolveNumber(props.Minimum, Number.NEGATIVE_INFINITY), () => props.Minimum);
const resolvedMaximum = dependency(() => resolveNumber(props.Maximum, Number.POSITIVE_INFINITY), () => props.Maximum);
const resolvedSmallChange = dependency(() => resolveNumber(props.SmallChange, 1), () => props.SmallChange);
const resolvedLargeChange = dependency(() => resolveNumber(props.LargeChange, 10), () => props.LargeChange);
const resolvedText = computed(() => {
  const value = resolveXamlValue(props.Text, instance);
  return value === undefined || value === null ? '' : String(value);
});
const resolvedHeader = dependency(() => resolveXamlValue(props.Header, instance), () => props.Header);
const resolvedDescription = computed(() => resolveXamlValue(props.Description, instance));
const resolvedPlaceholderText = computed(() => resolveXamlValue(props.PlaceholderText, instance));
const resolvedInputScope = computed(() => resolveXamlValue(props.InputScope, instance));
const resolvedValidationMode = dependency(() => String(resolveXamlValue(props.ValidationMode, instance) ?? 'InvalidInputOverwritten'), () => props.ValidationMode);
const resolvedIsWrapEnabled = dependency(() => resolveBoolean(props.IsWrapEnabled, false), () => props.IsWrapEnabled);
const resolvedAcceptsExpression = dependency(() => resolveBoolean(props.AcceptsExpression, false), () => props.AcceptsExpression);
const sourceIsEnabled = computed(() => resolveBoolean(props.IsEnabled, true));
const localIsEnabled = ref<boolean | undefined>(undefined);
const resolvedIsEnabled = computed(() => localIsEnabled.value ?? sourceIsEnabled.value);
watch(sourceIsEnabled, () => { localIsEnabled.value = undefined; });
const resolvedTextAlignment = computed(() => resolveXamlValue(props.TextAlignment, instance));
const sourceSpinButtonPlacementMode = computed<SpinPlacement>(() => {
  const value = String(resolveXamlValue(props.SpinButtonPlacementMode, instance) ?? 'Hidden');
  return value === 'Inline' || value === 'Compact' ? value : 'Hidden';
});
const localSpinButtonPlacementMode = ref<SpinPlacement>();
const resolvedSpinButtonPlacementMode = computed(() => localSpinButtonPlacementMode.value ?? sourceSpinButtonPlacementMode.value);
watch(sourceSpinButtonPlacementMode, () => { localSpinButtonPlacementMode.value = undefined; });
const resolvedSelectionHighlightColor = computed(() => resolveXamlValue(props.SelectionHighlightColor, instance));
const resolvedPreventKeyboardDisplayOnProgrammaticFocus = computed(() => resolveBoolean(props.PreventKeyboardDisplayOnProgrammaticFocus, false));
const sourceNumberFormatter = computed(() => resolveXamlValue(props.NumberFormatter, instance));
const localNumberFormatter = ref<NumberFormatter | null>();
const resolvedNumberFormatter = computed(() => localNumberFormatter.value ?? sourceNumberFormatter.value);
watch(sourceNumberFormatter, () => { localNumberFormatter.value = undefined; });
const resolvedWidth = computed(() => resolveXamlValue(props.Width, instance));
const resolvedMinWidth = computed(() => resolveXamlValue(props.MinWidth, instance));
const resolvedMinHeight = computed(() => resolveXamlValue(props.MinHeight, instance));
const resolvedMaxWidth = computed(() => resolveXamlValue(props.MaxWidth, instance));
const resolvedMaxHeight = computed(() => resolveXamlValue(props.MaxHeight, instance));
const resolvedVerticalAlignment = computed(() => resolveXamlValue(props.VerticalAlignment, instance));
const resolvedHorizontalAlignment = computed(() => resolveXamlValue(props.HorizontalAlignment, instance));
const resolvedMargin = computed(() => resolveXamlValue(props.Margin, instance));

const formatValue = (value: number) => {
  if (Number.isNaN(value)) return '';
  const formatter = resolvedNumberFormatter.value;
  if (formatter && typeof formatter === 'object' && 'FormatDouble' in formatter && typeof formatter.FormatDouble === 'function') {
    return formatter.FormatDouble(value);
  }
  if (formatter && typeof formatter === 'object' && 'format' in formatter && typeof formatter.format === 'function') {
    try {
      return formatter.format(value);
    } catch {
      // Fall back to the platform's default numeric representation.
    }
  }
  return String(value);
};

const text = ref(resolvedText.value || formatValue(resolvedValue.value));

const displayText = computed(() => text.value);
const compactPopupOpen = computed(() => resolvedSpinButtonPlacementMode.value === 'Compact' && resolvedIsEnabled.value && isFocused.value);
const compactPopupThemeClass = computed(() => {
  const theme = inheritedTheme?.value || anchorTheme.value;
  return theme === 'light' || theme === 'dark' ? `theme-${theme}` : '';
});
const alignmentStyle = (alignment: string, axis: 'vertical' | 'horizontal') => {
  const value = String(alignment || '').toLowerCase();
  if (axis === 'vertical') {
    const values: Record<string, string> = { center: 'center', top: 'flex-start', bottom: 'flex-end', stretch: 'stretch' };
    return values[value] || 'stretch';
  }
  const values: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end', stretch: 'stretch' };
  return values[value] || 'stretch';
};
const cssLength = (value: unknown) => {
  if (value === '' || value === undefined || value === null) return undefined;
  if (typeof value === 'number') return Number.isFinite(value) ? `${value}px` : undefined;
  const source = String(value).trim();
  if (!source) return undefined;
  return /^-?\d+(?:\.\d+)?$/.test(source) ? `${source}px` : source;
};
const xamlThickness = (value: unknown) => {
  if (value === '' || value === undefined || value === null) return undefined;
  const parts = String(value).split(',').map((part) => cssLength(part.trim()) ?? '0px');
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return String(value);
};
const rootStyle = computed<CSSProperties>(() => ({
  width: cssLength(resolvedWidth.value),
  minWidth: resolvedWidth.value === '' || resolvedWidth.value === undefined
    ? `min(${Math.max(desiredInputWidth.value, resolvedSpinButtonPlacementMode.value === 'Inline' ? 120 : 64, Number(resolvedMinWidth.value) || 0)}px, 100%)`
    : cssLength(resolvedSpinButtonPlacementMode.value === 'Inline' ? Math.max(120, Number(resolvedMinWidth.value) || 0) : resolvedMinWidth.value),
  minHeight: cssLength(resolvedMinHeight.value),
  maxWidth: cssLength(resolvedMaxWidth.value),
  maxHeight: cssLength(resolvedMaxHeight.value),
  margin: xamlThickness(resolvedMargin.value),
  alignSelf: resolvedVerticalAlignment.value === 'Stretch' ? undefined : alignmentStyle(String(resolvedVerticalAlignment.value ?? ''), 'vertical'),
  justifySelf: resolvedHorizontalAlignment.value === 'Stretch' ? undefined : alignmentStyle(String(resolvedHorizontalAlignment.value ?? ''), 'horizontal')
}));
const canIncrease = computed(() => resolvedIsEnabled.value && !Number.isNaN(resolvedValue.value) && (resolvedIsWrapEnabled.value || resolvedValidationMode.value === 'Disabled' || resolvedValue.value < resolvedMaximum.value));
const canDecrease = computed(() => resolvedIsEnabled.value && !Number.isNaN(resolvedValue.value) && (resolvedIsWrapEnabled.value || resolvedValidationMode.value === 'Disabled' || resolvedValue.value > resolvedMinimum.value));

const clamp = (value: number) => Math.min(resolvedMaximum.value, Math.max(resolvedMinimum.value, value));

const parseNumber = (source: string) => {
  const formatter = resolvedNumberFormatter.value;
  if (formatter && typeof formatter === 'object' && 'ParseDouble' in formatter && typeof formatter.ParseDouble === 'function') {
    const result = formatter.ParseDouble(source);
    return typeof result === 'number' && Number.isFinite(result) ? result : Number.NaN;
  }
  const normalized = source.replace(/,/g, '').trim();
  return /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(normalized) ? Number(normalized) : Number.NaN;
};

// Port the reference NumberBoxParser's token and postfix rules, including
// left-associative exponentiation and a minus sign on numeric tokens.
const evaluateExpression = (source: string) => {
  const output: (number | string)[] = [];
  const operators: string[] = [];
  const precedence = (operator: string) => operator === '^' ? 2 : operator === '*' || operator === '/' ? 1 : 0;
  let expectsNumber = true;
  for (let offset = 0; offset < source.length;) {
    const character = source[offset];
    if (character === ' ') { offset++; continue; }
    if (expectsNumber) {
      if (character === '(') { operators.push(character); offset++; continue; }
      const token = source.slice(offset).match(/^-?[^-+/*()^\s]+/)?.[0];
      if (!token) return Number.NaN;
      const number = parseNumber(token);
      if (Number.isNaN(number)) return number;
      output.push(number); offset += token.length; expectsNumber = false;
    } else if ('+-*/^'.includes(character)) {
      while (operators.length && operators.at(-1) !== '(' && precedence(operators.at(-1)!) >= precedence(character)) output.push(operators.pop()!);
      operators.push(character); offset++; expectsNumber = true;
    } else if (character === ')') {
      while (operators.length && operators.at(-1) !== '(') output.push(operators.pop()!);
      if (operators.pop() !== '(') return Number.NaN;
      offset++;
    } else return Number.NaN;
  }
  if (expectsNumber || operators.includes('(')) return Number.NaN;
  while (operators.length) output.push(operators.pop()!);
  const values: number[] = [];
  for (const token of output) {
    if (typeof token === 'number') { values.push(token); continue; }
    if (values.length < 2) return Number.NaN;
    const right = values.pop()!, left = values.pop()!;
    const result = token === '+' ? left + right : token === '-' ? left - right : token === '*' ? left * right : token === '/' ? left / right : left ** right;
    if (!Number.isFinite(result)) return Number.NaN;
    values.push(result);
  }
  return values.length === 1 ? values[0] : Number.NaN;
};

const parseText = (source: string) => resolvedAcceptsExpression.value ? evaluateExpression(source.trim()) : parseNumber(source);

const setValue = (value: number, oldValue = resolvedValue.value) => {
  const newValue = Number.isNaN(value) ? Number.NaN : resolvedValidationMode.value === 'Disabled' ? value : clamp(value);
  const previousValue = resolveNumber(oldValue, Number.NaN);
  localValue.value = newValue;
  text.value = formatValue(newValue);
  emit('update:Value', newValue);
  updateXamlBinding(props.Value, newValue, instance);
  emit('update:Text', text.value);
  updateXamlBinding(props.Text, text.value, instance);
  if (!Object.is(previousValue, newValue)) {
    const args = { OldValue: previousValue, NewValue: newValue };
    (emit as (name: string, ...values: unknown[]) => void)('ValueChanged', api, args);
    resolveXamlHandler(attrs.ValueChanged, instance)?.(api, args);
  }
  return newValue;
};

// Keep the official x:Name dependency-property surface available to page
// bindings and popup option controls.
const exposedValue = computed({
  get: () => resolvedValue.value,
  set: (value: number) => setValue(Number(value))
});
const exposedIsEnabled = computed({
  get: () => resolvedIsEnabled.value,
  set: (value: boolean) => {
    localIsEnabled.value = Boolean(value);
    updateXamlBinding(props.IsEnabled, Boolean(value), instance);
  }
});
const api = proxyRefs({
  Value: exposedValue,
  Text: computed({ get: () => text.value, set: (value: string) => { text.value = String(value); commitText(); } }),
  NumberFormatter: computed({ get: () => resolvedNumberFormatter.value, set: (value: NumberFormatter) => { localNumberFormatter.value = value; } }),
  Header: resolvedHeader,
  HeaderTemplate: computed({ get: () => localHeaderTemplate.value ?? resolvedHeaderTemplate.value, set: (value: unknown) => { localHeaderTemplate.value = value; updateXamlBinding(props.HeaderTemplate, value, instance); } }),
  SpinButtonPlacementMode: computed({ get: () => resolvedSpinButtonPlacementMode.value, set: (value: SpinPlacement) => { localSpinButtonPlacementMode.value = value; updateXamlBinding(props.SpinButtonPlacementMode, value, instance); } }),
  Minimum: resolvedMinimum, Maximum: resolvedMaximum, SmallChange: resolvedSmallChange, LargeChange: resolvedLargeChange,
  ValidationMode: resolvedValidationMode, IsWrapEnabled: resolvedIsWrapEnabled, AcceptsExpression: resolvedAcceptsExpression,
  IsEnabled: exposedIsEnabled, Element: rootRef,
  Focus: () => { rootRef.value?.querySelector<HTMLInputElement>('input')?.focus(); return true; }
});
defineExpose(api);

const onTextInput = (sender: { Text: string }) => {
  const value = sender.Text;
  if (value === text.value) return;
  text.value = value;
  emit('update:Text', value);
  updateXamlBinding(props.Text, value, instance);
};

const resolveAnchorTheme = () => {
  const themeScope = rootRef.value?.closest('.theme-light, .theme-dark');
  if (themeScope?.classList.contains('theme-dark')) return 'dark';
  if (themeScope?.classList.contains('theme-light')) return 'light';
  return '';
};

const updateCompactPopupPosition = async () => {
  if (!rootRef.value) return;
  anchorTheme.value = resolveAnchorTheme();
  const rect = (rootRef.value.querySelector('.win-textbox-border') as HTMLElement | null)?.getBoundingClientRect()
    ?? rootRef.value.getBoundingClientRect();
  const popupHeight = 90;
  compactPopupStyle.value = {
    left: `${Math.min(window.innerWidth - 50, Math.max(0, rect.right - 49))}px`,
    top: `${Math.max(0, Math.min(window.innerHeight - popupHeight, rect.top - 27))}px`
  };
  await nextTick();
};

const onFocus = () => {
  isFocused.value = true;
  void updateCompactPopupPosition();
};

const onLostFocus = () => {
  isFocused.value = false;
  commitText();
};

const commitText = () => {
  if (text.value.trim() === '') {
    return setValue(Number.NaN);
  }
  const parsed = parseText(text.value);
  if (Number.isNaN(parsed)) {
    if (resolvedValidationMode.value === 'InvalidInputOverwritten') text.value = formatValue(resolvedValue.value);
    return resolvedValue.value;
  }
  return setValue(parsed);
};

const changeBy = (delta: number) => {
  const committed = commitText();
  if (Number.isNaN(committed) || !resolvedIsEnabled.value) return;
  let value = committed + delta;
  if (resolvedIsWrapEnabled.value) {
    if (value > resolvedMaximum.value) value = resolvedMinimum.value;
    else if (value < resolvedMinimum.value) value = resolvedMaximum.value;
  }
  setValue(value, committed);
  void nextTick(() => {
    const input = rootRef.value?.querySelector<HTMLInputElement>('input');
    input?.setSelectionRange(input.value.length, input.value.length);
  });
};

const onKeydown = (event: KeyboardEvent) => {
  if (!resolvedIsEnabled.value || event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    changeBy(resolvedSmallChange.value);
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    changeBy(-resolvedSmallChange.value);
  }
  if (event.key === 'PageUp') {
    event.preventDefault();
    changeBy(resolvedLargeChange.value);
  }
  if (event.key === 'PageDown') {
    event.preventDefault();
    changeBy(-resolvedLargeChange.value);
  }
};

const onKeyup = (event: KeyboardEvent) => {
  if (!resolvedIsEnabled.value || event.isComposing) return;
  if (event.key === 'Enter') { event.preventDefault(); commitText(); }
  else if (event.key === 'Escape') { event.preventDefault(); text.value = formatValue(resolvedValue.value); }
};
const onWheel = (event: WheelEvent) => {
  if (!isFocused.value || !resolvedIsEnabled.value || !event.deltaY) return;
  event.preventDefault();
  changeBy(event.deltaY < 0 ? resolvedSmallChange.value : -resolvedSmallChange.value);
};

const onWindowMove = () => {
  if (compactPopupOpen.value) void updateCompactPopupPosition();
};

watch(resolvedValue, (value) => {
  text.value = formatValue(value);
});

watch(resolvedNumberFormatter, () => {
  text.value = formatValue(resolvedValue.value);
});
watch([resolvedMinimum, resolvedMaximum], () => {
  if (!Number.isNaN(resolvedValue.value) && resolvedValidationMode.value === 'InvalidInputOverwritten') setValue(resolvedValue.value);
});

watch(resolvedText, (value) => {
  if (value !== undefined && value !== text.value) text.value = value;
});

onMounted(() => {
  window.addEventListener('resize', onWindowMove);
  window.addEventListener('scroll', onWindowMove, true);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowMove);
  window.removeEventListener('scroll', onWindowMove, true);
});

const NumberBoxTemplate = {
  get Text() { return displayText.value; }, get Header() { return resolvedHeader.value; },
  get HeaderTemplate() { return localHeaderTemplate.value ?? resolvedHeaderTemplate.value; },
  get Description() { return resolvedDescription.value; }, get PlaceholderText() { return resolvedPlaceholderText.value; },
  get IsEnabled() { return resolvedIsEnabled.value; }, get InputScope() { return resolvedInputScope.value || 'Decimal'; },
  get TextAlignment() { return resolvedTextAlignment.value; }, get SelectionHighlightColor() { return resolvedSelectionHighlightColor.value; },
  get PreventKeyboardDisplayOnProgrammaticFocus() { return resolvedPreventKeyboardDisplayOnProgrammaticFocus.value; },
  get CanIncrease() { return canIncrease.value; }, get CanDecrease() { return canDecrease.value; },
  get IncreaseLabel() { return t('TextControls.NumberBox.Increase'); }, get DecreaseLabel() { return t('TextControls.NumberBox.Decrease'); }
};
provide(xamlScopeKey, { NumberBoxTemplate, OnNumberBoxTextChanged: onTextInput, OnNumberBoxGotFocus: onFocus, OnNumberBoxLostFocus: onLostFocus, OnNumberBoxSpinUp: () => changeBy(resolvedSmallChange.value), OnNumberBoxSpinDown: () => changeBy(-resolvedSmallChange.value) });
provide(textInputTemplateKey, {
  KeyDown: onKeydown,
  ActionsWidth: () => resolvedSpinButtonPlacementMode.value === 'Inline' ? 72 : resolvedSpinButtonPlacementMode.value === 'Compact' ? 40 : 0,
  ReserveDeleteButtonWidth: 40,
  DesiredWidthChanged: width => { desiredInputWidth.value = width; },
  Actions: () => resolvedSpinButtonPlacementMode.value === 'Inline'
    ? h('div', { class: 'win-number-spin inline', onPointerdown: (event: PointerEvent) => event.preventDefault() }, [
        h(RepeatButton, { class: 'win-number-spin-button', Content: '\uE70E', Padding: '0', IsEnabled: canIncrease.value, IsTabStop: 'False', 'AutomationProperties.Name': NumberBoxTemplate.IncreaseLabel, Click: () => changeBy(resolvedSmallChange.value) }),
        h(RepeatButton, { class: 'win-number-spin-button', Content: '\uE70D', Padding: '0', IsEnabled: canDecrease.value, IsTabStop: 'False', 'AutomationProperties.Name': NumberBoxTemplate.DecreaseLabel, Click: () => changeBy(-resolvedSmallChange.value) })
      ])
    : resolvedSpinButtonPlacementMode.value === 'Compact' ? h('span', { class: 'win-number-compact-indicator', 'aria-hidden': true }, '\uEC8F') : null
});
</script>

<style scoped>
.win-number-box {
  display: inline-flex;
  min-width: 64px;
  max-width: 100%;
  --RepeatButtonBackground: var(--TextControlButtonBackground, transparent);
  --RepeatButtonBackgroundPointerOver: var(--TextControlButtonBackgroundPointerOver, var(--subtle-fill-color-secondary, var(--subtle-secondary)));
  --RepeatButtonBackgroundPressed: var(--TextControlButtonBackgroundPressed, var(--subtle-fill-color-tertiary, var(--subtle-tertiary)));
  --RepeatButtonBackgroundDisabled: transparent;
  --RepeatButtonForeground: var(--TextControlButtonForeground, var(--text-secondary));
  --RepeatButtonForegroundPointerOver: var(--TextControlButtonForegroundPointerOver, var(--text-primary));
  --RepeatButtonForegroundPressed: var(--TextControlButtonForegroundPressed, var(--text-secondary));
  --RepeatButtonForegroundDisabled: var(--text-disabled);
  --RepeatButtonBorderBrush: transparent;
  --RepeatButtonBorderBrushPointerOver: transparent;
  --RepeatButtonBorderBrushPressed: transparent;
  --RepeatButtonBorderBrushDisabled: transparent;
}

.win-number-shell { width: 100%; }

.win-number-textbox {
  width: 100%;
}

.win-number-box :deep(.win-number-spin) {
  position: relative;
  z-index: 2;
  display: flex;
  align-self: stretch;
  color: var(--text-secondary);
  height: 30px;
  width: 72px;
  min-width: 72px;
  flex: 0 0 72px;
  overflow: visible;
}

.win-number-box :deep(.win-number-spin.inline) {
  flex-direction: row;
}

.win-number-box :deep(.win-number-spin-button) {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  min-width: 0;
  min-height: 0;
  padding: 0;
  margin: 4px;
  height: 22px;
  font-family: var(--SymbolThemeFontFamily, 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif);
  font-size: 12px;
  border-width: 0 1px 1px 1px;
}

.win-number-box :deep(.win-number-spin-button:first-child) {
  width: 32px;
  min-width: 32px;
  flex: 0 0 32px;
}

.win-number-box :deep(.win-number-spin-button:last-child) {
  width: 32px;
  min-width: 32px;
  flex: 0 0 32px;
  margin-left: 0;
  margin-right: 0;
}

.win-number-spin-button:first-child span {
  inset: 4px;
}

.win-number-spin-button:last-child span {
  inset: 4px 4px 4px 0;
}

.win-number-spin-button span,
.win-number-compact-indicator span,
.win-number-popup-button span {
  font-family: var(--SymbolThemeFontFamily, 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif);
  font-size: 12px;
}

.win-number-box :deep(.win-number-compact-indicator) {
  align-self: stretch;
  width: 40px;
  min-width: 40px;
  display: flex;
  place-items: center;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  pointer-events: none;
  font-family: var(--SymbolThemeFontFamily, 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif);
  font-size: 12px;
}

.win-number-compact-indicator span {
  position: static;
  inset: auto;
  display: block;
  font-size: 12px;
}

.win-number-compact-popup {
  position: fixed;
  z-index: 1000;
  width: 50px;
  padding: 6px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 4px;
  isolation: isolate;
  background: transparent;
  border: 1px solid var(--flyout-border, var(--surface-stroke-color-flyout, var(--card-stroke)));
  border-radius: 8px;
  overflow: visible;
  --RepeatButtonBackground: transparent;
  --RepeatButtonBackgroundPointerOver: var(--subtle-fill-color-secondary, var(--subtle-secondary));
  --RepeatButtonBackgroundPressed: var(--subtle-fill-color-tertiary, var(--subtle-tertiary));
  --RepeatButtonBackgroundDisabled: transparent;
  --RepeatButtonForeground: var(--text-secondary);
  --RepeatButtonForegroundPointerOver: var(--text-primary);
  --RepeatButtonForegroundPressed: var(--text-secondary);
  --RepeatButtonForegroundDisabled: var(--text-disabled);
  --RepeatButtonBorderBrush: transparent;
  --RepeatButtonBorderBrushPointerOver: transparent;
  --RepeatButtonBorderBrushPressed: transparent;
  --RepeatButtonBorderBrushDisabled: transparent;
}

.win-number-compact-popup :deep(.win-number-popup-button) {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  min-width: 36px;
  min-height: 36px;
  font-family: var(--SymbolThemeFontFamily, 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif);
  font-size: 16px;
}

.win-number-compact-popup :deep(.win-number-popup-button span) {
  font-size: 16px;
}

.win-number-compact-popup :deep(.win-number-popup-button:hover) {
  color: var(--text-primary);
}

.win-number-compact-popup :deep(.win-number-popup-button:disabled) {
  color: var(--text-disabled);
  cursor: default;
}

.win-number-textbox :deep(.win-textbox-delete-button) {
  width: 40px;
  min-width: 40px;
  flex-basis: 40px;
}

.win-number-textbox :deep(.win-textbox-delete-button-layout) {
  inset: 4px;
}
</style>
