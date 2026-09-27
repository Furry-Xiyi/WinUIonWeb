import { MicaBackdrop } from '../components/systemBackdrop'
import {
  attachSystemBackdropWindow,
  getSystemBackdropHostAdapter,
  SystemBackdropWindowError,
  type SystemBackdropExistingWindowOptions,
  type SystemBackdropHostAdapter,
  type SystemBackdropTheme,
  type SystemBackdropWindowHandle,
} from '../components/systemBackdropHostAdapter'

export const galleryWindowBackdropKey = Symbol.for('WinUI.GalleryWindowBackdrop')

export interface GalleryWindowBackdropConnection {
  readonly Handle: SystemBackdropWindowHandle
  SetTheme(theme: SystemBackdropTheme): Promise<void>
  Dispose(): Promise<void>
}

export interface GalleryWindowBackdropOptions {
  theme?: SystemBackdropTheme
  adapter?: SystemBackdropHostAdapter
  signal?: AbortSignal
}

/** Only a registered native window host may apply Mica to the Gallery window. */
export async function connectGalleryWindowBackdrop(element: HTMLElement, options: GalleryWindowBackdropOptions = {}): Promise<GalleryWindowBackdropConnection | null> {
  const adapter = options.adapter ?? getSystemBackdropHostAdapter()
  if (!adapter) return null
  if (!adapter.AttachWindow) throw new SystemBackdropWindowError('HostUnavailable', 'The native Gallery host cannot connect its existing application window.')
  const attachOptions: SystemBackdropExistingWindowOptions = { theme: options.theme ?? 'Default', backdrop: new MicaBackdrop(), signal: options.signal }
  if (!element.isConnected || options.signal?.aborted) throw new SystemBackdropWindowError('HostUnavailable', 'The Gallery window connection was cancelled or detached.')
  let nativeMaterialConnected = false
  const nativeAdapter: SystemBackdropHostAdapter = {
    CreateWindow: value => adapter.CreateWindow(value),
    async AttachWindow(content, value) {
      const target = await adapter.AttachWindow!(content, value)
      try {
        const capabilities = await adapter.GetCapabilities(target)
        if (!capabilities.NativeSystemBackdrop) throw new SystemBackdropWindowError('HostUnavailable', 'The Gallery host does not expose the native desktop compositor.')
        if (!capabilities.SupportedMaterials.includes('Mica') || capabilities.SupportedMicaKinds && !capabilities.SupportedMicaKinds.includes('Base')) throw new SystemBackdropWindowError('HostUnavailable', 'The Gallery host does not support native Mica Base.')
        return target
      } catch (error) {
        // Capability validation precedes shared-handle ownership.
        await target.Dispose?.()
        throw error
      }
    },
    GetCapabilities: target => adapter.GetCapabilities(target),
    GetConfiguration: adapter.GetConfiguration ? target => adapter.GetConfiguration!(target) : undefined,
    async ApplyBackdrop(target, backdrop, configuration) {
      const applied = await adapter.ApplyBackdrop(target, backdrop, configuration)
      nativeMaterialConnected = applied && backdrop?.Type === 'Mica'
      return applied
    },
    SetTheme: adapter.SetTheme ? (target, theme) => adapter.SetTheme!(target, theme) : undefined,
  }
  const handle = await attachSystemBackdropWindow(element, { ...attachOptions, adapter: nativeAdapter })
  const layers = [element.ownerDocument.documentElement, element.ownerDocument.body].map(layer => ({
    style: layer.style, value: '', priority: '', owned: false,
  }))
  const showNativeMaterial = (visible: boolean) => {
    for (const layer of layers) {
      const value = layer.style.getPropertyValue('background-color')
      const priority = layer.style.getPropertyPriority('background-color')
      if (visible) {
        if (layer.owned && value === 'transparent' && priority === 'important') continue
        layer.value = value
        layer.priority = priority
        layer.owned = true
        layer.style.setProperty('background-color', 'transparent', 'important')
      } else if (layer.owned) {
        if (value === 'transparent' && priority === 'important') {
          if (layer.value) layer.style.setProperty('background-color', layer.value, layer.priority)
          else layer.style.removeProperty('background-color')
        }
        layer.owned = false
      }
    }
  }
  const stop = handle.Subscribe(state => {
    const supported = nativeMaterialConnected && state.Status !== 'Closed'
      && state.RequestedBackdrop?.Type === 'Mica'
      && state.Reason !== 'HostError' && state.Reason !== 'MaterialUnsupported'
      && state.Reason !== 'NativeBackdropUnavailable'
    showNativeMaterial(supported)
  })
  return {
    Handle: handle,
    async SetTheme(theme) { await handle.SetTheme(theme) },
    async Dispose() {
      try { await handle.Dispose() }
      finally { stop(); showNativeMaterial(false) }
    },
  }
}
