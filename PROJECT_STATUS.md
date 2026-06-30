# WinUI on Web - 项目状态与要求

**项目路径：** `/e/WinUIonWeb/WinUIonWeb`
**最后更新：** 2026-07-01 01:05
**状态：** ✅ 架构完成 | 🚀 批量更新中

---

## 📋 项目概述

这是一个像素级还原WinUI 3控件的Vue项目，目标是创建一个完整的Web版WinUI Gallery。

### 核心要求
1. **100%对齐官方WinUI** - 所有控件和页面必须严格根据官方仓库创建
2. **属性命名对齐** - 使用PascalCase（如IsThreeState、NavigateUri）
3. **事件命名对齐** - 使用官方事件名（如Checked、Unchecked、Indeterminate）
4. **逻辑完全一致** - 如三段式CheckBox的null→true→false→null循环
5. **禁止自创** - 不得发明属性名、事件名或简化逻辑

### 官方参考路径
- **控件源码：** `/e/WinUIonWeb/WinUI-Controls/dxaml/xcp/dxaml/lib/winrtgeneratedclasses/`
- **Gallery示例：** `/e/WinUIonWeb/WinUI-Gallery/WinUIGallery/Samples/`
- **ControlExample：** `/e/WinUIonWeb/WinUI-Gallery/WinUIGallery/Controls/ControlExample.xaml`

---

## ✅ 已完成的核心基础设施

### 1. WinControlExample（完全重构）
**架构：**
```vue
<div class="control-example-wrapper">
  <div class="control-example">
    <!-- 示例内容 -->
  </div>
  <WinExpander> <!-- 独立组件，在下方 -->
    <WinSelectorBar /> <!-- Template/Vue切换 -->
    <code>代码展示</code>
  </WinExpander>
</div>
```

**特点：**
- Expander作为独立组件放在WinControlExample下方
- 圆角正确贴合（上：8px 8px 0 0，下：0 0 8px 8px）
- 自动显示代码示例（templateCode + vueCode）

### 2. WinExpander（完全对齐官方）
**属性：**
- `isExpanded: Boolean` - 是否展开
- `header: String` - 标题
- `expandDirection: 'Down' | 'Up'` - 展开方向（支持向上展开）

**事件：**
- `@expanded` - 展开时触发
- `@collapsed` - 收起时触发

**特点：**
- Down模式：内容向下展开（默认）
- Up模式：flex-direction: column-reverse，内容向上展开
- Grid动画效果

### 3. WinSelectorBar（Top导航栏样式）
**外观：**
- **不是圆角pill按钮！**
- Top导航栏样式，底部有border-bottom分隔线
- 无背景色，hover时subtle-secondary
- 选中态：font-weight: 600

**底部指示条动画：**
- 从ComboBox的flyout-indicator改造
- 位置：bottom: -1px
- 尺寸：width: 16px, height: 3px
- 圆角：border-radius: 3px 3px 0 0
- 动画：active时width收缩到10px
- **无pressed背景动画**

---

## 🎯 完全对齐的控件（7个）

### 1. WinCheckBox ✅
**属性：** `isThreeState: Boolean`（对齐官方IsThreeState）
**事件：** `@checked`, `@unchecked`, `@indeterminate`
**逻辑：** 三段式循环 null → true → false → null

### 2. WinExpander ✅
**属性：** `isExpanded`, `expandDirection: 'Down'|'Up'`
**事件：** `@expanded`, `@collapsed`
**特点：** 支持向上展开

### 3. WinSelectorBar ✅
**样式：** Top导航栏 + 底部指示条动画
**特点：** 从ComboBox指示条改造，无pressed动画

### 4. WinToggleSwitch ✅
**修正：** 字间距 8px → 12px

### 5. WinRadioButton ✅
**间距：** 垂直8px，水平16px（MaxColumns模式）

### 6. WinHyperlinkButton ✅
**属性：** `navigateUri`, `openInNewWindow`

### 7. WinRepeatButton ✅
**属性：** `delay`, `interval`

---

## 📊 当前进度

### 页面进度
- **总页面：** 38个
- **基础完成：** 14个 (37%)
- **包含代码示例：** 2个 (5%)
  - CheckBoxPage - 3个完整示例
  - ButtonPage - 3个完整示例

### 控件进度
- **完全对齐：** 7/30+ (23%)
- **Basic Input类别：** 7/17 (41%)

### 代码质量
- ✅ TypeScript构建成功
- ✅ 响应式状态管理
- ✅ 持久化存储（收藏系统）
- ✅ 主题切换功能

---

## 📝 标准页面结构

### CheckBoxPage作为黄金标准

```vue
<template>
  <div>
    <!-- 页面头部 -->
    <div style="position: relative;">
      <h1 class="page-header">CheckBox</h1>
      <p class="page-description">描述...</p>
      <div class="page-header-actions">
        <WinButton subtle @click="toggleTheme">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton v-model="isFavoriteState" subtle>
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- 示例 -->
    <WinControlExample
      headerText="A 2-state CheckBox"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <WinCheckBox
          v-model="checked"
          @checked="onChecked"
          @unchecked="onUnchecked">
          Two-state CheckBox
        </WinCheckBox>
      </template>
      <template #output>
        <p class="output-text">{{ output }}</p>
      </template>
      <template #options>
        <WinCheckBox v-model="option">配置选项</WinCheckBox>
      </template>
    </WinControlExample>
    <!-- Expander自动在下方渲染 -->
  </div>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue';
import WinCheckBox from '../components/WinCheckBox.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'checkbox');

const { isFavorite: checkFavorite, toggleFavorite: toggleFav } = useFavorites();
const isFavorite = computed(() => checkFavorite(pageKey.value));
const isFavoriteState = ref(isFavorite.value);

watch(isFavorite, (newVal) => {
  isFavoriteState.value = newVal;
});

const toggleFavorite = () => {
  toggleFav(pageKey.value);
};

const { pageTheme, toggleTheme: doToggleTheme } = usePageTheme('system');
const toggleTheme = () => doToggleTheme();

// 示例逻辑
const checked = ref(false);
const output = ref('Unchecked');

const onChecked = () => {
  output.value = 'Checked';
};

const onUnchecked = () => {
  output.value = 'Unchecked';
};

// 代码字符串
const example1Template = `<WinCheckBox
  v-model="checked"
  @checked="onChecked"
  @unchecked="onUnchecked">
  Two-state CheckBox
</WinCheckBox>`;

const example1Vue = `const checked = ref(false);

const onChecked = () => {
  console.log('Checked');
};

const onUnchecked = () => {
  console.log('Unchecked');
};`;
</script>
```

---

## 🚨 项目准则（CLAUDE.md）

### 准则1：严格根据官方代码创建
- ✅ 所有Vue控件必须根据官方WinUI控件库创建
- ✅ 所有展示页必须根据官方WinUI Gallery代码创建
- ✅ 控件属性命名必须与官方完全一致（IsThreeState、NavigateUri）
- ✅ 控件事件命名必须与官方完全一致（Checked、Unchecked）
- ❌ 不得自己发明属性名或事件名
- ❌ 不得简化或改变官方逻辑

### 准则2：展示页必须使用已有控件
- ✅ Options区域必须使用Win*控件（WinCheckBox、WinComboBox等）
- ✅ 展示页结构必须包含代码示例区域（Expander + SelectorBar）
- ❌ 不得使用原生HTML元素（`<input>`, `<select>`, `<button>`）

### 准则3：新控件创建流程
1. 确认官方WinUI控件库中存在该控件
2. 读取官方控件的XAML定义和属性
3. 读取官方Gallery的示例页面
4. 获得明确批准后再创建

---

## 📋 剩余任务清单

### Phase 1: 批量添加代码示例（高优先级）
**还需更新12个页面：**
1. [ ] ToggleButtonPage
2. [ ] RadioButtonsPage
3. [ ] ToggleSwitchPage
4. [ ] SliderPage
5. [ ] HyperlinkButtonPage
6. [ ] RepeatButtonPage
7. [ ] SplitButtonPage
8. [ ] ColorPickerPage
9. [ ] ComboBoxPage
10. [ ] HomePage（特殊处理）
11-12. [ ] 其他2个已完成页面

**预计工作量：** 3-4小时

### Phase 2: 审查所有控件属性对齐
**需审查的控件（5个）：**
1. [ ] WinButton - Content, IsEnabled, Click
2. [ ] WinToggleButton - IsChecked, Click
3. [ ] WinSlider - Minimum, Maximum, StepFrequency
4. [ ] WinComboBox - Items, SelectedIndex
5. [ ] WinSplitButton - Click, Flyout

**预计工作量：** 2.5-4小时

### Phase 3: 创建缺失的Basic Input控件
**需创建（7个）：**
1. [ ] WinDatePicker
2. [ ] WinTimePicker
3. [ ] WinCalendarView
4. [ ] WinCalendarDatePicker
5. [ ] WinRatingControl
6. [ ] WinDropDownButton
7. [ ] WinToggleSplitButton

**预计工作量：** 7-14小时

---

## 🔧 技术栈

- **框架：** Vue 3 + TypeScript
- **构建工具：** Vite
- **路由：** Vue Router
- **状态管理：** Composition API + Composables
- **持久化：** localStorage
- **字体：** Segoe Fluent Icons, Segoe MDL2 Assets

---

## 📂 项目结构

```
WinUIonWeb/
├── src/
│   ├── components/          # Win*控件
│   │   ├── WinButton.vue
│   │   ├── WinCheckBox.vue
│   │   ├── WinExpander.vue
│   │   ├── WinSelectorBar.vue
│   │   ├── WinControlExample.vue
│   │   └── ...
│   ├── pages/              # 展示页
│   │   ├── CheckBoxPage.vue
│   │   ├── ButtonPage.vue
│   │   └── ...
│   ├── composables/        # 可复用逻辑
│   │   ├── useFavorites.js
│   │   └── usePageTheme.js
│   └── router/
├── public/
└── CLAUDE.md              # 项目准则
```

---

## 🎯 质量标准

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

## 🚀 下一步行动

**立即执行：** 批量添加代码示例到剩余12个页面

**工作流程：**
1. 读取官方Gallery的XAML
2. 转换为Vue Template代码
3. 提取Vue逻辑代码
4. 添加到WinControlExample的templateCode和vueCode
5. 验证Options使用Win*控件
6. 验证控件事件使用官方命名

---

## 📝 重要注意事项

### 关于架构
- Expander不是包在WinControlExample内部，而是独立组件放在下方
- 圆角必须正确贴合（上下分别处理）
- WinSelectorBar是Top导航栏样式，不是圆角pill按钮

### 关于属性命名
- 官方使用PascalCase，Vue中使用驼峰式传递
- 例如：官方`IsThreeState`，Vue中`:isThreeState="true"`
- 例如：官方`NavigateUri`，Vue中`:navigateUri="url"`

### 关于事件命名
- 使用官方事件名，不是通用的@change
- CheckBox：`@checked`, `@unchecked`, `@indeterminate`
- Expander：`@expanded`, `@collapsed`
- Button：`@click`（这个是通用的）

---

**构建命令：**
```bash
cd /e/WinUIonWeb/WinUIonWeb
npm run dev      # 开发服务器
npm run build    # 生产构建
```

**最后构建时间：** 2026-07-01 01:00
**构建状态：** ✅ 成功（2.48s）
