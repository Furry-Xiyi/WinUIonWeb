<template>
  <div ref="rootRef" class="win-number-box" :class="{ 'is-disabled': !resolvedIsEnabled, 'is-inline': resolvedSpinButtonPlacementMode === 'Inline', 'is-compact': resolvedSpinButtonPlacementMode === 'Compact' }" :style="rootStyle">
    <div class="win-number-shell">
      <TextBox
        class="win-number-textbox"
        :Text="displayText"
        :Header="resolvedHeader"
        :Description="resolvedDescription"
        :PlaceholderText="resolvedPlaceholderText"
        :IsEnabled="resolvedIsEnabled"
        :InputScope="resolvedInputScope || 'Decimal'"
        :AcceptsReturn="resolvedIsWrapEnabled"
        :TextAlignment="resolvedTextAlignment"
        :SelectionHighlightColor="resolvedSelectionHighlightColor"
        :PreventKeyboardDisplayOnProgrammaticFocus="resolvedPreventKeyboardDisplayOnProgrammaticFocus"
        :ShowDeleteButton="false"
        @update:Text="onTextInput"
        @GotFocus="onFocus"
        @LostFocus="onLostFocus"
        @keydown.capture="onKeydown">
        <template #actions>
          <div v-if="resolvedSpinButtonPlacementMode === 'Inline'" class="win-number-spin inline">
            <button type="button" class="win-textbox-action-button win-number-spin-button" :disabled="!canIncrease" @pointerdown.prevent @click="changeBy(resolvedSmallChange)">
              <span></span>
            </button>
            <button type="button" class="win-textbox-action-button win-number-spin-button" :disabled="!canDecrease" @pointerdown.prevent @click="changeBy(-resolvedSmallChange)">
              <span></span>
            </button>
          </div>
          <span
            v-else-if="resolvedSpinButtonPlacementMode === 'Compact'"
            class="win-number-compact-indicator"
            aria-hidden="true">
            <span></span>
          </span>
        </template>
      </TextBox>
    </div>

    <Teleport to="body">
      <div
        v-if="compactPopupOpen"
        class="win-number-compact-popup win-theme-scope"
        :class="compactPopupThemeClass"
        :style="compactPopupStyle"
        @pointerdown.prevent>
        <button type="button" class="win-number-popup-button" :disabled="!canIncrease" @click="changeBy(resolvedSmallChange)">
          <span>&#xE70E;</span>
        </button>
        <button type="button" class="win-number-popup-button" :disabled="!canDecrease" @click="changeBy(-resolvedSmallChange)">
          <span>&#xE70D;</span>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';
import type { ComputedRef, CSSProperties } from 'vue';
import TextBox from './TextBox.vue';
import { resolveXamlHandler, resolveXamlValue, updateXamlBinding } from './xamlRuntime';

type SpinPlacement = 'Hidden' | 'Compact' | 'Inline';
type ValidationMode = 'InvalidInputOverwritten' | 'Disabled';
type TextAlignment = 'Left' | 'Center' | 'Right' | 'Justify';

const props = withDefaults(defineProps<{
  Value?: number | string;
  Text?: string;
  Minimum?: number | string;
  Maximum?: number | string;
  SmallChange?: number | string;
  LargeChange?: number | string;
  Header?: string;
  HeaderTemplate?: unknown | null;
  Description?: string;
  PlaceholderText?: string;
  InputScope?: string;
  SelectionFlyout?: unknown | null;
  SelectionHighlightColor?: string;
  TextReadingOrder?: string;
  PreventKeyboardDisplayOnProgrammaticFocus?: boolean | string;
  NumberFormatter?: Intl.NumberFormat | { format: (value: number) => string } | string | null;
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

const resolvedValue = computed(() => resolveNumber(props.Value, Number.NaN));
const resolvedMinimum = computed(() => resolveNumber(props.Minimum, Number.NEGATIVE_INFINITY));
const resolvedMaximum = computed(() => resolveNumber(props.Maximum, Number.POSITIVE_INFINITY));
const resolvedSmallChange = computed(() => resolveNumber(props.SmallChange, 1));
const resolvedLargeChange = computed(() => resolveNumber(props.LargeChange, 10));
const resolvedText = computed(() => {
  const value = resolveXamlValue(props.Text, instance);
  return value === undefined || value === null ? '' : String(value);
});
const resolvedHeader = computed(() => resolveXamlValue(props.Header, instance));
const resolvedDescription = computed(() => resolveXamlValue(props.Description, instance));
const resolvedPlaceholderText = computed(() => resolveXamlValue(props.PlaceholderText, instance));
const resolvedInputScope = computed(() => resolveXamlValue(props.InputScope, instance));
const resolvedValidationMode = computed(() => String(resolveXamlValue(props.ValidationMode, instance) ?? 'InvalidInputOverwritten'));
const resolvedIsWrapEnabled = computed(() => resolveBoolean(props.IsWrapEnabled, false));
const resolvedAcceptsExpression = computed(() => resolveBoolean(props.AcceptsExpression, false));
const resolvedIsEnabled = computed(() => resolveBoolean(props.IsEnabled, true));
const resolvedTextAlignment = computed(() => resolveXamlValue(props.TextAlignment, instance));
const resolvedSpinButtonPlacementMode = computed<SpinPlacement>(() => {
  const value = String(resolveXamlValue(props.SpinButtonPlacementMode, instance) ?? 'Hidden');
  return value === 'Inline' || value === 'Compact' ? value : 'Hidden';
});
const resolvedSelectionHighlightColor = computed(() => resolveXamlValue(props.SelectionHighlightColor, instance));
const resolvedPreventKeyboardDisplayOnProgrammaticFocus = computed(() => resolveBoolean(props.PreventKeyboardDisplayOnProgrammaticFocus, false));
const resolvedNumberFormatter = computed(() => resolveXamlValue(props.NumberFormatter, instance));
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
  minWidth: cssLength(resolvedMinWidth.value),
  minHeight: cssLength(resolvedMinHeight.value),
  maxWidth: cssLength(resolvedMaxWidth.value),
  maxHeight: cssLength(resolvedMaxHeight.value),
  margin: xamlThickness(resolvedMargin.value),
  alignSelf: alignmentStyle(String(resolvedVerticalAlignment.value ?? ''), 'vertical'),
  justifySelf: alignmentStyle(String(resolvedHorizontalAlignment.value ?? ''), 'horizontal')
}));
const canIncrease = computed(() => resolvedIsEnabled.value && (Number.isNaN(resolvedValue.value) || resolvedValue.value + resolvedSmallChange.value <= resolvedMaximum.value));
const canDecrease = computed(() => resolvedIsEnabled.value && (Number.isNaN(resolvedValue.value) || resolvedValue.value - resolvedSmallChange.value >= resolvedMinimum.value));

const clamp = (value: number) => Math.min(resolvedMaximum.value, Math.max(resolvedMinimum.value, value));

const evaluateExpression = (source: string) => {
  const normalized = source.replace(/\^/g, '**');
  if (!/^[\d+\-*/().\s%*]+$/.test(normalized)) return Number.NaN;
  try {
    return Number(Function(`"use strict"; return (${normalized});`)());
  } catch {
    return Number.NaN;
  }
};

const parseText = (source: string) => {
  const normalized = source.replace(/,/g, '');
  const value = resolvedAcceptsExpression.value ? evaluateExpression(normalized) : Number(normalized);
  return Number.isFinite(value) ? value : Number.NaN;
};

const sanitizeText = (value: string) => {
  const allowed = resolvedAcceptsExpression.value ? /[0-9+\-*/().%\s^]/ : /[0-9+\-.]/;
  let next = '';
  for (const char of value) {
    if (allowed.test(char)) next += char;
  }
  if (!resolvedAcceptsExpression.value) {
    next = next.replace(/(?!^)-/g, '');
    const firstDot = next.indexOf('.');
    if (firstDot !== -1) next = next.slice(0, firstDot + 1) + next.slice(firstDot + 1).replace(/\./g, '');
  }
  return next;
};

const setValue = (value: number, oldValue = resolvedValue.value) => {
  const newValue = Number.isNaN(value) ? Number.NaN : clamp(value);
  const previousValue = resolveNumber(oldValue, Number.NaN);
  text.value = formatValue(newValue);
  emit('update:Value', newValue);
  updateXamlBinding(props.Value, newValue, instance);
  emit('update:Text', text.value);
  updateXamlBinding(props.Text, text.value, instance);
  if (!Object.is(previousValue, newValue)) {
    const args = { OldValue: previousValue, NewValue: newValue };
    emit('ValueChanged', args);
    resolveXamlHandler(attrs.ValueChanged, instance)?.(args);
  }
  return newValue;
};

const onTextInput = (value: string) => {
  const sanitized = sanitizeText(value);
  text.value = sanitized;
  emit('update:Text', sanitized);
  updateXamlBinding(props.Text, sanitized, instance);
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
  const popupHeight = 88;
  compactPopupStyle.value = {
    left: `${rect.right - 44}px`,
    top: `${rect.top + rect.height / 2 - popupHeight / 2}px`
  };
  await nextTick();
};

const onFocus = () => {
  isFocused.value = true;
  void updateCompactPopupPosition();
};

const onLostFocus = () => {
  window.setTimeout(() => {
    isFocused.value = false;
    commitText();
  }, 120);
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
  const base = Number.isNaN(committed) ? 0 : committed;
  setValue(base + delta, committed);
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.key.length === 1 && sanitizeText(event.key) !== event.key) event.preventDefault();
  if (event.key === 'Enter') {
    event.preventDefault();
    commitText();
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    changeBy(event.shiftKey ? resolvedLargeChange.value : resolvedSmallChange.value);
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    changeBy(event.shiftKey ? -resolvedLargeChange.value : -resolvedSmallChange.value);
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

const onWindowMove = () => {
  if (compactPopupOpen.value) void updateCompactPopupPosition();
};

watch(resolvedValue, (value) => {
  text.value = formatValue(value);
});

watch(resolvedNumberFormatter, () => {
  text.value = formatValue(resolvedValue.value);
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
</script>

<style scoped>
.win-number-box {
  display: inline-flex;
  min-width: 64px;
}

.win-number-shell { width: 100%; }

.win-number-textbox {
  width: 100%;
}

.win-number-spin {
  display: flex;
  align-self: stretch;
  color: var(--text-secondary);
}

.win-number-spin.inline {
  flex-direction: row;
}

.win-number-spin-button {
  display: grid;
  place-items: center;
  min-width: 0;
}

.win-number-spin-button:first-child {
  width: 40px;
  min-width: 40px;
  flex: 0 0 40px;
}

.win-number-spin-button:last-child {
  width: 36px;
  min-width: 36px;
  flex: 0 0 36px;
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
  font-size: 12px;
}

.win-number-compact-indicator {
  align-self: stretch;
  width: 40px;
  min-width: 40px;
  display: flex;
  place-items: center;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  pointer-events: none;
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
  width: 48px;
  padding: 6px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 4px;
  --win-acrylic-fill: var(--flyout-background, var(--layer-fill-color-default));
  isolation: isolate;
  background: transparent;
  border: 1px solid var(--flyout-border, var(--surface-stroke-color-flyout, var(--card-stroke)));
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
  -webkit-backdrop-filter: var(--flyout-backdrop, blur(30px));
  backdrop-filter: var(--flyout-backdrop, blur(30px));
}

.win-number-popup-button {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
}

.win-number-popup-button span {
  font-size: 16px;
}

.win-number-popup-button:hover {
  background: var(--subtle-fill-color-secondary, var(--subtle-secondary));
  color: var(--text-primary);
}

.win-number-popup-button:disabled {
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
