<template>
  <span
    ref="rootRef"
    v-radial-gradient-foreground="Foreground"
    v-bind="textBlockAttrs"
    class="win-text-block"
    :class="[styleClass, attrs.class]"
    :style="textBlockStyle"
    @contextmenu="onContextMenu"
    @copy="onCopyingToClipboard">
    <span v-if="!hasInlineContent" :class="{ 'win-text-block-empty-line': String(resolvedText ?? '') === '' }">{{ resolvedText }}</span>
    <InlineOutlet />
  </span>

  <ContextMenu v-if="resolvedIsTextSelectionEnabled" />
</template>

<script>
import { TextBlockInlines, TextBlockTextHighlighters } from './TextInline';
import { brushProperty } from './brushProperties';
export default { Inlines:TextBlockInlines, TextHighlighters:TextBlockTextHighlighters, Foreground:brushProperty('TextBlock', 'Foreground') };
</script>

<script setup>
import { Comment, computed, defineComponent, Fragment, getCurrentInstance, h, inject, onBeforeUnmount, onMounted, onUpdated, reactive, ref, shallowRef, Text, useAttrs, useSlots, watch } from 'vue';
import { textCommandFlyout } from './textCommandFlyout';
import { useI18n } from './i18n/index';
import { normalizeXamlNodes, resolveXamlValue, updateXamlBinding } from './xamlRuntime';
import { getToolTipServiceProperty } from './ToolTipServiceProperties';
import { xamlResourceDictionaryKey } from './Page.vue';
import { getVNodeChildren } from './CollectionProperties';
import { createTextHighlights, readTextHighlighters, textBrush, textContentNodes, textFontWeight, textPosition } from './TextInline';
import { isBrushProperty, useBrushProperty } from './brushProperties';
import { isRadialGradientBrush } from './RadialGradientVisual';
import { vRadialGradientForeground } from './radialGradientForeground';

const { t } = useI18n();
const emit = defineEmits(['SelectionChanged', 'ContextMenuOpening', 'IsTextTrimmedChanged', 'update:Foreground']);

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  Text: { type: [String, Number], default: '' },
  Style: { type: String, default: '' },
  CharacterSpacing: { type: [String, Number], default: '' },
  FontFamily: { type: String, default: '' },
  FontSize: { type: [String, Number], default: '' },
  FontStretch: { type: String, default: '' },
  FontStyle: { type: String, default: '' },
  FontWeight: { type: [String, Number], default: '' },
  Foreground: { type: [String,Object], default: '' },
  HorizontalTextAlignment: { type: String, default: '' },
  IsColorFontEnabled: { type: Boolean, default: true },
  IsTextSelectionEnabled: { type: [Boolean, String], default: false },
  IsTextScaleFactorEnabled: { type: [Boolean, String], default: true },
  LineHeight: { type: [String, Number], default: '' },
  LineStackingStrategy: { type: String, default: '' },
  Margin: { type: String, default: '' },
  MaxLines: { type: [String, Number], default: '' },
  OpticalMarginAlignment: { type: String, default: '' },
  Padding: { type: String, default: '' },
  SelectionFlyout: { type: [String, Object], default: '' },
  SelectionHighlightColor: { type: [String,Object], default: '' },
  TextAlignment: { type: String, default: '' },
  TextDecorations: { type: String, default: '' },
  TextLineBounds: { type: String, default: '' },
  TextReadingOrder: { type: String, default: '' },
  TextTrimming: { type: String, default: '' },
  TextWrapping: { type: String, default: '' },
  FlowDirection: { type: String, default: 'LeftToRight' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' },
  Visibility: { type: String, default: 'Visible' },
  Opacity: { type: [String, Number], default: '' }
});

const attrs = useAttrs();
const slots = useSlots();
const contentNodes = () => textContentNodes(slots.default?.() ?? [], 'Inlines').filter(node => !isBrushProperty(node));
const hasInlineContent = computed(() => {
  const containsInline = (nodes) => nodes.some(node => {
    if (getToolTipServiceProperty(node) || node.type === Comment) return false;
    if (node.type === Text) return String(node.children ?? '').trim() !== '';
    if (node.type === Fragment && Array.isArray(node.children)) return containsInline(node.children);
    return true;
  });
  return containsInline(contentNodes());
});
const instance = getCurrentInstance();
const InlineOutlet = defineComponent({ setup: () => () => h(Fragment, normalizeXamlNodes(contentNodes(), instance)) });
const resources = inject(xamlResourceDictionaryKey, {});
const resolvedText = computed(() => resolveXamlValue(props.Text, instance, undefined, true));
const resolvedIsTextSelectionEnabled = computed(() => resolveXamlValue(props.IsTextSelectionEnabled, instance) === true);
const resolvedVisibility = computed(() => resolveXamlValue(props.Visibility, instance));
const resolvedStyleName = computed(() => {
  const value = resolveXamlValue(props.Style, instance);
  if (typeof value !== 'string') return '';
  // Style resources select the existing typography classes. They must not
  // become a brush variable or an unresolved binding used as a class name.
  return value.match(/^\{(?:StaticResource|ThemeResource)\s+([^\s}]+)\}$/)?.[1]
    ?? value.match(/^var\(--([^,)]+)\)$/)?.[1]
    ?? value;
});
const typographyStyles = new Set(['BaseTextBlockStyle','CaptionTextBlockStyle','BodyTextBlockStyle','BodyStrongTextBlockStyle','BodyLargeTextBlockStyle','BodyLargeStrongTextBlockStyle','SubtitleTextBlockStyle','TitleTextBlockStyle','TitleLargeTextBlockStyle','DisplayTextBlockStyle']);
const styleSetters = computed(() => {
  const read = (key, visited = new Set()) => {
    if(!key || visited.has(key)) return {};
    visited.add(key);
    const declaration = resources[key];
    const basedOn = String(declaration?.props?.BasedOn ?? '').match(/^\{(?:StaticResource|ThemeResource)\s+([^\s}]+)\}$/)?.[1];
    return { ...(typographyStyles.has(key) ? { TextWrapping:'Wrap', TextTrimming:'CharacterEllipsis', LineStackingStrategy:'MaxHeight', TextLineBounds:'Full' } : {}),
      ...read(basedOn,visited), ...Object.fromEntries(declaration ? getVNodeChildren(declaration).filter(node => node.props?.Property).map(node => [node.props.Property, resolveXamlValue(node.props.Value,instance)]) : []) };
  };
  return read(resolvedStyleName.value);
});
const foregroundBrush = useBrushProperty('Foreground', () => props.Foreground || styleSetters.value.Foreground, () => slots.default?.() ?? [], instance);
const localForeground = shallowRef();
const Foreground = computed({
  get: () => localForeground.value === undefined ? foregroundBrush.value.value : localForeground.value,
  set: value => { localForeground.value = resolveXamlValue(value, instance); updateXamlBinding(props.Foreground, value, instance); emit('update:Foreground', value); }
});
const resolvedTextWrapping = computed(() => resolveXamlValue(props.TextWrapping || styleSetters.value.TextWrapping || 'NoWrap', instance));
watch(foregroundBrush.value, () => { localForeground.value = undefined; });
const rootRef = ref(null);
const contextMenuOpen = ref(false);
const contextMenuRef = ref(null);
const contextMenuAnchor = ref(null);
const contextSelection = ref('');
const contextMenuItems = computed(() => {
  const hasText = rootRef.value?.textContent?.length > 0;
  const items = [];

  if (contextSelection.value) {
    items.push({ Text: t('text.copy'), Icon: 'Copy', Value: 'copy' });
  }

  if (hasText) {
    items.push({ Text: t('text.select-all'), Icon: 'SelectAll', Value: 'selectAll' });
  }

  return items;
});

// x:Name bindings such as AutomationProperties.LabeledBy use the real text
// element as their ElementName target. Expose it through the XAML namescope.
const selectedText = ref('');
const isTextTrimmed = ref(false);
const highlighters = reactive([]);
const textHighlights = createTextHighlights(`win-text-block-${instance?.uid}`);
const api = {
  get Foreground() { return Foreground.value; }, set Foreground(value) { Foreground.value = value; },
  Element: rootRef, get SelectedText() { return selectedText.value; }, get IsTextTrimmed() { return isTextTrimmed.value; },
  get ContentStart() { return { Offset:0 }; }, get ContentEnd() { return { Offset:rootRef.value?.textContent?.length ?? 0 }; },
  SelectAll: () => selectAll(), Select: (start,end) => select(start,end), CopySelectionToClipboard: () => copySelectionToClipboard(),
  TextHighlighters: { Add: item => highlighters.push(item), Clear: () => highlighters.splice(0), Remove: item => { const index = highlighters.indexOf(item); if(index >= 0) highlighters.splice(index,1); }, RemoveAt: index => highlighters.splice(index,1), GetAt: index => highlighters[index], get Count() { return highlighters.length; } }
};
defineExpose(api);

const textBlockAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  const liveSetting = resolveXamlValue(rest['AutomationProperties.LiveSetting'], instance);
  if (liveSetting !== undefined) {
    delete rest['AutomationProperties.LiveSetting'];
    rest['aria-live'] = ({ Off: 'off', Polite: 'polite', Assertive: 'assertive' })[String(liveSetting)] ?? 'off';
  }
  return rest;
});

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) {
    return '';
  }

  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) {
    return `${Number(value.trim())}px`;
  }

  return typeof value === 'number' ? `${value}px` : value;
};

const xamlThickness = (value) => {
  if (value === '' || value === undefined || value === null) {
    return '';
  }

  const parts = String(value).split(',').map((part) => cssLength(Number.isNaN(Number(part.trim())) ? part.trim() : Number(part.trim())));

  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;

  return value;
};

const textWrapping = computed(() => {
  switch (resolvedTextWrapping.value) {
    case 'Wrap':
    case 'WrapWholeWords':
      return 'normal';
    case 'NoWrap':
      return 'nowrap';
    default:
      return '';
  }
});

const overflowWrap = computed(() => {
  switch (resolvedTextWrapping.value) {
    case 'Wrap':
      return 'anywhere';
    case 'WrapWholeWords':
      return 'normal';
    default:
      return '';
  }
});

const textBlockStyle = computed(() => {
  const style = {};
  const setters = styleSetters.value;
  const values = Object.fromEntries([
    'Width', 'Height', 'MinWidth', 'MinHeight', 'MaxWidth', 'MaxHeight',
    'HorizontalAlignment', 'VerticalAlignment', 'Opacity', 'CharacterSpacing',
    'FontFamily', 'FontSize', 'FontStretch', 'FontStyle', 'FontWeight', 'Foreground',
    'HorizontalTextAlignment', 'LineHeight', 'Margin', 'Padding',
    'SelectionHighlightColor', 'TextAlignment', 'TextDecorations', 'TextTrimming',
    'TextLineBounds', 'IsTextScaleFactorEnabled', 'MaxLines', 'TextReadingOrder', 'FlowDirection', 'LineStackingStrategy'
  ].map((name) => [name, resolveXamlValue(props[name] === '' ? setters[name] ?? props[name] : props[name], instance)]));
  const hasValue = (value) => value !== '' && value !== undefined && value !== null;

  for (const [property, value] of Object.entries({
    width: values.Width,
    height: values.Height,
    minWidth: values.MinWidth,
    minHeight: values.MinHeight,
    maxWidth: values.MaxWidth,
    maxHeight: values.MaxHeight
  })) {
    if (hasValue(value)) style[property] = value === 'Auto' ? 'auto' : cssLength(value);
  }
  if (values.HorizontalAlignment) {
    style.justifySelf = { Left: 'start', Center: 'center', Right: 'end', Stretch: 'stretch' }[values.HorizontalAlignment];
  }
  if (values.VerticalAlignment) {
    style.alignSelf = { Top: 'start', Center: 'center', Bottom: 'end', Stretch: 'stretch' }[values.VerticalAlignment];
  }
  if (hasValue(values.Opacity)) style.opacity = values.Opacity;

  if (hasValue(values.CharacterSpacing)) {
    const spacing = Number(values.CharacterSpacing);
    style.letterSpacing = Number.isFinite(spacing) ? `${spacing / 1000}em` : `calc(${values.CharacterSpacing} * .001em)`;
  }
  if (values.FontFamily) style.fontFamily = values.FontFamily === 'XamlAutoFontFamily' ? 'var(--ContentControlThemeFontFamily)' : values.FontFamily;
  if (hasValue(values.FontSize)) style.fontSize = cssLength(values.FontSize);
  if (values.FontStretch) style.fontStretch = String(values.FontStretch).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  if (values.FontStyle) style.fontStyle = String(values.FontStyle).toLowerCase();
  if (hasValue(values.FontWeight)) {
    style.fontWeight = textFontWeight(values.FontWeight);
  }
  const foreground = Foreground.value;
  if (foreground && !isRadialGradientBrush(foreground)) style.color = textBrush(foreground);
  if (values.HorizontalTextAlignment) style.textAlign = String(values.HorizontalTextAlignment).toLowerCase();
  if (hasValue(values.LineHeight) && Number(values.LineHeight) > 0) {
    style.lineHeight = cssLength(values.LineHeight);
  } else if (values.TextLineBounds === 'Tight') {
    style.lineHeight = '1';
  } else if (hasValue(values.FontSize)) {
    style.lineHeight = 'normal';
  }
  if (values.TextLineBounds === 'TrimToCapHeight') {
    style.textBoxTrim = 'trim-start';
    style.textBoxEdge = 'cap alphabetic';
  }
  if (hasValue(values.Margin)) style.margin = xamlThickness(values.Margin);
  if (hasValue(values.Padding)) style.padding = xamlThickness(values.Padding);
  if (values.SelectionHighlightColor) style['--TextBlockSelectionHighlightColor'] = textBrush(values.SelectionHighlightColor);
  if (values.TextAlignment) style.textAlign = String(values.TextAlignment).toLowerCase();
  if (values.TextDecorations) {
    style.textDecorationLine = String(values.TextDecorations).split(/[\s,]+/).map((decoration) => decoration === 'Strikethrough' ? 'line-through' : decoration.toLowerCase()).join(' ');
  }
  if (values.IsTextScaleFactorEnabled === false) {
    style.textSizeAdjust = 'none';
    style.webkitTextSizeAdjust = 'none';
  }
  if (textWrapping.value) style.whiteSpace = textWrapping.value;
  if (String(resolvedText.value ?? '').includes('\n')) {
    style.whiteSpace = resolvedTextWrapping.value === 'NoWrap' ? 'pre' : 'pre-line';
  }
  if (overflowWrap.value) style.overflowWrap = overflowWrap.value;
  style.direction = values.FlowDirection === 'RightToLeft' ? 'rtl' : 'ltr';
  if(values.TextReadingOrder === 'DetectFromContent') style.unicodeBidi = 'plaintext';

  if (resolvedIsTextSelectionEnabled.value) {
    style.userSelect = 'text';
    style.webkitUserSelect = 'text';
    style.cursor = 'text';
  }

  if (values.TextTrimming && values.TextTrimming !== 'None') {
    style.overflow = 'hidden';
    style.textOverflow = values.TextTrimming === 'Clip' ? 'clip' : 'ellipsis';
    const wraps = resolvedTextWrapping.value === 'Wrap' || resolvedTextWrapping.value === 'WrapWholeWords';
    if (!wraps) {
      style.whiteSpace = 'nowrap';
    } else if (!hasValue(values.MaxLines) || Number(values.MaxLines) === 0) {
      const maxHeight = Number.parseFloat(String(values.MaxHeight));
      const explicitLineHeight = Number.parseFloat(String(values.LineHeight));
      const lineHeight = Number.isFinite(explicitLineHeight) && explicitLineHeight > 0
        ? explicitLineHeight
        : resolvedStyleName.value === 'CaptionTextBlockStyle' ? 16
          : resolvedStyleName.value === 'BodyLargeTextBlockStyle' || resolvedStyleName.value === 'BodyLargeStrongTextBlockStyle' ? 24
            : resolvedStyleName.value === 'SubtitleTextBlockStyle' ? 28
              : resolvedStyleName.value === 'TitleTextBlockStyle' ? 36
                : resolvedStyleName.value === 'TitleLargeTextBlockStyle' ? 52
                  : resolvedStyleName.value === 'DisplayTextBlockStyle' ? 92 : 20;
      if (Number.isFinite(maxHeight) && maxHeight > 0) {
        style.display = '-webkit-box';
        style.WebkitLineClamp = String(Math.max(1, Math.floor(maxHeight / lineHeight)));
        style.WebkitBoxOrient = 'vertical';
      }
    }
  }

  if (hasValue(values.MaxLines) && Number(values.MaxLines) > 0) {
    style.display = '-webkit-box';
    style.overflow = 'hidden';
    style.WebkitLineClamp = String(values.MaxLines);
    style.WebkitBoxOrient = 'vertical';
  }

  // TrimToCapHeight reduces the line box; keep glyphs above the cap edge
  // visible while retaining the horizontal clipping used by ellipsis.
  if (values.TextLineBounds === 'TrimToCapHeight'
      && resolvedTextWrapping.value === 'NoWrap'
      && (!hasValue(values.MaxLines) || Number(values.MaxLines) === 0)) {
    style.overflow = 'visible';
    style.overflowX = 'clip';
    style.overflowY = 'visible';
  }

  if (resolvedVisibility.value === 'Collapsed' || resolvedVisibility.value === false) style.display = 'none';

  return [attrs.style, style];
});

const styleClass = computed(() => ({
  OutputTextBlockStyle: resolvedStyleName.value === 'OutputTextBlockStyle',
  BaseTextBlockStyle: resolvedStyleName.value === 'BaseTextBlockStyle',
  CaptionTextBlockStyle: resolvedStyleName.value === 'CaptionTextBlockStyle',
  BodyTextBlockStyle: resolvedStyleName.value === 'BodyTextBlockStyle',
  BodyStrongTextBlockStyle: resolvedStyleName.value === 'BodyStrongTextBlockStyle',
  BodyLargeTextBlockStyle: resolvedStyleName.value === 'BodyLargeTextBlockStyle',
  BodyLargeStrongTextBlockStyle: resolvedStyleName.value === 'BodyLargeStrongTextBlockStyle',
  SubtitleTextBlockStyle: resolvedStyleName.value === 'SubtitleTextBlockStyle',
  TitleTextBlockStyle: resolvedStyleName.value === 'TitleTextBlockStyle',
  TitleLargeTextBlockStyle: resolvedStyleName.value === 'TitleLargeTextBlockStyle',
  DisplayTextBlockStyle: resolvedStyleName.value === 'DisplayTextBlockStyle',
  'text-selection-enabled': resolvedIsTextSelectionEnabled.value
}));

const selectionTextInBlock = () => {
  const root = rootRef.value;
  const selection = window.getSelection?.();

  if (!root || !selection || selection.rangeCount === 0) {
    return '';
  }

  const range = selection.getRangeAt(0);
  const startsInside = root.contains(range.startContainer);
  const endsInside = root.contains(range.endContainer);

  return startsInside && endsInside ? selection.toString() : '';
};
const onSelectionChanged = () => {
  const text = resolvedIsTextSelectionEnabled.value ? selectionTextInBlock() : '';
  if(selectedText.value === text) return;
  selectedText.value = text;
  emit('SelectionChanged',api,{ OriginalSource:rootRef.value, Handled:false });
};

const onCopyingToClipboard = (event) => {
  const text = selectionTextInBlock();
  if (!text) return;

  event.clipboardData?.setData('text/plain', text);
  event.preventDefault();
};

const onContextMenu = (event) => {
  if (!resolvedIsTextSelectionEnabled.value) return;
  const args = { OriginalSource:event.target, CursorLeft:event.clientX, CursorTop:event.clientY, Handled:false };
  emit('ContextMenuOpening',api,args);
  if(args.Handled) { event.preventDefault(); return; }
  event.preventDefault();
  contextMenuOpen.value = false;
  contextSelection.value = selectionTextInBlock();

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
  const flyout = resolveXamlValue(props.SelectionFlyout,instance);
  void (flyout?.ShowAt ? flyout : contextMenuRef.value)?.ShowAt?.(rootRef.value, { Position: { X: event.clientX - rootRef.value.getBoundingClientRect().left, Y: event.clientY - rootRef.value.getBoundingClientRect().top } });
};

const closeContextMenu = () => {
  contextMenuOpen.value = false;
  contextMenuRef.value?.Hide?.();
};

const copySelectionToClipboard = () => {
  const text = contextSelection.value || selectionTextInBlock();
  if (text) void navigator.clipboard?.writeText(text);
};

const selectAll = () => {
  const root = rootRef.value;
  if (!root || !resolvedIsTextSelectionEnabled.value) return;

  const range = document.createRange();
  range.selectNodeContents(root);

  const selection = window.getSelection?.();
  selection?.removeAllRanges();
  selection?.addRange(range);
  contextSelection.value = root.textContent ?? '';
  onSelectionChanged();
};
const select = (start,end) => {
  if(!rootRef.value || !resolvedIsTextSelectionEnabled.value) return;
  const range = document.createRange(); range.setStart(...textPosition(rootRef.value,start.Offset)); range.setEnd(...textPosition(rootRef.value,end.Offset));
  const selection = window.getSelection(); selection?.removeAllRanges(); selection?.addRange(range); onSelectionChanged();
};

const onContextMenuSelect = (item) => {
  if (!item.Value) return;
  closeContextMenu();

  if (item.Value === 'copy') copySelectionToClipboard();
  if (item.Value === 'selectAll') selectAll();
};

const ContextMenu = textCommandFlyout(contextMenuRef, () => contextMenuItems.value, onContextMenuSelect, closeContextMenu);
let resizeObserver, frame = 0, active = true;
const measureText = () => {
  if(!active) return;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    const root = rootRef.value; if(!root) return;
    const trimmed = (resolveXamlValue(props.TextTrimming || styleSetters.value.TextTrimming,instance) ?? 'None') !== 'None'
      && (root.scrollWidth > root.clientWidth || root.scrollHeight > root.clientHeight);
    if(trimmed !== isTextTrimmed.value) { isTextTrimmed.value = trimmed; emit('IsTextTrimmedChanged',api,{ IsTextTrimmed:trimmed }); }
    textHighlights.Update([{ Element:root, Start:0 }],[...readTextHighlighters(slots.default?.() ?? [],instance),...highlighters]);
  });
};
onMounted(() => { document.addEventListener('selectionchange',onSelectionChanged); resizeObserver = new ResizeObserver(measureText); if(rootRef.value) resizeObserver.observe(rootRef.value); measureText(); });
onUpdated(measureText);
watch(highlighters,measureText,{deep:true});
watch(resolvedIsTextSelectionEnabled,(enabled) => { if(!enabled) { if(selectionTextInBlock()) window.getSelection()?.removeAllRanges(); onSelectionChanged(); closeContextMenu(); } });
onBeforeUnmount(() => {
  active = false; cancelAnimationFrame(frame); resizeObserver?.disconnect(); textHighlights.Clear(); document.removeEventListener('selectionchange',onSelectionChanged);
  contextMenuOpen.value = false;
});
</script>

<style>
.win-text-block {
  display: block;
  min-width: 0;
  margin: 0;
  color: var(--text-primary);
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  font-size: var(--ControlContentThemeFontSize, 14px);
  line-height: 20px;
  white-space: nowrap;
  overflow-wrap: normal;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
}

/* An empty XAML TextBlock measures one line with zero text width. */
.win-text-block-empty-line {
  display: block;
  width: 0;
  height: 1lh;
}

.win-text-block.text-selection-enabled,
.win-text-block.text-selection-enabled * {
  user-select: text !important;
  -webkit-user-select: text !important;
}

.win-text-block.BaseTextBlockStyle,
.win-text-block.BodyStrongTextBlockStyle {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.win-text-block.CaptionTextBlockStyle {
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}

.win-text-block.OutputTextBlockStyle,
.win-text-block.BodyTextBlockStyle {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.win-text-block.OutputTextBlockStyle {
  margin: 8px 0 0 8px;
}

.win-text-block.BodyLargeTextBlockStyle {
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
}

.win-text-block.BodyLargeStrongTextBlockStyle {
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
}

.win-text-block.SubtitleTextBlockStyle {
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}

.win-text-block.TitleTextBlockStyle {
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
}

.win-text-block.TitleLargeTextBlockStyle {
  font-size: 40px;
  font-weight: 600;
  line-height: 52px;
}

.win-text-block.DisplayTextBlockStyle {
  font-size: 68px;
  font-weight: 600;
  line-height: 92px;
}

.win-text-block::selection {
  background-color: var(--TextBlockSelectionHighlightColor, Highlight);
  color: HighlightText;
}

.win-text-block.text-selection-enabled *::selection {
  background-color: var(--TextBlockSelectionHighlightColor, Highlight);
  color: HighlightText;
}

</style>
