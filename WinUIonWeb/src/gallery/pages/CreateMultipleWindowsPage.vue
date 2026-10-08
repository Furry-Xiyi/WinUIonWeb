<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollMode="Auto" VerticalScrollBarVisibility="Auto" HorizontalScrollMode="Disabled" HorizontalScrollBarVisibility="Disabled">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind Labels.title, Mode=OneWay}" />
          <StackPanel class="page-header-actions" Orientation="Horizontal" Spacing="4">
            <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind Labels.toggleTheme, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind Labels.toggleTheme, Mode=OneWay}"><FontIcon Glyph="&#xE793;" /></Button>
            <ToggleButton class="header-action" Click="toggleFavorite" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" /></ToggleButton>
          </StackPanel>
        </StackPanel>
        <StackPanel class="gallery-page-content">
          <ControlExample SampleDefinition="CreateMultipleWindows\CreateMultipleWindowsCreateSingleThreadedMultiple.txt" HeaderText="{x:Bind Labels.header, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" CSharp="{x:Bind sampleCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <Button x:Name="Control1" Click="CreateNewWindow_Click" Content="{x:Bind Labels.createWindow, Mode=OneWay}" />
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind WindowOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, provide, shallowReactive, shallowRef, watch, type Ref } from 'vue'
import Button from '../../components/Button.vue'
import ControlExample from '../../components/ControlExample.vue'
import FontIcon from '../../components/FontIcon.vue'
import Page from '../../components/Page.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { createMultipleWindowManager, multipleWindowManagerKey, type MultipleWindowManager } from '../../components/multipleWindowHostAdapter'
import { MicaBackdrop } from '../../components/systemBackdrop'
import type { SystemBackdropState } from '../../components/systemBackdropHostAdapter'
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import { mountMultipleWindowsSampleWindow } from '../samples/MultipleWindows/mountMultipleWindowsSampleWindow'
import sampleDefinition from '../samples/MultipleWindows/CreateMultipleWindowsCreateSingleThreadedMultiple.txt?raw'

const i18n = useI18n()
const { t } = i18n
const currentPage = inject<{ value: string }>('currentPage')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'createmultiplewindows')
const appThemeSetting = inject<Ref<string> | undefined>('themeSetting', undefined)
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
const systemTheme = shallowRef(systemThemeQuery.matches ? 'dark' : 'light')
const parentTheme = computed(() => appThemeSetting?.value === 'dark' || appThemeSetting?.value === 'light' ? appThemeSetting.value : systemTheme.value)
const onSystemThemeChange = () => { systemTheme.value = systemThemeQuery.matches ? 'dark' : 'light' }
systemThemeQuery.addEventListener('change', onSystemThemeChange)
watch(parentTheme, theme => { pageTheme.value = theme === 'dark' ? 'dark' : 'light' }, { immediate: true })
const inheritedManager = inject<MultipleWindowManager | undefined>(multipleWindowManagerKey, undefined)
const manager = inheritedManager ?? createMultipleWindowManager()
const actualTheme = computed(() => pageTheme.value === 'dark' ? 'Dark' : 'Light')
const Labels = computed(() => ({ title: t('text.createmultiplewindows'), header: t('sample.multiplewindows.header'), createWindow: t('sample.multiplewindows.create-window'), toggleTheme: t('gallery.page-header.toggle-theme') }))
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'))
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const sampleCSharp = sampleDefinition.match(/(?:^|\r?\n)--- c#\r?\n([\s\S]*?)(?=\r?\n--- |$)/)?.[1]?.trim() ?? ''
const latestState = shallowRef<SystemBackdropState>()
const operationError = shallowRef<string>()
const WindowOutput = computed(() => {
  if (operationError.value) return t(operationError.value)
  const state = latestState.value
  if (!state) return ''
  if (state.Status === 'Closed') return t('sample.systembackdrops.closed')
  if (state.Reason === 'NativeBackdropUnavailable') return t('sample.multiplewindows.browser-window-opened')
  if (state.Status === 'HighContrast') return t('sample.systembackdrops.high-contrast')
  if (state.Reason === 'HostError') return t('sample.systembackdrops.operation-failed')
  return t('sample.systembackdrops.window-opened')
})
let unsubscribe: (() => void) | undefined
const CreateNewWindow_Click = async () => {
  operationError.value = undefined
  try {
    const handle = await manager.CreateWindow({
      title: t('sample.multiplewindows.child-window-title'), width: 500, height: 500,
      theme: actualTheme.value, backdrop: new MicaBackdrop(), extendsContentIntoTitleBar: true,
      mountContent: (element, childWindow) => mountMultipleWindowsSampleWindow(element, childWindow, i18n.locale)
    })
    unsubscribe?.()
    unsubscribe = handle.Subscribe(state => { latestState.value = state })
  } catch (error) {
    const code = (error as { Code?: string }).Code
    operationError.value = code === 'PopupBlocked' ? 'sample.systembackdrops.popup-blocked' : code === 'HostUnavailable' ? 'sample.systembackdrops.window-unavailable' : 'sample.systembackdrops.window-failed'
  }
}
watch(actualTheme, theme => { void manager.SetTheme(theme).catch(() => { operationError.value = 'sample.multiplewindows.theme-failed' }) })
onBeforeUnmount(() => { systemThemeQuery.removeEventListener('change', onSystemThemeChange); unsubscribe?.(); if (!inheritedManager) void manager.Dispose() })
provide(xamlNameScopeKey, shallowReactive({}))
provide(xamlScopeKey, { Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite, sampleCSharp, WindowOutput, CreateNewWindow_Click })
</script>

<style scoped>
:deep(.page-heading) { position: relative; min-width: 0; }
:deep(.page-header) { font-size: 28px; font-weight: 600; margin: 0 80px 8px 0; color: var(--text-primary); overflow-wrap: anywhere; }
:deep(.page-header-actions) { position: absolute; right: 0; top: 0; }
</style>
