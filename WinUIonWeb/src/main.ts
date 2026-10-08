import { createApp, shallowRef, type Component } from 'vue'
import App from './gallery/App.vue'
import HomeHeaderTile from './gallery/components/HomeHeaderTile.vue'
import HorizontalScrollContainer from './components/HorizontalScrollContainer.vue'
import router from './gallery/router'
import SampleSystemBackdropsWindow from './gallery/samples/SystemBackdrops/SampleSystemBackdropsWindow.vue'
import SampleBuiltInSystemBackdropsWindow from './gallery/samples/SystemBackdrops/SampleBuiltInSystemBackdropsWindow.vue'
import { readSystemBackdropSampleSession } from './gallery/samples/SystemBackdrops/mountSystemBackdropsWindow'
import WindowSampleRecoveryPage from './gallery/samples/SystemBackdrops/WindowSampleRecoveryPage.vue'
import TitleBarDragRegionsWindow from './gallery/samples/TitleBar/TitleBarDragRegionsWindow.vue'
import TitleBarWindow from './gallery/samples/TitleBar/TitleBarWindow.vue'
import MultipleWindowsSampleWindow from './gallery/samples/MultipleWindows/MultipleWindowsSampleWindow.vue'
import './styles/theme.css'
import './styles/buttonResources.css'
import './styles/dropDownButtonResources.css'
import './styles/pivot.css'
import './styles/swipe.css'
import manifestTemplate from './manifest.json'
import appIconUrl from './assets/AppIcon.ico?url'
import appIcon180Url from './assets/AppIcon-180.png?url'
import appIcon192Url from './assets/AppIcon-192.png?url'
import appIcon512Url from './assets/AppIcon-512.png?url'
import { createI18n, i18nKey } from './components/i18n/index'
import galleryEnUS from './gallery/Strings/en-US/Resources'
import galleryZhCN from './gallery/Strings/zh-CN/Resources'
import Canvas, { CanvasResources } from './components/Canvas.vue'
import { SliderHeaderProperty, ComboBoxItem, XamlString } from './components/inlineControlProperties'
import Button, { ButtonFlyout, ButtonContent, ButtonKeyboardAccelerators } from './components/Button.vue'
import HyperlinkButton, { HyperlinkButtonContent } from './components/HyperlinkButton.vue'
import RepeatButton, { RepeatButtonContent } from './components/RepeatButton.vue'
import ToggleButton, { ToggleButtonContent } from './components/ToggleButton.vue'
import AppBarButton, { AppBarButtonIcon, AppBarButtonFlyout, AppBarButtonContent, AppBarButtonKeyboardAccelerators } from './components/AppBarButton.vue'
import AppBarToggleButton, { AppBarToggleButtonIcon, AppBarToggleButtonContent, AppBarToggleButtonKeyboardAccelerators } from './components/AppBarToggleButton.vue'
import AppBarSeparator from './components/AppBarSeparator.vue'
import CommandBar from './components/CommandBar.vue'
import CommandBarFlyout from './components/CommandBarFlyout.vue'
import RichEditBox from './components/RichEditBox.vue'
import BitmapIcon from './components/BitmapIcon.vue'
import PathIcon from './components/PathIcon.vue'
import ImageIcon from './components/ImageIcon.vue'
import IconSourceElement from './components/IconSourceElement.vue'
import MediaTransportControls from './components/MediaTransportControls.vue'
import { MediaPlayerTransportControlsProperty } from './components/MediaPlayerElement.vue'
import ControlExample from './components/ControlExample.vue'
import BreadcrumbBar from './components/BreadcrumbBar.vue'
import BreadcrumbBarItem from './components/BreadcrumbBarItem.vue'
import Pivot from './components/Pivot.vue'
import PivotItem from './components/PivotItem.vue'
import { pivotProperties, pivotItemProperties } from './components/PivotProperties'
import TabView from './components/TabView.vue'
import TabViewItem from './components/TabViewItem.vue'
import { tabViewProperties, tabViewItemProperties } from './components/TabViewProperties'
import TabViewSamplePage1 from './gallery/samples/TabView/SamplePage1.vue'
import TabViewSamplePage2 from './gallery/samples/TabView/SamplePage2.vue'
import TabViewSamplePage3 from './gallery/samples/TabView/SamplePage3.vue'
import TabViewWindowingSamplePage from './gallery/samples/TabView/TabViewWindowingSamplePage.vue'
import { tabViewHostAdapterKey } from './components/tabViewHostAdapter'
import { createTabViewPwaHost, readTabViewPwaSession, tabViewPwaHostKey, tabViewPwaSessionKey } from './components/tabViewPwaHost'
import { observePwaWindowChrome, syncPwaWindowChrome } from './utils/pwaWindowChrome'
import { connectWindowTitleBarFrame } from './utils/titleBarWindowFrame'
import { configureTitleBarWindowHost } from './components/titleBarHostAdapter'
import { createMultipleWindowManager, multipleWindowManagerKey } from './components/multipleWindowHostAdapter'
import { connectGalleryWindowBackdrop, galleryWindowBackdropKey, type GalleryWindowBackdropConnection } from './utils/galleryWindowBackdrop'
import ComboBox from './components/ComboBox.vue'
import SplitView, { SplitViewPane, SplitViewContent } from './components/SplitView.vue'
import ColumnDefinition from './components/ColumnDefinition.vue'
import Grid, { GridContextFlyout } from './components/Grid.vue'
import GridColumnDefinitions from './components/GridColumnDefinitions.vue'
import GridRowDefinitions from './components/GridRowDefinitions.vue'
import RelativePanel from './components/RelativePanel.vue'
import Page from './components/Page.vue'
import CollectionViewSource from './components/CollectionViewSource'
import SemanticZoom from './components/SemanticZoom.vue'
import { ScrollViewerTemplate } from './components/ScrollViewer.vue'
import RowDefinition from './components/RowDefinition.vue'
import StackPanel from './components/StackPanel.vue'
import VariableSizedWrapGrid, { VariableSizedWrapGridResources } from './components/VariableSizedWrapGrid.vue'
import { CollectionItems, CollectionResources, ItemsWrapGrid } from './components/CollectionProperties'
import Border, { BorderChild, BorderResources } from './components/Border.vue'
import SwipeControl from './components/SwipeControl.vue'
import { SwipeItems, SwipeItem, SwipeItemIconSource, SwipeItemBackground, SwipeItemForeground, LinearGradientBrush, GradientStop, swipeControlProperties } from './components/SwipeControlProperties'
import Rectangle from './components/Rectangle.vue'
import RadialGradientBrush from './components/RadialGradientBrush.vue'
import ThemeShadow from './components/ThemeShadow.vue'
import SystemBackdropElement from './components/SystemBackdropElement.vue'
import TitleBar from './components/TitleBar.vue'
import { MicaBackdrop, DesktopAcrylicBackdrop, SystemBackdropElementSystemBackdrop } from './components/systemBackdropXaml'
import { Line, Polyline, Path, GeometryGroup, LineGeometry, EllipseGeometry, RectangleGeometry } from './components/Shapes'
import Ellipse from './components/Ellipse.vue'
import ItemsRepeaterScrollHost from './components/ItemsRepeaterScrollHost.vue'
import ItemsControl from './components/ItemsControl.vue'
import Image, { ImageSourceProperty } from './components/Image.vue'
import BitmapImage from './components/BitmapImage.vue'
import PersonPicture from './components/PersonPicture.vue'
import ProgressBar from './components/ProgressBar.vue'
import ProgressRing from './components/ProgressRing.vue'
import SvgImageSource from './components/SvgImageSource.vue'
import ItemContainer from './components/ItemContainer.vue'
import FontIcon from './components/FontIcon.vue'
import SymbolIcon from './components/SymbolIcon.vue'
import TextBlock from './components/TextBlock.vue'
import { Run, Span, Bold, Italic, Underline, Paragraph, LineBreak, Hyperlink, InlineUIContainer, TextHighlighter, TextRange,
  TextBlockInlines, TextBlockTextHighlighters, RichTextBlockBlocks, RichTextBlockTextHighlighters, SpanInlines, ParagraphInlines, InlineUIContainerChild, TextHighlighterRanges } from './components/TextInline'
import RichTextBlockOverflow from './components/RichTextBlockOverflow.vue'
import SampleCodePresenter from './components/SampleCodePresenter.vue'
import AnimatedIcon from './components/AnimatedIcon.vue'
import AutoSuggestBox from './components/AutoSuggestBox.vue'
import NumberBox from './components/NumberBox.vue'
import TextBox from './components/TextBox.vue'
import PasswordBox from './components/PasswordBox.vue'
import { animatedIconVisualSourceComponents } from './components/animatedIconVisuals'
import Flyout from './components/Flyout.vue'
import ContentDialog from './components/ContentDialog.vue'
import Popup from './components/Popup.vue'
import TeachingTip from './components/TeachingTip.vue'
import {
  TeachingTipContent,
  TeachingTipHeroContent,
  TeachingTipIconSource
} from './components/TeachingTipProperties'
import ToolTip from './components/ToolTip.vue'
import SplitButton, { SplitButtonFlyout, SplitButtonContent } from './components/SplitButton.vue'
import { CollectionItemTemplate, CollectionItemsPanel, CollectionGroupHeaderTemplate, CollectionGroupStyle, CollectionGroupStyleHeaderTemplate, CollectionItemContainerStyle, CollectionItemContainerStyleSelector, CollectionItemContainerTransitions, CollectionItemTemplateSelector, CollectionLayout, StackLayout, UniformGridLayout, LinedFlowLayout, ActivityFeedLayout, VariedImageSizeLayout, DataTemplate, DataTemplateSelector, ItemsPanelTemplate, ItemsStackPanel, ControlTemplate, ScrollContentPresenter, XamlStyle, XamlSetter } from './components/CollectionProperties'
import { XamlTreeViewItem, XamlTreeViewNode, TreeViewNodeChildren, TreeViewRootNodes } from './components/TreeView.vue'
import RefreshContainer, { RefreshContainerContent, RefreshContainerVisualizer } from './components/RefreshContainer.vue'
import RefreshVisualizer, { RefreshVisualizerContent } from './components/RefreshVisualizer.vue'
import { ToolTipContent, ToolTipContentTemplate, ToolTipContentTransitions, ToolTipServiceToolTip } from './components/ToolTipServiceProperties'
import ToggleSplitButton, { ToggleSplitButtonFlyout, ToggleSplitButtonContent } from './components/ToggleSplitButton.vue'
import InfoBadge, { InfoBadgeIconSourceProperty } from './components/InfoBadge.vue'
import InfoBar from './components/InfoBar.vue'
import InfoBarPanel from './components/InfoBarPanel.vue'
import { InfoBarActionButton, InfoBarContent, InfoBarContentTemplate, InfoBarIconSource } from './components/InfoBarProperties'
import { FontIconSource, SymbolIconSource, BitmapIconSource, PathIconSource, ImageIconSource, ImageIconSourceProperty, IconSourceProperty } from './components/IconSource'
import Frame from './components/Frame.vue'
import { FrameContentTransitions, TransitionCollection, NavigationThemeTransition,
  EntranceNavigationTransitionInfo, DrillInNavigationTransitionInfo, SuppressNavigationTransitionInfo,
  SlideNavigationTransitionInfo, CommonNavigationTransitionInfo, ContinuumNavigationTransitionInfo } from './components/NavigationTransitionProperties'
import NavigationView from './components/NavigationView.vue'
import * as NavigationViewProperties from './components/NavigationViewProperties'
import { XamlDouble, XamlInt32, XamlBoolean, Thickness, HorizontalAlignment, VerticalAlignment } from './components/xamlPrimitives'
import Expander from './components/Expander.vue'
import DropDownButton from './components/DropDownButton.vue'
import MenuFlyout from './components/MenuFlyout.vue'
import * as MenuFlyoutItems from './components/MenuFlyoutItems'
import MenuBar from './components/MenuBar.vue'
import MenuBarItem from './components/MenuBarItem.vue'
import {
  ControlExampleExample,
  ControlExampleOptions,
  ControlExampleOutput,
  ControlExampleSubstitutions,
  ControlExampleSubstitution
} from './components/ControlExampleProperties'
import {
  ExpanderContent,
  ExpanderDescription,
  ExpanderHeader,
  ExpanderHeaderControls,
  ExpanderHeaderIcon
} from './components/ExpanderProperties'

const systemBackdropSampleBootstrap = await readSystemBackdropSampleSession()
const systemBackdropSampleSession = systemBackdropSampleBootstrap && 'handle' in systemBackdropSampleBootstrap ? systemBackdropSampleBootstrap : undefined
const windowSampleRecoveryFailure = systemBackdropSampleBootstrap && 'RecoveryError' in systemBackdropSampleBootstrap ? systemBackdropSampleBootstrap : undefined
const tabViewPwaSession = readTabViewPwaSession()
const i18n = createI18n(tabViewPwaSession?.Locale ?? systemBackdropSampleBootstrap?.locale ?? navigator.language, {
  'en-US': galleryEnUS,
  'zh-CN': galleryZhCN
})

const manifestResources = manifestTemplate.resources ?? {}
const appTitleKey = manifestResources.title ?? 'app.title'
const appAuthorKey = manifestTemplate.author ?? 'app.author'
const appVersionKey = manifestTemplate.version ?? 'app.version'
document.documentElement.lang = i18n.locale
document.title = i18n.t(appTitleKey)
if (tabViewPwaSession) {
  document.documentElement.classList.remove('theme-light', 'theme-dark')
  const dark = tabViewPwaSession.Theme === 'Dark' || tabViewPwaSession.Theme === 'Default' && window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.add(dark ? 'theme-dark' : 'theme-light')
}
const tabViewPwaChromeColor = tabViewPwaSession ? syncPwaWindowChrome(window) : undefined

// The manifest is served from a blob URL, so root-relative values would be
// resolved against the blob and rejected by browsers. Resolve every URL
// against the page URL before serializing the manifest.
const resolveManifestUrl = (value: string) => new URL(value, window.location.href).href
const manifestIconUrls: Record<string, string> = {
  '@app-icon': appIconUrl,
  '@app-icon-180': appIcon180Url,
  '@app-icon-192': appIcon192Url,
  '@app-icon-512': appIcon512Url
}

const resolvedManifest = {
  ...manifestTemplate,
  ...(tabViewPwaChromeColor ? { theme_color: tabViewPwaChromeColor, background_color: tabViewPwaChromeColor } : {}),
  name: i18n.t(manifestResources.name ?? appTitleKey),
  short_name: i18n.t(manifestResources.shortName ?? 'app.shortTitle'),
  author: i18n.t(appAuthorKey),
  version: i18n.t(appVersionKey),
  start_url: resolveManifestUrl(import.meta.env.BASE_URL),
  icons: manifestTemplate.icons.map((icon) => ({
    ...icon,
    src: resolveManifestUrl(manifestIconUrls[icon.src] ?? icon.src)
  }))
}

const manifestLink = document.createElement('link')
manifestLink.rel = 'manifest'
manifestLink.href = URL.createObjectURL(new Blob(
  [JSON.stringify(resolvedManifest)],
  { type: 'application/manifest+json' }
))
document.head.appendChild(manifestLink)

import { AcrylicBrush } from './components/AcrylicBrush'
import { ResourceDictionary, SolidColorBrush, StaticResource } from './components/xamlPrimitives'

const sampleRoot = systemBackdropSampleSession?.Kind === 'TitleBarDragRegions' ? TitleBarDragRegionsWindow
  : systemBackdropSampleSession?.Kind === 'TitleBarEndToEnd' ? TitleBarWindow
    : systemBackdropSampleSession?.Kind === 'CreateMultipleWindows' ? MultipleWindowsSampleWindow
      : systemBackdropSampleSession?.allowedBackdrops.length === 4 ? SampleBuiltInSystemBackdropsWindow : SampleSystemBackdropsWindow
const app = windowSampleRecoveryFailure ? createApp(WindowSampleRecoveryPage, { context: windowSampleRecoveryFailure })
  : systemBackdropSampleSession ? createApp(sampleRoot, { handle: systemBackdropSampleSession.handle, allowedBackdrops: systemBackdropSampleSession.allowedBackdrops })
  : tabViewPwaSession ? createApp(TabViewWindowingSamplePage) : createApp(App)
const tabViewPwaHost = createTabViewPwaHost({
  Window: window,
  BaseUrl: window.location.href,
  ApplicationScope: new URL(import.meta.env.BASE_URL, window.location.href).href,
  Locale: i18n.locale,
  Theme: () => document.documentElement.classList.contains('theme-dark') ? 'Dark' : 'Light'
})
app.provide(tabViewHostAdapterKey, tabViewPwaHost.Adapter)
app.provide(tabViewPwaHostKey, tabViewPwaHost)
const galleryWindowBackdrop = shallowRef<GalleryWindowBackdropConnection | null>(null)
app.provide(galleryWindowBackdropKey, galleryWindowBackdrop)
const multipleWindowManager = createMultipleWindowManager()
app.provide(multipleWindowManagerKey, multipleWindowManager)
const disposeMultipleWindows = (event: PageTransitionEvent) => {
  if (event.persisted) return
  window.removeEventListener('pagehide', disposeMultipleWindows)
  void multipleWindowManager.Dispose().catch(error => console.error(error))
}
window.addEventListener('pagehide', disposeMultipleWindows)
if (tabViewPwaSession) app.provide(tabViewPwaSessionKey, tabViewPwaSession)
const disposeTabViewPwaHost = (event: PageTransitionEvent) => {
  if (event.persisted) return
  window.removeEventListener('pagehide', disposeTabViewPwaHost)
  void tabViewPwaHost.Dispose()
}
window.addEventListener('pagehide', disposeTabViewPwaHost)
app.component('HomeHeaderTile.Source', HomeHeaderTile.Source)
app.component('HorizontalScrollContainer.Source', HorizontalScrollContainer.Source)
app.component('AcrylicBrush', AcrylicBrush)
app.component('media:AcrylicBrush', AcrylicBrush)
app.component('SolidColorBrush', SolidColorBrush)
app.component('StaticResource', StaticResource)
app.component('ResourceDictionary', ResourceDictionary)
app.component('ResourceDictionary.ThemeDictionaries', ResourceDictionary.ThemeDictionaries)
app.component('ResourceDictionary.MergedDictionaries', ResourceDictionary.MergedDictionaries)
app.component('Thickness', Thickness)
if (!systemBackdropSampleBootstrap && !tabViewPwaSession) app.use(router)
// Layout controls use their XAML type names at the application boundary.
app.component('Grid', Grid)
app.component('AnimatedIcon', AnimatedIcon)
app.component('AutoSuggestBox.QueryIcon', AutoSuggestBox.QueryIcon)
for (const property of ['Header', 'Description', 'HeaderTemplate', 'ItemTemplate', 'ItemTemplateSelector', 'Resources'] as const) {
  app.component(`AutoSuggestBox.${property}`, AutoSuggestBox[property])
}
app.component('AnimatedIcon.Source', AnimatedIcon.Source)
app.component('AnimatedIcon.FallbackIconSource', AnimatedIcon.FallbackIconSource)
for (const [name, source] of Object.entries(animatedIconVisualSourceComponents)) {
  app.component(name, source)
  app.component(`animatedvisuals:${name}`, source)
}
app.component('Grid.ContextFlyout', GridContextFlyout)
app.component('Button.Flyout', ButtonFlyout)
app.component('Button.Content', ButtonContent)
app.component('Button.KeyboardAccelerators', ButtonKeyboardAccelerators)
app.component('HyperlinkButton.Content', HyperlinkButtonContent)
app.component('RepeatButton.Content', RepeatButtonContent)
app.component('ToggleButton.Content', ToggleButtonContent)
app.component('Button.ContentTemplate', Button.ContentTemplate)
app.component('Button.ContentTransitions', Button.ContentTransitions)
app.component('Button.Resources', Button.Resources)
app.component('HyperlinkButton.ContentTemplate', HyperlinkButton.ContentTemplate)
app.component('HyperlinkButton.ContentTransitions', HyperlinkButton.ContentTransitions)
app.component('HyperlinkButton.Resources', HyperlinkButton.Resources)
app.component('RepeatButton.ContentTemplate', RepeatButton.ContentTemplate)
app.component('RepeatButton.ContentTransitions', RepeatButton.ContentTransitions)
app.component('RepeatButton.Resources', RepeatButton.Resources)
app.component('ToggleButton.ContentTemplate', ToggleButton.ContentTemplate)
app.component('ToggleButton.ContentTransitions', ToggleButton.ContentTransitions)
app.component('ToggleButton.Resources', ToggleButton.Resources)
app.component('SplitButton.ContentTemplate', SplitButton.ContentTemplate)
app.component('SplitButton.ContentTransitions', SplitButton.ContentTransitions)
app.component('SplitButton.Resources', SplitButton.Resources)
app.component('ToggleSplitButton.ContentTemplate', ToggleSplitButton.ContentTemplate)
app.component('ToggleSplitButton.ContentTransitions', ToggleSplitButton.ContentTransitions)
app.component('ToggleSplitButton.Resources', ToggleSplitButton.Resources)
app.component('AppBarButton', AppBarButton)
app.component('AppBarButton.Icon', AppBarButtonIcon)
app.component('AppBarButton.Flyout', AppBarButtonFlyout)
app.component('AppBarButton.Content', AppBarButtonContent)
app.component('AppBarButton.KeyboardAccelerators', AppBarButtonKeyboardAccelerators)
app.component('AppBarToggleButton', AppBarToggleButton)
app.component('AppBarToggleButton.Icon', AppBarToggleButtonIcon)
app.component('AppBarToggleButton.Content', AppBarToggleButtonContent)
app.component('AppBarToggleButton.KeyboardAccelerators', AppBarToggleButtonKeyboardAccelerators)
app.component('AppBarSeparator', AppBarSeparator)
app.component('CommandBar', CommandBar)
app.component('CommandBar.PrimaryCommands', CommandBar.PrimaryCommands)
app.component('CommandBar.SecondaryCommands', CommandBar.SecondaryCommands)
app.component('CommandBar.Content', CommandBar.Content)
app.component('CommandBarFlyout', CommandBarFlyout)
app.component('CommandBarFlyout.PrimaryCommands', CommandBarFlyout.PrimaryCommands)
app.component('CommandBarFlyout.SecondaryCommands', CommandBarFlyout.SecondaryCommands)
app.component('RichEditBox.ContextFlyout', RichEditBox.ContextFlyout)
app.component('RichEditBox.Background', RichEditBox.Background)
app.component('RichEditBox.Header', RichEditBox.Header)
app.component('RichEditBox.HeaderTemplate', RichEditBox.HeaderTemplate)
app.component('RichEditBox.Description', RichEditBox.Description)
app.component('RichEditBox.SelectionFlyout', RichEditBox.SelectionFlyout)
app.component('BitmapIcon', BitmapIcon)
app.component('PathIcon', PathIcon)
app.component('PathIcon.Data', PathIcon.Data)
app.component('ImageIcon', ImageIcon)
app.component('ImageIcon.Source', ImageSourceProperty)
app.component('IconSourceElement', IconSourceElement)
app.component('IconSourceElement.IconSource', IconSourceProperty)
app.component('MediaTransportControls', MediaTransportControls)
app.component('MediaPlayerElement.TransportControls', MediaPlayerTransportControlsProperty)
app.component('StackPanel', StackPanel)
app.component('Canvas', Canvas)
app.component('Canvas.Resources', CanvasResources)
app.component('RelativePanel', RelativePanel)
app.component('RelativePanel.Resources', RelativePanel.Resources)
app.component('VariableSizedWrapGrid', VariableSizedWrapGrid)
app.component('Border', Border)
app.component('Border.Child', BorderChild)
app.component('Rectangle', Rectangle)
app.component('Ellipse', Ellipse)
app.component('ItemsRepeaterScrollHost', ItemsRepeaterScrollHost)
app.component('Image', Image)
app.component('Image.Source', ImageSourceProperty)
app.component('BitmapImage', BitmapImage)
app.component('PersonPicture', PersonPicture)
app.component('ProgressBar', ProgressBar)
app.component('ProgressRing', ProgressRing)
app.component('PersonPicture.ProfilePicture', PersonPicture.ProfilePicture)
app.component('PersonPicture.BadgeImageSource', PersonPicture.BadgeImageSource)
app.component('SvgImageSource', SvgImageSource)
app.component('ItemContainer', ItemContainer)
app.component('FontIcon', FontIcon)
app.component('SymbolIcon', SymbolIcon)
app.component('Run', Run)
app.component('TextBox.Header', TextBox.Header)
app.component('TextBox.HeaderTemplate', TextBox.HeaderTemplate)
app.component('TextBox.Description', TextBox.Description)
app.component('TextBox.ContextFlyout', TextBox.ContextFlyout)
app.component('TextBox.SelectionFlyout', TextBox.SelectionFlyout)
app.component('NumberBox.HeaderTemplate', NumberBox.HeaderTemplate)
app.component('PasswordBox.Header', PasswordBox.Header)
app.component('PasswordBox.Description', PasswordBox.Description)
app.component('PasswordBox.HeaderTemplate', PasswordBox.HeaderTemplate)
app.component('PasswordBox.ContextFlyout', PasswordBox.ContextFlyout)
app.component('PasswordBox.SelectionFlyout', PasswordBox.SelectionFlyout)
app.component('InlineUIContainer', InlineUIContainer)
app.component('TextHighlighter', TextHighlighter)
app.component('TextRange', TextRange)
app.component('TextBlock.Inlines', TextBlockInlines)
app.component('TextBlock.TextHighlighters', TextBlockTextHighlighters)
app.component('RichTextBlock.Blocks', RichTextBlockBlocks)
app.component('RichTextBlock.TextHighlighters', RichTextBlockTextHighlighters)
app.component('Span.Inlines', SpanInlines)
app.component('Bold.Inlines', SpanInlines)
app.component('Italic.Inlines', SpanInlines)
app.component('Underline.Inlines', SpanInlines)
app.component('Hyperlink.Inlines', SpanInlines)
app.component('Paragraph.Inlines', ParagraphInlines)
app.component('InlineUIContainer.Child', InlineUIContainerChild)
app.component('TextHighlighter.Ranges', TextHighlighterRanges)
app.component('Span', Span)
app.component('Bold', Bold)
app.component('Italic', Italic)
app.component('Underline', Underline)
app.component('Paragraph', Paragraph)
app.component('RichTextBlockOverflow', RichTextBlockOverflow)
app.component('SampleCodePresenter', SampleCodePresenter)
app.component('LineBreak', LineBreak)
app.component('Hyperlink', Hyperlink)
app.component('FontIconSource', FontIconSource)
app.component('SymbolIconSource', SymbolIconSource)
app.component('BitmapIconSource', BitmapIconSource)
app.component('PathIconSource', PathIconSource)
app.component('ImageIconSource', ImageIconSource)
app.component('ImageIconSource.ImageSource', ImageIconSourceProperty)
app.component('InfoBadge', InfoBadge)
app.component('InfoBadge.IconSource', InfoBadgeIconSourceProperty)
app.component('InfoBar', InfoBar)
app.component('InfoBarPanel', InfoBarPanel)
app.component('InfoBar.ActionButton', InfoBarActionButton)
app.component('InfoBar.Content', InfoBarContent)
app.component('InfoBar.ContentTemplate', InfoBarContentTemplate)
app.component('InfoBar.IconSource', InfoBarIconSource)
app.component('Frame', Frame)
app.component('Frame.ContentTransitions', FrameContentTransitions)
app.component('TransitionCollection', TransitionCollection)
app.component('NavigationThemeTransition', NavigationThemeTransition)
app.component('NavigationThemeTransition.DefaultNavigationTransitionInfo', NavigationThemeTransition.DefaultNavigationTransitionInfo)
app.component('EntranceNavigationTransitionInfo', EntranceNavigationTransitionInfo)
app.component('DrillInNavigationTransitionInfo', DrillInNavigationTransitionInfo)
app.component('SuppressNavigationTransitionInfo', SuppressNavigationTransitionInfo)
app.component('SlideNavigationTransitionInfo', SlideNavigationTransitionInfo)
app.component('CommonNavigationTransitionInfo', CommonNavigationTransitionInfo)
app.component('ContinuumNavigationTransitionInfo', ContinuumNavigationTransitionInfo)
app.component('NavigationView', NavigationView)
for (const property of Object.values(NavigationViewProperties) as Component[]) {
  if (property && typeof property === 'object' && 'name' in property
    && typeof property.name === 'string' && /^(NavigationView|MenuItemTemplateSelector)/.test(property.name)) {
    app.component(property.name, property)
  }
}
app.component('Flyout', Flyout)
app.component('ContentDialog', ContentDialog)
app.component('ContentDialog.Title', ContentDialog.Title)
app.component('ContentDialog.Content', ContentDialog.Content)
app.component('ContentDialog.TitleTemplate', ContentDialog.TitleTemplate)
app.component('ContentDialog.ContentTemplate', ContentDialog.ContentTemplate)
app.component('Popup', Popup)
app.component('TeachingTip', TeachingTip)
app.component('TeachingTip.HeroContent', TeachingTipHeroContent)
app.component('TeachingTip.Content', TeachingTipContent)
app.component('TeachingTip.IconSource', TeachingTipIconSource)
app.component('TeachingTip.ActionButtonContent', TeachingTip.ActionButtonContent)
app.component('TeachingTip.CloseButtonContent', TeachingTip.CloseButtonContent)
app.component('ToolTip', ToolTip)
app.component('ToolTipService.ToolTip', ToolTipServiceToolTip)
app.component('ToolTip.Content', ToolTipContent)
app.component('ToolTip.ContentTemplate', ToolTipContentTemplate)
app.component('ToolTip.ContentTransitions', ToolTipContentTransitions)
app.component('ControlExample', ControlExample)
app.component('BreadcrumbBar', BreadcrumbBar)
app.component('BreadcrumbBar.ItemTemplate', BreadcrumbBar.ItemTemplate)
app.component('BreadcrumbBarItem', BreadcrumbBarItem)
app.component('BreadcrumbBarItem.ContentTemplate', BreadcrumbBarItem.ContentTemplate)
app.component('ComboBoxItem', ComboBoxItem)
app.component('ComboBox', ComboBox)
for (const property of ['ItemTemplate', 'Items', 'Resources', 'ItemContainerStyle', 'Header', 'HeaderTemplate', 'Description'] as const) {
  app.component(`ComboBox.${property}`, ComboBox[property])
}
app.component('ItemsControl', ItemsControl)
for (const property of ['Items', 'Resources', 'ItemTemplate', 'ItemTemplateSelector', 'ItemsPanel'] as const) {
  app.component(`ItemsControl.${property}`, ItemsControl[property])
}
app.component('x:String', XamlString)
app.component('x:Double', XamlDouble)
app.component('x:Int32', XamlInt32)
app.component('x:Boolean', XamlBoolean)
app.component('HorizontalAlignment', HorizontalAlignment)
app.component('VerticalAlignment', VerticalAlignment)
app.component('SplitView', SplitView)
app.component('SplitView.Pane', SplitViewPane)
app.component('SplitView.Content', SplitViewContent)
app.component('ControlExample.Example', ControlExampleExample)
app.component('ControlExample.Output', ControlExampleOutput)
app.component('ControlExample.Options', ControlExampleOptions)
app.component('ControlExample.Substitutions', ControlExampleSubstitutions)
app.component('ControlExampleSubstitution', ControlExampleSubstitution)
app.component('Flyout.Content', Flyout.Content)
app.component('Flyout.FlyoutPresenterStyle', Flyout.FlyoutPresenterStyle)
app.component('Popup.Child', Popup.Child)
app.component('Popup.Shadow', Popup.Shadow)
app.component('Expander', Expander)
app.component('Expander.Header', ExpanderHeader)
app.component('Expander.Content', ExpanderContent)
app.component('Expander.Description', ExpanderDescription)
app.component('Expander.HeaderIcon', ExpanderHeaderIcon)
app.component('Expander.HeaderControls', ExpanderHeaderControls)
app.component('DropDownButton', DropDownButton)
for (const property of ['Content', 'Flyout', 'ContentTemplate', 'ContentTransitions', 'Resources', 'KeyboardAccelerators', 'Background'] as const) {
  app.component(`DropDownButton.${property}`, DropDownButton[property])
}
app.component('MenuFlyout', MenuFlyout)
app.component('MenuBar', MenuBar)
app.component('MenuBar.Items', MenuBar.Items)
app.component('MenuBarItem', MenuBarItem)
app.component('MenuBarItem.Items', MenuBarItem.Items)
for (const name of ['MenuFlyoutItem', 'ToggleMenuFlyoutItem', 'RadioMenuFlyoutItem', 'MenuFlyoutSubItem', 'SplitMenuFlyoutItem', 'MenuFlyoutSeparator', 'KeyboardAccelerator'] as const) app.component(name, MenuFlyoutItems[name])
app.component('MenuFlyout.Items', MenuFlyout.Items)
app.component('MenuFlyout.MenuFlyoutPresenterStyle', MenuFlyout.MenuFlyoutPresenterStyle)
for (const name of ['MenuFlyoutItem', 'ToggleMenuFlyoutItem', 'RadioMenuFlyoutItem', 'MenuFlyoutSubItem', 'SplitMenuFlyoutItem']) {
  app.component(`${name}.Icon`, MenuFlyoutItems.MenuFlyoutItemIcon)
  app.component(`${name}.KeyboardAccelerators`, MenuFlyoutItems.MenuFlyoutItemKeyboardAccelerators)
}
app.component('MenuFlyoutSubItem.Items', MenuFlyoutItems.MenuFlyoutSubItemItems)
app.component('SplitMenuFlyoutItem.Items', MenuFlyoutItems.MenuFlyoutSubItemItems)
app.component('SplitButton.Flyout', SplitButtonFlyout)
app.component('SplitButton.Content', SplitButtonContent)
app.component('ToggleSplitButton.Flyout', ToggleSplitButtonFlyout)
app.component('ToggleSplitButton.Content', ToggleSplitButtonContent)
app.component('ColumnDefinition', ColumnDefinition)
app.component('RowDefinition', RowDefinition)
app.component('Grid.ColumnDefinitions', GridColumnDefinitions)
app.component('Grid.RowDefinitions', GridRowDefinitions)
app.component('Slider.Header', SliderHeaderProperty)
// Page.Resources is a XAML property element and therefore resolves by its
// dotted component name at runtime. Register both names so page-level
// DataTemplates are collected by Page instead of being rendered as content.
app.component('Page', Page)
app.component('Page.Resources', Page.Resources)
app.component('CollectionViewSource', CollectionViewSource)
app.component('SemanticZoom.ZoomedInView', SemanticZoom.ZoomedInView)
app.component('SemanticZoom.ZoomedOutView', SemanticZoom.ZoomedOutView)
app.component('ScrollViewer.Template', ScrollViewerTemplate)
app.component('FlipView.ItemTemplate', CollectionItemTemplate)
app.component('FlipView.ItemsPanel', CollectionItemsPanel)
app.component('GridView.ItemTemplate', CollectionItemTemplate)
app.component('GridView.GroupStyle', CollectionGroupStyle)
app.component('GridView.ItemsPanel', CollectionItemsPanel)
app.component('ItemsRepeater.ItemTemplate', CollectionItemTemplate)
app.component('ItemsRepeater.Layout', CollectionLayout)
app.component('ItemsView.ItemTemplate', CollectionItemTemplate)
app.component('ItemsView.Layout', CollectionLayout)
app.component('ListView.ItemTemplate', CollectionItemTemplate)
app.component('ListBox.ItemTemplate', CollectionItemTemplate)
app.component('ListView.GroupHeaderTemplate', CollectionGroupHeaderTemplate)
app.component('ListView.GroupStyle', CollectionGroupStyle)
app.component('GroupStyle', CollectionGroupStyle)
app.component('GroupStyle.HeaderTemplate', CollectionGroupStyleHeaderTemplate)
app.component('ListView.ItemsPanel', CollectionItemsPanel)
app.component('GridView.ItemContainerStyle', CollectionItemContainerStyle)
app.component('ListView.ItemContainerStyle', CollectionItemContainerStyle)
app.component('Style', XamlStyle)
app.component('Setter', XamlSetter)
app.component('TreeView.ItemTemplate', CollectionItemTemplate)
app.component('TreeView.ItemTemplateSelector', CollectionItemTemplateSelector)
app.component('TreeView.ItemContainerStyle', CollectionItemContainerStyle)
app.component('TreeView.ItemContainerStyleSelector', CollectionItemContainerStyleSelector)
app.component('TreeView.ItemContainerTransitions', CollectionItemContainerTransitions)
app.component('TreeView.RootNodes', TreeViewRootNodes)
app.component('TreeViewItem', XamlTreeViewItem)
app.component('TreeViewNode', XamlTreeViewNode)
app.component('TreeViewNode.Children', TreeViewNodeChildren)
app.component('DataTemplate', DataTemplate)
app.component('Pivot', Pivot)
app.component('PivotItem', PivotItem)
for (const [name, component] of Object.entries(pivotProperties)) app.component(`Pivot.${name}`, component)
for (const [name, component] of Object.entries(pivotItemProperties)) app.component(`PivotItem.${name}`, component)
app.component('TabView', TabView)
app.component('TabViewItem', TabViewItem)
for (const [name, component] of Object.entries(tabViewProperties)) app.component(`TabView.${name}`, component)
for (const [name, component] of Object.entries(tabViewItemProperties)) app.component(`TabViewItem.${name}`, component)
app.component('samplepages:SamplePage1', TabViewSamplePage1)
app.component('samplepages:SamplePage2', TabViewSamplePage2)
app.component('samplepages:SamplePage3', TabViewSamplePage3)
app.component('DataTemplateSelector', DataTemplateSelector)
app.component('ItemsPanelTemplate', ItemsPanelTemplate)
app.component('ItemsStackPanel', ItemsStackPanel)
app.component('ControlTemplate', ControlTemplate)
app.component('ScrollContentPresenter', ScrollContentPresenter)
app.component('CollectionLayout', CollectionLayout)
app.component('StackLayout', StackLayout)
app.component('UniformGridLayout', UniformGridLayout)
app.component('LinedFlowLayout', LinedFlowLayout)
app.component('ActivityFeedLayout', ActivityFeedLayout)
app.component('VariedImageSizeLayout', VariedImageSizeLayout)
app.component('ItemsWrapGrid', ItemsWrapGrid)
app.component('VariableSizedWrapGrid.Resources', VariableSizedWrapGridResources)
app.component('StackPanel.Resources', StackPanel.Resources)
app.component('GridView.Resources', CollectionResources)
app.component('GridView.Items', CollectionItems)
app.component('VirtualizingStackPanel', StackPanel)
app.component('SwipeControl', SwipeControl)
app.component('SwipeItems', SwipeItems)
app.component('SwipeItem', SwipeItem)
app.component('SwipeItem.IconSource', SwipeItemIconSource)
app.component('SwipeItem.Background', SwipeItemBackground)
app.component('SwipeItem.Foreground', SwipeItemForeground)
app.component('LinearGradientBrush', LinearGradientBrush)
app.component('GradientStop', GradientStop)
app.component('RadialGradientBrush', RadialGradientBrush)
app.component('media:RadialGradientBrush', RadialGradientBrush)
app.component('RadialGradientBrush.GradientStops', RadialGradientBrush.GradientStops)
app.component('media:RadialGradientBrush.GradientStops', RadialGradientBrush.GradientStops)
for (const [owner, component, properties] of [
  ['Grid', Grid, ['Background']], ['StackPanel', StackPanel, ['Background']],
  ['Canvas', Canvas, ['Background']], ['Border', Border, ['Background']],
  ['Button', Button, ['Background']], ['TextBlock', TextBlock, ['Foreground']],
  ['Rectangle', Rectangle, ['Fill', 'Stroke']], ['Line', Line, ['Fill', 'Stroke']],
  ['Polyline', Polyline, ['Fill', 'Stroke']], ['Path', Path, ['Fill', 'Stroke']]
] as const) {
  for (const property of properties) app.component(`${owner}.${property}`, (component as any)[property])
}
app.component('ThemeShadow', ThemeShadow)
app.component('SystemBackdropElement', SystemBackdropElement)
app.component('TitleBar', TitleBar)
for (const property of ['Resources', 'IconSource', 'LeftHeader', 'Content', 'RightHeader'] as const) app.component(`TitleBar.${property}`, TitleBar[property])
app.component('SystemBackdropElement.SystemBackdrop', SystemBackdropElementSystemBackdrop)
app.component('MicaBackdrop', MicaBackdrop)
app.component('DesktopAcrylicBackdrop', DesktopAcrylicBackdrop)
app.component('Line', Line)
app.component('Polyline', Polyline)
app.component('Path', Path)
app.component('Path.Data', Path.Data)
app.component('GeometryGroup', GeometryGroup)
app.component('GeometryGroup.Children', GeometryGroup.Children)
app.component('LineGeometry', LineGeometry)
app.component('EllipseGeometry', EllipseGeometry)
app.component('RectangleGeometry', RectangleGeometry)
app.component('Border.Shadow', Border.Shadow)
app.component('Grid.Shadow', Grid.Shadow)
app.component('Border.Resources', BorderResources)
for (const [name, component] of Object.entries(swipeControlProperties)) app.component(`SwipeControl.${name}`, component)
app.component('RefreshContainer', RefreshContainer)
app.component('RefreshContainer.Visualizer', RefreshContainerVisualizer)
app.component('RefreshContainer.Content', RefreshContainerContent)
app.component('RefreshVisualizer', RefreshVisualizer)
app.component('RefreshVisualizer.Content', RefreshVisualizerContent)
app.provide(i18nKey, i18n)
app.config.globalProperties.$t = i18n.t
if (systemBackdropSampleSession) {
  const host = document.getElementById('app')!
  document.title = i18n.t(systemBackdropSampleSession.Kind === 'TitleBarDragRegions' ? 'sample.titlebar.drag-window-title' : systemBackdropSampleSession.Kind === 'TitleBarEndToEnd' ? 'sample.titlebar.end-window-title' : systemBackdropSampleSession.Kind === 'CreateMultipleWindows' ? 'sample.multiplewindows.child-window-title' : 'sample.systembackdrops.window-title')
  document.documentElement.style.height = '100%'
  document.documentElement.style.overflow = 'hidden'
  Object.assign(document.body.style, { margin: '0', width: '100%', height: '100%', overflow: 'hidden', background: 'transparent' })
  Object.assign(host.style, { width: '100%', height: '100%', minWidth: '0', minHeight: '0', overflow: 'auto', boxSizing: 'border-box' })
  host.className = 'win-system-backdrop-window-content win-theme-scope'
  const sampleMountAbort = new AbortController()
  let sampleMounted = false
  let releaseTitleBarFrame: (() => void) | undefined
  let releasePwaChrome: (() => void) | undefined
  const detachSampleWindow = (event: PageTransitionEvent) => {
    if (event.persisted) return
    window.removeEventListener('pagehide', detachSampleWindow)
    sampleMountAbort.abort()
    releasePwaChrome?.()
    if (sampleMounted) app.unmount()
    releaseTitleBarFrame?.()
    systemBackdropSampleSession.Detach?.()
  }
  window.addEventListener('pagehide', detachSampleWindow)
  void systemBackdropSampleSession.handle.SetContentElement(host).then(async () => {
    await configureTitleBarWindowHost(systemBackdropSampleSession.handle.TitleBarHost, {
      ExtendsContentIntoTitleBar: true,
      ...(systemBackdropSampleSession.Kind === 'TitleBarDragRegions' || systemBackdropSampleSession.Kind === 'TitleBarEndToEnd' ? { PreferredHeightOption: 'Tall' as const } : {}),
    }, sampleMountAbort.signal)
    if (sampleMountAbort.signal.aborted || systemBackdropSampleSession.handle.State.Status === 'Closed') return
    releaseTitleBarFrame = connectWindowTitleBarFrame(host, systemBackdropSampleSession.handle.TitleBarHost)
    app.mount(host)
    sampleMounted = true
    releasePwaChrome = observePwaWindowChrome(window, host)
    systemBackdropSampleSession.Ready()
  }).catch(error => {
    if (sampleMountAbort.signal.aborted) return
    console.error(error)
    void systemBackdropSampleSession.handle.Close().catch(failure => console.error(failure))
  })
} else if (windowSampleRecoveryFailure) {
  const host = document.getElementById('app')!
  document.title = i18n.t(windowSampleRecoveryFailure.Kind === 'TitleBarDragRegions' ? 'sample.titlebar.drag-window-title' : windowSampleRecoveryFailure.Kind === 'TitleBarEndToEnd' ? 'sample.titlebar.end-window-title' : windowSampleRecoveryFailure.Kind === 'CreateMultipleWindows' ? 'sample.multiplewindows.child-window-title' : 'sample.systembackdrops.window-title')
  Object.assign(document.documentElement.style, { height: '100%', overflow: 'hidden' })
  Object.assign(document.body.style, { margin: '0', width: '100%', height: '100%', overflow: 'hidden' })
  Object.assign(host.style, { width: '100%', height: '100%', minWidth: '0', minHeight: '0', overflow: 'auto' })
  host.className = 'win-system-backdrop-window-content win-theme-scope'
  const dark = windowSampleRecoveryFailure.RequestedTheme === 'Dark' || windowSampleRecoveryFailure.RequestedTheme === 'Default' && window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.remove('theme-light', 'theme-dark')
  document.documentElement.classList.add(dark ? 'theme-dark' : 'theme-light')
  const releaseTitleBarFrame = connectWindowTitleBarFrame(host)
  app.mount(host)
  const stopChrome = observePwaWindowChrome(window, host)
  window.addEventListener('pagehide', () => { stopChrome(); app.unmount(); releaseTitleBarFrame() }, { once: true })
} else if (tabViewPwaSession) {
  const host = document.getElementById('app')!
  document.title = i18n.t('sample.tabview.window-title')
  document.documentElement.style.height = '100%'
  document.documentElement.style.overflow = 'hidden'
  Object.assign(document.body.style, { margin: '0', width: '100%', height: '100%', overflow: 'hidden' })
  Object.assign(host.style, { width: '100%', height: '100%', minWidth: '0', minHeight: '0', overflow: 'auto', boxSizing: 'border-box' })
  host.className = 'win-tab-view-pwa-window-content win-theme-scope'
  const releasePwaChrome = observePwaWindowChrome(window)
  app.mount(host)
  const disposeTabViewPwaWindow = (event: PageTransitionEvent) => {
    if (event.persisted) return
    window.removeEventListener('pagehide', disposeTabViewPwaWindow)
    releasePwaChrome()
    app.unmount()
  }
  window.addEventListener('pagehide', disposeTabViewPwaWindow)
} else {
  const galleryHost = document.getElementById('app')!
  const connectionAbort = new AbortController()
  let releaseTitleBarHost: (() => void) | undefined
  let galleryMounted = false
  const storedTheme = localStorage.getItem('winui-theme-setting')
  const theme = storedTheme === 'dark' ? 'Dark' : storedTheme === 'light' ? 'Light' : 'Default'
  void connectGalleryWindowBackdrop(galleryHost, { theme, signal: connectionAbort.signal }).catch(error => {
    if (!connectionAbort.signal.aborted) console.error(error)
    return null
  }).then(async connection => {
    if (connectionAbort.signal.aborted) { void connection?.Dispose(); return }
    try { await configureTitleBarWindowHost(connection?.Handle.TitleBarHost, { ExtendsContentIntoTitleBar: true, PreferredHeightOption: 'Tall' }, connectionAbort.signal) }
    catch (error) { if (!connectionAbort.signal.aborted) console.error(error) }
    if (connectionAbort.signal.aborted) { void connection?.Dispose(); return }
    galleryWindowBackdrop.value = connection
    releaseTitleBarHost = connectWindowTitleBarFrame(galleryHost, connection?.Handle.TitleBarHost, false)
    app.mount(galleryHost)
    galleryMounted = true
  })
  const disposeGalleryWindow = (event: PageTransitionEvent) => {
    if (event.persisted) return
    window.removeEventListener('pagehide', disposeGalleryWindow)
    connectionAbort.abort()
    if (galleryMounted) app.unmount()
    releaseTitleBarHost?.()
    void galleryWindowBackdrop.value?.Dispose()
  }
  window.addEventListener('pagehide', disposeGalleryWindow)
}

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});
