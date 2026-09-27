import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowReactive, shallowRef, Teleport, unref, watch, withDirectives, type CSSProperties, type Ref } from 'vue'
import { useAcrylicBrushStyle } from './AcrylicBrush'
import { vAcrylicBackdrop, vAcrylicBrush } from './acrylicBrushVisual'
import { vThemeShadow } from './themeShadowVisual'
import { xamlThemeKey } from './brushCore'
import ScrollViewer from './ScrollViewer.vue'
import { fitPopupPosition, popupBoundsFor, popupPlacementPosition, resolvePopupElement, type PopupBounds } from './popupRuntime'
import { cssLength, xamlThickness } from './layout'
import { menuFlyoutPresenterContextKey, type MenuFlyoutItemController, type MenuFlyoutPresenterContext } from './menuFlyoutContext'
import { menuBarFlyoutNavigationKey, menuBarFlyoutEnabledKey } from './menuBarContext'
import { flyoutContainsNode, hasOpenDescendantFlyout, hideDescendantFlyouts, isDescendantFlyoutOpening, nestedFlyoutLayers, registerFlyoutInputRegion, type FlyoutInputRegion } from './flyoutInput'

/** MenuFlyoutPresenter: Border > ScrollViewer > ItemsPresenter. */
export default defineComponent({
  name: 'MenuFlyoutPresenter',
  inheritAttrs: false,
  props: { Owner: { type: Object, required: true }, IsSubmenu: { type: Boolean, default: false } },
  setup(props, { slots, expose }) {
    const instance = getCurrentInstance()
    const parent = inject(menuFlyoutPresenterContextKey, null)
    const depth = props.IsSubmenu ? (parent?.Depth ?? 0) + 1 : 0
    const navigateMenuBar = inject(menuBarFlyoutNavigationKey, null)
    const isMenuBarEnabled = inject(menuBarFlyoutEnabledKey, () => true)
    const inheritedTheme = inject<string | Ref<string> | null>(xamlThemeKey, null) ?? inject<string | Ref<string>>('winuiTheme', '')
    const presenter = ref<HTMLElement | null>(null)
    const dismissLayer = ref<HTMLElement | null>(null)
    const contentMount = ref<HTMLElement | null>(null)
    const host = document.createElement('div')
    host.className = 'win-menu-flyout-content-host'
    host.style.display = 'none'
    const portal = document.createElement('div')
    portal.className = 'win-menu-flyout-portal'
    portal.appendChild(host)
    const contentTarget = shallowRef<HTMLElement>(host)
    const isOpen = ref(false)
    const isPresent = ref(false)
    const isPositioned = ref(false)
    const isOpening = ref(false)
    const target = ref<HTMLElement | null>(null)
    const bounds = ref<PopupBounds>({ left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 })
    const position = ref({ left: 0, top: 0 })
    const nestedLayers = ref<{ overlay: number; presenter: number } | null>(null)
    const placement = ref('Bottom')
    const narrowPadding = ref(true)
    const direction = ref('ltr')
    const revision = ref(0)
    const registry = shallowReactive(new Set<MenuFlyoutItemController>())
    const rootItems = parent?.RootItems ?? new Set<MenuFlyoutItemController>()
    let generation = 0
    let animations: Animation[] = []
    let previousFocus: HTMLElement | null = null
    let currentOptions: Record<string, any> = {}
    let closeTimer: number | undefined
    const isDelayCloseTimerRunning = ref(false)
    let resizeObserver: ResizeObserver | null = null
    let themeObserver: MutationObserver | null = null
    let isUnmounted = false
    let lastPointer: { x: number; y: number } | null = null
    let openingPointer: { x: number; y: number } | null = null
    let lastInput = 'keyboard'
    const owner = () => props.Owner as Record<string, any>
    const inputRegion: FlyoutInputRegion = {
      get Owner() { return owner().Api },
      get IsOpen() { return isOpen.value },
      get Target() { return target.value },
      get Presenter() { return presenter.value },
      get DismissLayer() { return dismissLayer.value },
      Hide: hide
    }
    const unregisterInputRegion = registerFlyoutInputRegion(inputRegion)
    const enabled = (value: unknown) => value !== false && value !== 'False'
    const options = () => {
      const inherited = { ...(parent?.Options() ?? {}), ...(owner().Options?.() ?? {}) }
      if (props.IsSubmenu) {
        // ShowAt geometry belongs to its target, not to descendant menus.
        delete inherited.Position
        delete inherited.ExclusionRect
        delete inherited.Placement
      }
      return { ...inherited, ...currentOptions }
    }
    const scrollSettings = () => {
      const setters = options().PresenterStyle ?? {}
      return Object.fromEntries(Object.entries({
        HorizontalScrollMode: 'Disabled', HorizontalScrollBarVisibility: 'Disabled',
        VerticalScrollMode: 'Auto', VerticalScrollBarVisibility: 'Auto',
        IsHorizontalRailEnabled: true, IsVerticalRailEnabled: true, ZoomMode: 'Disabled'
      }).map(([name, fallback]) => [name, setters[`ScrollViewer.${name}`] ?? fallback]))
    }
    const showMode = computed(() => String(options().ShowMode ?? 'Standard'))
    const items = () => [...registry].sort((a, b) => {
      if (!a.Element.value || !b.Element.value) return 0
      return a.Element.value.compareDocumentPosition(b.Element.value) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    })
    const focusable = () => items().filter(item => item.IsEnabled.value && item.IsVisible.value)
    const focusBoundary = (last = false) => {
      const eligible = focusable()
      const item = last ? eligible.at(-1) : eligible[0]
      if (item) item.Focus()
      else presenter.value?.focus({ preventScroll: true })
    }
    const clearPointer = () => registry.forEach(item => item.ClearPointer())
    const cancelPendingClose = () => {
      if (closeTimer !== undefined) window.clearTimeout(closeTimer)
      closeTimer = undefined
      isDelayCloseTimerRunning.value = false
      parent?.CancelPendingClose()
    }
    const closeSubmenus = () => registry.forEach(item => item.CloseSubmenu())
    const stopAnimations = () => { animations.forEach(animation => animation.cancel()); animations = [] }
    const effectiveTheme = computed(() => {
      revision.value
      const scope = target.value?.closest('[data-theme], .win-theme-scope, .example-theme-wrapper, .theme-light, .theme-dark')
      const explicit = scope?.getAttribute('data-theme')?.toLowerCase()
      return explicit === 'dark' || explicit === 'light' ? explicit : scope?.classList.contains('theme-dark') ? 'dark' : scope?.classList.contains('theme-light') ? 'light' : String(unref(inheritedTheme)).toLowerCase()
    })
    const themeClass = computed(() => ['light', 'dark'].includes(effectiveTheme.value) ? `win-theme-scope theme-${effectiveTheme.value}` : '')
    provide(xamlThemeKey, effectiveTheme)
    provide('winuiTheme', effectiveTheme)
    const backgroundStyle = useAcrylicBrushStyle(() => options().PresenterStyle?.Background ?? '{ThemeResource MenuFlyoutPresenterBackground}', instance)
    const backdropStyle = useAcrylicBrushStyle(() => options().PresenterStyle?.SystemBackdrop ?? '{StaticResource MenuFlyoutSystemBackdrop}', instance)
    const style = computed<CSSProperties>(() => {
      const settings = options().PresenterStyle ?? {}
      const result: CSSProperties & Record<string, unknown> = {
        left: `${position.value.left}px`, top: `${position.value.top}px`,
        zIndex: nestedLayers.value?.presenter,
        '--menu-flyout-available-width': `${Math.max(0, bounds.value.width - 8)}px`,
        '--menu-flyout-available-height': `${Math.max(0, bounds.value.height - 8)}px`,
        '--menu-flyout-padding': xamlThickness(settings.Padding ?? '0,2,0,2'),
        '--menu-flyout-max-content-height': `${Math.max(0, bounds.value.height - 14)}px`
      }
      for (const [name, css] of Object.entries({ Foreground: 'color', BorderBrush: 'borderColor' })) if (settings[name] !== undefined) result[css] = settings[name]
      for (const name of ['Width', 'Height', 'MinWidth', 'MinHeight', 'MaxWidth', 'MaxHeight']) {
        if (settings[name] !== undefined) result[name[0].toLowerCase() + name.slice(1)] = `min(${cssLength(settings[name])}, var(--menu-flyout-available-${name.includes('Width') ? 'width' : 'height'}))`
      }
      if (settings.CornerRadius !== undefined) result.borderRadius = cssLength(settings.CornerRadius)
      if (settings.BorderThickness !== undefined) result.borderWidth = xamlThickness(settings.BorderThickness)
      if (String(options().Placement) === 'Full') { result.width = `${Math.max(0, bounds.value.width - 8)}px`; result.height = `${Math.max(0, bounds.value.height - 8)}px` }
      return result
    })
    const updatePosition = async () => {
      const element = presenter.value
      if (!element || !target.value || !isOpen.value) return
      if (!target.value.isConnected) { hide(false); return }
      bounds.value = popupBoundsFor(target.value, enabled(options().ShouldConstrainToRootBounds))
      await nextTick()
      const size = { width: element.offsetWidth, height: element.offsetHeight }
      const rect = target.value.getBoundingClientRect()
      const requested = String(options().Placement ?? (props.IsSubmenu ? 'Right' : 'Bottom'))
      let located: { left: number; top: number; placement: string }
      if (props.IsSubmenu) {
        // CascadingMenuHelper keeps submenus beside their item with 4 DIP overlap.
        const available = bounds.value
        const rtl = direction.value === 'rtl'
        const preferredSpace = rtl ? rect.left - available.left : available.right - rect.right
        const alternateSpace = rtl ? available.right - rect.right : rect.left - available.left
        const flip = size.width > preferredSpace && size.width < alternateSpace
        const leftSide = rtl !== flip
        const left = size.width > preferredSpace && !flip
          ? rtl ? available.left : available.right - size.width
          : leftSide ? rect.left - size.width + 4 : rect.right - 4
        const upward = size.height > available.bottom - rect.top
        const top = upward
          ? rect.bottom - available.top >= size.height ? rect.bottom - size.height : available.top
          : rect.top
        located = { ...fitPopupPosition({ left, top }, size, available), placement: `${upward ? 'Top' : ''}${leftSide ? 'Left' : 'Right'}` }
      } else {
        located = popupPlacementPosition(rect, size, requested, bounds.value, 4, direction.value === 'rtl')
      }
      const point = options().Position
      position.value = point ? fitPopupPosition({ left: rect.left + Number(point.X ?? 0), top: rect.top + Number(point.Y ?? 0) }, size, bounds.value)
        : { left: located.left, top: located.top }
      placement.value = located.placement
      const exclusion = options().ExclusionRect
      if (point && exclusion && requested.startsWith('Bottom')) {
        const protectedTop = rect.top + Number(exclusion.Y ?? 0)
        const protectedBottom = protectedTop + Number(exclusion.Height ?? rect.height)
        if (position.value.top < protectedBottom && position.value.top + size.height > protectedTop) {
          position.value = fitPopupPosition({ left: position.value.left, top: protectedTop - size.height }, size, bounds.value)
          placement.value = 'Top'
        }
      }
      isPositioned.value = true
    }
    // MenuPopupThemeTransition uses half of the presenter height (ClosedRatio=.5),
    // unlike the fixed 50 DIP offset of PopupThemeTransition used by Flyout.
    const animate = (opening: boolean, initial?: { opacity: string; transform: string; clipPath: string }) => {
      const element = presenter.value
      if (!element || !enabled(options().AreOpenCloseAnimationsEnabled) || matchMedia('(prefers-reduced-motion: reduce)').matches) return Promise.resolve()
      const above = placement.value.startsWith('Top')
      const offset = element.offsetHeight * .5 * (above ? 1 : -1)
      const clip = above ? 'inset(0 0 50% 0)' : 'inset(50% 0 0 0)'
      const current = initial ?? { opacity: '1', transform: 'translateY(0)', clipPath: 'inset(0)' }
      animations = [element.animate(opening ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: current.opacity }, { opacity: 0 }], { duration: 83, easing: 'linear', fill: 'both' }),
        element.animate(opening ? [{ transform: `translateY(${offset}px)`, clipPath: clip }, { transform: 'translateY(0)', clipPath: 'inset(0)' }]
          : [{ transform: current.transform, clipPath: current.clipPath }, { transform: current.transform, clipPath: current.clipPath }], { duration: opening ? 250 : 83, easing: opening ? 'cubic-bezier(0, 0, 0, 1)' : 'linear', fill: 'both' })]
      return Promise.allSettled(animations.map(animation => animation.finished)).then(() => undefined)
    }
    const observeTheme = () => {
      themeObserver?.disconnect()
      const scope = target.value?.closest('[data-theme], .win-theme-scope, .example-theme-wrapper, .theme-light, .theme-dark')
      if (scope) themeObserver?.observe(scope, { attributes: true, attributeFilter: ['class', 'data-theme'] })
      themeObserver?.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] })
      revision.value++
    }
    async function showAt(value: unknown, showOptions: Record<string, any> = {}) {
      const element = resolvePopupElement(value)
      if (!element || isUnmounted) return
      target.value = element
      nestedLayers.value = nestedFlyoutLayers(inputRegion)
      currentOptions = showOptions
      direction.value = getComputedStyle(element).direction
      narrowPadding.value = lastInput !== 'touch'
      observeTheme()
      if (isOpen.value) { await updatePosition(); return }
      const version = ++generation
      stopAnimations()
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : element
      openingPointer = lastPointer ? { ...lastPointer } : null
      isOpening.value = true
      portal.parentElement?.appendChild(portal)
      if (!props.IsSubmenu) window.dispatchEvent(new CustomEvent('winui-flyout-opening', { detail: owner().Api }))
      owner().Raise?.('Opening')
      isOpen.value = true
      isPresent.value = true
      isPositioned.value = false
      await nextTick()
      if (contentMount.value) contentTarget.value = contentMount.value
      await nextTick()
      await updatePosition()
      if (version !== generation || !isOpen.value || isUnmounted) return
      resizeObserver?.disconnect()
      if (presenter.value) resizeObserver?.observe(presenter.value)
      resizeObserver?.observe(element)
      // Programmatic focus must not create a PointerOver background while opening.
      if (showMode.value !== 'Transient' && enabled(options().AllowFocusOnInteraction)) focusBoundary()
      const finished = animate(true)
      owner().Raise?.('Opened')
      await finished
      if (version === generation) { stopAnimations(); isOpening.value = false }
    }
    function hide(restoreFocus = true) {
      if (!isOpen.value) return
      const args = { Cancel: false }
      owner().Raise?.('Closing', args)
      if (args.Cancel) return
      hideDescendantFlyouts(inputRegion)
      const version = ++generation
      cancelPendingClose()
      closeSubmenus()
      clearPointer()
      const current = presenter.value ? getComputedStyle(presenter.value) : null
      const initial = current ? { opacity: current.opacity, transform: current.transform, clipPath: current.clipPath } : undefined
      stopAnimations()
      isOpen.value = false
      isOpening.value = false
      resizeObserver?.disconnect()
      const canRestore = (element: HTMLElement | null) => element?.isConnected
        && element.getClientRects().length > 0
        && !element.closest('.is-closing, [inert], [hidden]')
      const restore = canRestore(previousFocus) ? previousFocus : target.value
      const focusedInside = presenter.value?.contains(document.activeElement) || (!props.IsSubmenu && [...rootItems].some(item => item.Element.value?.contains(document.activeElement)))
      if (restoreFocus && focusedInside && restore?.isConnected) restore.focus({ preventScroll: true })
      void animate(false, initial).then(async () => {
        if (version !== generation || isOpen.value || isUnmounted) return
        stopAnimations()
        contentTarget.value = host
        await nextTick()
        isPresent.value = false
        isPositioned.value = false
        owner().Raise?.('Closed')
      })
    }
    const context: MenuFlyoutPresenterContext = {
      Depth: depth,
      IsOpen: isOpen, IsOpening: isOpening, IsSubmenu: props.IsSubmenu, NarrowPadding: narrowPadding, FlowDirection: direction,
      ContainsCheckItems: computed(() => [...registry].some(item => item.IsVisible.value && item.IsCheckItem)),
      ContainsIconItems: computed(() => [...registry].some(item => item.IsVisible.value && item.HasIcon.value)),
      AcceleratorMinWidth: computed(() => Math.max(0, ...[...registry].map(item => item.AcceleratorText.value.length * 6.5))),
      Register(item) { registry.add(item); rootItems.add(item) },
      Unregister(item) { registry.delete(item); rootItems.delete(item) }, Items: items, RootItems: rootItems,
      Dismiss() { if (parent) parent.Dismiss(); else owner().Hide?.() }, Close: hide,
      CloseSiblings(item) { registry.forEach(candidate => { if (candidate !== item) candidate.CloseSubmenu() }) },
      FocusRelative(item, delta) {
        const all = items(), original = all.indexOf(item)
        for (let offset = 1; offset <= all.length; offset++) {
          const candidate = all[(original + delta * offset + all.length * 2) % all.length]
          if (candidate?.IsEnabled.value && candidate.IsVisible.value) { candidate.Focus(); return }
        }
        presenter.value?.focus({ preventScroll: true })
      },
      FocusBoundary: focusBoundary,
      CanHover(event) {
        if (!isOpen.value || event.pointerType === 'touch') return false
        // Pointer enter events caused by transformed pixels crossing a stationary
        // pointer are ignored until the user actually moves that pointer.
        if (openingPointer && event.clientX === openingPointer.x && event.clientY === openingPointer.y && (event.type !== 'pointermove' || (event.movementX === 0 && event.movementY === 0))) return false
        if (openingPointer) openingPointer = null
        if (isOpening.value && !openingPointer && event.movementX === 0 && event.movementY === 0) return false
        return true
      },
      CancelPendingClose: cancelPendingClose,
      DelayClose() {
        if (closeTimer !== undefined || !isOpen.value) return
        cancelPendingClose()
        isDelayCloseTimerRunning.value = true
        closeTimer = window.setTimeout(() => hide(false), 400)
      }, Options: options
    }
    provide(menuFlyoutPresenterContextKey, context)
    const onPointerMove = (event: PointerEvent) => { lastPointer = { x: event.clientX, y: event.clientY }; if (!isOpening.value) context.CancelPendingClose() }
    const capturePointer = (event: PointerEvent) => { lastInput = event.pointerType || 'mouse'; lastPointer = { x: event.clientX, y: event.clientY } }
    const captureMove = (event: PointerEvent) => { lastPointer = { x: event.clientX, y: event.clientY } }
    const captureKey = (event: KeyboardEvent) => {
      lastInput = 'keyboard'
      if (!props.IsSubmenu && isOpen.value && !hasOpenDescendantFlyout(inputRegion) && event.key === 'Escape' && !presenter.value?.contains(document.activeElement)
        && ![...document.querySelectorAll('.win-menu-submenu-presenter')].some(menu => menu.contains(document.activeElement))) { event.preventDefault(); hide() }
    }
    const onDocumentPointerMove = (event: PointerEvent) => {
      if (props.IsSubmenu || !isOpen.value || showMode.value !== 'TransientWithDismissOnPointerMove' || !context.CanHover(event)) return
      if ([...document.querySelectorAll('.win-menu-flyout-presenter:not(.is-closing)')].some(menu => menu.contains(event.target as Node))) return
      const anchor = target.value?.getBoundingClientRect()
      const popup = presenter.value?.getBoundingClientRect()
      if (!anchor || !popup) return
      if (event.clientX < Math.min(anchor.left, popup.left) - 12 || event.clientX > Math.max(anchor.right, popup.right) + 12
        || event.clientY < Math.min(anchor.top, popup.top) - 12 || event.clientY > Math.max(anchor.bottom, popup.bottom) + 12) hide(false)
    }
    const onDocumentScroll = () => { if (isOpen.value) void updatePosition() }
    const onKeyDown = (event: KeyboardEvent) => {
      lastInput = 'keyboard'
      if (!isOpen.value || (!presenter.value?.contains(document.activeElement) && props.IsSubmenu)) return
      const forward = direction.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
      const backward = direction.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
      const item = items().find(candidate => candidate.Element.value?.contains(document.activeElement))
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); item ? context.FocusRelative(item, event.key === 'ArrowDown' ? 1 : -1) : focusBoundary(event.key === 'ArrowUp') }
      else if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); focusBoundary(event.key === 'End') }
      else if (event.key === forward && item?.HasSubmenu) { event.preventDefault(); item.OpenSubmenu(true) }
      else if (event.key === backward && props.IsSubmenu) { event.preventDefault(); hide() }
      else if (!props.IsSubmenu && !item?.HasSubmenu && (event.key === forward || event.key === backward)) navigateMenuBar?.(event)
      else if (event.key === 'Escape') { event.preventDefault(); props.IsSubmenu ? hide() : owner().Hide?.() }
      else if (event.key === 'Tab') event.preventDefault()
      if (event.defaultPrevented) event.stopPropagation()
    }
    const onAccelerator = (event: KeyboardEvent) => {
      if (props.IsSubmenu || event.defaultPrevented || !isMenuBarEnabled()) return
      const match = [...rootItems].find(item => item.IsEnabled.value && item.IsVisible.value && item.MatchesAccelerator(event))
      if (match) { event.preventDefault(); event.stopPropagation(); match.Invoke(event) }
    }
    const onOtherFlyout = (event: Event) => {
      const opening = (event as CustomEvent).detail
      if (!props.IsSubmenu && opening !== owner().Api && !isDescendantFlyoutOpening(opening, inputRegion)) hide()
    }
    const onWindowBlur = () => hide(false)
    const onLightDismiss = (event: PointerEvent) => {
      if (!isOpen.value || props.IsSubmenu) return
      const element = event.target as Node
      if (flyoutContainsNode(inputRegion, element) || [...rootItems].some(item => item.Element.value?.contains(element))) return
      const submenuContains = [...document.querySelectorAll('.win-menu-submenu-presenter')].some(menu => menu.contains(element))
      if (submenuContains) return
      const passthrough = resolvePopupElement(options().OverlayInputPassThroughElement)
      if (passthrough?.contains(element)) { hide(false); return }
      if (showMode.value === 'Standard' || showMode.value === 'Auto') hide(false)
    }
    onMounted(() => {
      document.body.appendChild(portal)
      resizeObserver = new ResizeObserver(() => { if (isOpen.value) void updatePosition() })
      themeObserver = new MutationObserver(() => revision.value++)
      document.addEventListener('pointerdown', capturePointer, true)
      document.addEventListener('pointermove', captureMove, true)
      document.addEventListener('pointermove', onDocumentPointerMove)
      document.addEventListener('keydown', captureKey, true)
      document.addEventListener('scroll', onDocumentScroll, true)
      document.addEventListener('pointerdown', onLightDismiss)
      document.addEventListener('keydown', onAccelerator)
      window.addEventListener('winui-flyout-opening', onOtherFlyout)
      window.addEventListener('blur', onWindowBlur)
      window.addEventListener('resize', updatePosition)
    })
    onBeforeUnmount(() => {
      hideDescendantFlyouts(inputRegion)
      unregisterInputRegion()
      isUnmounted = true; generation++; cancelPendingClose(); stopAnimations(); resizeObserver?.disconnect(); themeObserver?.disconnect()
      document.removeEventListener('pointerdown', capturePointer, true)
      document.removeEventListener('pointermove', captureMove, true)
      document.removeEventListener('pointermove', onDocumentPointerMove)
      document.removeEventListener('keydown', captureKey, true)
      document.removeEventListener('scroll', onDocumentScroll, true)
      document.removeEventListener('pointerdown', onLightDismiss)
      document.removeEventListener('keydown', onAccelerator)
      window.removeEventListener('winui-flyout-opening', onOtherFlyout)
      window.removeEventListener('blur', onWindowBlur)
      window.removeEventListener('resize', updatePosition)
      portal.remove()
    })
    watch(() => owner().Options?.(), () => { if (isOpen.value) void updatePosition() }, { deep: true })
    expose({ ShowAt: showAt, Hide: hide, DelayClose: context.DelayClose, CancelPendingClose: cancelPendingClose, IsDelayCloseTimerRunning: isDelayCloseTimerRunning, IsOpen: isOpen, Target: target, Items: computed(() => items().map(item => item.Api)), Element: presenter })
    return () => h(Fragment, [
      h(Teleport, { to: portal }, [
        isOpen.value && !props.IsSubmenu && ['Standard', 'Auto'].includes(showMode.value) ? h('div', {
          ref: dismissLayer,
          class: ['win-menu-flyout-dismiss-layer', { 'is-visible': options().LightDismissOverlayMode === 'On' }],
          style: { left: `${bounds.value.left}px`, top: `${bounds.value.top}px`, width: `${bounds.value.width}px`, height: `${bounds.value.height}px`, zIndex: nestedLayers.value?.overlay, pointerEvents: options().OverlayInputPassThroughElement ? 'none' : undefined },
          onPointerdown: (event: PointerEvent) => { event.preventDefault(); hide() }
        }) : null,
        isPresent.value ? withDirectives(h('div', {
        ref: presenter,
        class: ['win-menu-flyout-presenter', themeClass.value, { 'win-menu-submenu-presenter': props.IsSubmenu, 'is-positioning': !isPositioned.value, 'is-opening': isOpening.value, 'is-closing': !isOpen.value }],
        style: style.value, dir: direction.value, role: 'menu', tabindex: -1,
        onKeydown: onKeyDown, onPointermove: onPointerMove,
        onPointerenter: cancelPendingClose, onPointerleave: () => { if (props.IsSubmenu) context.DelayClose() },
        onPointercancel: clearPointer, onLostpointercapture: clearPointer
      }, [
        // The official presenter background overlays its DesktopAcrylicBackdrop.
        withDirectives(h('div', { class: 'win-menu-flyout-material-layer', 'data-menu-material': 'SystemBackdrop', style: backdropStyle.value, 'aria-hidden': true }), [[vAcrylicBrush, backdropStyle.value, undefined, { 'no-backdrop': true }]]),
        withDirectives(h('div', { class: 'win-menu-flyout-material-layer', 'data-menu-material': 'Background', style: backgroundStyle.value, 'aria-hidden': true }), [[vAcrylicBrush, backgroundStyle.value, undefined, { 'no-backdrop': true }]]),
        h(ScrollViewer, {
        class: 'win-menu-flyout-scroll', ...scrollSettings(), IsTabStop: 'False'
      }, { default: () => h('div', { ref: contentMount, class: 'win-menu-flyout-items-presenter' }) })]), [
        [vAcrylicBackdrop, [backdropStyle.value, backgroundStyle.value]],
        // MenuFlyoutPresenter_Partial.cpp applies the drop shadow to the presenter.
        [vThemeShadow, { Translation: 32 + 8 * depth, Theme: effectiveTheme.value, Enabled: enabled(options().PresenterStyle?.IsDefaultShadowEnabled) }]
      ]) : null]),
      h(Teleport, { to: contentTarget.value }, slots.default?.() ?? [])
    ])
  }
})
