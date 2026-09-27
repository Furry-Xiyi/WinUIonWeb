<template>
  <div ref="root" class="win-commandbar" :class="barClasses" :style="barStyle">
    <DeclarationOutlet />
    <Teleport :to="overlayRoot || 'body'" :disabled="!surfacePresent || !overlayRoot">
    <div ref="layoutRoot" class="commandbar-layout-root" :style="layoutStyle" v-acrylic-backdrop="surfaceBackgroundStyle" role="toolbar" :aria-label="automationName" @keydown="onKeyDown">
      <div ref="surface" class="commandbar-content-root" :style="surfaceBackgroundStyle" v-acrylic-brush.no-backdrop="surfaceBackgroundStyle">
        <div class="commandbar-content-and-primary">
          <div ref="contentRoot" class="commandbar-content-control"><ContentOutlet /></div>
          <div ref="primaryRoot" class="commandbar-primary-items-control"></div>
        </div>
        <button v-if="showMore" ref="moreButton" class="commandbar-more-button commandbar-overflow-button" type="button" :disabled="!isEnabled" :aria-label="moreLabel" v-bind="{ 'ToolTipService.ToolTip': moreLabel }" :aria-expanded="isOpen" aria-haspopup="menu" @click="setOpen(!isOpen)">
          <span class="commandbar-ellipsis-content"><span class="commandbar-ellipsis-icon" aria-hidden="true">&#xE712;</span></span>
        </button>
        <div v-if="!showMore" class="commandbar-more-column" aria-hidden="true"></div>
        <div class="commandbar-open-border" aria-hidden="true"></div>
      </div>
    </div>
    </Teleport>
    <CommandPortal v-for="entry in entries" :key="entry.id" :node="entry.node" :host="entry.host" :overflow="entry.secondary || overflowIds.has(entry.id)" :context="commandContext" />
    <Teleport to="body">
      <div v-show="surfacePresent && !isSticky" ref="dismissLayer" class="commandbar-light-dismiss-layer" aria-hidden="true" @pointerdown.prevent="setOpen(false)"></div>
      <div v-show="surfacePresent" ref="overlayRoot" class="commandbar-overlay-root" :class="[barClasses, themeClass]" :style="[barStyle, overlayStyle]"></div>
      <div v-show="overflowPresent" ref="overflowRoot" class="commandbar-overflow-content-root" :class="[themeClass, { 'is-positioning': !positioned, 'opens-up': opensUp }]" :style="overflowStyle" v-acrylic-backdrop="overflowBackgroundStyle" role="menu" @keydown="onOverflowKeyDown">
        <div class="commandbar-secondary-shadow-wrapper" v-theme-shadow="{ Translation: 32, Theme: effectiveTheme, Enabled: overflowPresent }">
          <div class="commandbar-overflow-presenter" :style="overflowBackgroundStyle" v-acrylic-brush.no-backdrop="overflowBackgroundStyle"><div class="commandbar-overflow-scroll-viewer"><div ref="secondaryRoot" class="commandbar-secondary-items-presenter"></div></div></div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { commandBarProperty } from './commandBarRuntime';
export default {
  Content: commandBarProperty('CommandBar', 'Content'),
  PrimaryCommands: commandBarProperty('CommandBar', 'PrimaryCommands'),
  SecondaryCommands: commandBarProperty('CommandBar', 'SecondaryCommands')
};
</script>

<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, onUpdated, provide, ref, shallowReactive, shallowRef, unref, useAttrs, useSlots, watch, type CSSProperties, type Ref, type VNode } from 'vue';
import { CommandPortal, commandChildren, commandCollection, commandHasIcon, flattenCommandNodes, isAppBarCommand, isCommandSeparator, isCommandToggle } from './commandBarRuntime';
import type { CommandBarContext } from './appBarRuntime';
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlControlIdentityKey } from './xamlRuntime';
import { cssLength, xamlThickness } from './layout';
import { useI18n } from './i18n';
import { flyoutContainsNode, hasOpenDescendantFlyout, hideDescendantFlyouts, registerFlyoutInputRegion, type FlyoutInputRegion } from './flyoutInput';
import './commandBarResources.css';
import { useAcrylicBrushStyle } from './AcrylicBrush';
import { xamlThemeKey } from './brushCore';
import { vAcrylicBackdrop, vAcrylicBrush } from './acrylicBrushVisual';
import { vThemeShadow } from './themeShadowVisual';

defineOptions({ name: 'CommandBar', inheritAttrs: false });
const props = defineProps({
  Content: { default: undefined }, PrimaryCommands: { default: undefined }, SecondaryCommands: { default: undefined },
  IsOpen: { type: [Boolean, String], default: false }, IsSticky: { type: [Boolean, String], default: false },
  IsEnabled: { type: [Boolean, String], default: true }, IsDynamicOverflowEnabled: { type: [Boolean, String], default: true },
  DefaultLabelPosition: { type: String, default: 'Bottom' }, ClosedDisplayMode: { type: String, default: 'Compact' },
  OverflowButtonVisibility: { type: String, default: 'Auto' }, Background: { default: undefined }, Foreground: { default: undefined },
  Padding: { default: '4,0,0,0' }, CornerRadius: { default: undefined }, HorizontalAlignment: { type: String, default: 'Stretch' }
});
const emit = defineEmits(['Opening', 'Opened', 'Closing', 'Closed', 'DynamicOverflowItemsChanging', 'update:IsOpen', 'update:IsSticky', 'update:IsEnabled', 'update:IsDynamicOverflowEnabled', 'update:DefaultLabelPosition', 'update:ClosedDisplayMode', 'update:OverflowButtonVisibility', 'update:PrimaryCommands', 'update:SecondaryCommands', 'update:Content', 'update:Background', 'update:Foreground', 'update:Padding', 'update:CornerRadius', 'update:HorizontalAlignment']);
const instance = getCurrentInstance();
const attrs = useAttrs();
const slots = useSlots();
const { t } = useI18n();
const resolve = (input: unknown) => resolveXamlValue(input, instance);
const enabled = (input: unknown) => input !== false && input !== 'False' && input !== 'false';
const overrides = shallowReactive<Record<string, unknown>>({});
const value = (name: keyof typeof props) => name in overrides ? overrides[name] : resolve(props[name]);
const root = ref<HTMLElement | null>(null);
const dismissLayer = ref<HTMLElement | null>(null);
const overlayRoot = ref<HTMLElement | null>(null);
const layoutRoot = ref<HTMLElement | null>(null);
const surface = ref<HTMLElement | null>(null);
const contentRoot = ref<HTMLElement | null>(null);
const primaryRoot = ref<HTMLElement | null>(null);
const secondaryRoot = ref<HTMLElement | null>(null);
const moreButton = ref<HTMLButtonElement | null>(null);
const overflowRoot = ref<HTMLElement | null>(null);
const isOpen = ref(enabled(resolve(props.IsOpen)));
const surfacePresent = ref(false);
const themeRevision = ref(0);
const inheritedTheme = inject<string | Ref<string> | null>(xamlThemeKey, null) ?? inject<string | Ref<string> | null>('winuiTheme', null);
const effectiveTheme = computed(() => {
  themeRevision.value;
  const scope = root.value?.closest('[data-theme], .win-theme-scope, .example-theme-wrapper, .theme-light, .theme-dark');
  const explicit = scope?.getAttribute('data-theme')?.toLowerCase();
  return explicit === 'dark' || explicit === 'light' ? explicit : scope?.classList.contains('theme-dark') ? 'dark' : scope?.classList.contains('theme-light') ? 'light' : String(unref(inheritedTheme) || '').toLowerCase();
});
provide(xamlThemeKey, effectiveTheme);
const themeClass = computed(() => effectiveTheme.value === 'light' || effectiveTheme.value === 'dark' ? `win-theme-scope theme-${effectiveTheme.value}` : '');
const surfaceBackgroundStyle = useAcrylicBrushStyle(() => surfacePresent.value ? '{ThemeResource CommandBarBackgroundOpen}' : value('Background') ?? '{ThemeResource CommandBarBackground}', instance);
const overflowBackgroundStyle = useAcrylicBrushStyle('{ThemeResource CommandBarOverflowPresenterBackground}', instance);
const overflowPresent = ref(false);
const positioned = ref(false);
const opensUp = ref(false);
const position = ref({ left: 0, top: 0 });
const anchor = ref({ left: 0, top: 0, width: 0, direction: 'ltr' });
const measuredWidth = ref(0);
const desiredWidth = ref(0);
const contentHeight = ref(64);
const closedHeight = computed(() => String(value('ClosedDisplayMode')) === 'Hidden' ? 0 : String(value('ClosedDisplayMode')) === 'Minimal' ? 24 : 48);
const verticalDelta = computed(() => closedHeight.value - contentHeight.value);
const primaryCommands = commandCollection(shallowReactive<VNode[]>([]));
const secondaryCommands = commandCollection(shallowReactive<VNode[]>([]));
const declarations = shallowRef<VNode[]>([]);
const initialized = new Set<string>();
const nodeIds = new WeakMap<object, number>();
let nextId = 0;
type Entry = { id: number; node: VNode; host: HTMLElement; secondary: boolean; width: number };
const retainedEntries = new Map<number, Entry>();
const overflowDivider = document.createElement('div');
overflowDivider.className = 'commandbar-overflow-divider';
overflowDivider.setAttribute('role', 'separator');
const overflowIds = shallowRef(new Set<number>());
const entries = computed(() => [...primaryCommands.map(node => entryFor(node, false)), ...secondaryCommands.map(node => entryFor(node, true))]);
function entryFor(node: VNode, secondary: boolean): Entry {
  let id = nodeIds.get(node);
  if (id === undefined) { id = ++nextId; nodeIds.set(node, id); }
  let entry = retainedEntries.get(id);
  if (!entry) {
    const host = document.createElement('div');
    host.className = 'commandbar-command-host';
    entry = { id, node, host, secondary, width: isCommandSeparator(node) ? 17 : 68 };
    retainedEntries.set(id, entry);
  }
  entry.secondary = secondary;
  return entry;
}
const isEnabled = computed(() => enabled(value('IsEnabled')));
const isSticky = computed(() => enabled(value('IsSticky')));
const moreLabel = computed(() => t(isOpen.value ? 'text.see-less' : 'text.see-more'));
const defaultLabelPosition = computed(() => String(value('DefaultLabelPosition')));
const compact = computed(() => !surfacePresent.value && String(value('ClosedDisplayMode')) !== 'Hidden');
const overflowNodes = computed(() => entries.value.filter(entry => entry.secondary || overflowIds.value.has(entry.id)).map(entry => entry.node));
const commandContext: CommandBarContext = {
  isOpen, isEnabled, defaultLabelPosition, compact, isInOverflow: computed(() => false),
  hasIcons: computed(() => overflowNodes.value.some(commandHasIcon)), hasToggleButtons: computed(() => overflowNodes.value.some(isCommandToggle)),
  closeOverflow: () => { if (!enabled(value('IsSticky'))) void setOpen(false); },
  invokeCommand: () => { if (!enabled(value('IsSticky'))) void setOpen(false); }
};
const showMore = computed(() => String(value('OverflowButtonVisibility')) === 'Visible' || (String(value('OverflowButtonVisibility')) !== 'Collapsed' && (primaryCommands.length > 0 || secondaryCommands.length > 0)));
const automationName = computed(() => String(resolve(attrs['AutomationProperties.Name']) || t('text.command-bar')));
const barClasses = computed(() => ({ 'is-open': surfacePresent.value, 'opens-up': opensUp.value, 'is-disabled': !isEnabled.value, 'labels-bottom': defaultLabelPosition.value === 'Bottom', 'labels-right': defaultLabelPosition.value === 'Right', 'labels-collapsed': defaultLabelPosition.value === 'Collapsed', 'closed-minimal': String(value('ClosedDisplayMode')) === 'Minimal', 'closed-hidden': String(value('ClosedDisplayMode')) === 'Hidden', 'dynamic-overflow-enabled': enabled(value('IsDynamicOverflowEnabled')) }));
const barStyle = computed<CSSProperties>(() => ({
  '--CommandBarBackground': value('Background') as string, '--CommandBarForeground': value('Foreground') as string,
  '--CommandBarCornerRadius': value('CornerRadius') === undefined ? undefined : cssLength(value('CornerRadius')),
  '--CommandBarContentPadding': xamlThickness(value('Padding')),
  '--CommandBarDesiredWidth': `${desiredWidth.value}px`,
  width: surfacePresent.value && measuredWidth.value ? `${measuredWidth.value}px` : String(value('HorizontalAlignment')) === 'Stretch' ? 'auto' : 'max-content', maxWidth: '100%',
  alignSelf: ({ Left: 'flex-start', Center: 'center', Right: 'flex-end', Stretch: 'stretch' } as Record<string, string>)[String(value('HorizontalAlignment'))],
  justifySelf: ({ Left: 'start', Center: 'center', Right: 'end', Stretch: 'stretch' } as Record<string, string>)[String(value('HorizontalAlignment'))]
}));
const overlayStyle = computed<CSSProperties>(() => ({ left: `${anchor.value.left}px`, top: `${anchor.value.top}px`, width: `${anchor.value.width}px`, height: `${contentHeight.value}px`, direction: anchor.value.direction as 'ltr' | 'rtl', '--CommandBarVerticalDelta': `${verticalDelta.value}px` }));
// AppBar measures its closed height while arranging the full content behind an animated clip.
const layoutStyle = computed<CSSProperties>(() => ({ clipPath: surfacePresent.value ? opensUp.value ? `inset(${verticalDelta.value}px 0 ${-verticalDelta.value}px 0)` : 'inset(0px 0px 0px 0px)' : `inset(0px 0px ${Math.max(0, contentHeight.value - closedHeight.value)}px 0px)` }));
const overflowStyle = computed(() => ({ left: `${position.value.left}px`, top: `${position.value.top}px`, clipPath: opensUp.value ? 'inset(-24px -16px 0px -16px)' : 'inset(0px -16px -24px -16px)', '--CommandBarOverflowAvailableWidth': `${Math.max(0, window.innerWidth - 16)}px`, '--CommandBarOverflowAvailableHeight': `${Math.max(0, window.innerHeight * 0.5)}px` }));
const collectionNodes = (name: 'PrimaryCommands' | 'SecondaryCommands', raw: VNode[]) => {
  const explicit = resolve(props[name]);
  if (Array.isArray(explicit)) return explicit.filter(isVNode);
  const property = raw.find(node => (node.type as { __commandBarProperty?: string }).__commandBarProperty === name);
  return flattenCommandNodes(property ? commandChildren(property) : name === 'PrimaryCommands' ? raw.filter(isAppBarCommand) : []);
};
const DeclarationOutlet = defineComponent({
  name: 'CommandBarDeclarationOutlet',
  setup() { return () => {
    const nodes = flattenCommandNodes(slots.default?.() ?? []);
    declarations.value = nodes;
    for (const name of ['PrimaryCommands', 'SecondaryCommands'] as const) if (!initialized.has(name)) {
      const collection = name === 'PrimaryCommands' ? primaryCommands : secondaryCommands;
      collection.push(...collectionNodes(name, nodes)); initialized.add(name);
    }
    return null;
  }; }
});
const ContentOutlet = defineComponent({
  name: 'CommandBarContentOutlet',
  setup() { return () => {
    const property = declarations.value.find(node => (node.type as { __commandBarProperty?: string }).__commandBarProperty === 'Content');
    const content = value('Content');
    const nodes = isVNode(content) ? [content] : property ? commandChildren(property) : [];
    return h(Fragment, nodes.length ? normalizeXamlNodes(nodes, instance) : typeof content === 'string' || typeof content === 'number' ? [String(content)] : []);
  }; }
});
const api: Record<string, unknown> = {};
const inputRegion = (presenter: Ref<HTMLElement | null>): FlyoutInputRegion => ({
  Owner: api, get IsOpen() { return surfacePresent.value; }, get Target() { return root.value; },
  get Presenter() { return presenter.value; }, get DismissLayer() { return isSticky.value ? null : dismissLayer.value; }, Hide() { void setOpen(false); }
});
const primaryInputRegion = inputRegion(overlayRoot);
const secondaryInputRegion = inputRegion(overflowRoot);
const unregisterPrimaryRegion = registerFlyoutInputRegion(primaryInputRegion);
const unregisterSecondaryRegion = registerFlyoutInputRegion(secondaryInputRegion);
const raise = (name: 'Opening' | 'Opened' | 'Closing' | 'Closed' | 'DynamicOverflowItemsChanging', args: Record<string, unknown> = {}) => {
  emit(name, api, args); resolveXamlHandler(attrs[name], instance)?.(api, args);
};
let generation = 0;
let animations: Animation[] = [];
let resizeObserver: ResizeObserver | null = null;
let themeObserver: MutationObserver | null = null;
let frame: number | null = null;
let unmounted = false;
const stopAnimations = () => { animations.forEach(animation => animation.cancel()); animations = []; };
type TransitionState = { clipPath?: string; contentTransform?: string; overflowTransform?: string; popupTransform?: string; overflowClip?: string };
const animateDisplayMode = (opening: boolean, initial?: TransitionState) => {
  if (!layoutRoot.value?.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return Promise.resolve();
  const options: KeyframeAnimationOptions = { duration: opening ? 250 : 167, easing: 'cubic-bezier(0, 0, 0, 1)', fill: 'both' };
  const animate = (element: HTMLElement | null | undefined, property: string, from: string, to: string) => {
    if (element) animations.push(element.animate([{ [property]: from }, { [property]: to }], options));
  };
  const delta = verticalDelta.value;
  if (opensUp.value) {
    animate(surface.value, 'transform', initial?.contentTransform || `translateY(${opening ? 0 : delta}px)`, `translateY(${opening ? delta : 0}px)`);
  } else {
    animate(layoutRoot.value, 'clipPath', initial?.clipPath || `inset(0px 0px ${opening ? -delta : 0}px 0px)`, `inset(0px 0px ${opening ? 0 : -delta}px 0px)`);
  }
  if (String(value('ClosedDisplayMode')) !== 'Compact') {
    for (const element of [primaryRoot.value, contentRoot.value]) if (element) animations.push(element.animate([{ opacity: opening ? 0 : 1 }, { opacity: opening ? 1 : 0 }], options));
  }
  if (overflowPresent.value) {
    const wrapper = overflowRoot.value?.querySelector<HTMLElement>('.commandbar-secondary-shadow-wrapper');
    const offset = opensUp.value ? '100%' : '-100%';
    // Popup's transition target owns its content, backdrop and shadow together.
    animate(wrapper, 'transform', initial?.overflowTransform || (opening ? `translateY(${offset})` : 'translateY(0)'), opening ? 'translateY(0)' : `translateY(${offset})`);
    if (opensUp.value) animate(overflowRoot.value, 'clipPath', initial?.overflowClip || `inset(${(opening ? -delta : 0) - 24}px -16px 0px -16px)`, `inset(${(opening ? 0 : -delta) - 24}px -16px 0px -16px)`);
    else animate(overflowRoot.value, 'transform', initial?.popupTransform || `translateY(${opening ? delta : 0}px)`, `translateY(${opening ? 0 : delta}px)`);
  }
  return Promise.all(animations.map(animation => animation.finished.catch(() => undefined))).then(() => undefined);
};
const mountCommands = () => {
  if (!primaryRoot.value || !secondaryRoot.value) return;
  const focused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const ownedFocus = focused && entries.value.some(entry => entry.host.contains(focused));
  const hasOverflowPrimary = entries.value.some(entry => !entry.secondary && overflowIds.value.has(entry.id));
  const primaryHosts: HTMLElement[] = []; const secondaryHosts: HTMLElement[] = [];
  let insertedDivider = false;
  for (const entry of entries.value) {
    if (entry.secondary && hasOverflowPrimary && !insertedDivider) { secondaryHosts.push(overflowDivider); insertedDivider = true; }
    (entry.secondary || overflowIds.value.has(entry.id) ? secondaryHosts : primaryHosts).push(entry.host);
  }
  if (!insertedDivider) overflowDivider.remove();
  for (const [parent, hosts] of [[primaryRoot.value, primaryHosts], [secondaryRoot.value, secondaryHosts]] as const) {
    let cursor = parent.firstElementChild;
    for (const host of hosts) { if (host !== cursor) parent.insertBefore(host, cursor); cursor = host.nextElementSibling; }
  }
  const liveIds = new Set(entries.value.map(entry => entry.id));
  for (const [id, entry] of retainedEntries) if (!liveIds.has(id)) { entry.host.remove(); retainedEntries.delete(id); }
  if (ownedFocus && focused?.isConnected && document.activeElement !== focused) {
    if (focused.getClientRects().length) focused.focus({ preventScroll: true }); else moreButton.value?.focus({ preventScroll: true });
  }
};
const calculateOverflow = () => {
  if (!root.value || !primaryRoot.value) return;
  const primary = entries.value.filter(entry => !entry.secondary);
  for (const entry of primary) if (!overflowIds.value.has(entry.id)) entry.width = entry.host.firstElementChild?.getBoundingClientRect().width || entry.width;
  desiredWidth.value = primary.reduce((width, entry) => width + entry.width, 0) + (contentRoot.value?.scrollWidth || 0) + (showMore.value ? 48 : 6) + 4;
  const next = new Set<number>();
  if (enabled(value('IsDynamicOverflowEnabled'))) {
    const available = Math.max(0, root.value.clientWidth - (contentRoot.value?.scrollWidth || 0) - (showMore.value ? 48 : 6) - 4);
    let occupied = primary.reduce((sum, entry) => sum + entry.width, 0);
    const candidates = [...primary].sort((a, b) => (Number(resolve(a.node.props?.DynamicOverflowOrder)) || Infinity) - (Number(resolve(b.node.props?.DynamicOverflowOrder)) || Infinity) || primary.indexOf(b) - primary.indexOf(a));
    for (const entry of candidates) {
      if (occupied <= available) break;
      const order = Number(resolve(entry.node.props?.DynamicOverflowOrder) || 0);
      const group = order ? primary.filter(item => Number(resolve(item.node.props?.DynamicOverflowOrder)) === order) : [entry];
      for (const item of group) if (!next.has(item.id)) { next.add(item.id); occupied -= item.width; }
    }
  }
  if (next.size !== overflowIds.value.size || [...next].some(id => !overflowIds.value.has(id))) {
    raise('DynamicOverflowItemsChanging', { Action: next.size > overflowIds.value.size ? 'AddingToOverflow' : 'RemovingFromOverflow' });
    overflowIds.value = next; void nextTick(() => { mountCommands(); void positionOverflow(); });
  }
};
const positionOverflow = async () => {
  if (!root.value || !surface.value) return;
  const rect = root.value.getBoundingClientRect();
  anchor.value = { left: rect.left, top: rect.top, width: rect.width, direction: getComputedStyle(root.value).direction };
  contentHeight.value = Math.max(48, surface.value.offsetHeight);
  if (!surfacePresent.value) return;
  const height = overflowPresent.value ? overflowRoot.value?.offsetHeight || 0 : 0;
  const width = overflowRoot.value?.offsetWidth || 0;
  const expandedBottom = rect.top + contentHeight.value;
  opensUp.value = window.innerHeight - expandedBottom < height + 4 && rect.bottom >= contentHeight.value + height + 4;
  position.value = { left: Math.max(8, Math.min(window.innerWidth - width - 8, rect.right - width)), top: Math.max(8, Math.min(window.innerHeight - height - 8, opensUp.value ? rect.top + verticalDelta.value - height : expandedBottom)) };
  positioned.value = true;
};
async function setOpen(next: boolean) {
  if (next === isOpen.value || next && !isEnabled.value || unmounted) return;
  const version = ++generation; raise(next ? 'Opening' : 'Closing');
  const movingElement = overflowRoot.value?.querySelector<HTMLElement>('.commandbar-secondary-shadow-wrapper');
  const initial: TransitionState | undefined = animations.length ? {
    clipPath: layoutRoot.value ? getComputedStyle(layoutRoot.value).clipPath : undefined,
    contentTransform: surface.value ? getComputedStyle(surface.value).transform : undefined,
    overflowTransform: movingElement ? getComputedStyle(movingElement).transform : undefined,
    popupTransform: overflowRoot.value ? getComputedStyle(overflowRoot.value).transform : undefined,
    overflowClip: overflowRoot.value ? getComputedStyle(overflowRoot.value).clipPath : undefined
  } : undefined;
  if (!next) {
    if (flyoutContainsNode(secondaryInputRegion, document.activeElement) || hasOpenDescendantFlyout(primaryInputRegion)) moreButton.value?.focus({ preventScroll: true });
    hideDescendantFlyouts(primaryInputRegion); hideDescendantFlyouts(secondaryInputRegion);
  }
  stopAnimations(); isOpen.value = next; overrides.IsOpen = next;
  updateXamlBinding(props.IsOpen, next, instance); emit('update:IsOpen', next);
  if (next) {
    await positionOverflow();
    if (version !== generation || unmounted) return;
    if (!surfacePresent.value) measuredWidth.value = anchor.value.width;
    const focused = document.activeElement instanceof HTMLElement && root.value?.contains(document.activeElement) ? document.activeElement : null;
    surfacePresent.value = true; overflowPresent.value = overflowNodes.value.length > 0; positioned.value = false; await nextTick(); mountCommands(); await positionOverflow(); await nextTick();
    if (version !== generation || unmounted) return;
    focused?.focus({ preventScroll: true });
    const finished = animateDisplayMode(true, initial); raise('Opened'); await finished;
  } else {
    if (overflowRoot.value?.contains(document.activeElement)) moreButton.value?.focus({ preventScroll: true });
    await animateDisplayMode(false, initial); if (version !== generation || unmounted) return;
    const focused = document.activeElement instanceof HTMLElement && overlayRoot.value?.contains(document.activeElement) ? document.activeElement : null;
    overflowPresent.value = false; surfacePresent.value = false; positioned.value = false; await nextTick(); await positionOverflow();
    focused?.focus({ preventScroll: true }); raise('Closed');
  }
  if (version === generation) stopAnimations();
}
const focusable = (element: HTMLElement | null) => Array.from(element?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []).filter(button => button.getClientRects().length);
const moveFocus = (event: KeyboardEvent, element: HTMLElement | null, vertical: boolean) => {
  const keys = vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight']; const items = focusable(element);
  if (!items.length || ![...keys, 'Home', 'End'].includes(event.key)) return;
  const index = items.indexOf(document.activeElement as HTMLButtonElement); const rtl = !vertical && getComputedStyle(root.value!).direction === 'rtl';
  const delta = event.key === keys[0] ? -1 : 1; const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (rtl ? -delta : delta) + items.length) % items.length;
  event.preventDefault(); items[next].focus({ preventScroll: true });
};
const onKeyDown = (event: KeyboardEvent) => {
  if (event.defaultPrevented || hasOpenDescendantFlyout(primaryInputRegion)) return;
  if (event.key === 'Escape' && isOpen.value) { event.preventDefault(); void setOpen(false); return; }
  if (event.target === moreButton.value && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) { event.preventDefault(); void setOpen(true).then(() => (event.key === 'ArrowUp' ? focusable(overflowRoot.value).at(-1) : focusable(overflowRoot.value)[0])?.focus({ preventScroll: true })); return; }
  moveFocus(event, surface.value, false);
};
const onOverflowKeyDown = (event: KeyboardEvent) => { if (event.defaultPrevented || hasOpenDescendantFlyout(secondaryInputRegion)) return; if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); void setOpen(false); return; } if (event.key === 'Tab') { void setOpen(false); return; } moveFocus(event, overflowRoot.value, true); };
const onOutsidePointer = (event: PointerEvent) => {
  if (!isOpen.value || enabled(value('IsSticky'))) return;
  const path = event.composedPath();
  if (!path.includes(root.value!) && !flyoutContainsNode(primaryInputRegion, event.target as Node | null) && !flyoutContainsNode(secondaryInputRegion, event.target as Node | null)) void setOpen(false);
};
const onWindowBlur = () => { if (!enabled(value('IsSticky'))) void setOpen(false); };
const scheduleLayout = () => { if (frame !== null) return; frame = requestAnimationFrame(() => { frame = null; calculateOverflow(); void positionOverflow(); }); };
for (const name of Object.keys(props) as (keyof typeof props)[]) {
  if (name === 'PrimaryCommands' || name === 'SecondaryCommands') continue;
  const property = computed({ get: () => name === 'IsOpen' ? isOpen.value : value(name), set: (next: unknown) => {
    if (name === 'IsOpen') { void setOpen(enabled(next)); return; }
    overrides[name] = next; updateXamlBinding(props[name], next, instance); emit(`update:${name}`, next); scheduleLayout();
  } });
  Object.defineProperty(api, name, { enumerable: true, get: () => property.value, set: next => { property.value = next; } });
  watch(() => resolve(props[name]), next => { delete overrides[name]; if (name === 'IsOpen') void setOpen(enabled(next)); else scheduleLayout(); });
}
for (const name of ['PrimaryCommands', 'SecondaryCommands'] as const) {
  const collection = name === 'PrimaryCommands' ? primaryCommands : secondaryCommands;
  Object.defineProperty(api, name, { enumerable: true, get: () => collection, set: (next: unknown) => { if (!Array.isArray(next) || next.some(node => !isVNode(node))) throw new TypeError(`${name} requires AppBar command elements`); collection.splice(0, collection.length, ...next); emit(`update:${name}`, collection); } });
  watch(() => { const source = resolve(props[name]); return Array.isArray(source) ? [...source] : undefined; }, next => { if (next) collection.splice(0, collection.length, ...next.filter(isVNode)); });
}
watch(() => entries.value.map(entry => entry.id), async () => { await nextTick(); if (unmounted) return; mountCommands(); scheduleLayout(); });
watch(() => overflowNodes.value.length, async count => {
  if (!isOpen.value || unmounted) return;
  const focusedInOverflow = overflowRoot.value?.contains(document.activeElement);
  overflowPresent.value = count > 0;
  if (!count) { positioned.value = false; if (focusedInOverflow) moreButton.value?.focus({ preventScroll: true }); return; }
  await nextTick();
  if (!unmounted && isOpen.value) { mountCommands(); await positionOverflow(); }
});
onUpdated(mountCommands);
onMounted(async () => {
  mountCommands(); await nextTick(); calculateOverflow(); resizeObserver = new ResizeObserver(scheduleLayout); if (root.value) resizeObserver.observe(root.value); if (surface.value) resizeObserver.observe(surface.value); if (contentRoot.value) resizeObserver.observe(contentRoot.value);
  themeObserver = new MutationObserver(() => { themeRevision.value += 1; }); const scope = root.value?.closest('[data-theme], .win-theme-scope, .example-theme-wrapper, .theme-light, .theme-dark'); if (scope) themeObserver.observe(scope, { attributes: true, attributeFilter: ['class', 'data-theme'] });
  if (scope !== document.documentElement) themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
  document.addEventListener('pointerdown', onOutsidePointer, true); window.addEventListener('resize', scheduleLayout); window.addEventListener('scroll', scheduleLayout, true); window.addEventListener('blur', onWindowBlur);
  await positionOverflow();
  if (isOpen.value) { isOpen.value = false; await setOpen(true); }
});
onBeforeUnmount(() => { hideDescendantFlyouts(primaryInputRegion); hideDescendantFlyouts(secondaryInputRegion); unregisterPrimaryRegion(); unregisterSecondaryRegion(); unmounted = true; generation += 1; stopAnimations(); resizeObserver?.disconnect(); themeObserver?.disconnect(); if (frame !== null) cancelAnimationFrame(frame); document.removeEventListener('pointerdown', onOutsidePointer, true); window.removeEventListener('resize', scheduleLayout); window.removeEventListener('scroll', scheduleLayout, true); window.removeEventListener('blur', onWindowBlur); retainedEntries.forEach(entry => entry.host.remove()); });
Object.defineProperty(api, xamlControlIdentityKey, { value: true });
defineExpose(api);
</script>
