import type { TabViewPwaCapabilities, TabViewPwaDisplayMode } from '../../../components/tabViewPwaHost'
import type { TabViewHostResult } from '../../../components/tabViewHostAdapter'

export const tabViewWindowSampleInfoKey = Symbol.for('WinUI.Gallery.TabViewWindowSampleInfo')
export interface TabViewWindowSampleInfo {
  CapabilityOutput: string
  SelectionOutput: string
  OperationOutput: string
}

type Translate = (Key: string, Values?: Record<string, string | number>) => string
export const tabViewDisplayModeText = (Mode: TabViewPwaDisplayMode | null, t: Translate) => t(`sample.tabview.window-mode-${Mode ?? 'none'}`)

export function tabViewCapabilityText(Capabilities: TabViewPwaCapabilities | null, t: Translate, Launched = false): string {
  if (!Capabilities) return t('sample.tabview.window-capability-custom-host')
  const support = (value: boolean) => t(value ? 'sample.tabview.window-supported' : 'sample.tabview.window-not-supported')
  const transfer = Capabilities.ConfirmedWindowTransfer
    ? support(true)
    : t(Capabilities.WindowOpenSupported && (['NotRequested', 'Opening'].includes(Capabilities.WindowOpenStatus) || Capabilities.SameOriginCommunication) ? 'sample.tabview.window-not-verified' : 'sample.tabview.window-not-supported')
  const split = Launched && !Capabilities.ChildReady
    ? t('sample.tabview.window-not-verified')
    : support(Launched ? Capabilities.LastWindowApplicationSplit : Capabilities.ApplicationSplit)
  const status = Capabilities.WindowOpenStatus === 'Ready' && !Capabilities.SameOriginCommunication ? 'Unavailable' : Capabilities.WindowOpenStatus
  return [
    t('sample.tabview.window-display-mode', { mode: tabViewDisplayModeText(Launched ? Capabilities.LastWindowDisplayMode : Capabilities.CurrentDisplayMode, t) }),
    t('sample.tabview.window-connection-status', { status: t(`sample.tabview.window-status-${status}`) }),
    t('sample.tabview.window-transfer-capability', { support: transfer }),
    t('sample.tabview.window-split-capability', { support: split }),
    t('sample.tabview.window-native-drag-capability', { support: support(Launched ? Capabilities.LastWindowNativeCrossWindowDrag : Capabilities.NativeCrossWindowDrag) }),
    t('sample.tabview.window-native-capability', { support: support(Capabilities.NativeTabSplit || Capabilities.NativeWindowTearOut) })
  ].join('\n')
}

export function tabViewOperationFailure(Result: TabViewHostResult, Capabilities: TabViewPwaCapabilities | null, t: Translate): string {
  if (Capabilities?.WindowOpenStatus === 'Blocked') return t('sample.tabview.window-blocked')
  if (Result.Status === 'Accepted') return ''
  const keys: Record<string, string> = {
    HostUnavailable: 'window-host-unavailable', WindowUnavailable: 'window-unavailable', InvalidItems: 'window-invalid-documents',
    HostError: 'window-failed', UpdateFailed: 'window-failed', RollbackFailed: 'window-failed'
  }
  return t(`sample.tabview.${keys[Result.Reason] ?? 'window-cancelled'}`)
}
