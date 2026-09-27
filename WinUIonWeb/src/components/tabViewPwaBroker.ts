/** Same-origin, application-scoped DTO coordination without WindowProxy or opener sharing. */
export interface TabViewPwaBroker {
  readonly WindowId: string
  readonly ScopePath: string
  readonly Available: boolean
  Read<T>(Key: string): T | undefined
  Keys(Prefix: string): string[]
  Write(Key: string, Value: unknown): void
  Remove(Key: string): void
  Register(Id: string, Handler: (Method: string, Data: unknown) => unknown | Promise<unknown>): () => void
  Request(WindowId: string, Endpoint: string, Method: string, Data: unknown, Signal?: AbortSignal): Promise<unknown>
  Watch(Handler: (Key: string) => void): () => void
  Alive(WindowId: string): boolean
  Refresh(): void
}
type Message = {
  Version: 2; Id: string; From: string; To?: string; Endpoint?: string
  Kind: 'Request' | 'Response' | 'Changed'; Method?: string; Data?: unknown
  ReplyTo?: string; Error?: string; Key?: string
}
type BrokerWindow = Window & { __winuiTabViewPwaBrokerV2?: TabViewPwaBroker }

export function tabViewPwaApplicationScope(Owner: Window, ApplicationScope?: string): string {
  const requested = new URL(Owner.location.href).searchParams.get('tabview-app-scope')
  let manifestScope: string | undefined
  try {
    const href = (Owner.document?.querySelector('link[rel~="manifest"]') as HTMLLinkElement | null)?.href
    const manifest = href ? new URL(href, Owner.location.href) : undefined
    // The app can replace its manifest with a blob URL. Relative resolution
    // against blob: is invalid; launch metadata/configuration stays canonical.
    if (manifest && ['http:', 'https:'].includes(manifest.protocol) && manifest.origin === Owner.location.origin) manifestScope = new URL('.', manifest).href
  } catch { /* Non-DOM hosts and non-hierarchical manifest URLs use the deployment root. */ }
  const scope = new URL(ApplicationScope ?? requested ?? manifestScope ?? '.', Owner.location.href)
  if (scope.origin !== Owner.location.origin) throw new Error('TabView window coordination requires a same-origin application scope.')
  return `winui-tabview-v2:${scope.pathname.endsWith('/') ? scope.pathname : new URL('.', scope).pathname}:`
}

export function getTabViewPwaBroker(Owner: Window, ApplicationScope?: string): TabViewPwaBroker {
  const own = Owner as BrokerWindow
  if (own.__winuiTabViewPwaBrokerV2) return own.__winuiTabViewPwaBrokerV2
  const windowId = globalThis.crypto.randomUUID()
  const prefix = tabViewPwaApplicationScope(Owner, ApplicationScope)
  const scopePath = prefix.slice('winui-tabview-v2:'.length, -1)
  let storage: Storage | undefined
  try {
    storage = Owner.localStorage
    storage?.setItem(`${prefix}probe`, '1')
    storage?.removeItem(`${prefix}probe`)
  } catch { storage = undefined }
  let channel: BroadcastChannel | undefined
  try {
    const Channel = (Owner as Window & typeof globalThis).BroadcastChannel
    if (storage && typeof Channel === 'function') channel = new Channel(`${prefix}messages`)
  } catch { /* Storage events remain a cross-window delivery path. */ }
  const handlers = new Map<string, (Method: string, Data: unknown) => unknown | Promise<unknown>>()
  const watchers = new Set<(Key: string) => void>()
  const seen = new Map<string, number>()
  const pending = new Map<string, { Resolve(Value: unknown): void; Reject(Error: unknown): void; End(): void }>()
  let suspended = false
  const read = <T>(key: string): T | undefined => {
    try { const encoded = storage?.getItem(`${prefix}${key}`); return encoded ? JSON.parse(encoded) as T : undefined }
    catch { return undefined }
  }
  const emit = (message: Message) => {
    try { channel?.postMessage(message) } catch { /* Durable mailbox fallback below. */ }
    if (storage) {
      const key = `${prefix}message:${message.Id}`
      storage.setItem(key, JSON.stringify(message))
      // Storage events include the original newValue even after mailbox cleanup.
      storage.removeItem(key)
    }
    if (message.To === windowId) queueMicrotask(() => receive(message))
  }
  const notify = (key: string) => {
    for (const callback of watchers) { try { callback(key) } catch { /* Observers do not own transactions. */ } }
  }
  const receive = (value: unknown) => {
    if (!value || typeof value !== 'object') return
    const message = value as Message
    if (message.Version !== 2 || typeof message.Id !== 'string' || typeof message.From !== 'string' ||
      message.To && message.To !== windowId || seen.has(message.Id)) return
    seen.set(message.Id, Date.now())
    if (message.Kind === 'Changed' && typeof message.Key === 'string') { notify(message.Key); return }
    if (message.Kind === 'Response' && typeof message.ReplyTo === 'string') {
      const request = pending.get(message.ReplyTo)
      if (!request) return
      pending.delete(message.ReplyTo); request.End()
      if (message.Error) request.Reject(new Error(message.Error))
      else request.Resolve(message.Data)
      return
    }
    if (message.Kind !== 'Request' || !message.Endpoint || !message.Method) return
    const handler = handlers.get(message.Endpoint)
    const reply = (data?: unknown, error?: string) => emit({ Version: 2, Id: globalThis.crypto.randomUUID(), From: windowId,
      To: message.From, Kind: 'Response', ReplyTo: message.Id, ...(error ? { Error: error } : { Data: data }) })
    if (!handler) { reply(undefined, 'The TabView window source is unavailable.'); return }
    try { Promise.resolve(handler(message.Method, message.Data)).then(data => reply(data), error => reply(undefined, String(error))) }
    catch (error) { reply(undefined, String(error)) }
  }
  channel?.addEventListener('message', event => receive(event.data))
  Owner.addEventListener('storage', event => {
    const changed = event as StorageEvent
    if (!changed.key?.startsWith(prefix)) return
    const key = changed.key.slice(prefix.length)
    if (key.startsWith('message:') && changed.newValue) { try { receive(JSON.parse(changed.newValue)) } catch { /* Invalid mailbox. */ } }
    else if (!key.startsWith('message:')) notify(key)
  })
  const broker: TabViewPwaBroker = {
    WindowId: windowId, ScopePath: scopePath, Available: Boolean(storage),
    Read: read,
    Keys(part) {
      const result: string[] = []
      if (!storage) return result
      for (let index = 0; index < storage.length; index++) {
        const key = storage.key(index)
        if (key?.startsWith(`${prefix}${part}`)) result.push(key.slice(prefix.length))
      }
      return result
    },
    Write(key, value) {
      if (!storage) throw new Error('Same-origin TabView window storage is unavailable.')
      const encoded = JSON.stringify(value)
      if (storage.getItem(`${prefix}${key}`) === encoded) return
      storage.setItem(`${prefix}${key}`, encoded)
      notify(key)
      emit({ Version: 2, Id: globalThis.crypto.randomUUID(), From: windowId, Kind: 'Changed', Key: key })
    },
    Remove(key) {
      storage?.removeItem(`${prefix}${key}`)
      notify(key)
      emit({ Version: 2, Id: globalThis.crypto.randomUUID(), From: windowId, Kind: 'Changed', Key: key })
    },
    Register(id, handler) { handlers.set(id, handler); return () => { if (handlers.get(id) === handler) handlers.delete(id) } },
    Request(to, endpoint, method, data, signal) {
      if (!storage || signal?.aborted) return Promise.reject(new Error('The TabView window request is cancelled or unavailable.'))
      return new Promise((resolve, reject) => {
        const id = globalThis.crypto.randomUUID()
        const abort = () => { const request = pending.get(id); if (!request) return; pending.delete(id); request.End(); reject(signal?.reason ?? new Error('Cancelled')) }
        const timer = Owner.setTimeout(() => {
          const request = pending.get(id)
          if (!request) return
          pending.delete(id); request.End(); reject(new Error('The TabView window did not acknowledge its request.'))
        }, 15000)
        pending.set(id, { Resolve: resolve, Reject: reject, End() { Owner.clearTimeout(timer); signal?.removeEventListener('abort', abort) } })
        signal?.addEventListener('abort', abort, { once: true })
        try { emit({ Version: 2, Id: id, From: windowId, To: to, Endpoint: endpoint, Kind: 'Request', Method: method, Data: data }) }
        catch (error) { const request = pending.get(id); pending.delete(id); request?.End(); reject(error) }
      })
    },
    Watch(handler) { watchers.add(handler); return () => watchers.delete(handler) },
    Alive(id) { const lease = read<{ Updated: number; Active: boolean }>(`window:${id}`); return Boolean(lease?.Active && Date.now() - lease.Updated < 60000) },
    Refresh() {
      if (!storage || suspended) return
      broker.Write(`window:${windowId}`, { Updated: Date.now(), Active: true })
      for (const [id, time] of seen) if (Date.now() - time > 60000) seen.delete(id)
    },
  }
  own.__winuiTabViewPwaBrokerV2 = broker
  Owner.addEventListener('pagehide', () => { suspended = true; if (storage) broker.Write(`window:${windowId}`, { Updated: Date.now(), Active: false }) })
  Owner.addEventListener('pageshow', () => { suspended = false; broker.Refresh() })
  broker.Refresh()
  return broker
}
