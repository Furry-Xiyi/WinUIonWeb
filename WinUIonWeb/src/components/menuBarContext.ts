import type { InjectionKey } from 'vue';

export interface MenuBarItemController {
  element(): HTMLButtonElement | null;
  isEnabled(): boolean;
  isVisible(): boolean;
  isTabStop(): boolean;
  hasItems(): boolean;
  open(focus: 'first' | 'last' | 'none'): void;
  close(restoreFocus: boolean): void;
  api: unknown;
}

export interface MenuBarContext {
  element(): HTMLElement | null;
  isEnabled(): boolean;
  isVisible(): boolean;
  register(item: MenuBarItemController): void;
  unregister(item: MenuBarItemController): void;
  tabIndex(item: MenuBarItemController): number;
  onItemFocus(item: MenuBarItemController): void;
  onItemPointerEnter(item: MenuBarItemController, event: PointerEvent): void;
  onItemKeyDown(item: MenuBarItemController, event: KeyboardEvent): void;
  onFlyoutKeyDown(item: MenuBarItemController, event: KeyboardEvent): void;
  onItemClosed(item: MenuBarItemController): void;
  toggle(item: MenuBarItemController, focus?: 'first' | 'last' | 'none'): void;
  open(item: MenuBarItemController, focus?: 'first' | 'last' | 'none'): void | Promise<void>;
  close(restoreFocus?: boolean): void;
}

export const menuBarContextKey: InjectionKey<MenuBarContext> = Symbol('MenuBar');
export const menuBarFlyoutNavigationKey: InjectionKey<(event: KeyboardEvent) => void> = Symbol('MenuBarFlyoutNavigation');
export const menuBarFlyoutEnabledKey: InjectionKey<() => boolean> = Symbol('MenuBarFlyoutEnabled');
