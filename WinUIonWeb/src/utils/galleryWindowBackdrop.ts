import { acrylicResource } from '../components/acrylicResources'
import { resolveBrushStyle } from '../components/AcrylicBrush'
import { mountAcrylicMaterialLayer } from '../components/acrylicBrushVisual'
import type { AcrylicBrushValue } from '../components/brushCore'
import type { SystemBackdropConfig } from '../components/systemBackdrop'
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

export type GalleryWindowBackdropMaterial = 'Mica' | 'Acrylic' | 'AcrylicThin'

const backdropForMaterial = (material: GalleryWindowBackdropMaterial): SystemBackdropConfig => {
  if (material === 'Mica') return { Type: 'Mica', Kind: 'Base' }
  return { Type: 'DesktopAcrylic', Kind: material === 'AcrylicThin' ? 'Thin' : 'Base' }
}

export interface GalleryWindowBackdropConnection {
  readonly Handle: SystemBackdropWindowHandle
  SetMaterial(material: GalleryWindowBackdropMaterial): Promise<void>
  SetTheme(theme: SystemBackdropTheme): Promise<void>
  Dispose(): Promise<void>
}

export interface GalleryWindowBackdropOptions {
  theme?: SystemBackdropTheme
  /** Desktop Acrylic Thin is implemented by the host's DesktopAcrylicController. */
  material?: GalleryWindowBackdropMaterial
  adapter?: SystemBackdropHostAdapter
  signal?: AbortSignal
}

/** Only a registered native window host may apply a desktop material to the Gallery window. */
export async function connectGalleryWindowBackdrop(element: HTMLElement, options: GalleryWindowBackdropOptions = {}): Promise<GalleryWindowBackdropConnection | null> {
  const adapter = options.adapter ?? getSystemBackdropHostAdapter()
  if (!adapter) return null
  if (!adapter.AttachWindow) throw new SystemBackdropWindowError('HostUnavailable', 'The native Gallery host cannot connect its existing application window.')
  const material = options.material ?? 'Mica'
  const backdrop = backdropForMaterial(material)
  const attachOptions: SystemBackdropExistingWindowOptions = { theme: options.theme ?? 'Default', backdrop, signal: options.signal }
  if (!element.isConnected || options.signal?.aborted) throw new SystemBackdropWindowError('HostUnavailable', 'The Gallery window connection was cancelled or detached.')
  let nativeMaterialConnected = false
  let acrylicLayerHost: HTMLElement | undefined
  let releaseAcrylicLayer: (() => void) | undefined
  const updateAcrylicMaterialLayer = (target: Parameters<SystemBackdropHostAdapter['ApplyBackdrop']>[0], next: SystemBackdropConfig | null, configuration: Parameters<SystemBackdropHostAdapter['ApplyBackdrop']>[2], applied: boolean) => {
    const shouldShow = applied && next?.Type === 'DesktopAcrylic'
      && configuration.IsInputActive && !configuration.IsHighContrast
      && configuration.IsTransparencyEnabled && !configuration.IsEnergySaverEnabled
    if (!shouldShow || acrylicLayerHost !== target.Content) {
      releaseAcrylicLayer?.()
      releaseAcrylicLayer = undefined
      acrylicLayerHost = undefined
    }
    if (!shouldShow) return
    const theme = configuration.Theme.toLowerCase() as 'light' | 'dark'
    const brush = acrylicResource('AcrylicBackgroundFillColorDefaultBrush', theme) as AcrylicBrushValue
    const style = resolveBrushStyle(brush)
    if (!releaseAcrylicLayer) {
      acrylicLayerHost = target.Content
      releaseAcrylicLayer = mountAcrylicMaterialLayer(target.Content, style)
    } else mountAcrylicMaterialLayer(target.Content, style)
  }
  const nativeAdapter: SystemBackdropHostAdapter = {
    CreateWindow: value => adapter.CreateWindow(value),
    async AttachWindow(content, value) {
      const target = await adapter.AttachWindow!(content, value)
      try {
        const capabilities = await adapter.GetCapabilities(target)
        if (!capabilities.NativeSystemBackdrop) throw new SystemBackdropWindowError('HostUnavailable', 'The Gallery host does not expose the native desktop compositor.')
        const supported = capabilities.SupportedMaterials.includes(backdrop.Type)
          && (backdrop.Type !== 'Mica' || !capabilities.SupportedMicaKinds || capabilities.SupportedMicaKinds.includes(backdrop.Kind))
          && (backdrop.Type !== 'DesktopAcrylic' || !capabilities.SupportedDesktopAcrylicKinds || capabilities.SupportedDesktopAcrylicKinds.includes(backdrop.Kind))
        if (!supported) throw new SystemBackdropWindowError('HostUnavailable', `The Gallery host does not support native ${backdrop.Type} ${backdrop.Kind}.`)
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
      updateAcrylicMaterialLayer(target, backdrop, configuration, applied)
      nativeMaterialConnected = applied && backdrop !== null
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
      && state.RequestedBackdrop !== null
      && state.Reason !== 'HostError' && state.Reason !== 'MaterialUnsupported'
      && state.Reason !== 'NativeBackdropUnavailable'
    showNativeMaterial(supported)
  })
  return {
    Handle: handle,
    async SetMaterial(material) { await handle.SetSystemBackdrop(backdropForMaterial(material)) },
    async SetTheme(theme) { await handle.SetTheme(theme) },
    async Dispose() {
      try { await handle.Dispose() }
      finally { stop(); showNativeMaterial(false) }
    },
  }
}
