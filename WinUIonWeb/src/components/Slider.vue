<template>
  <div ref="rootRef" v-bind="forwardedAttrs" class="win-slider-root" :class="[attrs.class, themeClass, { 'is-disabled': !isEnabled }]" :style="rootStyle">
    <Grid class="win-slider-layout" Padding="{x:Bind SliderTemplate.Padding, Mode=OneWay}">
      <Grid.RowDefinitions>
        <RowDefinition Height="Auto" />
        <RowDefinition Height="*" />
      </Grid.RowDefinitions>
      <div v-if="hasHeaderVisual" class="win-slider-header HeaderContentPresenter" Grid.Row="0"><HeaderOutlet /></div>
      <TextBlock v-else-if="header !== ''" class="win-slider-header HeaderContentPresenter" Grid.Row="0" Text="{x:Bind SliderTemplate.Header, Mode=OneWay}" TextWrapping="Wrap" />
      <Border class="win-slider-focus-border FocusBorder" Grid.Row="1" CornerRadius="{ThemeResource ControlCornerRadius}" IsHitTestVisible="False" />
      <div ref="trackRef" class="win-slider SliderContainer" Grid.Row="1"
        :class="{ vertical: orientation === 'Vertical', 'is-pointer-over': isPointerOver, 'is-pressed': isPressed, 'is-keyboard-focused': isKeyboardFocused }"
        :style="sliderStyle" role="slider" :tabindex="isEnabled && isTabStop ? tabIndex : -1"
        :aria-label="automationName || header || undefined" :aria-valuemin="minimum" :aria-valuemax="maximum" :aria-valuenow="currentValue"
        :aria-orientation="orientation.toLowerCase()" :aria-disabled="!isEnabled"
        @keydown="onKeyDown" @focus="onFocus" @blur="onBlur"
        @pointerdown="onPointerDown" @pointerenter="onPointerEnter" @pointerleave="onPointerLeave" @lostpointercapture="onPointerCaptureLost">
        <Grid class="win-slider-template" :class="orientation === 'Vertical' ? 'VerticalTemplate' : 'HorizontalTemplate'">
          <Grid.RowDefinitions>
            <RowDefinition Height="{x:Bind SliderTemplate.FirstRow, Mode=OneWay}" />
            <RowDefinition Height="{x:Bind SliderTemplate.MiddleRow, Mode=OneWay}" />
            <RowDefinition Height="{x:Bind SliderTemplate.LastRow, Mode=OneWay}" />
          </Grid.RowDefinitions>
          <Grid.ColumnDefinitions>
            <ColumnDefinition Width="{x:Bind SliderTemplate.FirstColumn, Mode=OneWay}" />
            <ColumnDefinition Width="{x:Bind SliderTemplate.MiddleColumn, Mode=OneWay}" />
            <ColumnDefinition Width="{x:Bind SliderTemplate.LastColumn, Mode=OneWay}" />
          </Grid.ColumnDefinitions>
          <div Grid.Row="{x:Bind SliderTemplate.TrackRow, Mode=OneWay}" Grid.Column="{x:Bind SliderTemplate.TrackColumn, Mode=OneWay}" Grid.RowSpan="{x:Bind SliderTemplate.TrackRowSpan, Mode=OneWay}" Grid.ColumnSpan="{x:Bind SliderTemplate.TrackColumnSpan, Mode=OneWay}" class="win-slider-track" :class="orientation === 'Vertical' ? 'VerticalTrackRect' : 'HorizontalTrackRect'" />
          <div Grid.Row="{x:Bind SliderTemplate.DecreaseRow, Mode=OneWay}" Grid.Column="{x:Bind SliderTemplate.DecreaseColumn, Mode=OneWay}" Grid.RowSpan="{x:Bind SliderTemplate.DecreaseRowSpan, Mode=OneWay}" Grid.ColumnSpan="{x:Bind SliderTemplate.DecreaseColumnSpan, Mode=OneWay}" class="win-slider-fill" :class="orientation === 'Vertical' ? 'VerticalDecreaseRect' : 'HorizontalDecreaseRect'" :style="fillStyle" />
          <div v-if="showTopLeftTicks" Grid.Row="0" Grid.Column="0" Grid.ColumnSpan="{x:Bind SliderTemplate.TickColumnSpan, Mode=OneWay}" Grid.RowSpan="{x:Bind SliderTemplate.TickRowSpan, Mode=OneWay}" class="win-slider-ticks top-left" :class="orientation === 'Vertical' ? 'LeftTickBar' : 'TopTickBar'">
            <span v-for="tick in ticks" :key="tick" class="win-slider-tick" :style="tickStyle(tick)" />
          </div>
          <div v-if="showBottomRightTicks" Grid.Row="{x:Bind SliderTemplate.LastTickRow, Mode=OneWay}" Grid.Column="{x:Bind SliderTemplate.LastTickColumn, Mode=OneWay}" Grid.ColumnSpan="{x:Bind SliderTemplate.TickColumnSpan, Mode=OneWay}" Grid.RowSpan="{x:Bind SliderTemplate.TickRowSpan, Mode=OneWay}" class="win-slider-ticks bottom-right" :class="[orientation === 'Vertical' ? 'RightTickBar' : 'BottomTickBar', { inline: tickPlacement === 'Inline' }]">
            <span v-for="tick in ticks" :key="tick" class="win-slider-tick" :style="tickStyle(tick)" />
          </div>
          <div ref="thumbRef" Grid.Row="{x:Bind SliderTemplate.ThumbRow, Mode=OneWay}" Grid.Column="{x:Bind SliderTemplate.ThumbColumn, Mode=OneWay}" Grid.RowSpan="{x:Bind SliderTemplate.ThumbRowSpan, Mode=OneWay}" Grid.ColumnSpan="{x:Bind SliderTemplate.ThumbColumnSpan, Mode=OneWay}" class="win-slider-thumb" :class="[orientation === 'Vertical' ? 'VerticalThumb' : 'HorizontalThumb', { 'is-pointer-over': isThumbPointerOver, 'is-pressed': isThumbPressed }]"
            @pointerdown.stop="onThumbPointerDown" @pointerenter="onThumbPointerEnter" @pointerleave="onThumbPointerLeave" @lostpointercapture="onPointerCaptureLost">
            <Border class="win-slider-outer-thumb" Margin="-2" BorderThickness="1" Background="{ThemeResource SliderOuterThumbBackground}" BorderBrush="{ThemeResource SliderThumbBorderBrush}" CornerRadius="{ThemeResource SliderThumbCornerRadius}">
              <Ellipse class="win-slider-inner-thumb SliderInnerThumb" Width="{ThemeResource SliderInnerThumbWidth}" Height="{ThemeResource SliderInnerThumbHeight}" Fill="{x:Bind SliderTemplate.ThumbBackground, Mode=OneWay}" />
            </Border>
          </div>
        </Grid>
      </div>
    </Grid>
    <ToolTip ref="thumbToolTipRef" IsOpen="{x:Bind SliderTemplate.ToolTipOpen, Mode=TwoWay}" IsEnabled="{x:Bind SliderTemplate.ToolTipEnabled, Mode=OneWay}"
      Placement="{x:Bind SliderTemplate.ToolTipPlacement, Mode=OneWay}"
      PlacementTarget="{x:Bind SliderTemplate.ToolTipTarget, Mode=OneWay}" HorizontalOffset="{x:Bind SliderTemplate.ToolTipOffset, Mode=OneWay}" VerticalOffset="{x:Bind SliderTemplate.ToolTipOffset, Mode=OneWay}" Padding="8,3,8,5" FontSize="15">
      <ToolTip.Content>
        <TextBlock Text="{x:Bind SliderTemplate.ToolTipContent, Mode=OneWay}" FontSize="15" FontWeight="Normal" />
      </ToolTip.Content>
    </ToolTip>
  </div>
</template>

<script>
import { SliderHeaderProperty } from './inlineControlProperties';
export { SliderHeaderProperty } from './inlineControlProperties';
export default { Header: SliderHeaderProperty };
</script>

<script setup>
import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, unref, useAttrs, useSlots, watch } from 'vue';
import Grid from './Grid.vue';
import RowDefinition from './RowDefinition.vue';
import ColumnDefinition from './ColumnDefinition.vue';
import Border from './Border.vue';
import Ellipse from './Ellipse.vue';
import TextBlock from './TextBlock.vue';
import ToolTip from './ToolTip.vue';
import { alignment, boolValue, cssLength, xamlThickness } from './layout';
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlResourceObject, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime';

defineOptions({ name: 'Slider', inheritAttrs: false });
const props = defineProps({
  Value: { type: [Number, String], default: 0 }, Minimum: { type: [Number, String], default: 0 }, Maximum: { type: [Number, String], default: 100 },
  SmallChange: { type: [Number, String], default: 1 }, LargeChange: { type: [Number, String], default: 10 }, StepFrequency: { type: [Number, String], default: 1 },
  Header: { type: [String, Number, Object], default: '' }, Orientation: { type: String, default: 'Horizontal' }, IsDirectionReversed: { type: [Boolean, String], default: false },
  TickFrequency: { type: [Number, String], default: 0 }, TickPlacement: { type: String, default: 'None' }, SnapsTo: { type: String, default: 'StepValues' },
  IsEnabled: { type: [Boolean, String], default: true }, IsThumbToolTipEnabled: { type: [Boolean, String], default: true }, ThumbToolTipValueConverter: { type: [String, Function, Object], default: null },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: 0 }, MinHeight: { type: [String, Number], default: 0 }, MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: 0 }, Padding: { type: [String, Number], default: 0 }, CornerRadius: { type: [String, Number], default: '{ThemeResource SliderTrackCornerRadius}' },
  Background: { type: [String, Object], default: '{ThemeResource SliderTrackFill}' }, Foreground: { type: [String, Object], default: '{ThemeResource SliderTrackValueFill}' },
  HorizontalAlignment: { type: String, default: 'Stretch' }, VerticalAlignment: { type: String, default: 'Stretch' }, FlowDirection: { type: String, default: '' },
  RequestedTheme: { type: String, default: 'Default' }, Visibility: { type: String, default: 'Visible' }, IsHitTestVisible: { type: [Boolean, String], default: true },
  IsTabStop: { type: [Boolean, String], default: true }, TabIndex: { type: [Number, String], default: 0 }, IsFocusEngagementEnabled: { type: [Boolean, String], default: true }
});
const emit = defineEmits(['update:Value', 'update:SnapsTo', 'update:Minimum', 'update:Maximum', 'update:SmallChange', 'update:LargeChange', 'update:StepFrequency', 'update:TickFrequency', 'update:IsEnabled', 'update:IsThumbToolTipEnabled', 'update:Orientation', 'update:IsDirectionReversed', 'update:TickPlacement', 'update:Header', 'update:Width', 'update:Height', 'ValueChanged']);
const attrs = useAttrs(), slots = useSlots(), instance = getCurrentInstance();
const inheritedTheme = inject('winuiTheme', null);
const value = input => resolveXamlValue(input, instance);
const localProperties = reactive({});
const property = name => name in localProperties ? localProperties[name] : value(props[name]);
const number = (input, fallback = 0) => Number.isFinite(Number(input)) ? Number(input) : fallback;
const rootRef = ref(null), trackRef = ref(null), thumbRef = ref(null), thumbToolTipRef = ref(null);
const intermediateValue = ref(null), localValue = ref(null), toolTipOpen = ref(false);
const toolTipInputMode = ref('mouse');
const localSnapsTo = ref(null);
const isPointerOver = ref(false), isThumbPointerOver = ref(false), isThumbPressed = ref(false), isPressed = ref(false), isKeyboardFocused = ref(false), isDragging = ref(false);
const measuredLength = ref(100), isRtl = ref(false);
const minimum = computed(() => number(property('Minimum')));
const maximum = computed(() => Math.max(minimum.value, number(property('Maximum'), 100)));
const clamp = input => Math.max(minimum.value, Math.min(maximum.value, number(input, minimum.value)));
const externalValue = computed(() => clamp(value(props.Value)));
const currentValue = computed(() => clamp(localValue.value ?? externalValue.value));
const visualValue = computed(() => clamp(intermediateValue.value ?? currentValue.value));
const orientation = computed(() => property('Orientation') === 'Vertical' ? 'Vertical' : 'Horizontal');
const isEnabled = computed(() => boolValue(property('IsEnabled')));
const isToolTipEnabled = computed(() => isEnabled.value && boolValue(property('IsThumbToolTipEnabled')));
const isTabStop = computed(() => boolValue(value(props.IsTabStop))), tabIndex = computed(() => number(value(props.TabIndex)));
const reversed = computed(() => boolValue(property('IsDirectionReversed')));
const horizontalReversed = computed(() => reversed.value !== isRtl.value);
const physicalReversed = computed(() => orientation.value === 'Horizontal' ? horizontalReversed.value : reversed.value);
const stepFrequency = computed(() => Math.max(0, number(property('StepFrequency'), 1)));
const tickFrequency = computed(() => Math.max(0, number(property('TickFrequency'))));
const tickPlacement = computed(() => String(property('TickPlacement')));
const snapsTo = computed(() => localSnapsTo.value ?? value(props.SnapsTo));
const snapsToTicks = computed(() => snapsTo.value === 'Ticks');
const header = computed(() => property('Header') ?? '');
const automationName = computed(() => value(attrs['AutomationProperties.Name']));
const headerNodes = computed(() => {
  const nodes = [];
  const visit = children => {
    for (const node of children) {
      if (node?.type === Fragment && Array.isArray(node.children)) visit(node.children);
      else if (node?.type?.__sliderHeaderProperty) nodes.push(...(node.children?.default?.() || []));
    }
  };
  visit(slots.default?.() || []);
  return normalizeXamlNodes(nodes, instance);
});
const hasHeaderElement = computed(() => headerNodes.value.length > 0);
const headerIsComponent = computed(() => header.value && typeof header.value === 'object' && ('render' in header.value || 'setup' in header.value));
const hasHeaderVisual = computed(() => hasHeaderElement.value || isVNode(header.value) || headerIsComponent.value);
const HeaderOutlet = defineComponent({ setup: () => () => hasHeaderElement.value ? h(Fragment, headerNodes.value)
  : isVNode(header.value) ? h(Fragment, normalizeXamlNodes([header.value], instance)) : headerIsComponent.value ? h(header.value) : null });
const theme = computed(() => ['Light', 'Dark'].includes(value(props.RequestedTheme)) ? String(value(props.RequestedTheme)).toLowerCase() : unref(inheritedTheme));
const themeClass = computed(() => ['light', 'dark'].includes(theme.value) ? `win-theme-scope theme-${theme.value}` : '');
provide('winuiTheme', theme);
const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !['class', 'style', 'ValueChanged', 'onValueChanged'].includes(key) && !key.startsWith('onUpdate:'))));
const rootStyle = computed(() => {
  const result = { margin: xamlThickness(value(props.Margin)), justifySelf: alignment(value(props.HorizontalAlignment), 'horizontal'), alignSelf: alignment(value(props.VerticalAlignment), 'vertical') };
  for (const name of ['Width', 'Height', 'MinWidth', 'MinHeight', 'MaxWidth', 'MaxHeight']) {
    const resolved = property(name);
    if (resolved !== '' && resolved !== 'Auto') result[name[0].toLowerCase() + name.slice(1)] = cssLength(resolved);
  }
  result.direction = value(props.FlowDirection) === 'RightToLeft' ? 'rtl' : value(props.FlowDirection) === 'LeftToRight' ? 'ltr' : undefined;
  result.display = value(props.Visibility) === 'Collapsed' ? 'none' : undefined;
  result.pointerEvents = boolValue(value(props.IsHitTestVisible)) ? undefined : 'none';
  if (orientation.value === 'Vertical' && !property('Width')) result.width = '32px';
  if (orientation.value === 'Vertical' && !property('Height')) result.height = '100px';
  return [attrs.style, result];
});
const state = computed(() => !isEnabled.value ? 'Disabled' : isPressed.value ? 'Pressed' : isPointerOver.value ? 'PointerOver' : '');
const resource = (base, currentState = state.value) => value(`{ThemeResource ${base}${currentState}}`);
const sliderStyle = computed(() => ({
  '--slider-track-fill': state.value ? resource('SliderTrackFill') : value(props.Background),
  '--slider-value-fill': state.value ? resource('SliderTrackValueFill') : value(props.Foreground),
  '--slider-tick-fill': resource('SliderTickBarFill', isEnabled.value ? '' : 'Disabled'),
  '--slider-inline-tick-fill': value('{ThemeResource SliderInlineTickBarFill}'),
  '--slider-track-radius': cssLength(value(props.CornerRadius))
}));
const thumbLength = 18, minTickGap = 20;
const ratio = computed(() => maximum.value === minimum.value ? 0 : (visualValue.value - minimum.value) / (maximum.value - minimum.value));
const physicalRatio = computed(() => physicalReversed.value ? 1 - ratio.value : ratio.value);
const decreaseSize = computed(() => Math.max(0, measuredLength.value - thumbLength) * ratio.value);
const thumbLeadingExtent = computed(() => Math.max(0, measuredLength.value - thumbLength) * physicalRatio.value);
const fillStyle = computed(() => orientation.value === 'Vertical'
  ? { height: `${decreaseSize.value}px`, top: reversed.value ? 0 : 'auto', bottom: reversed.value ? 'auto' : 0 }
  : { width: `${decreaseSize.value}px`, left: horizontalReversed.value ? 'auto' : 0, right: horizontalReversed.value ? 0 : 'auto' });
const showTopLeftTicks = computed(() => tickFrequency.value > 0 && ['Outside', 'TopLeft'].includes(tickPlacement.value));
const showBottomRightTicks = computed(() => tickFrequency.value > 0 && ['Outside', 'BottomRight', 'Inline'].includes(tickPlacement.value));
const ticks = computed(() => {
  if (!showTopLeftTicks.value && !showBottomRightTicks.value) return [];
  const count = (maximum.value - minimum.value) / tickFrequency.value;
  const skip = Math.max(1, Math.ceil(minTickGap * count / Math.max(1, measuredLength.value - thumbLength)));
  return Array.from({ length: Math.min(1000, Math.floor(count / skip) + 1) }, (_, index) => minimum.value + index * tickFrequency.value * skip);
});
const tickStyle = tick => {
  const tickRatio = maximum.value === minimum.value ? 0 : (tick - minimum.value) / (maximum.value - minimum.value);
  const offset = 8.5 + Math.max(0, measuredLength.value - thumbLength) * (physicalReversed.value ? 1 - tickRatio : tickRatio);
  return orientation.value === 'Vertical' ? { bottom: `${offset}px` } : { left: `${offset}px` };
};
// GetClosestStep uses absolute multiples and chooses the lower value on a tie.
const closestStep = (input, frequency) => {
  const candidate = clamp(input);
  if (!(frequency > 0)) return candidate;
  const next = Math.min(maximum.value, Math.ceil(candidate / frequency) * frequency);
  const previous = Math.max(minimum.value, Math.floor(candidate / frequency) * frequency);
  return Number(clamp(next - candidate < candidate - previous - 1e-10 ? next : previous).toPrecision(14));
};
const snap = input => closestStep(input, snapsToTicks.value ? tickFrequency.value : stepFrequency.value);
const publishValue = input => {
  const next = clamp(input), old = currentValue.value;
  localValue.value = next;
  updateXamlBinding(props.Value, next, instance);
  emit('update:Value', next);
  if (old !== next) {
    const args = { OldValue: old, NewValue: next }, sender = instance?.exposeProxy ?? instance?.proxy;
    emit('ValueChanged', sender, args);
    resolveXamlHandler(attrs.ValueChanged, instance)?.(sender, args);
  }
};
const toolTipContent = computed(() => {
  const input = props.ThumbToolTipValueConverter;
  const key = typeof input === 'string' ? input.match(/^\{(?:StaticResource|ThemeResource)\s+([^\s}]+)\}$/)?.[1] : null;
  const converter = key ? resolveXamlResourceObject(key, instance) : value(input);
  if (converter) {
    try {
      const converted = typeof converter === 'function' ? converter(currentValue.value)
        : converter.Convert?.(currentValue.value, { Name: 'String', Kind: 'Primitive' }, instance?.exposeProxy ?? instance?.proxy, document.documentElement.lang);
      if (converted !== undefined) return converted === null ? '' : typeof converted === 'object' ? String(converted.Text ?? converted.Content ?? '') : String(converted);
    } catch { /* Preserve the default numeric display when conversion fails. */ }
  }
  let places = 0, frequency = stepFrequency.value;
  while (places < 4 && Math.abs(frequency - Math.round(frequency)) > 0.00001) { places++; frequency *= 10; }
  return currentValue.value.toFixed(places);
});
const SliderTemplate = reactive({
  Header: header, Padding: computed(() => value(props.Padding)), ToolTipOpen: toolTipOpen, ToolTipEnabled: isToolTipEnabled,
  ToolTipContent: toolTipContent, ToolTipTarget: computed(() => thumbRef.value), ToolTipPlacement: computed(() => orientation.value === 'Vertical' ? 'Left' : 'Top'),
  ToolTipOffset: computed(() => toolTipInputMode.value === 'touch' ? 44 : toolTipInputMode.value === 'keyboard' ? 12 : 20),
  ThumbBackground: computed(() => resource('SliderThumbBackground')),
  FirstRow: computed(() => orientation.value === 'Horizontal' ? 14 : '*'), MiddleRow: computed(() => 'Auto'), LastRow: computed(() => orientation.value === 'Horizontal' ? 14 : thumbLeadingExtent.value),
  FirstColumn: computed(() => orientation.value === 'Horizontal' ? thumbLeadingExtent.value : 14), MiddleColumn: computed(() => 'Auto'), LastColumn: computed(() => orientation.value === 'Horizontal' ? '*' : 14),
  TrackRow: computed(() => orientation.value === 'Horizontal' ? 1 : 0), TrackColumn: computed(() => orientation.value === 'Horizontal' ? 0 : 1),
  TrackRowSpan: computed(() => orientation.value === 'Horizontal' ? 1 : 3), TrackColumnSpan: computed(() => orientation.value === 'Horizontal' ? 3 : 1),
  DecreaseRow: computed(() => orientation.value === 'Horizontal' ? 1 : reversed.value ? 0 : 2), DecreaseColumn: computed(() => orientation.value === 'Horizontal' ? 0 : 1), DecreaseRowSpan: computed(() => orientation.value === 'Horizontal' ? 1 : 3), DecreaseColumnSpan: computed(() => orientation.value === 'Horizontal' ? 3 : 1),
  ThumbRow: computed(() => orientation.value === 'Horizontal' ? 0 : 1), ThumbColumn: computed(() => orientation.value === 'Horizontal' ? 1 : 0),
  ThumbRowSpan: computed(() => orientation.value === 'Horizontal' ? 3 : 1), ThumbColumnSpan: computed(() => orientation.value === 'Horizontal' ? 1 : 3),
  TickRowSpan: computed(() => orientation.value === 'Horizontal' ? 1 : 3), TickColumnSpan: computed(() => orientation.value === 'Horizontal' ? 3 : 1),
  LastTickRow: computed(() => orientation.value === 'Horizontal' ? tickPlacement.value === 'Inline' ? 1 : 2 : 0),
  LastTickColumn: computed(() => orientation.value === 'Horizontal' ? 0 : tickPlacement.value === 'Inline' ? 1 : 2)
});
provide(xamlScopeKey, { SliderTemplate });
const showToolTip = (immediate = true, mode = 'mouse') => { toolTipInputMode.value = mode; if (isToolTipEnabled.value) thumbToolTipRef.value?.show?.(immediate); };
const hideToolTip = () => thumbToolTipRef.value?.hide?.();
const onPointerEnter = event => { isPointerOver.value = event.pointerType !== 'touch'; if (event.pointerType === 'touch') showToolTip(true, 'touch'); };
const onPointerLeave = event => { isPointerOver.value = false; if (event.pointerType === 'touch' && !isPressed.value && !isKeyboardFocused.value) hideToolTip(); };
const onThumbPointerEnter = event => { isThumbPointerOver.value = event.pointerType !== 'touch'; if (!isPressed.value && !isKeyboardFocused.value) showToolTip(event.pointerType === 'touch', event.pointerType === 'touch' ? 'touch' : 'mouse'); };
const onThumbPointerLeave = () => { isThumbPointerOver.value = false; if (!isPressed.value && !isKeyboardFocused.value) hideToolTip(); };
const onFocus = () => { if (trackRef.value?.matches(':focus-visible')) { isKeyboardFocused.value = true; showToolTip(true, 'keyboard'); } };
const onBlur = () => { isKeyboardFocused.value = false; hideToolTip(); };
let pointerId = null, captureElement = null, grabOffset = 0;
const updateFromPointer = event => {
  const rect = trackRef.value.getBoundingClientRect();
  const length = orientation.value === 'Vertical' ? rect.height : rect.width;
  const distance = orientation.value === 'Vertical' ? rect.bottom - event.clientY + grabOffset : event.clientX - rect.left - grabOffset;
  const rawRatio = Math.max(0, Math.min(1, (distance - 9) / Math.max(1, length - 18)));
  intermediateValue.value = minimum.value + (physicalReversed.value ? 1 - rawRatio : rawRatio) * (maximum.value - minimum.value);
  publishValue(snap(intermediateValue.value));
};
const removePointerListeners = () => {
  window.removeEventListener('pointermove', onWindowPointerMove, true); window.removeEventListener('pointerup', onWindowPointerUp, true);
  window.removeEventListener('pointercancel', onWindowPointerCancel, true); window.removeEventListener('blur', onWindowBlur);
};
const finishPointer = () => {
  const capturedId = pointerId, element = captureElement;
  pointerId = null; captureElement = null; grabOffset = 0; intermediateValue.value = null;
  isDragging.value = false; isPressed.value = false; isThumbPressed.value = false;
  removePointerListeners();
  if (element?.hasPointerCapture?.(capturedId)) element.releasePointerCapture(capturedId);
  hideToolTip();
};
const onWindowPointerMove = event => { if (event.pointerId === pointerId) { event.preventDefault(); updateFromPointer(event); } };
const onWindowPointerUp = event => { if (event.pointerId === pointerId) { updateFromPointer(event); finishPointer(); } };
const cancelPointer = () => { isPointerOver.value = false; isThumbPointerOver.value = false; finishPointer(); };
const onWindowPointerCancel = event => { if (event.pointerId === pointerId) cancelPointer(); };
const onWindowBlur = () => { isKeyboardFocused.value = false; cancelPointer(); };
const onPointerCaptureLost = event => { if (event.pointerId === pointerId) { isPointerOver.value = false; isThumbPointerOver.value = false; finishPointer(); } };
const beginPointer = (event, thumb) => {
  if (!isEnabled.value || event.button !== 0 || pointerId !== null) return;
  event.preventDefault(); event.stopPropagation(); isKeyboardFocused.value = false;
  trackRef.value.focus({ preventScroll: true });
  isKeyboardFocused.value = false; isPressed.value = true; isThumbPressed.value = thumb; isDragging.value = true;
  pointerId = event.pointerId; captureElement = thumb ? thumbRef.value : trackRef.value;
  const rect = thumbRef.value.getBoundingClientRect();
  grabOffset = thumb ? orientation.value === 'Vertical' ? event.clientY - (rect.top + rect.height / 2) : event.clientX - (rect.left + rect.width / 2) : 0;
  window.addEventListener('pointermove', onWindowPointerMove, { capture: true, passive: false }); window.addEventListener('pointerup', onWindowPointerUp, true);
  window.addEventListener('pointercancel', onWindowPointerCancel, true); window.addEventListener('blur', onWindowBlur);
  try { captureElement.setPointerCapture(pointerId); } catch { /* Window listeners retain the interaction if capture is unavailable. */ }
  if (!thumb) updateFromPointer(event);
  showToolTip(true, event.pointerType === 'touch' ? 'touch' : 'mouse');
};
const onPointerDown = event => beginPointer(event, false), onThumbPointerDown = event => beginPointer(event, true);
const step = forward => {
  const amount = snapsToTicks.value ? tickFrequency.value : Math.max(0, number(property('SmallChange'), 1));
  if (!(amount > 0)) return;
  const next = !forward && currentValue.value === maximum.value && Math.abs(currentValue.value / amount - Math.round(currentValue.value / amount)) > 1e-10
    ? Math.floor(currentValue.value / amount) * amount : closestStep(currentValue.value + (forward ? amount : -amount), amount);
  publishValue(next);
};
const onKeyDown = event => {
  if (!isEnabled.value || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'Home') publishValue(minimum.value);
  else if (event.key === 'End') publishValue(maximum.value);
  else if (event.key === 'ArrowRight') step(!horizontalReversed.value);
  else if (event.key === 'ArrowLeft') step(horizontalReversed.value);
  else if (event.key === 'ArrowUp') step(!reversed.value);
  else if (event.key === 'ArrowDown') step(reversed.value);
  else return;
  event.preventDefault(); isKeyboardFocused.value = true; intermediateValue.value = null; showToolTip(true, 'keyboard');
};
const measure = () => {
  if (!trackRef.value) return;
  measuredLength.value = orientation.value === 'Vertical' ? trackRef.value.clientHeight : trackRef.value.clientWidth;
  isRtl.value = getComputedStyle(trackRef.value).direction === 'rtl';
  if (toolTipOpen.value) thumbToolTipRef.value?.updatePosition?.();
};
let resizeObserver;
let thumbAnimation = null, thumbAnimationSequence = 0;
const thumbState = computed(() => !isEnabled.value ? 'Disabled' : isThumbPressed.value ? 'Pressed' : isThumbPointerOver.value ? 'PointerOver' : 'Normal');
const updateThumbState = async (animate = true) => {
  const sequence = ++thumbAnimationSequence;
  await nextTick();
  const element = thumbRef.value?.querySelector('.SliderInnerThumb');
  if (!element) return;
  const previous = getComputedStyle(element).transform;
  thumbAnimation?.cancel();
  const target = `scale(${thumbState.value === 'Pressed' ? .71 : thumbState.value === 'Normal' ? .86 : 1.167})`;
  if (!animate) { element.style.transform = target; return; }
  const templateStyle = getComputedStyle(rootRef.value);
  const durationResource = ['Normal', 'Disabled'].includes(thumbState.value) ? 'ControlFastAnimationDuration' : 'ControlNormalAnimationDuration';
  const durationText = templateStyle.getPropertyValue(`--${durationResource}`).trim();
  const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : parseFloat(durationText) * (durationText.endsWith('ms') ? 1 : 1000) || (durationResource === 'ControlFastAnimationDuration' ? 167 : 250);
  const easing = templateStyle.getPropertyValue('--ControlFastOutSlowInKeySpline').trim() || 'cubic-bezier(0, 0, 0, 1)';
  const animation = element.animate([{ transform: previous }, { transform: target }], { duration, easing, fill: 'forwards' });
  thumbAnimation = animation;
  try { await animation.finished; } catch { return; }
  if (sequence !== thumbAnimationSequence) return;
  element.style.transform = target; animation.cancel(); thumbAnimation = null;
};
onMounted(() => { measure(); updateThumbState(false); resizeObserver = new ResizeObserver(measure); resizeObserver.observe(trackRef.value); });
onBeforeUnmount(() => { finishPointer(); resizeObserver?.disconnect(); thumbAnimationSequence++; thumbAnimation?.cancel(); });
watch(thumbState, () => updateThumbState());
watch(externalValue, next => { localValue.value = next; }, { immediate: true });
watch(() => value(props.SnapsTo), () => { localSnapsTo.value = null; });
watch([minimum, maximum], () => { if (currentValue.value !== localValue.value) publishValue(currentValue.value); });
watch([orientation, reversed, () => value(props.FlowDirection)], () => { finishPointer(); nextTick(measure); });
watch(isEnabled, enabled => { if (!enabled) { finishPointer(); isPointerOver.value = false; isThumbPointerOver.value = false; isKeyboardFocused.value = false; } });
watch(isToolTipEnabled, enabled => { if (!enabled) hideToolTip(); });
watch([visualValue, toolTipContent], () => { if (toolTipOpen.value) nextTick(() => thumbToolTipRef.value?.updatePosition?.()); });
const Value = computed({ get: () => currentValue.value, set: publishValue });
const publicProperties = {};
for (const name of ['Minimum', 'Maximum', 'SmallChange', 'LargeChange', 'StepFrequency', 'TickFrequency', 'IsEnabled', 'IsThumbToolTipEnabled', 'Orientation', 'IsDirectionReversed', 'TickPlacement', 'Header', 'Width', 'Height']) {
  publicProperties[name] = computed({ get: () => property(name), set: input => { localProperties[name] = value(input); updateXamlBinding(props[name], localProperties[name], instance); emit(`update:${name}`, localProperties[name]); } });
  watch(() => value(props[name]), () => { delete localProperties[name]; });
}
const SnapsTo = computed({ get: () => snapsTo.value, set: input => { localSnapsTo.value = input === 'Ticks' ? 'Ticks' : 'StepValues'; updateXamlBinding(props.SnapsTo, localSnapsTo.value, instance); emit('update:SnapsTo', localSnapsTo.value); } });
const Focus = focusState => { if (!isEnabled.value) return false; trackRef.value?.focus({ preventScroll: true }); isKeyboardFocused.value = focusState === 'Keyboard'; if (isKeyboardFocused.value) showToolTip(true, 'keyboard'); return true; };
defineExpose({ ...publicProperties, Value, SnapsTo, IntermediateValue: visualValue, IsDragging: isDragging, Element: rootRef, Focus });
</script>

<style>
.win-slider-root {
  --ControlSolidFillColorDefaultBrush: var(--ctrl-solid-fill);
  --ControlFillColorInputActiveBrush: var(--ctrl-fill-input-active);
  --SliderTrackFill: var(--ControlStrongFillColorDefaultBrush, var(--ctrl-strong-fill));
  --SliderTrackFillPointerOver: var(--SliderTrackFill);
  --SliderTrackFillPressed: var(--SliderTrackFill);
  --SliderTrackFillDisabled: var(--ControlStrongFillColorDisabledBrush, var(--ctrl-strong-fill-disabled));
  --SliderTrackValueFill: var(--AccentFillColorDefaultBrush, var(--accent-base));
  --SliderTrackValueFillPointerOver: var(--AccentFillColorSecondaryBrush, var(--accent-hover));
  --SliderTrackValueFillPressed: var(--AccentFillColorTertiaryBrush, var(--accent-pressed));
  --SliderTrackValueFillDisabled: var(--AccentFillColorDisabledBrush, var(--accent-fill-disabled));
  --SliderThumbBackground: var(--SliderTrackValueFill);
  --SliderThumbBackgroundPointerOver: var(--SliderTrackValueFillPointerOver);
  --SliderThumbBackgroundPressed: var(--SliderTrackValueFillPressed);
  --SliderThumbBackgroundDisabled: var(--SliderTrackValueFillDisabled);
  --SliderOuterThumbBackground: var(--ControlSolidFillColorDefaultBrush, var(--ctrl-solid-fill));
  --SliderThumbBorderBrush: var(--ControlElevationBorderBrush);
  --SliderTickBarFill: var(--SliderTrackFill);
  --SliderTickBarFillDisabled: var(--SliderTrackFillDisabled);
  --SliderInlineTickBarFill: var(--ControlFillColorInputActiveBrush, var(--ctrl-fill-input-active));
  --SliderHeaderForeground: var(--TextFillColorPrimaryBrush, var(--text-primary));
  --SliderHeaderForegroundDisabled: var(--TextFillColorDisabledBrush, var(--text-disabled));
  --SliderThumbCornerRadius: 10px;
  --SliderTrackCornerRadius: 2px;
  --SliderInnerThumbWidth: 12px;
  --SliderInnerThumbHeight: 12px;
  position: relative; display: grid; min-width: 0; box-sizing: border-box;
}
.win-slider-root.theme-light { --ControlSolidFillColorDefaultBrush: #FFFFFF; }
.win-slider-root.theme-dark { --ControlSolidFillColorDefaultBrush: #454545; }
.win-slider-layout { width: 100%; height: 100%; min-width: 0; min-height: 0; }
.win-slider-header { margin: 0 0 4px; min-width: 0; overflow-wrap: anywhere; color: var(--SliderHeaderForeground, var(--text-primary)); font-weight: normal; }
.win-slider-root.is-disabled .win-slider-header { color: var(--SliderHeaderForegroundDisabled, var(--text-disabled)); }
.win-slider-focus-border { pointer-events: none; }
.win-slider { position: relative; min-width: 0; min-height: 32px; height: 100%; touch-action: none; outline: none; cursor: default; background: transparent; }
.win-slider.vertical { min-width: 32px; min-height: 0; }
.win-slider.is-keyboard-focused { outline: 2px solid var(--FocusStrokeColorOuterBrush, var(--text-primary)); outline-offset: 1px; border-radius: var(--control-corner-radius, 4px); }
.win-slider-template { position: absolute; inset: 0; min-width: 0; min-height: 0; direction: ltr; }
.win-slider-track, .win-slider-fill { height: 4px; border-radius: var(--slider-track-radius, 2px); pointer-events: none; }
.win-slider-track { position: relative; width: 100%; align-self: center; background: var(--slider-track-fill, var(--ctrl-strong-fill)); }
.win-slider-fill { position: absolute; top: 0; background: var(--slider-value-fill, var(--accent-base)); }
.win-slider.vertical .win-slider-track, .win-slider.vertical .win-slider-fill { width: 4px; height: 100%; }
.win-slider.vertical .win-slider-track { justify-self: center; }
.win-slider.vertical .win-slider-fill { left: 0; }
.win-slider-thumb { position: relative; width: 18px; height: 18px; align-self: center; justify-self: center; z-index: 2; touch-action: none; }
.win-slider-outer-thumb { position: absolute; inset: 0; width: 22px !important; height: 22px !important; min-width: 22px !important; min-height: 22px !important; max-width: none !important; max-height: none !important; display: grid; place-items: center; box-sizing: border-box; border-color: transparent !important; background: linear-gradient(var(--SliderOuterThumbBackground), var(--SliderOuterThumbBackground)) padding-box, var(--SliderThumbBorderBrush) border-box !important; }
.win-slider-outer-thumb > .win-ellipse { grid-area: 1 / 1; transform: scale(.86); transform-origin: 50% 50%; }
.win-slider-ticks { position: relative; width: 100%; height: 4px; pointer-events: none; }
.win-slider-tick { position: absolute; width: 1px; height: 4px; background: var(--slider-tick-fill, var(--ctrl-strong-fill)); }
.win-slider-ticks.top-left { align-self: end; margin-bottom: 4px; }
.win-slider-ticks.bottom-right { align-self: start; margin-top: 4px; }
.win-slider-ticks.inline { align-self: center; margin: 0; }
.win-slider-tick { top: 0; }
.win-slider-ticks.inline .win-slider-tick { background: var(--slider-inline-tick-fill, var(--ctrl-fill-input-active)); }
.win-slider.vertical .win-slider-ticks { width: 4px; height: 100%; }
.win-slider.vertical .win-slider-tick { width: 4px; height: 1px; }
.win-slider.vertical .win-slider-ticks.top-left { justify-self: end; margin: 0 4px 0 0; }
.win-slider.vertical .win-slider-ticks.bottom-right { justify-self: start; margin: 0 0 0 4px; }
.win-slider.vertical .win-slider-ticks.inline { justify-self: center; margin: 0; }
.win-slider.vertical .win-slider-tick { top: auto; left: 0; }
@media (forced-colors: active) {
  .win-slider-root, .win-slider-root.theme-light, .win-slider-root.theme-dark { --ControlSolidFillColorDefaultBrush: ButtonFace; --ControlFillColorInputActiveBrush: ButtonFace; }
}
</style>
