<template>
  <div
    ref="rootRef"
    class="win-textbox"
    v-bind="forwardedAttrs"
    :class="{
      'is-readonly': props.IsReadOnly,
      'is-disabled': isDisabled,
      'is-focused': isFocused,
      'is-hovered': isHovered,
      'candidate-window-bottom-edge': props.DesiredCandidateWindowAlignment === 'BottomEdge'
    }"
    :style="rootStyle">
    <div v-if="resolvedHeader || headerNodes.length" class="win-textbox-header">
      <HeaderOutlet />
    </div>

    <div
      class="win-textbox-border"
      v-acrylic-brush="backgroundStyle"
      :style="backgroundStyle"
      @pointerenter="onPointerEnter"
      @pointerleave="onPointerLeave">
      <div class="win-textbox-focus-border" aria-hidden="true"></div>
      <div class="win-textbox-content">
        <FieldOutlet v-if="inputTemplate?.Field" />
        <template v-else>
          <ScrollViewer
            class="win-textbox-content-element"
            HorizontalScrollMode="{x:Bind ScrollSettings.HorizontalScrollMode, Mode=OneWay}"
            VerticalScrollMode="{x:Bind ScrollSettings.VerticalScrollMode, Mode=OneWay}"
            HorizontalScrollBarVisibility="{x:Bind ScrollSettings.HorizontalScrollBarVisibility, Mode=OneWay}"
            VerticalScrollBarVisibility="{x:Bind ScrollSettings.VerticalScrollBarVisibility, Mode=OneWay}"
            IsHorizontalRailEnabled="{x:Bind ScrollSettings.IsHorizontalRailEnabled, Mode=OneWay}"
            IsVerticalRailEnabled="{x:Bind ScrollSettings.IsVerticalRailEnabled, Mode=OneWay}"
            IsHorizontalScrollChainingEnabled="{x:Bind ScrollSettings.IsHorizontalScrollChainingEnabled, Mode=OneWay}"
            IsVerticalScrollChainingEnabled="{x:Bind ScrollSettings.IsVerticalScrollChainingEnabled, Mode=OneWay}"
            IsDeferredScrollingEnabled="{x:Bind ScrollSettings.IsDeferredScrollingEnabled, Mode=OneWay}"
            IsEnabled="{x:Bind TextBoxScrollEnabled, Mode=OneWay}"
            ZoomMode="Disabled"
            IsTabStop="False">
          <textarea
            v-if="props.AcceptsReturn"
            rows="1"
            ref="fieldRef"
            class="win-textbox-field win-textbox-textarea"
            :value="currentText"
            :placeholder="props.PlaceholderText"
            :readonly="props.IsReadOnly"
            :disabled="isDisabled"
            :maxlength="props.MaxLength > 0 ? props.MaxLength : undefined"
            :spellcheck="props.IsSpellCheckEnabled"
            :inputmode="inputMode"
            :autocomplete="props.IsTextPredictionEnabled ? 'on' : 'off'"
            :autocapitalize="textPredictionAttr"
            :autocorrect="textPredictionAttr"
            :style="fieldStyle"
            :aria-label="resolveXamlValue(attrs['AutomationProperties.Name'], instance) || resolvedHeader"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            @keydown="onKeydown"
            @paste="onPaste"
            @contextmenu="onContextMenu"
            @select="onSelect"
            @pointerup="onSelectionPointerUp"
            @cut="onCuttingToClipboard"
            @copy="onCopyingToClipboard"
            @compositionstart="onCompositionStart"
            @compositionupdate="onCompositionChanged"
            @compositionend="onCompositionEnd"
            @pointerenter="onPointerEnter"
            @pointerleave="onPointerLeave" />

          <input
            v-else
            ref="fieldRef"
            class="win-textbox-field"
            type="text"
            :value="currentText"
            :placeholder="props.PlaceholderText"
            :readonly="props.IsReadOnly"
            :disabled="isDisabled"
            :maxlength="props.MaxLength > 0 ? props.MaxLength : undefined"
            :spellcheck="props.IsSpellCheckEnabled"
            :inputmode="inputMode"
            :autocomplete="props.IsTextPredictionEnabled ? 'on' : 'off'"
            :autocapitalize="textPredictionAttr"
            :autocorrect="textPredictionAttr"
            :style="fieldStyle"
            :aria-label="resolveXamlValue(attrs['AutomationProperties.Name'], instance) || resolvedHeader"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            @keydown="onKeydown"
            @paste="onPaste"
            @contextmenu="onContextMenu"
            @select="onSelect"
            @pointerup="onSelectionPointerUp"
            @cut="onCuttingToClipboard"
            @copy="onCopyingToClipboard"
            @compositionstart="onCompositionStart"
            @compositionupdate="onCompositionChanged"
            @compositionend="onCompositionEnd"
            @pointerenter="onPointerEnter"
            @pointerleave="onPointerLeave" />
          </ScrollViewer>
        </template>

        <button
          v-if="showDeleteButton"
          class="win-textbox-delete-button"
          type="button"
          :aria-label="t('text.clear-text')"
          v-bind="{ 'tooltipservice.tooltip': t('text.clear-text') }"
          @pointerdown.prevent
          @click="clearText">
          <span class="win-textbox-delete-button-layout">
            <span class="win-textbox-delete-glyph"></span>
          </span>
        </button>

        <ActionsOutlet v-if="inputTemplate?.Actions" />
      </div>
    </div>

    <div v-if="resolvedDescription || descriptionNodes.length" class="win-textbox-description">
      <DescriptionOutlet v-if="descriptionNodes.length" />
      <template v-else>{{ resolvedDescription }}</template>
    </div>

    <ContextMenu />
    <CustomFlyouts />
  </div>
</template>

<script lang="ts">
import { brushProperty } from './brushProperties';
import { defineComponent } from 'vue';
const textBoxProperty = (name: string) => defineComponent({ name: `TextBox.${name}`, __textInputProperty: name, setup: () => () => null });
export const TextBoxHeader = textBoxProperty('Header');
export const TextBoxHeaderTemplate = textBoxProperty('HeaderTemplate');
export const TextBoxDescription = textBoxProperty('Description');
export const TextBoxContextFlyout = textBoxProperty('ContextFlyout');
export const TextBoxSelectionFlyout = textBoxProperty('SelectionFlyout');
export default { Background: brushProperty('TextBox', 'Background'), Header: TextBoxHeader, HeaderTemplate: TextBoxHeaderTemplate, Description: TextBoxDescription, ContextFlyout: TextBoxContextFlyout, SelectionFlyout: TextBoxSelectionFlyout };
</script>

<script setup lang="ts">
import { cloneVNode, computed, defineComponent, Fragment, h, getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, useAttrs, useSlots, watch } from 'vue';
import type { CSSProperties } from 'vue';
import { textCommandFlyout } from './textCommandFlyout';
import { useI18n } from './i18n/index';
import { eventNames, normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime';
import { textInputTemplateKey } from './textInputTemplate';
import { alignment, cssLength, xamlThickness } from './layout';
import ScrollViewer from './ScrollViewer.vue';
import { scrollViewerTemplateBindings } from './scrollViewerTemplateBindings';
import { useAcrylicBrushStyle } from './AcrylicBrush';
import { vAcrylicBrush } from './acrylicBrushVisual';
import { useBrushProperty } from './brushProperties';
import { getVNodeChildren } from './CollectionProperties';
import ContentPresenter from './ContentPresenter.vue';
import { xamlResourceDictionaryKey } from './Page.vue';

defineOptions({ inheritAttrs: false });

const { t } = useI18n();
const instance = getCurrentInstance();
const attrs = useAttrs();
const slots = useSlots();
const propertyNodes = (name: string) => {
  const collect = (nodes: ReturnType<NonNullable<typeof slots.default>>): ReturnType<NonNullable<typeof slots.default>> => nodes.flatMap(node => node.type === Fragment ? collect(getVNodeChildren(node)) : (node.type as { __textInputProperty?: string })?.__textInputProperty === name ? getVNodeChildren(node) : []);
  return normalizeXamlNodes(collect(slots.default?.() ?? []),instance);
};
const headerNodes = computed(() => propertyNodes('Header'));
const resources = inject(xamlResourceDictionaryKey, {});
const headerTemplate = computed(() => {
  const declaration = propertyNodes('HeaderTemplate')[0];
  if (declaration) return declaration;
  const name = String(rawProps.HeaderTemplate ?? '').match(/^\{(?:StaticResource|ThemeResource)\s+([^}]+)\}$/)?.[1];
  return name && resources[name] ? resources[name] : resolveXamlValue(rawProps.HeaderTemplate, instance);
});
const descriptionNodes = computed(() => propertyNodes('Description'));
const HeaderOutlet = defineComponent({ setup: () => () => headerNodes.value.length ? h(Fragment,headerNodes.value)
  : h(ContentPresenter, { Content: resolvedHeader.value, ContentTemplate: headerTemplate.value }) });
const DescriptionOutlet = defineComponent({ setup: () => () => h(Fragment,descriptionNodes.value) });
const inputTemplate = inject(textInputTemplateKey, null);
const FieldOutlet = defineComponent({ setup: () => () => h(Fragment, [inputTemplate?.Field?.({ Focused: onFocus, Blurred: onBlur, PointerEntered: onPointerEnter, PointerExited: onPointerLeave })]) });
const ActionsOutlet = defineComponent({ setup: () => () => h(Fragment, [inputTemplate?.Actions?.()]) });
const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([name]) => !name.startsWith('ScrollViewer.') && !eventNames.has(name) && !name.startsWith('AutomationProperties.'))));
const ScrollSettings = scrollViewerTemplateBindings(name => attrs[name], instance, {
  HorizontalScrollMode: 'Auto', VerticalScrollMode: 'Auto',
  HorizontalScrollBarVisibility: 'Hidden', VerticalScrollBarVisibility: 'Hidden',
  IsDeferredScrollingEnabled: false
});
const inheritedScrollTemplateScope = inject(xamlScopeKey, {});
provide(xamlScopeKey, Object.assign(Object.create(inheritedScrollTemplateScope), { ScrollSettings,
  TextBoxScrollEnabled: computed(() => !isDisabled.value)
}));

type TextAlignment = 'Left' | 'Center' | 'Right' | 'Justify';
type TextWrapping = 'NoWrap' | 'Wrap' | 'WrapWholeWords';
type CharacterCasing = 'Normal' | 'Lower' | 'Upper';
type CandidateWindowAlignment = 'Default' | 'BottomEdge';
type TextBoxMenuCommand = 'cut' | 'copy' | 'paste' | 'undo' | 'redo' | 'selectAll';
type TextBoxMenuItem = {
  Text?: string;
  Background?: string | object;
  Icon?: string;
  Value?: TextBoxMenuCommand;
};

const rawProps = withDefaults(defineProps<{
  Text?: string;
  PlaceholderText?: string;
  Header?: unknown;
  HeaderTemplate?: unknown;
  ContextFlyout?: unknown;
  SelectionFlyout?: unknown;
  Description?: string;
  AcceptsReturn?: boolean | string;
  IsReadOnly?: boolean | string;
  IsEnabled?: boolean | string;
  MaxLength?: number | string;
  TextWrapping?: TextWrapping;
  TextAlignment?: TextAlignment;
  IsSpellCheckEnabled?: boolean | string;
  IsTextPredictionEnabled?: boolean | string;
  InputScope?: string;
  CharacterCasing?: CharacterCasing;
  SelectionHighlightColor?: string;
  DesiredCandidateWindowAlignment?: CandidateWindowAlignment;
  IsColorFontEnabled?: boolean | string;
  PreventKeyboardDisplayOnProgrammaticFocus?: boolean | string;

  FontFamily?: string;
  FontSize?: number | string;
  FontStyle?: string;
  FontWeight?: number | string;
  Foreground?: string;
  Background?: string;
  BorderBrush?: string;
  BorderThickness?: number | string;
  Padding?: number | string;
  CornerRadius?: number | string;
  PlaceholderForeground?: string;
  CharacterSpacing?: number | string;
  Width?: number | string;
  Height?: number | string;
  Margin?: number | string;
  HorizontalAlignment?: string;
  VerticalAlignment?: string;
  MinWidth?: number | string;
  MaxWidth?: number | string;
  MinHeight?: number | string;
  MaxHeight?: number | string;
}>(), {
  PlaceholderText: '',
  Background: '',
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
  BorderBrush: '',
  BorderThickness: 1,
  Padding: '',
  CornerRadius: 4,
  PlaceholderForeground: '',
  CharacterSpacing: 0,
  Width: '',
  Height: '',
  Margin: '',
  HorizontalAlignment: '',
  VerticalAlignment: '',
  MinWidth: '',
  MaxWidth: '',
  MinHeight: '',
  MaxHeight: ''
});
const propertyOverrides = ref<Record<string, unknown>>({});
const props = new Proxy(rawProps, { get: (target, property) => typeof property === 'string' && property in propertyOverrides.value
  ? propertyOverrides.value[property] : resolveXamlValue(Reflect.get(target, property), instance) });
const resolvedHeader = computed(() => resolveXamlValue(props.Header, instance));
const resolvedDescription = computed(() => resolveXamlValue(props.Description, instance));
const resolvedText = computed(() => {
  const value = resolveXamlValue(props.Text, instance);
  return value === undefined || value === null ? '' : String(value);
});

const emit = defineEmits<{
  'update:Text': [value: string];
  BeforeTextChanging: [args: { NewText: string; Cancel: boolean }];
  TextChanging: [args: { IsContentChanging: boolean }];
  TextChanged: [];
  SelectionChanged: [];
  SelectionChanging: [args: { SelectionStart: number; SelectionLength: number; Cancel: boolean }];
  GotFocus: [];
  LostFocus: [];
  KeyDown: [args: { Key: string; OriginalSource: HTMLElement | null; Handled: boolean }];
  Paste: [args: { Handled: boolean }];
  CuttingToClipboard: [args: { Handled: boolean }];
  CopyingToClipboard: [args: { Handled: boolean }];
  ContextMenuOpening: [args: { Handled: boolean; CursorLeft: number; CursorTop: number }];
  CandidateWindowBoundsChanged: [args: { Bounds: DOMRectReadOnly }];
  TextCompositionStarted: [];
  TextCompositionChanged: [];
  TextCompositionEnded: [];
}>();
const dispatch = (name: string, args?: unknown) => {
  const sender = instance?.exposeProxy ?? instance?.exposed ?? instance?.proxy;
  const eventArgs = args ?? { OriginalSource: fieldRef.value, Handled: false };
  const listener = instance?.vnode.props?.[`on${name}`];
  if (listener) {
    for (const handler of Array.isArray(listener) ? listener : [listener]) if (typeof handler === 'function') handler(sender, eventArgs);
  } else {
    (emit as (name: string, ...args: unknown[]) => void)(name, sender, eventArgs);
    resolveXamlHandler(attrs[name],instance)?.(sender,eventArgs);
  }
};

const rootRef = ref<HTMLElement | null>(null);
const naturalFieldWidth = ref(62);
const surfaceWidth = ref(0);
const naturalControlWidth = computed(() => naturalFieldWidth.value + 2 + (inputTemplate?.ActionsWidth?.() ?? 0) + (inputTemplate?.ReserveDeleteButtonWidth ?? 0));
watch(naturalControlWidth, width => inputTemplate?.DesiredWidthChanged?.(width), { immediate: true });
const fieldRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
let editorResizeObserver: ResizeObserver | undefined;
let caretFrame: number | undefined;
const isFocused = ref(false);
const isHovered = ref(false);
const localText = ref(resolvedText.value);
const undoStack = ref<string[]>([]);
const redoStack = ref<string[]>([]);
const clipboardText = ref('');
const contextMenuOpen = ref(false);
const contextMenuRef = ref<any>(null);
const flyoutKind = ref<'Context' | 'Selection'>('Context');
const customContextFlyout = ref<any>(null);
const customSelectionFlyout = ref<any>(null);
const CustomFlyouts = defineComponent({ setup: () => () => h(Fragment, ['ContextFlyout', 'SelectionFlyout'].flatMap(name =>
  propertyNodes(name).map(node => cloneVNode(node, { ref: (control: unknown) => {
    if (name === 'ContextFlyout') customContextFlyout.value = control;
    else customSelectionFlyout.value = control;
  } }, true)))) });
let contextRequest = 0;
const isRestoringContextMenuFocus = ref(false);
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

// Text is a mutable dependency property. A XAML OneWay binding supplies its
// value but must still allow edits until the source changes again.
const currentText = computed(() => localText.value);
const isDisabled = computed(() => !props.IsEnabled);
const backgroundBrush = useBrushProperty('Background', () => props.Background, () => slots.default?.() ?? [], instance);
const backgroundStyle = useAcrylicBrushStyle(() => isDisabled.value || isFocused.value || isHovered.value
  ? undefined : backgroundBrush.value.value, instance);
const hasText = computed(() => currentText.value.length > 0);
const showDeleteButton = computed(() =>
  !inputTemplate?.HideDeleteButton && hasText.value && !props.AcceptsReturn && !props.IsReadOnly && props.IsEnabled && isFocused.value
    && surfaceWidth.value > (Number(props.FontSize) || 14) * 5
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
  return cssLength(value);
};

const rootStyle = computed<CSSProperties & Record<string, string | number | undefined>>(() => {
  const style: CSSProperties & Record<string, string | number | undefined> = {};
  if (props.Padding !== '') style['--textbox-padding'] = xamlThickness(props.Padding);
  style['--textbox-natural-width'] = `${naturalFieldWidth.value}px`;
  style['--textbox-radius'] = cssSize(props.CornerRadius);
  style['--textbox-border-thickness'] = xamlThickness(props.BorderThickness);
  if (props.BorderBrush) { style['--textbox-border-top'] = props.BorderBrush; style['--textbox-border-bottom'] = props.BorderBrush; }
  if (props.PlaceholderForeground) style['--textbox-placeholder-foreground'] = props.PlaceholderForeground;
  if (props.SelectionHighlightColor) {
    style['--textbox-selection-background'] = props.SelectionHighlightColor;
  }
  if (props.Width !== '') style.width = cssSize(props.Width);
  if (props.Height !== '') style.height = cssSize(props.Height);
  if (props.Margin !== '') style.margin = xamlThickness(props.Margin);
  if (props.HorizontalAlignment) style.justifySelf = alignment(props.HorizontalAlignment, 'horizontal');
  if (props.VerticalAlignment) style.alignSelf = alignment(props.VerticalAlignment, 'vertical');
  const minimum = cssSize(props.MinWidth === '' ? 64 : props.MinWidth);
  // Helper buttons occupy the existing input surface and do not change its
  // desired width when focus makes them visible.
  style.minWidth = minimum ? `min(max(${minimum}, ${naturalControlWidth.value}px), 100%)` : undefined;
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
  if (props.FontWeight !== '') style.fontWeight = ({ Normal: 400, SemiBold: 600, Bold: 700, Light: 300 } as Record<string, number>)[String(props.FontWeight)] ?? props.FontWeight;
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

  if (canEdit && canUndo.value) {
    items.push({ Text: t('text.undo'), Icon: '\uE7A7', Value: 'undo' });
  }

  if (canEdit && canRedo.value) {
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

const emitTextValue = (value: string, _reason: 'UserInput' | 'ProgrammaticChange', options: { undo?: boolean } = {}) => {
  const previous = currentText.value;
  if (previous === value) return;
  if (options.undo) pushUndo(previous);

  localText.value = value;
  dispatch('TextChanging', { IsContentChanging: true });
  emit('update:Text', value);
  updateXamlBinding(rawProps.Text, value, instance);
  dispatch('TextChanged');
};

const resizeTextarea = () => {
  const element = fieldRef.value;
  if (!element) return;
  const viewport = element.closest('.win-scroll-viewer-viewport') as HTMLElement | null;
  if (!viewport || viewport.clientWidth === 0) return;
  const style = getComputedStyle(element);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  let contentWidth = 0;
  if (context) {
    context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    contentWidth = element.value.split('\n').reduce((maximum, line) => Math.max(maximum, context.measureText(line).width), 0);
  }
  const padding = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
  if (context) {
    const placeholderWidth = context.measureText(String(props.PlaceholderText ?? '')).width;
    const spacing = (parseFloat(style.letterSpacing) || 0) * Math.max(0, (element.value || props.PlaceholderText || '').length - 1);
    naturalFieldWidth.value = Math.max(62, Math.ceil(Math.max(contentWidth, placeholderWidth) + spacing + padding + 1));
  }
  const canScrollHorizontally = ScrollSettings.HorizontalScrollMode !== 'Disabled' && ScrollSettings.HorizontalScrollBarVisibility !== 'Disabled';
  const wrap = props.AcceptsReturn && props.TextWrapping !== 'NoWrap';
  element.style.width = `${wrap || !canScrollHorizontally ? viewport.clientWidth : Math.max(viewport.clientWidth, Math.ceil(contentWidth + padding + 1))}px`;
  if (element instanceof HTMLTextAreaElement) {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }
  // The shared ScrollViewer owns scrolling. Native editing fields must not
  // retain a second, hidden scroll offset after browser caret navigation.
  element.scrollLeft = 0;
  element.scrollTop = 0;
};

const scrollCaretIntoView = () => {
  const element = fieldRef.value;
  if (!element || document.activeElement !== element) return;
  const viewport = element.closest('.win-scroll-viewer-viewport') as HTMLElement | null;
  if (!viewport) return;
  const caretIndex = element.selectionDirection === 'backward' ? element.selectionStart : element.selectionEnd;
  const caret = getRectFromCharacterIndex(caretIndex ?? 0);
  const bounds = viewport.getBoundingClientRect();
  const style = getComputedStyle(element);
  const leftInset = parseFloat(style.paddingLeft) || 0;
  const topInset = parseFloat(style.paddingTop) || 0;
  if (ScrollSettings.HorizontalScrollMode !== 'Disabled' && ScrollSettings.HorizontalScrollBarVisibility !== 'Disabled') {
    if (caret.x < bounds.left + leftInset) viewport.scrollLeft += caret.x - bounds.left - leftInset;
    else if (caret.x + caret.width > bounds.right - 6) viewport.scrollLeft += caret.x + caret.width - bounds.right + 6;
  }
  if (ScrollSettings.VerticalScrollMode !== 'Disabled' && ScrollSettings.VerticalScrollBarVisibility !== 'Disabled') {
    if (caret.y < bounds.top + topInset) viewport.scrollTop += caret.y - bounds.top - topInset;
    else if (caret.y + caret.height > bounds.bottom - 6) viewport.scrollTop += caret.y + caret.height - bounds.bottom + 6;
  }
};
const scheduleCaretIntoView = () => {
  if (caretFrame !== undefined) cancelAnimationFrame(caretFrame);
  caretFrame = requestAnimationFrame(() => {
    caretFrame = undefined;
    resizeTextarea();
    scrollCaretIntoView();
  });
};

watch(resolvedText, value => {
  if (localText.value !== value) {
    emitTextValue(value, 'ProgrammaticChange');
  }
  void nextTick(resizeTextarea);
});
watch(rawProps, () => { propertyOverrides.value = {}; });
watch(isDisabled, disabled => {
  if (disabled) { isHovered.value = false; isFocused.value = false; contextMenuRef.value?.Hide?.(); fieldRef.value?.blur(); }
});

watch(() => [props.AcceptsReturn, props.TextWrapping, props.FontFamily, props.FontSize, props.FontWeight, props.CharacterSpacing], () => void nextTick(resizeTextarea));

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
  const beforeChangingArgs = { NewText: nextValue, Cancel: false };

  dispatch('BeforeTextChanging', beforeChangingArgs);
  if (beforeChangingArgs.Cancel) {
    element.value = currentText.value;
    return;
  }

  if (element.value !== nextValue) {
    element.value = nextValue;
  }

  emitTextValue(nextValue, 'UserInput', { undo: true });
  resizeTextarea();
  scheduleCaretIntoView();
};

const onFocus = () => {
  isFocused.value = true;
  requestCandidateWindowAlignment();
  dispatch('GotFocus');
  resizeTextarea();
  scheduleCaretIntoView();
};

const onBlur = () => {
  // A TextBox context menu is a logical child of the control even though its
  // flyout is teleported to body. Keep the TextBox focused until that flyout
  // closes and restores DOM focus to the editing field.
  if (contextMenuOpen.value || isRestoringContextMenuFocus.value) return;
  isFocused.value = false;
  requestCandidateWindowAlignment('Default');
  dispatch('LostFocus');
};

const applyLegacyCandidateWindowAlignment = () => {
  const field = fieldRef.value;
  if (!field) return;
  field.style.setProperty(
    '-ms-ime-align',
    props.DesiredCandidateWindowAlignment === 'BottomEdge' ? 'after' : 'auto'
  );
};

const requestCandidateWindowAlignment = (
  alignment: CandidateWindowAlignment = props.DesiredCandidateWindowAlignment
) => {
  applyLegacyCandidateWindowAlignment();
  const field = fieldRef.value;
  if (!field) return;
  const border = field.closest('.win-textbox-border') as HTMLElement | null;
  const rect = (border ?? field).getBoundingClientRect();
  const textEditControlBounds = {
    x: rect.x,
    y: rect.y,
    top: rect.top,
    bottom: rect.bottom,
    left: rect.left,
    right: rect.right,
    width: rect.width,
    height: rect.height
  };

  const hostWindow = window as Window & {
    chrome?: { webview?: { postMessage?: (message: unknown) => void } };
  };
  hostWindow.chrome?.webview?.postMessage?.({
    source: 'WinUIonWeb',
    type: 'desiredCandidateWindowAlignmentChanged',
    DesiredCandidateWindowAlignment: alignment,
    TextEditControlBounds: textEditControlBounds,
    devicePixelRatio: window.devicePixelRatio,
    visualViewport: window.visualViewport ? {
      offsetLeft: window.visualViewport.offsetLeft,
      offsetTop: window.visualViewport.offsetTop,
      scale: window.visualViewport.scale
    } : null
  });
};

const onCompositionStart = () => {
  requestCandidateWindowAlignment();
  dispatch('TextCompositionStarted');
};

const onCompositionChanged = () => {
  requestCandidateWindowAlignment();
  dispatch('TextCompositionChanged');
};

const onCompositionEnd = () => {
  dispatch('TextCompositionEnded');
};

watch(() => props.DesiredCandidateWindowAlignment, () => {
  void nextTick(() => {
    applyLegacyCandidateWindowAlignment();
    if (isFocused.value) requestCandidateWindowAlignment();
  });
});

const onPointerEnter = () => {
  isHovered.value = true;
};

const onPointerLeave = () => {
  isHovered.value = false;
};

const onKeydown = (event: KeyboardEvent) => {
  inputTemplate?.KeyDown?.(event);
  const args = { Key: event.key, OriginalSource: fieldRef.value, Handled: event.defaultPrevented };
  dispatch('KeyDown', args);
  if (args.Handled) { event.preventDefault(); return; }
  if ((event.ctrlKey || event.metaKey) && !props.IsReadOnly) {
    if (event.key.toLowerCase() === 'z') { event.preventDefault(); event.shiftKey ? redo() : undo(); }
    if (event.key.toLowerCase() === 'y') { event.preventDefault(); redo(); }
  }
  if (event.key === 'Enter' && !props.AcceptsReturn) {
    event.preventDefault();
  }
  scheduleCaretIntoView();
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

const lastSelection = ref({ start: 0, length: 0, text: '' });
let restoringSelection = false;
const onSelect = () => {
  if (restoringSelection) return;
  const selection = readSelection();
  if (selection.start === lastSelection.value.start && selection.length === lastSelection.value.length) return;
  const changingArgs = { SelectionStart: selection.start, SelectionLength: selection.length, Cancel: false };
  dispatch('SelectionChanging', changingArgs);
  if (changingArgs.Cancel) {
    restoringSelection = true;
    fieldRef.value?.setSelectionRange(lastSelection.value.start, lastSelection.value.start + lastSelection.value.length);
    queueMicrotask(() => { restoringSelection = false; });
    return;
  }
  lastSelection.value = selection;
  dispatch('SelectionChanged');
  scheduleCaretIntoView();
};

const onCuttingToClipboard = (event: ClipboardEvent) => {
  const args = { Handled: false };
  dispatch('CuttingToClipboard', args);
  if (args.Handled) event.preventDefault();
};

const onCopyingToClipboard = (event: ClipboardEvent) => {
  const args = { Handled: false };
  dispatch('CopyingToClipboard', args);
  if (args.Handled) event.preventDefault();
};

const onPaste = (event: ClipboardEvent) => {
  const args = { Handled: false };
  dispatch('Paste', args);
  if (args.Handled) event.preventDefault();
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
  const args = { Handled: false, CursorLeft: event.offsetX, CursorTop: event.offsetY };
  dispatch('ContextMenuOpening', args);
  if (args.Handled || props.ContextFlyout === null) return;

  // WinUI focuses a TextBox from the pointer before opening its selection
  // menu. This also makes a second TextBox right-tapped while another menu is
  // closing become the popup's previous-focus target.
  fieldRef.value?.focus({ preventScroll: true });
  flyoutKind.value = 'Context';
  const custom = customContextFlyout.value ?? props.ContextFlyout;
  if (custom?.ShowAt && fieldRef.value) {
    const bounds = fieldRef.value.getBoundingClientRect();
    void custom.ShowAt(fieldRef.value, { Position: { X: event.clientX - bounds.left, Y: event.clientY - bounds.top } });
    return;
  }
  const request = ++contextRequest;
  contextMenuOpen.value = false;
  contextSelection.value = readSelection();
  clipboardText.value = await readClipboardText();
  if (request !== contextRequest || !fieldRef.value?.isConnected || isDisabled.value) return;

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
  isRestoringContextMenuFocus.value = true;
  contextMenuOpen.value = true;
  await nextTick();
  const target = fieldRef.value;
  if (target) void contextMenuRef.value?.ShowAt?.(target, { Position: { X: event.clientX - target.getBoundingClientRect().left, Y: event.clientY - target.getBoundingClientRect().top } });
};

const onSelectionPointerUp = async (event: PointerEvent) => {
  if (event.button !== 0 || isDisabled.value || props.SelectionFlyout === null) return;
  contextSelection.value = readSelection();
  if (!contextSelection.value.length || !fieldRef.value) return;
  flyoutKind.value = 'Selection';
  const custom = customSelectionFlyout.value ?? props.SelectionFlyout;
  if (custom?.ShowAt) { void custom.ShowAt(fieldRef.value, { ShowMode: 'Transient' }); return; }
  clipboardText.value = await readClipboardText();
  await nextTick();
  void contextMenuRef.value?.ShowAt?.(fieldRef.value, { ShowMode: 'Transient', Placement: 'TopEdgeAlignedLeft' });
};

const clearText = () => {
  emitTextValue('', 'ProgrammaticChange', { undo: true });
  requestAnimationFrame(() => {
    fieldRef.value?.focus();
    resizeTextarea();
  });
};

const closeContextMenu = () => {
  contextRequest++;
  contextMenuOpen.value = false;
  contextMenuRef.value?.Hide?.();
  nextTick(() => {
    focus();
    requestAnimationFrame(() => {
      isRestoringContextMenuFocus.value = false;
    });
  });
};

const onContextMenuClosed = () => {
  // Closed follows the presenter's own focus decision. External dismissal or
  // another menu opening must not schedule a second focus restoration here.
  contextMenuOpen.value = false;
  isRestoringContextMenuFocus.value = false;
  if (document.activeElement !== fieldRef.value) onBlur();
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

const ContextMenu = textCommandFlyout(contextMenuRef, () => contextMenuItems.value, onContextMenuSelect, onContextMenuClosed,
  () => ({ ShowMode: flyoutKind.value === 'Selection' ? 'Transient' : 'Standard' }));

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
  const normalizedIndex = Math.max(0, Math.min(index, element.value.length));
  const lineHeight = parseFloat(computedStyle.lineHeight) || 20;
  // A measurement-only mirror uses the same text layout as the native editor,
  // including wrapping, explicit newlines, alignment and character spacing.
  const mirror = document.createElement('div');
  for (const name of ['fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'lineHeight', 'letterSpacing', 'textAlign', 'overflowWrap', 'wordBreak', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'boxSizing'] as const) mirror.style[name] = computedStyle[name];
  Object.assign(mirror.style, { position: 'fixed', visibility: 'hidden', pointerEvents: 'none', top: '0', left: '0', width: `${element.clientWidth}px`, whiteSpace: props.AcceptsReturn && props.TextWrapping !== 'NoWrap' ? 'pre-wrap' : 'pre' });
  mirror.textContent = element.value.slice(0, normalizedIndex);
  const marker = document.createElement('span');
  marker.textContent = '\u200b';
  mirror.append(marker);
  document.body.append(mirror);
  const caret = marker.getBoundingClientRect();
  const result = {
    x: rect.left + caret.left - element.scrollLeft + (trailingEdge ? 1 : 0),
    y: rect.top + caret.top - element.scrollTop,
    width: 1,
    height: lineHeight
  };
  mirror.remove();
  return result;
};

const replaceSelectedText = (replacement: string) => {
  const element = fieldRef.value;
  if (!element) return;
  const selection = readSelection();
  replaceTextRange(selection.start, selection.length, replacement);
};

const replaceTextRange = (start: number, length: number, replacement: string) => {
  const element = fieldRef.value;
  if (!element || props.IsReadOnly || isDisabled.value) return;
  const selectionStart = Math.max(0, Math.min(start, element.value.length));
  const selectionLength = Math.max(0, Math.min(length, element.value.length - selectionStart));
  const nextValue = normalizeInput(
    element.value.slice(0, selectionStart) + replacement + element.value.slice(selectionStart + selectionLength)
  );
  const before = { NewText: nextValue, Cancel: false };
  dispatch('BeforeTextChanging', before);
  if (before.Cancel) return;
  element.value = nextValue;
  emitTextValue(nextValue, 'ProgrammaticChange', { undo: true });
  requestAnimationFrame(resizeTextarea);
};

const undo = () => {
  if (props.IsReadOnly || isDisabled.value || !undoStack.value.length) return;
  const previous = undoStack.value.pop() ?? '';
  redoStack.value.push(currentText.value);
  emitTextValue(previous, 'ProgrammaticChange');
  requestAnimationFrame(resizeTextarea);
};

const redo = () => {
  if (props.IsReadOnly || isDisabled.value || !redoStack.value.length) return;
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
  const args = { Handled: false };
  dispatch('Paste', args);
  if (args.Handled || props.IsReadOnly || isDisabled.value) return;
  const text = await readClipboardText();
  if (text !== undefined) replaceSelectedText(text);
};

const copyContextSelectionToClipboard = () => {
  const args = { Handled: false };
  dispatch('CopyingToClipboard', args);
  if (args.Handled) return;
  if (contextSelection.value.text) void navigator.clipboard?.writeText(contextSelection.value.text);
};

const cutContextSelectionToClipboard = () => {
  const args = { Handled: false };
  dispatch('CuttingToClipboard', args);
  if (args.Handled || props.IsReadOnly || isDisabled.value) return;
  if (!contextSelection.value.text) return;
  void navigator.clipboard?.writeText(contextSelection.value.text);
  replaceTextRange(contextSelection.value.start, contextSelection.value.length, '');
};

onMounted(() => {
  applyLegacyCandidateWindowAlignment();
  void nextTick(() => {
    resizeTextarea();
    const viewport = fieldRef.value?.closest('.win-scroll-viewer-viewport');
    editorResizeObserver = new ResizeObserver(() => {
      surfaceWidth.value = rootRef.value?.querySelector('.win-textbox-border')?.getBoundingClientRect().width ?? 0;
      resizeTextarea();
    });
    if (rootRef.value) editorResizeObserver.observe(rootRef.value);
    if (viewport) editorResizeObserver.observe(viewport);
  });
});

onBeforeUnmount(() => {
  contextRequest++;
  editorResizeObserver?.disconnect();
  if (caretFrame !== undefined) cancelAnimationFrame(caretFrame);
  if (isFocused.value) requestCandidateWindowAlignment('Default');
  undoStack.value = [];
  redoStack.value = [];
  contextMenuOpen.value = false;
  isRestoringContextMenuFocus.value = false;
});

defineExpose({
  get Element() { return fieldRef.value; },
  get IsEnabled() { return props.IsEnabled; }, set IsEnabled(value: boolean) { propertyOverrides.value.IsEnabled = value; },
  get IsReadOnly() { return props.IsReadOnly; }, set IsReadOnly(value: boolean) { propertyOverrides.value.IsReadOnly = value; },
  get AcceptsReturn() { return props.AcceptsReturn; }, set AcceptsReturn(value: boolean) { propertyOverrides.value.AcceptsReturn = value; },
  get TextWrapping() { return props.TextWrapping; }, set TextWrapping(value: TextWrapping) { propertyOverrides.value.TextWrapping = value; },
  get Text() {
    return currentText.value;
  },
  set Text(value: string) {
    const nextValue = value === undefined || value === null ? '' : String(value);
    if (nextValue === currentText.value) return;
    emitTextValue(nextValue, 'ProgrammaticChange');
    void nextTick(resizeTextarea);
  },
  Focus: focus,
  get ContextFlyout() { return props.ContextFlyout !== undefined ? props.ContextFlyout : customContextFlyout.value ?? contextMenuRef.value; },
  set ContextFlyout(value: unknown) { propertyOverrides.value.ContextFlyout = value; },
  get SelectionFlyout() { return props.SelectionFlyout !== undefined ? props.SelectionFlyout : customSelectionFlyout.value ?? contextMenuRef.value; },
  set SelectionFlyout(value: unknown) { propertyOverrides.value.SelectionFlyout = value; },
  SelectAll: selectAll,
  Select: select,
  GetRectFromCharacterIndex: getRectFromCharacterIndex,
  Undo: undo,
  Redo: redo,
  CopySelectionToClipboard: copySelectionToClipboard,
  CutSelectionToClipboard: cutSelectionToClipboard,
  PasteFromClipboard: pasteFromClipboard,
  get CanUndo() {
    return canUndo.value;
  },
  get CanRedo() {
    return canRedo.value;
  },
  get SelectedText() {
    return readSelection().text;
  },
  set SelectedText(value: string) {
    replaceSelectedText(value);
  },
  get SelectionStart() {
    return readSelection().start;
  },
  set SelectionStart(value: number) { select(value, readSelection().length); },
  get SelectionLength() {
    return readSelection().length;
  },
  set SelectionLength(value: number) { select(readSelection().start, value); }
});
</script>

<style scoped>
.win-textbox {
  --textbox-content-min-height: max(0px, calc(var(--TextControlThemeMinHeight, 32px) - 2px));
  --textbox-background: var(--TextControlBackground, var(--ControlFillColorDefaultBrush, var(--control-fill-color-default, var(--ctrl-fill-default, rgba(255, 255, 255, 0.70)))));
  --textbox-background-pointer-over: var(--TextControlBackgroundPointerOver, var(--ControlFillColorSecondaryBrush, var(--control-fill-color-secondary, var(--ctrl-fill-secondary))));
  --textbox-background-pressed: var(--ControlFillColorTertiaryBrush, var(--control-fill-color-tertiary, var(--ctrl-fill-tertiary)));
  --textbox-background-focused: var(--TextControlBackgroundFocused, var(--ControlFillColorInputActiveBrush, var(--control-fill-color-input-active, var(--ctrl-fill-input-active))));
  --textbox-background-disabled: var(--TextControlBackgroundDisabled, var(--ControlFillColorDisabledBrush, var(--control-fill-color-disabled, var(--ctrl-fill-disabled))));
  --textbox-border-top: var(--ControlStrokeColorDefaultBrush, var(--control-stroke-color-default, var(--ctrl-border-rest)));
  --textbox-border-bottom: var(--ControlStrongStrokeColorDefaultBrush, var(--control-strong-stroke-color-default, var(--ctrl-strong-stroke)));
  --textbox-border-focused: var(--SystemAccentColorDark1, var(--AccentFillColorDefaultBrush, var(--accent-base)));
  --textbox-foreground: var(--TextControlForeground, var(--TextFillColorPrimaryBrush, var(--text-primary, var(--text-fill-color-primary))));
  --textbox-foreground-pointer-over: var(--TextControlForegroundPointerOver, var(--TextFillColorPrimaryBrush, var(--text-primary, var(--text-fill-color-primary))));
  --textbox-foreground-focused: var(--TextControlForegroundFocused, var(--TextFillColorPrimaryBrush, var(--text-primary, var(--text-fill-color-primary))));
  --textbox-foreground-disabled: var(--TextControlForegroundDisabled, var(--TextFillColorDisabledBrush, var(--text-disabled, var(--text-fill-color-disabled))));
  --textbox-placeholder-foreground: var(--TextControlPlaceholderForeground, var(--TextFillColorSecondaryBrush, var(--text-secondary, var(--text-fill-color-secondary))));
  --textbox-placeholder-foreground-pointer-over: var(--TextControlPlaceholderForegroundPointerOver, var(--TextFillColorSecondaryBrush, var(--text-secondary, var(--text-fill-color-secondary))));
  --textbox-placeholder-foreground-focused: var(--TextControlPlaceholderForegroundFocused, var(--TextFillColorSecondaryBrush, var(--text-secondary, var(--text-fill-color-secondary))));
  --textbox-placeholder-foreground-disabled: var(--TextControlPlaceholderForegroundDisabled, var(--TextFillColorDisabledBrush, var(--text-disabled, var(--text-fill-color-disabled))));
  --textbox-button-background-pointer-over: var(--TextControlButtonBackgroundPointerOver, var(--SubtleFillColorSecondaryBrush, var(--subtle-fill-color-secondary, var(--subtle-secondary))));
  --textbox-button-background-pressed: var(--TextControlButtonBackgroundPressed, var(--SubtleFillColorTertiaryBrush, var(--subtle-fill-color-tertiary, var(--subtle-tertiary))));
  --textbox-button-foreground: var(--TextControlButtonForeground, var(--TextFillColorSecondaryBrush, var(--text-secondary, var(--text-fill-color-secondary))));
  --textbox-button-foreground-pointer-over: var(--TextControlButtonForegroundPointerOver, var(--TextFillColorSecondaryBrush, var(--text-secondary, var(--text-fill-color-secondary))));
  --textbox-button-foreground-pressed: var(--TextControlButtonForegroundPressed, var(--TextFillColorTertiaryBrush, var(--text-tertiary, var(--text-fill-color-tertiary))));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: auto;
  min-width: 64px;
  max-width: 100%;
}

:global(html.theme-dark .win-textbox),
:global(.example-theme-wrapper.theme-dark .win-textbox),
:global(.win-theme-scope.theme-dark .win-textbox) {
  --textbox-border-focused: var(--SystemAccentColorLight2, var(--AccentFillColorDefaultBrush, var(--accent-base)));
}

:global(html.theme-light .win-textbox),
:global(.example-theme-wrapper.theme-light .win-textbox),
:global(.win-theme-scope.theme-light .win-textbox) {
  --textbox-border-focused: var(--SystemAccentColorDark1, var(--AccentFillColorDefaultBrush, var(--accent-base)));
}

.win-textbox-header {
  margin: var(--TextBoxTopHeaderMargin, 0 0 8px 0);
  color: var(--text-primary, var(--text-fill-color-primary));
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.win-textbox-border {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: var(--TextControlThemeMinHeight, 32px);
  overflow: visible;
  background: var(--textbox-background);
  border: solid var(--textbox-border-top);
  border-width: var(--textbox-border-thickness, 1px);
  border-bottom-color: var(--textbox-border-bottom);
  border-radius: var(--textbox-radius, 4px);
  box-shadow: inset 0 0 0 transparent;
  box-sizing: border-box;
  flex: 1 1 auto;
}

.win-textbox-focus-border {
  position: absolute;
  inset: -1px;
  z-index: 4;
  display: none;
  overflow: hidden;
  pointer-events: none;
  border-radius: inherit;
}

.win-textbox-focus-border::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--textbox-border-focused);
}

.win-textbox.is-hovered:not(.is-disabled) .win-textbox-border {
  background: var(--textbox-background-pointer-over);
}

.win-textbox.is-focused:not(.is-disabled) .win-textbox-border {
  background: var(--textbox-background-focused);
}

.win-textbox.is-focused:not(.is-disabled) .win-textbox-focus-border {
  display: block;
}

.win-textbox-content {
  display: flex;
  flex: 1 1 auto;
  align-items: stretch;
  min-width: 0;
  min-height: var(--textbox-content-min-height);
}

.win-textbox-content-element {
  flex: 1 1 0%;
  width: 0;
  min-width: 0;
  min-height: var(--textbox-content-min-height);
  max-height: 100%;
  overflow: hidden;
}

.win-textbox-field {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  padding: var(--textbox-padding, var(--TextControlThemePadding, 5px 6px 6px 10px));
  color: var(--textbox-foreground);
  background: transparent;
  border: 0;
  outline: 0;
  font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: var(--ControlContentThemeFontSize, 14px);
  line-height: normal;
  min-height: var(--textbox-content-min-height);
  user-select: text;
  display: block;
  overflow: hidden;
}

.win-textbox.candidate-window-bottom-edge .win-textbox-field {
  -ms-ime-align: after;
}

.win-textbox-textarea {
  min-height: var(--textbox-content-min-height);
  height: auto;
  resize: none;
  overflow: hidden;
}

.win-textbox-delete-button {
  appearance: none;
  -webkit-appearance: none;
  align-self: stretch;
  position: relative;
  width: 30px;
  min-width: 30px;
  height: auto;
  min-height: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  color: var(--textbox-button-foreground);
  background: transparent;
  border: 0;
  border-radius: 0;
  cursor: pointer;
  flex: 0 0 30px;
  font: inherit;
  line-height: 1;
}

:deep(.win-textbox-action-button) {
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
  color: var(--textbox-button-foreground);
  background: transparent;
  border: 0;
  border-radius: 0;
  cursor: pointer;
  flex: 0 0 40px;
  font: inherit;
  line-height: 1;
}

:deep(.win-textbox-action-button.win-textbox-action-query) {
  width: 40px;
  min-width: 40px;
  flex-basis: 40px;
  margin-left: 0;
}

:deep(.win-textbox-action-button.win-textbox-action-number) {
  width: 40px;
  min-width: 40px;
  flex-basis: 40px;
}

:deep(.win-textbox-action-button:hover) {
  color: var(--textbox-button-foreground-pointer-over);
}

:deep(.win-textbox-action-button:active) {
  color: var(--textbox-button-foreground-pressed);
}

:deep(.win-textbox-action-button:disabled) {
  color: var(--text-disabled, var(--text-fill-color-disabled, rgba(0, 0, 0, 0.36)));
  cursor: default;
}

.win-textbox-delete-button-layout {
  position: absolute;
  inset: 4px 4px 4px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  box-sizing: border-box;
}

.win-textbox-delete-button,
:deep(.win-textbox-action-button) {
  display: block;
}

.win-textbox-delete-button:hover .win-textbox-delete-button-layout {
  background: var(--textbox-button-background-pointer-over);
}

.win-textbox-delete-button:hover {
  color: var(--textbox-button-foreground-pointer-over);
}

.win-textbox-delete-button:active .win-textbox-delete-button-layout {
  background: var(--textbox-button-background-pressed);
  color: var(--textbox-button-foreground-pressed);
}

.win-textbox-delete-button:active {
  color: var(--textbox-button-foreground-pressed);
}

.win-textbox-delete-glyph {
  display: block;
  font-size: 12px;
  line-height: 12px;
}

.win-textbox-field::placeholder {
  color: var(--textbox-placeholder-foreground);
  opacity: 1;
}

.win-textbox.is-hovered:not(.is-disabled) .win-textbox-field {
  color: var(--textbox-foreground-pointer-over);
}

.win-textbox.is-hovered:not(.is-disabled) .win-textbox-field::placeholder {
  color: var(--textbox-placeholder-foreground-pointer-over);
}

.win-textbox.is-focused:not(.is-disabled) .win-textbox-field {
  color: var(--textbox-foreground-focused);
}

.win-textbox.is-focused:not(.is-disabled) .win-textbox-field::placeholder {
  color: var(--textbox-placeholder-foreground-focused);
}

.win-textbox-field::selection {
  background-color: var(--textbox-selection-background, Highlight);
  color: HighlightText;
}

.win-textbox-description {
  margin-top: 6px;
  color: var(--text-secondary, var(--text-fill-color-secondary, rgba(0, 0, 0, 0.62)));
  font-size: 12px;
  line-height: 16px;
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
  color: var(--textbox-foreground-disabled);
}

.win-textbox.is-disabled .win-textbox-field::placeholder {
  color: var(--textbox-placeholder-foreground-disabled);
}
</style>
