<template>
  <span ref="anchorRef" class="flyout-anchor" aria-hidden="true"></span>
  <Teleport :to="teleportTarget">
    <div
      v-if="isOpen && showMode === 'Standard'"
      ref="dismissLayerRef"
      class="flyout-dismiss-layer"
      :class="{ 'overlay-visible': overlayVisible }"
      :style="boundsStyle"
      @pointerdown="onLightDismiss"></div>
    <div
      v-if="isPresent"
      ref="presenterRef"
      class="flyout-presenter"
      :class="[themeClass, { 'is-positioning': !isPositioned, 'is-closing': !isOpen }]"
      :style="presenterStyle"
      v-acrylic-brush.host-backdrop="presenterBackgroundStyle"
      v-theme-shadow="{ Translation: 32, Theme: effectiveTheme, Enabled: enabled(presenterSetters.IsDefaultShadowEnabled) }"
      role="dialog"
      :aria-label="automationName || undefined"
      tabindex="-1"
      @pointerdown.stop>
      <PresenterOutlet>
        <ScrollViewer
          class="flyout-scroll-viewer"
          ZoomMode="Disabled"
          HorizontalScrollMode="{x:Bind ScrollSettings.HorizontalScrollMode, Mode=OneWay}"
          HorizontalScrollBarVisibility="{x:Bind ScrollSettings.HorizontalScrollBarVisibility, Mode=OneWay}"
          VerticalScrollMode="{x:Bind ScrollSettings.VerticalScrollMode, Mode=OneWay}"
          VerticalScrollBarVisibility="{x:Bind ScrollSettings.VerticalScrollBarVisibility, Mode=OneWay}"
          IsTabStop="False">
          <div ref="contentMountRef" class="flyout-content-mount"></div>
        </ScrollViewer>
      </PresenterOutlet>
    </div>
  </Teleport>
  <Teleport :to="contentHost">
    <div class="flyout-content-presenter" :style="contentStyle">
      <ContentOutlet />
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const FlyoutContent = defineComponent({
  name: 'Flyout.Content',
  __flyoutProperty: 'Content',
  setup() { return () => null; }
});

const FlyoutPresenterStyle = defineComponent({
  name: 'Flyout.FlyoutPresenterStyle',
  __flyoutProperty: 'FlyoutPresenterStyle',
  setup() { return () => null; }
});

export default { Content: FlyoutContent, FlyoutPresenterStyle };
</script>

<script setup lang="ts">
import { computed, Fragment, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, onUpdated, provide, ref, shallowReactive, shallowRef, unref, useAttrs, useSlots, watch, type CSSProperties, type PropType, type Ref, type VNode } from 'vue';
import ScrollViewer from './ScrollViewer.vue';
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlResourceObject, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime';
import { fitPopupPosition, popupBoundsFor, popupPlacementPosition, resolvePopupElement, type PopupBounds } from './popupRuntime';
import { cssLength, xamlThickness } from './layout';
import { useAcrylicBrushStyle } from './AcrylicBrush';
import { xamlThemeKey } from './brushCore';
import { vAcrylicBrush } from './acrylicBrushVisual';
import { vThemeShadow } from './themeShadowVisual';
import { flyoutInputContextKey, flyoutContainsNode, hasOpenDescendantFlyout, hideDescendantFlyouts, isDescendantFlyoutOpening, nestedFlyoutLayers, registerFlyoutInputRegion, type FlyoutInputRegion } from './flyoutInput';

defineOptions({ name: 'Flyout', inheritAttrs: false });

const props = defineProps({
  Content: { type: null as unknown as PropType<unknown>, default: undefined as unknown },
  Placement: { type: String, default: 'Top' },
  ShowMode: { type: String, default: 'Standard' },
  LightDismissOverlayMode: { type: String, default: 'Auto' },
  AreOpenCloseAnimationsEnabled: { type: [Boolean, String], default: true },
  ShouldConstrainToRootBounds: { type: [Boolean, String], default: true },
  AllowFocusOnInteraction: { type: [Boolean, String], default: true },
  AllowFocusWhenDisabled: { type: [Boolean, String], default: false },
  FlyoutPresenterStyle: { type: null as unknown as PropType<unknown>, default: undefined as unknown }
});

const emit = defineEmits(['Opening', 'Opened', 'Closing', 'Closed', 'update:Content', 'update:Placement', 'update:ShowMode', 'update:LightDismissOverlayMode', 'update:AreOpenCloseAnimationsEnabled', 'update:ShouldConstrainToRootBounds', 'update:AllowFocusOnInteraction', 'update:AllowFocusWhenDisabled', 'update:FlyoutPresenterStyle']);
const instance = getCurrentInstance();
const attrs = useAttrs();
const slots = useSlots();
const resolve = (value: unknown) => resolveXamlValue(value, instance);
const overrides = shallowReactive<Partial<Record<keyof typeof props, unknown>>>({});
const hasOverride = (name: keyof typeof props) => name in overrides;
const propertyValue = (name: keyof typeof props) => hasOverride(name) ? overrides[name] : resolve(props[name]);
const dependencyProperty = (name: keyof typeof props) => computed({
  get: () => propertyValue(name),
  set: (value: unknown) => {
    overrides[name] = value;
    updateXamlBinding(props[name], value, instance);
    emit(`update:${name}` as 'update:Content', value);
  }
});
const exposedProperties = Object.fromEntries((Object.keys(props) as (keyof typeof props)[]).filter(name => name !== 'Content').map(name => [name, dependencyProperty(name)]));
for (const name of Object.keys(props) as (keyof typeof props)[]) watch(() => resolve(props[name]), () => { delete overrides[name]; });
const enabled = (value: unknown) => resolve(value) !== false && resolve(value) !== 'False';
const anchorRef = ref<HTMLElement | null>(null);
const presenterRef = ref<HTMLElement | null>(null);
const dismissLayerRef = ref<HTMLElement | null>(null);
const contentMountRef = ref<HTMLElement | null>(null);
const contentHost = document.createElement('div');
contentHost.className = 'flyout-content-host';
contentHost.style.display = 'none';
const buttonAnchor = inject<Ref<HTMLElement | null> | null>('buttonFlyoutAnchor', null);
type FlyoutApi = { ShowAt: typeof ShowAt; Hide: typeof Hide; readonly IsOpen: boolean; readonly Target: HTMLElement | null };
const buttonController = inject<Ref<FlyoutApi | null> | null>('buttonFlyoutController', null);
const inheritedTheme = inject<string | Ref<string> | null>(xamlThemeKey, null) ?? inject<string | Ref<string> | null>('winuiTheme', null);
const isOpen = ref(false);
const isPresent = ref(false);
const isPositioned = ref(false);
const target = ref<HTMLElement | null>(null);
// Keep Teleport's anchors in one host while fullscreen changes its DOM parent.
const portalHost = typeof document === 'undefined' ? null : document.createElement('div');
if (portalHost) portalHost.className = 'flyout-portal-host';
const teleportTarget = portalHost || 'body';
const placement = ref('Top');
const showOptions = ref<{ Placement?: string; ShowMode?: string; Position?: { X?: number; Y?: number; x?: number; y?: number } } | null>(null);
const bounds = ref<PopupBounds>({ left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 });
const position = ref({ left: 0, top: 0 });
const nestedLayers = ref<{ overlay: number; presenter: number } | null>(null);
const showMode = computed(() => String(showOptions.value?.ShowMode || propertyValue('ShowMode') || 'Standard') === 'Auto' ? 'Standard' : String(showOptions.value?.ShowMode || propertyValue('ShowMode') || 'Standard'));
const overlayVisible = computed(() => String(propertyValue('LightDismissOverlayMode')) === 'On');
const automationName = computed(() => String(resolve(attrs['AutomationProperties.Name']) ?? ''));
const themeRevision = ref(0);
const effectiveTheme = computed(() => {
  themeRevision.value;
  const inherited = String(unref(inheritedTheme) || '').toLowerCase();
  const scope = target.value?.closest('[data-theme], .win-theme-scope, .example-theme-wrapper, .theme-light, .theme-dark');
  const explicit = scope?.getAttribute('data-theme')?.toLowerCase();
  return explicit === 'light' || explicit === 'dark' ? explicit : scope?.classList.contains('theme-dark') ? 'dark' : scope?.classList.contains('theme-light') ? 'light' : inherited;
});
provide(xamlThemeKey, effectiveTheme);
const themeClass = computed(() => effectiveTheme.value === 'light' || effectiveTheme.value === 'dark' ? `win-theme-scope theme-${effectiveTheme.value}` : '');
const boundsStyle = computed(() => ({ left: `${bounds.value.left}px`, top: `${bounds.value.top}px`, width: `${bounds.value.width}px`, height: `${bounds.value.height}px`, zIndex: nestedLayers.value?.overlay }));
const childrenOf = (node: VNode): VNode[] => Array.isArray(node.children) ? node.children as VNode[] : (node.children as { default?: () => VNode[] })?.default?.() ?? [];
// Presenter settings are observed during setup as well as rendering. Retain
// the declaration tree here, and evaluate its slot only in ContentOutlet.
const propertyNodes = shallowRef<VNode[]>([]);
const presenterSetters = computed<Record<string, unknown>>(() => {
  const marker = propertyNodes.value.find(node => (node.type as { __flyoutProperty?: string })?.__flyoutProperty === 'FlyoutPresenterStyle');
  const values: Record<string, unknown> = {};
  if (marker && !hasOverride('FlyoutPresenterStyle')) {
    for (const style of childrenOf(marker)) {
      for (const setter of childrenOf(style)) {
        if (typeof setter.props?.Property === 'string') values[setter.props.Property] = resolve(setter.props.Value);
      }
    }
    return values;
  }
  const source = hasOverride('FlyoutPresenterStyle') ? overrides.FlyoutPresenterStyle : props.FlyoutPresenterStyle;
  const key = typeof source === 'string' ? source.match(/^\{(?:StaticResource|ThemeResource)\s+([^}]+)\}$/)?.[1] : '';
  const style = key ? resolveXamlResourceObject(key, instance) : resolve(source);
  if (!style || typeof style !== 'object') return values;
  const object = style as { Setters?: Array<{ Property: string; Value: unknown }> };
  return Array.isArray(object.Setters) ? Object.fromEntries(object.Setters.map(setter => [setter.Property, resolve(setter.Value)])) : style as Record<string, unknown>;
});
const scrollSettings = computed(() => ({
  HorizontalScrollMode: presenterSetters.value['ScrollViewer.HorizontalScrollMode'] ?? 'Auto',
  HorizontalScrollBarVisibility: presenterSetters.value['ScrollViewer.HorizontalScrollBarVisibility'] ?? 'Auto',
  VerticalScrollMode: presenterSetters.value['ScrollViewer.VerticalScrollMode'] ?? 'Auto',
  VerticalScrollBarVisibility: presenterSetters.value['ScrollViewer.VerticalScrollBarVisibility'] ?? 'Auto'
}));
const inheritedTemplateScope = inject<Record<string, unknown>>(xamlScopeKey, {});
provide(xamlScopeKey, { ...inheritedTemplateScope, ScrollSettings: scrollSettings });
const PresenterOutlet = defineComponent({
  name: 'FlyoutPresenterOutlet',
  setup(_, { slots }) {
    const owner = getCurrentInstance();
    return () => h(Fragment, normalizeXamlNodes(slots.default?.() ?? [], owner));
  }
});
const contentStyle = computed<CSSProperties>(() => ({
  margin: presenterSetters.value.Padding === undefined ? undefined : xamlThickness(presenterSetters.value.Padding),
  display: 'flex', flexDirection: 'column',
  alignItems: ({ Left: 'flex-start', Center: 'center', Right: 'flex-end', Stretch: 'stretch' } as Record<string, string>)[String(presenterSetters.value.HorizontalContentAlignment ?? 'Stretch')],
  justifyContent: ({ Top: 'flex-start', Center: 'center', Bottom: 'flex-end', Stretch: 'flex-start' } as Record<string, string>)[String(presenterSetters.value.VerticalContentAlignment ?? 'Stretch')]
}));
const presenterBackgroundStyle = useAcrylicBrushStyle(() => presenterSetters.value.Background ?? '{ThemeResource FlyoutPresenterBackground}', instance);
// This native surface is FlyoutPresenter's Border template child, the target
// of ApplyElevationEffect in FlyoutPresenter_partial.cpp (default Z = 32).
const presenterStyle = computed(() => {
  const style: CSSProperties & Record<string, unknown> = {
  ...presenterBackgroundStyle.value,
  left: `${position.value.left}px`, top: `${position.value.top}px`,
  zIndex: nestedLayers.value?.presenter,
  '--flyout-available-width': `${Math.max(0, bounds.value.width - 8)}px`,
  '--flyout-available-height': `${Math.max(0, bounds.value.height - 8)}px`,
  width: placement.value === 'Full' ? `${Math.max(0, bounds.value.width - 8)}px` : undefined,
  height: placement.value === 'Full' ? `${Math.max(0, bounds.value.height - 8)}px` : undefined
  };
  const setters = presenterSetters.value;
  if (setters.Margin !== undefined) style.margin = xamlThickness(resolve(setters.Margin));
  for (const [property, cssProperty] of Object.entries({ Foreground: 'color', BorderBrush: 'borderColor' })) {
    if (setters[property] !== undefined) style[cssProperty] = resolve(setters[property]);
  }
  if (setters.BorderThickness !== undefined) style.borderWidth = xamlThickness(setters.BorderThickness);
  if (setters.CornerRadius !== undefined) style.borderRadius = cssLength(setters.CornerRadius);
  for (const property of ['Width', 'Height', 'MinWidth', 'MinHeight', 'MaxWidth', 'MaxHeight']) {
    if (setters[property] === undefined) continue;
    const cssProperty = property[0].toLowerCase() + property.slice(1);
    const value = cssLength(resolve(setters[property]));
    style[cssProperty] = property.includes('Width') ? `min(${value}, var(--flyout-available-width))` : `min(${value}, var(--flyout-available-height))`;
  }
  return style;
});

const contentNodes = computed(() => {
  if (hasOverride('Content') || props.Content !== undefined) {
    const content = propertyValue('Content');
    return isVNode(content) ? normalizeXamlNodes([content], instance) : [];
  }
  const children = propertyNodes.value;
  const property = children.find(node => (node.type as { __flyoutProperty?: string })?.__flyoutProperty === 'Content');
  const propertySlot = (property?.children as { default?: () => typeof children } | undefined)?.default;
  return normalizeXamlNodes(propertySlot ? propertySlot() : children.filter(node => !(node.type as { __flyoutProperty?: string })?.__flyoutProperty), instance);
});
const ContentOutlet = defineComponent({
  name: 'FlyoutContentPresenterOutlet',
  setup() {
    return () => {
      propertyNodes.value = slots.default?.() ?? [];
      return contentNodes.value.length
      ? h(Fragment, contentNodes.value)
      : h(Fragment, typeof propertyValue('Content') === 'string' || typeof propertyValue('Content') === 'number' ? [String(propertyValue('Content'))] : []);
    };
  }
});
const retainedContent = shallowRef<unknown>(null);
let adoptedContent: HTMLElement | null = null;
const synchronizeContent = () => {
  const presenter = contentHost.querySelector('.flyout-content-presenter');
  if (!presenter) return;
  const content = propertyValue('Content');
  const element = resolvePopupElement(content);
  if (adoptedContent && adoptedContent !== element && adoptedContent.parentElement === presenter) adoptedContent.remove();
  adoptedContent = element;
  if (element && element.parentElement !== presenter) presenter.appendChild(element);
  retainedContent.value = hasOverride('Content') || props.Content !== undefined ? content : presenter.firstElementChild;
};
const publicContent = computed({
  get: () => hasOverride('Content') || props.Content !== undefined ? propertyValue('Content') : retainedContent.value,
  set: (value: unknown) => {
    if (value !== null && !isVNode(value) && !resolvePopupElement(value)) throw new TypeError('Flyout.Content must be a UIElement or null');
    overrides.Content = value;
    updateXamlBinding(props.Content, value, instance);
    emit('update:Content', value);
  }
});
const mountContent = () => {
  const host = contentMountRef.value || portalHost;
  if (host && contentHost.parentElement !== host) host.appendChild(contentHost);
  contentHost.style.display = contentMountRef.value ? 'contents' : 'none';
  synchronizeContent();
};

let generation = 0;
let animations: Animation[] = [];
let resizeObserver: ResizeObserver | null = null;
let themeObserver: MutationObserver | null = null;
let viewportFrame: number | null = null;
let previousFocus: HTMLElement | null = null;
let boundButton: HTMLElement | null = null;
let unmounted = false;
let isOpening = false;
let openingHasMotion = false;
let suppressStationaryHover = false;
let mousePosition: { pointerId: number; x: number; y: number } | null = null;
const realMouseMoves = new WeakSet<PointerEvent>();
const recordMousePosition = (event: PointerEvent) => {
  if (event.pointerType !== 'mouse') return;
  const moved = mousePosition?.pointerId === event.pointerId
    ? mousePosition.x !== event.clientX || mousePosition.y !== event.clientY
    : event.movementX !== 0 || event.movementY !== 0;
  mousePosition = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  if (event.type === 'pointermove' && moved) {
    realMouseMoves.add(event);
    if (!isOpening) suppressStationaryHover = false;
  }
};
provide(flyoutInputContextKey, {
  allowsHover: (event) => event.pointerType !== 'mouse'
    || realMouseMoves.has(event)
    || (!isOpening && !suppressStationaryHover)
});

const api: FlyoutApi = {
  ShowAt, Hide,
  get IsOpen() { return isOpen.value; },
  get Target() { return target.value; }
};
Object.defineProperty(api, 'Content', { enumerable: true, get: () => publicContent.value, set: (value: unknown) => { publicContent.value = value; } });
for (const [name, value] of Object.entries(exposedProperties)) Object.defineProperty(api, name, { enumerable: true, get: () => value.value, set: (next: unknown) => { value.value = next; } });
Object.defineProperty(api, 'IsConstrainedToRootBounds', { enumerable: true, get: () => enabled(propertyValue('ShouldConstrainToRootBounds')) });
const inputRegion: FlyoutInputRegion = {
  Owner: api,
  get IsOpen() { return isOpen.value; },
  get Target() { return target.value; },
  get Presenter() { return presenterRef.value; },
  get DismissLayer() { return dismissLayerRef.value; },
  Hide
};
const unregisterInputRegion = registerFlyoutInputRegion(inputRegion);

const raise = (event: 'Opening' | 'Opened' | 'Closing' | 'Closed', args: Record<string, unknown> = {}) => {
  const listeners = instance?.vnode.props?.[`on${event}`];
  for (const listener of Array.isArray(listeners) ? listeners : listeners ? [listeners] : []) {
    if (typeof listener === 'function') listener(api, args);
  }
  resolveXamlHandler(attrs[event], instance)?.(api, args);
};

const changeOpen = (value: boolean) => {
  isOpen.value = value;
};

const stopAnimations = () => {
  for (const animation of animations) animation.cancel();
  animations = [];
};

// FlyoutBase uses PopupThemeTransition with a 50 DIP offset toward its target.
const animate = (opening: boolean, initial?: { opacity: string; transform: string }) => {
  const element = presenterRef.value;
  if (!element || !enabled(propertyValue('AreOpenCloseAnimationsEnabled')) || window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof element.animate !== 'function') return Promise.resolve();
  const offset = placement.value.startsWith('Top') ? '0, 50px'
    : placement.value.startsWith('Bottom') ? '0, -50px'
      : placement.value.startsWith('Left') ? '50px, 0'
        : placement.value.startsWith('Right') ? '-50px, 0' : '0, 0';
  if (opening) openingHasMotion = offset !== '0, 0';
  const current = getComputedStyle(element);
  const opacity = element.animate(opening ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: initial?.opacity ?? current.opacity }, { opacity: 0 }], { duration: 83, easing: 'linear', fill: 'both' });
  animations = [opacity];
  if (opening) animations.push(element.animate([{ transform: `translate(${offset})` }, { transform: 'translate(0, 0)' }], { duration: 333, easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)', fill: 'both' }));
  else if (initial?.transform && initial.transform !== 'none') animations.push(element.animate([{ transform: initial.transform }, { transform: initial.transform }], { duration: 83, fill: 'both' }));
  return Promise.all(animations.map(animation => animation.finished.catch(() => undefined))).then(() => undefined);
};

const updatePosition = async () => {
  const element = presenterRef.value;
  const placementTarget = target.value || buttonAnchor?.value || anchorRef.value?.parentElement;
  if (!element || !placementTarget) return;
  bounds.value = popupBoundsFor(placementTarget, enabled(propertyValue('ShouldConstrainToRootBounds')));
  await nextTick();
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const requested = showOptions.value?.Placement || String(propertyValue('Placement') || 'Top');
  const positioned = popupPlacementPosition(placementTarget.getBoundingClientRect(), { width, height }, requested, bounds.value, 4, getComputedStyle(placementTarget).direction === 'rtl');
  const point = showOptions.value?.Position;
  const rect = placementTarget.getBoundingClientRect();
  position.value = point ? fitPopupPosition({ left: rect.left + Number(point.X ?? point.x ?? 0), top: rect.top + Number(point.Y ?? point.y ?? 0) }, { width, height }, bounds.value) : { left: positioned.left, top: positioned.top };
  placement.value = positioned.placement;
  isPositioned.value = true;
};

const focusableElements = () => Array.from(presenterRef.value?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])') ?? []).filter(element => element.getClientRects().length > 0 && !element.closest('[inert]'));
const observeTheme = () => {
  themeObserver?.disconnect();
  const scope = target.value?.closest('[data-theme], .win-theme-scope, .example-theme-wrapper, .theme-light, .theme-dark');
  if (scope) themeObserver?.observe(scope, { attributes: true, attributeFilter: ['class', 'data-theme'] });
  if (scope !== document.documentElement) themeObserver?.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
  themeRevision.value += 1;
};

async function ShowAt(placementTarget?: unknown, options?: { Placement?: string; ShowMode?: string; Position?: { X?: number; Y?: number; x?: number; y?: number } }) {
  const resolvedTarget = resolvePopupElement(placementTarget) || buttonAnchor?.value || anchorRef.value?.parentElement || null;
  if (!resolvedTarget || unmounted) return;
  if (isOpen.value) {
    target.value = resolvedTarget;
    observeTheme();
    showOptions.value = options ?? null;
    await updatePosition();
    return;
  }
  const version = ++generation;
  stopAnimations();
  isOpening = true;
  openingHasMotion = false;
  suppressStationaryHover = true;
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  target.value = resolvedTarget;
  nestedLayers.value = nestedFlyoutLayers(inputRegion);
  mountPortalHost();
  portalHost?.parentElement?.appendChild(portalHost);
  window.dispatchEvent(new CustomEvent('winui-flyout-opening', { detail: api }));
  observeTheme();
  showOptions.value = options ?? null;
  raise('Opening');
  changeOpen(true);
  isPositioned.value = false;
  isPresent.value = true;
  await nextTick();
  mountContent();
  await updatePosition();
  if (version !== generation || !isOpen.value || unmounted) return;
  resizeObserver?.disconnect();
  if (presenterRef.value) resizeObserver?.observe(presenterRef.value);
  resizeObserver?.observe(resolvedTarget);
  if (showMode.value === 'Standard' && enabled(propertyValue('AllowFocusOnInteraction'))) (focusableElements()[0] || presenterRef.value)?.focus({ preventScroll: true });
  const finished = animate(true);
  raise('Opened');
  await finished;
  if (version === generation) {
    isOpening = false;
    // Keep the stationary mouse filtered through the browser's final boundary
    // update. The first actual movement is accepted in its capture phase.
    if (!openingHasMotion) suppressStationaryHover = false;
    stopAnimations();
  }
}

function Hide(restoreFocus = true) {
  if (!isOpen.value) return;
  const args = { Cancel: false };
  raise('Closing', args);
  if (args.Cancel) return;
  const focusedInside = flyoutContainsNode(inputRegion, document.activeElement);
  hideDescendantFlyouts(inputRegion);
  const version = ++generation;
  isOpening = false;
  suppressStationaryHover = false;
  const current = presenterRef.value ? getComputedStyle(presenterRef.value) : null;
  const initial = current ? { opacity: current.opacity, transform: current.transform } : undefined;
  stopAnimations();
  changeOpen(false);
  resizeObserver?.disconnect();
  const restore = previousFocus?.isConnected ? previousFocus : target.value;
  if (restoreFocus && focusedInside && restore?.isConnected) restore.focus({ preventScroll: true });
  void animate(false, initial).then(() => {
    if (version !== generation || isOpen.value || unmounted) return;
    stopAnimations();
    if (portalHost) portalHost.appendChild(contentHost);
    contentHost.style.display = 'none';
    isPresent.value = false;
    isPositioned.value = false;
    raise('Closed');
  });
}

const onLightDismiss = (event: PointerEvent) => { event.preventDefault(); Hide(); };
const onButtonClick = () => { void ShowAt(buttonAnchor?.value); };
const onOtherFlyoutOpening = (event: Event) => {
  const opening = (event as CustomEvent).detail;
  if (opening !== api && !isDescendantFlyoutOpening(opening, inputRegion)) Hide();
};
const onViewportChanged = () => {
  if (!isOpen.value || viewportFrame !== null) return;
  viewportFrame = requestAnimationFrame(() => { viewportFrame = null; if (isOpen.value) void updatePosition(); });
};
const onPointerDown = (event: PointerEvent) => {
  recordMousePosition(event);
  if (!isOpen.value) return;
  if (!flyoutContainsNode(inputRegion, event.target as Node) && !target.value?.contains(event.target as Node)) {
    if (showMode.value === 'Standard') event.preventDefault();
    Hide();
  }
};
const onPointerMove = (event: PointerEvent) => {
  recordMousePosition(event);
  if (!isOpen.value || showMode.value !== 'TransientWithDismissOnPointerMoveAway') return;
  if (hasOpenDescendantFlyout(inputRegion)) return;
  const presenter = presenterRef.value?.getBoundingClientRect();
  const anchor = target.value?.getBoundingClientRect();
  if (!presenter || !anchor) return;
  const margin = 40;
  if (event.clientX < Math.min(presenter.left, anchor.left) - margin || event.clientX > Math.max(presenter.right, anchor.right) + margin || event.clientY < Math.min(presenter.top, anchor.top) - margin || event.clientY > Math.max(presenter.bottom, anchor.bottom) + margin) Hide();
};
const onKeyDown = (event: KeyboardEvent) => {
  if (!isOpen.value || hasOpenDescendantFlyout(inputRegion)) return;
  if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); Hide(); return; }
  if (event.key !== 'Tab' || showMode.value !== 'Standard') return;
  const elements = focusableElements();
  const first = elements[0];
  const last = elements[elements.length - 1];
  if (!first) { event.preventDefault(); presenterRef.value?.focus({ preventScroll: true }); }
  else if (event.shiftKey && (document.activeElement === first || !presenterRef.value?.contains(document.activeElement))) { event.preventDefault(); last.focus({ preventScroll: true }); }
  else if (!event.shiftKey && (document.activeElement === last || !presenterRef.value?.contains(document.activeElement))) { event.preventDefault(); first.focus({ preventScroll: true }); }
};
const onWindowBlur = () => Hide();
const mountPortalHost = () => {
  if (!portalHost) return;
  const parent = document.fullscreenElement || document.body;
  if (portalHost.parentElement !== parent && !portalHost.contains(parent)) parent.appendChild(portalHost);
};
const onFullscreenChanged = () => { mountPortalHost(); onViewportChanged(); };

watch(() => propertyValue('Content'), async () => { await nextTick(); synchronizeContent(); onViewportChanged(); }, { flush: 'post' });
onUpdated(mountContent);

onMounted(() => {
  mountPortalHost();
  mountContent();
  // Parse the property elements in the first render before observing setters.
  // Evaluating this watch during setup invokes the caller's slot too early.
  watch(() => [propertyValue('Placement'), propertyValue('ShowMode'), propertyValue('ShouldConstrainToRootBounds'), presenterSetters.value], onViewportChanged);
  resizeObserver = new ResizeObserver(onViewportChanged);
  themeObserver = new MutationObserver(() => { themeRevision.value += 1; });
  if (buttonController) buttonController.value = api;
  boundButton = buttonAnchor?.value ?? null;
  boundButton?.addEventListener('click', onButtonClick);
  window.addEventListener('resize', onViewportChanged);
  window.addEventListener('scroll', onViewportChanged, true);
  window.addEventListener('blur', onWindowBlur);
  window.addEventListener('winui-flyout-opening', onOtherFlyoutOpening);
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('pointermove', onPointerMove, true);
  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('fullscreenchange', onFullscreenChanged);
});

onBeforeUnmount(() => {
  hideDescendantFlyouts(inputRegion);
  unregisterInputRegion();
  unmounted = true;
  isOpening = false;
  suppressStationaryHover = false;
  mousePosition = null;
  generation += 1;
  stopAnimations();
  resizeObserver?.disconnect();
  themeObserver?.disconnect();
  if (viewportFrame !== null) cancelAnimationFrame(viewportFrame);
  if (buttonController?.value === api) buttonController.value = null;
  boundButton?.removeEventListener('click', onButtonClick);
  window.removeEventListener('resize', onViewportChanged);
  window.removeEventListener('scroll', onViewportChanged, true);
  window.removeEventListener('blur', onWindowBlur);
  window.removeEventListener('winui-flyout-opening', onOtherFlyoutOpening);
  document.removeEventListener('pointerdown', onPointerDown, true);
  document.removeEventListener('pointermove', onPointerMove, true);
  document.removeEventListener('keydown', onKeyDown, true);
  document.removeEventListener('fullscreenchange', onFullscreenChanged);
  portalHost?.remove();
});

defineExpose({ ...exposedProperties, Content: publicContent, ShowAt, Hide, IsOpen: computed(() => isOpen.value), Target: computed(() => target.value), IsConstrainedToRootBounds: computed(() => enabled(propertyValue('ShouldConstrainToRootBounds'))) });
</script>

<style>
.flyout-anchor { display: none; }
.flyout-portal-host { display: contents; }
.flyout-dismiss-layer { position: fixed; z-index: 2147482999; background: transparent; }
.flyout-dismiss-layer.overlay-visible { background: var(--SmokeFillColorDefaultBrush, rgba(0, 0, 0, 0.3)); }
.flyout-presenter {
  position: fixed;
  z-index: 2147483000;
  display: flex;
  box-sizing: border-box;
  width: max-content;
  min-width: min(var(--FlyoutThemeMinWidth, 96px), var(--flyout-available-width));
  max-width: min(var(--FlyoutThemeMaxWidth, 456px), var(--flyout-available-width));
  min-height: min(var(--FlyoutThemeMinHeight, 40px), var(--flyout-available-height));
  max-height: min(var(--FlyoutThemeMaxHeight, 758px), var(--flyout-available-height));
  overflow: visible;
  isolation: isolate;
  color: var(--TextFillColorPrimaryBrush, var(--text-primary));
  background: var(--FlyoutPresenterBackground, var(--AcrylicInAppFillColorDefaultBrush, var(--flyout-bg)));
  border: var(--FlyoutBorderThemeThickness, 1px) solid var(--FlyoutBorderThemeBrush, var(--SurfaceStrokeColorFlyoutBrush, var(--flyout-border)));
  border-radius: var(--OverlayCornerRadius, 8px);
}
.flyout-presenter.is-positioning { visibility: hidden; }
.flyout-presenter.is-closing { pointer-events: none; }
.flyout-presenter:focus { outline: none; }
.flyout-scroll-viewer { flex: 1 1 auto; min-width: 0; min-height: 0; max-height: inherit; overflow: hidden; border-radius: inherit; }
.flyout-scroll-viewer .win-scroll-viewer-viewport { height: auto; max-height: calc(var(--flyout-available-height) - 2px); }
.flyout-scroll-viewer .scroll-content { min-height: 0; }
.flyout-content-presenter { margin: var(--FlyoutContentPadding, 15px 16px 17px 16px); min-width: 0; }
.flyout-presenter .flyout-content-presenter > * { max-width: none; }
.flyout-presenter .win-hyperlink-button { max-width: none; }
</style>
