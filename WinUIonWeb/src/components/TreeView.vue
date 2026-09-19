<template>
    <div class="win-tree-view"
       :class="{ disabled }"
       :style="rootStyle"
       role="tree"
       @dragover="onRootDragOver"
       @drop="onRootDrop">
    <TreeViewNode v-for="(node, idx) in items" :key="node.Id ?? idx" :Node="node"
      :Depth="0" :SelectionMode="selectionMode" :Disabled="disabled"
      :CanDragItems="canDragItems" :AllowDrop="allowDrop" :TemplateNodes="itemTemplateNodes"
      :TemplateSelector="templateSelector"
      :ParentItems="items" :Index="idx"
      @Select="toggleSelect"
      @Expand="onNodeExpand"
      @DragItemsStarting="onNodeDragItemsStarting"
      @DragItemsCompleted="onNodeDragItemsCompleted" />
  </div>
</template>

<script>
import { CollectionItemTemplate } from './CollectionProperties'

export default {
  ItemTemplate: CollectionItemTemplate
}
</script>

<script setup>
import { computed, defineComponent, Fragment, getCurrentInstance, h, ref, shallowRef, useAttrs, useSlots } from 'vue';
import { getCollectionProperty, getVNodeChildren } from './CollectionProperties';
import { materializeXamlVNode, resolveXamlHandler, resolveXamlValue } from './xamlRuntime';

const props = defineProps({
  ItemsSource: { type: [String, Array, Object], default: null },
  SelectionMode: { type: String, default: undefined },
  CanDragItems: { type: [Boolean, String], default: undefined },
  AllowDrop: { type: [Boolean, String], default: undefined },
  IsEnabled: { type: [Boolean, String], default: true },
  SelectedItem: { type: Object, default: null },
  SelectedItems: { type: Array, default: null },
  ItemTemplateSelector: { type: [Object, String], default: null }
  ,Width: { type: [String, Number], default: '' }
  ,Height: { type: [String, Number], default: '' }
  ,MinWidth: { type: [String, Number], default: '' }
  ,MinHeight: { type: [String, Number], default: '' }
  ,MaxWidth: { type: [String, Number], default: '' }
  ,MaxHeight: { type: [String, Number], default: '' }
  ,Margin: { type: [String, Number], default: '' }
  ,HorizontalAlignment: { type: String, default: 'Stretch' }
  ,VerticalAlignment: { type: String, default: 'Stretch' }
});
const slots = useSlots();
const attrs = useAttrs();
const instance = getCurrentInstance();
const slotNodes = shallowRef(slots.default?.() ?? []);
const itemTemplateNodes = computed(() => {
  for (const node of slotNodes.value) {
    if (getCollectionProperty(node) === 'itemTemplate') return getVNodeChildren(node);
  }
  return [];
});
const emit = defineEmits(['update:ItemsSource', 'update:SelectedItem', 'update:SelectedItems', 'SelectionChanged', 'ItemInvoked', 'Expanding', 'Expanded', 'Collapsing', 'Collapsed', 'DragItemsStarting', 'DragItemsCompleted']);
const items = computed(() => {
  const source = resolveXamlValue(props.ItemsSource, instance);
  return Array.isArray(source) ? source : [];
});
const selectionMode = computed(() => resolveXamlValue(props.SelectionMode, instance) ?? 'Single');
// WinUI defaults both capabilities to false.  Treat an omitted dependency
// property as the default instead of making every TreeView draggable.
const canDragItems = computed(() => resolveXamlValue(props.CanDragItems, instance) === true);
const allowDrop = computed(() => resolveXamlValue(props.AllowDrop, instance) === true);
const rootRef = computed(() => items.value);
const hoverState = ref({ idx: -1, pos: null });
let activeTreeDrag = null;
const disabled = computed(() => resolveXamlValue(props.IsEnabled, instance) === false);
const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return undefined;
  return typeof value === 'number' || /^-?\d+(?:\.\d+)?$/.test(String(value).trim()) ? `${value}px` : String(value);
};
const xamlThickness = (value) => {
  if (value === '' || value === undefined || value === null) return undefined;
  const p = String(value).split(',').map((part) => cssLength(part.trim())).filter(Boolean);
  if (p.length === 1) return p[0];
  if (p.length === 2) return `${p[1]} ${p[0]}`;
  if (p.length === 4) return `${p[1]} ${p[2]} ${p[3]} ${p[0]}`;
  return undefined;
};
const rootStyle = computed(() => ({
  width: cssLength(resolveXamlValue(props.Width, instance)),
  height: cssLength(resolveXamlValue(props.Height, instance)),
  minWidth: cssLength(resolveXamlValue(props.MinWidth, instance)),
  minHeight: cssLength(resolveXamlValue(props.MinHeight, instance)),
  maxWidth: cssLength(resolveXamlValue(props.MaxWidth, instance)),
  maxHeight: cssLength(resolveXamlValue(props.MaxHeight, instance)),
  margin: xamlThickness(resolveXamlValue(props.Margin, instance)),
  justifySelf: ({ Left: 'start', Center: 'center', Right: 'end', Stretch: 'stretch' })[resolveXamlValue(props.HorizontalAlignment, instance)] || undefined,
  alignSelf: ({ Top: 'start', Center: 'center', Bottom: 'end', Stretch: 'stretch' })[resolveXamlValue(props.VerticalAlignment, instance)] || undefined
}));

/* --- 复选与多级联动逻辑 --- */
const childrenOf = (node) => Array.isArray(node?.Children) ? node.Children : Array.isArray(node?.ItemsSource) ? node.ItemsSource : [];
const childrenInfo = (node) => {
  if (Array.isArray(node?.Children)) return { items: node.Children, key: 'Children' };
  if (Array.isArray(node?.ItemsSource)) return { items: node.ItemsSource, key: 'ItemsSource' };
  return { items: [], key: 'Children' };
};
const isExpanded = (node) => node?.IsExpanded === true;
const hasChildren = (node) => childrenOf(node).length > 0;
const contentOf = (node) => node?.Content ?? node?.Name ?? node?.Label ?? node?.Title ?? node ?? '';
const templateSelector = computed(() => {
  const bound = resolveXamlValue(props.ItemTemplateSelector, instance);
  if (bound && typeof bound === 'object' && typeof bound.SelectTemplate === 'function') return bound;
  return null;
});
const selectedNodes = (nodes) => nodes.flatMap((node) => [
  ...(node?.IsSelected ? [node] : []),
  ...selectedNodes(childrenOf(node))
]);

const isAllSelected = (node) => {
  if (!hasChildren(node)) return !!node.IsSelected;
  return childrenOf(node).every(c => isAllSelected(c));
};

const isAnySelected = (node) => {
  if (!hasChildren(node)) return !!node.IsSelected;
  return childrenOf(node).some(c => isAnySelected(c));
};

/* --- 选中及点击逻辑 --- */

const clearSelection = (itemsArray) => {
  for (const item of itemsArray) {
    item.IsSelected = false;
    childrenOf(item).forEach(child => clearSelection([child]));
  }
};

const toggleSelect = (node) => {
  if (disabled.value) return;
  const previous = selectedNodes(rootRef.value);
  if (selectionMode.value === 'Single') {
    clearSelection(rootRef.value);
    node.IsSelected = true;
    emit('update:SelectedItem', node);
  } else if (selectionMode.value === 'Multiple') {
    const selected = previous.includes(node);
    node.IsSelected = !selected;
    emit('update:SelectedItems', selectedNodes(rootRef.value));
  } else if (selectionMode.value === 'Extended') {
    const current = selectedNodes(rootRef.value);
    const next = current.includes(node) ? current.filter((item) => item !== node) : [...current, node];
    clearSelection(rootRef.value);
    for (const item of next) item.IsSelected = true;
    emit('update:SelectedItems', next);
  }
  const selected = selectedNodes(rootRef.value);
  const selectionArgs = { SelectedItem: node, SelectedItems: selected, AddedItems: selected.filter((item) => !previous.includes(item)), RemovedItems: previous.filter((item) => !selected.includes(item)) };
  const invokeArgs = { InvokedItem: node, OriginalSource: null };
  emit('ItemInvoked', invokeArgs);
  resolveXamlHandler(attrs.ItemInvoked, instance)?.(invokeArgs);
  emit('SelectionChanged', selectionArgs);
  resolveXamlHandler(attrs.SelectionChanged, instance)?.(selectionArgs);
  emit('update:ItemsSource', [...items.value]);
};

const onRootDragOver = (event) => {
  if (!allowDrop.value || disabled.value || !activeTreeDrag) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
};

// Recursive nodes bubble their drag lifecycle through this root namescope so
// XAML handlers observe the same events regardless of hierarchy depth.
const onNodeDragItemsStarting = (args) => {
  emit('DragItemsStarting', args);
  resolveXamlHandler(attrs.DragItemsStarting, instance)?.(args);
};
const onNodeDragItemsCompleted = (args) => {
  emit('DragItemsCompleted', args);
  resolveXamlHandler(attrs.DragItemsCompleted, instance)?.(args);
};

const onNodeExpand = (node) => {
  // The node mutates its own IsExpanded flag, but the public TreeView event
  // still needs to reach the page namescope for XAML handlers.
  emit('update:ItemsSource', [...items.value]);
  emit('Expanded', { Node: node, Item: node });
  resolveXamlHandler(attrs.Expanded, instance)?.({ Node: node, Item: node });
};

const onRootDrop = (event) => {
  if (!allowDrop.value || disabled.value) return;
  const drag = activeTreeDrag;
  if (!drag || !drag.node || items.value.includes(drag.node)) return;
  event.preventDefault();
  event.stopPropagation();
  const sourceIndex = drag.parentArr.indexOf(drag.node);
  if (sourceIndex < 0) return;
  drag.parentArr.splice(sourceIndex, 1);
  items.value.push(drag.node);
  activeTreeDrag = null;
  const args = { Items: [drag.node], NewParentItem: null, DropResult: 'Move' };
  emit('update:ItemsSource', [...items.value]);
  onNodeDragItemsCompleted(args);
};

const TreeViewNode = defineComponent({
  name: 'TreeViewNode',
  props: {
    Node: { type: Object, required: true },
    Depth: { type: Number, required: true },
    SelectionMode: { type: String, required: true },
    Disabled: { type: Boolean, default: false },
    CanDragItems: { type: Boolean, default: false },
    AllowDrop: { type: Boolean, default: true },
    TemplateNodes: { type: Array, default: () => [] },
    TemplateSelector: { type: null, default: null },
    ParentItems: { type: Array, default: () => [] },
    Index: { type: Number, required: true }
  },
  emits: ['Select', 'Expand', 'DragItemsStarting', 'DragItemsCompleted'],
  setup(nodeProps, { emit: nodeEmit }) {
    const node = computed(() => nodeProps.Node);
    const children = computed(() => childrenOf(node.value));
    const expanded = computed(() => isExpanded(node.value));
    const selected = computed(() => node.value?.IsSelected === true);
    const dropPosition = ref(null);
    const contentTemplate = defineComponent({
      setup() {
        return () => {
          const selector = nodeProps.TemplateSelector;
          if (selector && typeof selector.SelectTemplate === 'function') {
            const selected = selector.SelectTemplate(node.value);
            if (selected && typeof selected === 'object' && selected.default) {
              return h(Fragment, selected.default());
            }
            if (selected && (typeof selected === 'object' || typeof selected === 'function')) {
              return h(selected, { Item: node.value });
            }
          }
          return nodeProps.TemplateNodes.length
            ? h(Fragment, materializeXamlVNode(nodeProps.TemplateNodes, node.value, instance))
            : h('span', String(contentOf(node.value)));
        };
      }
    });
    const expand = () => {
      if (nodeProps.Disabled || !children.value.length) return;
      const wasExpanded = expanded.value;
      nodeEmit(wasExpanded ? 'Collapsing' : 'Expanding', { Node: node.value, Item: node.value });
      node.value.IsExpanded = !wasExpanded;
      nodeEmit(node.value.IsExpanded ? 'Expanded' : 'Collapsed', { Node: node.value, Item: node.value });
      node.value.Depth = nodeProps.Depth;
      nodeEmit('Expand', node.value);
    };
    const isBelow = (parent, target) => parent === target || childrenOf(parent).some((child) => isBelow(child, target));
    const dragStart = (event) => {
      if (!nodeProps.CanDragItems || nodeProps.Disabled) return;
      activeTreeDrag = { node: node.value, parentArr: nodeProps.ParentItems };
      const args = { Items: [node.value], Data: event.dataTransfer, Cancel: false };
      nodeEmit('DragItemsStarting', args);
      if (args.Cancel) { activeTreeDrag = null; event.preventDefault(); return; }
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', '');
      }
    };
    const dragOver = (event) => {
      if (!nodeProps.AllowDrop || nodeProps.Disabled || !activeTreeDrag) return;
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      const y = (event.clientY - rect.top) / Math.max(1, rect.height);
      dropPosition.value = y < .25 ? 'before' : y > .75 ? 'after' : 'inside';
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    };
    const dragLeave = () => { dropPosition.value = null; };
    const drop = (event) => {
      if (!nodeProps.AllowDrop || nodeProps.Disabled) return;
      event.preventDefault();
      event.stopPropagation();
      const drag = activeTreeDrag;
      if (!drag || drag.node === node.value || isBelow(drag.node, node.value)) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const y = (event.clientY - rect.top) / Math.max(1, rect.height);
      const position = dropPosition.value ?? (y < .25 ? 'before' : y > .75 ? 'after' : 'inside');
      const sourceArray = drag.parentArr;
      const sourceIndex = sourceArray.indexOf(drag.node);
      if (sourceIndex < 0) return;
      let newParentItem = null;
      if (position === 'inside') {
        const targetInfo = childrenInfo(node.value);
        if (!Array.isArray(node.value[targetInfo.key])) node.value[targetInfo.key] = [];
        sourceArray.splice(sourceIndex, 1);
        targetInfo.items.push(drag.node);
        node.value.IsExpanded = true;
        newParentItem = node.value;
      } else {
        const targetArray = nodeProps.ParentItems;
        const targetIndex = targetArray.indexOf(node.value);
        if (targetIndex < 0) return;
        sourceArray.splice(sourceIndex, 1);
        const adjustedTargetIndex = sourceArray === targetArray && sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
        const insertionIndex = adjustedTargetIndex + (position === 'after' ? 1 : 0);
        targetArray.splice(Math.max(0, insertionIndex), 0, drag.node);
      }
      activeTreeDrag = null;
      dropPosition.value = null;
      const args = { Items: [drag.node], NewParentItem: newParentItem, DropResult: 'Move' };
      nodeEmit('DragItemsCompleted', args);
    };
    const select = () => nodeEmit('Select', node.value);
    const keydown = (event) => {
      if (event.key === 'ArrowRight' && children.value.length && !expanded.value) { event.preventDefault(); expand(); }
      else if (event.key === 'ArrowLeft' && children.value.length && expanded.value) { event.preventDefault(); expand(); }
      else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(); }
    };
    return () => h('div', { class: 'win-tree-node', key: node.value?.Id ?? nodeProps.Index }, [
      h('div', {
        class: ['tree-item', { selected: selected.value, 'drop-top': dropPosition.value === 'before', 'drop-bottom': dropPosition.value === 'after', 'drop-inside': dropPosition.value === 'inside' }],
        style: { '--tree-depth': nodeProps.Depth },
        tabindex: nodeProps.Disabled ? -1 : 0,
        role: 'treeitem',
        'aria-selected': String(selected.value),
        'aria-expanded': children.value.length ? String(expanded.value) : undefined,
        draggable: nodeProps.CanDragItems && !nodeProps.Disabled,
        onClick: select,
        onKeydown: keydown,
        onDragstart: dragStart,
        onDragover: dragOver,
        onDragleave: dragLeave,
        onDrop: drop,
        onDragend: () => { activeTreeDrag = null; dropPosition.value = null; }
      }, [
        nodeProps.SelectionMode === 'Multiple'
          ? h('span', {
              class: ['tree-checkbox', { checked: selected.value }],
              role: 'checkbox',
              'aria-checked': String(selected.value),
              onClick: (event) => { event.stopPropagation(); select(); }
            }, selected.value ? '\uE73E' : '\uE739')
          : null,
        h('span', { class: ['icon', 'tree-chevron', { expanded: expanded.value, hidden: !children.value.length }], onClick: (event) => { event.stopPropagation(); expand(); } }, '\uE76C'),
        h('div', { class: 'tree-item-content' }, [h(contentTemplate)])
      ]),
      expanded.value && children.value.length
        ? h('div', { class: 'tree-children' }, children.value.map((child, childIndex) => h(TreeViewNode, {
            key: child.Id ?? childIndex,
            Node: child,
            Depth: nodeProps.Depth + 1,
            SelectionMode: nodeProps.SelectionMode,
            Disabled: nodeProps.Disabled,
            CanDragItems: nodeProps.CanDragItems,
            AllowDrop: nodeProps.AllowDrop,
            TemplateNodes: nodeProps.TemplateNodes,
            TemplateSelector: nodeProps.TemplateSelector,
            ParentItems: children.value,
            Index: childIndex,
            onSelect: (item) => nodeEmit('Select', item),
            onExpand: (item) => nodeEmit('Expand', item),
            onDragItemsStarting: onNodeDragItemsStarting,
            onDragItemsCompleted: (args) => nodeEmit('DragItemsCompleted', args)
          })))
        : null
    ]);
  }
});

</script>

<style>
  .win-tree-view {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
  }

  .win-tree-view.disabled { opacity: var(--ControlDisabledOpacity, .36); pointer-events: none; }

  .win-tree-node {
    display: flex;
    flex-direction: column;
  }

  .tree-item {
    position: relative;
    display: flex;
    align-items: center;
    min-height: var(--TreeViewItemMinHeight, 44px);
    height: 44px;
    border-radius: var(--TreeViewItemCornerRadius, 4px);
    cursor: default;
    box-sizing: border-box;
    margin: 0 4px;
    padding: 0;
    padding-left: calc(var(--tree-depth, 0) * 16px);
    transition: background-color var(--fast-duration);
    color: var(--TreeViewItemForeground, var(--text-primary));
    border: 0;
  }

    .tree-item::before {
      content: '';
      width: 3px;
      height: 16px;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      flex: 0 0 3px;
      background: transparent;
      border-radius: 1px;
    }

    .tree-item:hover {
      background: var(--TreeViewItemBackgroundPointerOver, var(--subtle-secondary));
    }

    .tree-item:active {
      background: var(--TreeViewItemBackgroundPressed, var(--subtle-tertiary));
    }

    .tree-item.selected {
      background: var(--TreeViewItemBackgroundSelected, var(--subtle-secondary));
    }

    .tree-item.selected::before {
      background: var(--TreeViewItemSelectionIndicatorForeground, var(--accent-base));
    }

      .tree-item.selected:hover {
        background: var(--subtle-tertiary);
      }

    /* Reorder feedback is kept outside the item geometry. */
    .tree-item.drop-top {
      box-shadow: inset 0 2px 0 var(--AccentFillColorDefaultBrush, var(--accent-base));
    }

    .tree-item.drop-bottom {
      box-shadow: inset 0 -2px 0 var(--AccentFillColorDefaultBrush, var(--accent-base));
    }

    .tree-item.drop-inside {
      background: var(--TreeViewItemBackgroundPressed, var(--subtle-tertiary));
    }

  .tree-checkbox {
    display: flex;
    align-items: center;
    width: 32px;
    min-width: 32px;
    min-height: 44px;
    margin: 0 0 0 10px;
    font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif;
    font-size: 16px;
    color: var(--TreeViewItemForeground, var(--text-primary));
  }

  .tree-item-content {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    min-height: var(--TreeViewItemContentHeight, 20px);
  }

  /* 子代包裹层取消缩进距，让其子项占满整个左侧宽度以吸收左侧掉落 */
  .tree-children {
    display: flex;
    flex-direction: column;
  }

  .tree-chevron {
    font-size: 12px;
    box-sizing: border-box;
    width: 40px;
    min-width: 40px;
    height: 20px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform var(--fast-duration);
    flex-shrink: 0;
  }

    .tree-chevron.hidden {
      visibility: hidden;
    }

    .tree-chevron.expanded {
      transform: rotate(90deg);
    }
</style>
