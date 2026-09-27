<template>
  <TextBox
    v-bind="forwardedAttrs"
    class="win-rich-edit-box"
    Header="{x:Bind RichInput.Header, Mode=OneWay}"
    HeaderTemplate="{x:Bind RichInputHeaderTemplate, Mode=OneWay}"
    Description="{x:Bind RichInput.Description, Mode=OneWay}"
    AcceptsReturn="{x:Bind RichInput.AcceptsReturn, Mode=OneWay}"
    IsReadOnly="{x:Bind RichInput.IsReadOnly, Mode=OneWay}"
    IsEnabled="{x:Bind RichInput.IsEnabled, Mode=OneWay}"
    MaxLength="{x:Bind RichInput.MaxLength, Mode=OneWay}"
    FontFamily="{x:Bind RichInput.FontFamily, Mode=OneWay}"
    FontSize="{x:Bind RichInput.FontSize, Mode=OneWay}"
    FontWeight="{x:Bind RichInput.FontWeight, Mode=OneWay}"
    FontStyle="{x:Bind RichInput.FontStyle, Mode=OneWay}"
    TextWrapping="{x:Bind RichInput.TextWrapping, Mode=OneWay}"
    TextAlignment="{x:Bind RichInput.TextAlignment, Mode=OneWay}"
    IsSpellCheckEnabled="{x:Bind RichInput.IsSpellCheckEnabled, Mode=OneWay}"
    IsTextPredictionEnabled="{x:Bind RichInput.IsTextPredictionEnabled, Mode=OneWay}"
    InputScope="{x:Bind RichInput.InputScope, Mode=OneWay}"
    CharacterCasing="{x:Bind RichInput.CharacterCasing, Mode=OneWay}"
    SelectionHighlightColor="{x:Bind RichInput.SelectionHighlightColor, Mode=OneWay}"
    PreventKeyboardDisplayOnProgrammaticFocus="{x:Bind RichInput.PreventKeyboardDisplayOnProgrammaticFocus, Mode=OneWay}"
    Width="{x:Bind RichInput.Width, Mode=OneWay}"
    Height="{x:Bind RichInput.Height, Mode=OneWay}"
    MinHeight="{x:Bind RichInput.MinHeight, Mode=OneWay}">
    <TextBox.Header v-if="headerPropertyNodes.length"><HeaderPropertyOutlet /></TextBox.Header>
    <TextBox.Description v-if="descriptionPropertyNodes.length"><DescriptionPropertyOutlet /></TextBox.Description>
    <TextBox.Background v-if="backgroundPropertyNodes.length"><BackgroundPropertyOutlet /></TextBox.Background>
  </TextBox>

  <TextCommandFlyoutOutlet />
  <ContextFlyoutOutlet />
  <SelectionFlyoutOutlet />
</template>

<script lang="ts">
import { defineComponent as definePropertyElement } from 'vue';
import { brushProperty } from './brushProperties';
const richEditProperty = (name: string) => definePropertyElement({ name: `RichEditBox.${name}`, __richEditBoxProperty: name, __textInputProperty: name, setup: () => () => null });
export default {
  Background: brushProperty('RichEditBox', 'Background'),
  Header: richEditProperty('Header'),
  HeaderTemplate: richEditProperty('HeaderTemplate'),
  Description: richEditProperty('Description'),
  ContextFlyout: richEditProperty('ContextFlyout'),
  SelectionFlyout: richEditProperty('SelectionFlyout')
};
</script>

<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowReactive, useAttrs, useSlots, watch } from 'vue';
import type { CSSProperties, VNode } from 'vue';
import CommandBarFlyout from './CommandBarFlyout.vue';
import AppBarButton from './AppBarButton.vue';
import AppBarToggleButton from './AppBarToggleButton.vue';
import ScrollViewer from './ScrollViewer.vue';
import TextBox from './TextBox.vue';
import { useI18n } from './i18n/index';
import { eventNames, normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlControlIdentityKey, xamlScopeKey } from './xamlRuntime';
import { commandChildren, flattenCommandNodes } from './commandBarRuntime';
import { scrollViewerTemplateBindings } from './scrollViewerTemplateBindings';
import { cssLength } from './layout';
import { textInputTemplateKey } from './textInputTemplate';
import { loadRtf, linearMathToElement, parseMathML, saveRtf } from './richEditDocument';

defineOptions({ inheritAttrs: false });

const { t } = useI18n();
const instance = getCurrentInstance();
const attrs = useAttrs();
const slots = useSlots();
const editorAutomationName = computed(() => resolveXamlValue(attrs['AutomationProperties.Name'] ?? attrs['aria-label'], instance));
const propertyChildren = (name: string) => {
  const nodes = flattenCommandNodes(slots.default?.() ?? []);
  const property = nodes.find(node => (node.type as { __richEditBoxProperty?: string }).__richEditBoxProperty === name);
  return normalizeXamlNodes(property ? commandChildren(property) : [], instance);
};
const headerPropertyNodes = computed(() => propertyChildren('Header'));
const headerTemplatePropertyNodes = computed(() => propertyChildren('HeaderTemplate'));
const descriptionPropertyNodes = computed(() => propertyChildren('Description'));
const backgroundPropertyNodes = computed(() => {
  const property = flattenCommandNodes(slots.default?.() ?? []).find(node => (node.type as { __xamlBrushProperty?: string }).__xamlBrushProperty === 'Background');
  return property ? commandChildren(property) : [];
});
const HeaderPropertyOutlet = defineComponent({ setup: () => () => h(Fragment, headerPropertyNodes.value) });
const DescriptionPropertyOutlet = defineComponent({ setup: () => () => h(Fragment, descriptionPropertyNodes.value) });
const BackgroundPropertyOutlet = defineComponent({ setup: () => () => h(Fragment, backgroundPropertyNodes.value) });
const forwardedAttrs = computed(() => ({
  ...Object.fromEntries(Object.entries(attrs).filter(([name]) => !name.startsWith('ScrollViewer.') && name !== 'AutomationProperties.Name' && !name.startsWith('on') && !eventNames.has(name))),
  'aria-label': editorAutomationName.value,
  style: [attrs.style, rootStyle.value]
}));
const RichEditBoxScrollSettings = scrollViewerTemplateBindings(name => attrs[name], instance, {
  HorizontalScrollMode: 'Auto', VerticalScrollMode: 'Auto',
  HorizontalScrollBarVisibility: 'Auto', VerticalScrollBarVisibility: 'Auto',
  IsDeferredScrollingEnabled: false
});

type TextAlignment = 'Left' | 'Center' | 'Right' | 'Justify';
type TextWrapping = 'NoWrap' | 'Wrap' | 'WrapWholeWords';
type CharacterCasing = 'Normal' | 'Lower' | 'Upper';
type ClipboardCopyFormat = 'AllFormats' | 'PlainText';
type TextReadingOrder = 'Default' | 'DetectFromContent' | 'UseFlowDirection';
type CandidateWindowAlignment = 'Default' | 'BottomEdge';
type HeaderPlacement = 'Top' | 'Left';
type DisabledFormattingAccelerators = 'None' | 'Bold' | 'Italic' | 'Underline' | 'All' | string;

const rawProps = withDefaults(defineProps<{
  AcceptsReturn?: boolean;
  CharacterCasing?: CharacterCasing;
  ClipboardCopyFormat?: ClipboardCopyFormat;
  Description?: string;
  DesiredCandidateWindowAlignment?: CandidateWindowAlignment;
  DisabledFormattingAccelerators?: DisabledFormattingAccelerators;
  FontFamily?: string;
  FontSize?: number | string;
  FontWeight?: number | string;
  FontStyle?: string;
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
  ContextFlyout?: unknown | null;
  SelectionHighlightColor?: string;
  SelectionHighlightColorWhenNotFocused?: string;
  TextAlignment?: TextAlignment;
  TextReadingOrder?: TextReadingOrder;
  TextWrapping?: TextWrapping;
  Width?: number | string;
  Height?: number | string;
  MinHeight?: number | string;
}>(), {
  AcceptsReturn: true,
  CharacterCasing: 'Normal',
  ClipboardCopyFormat: 'AllFormats',
  Description: '',
  DesiredCandidateWindowAlignment: 'Default',
  DisabledFormattingAccelerators: 'None',
  FontFamily: '',
  FontSize: '',
  FontWeight: '',
  FontStyle: 'Normal',
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
  ContextFlyout: undefined,
  SelectionHighlightColor: '',
  SelectionHighlightColorWhenNotFocused: '',
  TextAlignment: 'Left',
  TextReadingOrder: 'DetectFromContent',
  TextWrapping: 'Wrap',
  Width: '',
  Height: '',
  MinHeight: ''
});
const propertyOverrides = shallowReactive<Record<string, unknown>>({});
const props = new Proxy(rawProps, { get: (target, property) => resolveXamlValue(typeof property === 'string' && property in propertyOverrides ? propertyOverrides[property] : Reflect.get(target, property), instance) });
const RichInput = props;
const RichInputHeaderTemplate = computed(() => headerTemplatePropertyNodes.value[0] ?? props.HeaderTemplate);
provide(xamlScopeKey, { ...inject(xamlScopeKey, {}), RichInput, RichInputHeaderTemplate, RichEditBoxScrollSettings });
const resolvedHeader = computed(() => resolveXamlValue(props.Header, instance));
const resolvedDescription = computed(() => resolveXamlValue(props.Description, instance));
const resolvedWidth = computed(() => resolveXamlValue(props.Width, instance) as number | string | undefined);
const resolvedHeight = computed(() => resolveXamlValue(props.Height, instance) as number | string | undefined);
const resolvedMinHeight = computed(() => resolveXamlValue(props.MinHeight, instance) as number | string | undefined);

const emit = defineEmits<{
  TextChanged: [sender?: unknown, args?: unknown];
  SelectionChanged: [sender?: unknown, args?: unknown];
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
  GotFocus: [sender?: unknown, args?: unknown];
  LostFocus: [sender?: unknown, args?: unknown];
  Loaded: [sender?: unknown, args?: unknown];
  Unloaded: [sender?: unknown, args?: unknown];
}>();

const dispatch = (name: string, args?: unknown) => {
  const sender = instance?.exposeProxy ?? instance?.exposed ?? instance?.proxy;
  const eventArgs = args ?? { OriginalSource: editorRef.value, Handled: false };
  const listener = instance?.vnode.props?.[`on${name}`];
  if (listener) {
    for (const handler of Array.isArray(listener) ? listener : [listener]) handler(sender, eventArgs);
  } else {
    (emit as (name: string, ...args: unknown[]) => void)(name, sender, eventArgs);
  }
  if (!listener) resolveXamlHandler(attrs[name], instance)?.(sender, eventArgs);
};

const editorRef = ref<HTMLDivElement | null>(null);
const customContextController = ref<{ ShowAt?: (target: unknown, options?: unknown) => Promise<void>; Hide?: () => void } | null>(null);
const hasCustomContextFlyout = ref(false);
const customSelectionController = ref<{ ShowAt?: (target: unknown, options?: unknown) => Promise<void>; Hide?: () => void } | null>(null);
const hasCustomSelectionFlyout = ref(false);
provide('buttonFlyoutAnchor', editorRef);
provide('buttonFlyoutController', customContextController);
const ContextFlyoutOutlet = defineComponent({
  name: 'RichEditBoxContextFlyoutOutlet',
  setup() { return () => {
    const nodes = flattenCommandNodes(slots.default?.() ?? []);
    const property = nodes.find(node => (node.type as { __richEditBoxProperty?: string }).__richEditBoxProperty === 'ContextFlyout');
    const children = property ? commandChildren(property) : [];
    hasCustomContextFlyout.value = children.length > 0 || props.ContextFlyout !== undefined;
    return h(Fragment, normalizeXamlNodes(children, instance));
  }; }
});
const SelectionFlyoutOutlet = defineComponent({
  name: 'RichEditBoxSelectionFlyoutOutlet',
  setup() {
    provide('buttonFlyoutAnchor', editorRef);
    provide('buttonFlyoutController', customSelectionController);
    return () => {
      const children = propertyChildren('SelectionFlyout');
      hasCustomSelectionFlyout.value = children.length > 0 || props.SelectionFlyout !== undefined;
      return h(Fragment, children);
    };
  }
});
const isFocused = ref(false);
const commandBarOpen = ref(false);
const currentFlyoutKind = ref<'Selection' | 'Context'>('Selection');
const commandBarFlyout = ref<{ ShowAt: (target: unknown, options?: unknown) => Promise<void>; Hide: () => void } | null>(null);
const commandBarAnchor = ref<DOMRect | { x: number; y: number; top: number; bottom: number; left: number; right: number; width: number; height: number } | null>(null);
const internalHtml = ref('');
const savedSelection = ref<Range | null>(null);
const customFormattingCommands = ref<{ Command: string; Label: string; Execute?: () => void }[]>([]);
const customPrimaryCommands = ref<VNode[]>([]);
const flyoutOpeningHandlers = { Selection: new Set<(sender: unknown, args: unknown) => void>(), Context: new Set<(sender: unknown, args: unknown) => void>() };
const addFormattingCommand = (command: string, label: string, execute?: () => void) => {
  const key = command.trim();
  if (!key || customFormattingCommands.value.some(item => item.Command === key)) return;
  customFormattingCommands.value.push({ Command: key, Label: label, Execute: execute });
};
const selectionFlyoutApi = {
  get PrimaryCommands() { return customPrimaryCommands.value; },
  get Target() { return instance?.exposed ?? instance?.proxy; },
  addEventListener: (event: string, handler: (sender: unknown, args: unknown) => void) => { if (event.toLowerCase() === 'opening') flyoutOpeningHandlers.Selection.add(handler); },
  removeEventListener: (event: string, handler: (sender: unknown, args: unknown) => void) => { if (event.toLowerCase() === 'opening') flyoutOpeningHandlers.Selection.delete(handler); },
  ShowAt: (target: unknown, options?: unknown) => commandBarFlyout.value?.ShowAt(target, options),
  Hide: () => commandBarFlyout.value?.Hide()
};
const contextFlyoutApi = {
  get PrimaryCommands() { return customPrimaryCommands.value; },
  get Target() { return instance?.exposed ?? instance?.proxy; },
  addEventListener: (event: string, handler: (sender: unknown, args: unknown) => void) => { if (event.toLowerCase() === 'opening') flyoutOpeningHandlers.Context.add(handler); },
  removeEventListener: (event: string, handler: (sender: unknown, args: unknown) => void) => { if (event.toLowerCase() === 'opening') flyoutOpeningHandlers.Context.delete(handler); },
  ShowAt: (target: unknown, options?: unknown) => commandBarFlyout.value?.ShowAt(target, options), Hide: () => commandBarFlyout.value?.Hide()
};
const mathMode = ref<'NoMath' | 'MathOnly'>('NoMath');
const pendingMathMarkup = ref('');
const undoStack = ref<string[]>([]);
const redoStack = ref<string[]>([]);
let lastCommittedHtml = '';
let composing = false;
let formatting = false;

const disabledFormatting = computed(() => props.DisabledFormattingAccelerators.toLowerCase());
const isFormattingDisabled = (command: 'bold' | 'italic' | 'underline') => {
  return disabledFormatting.value.includes('all') || disabledFormatting.value.includes(command);
};
const commandBarPrimaryCommands = computed<VNode[]>(() => {
  const commands: VNode[] = [];
  if (!props.IsReadOnly) {
    if (!isFormattingDisabled('bold')) commands.push(h(AppBarToggleButton, {
      key: 'BoldButton',
      Label: t('sample.richeditbox.bold'),
      LabelPosition: 'Collapsed',
      Icon: 'Bold',
      'ToolTipService.ToolTip': t('sample.richeditbox.bold'),
      Click: () => void runTextCommand('bold'),
      IsChecked: isCommandActive('bold')
    }));
    if (!isFormattingDisabled('italic')) commands.push(h(AppBarToggleButton, {
      key: 'ItalicButton',
      Label: t('sample.richeditbox.italic'),
      LabelPosition: 'Collapsed',
      Icon: 'Italic',
      'ToolTipService.ToolTip': t('sample.richeditbox.italic'),
      Click: () => void runTextCommand('italic'),
      IsChecked: isCommandActive('italic')
    }));
    if (!isFormattingDisabled('underline')) commands.push(h(AppBarToggleButton, {
      key: 'UnderlineButton',
      Label: t('sample.richeditbox.underline'),
      LabelPosition: 'Collapsed',
      Icon: 'Underline',
      'ToolTipService.ToolTip': t('sample.richeditbox.underline'),
      Click: () => void runTextCommand('underline'),
      IsChecked: isCommandActive('underline')
    }));
  }
  commands.push(...customPrimaryCommands.value);
  commands.push(...customFormattingCommands.value.map(command => h(AppBarButton, {
    key: command.Command,
    Label: command.Label,
    LabelPosition: 'Collapsed',
    Icon: command.Command,
    'ToolTipService.ToolTip': command.Label,
    Click: () => command.Execute ? command.Execute() : void runTextCommand(command.Command.toLowerCase())
  })));
  return commands;
});

const commandBarSecondaryCommands = computed<VNode[]>(() => {
  const selected = savedSelection.value?.toString() ?? '';
  const canEdit = !props.IsReadOnly && props.IsEnabled;
  const commands: VNode[] = [];
  if (selected && canEdit) commands.push(h(AppBarButton, { key: 'CutButton', Label: t('sample.menubar.cut'), Icon: 'Cut', Click: () => void runTextCommand('cut') }));
  if (selected) commands.push(h(AppBarButton, { key: 'CopyButton', Label: t('sample.copy'), Icon: 'Copy', Click: () => void runTextCommand('copy') }));
  if (canEdit) commands.push(h(AppBarButton, { key: 'PasteButton', Label: t('sample.menubar.paste'), Icon: 'Paste', Click: () => void runTextCommand('paste') }));
  if (canEdit && undoStack.value.length) commands.push(h(AppBarButton, { key: 'UndoButton', Label: t('sample.menubar.undo'), Icon: 'Undo', Click: () => void runTextCommand('undo') }));
  if (canEdit && redoStack.value.length) commands.push(h(AppBarButton, { key: 'RedoButton', Label: t('sample.menubar.redo'), Icon: 'Redo', Click: () => void runTextCommand('redo') }));
  if (internalHtml.value && plainText().length > 0) commands.push(h(AppBarButton, { key: 'SelectAllButton', Label: t('sample.select-all'), Icon: 'SelectAll', Click: () => void runTextCommand('selectAll') }));
  return commands;
});
const TextCommandFlyoutOutlet = defineComponent({
  name: 'RichEditBoxTextCommandFlyoutOutlet',
  setup() { return () => h(CommandBarFlyout, { ref: commandBarFlyout, Placement: currentFlyoutKind.value === 'Selection' ? 'TopEdgeAlignedLeft' : 'BottomEdgeAlignedLeft', ShowMode: currentFlyoutKind.value === 'Selection' ? 'Transient' : 'Standard', onOpening: () => {
    const kind = currentFlyoutKind.value;
    flyoutOpeningHandlers[kind].forEach(handler => handler(kind === 'Selection' ? selectionFlyoutApi : contextFlyoutApi, {}));
  }, onClosed: () => { commandBarOpen.value = false; } }, {
    default: () => [
      h(CommandBarFlyout.PrimaryCommands, null, { default: () => commandBarPrimaryCommands.value }),
      h(CommandBarFlyout.SecondaryCommands, null, { default: () => commandBarSecondaryCommands.value })
    ]
  }); }
});
watch([commandBarOpen, commandBarAnchor], async () => {
  await nextTick();
  if (!commandBarOpen.value || !editorRef.value || !commandBarAnchor.value) { commandBarFlyout.value?.Hide(); return; }
  const targetRect = editorRef.value.getBoundingClientRect(); const point = commandBarAnchor.value;
  await commandBarFlyout.value?.ShowAt(editorRef.value, { ShowMode: currentFlyoutKind.value === 'Selection' ? 'Transient' : 'Standard', Position: { X: point.left - targetRect.left, Y: (currentFlyoutKind.value === 'Selection' ? point.top : point.bottom) - targetRect.top } });
});

const cssSize = (value: number | string) => value === '' ? undefined : cssLength(value);
const editorContentSize = (value: number | string | undefined, fallback?: string) => {
  const size = cssSize(value ?? '');
  return size ? `max(0px, calc(${size} - 2px))` : fallback;
};
const rootStyle = computed<CSSProperties & Record<string, string | undefined>>(() => ({
  width: cssSize(resolvedWidth.value ?? ''),
  height: cssSize(resolvedHeight.value ?? ''),
  minHeight: cssSize(resolvedMinHeight.value ?? ''),
  '--rich-edit-box-min-height': cssSize(resolvedMinHeight.value || 32),
  '--reb-editor-min-height': editorContentSize(resolvedMinHeight.value, '30px'),
  '--reb-font-size': cssSize(props.FontSize),
  '--reb-font-family': props.FontFamily || undefined,
  '--reb-font-weight': props.FontWeight === '' ? undefined : String(({ Normal: 400, SemiBold: 600, Bold: 700, Light: 300 } as Record<string, number>)[String(props.FontWeight)] ?? props.FontWeight),
  '--reb-font-style': props.FontStyle.toLowerCase(),
  '--reb-selection-background-blur': props.SelectionHighlightColorWhenNotFocused || undefined
}));

const editorScrollStyle = computed<CSSProperties>(() => ({
  height: editorContentSize(resolvedHeight.value),
  minHeight: editorContentSize(resolvedMinHeight.value, '30px')
}));

const editorStyle = computed<CSSProperties>(() => ({
  textAlign: (props.TextAlignment || props.HorizontalTextAlignment || 'Left').toLowerCase() as CSSProperties['textAlign'],
  whiteSpace: props.TextWrapping === 'NoWrap' ? 'pre' : 'pre-wrap',
  overflowWrap: props.TextWrapping === 'WrapWholeWords' ? 'normal' : 'break-word',
  direction: props.TextReadingOrder === 'UseFlowDirection' ? 'inherit' : undefined
  ,fontFamily: mathMode.value === 'MathOnly' ? 'Cambria Math, serif' : props.FontFamily || undefined
  ,fontSize: cssSize(props.FontSize)
  ,fontStyle: props.FontStyle.toLowerCase() as CSSProperties['fontStyle']
  ,fontWeight: props.FontWeight === '' ? undefined : ({ Normal: 400, SemiBold: 600, Bold: 700, Light: 300 } as Record<string, number>)[String(props.FontWeight)] ?? props.FontWeight as CSSProperties['fontWeight']
  ,color: resolveXamlValue(attrs.Foreground, instance) as string || undefined
}));

provide(textInputTemplateKey, {
  HideDeleteButton: true,
  Field: surface => h(ScrollViewer, {
    class: 'win-reb-editor-scroll',
    style: editorScrollStyle.value,
    VerticalScrollMode: '{x:Bind RichEditBoxScrollSettings.VerticalScrollMode, Mode=OneWay}',
    VerticalScrollBarVisibility: '{x:Bind RichEditBoxScrollSettings.VerticalScrollBarVisibility, Mode=OneWay}',
    HorizontalScrollMode: '{x:Bind RichEditBoxScrollSettings.HorizontalScrollMode, Mode=OneWay}',
    HorizontalScrollBarVisibility: '{x:Bind RichEditBoxScrollSettings.HorizontalScrollBarVisibility, Mode=OneWay}',
    IsHorizontalRailEnabled: '{x:Bind RichEditBoxScrollSettings.IsHorizontalRailEnabled, Mode=OneWay}',
    IsVerticalRailEnabled: '{x:Bind RichEditBoxScrollSettings.IsVerticalRailEnabled, Mode=OneWay}',
    IsDeferredScrollingEnabled: '{x:Bind RichEditBoxScrollSettings.IsDeferredScrollingEnabled, Mode=OneWay}',
    IsTabStop: 'False', ZoomMode: 'Disabled'
  }, { default: () => h('div', {
    ref: editorRef, class: 'win-reb-editor', style: editorStyle.value,
    contenteditable: props.IsEnabled && !props.IsReadOnly,
    tabindex: props.IsEnabled ? 0 : -1,
    'data-placeholder': props.PlaceholderText, spellcheck: props.IsSpellCheckEnabled,
    autocomplete: props.IsTextPredictionEnabled ? 'on' : 'off',
    role: 'textbox', 'aria-label': editorAutomationName.value, 'aria-multiline': props.AcceptsReturn,
    'aria-readonly': props.IsReadOnly, 'aria-disabled': !props.IsEnabled,
    onBeforeinput: onBeforeInput, onInput, onFocus: () => onEditorFocus(surface.Focused), onBlur: () => onEditorBlur(surface.Blurred),
    onKeydown, onPaste, onCopy, onCut, onContextmenu: onContextMenu,
    onPointerup: onSelectionGesture, onKeyup: onSelectionGesture,
    onPointerenter: surface.PointerEntered, onPointerleave: surface.PointerExited
  }) })
});

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
  if (!range || !selection || !editorRef.value?.contains(range.startContainer) || !editorRef.value?.contains(range.endContainer)) return;
  selection.removeAllRanges();
  selection.addRange(range);
};

const getSelectionText = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !editorRef.value?.contains(selection.anchorNode)) return '';
  return selection.toString();
};

const getSelectionRange = () => {
  const selection = window.getSelection();
  if (selection?.rangeCount && editorRef.value?.contains(selection.anchorNode)) return selection.getRangeAt(0);
  return savedSelection.value;
};

const formatEffect = (command: string, value?: string, effect?: string) => {
  if (props.IsReadOnly || !props.IsEnabled) return;
  focus();
  restoreSelection();
  const before = selectionOffsets();
  if (effect && effect !== 'Toggle' && document.queryCommandState(command) === (effect === 'On')) return;
  document.execCommand(command, false, value);
  saveSelection();
  onInput();
  const restored = domRange(before.StartPosition, before.EndPosition);
  if (restored) { const selection = window.getSelection(); selection?.removeAllRanges(); selection?.addRange(restored); savedSelection.value = restored; }
};

const selectionCharacterFormat = {
  get Bold() { return queryCommandState('bold') ? 'On' : 'Off'; },
  set Bold(value: string) { formatEffect('bold', undefined, value); },
  get Italic() { return queryCommandState('italic') ? 'On' : 'Off'; },
  set Italic(value: string) { formatEffect('italic', undefined, value); },
  get Underline() { return queryCommandState('underline') ? 'On' : 'Off'; },
  set Underline(value: string) { formatEffect('underline', undefined, value); },
  get Strikethrough() { return queryCommandState('strikeThrough') ? 'On' : 'Off'; },
  set Strikethrough(value: string) { formatEffect('strikeThrough', undefined, value); },
  get ForegroundColor() { return document.queryCommandValue('foreColor'); },
  set ForegroundColor(value: string) { applyForegroundColor(String(value), false); },
  get BackgroundColor() { return document.queryCommandValue('backColor'); },
  set BackgroundColor(value: string) { if (value) formatEffect('backColor', value); }
};

const serializeMathML = () => {
  if (mathMode.value !== 'MathOnly') throw new TypeError('MathOnly mode is required');
  if ((editorRef.value?.querySelectorAll('math').length ?? 0) !== 1 || editorRef.value?.querySelector('br')) return '';
  const math = editorRef.value?.querySelector('math');
  if (!math) return '';
  const clone = math.cloneNode(true) as Element;
  clone.removeAttribute('data-linear-math');
  return new XMLSerializer().serializeToString(clone);
};

const setMathML = (value: string) => {
  if (mathMode.value !== 'MathOnly') throw new TypeError('MathOnly mode is required');
  try {
    const imported = parseMathML(value);
    if (editorRef.value) editorRef.value.replaceChildren(imported);
    else pendingMathMarkup.value = new XMLSerializer().serializeToString(imported);
    savedSelection.value = null;
    onInput();
  } catch (error) {
    setText('');
    throw error;
  }
};

const convertLinearMath = () => {
  const editor = editorRef.value;
  if (!editor || mathMode.value !== 'MathOnly') return;
  const range = getSelectionRange();
  if (!range || !range.collapsed || !editor.contains(range.startContainer)) return;
  if (range.startContainer.nodeType !== Node.TEXT_NODE) return false;
  const textNode = range.startContainer as Text;
  const expression = textNode.data.slice(0, range.startOffset).trim();
  if (!expression || !/[=+\-*/^\\]|\d/.test(expression)) return;
  try {
    const math = linearMathToElement(expression);
    if (math.querySelector('merror')) return false;
    const tail = document.createTextNode(` ${textNode.data.slice(range.startOffset)}`);
    textNode.replaceWith(math, tail);
    range.setStart(tail, 1); range.collapse(true);
    const selection = window.getSelection(); selection?.removeAllRanges(); selection?.addRange(range); saveSelection();
    onInput();
    return true;
  } catch { /* incomplete UnicodeMath remains editable */ }
  return false;
};

const setMathMode = (mode: 'NoMath' | 'MathOnly' | 'Normal') => {
  const next = mode === 'Normal' ? 'NoMath' : mode;
  if (next === mathMode.value) return;
  mathMode.value = next;
  setText('');
  undoStack.value = [];
  redoStack.value = [];
};

const undo = () => {
  const editor = editorRef.value;
  const previous = undoStack.value.pop();
  if (!editor || previous === undefined) return;
  redoStack.value.push(editor.innerHTML);
  formatting = true; editor.innerHTML = previous; formatting = false;
  lastCommittedHtml = previous; internalHtml.value = previous; dispatch('TextChanging', { IsContentChanging: true }); dispatch('TextChanged');
};

const redo = () => {
  const editor = editorRef.value;
  const next = redoStack.value.pop();
  if (!editor || next === undefined) return;
  undoStack.value.push(editor.innerHTML);
  formatting = true; editor.innerHTML = next; formatting = false;
  lastCommittedHtml = next; internalHtml.value = next; dispatch('TextChanging', { IsContentChanging: true }); dispatch('TextChanged');
};

const loadRtfDocument = async (source: string | ArrayBuffer) => {
  const rendered = await loadRtf(source);
  if (!editorRef.value) return;
  formatting = true;
  editorRef.value.replaceChildren(...rendered.map(node => node.cloneNode(true)));
  formatting = false;
  onInput();
};

const getText = (options?: string) => {
  if (options?.toLowerCase().includes('rtf')) return editorRef.value ? saveRtf(editorRef.value) : '{\\rtf1\\ansi }';
  if (mathMode.value === 'MathOnly') throw new TypeError('FormatRtf is required for a math document');
  return options?.includes('UseCrlf') ? plainText().replace(/\n/g, '\r\n') : plainText();
};

const highlightText = (text: string) => {
  if (!editorRef.value) return;
  const query = text.trim();
  editorRef.value.querySelectorAll('[data-rich-highlight="true"]').forEach(node => {
    const parent = node.parentNode;
    while (node.firstChild) parent?.insertBefore(node.firstChild, node);
    parent?.removeChild(node);
  });
  if (!query) { onInput(); return; }
  const walker = document.createTreeWalker(editorRef.value, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) if (walker.currentNode.textContent?.toLocaleLowerCase().includes(query.toLocaleLowerCase())) nodes.push(walker.currentNode as Text);
  nodes.forEach(node => {
    const value = node.nodeValue || '';
    const lower = value.toLocaleLowerCase();
    let offset = 0;
    const fragment = document.createDocumentFragment();
    while (offset < value.length) {
      const index = lower.indexOf(query.toLocaleLowerCase(), offset);
      if (index < 0) { fragment.append(value.slice(offset)); break; }
      fragment.append(value.slice(offset, index));
      const mark = document.createElement('mark');
      mark.dataset.richHighlight = 'true';
      mark.textContent = value.slice(index, index + query.length);
      fragment.append(mark);
      offset = index + query.length;
    }
    node.parentNode?.replaceChild(fragment, node);
  });
  onInput();
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
  if (!editor || formatting) return;
  let text = normalizeText(plainText());
  if (text !== plainText()) {
    editor.innerText = text;
  }
  internalHtml.value = editor.innerHTML;
  const changed = lastCommittedHtml !== internalHtml.value;
  if (!changed) return;
  undoStack.value.push(lastCommittedHtml);
  redoStack.value = [];
  lastCommittedHtml = internalHtml.value;
  dispatch('TextChanging', { IsContentChanging: true });
  dispatch('TextChanged');
};

const onBeforeInput = (event: InputEvent) => {
  if (props.IsReadOnly || !props.IsEnabled) { event.preventDefault(); return; }
  if (!props.AcceptsReturn && ['insertParagraph', 'insertLineBreak'].includes(event.inputType)) event.preventDefault();
  if (!composing && props.MaxLength > 0 && event.data && plainText().length - getSelectionText().length + event.data.length > props.MaxLength) event.preventDefault();
};

const selectionOffsets = (range = getSelectionRange()) => {
  if (!range || !editorRef.value?.contains(range.startContainer)) return { StartPosition: 0, EndPosition: 0 };
  const before = range.cloneRange(); before.selectNodeContents(editorRef.value); before.setEnd(range.startContainer, range.startOffset);
  return { StartPosition: before.toString().length, EndPosition: before.toString().length + range.toString().length };
};

const emitSelection = () => {
  const offsets = selectionOffsets();
  const changingArgs = { SelectionStart: offsets.StartPosition, SelectionLength: offsets.EndPosition - offsets.StartPosition, Cancel: false };
  dispatch('SelectionChanging', changingArgs);
  if (changingArgs.Cancel) { restoreSelection(); return false; }
  saveSelection();
  dispatch('SelectionChanged');
  return true;
};

const onSelectionGesture = async () => {
  if (!emitSelection()) return;
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
  if (!props.IsEnabled || props.SelectionFlyout === null) return;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !getSelectionText()) {
    commandBarOpen.value = false;
    return;
  }
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  if (hasCustomSelectionFlyout.value && editorRef.value) {
    const controller = customSelectionController.value || props.SelectionFlyout as typeof customSelectionController.value;
    const targetRect = editorRef.value.getBoundingClientRect();
    void controller?.ShowAt?.(editorRef.value, { ShowMode: 'Transient', Position: { X: rect.left - targetRect.left, Y: rect.top - targetRect.top } });
    return;
  }
  currentFlyoutKind.value = 'Selection';
  commandBarAnchor.value = rect;
  commandBarOpen.value = commandBarPrimaryCommands.value.length > 0 || commandBarSecondaryCommands.value.length > 0;
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') { commandBarOpen.value = false; return; }
  if (mathMode.value === 'MathOnly' && !composing && (event.key === ' ' || event.key === 'Enter')) {
    if (convertLinearMath()) event.preventDefault();
  }
  if (event.key === 'Enter' && !props.AcceptsReturn) event.preventDefault();
  if (!(event.ctrlKey || event.metaKey)) return;
  const key = event.key.toLowerCase();
  if (key === 'z') { event.preventDefault(); if (event.shiftKey) redo(); else undo(); return; }
  if (key === 'y') { event.preventDefault(); redo(); return; }
  if (key === 'b') {
    event.preventDefault();
    if (!isFormattingDisabled('bold')) runTextCommand('bold');
  }
  if (key === 'i') {
    event.preventDefault();
    if (!isFormattingDisabled('italic')) runTextCommand('italic');
  }
  if (key === 'u') {
    event.preventDefault();
    if (!isFormattingDisabled('underline')) runTextCommand('underline');
  }
};

const onRootContextMenu = (event: MouseEvent) => {
  if (!isEditorTextBoxSurface(event.target)) return;
  event.stopPropagation();
  focus();
  onContextMenu(event);
};

const onPaste = (event: ClipboardEvent) => {
  const args = { Handled: false };
  dispatch('Paste', args);
  if (args.Handled) event.preventDefault();
};

const onCopy = (event: ClipboardEvent) => {
  const args = { Handled: false };
  dispatch('CopyingToClipboard', args);
  if (args.Handled) { event.preventDefault(); return; }
  const selectedText = getSelectionText();
  if (props.ClipboardCopyFormat === 'PlainText' && selectedText) {
    event.clipboardData?.setData('text/plain', selectedText);
    event.preventDefault();
  }
};

const onCut = (event: ClipboardEvent) => {
  const args = { Handled: false };
  dispatch('CuttingToClipboard', args);
  if (args.Handled) event.preventDefault();
};

const onContextMenu = (event: MouseEvent) => {
  const args = { Handled: false, CursorLeft: event.clientX, CursorTop: event.clientY };
  dispatch('ContextMenuOpening', args);
  if (args.Handled) { event.preventDefault(); return; }
  if (props.ContextFlyout === null) return;
  event.preventDefault();
  saveSelection();
  if (hasCustomContextFlyout.value && editorRef.value) {
    const controller = customContextController.value || resolveXamlValue(props.ContextFlyout, instance) as typeof customContextController.value;
    const targetRect = editorRef.value.getBoundingClientRect();
    void controller?.ShowAt?.(editorRef.value, { ShowMode: 'Standard', Position: { X: event.clientX - targetRect.left, Y: event.clientY - targetRect.top } });
    return;
  }
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
  currentFlyoutKind.value = 'Context';
  commandBarOpen.value = commandBarPrimaryCommands.value.length > 0 || commandBarSecondaryCommands.value.length > 0;
};

const runTextCommand = async (command: string) => {
  if (!props.IsEnabled) return;
  focus();
  restoreSelection();
  if (command === 'copy') document.execCommand('copy');
  else if (command === 'cut' && !props.IsReadOnly) document.execCommand('cut');
  else if (command === 'paste' && !props.IsReadOnly) {
    const args = { Handled: false };
    dispatch('Paste', args);
    if (args.Handled) { commandBarOpen.value = false; return; }
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
    undo();
  } else if (command === 'redo') {
    redo();
  } else if (!props.IsReadOnly) {
    formatEffect(command);
  }
  commandBarOpen.value = false;
  onInput();
  updateSelectionFlyout();
};

const onEditorFocus = (setTextBoxFocused?: () => void) => {
  setTextBoxFocused?.();
  isFocused.value = true;
  dispatch('GotFocus');
};

const onEditorBlur = (setTextBoxBlurred?: () => void) => {
  setTextBoxBlurred?.();
  isFocused.value = false;
  dispatch('LostFocus');
};

const focus = () => {
  if (!props.IsEnabled) return;
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
  if (!props.IsEnabled || props.IsReadOnly) return;
  focus();
  restoreSelection();
  document.execCommand(command, false, value);
  saveSelection();
  onInput();
};

// Apply a character color to the current RichEditBox selection. When there is
// no selection WinUI's sample colors the whole document, which is also the
// useful default for the color-picker example.
const applyForegroundColor = (color: string, selectAllIfEmpty = true) => {
  if (!editorRef.value || props.IsReadOnly || !props.IsEnabled) return;
  focus();
  restoreSelection();
  const selection = window.getSelection();
  const inEditor = Boolean(selection?.rangeCount && editorRef.value.contains(selection.anchorNode));
  const hasRange = Boolean(inEditor && selection && !selection.getRangeAt(0).collapsed);
  if (!hasRange && selectAllIfEmpty) {
    const range = document.createRange();
    range.selectNodeContents(editorRef.value);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
  const before = selectionOffsets();
  document.execCommand('foreColor', false, color);
  saveSelection();
  onInput();
  const restored = domRange(before.StartPosition, before.EndPosition);
  if (restored) { selection?.removeAllRanges(); selection?.addRange(restored); savedSelection.value = restored; }
};

const setListStyleType = (styleType: string) => {
  const editor = editorRef.value;
  if (!editor || props.IsReadOnly || !props.IsEnabled) return;
  const selection = window.getSelection();
  const currentRange = selection?.rangeCount ? selection.getRangeAt(0) : null;
  const belongsToEditor = (range: Range | null) => Boolean(range
    && editor.contains(range.startContainer) && editor.contains(range.endContainer));
  const range = belongsToEditor(currentRange) ? currentRange
    : belongsToEditor(savedSelection.value) ? savedSelection.value : null;
  if (!range) return;

  const lists = new Set<HTMLElement>();
  const addList = (node: Node) => {
    const element = node instanceof Element ? node : node.parentElement;
    const list = element?.closest('ol, ul');
    if (list instanceof HTMLElement && editor.contains(list)) lists.add(list);
  };
  if (range.collapsed) addList(range.startContainer);
  else {
    // Target the selected paragraphs' closest list, including empty items.
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (range.intersectsNode(walker.currentNode)) addList(walker.currentNode);
    }
    editor.querySelectorAll('li:empty').forEach(item => {
      if (range.intersectsNode(item)) addList(item);
    });
  }
  if (!lists.size) return;
  lists.forEach((list) => {
    list.style.listStyleType = styleType;
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

const domRange = (start: number, end: number) => {
  const editor = editorRef.value;
  if (!editor) return null;
  const range = document.createRange(); range.selectNodeContents(editor);
  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = []; while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
  const point = (offset: number): [Node, number] => {
    let remaining = Math.max(0, offset);
    for (const node of textNodes) { if (remaining <= node.length) return [node, remaining]; remaining -= node.length; }
    return [editor, editor.childNodes.length];
  };
  const [startNode, startOffset] = point(start), [endNode, endOffset] = point(Math.max(start, end));
  range.setStart(startNode, startOffset); range.setEnd(endNode, endOffset);
  return range;
};

const textRange = (start: number, end: number) => {
  let position = Math.max(0, start), limit = Math.max(start, end), searchPosition = position;
  const format = (command: string, value: string) => {
    const range = domRange(position, limit);
    if (!range) return;
    const previous = selectionOffsets();
    const selection = window.getSelection(); selection?.removeAllRanges(); selection?.addRange(range);
    formatting = true; document.execCommand(command, false, value); formatting = false;
    const restored = domRange(previous.StartPosition, previous.EndPosition);
    if (restored) { selection?.removeAllRanges(); selection?.addRange(restored); savedSelection.value = restored; }
    onInput();
  };
  return {
    get StartPosition() { return position; },
    get EndPosition() { return limit; },
    SetRange: (nextStart: number, nextEnd: number) => { position = Math.max(0, nextStart); limit = Math.max(position, nextEnd); searchPosition = position; },
    GetText: () => domRange(position, limit)?.toString() ?? '',
    FindText: (query: string, count: number, options?: string) => {
      if (!query) return 0;
      const text = editorRef.value?.textContent ?? '';
      const matchCase = options?.includes('Case');
      const index = (matchCase ? text : text.toLocaleLowerCase()).indexOf(matchCase ? query : query.toLocaleLowerCase(), searchPosition);
      if (index < 0 || index >= searchPosition + count) return 0;
      position = index; limit = index + query.length; searchPosition = limit; return query.length;
    },
    CharacterFormat: {
      set ForegroundColor(value: string) { format('foreColor', value); },
      set BackgroundColor(value: string) { format('backColor', value); }
    }
  };
};

const selectionParagraphFormat = {
  get ListType() { return queryCommandState('insertOrderedList') ? 'UpperRoman' : queryCommandState('insertUnorderedList') ? 'Bullet' : 'None'; },
  set ListType(value: string) {
    const ordered = queryCommandState('insertOrderedList'), unordered = queryCommandState('insertUnorderedList');
    if (value === 'None') { if (ordered) execCommand('insertOrderedList'); if (unordered) execCommand('insertUnorderedList'); return; }
    const target = value === 'Bullet' ? 'insertUnorderedList' : 'insertOrderedList';
    if (!queryCommandState(target)) execCommand(target);
    setListStyleType(value === 'Bullet' ? 'disc' : value === 'UpperRoman' ? 'upper-roman' : 'decimal');
  }
};

const Document = {
  GetText: getText,
  SetText: (options: string, value: string) => options?.includes('Rtf') ? loadRtfDocument(value) : setText(value),
  LoadFromStream: async (options: string, source: Blob | ArrayBuffer | string) => {
    const value = source instanceof Blob ? await source.arrayBuffer() : source;
    if (options?.includes('Rtf')) await loadRtfDocument(value);
    else setText(typeof value === 'string' ? value : new TextDecoder().decode(value));
  },
  SaveToStream: (options: string) => new Blob([getText(options)], { type: options?.includes('Rtf') ? 'application/rtf' : 'text/plain;charset=utf-8' }),
  GetRange: textRange,
  Selection: {
    get StartPosition() { return selectionOffsets().StartPosition; },
    get EndPosition() { return selectionOffsets().EndPosition; },
    CharacterFormat: selectionCharacterFormat,
    ParagraphFormat: selectionParagraphFormat,
    SetRange: (start: number, end: number) => { const range = domRange(start, end); if (!range) return; const selection = window.getSelection(); selection?.removeAllRanges(); selection?.addRange(range); saveSelection(); emitSelection(); }
  },
  GetMathMode: () => mathMode.value,
  SetMathMode: setMathMode,
  GetMathML: serializeMathML,
  SetMathML: setMathML,
  get CanUndo() { return undoStack.value.length > 0; },
  get CanRedo() { return redoStack.value.length > 0; },
  Undo: undo,
  Redo: redo
};

const onCompositionStart = () => { composing = true; dispatch('TextCompositionStarted'); };
const onCompositionUpdate = () => dispatch('TextCompositionChanged');
const onCompositionEnd = () => { composing = false; dispatch('TextCompositionEnded'); onInput(); };

let rootSurface: HTMLElement | null = null;
onMounted(() => {
  syncDom();
  lastCommittedHtml = editorRef.value?.innerHTML ?? '';
  if (pendingMathMarkup.value && editorRef.value) { editorRef.value.innerHTML = pendingMathMarkup.value; pendingMathMarkup.value = ''; onInput(); }
  editorRef.value?.addEventListener('compositionstart', onCompositionStart);
  editorRef.value?.addEventListener('compositionupdate', onCompositionUpdate);
  editorRef.value?.addEventListener('compositionend', onCompositionEnd);
  rootSurface = editorRef.value?.closest('.win-rich-edit-box') as HTMLElement | null;
  rootSurface?.addEventListener('pointerdown', onRootPointerDown, true);
  rootSurface?.addEventListener('contextmenu', onRootContextMenu, true);
  dispatch('Loaded');
});

onBeforeUnmount(() => {
  dispatch('Unloaded');
  editorRef.value?.removeEventListener('compositionstart', onCompositionStart);
  editorRef.value?.removeEventListener('compositionupdate', onCompositionUpdate);
  editorRef.value?.removeEventListener('compositionend', onCompositionEnd);
  rootSurface?.removeEventListener('pointerdown', onRootPointerDown, true);
  rootSurface?.removeEventListener('contextmenu', onRootContextMenu, true);
  flyoutOpeningHandlers.Selection.clear(); flyoutOpeningHandlers.Context.clear();
  commandBarFlyout.value?.Hide();
});

const api: Record<string | symbol, unknown> = {
  [xamlControlIdentityKey]: true,
  Focus: focus,
  Document,
  TextDocument: Document,
  get SelectionFlyout() { return props.SelectionFlyout !== undefined ? props.SelectionFlyout : hasCustomSelectionFlyout.value ? customSelectionController.value : selectionFlyoutApi; },
  get ContextFlyout() { return props.ContextFlyout !== undefined ? props.ContextFlyout : hasCustomContextFlyout.value ? customContextController.value : contextFlyoutApi; },
  get Foreground() { return editorRef.value ? getComputedStyle(editorRef.value).color : ''; },
  get Background() { const border = editorRef.value?.closest('.win-textbox-border'); return border ? getComputedStyle(border).backgroundColor : ''; }
};
for (const name of Object.keys(rawProps)) {
  if (name in api) continue;
  Object.defineProperty(api, name, { enumerable: true, get: () => props[name as keyof typeof rawProps], set: value => {
    propertyOverrides[name] = value;
    updateXamlBinding(rawProps[name as keyof typeof rawProps], value, instance);
  } });
  watch(() => rawProps[name as keyof typeof rawProps], () => { delete propertyOverrides[name]; });
}
defineExpose(api);
</script>

<style>
.win-rich-edit-box {
  --rich-edit-box-min-height: 32px;
  max-width: 100%;
}

.win-rich-edit-box .win-textbox-border {
  min-height: var(--rich-edit-box-min-height);
  cursor: text;
}

.win-rich-edit-box .win-textbox-content {
  min-height: calc(var(--rich-edit-box-min-height) - 2px);
  cursor: text;
}

.win-reb-editor-scroll {
  flex: 1;
  min-width: 0;
  min-height: 0;
  cursor: text;
}

.win-reb-editor-scroll .win-scroll-viewer-viewport,
.win-reb-editor-scroll .scroll-content {
  height: 100%;
  min-height: 100%;
  cursor: text;
}

.win-reb-editor-scroll .scroll-content {
  display: flex;
}

.win-reb-editor {
  flex: 1 1 auto;
  width: 100%;
  min-height: max(var(--reb-editor-min-height, 30px), 100%);
  padding: var(--textbox-padding, 5px 6px 6px 10px);
  box-sizing: border-box;
  outline: 0;
  color: var(--textbox-foreground);
  font-family: var(--reb-font-family, "Segoe UI", system-ui, sans-serif);
  font-size: var(--reb-font-size, 14px);
  font-weight: var(--reb-font-weight, 400);
  font-style: var(--reb-font-style, normal);
  line-height: 20px;
  user-select: text;
  max-width: 100%;
}

.win-reb-editor ul,
.win-reb-editor ol {
  margin-block: 0;
  padding-inline-start: 24px;
}

.win-reb-editor li {
  margin-block: 0;
  padding-inline-start: 0;
}

.win-reb-editor img,
.win-reb-editor svg,
.win-reb-editor math {
  max-width: 100%;
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
