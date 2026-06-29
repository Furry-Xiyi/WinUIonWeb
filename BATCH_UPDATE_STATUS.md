# WinUI on Web - 批量页面更新总结

**更新时间：** 2026-06-30 23:57

## ✅ 已完成更新的页面（8个）

以下页面已完成主题和收藏按钮的添加（直接使用WinButton和WinToggleButton）：

1. ✅ **ButtonPage**
2. ✅ **HyperlinkButtonPage**
3. ✅ **ToggleButtonPage**
4. ✅ **SplitButtonPage**
5. ✅ **ColorPickerPage**
6. ✅ **ComboBoxPage**
7. ✅ **CheckBoxPage**
8. ✅ **RepeatButtonPage**

## 📋 待更新的页面列表（约30个）

### Basic Input 类别
- [ ] CalendarDatePickerPage
- [ ] CalendarViewPage
- [ ] DatePickerPage
- [ ] DropDownButtonPage
- [ ] RadioButtonsPage
- [ ] RatingPage / RatingControlPage
- [ ] SliderPage
- [ ] TimePickerPage
- [ ] ToggleSwitchPage
- [ ] ToggleSplitButtonPage

### Collections 类别
- [ ] FlipViewPage
- [ ] GridViewPage
- [ ] ListBoxPage
- [ ] ListViewPage
- [ ] PullToRefreshPage
- [ ] TreeViewPage

### Layout 类别
- [ ] ExpanderPage
- [ ] SplitViewPage

### Media 类别
- [ ] AnimatedVisualPlayerPage
- [ ] CaptureElementPage
- [ ] ImagePage
- [ ] MediaPlayerElementPage
- [ ] PersonPicturePage

### Dialogs and Flyouts 类别
- [ ] ContentDialogPage
- [ ] FlyoutPage
- [ ] PopupPage
- [ ] TeachingTipPage

## 🔧 标准更新模板

每个页面需要以下修改：

### 1. Template 更新
```vue
<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">控件名</h1>
      <p class="page-description">描述</p>
      <div class="page-header-actions">
        <WinButton
          subtle
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model="isFavoriteState"
          subtle
          @update:modelValue="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- 所有 WinControlExample 需要添加 :theme="pageTheme" -->
    <WinControlExample headerText="..." :theme="pageTheme">
      ...
    </WinControlExample>
  </div>
</template>
```

### 2. Script 更新
```vue
<script setup>
import { ref, inject, computed, watch } from 'vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
// ... 其他imports
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'pagename');

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

// ... 页面原有的逻辑
</script>
```

### 3. Style 更新
```vue
<style scoped>
/* 添加以下样式 */
.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
  align-items: center;
}

.icon {
  font-size: 16px;
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
}

/* ... 保留原有样式 */
</style>
```

## 📊 进度统计

- **已完成：** 8/38 页面（21%）
- **待完成：** 30/38 页面（79%）

## 🎯 下一步计划

建议按优先级批量更新：

### Phase 1: 高优先级控件（10个页面）
这些是用户最常用的基础控件：
1. RadioButtonsPage
2. ToggleSwitchPage
3. SliderPage
4. DatePickerPage
5. TimePickerPage
6. ListViewPage
7. GridViewPage
8. TreeViewPage
9. DropDownButtonPage
10. ToggleSplitButtonPage

### Phase 2: 中优先级（10个页面）
1. ExpanderPage
2. SplitViewPage
3. FlipViewPage
4. ListBoxPage
5. ContentDialogPage
6. FlyoutPage
7. PopupPage
8. TeachingTipPage
9. CalendarViewPage
10. CalendarDatePickerPage

### Phase 3: 低优先级（10个页面）
1. AnimatedVisualPlayerPage
2. CaptureElementPage
3. ImagePage
4. MediaPlayerElementPage
5. PersonPicturePage
6. PullToRefreshPage
7. RatingPage / RatingControlPage

## 🔗 参考资源

- **官方Gallery：** `/e/WinUIonWeb/WinUI-Gallery/WinUIGallery/Samples/`
- **控件源码：** `/e/WinUIonWeb/WinUI-Controls/` (克隆中)
- **已完成示例：** ButtonPage, CheckBoxPage, ToggleButtonPage

## 📝 注意事项

1. 每个页面的pageKey要与路由匹配
2. 所有WinControlExample都要添加 :theme="pageTheme"
3. 按钮位置使用absolute定位对齐标题描述
4. 必须import WinButton和WinToggleButton
5. 必须添加isFavoriteState的ref和watch
6. 必须添加.page-header-actions和.icon样式
