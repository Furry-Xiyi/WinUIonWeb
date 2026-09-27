<template>
  <ToolTipService />
  <Page>
    <Grid class="tabview-window-shell" HorizontalAlignment="Stretch" VerticalAlignment="Stretch" Background="{ThemeResource ApplicationPageBackgroundThemeBrush}">
      <TabView x:Name="Tabs" class="tabview-window-tabs" VerticalAlignment="Stretch"
        TabItemsSource="{x:Bind Documents, Mode=OneWay}" AddTabButtonClick="Tabs_AddTabButtonClick"
        CanDragTabs="True" CanReorderTabs="True" CanTearOutTabs="True" AllowDrop="True"
        ExternalTornOutTabsDropped="Tabs_ExternalTornOutTabsDropped" ExternalTornOutTabsDropping="Tabs_ExternalTornOutTabsDropping"
        Loaded="TabViewWindowingSamplePage_Loaded" SelectionChanged="Tabs_SelectionChanged" TabCloseRequested="Tabs_TabCloseRequested"
        TabTearOutRequested="Tabs_TabTearOutRequested" TabTearOutWindowRequested="Tabs_TabTearOutWindowRequested">
        <TabView.TabStripHeader>
          <Grid x:Name="ShellTitleBarInset" class="tabview-shell-titlebar-inset" Width="{x:Bind ShellTitleBarInsetWidth, Mode=OneWay}" Background="Transparent" />
        </TabView.TabStripHeader>
        <TabView.TabStripFooter>
          <Grid x:Name="CustomDragRegion" class="tabview-window-drag-region" MinWidth="188" Padding="{x:Bind CaptionInsetPadding, Mode=OneWay}" Background="Transparent" />
        </TabView.TabStripFooter>
        <TabView.TabItemTemplate>
          <DataTemplate x:DataType="local:TabDocument">
            <TabViewItem Header="{x:Bind Header}">
              <TabViewItem.IconSource><SymbolIconSource Symbol="{x:Bind Icon}" /></TabViewItem.IconSource>
              <TabViewItem.Content><TabContentSampleControl DataContext="{x:Bind}" /></TabViewItem.Content>
            </TabViewItem>
          </DataTemplate>
        </TabView.TabItemTemplate>
      </TabView>
    </Grid>
  </Page>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, shallowReactive, shallowRef } from 'vue'
import { DataTemplate } from '../../../components/CollectionProperties'
import Grid from '../../../components/Grid.vue'
import Page from '../../../components/Page.vue'
import { SymbolIconSource } from '../../../components/IconSource'
import TabView from '../../../components/TabView.vue'
import TabViewItem from '../../../components/TabViewItem.vue'
import ToolTipService from '../../../components/ToolTipService.vue'
import { useI18n } from '../../../components/i18n/index'
import { createTabViewCallbackSource, createTabViewHostAdapter, tabViewHostAdapterKey, type TabViewHostAdapter, type TabViewWindowId } from '../../../components/tabViewHostAdapter'
import { cloneTabViewPwaDocuments, createTabViewPwaHost, tabViewPwaHostKey, tabViewPwaSessionKey, type TabViewPwaCapabilities, type TabViewPwaDocument, type TabViewPwaHost, type TabViewPwaSession } from '../../../components/tabViewPwaHost'
import { isTabViewNativeDropHandled, tabViewNativeDragBridgeKey } from '../../../components/tabViewNativeDragBridge'
import { connectTitleBarWindowHost, titleBarHostAdapterKey, type TitleBarHostAdapter, type TitleBarRegion, type TitleBarWindowHost } from '../../../components/titleBarHostAdapter'
import { xamlNameScopeKey } from '../../../components/xamlRuntime'
import TabContentSampleControl from './TabContentSampleControl.vue'
import { tabViewCapabilityText, tabViewDisplayModeText, tabViewOperationFailure, tabViewWindowSampleInfoKey } from './tabViewWindowStatus'

type TabControl = { Element: HTMLElement | null; SelectedItem: TabViewPwaDocument | null; SelectedIndex: number }
type TornOutArgs = { Items: readonly TabViewPwaDocument[]; Tabs: readonly { ParentTabView?: TabControl }[]; NewWindowId?: TabViewWindowId; DropIndex: number; AllowDrop: boolean; SourceTabView?: TabControl; Source?: TabControl; Cancel?: boolean; Signal?: AbortSignal }
type Overlay = EventTarget & { visible: boolean; getTitlebarAreaRect(): DOMRect }
const props = defineProps<{ Session?: TabViewPwaSession | null }>()
const session = props.Session ?? inject<TabViewPwaSession | null>(tabViewPwaSessionKey, null)
const { t, locale } = useI18n()
const names = shallowReactive<Record<string, unknown>>({})
provide(xamlNameScopeKey, names)
const primaryControl = shallowRef<TabControl | null>(null)
const Documents = shallowReactive<TabViewPwaDocument[]>(session
  ? cloneTabViewPwaDocuments(session.InitialDocuments).map(document => reactive(document))
  : [])
const selectedId = ref<string | null>(session?.InitialSelectedId ?? null)
const primarySource = createTabViewCallbackSource({
  Read: () => Documents,
  // Local transactions retain document identity. Remote windows realize DTOs.
  Write: items => { Documents.splice(0, Documents.length, ...items); ScheduleTitleBarRegions() },
  ReadSelectedItem: () => Documents.find(document => document.Id === selectedId.value) ?? null,
  WriteSelectedItem: item => { selectedId.value = item?.Id ?? null; if (primaryControl.value) primaryControl.value.SelectedItem = item }
})
const suppliedAdapter = inject<TabViewHostAdapter<TabViewPwaDocument> | null>(tabViewHostAdapterKey, null)
const suppliedPwaHost = inject<TabViewPwaHost | null>(tabViewPwaHostKey, null)
const ownedHost = !suppliedAdapter ? createTabViewPwaHost({ BaseUrl: new URL(import.meta.env.BASE_URL, window.location.href).href, Locale: () => locale, Theme: () => document.documentElement.classList.contains('theme-dark') ? 'Dark' : 'Light' }) : null
const pwaHost = suppliedPwaHost ?? ownedHost
const adapter = pwaHost?.Adapter ?? suppliedAdapter ?? createTabViewHostAdapter<TabViewPwaDocument>()
if (pwaHost) provide(tabViewNativeDragBridgeKey, pwaHost.NativeDragBridge)
const capabilities = shallowRef<TabViewPwaCapabilities | null>(pwaHost?.Capabilities ?? null)
const releaseHostSubscription = pwaHost?.Subscribe(value => { capabilities.value = value })
const CapabilityOutput = computed(() => tabViewCapabilityText(capabilities.value, t))
const SelectionOutput = computed(() => t('sample.tabview.selection-output', { count: Documents.length, index: primaryControl.value?.SelectedIndex ?? -1, header: primarySource.ReadSelectedItem?.()?.Header ?? t('sample.tabview.none') }))
const OperationOutput = ref('')
provide(tabViewWindowSampleInfoKey, computed(() => ({ CapabilityOutput: CapabilityOutput.value, SelectionOutput: SelectionOutput.value, OperationOutput: OperationOutput.value })))
const abortController = new AbortController()
let releaseSession: (() => void) | undefined
let releaseNativeSource: (() => void) | undefined
let tabTearOutWindow: TabViewWindowId | undefined
const overlay = (navigator as Navigator & { windowControlsOverlay?: Overlay }).windowControlsOverlay
const titleBarAdapter = inject<TitleBarHostAdapter | null>(titleBarHostAdapterKey, null)
let titleBarHost: TitleBarWindowHost | null = null
let titleBarObserver: ResizeObserver | undefined
let titleBarFrame = 0
const shellInset = ref(0)
const captionInset = ref(0)
const ShellTitleBarInsetWidth = computed(() => shellInset.value)
const CaptionInsetPadding = computed(() => `0,0,${captionInset.value},0`)
const region = (element: HTMLElement): TitleBarRegion => {
  const bounds = element.getBoundingClientRect()
  return { X: bounds.x, Y: bounds.y, Width: bounds.width, Height: bounds.height }
}
async function UpdateTitleBarRegions() {
  titleBarFrame = 0
  const bounds = overlay?.visible ? overlay.getTitlebarAreaRect() : null
  shellInset.value = bounds ? Math.max(0, bounds.x) : 0
  captionInset.value = bounds ? Math.max(0, window.innerWidth - bounds.x - bounds.width) : 0
  await nextTick()
  if (abortController.signal.aborted) return
  const root = primaryControl.value?.Element
  const drag = root?.querySelector<HTMLElement>('.tabview-window-drag-region')
  if (!root || !drag || !titleBarHost?.SetDragRegions) return
  const passthrough = [...root.querySelectorAll<HTMLElement>('[role="tab"],button')].map(region).filter(bounds => bounds.Width > 0 && bounds.Height > 0)
  titleBarHost.SetDragRegions({ Caption: region(drag), Passthrough: passthrough, Icon: null })
}
function ScheduleTitleBarRegions() { if (!titleBarFrame) titleBarFrame = window.requestAnimationFrame(UpdateTitleBarRegions) }
function CreateNewDocument(header: string, title: string): TabViewPwaDocument { return reactive({ Id: `tabview-${crypto.randomUUID()}`, Header: header, Title: title, IsOn: false, Icon: 'Placeholder' }) }
function LoadDemoData() {
  if (Documents.length) return
  Documents.push(...Array.from({ length: 3 }, (_, index) => CreateNewDocument(t('sample.tabview.window-item', { index }), t('sample.tabview.window-page', { index }))))
  primarySource.WriteSelectedItem?.(Documents[0] ?? null)
}
function TabViewWindowingSamplePage_Loaded(sender: TabControl) {
  primaryControl.value = sender
  primarySource.WriteSelectedItem?.(Documents.find(item => item.Id === selectedId.value) ?? Documents[0] ?? null)
  releaseNativeSource?.()
  releaseNativeSource = pwaHost?.NativeDragBridge.RegisterSource(sender, primarySource, {
    RealizeDocument: document => reactive(document),
    OnTransferCompleted: result => { if (result.Status === 'Accepted' && !Documents.length && session) window.close() }
  })
  if (sender.Element) {
    titleBarHost = connectTitleBarWindowHost(sender.Element, titleBarAdapter)
    titleBarObserver = new ResizeObserver(ScheduleTitleBarRegions)
    titleBarObserver.observe(sender.Element)
    const dragRegion = sender.Element.querySelector<HTMLElement>('.tabview-window-drag-region')
    if (dragRegion) titleBarObserver.observe(dragRegion)
  }
  ScheduleTitleBarRegions()
}
function AddTabToTabs(document: TabViewPwaDocument) { Documents.push(reactive(cloneTabViewPwaDocuments([document])[0]!)) }
function Tabs_AddTabButtonClick() { const document = CreateNewDocument(t('sample.tabview.window-new-item'), t('sample.tabview.window-new-item')); primarySource.Write([...primarySource.Read(), document]); primarySource.WriteSelectedItem?.(document) }
function Tabs_TabCloseRequested(_sender: TabControl, args: { Item: TabViewPwaDocument }) {
  const current = primarySource.Read(); const index = current.findIndex(document => document.Id === args.Item?.Id)
  if (index < 0) return
  const selected = primarySource.ReadSelectedItem?.()
  primarySource.Write(current.filter((_, itemIndex) => itemIndex !== index))
  if (selected?.Id === args.Item.Id) primarySource.WriteSelectedItem?.(primarySource.Read()[Math.min(index, primarySource.Read().length - 1)] ?? null)
  ScheduleTitleBarRegions()
  if (!Documents.length && session) window.close()
}
function Tabs_SelectionChanged(sender: TabControl) { selectedId.value = sender.SelectedItem?.Id ?? null; ScheduleTitleBarRegions() }
async function Tabs_TabTearOutWindowRequested(_sender: TabControl, args: TornOutArgs) {
  const result = await adapter.CreateWindow({ Source: primarySource, Items: args.Items, Tabs: args.Tabs, Signal: args.Signal ?? abortController.signal })
  if (result.Status === 'Accepted' && result.NewWindowId !== undefined) { tabTearOutWindow = result.NewWindowId; args.NewWindowId = result.NewWindowId }
  else { args.Cancel = true; OperationOutput.value = tabViewOperationFailure(result, capabilities.value, t) }
}
async function Tabs_TabTearOutRequested(_sender: TabControl, args: TornOutArgs) {
  const newWindowId = args.NewWindowId ?? tabTearOutWindow
  if (newWindowId === undefined) { args.Cancel = true; return }
  const result = await adapter.TearOut({ Source: primarySource, Items: args.Items, Tabs: args.Tabs, NewWindowId: newWindowId, Signal: args.Signal ?? abortController.signal })
  args.Cancel = result.Status !== 'Accepted'
  OperationOutput.value = result.Status === 'Accepted'
    ? t('sample.tabview.window-transferred', { header: args.Items.map(item => item.Header).join(', '), mode: tabViewDisplayModeText(capabilities.value?.LastWindowDisplayMode ?? null, t) })
    : tabViewOperationFailure(result, capabilities.value, t)
  tabTearOutWindow = undefined
  if (result.Status === 'Accepted' && !Documents.length && session) window.close()
}
function Tabs_ExternalTornOutTabsDropping(_sender: TabControl, args: TornOutArgs) { args.AllowDrop = true }
async function Tabs_ExternalTornOutTabsDropped(_sender: TabControl, args: TornOutArgs) {
  if (isTabViewNativeDropHandled(args)) { OperationOutput.value = t('sample.tabview.window-drag-transferred', { count: args.Items.length }); return }
  const from = args.SourceTabView ?? args.Source ?? args.Tabs[0]?.ParentTabView
  // Cross-window transactions belong to the authenticated native bridge.
  if (from !== primaryControl.value) { args.Cancel = true; return }
  const result = await adapter.Move({ Source: primarySource, Target: primarySource, Items: args.Items, Tabs: args.Tabs, DropIndex: args.DropIndex, Signal: args.Signal ?? abortController.signal })
  args.Cancel = result.Status !== 'Accepted'
}
onMounted(async () => {
  window.addEventListener('resize', ScheduleTitleBarRegions)
  overlay?.addEventListener('geometrychange', ScheduleTitleBarRegions)
  await nextTick()
  if (abortController.signal.aborted) return
  if (session) releaseSession = session.Ready(primarySource, { RealizeDocument: document => reactive(document) })
  else LoadDemoData()
  ScheduleTitleBarRegions()
})
onBeforeUnmount(() => {
  abortController.abort(); releaseNativeSource?.(); releaseSession?.(); releaseHostSubscription?.()
  window.removeEventListener('resize', ScheduleTitleBarRegions); overlay?.removeEventListener('geometrychange', ScheduleTitleBarRegions)
  titleBarObserver?.disconnect(); titleBarHost?.ClearDragRegions?.()
  if (titleBarFrame) window.cancelAnimationFrame(titleBarFrame)
  if (tabTearOutWindow !== undefined) void adapter.CancelWindow(tabTearOutWindow)
  if (ownedHost) void ownedHost.Dispose()
})
defineExpose({ LoadDemoData, AddTabToTabs, Documents, primarySource })
</script>

<style scoped>
.tabview-window-shell, .tabview-window-tabs { width: 100%; height: 100dvh; min-width: 0; min-height: 0; overflow: hidden; }
.tabview-window-tabs :deep(.win-tab-view-content-presenter) { min-height: 0; overflow: auto; }
.tabview-shell-titlebar-inset, .tabview-window-drag-region { min-height: 32px; app-region: drag; -webkit-app-region: drag; }
.tabview-window-tabs :deep(.win-tab-view-item), .tabview-window-tabs :deep(button), .tabview-window-tabs :deep(.win-tab-view-content-presenter) { app-region: no-drag; -webkit-app-region: no-drag; }
</style>
