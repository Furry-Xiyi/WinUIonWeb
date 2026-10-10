import { createApp, shallowRef } from 'vue'
import { registerWinUIComponents } from './components/register'
import App from './gallery/App.vue'
import HomeHeaderTile from './gallery/components/HomeHeaderTile.vue'
import HorizontalScrollContainer from './components/HorizontalScrollContainer.vue'
import ControlExample from './components/ControlExample.vue'
import SampleCodePresenter from './components/SampleCodePresenter.vue'
import {
  ControlExampleExample,
  ControlExampleOptions,
  ControlExampleOutput,
  ControlExampleSubstitutions,
  ControlExampleSubstitution
} from './components/ControlExampleProperties'
import router from './gallery/router'
import SampleSystemBackdropsWindow from './gallery/samples/SystemBackdrops/SampleSystemBackdropsWindow.vue'
import SampleBuiltInSystemBackdropsWindow from './gallery/samples/SystemBackdrops/SampleBuiltInSystemBackdropsWindow.vue'
import { readSystemBackdropSampleSession } from './gallery/samples/SystemBackdrops/mountSystemBackdropsWindow'
import WindowSampleRecoveryPage from './gallery/samples/SystemBackdrops/WindowSampleRecoveryPage.vue'
import TitleBarDragRegionsWindow from './gallery/samples/TitleBar/TitleBarDragRegionsWindow.vue'
import TitleBarWindow from './gallery/samples/TitleBar/TitleBarWindow.vue'
import MultipleWindowsSampleWindow from './gallery/samples/MultipleWindows/MultipleWindowsSampleWindow.vue'
import './styles/theme.css'
import './gallery/galleryShell.css'
import './styles/buttonResources.css'
import './styles/dropDownButtonResources.css'
import './styles/pivot.css'
import './styles/swipe.css'
import manifestTemplate from './manifest.json'
import appIconUrl from './assets/AppIcon.ico?url'
import appIcon180Url from './assets/AppIcon-180.png?url'
import appIcon192Url from './assets/AppIcon-192.png?url'
import appIcon512Url from './assets/AppIcon-512.png?url'
import { createI18n, i18nKey } from './components/i18n/index'
import galleryEnUS from './gallery/Strings/en-US/Resources'
import galleryZhCN from './gallery/Strings/zh-CN/Resources'
import TabViewSamplePage1 from './gallery/samples/TabView/SamplePage1.vue'
import TabViewSamplePage2 from './gallery/samples/TabView/SamplePage2.vue'
import TabViewSamplePage3 from './gallery/samples/TabView/SamplePage3.vue'
import TabViewWindowingSamplePage from './gallery/samples/TabView/TabViewWindowingSamplePage.vue'
import { tabViewHostAdapterKey } from './components/tabViewHostAdapter'
import { createTabViewPwaHost, readTabViewPwaSession, tabViewPwaHostKey, tabViewPwaSessionKey } from './components/tabViewPwaHost'
import { observePwaWindowChrome, syncPwaWindowChrome } from './utils/pwaWindowChrome'
import { connectWindowTitleBarFrame } from './utils/titleBarWindowFrame'
import { configureTitleBarWindowHost } from './components/titleBarHostAdapter'
import { createMultipleWindowManager, multipleWindowManagerKey } from './components/multipleWindowHostAdapter'
import { connectGalleryWindowBackdrop, galleryWindowBackdropKey, type GalleryWindowBackdropConnection } from './utils/galleryWindowBackdrop'

const systemBackdropSampleBootstrap = await readSystemBackdropSampleSession()
const systemBackdropSampleSession = systemBackdropSampleBootstrap && 'handle' in systemBackdropSampleBootstrap ? systemBackdropSampleBootstrap : undefined
const windowSampleRecoveryFailure = systemBackdropSampleBootstrap && 'RecoveryError' in systemBackdropSampleBootstrap ? systemBackdropSampleBootstrap : undefined
const tabViewPwaSession = readTabViewPwaSession()
const i18n = createI18n(tabViewPwaSession?.Locale ?? systemBackdropSampleBootstrap?.locale ?? navigator.language, {
  'en-US': galleryEnUS,
  'zh-CN': galleryZhCN
})

const manifestResources = manifestTemplate.resources ?? {}
const appTitleKey = manifestResources.title ?? 'app.title'
const appAuthorKey = manifestTemplate.author ?? 'app.author'
const appVersionKey = manifestTemplate.version ?? 'app.version'
document.documentElement.lang = i18n.locale
document.title = i18n.t(appTitleKey)
if (tabViewPwaSession) {
  document.documentElement.classList.remove('theme-light', 'theme-dark')
  const dark = tabViewPwaSession.Theme === 'Dark' || tabViewPwaSession.Theme === 'Default' && window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.add(dark ? 'theme-dark' : 'theme-light')
}
const tabViewPwaChromeColor = tabViewPwaSession ? syncPwaWindowChrome(window) : undefined

// The manifest is served from a blob URL, so root-relative values would be
// resolved against the blob and rejected by browsers. Resolve every URL
// against the page URL before serializing the manifest.
const resolveManifestUrl = (value: string) => new URL(value, window.location.href).href
const manifestIconUrls: Record<string, string> = {
  '@app-icon': appIconUrl,
  '@app-icon-180': appIcon180Url,
  '@app-icon-192': appIcon192Url,
  '@app-icon-512': appIcon512Url
}

const resolvedManifest = {
  ...manifestTemplate,
  ...(tabViewPwaChromeColor ? { theme_color: tabViewPwaChromeColor, background_color: tabViewPwaChromeColor } : {}),
  name: i18n.t(manifestResources.name ?? appTitleKey),
  short_name: i18n.t(manifestResources.shortName ?? 'app.shortTitle'),
  author: i18n.t(appAuthorKey),
  version: i18n.t(appVersionKey),
  start_url: resolveManifestUrl(import.meta.env.BASE_URL),
  icons: manifestTemplate.icons.map((icon) => ({
    ...icon,
    src: resolveManifestUrl(manifestIconUrls[icon.src] ?? icon.src)
  }))
}

const manifestLink = document.createElement('link')
manifestLink.rel = 'manifest'
manifestLink.href = URL.createObjectURL(new Blob(
  [JSON.stringify(resolvedManifest)],
  { type: 'application/manifest+json' }
))
document.head.appendChild(manifestLink)

const sampleRoot = systemBackdropSampleSession?.Kind === 'TitleBarDragRegions' ? TitleBarDragRegionsWindow
  : systemBackdropSampleSession?.Kind === 'TitleBarEndToEnd' ? TitleBarWindow
    : systemBackdropSampleSession?.Kind === 'CreateMultipleWindows' ? MultipleWindowsSampleWindow
      : systemBackdropSampleSession?.allowedBackdrops.length === 4 ? SampleBuiltInSystemBackdropsWindow : SampleSystemBackdropsWindow
const app = windowSampleRecoveryFailure ? createApp(WindowSampleRecoveryPage, { context: windowSampleRecoveryFailure })
  : systemBackdropSampleSession ? createApp(sampleRoot, { handle: systemBackdropSampleSession.handle, allowedBackdrops: systemBackdropSampleSession.allowedBackdrops })
  : tabViewPwaSession ? createApp(TabViewWindowingSamplePage) : createApp(App)
const tabViewPwaHost = createTabViewPwaHost({
  Window: window,
  BaseUrl: window.location.href,
  ApplicationScope: new URL(import.meta.env.BASE_URL, window.location.href).href,
  Locale: i18n.locale,
  Theme: () => document.documentElement.classList.contains('theme-dark') ? 'Dark' : 'Light'
})
app.provide(tabViewHostAdapterKey, tabViewPwaHost.Adapter)
app.provide(tabViewPwaHostKey, tabViewPwaHost)
const galleryWindowBackdrop = shallowRef<GalleryWindowBackdropConnection | null>(null)
app.provide(galleryWindowBackdropKey, galleryWindowBackdrop)
const multipleWindowManager = createMultipleWindowManager()
app.provide(multipleWindowManagerKey, multipleWindowManager)
const disposeMultipleWindows = (event: PageTransitionEvent) => {
  if (event.persisted) return
  window.removeEventListener('pagehide', disposeMultipleWindows)
  void multipleWindowManager.Dispose().catch(error => console.error(error))
}
window.addEventListener('pagehide', disposeMultipleWindows)
if (tabViewPwaSession) app.provide(tabViewPwaSessionKey, tabViewPwaSession)
const disposeTabViewPwaHost = (event: PageTransitionEvent) => {
  if (event.persisted) return
  window.removeEventListener('pagehide', disposeTabViewPwaHost)
  void tabViewPwaHost.Dispose()
}
window.addEventListener('pagehide', disposeTabViewPwaHost)
app.component('HomeHeaderTile.Source', HomeHeaderTile.Source)
if (!systemBackdropSampleBootstrap && !tabViewPwaSession) app.use(router)
registerWinUIComponents(app)
app.component('HorizontalScrollContainer.Source', HorizontalScrollContainer.Source)
app.component('ControlExample', ControlExample)
app.component('SampleCodePresenter', SampleCodePresenter)
app.component('ControlExample.Example', ControlExampleExample)
app.component('ControlExample.Output', ControlExampleOutput)
app.component('ControlExample.Options', ControlExampleOptions)
app.component('ControlExample.Substitutions', ControlExampleSubstitutions)
app.component('ControlExampleSubstitution', ControlExampleSubstitution)
app.component('samplepages:SamplePage1', TabViewSamplePage1)
app.component('samplepages:SamplePage2', TabViewSamplePage2)
app.component('samplepages:SamplePage3', TabViewSamplePage3)
app.provide(i18nKey, i18n)
app.config.globalProperties.$t = i18n.t
if (systemBackdropSampleSession) {
  const host = document.getElementById('app')!
  document.title = i18n.t(systemBackdropSampleSession.Kind === 'TitleBarDragRegions' ? 'sample.titlebar.drag-window-title' : systemBackdropSampleSession.Kind === 'TitleBarEndToEnd' ? 'sample.titlebar.end-window-title' : systemBackdropSampleSession.Kind === 'CreateMultipleWindows' ? 'sample.multiplewindows.child-window-title' : 'sample.systembackdrops.window-title')
  document.documentElement.style.height = '100%'
  document.documentElement.style.overflow = 'hidden'
  Object.assign(document.body.style, { margin: '0', width: '100%', height: '100%', overflow: 'hidden', background: 'transparent' })
  Object.assign(host.style, { width: '100%', height: '100%', minWidth: '0', minHeight: '0', overflow: 'auto', boxSizing: 'border-box' })
  host.className = 'win-system-backdrop-window-content win-theme-scope'
  const sampleMountAbort = new AbortController()
  let sampleMounted = false
  let releaseTitleBarFrame: (() => void) | undefined
  let releasePwaChrome: (() => void) | undefined
  const detachSampleWindow = (event: PageTransitionEvent) => {
    if (event.persisted) return
    window.removeEventListener('pagehide', detachSampleWindow)
    sampleMountAbort.abort()
    releasePwaChrome?.()
    if (sampleMounted) app.unmount()
    releaseTitleBarFrame?.()
    systemBackdropSampleSession.Detach?.()
  }
  window.addEventListener('pagehide', detachSampleWindow)
  void systemBackdropSampleSession.handle.SetContentElement(host).then(async () => {
    await configureTitleBarWindowHost(systemBackdropSampleSession.handle.TitleBarHost, {
      ExtendsContentIntoTitleBar: true,
      ...(systemBackdropSampleSession.Kind === 'TitleBarDragRegions' || systemBackdropSampleSession.Kind === 'TitleBarEndToEnd' ? { PreferredHeightOption: 'Tall' as const } : {}),
    }, sampleMountAbort.signal)
    if (sampleMountAbort.signal.aborted || systemBackdropSampleSession.handle.State.Status === 'Closed') return
    releaseTitleBarFrame = connectWindowTitleBarFrame(host, systemBackdropSampleSession.handle.TitleBarHost)
    app.mount(host)
    sampleMounted = true
    releasePwaChrome = observePwaWindowChrome(window, host)
    systemBackdropSampleSession.Ready()
  }).catch(error => {
    if (sampleMountAbort.signal.aborted) return
    console.error(error)
    void systemBackdropSampleSession.handle.Close().catch(failure => console.error(failure))
  })
} else if (windowSampleRecoveryFailure) {
  const host = document.getElementById('app')!
  document.title = i18n.t(windowSampleRecoveryFailure.Kind === 'TitleBarDragRegions' ? 'sample.titlebar.drag-window-title' : windowSampleRecoveryFailure.Kind === 'TitleBarEndToEnd' ? 'sample.titlebar.end-window-title' : windowSampleRecoveryFailure.Kind === 'CreateMultipleWindows' ? 'sample.multiplewindows.child-window-title' : 'sample.systembackdrops.window-title')
  Object.assign(document.documentElement.style, { height: '100%', overflow: 'hidden' })
  Object.assign(document.body.style, { margin: '0', width: '100%', height: '100%', overflow: 'hidden' })
  Object.assign(host.style, { width: '100%', height: '100%', minWidth: '0', minHeight: '0', overflow: 'auto' })
  host.className = 'win-system-backdrop-window-content win-theme-scope'
  const dark = windowSampleRecoveryFailure.RequestedTheme === 'Dark' || windowSampleRecoveryFailure.RequestedTheme === 'Default' && window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.remove('theme-light', 'theme-dark')
  document.documentElement.classList.add(dark ? 'theme-dark' : 'theme-light')
  const releaseTitleBarFrame = connectWindowTitleBarFrame(host)
  app.mount(host)
  const stopChrome = observePwaWindowChrome(window, host)
  window.addEventListener('pagehide', () => { stopChrome(); app.unmount(); releaseTitleBarFrame() }, { once: true })
} else if (tabViewPwaSession) {
  const host = document.getElementById('app')!
  document.title = i18n.t('sample.tabview.window-title')
  document.documentElement.style.height = '100%'
  document.documentElement.style.overflow = 'hidden'
  Object.assign(document.body.style, { margin: '0', width: '100%', height: '100%', overflow: 'hidden' })
  Object.assign(host.style, { width: '100%', height: '100%', minWidth: '0', minHeight: '0', overflow: 'auto', boxSizing: 'border-box' })
  host.className = 'win-tab-view-pwa-window-content win-theme-scope'
  const releasePwaChrome = observePwaWindowChrome(window)
  app.mount(host)
  const disposeTabViewPwaWindow = (event: PageTransitionEvent) => {
    if (event.persisted) return
    window.removeEventListener('pagehide', disposeTabViewPwaWindow)
    releasePwaChrome()
    app.unmount()
  }
  window.addEventListener('pagehide', disposeTabViewPwaWindow)
} else {
  const galleryHost = document.getElementById('app')!
  const connectionAbort = new AbortController()
  let releaseTitleBarHost: (() => void) | undefined
  let galleryMounted = false
  const storedTheme = localStorage.getItem('winui-theme-setting')
  const theme = storedTheme === 'dark' ? 'Dark' : storedTheme === 'light' ? 'Light' : 'Default'
  void connectGalleryWindowBackdrop(galleryHost, { theme, signal: connectionAbort.signal }).catch(error => {
    if (!connectionAbort.signal.aborted) console.error(error)
    return null
  }).then(async connection => {
    if (connectionAbort.signal.aborted) { void connection?.Dispose(); return }
    try { await configureTitleBarWindowHost(connection?.Handle.TitleBarHost, { ExtendsContentIntoTitleBar: true, PreferredHeightOption: 'Tall' }, connectionAbort.signal) }
    catch (error) { if (!connectionAbort.signal.aborted) console.error(error) }
    if (connectionAbort.signal.aborted) { void connection?.Dispose(); return }
    galleryWindowBackdrop.value = connection
    releaseTitleBarHost = connectWindowTitleBarFrame(galleryHost, connection?.Handle.TitleBarHost, false)
    app.mount(galleryHost)
    galleryMounted = true
  })
  const disposeGalleryWindow = (event: PageTransitionEvent) => {
    if (event.persisted) return
    window.removeEventListener('pagehide', disposeGalleryWindow)
    connectionAbort.abort()
    if (galleryMounted) app.unmount()
    releaseTitleBarHost?.()
    void galleryWindowBackdrop.value?.Dispose()
  }
  window.addEventListener('pagehide', disposeGalleryWindow)
}

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});
