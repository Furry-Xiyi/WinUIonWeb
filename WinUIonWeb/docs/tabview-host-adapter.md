# TabView window and split hosts

`src/components/tabViewHostAdapter.ts` separates WinUI `TabView` event semantics
from the application's window manager. It has no framework imports and never
calls `window.open`. The host supplies the actual window or pane creation,
rendering, routing, and disposal functions.

`CreateWindow` prepares a destination and leaves the source collection intact.
`TearOut` transfers items to that destination. `OpenWindow` performs both steps
for commands such as the Gallery windowing sample's launch button. `Split`
prepares a pane at `Left`, `Right`, `Top`, or `Bottom` and transfers its items.
`Move` transfers to an existing collection at `DropIndex`, including reordering
within the same collection. Every operation resolves to `Status: 'Accepted'`
or `Status: 'Cancelled'`; cancellation includes a machine-readable `Reason`.
An unconfigured operation reports `HostUnavailable`.

## Source and Destination Ownership

Create a source once and reuse it for its collection. `Read` must return the
current items, and `Write` must synchronously publish the replacement so that
the next `Read` sees it. Optional selection callbacks preserve source selection
and select the transferred item in a different target. Sources backed by
official `TabItems` can use `createTabViewMutableCollectionSource(TabItems)`;
this preserves unaffected containers instead of clearing and recreating them.

The destination callback returns a target source and an identifier. The
identifier maps to the official event's `NewWindowId`; a browser host may use
its own opaque string or numeric window identifier. An optional `Commit`
callback can reject the transfer before collections change. `Dispose` releases
the destination when preparation or transfer fails. After an accepted transfer,
the application owns its window or pane and controls its normal lifetime.

```ts
import {
  createTabViewHostAdapter,
  type TabViewHostOptions,
} from '../src/components/tabViewHostAdapter'

// windowManager is the application's framework-specific window service.
const options: TabViewHostOptions<DocumentTab> = {
  async CreateWindow(request) {
    const window = await windowManager.createEmptyWindow({
      pointer: request.Pointer,
      signal: request.Signal,
    })
    if (!window) return { Status: 'Cancelled', Reason: 'Rejected' }
    return {
      Status: 'Accepted',
      NewWindowId: window.id,
      Target: window.tabSource,
      Commit: transfer => window.prepareTransfer(transfer),
      Dispose: () => window.close(),
    }
  },
  async Split(request) {
    const pane = await windowManager.createEmptyPane(request.Edge, request.Signal)
    if (!pane) return { Status: 'Cancelled', Reason: 'Rejected' }
    return {
      Status: 'Accepted',
      NewWindowId: pane.id,
      Target: pane.tabSource,
      Dispose: () => pane.close(),
    }
  },
}
const hostAdapter = createTabViewHostAdapter(options)
```

The adapter locks collections during transfers, rechecks them after async host
decisions, and restores both collections and selection when a write fails.
`SourceChanged` or `TargetChanged` reports an outside update during preparation.
`RollbackFailed` includes the errors when the host cannot restore its state.
An optional synchronous `Batch(operation)` callback can combine source and
target notifications using the framework's batching API. Host store writes
must support restoring a previously returned snapshot.

## Official Event Sequence

The XAML event names and arguments follow `WinUI-Reference`. Window creation and
item transfer are separate requests. The control awaits an async
`TabTearOutWindowRequested` handler before checking `args.NewWindowId` and
raising `TabTearOutRequested`.

```xml
<TabView CanTearOutTabs="True"
         TabTearOutWindowRequested="Tabs_TabTearOutWindowRequested"
         TabTearOutRequested="Tabs_TabTearOutRequested"
         ExternalTornOutTabsDropping="Tabs_ExternalTornOutTabsDropping"
         ExternalTornOutTabsDropped="Tabs_ExternalTornOutTabsDropped" />
```

```ts
import { createTabViewMutableCollectionSource } from '../src/components/tabViewHostAdapter'
import { isTabViewNativeDropHandled } from '../src/components/tabViewNativeDragBridge'

async function Tabs_TabTearOutWindowRequested(sender, args) {
  const result = await hostAdapter.CreateWindow({
    Source: createTabViewMutableCollectionSource(sender.TabItems),
    Items: args.Items,
    Tabs: args.Tabs,
    Signal: args.Signal,
  })
  args.Cancel = result.Status === 'Cancelled'
  if (result.Status === 'Accepted') args.NewWindowId = result.NewWindowId
  publishWindowingResult(result)
}

async function Tabs_TabTearOutRequested(sender, args) {
  const result = await hostAdapter.TearOut({
    Source: createTabViewMutableCollectionSource(sender.TabItems),
    Items: args.Items,
    Tabs: args.Tabs,
    NewWindowId: args.NewWindowId,
    Signal: args.Signal,
  })
  args.Cancel = result.Status === 'Cancelled'
  publishWindowingResult(result)
}

function Tabs_ExternalTornOutTabsDropping(sender, args) {
  args.AllowDrop = windowManager.canAccept(args.Items)
}

async function Tabs_ExternalTornOutTabsDropped(sender, args) {
  // The authenticated browser transport has already committed this transfer.
  if (isTabViewNativeDropHandled(args)) return
  // Ownership lookup must use the originating host's source before removal.
  const source = windowManager.sourceForItems(args.Items)
  const result = await hostAdapter.Move({
    Source: source,
    Target: createTabViewMutableCollectionSource(sender.TabItems),
    Items: args.Items,
    Tabs: args.Tabs,
    DropIndex: args.DropIndex,
    Signal: args.Signal,
  })
  args.Cancel = result.Status === 'Cancelled'
  publishWindowingResult(result)
}
```

`TabDroppedOutside` is the older drag-and-drop event. Its handler may call
`OpenWindow` explicitly. Split commands call `Split` with the application's
source, items, tab containers, and requested edge; split is a host operation,
not an additional XAML event. The web control adds `Signal` to asynchronous
tear-out and drop arguments so host integration can cancel work when the
control is disabled or removed; forward that signal to the adapter. It also
accepts `Cancel` on async tear-out and external drop arguments. Set that flag
from the adapter result to report rejection to the control's completion path.

Browser-native drag completion requires an observed drop. Chromium can consume
Escape without delivering a key event, then report `dragend` with
`dropEffect: 'none'`. The same value can describe a rejected target or a drop
outside the current document. A native drag ending with `none` and no observed
drop therefore cancels and restores the source; it does not raise
`TabDroppedOutside`, prepare a window, or remove a tab. An observed drop inside
the current document but outside the tab strip can raise the outside-drop and
tear-out events. Pointer and touch gestures likewise use their observed release
to complete an outside-strip drop.

For native drops beyond the current document, a host must positively confirm
the destination and drop outcome through window communication or shell
integration. The bundled browser/PWA host below provides this confirmation
for registered windows in its same-origin family. Other hosts can call
the source control's `RequestTearOut(item)` to use the event sequence above, or
explicitly call the adapter methods with the correct source and destination.
Keep the source items until that confirmed transfer succeeds, and handle each
drop once. An opaque `dragend` result of `none`, a missing acknowledgement, or a
closed destination is insufficient evidence to create a window or transfer
ownership. The adapter does not infer this host protocol or open a window
automatically.

Pass an `AbortSignal` when the command or gesture may be cancelled. Cancellation
aborts host work, leaves the collections untouched, and disposes prepared
destinations, including a host that finishes creation after cancellation.
`CancelWindow(id)` releases an unused prepared destination. On host teardown,
await `hostAdapter.Dispose()` to abort active work and release pending windows.

## Browser and PWA Windows

`src/components/tabViewPwaHost.ts` is the bundled same-origin browser host. It
opens a usable child application, waits for its mounted document source, and
uses the adapter's existing window, transfer, and split contracts. The neutral
adapter itself still never opens a browser window.

```ts
import {
  createTabViewPwaHost,
  readTabViewPwaSession,
  tabViewPwaHostKey,
  tabViewPwaSessionKey,
} from '../src/components/tabViewPwaHost'
import { tabViewHostAdapterKey } from '../src/components/tabViewHostAdapter'
import { tabViewNativeDragBridgeKey } from '../src/components/tabViewNativeDragBridge'

const browserHost = createTabViewPwaHost({
  Window: window,
  BaseUrl: window.location.href,
  Locale: () => applicationLocale,
  Theme: () => applicationTheme,
})
app.provide(tabViewHostAdapterKey, browserHost.Adapter)
app.provide(tabViewPwaHostKey, browserHost)
app.provide(tabViewNativeDragBridgeKey, browserHost.NativeDragBridge)

const childSession = readTabViewPwaSession()
if (childSession) app.provide(tabViewPwaSessionKey, childSession)
```

Call `browserHost.Adapter.OpenWindow(request)` directly from the launch click,
before any `await`. Its `CreateWindow` callback calls `window.open` synchronously
in that click's activation. Popup rejection returns `WindowUnavailable` and
`WindowOpenStatus: 'Blocked'` while preserving the source. A child that closes,
changes origin, fails to mount, or times out cannot receive source ownership.
Successful child windows belong to the application and stay open when the
launching host is disposed; unused prepared windows are closed.

Each window has a fresh framework runtime and builds its own visual tree from
`TabViewPwaDocument`: `{ Id, Header, Title, IsOn, Icon? }`. Identifiers must be
unique. Components, VNodes, DOM elements, `Content`, and arbitrary additional
fields are rejected before opening. Every window boundary clones these data
fields. A window can update `Title` and `IsOn` locally and later transfer that
current document state.

The child calls `session.Ready(source, options)` after mounting its TabView and
publishing a synchronous DTO source. A `postMessage` handshake verifies the
expected origin, child window, and random session nonce. Only then does the
parent use registered same-origin source callbacks. The callbacks clone DTOs
and synchronously verify publication, so a failed destination write can restore
the source instead of losing a tab. An asynchronous message-only remote store
does not satisfy this transactional source contract.

```ts
const stopSession = childSession.Ready(documentSource, {
  // Optional: Vue shallowReactive, an Angular/React external-store wrapper,
  // or another framework's local document representation.
  RealizeDocument: document => makeLocallyReactive(document),
  CreateSplit: (edge, signal) => paneManager.createTabPane(edge, signal),
})
// createTabPane returns { Id, Source, Dispose? } for a real rendered pane.
// Dispose the registration when the child root unmounts.
```

`RealizeDocument` applies only to incoming cross-window DTOs. Local source
`Write` implementations must preserve the objects they receive; local `Split`
uses those identities to detect concurrent updates and restore state.
`CreateSplit` is optional. When supplied, `Adapter.Split` creates the actual
application pane and transfers documents into it; without it the operation
reports `HostUnavailable`. All four split edges use the same contract.

Read `Capabilities`, or use `Subscribe` to observe its changes. The host reports
the current window's display mode, the child window's actual display mode,
handshake readiness, live windows, and registered application split support.
`ConfirmedWindowTransfer` becomes true only after the mounted child has
successfully accepted documents, rather than merely after a popup opens.
`ChildReady` and live counts stop claiming usability when the child closes or
its source registration disappears. Releasing the child source notifies the
opener immediately; periodic capability snapshots also recover lost readiness
notifications and navigation changes. Re-registering a child source refreshes
its actual split support, including removal of a previously registered split
callback.
`WindowOpenStatus` records the launch outcome. Closing a child after an accepted
transfer preserves that successful outcome; it does not turn the launch into
`Cancelled`. Use `ChildReady` and `SameOriginCommunication` for current
availability. The Gallery displays a previously ready but disconnected child
as unavailable. Closing a child that has not received ownership still cancels
the pending launch and preserves its source.

The project's manifest requests `standalone` and `window-controls-overlay`.
Those requests do not prove installation or guarantee that `window.open`
launches another installed PWA instance. `CurrentDisplayMode`, `IsInstalledApp`,
and `LastWindowDisplayMode` use the windows' actual runtime media queries. An
ordinary browser popup remains reported as `browser`. The project currently
has no service worker, so this host does not claim offline availability.

Application pane splitting and confirmed document transfer into another
same-origin child work through these callbacks. Native browser tab-group
splitting and desktop window tear-out APIs are unavailable to this web host,
reported as `NativeTabSplit: false` and `NativeWindowTearOut: false`. The host
supports native HTML dragging between its registered application windows;
that support does not require browser tab-group or desktop tear-out APIs.

## Native Drag Between Application Windows

Register each mounted TabView that owns a synchronous DTO source, including
the first launched sample window, its children, and siblings. The Gallery
launch button does not become a receiving target merely because it opened
the initial window. A TabView with VNode items must not register those visual
objects as a DTO source. Each receiving window creates its own visual tree
from locally realized documents.

```ts
const stopNativeSource = browserHost.NativeDragBridge.RegisterSource(
  tabViewControl,
  documentSource,
  {
    RealizeDocument: document => makeLocallyReactive(document),
    OnTransferCompleted(result) {
      // Optional application policy, after the committed acknowledgement.
      if (result.Status === 'Accepted' && documentSource.Read().length === 0) {
        window.close()
      }
    },
  },
)
// Stop the registration before the owning TabView unmounts.
```

`src/components/tabViewPwaNativeDrag.ts` maintains a same-origin window family.
The opener pre-registers the exact child WindowProxy and a random window
nonce before its mounted host can inherit the family. Copying a URL or nonce,
using another window with the same origin, or having an unregistered opener
does not grant family membership. The family routes synchronous DTO callback
bridges; it does not transport controls, VNodes, DOM elements, or framework
visual trees.

The native `DataTransfer` carries the MIME format
`application/x-winui-tabview-window-v1` and an opaque session token in a second
format name. Protected `dragover` data cannot be read, so hover preview checks
the token against an active family session using only `DataTransfer.types`.
An actual `Drop` also validates the payload's family, session, source-window,
and source identifiers. Unknown, forged, completed, or cancelled sessions
cannot authorize collection changes. Same-document drops retain the normal
TabView reorder and cross-container path.

An authenticated target marks an actual Drop as observed before awaiting
`TabStripDrop` and `ExternalTornOutTabsDropping`. The source's `dragend` awaits
that target's completion when necessary. Only acceptance and a successful
transaction acknowledge `Move`; rejection, Escape, source or target teardown,
closed windows, and cancelled work acknowledge `None`. A `dragend` of `none`
without an observed target remains cancellation and preserves the source.
The transport does not infer a new-window request from an unobserved native
drag ending outside the document.

The internal bridge's optional `Start(..., OnDropCompleted)` callback reports
the observed target's committed `Move` or cancelled `None` after settling the
completion promise and removing the source abort listener. This releases the
source control even if removing its dragged DOM node causes the browser to
omit `dragend`. The callback runs once for an observed Drop, never for an
unobserved drag cancellation; exceptions cannot revoke the outcome. Controls
check that the callback still belongs to their current drag session before
completing it, so a delayed acknowledgement cannot clear a newer gesture.

The transfer reads the dragged IDs again after acceptance, so current `Title`
and `IsOn` values move with the documents. It inserts at the target index,
updates selection, and rolls back both collections and selection if any
synchronous write fails. Local retained documents keep their object identity;
removed local objects remain available for exact rollback and subsequent
round trips. `RealizeDocument` runs for newly arriving local documents. All
cross-window snapshots remain cloned DTOs.

If an author marks `TabStripDrop.Handled`, the transport does not perform
another collection move. It acknowledges `Move` only after verifying that all
dragged IDs have disappeared from the source and appeared in the target.
The target must not have owned those IDs before the Drop. A handled event
without an actual ownership transfer completes as `None`. The postcommit
`ExternalTornOutTabsDropped` arguments are marked by
`isTabViewNativeDropHandled(args)`; handlers must skip a second adapter move.

`OnTransferCompleted` runs on the source after committed acknowledgement.
Closing an empty sample source window there cannot revoke the target's
accepted documents. Unregistering a source or disposing its host cancels
pending work, while successful windows and committed documents remain owned
by their application. The host sweeps closed windows and stale drag sessions.

`Capabilities.NativeCrossWindowDrag` is true only while the current window
has a live registered DTO source. `LastWindowNativeCrossWindowDrag` additionally
requires the last launched child to be ready and have its own live registered
source. Capability subscribers refresh when registrations change. The Gallery
uses the last-child capability for its launch result and the current-window
capability inside a sample window.

Use the confirmed host transfer command or an observed outside-strip Pointer
gesture to request a new window; browser popup policy may still require an
explicit click. Native drag between existing registered windows does not
open another window.

## Vue

Vue sources can update a reactive array in place. Provide the configured
adapter from the application's bootstrap or ancestor; the Gallery injects
the same symbol and shows the returned operation result.

```ts
import { inject, reactive } from 'vue'
import {
  createTabViewCallbackSource,
  tabViewHostAdapterKey,
  type TabViewHostAdapter,
} from '../src/components/tabViewHostAdapter'

app.provide(tabViewHostAdapterKey, hostAdapter)

const tabs = reactive<DocumentTab[]>([])
const source = createTabViewCallbackSource({
  Read: () => tabs,
  Write: items => tabs.splice(0, tabs.length, ...items),
})
const configuredHost = inject<TabViewHostAdapter<DocumentTab>>(tabViewHostAdapterKey)
```

## React

Use a synchronous store and subscribe with `useSyncExternalStore`. React
`setState` alone schedules a render and does not satisfy `Write` followed by
`Read` in the same transaction. Keep each store and source stable for the
window's lifetime, for example by creating them in an application service.

```ts
import { useSyncExternalStore } from 'react'
import { createTabViewCallbackSource } from '../src/components/tabViewHostAdapter'

function createTabStore(initial: readonly DocumentTab[]) {
  let items = [...initial]
  const listeners = new Set<() => void>()
  const source = createTabViewCallbackSource({
    Read: () => items,
    Write: next => {
      items = [...next]
      for (const listener of listeners) listener()
    },
  })
  return {
    source,
    read: () => items,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
  }
}
const tabStore = createTabStore([])

function TabWindow() {
  const items = useSyncExternalStore(tabStore.subscribe, tabStore.read, tabStore.read)
  return renderApplicationTabs(items)
}
```

Host `CreateWindow` or `Split` callbacks render the new root or pane and return
that root's `tabStore.source`. Framework applications bridge their own view
events to the same adapter methods; the web WinUI component's public XAML API
retains the official event names.

## Angular

Angular signals publish synchronously and satisfy the source contract. The
application's dependency injection service can own the adapter and pane
manager.

```ts
import { signal } from '@angular/core'
import { createTabViewCallbackSource } from '../src/components/tabViewHostAdapter'

const tabs = signal<readonly DocumentTab[]>([])
const source = createTabViewCallbackSource({
  Read: () => tabs(),
  Write: items => tabs.set([...items]),
})
```

## Svelte

A writable store also publishes synchronously. Reuse the same store/source
pair for each target returned by the application's window or pane manager.

```ts
import { get, writable } from 'svelte/store'
import { createTabViewCallbackSource } from '../src/components/tabViewHostAdapter'

const tabs = writable<readonly DocumentTab[]>([])
const source = createTabViewCallbackSource({
  Read: () => get(tabs),
  Write: items => tabs.set([...items]),
})
```
