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
      :class="[
        themeClass,
        isClosing ? 'is-closing' : '',
        CloseAnimation === 'Reverse' ? 'reverse-close' : '',
        CloseAnimation === 'CommandBar' ? 'commandbar-close' : '',
        openDirection === 'up' ? 'from-bottom' : ''
      ]"
      :style="[posStyle, themeStyle]"
      @pointerenter="emit('PointerEnter')"
      @pointerleave="emit('PointerLeave')">
      <div :key="animationKey" class="win-menu-flyout-motion">
        <div class="win-menu-flyout-shadow" aria-hidden="true"></div>
        <div class="win-menu-flyout" @focusout="onFlyoutFocusOut">
          <WinScrollViewer
            class="win-menu-flyout-scroll"
            :class="{ 'has-submenu': hasSubmenu }"
            VerticalScrollMode="Auto"
            VerticalScrollBarVisibility="Auto"
            HorizontalScrollMode="Disabled"
            HorizontalScrollBarVisibility="Disabled">
            <MenuFlyoutItems
              :Items="Items"
              :IsClosing="isClosing"
              @Select="onItemSelect"
              @Dismiss="close"
              @PointerEnter="emit('PointerEnter')"
              @PointerLeave="emit('PointerLeave')" />
            <slot></slot>
          </WinScrollViewer>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { Teleport, computed, defineComponent, h, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import WinScrollViewer from './WinScrollViewer.vue';
import WinTextBlock from './WinTextBlock.vue';

const props = defineProps({
  Open: Boolean,
  AnchorRect: Object,
  Items: { type: Array, default: () => [] },
  Placement: { type: String, default: 'Bottom' },
  MinWidth: { type: [Number, String], default: 96 },
  Theme: { type: String, default: '' },
  Gap: { type: Number, default: 6 },
  CloseAnimation: { type: String, default: '' },
  OverlayInputPassThroughElement: Boolean
});

const emit = defineEmits(['Close', 'Select', 'PointerEnter', 'PointerLeave']);
const providedTheme = inject('winuiTheme', ref(''));
const visible = ref(false);
const isClosing = ref(false);
const animationKey = ref(0);
const windowHeight = ref(typeof window === 'undefined' ? 600 : window.innerHeight);
let closeTimer;
let dismissRequested = false;

const effectiveTheme = computed(() => {
  const requestedTheme = String(props.Theme || providedTheme?.value || '').toLowerCase();
  return requestedTheme === 'light' || requestedTheme === 'dark' ? requestedTheme : '';
});
const themeClass = computed(() => effectiveTheme.value ? `win-theme-scope theme-${effectiveTheme.value}` : '');
const themeStyle = computed(() => {
  if (effectiveTheme.value === 'dark') {
    return {
      '--MenuFlyoutPresenterBorderBrush': 'rgba(0, 0, 0, 0.20)',
      '--SurfaceStrokeColorFlyoutBrush': 'rgba(0, 0, 0, 0.20)',
      '--surface-stroke-color-flyout': 'rgba(0, 0, 0, 0.20)',
      '--DividerStrokeColorDefaultBrush': 'rgba(255, 255, 255, 0.0824)',
      '--divider-stroke-default': 'rgba(255, 255, 255, 0.0824)',
      '--stroke-divider': 'rgba(255, 255, 255, 0.0824)'
    };
  }
  if (effectiveTheme.value === 'light') {
    return {
      '--MenuFlyoutPresenterBorderBrush': 'rgba(0, 0, 0, 0.0588)',
      '--SurfaceStrokeColorFlyoutBrush': 'rgba(0, 0, 0, 0.0588)',
      '--surface-stroke-color-flyout': 'rgba(0, 0, 0, 0.0588)',
      '--DividerStrokeColorDefaultBrush': 'rgba(0, 0, 0, 0.0588)',
      '--divider-stroke-default': 'rgba(0, 0, 0, 0.0588)',
      '--stroke-divider': 'rgba(0, 0, 0, 0.0588)'
    };
  }
  return {};
});
const hasSubmenu = computed(() => props.Items.some((item) => (
  ['MenuFlyoutSubItem', 'SplitMenuFlyoutItem'].includes(getItemKind(item))
)));

const MenuFlyoutItems = defineComponent({
  name: 'MenuFlyoutItems',
  props: {
    Items: { type: Array, default: () => [] },
    IsSubmenu: Boolean,
    IsClosing: Boolean
  },
  emits: ['Select', 'Dismiss', 'RequestClose', 'PointerEnter', 'PointerLeave'],
  setup(itemProps, { emit: itemEmit }) {
    const openIndex = ref(null);
    const submenuAnchor = ref(null);
    const submenuAnimationKey = ref(0);
    const itemElements = ref([]);
    const menuElement = ref(null);
    const submenuElement = ref(null);
    let openSubmenuTimer;
    let closeSubmenuTimer;

    const containsToggleItems = computed(() => itemProps.Items.some((item) => (
      ['ToggleMenuFlyoutItem', 'RadioMenuFlyoutItem'].includes(getItemKind(item))
    )));
    const containsIconItems = computed(() => itemProps.Items.some((item) => Boolean(getItemIcon(item))));
    const openSubmenuItem = computed(() => {
      if (openIndex.value === null) return null;
      return itemProps.Items[openIndex.value] ?? null;
    });

    const submenuOpensUp = computed(() => {
      const rect = submenuAnchor.value;
      if (!rect) return false;
      const height = estimateFlyoutHeight(openSubmenuItem.value?.Items || []);
      return rect.top + height + 8 > window.innerHeight && rect.bottom >= height + 8;
    });

    const submenuStyle = computed(() => {
      const rect = submenuAnchor.value;
      if (!rect) return {};
      const margin = 8;
      const estimatedWidth = estimateFlyoutWidth(openSubmenuItem.value?.Items || []);
      const estimatedHeight = estimateFlyoutHeight(openSubmenuItem.value?.Items || []);
      const opensLeft = rect.right + estimatedWidth + margin > window.innerWidth && rect.left >= estimatedWidth + margin;
      const maxTop = Math.max(margin, window.innerHeight - estimatedHeight - margin);
      const top = Math.min(Math.max(margin, rect.top - 4), maxTop);
      return {
        left: opensLeft ? 'auto' : `${rect.right - 4}px`,
        right: opensLeft ? `${window.innerWidth - rect.left - 4}px` : 'auto',
        top: `${top}px`,
        '--flyout-min-width': '96px',
        '--flyout-max-height': `${Math.max(120, window.innerHeight - top - margin)}px`
      };
    });

    const clearOpenSubmenuTimer = () => {
      if (openSubmenuTimer !== undefined) window.clearTimeout(openSubmenuTimer);
      openSubmenuTimer = undefined;
    };

    const clearCloseSubmenuTimer = () => {
      if (closeSubmenuTimer !== undefined) window.clearTimeout(closeSubmenuTimer);
      closeSubmenuTimer = undefined;
    };

    const cancelCloseChain = () => {
      clearCloseSubmenuTimer();
      itemEmit('PointerEnter');
    };

    const closeSubmenu = (restoreFocus = false) => {
      clearOpenSubmenuTimer();
      clearCloseSubmenuTimer();
      const previousIndex = openIndex.value;
      openIndex.value = null;
      submenuAnchor.value = null;
      if (restoreFocus && previousIndex !== null) {
        nextTick(() => itemElements.value[previousIndex]?.focus({ preventScroll: true }));
      }
    };

    const openSubmenu = (index, target) => {
      if (isItemDisabled(itemProps.Items[index])) return;
      clearOpenSubmenuTimer();
      clearCloseSubmenuTimer();
      openIndex.value = index;
      submenuAnchor.value = target.getBoundingClientRect();
      submenuAnimationKey.value += 1;
      cancelCloseChain();
    };

    const queueOpenSubmenu = (index, event, immediate = false) => {
      const target = event.currentTarget;
      clearOpenSubmenuTimer();
      cancelCloseChain();
      if (openIndex.value === index) return;
      if (immediate) {
        openSubmenu(index, target);
        return;
      }
      if (event.pointerType === 'touch') return;
      openSubmenuTimer = window.setTimeout(() => openSubmenu(index, target), 400);
    };

    const queueCloseSubmenu = () => {
      clearOpenSubmenuTimer();
      clearCloseSubmenuTimer();
      if (openIndex.value === null) return;
      closeSubmenuTimer = window.setTimeout(() => closeSubmenu(), 400);
    };

    const selectItem = (item, index, event) => {
      if (isItemDisabled(item)) return;
      item?.Command?.Execute?.(item.CommandParameter);
      item?.Click?.(event, item);
      itemEmit('Select', { item, index });
    };

    const focusItem = (index) => {
      const element = itemElements.value[index];
      if (element && !isItemDisabled(itemProps.Items[index])) {
        element.focus({ preventScroll: true });
      }
    };

    const focusRelativeItem = (currentIndex, step) => {
      const count = itemProps.Items.length;
      if (!count) return;
      for (let offset = 1; offset <= count; offset += 1) {
        const index = (currentIndex + step * offset + count) % count;
        if (getItemKind(itemProps.Items[index]) !== 'MenuFlyoutSeparator' && !isItemDisabled(itemProps.Items[index])) {
          focusItem(index);
          return;
        }
      }
    };

    const onItemKeydown = (event, item, index, submenuTarget) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          focusRelativeItem(index, 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          focusRelativeItem(index, -1);
          break;
        case 'Home': {
          event.preventDefault();
          const firstIndex = itemProps.Items.findIndex((candidate) => getItemKind(candidate) !== 'MenuFlyoutSeparator' && !isItemDisabled(candidate));
          if (firstIndex >= 0) focusItem(firstIndex);
          break;
        }
        case 'End': {
          event.preventDefault();
          const lastIndex = itemProps.Items.findLastIndex((candidate) => getItemKind(candidate) !== 'MenuFlyoutSeparator' && !isItemDisabled(candidate));
          if (lastIndex >= 0) focusItem(lastIndex);
          break;
        }
        case 'ArrowRight':
          if (submenuTarget) {
            event.preventDefault();
            openSubmenu(index, submenuTarget);
            nextTick(() => submenuElement.value?.querySelector('.win-menu-flyout-item:not(:disabled)')?.focus({ preventScroll: true }));
          }
          break;
        case 'ArrowLeft':
          if (itemProps.IsSubmenu) {
            event.preventDefault();
            itemEmit('RequestClose');
          }
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (submenuTarget) openSubmenu(index, submenuTarget);
          else selectItem(item, index, event);
          break;
        case 'Escape':
          event.preventDefault();
          if (itemProps.IsSubmenu) itemEmit('RequestClose');
          else itemEmit('Dismiss');
          break;
        default:
          break;
      }
    };

    const onMenuKeydown = (event) => {
      if (event.defaultPrevented) return;
      const index = itemProps.Items.findIndex((item) => (
        !isItemDisabled(item) && matchesKeyboardAccelerator(item, event)
      ));
      if (index < 0) return;
      event.preventDefault();
      selectItem(itemProps.Items[index], index, event);
    };

    const onSplitPrimaryKeydown = (event, item, index, secondaryButton) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectItem(item, index, event);
        return;
      }
      onItemKeydown(event, item, index, secondaryButton);
    };

    const rememberItemElement = (index, element) => {
      if (element) itemElements.value[index] = element;
      else delete itemElements.value[index];
    };

    const renderLeadingSlots = (item, kind) => {
      const icon = getItemIcon(item);
      const isCheckItem = kind === 'ToggleMenuFlyoutItem' || kind === 'RadioMenuFlyoutItem';
      const slots = [];
      if (containsToggleItems.value) {
        slots.push(h('span', {
          class: 'win-menu-flyout-leading-slot win-menu-flyout-check-slot',
          'aria-hidden': true
        }, isCheckItem && isItemChecked(item)
          ? h('span', { class: 'icon win-menu-flyout-check' }, kind === 'RadioMenuFlyoutItem' ? '\uE915' : '\uE73E')
          : null));
      }
      if (containsIconItems.value) {
        slots.push(h('span', {
          class: 'win-menu-flyout-leading-slot win-menu-flyout-icon-slot',
          'aria-hidden': true
        }, icon ? h('span', { class: 'icon win-menu-flyout-icon' }, icon) : null));
      }
      return slots;
    };

    const renderMenuItem = (item, index) => {
      const kind = getItemKind(item);
      const text = item?.Text || item?.Command?.Label || String(item);
      const itemForeground = item.Foreground && !isItemDisabled(item) ? item.Foreground : '';
      const itemStyle = {
        ...(itemForeground ? { color: itemForeground } : {}),
        ...(item.Background ? { '--win-menu-flyout-item-background': item.Background } : {})
      };
      if (kind === 'MenuFlyoutSeparator') {
        return h('div', {
          key: index,
          class: 'win-menu-flyout-separator',
          role: 'separator'
        }, h('span', { class: 'win-menu-flyout-separator-line', 'aria-hidden': true }));
      }

      if (kind === 'MenuFlyoutSubItem' || kind === 'SplitMenuFlyoutItem') {
        const isSplit = kind === 'SplitMenuFlyoutItem';
        const disabled = isItemDisabled(item);
        if (isSplit) {
          let secondaryButton;
          return h('div', {
            key: index,
            class: ['win-menu-flyout-item', 'win-menu-flyout-subitem', 'win-menu-flyout-splititem', {
              'is-disabled': disabled,
              'is-open': openIndex.value === index
            }],
            role: 'group',
            'aria-disabled': disabled,
            style: itemStyle,
            onPointerleave: queueCloseSubmenu
          }, [
            h('button', {
              ref: (element) => rememberItemElement(index, element),
              class: 'win-menu-flyout-split-primary',
              type: 'button',
              tabindex: -1,
              disabled,
              'aria-label': text,
              onPointerenter: () => closeSubmenu(),
              onClick: (event) => {
                event.stopPropagation();
                selectItem(item, index, event);
              },
              onKeydown: (event) => onSplitPrimaryKeydown(event, item, index, secondaryButton)
            }),
            h('span', { class: 'win-menu-flyout-split-divider', 'aria-hidden': true }),
            h('button', {
              ref: (element) => { secondaryButton = element; },
              class: 'win-menu-flyout-chevron-button',
              type: 'button',
              tabindex: -1,
              disabled,
              'aria-label': text,
              'aria-haspopup': true,
              'aria-expanded': openIndex.value === index,
              onPointerenter: (event) => queueOpenSubmenu(index, event),
              onClick: (event) => {
                const target = event.currentTarget;
                event.stopPropagation();
                openSubmenu(index, target);
              },
              onKeydown: (event) => onItemKeydown(event, item, index, event.currentTarget)
            }),
            h('div', { class: 'win-menu-flyout-split-content', 'aria-hidden': true }, [
              ...renderLeadingSlots(item, kind),
              h(WinTextBlock, {
                class: 'win-menu-flyout-label',
                Foreground: itemForeground,
                Text: text
              }),
              h('span', { class: 'icon win-menu-flyout-chevron' }, '\uE974')
            ])
          ]);
        }

        let submenuButton;
        return h('button', {
          key: index,
          ref: (element) => {
            submenuButton = element;
            rememberItemElement(index, element);
          },
          class: ['win-menu-flyout-item', 'win-menu-flyout-subitem', {
            'is-disabled': disabled,
            'is-open': openIndex.value === index
          }],
          role: 'menuitem',
          type: 'button',
          tabindex: -1,
          disabled,
          style: itemStyle,
          'aria-disabled': disabled,
          'aria-haspopup': true,
          'aria-expanded': openIndex.value === index,
          onPointerenter: (event) => queueOpenSubmenu(index, event),
          onPointerleave: queueCloseSubmenu,
          onClick: (event) => {
            const target = event.currentTarget;
            event.stopPropagation();
            openSubmenu(index, target);
          },
          onKeydown: (event) => onItemKeydown(event, item, index, submenuButton)
        }, [
          ...renderLeadingSlots(item, kind),
          h(WinTextBlock, {
            class: 'win-menu-flyout-label',
            Foreground: itemForeground,
            Text: text
          }),
          h('span', {
            class: 'icon win-menu-flyout-chevron',
            'aria-hidden': true
          }, '\uE974')
        ]);
      }

      const acceleratorText = getKeyboardAcceleratorText(item);
      return h('button', {
        key: index,
        ref: (element) => rememberItemElement(index, element),
        class: ['win-menu-flyout-item', {
          'is-disabled': isItemDisabled(item),
          'is-checked': isItemChecked(item),
          'is-toggle': kind === 'ToggleMenuFlyoutItem',
          'is-radio': kind === 'RadioMenuFlyoutItem'
        }],
        type: 'button',
        role: kind === 'RadioMenuFlyoutItem'
          ? 'menuitemradio'
          : kind === 'ToggleMenuFlyoutItem' ? 'menuitemcheckbox' : 'menuitem',
        tabindex: -1,
        disabled: isItemDisabled(item),
        style: itemStyle,
        'aria-checked': kind === 'ToggleMenuFlyoutItem' || kind === 'RadioMenuFlyoutItem' ? isItemChecked(item) : undefined,
        onPointerenter: () => closeSubmenu(),
        onClick: (event) => selectItem(item, index, event),
        onKeydown: (event) => onItemKeydown(event, item, index)
      }, [
        ...renderLeadingSlots(item, kind),
        h(WinTextBlock, {
          class: 'win-menu-flyout-label',
          Foreground: itemForeground,
          Text: text
        }),
        acceleratorText
          ? h(WinTextBlock, { class: 'win-menu-flyout-accelerator', Text: acceleratorText })
          : null
      ]);
    };

    onMounted(() => {
      if (!itemProps.IsSubmenu && !itemProps.IsClosing) {
        nextTick(() => {
          const firstIndex = itemProps.Items.findIndex((item) => getItemKind(item) !== 'MenuFlyoutSeparator' && !isItemDisabled(item));
          if (firstIndex >= 0) focusItem(firstIndex);
          else menuElement.value?.focus({ preventScroll: true });
        });
      }
    });

    onBeforeUnmount(() => {
      clearOpenSubmenuTimer();
      clearCloseSubmenuTimer();
    });

    return () => [
      h('div', {
        ref: menuElement,
        class: 'win-menu-flyout-items',
        role: 'menu',
        tabindex: -1,
        onKeydown: onMenuKeydown
      }, itemProps.Items.map(renderMenuItem)),
      openSubmenuItem.value
        ? h(Teleport, { to: 'body' }, h('div', {
          key: submenuAnimationKey.value,
          ref: submenuElement,
          class: ['win-menu-flyout-wrap', 'win-menu-submenu-wrap', themeClass.value, {
            'from-bottom': submenuOpensUp.value,
            'is-closing': itemProps.IsClosing
          }],
          style: { ...submenuStyle.value, ...themeStyle.value },
          onPointerenter: cancelCloseChain,
          onPointerleave: () => {
            queueCloseSubmenu();
            itemEmit('PointerLeave');
          },
          onFocusout: () => {
            window.setTimeout(() => {
              if (!document.activeElement?.closest?.('.win-menu-flyout-wrap')) itemEmit('Dismiss');
            }, 0);
          }
        }, h('div', {
          class: 'win-menu-submenu-motion'
        }, [
          h('div', { class: 'win-menu-flyout-shadow', 'aria-hidden': true }),
          h('div', {
            class: 'win-menu-submenu-flyout'
          }, h(MenuFlyoutItems, {
            key: submenuAnimationKey.value,
            Items: openSubmenuItem.value.Items || [],
            IsSubmenu: true,
            onSelect: (event) => itemEmit('Select', event),
            onDismiss: () => itemEmit('Dismiss'),
            onRequestClose: () => closeSubmenu(true),
            onPointerEnter: cancelCloseChain,
            onPointerLeave: () => itemEmit('PointerLeave')
          }))
        ])))
        : null
    ];
  }
});

const updateWindowHeight = () => {
  windowHeight.value = window.innerHeight;
};

const close = () => {
  if (!props.Open || dismissRequested) return;
  dismissRequested = true;
  emit('Close');
};

const closeOnDocumentPointerDown = (event) => {
  if (!props.Open) return;
  const path = event.composedPath?.() || [];
  const isInsideMenu = path.some((element) => element?.classList?.contains('win-menu-flyout-wrap'));
  const isMenuBarInteraction = path.some((element) => element?.classList?.contains('win-menu-bar'));
  const isCommandBarInteraction = path.some((element) => element?.classList?.contains('win-commandbar'));
  if (!isInsideMenu && !isMenuBarInteraction && !isCommandBarInteraction) close();
};

const onFlyoutFocusOut = () => {
  window.setTimeout(() => {
    const activeElement = document.activeElement;
    const remainsInOwningCommandSurface = activeElement?.closest?.('.win-commandbar, .win-menu-bar');
    if (props.Open
      && activeElement
      && !activeElement.closest?.('.win-menu-flyout-wrap')
      && !remainsInOwningCommandSurface) close();
  }, 0);
};

const closeOnWindowBlur = () => {
  if (props.Open) close();
};

const closeOnPageHidden = () => {
  if (document.visibilityState === 'hidden' && props.Open) close();
};

onMounted(() => {
  updateWindowHeight();
  window.addEventListener('resize', updateWindowHeight);
  window.addEventListener('blur', closeOnWindowBlur);
  document.addEventListener('pointerdown', closeOnDocumentPointerDown, true);
  document.addEventListener('visibilitychange', closeOnPageHidden);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWindowHeight);
  window.removeEventListener('blur', closeOnWindowBlur);
  document.removeEventListener('pointerdown', closeOnDocumentPointerDown, true);
  document.removeEventListener('visibilitychange', closeOnPageHidden);
  if (closeTimer !== undefined) window.clearTimeout(closeTimer);
});

watch(() => props.Open, (value) => {
  if (value) {
    dismissRequested = false;
    if (closeTimer !== undefined) window.clearTimeout(closeTimer);
    closeTimer = undefined;
    visible.value = true;
    isClosing.value = false;
    animationKey.value += 1;
  } else if (visible.value) {
    isClosing.value = true;
    if (props.CloseAnimation === 'Reverse' || props.CloseAnimation === 'CommandBar') animationKey.value += 1;
    // CommandBar closes by playing the same MenuPopupThemeTransition used to
    // open the presenter in reverse. Keep the host mounted for the full
    // transition so clip-path/transform and the presenter shadow finish
    // together instead of disappearing halfway through.
    const closeDuration = props.CloseAnimation === 'Reverse'
      ? 250
      : props.CloseAnimation === 'CommandBar' ? 167 : 83;
    closeTimer = window.setTimeout(() => {
      visible.value = false;
      isClosing.value = false;
      closeTimer = undefined;
    }, closeDuration);
  }
}, { immediate: true });

watch(() => props.AnchorRect, () => {
  if (props.Open) {
    animationKey.value += 1;
  }
});

const onItemSelect = ({ item, index }) => {
  if (isItemDisabled(item)) return;
  updateToggleItem(item);
  updateRadioGroup(item);
  emit('Select', item, index);
  close();
};

const openDirection = computed(() => {
  if (!props.AnchorRect || props.Placement === 'Right' || props.Placement === 'RightEdgeAlignedTop') return 'down';
  const margin = 8;
  const gap = props.Gap;
  const spaceBelow = windowHeight.value - props.AnchorRect.bottom - gap - margin;
  const spaceAbove = props.AnchorRect.top - gap - margin;
  return spaceBelow >= estimateFlyoutHeight(props.Items) || spaceBelow >= spaceAbove ? 'down' : 'up';
});

const posStyle = computed(() => {
  if (!props.AnchorRect) return {};
  const rect = props.AnchorRect;
  const viewHeight = windowHeight.value;
  const margin = 8;
  const gap = props.Placement === 'Right' || props.Placement === 'RightEdgeAlignedTop' ? 0 : props.Gap;
  const spaceBelow = viewHeight - rect.bottom - gap - margin;
  const spaceAbove = rect.top - gap - margin;
  const minWidth = cssSize(props.MinWidth);

  if (props.Placement === 'Right' || props.Placement === 'RightEdgeAlignedTop') {
    return {
      top: `${rect.top}px`,
      left: `${rect.right}px`,
      '--flyout-max-height': `${Math.max(0, viewHeight - rect.top - margin)}px`,
      '--flyout-min-width': minWidth
    };
  }

  const alignRight = props.Placement === 'BottomEdgeAlignedRight';
  const alignLeft = props.Placement === 'BottomEdgeAlignedLeft';
  if (openDirection.value === 'down') {
    return {
      top: `${rect.bottom + gap}px`,
      left: alignRight ? `${rect.right}px` : alignLeft ? `${rect.left}px` : `${rect.left + rect.width / 2}px`,
      transform: alignRight ? 'translateX(-100%)' : alignLeft ? undefined : 'translateX(-50%)',
      '--flyout-max-height': `${Math.max(0, spaceBelow)}px`,
      '--flyout-min-width': minWidth
    };
  }

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
  return 4 + itemCount * 36 + separatorCount * 3;
};
const estimateFlyoutWidth = (items) => {
  if (!items.length) return 96;
  const containsToggle = items.some((item) => ['ToggleMenuFlyoutItem', 'RadioMenuFlyoutItem'].includes(getItemKind(item)));
  const containsIcon = items.some((item) => Boolean(getItemIcon(item)));
  return Math.max(96, Math.min(320, ...items.map((item) => {
    const text = item?.Text || item?.Command?.Label || '';
    const accelerator = getKeyboardAcceleratorText(item);
    return 30 + String(text).length * 7.2 + (containsToggle ? 28 : 0) + (containsIcon ? 28 : 0) + (accelerator ? 24 + accelerator.length * 6.5 : 0);
  })));
};
const getItemKind = (item) => item?.Kind ?? (item?.Items ? 'MenuFlyoutSubItem' : '');
const commandGlyphs = {
  Cut: '\uE8C6', Copy: '\uE8C8', Paste: '\uE77F', SelectAll: '\uE8B3', Delete: '\uE74D',
  Share: '\uE72D', Save: '\uE74E', OpenFile: '\uE8E5', Cancel: '\uE711', Pause: '\uE769',
  Play: '\uE768', Stop: '\uE71A', Forward: '\uE72A', Back: '\uE72B', Undo: '\uE7A7', Redo: '\uE7A6'
};
const getCommandIcon = (source) => {
  if (typeof source === 'string') return source;
  return source?.Glyph || commandGlyphs[source?.Symbol] || '';
};
const getItemIcon = (item) => item?.Icon || getCommandIcon(item?.Command?.IconSource);
const getKeyboardAcceleratorText = (item) => {
  if (item?.KeyboardAcceleratorTextOverride) return item.KeyboardAcceleratorTextOverride;
  const accelerator = item?.KeyboardAccelerators?.[0] || item?.Command?.KeyboardAccelerators?.[0];
  if (!accelerator) return '';
  const modifiers = Array.isArray(accelerator.Modifiers)
    ? accelerator.Modifiers
    : String(accelerator.Modifiers || '').split(/[,+\s]+/).filter(Boolean);
  const parts = [];
  if (modifiers.includes('Control') || modifiers.includes('Ctrl')) parts.push('Ctrl');
  if (modifiers.includes('Shift')) parts.push('Shift');
  if (modifiers.includes('Alt')) parts.push('Alt');
  if (modifiers.includes('Windows') || modifiers.includes('Meta')) parts.push('Win');
  if (accelerator.Key) {
    const key = String(accelerator.Key);
    parts.push(key.length === 1 ? key.toUpperCase() : key);
  }
  return parts.join('+');
};
const matchesKeyboardAccelerator = (item, event) => {
  const accelerators = item?.KeyboardAccelerators || item?.Command?.KeyboardAccelerators || [];
  return accelerators.some((accelerator) => {
    const modifiers = new Set(Array.isArray(accelerator.Modifiers)
      ? accelerator.Modifiers
      : String(accelerator.Modifiers || '').split(/[,+\s]+/).filter(Boolean));
    return event.key.toLowerCase() === String(accelerator.Key || '').toLowerCase()
      && event.ctrlKey === (modifiers.has('Control') || modifiers.has('Ctrl'))
      && event.shiftKey === modifiers.has('Shift')
      && event.altKey === modifiers.has('Alt')
      && event.metaKey === (modifiers.has('Windows') || modifiers.has('Meta'));
  });
};
const isItemDisabled = (item) => {
  if (item?.IsEnabled === false) return true;
  return typeof item?.Command?.CanExecute === 'function' && item.Command.CanExecute(item.CommandParameter) === false;
};
const isItemChecked = (item) => Boolean(item?.IsChecked);
</script>

<style>
.win-menu-flyout-wrap {
  position: fixed;
  z-index: var(--win-menu-flyout-z-index, 10001);
  pointer-events: auto;
  border-radius: 8px;
  overflow: visible;
  /* The presenter (the animated child) owns its shadow, like WinUI's
     MenuFlyoutPresenter. Keeping it off the positioning wrapper makes the
     shadow participate in the same opacity/clip transition as the panel. */
  box-shadow: none;
}

.win-menu-flyout-wrap.is-closing {
  pointer-events: none;
}

.win-menu-flyout-wrap.is-closing .win-menu-flyout-motion {
  animation: flyout-fade-out 83ms linear forwards;
}

.win-menu-flyout-motion {
  position: relative;
  width: max-content;
  max-width: calc(100vw - 16px);
  border-radius: 8px;
  overflow: visible;
  isolation: isolate;
  z-index: 0;
  animation: flyout-menu-opacity 83ms linear both;
}

.win-menu-flyout-shadow {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: 8px;
  pointer-events: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
  animation: flyout-shadow-open-down 250ms cubic-bezier(0, 0, 0, 1) both;
}

.win-menu-flyout {
  position: relative;
  box-sizing: border-box;
  pointer-events: auto;
  --win-acrylic-fill: var(--flyout-bg, var(--layer-default));
  --flyout-scroll-max-height: calc(var(--flyout-max-height, 600px) - 6px);
  min-width: var(--flyout-min-width, 96px);
  width: max-content;
  max-width: calc(100vw - 16px);
  max-height: var(--flyout-max-height, 600px);
  padding: 2px 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--MenuFlyoutPresenterBorderBrush,
    var(--SurfaceStrokeColorFlyoutBrush,
      var(--surface-stroke-color-flyout, var(--stroke-surface-flyout, rgba(0, 0, 0, 0.0588)))));
  border-radius: 8px;
  isolation: isolate;
  background: transparent;
  /* WinUI's presenter shadow is part of the popup visual. A drop shadow is
     applied after the presenter is clipped, so it remains visible while the
     popup is opening or dismissing instead of being clipped away. */
  box-shadow: none;
  filter: none;
  z-index: 1;
  transform-origin: 50% 0;
  will-change: transform, clip-path, opacity;
  animation: flyout-menu-open-down 250ms cubic-bezier(0, 0, 0, 1) both,
    flyout-menu-opacity 83ms linear both;
  -webkit-backdrop-filter: var(--flyout-backdrop);
  backdrop-filter: var(--flyout-backdrop);
}

.win-menu-flyout-wrap.from-bottom .win-menu-flyout {
  animation-name: flyout-menu-open-up, flyout-menu-opacity;
}

.win-menu-flyout-wrap.from-bottom .win-menu-flyout-shadow,
.win-menu-submenu-wrap.from-bottom .win-menu-flyout-shadow {
  animation-name: flyout-shadow-open-up;
}

.win-menu-flyout-wrap.reverse-close.is-closing .win-menu-flyout-motion {
  animation-name: flyout-menu-opacity;
  animation-direction: reverse;
}

.win-menu-flyout-wrap.reverse-close.is-closing .win-menu-flyout {
  animation-name: flyout-menu-open-down, flyout-menu-opacity;
  animation-direction: reverse;
}

.win-menu-flyout-wrap.reverse-close.is-closing .win-menu-flyout-shadow {
  animation-name: flyout-shadow-open-down;
  animation-direction: reverse;
}

.win-menu-flyout-wrap.reverse-close.is-closing.from-bottom .win-menu-flyout {
  animation-name: flyout-menu-open-up, flyout-menu-opacity;
}

/* CommandBar uses the same MenuPopupThemeTransition as MenuFlyout. Its
   dismiss transition is exactly the opening transition played backwards. */
.win-menu-flyout-wrap.commandbar-close.is-closing .win-menu-flyout-motion {
  animation: none;
}

.win-menu-flyout-wrap.commandbar-close.is-closing .win-menu-flyout-shadow {
  animation: flyout-shadow-open-down 167ms cubic-bezier(0, 0, 0, 1) reverse both;
}

.win-menu-flyout-wrap.commandbar-close.is-closing .win-menu-flyout {
  animation: flyout-menu-open-down 167ms cubic-bezier(0, 0, 0, 1) reverse both;
}

.win-menu-flyout-wrap.commandbar-close.is-closing.from-bottom .win-menu-flyout {
  animation-name: flyout-menu-open-up;
}

.win-menu-flyout-scroll {
  width: 100%;
  min-width: max-content;
  display: flex;
  flex-direction: column;
  max-height: var(--flyout-scroll-max-height, 70vh);
}

.win-menu-flyout-scroll > .win-scroll-viewer-viewport {
  height: auto;
  max-height: inherit;
}

.win-menu-flyout-scroll .scroll-content {
  width: 100%;
  min-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
}

.win-menu-flyout-items {
  width: max-content;
  min-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
}

.win-menu-flyout-item {
  box-sizing: border-box;
  width: auto;
  align-self: stretch;
  min-height: 32px;
  margin: 2px 4px;
  padding: 4px 11px 5px;
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

.win-menu-flyout-item:focus-visible,
.win-menu-flyout-chevron-button:focus-visible,
.win-menu-flyout-split-primary:focus-visible {
  outline: 2px solid var(--SystemControlFocusVisualPrimaryBrush, var(--accent-base));
  outline-offset: -2px;
}

.win-menu-flyout-item:not(.win-menu-flyout-splititem) {
  background: var(--win-menu-flyout-item-background, transparent);
}

.win-menu-flyout-item:not(.win-menu-flyout-splititem):hover:not(.is-disabled) {
  background: var(--subtle-secondary);
}

.win-menu-flyout-subitem {
  position: relative;
}

.win-menu-flyout-splititem {
  box-sizing: border-box;
  position: relative;
  padding: 0;
  display: block;
  overflow: hidden;
  background: var(--win-menu-flyout-item-background, transparent);
}

.win-menu-flyout-split-primary {
  position: absolute;
  inset: 0 38px 0 0;
  z-index: 0;
  padding: 0;
  border: 0;
  border-radius: 4px 0 0 4px;
  background: transparent;
  appearance: none;
  color: inherit;
  font: inherit;
}

.win-menu-flyout-split-divider {
  position: absolute;
  top: 50%;
  right: 38px;
  z-index: 2;
  width: 1px;
  height: 18px;
  transform: translateY(-50%);
  background: var(--DividerStrokeColorDefaultBrush, var(--divider-stroke-default, var(--stroke-divider)));
  pointer-events: none;
}

.win-menu-flyout-chevron-button {
  position: absolute;
  inset: 0 0 0 auto;
  z-index: 0;
  width: 38px;
  padding: 0;
  border: 0;
  border-radius: 0 4px 4px 0;
  background: transparent;
  color: var(--text-secondary);
  appearance: none;
  font: inherit;
}

.win-menu-flyout-split-content {
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  min-height: 32px;
  padding: 4px 11px 5px;
  display: flex;
  align-items: center;
  color: inherit;
  pointer-events: none;
}

.win-menu-flyout-split-primary:hover:not(:disabled),
.win-menu-flyout-chevron-button:hover:not(:disabled),
.win-menu-flyout-splititem.is-open .win-menu-flyout-chevron-button {
  background: var(--subtle-secondary);
}

.win-menu-flyout-subitem:not(.win-menu-flyout-splititem).is-open {
  background: var(--subtle-secondary);
}

.win-menu-flyout-split-primary:active:not(:disabled),
.win-menu-flyout-chevron-button:active:not(:disabled) {
  background: var(--subtle-tertiary);
}

.win-menu-flyout-item:not(.win-menu-flyout-splititem):active:not(.is-disabled) {
  background: var(--subtle-tertiary);
}

.win-menu-flyout-item.is-disabled {
  color: var(--text-disabled);
  cursor: default;
}

.win-menu-flyout-splititem.is-disabled .win-menu-flyout-chevron {
  color: var(--text-disabled);
}

.win-menu-flyout-label {
  flex: 1;
  min-width: 0;
  line-height: 20px;
}

.win-menu-flyout-item .win-menu-flyout-accelerator {
  width: max-content;
  min-width: max-content;
  flex: 0 0 auto;
  align-self: center;
  margin: 4px 0 0 24px;
  color: var(--MenuFlyoutItemKeyboardAcceleratorTextForeground, var(--TextFillColorSecondaryBrush, var(--text-secondary)));
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0;
  text-align: right;
}

.win-menu-flyout-item.is-toggle .win-menu-flyout-accelerator,
.win-menu-flyout-item.is-radio .win-menu-flyout-accelerator {
  margin-top: 0;
  color: var(--ToggleMenuFlyoutItemKeyboardAcceleratorTextForeground, var(--TextFillColorSecondaryBrush, var(--text-secondary)));
}

.win-menu-flyout-item:hover:not(.is-disabled) .win-menu-flyout-accelerator,
.win-menu-flyout-subitem:hover:not(.is-disabled) .win-menu-flyout-accelerator {
  color: var(--MenuFlyoutItemKeyboardAcceleratorTextForegroundPointerOver, var(--TextFillColorSecondaryBrush, var(--text-secondary)));
}

.win-menu-flyout-item:active:not(.is-disabled) .win-menu-flyout-accelerator,
.win-menu-flyout-subitem:active:not(.is-disabled) .win-menu-flyout-accelerator {
  color: var(--MenuFlyoutItemKeyboardAcceleratorTextForegroundPressed, var(--TextFillColorSecondaryBrush, var(--text-secondary)));
}

.win-menu-flyout-item.is-disabled .win-menu-flyout-accelerator {
  color: var(--MenuFlyoutItemKeyboardAcceleratorTextForegroundDisabled, var(--TextFillColorDisabledBrush, var(--text-disabled)));
}

.win-menu-flyout-leading-slot {
  width: 16px;
  min-width: 16px;
  margin-right: 12px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1;
}

.win-menu-flyout-icon,
.win-menu-flyout-check {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.win-menu-flyout-leading-slot:empty {
  visibility: hidden;
}

.win-menu-flyout-icon,
.win-menu-flyout-check,
.win-menu-flyout-chevron {
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif;
}

.win-menu-flyout-icon {
  font-size: 16px;
}

.win-menu-flyout-check {
  font-size: 12px;
}

.win-menu-flyout-chevron {
  flex: 0 0 auto;
  margin-left: 24px;
  color: var(--text-secondary);
  font-size: 12px;
  pointer-events: none;
}

.win-menu-flyout-split-primary:active:not(:disabled) ~ .win-menu-flyout-split-content {
  color: var(--text-primary);
}

.win-menu-flyout-chevron-button:active:not(:disabled) ~ .win-menu-flyout-split-content .win-menu-flyout-chevron {
  color: var(--MenuFlyoutSubItemChevronPressed, var(--TextFillColorSecondaryBrush, var(--text-secondary)));
}

.win-menu-submenu-flyout {
  position: relative;
  box-sizing: border-box;
  pointer-events: auto;
  --win-acrylic-fill: var(--flyout-bg, var(--layer-default));
  min-width: var(--flyout-min-width, 96px);
  width: max-content;
  max-width: calc(100vw - 16px);
  max-height: var(--flyout-max-height, 600px);
  padding: 2px 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;
  border: 1px solid var(--MenuFlyoutPresenterBorderBrush,
    var(--SurfaceStrokeColorFlyoutBrush,
      var(--surface-stroke-color-flyout, var(--stroke-surface-flyout, rgba(0, 0, 0, 0.0588)))));
  border-radius: 8px;
  isolation: isolate;
  background: transparent;
  box-shadow: none;
  filter: none;
  z-index: 1;
  transform-origin: 50% 0;
  will-change: transform, clip-path, opacity;
  -webkit-backdrop-filter: var(--flyout-backdrop);
  backdrop-filter: var(--flyout-backdrop);
  animation: flyout-menu-open-down 250ms cubic-bezier(0, 0, 0, 1) both,
    flyout-menu-opacity 83ms linear both;
}

.win-menu-submenu-wrap.from-bottom .win-menu-submenu-flyout {
  animation-name: flyout-menu-open-up, flyout-menu-opacity;
}

/* Teleported presenters no longer inherit the page's theme wrapper. Keep the
   official light/dark flyout stroke on the presenter and every submenu. */
.win-menu-flyout-wrap.win-theme-scope.theme-light,
.win-menu-flyout-wrap.win-theme-scope.theme-light .win-menu-flyout,
.win-menu-flyout-wrap.win-theme-scope.theme-light .win-menu-submenu-flyout {
  --MenuFlyoutPresenterBorderBrush: rgba(0, 0, 0, 0.0588);
  --SurfaceStrokeColorFlyoutBrush: rgba(0, 0, 0, 0.0588);
  --surface-stroke-color-flyout: rgba(0, 0, 0, 0.0588);
  --DividerStrokeColorDefaultBrush: rgba(0, 0, 0, 0.0588);
  --divider-stroke-default: rgba(0, 0, 0, 0.0588);
  --stroke-divider: rgba(0, 0, 0, 0.0588);
}

.win-menu-flyout-wrap.win-theme-scope.theme-dark,
.win-menu-flyout-wrap.win-theme-scope.theme-dark .win-menu-flyout,
.win-menu-flyout-wrap.win-theme-scope.theme-dark .win-menu-submenu-flyout {
  --MenuFlyoutPresenterBorderBrush: rgba(0, 0, 0, 0.20);
  --SurfaceStrokeColorFlyoutBrush: rgba(0, 0, 0, 0.20);
  --surface-stroke-color-flyout: rgba(0, 0, 0, 0.20);
  --DividerStrokeColorDefaultBrush: rgba(255, 255, 255, 0.0824);
  --divider-stroke-default: rgba(255, 255, 255, 0.0824);
  --stroke-divider: rgba(255, 255, 255, 0.0824);
}

.win-menu-submenu-wrap {
  z-index: var(--win-menu-flyout-submenu-z-index, 10002);
}

.win-menu-submenu-motion {
  position: relative;
  width: max-content;
  max-width: calc(100vw - 16px);
  border-radius: 8px;
  overflow: visible;
  isolation: isolate;
}

.win-menu-submenu-wrap.is-closing {
  pointer-events: none;
}

.win-menu-submenu-wrap.is-closing .win-menu-submenu-flyout {
  animation: flyout-fade-out 83ms linear forwards;
}

.win-menu-submenu-wrap.is-closing .win-menu-flyout-shadow {
  animation: flyout-fade-out 83ms linear forwards;
}

.win-menu-flyout-separator {
  flex: 0 0 3px;
  align-self: stretch;
  width: 100%;
  overflow: visible;
}

.win-menu-flyout-separator-line {
  display: block;
  width: 100%;
  height: 1px;
  margin: 1px 0;
  background: var(--DividerStrokeColorDefaultBrush, var(--divider-stroke-default, var(--stroke-divider)));
}

.win-menu-flyout-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--win-menu-flyout-overlay-z-index, 10000);
}

.win-menu-flyout-overlay.allows-anchor-hover {
  pointer-events: none;
}

@keyframes flyout-fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes flyout-menu-open-down {
  from {
    transform: translateY(-50%);
    -webkit-clip-path: inset(50% 0 0 0);
    clip-path: inset(50% 0 0 0);
  }
  to {
    transform: translateY(0);
    -webkit-clip-path: inset(0);
    clip-path: inset(0);
  }
}

/* The shadow has its own unclipped copy of the popup motion. This mirrors the
   presenter's translate/opacity timing while remaining outside its clip path. */
@keyframes flyout-shadow-open-down {
  from {
    transform: translateY(-50%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes flyout-shadow-open-up {
  from {
    transform: translateY(50%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes flyout-menu-open-up {
  from {
    transform: translateY(50%);
    -webkit-clip-path: inset(0 0 50% 0);
    clip-path: inset(0 0 50% 0);
  }
  to {
    transform: translateY(0);
    -webkit-clip-path: inset(0);
    clip-path: inset(0);
  }
}

@keyframes flyout-menu-opacity {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .win-menu-flyout-motion,
  .win-menu-flyout,
  .win-menu-submenu-flyout,
  .win-menu-flyout-wrap.is-closing {
    animation-duration: 0.01ms;
  }
}
</style>
