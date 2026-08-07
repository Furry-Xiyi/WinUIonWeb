<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock
          class="page-description"
          :Text="$t('text.semanticzoom-description')"
          TextWrapping="WrapWholeWords" />
      </div>

      <div class="gallery-page-content">
        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.semanticzoom.simple')"
          :theme="pageTheme"
          :vue="simpleSemanticZoomCode">
          <template #example>
            <WinSemanticZoom
              ref="semanticZoomRef"
              Height="500">
              <template #zoomedInView>
                <WinScrollViewer
                  class="semantic-view-scroll"
                  HorizontalScrollMode="Disabled"
                  HorizontalScrollBarVisibility="Disabled"
                  VerticalScrollMode="Auto"
                  VerticalScrollBarVisibility="Auto"
                  :IsHorizontalScrollChainingEnabled="false">
                  <WinGridView
                    ref="zoomedInGridRef"
                    class="zoomed-in-grid"
                    :ItemsSource="Groups"
                    :IsItemClickEnabled="false"
                    SelectionMode="None">
                    <!-- @vue-ignore the legacy JS component does not expose slot types -->
                    <template #groupHeader="slotProps">
                      <WinTextBlock
                        class="zoomed-in-group-title"
                        :Text="getGridGroupFromSlot(slotProps).Title" />
                    </template>
                    <!-- @vue-ignore the legacy JS component does not expose slot types -->
                    <template #item="slotProps">
                      <WinStackPanel
                        class="zoomed-in-item"
                        MinWidth="200"
                        Margin="12,6,12,6">
                        <WinTextBlock class="zoomed-in-title" :Text="getGridItemFromSlot(slotProps).Title" />
                        <WinTextBlock
                          Width="300"
                          HorizontalAlignment="Left"
                          class="zoomed-in-subtitle"
                          :Text="getGridItemFromSlot(slotProps).Subtitle"
                          TextWrapping="Wrap" />
                      </WinStackPanel>
                    </template>
                  </WinGridView>
                </WinScrollViewer>
              </template>

              <template #zoomedOutView>
                <WinListView
                  class="zoomed-out-list"
                  :ItemsSource="Groups"
                  :IsItemClickEnabled="true"
                  SelectionMode="None"
                  @ItemClick="onZoomedOutGroupClick">
                  <!-- @vue-ignore the legacy JS component does not expose slot types -->
                  <template #item="slotProps">
                    <WinTextBlock
                      class="zoomed-out-group-title"
                      :Text="getGroupFromSlot(slotProps).Title"
                      TextWrapping="Wrap" />
                  </template>
                </WinListView>
              </template>
            </WinSemanticZoom>
          </template>
        </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import WinControlExample from '../../components/WinControlExample.vue'
import WinGridView from '../../components/WinGridView.vue'
import WinListView from '../../components/WinListView.vue'
import WinScrollViewer from '../../components/WinScrollViewer.vue'
import WinSemanticZoom from '../../components/WinSemanticZoom.vue'
import WinStackPanel from '../../components/WinStackPanel.vue'
import WinTextBlock from '../../components/WinTextBlock.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'

interface ControlInfoItem {
  UniqueId?: string
  Title: string
  Subtitle: string
}

interface ControlInfoGroup {
  Title: string
  Items: ControlInfoItem[]
}

const currentPage = inject<{ value: string }>('currentPage')
const pageKey = computed(() => currentPage?.value || 'semanticzoom')
const { pageTheme } = createPageState(pageKey.value)
const { locale, t } = useI18n()

const controlInfoDataUrl = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/SampleSupport/Data/ControlInfoData.json'
const groupTitleResourceKeys: Record<string, string> = {
  Fundamentals: 'text.fundamentals',
  Design: 'text.design',
  Accessibility: 'text.accessibility',
  'Menus & toolbars': 'text.menus-and-toolbars',
  Collections: 'text.collections',
  'Date & time': 'text.date-and-time',
  'Basic input': 'text.basic-input',
  'Status & info': 'text.status-and-info',
  'Dialogs & flyouts': 'text.dialogs-and-flyouts',
  Scrolling: 'text.scrolling',
  Layout: 'text.layout',
  Navigation: 'text.navigation',
  Media: 'text.media',
  Styles: 'text.styles',
  Text: 'text.text',
  Motion: 'text.motion',
  Windowing: 'text.windowing',
  System: 'text.system',
  Shell: 'text.shell'
}

const localizeGroupTitle = (title: string) => {
  const resourceKey = groupTitleResourceKeys[title]
  return resourceKey ? t(resourceKey) : title
}

const getGroupFromSlot = (slotProps: unknown) => (slotProps as { item: ControlInfoGroup }).item
const getGridGroupFromSlot = (slotProps: unknown) => (slotProps as { group: ControlInfoGroup }).group
const getGridItemFromSlot = (slotProps: unknown) => (slotProps as { item: ControlInfoItem }).item

// The official data file is intentionally language-neutral. Map its stable
// UniqueId values to the Gallery resource names before presenting it so the
// zoomed-in and zoomed-out views use the same localized labels as navigation.
const itemTitleResourceKeys: Record<string, string> = {
  XamlResources: 'text.resources',
  XamlStyles: 'text.style',
  Binding: 'text.binding',
  Templates: 'text.templates',
  CustomUserControls: 'text.custom-user-controls',
  CustomXamlConditionals: 'text.xaml-conditions',
  ScratchPad: 'text.scratch-pad',
  Color: 'text.color',
  Geometry: 'text.geometry',
  Iconography: 'text.iconography',
  Spacing: 'text.spacing',
  Typography: 'text.typography',
  AccessibilityColorContrast: 'text.color-contrast',
  AccessibilityKeyboard: 'text.keyboard-navigation',
  AccessibilityScreenReader: 'text.screen-reader',
  AppBarButton: 'text.appbarbutton',
  AppBarSeparator: 'text.appbarseparator',
  AppBarToggleButton: 'text.apptogglebutton',
  CommandBar: 'text.commandbar',
  CommandBarFlyout: 'text.commandbarflyout',
  MenuBar: 'text.menubar',
  MenuFlyout: 'text.menuflyout',
  SwipeControl: 'text.swipecontrol',
  StandardUICommand: 'text.standarduicommand',
  XamlUICommand: 'text.xamluicommand',
  FlipView: 'text.flipview',
  GridView: 'text.gridview',
  ItemsRepeater: 'text.itemsrepeater',
  ItemsView: 'text.itemsview',
  ListView: 'text.listview',
  PullToRefresh: 'text.pulltorefresh',
  TreeView: 'text.treeview',
  CalendarDatePicker: 'text.calendardatepicker',
  CalendarView: 'text.calendarview',
  DatePicker: 'text.datepicker',
  TimePicker: 'text.timepicker',
  Button: 'text.button',
  DropDownButton: 'text.dropdownbutton',
  HyperlinkButton: 'text.hyperlinkbutton',
  RepeatButton: 'text.repeatbutton',
  ToggleButton: 'text.togglebutton',
  SplitButton: 'text.splitbutton',
  ToggleSplitButton: 'text.togglesplitbutton',
  CheckBox: 'text.checkbox',
  ColorPicker: 'text.colorpicker',
  ComboBox: 'text.combobox',
  RadioButton: 'text.radiobuttons',
  RatingControl: 'text.ratingcontrol',
  Slider: 'text.slider',
  ToggleSwitch: 'text.toggleswitch',
  InfoBadge: 'text.infobadge',
  InfoBar: 'text.infobar',
  ProgressBar: 'text.progressbar',
  ProgressRing: 'text.progressring',
  ToolTip: 'text.tooltip',
  ContentDialog: 'text.contentdialog',
  Flyout: 'text.flyout',
  Popup: 'text.popup',
  TeachingTip: 'text.teachingtip',
  PipsPager: 'text.pipspager',
  ScrollView: 'text.scrollview',
  ScrollViewer: 'text.scrollviewer',
  SemanticZoom: 'text.semanticzoom',
  Border: 'text.border',
  Canvas: 'text.canvas',
  Expander: 'text.expander',
  Grid: 'text.grid',
  RelativePanel: 'text.relativepanel',
  SplitView: 'text.splitview',
  StackPanel: 'text.stackpanel',
  VariableSizedWrapGrid: 'text.variablesizedwrapgrid',
  Viewbox: 'text.viewbox',
  BreadcrumbBar: 'text.breadcrumbbar',
  NavigationView: 'text.navigationview',
  Pivot: 'text.pivot',
  SelectorBar: 'text.selectorbar',
  TabView: 'text.tabview',
  AnimatedVisualPlayer: 'text.animatedvisualplayer',
  Image: 'text.image',
  MediaPlayerElement: 'text.mediaplayerelement',
  PersonPicture: 'text.personpicture',
  Acrylic: 'text.acrylic',
  AnimatedIcon: 'text.animatedicon',
  CompactSizing: 'text.compact-sizing',
  IconElement: 'text.iconelement',
  Line: 'text.line',
  Shape: 'text.shape',
  ThemeShadow: 'text.theme-shadow',
  AutoSuggestBox: 'text.autosuggestbox',
  NumberBox: 'text.numberbox',
  PasswordBox: 'text.passwordbox',
  RichEditBox: 'text.richeditbox',
  RichTextBlock: 'text.richtextblock',
  TextBlock: 'text.textblock',
  TextBox: 'text.textbox',
  ParallaxView: 'text.parallaxview'
}

const itemSubtitleResourceKeys: Record<string, string> = {
  XamlResources: 'sample.semanticzoom.resources-description',
  XamlStyles: 'sample.semanticzoom.style-description',
  Binding: 'sample.semanticzoom.binding-description',
  Templates: 'sample.semanticzoom.templates-description',
  CustomUserControls: 'sample.semanticzoom.custom-controls-description',
  CustomXamlConditionals: 'sample.semanticzoom.xaml-conditions-description',
  ScratchPad: 'sample.semanticzoom.scratch-pad-description',
  CommandBar: 'text.a-command-bar-with-labels-on-the-side-free-float',
  CommandBarFlyout: 'text.the-commandbarflyout-lets-you-provide-users-with',
  MenuBar: 'text.the-menubar-simplifies-the-creation-of-basic-men',
  MenuFlyout: 'text.a-menuflyout-displays-a-lightweight-menu-of-comm',
  FlipView: 'text.the-flipview-lets-you-flip-through-a-collection',
  GridView: 'text.the-gridview-lets-people-browse-and-select-from',
  ItemsRepeater: 'text.itemsrepeater-description',
  ItemsView: 'text.itemsview-description',
  ListView: 'text.a-listview-displays-data-in-a-vertical-list-with',
  PullToRefresh: 'text.a-container-that-allows-users-to-refresh-content',
  TreeView: 'text.the-treeview-control-is-a-hierarchical-list-patt',
  CalendarDatePicker: 'text.the-calendardatepicker-is-a-drop-down-control-th',
  CalendarView: 'text.the-calendarview-gives-a-standardized-way-to-let',
  DatePicker: 'text.use-a-datepicker-to-let-users-set-a-date-in-your',
  TimePicker: 'text.use-a-timepicker-to-let-users-set-a-time-in-your',
  Button: 'text.the-button-control-provides-a-click-event-to-res',
  DropDownButton: 'text.a-dropdownbutton-is-a-button-that-displays-a-che',
  HyperlinkButton: 'text.a-button-that-appears-as-a-hyperlink',
  RepeatButton: 'text.a-button-that-raises-its-click-event-repeatedly-ecf7f2',
  ToggleButton: 'text.a-togglebutton-looks-like-a-button-but-works-lik',
  SplitButton: 'text.the-splitbutton-is-a-dropdown-button-but-with-an',
  ToggleSplitButton: 'text.a-button-that-can-be-toggled-on-off-with-additio',
  CheckBox: 'text.checkbox-controls-let-the-user-select-a-combinat',
  ColorPicker: 'text.a-control-that-lets-users-pick-a-color-from-a-sp',
  ComboBox: 'text.use-a-combobox-also-known-as-a-drop-down-list-to',
  RadioButton: 'text.radiobutton-description',
  RatingControl: 'text.the-ratingcontrol-allows-users-to-view-and-set-r',
  Slider: 'text.use-a-slider-to-let-users-set-a-value-by-moving',
  ToggleSwitch: 'text.use-toggleswitch-controls-to-present-users-with',
  InfoBadge: 'sample.infobadge.description',
  InfoBar: 'sample.infobar.description',
  ProgressBar: 'text.progressbar-description',
  ProgressRing: 'text.progressring-description',
  ToolTip: 'text.tooltip-description',
  ContentDialog: 'text.use-a-contentdialog-to-show-relevant-information',
  Flyout: 'text.a-flyout-displays-lightweight-ui-that-is-either',
  Popup: 'text.displays-content-on-top-of-existing-content-with',
  TeachingTip: 'text.a-teaching-tip-is-a-notification-flyout-used-to',
  PipsPager: 'text.pipspager-description',
  ScrollView: 'text.scrollview-description',
  ScrollViewer: 'text.scrollviewer-description',
  SemanticZoom: 'text.semanticzoom-description',
  Canvas: 'text.canvas-description',
  Expander: 'text.the-expander-control-lets-you-show-or-hide-less',
  Grid: 'text.grid-description',
  RelativePanel: 'text.relativepanel-description',
  SplitView: 'text.a-container-with-two-views-one-view-for-the-main',
  StackPanel: 'text.stackpanel-description',
  VariableSizedWrapGrid: 'text.variablesizedwrapgrid-description',
  Viewbox: 'text.viewbox-description',
  BreadcrumbBar: 'text.breadcrumbbar-description',
  Pivot: 'text.pivot-description',
  SelectorBar: 'text.selectorbar-description',
  AnimatedVisualPlayer: 'text.animatedvisualplayer-description',
  CaptureElementPreview: 'text.capture-element-description',
  Image: 'text.image-description',
  MediaPlayerElement: 'text.mediaplayerelement-description',
  PersonPicture: 'text.personpicture-description',
  AutoSuggestBox: 'text.use-an-autosuggestbox-to-provide-a-list-of-sugge',
  NumberBox: 'text.the-numberbox-control-allows-users-to-enter-numb',
  PasswordBox: 'text.a-passwordbox-is-a-text-input-box-that-conceals',
  RichEditBox: 'text.the-richeditbox-control-lets-a-user-enter-format',
  RichTextBlock: 'sample.richtextblock.description',
  TextBlock: 'text.the-textblock-control-provides-flexible-text-dis',
  TextBox: 'text.use-a-textbox-to-let-a-user-enter-simple-text-in',
  ParallaxView: 'text.parallaxview-description'
}

const itemTitleFallbacks: Record<string, string> = {
  AccessibilityColorContrast: '颜色对比度',
  AccessibilityKeyboard: '键盘导航',
  AccessibilityScreenReader: '屏幕阅读器',
  AppBarButton: '应用栏按钮',
  AppBarSeparator: '应用栏分隔符',
  AppBarToggleButton: '应用栏切换按钮',
  TabView: '选项卡视图',
  AnimatedIcon: '动画图标',
  IconElement: '图标元素',
  Shape: '形状',
  Iconography: '图标设计',
  Spacing: '间距',
  Typography: '版式',
  Color: '颜色',
  Geometry: '几何图形',
  CompactSizing: '紧凑尺寸',
  WebView2: 'WebView2',
  AnnotatedScrollBar: '带注释滚动条',
  Canvas: '画布',
  Grid: '网格布局',
  RelativePanel: '相对面板',
  StackPanel: '堆叠面板',
  VariableSizedWrapGrid: '可变大小换行网格',
  Viewbox: '视图框',
  CaptureElementPreview: '捕获元素 / 相机预览',
  Acrylic: '亚克力画笔',
  RadialGradientBrush: '径向渐变画笔',
  SystemBackdrops: '系统背景（云母/亚克力）',
  SystemBackdropElement: '系统背景元素',
  XamlCompInterop: '动画互操作',
  ConnectedAnimation: '连接动画',
  EasingFunction: '缓动函数',
  ImplicitTransition: '隐式过渡',
  PageTransition: '页面过渡',
  ThemeTransition: '主题过渡',
  ParallaxView: '视差视图',
  AppWindow: '应用窗口',
  AppWindowTitleBar: '应用窗口标题栏',
  CreateMultipleWindows: '多个窗口',
  TitleBar: '标题栏',
  Clipboard: '剪贴板',
  ContentIsland: '内容岛',
  StoragePickers: '存储选取器',
  AppNotification: '应用通知',
  BadgeNotificationManager: '徽章通知',
  JumpList: '跳转列表'
}

const localizeItem = (item: ControlInfoItem & { UniqueId?: string }): ControlInfoItem => {
  const uniqueId = item.UniqueId || ''
  const titleKey = itemTitleResourceKeys[uniqueId]
  const translatedTitle = titleKey ? t(titleKey) : item.Title
  const localizedFallback = locale === 'zh-CN' ? itemTitleFallbacks[uniqueId] : undefined
  const title = localizedFallback || (translatedTitle === titleKey ? item.Title : translatedTitle)
  const subtitleKey = itemSubtitleResourceKeys[uniqueId]
  const translatedSubtitle = subtitleKey ? t(subtitleKey) : item.Subtitle
  const subtitle = translatedSubtitle === subtitleKey ? item.Subtitle : translatedSubtitle
  return { ...item, Title: title, Subtitle: subtitle }
}

const officialFallbackGroups: ControlInfoGroup[] = [
  {
    "Title": "Fundamentals",
    "Items": [
      {
        "UniqueId": "XamlResources",
        "Title": "Resources",
        "Subtitle": "Reusable definitions for shared values to ensure consistency and maintainability."
      },
      {
        "UniqueId": "XamlStyles",
        "Title": "Style",
        "Subtitle": "A XAML style is a Reusable property settings to define consistent UI design elements."
      },
      {
        "UniqueId": "Binding",
        "Title": "Binding",
        "Subtitle": "Connecting UI elements to data for automatic synchronization and updates."
      },
      {
        "UniqueId": "Templates",
        "Title": "Templates",
        "Subtitle": "Customize controls' visuals, item layouts, and data presentation in XAML."
      },
      {
        "UniqueId": "CustomUserControls",
        "Title": "Custom & User Controls",
        "Subtitle": "Create reusable UI components with custom functionality and appearance."
      },
      {
        "UniqueId": "CustomXamlConditionals",
        "Title": "XAML Conditions",
        "Subtitle": "Define custom XAML conditions evaluated at parse time using IXamlCondition."
      },
      {
        "UniqueId": "ScratchPad",
        "Title": "Scratch Pad",
        "Subtitle": "Scratch pad for testing simple XAML markup"
      }
    ]
  },
  {
    "Title": "Design",
    "Items": [
      {
        "UniqueId": "Color",
        "Title": "Color",
        "Subtitle": "Balanced color design creates clarity and aesthetic harmony."
      },
      {
        "UniqueId": "Geometry",
        "Title": "Geometry",
        "Subtitle": "Clear geometric design ensures visual coherence and structure."
      },
      {
        "UniqueId": "Iconography",
        "Title": "Iconography",
        "Subtitle": "Icons are a visual design language that can be used to communicate information quickly and effectively."
      },
      {
        "UniqueId": "Spacing",
        "Title": "Spacing",
        "Subtitle": "Thoughtful spacing design enhances readability and flow."
      },
      {
        "UniqueId": "Typography",
        "Title": "Typography",
        "Subtitle": "Typography design guides attention with intuitive fonts and hierarchy."
      }
    ]
  },
  {
    "Title": "Accessibility",
    "Items": [
      {
        "UniqueId": "AccessibilityColorContrast",
        "Title": "Color Contrast",
        "Subtitle": "High contrast design ensures accessibility for all users."
      },
      {
        "UniqueId": "AccessibilityKeyboard",
        "Title": "Keyboard Navigation",
        "Subtitle": "Keyboard-friendly design enables seamless interactions."
      },
      {
        "UniqueId": "AccessibilityScreenReader",
        "Title": "Screen Reader",
        "Subtitle": "Inclusive design ensures meaningful content for assistive technologies."
      }
    ]
  },
  {
    "Title": "Menus & toolbars",
    "Items": [
      {
        "UniqueId": "AppBarButton",
        "Title": "AppBarButton",
        "Subtitle": "A button that's styled for use in a CommandBar."
      },
      {
        "UniqueId": "AppBarSeparator",
        "Title": "AppBarSeparator",
        "Subtitle": "A vertical line that's used to visually separate groups of commands in an app bar."
      },
      {
        "UniqueId": "AppBarToggleButton",
        "Title": "AppBarToggleButton",
        "Subtitle": "A button that can be on, off, or indeterminate like a CheckBox, and is styled for use in an app bar or other specialized UI."
      },
      {
        "UniqueId": "CommandBar",
        "Title": "CommandBar",
        "Subtitle": "A toolbar for displaying application-specific commands that handles layout and resizing of its contents."
      },
      {
        "UniqueId": "CommandBarFlyout",
        "Title": "CommandBarFlyout",
        "Subtitle": "A mini-toolbar displaying proactive commands, and an optional menu of commands."
      },
      {
        "UniqueId": "MenuBar",
        "Title": "MenuBar",
        "Subtitle": "A classic menu, allowing the display of MenuItems containing MenuFlyoutItems."
      },
      {
        "UniqueId": "MenuFlyout",
        "Title": "MenuFlyout",
        "Subtitle": "Shows a contextual list of simple commands or options."
      },
      {
        "UniqueId": "SwipeControl",
        "Title": "SwipeControl",
        "Subtitle": "Touch gesture for quick menu actions on items."
      },
      {
        "UniqueId": "StandardUICommand",
        "Title": "StandardUICommand",
        "Subtitle": "A StandardUICommand is a built-in 'XamlUICommand' which represents a commonly used command, e.g. 'Save'."
      },
      {
        "UniqueId": "XamlUICommand",
        "Title": "XamlUICommand",
        "Subtitle": "An object which is used to define the look and feel of a given command."
      }
    ]
  },
  {
    "Title": "Collections",
    "Items": [
      {
        "UniqueId": "FlipView",
        "Title": "FlipView",
        "Subtitle": "Presents a collection of items that the user can flip through, one item at a time."
      },
      {
        "UniqueId": "GridView",
        "Title": "GridView",
        "Subtitle": "A control that presents a collection of items in rows and columns."
      },
      {
        "UniqueId": "ItemsRepeater",
        "Title": "ItemsRepeater",
        "Subtitle": "A flexible, primitive control for data-driven layouts."
      },
      {
        "UniqueId": "ItemsView",
        "Title": "ItemsView",
        "Subtitle": "A control that presents a collection of items using various layouts."
      },
      {
        "UniqueId": "ListView",
        "Title": "ListView",
        "Subtitle": "A control that presents a collection of items in a vertical list."
      },
      {
        "UniqueId": "PullToRefresh",
        "Title": "PullToRefresh",
        "Subtitle": "Provides the ability to pull on a collection of items in a list/grid to refresh the contents of the collection."
      },
      {
        "UniqueId": "TreeView",
        "Title": "TreeView",
        "Subtitle": "The  TreeView control is a hierarchical list pattern with expanding and collapsing nodes that contain nested items."
      }
    ]
  },
  {
    "Title": "Date & time",
    "Items": [
      {
        "UniqueId": "CalendarDatePicker",
        "Title": "CalendarDatePicker",
        "Subtitle": "A control that lets users pick a date value using a calendar."
      },
      {
        "UniqueId": "CalendarView",
        "Title": "CalendarView",
        "Subtitle": "A control that presents a calendar for a user to choose a date from."
      },
      {
        "UniqueId": "DatePicker",
        "Title": "DatePicker",
        "Subtitle": "A control that lets a user pick a date value."
      },
      {
        "UniqueId": "TimePicker",
        "Title": "TimePicker",
        "Subtitle": "A configurable control that lets a user pick a time value."
      }
    ]
  },
  {
    "Title": "Basic input",
    "Items": [
      {
        "UniqueId": "Button",
        "Title": "Button",
        "Subtitle": "A control that responds to user input and raises a Click event."
      },
      {
        "UniqueId": "DropDownButton",
        "Title": "DropDownButton",
        "Subtitle": "A button that displays a flyout of choices when clicked."
      },
      {
        "UniqueId": "HyperlinkButton",
        "Title": "HyperlinkButton",
        "Subtitle": "A button that appears as hyperlink text, and can navigate to a URI or handle a Click event."
      },
      {
        "UniqueId": "RepeatButton",
        "Title": "RepeatButton",
        "Subtitle": "A button that raises its Click event repeatedly from the time it's pressed until it's released."
      },
      {
        "UniqueId": "ToggleButton",
        "Title": "ToggleButton",
        "Subtitle": "A button that can be switched between two states like a CheckBox."
      },
      {
        "UniqueId": "SplitButton",
        "Title": "SplitButton",
        "Subtitle": "A two-part button that displays a flyout when its secondary part is clicked."
      },
      {
        "UniqueId": "ToggleSplitButton",
        "Title": "ToggleSplitButton",
        "Subtitle": "A version of the SplitButton where the activation target toggles on/off."
      },
      {
        "UniqueId": "CheckBox",
        "Title": "CheckBox",
        "Subtitle": "A control that a user can select or clear."
      },
      {
        "UniqueId": "ColorPicker",
        "Title": "ColorPicker",
        "Subtitle": "A control that displays a selectable color spectrum."
      },
      {
        "UniqueId": "ComboBox",
        "Title": "ComboBox",
        "Subtitle": "A drop-down list of items a user can select from."
      },
      {
        "UniqueId": "RadioButton",
        "Title": "RadioButton",
        "Subtitle": "A control that allows a user to select a single option from a group of options."
      },
      {
        "UniqueId": "RatingControl",
        "Title": "RatingControl",
        "Subtitle": "Rate something 1 to 5 stars."
      },
      {
        "UniqueId": "Slider",
        "Title": "Slider",
        "Subtitle": "A control that lets the user select from a range of values by moving a Thumb control along a track."
      },
      {
        "UniqueId": "ToggleSwitch",
        "Title": "ToggleSwitch",
        "Subtitle": "A switch that can be toggled between 2 states."
      }
    ]
  },
  {
    "Title": "Status & info",
    "Items": [
      {
        "UniqueId": "InfoBadge",
        "Title": "InfoBadge",
        "Subtitle": "An non-intrusive UI to display notifications or bring focus to an area."
      },
      {
        "UniqueId": "InfoBar",
        "Title": "InfoBar",
        "Subtitle": "An inline message to display app-wide status change information."
      },
      {
        "UniqueId": "ProgressBar",
        "Title": "ProgressBar",
        "Subtitle": "Shows the apps progress on a task, or that the app is performing ongoing work that doesn't block user interaction."
      },
      {
        "UniqueId": "ProgressRing",
        "Title": "ProgressRing",
        "Subtitle": "Shows the apps progress on a task, or that the app is performing ongoing work that does block user interaction."
      },
      {
        "UniqueId": "ToolTip",
        "Title": "ToolTip",
        "Subtitle": "Displays information for an element in a pop-up window."
      }
    ]
  },
  {
    "Title": "Dialogs & flyouts",
    "Items": [
      {
        "UniqueId": "ContentDialog",
        "Title": "ContentDialog",
        "Subtitle": "A dialog box that can be customized to contain any XAML content."
      },
      {
        "UniqueId": "Flyout",
        "Title": "Flyout",
        "Subtitle": "Shows contextual information and enables user interaction."
      },
      {
        "UniqueId": "Popup",
        "Title": "Popup",
        "Subtitle": "A UI element displaying temporary content over existing interface."
      },
      {
        "UniqueId": "TeachingTip",
        "Title": "TeachingTip",
        "Subtitle": "A content-rich flyout for guiding users and enabling teaching moments."
      }
    ]
  },
  {
    "Title": "Scrolling",
    "Items": [
      {
        "UniqueId": "AnnotatedScrollBar",
        "Title": "AnnotatedScrollBar",
        "Subtitle": "A control that extends a regular vertical scrollbar's functionality for an easy navigation through large collections."
      },
      {
        "UniqueId": "PipsPager",
        "Title": "PipsPager",
        "Subtitle": "A control to let the user navigate through a paginated collection when the page numbers do not need to be visually known."
      },
      {
        "UniqueId": "ScrollView",
        "Title": "ScrollView",
        "Subtitle": "A container control that lets the user pan and zoom its content."
      },
      {
        "UniqueId": "ScrollViewer",
        "Title": "ScrollViewer",
        "Subtitle": "A container control that lets the user pan and zoom its content."
      },
      {
        "UniqueId": "SemanticZoom",
        "Title": "SemanticZoom",
        "Subtitle": "Lets the user zoom between two different views of a collection, making it easier to navigate through large collections of items."
      }
    ]
  },
  {
    "Title": "Layout",
    "Items": [
      {
        "UniqueId": "Border",
        "Title": "Border",
        "Subtitle": "A container control that draws a boundary line, background, or both, around another object."
      },
      {
        "UniqueId": "Canvas",
        "Title": "Canvas",
        "Subtitle": "A layout panel that supports absolute positioning of child elements relative to the top left corner of the canvas."
      },
      {
        "UniqueId": "Expander",
        "Title": "Expander",
        "Subtitle": "A container with a header that can be expanded to show a body with more content."
      },
      {
        "UniqueId": "Grid",
        "Title": "Grid",
        "Subtitle": "A layout panel that supports arranging child elements in rows and columns. "
      },
      {
        "UniqueId": "RelativePanel",
        "Title": "RelativePanel",
        "Subtitle": "A panel that uses relationships between elements to define layout."
      },
      {
        "UniqueId": "SplitView",
        "Title": "SplitView",
        "Subtitle": "A container that has 2 content areas, with multiple display options for the pane."
      },
      {
        "UniqueId": "StackPanel",
        "Title": "StackPanel",
        "Subtitle": "A layout panel that arranges child elements into a single line that can be oriented horizontally or vertically."
      },
      {
        "UniqueId": "VariableSizedWrapGrid",
        "Title": "VariableSizedWrapGrid",
        "Subtitle": "A layout panel that supports arranging child elements in rows and columns. Each child element can span multiple rows and columns."
      },
      {
        "UniqueId": "Viewbox",
        "Title": "Viewbox",
        "Subtitle": "A container control that scales its content to a specified size."
      }
    ]
  },
  {
    "Title": "Navigation",
    "Items": [
      {
        "UniqueId": "BreadcrumbBar",
        "Title": "BreadcrumbBar",
        "Subtitle": "Shows the trail of navigation taken to the current location."
      },
      {
        "UniqueId": "NavigationView",
        "Title": "NavigationView",
        "Subtitle": "Common vertical layout for top-level areas of your app via a collapsible navigation menu."
      },
      {
        "UniqueId": "Pivot",
        "Title": "Pivot",
        "Subtitle": "Presents information from different sources in a tabbed view."
      },
      {
        "UniqueId": "SelectorBar",
        "Title": "SelectorBar",
        "Subtitle": "Presents information from a small set of different sources. The user can pick one of them."
      },
      {
        "UniqueId": "TabView",
        "Title": "TabView",
        "Subtitle": "A control that displays a collection of tabs that can be used to display several documents."
      }
    ]
  },
  {
    "Title": "Media",
    "Items": [
      {
        "UniqueId": "AnimatedVisualPlayer",
        "Title": "AnimatedVisualPlayer",
        "Subtitle": "An element to render and control playback of motion graphics."
      },
      {
        "UniqueId": "CaptureElementPreview",
        "Title": "Capture Element / Camera Preview",
        "Subtitle": "A sample for doing a camera preview."
      },
      {
        "UniqueId": "Image",
        "Title": "Image",
        "Subtitle": "A control to display image content."
      },
      {
        "UniqueId": "MapControl",
        "Title": "MapControl",
        "Subtitle": "Displays a symbolic map of the Earth."
      },
      {
        "UniqueId": "MediaPlayerElement",
        "Title": "MediaPlayerElement",
        "Subtitle": "A control to display video and image content."
      },
      {
        "UniqueId": "PersonPicture",
        "Title": "PersonPicture",
        "Subtitle": "Displays the picture of a person/contact."
      },
      {
        "UniqueId": "Sound",
        "Title": "Sound",
        "Subtitle": "A code-behind only API that enables 2D and 3D UI sounds on all XAML controls."
      },
      {
        "UniqueId": "WebView2",
        "Title": "WebView2",
        "Subtitle": "A Microsoft Edge (Chromium) based control that hosts HTML content in an app."
      }
    ]
  },
  {
    "Title": "Styles",
    "Items": [
      {
        "UniqueId": "Acrylic",
        "Title": "AcrylicBrush",
        "Subtitle": "A translucent material recommended for panel backgrounds."
      },
      {
        "UniqueId": "AnimatedIcon",
        "Title": "AnimatedIcon",
        "Subtitle": "An element that displays and controls an icon that animates when the user interacts with the control."
      },
      {
        "UniqueId": "CompactSizing",
        "Title": "Compact Sizing",
        "Subtitle": "How to use a Resource Dictionary to enable compact sizing."
      },
      {
        "UniqueId": "IconElement",
        "Title": "IconElement",
        "Subtitle": "Represents icon controls that use different image types as its content."
      },
      {
        "UniqueId": "Line",
        "Title": "Line",
        "Subtitle": "Draws a straight line between two points."
      },
      {
        "UniqueId": "Shape",
        "Title": "Shape",
        "Subtitle": "How to draw shapes, such as ellipses, rectangles, and polygons."
      },
      {
        "UniqueId": "RadialGradientBrush",
        "Title": "RadialGradientBrush",
        "Subtitle": "A brush to show radial gradients."
      },
      {
        "UniqueId": "SystemBackdrops",
        "Title": "System Backdrops (Mica/Acrylic)",
        "Subtitle": "System backdrops, like Mica and Acrylic, for app windows."
      },
      {
        "UniqueId": "SystemBackdropElement",
        "Title": "SystemBackdropElement",
        "Subtitle": "An element to host system backdrop materials."
      },
      {
        "UniqueId": "ThemeShadow",
        "Title": "ThemeShadow",
        "Subtitle": "Adds a depth-aware shadow to UI elements using system lighting."
      }
    ]
  },
  {
    "Title": "Text",
    "Items": [
      {
        "UniqueId": "AutoSuggestBox",
        "Title": "AutoSuggestBox",
        "Subtitle": "A control to provide suggestions as a user is typing."
      },
      {
        "UniqueId": "NumberBox",
        "Title": "NumberBox",
        "Subtitle": "A text control used for numeric input and evaluation of algebraic equations."
      },
      {
        "UniqueId": "PasswordBox",
        "Title": "PasswordBox",
        "Subtitle": "A control for entering passwords."
      },
      {
        "UniqueId": "RichEditBox",
        "Title": "RichEditBox",
        "Subtitle": "A rich text editing control that supports formatted text, hyperlinks, and other rich content."
      },
      {
        "UniqueId": "RichTextBlock",
        "Title": "RichTextBlock",
        "Subtitle": "A control that displays formatted text, hyperlinks, inline images, and other rich content."
      },
      {
        "UniqueId": "TextBlock",
        "Title": "TextBlock",
        "Subtitle": "A lightweight control for displaying small amounts of text."
      },
      {
        "UniqueId": "TextBox",
        "Title": "TextBox",
        "Subtitle": "A single-line or multi-line plain text field."
      }
    ]
  },
  {
    "Title": "Motion",
    "Items": [
      {
        "UniqueId": "XamlCompInterop",
        "Title": "Animation interop",
        "Subtitle": "XAML and Composition interop allows you to animate elements using expressions, natural animations, and more."
      },
      {
        "UniqueId": "ConnectedAnimation",
        "Title": "Connected Animation",
        "Subtitle": "Connected animations continue elements during page navigation and help the user maintain their context between views."
      },
      {
        "UniqueId": "EasingFunction",
        "Title": "Easing Functions",
        "Subtitle": "Easing is a way to manipulate the velocity of an object as it animates."
      },
      {
        "UniqueId": "ImplicitTransition",
        "Title": "Implicit Transitions",
        "Subtitle": "Use Implicit Transitions to automatically animate changes to properties."
      },
      {
        "UniqueId": "PageTransition",
        "Title": "Page Transitions",
        "Subtitle": "Page transitions provide visual feedback about the relationship between pages."
      },
      {
        "UniqueId": "ThemeTransition",
        "Title": "Theme Transitions",
        "Subtitle": "Theme transitions are pre-packaged, easy-to-apply animations."
      },
      {
        "UniqueId": "ParallaxView",
        "Title": "ParallaxView",
        "Subtitle": "A container control that provides the parallax effect when scrolling."
      }
    ]
  },
  {
    "Title": "Windowing",
    "Items": [
      {
        "UniqueId": "AppWindow",
        "Title": "AppWindow",
        "Subtitle": "A flexible, customizable window management system for app development."
      },
      {
        "UniqueId": "AppWindowTitleBar",
        "Title": "AppWindowTitleBar",
        "Subtitle": "Provides control over the app window title bar."
      },
      {
        "UniqueId": "CreateMultipleWindows",
        "Title": "Multiple windows",
        "Subtitle": "An example showing the creation of single-threaded top level Xaml windows."
      },
      {
        "UniqueId": "TitleBar",
        "Title": "TitleBar",
        "Subtitle": "An example showing how to use the default TitleBar control."
      }
    ]
  },
  {
    "Title": "System",
    "Items": [
      {
        "UniqueId": "Clipboard",
        "Title": "Clipboard",
        "Subtitle": "Copy and paste text, images, and files to and from the system Clipboard."
      },
      {
        "UniqueId": "ContentIsland",
        "Title": "ContentIsland",
        "Subtitle": "Create ContentIslands to host other frameworks in your app."
      },
      {
        "UniqueId": "StoragePickers",
        "Title": "Storage pickers",
        "Subtitle": "Select files and folders with modern system pickers."
      }
    ]
  },
  {
    "Title": "Shell",
    "Items": [
      {
        "UniqueId": "AppNotification",
        "Title": "App notifications",
        "Subtitle": "Send notifications that appear in the Action Center and as toast popups."
      },
      {
        "UniqueId": "BadgeNotificationManager",
        "Title": "Badge notifications",
        "Subtitle": "Show numeric or icon badges on your app’s taskbar icon."
      },
      {
        "UniqueId": "JumpList",
        "Title": "JumpList",
        "Subtitle": "Add custom tasks and groups to the app's taskbar jump list."
      }
    ]
  }
]

const Groups = ref<ControlInfoGroup[]>(officialFallbackGroups.map(group => ({
  ...group,
  Title: localizeGroupTitle(group.Title),
  Items: group.Items.map(localizeItem)
})))

const semanticZoomRef = ref<InstanceType<typeof WinSemanticZoom>>()
const zoomedInGridRef = ref<{ ScrollIntoGroup: (group: ControlInfoGroup) => boolean }>()

const onZoomedOutGroupClick = ({
  ClickedItem,
  OriginalSource
}: {
  ClickedItem: ControlInfoGroup
  OriginalSource?: HTMLElement
}) => {
  if (!ClickedItem) return

  // Prepare the hidden destination view before the official fade state runs.
  // This mirrors ListViewBase's semantic-zoom mapping and prevents a visible
  // jump after the zoomed-in presenter has already appeared.
  zoomedInGridRef.value?.ScrollIntoGroup(ClickedItem)
  semanticZoomRef.value?.ToggleActiveView({ Item: ClickedItem, OriginalSource })
}

onMounted(async () => {
  try {
    const response = await fetch(controlInfoDataUrl)
    if (!response.ok) return
    const data = await response.json() as { Groups?: ControlInfoGroup[] }
    if (Array.isArray(data.Groups) && data.Groups.length > 0) {
      Groups.value = data.Groups.map(group => ({
        ...group,
        Title: localizeGroupTitle(group.Title),
        Items: Array.isArray(group.Items) ? group.Items.map(localizeItem) : []
      }))
    }
  } catch {
    // Keep the localized fallback when the official remote data is unavailable.
  }
})

const simpleSemanticZoomCode = `<WinSemanticZoom ref="semanticZoomRef" Height="500">
  <template #zoomedInView>
    <WinScrollViewer
      VerticalScrollMode="Auto"
      VerticalScrollBarVisibility="Auto"
      HorizontalScrollMode="Disabled"
      HorizontalScrollBarVisibility="Disabled">
      <WinGridView
        :ItemsSource="Groups"
        SelectionMode="None">
        <template #groupHeader="{ group }">
          <WinTextBlock :Text="group.Title" FontSize="20" FontWeight="Normal" />
        </template>
        <template #item="{ item }">
          <WinStackPanel MinWidth="200" Margin="12,6,12,6">
            <WinTextBlock :Text="item.Title" FontSize="14" FontWeight="SemiBold" />
            <WinTextBlock Width="300" :Text="item.Subtitle" FontSize="14" FontWeight="Normal" TextWrapping="Wrap" />
          </WinStackPanel>
        </template>
      </WinGridView>
    </WinScrollViewer>
  </template>

  <template #zoomedOutView>
    <WinListView
      :ItemsSource="Groups"
      :IsItemClickEnabled="true"
      SelectionMode="None"
      @ItemClick="onZoomedOutGroupClick">
      <template #item="{ item }">
        <WinTextBlock :Text="item.Title" TextWrapping="Wrap" />
      </template>
    </WinListView>
  </template>
</WinSemanticZoom>`
</script>

<style scoped>
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); }
.semantic-view-scroll { width: 100%; height: 100%; }
.gallery-item-page :deep(.zoomed-in-grid) { width: 100%; }
.gallery-item-page :deep(.zoomed-in-grid .win-grid-item) { border-width: 0; }
.gallery-item-page :deep(.zoomed-in-group-title),
.gallery-item-page :deep(.zoomed-out-group-title) {
  color: var(--text-primary);
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  font-size: 20px;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0;
}
.gallery-item-page :deep(.zoomed-in-item) { min-width: 200px; }
.gallery-item-page :deep(.zoomed-in-title) { color: var(--text-primary); font-size: 14px; font-weight: 600; line-height: 20px; }
.gallery-item-page :deep(.zoomed-in-subtitle) { color: var(--text-primary); font-size: 14px; font-weight: 400; line-height: 20px; }
.gallery-item-page :deep(.zoomed-out-list) { width: 100%; min-width: 88px; height: 100%; overflow: hidden; animation: none; }
.gallery-item-page :deep(.zoomed-out-list .win-list-item) { min-width: 88px; min-height: 40px; padding: 0 12px; gap: 0; border-radius: 0; }
.gallery-item-page :deep(.zoomed-out-list .win-list-item.clickEnabled:hover) { background: transparent; }
.gallery-item-page :deep(.zoomed-out-list .list-indicator) { display: none; }
</style>
