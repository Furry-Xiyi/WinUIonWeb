import catalogResources from './CatalogResources';
import systemBackdropElementResources from './SystemBackdropElementResources';
import systemBackdropResources from './SystemBackdropResources';
import titleBarResources from './TitleBarResources';
import multipleWindowsResources from './MultipleWindowsResources';

export default {
  ...multipleWindowsResources,
  ...titleBarResources,
  ...systemBackdropElementResources,
  ...systemBackdropResources,
  "text.tabview": "选项卡视图",
  "sample.tabview.multiple-views": "为应用显示多个视图",
  "sample.tabview.adding-header": "支持添加、关闭和重排选项卡的 TabView",
  "sample.tabview.markup-header": "在标记中定义 TabViewItem 的 TabView",
  "sample.tabview.binding-header": "绑定 MyData 对象集合的 TabView",
  "sample.tabview.keyboard-header": "支持键盘操作的 TabView",
  "sample.tabview.custom-header": "在 TabStripHeader 和 TabStripFooter 中放置自定义内容",
  "sample.tabview.width-header": "选项卡可以等宽、根据内容调整宽度，或在未选中时仅显示图标",
  "sample.tabview.close-header": "关闭按钮可以始终显示，也可以仅在悬停时显示",
  "sample.tabview.color-header": "使用彩色选项卡图标的 TabView",
  "sample.tabview.accent-header": "使用强调色选项卡栏背景的 TabView",
  "sample.tabview.window-header": "完整的 TabView 窗口示例",
  "sample.tabview.window-title": "TabView 应用窗口",
  "sample.tabview.document": "文档 {index}",
  "sample.tabview.mydata-document": "MyData 文档 {index}",
  "sample.tabview.keyboard-new": "- Ctrl+T 打开新选项卡",
  "sample.tabview.keyboard-close": "- Ctrl+W 关闭选中的选项卡",
  "sample.tabview.keyboard-number": "- Ctrl+1 至 Ctrl+8 选择对应编号的选项卡",
  "sample.tabview.keyboard-last": "- Ctrl+9 选择最后一个选项卡（不受选项卡数量影响）",
  "sample.tabview.custom-description": "可以在 TabStripHeader 和 TabStripFooter 区域中放置任意内容",
  "sample.tabview.custom-drag-region": "如果在应用标题栏区域中使用 TabView，请使用 TabStripFooter 指定自定义拖动区域",
  "sample.tabview.window-source-description": "请参阅 TabViewWindowingSamplePage.xaml 和对应的 .cs 文件，查看完整代码",
  "sample.tabview.strip-header": "选项卡栏页眉内容",
  "sample.tabview.strip-footer": "选项卡栏页脚内容",
  "sample.tabview.home": "主页",
  "sample.tabview.long-tab": "第 2 个选项卡的较长标题",
  "sample.tabview.third-tab": "第三个选项卡",
  "sample.tabview.width-option-header": "选项卡宽度行为",
  "sample.tabview.close-option-header": "TabViewItem 关闭按钮覆盖模式",
  "sample.tabview.size-to-content": "根据内容调整",
  "sample.tabview.equal": "等宽",
  "sample.tabview.compact": "紧凑",
  "sample.tabview.auto": "自动",
  "sample.tabview.always": "始终显示",
  "sample.tabview.on-hover": "悬停时显示",
  "sample.tabview.color-description": "使用 BitmapIcon.ShowAsMonochrome=\"False\" 在 TabViewItem 中显示全彩图标",
  "sample.tabview.command-prompt": "命令提示符",
  "sample.tabview.powershell": "PowerShell",
  "sample.tabview.linux": "适用于 Linux 的 Windows 子系统",
  "sample.tabview.launch": "点击启动示例",
  "sample.tabview.move-left": "向左移动选项卡",
  "sample.tabview.move-right": "向右移动选项卡",
  "sample.tabview.none": "无",
  "sample.tabview.selection-output": "选项卡数量：{count}\n选中索引：{index}\n选中项：{header}",
  "sample.tabview.window-item": "项目 {index}",
  "sample.tabview.window-page": "页面 {index}",
  "sample.tabview.window-new-item": "新项目",
  "sample.tabview.window-drag-description": "将选项卡拖离选项卡栏，在应用的内容区域放下，可打开新窗口。将选项卡放到另一个应用窗口的选项卡栏中，可将它移入该窗口。",
  "sample.tabview.window-state-description": "选项卡在新窗口中会保留原有状态。例如，打开切换开关后，将选项卡移入新窗口，开关仍保持打开。",
  "sample.tabview.window-progress-header": "开启进度环",
  "sample.tabview.window-opened": "已打开窗口：{id}",
  "sample.tabview.window-host-unavailable": "尚未连接窗口宿主。",
  "sample.tabview.window-cancelled": "窗口操作已取消。",
  "sample.tabview.window-failed": "窗口操作失败。",
  "sample.tabview.window-mode-browser": "浏览器窗口",
  "sample.tabview.window-mode-standalone": "独立应用窗口",
  "sample.tabview.window-mode-minimal-ui": "具有最少浏览器控件的应用窗口",
  "sample.tabview.window-mode-fullscreen": "全屏窗口",
  "sample.tabview.window-mode-window-controls-overlay": "具有叠加窗口控件的应用窗口",
  "sample.tabview.window-mode-none": "尚未验证",
  "sample.tabview.window-supported": "支持",
  "sample.tabview.window-not-supported": "不支持",
  "sample.tabview.window-not-verified": "尚未验证",
  "sample.tabview.window-display-mode": "实际显示模式：{mode}",
  "sample.tabview.window-connection-status": "窗口连接：{status}",
  "sample.tabview.window-status-NotRequested": "尚未请求",
  "sample.tabview.window-status-Opening": "正在等待窗口挂载",
  "sample.tabview.window-status-Ready": "已连接",
  "sample.tabview.window-status-Blocked": "已被浏览器阻止",
  "sample.tabview.window-status-Cancelled": "已取消",
  "sample.tabview.window-status-Failed": "失败",
  "sample.tabview.window-status-Unavailable": "连接已断开或目标不可用",
  "sample.tabview.window-transfer-capability": "已确认的应用选项卡转移：{support}",
  "sample.tabview.window-split-capability": "应用窗格拆分：{support}",
  "sample.tabview.window-native-drag-capability": "应用窗口间的选项卡拖动：{support}",
  "sample.tabview.window-native-capability": "浏览器选项卡的原生分离与拆分：{support}",
  "sample.tabview.window-capability-custom-host": "窗口和窗格能力由应用的框架宿主提供。",
  "sample.tabview.window-blocked": "浏览器阻止了新窗口。请允许此应用打开弹出窗口后重试。",
  "sample.tabview.window-unavailable": "目标窗口未就绪或已不可用，源选项卡已保留。",
  "sample.tabview.window-invalid-documents": "转移需要使用可序列化的应用文档。",
  "sample.tabview.window-connected": "已将 {count} 个选项卡转移至已连接的{mode}。",
  "sample.tabview.window-transferred": "已将 {header} 转移至已连接的{mode}，文档状态已保留。",
  "sample.tabview.window-drag-transferred": "已将 {count} 个选项卡移入此窗口，文档状态已保留。",
  "sample.tabview.sample-title": "没有人会单纯喜爱、追求或希望获得痛苦",
  "sample.tabview.sample-body": "没有人会单纯喜爱、追求或希望获得痛苦，因为痛苦就是痛苦。但有时劳作与痛苦能够带来更大的快乐。为了说明这一点，谁会在没有任何益处的情况下进行艰苦的锻炼？又有谁能责备一个选择没有不良后果的快乐的人，或一个避免无法带来快乐的痛苦的人？我们谴责那些被眼前的快乐迷惑、没有预见随之而来的痛苦和麻烦的人，也同样谴责那些因意志软弱而放弃职责的人。",
  "sample.tabview.sample-body-long": "没有人会单纯喜爱、追求或希望获得痛苦，因为痛苦就是痛苦。但有时劳作与痛苦能够带来更大的快乐。为了说明这一点，谁会在没有任何益处的情况下进行艰苦的锻炼？又有谁能责备一个选择没有不良后果的快乐的人，或一个避免无法带来快乐的痛苦的人？我们谴责那些被眼前的快乐迷惑、没有预见随之而来的痛苦和麻烦的人，也同样谴责那些因意志软弱而放弃职责的人。自由选择的时刻，当一切都取决于我们自己的判断，且没有任何障碍时，我们理应欢迎快乐并避免痛苦。",
  "text.a-simple-text-editor-with-richeditbox": "使用 RichEditBox 的简单文本编辑器。",
  "TextControls.RichEditBox.NewDocument": "新文档",
  ...catalogResources,
  "TextControls.RichEditBox.SimpleHeader": "使用 RichEditBox 的简单文本编辑器。",
  "TextControls.AutoSuggestBox.Label1": "基本自动建议框",
  "TextControls.NumberBox.Label1": "1 + 2^2",
  "TextControls.NumberBox.Label2": "带微调按钮的数字框",
  "TextControls.NumberBox.Label3": "0.00",
  "TextControls.PasswordBox.Label1": "简单密码框",
  "TextControls.PasswordBox.Label2": "示例密码框",
  "TextControls.RichEditBox.Label1": "简单文本编辑器",
  "TextControls.RichEditBox.Label2": "带自定义菜单的编辑器",
  "TextControls.RichEditBox.Label3": "它使用",
  "TextControls.RichEditBox.Label4": "Unicode 近纯文本数学编码",
  "TextControls.RichEditBox.Label5": "，以线性格式表示数学记号，并自动转换为数学公式。",
  "TextControls.RichEditBox.Label6": "在 RichEditBox 中启用数学模式会自动切换到 Cambria Math 字体。切换数学模式会清除现有内容和撤销历史。",
  "TextControls.RichEditBox.Label7": "",
  "TextControls.RichEditBox.Label8": "SetMathML",
  "TextControls.RichEditBox.Label9": "方法接收",
  "TextControls.RichEditBox.Label10": "MathML",
  "TextControls.RichEditBox.Label11": "字符串，并在",
  "TextControls.RichEditBox.Label12": "中显示公式，新公式会替换现有公式。",
  "TextControls.RichEditBox.Label13": "",
  "TextControls.RichEditBox.Label14": "GetMathML",
  "TextControls.RichEditBox.Label15": "方法从",
  "TextControls.RichEditBox.Label16": "中获取公式的 MathML 字符串。公式必须位于单行；多行时返回空字符串，但公式仍会正确显示。",
  "TextControls.RichEditBox.Label17": "使用这些方法前，需要在",
  "TextControls.RichEditBox.Label18": "中设置数学模式，可通过",
  "TextControls.RichEditBox.Label19": "SetMathMode(RichEditMathMode.MathOnly)",
  "TextControls.RichEditBox.Label20": ".",
  "TextControls.RichEditBox.Label21": "SetMathML",
  "TextControls.RichEditBox.Label22": "和",
  "TextControls.RichEditBox.Label23": "GetMathML",
  "TextControls.RichEditBox.Label24": "可用于恢复和保存公式。",
  "TextControls.RichTextBlock.Label1": "、",
  "TextControls.RichTextBlock.Label2": "、内联图像和其他富内容。",
  "TextControls.RichTextBlock.Label3": "Duis sed nulla metus, id hendrerit velit. Curabitur dolor purus, bibendum eu cursus lacinia, interdum vel augue. Aenean euismod eros et sapien vehicula dictum. Duis ullamcorper, turpis nec feugiat tincidunt, dui erat luctus risus, aliquam accumsan lacus est vel quam. Nunc lacus massa, varius eget accumsan id, congue sed orci. Duis dignissim hendrerit egestas. Proin ut turpis magna, sit amet porta erat. Nunc semper metus nec magna imperdiet nec vestibulum dui fringilla. Sed sed ante libero, nec porttitor mi. Ut luctus, neque vitae placerat egestas, urna leo auctor magna, sit amet ultricies ipsum felis quis sapien. Proin eleifend varius dui, at vestibulum nunc consectetur nec. Mauris nulla elit, ultrices a sodales non, aliquam ac est. Quisque sit amet risus nulla. Quisque vestibulum posuere velit, vitae vestibulum eros scelerisque sit amet. In in risus est, at laoreet dolor. Nullam aliquet pellentesque convallis. Ut vel tincidunt nulla. Mauris auctor tincidunt auctor. Aenean orci ante, vulputate ac sagittis sit amet, consequat at mi. Morbi elementum purus consectetur nisi adipiscing vitae blandit sapien placerat. Aliquam adipiscing tortor non sem lobortis consectetur mattis felis rhoncus. Nunc eu nunc rhoncus arcu sollicitudin ultrices. In vulputate eros in mauris aliquam id dignissim nisl laoreet.",
  "TextControls.RichTextBlock.Label4": "第一个溢出容器",
  "TextControls.RichTextBlock.Label5": "第二个溢出容器",
  "TextControls.RichTextBlock.Label6": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
  "TextControls.TextBlock.Label1": "，",
  "TextControls.TextBlock.Label2": "，或者",
  "TextControls.TextBlock.Label3": "。",
  "TextControls.TextBox.Label1": "简单文本框",
  "TextControls.TextBox.Label2": "自定义文本框",
  "TextControls.TextBox.Label3": "多行文本框",
  "TextControls.CatBreeds": "Abyssinian|Aegean|American Bobtail|American Curl|American Ringtail|American Shorthair|American Wirehair|Aphrodite Giant|Arabian Mau|Asian cat|Asian Semi-longhair|Australian Mist|Balinese|Bambino|Bengal|Birman|Brazilian Shorthair|British Longhair|British Shorthair|Burmese|Burmilla|California Spangled|Chantilly-Tiffany|Chartreux|Chausie|Colorpoint Shorthair|Cornish Rex|Cymric|Cyprus|Devon Rex|Donskoy|Dragon Li|Dwelf|Egyptian Mau|European Shorthair|Exotic Shorthair|Foldex|German Rex|Havana Brown|Highlander|Himalayan|Japanese Bobtail|Javanese|Kanaani|Khao Manee|Kinkalow|Korat|Korean Bobtail|Korn Ja|Kurilian Bobtail|Lambkin|LaPerm|Lykoi|Maine Coon|Manx|Mekong Bobtail|Minskin|Napoleon|Munchkin|Nebelung|Norwegian Forest Cat|Ocicat|Ojos Azules|Oregon Rex|Persian (modern)|Persian (traditional)|Peterbald|Pixie-bob|Ragamuffin|Ragdoll|Raas|Russian Blue|Russian White|Sam Sawet|Savannah|Scottish Fold|Selkirk Rex|Serengeti|Serrade Petit|Siamese|Siberian or´Siberian Forest Cat|Singapura|Snowshoe|Sokoke|Somali|Sphynx|Suphalak|Thai|Thai Lilac|Tonkinese|Toyger|Turkish Angora|Turkish Van|Turkish Vankedisi|Ukrainian Levkoy|Wila Krungthep|York Chocolate",
  "TextControls.NoMathML": "<!-- 暂无 MathML 内容 -->",
  "TextControls.Strikethrough": "删除线",
  "TextControls.Control.XamlResources": "用于共享值的可重用定义，以确保一致性和可维护性。",
  "TextControls.Control.XamlStyles": "XAML 样式是一组可重用的属性设置，用于定义一致的界面设计元素。",
  "TextControls.Control.Binding": "将界面元素连接到数据，以实现自动同步和更新。",
  "TextControls.Control.Templates": "在 XAML 中自定义控件外观、项目布局和数据呈现。",
  "TextControls.Control.CustomUserControls": "创建具有自定义功能和外观的可重用界面组件。",
  "TextControls.Control.CustomXamlConditionals": "定义在解析时通过 IXamlCondition 求值的自定义 XAML 条件。",
  "TextControls.Control.ScratchPad": "用于测试简单 XAML 标记的草稿板。",
  "TextControls.Control.Color": "均衡的色彩设计创造清晰、美观和谐的界面。",
  "TextControls.Control.Geometry": "清晰的几何设计确保视觉一致性和结构。",
  "TextControls.Control.Iconography": "图标是一种视觉设计语言，可以快速有效地传递信息。",
  "TextControls.Control.Spacing": "合理的间距设计提高可读性和流畅度。",
  "TextControls.Control.Typography": "版式设计通过直观的字体和层次引导注意力。",
  "TextControls.Control.AccessibilityColorContrast": "高对比度设计确保所有用户都能访问界面。",
  "TextControls.Control.AccessibilityKeyboard": "支持键盘的设计让交互更加顺畅。",
  "TextControls.Control.AccessibilityScreenReader": "包容性设计为辅助技术提供有意义的内容。",
  "TextControls.Control.AppBarButton": "专为在 CommandBar 中使用而设计的按钮。",
  "TextControls.Control.AppBarSeparator": "用于在应用栏中直观分隔命令组的垂直线。",
  "TextControls.Control.AppBarToggleButton": "具有开、关或不确定状态的按钮，类似复选框，用于应用栏或其他专用界面。",
  "TextControls.Control.CommandBar": "用于显示应用专用命令并处理内容布局和大小调整的工具栏。",
  "TextControls.Control.CommandBarFlyout": "命令栏浮出面板可通过显示与界面画布上某个元素相关的浮动工具栏命令，让用户轻松访问常见任务。",
  "TextControls.Control.MenuBar": "菜单栏简化了应用基本菜单系统的创建。它开箱即用、几乎无需自定义，支持键盘快捷键，并会自动针对不同输入类型和设备调整界面。",
  "TextControls.Control.MenuFlyout": "菜单浮出面板显示轻量级命令菜单，可附加到按钮和其他控件。",
  "TextControls.Control.SwipeControl": "用于对项目快速执行菜单操作的触摸手势。",
  "TextControls.Control.StandardUICommand": "StandardUICommand 是内置的 XamlUICommand，表示“保存”等常用命令。",
  "TextControls.Control.XamlUICommand": "用于定义给定命令外观和体验的对象。",
  "TextControls.Control.FlipView": "翻页视图允许用户逐项翻阅项目集合。它非常适合显示图库中的图像或产品详情页中的项目。",
  "TextControls.Control.GridView": "网格视图允许用户浏览并选择按网格布局排列的项目集合。",
  "TextControls.Control.ItemsRepeater": "ItemsRepeater 是用于显示重复数据的轻量控件。它可通过灵活的布局选项高度自定义，并支持虚拟化布局。当你需要比 ListView 或 GridView 更强的布局控制时，可以使用 ItemsRepeater。",
  "TextControls.Control.ItemsView": "ItemsView 控件显示数据项集合，并提供灵活的项目布局、选择和调用方式。",
  "TextControls.Control.ListView": "以垂直列表呈现项目集合的控件。",
  "TextControls.Control.PullToRefresh": "允许用户在触控设备上从顶部下拉刷新内容的容器。",
  "TextControls.Control.TreeView": "树视图控件是一种分层列表模式，包含可展开和折叠的嵌套节点。",
  "TextControls.Control.CalendarDatePicker": "日历日期选取器是一个下拉控件，专为从日历视图中选择单个日期而优化，适用于星期几或日历忙闲等上下文信息很重要的场景。你可以修改日历以提供更多上下文，或限制可选日期。",
  "TextControls.Control.CalendarView": "日历视图提供标准方式，让用户查看日历并与之交互。如果只需要让用户选择日期，请考虑使用日历日期选取器。如果需要让用户选择多个日期，则必须使用日历视图。",
  "TextControls.Control.DatePicker": "使用日期选取器让用户在应用中设置日期，例如安排约会。日期选取器显示月、日、年三个控件。这些控件易于通过触控或鼠标使用，并可通过多种方式设置样式和配置。",
  "TextControls.Control.TimePicker": "使用时间选取器让用户在应用中设置时间，例如设置提醒。时间选取器显示小时、分钟和上午/下午三个控件。这些控件易于通过触控或鼠标使用，并可通过多种方式设置样式和配置。",
  "TextControls.Control.Button": "响应用户输入并触发 Click 事件的控件。",
  "TextControls.Control.DropDownButton": "点击时显示选项浮出面板的按钮。",
  "TextControls.Control.HyperlinkButton": "显示为超链接的按钮。",
  "TextControls.Control.RepeatButton": "从按下到松开期间会反复触发 Click 事件的按钮。",
  "TextControls.Control.ToggleButton": "切换按钮看起来像按钮，但工作方式类似复选框。它通常有两种状态：选中（开）或未选中（关）；如果 IsThreeState 属性为 true，也可以是不确定状态。可以通过 IsChecked 属性确定其状态。",
  "TextControls.Control.SplitButton": "拆分按钮类似下拉按钮，但额外提供一个执行点击区域。它适用于希望用户既能调用命令又能作出选择的场景。",
  "TextControls.Control.ToggleSplitButton": "可开关并带有附加下拉选项的按钮。",
  "TextControls.Control.CheckBox": "用户可以选中或清除的控件。",
  "TextControls.Control.ColorPicker": "允许用户通过色谱、滑块和文本输入选择颜色的控件。",
  "TextControls.Control.ComboBox": "用户可以从中选择项目的下拉列表。",
  "TextControls.Control.RadioButton": "允许用户从一组选项中选择单个选项的控件。",
  "TextControls.Control.RatingControl": "评级控件允许用户查看和设置反映其对内容和服务满意程度的评级。",
  "TextControls.Control.Slider": "使用滑块让用户沿轨道移动滑块来设置值。当用户认为该值是相对量而不是精确数值时，滑块是很好的选择。",
  "TextControls.Control.ToggleSwitch": "使用切换开关控件向用户呈现两个完全互斥的选项（如开/关），选择后会立即提交。切换开关应只有一个标签。",
  "TextControls.Control.InfoBadge": "徽章是一种不打扰用户且直观的方式，用于显示通知或将注意力引导到应用中的某个区域，例如通知、新内容提示或警报。InfoBadge 是一小块可添加到应用中的界面元素，可自定义显示数字、图标或简单圆点。",
  "TextControls.Control.InfoBar": "当需要告知用户、让用户确认或针对应用状态变化执行操作时，请使用 InfoBar 控件。默认情况下，通知会保留在内容区域中直到用户关闭，但不一定会打断用户流程。",
  "TextControls.Control.ProgressBar": "ProgressBar 有两种不同的视觉表示形式：不确定状态表示任务正在进行，确定状态表示已知工作量的完成进度。",
  "TextControls.Control.ProgressRing": "ProgressRing 有两种不同的视觉表示形式：不确定状态表示任务正在进行，但会阻止用户交互；确定状态表示已知工作量的完成进度。",
  "TextControls.Control.ToolTip": "ToolTip 显示有关界面元素的更多信息。它可以说明元素的功能或用户应执行的操作。当用户将鼠标悬停在界面元素上或长按该元素时，会显示 ToolTip。",
  "TextControls.Control.ContentDialog": "使用内容对话框显示相关信息，或提供需要用户操作的模态对话框体验。",
  "TextControls.Control.Flyout": "浮出面板用于显示轻量级界面，可以展示信息，也可以要求用户交互。不同于对话框，点击或点按外部区域、按设备返回键或按 Esc 键都可以轻量关闭浮出面板。",
  "TextControls.Control.Popup": "在应用窗口边界内的现有内容之上显示内容。对于应显示在其他界面之上的临时内容，请使用弹出控件。",
  "TextControls.Control.TeachingTip": "教学提示是用于提供上下文相关信息的通知浮出控件。它支持丰富内容（包括标题、副标题、图标、图像和文本），并可配置为显式关闭或轻量关闭。",
  "TextControls.Control.AnnotatedScrollBar": "扩展普通垂直滚动条，方便浏览大型集合。",
  "TextControls.Control.PipsPager": "PipsPager 允许用户在分页集合中导航，并且独立于所显示的内容。当布局中的内容没有明确按相关性排序，或需要使用字形表示编号页面时，请使用此控件。PipsPager 常用于照片查看器、应用列表、轮播以及显示空间有限的场景。",
  "TextControls.Control.ScrollView": "允许用户平移和缩放内容的容器控件。",
  "TextControls.Control.ScrollViewer": "允许用户平移和缩放内容的容器控件。",
  "TextControls.Control.SemanticZoom": "SemanticZoom 可用两种不同方式显示分组数据，适合快速浏览大型数据集。",
  "TextControls.Control.Border": "在其他对象周围绘制边框、背景或两者的容器。",
  "TextControls.Control.Canvas": "定义一个区域，你可以在其中使用相对于画布区域的坐标显式定位子元素。",
  "TextControls.Control.Expander": "展开器控件可显示或隐藏与始终可见的主要内容相关但重要性较低的内容。标题中的项目始终可见。用户可以展开或折叠内容区域以显示正文内容。",
  "TextControls.Control.Grid": "网格是一个布局面板，支持按行和列排列子元素。",
  "TextControls.Control.RelativePanel": "一个面板，可让你相对于其他子元素或父面板定位和对齐子元素。",
  "TextControls.Control.SplitView": "包含两个视图的容器；一个视图用于主要内容，另一个通常用于导航命令。",
  "TextControls.Control.StackPanel": "堆叠面板可将子元素排列成水平或垂直方向的一条线。",
  "TextControls.Control.VariableSizedWrapGrid": "按顺序定位子元素，从左到右排列，并在到达容器边缘时换到下一行。",
  "TextControls.Control.Viewbox": "一个容器控件，可缩放其内容以填充可用空间。",
  "TextControls.Control.BreadcrumbBar": "面包屑导航栏控件提供常见的水平布局，用于显示到达当前位置所经过的导航路径。调整窗口大小可查看节点从根节点开始逐步折叠。",
  "TextControls.Control.NavigationView": "通过可折叠的导航菜单实现应用顶层区域的常见纵向布局。",
  "TextControls.Control.Pivot": "不建议在 Windows 11 设计模式中使用 Pivot。请改用 SelectorBar 和 SelectorBarItem。Pivot 可在选项卡视图中显示来自不同来源的项目集合。",
  "TextControls.Control.SelectorBar": "SelectorBar 控件允许用户从内联项目列表中选择不同视图、页面或集合。",
  "TextControls.Control.TabView": "显示选项卡集合的控件，可用于显示多个文档。",
  "TextControls.Control.AnimatedVisualPlayer": "用于呈现动态图形并控制其播放的元素。",
  "TextControls.Control.CaptureElementPreview": "可以使用 MediaPlayerElement 控件和 MediaCapture 对象显示相机预览。",
  "TextControls.Control.Image": "可以使用 Image 控件显示和缩放图像。",
  "TextControls.Control.MapControl": "显示地球的符号地图。",
  "TextControls.Control.MediaPlayerElement": "可以使用媒体播放器元素控件播放视频和显示图像。可以显示传输控件或使视频自动播放。",
  "TextControls.Control.PersonPicture": "显示人员或联系人的图片。",
  "TextControls.Control.Sound": "仅通过代码调用的 API，可为所有 XAML 控件提供二维和三维界面音效。",
  "TextControls.Control.WebView2": "基于 Microsoft Edge（Chromium），在应用中承载 HTML 内容的控件。",
  "TextControls.Control.Acrylic": "建议用于面板背景的半透明材质。",
  "TextControls.Control.AnimatedIcon": "显示并控制图标的元素，图标可在用户与控件交互时播放动画。",
  "TextControls.Control.CompactSizing": "通过资源字典启用紧凑尺寸。",
  "TextControls.Control.IconElement": "表示使用不同图像类型作为内容的图标控件。",
  "TextControls.Control.Line": "在两个点之间绘制一条直线。",
  "TextControls.Control.Shape": "绘制椭圆、矩形等形状的方法。",
  "TextControls.Control.RadialGradientBrush": "用于绘制径向渐变的画笔。",
  "TextControls.Control.SystemBackdrops": "应用窗口的云母、亚克力等系统背景。",
  "TextControls.Control.SystemBackdropElement": "承载系统背景材质的元素。",
  "TextControls.Control.ThemeShadow": "使用系统光照为界面元素添加具有深度感的阴影。",
  "TextControls.Control.AutoSuggestBox": "使用自动建议框提供建议列表，供用户在输入时选择。",
  "TextControls.Control.NumberBox": "数字框控件允许用户输入数字。它支持验证、步进，以及计算基本方程等内联表达式。",
  "TextControls.Control.PasswordBox": "用于输入密码的控件。",
  "TextControls.Control.RichEditBox": "富文本编辑框控件允许用户输入加粗、斜体和下划线等格式化文本。富文本编辑框还可以显示和编辑富文本格式（.rtf）文件。",
  "TextControls.Control.RichTextBlock": "RichTextBlock 提供富文本显示容器，支持格式化文本、超链接、内联图像和其他富内容。",
  "TextControls.Control.TextBlock": "文本块控件为不需要交互的场景提供灵活的文本显示选项。它支持富文本格式、加粗和斜体等内联元素，以及文本选择。",
  "TextControls.Control.TextBox": "使用文本框让用户在应用中输入简单文本。你可以通过多种方式自定义文本框以满足需求。",
  "TextControls.Control.XamlCompInterop": "通过 XAML 与 Composition 互操作，使用表达式、自然动画等为元素添加动画。",
  "TextControls.Control.ConnectedAnimation": "连接动画在页面导航过程中延续元素，帮助用户保持视图之间的上下文。",
  "TextControls.Control.EasingFunction": "缓动用于控制对象在动画过程中运动速度的变化。",
  "TextControls.Control.ImplicitTransition": "使用隐式过渡自动为属性变化添加动画。",
  "TextControls.Control.PageTransition": "页面过渡为页面之间的关系提供视觉反馈。",
  "TextControls.Control.ThemeTransition": "主题过渡是预先打包、易于应用的动画。",
  "TextControls.Control.ParallaxView": "ParallaxView 控件可创建一种视觉效果，使靠近观看者的项目比背景中的项目移动得更快。",
  "TextControls.Control.AppWindow": "灵活、可定制的应用窗口管理系统。",
  "TextControls.Control.AppWindowTitleBar": "控制应用窗口的标题栏。",
  "TextControls.Control.CreateMultipleWindows": "创建单线程顶层 XAML 窗口的示例。",
  "TextControls.Control.TitleBar": "使用默认 TitleBar 控件的示例。",
  "TextControls.Control.Clipboard": "通过系统剪贴板复制和粘贴文本、图像和文件。",
  "TextControls.Control.ContentIsland": "创建 ContentIsland，在应用中承载其他框架。",
  "TextControls.Control.StoragePickers": "通过现代选取器选择文件和文件夹。",
  "TextControls.Control.AppNotification": "发送出现在操作中心和弹出通知中的通知。",
  "TextControls.Control.BadgeNotificationManager": "在应用任务栏图标上显示数字或图标徽章。",
  "TextControls.Control.JumpList": "为应用的任务栏跳转列表添加自定义任务和分组。",
  "ButtonMigration_ShowWindow": "显示窗口",
  "ButtonMigration_Submit": "提交",
  "ButtonMigration_Accept": "接受",
  "ButtonMigration_GeometryBody": "正文",
  "sample.listbox.selected-color": "所选颜色：{color}",
  "app.shortTitle": "WinUI on Web 图库",
  "app.title": "WinUI on Web 图库",
  "app.version": "1.0.0-Insider",
  "app.author": "惜忆想睡觉",
  "search.placeholder": "搜索控件和示例...",
  "search.no-results": "没有匹配搜索内容的结果。",
  "text.submit-query": "提交搜索",
  "text.no-results-found": "未找到结果",
  "gallery.page-header.api-details": "API 详细信息",
  "gallery.page-header.api-tooltip": "API 命名空间和继承关系",
  "gallery.page-header.documentation": "文档",
  "gallery.page-header.source": "源代码",
  "gallery.page-header.source-code": "源代码",
  "gallery.page-header.source-code-tooltip": "此示例页的源代码",
  "gallery.page-header.control-source": "控件源代码",
  "gallery.page-header.sample-page-source": "示例页源代码",
  "gallery.page-header.toggle-theme": "切换主题",
  "gallery.page-header.copy-link": "复制链接",
  "gallery.page-header.favorite": "收藏示例",
  "gallery.page-header.namespace": "命名空间",
  "gallery.page-header.inheritance": "继承关系",
  "gallery.page-header.this-control": "此控件",
  "gallery.page-header.this-sample-page": "此示例页",
  "gallery.page-header.source-code-of": "源代码：",
  "text.a-2-state-checkbox": "双状态复选框",
  "text.a-basic-autosuggestbox": "基本自动建议框",
  "text.a-basic-calendar-view": "基本日历视图。",
  "sample.calendarview.is-group-label-visible": "显示分组标签",
  "sample.calendarview.is-out-of-scope-enabled": "启用范围外日期",
  "sample.calendarview.selection-mode": "选择模式",
  "sample.calendarview.calendar-identifier": "日历类型",
  "sample.calendarview.language": "语言",
  "sample.calendarview.selection.None": "不选择",
  "sample.calendarview.selection.Single": "单选",
  "sample.calendarview.selection.Multiple": "多选",
  "sample.calendarview.calendar.GregorianCalendar": "公历",
  "sample.calendarview.calendar.HebrewCalendar": "希伯来历",
  "sample.calendarview.calendar.HijriCalendar": "回历",
  "sample.calendarview.calendar.JapaneseCalendar": "日本历",
  "sample.calendarview.calendar.JulianCalendar": "儒略历",
  "sample.calendarview.calendar.KoreanCalendar": "韩国历",
  "sample.calendarview.calendar.PersianCalendar": "波斯历",
  "sample.calendarview.calendar.TaiwanCalendar": "民国历",
  "sample.calendarview.calendar.ThaiCalendar": "泰国历",
  "sample.calendarview.calendar.UmAlQuraCalendar": "乌姆库拉历",
  "sample.calendarview.language.en": "英语",
  "sample.calendarview.language.ar": "阿拉伯语",
  "sample.calendarview.language.af": "南非荷兰语",
  "sample.calendarview.language.sq": "阿尔巴尼亚语",
  "sample.calendarview.language.am": "阿姆哈拉语",
  "sample.calendarview.language.hy": "亚美尼亚语",
  "sample.calendarview.language.as": "阿萨姆语",
  "sample.calendarview.language.az": "阿塞拜疆语",
  "sample.calendarview.language.eu": "巴斯克语",
  "sample.calendarview.language.be": "白俄罗斯语",
  "sample.calendarview.language.bn": "孟加拉语",
  "sample.calendarview.language.bs": "波斯尼亚语",
  "sample.calendarview.language.bg": "保加利亚语",
  "sample.calendarview.language.ca": "加泰罗尼亚语",
  "sample.calendarview.language.zh": "中文（简体）",
  "sample.calendarview.language.hr": "克罗地亚语",
  "sample.calendarview.language.cs": "捷克语",
  "sample.calendarview.language.da": "丹麦语",
  "sample.calendarview.language.prs": "达里语",
  "sample.calendarview.language.nl": "荷兰语",
  "sample.calendarview.language.et": "爱沙尼亚语",
  "sample.calendarview.language.fil": "菲律宾语",
  "sample.calendarview.language.fi": "芬兰语",
  "sample.calendarview.language.fr": "法语",
  "sample.calendarview.language.gl": "加利西亚语",
  "sample.calendarview.language.ka": "格鲁吉亚语",
  "sample.calendarview.language.de": "德语",
  "sample.calendarview.language.el": "希腊语",
  "sample.calendarview.language.gu": "古吉拉特语",
  "sample.calendarview.language.ha": "豪萨语",
  "sample.calendarview.language.he": "希伯来语",
  "sample.calendarview.language.hi": "印地语",
  "sample.calendarview.language.hu": "匈牙利语",
  "sample.calendarview.language.is": "冰岛语",
  "sample.calendarview.language.id": "印度尼西亚语",
  "sample.calendarview.language.ga": "爱尔兰语",
  "sample.calendarview.language.xh": "科萨语",
  "sample.calendarview.language.zu": "祖鲁语",
  "sample.calendarview.language.it": "意大利语",
  "sample.calendarview.language.ja": "日语",
  "sample.calendarview.language.kn": "卡纳达语",
  "sample.calendarview.language.kk": "哈萨克语",
  "sample.calendarview.language.km": "高棉语",
  "sample.calendarview.language.rw": "卢旺达语",
  "sample.calendarview.language.sw": "斯瓦希里语",
  "sample.calendarview.language.kok": "孔卡尼语",
  "sample.calendarview.language.ko": "韩语",
  "sample.calendarview.language.lo": "老挝语",
  "sample.calendarview.language.lv": "拉脱维亚语",
  "sample.calendarview.language.lt": "立陶宛语",
  "sample.calendarview.language.lb": "卢森堡语",
  "sample.calendarview.language.mk": "马其顿语",
  "sample.calendarview.language.ms": "马来语",
  "sample.calendarview.language.ml": "马拉雅拉姆语",
  "sample.calendarview.language.mt": "马耳他语",
  "sample.calendarview.language.mi": "毛利语",
  "sample.calendarview.language.mr": "马拉地语",
  "sample.calendarview.language.ne": "尼泊尔语",
  "sample.calendarview.language.nb": "挪威语",
  "sample.calendarview.language.or": "奥里亚语",
  "sample.calendarview.language.fa": "波斯语",
  "sample.calendarview.language.pl": "波兰语",
  "sample.calendarview.language.pt": "葡萄牙语",
  "sample.calendarview.language.pa": "旁遮普语",
  "sample.calendarview.language.quz": "克丘亚语",
  "sample.calendarview.language.ro": "罗马尼亚语",
  "sample.calendarview.language.ru": "俄语",
  "sample.calendarview.language.sr": "塞尔维亚语（拉丁字母）",
  "sample.calendarview.language.nso": "北索托语",
  "sample.calendarview.language.tn": "茨瓦纳语",
  "sample.calendarview.language.si": "僧伽罗语",
  "sample.calendarview.language.sk": "斯洛伐克语",
  "sample.calendarview.language.sl": "斯洛文尼亚语",
  "sample.calendarview.language.es": "西班牙语",
  "sample.calendarview.language.sv": "瑞典语",
  "sample.calendarview.language.ta": "泰米尔语",
  "sample.calendarview.language.te": "泰卢固语",
  "sample.calendarview.language.th": "泰语",
  "sample.calendarview.language.ti": "提格利尼亚语",
  "sample.calendarview.language.tr": "土耳其语",
  "sample.calendarview.language.uk": "乌克兰语",
  "sample.calendarview.language.ur": "乌尔都语",
  "sample.calendarview.language.uz": "乌兹别克语（拉丁字母）",
  "sample.calendarview.language.vi": "越南语",
  "sample.calendarview.language.cy": "威尔士语",
  "sample.calendarview.language.wo": "沃洛夫语",
  "text.a-basic-content-dialog-with-content": "包含内容的基本内容对话框。",
  "text.a-basic-splitview": "基本拆分视图",
  "text.a-button-that-appears-as-a-hyperlink": "显示为超链接的按钮。",
  "text.a-button-that-can-be-on-or-off": "可以打开或关闭的按钮。",
  "text.a-button-that-can-be-toggled-on-off-with-additio": "可开关并带有附加下拉选项的按钮。",
  "text.a-button-that-displays-a-flyout-of-choices-when": "点击时显示选项浮出面板的按钮。",
  "text.a-button-that-raises-its-click-event-repeatedly": "按住时会反复触发点击事件的按钮。",
  "text.a-button-that-raises-its-click-event-repeatedly-ecf7f2": "从按下到松开期间会反复触发 Click 事件的按钮。",
  "text.a-button-with-a-flyout": "带浮出面板的按钮",
  "text.a-button-with-a-primary-action-and-a-secondary-m": "包含主要操作和辅助菜单的按钮。",
  "text.a-collection-of-helper-functions-controls-and-ap": "一组帮助函数、控件和应用服务。",
  "text.a-combobox-with-inline-items": "包含内联项的组合框。",
  "text.a-command-bar-with-labels-on-the-side-free-float": "标签位于侧边并浮在页面中的命令栏",
  "text.a-container-that-allows-users-to-refresh-content": "允许用户在触控设备上从顶部下拉刷新内容的容器。",
  "text.a-container-with-two-views-one-for-primary-conte": "包含两个视图的容器：一个用于主要内容，一个用于导航。",
  "text.a-container-with-two-views-one-view-for-the-main": "包含两个视图的容器；一个视图用于主要内容，另一个通常用于导航命令。",
  "text.a-contextual-command-bar-in-a-flyout": "浮出面板中的上下文命令栏。",
  "text.a-control-for-numeric-input": "用于数字输入的控件。",
  "text.a-control-for-password-input": "用于密码输入的控件。",
  "text.a-control-that-a-user-can-select-or-clear": "用户可以选中或清除的控件。",
  "text.a-control-that-allows-a-user-to-select-a-single": "允许用户从一组选项中选择单个选项的控件。",
  "text.a-control-that-lets-users-pick-a-color-from-a-sp": "允许用户通过色谱、滑块和文本输入选择颜色的控件。",
  "text.a-control-that-lets-users-pick-a-date-from-a-cal": "允许用户从日历中选择日期的控件。",
  "text.a-control-that-lets-users-pick-a-date-value": "允许用户选择日期值的控件。",
  "text.a-control-that-lets-users-pick-a-time-value": "允许用户选择时间值的控件。",
  "text.a-control-that-presents-a-collection-of-items-in": "以垂直列表呈现项目集合的控件。",
  "text.a-control-that-presents-an-inline-list-of-items": "呈现用户可从中选择的内联项目列表的控件。",
  "text.a-control-that-presents-an-inline-list-of-select": "呈现可选项目内联列表的控件。",
  "text.a-control-that-responds-to-user-input-and-trigge": "响应用户输入并触发事件的控件。",
  "text.a-control-with-a-header-that-shows-or-hides-cont": "带有标题并可显示或隐藏内容的控件。",
  "text.a-dialog-that-can-contain-custom-ui-content": "可包含自定义界面内容的对话框。",
  "text.a-dropdownbutton-is-a-button-that-displays-a-che": "下拉按钮会显示一个人字形图标，作为其附加浮出面板中包含更多选项的视觉提示。它与带浮出面板的标准按钮行为相同，只是外观不同。",
  "text.a-flyout-displays-lightweight-ui-that-is-either": "浮出面板用于显示轻量级界面，可以展示信息，也可以要求用户交互。不同于对话框，点击或点按外部区域、按设备返回键或按 Esc 键都可以轻量关闭浮出面板。",
  "text.a-flyout-like-control-used-to-deliver-contextual": "用于提供上下文信息的类浮出控件。",
  "text.a-flyout-that-displays-menu-commands": "显示菜单命令的浮出面板。",
  "text.a-group-of-radiobuttons": "一组单选按钮",
  "text.a-horizontal-menu-of-app-commands": "应用命令的水平菜单。",
  "text.a-hyperlinkbutton-with-navigateuri": "带导航地址的超链接按钮。",
  "text.a-lightweight-popup-container": "轻量级弹出容器。",
  "text.a-listview-displays-data-in-a-vertical-list-with": "列表视图以垂直列表显示数据，并支持选择。",
  "text.a-menuflyout-attached-to-an-appbarbutton": "带菜单浮出面板的应用栏按钮。",
  "text.a-menuflyout-displays-a-lightweight-menu-of-comm": "菜单浮出面板提供轻量级界面，点击或轻触面板外即可关闭。它让用户从上下文相关的简单命令或选项列表中进行选择。",
  "text.a-numberbox-that-evaluates-expressions": "可计算表达式的数字框",
  "text.a-passwordbox-is-a-text-input-box-that-conceals": "密码框是一种文本输入框，会隐藏用户输入的字符以保护隐私。密码框看起来像文本框，但会用占位字符替代已输入文本。你可以配置占位字符。",
  "text.a-simple-button-with-text-content": "包含文本内容的简单按钮。",
  "text.a-simple-colorpicker": "简单颜色选取器",
  "text.a-simple-datepicker-with-a-header": "带标题的简单日期选取器。",
  "text.a-simple-dropdownbutton-with-text-content": "包含文本内容的简单下拉按钮",
  "text.a-simple-flipview-with-items-declared-inline": "以内联方式声明项目的简单翻页视图。",
  "text.a-simple-listbox": "简单列表框",
  "text.a-simple-menubar": "简单菜单栏",
  "text.a-simple-passwordbox": "简单密码框",
  "text.a-simple-ratingcontrol": "简单评级控件",
  "text.a-simple-repeatbutton": "简单重复按钮",
  "text.a-simple-slider": "简单滑块。",
  "text.a-simple-text-editor": "简单文本编辑器",
  "text.a-simple-textblock": "简单文本块。",
  "text.a-simple-textbox": "简单文本框",
  "text.a-simple-timepicker": "简单时间选取器。",
  "text.a-simple-togglesplitbutton": "简单切换拆分按钮",
  "text.a-simple-toggleswitch": "简单切换开关。",
  "text.a-simple-treeview-with-drag-and-drop-enabled": "启用拖放的简单树视图。",
  "text.a-splitbutton-for-color-picking": "用于选择颜色的拆分按钮。",
  "text.a-teaching-tip-is-a-notification-flyout-used-to": "教学提示是用于提供上下文相关信息的通知浮出控件。它支持丰富内容（包括标题、副标题、图标、图像和文本），并可配置为显式关闭或轻量关闭。",
  "text.a-text-box-that-makes-suggestions-as-the-user-ty": "在用户输入时提供建议的文本框。",
  "text.a-toggleable-split-button": "可切换的拆分按钮。",
  "text.a-togglebutton-looks-like-a-button-but-works-lik": "切换按钮看起来像按钮，但工作方式类似复选框。它通常有两种状态：选中（开）或未选中（关）；如果 IsThreeState 属性为 true，也可以是不确定状态。可以通过 IsChecked 属性确定其状态。",
  "text.a-toolbar-for-commands": "用于命令的工具栏。",
  "text.account": "帐户",
  "text.acrylic": "Acrylic",
  "text.adam": "亚当",
  "text.add": "添加",
  "text.allows-users-to-view-and-set-ratings": "允许用户查看和设置评级。",
  "text.an-expander-with-text-in-the-header-and-content": "标题和内容中都包含文本的展开器。",
  "text.animatedvisualplayer": "动画视觉播放器",
  "text.animatedvisualplayer-description": "用于呈现动态图形并控制其播放的元素。",
  "text.animation-style-when-switching-pages": "切换页面时的动画样式",
  "text.appearance": "外观",
  "text.arabic-ar-sa": "阿拉伯语（ar-SA）",
  "text.arial": "Arial",
  "text.autosuggestbox": "自动建议框",
  "text.basic-input": "基本输入",
  "text.border": "边框",
  "text.breadcrumbbar": "面包屑导航栏",
  "text.breadcrumbbar-description": "面包屑导航栏控件提供常见的水平布局，用于显示到达当前位置所经过的导航路径。调整窗口大小可查看节点从根节点开始逐步折叠。",
  "text.basic-listview-with-selection-modes": "带选择模式的基本列表视图",
  "text.blue": "蓝色",
  "text.button": "按钮",
  "text.calendar": "日历",
  "text.calendardatepicker": "日历日期选取器",
  "text.calendardatepicker-with-a-header-and-placeholder": "带标题和占位文本的日历日期选取器。",
  "text.calendarview": "日历视图",
  "text.capture-element-camera": "捕获元素 / 相机",
  "text.capture-element-camera-preview": "捕获元素 / 相机预览",
  "text.capture-element-description": "可以使用 MediaPlayerElement 控件和 MediaCapture 对象显示相机预览。",
  "text.captures-media-from-a-camera": "从相机捕获媒体。",
  "text.checkbox": "复选框",
  "text.checkbox-controls-let-the-user-select-a-combinat": "复选框控件允许用户选择二进制选项的组合。相比之下，单选按钮控件允许用户从互斥选项中选择。不确定状态用于表示某个选项对部分子选项生效，但不是全部。不要允许用户直接设置不确定状态来表示第三种选项。",
  "text.chinese-zh-cn": "中文（zh-CN）",
  "text.choose-the-app-background-material": "选择应用背景材质",
  "text.choose-your-app-color-mode": "选择应用颜色模式",
  "text.click-and-hold": "点击并按住",
  "text.code-samples": "代码示例",
  "text.collections": "集合",
  "text.colorpicker": "颜色选取器",
  "text.colors": "颜色",
  "text.combobox": "组合框",
  "text.comic-sans-ms": "Comic Sans MS",
  "sample.appbartogglebutton.state.true": "真",
  "sample.appbartogglebutton.state.false": "假",
  "sample.appbartogglebutton.state.indeterminate": "",
  "sample.commandbarflyout.resize": "调整大小",
  "sample.commandbarflyout.move": "移动",
  "sample.commandbarflyout.mountain": "山峰",
  "text.commandbar": "命令栏",
  "text.commandbar-subtitle": "用于显示应用专用命令并处理内容布局和大小调整的工具栏。",
  "text.commandbarflyout": "命令栏浮出面板",
  "text.appbarbutton": "应用栏按钮",
  "text.appbarbutton-description": "专为在 CommandBar 中使用而设计的按钮。",
  "text.appbarseparator": "应用栏分隔符",
  "text.appbarseparator-description": "用于在应用栏中直观分隔命令组的垂直线。",
  "text.appbar-toggle-button": "应用栏切换按钮",
  "text.appbar-toggle-button-description": "可切换开关状态并专为在 CommandBar 中使用而设计的按钮。",
  "text.community-toolkit": "社区工具包",
  "text.compactinline": "紧凑内联",
  "text.compactoverlay": "紧凑覆盖",
  "text.contentdialog": "内容对话框",
  "text.courier-new": "Courier New",
  "text.dark": "深色",
  "text.date-and-time": "日期和时间",
  "text.datepicker": "日期选取器",
  "text.default-style": "默认样式",
  "text.delete": "删除",
  "text.design": "设计",
  "text.dialogs-and-flyouts": "对话框和浮出控件",
  "text.display-hierarchical-data": "显示分层数据。",
  "text.displays-a-collection-of-data-items": "显示数据项集合。",
  "text.displays-repeating-data": "显示重复数据。",
  "text.displays-a-persons-picture": "显示人物头像。",
  "text.displays-an-image": "显示图像。",
  "text.displays-content-on-top-of-existing-content": "在现有内容之上显示内容。",
  "text.displays-content-on-top-of-existing-content-with": "在应用窗口边界内的现有内容之上显示内容。对于应显示在其他界面之上的临时内容，请使用弹出控件。",
  "text.displays-read-only-text": "显示只读文本。",
  "text.documents": "文档",
  "text.down": "下",
  "text.dropdownbutton": "下拉按钮",
  "text.edit": "编辑",
  "text.email": "电子邮件",
  "text.empty-cart": "清空购物车",
  "text.english-en-us": "英语（en-US）",
  "text.enter-an-expression": "输入表达式：",
  "text.enter-rich-text": "输入富文本",
  "text.eve": "伊芙",
  "text.expander": "展开器",
  "text.explore-the-winui-on-web-source-code-and-reposit": "浏览 WinUI on Web 的源代码和仓库。",
  "text.extended": "扩展",
  "text.favorites": "收藏",
  "text.file": "文件",
  "text.find-samples-that-demonstrate-specific-tasks-fea": "查找展示特定任务、功能和 API 的示例。",
  "text.flipview": "翻页视图",
  "text.flyout": "浮出面板",
  "text.french-fr-fr": "法语（fr-FR）",
  "text.georgia": "Georgia",
  "text.german-de-de": "德语（de-DE）",
  "text.get-started-with-winui-and-explore-detailed-docu": "开始使用 WinUI 并查看详细文档。",
  "text.getting-started": "入门",
  "text.green": "绿色",
  "text.gregoriancalendar": "公历",
  "text.gridview": "网格视图",
  "text.itemsrepeater": "项重复器",
  "text.itemsview": "项视图",
  "text.guidelines-and-toolkits-for-creating-stunning-wi": "用于创建出色 WinUI 体验的指南和工具包。",
  "text.hebrew-he-il": "希伯来语（he-IL）",
  "text.hebrewcalendar": "希伯来历",
  "text.help": "帮助",
  "text.hijricalendar": "伊斯兰历",
  "text.home": "主页",
  "text.hyperlinkbutton": "超链接按钮",
  "text.i-am-a-textblock": "我是一个文本块。",
  "text.image": "图像",
  "text.image-description": "可以使用 Image 控件显示和缩放图像。",
  "text.infobadge": "信息徽章",
  "text.infobar": "信息栏",
  "text.inline": "内联",
  "text.items-in-a-flexible-grid": "灵活网格中的项目。",
  "text.japanese-ja-jp": "日语（ja-JP）",
  "text.japanesecalendar": "日本历",
  "text.juliancalendar": "儒略历",
  "text.koreancalendar": "韩国历",
  "text.layout": "布局",
  "text.left": "左侧",
  "text.lets-people-browse-images-or-other-items-one-at": "让用户一次浏览一张图像或一个其他项目。",
  "text.lets-the-user-pick-a-color": "让用户选择颜色。",
  "text.lets-users-edit-rich-formatted-text": "让用户编辑富格式文本。",
  "text.lets-users-enter-simple-text-input": "让用户输入简单文本。",
  "text.lets-users-pick-one-item-from-a-list": "让用户从列表中选择一项。",
  "text.lets-users-select-from-a-range-of-values": "让用户从一系列值中选择。",
  "text.light": "浅色",
  "text.listbox": "列表框",
  "text.listview": "列表视图",
  "text.mark": "马克",
  "text.mary": "玛丽",
  "text.material": "材质",
  "text.media": "媒体",
  "text.mediaplayerelement": "媒体播放器元素",
  "text.mediaplayerelement-description": "可以使用媒体播放器元素控件播放视频和显示图像。可以显示传输控件或使视频自动播放。",
  "text.menubar": "菜单栏",
  "text.menuflyout": "菜单浮出面板",
  "text.menus-and-toolbars": "菜单和工具栏",
  "text.mica": "Mica",
  "text.microsoft-home-page": "Microsoft 主页",
  "text.mountain": "山",
  "text.multiple": "多选",
  "text.navigation": "导航",
  "text.navigationview": "导航视图",
  "text.navigation-pane-position": "导航窗格位置",
  "text.none": "无",
  "text.numberbox": "数字框",
  "text.option-1": "选项 1",
  "text.option-2": "选项 2",
  "text.option-3": "选项 3",
  "text.options": "选项：",
  "text.overlay": "覆盖",
  "text.page-transition": "页面过渡",
  "sample.page-transition.header": "页面过渡",
  "sample.page-transition.description": "页面过渡通过视觉反馈体现页面之间的关系。",
  "sample.page-transition.modes": "过渡模式",
  "sample.page-transition.default": "默认",
  "sample.page-transition.entrance": "进入",
  "sample.page-transition.drill-in": "钻取",
  "sample.page-transition.suppress": "无动画",
  "sample.page-transition.slide-right": "从右侧滑入",
  "sample.page-transition.slide-left": "从左侧滑入",
  "sample.page-transition.common": "通用",
  "sample.page-transition.continuum": "连续",
  "sample.page-transition.navigate": "导航",
  "sample.page-transition.forward": "向前导航",
  "sample.page-transition.backward": "向后导航",
  "sample.page-transition.output": "当前页面：{page}。后退栈深度：{depth}。",
  "sample.page-transition.quickstart": "快速入门：动画",
  "text.default-navigation-transition-info": "默认 (DefaultNavigationTransitionInfo)",
  "text.entrance-navigation-transition-info": "进入 (EntranceNavigationTransitionInfo)",
  "text.drill-in-navigation-transition-info": "钻取 (DrillInNavigationTransitionInfo)",
  "text.suppress-navigation-transition-info": "无动画 (SuppressNavigationTransitionInfo)",
  "text.slide-navigation-transition-info-from-right": "滑动 (SlideNavigationTransitionInfo, Effect = FromRight)",
  "text.slide-navigation-transition-info-from-left": "滑动 (SlideNavigationTransitionInfo, Effect = FromLeft)",
  "text.common-navigation-transition-info": "通用 (CommonNavigationTransitionInfo)",
  "text.continuum-navigation-transition-info": "连续 (ContinuumNavigationTransitionInfo)",
  "text.partner-center": "合作伙伴中心",
  "text.passwordbox": "密码框",
  "text.persiancalendar": "波斯历",
  "text.personpicture": "人物头像",
  "text.personpicture-description": "显示人员或联系人的图片。",
  "text.pick-a-date": "选择日期",
  "text.plays-animated-content": "播放动画内容。",
  "text.plays-media-content": "播放媒体内容。",
  "text.popup": "弹出控件",
  "text.pipspager": "分页点控件",
  "text.pivot": "透视视图",
  "text.pivot-description": "不建议在 Windows 11 设计模式中使用 Pivot。请改用 SelectorBar 和 SelectorBarItem。Pivot 可在选项卡视图中显示来自不同来源的项目集合。",
  "text.popup-with-offset-positioning": "使用偏移定位的弹出控件",
  "text.progressbar": "进度条",
  "text.progressbar-description": "ProgressBar 有两种不同的视觉表示形式：不确定状态表示任务正在进行，确定状态表示已知工作量的完成进度。",
  "text.progressring": "进度环",
  "text.progressring-description": "ProgressRing 有两种不同的视觉表示形式：不确定状态表示任务正在进行，但会阻止用户交互；确定状态表示已知工作量的完成进度。",
  "sample.progressring.indeterminate": "不确定进度环。",
  "sample.progressring.determinate": "确定进度环。",
  "sample.progressring.progress-options": "进度选项",
  "sample.progressring.working": "正在处理",
  "sample.progressring.do-work": "开始工作",
  "sample.progressring.background-color": "背景颜色",
  "sample.progressring.pick-color": "选择颜色",
  "sample.progressring.progress": "进度",
  "sample.progressring.progress-image": "进度图像",
  "sample.progressring.progress-amount": "进度数值",
  "sample.progressring.transparent": "透明",
  "sample.progressring.lightgray": "浅灰色",
  "text.pull-down-to-refresh": "下拉刷新",
  "text.pulltorefresh": "下拉刷新",
  "text.itemsrepeater-description": "ItemsRepeater 是用于显示重复数据的轻量控件。它可通过灵活的布局选项高度自定义，并支持虚拟化布局。当你需要比 ListView 或 GridView 更强的布局控制时，可以使用 ItemsRepeater。",
  "text.itemsview-description": "ItemsView 控件显示数据项集合，并提供灵活的项目布局、选择和调用方式。",
  "text.radiobutton-description": "RadioButton 控件允许用户从一组互斥选项中选择一个选项。相比之下，CheckBox 控件允许用户选择多个选项。当有 2 到 7 个选项并且一次只能选择一个选项时，请使用 RadioButton。",
  "text.radiobuttons": "单选按钮",
  "text.radiobuttons-are-used-to-select-a-single-option": "单选按钮用于从一组相关选项中选择单个选项。单选按钮控件提供现代布局和交互模型，而单个单选按钮元素可用于更自定义的布局。",
  "text.ratingcontrol": "评级控件",
  "text.recent": "最近",
  "text.recently-added-or-updated": "最近添加或更新",
  "text.recently-visited": "最近访问",
  "text.red": "红色",
  "text.refresh-content-with-a-pulling-gesture": "通过下拉手势刷新内容。",
  "text.repeatbutton": "重复按钮",
  "text.reply": "回复",
  "text.reply-all": "全部回复",
  "text.richeditbox": "富文本编辑框",
  "text.richtextblock": "富文本块",
  "text.save": "保存",
  "text.segoe-ui": "Segoe UI",
  "text.select-the-navigation-bar-position": "选择导航栏位置",
  "text.send": "发送",
  "text.settings": "设置",
  "text.status-and-info": "状态和信息",
  "text.scrolling": "滚动",
  "text.semanticzoom": "语义缩放",
  "text.selectorbar": "选择器栏",
  "text.selectorbar-description": "SelectorBar 控件允许用户从内联项目列表中选择不同视图、页面或集合。",
  "text.share": "共享",
  "text.shared": "共享",
  "text.show-a-targeted-teachingtip-on-a-button": "在按钮上显示定向教学提示。",
  "text.show-dialog": "显示对话框",
  "text.show-popup-using-offset": "显示弹出控件（使用偏移）",
  "text.show-teachingtip": "显示教学提示",
  "text.shows-a-calendar-that-lets-a-user-choose-a-date": "显示可供用户选择日期的日历。",
  "text.single": "单选",
  "text.single-selection": "单选",
  "text.slider": "滑块",
  "text.sort": "排序",
  "text.spanish-es-es": "西班牙语（es-ES）",
  "text.splitbutton": "拆分按钮",
  "text.splitview": "拆分视图",
  "text.standard-xaml-button": "标准 XAML 按钮",
  "text.standarduicommand": "标准界面命令",
  "text.standarduicommand-subtitle": "StandardUICommand 是表示常用命令（例如“保存”）的内置 XamlUICommand。",
  "sample.standarduicommand.multiple-controls": "使用 StandardUICommand 在多个控件中公开同一命令",
  "sample.standarduicommand.description": "StandardUICommand 可共享与命令关联的界面体验。此示例使用 StandardUICommand，在多个控件中快速提供删除命令。StandardUICommand 包含图标、标签、键盘快捷键和说明。",
  "sample.standarduicommand.items": "项目",
  "sample.standarduicommand.list-item": "列表项 {index}",
  "sample.standarduicommand.new": "新建",
  "sample.standarduicommand.open": "打开...",
  "sample.standarduicommand.exit": "退出",
  "text.sue": "苏",
  "text.swipecontrol": "轻扫控件",
  "text.swipecontrol-subtitle": "用于对项目快速执行菜单操作的触摸手势。",
  "sample.swipecontrol.reveal-actions": "向右轻扫以显示操作",
  "sample.swipecontrol.execute": "向左轻扫以执行操作",
  "sample.swipecontrol.custom-list": "在列表视图中自定义轻扫操作",
  "sample.swipecontrol.gradient": "渐变背景",
  "sample.swipecontrol.custom-icons": "自定义图标",
  "sample.swipecontrol.swipe-right": "向右轻扫",
  "sample.swipecontrol.swipe-left": "向左轻扫",
  "sample.swipecontrol.accept": "接受",
  "sample.swipecontrol.cancel": "取消",
  "sample.swipecontrol.flag": "标记",
  "sample.swipecontrol.unmark": "取消标记",
  "sample.swipecontrol.archive": "存档",
  "sample.swipecontrol.archived": "已存档 - 向左轻扫",
  "sample.swipecontrol.accepted": "向右轻扫 - 已接受",
  "sample.swipecontrol.accepted-flagged": "向右轻扫 - 已接受并已标记",
  "sample.swipecontrol.flagged": "向右轻扫 - 已标记",
  "sample.swipecontrol.list-item": "轻扫项目 {index}",
  "sample.swipecontrol.reply-all": "全部答复",
  "sample.swipecontrol.open": "打开",
  "sample.swipecontrol.delete": "删除",
  "sample.swipecontrol.lock": "锁定",
  "sample.swipecontrol.coffee": "咖啡",
  "sample.swipecontrol.remaining-items": "剩余项目：{count}",
  "sample.swipecontrol.item-action-output": "{action}：{item}。剩余项目：{count}",
  "sample.swipecontrol.lock-invoked": "已调用锁定操作",
  "sample.swipecontrol.coffee-invoked": "已调用咖啡操作",
  "text.switch-that-can-be-toggled-between-two-states": "可在两种状态之间切换的开关。",
  "text.systembackground": "系统背景",
  "text.taiwancalendar": "台湾历",
  "text.teachingtip": "教学提示",
  "text.tooltip": "工具提示",
  "text.text": "文本",
  "text.textblock": "文本块",
  "text.textbox": "文本框",
  "text.thaicalendar": "泰国历",
  "text.the-button-control-provides-a-click-event-to-res": "按钮控件提供 Click 事件，用于响应来自触控、鼠标、键盘、触控笔或其他输入设备的用户输入。你可以在按钮中放入不同类型的内容，例如文本或图像，也可以重新设置按钮样式以获得新的外观。",
  "text.the-calendardatepicker-is-a-drop-down-control-th": "日历日期选取器是一个下拉控件，专为从日历视图中选择单个日期而优化，适用于星期几或日历忙闲等上下文信息很重要的场景。你可以修改日历以提供更多上下文，或限制可选日期。",
  "text.the-calendarview-gives-a-standardized-way-to-let": "日历视图提供标准方式，让用户查看日历并与之交互。如果只需要让用户选择日期，请考虑使用日历日期选取器。如果需要让用户选择多个日期，则必须使用日历视图。",
  "text.the-commandbarflyout-lets-you-provide-users-with": "命令栏浮出面板可通过显示与界面画布上某个元素相关的浮动工具栏命令，让用户轻松访问常见任务。",
  "text.the-expander-control-lets-you-show-or-hide-less": "展开器控件可显示或隐藏与始终可见的主要内容相关但重要性较低的内容。标题中的项目始终可见。用户可以展开或折叠内容区域以显示正文内容。",
  "text.the-flipview-lets-you-flip-through-a-collection": "翻页视图允许用户逐项翻阅项目集合。它非常适合显示图库中的图像或产品详情页中的项目。",
  "text.the-gridview-lets-people-browse-and-select-from": "网格视图允许用户浏览并选择按网格布局排列的项目集合。",
  "text.the-menubar-simplifies-the-creation-of-basic-men": "菜单栏通过在应用或窗口顶部提供一组菜单，简化基本应用程序的创建。",
  "text.the-numberbox-control-allows-users-to-enter-numb": "数字框控件允许用户输入数字。它支持验证、步进，以及计算基本方程等内联表达式。",
  "text.the-ratingcontrol-allows-users-to-view-and-set-r": "评级控件允许用户查看和设置反映其对内容和服务满意程度的评级。",
  "text.the-richeditbox-control-lets-a-user-enter-format": "富文本编辑框控件允许用户输入加粗、斜体和下划线等格式化文本。富文本编辑框还可以显示和编辑富文本格式（.rtf）文件。",
  "text.the-splitbutton-is-a-dropdown-button-but-with-an": "拆分按钮类似下拉按钮，但额外提供一个执行点击区域。它适用于希望用户既能调用命令又能作出选择的场景。",
  "text.the-textblock-control-provides-flexible-text-dis": "文本块控件为不需要交互的场景提供灵活的文本显示选项。它支持富文本格式、加粗和斜体等内联元素，以及文本选择。",
  "text.tooltip-description": "ToolTip 显示有关界面元素的更多信息。它可以说明元素的功能或用户应执行的操作。当用户将鼠标悬停在界面元素上或长按该元素时，会显示 ToolTip。",
  "text.the-treeview-control-is-a-hierarchical-list-patt": "树视图控件是一种分层列表模式，包含可展开和折叠的嵌套节点。",
  "text.theme": "主题",
  "text.motion": "运动",
  "text.this-is-the-title": "这是标题",
  "text.timepicker": "时间选取器",
  "text.times-new-roman": "Times New Roman",
  "text.toggle": "切换",
  "text.togglebutton": "切换按钮",
  "text.togglesplitbutton": "切换拆分按钮",
  "text.toggleswitch": "切换开关",
  "text.top": "顶部",
  "text.trebuchet-ms": "Trebuchet MS",
  "text.treeview": "树视图",
  "text.two-state-checkbox": "双状态复选框",
  "text.umalquracalendar": "乌姆库拉历",
  "text.up": "上",
  "text.upload-your-app-to-the-store": "将你的应用上传到商店。",
  "text.use-a-combobox-also-known-as-a-drop-down-list-to": "使用组合框（也称为下拉列表）显示用户可选择的项目列表。组合框初始为紧凑状态，展开后显示可选项目列表。",
  "text.use-a-contentdialog-to-show-relevant-information": "使用内容对话框显示相关信息，或提供需要用户操作的模态对话框体验。",
  "text.use-a-datepicker-to-let-users-set-a-date-in-your": "使用日期选取器让用户在应用中设置日期，例如安排约会。日期选取器显示月、日、年三个控件。这些控件易于通过触控或鼠标使用，并可通过多种方式设置样式和配置。",
  "text.use-a-slider-to-let-users-set-a-value-by-moving": "使用滑块让用户沿轨道移动滑块来设置值。当用户认为该值是相对量而不是精确数值时，滑块是很好的选择。",
  "text.use-a-textbox-to-let-a-user-enter-simple-text-in": "使用文本框让用户在应用中输入简单文本。你可以通过多种方式自定义文本框以满足需求。",
  "text.use-a-timepicker-to-let-users-set-a-time-in-your": "使用时间选取器让用户在应用中设置时间，例如设置提醒。时间选取器显示小时、分钟和上午/下午三个控件。这些控件易于通过触控或鼠标使用，并可通过多种方式设置样式和配置。",
  "sample.datepicker.day-formatted-year-hidden": "设置日期格式并隐藏年份的 DatePicker。",
  "sample.timepicker.header-minute-increment": "带标题并指定分钟增量的 TimePicker。",
  "sample.timepicker.24-hour-clock": "使用 24 小时制并初始化为当前时间的 TimePicker。",
  "sample.timepicker.arrival-time": "到达时间",
  "sample.timepicker.24-hour-clock-header": "24 小时制",
  "text.use-an-autosuggestbox-to-provide-a-list-of-sugge": "使用自动建议框提供建议列表，供用户在输入时选择。",
  "text.use-system-setting": "使用系统设置",
  "text.use-toggleswitch-controls-to-present-users-with": "使用切换开关控件向用户呈现两个完全互斥的选项（如开/关），选择后会立即提交。切换开关应只有一个标签。",
  "text.verdana": "Verdana",
  "text.view": "视图",
  "text.winui-on-web-on-github": "GitHub 上的 WinUI on Web",
  "text.workgroup": "工作组",
  "text.xamluicommand": "XAML 界面命令",
  "text.xamluicommand-subtitle": "用于定义给定命令外观和体验的对象。",
  "sample.xamluicommand.reusable-command": "使用 XamlUICommand 创建可重用命令",
  "sample.xamluicommand.description": "XamlUICommand 可共享与命令关联的界面体验。此示例创建一个简单的自定义命令，其中包含标签、图标、快捷键和说明。该命令定义为资源，可用于 AppBarButton 等多个控件。按钮及其他控件会自动获取所有这些界面属性，无需再次定义。",
  "sample.xamluicommand.custom-label": "自定义 XamlUICommand",
  "sample.xamluicommand.custom-description": "这是一个自定义命令",
  "sample.xamluicommand.executed": "你触发了自定义命令",
  "text.white": "白色",
  "text.yellow": "黄色"
  ,"sample.alpha-enabled": "启用 Alpha"
  ,"sample.all-options-checked": "所有选项都已选中"
  ,"sample.apply-current-color": "应用当前颜色"
  ,"sample.black": "黑色"
  ,"sample.box": "方框"
  ,"sample.button.accent-style": "强调样式按钮"
  ,"sample.button.built-in-styles": "应用到 Button 的内置样式。"
  ,"sample.button.disable": "禁用按钮"
  ,"sample.button.long-text-1": "这是一段很长并且可能被裁剪的文本"
  ,"sample.button.long-text-1-wrapping": "这是一段很长的文本，如果不换行就会被裁剪"
  ,"sample.button.long-text-2": "这是另一段可能导致内容被裁剪的文本"
  ,"sample.button.long-text-2-wrapping": "这是另一段如果不换行就会被裁剪的文本"
  ,"sample.button.standard-xaml": "标准 XAML 按钮"
  ,"sample.button.subtle-style": "柔和样式按钮"
  ,"sample.button.wrapping": "包含大段内容的按钮换行"
  ,"sample.button.wrapping-note-1": "如果不仔细处理布局容器，下面按钮的内容可能会被裁剪。"
  ,"sample.button.wrapping-note-2": "一种缓解内容裁剪的方法是将按钮上下排列，让它们有更多水平增长空间："
  ,"sample.button.wrapping-note-3": "另一种方法是显式让按钮内容换行"
  ,"sample.button.with-image": "包含图形内容的按钮。"
  ,"sample.button.standard-name": "标准 XAML"
  ,"sample.button.pie": "饼图"
  ,"sample.button.slice": "扇形"
  ,"sample.button.accent-name": "强调样式"
  ,"sample.button.subtle-name": "轻量样式"
  ,"sample.button.control-output": "控件输出"
  ,"ButtonMigration_DefaultButton": "默认按钮"
  ,"ButtonMigration_StyledButton": "应用样式的按钮"
  ,"ButtonMigration_OverriddenButton": "覆盖样式的按钮"
  ,"sample.checkbox.checked": "复选框已选中。"
  ,"sample.checkbox.indeterminate": "复选框处于不确定状态。"
  ,"sample.checkbox.select-all": "使用三状态复选框。"
  ,"sample.checkbox.three-state": "三状态复选框。"
  ,"sample.checkbox.three-state-content": "三状态复选框"
  ,"sample.checkbox.two-state": "双状态复选框。"
  ,"sample.checkbox.two-state-content": "双状态复选框"
  ,"sample.checkbox.unchecked": "复选框未选中。"
  ,"sample.checkbox.you-checked": "你选中了复选框。"
  ,"sample.checkbox.you-unchecked": "你取消选中了复选框。"
  ,"sample.choose-color": "选择颜色"
  ,"sample.colorpicker.applied-rectangle": "应用到矩形上的颜色选取器"
  ,"sample.colorpicker.properties": "颜色选取器属性。"
  ,"sample.colorspectrum-shape": "色谱形状"
  ,"sample.combobox.editable": "可编辑的组合框。"
  ,"sample.combobox.font": "字体"
  ,"sample.combobox.font-size": "字号"
  ,"sample.combobox.font-size-text": "你可以设置这段文本使用的字号。"
  ,"sample.combobox.font-text": "你可以设置这段文本使用的字体。"
  ,"sample.combobox.inline": "包含内联项目并设置宽度的组合框。"
  ,"sample.combobox.itemssource": "设置了 ItemsSource 的组合框。"
  ,"sample.combobox.pick-a-color": "选择颜色"
  ,"sample.combobox.invalid-font-size": "字号必须是 8 到 100 之间的数字。"
  ,"sample.combobox.close": "关闭"
  ,"sample.dropdownbutton.simple": "简单下拉按钮"
  ,"sample.dropdownbutton.icons": "带图标的下拉按钮"
  ,"sample.expander.expand-direction": "展开方向"
  ,"gallery.page-header.info": "信息"
  ,"gallery.page-header.xaml": "XAML"
  ,"gallery.page-header.csharp": "C#"
  ,"gallery.page-header.control-source-info": "WinUI 仓库中{0}的源代码。部分控件仅提供 XAML 文件。"
  ,"gallery.page-header.sample-source-info": "WinUI Gallery 仓库中{0}的源代码"
  ,"gallery.page-header.sample-page-title": "{0}示例页"
  ,"gallery.page-header.api-link": "{0} API"
  ,"gallery.page-header.guidelines": "使用指南"
  ,"gallery.page-header.comboboxitem-api": "组合框项 API"
  ,"sample.disable-hyperlink-button": "禁用超链接按钮"
  ,"sample.disable-repeatbutton": "禁用重复按钮"
  ,"sample.disable-togglebutton": "禁用切换按钮"
  ,"sample.dropdown.icons": "带图标的下拉按钮"
  ,"sample.dropdown.simple": "简单下拉按钮"
  ,"sample.gray": "灰色"
  ,"sample.hyperlink.click": "处理 Click 事件的超链接按钮。"
  ,"sample.hyperlink.go-to-togglebutton": "转到切换按钮"
  ,"sample.hyperlink.navigate": "导航到 URI 的超链接按钮。"
  ,"sample.indigo": "靛蓝色"
  ,"sample.nothing-checked": "未选中任何选项"
  ,"sample.number-of-clicks": "点击次数：{count}"
  ,"sample.option-checked-count": "已选中 {count} 个选项"
  ,"sample.opacity": "不透明度"
  ,"sample.options-checked-count": "已选中 {count} 个选项"
  ,"sample.orange": "橙色"
  ,"sample.repeat.simple": "包含文本内容的简单重复按钮。"
  ,"sample.radiobutton.group": "RadioButtons 组中的一组 RadioButton 控件。"
  ,"sample.radiobutton.strings": "使用字符串作为选项的两个 RadioButtons 控件。"
  ,"sample.flipview.simple": "内联声明项目的简单 FlipView。"
  ,"sample.flipview.bound-data-template": "使用数据模板显示绑定数据的 FlipView。"
  ,"sample.flipview.vertical": "垂直 FlipView"
  ,"sample.gridview.basic-simple-datatemplate": "使用简单 DataTemplate 的基础 GridView"
  ,"sample.gridview.layout-customization": "带布局自定义的 GridView"
  ,"sample.gridview.content-inside": "GridView 中的内容。"
  ,"sample.gridview.basic-note": "这是一个基础 GridView，其完整源代码显示在下方。此页面上的其他示例仅显示自定义特定 GridView 所需的附加标记。"
  ,"sample.gridview.layout-note": "使用右侧选项控制下方 GridView 的不同布局自定义项。"
  ,"sample.gridview.properties": "GridView 属性"
  ,"sample.gridview.drag-drop-note": "若要在 GridView 中拖动、放置并重新排序项目，请确保下面最后三个复选框已选中。"
  ,"sample.gridview.item-click-note": "打开 IsItemClickEnabled 后，无论选择模式如何，用户都可以点击项目。"
  ,"sample.gridview.clicked-output": "点击了 {item}。"
  ,"sample.gridview.selection-output": "已选择 {count} 个项目。"
  ,"sample.template-image": "图像"
  ,"sample.template-icon-text": "图标/文本"
  ,"sample.template-image-text": "图像/文本"
  ,"sample.template-text": "文本"
  ,"sample.reverse-flow-direction": "反向排列方向"
  ,"sample.itemsrepeater.basic-non-interactive": "由 ItemsRepeater 布局的基础非交互项目"
  ,"sample.itemsrepeater.virtualizing-scrollable-list-items": "由 ItemsRepeater 布局的虚拟化可滚动列表项目"
  ,"sample.itemsrepeater.mixed-type-collection": "包含混合类型集合的 ItemsRepeater"
  ,"sample.itemsrepeater.nested": "布局嵌套 ItemsRepeater"
  ,"sample.itemsrepeater.animated-scrolling-content-display": "动画滚动和内容显示"
  ,"sample.itemsrepeater.virtualized-content-heavy-layout": "带筛选和排序的虚拟化内容密集型布局"
  ,"sample.itemsrepeater.mixed-note": "这是一个同时显示整数和字符串项目的 ItemsRepeater。它使用 DataTemplateSelector 为每个项目选择正确的布局。"
  ,"sample.itemsrepeater.uniform-grid-option": "均匀网格"
  ,"sample.itemsrepeater.stack-layout-vertical": "垂直堆叠布局"
  ,"sample.itemsrepeater.stack-layout-horizontal": "水平堆叠布局"
  ,"sample.itemsrepeater.custom-virtualizing-layout": "自定义虚拟化布局"
  ,"sample.itemsrepeater.filtered-recipes-output": "已筛选食谱，共 {count} 个结果。"
  ,"sample.itemsrepeater.selected-color-output": "矩形颜色已设为{color}"
  ,"sample.itemsrepeater.no-color-selected": "尚未选择颜色"
  ,"sample.itemsrepeater.items-layout-output": "{count} 个项目，{layout}"
  ,"sample.itemsrepeater.mixed-output": "{integers} 个整数项目，{strings} 个字符串项目"
  ,"sample.itemsrepeater.nested-output": "{categories} 个类别，{items} 个项目"
  ,"sample.itemsrepeater.color-rectangle": "颜色矩形"
  ,"sample.itemsrepeater.recipe-name": "食谱 {number}"
  ,"sample.itemsrepeater.mixed-text-1": "这是一段混合类型集合中的示例文本。项重复器会根据数据类型，为整数和字符串分别选择对应的数据模板，并在固定大小的网格中排列内容。"
  ,"sample.itemsrepeater.mixed-text-2": "字符串项目使用强调色背景，并让较长的文本在项目边界内自动换行。整数项目则使用另一个数据模板。"
  ,"sample.itemsrepeater.mixed-text-3": "布局与数据模板相互独立。同一份集合可以使用不同的布局，而每个项目的外观由模板决定。"
  ,"sample.itemsrepeater.mixed-text-4": "数据模板选择器检查每个项目的实际类型，返回相应的模板，并保持所有项目在展示区内正确排列。"
  ,"sample.itemsrepeater.category.fruits": "水果"
  ,"sample.itemsrepeater.category.vegetables": "蔬菜"
  ,"sample.itemsrepeater.category.grains": "谷物"
  ,"sample.itemsrepeater.category.proteins": "蛋白质"
  ,"sample.itemsrepeater.food.apricots": "杏"
  ,"sample.itemsrepeater.food.bananas": "香蕉"
  ,"sample.itemsrepeater.food.grapes": "葡萄"
  ,"sample.itemsrepeater.food.strawberries": "草莓"
  ,"sample.itemsrepeater.food.watermelon": "西瓜"
  ,"sample.itemsrepeater.food.plums": "李子"
  ,"sample.itemsrepeater.food.blueberries": "蓝莓"
  ,"sample.itemsrepeater.food.broccoli": "西兰花"
  ,"sample.itemsrepeater.food.spinach": "菠菜"
  ,"sample.itemsrepeater.food.sweet-potato": "红薯"
  ,"sample.itemsrepeater.food.cauliflower": "花椰菜"
  ,"sample.itemsrepeater.food.onion": "洋葱"
  ,"sample.itemsrepeater.food.brussels-sprouts": "抱子甘蓝"
  ,"sample.itemsrepeater.food.carrots": "胡萝卜"
  ,"sample.itemsrepeater.food.rice": "米饭"
  ,"sample.itemsrepeater.food.quinoa": "藜麦"
  ,"sample.itemsrepeater.food.pasta": "意大利面"
  ,"sample.itemsrepeater.food.bread": "面包"
  ,"sample.itemsrepeater.food.farro": "法罗麦"
  ,"sample.itemsrepeater.food.oats": "燕麦"
  ,"sample.itemsrepeater.food.barley": "大麦"
  ,"sample.itemsrepeater.food.steak": "牛排"
  ,"sample.itemsrepeater.food.chicken": "鸡肉"
  ,"sample.itemsrepeater.food.tofu": "豆腐"
  ,"sample.itemsrepeater.food.salmon": "三文鱼"
  ,"sample.itemsrepeater.food.pork": "猪肉"
  ,"sample.itemsrepeater.food.chickpeas": "鹰嘴豆"
  ,"sample.itemsrepeater.food.eggs": "鸡蛋"
  ,"sample.itemsrepeater.food.garlic": "大蒜"
  ,"sample.itemsrepeater.food.lemon": "柠檬"
  ,"sample.itemsrepeater.food.butter": "黄油"
  ,"sample.itemsrepeater.food.lime": "青柠"
  ,"sample.itemsrepeater.food.feta-cheese": "菲达奶酪"
  ,"sample.itemsrepeater.food.parmesan-cheese": "帕尔马奶酪"
  ,"sample.itemsrepeater.food.breadcrumbs": "面包屑"
  ,"sample.itemsrepeater.color.Blue": "蓝色"
  ,"sample.itemsrepeater.color.BlueViolet": "蓝紫色"
  ,"sample.itemsrepeater.color.Crimson": "绯红色"
  ,"sample.itemsrepeater.color.DarkCyan": "深青色"
  ,"sample.itemsrepeater.color.DarkGoldenrod": "深金菊色"
  ,"sample.itemsrepeater.color.DarkMagenta": "深洋红色"
  ,"sample.itemsrepeater.color.DarkOliveGreen": "深橄榄绿"
  ,"sample.itemsrepeater.color.DarkRed": "深红色"
  ,"sample.itemsrepeater.color.DarkSlateBlue": "深岩蓝"
  ,"sample.itemsrepeater.color.DeepPink": "深粉色"
  ,"sample.itemsrepeater.color.IndianRed": "印度红"
  ,"sample.itemsrepeater.color.MediumSlateBlue": "中岩蓝"
  ,"sample.itemsrepeater.color.Maroon": "栗色"
  ,"sample.itemsrepeater.color.MidnightBlue": "午夜蓝"
  ,"sample.itemsrepeater.color.Peru": "秘鲁色"
  ,"sample.itemsrepeater.color.SaddleBrown": "鞍褐色"
  ,"sample.itemsrepeater.color.SteelBlue": "钢蓝色"
  ,"sample.itemsrepeater.color.OrangeRed": "橙红色"
  ,"sample.itemsrepeater.color.Firebrick": "砖红色"
  ,"sample.itemsrepeater.color.DarkKhaki": "深卡其色"
  ,"sample.itemsview.basic": "基础 ItemsView"
  ,"sample.itemsview.swappable-layouts": "带可切换布局的 ItemsView"
  ,"sample.itemsview.item-invocation-selection": "ItemsView 项调用和选择"
  ,"sample.itemsview.basic-note": "这是一个基础 ItemsView，使用默认 StackLayout 布局和简单 ItemTemplate。按 Enter、双击或双击触摸项目可调用它。"
  ,"sample.itemsview.layout-note": "使用右侧选项控制下方 ItemsView 的不同布局自定义项。"
  ,"sample.itemsview.linedflow-settings": "LinedFlowLayout 设置"
  ,"sample.itemsview.stack-settings": "StackLayout 设置"
  ,"sample.itemsview.uniformgrid-settings": "UniformGridLayout 设置"
  ,"sample.itemsview.layout-linedflow": "LinedFlowLayout"
  ,"sample.itemsview.layout-uniformgrid": "UniformGridLayout"
  ,"sample.itemsview.layout-stack": "StackLayout"
  ,"sample.itemsview.selection-note": "你可以在右侧启用四种不同的选择模式。None 会完全禁用选择。Single 只允许集合中选择一个项目。Multiple 会在项目中显示复选框，以便从集合中选择多个项目。Extended 允许用户使用 Ctrl+点击选择单个项目，或使用 Shift+点击选择连续范围。"
  ,"sample.itemsview.selection-note-1": "你可以在右侧启用四种不同的选择模式。"
  ,"sample.itemsview.selection-note-none": "None 会完全禁用选择。"
  ,"sample.itemsview.selection-note-extended": "Extended 允许用户使用 Ctrl+点击选择单个项目，或使用 Shift+点击选择连续范围。"
  ,"sample.itemsview.invoked-output": "你调用了 {item}。"
  ,"sample.itemsview.selection-output": "你已选择 {count} 个项目。"
  ,"sample.itemsview.item-title": "项目 {number}"
  ,"sample.itemsview.selection-single-description": "模式只允许在集合中选择一个项目。"
  ,"sample.itemsview.selection-multiple-description": "模式在项目内部显示复选框，允许从集合中选择多个项目。"
  ,"sample.listview.basic-simple-datatemplate": "使用简单 DataTemplate 的基础 ListView"
  ,"sample.listview.selection-support": "带选择支持的 ListView"
  ,"sample.listview.selection-introduction": "可以在右侧启用四种不同的选择模式。"
  ,"sample.listview.selection-none-description": "模式禁用所有选择。"
  ,"sample.listview.selection-single-description": "模式只允许选择列表中的一个项目。"
  ,"sample.listview.selection-multiple-description": "模式在项目旁显示复选框，以便从列表中选择多个项目。"
  ,"sample.listview.selection-extended-description": "模式允许使用 Ctrl+单击选择各个项目，或使用 Shift+单击选择连续的多个项目。"
  ,"sample.listview.stats-separator": " ⋅ "
  ,"sample.listview.drag-drop-reordering": "支持拖放和重新排序的 ListView"
  ,"sample.listview.grouped-headers": "带分组标题的 ListView"
  ,"sample.listview.filtering": "ListView 过滤"
  ,"sample.listview.messaging": "ListView 消息和数据日志"
  ,"sample.listview.images": "带图片的 ListView"
  ,"sample.listview.context-menus": "ListView 上下文菜单"
  ,"sample.listview.first-name": "名字"
  ,"sample.listview.send-message": "发送消息"
  ,"sample.listview.receive-message": "接收消息"
  ,"sample.listview.basic-note": "这是一个基础 ListView，其完整源代码显示在下方。此页面上的其他示例仅显示自定义这种简单 ListView 所需的附加标记。"
  ,"sample.listview.selection-note": "你可以在右侧启用四种不同的选择模式。None 会完全禁用选择。Single 只允许列表中选择一个项目。Multiple 会在项目旁显示复选框，以便从列表中选择多个项目。Extended 允许用户使用 Ctrl+点击选择单个项目，或使用 Shift+点击选择连续范围。"
  ,"sample.listview.drag-drop-note": "在这些 ListView 控件中，你可以在列表内拖放以重新排序项目，也可以在列表之间拖放以移动项目。"
  ,"sample.listview.grouped-note": "打开右侧开关可启用粘性分组标题，使标题在滚动 ListView 时停留在顶部。"
  ,"sample.listview.message-received": "收到消息"
  ,"sample.listview.message-sent": "已发送消息"
  ,"sample.listview.image-item": "项目 {index}"
  ,"sample.listview.image-description": "WinUI Gallery 中的示例横向图像 {index}。"
  ,"sample.listview.image-description-1": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer id facilisis lectus. Cras nec convallis ante, quis pulvinar tellus. Integer dictum accumsan pulvinar. Pellentesque eget enim sodales sapien vestibulum consequat."
  ,"sample.listview.image-description-2": "Nullam eget mattis metus. Donec pharetra, tellus in mattis tincidunt, magna ipsum gravida nibh, vitae lobortis ante odio vel quam."
  ,"sample.listview.image-description-3": "Quisque accumsan pretium ligula in faucibus. Mauris sollicitudin augue vitae lorem cursus condimentum quis ac mauris. Pellentesque quis turpis non nunc pretium sagittis. Nulla facilisi. Maecenas eu lectus ante. Proin eleifend vel lectus non tincidunt. Fusce condimentum luctus nisi, in elementum ante tincidunt nec."
  ,"sample.listview.image-description-4": "Aenean in nisl at elit venenatis blandit ut vitae lectus. Praesent in sollicitudin nunc. Pellentesque justo augue, pretium at sem lacinia, scelerisque semper erat. Ut cursus tortor at metus lacinia dapibus."
  ,"sample.listview.image-description-5": "Ut consequat magna luctus justo egestas vehicula. Integer pharetra risus libero, et posuere justo mattis et."
  ,"sample.listview.image-description-6": "Proin malesuada, libero vitae aliquam venenatis, diam est faucibus felis, vitae efficitur erat nunc non mauris. Suspendisse at sodales erat."
  ,"sample.listview.image-description-7": "Aenean vulputate, turpis non tincidunt ornare, metus est sagittis erat, id lobortis orci odio eget quam. Suspendisse ex purus, lobortis quis suscipit a, volutpat vitae turpis."
  ,"sample.listview.image-description-8": "Duis facilisis, quam ut laoreet commodo, elit ex aliquet massa, non varius tellus lectus et nunc. Donec vitae risus ut ante pretium semper. Phasellus consectetur volutpat orci, eu dapibus turpis. Fusce varius sapien eu mattis pharetra."
  ,"sample.listview.selected-count": "已选择 {count} 项"
  ,"sample.listview.no-selection": "未选择项目"
  ,"sample.listview.message-count": "{count} 条消息"
  ,"sample.listview.message-number": "消息 {count}"
  ,"sample.filter-by": "筛选条件..."
  ,"sample.listview.messaging-note": "此 ListView 从底部向上增长，适合显示日志或消息，最新内容会显示在底部。"
  ,"sample.listview.context-note": "此 ListView 支持右键打开上下文菜单；在此示例中，菜单提供删除条目的选项。"
  ,"sample.listview.views": " 查看次数 "
  ,"sample.listview.likes": " 点赞数"
  ,"sample.pulltorefresh.basic": "基础 PullToRefresh"
  ,"sample.pulltorefresh.custom-icon": "自定义图标 PullToRefresh"
  ,"sample.pulltorefresh.pull-down": "下拉刷新"
  ,"sample.pulltorefresh.pull-down-custom": "下拉同步数据"
  ,"sample.pulltorefresh.refresh-count": "刷新次数：{count}"
  ,"sample.pulltorefresh.sync-count": "同步次数：{count}"
  ,"sample.pulltorefresh.state-label": "RefreshVisualizer 状态"
  ,"sample.pulltorefresh.state-value": "状态：{state}"
  ,"sample.pulltorefresh.gesture-description": "在列表顶部使用触摸向下拉动，即可刷新内容。"
  ,"sample.pulltorefresh.request-refresh": "刷新"
  ,"sample.pulltorefresh.ready": "可以刷新"
  ,"sample.pulltorefresh.refreshing": "正在刷新…"
  ,"sample.pulltorefresh.new-control": "新控件 {count}"
  ,"sample.pulltorefresh.new-friend": "新朋友 {count}"
  ,"sample.pulltorefresh.state.idle": "空闲"
  ,"sample.pulltorefresh.state.peeking": "预览"
  ,"sample.pulltorefresh.state.interacting": "交互中"
  ,"sample.pulltorefresh.state.pending": "释放以刷新"
  ,"sample.pulltorefresh.state.refreshing": "刷新中"
  ,"sample.pulltorefresh.control.acrylicbrush": "AcrylicBrush"
  ,"sample.pulltorefresh.control.colorpicker": "ColorPicker"
  ,"sample.pulltorefresh.control.navigationview": "NavigationView"
  ,"sample.pulltorefresh.control.parallaxview": "ParallaxView"
  ,"sample.pulltorefresh.control.personpicture": "PersonPicture"
  ,"sample.pulltorefresh.control.pulltorefreshpage": "PullToRefreshPage"
  ,"sample.pulltorefresh.control.ratingscontrol": "RatingsControl"
  ,"sample.pulltorefresh.control.revealbrush": "RevealBrush"
  ,"sample.pulltorefresh.control.treeview": "TreeView"
  ,"sample.pulltorefresh.friend.mike": "迈克"
  ,"sample.pulltorefresh.friend.ben": "本"
  ,"sample.pulltorefresh.friend.barbra": "芭芭拉"
  ,"sample.pulltorefresh.friend.claire": "克莱尔"
  ,"sample.pulltorefresh.friend.justin": "贾斯汀"
  ,"sample.pulltorefresh.friend.shawn": "肖恩"
  ,"sample.pulltorefresh.friend.drew": "德鲁"
  ,"sample.pulltorefresh.friend.lili": "莉莉"
  ,"sample.treeview.drag-drop": "支持拖放的简单 TreeView"
  ,"sample.treeview.multi-selection": "启用多选的 TreeView"
  ,"sample.treeview.databinding-itemsource": "使用 ItemsSource 数据绑定的 TreeView"
  ,"sample.treeview.item-template-selector": "使用 ItemTemplateSelector 的 TreeView"
  ,"sample.treeview.toggle-theme": "切换页面主题"
  ,"sample.treeview.add-to-favorites": "将树视图添加到收藏"
  ,"sample.treeview.remove-from-favorites": "将树视图从收藏中移除"
  ,"sample.treeview.node.work-documents": "工作文档"
  ,"sample.treeview.node.xyz-functional-spec": "XYZ 功能规范"
  ,"sample.treeview.node.feature-schedule": "功能计划"
  ,"sample.treeview.node.personal-documents": "个人文档"
  ,"sample.treeview.node.home-remodel": "住宅改造"
  ,"sample.treeview.node.contractor-contact-info": "承包商联系信息"
  ,"sample.treeview.node.paint-color-scheme": "油漆配色方案"
  ,"sample.treeview.node.documents": "文档"
  ,"sample.treeview.node.project-proposal": "项目提案"
  ,"sample.treeview.node.budget-report": "预算报告"
  ,"sample.treeview.node.projects": "项目"
  ,"sample.treeview.node.project-plan": "项目计划"
  ,"sample.add-item": "添加项目"
  ,"sample.remove-item": "移除项目"
  ,"sample.stacklayout-vertical": "StackLayout - 垂直"
  ,"sample.stacklayout-horizontal": "StackLayout - 水平"
  ,"sample.uniform-grid": "均匀网格"
  ,"sample.linedflow-layout": "流式布局"
  ,"sample.stacklayout": "堆叠布局"
  ,"sample.activity-feed-layout": "活动信息流布局"
  ,"sample.custom-virtualizing-layout": "自定义虚拟化布局"
  ,"sample.options-colon": "选项："
  ,"sample.space-between-columns": "列间距"
  ,"sample.space-between-rows": "行间距"
  ,"sample.space-between-lines": "行之间的间距"
  ,"sample.minimum-space-between-columns": "列之间的最小间距"
  ,"sample.minimum-space-between-rows": "行之间的最小间距"
  ,"sample.minimum-space-between-items-on-line": "同一行上项目之间的最小间距"
  ,"sample.maximum-items-before-wrapping": "换行前的最大项目数"
  ,"sample.maximum-items-per-row-before-wrapping": "每行换行前的最大项目数"
  ,"sample.line-height": "行高"
  ,"sample.line.description": "在两个点之间绘制一条直线。"
  ,"sample.line.line": "直线"
  ,"sample.line.polyline": "折线"
  ,"sample.line.path": "路径"
  ,"sample.line.geometry-group": "几何组合"
  ,"sample.line.polyline-description": "绘制一组相互连接的直线。"
  ,"sample.line.path-description": "绘制一组相互连接的直线和曲线。"
  ,"sample.line.geometry-description": "使用 GeometryGroup 创建复合几何对象。"
  ,"sample.line.start-point-x": "起点 X"
  ,"sample.line.start-point-y": "起点 Y"
  ,"sample.line.end-point-x": "终点 X"
  ,"sample.line.end-point-y": "终点 Y"
  ,"sample.line.stroke-thickness": "描边粗细"
  ,"sample.line.show-points": "显示点"
  ,"sample.line.radius-x": "X 轴半径"
  ,"sample.line.radius-y": "Y 轴半径"
  ,"sample.line.point-1": "点 #1：(10,100)"
  ,"sample.line.polyline-point-2": "点 #2：(60,40)"
  ,"sample.line.polyline-point-3": "点 #3：(200,40)"
  ,"sample.line.polyline-point-4": "点 #4：(250,100)"
  ,"sample.line.path-point-2": "点 #2：(100,25)"
  ,"sample.line.path-point-3": "点 #3：(300,250)"
  ,"sample.line.path-point-4": "点 #4：(400,75)"
  ,"sample.line.path-point-5": "点 #5：(200,75)"
  ,"sample.line.path-comment-1": "第一段是从点 #1 到点 #4 的三次贝塞尔曲线，以点 #2 和点 #3 为控制点。在 Data 属性字符串中使用 C 命令表示此段。"
  ,"sample.line.path-comment-2": "第二段以绝对水平线命令 H 开始，从前一子路径的终点（点 #4）绘制到新的终点（点 #5）。由于该命令绘制水平线，指定值表示 x 坐标。"
  ,"sample.line.geometry-comment": "使用三个几何对象创建复合形状。"
  ,"sample.line.line-output": "起点：({x1}, {y1})；终点：({x2}, {y2})；描边：{thickness}"
  ,"sample.line.polyline-output": "顶点：{points}；描边：{thickness}；顶点标签：{visibility}"
  ,"sample.line.path-output": "路径：{data}；描边：{thickness}；顶点标签：{visibility}"
  ,"sample.line.geometry-output": "椭圆半径：({radiusX}, {radiusY})"
  ,"sample.line.points-visible": "显示"
  ,"sample.line.points-hidden": "隐藏"
  ,"sample.small": "小"
  ,"sample.large": "大"
  ,"sample.likes-suffix": " 个赞"
  ,"sample.selection-mode": "选择模式"
  ,"sample.selection-none": "无"
  ,"sample.selection-single": "单选"
  ,"sample.selection-multiple": "多选"
  ,"sample.selection-extended": "扩展选择"
  ,"sample.item-template": "项目模板"
  ,"sample.is-item-click-enabled": "启用项目点击"
  ,"sample.can-drag-items": "允许拖动项目"
  ,"sample.can-reorder-items": "允许重新排序项目"
  ,"sample.allow-drop": "允许放置"
  ,"sample.layout": "布局"
  ,"sample.itemsview.selection-note-single": "Single 只允许集合中选择一个项目。"
  ,"sample.itemsview.selection-note-multiple": "Multiple 会显示复选框，以便选择多个项目。"
  ,"sample.listview.last-name": "姓氏"
  ,"sample.listview.company": "公司"
  ,"sample.layout-linedflow": "流式布局"
  ,"sample.layout-uniformgrid": "均匀网格布局"
  ,"sample.layout-stack": "堆叠布局"
  ,"sample.layout-activityfeed": "活动信息流布局"
  ,"sample.is-item-invoked-enabled": "启用项目调用"
  ,"sample.filter-by-ingredient": "按食材筛选..."
  ,"sample.sort-by-number-of-ingredients": "按食材数量排序"
  ,"sample.least-to-most": "从少到多"
  ,"sample.most-to-least": "从多到少"
  ,"sample.reverse-flowdirection": "反转 FlowDirection"
  ,"sample.sticky-headers": "粘性标题"
  ,"sample.image": "图像"
  ,"sample.rating.caption": "312 个评分"
  ,"sample.rating.is-clear-enabled": "启用清除评分"
  ,"sample.rating.is-read-only": "只读"
  ,"sample.rating.your-rating": "你的评分"
  ,"sample.rating.clear-note": "向左轻扫或再次点击可清除评分。"
  ,"sample.rating.placeholder": "RatingControl 的 PlaceholderValue"
  ,"sample.rating.simple-name": "简单评分控件"
  ,"sample.rating.placeholder-name": "带占位评分的评分控件"
  ,"sample.themeshadow.applied-border": "将主题阴影应用于 Border"
  ,"sample.themeshadow.shadow-intensity": "阴影强度"
  ,"sample.themeshadow.z-translation": "Z 轴位移"
  ,"sample.themeshadow.translation-output": "位移：({x}, {y}, {z})"
  ,"sample.themeshadow.receivers-output": "阴影接收元素：{count}"
  ,"text.theme-shadow-description": "使用系统光照和深度为界面元素添加逼真的阴影效果，增强视觉层次。"
  ,"sample.placeholder-value": "占位值"
  ,"sample.ring": "环形"
  ,"sample.background": "背景"
  ,"sample.border": "边框"
  ,"sample.select-all": "全选"
  ,"sample.select-an-option": "选择一个选项。"
  ,"sample.slider.control-header": "控件标题"
  ,"sample.slider.minimum": "最小值："
  ,"sample.slider.maximum": "最大值："
  ,"sample.slider.step-frequency": "步进频率："
  ,"sample.slider.small-change": "小步长："
  ,"sample.slider.range": "指定范围和步进的滑块。"
  ,"sample.slider.snaps-to": "吸附到："
  ,"sample.slider.ticks": "带刻度标记的滑块。"
  ,"sample.slider.vertical": "指定范围和刻度标记的垂直滑块。"
  ,"sample.slider.simple-name": "简单滑块"
  ,"sample.slider.ticks-name": "带刻度的滑块"
  ,"sample.slider.vertical-name": "垂直滑块"
  ,"sample.slider.minimum-name": "最小值"
  ,"sample.slider.maximum-name": "最大值"
  ,"sample.slider.step-frequency-name": "步进频率"
  ,"sample.slider.small-change-name": "小步长"
  ,"sample.splitbutton.color-picker": "控制富文本编辑框中文字颜色的拆分按钮"
  ,"sample.step-values": "步进值"
  ,"sample.ticks": "刻度"
  ,"sample.toggle-work": "切换工作"
  ,"sample.splitbutton.text": "包含文本的拆分按钮"
  ,"sample.splitbutton.font-color": "字体颜色"
  ,"sample.splitbutton.font-color-with-text": "带文本的字体颜色"
  ,"sample.splitbutton.rich-text": "这是拆分按钮页中的富文本示例。你可以从菜单中选择颜色，并将其应用到这段文字。"
  ,"sample.do-work": "开始工作"
  ,"sample.togglebutton.simple": "包含文本内容的简单切换按钮。"
  ,"sample.togglebutton.on": "开"
  ,"sample.togglebutton.off": "关"
  ,"sample.toggleswitch.custom": "带自定义标题和内容的切换开关。"
  ,"sample.togglesplitbutton.bullet-list": "使用切换拆分按钮控制富文本编辑框中的项目符号列表功能"
  ,"sample.togglesplitbutton.bulleted-list": "项目符号列表"
  ,"sample.togglesplitbutton.roman-numerals-list": "罗马数字列表"
  ,"sample.togglesplitbutton.bullets": "项目符号"
  ,"sample.togglesplitbutton.roman-numerals": "罗马数字"
  ,"sample.togglesplitbutton.text-entry": "文本输入"
  ,"sample.type-something-here": "在此处键入内容"
  ,"sample.autosuggestbox.search-experience": "AutoSuggestBox 提供搜索体验"
  ,"sample.autosuggestbox.type-control-name": "输入控件名称"
  ,"sample.autosuggestbox.no-results": "未找到结果"
  ,"sample.autosuggestbox.subtitle.autosuggestbox": "在用户键入时显示建议的文本控件。"
  ,"sample.autosuggestbox.subtitle.button": "响应用户输入并触发 Click 事件的控件。"
  ,"sample.autosuggestbox.subtitle.checkbox": "用户可以选中或清除的控件。"
  ,"sample.autosuggestbox.subtitle.combobox": "用户可以从中选择项目的下拉列表。"
  ,"sample.autosuggestbox.subtitle.numberbox": "用于显示和编辑数字的控件。"
  ,"sample.autosuggestbox.subtitle.passwordbox": "用于输入密码的控件。"
  ,"sample.autosuggestbox.subtitle.richeditbox": "用于输入和编辑格式化文本的控件。"
  ,"sample.autosuggestbox.subtitle.textbox": "允许用户输入简单文本的控件。"
  ,"sample.numberbox.spin-button": "带微调按钮的 NumberBox"
  ,"sample.numberbox.formatted-rounding": "四舍五入到最接近 0.25 的格式化 NumberBox"
  ,"sample.numberbox.enter-integer": "输入整数："
  ,"sample.numberbox.enter-dollar-amount": "输入美元金额："
  ,"sample.numberbox.spinbutton-placement": "SpinButton 位置"
  ,"sample.numberbox.compact": "紧凑"
  ,"sample.passwordbox.header-placeholder-character": "带标题、占位符文本和自定义字符的 PasswordBox"
  ,"sample.passwordbox.reveal-mode": "带显示模式的 PasswordBox"
  ,"sample.passwordbox.password": "密码"
  ,"sample.passwordbox.enter-password": "输入你的密码"
  ,"sample.passwordbox.show-password": "显示密码"
  ,"sample.passwordbox.not-allowed": "不允许使用“Password”作为密码。"
  ,"sample.richeditbox.custom-command-flyout": "自定义 RichEditBox 的 CommandBarFlyout - 添加“共享”"
  ,"sample.richeditbox.custom-formatting-editor": "使用 RichEditBox 的自定义编辑器。"
  ,"sample.richeditbox.math-mode": "数学模式下的 RichEditBox"
  ,"sample.richeditbox.mathml": "在 RichEditBox 中使用 MathML"
  ,"sample.richeditbox.editor-header": "带自定义菜单的编辑器"
  ,"sample.richeditbox.command-placeholder": "选择文本并使用命令菜单。"
  ,"sample.richeditbox.open-file": "打开文件"
  ,"sample.richeditbox.save-file": "保存文件"
  ,"sample.richeditbox.bold": "加粗"
  ,"sample.richeditbox.italic": "斜体"
  ,"sample.richeditbox.underline": "下划线"
  ,"sample.richeditbox.bullets": "项目符号"
  ,"sample.richeditbox.numbering": "编号"
  ,"sample.richeditbox.clear-formatting": "清除格式"
  ,"sample.richeditbox.font-color": "字体颜色"
  ,"sample.richeditbox.custom-editor": "自定义编辑器"
  ,"sample.richeditbox.share-command": "共享"
  ,"sample.richeditbox.share-clicked": "已点击共享命令"
  ,"sample.richeditbox.compose-placeholder": "撰写格式化文本"
  ,"sample.richeditbox.find-label": "查找："
  ,"sample.richeditbox.search-placeholder": "输入搜索文本"
  ,"sample.richeditbox.math-note": "数学模式允许控件在接收输入时自动识别并转换为数学表达式。"
  ,"sample.richeditbox.math-example": "例如，“4^2”会转换为“4²”，“\\pi”会转换为“π”。"
  ,"sample.richeditbox.math-placeholder": "输入数学表达式，例如：4^2、\\pi、\\alpha、\\beta"
  ,"sample.richeditbox.mathml-set-note": "SetMathML 方法接收 MathML 字符串，并在 RichEditBox 中显示对应公式。"
  ,"sample.richeditbox.mathml-get-note": "GetMathML 方法从 RichEditBox 中检索公式的 MathML 字符串。"
  ,"sample.richeditbox.mathml-code": "MathML 代码"
  ,"sample.richeditbox.set-sample-formula": "设置示例公式"
  ,"sample.richeditbox.no-mathml": "没有 MathML 内容"
  ,"sample.richeditbox.web-preview": "Web 预览内容"
  ,"sample.textbox.header-placeholder": "带标题和占位符文本的 TextBox"
  ,"sample.textbox.readonly-properties": "设置了各种属性的只读 TextBox"
  ,"sample.textbox.multiline-spellcheck-selection": "带拼写检查和自定义选择高亮颜色的多行 TextBox"
  ,"sample.textbox.enter-your-name": "输入你的姓名："
  ,"sample.textbox.name-placeholder": "姓名"
  ,"sample.common.excited-text": "我非常高兴来到这里！"
  ,"sample.textblock.style-applied": "应用了样式的 TextBlock。"
  ,"sample.textblock.properties": "设置了各种属性的 TextBlock。"
  ,"sample.textblock.inline-elements": "包含内联文本元素的 TextBlock。"
  ,"sample.textblock.selectable": "可选择的 TextBlock"
  ,"sample.textblock.styled-text": "我是一个带样式的 TextBlock。"
  ,"sample.textblock.inline-first": "TextBlock 中的文本不必只是简单字符串。"
  ,"sample.textblock.inline-prefix": "文本可以是"
  ,"sample.textblock.inline-bold": "加粗"
  ,"sample.textblock.inline-italic": "斜体"
  ,"sample.textblock.inline-or": "或"
  ,"sample.textblock.inline-underlined": "下划线"
  ,"sample.textblock.selectable-text": "我是一个带自定义 SelectionHighlightColor 的可选择 TextBlock。"
  ,"sample.textblock.selection-toggle": "启用文本选择"
  ,"sample.richtextblock.simple": "简单 RichTextBlock"
  ,"sample.richtextblock.selection-highlight": "带自定义选择高亮的 RichTextBlock"
  ,"sample.richtextblock.overflow": "RichTextBlock 溢出"
  ,"sample.richtextblock.custom-highlighting": "自定义文本高亮"
  ,"sample.richtextblock.description": "RichTextBlock 提供富文本显示容器，支持格式化文本、超链接、内联图像和其他富内容。"
  ,"sample.richtextblock.simple-text": "我是一个 RichTextBlock。"
  ,"sample.richtextblock.rich-container-supports": "RichTextBlock 提供富文本显示容器，支持"
  ,"sample.richtextblock.formatted-text": "格式化文本"
  ,"sample.richtextblock.hyperlinks": "超链接"
  ,"sample.richtextblock.inline-images-and-rich-content": "内联图像和其他富内容。"
  ,"sample.richtextblock.overflow-support": "RichTextBlock 还支持内置溢出模型。"
  ,"sample.richtextblock.overflow-paragraph": "链接文本容器允许一个元素中放不下的文本溢出到页面上的其他元素中。合理使用链接文本容器可以实现基本的多列支持和其他高级页面布局。"
  ,"sample.richtextblock.overflow-long": "这段示例文本特意写得较长，用来让第一个容器中的内容溢出到后续列中。它演示了富文本布局如何在页面的多个区域中连续呈现相关内容。"
  ,"sample.richtextblock.highlight-prefix": "这是一段用于演示的文本，"
  ,"sample.richtextblock.highlight-word": "其中一部分"
  ,"sample.richtextblock.highlight-suffix": "会根据所选颜色显示自定义高亮。"
  ,"sample.richtextblock.highlighting-color": "文本高亮颜色"
  ,"sample.violet": "紫罗兰色"
  ,"sample.working": "工作中"
  ,"sample.you-selected": "你选择了 {option}"
  ,"sample.you-clicked": "你点击了：{name}"
  ,"control.datepicker.month": "月"
  ,"control.datepicker.day": "日"
  ,"control.datepicker.year": "年"
  ,"control.timepicker.hour": "时"
  ,"control.timepicker.minute": "分"
  ,"control.timepicker.am": "上午"
  ,"control.timepicker.pm": "下午"
  ,"sample.contentdialog.no-default": "没有默认按钮的内容对话框。"
  ,"sample.contentdialog.save-title": "保存你的工作？"
  ,"sample.contentdialog.replace-title": "替换文件？"
  ,"sample.contentdialog.body": "这是内容对话框中的示例文本。"
  ,"sample.contentdialog.upload": "将你的内容上传到云。"
  ,"sample.contentdialog.save": "保存"
  ,"sample.contentdialog.dont-save": "不保存"
  ,"sample.contentdialog.cancel": "取消"
  ,"sample.contentdialog.replace": "替换"
  ,"sample.contentdialog.keep": "保留"
  ,"sample.contentdialog.show-no-default": "显示没有默认按钮的对话框"
  ,"sample.contentdialog.saved": "用户保存了工作"
  ,"sample.contentdialog.not-saved": "用户没有保存工作"
  ,"sample.contentdialog.cancelled": "用户取消了对话框"
  ,"sample.contentdialog.replaced": "用户替换了文件"
  ,"sample.contentdialog.kept": "用户保留了文件"
  ,"sample.flyout.empty-cart": "清空购物车"
  ,"sample.flyout.shared": "此浮出面板是共享的。"
  ,"sample.flyout.remove-all": "所有项目都将被移除。是否继续？"
  ,"sample.flyout.confirm-empty": "是，清空我的购物车"
     ,"sample.commandbarflyout.object": "用于应用内对象命令的 CommandBarFlyout"
  ,"sample.commandbarflyout.open-hint": "单击或右键单击图像以打开 CommandBarFlyout"
  ,"sample.appbarbutton.symbol": "带有符号图标的应用栏按钮。"
  ,"sample.appbarbutton.symbol-label": "SymbolIcon"
  ,"sample.appbarbutton.bitmap": "带有位图图标的应用栏按钮。"
  ,"sample.appbarbutton.bitmap-label": "BitmapIcon"
  ,"sample.appbarbutton.font": "带有字体图标的应用栏按钮。"
  ,"sample.appbarbutton.font-label": "FontIcon"
  ,"sample.appbarbutton.path": "带有路径图标的应用栏按钮。"
  ,"sample.appbarbutton.path-label": "PathIcon"
  ,"sample.appbarbutton.keyboard": "带有 KeyboardAccelerator 的应用栏按钮"
  ,"sample.appbarbutton.flyout": "打开包含输入控件的 Flyout 的应用栏按钮。"
  ,"sample.appbarbutton.input-placeholder": "在此输入文本"
  ,"sample.appbarseparator.separated": "由 AppBarSeparator 分隔的应用栏按钮。"
  ,"sample.appbarseparator.attach-camera": "附加相机"
  ,"sample.appbarseparator.like": "喜欢"
  ,"sample.appbarseparator.dislike": "不喜欢"
  ,"sample.appbarseparator.orientation": "方向"
  ,"sample.appbartogglebutton.symbol": "带有符号图标的应用栏切换按钮。"
  ,"sample.appbartogglebutton.bitmap": "带有位图图标的应用栏切换按钮。"
  ,"sample.appbartogglebutton.font": "带有字体图标的应用栏切换按钮。"
  ,"sample.appbartogglebutton.path": "带有路径图标的三态应用栏切换按钮。"
  ,"sample.appbartogglebutton.output": "IsChecked = {value}"
     ,"sample.commandbar.show-or-hide": "显示或隐藏"
     ,"sample.commandbar.open": "打开命令栏"
     ,"sample.commandbar.close": "关闭命令栏"
     ,"sample.commandbar.modify-content": "修改内容"
     ,"sample.commandbar.add-secondary": "添加二级命令"
     ,"sample.commandbar.remove-secondary": "移除二级命令"
     ,"sample.commandbar.button-1": "按钮 1"
     ,"sample.commandbar.button-2": "按钮 2"
     ,"sample.commandbar.button-3": "按钮 3"
     ,"sample.commandbar.button-4": "按钮 4"
     ,"sample.mountain": "山"
  ,"sample.share": "共享"
  ,"sample.save": "保存"
  ,"sample.delete": "删除"
  ,"sample.resize": "调整大小"
  ,"sample.move": "移动"
  ,"sample.sort": "排序"
  ,"sample.by-rating": "按评分"
  ,"sample.by-match": "按匹配度"
  ,"sample.by-distance": "按距离"
  ,"sample.sort-by": "排序方式：{value}"
  ,"sample.menuflyout.toggle-items": "带切换菜单项和分隔线的菜单浮出面板。"
  ,"sample.menuflyout.cascading": "带级联菜单的菜单浮出面板。"
  ,"sample.menuflyout.split-items": "带拆分菜单项的菜单浮出面板。"
  ,"sample.menuflyout.icons": "带图标的菜单浮出面板。"
  ,"sample.menuflyout.keyboard": "带图标和键盘快捷键的菜单浮出面板。"
  ,"sample.menuflyout.radio": "带单选菜单项的菜单浮出面板"
  ,"sample.menuflyout.sort": "排序"
  ,"sample.menuflyout.by-rating": "按评分"
  ,"sample.menuflyout.by-match": "按匹配度"
  ,"sample.menuflyout.by-distance": "按距离"
  ,"sample.menuflyout.options": "选项"
  ,"sample.menuflyout.reset": "重置"
  ,"sample.menuflyout.repeat": "重复"
  ,"sample.menuflyout.shuffle": "随机播放"
  ,"sample.menuflyout.file-options": "文件选项"
  ,"sample.menuflyout.open": "打开"
  ,"sample.menuflyout.send-to": "发送到"
  ,"sample.menuflyout.bluetooth": "蓝牙"
  ,"sample.menuflyout.desktop-shortcut": "桌面（快捷方式）"
  ,"sample.menuflyout.compressed-file": "压缩文件"
  ,"sample.menuflyout.compress-email": "压缩并发送邮件"
  ,"sample.menuflyout.compress-7z": "压缩为 .7z"
  ,"sample.menuflyout.compress-zip": "压缩为 .zip"
  ,"sample.menuflyout.save": "保存"
  ,"sample.menuflyout.save-docx": "另存为 .docx"
  ,"sample.menuflyout.save-pdf": "另存为 .pdf"
  ,"sample.menuflyout.save-txt": "另存为 .txt"
  ,"sample.menuflyout.share": "共享"
  ,"sample.menuflyout.share-email": "通过邮件共享"
  ,"sample.menuflyout.share-link": "通过链接共享"
  ,"sample.menuflyout.edit-options": "编辑选项"
  ,"sample.menuflyout.copy": "复制"
  ,"sample.menuflyout.delete": "删除"
  ,"sample.menuflyout.rename": "重命名"
  ,"sample.menuflyout.select": "选择"
  ,"sample.menuflyout.landscape": "横向"
  ,"sample.menuflyout.portrait": "纵向"
  ,"sample.menuflyout.small-icons": "小图标"
  ,"sample.menuflyout.medium-icons": "中图标"
  ,"sample.menuflyout.large-icons": "大图标"
  ,"sample.menuflyout.rating": "评分"
  ,"sample.menuflyout.match": "匹配度"
  ,"sample.menuflyout.distance": "距离"
  ,"sample.menuflyout.sort-output": "排序方式：{value}"
  ,"sample.menuflyout.clicked-output": "已点击：{value}"
  ,"sample.menubar.keyboard": "带键盘快捷键的菜单栏"
  ,"sample.menubar.submenus": "带子菜单、分隔线和单选菜单项的菜单栏"
  ,"sample.menubar.undo": "撤销"
  ,"sample.menubar.redo": "重做"
  ,"sample.menubar.cut": "剪切"
  ,"sample.menubar.paste": "粘贴"
  ,"sample.menubar.plain-text": "纯文本文档"
  ,"sample.menubar.rich-text": "富文本文档"
  ,"sample.menubar.other-formats": "其他格式"
  ,"sample.menubar.output": "输出"
  ,"sample.menubar.clicked-output": "你点击了：{value}"
  ,"MenuBarSample_File.Title": "文件"
  ,"MenuBarSample_Edit.Title": "编辑"
  ,"MenuBarSample_View.Title": "视图"
  ,"MenuBarSample_Help.Title": "帮助"
  ,"MenuBarSample_New.Text": "新建"
  ,"MenuBarSample_Open.Text": "打开"
  ,"MenuBarSample_Save.Text": "保存"
  ,"MenuBarSample_Exit.Text": "退出"
  ,"MenuBarSample_Undo.Text": "撤销"
  ,"MenuBarSample_Cut.Text": "剪切"
  ,"MenuBarSample_Copy.Text": "复制"
  ,"MenuBarSample_Paste.Text": "粘贴"
  ,"MenuBarSample_About.Text": "关于"
  ,"MenuBarSample_PlainText.Text": "纯文本文档"
  ,"MenuBarSample_RichText.Text": "富文本文档"
  ,"MenuBarSample_OtherFormats.Text": "其他格式"
  ,"MenuBarSample_Output.Text": "输出"
  ,"MenuBarSample_Landscape.Text": "横向"
  ,"MenuBarSample_Portrait.Text": "纵向"
  ,"MenuBarSample_SmallIcons.Text": "小图标"
  ,"MenuBarSample_MediumIcons.Text": "中等图标"
  ,"MenuBarSample_LargeIcons.Text": "大图标"
  ,"sample.options": "选项"
  ,"sample.file-options": "文件选项"
  ,"sample.edit-options": "编辑选项"
  ,"sample.reset": "重置"
  ,"sample.repeat": "重复"
  ,"sample.shuffle": "随机播放"
  ,"sample.open": "打开"
  ,"sample.send-to": "发送到"
  ,"sample.bluetooth": "蓝牙"
  ,"sample.desktop-shortcut": "桌面（快捷方式）"
  ,"sample.compressed-file": "压缩文件"
  ,"sample.compress-email": "压缩并通过电子邮件发送"
  ,"sample.compress-7z": "压缩为 .7z"
  ,"sample.compress-zip": "压缩为 .zip"
  ,"sample.save-docx": "另存为 .docx"
  ,"sample.save-pdf": "另存为 .pdf"
  ,"sample.save-txt": "另存为 .txt"
  ,"sample.share-email": "通过电子邮件共享"
  ,"sample.share-link": "通过链接共享"
  ,"sample.copy": "复制"
  ,"sample.rename": "重命名"
  ,"sample.select": "选择"
  ,"sample.landscape": "横向"
  ,"sample.portrait": "纵向"
  ,"sample.small-icons": "小图标"
  ,"sample.medium-icons": "中等图标"
  ,"sample.large-icons": "大图标"
  ,"sample.clicked": "已单击：{value}"
  ,"sample.popup.simple": "简单弹出窗口"
  ,"sample.popup.description": "在应用程序窗口边界内，在现有内容上方显示内容。"
  ,"sample.popup.close": "关闭"
  ,"sample.popup.light-dismiss": "启用轻量关闭"
  ,"sample.popup.vertical-offset": "垂直偏移"
  ,"sample.popup.horizontal-offset": "水平偏移"
  ,"sample.true": "是"
  ,"sample.false": "否"
  ,"sample.teachingtip.targeted": "在按钮上显示带目标的教学提示。"
  ,"sample.teachingtip.non-targeted": "显示带按钮且无目标的教学提示。"
  ,"sample.teachingtip.hero": "在按钮上显示带主图内容的教学提示。"
  ,"sample.teachingtip.title": "这是标题"
  ,"sample.teachingtip.subtitle": "这是副标题"
  ,"sample.teachingtip.action-button": "操作按钮"
  ,"sample.teachingtip.close-button": "关闭按钮"
  ,"sample.teachingtip.description": "描述可以放在这里"
  ,"sample.teachingtip.sunset": "日落"
  ,"sample.tooltip.simple": "带简单 ToolTip 的按钮。"
  ,"sample.tooltip.simple-content": "简单 ToolTip"
  ,"sample.tooltip.button-content": "带简单 ToolTip 的按钮。"
  ,"sample.tooltip.attached": "带偏移 ToolTip 的 TextBlock。"
  ,"sample.tooltip.service-content": "偏移 ToolTip。"
  ,"sample.tooltip.textblock-target": "带偏移 ToolTip 的 TextBlock。"
  ,"sample.tooltip.image": "使用 PlacementRect 的带 ToolTip 图像。"
  ,"sample.tooltip.image-content": "不遮挡内容的 ToolTip。"
  ,"sample.tooltip.image-alt": "悬崖景观"
  ,"sample.tooltip.image-description": "不遮挡内容的工具提示"
  ,"sample.tooltip.controlled": "通过 IsOpen 打开的 ToolTip。"
  ,"sample.tooltip.toggle-open": "切换 ToolTip"
  ,"sample.tooltip.controlled-target": "受控定位目标"
  ,"sample.tooltip.controlled-content": "此 ToolTip 由 IsOpen 控制。"
  ,"text.sunset": "日落"
  ,"text.play": "播放"
  ,"text.pause": "暂停"
  ,"text.stop": "停止"
  ,"text.volume": "音量"
  ,"text.mute": "静音"
  ,"text.unmute": "取消静音"
  ,"text.cast": "投放"
  ,"text.aspect-ratio": "纵横比"
  ,"text.browser-does-not-support-casting": "此浏览器不支持投放功能。"
  ,"text.casting-is-not-available": "投放功能不可用。"
  ,"text.casting-panel-opened-or-connecting": "投放面板已打开或正在连接。"
  ,"text.no-casting-devices-found": "未找到投放设备。\n\n请确保投放设备已开机并连接到同一网络。"
  ,"text.casting-permission-denied": "投放权限被拒绝。"
  ,"text.casting-cancelled": "用户取消了投放。"
  ,"sample.splitview.pane-content": "窗格内容"
  ,"sample.splitview.splitview-content": "拆分视图内容"
  ,"sample.splitview.page": "页面"
  ,"sample.splitview.people": "人员"
  ,"sample.splitview.globe": "地球"
  ,"sample.splitview.message": "消息"
  ,"sample.splitview.mail": "邮件"
  ,"sample.splitview.is-pane-open": "打开窗格"
  ,"sample.splitview.placement": "放置位置"
  ,"sample.splitview.left": "左"
  ,"sample.splitview.right": "右"
  ,"sample.splitview.display-mode": "显示模式"
  ,"sample.splitview.pane-background": "窗格背景"
  ,"sample.splitview.open-pane-length": "展开窗格长度"
  ,"sample.splitview.compact-pane-length": "紧凑窗格长度"
  ,"sample.splitview.inline": "内联"
  ,"sample.splitview.compact-inline": "紧凑内联"
  ,"sample.splitview.overlay": "覆盖"
  ,"sample.splitview.compact-overlay": "紧凑覆盖"
  ,"sample.splitview.theme-background": "主题窗格背景"
  ,"sample.splitview.red": "红色"
  ,"sample.splitview.blue": "蓝色"
  ,"sample.splitview.green": "绿色"
  ,"sample.splitview.navigation-page": "{page}页面"
  ,"sample.animatedvisualplayer.playback": "播放 Lottie 动画。"
  ,"sample.animatedvisualplayer.description": "此 AnimatedVisualPlayer 使用由 Adobe AfterEffects 创建并通过 Lottie-Windows 转换为 Microsoft.UI.Composition 对象的动画。由于这里使用的 CompositionShapes 支持 Windows 10 版本 17763 及更高版本，当 Source 不可用时 AnimatedVisualPlayer 会回退为 Image。"
  ,"sample.animatedvisualplayer.reverse": "反向"
  ,"sample.breadcrumbbar.control": "面包屑导航栏控件"
  ,"sample.breadcrumbbar.custom-data-template": "带自定义数据模板的面包屑导航栏控件"
  ,"sample.breadcrumbbar.reset-sample": "重置示例"
  ,"sample.breadcrumbbar.reset-success": "面包屑导航栏示例已成功重置。"
  ,"sample.breadcrumbbar.home": "主页"
  ,"sample.breadcrumbbar.documents": "文档"
  ,"sample.breadcrumbbar.design": "设计"
  ,"sample.breadcrumbbar.northwind": "Northwind"
  ,"sample.breadcrumbbar.images": "图像"
  ,"sample.breadcrumbbar.folder-1": "文件夹1"
  ,"sample.breadcrumbbar.folder-2": "文件夹2"
  ,"sample.breadcrumbbar.folder-3": "文件夹3"
  ,"sample.pivot.basic": "基础透视视图。"
  ,"sample.pivot.email": "电子邮件"
  ,"sample.pivot.all": "全部"
  ,"sample.pivot.all-content": "所有邮件显示在这里。"
  ,"sample.pivot.unread": "未读"
  ,"sample.pivot.unread-content": "未读邮件显示在这里。"
  ,"sample.pivot.flagged": "已标记"
  ,"sample.pivot.flagged-content": "已标记邮件显示在这里。"
  ,"sample.pivot.urgent": "紧急"
  ,"sample.pivot.urgent-content": "紧急邮件显示在这里。"
  ,"sample.selectorbar.basic": "基本 SelectorBar"
  ,"sample.selectorbar.frame-slide-transitions": "带 Frame 滑动过渡的 SelectorBar"
  ,"sample.selectorbar.collections": "使用 ItemsView 显示不同集合的 SelectorBar"
  ,"sample.selectorbar.page-1": "第 1 页"
  ,"sample.selectorbar.page-2": "第 2 页"
  ,"sample.selectorbar.page-3": "第 3 页"
  ,"sample.selectorbar.page-4": "第 4 页"
  ,"sample.selectorbar.page-5": "第 5 页"
  ,"sample.selectorbar.pink": "粉色"
  ,"sample.selectorbar.plum": "洋李色"
  ,"sample.selectorbar.powder-blue": "粉蓝色"
  ,"sample.capture.preview": "通过 MediaPlayerElement 显示的 MediaCapture 预览。"
  ,"sample.capture.mirror-preview": "镜像预览"
  ,"sample.capture.mirror-tooltip": "只镜像预览，不镜像捕获的照片"
  ,"sample.capture.capture-photo": "捕获照片"
  ,"sample.capture.enable-camera-switching": "启用相机切换"
  ,"sample.capture.switch-camera": "切换相机"
  ,"sample.capture.captured-label": "已捕获："
  ,"sample.capture.no-devices": "未找到相机设备。"
  ,"sample.capture.viewing": "正在查看：{name}"
  ,"sample.capture.integrated-camera": "集成相机"
  ,"sample.capture.access-denied": "相机访问被拒绝。"
  ,"sample.capture.access-denied-title": "相机访问被拒绝"
  ,"sample.capture.privacy-message": "请在隐私设置中启用相机访问权限。"
  ,"sample.capture.privacy-settings": "隐私设置"
  ,"sample.capture.cancel": "取消"
  ,"sample.capture.error-title": "错误"
  ,"sample.capture.ok": "确定"
  ,"sample.capture.start-failed": "无法启动相机。"
  ,"sample.capture.photo-captured": "已成功拍摄照片。"
  ,"sample.capture.captured-photo": "拍摄的照片 {number}"
  ,"sample.capture.capture-failed": "无法拍摄照片。"
  ,"text.captured": "已捕获"
  ,"text.integrated-camera": "集成摄像头"
  ,"text.requesting-camera-permission": "正在请求摄像头权限"
  ,"text.camera-api-is-not-available-in-this-browser": "此浏览器不支持摄像头 API。"
  ,"text.camera-permission-was-denied": "摄像头权限被拒绝。"
  ,"text.unable-to-start-the-camera": "无法启动摄像头。"
  ,"sample.image.basic-local-file": "来自本地文件的基本图像。"
  ,"sample.image.decoded-rendering-size": "解码到渲染尺寸的图像"
  ,"sample.image.stretching": "图像拉伸。"
  ,"sample.image.stretch-mode": "图像拉伸模式"
  ,"sample.image.nine-grid": "九宫格图像。"
  ,"sample.image.svg": "SVG 图像。"
  ,"sample.image.animated-gif": "动画 GIF 播放。"
  ,"sample.image.treetops": "树梢"
  ,"sample.image.valley": "山谷"
  ,"sample.image.normal-image": "普通图像"
  ,"sample.image.stretched-evenly": "均匀拉伸的图像"
  ,"sample.image.stretched-nine-grid": "使用九宫格拉伸的图像"
  ,"sample.image.gif-auto": "Image 元素会自动播放动画 GIF 源。"
  ,"sample.image.gif-autoplay-false": "将 AutoPlay 设置为 False 可阻止 GIF 自动播放。"
  ,"sample.image.gif-manual": "使用 BitmapImage.Play() 和 Stop() 手动控制播放。"
  ,"sample.media.transport-controls": "带传输控件的媒体播放器元素。"
  ,"sample.media.autoplay-video": "自动播放视频的媒体播放器元素。"
  ,"sample.media.open-file-automation-name": "打开文件按钮"
  ,"sample.media.state.opening": "正在打开媒体…"
  ,"sample.media.state.ready": "已准备好播放。"
  ,"sample.media.state.playing": "正在播放。"
  ,"sample.media.state.paused": "已暂停。"
  ,"sample.media.state.buffering": "正在缓冲…"
  ,"sample.media.state.ended": "播放已结束。"
  ,"sample.media.state.failed": "无法播放媒体。"
  ,"sample.media.position": "播放位置：{current} / {duration}"
  ,"sample.media.selected-file": "已选择文件：{name}"
  ,"sample.media.open-file": "打开文件"
  ,"sample.personpicture.select-looks": "为人物头像选择不同外观。"
  ,"sample.personpicture.profile-type": "头像类型"
  ,"sample.personpicture.profile-image": "头像图片"
  ,"sample.personpicture.display-name": "显示名称"
  ,"sample.personpicture.initials": "姓名首字母"
  ,"sample.personpicture.person-name": "Jane Doe"
  ,"sample.personpicture.person-initials": "SB"
  ,"sample.personpicture.output.image": "头像图片；呈现尺寸：{width} × {height}。"
  ,"sample.personpicture.output.initials": "{name}；姓名首字母：{initials}；呈现尺寸：{width} × {height}。"
  ,"text.canvas": "画布"
  ,"text.grid": "网格"
  ,"text.stackpanel": "堆叠面板"
  ,"text.relativepanel": "相对面板"
  ,"text.variablesizedwrapgrid": "可变尺寸换行网格"
  ,"text.viewbox": "缩放容器"
  ,"text.scrollviewer": "滚动器"
  ,"text.scrollview": "滚动"
  ,"text.parallaxview": "视差视图"
  ,"text.canvas-description": "定义一个区域，你可以在其中使用相对于画布区域的坐标显式定位子元素。"
  ,"text.grid-description": "网格是一个布局面板，支持按行和列排列子元素。"
  ,"text.stackpanel-description": "堆叠面板可将子元素排列成水平或垂直方向的一条线。"
  ,"text.relativepanel-description": "一个面板，可让你相对于其他子元素或父面板定位和对齐子元素。"
  ,"text.variablesizedwrapgrid-description": "按顺序定位子元素，从左到右排列，并在到达容器边缘时换到下一行。"
  ,"text.viewbox-description": "一个容器控件，可缩放其内容以填充可用空间。"
  ,"text.scrollviewer-description": "ScrollViewer 允许用户通过滚动、平移和缩放查看超出可视区域的内容。许多内容控件（如 ListView）在控件模板中内置了 ScrollViewer，以提供自动滚动。"
  ,"text.scrollview-description": "ScrollView 允许用户通过滚动、平移和缩放查看超出可视区域的内容。ItemsView 在控件模板中内置了 ScrollView，以提供自动滚动。"
  ,"text.scrolling-container-description": "允许用户平移和缩放内容的容器控件。"
  ,"text.pipspager-description": "PipsPager 允许用户在分页集合中导航，并且独立于所显示的内容。当布局中的内容没有明确按相关性排序，或需要使用字形表示编号页面时，请使用此控件。PipsPager 常用于照片查看器、应用列表、轮播以及显示空间有限的场景。"
  ,"text.semanticzoom-description": "SemanticZoom 可用两种不同方式显示分组数据，适合快速浏览大型数据集。"
  ,"text.orientation": "方向"
  ,"text.previous-button-visibility": "上一页按钮可见性"
  ,"text.next-button-visibility": "下一页按钮可见性"
  ,"text.zoom-mode": "缩放模式"
  ,"text.zoom-factor": "ZoomFactor"
  ,"text.zoom": "缩放"
  ,"text.scroll-mode": "滚动模式"
  ,"text.scrollbar-visibility": "滚动条可见性"
  ,"text.horizontal": "水平"
  ,"text.vertical": "垂直"
  ,"text.vertical-velocity": "垂直速度"
  ,"text.animation-duration-msec": "动画持续时间（毫秒）"
  ,"text.scroll-with-animation": "带动画滚动"
  ,"text.enabled": "已启用"
  ,"text.disabled": "已禁用"
  ,"text.auto": "自动"
  ,"text.visible": "可见"
  ,"text.hidden": "隐藏"
  ,"text.collapsed": "折叠"
  ,"text.visible-on-pointer-over": "指针悬停时可见"
  ,"text.default": "默认"
  ,"text.accordion": "手风琴"
  ,"text.teleportation": "瞬移"
  ,"text.accessibility": "辅助功能"
  ,"text.windowing": "窗口"
  ,"text.system": "系统"
  ,"text.shell": "系统外壳"
  ,"text.binding": "绑定"
  ,"text.templates": "模板"
  ,"text.xaml-conditions": "XAML 条件"
  ,"text.scratch-pad": "草稿板"
  ,"text.spacing": "间距"
  ,"text.color-contrast": "颜色对比度"
  ,"text.keyboard-navigation": "键盘导航"
  ,"text.screen-reader": "屏幕阅读器"
  ,"text.previous-page": "上一页"
  ,"text.next-page": "下一页"
  ,"text.page-number": "第 {page} 页"
  ,"text.page-selection-announcement": "已选择第 {page} 页，共 {total} 页"
  ,"text.zoom-out": "缩小"
  ,"text.cliff": "悬崖"
  ,"text.zoom-mode-automation-name": "缩放模式"
  ,"text.zoom-factor-automation-name": "缩放因子"
  ,"text.horizontal-scroll-mode-automation-name": "水平滚动模式"
  ,"text.vertical-scroll-mode-automation-name": "垂直滚动模式"
  ,"text.horizontal-scrollbar-visibility-automation-name": "水平滚动条可见性"
  ,"text.vertical-scrollbar-visibility-automation-name": "垂直滚动条可见性"
  ,"text.vertical-velocity-automation-name": "垂直速度"
  ,"text.vertical-animation-options-automation-name": "垂直动画选项"
  ,"text.animation-duration-automation-name": "动画持续时间"
  ,"text.scroll-with-animation-automation-name": "带动画滚动"
  ,"text.parallaxview-description": "ParallaxView 控件可创建一种视觉效果，使靠近观看者的项目比背景中的项目移动得更快。"
  ,"sample.canvas.control": "一个画布控件。"
  ,"sample.grid.3x3": "一个 3×3 网格控件。"
  ,"sample.stackpanel.control": "堆叠面板控件。"
  ,"sample.relativepanel.control": "一个相对面板控件。"
  ,"sample.border.around-textblock": "文本块周围的边框。"
  ,"text.border-description": "边框是一个容器控件，用于在另一个对象周围绘制边框、背景或两者。"
  ,"gallery.toggle-theme": "切换主题"
  ,"gallery.add-favorite": "添加到收藏"
  ,"gallery.remove-favorite": "取消收藏"
  ,"sample.border.inside-text": "边框中的文本"
  ,"sample.border.thickness": "边框厚度"
  ,"sample.border.background": "背景"
  ,"sample.border.brush": "边框画刷"
  ,"sample.layout.color-green": "绿色"
  ,"sample.layout.color-yellow": "黄色"
  ,"sample.layout.color-blue": "蓝色"
  ,"sample.layout.color-white": "白色"
  ,"sample.canvas.top": "画布顶部位置"
  ,"sample.canvas.left": "画布左侧位置"
  ,"sample.canvas.z-index": "画布层叠顺序"
  ,"sample.grid.options.grid": "网格"
  ,"sample.grid.options.red-block": "红色方块"
  ,"sample.grid.options.column-spacing": "列间距"
  ,"sample.grid.options.row-spacing": "行间距"
  ,"sample.grid.options.column": "所在列"
  ,"sample.grid.options.row": "所在行"
  ,"sample.variablesizedwrapgrid.control": "可变尺寸换行网格"
  ,"sample.viewbox.content": "缩放容器中的内容。"
  ,"sample.viewbox.text": "这是一段文本。"
  ,"sample.viewbox.size": "宽度/高度"
  ,"sample.viewbox.stretch": "拉伸方式"
  ,"sample.viewbox.stretch-direction": "拉伸方向"
  ,"sample.viewbox.none": "无"
  ,"sample.viewbox.fill": "填充"
  ,"sample.viewbox.uniform": "均匀缩放"
  ,"sample.viewbox.uniform-to-fill": "均匀填充"
  ,"sample.viewbox.up-only": "仅放大"
  ,"sample.viewbox.down-only": "仅缩小"
  ,"sample.viewbox.both": "双向缩放"
  ,"sample.expander.text-header-content": "标题和内容中包含文本的 Expander。"
  ,"sample.expander.content-alignment": "修改 Expander 内容对齐方式"
  ,"sample.expander.header-text": "这段文本在标题中"
  ,"sample.expander.content-text": "这段文本在内容中"
  ,"sample.expander.centered-header": "这段文本居中"
  ,"sample.expander.left-aligned-content": "这段文本左对齐"
  ,"sample.parallaxview.listview": "带 ListView 的视差效果"
  ,"sample.parallaxview.scrollview": "带 ScrollView 的视差效果"
  ,"sample.parallaxview.list-heading": "滚动列表以查看图像的视差效果"
  ,"sample.parallaxview.rectangles-heading": "滚动矩形以查看图像的视差效果"
  ,"sample.parallaxview.all-samples": "所有示例"
  ,"sample.scrollviewer.content": "ScrollViewer 中的内容"
  ,"sample.scrollview.content": "ScrollView 中的内容。"
  ,"sample.scrollview.content-note": "此 ScrollView 允许水平和垂直滚动以及缩放。更改右侧设置可调整这些功能或内置滚动条的可见性。"
  ,"sample.scrollview.constant-velocity": "恒定速度滚动。"
  ,"sample.scrollview.velocity-note": "将垂直速度设置为大于 30 的值可向下滚动，设置为小于 -30 的值可按恒定速度向上滚动。"
  ,"sample.scrollview.programmatic-animation": "带自定义动画的编程滚动。"
  ,"sample.scrollview.animation-note": "选择动画类型和持续时间，然后点击右侧按钮启动编程滚动。"
  ,"sample.scrollview.scroll-with-animation": "带动画滚动"
  ,"sample.pipspager.integrated-flipview": "与 FlipView 集成的 PipsPager"
  ,"sample.pipspager.options": "可更改方向和按钮可见性的 PipsPager。"
  ,"sample.semanticzoom.simple": "简单的 SemanticZoom"
  ,"sample.semanticzoom.resources-description": "用于共享值的可重用定义，以确保一致性和可维护性。"
  ,"sample.semanticzoom.style-description": "XAML 样式是一组可重用的属性设置，用于定义一致的界面设计元素。"
  ,"sample.semanticzoom.binding-description": "将界面元素连接到数据，以实现自动同步和更新。"
  ,"sample.semanticzoom.templates-description": "在 XAML 中自定义控件外观、项目布局和数据呈现。"
  ,"sample.semanticzoom.custom-controls-description": "创建具有自定义功能和外观的可重用界面组件。"
  ,"sample.semanticzoom.xaml-conditions-description": "定义在解析时通过 IXamlCondition 求值的自定义 XAML 条件。"
  ,"sample.semanticzoom.scratch-pad-description": "用于测试简单 XAML 标记的草稿板。"
  ,"sample.semanticzoom.item-description": "WinUI 控件示例，可用于浏览此分组内容。"
  ,"text.animated-icon": "动画图标"
  ,"text.color": "颜色"
  ,"text.compact-sizing": "紧凑尺寸"
  ,"text.custom-user-controls": "自定义和用户控件"
  ,"text.fundamentals": "基础知识"
  ,"text.geometry": "几何图形"
  ,"text.icon-element": "图标元素"
  ,"text.iconography": "图标设计"
  ,"text.line": "直线"
     ,"text.radial-gradient-brush": "径向渐变画笔"
     ,"text.resources": "资源"
     ,"text.style": "样式"
     ,"text.styles": "样式"
     ,"text.system-backdrops": "系统背景"
     ,"text.theme-shadow": "主题阴影"
     ,"text.typography": "排版"
     ,"text.about": "关于"
     ,"text.open-code-repository": "打开代码仓库"
     ,"text.about-copyright": "© {year} {author}。{rights}"
     ,"text.all-rights-reserved": "保留所有权利。"
     ,"text.qq-group": "QQ 群组"
     ,"text.discord-group": "Discord 群组"
     ,"sample.infobadge.description": "徽章是一种不打扰用户且直观的方式，用于显示通知或将注意力引导到应用中的某个区域，例如通知、新内容提示或警报。InfoBadge 是一小块可添加到应用中的界面元素，可自定义显示数字、图标或简单圆点。"
     ,"sample.infobadge.embedded-navigationview": "嵌入 NavigationView 的 InfoBadge"
     ,"sample.infobadge.opacity": "InfoBadge 不透明度"
     ,"sample.infobadge.display-mode": "显示模式"
     ,"sample.infobadge.left-expanded": "左侧展开"
     ,"sample.infobadge.left-compact": "左侧紧凑"
     ,"sample.infobadge.top": "顶部"
     ,"sample.infobadge.different-styles": "不同 InfoBadge 样式"
     ,"sample.infobadge.styles": "样式"
     ,"sample.infobadge.inside-another-control": "将 InfoBadge 放入另一个控件中"
     ,"sample.infobadge.dynamic-value": "带动态值的 InfoBadge"
     ,"sample.infobadge.value": "InfoBadge 值"
     ,"sample.infobadge.inbox": "收件箱"
     ,"sample.infobadge.inbox-notifications": "收件箱，{value} 条通知"
     ,"sample.infobadge.refresh-required": "需要刷新"
     ,"sample.infobadge.attention": "注意"
     ,"sample.infobadge.informational": "信息"
     ,"sample.infobadge.success": "成功"
     ,"sample.infobadge.critical": "严重"
     ,"sample.infobadge.embedded-output": "徽章不透明度：{opacity}；显示模式：{mode}；通知数：5。"
     ,"sample.infobadge.styles-output": "样式：{style}。图标、数值 10 和圆点徽章同步使用此样式。"
     ,"sample.infobadge.inside-output": "刷新按钮点击次数：{count}。图标徽章保持在右上角。"
     ,"sample.infobadge.dynamic-output": "InfoBadge 值：{value}。"
     ,"sample.infobadge.dynamic-dot-output": "InfoBadge 值：-1。徽章显示为圆点。"
     ,"sample.infobar.description": "当需要告知用户、让用户确认或针对应用状态变化执行操作时，请使用 InfoBar 控件。默认情况下，通知会保留在内容区域中直到用户关闭，但不一定会打断用户流程。"
     ,"sample.infobar.closable-options-change": "可关闭且可更改严重性的 InfoBar。"
     ,"sample.infobar.long-short-message-buttons": "带长/短消息和多种按钮的可关闭 InfoBar"
     ,"sample.infobar.display-options": "可显示或隐藏关闭按钮和图标的可关闭 InfoBar"
     ,"sample.infobar.title": "标题"
     ,"sample.infobar.essential-message": "面向用户的重要应用消息，用于告知、确认或引导用户采取操作。"
     ,"sample.infobar.long-message": "这是一条较长的重要应用消息，用于让用户了解、确认或采取操作。这里添加了一段示例文本，用于展示消息较长时 InfoBar 的换行、布局和操作区域表现。"
     ,"sample.infobar.long-message-placeholder": "较长的重要应用消息..."
     ,"sample.infobar.short-message": "一条简短的重要应用消息。"
     ,"sample.infobar.is-open": "打开"
     ,"sample.infobar.severity": "严重性"
     ,"sample.infobar.severity-informational": "信息"
     ,"sample.infobar.severity-success": "成功"
     ,"sample.infobar.severity-warning": "警告"
     ,"sample.infobar.severity-error": "错误"
     ,"sample.infobar.message-length": "消息长度"
     ,"sample.infobar.action-button": "操作按钮"
     ,"sample.infobar.is-icon-visible": "显示图标"
     ,"sample.infobar.is-closable": "可关闭"
     ,"sample.infobar.short": "短"
     ,"sample.infobar.long": "长"
     ,"sample.infobar.hyperlink": "超链接"
     ,"sample.infobar.action": "操作"
     ,"sample.infobar.informational-link": "信息链接"
     ,"sample.infobar.output-severity": "打开：{open}；严重性：{severity}"
     ,"sample.infobar.output-message": "打开：{open}；消息长度：{length}；操作：{action}；操作点击次数：{count}"
     ,"sample.infobar.output-display": "打开：{open}；显示图标：{icon}；可关闭：{closable}"
     ,"sample.infobar.state-true": "是"
     ,"sample.infobar.state-false": "否"
     ,"sample.progressbar.indeterminate": "不确定进度条。"
     ,"sample.progressbar.determinate": "确定进度条。"
     ,"sample.progressbar.progress-state": "进度状态"
     ,"sample.progressbar.running": "运行中"
     ,"sample.progressbar.paused": "已暂停"
     ,"sample.progressbar.error": "错误"
     ,"sample.progressbar.progress": "进度"
     ,"sample.progressbar.determinate-name": "确定进度条示例"
     ,"sample.progressbar.numberbox-name": "控制进度条数值的数字框"
     ,"sample.colorpicker.more-button-visible": "显示更多按钮"
     ,"sample.colorpicker.color-slider-visible": "显示颜色滑块"
     ,"sample.colorpicker.color-channel-text-input-visible": "显示颜色通道文本输入框"
     ,"sample.colorpicker.hex-input-visible": "显示十六进制输入框"
     ,"sample.colorpicker.alpha-slider-visible": "显示 Alpha 滑块"
     ,"sample.colorpicker.alpha-text-input-visible": "显示 Alpha 文本输入框"
  ,"sample.image.stretch-none": "不拉伸"
  ,"sample.image.stretch-fill": "填充"
  ,"sample.image.stretch-uniform": "等比缩放"
  ,"sample.image.stretch-uniform-to-fill": "等比填充"
  ,"sample.image.svg-name": "SVG 图像"
  ,"sample.image.gif-auto-name": "自动播放的 GIF"
  ,"sample.image.gif-paused-name": "禁用自动播放的 GIF"
  ,"sample.image.gif-manual-name": "手动播放的 GIF"
  ,"sample.image.add-favorite": "将图像添加到收藏"
  ,"sample.image.remove-favorite": "将图像从收藏中移除"
  ,"sample.image.output.loading": "正在加载图像…"
  ,"sample.image.output.failed": "无法加载图像。"
  ,"sample.image.output.ready": "图像已加载。源尺寸：{sourceWidth} × {sourceHeight} 像素；呈现尺寸：{width} × {height}。"
  ,"sample.image.output.decoded": "解码高度：{decodeHeight} 像素。解码尺寸：{sourceWidth} × {sourceHeight} 像素；呈现尺寸：{width} × {height}。"
  ,"sample.image.output.stretch": "拉伸模式：{mode}；呈现尺寸：{width} × {height}。"
  ,"sample.image.output.nine-grid": "九宫格边距：{inset}；呈现尺寸：{width} × {height}。"
  ,"sample.image.output.named": "{name}：{result}"
  ,"sample.image.output.gif": "动画位图：{animated}；播放状态：{playback}；呈现尺寸：{width} × {height}。"
  ,"sample.image.output.yes": "是"
  ,"sample.image.output.no": "否"
  ,"sample.image.output.playing": "正在播放"
  ,"sample.image.output.stopped": "已停止"
  ,"sample.image.source.basic": "<Image Source=\"{source}\" Height=\"100\" />"
  ,"sample.image.source.decoded": "<Image Height=\"100\">\n    <Image.Source>\n        <BitmapImage UriSource=\"{source}\"\n            DecodePixelHeight=\"100\" />\n    </Image.Source>\n</Image>"
  ,"sample.image.source.stretch": "<Image Stretch=\"{stretch}\" Height=\"100\" Width=\"100\" Source=\"{source}\" />"
  ,"sample.image.source.stretch-csharp": "private void ImageStretch_Checked(object sender, RoutedEventArgs e)\n{\n    if ((sender as RadioButton)?.Tag?.ToString() is string strStretch &&\n        StretchImage != null)\n    {\n        var stretch = (Stretch)Enum.Parse(typeof(Stretch), strStretch);\n        StretchImage.Stretch = stretch;\n    }\n}"
  ,"sample.image.source.nine-grid": "<Image Source=\"{source}\" Height=\"82\" />\n<Image Source=\"{source}\" NineGrid=\"3,3,3,3\" Height=\"164\" />\n<Image Source=\"{source}\" NineGrid=\"30,20,30,20\" Height=\"164\" />"
  ,"sample.image.source.svg": "<Image Source=\"{source}\" Height=\"100\" />"
  ,"sample.image.source.gif": "<StackPanel Spacing=\"12\">\n    <TextBlock Text=\"{auto}\" TextWrapping=\"Wrap\" />\n    <Image Height=\"40\" HorizontalAlignment=\"Left\" Source=\"{source}\" />\n\n    <TextBlock Text=\"{paused}\" TextWrapping=\"Wrap\" />\n    <Image Height=\"40\" HorizontalAlignment=\"Left\">\n        <Image.Source>\n            <BitmapImage AutoPlay=\"False\" UriSource=\"{source}\" />\n        </Image.Source>\n    </Image>\n\n    <TextBlock Text=\"{manual}\" TextWrapping=\"Wrap\" />\n    <Image Height=\"40\" HorizontalAlignment=\"Left\">\n        <Image.Source>\n            <BitmapImage x:Name=\"ClickToPlaySource\" AutoPlay=\"False\"\n                         UriSource=\"{source}\"\n                         ImageOpened=\"ClickToPlaySource_ImageOpened\" />\n        </Image.Source>\n    </Image>\n</StackPanel>\n\n<controls:ControlExample.Options>\n    <StackPanel x:Name=\"PlaybackButtons\" Spacing=\"8\" Visibility=\"Collapsed\">\n        <Button Content=\"{play}\" Click=\"{x:Bind ClickToPlaySource.Play}\" />\n        <Button Content=\"{stop}\" Click=\"{x:Bind ClickToPlaySource.Stop}\" />\n    </StackPanel>\n</controls:ControlExample.Options>"
  ,"sample.image.source.gif-csharp": "private void ClickToPlaySource_ImageOpened(object sender, RoutedEventArgs e)\n{\n    if (ClickToPlaySource.IsAnimatedBitmap)\n    {\n        PlaybackButtons.Visibility = Visibility.Visible;\n    }\n}"
  ,"sample.semanticzoom.data.group.FundamentalsItem": "基础知识"
  ,"sample.semanticzoom.data.item.XamlResources.title": "资源"
  ,"sample.semanticzoom.data.item.XamlResources.subtitle": "用于共享值的可重用定义，以确保一致性和可维护性。"
  ,"sample.semanticzoom.data.item.XamlStyles.title": "样式"
  ,"sample.semanticzoom.data.item.XamlStyles.subtitle": "XAML 样式是一组可重用的属性设置，用于定义一致的界面设计元素。"
  ,"sample.semanticzoom.data.item.Binding.title": "绑定"
  ,"sample.semanticzoom.data.item.Binding.subtitle": "将界面元素连接到数据，以实现自动同步和更新。"
  ,"sample.semanticzoom.data.item.Templates.title": "模板"
  ,"sample.semanticzoom.data.item.Templates.subtitle": "在 XAML 中自定义控件外观、项目布局和数据呈现。"
  ,"sample.semanticzoom.data.item.CustomUserControls.title": "自定义和用户控件"
  ,"sample.semanticzoom.data.item.CustomUserControls.subtitle": "创建具有自定义功能和外观的可重用界面组件。"
  ,"sample.semanticzoom.data.item.CustomXamlConditionals.title": "XAML 条件"
  ,"sample.semanticzoom.data.item.CustomXamlConditionals.subtitle": "定义在解析时通过 IXamlCondition 求值的自定义 XAML 条件。"
  ,"sample.semanticzoom.data.item.ScratchPad.title": "草稿板"
  ,"sample.semanticzoom.data.item.ScratchPad.subtitle": "用于测试简单 XAML 标记的草稿板。"
  ,"sample.semanticzoom.data.group.DesignItem": "设计"
  ,"sample.semanticzoom.data.item.Color.title": "颜色"
  ,"sample.semanticzoom.data.item.Color.subtitle": "均衡的色彩设计创造清晰、美观和谐的界面。"
  ,"sample.semanticzoom.data.item.Geometry.title": "几何图形"
  ,"sample.semanticzoom.data.item.Geometry.subtitle": "清晰的几何设计确保视觉一致性和结构。"
  ,"sample.semanticzoom.data.item.Iconography.title": "图标设计"
  ,"sample.semanticzoom.data.item.Iconography.subtitle": "图标是一种视觉设计语言，可以快速有效地传递信息。"
  ,"sample.semanticzoom.data.item.Spacing.title": "间距"
  ,"sample.semanticzoom.data.item.Spacing.subtitle": "合理的间距设计提高可读性和流畅度。"
  ,"sample.semanticzoom.data.item.Typography.title": "版式"
  ,"sample.semanticzoom.data.item.Typography.subtitle": "版式设计通过直观的字体和层次引导注意力。"
  ,"sample.semanticzoom.data.group.AccessibilityItem": "辅助功能"
  ,"sample.semanticzoom.data.item.AccessibilityColorContrast.title": "颜色对比度"
  ,"sample.semanticzoom.data.item.AccessibilityColorContrast.subtitle": "高对比度设计确保所有用户都能访问界面。"
  ,"sample.semanticzoom.data.item.AccessibilityKeyboard.title": "键盘导航"
  ,"sample.semanticzoom.data.item.AccessibilityKeyboard.subtitle": "支持键盘的设计让交互更加顺畅。"
  ,"sample.semanticzoom.data.item.AccessibilityScreenReader.title": "屏幕阅读器"
  ,"sample.semanticzoom.data.item.AccessibilityScreenReader.subtitle": "包容性设计为辅助技术提供有意义的内容。"
  ,"sample.semanticzoom.data.group.MenusAndToolbars": "菜单和工具栏"
  ,"sample.semanticzoom.data.item.AppBarButton.title": "应用栏按钮"
  ,"sample.semanticzoom.data.item.AppBarButton.subtitle": "用于 CommandBar 的样式化按钮。"
  ,"sample.semanticzoom.data.item.AppBarSeparator.title": "应用栏分隔符"
  ,"sample.semanticzoom.data.item.AppBarSeparator.subtitle": "在应用栏中分隔命令组的竖线。"
  ,"sample.semanticzoom.data.item.AppBarToggleButton.title": "应用栏切换按钮"
  ,"sample.semanticzoom.data.item.AppBarToggleButton.subtitle": "具有开、关或不确定状态的按钮，类似复选框，用于应用栏或其他专用界面。"
  ,"sample.semanticzoom.data.item.CommandBar.title": "命令栏"
  ,"sample.semanticzoom.data.item.CommandBar.subtitle": "标签位于侧边并浮在页面中的命令栏"
  ,"sample.semanticzoom.data.item.CommandBarFlyout.title": "命令栏浮出面板"
  ,"sample.semanticzoom.data.item.CommandBarFlyout.subtitle": "命令栏浮出面板可通过显示与界面画布上某个元素相关的浮动工具栏命令，让用户轻松访问常见任务。"
  ,"sample.semanticzoom.data.item.MenuBar.title": "菜单栏"
  ,"sample.semanticzoom.data.item.MenuBar.subtitle": "菜单栏简化了应用基本菜单系统的创建。它开箱即用、几乎无需自定义，支持键盘快捷键，并会自动针对不同输入类型和设备调整界面。"
  ,"sample.semanticzoom.data.item.MenuFlyout.title": "菜单浮出面板"
  ,"sample.semanticzoom.data.item.MenuFlyout.subtitle": "菜单浮出面板显示轻量级命令菜单，可附加到按钮和其他控件。"
  ,"sample.semanticzoom.data.item.SwipeControl.title": "轻扫控件"
  ,"sample.semanticzoom.data.item.SwipeControl.subtitle": "通过触摸手势快速访问项目的菜单操作。"
  ,"sample.semanticzoom.data.item.StandardUICommand.title": "标准界面命令"
  ,"sample.semanticzoom.data.item.StandardUICommand.subtitle": "StandardUICommand 是内置的 XamlUICommand，表示“保存”等常用命令。"
  ,"sample.semanticzoom.data.item.XamlUICommand.title": "XAML 界面命令"
  ,"sample.semanticzoom.data.item.XamlUICommand.subtitle": "用于定义指定命令的外观和行为的对象。"
  ,"sample.semanticzoom.data.group.Collections": "集合"
  ,"sample.semanticzoom.data.item.FlipView.title": "翻页视图"
  ,"sample.semanticzoom.data.item.FlipView.subtitle": "翻页视图允许用户逐项翻阅项目集合。它非常适合显示图库中的图像或产品详情页中的项目。"
  ,"sample.semanticzoom.data.item.GridView.title": "网格视图"
  ,"sample.semanticzoom.data.item.GridView.subtitle": "网格视图允许用户浏览并选择按网格布局排列的项目集合。"
  ,"sample.semanticzoom.data.item.ItemsRepeater.title": "项重复器"
  ,"sample.semanticzoom.data.item.ItemsRepeater.subtitle": "ItemsRepeater 是用于显示重复数据的轻量控件。它可通过灵活的布局选项高度自定义，并支持虚拟化布局。当你需要比 ListView 或 GridView 更强的布局控制时，可以使用 ItemsRepeater。"
  ,"sample.semanticzoom.data.item.ItemsView.title": "项视图"
  ,"sample.semanticzoom.data.item.ItemsView.subtitle": "ItemsView 控件显示数据项集合，并提供灵活的项目布局、选择和调用方式。"
  ,"sample.semanticzoom.data.item.ListView.title": "列表视图"
  ,"sample.semanticzoom.data.item.ListView.subtitle": "列表视图以垂直列表显示数据，并支持选择。"
  ,"sample.semanticzoom.data.item.PullToRefresh.title": "下拉刷新"
  ,"sample.semanticzoom.data.item.PullToRefresh.subtitle": "允许用户在触控设备上从顶部下拉刷新内容的容器。"
  ,"sample.semanticzoom.data.item.TreeView.title": "树视图"
  ,"sample.semanticzoom.data.item.TreeView.subtitle": "树视图控件是一种分层列表模式，包含可展开和折叠的嵌套节点。"
  ,"sample.semanticzoom.data.group.DateAndTime": "日期和时间"
  ,"sample.semanticzoom.data.item.CalendarDatePicker.title": "日历日期选取器"
  ,"sample.semanticzoom.data.item.CalendarDatePicker.subtitle": "日历日期选取器是一个下拉控件，专为从日历视图中选择单个日期而优化，适用于星期几或日历忙闲等上下文信息很重要的场景。你可以修改日历以提供更多上下文，或限制可选日期。"
  ,"sample.semanticzoom.data.item.CalendarView.title": "日历视图"
  ,"sample.semanticzoom.data.item.CalendarView.subtitle": "日历视图提供标准方式，让用户查看日历并与之交互。如果只需要让用户选择日期，请考虑使用日历日期选取器。如果需要让用户选择多个日期，则必须使用日历视图。"
  ,"sample.semanticzoom.data.item.DatePicker.title": "日期选取器"
  ,"sample.semanticzoom.data.item.DatePicker.subtitle": "使用日期选取器让用户在应用中设置日期，例如安排约会。日期选取器显示月、日、年三个控件。这些控件易于通过触控或鼠标使用，并可通过多种方式设置样式和配置。"
  ,"sample.semanticzoom.data.item.TimePicker.title": "时间选取器"
  ,"sample.semanticzoom.data.item.TimePicker.subtitle": "使用时间选取器让用户在应用中设置时间，例如设置提醒。时间选取器显示小时、分钟和上午/下午三个控件。这些控件易于通过触控或鼠标使用，并可通过多种方式设置样式和配置。"
  ,"sample.semanticzoom.data.group.BasicInput": "基本输入"
  ,"sample.semanticzoom.data.item.Button.title": "按钮"
  ,"sample.semanticzoom.data.item.Button.subtitle": "按钮控件提供 Click 事件，用于响应来自触控、鼠标、键盘、触控笔或其他输入设备的用户输入。你可以在按钮中放入不同类型的内容，例如文本或图像，也可以重新设置按钮样式以获得新的外观。"
  ,"sample.semanticzoom.data.item.DropDownButton.title": "下拉按钮"
  ,"sample.semanticzoom.data.item.DropDownButton.subtitle": "下拉按钮会显示一个人字形图标，作为其附加浮出面板中包含更多选项的视觉提示。它与带浮出面板的标准按钮行为相同，只是外观不同。"
  ,"sample.semanticzoom.data.item.HyperlinkButton.title": "超链接按钮"
  ,"sample.semanticzoom.data.item.HyperlinkButton.subtitle": "显示为超链接的按钮。"
  ,"sample.semanticzoom.data.item.RepeatButton.title": "重复按钮"
  ,"sample.semanticzoom.data.item.RepeatButton.subtitle": "从按下到松开期间会反复触发 Click 事件的按钮。"
  ,"sample.semanticzoom.data.item.ToggleButton.title": "切换按钮"
  ,"sample.semanticzoom.data.item.ToggleButton.subtitle": "切换按钮看起来像按钮，但工作方式类似复选框。它通常有两种状态：选中（开）或未选中（关）；如果 IsThreeState 属性为 true，也可以是不确定状态。可以通过 IsChecked 属性确定其状态。"
  ,"sample.semanticzoom.data.item.SplitButton.title": "拆分按钮"
  ,"sample.semanticzoom.data.item.SplitButton.subtitle": "拆分按钮类似下拉按钮，但额外提供一个执行点击区域。它适用于希望用户既能调用命令又能作出选择的场景。"
  ,"sample.semanticzoom.data.item.ToggleSplitButton.title": "切换拆分按钮"
  ,"sample.semanticzoom.data.item.ToggleSplitButton.subtitle": "可开关并带有附加下拉选项的按钮。"
  ,"sample.semanticzoom.data.item.CheckBox.title": "复选框"
  ,"sample.semanticzoom.data.item.CheckBox.subtitle": "复选框控件允许用户选择二进制选项的组合。相比之下，单选按钮控件允许用户从互斥选项中选择。不确定状态用于表示某个选项对部分子选项生效，但不是全部。不要允许用户直接设置不确定状态来表示第三种选项。"
  ,"sample.semanticzoom.data.item.ColorPicker.title": "颜色选取器"
  ,"sample.semanticzoom.data.item.ColorPicker.subtitle": "允许用户通过色谱、滑块和文本输入选择颜色的控件。"
  ,"sample.semanticzoom.data.item.ComboBox.title": "组合框"
  ,"sample.semanticzoom.data.item.ComboBox.subtitle": "使用组合框（也称为下拉列表）显示用户可选择的项目列表。组合框初始为紧凑状态，展开后显示可选项目列表。"
  ,"sample.semanticzoom.data.item.RadioButton.title": "单选按钮"
  ,"sample.semanticzoom.data.item.RadioButton.subtitle": "RadioButton 控件允许用户从一组互斥选项中选择一个选项。相比之下，CheckBox 控件允许用户选择多个选项。当有 2 到 7 个选项并且一次只能选择一个选项时，请使用 RadioButton。"
  ,"sample.semanticzoom.data.item.RatingControl.title": "评级控件"
  ,"sample.semanticzoom.data.item.RatingControl.subtitle": "评级控件允许用户查看和设置反映其对内容和服务满意程度的评级。"
  ,"sample.semanticzoom.data.item.Slider.title": "滑块"
  ,"sample.semanticzoom.data.item.Slider.subtitle": "使用滑块让用户沿轨道移动滑块来设置值。当用户认为该值是相对量而不是精确数值时，滑块是很好的选择。"
  ,"sample.semanticzoom.data.item.ToggleSwitch.title": "切换开关"
  ,"sample.semanticzoom.data.item.ToggleSwitch.subtitle": "使用切换开关控件向用户呈现两个完全互斥的选项（如开/关），选择后会立即提交。切换开关应只有一个标签。"
  ,"sample.semanticzoom.data.group.StatusAndInfo": "状态和信息"
  ,"sample.semanticzoom.data.item.InfoBadge.title": "信息徽章"
  ,"sample.semanticzoom.data.item.InfoBadge.subtitle": "徽章是一种不打扰用户且直观的方式，用于显示通知或将注意力引导到应用中的某个区域，例如通知、新内容提示或警报。InfoBadge 是一小块可添加到应用中的界面元素，可自定义显示数字、图标或简单圆点。"
  ,"sample.semanticzoom.data.item.InfoBar.title": "信息栏"
  ,"sample.semanticzoom.data.item.InfoBar.subtitle": "当需要告知用户、让用户确认或针对应用状态变化执行操作时，请使用 InfoBar 控件。默认情况下，通知会保留在内容区域中直到用户关闭，但不一定会打断用户流程。"
  ,"sample.semanticzoom.data.item.ProgressBar.title": "进度条"
  ,"sample.semanticzoom.data.item.ProgressBar.subtitle": "ProgressBar 有两种不同的视觉表示形式：不确定状态表示任务正在进行，确定状态表示已知工作量的完成进度。"
  ,"sample.semanticzoom.data.item.ProgressRing.title": "进度环"
  ,"sample.semanticzoom.data.item.ProgressRing.subtitle": "ProgressRing 有两种不同的视觉表示形式：不确定状态表示任务正在进行，但会阻止用户交互；确定状态表示已知工作量的完成进度。"
  ,"sample.semanticzoom.data.item.ToolTip.title": "工具提示"
  ,"sample.semanticzoom.data.item.ToolTip.subtitle": "ToolTip 显示有关界面元素的更多信息。它可以说明元素的功能或用户应执行的操作。当用户将鼠标悬停在界面元素上或长按该元素时，会显示 ToolTip。"
  ,"sample.semanticzoom.data.group.DialogsAndFlyouts": "对话框和浮出控件"
  ,"sample.semanticzoom.data.item.ContentDialog.title": "内容对话框"
  ,"sample.semanticzoom.data.item.ContentDialog.subtitle": "使用内容对话框显示相关信息，或提供需要用户操作的模态对话框体验。"
  ,"sample.semanticzoom.data.item.Flyout.title": "浮出面板"
  ,"sample.semanticzoom.data.item.Flyout.subtitle": "浮出面板用于显示轻量级界面，可以展示信息，也可以要求用户交互。不同于对话框，点击或点按外部区域、按设备返回键或按 Esc 键都可以轻量关闭浮出面板。"
  ,"sample.semanticzoom.data.item.Popup.title": "弹出控件"
  ,"sample.semanticzoom.data.item.Popup.subtitle": "在应用窗口边界内的现有内容之上显示内容。对于应显示在其他界面之上的临时内容，请使用弹出控件。"
  ,"sample.semanticzoom.data.item.TeachingTip.title": "教学提示"
  ,"sample.semanticzoom.data.item.TeachingTip.subtitle": "教学提示是用于提供上下文相关信息的通知浮出控件。它支持丰富内容（包括标题、副标题、图标、图像和文本），并可配置为显式关闭或轻量关闭。"
  ,"sample.semanticzoom.data.group.Scrolling": "滚动"
  ,"sample.semanticzoom.data.item.AnnotatedScrollBar.title": "带注释滚动条"
  ,"sample.semanticzoom.data.item.AnnotatedScrollBar.subtitle": "扩展普通垂直滚动条，方便浏览大型集合。"
  ,"sample.semanticzoom.data.item.PipsPager.title": "分页点控件"
  ,"sample.semanticzoom.data.item.PipsPager.subtitle": "PipsPager 允许用户在分页集合中导航，并且独立于所显示的内容。当布局中的内容没有明确按相关性排序，或需要使用字形表示编号页面时，请使用此控件。PipsPager 常用于照片查看器、应用列表、轮播以及显示空间有限的场景。"
  ,"sample.semanticzoom.data.item.ScrollView.title": "滚动"
  ,"sample.semanticzoom.data.item.ScrollView.subtitle": "ScrollView 允许用户通过滚动、平移和缩放查看超出可视区域的内容。ItemsView 在控件模板中内置了 ScrollView，以提供自动滚动。"
  ,"sample.semanticzoom.data.item.ScrollViewer.title": "滚动器"
  ,"sample.semanticzoom.data.item.ScrollViewer.subtitle": "ScrollViewer 允许用户通过滚动、平移和缩放查看超出可视区域的内容。许多内容控件（如 ListView）在控件模板中内置了 ScrollViewer，以提供自动滚动。"
  ,"sample.semanticzoom.data.item.SemanticZoom.title": "语义缩放"
  ,"sample.semanticzoom.data.item.SemanticZoom.subtitle": "SemanticZoom 可用两种不同方式显示分组数据，适合快速浏览大型数据集。"
  ,"sample.semanticzoom.data.group.Layout": "布局"
  ,"sample.semanticzoom.data.item.Border.title": "边框"
  ,"sample.semanticzoom.data.item.Border.subtitle": "在其他对象周围绘制边框、背景或两者的容器。"
  ,"sample.semanticzoom.data.item.Canvas.title": "画布"
  ,"sample.semanticzoom.data.item.Canvas.subtitle": "定义一个区域，你可以在其中使用相对于画布区域的坐标显式定位子元素。"
  ,"sample.semanticzoom.data.item.Expander.title": "展开器"
  ,"sample.semanticzoom.data.item.Expander.subtitle": "展开器控件可显示或隐藏与始终可见的主要内容相关但重要性较低的内容。标题中的项目始终可见。用户可以展开或折叠内容区域以显示正文内容。"
  ,"sample.semanticzoom.data.item.Grid.title": "网格布局"
  ,"sample.semanticzoom.data.item.Grid.subtitle": "网格是一个布局面板，支持按行和列排列子元素。"
  ,"sample.semanticzoom.data.item.RelativePanel.title": "相对面板"
  ,"sample.semanticzoom.data.item.RelativePanel.subtitle": "一个面板，可让你相对于其他子元素或父面板定位和对齐子元素。"
  ,"sample.semanticzoom.data.item.SplitView.title": "拆分视图"
  ,"sample.semanticzoom.data.item.SplitView.subtitle": "包含两个视图的容器；一个视图用于主要内容，另一个通常用于导航命令。"
  ,"sample.semanticzoom.data.item.StackPanel.title": "堆叠面板"
  ,"sample.semanticzoom.data.item.StackPanel.subtitle": "堆叠面板可将子元素排列成水平或垂直方向的一条线。"
  ,"sample.semanticzoom.data.item.VariableSizedWrapGrid.title": "可变大小换行网格"
  ,"sample.semanticzoom.data.item.VariableSizedWrapGrid.subtitle": "按顺序定位子元素，从左到右排列，并在到达容器边缘时换到下一行。"
  ,"sample.semanticzoom.data.item.Viewbox.title": "视图框"
  ,"sample.semanticzoom.data.item.Viewbox.subtitle": "一个容器控件，可缩放其内容以填充可用空间。"
  ,"sample.semanticzoom.data.group.Navigation": "导航"
  ,"sample.semanticzoom.data.item.BreadcrumbBar.title": "面包屑导航栏"
  ,"sample.semanticzoom.data.item.BreadcrumbBar.subtitle": "面包屑导航栏控件提供常见的水平布局，用于显示到达当前位置所经过的导航路径。调整窗口大小可查看节点从根节点开始逐步折叠。"
  ,"sample.semanticzoom.data.item.NavigationView.title": "导航视图"
  ,"sample.semanticzoom.data.item.NavigationView.subtitle": "通过可折叠的导航菜单实现应用顶层区域的常见纵向布局。"
  ,"sample.semanticzoom.data.item.Pivot.title": "透视视图"
  ,"sample.semanticzoom.data.item.Pivot.subtitle": "不建议在 Windows 11 设计模式中使用 Pivot。请改用 SelectorBar 和 SelectorBarItem。Pivot 可在选项卡视图中显示来自不同来源的项目集合。"
  ,"sample.semanticzoom.data.item.SelectorBar.title": "选择器栏"
  ,"sample.semanticzoom.data.item.SelectorBar.subtitle": "SelectorBar 控件允许用户从内联项目列表中选择不同视图、页面或集合。"
  ,"sample.semanticzoom.data.item.TabView.title": "选项卡视图"
  ,"sample.semanticzoom.data.item.TabView.subtitle": "显示选项卡集合的控件，可用于显示多个文档。"
  ,"sample.semanticzoom.data.group.Media": "媒体"
  ,"sample.semanticzoom.data.item.AnimatedVisualPlayer.title": "动画视觉播放器"
  ,"sample.semanticzoom.data.item.AnimatedVisualPlayer.subtitle": "用于呈现动态图形并控制其播放的元素。"
  ,"sample.semanticzoom.data.item.CaptureElementPreview.title": "捕获元素 / 相机预览"
  ,"sample.semanticzoom.data.item.CaptureElementPreview.subtitle": "可以使用 MediaPlayerElement 控件和 MediaCapture 对象显示相机预览。"
  ,"sample.semanticzoom.data.item.Image.title": "图像"
  ,"sample.semanticzoom.data.item.Image.subtitle": "可以使用 Image 控件显示和缩放图像。"
  ,"sample.semanticzoom.data.item.MapControl.title": "MapControl"
  ,"sample.semanticzoom.data.item.MapControl.subtitle": "显示地球的符号地图。"
  ,"sample.semanticzoom.data.item.MediaPlayerElement.title": "媒体播放器元素"
  ,"sample.semanticzoom.data.item.MediaPlayerElement.subtitle": "可以使用媒体播放器元素控件播放视频和显示图像。可以显示传输控件或使视频自动播放。"
  ,"sample.semanticzoom.data.item.PersonPicture.title": "人物头像"
  ,"sample.semanticzoom.data.item.PersonPicture.subtitle": "显示人员或联系人的图片。"
  ,"sample.semanticzoom.data.item.Sound.title": "Sound"
  ,"sample.semanticzoom.data.item.Sound.subtitle": "仅通过代码调用的 API，可为所有 XAML 控件提供二维和三维界面音效。"
  ,"sample.semanticzoom.data.item.WebView2.title": "WebView2"
  ,"sample.semanticzoom.data.item.WebView2.subtitle": "基于 Microsoft Edge（Chromium），在应用中承载 HTML 内容的控件。"
  ,"sample.semanticzoom.data.group.Styles": "样式"
  ,"sample.semanticzoom.data.item.Acrylic.title": "亚克力画笔"
  ,"sample.semanticzoom.data.item.Acrylic.subtitle": "建议用于面板背景的半透明材质。"
  ,"sample.semanticzoom.data.item.AnimatedIcon.title": "动画图标"
  ,"sample.semanticzoom.data.item.AnimatedIcon.subtitle": "显示并控制图标的元素，图标可在用户与控件交互时播放动画。"
  ,"sample.semanticzoom.data.item.CompactSizing.title": "紧凑尺寸"
  ,"sample.semanticzoom.data.item.CompactSizing.subtitle": "通过资源字典启用紧凑尺寸。"
  ,"sample.semanticzoom.data.item.IconElement.title": "图标元素"
  ,"sample.semanticzoom.data.item.IconElement.subtitle": "表示使用不同图像类型作为内容的图标控件。"
  ,"sample.semanticzoom.data.item.Line.title": "直线"
  ,"sample.semanticzoom.data.item.Line.subtitle": "在两点之间绘制直线。"
  ,"sample.semanticzoom.data.item.Shape.title": "形状"
  ,"sample.semanticzoom.data.item.Shape.subtitle": "绘制椭圆、矩形等形状的方法。"
  ,"sample.semanticzoom.data.item.RadialGradientBrush.title": "径向渐变画笔"
  ,"sample.semanticzoom.data.item.RadialGradientBrush.subtitle": "用于绘制径向渐变的画笔。"
  ,"sample.semanticzoom.data.item.SystemBackdrops.title": "系统背景（云母/亚克力）"
  ,"sample.semanticzoom.data.item.SystemBackdrops.subtitle": "应用窗口的云母、亚克力等系统背景。"
  ,"sample.semanticzoom.data.item.SystemBackdropElement.title": "系统背景元素"
  ,"sample.semanticzoom.data.item.SystemBackdropElement.subtitle": "承载系统背景材质的元素。"
  ,"sample.semanticzoom.data.item.ThemeShadow.title": "主题阴影"
  ,"sample.semanticzoom.data.item.ThemeShadow.subtitle": "使用系统光照为界面元素添加具有深度感的阴影。"
  ,"sample.semanticzoom.data.group.Text": "文本"
  ,"sample.semanticzoom.data.item.AutoSuggestBox.title": "自动建议框"
  ,"sample.semanticzoom.data.item.AutoSuggestBox.subtitle": "使用自动建议框提供建议列表，供用户在输入时选择。"
  ,"sample.semanticzoom.data.item.NumberBox.title": "数字框"
  ,"sample.semanticzoom.data.item.NumberBox.subtitle": "数字框控件允许用户输入数字。它支持验证、步进，以及计算基本方程等内联表达式。"
  ,"sample.semanticzoom.data.item.PasswordBox.title": "密码框"
  ,"sample.semanticzoom.data.item.PasswordBox.subtitle": "密码框是一种文本输入框，会隐藏用户输入的字符以保护隐私。密码框看起来像文本框，但会用占位字符替代已输入文本。你可以配置占位字符。"
  ,"sample.semanticzoom.data.item.RichEditBox.title": "富文本编辑框"
  ,"sample.semanticzoom.data.item.RichEditBox.subtitle": "富文本编辑框控件允许用户输入加粗、斜体和下划线等格式化文本。富文本编辑框还可以显示和编辑富文本格式（.rtf）文件。"
  ,"sample.semanticzoom.data.item.RichTextBlock.title": "富文本块"
  ,"sample.semanticzoom.data.item.RichTextBlock.subtitle": "RichTextBlock 提供富文本显示容器，支持格式化文本、超链接、内联图像和其他富内容。"
  ,"sample.semanticzoom.data.item.TextBlock.title": "文本块"
  ,"sample.semanticzoom.data.item.TextBlock.subtitle": "文本块控件为不需要交互的场景提供灵活的文本显示选项。它支持富文本格式、加粗和斜体等内联元素，以及文本选择。"
  ,"sample.semanticzoom.data.item.TextBox.title": "文本框"
  ,"sample.semanticzoom.data.item.TextBox.subtitle": "使用文本框让用户在应用中输入简单文本。你可以通过多种方式自定义文本框以满足需求。"
  ,"sample.semanticzoom.data.group.Motion": "运动"
  ,"sample.semanticzoom.data.item.XamlCompInterop.title": "动画互操作"
  ,"sample.semanticzoom.data.item.XamlCompInterop.subtitle": "通过 XAML 与 Composition 互操作，使用表达式、自然动画等为元素添加动画。"
  ,"sample.semanticzoom.data.item.ConnectedAnimation.title": "连接动画"
  ,"sample.semanticzoom.data.item.ConnectedAnimation.subtitle": "连接动画在页面导航过程中延续元素，帮助用户保持视图之间的上下文。"
  ,"sample.semanticzoom.data.item.EasingFunction.title": "缓动函数"
  ,"sample.semanticzoom.data.item.EasingFunction.subtitle": "缓动用于控制对象在动画过程中运动速度的变化。"
  ,"sample.semanticzoom.data.item.ImplicitTransition.title": "隐式过渡"
  ,"sample.semanticzoom.data.item.ImplicitTransition.subtitle": "使用隐式过渡自动为属性变化添加动画。"
  ,"sample.semanticzoom.data.item.PageTransition.title": "页面过渡"
  ,"sample.semanticzoom.data.item.PageTransition.subtitle": "页面过渡为页面之间的关系提供视觉反馈。"
  ,"sample.semanticzoom.data.item.ThemeTransition.title": "主题过渡"
  ,"sample.semanticzoom.data.item.ThemeTransition.subtitle": "主题过渡是预先打包、易于应用的动画。"
  ,"sample.semanticzoom.data.item.ParallaxView.title": "视差视图"
  ,"sample.semanticzoom.data.item.ParallaxView.subtitle": "ParallaxView 控件可创建一种视觉效果，使靠近观看者的项目比背景中的项目移动得更快。"
  ,"sample.semanticzoom.data.group.MultipleWindows": "窗口"
  ,"sample.semanticzoom.data.item.AppWindow.title": "应用窗口"
  ,"sample.semanticzoom.data.item.AppWindow.subtitle": "灵活、可定制的应用窗口管理系统。"
  ,"sample.semanticzoom.data.item.AppWindowTitleBar.title": "应用窗口标题栏"
  ,"sample.semanticzoom.data.item.AppWindowTitleBar.subtitle": "控制应用窗口的标题栏。"
  ,"sample.semanticzoom.data.item.CreateMultipleWindows.title": "多个窗口"
  ,"sample.semanticzoom.data.item.CreateMultipleWindows.subtitle": "创建单线程顶层 XAML 窗口的示例。"
  ,"sample.semanticzoom.data.item.TitleBar.title": "标题栏"
  ,"sample.semanticzoom.data.item.TitleBar.subtitle": "使用默认 TitleBar 控件的示例。"
  ,"sample.semanticzoom.data.group.System": "系统"
  ,"sample.semanticzoom.data.item.Clipboard.title": "剪贴板"
  ,"sample.semanticzoom.data.item.Clipboard.subtitle": "通过系统剪贴板复制和粘贴文本、图像和文件。"
  ,"sample.semanticzoom.data.item.ContentIsland.title": "内容岛"
  ,"sample.semanticzoom.data.item.ContentIsland.subtitle": "创建 ContentIsland，在应用中承载其他框架。"
  ,"sample.semanticzoom.data.item.StoragePickers.title": "存储选取器"
  ,"sample.semanticzoom.data.item.StoragePickers.subtitle": "通过现代选取器选择文件和文件夹。"
  ,"sample.semanticzoom.data.group.Shell": "系统外壳"
  ,"sample.semanticzoom.data.item.AppNotification.title": "应用通知"
  ,"sample.semanticzoom.data.item.AppNotification.subtitle": "发送出现在操作中心和弹出通知中的通知。"
  ,"sample.semanticzoom.data.item.BadgeNotificationManager.title": "徽章通知"
  ,"sample.semanticzoom.data.item.BadgeNotificationManager.subtitle": "在应用任务栏图标上显示数字或图标徽章。"
  ,"sample.semanticzoom.data.item.JumpList.title": "跳转列表"
  ,"sample.semanticzoom.data.item.JumpList.subtitle": "为应用的任务栏跳转列表添加自定义任务和分组。"
  ,"sample.scrollview.output": "水平偏移：{horizontal}；垂直偏移：{vertical}；缩放：{zoom}；状态：{state}。"
  ,"sample.scrollview.state.idle": "空闲"
  ,"sample.scrollview.state.interaction": "交互"
  ,"sample.scrollview.state.inertia": "惯性"
  ,"sample.scrollview.state.animation": "动画"
  ,"sample.scrollview.image.grapes": "葡萄"
  ,"sample.scrollview.image.rainier": "雷尼尔山"
  ,"sample.scrollview.image.sunset": "日落"
  ,"sample.scrollview.image.treetops": "树梢"
  ,"sample.scrollview.image.valley": "山谷"
  ,"sample.scrollview.image.leaves": "树叶"
  ,"sample.scrollview.image.carousel": "旋转木马"
  ,"sample.scrollview.image.bicycles": "自行车"
  ,"sample.scrollview.image.pond": "池塘"
  ,"sample.scrollview.image.marina": "码头"
  ,"sample.scrollview.image.beach": "海滩"
  ,"sample.scrollview.image.rampart": "城墙"
  ,"sample.scrollview.image.mountain": "山脉"

  ,"text.navigationview-description": "NavigationView 控件通过可折叠导航菜单，为应用的顶级区域提供通用的垂直布局。"
  ,"sample.navigationview.default-header": "使用默认 PaneDisplayMode 的 NavigationView"
  ,"sample.navigationview.top-header": "将 PaneDisplayMode 设置为 Top 的 NavigationView"
  ,"sample.navigationview.adaptive-header": "根据窗口宽度切换窗格方向的 NavigationView"
  ,"sample.navigationview.tabs-header": "关联选择与焦点 - 选项卡"
  ,"sample.navigationview.data-binding-header": "数据绑定"
  ,"sample.navigationview.footer-header": "带页脚菜单项的 NavigationView"
  ,"sample.navigationview.hierarchical-header": "层级 NavigationView"
  ,"sample.navigationview.api-header": "API 实际应用"
  ,"sample.navigationview.default-description": "如果有五个或更多同等重要的导航类别，且这些类别应在较大的窗口宽度下突出显示，请考虑使用左侧导航窗格。"
  ,"sample.navigationview.top-description": "如果有同等重要的导航类别，但相对于应用内容应弱化显示，请考虑使用顶部导航窗格。"
  ,"sample.navigationview.adaptive-description": "如果导航类别同等重要且应用内容空间有限，请考虑在较大的窗口宽度下使用顶部导航窗格，在较小的窗口宽度下使用最小化左侧导航窗格。"
  ,"sample.navigationview.tabs-description": "对于选项卡模式，请将 SelectionFollowsFocus 属性设置为 Enabled，使选择与焦点保持一致。如果使用 Frame 切换内容，则不应将项目之间的导航记录到 Frame 的导航堆栈中。请参阅下方示例中的 C# 代码了解具体做法。"
  ,"sample.navigationview.data-binding-description": "进行数据绑定时，请使用 MenuItemsSource 属性绑定可观察的项目集合，并且不要设置 MenuItems 属性。此外，请设置 MenuItemTemplate 属性并使用 NavigationViewItem 作为数据模板。如果还希望绑定标题内容，请通过 MenuItemTemplateSelector 属性使用数据模板选择器。"
  ,"sample.navigationview.footer-description": "可以向 NavigationView 的页脚添加可点击菜单项，这些项目与主菜单项目使用相同的选择模型。在 Top PaneDisplayMode 中，这些项目会在 NavigationView 右侧对齐；在 Left PaneDisplayMode 中，这些项目会在 NavigationView 底部对齐。"
  ,"sample.navigationview.hierarchy-description-1": "NavigationView 在 Left、LeftCompact 和 Top 显示模式中支持层级结构。"
  ,"sample.navigationview.hierarchy-description-2": "在下面的示例中，“帐户”选项卡会导航到自己的页面，而“文档选项”只会展开其子项目。实现方式是将“文档选项”NavigationView 项的 SelectsOnInvoked 属性设置为 false。"
  ,"sample.navigationview.hierarchy-description-3": "在 Top 和 Left 模式中，点击 NavigationViewItem 上的箭头会展开或折叠子树。点击或轻触 NavigationViewItem 的其他位置也会折叠或展开子树。"
  ,"sample.navigationview.hierarchy-description-4": "请在右侧切换三种窗格显示模式。"
  ,"sample.navigationview.header-text": "这是标题文本"
  ,"sample.navigationview.menu-item-1": "菜单项 1"
  ,"sample.navigationview.menu-item-2": "菜单项 2"
  ,"sample.navigationview.menu-item-3": "菜单项 3"
  ,"sample.navigationview.menu-item-4": "菜单项 4"
  ,"sample.navigationview.item-1": "项目 1"
  ,"sample.navigationview.item-2": "项目 2"
  ,"sample.navigationview.item-3": "项目 3"
  ,"sample.navigationview.item-4": "项目 4"
  ,"sample.navigationview.sample-page": "示例页面 {number}"
  ,"sample.navigationview.settings-page": "示例设置页"
  ,"sample.navigationview.lorem-title": "这是示例页面的标题内容"
  ,"sample.navigationview.lorem-body": "这是用于展示页面布局的示例正文。它用于说明内容在不同窗口宽度和导航窗格状态下如何排列、换行与滚动，并确保页面底部内容始终可以完整查看。"
  ,"sample.navigationview.category": "类别 {number}"
  ,"sample.navigationview.category-tooltip": "这是类别 {number}"
  ,"sample.navigationview.browse": "浏览"
  ,"sample.navigationview.track-order": "跟踪订单"
  ,"sample.navigationview.order-history": "订单历史记录"
  ,"sample.navigationview.account": "帐户"
  ,"sample.navigationview.your-cart": "购物车"
  ,"sample.navigationview.help": "帮助"
  ,"sample.navigationview.pane-position": "窗格位置："
  ,"sample.navigationview.pane-position-property": "窗格位置："
  ,"sample.navigationview.left-mode": "Left 模式"
  ,"sample.navigationview.top-mode": "Top 模式"
  ,"sample.navigationview.left-compact-mode": "LeftCompact 模式"
  ,"sample.navigationview.home": "主页"
  ,"sample.navigationview.mail": "邮件"
  ,"sample.navigationview.calendar": "日历"
  ,"sample.navigationview.document-options": "文档选项"
  ,"sample.navigationview.create-new": "新建"
  ,"sample.navigationview.upload-file": "上传文件"
  ,"sample.navigationview.settings-visible": "显示设置项"
  ,"sample.navigationview.back-visible": "显示后退按钮"
  ,"sample.navigationview.back-enabled": "启用后退按钮"
  ,"sample.navigationview.autosuggest-visible": "显示 AutoSuggestBox"
  ,"sample.navigationview.header-label": "Header："
  ,"sample.navigationview.header-value": "标题"
  ,"sample.navigationview.always-show-header": "始终显示标题"
  ,"sample.navigationview.pane-title-label": "PaneTitle："
  ,"sample.navigationview.pane-title-value": "窗格标题"
  ,"sample.navigationview.pane-custom-visible": "显示 PaneCustomContent"
  ,"sample.navigationview.pane-footer-visible": "显示 PaneFooter"
  ,"sample.navigationview.left": "Left"
  ,"sample.navigationview.top": "Top"
  ,"sample.navigationview.keyboard-selection-follows-focus": "键盘 SelectionFollowsFocus"
  ,"sample.navigationview.suppress-menu-item-2": "禁止选择菜单项 2"
  ,"sample.navigationview.actions": "操作"
  ,"sample.navigationview.more-info": "更多信息"
  ,"sample.navigationview.search": "搜索"
  ,"sample.navigationview.download": "下载"
  ,"sample.navigationview.favorite": "收藏"
  ,"sample.navigationview.change-theme": "切换主题"
  ,"sample.navigationview.add-favorite": "添加到收藏"
  ,"sample.navigationview.remove-favorite": "从收藏中移除"
  ,"sample.navigationview.header-property": "Header 属性"
  ,"sample.navigationview.pane-title-property": "PaneTitle 属性"
  ,"sample.navigationview.lorem-short-body": "这是用于展示页面布局的示例正文。它用于说明内容在不同窗口宽度和导航窗格状态下如何排列、换行与滚动。"
  ,"sample.navigationview.selection-output": "已选择：{item}。已导航至：{page}。"
  ,"sample.navigationview.no-selection": "尚未选择项目。"
  ,"sample.navigationview.settings-item": "设置"
  ,"sample.animatedicon.page-title": "AnimatedIcon"
  ,"sample.animatedicon.page-description": "AnimatedIcon 显示通过 Adobe AfterEffects 创建、由 Lottie-Windows 转换为 Microsoft.UI.Composition 对象的动画图标。"
  ,"sample.animatedicon.button-header": "将 AnimatedIcon 添加到按钮"
  ,"sample.animatedicon.navigation-header": "将 AnimatedIcon 添加到 NavigationView"
  ,"sample.animatedicon.button-description": "以下示例是一个按钮，用户点击它后可加载搜索体验。AnimatedIcon 使用通过 Adobe AfterEffects 创建，并由 "
  ,"sample.animatedicon.lottie": "Lottie-Windows"
  ,"sample.animatedicon.animation-guidance": " 转换为 Microsoft.UI.Composition 对象的动画。有关如何正确组织动画文件的指导，请参阅 AnimatedIcon 指南页面。"
  ,"sample.animatedicon.navigation-description": "将 AnimatedIcon 设置为 Icon 属性的值后，NavigationViewItem 会根据控件的状态自动设置 AnimatedIcon 的状态。有关如何正确组织动画文件的指导，请参阅 AnimatedIcon 指南页面。"
  ,"sample.animatedicon.custom-animation-description": "本示例设置了由 LottieGen 工具生成的自定义动画 GameSettingsIcon。"
  ,"sample.animatedicon.example-button-name": "AnimatedIcon 示例"
  ,"sample.animatedicon.kind": "类型"
  ,"sample.animatedicon.game-settings": "游戏设置"
  ,"sample.animatedicon.source.back": "返回"
  ,"sample.animatedicon.source.chevron-down-small": "向下箭头"
  ,"sample.animatedicon.source.chevron-right-down-small": "向右 / 向下箭头"
  ,"sample.animatedicon.source.chevron-up-down-small": "向上 / 向下箭头"
  ,"sample.animatedicon.source.find": "查找"
  ,"sample.animatedicon.source.global-navigation-button": "导航菜单"
  ,"sample.animatedicon.source.settings": "设置"
  ,"text.acrylicbrush": "亚克力画笔"
  ,"sample.acrylic.adaptability-description": "亚克力画笔在某些场景下可能回退为纯色画笔。如果无法看到亚克力效果，请参阅"
  ,"sample.acrylic.adaptability-link": "亚克力画笔适应性文档"
  ,"sample.acrylic.in-app-description": "。亚克力画笔使用应用内亚克力。有关背景亚克力，请参阅"
  ,"sample.acrylic.system-backdrops-link": "系统背景（云母/亚克力）"
  ,"sample.acrylic.background-description": "。"
  ,"sample.acrylic.default-header": "默认的应用内亚克力画笔。"
  ,"sample.acrylic.custom-header": "自定义应用内亚克力画笔。"
  ,"sample.acrylic.luminosity-header": "具有亮度的应用内亚克力。"
  ,"sample.acrylic.tint-opacity": "色调不透明度："
  ,"sample.acrylic.tint-color": "色调颜色："
  ,"sample.acrylic.fallback-color": "回退颜色："
  ,"sample.acrylic.tint-luminosity-opacity": "色调亮度不透明度："
  ,"sample.acrylic.tint-opacity-name": "色调不透明度"
  ,"sample.acrylic.tint-color-name": "色调颜色"
  ,"sample.acrylic.fallback-color-name": "回退颜色"
  ,"sample.acrylic.tint-luminosity-name": "色调亮度"
  ,"sample.acrylic.color.black": "黑色"
  ,"sample.acrylic.color.red": "红色"
  ,"sample.acrylic.color.blue": "蓝色"
  ,"sample.acrylic.color.green": "绿色"
  ,"sample.acrylic.color.yellow": "黄色"
  ,"ComboBoxMigration_MappingMode": "映射模式"
  ,"ComboBoxMigration_SpreadMethod": "扩展方式"
  ,"ComboBoxMigration_RelativeToBoundingBox": "相对于边界框"
  ,"ComboBoxMigration_Absolute": "绝对坐标"
  ,"ComboBoxMigration_Pad": "填充"
  ,"ComboBoxMigration_Reflect": "反射"
  ,"ComboBoxMigration_Repeat": "重复"
  ,"sample.radialgradient.page-title": "径向渐变画笔"
  ,"sample.radialgradient.page-description": "使用径向渐变绘制区域。中心点定义渐变的中心，椭圆定义渐变的外部边界。"
  ,"sample.radialgradient.header": "径向渐变画笔示例"
  ,"sample.radialgradient.center-x": "中心 X"
  ,"sample.radialgradient.center-y": "中心 Y"
  ,"sample.radialgradient.radius-x": "水平半径"
  ,"sample.radialgradient.radius-y": "垂直半径"
  ,"sample.radialgradient.origin-x": "渐变原点 X"
  ,"sample.radialgradient.origin-y": "渐变原点 Y"
  ,"sample.radialgradient.output-format": "映射模式：{mappingMode}\n中心：{center}\n水平半径：{radiusX}，垂直半径：{radiusY}\n渐变原点：{origin}\n延展方式：{spreadMethod}"
  ,"sample.compactsizing.description": "使用资源字典启用紧凑尺寸。"
  ,"sample.compactsizing.supported-controls": "支持紧凑样式的控件："
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
  ,"sample.compactsizing.header": "控件的紧凑尺寸"
  ,"sample.compactsizing.options-header": "Fluent 标准尺寸和紧凑尺寸"
  ,"sample.compactsizing.standard": "标准"
  ,"sample.compactsizing.compact": "紧凑"
  ,"sample.compactsizing.standard-size": "标准尺寸"
  ,"sample.compactsizing.compact-size": "紧凑尺寸"
  ,"sample.compactsizing.first-name": "名字："
  ,"sample.compactsizing.last-name": "姓氏："
  ,"sample.compactsizing.password": "密码："
  ,"sample.compactsizing.confirm-password": "确认密码："
  ,"sample.compactsizing.pick-date": "选择日期"
  ,"sample.iconelement.bitmap-header": "使用多色位图图像的 BitmapIcon"
  ,"sample.iconelement.font-header": "在按钮中使用指定字体系列字形的 FontIcon"
  ,"sample.iconelement.bitmap-image-header": "在按钮中使用位图图像的 ImageIcon"
  ,"sample.iconelement.svg-image-header": "在按钮中使用 SVG 图像的 ImageIcon"
  ,"sample.iconelement.path-header": "按钮中的 PathIcon"
  ,"sample.iconelement.symbol-header": "按钮中的 SymbolIcon"
  ,"sample.iconelement.bitmap-description": "ShowAsMonochrome 属性默认为 true。当图标包含多种颜色且此属性设为 true 时，图标会显示为前景色的纯色图形。将 ShowAsMonochrome 设为 false 即可保留原始颜色。"
  ,"sample.iconelement.font-description": "如果要使用 FontFamily 中的 Glyph 值作为控件图标，可以使用 FontIcon。Windows 10 使用 Segoe MDL2 Assets 字体系列，本示例展示了该字体中的字形。"
  ,"sample.iconelement.image-description": "使用 ImageIcon 作为控件图标时，可以指定 Image 类支持的图像格式。这里的两个示例分别使用 PNG 和 SVG 图像作为图标。"
  ,"sample.iconelement.path-description": "使用 PathIcon 作为控件图标时，需要指定待显示图像的路径数据。路径数据会绘制一系列相连的直线和曲线。"
  ,"sample.iconelement.symbol-description": "使用 SymbolIcon 作为控件图标时，需要指定所需字形的枚举值。SymbolIcon 的枚举基于 Windows 10 所用 Segoe MDL2 字体中的图标。"
  ,"sample.iconelement.monochrome": "单色"
  ,"sample.iconelement.accept": "接受"
};
