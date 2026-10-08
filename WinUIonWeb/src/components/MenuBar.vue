<script lang="ts">
import { cloneVNode, computed, defineComponent, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, toRaw, unref, watch, type VNode } from 'vue';
import { getVNodeChildren } from './CollectionProperties';
import { frameworkLayoutStyle } from './frameworkLayout';
import { materializeXamlVNode, normalizeXamlNodes, resolveXamlValue, updateXamlBinding } from './xamlRuntime';
import { menuBarContextKey, type MenuBarItemController } from './menuBarContext';

export const MenuBarItemsProperty = defineComponent({
  name: 'MenuBar.Items',
  __menuBarProperty: 'Items',
  setup: () => () => null,
});

const MenuBar = defineComponent({
  name: 'MenuBar',
  inheritAttrs: false,
  props: {
    Items: { type: [Array, Object, String], default: undefined },
    IsEnabled: { type: [Boolean, String], default: true },
    Visibility: { type: String, default: 'Visible' },
    RequestedTheme: { type: String, default: 'Default' },
  },
  emits: ['update:Items', 'update:IsEnabled', 'update:Visibility'],
  setup(props, { attrs, slots, expose, emit }) {
    const instance = getCurrentInstance();
    const inheritedTheme = inject('winuiTheme', '');
    const requestedTheme = computed(() => String(resolveXamlValue(props.RequestedTheme, instance)).toLowerCase());
    const theme = computed(() => ['light', 'dark'].includes(requestedTheme.value) ? requestedTheme.value : unref(inheritedTheme));
    provide('winuiTheme', theme);
    const element = ref<HTMLElement | null>(null);
    const controllers = shallowRef<MenuBarItemController[]>([]);
    const focusedItem = shallowRef<MenuBarItemController | null>(null);
    const openItem = shallowRef<MenuBarItemController | null>(null);
    let declarationNodes: VNode[] = [];
    const itemOverride = shallowRef<VNode[] | null>(null);
    const collectionKeys = new WeakMap<object, string>();
    const declarationKeys = new Map<number, string>();
    let nextItemKey = 0;
    const enabledOverride = ref<boolean | undefined>();
    const visibilityOverride = ref<string | undefined>();
    const enabled = computed(() => enabledOverride.value ?? !([false, 'False', 'false'] as unknown[]).includes(resolveXamlValue(props.IsEnabled, instance)));
    const visibility = computed(() => visibilityOverride.value ?? String(resolveXamlValue(props.Visibility, instance)));
    const visible = computed(() => visibility.value !== 'Collapsed');
    let disposed = false;

    const orderedItems = () => controllers.value.slice().sort((left, right) => {
      const a = left.element();
      const b = right.element();
      if (a === b) return 0;
      return a && b && (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING) ? 1 : -1;
    });
    const enabledItems = () => orderedItems().filter(item => enabled.value && visible.value && item.isEnabled() && item.isVisible());
    const tabItems = () => enabledItems().filter(item => item.isTabStop());
    const close = (restoreFocus = false) => {
      const current = openItem.value;
      openItem.value = null;
      current?.close(restoreFocus);
    };
    const open = async (item: MenuBarItemController, focus: 'first' | 'last' | 'none' = 'first') => {
      if (!enabled.value || !visible.value || !item.isEnabled() || !item.isVisible() || !item.hasItems()) return;
      if (openItem.value && openItem.value !== item) close(false);
      focusedItem.value = item;
      openItem.value = item;
      await nextTick();
      if (!disposed && openItem.value === item) item.open(focus);
    };
    const focus = (item: MenuBarItemController) => {
      focusedItem.value = item;
      item.element()?.focus({ preventScroll: true });
    };
    const move = (current: MenuBarItemController, step: number, showMenu = false) => {
      const items = enabledItems();
      if (!items.length) return;
      const index = items.indexOf(current);
      const next = items[(index + step + items.length) % items.length];
      focus(next);
      if (showMenu) {
        close(false);
        void open(next);
      }
    };
    const onItemKeyDown = (item: MenuBarItemController, event: KeyboardEvent) => {
      if (event.altKey) return;
      const rtl = element.value && getComputedStyle(element.value).direction === 'rtl';
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        move(item, (event.key === 'ArrowRight' ? 1 : -1) * (rtl ? -1 : 1));
      } else if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        void open(item);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        close(true);
      }
    };
    const context = {
      element: () => element.value,
      isEnabled: () => enabled.value,
      isVisible: () => visible.value,
      register(item: MenuBarItemController) {
        controllers.value = [...controllers.value, item];
        if (!focusedItem.value && item.isEnabled() && item.isVisible() && item.isTabStop()) focusedItem.value = item;
      },
      unregister(item: MenuBarItemController) {
        if (openItem.value === item) close(false);
        controllers.value = controllers.value.filter(candidate => candidate !== item);
        if (focusedItem.value === item) focusedItem.value = enabledItems()[0] ?? null;
      },
      tabIndex(item: MenuBarItemController) {
        const items = tabItems();
        const current = focusedItem.value && items.includes(focusedItem.value) ? focusedItem.value : items[0];
        return item === current ? 0 : -1;
      },
      onItemFocus(item: MenuBarItemController) { focusedItem.value = item; },
      onItemPointerEnter(item: MenuBarItemController, event: PointerEvent) {
        if (event.pointerType !== 'touch' && openItem.value && openItem.value !== item) void open(item, 'none');
      },
      onItemKeyDown,
      onFlyoutKeyDown(item: MenuBarItemController, event: KeyboardEvent) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          event.stopPropagation();
          const rtl = element.value && getComputedStyle(element.value).direction === 'rtl';
          move(item, (event.key === 'ArrowRight' ? 1 : -1) * (rtl ? -1 : 1), true);
        }
      },
      onItemClosed(item: MenuBarItemController) { if (openItem.value === item) openItem.value = null; },
      toggle(item: MenuBarItemController, focus: 'first' | 'last' | 'none' = 'first') { if (openItem.value === item) close(true); else void open(item, focus); },
      open,
      close,
    };
    provide(menuBarContextKey, context);

    const keyItem = (node: VNode, index: number, collection: boolean) => {
      if (node.key !== null) return node;
      const name = node.props?.['x:Name'] ?? node.props?.Name ?? node.props?.['data-xaml-ref'];
      let key: string;
      if (typeof name === 'string' && name) key = `menu-bar-name:${name}`;
      else {
        const source = toRaw(node);
        key = collection ? collectionKeys.get(source) ?? '' : declarationKeys.get(index) ?? '';
        if (!key) {
          key = `menu-bar-item:${instance?.uid ?? 0}:${++nextItemKey}`;
          if (collection) collectionKeys.set(source, key);
          else declarationKeys.set(index, key);
        }
      }
      return cloneVNode(node, { key });
    };

    const content = () => {
      const nodes = normalizeXamlNodes(slots.default?.() ?? [], instance);
      const explicitItems = nodes.find(node => (node.type as any)?.__menuBarProperty === 'Items');
      const boundItems = resolveXamlValue(props.Items, instance);
      const source = props.Items !== undefined
        ? Array.isArray(boundItems) ? boundItems : isVNode(boundItems) ? [boundItems] : []
        : explicitItems ? getVNodeChildren(explicitItems) : nodes;
      const items = source.filter((node: unknown): node is VNode => isVNode(node) && !!(node.type as any)?.__menuBarItem);
      // Preserve each item object when Vue patches collection insertions or removals.
      declarationNodes = items.map((node, index) => keyItem(node, index, props.Items !== undefined));
      return (itemOverride.value ?? declarationNodes).map((node, index) => materializeXamlVNode(keyItem(node, index, true), undefined, instance)) as VNode[];
    };
    const requireItem = (item: unknown): VNode => {
      if (!isVNode(item) || !(item.type as any)?.__menuBarItem) throw new TypeError('MenuBar.Items accepts MenuBarItem elements.');
      return item;
    };
    const replaceItems = (next: VNode[]) => {
      itemOverride.value = next;
      updateXamlBinding(props.Items, next, instance);
      emit('update:Items', next);
    };
    const editableItems = () => [...(itemOverride.value ?? declarationNodes)];
    const methods = {
      GetAt(index: number) { return orderedItems()[index]?.api; },
      IndexOf(item: unknown) { return orderedItems().findIndex(controller => controller.api === item); },
      Add(item: unknown) { const next = editableItems(); next.push(requireItem(item)); replaceItems(next); },
      Append(item: unknown) { methods.Add(item); },
      InsertAt(index: number, item: unknown) { const next = editableItems(); next.splice(index, 0, requireItem(item)); replaceItems(next); },
      SetAt(index: number, item: unknown) { const next = editableItems(); next.splice(index, 1, requireItem(item)); replaceItems(next); },
      RemoveAt(index: number) { const next = editableItems(); next.splice(index, 1); replaceItems(next); },
      RemoveAtEnd() { const next = editableItems(); next.pop(); replaceItems(next); },
      Clear() { replaceItems([]); },
      ReplaceAll(items: unknown[]) { replaceItems(items.map(requireItem)); },
    };
    const publicItems = new Proxy(methods, {
      get(target, key) {
        if (key === 'Count' || key === 'Size' || key === 'length') return controllers.value.length;
        if (key === Symbol.iterator) return () => orderedItems().map(item => item.api)[Symbol.iterator]();
        if (key in target) return target[key as keyof typeof target];
        return orderedItems().map(item => item.api)[key as any];
      },
    });
    expose({
      get Items() { return publicItems; },
      set Items(next: unknown) { replaceItems((next as unknown[]).map(requireItem)); },
      Focus: () => { const item = enabledItems()[0]; if (item) focus(item); return !!item; },
      get Element() { return element.value; },
      get IsEnabled() { return enabled.value; },
      set IsEnabled(next: boolean) { enabledOverride.value = next; updateXamlBinding(props.IsEnabled, next, instance); emit('update:IsEnabled', next); },
      get Visibility() { return visibility.value; },
      set Visibility(next: string) { visibilityOverride.value = next; updateXamlBinding(props.Visibility, next, instance); emit('update:Visibility', next); },
    });
    watch(() => resolveXamlValue(props.IsEnabled, instance), () => { enabledOverride.value = undefined; });
    watch(() => resolveXamlValue(props.Visibility, instance), () => { visibilityOverride.value = undefined; });
    watch(() => resolveXamlValue(props.Items, instance), () => { itemOverride.value = null; });
    watch(enabled, value => { if (!value) close(false); });
    watch(visible, value => { if (!value) close(false); });
    const onWindowBlur = () => {
      const active = openItem.value;
      close(false);
      // Clear pointer capture and pending ShowAt requests on every header,
      // including an empty item that never became the active flyout.
      controllers.value.slice().forEach(item => { if (item !== active) item.close(false); });
    };
    onMounted(() => window.addEventListener('blur', onWindowBlur));
    onBeforeUnmount(() => {
      disposed = true;
      close(false);
      window.removeEventListener('blur', onWindowBlur);
    });

    return () => h('nav', {
      ...Object.fromEntries(Object.entries(attrs).filter(([name]) => /^(Grid|Canvas|RelativePanel)\./.test(name)).map(([name, value]) => [name, resolveXamlValue(value, instance)])),
      ref: element,
      class: ['win-menu-bar win-menu-bar-layout-root', ['light', 'dark'].includes(requestedTheme.value) && ['win-theme-scope', `theme-${theme.value}`], attrs.class],
      style: [frameworkLayoutStyle({ ...attrs, ...props, Visibility: visibility.value }, instance), attrs.style as import('vue').StyleValue],
      id: attrs['x:Name'] ?? attrs.id,
      dir: resolveXamlValue(attrs.FlowDirection, instance) === 'RightToLeft' ? 'rtl' : undefined,
      role: 'menubar',
      'aria-label': resolveXamlValue(attrs['AutomationProperties.Name'], instance),
      'aria-disabled': !enabled.value || undefined,
      'data-theme': ['light', 'dark'].includes(requestedTheme.value) ? requestedTheme.value : undefined,
    }, [h('div', { class: 'win-menu-bar-content-root' }, [h('div', { class: 'win-menu-bar-items-presenter', role: 'presentation' }, content())])]);
  },
});

export default Object.assign(MenuBar, { Items: MenuBarItemsProperty });
</script>

<style scoped>
.win-menu-bar {
  box-sizing: border-box;
  display: grid;
  min-width: 0;
  min-height: 40px;
  padding: 0;
  background: var(--MenuBarBackground, transparent);
  border: var(--MenuBarBorderThickness, 0) solid var(--MenuBarBorderBrush, transparent);
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  font-size: var(--ControlContentThemeFontSize, 14px);
}
.win-menu-bar-content-root {
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
}
.win-menu-bar-items-presenter {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  min-width: 0;
  min-height: 0;
  height: 100%;
}
</style>
