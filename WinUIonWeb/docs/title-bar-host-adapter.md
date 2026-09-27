# TitleBar window and framework adapters

`TitleBar.vue` follows the public API and template in
`WinUI-Reference/controls/dev/TitleBar`. Its XAML interface includes `Title`,
`Subtitle`, `IconSource`, `LeftHeader`, `Content`, `RightHeader`,
`IsBackButtonVisible`, `IsBackButtonEnabled`, `IsPaneToggleButtonVisible`,
`AutoRefreshDragRegions`, `TemplateSettings`, `RecomputeDragRegions()`,
`BackRequested` and `PaneToggleRequested`. Use the official property elements
and handler names:

```xml
<TitleBar
    x:Name="AppTitleBar"
    Title="{x:Bind Labels.ApplicationTitle, Mode=OneWay}"
    IsBackButtonVisible="True"
    BackRequested="AppTitleBar_BackRequested"
    PaneToggleRequested="AppTitleBar_PaneToggleRequested"
    AutoRefreshDragRegions="True">
    <TitleBar.IconSource>
        <ImageIconSource ImageSource="{x:Bind ApplicationIcon, Mode=OneWay}" />
    </TitleBar.IconSource>
    <TitleBar.Content>
        <Grid>
            <Button
                Content="{x:Bind Labels.Status, Mode=OneWay}"
                TitleBar.IsDragRegion="False"
                Click="Status_Click" />
        </Grid>
    </TitleBar.Content>
</TitleBar>
```

`TitleBar.IsDragRegion` is a nullable attached property. Unset lets enabled
controls be detected as clickable, `True` makes a control draggable, and
`False` makes the element's complete bounds clickable. A draggable panel
passes its intent to children; a child can override it with `False`. The
code-behind equivalents are `TitleBar.SetIsDragRegion(element, value)`,
`TitleBar.GetIsDragRegion(element)` and
`element.ClearValue(TitleBar.IsDragRegionProperty)`. Dynamic attached-property
changes update regions immediately. `AutoRefreshDragRegions` also refreshes
regions after content/layout changes; applications can call
`RecomputeDragRegions()` explicitly.

The setters accept the rendered element or its exposed `Element`/`$el`
wrapper. Header/content properties accept declarative UI elements and an
assigned DOM UI element; assigned elements are restored to their previous
parent when the property is replaced or the bar is removed.

## Native window ownership

`titleBarHostAdapter.ts` has no framework dependency. Native hosts supply the
real window title, activation state and non-client regions. A Gallery
demonstration embedded inside another window must return no host, so changing
its sample title cannot rename the application window.

```ts
import {
  registerTitleBarWindowHost,
  type TitleBarWindowHost,
} from '../src/components/titleBarHostAdapter'

const windowHost: TitleBarWindowHost = {
  GetTitle: () => desktopWindow.getTitle(),
  SetTitle: title => desktopWindow.setTitle(title),
  IsInputActive: () => desktopWindow.isInputActive(),
  SubscribeActivation: listener => desktopWindow.subscribeActivation(listener),
  GetTitleBarInsets: () => desktopWindow.getTitleBarInsetsInCssPixels(),
  SubscribeTitleBarInsets: listener => desktopWindow.subscribeTitleBarGeometry(listener),
  IsTitleBarOwner: element => element === appTitleBar.Element,
  SetDragRegions: regions => desktopWindow.setNonClientRegions(regions),
  ClearDragRegions: () => desktopWindow.clearNonClientRegions(),
}

// Register the actual framework content root before mounting its TitleBar.
const releaseWindowHost = registerTitleBarWindowHost(contentElement, windowHost)
```

`SetDragRegions` receives `Caption`, `Passthrough` and `Icon` rectangles in
viewport-relative CSS pixels. The native adapter converts their coordinates
and sizes to the platform's client coordinate system and DPI scale before
calling the real non-client API. It must replace the previous region set and
clear it on `ClearDragRegions`. Activation subscriptions must return a cleanup
function. Removing the TitleBar releases that subscription and clears its
native regions; removing the framework content root also calls
`releaseWindowHost()`.

`GetTitleBarInsets()` returns physical `LeftInset` and `RightInset` in viewport
CSS pixels, with an optional `TitleBarArea: { X, Y, Width, Height }` describing
the actual vertical caption band. The host converts native pixel units through
the current DPI scale before returning these values. Geometry subscriptions
notify after inset, DPI or caption geometry changes and return a cleanup
function. The control converts the physical insets to its own arranged bounds,
swaps template padding columns for `FlowDirection="RightToLeft"`, and clips
visuals and native regions against the physical safe edges.

The browser host reads a visible `navigator.windowControlsOverlay` through
`getTitlebarAreaRect()` and observes `geometrychange` and window resize. An
ordinary browser without that overlay returns no caption insets. The geometry
comes from the actual window, so an embedded Gallery example does not inherit
an unrelated native caption width.

When a content root contains nested TitleBar demonstrations, supply
`IsTitleBarOwner(element)` to identify the bar that owns the window. Returning
`false` prevents that nested bar from acquiring the window title, caption
geometry or native regions. The guard is honored for both a registered content
host and an adapter's `Connect` result. Use the application's own selector or
element identity for this predicate.

`src/utils/titleBarWindowFrame.ts` provides
`connectWindowTitleBarFrame(content, nativeHost?, reserveBand = true)` for
standalone sample windows. It registers only that frame's owning TitleBar and
reserves the real caption band's remaining height on the content root. For
example, a 48px system overlay above an official 32px compact TitleBar adds
16px to the frame, so the next content row begins after the overlay. The
TitleBar control retains its official height. Geometry, content and size
changes recalculate the frame; the returned cleanup removes subscriptions and
restores its owned padding. The main Gallery already reserves its caption band
in its own layout and passes `reserveBand = false` when connecting a native
caption host.

Alternatively, install `setTitleBarHostAdapter({ Connect(element) { ... } })`
to resolve the host for each actual application TitleBar. `Connect` returns
`null` for embedded demonstrations. Vue can provide a tree-specific adapter
through `app.provide(titleBarHostAdapterKey, adapter)`.

## Framework content lifecycle

Vue, React, Angular and Svelte can all register the same DOM content root. Use
the framework's normal mount/unmount functions, as shown in the
[system backdrop integration document](./system-backdrop-host-adapter.md).
The combined window callback keeps native ownership and framework cleanup
together:

```ts
const mountContent = (element, handle) => {
  const releaseTitleBarHost = handle.TitleBarHost
    ? registerTitleBarWindowHost(element, handle.TitleBarHost)
    : () => {}
  const unmount = mountFrameworkWindow(element, { handle })
  return async () => {
    try { await unmount() }
    finally { releaseTitleBarHost() }
  }
}
```

When a popup loads an independent framework runtime, register its new content
root in that runtime. This keeps controls, focus and overlay services in the
destination document. The system backdrop handle's `SetContentElement` then
connects its theme policy to that same root.

A native `SystemBackdropHostTarget` can carry its actual `TitleBarHost`. The
system backdrop handle exposes that same host through `handle.TitleBarHost`,
including after `AttachWindow` recovery. Register it in the destination runtime
before mounting its TitleBar. A native popup does not need to rediscover caption
ownership or safe geometry from the opener's framework instance.

## Browser behavior and materials

An ordinary browser can render the TitleBar controls, update an owned popup's
document title, process navigation events and compute region rectangles. It
cannot change the browser's real non-client drag areas. Native dragging needs
a desktop host with `SetDragRegions`; browser examples state that capability
limit instead of moving a simulated window. `app-region` is only a hint for
hosts that support it.

The Gallery, its separate sample windows and TabView windows share
`src/utils/pwaWindowChrome.ts` to keep browser/PWA `theme-color` metadata and
`color-scheme` aligned with the actual page background and theme transitions.
The observer includes the native host's exact fallback when that color is
published on the content root. Release its observer on navigation or framework
unmount. The real desktop caption and its colors still require the native
window host; browser metadata only controls the chrome capabilities exposed by
the browser.

Background materials use the system backdrop adapter. A browser without the
desktop compositor reports `NativeBackdropUnavailable` and keeps the effect
surface transparent. Supported native controllers select their own official
inactive fallback and follow the actual system theme. TitleBar foreground and
control resources follow the WinUI Light, Default and HighContrast resources.
The application icon keeps its original colors and full opacity during
deactivation, as required by this project's user-facing behavior.
