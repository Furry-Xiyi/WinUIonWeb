import { createApp } from 'vue'
import MultipleWindowsSampleWindow from './MultipleWindowsSampleWindow.vue'
import { createI18n, i18nKey, type Locale } from '../../../components/i18n/index'
import type { SystemBackdropWindowHandle } from '../../../components/systemBackdropHostAdapter'
import { connectWindowTitleBarFrame } from '../../../utils/titleBarWindowFrame'
import { configureTitleBarWindowHost } from '../../../components/titleBarHostAdapter'
import { mountWindowSampleSession } from '../SystemBackdrops/mountSystemBackdropsWindow'
import enUS from '../../Strings/en-US/Resources'
import zhCN from '../../Strings/zh-CN/Resources'

export const mountMultipleWindowsSampleWindow = (element: HTMLElement, handle: SystemBackdropWindowHandle, locale: Locale) => {
  const cleanup = mountWindowSampleSession(element, handle, { Kind: 'CreateMultipleWindows', locale, allowedBackdrops: [] })
  if (cleanup) return cleanup
  const app = createApp(MultipleWindowsSampleWindow, { handle })
  app.provide(i18nKey, createI18n(locale, { 'en-US': enUS, 'zh-CN': zhCN }))
  const abort = new AbortController()
  let mounted = false
  let releaseTitleBarFrame: (() => void) | undefined
  void configureTitleBarWindowHost(handle.TitleBarHost, { ExtendsContentIntoTitleBar: true, PreferredHeightOption: 'Standard' }, abort.signal).then(() => {
    if (abort.signal.aborted || handle.State.Status === 'Closed') return
    releaseTitleBarFrame = connectWindowTitleBarFrame(element, handle.TitleBarHost, false)
    app.mount(element)
    mounted = true
  })
  return () => { abort.abort(); if (mounted) app.unmount(); releaseTitleBarFrame?.() }
}
