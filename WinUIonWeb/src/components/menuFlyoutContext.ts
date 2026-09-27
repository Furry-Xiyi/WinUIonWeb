import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface MenuFlyoutItemController {
  Element: Ref<HTMLElement | null>
  IsEnabled: ComputedRef<boolean>
  IsVisible: ComputedRef<boolean>
  HasIcon: ComputedRef<boolean>
  IsCheckItem: boolean
  IsRadioItem: boolean
  GroupName: ComputedRef<string>
  IsChecked: ComputedRef<boolean>
  Text: ComputedRef<string>
  AcceleratorText: ComputedRef<string>
  SetChecked(value: boolean): void
  Invoke(event?: Event): void
  MatchesAccelerator(event: KeyboardEvent): boolean
  OpenSubmenu(focus?: boolean): void
  CloseSubmenu(restoreFocus?: boolean): void
  ClearPointer(): void
  Focus(): void
  readonly HasSubmenu: boolean
  readonly Api: Record<string, unknown>
}

export interface MenuFlyoutPresenterContext {
  Depth: number
  IsOpen: Ref<boolean>
  IsOpening: Ref<boolean>
  IsSubmenu: boolean
  NarrowPadding: Ref<boolean>
  FlowDirection: Ref<string>
  ContainsCheckItems: ComputedRef<boolean>
  ContainsIconItems: ComputedRef<boolean>
  AcceleratorMinWidth: ComputedRef<number>
  Register(item: MenuFlyoutItemController): void
  Unregister(item: MenuFlyoutItemController): void
  Items(): MenuFlyoutItemController[]
  RootItems: Set<MenuFlyoutItemController>
  Dismiss(): void
  Close(restoreFocus?: boolean): void
  CloseSiblings(item: MenuFlyoutItemController): void
  FocusRelative(item: MenuFlyoutItemController, delta: number): void
  FocusBoundary(last?: boolean): void
  CanHover(event: PointerEvent): boolean
  CancelPendingClose(): void
  DelayClose(): void
  Options(): Record<string, unknown>
}

export const menuFlyoutPresenterContextKey: InjectionKey<MenuFlyoutPresenterContext> = Symbol('WinUI.MenuFlyoutPresenter')
