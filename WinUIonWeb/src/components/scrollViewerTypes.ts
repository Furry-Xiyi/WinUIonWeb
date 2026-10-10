// Enums
export type ScrollViewerZoomMode = 'Disabled' | 'Enabled'
export type ScrollViewerScrollMode = 'Disabled' | 'Enabled' | 'Auto'
export type ScrollViewerScrollBarVisibility = 'Disabled' | 'Auto' | 'Hidden' | 'Visible'
export type ScrollViewerHorizontalAlignment = 'Left' | 'Center' | 'Right' | 'Stretch'
export type ScrollViewerVerticalAlignment = 'Top' | 'Center' | 'Bottom' | 'Stretch'

// Dependency properties from the WinUI ScrollViewer default template.
export interface Props {
  Template?: string
  ZoomMode?: ScrollViewerZoomMode | string
  MinZoomFactor?: number | string
  MaxZoomFactor?: number | string
  HorizontalScrollMode?: ScrollViewerScrollMode | string
  VerticalScrollMode?: ScrollViewerScrollMode | string
  HorizontalScrollBarVisibility?: ScrollViewerScrollBarVisibility | string
  VerticalScrollBarVisibility?: ScrollViewerScrollBarVisibility | string
  IsVerticalScrollChainingEnabled?: boolean | string
  IsHorizontalScrollChainingEnabled?: boolean | string
  IsTabStop?: boolean | string
  IsEnabled?: boolean | string
  IsHorizontalRailEnabled?: boolean | string
  IsVerticalRailEnabled?: boolean | string
  IsDeferredScrollingEnabled?: boolean | string
  Width?: number | string
  Height?: number | string
  MinWidth?: number | string
  MaxWidth?: number | string
  MinHeight?: number | string
  MaxHeight?: number | string
  Margin?: string
  Padding?: string
  Background?: string | object
  BorderBrush?: string
  BorderThickness?: number | string
  CornerRadius?: number | string
  HorizontalContentAlignment?: ScrollViewerHorizontalAlignment | string
  VerticalContentAlignment?: ScrollViewerVerticalAlignment | string
  HorizontalAlignment?: ScrollViewerHorizontalAlignment | string
  VerticalAlignment?: ScrollViewerVerticalAlignment | string
}

// Official ScrollViewer events carry their sender and event arguments.
export interface ScrollViewerView {
  HorizontalOffset: number
  VerticalOffset: number
  ZoomFactor: number
}

export interface ViewChangedEventArgs {
  IsIntermediate: boolean
}

export interface ViewChangingEventArgs {
  NextView: ScrollViewerView
  FinalView: ScrollViewerView
  IsInertial: boolean
}

