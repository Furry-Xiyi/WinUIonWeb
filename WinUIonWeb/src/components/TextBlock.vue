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
    <span v-if="!$slots.default">{{ resolvedText }}</span>
    <slot />
  </span>

  <MenuFlyout
    :Open="contextMenuOpen"
    :AnchorRect="contextMenuAnchor"
    :Items="contextMenuItems"
    :MinWidth="160"
    Placement="Right"
    @Close="closeContextMenu"
    @Select="onContextMenuSelect" />
</template>

<script setup>
import { computed, getCurrentInstance, onBeforeUnmount, ref, useAttrs } from 'vue';
import MenuFlyout from './MenuFlyout.vue';
import { useI18n } from './i18n/index';
import { resolveXamlValue } from './xamlRuntime';

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
  IsTextSelectionEnabled: { type: [Boolean, String], default: false },
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
  TextWrapping: { type: String, default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' },
  Opacity: { type: [String, Number], default: '' }
});

const attrs = useAttrs();
const instance = getCurrentInstance();
const resolvedText = computed(() => resolveXamlValue(props.Text, instance));
const resolvedIsTextSelectionEnabled = computed(() => resolveXamlValue(props.IsTextSelectionEnabled, instance) === true);
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

// WinUI colors use #AARRGGBB; CSS eight-digit hex uses #RRGGBBAA.
const xamlColor = (value) => {
  const color = String(value ?? '').trim();
  const argb = color.match(/^#([0-9a-f]{8})$/i);
  if (!argb) return color;
  const hex = argb[1];
  const alpha = Number.parseInt(hex.slice(0, 2), 16) / 255;
  const red = Number.parseInt(hex.slice(2, 4), 16);
  const green = Number.parseInt(hex.slice(4, 6), 16);
  const blue = Number.parseInt(hex.slice(6, 8), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
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

  for (const [property, value] of Object.entries({
    width: props.Width,
    height: props.Height,
    minWidth: props.MinWidth,
    minHeight: props.MinHeight,
    maxWidth: props.MaxWidth,
    maxHeight: props.MaxHeight
  })) {
    if (value !== '') style[property] = cssLength(value);
  }
  if (props.HorizontalAlignment) {
    style.justifySelf = { Left: 'start', Center: 'center', Right: 'end', Stretch: 'stretch' }[props.HorizontalAlignment];
  }
  if (props.VerticalAlignment) {
    style.alignSelf = { Top: 'start', Center: 'center', Bottom: 'end', Stretch: 'stretch' }[props.VerticalAlignment];
  }
  if (props.Opacity !== '') style.opacity = Number(props.Opacity);

  if (props.CharacterSpacing !== '') style.letterSpacing = `${Number(props.CharacterSpacing) / 1000}em`;
  if (props.FontFamily) style.fontFamily = props.FontFamily;
  if (props.FontSize !== '') style.fontSize = cssLength(props.FontSize);
  if (props.FontStretch) style.fontStretch = props.FontStretch.toLowerCase();
  if (props.FontStyle) style.fontStyle = props.FontStyle.toLowerCase();
  if (props.FontWeight !== '') style.fontWeight = props.FontWeight;
  if (props.Foreground) style.color = xamlColor(props.Foreground);
  if (props.HorizontalTextAlignment) style.textAlign = props.HorizontalTextAlignment.toLowerCase();
  if (props.LineHeight !== '') {
    style.lineHeight = cssLength(props.LineHeight);
  } else if (props.FontSize !== '') {
    style.lineHeight = 'normal';
  }
  if (props.Margin) style.margin = xamlThickness(props.Margin);
  if (props.Padding) style.padding = xamlThickness(props.Padding);
  if (props.SelectionHighlightColor) style['--TextBlockSelectionHighlightColor'] = props.SelectionHighlightColor;
  if (props.TextAlignment) style.textAlign = props.TextAlignment.toLowerCase();
  if (props.TextDecorations) style.textDecorationLine = props.TextDecorations.toLowerCase();
  if (textWrapping.value) style.whiteSpace = textWrapping.value;
  if (overflowWrap.value) style.overflowWrap = overflowWrap.value;

  if (resolvedIsTextSelectionEnabled.value) {
    style.userSelect = 'text';
    style.cursor = 'text';
  }

  if (props.TextTrimming && props.TextTrimming !== 'None') {
    style.overflow = 'hidden';
    style.textOverflow = 'ellipsis';
    const wraps = props.TextWrapping === 'Wrap' || props.TextWrapping === 'WrapWholeWords';
    if (!wraps) {
      style.whiteSpace = 'nowrap';
    } else if (props.MaxLines === '') {
      const maxHeight = Number.parseFloat(String(props.MaxHeight));
      const explicitLineHeight = Number.parseFloat(String(props.LineHeight));
      const lineHeight = Number.isFinite(explicitLineHeight) && explicitLineHeight > 0
        ? explicitLineHeight
        : props.Style.includes('CaptionTextBlockStyle') ? 16
          : props.Style.includes('BodyLargeTextBlockStyle') || props.Style.includes('BodyLargeStrongTextBlockStyle') ? 24
            : props.Style.includes('SubtitleTextBlockStyle') ? 28
              : props.Style.includes('TitleTextBlockStyle') ? 36
                : props.Style.includes('TitleLargeTextBlockStyle') ? 52
                  : props.Style.includes('DisplayTextBlockStyle') ? 92 : 20;
      if (Number.isFinite(maxHeight) && maxHeight > 0) {
        style.display = '-webkit-box';
        style.WebkitLineClamp = String(Math.max(1, Math.floor(maxHeight / lineHeight)));
        style.WebkitBoxOrient = 'vertical';
      }
    }
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
  CustomTextBlockStyle: props.Style.includes('CustomTextBlockStyle'),
  BaseTextBlockStyle: props.Style.includes('BaseTextBlockStyle'),
  CaptionTextBlockStyle: props.Style.includes('CaptionTextBlockStyle'),
  BodyTextBlockStyle: props.Style.includes('BodyTextBlockStyle'),
  BodyStrongTextBlockStyle: props.Style.includes('BodyStrongTextBlockStyle'),
  BodyLargeTextBlockStyle: props.Style.includes('BodyLargeTextBlockStyle'),
  BodyLargeStrongTextBlockStyle: props.Style.includes('BodyLargeStrongTextBlockStyle'),
  SubtitleTextBlockStyle: props.Style.includes('SubtitleTextBlockStyle'),
  TitleTextBlockStyle: props.Style.includes('TitleTextBlockStyle'),
  TitleLargeTextBlockStyle: props.Style.includes('TitleLargeTextBlockStyle'),
  DisplayTextBlockStyle: props.Style.includes('DisplayTextBlockStyle')
}));

const onSelectStart = (event) => {
  if (!resolvedIsTextSelectionEnabled.value) {
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
  if (!resolvedIsTextSelectionEnabled.value) return;

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
  min-width: 0;
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

.win-text-block.BodyTextBlockStyle {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
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
</style>
