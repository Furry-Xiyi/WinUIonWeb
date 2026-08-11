<template>
  <span
    ref="rootRef"
    v-bind="badgeAttrs"
    class="win-infobadge"
    :class="[styleClass, displayKindClass, valueShapeClass, alignmentClass, attrs.class]"
    :style="badgeStyle"
    role="status"
    :aria-label="automationName">
    <WinTextBlock
      v-if="displayKind === 'Value'"
      class="win-infobadge-value-text"
      :Text="displayValue"
      :Foreground="badgeForeground"
      FontSize="11"
      LineHeight="14" />
    <span
      v-else-if="displayKind !== 'Dot'"
      class="win-infobadge-icon-presenter"
      aria-hidden="true">
      <WinTextBlock
        class="win-infobadge-icon-glyph"
        :Text="iconGlyph"
        :FontFamily="resolvedIconFontFamily"
        :Foreground="iconForeground"
        :FontSize="iconFontSize"
        :LineHeight="iconLineHeight" />
    </span>
  </span>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';
import WinTextBlock from './WinTextBlock.vue';
import { useI18n } from './i18n/index';

defineOptions({
  inheritAttrs: false
});

const { t } = useI18n();
const attrs = useAttrs();
const rootRef = ref(null);
const measuredCornerRadius = ref('');
const measuredSquareWidth = ref('');
let resizeObserver = null;

const props = defineProps({
  Value: { type: Number, default: -1 },
  IconSource: { type: Object, default: null },
  Style: { type: String, default: '' },
  Background: { type: String, default: '' },
  Foreground: { type: String, default: '' },
  Opacity: { type: Number, default: 1 },
  Padding: { type: [String, Number], default: '' },
  CornerRadius: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' }
});

const styleResourceMatch = computed(() => props.Style.trim().match(
  /^\{StaticResource (Attention|Informational|Success|Caution|Critical)(Dot|Value|Icon)InfoBadgeStyle\}$/
));
const styleKind = computed(() => styleResourceMatch.value?.[1] ?? 'Default');
const styleDisplayKind = computed(() => styleResourceMatch.value?.[2] ?? '');

const validatedValue = computed(() => {
  const value = Math.trunc(props.Value);
  if (value < -1) {
    throw new RangeError('InfoBadge Value must be equal to or greater than -1.');
  }
  return value;
});

const styleIconSource = computed(() => {
  if (styleDisplayKind.value !== 'Icon') return null;

  switch (styleKind.value) {
    case 'Attention':
      return { Glyph: '\uEA38' };
    case 'Informational':
      return { Glyph: '\uF13F' };
    case 'Success':
      return { Symbol: 'Accept' };
    case 'Caution':
      return { Symbol: 'Important' };
    case 'Critical':
      return { Symbol: 'Cancel' };
    default:
      return null;
  }
});

const resolvedIconSource = computed(() => props.IconSource ?? styleIconSource.value);

const symbolGlyphs = {
  Accept: '\uE8FB',
  Cancel: '\uE711',
  Important: '\uE7BA',
  Sync: '\uE895',
  Mail: '\uE715',
  Contact: '\uE77B',
  Home: '\uE80F'
};

const decodeGlyph = (value) => {
  const glyph = String(value ?? '');
  if (glyph.startsWith('\\u')) return String.fromCodePoint(Number.parseInt(glyph.slice(2), 16));
  if (glyph.startsWith('&#x') && glyph.endsWith(';')) return String.fromCodePoint(Number.parseInt(glyph.slice(3, -1), 16));
  if (glyph.startsWith('0x')) return String.fromCodePoint(Number.parseInt(glyph, 16));
  if (/^[0-9A-Fa-f]{4,5}$/.test(glyph)) return String.fromCodePoint(Number.parseInt(glyph, 16));
  return glyph;
};

const iconGlyph = computed(() => {
  const source = resolvedIconSource.value;
  if (!source) return '';
  if (source.Glyph !== undefined) return decodeGlyph(source.Glyph);
  if (source.Symbol !== undefined) return symbolGlyphs[source.Symbol] ?? String(source.Symbol);
  return '';
});

const displayKind = computed(() => {
  if (validatedValue.value >= 0) return 'Value';
  if (!iconGlyph.value) return 'Dot';
  return resolvedIconSource.value?.Glyph !== undefined ? 'FontIcon' : 'Icon';
});

const displayValue = computed(() => String(validatedValue.value));
const resolvedIconFontFamily = computed(() => (
  resolvedIconSource.value?.FontFamily || 'WinUIonWebIcons'
));
const badgeForeground = computed(() => (
  props.Foreground || 'var(--InfoBadgeForeground, var(--TextOnAccentFillColorPrimaryBrush, var(--accent-text, #ffffff)))'
));
const iconForeground = computed(() => resolvedIconSource.value?.Foreground || badgeForeground.value);
const iconFontSize = computed(() => {
  if (resolvedIconSource.value?.FontSize !== undefined) return resolvedIconSource.value.FontSize;
  if (displayKind.value === 'FontIcon') return 8;
  return 8;
});
const iconLineHeight = computed(() => iconFontSize.value);

const badgeAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) {
    return `${Number(value.trim())}px`;
  }
  return typeof value === 'number' ? `${value}px` : value;
};

const xamlThickness = (value) => {
  if (value === '' || value === undefined || value === null) return '';

  const parts = String(value)
    .split(',')
    .map((part) => {
      const trimmed = part.trim();
      return cssLength(Number.isNaN(Number(trimmed)) ? trimmed : Number(trimmed));
    });

  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return String(value);
};

const xamlCornerRadius = (value) => {
  const parts = String(value).split(',').map((part) => cssLength(part.trim()));
  return parts.length === 4 ? parts.join(' ') : cssLength(value);
};

const selfAlignment = (value) => ({
  Left: 'start',
  Center: 'center',
  Right: 'end',
  Stretch: 'stretch',
  Top: 'start',
  Bottom: 'end'
}[value] ?? '');

const initialCornerRadius = computed(() => `${displayKind.value === 'Dot' ? 2 : 8}px`);

const updateCornerRadius = () => {
  if (!rootRef.value) return;
  const { width, height } = rootRef.value.getBoundingClientRect();
  if (props.CornerRadius === '' && height > 0) measuredCornerRadius.value = `${height / 2}px`;
  if (props.Width === '' && props.MinWidth === '' && width > 0 && width < height) {
    measuredSquareWidth.value = `${height}px`;
  } else if (measuredSquareWidth.value && width > height + 0.5) {
    measuredSquareWidth.value = '';
  }
};

const badgeStyle = computed(() => {
  const style = {};
  if (props.Background) style['--InfoBadgeBackground'] = props.Background;
  if (props.Foreground) style['--InfoBadgeForeground'] = props.Foreground;
  if (resolvedIconSource.value?.Foreground) style['--InfoBadgeIconForeground'] = resolvedIconSource.value.Foreground;
  if (props.Opacity !== 1) style.opacity = props.Opacity;
  if (props.Padding !== '') style.padding = xamlThickness(props.Padding);
  if (props.CornerRadius !== '') {
    style.borderRadius = xamlCornerRadius(props.CornerRadius);
  } else {
    style['--InfoBadgeCornerRadius'] = measuredCornerRadius.value || initialCornerRadius.value;
  }
  if (measuredSquareWidth.value) style.minWidth = measuredSquareWidth.value;
  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.Height !== '') style.height = cssLength(props.Height);
  if (props.MinWidth !== '') style.minWidth = cssLength(props.MinWidth);
  if (props.MinHeight !== '') style.minHeight = cssLength(props.MinHeight);
  if (props.MaxWidth !== '') style.maxWidth = cssLength(props.MaxWidth);
  if (props.MaxHeight !== '') style.maxHeight = cssLength(props.MaxHeight);
  if (props.Margin !== '') style.margin = xamlThickness(props.Margin);
  if (props.HorizontalAlignment) style.justifySelf = selfAlignment(props.HorizontalAlignment);
  if (props.VerticalAlignment) style.alignSelf = selfAlignment(props.VerticalAlignment);
  return [attrs.style, style];
});

const styleClass = computed(() => ({
  'win-infobadge-attention': styleKind.value === 'Attention',
  'win-infobadge-informational': styleKind.value === 'Informational',
  'win-infobadge-success': styleKind.value === 'Success',
  'win-infobadge-caution': styleKind.value === 'Caution',
  'win-infobadge-critical': styleKind.value === 'Critical',
  'win-infobadge-style-fonticon-padding': (
    styleDisplayKind.value === 'Icon' &&
    ['Attention', 'Informational'].includes(styleKind.value)
  )
}));

const displayKindClass = computed(() => `win-infobadge-${displayKind.value.toLowerCase()}`);
const valueShapeClass = computed(() => ({
  'win-infobadge-single-value': displayKind.value === 'Value' && validatedValue.value <= 9
}));
const alignmentClass = computed(() => ({
  'horizontal-left': props.HorizontalAlignment === 'Left',
  'horizontal-center': props.HorizontalAlignment === 'Center',
  'horizontal-right': props.HorizontalAlignment === 'Right',
  'vertical-top': props.VerticalAlignment === 'Top',
  'vertical-center': props.VerticalAlignment === 'Center',
  'vertical-bottom': props.VerticalAlignment === 'Bottom'
}));

const automationName = computed(() => {
  if (displayKind.value === 'Value') {
    return t('control.infobadge.value', { value: validatedValue.value });
  }
  if (displayKind.value === 'Dot') {
    return t('control.infobadge.dot');
  }
  return t('control.infobadge.icon');
});

onMounted(() => {
  updateCornerRadius();
  resizeObserver = new ResizeObserver(updateCornerRadius);
  if (rootRef.value) resizeObserver.observe(rootRef.value);
});

watch(
  () => [
    displayKind.value,
    props.Padding,
    props.Width,
    props.Height,
    props.MinWidth,
    props.MinHeight,
    props.MaxWidth,
    props.MaxHeight
  ],
  () => nextTick(updateCornerRadius)
);

onBeforeUnmount(() => resizeObserver?.disconnect());
</script>

<style scoped>
.win-infobadge {
  box-sizing: border-box;
  min-width: var(--InfoBadgeMinWidth, 4px);
  min-height: var(--InfoBadgeMinHeight, 4px);
  max-height: var(--InfoBadgeMaxHeight, 16px);
  padding: var(--InfoBadgePadding, 0);
  display: inline-grid;
  place-items: center;
  overflow: hidden;
  flex: 0 0 auto;
  vertical-align: middle;
  border-radius: var(--InfoBadgeCornerRadius, 8px);
  background: var(--InfoBadgeBackground, var(--AccentFillColorDefaultBrush, var(--accent-base, #0067c0)));
  color: var(--InfoBadgeForeground, var(--TextOnAccentFillColorPrimaryBrush, var(--accent-text, #ffffff)));
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  transition: opacity var(--fast-duration) var(--fast-out-slow-in), width var(--normal-duration) var(--fast-out-slow-in), min-width var(--normal-duration) var(--fast-out-slow-in);
  --InfoBadgeInformationalBackground: light-dark(#8a8a8a, #9d9d9d);
  --InfoBadgeSuccessBackground: light-dark(#0f7b0f, #6ccb5f);
  --InfoBadgeCautionBackground: light-dark(#9d5d00, #fce100);
  --InfoBadgeCriticalBackground: light-dark(#c42b1c, #ff99a4);
}

.win-infobadge-dot {
  width: 4px;
  height: 4px;
  border-radius: 2px;
}

.win-infobadge-value,
.win-infobadge-fonticon,
.win-infobadge-icon {
  width: max-content;
}

.win-infobadge-value,
.win-infobadge-fonticon,
.win-infobadge-icon {
  min-width: 16px;
}

.win-infobadge-value {
  height: 16px;
}

.win-infobadge-single-value {
  width: 16px;
}

.win-infobadge :deep(.win-infobadge-value-text) {
  display: inline-block;
  width: max-content;
  margin: 0 4px 2px;
  color: inherit;
  font-size: 11px;
  font-weight: 400;
  line-height: 14px;
  text-align: center;
  white-space: nowrap;
  justify-self: center;
  align-self: center;
}

.win-infobadge-icon-presenter {
  box-sizing: border-box;
  display: grid;
  place-items: center;
  justify-self: center;
  align-self: stretch;
  overflow: visible;
}

.win-infobadge-fonticon .win-infobadge-icon-presenter {
  width: 12px;
  height: 14px;
  margin: 0 4px 2px;
  flex: 0 0 12px;
}

.win-infobadge-style-fonticon-padding {
  min-width: 16px;
}

.win-infobadge-style-fonticon-padding .win-infobadge-icon-presenter {
  width: 8px;
  height: 8px;
  flex-basis: 8px;
}

.win-infobadge-icon .win-infobadge-icon-presenter {
  width: 8px;
  height: 8px;
  margin: 4px;
  flex: 0 0 8px;
}

.win-infobadge :deep(.win-infobadge-icon-glyph) {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  color: var(--InfoBadgeIconForeground, inherit);
  text-align: center;
  white-space: nowrap;
}

.win-infobadge-style-fonticon-padding {
  padding: 4px 0 2px;
}

.win-infobadge-attention {
  --InfoBadgeBackground: var(--SystemFillColorAttentionBrush, var(--AccentFillColorDefaultBrush, var(--accent-base, #0067c0)));
}

.win-infobadge-informational {
  --InfoBadgeBackground: var(--SystemFillColorSolidNeutralBrush, var(--InfoBadgeInformationalBackground));
}

.win-infobadge-success {
  --InfoBadgeBackground: var(--SystemFillColorSuccessBrush, var(--InfoBadgeSuccessBackground));
}

.win-infobadge-caution {
  --InfoBadgeBackground: var(--SystemFillColorCautionBrush, var(--InfoBadgeCautionBackground));
}

.win-infobadge-critical {
  --InfoBadgeBackground: var(--SystemFillColorCriticalBrush, var(--InfoBadgeCriticalBackground));
}

.horizontal-left {
  justify-self: start;
}

.horizontal-center {
  justify-self: center;
}

.horizontal-right {
  justify-self: end;
}

.vertical-top {
  align-self: start;
}

.vertical-center {
  align-self: center;
}

.vertical-bottom {
  align-self: end;
}
</style>
