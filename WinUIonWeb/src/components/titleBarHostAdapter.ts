export const titleBarHostAdapterKey = Symbol.for('WinUI.TitleBarHostAdapter')

/** Viewport-relative CSS pixels; the native adapter performs DPI conversion. */
export interface TitleBarRegion { X: number; Y: number; Width: number; Height: number }
/** Physical viewport edges in CSS pixels, independent of XAML FlowDirection. */
export interface TitleBarInsets {
  LeftInset: number
  RightInset: number
  /** The browser overlay's actual vertical band, when available. */
  TitleBarArea?: TitleBarRegion
}
export type TitleBarHeightOption = 'Standard' | 'Tall' | 'Collapsed'
export interface TitleBarWindowConfiguration {
  ExtendsContentIntoTitleBar?: boolean
  PreferredHeightOption?: TitleBarHeightOption
}
export interface NativeTitleBarMetrics {
  /** Includes the actual WebView zoom as well as the native monitor DPI. */
  PhysicalPixelsPerCssPixel: number
  LeftInset: number
  RightInset: number
  TitleBarArea?: TitleBarRegion
}
export interface TitleBarDragRegions {
  Caption: TitleBarRegion
  Passthrough: readonly TitleBarRegion[]
  Icon: TitleBarRegion | null
}
export interface TitleBarWindowHost {
  GetTitle(): string
  SetTitle(title: string): void
  IsInputActive?(): boolean
  SubscribeActivation?(listener: (active: boolean) => void): () => void
  /** Native AppWindow insets must be converted to this document's CSS pixels. */
  GetTitleBarInsets?(): TitleBarInsets | null
  SubscribeTitleBarInsets?(listener: () => void): () => void
  SetExtendsContentIntoTitleBar?(value: boolean): void | Promise<void>
  SetPreferredHeightOption?(value: TitleBarHeightOption): void | Promise<void>
  /** Optional ownership guard for hosts that contain nested demonstration bars. */
  IsTitleBarOwner?(element: HTMLElement): boolean
  /** Actual non-client regions only. Ordinary browser windows have no implementation. */
  SetDragRegions?(regions: TitleBarDragRegions): void
  ClearDragRegions?(): void
}
export interface TitleBarHostAdapter {
  /** Return a host only for the TitleBar that owns the actual application window. */
  Connect(element: HTMLElement): TitleBarWindowHost | null
}

let installedAdapter: TitleBarHostAdapter | undefined
const windowHosts = new WeakMap<HTMLElement, TitleBarWindowHost>()
export function setTitleBarHostAdapter(adapter: TitleBarHostAdapter | undefined): () => void {
  const previous = installedAdapter
  installedAdapter = adapter
  return () => { if (installedAdapter === adapter) installedAdapter = previous }
}
/** Framework-neutral: register a native/window content host before mounting its TitleBar. */
export function registerTitleBarWindowHost(content: HTMLElement, host: TitleBarWindowHost): () => void {
  windowHosts.set(content, host)
  return () => { if (windowHosts.get(content) === host) windowHosts.delete(content) }
}
/** AppWindow reports physical pixels; XAML and browser layout use logical pixels. */
export function nativeTitleBarMetricsToCssPixels(metrics: NativeTitleBarMetrics): TitleBarInsets | null {
  const scale = metrics.PhysicalPixelsPerCssPixel
  if (!Number.isFinite(scale) || scale <= 0 || !Number.isFinite(metrics.LeftInset) || !Number.isFinite(metrics.RightInset)
    || metrics.LeftInset < 0 || metrics.RightInset < 0) return null
  const area = metrics.TitleBarArea
  if (area && (![area.X, area.Y, area.Width, area.Height].every(Number.isFinite) || area.Width < 0 || area.Height < 0)) return null
  return {
    LeftInset: metrics.LeftInset / scale, RightInset: metrics.RightInset / scale,
    ...(area ? { TitleBarArea: { X: area.X / scale, Y: area.Y / scale, Width: area.Width / scale, Height: area.Height / scale } } : {}),
  }
}

/** Apply actual window policy before mounting the custom XAML TitleBar. */
export async function configureTitleBarWindowHost(host: TitleBarWindowHost | null | undefined, configuration: TitleBarWindowConfiguration, signal?: AbortSignal): Promise<void> {
  signal?.throwIfAborted()
  if (configuration.ExtendsContentIntoTitleBar !== undefined) await host?.SetExtendsContentIntoTitleBar?.(configuration.ExtendsContentIntoTitleBar)
  signal?.throwIfAborted()
  if (configuration.PreferredHeightOption !== undefined) await host?.SetPreferredHeightOption?.(configuration.PreferredHeightOption)
  signal?.throwIfAborted()
}

type WindowControlsOverlay = EventTarget & { visible: boolean; getTitlebarAreaRect(): DOMRect }

/** Convert physical window occlusion to the control's own arrange rectangle. */
export function getTitleBarHostPadding(bounds: TitleBarRegion, viewportWidth: number, insets: TitleBarInsets | null): TitleBarInsets | null {
  if (!insets || !Number.isFinite(viewportWidth) || viewportWidth <= 0
    || !Number.isFinite(insets.LeftInset) || !Number.isFinite(insets.RightInset)) return null
  const area = insets.TitleBarArea
  if (area && (![area.X, area.Y, area.Width, area.Height].every(Number.isFinite) || area.Width < 0 || area.Height < 0)) return null
  if (area && (bounds.Y >= area.Y + area.Height || bounds.Y + bounds.Height <= area.Y)) return null
  const width = Math.max(0, bounds.Width)
  const left = Math.min(width, Math.max(0, insets.LeftInset - bounds.X))
  const right = Math.min(width - left, Math.max(0, bounds.X + width - (viewportWidth - Math.max(0, insets.RightInset))))
  return { LeftInset: left, RightInset: right }
}

export function createBrowserTitleBarWindowHost(owner: Window): TitleBarWindowHost {
  const overlay = (owner.navigator as Navigator & { windowControlsOverlay?: WindowControlsOverlay } | undefined)?.windowControlsOverlay
  return {
    GetTitle: () => owner.document.title,
    SetTitle: title => { owner.document.title = title },
    IsInputActive: () => owner.document.hasFocus(),
    SubscribeActivation(listener) {
      const focus = () => listener(true), blur = () => listener(false)
      owner.addEventListener('focus', focus); owner.addEventListener('blur', blur)
      return () => { owner.removeEventListener('focus', focus); owner.removeEventListener('blur', blur) }
    },
    GetTitleBarInsets() {
      if (!overlay?.visible) return null
      const rect = overlay.getTitlebarAreaRect()
      if (![rect.x, rect.y, rect.width, rect.height].every(Number.isFinite) || rect.width <= 0 || rect.height <= 0) return null
      return {
        LeftInset: Math.max(0, rect.x), RightInset: Math.max(0, owner.innerWidth - rect.x - rect.width),
        TitleBarArea: { X: rect.x, Y: rect.y, Width: rect.width, Height: rect.height },
      }
    },
    SubscribeTitleBarInsets(listener) {
      overlay?.addEventListener('geometrychange', listener)
      owner.addEventListener('resize', listener)
      return () => { overlay?.removeEventListener('geometrychange', listener); owner.removeEventListener('resize', listener) }
    },
  }
}
export function connectTitleBarWindowHost(element: HTMLElement, adapter?: TitleBarHostAdapter | null): TitleBarWindowHost | null {
  const selected = adapter ?? installedAdapter
  if (selected) {
    const host = selected.Connect(element)
    return host && host.IsTitleBarOwner?.(element) === false ? null : host
  }
  for (let current: HTMLElement | null = element; current; current = current.parentElement) {
    const host = windowHosts.get(current)
    if (host) return host.IsTitleBarOwner?.(element) === false ? null : host
  }
  if (!element.matches('.gallery-titlebar') && !element.closest('.win-system-backdrop-window-content')) return null
  const owner = element.ownerDocument.defaultView
  return owner ? createBrowserTitleBarWindowHost(owner) : null
}
