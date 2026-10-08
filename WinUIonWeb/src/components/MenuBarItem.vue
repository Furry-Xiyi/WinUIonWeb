<script lang="ts">
import { computed, defineComponent, getCurrentInstance, h, inject, isVNode, onBeforeUnmount, onMounted, provide, ref, watch, type VNode } from 'vue';
import { useI18n } from './i18n/index';
import MenuFlyout from './MenuFlyout.vue';
import { getVNodeChildren } from './CollectionProperties';
import { frameworkLayoutStyle } from './frameworkLayout';
import { materializeXamlVNode, normalizeXamlNodes, resolveXamlValue, updateXamlBinding } from './xamlRuntime';
import { menuBarContextKey, menuBarFlyoutNavigationKey, menuBarFlyoutEnabledKey, type MenuBarItemController } from './menuBarContext';

export const MenuBarItemItemsProperty = defineComponent({
  name: 'MenuBarItem.Items',
  __menuBarItemProperty: 'Items',
  setup: () => () => null,
});

const MenuBarItem = defineComponent({
  name: 'MenuBarItem',
  __menuBarItem: true,
  inheritAttrs: false,
  props: {
    Title: { type: [String, Number, Object], default: undefined },
    Items: { type: [Array, Object, String], default: undefined },
    IsEnabled: { type: [Boolean, String], default: true },
    IsTabStop: { type: [Boolean, String], default: true },
    Visibility: { type: String, default: 'Visible' },
  },
  emits: ['update:Title', 'update:Items', 'update:IsEnabled', 'update:IsTabStop', 'update:Visibility'],
  setup(props, { attrs, slots, expose, emit }) {
    const instance = getCurrentInstance();
    const { t } = useI18n();
    const context = inject(menuBarContextKey, null);
    const element = ref<HTMLButtonElement | null>(null);
    const flyout = ref<any>(null);
    const titleOverride = ref<string | undefined>();
    const enabledOverride = ref<boolean | undefined>();
    const tabStopOverride = ref<boolean | undefined>();
    const visibilityOverride = ref<string | undefined>();
    const title = computed(() => titleOverride.value ?? (props.Title === undefined ? t('MenuBarItemDefaultTitle') : resolveXamlValue(props.Title, instance) as string));
    const enabled = computed(() => context?.isEnabled() !== false && (enabledOverride.value ?? !([false, 'False', 'false'] as unknown[]).includes(resolveXamlValue(props.IsEnabled, instance))));
    const tabStop = computed(() => tabStopOverride.value ?? !([false, 'False', 'false'] as unknown[]).includes(resolveXamlValue(props.IsTabStop, instance)));
    const visibility = computed(() => visibilityOverride.value ?? String(resolveXamlValue(props.Visibility, instance)));
    const visible = computed(() => context?.isVisible() !== false && visibility.value !== 'Collapsed');
    const isOpen = ref(false);
    const pointerOver = ref(false);
    const pressed = ref(false);
    let pointerId: number | null = null;
    let disposed = false;
    let request = 0;
    let openingRequest = -1;
    let closingRequest = -1;
    let pointerClickHandled = false;
    let canceledClick = false;
    let pendingFocus: 'first' | 'last' | 'none' = 'first';

    const api = {
      get Title() { return title.value; },
      set Title(next: string) { titleOverride.value = next; updateXamlBinding(props.Title, next, instance); emit('update:Title', next); },
      get IsEnabled() { return enabled.value; },
      set IsEnabled(next: boolean) { enabledOverride.value = next; updateXamlBinding(props.IsEnabled, next, instance); emit('update:IsEnabled', next); },
      get IsTabStop() { return tabStop.value; },
      set IsTabStop(next: boolean) { tabStopOverride.value = next; updateXamlBinding(props.IsTabStop, next, instance); emit('update:IsTabStop', next); },
      get Visibility() { return visibility.value; },
      set Visibility(next: string) { visibilityOverride.value = next; updateXamlBinding(props.Visibility, next, instance); emit('update:Visibility', next); },
      get Name() { return attrs['x:Name'] ?? attrs.Name ?? ''; },
      get Items() { return flyout.value?.Items; },
      set Items(next: unknown) { if (flyout.value) flyout.value.Items = next; },
      get Element() { return element.value; },
      Focus() { if (!enabled.value || !visible.value || !element.value) return false; element.value.focus({ preventScroll: true }); return true; },
    };
    const controller: MenuBarItemController = {
      api,
      element: () => element.value,
      isEnabled: () => enabled.value,
      isVisible: () => visible.value,
      isTabStop: () => tabStop.value,
      hasItems: () => !!flyout.value?.Items?.Count,
      async open(focus) {
        if (!enabled.value || !visible.value || !element.value || !flyout.value || !flyout.value.Items?.Count) return;
        const currentRequest = ++request;
        pendingFocus = focus;
        const button = element.value;
        if (focus === 'none') await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
        if (disposed || request !== currentRequest || !enabled.value || !visible.value) return;
        await flyout.value.ShowAt(button, { Placement: 'Bottom', Position: { X: 0, Y: button.offsetHeight }, ExclusionRect: { X: 0, Y: 0, Width: button.offsetWidth, Height: button.offsetHeight } });
        if (disposed || request !== currentRequest) return;
        isOpen.value = true;
      },
      close(restoreFocus) {
        request++;
        isOpen.value = false;
        clearPressed();
        flyout.value?.Hide(restoreFocus);
      },
    };
    expose(api);
    provide(menuBarFlyoutNavigationKey, event => context?.onFlyoutKeyDown(controller, event));
    provide(menuBarFlyoutEnabledKey, () => enabled.value && visible.value);

    const clearPressed = () => {
      pressed.value = false;
      if (pointerId !== null && element.value?.hasPointerCapture(pointerId)) element.value.releasePointerCapture(pointerId);
      pointerId = null;
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!enabled.value || event.button !== 0) return;
      pressed.value = true;
      canceledClick = false;
      pointerId = event.pointerId;
      pointerClickHandled = true;
      element.value?.setPointerCapture(event.pointerId);
      element.value?.focus({ preventScroll: true });
      if (context) context.toggle(controller, 'none');
      else if (isOpen.value) controller.close(true);
      else controller.open('none');
    };
    const onClick = (event: MouseEvent) => {
      clearPressed();
      if (event.detail !== 0 && canceledClick) { canceledClick = false; return; }
      canceledClick = false;
      if (event.detail !== 0 && pointerClickHandled) { pointerClickHandled = false; return; }
      pointerClickHandled = false;
      if (!enabled.value) return;
      if (context) context.toggle(controller);
      else if (isOpen.value) controller.close(true);
      else controller.open('first');
    };
    const onOpening = () => { openingRequest = request; isOpen.value = true; };
    const onOpened = () => {
      if (disposed || openingRequest !== request) return;
      isOpen.value = true;
      if (pendingFocus === 'last') {
        const items = flyout.value?.Items;
        const target = items?.GetAt?.((items?.Count ?? 1) - 1);
        target?.Element?.focus?.({ preventScroll: true });
      } else if (pendingFocus === 'none') element.value?.focus({ preventScroll: true });
    };
    const onClosing = () => {
      closingRequest = ++request;
      isOpen.value = false;
      pressed.value = false;
      context?.onItemClosed(controller);
    };
    const onClosed = () => {
      if (closingRequest !== request) return;
      isOpen.value = false;
      pressed.value = false;
    };
    watch(enabled, value => { if (!value) { controller.close(false); clearPressed(); } });
    watch(visible, value => { if (!value) { controller.close(false); clearPressed(); pointerOver.value = false; } });
    watch(() => resolveXamlValue(props.Title, instance), () => { titleOverride.value = undefined; });
    watch(() => resolveXamlValue(props.IsEnabled, instance), () => { enabledOverride.value = undefined; });
    watch(() => resolveXamlValue(props.IsTabStop, instance), () => { tabStopOverride.value = undefined; });
    watch(() => resolveXamlValue(props.Visibility, instance), () => { visibilityOverride.value = undefined; });
    onMounted(() => context?.register(controller));
    onBeforeUnmount(() => {
      disposed = true;
      clearPressed();
      controller.close(false);
      context?.unregister(controller);
    });

    const itemContent = () => {
      const nodes = normalizeXamlNodes(slots.default?.() ?? [], instance);
      const explicitItems = nodes.find(node => (node.type as any)?.__menuBarItemProperty === 'Items');
      const source = explicitItems ? getVNodeChildren(explicitItems) : nodes;
      const items: VNode[] = source.filter(isVNode);
      return items.map(node => materializeXamlVNode(node, undefined, instance));
    };

    const onPointerUp = () => {
      clearPressed();
    };
    const onPointerCancel = () => {
      clearPressed();
      pointerOver.value = false;
      canceledClick = true;
      pointerClickHandled = false;
      controller.close(false);
      context?.onItemClosed(controller);
    };
    const visualStyle = () => {
      const source = frameworkLayoutStyle({ ...attrs, ...props }, instance) as Record<string, unknown>;
      return {
        '--menu-bar-item-background': source.background,
        '--menu-bar-item-foreground': resolveXamlValue(attrs.Foreground, instance),
        '--menu-bar-item-border-thickness': source.borderWidth,
        '--menu-bar-item-border-brush': source.borderColor,
        '--menu-bar-item-corner-radius': source.borderRadius,
      };
    };
    const layoutStyle = () => frameworkLayoutStyle(Object.fromEntries(Object.entries({ ...attrs, ...props, Visibility: visibility.value }).filter(([name]) => !['Background', 'Foreground', 'BorderThickness', 'BorderBrush', 'CornerRadius'].includes(name))), instance);
    return () => [
      h('div', {
        class: ['win-menu-bar-item', { 'is-pointer-over': pointerOver.value, 'is-pressed': pressed.value, 'is-open': isOpen.value, 'is-disabled': !enabled.value }, attrs.class],
        style: [layoutStyle(), visualStyle(), attrs.style],
        id: attrs['x:Name'] ?? attrs.id,
        role: 'none',
      }, [h('div', { class: 'win-menu-bar-item-content-root' }, [
        h('span', { class: 'win-menu-bar-item-background', 'aria-hidden': 'true' }),
        h('button', {
        ref: element,
        class: 'win-menu-bar-button',
        type: 'button',
        role: 'menuitem',
        disabled: !enabled.value,
        tabindex: context?.tabIndex(controller) ?? (enabled.value && visible.value && tabStop.value ? 0 : -1),
        'aria-haspopup': 'menu',
        'aria-expanded': isOpen.value,
        'aria-disabled': !enabled.value || undefined,
        'aria-label': resolveXamlValue(attrs['AutomationProperties.Name'], instance) ?? title.value,
        onFocus: () => context?.onItemFocus(controller),
        onPointerenter: (event: PointerEvent) => { pointerOver.value = event.pointerType !== 'touch'; context?.onItemPointerEnter(controller, event); },
        onPointerleave: () => { pointerOver.value = false; },
        onPointerdown: onPointerDown,
        onPointerup: onPointerUp,
        onPointercancel: onPointerCancel,
        onLostpointercapture: () => { pressed.value = false; pointerId = null; },
        onClick,
        onKeydown: (event: KeyboardEvent) => context?.onItemKeyDown(controller, event),
      }, [h('span', { class: 'win-menu-bar-item-content' }, String(title.value ?? ''))]),
      ])]),
      h(MenuFlyout, { ref: flyout, Items: props.Items === undefined ? undefined : resolveXamlValue(props.Items, instance), Placement: 'Bottom', OverlayInputPassThroughElement: context?.element(), onOpening, onOpened, onClosing, onClosed, 'onUpdate:Items': (next: unknown) => { updateXamlBinding(props.Items, next, instance); emit('update:Items', next); } }, { default: itemContent }),
    ];
  },
});

export default Object.assign(MenuBarItem, { Items: MenuBarItemItemsProperty });
</script>

<style scoped>
.win-menu-bar-item {
  box-sizing: border-box;
  flex: 0 1 auto;
  display: grid;
  min-width: 0;
  min-height: 0;
  margin: var(--MenuBarItemMargin, 4px);
  color: var(--menu-bar-item-foreground, var(--MenuBarItemForeground, var(--text-primary)));
}
.win-menu-bar-item-content-root {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  min-width: 0;
  min-height: 0;
  background: var(--menu-bar-item-background, var(--MenuBarItemBackground, transparent));
  border-radius: var(--menu-bar-item-corner-radius, var(--ControlCornerRadius, 4px));
}
.win-menu-bar-item-background {
  position: absolute;
  inset: 0;
  box-sizing: border-box;
  border: var(--menu-bar-item-border-thickness, var(--MenuBarItemBorderThickness, 0)) solid var(--menu-bar-item-border-brush, var(--MenuBarItemBorderBrush, transparent));
  border-radius: var(--menu-bar-item-corner-radius, var(--ControlCornerRadius, 4px));
  background: var(--menu-bar-item-background, var(--MenuBarItemBackground, transparent));
  pointer-events: none;
}
.win-menu-bar-button {
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 0;
  padding: var(--MenuBarItemButtonPadding, 4px 10px);
  border: 0;
  border-radius: var(--menu-bar-item-corner-radius, var(--ControlCornerRadius, 4px));
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: 20px;
  text-align: center;
  white-space: nowrap;
  cursor: default;
  touch-action: manipulation;
  user-select: none;
  overflow: hidden;
}
.win-menu-bar-item-content {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.win-menu-bar-item.is-pointer-over:not(.is-disabled) .win-menu-bar-item-background {
  background: var(--MenuBarItemBackgroundPointerOver, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary)));
  border-color: var(--MenuBarItemBorderBrushPointerOver, transparent);
}
.win-menu-bar-item.is-pressed:not(.is-disabled) .win-menu-bar-item-background {
  background: var(--MenuBarItemBackgroundPressed, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary)));
  border-color: var(--MenuBarItemBorderBrushPressed, transparent);
}
.win-menu-bar-item.is-open:not(.is-disabled):not(.is-pointer-over):not(.is-pressed) .win-menu-bar-item-background {
  background: var(--MenuBarItemBackgroundSelected, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary)));
  border-color: var(--MenuBarItemBorderBrushSelected, transparent);
}
.win-menu-bar-item.is-disabled .win-menu-bar-item-background {
  background: var(--MenuBarItemBackgroundDisabled, transparent);
  border-color: var(--MenuBarItemBorderBrushDisabled, transparent);
}
.win-menu-bar-item.is-disabled { color: var(--MenuBarItemForegroundDisabled, var(--text-disabled)); }
.win-menu-bar-button:focus-visible {
  outline: 2px solid var(--SystemControlFocusVisualPrimaryBrush, var(--accent-base));
  outline-offset: -3px;
}
</style>
