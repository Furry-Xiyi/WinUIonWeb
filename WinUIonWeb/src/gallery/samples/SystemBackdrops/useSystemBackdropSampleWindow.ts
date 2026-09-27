import { computed, onBeforeUnmount, onMounted, provide, ref, shallowReactive } from 'vue'
import { useI18n } from '../../../components/i18n/index'
import { xamlNameScopeKey, xamlScopeKey } from '../../../components/xamlRuntime'
import type { SystemBackdropConfig } from '../../../components/systemBackdrop'
import type { SystemBackdropWindowHandle, SystemBackdropState } from '../../../components/systemBackdropHostAdapter'
import type { SampleBackdropType } from './mountSystemBackdropsWindow'

export const useSystemBackdropSampleWindow = (props: { handle: SystemBackdropWindowHandle; allowedBackdrops: SampleBackdropType[] }) => {
  const { t } = useI18n()
  const Labels = computed(() => ({
    windowTitle: t('sample.systembackdrops.window-title'), currentBackdrop: t('sample.systembackdrops.current-backdrop'), windowTheme: t('sample.systembackdrops.window-theme'),
    mica: t('sample.systembackdrops.backdrop.mica'), micaAlt: t('sample.systembackdrops.backdrop.mica-alt'), acrylic: t('sample.systembackdrops.backdrop.acrylic'), none: t('sample.systembackdrops.backdrop.none'),
    defaultTheme: t('sample.systembackdrops.theme.default'), lightTheme: t('sample.systembackdrops.theme.light'), darkTheme: t('sample.systembackdrops.theme.dark')
  }))
  const backdropItems = computed(() => props.allowedBackdrops.map(Value => ({ Value, Label: t(`sample.systembackdrops.backdrop.${Value === 'MicaAlt' ? 'mica-alt' : Value === 'AcrylicThin' ? 'acrylic-thin' : Value.toLowerCase()}`) })))
  const backdropValue = (config: SystemBackdropConfig | null): SampleBackdropType => !config ? 'None' : config.Type === 'Mica' ? config.Kind === 'BaseAlt' ? 'MicaAlt' : 'Mica' : config.Kind === 'Thin' ? 'AcrylicThin' : 'Acrylic'
  const selectedBackdropIndex = ref(Math.max(0, props.allowedBackdrops.indexOf(backdropValue(props.handle.State.RequestedBackdrop))))
  const initialTheme = props.handle.State.RequestedTheme
  const selectedThemeIndex = ref(initialTheme === 'Light' ? 1 : initialTheme === 'Dark' ? 2 : 0)
  const state = ref<SystemBackdropState>(props.handle.State)
  const operationError = ref(false)
  const statusText = computed(() => {
    if (operationError.value) return t('sample.systembackdrops.operation-failed')
    if (state.value.Status === 'Closed') return t('sample.systembackdrops.closed')
    if (state.value.Status === 'HighContrast') return t('sample.systembackdrops.high-contrast')
    if (state.value.Status === 'Fallback') {
      const key = state.value.Reason === 'Inactive' ? 'sample.systembackdrops.inactive'
        : state.value.Reason === 'TransparencyDisabled' ? 'sample.systembackdrops.transparency-disabled'
          : state.value.Reason === 'MaterialUnsupported' ? 'sample.systembackdrops.effect-unavailable'
            : state.value.Reason === 'EnergySaver' ? 'sample.systembackdrops.energy-saver'
              : state.value.Reason === 'HostError' ? 'sample.systembackdrops.operation-failed'
                : 'sample.systembackdrops.native-unavailable'
      return t(key)
    }
    const applied = state.value.AppliedBackdrop?.Type === 'DesktopAcrylic'
      ? state.value.AppliedBackdrop.Kind === 'Thin' ? t('sample.systembackdrops.backdrop.acrylic-thin') : t('sample.systembackdrops.backdrop.acrylic')
      : state.value.AppliedBackdrop?.Kind === 'BaseAlt' ? t('sample.systembackdrops.backdrop.mica-alt')
        : state.value.AppliedBackdrop ? t('sample.systembackdrops.backdrop.mica') : t('sample.systembackdrops.backdrop.none')
    return t('sample.systembackdrops.applied', { backdrop: applied })
  })
  const windowBackground = computed(() => !state.value.RequestedBackdrop && selectedThemeIndex.value !== 0 ? state.value.Theme === 'Dark' ? 'Black' : 'White' : 'Transparent')
  const configurationFor = (value: string): SystemBackdropConfig | null => {
    if (value === 'Mica') return { Type: 'Mica', Kind: 'Base' }
    if (value === 'MicaAlt') return { Type: 'Mica', Kind: 'BaseAlt' }
    if (value === 'Acrylic') return { Type: 'DesktopAcrylic', Kind: 'Base' }
    if (value === 'AcrylicThin') return { Type: 'DesktopAcrylic', Kind: 'Thin' }
    return null
  }
  let backdropOperation = 0
  const BackdropComboBox_SelectionChanged = async (sender: { SelectedIndex?: number }, event: { AddedItems?: Array<{ Value?: string }> }) => {
    const selected = event.AddedItems?.[0]?.Value ?? props.allowedBackdrops[sender.SelectedIndex ?? selectedBackdropIndex.value]
    if (!selected) return
    selectedBackdropIndex.value = Math.max(0, props.allowedBackdrops.indexOf(selected as SampleBackdropType))
    const operation = ++backdropOperation
    operationError.value = false
    try {
      const next = await props.handle.SetSystemBackdrop(configurationFor(selected))
      if (operation !== backdropOperation) return
      state.value = next
    } catch { if (operation === backdropOperation) operationError.value = true }
  }
  let themeOperation = 0
  const ThemeComboBox_SelectionChanged = async (sender: { SelectedIndex?: number }) => {
    const index = sender.SelectedIndex ?? selectedThemeIndex.value
    const requested = index === 1 ? 'Light' : index === 2 ? 'Dark' : 'Default'
    const operation = ++themeOperation
    selectedThemeIndex.value = index
    operationError.value = false
    try {
      const next = await props.handle.SetTheme(requested)
      if (operation === themeOperation) state.value = next
    } catch { if (operation === themeOperation) operationError.value = true }
  }
  const onStateChanged = (next: SystemBackdropState) => { state.value = next }
  let unsubscribe: (() => void) | undefined
  onMounted(() => { unsubscribe = props.handle.Subscribe(onStateChanged) })
  onBeforeUnmount(() => { ++backdropOperation; ++themeOperation; unsubscribe?.() })
  provide(xamlNameScopeKey, shallowReactive({}))
  provide(xamlScopeKey, { Labels, statusText, windowBackground, backdropItems, selectedBackdropIndex, selectedThemeIndex, BackdropComboBox_SelectionChanged, ThemeComboBox_SelectionChanged })
  
  return { Labels, statusText, windowBackground, backdropItems, selectedBackdropIndex, selectedThemeIndex, BackdropComboBox_SelectionChanged, ThemeComboBox_SelectionChanged }
}
