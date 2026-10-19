# System accent color host adapter

WinUIonWeb's theme stylesheet follows the browser's `AccentColor` system color
when the browser exposes it. For a WebView or a browser without that system
color, a host can provide the current system accent and subscribe to native
color changes. The adapter has no Vue dependency, so Vue, React, Angular,
Svelte, and other applications can use the same contract.

Import the package stylesheet as usual:

```ts
import 'winuionweb/style.css'
```

The default browser path follows the CSS `AccentColor` system color when the
engine exposes it. A browser host that wants an explicit subscription can use
the built-in adapter:

```ts
import {
  connectSystemAccentColorHost,
  createBrowserSystemAccentColorHostAdapter,
} from 'winuionweb/system-accent-color'

const disconnectAccent = connectSystemAccentColorHost(
  createBrowserSystemAccentColorHostAdapter(),
  document.documentElement,
)
```

Install the host before mounting the app. `Read()` provides the initial
palette; `Subscribe()` reports later changes and returns its cleanup function.
Calling the disposer returned by `connectSystemAccentColorHost` unsubscribes
and restores any CSS variables that were present before the connection.

```ts
import {
  connectSystemAccentColorHost,
  type SystemAccentColorHostAdapter,
  type SystemAccentColorPalette,
} from 'winuionweb/system-accent-color'

declare function readWindowsAccent(): SystemAccentColorPalette | null
declare function subscribeWindowsAccent(
  listener: (palette: SystemAccentColorPalette | null) => void,
): () => void

const systemAccentAdapter: SystemAccentColorHostAdapter = {
  Read: readWindowsAccent,
  Subscribe: subscribeWindowsAccent,
}

const disconnectAccent = connectSystemAccentColorHost(
  systemAccentAdapter,
  document.documentElement,
)
```

Dispose the connection with the owning document or app. For example, React can
use the returned callback from an effect:

```tsx
useEffect(() => {
  return connectSystemAccentColorHost(systemAccentAdapter, document.documentElement)
}, [])
```

At minimum, a host returns `AccentColor`. It may also provide
`LightThemeAccentColor` and `DarkThemeAccentColor` when the operating system
offers theme-specific accent fills, `LightThemeTextColor` and
`DarkThemeTextColor` for the corresponding foreground, and the six
`AccentColorLight1` through `AccentColorLight3` / `AccentColorDark1` through
`AccentColorDark3` shades. Missing shade values are derived from the accent
color in CSS where `color-mix()` is supported. Missing text colors use a
contrast-based fallback.

Windows hosts should read all seven accent values from
`UISettings.GetColorValue(UIColorType)`: `Accent` and `AccentDark1` through
`AccentDark3`, plus `AccentLight1` through `AccentLight3`. WinUI's common
theme resources use `AccentDark1` as the light-theme default fill and
`AccentLight2` as the dark-theme default fill. Their pointer-over and pressed
brushes keep that same default shade and apply opacity `0.9` and `0.8`.
Compositing those translucent brushes makes the light-theme states lighter on
light surfaces and the dark-theme states darker on dark surfaces. Do not map
these states to unrelated `Light1/3` or `Dark2/3` palette entries. If the host
only provides a base color, the stylesheet keeps its existing blue fallbacks.

The adapter publishes CSS variables on the selected root element. WinUIonWeb's
`--accent-base`, `--AccentFillColorDefaultBrush`, `--SystemAccentColor`, and
their hover, pressed, text, and theme-shade aliases resolve from those values
in both `.theme-light` and `.theme-dark` scopes. A host can use its native
`UISettings.ColorValuesChanged` event to keep the subscription current.

When the host reports one accent without a separate dark-theme color, the
stylesheet keeps its existing blue dark-theme fallback. The adapter selects
black or white button text by contrast against each resolved accent color. An
explicitly supplied theme-specific color or foreground takes precedence.
