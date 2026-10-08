import { createApp } from 'vue'
import TitleBarDragRegionsWindow from './TitleBarDragRegionsWindow.vue'
import TitleBarWindow from './TitleBarWindow.vue'
import { createI18n, i18nKey, type Locale } from '../../../components/i18n/index'
import type { SystemBackdropWindowHandle } from '../../../components/systemBackdropHostAdapter'
import { mountWindowSampleSession } from '../SystemBackdrops/mountSystemBackdropsWindow'
import { connectWindowTitleBarFrame } from '../../../utils/titleBarWindowFrame'
import { configureTitleBarWindowHost } from '../../../components/titleBarHostAdapter'
import { XamlDouble } from '../../../components/xamlPrimitives'
import enUS from '../../Strings/en-US/Resources'
import zhCN from '../../Strings/zh-CN/Resources'

export const mountTitleBarSampleWindow = (element: HTMLElement, handle: SystemBackdropWindowHandle, Kind: 'TitleBarDragRegions' | 'TitleBarEndToEnd', locale: Locale) => {
  const cleanup = mountWindowSampleSession(element, handle, { Kind, locale, allowedBackdrops: [] })
  if (cleanup) return cleanup
  const app = createApp(Kind === 'TitleBarDragRegions' ? TitleBarDragRegionsWindow : TitleBarWindow, { handle })
  // eslint-disable-next-line vue/multi-word-component-names -- Official XAML primitive name.
  app.component('x:Double', XamlDouble)
  app.provide(i18nKey, createI18n(locale, { 'en-US': enUS, 'zh-CN': zhCN }))
  const abort = new AbortController()
  let disposed = false, mounted = false
  let releaseTitleBarFrame: (() => void) | undefined
  const subscription: { Stop?: () => void } = {}
  const dispose = () => {
    if (disposed) return
    disposed = true
    abort.abort()
    subscription.Stop?.()
    if (mounted) app.unmount()
    releaseTitleBarFrame?.()
  }
  subscription.Stop = handle.Subscribe(state => { if (state.Status === 'Closed') dispose() })
  if (disposed) subscription.Stop()
  void configureTitleBarWindowHost(handle.TitleBarHost, { ExtendsContentIntoTitleBar: true, PreferredHeightOption: 'Tall' }, abort.signal).then(() => {
    if (disposed || handle.State.Status === 'Closed') return
    releaseTitleBarFrame = connectWindowTitleBarFrame(element, handle.TitleBarHost)
    app.mount(element)
    mounted = true
  }).catch(error => {
    if (disposed) return
    element.ownerDocument.defaultView?.console.error(error)
    dispose()
    void handle.Close().catch(failure => element.ownerDocument.defaultView?.console.error(failure))
  })
  return dispose
}
