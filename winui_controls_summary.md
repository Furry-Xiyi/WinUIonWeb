# WinUI 3 Gallery 控件展示页总结

本文档总结了从 WinUI 3 Gallery 官方仓库提取的所有控件展示页信息。

## 仓库信息
- **仓库地址**: https://github.com/microsoft/WinUI-Gallery
- **提取日期**: 2026-06-29
- **总控件数**: 70 个控件
- **详细代码**: 参见 `winui_controls_extraction.md` (833 KB, 21,451 行)

---

## 控件分组概览

### 1. Basic Input (基础输入) - 14 个控件

用于接收用户输入的基础控件。

| 控件名称 | 用途 | 关键特性 |
|---------|------|---------|
| Button | 基础按钮 | 点击交互、样式定制 |
| DropDownButton | 下拉按钮 | 带弹出菜单的按钮 |
| HyperlinkButton | 超链接按钮 | 导航链接样式的按钮 |
| RepeatButton | 重复按钮 | 长按持续触发 |
| ToggleButton | 切换按钮 | 开/关状态切换 |
| SplitButton | 分离按钮 | 主操作+下拉菜单 |
| ToggleSplitButton | 切换分离按钮 | 带状态的分离按钮 |
| CheckBox | 复选框 | 多选、三态支持 |
| ColorPicker | 颜色选择器 | 颜色选择和预览 |
| ComboBox | 组合框 | 下拉选择列表 |
| RadioButton | 单选按钮 | 单选分组 |
| RatingControl | 评分控件 | 星级评分 |
| Slider | 滑块 | 范围值选择 |
| ToggleSwitch | 开关 | 开/关切换 |

### 2. Collections (集合) - 7 个控件

用于显示和操作数据集合的控件。

| 控件名称 | 用途 | 关键特性 |
|---------|------|---------|
| FlipView | 翻页视图 | 全屏内容浏览 |
| GridView | 网格视图 | 网格布局的项目集合 |
| ItemsRepeater | 项目重复器 | 高性能、灵活的数据展示 |
| ItemsView | 项目视图 | 新一代集合控件 |
| ListView | 列表视图 | 垂直列表布局 |
| PullToRefresh | 下拉刷新 | 手势刷新数据 |
| TreeView | 树视图 | 分层数据展示 |

### 3. Date & Time (日期和时间) - 4 个控件

日期和时间选择相关控件。

| 控件名称 | 用途 | 关键特性 |
|---------|------|---------|
| CalendarDatePicker | 日历日期选择器 | 下拉日历选择 |
| CalendarView | 日历视图 | 完整日历显示 |
| DatePicker | 日期选择器 | 日期选择控件 |
| TimePicker | 时间选择器 | 时间选择控件 |

### 4. Dialogs & Flyouts (对话框和浮出控件) - 4 个控件

用于显示临时内容和交互的控件。

| 控件名称 | 用途 | 关键特性 |
|---------|------|---------|
| ContentDialog | 内容对话框 | 模态对话框 |
| Flyout | 浮出控件 | 轻量级弹出面板 |
| Popup | 弹出窗口 | 自定义弹出内容 |
| TeachingTip | 教学提示 | 引导式提示 |

### 5. Layout (布局) - 9 个控件

用于组织和排列 UI 元素的容器控件。

| 控件名称 | 用途 | 关键特性 |
|---------|------|---------|
| Border | 边框 | 边框和背景装饰 |
| Canvas | 画布 | 绝对定位布局 |
| Expander | 展开器 | 可折叠内容区域 |
| Grid | 网格 | 行列网格布局 |
| RelativePanel | 相对面板 | 相对位置布局 |
| SplitView | 分割视图 | 侧边栏+主内容布局 |
| StackPanel | 堆栈面板 | 垂直/水平堆栈布局 |
| VariableSizedWrapGrid | 可变大小换行网格 | 瓷砖式网格布局 |
| Viewbox | 视图盒 | 内容缩放容器 |

### 6. Menus & Toolbars (菜单和工具栏) - 10 个控件

菜单、命令栏和工具栏相关控件。

| 控件名称 | 用途 | 关键特性 |
|---------|------|---------|
| AppBarButton | 应用栏按钮 | 工具栏按钮 |
| AppBarSeparator | 应用栏分隔符 | 工具栏分隔线 |
| AppBarToggleButton | 应用栏切换按钮 | 工具栏切换按钮 |
| CommandBar | 命令栏 | 应用命令栏 |
| CommandBarFlyout | 命令栏浮出控件 | 上下文命令菜单 |
| MenuBar | 菜单栏 | 传统菜单栏 |
| MenuFlyout | 菜单浮出控件 | 上下文菜单 |
| SwipeControl | 滑动控件 | 滑动操作 |
| StandardUICommand | 标准 UI 命令 | 预定义命令 |
| XamlUICommand | XAML UI 命令 | 自定义命令 |

### 7. Navigation (导航) - 5 个控件

应用导航相关控件。

| 控件名称 | 用途 | 关键特性 |
|---------|------|---------|
| BreadcrumbBar | 面包屑导航栏 | 分层导航路径 |
| NavigationView | 导航视图 | 主应用导航 |
| Pivot | 透视 | 标签页导航 |
| SelectorBar | 选择器栏 | 分段选择器 |
| TabView | 标签视图 | 多标签页 |

### 8. Scrolling (滚动) - 5 个控件

滚动和分页相关控件。

| 控件名称 | 用途 | 关键特性 |
|---------|------|---------|
| AnnotatedScrollBar | 带注释的滚动条 | 可视化滚动标记 |
| PipsPager | 点式分页器 | 页面指示器 |
| ScrollView | 滚动视图 | 新一代滚动容器 |
| ScrollViewer | 滚动查看器 | 传统滚动容器 |
| SemanticZoom | 语义缩放 | 两级视图缩放 |

### 9. Status & Info (状态和信息) - 5 个控件

状态指示和信息显示控件。

| 控件名称 | 用途 | 关键特性 |
|---------|------|---------|
| InfoBadge | 信息徽章 | 通知标记 |
| InfoBar | 信息栏 | 应用级消息通知 |
| ProgressBar | 进度条 | 确定进度显示 |
| ProgressRing | 进度环 | 不确定进度显示 |
| ToolTip | 工具提示 | 悬停提示信息 |

### 10. Text (文本) - 7 个控件

文本显示和输入控件。

| 控件名称 | 用途 | 关键特性 |
|---------|------|---------|
| AutoSuggestBox | 自动建议框 | 搜索框+建议列表 |
| NumberBox | 数字框 | 数字输入和验证 |
| PasswordBox | 密码框 | 密码输入 |
| RichEditBox | 富文本编辑框 | 富文本编辑 |
| RichTextBlock | 富文本块 | 富文本显示 |
| TextBlock | 文本块 | 只读文本显示 |
| TextBox | 文本框 | 文本输入 |

---

## 代码文件结构

每个控件的示例页面通常包含以下文件：

1. **{ControlName}Page.xaml** - 主页面 XAML 布局
   - 使用 `ControlExample` 控件组织示例
   - 包含多个示例案例
   - 展示不同的使用场景和配置

2. **{ControlName}Page.xaml.cs** - 主页面代码后置
   - 事件处理
   - 示例数据
   - 交互逻辑

3. **{示例名称}.txt** - 独立示例代码片段
   - 可被主页面引用
   - 展示特定功能点
   - 便于代码复用

## WinUI 3 常用模式

### 1. ControlExample 包装器

WinUI Gallery 使用自定义的 `ControlExample` 控件来展示每个示例：

```xaml
<local:ControlExample
    HeaderText="示例标题"
    XamlSource="示例代码文件路径">
    <!-- 示例内容 -->
</local:ControlExample>
```

### 2. 示例代码展示

大多数页面都包含可查看的示例代码：
- XAML 代码存储在 `.txt` 文件中
- 通过 `XamlSource` 属性引用
- 用户可以在 Gallery 中直接查看和复制代码

### 3. 交互式配置

许多示例提供交互式配置选项：
- 使用 `Slider`、`CheckBox`、`ComboBox` 等控件
- 实时调整目标控件的属性
- 展示属性效果

### 4. 数据绑定

示例广泛使用数据绑定：
- `x:Bind` 用于编译时绑定
- `ObservableCollection` 用于集合数据
- MVVM 模式

---

## 文件位置

在 WinUI Gallery 仓库中：
- **控件示例页**: `WinUIGallery/Samples/{ControlName}/`
- **控件数据定义**: `WinUIGallery/SampleSupport/Data/ControlInfoData.json`
- **页面映射**: `WinUIGallery/Helpers/ControlInfoDataSource.cs`
- **导航映射**: `WinUIGallery/Helpers/NavigationPageMappings.cs`

---

## 使用建议

1. **学习控件用法**: 查看每个控件的 Page.xaml 文件，了解基础用法
2. **理解布局模式**: 注意 `ControlExample` 的组织方式
3. **参考示例代码**: .txt 文件包含可直接使用的代码片段
4. **学习交互逻辑**: Page.xaml.cs 展示事件处理和数据操作
5. **适配到 Web**: 需要将 XAML 转换为 Vue 组件语法

---

## 注意事项

- **跳过的分组**: Media 分组（AnimatedVisualPlayer, CaptureElementPreview, Image, MediaPlayerElement, PersonPicture）已按要求跳过
- **API 差异**: WinUI 3 的某些功能可能无法直接移植到 Web
- **性能考虑**: Web 环境下需要优化大型集合的渲染
- **样式系统**: WinUI 的主题和样式系统需要转换为 CSS

---

## 相关资源

- **WinUI Gallery 仓库**: https://github.com/microsoft/WinUI-Gallery
- **WinUI 3 文档**: https://learn.microsoft.com/windows/apps/winui/
- **控件库文档**: https://learn.microsoft.com/windows/apps/design/controls/
- **设计指南**: https://learn.microsoft.com/windows/apps/design/

---

**生成日期**: 2026-06-29  
**数据来源**: WinUI Gallery 官方仓库  
**完整代码**: 参见 `winui_controls_extraction.md`
