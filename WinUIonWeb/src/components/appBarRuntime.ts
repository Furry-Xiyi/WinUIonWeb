import { defineComponent, type InjectionKey, type Ref } from 'vue'

export interface CommandBarContext {
  isOpen: Readonly<Ref<boolean>>
  defaultLabelPosition: Readonly<Ref<string>>
  isInOverflow: Readonly<Ref<boolean>>
  isInFlyout?: Readonly<Ref<boolean>>
  isEnabled?: Readonly<Ref<boolean>>
  compact: Readonly<Ref<boolean>>
  hasIcons: Readonly<Ref<boolean>>
  hasToggleButtons: Readonly<Ref<boolean>>
  closeOverflow: () => void
  invokeCommand?: (sender: unknown, args: unknown) => void
}

export const commandBarContextKey: InjectionKey<CommandBarContext> = Symbol('WinUI.CommandBar')

export interface AppBarToggleContext {
  checked: Readonly<Ref<boolean | null>>
  toggle: (event: MouseEvent) => void
  sender: () => unknown
}

export const appBarToggleContextKey: InjectionKey<AppBarToggleContext | null> = Symbol('WinUI.AppBarToggleButton')

export const appBarProperty = (owner: 'AppBarButton' | 'AppBarToggleButton', property: string) => defineComponent({
  name: `${owner}.${property}`,
  __appBarButtonProperty: property,
  setup() { return () => null }
})

export const appBarBoolean = (value: unknown) => value === true || value === 'True'
