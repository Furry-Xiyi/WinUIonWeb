import type { TabViewHostResult, TabViewHostSource } from './tabViewHostAdapter'

/** Internal browser transport; the public control retains the official XAML events. */
export const tabViewNativeDragBridgeKey = Symbol.for('WinUI.TabView.NativeDragBridge')
export const tabViewNativeDropHandledKey = Symbol.for('WinUI.TabView.NativeDropHandled')
export const isTabViewNativeDropHandled = (Args: unknown): boolean => Boolean(
  Args && typeof Args === 'object' && (Args as Record<symbol, unknown>)[tabViewNativeDropHandledKey] === true,
)

export interface TabViewNativeDragDataView {
  Properties: Record<string, unknown>
  AvailableFormats: string[]
  Contains(Format: string): boolean
  GetTextAsync(): Promise<string>
  GetDataAsync(Format: string): Promise<unknown>
}
export interface TabViewNativeDragPreview {
  Items: readonly unknown[]
  Tabs: readonly unknown[]
  SourceWindowId: string
  SourceId: string
  Data?: TabViewNativeDragDataView
}
export interface TabViewNativeDragSourceOptions<T> {
  RealizeDocument?(Document: T): T
  /** Called on the source after a genuine cross-window Move has committed. */
  OnTransferCompleted?(Result: TabViewHostResult<T>): void
}
export type TabViewNativeDragAcceptance = boolean | { Accepted: boolean; Handled: boolean }
export interface TabViewNativeDragBridge<T = unknown> {
  RegisterSource(Control: object, Source: TabViewHostSource<T>, Options?: TabViewNativeDragSourceOptions<T>): () => void
  /** An observed target Drop can complete the source even when its removed DOM node never receives dragend. */
  Start(Control: object, Event: DragEvent, Items: readonly unknown[], Tabs: readonly unknown[], Signal: AbortSignal,
    OnDropCompleted?: (Operation: 'Move' | 'None') => void): boolean
  Preview(Control: object, Event: DragEvent): TabViewNativeDragPreview | null
  /** Checks the current source token using protected DataTransfer.types. */
  OwnsDrag?(Control: object, Event: DragEvent): boolean
  /** Authenticate and mark a real Drop observed before awaiting author acceptance. */
  Drop(Control: object, Event: DragEvent, DropIndex: number,
    Accept?: (Signal: AbortSignal) => TabViewNativeDragAcceptance | Promise<TabViewNativeDragAcceptance>, Signal?: AbortSignal): Promise<'Move' | 'None'>
  /** A returned promise means a real target owns completion; undefined retains local completion. */
  End(Control: object, Event: DragEvent): Promise<'Move' | 'None'> | undefined
}
