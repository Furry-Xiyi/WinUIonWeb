import { shallowRef } from 'vue'

export type TabViewDataPackage = {
  Properties: Record<string, unknown>; RequestedOperation: string; SetText: (text: string) => void;
  SetData: (format: string, value: unknown) => void; GetView: () => TabViewDataView
}
export type TabViewDataView = { Properties: Record<string, unknown>; AvailableFormats: string[]; Contains: (format: string) => boolean; GetTextAsync: () => Promise<string>; GetDataAsync: (format: string) => Promise<unknown> }
export const createTabViewDataPackage = (): TabViewDataPackage => {
  const formats = new Map<string, unknown>()
  const properties: Record<string, unknown> = {}
  return { Properties: properties, RequestedOperation: 'Move', SetText: text => { formats.set('Text', text) }, SetData: (format, value) => { formats.set(format, value) }, GetView: () => ({ Properties: properties, AvailableFormats: [...formats.keys()], Contains: format => formats.has(format), GetTextAsync: async () => String(formats.get('Text') ?? ''), GetDataAsync: async format => formats.get(format) }) }
}
export type TabViewDragSession = { Source: TabViewDragEndpoint; Key: unknown; Item: unknown; Tab: unknown; Data: TabViewDataPackage; Controller: AbortController; Native: boolean; NativeDragToken?: string; NativeDropObserved?: boolean; CanLeaveSource: boolean; PointerId?: number; X: number; Y: number; Target: TabViewDragEndpoint | null; DropIndex: number; Ghost?: HTMLElement }
export type TabViewDragEndpoint = {
  Id: string; Element: () => HTMLElement | null; CanAccept: (session: TabViewDragSession) => boolean;
  Over: (session: TabViewDragSession, event: Event | null) => boolean;
  Leave: () => void; Drop: (session: TabViewDragSession, event: Event | null) => Promise<string>;
  Complete: (session: TabViewDragSession, result: string, cancelled: boolean) => void
}
const endpoints = new Set<TabViewDragEndpoint>()
export const activeTabViewDrag = shallowRef<TabViewDragSession | null>(null)
let ending = false
export const registerTabViewDragEndpoint = (endpoint: TabViewDragEndpoint) => {
  endpoints.add(endpoint)
  return () => { if (activeTabViewDrag.value?.Source === endpoint || activeTabViewDrag.value?.Target === endpoint) cancelTabViewDrag(); endpoints.delete(endpoint) }
}
export const startTabViewDrag = (session: TabViewDragSession) => { cancelTabViewDrag(); ending = false; activeTabViewDrag.value = session }
export const moveTabViewDrag = (x: number, y: number, event: Event | null = null) => {
  const session = activeTabViewDrag.value
  if (!session || ending) return
  session.X = x; session.Y = y
  if (session.Ghost) session.Ghost.style.transform = `translate3d(${x + 12}px,${y + 12}px,0)`
  const target = [...endpoints].find(endpoint => { const bounds = endpoint.Element()?.getBoundingClientRect(); return bounds && x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom && endpoint.CanAccept(session) }) ?? null
  if (session.Target !== target) { session.Target?.Leave(); session.Target = target }
  if (target && !target.Over(session, event)) { target.Leave(); session.Target = null }
}
const clean = (session: TabViewDragSession) => {
  session.Target?.Leave(); session.Ghost?.remove()
  if (activeTabViewDrag.value === session) activeTabViewDrag.value = null
  ending = false
}
export const endTabViewDrag = async (event: Event | null = null, result?: string) => {
  const session = activeTabViewDrag.value
  if (!session || ending) return
  ending = true
  let operation = result ?? 'None'
  let cancelled = false
  try {
    try {
      if (result === undefined && session.Target) {
        operation = await session.Target.Drop(session, event)
        // A target that declined an operation is not an outside drop. Only
        // an observed release without a target may request tear-out.
        if (operation === 'None') { cancelled = true; session.Controller.abort() }
      }
    }
    catch { operation = 'None'; cancelled = true; session.Controller.abort() }
    if (activeTabViewDrag.value === session) session.Source.Complete(session, operation, cancelled || session.Controller.signal.aborted)
  }
  finally { if (activeTabViewDrag.value === session) clean(session) }
}
export const cancelTabViewDrag = () => {
  const session = activeTabViewDrag.value
  if (!session) return
  session.Controller.abort()
  clean(session); session.Source.Complete(session, 'None', true)
}
