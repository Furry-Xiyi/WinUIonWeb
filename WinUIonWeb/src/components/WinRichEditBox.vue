<template>
  <WinTextBox
    class="win-rich-edit-box"
    :style="rootStyle"
    :Header="Header"
    :Description="Description"
    :AcceptsReturn="AcceptsReturn"
    :IsReadOnly="IsReadOnly"
    :IsEnabled="IsEnabled"
    :MaxLength="MaxLength"
    :TextWrapping="TextWrapping"
    :TextAlignment="TextAlignment"
    :IsSpellCheckEnabled="IsSpellCheckEnabled"
    :IsTextPredictionEnabled="IsTextPredictionEnabled"
    :InputScope="InputScope"
    :CharacterCasing="CharacterCasing"
    :SelectionHighlightColor="SelectionHighlightColor"
    :PreventKeyboardDisplayOnProgrammaticFocus="PreventKeyboardDisplayOnProgrammaticFocus"
    :ShowDeleteButton="false"
    @pointerdown.capture="onRootPointerDown"
    @contextmenu.capture="onRootContextMenu">
    <template v-if="Header || $slots.header" #header>
      <slot name="header">{{ Header }}</slot>
    </template>

    <template #field="{ onFocus: setTextBoxFocused, onBlur: setTextBoxBlurred, onPointerEnter, onPointerLeave }">
      <WinScrollViewer
        class="win-reb-editor-scroll"
        :style="editorScrollStyle"
        VerticalScrollMode="Auto"
        VerticalScrollBarVisibility="Auto"
        HorizontalScrollMode="Auto"
        HorizontalScrollBarVisibility="Auto"
        @pointerdown="onEditorSurfacePointerDown"
        @contextmenu="onEditorSurfaceContextMenu">
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
          @focus="onEditorFocus(setTextBoxFocused)"
          @blur="onEditorBlur(setTextBoxBlurred)"
          @keydown="onKeydown"
          @paste="onPaste"
          @copy="onCopy"
          @cut="onCut"
          @contextmenu="onContextMenu"
          @mouseup="onSelectionGesture"
          @keyup="onSelectionGesture"
          @pointerenter="onPointerEnter"
          @pointerleave="onPointerLeave"></div>
      </WinScrollViewer>
    </template>

    <template v-if="Description || $slots.description" #description>
      <slot name="description">{{ Description }}</slot>
    </template>
  </WinTextBox>

  <WinCommandBarFlyout
    :Open="commandBarOpen"
    :AnchorRect="commandBarAnchor"
    :PrimaryCommands="commandBarPrimaryCommands"
    :SecondaryCommands="commandBarSecondaryCommands"
    Placement="Auto"
    ShowMode="Standard"
    :ShowPrimaryLabels="true"
    @Close="commandBarOpen = false" />
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { CSSProperties } from 'vue';
import WinCommandBarFlyout from './WinCommandBarFlyout.vue';
import WinScrollViewer from './WinScrollViewer.vue';
import WinTextBox from './WinTextBox.vue';
import { useI18n } from './i18n/index';

const { t } = useI18n();

type TextAlignment = 'Left' | 'Center' | 'Right' | 'Justify';
type TextWrapping = 'NoWrap' | 'Wrap' | 'WrapWholeWords';
type CharacterCasing = 'Normal' | 'Lower' | 'Upper';
type ClipboardCopyFormat = 'AllFormats' | 'PlainText';
type TextReadingOrder = 'Default' | 'DetectFromContent' | 'UseFlowDirection';
type CandidateWindowAlignment = 'Default' | 'BottomEdge';
type HeaderPlacement = 'Top' | 'Left';
type DisabledFormattingAccelerators = 'None' | 'Bold' | 'Italic' | 'Underline' | 'All' | string;
type CommandBarFlyoutCommand = {
  Name?: string;
  Label: string;
  Icon?: string;
  Click?: (command: CommandBarFlyoutCommand, event: MouseEvent) => void;
  'ToolTipService.ToolTip'?: string;
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
  DisabledFormattingAccelerators?: DisabledFormattingAccelerators;
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
  PrimaryCommands?: CommandBarFlyoutCommand[];
  SecondaryCommands?: CommandBarFlyoutCommand[];
  TextAlignment?: TextAlignment;
  TextReadingOrder?: TextReadingOrder;
  TextWrapping?: TextWrapping;
  Width?: number | string;
  Height?: number | string;
  MinHeight?: number | string;
}>(), {
  Text: '',
  Html: '',
  AcceptsReturn: true,
  CharacterCasing: 'Normal',
  ClipboardCopyFormat: 'AllFormats',
  Description: '',
  DesiredCandidateWindowAlignment: 'Default',
  DisabledFormattingAccelerators: 'None',
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
  PrimaryCommands: () => [],
  SecondaryCommands: () => [],
  TextAlignment: 'Left',
  TextReadingOrder: 'DetectFromContent',
  TextWrapping: 'Wrap',
  Width: '',
  Height: '',
  MinHeight: ''
});

const emit = defineEmits<{
  'update:Text': [value: string];
  'update:Html': [value: string];
  TextChanged: [];
  SelectionChanged: [];
  SelectionChanging: [args: { SelectionStart: number; SelectionLength: number; Cancel: boolean }];
  ContextMenuOpening: [args: { Handled: boolean; CursorLeft: number; CursorTop: number }];
  Paste: [args: { Handled: boolean }];
  CopyingToClipboard: [args: { Handled: boolean }];
  CuttingToClipboard: [args: { Handled: boolean }];
  TextChanging: [args: { IsContentChanging: boolean }];
  TextCompositionStarted: [];
  TextCompositionChanged: [];
  TextCompositionEnded: [];
  CandidateWindowBoundsChanged: [args: { rect: DOMRect | { x: number; y: number; width: number; height: number } }];
  GotFocus: [];
  LostFocus: [];
}>();

const editorRef = ref<HTMLDivElement | null>(null);
const isFocused = ref(false);
const commandBarOpen = ref(false);
const commandBarAnchor = ref<DOMRect | { x: number; y: number; top: number; bottom: number; left: number; right: number; width: number; height: number } | null>(null);
const internalHtml = ref(props.Html || escapeText(props.Text));
const savedSelection = ref<Range | null>(null);

const disabledFormatting = computed(() => props.DisabledFormattingAccelerators.toLowerCase());
const isFormattingDisabled = (command: 'bold' | 'italic' | 'underline') => {
  return disabledFormatting.value.includes('all') || disabledFormatting.value.includes(command);
};
const commandBarPrimaryCommands = computed<CommandBarFlyoutCommand[]>(() => {
  const commands: CommandBarFlyoutCommand[] = [];
  if (props.ShowFormattingCommands) {
    if (!isFormattingDisabled('bold')) commands.push({
      Name: 'BoldButton',
      Label: t('text.bold'),
      Icon: 'Bold',
      'ToolTipService.ToolTip': t('text.bold'),
      Click: () => void runTextCommand('bold'),
      IsToggle: true,
      IsChecked: isCommandActive('bold')
    });
    if (!isFormattingDisabled('italic')) commands.push({
      Name: 'ItalicButton',
      Label: t('text.italic'),
      Icon: 'Italic',
      'ToolTipService.ToolTip': t('text.italic'),
      Click: () => void runTextCommand('italic'),
      IsToggle: true,
      IsChecked: isCommandActive('italic')
    });
    if (!isFormattingDisabled('underline')) commands.push({
      Name: 'UnderlineButton',
      Label: t('text.underline'),
      Icon: 'Underline',
      'ToolTipService.ToolTip': t('text.underline'),
      Click: () => void runTextCommand('underline'),
      IsToggle: true,
      IsChecked: isCommandActive('underline')
    });
  }
  commands.push(...props.PrimaryCommands);
  return commands;
});

const commandBarSecondaryCommands = computed<CommandBarFlyoutCommand[]>(() => {
  const selected = getSelectionText();
  const canEdit = !props.IsReadOnly && props.IsEnabled;
  const commands: CommandBarFlyoutCommand[] = [];
  if (selected && canEdit) commands.push({ Name: 'CutButton', Label: t('text.cut'), Icon: 'Cut', Click: () => void runTextCommand('cut') });
  if (selected) commands.push({ Name: 'CopyButton', Label: t('text.copy'), Icon: 'Copy', Click: () => void runTextCommand('copy') });
  if (canEdit) commands.push({ Name: 'PasteButton', Label: t('text.paste'), Icon: 'Paste', Click: () => void runTextCommand('paste') });
  commands.push({ Name: 'UndoButton', Label: t('text.undo'), Icon: 'Undo', Click: () => void runTextCommand('undo') });
  commands.push({ Name: 'RedoButton', Label: t('text.redo'), Icon: 'Redo', Click: () => void runTextCommand('redo') });
  commands.push({ Name: 'SelectAllButton', Label: t('text.select-all'), Icon: 'SelectAll', Click: () => void runTextCommand('selectAll') });
  if (props.ShowFormattingCommands && canEdit) {
    commands.push({ Name: 'BulletsButton', Label: t('text.bullets'), Icon: '\uE8FD', Click: () => void runTextCommand('insertUnorderedList') });
    commands.push({ Name: 'NumberingButton', Label: t('text.numbering'), Icon: '\uE8EF', Click: () => void runTextCommand('insertOrderedList') });
    commands.push({ Name: 'ClearFormattingButton', Label: t('text.clear-formatting'), Icon: '\uE894', Click: () => void runTextCommand('removeFormat') });
  }
  commands.push(...props.SecondaryCommands);
  return commands;
});

const cssSize = (value: number | string) => value === '' ? undefined : typeof value === 'number' ? `${value}px` : value;
const rootStyle = computed<CSSProperties & Record<string, string | undefined>>(() => ({
  width: cssSize(props.Width),
  '--reb-selection-background-blur': props.SelectionHighlightColorWhenNotFocused || undefined
}));

const editorScrollStyle = computed<CSSProperties>(() => ({
  height: cssSize(props.Height),
  minHeight: cssSize(props.MinHeight) || '118px'
}));

const editorStyle = computed<CSSProperties>(() => ({
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
  emit('TextChanging', { IsContentChanging: true });
  emit('update:Text', text);
  emit('update:Html', internalHtml.value);
  emit('TextChanged');
};

const emitSelection = () => {
  const text = getSelectionText();
  const changingArgs = { SelectionStart: 0, SelectionLength: text.length, Cancel: false };
  emit('SelectionChanging', changingArgs);
  if (changingArgs.Cancel) return;
  emit('SelectionChanged');
};

const onSelectionGesture = async () => {
  saveSelection();
  emitSelection();
  await nextTick();
  updateSelectionFlyout();
};

const isEditorSurfaceChrome = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest('.scrollbar, .scrollbar-button, .scrollbar-thumb, .scrollbar-track'));
};

const isInsideEditor = (target: EventTarget | null) => (
  target instanceof Node && Boolean(editorRef.value?.contains(target))
);

const onEditorSurfacePointerDown = (event: PointerEvent) => {
  if (event.button !== 0 || isEditorSurfaceChrome(event.target) || isInsideEditor(event.target)) return;
  focus();
};

const isEditorTextBoxSurface = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return false;
  if (isEditorSurfaceChrome(target) || isInsideEditor(target)) return false;
  if (target.closest('.win-textbox-header, .win-textbox-description')) return false;
  if (target.closest('button, a, input, textarea, select, [role="button"]')) return false;
  return Boolean(target.closest('.win-textbox-border, .win-textbox-content, .win-reb-editor-scroll, .win-scroll-viewer-viewport, .scroll-content'));
};

const onRootPointerDown = (event: PointerEvent) => {
  if (event.button !== 0 || !isEditorTextBoxSurface(event.target)) return;
  focus();
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
  if (key === 'b' && !isFormattingDisabled('bold')) {
    event.preventDefault();
    runTextCommand('bold');
  }
  if (key === 'i' && !isFormattingDisabled('italic')) {
    event.preventDefault();
    runTextCommand('italic');
  }
  if (key === 'u' && !isFormattingDisabled('underline')) {
    event.preventDefault();
    runTextCommand('underline');
  }
};

const onEditorSurfaceContextMenu = (event: MouseEvent) => {
  if (isEditorSurfaceChrome(event.target) || isInsideEditor(event.target)) return;
  focus();
  onContextMenu(event);
};

const onRootContextMenu = (event: MouseEvent) => {
  if (!isEditorTextBoxSurface(event.target)) return;
  event.stopPropagation();
  focus();
  onContextMenu(event);
};

const onPaste = (event: ClipboardEvent) => {
  const args = { Handled: false };
  emit('Paste', args);
  if (args.Handled) event.preventDefault();
};

const onCopy = (event: ClipboardEvent) => {
  const args = { Handled: false };
  emit('CopyingToClipboard', args);
  if (args.Handled) event.preventDefault();
  const selectedText = getSelectionText();
  if (props.ClipboardCopyFormat === 'PlainText' && selectedText) {
    event.clipboardData?.setData('text/plain', selectedText);
    event.preventDefault();
  }
};

const onCut = (event: ClipboardEvent) => {
  const args = { Handled: false };
  emit('CuttingToClipboard', args);
  if (args.Handled) event.preventDefault();
};

const onContextMenu = (event: MouseEvent) => {
  const args = { Handled: false, CursorLeft: event.clientX, CursorTop: event.clientY };
  emit('ContextMenuOpening', args);
  if (args.Handled) return;
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

const onEditorFocus = (setTextBoxFocused?: () => void) => {
  setTextBoxFocused?.();
  isFocused.value = true;
  emit('GotFocus');
};

const onEditorBlur = (setTextBoxBlurred?: () => void) => {
  setTextBoxBlurred?.();
  isFocused.value = false;
  emit('LostFocus');
};

const focus = () => {
  if (!props.IsEnabled || props.IsReadOnly) return;
  editorRef.value?.focus({ preventScroll: props.PreventKeyboardDisplayOnProgrammaticFocus });
};

const hasSelection = () => {
  const selection = window.getSelection();
  if (selection?.rangeCount && editorRef.value?.contains(selection.anchorNode)) {
    return !selection.getRangeAt(0).collapsed;
  }
  return Boolean(savedSelection.value && !savedSelection.value.collapsed);
};

const queryCommandState = (command: string) => {
  focus();
  restoreSelection();
  try {
    return document.queryCommandState(command);
  } catch {
    return false;
  }
};

const execCommand = (command: string, value?: string) => {
  focus();
  restoreSelection();
  document.execCommand(command, false, value);
  saveSelection();
  onInput();
};

const setListStyleType = (styleType: string) => {
  const editor = editorRef.value;
  if (!editor) return;
  editor.querySelectorAll('ol, ul').forEach((list) => {
    if (list instanceof HTMLElement) {
      list.style.listStyleType = styleType;
    }
    if (list instanceof HTMLOListElement) {
      if (styleType === 'upper-roman') list.type = 'I';
      else if (styleType === 'decimal') list.type = '1';
    }
  });
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
  queryCommandState,
  hasSelection,
  setText,
  setHtml,
  setListStyleType,
  getText: plainText,
  getHtml: () => editorRef.value?.innerHTML ?? '',
  Document: {
    getText: plainText,
    setText,
    setHtml,
    getHtml: () => editorRef.value?.innerHTML ?? ''
  },
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
  --rich-edit-box-min-height: 120px;
}

.win-rich-edit-box :deep(.win-textbox-border) {
  min-height: var(--rich-edit-box-min-height);
  cursor: text;
}

.win-rich-edit-box :deep(.win-textbox-content) {
  min-height: calc(var(--rich-edit-box-min-height) - 2px);
  cursor: text;
}

.win-reb-editor-scroll {
  flex: 1;
  min-width: 0;
  min-height: 118px;
  cursor: text;
}

.win-reb-editor-scroll :deep(.win-scroll-viewer-viewport),
.win-reb-editor-scroll :deep(.scroll-content) {
  height: 100%;
  min-height: 100%;
  cursor: text;
}

.win-reb-editor-scroll :deep(.scroll-content) {
  display: flex;
}

.win-reb-editor {
  flex: 1 1 auto;
  width: 100%;
  min-height: max(118px, 100%);
  padding: 5px 6px 6px 10px;
  box-sizing: border-box;
  outline: 0;
  color: var(--textbox-foreground);
  font-family: "Segoe UI", system-ui, sans-serif;
  font-size: 14px;
  line-height: 20px;
  user-select: text;
}

.win-reb-editor :deep(ul),
.win-reb-editor :deep(ol) {
  margin-block: 0;
  padding-inline-start: 24px;
}

.win-reb-editor :deep(li) {
  margin-block: 0;
  padding-inline-start: 0;
}

.win-reb-editor:empty::before {
  content: attr(data-placeholder);
  color: var(--textbox-placeholder-foreground);
  pointer-events: none;
}

.win-reb-editor::selection {
  background-color: var(--textbox-selection-background, Highlight);
  color: HighlightText;
}

.win-rich-edit-box:not(.is-focused) .win-reb-editor::selection {
  background-color: var(--reb-selection-background-blur, var(--textbox-selection-background, Highlight));
  color: HighlightText;
}

.win-rich-edit-box.is-hovered:not(.is-disabled) .win-reb-editor {
  color: var(--textbox-foreground-pointer-over);
}

.win-rich-edit-box.is-hovered:not(.is-disabled) .win-reb-editor:empty::before {
  color: var(--textbox-placeholder-foreground-pointer-over);
}

.win-rich-edit-box.is-focused:not(.is-disabled) .win-reb-editor {
  color: var(--textbox-foreground-focused);
}

.win-rich-edit-box.is-focused:not(.is-disabled) .win-reb-editor:empty::before {
  color: var(--textbox-placeholder-foreground-focused);
}

.win-rich-edit-box.is-disabled .win-reb-editor {
  color: var(--textbox-foreground-disabled);
}

.win-rich-edit-box.is-disabled .win-reb-editor:empty::before {
  color: var(--textbox-placeholder-foreground-disabled);
}

</style>
