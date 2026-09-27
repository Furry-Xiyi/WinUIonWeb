<template>
  <button
    ref="buttonRef"
    type="button"
    v-bind="buttonAttrs"
    class="win-btn"
    :HorizontalAlignment="resolveXamlValue(props.HorizontalAlignment, instance)"
    :VerticalAlignment="resolveXamlValue(props.VerticalAlignment, instance)"
    :class="[
      styleClass,
      {
        'content-horizontal-stretch': PresenterHorizontalAlignment === 'Stretch',
        'content-vertical-stretch': PresenterVerticalAlignment === 'Stretch',
        'is-pressed': IsPressed,
        'win-theme-scope': RequestedTheme === 'Light' || RequestedTheme === 'Dark',
        'theme-light': RequestedTheme === 'Light',
        'theme-dark': RequestedTheme === 'Dark',
        'system-focus': boolValue(resolveXamlValue(props.UseSystemFocusVisuals, instance))
      },
      attrs.class
    ]"
    :style="buttonStyle"
    :disabled="isDisabled"
    :tabindex="boolValue(resolveXamlValue(props.IsTabStop, instance)) ? undefined : -1"
    @click="onNativeClick"
    @pointerenter="onPointerEntered"
    @pointerleave="onPointerExited"
    @pointerdown="onPointerPressed"
    @pointermove="onPointerMoved"
    @pointerup="onPointerReleased"
    @pointercancel="onPointerCanceled"
    @lostpointercapture="onPointerCaptureLost"
    @keydown="onKeyDown"
    @keyup="onKeyUp"
    @focusout="onLostFocus"
    @contextmenu="onContextRequested"
    @focus="onGotFocus">
    <Grid v-if="titleBarStylePrefix" x:Name="RootGrid" class="win-titlebar-button-root"
      Background="{x:Bind PresenterBackground}" CornerRadius="{x:Bind PresenterCornerRadius}">
      <ContentOutlet v-if="propertyNodes.content.length" /><ContentValueOutlet v-else />
    </Grid>
    <ContentPresenter v-else class="win-button-content-presenter"
      Background="{x:Bind PresenterBackground}" BackgroundSizing="{x:Bind PresenterBackgroundSizing}"
      BorderBrush="{x:Bind PresenterBorderBrush}" BorderThickness="{x:Bind PresenterBorderThickness}"
      Padding="{x:Bind PresenterPadding}" CornerRadius="{x:Bind PresenterCornerRadius}"
      ContentTemplate="{x:Bind ContentTemplate}" ContentTransitions="{x:Bind ContentTransitions}"
      HorizontalContentAlignment="{x:Bind PresenterHorizontalAlignment}" VerticalContentAlignment="{x:Bind PresenterVerticalAlignment}">
      <ContentOutlet v-if="propertyNodes.content.length" />
      <ContentValueOutlet v-else />
    </ContentPresenter>
    <AttachedOutlet v-if="propertyNodes.attached.length" />
  </button>
  <FlyoutOutlet v-if="propertyNodes.flyout.length" />
</template>
<script lang="ts">
import { defineComponent, h } from 'vue'
import { brushProperty } from './brushProperties'
import { buttonContentProperty } from './buttonContentRuntime'

export const ButtonFlyout = defineComponent({
  name: 'Button.Flyout',
  __buttonProperty: 'flyout',
  setup(_, { slots }) {
    return () => h('span', { class: 'button-flyout-property' }, slots.default?.())
  }
})

export const ButtonContent = defineComponent({ name: 'Button.Content', __buttonProperty: 'content', setup() { return () => null } })
export const ButtonKeyboardAccelerators = defineComponent({ name: 'Button.KeyboardAccelerators', __buttonProperty: 'keyboardAccelerators', setup() { return () => null } })
export default { Flyout: ButtonFlyout, Content: ButtonContent, ContentTemplate: buttonContentProperty('Button', 'ContentTemplate'), ContentTransitions: buttonContentProperty('Button', 'ContentTransitions'), Resources: buttonContentProperty('Button', 'Resources'), KeyboardAccelerators: ButtonKeyboardAccelerators, Background: brushProperty('Button', 'Background') }
</script>
<script setup lang="ts">
import { Comment, computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, onBeforeUnmount, onMounted, provide, proxyRefs, ref, shallowRef, Text, useAttrs, useSlots, watch } from 'vue';
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime';
import ContentPresenter from './ContentPresenter.vue';
import Grid from './Grid.vue';
import { alignment, boolValue, cssLength, xamlThickness } from './layout';
import { getToolTipServiceProperty } from './ToolTipServiceProperties';
import { useAnimatedIconInput } from './animatedIconInput';
import { useUICommand } from './uiCommandRuntime';
import { isBrushProperty, useBrushProperty } from './brushProperties';
import { getButtonContentProperty, useButtonContent } from './buttonContentRuntime';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  Style: { type: String, default: '' },
  RequestedTheme: { type: String, default: 'Default' },
  Content: { type: null, default: undefined },
  ContentTemplate: { type: null, default: undefined },
  ContentTransitions: { type: null, default: undefined },
  ClickMode: { type: String, default: 'Release' },
  IsTabStop: { type: [Boolean, String], default: true },
  Command: { type: [Object, String], default: undefined },
  CommandParameter: { default: undefined },
  Flyout: { type: null, default: undefined },
  IsEnabled: { type: [Boolean, String], default: true },
  Visibility: { type: String, default: 'Visible' },
  Background: { type: [String, Object], default: '' },
  BackgroundSizing: { type: String, default: '' },
  Foreground: { type: String, default: '' },
  BorderBrush: { type: String, default: '' },
  BorderThickness: { type: [String, Number], default: '' },
  Padding: { type: String, default: '' },
  Margin: { type: String, default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Left' },
  VerticalAlignment: { type: String, default: 'Center' },
  HorizontalContentAlignment: { type: String, default: '' },
  VerticalContentAlignment: { type: String, default: '' },
  FontFamily: { type: String, default: '' },
  FontWeight: { type: String, default: '' },
  FontSize: { type: [String, Number], default: '' },
  UseSystemFocusVisuals: { type: [Boolean, String], default: true },
  FocusVisualMargin: { type: [String, Number], default: '' },
  CornerRadius: { type: [String, Number], default: '' }
});

const emit = defineEmits(['Click', 'GotFocus', 'LostFocus', 'KeyDown', 'KeyUp', 'ContextRequested', 'PointerEntered', 'PointerExited', 'PointerMoved', 'PointerPressed', 'PointerReleased', 'PointerCanceled', 'PointerCaptureLost']);

const attrs = useAttrs();
const instance = getCurrentInstance();
const slots = useSlots();
const { ContentTemplate, ContentTransitions, renderTemplate } = useButtonContent(props, () => slots.default?.() ?? [], instance);
const backgroundBrush = useBrushProperty('Background', () => props.Background, () => slots.default?.() ?? [], instance);
const buttonRef = ref(null);
const iconInput = useAnimatedIconInput();
const IsPressed = ref(false);
const IsPointerOver = ref(false);
let activePointer: number | null = null;
let keyPressed = '';
let suppressClick = false;
watch(buttonRef, element => iconInput.Attach(element), { flush: 'post' });
const pointerEvent = (name, event, feedback) => {
  feedback(event);
  const sender = publicApi;
  const args = {
    OriginalSource: sender, OriginalEvent: event, Handled: false,
    Pointer: { PointerId: event.pointerId, PointerDeviceType: ({ mouse: 'Mouse', touch: 'Touch', pen: 'Pen' })[event.pointerType] || 'Mouse' },
    GetCurrentPoint: relativeTo => {
      const element = relativeTo instanceof HTMLElement ? relativeTo : relativeTo?.Element;
      const bounds = element?.getBoundingClientRect();
      return { Position: { X: event.clientX - (bounds?.left ?? 0), Y: event.clientY - (bounds?.top ?? 0) }, IsInContact: event.buttons > 0 };
    }
  };
  emit(name, sender, args);
  if (attrs[name] && !instance?.vnode.props?.[`on${name}`]) resolveXamlHandler(attrs[name], instance)?.(sender, args);
  if (args.Handled) { event.preventDefault(); event.stopPropagation(); }
};
const onPointerEntered = event => {
  IsPointerOver.value = true;
  if (activePointer !== null && event.buttons > 0) IsPressed.value = true;
  pointerEvent('PointerEntered', event, iconInput.PointerEntered);
  if (!isDisabled.value && resolveXamlValue(props.ClickMode, instance) === 'Hover') onClick(event);
};
const onPointerExited = event => { IsPointerOver.value = false; IsPressed.value = false; pointerEvent('PointerExited', event, iconInput.PointerExited); };
const clearPressed = () => {
  const pointer = activePointer;
  activePointer = null; IsPressed.value = false; keyPressed = '';
  if (pointer !== null && buttonRef.value?.hasPointerCapture?.(pointer)) {
    try { buttonRef.value.releasePointerCapture(pointer); } catch { }
  }
};
const onPointerPressed = event => {
  if (!isDisabled.value && event.button === 0 && resolveXamlValue(props.ClickMode, instance) !== 'Hover') {
    suppressClick = false;
    activePointer = event.pointerId;
    IsPressed.value = true;
    buttonRef.value?.setPointerCapture?.(event.pointerId);
    if (resolveXamlValue(props.ClickMode, instance) === 'Press') { onClick(event); suppressClick = true; }
  }
  pointerEvent('PointerPressed', event, iconInput.PointerPressed);
};
const pointerInside = event => { const bounds = buttonRef.value?.getBoundingClientRect(); return bounds && event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom; };
const onPointerMoved = event => { if (event.pointerId === activePointer) { IsPressed.value = Boolean(pointerInside(event)); IsPointerOver.value = IsPressed.value; } pointerEvent('PointerMoved', event, () => {}); };
const onPointerReleased = event => { if (activePointer !== null && !pointerInside(event)) suppressClick = true; clearPressed(); pointerEvent('PointerReleased', event, iconInput.PointerReleased); };
const onPointerCanceled = event => { clearPressed(); suppressClick = true; pointerEvent('PointerCanceled', event, iconInput.PointerExited); };
const onPointerCaptureLost = event => { clearPressed(); pointerEvent('PointerCaptureLost', event, iconInput.PointerExited); };
const command = useUICommand(() => resolveXamlValue(props.Command, instance));
const commandParameter = computed(() => resolveXamlValue(props.CommandParameter, instance));
const onContextRequested = (event: MouseEvent) => {
  if (isDisabled.value || (!attrs.ContextRequested && !instance?.vnode.props?.onContextRequested)) return;
  const sender = publicApi;
  const args = {
    OriginalSource: sender,
    Handled: false,
    PointerPosition: { X: event.clientX, Y: event.clientY },
    TryGetPosition: (relativeTo?: { Element?: HTMLElement } | HTMLElement) => {
      const element = relativeTo instanceof HTMLElement ? relativeTo : relativeTo?.Element;
      const bounds = element?.getBoundingClientRect();
      return { X: event.clientX - (bounds?.left ?? 0), Y: event.clientY - (bounds?.top ?? 0) };
    }
  };
  emit('ContextRequested', sender, args);
  if (attrs.ContextRequested && !instance?.vnode.props?.onContextRequested) {
    resolveXamlHandler(attrs.ContextRequested, instance)?.(sender, args);
  }
  event.preventDefault();
};
const flyoutController = shallowRef<unknown>(null);
const sourceFlyout = computed(() => resolveXamlValue(props.Flyout, instance));
const localFlyout = shallowRef(undefined);
watch(sourceFlyout, () => { localFlyout.value = undefined; });
provide('buttonFlyoutAnchor', buttonRef);
provide('buttonFlyoutController', flyoutController);

const propertyNodes = computed(() => {
  const content = [];
  const flyout = [];
  const attached = [];
  const keyboardAccelerators = [];
  const collect = nodes => { for (const node of nodes) {
    if (node.type === Comment || node.type === Text && !String(node.children ?? '').trim()) continue;
    if (isBrushProperty(node) || getButtonContentProperty(node)) continue;
    if (node.type === Fragment && Array.isArray(node.children)) { collect(node.children); continue; }
    const type = node?.type;
    const property = type && typeof type === 'object'
      ? type.__buttonProperty
      : undefined;
    if (getToolTipServiceProperty(node)) {
      attached.push(node);
    } else if (property === 'flyout' || property === 'content' || property === 'keyboardAccelerators') {
      const slot = node.children && typeof node.children === 'object'
        ? node.children.default
        : undefined;
      if (slot) (property === 'flyout' ? flyout : property === 'content' ? content : keyboardAccelerators).push(...slot());
    } else {
      content.push(node);
    }
  } };
  collect(slots.default?.() ?? []);
  const definition = localFlyout.value === undefined ? sourceFlyout.value : localFlyout.value;
  if (localFlyout.value !== undefined) flyout.length = 0;
  if (!flyout.length && isVNode(definition)) flyout.push(definition);
  return { content, flyout, attached, keyboardAccelerators };
});

const ContentOutlet = defineComponent({
  name: 'ButtonContentOutlet',
  setup() {
    return () => {
      const templated = renderTemplate(localContent.value === undefined ? resolvedContent.value : localContent.value);
      if (templated) return templated;
      if (localContent.value !== undefined) return typeof localContent.value === 'string' || typeof localContent.value === 'number'
        ? h('span', { class: 'win-button-default-text' }, String(localContent.value))
        : h(Fragment, isVNode(localContent.value) ? normalizeXamlNodes([localContent.value], instance) : []);
      const nodes = normalizeXamlNodes(propertyNodes.value.content, instance);
      return nodes.every(node => node.type === Text)
        ? h('span', { class: 'win-button-default-text' }, nodes.map(node => String(node.children ?? '')).join(''))
        : h(Fragment, nodes);
    };
  }
});

const FlyoutOutlet = defineComponent({
  name: 'ButtonFlyoutOutlet',
  setup() {
    return () => h(Fragment, propertyNodes.value.flyout);
  }
});
const ContentValueOutlet = defineComponent({ setup: () => () => {
  const value = resolvedContent.value;
  return renderTemplate(value) ?? (isVNode(value) ? h(Fragment, normalizeXamlNodes([value], instance)) : typeof value === 'string' || typeof value === 'number' ? h('span', { class: 'win-button-default-text' }, String(value)) : null);
} });
const AttachedOutlet = defineComponent({ setup: () => () => h(Fragment, propertyNodes.value.attached) });

const buttonAttrs = computed(() => {
  const rest = { ...attrs };
  delete rest.class;
  delete rest.style;
  delete rest.disabled;
  delete rest.Click;
  delete rest.GotFocus;
  delete rest.ContextRequested;
  for (const name of ['LostFocus', 'KeyDown', 'KeyUp', 'PointerEntered', 'PointerExited', 'PointerMoved', 'PointerPressed', 'PointerReleased', 'PointerCanceled', 'PointerCaptureLost']) delete rest[name];
  const findAttr = (name) => Object.keys(rest).find((key) => key.toLowerCase() === name.toLowerCase());
  const toolTipKey = findAttr('ToolTipService.ToolTip');
  const automationKey = findAttr('AutomationProperties.Name');
  const toolTipValue = toolTipKey ? rest[toolTipKey] : undefined;
  const automationValue = automationKey ? rest[automationKey] : undefined;
  if (toolTipKey) delete rest[toolTipKey];
  if (automationKey) delete rest[automationKey];
  const toolTip = toolTipKey || propertyNodes.value.attached.length
    ? resolveXamlValue(toolTipValue, instance) : command.value?.Description;
  const automationName = resolveXamlValue(automationValue, instance);
  if (toolTip !== undefined && toolTip !== null && toolTip !== '') rest['tooltipservice.tooltip'] = String(toolTip);
  if (automationName !== undefined && automationName !== null && automationName !== '') rest['aria-label'] = String(automationName);
  return rest;
});

const resolvedIsEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance));
const commandCanExecute = computed(() => command.value?.CanExecute?.(commandParameter.value) ?? true);
const localIsEnabled = ref<boolean | undefined>(undefined);
watch(resolvedIsEnabled, () => { localIsEnabled.value = undefined; });
const IsEnabled = computed({
  get: () => (localIsEnabled.value ?? boolValue(resolvedIsEnabled.value)) && commandCanExecute.value,
  set: (value: boolean) => {
    localIsEnabled.value = Boolean(value);
    updateXamlBinding(props.IsEnabled, Boolean(value), instance);
  }
});
const isCollapsed = computed(() => String(resolveXamlValue(props.Visibility, instance)).toLowerCase() === 'collapsed');
const sourceContent = computed(() => props.Content === undefined ? command.value?.Label ?? '' : resolveXamlValue(props.Content, instance));
const sourceRequestedTheme = computed(() => String(resolveXamlValue(props.RequestedTheme, instance)));
const localRequestedTheme = ref<string | undefined>();
watch(sourceRequestedTheme, () => { localRequestedTheme.value = undefined; });
const RequestedTheme = computed({ get: () => localRequestedTheme.value ?? sourceRequestedTheme.value, set: value => { localRequestedTheme.value = value; updateXamlBinding(props.RequestedTheme, value, instance); } });
const localContent = shallowRef(undefined);
watch(sourceContent, () => { localContent.value = undefined; });
const resolvedContent = computed({ get: () => localContent.value === undefined ? sourceContent.value : localContent.value, set: value => { localContent.value = value; updateXamlBinding(props.Content, value, instance); } });
const resolvedStyle = computed(() => String(resolveXamlValue(props.Style, instance) || ''));
const titleBarStylePrefix = computed(() => resolvedStyle.value.includes('TitleBarBackButtonStyle') ? 'TitleBarBackButton'
  : resolvedStyle.value.includes('TitleBarPaneToggleButtonStyle') ? 'TitleBarPaneToggleButton' : '');
const isDisabled = computed(() => !IsEnabled.value);
watch(isDisabled, () => { clearPressed(); iconInput.Refresh(); }, { flush: 'post' });
const exposedContent = computed({ get: () => localContent.value !== undefined ? localContent.value : propertyNodes.value.content[0] ?? resolvedContent.value, set: value => { resolvedContent.value = value; } });
const Flyout = computed({ get: () => localFlyout.value !== undefined && !isVNode(localFlyout.value) ? localFlyout.value : flyoutController.value ?? (isVNode(sourceFlyout.value) ? null : sourceFlyout.value), set: value => { localFlyout.value = value; updateXamlBinding(props.Flyout, value, instance); } });
const publicApi = proxyRefs({ Element: buttonRef, Flyout, IsEnabled, RequestedTheme,
  Name: computed(() => attrs['data-xaml-ref'] ?? attrs['x:Name'] ?? attrs.Name ?? ''),
  Content: exposedContent, ContentTemplate, ContentTransitions, Command: command, CommandParameter: commandParameter, IsPressed, IsPointerOver,
  Focus: () => { buttonRef.value?.focus(); return !isDisabled.value; } });
defineExpose(publicApi);
const PresenterHorizontalAlignment = computed(() => resolveXamlValue(props.HorizontalContentAlignment, instance) || 'Center');
const PresenterVerticalAlignment = computed(() => resolveXamlValue(props.VerticalContentAlignment, instance) || 'Center');
const PresenterBackground = computed(() => backgroundBrush.value.value && typeof backgroundBrush.value.value === 'object'
  && !isDisabled.value && !IsPressed.value && !IsPointerOver.value ? backgroundBrush.value.value : 'var(--ButtonBackgroundCurrent)');
const PresenterBackgroundSizing = computed(() => resolveXamlValue(props.BackgroundSizing, instance) || (resolvedStyle.value.includes('AccentButtonStyle') ? 'OuterBorderEdge' : 'InnerBorderEdge'));
const PresenterBorderBrush = computed(() => 'var(--ButtonBorderBrushCurrent)');
const PresenterBorderThickness = computed(() => resolveXamlValue(props.BorderThickness, instance) === '' ? 1 : resolveXamlValue(props.BorderThickness, instance));
const PresenterPadding = computed(() => resolveXamlValue(props.Padding, instance) || '11,5,11,6');
const PresenterCornerRadius = computed(() => resolveXamlValue(props.CornerRadius, instance) === '' ? 4 : resolveXamlValue(props.CornerRadius, instance));
const inheritedScope = inject(xamlScopeKey, {});
provide(xamlScopeKey, { ...inheritedScope, ContentTemplate, ContentTransitions, PresenterHorizontalAlignment, PresenterVerticalAlignment, PresenterBackground, PresenterBackgroundSizing, PresenterBorderBrush, PresenterBorderThickness, PresenterPadding, PresenterCornerRadius });

const contentAlignment = (value) => ({
  Left: 'flex-start',
  Center: 'center',
  Right: 'flex-end',
  Stretch: 'stretch',
  Top: 'flex-start',
  Bottom: 'flex-end'
}[value] ?? '');

const styleClass = computed(() => {
  return {
    DefaultButtonStyle: !resolvedStyle.value || resolvedStyle.value.includes('DefaultButtonStyle'),
    AccentButtonStyle: resolvedStyle.value.includes('AccentButtonStyle'),
    SubtleButtonStyle: resolvedStyle.value.includes('SubtleButtonStyle'),
    'win-titlebar-template-button': Boolean(titleBarStylePrefix.value)
  };
});

const buttonStyle = computed(() => {
  const style = {};
  const value = key => resolveXamlValue(props[key], instance);
  if (titleBarStylePrefix.value) {
    for (const state of ['', 'PointerOver', 'Pressed', 'Disabled']) {
      style[`--ButtonBackground${state}`] = `var(--${titleBarStylePrefix.value}Background${state})`;
      style[`--ButtonForeground${state}`] = `var(--${titleBarStylePrefix.value}Foreground${state})`;
      style[`--ButtonBorderBrush${state}`] = 'transparent';
    }
    style['--ButtonBorderThemeThickness'] = '0px';
    style['--ButtonPresenterBorderThickness'] = '0px';
    style.width = cssLength(resolveXamlValue(`{ThemeResource ${titleBarStylePrefix.value}Width}`, instance));
    style.margin = '2px';
  }
  if (backgroundBrush.value.value) style['--ButtonBackground'] = typeof backgroundBrush.value.value === 'object' ? 'transparent' : backgroundBrush.value.value;
  if (props.Foreground) style['--ButtonForeground'] = value('Foreground');
  if (props.BorderThickness !== '') {
    style['--ButtonPresenterBorderThickness'] = xamlThickness(value('BorderThickness'));
  }
  if (props.BorderBrush) {
    style['--ButtonBorderBrush'] = value('BorderBrush');
    style['--ButtonBorderBrushTop'] = value('BorderBrush');
    style['--ButtonBorderBrushBottom'] = value('BorderBrush');
  }
  const margin = resolveXamlValue(props.Margin, instance);
  if (margin !== undefined && margin !== null && margin !== '') style.margin = xamlThickness(margin);
  if (props.Width !== '') style.width = cssLength(value('Width'));
  if (props.Height !== '') style.height = cssLength(value('Height'));
  if (props.MaxWidth !== '') style.maxWidth = cssLength(value('MaxWidth'));
  if (props.MaxHeight !== '') style.maxHeight = cssLength(value('MaxHeight'));
  if (props.MinWidth !== '') style.minWidth = cssLength(value('MinWidth'));
  if (props.MinHeight !== '') style.minHeight = cssLength(value('MinHeight'));
  if (props.HorizontalAlignment) style.justifySelf = alignment(value('HorizontalAlignment'), 'horizontal');
  if (props.VerticalAlignment) style.alignSelf = alignment(value('VerticalAlignment'), 'vertical');
  if (props.HorizontalContentAlignment) {
    style.justifyContent = value('HorizontalContentAlignment') === 'Stretch'
      ? 'flex-start'
      : contentAlignment(value('HorizontalContentAlignment'));
  }
  if (props.VerticalContentAlignment) style.alignItems = contentAlignment(value('VerticalContentAlignment'));
  if (props.FontFamily) style.fontFamily = value('FontFamily');
  if (props.FontWeight) style.fontWeight = value('FontWeight') === 'SemiBold' ? 600 : value('FontWeight');
  if (props.FontSize !== '') style.fontSize = cssLength(value('FontSize'));
  if (props.FocusVisualMargin !== '') style.outlineOffset = cssLength(value('FocusVisualMargin'));
  if (props.CornerRadius !== '') style['--ButtonCornerRadius'] = xamlThickness(value('CornerRadius'));
  if (isCollapsed.value) style.display = 'none';

  return [attrs.style, style];
});

const onClick = (_event: MouseEvent | KeyboardEvent) => {
  if (isDisabled.value || isCollapsed.value) return;
  const sender = publicApi;
  const args = { OriginalSource: sender, OriginalEvent: _event, Handled: false };
  // Vue folds Click and click into the same listener key but warns on the
  // official event casing. Dispatch that listener without changing the API.
  const listener = instance?.vnode.props?.onClick;
  for (const callback of Array.isArray(listener) ? listener : [listener]) {
    if (typeof callback === 'function') callback(sender, args);
  }
  if (!listener) resolveXamlHandler(attrs.Click, instance)?.(sender, args);
  const currentCommand = command.value;
  const parameter = commandParameter.value;
  if (currentCommand?.CanExecute?.(parameter) ?? true) currentCommand?.Execute(parameter);
  if (typeof KeyboardEvent !== 'undefined' && _event instanceof KeyboardEvent || !propertyNodes.value.flyout.length) void Flyout.value?.ShowAt?.(buttonRef.value);
};
const onNativeClick = event => {
  if (suppressClick) { suppressClick = false; return; }
  if (resolveXamlValue(props.ClickMode, instance) !== 'Hover') onClick(event);
};
const raiseKey = (name, event) => {
  const sender = publicApi;
  const args = { OriginalSource: sender, OriginalEvent: event, Key: ({ ' ': 'Space', ArrowDown: 'Down', ArrowUp: 'Up', ArrowLeft: 'Left', ArrowRight: 'Right' })[event.key] ?? event.key, Handled: false };
  emit(name, sender, args);
  resolveXamlHandler(attrs[name], instance)?.(sender, args);
  if (args.Handled) event.preventDefault();
  return args.Handled;
};
const onKeyDown = event => {
  iconInput.KeyDown(event);
  if (raiseKey('KeyDown', event)) return;
  if (isDisabled.value || resolveXamlValue(props.ClickMode, instance) === 'Hover') return;
  if (event.key !== ' ' && event.key !== 'Enter') { keyPressed = ''; IsPressed.value = false; return; }
  event.preventDefault();
  if (event.repeat || keyPressed || activePointer !== null) return;
  keyPressed = event.key;
  IsPressed.value = true;
  if (resolveXamlValue(props.ClickMode, instance) === 'Press') onClick(event);
};
const onKeyUp = event => {
  iconInput.KeyUp(event);
  if (raiseKey('KeyUp', event)) { clearPressed(); return; }
  if (isDisabled.value || resolveXamlValue(props.ClickMode, instance) === 'Hover') return;
  if (event.key !== ' ' && event.key !== 'Enter') return;
  event.preventDefault();
  const invoke = keyPressed === event.key && IsPressed.value;
  clearPressed();
  if (invoke && resolveXamlValue(props.ClickMode, instance) === 'Release') onClick(event);
};
const onLostFocus = event => {
  clearPressed(); suppressClick = false; iconInput.LostFocus(event);
  const sender = publicApi;
  const args = { OriginalSource: sender, OriginalEvent: event, Handled: false };
  emit('LostFocus', sender, args); resolveXamlHandler(attrs.LostFocus, instance)?.(sender, args);
};
const onAccelerator = (event: KeyboardEvent) => {
  if (event.defaultPrevented || event.repeat || isDisabled.value || isCollapsed.value) return;
  const currentCommand = command.value;
  for (const node of propertyNodes.value.keyboardAccelerators) {
    const definition = node.props ?? {};
    const key = String(resolveXamlValue(definition.Key, instance) ?? '');
    const modifiers = String(resolveXamlValue(definition.Modifiers, instance) ?? 'None').split(/[ ,]+/);
    const matches = key.toLowerCase() === event.key.toLowerCase()
      && event.ctrlKey === modifiers.includes('Control') && event.altKey === modifiers.includes('Menu')
      && event.shiftKey === modifiers.includes('Shift') && event.metaKey === modifiers.includes('Windows');
    if (matches && boolValue(resolveXamlValue(definition.IsEnabled ?? true, instance))) {
      event.preventDefault(); onClick(event); return;
    }
  }
  if (currentCommand && 'MatchesKeyboardEvent' in currentCommand
    && typeof currentCommand.MatchesKeyboardEvent === 'function' && currentCommand.MatchesKeyboardEvent(event)) {
    event.preventDefault();
    onClick(event);
  }
};
const onWindowBlur = () => { clearPressed(); suppressClick = false; iconInput.Refresh(); };
onMounted(() => { document.addEventListener('keydown', onAccelerator); window.addEventListener('blur', onWindowBlur); });
onBeforeUnmount(() => { document.removeEventListener('keydown', onAccelerator); window.removeEventListener('blur', onWindowBlur); });
const onGotFocus = (event) => {
  const sender = publicApi;
  const args = { OriginalSource: sender, OriginalEvent: event, Handled: false };
  emit('GotFocus', sender, args);
  resolveXamlHandler(attrs.GotFocus, instance)?.(sender, args);
};
</script>
<style>
  .win-btn {
    position: relative;
    box-sizing: border-box;
    border-left: var(--ButtonBorderThemeThickness) solid var(--ButtonBorderBrushCurrent);
    border-top: var(--ButtonBorderThemeThickness) solid var(--ButtonBorderBrushTopCurrent);
    border-right: var(--ButtonBorderThemeThickness) solid var(--ButtonBorderBrushCurrent);
    border-bottom: var(--ButtonBorderThemeThickness) solid var(--ButtonBorderBrushBottomCurrent);
    border-radius: var(--ButtonCornerRadius);
    padding: var(--ButtonPadding, 5px 11px 6px);
    font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
    font-size: var(--ControlContentThemeFontSize, 14px);
    font-weight: normal;
    min-height: 0;
    min-width: 0;
    max-width: 100%;
    height: auto;
    background: padding-box var(--ButtonBackgroundCurrent);
    color: var(--ButtonForegroundCurrent);
    cursor: default;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    line-height: 19px;
    transition: background-color 83ms linear;
    outline: none;
    outline-offset: -3px;
    user-select: none;
    --ButtonPadding: 5px 11px 6px;
    --ButtonBorderThemeThickness: 1px;
    --ButtonCornerRadius: 4px;
    --ButtonBorderBrushTop: var(--ButtonBorderBrushDefaultTop, var(--ButtonBorderBrush));
    --ButtonBorderBrushBottom: var(--ButtonBorderBrushDefaultBottom, var(--ctrl-border-accent));
    --ButtonBorderBrushPointerOverTop: var(--ButtonBorderBrushTop);
    --ButtonBorderBrushPointerOverBottom: var(--ButtonBorderBrushBottom);
    --ButtonBorderBrushPressedTop: var(--ButtonBorderBrushPressed);
    --ButtonBorderBrushPressedBottom: var(--ButtonBorderBrushPressed);
    --ButtonBorderBrushDisabledTop: var(--ButtonBorderBrushDisabled);
    --ButtonBorderBrushDisabledBottom: var(--ButtonBorderBrushDisabled);
    --ButtonBackgroundCurrent: var(--ButtonBackground);
    --ButtonForegroundCurrent: var(--ButtonForeground);
    --ButtonBorderBrushCurrent: var(--ButtonBorderBrush);
    --ButtonBorderBrushTopCurrent: var(--ButtonBorderBrushTop);
    --ButtonBorderBrushBottomCurrent: var(--ButtonBorderBrushBottom);
  }

    .win-btn:hover {
      --ButtonBackgroundCurrent: var(--ButtonBackgroundPointerOver);
      --ButtonForegroundCurrent: var(--ButtonForegroundPointerOver);
      --ButtonBorderBrushCurrent: var(--ButtonBorderBrushPointerOver);
      --ButtonBorderBrushTopCurrent: var(--ButtonBorderBrushPointerOverTop);
      --ButtonBorderBrushBottomCurrent: var(--ButtonBorderBrushPointerOverBottom);
    }

    .win-btn:active, .win-btn.is-pressed {
      --ButtonBackgroundCurrent: var(--ButtonBackgroundPressed);
      --ButtonForegroundCurrent: var(--ButtonForegroundPressed);
      --ButtonBorderBrushCurrent: var(--ButtonBorderBrushPressed);
      --ButtonBorderBrushTopCurrent: var(--ButtonBorderBrushPressedTop);
      --ButtonBorderBrushBottomCurrent: var(--ButtonBorderBrushPressedBottom);
    }

    .win-btn:disabled {
      --ButtonBackgroundCurrent: var(--ButtonBackgroundDisabled);
      --ButtonForegroundCurrent: var(--ButtonForegroundDisabled);
      --ButtonBorderBrushCurrent: var(--ButtonBorderBrushDisabled);
      --ButtonBorderBrushTopCurrent: var(--ButtonBorderBrushDisabledTop);
      --ButtonBorderBrushBottomCurrent: var(--ButtonBorderBrushDisabledBottom);
      cursor: default;
      pointer-events: none;
    }

    .win-btn.AccentButtonStyle {
      --ButtonBackground: var(--AccentButtonBackground);
      --ButtonBackgroundPointerOver: var(--AccentButtonBackgroundPointerOver);
      --ButtonBackgroundPressed: var(--AccentButtonBackgroundPressed);
      --ButtonBackgroundDisabled: var(--AccentButtonBackgroundDisabled);
      --ButtonForeground: var(--AccentButtonForeground);
      --ButtonForegroundPointerOver: var(--AccentButtonForegroundPointerOver);
      --ButtonForegroundPressed: var(--AccentButtonForegroundPressed);
      --ButtonForegroundDisabled: var(--AccentButtonForegroundDisabled);
      --ButtonBorderBrush: var(--AccentButtonBorderBrush);
      --ButtonBorderBrushTop: var(--AccentButtonBorderBrush);
      --ButtonBorderBrushBottom: var(--AccentButtonBorderBrushBottom);
      --ButtonBorderBrushPointerOver: var(--AccentButtonBorderBrushPointerOver);
      --ButtonBorderBrushPointerOverTop: var(--AccentButtonBorderBrushPointerOver);
      --ButtonBorderBrushPointerOverBottom: var(--AccentButtonBorderBrushPointerOverBottom);
      --ButtonBorderBrushPressed: var(--AccentButtonBorderBrushPressed);
      --ButtonBorderBrushPressedTop: var(--AccentButtonBorderBrushPressed);
      --ButtonBorderBrushPressedBottom: var(--AccentButtonBorderBrushPressed);
      --ButtonBorderBrushDisabled: var(--AccentButtonBorderBrushDisabled);
      --ButtonBorderBrushDisabledTop: var(--AccentButtonBorderBrushDisabled);
      --ButtonBorderBrushDisabledBottom: var(--AccentButtonBorderBrushDisabled);
      --AccentButtonBorderBrushBottom: var(--AccentButtonBorderBrushDefaultBottom, var(--accent-border-accent));
      --AccentButtonBorderBrushPointerOverBottom: var(--AccentButtonBorderBrushBottom);
    }

  .win-btn .win-text-block {
      color: inherit;
    }
  .win-button-default-text {
    display: block; min-width: 0; max-width: 100%; overflow: hidden;
    white-space: nowrap; text-overflow: ellipsis; line-height: inherit;
  }

  .win-btn { border: 0; padding: 0; background: transparent; }
  .win-button-content-presenter {
    position: relative;
    width: 100%; height: 100%; min-width: 0; min-height: 0; color: inherit;
    border-color: transparent !important;
    transition: background-color 83ms linear;
  }
  .win-btn.win-titlebar-template-button { transition: none; line-height: 16px; }
  .win-titlebar-button-root { width: 100%; height: 100%; min-width: 0; min-height: 0; align-items: center; justify-items: center; }
  .win-btn.win-titlebar-template-button::after { display: none; }
  .win-btn::after {
    content: ""; position: absolute; inset: 0; padding: var(--ButtonPresenterBorderThickness, var(--ButtonBorderThemeThickness, 1px));
    border-radius: inherit; background: var(--ButtonBorderBrushCurrent); pointer-events: none; z-index: 1;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor;
  }
  .win-btn.system-focus:focus-visible { outline: 2px solid var(--FocusStrokeColorOuterBrush, var(--text-primary)); box-shadow: inset 0 0 0 1px var(--FocusStrokeColorInnerBrush, var(--app-bg)); }

  .win-btn.content-horizontal-stretch > * {
    flex: 1 1 auto;
    min-width: 0;
  }

  .win-btn.content-horizontal-stretch > .win-grid {
    flex: 1 1 0%;
    width: 100%;
  }

  .win-btn.content-vertical-stretch > * {
    align-self: stretch;
  }

  .win-btn.content-vertical-stretch > .win-grid {
    height: 100%;
  }

    .win-btn.SubtleButtonStyle {
      --ButtonBackground: var(--SubtleButtonBackground);
      --ButtonBackgroundPointerOver: var(--SubtleButtonBackgroundPointerOver);
      --ButtonBackgroundPressed: var(--SubtleButtonBackgroundPressed);
      --ButtonBackgroundDisabled: var(--SubtleButtonBackgroundDisabled);
      --ButtonForeground: var(--SubtleButtonForeground);
      --ButtonForegroundPointerOver: var(--SubtleButtonForegroundPointerOver);
      --ButtonForegroundPressed: var(--SubtleButtonForegroundPressed);
      --ButtonForegroundDisabled: var(--SubtleButtonForegroundDisabled);
      --ButtonBorderBrush: var(--SubtleButtonBorderBrush);
      --ButtonBorderBrushTop: var(--SubtleButtonBorderBrush);
      --ButtonBorderBrushBottom: var(--SubtleButtonBorderBrush);
      --ButtonBorderBrushPointerOver: var(--SubtleButtonBorderBrushPointerOver);
      --ButtonBorderBrushPointerOverTop: var(--SubtleButtonBorderBrushPointerOver);
      --ButtonBorderBrushPointerOverBottom: var(--SubtleButtonBorderBrushPointerOver);
      --ButtonBorderBrushPressed: var(--SubtleButtonBorderBrushPressed);
      --ButtonBorderBrushPressedTop: var(--SubtleButtonBorderBrushPressed);
      --ButtonBorderBrushPressedBottom: var(--SubtleButtonBorderBrushPressed);
      --ButtonBorderBrushDisabled: var(--SubtleButtonBorderBrushDisabled);
      --ButtonBorderBrushDisabledTop: var(--SubtleButtonBorderBrushDisabled);
      --ButtonBorderBrushDisabledBottom: var(--SubtleButtonBorderBrushDisabled);
    }

  .win-btn {
    white-space: nowrap;
  }

</style>
