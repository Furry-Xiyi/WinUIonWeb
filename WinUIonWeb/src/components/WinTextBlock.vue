<template>
  <span
    ref="rootRef"
    v-bind="textBlockAttrs"
    class="win-text-block"
    :class="[styleClass, attrs.class]"
    :style="textBlockStyle"
    @contextmenu="onContextMenu"
    @copy="onCopyingToClipboard"
    @selectstart="onSelectStart">
    <slot>{{ Text }}</slot>
  </span>

  <WinMenuFlyout
    :Open="contextMenuOpen"
    :AnchorRect="contextMenuAnchor"
    :Items="contextMenuItems"
    :MinWidth="160"
    Placement="Right"
    @Close="closeContextMenu"
    @Select="onContextMenuSelect" />
</template>

<script setup>
import { computed, onBeforeUnmount, ref, useAttrs } from 'vue';
import WinMenuFlyout from './WinMenuFlyout.vue';
import { useI18n } from './i18n/index';

const { t } = useI18n();

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
  Foreground: { type: String, default: '' },
  HorizontalTextAlignment: { type: String, default: '' },
  IsColorFontEnabled: { type: Boolean, default: true },
  IsTextSelectionEnabled: { type: Boolean, default: false },
  IsTextScaleFactorEnabled: { type: Boolean, default: true },
  LineHeight: { type: [String, Number], default: '' },
  LineStackingStrategy: { type: String, default: '' },
  Margin: { type: String, default: '' },
  MaxLines: { type: [String, Number], default: '' },
  OpticalMarginAlignment: { type: String, default: '' },
  Padding: { type: String, default: '' },
  SelectionFlyout: { type: [String, Object], default: '' },
  SelectionHighlightColor: { type: String, default: '' },
  TextAlignment: { type: String, default: '' },
  TextDecorations: { type: String, default: '' },
  TextLineBounds: { type: String, default: '' },
  TextReadingOrder: { type: String, default: '' },
  TextTrimming: { type: String, default: '' },
  TextWrapping: { type: String, default: '' }
});

const attrs = useAttrs();
const rootRef = ref(null);
const contextMenuOpen = ref(false);
const contextMenuAnchor = ref(null);
const contextSelection = ref('');
const contextMenuItems = computed(() => {
  const hasText = rootRef.value?.textContent?.length > 0;
  const items = [];

  if (contextSelection.value) {
    items.push({ Text: t('text.copy'), Icon: '\uE8C8', Value: 'copy' });
  }

  if (hasText) {
    items.push({ Text: t('text.select-all'), Icon: '\uE8B3', Value: 'selectAll' });
  }

  return items;
});

const textBlockAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
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
  if (!value) {
    return '';
  }

  const parts = String(value).split(',').map((part) => cssLength(Number.isNaN(Number(part.trim())) ? part.trim() : Number(part.trim())));

  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;

  return value;
};

const textWrapping = computed(() => {
  switch (props.TextWrapping) {
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
  switch (props.TextWrapping) {
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

  if (props.CharacterSpacing !== '') style.letterSpacing = `${Number(props.CharacterSpacing) / 1000}em`;
  if (props.FontFamily) style.fontFamily = props.FontFamily;
  if (props.FontSize !== '') style.fontSize = cssLength(props.FontSize);
  if (props.FontStretch) style.fontStretch = props.FontStretch.toLowerCase();
  if (props.FontStyle) style.fontStyle = props.FontStyle.toLowerCase();
  if (props.FontWeight !== '') style.fontWeight = props.FontWeight;
  if (props.Foreground) style.color = props.Foreground;
  if (props.HorizontalTextAlignment) style.textAlign = props.HorizontalTextAlignment.toLowerCase();
  if (props.LineHeight !== '') style.lineHeight = cssLength(props.LineHeight);
  if (props.Margin) style.margin = xamlThickness(props.Margin);
  if (props.Padding) style.padding = xamlThickness(props.Padding);
  if (props.SelectionHighlightColor) style['--TextBlockSelectionHighlightColor'] = props.SelectionHighlightColor;
  if (props.TextAlignment) style.textAlign = props.TextAlignment.toLowerCase();
  if (props.TextDecorations) style.textDecorationLine = props.TextDecorations.toLowerCase();
  if (textWrapping.value) style.whiteSpace = textWrapping.value;
  if (overflowWrap.value) style.overflowWrap = overflowWrap.value;

  if (props.IsTextSelectionEnabled) {
    style.userSelect = 'text';
    style.cursor = 'text';
  }

  if (props.TextTrimming && props.TextTrimming !== 'None') {
    style.overflow = 'hidden';
    style.textOverflow = 'ellipsis';
    style.whiteSpace = 'nowrap';
  }

  if (props.MaxLines !== '') {
    style.display = '-webkit-box';
    style.overflow = 'hidden';
    style.WebkitLineClamp = String(props.MaxLines);
    style.WebkitBoxOrient = 'vertical';
  }

  return [attrs.style, style];
});

const styleClass = computed(() => ({
  CustomTextBlockStyle: props.Style.includes('CustomTextBlockStyle')
}));

const onSelectStart = (event) => {
  if (!props.IsTextSelectionEnabled) {
    event.preventDefault();
  }
};

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

const onCopyingToClipboard = (event) => {
  const text = selectionTextInBlock();
  if (!text) return;

  event.clipboardData?.setData('text/plain', text);
  event.preventDefault();
};

const onContextMenu = (event) => {
  if (!props.IsTextSelectionEnabled) return;

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
};

const closeContextMenu = () => {
  contextMenuOpen.value = false;
};

const copySelectionToClipboard = () => {
  const text = contextSelection.value || selectionTextInBlock();
  if (text) void navigator.clipboard?.writeText(text);
};

const selectAll = () => {
  const root = rootRef.value;
  if (!root) return;

  const range = document.createRange();
  range.selectNodeContents(root);

  const selection = window.getSelection?.();
  selection?.removeAllRanges();
  selection?.addRange(range);
  contextSelection.value = root.textContent ?? '';
};

const onContextMenuSelect = (item) => {
  if (!item.Value) return;
  closeContextMenu();

  if (item.Value === 'copy') copySelectionToClipboard();
  if (item.Value === 'selectAll') selectAll();
};

onBeforeUnmount(() => {
  contextMenuOpen.value = false;
});
</script>

<style>
.win-text-block {
  display: block;
  margin: 0;
  color: var(--text-primary);
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  font-size: var(--ControlContentThemeFontSize, 14px);
  line-height: 20px;
  white-space: normal;
  overflow-wrap: normal;
  user-select: none;
}

.win-text-block.CustomTextBlockStyle {
  font-family: 'Comic Sans MS';
  font-style: italic;
}

.win-text-block::selection {
  background-color: var(--TextBlockSelectionHighlightColor, Highlight);
  color: HighlightText;
}
</style>
