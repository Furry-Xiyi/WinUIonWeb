/**
 * Framework independent representations of the WinUI system backdrop APIs.
 *
 * The browser cannot sample the desktop compositor.  These objects therefore
 * describe the requested material and are intentionally free of DOM and Vue
 * dependencies.  A native host can consume the same descriptors through
 * `systemBackdropHostAdapter.ts`.
 */

export type MicaKind = 'Base' | 'BaseAlt'
export type DesktopAcrylicKind = 'Base' | 'Thin'
export type SystemBackdropType = 'Mica' | 'DesktopAcrylic'

export interface MicaBackdropConfig {
  Type: 'Mica'
  Kind: MicaKind
  FallbackColor?: string
  TintColor?: string
  TintOpacity?: number
  LuminosityOpacity?: number
}

export interface DesktopAcrylicBackdropConfig {
  Type: 'DesktopAcrylic'
  Kind: DesktopAcrylicKind
  FallbackColor?: string
  TintColor?: string
  TintOpacity?: number
  LuminosityOpacity?: number
}

export type SystemBackdropConfig = MicaBackdropConfig | DesktopAcrylicBackdropConfig

export type SystemBackdropChangeListener = (backdrop: SystemBackdrop) => void

/** Base class corresponding to Microsoft.UI.Xaml.Media.SystemBackdrop. */
export abstract class SystemBackdrop {
  abstract readonly Type: SystemBackdropType
  private readonly listeners = new Set<SystemBackdropChangeListener>()

  protected Changed(): void {
    for (const listener of [...this.listeners]) listener(this)
  }

  Subscribe(listener: SystemBackdropChangeListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  abstract ToConfig(): SystemBackdropConfig
}

/** The built-in WinUI Mica material. */
export class MicaBackdrop extends SystemBackdrop {
  readonly Type = 'Mica' as const
  private kind: MicaKind = 'Base'

  get Kind(): MicaKind { return this.kind }
  set Kind(value: MicaKind) {
    const next = value === 'BaseAlt' ? 'BaseAlt' : 'Base'
    if (this.kind === next) return
    this.kind = next
    this.Changed()
  }

  ToConfig(): MicaBackdropConfig { return { Type: 'Mica', Kind: this.Kind } }
}

/** The built-in WinUI Desktop Acrylic material (Base kind). */
export class DesktopAcrylicBackdrop extends SystemBackdrop {
  readonly Type = 'DesktopAcrylic' as const
  ToConfig(): DesktopAcrylicBackdropConfig { return { Type: 'DesktopAcrylic', Kind: 'Base' } }
}

/**
 * Controller contracts mirror the Composition SystemBackdrops namespace.
 * Native adapters may use their appearance properties when applying a
 * descriptor.  `IsSupported` is deliberately false in the browser runtime;
 * a native host is responsible for returning its actual capability.
 */
export class MicaController {
  static IsSupported(): boolean { return false }
  readonly Type = 'Mica' as const
  Kind: MicaKind = 'Base'
  FallbackColor?: string
  TintColor?: string
  TintOpacity?: number
  LuminosityOpacity?: number
  ToConfig(): MicaBackdropConfig {
    return {
      Type: 'Mica', Kind: this.Kind,
      ...(this.FallbackColor === undefined ? {} : { FallbackColor: this.FallbackColor }),
      ...(this.TintColor === undefined ? {} : { TintColor: this.TintColor }),
      ...(this.TintOpacity === undefined ? {} : { TintOpacity: this.TintOpacity }),
      ...(this.LuminosityOpacity === undefined ? {} : { LuminosityOpacity: this.LuminosityOpacity }),
    }
  }
}

export class DesktopAcrylicController {
  static IsSupported(): boolean { return false }
  readonly Type = 'DesktopAcrylic' as const
  Kind: DesktopAcrylicKind = 'Base'
  FallbackColor?: string
  TintColor?: string
  TintOpacity?: number
  LuminosityOpacity?: number
  ToConfig(): DesktopAcrylicBackdropConfig {
    return {
      Type: 'DesktopAcrylic', Kind: this.Kind,
      ...(this.FallbackColor === undefined ? {} : { FallbackColor: this.FallbackColor }),
      ...(this.TintColor === undefined ? {} : { TintColor: this.TintColor }),
      ...(this.TintOpacity === undefined ? {} : { TintOpacity: this.TintOpacity }),
      ...(this.LuminosityOpacity === undefined ? {} : { LuminosityOpacity: this.LuminosityOpacity }),
    }
  }
}

export function toSystemBackdropConfig(value: unknown): SystemBackdropConfig | null {
  if (value instanceof SystemBackdrop) return value.ToConfig()
  if (value instanceof MicaController || value instanceof DesktopAcrylicController) return value.ToConfig()
  if (!value || typeof value !== 'object') return null
  const input = value as Record<string, unknown>
  const type = input.Type === 'Mica' || input.Type === 'DesktopAcrylic' ? input.Type : null
  if (!type) return null
  const kind = type === 'Mica'
    ? input.Kind === 'BaseAlt' ? 'BaseAlt' : 'Base'
    : input.Kind === 'Thin' ? 'Thin' : 'Base'
  return {
    Type: type,
    Kind: kind,
    ...(typeof input.FallbackColor === 'string' ? { FallbackColor: input.FallbackColor } : {}),
    ...(typeof input.TintColor === 'string' ? { TintColor: input.TintColor } : {}),
    ...(typeof input.TintOpacity === 'number' ? { TintOpacity: input.TintOpacity } : {}),
    ...(typeof input.LuminosityOpacity === 'number' ? { LuminosityOpacity: input.LuminosityOpacity } : {}),
  } as SystemBackdropConfig
}

export function cloneSystemBackdropConfig(value: SystemBackdropConfig | null): SystemBackdropConfig | null {
  return value ? { ...value } : null
}

