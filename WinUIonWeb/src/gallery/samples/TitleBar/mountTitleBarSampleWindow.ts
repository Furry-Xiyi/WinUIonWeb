import { createApp } from 'vue'
import TitleBarDragRegionsWindow from './TitleBarDragRegionsWindow.vue'
import TitleBarWindow from './TitleBarWindow.vue'
import { createI18n, i18nKey, type Locale } from '../../../components/i18n/index'
import type { SystemBackdropWindowHandle } from '../../../components/systemBackdropHostAdapter'
import { mountWindowSampleSession } from '../SystemBackdrops/mountSystemBackdropsWindow'
import { connectWindowTitleBarFrame } from '../../../utils/titleBarWindowFrame'
import enUS from '../../Strings/en-US/Resources'
import zhCN from '../../Strings/zh-CN/Resources'

export const mountTitleBarSampleWindow = (element: HTMLElement, handle: SystemBackdropWindowHandle, Kind: 'TitleBarDragRegions' | 'TitleBarEndToEnd', locale: Locale) => {
  const cleanup = mountWindowSampleSession(element, handle, { Kind, locale, allowedBackdrops: [] })
  if (cleanup) return cleanup
  const app = createApp(Kind === 'TitleBarDragRegions' ? TitleBarDragRegionsWindow : TitleBarWindow, { handle })
  app.provide(i18nKey, createI18n(locale, { 'en-US': enUS, 'zh-CN': zhCN }))
  const releaseTitleBarFrame = connectWindowTitleBarFrame(element, handle.TitleBarHost)
  app.mount(element)
  return () => { app.unmount(); releaseTitleBarFrame() }
}
