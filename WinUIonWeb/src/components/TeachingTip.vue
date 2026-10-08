<template>
  <span ref="hostRef" class="teaching-tip-host" aria-hidden="true" />
  <Teleport to="body">
    <div
      v-if="isVisible && IsLightDismissEnabled"
      class="teaching-tip-light-dismiss-indicator"
      :style="lightDismissStyle"
      v-bind="lightDismissEvents"
      aria-hidden="true"
      @pointerdown.prevent.stop="OnLightDismissPointerDown" />
    <section
      ref="tipRef"
      class="teaching-tip-root"
      :class="[themeClass, `tail-${tailSide}`, `hero-${effectiveHeroPlacement.toLowerCase()}`, { 'teaching-tip-container': isVisible, 'is-light-dismiss': IsLightDismissEnabled }]"
      :style="containerStyle"
      role="dialog"
      :aria-label="automationName || String(Title || '') || undefined"
      :aria-modal="IsLightDismissEnabled || undefined"
      :aria-hidden="!isVisible || undefined"
      :inert="!isVisible"
      tabindex="-1">
      <Grid class="teaching-tip-layout-root">
        <Grid.ColumnDefinitions>
          <ColumnDefinition Width="{StaticResource TeachingTipTailShortSideLength}" />
          <ColumnDefinition Width="{StaticResource TeachingTipTailMargin}" />
          <ColumnDefinition Width="*" />
          <ColumnDefinition Width="{StaticResource TeachingTipTailMargin}" />
          <ColumnDefinition Width="{StaticResource TeachingTipTailShortSideLength}" />
        </Grid.ColumnDefinitions>
        <Grid.RowDefinitions>
          <RowDefinition Height="{StaticResource TeachingTipTailShortSideLength}" />
          <RowDefinition Height="{StaticResource TeachingTipTailMargin}" />
          <RowDefinition Height="*" />
          <RowDefinition Height="{StaticResource TeachingTipTailMargin}" />
          <RowDefinition Height="{StaticResource TeachingTipTailShortSideLength}" />
        </Grid.RowDefinitions>
        <Grid class="teaching-tip-tail-occlusion-grid" Grid.RowSpan="5" Grid.ColumnSpan="5">
          <Grid.ColumnDefinitions>
            <ColumnDefinition Width="{StaticResource TeachingTipTailShortSideLength}" />
            <ColumnDefinition Width="{StaticResource TeachingTipTailMargin}" />
            <ColumnDefinition Width="*" />
            <ColumnDefinition Width="{StaticResource TeachingTipTailMargin}" />
            <ColumnDefinition Width="{StaticResource TeachingTipTailShortSideLength}" />
          </Grid.ColumnDefinitions>
          <Grid.RowDefinitions>
            <RowDefinition Height="{StaticResource TeachingTipTailShortSideLength}" />
            <RowDefinition Height="{StaticResource TeachingTipTailMargin}" />
            <RowDefinition Height="*" />
            <RowDefinition Height="{StaticResource TeachingTipTailMargin}" />
            <RowDefinition Height="{StaticResource TeachingTipTailShortSideLength}" />
          </Grid.RowDefinitions>
        <Grid class="teaching-tip-content-root-grid" Grid.Row="1" Grid.Column="1" Grid.RowSpan="3" Grid.ColumnSpan="3" Background="{x:Bind TipBackground}" BorderBrush="{x:Bind TipBorderBrush}" BorderThickness="{x:Bind TipBorderThickness}" CornerRadius="{x:Bind TipCornerRadius}" Shadow="{x:Bind ContentShadow, Mode=OneWay}" Translation="0,0,32">
          <Grid.RowDefinitions>
            <RowDefinition Height="Auto" />
            <RowDefinition Height="*" />
            <RowDefinition Height="Auto" />
          </Grid.RowDefinitions>
          <Border class="teaching-tip-hero-content-border" Visibility="{x:Bind HeroVisibility}" Grid.Row="{x:Bind HeroRow}" CornerRadius="{x:Bind HeroCornerRadius}">
            <HeroContentOutlet />
          </Border>
          <Grid class="teaching-tip-non-hero-content-root-grid" Grid.Row="1">
            <ScrollViewer class="teaching-tip-scroll-viewer" VerticalScrollBarVisibility="Auto">
              <StackPanel Margin="{StaticResource TeachingTipContentMargin}">
                <Grid>
                  <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="Auto" />
                    <ColumnDefinition Width="*" />
                  </Grid.ColumnDefinitions>
                  <Border class="teaching-tip-icon-presenter" Visibility="{x:Bind IconVisibility}" Grid.Column="0" Margin="{StaticResource TeachingTipIconPresenterMarginWithIcon}">
                    <IconSourceOutlet />
                  </Border>
                  <StackPanel Grid.Column="1" Margin="{x:Bind TitlesMargin}">
                    <TextBlock class="teaching-tip-title" Visibility="{x:Bind TitleVisibility}" Text="{x:Bind TeachingTipTitleValue}" TextWrapping="WrapWholeWords" FontWeight="SemiBold" />
                    <TextBlock class="teaching-tip-subtitle" Visibility="{x:Bind SubtitleVisibility}" Text="{x:Bind TeachingTipSubtitleValue}" TextWrapping="WrapWholeWords" />
                  </StackPanel>
                </Grid>
                <Border class="teaching-tip-main-content-presenter" Visibility="{x:Bind ContentVisibility}" Margin="{StaticResource TeachingTipMainContentPresentMargin}">
                  <ContentOutlet />
                </Border>
                <Grid class="teaching-tip-buttons-grid">
                  <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="*" />
                    <ColumnDefinition Width="*" />
                  </Grid.ColumnDefinitions>
                  <Button class="teaching-tip-action-button" Visibility="{x:Bind ActionVisibility}" HorizontalAlignment="Stretch" Style="{x:Bind ActionStyle}" Grid.ColumnSpan="{x:Bind ActionSpan}" Margin="{x:Bind ActionMargin}" Click="OnActionButtonClick">
                    <ActionContentOutlet />
                  </Button>
                  <Button class="teaching-tip-close-button" Visibility="{x:Bind CloseVisibility}" HorizontalAlignment="Stretch" Style="{x:Bind CloseStyle}" Grid.Column="{x:Bind CloseColumn}" Grid.ColumnSpan="{x:Bind CloseSpan}" Margin="{x:Bind CloseMargin}" Click="OnCloseButtonClick">
                    <CloseContentOutlet />
                  </Button>
                </Grid>
              </StackPanel>
            </ScrollViewer>
            <Button
              class="teaching-tip-alternate-close-button"
              Visibility="{x:Bind AlternateCloseVisibility}"
              Style="SubtleButtonStyle"
              Width="{ThemeResource TeachingTipAlternateCloseButtonSize}"
              Height="{ThemeResource TeachingTipAlternateCloseButtonSize}"
              Padding="4"
              Margin="0"
              BorderThickness="{ThemeResource TeachingTipAlternateCloseButtonBorderThickness}"
              CornerRadius="{ThemeResource ControlCornerRadius}"
              FocusVisualMargin="-3"
              HorizontalAlignment="Right"
              VerticalAlignment="Top"
              Content="&#xE711;"
              FontFamily="{ThemeResource SymbolThemeFontFamily}"
              FontSize="{ThemeResource TeachingTipAlternateCloseButtonGlyphSize}"
              AutomationProperties.Name="{x:Bind AlternateCloseButtonLabel}"
              ToolTipService.ToolTip="{x:Bind AlternateCloseButtonLabel}"
              Click="OnCloseButtonClick" />
          </Grid>
        </Grid>
        <svg v-if="hasVisibleTail" class="teaching-tip-tail-polygon" Grid.RowSpan="5" Grid.ColumnSpan="5" :viewBox="tailViewBox" aria-hidden="true">
          <polygon :points="tailPoints" />
          <polyline :points="tailPoints" />
        </svg>
        </Grid>
      </Grid>
    </section>
  </Teleport>
</template>

<script lang="ts">
import { TeachingTipContent, TeachingTipHeroContent, TeachingTipIconSource, TeachingTipActionButtonContent, TeachingTipCloseButtonContent } from './TeachingTipProperties'

export default {
  HeroContent: TeachingTipHeroContent,
  Content: TeachingTipContent,
  IconSource: TeachingTipIconSource,
  ActionButtonContent: TeachingTipActionButtonContent,
  CloseButtonContent: TeachingTipCloseButtonContent
}
</script>

<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, provide, proxyRefs, ref, shallowReactive, unref, useAttrs, useSlots, watch, type VNode } from 'vue'
import Border from './Border.vue'
import Button from './Button.vue'
import ColumnDefinition from './ColumnDefinition.vue'
import Grid from './Grid.vue'
import RowDefinition from './RowDefinition.vue'
import ScrollViewer from './ScrollViewer.vue'
import StackPanel from './StackPanel.vue'
import SymbolIcon from './SymbolIcon.vue'
import TextBlock from './TextBlock.vue'
import { useI18n } from './i18n/index'
import { getTeachingTipProperty, type TeachingTipPropertyName } from './TeachingTipProperties'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime'
import { popupBoundsFor, resolvePopupElement, fitPopupPosition } from './popupRuntime'
import { teachingTipPlacement, teachingTipTailSide, teachingTipThickness, type TeachingTipPlacement } from './teachingTipPlacement'
import { createThemeShadow } from './themeShadowRuntime'

defineOptions({ name: 'TeachingTip', inheritAttrs: false })
const props = defineProps({
  IsOpen: { type: [Boolean, String], default: undefined }, Target: { type: [Object, String], default: null },
  Title: { type: String, default: '' }, Subtitle: { type: String, default: '' },
  Content: { type: [String, Number, Object], default: null }, HeroContent: { type: [String, Number, Object], default: null },
  ActionButtonContent: { type: [String, Number, Object], default: null }, CloseButtonContent: { type: [String, Number, Object], default: null },
  ActionButtonStyle: { type: [String, Object], default: '{ThemeResource DefaultButtonStyle}' },
  CloseButtonStyle: { type: [String, Object], default: '{ThemeResource DefaultButtonStyle}' },
  ActionButtonCommand: { type: [Function, Object, String], default: null }, ActionButtonCommandParameter: { default: null },
  CloseButtonCommand: { type: [Function, Object, String], default: null }, CloseButtonCommandParameter: { default: null },
  IconSource: { type: [String, Object], default: null }, TailVisibility: { type: String, default: 'Auto' },
  PreferredPlacement: { type: String, default: 'Auto' }, PlacementMargin: { type: [String, Number, Object], default: 0 },
  ShouldConstrainToRootBounds: { type: [Boolean, String], default: true }, IsLightDismissEnabled: { type: [Boolean, String], default: false },
  HeroContentPlacement: { type: String, default: 'Auto' }, RequestedTheme: { type: String, default: 'Default' },
  Background: { type: String, default: '{ThemeResource TeachingTipBackgroundBrush}' },
  Foreground: { type: String, default: '{ThemeResource TeachingTipForegroundBrush}' },
  BorderBrush: { type: String, default: '{ThemeResource TeachingTipBorderBrush}' },
  BorderThickness: { type: [String, Number], default: 1 }, CornerRadius: { type: [String, Number], default: '{ThemeResource OverlayCornerRadius}' }
})
type CloseReason = 'CloseButton' | 'LightDismiss' | 'Programmatic'
const emit = defineEmits(['update:IsOpen', 'ActionButtonClick', 'CloseButtonClick', 'Closing', 'Closed', 'Opened'])
const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
const { t } = useI18n()
const inheritedTheme = inject('winuiTheme', null)
const hostRef = ref<HTMLElement | null>(null)
const tipRef = ref<HTMLElement | null>(null)
const localIsOpen = ref(false)
const isVisible = ref(false)
// TeachingTip::EstablishShadows attaches to ContentRootGrid; its tail shadow is debug-only.
const contentShadow = createThemeShadow()
const ContentShadow = computed(() => isVisible.value ? contentShadow : null)
const positioned = ref(false)
const theme = ref('light')
const position = ref({ left: 0, top: 0, tailX: 160, tailY: 40 })
const sizeLimit = ref({ width: 336, height: 520 })
const rootBounds = ref({ left: 0, top: 0, width: 0, height: 0 })
const actualPlacement = ref<TeachingTipPlacement>('Bottom')
const resolve = (value: unknown) => resolveXamlValue(value, instance)
const propertyOverrides = shallowReactive<Record<string, unknown>>({})
const propertyValue = (name: keyof typeof props) => propertyOverrides[name] !== undefined ? propertyOverrides[name] : resolve(props[name])
const dependencyProperty = (name: keyof typeof props) => {
  watch(() => resolve(props[name]), () => { delete propertyOverrides[name] })
  return computed({ get: () => propertyValue(name), set: value => { propertyOverrides[name] = value; updateXamlBinding(props[name], value, instance) } })
}
const boolean = (value: unknown) => resolve(value) === true || resolve(value) === 'True'
const IsLightDismissEnabled = computed(() => boolean(propertyValue('IsLightDismissEnabled')))
const requestedOpen = localIsOpen
watch(() => resolve(props.IsOpen), value => { if (value !== undefined) localIsOpen.value = value === true || value === 'True' }, { immediate: true })
const Target = dependencyProperty('Target')
const Title = dependencyProperty('Title')
const Subtitle = dependencyProperty('Subtitle')
const TeachingTipTitleValue = Title
const TeachingTipSubtitleValue = Subtitle
const AlternateCloseButtonLabel = computed(() => t('control.teachingtip.close'))
const automationName = computed(() => String(resolve(attrs['AutomationProperties.Name']) ?? ''))
const themeClass = computed(() => `win-theme-scope theme-${theme.value}`)
const propertyNodes = computed(() => {
  const result: Record<TeachingTipPropertyName, VNode[]> = { heroContent: [], content: [], iconSource: [], actionButtonContent: [], closeButtonContent: [] }
  const content: VNode[] = []
  const collect = (nodes: VNode[]) => {
    for (const node of nodes) {
      if (node.type === Fragment && Array.isArray(node.children)) { collect(node.children as VNode[]); continue }
      const property = getTeachingTipProperty(node)
      if (!property) { content.push(node); continue }
      const slot = (node.children as { default?: () => VNode[] } | null)?.default
      if (slot) result[property].push(...normalizeXamlNodes(slot(), instance))
    }
  }
  collect(slots.default?.() ?? [])
  if (!result.content.length) result.content = normalizeXamlNodes(content, instance)
  return result
})
const hasValue = (name: TeachingTipPropertyName, value: unknown) => propertyNodes.value[name].length > 0 || value !== null && value !== undefined && value !== ''
const hasHeroContent = computed(() => hasValue('heroContent', propertyValue('HeroContent')))
const hasContent = computed(() => hasValue('content', propertyValue('Content')))
const hasIconSource = computed(() => hasValue('iconSource', propertyValue('IconSource')))
const hasActionButton = computed(() => hasValue('actionButtonContent', propertyValue('ActionButtonContent')))
const hasCloseButton = computed(() => hasValue('closeButtonContent', propertyValue('CloseButtonContent')))
const ShowAlternateCloseButton = computed(() => !hasCloseButton.value && !IsLightDismissEnabled.value)
const HeroVisibility = computed(() => hasHeroContent.value ? 'Visible' : 'Collapsed')
const IconVisibility = computed(() => hasIconSource.value ? 'Visible' : 'Collapsed')
const TitleVisibility = computed(() => Title.value ? 'Visible' : 'Collapsed')
const SubtitleVisibility = computed(() => Subtitle.value ? 'Visible' : 'Collapsed')
const ContentVisibility = computed(() => hasContent.value ? 'Visible' : 'Collapsed')
const ActionVisibility = computed(() => hasActionButton.value ? 'Visible' : 'Collapsed')
const CloseVisibility = computed(() => hasCloseButton.value ? 'Visible' : 'Collapsed')
const AlternateCloseVisibility = computed(() => ShowAlternateCloseButton.value ? 'Visible' : 'Collapsed')
const effectiveHeroPlacement = computed(() => {
  const preferred = propertyValue('HeroContentPlacement')
  if (preferred === 'Top' || preferred === 'Bottom') return preferred
  if (!hasVisibleTail.value) return 'Top'
  return ['Bottom', 'BottomLeft', 'BottomRight', 'LeftBottom', 'RightBottom'].includes(actualPlacement.value) ? 'Bottom' : 'Top'
})
const HeroRow = computed(() => effectiveHeroPlacement.value === 'Top' ? 0 : 2)
const HeroCornerRadius = computed(() => effectiveHeroPlacement.value === 'Top' ? 'var(--OverlayCornerRadius) var(--OverlayCornerRadius) 0 0' : '0 0 var(--OverlayCornerRadius) var(--OverlayCornerRadius)')
const TitlesMargin = computed(() => resolve(ShowAlternateCloseButton.value ? '{StaticResource TeachingTipTitleStackPanelMarginWithHeaderCloseButton}' : '{StaticResource TeachingTipTitleStackPanelMarginWithFooterCloseButton}'))
const ActionMargin = computed(() => resolve(hasCloseButton.value ? '{ThemeResource TeachingTipLeftButtonMargin}' : '{ThemeResource TeachingTipButtonPanelMargin}'))
const CloseMargin = computed(() => resolve(hasActionButton.value ? '{ThemeResource TeachingTipRightButtonMargin}' : '{ThemeResource TeachingTipButtonPanelMargin}'))
const ActionSpan = computed(() => hasCloseButton.value ? 1 : 2)
const CloseSpan = computed(() => hasActionButton.value ? 1 : 2)
const CloseColumn = computed(() => hasActionButton.value ? 1 : 0)
const ActionStyle = computed(() => propertyValue('ActionButtonStyle'))
const CloseStyle = computed(() => propertyValue('CloseButtonStyle'))
const TipBackground = computed(() => IsLightDismissEnabled.value ? '{ThemeResource TeachingTipTransientBackground}' : propertyValue('Background'))
const TipBorderBrush = computed(() => propertyValue('BorderBrush'))
const TipBorderThickness = computed(() => propertyValue('BorderThickness'))
const TipCornerRadius = computed(() => propertyValue('CornerRadius'))
const hasVisibleTail = computed(() => propertyValue('TailVisibility') !== 'Collapsed' && (Boolean(targetElement()) || propertyValue('TailVisibility') === 'Visible'))
const tailSide = computed(() => hasVisibleTail.value ? teachingTipTailSide(actualPlacement.value) : 'none')
const tailViewBox = computed(() => tailSide.value === 'left' || tailSide.value === 'right' ? '0 0 10 20' : '0 0 20 10')
const tailPoints = computed(() => ({ top: '0,10 10,0 20,10', bottom: '0,0 10,10 20,0', left: '10,0 0,10 10,20', right: '0,0 10,10 0,20', none: '' }[tailSide.value]))
type TipPaint = import('vue').CSSProperties[`--${string}`]
const containerStyle = computed<import('vue').CSSProperties>(() => ({
  display: isVisible.value ? undefined : 'none',
  left: `${position.value.left}px`, top: `${position.value.top}px`, visibility: positioned.value ? 'visible' as const : 'hidden' as const,
  '--teaching-tip-width': `${sizeLimit.value.width}px`, '--teaching-tip-height': `${sizeLimit.value.height}px`,
  '--teaching-tip-tail-x': `${position.value.tailX}px`, '--teaching-tip-tail-y': `${position.value.tailY}px`,
  '--teaching-tip-background': IsLightDismissEnabled.value ? 'var(--TeachingTipTransientBackground, var(--AcrylicInAppFillColorDefaultBrush))' : propertyValue('Background') as TipPaint,
  '--teaching-tip-foreground': propertyValue('Foreground') as TipPaint, '--teaching-tip-border': propertyValue('BorderBrush') as TipPaint,
  '--teaching-tip-radius': typeof propertyValue('CornerRadius') === 'number' ? `${propertyValue('CornerRadius')}px` : propertyValue('CornerRadius') as TipPaint,
  '--teaching-tip-border-width': `${Number(propertyValue('BorderThickness')) || 0}px`
}))
const lightDismissStyle = computed<import('vue').CSSProperties>(() => ({
  left: `${rootBounds.value.left}px`, top: `${rootBounds.value.top}px`,
  width: `${rootBounds.value.width}px`, height: `${rootBounds.value.height}px`,
  visibility: positioned.value ? 'visible' : 'hidden'
}))
const lightDismissEvents = { onClick: (event: MouseEvent) => { event.preventDefault(); event.stopPropagation() } }
const outlet = (name: TeachingTipPropertyName, value: () => unknown) => defineComponent({
  name: `TeachingTip${name}Presenter`,
  setup() { return () => {
    if (propertyNodes.value[name].length) return h(Fragment, propertyNodes.value[name])
    const content = resolve(value())
    if (isVNode(content)) return content
    if (name === 'iconSource' && content) {
      const source = content as { Symbol?: unknown, Foreground?: string }
      return h(SymbolIcon, { Symbol: String(source.Symbol ?? content), Foreground: source.Foreground })
    }
    return typeof content === 'string' || typeof content === 'number' ? h('span', { class: 'teaching-tip-presenter-text' }, String(content)) : null
  } }
})
const HeroContentOutlet = outlet('heroContent', () => propertyValue('HeroContent'))
const ContentOutlet = outlet('content', () => propertyValue('Content'))
const IconSourceOutlet = outlet('iconSource', () => propertyValue('IconSource'))
const ActionContentOutlet = outlet('actionButtonContent', () => propertyValue('ActionButtonContent'))
const CloseContentOutlet = outlet('closeButtonContent', () => propertyValue('CloseButtonContent'))
let animation: Animation | null = null
let animationTask: Promise<void> = Promise.resolve()
let closingTask: Promise<void> | null = null
let themeObserver: MutationObserver | null = null
let resizeObserver: ResizeObserver | null = null
let previouslyFocused: HTMLElement | null = null
let unmounted = false
let openGeneration = 0
let boundsHost: HTMLElement | null = null

function targetElement() {
  const resolved = resolvePopupElement(Target.value)
  if (resolved) return resolved
  const name = String(props.Target ?? '').match(/^\{x:Bind\s+([\w]+)(?:,.*)?\}$/)?.[1]
  return name ? hostRef.value?.closest('.example-display')?.querySelector<HTMLElement>(`[data-xaml-ref="${name}"]`) ?? null : null
}
function dispatch(name: 'ActionButtonClick' | 'CloseButtonClick' | 'Closing' | 'Closed' | 'Opened', args: unknown) {
  emit(name, publicApi, args)
  resolveXamlHandler(attrs[name], instance)?.(publicApi, args)
}
function setOpen(value: boolean) {
  localIsOpen.value = value
  updateXamlBinding(props.IsOpen, value, instance)
  emit('update:IsOpen', value)
}
const IsOpen = computed({ get: () => requestedOpen.value, set: setOpen })
function syncTheme() {
  const owner = targetElement() ?? hostRef.value
  const scope = owner?.closest('.theme-light, .theme-dark')
  const explicit = String(propertyValue('RequestedTheme') ?? '').toLowerCase()
  theme.value = explicit === 'light' || explicit === 'dark' ? explicit
    : scope?.classList.contains('theme-dark') ? 'dark' : scope?.classList.contains('theme-light') ? 'light'
      : String(unref(inheritedTheme) || document.documentElement.dataset.theme || 'light').toLowerCase() === 'dark' ? 'dark' : 'light'
}
function firstFocusable() {
  return [...(tipRef.value?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), [tabindex="0"]') ?? [])].find(element => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden') ?? tipRef.value
}
async function updatePosition() {
  await nextTick()
  const tip = tipRef.value
  if (!tip || unmounted || !isVisible.value) return
  const target = targetElement()
  const bounds = popupBoundsFor(target ?? hostRef.value, boolean(propertyValue('ShouldConstrainToRootBounds')))
  rootBounds.value = bounds
  const resource = (name: string, fallback: number) => Number.parseFloat(getComputedStyle(tip).getPropertyValue(`--${name}`)) || fallback
  sizeLimit.value = { width: Math.min(resource('TeachingTipMaxWidth', 336), bounds.width), height: Math.min(resource('TeachingTipMaxHeight', 520), bounds.height) }
  await nextTick()
  const size = { width: tip.offsetWidth, height: tip.offsetHeight }
  const result = teachingTipPlacement(target?.getBoundingClientRect() ?? null, size, bounds, String(propertyValue('PreferredPlacement')), teachingTipThickness(propertyValue('PlacementMargin')), String(propertyValue('HeroContentPlacement')), hasHeroContent.value, getComputedStyle(target ?? hostRef.value ?? document.documentElement).direction === 'rtl')
  actualPlacement.value = result.placement
  const constrained = boolean(propertyValue('ShouldConstrainToRootBounds')) ? fitPopupPosition(result, size, bounds) : result
  const rect = target?.getBoundingClientRect()
  position.value = {
    ...constrained,
    tailX: rect ? Math.max(28, Math.min(size.width - 28, rect.left + rect.width / 2 - constrained.left)) : size.width / 2,
    tailY: rect ? Math.max(28, Math.min(size.height - 28, rect.top + rect.height / 2 - constrained.top)) : size.height / 2
  }
  positioned.value = true
  syncTheme()
}
async function animate(open: boolean) {
  const element = tipRef.value
  if (!element) return
  animation?.cancel()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !element.animate) return
  const side = tailSide.value
  element.style.transformOrigin = side === 'bottom' ? `${position.value.tailX}px 100%` : side === 'top' ? `${position.value.tailX}px 0` : side === 'left' ? `0 ${position.value.tailY}px` : side === 'right' ? `100% ${position.value.tailY}px` : '50% 50%'
  const shrink = `scale(${20 / element.offsetWidth}, ${20 / element.offsetHeight})`
  const current = element.animate(open ? [{ transform: 'scale(0.01)' }, { transform: 'scale(1)' }] : [{ transform: 'scale(1)' }, { transform: shrink }], {
    duration: open ? 300 : 200, easing: open ? 'cubic-bezier(0.1, 0.9, 0.2, 1)' : 'cubic-bezier(0.7, 0, 1, 0.5)', fill: 'both'
  })
  animation = current
  try { await current.finished } catch { return }
  if (animation === current) { current.cancel(); animation = null }
}
async function openTip() {
  const generation = ++openGeneration
  const scrollX = window.scrollX
  const scrollY = window.scrollY
  if (closingTask) await closingTask
  if (unmounted || !requestedOpen.value || isVisible.value) return
  isVisible.value = true
  positioned.value = false
  animationTask = (async () => {
    await updatePosition()
    if (unmounted || generation !== openGeneration) return
    if (tipRef.value) resizeObserver?.observe(tipRef.value)
    if (IsLightDismissEnabled.value) {
      previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
      firstFocusable()?.focus({ preventScroll: true })
      window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' })
    }
    await animate(true)
  })()
  await animationTask
  if (isVisible.value && requestedOpen.value && !unmounted) dispatch('Opened', {})
}
async function requestClose(reason: CloseReason = 'Programmatic') {
  if (!isVisible.value || closingTask) return closingTask
  setOpen(false)
  closingTask = (async () => {
    let pending = 0
    let eventDispatched = false
    let completeDeferrals!: () => void
    const deferrals = new Promise<void>(resolve => { completeDeferrals = resolve })
    const args = {
      Reason: reason, Cancel: false,
      GetDeferral() {
        pending += 1
        let completed = false
        return { Complete() { if (completed) return; completed = true; pending -= 1; if (eventDispatched && pending === 0) completeDeferrals() } }
      }
    }
    dispatch('Closing', args)
    eventDispatched = true
    if (pending === 0) completeDeferrals()
    await deferrals
    if (unmounted) return
    if (args.Cancel) { setOpen(true); return }
    // WinUI completes its expand batch before beginning a requested contract.
    await animationTask
    if (unmounted) return
    await animate(false)
    if (unmounted) return
    isVisible.value = false
    positioned.value = false
    dispatch('Closed', { Reason: reason })
    if (reason === 'CloseButton' || IsLightDismissEnabled.value) previouslyFocused?.focus({ preventScroll: true })
    previouslyFocused = null
  })()
  try { await closingTask } finally { closingTask = null }
  if (requestedOpen.value && !unmounted) void openTip()
}
function executeCommand(input: unknown, parameter: unknown) {
  const command = resolve(input) as { CanExecute?: (value: unknown) => boolean, Execute?: (value: unknown) => void } | ((value: unknown) => void) | null
  const value = resolve(parameter)
  if (typeof command === 'function') command(value)
  else if (command && (!command.CanExecute || command.CanExecute(value))) command.Execute?.(value)
}
function OnActionButtonClick() { executeCommand(propertyValue('ActionButtonCommand'), propertyValue('ActionButtonCommandParameter')); dispatch('ActionButtonClick', null) }
function OnCloseButtonClick() { executeCommand(propertyValue('CloseButtonCommand'), propertyValue('CloseButtonCommandParameter')); dispatch('CloseButtonClick', null); void requestClose('CloseButton') }
const exposedProperties = Object.fromEntries((Object.keys(props) as (keyof typeof props)[]).filter(name => !['IsOpen', 'Target', 'Title', 'Subtitle'].includes(name)).map(name => [name, dependencyProperty(name)]))
const api = { ...exposedProperties, IsOpen, Target, Title, Subtitle, Element: tipRef, TemplateSettings: computed(() => ({ IconElement: propertyValue('IconSource') })) }
const publicApi = proxyRefs(api)
provide(xamlScopeKey, { TeachingTipTitleValue, TeachingTipSubtitleValue, HeroVisibility, IconVisibility, TitleVisibility, SubtitleVisibility, ContentVisibility, ActionVisibility, CloseVisibility, AlternateCloseVisibility, TipBackground, TipBorderBrush, TipBorderThickness, TipCornerRadius, ContentShadow, HeroCornerRadius, HeroRow, TitlesMargin, ActionMargin, CloseMargin, ActionSpan, CloseSpan, CloseColumn, ActionStyle, CloseStyle, AlternateCloseButtonLabel, OnActionButtonClick, OnCloseButtonClick })
defineExpose(api)
watch(requestedOpen, open => { if (open) void openTip(); else void requestClose() }, { flush: 'post' })
watch(() => [Target.value, propertyValue('PreferredPlacement'), propertyValue('PlacementMargin'), propertyValue('HeroContentPlacement'), propertyValue('TailVisibility'), Title.value, Subtitle.value, propertyNodes.value, hasActionButton.value, hasCloseButton.value], () => { if (isVisible.value) void updatePosition() })
watch(() => propertyValue('RequestedTheme'), syncTheme)
function viewportChanged() { if (isVisible.value) void updatePosition() }
function pointerDown(event: PointerEvent) {
  if (!isVisible.value || !IsLightDismissEnabled.value || !(event.target instanceof Node) || tipRef.value?.contains(event.target)) return
  void requestClose('LightDismiss')
}
function OnLightDismissPointerDown() { void requestClose('LightDismiss') }
function keyDown(event: KeyboardEvent) {
  if (!isVisible.value) return
  if (event.key === 'Escape' && IsLightDismissEnabled.value) { event.preventDefault(); void requestClose('LightDismiss') }
  if (event.key === 'F6') {
    event.preventDefault()
    if (tipRef.value?.contains(document.activeElement)) previouslyFocused?.focus({ preventScroll: true })
    else {
      previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
      firstFocusable()?.focus({ preventScroll: true })
    }
  }
}
onMounted(() => {
  boundsHost = hostRef.value?.closest<HTMLElement>('[data-xaml-root]') ?? null
  syncTheme()
  themeObserver = new MutationObserver(syncTheme)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] })
  const themeHost = hostRef.value?.closest<HTMLElement>('.theme-light, .theme-dark') ?? boundsHost
  if (themeHost) themeObserver.observe(themeHost, { attributes: true, attributeFilter: ['class', 'data-theme'] })
  resizeObserver = new ResizeObserver(viewportChanged)
  if (boundsHost) resizeObserver.observe(boundsHost)
  if (targetElement()) resizeObserver.observe(targetElement()!)
  window.addEventListener('resize', viewportChanged)
  window.addEventListener('scroll', viewportChanged, true)
  document.addEventListener('pointerdown', pointerDown, true)
  document.addEventListener('keydown', keyDown, true)
  if (requestedOpen.value) void openTip()
})
onBeforeUnmount(() => {
  unmounted = true
  contentShadow.Dispose()
  animation?.cancel()
  themeObserver?.disconnect()
  resizeObserver?.disconnect()
  window.removeEventListener('resize', viewportChanged)
  window.removeEventListener('scroll', viewportChanged, true)
  document.removeEventListener('pointerdown', pointerDown, true)
  document.removeEventListener('keydown', keyDown, true)
})
</script>

<style>
.teaching-tip-host { display: none; }
.teaching-tip-light-dismiss-indicator {
  position: fixed;
  z-index: calc(var(--win-tip-z-index, 2147483646) - 1);
  background: transparent;
  touch-action: none;
}
.teaching-tip-root {
  position: fixed;
  z-index: var(--win-tip-z-index, 2147483646);
  width: max-content;
  min-width: min(var(--TeachingTipMinWidth, 320px), var(--teaching-tip-width));
  max-width: var(--teaching-tip-width);
  min-height: var(--TeachingTipMinHeight, 40px);
  max-height: var(--teaching-tip-height);
  box-sizing: border-box;
  padding: 0;
  color: var(--teaching-tip-foreground, var(--TextFillColorPrimaryBrush));
  font-size: 14px;
  line-height: 20px;
  outline: none;
}
.teaching-tip-layout-root.win-grid, .teaching-tip-tail-occlusion-grid.win-grid { position: relative; min-width: 0; }
.teaching-tip-content-root-grid.win-grid {
  min-width: 0;
  max-height: calc(var(--teaching-tip-height) - 16px);
  grid-template-rows: auto minmax(0, 1fr) auto !important;
  background: var(--teaching-tip-background, var(--TeachingTipBackgroundBrush));
  border: var(--teaching-tip-border-width, 1px) solid var(--teaching-tip-border, var(--TeachingTipBorderBrush));
  border-radius: var(--teaching-tip-radius, var(--OverlayCornerRadius, 8px));
  overflow: visible;
  position: relative;
}
.teaching-tip-content-root-grid::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: var(--TeachingTipTopHighlightHeight, 1px); background: var(--TeachingTipTopHighlightBrush); border-radius: inherit; pointer-events: none; }
.teaching-tip-hero-content-border { min-width: 0; min-height: 0; overflow: hidden; max-height: calc(var(--teaching-tip-height) - 88px); }
.teaching-tip-container.hero-top .teaching-tip-hero-content-border { border-radius: var(--teaching-tip-radius, 8px) var(--teaching-tip-radius, 8px) 0 0; }
.teaching-tip-container.hero-bottom .teaching-tip-hero-content-border { border-radius: 0 0 var(--teaching-tip-radius, 8px) var(--teaching-tip-radius, 8px); }
.teaching-tip-hero-content-border .win-image-host { max-width: 100%; }
.teaching-tip-hero-content-border .win-image { max-width: 100%; }
.teaching-tip-non-hero-content-root-grid { position: relative; min-width: 0; min-height: 0; }
.teaching-tip-scroll-viewer { min-width: 0; min-height: 0; max-height: calc(var(--teaching-tip-height) - 18px); }
.teaching-tip-scroll-viewer .win-scroll-viewer-viewport { min-width: 0; }
.teaching-tip-title { color: var(--TeachingTipTitleForegroundBrush, var(--TextFillColorPrimaryBrush)); }
.teaching-tip-subtitle { color: var(--TeachingTipSubtitleForegroundBrush, var(--TextFillColorPrimaryBrush)); }
.teaching-tip-main-content-presenter { min-width: 0; max-width: 100%; overflow: hidden; }
.teaching-tip-presenter-text { overflow-wrap: anywhere; white-space: normal; }
.teaching-tip-action-button, .teaching-tip-close-button { min-width: 0; white-space: normal; overflow-wrap: anywhere; }
.teaching-tip-alternate-close-button { position: absolute; right: 0; top: 0; }
.teaching-tip-alternate-close-button.win-btn { background: transparent; border-color: transparent; box-shadow: none; }
.teaching-tip-alternate-close-button.win-btn:hover { background: transparent; border-color: transparent; }
.teaching-tip-alternate-close-button.win-btn::after {
  content: ''; position: absolute; inset: 4px; pointer-events: none; border: 1px solid transparent; border-radius: var(--ControlCornerRadius, 4px);
}
.teaching-tip-alternate-close-button.win-btn:hover::after { background: var(--TeachingTipAlternateCloseButtonBackgroundPointerOver, var(--SubtleFillColorSecondaryBrush)); border-color: var(--TeachingTipAlternateCloseButtonBorderBrushPointerOver, transparent); }
.teaching-tip-alternate-close-button.win-btn:active::after { background: var(--TeachingTipAlternateCloseButtonBackgroundPressed, var(--SubtleFillColorTertiaryBrush)); border-color: var(--TeachingTipAlternateCloseButtonBorderBrushPressed, transparent); }
.teaching-tip-alternate-close-button.win-btn:active { color: var(--TeachingTipAlternateCloseButtonForegroundPressed, var(--TextFillColorSecondaryBrush)); }
.teaching-tip-alternate-close-button.win-btn > * { position: relative; z-index: 1; }
.teaching-tip-tail-polygon { position: absolute; z-index: 1; overflow: visible; pointer-events: none; fill: var(--teaching-tip-background); stroke: var(--teaching-tip-border); stroke-width: 1; }
.teaching-tip-tail-polygon polygon { stroke: none; }
.teaching-tip-tail-polygon polyline { fill: none; }
.tail-top .teaching-tip-tail-polygon { top: -1px; left: var(--teaching-tip-tail-x); width: 20px; height: 10px; transform: translateX(-50%); }
.tail-bottom .teaching-tip-tail-polygon { bottom: -1px; left: var(--teaching-tip-tail-x); width: 20px; height: 10px; transform: translateX(-50%); }
.tail-left .teaching-tip-tail-polygon { left: -1px; top: var(--teaching-tip-tail-y); width: 10px; height: 20px; transform: translateY(-50%); }
.tail-right .teaching-tip-tail-polygon { right: -1px; top: var(--teaching-tip-tail-y); width: 10px; height: 20px; transform: translateY(-50%); }
</style>
