import { createApp } from 'vue'
import SampleSystemBackdropsWindow from './SampleSystemBackdropsWindow.vue'
import SampleBuiltInSystemBackdropsWindow from './SampleBuiltInSystemBackdropsWindow.vue'
import { createI18n, i18nKey, type Locale } from '../../../components/i18n/index'
import enUS from '../../Strings/en-US/Resources'
import zhCN from '../../Strings/zh-CN/Resources'
import { attachSystemBackdropWindow, type SystemBackdropWindowHandle, type SystemBackdropTheme } from '../../../components/systemBackdropHostAdapter'
import { toSystemBackdropConfig, type SystemBackdropConfig } from '../../../components/systemBackdrop'
import { connectWindowTitleBarFrame } from '../../../utils/titleBarWindowFrame'

export type SampleBackdropType = 'None' | 'Mica' | 'MicaAlt' | 'Acrylic' | 'AcrylicThin'
export interface SystemBackdropSampleSession {
  Kind?: 'SystemBackdrops' | 'TitleBarDragRegions' | 'TitleBarEndToEnd' | 'CreateMultipleWindows'
  handle: SystemBackdropWindowHandle
  allowedBackdrops: SampleBackdropType[]
  locale: Locale
  Ready(): void
  Detach?(): void
}
export interface WindowSampleRecoveryFailure {
  Kind: NonNullable<SystemBackdropSampleSession['Kind']>
  allowedBackdrops: SampleBackdropType[]
  locale: Locale
  RecoveryError: unknown
  RequestedTheme: SystemBackdropTheme
}
type SampleWindow = Window & { __winuiSystemBackdropSamples?: Map<string, SystemBackdropSampleSession> }

interface StoredSampleSession {
  Version: 1
  Id: string
  Kind: NonNullable<SystemBackdropSampleSession['Kind']>
  allowedBackdrops: SampleBackdropType[]
  locale: Locale
  HandleId: string | number
  NativeAssociationToken?: string
  RequestedBackdrop: SystemBackdropConfig | null
  RequestedTheme: SystemBackdropTheme
  SampleState?: Record<string, unknown>
}
const storageKey = (id: string) => `WinUI.WindowSample.${id}`
const backdropTypes: readonly SampleBackdropType[] = ['None', 'Mica', 'MicaAlt', 'Acrylic', 'AcrylicThin']
const sampleKinds = ['SystemBackdrops', 'TitleBarDragRegions', 'TitleBarEndToEnd', 'CreateMultipleWindows'] as const
const readStoredSession = (owner: Window, id: string): StoredSampleSession | undefined => {
  try {
    const value = JSON.parse(owner.sessionStorage.getItem(storageKey(id)) ?? 'null') as StoredSampleSession | null
    if (value?.Version !== 1 || value.Id !== id || !sampleKinds.includes(value.Kind) || !Array.isArray(value.allowedBackdrops)) return undefined
    return { ...value, allowedBackdrops: value.allowedBackdrops.filter(type => backdropTypes.includes(type)), RequestedBackdrop: toSystemBackdropConfig(value.RequestedBackdrop), RequestedTheme: value.RequestedTheme === 'Dark' || value.RequestedTheme === 'Light' ? value.RequestedTheme : 'Default' }
  } catch { return undefined }
}
const writeStoredSession = (owner: Window, session: StoredSampleSession) => {
  try { owner.sessionStorage.setItem(storageKey(session.Id), JSON.stringify(session)) } catch { /* The explicit sample URL still preserves the window type when storage is disabled. */ }
}
const persistSession = (owner: Window, id: string, session: SystemBackdropSampleSession) => session.handle.Subscribe(state => {
  if (state.Status === 'Closed') return
  const previous = readStoredSession(owner, id)
  writeStoredSession(owner, {
    Version: 1, Id: id, Kind: session.Kind ?? 'SystemBackdrops', allowedBackdrops: session.allowedBackdrops, locale: session.locale,
    HandleId: session.handle.Id, NativeAssociationToken: session.handle.NativeAssociationToken,
    RequestedBackdrop: state.RequestedBackdrop, RequestedTheme: state.RequestedTheme, SampleState: previous?.SampleState,
  })
})

/** UI state lives with the sample window rather than its opener runtime. */
export const readWindowSampleState = <T extends Record<string, unknown>>(): Partial<T> => {
  const id = new URL(window.location.href).searchParams.get('systemBackdropSample')
  return id ? readStoredSession(window, id)?.SampleState as Partial<T> ?? {} : {}
}
export const writeWindowSampleState = (state: Record<string, unknown>) => {
  const id = new URL(window.location.href).searchParams.get('systemBackdropSample')
  const session = id ? readStoredSession(window, id) : undefined
  if (session) writeStoredSession(window, { ...session, SampleState: state })
}

export const readSystemBackdropSampleSession = async (): Promise<SystemBackdropSampleSession | WindowSampleRecoveryFailure | undefined> => {
  const id = new URL(window.location.href).searchParams.get('systemBackdropSample')
  if (!id) return undefined
  let session: SystemBackdropSampleSession | undefined
  try { session = (window.opener as SampleWindow | null)?.__winuiSystemBackdropSamples?.get(id) } catch { /* The sample can reconnect without a same-origin opener. */ }
  if (!session || session.handle.State.Status === 'Closed') {
    const url = new URL(window.location.href)
    const stored = readStoredSession(window, id)
    const queryKind = url.searchParams.get('systemBackdropSampleKind')
    const Kind = stored?.Kind ?? (sampleKinds.includes(queryKind as typeof sampleKinds[number]) ? queryKind as typeof sampleKinds[number] : 'SystemBackdrops')
    const allowedBackdrops = stored?.allowedBackdrops ?? (url.searchParams.get('systemBackdropSampleBackdrops') ?? 'Mica,MicaAlt,Acrylic,None').split(',').filter((type): type is SampleBackdropType => backdropTypes.includes(type as SampleBackdropType))
    const locale = stored?.locale ?? (url.searchParams.get('systemBackdropSampleLocale') === 'zh-CN' ? 'zh-CN' : 'en-US')
    try {
      const handle = await attachSystemBackdropWindow(document.getElementById('app')!, {
        id: stored?.HandleId ?? id, nativeAssociationToken: stored?.NativeAssociationToken,
        theme: stored?.RequestedTheme ?? 'Default',
        backdrop: stored ? stored.RequestedBackdrop : Kind === 'SystemBackdrops' && allowedBackdrops[0] === 'Acrylic' ? { Type: 'DesktopAcrylic', Kind: 'Base' } : { Type: 'Mica', Kind: 'Base' },
      })
      session = { Kind, handle, allowedBackdrops, locale, Ready() {} }
    } catch (RecoveryError) { return { Kind, allowedBackdrops, locale, RecoveryError, RequestedTheme: stored?.RequestedTheme ?? 'Default' } }
    // A handle reconstructed in this document must be reattached after its
    // next reload: timers and callbacks in this runtime end at navigation.
  }
  const stop = persistSession(window, id, session)
  return { ...session, Detach: stop }
}

/** Load a separate runtime so popup controls and Teleport use their own document. */
export const mountWindowSampleSession = (_element: HTMLElement, handle: SystemBackdropWindowHandle, options: Pick<SystemBackdropSampleSession, 'Kind' | 'allowedBackdrops' | 'locale'>) => {
  if (handle.Window && handle.Window !== window) {
    const owner = window as SampleWindow
    const samples = owner.__winuiSystemBackdropSamples ??= new Map()
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
    let timeout: number | undefined = window.setTimeout(() => { samples.delete(id); void handle.Close() }, 30000)
    let stop = () => {}
    const session = { handle, ...options, Ready: () => { window.clearTimeout(timeout); timeout = undefined; stop() } }
    samples.set(id, session)
    stop = persistSession(handle.Window, id, session)
    const url = new URL(window.location.href)
    url.searchParams.set('systemBackdropSample', id)
    url.searchParams.set('systemBackdropSampleKind', options.Kind ?? 'SystemBackdrops')
    url.searchParams.set('systemBackdropSampleBackdrops', options.allowedBackdrops.join(','))
    url.searchParams.set('systemBackdropSampleLocale', options.locale)
    url.hash = ''
    handle.Window.location.replace(url.href)
    return () => { window.clearTimeout(timeout); stop(); samples.delete(id) }
  }
  return undefined
}

export const mountSystemBackdropsWindow = (element: HTMLElement, handle: SystemBackdropWindowHandle, allowedBackdrops: SampleBackdropType[], locale: Locale = 'en-US') => {
  const cleanup = mountWindowSampleSession(element, handle, { Kind: 'SystemBackdrops', allowedBackdrops, locale })
  if (cleanup) return cleanup
  const app = createApp(allowedBackdrops.length === 4 ? SampleBuiltInSystemBackdropsWindow : SampleSystemBackdropsWindow, { handle, allowedBackdrops })
  app.provide(i18nKey, createI18n(locale, { 'en-US': enUS, 'zh-CN': zhCN }))
  const releaseTitleBarFrame = connectWindowTitleBarFrame(element, handle.TitleBarHost)
  app.mount(element)
  return () => { app.unmount(); releaseTitleBarFrame() }
}
