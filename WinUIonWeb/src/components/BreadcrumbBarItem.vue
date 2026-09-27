<template>
  <div
    ref="rootRef"
    v-bind="rootAttrs"
    :class="['win-breadcrumb-layout-root', attrs.class, {
      'is-current': isCurrent,
      'win-breadcrumb-ellipsis-item': isEllipsis,
      'win-breadcrumb-flyout-item': isDropDown,
      'is-crumbled': isHidden,
      'is-disabled': !isEnabled,
      'is-pointer-over': isPointerOver,
      'is-pressed': isPressed
    }]"
    :style="[attrs.style, layoutStyle]"
    role="button"
    :dir="flowDirection"
    :tabindex="tabIndex"
    :aria-label="automationName || undefined"
    :aria-disabled="isEnabled ? undefined : 'true'"
    :aria-hidden="isHidden ? 'true' : undefined"
    :aria-current="isCurrent ? 'page' : undefined"
    :inert="isHidden ? '' : undefined"
    @focusin="onGotFocus"
    @keydown="onKeyDown"
    @pointerenter="onPointerEnter"
    @pointermove="onPointerEnter"
    @pointerleave="clearPointer"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointercancel="clearPointer"
    @lostpointercapture="clearPointer"
    @click="onAccessibleClick">
    <Button
      Visibility="{x:Bind BreadcrumbButtonVisibility, Mode=OneWay}"
      class="win-breadcrumb-item-button"
      IsEnabled="{x:Bind BreadcrumbTemplate.IsEnabled, Mode=OneWay}"
      BorderThickness="{x:Bind BreadcrumbTemplate.BorderThickness, Mode=OneWay}"
      BorderBrush="{x:Bind BreadcrumbTemplate.BorderBrush, Mode=OneWay}"
      MinHeight="0"
      MinWidth="0"
      Padding="{x:Bind BreadcrumbTemplate.ContentPadding, Mode=OneWay}"
      FontFamily="{x:Bind BreadcrumbTemplate.FontFamily, Mode=OneWay}"
      FontSize="{x:Bind BreadcrumbTemplate.FontSize, Mode=OneWay}"
      FontWeight="{x:Bind BreadcrumbTemplate.FontWeight, Mode=OneWay}"
      CornerRadius="{x:Bind BreadcrumbTemplate.CornerRadius, Mode=OneWay}"
      HorizontalAlignment="Left"
      VerticalAlignment="Center"
      tabindex="-1"
      Click="BreadcrumbTemplate.OnClick">
      <TextBlock
        v-if="isEllipsis"
        class="win-breadcrumb-ellipsis-glyph icon"
        Text="&#xE712;"
        Padding="3"
        FontFamily="{ThemeResource SymbolThemeFontFamily}"
        IsTextScaleFactorEnabled="False" />
      <ContentPresenter
        v-else
        class="win-breadcrumb-item-content-presenter"
        HorizontalContentAlignment="{x:Bind BreadcrumbTemplate.HorizontalContentAlignment, Mode=OneWay}"
        VerticalContentAlignment="{x:Bind BreadcrumbTemplate.VerticalContentAlignment, Mode=OneWay}">
        <ContentOutlet />
      </ContentPresenter>
    </Button>

    <ContentPresenter
      v-if="isCurrent || isDropDown"
      :class="isDropDown ? 'win-breadcrumb-dropdown-content-presenter' : 'win-breadcrumb-current-item'"
      Padding="{x:Bind BreadcrumbTemplate.ContentPadding, Mode=OneWay}"
      CornerRadius="{x:Bind BreadcrumbTemplate.CornerRadius, Mode=OneWay}"
      HorizontalContentAlignment="{x:Bind BreadcrumbTemplate.HorizontalContentAlignment, Mode=OneWay}"
      VerticalContentAlignment="{x:Bind BreadcrumbTemplate.VerticalContentAlignment, Mode=OneWay}">
      <ContentOutlet />
    </ContentPresenter>

    <TextBlock
      v-if="!isCurrent && !isDropDown"
      class="win-breadcrumb-chevron icon"
      Text="{x:Bind BreadcrumbTemplate.ChevronGlyph, Mode=OneWay}"
      Padding="{ThemeResource BreadcrumbBarChevronPadding}"
      FontFamily="{ThemeResource SymbolThemeFontFamily}"
      FontSize="{ThemeResource BreadcrumbBarChevronFontSize}"
      IsTextScaleFactorEnabled="False"
      aria-hidden="true" />
  </div>
</template>

<script lang="ts">
import { ContentTemplate } from './breadcrumbBarTemplate'
export default { ContentTemplate }
</script>

<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, onBeforeUnmount, onMounted, provide, ref, useAttrs, useSlots, watch, type VNode } from 'vue'
import NativeButton from './Button.vue'
import ContentPresenter from './ContentPresenter.vue'
import TextBlock from './TextBlock.vue'
import { getVNodeChildren } from './CollectionProperties'
import { breadcrumbBarItemContextKey, inheritBreadcrumbTextFonts } from './breadcrumbBarTemplate'
import { frameworkLayoutStyle } from './frameworkLayout'
import { flyoutInputContextKey } from './flyoutInput'
import { xamlResourceDictionaryKey } from './Page.vue'
import { materializeXamlVNode, normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime'
import { useI18n } from './i18n/index'

defineOptions({ name: 'BreadcrumbBarItem', inheritAttrs: false })
const props = defineProps({
  Content: { default: undefined }, ContentTemplate: { default: undefined },
  IsEnabled: { type: [Boolean, String], default: true }, FlowDirection: { type: String, default: '' },
  Background: { type: [String, Object], default: '' }, BorderBrush: { type: [String, Object], default: '' },
  BorderThickness: { type: [String, Number], default: 0 }, Foreground: { type: [String, Object], default: '' },
  FontFamily: { type: String, default: '' }, FontSize: { type: [String, Number], default: '' },
  FontWeight: { type: [String, Number], default: 'Normal' }, CornerRadius: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Stretch' }, VerticalAlignment: { type: String, default: 'Center' },
  HorizontalContentAlignment: { type: String, default: 'Stretch' }, VerticalContentAlignment: { type: String, default: 'Center' },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: 0 }, MinHeight: { type: [String, Number], default: 0 },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' }, Visibility: { type: String, default: 'Visible' },
  IsTabStop: { type: [Boolean, String], default: true }
})
const emit = defineEmits(['GotFocus', 'KeyDown', 'update:Content', 'update:ContentTemplate', 'update:IsEnabled', 'update:FlowDirection'])
const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
const context = inject<any>(breadcrumbBarItemContextKey, null)
const flyoutInput = inject(flyoutInputContextKey, null)
const resources = inject<any>(xamlResourceDictionaryKey, null)
const inheritedScope = inject<Record<string, unknown>>(xamlScopeKey, {})
const { t } = useI18n()
const rootRef = ref<HTMLElement | null>(null)
// Shared Button accepts the official public properties, while this template
// resolves its TemplateBinding equivalents before handing them to Button.
// The adapter adds no element to the visual tree.
const Button = defineComponent({
  name: 'BreadcrumbBarTemplateButton',
  inheritAttrs: false,
  setup(_, { attrs: buttonAttrs, slots: buttonSlots }) {
    const buttonInstance = getCurrentInstance()
    return () => h(NativeButton, { ...Object.fromEntries(Object.entries(buttonAttrs).map(([name, value]) => {
      if (name === 'Click') return [name, resolveXamlHandler(value, buttonInstance)]
      return [name, typeof value === 'string' ? resolveXamlValue(value, buttonInstance) : value]
    })),
      IsEnabled: isEnabled.value,
      Padding: '1,3',
      BorderThickness: property('BorderThickness') || 0,
      BorderBrush: property('BorderBrush') || 'transparent',
      FontFamily: property('FontFamily') || 'var(--ContentControlThemeFontFamily, Segoe UI Variable, Segoe UI, sans-serif)',
      FontSize: property('FontSize') || 'var(--BreadcrumbBarItemThemeFontSize, var(--ControlContentThemeFontSize, 14px))',
      FontWeight: String(property('FontWeight') || 'Normal'),
      CornerRadius: property('CornerRadius') || 'var(--ControlCornerRadius, 4px)',
      Click: activate
    }, buttonSlots)
  }
})
const overrides = ref<Record<string, unknown>>({})
const resolve = (value: unknown) => resolveXamlValue(value, instance)
const property = (name: keyof typeof props) => name in overrides.value ? overrides.value[name] : resolve(props[name])
const dependencyProperty = (name: keyof typeof props) => computed({
  get: () => property(name),
  set: (value) => {
    overrides.value = { ...overrides.value, [name]: value }
    updateXamlBinding(props[name], value, instance)
    emit(`update:${name}` as 'update:Content', value)
  }
})
const Content = dependencyProperty('Content')
const ContentTemplateProperty = dependencyProperty('ContentTemplate')
const IsEnabled = dependencyProperty('IsEnabled')
const FlowDirection = dependencyProperty('FlowDirection')
for (const name of ['Content', 'ContentTemplate', 'IsEnabled', 'FlowDirection'] as const) watch(() => resolve(props[name]), () => {
  const values = { ...overrides.value }; delete values[name]; overrides.value = values
})
const isEnabled = computed(() => IsEnabled.value !== false && context?.enabled !== false)
const isCurrent = computed(() => context?.type === 'LastItem')
const isEllipsis = computed(() => context?.type === 'Ellipsis')
const isDropDown = computed(() => context?.type === 'EllipsisDropDown')
const isHidden = computed(() => Boolean(context?.hidden))
const flowDirection = computed(() => String(FlowDirection.value) === 'RightToLeft' || context?.direction === 'rtl' ? 'rtl' : 'ltr')
const tabIndex = computed(() => !isEnabled.value || isHidden.value || property('IsTabStop') === false ? -1 : context?.tabIndex ?? 0)
const automationName = computed(() => isEllipsis.value ? t('text.more') : resolve(attrs['AutomationProperties.Name']))
const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([name]) => !['class', 'style', 'Click', 'GotFocus', 'KeyDown', 'AutomationProperties.Name'].includes(name))))
const layoutStyle = computed(() => {
  const style: Record<string, unknown> = { ...frameworkLayoutStyle(props, instance) }
  // The flyout's StackPanel runs vertically, so its cross axis is horizontal.
  // VerticalAlignment still centers inline items in the horizontal repeater.
  if (isDropDown.value) style.alignSelf = style.justifySelf || 'stretch'
  delete style.background
  delete style.borderWidth
  delete style.borderColor
  const background = property('Background')
  if (background) style['--breadcrumb-background'] = background
  for (const [name, key] of [['Foreground', '--breadcrumb-item-foreground'], ['FontFamily', 'fontFamily'], ['FontSize', 'fontSize'], ['FontWeight', 'fontWeight']] as const) {
    const value = property(name)
    if (value !== '' && value !== undefined) style[key] = name === 'FontSize' && !Number.isNaN(Number(value)) ? `${value}px` : value === 'Normal' ? 'normal' : value
  }
  return style
})

const templateNodes = computed(() => {
  const source = ContentTemplateProperty.value
  const rawTemplate = 'ContentTemplate' in overrides.value ? overrides.value.ContentTemplate : props.ContentTemplate
  const key = typeof rawTemplate === 'string' ? rawTemplate.match(/^\{(?:StaticResource|ThemeResource)\s+([^}]+)\}$/)?.[1] : null
  const resource = key ? resources?.[key] : null
  if (resource) return getVNodeChildren(resource)
  if (isVNode(source)) return getVNodeChildren(source)
  if (Array.isArray(source)) return source
  const nodes = slots.default?.() ?? []
  const marker = nodes.find((node: VNode) => (node.type as any)?.__breadcrumbBarItemProperty === 'ContentTemplate' || node.type === 'BreadcrumbBarItem.ContentTemplate')
  return marker ? getVNodeChildren(marker) : nodes.filter((node: VNode) => !(node.type as any)?.__breadcrumbBarItemProperty)
})
const ContentOutlet = defineComponent({
  name: 'BreadcrumbBarItemContentPresenter',
  setup() {
    const contentInstance = getCurrentInstance()
    return () => {
      const content = Content.value
      const nodes = templateNodes.value
      if (nodes.length) return h(Fragment, normalizeXamlNodes(materializeXamlVNode(inheritBreadcrumbTextFonts(nodes), content, contentInstance) as VNode[], contentInstance))
      if (isVNode(content)) return h(Fragment, normalizeXamlNodes([content], contentInstance))
      const text = content && typeof content === 'object' && (content as any).toString === Object.prototype.toString ? '' : String(content ?? '')
      return h(TextBlock, { class: 'win-breadcrumb-item-content', Text: text, LineHeight: '20', TextWrapping: 'NoWrap' })
    }
  }
})

const activate = () => {
  if (!isEnabled.value || isHidden.value) return
  context?.activate?.()
}
const onGotFocus = (event: FocusEvent) => {
  context?.gotFocus?.(event)
  resolveXamlHandler(attrs.GotFocus, instance)?.(instance?.proxy, event)
  emit('GotFocus', instance?.proxy, event)
}
const onKeyDown = (event: KeyboardEvent) => {
  if (!isEnabled.value) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    event.stopPropagation()
    if (!event.repeat) activate()
    return
  }
  context?.keyDown?.(event)
  resolveXamlHandler(attrs.KeyDown, instance)?.(instance?.proxy, event)
  emit('KeyDown', instance?.proxy, event)
}
const isPressed = ref(false)
const isPointerOver = ref(false)
let trackedPointerId: number | null = null
const acceptsPointer = (event: PointerEvent) => {
  if (trackedPointerId !== null && trackedPointerId !== event.pointerId) return false
  trackedPointerId = event.pointerId
  return true
}
const clearPointer = (event?: PointerEvent | Event) => {
  if (event && 'pointerId' in event && trackedPointerId !== null && trackedPointerId !== event.pointerId) return
  isPressed.value = false
  isPointerOver.value = false
  trackedPointerId = null
  // BreadcrumbBar.xaml uses PointerUpThemeAnimation in Normal but never
  // applies PointerDownThemeAnimation. ThemeAnimations.cpp generates no
  // PointerUp timelines without an existing projection and transform, so
  // returning to Normal restores brushes without adding a scale animation.
}
const onPointerEnter = (event: PointerEvent) => {
  if (isDropDown.value && flyoutInput && !flyoutInput.allowsHover(event)) return
  if (!isDropDown.value || !isEnabled.value || !acceptsPointer(event)) return
  const bounds = rootRef.value?.getBoundingClientRect()
  if (bounds && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) { clearPointer(event); return }
  isPointerOver.value = true
}
const onPointerDown = (event: PointerEvent) => {
  if (!isDropDown.value || !isEnabled.value || (event.pointerType === 'mouse' && event.button !== 0) || !acceptsPointer(event)) return
  isPressed.value = true
  rootRef.value?.focus({ preventScroll: true })
}
const onPointerUp = (event: PointerEvent) => {
  if (!isDropDown.value || !isEnabled.value || !acceptsPointer(event)) return
  const bounds = rootRef.value?.getBoundingClientRect()
  const pressed = isPressed.value && (!bounds || (event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom))
  isPressed.value = false
  trackedPointerId = null
  if (pressed) activate()
}
const onAccessibleClick = (event: MouseEvent) => { if (isDropDown.value && event.detail === 0) activate() }
watch(isEnabled, (enabled) => { if (!enabled) clearPointer() })
watch(() => context?.flyoutOpen, (open) => { if (isDropDown.value && !open) clearPointer() })
onMounted(() => window.addEventListener('blur', clearPointer))
onBeforeUnmount(() => window.removeEventListener('blur', clearPointer))
provide(xamlScopeKey, { ...inheritedScope, BreadcrumbButtonVisibility: computed(() => !isCurrent.value && !isDropDown.value ? 'Visible' : 'Collapsed'), BreadcrumbTemplate: {
  get IsEnabled() { return isEnabled.value },
  get ContentPadding() { return isDropDown.value ? '0' : '1,3' },
  get BorderThickness() { return property('BorderThickness') || 0 },
  get BorderBrush() { return property('BorderBrush') || 'transparent' },
  get FontFamily() { return property('FontFamily') || 'var(--ContentControlThemeFontFamily, Segoe UI Variable, Segoe UI, sans-serif)' },
  get FontSize() { return property('FontSize') || 'var(--BreadcrumbBarItemThemeFontSize, var(--ControlContentThemeFontSize, 14px))' },
  get FontWeight() { return String(property('FontWeight') || 'Normal') },
  get CornerRadius() { return property('CornerRadius') || 'var(--ControlCornerRadius, 4px)' },
  get HorizontalContentAlignment() { return property('HorizontalContentAlignment') || 'Stretch' },
  get VerticalContentAlignment() { return property('VerticalContentAlignment') || 'Center' },
  get ChevronGlyph() { return flowDirection.value === 'rtl' ? '\uE973' : '\uE974' },
  OnClick: activate
} })
defineExpose({ Element: rootRef, Content, ContentTemplate: ContentTemplateProperty, IsEnabled, FlowDirection, Focus: () => { if (!isEnabled.value || isHidden.value) return false; rootRef.value?.focus({ preventScroll: true }); return document.activeElement === rootRef.value } })
</script>

<style scoped>
.win-breadcrumb-layout-root {
  box-sizing: border-box;
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: minmax(0, auto) auto;
  align-items: center;
  width: max-content;
  max-width: var(--breadcrumb-available-width, 100%);
  min-width: 0;
  min-height: 0;
  border: 0 solid transparent;
  border-radius: var(--ControlCornerRadius, 4px);
  color: var(--breadcrumb-item-foreground, var(--BreadcrumbBarForegroundBrush, var(--text-primary)));
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  font-size: var(--BreadcrumbBarItemThemeFontSize, var(--ControlContentThemeFontSize, 14px));
  font-weight: normal;
  line-height: 20px;
  white-space: nowrap;
  outline: none;
  user-select: none;
}
.win-breadcrumb-layout-root.is-crumbled { position: absolute; inset: 0 auto auto 0; visibility: hidden; pointer-events: none; }
.win-breadcrumb-layout-root :deep(.win-breadcrumb-item-button) {
  box-sizing: border-box;
  min-height: 0;
  height: auto;
  min-width: 0;
  max-width: 100%;
  padding: 3px 1px;
  gap: 0;
  border: 0;
  justify-content: flex-start;
  line-height: 20px;
  font: inherit;
  transition: none;
  --ButtonBorderThemeThickness: 0px;
  --ButtonBackground: var(--breadcrumb-background, var(--BreadcrumbBarBackgroundBrush, transparent));
  --ButtonBackgroundPointerOver: var(--BreadcrumbBarBackgroundBrush, transparent);
  --ButtonBackgroundPressed: var(--BreadcrumbBarBackgroundBrush, transparent);
  --ButtonBackgroundDisabled: var(--BreadcrumbBarBackgroundBrush, transparent);
  --ButtonForeground: var(--breadcrumb-item-foreground, var(--BreadcrumbBarNormalForegroundBrush, var(--text-primary)));
  --ButtonForegroundPointerOver: var(--BreadcrumbBarHoverForegroundBrush, var(--text-secondary));
  --ButtonForegroundPressed: var(--BreadcrumbBarPressedForegroundBrush, var(--text-tertiary));
  --ButtonForegroundDisabled: var(--BreadcrumbBarDisabledForegroundBrush, var(--text-disabled));
  --ButtonBorderBrush: transparent;
  --ButtonBorderBrushPointerOver: transparent;
  --ButtonBorderBrushPressed: transparent;
  --ButtonBorderBrushDisabled: transparent;
}
.win-breadcrumb-layout-root :deep(.win-breadcrumb-item-button::after) { display: none; }
.win-breadcrumb-layout-root :deep(.win-breadcrumb-item-button:focus-visible) { outline: none; }
.win-breadcrumb-layout-root:focus-visible > :deep(.win-breadcrumb-item-button),
.win-breadcrumb-layout-root:focus-visible > .win-breadcrumb-current-item { outline: 2px solid var(--focus-stroke-outer, var(--text-primary)); outline-offset: -1px; }
.win-breadcrumb-item-content-presenter,
.win-breadcrumb-current-item,
.win-breadcrumb-dropdown-content-presenter { min-width: 0; color: inherit; line-height: 20px; overflow: hidden; }
.win-breadcrumb-current-item { min-height: 26px; color: var(--BreadcrumbBarCurrentNormalForegroundBrush, var(--text-primary)); background: var(--breadcrumb-background, var(--BreadcrumbBarBackgroundBrush, transparent)); }
.win-breadcrumb-dropdown-content-presenter { font-weight: normal; }
.win-breadcrumb-layout-root.is-disabled { color: var(--BreadcrumbBarDisabledForegroundBrush, var(--text-disabled)); }
.win-breadcrumb-layout-root.is-disabled > .win-breadcrumb-current-item { color: var(--BreadcrumbBarCurrentDisabledForegroundBrush, var(--text-disabled)); }
.win-breadcrumb-item-content-presenter :deep(.win-text-block),
.win-breadcrumb-current-item :deep(.win-text-block),
.win-breadcrumb-dropdown-content-presenter :deep(.win-text-block) { color: inherit; }
.win-breadcrumb-item-content-presenter :deep(.win-breadcrumb-item-content),
.win-breadcrumb-current-item :deep(.win-breadcrumb-item-content),
.win-breadcrumb-dropdown-content-presenter :deep(.win-breadcrumb-item-content) { color: inherit; font: inherit; white-space: nowrap; }
.win-breadcrumb-chevron { padding: 0 2px; color: var(--BreadcrumbBarNormalForegroundBrush, var(--text-primary)); font-size: var(--BreadcrumbBarChevronFontSize, 12px); line-height: 20px; white-space: nowrap; }
.win-breadcrumb-ellipsis-glyph { padding: 3px; color: inherit; line-height: 20px; font-size: inherit; }
.win-breadcrumb-flyout-item {
  align-self: stretch;
  width: auto;
  max-width: none;
  grid-template-columns: minmax(0, 1fr);
  margin: 3px 5px;
  padding: 7px 11px 9px;
  background: var(--BreadcrumbBarEllipsisDropDownItemBackground, transparent);
  touch-action: pan-y;
}
.win-breadcrumb-flyout-item.is-pointer-over:not(.is-disabled) { color: var(--BreadcrumbBarEllipsisDropDownItemForegroundPointerOver, var(--text-primary)); background: var(--BreadcrumbBarEllipsisDropDownItemBackgroundPointerOver, var(--subtle-secondary)); }
.win-breadcrumb-flyout-item.is-pressed:not(.is-disabled) { color: var(--BreadcrumbBarEllipsisDropDownItemForegroundPressed, var(--text-primary)); background: var(--BreadcrumbBarEllipsisDropDownItemBackgroundPressed, var(--subtle-tertiary)); }
.win-breadcrumb-flyout-item.is-disabled { color: var(--BreadcrumbBarEllipsisDropDownItemForegroundDisabled, var(--text-disabled)); background: var(--BreadcrumbBarEllipsisDropDownItemBackgroundDisabled, transparent); }
.win-breadcrumb-flyout-item:focus-visible { outline: 2px solid var(--focus-stroke-outer, var(--text-primary)); outline-offset: -3px; }
</style>
