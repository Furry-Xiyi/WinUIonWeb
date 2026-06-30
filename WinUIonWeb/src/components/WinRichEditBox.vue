<template>
  <div class="win-richeditbox-container" :class="containerClasses">
    <!-- Header -->
    <div v-if="header || $slots.header" class="richeditbox-header">
      <slot name="header">{{ header }}</slot>
    </div>

    <!-- Main RichEditBox -->
    <div class="win-richeditbox" :class="stateClasses" @click="focusEditor">
      <!-- Toolbar (optional, shown when not readonly) -->
      <div v-if="showToolbar && !isReadOnly" class="richeditbox-toolbar">
        <button
          v-for="tool in toolbarButtons"
          :key="tool.command"
          class="toolbar-button"
          :class="{ 'is-active': isFormatActive(tool.command) }"
          :title="tool.title"
          @mousedown.prevent="execCommand(tool.command, tool.value)"
          :disabled="disabled"
        >
          <span class="toolbar-icon" v-html="tool.icon"></span>
        </button>
      </div>

      <!-- Editor Content -->
      <div
        ref="editorRef"
        class="richeditbox-editor"
        :contenteditable="!isReadOnly && !disabled"
        :data-placeholder="placeholderText"
        @input="handleInput"
        @keydown="handleKeyDown"
        @focus="handleFocus"
        @blur="handleBlur"
        @paste="handlePaste"
        @select="handleSelectionChange"
        @mouseup="handleSelectionChange"
        @keyup="handleSelectionChange"
        role="textbox"
        :aria-label="ariaLabel"
        :aria-readonly="isReadOnly"
        :aria-disabled="disabled"
        :aria-multiline="acceptsReturn"
        :aria-placeholder="placeholderText"
      ></div>
    </div>

    <!-- Description -->
    <div v-if="description || $slots.description" class="richeditbox-description">
      <slot name="description">{{ description }}</slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  isReadOnly: { type: Boolean, default: false },
  acceptsReturn: { type: Boolean, default: true },
  textAlignment: {
    type: String,
    default: 'Left',
    validator: (v) => ['Left', 'Center', 'Right', 'Justify'].includes(v)
  },
  textWrapping: {
    type: String,
    default: 'Wrap',
    validator: (v) => ['NoWrap', 'Wrap', 'WrapWholeWords'].includes(v)
  },
  isSpellCheckEnabled: { type: Boolean, default: true },
  placeholderText: { type: String, default: '' },
  header: { type: String, default: '' },
  description: { type: String, default: '' },
  maxLength: { type: Number, default: 0 }, // 0 = unlimited
  characterCasing: {
    type: String,
    default: 'Normal',
    validator: (v) => ['Normal', 'Lower', 'Upper'].includes(v)
  },
  disabled: { type: Boolean, default: false },
  showToolbar: { type: Boolean, default: true },
  ariaLabel: { type: String, default: 'Rich text editor' }
});

const emit = defineEmits([
  'update:modelValue',
  'textChanged',
  'selectionChanged',
  'contextMenuOpening',
  'paste',
  'textCompositionStarted',
  'textCompositionChanged',
  'textCompositionEnded',
  'gotFocus',
  'lostFocus'
]);

const editorRef = ref(null);
const isFocused = ref(false);
const isComposing = ref(false);
const currentSelection = ref(null);

// Toolbar configuration
const toolbarButtons = [
  { command: 'bold', title: 'Bold (Ctrl+B)', icon: '<strong>B</strong>' },
  { command: 'italic', title: 'Italic (Ctrl+I)', icon: '<em>I</em>' },
  { command: 'underline', title: 'Underline (Ctrl+U)', icon: '<u>U</u>' },
  { command: 'strikeThrough', title: 'Strikethrough', icon: '<s>S</s>' },
  { command: 'separator-1', title: '', icon: '' },
  { command: 'justifyLeft', title: 'Align Left', icon: '☰' },
  { command: 'justifyCenter', title: 'Align Center', icon: '☰' },
  { command: 'justifyRight', title: 'Align Right', icon: '☰' },
  { command: 'separator-2', title: '', icon: '' },
  { command: 'insertOrderedList', title: 'Numbered List', icon: '1.' },
  { command: 'insertUnorderedList', title: 'Bulleted List', icon: '•' },
  { command: 'separator-3', title: '', icon: '' },
  { command: 'removeFormat', title: 'Clear Formatting', icon: '✕' }
];

// Computed classes
const containerClasses = computed(() => ({
  'is-disabled': props.disabled,
  'is-readonly': props.isReadOnly
}));

const stateClasses = computed(() => ({
  'is-focused': isFocused.value,
  'is-disabled': props.disabled,
  'is-readonly': props.isReadOnly,
  [`text-align-${props.textAlignment.toLowerCase()}`]: true,
  [`text-wrap-${props.textWrapping.toLowerCase()}`]: true
}));

// Initialize editor content
const initializeContent = () => {
  if (editorRef.value && props.modelValue !== editorRef.value.innerHTML) {
    editorRef.value.innerHTML = props.modelValue;
  }
};

// Handle input
const handleInput = (e) => {
  if (isComposing.value) return;

  let content = editorRef.value.innerHTML;

  // Apply character casing
  if (props.characterCasing !== 'Normal') {
    const selection = saveSelection();
    if (props.characterCasing === 'Upper') {
      editorRef.value.innerHTML = content.toUpperCase();
    } else if (props.characterCasing === 'Lower') {
      editorRef.value.innerHTML = content.toLowerCase();
    }
    restoreSelection(selection);
    content = editorRef.value.innerHTML;
  }

  // Check max length
  if (props.maxLength > 0) {
    const textLength = editorRef.value.innerText.length;
    if (textLength > props.maxLength) {
      editorRef.value.innerHTML = props.modelValue;
      return;
    }
  }

  emit('update:modelValue', content);
  emit('textChanged', { newText: content, source: editorRef.value });
};

// Handle keyboard events
const handleKeyDown = (e) => {
  // Handle AcceptsReturn
  if (e.key === 'Enter' && !props.acceptsReturn && !e.shiftKey) {
    e.preventDefault();
    return;
  }

  // Keyboard shortcuts
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case 'b':
        e.preventDefault();
        execCommand('bold');
        break;
      case 'i':
        e.preventDefault();
        execCommand('italic');
        break;
      case 'u':
        e.preventDefault();
        execCommand('underline');
        break;
    }
  }
};

// Handle composition events (IME input)
const handleCompositionStart = () => {
  isComposing.value = true;
  emit('textCompositionStarted');
};

const handleCompositionUpdate = () => {
  emit('textCompositionChanged');
};

const handleCompositionEnd = () => {
  isComposing.value = false;
  emit('textCompositionEnded');
  handleInput();
};

// Handle focus
const handleFocus = (e) => {
  if (props.disabled || props.isReadOnly) return;
  isFocused.value = true;
  emit('gotFocus', e);
};

const handleBlur = (e) => {
  isFocused.value = false;
  emit('lostFocus', e);
};

// Handle paste
const handlePaste = (e) => {
  emit('paste', {
    originalEvent: e,
    clipboardData: e.clipboardData
  });

  // Allow default paste, but sanitize if needed
  if (props.maxLength > 0) {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const currentLength = editorRef.value.innerText.length;
    const remaining = props.maxLength - currentLength;
    if (remaining > 0) {
      document.execCommand('insertText', false, text.substring(0, remaining));
    }
  }
};

// Selection handling
const handleSelectionChange = () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    currentSelection.value = selection.getRangeAt(0);
    emit('selectionChanged', {
      selection: selection,
      range: currentSelection.value
    });
  }
};

const saveSelection = () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    return selection.getRangeAt(0);
  }
  return null;
};

const restoreSelection = (range) => {
  if (range) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

// Execute formatting command
const execCommand = (command, value = null) => {
  if (props.disabled || props.isReadOnly) return;

  editorRef.value?.focus();
  document.execCommand(command, false, value);

  nextTick(() => {
    handleInput();
  });
};

// Check if format is active
const isFormatActive = (command) => {
  if (!editorRef.value || props.isReadOnly) return false;

  try {
    return document.queryCommandState(command);
  } catch {
    return false;
  }
};

// Focus the editor
const focusEditor = () => {
  if (!props.disabled && !props.isReadOnly) {
    editorRef.value?.focus();
  }
};

// Public methods (exposed via defineExpose)
const getText = () => {
  return editorRef.value?.innerText || '';
};

const setText = (text) => {
  if (editorRef.value) {
    editorRef.value.innerText = text;
    handleInput();
  }
};

const getHtml = () => {
  return editorRef.value?.innerHTML || '';
};

const setHtml = (html) => {
  if (editorRef.value) {
    editorRef.value.innerHTML = html;
    handleInput();
  }
};

const clearFormatting = () => {
  execCommand('removeFormat');
};

const insertText = (text) => {
  execCommand('insertText', text);
};

// Watch for external content changes
watch(() => props.modelValue, (newValue) => {
  if (editorRef.value && newValue !== editorRef.value.innerHTML && !isFocused.value) {
    editorRef.value.innerHTML = newValue;
  }
});

// Lifecycle
onMounted(() => {
  initializeContent();

  // Add composition event listeners
  if (editorRef.value) {
    editorRef.value.addEventListener('compositionstart', handleCompositionStart);
    editorRef.value.addEventListener('compositionupdate', handleCompositionUpdate);
    editorRef.value.addEventListener('compositionend', handleCompositionEnd);
  }
});

onBeforeUnmount(() => {
  if (editorRef.value) {
    editorRef.value.removeEventListener('compositionstart', handleCompositionStart);
    editorRef.value.removeEventListener('compositionupdate', handleCompositionUpdate);
    editorRef.value.removeEventListener('compositionend', handleCompositionEnd);
  }
});

// Expose public methods
defineExpose({
  getText,
  setText,
  getHtml,
  setHtml,
  clearFormatting,
  insertText,
  focus: focusEditor,
  execCommand
});
</script>

<style scoped>
.win-richeditbox-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: var(--font-family);
}

.win-richeditbox-container.is-disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* Header */
.richeditbox-header {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-fill-color-primary);
  margin-bottom: 4px;
}

/* Main container */
.win-richeditbox {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--ctrl-strong-stroke);
  border-radius: 4px;
  background: var(--control-fill-color-default);
  transition: all var(--fast-duration) var(--fast-out-slow-in);
  overflow: hidden;
}

.win-richeditbox:hover:not(.is-disabled):not(.is-readonly) {
  background: var(--control-fill-color-secondary);
  border-color: var(--control-stroke-color-default);
}

.win-richeditbox.is-focused:not(.is-disabled):not(.is-readonly) {
  background: var(--ctrl-fill-input-active);
  border-color: var(--accent-fill-color-default);
  border-width: 2px;
  box-shadow: 0 0 0 1px var(--accent-fill-color-default);
}

.win-richeditbox.is-disabled {
  background: var(--control-fill-color-disabled);
  border-color: var(--ctrl-strong-stroke-disabled);
}

.win-richeditbox.is-readonly {
  background: var(--ctrl-fill-input-disabled);
}

/* Toolbar */
.richeditbox-toolbar {
  display: flex;
  gap: 2px;
  padding: 4px;
  border-bottom: 1px solid var(--divider-stroke);
  background: var(--layer-fill-alt);
  flex-wrap: wrap;
}

.toolbar-button {
  min-width: 32px;
  height: 32px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--text-fill-color-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--fast-duration) var(--fast-out-slow-in);
  font-size: 14px;
  font-weight: 600;
}

.toolbar-button:hover:not(:disabled) {
  background: var(--subtle-fill-color-secondary);
}

.toolbar-button:active:not(:disabled) {
  background: var(--subtle-fill-tertiary);
  transform: scale(0.98);
}

.toolbar-button.is-active {
  background: var(--subtle-fill-color-secondary);
  color: var(--accent-fill-color-default);
}

.toolbar-button:disabled {
  opacity: 0.4;
  cursor: default;
}

.toolbar-icon {
  display: block;
  line-height: 1;
}

/* Editor */
.richeditbox-editor {
  min-height: 120px;
  max-height: 400px;
  padding: 11px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-fill-color-primary);
  outline: none;
  word-wrap: break-word;
}

.richeditbox-editor:empty:before {
  content: attr(data-placeholder);
  color: var(--text-placeholder);
  pointer-events: none;
  display: block;
}

.is-disabled .richeditbox-editor {
  color: var(--text-fill-color-disabled);
}

/* Text alignment */
.text-align-left .richeditbox-editor {
  text-align: left;
}

.text-align-center .richeditbox-editor {
  text-align: center;
}

.text-align-right .richeditbox-editor {
  text-align: right;
}

.text-align-justify .richeditbox-editor {
  text-align: justify;
}

/* Text wrapping */
.text-wrap-nowrap .richeditbox-editor {
  white-space: nowrap;
  overflow-x: auto;
}

.text-wrap-wrap .richeditbox-editor {
  white-space: pre-wrap;
  word-break: break-word;
}

.text-wrap-wrapwholewords .richeditbox-editor {
  white-space: pre-wrap;
  word-break: keep-all;
}

/* Description */
.richeditbox-description {
  font-size: 12px;
  color: var(--text-fill-color-secondary);
  margin-top: 4px;
}

/* Scrollbar styling */
.richeditbox-editor::-webkit-scrollbar {
  width: 12px;
}

.richeditbox-editor::-webkit-scrollbar-track {
  background: transparent;
}

.richeditbox-editor::-webkit-scrollbar-thumb {
  background: var(--ctrl-strong-fill);
  border-radius: 6px;
  border: 3px solid transparent;
  background-clip: content-box;
}

.richeditbox-editor::-webkit-scrollbar-thumb:hover {
  background: var(--ctrl-strong-fill-tertiary);
  background-clip: content-box;
}

/* Content formatting */
.richeditbox-editor :deep(strong),
.richeditbox-editor :deep(b) {
  font-weight: 600;
}

.richeditbox-editor :deep(em),
.richeditbox-editor :deep(i) {
  font-style: italic;
}

.richeditbox-editor :deep(u) {
  text-decoration: underline;
}

.richeditbox-editor :deep(s),
.richeditbox-editor :deep(strike) {
  text-decoration: line-through;
}

.richeditbox-editor :deep(ul),
.richeditbox-editor :deep(ol) {
  margin: 0;
  padding-left: 24px;
}

.richeditbox-editor :deep(li) {
  margin: 4px 0;
}

.richeditbox-editor :deep(p) {
  margin: 0 0 8px 0;
}

.richeditbox-editor :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
