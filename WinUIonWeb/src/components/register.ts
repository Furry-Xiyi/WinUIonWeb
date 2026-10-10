import type { App, Component } from 'vue'
import Canvas, { CanvasResources } from './Canvas.vue'
import { SliderHeaderProperty, ComboBoxItem, XamlString } from './inlineControlProperties'
import Button, { ButtonFlyout, ButtonContent, ButtonKeyboardAccelerators } from './Button.vue'
import HyperlinkButton, { HyperlinkButtonContent } from './HyperlinkButton.vue'
import RepeatButton, { RepeatButtonContent } from './RepeatButton.vue'
import ToggleButton, { ToggleButtonContent } from './ToggleButton.vue'
import AppBarButton, { AppBarButtonIcon, AppBarButtonFlyout, AppBarButtonContent, AppBarButtonKeyboardAccelerators } from './AppBarButton.vue'
import AppBarToggleButton, { AppBarToggleButtonIcon, AppBarToggleButtonContent, AppBarToggleButtonKeyboardAccelerators } from './AppBarToggleButton.vue'
import AppBarSeparator from './AppBarSeparator.vue'
import CommandBar from './CommandBar.vue'
import CommandBarFlyout from './CommandBarFlyout.vue'
import RichEditBox from './RichEditBox.vue'
import BitmapIcon from './BitmapIcon.vue'
import PathIcon from './PathIcon.vue'
import ImageIcon from './ImageIcon.vue'
import IconSourceElement from './IconSourceElement.vue'
import MediaTransportControls from './MediaTransportControls.vue'
import { MediaPlayerTransportControlsProperty } from './MediaPlayerElement.vue'
import BreadcrumbBar from './BreadcrumbBar.vue'
import BreadcrumbBarItem from './BreadcrumbBarItem.vue'
import Pivot from './Pivot.vue'
import PivotItem from './PivotItem.vue'
import { pivotProperties, pivotItemProperties } from './PivotProperties'
import TabView from './TabView.vue'
import TabViewItem from './TabViewItem.vue'
import { tabViewProperties, tabViewItemProperties } from './TabViewProperties'
import ComboBox from './ComboBox.vue'
import SplitView, { SplitViewPane, SplitViewContent } from './SplitView.vue'
import ColumnDefinition from './ColumnDefinition.vue'
import Grid, { GridContextFlyout } from './Grid.vue'
import GridColumnDefinitions from './GridColumnDefinitions.vue'
import GridRowDefinitions from './GridRowDefinitions.vue'
import RelativePanel from './RelativePanel.vue'
import Page from './Page.vue'
import CollectionViewSource from './CollectionViewSource'
import SemanticZoom from './SemanticZoom.vue'
import { ScrollViewerTemplate } from './ScrollViewer.vue'
import RowDefinition from './RowDefinition.vue'
import StackPanel from './StackPanel.vue'
import VariableSizedWrapGrid, { VariableSizedWrapGridResources } from './VariableSizedWrapGrid.vue'
import { CollectionItems, CollectionResources, ItemsWrapGrid } from './CollectionProperties'
import Border, { BorderChild, BorderResources } from './Border.vue'
import SwipeControl from './SwipeControl.vue'
import { SwipeItems, SwipeItem, SwipeItemIconSource, SwipeItemBackground, SwipeItemForeground, LinearGradientBrush, GradientStop, swipeControlProperties } from './SwipeControlProperties'
import Rectangle from './Rectangle.vue'
import RadialGradientBrush from './RadialGradientBrush.vue'
import ThemeShadow from './ThemeShadow.vue'
import SystemBackdropElement from './SystemBackdropElement.vue'
import TitleBar from './TitleBar.vue'
import { MicaBackdrop, DesktopAcrylicBackdrop, SystemBackdropElementSystemBackdrop } from './systemBackdropXaml'
import { Line, Polyline, Path, GeometryGroup, LineGeometry, EllipseGeometry, RectangleGeometry } from './Shapes'
import Ellipse from './Ellipse.vue'
import ItemsRepeaterScrollHost from './ItemsRepeaterScrollHost.vue'
import ItemsControl from './ItemsControl.vue'
import Image, { ImageSourceProperty } from './Image.vue'
import BitmapImage from './BitmapImage.vue'
import PersonPicture from './PersonPicture.vue'
import ProgressBar from './ProgressBar.vue'
import ProgressRing from './ProgressRing.vue'
import SvgImageSource from './SvgImageSource.vue'
import ItemContainer from './ItemContainer.vue'
import FontIcon from './FontIcon.vue'
import SymbolIcon from './SymbolIcon.vue'
import TextBlock from './TextBlock.vue'
import { Run, Span, Bold, Italic, Underline, Paragraph, LineBreak, Hyperlink, InlineUIContainer, TextHighlighter, TextRange,
  TextBlockInlines, TextBlockTextHighlighters, RichTextBlockBlocks, RichTextBlockTextHighlighters, SpanInlines, ParagraphInlines, InlineUIContainerChild, TextHighlighterRanges } from './TextInline'
import RichTextBlockOverflow from './RichTextBlockOverflow.vue'
import AnimatedIcon from './AnimatedIcon.vue'
import AutoSuggestBox from './AutoSuggestBox.vue'
import NumberBox from './NumberBox.vue'
import TextBox from './TextBox.vue'
import PasswordBox from './PasswordBox.vue'
import { animatedIconVisualSourceComponents } from './animatedIconVisuals'
import Flyout from './Flyout.vue'
import ContentDialog from './ContentDialog.vue'
import Popup from './Popup.vue'
import TeachingTip from './TeachingTip.vue'
import {
  TeachingTipContent,
  TeachingTipHeroContent,
  TeachingTipIconSource
} from './TeachingTipProperties'
import ToolTip from './ToolTip.vue'
import SplitButton, { SplitButtonFlyout, SplitButtonContent } from './SplitButton.vue'
import { CollectionItemTemplate, CollectionItemsPanel, CollectionGroupHeaderTemplate, CollectionGroupStyle, CollectionGroupStyleHeaderTemplate, CollectionItemContainerStyle, CollectionItemContainerStyleSelector, CollectionItemContainerTransitions, CollectionItemTemplateSelector, CollectionLayout, StackLayout, UniformGridLayout, LinedFlowLayout, ActivityFeedLayout, VariedImageSizeLayout, DataTemplate, DataTemplateSelector, ItemsPanelTemplate, ItemsStackPanel, ControlTemplate, ScrollContentPresenter, XamlStyle, XamlSetter } from './CollectionProperties'
import { XamlTreeViewItem, XamlTreeViewNode, TreeViewNodeChildren, TreeViewRootNodes } from './TreeView.vue'
import RefreshContainer, { RefreshContainerContent, RefreshContainerVisualizer } from './RefreshContainer.vue'
import RefreshVisualizer, { RefreshVisualizerContent } from './RefreshVisualizer.vue'
import { ToolTipContent, ToolTipContentTemplate, ToolTipContentTransitions, ToolTipServiceToolTip } from './ToolTipServiceProperties'
import ToggleSplitButton, { ToggleSplitButtonFlyout, ToggleSplitButtonContent } from './ToggleSplitButton.vue'
import InfoBadge, { InfoBadgeIconSourceProperty } from './InfoBadge.vue'
import InfoBar from './InfoBar.vue'
import InfoBarPanel from './InfoBarPanel.vue'
import { InfoBarActionButton, InfoBarContent, InfoBarContentTemplate, InfoBarIconSource } from './InfoBarProperties'
import { FontIconSource, SymbolIconSource, BitmapIconSource, PathIconSource, ImageIconSource, ImageIconSourceProperty, IconSourceProperty } from './IconSource'
import Frame from './Frame.vue'
import { FrameContentTransitions, TransitionCollection, NavigationThemeTransition,
  EntranceNavigationTransitionInfo, DrillInNavigationTransitionInfo, SuppressNavigationTransitionInfo,
  SlideNavigationTransitionInfo, CommonNavigationTransitionInfo, ContinuumNavigationTransitionInfo } from './NavigationTransitionProperties'
import NavigationView from './NavigationView.vue'
import * as NavigationViewProperties from './NavigationViewProperties'
import { XamlDouble, XamlInt32, XamlBoolean, Thickness, HorizontalAlignment, VerticalAlignment } from './xamlPrimitives'
import Expander from './Expander.vue'
import DropDownButton from './DropDownButton.vue'
import MenuFlyout from './MenuFlyout.vue'
import * as MenuFlyoutItems from './MenuFlyoutItems'
import MenuBar from './MenuBar.vue'
import MenuBarItem from './MenuBarItem.vue'
import {
  ExpanderContent,
  ExpanderDescription,
  ExpanderHeader,
  ExpanderHeaderControls,
  ExpanderHeaderIcon
} from './ExpanderProperties'
import { AcrylicBrush } from './AcrylicBrush'
import { ResourceDictionary, SolidColorBrush, StaticResource } from './xamlPrimitives'

export function registerWinUIComponents(app: App): void {
  app.component('AcrylicBrush', AcrylicBrush)
  app.component('media:AcrylicBrush', AcrylicBrush)
  app.component('SolidColorBrush', SolidColorBrush)
  app.component('StaticResource', StaticResource)
  app.component('ResourceDictionary', ResourceDictionary)
  app.component('ResourceDictionary.ThemeDictionaries', ResourceDictionary.ThemeDictionaries)
  app.component('ResourceDictionary.MergedDictionaries', ResourceDictionary.MergedDictionaries)
  app.component('Thickness', Thickness)
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

  // Register simple XAML tags such as Button and TextBlock. Gallery-only
  // helpers remain in the Gallery entry point and outside the library bundle.
  const rootComponents = import.meta.glob<Component>([
    './*.vue',
    '!./ControlExample.vue',
    '!./ControlExampleBase.vue',
    '!./HorizontalScrollContainer.vue',
    '!./PageHeader.vue',
    '!./SampleCodePresenter.vue',
    '!./ThemeWrapper.vue',
    '!./TypographyRow.vue'
  ], { eager: true, import: 'default' })
  for (const [path, component] of Object.entries(rootComponents)) {
    const name = path.slice('./'.length, -'.vue'.length)
    if (!app.component(name)) app.component(name, component)
  }
}
