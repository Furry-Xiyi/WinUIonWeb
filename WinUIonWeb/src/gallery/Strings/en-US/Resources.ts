import catalogResources from './CatalogResources';
import systemBackdropElementResources from './SystemBackdropElementResources';
import systemBackdropResources from './SystemBackdropResources';
import titleBarResources from './TitleBarResources';

export default {
  ...titleBarResources,
  ...systemBackdropElementResources,
  ...systemBackdropResources,
  "text.tabview": "TabView",
  "sample.tabview.multiple-views": "Show multiple views for an app",
  "sample.tabview.adding-header": "A TabView with support for adding, closing, and rearranging tabs",
  "sample.tabview.markup-header": "A TabView with TabViewItems defined in markup",
  "sample.tabview.binding-header": "A TabView bound to a collection of MyData objects",
  "sample.tabview.keyboard-header": "A TabView with keyboarding support",
  "sample.tabview.custom-header": "You can put custom content in TabStripHeader and TabStripFooter",
  "sample.tabview.width-header": "Tab widths can either be equally sized, sized to the content of the tab, or sized to only show the icon when unselected",
  "sample.tabview.close-header": "The close button can be persistent or only visible on hover",
  "sample.tabview.color-header": "TabView with color tab icons",
  "sample.tabview.accent-header": "A TabView with accent colored TabStrip background",
  "sample.tabview.window-header": "Complete TabView windowing sample",
  "sample.tabview.window-title": "TabView application window",
  "sample.tabview.document": "Document {index}",
  "sample.tabview.mydata-document": "MyData Doc {index}",
  "sample.tabview.keyboard-new": "- Ctrl+T opens a new tab",
  "sample.tabview.keyboard-close": "- Ctrl+W closes the selected tab",
  "sample.tabview.keyboard-number": "- Ctrl+1 to Ctrl+8 selects that number tab",
  "sample.tabview.keyboard-last": "- Ctrl+9 selects the last tab (regardless of the number of tabs)",
  "sample.tabview.custom-description": "You can put any content in the TabStripHeader and TabStripFooter areas",
  "sample.tabview.custom-drag-region": "If your TabView is used inside the app's titlebar area, use the TabStripFooter to specify a custom drag region",
  "sample.tabview.window-source-description": "See TabViewWindowingSamplePage.xaml and *.cs files to see the complete code",
  "sample.tabview.strip-header": "TabStripHeader Content",
  "sample.tabview.strip-footer": "TabStripFooter Content",
  "sample.tabview.home": "Home",
  "sample.tabview.long-tab": "Tab 2 Has Longer Text",
  "sample.tabview.third-tab": "Third Tab",
  "sample.tabview.width-option-header": "TabWidthBehavior",
  "sample.tabview.close-option-header": "TabViewItem CloseButtonOverlayMode",
  "sample.tabview.size-to-content": "SizeToContent",
  "sample.tabview.equal": "Equal",
  "sample.tabview.compact": "Compact",
  "sample.tabview.auto": "Auto",
  "sample.tabview.always": "Always",
  "sample.tabview.on-hover": "OnHover",
  "sample.tabview.color-description": "Use BitmapIcon.ShowAsMonochrome=\"False\" to display full color icons in the TabViewItem",
  "sample.tabview.command-prompt": "CMD Prompt",
  "sample.tabview.powershell": "PowerShell",
  "sample.tabview.linux": "Windows Subsystem for Linux",
  "sample.tabview.launch": "Click here to launch the sample",
  "sample.tabview.move-left": "Move tab left",
  "sample.tabview.move-right": "Move tab right",
  "sample.tabview.none": "None",
  "sample.tabview.selection-output": "Tabs: {count}\nSelectedIndex: {index}\nSelectedItem: {header}",
  "sample.tabview.window-item": "Item {index}",
  "sample.tabview.window-page": "Page {index}",
  "sample.tabview.window-new-item": "New Item",
  "sample.tabview.window-drag-description": "Drag the tab out of the tab strip and drop it in the application's content area to open a new window. Drop a tab onto another application window's tab strip to move it into that window.",
  "sample.tabview.window-state-description": "Notice that the state of the Tab is maintained in the new window. For example, if you toggle the ToggleSwitch ON, it will remain ON in the new window.",
  "sample.tabview.window-progress-header": "Turn on ProgressRing",
  "sample.tabview.window-opened": "Window opened: {id}",
  "sample.tabview.window-host-unavailable": "A window host is not connected.",
  "sample.tabview.window-cancelled": "The window operation was cancelled.",
  "sample.tabview.window-failed": "The window operation failed.",
  "sample.tabview.window-mode-browser": "browser window",
  "sample.tabview.window-mode-standalone": "standalone application window",
  "sample.tabview.window-mode-minimal-ui": "application window with minimal browser controls",
  "sample.tabview.window-mode-fullscreen": "full-screen window",
  "sample.tabview.window-mode-window-controls-overlay": "application window with overlaid window controls",
  "sample.tabview.window-mode-none": "not yet verified",
  "sample.tabview.window-supported": "supported",
  "sample.tabview.window-not-supported": "not supported",
  "sample.tabview.window-not-verified": "not yet verified",
  "sample.tabview.window-display-mode": "Actual display mode: {mode}",
  "sample.tabview.window-connection-status": "Window connection: {status}",
  "sample.tabview.window-status-NotRequested": "not requested",
  "sample.tabview.window-status-Opening": "waiting for the window to mount",
  "sample.tabview.window-status-Ready": "connected",
  "sample.tabview.window-status-Blocked": "blocked by the browser",
  "sample.tabview.window-status-Cancelled": "cancelled",
  "sample.tabview.window-status-Failed": "failed",
  "sample.tabview.window-status-Unavailable": "disconnected or no longer available",
  "sample.tabview.window-transfer-capability": "Confirmed application tab transfer: {support}",
  "sample.tabview.window-split-capability": "Application pane splitting: {support}",
  "sample.tabview.window-native-drag-capability": "Tab dragging between application windows: {support}",
  "sample.tabview.window-native-capability": "Native browser tab tear-out and splitting: {support}",
  "sample.tabview.window-capability-custom-host": "Window and pane capabilities are provided by the application's framework host.",
  "sample.tabview.window-blocked": "The browser blocked the new window. Allow pop-ups for this application and try again.",
  "sample.tabview.window-unavailable": "The destination window did not become ready or is no longer available. The source tabs were retained.",
  "sample.tabview.window-invalid-documents": "The transfer requires serializable application documents.",
  "sample.tabview.window-connected": "Transferred {count} tabs to a connected {mode}.",
  "sample.tabview.window-transferred": "Transferred {header} to a connected {mode}; its document state was retained.",
  "sample.tabview.window-drag-transferred": "Moved {count} tabs into this window; their document state was retained.",
  "sample.tabview.sample-title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  "sample.tabview.sample-body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "sample.tabview.sample-body-long": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "text.a-simple-text-editor-with-richeditbox": "A simple text editor with RichEditBox.",
  "TextControls.RichEditBox.NewDocument": "New Document",
  ...catalogResources,
  "TextControls.RichEditBox.SimpleHeader": "A simple text editor with RichEditBox.",
  "TextControls.AutoSuggestBox.Label1": "Basic AutoSuggestBox",
  "TextControls.NumberBox.Label1": "1 + 2^2",
  "TextControls.NumberBox.Label2": "NumberBox with spin button",
  "TextControls.NumberBox.Label3": "0.00",
  "TextControls.PasswordBox.Label1": "Simple PasswordBox",
  "TextControls.PasswordBox.Label2": "Sample password box",
  "TextControls.RichEditBox.Label1": "simple text editor",
  "TextControls.RichEditBox.Label2": "editor with custom menu",
  "TextControls.RichEditBox.Label3": "It uses ",
  "TextControls.RichEditBox.Label4": "Unicode Nearly Plain-Text Encoding of Mathematics",
  "TextControls.RichEditBox.Label5": ", which allows mathematical notation to be represented in a linear format and automatically converted into proper math equations.",
  "TextControls.RichEditBox.Label6": "Enabling math mode in a RichEditBox automatically switches the input font to Cambria Math. Additionally, toggling math mode clears any existing content and undo stack.",
  "TextControls.RichEditBox.Label7": "The ",
  "TextControls.RichEditBox.Label8": "SetMathML",
  "TextControls.RichEditBox.Label9": " method takes a ",
  "TextControls.RichEditBox.Label10": "MathML",
  "TextControls.RichEditBox.Label11": " string and displays the equation in the ",
  "TextControls.RichEditBox.Label12": ". It replaces any existing equation with the new one.",
  "TextControls.RichEditBox.Label13": "The ",
  "TextControls.RichEditBox.Label14": "GetMathML",
  "TextControls.RichEditBox.Label15": " method retrieves the MathML string of the equation from the ",
  "TextControls.RichEditBox.Label16": ". However, it only works if the equation is in a single line. If the text spans multiple lines, it returns an empty string, but the equation will still be rendered correctly.",
  "TextControls.RichEditBox.Label17": "Setting the math mode in the ",
  "TextControls.RichEditBox.Label18": " is necessary to use these methods. it can be enabled using ",
  "TextControls.RichEditBox.Label19": "SetMathMode(RichEditMathMode.MathOnly)",
  "TextControls.RichEditBox.Label20": ".",
  "TextControls.RichEditBox.Label21": "SetMathML",
  "TextControls.RichEditBox.Label22": " and ",
  "TextControls.RichEditBox.Label23": "GetMathML",
  "TextControls.RichEditBox.Label24": " can be used to restore and save equations.",
  "TextControls.RichTextBlock.Label1": ", ",
  "TextControls.RichTextBlock.Label2": ", inline images, and other rich content.",
  "TextControls.RichTextBlock.Label3": "Duis sed nulla metus, id hendrerit velit. Curabitur dolor purus, bibendum eu cursus lacinia, interdum vel augue. Aenean euismod eros et sapien vehicula dictum. Duis ullamcorper, turpis nec feugiat tincidunt, dui erat luctus risus, aliquam accumsan lacus est vel quam. Nunc lacus massa, varius eget accumsan id, congue sed orci. Duis dignissim hendrerit egestas. Proin ut turpis magna, sit amet porta erat. Nunc semper metus nec magna imperdiet nec vestibulum dui fringilla. Sed sed ante libero, nec porttitor mi. Ut luctus, neque vitae placerat egestas, urna leo auctor magna, sit amet ultricies ipsum felis quis sapien. Proin eleifend varius dui, at vestibulum nunc consectetur nec. Mauris nulla elit, ultrices a sodales non, aliquam ac est. Quisque sit amet risus nulla. Quisque vestibulum posuere velit, vitae vestibulum eros scelerisque sit amet. In in risus est, at laoreet dolor. Nullam aliquet pellentesque convallis. Ut vel tincidunt nulla. Mauris auctor tincidunt auctor. Aenean orci ante, vulputate ac sagittis sit amet, consequat at mi. Morbi elementum purus consectetur nisi adipiscing vitae blandit sapien placerat. Aliquam adipiscing tortor non sem lobortis consectetur mattis felis rhoncus. Nunc eu nunc rhoncus arcu sollicitudin ultrices. In vulputate eros in mauris aliquam id dignissim nisl laoreet.",
  "TextControls.RichTextBlock.Label4": "firstOverflowContainer",
  "TextControls.RichTextBlock.Label5": "secondOverflowContainer",
  "TextControls.RichTextBlock.Label6": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
  "TextControls.TextBlock.Label1": ", ",
  "TextControls.TextBlock.Label2": ", or ",
  "TextControls.TextBlock.Label3": ".",
  "TextControls.TextBox.Label1": "simple TextBox",
  "TextControls.TextBox.Label2": "customized TextBox",
  "TextControls.TextBox.Label3": "multi-line TextBox",
  "TextControls.CatBreeds": "Abyssinian|Aegean|American Bobtail|American Curl|American Ringtail|American Shorthair|American Wirehair|Aphrodite Giant|Arabian Mau|Asian cat|Asian Semi-longhair|Australian Mist|Balinese|Bambino|Bengal|Birman|Brazilian Shorthair|British Longhair|British Shorthair|Burmese|Burmilla|California Spangled|Chantilly-Tiffany|Chartreux|Chausie|Colorpoint Shorthair|Cornish Rex|Cymric|Cyprus|Devon Rex|Donskoy|Dragon Li|Dwelf|Egyptian Mau|European Shorthair|Exotic Shorthair|Foldex|German Rex|Havana Brown|Highlander|Himalayan|Japanese Bobtail|Javanese|Kanaani|Khao Manee|Kinkalow|Korat|Korean Bobtail|Korn Ja|Kurilian Bobtail|Lambkin|LaPerm|Lykoi|Maine Coon|Manx|Mekong Bobtail|Minskin|Napoleon|Munchkin|Nebelung|Norwegian Forest Cat|Ocicat|Ojos Azules|Oregon Rex|Persian (modern)|Persian (traditional)|Peterbald|Pixie-bob|Ragamuffin|Ragdoll|Raas|Russian Blue|Russian White|Sam Sawet|Savannah|Scottish Fold|Selkirk Rex|Serengeti|Serrade Petit|Siamese|Siberian or´Siberian Forest Cat|Singapura|Snowshoe|Sokoke|Somali|Sphynx|Suphalak|Thai|Thai Lilac|Tonkinese|Toyger|Turkish Angora|Turkish Van|Turkish Vankedisi|Ukrainian Levkoy|Wila Krungthep|York Chocolate",
  "TextControls.NoMathML": "<!-- No MathML content -->",
  "TextControls.Strikethrough": "Strikethrough",
  "TextControls.Control.XamlResources": "Reusable definitions for shared values to ensure consistency and maintainability.",
  "TextControls.Control.XamlStyles": "A XAML style is a Reusable property settings to define consistent UI design elements.",
  "TextControls.Control.Binding": "Connecting UI elements to data for automatic synchronization and updates.",
  "TextControls.Control.Templates": "Customize controls' visuals, item layouts, and data presentation in XAML.",
  "TextControls.Control.CustomUserControls": "Create reusable UI components with custom functionality and appearance.",
  "TextControls.Control.CustomXamlConditionals": "Define custom XAML conditions evaluated at parse time using IXamlCondition.",
  "TextControls.Control.ScratchPad": "Scratch pad for testing simple XAML markup",
  "TextControls.Control.Color": "Balanced color design creates clarity and aesthetic harmony.",
  "TextControls.Control.Geometry": "Clear geometric design ensures visual coherence and structure.",
  "TextControls.Control.Iconography": "Icons are a visual design language that can be used to communicate information quickly and effectively.",
  "TextControls.Control.Spacing": "Thoughtful spacing design enhances readability and flow.",
  "TextControls.Control.Typography": "Typography design guides attention with intuitive fonts and hierarchy.",
  "TextControls.Control.AccessibilityColorContrast": "High contrast design ensures accessibility for all users.",
  "TextControls.Control.AccessibilityKeyboard": "Keyboard-friendly design enables seamless interactions.",
  "TextControls.Control.AccessibilityScreenReader": "Inclusive design ensures meaningful content for assistive technologies.",
  "TextControls.Control.AppBarButton": "A button that's styled for use in a CommandBar.",
  "TextControls.Control.AppBarSeparator": "A vertical line that's used to visually separate groups of commands in an app bar.",
  "TextControls.Control.AppBarToggleButton": "A button that can be on, off, or indeterminate like a CheckBox, and is styled for use in an app bar or other specialized UI.",
  "TextControls.Control.CommandBar": "A toolbar for displaying application-specific commands that handles layout and resizing of its contents.",
  "TextControls.Control.CommandBarFlyout": "A mini-toolbar displaying proactive commands, and an optional menu of commands.",
  "TextControls.Control.MenuBar": "A classic menu, allowing the display of MenuItems containing MenuFlyoutItems.",
  "TextControls.Control.MenuFlyout": "Shows a contextual list of simple commands or options.",
  "TextControls.Control.SwipeControl": "Touch gesture for quick menu actions on items.",
  "TextControls.Control.StandardUICommand": "A StandardUICommand is a built-in 'XamlUICommand' which represents a commonly used command, e.g. 'Save'.",
  "TextControls.Control.XamlUICommand": "An object which is used to define the look and feel of a given command.",
  "TextControls.Control.FlipView": "Presents a collection of items that the user can flip through, one item at a time.",
  "TextControls.Control.GridView": "A control that presents a collection of items in rows and columns.",
  "TextControls.Control.ItemsRepeater": "A flexible, primitive control for data-driven layouts.",
  "TextControls.Control.ItemsView": "A control that presents a collection of items using various layouts.",
  "TextControls.Control.ListView": "A control that presents a collection of items in a vertical list.",
  "TextControls.Control.PullToRefresh": "Provides the ability to pull on a collection of items in a list/grid to refresh the contents of the collection.",
  "TextControls.Control.TreeView": "The  TreeView control is a hierarchical list pattern with expanding and collapsing nodes that contain nested items.",
  "TextControls.Control.CalendarDatePicker": "A control that lets users pick a date value using a calendar.",
  "TextControls.Control.CalendarView": "A control that presents a calendar for a user to choose a date from.",
  "TextControls.Control.DatePicker": "A control that lets a user pick a date value.",
  "TextControls.Control.TimePicker": "A configurable control that lets a user pick a time value.",
  "TextControls.Control.Button": "A control that responds to user input and raises a Click event.",
  "TextControls.Control.DropDownButton": "A button that displays a flyout of choices when clicked.",
  "TextControls.Control.HyperlinkButton": "A button that appears as hyperlink text, and can navigate to a URI or handle a Click event.",
  "TextControls.Control.RepeatButton": "A button that raises its Click event repeatedly from the time it's pressed until it's released.",
  "TextControls.Control.ToggleButton": "A button that can be switched between two states like a CheckBox.",
  "TextControls.Control.SplitButton": "A two-part button that displays a flyout when its secondary part is clicked.",
  "TextControls.Control.ToggleSplitButton": "A version of the SplitButton where the activation target toggles on/off.",
  "TextControls.Control.CheckBox": "A control that a user can select or clear.",
  "TextControls.Control.ColorPicker": "A control that displays a selectable color spectrum.",
  "TextControls.Control.ComboBox": "A drop-down list of items a user can select from.",
  "TextControls.Control.RadioButton": "A control that allows a user to select a single option from a group of options.",
  "TextControls.Control.RatingControl": "Rate something 1 to 5 stars.",
  "TextControls.Control.Slider": "A control that lets the user select from a range of values by moving a Thumb control along a track.",
  "TextControls.Control.ToggleSwitch": "A switch that can be toggled between 2 states.",
  "TextControls.Control.InfoBadge": "An non-intrusive UI to display notifications or bring focus to an area.",
  "TextControls.Control.InfoBar": "An inline message to display app-wide status change information.",
  "TextControls.Control.ProgressBar": "Shows the apps progress on a task, or that the app is performing ongoing work that doesn't block user interaction.",
  "TextControls.Control.ProgressRing": "Shows the apps progress on a task, or that the app is performing ongoing work that does block user interaction.",
  "TextControls.Control.ToolTip": "Displays information for an element in a pop-up window.",
  "TextControls.Control.ContentDialog": "A dialog box that can be customized to contain any XAML content.",
  "TextControls.Control.Flyout": "Shows contextual information and enables user interaction.",
  "TextControls.Control.Popup": "A UI element displaying temporary content over existing interface.",
  "TextControls.Control.TeachingTip": "A content-rich flyout for guiding users and enabling teaching moments.",
  "TextControls.Control.AnnotatedScrollBar": "A control that extends a regular vertical scrollbar's functionality for an easy navigation through large collections.",
  "TextControls.Control.PipsPager": "A control to let the user navigate through a paginated collection when the page numbers do not need to be visually known.",
  "TextControls.Control.ScrollView": "A container control that lets the user pan and zoom its content.",
  "TextControls.Control.ScrollViewer": "A container control that lets the user pan and zoom its content.",
  "TextControls.Control.SemanticZoom": "Lets the user zoom between two different views of a collection, making it easier to navigate through large collections of items.",
  "TextControls.Control.Border": "A container control that draws a boundary line, background, or both, around another object.",
  "TextControls.Control.Canvas": "A layout panel that supports absolute positioning of child elements relative to the top left corner of the canvas.",
  "TextControls.Control.Expander": "A container with a header that can be expanded to show a body with more content.",
  "TextControls.Control.Grid": "A layout panel that supports arranging child elements in rows and columns. ",
  "TextControls.Control.RelativePanel": "A panel that uses relationships between elements to define layout.",
  "TextControls.Control.SplitView": "A container that has 2 content areas, with multiple display options for the pane.",
  "TextControls.Control.StackPanel": "A layout panel that arranges child elements into a single line that can be oriented horizontally or vertically.",
  "TextControls.Control.VariableSizedWrapGrid": "A layout panel that supports arranging child elements in rows and columns. Each child element can span multiple rows and columns.",
  "TextControls.Control.Viewbox": "A container control that scales its content to a specified size.",
  "TextControls.Control.BreadcrumbBar": "Shows the trail of navigation taken to the current location.",
  "TextControls.Control.NavigationView": "Common vertical layout for top-level areas of your app via a collapsible navigation menu.",
  "TextControls.Control.Pivot": "Presents information from different sources in a tabbed view.",
  "TextControls.Control.SelectorBar": "Presents information from a small set of different sources. The user can pick one of them.",
  "TextControls.Control.TabView": "A control that displays a collection of tabs that can be used to display several documents.",
  "TextControls.Control.AnimatedVisualPlayer": "An element to render and control playback of motion graphics.",
  "TextControls.Control.CaptureElementPreview": "A sample for doing a camera preview.",
  "TextControls.Control.Image": "A control to display image content.",
  "TextControls.Control.MapControl": "Displays a symbolic map of the Earth.",
  "TextControls.Control.MediaPlayerElement": "A control to display video and image content.",
  "TextControls.Control.PersonPicture": "Displays the picture of a person/contact.",
  "TextControls.Control.Sound": "A code-behind only API that enables 2D and 3D UI sounds on all XAML controls.",
  "TextControls.Control.WebView2": "A Microsoft Edge (Chromium) based control that hosts HTML content in an app.",
  "TextControls.Control.Acrylic": "A translucent material recommended for panel backgrounds.",
  "TextControls.Control.AnimatedIcon": "An element that displays and controls an icon that animates when the user interacts with the control.",
  "TextControls.Control.CompactSizing": "How to use a Resource Dictionary to enable compact sizing.",
  "TextControls.Control.IconElement": "Represents icon controls that use different image types as its content.",
  "TextControls.Control.Line": "Draws a straight line between two points.",
  "TextControls.Control.Shape": "How to draw shapes, such as ellipses, rectangles, and polygons.",
  "TextControls.Control.RadialGradientBrush": "A brush to show radial gradients.",
  "TextControls.Control.SystemBackdrops": "System backdrops, like Mica and Acrylic, for app windows.",
  "TextControls.Control.SystemBackdropElement": "An element to host system backdrop materials.",
  "TextControls.Control.ThemeShadow": "Adds a depth-aware shadow to UI elements using system lighting.",
  "TextControls.Control.AutoSuggestBox": "A control to provide suggestions as a user is typing.",
  "TextControls.Control.NumberBox": "A text control used for numeric input and evaluation of algebraic equations.",
  "TextControls.Control.PasswordBox": "A control for entering passwords.",
  "TextControls.Control.RichEditBox": "A rich text editing control that supports formatted text, hyperlinks, and other rich content.",
  "TextControls.Control.RichTextBlock": "A control that displays formatted text, hyperlinks, inline images, and other rich content.",
  "TextControls.Control.TextBlock": "A lightweight control for displaying small amounts of text.",
  "TextControls.Control.TextBox": "A single-line or multi-line plain text field.",
  "TextControls.Control.XamlCompInterop": "XAML and Composition interop allows you to animate elements using expressions, natural animations, and more.",
  "TextControls.Control.ConnectedAnimation": "Connected animations continue elements during page navigation and help the user maintain their context between views.",
  "TextControls.Control.EasingFunction": "Easing is a way to manipulate the velocity of an object as it animates.",
  "TextControls.Control.ImplicitTransition": "Use Implicit Transitions to automatically animate changes to properties.",
  "TextControls.Control.PageTransition": "Page transitions provide visual feedback about the relationship between pages.",
  "TextControls.Control.ThemeTransition": "Theme transitions are pre-packaged, easy-to-apply animations.",
  "TextControls.Control.ParallaxView": "A container control that provides the parallax effect when scrolling.",
  "TextControls.Control.AppWindow": "A flexible, customizable window management system for app development.",
  "TextControls.Control.AppWindowTitleBar": "Provides control over the app window title bar.",
  "TextControls.Control.CreateMultipleWindows": "An example showing the creation of single-threaded top level Xaml windows.",
  "TextControls.Control.TitleBar": "An example showing how to use the default TitleBar control.",
  "TextControls.Control.Clipboard": "Copy and paste text, images, and files to and from the system Clipboard.",
  "TextControls.Control.ContentIsland": "Create ContentIslands to host other frameworks in your app.",
  "TextControls.Control.StoragePickers": "Select files and folders with modern system pickers.",
  "TextControls.Control.AppNotification": "Send notifications that appear in the Action Center and as toast popups.",
  "TextControls.Control.BadgeNotificationManager": "Show numeric or icon badges on your app’s taskbar icon.",
  "TextControls.Control.JumpList": "Add custom tasks and groups to the app's taskbar jump list.",
  "ButtonMigration_ShowWindow": "Show window",
  "ButtonMigration_Submit": "Submit",
  "ButtonMigration_Accept": "Accept",
  "ButtonMigration_GeometryBody": "Body",
  "sample.listbox.selected-color": "Selected color: {color}",
  "app.shortTitle": "WinUI on Web Gallery",
  "app.title": "WinUI on Web Gallery",
  "app.version": "1.0.0-Insider",
  "app.author": "惜忆想睡觉",
  "search.placeholder": "Search controls and samples...",
  "search.no-results": "No results match your search.",
  "text.submit-query": "Submit search",
  "text.no-results-found": "No results found",
  "gallery.page-header.api-details": "API details",
  "gallery.page-header.api-tooltip": "API namespace and inheritance",
  "gallery.page-header.documentation": "Documentation",
  "gallery.page-header.source": "Source",
  "gallery.page-header.source-code": "Source code",
  "gallery.page-header.source-code-tooltip": "Source code of this sample page",
  "gallery.page-header.control-source": "Control source code",
  "gallery.page-header.sample-page-source": "Sample page source code",
  "gallery.page-header.toggle-theme": "Toggle theme",
  "gallery.page-header.copy-link": "Copy link",
  "gallery.page-header.favorite": "Favorite sample",
  "gallery.page-header.namespace": "Namespace",
  "gallery.page-header.inheritance": "Inheritance",
  "gallery.page-header.this-control": "this control",
  "gallery.page-header.this-sample-page": "this sample page",
  "gallery.page-header.source-code-of": "Source code of",
  "text.a-2-state-checkbox": "A 2-state CheckBox",
  "text.a-basic-autosuggestbox": "A basic AutoSuggestBox",
  "text.a-basic-calendar-view": "A basic calendar view.",
  "sample.calendarview.is-group-label-visible": "IsGroupLabelVisible",
  "sample.calendarview.is-out-of-scope-enabled": "IsOutOfScopeEnabled",
  "sample.calendarview.selection-mode": "SelectionMode",
  "sample.calendarview.calendar-identifier": "CalendarIdentifier",
  "sample.calendarview.language": "Language",
  "sample.calendarview.selection.None": "None",
  "sample.calendarview.selection.Single": "Single",
  "sample.calendarview.selection.Multiple": "Multiple",
  "sample.calendarview.calendar.GregorianCalendar": "GregorianCalendar",
  "sample.calendarview.calendar.HebrewCalendar": "HebrewCalendar",
  "sample.calendarview.calendar.HijriCalendar": "HijriCalendar",
  "sample.calendarview.calendar.JapaneseCalendar": "JapaneseCalendar",
  "sample.calendarview.calendar.JulianCalendar": "JulianCalendar",
  "sample.calendarview.calendar.KoreanCalendar": "KoreanCalendar",
  "sample.calendarview.calendar.PersianCalendar": "PersianCalendar",
  "sample.calendarview.calendar.TaiwanCalendar": "TaiwanCalendar",
  "sample.calendarview.calendar.ThaiCalendar": "ThaiCalendar",
  "sample.calendarview.calendar.UmAlQuraCalendar": "UmAlQuraCalendar",
  "sample.calendarview.language.en": "English",
  "sample.calendarview.language.ar": "Arabic",
  "sample.calendarview.language.af": "Afrikaans",
  "sample.calendarview.language.sq": "Albanian",
  "sample.calendarview.language.am": "Amharic",
  "sample.calendarview.language.hy": "Armenian",
  "sample.calendarview.language.as": "Assamese",
  "sample.calendarview.language.az": "Azerbaijani",
  "sample.calendarview.language.eu": "Basque",
  "sample.calendarview.language.be": "Belarusian",
  "sample.calendarview.language.bn": "Bangla",
  "sample.calendarview.language.bs": "Bosnian",
  "sample.calendarview.language.bg": "Bulgarian",
  "sample.calendarview.language.ca": "Catalan",
  "sample.calendarview.language.zh": "Chinese (Simplified)",
  "sample.calendarview.language.hr": "Croatian",
  "sample.calendarview.language.cs": "Czech",
  "sample.calendarview.language.da": "Danish",
  "sample.calendarview.language.prs": "Dari",
  "sample.calendarview.language.nl": "Dutch",
  "sample.calendarview.language.et": "Estonian",
  "sample.calendarview.language.fil": "Filipino",
  "sample.calendarview.language.fi": "Finnish",
  "sample.calendarview.language.fr": "French",
  "sample.calendarview.language.gl": "Galician",
  "sample.calendarview.language.ka": "Georgian",
  "sample.calendarview.language.de": "German",
  "sample.calendarview.language.el": "Greek",
  "sample.calendarview.language.gu": "Gujarati",
  "sample.calendarview.language.ha": "Hausa",
  "sample.calendarview.language.he": "Hebrew",
  "sample.calendarview.language.hi": "Hindi",
  "sample.calendarview.language.hu": "Hungarian",
  "sample.calendarview.language.is": "Icelandic",
  "sample.calendarview.language.id": "Indonesian",
  "sample.calendarview.language.ga": "Irish",
  "sample.calendarview.language.xh": "isiXhosa",
  "sample.calendarview.language.zu": "isiZulu",
  "sample.calendarview.language.it": "Italian",
  "sample.calendarview.language.ja": "Japanese",
  "sample.calendarview.language.kn": "Kannada",
  "sample.calendarview.language.kk": "Kazakh",
  "sample.calendarview.language.km": "Khmer",
  "sample.calendarview.language.rw": "Kinyarwanda",
  "sample.calendarview.language.sw": "KiSwahili",
  "sample.calendarview.language.kok": "Konkani",
  "sample.calendarview.language.ko": "Korean",
  "sample.calendarview.language.lo": "Lao",
  "sample.calendarview.language.lv": "Latvian",
  "sample.calendarview.language.lt": "Lithuanian",
  "sample.calendarview.language.lb": "Luxembourgish",
  "sample.calendarview.language.mk": "Macedonian",
  "sample.calendarview.language.ms": "Malay",
  "sample.calendarview.language.ml": "Malayalam",
  "sample.calendarview.language.mt": "Maltese",
  "sample.calendarview.language.mi": "Maori",
  "sample.calendarview.language.mr": "Marathi",
  "sample.calendarview.language.ne": "Nepali",
  "sample.calendarview.language.nb": "Norwegian",
  "sample.calendarview.language.or": "Odia",
  "sample.calendarview.language.fa": "Persian",
  "sample.calendarview.language.pl": "Polish",
  "sample.calendarview.language.pt": "Portuguese",
  "sample.calendarview.language.pa": "Punjabi",
  "sample.calendarview.language.quz": "Quechua",
  "sample.calendarview.language.ro": "Romanian",
  "sample.calendarview.language.ru": "Russian",
  "sample.calendarview.language.sr": "Serbian (Latin)",
  "sample.calendarview.language.nso": "Sesotho sa Leboa",
  "sample.calendarview.language.tn": "Setswana",
  "sample.calendarview.language.si": "Sinhala",
  "sample.calendarview.language.sk": "Slovak",
  "sample.calendarview.language.sl": "Slovenian",
  "sample.calendarview.language.es": "Spanish",
  "sample.calendarview.language.sv": "Swedish",
  "sample.calendarview.language.ta": "Tamil",
  "sample.calendarview.language.te": "Telugu",
  "sample.calendarview.language.th": "Thai",
  "sample.calendarview.language.ti": "Tigrinya",
  "sample.calendarview.language.tr": "Turkish",
  "sample.calendarview.language.uk": "Ukrainian",
  "sample.calendarview.language.ur": "Urdu",
  "sample.calendarview.language.uz": "Uzbek (Latin)",
  "sample.calendarview.language.vi": "Vietnamese",
  "sample.calendarview.language.cy": "Welsh",
  "sample.calendarview.language.wo": "Wolof",
  "text.a-basic-content-dialog-with-content": "A basic content dialog with content.",
  "text.a-basic-splitview": "A basic SplitView",
  "text.a-button-that-appears-as-a-hyperlink": "A button that appears as a hyperlink.",
  "text.a-button-that-can-be-on-or-off": "A button that can be on or off.",
  "text.a-button-that-can-be-toggled-on-off-with-additio": "A button that can be toggled on/off with additional dropdown options.",
  "text.a-button-that-displays-a-flyout-of-choices-when": "A button that displays a flyout of choices when clicked.",
  "text.a-button-that-raises-its-click-event-repeatedly": "A button that raises its click event repeatedly while pressed.",
  "text.a-button-that-raises-its-click-event-repeatedly-ecf7f2": "A button that raises its Click event repeatedly from the time it's pressed until it's released.",
  "text.a-button-with-a-flyout": "A button with a flyout",
  "text.a-button-with-a-primary-action-and-a-secondary-m": "A button with a primary action and a secondary menu.",
  "text.a-collection-of-helper-functions-controls-and-ap": "A collection of helper functions, controls, and app services.",
  "text.a-combobox-with-inline-items": "A ComboBox with inline items.",
  "text.a-command-bar-with-labels-on-the-side-free-float": "A command bar with labels on the side free floating in a page",
  "text.a-container-that-allows-users-to-refresh-content": "A container that allows users to refresh content by pulling down from the top on touch devices.",
  "text.a-container-with-two-views-one-for-primary-conte": "A container with two views: one for primary content and one for navigation.",
  "text.a-container-with-two-views-one-view-for-the-main": "A container with two views; one view for the main content and another view that is typically used for navigation commands.",
  "text.a-contextual-command-bar-in-a-flyout": "A contextual command bar in a flyout.",
  "text.a-control-for-numeric-input": "A control for numeric input.",
  "text.a-control-for-password-input": "A control for password input.",
  "text.a-control-that-a-user-can-select-or-clear": "A control that a user can select or clear.",
  "text.a-control-that-allows-a-user-to-select-a-single": "A control that allows a user to select a single option from a group of options.",
  "text.a-control-that-lets-users-pick-a-color-from-a-sp": "A control that lets users pick a color from a spectrum, sliders, and text input.",
  "text.a-control-that-lets-users-pick-a-date-from-a-cal": "A control that lets users pick a date from a calendar.",
  "text.a-control-that-lets-users-pick-a-date-value": "A control that lets users pick a date value.",
  "text.a-control-that-lets-users-pick-a-time-value": "A control that lets users pick a time value.",
  "text.a-control-that-presents-a-collection-of-items-in": "A control that presents a collection of items in a vertical list.",
  "text.a-control-that-presents-an-inline-list-of-items": "A control that presents an inline list of items that the user can select from.",
  "text.a-control-that-presents-an-inline-list-of-select": "A control that presents an inline list of selectable items.",
  "text.a-control-that-responds-to-user-input-and-trigge": "A control that responds to user input and triggers an event.",
  "text.a-control-with-a-header-that-shows-or-hides-cont": "A control with a header that shows or hides content.",
  "text.a-dialog-that-can-contain-custom-ui-content": "A dialog that can contain custom UI content.",
  "text.a-dropdownbutton-is-a-button-that-displays-a-che": "A DropDownButton is a button that displays a chevron as a visual indicator that it has an attached flyout that contains more options. It has the same behavior as a standard Button with a flyout; only the appearance is different.",
  "text.a-flyout-displays-lightweight-ui-that-is-either": "A Flyout displays lightweight UI that is either information, or requires user interaction. Unlike a dialog, a Flyout can be light dismissed by clicking or tapping outside of it, pressing the device's back button, or pressing the 'Esc' key.",
  "text.a-flyout-like-control-used-to-deliver-contextual": "A flyout-like control used to deliver contextual information.",
  "text.a-flyout-that-displays-menu-commands": "A flyout that displays menu commands.",
  "text.a-group-of-radiobuttons": "A group of RadioButtons",
  "text.a-horizontal-menu-of-app-commands": "A horizontal menu of app commands.",
  "text.a-hyperlinkbutton-with-navigateuri": "A HyperlinkButton with NavigateUri.",
  "text.a-lightweight-popup-container": "A lightweight popup container.",
  "text.a-listview-displays-data-in-a-vertical-list-with": "A ListView displays data in a vertical list with selection support.",
  "text.a-menuflyout-attached-to-an-appbarbutton": "An AppBarButton with a MenuFlyout.",
  "text.a-menuflyout-displays-a-lightweight-menu-of-comm": "A MenuFlyout displays lightweight UI that is light dismissed by clicking or tapping off of it. Use it to let the user choose from a contextual list of simple commands or options.",
  "text.a-numberbox-that-evaluates-expressions": "A NumberBox that evaluates expressions",
  "text.a-passwordbox-is-a-text-input-box-that-conceals": "A PasswordBox is a text input box that conceals the characters typed into it for the purpose of privacy. A PasswordBox looks like a text box, except that it renders placeholder characters in place of the text that has been entered. You can configure the placeholder character.",
  "text.a-simple-button-with-text-content": "A simple Button with text content.",
  "text.a-simple-colorpicker": "A simple ColorPicker",
  "text.a-simple-datepicker-with-a-header": "A simple DatePicker with a header.",
  "text.a-simple-dropdownbutton-with-text-content": "A simple DropDownButton with text content",
  "text.a-simple-flipview-with-items-declared-inline": "A simple FlipView with items declared inline.",
  "text.a-simple-listbox": "A simple ListBox",
  "text.a-simple-menubar": "A simple MenuBar",
  "text.a-simple-passwordbox": "A simple PasswordBox",
  "text.a-simple-ratingcontrol": "A simple RatingControl",
  "text.a-simple-repeatbutton": "A simple RepeatButton",
  "text.a-simple-slider": "A simple Slider.",
  "text.a-simple-text-editor": "A simple text editor",
  "text.a-simple-textblock": "A simple TextBlock.",
  "text.a-simple-textbox": "A simple TextBox",
  "text.a-simple-timepicker": "A simple TimePicker.",
  "text.a-simple-togglesplitbutton": "A simple ToggleSplitButton",
  "text.a-simple-toggleswitch": "A simple ToggleSwitch.",
  "text.a-simple-treeview-with-drag-and-drop-enabled": "A simple TreeView with drag and drop enabled.",
  "text.a-splitbutton-for-color-picking": "A SplitButton for color picking.",
  "text.a-teaching-tip-is-a-notification-flyout-used-to": "A teaching tip is a notification flyout used to provide contextually relevant information. It supports rich content (including titles, subtitles, icons, images, and text) and can be configured for either explicit or light-dismiss.",
  "text.a-text-box-that-makes-suggestions-as-the-user-ty": "A text box that makes suggestions as the user types.",
  "text.a-toggleable-split-button": "A toggleable split button.",
  "text.a-togglebutton-looks-like-a-button-but-works-lik": "A ToggleButton looks like a Button, but works like a CheckBox. It typically has two states, checked (on) or unchecked (off), but can be indeterminate if the IsThreeState property is true. You can determine it's state by checking the IsChecked property.",
  "text.a-toolbar-for-commands": "A toolbar for commands.",
  "text.account": "Account",
  "text.acrylic": "Acrylic",
  "text.adam": "Adam",
  "text.add": "Add",
  "text.allows-users-to-view-and-set-ratings": "Allows users to view and set ratings.",
  "text.an-expander-with-text-in-the-header-and-content": "An Expander with text in the header and content.",
  "text.animatedvisualplayer": "AnimatedVisualPlayer",
  "text.animatedvisualplayer-description": "An element to render and control playback of motion graphics.",
  "text.animation-style-when-switching-pages": "Animation style when switching pages",
  "text.appearance": "Appearance",
  "text.arabic-ar-sa": "Arabic (ar-SA)",
  "text.arial": "Arial",
  "text.autosuggestbox": "AutoSuggestBox",
  "text.basic-input": "Basic Input",
  "text.border": "Border",
  "text.breadcrumbbar": "BreadcrumbBar",
  "text.breadcrumbbar-description": "The BreadcrumbBar control provides a common horizontal layout to display the trail of navigation taken to the current location. Resize to see the nodes crumble, starting at the root.",
  "text.basic-listview-with-selection-modes": "Basic ListView with Selection Modes",
  "text.blue": "Blue",
  "text.button": "Button",
  "text.calendar": "Calendar",
  "text.calendardatepicker": "CalendarDatePicker",
  "text.calendardatepicker-with-a-header-and-placeholder": "CalendarDatePicker with a header and placeholder text.",
  "text.calendarview": "CalendarView",
  "text.capture-element-camera": "Capture Element / Camera",
  "text.capture-element-camera-preview": "Capture Element / Camera Preview",
  "text.capture-element-description": "You can use a MediaPlayerElement control to show a camera preview with a MediaCapture object.",
  "text.captures-media-from-a-camera": "Captures media from a camera.",
  "text.checkbox": "CheckBox",
  "text.checkbox-controls-let-the-user-select-a-combinat": "CheckBox controls let the user select a combination of binary options. In contrast, RadioButton controls allow the user to select from mutually exclusive options. The indeterminate state is used to indicate that an option is set for some, but not all, child options. Don't allow users to set an indeterminate state directly to indicate a third option.",
  "text.chinese-zh-cn": "Chinese (zh-CN)",
  "text.choose-the-app-background-material": "Choose the app background material",
  "text.choose-your-app-color-mode": "Choose your app color mode",
  "text.click-and-hold": "Click and hold",
  "text.code-samples": "Code samples",
  "text.collections": "Collections",
  "text.colorpicker": "ColorPicker",
  "text.colors": "Colors",
  "text.combobox": "ComboBox",
  "text.comic-sans-ms": "Comic Sans MS",
  "sample.appbartogglebutton.state.true": "True",
  "sample.appbartogglebutton.state.false": "False",
  "sample.appbartogglebutton.state.indeterminate": "",
  "sample.commandbarflyout.resize": "Resize",
  "sample.commandbarflyout.move": "Move",
  "sample.commandbarflyout.mountain": "mountain",
  "text.commandbar": "CommandBar",
  "text.commandbar-subtitle": "A toolbar for displaying application-specific commands that handles layout and resizing of its contents.",
  "text.commandbarflyout": "CommandBarFlyout",
  "text.appbarbutton": "AppBarButton",
  "text.appbarbutton-description": "A button that's styled for use in a CommandBar.",
  "text.appbarseparator": "AppBarSeparator",
  "text.appbarseparator-description": "A vertical line that's used to visually separate groups of commands in an app bar.",
  "text.appbar-toggle-button": "AppBarToggleButton",
  "text.appbar-toggle-button-description": "A button that can be toggled on and off, styled for use in a CommandBar.",
  "text.community-toolkit": "Community Toolkit",
  "text.compactinline": "CompactInline",
  "text.compactoverlay": "CompactOverlay",
  "text.contentdialog": "ContentDialog",
  "text.courier-new": "Courier New",
  "text.dark": "Dark",
  "text.date-and-time": "Date and Time",
  "text.datepicker": "DatePicker",
  "text.default-style": "Default Style",
  "text.delete": "Delete",
  "text.design": "Design",
  "text.dialogs-and-flyouts": "Dialogs and Flyouts",
  "text.display-hierarchical-data": "Display hierarchical data.",
  "text.displays-a-collection-of-data-items": "Displays a collection of data items.",
  "text.displays-repeating-data": "Displays repeating data.",
  "text.displays-a-persons-picture": "Displays a person's picture.",
  "text.displays-an-image": "Displays an image.",
  "text.displays-content-on-top-of-existing-content": "Displays content on top of existing content.",
  "text.displays-content-on-top-of-existing-content-with": "Displays content on top of existing content, within the bounds of the app window. Use a Popup for temporarily displaying content that should appear above other UI.",
  "text.displays-read-only-text": "Displays read-only text.",
  "text.documents": "Documents",
  "text.down": "Down",
  "text.dropdownbutton": "DropDownButton",
  "text.edit": "Edit",
  "text.email": "Email",
  "text.empty-cart": "Empty cart",
  "text.english-en-us": "English (en-US)",
  "text.enter-an-expression": "Enter an expression:",
  "text.enter-rich-text": "Enter rich text",
  "text.eve": "Eve",
  "text.expander": "Expander",
  "text.explore-the-winui-on-web-source-code-and-reposit": "Explore the WinUI on Web source code and repository.",
  "text.extended": "Extended",
  "text.favorites": "Favorites",
  "text.file": "File",
  "text.find-samples-that-demonstrate-specific-tasks-fea": "Find samples that demonstrate specific tasks, features, and APIs.",
  "text.flipview": "FlipView",
  "text.flyout": "Flyout",
  "text.french-fr-fr": "French (fr-FR)",
  "text.georgia": "Georgia",
  "text.german-de-de": "German (de-DE)",
  "text.get-started-with-winui-and-explore-detailed-docu": "Get started with WinUI and explore detailed documentation.",
  "text.getting-started": "Getting started",
  "text.green": "Green",
  "text.gregoriancalendar": "GregorianCalendar",
  "text.gridview": "GridView",
  "text.itemsrepeater": "ItemsRepeater",
  "text.itemsview": "ItemsView",
  "text.guidelines-and-toolkits-for-creating-stunning-wi": "Guidelines and toolkits for creating stunning WinUI experiences.",
  "text.hebrew-he-il": "Hebrew (he-IL)",
  "text.hebrewcalendar": "HebrewCalendar",
  "text.help": "Help",
  "text.hijricalendar": "HijriCalendar",
  "text.home": "Home",
  "text.hyperlinkbutton": "HyperlinkButton",
  "text.i-am-a-textblock": "I am a TextBlock.",
  "text.image": "Image",
  "text.image-description": "You can use an Image control to show and scale images.",
  "text.infobadge": "InfoBadge",
  "text.infobar": "InfoBar",
  "text.inline": "Inline",
  "text.items-in-a-flexible-grid": "Items in a flexible grid.",
  "text.japanese-ja-jp": "Japanese (ja-JP)",
  "text.japanesecalendar": "JapaneseCalendar",
  "text.juliancalendar": "JulianCalendar",
  "text.koreancalendar": "KoreanCalendar",
  "text.layout": "Layout",
  "text.left": "Left",
  "text.lets-people-browse-images-or-other-items-one-at": "Lets people browse images or other items, one at a time.",
  "text.lets-the-user-pick-a-color": "Lets the user pick a color.",
  "text.lets-users-edit-rich-formatted-text": "Lets users edit rich formatted text.",
  "text.lets-users-enter-simple-text-input": "Lets users enter simple text input.",
  "text.lets-users-pick-one-item-from-a-list": "Lets users pick one item from a list.",
  "text.lets-users-select-from-a-range-of-values": "Lets users select from a range of values.",
  "text.light": "Light",
  "text.listbox": "ListBox",
  "text.listview": "ListView",
  "text.mark": "Mark",
  "text.mary": "Mary",
  "text.material": "Material",
  "text.media": "Media",
  "text.mediaplayerelement": "Media player element",
  "text.mediaplayerelement-description": "You can use a MediaPlayerElement control to playback videos and show images. You can show transport controls or make the video autoplay.",
  "text.menubar": "MenuBar",
  "text.menuflyout": "MenuFlyout",
  "text.menus-and-toolbars": "Menus & toolbars",
  "text.mica": "Mica",
  "text.microsoft-home-page": "Microsoft home page",
  "text.mountain": "mountain",
  "text.multiple": "Multiple",
  "text.navigation": "Navigation",
  "text.navigationview": "NavigationView",
  "text.navigation-pane-position": "Navigation pane position",
  "text.none": "None",
  "text.numberbox": "NumberBox",
  "text.option-1": "Option 1",
  "text.option-2": "Option 2",
  "text.option-3": "Option 3",
  "text.options": "Options:",
  "text.overlay": "Overlay",
  "text.page-transition": "Page Transition",
  "sample.page-transition.header": "Page transitions",
  "sample.page-transition.description": "Page transitions provide visual feedback about the relationship between pages.",
  "sample.page-transition.modes": "Transition modes",
  "sample.page-transition.default": "Default",
  "sample.page-transition.entrance": "Entrance",
  "sample.page-transition.drill-in": "DrillIn",
  "sample.page-transition.suppress": "Suppress",
  "sample.page-transition.slide-right": "Slide from Right",
  "sample.page-transition.slide-left": "Slide from Left",
  "sample.page-transition.common": "Common",
  "sample.page-transition.continuum": "Continuum",
  "sample.page-transition.navigate": "Navigate",
  "sample.page-transition.forward": "Navigate Forward",
  "sample.page-transition.backward": "Navigate Backward",
  "sample.page-transition.output": "Current page: {page}. Back stack depth: {depth}.",
  "sample.page-transition.quickstart": "Quickstart: Motion",
  "text.default-navigation-transition-info": "DefaultNavigationTransitionInfo",
  "text.entrance-navigation-transition-info": "EntranceNavigationTransitionInfo",
  "text.drill-in-navigation-transition-info": "DrillInNavigationTransitionInfo",
  "text.suppress-navigation-transition-info": "SuppressNavigationTransitionInfo",
  "text.slide-navigation-transition-info-from-right": "SlideNavigationTransitionInfo (Effect = FromRight)",
  "text.slide-navigation-transition-info-from-left": "SlideNavigationTransitionInfo (Effect = FromLeft)",
  "text.common-navigation-transition-info": "CommonNavigationTransitionInfo",
  "text.continuum-navigation-transition-info": "ContinuumNavigationTransitionInfo",
  "text.partner-center": "Partner Center",
  "text.passwordbox": "PasswordBox",
  "text.persiancalendar": "PersianCalendar",
  "text.personpicture": "PersonPicture",
  "text.personpicture-description": "Displays the picture of a person/contact.",
  "text.pick-a-date": "Pick a date",
  "text.plays-animated-content": "Plays animated content.",
  "text.plays-media-content": "Plays media content.",
  "text.popup": "Popup",
  "text.pipspager": "PipsPager",
  "text.pivot": "Pivot",
  "text.pivot-description": "Pivot is not recommended for Windows 11 design patterns. Please use the SelectorBar and SelectorBarItem. A Pivot allows you to show a collection of items from different sources in a tabbed view.",
  "text.popup-with-offset-positioning": "Popup with Offset Positioning",
  "text.progressbar": "ProgressBar",
  "text.progressbar-description": "The ProgressBar has two different visual representations: Indeterminate shows that a task is ongoing, while Determinate shows how much progress has been made on a known amount of work.",
  "text.progressring": "ProgressRing",
  "text.progressring-description": "The ProgressRing has two different visual representations: Indeterminate shows that a task is ongoing, but blocks user interaction. Determinate shows how much progress has been made on a known amount of work.",
  "sample.progressring.indeterminate": "An indeterminate progress ring.",
  "sample.progressring.determinate": "A determinate progress ring.",
  "sample.progressring.progress-options": "Progress Options",
  "sample.progressring.working": "Working",
  "sample.progressring.do-work": "Do work",
  "sample.progressring.background-color": "Background color",
  "sample.progressring.pick-color": "Pick a color",
  "sample.progressring.progress": "Progress",
  "sample.progressring.progress-image": "Progress image",
  "sample.progressring.progress-amount": "Progress amount",
  "sample.progressring.transparent": "Transparent",
  "sample.progressring.lightgray": "LightGray",
  "text.pull-down-to-refresh": "Pull down to refresh",
  "text.pulltorefresh": "PullToRefresh",
  "text.itemsrepeater-description": "The ItemsRepeater is a light-weight control for displaying repeating data. It's highly customizable through flexible layout options and supports virtualizing layout. Use ItemsRepeater when you need more control over layout than what you get from a ListView or GridView.",
  "text.itemsview-description": "The ItemsView control displays a collection of data items. It gives you a flexible way to lay out, select, and invoke items.",
  "text.radiobutton-description": "RadioButton controls let the user select one option from a set of mutually exclusive options. In contrast, CheckBox controls allow the user to select multiple options. Use RadioButton controls when there are 2-7 options, and ensure that only one option can be selected at a time.",
  "text.radiobuttons": "RadioButton",
  "text.radiobuttons-are-used-to-select-a-single-option": "RadioButtons are used to select a single option from a group of related options. The RadioButtons control provides a modern layout and interaction model, while individual RadioButton elements can be used for more custom layouts.",
  "text.ratingcontrol": "RatingControl",
  "text.recent": "Recent",
  "text.recently-added-or-updated": "Recently added or updated",
  "text.recently-visited": "Recently visited",
  "text.red": "Red",
  "text.refresh-content-with-a-pulling-gesture": "Refresh content with a pulling gesture.",
  "text.repeatbutton": "RepeatButton",
  "text.reply": "Reply",
  "text.reply-all": "Reply All",
  "text.richeditbox": "RichEditBox",
  "text.richtextblock": "RichTextBlock",
  "text.save": "Save",
  "text.segoe-ui": "Segoe UI",
  "text.select-the-navigation-bar-position": "Select the navigation bar position",
  "text.send": "Send",
  "text.settings": "Settings",
  "text.status-and-info": "Status & info",
  "text.scrolling": "Scrolling",
  "text.semanticzoom": "SemanticZoom",
  "text.selectorbar": "SelectorBar",
  "text.selectorbar-description": "The SelectorBar control lets users select between different views, pages, or collections by choosing from an inline list of items.",
  "text.share": "Share",
  "text.shared": "Shared",
  "text.show-a-targeted-teachingtip-on-a-button": "Show a targeted TeachingTip on a button.",
  "text.show-dialog": "Show dialog",
  "text.show-popup-using-offset": "Show Popup (using Offset)",
  "text.show-teachingtip": "Show TeachingTip",
  "text.shows-a-calendar-that-lets-a-user-choose-a-date": "Shows a calendar that lets a user choose a date.",
  "text.single": "Single",
  "text.single-selection": "Single Selection",
  "text.slider": "Slider",
  "text.sort": "Sort",
  "text.spanish-es-es": "Spanish (es-ES)",
  "text.splitbutton": "SplitButton",
  "text.splitview": "SplitView",
  "text.standard-xaml-button": "Standard XAML button",
  "text.standarduicommand": "StandardUICommand",
  "text.standarduicommand-subtitle": "A StandardUICommand is a built-in XamlUICommand which represents a commonly used command, e.g. Save.",
  "sample.standarduicommand.multiple-controls": "Exposing a command in multiple controls using StandardUICommand",
  "sample.standarduicommand.description": "StandardUICommand allows the sharing of the UX associated with a command. In this instance we are using a StandardUICommand to quickly place the delete command in multiple controls. The StandardUICommand contains the icon, label, keyboard shortcut, and a description.",
  "sample.standarduicommand.items": "Items",
  "sample.standarduicommand.list-item": "List item {index}",
  "sample.standarduicommand.new": "New",
  "sample.standarduicommand.open": "Open...",
  "sample.standarduicommand.exit": "Exit",
  "text.sue": "Sue",
  "text.swipecontrol": "SwipeControl",
  "text.swipecontrol-subtitle": "Touch gesture for quick menu actions on items.",
  "sample.swipecontrol.reveal-actions": "Swipe right to reveal actions",
  "sample.swipecontrol.execute": "Swipe left to invoke an execute",
  "sample.swipecontrol.custom-list": "Custom Swipe in a ListView",
  "sample.swipecontrol.gradient": "Gradient Background",
  "sample.swipecontrol.custom-icons": "Custom icons",
  "sample.swipecontrol.swipe-right": "Swipe Right",
  "sample.swipecontrol.swipe-left": "Swipe Left",
  "sample.swipecontrol.accept": "Accept",
  "sample.swipecontrol.cancel": "Cancel",
  "sample.swipecontrol.flag": "Flag",
  "sample.swipecontrol.unmark": "Unmark",
  "sample.swipecontrol.archive": "Archive",
  "sample.swipecontrol.archived": "Archived - Swipe Left",
  "sample.swipecontrol.accepted": "Swipe Right - Accepted",
  "sample.swipecontrol.accepted-flagged": "Swipe Right - Accepted & Flagged",
  "sample.swipecontrol.flagged": "Swipe Right - Flagged",
  "sample.swipecontrol.list-item": "Swipe Item {index}",
  "sample.swipecontrol.reply-all": "Reply All",
  "sample.swipecontrol.open": "Open",
  "sample.swipecontrol.delete": "Delete",
  "sample.swipecontrol.lock": "Lock",
  "sample.swipecontrol.coffee": "Coffee",
  "sample.swipecontrol.remaining-items": "Items remaining: {count}",
  "sample.swipecontrol.item-action-output": "{action}: {item}. Items remaining: {count}",
  "sample.swipecontrol.lock-invoked": "Lock invoked",
  "sample.swipecontrol.coffee-invoked": "Coffee invoked",
  "text.switch-that-can-be-toggled-between-two-states": "Switch that can be toggled between two states.",
  "text.systembackground": "SystemBackground",
  "text.taiwancalendar": "TaiwanCalendar",
  "text.teachingtip": "TeachingTip",
  "text.tooltip": "ToolTip",
  "text.text": "Text",
  "text.textblock": "TextBlock",
  "text.textbox": "TextBox",
  "text.thaicalendar": "ThaiCalendar",
  "text.the-button-control-provides-a-click-event-to-res": "The Button control provides a Click event to respond to user input from a touch, mouse, keyboard, stylus, or other input device. You can put different kinds of content in a button, such as text or an image, or you can restyle a button to give it a new look.",
  "text.the-calendardatepicker-is-a-drop-down-control-th": "The CalendarDatePicker is a drop down control that's optimized for picking a single date from a calendar view where contextual information like the day of the week or fullness of the calendar is important. You can modify the calendar to provide additional context or to limit available dates.",
  "text.the-calendarview-gives-a-standardized-way-to-let": "The CalendarView gives a standardized way to let users view and interact with a calendar. If you just need to let a user select a date, consider using a CalendarDatePicker. If you need to let users select multiple dates, you must use a CalendarView.",
  "text.the-commandbarflyout-lets-you-provide-users-with": "The CommandBarFlyout lets you provide users with easy access to common tasks by showing commands in a floating toolbar related to an element on your UI canvas.",
  "text.the-expander-control-lets-you-show-or-hide-less": "The Expander control lets you show or hide less important content that's related to a piece of primary content that's always visible. Items contained in the Header are always visible. The user can expand and collapse the Content area to display the body content.",
  "text.the-flipview-lets-you-flip-through-a-collection": "The FlipView lets you flip through a collection of items, one item at a time. It's great for displaying images from a gallery or items in a product details page.",
  "text.the-gridview-lets-people-browse-and-select-from": "The GridView lets people browse and select from a collection of items arranged in a grid layout.",
  "text.the-menubar-simplifies-the-creation-of-basic-men": "The Menubar simplifies the creation of basic applications by providing a set of menus at the top of the app or window.",
  "text.the-numberbox-control-allows-users-to-enter-numb": "The NumberBox control allows users to enter numbers. It supports validation, stepping, and calculating inline expressions such as basic equations.",
  "text.the-ratingcontrol-allows-users-to-view-and-set-r": "The RatingControl allows users to view and set ratings that reflect degrees of satisfaction with content and services.",
  "text.the-richeditbox-control-lets-a-user-enter-format": "The RichEditBox control lets a user enter formatted text such as bold, italic, and underlined. RichEditBox can also display and edit Rich Text Format (.rtf) files.",
  "text.the-splitbutton-is-a-dropdown-button-but-with-an": "The SplitButton is a dropdown button, but with an addition execution hit target. It's used for scenarios where you want a user to be able to invoke a command or make a choice.",
  "text.the-textblock-control-provides-flexible-text-dis": "The TextBlock control provides flexible text display options for scenarios that don't require interactivity. It supports rich text formatting, inline elements like Bold and Italic, and text selection.",
  "text.tooltip-description": "A ToolTip shows more information about a UI element. You might show information about what the element does, or what the user should do. The ToolTip is shown when a user hovers over or presses and holds the UI element.",
  "text.the-treeview-control-is-a-hierarchical-list-patt": "The TreeView control is a hierarchical list pattern with expanding and collapsing nodes that contain nested items.",
  "text.theme": "Theme",
  "text.motion": "Motion",
  "text.this-is-the-title": "This is the title",
  "text.timepicker": "TimePicker",
  "text.times-new-roman": "Times New Roman",
  "text.toggle": "Toggle",
  "text.togglebutton": "ToggleButton",
  "text.togglesplitbutton": "ToggleSplitButton",
  "text.toggleswitch": "ToggleSwitch",
  "text.top": "Top",
  "text.trebuchet-ms": "Trebuchet MS",
  "text.treeview": "TreeView",
  "text.two-state-checkbox": "Two-state CheckBox",
  "text.umalquracalendar": "UmAlQuraCalendar",
  "text.up": "Up",
  "text.upload-your-app-to-the-store": "Upload your app to the Store.",
  "text.use-a-combobox-also-known-as-a-drop-down-list-to": "Use a ComboBox (also known as a drop-down list) to present a list of items a user can select from. A ComboBox starts in a compact state and expands to show a list of selectable items.",
  "text.use-a-contentdialog-to-show-relevant-information": "Use a ContentDialog to show relevant information or to provide a modal dialog experience that requires action from the user.",
  "text.use-a-datepicker-to-let-users-set-a-date-in-your": "Use a DatePicker to let users set a date in your app, for example to schedule an appointment. The DatePicker displays three controls for month, date, and year. These controls are easy to use with touch or mouse, and they can be styled and configured in several different ways.",
  "text.use-a-slider-to-let-users-set-a-value-by-moving": "Use a Slider to let users set a value by moving a thumb along a track. A Slider is a good choice when you know that users think of the value as a relative quantity, not a numeric value.",
  "text.use-a-textbox-to-let-a-user-enter-simple-text-in": "Use a TextBox to let a user enter simple text input in your app. You can customize the TextBox in a number of ways to fit your needs.",
  "text.use-a-timepicker-to-let-users-set-a-time-in-your": "Use a TimePicker to let users set a time in your app, for example to set a reminder. The TimePicker displays three controls for hour, minute, and AM/PM. These controls are easy to use with touch or mouse, and they can be styled and configured in several different ways.",
  "sample.datepicker.day-formatted-year-hidden": "A DatePicker with day formatted and year hidden.",
  "sample.timepicker.header-minute-increment": "A TimePicker with a header and minute increments specified.",
  "sample.timepicker.24-hour-clock": "A TimePicker using a 24-hour clock, initialized to current time.",
  "sample.timepicker.arrival-time": "Arrival time",
  "sample.timepicker.24-hour-clock-header": "24 hour clock",
  "text.use-an-autosuggestbox-to-provide-a-list-of-sugge": "Use an AutoSuggestBox to provide a list of suggestions for a user to select from as they type.",
  "text.use-system-setting": "Use system setting",
  "text.use-toggleswitch-controls-to-present-users-with": "Use ToggleSwitch controls to present users with exactly two mutually exclusive options (like on/off), where choosing an option results in an immediate commit. A toggle switch should have a single label.",
  "text.verdana": "Verdana",
  "text.view": "View",
  "text.winui-on-web-on-github": "WinUI on Web on GitHub",
  "text.workgroup": "Workgroup",
  "text.xamluicommand": "XamlUICommand",
  "text.xamluicommand-subtitle": "An object which is used to define the look and feel of a given command.",
  "sample.xamluicommand.reusable-command": "Creating a reusable command with XamlUICommand",
  "sample.xamluicommand.description": "XamlUICommand allows the sharing of the UX associated with a command. In this instance we create a simple Custom Command with a label, icon, shortcut, and description. It's defined as a resource and could be used in many controls, like this AppBarButton. The button (and other controls) automatically gets all these UI properties, without the need to define the properties again.",
  "sample.xamluicommand.custom-label": "Custom XamlUICommand",
  "sample.xamluicommand.custom-description": "This is a custom command",
  "sample.xamluicommand.executed": "You fired the custom command",
  "text.white": "White",
  "text.yellow": "Yellow"
  ,"sample.alpha-enabled": "Alpha Enabled"
  ,"sample.all-options-checked": "All options are checked"
  ,"sample.apply-current-color": "Apply current color"
  ,"sample.black": "Black"
  ,"sample.box": "Box"
  ,"sample.button.accent-style": "Accent style button"
  ,"sample.button.built-in-styles": "Built-in styles applied to Button."
  ,"sample.button.disable": "Disable button"
  ,"sample.button.long-text-1": "This is some text that is too long and will get cut off"
  ,"sample.button.long-text-1-wrapping": "This is some text that is too long and will get cut off without wrapping"
  ,"sample.button.long-text-2": "This is another text that would result in being cut off"
  ,"sample.button.long-text-2-wrapping": "This is another text that would result in being cut off without wrapping"
  ,"sample.button.standard-xaml": "Standard XAML button"
  ,"sample.button.subtle-style": "Subtle style button"
  ,"sample.button.wrapping": "Wrapping Buttons with large content"
  ,"sample.button.wrapping-note-1": "The following buttons' content may get clipped if we don't pay careful attention to their layout containers."
  ,"sample.button.wrapping-note-2": "One option to mitigate clipped content is to place Buttons underneath each other, allowing for more space to grow horizontally:"
  ,"sample.button.wrapping-note-3": "Another option is to explicitly wrap the Button's content"
  ,"sample.button.with-image": "A Button with graphical content."
  ,"sample.button.standard-name": "Standard XAML"
  ,"sample.button.pie": "Pie"
  ,"sample.button.slice": "Slice"
  ,"sample.button.accent-name": "Accent style"
  ,"sample.button.subtle-name": "Subtle style"
  ,"sample.button.control-output": "Control output"
  ,"ButtonMigration_DefaultButton": "Default button"
  ,"ButtonMigration_StyledButton": "Styled button"
  ,"ButtonMigration_OverriddenButton": "Styled button (overridden)"
  ,"sample.checkbox.checked": "CheckBox is checked."
  ,"sample.checkbox.indeterminate": "CheckBox state is indeterminate."
  ,"sample.checkbox.select-all": "Using a 3-state CheckBox."
  ,"sample.checkbox.three-state": "A 3-state CheckBox."
  ,"sample.checkbox.three-state-content": "Three-state CheckBox"
  ,"sample.checkbox.two-state": "A 2-state CheckBox."
  ,"sample.checkbox.two-state-content": "Two-state CheckBox"
  ,"sample.checkbox.unchecked": "CheckBox is unchecked."
  ,"sample.checkbox.you-checked": "You checked the box."
  ,"sample.checkbox.you-unchecked": "You unchecked the box."
  ,"sample.choose-color": "Choose color"
  ,"sample.colorpicker.applied-rectangle": "ColorPicker applied on a Rectangle"
  ,"sample.colorpicker.properties": "ColorPicker Properties."
  ,"sample.colorspectrum-shape": "Colorspectrum shape"
  ,"sample.combobox.editable": "An editable ComboBox."
  ,"sample.combobox.font": "Font"
  ,"sample.combobox.font-size": "Font Size"
  ,"sample.combobox.font-size-text": "You can set the font size used for this text."
  ,"sample.combobox.font-text": "You can set the font used for this text."
  ,"sample.combobox.inline": "A ComboBox with items defined inline and its width set."
  ,"sample.combobox.itemssource": "A ComboBox with its ItemsSource set."
  ,"sample.combobox.pick-a-color": "Pick a color"
  ,"sample.combobox.invalid-font-size": "The font size must be a number between 8 and 100."
  ,"sample.combobox.close": "Close"
  ,"sample.dropdownbutton.simple": "Simple DropDownButton"
  ,"sample.dropdownbutton.icons": "DropDownButton with Icons"
  ,"sample.expander.expand-direction": "ExpandDirection"
  ,"gallery.page-header.info": "Info"
  ,"gallery.page-header.xaml": "XAML"
  ,"gallery.page-header.csharp": "C#"
  ,"gallery.page-header.control-source-info": "Source code of {0} in the WinUI repository. For some controls only the XAML file is available"
  ,"gallery.page-header.sample-source-info": "Source code of {0} in the WinUI Gallery repository"
  ,"gallery.page-header.sample-page-title": "the {0} sample page"
  ,"gallery.page-header.api-link": "{0} - API"
  ,"gallery.page-header.guidelines": "Guidelines"
  ,"gallery.page-header.comboboxitem-api": "ComboBoxItem - API"
  ,"sample.disable-hyperlink-button": "Disable hyperlink button"
  ,"sample.disable-repeatbutton": "Disable RepeatButton"
  ,"sample.disable-togglebutton": "Disable ToggleButton"
  ,"sample.dropdown.icons": "DropDownButton with Icons"
  ,"sample.dropdown.simple": "Simple DropDownButton"
  ,"sample.gray": "Gray"
  ,"sample.hyperlink.click": "A hyperlink button that handles a Click event."
  ,"sample.hyperlink.go-to-togglebutton": "Go to ToggleButton"
  ,"sample.hyperlink.navigate": "A hyperlink button that navigates to a URI."
  ,"sample.indigo": "Indigo"
  ,"sample.nothing-checked": "Nothing is checked"
  ,"sample.number-of-clicks": "Number of clicks: {count}"
  ,"sample.option-checked-count": "{count} option checked"
  ,"sample.opacity": "Opacity"
  ,"sample.options-checked-count": "{count} options checked"
  ,"sample.orange": "Orange"
  ,"sample.repeat.simple": "A simple RepeatButton with text content."
  ,"sample.radiobutton.group": "A group of RadioButton controls in a RadioButtons group."
  ,"sample.radiobutton.strings": "Two RadioButtons controls with strings as options."
  ,"sample.flipview.simple": "A simple FlipView with items declared inline."
  ,"sample.flipview.bound-data-template": "A FlipView showing bound data with a data template."
  ,"sample.flipview.vertical": "Vertical FlipView"
  ,"sample.gridview.basic-simple-datatemplate": "Basic GridView with Simple DataTemplate"
  ,"sample.gridview.layout-customization": "GridView with Layout Customization"
  ,"sample.gridview.content-inside": "Content inside of a GridView."
  ,"sample.gridview.basic-note": "This is a basic GridView that has the full source code below. Other samples on this page display only the additional markup needed to customize the specific GridView."
  ,"sample.gridview.layout-note": "Use the options on the right to control different layout customizations to the GridView below."
  ,"sample.gridview.properties": "GridView Properties"
  ,"sample.gridview.drag-drop-note": "In order to drag, drop, and reorder items within the GridView, make sure the last three boxes are checked below."
  ,"sample.gridview.item-click-note": "Turning on IsItemClickEnabled will allow the user to click on an item, regardless of selection mode."
  ,"sample.gridview.clicked-output": "You clicked {item}."
  ,"sample.gridview.selection-output": "You have selected {count} item(s)."
  ,"sample.template-image": "Image"
  ,"sample.template-icon-text": "Icon/Text"
  ,"sample.template-image-text": "Image/Text"
  ,"sample.template-text": "Text"
  ,"sample.reverse-flow-direction": "Reverse FlowDirection"
  ,"sample.itemsrepeater.basic-non-interactive": "Basic, non-interactive items laid out by ItemsRepeater"
  ,"sample.itemsrepeater.virtualizing-scrollable-list-items": "Virtualizing, scrollable list of items laid out by ItemsRepeater"
  ,"sample.itemsrepeater.mixed-type-collection": "ItemsRepeater with mixed-type collection"
  ,"sample.itemsrepeater.nested": "Laying out nested ItemsRepeaters"
  ,"sample.itemsrepeater.animated-scrolling-content-display": "Animated Scrolling and Content Display"
  ,"sample.itemsrepeater.virtualized-content-heavy-layout": "Virtualized, Content-Heavy Layout with Filtering and Sorting"
  ,"sample.itemsrepeater.mixed-note": "This is an ItemsRepeater that displays both integer and string items. It uses a DataTemplateSelector to choose the correct layout for each of its items."
  ,"sample.itemsrepeater.uniform-grid-option": "Uniform grid"
  ,"sample.itemsrepeater.stack-layout-vertical": "StackLayout - Vertical"
  ,"sample.itemsrepeater.stack-layout-horizontal": "StackLayout - Horizontal"
  ,"sample.itemsrepeater.custom-virtualizing-layout": "Custom virtualizing layout"
  ,"sample.itemsrepeater.filtered-recipes-output": "Filtered recipes, {count} results."
  ,"sample.itemsrepeater.selected-color-output": "Rectangle color set to {color}"
  ,"sample.itemsrepeater.no-color-selected": "No color selected"
  ,"sample.itemsrepeater.items-layout-output": "{count} items, {layout}"
  ,"sample.itemsrepeater.mixed-output": "{integers} integer items, {strings} string items"
  ,"sample.itemsrepeater.nested-output": "{categories} categories, {items} items"
  ,"sample.itemsrepeater.color-rectangle": "Color rectangle"
  ,"sample.itemsrepeater.recipe-name": "Recipe {number}"
  ,"sample.itemsrepeater.mixed-text-1": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  ,"sample.itemsrepeater.mixed-text-2": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  ,"sample.itemsrepeater.mixed-text-3": "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  ,"sample.itemsrepeater.mixed-text-4": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  ,"sample.itemsrepeater.category.fruits": "Fruits"
  ,"sample.itemsrepeater.category.vegetables": "Vegetables"
  ,"sample.itemsrepeater.category.grains": "Grains"
  ,"sample.itemsrepeater.category.proteins": "Proteins"
  ,"sample.itemsrepeater.food.apricots": "Apricots"
  ,"sample.itemsrepeater.food.bananas": "Bananas"
  ,"sample.itemsrepeater.food.grapes": "Grapes"
  ,"sample.itemsrepeater.food.strawberries": "Strawberries"
  ,"sample.itemsrepeater.food.watermelon": "Watermelon"
  ,"sample.itemsrepeater.food.plums": "Plums"
  ,"sample.itemsrepeater.food.blueberries": "Blueberries"
  ,"sample.itemsrepeater.food.broccoli": "Broccoli"
  ,"sample.itemsrepeater.food.spinach": "Spinach"
  ,"sample.itemsrepeater.food.sweet-potato": "Sweet potato"
  ,"sample.itemsrepeater.food.cauliflower": "Cauliflower"
  ,"sample.itemsrepeater.food.onion": "Onion"
  ,"sample.itemsrepeater.food.brussels-sprouts": "Brussels sprouts"
  ,"sample.itemsrepeater.food.carrots": "Carrots"
  ,"sample.itemsrepeater.food.rice": "Rice"
  ,"sample.itemsrepeater.food.quinoa": "Quinoa"
  ,"sample.itemsrepeater.food.pasta": "Pasta"
  ,"sample.itemsrepeater.food.bread": "Bread"
  ,"sample.itemsrepeater.food.farro": "Farro"
  ,"sample.itemsrepeater.food.oats": "Oats"
  ,"sample.itemsrepeater.food.barley": "Barley"
  ,"sample.itemsrepeater.food.steak": "Steak"
  ,"sample.itemsrepeater.food.chicken": "Chicken"
  ,"sample.itemsrepeater.food.tofu": "Tofu"
  ,"sample.itemsrepeater.food.salmon": "Salmon"
  ,"sample.itemsrepeater.food.pork": "Pork"
  ,"sample.itemsrepeater.food.chickpeas": "Chickpeas"
  ,"sample.itemsrepeater.food.eggs": "Eggs"
  ,"sample.itemsrepeater.food.garlic": "Garlic"
  ,"sample.itemsrepeater.food.lemon": "Lemon"
  ,"sample.itemsrepeater.food.butter": "Butter"
  ,"sample.itemsrepeater.food.lime": "Lime"
  ,"sample.itemsrepeater.food.feta-cheese": "Feta Cheese"
  ,"sample.itemsrepeater.food.parmesan-cheese": "Parmesan Cheese"
  ,"sample.itemsrepeater.food.breadcrumbs": "Breadcrumbs"
  ,"sample.itemsrepeater.color.Blue": "Blue"
  ,"sample.itemsrepeater.color.BlueViolet": "BlueViolet"
  ,"sample.itemsrepeater.color.Crimson": "Crimson"
  ,"sample.itemsrepeater.color.DarkCyan": "DarkCyan"
  ,"sample.itemsrepeater.color.DarkGoldenrod": "DarkGoldenrod"
  ,"sample.itemsrepeater.color.DarkMagenta": "DarkMagenta"
  ,"sample.itemsrepeater.color.DarkOliveGreen": "DarkOliveGreen"
  ,"sample.itemsrepeater.color.DarkRed": "DarkRed"
  ,"sample.itemsrepeater.color.DarkSlateBlue": "DarkSlateBlue"
  ,"sample.itemsrepeater.color.DeepPink": "DeepPink"
  ,"sample.itemsrepeater.color.IndianRed": "IndianRed"
  ,"sample.itemsrepeater.color.MediumSlateBlue": "MediumSlateBlue"
  ,"sample.itemsrepeater.color.Maroon": "Maroon"
  ,"sample.itemsrepeater.color.MidnightBlue": "MidnightBlue"
  ,"sample.itemsrepeater.color.Peru": "Peru"
  ,"sample.itemsrepeater.color.SaddleBrown": "SaddleBrown"
  ,"sample.itemsrepeater.color.SteelBlue": "SteelBlue"
  ,"sample.itemsrepeater.color.OrangeRed": "OrangeRed"
  ,"sample.itemsrepeater.color.Firebrick": "Firebrick"
  ,"sample.itemsrepeater.color.DarkKhaki": "DarkKhaki"
  ,"sample.itemsview.basic": "Basic ItemsView"
  ,"sample.itemsview.swappable-layouts": "ItemsView with swappable layouts"
  ,"sample.itemsview.item-invocation-selection": "ItemsView item invocation and selection"
  ,"sample.itemsview.basic-note": "This is a basic ItemsView which uses its default StackLayout layout and a simple ItemTemplate. Hit the Enter key, double-click or double-tap an item to invoke it."
  ,"sample.itemsview.layout-note": "Use the options on the right to control different layout customizations to the ItemsView below."
  ,"sample.itemsview.linedflow-settings": "LinedFlowLayout settings"
  ,"sample.itemsview.stack-settings": "StackLayout settings"
  ,"sample.itemsview.uniformgrid-settings": "UniformGridLayout settings"
  ,"sample.itemsview.layout-linedflow": "LinedFlowLayout"
  ,"sample.itemsview.layout-uniformgrid": "UniformGridLayout"
  ,"sample.itemsview.layout-stack": "StackLayout"
  ,"sample.itemsview.selection-note": "You can enable four different selection modes on the right. None disables selection all together. Single allows for only one item to be selected in the collection. Multiple causes checkboxes to appear within the items, so that multiple items can be chosen from the collection. Extended allows the user to select multiple items by using Ctrl+Click to select the individual items they want, or Shift+Click to select a range of contiguous items."
  ,"sample.itemsview.selection-note-1": "You can enable four different selection modes on the right."
  ,"sample.itemsview.selection-note-none": "None disables selection all together."
  ,"sample.itemsview.selection-note-extended": "Extended allows the user to select multiple items by using Ctrl+Click to select the individual items they want, or Shift+Click to select a range of contiguous items."
  ,"sample.itemsview.invoked-output": "You invoked {item}."
  ,"sample.itemsview.selection-output": "You have selected {count} item(s)."
  ,"sample.itemsview.item-title": "Item {number}"
  ,"sample.itemsview.selection-single-description": " allows for only one item to be selected in the collection."
  ,"sample.itemsview.selection-multiple-description": " causes checkboxes to appear within the items, so that multiple items can be chosen from the collection."
  ,"sample.listview.basic-simple-datatemplate": "Basic ListView with Simple DataTemplate"
  ,"sample.listview.selection-support": "ListView with Selection Support"
  ,"sample.listview.selection-introduction": "You can enable four different selection modes on the right."
  ,"sample.listview.selection-none-description": " disables selection all together."
  ,"sample.listview.selection-single-description": " allows for only one item to be selected in the list."
  ,"sample.listview.selection-multiple-description": " causes checkboxes to appear next to items, so that multiple items can be chosen from the list."
  ,"sample.listview.selection-extended-description": " allows the user to select multiple items by using Ctrl+Click to select the individual items they want, or Shift+Click to select a range of contiguous items."
  ,"sample.listview.stats-separator": " ⋅ "
  ,"sample.listview.drag-drop-reordering": "ListViews with Drag, Drop, and Reordering Support"
  ,"sample.listview.grouped-headers": "ListView with Grouped Headers"
  ,"sample.listview.filtering": "ListView Filtering"
  ,"sample.listview.messaging": "ListView Messaging and Data Logging"
  ,"sample.listview.images": "ListView with Images"
  ,"sample.listview.context-menus": "ListView Context Menus"
  ,"sample.listview.first-name": "First name"
  ,"sample.listview.send-message": "Send Message"
  ,"sample.listview.receive-message": "Receive Message"
  ,"sample.listview.basic-note": "This is a basic ListView that has the full source code below. Other samples on this page display only the additional markup needed to customize a simple ListView like this one."
  ,"sample.listview.selection-note": "You can enable four different selection modes on the right. None disables selection all together. Single allows for only one item to be selected in the list. Multiple causes checkboxes to appear next to items, so that multiple items can be chosen from the list. Extended allows the user to select multiple items by using Ctrl+Click to select the individual items they want, or Shift+Click to select a range of contiguous items."
  ,"sample.listview.drag-drop-note": "In these ListView controls, you can drag and drop within a list to reorder items, or drag and drop between lists to move items."
  ,"sample.listview.grouped-note": "Switch the toggle on the right to enable sticky group headers, which makes the headers stay put at the top of the ListView while scrolling."
  ,"sample.listview.messaging-note": "This ListView is inverted to grow from the bottom up. It's a good way to display logs or messages, with most recent at the bottom."
  ,"sample.listview.message-received": "Message received"
  ,"sample.listview.message-sent": "Message sent"
  ,"sample.listview.image-item": "Item {index}"
  ,"sample.listview.image-description": "Sample landscape image {index} from the WinUI Gallery."
  ,"sample.listview.image-description-1": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer id facilisis lectus. Cras nec convallis ante, quis pulvinar tellus. Integer dictum accumsan pulvinar. Pellentesque eget enim sodales sapien vestibulum consequat."
  ,"sample.listview.image-description-2": "Nullam eget mattis metus. Donec pharetra, tellus in mattis tincidunt, magna ipsum gravida nibh, vitae lobortis ante odio vel quam."
  ,"sample.listview.image-description-3": "Quisque accumsan pretium ligula in faucibus. Mauris sollicitudin augue vitae lorem cursus condimentum quis ac mauris. Pellentesque quis turpis non nunc pretium sagittis. Nulla facilisi. Maecenas eu lectus ante. Proin eleifend vel lectus non tincidunt. Fusce condimentum luctus nisi, in elementum ante tincidunt nec."
  ,"sample.listview.image-description-4": "Aenean in nisl at elit venenatis blandit ut vitae lectus. Praesent in sollicitudin nunc. Pellentesque justo augue, pretium at sem lacinia, scelerisque semper erat. Ut cursus tortor at metus lacinia dapibus."
  ,"sample.listview.image-description-5": "Ut consequat magna luctus justo egestas vehicula. Integer pharetra risus libero, et posuere justo mattis et."
  ,"sample.listview.image-description-6": "Proin malesuada, libero vitae aliquam venenatis, diam est faucibus felis, vitae efficitur erat nunc non mauris. Suspendisse at sodales erat."
  ,"sample.listview.image-description-7": "Aenean vulputate, turpis non tincidunt ornare, metus est sagittis erat, id lobortis orci odio eget quam. Suspendisse ex purus, lobortis quis suscipit a, volutpat vitae turpis."
  ,"sample.listview.image-description-8": "Duis facilisis, quam ut laoreet commodo, elit ex aliquet massa, non varius tellus lectus et nunc. Donec vitae risus ut ante pretium semper. Phasellus consectetur volutpat orci, eu dapibus turpis. Fusce varius sapien eu mattis pharetra."
  ,"sample.listview.selected-count": "{count} item(s) selected"
  ,"sample.listview.no-selection": "No items selected"
  ,"sample.listview.message-count": "{count} messages"
  ,"sample.listview.message-number": "Message {count}"
  ,"sample.filter-by": "Filter by..."
  ,"sample.listview.context-note": "This ListView allows users to right click to open a context menu. In this case, the context menu provides the option to delete an entry."
  ,"sample.listview.views": " Views "
  ,"sample.listview.likes": " Likes"
  ,"sample.pulltorefresh.basic": "Basic PullToRefresh"
  ,"sample.pulltorefresh.custom-icon": "Custom Icon PullToRefresh"
  ,"sample.pulltorefresh.pull-down": "Pull down to refresh"
  ,"sample.pulltorefresh.pull-down-custom": "Pull down to sync data"
  ,"sample.pulltorefresh.refresh-count": "Refresh count: {count}"
  ,"sample.pulltorefresh.sync-count": "Sync count: {count}"
  ,"sample.pulltorefresh.state-label": "RefreshVisualizer state"
  ,"sample.pulltorefresh.state-value": "State: {state}"
  ,"sample.pulltorefresh.gesture-description": "At the top of the list, pull down using touch to refresh the content."
  ,"sample.pulltorefresh.request-refresh": "Refresh"
  ,"sample.pulltorefresh.ready": "Ready to refresh"
  ,"sample.pulltorefresh.refreshing": "Refreshing…"
  ,"sample.pulltorefresh.new-control": "NewControl {count}"
  ,"sample.pulltorefresh.new-friend": "New Friend {count}"
  ,"sample.pulltorefresh.state.idle": "Idle"
  ,"sample.pulltorefresh.state.peeking": "Peeking"
  ,"sample.pulltorefresh.state.interacting": "Interacting"
  ,"sample.pulltorefresh.state.pending": "Pending"
  ,"sample.pulltorefresh.state.refreshing": "Refreshing"
  ,"sample.pulltorefresh.control.acrylicbrush": "AcrylicBrush"
  ,"sample.pulltorefresh.control.colorpicker": "ColorPicker"
  ,"sample.pulltorefresh.control.navigationview": "NavigationView"
  ,"sample.pulltorefresh.control.parallaxview": "ParallaxView"
  ,"sample.pulltorefresh.control.personpicture": "PersonPicture"
  ,"sample.pulltorefresh.control.pulltorefreshpage": "PullToRefreshPage"
  ,"sample.pulltorefresh.control.ratingscontrol": "RatingsControl"
  ,"sample.pulltorefresh.control.revealbrush": "RevealBrush"
  ,"sample.pulltorefresh.control.treeview": "TreeView"
  ,"sample.pulltorefresh.friend.mike": "Mike"
  ,"sample.pulltorefresh.friend.ben": "Ben"
  ,"sample.pulltorefresh.friend.barbra": "Barbra"
  ,"sample.pulltorefresh.friend.claire": "Claire"
  ,"sample.pulltorefresh.friend.justin": "Justin"
  ,"sample.pulltorefresh.friend.shawn": "Shawn"
  ,"sample.pulltorefresh.friend.drew": "Drew"
  ,"sample.pulltorefresh.friend.lili": "Lili"
  ,"sample.treeview.drag-drop": "A simple TreeView with drag and drop support"
  ,"sample.treeview.multi-selection": "A TreeView with Multi-selection enabled"
  ,"sample.treeview.databinding-itemsource": "A TreeView with DataBinding Using ItemSource"
  ,"sample.treeview.item-template-selector": "A TreeView with ItemTemplateSelector"
  ,"sample.treeview.toggle-theme": "Switch page theme"
  ,"sample.treeview.add-to-favorites": "Add TreeView to favorites"
  ,"sample.treeview.remove-from-favorites": "Remove TreeView from favorites"
  ,"sample.treeview.node.work-documents": "Work Documents"
  ,"sample.treeview.node.xyz-functional-spec": "XYZ Functional Spec"
  ,"sample.treeview.node.feature-schedule": "Feature Schedule"
  ,"sample.treeview.node.personal-documents": "Personal Documents"
  ,"sample.treeview.node.home-remodel": "Home Remodel"
  ,"sample.treeview.node.contractor-contact-info": "Contractor Contact Info"
  ,"sample.treeview.node.paint-color-scheme": "Paint Color Scheme"
  ,"sample.treeview.node.documents": "Documents"
  ,"sample.treeview.node.project-proposal": "ProjectProposal"
  ,"sample.treeview.node.budget-report": "BudgetReport"
  ,"sample.treeview.node.projects": "Projects"
  ,"sample.treeview.node.project-plan": "Project Plan"
  ,"sample.add-item": "Add Item"
  ,"sample.remove-item": "Remove Item"
  ,"sample.stacklayout-vertical": "StackLayout - Vertical"
  ,"sample.stacklayout-horizontal": "StackLayout - Horizontal"
  ,"sample.uniform-grid": "Uniform grid"
  ,"sample.linedflow-layout": "LinedFlowLayout"
  ,"sample.stacklayout": "StackLayout"
  ,"sample.activity-feed-layout": "ActivityFeedLayout"
  ,"sample.custom-virtualizing-layout": "Custom virtualizing layout"
  ,"sample.options-colon": "Options:"
  ,"sample.space-between-columns": "Space between columns"
  ,"sample.space-between-rows": "Space between rows"
  ,"sample.space-between-lines": "Space between lines"
  ,"sample.minimum-space-between-columns": "Minimum space between columns"
  ,"sample.minimum-space-between-rows": "Minimum space between rows"
  ,"sample.minimum-space-between-items-on-line": "Minimum space between items on a line"
  ,"sample.maximum-items-before-wrapping": "Maximum number of items before wrapping"
  ,"sample.maximum-items-per-row-before-wrapping": "Maximum number of items per row before wrapping"
  ,"sample.line-height": "Line height"
  ,"sample.line.description": "Draws a straight line between two points."
  ,"sample.line.line": "Line"
  ,"sample.line.polyline": "Polyline"
  ,"sample.line.path": "Path"
  ,"sample.line.geometry-group": "GeometryGroup"
  ,"sample.line.polyline-description": "Draws a series of connected straight lines."
  ,"sample.line.path-description": "Draws a series of connected lines and curves."
  ,"sample.line.geometry-description": "Composite geometry objects can be created using a GeometryGroup."
  ,"sample.line.start-point-x": "Start point X"
  ,"sample.line.start-point-y": "Start point Y"
  ,"sample.line.end-point-x": "End point X"
  ,"sample.line.end-point-y": "End point Y"
  ,"sample.line.stroke-thickness": "Stroke Thickness"
  ,"sample.line.show-points": "Show points"
  ,"sample.line.radius-x": "RadiusX"
  ,"sample.line.radius-y": "RadiusY"
  ,"sample.line.point-1": "Point #1: (10,100)"
  ,"sample.line.polyline-point-2": "Point #2: (60,40)"
  ,"sample.line.polyline-point-3": "Point #3: (200,40)"
  ,"sample.line.polyline-point-4": "Point #4: (250,100)"
  ,"sample.line.path-point-2": "Point #2: (100,25)"
  ,"sample.line.path-point-3": "Point #3: (300,250)"
  ,"sample.line.path-point-4": "Point #4: (400,75)"
  ,"sample.line.path-point-5": "Point #5: (200,75)"
  ,"sample.line.path-comment-1": "The first segment is a cubic Bezier curve that begins at Point #1 and ends at Point #4, which is drawn by using Point #2 and 3 as the two control points. This segment is indicated by the \"C\" command in the Data attribute string."
  ,"sample.line.path-comment-2": "The second segment begins with an absolute horizontal line command \"H\", which specifies a line drawn from the preceding subpath endpoint (Point #4) to a new endpoint (Point #5). Because it's a horizontal line command, the value specified is an x-coordinate."
  ,"sample.line.geometry-comment": "Creates a composite shape from three geometries."
  ,"sample.line.line-output": "Start: ({x1}, {y1}); end: ({x2}, {y2}); stroke: {thickness}"
  ,"sample.line.polyline-output": "Points: {points}; stroke: {thickness}; point labels: {visibility}"
  ,"sample.line.path-output": "Data: {data}; stroke: {thickness}; point labels: {visibility}"
  ,"sample.line.geometry-output": "Ellipse radius: ({radiusX}, {radiusY})"
  ,"sample.line.points-visible": "Visible"
  ,"sample.line.points-hidden": "Hidden"
  ,"sample.small": "Small"
  ,"sample.large": "Large"
  ,"sample.likes-suffix": " Likes"
  ,"sample.selection-mode": "SelectionMode"
  ,"sample.selection-none": "None"
  ,"sample.selection-single": "Single"
  ,"sample.selection-multiple": "Multiple"
  ,"sample.selection-extended": "Extended"
  ,"sample.item-template": "Item template"
  ,"sample.is-item-click-enabled": "IsItemClickEnabled"
  ,"sample.can-drag-items": "CanDragItems"
  ,"sample.can-reorder-items": "CanReorderItems"
  ,"sample.allow-drop": "AllowDrop"
  ,"sample.layout": "Layout"
  ,"sample.itemsview.selection-note-single": "Single allows only one item to be selected in the collection."
  ,"sample.itemsview.selection-note-multiple": "Multiple shows checkboxes so several items can be selected."
  ,"sample.listview.last-name": "Last name"
  ,"sample.listview.company": "Company"
  ,"sample.layout-linedflow": "LinedFlowLayout"
  ,"sample.layout-uniformgrid": "UniformGridLayout"
  ,"sample.layout-stack": "StackLayout"
  ,"sample.layout-activityfeed": "ActivityFeedLayout"
  ,"sample.is-item-invoked-enabled": "IsItemInvokedEnabled"
  ,"sample.filter-by-ingredient": "Filter by ingredient..."
  ,"sample.sort-by-number-of-ingredients": "Sort by number of ingredients"
  ,"sample.least-to-most": "Least to most"
  ,"sample.most-to-least": "Most to least"
  ,"sample.reverse-flowdirection": "Reverse FlowDirection"
  ,"sample.sticky-headers": "Sticky Headers"
  ,"sample.image": "Image"
  ,"sample.rating.caption": "312 ratings"
  ,"sample.rating.is-clear-enabled": "IsClearEnabled"
  ,"sample.rating.is-read-only": "IsReadOnly"
  ,"sample.rating.your-rating": "Your rating"
  ,"sample.rating.clear-note": "Swipe left or click again to clear your rating."
  ,"sample.rating.placeholder": "PlaceholderValue of RatingControl"
  ,"sample.rating.simple-name": "Simple RatingControl"
  ,"sample.rating.placeholder-name": "RatingControl with placeholder"
  ,"sample.themeshadow.applied-border": "ThemeShadow applied to a Border"
  ,"sample.themeshadow.shadow-intensity": "shadow intensity"
  ,"sample.themeshadow.z-translation": "Z-translation"
  ,"sample.themeshadow.translation-output": "Translation: ({x}, {y}, {z})"
  ,"sample.themeshadow.receivers-output": "Receivers: {count}"
  ,"text.theme-shadow-description": "Adds a realistic shadow effect to UI elements using the system's lighting and depth to enhance visual hierarchy."
  ,"sample.placeholder-value": "PlaceholderValue"
  ,"sample.ring": "Ring"
  ,"sample.background": "Background"
  ,"sample.border": "Border"
  ,"sample.select-all": "Select all"
  ,"sample.select-an-option": "Select an option."
  ,"sample.slider.control-header": "Control header"
  ,"sample.slider.minimum": "Minimum:"
  ,"sample.slider.maximum": "Maximum:"
  ,"sample.slider.step-frequency": "StepFrequency:"
  ,"sample.slider.small-change": "SmallChange:"
  ,"sample.slider.range": "A Slider with range and steps specified."
  ,"sample.slider.snaps-to": "Snaps to:"
  ,"sample.slider.ticks": "A Slider with tick marks."
  ,"sample.slider.vertical": "A vertical slider with range and tick marks specified."
  ,"sample.slider.simple-name": "simple slider"
  ,"sample.slider.ticks-name": "Slider with ticks"
  ,"sample.slider.vertical-name": "vertical slider"
  ,"sample.slider.minimum-name": "Minimum"
  ,"sample.slider.maximum-name": "Maximum"
  ,"sample.slider.step-frequency-name": "Step Frequency"
  ,"sample.slider.small-change-name": "Small Change"
  ,"sample.splitbutton.color-picker": "A SplitButton controlling text color in a RichEditBox"
  ,"sample.step-values": "StepValues"
  ,"sample.ticks": "Ticks"
  ,"sample.toggle-work": "Toggle work"
  ,"sample.splitbutton.text": "A SplitButton with text"
  ,"sample.splitbutton.font-color": "Font color"
  ,"sample.splitbutton.font-color-with-text": "Font color with text"
  ,"sample.splitbutton.rich-text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tempor commodo ullamcorper a lacus."
  ,"sample.do-work": "Do work"
  ,"sample.togglebutton.simple": "A simple ToggleButton with text content."
  ,"sample.togglebutton.on": "On"
  ,"sample.togglebutton.off": "Off"
  ,"sample.toggleswitch.custom": "A ToggleSwitch with custom header and content."
  ,"sample.togglesplitbutton.bullet-list": "Using ToggleSplitButton to control bulleted list functionality in RichEditBox"
  ,"sample.togglesplitbutton.bulleted-list": "Bulleted list"
  ,"sample.togglesplitbutton.roman-numerals-list": "Roman numerals list"
  ,"sample.togglesplitbutton.bullets": "Bullets"
  ,"sample.togglesplitbutton.roman-numerals": "Roman Numerals"
  ,"sample.togglesplitbutton.text-entry": "Text entry"
  ,"sample.type-something-here": "Type something here"
  ,"sample.autosuggestbox.search-experience": "AutoSuggestBox provides a search experience"
  ,"sample.autosuggestbox.type-control-name": "Type a control name"
  ,"sample.autosuggestbox.no-results": "No results found"
  ,"sample.autosuggestbox.subtitle.autosuggestbox": "A text control that shows suggestions as users type."
  ,"sample.autosuggestbox.subtitle.button": "A control that responds to user input and raises a Click event."
  ,"sample.autosuggestbox.subtitle.checkbox": "A control that a user can select or clear."
  ,"sample.autosuggestbox.subtitle.combobox": "A drop-down list of items a user can select from."
  ,"sample.autosuggestbox.subtitle.numberbox": "A control that can be used to display and edit numbers."
  ,"sample.autosuggestbox.subtitle.passwordbox": "A control for entering passwords."
  ,"sample.autosuggestbox.subtitle.richeditbox": "A control for entering and editing formatted text."
  ,"sample.autosuggestbox.subtitle.textbox": "A control that lets a user enter simple text input."
  ,"sample.numberbox.spin-button": "A NumberBox with a spin button"
  ,"sample.numberbox.formatted-rounding": "A formatted NumberBox that rounds to the nearest 0.25"
  ,"sample.numberbox.enter-integer": "Enter an integer:"
  ,"sample.numberbox.enter-dollar-amount": "Enter a dollar amount:"
  ,"sample.numberbox.spinbutton-placement": "SpinButton placement"
  ,"sample.numberbox.compact": "Compact"
  ,"sample.passwordbox.header-placeholder-character": "A PasswordBox with header, placeholder text and custom character"
  ,"sample.passwordbox.reveal-mode": "A PasswordBox with reveal mode"
  ,"sample.passwordbox.password": "Password"
  ,"sample.passwordbox.enter-password": "Enter your password"
  ,"sample.passwordbox.show-password": "Show password"
  ,"sample.passwordbox.not-allowed": "'Password' is not allowed."
  ,"sample.richeditbox.custom-command-flyout": "Customizing RichEditBox's CommandBarFlyout - Adding 'Share'"
  ,"sample.richeditbox.custom-formatting-editor": "A custom editor with RichEditBox."
  ,"sample.richeditbox.math-mode": "RichEditBox in math mode"
  ,"sample.richeditbox.mathml": "Working with MathML in RichEditBox"
  ,"sample.richeditbox.editor-header": "Editor with custom menu"
  ,"sample.richeditbox.command-placeholder": "Select text and use the command menu."
  ,"sample.richeditbox.open-file": "Open file"
  ,"sample.richeditbox.save-file": "Save file"
  ,"sample.richeditbox.bold": "Bold"
  ,"sample.richeditbox.italic": "Italic"
  ,"sample.richeditbox.underline": "Underline"
  ,"sample.richeditbox.bullets": "Bullets"
  ,"sample.richeditbox.numbering": "Numbering"
  ,"sample.richeditbox.clear-formatting": "Clear formatting"
  ,"sample.richeditbox.font-color": "Font color"
  ,"sample.richeditbox.custom-editor": "Custom editor"
  ,"sample.richeditbox.share-command": "Share"
  ,"sample.richeditbox.share-clicked": "Share command clicked"
  ,"sample.richeditbox.compose-placeholder": "Compose formatted text"
  ,"sample.richeditbox.find-label": "Find:"
  ,"sample.richeditbox.search-placeholder": "Enter search text"
  ,"sample.richeditbox.math-note": "Math mode enables users to have input automatically recognized and converted to math expressions while being received."
  ,"sample.richeditbox.math-example": "For example, \"4^2\" is converted to \"4²\", and \"\\pi\" is converted to \"π\"."
  ,"sample.richeditbox.math-placeholder": "Enter math expressions like: 4^2, \\pi, \\alpha, \\beta"
  ,"sample.richeditbox.mathml-set-note": "The SetMathML method takes a MathML string and displays the equation in the RichEditBox."
  ,"sample.richeditbox.mathml-get-note": "The GetMathML method retrieves the MathML string of the equation from the RichEditBox."
  ,"sample.richeditbox.mathml-code": "MathML Code"
  ,"sample.richeditbox.set-sample-formula": "Set sample formula"
  ,"sample.richeditbox.no-mathml": "No MathML content"
  ,"sample.richeditbox.web-preview": "Web preview content"
  ,"sample.textbox.header-placeholder": "A TextBox with a header and placeholder text"
  ,"sample.textbox.readonly-properties": "A read-only TextBox with various properties set"
  ,"sample.textbox.multiline-spellcheck-selection": "A multi-line TextBox with spell checking and custom selection highlight color"
  ,"sample.textbox.enter-your-name": "Enter your name:"
  ,"sample.textbox.name-placeholder": "Name"
  ,"sample.common.excited-text": "I am super excited to be here!"
  ,"sample.textblock.style-applied": "A TextBlock with a style applied."
  ,"sample.textblock.properties": "A TextBlock with various properties set."
  ,"sample.textblock.inline-elements": "A TextBlock with inline text elements."
  ,"sample.textblock.selectable": "A selectable TextBlock"
  ,"sample.textblock.styled-text": "I am a styled TextBlock."
  ,"sample.textblock.inline-first": "Text in a TextBlock doesn't have to be a simple string."
  ,"sample.textblock.inline-prefix": "Text can be "
  ,"sample.textblock.inline-bold": "bold"
  ,"sample.textblock.inline-italic": "italic"
  ,"sample.textblock.inline-or": "or"
  ,"sample.textblock.inline-underlined": "underlined"
  ,"sample.textblock.selectable-text": "I am a selectable TextBlock with custom SelectionHighlightColor."
  ,"sample.textblock.selection-toggle": "IsTextSelectionEnabled"
  ,"sample.richtextblock.simple": "Simple RichTextBlock"
  ,"sample.richtextblock.selection-highlight": "RichTextBlock with custom selection highlight"
  ,"sample.richtextblock.overflow": "RichTextBlock overflow"
  ,"sample.richtextblock.custom-highlighting": "Custom text highlighting"
  ,"sample.richtextblock.description": "RichTextBlock provides a rich text display container that supports formatted text, hyperlinks, inline images, and other rich content."
  ,"sample.richtextblock.simple-text": "I am a RichTextBlock."
  ,"sample.richtextblock.rich-container-supports": "RichTextBlock provides a rich text display container that supports "
  ,"sample.richtextblock.formatted-text": "formatted text"
  ,"sample.richtextblock.hyperlinks": "hyperlinks"
  ,"sample.richtextblock.inline-images-and-rich-content": "inline images, and other rich content."
  ,"sample.richtextblock.overflow-support": "RichTextBlock also supports a built-in overflow model."
  ,"sample.richtextblock.overflow-paragraph": "Linked text containers allow text which does not fit in one element to overflow into a different element on the page. Creative use of linked text containers enables basic multicolumn support and other advanced page layouts."
  ,"sample.richtextblock.overflow-long": "This sample text is intentionally long so that the first container overflows into the following columns. It demonstrates how a rich text layout can keep related content connected while presenting it across multiple areas on the page."
  ,"sample.richtextblock.highlight-prefix": "Lorem ipsum dolor sit amet,"
  ,"sample.richtextblock.highlight-word": "consectetur"
  ,"sample.richtextblock.highlight-suffix": "adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
  ,"sample.richtextblock.highlighting-color": "Text highlighting color"
  ,"sample.violet": "Violet"
  ,"sample.working": "Working"
  ,"sample.you-selected": "You selected {option}"
  ,"sample.you-clicked": "You clicked: {name}"
  ,"control.datepicker.month": "Month"
  ,"control.datepicker.day": "Day"
  ,"control.datepicker.year": "Year"
  ,"control.timepicker.hour": "Hour"
  ,"control.timepicker.minute": "Minute"
  ,"control.timepicker.am": "AM"
  ,"control.timepicker.pm": "PM"
  ,"sample.contentdialog.no-default": "A content dialog without a default button."
  ,"sample.contentdialog.save-title": "Save your work?"
  ,"sample.contentdialog.replace-title": "Replace file?"
  ,"sample.contentdialog.body": "Lorem ipsum dolor sit amet, adipisicing elit."
  ,"sample.contentdialog.upload": "Upload your content to the cloud."
  ,"sample.contentdialog.save": "Save"
  ,"sample.contentdialog.dont-save": "Don't Save"
  ,"sample.contentdialog.cancel": "Cancel"
  ,"sample.contentdialog.replace": "Replace"
  ,"sample.contentdialog.keep": "Keep"
  ,"sample.contentdialog.show-no-default": "Show dialog without default button"
  ,"sample.contentdialog.saved": "User saved their work"
  ,"sample.contentdialog.not-saved": "User did not save their work"
  ,"sample.contentdialog.cancelled": "User cancelled the dialog"
  ,"sample.contentdialog.replaced": "User replaced the file"
  ,"sample.contentdialog.kept": "User kept the file"
  ,"sample.flyout.empty-cart": "Empty cart"
  ,"sample.flyout.shared": "This Flyout is shared."
  ,"sample.flyout.remove-all": "All items will be removed. Do you want to continue?"
  ,"sample.flyout.confirm-empty": "Yes, empty my cart"
     ,"sample.commandbarflyout.object": "CommandBarFlyout for commands on an in-app object"
  ,"sample.commandbarflyout.open-hint": "Click or right click the image to open a CommandBarFlyout"
  ,"sample.appbarbutton.symbol": "An AppBarButton with a symbol icon."
  ,"sample.appbarbutton.symbol-label": "SymbolIcon"
  ,"sample.appbarbutton.bitmap": "An AppBarButton with a bitmap icon."
  ,"sample.appbarbutton.bitmap-label": "BitmapIcon"
  ,"sample.appbarbutton.font": "An AppBarButton with a font icon."
  ,"sample.appbarbutton.font-label": "FontIcon"
  ,"sample.appbarbutton.path": "An AppBarButton with a path icon."
  ,"sample.appbarbutton.path-label": "PathIcon"
  ,"sample.appbarbutton.keyboard": "An AppBarButton with a KeyboardAccelerator"
  ,"sample.appbarbutton.flyout": "An AppBarButton that opens a Flyout containing an input control."
  ,"sample.appbarbutton.input-placeholder": "Input text here"
  ,"sample.appbarseparator.separated": "AppBarButtons separated by AppBarSeparators."
  ,"sample.appbarseparator.attach-camera": "Attach Camera"
  ,"sample.appbarseparator.like": "Like"
  ,"sample.appbarseparator.dislike": "Dislike"
  ,"sample.appbarseparator.orientation": "Orientation"
  ,"sample.appbartogglebutton.symbol": "An AppBarToggleButton with a symbol icon."
  ,"sample.appbartogglebutton.bitmap": "An AppBarToggleButton with a bitmap icon."
  ,"sample.appbartogglebutton.font": "An AppBarToggleButton with a font icon."
  ,"sample.appbartogglebutton.path": "A three-state AppBarToggleButton with a path icon."
  ,"sample.appbartogglebutton.output": "IsChecked = {value}"
     ,"sample.commandbar.show-or-hide": "Show or hide"
     ,"sample.commandbar.open": "Open command bar"
     ,"sample.commandbar.close": "Close command bar"
     ,"sample.commandbar.modify-content": "Modify content"
     ,"sample.commandbar.add-secondary": "Add secondary commands"
     ,"sample.commandbar.remove-secondary": "Remove secondary commands"
     ,"sample.commandbar.button-1": "Button 1"
     ,"sample.commandbar.button-2": "Button 2"
     ,"sample.commandbar.button-3": "Button 3"
     ,"sample.commandbar.button-4": "Button 4"
     ,"sample.mountain": "mountain"
  ,"sample.share": "Share"
  ,"sample.save": "Save"
  ,"sample.delete": "Delete"
  ,"sample.resize": "Resize"
  ,"sample.move": "Move"
  ,"sample.sort": "Sort"
  ,"sample.by-rating": "By rating"
  ,"sample.by-match": "By match"
  ,"sample.by-distance": "By distance"
  ,"sample.sort-by": "Sort by: {value}"
  ,"sample.menuflyout.toggle-items": "A MenuFlyout with ToggleMenuFlyoutItems and MenuFlyoutSeparator."
  ,"sample.menuflyout.cascading": "A MenuFlyout with cascading menus."
  ,"sample.menuflyout.split-items": "A MenuFlyout with SplitMenuFlyoutItems."
  ,"sample.menuflyout.icons": "A MenuFlyout with icons."
  ,"sample.menuflyout.keyboard": "A MenuFlyout with icons and Keyboard Accelerators."
  ,"sample.menuflyout.radio": "A MenuFlyout with RadioMenuFlyoutItems"
  ,"sample.menuflyout.sort": "Sort"
  ,"sample.menuflyout.by-rating": "By rating"
  ,"sample.menuflyout.by-match": "By match"
  ,"sample.menuflyout.by-distance": "By distance"
  ,"sample.menuflyout.options": "Options"
  ,"sample.menuflyout.reset": "Reset"
  ,"sample.menuflyout.repeat": "Repeat"
  ,"sample.menuflyout.shuffle": "Shuffle"
  ,"sample.menuflyout.file-options": "File Options"
  ,"sample.menuflyout.open": "Open"
  ,"sample.menuflyout.send-to": "Send to"
  ,"sample.menuflyout.bluetooth": "Bluetooth"
  ,"sample.menuflyout.desktop-shortcut": "Desktop (shortcut)"
  ,"sample.menuflyout.compressed-file": "Compressed file"
  ,"sample.menuflyout.compress-email": "Compress and email"
  ,"sample.menuflyout.compress-7z": "Compress to .7z"
  ,"sample.menuflyout.compress-zip": "Compress to .zip"
  ,"sample.menuflyout.save": "Save"
  ,"sample.menuflyout.save-docx": "Save as .docx"
  ,"sample.menuflyout.save-pdf": "Save as .pdf"
  ,"sample.menuflyout.save-txt": "Save as .txt"
  ,"sample.menuflyout.share": "Share"
  ,"sample.menuflyout.share-email": "Share via email"
  ,"sample.menuflyout.share-link": "Share via link"
  ,"sample.menuflyout.edit-options": "Edit Options"
  ,"sample.menuflyout.copy": "Copy"
  ,"sample.menuflyout.delete": "Delete"
  ,"sample.menuflyout.rename": "Rename"
  ,"sample.menuflyout.select": "Select"
  ,"sample.menuflyout.landscape": "Landscape"
  ,"sample.menuflyout.portrait": "Portrait"
  ,"sample.menuflyout.small-icons": "Small icons"
  ,"sample.menuflyout.medium-icons": "Medium icons"
  ,"sample.menuflyout.large-icons": "Large icons"
  ,"sample.menuflyout.rating": "rating"
  ,"sample.menuflyout.match": "match"
  ,"sample.menuflyout.distance": "distance"
  ,"sample.menuflyout.sort-output": "Sort by: {value}"
  ,"sample.menuflyout.clicked-output": "Clicked: {value}"
  ,"sample.menubar.keyboard": "MenuBar with keyboard accelerators"
  ,"sample.menubar.submenus": "MenuBar with submenus, separators, and radio items"
  ,"sample.menubar.undo": "Undo"
  ,"sample.menubar.redo": "Redo"
  ,"sample.menubar.cut": "Cut"
  ,"sample.menubar.paste": "Paste"
  ,"sample.menubar.plain-text": "Plain Text Document"
  ,"sample.menubar.rich-text": "Rich Text Document"
  ,"sample.menubar.other-formats": "Other Formats"
  ,"sample.menubar.output": "Output"
  ,"sample.menubar.clicked-output": "You clicked: {value}"
  ,"MenuBarSample_File.Title": "File"
  ,"MenuBarSample_Edit.Title": "Edit"
  ,"MenuBarSample_View.Title": "View"
  ,"MenuBarSample_Help.Title": "Help"
  ,"MenuBarSample_New.Text": "New"
  ,"MenuBarSample_Open.Text": "Open"
  ,"MenuBarSample_Save.Text": "Save"
  ,"MenuBarSample_Exit.Text": "Exit"
  ,"MenuBarSample_Undo.Text": "Undo"
  ,"MenuBarSample_Cut.Text": "Cut"
  ,"MenuBarSample_Copy.Text": "Copy"
  ,"MenuBarSample_Paste.Text": "Paste"
  ,"MenuBarSample_About.Text": "About"
  ,"MenuBarSample_PlainText.Text": "Plain Text Document"
  ,"MenuBarSample_RichText.Text": "Rich Text Document"
  ,"MenuBarSample_OtherFormats.Text": "Other Formats"
  ,"MenuBarSample_Output.Text": "Output"
  ,"MenuBarSample_Landscape.Text": "Landscape"
  ,"MenuBarSample_Portrait.Text": "Portrait"
  ,"MenuBarSample_SmallIcons.Text": "Small icons"
  ,"MenuBarSample_MediumIcons.Text": "Medium icons"
  ,"MenuBarSample_LargeIcons.Text": "Large icons"
  ,"sample.options": "Options"
  ,"sample.file-options": "File Options"
  ,"sample.edit-options": "Edit Options"
  ,"sample.reset": "Reset"
  ,"sample.repeat": "Repeat"
  ,"sample.shuffle": "Shuffle"
  ,"sample.open": "Open"
  ,"sample.send-to": "Send to"
  ,"sample.bluetooth": "Bluetooth"
  ,"sample.desktop-shortcut": "Desktop (shortcut)"
  ,"sample.compressed-file": "Compressed file"
  ,"sample.compress-email": "Compress and email"
  ,"sample.compress-7z": "Compress to .7z"
  ,"sample.compress-zip": "Compress to .zip"
  ,"sample.save-docx": "Save as .docx"
  ,"sample.save-pdf": "Save as .pdf"
  ,"sample.save-txt": "Save as .txt"
  ,"sample.share-email": "Share via email"
  ,"sample.share-link": "Share via link"
  ,"sample.copy": "Copy"
  ,"sample.rename": "Rename"
  ,"sample.select": "Select"
  ,"sample.landscape": "Landscape"
  ,"sample.portrait": "Portrait"
  ,"sample.small-icons": "Small icons"
  ,"sample.medium-icons": "Medium icons"
  ,"sample.large-icons": "Large icons"
  ,"sample.clicked": "Clicked: {value}"
  ,"sample.popup.simple": "Simple Popup"
  ,"sample.popup.description": "Displays content on top of existing content, within the bounds of the application window."
  ,"sample.popup.close": "Close"
  ,"sample.popup.light-dismiss": "IsLightDismissEnabled"
  ,"sample.popup.vertical-offset": "VerticalOffset"
  ,"sample.popup.horizontal-offset": "HorizontalOffset"
  ,"sample.true": "True"
  ,"sample.false": "False"
  ,"sample.teachingtip.targeted": "Show a targeted TeachingTip on a button."
  ,"sample.teachingtip.non-targeted": "Show a non-targeted TeachingTip with buttons."
  ,"sample.teachingtip.hero": "Show a targeted TeachingTip with hero content on a button."
  ,"sample.teachingtip.title": "This is the title"
  ,"sample.teachingtip.subtitle": "And this is the subtitle"
  ,"sample.teachingtip.action-button": "Action button"
  ,"sample.teachingtip.close-button": "Close button"
  ,"sample.teachingtip.description": "Description can go here"
  ,"sample.teachingtip.sunset": "Sunset"
  ,"sample.tooltip.simple": "A button with a simple ToolTip."
  ,"sample.tooltip.simple-content": "Simple ToolTip"
  ,"sample.tooltip.button-content": "Button with a simple ToolTip."
  ,"sample.tooltip.attached": "A TextBlock with an offset ToolTip."
  ,"sample.tooltip.service-content": "Offset ToolTip."
  ,"sample.tooltip.textblock-target": "TextBlock with an offset ToolTip."
  ,"sample.tooltip.image": "An Image with a ToolTip using PlacementRect."
  ,"sample.tooltip.image-content": "Non-occluding ToolTip."
  ,"sample.tooltip.image-alt": "Cliff landscape"
  ,"sample.tooltip.image-description": "Non-occluding tooltip"
  ,"sample.tooltip.controlled": "A ToolTip opened with IsOpen."
  ,"sample.tooltip.toggle-open": "Toggle ToolTip"
  ,"sample.tooltip.controlled-target": "Controlled placement target"
  ,"sample.tooltip.controlled-content": "This ToolTip is controlled by IsOpen."
  ,"text.sunset": "Sunset"
  ,"text.play": "Play"
  ,"text.pause": "Pause"
  ,"text.stop": "Stop"
  ,"text.volume": "Volume"
  ,"text.mute": "Mute"
  ,"text.unmute": "Unmute"
  ,"text.cast": "Cast"
  ,"text.aspect-ratio": "Aspect ratio"
  ,"text.browser-does-not-support-casting": "This browser does not support casting."
  ,"text.casting-is-not-available": "Casting is not available."
  ,"text.casting-panel-opened-or-connecting": "The casting panel was opened or is connecting."
  ,"text.no-casting-devices-found": "No casting devices were found.\n\nMake sure the casting device is turned on and connected to the same network."
  ,"text.casting-permission-denied": "Casting permission was denied."
  ,"text.casting-cancelled": "Casting was cancelled."
  ,"sample.splitview.pane-content": "PANE CONTENT"
  ,"sample.splitview.splitview-content": "SPLITVIEW CONTENT"
  ,"sample.splitview.page": "Page"
  ,"sample.splitview.people": "People"
  ,"sample.splitview.globe": "Globe"
  ,"sample.splitview.message": "Message"
  ,"sample.splitview.mail": "Mail"
  ,"sample.splitview.is-pane-open": "IsPaneOpen"
  ,"sample.splitview.placement": "Placement"
  ,"sample.splitview.left": "Left"
  ,"sample.splitview.right": "Right"
  ,"sample.splitview.display-mode": "DisplayMode"
  ,"sample.splitview.pane-background": "PaneBackground"
  ,"sample.splitview.open-pane-length": "OpenPaneLength"
  ,"sample.splitview.compact-pane-length": "CompactPaneLength"
  ,"sample.splitview.inline": "Inline"
  ,"sample.splitview.compact-inline": "CompactInline"
  ,"sample.splitview.overlay": "Overlay"
  ,"sample.splitview.compact-overlay": "CompactOverlay"
  ,"sample.splitview.theme-background": "SystemControlBackgroundChromeMediumLowBrush"
  ,"sample.splitview.red": "Red"
  ,"sample.splitview.blue": "Blue"
  ,"sample.splitview.green": "Green"
  ,"sample.splitview.navigation-page": "{page} Page"
  ,"sample.animatedvisualplayer.playback": "Playback of a Lottie animation."
  ,"sample.animatedvisualplayer.description": "This AnimatedVisualPlayer consumes an animation created using Adobe AfterEffects and translated into Microsoft.UI.Composition objects using Lottie-Windows. Since the CompositionShapes used here are supported on Windows 10 version 17763+, the AnimatedVisualPlayer falls back to an Image when its Source is unavailable."
  ,"sample.animatedvisualplayer.reverse": "Reverse"
  ,"sample.breadcrumbbar.control": "A BreadcrumbBar control"
  ,"sample.breadcrumbbar.custom-data-template": "BreadCrumbBar Control with Custom DataTemplate"
  ,"sample.breadcrumbbar.reset-sample": "Reset sample"
  ,"sample.breadcrumbbar.reset-success": "BreadcrumbBar sample reset successful."
  ,"sample.breadcrumbbar.home": "Home"
  ,"sample.breadcrumbbar.documents": "Documents"
  ,"sample.breadcrumbbar.design": "Design"
  ,"sample.breadcrumbbar.northwind": "Northwind"
  ,"sample.breadcrumbbar.images": "Images"
  ,"sample.breadcrumbbar.folder-1": "Folder1"
  ,"sample.breadcrumbbar.folder-2": "Folder2"
  ,"sample.breadcrumbbar.folder-3": "Folder3"
  ,"sample.pivot.basic": "A basic pivot."
  ,"sample.pivot.email": "EMAIL"
  ,"sample.pivot.all": "All"
  ,"sample.pivot.all-content": "all emails go here."
  ,"sample.pivot.unread": "Unread"
  ,"sample.pivot.unread-content": "unread emails go here."
  ,"sample.pivot.flagged": "Flagged"
  ,"sample.pivot.flagged-content": "flagged emails go here."
  ,"sample.pivot.urgent": "Urgent"
  ,"sample.pivot.urgent-content": "urgent emails go here."
  ,"sample.selectorbar.basic": "A Basic SelectorBar"
  ,"sample.selectorbar.frame-slide-transitions": "SelectorBar with Frame Slide Transitions"
  ,"sample.selectorbar.collections": "SelectorBar Displaying Different Collections Using ItemsView"
  ,"sample.selectorbar.page-1": "Page1"
  ,"sample.selectorbar.page-2": "Page2"
  ,"sample.selectorbar.page-3": "Page3"
  ,"sample.selectorbar.page-4": "Page4"
  ,"sample.selectorbar.page-5": "Page5"
  ,"sample.selectorbar.pink": "Pink"
  ,"sample.selectorbar.plum": "Plum"
  ,"sample.selectorbar.powder-blue": "PowderBlue"
  ,"sample.capture.preview": "A MediaCapture preview displayed via a MediaPlayerElement."
  ,"sample.capture.mirror-preview": "Mirror preview"
  ,"sample.capture.mirror-tooltip": "Mirrors only the preview, not captured photos"
  ,"sample.capture.capture-photo": "Capture Photo"
  ,"sample.capture.enable-camera-switching": "Enable camera switching"
  ,"sample.capture.switch-camera": "Switch camera"
  ,"sample.capture.captured-label": "Captured:"
  ,"sample.capture.no-devices": "No camera devices found."
  ,"sample.capture.viewing": "Viewing: {name}"
  ,"sample.capture.integrated-camera": "Integrated camera"
  ,"sample.capture.access-denied": "Camera access denied."
  ,"sample.capture.access-denied-title": "Camera access denied"
  ,"sample.capture.privacy-message": "Please enable camera access in the privacy settings."
  ,"sample.capture.privacy-settings": "Privacy Settings"
  ,"sample.capture.cancel": "Cancel"
  ,"sample.capture.error-title": "Error"
  ,"sample.capture.ok": "OK"
  ,"sample.capture.start-failed": "Unable to start the camera."
  ,"sample.capture.photo-captured": "Photo successfully captured."
  ,"sample.capture.captured-photo": "Captured photo {number}"
  ,"sample.capture.capture-failed": "Unable to capture the photo."
  ,"text.captured": "Captured"
  ,"text.integrated-camera": "Integrated camera"
  ,"text.requesting-camera-permission": "Requesting camera permission"
  ,"text.camera-api-is-not-available-in-this-browser": "Camera API is not available in this browser."
  ,"text.camera-permission-was-denied": "Camera permission was denied."
  ,"text.unable-to-start-the-camera": "Unable to start the camera."
  ,"sample.image.basic-local-file": "A basic image from a local file."
  ,"sample.image.decoded-rendering-size": "An image decoded to the rendering size"
  ,"sample.image.stretching": "Image stretching."
  ,"sample.image.stretch-mode": "Image stretch mode"
  ,"sample.image.nine-grid": "Nine grid images."
  ,"sample.image.svg": "An SVG image."
  ,"sample.image.animated-gif": "Animated GIF playback."
  ,"sample.image.treetops": "Treetops"
  ,"sample.image.valley": "Valley"
  ,"sample.image.normal-image": "The normal image"
  ,"sample.image.stretched-evenly": "Image stretched evenly"
  ,"sample.image.stretched-nine-grid": "Image stretched using nine grid"
  ,"sample.image.gif-auto": "An Image element automatically plays an animated GIF source."
  ,"sample.image.gif-autoplay-false": "Set AutoPlay to False to prevent the GIF from playing automatically."
  ,"sample.image.gif-manual": "Control playback manually using BitmapImage.Play() and Stop()."
  ,"sample.media.transport-controls": "A media player element with transport controls."
  ,"sample.media.autoplay-video": "A media player element that autoplays the video."
  ,"sample.media.open-file-automation-name": "Open file button"
  ,"sample.media.state.opening": "Opening media…"
  ,"sample.media.state.ready": "Ready to play."
  ,"sample.media.state.playing": "Playing."
  ,"sample.media.state.paused": "Paused."
  ,"sample.media.state.buffering": "Buffering…"
  ,"sample.media.state.ended": "Playback ended."
  ,"sample.media.state.failed": "Media could not be played."
  ,"sample.media.position": "Position: {current} / {duration}"
  ,"sample.media.selected-file": "Selected file: {name}"
  ,"sample.media.open-file": "Open a file"
  ,"sample.personpicture.select-looks": "Select different looks for the person picture."
  ,"sample.personpicture.profile-type": "Profile type"
  ,"sample.personpicture.profile-image": "Profile Image"
  ,"sample.personpicture.display-name": "Display Name"
  ,"sample.personpicture.initials": "Initials"
  ,"sample.personpicture.person-name": "Jane Doe"
  ,"sample.personpicture.person-initials": "SB"
  ,"sample.personpicture.output.image": "Profile Image; rendered size: {width} × {height}."
  ,"sample.personpicture.output.initials": "{name}; initials: {initials}; rendered size: {width} × {height}."
  ,"text.canvas": "Canvas"
  ,"text.grid": "Grid"
  ,"text.stackpanel": "StackPanel"
  ,"text.relativepanel": "RelativePanel"
  ,"text.variablesizedwrapgrid": "VariableSizedWrapGrid"
  ,"text.viewbox": "Viewbox"
  ,"text.scrollviewer": "ScrollViewer"
  ,"text.scrollview": "ScrollView"
  ,"text.parallaxview": "ParallaxView"
  ,"text.canvas-description": "Defines an area within which you can explicitly position child elements by using coordinates that are relative to the Canvas area."
  ,"text.grid-description": "The Grid is a layout panel that supports arranging child elements in rows and columns."
  ,"text.stackpanel-description": "The StackPanel control is a layout panel that arranges child elements into a single line that can be oriented horizontally or vertically."
  ,"text.relativepanel-description": "A panel that allows you to position and align child elements in relation to each other or the parent panel."
  ,"text.variablesizedwrapgrid-description": "Positions child elements in sequential position from left to right, breaking content to the next line at the edge of the containing box."
  ,"text.viewbox-description": "A container control that scales its content to fill the available space."
  ,"text.scrollviewer-description": "A ScrollViewer lets a user scroll, pan, and zoom to see content that's larger than the viewable area. Many content controls, like ListView, have ScrollViewers built into their control templates to provide automatic scrolling."
  ,"text.scrollview-description": "A ScrollView lets a user scroll, pan, and zoom to see content that's larger than the viewable area. The ItemsView has a ScrollView built into its control template to provide automatic scrolling."
  ,"text.scrolling-container-description": "A container control that lets the user pan and zoom its content."
  ,"text.pipspager-description": "A PipsPager allows the user to navigate through a paginated collection and is independent of the content shown. Use this control when the content in the layout is not explicitly ordered by relevancy or you desire a glyph-based representation of numbered pages. PipsPagers are commonly used in photo viewers, app lists, carousels, and when display space is limited."
  ,"text.semanticzoom-description": "The SemanticZoom lets you show grouped data in two different ways, and is useful for quickly navigating through large sets of data."
  ,"text.orientation": "Orientation"
  ,"text.previous-button-visibility": "Previous Button Visibility"
  ,"text.next-button-visibility": "Next Button Visibility"
  ,"text.zoom-mode": "ZoomMode"
  ,"text.zoom-factor": "ZoomFactor"
  ,"text.zoom": "Zoom"
  ,"text.scroll-mode": "ScrollMode"
  ,"text.scrollbar-visibility": "ScrollbarVisibility"
  ,"text.horizontal": "Horizontal"
  ,"text.vertical": "Vertical"
  ,"text.vertical-velocity": "Vertical velocity"
  ,"text.animation-duration-msec": "Animation duration (msec)"
  ,"text.scroll-with-animation": "Scroll with animation"
  ,"text.enabled": "Enabled"
  ,"text.disabled": "Disabled"
  ,"text.auto": "Auto"
  ,"text.visible": "Visible"
  ,"text.hidden": "Hidden"
  ,"text.collapsed": "Collapsed"
  ,"text.visible-on-pointer-over": "VisibleOnPointerOver"
  ,"text.default": "Default"
  ,"text.accordion": "Accordion"
  ,"text.teleportation": "Teleportation"
  ,"text.accessibility": "Accessibility"
  ,"text.windowing": "Windowing"
  ,"text.system": "System"
  ,"text.shell": "Shell"
  ,"text.binding": "Binding"
  ,"text.templates": "Templates"
  ,"text.xaml-conditions": "XAML Conditions"
  ,"text.scratch-pad": "Scratch Pad"
  ,"text.spacing": "Spacing"
  ,"text.color-contrast": "Color Contrast"
  ,"text.keyboard-navigation": "Keyboard Navigation"
  ,"text.screen-reader": "Screen Reader"
  ,"text.previous-page": "Previous page"
  ,"text.next-page": "Next page"
  ,"text.page-number": "Page {page}"
  ,"text.page-selection-announcement": "Page {page} of {total} selected"
  ,"text.zoom-out": "Zoom out"
  ,"text.cliff": "cliff"
  ,"text.zoom-mode-automation-name": "zoom mode"
  ,"text.zoom-factor-automation-name": "zoom factor"
  ,"text.horizontal-scroll-mode-automation-name": "horizontal scroll mode"
  ,"text.vertical-scroll-mode-automation-name": "vertical scroll mode"
  ,"text.horizontal-scrollbar-visibility-automation-name": "horizontal scroll bar visibility"
  ,"text.vertical-scrollbar-visibility-automation-name": "vertical scroll bar visibility"
  ,"text.vertical-velocity-automation-name": "vertical velocity"
  ,"text.vertical-animation-options-automation-name": "vertical animation options"
  ,"text.animation-duration-automation-name": "animation duration"
  ,"text.scroll-with-animation-automation-name": "scroll with animation"
  ,"text.parallaxview-description": "The ParallaxView control lets you create a visual effect where an item closer to the viewer moves faster than an item in the background."
  ,"sample.canvas.control": "A Canvas control."
  ,"sample.grid.3x3": "A 3x3 Grid control."
  ,"sample.stackpanel.control": "A StackPanel control."
  ,"sample.relativepanel.control": "A RelativePanel control."
  ,"sample.border.around-textblock": "A Border around a TextBlock."
  ,"text.border-description": "A Border is a container control that draws a border, background, or both, around another object."
  ,"gallery.toggle-theme": "Toggle theme"
  ,"gallery.add-favorite": "Add to favorites"
  ,"gallery.remove-favorite": "Remove from favorites"
  ,"sample.border.inside-text": "Text inside a border"
  ,"sample.border.thickness": "BorderThickness"
  ,"sample.border.background": "Background"
  ,"sample.border.brush": "BorderBrush"
  ,"sample.layout.color-green": "Green"
  ,"sample.layout.color-yellow": "Yellow"
  ,"sample.layout.color-blue": "Blue"
  ,"sample.layout.color-white": "White"
  ,"sample.canvas.top": "Canvas.Top"
  ,"sample.canvas.left": "Canvas.Left"
  ,"sample.canvas.z-index": "Canvas.ZIndex"
  ,"sample.grid.options.grid": "Grid"
  ,"sample.grid.options.red-block": "Red block"
  ,"sample.grid.options.column-spacing": "ColumnSpacing"
  ,"sample.grid.options.row-spacing": "RowSpacing"
  ,"sample.grid.options.column": "Grid.Column"
  ,"sample.grid.options.row": "Grid.Row"
  ,"sample.variablesizedwrapgrid.control": "VariableSizedWrapGrid"
  ,"sample.viewbox.content": "Content inside of a Viewbox."
  ,"sample.viewbox.text": "This is text."
  ,"sample.viewbox.size": "Width/Height"
  ,"sample.viewbox.stretch": "Stretch"
  ,"sample.viewbox.stretch-direction": "StretchDirection"
  ,"sample.viewbox.none": "None"
  ,"sample.viewbox.fill": "Fill"
  ,"sample.viewbox.uniform": "Uniform"
  ,"sample.viewbox.uniform-to-fill": "UniformToFill"
  ,"sample.viewbox.up-only": "UpOnly"
  ,"sample.viewbox.down-only": "DownOnly"
  ,"sample.viewbox.both": "Both"
  ,"sample.expander.text-header-content": "An Expander with text in the header and content."
  ,"sample.expander.content-alignment": "Modifying Expanders content alignment"
  ,"sample.expander.header-text": "This text is in the header"
  ,"sample.expander.content-text": "This is in the content"
  ,"sample.expander.centered-header": "This text is centered"
  ,"sample.expander.left-aligned-content": "And this text is left aligned"
  ,"sample.parallaxview.listview": "Parallax on a ListView"
  ,"sample.parallaxview.scrollview": "Parallax with a ScrollView"
  ,"sample.parallaxview.list-heading": "Scroll the list to see parallaxing of image"
  ,"sample.parallaxview.rectangles-heading": "Scroll the rectangles to see parallaxing of image"
  ,"sample.parallaxview.all-samples": "all samples"
  ,"sample.scrollviewer.content": "Content inside of a ScrollViewer"
  ,"sample.scrollview.content": "Content inside of a ScrollView."
  ,"sample.scrollview.content-note": "This ScrollView allows horizontal and vertical scrolling, as well as zooming. Change the settings on the right to alter those capabilities or the built-in scrollbars' visibility."
  ,"sample.scrollview.constant-velocity": "Constant velocity scrolling."
  ,"sample.scrollview.velocity-note": "Set the vertical velocity to a value greater than 30 to scroll down, or a value smaller than -30 to scroll up at a constant speed."
  ,"sample.scrollview.programmatic-animation": "Programmatic scroll with custom animation."
  ,"sample.scrollview.animation-note": "Pick an animation type and its duration and then click the button on the right to launch a programmatic scroll."
  ,"sample.scrollview.scroll-with-animation": "Scroll with animation"
  ,"sample.pipspager.integrated-flipview": "PipsPager integrated with a FlipView"
  ,"sample.pipspager.options": "PipsPager with options to change its orientation and button visibility."
  ,"sample.semanticzoom.simple": "A simple SemanticZoom"
  ,"sample.semanticzoom.resources-description": "Reusable definitions for shared values to ensure consistency and maintainability."
  ,"sample.semanticzoom.style-description": "A XAML style is a reusable set of property settings that defines consistent UI design elements."
  ,"sample.semanticzoom.binding-description": "Connecting UI elements to data for automatic synchronization and updates."
  ,"sample.semanticzoom.templates-description": "Customize controls' visuals, item layouts, and data presentation in XAML."
  ,"sample.semanticzoom.custom-controls-description": "Create reusable UI components with custom functionality and appearance."
  ,"sample.semanticzoom.xaml-conditions-description": "Define custom XAML conditions evaluated at parse time using IXamlCondition."
  ,"sample.semanticzoom.scratch-pad-description": "Scratch pad for testing simple XAML markup."
  ,"sample.semanticzoom.item-description": "WinUI sample for browsing {title}."
  ,"text.animated-icon": "AnimatedIcon"
  ,"text.color": "Color"
  ,"text.compact-sizing": "Compact sizing"
  ,"text.custom-user-controls": "Custom & User Controls"
  ,"text.fundamentals": "Fundamentals"
  ,"text.geometry": "Geometry"
  ,"text.icon-element": "IconElement"
  ,"text.iconography": "Iconography"
  ,"text.line": "Line"
     ,"text.radial-gradient-brush": "RadialGradientBrush"
     ,"text.resources": "Resources"
     ,"text.style": "Style"
     ,"text.styles": "Styles"
     ,"text.system-backdrops": "System backdrops"
     ,"text.theme-shadow": "ThemeShadow"
     ,"text.typography": "Typography"
     ,"text.about": "About"
     ,"text.open-code-repository": "Open code repository"
     ,"text.about-copyright": "© {year} {author}. {rights}"
     ,"text.all-rights-reserved": "All rights reserved."
     ,"text.qq-group": "QQ Group"
     ,"text.discord-group": "Discord Group"
     ,"sample.infobadge.description": "Badging is a non-intrusive and intuitive way to display notifications or bring focus to an area within an app - whether that be for notifications, indicating new content, or showing an alert. An InfoBadge is a small piece of UI that can be added into an app and customized to display a number, icon, or a simple dot."
     ,"sample.infobadge.embedded-navigationview": "InfoBadge embedded in NavigationView"
     ,"sample.infobadge.opacity": "InfoBadge Opacity"
     ,"sample.infobadge.display-mode": "Display Mode"
     ,"sample.infobadge.left-expanded": "LeftExpanded"
     ,"sample.infobadge.left-compact": "LeftCompact"
     ,"sample.infobadge.top": "Top"
     ,"sample.infobadge.different-styles": "Different InfoBadge Styles"
     ,"sample.infobadge.styles": "Styles"
     ,"sample.infobadge.inside-another-control": "Placing an InfoBadge Inside Another Control"
     ,"sample.infobadge.dynamic-value": "InfoBadge with Dynamic Value"
     ,"sample.infobadge.value": "InfoBadge Value"
     ,"sample.infobadge.inbox": "Inbox"
     ,"sample.infobadge.inbox-notifications": "Inbox, {value} notifications"
     ,"sample.infobadge.refresh-required": "Refresh required"
     ,"sample.infobadge.attention": "Attention"
     ,"sample.infobadge.informational": "Informational"
     ,"sample.infobadge.success": "Success"
     ,"sample.infobadge.critical": "Critical"
     ,"sample.infobadge.embedded-output": "Badge opacity: {opacity}; display mode: {mode}; notifications: 5."
     ,"sample.infobadge.styles-output": "Style: {style}. Icon, value 10, and dot badges use this style."
     ,"sample.infobadge.inside-output": "Refresh button clicks: {count}. The icon badge stays at the top right."
     ,"sample.infobadge.dynamic-output": "InfoBadge value: {value}."
     ,"sample.infobadge.dynamic-dot-output": "InfoBadge value: -1. The badge displays a dot."
     ,"sample.infobar.description": "Use an InfoBar control when a user should be informed of, acknowledge, or take action on a changed application state. By default the notification will remain in the content area until closed by the user but will not necessarily break user flow."
     ,"sample.infobar.closable-options-change": "A closable InfoBar with options to change its Severity."
     ,"sample.infobar.long-short-message-buttons": "A closable InfoBar with a long or short message and various buttons"
     ,"sample.infobar.display-options": "A closable InfoBar with options to display the close button and icon"
     ,"sample.infobar.title": "Title"
     ,"sample.infobar.essential-message": "Essential app message for your users to be informed of, acknowledge, or take action on."
     ,"sample.infobar.long-message": "A long essential app message for your users to be informed of, acknowledge, or take action on. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dapibus dolor vitae justo rutrum, ut lobortis nibh mattis. Aenean id elit commodo, semper felis nec."
     ,"sample.infobar.long-message-placeholder": "A long essential app message..."
     ,"sample.infobar.short-message": "A short essential app message."
     ,"sample.infobar.is-open": "Is Open"
     ,"sample.infobar.severity": "Severity"
     ,"sample.infobar.severity-informational": "Informational"
     ,"sample.infobar.severity-success": "Success"
     ,"sample.infobar.severity-warning": "Warning"
     ,"sample.infobar.severity-error": "Error"
     ,"sample.infobar.message-length": "Message Length"
     ,"sample.infobar.action-button": "Action Button"
     ,"sample.infobar.is-icon-visible": "Is Icon Visible"
     ,"sample.infobar.is-closable": "Is Closable"
     ,"sample.infobar.short": "Short"
     ,"sample.infobar.long": "Long"
     ,"sample.infobar.hyperlink": "Hyperlink"
     ,"sample.infobar.action": "Action"
     ,"sample.infobar.informational-link": "Informational link"
     ,"sample.infobar.output-severity": "Open: {open}; severity: {severity}"
     ,"sample.infobar.output-message": "Open: {open}; message length: {length}; action: {action}; action clicks: {count}"
     ,"sample.infobar.output-display": "Open: {open}; icon visible: {icon}; closable: {closable}"
     ,"sample.infobar.state-true": "True"
     ,"sample.infobar.state-false": "False"
     ,"sample.progressbar.indeterminate": "An indeterminate progress bar."
     ,"sample.progressbar.determinate": "A determinate progress bar."
     ,"sample.progressbar.progress-state": "Progress state"
     ,"sample.progressbar.running": "Running"
     ,"sample.progressbar.paused": "Paused"
     ,"sample.progressbar.error": "Error"
     ,"sample.progressbar.progress": "Progress"
     ,"sample.progressbar.determinate-name": "Determinate ProgressBar example"
     ,"sample.progressbar.numberbox-name": "NumberBox controlling ProgressBar2 value"
     ,"sample.colorpicker.more-button-visible": "More button visible"
     ,"sample.colorpicker.color-slider-visible": "Color slider visible"
     ,"sample.colorpicker.color-channel-text-input-visible": "Color channel text input visible"
     ,"sample.colorpicker.hex-input-visible": "Hex input visible"
     ,"sample.colorpicker.alpha-slider-visible": "Alpha slider visible"
     ,"sample.colorpicker.alpha-text-input-visible": "Alpha text input visible"
  ,"sample.image.stretch-none": "None"
  ,"sample.image.stretch-fill": "Fill"
  ,"sample.image.stretch-uniform": "Uniform"
  ,"sample.image.stretch-uniform-to-fill": "UniformToFill"
  ,"sample.image.svg-name": "SVG image"
  ,"sample.image.gif-auto-name": "Automatic GIF playback"
  ,"sample.image.gif-paused-name": "GIF with AutoPlay disabled"
  ,"sample.image.gif-manual-name": "Manual GIF playback"
  ,"sample.image.add-favorite": "Add Image to favorites"
  ,"sample.image.remove-favorite": "Remove Image from favorites"
  ,"sample.image.output.loading": "Loading image…"
  ,"sample.image.output.failed": "The image could not be loaded."
  ,"sample.image.output.ready": "Image loaded. Source: {sourceWidth} × {sourceHeight} pixels; rendered: {width} × {height}."
  ,"sample.image.output.decoded": "Decode height: {decodeHeight} pixels. Decoded: {sourceWidth} × {sourceHeight} pixels; rendered: {width} × {height}."
  ,"sample.image.output.stretch": "Stretch: {mode}; rendered: {width} × {height}."
  ,"sample.image.output.nine-grid": "NineGrid: {inset}; rendered: {width} × {height}."
  ,"sample.image.output.named": "{name}: {result}"
  ,"sample.image.output.gif": "Animated bitmap: {animated}; playback: {playback}; rendered: {width} × {height}."
  ,"sample.image.output.yes": "Yes"
  ,"sample.image.output.no": "No"
  ,"sample.image.output.playing": "Playing"
  ,"sample.image.output.stopped": "Stopped"
  ,"sample.image.source.basic": "<Image Source=\"{source}\" Height=\"100\" />"
  ,"sample.image.source.decoded": "<Image Height=\"100\">\n    <Image.Source>\n        <BitmapImage UriSource=\"{source}\"\n            DecodePixelHeight=\"100\" />\n    </Image.Source>\n</Image>"
  ,"sample.image.source.stretch": "<Image Stretch=\"{stretch}\" Height=\"100\" Width=\"100\" Source=\"{source}\" />"
  ,"sample.image.source.stretch-csharp": "private void ImageStretch_Checked(object sender, RoutedEventArgs e)\n{\n    if ((sender as RadioButton)?.Tag?.ToString() is string strStretch &&\n        StretchImage != null)\n    {\n        var stretch = (Stretch)Enum.Parse(typeof(Stretch), strStretch);\n        StretchImage.Stretch = stretch;\n    }\n}"
  ,"sample.image.source.nine-grid": "<Image Source=\"{source}\" Height=\"82\" />\n<Image Source=\"{source}\" NineGrid=\"3,3,3,3\" Height=\"164\" />\n<Image Source=\"{source}\" NineGrid=\"30,20,30,20\" Height=\"164\" />"
  ,"sample.image.source.svg": "<Image Source=\"{source}\" Height=\"100\" />"
  ,"sample.image.source.gif": "<StackPanel Spacing=\"12\">\n    <TextBlock Text=\"{auto}\" TextWrapping=\"Wrap\" />\n    <Image Height=\"40\" HorizontalAlignment=\"Left\" Source=\"{source}\" />\n\n    <TextBlock Text=\"{paused}\" TextWrapping=\"Wrap\" />\n    <Image Height=\"40\" HorizontalAlignment=\"Left\">\n        <Image.Source>\n            <BitmapImage AutoPlay=\"False\" UriSource=\"{source}\" />\n        </Image.Source>\n    </Image>\n\n    <TextBlock Text=\"{manual}\" TextWrapping=\"Wrap\" />\n    <Image Height=\"40\" HorizontalAlignment=\"Left\">\n        <Image.Source>\n            <BitmapImage x:Name=\"ClickToPlaySource\" AutoPlay=\"False\"\n                         UriSource=\"{source}\"\n                         ImageOpened=\"ClickToPlaySource_ImageOpened\" />\n        </Image.Source>\n    </Image>\n</StackPanel>\n\n<controls:ControlExample.Options>\n    <StackPanel x:Name=\"PlaybackButtons\" Spacing=\"8\" Visibility=\"Collapsed\">\n        <Button Content=\"{play}\" Click=\"{x:Bind ClickToPlaySource.Play}\" />\n        <Button Content=\"{stop}\" Click=\"{x:Bind ClickToPlaySource.Stop}\" />\n    </StackPanel>\n</controls:ControlExample.Options>"
  ,"sample.image.source.gif-csharp": "private void ClickToPlaySource_ImageOpened(object sender, RoutedEventArgs e)\n{\n    if (ClickToPlaySource.IsAnimatedBitmap)\n    {\n        PlaybackButtons.Visibility = Visibility.Visible;\n    }\n}"
  ,"sample.semanticzoom.data.group.FundamentalsItem": "Fundamentals"
  ,"sample.semanticzoom.data.item.XamlResources.title": "Resources"
  ,"sample.semanticzoom.data.item.XamlResources.subtitle": "Reusable definitions for shared values to ensure consistency and maintainability."
  ,"sample.semanticzoom.data.item.XamlStyles.title": "Style"
  ,"sample.semanticzoom.data.item.XamlStyles.subtitle": "A XAML style is a Reusable property settings to define consistent UI design elements."
  ,"sample.semanticzoom.data.item.Binding.title": "Binding"
  ,"sample.semanticzoom.data.item.Binding.subtitle": "Connecting UI elements to data for automatic synchronization and updates."
  ,"sample.semanticzoom.data.item.Templates.title": "Templates"
  ,"sample.semanticzoom.data.item.Templates.subtitle": "Customize controls' visuals, item layouts, and data presentation in XAML."
  ,"sample.semanticzoom.data.item.CustomUserControls.title": "Custom & User Controls"
  ,"sample.semanticzoom.data.item.CustomUserControls.subtitle": "Create reusable UI components with custom functionality and appearance."
  ,"sample.semanticzoom.data.item.CustomXamlConditionals.title": "XAML Conditions"
  ,"sample.semanticzoom.data.item.CustomXamlConditionals.subtitle": "Define custom XAML conditions evaluated at parse time using IXamlCondition."
  ,"sample.semanticzoom.data.item.ScratchPad.title": "Scratch Pad"
  ,"sample.semanticzoom.data.item.ScratchPad.subtitle": "Scratch pad for testing simple XAML markup"
  ,"sample.semanticzoom.data.group.DesignItem": "Design"
  ,"sample.semanticzoom.data.item.Color.title": "Color"
  ,"sample.semanticzoom.data.item.Color.subtitle": "Balanced color design creates clarity and aesthetic harmony."
  ,"sample.semanticzoom.data.item.Geometry.title": "Geometry"
  ,"sample.semanticzoom.data.item.Geometry.subtitle": "Clear geometric design ensures visual coherence and structure."
  ,"sample.semanticzoom.data.item.Iconography.title": "Iconography"
  ,"sample.semanticzoom.data.item.Iconography.subtitle": "Icons are a visual design language that can be used to communicate information quickly and effectively."
  ,"sample.semanticzoom.data.item.Spacing.title": "Spacing"
  ,"sample.semanticzoom.data.item.Spacing.subtitle": "Thoughtful spacing design enhances readability and flow."
  ,"sample.semanticzoom.data.item.Typography.title": "Typography"
  ,"sample.semanticzoom.data.item.Typography.subtitle": "Typography design guides attention with intuitive fonts and hierarchy."
  ,"sample.semanticzoom.data.group.AccessibilityItem": "Accessibility"
  ,"sample.semanticzoom.data.item.AccessibilityColorContrast.title": "Color Contrast"
  ,"sample.semanticzoom.data.item.AccessibilityColorContrast.subtitle": "High contrast design ensures accessibility for all users."
  ,"sample.semanticzoom.data.item.AccessibilityKeyboard.title": "Keyboard Navigation"
  ,"sample.semanticzoom.data.item.AccessibilityKeyboard.subtitle": "Keyboard-friendly design enables seamless interactions."
  ,"sample.semanticzoom.data.item.AccessibilityScreenReader.title": "Screen Reader"
  ,"sample.semanticzoom.data.item.AccessibilityScreenReader.subtitle": "Inclusive design ensures meaningful content for assistive technologies."
  ,"sample.semanticzoom.data.group.MenusAndToolbars": "Menus & toolbars"
  ,"sample.semanticzoom.data.item.AppBarButton.title": "AppBarButton"
  ,"sample.semanticzoom.data.item.AppBarButton.subtitle": "A button that's styled for use in a CommandBar."
  ,"sample.semanticzoom.data.item.AppBarSeparator.title": "AppBarSeparator"
  ,"sample.semanticzoom.data.item.AppBarSeparator.subtitle": "A vertical line that's used to visually separate groups of commands in an app bar."
  ,"sample.semanticzoom.data.item.AppBarToggleButton.title": "AppBarToggleButton"
  ,"sample.semanticzoom.data.item.AppBarToggleButton.subtitle": "A button that can be on, off, or indeterminate like a CheckBox, and is styled for use in an app bar or other specialized UI."
  ,"sample.semanticzoom.data.item.CommandBar.title": "CommandBar"
  ,"sample.semanticzoom.data.item.CommandBar.subtitle": "A toolbar for displaying application-specific commands that handles layout and resizing of its contents."
  ,"sample.semanticzoom.data.item.CommandBarFlyout.title": "CommandBarFlyout"
  ,"sample.semanticzoom.data.item.CommandBarFlyout.subtitle": "A mini-toolbar displaying proactive commands, and an optional menu of commands."
  ,"sample.semanticzoom.data.item.MenuBar.title": "MenuBar"
  ,"sample.semanticzoom.data.item.MenuBar.subtitle": "A classic menu, allowing the display of MenuItems containing MenuFlyoutItems."
  ,"sample.semanticzoom.data.item.MenuFlyout.title": "MenuFlyout"
  ,"sample.semanticzoom.data.item.MenuFlyout.subtitle": "Shows a contextual list of simple commands or options."
  ,"sample.semanticzoom.data.item.SwipeControl.title": "SwipeControl"
  ,"sample.semanticzoom.data.item.SwipeControl.subtitle": "Touch gesture for quick menu actions on items."
  ,"sample.semanticzoom.data.item.StandardUICommand.title": "StandardUICommand"
  ,"sample.semanticzoom.data.item.StandardUICommand.subtitle": "A StandardUICommand is a built-in 'XamlUICommand' which represents a commonly used command, e.g. 'Save'."
  ,"sample.semanticzoom.data.item.XamlUICommand.title": "XamlUICommand"
  ,"sample.semanticzoom.data.item.XamlUICommand.subtitle": "An object which is used to define the look and feel of a given command."
  ,"sample.semanticzoom.data.group.Collections": "Collections"
  ,"sample.semanticzoom.data.item.FlipView.title": "FlipView"
  ,"sample.semanticzoom.data.item.FlipView.subtitle": "Presents a collection of items that the user can flip through, one item at a time."
  ,"sample.semanticzoom.data.item.GridView.title": "GridView"
  ,"sample.semanticzoom.data.item.GridView.subtitle": "A control that presents a collection of items in rows and columns."
  ,"sample.semanticzoom.data.item.ItemsRepeater.title": "ItemsRepeater"
  ,"sample.semanticzoom.data.item.ItemsRepeater.subtitle": "A flexible, primitive control for data-driven layouts."
  ,"sample.semanticzoom.data.item.ItemsView.title": "ItemsView"
  ,"sample.semanticzoom.data.item.ItemsView.subtitle": "A control that presents a collection of items using various layouts."
  ,"sample.semanticzoom.data.item.ListView.title": "ListView"
  ,"sample.semanticzoom.data.item.ListView.subtitle": "A control that presents a collection of items in a vertical list."
  ,"sample.semanticzoom.data.item.PullToRefresh.title": "PullToRefresh"
  ,"sample.semanticzoom.data.item.PullToRefresh.subtitle": "Provides the ability to pull on a collection of items in a list/grid to refresh the contents of the collection."
  ,"sample.semanticzoom.data.item.TreeView.title": "TreeView"
  ,"sample.semanticzoom.data.item.TreeView.subtitle": "The  TreeView control is a hierarchical list pattern with expanding and collapsing nodes that contain nested items."
  ,"sample.semanticzoom.data.group.DateAndTime": "Date & time"
  ,"sample.semanticzoom.data.item.CalendarDatePicker.title": "CalendarDatePicker"
  ,"sample.semanticzoom.data.item.CalendarDatePicker.subtitle": "A control that lets users pick a date value using a calendar."
  ,"sample.semanticzoom.data.item.CalendarView.title": "CalendarView"
  ,"sample.semanticzoom.data.item.CalendarView.subtitle": "A control that presents a calendar for a user to choose a date from."
  ,"sample.semanticzoom.data.item.DatePicker.title": "DatePicker"
  ,"sample.semanticzoom.data.item.DatePicker.subtitle": "A control that lets a user pick a date value."
  ,"sample.semanticzoom.data.item.TimePicker.title": "TimePicker"
  ,"sample.semanticzoom.data.item.TimePicker.subtitle": "A configurable control that lets a user pick a time value."
  ,"sample.semanticzoom.data.group.BasicInput": "Basic input"
  ,"sample.semanticzoom.data.item.Button.title": "Button"
  ,"sample.semanticzoom.data.item.Button.subtitle": "A control that responds to user input and raises a Click event."
  ,"sample.semanticzoom.data.item.DropDownButton.title": "DropDownButton"
  ,"sample.semanticzoom.data.item.DropDownButton.subtitle": "A button that displays a flyout of choices when clicked."
  ,"sample.semanticzoom.data.item.HyperlinkButton.title": "HyperlinkButton"
  ,"sample.semanticzoom.data.item.HyperlinkButton.subtitle": "A button that appears as hyperlink text, and can navigate to a URI or handle a Click event."
  ,"sample.semanticzoom.data.item.RepeatButton.title": "RepeatButton"
  ,"sample.semanticzoom.data.item.RepeatButton.subtitle": "A button that raises its Click event repeatedly from the time it's pressed until it's released."
  ,"sample.semanticzoom.data.item.ToggleButton.title": "ToggleButton"
  ,"sample.semanticzoom.data.item.ToggleButton.subtitle": "A button that can be switched between two states like a CheckBox."
  ,"sample.semanticzoom.data.item.SplitButton.title": "SplitButton"
  ,"sample.semanticzoom.data.item.SplitButton.subtitle": "A two-part button that displays a flyout when its secondary part is clicked."
  ,"sample.semanticzoom.data.item.ToggleSplitButton.title": "ToggleSplitButton"
  ,"sample.semanticzoom.data.item.ToggleSplitButton.subtitle": "A version of the SplitButton where the activation target toggles on/off."
  ,"sample.semanticzoom.data.item.CheckBox.title": "CheckBox"
  ,"sample.semanticzoom.data.item.CheckBox.subtitle": "A control that a user can select or clear."
  ,"sample.semanticzoom.data.item.ColorPicker.title": "ColorPicker"
  ,"sample.semanticzoom.data.item.ColorPicker.subtitle": "A control that displays a selectable color spectrum."
  ,"sample.semanticzoom.data.item.ComboBox.title": "ComboBox"
  ,"sample.semanticzoom.data.item.ComboBox.subtitle": "A drop-down list of items a user can select from."
  ,"sample.semanticzoom.data.item.RadioButton.title": "RadioButton"
  ,"sample.semanticzoom.data.item.RadioButton.subtitle": "A control that allows a user to select a single option from a group of options."
  ,"sample.semanticzoom.data.item.RatingControl.title": "RatingControl"
  ,"sample.semanticzoom.data.item.RatingControl.subtitle": "Rate something 1 to 5 stars."
  ,"sample.semanticzoom.data.item.Slider.title": "Slider"
  ,"sample.semanticzoom.data.item.Slider.subtitle": "A control that lets the user select from a range of values by moving a Thumb control along a track."
  ,"sample.semanticzoom.data.item.ToggleSwitch.title": "ToggleSwitch"
  ,"sample.semanticzoom.data.item.ToggleSwitch.subtitle": "A switch that can be toggled between 2 states."
  ,"sample.semanticzoom.data.group.StatusAndInfo": "Status & info"
  ,"sample.semanticzoom.data.item.InfoBadge.title": "InfoBadge"
  ,"sample.semanticzoom.data.item.InfoBadge.subtitle": "An non-intrusive UI to display notifications or bring focus to an area."
  ,"sample.semanticzoom.data.item.InfoBar.title": "InfoBar"
  ,"sample.semanticzoom.data.item.InfoBar.subtitle": "An inline message to display app-wide status change information."
  ,"sample.semanticzoom.data.item.ProgressBar.title": "ProgressBar"
  ,"sample.semanticzoom.data.item.ProgressBar.subtitle": "Shows the apps progress on a task, or that the app is performing ongoing work that doesn't block user interaction."
  ,"sample.semanticzoom.data.item.ProgressRing.title": "ProgressRing"
  ,"sample.semanticzoom.data.item.ProgressRing.subtitle": "Shows the apps progress on a task, or that the app is performing ongoing work that does block user interaction."
  ,"sample.semanticzoom.data.item.ToolTip.title": "ToolTip"
  ,"sample.semanticzoom.data.item.ToolTip.subtitle": "Displays information for an element in a pop-up window."
  ,"sample.semanticzoom.data.group.DialogsAndFlyouts": "Dialogs & flyouts"
  ,"sample.semanticzoom.data.item.ContentDialog.title": "ContentDialog"
  ,"sample.semanticzoom.data.item.ContentDialog.subtitle": "A dialog box that can be customized to contain any XAML content."
  ,"sample.semanticzoom.data.item.Flyout.title": "Flyout"
  ,"sample.semanticzoom.data.item.Flyout.subtitle": "Shows contextual information and enables user interaction."
  ,"sample.semanticzoom.data.item.Popup.title": "Popup"
  ,"sample.semanticzoom.data.item.Popup.subtitle": "A UI element displaying temporary content over existing interface."
  ,"sample.semanticzoom.data.item.TeachingTip.title": "TeachingTip"
  ,"sample.semanticzoom.data.item.TeachingTip.subtitle": "A content-rich flyout for guiding users and enabling teaching moments."
  ,"sample.semanticzoom.data.group.Scrolling": "Scrolling"
  ,"sample.semanticzoom.data.item.AnnotatedScrollBar.title": "AnnotatedScrollBar"
  ,"sample.semanticzoom.data.item.AnnotatedScrollBar.subtitle": "A control that extends a regular vertical scrollbar's functionality for an easy navigation through large collections."
  ,"sample.semanticzoom.data.item.PipsPager.title": "PipsPager"
  ,"sample.semanticzoom.data.item.PipsPager.subtitle": "A control to let the user navigate through a paginated collection when the page numbers do not need to be visually known."
  ,"sample.semanticzoom.data.item.ScrollView.title": "ScrollView"
  ,"sample.semanticzoom.data.item.ScrollView.subtitle": "A container control that lets the user pan and zoom its content."
  ,"sample.semanticzoom.data.item.ScrollViewer.title": "ScrollViewer"
  ,"sample.semanticzoom.data.item.ScrollViewer.subtitle": "A container control that lets the user pan and zoom its content."
  ,"sample.semanticzoom.data.item.SemanticZoom.title": "SemanticZoom"
  ,"sample.semanticzoom.data.item.SemanticZoom.subtitle": "Lets the user zoom between two different views of a collection, making it easier to navigate through large collections of items."
  ,"sample.semanticzoom.data.group.Layout": "Layout"
  ,"sample.semanticzoom.data.item.Border.title": "Border"
  ,"sample.semanticzoom.data.item.Border.subtitle": "A container control that draws a boundary line, background, or both, around another object."
  ,"sample.semanticzoom.data.item.Canvas.title": "Canvas"
  ,"sample.semanticzoom.data.item.Canvas.subtitle": "A layout panel that supports absolute positioning of child elements relative to the top left corner of the canvas."
  ,"sample.semanticzoom.data.item.Expander.title": "Expander"
  ,"sample.semanticzoom.data.item.Expander.subtitle": "A container with a header that can be expanded to show a body with more content."
  ,"sample.semanticzoom.data.item.Grid.title": "Grid"
  ,"sample.semanticzoom.data.item.Grid.subtitle": "A layout panel that supports arranging child elements in rows and columns. "
  ,"sample.semanticzoom.data.item.RelativePanel.title": "RelativePanel"
  ,"sample.semanticzoom.data.item.RelativePanel.subtitle": "A panel that uses relationships between elements to define layout."
  ,"sample.semanticzoom.data.item.SplitView.title": "SplitView"
  ,"sample.semanticzoom.data.item.SplitView.subtitle": "A container that has 2 content areas, with multiple display options for the pane."
  ,"sample.semanticzoom.data.item.StackPanel.title": "StackPanel"
  ,"sample.semanticzoom.data.item.StackPanel.subtitle": "A layout panel that arranges child elements into a single line that can be oriented horizontally or vertically."
  ,"sample.semanticzoom.data.item.VariableSizedWrapGrid.title": "VariableSizedWrapGrid"
  ,"sample.semanticzoom.data.item.VariableSizedWrapGrid.subtitle": "A layout panel that supports arranging child elements in rows and columns. Each child element can span multiple rows and columns."
  ,"sample.semanticzoom.data.item.Viewbox.title": "Viewbox"
  ,"sample.semanticzoom.data.item.Viewbox.subtitle": "A container control that scales its content to a specified size."
  ,"sample.semanticzoom.data.group.Navigation": "Navigation"
  ,"sample.semanticzoom.data.item.BreadcrumbBar.title": "BreadcrumbBar"
  ,"sample.semanticzoom.data.item.BreadcrumbBar.subtitle": "Shows the trail of navigation taken to the current location."
  ,"sample.semanticzoom.data.item.NavigationView.title": "NavigationView"
  ,"sample.semanticzoom.data.item.NavigationView.subtitle": "Common vertical layout for top-level areas of your app via a collapsible navigation menu."
  ,"sample.semanticzoom.data.item.Pivot.title": "Pivot"
  ,"sample.semanticzoom.data.item.Pivot.subtitle": "Presents information from different sources in a tabbed view."
  ,"sample.semanticzoom.data.item.SelectorBar.title": "SelectorBar"
  ,"sample.semanticzoom.data.item.SelectorBar.subtitle": "Presents information from a small set of different sources. The user can pick one of them."
  ,"sample.semanticzoom.data.item.TabView.title": "TabView"
  ,"sample.semanticzoom.data.item.TabView.subtitle": "A control that displays a collection of tabs that can be used to display several documents."
  ,"sample.semanticzoom.data.group.Media": "Media"
  ,"sample.semanticzoom.data.item.AnimatedVisualPlayer.title": "AnimatedVisualPlayer"
  ,"sample.semanticzoom.data.item.AnimatedVisualPlayer.subtitle": "An element to render and control playback of motion graphics."
  ,"sample.semanticzoom.data.item.CaptureElementPreview.title": "Capture Element / Camera Preview"
  ,"sample.semanticzoom.data.item.CaptureElementPreview.subtitle": "A sample for doing a camera preview."
  ,"sample.semanticzoom.data.item.Image.title": "Image"
  ,"sample.semanticzoom.data.item.Image.subtitle": "A control to display image content."
  ,"sample.semanticzoom.data.item.MapControl.title": "MapControl"
  ,"sample.semanticzoom.data.item.MapControl.subtitle": "Displays a symbolic map of the Earth."
  ,"sample.semanticzoom.data.item.MediaPlayerElement.title": "MediaPlayerElement"
  ,"sample.semanticzoom.data.item.MediaPlayerElement.subtitle": "A control to display video and image content."
  ,"sample.semanticzoom.data.item.PersonPicture.title": "PersonPicture"
  ,"sample.semanticzoom.data.item.PersonPicture.subtitle": "Displays the picture of a person/contact."
  ,"sample.semanticzoom.data.item.Sound.title": "Sound"
  ,"sample.semanticzoom.data.item.Sound.subtitle": "A code-behind only API that enables 2D and 3D UI sounds on all XAML controls."
  ,"sample.semanticzoom.data.item.WebView2.title": "WebView2"
  ,"sample.semanticzoom.data.item.WebView2.subtitle": "A Microsoft Edge (Chromium) based control that hosts HTML content in an app."
  ,"sample.semanticzoom.data.group.Styles": "Styles"
  ,"sample.semanticzoom.data.item.Acrylic.title": "AcrylicBrush"
  ,"sample.semanticzoom.data.item.Acrylic.subtitle": "A translucent material recommended for panel backgrounds."
  ,"sample.semanticzoom.data.item.AnimatedIcon.title": "AnimatedIcon"
  ,"sample.semanticzoom.data.item.AnimatedIcon.subtitle": "An element that displays and controls an icon that animates when the user interacts with the control."
  ,"sample.semanticzoom.data.item.CompactSizing.title": "Compact Sizing"
  ,"sample.semanticzoom.data.item.CompactSizing.subtitle": "How to use a Resource Dictionary to enable compact sizing."
  ,"sample.semanticzoom.data.item.IconElement.title": "IconElement"
  ,"sample.semanticzoom.data.item.IconElement.subtitle": "Represents icon controls that use different image types as its content."
  ,"sample.semanticzoom.data.item.Line.title": "Line"
  ,"sample.semanticzoom.data.item.Line.subtitle": "Draws a straight line between two points."
  ,"sample.semanticzoom.data.item.Shape.title": "Shape"
  ,"sample.semanticzoom.data.item.Shape.subtitle": "How to draw shapes, such as ellipses, rectangles, and polygons."
  ,"sample.semanticzoom.data.item.RadialGradientBrush.title": "RadialGradientBrush"
  ,"sample.semanticzoom.data.item.RadialGradientBrush.subtitle": "A brush to show radial gradients."
  ,"sample.semanticzoom.data.item.SystemBackdrops.title": "System Backdrops (Mica/Acrylic)"
  ,"sample.semanticzoom.data.item.SystemBackdrops.subtitle": "System backdrops, like Mica and Acrylic, for app windows."
  ,"sample.semanticzoom.data.item.SystemBackdropElement.title": "SystemBackdropElement"
  ,"sample.semanticzoom.data.item.SystemBackdropElement.subtitle": "An element to host system backdrop materials."
  ,"sample.semanticzoom.data.item.ThemeShadow.title": "ThemeShadow"
  ,"sample.semanticzoom.data.item.ThemeShadow.subtitle": "Adds a depth-aware shadow to UI elements using system lighting."
  ,"sample.semanticzoom.data.group.Text": "Text"
  ,"sample.semanticzoom.data.item.AutoSuggestBox.title": "AutoSuggestBox"
  ,"sample.semanticzoom.data.item.AutoSuggestBox.subtitle": "A control to provide suggestions as a user is typing."
  ,"sample.semanticzoom.data.item.NumberBox.title": "NumberBox"
  ,"sample.semanticzoom.data.item.NumberBox.subtitle": "A text control used for numeric input and evaluation of algebraic equations."
  ,"sample.semanticzoom.data.item.PasswordBox.title": "PasswordBox"
  ,"sample.semanticzoom.data.item.PasswordBox.subtitle": "A control for entering passwords."
  ,"sample.semanticzoom.data.item.RichEditBox.title": "RichEditBox"
  ,"sample.semanticzoom.data.item.RichEditBox.subtitle": "A rich text editing control that supports formatted text, hyperlinks, and other rich content."
  ,"sample.semanticzoom.data.item.RichTextBlock.title": "RichTextBlock"
  ,"sample.semanticzoom.data.item.RichTextBlock.subtitle": "A control that displays formatted text, hyperlinks, inline images, and other rich content."
  ,"sample.semanticzoom.data.item.TextBlock.title": "TextBlock"
  ,"sample.semanticzoom.data.item.TextBlock.subtitle": "A lightweight control for displaying small amounts of text."
  ,"sample.semanticzoom.data.item.TextBox.title": "TextBox"
  ,"sample.semanticzoom.data.item.TextBox.subtitle": "A single-line or multi-line plain text field."
  ,"sample.semanticzoom.data.group.Motion": "Motion"
  ,"sample.semanticzoom.data.item.XamlCompInterop.title": "Animation interop"
  ,"sample.semanticzoom.data.item.XamlCompInterop.subtitle": "XAML and Composition interop allows you to animate elements using expressions, natural animations, and more."
  ,"sample.semanticzoom.data.item.ConnectedAnimation.title": "Connected Animation"
  ,"sample.semanticzoom.data.item.ConnectedAnimation.subtitle": "Connected animations continue elements during page navigation and help the user maintain their context between views."
  ,"sample.semanticzoom.data.item.EasingFunction.title": "Easing Functions"
  ,"sample.semanticzoom.data.item.EasingFunction.subtitle": "Easing is a way to manipulate the velocity of an object as it animates."
  ,"sample.semanticzoom.data.item.ImplicitTransition.title": "Implicit Transitions"
  ,"sample.semanticzoom.data.item.ImplicitTransition.subtitle": "Use Implicit Transitions to automatically animate changes to properties."
  ,"sample.semanticzoom.data.item.PageTransition.title": "Page Transitions"
  ,"sample.semanticzoom.data.item.PageTransition.subtitle": "Page transitions provide visual feedback about the relationship between pages."
  ,"sample.semanticzoom.data.item.ThemeTransition.title": "Theme Transitions"
  ,"sample.semanticzoom.data.item.ThemeTransition.subtitle": "Theme transitions are pre-packaged, easy-to-apply animations."
  ,"sample.semanticzoom.data.item.ParallaxView.title": "ParallaxView"
  ,"sample.semanticzoom.data.item.ParallaxView.subtitle": "A container control that provides the parallax effect when scrolling."
  ,"sample.semanticzoom.data.group.MultipleWindows": "Windowing"
  ,"sample.semanticzoom.data.item.AppWindow.title": "AppWindow"
  ,"sample.semanticzoom.data.item.AppWindow.subtitle": "A flexible, customizable window management system for app development."
  ,"sample.semanticzoom.data.item.AppWindowTitleBar.title": "AppWindowTitleBar"
  ,"sample.semanticzoom.data.item.AppWindowTitleBar.subtitle": "Provides control over the app window title bar."
  ,"sample.semanticzoom.data.item.CreateMultipleWindows.title": "Multiple windows"
  ,"sample.semanticzoom.data.item.CreateMultipleWindows.subtitle": "An example showing the creation of single-threaded top level Xaml windows."
  ,"sample.semanticzoom.data.item.TitleBar.title": "TitleBar"
  ,"sample.semanticzoom.data.item.TitleBar.subtitle": "An example showing how to use the default TitleBar control."
  ,"sample.semanticzoom.data.group.System": "System"
  ,"sample.semanticzoom.data.item.Clipboard.title": "Clipboard"
  ,"sample.semanticzoom.data.item.Clipboard.subtitle": "Copy and paste text, images, and files to and from the system Clipboard."
  ,"sample.semanticzoom.data.item.ContentIsland.title": "ContentIsland"
  ,"sample.semanticzoom.data.item.ContentIsland.subtitle": "Create ContentIslands to host other frameworks in your app."
  ,"sample.semanticzoom.data.item.StoragePickers.title": "Storage pickers"
  ,"sample.semanticzoom.data.item.StoragePickers.subtitle": "Select files and folders with modern system pickers."
  ,"sample.semanticzoom.data.group.Shell": "Shell"
  ,"sample.semanticzoom.data.item.AppNotification.title": "App notifications"
  ,"sample.semanticzoom.data.item.AppNotification.subtitle": "Send notifications that appear in the Action Center and as toast popups."
  ,"sample.semanticzoom.data.item.BadgeNotificationManager.title": "Badge notifications"
  ,"sample.semanticzoom.data.item.BadgeNotificationManager.subtitle": "Show numeric or icon badges on your app’s taskbar icon."
  ,"sample.semanticzoom.data.item.JumpList.title": "JumpList"
  ,"sample.semanticzoom.data.item.JumpList.subtitle": "Add custom tasks and groups to the app's taskbar jump list."
  ,"sample.scrollview.output": "Horizontal offset: {horizontal}; vertical offset: {vertical}; zoom: {zoom}; state: {state}."
  ,"sample.scrollview.state.idle": "Idle"
  ,"sample.scrollview.state.interaction": "Interaction"
  ,"sample.scrollview.state.inertia": "Inertia"
  ,"sample.scrollview.state.animation": "Animation"
  ,"sample.scrollview.image.grapes": "grapes"
  ,"sample.scrollview.image.rainier": "rainier"
  ,"sample.scrollview.image.sunset": "sunset"
  ,"sample.scrollview.image.treetops": "treetops"
  ,"sample.scrollview.image.valley": "valley"
  ,"sample.scrollview.image.leaves": "leaves"
  ,"sample.scrollview.image.carousel": "carousel"
  ,"sample.scrollview.image.bicycles": "bicycles"
  ,"sample.scrollview.image.pond": "pond"
  ,"sample.scrollview.image.marina": "marina"
  ,"sample.scrollview.image.beach": "beach"
  ,"sample.scrollview.image.rampart": "rampart"
  ,"sample.scrollview.image.mountain": "mountain"

  ,"text.navigationview-description": "The NavigationView control provides a common vertical layout for top-level areas of your app via a collapsible navigation menu."
  ,"sample.navigationview.default-header": "NavigationView with default PaneDisplayMode"
  ,"sample.navigationview.top-header": "NavigationView with PaneDisplayMode set to Top"
  ,"sample.navigationview.adaptive-header": "NavigationView that switches pane orientation based on window width"
  ,"sample.navigationview.tabs-header": "Tying selection and focus - Tabs"
  ,"sample.navigationview.data-binding-header": "Data binding"
  ,"sample.navigationview.footer-header": "NavigationView with Footer Menu Items"
  ,"sample.navigationview.hierarchical-header": "Hierarchical NavigationView"
  ,"sample.navigationview.api-header": "API in action"
  ,"sample.navigationview.default-description": "If you have five or more equally important navigation categories that should prominently appear on larger window widths, consider using a left navigation pane."
  ,"sample.navigationview.top-description": "If you have equally important navigation categories that should be de-emphasized relative to the content of your app, consider using a top navigation pane."
  ,"sample.navigationview.adaptive-description": "If you have equally important navigation categories and limited app content space, consider using a top navigation pane on larger window widths and a minimal left navigation pane on smaller window widths."
  ,"sample.navigationview.tabs-description": "For the tabs pattern, ensure that you unify selection and focus by setting the SelectionFollowsFocus property to Enabled. If using a Frame to swap out content, then navigating between items shouldn't be recorded into the Frame's navigation stack. Please see the C# in the sample below to understand how to do this."
  ,"sample.navigationview.data-binding-description": "When data binding, use the MenuItemsSource property to bind to an observable collection of items, and do not set the MenuItems property. In addition, set the MenuItemTemplate property and use a NavigationViewItem as the data template. If you wish to bind to the header content as well, use data template selectors via the MenuItemTemplateSelector property."
  ,"sample.navigationview.footer-description": "You can add clickable menu items to the footer of your NavigationView that participate in the same selection model as items in the main menu. In Top PaneDisplayMode, these items will appear aligned to the right of the NavigationView. In Left PaneDisplayMode, these items will appear aligned to the bottom of the NavigationView."
  ,"sample.navigationview.hierarchy-description-1": "NavigationView supports hierarchy in Left, LeftCompact, and Top display modes."
  ,"sample.navigationview.hierarchy-description-2": "In the example below, the \"Account\" tab navigates to its own page while \"Document options\" only opens its subtree of items. This is done by setting the SelectsOnInvoked property to false on the Document options NavigationView item."
  ,"sample.navigationview.hierarchy-description-3": "In both Top and Left modes, clicking the arrows on NavigationViewItems will expand or collapse the subtree. Clicking or tapping elsewhere on the NavigationViewItem will also collapse or expand the subtree."
  ,"sample.navigationview.hierarchy-description-4": "Switch between the three pane display modes on the right."
  ,"sample.navigationview.header-text": "This is Header Text"
  ,"sample.navigationview.menu-item-1": "Menu Item1"
  ,"sample.navigationview.menu-item-2": "Menu Item2"
  ,"sample.navigationview.menu-item-3": "Menu Item3"
  ,"sample.navigationview.menu-item-4": "Menu Item4"
  ,"sample.navigationview.item-1": "Item1"
  ,"sample.navigationview.item-2": "Item2"
  ,"sample.navigationview.item-3": "Item3"
  ,"sample.navigationview.item-4": "Item4"
  ,"sample.navigationview.sample-page": "Sample Page {number}"
  ,"sample.navigationview.settings-page": "Sample Settings Page"
  ,"sample.navigationview.lorem-title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
  ,"sample.navigationview.lorem-body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  ,"sample.navigationview.category": "Category {number}"
  ,"sample.navigationview.category-tooltip": "This is category {number}"
  ,"sample.navigationview.browse": "Browse"
  ,"sample.navigationview.track-order": "Track an Order"
  ,"sample.navigationview.order-history": "Order History"
  ,"sample.navigationview.account": "Account"
  ,"sample.navigationview.your-cart": "Your Cart"
  ,"sample.navigationview.help": "Help"
  ,"sample.navigationview.pane-position": "Pane position:"
  ,"sample.navigationview.pane-position-property": "PanePosition:"
  ,"sample.navigationview.left-mode": "Left mode"
  ,"sample.navigationview.top-mode": "Top mode"
  ,"sample.navigationview.left-compact-mode": "LeftCompact mode"
  ,"sample.navigationview.home": "Home"
  ,"sample.navigationview.mail": "Mail"
  ,"sample.navigationview.calendar": "Calendar"
  ,"sample.navigationview.document-options": "Document options"
  ,"sample.navigationview.create-new": "Create new"
  ,"sample.navigationview.upload-file": "Upload file"
  ,"sample.navigationview.settings-visible": "Settings item visible"
  ,"sample.navigationview.back-visible": "Back button visible"
  ,"sample.navigationview.back-enabled": "Back button enabled"
  ,"sample.navigationview.autosuggest-visible": "AutoSuggestBox visible"
  ,"sample.navigationview.header-label": "Header:"
  ,"sample.navigationview.header-value": "Header"
  ,"sample.navigationview.always-show-header": "Always show header"
  ,"sample.navigationview.pane-title-label": "PaneTitle:"
  ,"sample.navigationview.pane-title-value": "Pane Title"
  ,"sample.navigationview.pane-custom-visible": "PaneCustomContent visible"
  ,"sample.navigationview.pane-footer-visible": "PaneFooter visible"
  ,"sample.navigationview.left": "Left"
  ,"sample.navigationview.top": "Top"
  ,"sample.navigationview.keyboard-selection-follows-focus": "Keyboard SelectionFollowsFocus"
  ,"sample.navigationview.suppress-menu-item-2": "Selection of Menu Item2 suppressed"
  ,"sample.navigationview.actions": "Actions"
  ,"sample.navigationview.more-info": "More info"
  ,"sample.navigationview.search": "Search"
  ,"sample.navigationview.download": "Download"
  ,"sample.navigationview.favorite": "Favorite"
  ,"sample.navigationview.change-theme": "Change theme"
  ,"sample.navigationview.add-favorite": "Add to favorites"
  ,"sample.navigationview.remove-favorite": "Remove from favorites"
  ,"sample.navigationview.header-property": "Header property"
  ,"sample.navigationview.pane-title-property": "PaneTitle property"
  ,"sample.navigationview.lorem-short-body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  ,"sample.navigationview.selection-output": "Selected item: {item}. Navigated to: {page}."
  ,"sample.navigationview.no-selection": "No item selected."
  ,"sample.navigationview.settings-item": "Settings"
  ,"sample.animatedicon.page-title": "AnimatedIcon"
  ,"sample.animatedicon.page-description": "AnimatedIcon displays an animated icon created using Adobe AfterEffects and translated into Microsoft.UI.Composition objects using Lottie-Windows."
  ,"sample.animatedicon.button-header": "Adding AnimatedIcon to a button"
  ,"sample.animatedicon.navigation-header": "Adding AnimatedIcon to a NavigationView"
  ,"sample.animatedicon.button-description": "The following example is a button that the user clicks to load a search experience. The AnimatedIcon consumes the animation created using Adobe AfterEffects and translated into Microsoft.UI.Composition objects using "
  ,"sample.animatedicon.lottie": "Lottie-Windows"
  ,"sample.animatedicon.animation-guidance": ". For guidance on how to properly structure your animation file see the AnimatedIcon Guidance page."
  ,"sample.animatedicon.navigation-description": "If you set an AnimatedIcon as the value of the Icon property, the NavigationViewItem will set the states of the AnimatedIcon for you, according to the states of the control. For guidance on how to properly structure your animation file see the AnimatedIcon Guidance page."
  ,"sample.animatedicon.custom-animation-description": "For this example, this sets a custom animation GameSettingsIcon that was generated by the LottieGen tool."
  ,"sample.animatedicon.example-button-name": "AnimatedIcon Example"
  ,"sample.animatedicon.kind": "Kind"
  ,"sample.animatedicon.game-settings": "Game Settings"
  ,"sample.animatedicon.source.back": "Back"
  ,"sample.animatedicon.source.chevron-down-small": "Down Arrow"
  ,"sample.animatedicon.source.chevron-right-down-small": "Right / Down Arrow"
  ,"sample.animatedicon.source.chevron-up-down-small": "Up / Down Arrow"
  ,"sample.animatedicon.source.find": "Find"
  ,"sample.animatedicon.source.global-navigation-button": "Navigation Menu"
  ,"sample.animatedicon.source.settings": "Settings"
  ,"text.acrylicbrush": "AcrylicBrush"
  ,"sample.acrylic.adaptability-description": "Acrylic Brush might fall back to SolidColorBrush in certain scenarios. If you can't see the Acrylic effect, please refer to "
  ,"sample.acrylic.adaptability-link": "Acrylic brush adaptability documentation"
  ,"sample.acrylic.in-app-description": ". Acrylic Brush uses in-app acrylic. See "
  ,"sample.acrylic.system-backdrops-link": "SystemBackdrops (Mica/Acrylic)"
  ,"sample.acrylic.background-description": " for background acrylic."
  ,"sample.acrylic.default-header": "Default in-app acrylic brush."
  ,"sample.acrylic.custom-header": "Custom acrylic in-app brush."
  ,"sample.acrylic.luminosity-header": "Luminosity with in-app Acrylic."
  ,"sample.acrylic.tint-opacity": "Tint Opacity :"
  ,"sample.acrylic.tint-color": "Tint Color :"
  ,"sample.acrylic.fallback-color": "Fallback Color :"
  ,"sample.acrylic.tint-luminosity-opacity": "Tint Luminosity Opacity :"
  ,"sample.acrylic.tint-opacity-name": "tint opacity"
  ,"sample.acrylic.tint-color-name": "tint color"
  ,"sample.acrylic.fallback-color-name": "fallback color"
  ,"sample.acrylic.tint-luminosity-name": "tint luminosity"
  ,"sample.acrylic.color.black": "Black"
  ,"sample.acrylic.color.red": "Red"
  ,"sample.acrylic.color.blue": "Blue"
  ,"sample.acrylic.color.green": "Green"
  ,"sample.acrylic.color.yellow": "Yellow"
  ,"ComboBoxMigration_MappingMode": "MappingMode"
  ,"ComboBoxMigration_SpreadMethod": "SpreadMethod"
  ,"ComboBoxMigration_RelativeToBoundingBox": "RelativeToBoundingBox"
  ,"ComboBoxMigration_Absolute": "Absolute"
  ,"ComboBoxMigration_Pad": "Pad"
  ,"ComboBoxMigration_Reflect": "Reflect"
  ,"ComboBoxMigration_Repeat": "Repeat"
  ,"sample.radialgradient.page-title": "RadialGradientBrush"
  ,"sample.radialgradient.page-description": "Paints an area with a radial gradient. A center point defines the origin of the gradient, and an ellipse defines the outer bounds of the gradient."
  ,"sample.radialgradient.header": "RadialGradientBrush Sample"
  ,"sample.radialgradient.center-x": "Center.X"
  ,"sample.radialgradient.center-y": "Center.Y"
  ,"sample.radialgradient.radius-x": "RadiusX"
  ,"sample.radialgradient.radius-y": "RadiusY"
  ,"sample.radialgradient.origin-x": "GradientOrigin.X"
  ,"sample.radialgradient.origin-y": "GradientOrigin.Y"
  ,"sample.radialgradient.output-format": "MappingMode: {mappingMode}\nCenter: {center}\nRadiusX: {radiusX}, RadiusY: {radiusY}\nGradientOrigin: {origin}\nSpreadMethod: {spreadMethod}"
  ,"sample.compactsizing.description": "How to use a Resource Dictionary to enable compact sizing."
  ,"sample.compactsizing.supported-controls": "Controls that support compact styling:"
  ,"sample.compactsizing.supported-listview": "\u2022 ListView"
  ,"sample.compactsizing.supported-textbox": "\u2022 TextBox"
  ,"sample.compactsizing.supported-passwordbox": "\u2022 PasswordBox"
  ,"sample.compactsizing.supported-autosuggestbox": "\u2022 AutoSuggestBox"
  ,"sample.compactsizing.supported-combobox": "\u2022 ComboBox"
  ,"sample.compactsizing.supported-datepicker": "\u2022 DatePicker"
  ,"sample.compactsizing.supported-timepicker": "\u2022 TimePicker"
  ,"sample.compactsizing.supported-treeview": "\u2022 TreeView"
  ,"sample.compactsizing.supported-navigationview": "\u2022 NavigationView"
  ,"sample.compactsizing.supported-menubar": "\u2022 MenuBar"
  ,"sample.compactsizing.header": "Compact Sizing for controls"
  ,"sample.compactsizing.options-header": "Fluent Standard and Compact Sizing"
  ,"sample.compactsizing.standard": "Standard"
  ,"sample.compactsizing.compact": "Compact"
  ,"sample.compactsizing.standard-size": "Standard Size"
  ,"sample.compactsizing.compact-size": "Compact Size"
  ,"sample.compactsizing.first-name": "First Name:"
  ,"sample.compactsizing.last-name": "Last Name:"
  ,"sample.compactsizing.password": "Password:"
  ,"sample.compactsizing.confirm-password": "Confirm Password:"
  ,"sample.compactsizing.pick-date": "Pick a date"
  ,"sample.iconelement.bitmap-header": "A BitmapIcon with a multicolor bitmap image"
  ,"sample.iconelement.font-header": "A FontIcon using a glyph from a specific font family in a button"
  ,"sample.iconelement.bitmap-image-header": "A ImageIcon using a bitmap image in a button"
  ,"sample.iconelement.svg-image-header": "A ImageIcon using a SVG image in a button"
  ,"sample.iconelement.path-header": "A PathIcon in a button"
  ,"sample.iconelement.symbol-header": "A SymbolIcon in a button"
  ,"sample.iconelement.bitmap-description": "The ShowAsMonochrome property (true by default) will result in a solid block of the foreground color if the property is set to true and the icon is more than one color. This behavior can be ignored by setting the ShowAsMonochrome property to false."
  ,"sample.iconelement.font-description": "Use FontIcon as the icon for a control if you want to specify a Glyph value from a FontFamily. Windows 10 uses the Segoe MDL2 Assets FontFamily and that is what this example is showing."
  ,"sample.iconelement.image-description": "To use an ImageIcon as the icon for a control, you can set image that has a file format supported by the Image class. The two examples here show a PNG and SVG image as the icon."
  ,"sample.iconelement.path-description": "To use a PathIcon as the icon for a control, you specify the path data of the image you are trying to display. The path data draws a series of connected lines and curves."
  ,"sample.iconelement.symbol-description": "To use a SymbolIcon as the icon for a control, you specify the enum value for the glyph you would like to display. SymbolIcon's enum is based off of icons from the Segoe MDL2 font used by Windows 10."
  ,"sample.iconelement.monochrome": "Monochrome"
  ,"sample.iconelement.accept": "Accept"
};
