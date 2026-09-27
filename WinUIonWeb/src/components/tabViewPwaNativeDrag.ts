import { createTabViewHostAdapter, type TabViewHostAdapter, type TabViewHostSource } from './tabViewHostAdapter'
import type { TabViewPwaDocument } from './tabViewPwaHost'
import type { TabViewNativeDragAcceptance, TabViewNativeDragBridge, TabViewNativeDragPreview, TabViewNativeDragSourceOptions } from './tabViewNativeDragBridge'
import { createTabViewPwaDragBroker } from './tabViewPwaDragBroker'

export const tabViewPwaNativeDragFormat = 'application/x-winui-tabview-window-v1'
const tokenFormatPrefix = 'application/x-winui-tabview-token-'
type Operation = 'Move' | 'None'
type DocumentBridge = {
  Read(): TabViewPwaDocument[]
  Write(Documents: readonly TabViewPwaDocument[]): void
  ReadSelectedId(): string | null
  WriteSelectedId(Id: string | null): void
}
type SourceRecord = {
  Id: string; WindowId: string; Window: Window; Bridge: DocumentBridge
  Proxy: TabViewHostSource<TabViewPwaDocument>
  OnTransferCompleted?: TabViewNativeDragSourceOptions<TabViewPwaDocument>['OnTransferCompleted']
  ReleaseBroker?(): void
  IsActive(): boolean
}
type DragRecord = {
  Id: string; Source: SourceRecord; DocumentIds: string[]; Controller: AbortController
  Observed: boolean; State: 'Dragging' | 'Dropping' | 'Completed'; Started: number
  Target?: SourceRecord; Result?: Operation; Promise: Promise<Operation>
  Finish(Result: Operation): void; RemoveSourceSignal(): void
}
type Family = {
  Id: string; Origin: string; Windows: Map<string, Window>
  Sources: Map<string, SourceRecord>; Drags: Map<string, DragRecord>
  Adapter: TabViewHostAdapter<TabViewPwaDocument>
}
type FamilyWindow = Window & { __winuiTabViewPwaFamilyV1?: Family; __winuiTabViewPwaFamilyWindowIdV1?: string }

export interface TabViewPwaNativeTransport {
  Bridge: TabViewNativeDragBridge<TabViewPwaDocument>
  AllowWindow(Owner: Window, Id: string): void
  HasSource(Owner?: Window): boolean
  HasBrokerSource(WindowId: string): boolean
  Sweep(): void
  Dispose(): void
}

function familyFor(owner: Window): { Family: Family; WindowId: string } {
  const current = owner as FamilyWindow
  const existing = current.__winuiTabViewPwaFamilyV1
  const existingId = current.__winuiTabViewPwaFamilyWindowIdV1
  if (existing && existingId && existing.Origin === owner.location.origin && existing.Windows.get(existingId) === owner) return { Family: existing, WindowId: existingId }
  const requestedId = new URL(owner.location.href).searchParams.get('winui-tabview-window')
  try {
    const parent = owner.opener as FamilyWindow | null
    const inherited = parent?.__winuiTabViewPwaFamilyV1
    if (requestedId && inherited && parent?.location.origin === owner.location.origin &&
      inherited.Origin === owner.location.origin && inherited.Windows.get(requestedId) === owner) {
      current.__winuiTabViewPwaFamilyV1 = inherited
      current.__winuiTabViewPwaFamilyWindowIdV1 = requestedId
      return { Family: inherited, WindowId: requestedId }
    }
  } catch { /* A cross-origin or unregistered opener cannot authorize a family. */ }
  const id = globalThis.crypto.randomUUID()
  const family: Family = { Id: globalThis.crypto.randomUUID(), Origin: owner.location.origin,
    Windows: new Map([[id, owner]]), Sources: new Map(), Drags: new Map(), Adapter: createTabViewHostAdapter<TabViewPwaDocument>() }
  current.__winuiTabViewPwaFamilyV1 = family
  current.__winuiTabViewPwaFamilyWindowIdV1 = id
  return { Family: family, WindowId: id }
}

export function createTabViewPwaNativeTransport(Options: {
  Window: Window
  Clone(Documents: readonly TabViewPwaDocument[]): TabViewPwaDocument[]
  ChangedEvent: string
}): TabViewPwaNativeTransport {
  const owner = Options.Window
  const { Family: family, WindowId: windowId } = familyFor(owner)
  const broker = createTabViewPwaDragBroker(Options)
  const controls = new Map<object, SourceRecord>()
  const active = new Map<object, string>()
  let disposed = false
  const live = (record: SourceRecord) => {
    try { return family.Sources.get(record.Id) === record && family.Windows.get(record.WindowId) === record.Window &&
      !record.Window.closed && record.Window.location.origin === family.Origin && record.IsActive() }
    catch { return false }
  }
  const changed = () => {
    for (const target of family.Windows.values()) {
      try {
        const EventType = (target as Window & typeof globalThis).Event ?? Event
        if (!target.closed && target.location.origin === family.Origin) target.dispatchEvent(new EventType(Options.ChangedEvent))
      }
      catch { /* Navigation can invalidate a former same-origin family member. */ }
    }
  }
  const cancel = (drag: DragRecord) => {
    if (drag.State === 'Completed') return
    drag.Controller.abort()
    if (drag.State === 'Dragging') drag.Finish('None')
    // A real Drop resolves only after its acceptance or collection transaction
    // has finished cancelling, including source and target rollback.
  }
  const proxyFor = (record: SourceRecord): TabViewHostSource<TabViewPwaDocument> => {
    let cache: readonly TabViewPwaDocument[] = []
    let encoded = '[]'
    const Read = () => {
      if (!live(record)) throw new Error('The native TabView source is unavailable.')
      const documents = Options.Clone(record.Bridge.Read())
      const next = JSON.stringify(documents)
      if (encoded !== next) { cache = documents; encoded = next }
      return [...cache]
    }
    return {
      Read,
      Write(Documents) {
        if (!live(record)) throw new Error('The native TabView source is unavailable.')
        const documents = Options.Clone(Documents)
        const next = JSON.stringify(documents)
        record.Bridge.Write(documents)
        if (JSON.stringify(Options.Clone(record.Bridge.Read())) !== next) throw new Error('Native TabView document writes must publish synchronously.')
        cache = [...Documents]; encoded = next
      },
      ReadSelectedItem: () => { const documents = Read(); const id = record.Bridge.ReadSelectedId(); return documents.find(document => document.Id === id) ?? null },
      WriteSelectedItem: document => { if (!live(record)) throw new Error('The native TabView source is unavailable.'); record.Bridge.WriteSelectedId(document?.Id ?? null) },
    }
  }
  const authenticated = (event: DragEvent, requirePayload: boolean): DragRecord | undefined => {
    const data = event.dataTransfer
    if (!data) return undefined
    const types = Array.from(data.types, format => format.toLowerCase())
    if (!types.includes(tabViewPwaNativeDragFormat)) return undefined
    const encodedToken = types.find(type => type.startsWith(tokenFormatPrefix))?.slice(tokenFormatPrefix.length)
    const drag = encodedToken ? family.Drags.get(encodedToken) : undefined
    if (!drag || !live(drag.Source) || drag.Controller.signal.aborted) return undefined
    if (requirePayload) {
      try {
        const payload = JSON.parse(data.getData(tabViewPwaNativeDragFormat))
        if (payload.Version !== 1 || payload.FamilyId !== family.Id || payload.DragId !== drag.Id ||
          payload.SourceWindowId !== drag.Source.WindowId || payload.SourceId !== drag.Source.Id) return undefined
      } catch { return undefined }
    }
    return drag
  }
  const tokenOf = (event: DragEvent) => {
    const types = Array.from(event.dataTransfer?.types ?? [], format => format.toLowerCase())
    return types.includes(tabViewPwaNativeDragFormat) ? types.find(type => type.startsWith(tokenFormatPrefix))?.slice(tokenFormatPrefix.length) : undefined
  }
  const brokerPreview = (control: object, event: DragEvent) => {
    const target = controls.get(control)
    const token = tokenOf(event)
    return target && live(target) && token ? broker.Preview(token) : null
  }
  const preview = (control: object, event: DragEvent): { Drag: DragRecord; Target: SourceRecord; Preview: TabViewNativeDragPreview } | undefined => {
    const target = controls.get(control)
    const drag = authenticated(event, false)
    if (!target || !live(target) || !drag || drag.Source.Window === owner || drag.State !== 'Dragging') return undefined
    try {
      const all = drag.Source.Proxy.Read()
      const items = Options.Clone(drag.DocumentIds.map(id => { const item = all.find(document => document.Id === id); if (!item) throw new Error('The dragged document was removed.'); return item }))
      const properties = { Items: items, SourceWindowId: drag.Source.WindowId, SourceId: drag.Source.Id }
      const value: TabViewNativeDragPreview = { Items: items,
        Tabs: items.map(item => ({ Header: item.Header, IconSource: { Symbol: item.Icon ?? 'Placeholder' }, IsClosable: true })),
        SourceWindowId: drag.Source.WindowId, SourceId: drag.Source.Id,
        Data: { Properties: properties, AvailableFormats: ['Text', tabViewPwaNativeDragFormat],
          Contains: format => ['Text', tabViewPwaNativeDragFormat].includes(format),
          GetTextAsync: async () => items.map(item => item.Header).join('\n'),
          GetDataAsync: async format => format === 'Text' ? items.map(item => item.Header).join('\n') : format === tabViewPwaNativeDragFormat ? { ...properties, Items: Options.Clone(items) } : undefined } }
      return { Drag: drag, Target: target, Preview: value }
    } catch { return undefined }
  }
  const waitAcceptance = (accept: TabViewNativeDragAcceptance | Promise<TabViewNativeDragAcceptance>, signal: AbortSignal) => new Promise<TabViewNativeDragAcceptance>((resolve, reject) => {
    if (signal.aborted) { resolve(false); return }
    const abort = () => resolve(false)
    signal.addEventListener('abort', abort, { once: true })
    Promise.resolve(accept).then(resolve, reject).finally(() => signal.removeEventListener('abort', abort))
  })
  const unregister = (control: object, record: SourceRecord) => {
    if (controls.get(control) !== record) return
    controls.delete(control)
    family.Sources.delete(record.Id)
    record.ReleaseBroker?.()
    for (const drag of family.Drags.values()) if (drag.Source === record || drag.Target === record) cancel(drag)
    changed()
  }
  const bridge: TabViewNativeDragBridge<TabViewPwaDocument> = {
    RegisterSource(control, source, options = {}) {
      if (disposed) throw new Error('The native TabView host is disposed.')
      const previous = controls.get(control)
      if (previous) unregister(control, previous)
      Options.Clone(source.Read())
      // Keep framework objects inside their owning callback closure. DTO
      // snapshots cross windows; retained containers and rollback keep the
      // original local object identity.
      const localDocuments = new Map(source.Read().map(document => [document.Id, document]))
      const realize = (documents: readonly TabViewPwaDocument[]) => {
        for (const document of source.Read()) localDocuments.set(document.Id, document)
        return Options.Clone(documents).map(document => {
          const local = localDocuments.get(document.Id)
          if (local) {
            local.Header = document.Header
            local.Title = document.Title
            local.IsOn = document.IsOn
            if (document.Icon === undefined) delete local.Icon
            else local.Icon = document.Icon
            return local
          }
          const created = options.RealizeDocument?.(document) ?? document
          localDocuments.set(document.Id, created)
          return created
        })
      }
      const record: SourceRecord = { Id: globalThis.crypto.randomUUID(), WindowId: windowId, Window: owner,
        IsActive: () => !disposed && broker.IsActive() && (owner as FamilyWindow).__winuiTabViewPwaFamilyV1 === family,
        Bridge: {
          Read: () => Options.Clone(source.Read()),
          Write: documents => source.Write(realize(documents)),
          ReadSelectedId: () => source.ReadSelectedItem?.()?.Id ?? null,
          WriteSelectedId: id => source.WriteSelectedItem?.(source.Read().find(document => document.Id === id) ?? null),
        },
        Proxy: undefined as unknown as TabViewHostSource<TabViewPwaDocument>,
        ...(options.OnTransferCompleted ? { OnTransferCompleted: options.OnTransferCompleted } : {}),
      }
      controls.set(control, record); family.Sources.set(record.Id, record)
      record.Proxy = proxyFor(record)
      record.ReleaseBroker = broker.RegisterSource(record.Id, record.Bridge, result => options.OnTransferCompleted?.(result))
      changed()
      return () => unregister(control, record)
    },
    Start(control, event, items, _tabs, signal, onDropCompleted) {
      const source = controls.get(control)
      if (disposed || !source || !live(source) || !event.dataTransfer || signal.aborted) return false
      const previousId = active.get(control)
      const previous = previousId ? family.Drags.get(previousId) : undefined
      if (previous) { cancel(previous); family.Drags.delete(previous.Id) }
      try {
        const documents = Options.Clone(items as readonly TabViewPwaDocument[])
        if (!documents.length || documents.some(document => !source.Bridge.Read().some(item => item.Id === document.Id))) return false
        const id = globalThis.crypto.randomUUID()
        let resolve!: (result: Operation) => void
        const result = new Promise<Operation>(done => { resolve = done })
        const controller = new AbortController()
        const abort = () => cancel(drag)
        const drag: DragRecord = { Id: id, Source: source, DocumentIds: documents.map(document => document.Id), Controller: controller,
          Observed: false, State: 'Dragging', Started: Date.now(), Promise: result,
          Finish(operation) {
            if (drag.State === 'Completed') return
            drag.State = 'Completed'; drag.Result = operation
            drag.RemoveSourceSignal(); resolve(operation)
            try { broker.Complete(id, operation) } catch { /* Direct-window completion is already authoritative. */ }
            // Moving the item removes its originating DOM node. Browsers may
            // omit dragend in that case, so the observed target's committed
            // outcome also releases the source control's drag lifecycle.
            if (drag.Observed) {
              try {
                if (onDropCompleted) {
                  const consumed = onDropCompleted(operation)
                  Promise.resolve(consumed).then(() => {
                    if (active.get(control) === id) active.delete(control)
                    family.Drags.delete(id)
                  }, () => undefined)
                }
              }
              catch { /* Completion notifications cannot revoke the outcome. */ }
            }
          },
          RemoveSourceSignal: () => signal.removeEventListener('abort', abort),
        }
        const payload = { Version: 1, FamilyId: family.Id, DragId: id, SourceWindowId: source.WindowId, SourceId: source.Id, BrokerWindowId: broker.WindowId }
        event.dataTransfer.setData(tabViewPwaNativeDragFormat, JSON.stringify(payload))
        event.dataTransfer.setData(`${tokenFormatPrefix}${id}`, id)
        family.Drags.set(id, drag); active.set(control, id)
        signal.addEventListener('abort', abort, { once: true })
        try {
          broker.Start(id, source.Id, documents, signal, operation => drag.Finish(operation), () => {
            drag.Observed = true
            if (drag.State === 'Dragging') drag.State = 'Dropping'
          })
        } catch { /* Same-family windows retain their synchronous transfer path. */ }
        return true
      } catch { return false }
    },
    Preview: (control, event) => preview(control, event)?.Preview ?? brokerPreview(control, event),
    OwnsDrag: (control, event) => Boolean(active.get(control) && active.get(control) === tokenOf(event)),
    Drop(control, event, index, accept, targetSignal) {
      const found = preview(control, event)
      const drag = authenticated(event, true)
      if (!found || found.Drag !== drag || !drag) {
        const token = tokenOf(event)
        const target = controls.get(control)
        if (!token || !target || !brokerPreview(control, event)) return Promise.resolve('None')
        try {
          const payload = JSON.parse(event.dataTransfer?.getData(tabViewPwaNativeDragFormat) ?? '')
          return broker.Validate(token, payload) ? broker.Drop(token, target.Id, index, accept, targetSignal) : Promise.resolve('None')
        } catch { return Promise.resolve('None') }
      }
      if (drag.Observed || !Number.isInteger(index)) return Promise.resolve('None')
      try {
        const targetBefore = found.Target.Proxy.Read()
        if (index < 0 || index > targetBefore.length || drag.DocumentIds.some(id => targetBefore.some(document => document.Id === id))) return Promise.resolve('None')
      }
      catch { return Promise.resolve('None') }
      // Establish source completion authority synchronously, before author
      // handlers defer or the browser delivers the source dragend event.
      drag.Observed = true; drag.State = 'Dropping'; drag.Target = found.Target
      const operationSignal = targetSignal ? AbortSignal.any([drag.Controller.signal, targetSignal]) : drag.Controller.signal
      void (async () => {
        try {
          const decision = operationSignal.aborted ? false : accept ? await waitAcceptance(accept(operationSignal), operationSignal) : true
          const accepted = typeof decision === 'boolean' ? decision : decision.Accepted
          const handled = typeof decision === 'boolean' ? false : decision.Handled
          if (!accepted) { drag.Controller.abort(); drag.Finish('None'); return }
          if (!live(drag.Source) || !live(found.Target) || operationSignal.aborted) { drag.Controller.abort(); drag.Finish('None'); return }
          const sourceItems = drag.Source.Proxy.Read()
          const targetItems = found.Target.Proxy.Read()
          const alreadyMoved = drag.DocumentIds.every(id => !sourceItems.some(document => document.Id === id) && targetItems.some(document => document.Id === id))
          if (handled && !alreadyMoved) { drag.Controller.abort(); drag.Finish('None'); return }
          const items = drag.DocumentIds.map(id => { const item = (alreadyMoved ? targetItems : sourceItems).find(document => document.Id === id); if (!item) throw new Error('The dragged document changed.'); return item })
          const result = alreadyMoved
            ? { Status: 'Accepted' as const, Items: items, Target: found.Target.Proxy, DropIndex: targetItems.indexOf(items[0]!) }
            : await family.Adapter.Move({ Source: drag.Source.Proxy, Target: found.Target.Proxy, Items: items, Tabs: [], DropIndex: index, Signal: operationSignal })
          if (result.Status !== 'Accepted') { drag.Controller.abort(); drag.Finish('None'); return }
          drag.Finish('Move')
          // Closing an emptied source here is safe: the transaction and its
          // completion acknowledgement are already committed.
          try { Promise.resolve(drag.Source.OnTransferCompleted?.(result)).catch(() => undefined) } catch { /* A notification cannot revoke a committed Move. */ }
        } catch { drag.Controller.abort(); drag.Finish('None') }
      })()
      return drag.Promise
    },
    End(control, _event) {
      const id = active.get(control)
      const drag = id ? family.Drags.get(id) : undefined
      active.delete(control)
      if (!drag) return undefined
      if (!drag.Observed && broker.Observe(drag.Id)) { drag.Observed = true; drag.State = 'Dropping' }
      if (!drag.Observed && broker.Available) {
        // Chromium storage mirrors and cross-window message delivery can lag
        // behind native dragend. Keep ownership until the receiver has had a
        // bounded opportunity to acknowledge a real Drop.
        const timeout = owner.setTimeout(() => {
          if (!drag.Observed && drag.State !== 'Completed') cancel(drag)
        }, 1000)
        drag.Promise.finally(() => { owner.clearTimeout(timeout); family.Drags.delete(drag.Id) })
        return drag.Promise
      }
      if (!drag.Observed) { cancel(drag); family.Drags.delete(drag.Id); return undefined }
      const result = drag.Promise
      result.finally(() => family.Drags.delete(drag.Id))
      return result
    },
  }
  return {
    Bridge: bridge,
    AllowWindow(window, id) { family.Windows.set(id, window) },
    HasSource(window = owner) {
      return [...family.Sources.values()].some(record => record.Window === window && live(record)) &&
        (broker.Available || [...family.Sources.values()].some(record => record.Window !== window && live(record)))
    },
    HasBrokerSource: id => broker.HasWindowSource(id),
    Sweep() {
      broker.Sweep()
      let updated = false
      for (const [id, record] of family.Sources) {
        try {
          // Suspended BFCache roots keep their registration for pageshow;
          // closed, navigated and replaced roots release stale closures.
          if (record.Window.closed || record.Window.location.origin !== family.Origin ||
            (record.Window as FamilyWindow).__winuiTabViewPwaFamilyV1 !== family) { family.Sources.delete(id); updated = true }
        } catch { family.Sources.delete(id); updated = true }
      }
      for (const [id, drag] of family.Drags) {
        if (!live(drag.Source) || drag.Target && !live(drag.Target) || Date.now() - drag.Started > 120000) {
          cancel(drag)
          if (drag.State === 'Completed') family.Drags.delete(id)
        }
      }
      for (const [id, window] of family.Windows) {
        try {
          if (window.closed || window.location.origin !== family.Origin) { family.Windows.delete(id); updated = true }
        } catch { family.Windows.delete(id); updated = true }
      }
      if (updated) changed()
    },
    Dispose() {
      if (disposed) return
      disposed = true
      for (const [control, record] of controls) unregister(control, record)
      for (const id of active.values()) { const drag = family.Drags.get(id); if (drag) { cancel(drag); if (drag.State === 'Completed') family.Drags.delete(id) } }
      active.clear()
      broker.Dispose()
    },
  }
}
