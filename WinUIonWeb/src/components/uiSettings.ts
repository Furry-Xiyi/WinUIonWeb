import { reactive } from 'vue'

// ScrollViewer::IsConscious and ScrollView::AreScrollControllersAutoHiding
// read Windows UISettings.AutoHideScrollBars. The browser host uses the same
// shared setting. Follow the default conscious scrollbar behavior so the
// track and arrows collapse when the pointer leaves the scrollbar.
// Each control template still owns Hidden/Disabled/Auto visibility.
export const uiSettings = reactive({
  AutoHideScrollBars: true,
  AdvancedEffectsEnabled: true,
  AreEffectsFast: true,
  EnergySaverStatus: false,
  IsHighContrast: false,
})

export type UISettingsMaterialPolicy = Partial<{
  AutoHideScrollBars: boolean
  AdvancedEffectsEnabled: boolean
  AreEffectsFast: boolean
  EnergySaverStatus: boolean
  IsHighContrast: boolean
}>

/** Native UISettings/PowerManager policy shared by every in-app material. */
export interface UISettingsHostAdapter {
  Read(): UISettingsMaterialPolicy
  Subscribe(listener: (policy: UISettingsMaterialPolicy) => void): () => void
}

let currentAdapter: UISettingsHostAdapter | undefined
let unsubscribePolicy: (() => void) | undefined
const publishPolicy = (policy: UISettingsMaterialPolicy) => {
  for (const key of Object.keys(uiSettings) as (keyof typeof uiSettings)[]) {
    const value = policy[key]
    if (typeof value === 'boolean') uiSettings[key] = value
  }
}

export function setUISettingsHostAdapter(adapter: UISettingsHostAdapter | undefined): () => void {
  const previous = currentAdapter
  const previousPolicy = { ...uiSettings }
  unsubscribePolicy?.()
  currentAdapter = adapter
  unsubscribePolicy = undefined
  if (adapter) { publishPolicy(adapter.Read()); unsubscribePolicy = adapter.Subscribe(publishPolicy) }
  return () => {
    if (currentAdapter !== adapter) return
    unsubscribePolicy?.()
    currentAdapter = previous
    publishPolicy(previousPolicy)
    unsubscribePolicy = previous?.Subscribe(publishPolicy)
  }
}
