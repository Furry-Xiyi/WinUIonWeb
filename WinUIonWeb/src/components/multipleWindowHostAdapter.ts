import {
  createSystemBackdropWindow,
  SystemBackdropWindowError,
  type SystemBackdropHostAdapter,
  type SystemBackdropTheme,
  type SystemBackdropWindowHandle,
  type SystemBackdropWindowOptions,
} from './systemBackdropHostAdapter'

export const multipleWindowManagerKey = Symbol.for('WinUI.MultipleWindowManager')

export interface MultipleWindowManager {
  readonly ActiveWindows: readonly SystemBackdropWindowHandle[]
  CreateWindow(options: SystemBackdropWindowOptions): Promise<SystemBackdropWindowHandle>
  TrackWindow(handle: SystemBackdropWindowHandle): () => void
  Subscribe(listener: (windows: readonly SystemBackdropWindowHandle[]) => void): () => void
  SetTheme(theme: SystemBackdropTheme): Promise<void>
  CloseAll(): Promise<void>
  Dispose(): Promise<void>
}

export interface MultipleWindowManagerOptions { adapter?: SystemBackdropHostAdapter }

/** Application-scoped tracking mirrors WinUI Gallery's WindowHelper. */
export function createMultipleWindowManager(options: MultipleWindowManagerOptions = {}): MultipleWindowManager {
  const windows = new Map<SystemBackdropWindowHandle, () => void>()
  const pending = new Set<AbortController>()
  const listeners = new Set<(windows: readonly SystemBackdropWindowHandle[]) => void>()
  let disposed = false
  let disposePromise: Promise<void> | undefined
  let themeRevision = 0
  let requestedTheme: SystemBackdropTheme = 'Default'
  const snapshot = () => [...windows.keys()]
  const notify = () => { for (const listener of [...listeners]) { try { listener(snapshot()) } catch (error) { console.error(error) } } }
  const TrackWindow = (handle: SystemBackdropWindowHandle): (() => void) => {
    if (disposed) { void handle.Close().catch(error => console.error(error)); return () => {} }
    const tracked = windows.get(handle)
    if (tracked) return tracked
    if (handle.State.Status === 'Closed') return () => {}
    let unsubscribe: (() => void) | undefined
    const release = () => {
      if (!windows.delete(handle)) return
      unsubscribe?.()
      notify()
    }
    windows.set(handle, release)
    try { unsubscribe = handle.Subscribe(state => { if (state.Status === 'Closed') release() }) }
    catch (error) { windows.delete(handle); throw error }
    if (!windows.has(handle)) unsubscribe()
    else notify()
    return release
  }
  const CloseAll = async () => {
    for (const controller of [...pending]) controller.abort()
    const results = await Promise.allSettled(snapshot().map(handle => handle.Close()))
    const errors = results.filter((result): result is PromiseRejectedResult => result.status === 'rejected').map(result => result.reason)
    if (errors.length) throw new AggregateError(errors, 'Some tracked windows could not close.')
  }
  return {
    get ActiveWindows() { return snapshot() },
    async CreateWindow(request) {
      if (disposed) throw new SystemBackdropWindowError('HostUnavailable', 'The application window manager has been disposed.')
      const controller = new AbortController()
      const abort = () => controller.abort(request.signal?.reason)
      if (request.signal?.aborted) abort()
      else request.signal?.addEventListener('abort', abort, { once: true })
      pending.add(controller)
      const creationThemeRevision = themeRevision
      let created: SystemBackdropWindowHandle | undefined
      try {
        // Start creation before any await so browser user activation survives.
        const creation = createSystemBackdropWindow({ ...request, adapter: request.adapter ?? options.adapter, signal: controller.signal })
        const handle = await creation
        created = handle
        if (disposed) { await handle.Close(); throw new SystemBackdropWindowError('HostUnavailable', 'The application closed while creating its child window.') }
        TrackWindow(handle)
        if (creationThemeRevision !== themeRevision) await handle.SetTheme(requestedTheme)
        await handle.Activate()
        if (disposed || handle.State.Status === 'Closed') throw new SystemBackdropWindowError('HostUnavailable', 'The child window closed before activation completed.')
        return handle
      } catch (error) {
        if (created) await created.Close()
        throw error
      } finally {
        pending.delete(controller)
        request.signal?.removeEventListener('abort', abort)
      }
    },
    TrackWindow,
    Subscribe(listener) { if (!disposed) listeners.add(listener); listener(snapshot()); return () => listeners.delete(listener) },
    async SetTheme(theme) {
      requestedTheme = theme
      themeRevision += 1
      const results = await Promise.allSettled(snapshot().map(handle => handle.SetTheme(theme)))
      const errors = results.filter((result): result is PromiseRejectedResult => result.status === 'rejected').map(result => result.reason)
      if (errors.length) throw new AggregateError(errors, 'Some tracked window themes could not update.')
    },
    CloseAll,
    Dispose() {
      if (disposePromise) return disposePromise
      disposed = true
      disposePromise = Promise.resolve().then(CloseAll).finally(() => { for (const release of [...windows.values()]) release(); listeners.clear() })
      return disposePromise
    },
  }
}
