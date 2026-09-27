import { cloneVNode, Fragment, getCurrentInstance, h, isRef, type ComponentInternalInstance, type VNode } from 'vue'
import { informationControlResources } from './informationControlResources'
import { buttonResources } from './buttonResources'
import { dropDownButtonResources } from './dropDownButtonResources'
import { appBarResources } from './appBarResources'
import { commandBarResources } from './commandBarResources'
import { xamlPrimitiveResourceKey } from './xamlPrimitives'
import { navigationViewResources } from './navigationViewResources'
import { breadcrumbBarResources } from './breadcrumbBarResources'
import { menuFlyoutResources } from './menuFlyoutResources'
import { menuBarResources } from './menuBarResources'
import { pivotResources } from './pivotResources'
import { selectorBarResources } from './selectorBarResources'
import { tabViewResources } from './tabViewResources'
import { swipeControlResources } from './swipeControlResources'
import { textControlResources } from './textControlResources'
import { resolveAcrylicResource } from './AcrylicBrush'

type Scope = Record<string, unknown>

export const xamlScopeKey = Symbol('WinUIonWeb.xamlScope')
export const xamlNameScopeKey = Symbol('WinUIonWeb.xamlNameScope')
// Controls realized from a UIElement ItemsSource already expose a stable
// dependency-property object. Their x:Name must preserve that same identity.
export const xamlControlIdentityKey = Symbol('WinUIonWeb.xamlControlIdentity')
// Collection item templates provide their current data item through this
// scope so structural flyouts can invoke handlers with the same DataContext
// that WinUI supplies to a MenuFlyoutItem.
export const xamlItemContextKey = Symbol('WinUIonWeb.xamlItemContext')

// Internal Vue contexts can contain keys that are not valid JavaScript
// parameter names (or are reserved words).  Exclude those keys before
// constructing the small expression evaluator below.
const RESERVED_FUNCTION_PARAMETERS = new Set([
  'arguments', 'eval', 'await', 'yield', 'class', 'function', 'var', 'let',
  'const', 'if', 'else', 'return', 'switch', 'case', 'default', 'delete',
  'new', 'this', 'super', 'typeof', 'void', 'in', 'instanceof', 'true',
  'false', 'null', 'undefined'
])

export const eventNames = new Set([
  'TextCompositionStarted', 'TextCompositionChanged', 'TextCompositionEnded', 'PaneToggleRequested',
  'SuggestionChosen', 'PasswordChanged', 'PasswordChanging', 'BeforeTextChanging', 'TextChanging',
  'SelectionChanging', 'IsTextTrimmedChanged', 'Paste', 'CopyingToClipboard', 'CuttingToClipboard', 'ContextMenuOpening',
  'TextCompositionStarted', 'TextCompositionChanged', 'TextCompositionEnded', 'CandidateWindowBoundsChanged', 'Unloaded',
  'ExecuteRequested', 'CanExecuteRequested', 'CanExecuteChanged', 'ContainerContentChanging', 'LayoutUpdated',
  'Click', 'Checked', 'Unchecked', 'Indeterminate', 'SelectionChanged', 'Invoked',
  'AddTabButtonClick', 'TabCloseRequested', 'CloseRequested', 'TabItemsChanged',
  'TabDragStarting', 'TabDragCompleted', 'TabDroppedOutside', 'TabStripDragOver', 'TabStripDrop',
  'TabTearOutWindowRequested', 'TabTearOutRequested', 'ExternalTornOutTabsDropping', 'ExternalTornOutTabsDropped', 'BringIntoViewRequested',
  'PivotItemLoading', 'PivotItemLoaded', 'PivotItemUnloading', 'PivotItemUnloaded',
  'Selected', 'Select', 'ValueChanged', 'TextChanged', 'TextSubmitted',
  'IsCheckedChanged', 'IsOnChanged', 'Toggled',
  'DropDownOpened', 'DropDownClosed', 'Opening', 'Opened', 'Closing', 'Closed',
  'PaneOpening', 'PaneOpened', 'PaneClosing', 'PaneClosed', 'BackRequested', 'DisplayModeChanged',
  'Navigating', 'Navigated', 'NavigationFailed', 'NavigationStopped',
  'Expanding', 'Expanded', 'Collapsing', 'Collapsed',
  'DateChanged', 'SelectedDateChanged', 'SelectedDatesChanged', 'TimeChanged', 'SelectedTimeChanged', 'CalendarViewDayItemChanging', 'ColorChanged', 'QuerySubmitted', 'ItemClick', 'ItemClicked', 'GettingFocus',
  'KeyDown', 'GotFocus', 'LostFocus', 'ElementPrepared', 'ElementClearing', 'ElementIndexChanged',
  'ViewChanged', 'ViewChanging', 'PointerMoved', 'PointerPressed', 'PointerReleased', 'PointerEntered', 'PointerExited', 'PointerCanceled', 'PointerCaptureLost', 'KeyUp', 'Tapped', 'Loaded', 'ItemInvoked',
  'DragItemsStarting', 'DragItemsCompleted', 'DragOver', 'Drop', 'RefreshRequested', 'RefreshStateChanged',
  'PreviewFailed', 'MediaOpened', 'MediaFailed', 'MediaEnded', 'IsFullWindowChanged',
  'PrimaryButtonClick', 'SecondaryButtonClick', 'CloseButtonClick', 'ActionButtonClick', 'ContextRequested', 'DynamicOverflowItemsChanging'
  , 'ImageOpened', 'ImageFailed', 'OpenFailed', 'ActualPlacementChanged', 'SelectedIndexChanged',
  'DirectManipulationStarted', 'DirectManipulationCompleted', 'ViewChangeStarted', 'ViewChangeCompleted',
  'ExtentChanged', 'StateChanged', 'ScrollStarting', 'ZoomStarting', 'ScrollAnimationStarting',
  'ZoomAnimationStarting', 'ScrollCompleted', 'ZoomCompleted', 'AnchorRequested', 'BringingIntoView'
])

const eventProp = (name: string) => `on${name}`
const xamlPropSources = new WeakMap<object, Record<string, unknown>>()

export const cloneXamlVNodeWithDefaults = (node: VNode, defaults: Record<string, unknown>): VNode => {
  const clone = cloneVNode(node, { ...defaults, ...node.props })
  xamlPropSources.set(clone, { ...defaults, ...(xamlPropSources.get(node) ?? node.props) })
  return clone
}
// A named control's dependency-property proxy must keep its identity when
// normalizeXamlVNode is called again. Replacing it during every Updated hook
// makes reactive namescopes schedule the same control/page indefinitely.
const xamlExposedBindingProxies = new WeakMap<object, Record<string, unknown>>()

// Components that call resolveXamlValue themselves must receive the original
// expression so bindings stay reactive. Layout-only components do not have a
// resolver and continue receiving the materialized value below.
const reactiveComponentNames = new Set([
  'GalleryItemsGrid', 'HomeHeaderTile', 'HorizontalScrollContainer', 'SwitchPresenter',
  'Run', 'Hyperlink', 'Span', 'Paragraph', 'Bold', 'Italic', 'Underline', 'InlineUIContainer', 'TextHighlighter', 'TextRange', 'RichTextBlockOverflow', 'SampleCodePresenter', 'PasswordBox',
  'AnimatedIcon', 'TitleBar',
  'AcrylicBrush', 'SolidColorBrush',
  'ParallaxView',
  'MenuBar', 'MenuBarItem',
  'UserControl', 'XamlUICommand', 'StandardUICommand',
  'MenuFlyout', 'MenuFlyoutPresenter', 'MenuFlyoutItem', 'ToggleMenuFlyoutItem', 'RadioMenuFlyoutItem', 'MenuFlyoutSubItem', 'SplitMenuFlyoutItem', 'MenuFlyoutSeparator', 'KeyboardAccelerator',
  'AutoSuggestBox', 'Border', 'BreadcrumbBar', 'BreadcrumbBarItem', 'Button', 'CalendarView', 'CalendarDatePicker', 'CheckBox', 'ColorPicker', 'ComboBox', 'ItemsControl',
  'ContentDialog', 'ControlExample', 'ControlExampleSubstitution', 'DropDownButton', 'Expander', 'ExpanderBase', 'Flyout',
  'CaptureElement', 'MediaPlayerElement', 'MediaTransportControls', 'PersonPicture', 'AppBarButton', 'AppBarToggleButton', 'AppBarSeparator', 'CommandBar', 'CommandBarFlyout', 'BitmapIcon', 'PathIcon',
  'FontIcon', 'ImageIcon', 'IconSourceElement', 'FontIconSource', 'SymbolIconSource', 'BitmapIconSource', 'PathIconSource', 'ImageIconSource', 'HyperlinkButton', 'Ellipse', 'Image', 'BitmapImage', 'SvgImageSource', 'Popup', 'RadioButton', 'RadioButtons',
  'Rating', 'Rectangle', 'RepeatButton', 'RichEditBox', 'RichTextBlock', 'SelectorBar', 'SelectorBarItem', 'Slider', 'NumberBox', 'ProgressBar', 'ProgressRing',
  'SplitButton', 'SplitView', 'SymbolIcon', 'TeachingTip', 'TextBlock', 'TextBox', 'ToggleButton',
  'ToggleSplitButton', 'ToggleSwitch', 'ToolTip'
  , 'FlipView', 'GridView', 'ItemsRepeater', 'ItemsView', 'ListView', 'RefreshContainer', 'RefreshVisualizer', 'TreeView', 'DatePicker', 'TimePicker', 'DateTimePickerFlyout', 'PickerColumn'
  // ItemsStackPanel is a structural ItemsPanel child. Collection controls
  // read its dependency properties from the VNode and resolve bindings on
  // each computed pass, so keep those expressions live as well.
  , 'ItemsStackPanel', 'Grid', 'Canvas', 'RelativePanel', 'Border', 'ColumnDefinition', 'RowDefinition', 'Slider.Header', 'StackPanel', 'VariableSizedWrapGrid', 'Viewbox'
  , 'PipsPager', 'ScrollView', 'ScrollPresenter', 'ScrollViewer', 'SemanticZoom', 'CollectionViewSource'
  , 'Line', 'Polyline', 'Path', 'Path.Data', 'GeometryGroup', 'GeometryGroup.Children', 'LineGeometry', 'EllipseGeometry', 'RectangleGeometry'
  , 'RadialGradientBrush', 'GradientStop', 'ThemeShadow'
  , 'SystemBackdropElement', 'MicaBackdrop', 'DesktopAcrylicBackdrop'
  , 'InfoBadge', 'InfoBar', 'InfoBarPanel', 'NavigationView', 'NavigationViewItem', 'Frame', 'Pivot', 'PivotItem'
  , 'SwipeControl', 'SwipeItems', 'SwipeItem'
  , 'TabView', 'TabViewItem'
])

const componentName = (type: unknown) => {
  if (!type || typeof type !== 'object') return ''
  const value = type as { name?: string; __name?: string; __file?: string }
  return value.name || value.__name || value.__file?.split(/[\\/]/).pop()?.replace(/\.vue$/, '') || ''
}

const unwrap = (value: unknown): unknown => {
  if (isRef(value)) return value.value
  return value
}

/** Convert XAML's alpha-first 8-digit colors to the CSS rgba form. */
export const xamlColor = (value: unknown): unknown => {
  if (typeof value !== 'string') return value
  const match = value.trim().match(/^#([\da-f]{8})$/i)
  if (!match) return value
  const hex = match[1]
  const alpha = Number.parseInt(hex.slice(0, 2), 16) / 255
  const red = Number.parseInt(hex.slice(2, 4), 16)
  const green = Number.parseInt(hex.slice(4, 6), 16)
  const blue = Number.parseInt(hex.slice(6, 8), 16)
  return `rgba(${red}, ${green}, ${blue}, ${Number(alpha.toFixed(4))})`
}

const scopeFor = (instance: ComponentInternalInstance | null): Scope => {
  const scope: Scope = {}
  const merge = (source: Record<string, unknown> | undefined) => {
    if (!source) return
    let keys: string[] = []
    try {
      keys = Object.keys(source)
    } catch {
      return
    }
    for (const key of keys) {
      // The nearest component owns a name.  Do not let a parent setup scope
      // overwrite a child binding with the same identifier.
      if (key in scope) continue
      try {
        // Subscribe only to names actually used by this binding, rather than
        // every control registered by every repeated template.
        Object.defineProperty(scope, key, {
          configurable: true,
          enumerable: true,
          get: () => unwrap(source[key]),
          set: (value) => Object.defineProperty(scope, key, {
            configurable: true, enumerable: true, writable: true, value
          })
        })
      } catch {
        // Vue exposes a few internal context getters that are not safe to read
        // while a render is being evaluated. They are not XAML bindings.
      }
    }
  }
  // Bindings belong to the owning XAML page/view model. Starting at the
  // control itself would enumerate implementation computeds such as
  // ControlExample.propertyNodes and recursively evaluate the same VNodes.
  let cursor = instance?.parent ?? null
  while (cursor) {
    const sourceFile = String((cursor.type as { __file?: string } | undefined)?.__file ?? '').replace(/\\/g, '/')
    const isPageScope = /\/gallery\/(?:pages|components|samples\/TabView)\//.test(sourceFile)
    if (isPageScope) {
      merge(cursor.setupState)
    }
    cursor = cursor.parent
  }

  // Control templates can contain child controls whose event attributes use
  // normal XAML handler names. Owners provide that small template scope
  // without exposing their entire implementation state to the evaluator.
  // A control provides template bindings for its children. Resolving the
  // control's own XAML properties against instance.provides would also read
  // the scope it just provided, which can recursively evaluate implementation
  // computeds and hide the owning parent control's handlers. The parent
  // provides object is the XAML namescope that owns this component.
  const providedScope = instance?.parent?.provides?.[xamlScopeKey] as Record<string, unknown> | undefined
  merge(providedScope)

  // XAML namescopes expose x:Name controls to sibling bindings such as
  // PlaceholderValue="{x:Bind slider.Value, Mode=TwoWay}".  The registry is
  // populated by normalizeXamlVNode when the named component is mounted.
  const providedNameScope = instance?.parent?.provides?.[xamlNameScopeKey] as Record<string, unknown> | undefined
  merge(providedNameScope)

  // Vue global properties are exposed through the component proxy, not the
  // internal setup/context objects.  XAML samples use the application
  // translator as `$t(...)`, so make that property explicit in the evaluator
  // scope instead of relying on proxy lookup.
  const globalProperties = instance?.appContext.config.globalProperties
  if (globalProperties) {
    let keys: string[] = []
    try {
      keys = Object.keys(globalProperties)
    } catch {
      keys = []
    }
    for (const key of keys) {
      if (key !== '$t' && key in scope) continue
      try {
        scope[key] = unwrap(globalProperties[key])
      } catch {
        // Ignore non-binding global getters.
      }
    }
    try {
      if (typeof globalProperties.$t === 'function') scope.$t = globalProperties.$t
    } catch {
      // Translation is optional for the runtime evaluator.
    }
  }

  // Generated sample strings use both the Vue-style `$t(...)` spelling and
  // the compact `t(...)` form inside XAML attribute values.
  if (typeof scope.$t === 'function' && !scope.t) scope.t = scope.$t

  return scope
}

const stripBinding = (value: string) => {
  return bindingDetails(value).expression
}

const resourceName = (value: string) => {
  const match = value.trim().match(/^\{\s*(?:ThemeResource|StaticResource)\s+([^\s}]+)\s*\}$/i)
  return match?.[1] ?? ''
}

// GridLength resources must stay numeric when consumed by RowDefinition or
// ColumnDefinition; a CSS var string is not a XAML GridLength.
const gridLengthResources: Readonly<Record<string, number>> = Object.freeze({
  ListViewItemMinWidth: 88,
  ListViewItemMinHeight: 40,
  TeachingTipTailShortSideLength: 8,
  TeachingTipTailMargin: 10
})

const resourceCssVariable = (name: string) => {
  if (!name) return ''
  const aliases: Record<string, string> = {
    OverlayCornerRadius: 'OverlayCornerRadius',
    SurfaceStrokeColorDefaultBrush: 'SurfaceStrokeColorDefaultBrush',
    SurfaceStrokeColorFlyoutBrush: 'SurfaceStrokeColorFlyoutBrush',
    LayerFillColorAltBrush: 'LayerFillColorAltBrush',
    SolidBackgroundFillColorBaseBrush: 'SolidBackgroundFillColorBaseBrush',
    SolidBackgroundFillColorTertiaryBrush: 'SolidBackgroundFillColorTertiaryBrush',
    SmokeFillColorDefaultBrush: 'SmokeFillColorDefaultBrush'
  }
  const key = aliases[name] ?? name
  return `var(--${key})`
}

const bindingDetails = (value: string) => {
  const match = value.match(/^\{(?:x:Bind|Binding)(?:\s+([\s\S]*?))?\}$/)
  if (!match) return { expression: value, twoWay: false, converter: '', converterParameter: '' }
  const body = match[1] ?? ''
  // Binding options can follow Mode and contain nested markup extensions.
  // Split only commas outside braces, calls, indexers, and quoted strings.
  // Gallery's SplitView uses Mode=TwoWay, Converter={StaticResource ...}.
  const segments: string[] = []
  let start = 0
  let depth = 0
  let quote = ''
  for (let index = 0; index < body.length; index += 1) {
    const character = body[index]
    if (quote) {
      if (character === quote && body[index - 1] !== '\\') quote = ''
      continue
    }
    if (character === '"' || character === "'") quote = character
    else if ('{(['.includes(character)) depth += 1
    else if ('})]'.includes(character)) depth -= 1
    else if (character === ',' && depth === 0) {
      segments.push(body.slice(start, index).trim())
      start = index + 1
    }
  }
  segments.push(body.slice(start).trim())
  const options: Record<string, string> = {}
  for (const segment of segments) {
    const option = segment.match(/^(Mode|Converter|ConverterParameter|ElementName|Path)\s*=\s*([\s\S]*)$/)
    if (option) options[option[1]] = option[2].trim()
  }
  const path = options.Path ?? (/^(?:Mode|Converter|ConverterParameter|ElementName)\s*=/.test(segments[0] ?? '') ? '' : (segments[0] ?? ''))
  return {
    expression: options.ElementName ? `${options.ElementName}${path ? '.' + path : ''}` : path,
    twoWay: options.Mode === 'TwoWay',
    converter: options.Converter ?? '',
    converterParameter: options.ConverterParameter ?? ''
  }
}

const convertBindingValue = (details: ReturnType<typeof bindingDetails>, value: unknown, instance: ComponentInternalInstance | null, convertBack = false): unknown => {
  if (!details.converter) return value
  const key = resourceName(details.converter) ?? details.converter
  const scope = scopeFor(instance)
  const converter = resolvePath(key, scope) as { Convert?: (...args: unknown[]) => unknown; ConvertBack?: (...args: unknown[]) => unknown } | undefined
  const operation = convertBack ? converter?.ConvertBack : converter?.Convert
  if (typeof operation === 'function') {
    const parameter = details.converterParameter ? resolveXamlValue(details.converterParameter, instance) : null
    return operation.call(converter, value, null, parameter, null)
  }
  // This converter is an application resource used by the official Gallery;
  // null maps to false in Convert and a bool maps to nullable bool in ConvertBack.
  if (key === 'nullableBooleanToBooleanConverter') return value === true
  return value
}

const splitPath = (value: string) => value
  .replace(/^\((?:x:Double|x:Int32|x:String)\)/, '')
  .replace(/\?\./g, '.')
  .split('.')
  .map((part) => part.trim())
  .filter(Boolean)

const resolvePath = (expression: string, scope: Scope): unknown => {
  let source = expression.trim()
  // x:Bind emits a typed access for an object-valued selection. The browser
  // keeps the same object without needing a C# cast, then reads its member.
  const objectCast = source.match(/^\(\s*\(\s*[A-Za-z_]\w*:[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*\s*\)\s*([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\)([\s\S]*)$/)
  if (objectCast) source = `${objectCast[1]}${objectCast[2]}`
  const cast = source.match(/^\(\s*x:(Int32|Double|String)\s*\)\s*([\s\S]+)$/)
  if (cast) {
    const value = resolvePath(cast[2], scope)
    if (value === undefined || value === null) return value
    if (cast[1] === 'String') return String(value)
    const number = Number(value)
    return Number.isFinite(number) ? cast[1] === 'Int32' ? Math.trunc(number) : number : undefined
  }
  if (source === 'sys:DateTime.Now.TimeOfDay') {
    const now = new Date()
    return now.getHours() * 3600000 + now.getMinutes() * 60000 + now.getSeconds() * 1000 + now.getMilliseconds()
  }
  if (source === 'x:True' || source === 'True') return true
  if (source === 'x:False' || source === 'False') return false
  if (source === 'x:Null' || source === 'Null') return null
  // A namespace-qualified static type is supplied by the page's helper
  // scope, for example helper:FontHelper.Fonts in the official Gallery.
  const staticPath = source.match(/^([A-Za-z_]\w*):([A-Za-z_]\w*)(\.[\s\S]+)$/)
  if (staticPath) source = `${staticPath[1]}.${staticPath[2]}${staticPath[3]}`
  if (/^-?\d+(?:\.\d+)?$/.test(source)) return Number(source)
  if (/^'.*'$|^".*"$/.test(source)) return source.slice(1, -1)

  // Localized XAML samples frequently bind directly to the application
  // translator. Resolve this common call explicitly before the generic
  // evaluator so it also works when Vue stores global properties outside the
  // enumerable proxy keys.
  const translatorCall = source.match(/^\$?t\(\s*(['"])(.*?)\1\s*\)$/s)
  if (translatorCall && typeof (scope.$t ?? scope.t) === 'function') {
    return ((scope.$t ?? scope.t) as (key: string) => unknown)(translatorCall[2])
  }

  const equals = source.match(/^(.*)\.Equals\((x:)?(True|False|Null)\)$/)
  if (equals) {
    const left = resolvePath(equals[1], scope)
    const right = resolvePath(`${equals[2] ?? ''}${equals[3]}`, scope)
    return unwrap(left) === right
  }
  const toString = source.match(/^(.*)\.ToString\(\)$/)
  if (toString) return String(unwrap(resolvePath(toString[1], scope)) ?? '')
  if (source.startsWith('String(') && source.endsWith(')')) {
    return String(unwrap(resolvePath(source.slice(7, -1), scope)) ?? '')
  }

  // Ordinary x:Bind member paths must read only their own dependencies.
  // Enumerating the entire page scope also evaluates source presenters that
  // can read the control currently resolving this binding.
  if (/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(source)) {
    const [root, ...parts] = splitPath(source)
    let value: unknown = scope[root]
    for (const part of parts) {
      value = unwrap(value)
      if (value === null || value === undefined) return undefined
      if (part === 'Count' && Array.isArray(value)) { value = value.length; continue }
      if ((part === 'IsChecked' || part === 'Value') && ['boolean', 'number', 'string'].includes(typeof value)) continue
      value = (value as Record<string, unknown>)[part]
    }
    return unwrap(value)
  }

  // x:Bind permits method calls and conditional expressions. The gallery uses
  // these for localized labels and simple value projections, so evaluate the
  // expression against the component setup scope after handling XAML literals.
  if (/[$A-Za-z_(]/.test(source)) {
    try {
      const jsSource = source.replace(/\bx:(True|False|Null)\b/g, (_, literal: string) => literal === 'True' ? 'true' : literal === 'False' ? 'false' : 'null')
      const entries = Object.entries(scope).filter(([key]) =>
        /^[A-Za-z_$][\w$]*$/.test(key) && !RESERVED_FUNCTION_PARAMETERS.has(key)
      )
      const evaluated = unwrap(Function(...entries.map(([key]) => key), `return (${jsSource})`)(...entries.map(([, value]) => value)))
      // Nullable XAML values expose .Value even when their browser model is
      // already a primitive. Let the path resolver unwrap that segment.
      if (evaluated !== undefined) return evaluated
    } catch {
      // Fall through to path lookup for unresolved binding text.
    }
  }

  const rootMatch = source.match(/^([A-Za-z_$][\w$]*)/)
  if (!rootMatch) return undefined
  let value: unknown = scope[rootMatch[1]]
  source = source.slice(rootMatch[0].length)
  for (const part of splitPath(source)) {
    value = unwrap(value)
    if (value === null || value === undefined) return undefined
    if (part === 'Count' && Array.isArray(value)) { value = value.length; continue }
    // XAML bindings commonly spell a boolean ref as Foo.IsChecked.Value.
    // Vue setup refs expose the boolean directly, so these wrapper segments
    // are intentionally transparent at runtime.
    if ((part === 'IsChecked' || part === 'Value') && (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string')) continue
    value = (value as Record<string, unknown>)[part]
  }
  return unwrap(value)
}

const isExpressionString = (value: string) => {
  const trimmed = value.trim()
  return /^\$t\s*\(/.test(trimmed)
    || /^t\s*\(/.test(trimmed)
    || /^\$\{\s*t\s*\(/.test(trimmed)
}

export const resolveXamlValue = (value: unknown, instance: ComponentInternalInstance | null, extraScope?: Scope, preserveColor = false): unknown => {
  if (typeof value !== 'string') return value
  if (value === 'True') return true
  if (value === 'False') return false
  const trimmed = value.trim()
  const resource = resourceName(trimmed)
  if (resource) {
    const brush = resolveAcrylicResource(resource, instance)
    if (brush !== undefined) return brush
    if (/^\{\s*StaticResource\b/.test(trimmed)) {
      const names = instance?.parent?.provides?.[xamlNameScopeKey] as Scope | undefined
      if (names && Object.prototype.hasOwnProperty.call(names, resource)) return unwrap(names[resource])
    }
    const primitives = unwrap(instance?.provides?.[xamlPrimitiveResourceKey]) as Record<string, unknown> | undefined
    return primitives?.[resource] ?? buttonResources[resource] ?? dropDownButtonResources[resource] ?? appBarResources[resource] ?? commandBarResources[resource] ?? navigationViewResources[resource] ?? breadcrumbBarResources[resource] ?? menuFlyoutResources[resource] ?? menuBarResources[resource] ?? pivotResources[resource] ?? selectorBarResources[resource] ?? tabViewResources[resource] ?? swipeControlResources[resource] ?? textControlResources[resource] ?? informationControlResources[resource] ?? gridLengthResources[resource] ?? resourceCssVariable(resource)
  }
  const expression = stripBinding(value)
  const directExpression = isExpressionString(trimmed)
    ? trimmed.replace(/^\$\{\s*/, '').replace(/\s*\}$/, '')
    : expression
  if (!directExpression.trim() && /^\{\s*(?:x:Bind|Binding)\b/.test(trimmed)
    && extraScope && Object.prototype.hasOwnProperty.call(extraScope, 'item')) return extraScope.item
  if (directExpression === value && !value.includes('{') && !isExpressionString(value)) return preserveColor ? value : xamlColor(value)
  let resolved: unknown
  try {
    const scope = scopeFor(instance)
    if (extraScope) {
      for (const [key, scopedValue] of Object.entries(extraScope)) scope[key] = unwrap(scopedValue)
    }
    resolved = resolvePath(directExpression, scope)
  } catch {
    // A malformed or unavailable binding must not break rendering of the
    // containing page.  XAML treats an unresolved value as its default.
    resolved = undefined
  }
  if (resolved !== undefined || bindingDetails(value).converter) {
    const result = convertBindingValue(bindingDetails(value), resolved, instance)
    return preserveColor ? result : xamlColor(result)
  }

  // Never leak an unresolved binding expression into a visual control.  A
  // static-resource marker is intentionally preserved because controls use
  // that literal to select a style/resource by name.
  if (/^\{\s*(?:x:Bind|Binding)\b/.test(value) || isExpressionString(value)) return undefined
  return preserveColor ? value : xamlColor(value)
}

/**
 * Materialize an XAML DataTemplate against the current item.  Vue's compiler
 * keeps property-element children as VNodes, so the collection controls can
 * render the same tree for every item while resolving `{x:Bind Property}` in
 * the item's data context.
 */
export const materializeXamlVNode = (node: unknown, item: unknown, instance: ComponentInternalInstance | null): unknown => {
  if (!node || typeof node !== 'object') return node
  if (Array.isArray(node)) return node.map((child) => materializeXamlVNode(child, item, instance))
  const vnode = node as VNode
  const propertyName = typeof vnode.type === 'string' ? vnode.type.split('.').pop()?.replace(/^[A-Z]/, (letter) => letter.toLowerCase()) : undefined
  const collectionProperty = (vnode.type as { __collectionProperty?: string; __controlExampleProperty?: string } | undefined)?.__collectionProperty
    ?? (vnode.type as { __controlExampleProperty?: string } | undefined)?.__controlExampleProperty
    ?? (vnode.type as { __swipeProperty?: string } | undefined)?.__swipeProperty
    ?? propertyName
  // normalizeXamlVNode may have visited a DataTemplate before the collection
  // control had an item context. Keep the original XAML values alongside the
  // normalized props so item bindings such as `{x:Bind MsgAlignment}` can be
  // resolved when the template is materialized for its actual item.
  const originalProps = xamlPropSources.get(vnode as object)
  const props = vnode.props
    ? { ...vnode.props }
    : originalProps ? { ...originalProps } : undefined
  if (props) {
    // Layout components are normalized before a collection item exists, so
    // their item bindings may have become undefined. Restore only those
    // binding-valued keys; normalized event listeners and static attributes
    // must remain intact.
    if (originalProps) {
      for (const [key, value] of Object.entries(originalProps)) {
        if (typeof value !== 'string' || (!value.includes('{') && !isExpressionString(value))) continue
        if (props[key] === undefined || props[key] === null) props[key] = value
      }
    }
    const itemScope: Scope = { item, Item: item }
    if (item && typeof item === 'object') Object.assign(itemScope, item as Record<string, unknown>)
    // The ListView messaging sample binds the template Grid's alignment to
    // `MsgAlignment`. A parent ControlExample can normalize that binding
    // before a collection item exists, leaving an undefined prop on the
    // cached VNode. Recover the official item-context value here so the Grid
    // keeps its left/right placement when the DataTemplate is materialized.
    if (componentName(vnode.type) === 'Grid'
      && props.HorizontalAlignment === undefined
      && item && typeof item === 'object'
      && 'MsgAlignment' in item) {
      props.HorizontalAlignment = (item as Record<string, unknown>).MsgAlignment
    }
    for (const [key, value] of Object.entries(props)) {
      if (key === 'key' || key === 'ref' || key.startsWith('on')) continue
      if (eventNames.has(key)) {
        props[`on${key}`] = resolveXamlHandler(value, instance, { item, Item: item, ...(item && typeof item === 'object' ? item as Record<string, unknown> : {}) })
        delete props[key]
        continue
      }
      if (typeof value === 'string' && (value.includes('{') || isExpressionString(value))) {
        const swipeObjectProperty = (componentName(vnode.type) === 'SwipeControl'
          && ['LeftItems', 'RightItems', 'TopItems', 'BottomItems', 'ContentTemplate'].includes(key))
          || (componentName(vnode.type) === 'SwipeItem' && ['IconSource', 'Background', 'Foreground'].includes(key))
        if (swipeObjectProperty && resourceName(value)) continue
        props[key] = resolveXamlValue(value, instance, itemScope, key === 'Text')
      }
    }
  }
  // A nested DataTemplate owns a new item data context. Resolve the nested
  // collection control itself against the current item, but leave the
  // ItemTemplate body untouched until that collection materializes its item.
  if (collectionProperty === 'itemTemplate' || collectionProperty === 'groupHeaderTemplate' || collectionProperty === 'ContentTemplate') {
    return cloneVNode(vnode, props, true)
  }
  let children = vnode.children
  if (Array.isArray(children)) children = children.map((child) => materializeXamlVNode(child, item, instance)) as VNode['children']
  else if (children && typeof children === 'object') {
    const slots = { ...(children as Record<string, unknown>) }
    for (const [name, slot] of Object.entries(slots)) {
      if (typeof slot !== 'function') continue
      slots[name] = (...args: unknown[]) => {
        const result = (slot as (...args: unknown[]) => unknown)(...args)
        return materializeXamlVNode(result, item, instance)
      }
    }
    children = slots
  }
  const clone = cloneVNode(vnode, props, true)
  clone.children = children
  return clone
}

export const xamlTemplateComponent = (nodes: unknown[], item: unknown, instance: ComponentInternalInstance | null) =>
  h(Fragment, (materializeXamlVNode(nodes, item, instance) as VNode[]) ?? [])

const assignPath = (expression: string, value: unknown, instance: ComponentInternalInstance | null) => {
  const parts = splitPath(expression)
  if (!parts.length) return
  let cursor = instance
  while (cursor) {
    if (Object.prototype.hasOwnProperty.call(cursor.setupState, parts[0])) {
      let target: unknown = cursor.setupState
      for (let index = 0; index < parts.length - 1; index += 1) {
        const part = parts[index]
        target = unwrap((target as Record<string, unknown>)[part])
        if (target === null || target === undefined) return
      }
      const finalPart = parts[parts.length - 1]
      const objectTarget = target as Record<string, unknown>
      // setupState is a shallow-unwrapped proxy: assigning its final key
      // normally updates a ref, but nested paths can still expose the ref
      // object itself. Preserve the ref in both cases so TwoWay bindings keep
      // their reactive identity.
      const current = objectTarget[finalPart]
      if (isRef(current)) current.value = value
      else if (isRef(objectTarget)) objectTarget.value = value
      else objectTarget[finalPart] = value
      return
    }
    cursor = cursor.parent
  }

  // TwoWay bindings may target a control registered through x:Name rather
  // than a page setup ref. Resolve the named component and assign its exposed
  // dependency-property-shaped value.
  cursor = instance
  while (cursor) {
    const names = cursor.provides?.[xamlNameScopeKey] as Record<string, unknown> | undefined
    if (names && Object.prototype.hasOwnProperty.call(names, parts[0])) {
      let target: unknown = unwrap(names[parts[0]])
      for (let index = 1; index < parts.length - 1; index += 1) {
        target = unwrap((target as Record<string, unknown> | undefined)?.[parts[index]])
        if (target === null || target === undefined) return
      }
      const finalPart = parts[parts.length - 1]
      const objectTarget = target as Record<string, unknown> | null
      if (!objectTarget) return
      const current = objectTarget[finalPart]
      if (isRef(current)) current.value = value
      else objectTarget[finalPart] = value
      return
    }
    cursor = cursor.parent
  }

  // Control templates and external view models provide their binding scope
  // without declaring page setup variables. Write through that same scope
  // used by resolveXamlValue so TwoWay bindings can complete the round trip.
  cursor = instance?.parent ?? null
  while (cursor) {
    const scope = cursor.provides?.[xamlScopeKey] as Record<string, unknown> | undefined
    if (scope && Object.prototype.hasOwnProperty.call(scope, parts[0])) {
      let target: unknown = scope
      for (let index = 0; index < parts.length - 1; index += 1) {
        target = unwrap((target as Record<string, unknown> | undefined)?.[parts[index]])
        if (target === null || target === undefined) return
      }
      const objectTarget = target as Record<string, unknown>
      const current = objectTarget[parts[parts.length - 1]]
      if (isRef(current)) current.value = value
      else objectTarget[parts[parts.length - 1]] = value
      return
    }
    cursor = cursor.parent
  }
}

/** Write a control value back to the source of a XAML TwoWay binding. */
export const updateXamlBinding = (binding: unknown, value: unknown, instance: ComponentInternalInstance | null) => {
  if (typeof binding !== 'string') return
  const details = bindingDetails(binding)
  if (!details.twoWay) return
  assignPath(details.expression, convertBindingValue(details, value, instance, true), instance)
}

const evaluateHandler = (expression: string, scope: Scope, event: unknown) => {
  const source = expression.trim()
  const direct = resolvePath(source, scope)
  if (typeof direct === 'function') return (...args: unknown[]) => direct(...args)
  const call = source.match(/^([A-Za-z_$][\w$]*)\((.*)\)$/s)
  if (!call || typeof scope[call[1]] !== 'function') return undefined
  const args = call[2].trim()
  try {
    const entries = Object.entries(scope).filter(([key]) =>
      /^[A-Za-z_$][\w$]*$/.test(key) && !RESERVED_FUNCTION_PARAMETERS.has(key)
    )
    const values = args
      ? Function(...entries.map(([key]) => key), '$event', `return [${args}]`)(...entries.map(([, value]) => value), event)
      : []
    return (...eventArgs: unknown[]) => (scope[call[1]] as (...args: unknown[]) => unknown)(...values, ...eventArgs)
  } catch {
    return (...eventArgs: unknown[]) => (scope[call[1]] as (...args: unknown[]) => unknown)(...eventArgs)
  }
}

export const resolveXamlHandler = (value: unknown, instance: ComponentInternalInstance | null, extraScope?: Scope) => {
  if (typeof value === 'function') return value
  if (typeof value !== 'string') return undefined
  const expression = stripBinding(value)
  const scope = scopeFor(instance)
  if (extraScope) Object.assign(scope, extraScope)
  const assignment = expression.match(/^([A-Za-z_$][\w$]*)\s*=\s*\$event(?:\.([A-Za-z_$][\w$]*))?(?:\s*(===|!==|==|!=)\s*(['"]?[^\s'"]+['"]?))?$/)
  if (assignment) {
    return (event: unknown) => {
      let next: unknown = event
      if (assignment[2]) next = (next as Record<string, unknown> | undefined)?.[assignment[2]]
      if (assignment[3]) {
        const right = assignment[4]?.replace(/^['"]|['"]$/g, '')
        const comparable = right === 'true' ? true : right === 'false' ? false : Number.isNaN(Number(right)) ? right : Number(right)
        next = assignment[3] === '===' ? next === comparable : assignment[3] === '!==' ? next !== comparable : assignment[3] === '==' ? next == comparable : next != comparable
      }
      assignPath(assignment[1], next, instance)
    }
  }
  const literalAssignment = expression.match(/^([A-Za-z_$][\w$]*)\s*=\s*(['"].*['"])$/s)
  if (literalAssignment) {
    return () => assignPath(literalAssignment[1], literalAssignment[2].slice(1, -1), instance)
  }
  return evaluateHandler(expression, scope, undefined)
}

export const normalizeXamlVNode = (node: VNode, instance: ComponentInternalInstance | null): VNode => {
  // DataTemplate children belong to the materialized item's own namescope.
  // Defer their bindings and x:Name registration until that item exists.
  if (componentName(node.type) === 'DataTemplate') return node
  // Fragments and structural wrapper nodes normally have no props. Their
  // children can still contain XAML bindings and event names, so do not stop
  // traversal at the wrapper.
  const props = { ...(node.props ?? {}) }
  const sourceProps = xamlPropSources.get(node as object) ?? { ...props }
  xamlPropSources.set(node as object, sourceProps)
  for (const [name, value] of Object.entries(sourceProps)) {
    if (name.startsWith('on') || name === 'key' || name === 'class' || name === 'style') continue
    if (name === 'ref' || /^x:name$/i.test(name)) {
      // Keep Vue's ref registration, and expose the XAML name on the DOM so
      // Target="{x:Bind testButton}" can still resolve after a slot is
      // teleported outside the page subtree.
      if (typeof value === 'string' && value.trim()) props['data-xaml-ref'] = value.trim()
      if (/^x:name$/i.test(name) && typeof value === 'string' && value.trim()) {
        const nameScope = instance?.provides?.[xamlNameScopeKey] as Record<string, unknown> | undefined
        if (nameScope) {
          const xamlName = value.trim()
          const register = (vnode: VNode) => {
            const component = vnode.component as {
              exposed?: Record<string, unknown> | null
              exposeProxy?: unknown
              proxy?: unknown
            } | null
            const exposed = component?.exposed
            if (exposed) {
              if ((exposed as Record<PropertyKey, unknown>)[xamlControlIdentityKey]) {
                if (nameScope[xamlName] !== exposed) nameScope[xamlName] = exposed
                return
              }
              // Keep a stable XAML namescope object around the component's
              // exposed refs. Vue's public expose proxy unwraps refs on read,
              // but assigning through it can miss a computed setter. XAML
              // TwoWay bindings need both operations to be dependency-property
              // shaped, so unwrap on get and write through the original ref.
              let exposedBindingProxy = xamlExposedBindingProxies.get(exposed)
              if (!exposedBindingProxy) {
                exposedBindingProxy = new Proxy(exposed, {
                  get(target, property, receiver) {
                    if (property === 'ClearValue' && !Reflect.has(target, property)) return (dependencyProperty: { ClearValue?: (target: unknown) => void }) => dependencyProperty?.ClearValue?.(exposedBindingProxy)
                    return unwrap(Reflect.get(target, property, receiver))
                  },
                  set(target, property, next, receiver) {
                    const current = Reflect.get(target, property, receiver)
                    if (isRef(current) && !isRef(next)) {
                      current.value = next
                      return true
                    }
                    return Reflect.set(target, property, next, receiver)
                  }
                })
                xamlExposedBindingProxies.set(exposed, exposedBindingProxy)
              }
              if (nameScope[xamlName] !== exposedBindingProxy) nameScope[xamlName] = exposedBindingProxy
              return
            }
            nameScope[xamlName] = component?.exposeProxy ?? component?.proxy ?? vnode.el ?? undefined
          }
          const previousMounted = props.onVnodeMounted
          const previousUpdated = props.onVnodeUpdated
          const previousBeforeUnmount = props.onVnodeBeforeUnmount
          props.onVnodeMounted = (vnode: VNode) => {
            if (typeof previousMounted === 'function') previousMounted(vnode)
            register(vnode)
          }
          props.onVnodeUpdated = (vnode: VNode) => {
            if (typeof previousUpdated === 'function') previousUpdated(vnode)
            register(vnode)
          }
          props.onVnodeBeforeUnmount = (vnode: VNode) => {
            if (typeof previousBeforeUnmount === 'function') previousBeforeUnmount(vnode)
            delete nameScope[xamlName]
          }
        }
      }
      if (/^x:name$/i.test(name)) delete props[name]
      continue
    }
    if (eventNames.has(name)) {
      // Named controls are registered after the first template render. Resolve
      // a handler at dispatch time so Click="rc.RequestRefresh" can refer to
      // a sibling x:Name without losing the listener before it mounts.
      const layoutNativeEvents: Record<string, string> = {
        PointerMoved: 'onPointermove', PointerPressed: 'onPointerdown', PointerReleased: 'onPointerup',
        PointerEntered: 'onPointerenter', PointerExited: 'onPointerleave',
        PointerCanceled: 'onPointercancel', PointerCaptureLost: 'onLostpointercapture',
        GotFocus: 'onFocusin', LostFocus: 'onFocusout', KeyDown: 'onKeydown', KeyUp: 'onKeyup'
      }
      const collectionFocus = ['GridView', 'ListView'].includes(componentName(node.type)) && ['GotFocus', 'LostFocus'].includes(name)
      const layoutHost = collectionFocus || typeof node.type === 'string' || ['Border', 'Grid', 'StackPanel', 'Line', 'Polyline', 'Path'].includes(componentName(node.type))
      // Button consumes XAML Click directly; Vue warns on its PascalCase name
      // when the same handler is represented as a native-style onClick prop.
      const directClick = name === 'Click' && componentName(node.type) === 'Button'
      const handlerProp = directClick ? name : layoutHost && layoutNativeEvents[name] ? layoutNativeEvents[name] : eventProp(name)
      props[handlerProp] = (...args: unknown[]) => {
        const handler = resolveXamlHandler(value, instance, instance?.provides?.[xamlNameScopeKey] as Scope | undefined)
        if (collectionFocus) return handler?.(node.component?.exposeProxy ?? node.component?.proxy, args[0])
        const names = instance?.provides?.[xamlNameScopeKey] as Scope | undefined
        const xamlName = String(sourceProps['x:Name'] ?? sourceProps['x:name'] ?? '')
        const sender = names?.[xamlName] ?? node.component?.exposeProxy ?? node.component?.proxy
        if (['TextBox', 'PasswordBox', 'AutoSuggestBox', 'RichEditBox', 'RichTextBlock'].includes(componentName(node.type)) && args.length < 2) {
          return handler?.(sender, args[0] ?? { OriginalSource: sender, Handled: false })
        }
        if (name === 'ValueChanged' && componentName(node.type) === 'NumberBox' && args.length === 1) {
          return handler?.(sender, args[0])
        }
        if (name === 'ValueChanged' && componentName(node.type) === 'Slider' && xamlName && names?.[xamlName] && args.length >= 2) {
          return handler?.(sender, ...args.slice(1))
        }
        if (name === 'SelectionChanged' && componentName(node.type) === 'ComboBox' && xamlName && names?.[xamlName] && args.length >= 2) {
          return handler?.(sender, ...args.slice(1))
        }
        return handler?.(...args)
      }
      if (!directClick) delete props[name]
      continue
    }
    if (typeof value === 'string' && value.startsWith('{')) {
      const details = bindingDetails(value)
      let resolved = resolveXamlValue(value, instance, instance?.provides?.[xamlNameScopeKey] as Scope | undefined)
      if (/^RelativePanel\./.test(name) && resolved && typeof resolved === 'object') {
        const element = (resolved as { $el?: Element }).$el ?? resolved as Element
        const targetName = typeof element.getAttribute === 'function' ? element.getAttribute('data-xaml-ref') : undefined
        if (targetName) resolved = targetName
      }
      // Vue component props keep the XAML expression so their computed
      // resolvers remain reactive to page state. Native nodes need the
      // current value, and resources are always materialized as CSS vars.
      // ItemTemplate and GroupHeaderTemplate use StaticResource as an object
      // lookup, not as a CSS brush. Preserve that XAML marker for collection
      // controls so `<GridView ItemTemplate="{StaticResource ImageTemplate}" />`
      // can resolve the actual DataTemplate from Page.Resources.
      const collectionTemplateResource = resourceName(value)
        && ['ItemTemplate', 'GroupHeaderTemplate', 'MenuItemTemplate', 'MenuItemTemplateSelector',
          'MenuItemContainerStyle', 'MenuItemContainerStyleSelector', 'HeaderTemplate', 'PaneToggleButtonStyle', 'Command', 'Flyout', 'ItemContainerStyle'].includes(name)
      const paintResource = resourceName(value) && ['Background', 'PaneBackground', 'Fill', 'Stroke', 'Shadow'].includes(name)
        && reactiveComponentNames.has(componentName(node.type))
      const calendarTemplateResource = resourceName(value)
        && ['CalendarView', 'CalendarDatePicker', 'DatePicker', 'TimePicker'].includes(componentName(node.type))
        && ['Style', 'HeaderTemplate', 'CalendarViewStyle'].includes(name)
      const informationTemplateResource = resourceName(value)
        && ((componentName(node.type) === 'InfoBadge' && name === 'Style')
          || (componentName(node.type) === 'InfoBar' && name === 'CloseButtonStyle'))
      const flyoutTemplateResource = resourceName(value)
        && componentName(node.type) === 'Flyout' && name === 'FlyoutPresenterStyle'
      const scrollViewerTemplateResource = resourceName(value)
        && componentName(node.type) === 'ScrollViewer' && name === 'Template'
      const pivotTemplateResource = resourceName(value)
        && ['Pivot', 'PivotItem'].includes(componentName(node.type))
        && ['TitleTemplate', 'HeaderTemplate', 'LeftHeaderTemplate', 'RightHeaderTemplate', 'ContentTemplate', 'ItemTemplate'].includes(name)
      const tabViewTemplateResource = resourceName(value)
        && ['TabView', 'TabViewItem'].includes(componentName(node.type))
        && ['TabItemTemplate', 'TabItemTemplateSelector', 'TabStripHeaderTemplate', 'TabStripFooterTemplate', 'HeaderTemplate', 'ContentTemplate', 'IconSource', 'ContextFlyout', 'ToolTipService.ToolTip'].includes(name)
      const pipsPagerStyleResource = resourceName(value) && componentName(node.type) === 'PipsPager'
        && ['PreviousButtonStyle', 'NextButtonStyle', 'SelectedPipStyle', 'NormalPipStyle'].includes(name)
      const imageSourceResource = resourceName(value)
        && ((componentName(node.type) === 'Image' && name === 'Source')
          || (componentName(node.type) === 'PersonPicture' && ['ProfilePicture', 'BadgeImageSource'].includes(name))
          || (['BitmapImage', 'SvgImageSource'].includes(componentName(node.type)) && name === 'UriSource'))
      const swipeObjectResource = resourceName(value)
        && ((componentName(node.type) === 'SwipeControl' && ['LeftItems', 'RightItems', 'TopItems', 'BottomItems', 'ContentTemplate'].includes(name))
          || (componentName(node.type) === 'SwipeItem' && ['IconSource', 'Background', 'Foreground'].includes(name)))
      // Collection property elements are structural markers. Their values
      // are consumed by the owning collection control (for example
      // ItemsStackPanel.AreStickyGroupHeadersEnabled), so keep the original
      // binding expression instead of freezing it to the value seen while
      // the page's VNode tree is normalized. The control resolves it against
      // the live page scope on every computed pass.
      const collectionPropertyNode = Boolean((node.type as { __collectionProperty?: string; __navigationProperty?: string } | undefined)?.__collectionProperty
        || (node.type as { __navigationProperty?: string } | undefined)?.__navigationProperty
        || (node.type as { __tabViewProperty?: string } | undefined)?.__tabViewProperty
        || (node.type as { __swipeProperty?: string } | undefined)?.__swipeProperty)
      props[name] = paintResource || collectionPropertyNode || calendarTemplateResource || informationTemplateResource || flyoutTemplateResource || scrollViewerTemplateResource || pivotTemplateResource || tabViewTemplateResource || pipsPagerStyleResource || imageSourceResource || swipeObjectResource
        ? value
        : typeof node.type === 'string' || /^(Grid|Canvas|RelativePanel)\./.test(name)
          || (resourceName(value) && !collectionTemplateResource)
          || !reactiveComponentNames.has(componentName(node.type))
          ? resolved
          : value
      if (details.twoWay && !name.includes('.')) {
        props[`onUpdate:${name}`] = (next: unknown) => updateXamlBinding(value, next, instance)
      }
    }
    if (typeof node.type === 'string' && (name === 'Background' || name === 'BorderBrush' || name === 'Foreground')) {
      const resolved = resolveXamlValue(value, instance)
      const style = typeof props.style === 'object' && props.style !== null ? { ...(props.style as Record<string, unknown>) } : {}
      if (name === 'Background') style.background = resolved
      if (name === 'BorderBrush') style.borderColor = resolved
      if (name === 'Foreground') style.color = resolved
      props.style = style
      delete props[name]
    }
    if (typeof node.type === 'string' && name === 'Source') {
      props.src = resolveXamlValue(value, instance)
      delete props[name]
    }
  }
  if (Array.isArray(node.children)) {
    node.children = node.children.map((child) => child && typeof child === 'object' && 'type' in child
      ? normalizeXamlVNode(child as VNode, instance)
      : child)
  }
  if (node.children && typeof node.children === 'object' && !Array.isArray(node.children)) {
    const children = { ...node.children } as Record<string, unknown>
    for (const [slotName, slot] of Object.entries(children)) {
      if (typeof slot !== 'function') continue
      children[slotName] = (...args: unknown[]) => {
        const result = (slot as (...args: unknown[]) => unknown)(...args)
        return Array.isArray(result)
          ? result.map((child) => child && typeof child === 'object' && 'type' in child ? normalizeXamlVNode(child as VNode, instance) : child)
          : result
      }
    }
    node.children = children
  }
  node.props = Object.keys(props).length || node.props ? props : node.props
  return node
}

/**
 * Resolve a bare XAML resource name against the owning page scope.  XAML lets a
 * `{StaticResource Key}` marker name an object that the code-behind provides
 * rather than one declared in `Page.Resources` — a DataTemplateSelector is the
 * common case.  `resolveXamlValue` cannot be used here because a bare identifier
 * is indistinguishable from a literal string, so look the name up directly.
 */
export const resolveXamlResourceObject = (name: unknown, instance: ComponentInternalInstance | null): unknown => {
  if (typeof name !== 'string' || !name.trim()) return undefined
  try {
    const scope = scopeFor(instance)
    const key = name.trim()
    return Object.prototype.hasOwnProperty.call(scope, key) ? scope[key] : undefined
  } catch {
    return undefined
  }
}

export const normalizeXamlNodes = (nodes: VNode[], instance = getCurrentInstance()) =>
  nodes.map((node) => normalizeXamlVNode(node, instance))
