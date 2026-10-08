# Multiple window host integration

`src/components/multipleWindowHostAdapter.ts` provides an application-scoped,
framework-independent window manager. Its tracking follows the official
`WinUI-Gallery/WinUIGallery/Helpers/WindowHelper.cs`: closed windows leave the
active collection, application theme changes reach child windows, and children
close when the application closes. Navigation away from a Gallery page does
not dispose the application's windows.

```ts
import {
  createMultipleWindowManager,
  multipleWindowManagerKey,
} from '../src/components/multipleWindowHostAdapter'
import { MicaBackdrop } from '../src/components/systemBackdrop'

const manager = createMultipleWindowManager()

// Run in the real click handler so the browser retains user activation.
const child = await manager.CreateWindow({
  title: resources.ChildWindowTitle,
  width: 500,
  height: 500,
  extendsContentIntoTitleBar: true,
  theme: parentActualTheme,
  backdrop: new MicaBackdrop(),
  mountContent(element, handle) {
    return mountFrameworkContent(element, { handle })
  },
})

await manager.SetTheme(parentActualTheme)
await manager.Dispose()
```

`CreateWindow` invokes the existing system backdrop host synchronously before
awaiting its result, tracks the completed child, and calls `Activate`. The
generic manager does not require any material; the official Gallery example
explicitly requests `Mica/Base`. Native `CreateWindow` applies the actual
`ExtendsContentIntoTitleBar` option and interprets width/height as client size,
equivalent to `AppWindow.ResizeClient`. The browser opens a real popup with the
requested dimensions, uses `Window.focus()`, and reports
`ExtendsContentIntoTitleBar: false`; it does not hide or imitate browser chrome.
Popup size and focus remain subject to actual browser policy.

The official child uses `Page` and a centered `TextBlock`, without adding a
TitleBar control. `connectWindowTitleBarFrame` reserves the actual caption band
above that content and supplies a blank drag region within its safe bounds.
PWA hosts use the real overlay geometry with `app-region: drag`; native hosts
receive `TitleBarWindowHost.SetDragRegions` with a Caption rectangle and no
interactive passthrough areas. Resize and geometry changes update the region.
An owning TitleBar takes over its own regions, and framework cleanup removes
the frame's drag element and releases its native region. An ordinary browser
keeps its own browser caption; it does not receive a simulated draggable bar.

`SystemBackdropHostTarget.Activate()` is an optional real native activation
callback. `handle.Activate()` uses it when present and otherwise calls the
target browser window's focus API. Activating an already closed handle is a
no-op. Native callback failure releases and closes a newly created child,
without leaving it in the active collection.

The manager exposes these operations:

- `ActiveWindows`: a snapshot of tracked live handles.
- `TrackWindow(handle)`: idempotent tracking of an existing/recovered handle,
  returning a release function for its tracking registration.
- `Subscribe(listener)`: immediate and subsequent active-collection snapshots.
- `SetTheme(theme)`: updates all tracked windows; a theme change while a child
  is still connecting also reaches that child before activation.
- `CloseAll()`: closes every tracked window and cancels pending creation.
- `Dispose()`: application shutdown cleanup, idempotent and followed by typed
  rejection of further creation requests.

Vue provides the manager under `multipleWindowManagerKey`. React context,
Angular dependency injection and Svelte context can carry the same manager
object. Keep it at application scope and dispose it when the application is
closing. Preserve it for a browser `pagehide` event with `persisted=true`, since
that application is entering the back-forward cache. Existing framework mount
callbacks are documented in
[system backdrop integration](./system-backdrop-host-adapter.md).

For a popup that loads its own framework runtime, keep its sample identity,
locale, requested theme and optional material in the popup URL/session storage.
Use `handle.SetContentElement(newRoot)` when the opener's live handle remains
available. If the opener runtime no longer owns that handle, use
`attachSystemBackdropWindow(newRoot, { id, nativeAssociationToken, theme,
backdrop })` to reconnect the same window, then `TrackWindow` in the runtime
that owns that child window's lifecycle. Do not track a popup's own handle in
its own child-window manager: disposing that manager during a reload would
close the popup itself. The opener's live manager keeps tracking its original
handle across child reload; when the opener has been lost, the current sample
session owns its reattached window directly. Reattachment never opens a
replacement window.

For same-origin browser windows, the persisted ID also identifies the current
window's shared content/theme/material context. Reattachment registers the new
content root in that window. The opener's original handle rejoins the current
document's context and follows that root even when the child has cleared
`window.opener`. Requests from either handle reach both connections; requests
made while the new document is still loading are retained until its content
root is registered. Stale queued revisions cannot overwrite a newer request.
The application must retain its own handle after reloading and must reattach
again when its framework runtime is replaced.

Each connection releases its own media, activation, state and context
subscriptions. Document replacement releases callbacks and content references
from the old document. Multiple connections share the original content style
values; disposing one leaves the remaining connection's rendering intact.
The last connection releases the shared context and restores only background,
foreground and backdrop state still owned by that context. An application's
later inline style changes are preserved. `Dispose` leaves the actual window
open; `Close` closes it.

Native recovery requires the real host association. Native targets do not join
the browser context: an adapter that returns multiple connections for one
native association must coordinate their current content root, native
theme/material changes, activation and `Closed` events itself. Releasing one
connection must not tear down a controller still owned by another connection.
The browser regression verifies same-origin browser reload/recovery; the
deterministic native fixtures verify host calls and cleanup, not a real native
host's synchronization after reload.
