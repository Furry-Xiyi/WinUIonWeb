import type { InjectionKey } from 'vue'

export type ScrollBarOrientation = 'Horizontal' | 'Vertical'
export type ScrollBarScrollEventArgs = { ScrollEventType: 'SmallDecrement' | 'SmallIncrement' | 'LargeDecrement' | 'LargeIncrement' | 'ThumbTrack' | 'ThumbPosition' | 'EndScroll'; NewValue: number }
export interface ScrollBarOwner {
  onHover?: (orientation: ScrollBarOrientation, over: boolean) => void
  onInteraction?: (orientation: ScrollBarOrientation, active: boolean) => void
  onPointerActivity?: (pointerType: string) => void
  // Templates consult the application's single accessibility setting.
  autoHide?: () => boolean
}
export const scrollBarOwnerKey: InjectionKey<ScrollBarOwner> = Symbol('ScrollBar template owner')
