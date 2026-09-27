<template>
  <button v-if="visible" ref="buttonRef" v-bind="buttonAttrs" class="win-appbar-button" :class="buttonClasses" :style="buttonStyle"
    type="button" :disabled="!enabled" :tabindex="isTabStop ? undefined : -1"
    :aria-label="automationName || label || undefined"
    :aria-pressed="toggleContext ? (checked === null ? 'mixed' : checked) : undefined"
    :aria-haspopup="hasFlyout ? (flyoutIsMenu ? 'menu' : 'dialog') : undefined" :aria-expanded="hasFlyout ? flyoutOpen : undefined"
    :role="inOverflow ? (toggleContext ? 'menuitemcheckbox' : 'menuitem') : undefined"
    :aria-checked="inOverflow && toggleContext ? (checked === null ? 'mixed' : checked) : undefined"
    :data-application-view-state="applicationViewState" :data-visual-state="commonState" :data-label-position="value('LabelPosition')"
    @click="onClick" @pointerenter="onPointerEnter" @pointerleave="onPointerLeave" @pointerdown="onPointerDown"
    @pointermove="onPointerMove" @pointerup="onPointerUp" @pointercancel="onPointerCancel" @lostpointercapture="onCaptureLost"
    @keydown="onButtonKeyDown" @keyup="onButtonKeyUp" @focus="onFocus" @blur="onBlur">
    <span class="appbar-button-inner-border" aria-hidden="true"></span>
    <span class="appbar-button-content-root">
      <span v-if="toggleContext" class="appbar-toggle-check-glyph" aria-hidden="true">&#xE73E;</span>
      <Viewbox class="appbar-button-content-viewbox" Width="{x:Bind TemplateSettings.ContentWidth, Mode=OneWay}"
        Height="{ThemeResource AppBarButtonContentHeight}" Stretch="Uniform"
        HorizontalAlignment="{x:Bind TemplateSettings.ContentHorizontalAlignment, Mode=OneWay}"
        VerticalAlignment="{x:Bind TemplateSettings.ContentVerticalAlignment, Mode=OneWay}"
        Margin="{x:Bind TemplateSettings.ContentMargin, Mode=OneWay}"><ContentOutlet /></Viewbox>
      <span class="appbar-button-label">{{ label }}</span>
      <span class="appbar-button-overflow-label">{{ label }}</span>
      <span class="appbar-button-accelerator-label">{{ acceleratorText }}</span>
      <span v-if="hasFlyout" class="appbar-button-chevron" aria-hidden="true">&#xE974;</span>
      <span v-if="hasFlyout" class="appbar-button-overflow-chevron" aria-hidden="true">&#xE974;</span>
    </span>
  </button>
  <FlyoutOutlet />
</template>

<script lang="ts">
import { appBarProperty } from './appBarRuntime'
export const AppBarButtonFlyout = appBarProperty('AppBarButton', 'Flyout')
export const AppBarButtonIcon = appBarProperty('AppBarButton', 'Icon')
export const AppBarButtonContent = appBarProperty('AppBarButton', 'Content')
export const AppBarButtonKeyboardAccelerators = appBarProperty('AppBarButton', 'KeyboardAccelerators')
export default { Flyout: AppBarButtonFlyout, Icon: AppBarButtonIcon, Content: AppBarButtonContent, KeyboardAccelerators: AppBarButtonKeyboardAccelerators }
</script>

<script setup lang="ts">
import { cloneVNode, Comment, computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, onBeforeUnmount, onMounted, provide, ref, shallowReactive, Text, unref, useAttrs, useSlots, watch, type CSSProperties, type VNode } from 'vue'
import SymbolIcon from './SymbolIcon.vue'
import FontIcon from './FontIcon.vue'
import BitmapIcon from './BitmapIcon.vue'
import PathIcon from './PathIcon.vue'
import Viewbox from './Viewbox.vue'
import { appBarBoolean, appBarToggleContextKey, commandBarContextKey } from './appBarRuntime'
import { cssLength, xamlThickness } from './layout'
import { frameworkLayoutStyle } from './frameworkLayout'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlControlIdentityKey, xamlScopeKey } from './xamlRuntime'
import './appBarStyles.css'
import { useUICommand } from './uiCommandRuntime'

defineOptions({ name: 'AppBarButton', inheritAttrs: false })
type FlyoutController = { ShowAt?: (target: HTMLElement, options?: Record<string, unknown>) => unknown; Hide?: () => void; readonly IsOpen?: boolean }
const props = defineProps({
  Label: { type: String, default: undefined }, Icon: { default: undefined }, Content: { default: undefined },
  Command: { default: undefined }, CommandParameter: { default: undefined }, Flyout: { default: undefined },
  IsCompact: { type: [Boolean, String], default: undefined }, LabelPosition: { type: String, default: 'Default' },
  DynamicOverflowOrder: { type: [Number, String], default: 0 }, IsEnabled: { type: [Boolean, String], default: true },
  IsTabStop: { type: [Boolean, String], default: true }, Visibility: { type: String, default: 'Visible' },
  AllowFocusOnInteraction: { type: [Boolean, String], default: undefined }, AllowFocusWhenDisabled: { type: [Boolean, String], default: false },
  KeyboardAccelerators: { default: undefined }, KeyboardAcceleratorTextOverride: { type: String, default: '' }, KeyboardAcceleratorPlacementMode: { type: String, default: 'Hidden' },
  Background: { default: undefined }, Foreground: { default: undefined }, BorderBrush: { default: undefined },
  BorderThickness: { type: [Number, String], default: undefined }, CornerRadius: { type: [Number, String], default: undefined },
  Padding: { type: [Number, String], default: undefined }, Margin: { type: [Number, String], default: undefined },
  Width: { type: [Number, String], default: undefined }, Height: { type: [Number, String], default: undefined },
  MinWidth: { type: [Number, String], default: 0 }, MinHeight: { type: [Number, String], default: 0 },
  MaxWidth: { type: [Number, String], default: undefined }, MaxHeight: { type: [Number, String], default: undefined },
  FontFamily: { type: String, default: undefined }, FontWeight: { type: [Number, String], default: undefined }, FontSize: { type: [Number, String], default: undefined },
  HorizontalAlignment: { type: String, default: 'Left' }, VerticalAlignment: { type: String, default: 'Top' },
  HorizontalContentAlignment: { type: String, default: 'Center' }, VerticalContentAlignment: { type: String, default: 'Center' },
  FlowDirection: { type: String, default: 'LeftToRight' }, Style: { default: undefined },
  'AutomationProperties.Name': { type: String, default: '' }, 'ToolTipService.ToolTip': { default: undefined }
})
const emit = defineEmits(['Click', 'PointerEntered', 'PointerExited', 'PointerPressed', 'PointerReleased', 'PointerMoved', 'PointerCanceled', 'PointerCaptureLost', 'KeyDown', 'KeyUp', 'GotFocus', 'LostFocus', 'update:Label', 'update:Icon', 'update:Content', 'update:Command', 'update:CommandParameter', 'update:Flyout', 'update:IsCompact', 'update:LabelPosition', 'update:DynamicOverflowOrder', 'update:IsEnabled', 'update:IsTabStop', 'update:Visibility', 'update:AllowFocusOnInteraction', 'update:AllowFocusWhenDisabled', 'update:KeyboardAccelerators', 'update:KeyboardAcceleratorTextOverride', 'update:KeyboardAcceleratorPlacementMode', 'update:Background', 'update:Foreground', 'update:BorderBrush', 'update:BorderThickness', 'update:CornerRadius', 'update:Padding', 'update:Margin', 'update:Width', 'update:Height', 'update:MinWidth', 'update:MinHeight', 'update:MaxWidth', 'update:MaxHeight', 'update:FontFamily', 'update:FontWeight', 'update:FontSize', 'update:HorizontalAlignment', 'update:VerticalAlignment', 'update:HorizontalContentAlignment', 'update:VerticalContentAlignment', 'update:FlowDirection', 'update:Style', 'update:AutomationProperties.Name', 'update:ToolTipService.ToolTip'])
const attrs = useAttrs()
const slots = useSlots()
const instance = getCurrentInstance()
const barContext = inject(commandBarContextKey, null)
const toggleContext = inject(appBarToggleContextKey, null)
const buttonRef = ref<HTMLButtonElement | null>(null)
const structuralFlyout = ref<FlyoutController | null>(null)
const overrides = shallowReactive<Record<string, unknown>>({})
const resolve = (input: unknown) => resolveXamlValue(input, instance)
const value = (name: keyof typeof props) => name in overrides ? overrides[name] : resolve(props[name])
const setValue = (name: keyof typeof props, next: unknown) => { overrides[name] = next; updateXamlBinding(props[name], next, instance); emit(`update:${name}`, next) }
for (const name of Object.keys(props) as (keyof typeof props)[]) watch(() => resolve(props[name]), () => { delete overrides[name] })
const command = useUICommand(() => value('Command'))
const label = computed(() => String(value('Label') ?? command.value?.Label ?? ''))
const enabled = computed(() => appBarBoolean(value('IsEnabled')) && barContext?.isEnabled?.value !== false && (command.value?.CanExecute?.(value('CommandParameter')) ?? true))
const visible = computed(() => value('Visibility') !== 'Collapsed')
const isTabStop = computed(() => appBarBoolean(value('IsTabStop')))
const inOverflow = computed(() => barContext?.isInOverflow.value ?? false)
const inFlyout = computed(() => barContext?.isInFlyout?.value ?? false)
const allowFocusOnInteraction = computed(() => value('AllowFocusOnInteraction') === undefined ? inFlyout.value : appBarBoolean(value('AllowFocusOnInteraction')))
const compact = computed(() => value('IsCompact') === undefined ? barContext?.compact.value ?? false : appBarBoolean(value('IsCompact')))
const labelPosition = computed(() => {
  if (value('LabelPosition') !== 'Default') return value('LabelPosition')
  const inherited = barContext?.defaultLabelPosition.value
  return inherited === 'Right' || inherited === 'Collapsed' ? inherited : 'Bottom'
})
const hasMenuIcons = computed(() => barContext?.hasIcons.value ?? false)
const hasToggleButtons = computed(() => barContext?.hasToggleButtons.value ?? false)
const checked = computed(() => toggleContext ? toggleContext.checked.value : false)
const templateSettings = computed(() => ({
  ContentWidth: inOverflow.value ? 16 : '',
  ContentHorizontalAlignment: inOverflow.value || labelPosition.value === 'Right' ? 'Left' : 'Stretch',
  ContentVerticalAlignment: inOverflow.value ? 'Center' : 'Top',
  ContentMargin: inOverflow.value ? (hasToggleButtons.value ? '38,0,12,0' : '12,0,12,0') : labelPosition.value === 'Right' ? '12,16,0,10' : '0,16,0,2'
}))
provide(xamlScopeKey, { ...inject<Record<string, unknown>>(xamlScopeKey, {}), TemplateSettings: templateSettings })
provide(appBarToggleContextKey, null)
const hovered = ref(false)
const pointerPressed = ref(false)
const keyboardPressed = ref(false)
const pointerId = ref<number | null>(null)
const pressed = computed(() => pointerPressed.value || keyboardPressed.value)
const flyoutOpen = ref(false)
const automationName = computed(() => String(value('AutomationProperties.Name') || ''))
const childNodes = (node: VNode): VNode[] => Array.isArray(node.children) ? node.children as VNode[] : (node.children as { default?: () => VNode[] })?.default?.() ?? []
const flatten = (nodes: VNode[]): VNode[] => nodes.flatMap(node => node.type === Fragment ? flatten(childNodes(node)) : node.type === Comment || (node.type === Text && !String(node.children ?? '').trim()) ? [] : [node])
const declarations = computed(() => {
  const properties: Record<string, VNode[]> = { Content: [], Icon: [], Flyout: [], KeyboardAccelerators: [] }
  for (const node of flatten(slots.default?.() ?? [])) {
    const marker = node.type as { __appBarButtonProperty?: string; __buttonProperty?: string }
    const property = marker?.__appBarButtonProperty ?? (marker?.__buttonProperty === 'flyout' ? 'Flyout' : marker?.__buttonProperty === 'content' ? 'Content' : undefined)
    if (property && property in properties) properties[property]!.push(...flatten(childNodes(node)))
    else properties.Content!.push(node)
  }
  return properties
})
const asNodes = (source: unknown): VNode[] => Array.isArray(source) ? source.filter(isVNode) : isVNode(source) ? [source] : []
const icon = computed(() => value('Icon') ?? command.value?.IconSource)
const contentNodes = computed(() => !('Content' in overrides) && declarations.value.Content!.length ? declarations.value.Content! : asNodes(value('Content')))
const iconNodes = computed(() => !('Icon' in overrides) && declarations.value.Icon!.length ? declarations.value.Icon! : asNodes(icon.value))
const flyoutNodes = computed(() => !('Flyout' in overrides) && declarations.value.Flyout!.length ? declarations.value.Flyout! : asNodes(value('Flyout')))
const flyout = computed<FlyoutController | null>(() => {
  const source = value('Flyout') as FlyoutController | undefined
  return source && typeof source.ShowAt === 'function' ? source : structuralFlyout.value
})
const hasFlyout = computed(() => flyoutNodes.value.length > 0 || !!flyout.value)
const flyoutIsMenu = computed(() => flyoutNodes.value.some(node => { const type = node.type as { name?: string; __name?: string }; return (type.name ?? type.__name) === 'MenuFlyout' }))
const acceleratorObjects = computed<Record<string, unknown>[]>(() => {
  if (!('KeyboardAccelerators' in overrides) && declarations.value.KeyboardAccelerators!.length) return declarations.value.KeyboardAccelerators!.map(node => Object.fromEntries(Object.entries(node.props ?? {}).map(([key, entry]) => [key, resolve(entry)])))
  const source = value('KeyboardAccelerators') ?? command.value?.KeyboardAccelerators
  return Array.isArray(source) ? source as Record<string, unknown>[] : []
})
const modifiersFor = (accelerator: Record<string, unknown>) => Array.isArray(accelerator.Modifiers) ? accelerator.Modifiers.map(String) : String(accelerator.Modifiers ?? '').split(',').map(entry => entry.trim()).filter(Boolean)
const keyName = (key: unknown) => ({ Number0: '0', Number1: '1', Number2: '2', Number3: '3', Number4: '4', Number5: '5', Number6: '6', Number7: '7', Number8: '8', Number9: '9', Space: ' ', Menu: 'Alt', Esc: 'Escape', Del: 'Delete', Add: '+', Subtract: '-', Multiply: '*', Divide: '/', Decimal: '.' } as Record<string, string>)[String(key)] ?? String(key ?? '')
const acceleratorText = computed(() => {
  if (value('KeyboardAcceleratorTextOverride')) return String(value('KeyboardAcceleratorTextOverride'))
  const accelerator = acceleratorObjects.value[0]
  if (!accelerator) return ''
  const modifiers = modifiersFor(accelerator).map(entry => entry === 'Control' ? 'Ctrl' : entry === 'Menu' ? 'Alt' : entry === 'Windows' ? 'Win' : entry)
  const key = keyName(accelerator.Key)
  return [...modifiers, key === ' ' ? 'Space' : key.toUpperCase()].filter(Boolean).join('+')
})
const toolTip = computed(() => value('ToolTipService.ToolTip') ?? command.value?.Description ?? (compact.value || labelPosition.value === 'Collapsed' || inFlyout.value ? label.value : undefined))
const buttonAttrs = computed(() => {
  const values = Object.fromEntries(Object.entries(attrs).filter(([key]) => !/^(Click|Checked|Unchecked|Indeterminate|PointerEntered|PointerExited|PointerPressed|PointerReleased|PointerMoved|PointerCanceled|PointerCaptureLost|KeyDown|KeyUp|GotFocus|LostFocus|x:Name)$/.test(key)))
  if (toolTip.value) values['tooltipservice.tooltip'] = toolTip.value
  return values
})
const ContentOutlet = defineComponent({ name: 'AppBarButtonContentPresenter', setup() { return () => {
  if (contentNodes.value.length) return h(Fragment, normalizeXamlNodes(contentNodes.value, instance))
  const content = value('Content')
  if (content !== undefined && content !== null && !isVNode(content)) return h('span', { class: 'appbar-button-content' }, typeof content === 'object' ? '' : String(content))
  if (iconNodes.value.length) return h(Fragment, normalizeXamlNodes(iconNodes.value, instance))
  const source = icon.value
  if (typeof source === 'string' || typeof source === 'number') return h(SymbolIcon, { Symbol: source, FontSize: 20 })
  if (source && typeof source === 'object') {
    const definition = source as Record<string, unknown>
    if ('Symbol' in definition) return h(SymbolIcon, { ...definition, FontSize: definition.FontSize ?? 20 })
    if ('Glyph' in definition) return h(FontIcon, { ...definition, FontSize: definition.FontSize ?? 20 })
    if ('UriSource' in definition) return h(BitmapIcon, definition)
    if ('Data' in definition) return h(PathIcon, definition)
  }
  return null
} } })
const FlyoutOutlet = defineComponent({ name: 'AppBarButtonFlyoutPresenter', setup() { return () => h(Fragment, normalizeXamlNodes(flyoutNodes.value, instance).map(node => cloneVNode(node, {
  ref: (controller: unknown) => { structuralFlyout.value = controller as FlyoutController | null },
  onOpened: () => { flyoutOpen.value = true }, onClosed: () => { flyoutOpen.value = false }
}, true))) } })
const applicationViewState = computed(() => {
  if (inOverflow.value) return `Overflow${hasToggleButtons.value ? 'WithToggleButtons' : ''}${hasMenuIcons.value ? (hasToggleButtons.value ? 'AndMenuIcons' : 'WithMenuIcons') : ''}`
  if (labelPosition.value === 'Right') return 'LabelOnRight'
  if (labelPosition.value === 'Collapsed') return 'LabelCollapsed'
  return compact.value ? 'Compact' : 'FullSize'
})
const commonState = computed(() => {
  const prefix = inOverflow.value ? 'Overflow' : ''
  const suffix = !enabled.value ? 'Disabled' : pressed.value ? 'Pressed' : flyoutOpen.value ? 'SubMenuOpened' : hovered.value ? 'PointerOver' : 'Normal'
  const checkedPrefix = toggleContext && checked.value !== false ? 'Checked' : ''
  return `${prefix}${checkedPrefix}${checkedPrefix && suffix === 'Normal' ? '' : suffix}`
})
const buttonClasses = computed(() => ({
  compact: compact.value && labelPosition.value === 'Bottom' && !inOverflow.value,
  'label-right': labelPosition.value === 'Right' && !inOverflow.value, 'label-collapsed': labelPosition.value === 'Collapsed' && !inOverflow.value,
  'is-overflow': inOverflow.value, 'is-in-commandbar-flyout': inFlyout.value, 'overflow-with-icons': inOverflow.value && hasMenuIcons.value, 'overflow-with-toggles': inOverflow.value && hasToggleButtons.value,
  'pointer-over': hovered.value && enabled.value, pressed: pressed.value && enabled.value, 'submenu-opened': flyoutOpen.value && enabled.value,
  'has-flyout': hasFlyout.value, 'win-appbar-toggle-button': !!toggleContext,
  'appbar-toggle-button-checked': !!toggleContext && checked.value !== false, 'appbar-toggle-button-indeterminate': !!toggleContext && checked.value === null
}))
const buttonStyle = computed<CSSProperties>(() => {
  const layout = frameworkLayoutStyle(Object.fromEntries(Object.keys(props).map(name => [name, value(name as keyof typeof props)])), instance)
  for (const property of ['background', 'borderColor', 'borderWidth', 'padding']) delete layout[property]
  return {
  ...layout, margin: xamlThickness(value('Margin')) || undefined,
  width: cssLength(value('Width')) || undefined, height: cssLength(value('Height')) || undefined,
  minWidth: cssLength(value('MinWidth')) || undefined, minHeight: cssLength(value('MinHeight')) || undefined,
  maxWidth: cssLength(value('MaxWidth')) || undefined, maxHeight: cssLength(value('MaxHeight')) || undefined,
  '--AppBarButtonBackground': value('Background') || undefined, '--AppBarButtonForeground': value('Foreground') || undefined,
  '--AppBarButtonBorderBrush': value('BorderBrush') || undefined, '--AppBarButtonBorderThickness': xamlThickness(value('BorderThickness')) || undefined,
  '--AppBarButtonCornerRadius': cssLength(value('CornerRadius')) || undefined,
  fontFamily: value('FontFamily') as string || undefined, fontWeight: value('FontWeight') === 'Normal' ? '400' : value('FontWeight') as string || undefined,
  fontSize: cssLength(value('FontSize')) || undefined, direction: value('FlowDirection') === 'RightToLeft' ? 'rtl' : 'ltr',
  justifySelf: inOverflow.value && !instance?.vnode.props?.HorizontalAlignment ? 'stretch' : layout.justifySelf
} as CSSProperties })
const exposedProperties = Object.fromEntries((Object.keys(props) as (keyof typeof props)[]).map(name => [name, computed({ get: () => value(name), set: next => setValue(name, next) })]))
const publicProperties = {
  ...exposedProperties,
  [xamlControlIdentityKey]: true,
  Name: computed(() => String(resolve(attrs['data-xaml-ref'] ?? attrs['x:Name'] ?? attrs.Name ?? ''))),
  IsInOverflow: inOverflow,
  Label: computed({ get: () => label.value, set: next => setValue('Label', next) }),
  IsEnabled: computed({ get: () => enabled.value, set: next => setValue('IsEnabled', next) }),
  ActualWidth: computed(() => buttonRef.value?.getBoundingClientRect().width ?? 0),
  ActualHeight: computed(() => buttonRef.value?.getBoundingClientRect().height ?? 0),
  Focus: () => { if (enabled.value || appBarBoolean(value('AllowFocusWhenDisabled'))) { buttonRef.value?.focus(); return true } return false },
  $el: buttonRef
}
const eventSender = new Proxy(publicProperties, { get: (target, key) => unref(Reflect.get(target, key)), set: (target, key, next) => { const property = Reflect.get(target, key); if (property && typeof property === 'object' && 'value' in property) property.value = next; return true } })
const sender = () => toggleContext?.sender() ?? eventSender
const routedArgs = (event: Event) => ({ OriginalSource: sender(), Handled: false, OriginalEvent: event })
const raise = (name: string, args: Record<string, any>) => {
  const listener = instance?.vnode.props?.[`on${name}`];
  if (listener) {
    for (const handler of Array.isArray(listener) ? listener : [listener]) {
      if (typeof handler === 'function') handler(sender(), args);
    }
  } else emit(name, sender(), args);
  if (attrs[name] !== undefined && !listener) resolveXamlHandler(attrs[name], instance)?.(sender(), args);
}
const dispatchInput = (name: string, event: Event) => {
  const args: Record<string, any> = routedArgs(event)
  if (event instanceof PointerEvent) {
    args.Pointer = { PointerId: event.pointerId, PointerDeviceType: event.pointerType === 'touch' ? 'Touch' : event.pointerType === 'pen' ? 'Pen' : 'Mouse', IsInContact: event.buttons !== 0 }
    args.GetCurrentPoint = (relativeTo?: HTMLElement | { $el?: HTMLElement }) => {
      const element = relativeTo instanceof HTMLElement ? relativeTo : relativeTo?.$el
      const bounds = element?.getBoundingClientRect()
      return { Position: { X: event.clientX - (bounds?.left ?? 0), Y: event.clientY - (bounds?.top ?? 0) }, PointerId: event.pointerId, IsInContact: event.buttons !== 0, Properties: { IsLeftButtonPressed: (event.buttons & 1) !== 0, IsRightButtonPressed: (event.buttons & 2) !== 0 } }
    }
  }
  if (event instanceof KeyboardEvent) { args.Key = event.key === ' ' ? 'Space' : event.key; args.OriginalKey = args.Key; args.KeyStatus = { IsKeyReleased: event.type === 'keyup', RepeatCount: event.repeat ? 2 : 1 } }
  raise(name, args)
  if (args.Handled) { event.preventDefault(); event.stopPropagation() }
  return args
}
const invoke = (event: MouseEvent) => {
  if (!enabled.value || !visible.value) return
  toggleContext?.toggle(event)
  const args = routedArgs(event)
  raise('Click', args)
  if (args.Handled) event.stopPropagation()
  command.value?.Execute?.(value('CommandParameter'))
  if (hasFlyout.value && buttonRef.value) {
    if (flyout.value?.IsOpen || flyoutOpen.value) flyout.value?.Hide?.()
    else void flyout.value?.ShowAt?.(buttonRef.value)
  } else if (barContext?.invokeCommand) barContext.invokeCommand(sender(), args)
  else if (inOverflow.value) barContext?.closeOverflow()
}
const onClick = (event: MouseEvent) => {
  clearPressed()
  if (event.detail > 0 && buttonRef.value) {
    const hit = document.elementFromPoint(event.clientX, event.clientY)
    if (!hit || !buttonRef.value.contains(hit)) return
  }
  invoke(event)
}
const clearPressed = () => { pointerPressed.value = false; keyboardPressed.value = false; pointerId.value = null }
const clearPointerState = () => { clearPressed(); hovered.value = false }
const onPointerEnter = (event: PointerEvent) => { if (!enabled.value) return; hovered.value = event.pointerType !== 'touch'; if (pointerId.value === event.pointerId && event.buttons === 1) pointerPressed.value = true; dispatchInput('PointerEntered', event) }
const onPointerLeave = (event: PointerEvent) => { hovered.value = false; pointerPressed.value = false; dispatchInput('PointerExited', event) }
const onPointerMove = (event: PointerEvent) => {
  if (!enabled.value) return
  if (pointerId.value === event.pointerId && event.buttons === 1) {
    const hit = document.elementFromPoint(event.clientX, event.clientY)
    pointerPressed.value = !!hit && !!buttonRef.value?.contains(hit)
    hovered.value = event.pointerType !== 'touch' && pointerPressed.value
  }
  dispatchInput('PointerMoved', event)
}
const onPointerUp = (event: PointerEvent) => { clearPressed(); if (enabled.value) dispatchInput('PointerReleased', event) }
const onPointerCancel = (event: PointerEvent) => { clearPointerState(); dispatchInput('PointerCanceled', event) }
const onCaptureLost = (event: PointerEvent) => { clearPressed(); dispatchInput('PointerCaptureLost', event) }
const onFocus = (event: FocusEvent) => dispatchInput('GotFocus', event)
const onBlur = (event: FocusEvent) => { clearPressed(); dispatchInput('LostFocus', event) }
const onPointerDown = (event: PointerEvent) => {
  if (!enabled.value || event.button !== 0) return
  pointerId.value = event.pointerId; pointerPressed.value = true; hovered.value = event.pointerType !== 'touch'
  if (dispatchInput('PointerPressed', event).Handled) { clearPressed(); return }
  try { buttonRef.value?.setPointerCapture(event.pointerId) } catch {}
  if (!allowFocusOnInteraction.value) event.preventDefault()
}
const onButtonKeyDown = (event: KeyboardEvent) => {
  if (dispatchInput('KeyDown', event).Handled) return
  if (event.key === ' ' || event.key === 'Enter') keyboardPressed.value = true
  if (hasFlyout.value && (event.key === 'ArrowDown' || (inOverflow.value && event.key === 'ArrowRight'))) { event.preventDefault(); if (buttonRef.value) void flyout.value?.ShowAt?.(buttonRef.value) }
  if (event.key === 'Escape' && flyoutOpen.value) { event.preventDefault(); flyout.value?.Hide?.(); buttonRef.value?.focus() }
}
const onButtonKeyUp = (event: KeyboardEvent) => { keyboardPressed.value = false; dispatchInput('KeyUp', event) }
const onAccelerator = (event: KeyboardEvent) => {
  if (!enabled.value || !visible.value || event.defaultPrevented || event.repeat) return
  const matches = acceleratorObjects.value.some(accelerator => {
    if (accelerator.IsEnabled !== undefined && !appBarBoolean(accelerator.IsEnabled)) return false
    const modifiers = modifiersFor(accelerator)
    const keyMatches = event.key.toLowerCase() === keyName(accelerator.Key).toLowerCase()
      || (accelerator.Key === 'Add' && event.code === 'NumpadAdd') || (accelerator.Key === 'Subtract' && event.code === 'NumpadSubtract')
    return keyMatches && event.ctrlKey === modifiers.includes('Control')
      && event.shiftKey === modifiers.includes('Shift') && event.altKey === (modifiers.includes('Menu') || modifiers.includes('Alt')) && event.metaKey === modifiers.includes('Windows')
  })
  if (matches) { event.preventDefault(); buttonRef.value?.click() }
}
const onWindowBlur = () => { clearPointerState(); flyout.value?.Hide?.() }
watch(enabled, next => { if (!next) { clearPointerState(); flyout.value?.Hide?.() } })
onMounted(() => { document.addEventListener('pointerup', clearPressed, true); document.addEventListener('pointercancel', clearPointerState, true); document.addEventListener('keydown', onAccelerator); window.addEventListener('blur', onWindowBlur) })
onBeforeUnmount(() => { document.removeEventListener('pointerup', clearPressed, true); document.removeEventListener('pointercancel', clearPointerState, true); document.removeEventListener('keydown', onAccelerator); window.removeEventListener('blur', onWindowBlur); flyout.value?.Hide?.() })
defineExpose(eventSender)
</script>
