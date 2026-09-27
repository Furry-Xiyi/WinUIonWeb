import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, proxyRefs, ref, shallowReactive, watch, type PropType, type VNode } from 'vue'
import FontIcon from './FontIcon.vue'
import SymbolIcon from './SymbolIcon.vue'
import TextBlock from './TextBlock.vue'
import MenuFlyoutPresenter from './MenuFlyoutPresenter'
import { getVNodeChildren } from './CollectionProperties'
import { frameworkLayoutStyle } from './frameworkLayout'
import { cssLength, xamlThickness } from './layout'
import { materializeXamlVNode, normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey, xamlItemContextKey } from './xamlRuntime'
import { menuFlyoutPresenterContextKey, type MenuFlyoutItemController } from './menuFlyoutContext'
import { useUICommand } from './uiCommandRuntime'
import './menuFlyoutSeparator.css'

const property = (name: string, owner: 'flyout' | 'item') => defineComponent({
  name: `${owner === 'flyout' ? 'MenuFlyout' : 'MenuFlyoutItem'}.${name}`,
  ...(owner === 'flyout' ? { __menuFlyoutProperty: name } : { __menuFlyoutItemProperty: name }),
  setup() { return () => null }
})
export const MenuFlyoutItemsProperty = property('Items', 'flyout')
export const MenuFlyoutPresenterStyleProperty = property('MenuFlyoutPresenterStyle', 'flyout')
export const MenuFlyoutItemIcon = property('Icon', 'item')
export const MenuFlyoutItemKeyboardAccelerators = property('KeyboardAccelerators', 'item')
export const MenuFlyoutSubItemItems = property('Items', 'item')
export const KeyboardAccelerator = defineComponent({
  name: 'KeyboardAccelerator', __keyboardAccelerator: true,
  props: { Key: { type: String, default: '' }, Modifiers: { type: [String, Array], default: '' }, IsEnabled: { type: [Boolean, String], default: true } },
  setup() { return () => null }
})

const commonProperties = {
  Text: { type: [String, Number], default: undefined }, Icon: { default: undefined }, Tag: { default: undefined }, DataContext: { default: undefined },
  Command: { default: undefined }, CommandParameter: { default: undefined },
  IsEnabled: { type: [Boolean, String], default: true }, IsChecked: { type: [Boolean, String], default: false }, GroupName: { type: String, default: '' },
  KeyboardAccelerators: { type: [Array, String] as PropType<unknown[] | string>, default: undefined }, KeyboardAcceleratorTextOverride: { type: String, default: '' },
  KeyboardAcceleratorPlacementMode: { type: String, default: 'Hidden' }, PreventDismissOnPointer: { type: [Boolean, String], default: false },
  Items: { type: [Array, String] as PropType<VNode[] | string>, default: undefined },
  Foreground: { type: [String, Object], default: '' }, Background: { type: [String, Object], default: '' }, BorderBrush: { type: [String, Object], default: '' },
  BorderThickness: { type: [String, Number], default: 0 }, Padding: { type: [String, Number], default: '' }, CornerRadius: { type: [String, Number], default: '' },
  FontFamily: { type: String, default: '' }, FontSize: { type: [String, Number], default: '' }, FontWeight: { type: [String, Number], default: '' },
  HorizontalContentAlignment: { type: String, default: 'Stretch' }, VerticalContentAlignment: { type: String, default: 'Center' },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' }, MinWidth: { type: [String, Number], default: 0 }, MinHeight: { type: [String, Number], default: 0 },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' }, Margin: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Stretch' }, VerticalAlignment: { type: String, default: 'Stretch' },
  FlowDirection: { type: String, default: '' }, Visibility: { type: String, default: 'Visible' }, IsTabStop: { type: [Boolean, String], default: true }
}
const boolean = (value: unknown) => value !== false && value !== 'False'
// RadioMenuFlyoutItem.cpp stores its selected item in a thread-local map keyed
// by GroupName, allowing one group to span different MenuFlyout presenters.
const radioItems = new Set<MenuFlyoutItemController>()
const itemPropertyName = (node: VNode) => (node.type as { __menuFlyoutItemProperty?: string })?.__menuFlyoutItemProperty
const asNodes = (value: unknown): VNode[] => Array.isArray(value) ? value.filter(isVNode) : isVNode(value) ? [value] : []

const createItem = (kind: string) => Object.assign(defineComponent({
  name: kind, __menuFlyoutItem: true, __menuFlyoutItemKind: kind,
  inheritAttrs: false, props: commonProperties,
  emits: ['Click', 'Checked', 'Unchecked', ...Object.keys(commonProperties).map(name => `update:${name}`)],
  setup(props, { attrs, slots, emit, expose }) {
    const instance = getCurrentInstance()
    const context = inject(menuFlyoutPresenterContextKey, null)
    const inheritedScope = inject<Record<string, any>>(xamlScopeKey, {})
    const inheritedItem = inject(xamlItemContextKey, undefined)
    const element = ref<HTMLElement | null>(null)
    const submenu = ref<any>(null)
    const hovered = ref(false)
    const pressed = ref(false)
    const splitRegion = ref<'primary' | 'secondary' | null>(null)
    const submenuOpen = ref(false)
    const overrides = shallowReactive<Record<string, unknown>>({})
    const resolve = (value: unknown) => resolveXamlValue(value, instance)
    const value = (name: keyof typeof commonProperties) => name in overrides ? overrides[name] : resolve(props[name])
    const set = (name: keyof typeof commonProperties, next: unknown) => { overrides[name] = next; updateXamlBinding(props[name], next, instance); emit(`update:${name}`, next) }
    const dependencies = Object.fromEntries(Object.keys(commonProperties).map(name => [name, computed({ get: () => value(name as keyof typeof commonProperties), set: next => set(name as keyof typeof commonProperties, next) })]))
    for (const name of Object.keys(commonProperties) as (keyof typeof commonProperties)[]) watch(() => resolve(props[name]), () => { delete overrides[name] })
    const command = useUICommand(() => value('Command'))
    const text = computed(() => String(value('Text') ?? command.value?.Label ?? ''))
    const visible = computed(() => value('Visibility') !== 'Collapsed')
    const enabled = computed(() => boolean(value('IsEnabled')) && (command.value?.CanExecute?.(value('CommandParameter')) ?? true) !== false)
    const checked = computed(() => boolean(value('IsChecked')))
    const group = computed(() => String(value('GroupName') ?? ''))
    const isToggle = kind === 'ToggleMenuFlyoutItem'
    const isRadio = kind === 'RadioMenuFlyoutItem'
    const hasSubmenu = kind === 'MenuFlyoutSubItem' || kind === 'SplitMenuFlyoutItem'
    const isSplit = kind === 'SplitMenuFlyoutItem'
    // SplitMenuFlyoutItem has its own mutually exclusive CommonStates.
    // Its RootGrid never participates in ordinary item/subitem feedback.
    const splitVisualState = computed(() => {
      if (!isSplit) return undefined
      if (!enabled.value) return 'Disabled'
      if (submenuOpen.value && !submenu.value?.IsDelayCloseTimerRunning) return 'SubMenuOpened'
      if (pressed.value && splitRegion.value) return splitRegion.value === 'primary' ? 'PrimaryPressed' : 'SecondaryPressed'
      if (hovered.value && splitRegion.value) return splitRegion.value === 'primary' ? 'PrimaryPointerOver' : 'SecondaryPointerOver'
      return 'Normal'
    })
    const nodes = computed(() => slots.default?.() ?? [])
    const propertyNodes = (name: string) => getVNodeChildren(nodes.value.find(node => itemPropertyName(node) === name) ?? { children: [] } as unknown as VNode)
    const iconNodes = computed(() => normalizeXamlNodes(propertyNodes('Icon'), instance).map(node => materializeXamlVNode(node, inheritedItem, instance) as VNode))
    const hasIcon = computed(() => iconNodes.value.length > 0 || !!value('Icon') || !!command.value?.IconSource)
    const acceleratorObjects = computed<Record<string, any>[]>(() => {
      const property = propertyNodes('KeyboardAccelerators')
      if (property.length) return property.map(node => Object.fromEntries(Object.entries(node.props ?? {}).map(([key, entry]) => [key, resolve(entry)])))
      const source = value('KeyboardAccelerators') ?? command.value?.KeyboardAccelerators
      return Array.isArray(source) ? source : []
    })
    const modifiers = (source: unknown) => new Set(Array.isArray(source) ? source.map(String) : String(source ?? '').split(/[,+\s]+/).filter(Boolean))
    const acceleratorText = computed(() => {
      const override = value('KeyboardAcceleratorTextOverride')
      if (override) return String(override)
      const source = acceleratorObjects.value.find(accelerator => boolean(accelerator.IsEnabled ?? true))
      if (!source) return ''
      const modifier = modifiers(source.Modifiers)
      return [...(modifier.has('Control') ? ['Ctrl'] : []), ...(modifier.has('Shift') ? ['Shift'] : []), ...(modifier.has('Menu') || modifier.has('Alt') ? ['Alt'] : []), ...(modifier.has('Windows') ? ['Win'] : []), String(source.Key ?? '')].join('+')
    })
    const acceleratorForeground = computed(() => {
      const state = !enabled.value ? 'Disabled' : pressed.value ? 'Pressed' : hovered.value ? 'PointerOver' : ''
      const prefix = isToggle || isRadio ? 'ToggleMenuFlyoutItem' : 'MenuFlyoutItem'
      return `var(--${prefix}KeyboardAcceleratorTextForeground${state}, var(--${!enabled.value ? 'text-disabled' : 'text-secondary'}))`
    })
    let openTimer: number | undefined
    let pointerId: number | null = null
    let pointerOrigin: { x: number; y: number } | null = null
    let canceledClick = false
    let keyboardPressed: string | null = null
    const clearOpenTimer = () => { if (openTimer !== undefined) window.clearTimeout(openTimer); openTimer = undefined }
    const clearPointer = () => { pressed.value = false; hovered.value = false; splitRegion.value = null; pointerId = null; pointerOrigin = null; keyboardPressed = null; clearOpenTimer() }
    const closeSubmenu = (restore = false) => { clearOpenTimer(); submenu.value?.Hide(restore); submenuOpen.value = false }
    const openSubmenu = async (focus = false) => {
      if (!enabled.value || !hasSubmenu || !element.value) return
      clearOpenTimer(); context?.CloseSiblings(controller)
      await submenu.value?.ShowAt(element.value, { Placement: 'Right', AllowFocusOnInteraction: focus })
    }
    const dataContext = computed({ get: () => value('DataContext') ?? inheritedItem ?? inheritedScope.DataContext?.value ?? inheritedScope.DataContext ?? inheritedScope.Item?.value ?? inheritedScope.Item ?? inheritedScope.item?.value ?? inheritedScope.item, set: next => set('DataContext', next) })
    const name = computed(() => String(resolve(attrs['x:Name'] ?? attrs.Name ?? attrs['data-xaml-ref'] ?? instance?.vnode.props?.['x:Name'] ?? '') ?? ''))
    const focus = () => (isSplit ? element.value?.querySelector<HTMLElement>('.win-menu-flyout-split-primary') : element.value)?.focus({ preventScroll: true })
    const itemCollection = computed({ get: () => submenu.value?.Items ?? [], set: next => set('Items', next) })
    const api = proxyRefs({ ...dependencies, Name: name, Items: hasSubmenu ? itemCollection : dependencies.Items, DataContext: dataContext, Element: element, Focus: focus }) as Record<string, unknown>
    const raise = (name: 'Click' | 'Checked' | 'Unchecked', args: Record<string, unknown> = {}) => {
      const listeners = instance?.vnode.props?.[`on${name}`]
      for (const listener of Array.isArray(listeners) ? listeners : listeners ? [listeners] : []) if (typeof listener === 'function') listener(api, args)
      resolveXamlHandler(attrs[name], instance)?.(api, args)
    }
    const setChecked = (next: boolean) => {
      if (checked.value === next) return
      set('IsChecked', next)
      raise(next ? 'Checked' : 'Unchecked', { OriginalSource: api, Handled: false })
    }
    const selectRadioGroup = () => {
      if (!isRadio || !checked.value) return
      radioItems.forEach(item => { if (item !== controller && item.GroupName.value === group.value) item.SetChecked(false) })
    }
    const invoke = (event?: Event) => {
      if (!enabled.value || !visible.value) return
      if (hasSubmenu && !isSplit) { void openSubmenu(event instanceof KeyboardEvent); return }
      if (isToggle) setChecked(!checked.value)
      if (isRadio) { setChecked(true); selectRadioGroup() }
      const args = { OriginalSource: api, Handled: false }
      raise('Click', args)
      command.value?.Execute?.(value('CommandParameter'))
      clearPointer()
      if (!boolean(value('PreventDismissOnPointer'))) context?.Dismiss()
    }
    const controller: MenuFlyoutItemController = {
      Element: element, IsEnabled: enabled, IsVisible: visible, HasIcon: hasIcon, IsCheckItem: isToggle || isRadio, IsRadioItem: isRadio,
      GroupName: group, IsChecked: checked, Text: text, AcceleratorText: acceleratorText, SetChecked: setChecked, Invoke: invoke,
      OpenSubmenu: focus => { void openSubmenu(focus) }, CloseSubmenu: closeSubmenu, ClearPointer: clearPointer, Focus: focus, HasSubmenu: hasSubmenu, Api: api,
      MatchesAccelerator(event) {
        return acceleratorObjects.value.some(source => {
          const modifier = modifiers(source.Modifiers)
          const key = String(source.Key ?? '')
          const browserKey = key === 'Space' ? ' ' : key === 'Back' ? 'Backspace' : key
          return boolean(source.IsEnabled ?? true) && browserKey.toLowerCase() === event.key.toLowerCase()
            && event.ctrlKey === modifier.has('Control') && event.shiftKey === modifier.has('Shift')
            && event.altKey === (modifier.has('Menu') || modifier.has('Alt')) && event.metaKey === modifier.has('Windows')
        })
      }
    }
    const hover = (event: PointerEvent, submenuRegion = true) => {
      if (!enabled.value || !context?.CanHover(event)) return
      hovered.value = true
      if (isSplit) splitRegion.value = submenuRegion ? 'secondary' : 'primary'
      context.CancelPendingClose()
      if (isSplit) {
        if (submenuRegion) submenu.value?.CancelPendingClose?.()
        else {
          clearOpenTimer()
          if (submenuOpen.value) submenu.value?.DelayClose?.()
        }
      }
      if (hasSubmenu && submenuRegion && !submenuOpen.value && openTimer === undefined) openTimer = window.setTimeout(() => { void openSubmenu() }, 400)
      if (!hasSubmenu || !submenuRegion) context.CloseSiblings(controller)
    }
    const pointerDown = (event: PointerEvent) => {
      if (!enabled.value || event.button !== 0) return
      if (isSplit) splitRegion.value = (event.target as Element)?.closest('.win-menu-flyout-split-secondary') ? 'secondary' : 'primary'
      canceledClick = false; pressed.value = true; pointerId = event.pointerId; pointerOrigin = { x: event.clientX, y: event.clientY }
    }
    const pointerMove = (event: PointerEvent, submenuRegion = true) => {
      if (pointerId === event.pointerId && event.pointerType === 'touch' && pointerOrigin && Math.hypot(event.clientX - pointerOrigin.x, event.clientY - pointerOrigin.y) > 10) {
        pressed.value = false; canceledClick = true
      }
      hover(event, submenuRegion)
    }
    const pointerCancel = () => { canceledClick = true; clearPointer() }
    const pointerLeave = () => {
      clearPointer()
      if (submenuOpen.value) submenu.value?.DelayClose?.()
    }
    const click = (event: MouseEvent, secondary = false) => {
      if (canceledClick) { canceledClick = false; event.preventDefault(); return }
      if (secondary) {
        if (!enabled.value) return
        submenuOpen.value ? closeSubmenu() : void openSubmenu(false)
      } else invoke(event)
    }
    const keyDown = (event: KeyboardEvent, secondary = false) => {
      if (isSplit && enabled.value) {
        const forward = context?.FlowDirection.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
        const backward = context?.FlowDirection.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
        if ((!secondary && [forward, 'ArrowDown'].includes(event.key)) || (secondary && [backward, 'ArrowUp'].includes(event.key))) {
          event.preventDefault(); event.stopPropagation(); keyboardPressed = null; pressed.value = false
          element.value?.querySelector<HTMLElement>(secondary ? '.win-menu-flyout-split-primary' : '.win-menu-flyout-split-secondary')?.focus({ preventScroll: true })
          return
        }
      }
      if (!['Enter', ' '].includes(event.key)) { keyboardPressed = null; pressed.value = false; return }
      if (!enabled.value) return
      event.preventDefault(); event.stopPropagation()
      if (event.repeat) return
      if (secondary || (hasSubmenu && !isSplit)) { void openSubmenu(true); return }
      keyboardPressed = event.key
      if (isSplit) splitRegion.value = secondary ? 'secondary' : 'primary'
      pressed.value = true
    }
    const keyUp = (event: KeyboardEvent) => {
      if (!['Enter', ' '].includes(event.key)) return
      event.preventDefault(); event.stopPropagation()
      const invokeOnRelease = keyboardPressed === event.key && pressed.value && pointerId === null
      keyboardPressed = null; pressed.value = false
      if (invokeOnRelease) invoke(event)
    }
    const itemStyle = computed(() => ({
      ...frameworkLayoutStyle(Object.fromEntries(Object.keys(commonProperties).map(name => [name, value(name as keyof typeof commonProperties)])), instance),
      padding: xamlThickness(value('Padding') || (context?.NarrowPadding.value === false ? '11,8,11,9' : '11,4,11,5')),
      fontFamily: value('FontFamily') || undefined, fontSize: value('FontSize') ? cssLength(value('FontSize')) : undefined,
      fontWeight: value('FontWeight') || undefined,
      borderRadius: value('CornerRadius') ? cssLength(value('CornerRadius')) : undefined,
      borderWidth: xamlThickness(value('BorderThickness')), borderColor: value('BorderBrush') || undefined,
      '--menu-item-background': value('Background') || undefined, '--menu-item-foreground': value('Foreground') || undefined
    }))
    const iconContent = () => {
      if (iconNodes.value.length) return iconNodes.value
      const source = value('Icon') ?? command.value?.IconSource
      if (isVNode(source)) return [source]
      if (source && typeof source === 'object') {
        const icon = source as any
        return [icon.Glyph ? h(FontIcon, { Glyph: icon.Glyph, FontSize: 20 }) : h(SymbolIcon, { Symbol: icon.Symbol ?? '', FontSize: 20 })]
      }
      return source ? [h(SymbolIcon, { Symbol: String(source), FontSize: 20 })] : []
    }
    const leading = () => [
      context?.ContainsCheckItems.value ? h('span', { class: ['win-menu-flyout-check-slot', { 'is-checked': checked.value && (isToggle || isRadio) }], 'aria-hidden': true }, (isToggle || isRadio) ? h(FontIcon, { Glyph: isRadio ? '\uE915' : '\uE73E', FontSize: 12, Foreground: 'inherit' }) : null) : null,
      context?.ContainsIconItems.value ? h('span', { class: 'win-menu-flyout-icon-viewbox', 'aria-hidden': true }, h('span', { class: 'win-menu-flyout-icon-content' }, iconContent())) : null
    ]
    const contents = () => [
      ...leading(), h(TextBlock, { class: 'win-menu-flyout-label', Text: text.value, Foreground: 'inherit', FontFamily: 'inherit', FontSize: 'inherit', FontWeight: 'inherit', LineHeight: 20, TextTrimming: 'Clip', TextWrapping: 'NoWrap' }),
      hasSubmenu ? h(FontIcon, { class: 'win-menu-flyout-chevron', Glyph: '\uE974', FontFamily: '{ThemeResource SymbolThemeFontFamily}', FontSize: 12, Margin: '{StaticResource MenuFlyoutItemChevronMargin}', MirroredWhenRightToLeft: 'True', Foreground: 'inherit', 'aria-hidden': true })
        : acceleratorText.value ? h(TextBlock, { class: ['win-menu-flyout-accelerator', { 'is-toggle-accelerator': isToggle || isRadio }], Text: acceleratorText.value, FontFamily: 'var(--ContentControlThemeFontFamily, Segoe UI Variable, Segoe UI, sans-serif)', FontSize: 12, FontWeight: 'Normal', LineHeight: 16, Margin: isToggle || isRadio ? '24,0,0,0' : '24,4,0,0', MinWidth: context?.AcceleratorMinWidth.value ?? 0, Foreground: acceleratorForeground.value, 'aria-hidden': true }) : null
    ]
    const submenuNodes = computed(() => {
      const explicit = propertyNodes('Items')
      const source = explicit.length ? explicit : props.Items !== undefined ? asNodes(value('Items')) : nodes.value.filter(node => !itemPropertyName(node))
      return normalizeXamlNodes(source, instance)
    })
    const submenuOwner = { Options: () => context?.Options() ?? {}, Raise: (name: string) => { if (name === 'Opened') submenuOpen.value = true; if (name === 'Closing' || name === 'Closed') submenuOpen.value = false } }
    onMounted(() => { context?.Register(controller); if (isRadio) radioItems.add(controller); selectRadioGroup() })
    onBeforeUnmount(() => { clearOpenTimer(); context?.Unregister(controller); radioItems.delete(controller) })
    watch([checked, group], selectRadioGroup)
    watch(enabled, next => { if (!next) { if (element.value?.contains(document.activeElement)) context?.FocusRelative(controller, 1); clearPointer(); closeSubmenu() } })
    watch(visible, next => { if (!next) { if (element.value?.contains(document.activeElement)) context?.FocusRelative(controller, 1); clearPointer(); closeSubmenu() } })
    watch(() => context?.IsOpen.value, next => { if (!next) { clearPointer(); closeSubmenu() } })
    expose({ ...dependencies, Name: name, Items: hasSubmenu ? itemCollection : dependencies.Items, DataContext: dataContext, Element: element, Focus: focus })
    return () => h(Fragment, [
      h(isSplit ? 'div' : 'button', {
        ref: element,
        class: ['win-menu-flyout-item', attrs.class, { 'is-pointer-over': !isSplit && hovered.value, 'is-pressed': !isSplit && pressed.value, 'is-disabled': !enabled.value, 'is-checked': checked.value, 'is-open': submenuOpen.value, 'is-split': isSplit, 'is-subitem': hasSubmenu && !isSplit, 'is-toggle': isToggle, 'is-radio': isRadio }],
        'data-visual-state': splitVisualState.value,
        style: [attrs.style, itemStyle.value], type: isSplit ? undefined : 'button', role: isRadio ? 'menuitemradio' : isToggle ? 'menuitemcheckbox' : 'menuitem',
        tabindex: boolean(value('IsTabStop')) ? -1 : undefined, disabled: isSplit ? undefined : !enabled.value,
        'aria-disabled': !enabled.value || undefined, 'aria-checked': isRadio || isToggle ? checked.value : undefined,
        'aria-haspopup': hasSubmenu ? 'menu' : undefined, 'aria-expanded': hasSubmenu ? submenuOpen.value : undefined,
        'aria-label': resolve(attrs['AutomationProperties.Name']) || undefined,
        dir: value('FlowDirection') === 'RightToLeft' ? 'rtl' : undefined,
        onPointerenter: isSplit ? undefined : (event: PointerEvent) => hover(event), onPointermove: isSplit ? undefined : (event: PointerEvent) => pointerMove(event),
        onPointerleave: pointerLeave,
        onPointerdown: pointerDown, onPointerup: () => { pressed.value = false; pointerId = null; pointerOrigin = null }, onPointercancel: pointerCancel,
        onLostpointercapture: () => { if (pointerId !== null) pointerCancel() },
        onClick: isSplit ? undefined : click, onKeydown: isSplit ? undefined : keyDown, onKeyup: isSplit ? undefined : keyUp, onBlur: () => { keyboardPressed = null; pressed.value = false }
      }, isSplit ? [
        h('button', { class: 'win-menu-flyout-split-primary', type: 'button', tabindex: -1, disabled: !enabled.value, 'aria-label': text.value,
          onClick: (event: MouseEvent) => click(event), onKeydown: (event: KeyboardEvent) => keyDown(event), onKeyup: keyUp,
          onPointerenter: (event: PointerEvent) => { event.stopPropagation(); hover(event, false) },
          onPointermove: (event: PointerEvent) => { event.stopPropagation(); pointerMove(event, false) }, onPointerleave: pointerLeave }),
        h('span', { class: 'win-menu-flyout-split-divider', 'aria-hidden': true }),
        h('button', { class: 'win-menu-flyout-split-secondary', type: 'button', tabindex: -1, disabled: !enabled.value, 'aria-label': text.value, 'aria-haspopup': 'menu', 'aria-expanded': submenuOpen.value,
          onClick: (event: MouseEvent) => click(event, true), onKeydown: (event: KeyboardEvent) => keyDown(event, true),
          onPointerenter: (event: PointerEvent) => { event.stopPropagation(); hover(event, true) },
          onPointermove: (event: PointerEvent) => { event.stopPropagation(); pointerMove(event, true) }, onPointerleave: pointerLeave }),
        h('div', { class: 'win-menu-flyout-split-content', 'aria-hidden': true }, contents())
      ] : contents()),
      hasSubmenu ? h(MenuFlyoutPresenter, { ref: submenu, Owner: submenuOwner, IsSubmenu: true }, { default: () => submenuNodes.value }) : null
    ])
  }
}), { Icon: MenuFlyoutItemIcon, KeyboardAccelerators: MenuFlyoutItemKeyboardAccelerators, Items: MenuFlyoutSubItemItems })

export const MenuFlyoutItem = createItem('MenuFlyoutItem')
export const ToggleMenuFlyoutItem = createItem('ToggleMenuFlyoutItem')
export const RadioMenuFlyoutItem = createItem('RadioMenuFlyoutItem')
export const MenuFlyoutSubItem = createItem('MenuFlyoutSubItem')
export const SplitMenuFlyoutItem = createItem('SplitMenuFlyoutItem')
export const MenuFlyoutSeparator = defineComponent({
  name: 'MenuFlyoutSeparator', __menuFlyoutItem: true, __menuFlyoutItemKind: 'MenuFlyoutSeparator', inheritAttrs: false,
  props: { Background: { type: String, default: '' }, Padding: { type: [String, Number], default: '-4,1,-4,1' }, Margin: { type: [String, Number], default: '' }, Visibility: { type: String, default: 'Visible' } },
  setup(props, { attrs, expose }) {
    const instance = getCurrentInstance()
    const context = inject(menuFlyoutPresenterContextKey, null)
    const element = ref<HTMLElement | null>(null)
    const visible = computed(() => resolveXamlValue(props.Visibility, instance) !== 'Collapsed')
    const separatorStyle = computed(() => {
      const margin = xamlThickness(resolveXamlValue(props.Margin, instance)) || '0px'
      const edges = margin.split(/\s+/)
      const top = edges[0], bottom = edges[2] ?? top
      // FrameworkElement clamps DesiredSize after adding negative margins.
      // Reserve a nonnegative outer slot and center the template rectangle
      // in the expanded arrange size instead of pulling later items upward.
      return { margin, minHeight: `max(0px, calc(0px - (${top}) - (${bottom})))`, display: visible.value ? undefined : 'none' }
    })
    const api = proxyRefs({ Element: element, Background: computed(() => resolveXamlValue(props.Background, instance)), Visibility: computed(() => resolveXamlValue(props.Visibility, instance)) })
    const controller: MenuFlyoutItemController = {
      Element: element, IsEnabled: computed(() => false), IsVisible: visible, HasIcon: computed(() => false), IsCheckItem: false, IsRadioItem: false,
      GroupName: computed(() => ''), IsChecked: computed(() => false), Text: computed(() => ''), AcceleratorText: computed(() => ''),
      SetChecked() {}, Invoke() {}, MatchesAccelerator: () => false, OpenSubmenu() {}, CloseSubmenu() {}, ClearPointer() {}, Focus() {}, HasSubmenu: false, Api: api
    }
    onMounted(() => context?.Register(controller))
    onBeforeUnmount(() => context?.Unregister(controller))
    expose({ Element: element, Background: computed(() => resolveXamlValue(props.Background, instance)), Visibility: computed(() => resolveXamlValue(props.Visibility, instance)) })
    return () => h('div', { ref: element, class: ['win-menu-flyout-separator', attrs.class], role: 'separator', style: [attrs.style, separatorStyle.value] },
      h('div', { class: 'win-menu-flyout-separator-line', style: { margin: xamlThickness(resolveXamlValue(props.Padding, instance)), background: resolveXamlValue(props.Background, instance) || undefined } }))
  }
})
