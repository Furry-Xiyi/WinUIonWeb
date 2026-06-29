# WinUI on Web - 紧急行动计划

**创建时间：** 2026-07-01 00:20
**状态：** 🚨 发现重大问题，立即执行修复

## 🚨 发现的关键问题

### 问题1：所有展示页缺少代码示例区域
**严重性：** 🔴 高
**影响：** 14个已完成的页面都不完整
**官方结构：**
```
ControlExample
├── Example区域（控件展示）✅ 有
├── Output区域（输出显示）✅ 有
├── Options区域（配置选项）✅ 有
└── Expander（代码示例）❌ 缺失
    ├── Header: "Source code"
    ├── SelectorBar（Vue/Template切换）
    └── 代码高亮显示
```

### 问题2：控件属性命名不一致
**严重性：** 🔴 高
**已修复：** CheckBox（IsThreeState）✅
**待检查：** 所有其他控件

### 问题3：Options区域可能使用了原生HTML
**严重性：** 🟡 中
**需要：** 全面审查所有页面的Options区域

## ✅ 已完成的紧急修复

### 控件对齐
1. ✅ **WinCheckBox** - IsThreeState + 三事件
2. ✅ **WinExpander** - IsExpanded + ExpandDirection + 事件
3. ✅ **WinSelectorBar** - 新建（用于代码切换）

### 文档
1. ✅ **CLAUDE.md** - 项目准则已建立

## 📋 立即执行的任务

### Phase 1: 核心基础设施（优先级最高）

**任务1.1：更新WinControlExample组件**
```vue
<!-- 当前结构 -->
<WinControlExample>
  <template #example>...</template>
  <template #options>...</template>
  <template #output>...</template>
</WinControlExample>

<!-- 目标结构 -->
<WinControlExample
  headerText="..."
  :vueCode="vueCode"
  :templateCode="templateCode"
  :theme="pageTheme">
  <template #example>...</template>
  <template #options>...</template>
  <template #output>...</template>
  <!-- Expander会自动渲染 -->
</WinControlExample>
```

**任务1.2：为每个页面准备代码示例字符串**
- Vue代码（setup script部分）
- Template代码（template部分）
- 代码高亮（使用Prism.js或简单pre标签）

### Phase 2: 更新所有14个已完成页面

逐个页面添加：
1. vueCode和templateCode字符串
2. 验证Options区域使用Win*控件
3. 验证控件属性对齐官方

**更新顺序：**
1. CheckBoxPage（优先 - 刚修复控件）
2. ButtonPage
3. ToggleButtonPage
4. RadioButtonsPage
5. ToggleSwitchPage
6. SliderPage
7. HyperlinkButtonPage
8. RepeatButtonPage
9. SplitButtonPage
10. ColorPickerPage
11. ComboBoxPage

### Phase 3: 全面审查所有控件

**审查清单：**
- [ ] WinButton - 属性对齐
- [ ] WinToggleButton - 属性对齐
- [ ] WinCheckBox - ✅ 已对齐
- [ ] WinRadioButton - 属性对齐
- [ ] WinToggleSwitch - 属性对齐
- [ ] WinSlider - 属性对齐
- [ ] WinHyperlinkButton - 属性对齐
- [ ] WinRepeatButton - 属性对齐
- [ ] WinSplitButton - 属性对齐
- [ ] WinColorPicker - 属性对齐
- [ ] WinComboBox - 属性对齐
- [ ] WinExpander - ✅ 已对齐
- [ ] WinSelectorBar - ✅ 新建已对齐

## 🎯 工作流程

### 每个控件的审查步骤：
1. 读取官方XAML控件定义
2. 列出所有官方属性（PascalCase）
3. 列出所有官方事件
4. 对比现有Vue控件
5. 修正不一致的地方
6. 在CLAUDE.md记录对照表

### 每个页面的更新步骤：
1. 读取官方Gallery XAML
2. 提取示例代码
3. 转换为Vue代码字符串
4. 添加vueCode和templateCode
5. 审查Options区域（必须用Win*控件）
6. 测试主题切换和收藏功能

## 📊 预计工作量

### 控件审查（13个）
- 预计每个：15-30分钟
- 总计：3-6小时

### 页面更新（14个）
- 预计每个：20-40分钟
- 总计：5-10小时

### WinControlExample重写
- 预计：1-2小时

**总计：** 9-18小时工作量

## 🚀 建议执行顺序

### 立即开始（今天）
1. ✅ 创建CLAUDE.md准则
2. ✅ 更新WinExpander
3. ✅ 创建WinSelectorBar
4. ⏳ 重写WinControlExample（包含代码示例区域）
5. ⏳ 更新CheckBoxPage（测试新的WinControlExample）

### 明天继续
6. 审查所有控件属性
7. 批量更新剩余13个页面
8. 全面测试

## 📝 检查清单模板

```markdown
## [控件名] 审查报告

### 官方属性
- [ ] Property1: Type
- [ ] Property2: Type

### 官方事件
- [ ] Event1
- [ ] Event2

### 当前实现
- ✅/❌ Property1 对齐
- ✅/❌ Event1 对齐

### 需要修复
- [ ] 将prop1改为Property1
- [ ] 添加Event2事件
```

## 🎉 完成标准

### 控件完成标准
- ✅ 所有属性与官方100%对齐
- ✅ 所有事件与官方100%对齐
- ✅ 所有逻辑与官方100%对齐
- ✅ 在CLAUDE.md中记录对照表

### 页面完成标准
- ✅ 包含代码示例区域（Expander + SelectorBar）
- ✅ Options区域使用Win*控件
- ✅ 主题切换功能正常
- ✅ 收藏功能正常
- ✅ 所有示例对齐官方Gallery

---

**下一步：** 立即重写WinControlExample组件
