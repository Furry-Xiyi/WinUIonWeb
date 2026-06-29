#!/usr/bin/env python3
import os
import sys

# 定义控件分组
CONTROL_GROUPS = {
    "Basic Input": [
        "Button", "DropDownButton", "HyperlinkButton", "RepeatButton",
        "ToggleButton", "SplitButton", "ToggleSplitButton", "CheckBox",
        "ColorPicker", "ComboBox", "RadioButton", "RatingControl",
        "Slider", "ToggleSwitch"
    ],
    "Collections": [
        "FlipView", "GridView", "ItemsRepeater", "ItemsView",
        "ListView", "PullToRefresh", "TreeView"
    ],
    "Date & Time": [
        "CalendarDatePicker", "CalendarView", "DatePicker", "TimePicker"
    ],
    "Dialogs & Flyouts": [
        "ContentDialog", "Flyout", "Popup", "TeachingTip"
    ],
    "Layout": [
        "Border", "Canvas", "Expander", "Grid", "RelativePanel",
        "SplitView", "StackPanel", "VariableSizedWrapGrid", "Viewbox"
    ],
    "Menus & Toolbars": [
        "AppBarButton", "AppBarSeparator", "AppBarToggleButton",
        "CommandBar", "CommandBarFlyout", "MenuBar", "MenuFlyout",
        "SwipeControl", "StandardUICommand", "XamlUICommand"
    ],
    "Navigation": [
        "BreadcrumbBar", "NavigationView", "Pivot", "SelectorBar", "TabView"
    ],
    "Scrolling": [
        "AnnotatedScrollBar", "PipsPager", "ScrollView", "ScrollViewer",
        "SemanticZoom"
    ],
    "Status & Info": [
        "InfoBadge", "InfoBar", "ProgressBar", "ProgressRing", "ToolTip"
    ],
    "Text": [
        "AutoSuggestBox", "NumberBox", "PasswordBox", "RichEditBox",
        "RichTextBlock", "TextBlock", "TextBox"
    ]
}

SAMPLES_DIR = r"C:\Users\Furry_Xiyi\AppData\Local\Temp\WinUI-Gallery\WinUIGallery\Samples"
OUTPUT_FILE = r"C:\Users\Furry_Xiyi\AppData\Local\Temp\winui_controls_extraction.md"

def read_file_safe(filepath):
    """安全读取文件，处理编码问题"""
    encodings = ['utf-8', 'utf-8-sig', 'utf-16', 'cp1252', 'latin1']
    for encoding in encodings:
        try:
            with open(filepath, 'r', encoding=encoding) as f:
                return f.read()
        except (UnicodeDecodeError, FileNotFoundError):
            continue
    return f"[无法读取文件: {filepath}]"

def extract_control_info(control_name):
    """提取单个控件的所有信息"""
    control_dir = os.path.join(SAMPLES_DIR, control_name)

    if not os.path.exists(control_dir):
        return None

    info = {
        'name': control_name,
        'xaml': None,
        'cs': None,
        'examples': []
    }

    # 查找主页面文件
    xaml_file = os.path.join(control_dir, f"{control_name}Page.xaml")
    cs_file = os.path.join(control_dir, f"{control_name}Page.xaml.cs")

    if os.path.exists(xaml_file):
        info['xaml'] = read_file_safe(xaml_file)

    if os.path.exists(cs_file):
        info['cs'] = read_file_safe(cs_file)

    # 查找所有示例文件
    try:
        for filename in sorted(os.listdir(control_dir)):
            if filename.endswith('.txt'):
                filepath = os.path.join(control_dir, filename)
                content = read_file_safe(filepath)
                info['examples'].append({
                    'name': filename,
                    'content': content
                })
    except Exception as e:
        print(f"Error reading examples for {control_name}: {e}", file=sys.stderr)

    return info

def write_control_to_output(f, control_info):
    """将控件信息写入输出文件"""
    if not control_info:
        return

    f.write(f"\n# {control_info['name']}\n\n")

    # 写入主页面 XAML
    if control_info['xaml']:
        f.write(f"## 主页面 XAML ({control_info['name']}Page.xaml)\n")
        f.write("```xaml\n")
        f.write(control_info['xaml'])
        f.write("\n```\n\n")
    else:
        f.write(f"## 主页面 XAML ({control_info['name']}Page.xaml)\n")
        f.write("[文件不存在]\n\n")

    # 写入主页面 C#
    if control_info['cs']:
        f.write(f"## 主页面 C# ({control_info['name']}Page.xaml.cs)\n")
        f.write("```csharp\n")
        f.write(control_info['cs'])
        f.write("\n```\n\n")
    else:
        f.write(f"## 主页面 C# ({control_info['name']}Page.xaml.cs)\n")
        f.write("[文件不存在]\n\n")

    # 写入示例文件
    if control_info['examples']:
        f.write("## 示例文件\n\n")
        for example in control_info['examples']:
            f.write(f"### {example['name']}\n")
            f.write("```\n")
            f.write(example['content'])
            f.write("\n```\n\n")

def main():
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("# WinUI Gallery 控件提取结果\n\n")
        f.write("本文档包含从 WinUI Gallery 仓库提取的所有控件展示页详细信息。\n\n")
        f.write("---\n")

        total_controls = 0
        extracted_controls = 0

        for group_name, controls in CONTROL_GROUPS.items():
            f.write(f"\n\n# 分组: {group_name}\n\n")
            f.write("---\n")

            for control_name in controls:
                total_controls += 1
                print(f"正在提取: {control_name} ({group_name})", file=sys.stderr)

                control_info = extract_control_info(control_name)
                if control_info and (control_info['xaml'] or control_info['cs']):
                    write_control_to_output(f, control_info)
                    extracted_controls += 1
                else:
                    f.write(f"\n# {control_name}\n\n")
                    f.write("[控件目录不存在或无主要文件]\n\n")
                    print(f"  警告: {control_name} 未找到", file=sys.stderr)

        print(f"\n完成! 总计: {total_controls} 个控件, 成功提取: {extracted_controls} 个", file=sys.stderr)

if __name__ == "__main__":
    main()
