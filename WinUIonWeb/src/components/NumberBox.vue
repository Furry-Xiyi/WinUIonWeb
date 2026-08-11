<template>
  <div ref="rootRef" class="win-number-box" :class="{ 'is-disabled': !IsEnabled, 'is-inline': SpinButtonPlacementMode === 'Inline', 'is-compact': SpinButtonPlacementMode === 'Compact' }" :style="rootStyle">
    <div class="win-number-shell">
      <WinTextBox
        class="win-number-textbox"
        :Text="displayText"
        :Header="Header"
        :Description="Description"
        :PlaceholderText="PlaceholderText"
        :IsEnabled="IsEnabled"
        :InputScope="InputScope || 'Decimal'"
        :AcceptsReturn="IsWrapEnabled"
        :TextAlignment="TextAlignment"
        :SelectionHighlightColor="SelectionHighlightColor"
        :PreventKeyboardDisplayOnProgrammaticFocus="PreventKeyboardDisplayOnProgrammaticFocus"
        :ShowDeleteButton="false"
        @update:Text="onTextInput"
        @GotFocus="onFocus"
        @LostFocus="onLostFocus"
        @keydown.capture="onKeydown">
        <template #actions>
          <div v-if="SpinButtonPlacementMode === 'Inline'" class="win-number-spin inline">
            <button type="button" class="win-textbox-action-button win-number-spin-button" :disabled="!canIncrease" @pointerdown.prevent @click="changeBy(SmallChange)">
              <span></span>
            </button>
            <button type="button" class="win-textbox-action-button win-number-spin-button" :disabled="!canDecrease" @pointerdown.prevent @click="changeBy(-SmallChange)">
              <span></span>
            </button>
          </div>
          <span
            v-else-if="SpinButtonPlacementMode === 'Compact'"
            class="win-number-compact-indicator"
            aria-hidden="true">
            <span></span>
          </span>
        </template>
      </WinTextBox>
    </div>

    <Teleport to="body">
      <div
        v-if="compactPopupOpen"
        class="win-number-compact-popup win-theme-scope"
        :class="compactPopupThemeClass"
        :style="compactPopupStyle"
        @pointerdown.prevent>
        <button type="button" class="win-number-popup-button" :disabled="!canIncrease" @click="changeBy(SmallChange)">
          <span>&#xE70E;</span>
        </button>
        <button type="button" class="win-number-popup-button" :disabled="!canDecrease" @click="changeBy(-SmallChange)">
          <span>&#xE70D;</span>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { ComputedRef, CSSProperties } from 'vue';
import WinTextBox from './WinTextBox.vue';

type SpinPlacement = 'Hidden' | 'Compact' | 'Inline';
type ValidationMode = 'InvalidInputOverwritten' | 'Disabled';
type TextAlignment = 'Left' | 'Center' | 'Right' | 'Justify';

const props = withDefaults(defineProps<{
  Value?: number;
  Text?: string;
  Minimum?: number;
  Maximum?: number;
  SmallChange?: number;
  LargeChange?: number;
  Header?: string;
  HeaderTemplate?: unknown | null;
  Description?: string;
  PlaceholderText?: string;
  InputScope?: string;
  SelectionFlyout?: unknown | null;
  SelectionHighlightColor?: string;
  TextReadingOrder?: string;
  PreventKeyboardDisplayOnProgrammaticFocus?: boolean;
  NumberFormatter?: Intl.NumberFormat | null;
  SpinButtonPlacementMode?: SpinPlacement;
  ValidationMode?: ValidationMode;
  IsWrapEnabled?: boolean;
  AcceptsExpression?: boolean;
  IsEnabled?: boolean;
  TextAlignment?: TextAlignment;
  MinWidth?: number | string;
  MinHeight?: number | string;
  MaxWidth?: number | string;
  MaxHeight?: number | string;
  VerticalAlignment?: string;
  HorizontalAlignment?: string;
  Width?: number | string;
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
  Width: ''
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

const formatValue = (value: number) => {
  if (Number.isNaN(value)) return '';
  return props.NumberFormatter?.format(value) ?? String(value);
};

const text = ref(props.Text || formatValue(props.Value));

const displayText = computed(() => text.value);
const compactPopupOpen = computed(() => props.SpinButtonPlacementMode === 'Compact' && props.IsEnabled && isFocused.value);
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
const rootStyle = computed<CSSProperties>(() => ({
  width: props.Width === '' ? undefined : typeof props.Width === 'number' ? `${props.Width}px` : props.Width,
  minWidth: typeof props.MinWidth === 'number' ? `${props.MinWidth}px` : props.MinWidth,
  minHeight: props.MinHeight === '' ? undefined : typeof props.MinHeight === 'number' ? `${props.MinHeight}px` : props.MinHeight,
  maxWidth: props.MaxWidth === '' ? undefined : typeof props.MaxWidth === 'number' ? `${props.MaxWidth}px` : props.MaxWidth,
  maxHeight: props.MaxHeight === '' ? undefined : typeof props.MaxHeight === 'number' ? `${props.MaxHeight}px` : props.MaxHeight,
  alignSelf: alignmentStyle(props.VerticalAlignment, 'vertical'),
  justifySelf: alignmentStyle(props.HorizontalAlignment, 'horizontal')
}));
const canIncrease = computed(() => props.IsEnabled && (Number.isNaN(props.Value) || props.Value + props.SmallChange <= props.Maximum));
const canDecrease = computed(() => props.IsEnabled && (Number.isNaN(props.Value) || props.Value - props.SmallChange >= props.Minimum));

const clamp = (value: number) => Math.min(props.Maximum, Math.max(props.Minimum, value));

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
  const value = props.AcceptsExpression ? evaluateExpression(normalized) : Number(normalized);
  return Number.isFinite(value) ? value : Number.NaN;
};

const sanitizeText = (value: string) => {
  const allowed = props.AcceptsExpression ? /[0-9+\-*/().%\s^]/ : /[0-9+\-.]/;
  let next = '';
  for (const char of value) {
    if (allowed.test(char)) next += char;
  }
  if (!props.AcceptsExpression) {
    next = next.replace(/(?!^)-/g, '');
    const firstDot = next.indexOf('.');
    if (firstDot !== -1) next = next.slice(0, firstDot + 1) + next.slice(firstDot + 1).replace(/\./g, '');
  }
  return next;
};

const setValue = (value: number, oldValue = props.Value) => {
  const newValue = Number.isNaN(value) ? Number.NaN : clamp(value);
  text.value = formatValue(newValue);
  emit('update:Value', newValue);
  emit('update:Text', text.value);
  if (!Object.is(oldValue, newValue)) emit('ValueChanged', { OldValue: oldValue, NewValue: newValue });
  return newValue;
};

const onTextInput = (value: string) => {
  const sanitized = sanitizeText(value);
  text.value = sanitized;
  emit('update:Text', sanitized);
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
    if (props.ValidationMode === 'InvalidInputOverwritten') text.value = formatValue(props.Value);
    return props.Value;
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
    changeBy(event.shiftKey ? props.LargeChange : props.SmallChange);
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    changeBy(event.shiftKey ? -props.LargeChange : -props.SmallChange);
  }
  if (event.key === 'PageUp') {
    event.preventDefault();
    changeBy(props.LargeChange);
  }
  if (event.key === 'PageDown') {
    event.preventDefault();
    changeBy(-props.LargeChange);
  }
};

const onWindowMove = () => {
  if (compactPopupOpen.value) void updateCompactPopupPosition();
};

watch(() => props.Value, (value) => {
  text.value = formatValue(value);
});

watch(() => props.NumberFormatter, () => {
  text.value = formatValue(props.Value);
});

watch(() => props.Text, (value) => {
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
