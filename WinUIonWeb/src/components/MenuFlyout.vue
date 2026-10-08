<template>
  <span ref="anchor" class="win-menu-flyout-anchor" aria-hidden="true"></span>
  <MenuFlyoutPresenter ref="presenter" :Owner="owner"><ItemsOutlet /></MenuFlyoutPresenter>
</template>

<script lang="ts">
import { MenuFlyoutItemsProperty, MenuFlyoutPresenterStyleProperty } from './MenuFlyoutItems'
export default { Items: MenuFlyoutItemsProperty, MenuFlyoutPresenterStyle: MenuFlyoutPresenterStyleProperty, __menuFlyoutDefinition: true }
</script>

<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, onBeforeUnmount, onMounted, proxyRefs, ref, shallowReactive, shallowRef, useAttrs, useSlots, watch, type PropType, type Ref, type VNode, type WritableComputedRef } from 'vue'
import MenuFlyoutPresenter from './MenuFlyoutPresenter'
import { getVNodeChildren } from './CollectionProperties'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlResourceObject, resolveXamlValue, updateXamlBinding } from './xamlRuntime'
import { resolvePopupElement } from './popupRuntime'

defineOptions({ name: 'MenuFlyout', inheritAttrs: false })
const props = defineProps({
  Items: { type: null as unknown as PropType<unknown>, default: undefined as unknown }, MenuFlyoutPresenterStyle: { type: null as unknown as PropType<unknown>, default: undefined as unknown },
  Placement: { type: String, default: 'Bottom' }, ShowMode: { type: String, default: 'Standard' },
  LightDismissOverlayMode: { type: String, default: 'Auto' }, AreOpenCloseAnimationsEnabled: { type: [Boolean, String], default: true },
  ShouldConstrainToRootBounds: { type: [Boolean, String], default: true }, AllowFocusOnInteraction: { type: [Boolean, String], default: true },
  AllowFocusWhenDisabled: { type: [Boolean, String], default: false }, OverlayInputPassThroughElement: { type: null as unknown as PropType<unknown>, default: undefined as unknown }
})
const emit = defineEmits(['Opening', 'Opened', 'Closing', 'Closed', 'update:Items', 'update:MenuFlyoutPresenterStyle', 'update:Placement', 'update:ShowMode', 'update:LightDismissOverlayMode', 'update:AreOpenCloseAnimationsEnabled', 'update:ShouldConstrainToRootBounds', 'update:AllowFocusOnInteraction', 'update:AllowFocusWhenDisabled', 'update:OverlayInputPassThroughElement'])
const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
const anchor = ref<HTMLElement | null>(null)
const presenter = ref<any>(null)
const buttonAnchor = inject<Ref<HTMLElement | null> | null>('buttonFlyoutAnchor', null)
const buttonController = inject<Ref<any> | null>('buttonFlyoutController', null)
const overrides = shallowReactive<Record<string, unknown>>({})
const value = (name: keyof typeof props) => name in overrides ? overrides[name] : resolveXamlValue(props[name], instance)
const dependency = (name: keyof typeof props) => computed({ get: () => value(name), set: next => { overrides[name] = next; updateXamlBinding(props[name], next, instance); emit(`update:${name}`, next) } })
const dependencies = Object.fromEntries(Object.keys(props).filter(name => name !== 'Items').map(name => [name, dependency(name as keyof typeof props)])) as {
  [Name in Exclude<keyof typeof props, 'Items'>]: WritableComputedRef<unknown>
}
for (const name of Object.keys(props) as (keyof typeof props)[]) watch(() => resolveXamlValue(props[name], instance), () => { delete overrides[name] })
// Evaluate the declaration slot only from its render outlet. Presenter options
// are also observed outside rendering and must read the saved object tree.
const propertyNodes = shallowRef<VNode[]>([])
const marker = (node: VNode) => (node.type as { __menuFlyoutProperty?: string })?.__menuFlyoutProperty
const nodes = computed(() => {
  if ('Items' in overrides || props.Items !== undefined) {
    const source = value('Items')
    return normalizeXamlNodes(Array.isArray(source) ? source.filter(isVNode) : isVNode(source) ? [source] : [], instance)
  }
  const explicit = propertyNodes.value.find(node => marker(node) === 'Items')
  return normalizeXamlNodes(explicit ? getVNodeChildren(explicit) : propertyNodes.value.filter(node => !marker(node)), instance)
})
const ItemsOutlet = defineComponent({ name: 'MenuFlyoutItemsOutlet', setup() { return () => { propertyNodes.value = slots.default?.() ?? []; return h(Fragment, nodes.value) } } })
const style = computed<Record<string, unknown>>(() => {
  const explicit = propertyNodes.value.find(node => marker(node) === 'MenuFlyoutPresenterStyle')
  if (explicit && !('MenuFlyoutPresenterStyle' in overrides)) {
    const settings: Record<string, unknown> = {}
    for (const styleNode of getVNodeChildren(explicit)) for (const setter of getVNodeChildren(styleNode)) if (typeof setter.props?.Property === 'string') settings[setter.props.Property] = ['Background', 'SystemBackdrop'].includes(setter.props.Property) ? setter.props.Value : resolveXamlValue(setter.props.Value, instance)
    return settings
  }
  const source = value('MenuFlyoutPresenterStyle')
  const key = typeof source === 'string' ? source.match(/^\{(?:StaticResource|ThemeResource)\s+([^}]+)\}$/)?.[1] : ''
  const resource = key ? resolveXamlResourceObject(key, instance) : source
  if (!resource || typeof resource !== 'object') return {}
  const setters = (resource as any).Setters
  return Array.isArray(setters) ? Object.fromEntries(setters.map(setter => [setter.Property, ['Background', 'SystemBackdrop'].includes(setter.Property) ? setter.Value : resolveXamlValue(setter.Value, instance)])) : resource as Record<string, unknown>
})
const currentItems = () => presenter.value?.Items ?? []
const replaceItems = (next: unknown) => { overrides.Items = next; updateXamlBinding(props.Items, next, instance); emit('update:Items', next) }
const editableNodes = () => 'Items' in overrides || props.Items !== undefined ? [...(Array.isArray(value('Items')) ? value('Items') as VNode[] : [])] : [...nodes.value]
const requireItem = (item: unknown) => {
  if (!isVNode(item) || !(item.type as { __menuFlyoutItem?: boolean })?.__menuFlyoutItem) throw new TypeError('MenuFlyout.Items accepts MenuFlyoutItemBase elements.')
  return item
}
// Items is an observable WinUI item collection, with the same item objects
// returned from click events. Mutations update the live presenter declaration.
const collectionMethods = {
  GetAt: (index: number) => currentItems()[index],
  Add: (item: unknown) => { const next = editableNodes(); next.push(requireItem(item)); replaceItems(next) },
  Append: (item: unknown) => { collectionMethods.Add(item) },
  InsertAt: (index: number, item: unknown) => { const next = editableNodes(); next.splice(index, 0, requireItem(item)); replaceItems(next) },
  SetAt: (index: number, item: unknown) => { const next = editableNodes(); next.splice(index, 1, requireItem(item)); replaceItems(next) },
  RemoveAt: (index: number) => { const next = editableNodes(); next.splice(index, 1); replaceItems(next) },
  RemoveAtEnd: () => { const next = editableNodes(); next.pop(); replaceItems(next) },
  Clear: () => replaceItems([]),
  IndexOf: (item: unknown) => currentItems().indexOf(item),
  ReplaceAll: (items: unknown[]) => replaceItems(items.map(requireItem))
}
const collection = new Proxy(collectionMethods, {
  get(target, key) {
    if (key === 'Count' || key === 'Size' || key === 'length') return currentItems().length
    if (key === Symbol.iterator) return function* () { yield* currentItems() }
    if (key in target) return target[key as keyof typeof target]
    const items = currentItems()
    const member = items[key as keyof typeof items]
    return typeof member === 'function' ? member.bind(items) : member
  }
})
const itemCollection = computed({ get: () => collection, set: replaceItems })
async function ShowAt(target?: unknown, options?: Record<string, unknown>) {
  const placementTarget = resolvePopupElement(target) || buttonAnchor?.value || anchor.value?.parentElement
  if (placementTarget) await presenter.value?.ShowAt(placementTarget, options)
}
function Hide(restoreFocus = true) { presenter.value?.Hide(restoreFocus) }
const api = proxyRefs({ ...dependencies, Items: itemCollection, ShowAt, Hide, IsOpen: computed(() => presenter.value?.IsOpen ?? false), Target: computed(() => presenter.value?.Target ?? null), IsConstrainedToRootBounds: computed(() => value('ShouldConstrainToRootBounds') !== false && value('ShouldConstrainToRootBounds') !== 'False') })
const raise = (name: 'Opening' | 'Opened' | 'Closing' | 'Closed', args: Record<string, unknown> = {}) => {
  // Dispatch the case-sensitive WinUI event name directly. Vue's emit warns
  // when a PascalCase single-word event is bound to its own onOpened listener.
  const listeners = instance?.vnode.props?.[`on${name}`]
  for (const listener of Array.isArray(listeners) ? listeners : listeners ? [listeners] : []) if (typeof listener === 'function') listener(api, args)
  resolveXamlHandler(attrs[name], instance)?.(api, args)
}
const owner = { Api: api, Hide, Raise: raise, Options: () => ({ ...Object.fromEntries(Object.keys(props).filter(name => !['Items', 'MenuFlyoutPresenterStyle'].includes(name)).map(name => [name, value(name as keyof typeof props)])), PresenterStyle: style.value }) }
const onButtonClick = () => { void ShowAt(buttonAnchor?.value) }
if (buttonAnchor) watch(buttonAnchor, (next, previous) => { previous?.removeEventListener('click', onButtonClick); next?.addEventListener('click', onButtonClick) }, { immediate: true })
onMounted(() => { if (buttonController) buttonController.value = api })
onBeforeUnmount(() => { buttonAnchor?.value?.removeEventListener('click', onButtonClick); if (buttonController?.value === api) buttonController.value = null })
defineExpose({ ...dependencies, Items: itemCollection, ShowAt, Hide, IsOpen: computed(() => presenter.value?.IsOpen ?? false), Target: computed(() => presenter.value?.Target ?? null), IsConstrainedToRootBounds: computed(() => value('ShouldConstrainToRootBounds') !== false && value('ShouldConstrainToRootBounds') !== 'False') })
</script>

<style>
.win-menu-flyout-anchor { display: none; }
.win-menu-flyout-portal { position: absolute; width: 0; height: 0; pointer-events: none; }
.win-menu-flyout-dismiss-layer { position: fixed; z-index: var(--win-menu-flyout-overlay-z-index, 10000); pointer-events: auto; }
.win-menu-flyout-dismiss-layer.is-visible { background: var(--MenuFlyoutLightDismissOverlayBackground, rgba(0, 0, 0, .35)); }
.win-menu-flyout-presenter {
  position: fixed; z-index: var(--win-menu-flyout-z-index, 10001); box-sizing: border-box; width: max-content;
  min-width: min(var(--FlyoutThemeMinWidth, 96px), var(--menu-flyout-available-width));
  min-height: min(var(--MenuFlyoutThemeMinHeight, 32px), var(--menu-flyout-available-height));
  max-width: var(--menu-flyout-available-width); max-height: var(--menu-flyout-available-height);
  display: flex; flex-direction: column; overflow: visible;
  border: 1px solid var(--MenuFlyoutPresenterBorderBrush, var(--SurfaceStrokeColorFlyoutBrush, var(--stroke-flyout)));
  border-radius: var(--OverlayCornerRadius, 8px); background: transparent; isolation: isolate;
  color: var(--MenuFlyoutItemForeground, var(--text-primary));
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  font-size: var(--ControlContentThemeFontSize, 14px); font-weight: 400; line-height: 20px;
  pointer-events: auto; outline: none; transform-origin: center;
}
.win-menu-flyout-material-layer { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: -1; }
.win-menu-submenu-presenter { z-index: var(--win-menu-flyout-submenu-z-index, 10002); }
.win-menu-flyout-presenter.is-positioning { visibility: hidden; }
.win-menu-flyout-presenter.is-closing { pointer-events: none; }
.win-menu-flyout-scroll { margin: var(--menu-flyout-padding, 2px 0); box-sizing: border-box; width: auto; min-width: 0; max-width: 100%; max-height: var(--menu-flyout-max-content-height); flex: 1 1 auto; overflow: hidden; border-radius: inherit; }
.win-menu-flyout-scroll > .win-scroll-viewer-viewport { height: auto; max-height: inherit; }
.win-menu-flyout-scroll .scroll-content { width: 100%; min-width: 100%; display: flex; flex-direction: column; align-items: stretch; }
.win-menu-flyout-items-presenter { width: 100%; min-width: 0; display: flex; flex-direction: column; align-items: stretch; }
.win-menu-flyout-item {
  box-sizing: border-box; flex: 0 0 auto; width: auto; min-width: 0; align-self: stretch;
  margin: var(--MenuFlyoutItemMargin, 2px 4px); padding: 4px 11px 5px; display: flex; align-items: center;
  border: 0 solid transparent; border-radius: var(--ControlCornerRadius, 4px);
  background: var(--menu-item-background, var(--MenuFlyoutItemBackground, transparent));
  color: var(--menu-item-foreground, var(--MenuFlyoutItemForeground, var(--text-primary)));
  cursor: default; font: inherit; text-align: start; white-space: nowrap; appearance: none; user-select: none; -webkit-tap-highlight-color: transparent;
}
.win-menu-flyout-item.is-pointer-over:not(.is-disabled):not(.is-split), .win-menu-flyout-item.is-open:not(.is-disabled):not(.is-split) { background: var(--MenuFlyoutItemBackgroundPointerOver, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary))); color: var(--MenuFlyoutItemForegroundPointerOver, var(--text-primary)); }
.win-menu-flyout-item.is-pressed:not(.is-disabled):not(.is-split) { background: var(--MenuFlyoutItemBackgroundPressed, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary))); color: var(--MenuFlyoutItemForegroundPressed, var(--text-primary)); }
.win-menu-flyout-item.is-disabled { background: var(--MenuFlyoutItemBackgroundDisabled, transparent); color: var(--MenuFlyoutItemForegroundDisabled, var(--text-disabled)); }
.win-menu-flyout-item.is-subitem { background: var(--menu-item-background, var(--MenuFlyoutSubItemBackground, transparent)); color: var(--menu-item-foreground, var(--MenuFlyoutSubItemForeground, var(--text-primary))); }
.win-menu-flyout-item.is-subitem.is-pointer-over:not(.is-disabled) { background: var(--MenuFlyoutSubItemBackgroundPointerOver, var(--subtle-secondary)); color: var(--MenuFlyoutSubItemForegroundPointerOver, var(--text-primary)); }
.win-menu-flyout-item.is-subitem.is-open:not(.is-disabled) { background: var(--MenuFlyoutSubItemBackgroundSubMenuOpened, var(--subtle-secondary)); color: var(--MenuFlyoutSubItemForegroundSubMenuOpened, var(--text-primary)); }
.win-menu-flyout-item.is-subitem.is-pressed:not(.is-disabled) { background: var(--MenuFlyoutSubItemBackgroundPressed, var(--subtle-tertiary)); color: var(--MenuFlyoutSubItemForegroundPressed, var(--text-primary)); }
.win-menu-flyout-item.is-subitem.is-disabled { background: var(--MenuFlyoutSubItemBackgroundDisabled, transparent); color: var(--MenuFlyoutSubItemForegroundDisabled, var(--text-disabled)); }
.win-menu-flyout-item.is-toggle.is-pointer-over:not(.is-disabled), .win-menu-flyout-item.is-radio.is-pointer-over:not(.is-disabled) { background: var(--MenuFlyoutSubItemBackgroundPointerOver, var(--subtle-secondary)); }
.win-menu-flyout-item.is-toggle.is-pressed:not(.is-disabled), .win-menu-flyout-item.is-radio.is-pressed:not(.is-disabled) { background: var(--MenuFlyoutSubItemBackgroundPressed, var(--subtle-tertiary)); color: var(--MenuFlyoutSubItemForegroundPressed, var(--text-primary)); }
.win-menu-flyout-item.is-toggle.is-disabled, .win-menu-flyout-item.is-radio.is-disabled { color: var(--MenuFlyoutSubItemForegroundDisabled, var(--text-disabled)); }
.win-menu-flyout-item:focus-visible, .win-menu-flyout-split-primary:focus-visible, .win-menu-flyout-split-secondary:focus-visible { outline: 2px solid var(--SystemControlFocusVisualPrimaryBrush, var(--accent-base)); outline-offset: -2px; }
.win-menu-flyout-item:focus:not(:focus-visible) { outline: none; }
.win-menu-flyout-label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: clip; line-height: 20px; }
.win-menu-flyout-check-slot { width: 12px; min-width: 12px; margin-inline-end: 16px; display: flex; align-items: center; justify-content: center; color: var(--MenuFlyoutSubItemChevron, var(--text-secondary)); opacity: 0; }
.win-menu-flyout-check-slot.is-checked { opacity: 1; }
.win-menu-flyout-item.is-disabled .win-menu-flyout-check-slot { color: var(--text-disabled); }
.win-menu-flyout-icon-viewbox { display: inline-flex; width: 16px; min-width: 16px; height: 16px; margin-inline-end: 12px; align-items: center; justify-content: center; overflow: hidden; }
.win-menu-flyout-icon-content { width: 20px; height: 20px; flex: 0 0 20px; display: flex; align-items: center; justify-content: center; transform: scale(.8); transform-origin: center; }
.win-menu-flyout-icon-content > * { color: inherit; }
.win-menu-flyout-accelerator { flex: 0 0 auto; margin: 4px 0 0 24px; font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif); font-size: 12px; font-weight: 400; line-height: 16px; text-align: end; color: var(--MenuFlyoutItemKeyboardAcceleratorTextForeground, var(--text-secondary)); }
.win-menu-flyout-accelerator.is-toggle-accelerator { margin-top: 0; }
.win-menu-flyout-item.is-disabled .win-menu-flyout-accelerator { color: var(--MenuFlyoutItemKeyboardAcceleratorTextForegroundDisabled, var(--text-disabled)); }
.win-menu-flyout-chevron { flex: 0 0 auto; margin: 0 0 -1px 24px; color: var(--MenuFlyoutSubItemChevron, var(--text-secondary)); pointer-events: none; }
.win-menu-flyout-item.is-pressed .win-menu-flyout-chevron { color: var(--MenuFlyoutSubItemChevronPressed, var(--text-tertiary)); }
.win-menu-flyout-item.is-disabled .win-menu-flyout-chevron { color: var(--MenuFlyoutSubItemChevronDisabled, var(--text-disabled)); }
.win-menu-flyout-item.is-split { position: relative; display: block; background: transparent; overflow: hidden; }
.win-menu-flyout-item.is-split.is-open, .win-menu-flyout-item.is-split.is-disabled { background: transparent; }
.win-menu-flyout-split-primary, .win-menu-flyout-split-secondary { position: absolute; top: 0; bottom: 0; padding: 0; border: 0; color: inherit; background: transparent; font: inherit; }
.win-menu-flyout-split-primary { inset-inline-start: 0; inset-inline-end: var(--SplitMenuFlyoutItemChevronButtonWidth, 38px); border-radius: inherit; }
.win-menu-flyout-split-secondary { inset-inline-end: 0; width: var(--SplitMenuFlyoutItemChevronButtonWidth, 38px); border-radius: 0 4px 4px 0; }
.win-menu-flyout-item.is-split[dir="rtl"] .win-menu-flyout-split-secondary { border-radius: 4px 0 0 4px; }
.win-menu-flyout-item[data-visual-state="PrimaryPointerOver"] .win-menu-flyout-split-primary,
.win-menu-flyout-item[data-visual-state="SecondaryPointerOver"] .win-menu-flyout-split-secondary { background: var(--MenuFlyoutItemBackgroundPointerOver, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary))); }
.win-menu-flyout-item[data-visual-state="PrimaryPressed"] .win-menu-flyout-split-primary,
.win-menu-flyout-item[data-visual-state="SecondaryPressed"] .win-menu-flyout-split-secondary { background: var(--MenuFlyoutItemBackgroundPressed, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary))); }
.win-menu-flyout-item[data-visual-state="SubMenuOpened"] .win-menu-flyout-split-secondary { background: var(--MenuFlyoutSubItemBackgroundSubMenuOpened, var(--subtle-secondary)); }
.win-menu-flyout-item[data-visual-state="Disabled"] .win-menu-flyout-split-primary,
.win-menu-flyout-item[data-visual-state="Disabled"] .win-menu-flyout-split-secondary { background: var(--MenuFlyoutItemBackgroundDisabled, transparent); }
.win-menu-flyout-item[data-visual-state="PrimaryPointerOver"] .win-menu-flyout-label,
.win-menu-flyout-item[data-visual-state="PrimaryPointerOver"] .win-menu-flyout-icon-content { color: var(--MenuFlyoutItemForegroundPointerOver, var(--text-primary)); }
.win-menu-flyout-item[data-visual-state="PrimaryPressed"] .win-menu-flyout-label,
.win-menu-flyout-item[data-visual-state="PrimaryPressed"] .win-menu-flyout-icon-content { color: var(--MenuFlyoutItemForegroundPressed, var(--text-primary)); }
.win-menu-flyout-item[data-visual-state="SecondaryPointerOver"] .win-menu-flyout-chevron { color: var(--MenuFlyoutSubItemChevronPointerOver, var(--text-secondary)); }
.win-menu-flyout-item[data-visual-state="SecondaryPressed"] .win-menu-flyout-chevron { color: var(--MenuFlyoutSubItemChevronPressed, var(--text-tertiary)); }
.win-menu-flyout-item[data-visual-state="SubMenuOpened"] .win-menu-flyout-chevron { color: var(--MenuFlyoutSubItemChevronSubMenuOpened, var(--text-secondary)); }
.win-menu-flyout-split-content { position: relative; display: flex; align-items: center; pointer-events: none; }
.win-menu-flyout-split-divider { position: absolute; top: 50%; inset-inline-end: var(--SplitMenuFlyoutItemChevronButtonWidth, 38px); width: 1px; height: var(--SplitMenuFlyoutItemSeparatorHeight, 18px); transform: translateY(-50%); background: var(--SplitMenuFlyoutItemButtonDividerBrush, var(--stroke-divider)); pointer-events: none; }
</style>
