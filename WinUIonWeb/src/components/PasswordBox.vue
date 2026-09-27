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
import { defineComponent } from 'vue';
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
const dispatch = (name: string, args: unknown = { Handled: false }) => {
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
  applyPassword(password.value.slice(0,start) + value + password.value.slice(end), true);
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
  if (request !== menuRequest || !field.value?.isConnected || !props.IsEnabled) return;
  const controller = customContext.value ?? props.ContextFlyout ?? contextMenu.value;
  await nextTick();
  const bounds = field.value.getBoundingClientRect();
  void controller?.ShowAt?.(field.value, { Position: { X: event.clientX - bounds.left, Y: event.clientY - bounds.top } });
};
const onSelectionPointerUp = async (event: PointerEvent) => {
  if (event.button !== 0 || !props.IsEnabled || props.SelectionFlyout === null || !field.value) return;
  contextSelection.value = { start: field.value.selectionStart ?? 0, end: field.value.selectionEnd ?? 0 };
  if (contextSelection.value.start === contextSelection.value.end) return;
  flyoutMode.value = 'Transient';
  clipboard.value = await readClipboard();
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
const scrollOffset = ref(0);
const visible = computed(() => mode.value === 'Visible' || peeking.value);
const showReveal = computed(() => mode.value === 'Peek' && focused.value && revealEligible.value && password.value.length > 0 && props.IsEnabled && fieldWidth.value > Number(props.FontSize) * 5);
const customMask = computed(() => !visible.value && props.PasswordChar !== '\u25CF');
const fieldStyle = computed(() => ({ fontFamily: props.FontFamily || undefined, fontSize: `${Number(props.FontSize)}px`, fontWeight: props.FontWeight,
  color: customMask.value ? 'transparent' : props.Foreground || undefined }));
const applyPassword = (value: string, userInput = false) => {
  const maximum = Number(props.MaxLength);
  const next = maximum > 0 ? value.slice(0,maximum) : value;
  if (next === password.value) return;
  if (userInput && password.value.length === 0) revealEligible.value = true;
  if (!next) revealEligible.value = false;
  password.value = next;
  if (field.value) field.value.value = next;
  updateXamlBinding(rawProps.Password,next,instance);
  emit('update:Password',next);
  dispatch('PasswordChanging', { IsContentChanging: true });
  dispatch('PasswordChanged');
};
const stopPeek = () => { peeking.value = false; };
const onPaste = (event: ClipboardEvent) => { const args = { Handled: false }; dispatch('Paste',args); if(args.Handled) event.preventDefault(); };
const onKeyDown = (event: KeyboardEvent) => {
  const args = { Key: event.key, Handled: false, OriginalSource: field.value };
  dispatch('KeyDown', args);
  if (args.Handled) event.preventDefault();
};
provide(xamlScopeKey, { ...inject(xamlScopeKey,{}), PasswordTemplate: props });
provide(textInputTemplateKey, {
  HideDeleteButton: true,
  Field: surface => h('div', { class: 'win-password-content' }, [
    h('input', {
      ref: field, class: ['win-textbox-field', { 'custom-password-mask': customMask.value }], style: fieldStyle.value,
      type: visible.value ? 'text' : 'password', value: password.value,
      placeholder: props.PlaceholderText, maxlength: Number(props.MaxLength) > 0 ? props.MaxLength : undefined,
      disabled: !props.IsEnabled, autocomplete: 'current-password', spellcheck: false, inputmode: props.InputScope === 'NumericPin' ? 'numeric' : 'text',
      'aria-label': resolveXamlValue(attrs['AutomationProperties.Name'],instance) ?? props.Header,
      onInput: (event: Event) => applyPassword((event.target as HTMLInputElement).value, true),
      onFocus: () => { focused.value = true; revealEligible.value = password.value.length === 0; surface.Focused(); dispatch('GotFocus'); },
      onBlur: () => { focused.value = false; revealEligible.value = false; stopPeek(); surface.Blurred(); dispatch('LostFocus'); },
      onPointerenter: surface.PointerEntered, onPointerleave: surface.PointerExited,
      onCopy: (event: ClipboardEvent) => event.preventDefault(), onCut: (event: ClipboardEvent) => event.preventDefault(), onPaste, onKeydown: onKeyDown,
      onContextmenu: onContextMenu,
      onPointerup: onSelectionPointerUp,
      onScroll: () => { scrollOffset.value = field.value?.scrollLeft ?? 0; }
    }),
    customMask.value && password.value ? h('span', { class: 'win-password-mask', 'aria-hidden': true, style: fieldStyle.value }, [h('span', { style: { transform: `translateX(${-scrollOffset.value}px)` } }, String(props.PasswordChar).slice(0,1).repeat(password.value.length))]) : null
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
watch(customMask, () => nextTick(() => { scrollOffset.value = field.value?.scrollLeft ?? 0; }));
let sizeObserver: ResizeObserver | undefined;
onMounted(() => {
  const element = field.value?.closest('.win-textbox-border');
  if (element) { sizeObserver = new ResizeObserver(() => { fieldWidth.value = element.getBoundingClientRect().width; }); sizeObserver.observe(element); }
  window.addEventListener('blur',stopPeek);
});
onBeforeUnmount(() => { menuRequest++; contextMenu.value?.Hide?.(); window.removeEventListener('blur',stopPeek); sizeObserver?.disconnect(); });
defineExpose({
  get Password() { return password.value; }, set Password(value: string) { applyPassword(String(value ?? '')); },
  get PasswordRevealMode() { return mode.value; }, set PasswordRevealMode(value: string) { overrides.PasswordRevealMode = value; stopPeek(); },
  get IsEnabled() { return props.IsEnabled; }, set IsEnabled(value: boolean) { overrides.IsEnabled = value; },
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
.win-password-box .win-password-content .custom-password-mask { color: transparent; caret-color: var(--textbox-foreground); }
.win-password-mask { position: absolute; inset: 0; padding: var(--textbox-padding, var(--TextControlThemePadding, 5px 6px 6px 10px)); overflow: hidden; pointer-events: none; white-space: pre; box-sizing: border-box; font: var(--ControlContentThemeFontSize, 14px)/normal var(--ContentControlThemeFontFamily, 'Segoe UI', sans-serif); color: var(--textbox-foreground) !important; }
.win-password-mask span { display: block; }
.win-password-box .win-password-reveal { width: 30px; min-width: 30px; flex: 0 0 30px; position: relative; padding: 0; border: 0; background: transparent; color: var(--textbox-button-foreground); }
.win-password-box .win-password-reveal span { position: absolute; inset: 4px 4px 4px 0; display: grid; place-items: center; border-radius: var(--textbox-radius, 4px); font: 12px var(--SymbolThemeFontFamily, 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif); }
.win-password-box .win-password-reveal:hover span { background: var(--textbox-button-background-pointer-over); }
.win-password-box .win-password-reveal:active span { background: var(--textbox-button-background-pressed); color: var(--textbox-button-foreground-pressed); }
.win-password-box.is-disabled .win-password-content .win-textbox-field { color: var(--textbox-foreground-disabled); }
</style>
