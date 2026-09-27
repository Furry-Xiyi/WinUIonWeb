import {
  createTabViewHostAdapter,
  type TabViewHostAdapter,
  type TabViewHostCancelled,
  type TabViewHostDestination,
  type TabViewHostResult,
  type TabViewHostSource,
  type TabViewHostMoveRequest,
  type TabViewSplitEdge,
} from './tabViewHostAdapter'
import { createTabViewPwaNativeTransport } from './tabViewPwaNativeDrag'
import type { TabViewNativeDragBridge } from './tabViewNativeDragBridge'
import { getTabViewPwaBroker } from './tabViewPwaBroker'

export const tabViewPwaHostKey = Symbol.for('WinUI.TabViewPwaHost')
export const tabViewPwaSessionKey = Symbol.for('WinUI.TabViewPwaSession')
export const tabViewPwaWindowParameter = 'winui-tabview-window'

/** A document crosses windows as data. Its visual tree is created in its own window. */
export interface TabViewPwaDocument {
  Id: string
  Header: string
  Title: string
  IsOn: boolean
  Icon?: string
}
export type TabViewPwaDisplayMode = 'browser' | 'standalone' | 'minimal-ui' | 'fullscreen' | 'window-controls-overlay'
export interface TabViewPwaPane {
  Id: string
  Source: TabViewHostSource<TabViewPwaDocument>
  Dispose?(): void | Promise<void>
}
export interface TabViewPwaSessionOptions {
  /** Materialize incoming DTOs as framework-local reactive data, preserving local writes. */
  RealizeDocument?(Document: TabViewPwaDocument): TabViewPwaDocument
  CreateSplit?(Edge: TabViewSplitEdge, Signal?: AbortSignal): TabViewPwaPane | TabViewHostCancelled | Promise<TabViewPwaPane | TabViewHostCancelled>
}
export interface TabViewPwaSession {
  Id: string
  Locale: string
  Theme: 'Light' | 'Dark' | 'Default'
  readonly InitialDocuments: readonly TabViewPwaDocument[]
  readonly InitialSelectedId: string | null
  /** Call after the child root and its document source are mounted. */
  Ready(Source: TabViewHostSource<TabViewPwaDocument>, Options?: TabViewPwaSessionOptions): () => void
}
export interface TabViewPwaCapabilities {
  CurrentDisplayMode: TabViewPwaDisplayMode
  IsInstalledApp: boolean
  WindowOpenSupported: boolean
  WindowOpenStatus: 'NotRequested' | 'Opening' | 'Ready' | 'Blocked' | 'Cancelled' | 'Failed'
  LastWindowDisplayMode: TabViewPwaDisplayMode | null
  ChildReady: boolean
  SameOriginCommunication: boolean
  ApplicationSplit: boolean
  LastWindowApplicationSplit: boolean
  /** A child accepted serialized documents through its mounted source. */
  ConfirmedWindowTransfer: boolean
  /** The current window has registered DTO sources for authenticated native Drop. */
  NativeCrossWindowDrag: boolean
  LastWindowNativeCrossWindowDrag: boolean
  NativeTabSplit: false
  NativeWindowTearOut: false
  LiveWindowCount: number
}
export interface TabViewPwaHostOptions {
  Window?: Window
  BaseUrl?: string
  /** Shared deployment root for differently routed framework windows. */
  ApplicationScope?: string
  Locale?: string | (() => string)
  Theme?: 'Light' | 'Dark' | 'Default' | (() => 'Light' | 'Dark' | 'Default')
  ReadyTimeoutMs?: number
}
export interface TabViewPwaHost {
  Adapter: TabViewHostAdapter<TabViewPwaDocument>
  NativeDragBridge: TabViewNativeDragBridge<TabViewPwaDocument>
  readonly Capabilities: TabViewPwaCapabilities
  Subscribe(Listener: (Capabilities: TabViewPwaCapabilities) => void): () => void
  Dispose(): Promise<void>
}

interface WindowBridge {
  Token: string
  ReadDocuments(): TabViewPwaDocument[]
  WriteDocuments(Documents: readonly TabViewPwaDocument[]): void
  ReadSelectedId(): string | null
  WriteSelectedId(Id: string | null): void
  CreateSplit?: TabViewPwaSessionOptions['CreateSplit']
}
type HostWindow = Window & { __winuiTabViewPwaBridgeV1?: WindowBridge }
type LaunchRecord = {
  Version: 2; Token: string; Origin: string; Created: number; Updated: number
  Locale: string; Theme: 'Light' | 'Dark' | 'Default'; Documents: TabViewPwaDocument[]; SelectedId: string | null
  State: 'Opening' | 'Ready' | 'Suspended'; WindowId?: string
  DisplayMode?: TabViewPwaDisplayMode
  LastTransaction?: string
}
const changedEvent = 'winui-tabview-pwa-host-changed'
const readyMessage = 'WinUI.TabView.Pwa.Ready.v1'
const unavailableMessage = 'WinUI.TabView.Pwa.Unavailable.v1'
const cancelled = (Reason: TabViewHostCancelled['Reason'], Error?: unknown): TabViewHostCancelled => ({
  Status: 'Cancelled', Reason, ...(Error === undefined ? {} : { Error }),
})

/** Registers a real launch before navigation; also supports an installed app launched without an opener. */
export function prepareTabViewPwaLaunchSession(Owner: Window, Options: {
  Token?: string; Locale?: string; Theme?: 'Light' | 'Dark' | 'Default'
  Documents?: readonly TabViewPwaDocument[]; SelectedId?: string | null
} = {}): string {
  const token = Options.Token ?? globalThis.crypto.randomUUID()
  const broker = getTabViewPwaBroker(Owner)
  if (broker.Available) broker.Write(`session:${token}`, { Version: 2, Token: token, Origin: Owner.location.origin,
    Created: Date.now(), Updated: Date.now(), Locale: Options.Locale ?? Owner.navigator.language,
    Theme: Options.Theme ?? 'Default', Documents: cloneTabViewPwaDocuments(Options.Documents ?? []),
    SelectedId: Options.SelectedId ?? Options.Documents?.[0]?.Id ?? null, State: 'Opening' } satisfies LaunchRecord)
  return token
}

/** Deliberately rejects visual trees, component objects and arbitrary extra fields. */
export function cloneTabViewPwaDocuments(Documents: readonly TabViewPwaDocument[]): TabViewPwaDocument[] {
  if (!Array.isArray(Documents)) throw new TypeError('TabView documents must be an array.')
  const ids = new Set<string>()
  return Documents.map(document => {
    if (!document || typeof document !== 'object' || typeof document.Id !== 'string' || !document.Id ||
      typeof document.Header !== 'string' || typeof document.Title !== 'string' || typeof document.IsOn !== 'boolean' ||
      document.Icon !== undefined && typeof document.Icon !== 'string' ||
      Object.keys(document).some(key => !['Id', 'Header', 'Title', 'IsOn', 'Icon'].includes(key)) || ids.has(document.Id)) {
      throw new TypeError('TabView windows accept unique serializable document descriptors.')
    }
    ids.add(document.Id)
    return { Id: document.Id, Header: document.Header, Title: document.Title, IsOn: document.IsOn,
      ...(document.Icon === undefined ? {} : { Icon: document.Icon }) }
  })
}

export function readTabViewPwaDisplayMode(Owner: Window): TabViewPwaDisplayMode {
  for (const mode of ['window-controls-overlay', 'standalone', 'minimal-ui', 'fullscreen'] as const) {
    if (Owner.matchMedia?.(`(display-mode: ${mode})`).matches) return mode
  }
  if ((Owner.navigator as Navigator & { standalone?: boolean })?.standalone) return 'standalone'
  return 'browser'
}

/** Read only a same-origin child session; the parent still verifies source and nonce. */
export function readTabViewPwaSession(Owner: Window = window): TabViewPwaSession | undefined {
  const url = new URL(Owner.location.href)
  const token = url.searchParams.get(tabViewPwaWindowParameter)
  if (!token || !/^[a-zA-Z0-9-]{8,128}$/.test(token)) return undefined
  const broker = getTabViewPwaBroker(Owner)
  const restored = broker.Read<LaunchRecord>(`session:${token}`)
  const validRecord = restored?.Version === 2 && restored.Token === token && restored.Origin === Owner.location.origin && Date.now() - restored.Updated < 86400000
  let parent: Window | undefined
  try {
    parent = Owner.opener as Window
    if (!parent || parent.location.origin !== Owner.location.origin) parent = undefined
  } catch { parent = undefined }
  if (!parent && !validRecord) return undefined
  let initial: TabViewPwaDocument[]
  try { initial = validRecord ? cloneTabViewPwaDocuments(restored.Documents) : [] } catch { return undefined }
  const locale = url.searchParams.get('tabview-locale') ?? (validRecord ? restored.Locale : 'en-US')
  const requestedTheme = url.searchParams.get('tabview-theme')
  const theme = requestedTheme === 'Light' || requestedTheme === 'Dark' ? requestedTheme : validRecord ? restored.Theme : 'Default'
  let bridge: WindowBridge | undefined
  return {
    Id: token, Locale: locale, Theme: theme,
    InitialDocuments: initial,
    InitialSelectedId: validRecord ? restored.SelectedId : null,
    Ready(Source, Options = {}) {
      if (bridge) throw new Error('The TabView child source is already ready.')
      cloneTabViewPwaDocuments(Source.Read())
      const localDocuments = new Map(Source.Read().map(document => [document.Id, document]))
      const installed: WindowBridge = {
        Token: token,
        ReadDocuments: () => cloneTabViewPwaDocuments(Source.Read()),
        WriteDocuments: documents => {
          const incoming = cloneTabViewPwaDocuments(documents)
          for (const document of Source.Read()) localDocuments.set(document.Id, document)
          Source.Write(incoming.map(document => {
            const local = localDocuments.get(document.Id)
            if (local) {
              local.Header = document.Header
              local.Title = document.Title
              local.IsOn = document.IsOn
              if (document.Icon === undefined) delete local.Icon
              else local.Icon = document.Icon
              return local
            }
            const created = Options.RealizeDocument?.(document) ?? document
            localDocuments.set(document.Id, created)
            return created
          }))
        },
        ReadSelectedId: () => Source.ReadSelectedItem?.()?.Id ?? null,
        WriteSelectedId: id => Source.WriteSelectedItem?.(Source.Read().find(document => document.Id === id) ?? null),
        ...(Options.CreateSplit ? { CreateSplit: Options.CreateSplit } : {}),
      }
      bridge = installed
      ;(Owner as HostWindow).__winuiTabViewPwaBridgeV1 = installed
      Owner.dispatchEvent(new Event(changedEvent))
      parent?.postMessage({ Type: readyMessage, Token: token }, Owner.location.origin)
      let stage: { Id: string; Before: TabViewPwaDocument[]; Selected: string | null; After: TabViewPwaDocument[]; AfterSelected: string | null } | undefined
      let lastTransaction = broker.Read<LaunchRecord>(`session:${token}`)?.LastTransaction
      const publish = (state: LaunchRecord['State'] = 'Ready') => {
        if (!broker.Available || stage) return
        const current = broker.Read<LaunchRecord>(`session:${token}`)
        broker.Write(`session:${token}`, { Version: 2, Token: token, Origin: Owner.location.origin,
          Created: current?.Created ?? Date.now(), Updated: Date.now(), Locale: locale, Theme: theme,
          Documents: installed.ReadDocuments(), SelectedId: installed.ReadSelectedId(), State: state,
          WindowId: broker.WindowId, DisplayMode: readTabViewPwaDisplayMode(Owner),
          ...(lastTransaction ? { LastTransaction: lastTransaction } : {}) } satisfies LaunchRecord)
        if (state === 'Ready') broker.Refresh()
      }
      const rollback = () => {
        if (!stage) return
        installed.WriteDocuments(stage.Before); installed.WriteSelectedId(stage.Selected)
        stage = undefined; publish()
      }
      const stopEndpoint = broker.Register(token, (method, data) => {
        const request = data as { Transaction?: string; Before?: TabViewPwaDocument[]; Documents?: TabViewPwaDocument[]; SelectedId?: string | null }
        if (method === 'Stage') {
          if (!request.Transaction || stage || JSON.stringify(installed.ReadDocuments()) !== JSON.stringify(request.Before)) throw new Error('The TabView destination changed.')
          const documents = cloneTabViewPwaDocuments(request.Documents ?? [])
          stage = { Id: request.Transaction, Before: installed.ReadDocuments(), Selected: installed.ReadSelectedId(), After: documents, AfterSelected: request.SelectedId ?? null }
          try {
            installed.WriteDocuments(documents); installed.WriteSelectedId(stage.AfterSelected)
            if (JSON.stringify(installed.ReadDocuments()) !== JSON.stringify(documents)) throw new Error('TabView destination writes must publish synchronously.')
            return true
          } catch (error) { rollback(); throw error }
        }
        if (method === 'Rollback') { if (stage?.Id === request.Transaction) rollback(); return true }
        if (method === 'Confirm') {
          if (!stage || stage.Id !== request.Transaction || JSON.stringify(installed.ReadDocuments()) !== JSON.stringify(stage.After)) throw new Error('The staged TabView destination is unavailable.')
          lastTransaction = stage.Id; stage = undefined; publish(); return true
        }
        if (method === 'Read') { publish(); return { Documents: installed.ReadDocuments(), SelectedId: installed.ReadSelectedId() } }
        throw new Error('Unknown TabView session operation.')
      })
      publish()
      // Direct reactive edits need persistence even when no Source.Write runs.
      const persistenceTimer = Owner.setInterval(() => publish(), 500)
      let released = false
      const release = () => {
        if (released) return
        released = true
        rollback(); publish('Suspended')
        Owner.clearInterval(persistenceTimer); stopEndpoint()
        if ((Owner as HostWindow).__winuiTabViewPwaBridgeV1 === installed) delete (Owner as HostWindow).__winuiTabViewPwaBridgeV1
        if (bridge === installed) bridge = undefined
        Owner.removeEventListener('pagehide', pageHide)
        Owner.removeEventListener('pageshow', pageShow)
        Owner.dispatchEvent(new Event(changedEvent))
        try { parent?.postMessage({ Type: unavailableMessage, Token: token }, Owner.location.origin) }
        catch { /* The opener may already be closed or have navigated away. */ }
      }
      const pageHide = (event: Event) => {
        rollback(); publish('Suspended')
        if (!(event as PageTransitionEvent).persisted) release()
      }
      const pageShow = () => {
        if (released) return
        ;(Owner as HostWindow).__winuiTabViewPwaBridgeV1 = installed
        publish(); Owner.dispatchEvent(new Event(changedEvent))
        try { parent?.postMessage({ Type: readyMessage, Token: token }, Owner.location.origin) } catch { /* Broker remains available. */ }
      }
      Owner.addEventListener('pagehide', pageHide)
      Owner.addEventListener('pageshow', pageShow)
      return release
    },
  }
}

/**
 * postMessage confirms readiness. Synchronous same-origin callbacks preserve
 * the adapter's transactional Write contract, with DTO cloning at every boundary.
 */
function windowSource(Owner: Window, Token: string): TabViewHostSource<TabViewPwaDocument> {
  let cached: readonly TabViewPwaDocument[] = []
  let encoded = '[]'
  const bridge = () => {
    if (Owner.closed) throw new Error('The TabView destination window is closed.')
    const value = (Owner as HostWindow).__winuiTabViewPwaBridgeV1
    if (!value || value.Token !== Token) throw new Error('The TabView destination is no longer ready.')
    return value
  }
  const Read = () => {
    const documents = cloneTabViewPwaDocuments(bridge().ReadDocuments())
    const next = JSON.stringify(documents)
    if (next !== encoded) { cached = documents; encoded = next }
    return [...cached]
  }
  return {
    Read,
    Write(Documents) {
      const documents = cloneTabViewPwaDocuments(Documents)
      const next = JSON.stringify(documents)
      bridge().WriteDocuments(documents)
      if (JSON.stringify(cloneTabViewPwaDocuments(bridge().ReadDocuments())) !== next) throw new Error('The child did not publish its documents synchronously.')
      cached = [...Documents]; encoded = next
    },
    ReadSelectedItem: () => { const documents = Read(); const id = bridge().ReadSelectedId(); return documents.find(document => document.Id === id) ?? null },
    WriteSelectedItem: document => bridge().WriteSelectedId(document?.Id ?? null),
  }
}

type RemoteTarget = { Prepare(Request: TabViewHostMoveRequest<TabViewPwaDocument>): Promise<void>; Confirm(): Promise<void>; Rollback(): Promise<void> }
const remoteTargets = new WeakMap<TabViewHostSource<TabViewPwaDocument>, RemoteTarget>()
const remoteOperationKey = Symbol('TabView.Pwa.RemoteOperation')
function brokerWindowSource(Owner: Window, Token: string): TabViewHostSource<TabViewPwaDocument> {
  const broker = getTabViewPwaBroker(Owner)
  let cache: readonly TabViewPwaDocument[] = []
  let encoded = '[]'
  let selected: string | null = null
  let stage: { Id: string; WindowId: string; Before: readonly TabViewPwaDocument[]; After: TabViewPwaDocument[] } | undefined
  let rollback: Promise<void> | undefined
  const record = () => {
    const value = broker.Read<LaunchRecord>(`session:${Token}`)
    if (!value || value.Token !== Token || value.State !== 'Ready' || !value.WindowId || !broker.Alive(value.WindowId)) throw new Error('The TabView application window is unavailable.')
    return value
  }
  const read = () => {
    if (!stage) {
      const value = record()
      const documents = cloneTabViewPwaDocuments(value.Documents)
      const next = JSON.stringify(documents)
      if (next !== encoded) { cache = documents; encoded = next }
      selected = value.SelectedId
    }
    return [...cache]
  }
  const source: TabViewHostSource<TabViewPwaDocument> = {
    Read: read,
    Write(documents) {
      const incoming = cloneTabViewPwaDocuments(documents)
      if (!stage) throw new Error('A remote TabView target must be prepared before its synchronous acknowledgement.')
      const next = JSON.stringify(incoming)
      if (next === JSON.stringify(stage.Before)) {
        const current = stage
        rollback = broker.Request(current.WindowId, Token, 'Rollback', { Transaction: current.Id }).then(() => undefined)
      } else if (next !== JSON.stringify(stage.After)) throw new Error('The remote TabView target changed after preparation.')
      cache = [...documents]; encoded = next
    },
    ReadSelectedItem: () => { const documents = read(); return documents.find(document => document.Id === selected) ?? null },
    WriteSelectedItem: document => { selected = document?.Id ?? null },
  }
  remoteTargets.set(source, {
    async Prepare(request) {
      if (stage) throw new Error('The remote TabView target is busy.')
      const before = read()
      const value = record()
      const documents = cloneTabViewPwaDocuments(request.Items)
      const after = cloneTabViewPwaDocuments(before)
      if (request.DropIndex < 0 || request.DropIndex > after.length) throw new Error('Invalid remote TabView insertion index.')
      after.splice(request.DropIndex, 0, ...documents)
      cloneTabViewPwaDocuments(after)
      stage = { Id: globalThis.crypto.randomUUID(), WindowId: value.WindowId!, Before: before, After: after }
      try { await broker.Request(stage.WindowId, Token, 'Stage', { Transaction: stage.Id, Before: before, Documents: after, SelectedId: documents[0]?.Id ?? null }, request.Signal) }
      catch (error) { await this.Rollback(); throw error }
    },
    async Confirm() {
      if (!stage) return
      const current = stage
      try { await broker.Request(current.WindowId, Token, 'Confirm', { Transaction: current.Id }) }
      catch (error) { if (broker.Read<LaunchRecord>(`session:${Token}`)?.LastTransaction !== current.Id) throw error }
      stage = undefined; rollback = undefined
    },
    async Rollback() {
      const current = stage
      if (!current) return
      try { await (rollback ?? broker.Request(current.WindowId, Token, 'Rollback', { Transaction: current.Id }).then(() => undefined)) }
      finally { cache = [...current.Before]; encoded = JSON.stringify(cache); stage = undefined; rollback = undefined }
    },
  })
  return source
}

export function createTabViewPwaHost(Options: TabViewPwaHostOptions = {}): TabViewPwaHost {
  const owner = Options.Window ?? window
  const origin = owner.location.origin
  const broker = getTabViewPwaBroker(owner, Options.ApplicationScope)
  const native = createTabViewPwaNativeTransport({ Window: owner, Clone: cloneTabViewPwaDocuments, ChangedEvent: changedEvent })
  const listeners = new Set<(Capabilities: TabViewPwaCapabilities) => void>()
  type Entry = { Window: Window; Owned: boolean; Ready: boolean; Finish(Result: TabViewHostDestination<TabViewPwaDocument> | TabViewHostCancelled): void; Close(): void }
  const entries = new Map<string, Entry>()
  let disposed = false
  let status: TabViewPwaCapabilities['WindowOpenStatus'] = 'NotRequested'
  let lastMode: TabViewPwaDisplayMode | null = null
  let childReady = false
  let communication = false
  let lastSplit = false
  let confirmedTransfer = false
  let lastToken: string | undefined
  const readyEntry = (token: string, entry: Entry | undefined) => {
    try {
      const record = broker.Read<LaunchRecord>(`session:${token}`)
      if (broker.Available && record?.State === 'Suspended') return false
      return Boolean(entry?.Ready && (!entry.Window.closed && (entry.Window as HostWindow).__winuiTabViewPwaBridgeV1?.Token === token ||
        record?.State === 'Ready' && record.WindowId && broker.Alive(record.WindowId)))
    }
    catch { return false }
  }
  const capabilities = (): TabViewPwaCapabilities => {
    const mode = readTabViewPwaDisplayMode(owner)
    const latestReady = lastToken ? readyEntry(lastToken, entries.get(lastToken)) : false
    const remoteWindowId = lastToken ? broker.Read<LaunchRecord>(`session:${lastToken}`)?.WindowId : undefined
    return { CurrentDisplayMode: mode, IsInstalledApp: ['standalone', 'minimal-ui', 'window-controls-overlay'].includes(mode),
      WindowOpenSupported: typeof owner.open === 'function', WindowOpenStatus: status, LastWindowDisplayMode: lastMode,
      ChildReady: childReady && latestReady, SameOriginCommunication: communication && latestReady,
      ApplicationSplit: Boolean((owner as HostWindow).__winuiTabViewPwaBridgeV1?.CreateSplit), LastWindowApplicationSplit: lastSplit && latestReady,
      ConfirmedWindowTransfer: confirmedTransfer && latestReady, NativeCrossWindowDrag: native.HasSource(),
      LastWindowNativeCrossWindowDrag: Boolean(lastToken && latestReady && (native.HasSource(entries.get(lastToken)?.Window) || remoteWindowId && native.HasBrokerSource(remoteWindowId))),
      NativeTabSplit: false, NativeWindowTearOut: false,
      LiveWindowCount: [...entries].filter(([token, entry]) => readyEntry(token, entry)).length }
  }
  let notifiedSnapshot = JSON.stringify(capabilities())
  const notify = () => {
    const state = capabilities()
    const snapshot = JSON.stringify(state)
    if (snapshot === notifiedSnapshot) return
    notifiedSnapshot = snapshot
    for (const listener of listeners) { try { listener(state) } catch { /* Observers do not own transfer completion. */ } }
  }
  const receive = (event: MessageEvent) => {
    if (event.origin !== origin || ![readyMessage, unavailableMessage].includes(event.data?.Type) || typeof event.data?.Token !== 'string') return
    const token = event.data.Token as string
    const entry = entries.get(token)
    if (!entry || event.source !== entry.Window) return
    if (event.data.Type === unavailableMessage) {
      entry.Ready = false
      if (token === lastToken) { childReady = false; communication = false }
      notify()
      return
    }
    try {
      if (entry.Window.location.origin !== origin) throw new Error('The TabView child changed origin.')
      const bridge = (entry.Window as HostWindow).__winuiTabViewPwaBridgeV1
      if (!bridge || bridge.Token !== token) throw new Error('The TabView child has no matching source.')
      const target = windowSource(entry.Window, token)
      target.Read()
      entry.Ready = true
      if (token === lastToken) {
        status = 'Ready'; childReady = true; communication = true
        lastMode = readTabViewPwaDisplayMode(entry.Window); lastSplit = Boolean(bridge.CreateSplit)
      }
      entry.Finish({ Status: 'Accepted', NewWindowId: token, Target: target,
        Commit: () => { try { target.Read(); return { Status: 'Accepted' } } catch (error) { return cancelled('WindowUnavailable', error) } },
        Dispose: entry.Close })
      notify()
    } catch (error) { if (token === lastToken) status = 'Failed'; entry.Finish(cancelled('WindowUnavailable', error)); entry.Close(); notify() }
  }
  owner.addEventListener('message', receive)
  owner.addEventListener(changedEvent, notify)
  const acceptBrokerEntry = (token: string) => {
    const entry = entries.get(token)
    const record = broker.Read<LaunchRecord>(`session:${token}`)
    if (!entry || !record || record.Token !== token || record.State !== 'Ready' || !record.WindowId || !broker.Alive(record.WindowId)) return
    try {
      let target: TabViewHostSource<TabViewPwaDocument>
      let direct: WindowBridge | undefined
      try { direct = !entry.Window.closed && entry.Window.location.origin === origin ? (entry.Window as HostWindow).__winuiTabViewPwaBridgeV1 : undefined } catch { /* Independent installed window. */ }
      target = direct?.Token === token ? windowSource(entry.Window, token) : brokerWindowSource(owner, token)
      target.Read(); entry.Ready = true
      if (token === lastToken) {
        status = 'Ready'; childReady = true; communication = true
        lastMode = record.DisplayMode ?? null; lastSplit = Boolean(direct?.CreateSplit)
      }
      entry.Finish({ Status: 'Accepted', NewWindowId: token, Target: target, Dispose: entry.Close })
      notify()
    } catch { /* Wait for the next mounted-source heartbeat. */ }
  }
  const stopBrokerWatch = broker.Watch(key => {
    if (key.startsWith('session:')) acceptBrokerEntry(key.slice('session:'.length))
    notify()
  })
  const timer = owner.setInterval(() => {
    native.Sweep()
    let changed = false
    for (const [id, entry] of entries) if (entry.Window.closed && !readyEntry(id, entry)) {
      const record = broker.Read<LaunchRecord>(`session:${id}`)
      if (broker.Available && !entry.Ready && record?.State === 'Opening' && Date.now() - record.Created < (Options.ReadyTimeoutMs ?? 15000)) continue
      if (!entry.Ready && !entry.Owned) { if (id === lastToken) status = 'Cancelled'; entry.Finish(cancelled('WindowUnavailable')) }
      entries.delete(id); changed = true
    }
    // Readiness can also disappear through navigation, source teardown or a
    // lost notification while the browser window itself remains open.
    if (changed || JSON.stringify(capabilities()) !== notifiedSnapshot) notify()
  }, 500)
  const adapter = createTabViewHostAdapter<TabViewPwaDocument>({
    Move: request => {
      const remote = remoteTargets.get(request.Target)
      const context = (request as typeof request & { [remoteOperationKey]?: { Target?: RemoteTarget } })[remoteOperationKey]
      if (context && remote) context.Target = remote
      return remote?.Prepare(request)
    },
    CreateWindow(request) {
      if (disposed) return cancelled('Disposed')
      try { cloneTabViewPwaDocuments(request.Items) } catch (error) { return cancelled('InvalidItems', error) }
      const url = new URL(Options.BaseUrl ?? owner.location.href, owner.location.href)
      if (url.origin !== origin) return cancelled('InvalidTarget')
      const token = globalThis.crypto.randomUUID()
      lastToken = token
      url.searchParams.delete('systemBackdropSample')
      url.searchParams.set(tabViewPwaWindowParameter, token)
      url.searchParams.set('tabview-app-scope', broker.ScopePath)
      url.searchParams.set('tabview-locale', typeof Options.Locale === 'function' ? Options.Locale() : Options.Locale ?? owner.navigator.language)
      url.searchParams.set('tabview-theme', typeof Options.Theme === 'function' ? Options.Theme() : Options.Theme ?? 'Default')
      url.hash = ''
      status = 'Opening'; childReady = false; communication = false; lastMode = null; lastSplit = false; confirmedTransfer = false
      prepareTabViewPwaLaunchSession(owner, { Token: token, Locale: url.searchParams.get('tabview-locale') ?? 'en-US',
        Theme: (url.searchParams.get('tabview-theme') ?? 'Default') as 'Light' | 'Dark' | 'Default' })
      // Do not await, notify subscribers or navigate a reserved blank window
      // before opening: this call must retain the originating click activation.
      let popup: Window | null
      try { popup = owner.open(url.href, `winui-tabview-${token}`, 'popup,width=1000,height=700') }
      catch (error) { status = 'Failed'; notify(); return cancelled('WindowUnavailable', error) }
      if (!popup) { status = 'Blocked'; notify(); return cancelled('WindowUnavailable') }
      const opened = popup
      native.AllowWindow(opened, token)
      return new Promise<TabViewHostDestination<TabViewPwaDocument> | TabViewHostCancelled>(resolve => {
        let finished = false
        let timeout: number | undefined
        const abort = () => { if (token === lastToken) status = 'Cancelled'; entry.Finish(cancelled('Cancelled')); entry.Close(); notify() }
        const entry: Entry = {
          Window: opened, Owned: false, Ready: false,
          Finish(result) { if (finished) return; finished = true; if (timeout !== undefined) owner.clearTimeout(timeout); request.Signal?.removeEventListener('abort', abort); resolve(result) },
          Close() { entries.delete(token); if (!opened.closed) opened.close(); notify() },
        }
        entries.set(token, entry)
        timeout = owner.setTimeout(() => { if (token === lastToken) status = 'Failed'; entry.Finish(cancelled('WindowUnavailable')); entry.Close(); notify() }, Options.ReadyTimeoutMs ?? 15000)
        request.Signal?.addEventListener('abort', abort, { once: true })
        if (request.Signal?.aborted) abort()
        notify()
      })
    },
    async Split(request) {
      const create = (owner as HostWindow).__winuiTabViewPwaBridgeV1?.CreateSplit
      if (!create) return cancelled('HostUnavailable')
      const pane = await create(request.Edge, request.Signal)
      if ('Status' in pane) return pane
      if (request.Signal?.aborted) { await pane.Dispose?.(); return cancelled('Cancelled') }
      return { Status: 'Accepted', NewWindowId: pane.Id, Target: pane.Source,
        ...(pane.Dispose ? { Dispose: () => pane.Dispose!() } : {}) }
    },
  })
  const own = (result: TabViewHostResult<TabViewPwaDocument>) => {
    if (result.Status === 'Accepted' && typeof result.NewWindowId === 'string') {
      const entry = entries.get(result.NewWindowId)
      if (entry) { entry.Owned = true; if (result.NewWindowId === lastToken) confirmedTransfer = true; notify() }
    } else if (result.Status === 'Cancelled' && status === 'Ready' && lastToken && !entries.has(lastToken)) {
      status = 'Failed'; notify()
    }
    return result
  }
  const publicAdapter: TabViewHostAdapter<TabViewPwaDocument> = {
    ...adapter,
    OpenWindow: request => runCommand(request, next => adapter.OpenWindow(next)),
    TearOut: request => runCommand(request, next => adapter.TearOut(next)),
    Move: request => runCommand(request, next => adapter.Move(next)),
  }
  async function runCommand<T extends { Source: TabViewHostSource<TabViewPwaDocument> }>(request: T, operation: (Request: T) => Promise<TabViewHostResult<TabViewPwaDocument>>) {
    const before = [...request.Source.Read()]
    const selected = request.Source.ReadSelectedItem?.()
    const context: { Target?: RemoteTarget } = {}
    const result = await operation({ ...request, [remoteOperationKey]: context })
    const target = result.Status === 'Accepted' ? result.Target : undefined
    const remote = context.Target ?? (target ? remoteTargets.get(target) : undefined)
    try {
      if (result.Status === 'Accepted' && remote) await remote.Confirm()
      // Cancelled moves may have already staged their target before the
      // neutral transaction detected a changed source or aborted signal.
      else if (result.Status === 'Cancelled' && remote) await remote.Rollback()
      return own(result)
    } catch (error) {
      try { await remote?.Rollback(); request.Source.Write(before); if (selected !== undefined) request.Source.WriteSelectedItem?.(selected ?? null) }
      catch (rollbackError) { return cancelled('RollbackFailed', rollbackError) }
      return cancelled('UpdateFailed', error)
    }
  }
  return {
    Adapter: publicAdapter,
    NativeDragBridge: native.Bridge,
    get Capabilities() { return capabilities() },
    Subscribe(listener) { listeners.add(listener); listener(capabilities()); return () => listeners.delete(listener) },
    async Dispose() {
      if (disposed) return
      disposed = true
      try { await adapter.Dispose() }
      finally {
        owner.clearInterval(timer)
        owner.removeEventListener('message', receive)
        owner.removeEventListener(changedEvent, notify)
        stopBrokerWatch()
        native.Dispose()
        for (const entry of entries.values()) if (!entry.Owned) entry.Close()
        entries.clear(); listeners.clear()
      }
    },
  }
}
