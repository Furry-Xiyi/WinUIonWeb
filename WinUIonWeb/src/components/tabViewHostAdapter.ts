/** Host integration for native TabView windowing events, without a framework runtime. */
export const tabViewHostAdapterKey = Symbol.for('WinUI.TabViewHostAdapter')

export type TabViewWindowId = string | number
export type TabViewSplitEdge = 'Left' | 'Right' | 'Top' | 'Bottom'
export type TabViewHostCancellationReason =
  | 'HostUnavailable' | 'Cancelled' | 'Disposed' | 'Busy'
  | 'InvalidItems' | 'InvalidTarget' | 'SourceChanged' | 'TargetChanged'
  | 'Rejected' | 'HostError' | 'UpdateFailed' | 'RollbackFailed' | 'WindowUnavailable'

export interface TabViewHostCancelled {
  Status: 'Cancelled'
  Reason: TabViewHostCancellationReason
  Error?: unknown
  RollbackErrors?: readonly unknown[]
}

export interface TabViewHostAccepted<T = unknown> {
  Status: 'Accepted'
  Items: readonly T[]
  NewWindowId?: TabViewWindowId
  Target?: TabViewHostSource<T>
  DropIndex?: number
}

export type TabViewHostResult<T = unknown> = TabViewHostAccepted<T> | TabViewHostCancelled
export type TabViewHostDecision = { Status: 'Accepted' } | TabViewHostCancelled
type Awaitable<T> = T | Promise<T>

/**
 * Write must publish synchronously to Read. Vue reactive arrays, React external
 * stores, Angular signals, and Svelte stores can all implement this contract.
 * React component state can mirror the store in its subscription.
 */
export interface TabViewHostSource<T = unknown> {
  Read(): readonly T[]
  Write(Items: readonly T[]): void
  ReadSelectedItem?(): T | null | undefined
  WriteSelectedItem?(Item: T | null): void
}

export interface TabViewHostRequest<T = unknown> {
  Source: TabViewHostSource<T>
  Items: readonly T[]
  Tabs: readonly unknown[]
  Signal?: AbortSignal
  Pointer?: { ScreenX: number; ScreenY: number }
}

export interface TabViewHostMoveRequest<T = unknown> extends TabViewHostRequest<T> {
  Target: TabViewHostSource<T>
  DropIndex: number
}

export interface TabViewHostSplitRequest<T = unknown> extends TabViewHostRequest<T> {
  Edge: TabViewSplitEdge
}

export interface TabViewHostTearOutRequest<T = unknown> extends TabViewHostRequest<T> {
  NewWindowId: TabViewWindowId
}

export interface TabViewHostDestination<T = unknown> {
  Status: 'Accepted'
  NewWindowId: TabViewWindowId
  Target: TabViewHostSource<T>
  /** Finish preparing the destination before either collection changes. */
  Commit?(Request: TabViewHostMoveRequest<T>): Awaitable<TabViewHostDecision | void>
  /** Release a prepared window or pane when its transfer is cancelled. */
  Dispose?(): Awaitable<void>
}

export interface TabViewHostOptions<T = unknown> {
  CreateWindow?(Request: TabViewHostRequest<T>): Awaitable<TabViewHostDestination<T> | TabViewHostCancelled>
  Split?(Request: TabViewHostSplitRequest<T>): Awaitable<TabViewHostDestination<T> | TabViewHostCancelled>
  Move?(Request: TabViewHostMoveRequest<T>): Awaitable<TabViewHostDecision | void>
  /** Optional framework batching. The supplied operation must run synchronously. */
  Batch?(Operation: () => void): void
}

export interface TabViewHostAdapter<T = unknown> {
  CreateWindow(Request: TabViewHostRequest<T>): Promise<TabViewHostResult<T>>
  TearOut(Request: TabViewHostTearOutRequest<T>): Promise<TabViewHostResult<T>>
  OpenWindow(Request: TabViewHostRequest<T>): Promise<TabViewHostResult<T>>
  Move(Request: TabViewHostMoveRequest<T>): Promise<TabViewHostResult<T>>
  Split(Request: TabViewHostSplitRequest<T>): Promise<TabViewHostResult<T>>
  CancelWindow(NewWindowId: TabViewWindowId): Promise<void>
  Dispose(): Promise<void>
}

export function createTabViewCallbackSource<T>(Callbacks: TabViewHostSource<T>): TabViewHostSource<T> {
  return {
    Read: () => [...Callbacks.Read()],
    Write: Items => Callbacks.Write([...Items]),
    ...(Callbacks.ReadSelectedItem ? { ReadSelectedItem: () => Callbacks.ReadSelectedItem!() } : {}),
    ...(Callbacks.WriteSelectedItem ? { WriteSelectedItem: (Item: T | null) => Callbacks.WriteSelectedItem!(Item) } : {}),
  }
}

export interface TabViewMutableCollection<T> {
  readonly Count?: number
  readonly Size?: number
  GetAt?(Index: number): T
  [Symbol.iterator]?(): Iterator<T>
  RemoveAt(Index: number): unknown
  InsertAt?(Index: number, Item: T): unknown
  Insert?(Index: number, Item: T): unknown
}

type SelectionCallbacks<T> = Pick<TabViewHostSource<T>, 'ReadSelectedItem' | 'WriteSelectedItem'>
const collectionSources = new WeakMap<object, TabViewHostSource<unknown>>()

/** Adapts TabItems without clearing unaffected containers or their selection. */
export function createTabViewMutableCollectionSource<T>(
  Collection: TabViewMutableCollection<T>,
  Selection?: SelectionCallbacks<T>,
): TabViewHostSource<T> {
  const cached = !Selection && collectionSources.get(Collection)
  if (cached) return cached as TabViewHostSource<T>
  const Read = (): T[] => {
    if (Collection[Symbol.iterator]) return Array.from(Collection as Iterable<T>)
    const count = Collection.Count ?? Collection.Size ?? 0
    if (!Collection.GetAt) throw new TypeError('TabItems must expose GetAt or an iterator.')
    return Array.from({ length: count }, (_, index) => Collection.GetAt!(index))
  }
  const Insert = Collection.InsertAt ?? Collection.Insert
  if (!Insert) throw new TypeError('TabItems must expose InsertAt or Insert.')
  const source: TabViewHostSource<T> = {
    Read,
    Write(Items) {
      const current = Read()
      for (let index = current.length - 1; index >= 0; index--) {
        const item = current[index]!
        const wanted = Items.filter(candidate => Object.is(candidate, item)).length
        const existing = current.slice(0, index + 1).filter(candidate => Object.is(candidate, item)).length
        if (existing > wanted) {
          Collection.RemoveAt(index)
          current.splice(index, 1)
        }
      }
      for (let index = 0; index < Items.length; index++) {
        const item = Items[index]!
        if (index < current.length && Object.is(current[index], item)) continue
        const existing = current.findIndex((candidate, position) => position > index && Object.is(candidate, item))
        if (existing >= 0) {
          Collection.RemoveAt(existing)
          current.splice(existing, 1)
        }
        Insert.call(Collection, index, item)
        current.splice(index, 0, item)
      }
      while (current.length > Items.length) {
        Collection.RemoveAt(current.length - 1)
        current.pop()
      }
    },
    ...Selection,
  }
  if (!Selection) collectionSources.set(Collection, source as TabViewHostSource<unknown>)
  return source
}

const cancelled = (Reason: TabViewHostCancellationReason, Error?: unknown): TabViewHostCancelled => ({
  Status: 'Cancelled', Reason, ...(Error === undefined ? {} : { Error }),
})
const sameItems = <T>(left: readonly T[], right: readonly T[]) =>
  left.length === right.length && left.every((item, index) => Object.is(item, right[index]))

function validItems<T>(Source: TabViewHostSource<T>, Items: readonly T[]): boolean {
  const source = Source.Read()
  return Items.length > 0 && Items.every((item, index) =>
    Items.findIndex(candidate => Object.is(candidate, item)) === index &&
    source.filter(candidate => Object.is(candidate, item)).length === 1,
  )
}

function waitForSignal<T>(PromiseValue: Promise<T>, Signal: AbortSignal): Promise<T> {
  if (Signal.aborted) return Promise.reject(Signal.reason)
  return new Promise((resolve, reject) => {
    const abort = () => reject(Signal.reason)
    Signal.addEventListener('abort', abort, { once: true })
    PromiseValue.then(resolve, reject).finally(() => Signal.removeEventListener('abort', abort))
  })
}

/**
 * CreateWindow corresponds to TabTearOutWindowRequested; TearOut corresponds to
 * TabTearOutRequested. The host owns actual windows and panes after acceptance.
 */
export function createTabViewHostAdapter<T = unknown>(Options: TabViewHostOptions<T> = {}): TabViewHostAdapter<T> {
  const pending = new Map<TabViewWindowId, {
    Destination: TabViewHostDestination<T>
    Request: TabViewHostRequest<T>
    End(): void
  }>()
  const locks = new WeakSet<TabViewHostSource<T>>()
  const operations = new Map<AbortController, Promise<void>>()
  const releases = new WeakMap<TabViewHostDestination<T>, Promise<void>>()
  const cleanups = new Set<Promise<void>>()
  const cleanupErrors: unknown[] = []
  let disposed = false

  const release = (destination: TabViewHostDestination<T>): Promise<void> => {
    const existing = releases.get(destination)
    if (existing) return existing
    // Publish the promise before invoking host code, including a reentrant Dispose.
    let resolve!: () => void
    let reject!: (reason: unknown) => void
    const cleanup = new Promise<void>((done, fail) => { resolve = done; reject = fail })
    releases.set(destination, cleanup)
    cleanups.add(cleanup)
    cleanup.then(() => cleanups.delete(cleanup), error => { cleanups.delete(cleanup); cleanupErrors.push(error) })
    try { Promise.resolve(destination.Dispose?.()).then(resolve, reject) }
    catch (error) { reject(error) }
    return cleanup
  }
  const begin = (Signal?: AbortSignal) => {
    const controller = new AbortController()
    const abort = () => controller.abort(Signal?.reason)
    if (disposed) controller.abort('Disposed')
    else if (Signal?.aborted) abort()
    else Signal?.addEventListener('abort', abort, { once: true })
    let finish!: () => void
    operations.set(controller, new Promise<void>(resolve => { finish = resolve }))
    return {
      Signal: controller.signal,
      End() {
        operations.delete(controller)
        Signal?.removeEventListener('abort', abort)
        finish()
      },
    }
  }
  const aborted = () => cancelled(disposed ? 'Disposed' : 'Cancelled')
  const batch = (Operation: () => void) => {
    if (!Options.Batch) return Operation()
    let completed = false
    Options.Batch(() => { Operation(); completed = true })
    if (!completed) throw new TypeError('TabView host Batch must run synchronously.')
  }

  const prepare = async (
    Request: TabViewHostRequest<T>,
    Create: TabViewHostOptions<T>['CreateWindow'],
  ): Promise<TabViewHostResult<T>> => {
    if (disposed) return cancelled('Disposed')
    if (Request.Signal?.aborted) return cancelled('Cancelled')
    if (!Create) return cancelled('HostUnavailable')
    let valid: boolean
    try { valid = validItems(Request.Source, Request.Items) }
    catch (error) { return cancelled('HostError', error) }
    if (!valid) return cancelled('InvalidItems')
    const operation = begin(Request.Signal)
    const request = { ...Request, Items: [...Request.Items], Tabs: [...Request.Tabs], Signal: operation.Signal }
    let destination: TabViewHostDestination<T> | undefined
    let creation: Promise<TabViewHostDestination<T> | TabViewHostCancelled> | undefined
    let retained = false
    try {
      creation = Promise.resolve(Create(request))
      const result = await waitForSignal(creation, operation.Signal)
      if (result.Status === 'Cancelled') return result
      destination = result
      if (operation.Signal.aborted) {
        await release(result)
        return aborted()
      }
      if (!result.Target || result.Target === Request.Source ||
        !['string', 'number'].includes(typeof result.NewWindowId) || pending.has(result.NewWindowId)) {
        await release(result)
        return cancelled('InvalidTarget')
      }
      const abort = () => {
        if (pending.get(result.NewWindowId)?.Destination !== result) return
        pending.delete(result.NewWindowId)
        end()
        void release(result).catch(() => undefined)
      }
      const end = () => {
        operation.Signal.removeEventListener('abort', abort)
        operation.End()
      }
      operation.Signal.addEventListener('abort', abort, { once: true })
      pending.set(result.NewWindowId, { Destination: result, Request: request, End: end })
      retained = true
      return { Status: 'Accepted', Items: request.Items, NewWindowId: result.NewWindowId, Target: result.Target }
    } catch (error) {
      if (operation.Signal.aborted) {
        // A host that completes after cancellation still has to release its window.
        void creation?.then(result => result.Status === 'Accepted' ? release(result) : undefined).catch(() => undefined)
        return aborted()
      }
      if (destination) {
        try { await release(destination) } catch { /* Preserve the original host error. */ }
      }
      return cancelled('HostError', error)
    } finally { if (!retained) operation.End() }
  }

  const transfer = async (
    Request: TabViewHostMoveRequest<T>,
    Commit?: TabViewHostDestination<T>['Commit'],
  ): Promise<TabViewHostResult<T>> => {
    if (disposed) return cancelled('Disposed')
    if (Request.Signal?.aborted) return cancelled('Cancelled')
    const { Source, Target } = Request
    if (!Source || !Target || !Number.isInteger(Request.DropIndex)) return cancelled('InvalidTarget')
    if (locks.has(Source) || locks.has(Target)) return cancelled('Busy')
    locks.add(Source)
    locks.add(Target)
    const operation = begin(Request.Signal)
    const request = { ...Request, Items: [...Request.Items], Tabs: [...Request.Tabs], Signal: operation.Signal }
    try {
      if (!validItems(Source, request.Items)) return cancelled('InvalidItems')
      const sourceBefore = [...Source.Read()]
      const targetBefore = Source === Target ? sourceBefore : [...Target.Read()]
      if (request.DropIndex < 0 || request.DropIndex > targetBefore.length) return cancelled('InvalidTarget')
      if (Source !== Target && request.Items.some(item => targetBefore.some(candidate => Object.is(item, candidate)))) {
        return cancelled('InvalidItems')
      }
      for (const approve of [Options.Move, Commit]) {
        if (!approve) continue
        const decision = await waitForSignal(Promise.resolve(approve(request)), operation.Signal)
        if (decision?.Status === 'Cancelled') return decision
        if (operation.Signal.aborted) return aborted()
      }
      if (!sameItems(sourceBefore, Source.Read())) return cancelled('SourceChanged')
      if (Source !== Target && !sameItems(targetBefore, Target.Read())) return cancelled('TargetChanged')
      if (operation.Signal.aborted) return aborted()
      const selectedSource = Source.ReadSelectedItem?.()
      const selectedTarget = Target.ReadSelectedItem?.()
      const isMoved = (item: T) => request.Items.some(candidate => Object.is(item, candidate))
      const sourceAfter = sourceBefore.filter(item => !isMoved(item))
      const removedBefore = Source === Target ? sourceBefore.slice(0, request.DropIndex).filter(isMoved).length : 0
      const dropIndex = request.DropIndex - removedBefore
      const targetAfter = Source === Target ? sourceAfter : [...targetBefore]
      targetAfter.splice(dropIndex, 0, ...request.Items)
      try {
        batch(() => {
          if (operation.Signal.aborted) throw operation.Signal.reason
          if (Source !== Target) Source.Write(sourceAfter)
          if (operation.Signal.aborted) throw operation.Signal.reason
          Target.Write(targetAfter)
          if (operation.Signal.aborted) throw operation.Signal.reason
          if (Source !== Target && selectedSource !== undefined && selectedSource !== null && isMoved(selectedSource)) {
            const oldIndex = sourceBefore.findIndex(item => Object.is(item, selectedSource))
            Source.WriteSelectedItem?.(sourceAfter[Math.min(oldIndex, sourceAfter.length - 1)] ?? null)
          } else if (selectedSource !== undefined) Source.WriteSelectedItem?.(selectedSource ?? null)
          if (Source !== Target) Target.WriteSelectedItem?.(request.Items[0]!)
          if (operation.Signal.aborted) throw operation.Signal.reason
          if (!sameItems(Source === Target ? targetAfter : sourceAfter, Source.Read()) ||
            (Source !== Target && !sameItems(targetAfter, Target.Read()))) {
            throw new TypeError('TabView host Write must synchronously publish the requested collection.')
          }
        })
      } catch (error) {
        const rollbackErrors: unknown[] = []
        const restore = (Restore: () => void) => { try { Restore() } catch (failure) { rollbackErrors.push(failure) } }
        restore(() => batch(() => {
          // Remove transferred items from the target before restoring the source.
          if (Source !== Target) restore(() => Target.Write(targetBefore))
          restore(() => Source.Write(sourceBefore))
          if (selectedSource !== undefined) restore(() => Source.WriteSelectedItem?.(selectedSource ?? null))
          if (Source !== Target && selectedTarget !== undefined) restore(() => Target.WriteSelectedItem?.(selectedTarget ?? null))
        }))
        restore(() => {
          if (!sameItems(sourceBefore, Source.Read()) || (Source !== Target && !sameItems(targetBefore, Target.Read()))) {
            throw new TypeError('TabView host failed to restore its collection.')
          }
        })
        return rollbackErrors.length
          ? { Status: 'Cancelled', Reason: 'RollbackFailed', Error: error, RollbackErrors: rollbackErrors }
          : operation.Signal.aborted ? aborted() : cancelled('UpdateFailed', error)
      }
      return { Status: 'Accepted', Items: request.Items, Target, DropIndex: dropIndex }
    } catch (error) {
      return operation.Signal.aborted ? aborted() : cancelled('HostError', error)
    } finally {
      operation.End()
      locks.delete(Source)
      locks.delete(Target)
    }
  }

  const TearOut: TabViewHostAdapter<T>['TearOut'] = async Request => {
    const prepared = pending.get(Request.NewWindowId)
    if (!prepared) return cancelled(disposed ? 'Disposed' : 'WindowUnavailable')
    pending.delete(Request.NewWindowId)
    const { Destination, Request: original } = prepared
    let result: TabViewHostResult<T>
    try {
      const signal = Request.Signal && original.Signal
        ? AbortSignal.any([Request.Signal, original.Signal])
        : Request.Signal ?? original.Signal
      if (Request.Source !== original.Source || !sameItems(Request.Items, original.Items)) result = cancelled('InvalidItems')
      else result = await transfer({ ...Request, Signal: signal, Target: Destination.Target, DropIndex: Destination.Target.Read().length }, Destination.Commit)
    } catch (error) { result = cancelled('HostError', error) }
    try {
      if (result.Status === 'Accepted') return { ...result, NewWindowId: Request.NewWindowId }
      try { await release(Destination) }
      catch (error) { return { ...result, Error: result.Error ?? error } }
      return result
    } finally { prepared.End() }
  }

  const OpenWindow: TabViewHostAdapter<T>['OpenWindow'] = async Request => {
    const result = await prepare(Request, Options.CreateWindow)
    return result.Status === 'Accepted'
      ? TearOut({ ...Request, NewWindowId: result.NewWindowId! })
      : result
  }

  return {
    CreateWindow: Request => prepare(Request, Options.CreateWindow),
    TearOut,
    OpenWindow,
    Move: Request => transfer(Request),
    Split: async Request => {
      if (!['Left', 'Right', 'Top', 'Bottom'].includes(Request.Edge)) return cancelled('InvalidTarget')
      const result = await prepare(Request, Options.Split ? request => Options.Split!({ ...request, Edge: Request.Edge }) : undefined)
      return result.Status === 'Accepted'
        ? TearOut({ ...Request, NewWindowId: result.NewWindowId! })
        : result
    },
    async CancelWindow(NewWindowId) {
      const prepared = pending.get(NewWindowId)
      if (!prepared) return
      pending.delete(NewWindowId)
      try { await release(prepared.Destination) }
      finally { prepared.End() }
    },
    async Dispose() {
      disposed = true
      const prepared = [...pending.values()]
      pending.clear()
      const finishing = [...operations.values()]
      for (const controller of operations.keys()) controller.abort('Disposed')
      for (const entry of prepared) entry.End()
      const results = await Promise.allSettled([...finishing, ...prepared.map(entry => release(entry.Destination))])
      await Promise.allSettled([...cleanups])
      const failures = results.filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      const errors = [...new Set([...cleanupErrors, ...failures.map(result => result.reason)])]
      if (errors.length) throw new AggregateError(errors, 'TabView host cleanup failed.')
    },
  }
}
