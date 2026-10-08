<template>
  <span ref="anchor" class="commandbar-flyout-anchor" aria-hidden="true"></span>
  <DeclarationOutlet />
  <Teleport to="body">
    <div v-show="isPresent" ref="flyout" class="win-commandbar-flyout" :class="[themeClass, { 'is-positioning': !positioned, 'is-closing': !isOpen, 'is-expanded': expandedPresent, 'is-expanding': suppressShadow, 'has-primary': primaryCommands.length > 0, 'has-primary-labels': hasPrimaryLabels, 'expands-up': expandsUp }]" :style="flyoutStyle" :data-theme="theme" role="menu" tabindex="-1" @keydown="onKeyDown" @pointerdown.stop>
      <div class="win-cbf-layout-root"><div class="win-cbf-outer-content-root"><div class="win-cbf-content-root">
        <div v-show="primaryCommands.length || showMore" ref="primaryRoot" class="win-cbf-primary-items-root" v-acrylic-backdrop="[flyoutBackdropStyle, flyoutBackgroundStyle]" v-theme-shadow="{ Translation: 32, Theme: theme, Enabled: isOpen && primaryCommands.length > 0 && !suppressShadow }">
          <div class="win-cbf-material-layer" data-menu-material="PrimaryItemsSystemBackdropRoot" :style="flyoutBackdropStyle" v-acrylic-brush.no-backdrop="flyoutBackdropStyle" aria-hidden="true"></div>
          <div class="win-cbf-material-layer" data-menu-material="Background" :style="flyoutBackgroundStyle" v-acrylic-brush.no-backdrop="flyoutBackgroundStyle" aria-hidden="true"></div>
          <div ref="primaryMount" class="win-cbf-primary-items-control" role="toolbar"></div>
          <button v-if="showMore" v-bind="moreButtonAttributes" class="commandbar-more-button win-cbf-more-button" type="button" tabindex="-1" :aria-label="moreButtonLabel" :aria-expanded="expanded" @pointerdown.prevent @click="setExpanded(!expanded)">
            <span class="commandbar-ellipsis-content"><span class="commandbar-ellipsis-icon" aria-hidden="true">&#xE712;</span></span>
          </button>
        </div>
        <div v-show="expandedPresent" ref="overflowRoot" class="win-cbf-outer-overflow-content-root" v-acrylic-backdrop="[flyoutBackdropStyle, flyoutBackgroundStyle]" v-theme-shadow="{ Translation: 32, Theme: theme, Enabled: isPresent && expandedPresent && (!primaryCommands.length || !expandsUp) }">
          <div class="win-cbf-overflow-content-root">
            <div class="win-cbf-material-layer" data-menu-material="OverflowPopupSystemBackdropRoot" :style="flyoutBackdropStyle" v-acrylic-brush.no-backdrop="flyoutBackdropStyle" aria-hidden="true"></div>
            <div class="win-cbf-material-layer" data-menu-material="Background" :style="flyoutBackgroundStyle" v-acrylic-brush.no-backdrop="flyoutBackgroundStyle" aria-hidden="true"></div>
            <div ref="secondaryMount" class="win-cbf-secondary-items-control" role="menu"></div>
          </div>
        </div>
      </div></div></div>
      <CommandPortal v-for="entry in entries" :key="entry.id" :node="entry.node" :host="entry.host" :overflow="entry.secondary || overflowIds.has(entry.id)" :context="commonContext" />
    </div>
  </Teleport>
</template>

<script lang="ts">
import { commandBarProperty } from './commandBarRuntime';
export default {
  PrimaryCommands: commandBarProperty('CommandBarFlyout', 'PrimaryCommands'),
  SecondaryCommands: commandBarProperty('CommandBarFlyout', 'SecondaryCommands')
};
</script>

<script setup lang="ts">
import { computed, defineComponent, getCurrentInstance, inject, isVNode, nextTick, onBeforeUnmount, onMounted, onUpdated, provide, ref, shallowReactive, shallowRef, unref, useAttrs, useSlots, watch, type Ref, type VNode } from 'vue';
import { CommandPortal, commandChildren, commandCollection, commandHasIcon, flattenCommandNodes, isAppBarCommand, isCommandSeparator, isCommandToggle } from './commandBarRuntime';
import type { CommandBarContext } from './appBarRuntime';
import { resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlControlIdentityKey } from './xamlRuntime';
import { fitPopupPosition, popupBoundsFor, popupPlacementPosition, resolvePopupElement } from './popupRuntime';
import { flyoutContainsNode, hasOpenDescendantFlyout, hideDescendantFlyouts, isDescendantFlyoutOpening, nestedFlyoutLayers, registerFlyoutInputRegion, type FlyoutInputRegion } from './flyoutInput';
import { useI18n } from './i18n';
import './commandBarResources.css';
import { useAcrylicBrushStyle } from './AcrylicBrush';
import { vAcrylicBackdrop, vAcrylicBrush } from './acrylicBrushVisual';
import { vThemeShadow } from './themeShadowVisual';
import { getThemeShadowRecipe } from './themeShadowRuntime';
import { xamlThemeKey } from './brushCore';

defineOptions({ name: 'CommandBarFlyout', inheritAttrs: false });
const props = defineProps({
  PrimaryCommands: { default: undefined }, SecondaryCommands: { default: undefined }, AlwaysExpanded: { type: [Boolean, String], default: false },
  Placement: { type: String, default: 'Top' }, ShowMode: { type: String, default: 'Standard' },
  AreOpenCloseAnimationsEnabled: { type: [Boolean, String], default: true }, ShouldConstrainToRootBounds: { type: [Boolean, String], default: true },
  LightDismissOverlayMode: { type: String, default: 'Auto' }
});
const emit = defineEmits(['Opening', 'Opened', 'Closing', 'Closed', 'update:PrimaryCommands', 'update:SecondaryCommands', 'update:AlwaysExpanded', 'update:Placement', 'update:ShowMode', 'update:AreOpenCloseAnimationsEnabled', 'update:ShouldConstrainToRootBounds', 'update:LightDismissOverlayMode']);
const instance = getCurrentInstance(); const attrs = useAttrs(); const slots = useSlots(); const { t } = useI18n();
const resolve = (input: unknown) => resolveXamlValue(input, instance);
const enabled = (input: unknown) => input !== false && input !== 'False' && input !== 'false';
const overrides = shallowReactive<Record<string, unknown>>({});
const value = (name: keyof typeof props) => name in overrides ? overrides[name] : resolve(props[name]);
const primaryCommands = commandCollection(shallowReactive<VNode[]>([])); const secondaryCommands = commandCollection(shallowReactive<VNode[]>([])); const initialized = new Set<string>();
const lastDeclarations = new Map<string, VNode[]>();
const anchor = ref<HTMLElement | null>(null); const flyout = ref<HTMLElement | null>(null); const primaryRoot = ref<HTMLElement | null>(null); const overflowRoot = ref<HTMLElement | null>(null);
const primaryMount = ref<HTMLElement | null>(null); const secondaryMount = ref<HTMLElement | null>(null);
type Entry = { id: number; node: VNode; host: HTMLElement; secondary: boolean; width: number };
const retainedEntries = new Map<number, Entry>(); const nodeIds = new WeakMap<object, number>(); let nextId = 0;
const overflowIds = shallowRef(new Set<number>());
const overflowDivider = document.createElement('div'); overflowDivider.className = 'commandbar-overflow-divider'; overflowDivider.setAttribute('role', 'separator');
const entries = computed(() => [...primaryCommands.map(node => entryFor(node, false)), ...secondaryCommands.map(node => entryFor(node, true))]);
function entryFor(node: VNode, secondary: boolean): Entry {
  let id = nodeIds.get(node); if (id === undefined) { id = ++nextId; nodeIds.set(node, id); }
  let entry = retainedEntries.get(id);
  if (!entry) {
    const host = document.createElement('div'); host.className = 'commandbar-command-host';
    entry = { id, node, host, secondary, width: isCommandSeparator(node) ? 5 : Number(resolve(node.props?.Width)) || 40 }; retainedEntries.set(id, entry);
  }
  entry.secondary = secondary; return entry;
}
const overflowNodes = computed(() => entries.value.filter(entry => entry.secondary || overflowIds.value.has(entry.id)).map(entry => entry.node));
const target = ref<HTMLElement | null>(null); const isOpen = ref(false); const isPresent = ref(false); const positioned = ref(false);
const expanded = ref(false); const expandedPresent = ref(false); const expandsUp = ref(false); const position = ref({ left: 0, top: 0 });
const hasPrimaryLabels = ref(false);
const suppressShadow = ref(false);
const moreButtonLabel = computed(() => t(expanded.value ? 'text.see-less' : 'text.see-more'));
const moreButtonAttributes = computed(() => ({ 'ToolTipService.ToolTip': moreButtonLabel.value }));
const available = ref({ width: 0, height: 0 });
type ShowOptions = { Placement?: string; ShowMode?: string; Position?: { X?: number; Y?: number; x?: number; y?: number } };
const options = ref<ShowOptions | null>(null); const actualPlacement = ref('Top');
const inheritedTheme = inject<string | Ref<string> | null>(xamlThemeKey, null) ?? inject<string | Ref<string> | null>('winuiTheme', null); const themeRevision = ref(0);
const buttonAnchor = inject<Ref<HTMLElement | null> | null>('buttonFlyoutAnchor', null);
const buttonController = inject<Ref<Record<string, unknown> | null> | null>('buttonFlyoutController', null);
const showMode = computed(() => enabled(value('AlwaysExpanded')) ? 'Standard' : String(options.value?.ShowMode || value('ShowMode')));
const showMore = computed(() => primaryCommands.length > 0 && overflowNodes.value.length > 0 && !enabled(value('AlwaysExpanded')));
const theme = computed(() => {
  themeRevision.value;
  const scope = target.value?.closest('[data-theme], .win-theme-scope, .example-theme-wrapper, .theme-light, .theme-dark');
  const explicit = scope?.getAttribute('data-theme')?.toLowerCase();
  return explicit === 'light' || explicit === 'dark' ? explicit : scope?.classList.contains('theme-dark') ? 'dark' : scope?.classList.contains('theme-light') ? 'light' : String(unref(inheritedTheme) || '').toLowerCase();
});
const themeClass = computed(() => theme.value === 'light' || theme.value === 'dark' ? `win-theme-scope theme-${theme.value}` : '');
provide(xamlThemeKey, theme);
provide('winuiTheme', theme);
const flyoutLayer = ref<number | undefined>(undefined);
const flyoutBackgroundStyle = useAcrylicBrushStyle('{ThemeResource CommandBarFlyoutBackground}', instance);
const flyoutBackdropStyle = useAcrylicBrushStyle('{StaticResource CommandBarFlyoutSystemBackdrop}', instance);
const flyoutStyle = computed(() => {
  const shadowInsets = getThemeShadowRecipe(32, theme.value).Insets;
  return { zIndex: flyoutLayer.value, left: `${position.value.left}px`, top: `${position.value.top}px`, '--cbf-available-width': `${available.value.width}px`, '--cbf-available-height': `${available.value.height}px`, '--cbf-shadow-top-inset': `${shadowInsets.Top}px`, '--cbf-shadow-bottom-inset': `${shadowInsets.Bottom}px` };
});
const commonContext: CommandBarContext = {
  isOpen, defaultLabelPosition: computed(() => hasPrimaryLabels.value ? 'Bottom' : 'Collapsed'), compact: computed(() => true), isInOverflow: computed(() => false), isInFlyout: computed(() => true),
  hasIcons: computed(() => overflowNodes.value.some(commandHasIcon)), hasToggleButtons: computed(() => overflowNodes.value.some(isCommandToggle)),
  closeOverflow: () => Hide(), invokeCommand: () => Hide()
};
const DeclarationOutlet = defineComponent({
  name: 'CommandBarFlyoutDeclarationOutlet',
  setup() { return () => {
    const nodes = flattenCommandNodes(slots.default?.() ?? []);
    for (const name of ['PrimaryCommands', 'SecondaryCommands'] as const) {
      const explicit = resolve(props[name]); const property = nodes.find(node => (node.type as { __commandBarProperty?: string }).__commandBarProperty === name);
      const commands = Array.isArray(explicit) ? explicit.filter(isVNode) : flattenCommandNodes(property ? commandChildren(property) : name === 'PrimaryCommands' ? nodes.filter(isAppBarCommand) : []);
      const previous = lastDeclarations.get(name);
      const signature = (node: VNode) => JSON.stringify(Object.entries(node.props || {}).filter(([, input]) => input === null || ['string', 'number', 'boolean'].includes(typeof input)));
      if (!initialized.has(name) || !previous || previous.length !== commands.length || commands.some((node, index) => node.type !== previous[index].type || node.key !== previous[index].key || signature(node) !== signature(previous[index]))) {
        const collection = name === 'PrimaryCommands' ? primaryCommands : secondaryCommands;
        collection.splice(0, collection.length, ...commands); initialized.add(name); lastDeclarations.set(name, commands);
      }
    }
    return null;
  }; }
});

const api: Record<string, unknown> = { ShowAt, Hide };
const inputRegion: FlyoutInputRegion = {
  Owner: api,
  get IsOpen() { return isOpen.value; },
  get Target() { return target.value; },
  get Presenter() { return flyout.value; },
  DismissLayer: null,
  Hide
};
const unregisterInputRegion = registerFlyoutInputRegion(inputRegion);
const raise = (name: 'Opening' | 'Opened' | 'Closing' | 'Closed', args: Record<string, unknown> = {}) => {
  const listener = instance?.vnode.props?.[`on${name}`];
  if (listener) {
    for (const handler of Array.isArray(listener) ? listener : [listener]) handler(api, args);
  } else {
    emit(name, api, args);
    resolveXamlHandler(attrs[name], instance)?.(api, args);
  }
};
let generation = 0; let expandGeneration = 0; let positionGeneration = 0; let animations: Animation[] = []; let expansionAnimations: Animation[] = [];
let resizeObserver: ResizeObserver | null = null; let themeObserver: MutationObserver | null = null; let commandObserver: MutationObserver | null = null; let viewportFrame: number | null = null;
let previousFocus: HTMLElement | null = null; let boundButton: HTMLElement | null = null; let unmounted = false; let lastInsidePointer = 0;
const stopAnimations = () => { animations.forEach(animation => animation.cancel()); animations = []; };
const expansionElements = () => ({ primary: primaryRoot.value, secondary: overflowRoot.value, more: primaryRoot.value?.querySelector<HTMLElement>('.win-cbf-more-button') ?? null });
const stopExpansion = (clearVisuals = true) => {
  expansionAnimations.forEach(animation => animation.cancel()); expansionAnimations = [];
  if (!clearVisuals) return;
  const elements = expansionElements();
  elements.primary?.style.removeProperty('clip-path'); elements.secondary?.style.removeProperty('clip-path'); elements.more?.style.removeProperty('transform');
};
const freezeExpansion = () => {
  const elements = expansionElements();
  const sample = expansionAnimations.length ? {
    primaryClip: elements.primary ? getComputedStyle(elements.primary).clipPath : 'none',
    secondaryClip: elements.secondary ? getComputedStyle(elements.secondary).clipPath : 'none',
    moreTransform: elements.more ? getComputedStyle(elements.more).transform : 'none'
  } : null;
  stopExpansion(!sample);
  if (sample) {
    elements.primary?.style.setProperty('clip-path', sample.primaryClip);
    elements.secondary?.style.setProperty('clip-path', sample.secondaryClip);
    elements.more?.style.setProperty('transform', sample.moreTransform);
  }
  return sample;
};
const collapsedPrimaryWidth = () => {
  if (!primaryRoot.value || !primaryMount.value) return 0;
  const mountStyle = getComputedStyle(primaryMount.value), rootStyle = getComputedStyle(primaryRoot.value);
  const primaryWidth = entries.value.filter(entry => !entry.secondary && !overflowIds.value.has(entry.id)).reduce((width, entry) => {
    const element = entry.host.firstElementChild;
    if (!(element instanceof HTMLElement)) return width + entry.width;
    const style = getComputedStyle(element);
    return width + element.offsetWidth + (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0);
  }, 0);
  const moreWidth = expansionElements().more?.offsetWidth ?? 3;
  const chrome = [mountStyle.marginLeft, mountStyle.marginRight, rootStyle.borderLeftWidth, rootStyle.borderRightWidth].reduce((width, part) => width + (parseFloat(part) || 0), 0);
  return Math.min(primaryWidth + moreWidth + chrome, available.value.width, 440);
};
const animationsEnabled = () => enabled(value('AreOpenCloseAnimationsEnabled')) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const animateOpacity = (opening: boolean, initialOpacity?: string) => {
  if (!animationsEnabled()) return Promise.resolve();
  // Keep the fade on each backdrop host. A fading ancestor would isolate both
  // system backdrops from the page while opening and closing.
  animations = [primaryRoot.value, overflowRoot.value].filter((element): element is HTMLElement => Boolean(element?.animate)).map(element =>
    element.animate(opening ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: initialOpacity || getComputedStyle(element).opacity }, { opacity: 0 }], { duration: 83, easing: 'linear', fill: 'both' }));
  return Promise.all(animations.map(animation => animation.finished.catch(() => undefined))).then(() => undefined);
};
const syncPrimaryLabels = () => {
  const next = entries.value.some(entry => {
    if (entry.secondary) return false;
    const element = entry.host.querySelector<HTMLElement>('.win-appbar-button');
    return element?.dataset.labelPosition === 'Default' && Boolean(element.querySelector('.appbar-button-label')?.textContent?.trim());
  });
  if (next === hasPrimaryLabels.value) return;
  hasPrimaryLabels.value = next;
  onViewport();
};
const observeCommandFlyout = () => {
  commandObserver?.disconnect();
  if (flyout.value) commandObserver?.observe(flyout.value, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['data-label-position'] });
};
const mountCommands = () => {
  if (!primaryMount.value || !secondaryMount.value || unmounted) return;
  const focused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const ownedFocus = focused && entries.value.some(entry => entry.host.contains(focused));
  const primaryHosts: HTMLElement[] = []; const secondaryHosts: HTMLElement[] = []; let insertedDivider = false;
  const hasOverflowPrimary = entries.value.some(entry => !entry.secondary && overflowIds.value.has(entry.id));
  for (const entry of entries.value) {
    if (entry.secondary && hasOverflowPrimary && !insertedDivider) { secondaryHosts.push(overflowDivider); insertedDivider = true; }
    (entry.secondary || overflowIds.value.has(entry.id) ? secondaryHosts : primaryHosts).push(entry.host);
  }
  if (!insertedDivider) overflowDivider.remove();
  for (const [parent, hosts] of [[primaryMount.value, primaryHosts], [secondaryMount.value, secondaryHosts]] as const) {
    let cursor = parent.firstElementChild;
    for (const host of hosts) { if (host !== cursor) parent.insertBefore(host, cursor); cursor = host.nextElementSibling; }
  }
  const live = new Set(entries.value.map(entry => entry.id));
  for (const [id, entry] of retainedEntries) if (!live.has(id)) { entry.host.remove(); retainedEntries.delete(id); }
  syncPrimaryLabels();
  if (ownedFocus && focused?.isConnected && document.activeElement !== focused) {
    if (focused.getClientRects().length) focused.focus({ preventScroll: true }); else primaryRoot.value?.querySelector<HTMLElement>('.win-cbf-more-button')?.focus({ preventScroll: true });
  }
};
const calculateOverflow = () => {
  const primary = entries.value.filter(entry => !entry.secondary);
  for (const entry of primary) if (!overflowIds.value.has(entry.id)) entry.width = entry.host.firstElementChild?.getBoundingClientRect().width || entry.width;
  const next = new Set<number>(); const limit = Math.min(440, available.value.width);
  const total = primary.reduce((sum, entry) => sum + entry.width, 0);
  const requiresMore = secondaryCommands.length > 0 || total + 6 > limit;
  const width = Math.max(0, limit - (requiresMore && !enabled(value('AlwaysExpanded')) ? 44 : 0) - 6);
  let occupied = total;
  const candidates = [...primary].sort((a, b) => (Number(resolve(a.node.props?.DynamicOverflowOrder)) || Infinity) - (Number(resolve(b.node.props?.DynamicOverflowOrder)) || Infinity) || primary.indexOf(b) - primary.indexOf(a));
  for (const entry of candidates) {
    if (occupied <= width) break;
    const order = Number(resolve(entry.node.props?.DynamicOverflowOrder) || 0);
    const group = order ? primary.filter(item => Number(resolve(item.node.props?.DynamicOverflowOrder)) === order) : [entry];
    for (const item of group) if (!next.has(item.id)) { next.add(item.id); occupied -= item.width; }
  }
  if (next.size !== overflowIds.value.size || [...next].some(id => !overflowIds.value.has(id))) { overflowIds.value = next; return true; }
  return false;
};
const updatePosition = async () => {
  if (!isPresent.value || !flyout.value || !target.value) return;
  const version = ++positionGeneration; const placementTarget = target.value; const presenter = flyout.value;
  const bounds = popupBoundsFor(placementTarget, enabled(value('ShouldConstrainToRootBounds')));
  available.value = { width: Math.max(0, bounds.width - 8), height: Math.max(0, bounds.height - 8) }; await nextTick();
  if (unmounted || version !== positionGeneration || !isPresent.value || flyout.value !== presenter || target.value !== placementTarget) return;
  mountCommands();
  if (calculateOverflow()) { await nextTick(); if (unmounted || version !== positionGeneration || !isPresent.value || flyout.value !== presenter || target.value !== placementTarget) return; mountCommands(); }
  const requested = options.value?.Placement || String(value('Placement')); const rect = placementTarget.getBoundingClientRect();
  const size = { width: presenter.offsetWidth, height: presenter.offsetHeight };
  const result = popupPlacementPosition(rect, size, requested, bounds, 4, getComputedStyle(placementTarget).direction === 'rtl');
  actualPlacement.value = result.placement;
  const point = options.value?.Position;
  position.value = point ? fitPopupPosition({ left: rect.left + Number(point.X ?? point.x ?? 0), top: rect.top + Number(point.Y ?? point.y ?? 0) }, size, bounds) : { left: result.left, top: result.top };
  const primaryHeight = primaryRoot.value?.offsetHeight || 0; const secondaryHeight = overflowRoot.value?.offsetHeight || 0;
  expandsUp.value = actualPlacement.value.startsWith('Top') || (bounds.bottom - position.value.top - primaryHeight < secondaryHeight && position.value.top >= secondaryHeight);
  positioned.value = true;
};
const focusable = (root: HTMLElement | null) => Array.from(root?.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex]:not([tabindex="-1"])') ?? []).filter(element => element.getClientRects().length > 0);
async function ShowAt(placementTarget?: unknown, showOptions?: ShowOptions) {
  const element = resolvePopupElement(placementTarget) || buttonAnchor?.value || anchor.value?.parentElement || null;
  if (!element || unmounted) return;
  const version = ++generation; expandGeneration += 1; stopAnimations(); stopExpansion();
  suppressShadow.value = false;
  if (!isOpen.value) previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  target.value = element; options.value = showOptions ?? null;
  flyoutLayer.value = nestedFlyoutLayers(inputRegion)?.presenter;
  const shouldExpand = enabled(value('AlwaysExpanded')) || !primaryCommands.length || showMode.value === 'Standard';
  expanded.value = shouldExpand; expandedPresent.value = shouldExpand && overflowNodes.value.length > 0;
  themeObserver?.disconnect(); const scope = element.closest('[data-theme], .win-theme-scope, .example-theme-wrapper, .theme-light, .theme-dark');
  if (scope) themeObserver?.observe(scope, { attributes: true, attributeFilter: ['class', 'data-theme'] });
  themeObserver?.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] }); themeRevision.value += 1;
  if (isOpen.value) { await updatePosition(); return; }
  window.dispatchEvent(new CustomEvent('winui-flyout-opening', { detail: api }));
  raise('Opening'); isOpen.value = true; isPresent.value = true; positioned.value = false; await nextTick(); observeCommandFlyout(); await updatePosition();
  if (version !== generation || unmounted || !isOpen.value) return;
  resizeObserver?.disconnect(); if (flyout.value) resizeObserver?.observe(flyout.value); resizeObserver?.observe(element);
  if (showMode.value === 'Standard') (focusable(primaryRoot.value)[0] || focusable(overflowRoot.value)[0] || flyout.value)?.focus({ preventScroll: true });
  const finished = animateOpacity(true); raise('Opened'); await finished; if (version === generation) stopAnimations();
}
function Hide(restoreFocus = true) {
  if (!isOpen.value) return;
  const args = { Cancel: false }; raise('Closing', args); if (args.Cancel) return;
  const ownedFocus = flyoutContainsNode(inputRegion, document.activeElement);
  hideDescendantFlyouts(inputRegion);
  const version = ++generation; expandGeneration += 1; const opacityHost = primaryRoot.value ?? overflowRoot.value; const opacity = opacityHost ? getComputedStyle(opacityHost).opacity : undefined; stopAnimations(); freezeExpansion(); suppressShadow.value = true; isOpen.value = false; resizeObserver?.disconnect();
  if (restoreFocus && ownedFocus) (previousFocus?.isConnected ? previousFocus : target.value)?.focus({ preventScroll: true });
  void animateOpacity(false, opacity).then(() => { if (version !== generation || unmounted || isOpen.value) return; stopAnimations(); stopExpansion(); isPresent.value = false; positioned.value = false; expanded.value = false; expandedPresent.value = false; raise('Closed'); });
}
async function setExpanded(next: boolean) {
  if (!isOpen.value || next === expanded.value || enabled(value('AlwaysExpanded')) || !overflowNodes.value.length) return;
  const version = ++expandGeneration; const sample = freezeExpansion();
  suppressShadow.value = true;
  if (next) { options.value = { ...options.value, ShowMode: 'Standard' }; expandedPresent.value = true; }
  expanded.value = next; await nextTick(); await updatePosition();
  const element = flyout.value; if (!element || version !== expandGeneration) return;
  const roots = expansionElements(); const halfWidthDelta = Math.max(0, element.offsetWidth - collapsedPrimaryWidth()) / 2;
  const halfOverflowHeight = (roots.secondary?.offsetHeight || 0) / 2;
  const primaryStart = `inset(0px ${halfWidthDelta}px 0px 0px)`;
  const secondaryStart = expandsUp.value ? `inset(${halfOverflowHeight}px ${halfWidthDelta}px 0px 0px)` : `inset(0px ${halfWidthDelta}px ${halfOverflowHeight}px 0px)`;
  const expandedClip = 'inset(0px 0px 0px 0px)'; const moreStart = `translateX(${-halfWidthDelta}px)`;
  if (typeof element.animate === 'function' && animationsEnabled()) {
    const timing = { duration: next ? 250 : 167, easing: 'cubic-bezier(0, 0, 0, 1)', fill: 'both' as FillMode };
    const animateClip = (root: HTMLElement | null, initial: string, previous?: string) => root ? root.animate([{ clipPath: previous || (next ? initial : expandedClip) }, { clipPath: next ? expandedClip : initial }], timing) : null;
    const clips = [animateClip(roots.primary, primaryStart, sample?.primaryClip), animateClip(roots.secondary, secondaryStart, sample?.secondaryClip)];
    const moreAnimation = roots.more?.animate([{ transform: sample?.moreTransform || (next ? moreStart : 'translateX(0px)') }, { transform: next ? 'translateX(0px)' : moreStart }], timing);
    expansionAnimations = [...clips, moreAnimation].filter((animation): animation is Animation => Boolean(animation));
    await Promise.all(expansionAnimations.map(animation => animation.finished.catch(() => undefined)));
  }
  if (version !== expandGeneration || !isOpen.value) return;
  stopExpansion(); if (!next) expandedPresent.value = false; await nextTick(); await updatePosition();
  if (version === expandGeneration && isOpen.value) suppressShadow.value = false;
}
const onKeyDown = (event: KeyboardEvent) => {
  if (event.defaultPrevented || hasOpenDescendantFlyout(inputRegion)) return;
  if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); Hide(); return; }
  const inOverflow = overflowRoot.value?.contains(event.target as Node); const root = inOverflow ? overflowRoot.value : primaryRoot.value;
  const items = focusable(root); const index = items.indexOf(document.activeElement as HTMLElement);
  if (!inOverflow && event.key === 'ArrowDown' && overflowNodes.value.length) { event.preventDefault(); void setExpanded(true).then(() => focusable(overflowRoot.value)[0]?.focus({ preventScroll: true })); return; }
  const keys = inOverflow ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
  if ([...keys, 'Home', 'End'].includes(event.key) && items.length) { event.preventDefault(); const destination = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === keys[0] ? -1 : 1) + items.length) % items.length; items[destination].focus({ preventScroll: true }); return; }
  if (event.key === 'Tab' && showMode.value === 'Standard') {
    const all = focusable(flyout.value); const active = all.indexOf(document.activeElement as HTMLElement); if (all.length && (event.shiftKey && active <= 0 || !event.shiftKey && active === all.length - 1)) { event.preventDefault(); all[event.shiftKey ? all.length - 1 : 0].focus({ preventScroll: true }); }
  }
};
const onPointerDown = (event: PointerEvent) => {
  if (!isOpen.value) return;
  if (flyoutContainsNode(inputRegion, event.target as Node | null)) { lastInsidePointer = performance.now(); return; }
  if (target.value?.contains(event.target as Node)) return;
  Hide();
};
const onGlobalKeyDown = (event: KeyboardEvent) => {
  if (!isOpen.value || event.key !== 'Escape' || event.defaultPrevented || hasOpenDescendantFlyout(inputRegion) || flyoutContainsNode(inputRegion, event.target as Node | null)) return;
  event.preventDefault(); Hide();
};
const onViewport = () => { if (!isOpen.value || viewportFrame !== null) return; viewportFrame = requestAnimationFrame(() => { viewportFrame = null; void updatePosition(); }); };
const onWindowBlur = () => Hide();
const onOtherOpening = (event: Event) => {
  const owner = (event as CustomEvent).detail;
  if (owner !== api && !isDescendantFlyoutOpening(owner, inputRegion) && !flyoutContainsNode(inputRegion, document.activeElement) && performance.now() - lastInsidePointer > 1000) Hide();
};
const onButtonClick = () => { void ShowAt(buttonAnchor?.value); };
for (const name of Object.keys(props) as (keyof typeof props)[]) {
  if (name === 'PrimaryCommands' || name === 'SecondaryCommands') continue;
  Object.defineProperty(api, name, { enumerable: true, get: () => value(name), set: next => { overrides[name] = next; updateXamlBinding(props[name], next, instance); emit(`update:${name}`, next); onViewport(); } });
  watch(() => resolve(props[name]), () => { delete overrides[name]; onViewport(); });
}
for (const name of ['PrimaryCommands', 'SecondaryCommands'] as const) {
  const collection = name === 'PrimaryCommands' ? primaryCommands : secondaryCommands;
  Object.defineProperty(api, name, { enumerable: true, get: () => collection, set: next => { if (!Array.isArray(next) || next.some(node => !isVNode(node))) throw new TypeError(`${name} requires AppBar command elements`); collection.splice(0, collection.length, ...next); emit(`update:${name}`, collection); onViewport(); } });
  watch(() => { const source = resolve(props[name]); return Array.isArray(source) ? [...source] : undefined; }, next => { if (next) collection.splice(0, collection.length, ...next.filter(isVNode)); });
}
Object.defineProperty(api, 'IsOpen', { enumerable: true, get: () => isOpen.value }); Object.defineProperty(api, 'Target', { enumerable: true, get: () => target.value });
onMounted(() => {
  mountCommands();
  resizeObserver = new ResizeObserver(onViewport); themeObserver = new MutationObserver(() => { themeRevision.value += 1; });
  commandObserver = new MutationObserver(syncPrimaryLabels);
  if (buttonController) buttonController.value = api; boundButton = buttonAnchor?.value?.tagName === 'BUTTON' ? buttonAnchor.value : null; boundButton?.addEventListener('click', onButtonClick);
  document.addEventListener('pointerdown', onPointerDown, true); document.addEventListener('keydown', onGlobalKeyDown, true); window.addEventListener('resize', onViewport); window.addEventListener('scroll', onViewport, true); window.addEventListener('blur', onWindowBlur); window.addEventListener('winui-flyout-opening', onOtherOpening);
});
watch(() => entries.value.map(entry => entry.id), async () => { await nextTick(); if (unmounted) return; mountCommands(); onViewport(); });
watch(() => overflowNodes.value.length, async count => {
  if (!isOpen.value || unmounted) return;
  expandedPresent.value = expanded.value && count > 0;
  await nextTick(); if (!unmounted && isOpen.value) await updatePosition();
});
onUpdated(mountCommands);
onBeforeUnmount(() => {
  hideDescendantFlyouts(inputRegion); unregisterInputRegion();
  unmounted = true; generation += 1; expandGeneration += 1; positionGeneration += 1; stopAnimations(); stopExpansion(); resizeObserver?.disconnect(); themeObserver?.disconnect(); commandObserver?.disconnect(); if (viewportFrame !== null) cancelAnimationFrame(viewportFrame); retainedEntries.forEach(entry => entry.host.remove()); overflowDivider.remove();
  if (buttonController?.value === api) buttonController.value = null; boundButton?.removeEventListener('click', onButtonClick);
  document.removeEventListener('pointerdown', onPointerDown, true); document.removeEventListener('keydown', onGlobalKeyDown, true); window.removeEventListener('resize', onViewport); window.removeEventListener('scroll', onViewport, true); window.removeEventListener('blur', onWindowBlur); window.removeEventListener('winui-flyout-opening', onOtherOpening);
});
Object.defineProperty(api, xamlControlIdentityKey, { value: true });
defineExpose(api);
</script>
