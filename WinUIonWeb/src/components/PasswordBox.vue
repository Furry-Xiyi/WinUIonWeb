<template>
  <TextBox
    class="win-password-box"
    Header="{x:Bind PasswordTemplate.Header, Mode=OneWay}"
    HeaderTemplate="{x:Bind PasswordTemplate.HeaderTemplate, Mode=OneWay}"
    Description="{x:Bind PasswordTemplate.Description, Mode=OneWay}"
    IsEnabled="{x:Bind PasswordTemplate.IsEnabled, Mode=OneWay}"
    Width="{x:Bind PasswordTemplate.Width, Mode=OneWay}"
    Height="{x:Bind PasswordTemplate.Height, Mode=OneWay}"
    MinWidth="{x:Bind PasswordTemplate.MinWidth, Mode=OneWay}"
    MaxWidth="{x:Bind PasswordTemplate.MaxWidth, Mode=OneWay}"
    Margin="{x:Bind PasswordTemplate.Margin, Mode=OneWay}"
    HorizontalAlignment="{x:Bind PasswordTemplate.HorizontalAlignment, Mode=OneWay}"
    VerticalAlignment="{x:Bind PasswordTemplate.VerticalAlignment, Mode=OneWay}"
    Padding="{x:Bind PasswordTemplate.Padding, Mode=OneWay}"
    CornerRadius="{x:Bind PasswordTemplate.CornerRadius, Mode=OneWay}"
    BorderBrush="{x:Bind PasswordTemplate.BorderBrush, Mode=OneWay}"
    BorderThickness="{x:Bind PasswordTemplate.BorderThickness, Mode=OneWay}"
  Background="{x:Bind PasswordTemplate.Background, Mode=OneWay}"
    FontFamily="{x:Bind PasswordTemplate.FontFamily, Mode=OneWay}"
    FontSize="{x:Bind PasswordTemplate.FontSize, Mode=OneWay}"
    FontWeight="{x:Bind PasswordTemplate.FontWeight, Mode=OneWay}"
    SelectionHighlightColor="{x:Bind PasswordTemplate.SelectionHighlightColor, Mode=OneWay}"
    v-bind="surfaceAttrs">
    <TextBox.Header v-if="headerNodes.length"><HeaderOutlet /></TextBox.Header>
    <TextBox.HeaderTemplate v-if="headerTemplateNodes.length"><HeaderTemplateOutlet /></TextBox.HeaderTemplate>
    <TextBox.Description v-if="descriptionNodes.length"><DescriptionOutlet /></TextBox.Description>
  </TextBox>
  <ContextMenu />
  <CustomFlyouts />
</template>

<script lang="ts">
const passwordProperty = (name: string) => defineComponent({ name: `PasswordBox.${name}`, __passwordProperty: name, setup: () => () => null });
export const PasswordBoxHeader = passwordProperty('Header');
export const PasswordBoxHeaderTemplate = passwordProperty('HeaderTemplate');
export const PasswordBoxDescription = passwordProperty('Description');
export const PasswordBoxContextFlyout = passwordProperty('ContextFlyout');
export const PasswordBoxSelectionFlyout = passwordProperty('SelectionFlyout');
export default { Header: PasswordBoxHeader, HeaderTemplate: PasswordBoxHeaderTemplate, Description: PasswordBoxDescription, ContextFlyout: PasswordBoxContextFlyout, SelectionFlyout: PasswordBoxSelectionFlyout };
</script>

<script setup lang="ts">
import { cloneVNode, computed, defineComponent, Fragment, getCurrentInstance, h, inject, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, useAttrs, useSlots, watch } from 'vue';
import TextBox from './TextBox.vue';
import { useI18n } from './i18n/index';
import { eventNames, normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime';
import { textInputTemplateKey } from './textInputTemplate';
import { getVNodeChildren } from './CollectionProperties';
import { textCommandFlyout } from './textCommandFlyout';

const rawProps = withDefaults(defineProps<{
  Password?: string; Header?: string; HeaderTemplate?: unknown; Description?: string; PlaceholderText?: string;
  ContextFlyout?: unknown; SelectionFlyout?: unknown;
  PasswordChar?: string; PasswordRevealMode?: string; MaxLength?: number | string;
  IsEnabled?: boolean | string; InputScope?: string; SelectionHighlightColor?: string;
  PreventKeyboardDisplayOnProgrammaticFocus?: boolean | string; Width?: number | string; Height?: number | string;
  MinWidth?: number | string; MaxWidth?: number | string; Margin?: number | string; Padding?: number | string;
  HorizontalAlignment?: string; VerticalAlignment?: string; Background?: string; BorderBrush?: string;
  BorderThickness?: number | string; CornerRadius?: number | string; FontFamily?: string; FontSize?: number | string;
  FontWeight?: number | string; Foreground?: string;
}>(), { Password: '', Header: '', Description: '', PlaceholderText: '', PasswordChar: '\u25CF', PasswordRevealMode: 'Peek', MaxLength: 0, IsEnabled: true,
  InputScope: 'Password', SelectionHighlightColor: '', Width: '', Height: '', MinWidth: 64, MaxWidth: '', Margin: '', Padding: '',
  HorizontalAlignment: '', VerticalAlignment: '', Background: '', BorderBrush: '', BorderThickness: 1, CornerRadius: 4,
  FontFamily: '', FontSize: 14, FontWeight: 400, Foreground: '' });
defineOptions({ inheritAttrs: false });
const instance = getCurrentInstance();
const attrs = useAttrs();
const slots = useSlots();
const { t } = useI18n();
const overrides = reactive<Record<string, unknown>>({});
const props = new Proxy(rawProps, { get: (target, key) => typeof key === 'string' && key in overrides ? overrides[key] : resolveXamlValue(Reflect.get(target,key), instance) });
const surfaceAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !eventNames.has(key) && !key.startsWith('on') && !key.startsWith('AutomationProperties.'))));
const propertyNodes = (name: string) => {
  const collect = (nodes: ReturnType<NonNullable<typeof slots.default>>): ReturnType<NonNullable<typeof slots.default>> => nodes.flatMap(node => node.type === Fragment ? collect(getVNodeChildren(node)) : (node.type as { __passwordProperty?: string })?.__passwordProperty === name ? getVNodeChildren(node) : []);
  return normalizeXamlNodes(collect(slots.default?.() ?? []), instance);
};
const headerNodes = computed(() => propertyNodes('Header'));
const headerTemplateNodes = computed(() => propertyNodes('HeaderTemplate'));
const descriptionNodes = computed(() => propertyNodes('Description'));
const HeaderOutlet = defineComponent({ setup: () => () => h(Fragment, headerNodes.value) });
const HeaderTemplateOutlet = defineComponent({ setup: () => () => h(Fragment, headerTemplateNodes.value) });
const DescriptionOutlet = defineComponent({ setup: () => () => h(Fragment, descriptionNodes.value) });
const emit = defineEmits(['update:Password', 'PasswordChanging', 'PasswordChanged', 'GotFocus', 'LostFocus', 'Paste', 'KeyDown', 'ContextMenuOpening']);
const dispatch = (name: 'PasswordChanging' | 'PasswordChanged' | 'GotFocus' | 'LostFocus' | 'Paste' | 'KeyDown' | 'ContextMenuOpening', args: unknown = { Handled: false }) => {
  const sender = instance?.exposeProxy ?? instance?.exposed ?? instance?.proxy;
  const listener = instance?.vnode.props?.[`on${name}`];
  if (listener) {
    for (const handler of Array.isArray(listener) ? listener : [listener]) if (typeof handler === 'function') handler(sender, args);
  } else {
    emit(name, sender, args);
    resolveXamlHandler(attrs[name], instance)?.(sender, args);
  }
};
const field = ref<HTMLInputElement | null>(null);
const contextMenu = ref<any>(null);
const customContext = ref<any>(null);
const customSelection = ref<any>(null);
const clipboard = ref('');
const contextSelection = ref({ start: 0, end: 0 });
const flyoutMode = ref('Standard');
let menuRequest = 0;
const CustomFlyouts = defineComponent({ setup: () => () => h(Fragment, ['ContextFlyout', 'SelectionFlyout'].flatMap(name =>
  propertyNodes(name).map(node => cloneVNode(node, { ref: (control: unknown) => {
    if (name === 'ContextFlyout') customContext.value = control;
    else customSelection.value = control;
  } }, true)))) });
const readClipboard = async () => { try { return await navigator.clipboard?.readText() ?? ''; } catch { return ''; } };
const pasteFromClipboard = async () => {
  if (!props.IsEnabled || !field.value) return;
  const args = { Handled: false };
  dispatch('Paste', args);
  if (args.Handled) return;
  const value = await readClipboard();
  if (!props.IsEnabled || !field.value?.isConnected) return;
  const start = contextSelection.value.start, end = contextSelection.value.end;
  replacePasswordRange(value, { value: password.value, start, end });
  field.value.focus({ preventScroll: true });
  const caret = Math.min(start + value.length, password.value.length);
  field.value.setSelectionRange(caret, caret);
};
const ContextMenu = textCommandFlyout(contextMenu, () => [
  ...(clipboard.value ? [{ Text: t('text.paste'), Value: 'paste' }] : []),
  ...(password.value ? [{ Text: t('text.select-all'), Value: 'selectAll' }] : [])
], command => {
  if (command.Value === 'paste') void pasteFromClipboard();
  else field.value?.select();
}, undefined, () => ({ ShowMode: flyoutMode.value }));
const onContextMenu = async (event: MouseEvent) => {
  event.preventDefault();
  if (!props.IsEnabled || !field.value) return;
  const args = { Handled: false, CursorLeft: event.offsetX, CursorTop: event.offsetY };
  dispatch('ContextMenuOpening', args);
  if (args.Handled || props.ContextFlyout === null) return;
  flyoutMode.value = 'Standard';
  stopPeek();
  field.value.focus({ preventScroll: true });
  contextSelection.value = { start: field.value.selectionStart ?? 0, end: field.value.selectionEnd ?? 0 };
  const request = ++menuRequest;
  clipboard.value = await readClipboard();
  if (request !== menuRequest || !field.value?.isConnected || !props.IsEnabled || document.activeElement !== field.value) return;
  const controller = customContext.value ?? props.ContextFlyout ?? contextMenu.value;
  await nextTick();
  const bounds = field.value.getBoundingClientRect();
  void controller?.ShowAt?.(field.value, { Position: { X: event.clientX - bounds.left, Y: event.clientY - bounds.top } });
};
const onSelectionPointerUp = async (event: PointerEvent) => {
  if (event.button !== 0 || !['touch', 'pen'].includes(event.pointerType) || !props.IsEnabled || props.SelectionFlyout === null || !field.value) return;
  contextSelection.value = { start: field.value.selectionStart ?? 0, end: field.value.selectionEnd ?? 0 };
  if (contextSelection.value.start === contextSelection.value.end) return;
  flyoutMode.value = 'Transient';
  const request = ++menuRequest;
  clipboard.value = await readClipboard();
  if (request !== menuRequest || !field.value?.isConnected || document.activeElement !== field.value
    || field.value.selectionStart !== contextSelection.value.start || field.value.selectionEnd !== contextSelection.value.end) return;
  await nextTick();
  const controller = customSelection.value ?? props.SelectionFlyout ?? contextMenu.value;
  void controller?.ShowAt?.(field.value, { ShowMode: 'Transient', Placement: 'TopEdgeAlignedLeft' });
};
const password = ref(String(props.Password ?? ''));
const focused = ref(false);
const peeking = ref(false);
const revealEligible = ref(false);
const fieldWidth = ref(0);
const mode = computed(() => props.PasswordRevealMode);
const composing = ref(false);
const visible = computed(() => mode.value === 'Visible' || peeking.value);
const showReveal = computed(() => mode.value === 'Peek' && focused.value && revealEligible.value && password.value.length > 0 && props.IsEnabled && fieldWidth.value > Number(props.FontSize) * 5);
const maskCharacter = computed(() => {
  const value = String(props.PasswordChar);
  if (value.length !== 1 || value === '\0') throw new RangeError('PasswordBox.PasswordChar must be one non-null UTF-16 character.');
  return value;
});
const customMask = computed(() => !visible.value && maskCharacter.value !== '\u25CF');
// Let the native editor measure the actual mask glyphs. A transparent native
// password value under a separate mask layer gives the caret different metrics.
const editorText = computed(() => customMask.value ? maskCharacter.value.repeat(password.value.length) : password.value);
const fieldStyle = computed(() => ({ fontFamily: props.FontFamily || undefined, fontSize: `${Number(props.FontSize)}px`, fontWeight: props.FontWeight,
  color: props.Foreground || undefined }));
type PasswordEdit = { value: string; start: number; end: number };
const undoHistory: PasswordEdit[] = [];
const redoHistory: PasswordEdit[] = [];
let pendingEdit: PasswordEdit | undefined;
let compositionEdit: PasswordEdit | undefined;
let compositionCommitted: string | undefined;
const editState = (): PasswordEdit => ({ value: password.value, start: field.value?.selectionStart ?? 0, end: field.value?.selectionEnd ?? 0 });
const restoreSelection = (start: number, end = start) => {
  field.value?.setSelectionRange(Math.min(start, password.value.length), Math.min(end, password.value.length));
};
const syncEditor = () => { if (field.value && !composing.value) field.value.value = editorText.value; };
const applyPassword = (value: string, userInput = false) => {
  const maximum = Number(props.MaxLength);
  const next = maximum > 0 ? value.slice(0,maximum) : value;
  if (next === password.value) return;
  if (userInput && password.value.length === 0) revealEligible.value = true;
  if (!next) revealEligible.value = false;
  password.value = next;
  syncEditor();
  updateXamlBinding(rawProps.Password,next,instance);
  emit('update:Password',next);
  dispatch('PasswordChanging', { IsContentChanging: true });
  dispatch('PasswordChanged');
};
const replacePasswordRange = (text: string, state = editState()) => {
  const maximum = Number(props.MaxLength);
  const available = maximum > 0 ? Math.max(0, maximum - state.value.length + state.end - state.start) : text.length;
  const inserted = text.slice(0, available);
  const next = state.value.slice(0, state.start) + inserted + state.value.slice(state.end);
  if (next !== password.value) {
    undoHistory.push(state);
    if (undoHistory.length > 100) undoHistory.shift();
    redoHistory.length = 0;
    applyPassword(next, true);
  }
  syncEditor();
  const caret = state.start + inserted.length;
  restoreSelection(caret);
  void nextTick(() => restoreSelection(caret));
};
const restoreHistory = (redo: boolean) => {
  const source = redo ? redoHistory : undoHistory;
  const target = redo ? undoHistory : redoHistory;
  const previous = source.pop();
  if (!previous) return;
  target.push(editState());
  applyPassword(previous.value, true);
  restoreSelection(previous.start, previous.end);
  void nextTick(() => restoreSelection(previous.start, previous.end));
};
const deletionRange = (type: string, state: PasswordEdit) => {
  if (state.start !== state.end) return state;
  if (type.includes('Word') || type.includes('Line')) {
    return type.endsWith('Backward') ? { ...state, start: 0 } : { ...state, end: state.value.length };
  }
  const boundaries = [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(state.value)].map(part => part.index);
  boundaries.push(state.value.length);
  return type.endsWith('Backward')
    ? { ...state, start: boundaries.filter(index => index < state.start).at(-1) ?? 0 }
    : { ...state, end: boundaries.find(index => index > state.end) ?? state.value.length };
};
const onBeforeInput = (event: InputEvent) => {
  pendingEdit = editState();
  if (!customMask.value || composing.value || event.isComposing || !event.cancelable) return;
  if (event.inputType === 'historyUndo' || event.inputType === 'historyRedo') {
    event.preventDefault(); restoreHistory(event.inputType === 'historyRedo');
  } else if (event.inputType.startsWith('delete')) {
    event.preventDefault(); replacePasswordRange('', deletionRange(event.inputType, pendingEdit));
  } else if (event.inputType.startsWith('insert') && event.data !== null) {
    event.preventDefault(); replacePasswordRange(event.data, pendingEdit);
  }
};
const onPasswordInput = (event: InputEvent) => {
  if (composing.value) return;
  if (compositionCommitted !== undefined && event.data === compositionCommitted) {
    compositionCommitted = undefined; syncEditor(); return;
  }
  compositionCommitted = undefined;
  const element = event.target as HTMLInputElement;
  if (!customMask.value) {
    if (element.value !== password.value) {
      undoHistory.push(pendingEdit ?? editState()); redoHistory.length = 0;
      applyPassword(element.value, true);
    }
  } else {
    const state = pendingEdit ?? editState();
    if (event.inputType?.startsWith('delete')) replacePasswordRange('', deletionRange(event.inputType, state));
    else if (event.data !== null && event.data !== undefined) replacePasswordRange(event.data, state);
    else {
      // Fallback for autofill and mobile edits without beforeinput/data.
      const previousMask = maskCharacter.value.repeat(state.value.length);
      const next = element.value;
      let start = 0, end = previousMask.length, nextEnd = next.length;
      while (start < end && start < nextEnd && previousMask[start] === next[start]) start++;
      while (end > start && nextEnd > start && previousMask[end - 1] === next[nextEnd - 1]) { end--; nextEnd--; }
      replacePasswordRange(next.slice(start, nextEnd), { ...state, start, end });
    }
  }
  pendingEdit = undefined;
};
const onCompositionStart = () => { compositionCommitted = undefined; compositionEdit = editState(); composing.value = true; contextMenu.value?.Hide?.(false); };
const onCompositionEnd = (event: CompositionEvent) => {
  composing.value = false;
  if (customMask.value && compositionEdit) {
    compositionCommitted = event.data;
    replacePasswordRange(event.data, compositionEdit);
  } else if (field.value) applyPassword(field.value.value, true);
  compositionEdit = undefined;
  pendingEdit = undefined;
};
const stopPeek = () => { peeking.value = false; };
const onPaste = (event: ClipboardEvent) => {
  const args = { Handled: false }; dispatch('Paste', args);
  if (args.Handled) { event.preventDefault(); return; }
  if (composing.value) return;
  if (customMask.value && event.clipboardData) {
    event.preventDefault(); replacePasswordRange(event.clipboardData.getData('text/plain'));
  }
};
const onKeyDown = (event: KeyboardEvent) => {
  const args = { Key: event.key, Handled: false, OriginalSource: field.value };
  dispatch('KeyDown', args);
  if (args.Handled) { event.preventDefault(); return; }
  // Candidate-window keys belong to the IME. In particular Ctrl+Z must not
  // run the password editor's history while a composition is in progress.
  if (composing.value || event.isComposing || event.keyCode === 229) return;
  pendingEdit = editState();
  if ((event.ctrlKey || event.metaKey) && !event.altKey && ['z', 'y'].includes(event.key.toLowerCase())) {
    event.preventDefault(); restoreHistory(event.key.toLowerCase() === 'y' || event.shiftKey);
  }
};
provide(xamlScopeKey, { ...inject(xamlScopeKey,{}), PasswordTemplate: props });
provide(textInputTemplateKey, {
  HideDeleteButton: true,
  Field: surface => h('div', { class: 'win-password-content' }, [
    h('input', {
      ref: field, class: ['win-textbox-field', { 'custom-password-mask': customMask.value, 'is-composing': composing.value }], style: fieldStyle.value,
      type: visible.value || customMask.value ? 'text' : 'password', value: editorText.value,
      placeholder: props.PlaceholderText, maxlength: Number(props.MaxLength) > 0 ? props.MaxLength : undefined,
      disabled: !props.IsEnabled, autocomplete: 'current-password', spellcheck: false, autocapitalize: 'off', autocorrect: 'off', inputmode: props.InputScope === 'NumericPin' ? 'numeric' : 'text',
      'aria-label': resolveXamlValue(attrs['AutomationProperties.Name'],instance) ?? props.Header,
      onBeforeinput: onBeforeInput, onInput: onPasswordInput,
      onCompositionstart: onCompositionStart, onCompositionend: onCompositionEnd,
      onFocus: () => { focused.value = true; revealEligible.value = password.value.length === 0; surface.Focused(); dispatch('GotFocus'); },
      onBlur: () => { focused.value = false; revealEligible.value = false; stopPeek(); surface.Blurred(); dispatch('LostFocus'); },
      onPointerenter: surface.PointerEntered, onPointerleave: surface.PointerExited,
      onCopy: (event: ClipboardEvent) => event.preventDefault(), onCut: (event: ClipboardEvent) => event.preventDefault(), onPaste, onKeydown: onKeyDown,
      onContextmenu: onContextMenu,
      onPointerup: onSelectionPointerUp,
      onDrop: (event: DragEvent) => {
        if (customMask.value && event.dataTransfer) { event.preventDefault(); replacePasswordRange(event.dataTransfer.getData('text/plain')); }
      }
    })
  ]),
  Actions: () => showReveal.value ? h('button', {
    class: 'win-textbox-action-button win-password-reveal', type: 'button', tabindex: -1,
    'aria-label': t('text.reveal-password'), 'ToolTipService.ToolTip': t('text.reveal-password'),
    onPointerdown: (event: PointerEvent) => { event.preventDefault(); (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId); peeking.value = true; },
    onPointerup: stopPeek, onPointercancel: stopPeek, onLostpointercapture: stopPeek,
    onKeydown: (event: KeyboardEvent) => { if(event.key === ' ' || event.key === 'Enter') { event.preventDefault(); peeking.value = true; } },
    onKeyup: stopPeek
  }, [h('span','\uF78D')]) : null
});
watch(() => resolveXamlValue(rawProps.Password,instance), value => applyPassword(String(value ?? '')));
watch(() => props.PasswordRevealMode, stopPeek);
watch(() => props.IsEnabled, () => { stopPeek(); if (!props.IsEnabled) field.value?.blur(); });
watch(rawProps, () => { for (const key of Object.keys(overrides)) delete overrides[key]; });
const isMenuTarget = (target: EventTarget | null) => target instanceof Element
  && !!target.closest('.win-commandbar-flyout,.win-menu-flyout,.win-flyout');
const onDocumentPointerDown = (event: PointerEvent) => {
  const target = event.target as Node | null;
  if (!field.value || !target) return;
  if (field.value.closest('.win-password-box')?.contains(target)) {
    if (target === field.value && event.button === 0) { menuRequest++; contextMenu.value?.Hide?.(false); }
    return;
  }
  if (isMenuTarget(event.target)) return;
  menuRequest++;
  contextMenu.value?.Hide?.(false);
  field.value.blur();
};
const onDocumentFocusIn = (event: FocusEvent) => {
  if (field.value && !field.value.closest('.win-password-box')?.contains(event.target as Node) && !isMenuTarget(event.target)) {
    menuRequest++;
    contextMenu.value?.Hide?.(false);
  }
};
watch([visible, maskCharacter], () => {
  const state = editState();
  void nextTick(() => { syncEditor(); restoreSelection(state.start, state.end); });
}, { flush: 'sync' });
let sizeObserver: ResizeObserver | undefined;
onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown, true);
  document.addEventListener('focusin', onDocumentFocusIn, true);
  const element = field.value?.closest('.win-textbox-border');
  if (element) { sizeObserver = new ResizeObserver(() => { fieldWidth.value = element.getBoundingClientRect().width; }); sizeObserver.observe(element); }
  window.addEventListener('blur',stopPeek);
});
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown, true);
  document.removeEventListener('focusin', onDocumentFocusIn, true);
  menuRequest++; contextMenu.value?.Hide?.(false); window.removeEventListener('blur',stopPeek); sizeObserver?.disconnect();
});
defineExpose({
  get Password() { return password.value; }, set Password(value: string) { applyPassword(String(value ?? '')); },
  get PasswordChar() { return maskCharacter.value; }, set PasswordChar(value: string) {
    if (value.length !== 1 || value === '\0') throw new RangeError('PasswordBox.PasswordChar must be one non-null UTF-16 character.');
    overrides.PasswordChar = value;
  },
  get PasswordRevealMode() { return mode.value; }, set PasswordRevealMode(value: string) { overrides.PasswordRevealMode = value; stopPeek(); },
  get IsEnabled() { return props.IsEnabled as boolean; }, set IsEnabled(value: boolean) { overrides.IsEnabled = value; },
  Focus: () => field.value?.focus({ preventScroll: !!props.PreventKeyboardDisplayOnProgrammaticFocus }), SelectAll: () => field.value?.select(),
  PasteFromClipboard: () => { contextSelection.value = { start: field.value?.selectionStart ?? 0, end: field.value?.selectionEnd ?? 0 }; return pasteFromClipboard(); },
  get ContextFlyout() { return props.ContextFlyout !== undefined ? props.ContextFlyout : customContext.value ?? contextMenu.value; },
  set ContextFlyout(value: unknown) { overrides.ContextFlyout = value; },
  get SelectionFlyout() { return props.SelectionFlyout !== undefined ? props.SelectionFlyout : customSelection.value ?? contextMenu.value; },
  set SelectionFlyout(value: unknown) { overrides.SelectionFlyout = value; },
  get Element() { return field.value; }
});
</script>

<style>
.win-password-box { min-width: 64px; max-width: 100%; }
.win-password-box .win-textbox-header { margin: var(--PasswordBoxTopHeaderMargin, 0 0 8px 0); }
.win-password-box .win-password-content { position: relative; flex: 1; min-width: 0; overflow: hidden; }
.win-password-box .win-password-content .win-textbox-field { min-height: var(--textbox-content-min-height, 30px); height: 100%; padding: var(--textbox-padding, var(--TextControlThemePadding, 5px 6px 6px 10px)); border: 0; outline: 0; background: transparent; width: 100%; box-sizing: border-box; font: var(--ControlContentThemeFontSize, 14px)/normal var(--ContentControlThemeFontFamily, 'Segoe UI', sans-serif); color: var(--textbox-foreground); }
.win-password-box .win-password-content .win-textbox-field::placeholder { color: var(--textbox-placeholder-foreground); opacity: 1; }
.win-password-box .win-password-content .custom-password-mask { caret-color: var(--textbox-foreground); }
.win-password-box .win-password-content .custom-password-mask.is-composing { -webkit-text-security: disc; }
.win-password-box input::-ms-reveal { display: none; }
.win-password-box input::-ms-clear { display: none; }
.win-password-box input::-webkit-credentials-auto-fill-button { display: none; visibility: hidden; pointer-events: none; }
.win-password-box .win-password-reveal { width: 30px; min-width: 30px; flex: 0 0 30px; position: relative; padding: 0; border: 0; background: transparent; color: var(--textbox-button-foreground); }
.win-password-box .win-password-reveal span { position: absolute; inset: 4px 4px 4px 0; display: grid; place-items: center; border-radius: var(--textbox-radius, 4px); font: 12px var(--SymbolThemeFontFamily, 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif); }
.win-password-box .win-password-reveal:hover span { background: var(--textbox-button-background-pointer-over); }
.win-password-box .win-password-reveal:active span { background: var(--textbox-button-background-pressed); color: var(--textbox-button-foreground-pressed); }
.win-password-box.is-disabled .win-password-content .win-textbox-field { color: var(--textbox-foreground-disabled); }
</style>
