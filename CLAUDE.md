# WinUI on Web 项目准则

## 🚨 核心准则（必须严格遵守）

### 准则 1：严格根据官方代码创建

**必须：**
- ✅ 所有Vue控件必须根据官方WinUI控件库（microsoft-ui-xaml）创建
- ✅ 所有展示页必须根据官方WinUI Gallery代码创建
- ✅ 控件属性命名必须与官方完全一致（如：`IsThreeState`、`NavigateUri`）
- ✅ 控件事件命名必须与官方完全一致（如：`Checked`、`Unchecked`、`Indeterminate`）
- ✅ 控件逻辑必须与官方完全一致（如：三段式CheckBox的null→true→false→null循环）

**禁止：**
- ❌ 不得自己发明属性名（如：`three-state`应为`isThreeState`）
- ❌ 不得自己发明事件名（如：`@change`应为`@checked`/`@unchecked`）
- ❌ 不得简化或改变官方逻辑
- ❌ 不得天马行空发展，必须100%对齐官方

### 准则 2：创建展示页时必须使用已有控件

**必须：**
- ✅ Options区域必须使用项目已有的Win*控件（WinCheckBox、WinComboBox、WinRadioButton等）
- ✅ 所有交互元素（选项、输入框、按钮）必须使用已实现的控件
- ✅ 展示页结构必须包含：
  - 页面标题 + 描述
  - 主题切换按钮 + 收藏按钮（右上角）
  - 每个示例的WinControlExample容器
  - Example区域（展示控件）
  - Output区域（可选 - 显示输出）
  - Options区域（可选 - 配置选项）
  - **代码示例区域（Expander + SelectorBar）** ← 当前缺失

**禁止：**
- ❌ 不得直接使用原生HTML元素（`<input>`、`<select>`、`<button>`等）
- ❌ 不得在Options区域使用inline style代替控件
- ❌ 不得创建未经批准的新控件

### 准则 3：新控件创建流程

**创建新控件前必须：**
1. ✅ 确认官方WinUI控件库中存在该控件
2. ✅ 读取官方控件的XAML定义和属性
3. ✅ 读取官方Gallery的示例页面
4. ✅ 获得明确批准后再创建

**创建新控件时必须：**
1. ✅ 完全对齐官方属性命名（PascalCase）
2. ✅ 完全对齐官方事件命名
3. ✅ 完全对齐官方逻辑和行为
4. ✅ 完全对齐官方样式和交互

**禁止：**
- ❌ 不得创建官方不存在的控件
- ❌ 不得简化官方控件的功能
- ❌ 不得合并或拆分官方控件

## 📋 当前缺失的关键控件

### 必须立即创建的控件：

1. **WinExpander** - 用于展开/收起代码示例区域
   - 官方属性：`IsExpanded`、`Header`、`Content`、`ExpandDirection`
   - 官方事件：`Expanded`、`Collapsed`

2. **WinSelectorBar** - 用于Vue/Template代码切换
   - 官方属性：`Items`、`SelectedItem`
   - 官方事件：`SelectionChanged`

3. **WinControlExample更新** - 必须包含代码示例区域
   - 当前缺失：Expander包裹的代码示例
   - 当前缺失：SelectorBar切换Vue/Template
   - 当前缺失：代码高亮显示

## 🎯 官方参考路径

### 控件源码：
```
/e/WinUIonWeb/WinUI-Controls/dxaml/xcp/dxaml/lib/winrtgeneratedclasses/
```

### Gallery示例：
```
/e/WinUIonWeb/WinUI-Gallery/WinUIGallery/Samples/
```

### ControlExample模板：
```
/e/WinUIonWeb/WinUI-Gallery/WinUIGallery/Controls/ControlExample.xaml
```

## 📊 属性命名规范

### 布尔属性
- ✅ `IsThreeState`（不是`threeState`或`three-state`）
- ✅ `IsExpanded`（不是`expanded`）
- ✅ `IsEnabled`（不是`enabled`，Vue中用`:disabled="!isEnabled"`）

### URI/路径属性
- ✅ `NavigateUri`（不是`navigateUri`或`navigate-uri`）
- ✅ `Source`（不是`src`）

### 数值属性
- ✅ `Delay`、`Interval`（对于RepeatButton）
- ✅ `Minimum`、`Maximum`、`StepFrequency`（对于Slider）

### 在Vue中使用
```vue
<!-- 正确 - 使用驼峰式传递PascalCase属性 -->
<WinCheckBox :isThreeState="true" @checked="handler" />

<!-- 错误 -->
<WinCheckBox :three-state="true" @change="handler" />
```

## 🔧 事件命名规范

### CheckBox事件
- ✅ `@checked`（不是`@change`）
- ✅ `@unchecked`
- ✅ `@indeterminate`

### 通用事件
- ✅ `@click`
- ✅ `@selectionChanged`
- ✅ `@expanded`、`@collapsed`

## ⚠️ 违规示例

### ❌ 错误示例1：自创属性名
```vue
<!-- 错误 -->
<WinCheckBox :three-state="true" />

<!-- 正确 -->
<WinCheckBox :isThreeState="true" />
```

### ❌ 错误示例2：Options区域使用原生HTML
```vue
<!-- 错误 -->
<template #options>
  <input type="number" v-model="value" />
  <select v-model="option">...</select>
</template>

<!-- 正确 -->
<template #options>
  <WinNumberBox v-model="value" />
  <WinComboBox v-model="option" :options="options" />
</template>
```

### ❌ 错误示例3：缺少代码示例区域
```vue
<!-- 错误 - 当前所有页面都是这样 -->
<WinControlExample headerText="示例">
  <template #example>...</template>
  <template #options>...</template>
</WinControlExample>

<!-- 正确 - 必须包含代码示例 -->
<WinControlExample headerText="示例" :xamlCode="xamlCode" :csharpCode="vueCode">
  <template #example>...</template>
  <template #options>...</template>
  <!-- WinControlExample内部会自动渲染Expander和SelectorBar -->
</WinControlExample>
```

## 📝 检查清单

在创建或修改任何控件/页面前，必须确认：

- [ ] 已读取官方WinUI控件的定义
- [ ] 已读取官方Gallery的示例代码
- [ ] 所有属性名与官方一致
- [ ] 所有事件名与官方一致
- [ ] 所有逻辑与官方一致
- [ ] Options区域使用已有Win*控件
- [ ] 包含完整的代码示例区域
- [ ] 未创建任何未批准的新控件

## 🎯 立即行动项

1. **创建WinExpander控件**（参考官方Expander）
2. **创建WinSelectorBar控件**（参考官方SelectorBar）
3. **重写WinControlExample**（包含代码示例区域）
4. **更新所有14个已完成的页面**（添加代码示例）
5. **核对所有现有控件**（确保100%对齐官方）

---

**最后更新：** 2026-07-01 00:15
**状态：** 准则已建立，开始执行严格对齐
