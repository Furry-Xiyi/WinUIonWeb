<template>
  <div
    ref="rootRef"
    class="win-rich-edit-box"
    :class="{ 'is-disabled': !IsEnabled, 'is-readonly': IsReadOnly, 'is-focused': isFocused }"
    :style="rootStyle">
    <div v-if="Header || $slots.header" class="win-reb-header">
      <slot name="header">{{ Header }}</slot>
    </div>

    <div class="win-reb-border" @click="focus">
      <div
        ref="editorRef"
        class="win-reb-editor"
        :contenteditable="IsEnabled && !IsReadOnly"
        :data-placeholder="PlaceholderText"
        :spellcheck="IsSpellCheckEnabled"
        :autocomplete="IsTextPredictionEnabled ? 'on' : 'off'"
        :style="editorStyle"
        role="textbox"
        aria-multiline="true"
        :aria-readonly="IsReadOnly"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
        @paste="onPaste"
        @copy="onCopy"
        @cut="onCut"
        @contextmenu="onContextMenu"
        @mouseup="onSelectionGesture"
        @keyup="onSelectionGesture"></div>
    </div>

    <div v-if="Description || $slots.description" class="win-reb-description">
      <slot name="description">{{ Description }}</slot>
    </div>

    <WinCommandBarFlyout
      :Open="commandBarOpen"
      :AnchorRect="commandBarAnchor"
      :PrimaryCommands="commandBarPrimaryCommands"
      :SecondaryCommands="commandBarSecondaryCommands"
      Placement="Auto"
      ShowMode="Standard"
      :ShowPrimaryLabels="true"
      @Close="commandBarOpen = false"
      @Command="onFlyoutCommand" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { CSSProperties } from 'vue';
import WinCommandBarFlyout from './WinCommandBarFlyout.vue';
import { useI18n } from './i18n/index';

const { t } = useI18n();

type TextAlignment = 'Left' | 'Center' | 'Right' | 'Justify';
type TextWrapping = 'NoWrap' | 'Wrap' | 'WrapWholeWords';
type CharacterCasing = 'Normal' | 'Lower' | 'Upper';
type ClipboardCopyFormat = 'AllFormats' | 'PlainText' | 'RichText';
type TextReadingOrder = 'Default' | 'DetectFromContent' | 'UseFlowDirection';
type CandidateWindowAlignment = 'Default' | 'BottomEdge';
type HeaderPlacement = 'Top' | 'Left';
type CommandBarFlyoutCommand = {
  Label: string;
  Icon?: string;
  Name?: string;
  Command?: string;
  ToolTip?: string;
  ToolTipServiceToolTip?: string;
  IsEnabled?: boolean;
  IsToggle?: boolean;
  IsChecked?: boolean;
};

const props = withDefaults(defineProps<{
  Text?: string;
  Html?: string;
  AcceptsReturn?: boolean;
  CharacterCasing?: CharacterCasing;
  ClipboardCopyFormat?: ClipboardCopyFormat;
  Description?: string;
  DesiredCandidateWindowAlignment?: CandidateWindowAlignment;
  DisabledFormattingAccelerators?: string;
  Header?: string;
  HeaderPlacement?: HeaderPlacement;
  HeaderTemplate?: unknown | null;
  HorizontalTextAlignment?: TextAlignment;
  InputScope?: string;
  IsColorFontEnabled?: boolean;
  IsReadOnly?: boolean;
  IsEnabled?: boolean;
  IsSpellCheckEnabled?: boolean;
  IsTextPredictionEnabled?: boolean;
  MaxLength?: number;
  PlaceholderText?: string;
  PreventKeyboardDisplayOnProgrammaticFocus?: boolean;
  ProofingMenuFlyout?: unknown | null;
  SelectionFlyout?: unknown | null;
  SelectionHighlightColor?: string;
  SelectionHighlightColorWhenNotFocused?: string;
  ShowFormattingCommands?: boolean;
  TextAlignment?: TextAlignment;
  TextReadingOrder?: TextReadingOrder;
  TextWrapping?: TextWrapping;
  Width?: number | string;
  Height?: number | string;
}>(), {
  Text: '',
  Html: '',
  AcceptsReturn: true,
  CharacterCasing: 'Normal',
  ClipboardCopyFormat: 'AllFormats',
  Description: '',
  DesiredCandidateWindowAlignment: 'Default',
  DisabledFormattingAccelerators: '',
  Header: '',
  HeaderPlacement: 'Top',
  HeaderTemplate: undefined,
  HorizontalTextAlignment: 'Left',
  InputScope: 'Default',
  IsColorFontEnabled: true,
  IsReadOnly: false,
  IsEnabled: true,
  IsSpellCheckEnabled: true,
  IsTextPredictionEnabled: true,
  MaxLength: 0,
  PlaceholderText: '',
  PreventKeyboardDisplayOnProgrammaticFocus: false,
  ProofingMenuFlyout: undefined,
  SelectionFlyout: undefined,
  SelectionHighlightColor: '',
  SelectionHighlightColorWhenNotFocused: '',
  ShowFormattingCommands: true,
  TextAlignment: 'Left',
  TextReadingOrder: 'DetectFromContent',
  TextWrapping: 'Wrap',
  Width: '',
  Height: ''
});

const emit = defineEmits<{
  'update:Text': [value: string];
  'update:Html': [value: string];
  TextChanged: [args: { text: string; html: string }];
  SelectionChanged: [args: { selectionStart: number; selectionLength: number; selectedText: string }];
  ContextMenuOpening: [args: { handled: boolean; x: number; y: number }];
  Paste: [args: { handled: boolean; text: string }];
  CopyingToClipboard: [args: { cancel: boolean; text: string }];
  CuttingToClipboard: [args: { cancel: boolean; text: string }];
  TextChanging: [args: { isContentChanging: boolean; text: string }];
  TextCompositionStarted: [];
  TextCompositionChanged: [];
  TextCompositionEnded: [];
  CandidateWindowBoundsChanged: [args: { rect: DOMRect | { x: number; y: number; width: number; height: number } }];
  GotFocus: [];
  LostFocus: [];
}>();

const rootRef = ref<HTMLElement | null>(null);
const editorRef = ref<HTMLDivElement | null>(null);
const isFocused = ref(false);
const commandBarOpen = ref(false);
const commandBarAnchor = ref<DOMRect | { x: number; y: number; top: number; bottom: number; left: number; right: number; width: number; height: number } | null>(null);
const internalHtml = ref(props.Html || escapeText(props.Text));
const savedSelection = ref<Range | null>(null);

const disabledFormatting = computed(() => props.DisabledFormattingAccelerators.toLowerCase());
const commandBarPrimaryCommands = computed<CommandBarFlyoutCommand[]>(() => {
  const commands: CommandBarFlyoutCommand[] = [];
  if (!props.ShowFormattingCommands) return commands;
  if (!disabledFormatting.value.includes('bold')) commands.push({ Label: t('text.bold'), Icon: 'Bold', Command: 'bold', IsToggle: true, IsChecked: isCommandActive('bold') });
  if (!disabledFormatting.value.includes('italic')) commands.push({ Label: t('text.italic'), Icon: 'Italic', Command: 'italic', IsToggle: true, IsChecked: isCommandActive('italic') });
  if (!disabledFormatting.value.includes('underline')) commands.push({ Label: t('text.underline'), Icon: 'Underline', Command: 'underline', IsToggle: true, IsChecked: isCommandActive('underline') });
  return commands;
});

const commandBarSecondaryCommands = computed<CommandBarFlyoutCommand[]>(() => {
  const selected = getSelectionText();
  const canEdit = !props.IsReadOnly && props.IsEnabled;
  const commands: CommandBarFlyoutCommand[] = [];
  if (selected && canEdit) commands.push({ Label: t('text.cut'), Icon: 'Cut', Command: 'cut' });
  if (selected) commands.push({ Label: t('text.copy'), Icon: 'Copy', Command: 'copy' });
  if (canEdit) commands.push({ Label: t('text.paste'), Icon: 'Paste', Command: 'paste' });
  commands.push({ Label: t('text.undo'), Icon: 'Undo', Command: 'undo' });
  commands.push({ Label: t('text.redo'), Icon: 'Redo', Command: 'redo' });
  commands.push({ Label: t('text.select-all'), Icon: 'SelectAll', Command: 'selectAll' });
  if (props.ShowFormattingCommands && canEdit) {
    commands.push({ Label: t('text.bullets'), Icon: '\uE8FD', Command: 'insertUnorderedList' });
    commands.push({ Label: t('text.numbering'), Icon: '\uE8EF', Command: 'insertOrderedList' });
    commands.push({ Label: t('text.clear-formatting'), Icon: '\uE894', Command: 'removeFormat' });
  }
  return commands;
});

const cssSize = (value: number | string) => value === '' ? undefined : typeof value === 'number' ? `${value}px` : value;
const rootStyle = computed<CSSProperties & Record<string, string | undefined>>(() => ({
  width: cssSize(props.Width),
  '--reb-selection-background': props.SelectionHighlightColor || undefined,
  '--reb-selection-background-blur': props.SelectionHighlightColorWhenNotFocused || undefined
}));

const editorStyle = computed<CSSProperties>(() => ({
  height: cssSize(props.Height),
  textAlign: (props.TextAlignment || props.HorizontalTextAlignment || 'Left').toLowerCase() as CSSProperties['textAlign'],
  whiteSpace: props.TextWrapping === 'NoWrap' ? 'pre' : 'pre-wrap',
  overflowWrap: props.TextWrapping === 'WrapWholeWords' ? 'normal' : 'break-word',
  direction: props.TextReadingOrder === 'UseFlowDirection' ? 'inherit' : undefined
}));

function escapeText(value: string) {
  const div = document.createElement('div');
  div.innerText = value ?? '';
  return div.innerHTML;
}

const plainText = () => editorRef.value?.innerText.replace(/\n$/, '') ?? '';

const syncDom = () => {
  if (!editorRef.value || isFocused.value) return;
  editorRef.value.innerHTML = internalHtml.value;
};

const normalizeText = (value: string) => {
  let next = value;
  if (props.CharacterCasing === 'Upper') next = next.toUpperCase();
  if (props.CharacterCasing === 'Lower') next = next.toLowerCase();
  if (props.MaxLength > 0 && next.length > props.MaxLength) next = next.slice(0, props.MaxLength);
  return next;
};

const saveSelection = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0 && editorRef.value?.contains(selection.anchorNode)) {
    savedSelection.value = selection.getRangeAt(0).cloneRange();
  }
};

const restoreSelection = () => {
  const range = savedSelection.value;
  const selection = window.getSelection();
  if (!range || !selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
};

const getSelectionText = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !editorRef.value?.contains(selection.anchorNode)) return '';
  return selection.toString();
};

function isCommandActive(command: string) {
  try {
    restoreSelection();
    return document.queryCommandState(command);
  } catch {
    return false;
  }
}

const onInput = () => {
  const editor = editorRef.value;
  if (!editor) return;
  let text = normalizeText(plainText());
  if (text !== plainText()) {
    editor.innerText = text;
  }
  internalHtml.value = editor.innerHTML;
  emit('TextChanging', { isContentChanging: true, text });
  emit('update:Text', text);
  emit('update:Html', internalHtml.value);
  emit('TextChanged', { text, html: internalHtml.value });
};

const emitSelection = () => {
  const text = getSelectionText();
  emit('SelectionChanged', { selectionStart: 0, selectionLength: text.length, selectedText: text });
};

const onSelectionGesture = async () => {
  saveSelection();
  emitSelection();
  await nextTick();
  updateSelectionFlyout();
};

const updateSelectionFlyout = () => {
  if (!props.IsEnabled || props.SelectionFlyout === false) return;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !getSelectionText()) {
    commandBarOpen.value = false;
    return;
  }
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  commandBarAnchor.value = rect;
  commandBarOpen.value = commandBarPrimaryCommands.value.length > 0 || commandBarSecondaryCommands.value.length > 0;
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !props.AcceptsReturn) event.preventDefault();
  if (!(event.ctrlKey || event.metaKey)) return;
  const key = event.key.toLowerCase();
  const disabled = props.DisabledFormattingAccelerators.toLowerCase();
  if (key === 'b' && !disabled.includes('bold')) {
    event.preventDefault();
    runTextCommand('bold');
  }
  if (key === 'i' && !disabled.includes('italic')) {
    event.preventDefault();
    runTextCommand('italic');
  }
  if (key === 'u' && !disabled.includes('underline')) {
    event.preventDefault();
    runTextCommand('underline');
  }
};

const onPaste = (event: ClipboardEvent) => {
  const args = { handled: false, text: event.clipboardData?.getData('text/plain') ?? '' };
  emit('Paste', args);
  if (args.handled) event.preventDefault();
};

const onCopy = (event: ClipboardEvent) => {
  const args = { cancel: false, text: getSelectionText() };
  emit('CopyingToClipboard', args);
  if (args.cancel) event.preventDefault();
  if (props.ClipboardCopyFormat === 'PlainText' && args.text) {
    event.clipboardData?.setData('text/plain', args.text);
    event.preventDefault();
  }
};

const onCut = (event: ClipboardEvent) => {
  const args = { cancel: false, text: getSelectionText() };
  emit('CuttingToClipboard', args);
  if (args.cancel) event.preventDefault();
};

const onContextMenu = (event: MouseEvent) => {
  const args = { handled: false, x: event.clientX, y: event.clientY };
  emit('ContextMenuOpening', args);
  if (args.handled) return;
  event.preventDefault();
  saveSelection();
  commandBarAnchor.value = {
    x: event.clientX,
    y: event.clientY,
    top: event.clientY,
    bottom: event.clientY,
    left: event.clientX,
    right: event.clientX,
    width: 0,
    height: 0
  };
  commandBarOpen.value = commandBarPrimaryCommands.value.length > 0 || commandBarSecondaryCommands.value.length > 0;
};

const runTextCommand = async (command: string) => {
  if (!props.IsEnabled) return;
  restoreSelection();
  if (command === 'copy') document.execCommand('copy');
  else if (command === 'cut' && !props.IsReadOnly) document.execCommand('cut');
  else if (command === 'paste' && !props.IsReadOnly) {
    const text = await navigator.clipboard?.readText().catch(() => '');
    if (text) document.execCommand('insertText', false, text);
  } else if (command === 'selectAll') {
    const range = document.createRange();
    if (editorRef.value) {
      range.selectNodeContents(editorRef.value);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      saveSelection();
    }
  } else if (command === 'undo') {
    document.execCommand('undo');
  } else if (command === 'redo') {
    document.execCommand('redo');
  } else if (!props.IsReadOnly) {
    document.execCommand(command, false);
  }
  commandBarOpen.value = false;
  onInput();
  updateSelectionFlyout();
};

const onFlyoutCommand = (item: CommandBarFlyoutCommand) => {
  if (item?.Command) void runTextCommand(item.Command);
};

const onFocus = () => {
  isFocused.value = true;
  emit('GotFocus');
};

const onBlur = () => {
  isFocused.value = false;
  emit('LostFocus');
};

const focus = () => {
  if (!props.IsEnabled || props.IsReadOnly) return;
  editorRef.value?.focus({ preventScroll: props.PreventKeyboardDisplayOnProgrammaticFocus });
};

const execCommand = (command: string, value?: string) => {
  focus();
  document.execCommand(command, false, value);
  onInput();
};

const setText = (value: string) => {
  internalHtml.value = escapeText(value);
  if (editorRef.value) editorRef.value.innerText = value;
  onInput();
};

const setHtml = (value: string) => {
  internalHtml.value = value;
  if (editorRef.value) editorRef.value.innerHTML = value;
  onInput();
};

const onCompositionStart = () => emit('TextCompositionStarted');
const onCompositionUpdate = () => emit('TextCompositionChanged');
const onCompositionEnd = () => emit('TextCompositionEnded');

watch(() => props.Text, (value) => {
  if (props.Html) return;
  internalHtml.value = escapeText(value ?? '');
  syncDom();
});

watch(() => props.Html, (value) => {
  internalHtml.value = value ?? '';
  syncDom();
});

onMounted(() => {
  syncDom();
  editorRef.value?.addEventListener('compositionstart', onCompositionStart);
  editorRef.value?.addEventListener('compositionupdate', onCompositionUpdate);
  editorRef.value?.addEventListener('compositionend', onCompositionEnd);
});

onBeforeUnmount(() => {
  editorRef.value?.removeEventListener('compositionstart', onCompositionStart);
  editorRef.value?.removeEventListener('compositionupdate', onCompositionUpdate);
  editorRef.value?.removeEventListener('compositionend', onCompositionEnd);
});

defineExpose({
  focus,
  execCommand,
  setText,
  setHtml,
  getText: plainText,
  getHtml: () => editorRef.value?.innerHTML ?? '',
  TextDocument: {
    getText: plainText,
    setText,
    setHtml,
    getHtml: () => editorRef.value?.innerHTML ?? ''
  }
});
</script>

<style scoped>
.win-rich-edit-box {
  --reb-background: var(--control-fill-color-default, var(--ctrl-fill-default));
  --reb-background-hover: var(--control-fill-color-secondary, var(--ctrl-fill-secondary));
  --reb-background-focused: var(--control-fill-color-input-active, var(--ctrl-fill-input-active));
  --reb-border-top: var(--control-stroke-color-default, var(--ctrl-border-rest));
  --reb-border-bottom: var(--control-strong-stroke-color-default, var(--ctrl-strong-stroke));
  --reb-accent: var(--system-accent-color-dark-1, var(--accent-base));
  display: flex;
  flex-direction: column;
  width: 100%;
}

:global(html.theme-dark) .win-rich-edit-box,
:global(.example-theme-wrapper.theme-dark) .win-rich-edit-box {
  --reb-accent: var(--system-accent-color-light-2, var(--accent-base));
}

.win-reb-header {
  margin-bottom: 8px;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 20px;
}

.win-reb-border {
  overflow: hidden;
  min-height: 120px;
  background: var(--reb-background);
  border: 1px solid var(--reb-border-top);
  border-bottom-color: var(--reb-border-bottom);
  border-radius: 4px;
  transition: background 100ms, box-shadow 100ms;
}

.win-rich-edit-box:not(.is-disabled):not(.is-readonly) .win-reb-border:hover {
  background: var(--reb-background-hover);
}

.win-rich-edit-box.is-focused:not(.is-disabled) .win-reb-border {
  background: var(--reb-background-focused);
  border-bottom-color: var(--reb-border-top);
  box-shadow: inset 0 -2px 0 var(--reb-accent);
}

.win-reb-editor {
  min-height: 118px;
  padding: 8px 10px;
  box-sizing: border-box;
  outline: 0;
  overflow: auto;
  color: var(--text-primary);
  font-family: "Segoe UI", system-ui, sans-serif;
  font-size: 14px;
  line-height: 20px;
}

.win-reb-editor:empty::before {
  content: attr(data-placeholder);
  color: var(--text-tertiary);
  pointer-events: none;
}

.win-reb-editor::selection {
  color: var(--accent-text, #fff);
  background: var(--reb-selection-background, var(--accent-base));
}

.win-rich-edit-box:not(.is-focused) .win-reb-editor::selection {
  background: var(--reb-selection-background-blur, transparent);
}

.win-reb-description {
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 16px;
}

.win-rich-edit-box.is-disabled {
  pointer-events: none;
}

.win-rich-edit-box.is-disabled .win-reb-border {
  background: var(--control-fill-color-disabled, var(--ctrl-fill-disabled));
}

.win-rich-edit-box.is-disabled .win-reb-editor,
.win-rich-edit-box.is-disabled .win-reb-header,
.win-rich-edit-box.is-disabled .win-reb-description {
  color: var(--text-disabled);
}

</style>
