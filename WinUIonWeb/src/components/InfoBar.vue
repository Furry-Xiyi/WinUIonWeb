<template>
  <section ref="rootRef" class="win-infobar win-theme-scope" v-bind="rootAttrs" :class="[severityClass, themeClass, attrs.class]" :style="rootStyle" role="status" :aria-label="LandmarkLabel" :aria-live="Severity === 'Error' || Severity === 'Warning' ? 'assertive' : 'polite'" :aria-hidden="!IsOpen || undefined">
    <Border class="win-infobar-content-root" Visibility="{x:Bind RootVisibility}" VerticalAlignment="Top" Background="{x:Bind SeverityBackground}" BorderBrush="{x:Bind InfoBarBorderBrush}" BorderThickness="{x:Bind InfoBarBorderThickness}" CornerRadius="{x:Bind InfoBarCornerRadius}">
      <Grid class="win-infobar-layout" HorizontalAlignment="Stretch" MinHeight="{ThemeResource InfoBarMinHeight}" Background="{x:Bind InfoBarBackground}" CornerRadius="{x:Bind InfoBarCornerRadius}" Padding="{StaticResource InfoBarContentRootPadding}">
        <Grid.ColumnDefinitions>
          <ColumnDefinition Width="Auto" />
          <ColumnDefinition Width="*" />
          <ColumnDefinition Width="Auto" />
        </Grid.ColumnDefinitions>
        <Grid.RowDefinitions>
          <RowDefinition Height="Auto" />
          <RowDefinition Height="Auto" />
        </Grid.RowDefinitions>
        <Grid class="win-infobar-standard-icon-area" Visibility="{x:Bind StandardIconVisibility}">
          <TextBlock class="win-infobar-icon-background" Grid.Column="0" VerticalAlignment="Top" Margin="{StaticResource InfoBarIconMargin}" FontSize="{StaticResource InfoBarIconFontSize}" Text="{StaticResource InfoBarIconBackgroundGlyph}" Foreground="{x:Bind SeverityIconBackground}" FontFamily="{ThemeResource SymbolThemeFontFamily}" aria-hidden="true" />
          <TextBlock class="win-infobar-standard-icon" Grid.Column="0" VerticalAlignment="Top" Margin="{StaticResource InfoBarIconMargin}" FontSize="{StaticResource InfoBarIconFontSize}" Text="{x:Bind SeverityIconGlyph}" Foreground="{x:Bind SeverityIconForeground}" FontFamily="{ThemeResource SymbolThemeFontFamily}" AutomationProperties.Name="{x:Bind SeverityLabel}" />
        </Grid>
        <Viewbox class="win-infobar-user-icon-box" Grid.Column="0" Visibility="{x:Bind UserIconVisibility}" VerticalAlignment="Top" MaxWidth="{ThemeResource InfoBarIconFontSize}" MaxHeight="{ThemeResource InfoBarIconFontSize}" Margin="{ThemeResource InfoBarIconMargin}">
          <IconOutlet />
        </Viewbox>
        <InfoBarPanel Grid.Column="1" Margin="{StaticResource InfoBarPanelMargin}" HorizontalOrientationPadding="{StaticResource InfoBarPanelHorizontalOrientationPadding}" VerticalOrientationPadding="{StaticResource InfoBarPanelVerticalOrientationPadding}">
          <TextBlock class="win-infobar-title" Visibility="{x:Bind TitleVisibility}" Text="{x:Bind InfoBarTitle}" Foreground="{x:Bind TitleForeground}" InfoBarPanel.HorizontalOrientationMargin="{StaticResource InfoBarTitleHorizontalOrientationMargin}" InfoBarPanel.VerticalOrientationMargin="{StaticResource InfoBarTitleVerticalOrientationMargin}" TextWrapping="WrapWholeWords" FontWeight="{StaticResource InfoBarTitleFontWeight}" FontSize="{StaticResource InfoBarTitleFontSize}" />
          <TextBlock class="win-infobar-message" Visibility="{x:Bind MessageVisibility}" Text="{x:Bind InfoBarMessage}" Foreground="{x:Bind MessageForeground}" InfoBarPanel.HorizontalOrientationMargin="{StaticResource InfoBarMessageHorizontalOrientationMargin}" InfoBarPanel.VerticalOrientationMargin="{StaticResource InfoBarMessageVerticalOrientationMargin}" TextWrapping="WrapWholeWords" FontWeight="{StaticResource InfoBarMessageFontWeight}" FontSize="{StaticResource InfoBarMessageFontSize}" />
          <ContentPresenter class="win-infobar-action" Visibility="{x:Bind ActionVisibility}" InfoBarPanel.HorizontalOrientationMargin="{StaticResource InfoBarActionHorizontalOrientationMargin}" InfoBarPanel.VerticalOrientationMargin="{StaticResource InfoBarActionVerticalOrientationMargin}" VerticalAlignment="Top">
            <ActionOutlet />
          </ContentPresenter>
        </InfoBarPanel>
        <ContentPresenter class="win-infobar-content-area" Grid.Column="1" Grid.Row="{x:Bind ContentRow}" VerticalAlignment="Center">
          <ContentOutlet />
        </ContentPresenter>
        <Button class="win-infobar-close-button" :class="{ 'uses-default-close-button-style': usesDefaultCloseStyle }" Grid.Column="2" Visibility="{x:Bind CloseVisibility}" IsEnabled="{x:Bind CloseButtonEnabled}" Style="{x:Bind InfoBarCloseStyle}" Width="{x:Bind CloseButtonWidth}" Height="{x:Bind CloseButtonHeight}" MinWidth="{x:Bind CloseButtonMinWidth}" MinHeight="{x:Bind CloseButtonMinHeight}" MaxWidth="{x:Bind CloseButtonMaxWidth}" MaxHeight="{x:Bind CloseButtonMaxHeight}" Margin="{x:Bind CloseButtonMargin}" Padding="{x:Bind CloseButtonPadding}" HorizontalAlignment="{x:Bind CloseButtonHorizontalAlignment}" VerticalAlignment="{x:Bind CloseButtonVerticalAlignment}" HorizontalContentAlignment="{x:Bind CloseButtonHorizontalContentAlignment}" VerticalContentAlignment="{x:Bind CloseButtonVerticalContentAlignment}" Background="{x:Bind CloseButtonBackground}" Foreground="{x:Bind CloseButtonForeground}" BorderBrush="{x:Bind CloseButtonBorderBrush}" BorderThickness="{x:Bind CloseButtonBorderThickness}" CornerRadius="{x:Bind CloseButtonCornerRadius}" FontFamily="{x:Bind CloseButtonFontFamily}" FontWeight="{x:Bind CloseButtonFontWeight}" FontSize="{x:Bind CloseButtonFontSize}" AutomationProperties.Name="{x:Bind CloseLabel}" ToolTipService.ToolTip="{x:Bind CloseTooltip}" Click="OnCloseButtonClick">
          <Viewbox Width="{StaticResource InfoBarCloseButtonGlyphSize}" Height="{StaticResource InfoBarCloseButtonGlyphSize}" HorizontalAlignment="Center" VerticalAlignment="Center">
            <SymbolIcon Symbol="{StaticResource InfoBarCloseButtonSymbol}" />
          </Viewbox>
        </Button>
      </Grid>
    </Border>
  </section>
</template>

<script lang="ts">
import { InfoBarActionButton, InfoBarContent, InfoBarContentTemplate, InfoBarIconSource } from './InfoBarProperties'
export default { ActionButton: InfoBarActionButton, Content: InfoBarContent, ContentTemplate: InfoBarContentTemplate, IconSource: InfoBarIconSource }
</script>

<script setup lang="ts">
import { cloneVNode, Comment, computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, provide, proxyRefs, ref, shallowRef, Text, useAttrs, useSlots, watch, type VNode } from 'vue'
import Border from './Border.vue'
import ButtonControl from './Button.vue'
import ColumnDefinition from './ColumnDefinition.vue'
import ContentPresenter from './ContentPresenter.vue'
import FontIcon from './FontIcon.vue'
import Grid from './Grid.vue'
import Image from './Image.vue'
import InfoBarPanel from './InfoBarPanel.vue'
import { xamlResourceDictionaryKey } from './Page.vue'
import RowDefinition from './RowDefinition.vue'
import SymbolIcon from './SymbolIcon.vue'
import TextBlock from './TextBlock.vue'
import Viewbox from './Viewbox.vue'
import { useI18n } from './i18n/index'
import { alignment, boolValue, cssLength, xamlThickness } from './layout'
import { getInfoBarProperty, type InfoBarPropertyName } from './InfoBarProperties'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey, xamlTemplateComponent } from './xamlRuntime'

defineOptions({ name: 'InfoBar', inheritAttrs: false })
const props = defineProps({
  IsOpen: { type: [Boolean, String], default: false }, Title: { type: String, default: '' }, Message: { type: String, default: '' },
  Severity: { type: [String, Number], default: 'Informational' }, IconSource: { type: null, default: null },
  IsIconVisible: { type: [Boolean, String], default: true }, IsClosable: { type: [Boolean, String], default: true },
  CloseButtonStyle: { type: [String, Object], default: '{StaticResource InfoBarCloseButtonStyle}' },
  CloseButtonCommand: { type: null, default: null }, CloseButtonCommandParameter: { type: null, default: null },
  ActionButton: { type: null, default: null }, Content: { type: null, default: null }, ContentTemplate: { type: null, default: null },
  Background: { type: String, default: 'Transparent' }, Foreground: { type: String, default: '' },
  BorderBrush: { type: String, default: '{ThemeResource InfoBarBorderBrush}' }, BorderThickness: { type: [String, Number], default: '{ThemeResource InfoBarBorderThickness}' }, CornerRadius: { type: [String, Number], default: '{ThemeResource ControlCornerRadius}' },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' }, MinWidth: { type: [String, Number], default: 0 }, MinHeight: { type: [String, Number], default: 0 }, MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' }, Margin: { type: [String, Number], default: 0 },
  HorizontalAlignment: { type: String, default: 'Stretch' }, VerticalAlignment: { type: String, default: 'Top' }, Visibility: { type: String, default: 'Visible' }, RequestedTheme: { type: String, default: 'Default' }, IsEnabled: { type: [Boolean, String], default: true }
})
const emit = defineEmits(['update:IsOpen', 'CloseButtonClick', 'Closing', 'Closed', 'Opened'])
const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
const resources = inject<Record<string, VNode> | null>(xamlResourceDictionaryKey, null)
const { t } = useI18n()
const rootRef = ref<HTMLElement | null>(null)
const resolve = (value: unknown) => resolveXamlValue(value, instance)
// This template adapter materializes the official property bindings for the
// shared Button renderer. It adds no DOM or visual-tree layer. Button's
// dependency-property layout values are otherwise read as literal props.
const Button = defineComponent({
  name: 'InfoBarTemplateButton', inheritAttrs: false,
  setup(_, { attrs: buttonAttributes, slots: buttonSlots }) {
    const owner = getCurrentInstance()
    return () => h(ButtonControl, Object.fromEntries(Object.entries(buttonAttributes).map(([property, value]) => [property, resolveXamlValue(value, owner)])), buttonSlots)
  }
})
const overrides = new Map<string, ReturnType<typeof shallowRef>>()
const dependency = (key: keyof typeof props, convert: (value: unknown) => unknown = value => value) => {
  const local = shallowRef<unknown>(undefined)
  overrides.set(key, local)
  const source = computed(() => convert(resolve(props[key])))
  // Resolve resource-backed properties first during template rendering. A
  // setup-time watch would evaluate inherited Grid resource slots too early.
  onMounted(() => { watch(source, () => { local.value = undefined }) })
  return computed({ get: () => local.value === undefined ? source.value : local.value, set: (value: unknown) => { local.value = convert(value); updateXamlBinding(props[key], local.value, instance) } })
}
const Title = dependency('Title', value => String(value ?? ''))
const Message = dependency('Message', value => String(value ?? ''))
const Severity = dependency('Severity', value => typeof value === 'number' ? ['Informational', 'Success', 'Warning', 'Error'][value] ?? 'Informational' : ['Informational', 'Success', 'Warning', 'Error'].includes(String(value)) ? String(value) : 'Informational')
const IsIconVisible = dependency('IsIconVisible', boolValue)
const IsClosable = dependency('IsClosable', boolValue)
const IsEnabled = dependency('IsEnabled', boolValue)
const RequestedTheme = dependency('RequestedTheme', value => String(value ?? 'Default'))
const ActionButton = dependency('ActionButton')
const IconSource = dependency('IconSource')
const Content = dependency('Content')
const ContentTemplate = dependency('ContentTemplate')
const Background = dependency('Background')
const Foreground = dependency('Foreground')
const BorderBrush = dependency('BorderBrush')
const BorderThickness = dependency('BorderThickness')
const CornerRadius = dependency('CornerRadius')
const CloseButtonStyle = dependency('CloseButtonStyle')
const CloseButtonCommand = dependency('CloseButtonCommand')
const CloseButtonCommandParameter = dependency('CloseButtonCommandParameter')
const sourceOpen = computed(() => boolValue(resolve(props.IsOpen)))
const localOpen = ref(sourceOpen.value)
const IsOpen = computed({ get: () => localOpen.value, set: (value: unknown) => setOpen(boolValue(value), 'Programmatic') })
const TemplateSettings = computed(() => ({ IconElement: effectiveIcon.value }))
const publicApi = proxyRefs({ IsOpen, Title, Message, Severity, IsIconVisible, IsClosable, IsEnabled, RequestedTheme, ActionButton, IconSource, Content, ContentTemplate, TemplateSettings, Background, Foreground, BorderBrush, BorderThickness, CornerRadius, CloseButtonStyle, CloseButtonCommand, CloseButtonCommandParameter, Element: rootRef })
defineExpose(publicApi)
const onceEvents = new Set<string>()
const dispatch = (name: 'CloseButtonClick' | 'Closing' | 'Closed' | 'Opened', args: unknown) => {
  // Vue treats PascalCase event names as component emits during patching and
  // warns for an undeclared listener. XAML events are routed through the
  // vnode's canonical `on${Name}` prop so the sender/args contract stays
  // intact without a duplicate emit.
  const listener = instance?.vnode.props?.[`on${name}`] as ((sender: unknown, args: unknown) => void) | Array<(sender: unknown, args: unknown) => void> | undefined
  if (Array.isArray(listener)) listener.forEach(handler => handler(publicApi, args))
  else if (listener) listener(publicApi, args)
  else resolveXamlHandler(attrs[name], instance)?.(publicApi, args)
  const once = instance?.vnode.props?.[`on${name}Once`] as ((sender: unknown, args: unknown) => void) | Array<(sender: unknown, args: unknown) => void> | undefined
  if (once && !onceEvents.has(name)) {
    onceEvents.add(name)
    if (Array.isArray(once)) once.forEach(handler => handler(publicApi, args))
    else once(publicApi, args)
  }
}
function setOpen(value: boolean, reason: 'Programmatic' | 'CloseButton') {
  if (localOpen.value === value) return
  localOpen.value = value
  if (!value) {
    const args = { Reason: reason, Cancel: false }
    dispatch('Closing', args)
    if (args.Cancel) { setOpen(true, 'Programmatic'); return }
  }
  updateXamlBinding(props.IsOpen, localOpen.value, instance)
  emit('update:IsOpen', localOpen.value)
  // Closed/Opened handlers may change IsOpen again, as in WinUI. There is no
  // dispatch-wide lock that would silently discard those dependency writes.
  dispatch(value ? 'Opened' : 'Closed', value ? {} : { Reason: reason })
}
watch(sourceOpen, value => setOpen(value, 'Programmatic'))
function OnCloseButtonClick() {
  if (!IsOpen.value || !CloseButtonEnabled.value) return
  // ButtonBase raises Click before ExecuteCommand. InfoBar's Click handler
  // closes it synchronously, so the command observes the final IsOpen state.
  dispatch('CloseButtonClick', null)
  setOpen(false, 'CloseButton')
  const command = CloseButtonCommand.value as { CanExecute?: (parameter: unknown) => boolean, Execute?: (parameter: unknown) => void } | ((parameter: unknown) => void) | null
  const parameter = CloseButtonCommandParameter.value
  if (typeof command === 'function') command(parameter)
  else if (command && (!command.CanExecute || command.CanExecute(parameter))) command.Execute?.(parameter)
}
const nodeChildren = (node: VNode): VNode[] => Array.isArray(node.children) ? node.children as VNode[] : (node.children as { default?: () => VNode[] } | null)?.default?.() ?? []
const visualNodes = (nodes: VNode[]): VNode[] => nodes.flatMap(node => node.type === Fragment ? visualNodes(nodeChildren(node)) : node.type === Comment || (node.type === Text && !String(node.children ?? '').trim()) ? [] : [node])
const propertyNodes = computed(() => {
  const result: Record<InfoBarPropertyName, VNode[]> = { ActionButton: [], Content: [], ContentTemplate: [], IconSource: [] }
  for (const node of visualNodes(slots.default?.() ?? [])) { const property = getInfoBarProperty(node); if (property) result[property].push(...visualNodes(nodeChildren(node))); else result.Content.push(node) }
  return result
})
const hasAction = computed(() => ActionButton.value !== null && ActionButton.value !== undefined || overrides.get('ActionButton')?.value === undefined && propertyNodes.value.ActionButton.length > 0)
const sourceFromNode = (node: VNode | undefined) => node ? Object.fromEntries(Object.entries(node.props ?? {}).map(([key, value]) => [key, resolve(value)])) : null
const resourceNode = (value: unknown) => {
  if (isVNode(value)) return value
  const key = typeof value === 'string' ? value.match(/^\{(?:StaticResource|ThemeResource)\s+([^}]+)\}$/)?.[1] ?? value.match(/^var\(--([^,)]+)\)$/)?.[1] : undefined
  return key ? resources?.[key] : undefined
}
const effectiveIcon = computed(() => {
  const source = overrides.get('IconSource')?.value !== undefined ? IconSource.value : IconSource.value ?? sourceFromNode(propertyNodes.value.IconSource[0])
  const node = resourceNode(source)
  return node ? sourceFromNode(node) : source
})
const iconKind = computed(() => (propertyNodes.value.IconSource[0]?.type as { __iconSourceKind?: string })?.__iconSourceKind)
const IconOutlet = defineComponent({ name: 'InfoBarIconPresenter', setup() { return () => {
  const source = effectiveIcon.value as Record<string, unknown> | VNode | null
  if (!source) return null
  if (isVNode(source)) return source
  if (source.Glyph !== undefined || iconKind.value === 'FontIcon') return h(FontIcon, { ...source, FontFamily: source.FontFamily || 'var(--SymbolThemeFontFamily)', FontSize: source.FontSize ?? 20 })
  if (source.Symbol !== undefined || iconKind.value === 'SymbolIcon') return h(SymbolIcon, source)
  if (source.Data !== undefined || iconKind.value === 'PathIcon') return h('svg', { viewBox: '0 0 20 20', width: 20, height: 20, 'aria-hidden': 'true', style: { fill: source.Foreground || 'currentColor' } }, [h('path', { d: source.Data })])
  if (source.UriSource || source.ImageSource) return h(Image, { Source: source.UriSource ?? source.ImageSource, Stretch: 'Uniform' })
  if (propertyNodes.value.IconSource.length) return normalizeXamlNodes(propertyNodes.value.IconSource, instance)[0]
  return null
} } })
const ActionOutlet = defineComponent({ name: 'InfoBarActionPresenter', setup() { return () => {
  if (ActionButton.value === null && overrides.get('ActionButton')?.value !== undefined) return null
  if (isVNode(ActionButton.value)) return IsEnabled.value ? ActionButton.value : cloneVNode(ActionButton.value, { IsEnabled: false })
  const children = normalizeXamlNodes(propertyNodes.value.ActionButton, instance)
  return h(Fragment, IsEnabled.value ? children : children.map(child => cloneVNode(child, { IsEnabled: false })))
} } })
const ContentOutlet = defineComponent({ name: 'InfoBarContentPresenter', setup() { return () => {
  const content = Content.value
  if (content === null && overrides.get('Content')?.value !== undefined) return null
  const resource = resourceNode(ContentTemplate.value)
  const templateNodes = resource ? nodeChildren(resource) : propertyNodes.value.ContentTemplate.flatMap(node => nodeChildren(node))
  if (templateNodes.length) return h(xamlTemplateComponent(templateNodes, content, instance))
  if (typeof ContentTemplate.value === 'function' || ContentTemplate.value && typeof ContentTemplate.value === 'object' && !isVNode(ContentTemplate.value)) return h(ContentTemplate.value as never, { Content: content })
  if (isVNode(content)) return content
  if (propertyNodes.value.Content.length) return h(Fragment, normalizeXamlNodes(propertyNodes.value.Content, instance))
  return typeof content === 'string' || typeof content === 'number' ? h(TextBlock, { Text: String(content), TextWrapping: 'WrapWholeWords' }) : null
} } })
const visibility = (value: unknown) => value ? 'Visible' : 'Collapsed'
const RootVisibility = computed(() => visibility(IsOpen.value))
const TitleVisibility = computed(() => visibility(Title.value))
const MessageVisibility = computed(() => visibility(Message.value))
const StandardIconVisibility = computed(() => visibility(IsIconVisible.value && !effectiveIcon.value))
const UserIconVisibility = computed(() => visibility(IsIconVisible.value && effectiveIcon.value))
const CloseVisibility = computed(() => visibility(IsClosable.value))
const CloseButtonEnabled = computed(() => {
  const command = CloseButtonCommand.value as { CanExecute?: (parameter: unknown) => boolean } | null
  return IsEnabled.value && (typeof command?.CanExecute !== 'function' || command.CanExecute(CloseButtonCommandParameter.value))
})
const ActionVisibility = computed(() => visibility(hasAction.value))
const ContentRow = computed(() => Title.value || Message.value || hasAction.value ? 1 : 0)
const SeverityBackground = computed(() => `var(--InfoBar${Severity.value}SeverityBackgroundBrush)`)
const SeverityIconBackground = computed(() => `var(--InfoBar${Severity.value}SeverityIconBackground)`)
const SeverityIconForeground = computed(() => `var(--InfoBar${Severity.value}SeverityIconForeground)`)
const SeverityIconGlyph = computed(() => ({ Informational: '\uF13F', Success: '\uF13E', Warning: '\uF13C', Error: '\uF13D' }[String(Severity.value)]))
const SeverityLabel = computed(() => t(`control.infobar.severity-${String(Severity.value).toLowerCase()}`))
const LandmarkLabel = computed(() => String(resolve(attrs['AutomationProperties.Name']) || t('control.infobar.landmark-name')))
const CloseLabel = computed(() => t('control.infobar.close-button-name'))
const CloseTooltip = computed(() => t('control.infobar.close-button-tooltip'))
const TitleForeground = computed(() => Foreground.value || 'var(--InfoBarTitleForeground)')
const MessageForeground = computed(() => Foreground.value || 'var(--InfoBarMessageForeground)')
const InfoBarTitle = Title
const InfoBarMessage = Message
const InfoBarBackground = Background
const InfoBarBorderBrush = BorderBrush
const InfoBarBorderThickness = BorderThickness
const InfoBarCornerRadius = CornerRadius
const styleName = (value: unknown) => typeof value === 'string'
  ? value.match(/^\{(?:StaticResource|ThemeResource)\s+([^}]+)\}$/)?.[1] ?? value.match(/^var\(--([^,)]+)\)$/)?.[1] ?? value : ''
type CloseStyle = { Setters?: Array<{ Property: string; Value: unknown }> | Record<string, unknown>; BasedOn?: unknown; [property: string]: unknown }
const resolveCloseStyle = (source: unknown, seen = new Set<unknown>()): { name: string; setters: Record<string, unknown>; infoBarStyle: boolean } => {
  if (!source || seen.has(source)) return { name: 'DefaultButtonStyle', setters: {}, infoBarStyle: false }
  seen.add(source)
  const name = styleName(source)
  const resource = resourceNode(source)
  if (resource) {
    const base = resolveCloseStyle(resource.props?.BasedOn, seen)
    const setters = { ...base.setters }
    const collect = (nodes: VNode[]) => {
      for (const node of visualNodes(nodes)) {
        const kind = typeof node.type === 'string' ? node.type : (node.type as { name?: string; __name?: string })?.name ?? (node.type as { __name?: string })?.__name
        if (kind === 'Setter' && typeof node.props?.Property === 'string') setters[node.props.Property] = resolve(node.props.Value)
        else collect(nodeChildren(node))
      }
    }
    collect(nodeChildren(resource))
    return { ...base, setters }
  }
  if (name === 'InfoBarCloseButtonStyle') return {
    name: 'DefaultButtonStyle', infoBarStyle: true,
    setters: { Width: resolve('{StaticResource InfoBarCloseButtonSize}'), Height: resolve('{StaticResource InfoBarCloseButtonSize}'), VerticalAlignment: 'Top', Margin: '5' }
  }
  if (typeof source === 'object' && !isVNode(source)) {
    const object = source as CloseStyle
    const base = resolveCloseStyle(object.BasedOn, seen)
    const setters = { ...base.setters }
    if (Array.isArray(object.Setters)) {
      for (const setter of object.Setters) if (setter.Property) setters[setter.Property] = resolve(setter.Value)
    } else {
      for (const [key, value] of Object.entries(object.Setters ?? object)) if (!['BasedOn', 'Setters', 'TargetType'].includes(key)) setters[key] = resolve(value)
    }
    return { ...base, setters }
  }
  return { name: name || 'DefaultButtonStyle', setters: {}, infoBarStyle: false }
}
const closeStyle = computed(() => resolveCloseStyle(CloseButtonStyle.value))
const closeStyleSetters = computed(() => Object.fromEntries(Object.entries(closeStyle.value.setters).map(([key, value]) =>
  [key, ['Padding', 'Margin', 'FontWeight', 'FontFamily', 'HorizontalAlignment', 'VerticalAlignment'].includes(key) ? String(value ?? '') : value]
)))
const closeStyleValue = (property: string) => computed(() => closeStyleSetters.value[property] ?? '')
const CloseButtonWidth = closeStyleValue('Width')
const CloseButtonHeight = closeStyleValue('Height')
const CloseButtonMinWidth = closeStyleValue('MinWidth')
const CloseButtonMinHeight = closeStyleValue('MinHeight')
const CloseButtonMaxWidth = closeStyleValue('MaxWidth')
const CloseButtonMaxHeight = closeStyleValue('MaxHeight')
const CloseButtonMargin = closeStyleValue('Margin')
const CloseButtonPadding = closeStyleValue('Padding')
const CloseButtonHorizontalAlignment = closeStyleValue('HorizontalAlignment')
const CloseButtonVerticalAlignment = closeStyleValue('VerticalAlignment')
const CloseButtonHorizontalContentAlignment = closeStyleValue('HorizontalContentAlignment')
const CloseButtonVerticalContentAlignment = closeStyleValue('VerticalContentAlignment')
const CloseButtonBackground = closeStyleValue('Background')
const CloseButtonForeground = closeStyleValue('Foreground')
const CloseButtonBorderBrush = closeStyleValue('BorderBrush')
const CloseButtonBorderThickness = closeStyleValue('BorderThickness')
const CloseButtonCornerRadius = closeStyleValue('CornerRadius')
const CloseButtonFontFamily = closeStyleValue('FontFamily')
const CloseButtonFontWeight = closeStyleValue('FontWeight')
const CloseButtonFontSize = closeStyleValue('FontSize')
const InfoBarCloseStyle = computed(() => closeStyle.value.name)
const usesDefaultCloseStyle = computed(() => closeStyle.value.infoBarStyle)
const severityClass = computed(() => `win-infobar-${String(Severity.value).toLowerCase()}`)
const themeClass = computed(() => ['Light', 'Dark'].includes(String(RequestedTheme.value)) ? `theme-${String(RequestedTheme.value).toLowerCase()}` : '')
const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !['class', 'style', 'CloseButtonClick', 'Closing', 'Closed', 'Opened', 'AutomationProperties.Name'].includes(key))))
const rootStyle = computed(() => {
  const style: Record<string, unknown> = { justifySelf: alignment(resolve(props.HorizontalAlignment), 'horizontal'), alignSelf: alignment(resolve(props.VerticalAlignment), 'vertical'), margin: xamlThickness(resolve(props.Margin)) }
  for (const name of ['Width', 'Height', 'MinWidth', 'MinHeight', 'MaxWidth', 'MaxHeight'] as const) if (resolve(props[name]) !== '') style[name[0].toLowerCase() + name.slice(1)] = cssLength(resolve(props[name]))
  if (!IsOpen.value || resolve(props.Visibility) === 'Collapsed') style.display = 'none'
  if (resolve(props.Visibility) === 'Hidden') style.visibility = 'hidden'
  return [attrs.style, style]
})
provide(xamlScopeKey, { RootVisibility, TitleVisibility, MessageVisibility, StandardIconVisibility, UserIconVisibility, CloseVisibility, CloseButtonEnabled, CloseButtonWidth, CloseButtonHeight, CloseButtonMinWidth, CloseButtonMinHeight, CloseButtonMaxWidth, CloseButtonMaxHeight, CloseButtonMargin, CloseButtonPadding, CloseButtonHorizontalAlignment, CloseButtonVerticalAlignment, CloseButtonHorizontalContentAlignment, CloseButtonVerticalContentAlignment, CloseButtonBackground, CloseButtonForeground, CloseButtonBorderBrush, CloseButtonBorderThickness, CloseButtonCornerRadius, CloseButtonFontFamily, CloseButtonFontWeight, CloseButtonFontSize, ActionVisibility, ContentRow, SeverityBackground, SeverityIconBackground, SeverityIconForeground, SeverityIconGlyph, SeverityLabel, CloseLabel, CloseTooltip, TitleForeground, MessageForeground, InfoBarTitle, InfoBarMessage, InfoBarBackground, InfoBarBorderBrush, InfoBarBorderThickness, InfoBarCornerRadius, InfoBarCloseStyle, OnCloseButtonClick })
let disposed = false
onMounted(() => { void nextTick(() => { if (!disposed) resolveXamlHandler(attrs.Loaded, instance)?.(publicApi, {}) }) })
onBeforeUnmount(() => { disposed = true })
</script>

<style scoped>
.win-infobar { box-sizing: border-box; width: 100%; min-width: 0; max-width: 100%; font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif); }
.win-infobar :deep(.win-infobar-content-root) { width: 100%; }
.win-infobar :deep(.win-infobar-layout) { align-items: start; }
.win-infobar :deep(.win-infobar-standard-icon-area) { min-width: 0; }
.win-infobar :deep(.win-infobar-icon-background), .win-infobar :deep(.win-infobar-standard-icon) { line-height: 16px; width: 16px; height: 16px; font-synthesis: none; }
.win-infobar :deep(.win-infobar-title), .win-infobar :deep(.win-infobar-message) { line-height: 20px; min-width: 0; overflow-wrap: anywhere; }
.win-infobar :deep(.win-infobar-action) { min-width: 0; max-width: 100%; }
.win-infobar :deep(.win-infobar-action .win-hyperlink-button) { margin-left: -12px; --HyperlinkButtonForeground: var(--InfoBarHyperlinkButtonForeground); max-width: 100%; }
.win-infobar :deep(.win-infobar-action .win-btn) { max-width: 100%; white-space: normal; overflow-wrap: anywhere; }
.win-infobar :deep(.win-infobar-content-area) { min-width: 0; overflow: hidden; }
.win-infobar :deep(.uses-default-close-button-style) { --ButtonBackground: var(--AppBarButtonBackground, transparent); --ButtonBackgroundPointerOver: var(--AppBarButtonBackgroundPointerOver, var(--subtle-secondary)); --ButtonBackgroundPressed: var(--AppBarButtonBackgroundPressed, var(--subtle-tertiary)); --ButtonBackgroundDisabled: var(--AppBarButtonBackgroundDisabled, transparent); --ButtonForeground: var(--AppBarButtonForeground, var(--text-primary)); --ButtonForegroundPointerOver: var(--AppBarButtonForegroundPointerOver, var(--text-primary)); --ButtonForegroundPressed: var(--AppBarButtonForegroundPressed, var(--text-secondary)); --ButtonForegroundDisabled: var(--AppBarButtonForegroundDisabled, var(--text-disabled)); --ButtonBorderBrush: transparent; --ButtonBorderBrushTop: transparent; --ButtonBorderBrushBottom: transparent; --ButtonBorderBrushPointerOver: transparent; --ButtonBorderBrushPressed: transparent; --ButtonBorderBrushDisabled: transparent; }
</style>
