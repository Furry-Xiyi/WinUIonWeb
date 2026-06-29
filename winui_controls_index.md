# WinUI 3 Gallery 控件快速索引

快速查找控件在提取文档中的位置。

## 使用方法

在 `winui_controls_extraction.md` 中搜索对应的标题即可找到完整代码。

---

## 按字母顺序索引

| 控件 | 分组 | 搜索关键词 |
|------|------|-----------|
| AnnotatedScrollBar | Scrolling | `# AnnotatedScrollBar` |
| AppBarButton | Menus & Toolbars | `# AppBarButton` |
| AppBarSeparator | Menus & Toolbars | `# AppBarSeparator` |
| AppBarToggleButton | Menus & Toolbars | `# AppBarToggleButton` |
| AutoSuggestBox | Text | `# AutoSuggestBox` |
| Border | Layout | `# Border` |
| BreadcrumbBar | Navigation | `# BreadcrumbBar` |
| Button | Basic Input | `# Button` |
| CalendarDatePicker | Date & Time | `# CalendarDatePicker` |
| CalendarView | Date & Time | `# CalendarView` |
| Canvas | Layout | `# Canvas` |
| CheckBox | Basic Input | `# CheckBox` |
| ColorPicker | Basic Input | `# ColorPicker` |
| ComboBox | Basic Input | `# ComboBox` |
| CommandBar | Menus & Toolbars | `# CommandBar` |
| CommandBarFlyout | Menus & Toolbars | `# CommandBarFlyout` |
| ContentDialog | Dialogs & Flyouts | `# ContentDialog` |
| DatePicker | Date & Time | `# DatePicker` |
| DropDownButton | Basic Input | `# DropDownButton` |
| Expander | Layout | `# Expander` |
| FlipView | Collections | `# FlipView` |
| Flyout | Dialogs & Flyouts | `# Flyout` |
| Grid | Layout | `# Grid` |
| GridView | Collections | `# GridView` |
| HyperlinkButton | Basic Input | `# HyperlinkButton` |
| InfoBadge | Status & Info | `# InfoBadge` |
| InfoBar | Status & Info | `# InfoBar` |
| ItemsRepeater | Collections | `# ItemsRepeater` |
| ItemsView | Collections | `# ItemsView` |
| ListView | Collections | `# ListView` |
| MenuBar | Menus & Toolbars | `# MenuBar` |
| MenuFlyout | Menus & Toolbars | `# MenuFlyout` |
| NavigationView | Navigation | `# NavigationView` |
| NumberBox | Text | `# NumberBox` |
| PasswordBox | Text | `# PasswordBox` |
| PipsPager | Scrolling | `# PipsPager` |
| Pivot | Navigation | `# Pivot` |
| Popup | Dialogs & Flyouts | `# Popup` |
| ProgressBar | Status & Info | `# ProgressBar` |
| ProgressRing | Status & Info | `# ProgressRing` |
| PullToRefresh | Collections | `# PullToRefresh` |
| RadioButton | Basic Input | `# RadioButton` |
| RatingControl | Basic Input | `# RatingControl` |
| RelativePanel | Layout | `# RelativePanel` |
| RepeatButton | Basic Input | `# RepeatButton` |
| RichEditBox | Text | `# RichEditBox` |
| RichTextBlock | Text | `# RichTextBlock` |
| ScrollView | Scrolling | `# ScrollView` |
| ScrollViewer | Scrolling | `# ScrollViewer` |
| SelectorBar | Navigation | `# SelectorBar` |
| SemanticZoom | Scrolling | `# SemanticZoom` |
| Slider | Basic Input | `# Slider` |
| SplitButton | Basic Input | `# SplitButton` |
| SplitView | Layout | `# SplitView` |
| StackPanel | Layout | `# StackPanel` |
| StandardUICommand | Menus & Toolbars | `# StandardUICommand` |
| SwipeControl | Menus & Toolbars | `# SwipeControl` |
| TabView | Navigation | `# TabView` |
| TeachingTip | Dialogs & Flyouts | `# TeachingTip` |
| TextBlock | Text | `# TextBlock` |
| TextBox | Text | `# TextBox` |
| TimePicker | Date & Time | `# TimePicker` |
| ToggleButton | Basic Input | `# ToggleButton` |
| ToggleSplitButton | Basic Input | `# ToggleSplitButton` |
| ToggleSwitch | Basic Input | `# ToggleSwitch` |
| ToolTip | Status & Info | `# ToolTip` |
| TreeView | Collections | `# TreeView` |
| VariableSizedWrapGrid | Layout | `# VariableSizedWrapGrid` |
| Viewbox | Layout | `# Viewbox` |
| XamlUICommand | Menus & Toolbars | `# XamlUICommand` |

---

## 按分组索引

### Basic Input (14)
Button, CheckBox, ColorPicker, ComboBox, DropDownButton, HyperlinkButton, RadioButton, RatingControl, RepeatButton, Slider, SplitButton, ToggleButton, ToggleSplitButton, ToggleSwitch

### Collections (7)
FlipView, GridView, ItemsRepeater, ItemsView, ListView, PullToRefresh, TreeView

### Date & Time (4)
CalendarDatePicker, CalendarView, DatePicker, TimePicker

### Dialogs & Flyouts (4)
ContentDialog, Flyout, Popup, TeachingTip

### Layout (9)
Border, Canvas, Expander, Grid, RelativePanel, SplitView, StackPanel, VariableSizedWrapGrid, Viewbox

### Menus & Toolbars (10)
AppBarButton, AppBarSeparator, AppBarToggleButton, CommandBar, CommandBarFlyout, MenuBar, MenuFlyout, StandardUICommand, SwipeControl, XamlUICommand

### Navigation (5)
BreadcrumbBar, NavigationView, Pivot, SelectorBar, TabView

### Scrolling (5)
AnnotatedScrollBar, PipsPager, ScrollView, ScrollViewer, SemanticZoom

### Status & Info (5)
InfoBadge, InfoBar, ProgressBar, ProgressRing, ToolTip

### Text (7)
AutoSuggestBox, NumberBox, PasswordBox, RichEditBox, RichTextBlock, TextBlock, TextBox

---

## 常见控件映射（WinUI → Web）

| WinUI 控件 | Web 等价物 | 说明 |
|-----------|-----------|------|
| Button | `<button>` | 基础按钮 |
| CheckBox | `<input type="checkbox">` | 复选框 |
| RadioButton | `<input type="radio">` | 单选按钮 |
| TextBox | `<input type="text">` | 文本输入 |
| PasswordBox | `<input type="password">` | 密码输入 |
| ComboBox | `<select>` | 下拉选择 |
| Slider | `<input type="range">` | 滑块 |
| ToggleSwitch | `<input type="checkbox">` + CSS | 开关 |
| ListView | `<ul>` / `<div>` | 列表 |
| GridView | CSS Grid | 网格 |
| NavigationView | 自定义导航组件 | 侧边栏导航 |
| ContentDialog | Modal Dialog | 模态对话框 |
| Flyout | Popover | 弹出层 |
| ToolTip | `title` / Tooltip 组件 | 工具提示 |
| ProgressBar | `<progress>` | 进度条 |
| InfoBar | Alert 组件 | 消息提示 |

---

## 文件概览

```
WinUIonWeb/
├── winui_controls_extraction.md  (833 KB) - 完整的 XAML 和 C# 代码
├── winui_controls_summary.md             - 控件总结和使用指南
└── winui_controls_index.md               - 本文件：快速索引
```

---

**提示**: 
- 使用编辑器的搜索功能（Ctrl+F / Cmd+F）在 `winui_controls_extraction.md` 中查找控件
- 每个控件的代码块都有清晰的标题和代码围栏标记
- 示例代码已完整提取，可直接参考
