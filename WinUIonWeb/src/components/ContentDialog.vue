<template>
  <span ref="host" class="content-dialog-host" hidden></span>
  <Teleport to="body" :disabled="placement === 'InPlace'">
    <Transition name="content-dialog" :duration="{ enter: 250, leave: 167 }" @after-leave="finishClose">
      <div
        v-if="isShowing"
        ref="layoutRoot"
        class="content-dialog-container win-theme-scope"
        :class="[themeClass, { 'content-dialog-in-place': placement === 'InPlace', 'content-dialog-full-size': FullSizeDesired, 'content-dialog-disabled': !IsEnabled }]"
        :style="containerStyle"
        data-template-part="Container">
        <div class="content-dialog-layout-root" data-template-part="LayoutRoot">
          <div class="content-dialog-smoke-layer" data-template-part="SmokeLayerBackground"></div>
          <section
            ref="backgroundElement"
            class="content-dialog"
            :style="backgroundStyle"
            v-theme-shadow="{ Translation: 128 }"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="hasTitle ? titleId : undefined"
            :aria-label="automationName || undefined"
            :aria-disabled="!IsEnabled || undefined"
            tabindex="-1"
            data-template-part="BackgroundElement"
            @keydown="onKeyDown">
            <Grid class="content-dialog-space" CornerRadius="{ThemeResource OverlayCornerRadius}">
              <Grid.RowDefinitions>
                <RowDefinition Height="*" />
                <RowDefinition Height="Auto" />
              </Grid.RowDefinitions>
              <ScrollViewer
                class="content-dialog-content-scroll-viewer"
                HorizontalScrollBarVisibility="Disabled"
                VerticalScrollBarVisibility="Disabled"
                ZoomMode="Disabled"
                IsTabStop="False"
                data-template-part="ContentScrollViewer">
                <Grid
                  class="content-dialog-content-grid"
                  Background="{ThemeResource ContentDialogTopOverlay}"
                  Padding="{ThemeResource ContentDialogPadding}"
                  BorderThickness="{ThemeResource ContentDialogSeparatorThickness}"
                  BorderBrush="{ThemeResource ContentDialogSeparatorBorderBrush}">
                  <Grid.RowDefinitions>
                    <RowDefinition Height="Auto" />
                    <RowDefinition Height="*" />
                  </Grid.RowDefinitions>
                  <div v-if="hasTitle" :id="titleId" class="content-dialog-title" data-template-part="Title">
                    <TitleOutlet />
                  </div>
                  <div ref="contentElement" class="content-dialog-body" :inert="!IsEnabled" Grid.Row="1" data-template-part="Content">
                    <ContentOutlet />
                  </div>
                </Grid>
              </ScrollViewer>
              <Grid
                v-if="hasCommandButtons"
                class="content-dialog-command-space"
                :class="buttonVisibilityClass"
                Grid.Row="1"
                HorizontalAlignment="Stretch"
                VerticalAlignment="Bottom"
                Padding="{ThemeResource ContentDialogPadding}"
                Background="{x:Bind DialogBackground}"
                data-template-part="CommandSpace">
                <Grid.ColumnDefinitions>
                  <ColumnDefinition Width="*" />
                  <ColumnDefinition Width="{x:Bind FirstSpacerWidth}" />
                  <ColumnDefinition Width="{x:Bind SecondaryColumnWidth}" />
                  <ColumnDefinition Width="{ThemeResource ContentDialogButtonSpacing}" />
                  <ColumnDefinition Width="*" />
                </Grid.ColumnDefinitions>
                <Button
                  Visibility="{x:Bind PrimaryButtonVisibility, Mode=OneWay}"
                  class="content-dialog-button content-dialog-primary"
                  Grid.Column="{x:Bind PrimaryButtonColumn}"
                  Content="{x:Bind PrimaryButtonText}"
                  Style="{x:Bind PrimaryButtonStyle}"
                  IsEnabled="{x:Bind IsPrimaryButtonEnabled}"
                  HorizontalAlignment="Stretch"
                  data-template-part="PrimaryButton"
                  Click="OnPrimaryButtonClick" />
                <Button
                  Visibility="{x:Bind SecondaryButtonVisibility, Mode=OneWay}"
                  class="content-dialog-button content-dialog-secondary"
                  Grid.Column="{x:Bind SecondaryButtonColumn}"
                  Content="{x:Bind SecondaryButtonText}"
                  Style="{x:Bind SecondaryButtonStyle}"
                  IsEnabled="{x:Bind IsSecondaryButtonEnabled}"
                  HorizontalAlignment="Stretch"
                  data-template-part="SecondaryButton"
                  Click="OnSecondaryButtonClick" />
                <Button
                  Visibility="{x:Bind CloseButtonVisibility, Mode=OneWay}"
                  class="content-dialog-button content-dialog-close"
                  Grid.Column="4"
                  Content="{x:Bind CloseButtonText}"
                  Style="{x:Bind CloseButtonStyle}"
                  IsEnabled="{x:Bind IsCloseButtonEnabled}"
                  HorizontalAlignment="Stretch"
                  data-template-part="CloseButton"
                  Click="OnCloseButtonClick" />
              </Grid>
            </Grid>
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, Fragment, h } from 'vue'

const propertyElement = (name: string) => defineComponent({
  name: `ContentDialog.${name}`,
  __contentDialogProperty: name.toLowerCase(),
  setup(_, { slots }) { return () => h(Fragment, slots.default?.()) }
})

export default {
  Title: propertyElement('Title'),
  Content: propertyElement('Content'),
  TitleTemplate: propertyElement('TitleTemplate'),
  ContentTemplate: propertyElement('ContentTemplate')
}
</script>

<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, unref, useAttrs, useSlots, type Component, type CSSProperties, type VNode } from 'vue'
import Button from './Button.vue'
import Grid from './Grid.vue'
import RowDefinition from './RowDefinition.vue'
import ColumnDefinition from './ColumnDefinition.vue'
import ScrollViewer from './ScrollViewer.vue'
import TextBlock from './TextBlock.vue'
import { xamlResourceDictionaryKey } from './Page.vue'
import { cssLength, xamlThickness } from './layout'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, xamlNameScopeKey, xamlScopeKey, xamlTemplateComponent } from './xamlRuntime'
import { acquireContentDialog, contentDialogFocusableElements, createContentDialogEventArgs, type ContentDialogPlacement, type ContentDialogResult } from './contentDialogRuntime'
import { vThemeShadow } from './themeShadowVisual'

defineOptions({ name: 'ContentDialog', inheritAttrs: false })

const props = defineProps({
  Title: { type: [String, Number, Object], default: '' },
  Content: { type: [String, Number, Object], default: '' },
  TitleTemplate: { type: [String, Object, Function], default: undefined },
  ContentTemplate: { type: [String, Object, Function], default: undefined },
  PrimaryButtonText: { type: [String, Number], default: '' },
  SecondaryButtonText: { type: [String, Number], default: '' },
  CloseButtonText: { type: [String, Number], default: '' },
  PrimaryButtonStyle: { type: [String, Object], default: '{ThemeResource DefaultButtonStyle}' },
  SecondaryButtonStyle: { type: [String, Object], default: '{ThemeResource DefaultButtonStyle}' },
  CloseButtonStyle: { type: [String, Object], default: '{ThemeResource DefaultButtonStyle}' },
  PrimaryButtonCommand: { type: [Object, Function, String], default: undefined },
  SecondaryButtonCommand: { type: [Object, Function, String], default: undefined },
  CloseButtonCommand: { type: [Object, Function, String], default: undefined },
  PrimaryButtonCommandParameter: { default: undefined },
  SecondaryButtonCommandParameter: { default: undefined },
  CloseButtonCommandParameter: { default: undefined },
  DefaultButton: { type: String, default: 'None' },
  IsEnabled: { type: [Boolean, String], default: true },
  IsPrimaryButtonEnabled: { type: [Boolean, String], default: true },
  IsSecondaryButtonEnabled: { type: [Boolean, String], default: true },
  FullSizeDesired: { type: [Boolean, String], default: false },
  RequestedTheme: { type: String, default: 'Default' },
  XamlRoot: { type: [Object, String], default: undefined },
  Style: { type: [String, Object], default: '{StaticResource DefaultContentDialogStyle}' },
  Foreground: { type: String, default: '{ThemeResource ContentDialogForeground}' },
  Background: { type: String, default: '{ThemeResource ContentDialogBackground}' },
  BorderBrush: { type: String, default: '{ThemeResource ContentDialogBorderBrush}' },
  BorderThickness: { type: [String, Number], default: '{ThemeResource ContentDialogBorderWidth}' },
  CornerRadius: { type: [String, Number], default: '{ThemeResource OverlayCornerRadius}' },
  FlowDirection: { type: String, default: 'LeftToRight' }
})

defineEmits(['PrimaryButtonClick', 'SecondaryButtonClick', 'CloseButtonClick', 'Opened', 'Closing', 'Closed', 'Loaded'])
const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
const inheritedTheme = inject('winuiTheme', null)
const pageResources = inject<Record<string, VNode> | null>(xamlResourceDictionaryKey, null)
const overrides = reactive<Record<string, unknown>>({})
const host = ref<HTMLElement | null>(null)
const layoutRoot = ref<HTMLElement | null>(null)
const backgroundElement = ref<HTMLElement | null>(null)
const contentElement = ref<HTMLElement | null>(null)
const isShowing = ref(false)
const placement = ref<ContentDialogPlacement>('Popup')
const rootBounds = ref<CSSProperties>({})
const titleId = `content-dialog-title-${instance?.uid ?? 0}`
const themeRevision = ref(0)
const resolve = (name: keyof typeof props) => resolveXamlValue(name in overrides ? overrides[name] : props[name], instance)
const property = (name: keyof typeof props) => computed({ get: () => resolve(name), set: (value) => { overrides[name] = value } })
const boolean = (name: keyof typeof props) => resolve(name) !== false && resolve(name) !== 'False'
const DialogTitle = property('Title')
const DialogContent = property('Content')
const PrimaryButtonText = property('PrimaryButtonText')
const SecondaryButtonText = property('SecondaryButtonText')
const CloseButtonText = property('CloseButtonText')
const IsEnabled = computed(() => boolean('IsEnabled'))
const IsPrimaryButtonEnabled = computed(() => IsEnabled.value && boolean('IsPrimaryButtonEnabled') && canExecute('Primary'))
const IsSecondaryButtonEnabled = computed(() => IsEnabled.value && boolean('IsSecondaryButtonEnabled') && canExecute('Secondary'))
const IsCloseButtonEnabled = computed(() => IsEnabled.value && canExecute('Close'))
const FullSizeDesired = computed(() => boolean('FullSizeDesired'))
const DefaultButton = property('DefaultButton')
const DialogBackground = property('Background')
const focusedCommand = ref<string | null>(null)
const buttonStyle = (name: 'Primary' | 'Secondary' | 'Close') => computed(() => DefaultButton.value === name && (!focusedCommand.value || focusedCommand.value === name) ? 'AccentButtonStyle' : resolve(`${name}ButtonStyle`))
const PrimaryButtonStyle = buttonStyle('Primary')
const SecondaryButtonStyle = buttonStyle('Secondary')
const CloseButtonStyle = buttonStyle('Close')
const allButtonsVisible = computed(() => Boolean(PrimaryButtonText.value && SecondaryButtonText.value && CloseButtonText.value))
const hasCommandButtons = computed(() => Boolean(PrimaryButtonText.value || SecondaryButtonText.value || CloseButtonText.value))
const PrimaryButtonVisibility = computed(() => PrimaryButtonText.value ? 'Visible' : 'Collapsed')
const SecondaryButtonVisibility = computed(() => SecondaryButtonText.value ? 'Visible' : 'Collapsed')
const CloseButtonVisibility = computed(() => CloseButtonText.value ? 'Visible' : 'Collapsed')
const FirstSpacerWidth = computed(() => allButtonsVisible.value ? '{ThemeResource ContentDialogButtonSpacing}' : 0)
const SecondaryColumnWidth = computed(() => allButtonsVisible.value ? '*' : 0)
const PrimaryButtonColumn = computed(() => !SecondaryButtonText.value && !CloseButtonText.value ? 4 : 0)
const SecondaryButtonColumn = computed(() => allButtonsVisible.value ? 2 : !CloseButtonText.value ? 4 : 0)
const buttonVisibilityClass = computed(() => allButtonsVisible.value ? 'all-visible' : 'partial-visible')
const automationName = computed(() => resolveXamlValue(attrs['AutomationProperties.Name'], instance))
const themeClass = computed(() => {
  themeRevision.value
  const requested = String(resolve('RequestedTheme') ?? 'Default').toLowerCase()
  if (requested === 'light' || requested === 'dark') return `theme-${requested}`
  const inherited = String(unref(inheritedTheme) ?? '').toLowerCase()
  if (inherited === 'light' || inherited === 'dark') return `theme-${inherited}`
  const ancestor = host.value?.closest('.theme-light, .theme-dark, [data-theme]')
  if (ancestor?.classList.contains('theme-dark') || ancestor?.getAttribute('data-theme') === 'dark') return 'theme-dark'
  if (ancestor?.classList.contains('theme-light') || ancestor?.getAttribute('data-theme') === 'light') return 'theme-light'
  if (document.documentElement.classList.contains('theme-dark') || document.documentElement.dataset.theme === 'dark') return 'theme-dark'
  if (document.documentElement.classList.contains('theme-light') || document.documentElement.dataset.theme === 'light') return 'theme-light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'theme-dark' : 'theme-light'
})
const containerStyle = computed(() => ({ ...rootBounds.value, direction: resolve('FlowDirection') === 'RightToLeft' ? 'rtl' : 'ltr' } as CSSProperties))
const backgroundStyle = computed(() => ({
  color: String(resolve('Foreground')),
  backgroundColor: String(DialogBackground.value),
  borderColor: String(resolve('BorderBrush')),
  borderWidth: xamlThickness(resolve('BorderThickness')),
  borderRadius: cssLength(resolve('CornerRadius'))
}))
// PrepareContent applies elevation to BackgroundElement in Popup and InPlace
// modes. The caster retains the same transition and its clipped inner Grid.

// Property elements remain structural and never contribute an extra layout box.
const propertyNodes = computed(() => {
  const result: Record<'title' | 'content' | 'titletemplate' | 'contenttemplate', VNode[]> = { title: [], content: [], titletemplate: [], contenttemplate: [] }
  const visit = (nodes: VNode[]) => {
    for (const node of nodes) {
      if (node.type === Fragment && Array.isArray(node.children)) {
        visit(node.children as VNode[])
        continue
      }
      const name = (node.type as { __contentDialogProperty?: keyof typeof result })?.__contentDialogProperty
      const children = node.children as { default?: () => VNode[] } | null
      if (name && typeof children?.default === 'function') result[name].push(...children.default())
      else result.content.push(node)
    }
  }
  visit(slots.default?.() ?? [])
  return result
})
const outlet = (name: 'title' | 'content') => defineComponent({
  name: `ContentDialog${name}Outlet`,
  setup() {
    return () => {
      const contentProperty = name === 'title' ? 'Title' : 'Content'
      const templateProperty = name === 'title' ? 'TitleTemplate' : 'ContentTemplate'
      if (!(contentProperty in overrides) && propertyNodes.value[name].length) return h(Fragment, normalizeXamlNodes(propertyNodes.value[name], instance))
      const value = name === 'title' ? DialogTitle.value : DialogContent.value
      const templateNodes = templateProperty in overrides ? [] : propertyNodes.value[`${name}template`]
      if (templateNodes.length) return xamlTemplateComponent(templateNodes.flatMap((node) => {
        const type = node.type as { name?: string }
        return type?.name === 'DataTemplate' ? (node.children as { default?: () => VNode[] })?.default?.() ?? [] : [node]
      }), value, instance)
      let template = resolve(templateProperty)
      if (typeof template === 'string') {
        const key = template.match(/^\{\s*(?:StaticResource|ThemeResource)\s+([^\s}]+)\s*\}$/)?.[1] ?? template.match(/^var\(--([^,)]+)\)$/)?.[1]
        if (key) template = pageResources?.[key]
      }
      if (typeof template === 'function') return template(value)
      if (isVNode(template)) {
        const type = template.type as { name?: string; __name?: string }
        const nodes = (type?.name ?? type?.__name) === 'DataTemplate'
          ? (template.children as { default?: () => VNode[] })?.default?.() ?? []
          : [template]
        return xamlTemplateComponent(nodes, value, instance)
      }
      if (template && typeof template === 'object' && ('render' in template || 'setup' in template)) return h(template as Component, { Content: value })
      if (isVNode(value)) return h(Fragment, normalizeXamlNodes([value], instance))
      if (value && typeof value === 'object' && ('render' in value || 'setup' in value)) return h(value as Component)
      const text = typeof value === 'string' || typeof value === 'number' ? value : ''
      return h(TextBlock, name === 'title'
        ? { Text: text, FontSize: 20, FontWeight: 'SemiBold', TextWrapping: 'Wrap', MaxLines: 2 }
        : { Text: text, TextWrapping: 'Wrap' })
    }
  }
})
const TitleOutlet = outlet('title')
const ContentOutlet = outlet('content')
const hasTitle = computed(() => Boolean(
  (!('Title' in overrides) && propertyNodes.value.title.length) || DialogTitle.value
  || (!('TitleTemplate' in overrides) && propertyNodes.value.titletemplate.length) || resolve('TitleTemplate')
))
provide(xamlNameScopeKey, reactive({}))

let operation: { resolve: (result: ContentDialogResult) => void; reject: (error: unknown) => void } | null = null
let releaseDialog: (() => void) | null = null
let closingResult: ContentDialogResult = 'None'
let opened = false
let hideInProgress = false
let buttonClickInProgress = false
let previousFocus: HTMLElement | null = null
let lastFocus: HTMLElement | null = null
let activeRoot: object | null = null
let rootElement: HTMLElement | null = null
let rootObserver: ResizeObserver | null = null
let backgroundObserver: MutationObserver | null = null
let themeObserver: MutationObserver | null = null
let themeMedia: MediaQueryList | null = null
const updateTheme = () => { themeRevision.value += 1 }
const backgroundInert = new Map<HTMLElement, boolean>()
const deferralEvents = new Set<ReturnType<typeof createContentDialogEventArgs>>()

const apiProperties = Object.fromEntries(Object.keys(props).map((name) => [name, property(name as keyof typeof props)]))
const sender = { ShowAsync, Hide }
for (const [name, value] of Object.entries(apiProperties)) {
  Object.defineProperty(sender, name, {
    enumerable: true,
    get: () => name === 'XamlRoot' ? value.value ?? host.value?.ownerDocument : value.value,
    set: (next) => { value.value = next }
  })
}

function dispatch(name: 'PrimaryButtonClick' | 'SecondaryButtonClick' | 'CloseButtonClick' | 'Opened' | 'Closing' | 'Closed' | 'Loaded', args: unknown) {
  const listener = instance?.vnode.props?.[`on${name}`]
  for (const callback of Array.isArray(listener) ? listener : [listener]) {
    if (typeof callback === 'function') callback(sender, args)
  }
  resolveXamlHandler(attrs[name], instance)?.(sender, args)
}

function canExecute(name: 'Primary' | 'Secondary' | 'Close') {
  const command = resolve(`${name}ButtonCommand`) as { CanExecute?: (parameter: unknown) => boolean } | undefined
  return !command?.CanExecute || command.CanExecute(resolve(`${name}ButtonCommandParameter`)) !== false
}

function focusInitial() {
  const contentTarget = contentDialogFocusableElements(contentElement.value)[0]
  const defaultTarget = DefaultButton.value !== 'None' ? backgroundElement.value?.querySelector<HTMLElement>(`[data-template-part="${DefaultButton.value}Button"]:not([disabled])`) : null
  const target = contentTarget ?? defaultTarget ?? contentDialogFocusableElements(backgroundElement.value)[0] ?? backgroundElement.value
  target?.focus({ preventScroll: true })
  lastFocus = target ?? null
}

function onFocusIn(event: FocusEvent) {
  if (!isShowing.value) return
  const target = event.target as HTMLElement | null
  if (backgroundElement.value?.contains(target)) {
    lastFocus = target
    focusedCommand.value = target?.closest('[data-template-part="CommandSpace"]') ? target.closest('[data-template-part$="Button"]')?.getAttribute('data-template-part')?.replace('Button', '') ?? null : null
  }
  else if (placement.value === 'InPlace' ? host.value?.parentElement?.contains(target) : !rootElement || rootElement.contains(target)) {
    if (lastFocus?.isConnected) lastFocus.focus({ preventScroll: true })
    else focusInitial()
  }
}

function onKeyDown(event: KeyboardEvent) {
  if (event.defaultPrevented || event.isComposing) return
  if (event.key === 'Tab') {
    const elements = contentDialogFocusableElements(backgroundElement.value)
    const current = elements.indexOf(document.activeElement as HTMLElement)
    if (!elements.length || (event.shiftKey && current <= 0) || (!event.shiftKey && current === elements.length - 1)) {
      event.preventDefault()
      const target = event.shiftKey ? elements.at(-1) : elements[0]
      target?.focus({ preventScroll: true })
    }
  } else if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    if (CloseButtonText.value && IsEnabled.value && canExecute('Close')) void clickButton('Close')
    else Hide()
  } else if (event.key === 'Enter' && !event.repeat) {
    const target = event.target as HTMLElement
    if (target.closest('button, textarea, [contenteditable="true"]')) return
    const name = DefaultButton.value
    if ((name === 'Primary' && PrimaryButtonText.value && IsPrimaryButtonEnabled.value) || (name === 'Secondary' && SecondaryButtonText.value && IsSecondaryButtonEnabled.value) || (name === 'Close' && CloseButtonText.value && IsEnabled.value && canExecute('Close'))) {
      event.preventDefault()
      event.stopPropagation()
      void clickButton(name)
    }
  }
}

function updateRootBounds() {
  if (!rootElement || placement.value === 'InPlace') { rootBounds.value = {}; return }
  const rect = rootElement.getBoundingClientRect()
  rootBounds.value = { inset: 'auto', left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` }
}

function isolateBackground() {
  if (placement.value === 'InPlace') return
  const children = rootElement ? rootElement.children : document.body.children
  for (const child of Array.from(children)) {
    if (!(child instanceof HTMLElement) || child === layoutRoot.value || child.contains(layoutRoot.value)) continue
    if (!backgroundInert.has(child)) backgroundInert.set(child, child.inert)
    child.inert = true
  }
}

function releaseInteraction() {
  document.removeEventListener('focusin', onFocusIn, true)
  window.removeEventListener('resize', updateRootBounds)
  window.removeEventListener('scroll', updateRootBounds, true)
  rootObserver?.disconnect()
  rootObserver = null
  backgroundObserver?.disconnect()
  backgroundObserver = null
  for (const [element, inert] of backgroundInert) element.inert = inert
  backgroundInert.clear()
  if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
  if (!previousFocus || document.activeElement !== previousFocus) {
    const active = document.activeElement as HTMLElement | null
    const otherDialog = active?.closest('.content-dialog-container')
    if (!otherDialog || otherDialog === layoutRoot.value) {
      const root = rootElement ?? (placement.value === 'InPlace' ? host.value?.parentElement : null) ?? document.body
      const fallback = contentDialogFocusableElements(root).find((element) => !element.closest('.content-dialog-container'))
      ;(fallback ?? (root.hasAttribute('tabindex') ? root : null))?.focus({ preventScroll: true })
    }
  }
  previousFocus = null
  lastFocus = null
}

function ShowAsync(value: ContentDialogPlacement = 'Popup'): Promise<ContentDialogResult> {
  if (!['Popup', 'InPlace', 'UnconstrainedPopup'].includes(value)) return Promise.reject(new Error('Invalid ContentDialogPlacement.'))
  if (operation) return Promise.reject(new Error('This ContentDialog already has a pending ShowAsync operation.'))
  if (!host.value?.isConnected) return Promise.reject(new Error('ContentDialog must be associated with a XamlRoot before ShowAsync.'))
  const requestedRoot = resolve('XamlRoot') as { Content?: unknown; $el?: unknown } | HTMLElement | undefined
  const resolvedElement = requestedRoot instanceof HTMLElement ? requestedRoot : requestedRoot?.$el ?? requestedRoot?.Content
  rootElement = resolvedElement instanceof HTMLElement ? resolvedElement : null
  activeRoot = requestedRoot && typeof requestedRoot === 'object' ? requestedRoot : host.value.ownerDocument
  try {
    releaseDialog = acquireContentDialog(activeRoot, sender, value === 'InPlace' ? host.value.parentElement : null, host.value)
  } catch (error) { return Promise.reject(error) }
  placement.value = value
  opened = false
  hideInProgress = false
  buttonClickInProgress = false
  focusedCommand.value = null
  closingResult = 'None'
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  const result = new Promise<ContentDialogResult>((resolve, reject) => { operation = { resolve, reject } })
  const pending = operation
  updateRootBounds()
  isShowing.value = true
  updateTheme()
  void nextTick().then(() => {
    if (operation !== pending || !isShowing.value || hideInProgress) return
    isolateBackground()
    backgroundObserver = new MutationObserver(isolateBackground)
    backgroundObserver.observe(rootElement ?? document.body, { childList: true })
    document.addEventListener('focusin', onFocusIn, true)
    window.addEventListener('resize', updateRootBounds)
    window.addEventListener('scroll', updateRootBounds, true)
    if (rootElement) { rootObserver = new ResizeObserver(updateRootBounds); rootObserver.observe(rootElement) }
    focusInitial()
    opened = true
    dispatch('Opened', {})
  }).catch((error) => { if (operation === pending) failOperation(error) })
  return result
}

async function clickButton(name: 'Primary' | 'Secondary' | 'Close') {
  if (!operation || hideInProgress || buttonClickInProgress || !IsEnabled.value || !canExecute(name)) return
  if (name === 'Primary' && !IsPrimaryButtonEnabled.value || name === 'Secondary' && !IsSecondaryButtonEnabled.value) return
  const pending = operation
  buttonClickInProgress = true
  const event = createContentDialogEventArgs()
  deferralEvents.add(event)
  try {
    dispatch(`${name}ButtonClick`, event.args)
    event.finishDispatch()
    await event.completed
    if (operation !== pending || event.args.Cancel || hideInProgress) return
    const command = resolve(`${name}ButtonCommand`) as { Execute?: (parameter: unknown) => void } | ((parameter: unknown) => void) | undefined
    const parameter = resolve(`${name}ButtonCommandParameter`)
    if (typeof command === 'function') command(parameter)
    else command?.Execute?.(parameter)
    await close(name === 'Close' ? 'None' : name)
  } catch (error) { if (operation === pending) failOperation(error) }
  finally { deferralEvents.delete(event); if (operation === pending) buttonClickInProgress = false }
}

async function close(result: ContentDialogResult) {
  if (!operation || hideInProgress) return
  const pending = operation
  hideInProgress = true
  const event = createContentDialogEventArgs(result)
  deferralEvents.add(event)
  try {
    if (opened) dispatch('Closing', event.args)
    event.finishDispatch()
    await event.completed
    if (operation !== pending) return
    if (event.args.Cancel) { hideInProgress = false; return }
    closingResult = result
    releaseDialog?.()
    releaseDialog = null
    releaseInteraction()
    const wasRendered = Boolean(backgroundElement.value)
    isShowing.value = false
    if (!wasRendered) finishClose()
  } catch (error) { if (operation === pending) failOperation(error) }
  finally { deferralEvents.delete(event) }
}

function Hide() { void close('None') }

function finishClose() {
  if (!operation) return
  const pending = operation
  const result = closingResult
  operation = null
  for (const event of deferralEvents) event.disconnect()
  deferralEvents.clear()
  hideInProgress = false
  buttonClickInProgress = false
  opened = false
  try { dispatch('Closed', { Result: result }) }
  finally { pending.resolve(result) }
}

function failOperation(error: unknown) {
  const pending = operation
  operation = null
  for (const event of deferralEvents) event.disconnect()
  deferralEvents.clear()
  isShowing.value = false
  releaseInteraction()
  releaseDialog?.()
  releaseDialog = null
  hideInProgress = false
  buttonClickInProgress = false
  pending?.reject(error)
}

const OnPrimaryButtonClick = () => { void clickButton('Primary') }
const OnSecondaryButtonClick = () => { void clickButton('Secondary') }
const OnCloseButtonClick = () => { void clickButton('Close') }
provide(xamlScopeKey, {
  DialogTitle, DialogContent, DialogBackground,
  PrimaryButtonText, SecondaryButtonText, CloseButtonText,
  PrimaryButtonVisibility, SecondaryButtonVisibility, CloseButtonVisibility,
  PrimaryButtonStyle, SecondaryButtonStyle, CloseButtonStyle,
  IsPrimaryButtonEnabled, IsSecondaryButtonEnabled, IsCloseButtonEnabled, IsEnabled,
  FirstSpacerWidth, SecondaryColumnWidth, PrimaryButtonColumn, SecondaryButtonColumn,
  OnPrimaryButtonClick, OnSecondaryButtonClick, OnCloseButtonClick
})
onMounted(() => {
  themeObserver = new MutationObserver(updateTheme)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] })
  themeMedia = window.matchMedia('(prefers-color-scheme: dark)')
  themeMedia.addEventListener('change', updateTheme)
  dispatch('Loaded', { OriginalSource: sender })
})
onBeforeUnmount(() => {
  themeObserver?.disconnect()
  themeMedia?.removeEventListener('change', updateTheme)
  for (const event of deferralEvents) event.disconnect()
  deferralEvents.clear()
  if (operation) {
    releaseInteraction()
    releaseDialog?.()
    releaseDialog = null
    operation.resolve('None')
    operation = null
  }
})

defineExpose({
  ShowAsync, Hide,
  ...apiProperties
})
</script>

<style>
.content-dialog-container {
  position: fixed;
  inset: 0;
  z-index: 10000;
  box-sizing: border-box;
}

.content-dialog-layout-root {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 24px;
}

.content-dialog-smoke-layer {
  position: absolute;
  inset: 0;
  background: var(--ContentDialogSmokeFill, var(--SmokeFillColorDefaultBrush));
}

.content-dialog {
  position: relative;
  box-sizing: border-box;
  width: max-content;
  min-width: min(100%, var(--ContentDialogMinWidth, 320px));
  max-width: min(100%, var(--ContentDialogMaxWidth, 548px));
  min-height: min(100%, var(--ContentDialogMinHeight, 184px));
  max-height: min(100%, var(--ContentDialogMaxHeight, 756px));
  display: flex;
  border-style: solid;
  overflow: visible;
  outline: none;
  transform-origin: center;
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
}

.content-dialog-space.win-grid {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  grid-template-columns: minmax(0, 1fr) !important;
  grid-template-rows: minmax(0, 1fr) auto !important;
}

.content-dialog-content-scroll-viewer { min-width: 0; min-height: 0; }
.content-dialog-content-scroll-viewer > .win-scroll-viewer-viewport,
.content-dialog-content-scroll-viewer .scroll-content { min-width: 0; height: 100%; }

.content-dialog-content-grid.win-grid {
  min-width: 0;
  min-height: 100%;
  box-sizing: border-box;
  grid-template-columns: minmax(0, 1fr) !important;
  grid-template-rows: auto minmax(0, 1fr) !important;
}

.content-dialog-title {
  min-width: 0;
  margin: var(--ContentDialogTitleMargin, 0 0 12px);
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow-wrap: anywhere;
}

.content-dialog-title .win-text-block { color: inherit; line-height: inherit; }
.content-dialog-body {
  min-width: 0;
  min-height: 0;
  font-size: var(--ControlContentThemeFontSize, 14px);
  line-height: 20px;
  overflow-wrap: anywhere;
}
.content-dialog-body > .win-text-block { color: inherit; }
.content-dialog-body img { max-width: 100%; }
.content-dialog-body > * { max-width: 100%; box-sizing: border-box; }

.content-dialog-command-space.win-grid {
  min-width: 0;
  box-sizing: border-box;
  grid-template-columns: minmax(0, 1fr) 0 0 var(--ContentDialogButtonSpacing, 8px) minmax(0, 1fr) !important;
  grid-template-rows: auto !important;
}
.content-dialog-command-space.win-grid.all-visible {
  grid-template-columns: minmax(0, 1fr) var(--ContentDialogButtonSpacing, 8px) minmax(0, 1fr) var(--ContentDialogButtonSpacing, 8px) minmax(0, 1fr) !important;
}
.content-dialog-button { width: 100%; min-width: 0; min-height: 32px; height: auto; overflow: hidden; text-overflow: ellipsis; }
.content-dialog-full-size .content-dialog { height: min(100%, var(--ContentDialogMaxHeight, 756px)); }
.content-dialog-disabled .content-dialog-body { pointer-events: none; }
.content-dialog-in-place { position: relative; inset: auto; width: 100%; min-height: var(--ContentDialogMinHeight, 184px); }
.content-dialog-in-place .content-dialog-layout-root { padding: 0; }
.content-dialog-in-place .content-dialog-smoke-layer { display: none; }

.content-dialog-enter-active .content-dialog-layout-root { animation: content-dialog-show-opacity var(--ControlFasterAnimationDuration, 83ms) linear both; }
.content-dialog-leave-active { pointer-events: none; }
.content-dialog-leave-active .content-dialog-layout-root { animation: content-dialog-hide-opacity var(--ControlFasterAnimationDuration, 83ms) linear both; }
.content-dialog-enter-active .content-dialog { animation: content-dialog-show-scale var(--ControlNormalAnimationDuration, 250ms) var(--ControlFastOutSlowInKeySpline, cubic-bezier(0, 0, 0, 1)) both; }
.content-dialog-leave-active .content-dialog { animation: content-dialog-hide-scale var(--ControlFastAnimationDuration, 167ms) var(--ControlFastOutSlowInKeySpline, cubic-bezier(0, 0, 0, 1)) both; }
@keyframes content-dialog-show-opacity { from { opacity: 0; } to { opacity: 1; } }
@keyframes content-dialog-hide-opacity { from { opacity: 1; } to { opacity: 0; } }
@keyframes content-dialog-show-scale { from { transform: scale(1.05); } to { transform: scale(1); } }
@keyframes content-dialog-hide-scale { from { transform: scale(1); } to { transform: scale(1.05); } }
</style>
