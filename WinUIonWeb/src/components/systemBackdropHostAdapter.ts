import { cloneSystemBackdropConfig, SystemBackdrop, toSystemBackdropConfig, type SystemBackdropConfig, type SystemBackdropType } from './systemBackdrop'
import type { TitleBarWindowHost } from './titleBarHostAdapter'

export const systemBackdropHostAdapterKey = Symbol.for('WinUI.SystemBackdropHostAdapter')
export type SystemBackdropTheme = 'Default' | 'Light' | 'Dark'
export type SystemBackdropFallbackReason = 'NativeBackdropUnavailable' | 'MaterialUnsupported' | 'Inactive' | 'HighContrast' | 'TransparencyDisabled' | 'EnergySaver' | 'HostError'
export type SystemBackdropTargetKind = 'Window' | 'Surface'
type Awaitable<T> = T | Promise<T>

export interface SystemBackdropState {
  Status: 'Active' | 'Fallback' | 'HighContrast' | 'Closed'
  RequestedBackdrop: SystemBackdropConfig | null
  AppliedBackdrop: SystemBackdropConfig | null
  RequestedTheme: SystemBackdropTheme
  Theme: 'Light' | 'Dark'
  IsInputActive: boolean
  Reason?: SystemBackdropFallbackReason
  Error?: unknown
}

export interface SystemBackdropConfiguration {
  Theme: 'Light' | 'Dark'
  IsInputActive: boolean
  IsHighContrast: boolean
  IsTransparencyEnabled: boolean
  IsEnergySaverEnabled: boolean
  /** Optional exact fallback supplied by the native material controller. */
  FallbackColor?: string
}

export interface SystemBackdropCapabilities {
  /** True only when the host actually exposes the desktop compositor. */
  NativeSystemBackdrop: boolean
  SupportedMaterials: readonly SystemBackdropType[]
  SupportedMicaKinds?: readonly ('Base' | 'BaseAlt')[]
  SupportedDesktopAcrylicKinds?: readonly ('Base' | 'Thin')[]
  /** True only when this host supports real content extension into its caption. */
  ExtendsContentIntoTitleBar?: boolean
}

export interface SystemBackdropHostEvent {
  Type: 'Activated' | 'Closed' | 'CapabilitiesChanged' | 'ConfigurationChanged'
  IsInputActive?: boolean
}

/** The adapter owns its actual browser/native window or backdrop surface. */
export interface SystemBackdropHostTarget {
  Id: string | number
  /** Opaque association supplied by a native host for this existing window. */
  NativeAssociationToken?: string
  /** Actual caption ownership and safe geometry, carried into the content runtime. */
  TitleBarHost?: TitleBarWindowHost
  Content: HTMLElement
  Window?: Window | null
  Kind: SystemBackdropTargetKind
  Subscribe?(listener: (event: SystemBackdropHostEvent) => void): () => void
  SetContentElement?(element: HTMLElement): void
  /** Activate the actual native window; browsers use their real focus API. */
  Activate?(): Awaitable<void>
  Dispose?(): Awaitable<void>
  Close(): Awaitable<void>
}

export interface SystemBackdropWindowOptions {
  title: string
  width?: number
  height?: number
  /** Native Window.ExtendsContentIntoTitleBar request, never simulated browser chrome. */
  extendsContentIntoTitleBar?: boolean
  theme?: SystemBackdropTheme
  backdrop?: unknown
  adapter?: SystemBackdropHostAdapter
  signal?: AbortSignal
  /** React, Vue, Angular and Svelte can all mount into this stable DOM host. */
  mountContent?: (element: HTMLElement, handle: SystemBackdropWindowHandle) => void | (() => Awaitable<void>)
}

export interface SystemBackdropExistingWindowOptions extends Pick<SystemBackdropWindowOptions, 'theme' | 'backdrop' | 'adapter' | 'signal' | 'mountContent'> {
  /** The persisted identity of this window, without opening a replacement. */
  id?: string | number
  /** Real native association only; browser window IDs are not native tokens. */
  nativeAssociationToken?: string
}

export interface SystemBackdropHostAdapter {
  /** Invoke the actual open synchronously when browser user activation is required. */
  CreateWindow(options: SystemBackdropWindowOptions): Awaitable<SystemBackdropHostTarget>
  /** Reconnect this content's existing window; must never open a replacement. */
  AttachWindow?(element: HTMLElement, options: SystemBackdropExistingWindowOptions): Awaitable<SystemBackdropHostTarget>
  ConnectSurface?(element: HTMLElement): Awaitable<SystemBackdropHostTarget>
  GetCapabilities(target: SystemBackdropHostTarget): Awaitable<SystemBackdropCapabilities>
  /** Native accessibility, energy and transparency policy, when available. */
  GetConfiguration?(target: SystemBackdropHostTarget): Awaitable<Partial<SystemBackdropConfiguration>>
  /** Return true only after the requested native effect has actually been applied. */
  ApplyBackdrop(target: SystemBackdropHostTarget, backdrop: SystemBackdropConfig | null, configuration: SystemBackdropConfiguration): Awaitable<boolean>
  SetTheme?(target: SystemBackdropHostTarget, theme: SystemBackdropTheme): Awaitable<void>
}

export interface SystemBackdropWindowHandle {
  readonly Id: string | number
  readonly NativeAssociationToken?: string
  readonly TitleBarHost?: TitleBarWindowHost
  readonly Content: HTMLElement
  readonly Window: Window | null
  readonly State: SystemBackdropState
  SetSystemBackdrop(backdrop: unknown): Promise<SystemBackdropState>
  SetTheme(theme: SystemBackdropTheme): Promise<SystemBackdropState>
  SetContentElement(element: HTMLElement): Promise<SystemBackdropState>
  Subscribe(listener: (state: SystemBackdropState) => void): () => void
  Activate(): Promise<void>
  /** Release the material connection without closing an existing window. */
  Dispose(): Promise<void>
  Close(): Promise<void>
}

export class SystemBackdropWindowError extends Error {
  constructor(readonly Code: 'PopupBlocked' | 'HostUnavailable' | 'HostError' | 'MountFailed', message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'SystemBackdropWindowError'
  }
}

let installedAdapter: SystemBackdropHostAdapter | undefined
export function setSystemBackdropHostAdapter(adapter: SystemBackdropHostAdapter | undefined): () => void {
  const previous = installedAdapter
  installedAdapter = adapter
  return () => { if (installedAdapter === adapter) installedAdapter = previous }
}
export function getSystemBackdropHostAdapter(): SystemBackdropHostAdapter | undefined { return installedAdapter }

let nextWindowId = 0
const browserWindowTargets = new WeakSet<SystemBackdropHostTarget>()
interface BackdropStyleOwnership {
  Content: HTMLElement
  Background: string
  Color: string
  State?: string
  OwnedBackground?: string
  OwnedColor?: string
  OwnedState?: string
}
interface BrowserWindowContext {
  Document: Document
  Content?: HTMLElement
  Theme: SystemBackdropTheme
  Backdrop: SystemBackdropConfig | null
  Listeners: Map<object, () => void>
  Styles?: BackdropStyleOwnership
  Revision: number
  Release(): void
}
type BrowserContextWindow = Window & { __winuiBackdropWindowContextsV1?: Map<string | number, BrowserWindowContext> }
const backdropEquals = (left: SystemBackdropConfig | null, right: SystemBackdropConfig | null) =>
  left === right || left !== null && right !== null && ['Type', 'Kind', 'FallbackColor', 'TintColor', 'TintOpacity', 'LuminosityOpacity'].every(key => left[key as keyof SystemBackdropConfig] === right[key as keyof SystemBackdropConfig])
const browserCapabilities: SystemBackdropCapabilities = { NativeSystemBackdrop: false, SupportedMaterials: [], ExtendsContentIntoTitleBar: false }
const captureBackdropStyles = (Content: HTMLElement): BackdropStyleOwnership => ({ Content, Background: Content.style.background, Color: Content.style.color, State: Content.dataset.systemBackdropState })
const restoreBackdropStyles = (styles: BackdropStyleOwnership) => {
  const content = styles.Content
  if (styles.OwnedBackground !== undefined && content.style.background === styles.OwnedBackground) content.style.background = styles.Background
  if (styles.OwnedColor !== undefined && content.style.color === styles.OwnedColor) content.style.color = styles.Color
  if (styles.OwnedState !== undefined && content.dataset.systemBackdropState === styles.OwnedState) {
    if (styles.State === undefined) delete content.dataset.systemBackdropState
    else content.dataset.systemBackdropState = styles.State
  }
}
const setBrowserContextContent = (context: BrowserWindowContext, element: HTMLElement) => {
  if (context.Content === element) return false
  if (context.Styles) restoreBackdropStyles(context.Styles)
  context.Content = element
  context.Styles = captureBackdropStyles(element)
  context.Revision++
  return true
}
const notifyBrowserContext = (context: BrowserWindowContext, source: object) => {
  for (const [key, listener] of [...context.Listeners]) if (key !== source) listener()
}

function browserTarget(content: HTMLElement, kind: SystemBackdropTargetKind, browserWindow: Window, id?: string | number): SystemBackdropHostTarget {
  const callbacks = new Set<(event: SystemBackdropHostEvent) => void>()
  const publish = (event: SystemBackdropHostEvent) => { for (const callback of [...callbacks]) callback(event) }
  const focus = () => publish({ Type: 'Activated', IsInputActive: true })
  const blur = () => publish({ Type: 'Activated', IsInputActive: false })
  const closed = () => publish({ Type: 'Closed' })
  let currentDocument = browserWindow.document
  const attach = () => {
    browserWindow.addEventListener('focus', focus)
    browserWindow.addEventListener('blur', blur)
    currentDocument = browserWindow.document
  }
  attach()
  // A sample popup may navigate to load its own framework runtime.  A
  // navigation is not Window.Closed, so use the real Window.closed flag.
  const interval = kind === 'Window' ? window.setInterval(() => {
    if (browserWindow.closed) closed()
    else {
      try {
        if (browserWindow.document !== currentDocument) { attach(); publish({ Type: 'ConfigurationChanged' }) }
        else if (target.Content.ownerDocument !== currentDocument) publish({ Type: 'ConfigurationChanged' })
      } catch { /* A native host may navigate outside the app origin. */ }
    }
  }, 500) : undefined
  const detach = () => {
    browserWindow.removeEventListener('focus', focus)
    browserWindow.removeEventListener('blur', blur)
    if (interval !== undefined) window.clearInterval(interval)
    callbacks.clear()
  }
  const target: SystemBackdropHostTarget = {
    Id: id ?? `browser-backdrop-${++nextWindowId}`, Content: content, Window: browserWindow, Kind: kind,
    Subscribe(listener) { callbacks.add(listener); return () => { callbacks.delete(listener); if (!callbacks.size) detach() } },
    SetContentElement(element) { this.Content = element; attach() },
    Activate() { if (kind === 'Window' && !browserWindow.closed) browserWindow.focus() },
    Close() {
      detach()
      if (kind !== 'Window') return
      if (!browserWindow.closed) browserWindow.close()
      if (browserWindow.closed) {
        const context = (browserWindow as BrowserContextWindow).__winuiBackdropWindowContextsV1?.get(this.Id)
        if (context) {
          for (const listener of [...context.Listeners.values()]) listener()
          context.Listeners.clear()
          context.Release()
        }
      }
    },
    Dispose() { detach() },
  }
  if (kind === 'Window') browserWindowTargets.add(target)
  return target
}

/** Real browser window: unavailable native materials are reported without imitation. */
export function createBrowserSystemBackdropHostAdapter(opener: Window = window): SystemBackdropHostAdapter {
  return {
    CreateWindow(options) {
      const width = Math.max(320, Math.min(4096, Math.round(options.width ?? 640)))
      const height = Math.max(240, Math.min(4096, Math.round(options.height ?? 480)))
      const child = opener.open('about:blank', '_blank', `popup=yes,width=${width},height=${height}`)
      if (!child) throw new SystemBackdropWindowError('PopupBlocked', 'The browser blocked the sample window.')
      const document = child.document
      document.title = options.title
      document.documentElement.lang = opener.document.documentElement.lang
      for (const stylesheet of opener.document.head.querySelectorAll('style, link[rel="stylesheet"]')) {
        const copy = stylesheet.cloneNode(true) as HTMLElement
        if (copy.tagName === 'LINK') (copy as HTMLLinkElement).href = (stylesheet as HTMLLinkElement).href
        document.head.appendChild(copy)
      }
      Object.assign(document.documentElement.style, { height: '100%', overflow: 'hidden' })
      Object.assign(document.body.style, { margin: '0', width: '100%', height: '100%', overflow: 'hidden', background: 'transparent' })
      const content = document.createElement('div')
      content.className = 'win-system-backdrop-window-content win-theme-scope'
      Object.assign(content.style, { width: '100%', height: '100%', minWidth: '0', minHeight: '0', overflow: 'auto', boxSizing: 'border-box' })
      document.body.appendChild(content)
      return browserTarget(content, 'Window', child)
    },
    AttachWindow(element, options) {
      const owner = element.ownerDocument.defaultView
      if (!owner || owner.closed) throw new SystemBackdropWindowError('HostUnavailable', 'The existing backdrop window is unavailable.')
      return browserTarget(element, 'Window', owner, options.id)
    },
    ConnectSurface(element) {
      const owner = element.ownerDocument.defaultView
      if (!owner) throw new SystemBackdropWindowError('HostUnavailable', 'The backdrop surface has no window.')
      return browserTarget(element, 'Surface', owner)
    },
    GetCapabilities: () => browserCapabilities,
    ApplyBackdrop: (_target, backdrop) => backdrop === null,
  }
}

const normalizeTheme = (theme: unknown): SystemBackdropTheme => theme === 'Light' ? 'Light' : theme === 'Dark' ? 'Dark' : 'Default'
const snapshot = (state: SystemBackdropState): SystemBackdropState => ({
  ...state, RequestedBackdrop: cloneSystemBackdropConfig(state.RequestedBackdrop), AppliedBackdrop: cloneSystemBackdropConfig(state.AppliedBackdrop),
})

const nativeFallbackColor = (color: string): string => {
  const value = color.trim()
  const hex = value.match(/^#([\da-f]{2})([\da-f]{6})$/i)
  return hex ? `rgba(${Number.parseInt(hex[2]!.slice(0, 2), 16)}, ${Number.parseInt(hex[2]!.slice(2, 4), 16)}, ${Number.parseInt(hex[2]!.slice(4, 6), 16)}, ${Number.parseInt(hex[1]!, 16) / 255})` : value
}

async function connectTarget(target: SystemBackdropHostTarget, adapter: SystemBackdropHostAdapter, options: Pick<SystemBackdropWindowOptions, 'theme' | 'backdrop' | 'mountContent' | 'signal'>, closeOnFailure = true): Promise<SystemBackdropWindowHandle> {
  const owner = target.Window ?? target.Content.ownerDocument.defaultView
  const reportError = (error: unknown) => ((owner as (Window & { console: Console }) | null)?.console ?? console).error(error)
  const readMedia = () => owner ? ['(prefers-color-scheme: dark)', '(forced-colors: active)', '(prefers-reduced-transparency: reduce)'].map(query => owner.matchMedia(query)) : []
  let media = readMedia()
  const listeners = new Set<(state: SystemBackdropState) => void>()
  let inputActive = target.Kind === 'Window' ? true : owner?.document.hasFocus() ?? true
  let theme = normalizeTheme(options.theme)
  let requested = toSystemBackdropConfig(options.backdrop)
  let closed = false
  let targetClosed = false
  let closePromise: Promise<void> | undefined
  let cleanup: (() => Awaitable<void>) | undefined
  let unsubscribeBackdrop: (() => void) | undefined
  let observedBackdrop: SystemBackdrop | undefined
  let queue = Promise.resolve<SystemBackdropState>({ Status: 'Fallback', RequestedBackdrop: requested, AppliedBackdrop: null, RequestedTheme: theme, Theme: 'Light', IsInputActive: inputActive })
  let state: SystemBackdropState = { Status: 'Fallback', RequestedBackdrop: requested, AppliedBackdrop: null, RequestedTheme: theme, Theme: 'Light', IsInputActive: inputActive }
  let contentStyles = captureBackdropStyles(target.Content)
  const contextSource = {}
  let windowContext: BrowserWindowContext | undefined
  let joinedWindowContext = false
  const announce = () => { for (const listener of [...listeners]) { try { listener(snapshot(state)) } catch (error) { reportError(error) } } }
  const actualTheme = (): 'Light' | 'Dark' => theme === 'Light' || theme === 'Dark' ? theme : media[0]?.matches ? 'Dark' : 'Light'
  const configuration = (): SystemBackdropConfiguration => ({ Theme: actualTheme(), IsInputActive: inputActive, IsHighContrast: media[1]?.matches ?? false, IsTransparencyEnabled: !(media[2]?.matches ?? false), IsEnergySaverEnabled: false })
  const rebindContent = (element: HTMLElement) => {
    if (element === target.Content) return false
    if (!browserWindowTargets.has(target)) restoreBackdropStyles(contentStyles)
    contentStyles = captureBackdropStyles(element)
    target.Content = element
    target.SetContentElement?.(element)
    media.forEach(query => query.removeEventListener('change', updatePolicy))
    media = readMedia()
    media.forEach(query => query.addEventListener('change', updatePolicy))
    return true
  }
  const readWindowIntent = () => {
    if (!windowContext || closed) return false
    const rootChanged = windowContext.Content ? rebindContent(windowContext.Content) : false
    const intentChanged = theme !== windowContext.Theme || !backdropEquals(requested, windowContext.Backdrop)
    theme = windowContext.Theme
    if (!backdropEquals(requested, windowContext.Backdrop)) {
      if (observedBackdrop && backdropEquals(observedBackdrop.ToConfig(), windowContext.Backdrop)) requested = cloneSystemBackdropConfig(windowContext.Backdrop)
      else observeBackdrop(windowContext.Backdrop)
    }
    return rootChanged || intentChanged
  }
  const contextChanged = () => {
    if (owner?.closed) { void close(false).catch(reportError); return }
    if (readWindowIntent()) void apply(false)
  }
  const joinWindowContext = () => {
    if (!browserWindowTargets.has(target) || !owner || closed) return
    const hostWindow = owner as BrowserContextWindow
    const contexts = hostWindow.__winuiBackdropWindowContextsV1 ??= new Map()
    let context = contexts.get(target.Id)
    if (!context || context.Document !== owner.document) {
      const contextId = target.Id
      context = { Document: owner.document, Theme: theme, Backdrop: cloneSystemBackdropConfig(requested), Listeners: new Map(), Revision: 0,
        Release() {
          if (this.Listeners.size) return
          if (this.Styles) restoreBackdropStyles(this.Styles)
          if (contexts.get(contextId) === this) contexts.delete(contextId)
          this.Content = undefined
          this.Styles = undefined
        },
      }
      contexts.set(target.Id, context)
    }
    if (context !== windowContext) {
      if (windowContext && windowContext.Document !== owner.document) windowContext.Listeners.clear()
      windowContext?.Listeners.delete(contextSource)
      windowContext?.Release()
      windowContext = context
    }
    context.Listeners.set(contextSource, contextChanged)
    // During navigation the new runtime supplies the first live content root.
    // Requests made by the opener before that root exists remain in this context.
    if ((!context.Content || !joinedWindowContext && !closeOnFailure) && target.Content.ownerDocument === owner.document) {
      setBrowserContextContent(context, target.Content)
      notifyBrowserContext(context, contextSource)
    }
    joinedWindowContext = true
    return readWindowIntent()
  }
  const publishWindowIntent = () => {
    if (!windowContext) return
    let changed = windowContext.Theme !== theme || !backdropEquals(windowContext.Backdrop, requested)
    if (target.Content.ownerDocument === windowContext.Document) changed = setBrowserContextContent(windowContext, target.Content) || changed
    windowContext.Theme = theme
    windowContext.Backdrop = cloneSystemBackdropConfig(requested)
    if (changed) { windowContext.Revision++; notifyBrowserContext(windowContext, contextSource) }
  }
  const apply = (joinContext = true): Promise<SystemBackdropState> => {
    if (joinContext) joinWindowContext()
    const context = windowContext, contextRevision = context?.Revision
    const backdrop = cloneSystemBackdropConfig(requested), requestedTheme = theme
    let config = configuration()
    queue = queue.catch(() => snapshot(state)).then(async () => {
      if (closed || context && (context !== windowContext || context.Revision !== contextRevision)) return snapshot(state)
      let reason: SystemBackdropFallbackReason | undefined
      let error: unknown
      let applied: SystemBackdropConfig | null = null
      let nativeBackdropAvailable = false
      let nativeControllerConnected = false
      try {
        const nativePolicy = await adapter.GetConfiguration?.(target)
        if (nativePolicy) config = { ...config, ...Object.fromEntries(Object.entries(nativePolicy).filter(([, value]) => value !== undefined)), ...(requestedTheme === 'Default' ? {} : { Theme: requestedTheme }) }
        const capabilities = await adapter.GetCapabilities(target)
        nativeBackdropAvailable = capabilities.NativeSystemBackdrop
        const supported = !backdrop || capabilities.SupportedMaterials.includes(backdrop.Type)
          && (backdrop.Type !== 'Mica' || !capabilities.SupportedMicaKinds || capabilities.SupportedMicaKinds.includes(backdrop.Kind))
          && (backdrop.Type !== 'DesktopAcrylic' || !capabilities.SupportedDesktopAcrylicKinds || capabilities.SupportedDesktopAcrylicKinds.includes(backdrop.Kind))
        if (backdrop && !capabilities.NativeSystemBackdrop) reason = 'NativeBackdropUnavailable'
        else if (backdrop && config.IsHighContrast) reason = 'HighContrast'
        else if (backdrop && !config.IsTransparencyEnabled) reason = 'TransparencyDisabled'
        else if (backdrop && config.IsEnergySaverEnabled) reason = 'EnergySaver'
        else if (backdrop && !supported) reason = 'MaterialUnsupported'
        else if (backdrop && !config.IsInputActive) reason = 'Inactive'
        if (closed) return snapshot(state)
        await adapter.SetTheme?.(target, requestedTheme)
        if (closed) return snapshot(state)
        // A supported native controller keeps its target while its policy
        // selects the official inactive/high-contrast fallback. Clearing the
        // material on blur would discard the controller's own fallback.
        const hostBackdrop = capabilities.NativeSystemBackdrop && supported ? backdrop : null
        if (await adapter.ApplyBackdrop(target, hostBackdrop, config)) {
          nativeControllerConnected = Boolean(hostBackdrop)
          applied = reason ? null : backdrop
        }
        else {
          if (!reason) reason = 'MaterialUnsupported'
          await adapter.ApplyBackdrop(target, null, config)
        }
      } catch (failure) {
        reason = 'HostError'; error = failure
        try { await adapter.ApplyBackdrop(target, null, config) } catch { /* Preserve the original host failure. */ }
      }
      if (closed || context && (context !== windowContext || context.Revision !== contextRevision)) return snapshot(state)
      // Desktop materials belong to the native compositor. Browsers report
      // unavailability and keep this surface transparent; a native host owns
      // its fallback or supplies the controller's exact fallback color.
      const fallback = Boolean(backdrop && !applied)
      const hasCurrentContent = !context || context.Content === target.Content
      const styles = context?.Styles ?? contentStyles
      if (hasCurrentContent) {
        target.Content.style.background = nativeControllerConnected && fallback && config.FallbackColor ? nativeFallbackColor(config.FallbackColor) : 'transparent'
        target.Content.style.color = nativeBackdropAvailable && config.IsHighContrast ? 'CanvasText' : ''
        styles.OwnedBackground = target.Content.style.background
        styles.OwnedColor = target.Content.style.color
      }
      if (hasCurrentContent && target.Kind === 'Window') {
        target.Content.classList.toggle('theme-dark', config.Theme === 'Dark')
        target.Content.classList.toggle('theme-light', config.Theme === 'Light')
        target.Content.dataset.theme = config.Theme.toLowerCase()
        const documentRoot = target.Content.ownerDocument.documentElement
        documentRoot.classList.toggle('theme-dark', config.Theme === 'Dark')
        documentRoot.classList.toggle('theme-light', config.Theme === 'Light')
        documentRoot.dataset.theme = config.Theme.toLowerCase()
      }
      const highContrastBackdrop = nativeBackdropAvailable && config.IsHighContrast
      if (hasCurrentContent) {
        target.Content.dataset.systemBackdropState = highContrastBackdrop ? 'HighContrast' : fallback ? 'Fallback' : 'Active'
        styles.OwnedState = target.Content.dataset.systemBackdropState
      }
      state = {
        Status: highContrastBackdrop ? 'HighContrast' : fallback ? 'Fallback' : 'Active',
        RequestedBackdrop: backdrop, AppliedBackdrop: applied, RequestedTheme: requestedTheme,
        Theme: config.Theme, IsInputActive: config.IsInputActive,
        ...(reason ? { Reason: reason } : {}), ...(error === undefined ? {} : { Error: error }),
      }
      announce()
      return snapshot(state)
    })
    return queue
  }
  const refreshWindowContext = () => { if (joinWindowContext()) void apply(false) }
  const updatePolicy = () => { void apply() }
  media.forEach(query => query.addEventListener('change', updatePolicy))
  let detachTarget: (() => void) | undefined = undefined
  const closeActualTarget = async () => {
    if (targetClosed) return
    targetClosed = true
    await target.Close()
  }
  const close = (closeTarget: boolean): Promise<void> => {
    if (closePromise) return closeTarget ? closePromise.then(closeActualTarget) : closePromise
    let resolveClose!: () => void
    let rejectClose!: (error: unknown) => void
    closePromise = new Promise<void>((resolve, reject) => { resolveClose = resolve; rejectClose = reject })
    closed = true
    state = { ...state, Status: 'Closed', AppliedBackdrop: null }
    announce()
    listeners.clear()
    media.forEach(query => query.removeEventListener('change', updatePolicy))
    options.signal?.removeEventListener('abort', abort)
    unsubscribeBackdrop?.()
    windowContext?.Listeners.delete(contextSource)
    windowContext?.Release()
    windowContext = undefined
    detachTarget?.()
    void (async () => {
      await queue.catch(() => undefined)
      try {
        await adapter.ApplyBackdrop(target, null, configuration())
      } finally {
        if (!browserWindowTargets.has(target) && (target.Kind === 'Surface' || !closeTarget)) restoreBackdropStyles(contentStyles)
        try { await cleanup?.() }
        finally {
          try { await target.Dispose?.() }
          finally { if (closeTarget || target.Kind === 'Surface') await closeActualTarget() }
        }
      }
    })().then(resolveClose, rejectClose)
    return closePromise
  }
  const handle: SystemBackdropWindowHandle = {
    Id: target.Id, NativeAssociationToken: target.NativeAssociationToken, TitleBarHost: target.TitleBarHost, get Content() { refreshWindowContext(); return target.Content }, Window: target.Window ?? null,
    get State() { refreshWindowContext(); return snapshot(state) },
    SetSystemBackdrop(backdrop) { if (closed) return Promise.resolve(snapshot(state)); joinWindowContext(); observeBackdrop(backdrop); publishWindowIntent(); return apply(false) },
    SetTheme(value) { if (closed) return Promise.resolve(snapshot(state)); joinWindowContext(); theme = normalizeTheme(value); publishWindowIntent(); return apply(false) },
    SetContentElement(element) {
      if (closed) return Promise.resolve(snapshot(state))
      if (element.ownerDocument.defaultView !== owner) return Promise.reject(new TypeError('Window.Content must belong to the host window.'))
      joinWindowContext()
      rebindContent(element)
      // Loading the destination framework runtime replaces its Document.
      // MatchMedia objects from the initial about:blank document must not own
      // policy subscriptions for the new content document.
      media.forEach(query => query.removeEventListener('change', updatePolicy))
      media = readMedia()
      media.forEach(query => query.addEventListener('change', updatePolicy))
      if (!windowContext) joinWindowContext()
      publishWindowIntent()
      return apply(false)
    },
    Subscribe(listener) { if (!closed) listeners.add(listener); listener(snapshot(state)); return () => listeners.delete(listener) },
    async Activate() {
      if (closed || target.Kind !== 'Window') return
      if (target.Activate) await target.Activate()
      else if (target.Window && owner && !owner.closed && typeof owner.focus === 'function') owner.focus()
      else throw new SystemBackdropWindowError('HostUnavailable', 'The host cannot activate this native window.')
    },
    Dispose: () => close(false),
    Close: () => close(true),
  }
  const observeBackdrop = (backdrop: unknown) => {
    unsubscribeBackdrop?.()
    requested = toSystemBackdropConfig(backdrop)
    const watchedBackdrop = backdrop instanceof SystemBackdrop ? backdrop : undefined
    observedBackdrop = watchedBackdrop
    unsubscribeBackdrop = watchedBackdrop?.Subscribe(() => {
      joinWindowContext()
      if (observedBackdrop !== watchedBackdrop) return
      requested = watchedBackdrop.ToConfig()
      publishWindowIntent()
      void apply(false)
    })
  }
  const abort = () => { void close(closeOnFailure).catch(reportError) }
  try {
    if (options.signal?.aborted) throw new SystemBackdropWindowError('HostUnavailable', 'The backdrop host connection was cancelled.')
    observeBackdrop(options.backdrop)
    options.signal?.addEventListener('abort', abort, { once: true })
    detachTarget = target.Subscribe?.(event => {
      if (event.Type === 'Closed') { void close(false).catch(reportError); return }
      if (event.Type === 'Activated') inputActive = event.IsInputActive ?? true
      updatePolicy()
    })
    if (closed) detachTarget?.()
    await apply()
    if (closed) throw new SystemBackdropWindowError('HostUnavailable', 'The backdrop host closed before content mounted.')
    const mounted = options.mountContent?.(target.Content, handle)
    if (typeof mounted === 'function') cleanup = mounted
    if (closed) throw new SystemBackdropWindowError('HostUnavailable', 'The backdrop host closed before content mounted.')
    return handle
  } catch (error) {
    await close(closeOnFailure)
    if (error instanceof SystemBackdropWindowError) throw error
    throw new SystemBackdropWindowError('MountFailed', 'The sample content could not be mounted.', { cause: error })
  }
}

/** Create a real window; invokes the host before awaiting so popup activation survives. */
export async function createSystemBackdropWindow(options: SystemBackdropWindowOptions): Promise<SystemBackdropWindowHandle> {
  const adapter = options.adapter ?? installedAdapter ?? createBrowserSystemBackdropHostAdapter()
  if (options.signal?.aborted) throw new SystemBackdropWindowError('HostUnavailable', 'The system backdrop window request was cancelled.')
  let target: SystemBackdropHostTarget
  let creation: Awaitable<SystemBackdropHostTarget>
  try { creation = adapter.CreateWindow(options) }
  catch (error) {
    if (error instanceof SystemBackdropWindowError) throw error
    throw new SystemBackdropWindowError('HostError', 'The system backdrop host could not create a window.', { cause: error })
  }
  try { target = await (options.signal ? awaitWithAbort(Promise.resolve(creation), options.signal) : creation) }
  catch (error) {
    if (options.signal?.aborted) {
      void Promise.resolve(creation).then(async late => { try { await late.Dispose?.() } finally { await late.Close() } }).catch(() => undefined)
      throw new SystemBackdropWindowError('HostUnavailable', 'The system backdrop window request was cancelled.', { cause: error })
    }
    if (error instanceof SystemBackdropWindowError) throw error
    throw new SystemBackdropWindowError('HostError', 'The system backdrop host could not create a window.', { cause: error })
  }
  if (options.signal?.aborted) {
    try { await target.Dispose?.() } finally { await target.Close() }
    throw new SystemBackdropWindowError('HostUnavailable', 'The system backdrop window request was cancelled.')
  }
  return connectTarget(target, adapter, options)
}

/** Restore an existing framework window after reload, without calling window.open. */
export async function attachSystemBackdropWindow(element: HTMLElement, options: SystemBackdropExistingWindowOptions = {}): Promise<SystemBackdropWindowHandle> {
  const owner = element.ownerDocument.defaultView
  if (!element.isConnected || !owner || owner.closed) throw new SystemBackdropWindowError('HostUnavailable', 'The existing backdrop window must have a live content root.')
  if (options.signal?.aborted) throw new SystemBackdropWindowError('HostUnavailable', 'The existing backdrop window connection was cancelled.')
  const requestedAdapter = options.adapter ?? installedAdapter
  if (options.nativeAssociationToken && !requestedAdapter) throw new SystemBackdropWindowError('HostUnavailable', 'The native host is unavailable for the existing backdrop window.')
  const adapter = requestedAdapter ?? createBrowserSystemBackdropHostAdapter(owner)
  if (!adapter.AttachWindow) throw new SystemBackdropWindowError('HostUnavailable', 'The host does not support reconnecting an existing backdrop window.')
  let connection: Awaitable<SystemBackdropHostTarget>
  try { connection = adapter.AttachWindow(element, options) }
  catch (error) {
    if (error instanceof SystemBackdropWindowError) throw error
    throw new SystemBackdropWindowError('HostError', 'The host could not reconnect the existing backdrop window.', { cause: error })
  }
  let target: SystemBackdropHostTarget
  try { target = await (options.signal ? awaitWithAbort(Promise.resolve(connection), options.signal) : connection) }
  catch (error) {
    if (options.signal?.aborted) {
      // The window predates this request. Release the late connection, leaving
      // its actual window available for a later attempt.
      void Promise.resolve(connection).then(late => late.Dispose?.()).catch(() => undefined)
      throw new SystemBackdropWindowError('HostUnavailable', 'The existing backdrop window connection was cancelled.', { cause: error })
    }
    if (error instanceof SystemBackdropWindowError) throw error
    throw new SystemBackdropWindowError('HostError', 'The host could not reconnect the existing backdrop window.', { cause: error })
  }
  if (!element.isConnected || owner.closed || options.signal?.aborted) {
    await target.Dispose?.()
    throw new SystemBackdropWindowError('HostUnavailable', 'The existing backdrop window left the live visual tree.')
  }
  if (target.Kind !== 'Window' || target.Content.ownerDocument.defaultView !== owner || target.Window && target.Window !== owner) {
    await target.Dispose?.()
    throw new SystemBackdropWindowError('HostUnavailable', 'The host must reconnect the supplied existing window.')
  }
  try {
    target.Content = element
    target.SetContentElement?.(element)
  } catch (error) {
    await target.Dispose?.()
    throw new SystemBackdropWindowError('HostError', 'The host could not reconnect the existing content root.', { cause: error })
  }
  if (!element.isConnected || owner.closed || options.signal?.aborted) {
    await target.Dispose?.()
    throw new SystemBackdropWindowError('HostUnavailable', 'The existing backdrop window connection was cancelled or detached.')
  }
  return connectTarget(target, adapter, options, false)
}

function awaitWithAbort<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) return Promise.reject(signal.reason)
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason)
    signal.addEventListener('abort', abort, { once: true })
    promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', abort))
  })
}

/** Connect only while the FrameworkElement is in the live DOM tree. */
export async function createSystemBackdropSurface(element: HTMLElement, options: Pick<SystemBackdropWindowOptions, 'theme' | 'backdrop' | 'adapter' | 'signal'> = {}): Promise<SystemBackdropWindowHandle> {
  if (!element.isConnected) throw new SystemBackdropWindowError('HostUnavailable', 'The backdrop surface must be in the live visual tree.')
  if (options.signal?.aborted) throw new SystemBackdropWindowError('HostUnavailable', 'The backdrop surface connection was cancelled.')
  const requestedAdapter = options.adapter ?? installedAdapter
  const adapter = requestedAdapter?.ConnectSurface ? requestedAdapter : createBrowserSystemBackdropHostAdapter(element.ownerDocument.defaultView ?? window)
  const creation = Promise.resolve(adapter.ConnectSurface!(element))
  let target: SystemBackdropHostTarget
  try { target = await (options.signal ? awaitWithAbort(creation, options.signal) : creation) }
  catch (error) {
    if (options.signal?.aborted) {
      void creation.then(async late => { try { await late.Dispose?.() } finally { await late.Close() } }).catch(() => undefined)
      throw new SystemBackdropWindowError('HostUnavailable', 'The backdrop surface connection was cancelled.', { cause: error })
    }
    throw error
  }
  if (!element.isConnected || options.signal?.aborted) {
    try { await target.Dispose?.() } finally { await target.Close() }
    throw new SystemBackdropWindowError('HostUnavailable', 'The backdrop surface left the live visual tree.')
  }
  return connectTarget(target, adapter, options)
}
