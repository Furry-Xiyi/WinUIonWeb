# System backdrop and window host integration

`src/components/systemBackdrop.ts` and
`src/components/systemBackdropHostAdapter.ts` are independent of Vue. The same
window lifecycle, capability checks, theme policy and content host can be used
from React, Vue, Angular and Svelte. Import their TypeScript exports directly
when embedding the library.

The browser adapter opens a real browser window. Browsers do not expose the
Windows desktop compositor, so it reports `NativeSystemBackdrop: false` and
keeps the effect surface transparent and publishes an unavailable-material
state for the application to localize. It never claims that CSS blur or a
guessed opaque color is native Mica or
Desktop Acrylic. A desktop web host supplies an adapter to apply the actual
native material. A transparent content background is necessary for that
material to remain visible.

## Public types

The built-in XAML materials follow the WinUI API: `MicaBackdrop.Kind` is `Base`
or `BaseAlt`, and `DesktopAcrylicBackdrop` uses the Base kind. The Composition
controller configuration also accepts `DesktopAcrylic` with kind `Thin`, plus
`TintColor`, `TintOpacity`, `LuminosityOpacity` and `FallbackColor`.

```ts
import { MicaBackdrop } from '../src/components/systemBackdrop'
import { createSystemBackdropWindow } from '../src/components/systemBackdropHostAdapter'

const backdrop = new MicaBackdrop()
backdrop.Kind = 'BaseAlt'

// Run directly in the button handler. The browser open occurs before the
// first await, preserving the browser's user activation for popup permission.
const handle = await createSystemBackdropWindow({
  title: resources.sampleWindowTitle,
  width: 640,
  height: 480,
  theme: 'Default',
  backdrop,
  mountContent(element, handle) {
    // Mount the framework-owned content into this stable HTMLElement.
    // Return its unmount/dispose operation.
  },
})

const unsubscribe = handle.Subscribe(state => {
  // Translate state.Reason through the application's resource dictionary.
  // state.RequestedBackdrop describes the request.
  // state.AppliedBackdrop is null when the native effect is unavailable.
  renderStatus(state)
})
await handle.SetTheme('Dark')
await handle.SetSystemBackdrop({ Type: 'DesktopAcrylic', Kind: 'Thin' })
unsubscribe()
await handle.Close()
```

`State.Status` is `Active`, `Fallback`, `HighContrast` or `Closed`. `State.Theme`
is the actual `Light` or `Dark` theme; `RequestedTheme` also accepts `Default`.
Fallback reasons are `NativeBackdropUnavailable`, `MaterialUnsupported`,
`Inactive`, `HighContrast`, `TransparencyDisabled`, `EnergySaver` and
`HostError`. The window owns the focus, theme and accessibility-policy
subscriptions and releases them on close. Calling `Close` more than once is
safe. `options.signal` cancels opening and releases a host that finishes after
cancellation.

If a popup navigates to load its own app runtime, call
`handle.SetContentElement(newContentElement)` after loading. The new element
must belong to the same window. The Gallery uses this mechanism so child
controls, overlays and focus handling run in the child window's runtime.

For recovery after a page reload has lost the opener's live handle, reconnect
the current window's content with `attachSystemBackdropWindow`. Persist the
requested theme and material, rather than the temporarily applied fallback.
This operation uses the supplied element's existing window and never calls
`window.open`:

```ts
import { attachSystemBackdropWindow } from '../src/components/systemBackdropHostAdapter'

const handle = await attachSystemBackdropWindow(contentElement, {
  id: savedState.Id,
  nativeAssociationToken: savedState.NativeAssociationToken,
  theme: savedState.RequestedTheme,
  backdrop: savedState.RequestedBackdrop,
})
```

The browser adapter preserves the supplied ID and restores its policy
subscriptions. A native host implements `AttachWindow(element, options)` to
resolve the existing window through that ID or its own opaque association
token. It returns the token as `target.NativeAssociationToken`, exposed as
`handle.NativeAssociationToken`; the application must not invent a native
token from a browser ID. A saved native token requires the actual native host
to be installed before recovery. The host must return the same content
window, and must never open a replacement. Failed or cancelled attachment
disposes that connection while leaving the existing window available; a
successful handle owns normal `Close()` behavior.

Gallery windows share `src/utils/pwaWindowChrome.ts` with the main application
and TabView windows. `observePwaWindowChrome(window, contentElement)` follows
the actual document theme and rendered background layers, including an exact
fallback supplied by the native host. It updates the browser's `theme-color`
metadata and `color-scheme`, follows running theme transitions frame by frame,
and returns a cleanup function for page navigation or framework unmount.
These are browser/PWA caption metadata. An actual desktop caption color and
non-client area remain owned by the native host; metadata does not apply a
desktop material or change the effect surface.

## Framework content adapters

For ordinary DOM content, the following callbacks are sufficient. When a
component library uses global `document`, `window`, portals, teleports or
overlay services, start that framework runtime in the destination window
instead. Its entry point can receive the handle through a same-origin bridge
and replace the content element after loading.

Vue:

```ts
import { createApp } from 'vue'

const mountContent = (element, handle) => {
  const app = createApp(BackdropWindowContent, { handle })
  app.mount(element)
  return () => app.unmount()
}
```

React:

```tsx
import { createRoot } from 'react-dom/client'

const mountContent = (element, handle) => {
  const root = createRoot(element)
  root.render(<BackdropWindowContent handle={handle} />)
  return () => root.unmount()
}
```

Angular:

```ts
import { createComponent } from '@angular/core'

const mountContent = (element, handle) => {
  const component = createComponent(BackdropWindowContent, {
    environmentInjector,
    hostElement: element,
  })
  component.setInput('handle', handle)
  applicationRef.attachView(component.hostView)
  component.changeDetectorRef.detectChanges()
  return () => {
    applicationRef.detachView(component.hostView)
    component.destroy()
  }
}
```

Svelte 5:

```ts
import { mount, unmount } from 'svelte'

const mountContent = (element, handle) => {
  const component = mount(BackdropWindowContent, {
    target: element,
    props: { handle },
  })
  return () => unmount(component)
}
```

## Native desktop host

Provide the host callbacks through `options.adapter`, or install a shared
adapter before mounting the application. `ApplyBackdrop` must report success
only after the native controller applies the requested effect. Clearing it
with `null` must release its native target/controller; `Dispose` releases
subscriptions and other target resources, and `Close` closes the actual
window. These operations must tolerate repeated cleanup. The native host
renders its actual official fallback. If it needs the DOM surface to show that
color, return the exact controller color as `GetConfiguration().FallbackColor`;
the core supplies no guessed material palette.

The returned target can also expose `TitleBarHost`, forwarded unchanged as
`handle.TitleBarHost`. This is the real native caption host, including
activation, drag regions and safe left/right caption insets. The destination
framework runtime registers it on its actual content root before mounting the
TitleBar and releases that registration after unmount. `AttachWindow` returns
the existing window's caption host again during recovery. See the
[TitleBar adapter document](./title-bar-host-adapter.md) for its geometry and
ownership contract.

```ts
import {
  setSystemBackdropHostAdapter,
  type SystemBackdropHostAdapter,
} from '../src/components/systemBackdropHostAdapter'

const adapter: SystemBackdropHostAdapter = {
  CreateWindow(options) {
    // Return {Id, Content, Window?, Kind:'Window', Subscribe, Dispose, Close}.
    return desktopHost.createWindow(options)
  },
  AttachWindow(element, options) {
    // Optional: restore only this existing window after its framework reloads.
    return desktopHost.attachExistingWindow(element, options.id, options.nativeAssociationToken)
  },
  ConnectSurface(element) {
    // Optional: connect a SystemBackdropElement to a clipped native surface.
    return desktopHost.connectBackdropSurface(element)
  },
  GetCapabilities(target) {
    // Report each material and kind from the actual OS/runtime capability.
    return desktopHost.getBackdropCapabilities(target.Id)
  },
  GetConfiguration(target) {
    // Optional native high contrast, transparency and energy policy.
    return desktopHost.getBackdropConfiguration(target.Id)
  },
  ApplyBackdrop(target, backdrop, configuration) {
    return desktopHost.applyBackdrop(target.Id, backdrop, configuration)
  },
  SetTheme(target, theme) {
    return desktopHost.setWindowTheme(target.Id, theme)
  },
}

const restorePreviousAdapter = setSystemBackdropHostAdapter(adapter)
```

`SystemBackdropHostTarget.Subscribe` emits `Activated` with `IsInputActive`,
`Closed`, `CapabilitiesChanged` or `ConfigurationChanged`. `ApplyBackdrop` receives the current actual
theme, focus state, high contrast, transparency preference and energy policy.
The adapter should preserve the framework content element when changing
materials, and should never apply a second material without releasing the
previous controller. An unsupported request publishes its real unavailable
state. Browser surfaces remain transparent; native surfaces use the host's
actual fallback rendering.

The Gallery application's existing window uses `connectGalleryWindowBackdrop`
from `src/utils/galleryWindowBackdrop.ts`. It requests native `Mica/Base` only
through an installed or explicitly supplied adapter, validates the actual
desktop-compositor capability, and connects the existing content root through
`AttachWindow`. Without an adapter it returns `null` and leaves the browser or
PWA's official `SolidBackgroundFillColorBaseBrush` page fallback unchanged.
The native host must support `Mica` with kind `Base`; unsupported capabilities
are rejected before content or theme mutation.

```ts
import { connectGalleryWindowBackdrop } from '../src/utils/galleryWindowBackdrop'

const connection = await connectGalleryWindowBackdrop(contentElement, {
  theme: applicationRequestedTheme,
})
await connection?.SetTheme('Default')
// Release native material when the application runtime leaves this window.
await connection?.Dispose()
```

The helper exposes `Handle`, `SetTheme` and `Dispose`, plus the
`galleryWindowBackdropKey` symbol for framework injection. `handle.Dispose()`
releases the material, policy subscriptions and content cleanup without closing
the existing application window, and restores the content root's original
background, foreground and backdrop state. `handle.Close()` retains its normal
actual-window close behavior. Native fallback colors remain owned by the
controller or supplied exactly through `GetConfiguration().FallbackColor`.
While a native controller has accepted Mica or its official policy fallback,
the helper temporarily makes the HTML and body background layers transparent
so they cannot cover the compositor. Host errors and unsupported material
restore the original page fallback. Restoring layers preserves original inline
values and priorities and does not overwrite styles subsequently replaced by
the application. Aborting an attached existing-window connection also disposes
the connection and leaves that window open.

When the requested material has no native host, its state remains
`Fallback` with reason `NativeBackdropUnavailable` even if the browser has
high contrast or reduced transparency enabled. Accessibility preferences
still reach the framework's controls, but the material output never claims
that an unavailable desktop effect is showing a native fallback.

Keep the supported controller connected when policy disables the active
effect: an inactive window, high contrast, disabled transparency and energy
saver are passed to `ApplyBackdrop` with the material descriptor intact. The
controller selects its own official fallback. `State.AppliedBackdrop` becomes
null while that fallback is visible. `ApplyBackdrop(null, ...)` removes the
material or handles an unsupported material/host.

In-app `AcrylicBrush` follows the separate policy in the reference's
`MaterialHelper`: energy saver, slow effects and disabled advanced effects
select the brush's own official `FallbackColor`. Window deactivation does not
disable in-app Acrylic. `setUISettingsHostAdapter` in `uiSettings.ts` connects
native `UISettings`, high contrast and `PowerManager` updates to the shared
brush policy. Every brush host uses the same resource definitions and policy.

```ts
import { setUISettingsHostAdapter } from '../src/components/uiSettings'

const releasePolicy = setUISettingsHostAdapter({
  Read: () => desktopHost.readUISettings(),
  Subscribe: listener => desktopHost.subscribeUISettings(listener),
})
// Read/Subscribe publish AutoHideScrollBars, AdvancedEffectsEnabled,
// AreEffectsFast, EnergySaverStatus and IsHighContrast when available.
```

`GetConfiguration` can provide actual native accessibility, transparency and
energy policy. Browser targets derive the available policy from media queries;
they have no OS energy-saver API. Explicit `Light` and `Dark` requests remain
authoritative when a native configuration supplies its system theme.

`ConnectSurface` owns the composition geometry of its native surface. Observe
the supplied element's arranged size, position and computed corner radii, and
update the native placement/clip without inserting additional layout content.
Stop those observers in `Dispose`; disconnect the composition target before
releasing its visual. This preserves the WinUI `SystemBackdropElement` rule
that the effect fills and clips its arranged rectangle while remaining a
visual surface.

For Vue, an individual visual tree can override the adapter with
`app.provide(systemBackdropHostAdapterKey, adapter)`. Other frameworks pass the
same adapter to `createSystemBackdropWindow` or
`createSystemBackdropSurface`.

## XAML surface

The `SystemBackdropElement` is a visual effect surface, not a content
container. Place it first in the same Grid as the content. It defaults to
`SystemBackdrop=null` and `CornerRadius=0`; it connects only while attached to
the live visual tree, follows the arranged element size and clips rounded
corners without participating in content layout.

```xml
<Grid>
    <SystemBackdropElement CornerRadius="8">
        <SystemBackdropElement.SystemBackdrop>
            <MicaBackdrop Kind="BaseAlt" />
        </SystemBackdropElement.SystemBackdrop>
    </SystemBackdropElement>
    <Button Content="{x:Bind Labels.SampleButton, Mode=OneWay}" />
</Grid>
```

The surface also accepts official `{x:Bind ...}`, `{StaticResource ...}` and
`{ThemeResource ...}` values. Changing a shared `MicaBackdrop.Kind` updates each
connected surface/window. The XAML declarations live in
`systemBackdropXaml.ts`; the material classes live in the framework-independent
`systemBackdrop.ts` module.
