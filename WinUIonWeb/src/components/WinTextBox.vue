<template>
  <div
    class="win-textbox"
    :class="{
      'is-readonly': IsReadOnly,
      'is-disabled': isDisabled,
      'is-focused': isFocused,
      'is-hovered': isHovered
    }"
    :style="rootStyle">
    <div v-if="Header || $slots.header" class="win-textbox-header">
      <slot name="header">{{ Header }}</slot>
    </div>

    <div class="win-textbox-border">
      <div class="win-textbox-content">
        <textarea
          v-if="AcceptsReturn"
          ref="fieldRef"
          class="win-textbox-field win-textbox-textarea"
          :value="currentText"
          :placeholder="PlaceholderText"
          :readonly="IsReadOnly"
          :disabled="isDisabled"
          :maxlength="MaxLength > 0 ? MaxLength : undefined"
          :spellcheck="IsSpellCheckEnabled"
          :inputmode="inputMode"
          :autocomplete="IsTextPredictionEnabled ? 'on' : 'off'"
          :autocapitalize="textPredictionAttr"
          :autocorrect="textPredictionAttr"
          :style="fieldStyle"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
          @keydown="onKeydown"
          @paste="onPaste"
          @contextmenu="onContextMenu"
          @select="onSelect"
          @cut="onCuttingToClipboard"
          @copy="onCopyingToClipboard"
          @compositionstart="emit('TextCompositionStarted')"
          @compositionupdate="emit('TextCompositionChanged')"
          @compositionend="emit('TextCompositionEnded')"
          @pointerenter="onPointerEnter"
          @pointerleave="onPointerLeave" />

        <input
          v-else
          ref="fieldRef"
          class="win-textbox-field"
          type="text"
          :value="currentText"
          :placeholder="PlaceholderText"
          :readonly="IsReadOnly"
          :disabled="isDisabled"
          :maxlength="MaxLength > 0 ? MaxLength : undefined"
          :spellcheck="IsSpellCheckEnabled"
          :inputmode="inputMode"
          :autocomplete="IsTextPredictionEnabled ? 'on' : 'off'"
          :autocapitalize="textPredictionAttr"
          :autocorrect="textPredictionAttr"
          :style="fieldStyle"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
          @keydown="onKeydown"
          @paste="onPaste"
          @contextmenu="onContextMenu"
          @select="onSelect"
          @cut="onCuttingToClipboard"
          @copy="onCopyingToClipboard"
          @compositionstart="emit('TextCompositionStarted')"
          @compositionupdate="emit('TextCompositionChanged')"
          @compositionend="emit('TextCompositionEnded')"
          @pointerenter="onPointerEnter"
          @pointerleave="onPointerLeave" />

        <button
          v-if="showDeleteButton"
          class="win-textbox-delete-button"
          type="button"
          :aria-label="t('text.clear-text')"
          @pointerdown.prevent
          @click="clearText">
          <span class="win-textbox-delete-button-layout">
            <span class="win-textbox-delete-glyph"></span>
          </span>
        </button>

        <slot name="actions"></slot>
      </div>
    </div>

    <div v-if="Description || $slots.description" class="win-textbox-description">
      <slot name="description">{{ Description }}</slot>
    </div>

    <WinMenuFlyout
      :Open="contextMenuOpen"
      :AnchorRect="contextMenuAnchor"
      :Items="contextMenuItems"
      :MinWidth="160"
      Placement="Right"
      @Close="closeContextMenu"
      @Select="onContextMenuSelect" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import type { CSSProperties } from 'vue';
import WinMenuFlyout from './WinMenuFlyout.vue';
import { useI18n } from './i18n';

const { t } = useI18n();

type TextAlignment = 'Left' | 'Center' | 'Right' | 'Justify';
type TextWrapping = 'NoWrap' | 'Wrap' | 'WrapWholeWords';
type CharacterCasing = 'Normal' | 'Lower' | 'Upper';
type TextBoxMenuCommand = 'cut' | 'copy' | 'paste' | 'undo' | 'redo' | 'selectAll';
type TextBoxMenuItem = {
  Text?: string;
  Icon?: string;
  Value?: TextBoxMenuCommand;
};

const props = withDefaults(defineProps<{
  Text?: string;
  PlaceholderText?: string;
  Header?: string;
  Description?: string;
  AcceptsReturn?: boolean;
  IsReadOnly?: boolean;
  IsEnabled?: boolean;
  MaxLength?: number;
  TextWrapping?: TextWrapping;
  TextAlignment?: TextAlignment;
  IsSpellCheckEnabled?: boolean;
  IsTextPredictionEnabled?: boolean;
  InputScope?: string;
  CharacterCasing?: CharacterCasing;
  SelectionHighlightColor?: string;
  DesiredCandidateWindowAlignment?: string;
  IsColorFontEnabled?: boolean;
  PreventKeyboardDisplayOnProgrammaticFocus?: boolean;

  FontFamily?: string;
  FontSize?: number | string;
  FontStyle?: string;
  FontWeight?: number | string;
  Foreground?: string;
  CharacterSpacing?: number;
  MinWidth?: number | string;
  MaxWidth?: number | string;
  MinHeight?: number | string;
  MaxHeight?: number | string;
}>(), {
  PlaceholderText: '',
  Header: '',
  Description: '',
  AcceptsReturn: false,
  IsReadOnly: false,
  IsEnabled: true,
  MaxLength: 0,
  TextWrapping: 'NoWrap',
  TextAlignment: 'Left',
  IsSpellCheckEnabled: true,
  IsTextPredictionEnabled: true,
  InputScope: 'Default',
  CharacterCasing: 'Normal',
  SelectionHighlightColor: '',
  DesiredCandidateWindowAlignment: 'Default',
  IsColorFontEnabled: true,
  PreventKeyboardDisplayOnProgrammaticFocus: false,
  FontFamily: '',
  FontSize: '',
  FontStyle: 'Normal',
  FontWeight: '',
  Foreground: '',
  CharacterSpacing: 0,
  MinWidth: '',
  MaxWidth: '',
  MinHeight: '',
  MaxHeight: ''
});

const emit = defineEmits<{
  'update:Text': [value: string];
  TextChanging: [args: { cancel: boolean; isContentChanging: boolean; checkedLength: number; text: string }];
  TextChanged: [args: { reason: 'UserInput' | 'ProgrammaticChange'; text: string }];
  SelectionChanged: [args: { selectionStart: number; selectionLength: number; selectedText: string }];
  GotFocus: [];
  LostFocus: [];
  Paste: [args: { handled: boolean; format: 'Text'; text: string }];
  CuttingToClipboard: [args: { cancel: boolean; text: string }];
  CopyingToClipboard: [args: { cancel: boolean; text: string }];
  CandidateWindowBoundsChanged: [args: { rect: DOMRect | { x: number; y: number; width: number; height: number } }];
  TextCompositionStarted: [];
  TextCompositionChanged: [];
  TextCompositionEnded: [];
}>();

const fieldRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
const isFocused = ref(false);
const isHovered = ref(false);
const localText = ref(props.Text ?? '');
const undoStack = ref<string[]>([]);
const redoStack = ref<string[]>([]);
const clipboardText = ref('');
const contextMenuOpen = ref(false);
const contextMenuAnchor = ref<DOMRect | {
  x: number;
  y: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;
} | null>(null);
const contextSelection = ref({ start: 0, length: 0, text: '' });

const isTextControlled = computed(() => props.Text !== undefined);
const currentText = computed(() => isTextControlled.value ? props.Text ?? '' : localText.value);
const isDisabled = computed(() => !props.IsEnabled);
const hasText = computed(() => currentText.value.length > 0);
const showDeleteButton = computed(() =>
  hasText.value && !props.AcceptsReturn && !props.IsReadOnly && props.IsEnabled && isFocused.value
);

const inputMode = computed(() => {
  switch (props.InputScope) {
    case 'Number':
    case 'NumericPin':
    case 'Digits':
      return 'numeric';
    case 'TelephoneNumber':
      return 'tel';
    case 'EmailNameOrAddress':
    case 'EmailSmtpAddress':
      return 'email';
    case 'Url':
      return 'url';
    case 'Search':
      return 'search';
    case 'CurrencyAmount':
    case 'CurrencyAmountAndSymbol':
    case 'Decimal':
      return 'decimal';
    default:
      return 'text';
  }
});

const textPredictionAttr = computed(() => (props.IsTextPredictionEnabled ? 'on' : 'off'));

const resolvedTextAlign = computed(() => {
  return (props.TextAlignment || 'Left').toLowerCase();
});

const cssSize = (value: number | string | undefined) => {
  if (value === undefined || value === '') return undefined;
  return typeof value === 'number' ? `${value}px` : value;
};

const rootStyle = computed<CSSProperties & Record<string, string | number | undefined>>(() => {
  const style: CSSProperties & Record<string, string | number | undefined> = {};
  if (props.SelectionHighlightColor) {
    style['--textbox-selection-background'] = props.SelectionHighlightColor;
  }
  if (props.MinWidth !== '') style.minWidth = cssSize(props.MinWidth);
  if (props.MaxWidth !== '') style.maxWidth = cssSize(props.MaxWidth);
  if (props.MinHeight !== '') style.minHeight = cssSize(props.MinHeight);
  if (props.MaxHeight !== '') style.maxHeight = cssSize(props.MaxHeight);
  return style;
});

const fieldStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    textAlign: resolvedTextAlign.value as CSSProperties['textAlign']
  };

  if (props.FontFamily) style.fontFamily = props.FontFamily;
  if (props.FontSize !== '') style.fontSize = cssSize(props.FontSize);
  if (props.FontStyle && props.FontStyle !== 'Normal') style.fontStyle = props.FontStyle.toLowerCase();
  if (props.FontWeight !== '') style.fontWeight = props.FontWeight;
  if (props.Foreground) style.color = props.Foreground;
  if (props.CharacterSpacing) style.letterSpacing = `${props.CharacterSpacing / 1000}em`;

  if (props.AcceptsReturn) {
    style.whiteSpace = props.TextWrapping === 'NoWrap' ? 'pre' : 'pre-wrap';
    style.overflowWrap = props.TextWrapping === 'WrapWholeWords' ? 'normal' : 'break-word';
  }

  return style;
});

const canUndo = computed(() => undoStack.value.length > 0);
const canRedo = computed(() => redoStack.value.length > 0);

const contextMenuItems = computed<TextBoxMenuItem[]>(() => {
  const items: TextBoxMenuItem[] = [];
  const hasSelection = contextSelection.value.length > 0;
  const hasText = currentText.value.length > 0;
  const canEdit = !props.IsReadOnly && props.IsEnabled;
  const canPaste = canEdit && clipboardText.value.length > 0;

  if (hasSelection) {
    if (canEdit) items.push({ Text: t('text.cut'), Icon: '\uE8C6', Value: 'cut' });
    items.push({ Text: t('text.copy'), Icon: '\uE8C8', Value: 'copy' });
  }

  if (canPaste) {
    items.push({ Text: t('text.paste'), Icon: '\uE77F', Value: 'paste' });
  }

  if (canUndo.value) {
    items.push({ Text: t('text.undo'), Icon: '\uE7A7', Value: 'undo' });
  }

  if (canRedo.value) {
    items.push({ Text: t('text.redo'), Icon: '\uE7A6', Value: 'redo' });
  }

  if (hasText) {
    items.push({ Text: t('text.select-all'), Icon: '\uE8B3', Value: 'selectAll' });
  }

  return items;
});

const pushUndo = (previousText: string) => {
  if (undoStack.value.at(-1) === previousText) return;
  undoStack.value.push(previousText);
  redoStack.value = [];
};

const emitTextValue = (value: string, reason: 'UserInput' | 'ProgrammaticChange', options: { undo?: boolean } = {}) => {
  const previous = currentText.value;
  if (options.undo) pushUndo(previous);

  if (!isTextControlled.value) {
    localText.value = value;
  }
  emit('update:Text', value);
  emit('TextChanged', { reason, text: value });
};

const resizeTextarea = () => {
  const element = fieldRef.value;
  if (!element || !props.AcceptsReturn || !(element instanceof HTMLTextAreaElement)) return;
  element.style.height = 'auto';
  element.style.height = `${element.scrollHeight}px`;
};

watch(() => props.Text, () => {
  localText.value = props.Text ?? '';
  void nextTick(resizeTextarea);
}, { immediate: true });

const normalizeInput = (value: string) => {
  let nextValue = value;
  if (props.CharacterCasing === 'Upper') nextValue = nextValue.toUpperCase();
  if (props.CharacterCasing === 'Lower') nextValue = nextValue.toLowerCase();
  if (props.MaxLength > 0 && nextValue.length > props.MaxLength) {
    nextValue = nextValue.slice(0, props.MaxLength);
  }
  return nextValue;
};

const onInput = (event: Event) => {
  const element = event.target as HTMLInputElement | HTMLTextAreaElement;
  const nextValue = normalizeInput(element.value);
  const changingArgs = {
    cancel: false,
    isContentChanging: nextValue !== currentText.value,
    checkedLength: nextValue.length,
    text: nextValue
  };

  emit('TextChanging', changingArgs);
  if (changingArgs.cancel) {
    element.value = currentText.value;
    return;
  }

  if (element.value !== nextValue) {
    element.value = nextValue;
  }

  emitTextValue(nextValue, 'UserInput', { undo: true });
  resizeTextarea();
};

const onFocus = () => {
  isFocused.value = true;
  emit('GotFocus');
  resizeTextarea();
};

const onBlur = () => {
  isFocused.value = false;
  emit('LostFocus');
};

const onPointerEnter = () => {
  isHovered.value = true;
};

const onPointerLeave = () => {
  isHovered.value = false;
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !props.AcceptsReturn) {
    event.preventDefault();
  }
};

const readSelection = () => {
  const element = fieldRef.value;
  if (!element) return { start: 0, length: 0, text: '' };
  const start = element.selectionStart ?? 0;
  const end = element.selectionEnd ?? 0;
  const normalizedStart = Math.min(start, end);
  const normalizedEnd = Math.max(start, end);
  return {
    start: normalizedStart,
    length: normalizedEnd - normalizedStart,
    text: element.value.substring(normalizedStart, normalizedEnd)
  };
};

const onSelect = () => {
  const selection = readSelection();
  emit('SelectionChanged', {
    selectionStart: selection.start,
    selectionLength: selection.length,
    selectedText: selection.text
  });
};

const onCuttingToClipboard = (event: ClipboardEvent) => {
  const args = { cancel: false, text: readSelection().text };
  emit('CuttingToClipboard', args);
  if (args.cancel) event.preventDefault();
};

const onCopyingToClipboard = (event: ClipboardEvent) => {
  const args = { cancel: false, text: readSelection().text };
  emit('CopyingToClipboard', args);
  if (args.cancel) event.preventDefault();
};

const onPaste = (event: ClipboardEvent) => {
  const text = event.clipboardData?.getData('text') ?? '';
  const args = { handled: false, format: 'Text' as const, text };
  emit('Paste', args);
  if (args.handled) event.preventDefault();
};

const readClipboardText = async () => {
  try {
    return await navigator.clipboard?.readText() ?? '';
  } catch {
    return '';
  }
};

const onContextMenu = async (event: MouseEvent) => {
  event.preventDefault();
  if (isDisabled.value) return;

  contextMenuOpen.value = false;
  contextSelection.value = readSelection();
  clipboardText.value = await readClipboardText();

  if (!contextMenuItems.value.length) return;

  const x = event.clientX;
  const y = event.clientY;
  contextMenuAnchor.value = {
    x,
    y,
    top: y,
    bottom: y,
    left: x,
    right: x,
    width: 0,
    height: 0
  };
  contextMenuOpen.value = true;
};

const clearText = () => {
  emitTextValue('', 'ProgrammaticChange', { undo: true });
  requestAnimationFrame(() => {
    fieldRef.value?.focus();
    resizeTextarea();
  });
};

const closeContextMenu = () => {
  contextMenuOpen.value = false;
};

const onContextMenuSelect = (item: TextBoxMenuItem) => {
  if (!item.Value) return;
  const command = item.Value;
  closeContextMenu();

  if (command === 'cut') cutContextSelectionToClipboard();
  if (command === 'copy') copyContextSelectionToClipboard();
  if (command === 'paste') void pasteFromClipboard();
  if (command === 'undo') undo();
  if (command === 'redo') redo();
  if (command === 'selectAll') selectAll();
};

const focus = (options: FocusOptions = {}) => {
  fieldRef.value?.focus({
    preventScroll: props.PreventKeyboardDisplayOnProgrammaticFocus || options.preventScroll
  });
};

const selectAll = () => {
  fieldRef.value?.select();
  onSelect();
};

const select = (start: number, length: number) => {
  const element = fieldRef.value;
  if (!element) return;
  const selectionStart = Math.max(0, Math.min(start, element.value.length));
  const selectionEnd = Math.max(selectionStart, Math.min(selectionStart + length, element.value.length));
  element.setSelectionRange(selectionStart, selectionEnd);
  onSelect();
};

const getRectFromCharacterIndex = (index: number, trailingEdge = false) => {
  const element = fieldRef.value;
  if (!element || typeof document === 'undefined') {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const rect = element.getBoundingClientRect();
  const computedStyle = getComputedStyle(element);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const normalizedIndex = Math.max(0, Math.min(index, element.value.length));
  let textWidth = 0;

  if (context) {
    context.font = `${computedStyle.fontStyle} ${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;
    textWidth = context.measureText(element.value.slice(0, normalizedIndex)).width;
  }

  const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
  const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
  const lineHeight = parseFloat(computedStyle.lineHeight) || 20;

  return {
    x: rect.left + paddingLeft + textWidth + (trailingEdge ? 1 : 0),
    y: rect.top + paddingTop,
    width: 1,
    height: lineHeight
  };
};

const replaceSelectedText = (replacement: string) => {
  const element = fieldRef.value;
  if (!element) return;
  const selection = readSelection();
  replaceTextRange(selection.start, selection.length, replacement);
};

const replaceTextRange = (start: number, length: number, replacement: string) => {
  const element = fieldRef.value;
  if (!element) return;
  const selectionStart = Math.max(0, Math.min(start, element.value.length));
  const selectionLength = Math.max(0, Math.min(length, element.value.length - selectionStart));
  const nextValue = normalizeInput(
    element.value.slice(0, selectionStart) + replacement + element.value.slice(selectionStart + selectionLength)
  );
  element.value = nextValue;
  emitTextValue(nextValue, 'ProgrammaticChange', { undo: true });
  requestAnimationFrame(resizeTextarea);
};

const undo = () => {
  if (!undoStack.value.length) return;
  const previous = undoStack.value.pop() ?? '';
  redoStack.value.push(currentText.value);
  emitTextValue(previous, 'ProgrammaticChange');
  requestAnimationFrame(resizeTextarea);
};

const redo = () => {
  if (!redoStack.value.length) return;
  const next = redoStack.value.pop() ?? '';
  undoStack.value.push(currentText.value);
  emitTextValue(next, 'ProgrammaticChange');
  requestAnimationFrame(resizeTextarea);
};

const copySelectionToClipboard = () => {
  const selection = readSelection();
  if (selection.text) void navigator.clipboard?.writeText(selection.text);
};

const cutSelectionToClipboard = () => {
  const selection = readSelection();
  if (!selection.text) return;
  void navigator.clipboard?.writeText(selection.text);
  replaceSelectedText('');
};

const pasteFromClipboard = async () => {
  const text = await navigator.clipboard?.readText();
  if (text !== undefined) replaceSelectedText(text);
};

const copyContextSelectionToClipboard = () => {
  if (contextSelection.value.text) void navigator.clipboard?.writeText(contextSelection.value.text);
};

const cutContextSelectionToClipboard = () => {
  if (!contextSelection.value.text) return;
  void navigator.clipboard?.writeText(contextSelection.value.text);
  replaceTextRange(contextSelection.value.start, contextSelection.value.length, '');
};

onBeforeUnmount(() => {
  undoStack.value = [];
  redoStack.value = [];
  contextMenuOpen.value = false;
});

defineExpose({
  focus,
  selectAll,
  select,
  getRectFromCharacterIndex,
  undo,
  redo,
  copySelectionToClipboard,
  cutSelectionToClipboard,
  pasteFromClipboard,
  clearText,
  get canUndo() {
    return canUndo.value;
  },
  get canRedo() {
    return canRedo.value;
  },
  get selectedText() {
    return readSelection().text;
  },
  set selectedText(value: string) {
    replaceSelectedText(value);
  },
  get selectionStart() {
    return readSelection().start;
  },
  get selectionLength() {
    return readSelection().length;
  }
});
</script>

<style scoped>
.win-textbox {
  --textbox-background: var(--control-fill-color-default, var(--ctrl-fill-default));
  --textbox-background-pointer-over: var(--control-fill-color-secondary, var(--ctrl-fill-secondary));
  --textbox-background-focused: var(--control-fill-color-input-active, var(--ctrl-fill-input-active));
  --textbox-background-disabled: var(--control-fill-color-disabled, var(--ctrl-fill-disabled));
  --textbox-border-top: var(--control-stroke-color-default, var(--ctrl-border-rest));
  --textbox-border-bottom: var(--control-strong-stroke-color-default, var(--ctrl-strong-stroke));
  --textbox-border-focused: var(--system-accent-color-dark-1, var(--accent-base, var(--accent-default)));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
}

:global(html.theme-dark) .win-textbox,
:global(.example-theme-wrapper.theme-dark) .win-textbox {
  --textbox-border-focused: var(--system-accent-color-light-2, var(--accent-base, var(--accent-default)));
}

:global(html.theme-light) .win-textbox,
:global(.example-theme-wrapper.theme-light) .win-textbox {
  --textbox-border-focused: var(--system-accent-color-dark-1, var(--accent-base, var(--accent-default)));
}

@media (prefers-color-scheme: dark) {
  .win-textbox {
    --textbox-border-focused: var(--system-accent-color-light-2, var(--accent-base, var(--accent-default)));
  }
}

.win-textbox-header {
  margin-bottom: 8px;
  color: var(--text-primary, var(--text-fill-color-primary));
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.win-textbox-border {
  position: relative;
  min-height: 32px;
  overflow: hidden;
  background: var(--textbox-background);
  border: 1px solid var(--textbox-border-top);
  border-bottom-color: var(--textbox-border-bottom);
  border-radius: 4px;
  box-shadow: inset 0 0 0 transparent;
  box-sizing: border-box;
  transition:
    background var(--fast-duration, 100ms),
    border-color var(--fast-duration, 100ms),
    box-shadow var(--fast-duration, 100ms);
}

.win-textbox.is-hovered:not(.is-disabled) .win-textbox-border {
  background: var(--textbox-background-pointer-over);
}

.win-textbox.is-focused:not(.is-disabled) .win-textbox-border {
  background: var(--textbox-background-focused);
  border-bottom-color: var(--textbox-border-top);
  box-shadow: inset 0 -2px 0 var(--textbox-border-focused);
}

.win-textbox-content {
  display: flex;
  align-items: stretch;
  min-width: 0;
  min-height: 30px;
}

.win-textbox-field {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 5px 6px 6px 10px;
  color: var(--text-primary, var(--text-fill-color-primary));
  background: transparent;
  border: 0;
  outline: 0;
  font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  line-height: 20px;
  user-select: text;
}

.win-textbox-textarea {
  min-height: 76px;
  height: auto;
  resize: none;
  overflow: hidden;
}

.win-textbox-delete-button {
  appearance: none;
  -webkit-appearance: none;
  align-self: stretch;
  position: relative;
  width: 40px;
  min-width: 40px;
  height: auto;
  min-height: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  color: var(--text-secondary, var(--text-fill-color-secondary, rgba(0, 0, 0, 0.62)));
  background: transparent;
  border: 0;
  border-radius: 0;
  cursor: pointer;
  flex: 0 0 40px;
  font: inherit;
  line-height: 1;
}

:slotted(.win-textbox-action-button) {
  appearance: none;
  -webkit-appearance: none;
  align-self: stretch;
  position: relative;
  width: 40px;
  min-width: 40px;
  height: auto;
  min-height: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  color: var(--text-secondary, var(--text-fill-color-secondary, rgba(0, 0, 0, 0.62)));
  background: transparent;
  border: 0;
  border-radius: 0;
  cursor: pointer;
  flex: 0 0 40px;
  font: inherit;
  line-height: 1;
}

:slotted(.win-textbox-action-button.win-textbox-action-query) {
  width: 40px;
  min-width: 40px;
  flex-basis: 40px;
  margin-left: 0;
}

:slotted(.win-textbox-action-button.win-textbox-action-number) {
  width: 40px;
  min-width: 40px;
  flex-basis: 40px;
}

:slotted(.win-textbox-action-button:hover) {
  color: var(--text-primary, var(--text-fill-color-primary, rgba(0, 0, 0, 0.89)));
}

:slotted(.win-textbox-action-button:active) {
  color: var(--text-tertiary, var(--text-fill-color-tertiary, rgba(0, 0, 0, 0.45)));
}

:slotted(.win-textbox-action-button:disabled) {
  color: var(--text-disabled, var(--text-fill-color-disabled, rgba(0, 0, 0, 0.36)));
  cursor: default;
}

.win-textbox-delete-button-layout {
  position: absolute;
  inset: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  box-sizing: border-box;
}

.win-textbox-delete-button,
:slotted(.win-textbox-action-button) {
  display: block;
}

:deep(.win-textbox-action-button > span) {
  position: absolute;
  inset: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  box-sizing: border-box;
}

:deep(.win-textbox-action-button.win-textbox-action-query > span) {
  inset: 4px;
}

:deep(.win-textbox-action-button:hover > span),
.win-textbox-delete-button:hover .win-textbox-delete-button-layout {
  background: var(--subtle-fill-color-secondary, var(--subtle-secondary, rgba(0, 0, 0, 0.06)));
}

:deep(.win-textbox-action-button:active > span),
.win-textbox-delete-button:active .win-textbox-delete-button-layout {
  background: var(--subtle-fill-color-tertiary, var(--subtle-tertiary, rgba(0, 0, 0, 0.03)));
  color: var(--text-tertiary, var(--text-fill-color-tertiary, rgba(0, 0, 0, 0.45)));
}

.win-textbox-delete-glyph {
  display: block;
  font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets", sans-serif;
  font-size: 12px;
  line-height: 12px;
}

.win-textbox-field::placeholder {
  color: var(--text-tertiary, var(--text-fill-color-tertiary, rgba(0, 0, 0, 0.45)));
  opacity: 1;
}

.win-textbox-field::selection {
  color: var(--accent-text, #ffffff);
  background: var(--textbox-selection-background, var(--accent-base, var(--accent-default, #0067c0)));
}

.win-textbox-description {
  margin-top: 6px;
  color: var(--text-secondary, var(--text-fill-color-secondary, rgba(0, 0, 0, 0.62)));
  font-size: 12px;
  line-height: 16px;
}

.win-textbox.is-readonly .win-textbox-border {
  background: var(--control-fill-color-tertiary, var(--ctrl-fill-tertiary, rgba(249, 249, 249, 0.3)));
}

.win-textbox.is-disabled {
  pointer-events: none;
}

.win-textbox.is-disabled .win-textbox-border {
  background: var(--textbox-background-disabled);
  border-color: var(--textbox-border-top);
  border-bottom-color: var(--ctrl-strong-stroke-disabled, rgba(0, 0, 0, 0.22));
}

.win-textbox.is-disabled .win-textbox-header,
.win-textbox.is-disabled .win-textbox-description,
.win-textbox.is-disabled .win-textbox-field {
  color: var(--text-disabled, var(--text-fill-color-disabled, rgba(0, 0, 0, 0.36)));
}

.win-textbox.is-disabled .win-textbox-field::placeholder {
  color: var(--text-disabled, var(--text-fill-color-disabled, rgba(0, 0, 0, 0.36)));
}
</style>
