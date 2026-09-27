import type { TabViewHostAccepted } from './tabViewHostAdapter'
import type { TabViewPwaDocument } from './tabViewPwaHost'
import type { TabViewNativeDragAcceptance, TabViewNativeDragPreview } from './tabViewNativeDragBridge'
import { getTabViewPwaBroker } from './tabViewPwaBroker'

type Operation = 'Move' | 'None'
export interface TabViewPwaBrokerSource {
  Read(): TabViewPwaDocument[]
  Write(Documents: readonly TabViewPwaDocument[]): void
  ReadSelectedId(): string | null
  WriteSelectedId(Id: string | null): void
}
type Journal = {
  Version: 2; Id: string; SourceWindowId: string; SourceId: string; Documents: TabViewPwaDocument[]
  Started: number; State: 'Dragging' | 'Observed' | 'Prepared' | 'TargetReady' | 'SourceCommitted' | 'Completed' | 'Cancelled'
  Transaction?: string; TargetWindowId?: string; TargetId?: string; Operation?: Operation
  Error?: string
}
type Source = { Bridge: TabViewPwaBrokerSource; Release(): void; Completed?(Result: TabViewHostAccepted<TabViewPwaDocument>): void }
type LocalDrag = { Id: string; SourceId: string; Signal: AbortSignal; Finish(Operation: Operation): void; Observed(): void
  Before?: TabViewPwaDocument[]; Selected?: string | null; Written?: boolean; Completed?: boolean; Journal?: Journal; RemoveSignal(): void }

export function createTabViewPwaDragBroker(Options: {
  Window: Window; Clone(Documents: readonly TabViewPwaDocument[]): TabViewPwaDocument[]
}) {
  const broker = getTabViewPwaBroker(Options.Window)
  const sources = new Map<string, Source>()
  const drags = new Map<string, LocalDrag>()
  const targets = new Map<string, { Controller: AbortController; Rollback(): void }>()
  const key = (id: string) => `drag:${id}`
  const read = (id: string) => {
    const journal = broker.Read<Journal>(key(id))
    if (!journal || journal.Version !== 2 || journal.Id !== id || Date.now() - journal.Started > 120000) return undefined
    try { Options.Clone(journal.Documents); return journal } catch { return undefined }
  }
  const finishSource = (drag: LocalDrag, operation: Operation) => {
    if (drag.Completed) return
    const journal = read(drag.Id)
    if (journal?.State === 'Completed' && journal.Operation === 'Move') operation = 'Move'
    const source = sources.get(drag.SourceId)
    if (operation === 'None' && drag.Written && source && drag.Before) {
      source.Bridge.Write(drag.Before); source.Bridge.WriteSelectedId(drag.Selected ?? null)
    }
    drag.Completed = true; drag.RemoveSignal(); drags.delete(drag.Id)
    if (journal?.Transaction) drag.Observed()
    drag.Finish(operation)
    if (operation === 'Move' && source) {
      try { Promise.resolve(source.Completed?.({ Status: 'Accepted', Items: journal?.Documents ?? [] })).catch(() => undefined) } catch { /* Committed notification. */ }
    }
  }
  const update = (id: string, state: Journal['State'], operation?: Operation) => {
    const journal = read(id)
    if (!journal || journal.State === 'Completed') return
    broker.Write(key(id), { ...journal, State: state, ...(operation ? { Operation: operation } : {}) })
  }
  const sourceRequest = (id: string, method: string, data: unknown) => {
    const request = data as { DragId?: string; Transaction?: string; Journal?: Journal }
    const drag = request?.DragId ? drags.get(request.DragId) : undefined
    const durable = request?.DragId ? read(request.DragId) : undefined
    const sent = request?.Journal
    const journal = sent?.Id === request.DragId && sent.SourceId === id && sent.SourceWindowId === broker.WindowId && sent.Transaction === request.Transaction
      ? sent : drag?.Journal ?? durable
    const source = sources.get(id)
    if (!drag && journal?.State === 'Completed' && journal.SourceId === id && journal.Transaction === request.Transaction && ['Finalize', 'Rollback'].includes(method)) return true
    if (!drag || drag.SourceId !== id || !journal || !source || journal.Transaction !== request.Transaction) throw new Error('The TabView drag transaction is unavailable.')
    drag.Observed()
    if (method === 'Rollback') {
      if (journal.State === 'Completed' && journal.Operation === 'Move') finishSource(drag, 'Move')
      else { update(drag.Id, 'Cancelled', 'None'); finishSource(drag, 'None') }
      return true
    }
    if (method === 'Finalize') {
      if (journal.State !== 'Completed' || journal.Operation !== 'Move') throw new Error('The TabView target did not commit.')
      drag.Journal = journal; finishSource(drag, 'Move'); return true
    }
    if (drag.Signal.aborted || journal.State === 'Cancelled') throw new Error('The TabView drag was cancelled.')
    if (method === 'Prepare') {
      if (!['Observed', 'Prepared'].includes(journal.State)) throw new Error('The TabView Drop was not observed.')
      const before = Options.Clone(source.Bridge.Read())
      const documents = journal.Documents.map(document => {
        const current = before.find(item => item.Id === document.Id)
        if (!current) throw new Error('The dragged TabView document changed.')
        return current
      })
      drag.Before = before; drag.Selected = source.Bridge.ReadSelectedId()
      const prepared: Journal = { ...journal, Documents: documents, State: 'Prepared' }
      drag.Journal = prepared
      broker.Write(key(drag.Id), prepared)
      return { Documents: Options.Clone(documents), Journal: prepared }
    }
    if (method === 'Commit') {
      if (journal.State !== 'TargetReady' || drag.Journal?.State !== 'Prepared' || !drag.Before || JSON.stringify(source.Bridge.Read()) !== JSON.stringify(drag.Before) || source.Bridge.ReadSelectedId() !== drag.Selected) {
        throw new Error('The TabView source changed before transfer.')
      }
      const moved = new Set(journal.Documents.map(document => document.Id))
      const remaining = drag.Before.filter(document => !moved.has(document.Id))
      try {
        source.Bridge.Write(remaining)
        if (drag.Selected && moved.has(drag.Selected)) {
          const index = drag.Before.findIndex(document => document.Id === drag.Selected)
          source.Bridge.WriteSelectedId(remaining[Math.min(index, remaining.length - 1)]?.Id ?? null)
        }
        if (JSON.stringify(source.Bridge.Read()) !== JSON.stringify(remaining)) throw new Error('TabView source writes must publish synchronously.')
        drag.Written = true
        const current = read(drag.Id)
        if (current?.State === 'Cancelled' || drag.Signal.aborted) throw new Error('The target cancelled before source commit.')
        const committed: Journal = { ...journal, State: 'SourceCommitted' }
        drag.Journal = committed
        broker.Write(key(drag.Id), committed)
        return committed
      } catch (error) {
        source.Bridge.Write(drag.Before); source.Bridge.WriteSelectedId(drag.Selected ?? null)
        drag.Written = false; throw error
      }
    }
    throw new Error('Unknown TabView broker operation.')
  }
  const watch = broker.Watch(changed => {
    if (!changed.startsWith('drag:')) return
    const id = changed.slice(5)
    const journal = read(id)
    if (journal?.State === 'Cancelled') targets.get(id)?.Controller.abort()
    const drag = drags.get(id)
    if (!drag || !journal) return
    if (journal.Transaction) drag.Observed()
    if (journal.State === 'Completed') finishSource(drag, journal.Operation === 'Move' ? 'Move' : 'None')
    else if (journal.State === 'Cancelled') finishSource(drag, 'None')
  })
  const abortTarget = (id: string) => { const target = targets.get(id); if (!target) return; target.Controller.abort(); target.Rollback(); update(id, 'Cancelled', 'None') }
  const hidden = () => {
    for (const id of targets.keys()) abortTarget(id)
    for (const drag of [...drags.values()]) {
      const journal = read(drag.Id)
      if (journal?.State === 'Completed') finishSource(drag, journal.Operation === 'Move' ? 'Move' : 'None')
      else { update(drag.Id, 'Cancelled', 'None'); if (!drag.Completed) finishSource(drag, 'None') }
    }
  }
  Options.Window.addEventListener('pagehide', hidden)
  const preview = (id: string): TabViewNativeDragPreview | null => {
    const journal = read(id)
    if (!journal || journal.SourceWindowId === broker.WindowId || journal.State !== 'Dragging' || !broker.Alive(journal.SourceWindowId)) return null
    const items = Options.Clone(journal.Documents)
    const properties = { Items: items, SourceWindowId: journal.SourceWindowId, SourceId: journal.SourceId }
    return { ...properties, Tabs: items.map(item => ({ Header: item.Header, IconSource: { Symbol: item.Icon ?? 'Placeholder' }, IsClosable: true })),
      Data: { Properties: properties, AvailableFormats: ['Text'], Contains: format => format === 'Text', GetTextAsync: async () => items.map(item => item.Header).join('\n'),
        GetDataAsync: async format => format === 'Text' ? items.map(item => item.Header).join('\n') : undefined } }
  }
  return {
    Available: broker.Available,
    WindowId: broker.WindowId,
    IsActive: () => !broker.Available || broker.Alive(broker.WindowId),
    RegisterSource(id: string, bridge: TabViewPwaBrokerSource, completed?: Source['Completed']) {
      const release = broker.Register(id, (method, data) => sourceRequest(id, method, data))
      sources.set(id, { Bridge: bridge, Release: release, ...(completed ? { Completed: completed } : {}) })
      if (broker.Available) broker.Write(`native:${id}`, { WindowId: broker.WindowId })
      return () => {
        for (const drag of [...drags.values()]) if (drag.SourceId === id) update(drag.Id, 'Cancelled', 'None')
        for (const [dragId, target] of targets) { void target; const journal = read(dragId); if (journal?.TargetId === id) abortTarget(dragId) }
        release(); sources.delete(id)
        broker.Remove(`native:${id}`)
      }
    },
    Start(id: string, sourceId: string, documents: readonly TabViewPwaDocument[], signal: AbortSignal,
      finish: (Operation: Operation) => void, observed: () => void) {
      if (!broker.Available) return
      broker.Refresh()
      const abort = () => update(id, 'Cancelled', 'None')
      drags.set(id, { Id: id, SourceId: sourceId, Signal: signal, Finish: finish, Observed: observed, RemoveSignal: () => signal.removeEventListener('abort', abort) })
      broker.Write(key(id), { Version: 2, Id: id, SourceWindowId: broker.WindowId, SourceId: sourceId,
        Documents: Options.Clone(documents), Started: Date.now(), State: 'Dragging' } satisfies Journal)
      signal.addEventListener('abort', abort, { once: true })
    },
    Observe(id: string) { const journal = read(id); return Boolean(journal && journal.State !== 'Dragging') },
    HasWindowSource(windowId: string) {
      return broker.Available && broker.Alive(windowId) && broker.Keys('native:').some(key => broker.Read<{ WindowId: string }>(key)?.WindowId === windowId)
    },
    Preview: preview,
    Validate(id: string, payload: unknown) {
      const journal = read(id)
      const value = payload as { Version?: number; DragId?: string; SourceId?: string; BrokerWindowId?: string }
      return Boolean(journal && value?.Version === 1 && value.DragId === id && value.SourceId === journal.SourceId && value.BrokerWindowId === journal.SourceWindowId)
    },
    Complete(id: string, operation: Operation) {
      const drag = drags.get(id)
      if (drag) { drag.Completed = true; drag.RemoveSignal(); drags.delete(id) }
      const journal = read(id)
      // The receiving broker owns transactional completion. Source callbacks
      // must not overwrite its final state using a delayed storage mirror.
      if (journal && !journal.Transaction && journal.State !== 'Completed') broker.Write(key(id), { ...journal, State: 'Completed', Operation: operation })
    },
    async Drop(id: string, targetId: string, index: number, accept?: (Signal: AbortSignal) => TabViewNativeDragAcceptance | Promise<TabViewNativeDragAcceptance>, signal?: AbortSignal): Promise<Operation> {
      const target = sources.get(targetId)
      const journal = read(id)
      if (!target || !journal || !preview(id) || !Number.isInteger(index)) return 'None'
      const before = Options.Clone(target.Bridge.Read())
      if (index < 0 || index > before.length || journal.Documents.some(document => before.some(item => item.Id === document.Id))) return 'None'
      const transaction = globalThis.crypto.randomUUID()
      const controller = new AbortController()
      const operationSignal = signal ? AbortSignal.any([signal, controller.signal]) : controller.signal
      const selected = target.Bridge.ReadSelectedId()
      let published = false
      const rollback = () => {
        if (!published) return
        const moved = new Set(journal.Documents.map(document => document.Id))
        // Preserve unrelated updates while removing only this staged transfer.
        const current = target.Bridge.Read().filter(document => !moved.has(document.Id))
        target.Bridge.Write(current)
        if (moved.has(target.Bridge.ReadSelectedId() ?? '')) target.Bridge.WriteSelectedId(current.some(document => document.Id === selected) ? selected : current[0]?.Id ?? null)
        published = false
      }
      targets.set(id, { Controller: controller, Rollback: rollback })
      const cancel = () => { rollback(); update(id, 'Cancelled', 'None') }
      operationSignal.addEventListener('abort', cancel, { once: true })
      // A synchronous durable observation beats a source dragend delivered
      // before BroadcastChannel's asynchronous Prepare message.
      broker.Write(key(id), { ...journal, State: 'Observed', Transaction: transaction, TargetWindowId: broker.WindowId, TargetId: targetId })
      try {
        const decision = accept ? await Promise.race([Promise.resolve(accept(operationSignal)), new Promise<false>(resolve => operationSignal.addEventListener('abort', () => resolve(false), { once: true }))]) : true
        if (operationSignal.aborted || !(typeof decision === 'boolean' ? decision : decision.Accepted) || typeof decision !== 'boolean' && decision.Handled) throw new Error('Rejected')
        const observed: Journal = { ...journal, State: 'Observed', Transaction: transaction, TargetWindowId: broker.WindowId, TargetId: targetId }
        const request = { DragId: id, Transaction: transaction, Journal: observed }
        const preparation = await broker.Request(journal.SourceWindowId, journal.SourceId, 'Prepare', request, operationSignal) as { Documents: TabViewPwaDocument[]; Journal: Journal }
        const documents = Options.Clone(preparation.Documents)
        const prepared = preparation.Journal
        if (prepared?.State !== 'Prepared' || prepared.Transaction !== transaction || JSON.stringify(target.Bridge.Read()) !== JSON.stringify(before)) {
          throw new Error(`The TabView target changed (${prepared?.State ?? 'Unavailable'}).`)
        }
        const after = [...before]; after.splice(index, 0, ...documents)
        published = true
        target.Bridge.Write(after); target.Bridge.WriteSelectedId(documents[0]?.Id ?? null)
        if (JSON.stringify(target.Bridge.Read()) !== JSON.stringify(after)) throw new Error('TabView target writes must publish synchronously.')
        const ready: Journal = { ...prepared, State: 'TargetReady' }
        broker.Write(key(id), ready)
        const committed = await broker.Request(journal.SourceWindowId, journal.SourceId, 'Commit', { ...request, Journal: ready }, operationSignal) as Journal
        if (operationSignal.aborted || committed?.State !== 'SourceCommitted' || committed.Transaction !== transaction || JSON.stringify(target.Bridge.Read()) !== JSON.stringify(after)) throw new Error('The TabView transfer was cancelled.')
        const completed: Journal = { ...committed, State: 'Completed', Operation: 'Move' }
        broker.Write(key(id), completed)
        published = false
        // Durable completion is authoritative even if the source is suspended
        // before its fast acknowledgement; it consumes the journal on resume.
        void broker.Request(journal.SourceWindowId, journal.SourceId, 'Finalize', { ...request, Journal: completed }).catch(() => undefined)
        return 'Move'
      } catch (error) {
        rollback(); update(id, 'Cancelled', 'None')
        const cancelled = read(id)
        if (cancelled?.Operation !== 'Move') broker.Write(key(id), { ...cancelled, Error: String(error) })
        void broker.Request(journal.SourceWindowId, journal.SourceId, 'Rollback', { DragId: id, Transaction: transaction }).catch(() => undefined)
        return 'None'
      } finally { operationSignal.removeEventListener('abort', cancel); targets.delete(id) }
    },
    Sweep() {
      broker.Refresh()
      for (const key of broker.Keys('drag:')) {
        const journal = broker.Read<Journal>(key)
        if (journal && Date.now() - journal.Started > 120000 && ['Completed', 'Cancelled'].includes(journal.State)) broker.Remove(key)
      }
      for (const drag of [...drags.values()]) {
        const journal = read(drag.Id)
        if (!journal) { drag.RemoveSignal(); drags.delete(drag.Id); continue }
        if (journal.State === 'Completed') finishSource(drag, journal.Operation === 'Move' ? 'Move' : 'None')
        else if (journal.State === 'Cancelled') finishSource(drag, 'None')
      }
    },
    Dispose() {
      hidden(); watch(); Options.Window.removeEventListener('pagehide', hidden)
      for (const source of sources.values()) source.Release()
      for (const id of sources.keys()) broker.Remove(`native:${id}`)
      sources.clear()
    },
  }
}
