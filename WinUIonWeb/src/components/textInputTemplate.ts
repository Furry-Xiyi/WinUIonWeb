import type { InjectionKey, VNode } from 'vue'

export type TextInputSurface = {
  Focused: () => void
  Blurred: () => void
  PointerEntered: () => void
  PointerExited: () => void
}

// Private template parts shared by the native text-input control family.
// These are implementation parts, not a second public slot API.
export const textInputTemplateKey: InjectionKey<{
  Field?: (surface: TextInputSurface) => VNode | VNode[]
  Actions?: () => VNode | VNode[] | null
  HideDeleteButton?: boolean
  ActionsWidth?: () => number
  ReserveDeleteButtonWidth?: number
  DesiredWidthChanged?: (width: number) => void
  KeyDown?: (event: KeyboardEvent) => void
}> = Symbol('WinUIonWeb.TextInputTemplate')
