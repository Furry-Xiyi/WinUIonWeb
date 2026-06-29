#!/bin/bash
# 批量更新所有Basic Input页面 - 添加代码示例

# 已完成
# ✅ CheckBoxPage - 完整对齐 + 代码示例
# ✅ ButtonPage - 代码示例已添加

# 待更新列表
pages=(
  "ToggleButtonPage"
  "RadioButtonsPage"
  "ToggleSwitchPage"
  "SliderPage"
  "HyperlinkButtonPage"
  "RepeatButtonPage"
  "SplitButtonPage"
  "ColorPickerPage"
  "ComboBoxPage"
)

echo "📋 待更新页面: ${#pages[@]} 个"
for page in "${pages[@]}"; do
  echo "  - $page"
done

echo ""
echo "🎯 更新策略："
echo "1. 读取官方XAML示例"
echo "2. 为每个示例添加templateCode和vueCode"
echo "3. 验证Options区域使用Win*控件"
echo "4. 验证控件事件使用官方命名"
