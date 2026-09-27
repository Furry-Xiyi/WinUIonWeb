import { computed, defineComponent, Fragment, getCurrentInstance, h, isVNode, provide, Teleport, type PropType, type VNode } from 'vue';
import { commandBarContextKey, type CommandBarContext } from './appBarRuntime';
import { normalizeXamlNodes } from './xamlRuntime';

export const commandBarProperty = (owner: string, property: string) => defineComponent({
  name: `${owner}.${property}`,
  __commandBarProperty: property,
  setup() { return () => null; }
});
export const commandChildren = (node: VNode): VNode[] => Array.isArray(node.children)
  ? node.children.filter(isVNode)
  : (node.children as { default?: () => VNode[] } | null)?.default?.() ?? [];
export const flattenCommandNodes = (nodes: VNode[]): VNode[] => nodes.flatMap(node => {
  if (node.type === Fragment) return flattenCommandNodes(commandChildren(node));
  return node.type && typeof node.type !== 'symbol' ? [node] : [];
});
export const commandKind = (node: VNode) => String((node.type as { name?: string; __name?: string }).name || (node.type as { __name?: string }).__name || '');
export const isCommandSeparator = (node: VNode) => commandKind(node) === 'AppBarSeparator';
export const commandHasIcon = (node: VNode) => Boolean(node.props?.Icon || node.props?.Command || commandChildren(node).some(child => String((child.type as { name?: string }).name || '').endsWith('.Icon')));
export const isCommandToggle = (node: VNode) => commandKind(node) === 'AppBarToggleButton';
export const isAppBarCommand = (node: VNode) => ['AppBarButton', 'AppBarToggleButton', 'AppBarSeparator', 'AppBarElementContainer'].includes(commandKind(node));
export const commandCollection = (collection: VNode[]) => {
  Object.defineProperties(collection, {
    Count: { configurable: true, get: () => collection.length },
    Size: { configurable: true, get: () => collection.length },
    Add: { configurable: true, value: (node: VNode) => { if (!isVNode(node)) throw new TypeError('Command collection requires AppBar command elements'); collection.push(node); } },
    Append: { configurable: true, value: (node: VNode) => { if (!isVNode(node)) throw new TypeError('Command collection requires AppBar command elements'); collection.push(node); } },
    RemoveAt: { configurable: true, value: (index: number) => { if (index < 0 || index >= collection.length) throw new RangeError('Command collection index is out of range'); collection.splice(index, 1); } },
    Clear: { configurable: true, value: () => collection.splice(0) },
    GetAt: { configurable: true, value: (index: number) => collection[index] },
    InsertAt: { configurable: true, value: (index: number, node: VNode) => { if (!isVNode(node)) throw new TypeError('Command collection requires AppBar command elements'); collection.splice(index, 0, node); } },
    SetAt: { configurable: true, value: (index: number, node: VNode) => { if (!isVNode(node)) throw new TypeError('Command collection requires AppBar command elements'); collection.splice(index, 1, node); } }
  });
  return collection;
};

// Persistent hosts preserve the command instance when dynamic overflow moves
// its element between the official primary and secondary presenters.
export const CommandPortal = defineComponent({
  name: 'CommandBarCommandPortal',
  props: {
    node: { type: Object as PropType<VNode>, required: true },
    host: { type: Object as PropType<HTMLElement>, required: true },
    overflow: { type: Boolean, required: true },
    context: { type: Object as PropType<CommandBarContext>, required: true }
  },
  setup(props) {
    const instance = getCurrentInstance();
    provide(commandBarContextKey, { ...props.context, isInOverflow: computed(() => props.overflow) });
    return () => h(Teleport, { to: props.host }, normalizeXamlNodes([props.node], instance));
  }
});
export const CommandOutlet = defineComponent({
  name: 'CommandBarCommandsOutlet',
  props: {
    nodes: { type: Array as PropType<VNode[]>, required: true },
    context: { type: Object as PropType<CommandBarContext>, required: true }
  },
  setup(props) {
    const instance = getCurrentInstance();
    provide(commandBarContextKey, props.context);
    return () => h(Fragment, normalizeXamlNodes(props.nodes, instance));
  }
});
