export type ContentDialogResult = 'None' | 'Primary' | 'Secondary'
export type ContentDialogPlacement = 'Popup' | 'InPlace' | 'UnconstrainedPopup'

const activeDialogs = new Map<object, Map<object | null, { owner: object; element?: object }>>()

export const acquireContentDialog = (root: object, owner: object, parent: object | null = null, element?: object) => {
  let dialogs = activeDialogs.get(root)
  if (!dialogs) {
    dialogs = new Map()
    activeDialogs.set(root, dialogs)
  }
  const ancestor = parent as { contains?: (element: object) => boolean } | null
  const hasOpenDialog = parent === null ? dialogs.has(null) : dialogs.has(parent) || Array.from(dialogs).some(([existingParent, entry]) => existingParent !== null && entry.element && ancestor?.contains?.(entry.element))
  if (hasOpenDialog) {
    throw new Error('Only one ContentDialog may be open in a XamlRoot at a time.')
  }
  dialogs.set(parent, { owner, element })
  return () => {
    if (dialogs?.get(parent)?.owner === owner) dialogs.delete(parent)
    if (!dialogs?.size) activeDialogs.delete(root)
  }
}

export const createContentDialogEventArgs = (result?: ContentDialogResult) => {
  let deferrals = 0
  let dispatching = true
  let disconnected = false
  let resolve!: () => void
  const completed = new Promise<void>((finish) => { resolve = finish })
  const continueIfReady = () => {
    if (!dispatching && deferrals === 0) resolve()
  }
  const args = {
    Cancel: false,
    ...(result === undefined ? {} : { Result: result }),
    GetDeferral() {
      if (!dispatching || disconnected) throw new Error('GetDeferral must be called while the ContentDialog event is being raised.')
      deferrals += 1
      let complete = false
      return {
        Complete() {
          if (complete || disconnected) return
          complete = true
          deferrals -= 1
          continueIfReady()
        }
      }
    }
  }
  return {
    args,
    completed,
    finishDispatch() {
      dispatching = false
      continueIfReady()
    },
    disconnect() {
      disconnected = true
      dispatching = false
      deferrals = 0
      resolve()
    }
  }
}

const focusableSelector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex], [contenteditable="true"]'

export const contentDialogFocusableElements = (root: HTMLElement | null): HTMLElement[] => {
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) =>
    element.tabIndex >= 0 && !element.closest('[inert], [hidden], [aria-hidden="true"]') && element.getClientRects().length > 0
  )
}
