<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="win-menu-flyout-overlay"
      :class="{ 'allows-anchor-hover': OverlayInputPassThroughElement }"
      @pointerdown="close">
    </div>
    <div
      v-if="visible"
      class="win-menu-flyout-wrap"
      :class="[themeClass, isClosing ? 'is-closing' : '', openDirection === 'up' ? 'from-bottom' : '', shadowVisible ? 'shadow-visible' : '']"
      :style="posStyle"
      @pointerenter="emit('PointerEnter')"
      @pointerleave="emit('PointerLeave')">
      <div :key="animationKey" class="win-menu-flyout" @animationend="onAnimEnd">
        <WinScrollViewer
          class="win-menu-flyout-scroll"
          :class="{ 'has-submenu': hasSubmenu }"
          VerticalScrollMode="Auto"
          VerticalScrollBarVisibility="Auto"
          HorizontalScrollMode="Disabled"
          HorizontalScrollBarVisibility="Disabled">
          <MenuFlyoutItems
            :Items="Items"
            @Select="onItemSelect"
            @PointerEnter="emit('PointerEnter')"
            @PointerLeave="emit('PointerLeave')" />
          <slot></slot>
        </WinScrollViewer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { Teleport, computed, defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import WinScrollViewer from './WinScrollViewer.vue';
import WinTextBlock from './WinTextBlock.vue';

const props = defineProps({
  Open: Boolean,
  AnchorRect: Object,
  Items: { type: Array, default: () => [] },
  Placement: { type: String, default: 'Bottom' },
  MinWidth: { type: [Number, String], default: 20 },
  Theme: { type: String, default: '' },
  Gap: { type: Number, default: 6 },
  OverlayInputPassThroughElement: Boolean
});

const emit = defineEmits(['Close', 'close', 'Select', 'select', 'PointerEnter', 'PointerLeave']);
const shadowVisible = ref(false);
const visible = ref(false);
const isClosing = ref(false);
const openDirection = ref('down');
const animationKey = ref(0);
const windowHeight = ref(typeof window === 'undefined' ? 600 : window.innerHeight);

const themeClass = computed(() => props.Theme === 'light' || props.Theme === 'dark' ? `win-theme-scope theme-${props.Theme}` : '');
const hasSubmenu = computed(() => props.Items.some((item) => getItemKind(item) === 'MenuFlyoutSubItem'));

const MenuFlyoutItems = defineComponent({
  name: 'MenuFlyoutItems',
  props: {
    Items: { type: Array, default: () => [] }
  },
  emits: ['Select', 'PointerEnter', 'PointerLeave'],
  setup(itemProps, { emit: itemEmit }) {
    const openIndex = ref(null);
    const submenuAnchor = ref(null);

    const openSubmenuItem = computed(() => {
      if (openIndex.value === null) return null;
      return itemProps.Items[openIndex.value] ?? null;
    });

    const submenuStyle = computed(() => {
      const rect = submenuAnchor.value;
      if (!rect) return {};
      const margin = 8;
      const estimatedWidth = 220;
      const estimatedHeight = estimateFlyoutHeight(openSubmenuItem.value?.Items || []);
      const opensLeft = rect.right + estimatedWidth + margin > window.innerWidth && rect.left >= estimatedWidth + margin;
      const left = opensLeft ? rect.left - estimatedWidth - 2 : rect.right + 2;
      const maxTop = Math.max(margin, window.innerHeight - estimatedHeight - margin);
      const top = Math.min(Math.max(margin, rect.top - 4), maxTop);
      return {
        left: `${left}px`,
        top: `${top}px`,
        '--flyout-min-width': `${estimatedWidth}px`,
        '--flyout-max-height': `${Math.max(120, window.innerHeight - top - margin)}px`
      };
    });

    const getKeyboardAcceleratorText = (item) => {
      if (item?.KeyboardAcceleratorTextOverride) return item.KeyboardAcceleratorTextOverride;
      const accelerator = item?.KeyboardAccelerators?.[0];
      if (!accelerator) return '';
      const { Key, Modifiers = [] } = accelerator;
      const parts = [];
      if (Modifiers.includes('Control')) parts.push('Ctrl');
      if (Modifiers.includes('Shift')) parts.push('Shift');
      if (Modifiers.includes('Alt')) parts.push('Alt');
      if (Key) parts.push(String(Key).toUpperCase());
      return parts.join('+');
    };

    const closeSubmenu = () => {
      openIndex.value = null;
      submenuAnchor.value = null;
    };

    const openSubmenu = (index, event) => {
      if (isItemDisabled(itemProps.Items[index])) return;
      openIndex.value = index;
      submenuAnchor.value = event.currentTarget.getBoundingClientRect();
      itemEmit('PointerEnter');
    };

    const selectItem = (item, index) => {
      if (isItemDisabled(item)) return;
      itemEmit('Select', { item, index });
    };

    const renderMenuItem = (item, index) => {
      const kind = getItemKind(item);
      if (kind === 'MenuFlyoutSeparator') {
        return h('div', {
          key: index,
          class: 'win-menu-flyout-separator',
          role: 'separator'
        });
      }

      if (kind === 'MenuFlyoutSubItem' || kind === 'SplitMenuFlyoutItem') {
        const isSplit = kind === 'SplitMenuFlyoutItem';
        return h('div', {
          key: index,
          class: ['win-menu-flyout-item', 'win-menu-flyout-subitem', {
            'win-menu-flyout-splititem': isSplit,
            'is-disabled': isItemDisabled(item),
            'is-open': openIndex.value === index
          }],
          role: 'menuitem',
          'aria-disabled': isItemDisabled(item),
          'aria-haspopup': true,
          'aria-expanded': openIndex.value === index,
          onPointerenter: (event) => openSubmenu(index, event),
          onClick: (event) => {
            event.stopPropagation();
            if (isSplit) selectItem(item, index);
            else openSubmenu(index, event);
          }
        }, [
          item.Icon ? h('span', { class: 'icon win-menu-flyout-icon' }, item.Icon) : null,
          h(WinTextBlock, { class: 'win-menu-flyout-label', Text: item.Text || String(item) }),
          isSplit ? h('span', { class: 'win-menu-flyout-split-divider', 'aria-hidden': true }) : null,
          h('button', {
            class: 'win-menu-flyout-chevron-button',
            type: 'button',
            tabindex: -1,
            onClick: (event) => {
              event.stopPropagation();
              openSubmenu(index, event);
            }
          }, h('span', { class: 'icon win-menu-flyout-chevron' }, '\uE974'))
        ]);
      }

      const acceleratorText = getKeyboardAcceleratorText(item);
      return h('button', {
        key: index,
        class: ['win-menu-flyout-item', {
          'is-disabled': isItemDisabled(item),
          'is-checked': isItemChecked(item),
          'is-toggle': kind === 'ToggleMenuFlyoutItem',
          'is-radio': kind === 'RadioMenuFlyoutItem'
        }],
        type: 'button',
        role: 'menuitem',
        disabled: isItemDisabled(item),
        onPointerenter: closeSubmenu,
        onClick: () => selectItem(item, index)
      }, [
        item.Icon ? h('span', { class: 'icon win-menu-flyout-icon' }, item.Icon) : null,
        !item.Icon && isItemChecked(item) ? h('span', { class: 'icon win-menu-flyout-check' }, kind === 'RadioMenuFlyoutItem' ? '\uE915' : '\uE73E') : null,
        !item.Icon && !isItemChecked(item) && (kind === 'ToggleMenuFlyoutItem' || kind === 'RadioMenuFlyoutItem') ? h('span', { class: 'win-menu-flyout-check-placeholder' }) : null,
        h(WinTextBlock, { class: 'win-menu-flyout-label', Text: item.Text || String(item) }),
        acceleratorText ? h(WinTextBlock, { class: 'win-menu-flyout-accelerator', Text: acceleratorText }) : null
      ]);
    };

    return () => [
      ...itemProps.Items.map(renderMenuItem),
      openSubmenuItem.value
        ? h(Teleport, { to: 'body' }, h('div', {
          class: ['win-menu-flyout-wrap', 'win-menu-submenu-wrap', 'shadow-visible', themeClass.value],
          style: submenuStyle.value,
          onPointerenter: () => itemEmit('PointerEnter'),
          onPointerleave: () => itemEmit('PointerLeave')
        }, h('div', {
          class: 'win-menu-submenu-flyout',
          role: 'menu'
        }, h(MenuFlyoutItems, {
          Items: openSubmenuItem.value.Items || [],
          onSelect: (event) => itemEmit('Select', event),
          onPointerEnter: () => itemEmit('PointerEnter'),
          onPointerLeave: () => itemEmit('PointerLeave')
        }))))
        : null
    ];
  }
});

const updateWindowHeight = () => {
  windowHeight.value = window.innerHeight;
};

onMounted(() => {
  updateWindowHeight();
  window.addEventListener('resize', updateWindowHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWindowHeight);
});

watch(() => props.Open, (value) => {
  if (value) {
    visible.value = true;
    isClosing.value = false;
    shadowVisible.value = false;
    animationKey.value += 1;
  } else if (visible.value) {
    isClosing.value = true;
    window.setTimeout(() => {
      visible.value = false;
      isClosing.value = false;
    }, 150);
  }
}, { immediate: true });

watch(() => props.AnchorRect, () => {
  if (props.Open) {
    shadowVisible.value = false;
    animationKey.value += 1;
  }
});

const close = () => {
  emit('Close');
  emit('close');
};

const onItemSelect = ({ item, index }) => {
  if (isItemDisabled(item)) return;
  updateToggleItem(item);
  updateRadioGroup(item);
  emit('Select', item, index);
  emit('select', item, index);
};

const onAnimEnd = () => {
  if (!isClosing.value) shadowVisible.value = true;
};

const posStyle = computed(() => {
  if (!props.AnchorRect) return {};
  const rect = props.AnchorRect;
  const viewHeight = windowHeight.value;
  const margin = 8;
  const gap = props.Placement === 'Right' || props.Placement === 'RightEdgeAlignedTop' ? 0 : props.Gap;
  const spaceBelow = viewHeight - rect.bottom - gap - margin;
  const spaceAbove = rect.top - gap - margin;
  const estimatedHeight = estimateFlyoutHeight(props.Items);
  const minWidth = cssSize(props.MinWidth);

  if (props.Placement === 'Right' || props.Placement === 'RightEdgeAlignedTop') {
    openDirection.value = 'down';
    return {
      top: `${rect.top}px`,
      left: `${rect.right}px`,
      '--flyout-max-height': `${Math.max(0, viewHeight - rect.top - margin)}px`,
      '--flyout-min-width': minWidth
    };
  }

  const alignRight = props.Placement === 'BottomEdgeAlignedRight';
  const alignLeft = props.Placement === 'BottomEdgeAlignedLeft';
  if (spaceBelow >= estimatedHeight || spaceBelow >= spaceAbove) {
    openDirection.value = 'down';
    return {
      top: `${rect.bottom + gap}px`,
      left: alignRight ? `${rect.right}px` : alignLeft ? `${rect.left}px` : `${rect.left + rect.width / 2}px`,
      transform: alignRight ? 'translateX(-100%)' : alignLeft ? undefined : 'translateX(-50%)',
      '--flyout-max-height': `${Math.max(0, spaceBelow)}px`,
      '--flyout-min-width': minWidth
    };
  }

  openDirection.value = 'up';
  return {
    bottom: `${viewHeight - rect.top + gap}px`,
    left: alignRight ? `${rect.right}px` : alignLeft ? `${rect.left}px` : `${rect.left + rect.width / 2}px`,
    transform: alignRight ? 'translateX(-100%)' : alignLeft ? undefined : 'translateX(-50%)',
    '--flyout-max-height': `${Math.max(0, spaceAbove)}px`,
    '--flyout-min-width': minWidth
  };
});

const cssSize = (value) => typeof value === 'number' ? `${value}px` : value;
const updateRadioGroup = (item) => {
  if (!item?.GroupName) return;
  const update = (items) => {
    items.forEach((candidate) => {
      if (candidate.GroupName === item.GroupName) candidate.IsChecked = candidate === item;
      if (candidate.Items) update(candidate.Items);
    });
  };
  update(props.Items);
};
const updateToggleItem = (item) => {
  if (getItemKind(item) !== 'ToggleMenuFlyoutItem') return;
  item.IsChecked = !item.IsChecked;
};
const estimateFlyoutHeight = (items) => {
  const itemCount = items.filter((item) => getItemKind(item) !== 'MenuFlyoutSeparator').length;
  const separatorCount = items.length - itemCount;
  return 8 + itemCount * 34 + separatorCount * 9;
};
const getItemKind = (item) => item?.Kind ?? (item?.Items ? 'MenuFlyoutSubItem' : '');
const isItemDisabled = (item) => item?.IsEnabled === false;
const isItemChecked = (item) => Boolean(item?.IsChecked);
</script>

<style>
.win-menu-flyout-wrap {
  position: fixed;
  z-index: 1000;
  border-radius: 8px;
  overflow: visible;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  transition: box-shadow 200ms ease;
}

.win-menu-flyout-wrap.shadow-visible {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
}

.win-menu-flyout-wrap.is-closing {
  animation: flyout-fade-out 100ms ease forwards;
  pointer-events: none;
}

.win-menu-flyout {
  position: relative;
  --win-acrylic-fill: var(--flyout-bg, var(--layer-default));
  --flyout-scroll-max-height: calc(var(--flyout-max-height, 600px) - 10px);
  min-width: var(--flyout-min-width, 20px);
  max-height: var(--flyout-max-height, 600px);
  padding: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--flyout-border);
  border-radius: 8px;
  isolation: isolate;
  background: transparent;
  -webkit-backdrop-filter: var(--flyout-backdrop);
  backdrop-filter: var(--flyout-backdrop);
  animation: flyout-menu-open-down 250ms cubic-bezier(0.1, 0.9, 0.2, 1) both, flyout-menu-opacity 83ms linear both;
}

.win-menu-flyout:has(.win-menu-flyout-scroll.has-submenu) {
  overflow: visible;
}

.win-menu-flyout-wrap.from-bottom .win-menu-flyout {
  animation-name: flyout-menu-open-up, flyout-menu-opacity;
}

.win-menu-flyout-scroll {
  display: flex;
  flex-direction: column;
  max-height: var(--flyout-scroll-max-height, 70vh);
}

.win-menu-flyout-scroll > .win-scroll-viewer-viewport {
  height: auto;
  max-height: inherit;
}

.win-menu-flyout-scroll :deep(.scroll-content) {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.win-menu-flyout-scroll.has-submenu {
}

.win-menu-flyout-item {
  width: 100%;
  min-height: 32px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  text-align: left;
  white-space: nowrap;
  user-select: none;
}

.win-menu-flyout-item:hover:not(.is-disabled) {
  background: var(--subtle-secondary);
}

.win-menu-flyout-subitem {
  position: relative;
}

.win-menu-flyout-splititem {
  padding-right: 0;
}

.win-menu-flyout-split-divider {
  align-self: stretch;
  width: 1px;
  margin: -2px 0 -2px 12px;
  background: var(--divider-stroke-default, var(--stroke-divider));
}

.win-menu-flyout-chevron-button {
  width: 32px;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--text-secondary);
}

.win-menu-flyout-chevron-button:hover {
  background: var(--subtle-secondary);
}

.win-menu-flyout-subitem.is-open {
  background: var(--subtle-secondary);
}

.win-menu-flyout-item:active:not(.is-disabled) {
  background: var(--subtle-tertiary);
  color: var(--text-secondary);
}

.win-menu-flyout-item.is-disabled {
  color: var(--text-disabled);
  cursor: default;
}

.win-menu-flyout-label {
  flex: 1;
  min-width: 0;
}

.win-menu-flyout-accelerator {
  width: 68px;
  flex: 0 0 68px;
  margin-left: 24px;
  margin-right: 0;
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 14px;
  text-align: left;
}

.win-menu-flyout-icon,
.win-menu-flyout-check,
.win-menu-flyout-check-placeholder {
  width: 16px;
  min-width: 16px;
  margin-right: 12px;
  text-align: center;
  line-height: 1;
}

.win-menu-flyout-icon {
  font-size: 16px;
}

.win-menu-flyout-check {
  font-size: 12px;
}

.win-menu-flyout-chevron {
  margin-left: 24px;
  color: var(--text-secondary);
  font-size: 12px;
}

.win-menu-submenu-flyout {
  position: relative;
  --win-acrylic-fill: var(--flyout-bg, var(--layer-default));
  min-width: var(--flyout-min-width, 180px);
  max-height: var(--flyout-max-height, 600px);
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: visible;
  border: 1px solid var(--flyout-border);
  border-radius: 8px;
  isolation: isolate;
  background: transparent;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
  -webkit-backdrop-filter: var(--flyout-backdrop);
  backdrop-filter: var(--flyout-backdrop);
  animation: flyout-menu-open-down 250ms cubic-bezier(0.1, 0.9, 0.2, 1) both, flyout-menu-opacity 83ms linear both;
}

.win-menu-submenu-wrap {
  z-index: 1002;
}

.win-menu-flyout-separator {
  height: 1px;
  margin: 4px 0;
  background: var(--flyout-border);
}

.win-menu-flyout-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
}

.win-menu-flyout-overlay.allows-anchor-hover {
  pointer-events: none;
}

@keyframes flyout-fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes flyout-menu-opacity {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes flyout-menu-open-down {
  from {
    transform: translateY(-16px);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes flyout-menu-open-up {
  from {
    transform: translateY(16px);
  }
  to {
    transform: translateY(0);
  }
}

.win-menu-flyout-scroll.has-submenu {
  animation: none;
}
</style>
