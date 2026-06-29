# WinUI Gallery 控件提取结果

本文档包含从 WinUI Gallery 仓库提取的所有控件展示页详细信息。

---


# 分组: Basic Input

---

# Button

## 主页面 XAML (ButtonPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.ButtonPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="Button\ButtonSimple.txt">
            <controls:ControlExample.Example>
                <Button
                    x:Name="Button1"
                    AutomationProperties.Name="Standard XAML"
                    Click="Button_Click"
                    Content="Standard XAML button"
                    IsEnabled="{x:Bind DisableButton1.IsChecked.Value.Equals(x:False), Mode=OneWay}" />
            </controls:ControlExample.Example>
            <controls:ControlExample.Output>
                <TextBlock x:Name="Control1Output" FontFamily="Global User Interface" />
            </controls:ControlExample.Output>
            <controls:ControlExample.Options>
                <StackPanel>
                    <CheckBox x:Name="DisableButton1" Content="Disable button" />
                </StackPanel>
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution
                    Key="IsEnabled"
                    IsEnabled="{x:Bind DisableButton1.IsChecked.Value, Mode=OneWay}"
                    Value="IsEnabled=&quot;False&quot; " />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample x:Name="Example2" SampleDefinition="Button\ButtonWithImage.txt">
            <controls:ControlExample.Example>
                <StackPanel Orientation="Horizontal">
                    <Button
                        x:Name="Button2"
                        Width="50"
                        Height="50"
                        AutomationProperties.Name="Pie"
                        Click="Button_Click">
                        <Image AutomationProperties.Name="Slice" Source="/Assets/SampleMedia/Slices.png" />
                    </Button>
                </StackPanel>
            </controls:ControlExample.Example>
            <controls:ControlExample.Output>
                <TextBlock x:Name="Control2Output" />
            </controls:ControlExample.Output>
        </controls:ControlExample>
        <!--controls:ControlExample HeaderText="Reveal style applied to Button.">
            <controls:ControlExample.Example>
                <Button Style="{StaticResource ButtonRevealStyle}" Content="Reveal style button"/>
            </controls:ControlExample.Example>
            <controls:ControlExample.Xaml>
                <x:String >
                    &lt;Button Style="{StaticResource ButtonRevealStyle}" Content="Reveal style button" /&gt;
                </x:String>
            </controls:ControlExample.Xaml>
        </-->

        <controls:ControlExample SampleDefinition="Button\ButtonBuiltInStyles.txt">
            <controls:ControlExample.Example>
                <StackPanel Orientation="Horizontal" Spacing="16">
                    <Button
                        AutomationProperties.Name="Accent style"
                        Content="Accent style button"
                        Style="{StaticResource AccentButtonStyle}" />
                    <Button
                        AutomationProperties.Name="Subtle style"
                        Content="Subtle style button"
                        Style="{StaticResource SubtleButtonStyle}" />
                </StackPanel>

            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="Button\ButtonWrapping.txt">
            <StackPanel>
                <TextBlock
                    Margin="0,0,0,8"
                    Text="The following buttons' content may get clipped if we don't pay careful attention to their layout containers."
                    TextWrapping="Wrap" />
                <TextBlock
                    Margin="0,0,0,8"
                    Text="One option to mitigate clipped content is to place Buttons underneath each other, allowing for more space to grow horizontally:"
                    TextWrapping="Wrap" />
                <Button Margin="0,0,0,5" HorizontalAlignment="Stretch">This is some text that is too long and will get cut off</Button>
                <Button HorizontalAlignment="Stretch">This is another text that would result in being cut off</Button>

                <TextBlock Margin="0,8,0,8" Text="Another option is to explicitly wrap the Button's content" />
                <StackPanel HorizontalAlignment="Center" Orientation="Horizontal">
                    <Button MaxWidth="240" Margin="0,0,8,0">
                        <TextBlock Text="This is some text that is too long and will get cut off without wrapping" TextWrapping="WrapWholeWords" />
                    </Button>
                    <Button MaxWidth="240">
                        <TextBlock Text="This is another text that would result in being cut off without wrapping" TextWrapping="WrapWholeWords" />
                    </Button>
                </StackPanel>
            </StackPanel>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (ButtonPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class ButtonPage : Page
{
    public ButtonPage()
    {
        this.InitializeComponent();
    }

    private void Button_Click(object sender, RoutedEventArgs e)
    {
        if (sender is Button b)
        {
            string name = b.Name;

            switch (name)
            {
                case "Button1":
                    Control1Output.Text = "You clicked: " + name;
                    break;
                case "Button2":
                    Control2Output.Text = "You clicked: " + name;
                    break;

            }
        }
    }
}

```

## 示例文件

### ButtonBuiltInStyles.txt
```
--- header
Built-in styles applied to Button.
--- xaml
<Button Style="{StaticResource AccentButtonStyle}" Content="Accent style button"/>
<Button Style="{StaticResource SubtleButtonStyle}" Content="Subtle style button"/>
```

### ButtonSimple.txt
```
--- header
A simple Button with text content.
--- xaml
<Button Content="Standard XAML button" Click="Button_Click" $(IsEnabled)/>
--- c#
private void Button_Click(object sender, RoutedEventArgs e)
{
    // Handle button click
}
```

### ButtonWithImage.txt
```
--- header
A Button with graphical content.
--- xaml
<Button Content="Button" Click="Button_Click" AutomationProperties.Name="Pie">
    <Image Source="/Assets/SampleMedia/Slices.png" AutomationProperties.Name="Slice"/>
</Button>
```

### ButtonWrapping.txt
```
--- header
Wrapping Buttons with large content
--- xaml
<StackPanel>
    <TextBlock Text="The following buttons' content may get clipped if we don't pay careful attention to their layout containers." Margin="0,0,0,8" TextWrapping="Wrap"/>
    <TextBlock Text="One option to mitigate clipped content is to place Buttons underneath each other, allowing for more space to grow horizontally:" Margin="0,0,0,8" TextWrapping="Wrap"/>
    <Button HorizontalAlignment="Stretch" Margin="0,0,0,5">This is some text that is too long and will get cut off</Button>
    <Button HorizontalAlignment="Stretch">This is another text that would result in being cut off</Button>

    <TextBlock Text="Another option is to explicitly wrap the Button's content" Margin="0,8,0,8"/>
    <StackPanel Orientation="Horizontal" HorizontalAlignment="Center">
        <Button MaxWidth="240" Margin="0,0,8,0">
            <TextBlock Text="This is some text that is too long and will get cut off" TextWrapping="WrapWholeWords"/>
        </Button>
        <Button MaxWidth="240">
            <TextBlock Text="This is another text that would result in being cut off" TextWrapping="WrapWholeWords"/>
        </Button>
    </StackPanel>
</StackPanel>
```


# DropDownButton

## 主页面 XAML (DropDownButtonPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.DropDownButtonPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <StackPanel>
        <controls:ControlExample SampleDefinition="DropDownButton\DropDownButtonSimple.txt">
            <StackPanel x:Name="Control1" Orientation="Horizontal">
                <DropDownButton Content="Email">
                    <DropDownButton.Flyout>
                        <MenuFlyout Placement="BottomEdgeAlignedLeft">
                            <MenuFlyoutItem Text="Send" />
                            <MenuFlyoutItem Text="Reply" />
                            <MenuFlyoutItem Text="Reply All" />
                        </MenuFlyout>
                    </DropDownButton.Flyout>
                </DropDownButton>
            </StackPanel>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="DropDownButton\DropDownButtonIcon.txt">
            <StackPanel x:Name="Control2" Orientation="Horizontal">
                <DropDownButton AutomationProperties.Name="Email">
                    <DropDownButton.Content>
                        <FontIcon Glyph="&#xE715;" />
                    </DropDownButton.Content>
                    <DropDownButton.Flyout>
                        <MenuFlyout Placement="BottomEdgeAlignedLeft">
                            <MenuFlyoutItem Text="Send">
                                <MenuFlyoutItem.Icon>
                                    <FontIcon Glyph="&#xE725;" />
                                </MenuFlyoutItem.Icon>
                            </MenuFlyoutItem>
                            <MenuFlyoutItem Text="Reply">
                                <MenuFlyoutItem.Icon>
                                    <FontIcon Glyph="&#xE8CA;" />
                                </MenuFlyoutItem.Icon>
                            </MenuFlyoutItem>
                            <MenuFlyoutItem Text="Reply All">
                                <MenuFlyoutItem.Icon>
                                    <FontIcon Glyph="&#xE8C2;" />
                                </MenuFlyoutItem.Icon>
                            </MenuFlyoutItem>
                        </MenuFlyout>
                    </DropDownButton.Flyout>
                </DropDownButton>
            </StackPanel>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (DropDownButtonPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class DropDownButtonPage : Page
{
    public DropDownButtonPage()
    {
        this.InitializeComponent();
    }
}

```

## 示例文件

### DropDownButtonIcon.txt
```
--- header
DropDownButton with Icons
--- xaml
<DropDownButton AutomationProperties.Name="Email">
    <DropDownButton.Content>
        <FontIcon Glyph="&#xE715;"/>
    </DropDownButton.Content>
    <DropDownButton.Flyout>
        <MenuFlyout Placement="Bottom">
            <MenuFlyoutItem Text="Send">
                <MenuFlyoutItem.Icon>
                    <FontIcon Glyph="&#xE725;"/>
                </MenuFlyoutItem.Icon>
            </MenuFlyoutItem>
            <MenuFlyoutItem Text="Reply">
                <MenuFlyoutItem.Icon>
                    <FontIcon Glyph="&#xE8CA;"/>
                </MenuFlyoutItem.Icon>
            </MenuFlyoutItem>
            <MenuFlyoutItem Text="Reply All">
                <MenuFlyoutItem.Icon>
                    <FontIcon Glyph="&#xE8C2;"/>
                </MenuFlyoutItem.Icon>
            </MenuFlyoutItem>
        </MenuFlyout>
    </DropDownButton.Flyout>
</DropDownButton>
```

### DropDownButtonSimple.txt
```
--- header
Simple DropDownButton
--- xaml
<DropDownButton Content="Email">
    <DropDownButton.Flyout>
        <MenuFlyout Placement="Bottom">
            <MenuFlyoutItem Text="Send"/>
            <MenuFlyoutItem Text="Reply"/>
            <MenuFlyoutItem Text="Reply All"/>
        </MenuFlyout>
    </DropDownButton.Flyout>
</DropDownButton>
```


# HyperlinkButton

## 主页面 XAML (HyperlinkButtonPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.HyperlinkButtonPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="HyperlinkButton\HyperlinkButtonNavigate.txt">
            <controls:ControlExample.Example>
                <HyperlinkButton
                    x:Name="Control1"
                    Content="Microsoft home page"
                    IsEnabled="{x:Bind DisableControl1.IsChecked.Value.Equals(x:False), Mode=OneWay}"
                    NavigateUri="https://www.microsoft.com" />
            </controls:ControlExample.Example>
            <controls:ControlExample.Options>
                <StackPanel>
                    <CheckBox x:Name="DisableControl1" Content="Disable hyperlink button" />
                </StackPanel>
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution
                    Key="IsEnabled"
                    IsEnabled="{x:Bind DisableControl1.IsChecked.Value, Mode=OneWay}"
                    Value="IsEnabled=&quot;False&quot; " />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="HyperlinkButton\HyperlinkButtonClick.txt">
            <controls:ControlExample.Example>
                <HyperlinkButton
                    x:Name="Control2"
                    Click="GoToHyperlinkButton_Click"
                    Content="Go to ToggleButton" />
            </controls:ControlExample.Example>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (HyperlinkButtonPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using WinUIGallery.Pages;

namespace WinUIGallery.ControlPages;

public sealed partial class HyperlinkButtonPage : Page
{
    public HyperlinkButtonPage()
    {
        this.InitializeComponent();
    }

    private void GoToHyperlinkButton_Click(object sender, RoutedEventArgs e)
    {
        App.MainWindow.Navigate(typeof(ItemPage), "ToggleButton");
    }
}
```

## 示例文件

### HyperlinkButtonClick.txt
```
--- header
A hyperlink button that handles a Click event.
--- xaml
<HyperlinkButton Content="ToggleButton" Click="HyperlinkButton_Click"/>
```

### HyperlinkButtonNavigate.txt
```
--- header
A hyperlink button that navigates to a URI.
--- xaml
<HyperlinkButton Content="Microsoft home page" NavigateUri="https://www.microsoft.com" $(IsEnabled)/>
```


# RepeatButton

## 主页面 XAML (RepeatButtonPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.RepeatButtonPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample SampleDefinition="RepeatButton\RepeatButtonSimple.txt">
            <StackPanel Orientation="Horizontal">
                <RepeatButton
                    x:Name="Control1"
                    Click="RepeatButton_Click"
                    Content="Click and hold"
                    IsEnabled="{x:Bind DisableControl1.IsChecked.Value.Equals(x:False), Mode=OneWay}" />
                <TextBlock
                    x:Name="Control1Output"
                    Margin="8,0,0,0"
                    VerticalAlignment="Center"
                    AutomationProperties.LiveSetting="Polite"
                    AutomationProperties.Name="Control output" />
            </StackPanel>

            <controls:ControlExample.Options>
                <CheckBox x:Name="DisableControl1" Content="Disable RepeatButton" />
            </controls:ControlExample.Options>

            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution
                    Key="IsEnabled"
                    IsEnabled="{x:Bind DisableControl1.IsChecked.Value, Mode=OneWay}"
                    Value="IsEnabled=&quot;False&quot; " />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (RepeatButtonPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Automation.Peers;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class RepeatButtonPage : Page
{
    public RepeatButtonPage()
    {
        this.InitializeComponent();
    }

    private static int _clicks = 0;
    private void RepeatButton_Click(object sender, RoutedEventArgs e)
    {
        _clicks += 1;
        Control1Output.Text = "Number of clicks: " + _clicks;

        AutomationPeer peer = FrameworkElementAutomationPeer.FromElement(Control1Output) ?? FrameworkElementAutomationPeer.CreatePeerForElement(Control1Output);
        peer?.RaiseAutomationEvent(AutomationEvents.LiveRegionChanged);
    }
}

```

## 示例文件

### RepeatButtonSimple.txt
```
--- header
A simple RepeatButton with text content.
--- xaml
<RepeatButton Content="Click and hold" Click="RepeatButton_Click" $(IsEnabled)/>
```


# ToggleButton

## 主页面 XAML (ToggleButtonPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.ToggleButtonPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample SampleDefinition="ToggleButton\ToggleButtonSimple.txt">
            <StackPanel VerticalAlignment="Top" Orientation="Horizontal">
                <ToggleButton
                    x:Name="Toggle1"
                    Checked="ToggleButton_Checked"
                    Content="ToggleButton"
                    IsEnabled="{x:Bind DisableToggle1.IsChecked.Value.Equals(x:False), Mode=OneWay}"
                    Unchecked="ToggleButton_Unchecked" />
            </StackPanel>
            <controls:ControlExample.Output>
                <TextBlock x:Name="Control1Output" />
            </controls:ControlExample.Output>
            <controls:ControlExample.Options>
                <StackPanel>
                    <CheckBox x:Name="DisableToggle1" Content="Disable ToggleButton" />
                </StackPanel>
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution
                    Key="IsEnabled"
                    IsEnabled="{x:Bind DisableToggle1.IsChecked.Value, Mode=OneWay}"
                    Value="IsEnabled=&quot;False&quot; " />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (ToggleButtonPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class ToggleButtonPage : Page
{
    public ToggleButtonPage()
    {
        this.InitializeComponent();

        // Set initial output value.
        Control1Output.Text = Toggle1.IsChecked is true ? "On" : "Off";
    }

    private void ToggleButton_Checked(object sender, RoutedEventArgs e)
    {
        Control1Output.Text = "On";
    }

    private void ToggleButton_Unchecked(object sender, RoutedEventArgs e)
    {
        Control1Output.Text = "Off";
    }
}

```

## 示例文件

### ToggleButtonSimple.txt
```
--- header
A simple ToggleButton with text content.
--- xaml
<ToggleButton Content="ToggleButton" Click="Button_Click" $(IsEnabled)/>
```


# SplitButton

## 主页面 XAML (SplitButtonPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.SplitButtonPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <Page.Resources>
        <x:Double x:Key="SwatchSize">32</x:Double>
    </Page.Resources>

    <StackPanel>
        <controls:ControlExample
            x:Name="Example1"
            SampleDefinition="SplitButton\SplitButtonColorPicker.txt"
            WebViewHeight="150">
            <Grid x:Name="Control1" ColumnSpacing="24">

                <SplitButton
                    x:Name="myColorButton"
                    MinWidth="0"
                    MinHeight="0"
                    Padding="0"
                    VerticalAlignment="Top"
                    AutomationProperties.Name="Font color"
                    Click="myColorButton_Click">
                    <Border
                        x:Name="CurrentColor"
                        Width="{StaticResource SwatchSize}"
                        Height="{StaticResource SwatchSize}"
                        Margin="0"
                        Background="Green"
                        CornerRadius="4,0,0,4" />
                    <SplitButton.Flyout>
                        <Flyout Placement="Bottom">
                            <GridView IsItemClickEnabled="True" ItemClick="GridView_ItemClick">
                                <GridView.ItemsPanel>
                                    <ItemsPanelTemplate>
                                        <ItemsWrapGrid MaximumRowsOrColumns="3" Orientation="Horizontal" />
                                    </ItemsPanelTemplate>
                                </GridView.ItemsPanel>
                                <GridView.Resources>
                                    <Style TargetType="Rectangle">
                                        <Setter Property="Width" Value="{StaticResource SwatchSize}" />
                                        <Setter Property="Height" Value="{StaticResource SwatchSize}" />
                                        <Setter Property="RadiusX" Value="4" />
                                        <Setter Property="RadiusY" Value="4" />
                                    </Style>
                                </GridView.Resources>
                                <GridView.Items>
                                    <Rectangle AutomationProperties.Name="Red" Fill="Red" />
                                    <Rectangle AutomationProperties.Name="Orange" Fill="Orange" />
                                    <Rectangle AutomationProperties.Name="Yellow" Fill="Yellow" />
                                    <Rectangle AutomationProperties.Name="Green" Fill="Green" />
                                    <Rectangle AutomationProperties.Name="Blue" Fill="Blue" />
                                    <Rectangle AutomationProperties.Name="Indigo" Fill="Indigo" />
                                    <Rectangle AutomationProperties.Name="Violet" Fill="Violet" />
                                    <Rectangle AutomationProperties.Name="Gray" Fill="Gray" />
                                </GridView.Items>
                            </GridView>

                        </Flyout>
                    </SplitButton.Flyout>
                </SplitButton>
            </Grid>
            <controls:ControlExample.Options>
                <RichEditBox
                    x:Name="myRichEditBox"
                    Width="240"
                    MinHeight="96"
                    PlaceholderText="Type something here"
                    TextChanged="MyRichEditBox_TextChanged" />
            </controls:ControlExample.Options>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="SplitButton\SplitButtonText.txt">
            <controls:ControlExample.Example>
                <SplitButton
                    x:Name="myColorButtonReveal"
                    MinWidth="0"
                    MinHeight="0"
                    Padding="5"
                    VerticalAlignment="Top"
                    AutomationProperties.Name="Font color with text">
                    Choose color
                    <SplitButton.Flyout>
                        <Flyout Placement="Bottom">
                            <VariableSizedWrapGrid MaximumRowsOrColumns="3" Orientation="Horizontal">
                                <VariableSizedWrapGrid.Resources>
                                    <Style TargetType="Rectangle">
                                        <Setter Property="Width" Value="{StaticResource SwatchSize}" />
                                        <Setter Property="Height" Value="{StaticResource SwatchSize}" />
                                        <Setter Property="RadiusX" Value="4" />
                                        <Setter Property="RadiusY" Value="4" />
                                    </Style>
                                    <Style TargetType="Button">
                                        <Setter Property="Padding" Value="0" />
                                        <Setter Property="MinWidth" Value="0" />
                                        <Setter Property="MinHeight" Value="0" />
                                        <Setter Property="Margin" Value="6" />
                                        <Setter Property="CornerRadius" Value="{StaticResource ControlCornerRadius}" />
                                    </Style>
                                </VariableSizedWrapGrid.Resources>
                                <Button AutomationProperties.Name="Red" Click="RevealColorButton_Click">
                                    <Button.Content>
                                        <Rectangle Fill="Red" />
                                    </Button.Content>
                                </Button>
                                <Button AutomationProperties.Name="Orange" Click="RevealColorButton_Click">
                                    <Button.Content>
                                        <Rectangle Fill="Orange" />
                                    </Button.Content>
                                </Button>
                                <Button AutomationProperties.Name="Yellow" Click="RevealColorButton_Click">
                                    <Button.Content>
                                        <Rectangle Fill="Yellow" />
                                    </Button.Content>
                                </Button>
                                <Button AutomationProperties.Name="Green" Click="RevealColorButton_Click">
                                    <Button.Content>
                                        <Rectangle Fill="Green" />
                                    </Button.Content>
                                </Button>
                                <Button AutomationProperties.Name="Blue" Click="RevealColorButton_Click">
                                    <Button.Content>
                                        <Rectangle Fill="Blue" />
                                    </Button.Content>
                                </Button>
                                <Button AutomationProperties.Name="Indigo" Click="RevealColorButton_Click">
                                    <Button.Content>
                                        <Rectangle Fill="Indigo" />
                                    </Button.Content>
                                </Button>
                                <Button AutomationProperties.Name="Violet" Click="RevealColorButton_Click">
                                    <Button.Content>
                                        <Rectangle Fill="Violet" />
                                    </Button.Content>
                                </Button>
                                <Button AutomationProperties.Name="Gray" Click="RevealColorButton_Click">
                                    <Button.Content>
                                        <Rectangle Fill="Gray" />
                                    </Button.Content>
                                </Button>
                                <Button AutomationProperties.Name="Black" Click="RevealColorButton_Click">
                                    <Button.Content>
                                        <Rectangle Fill="Black" />
                                    </Button.Content>
                                </Button>
                            </VariableSizedWrapGrid>
                        </Flyout>
                    </SplitButton.Flyout>
                </SplitButton>
            </controls:ControlExample.Example>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (SplitButtonPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media;
using Microsoft.UI.Xaml.Shapes;
using System.Threading.Tasks;

namespace WinUIGallery.ControlPages;

public sealed partial class SplitButtonPage : Page
{
    private Windows.UI.Color currentColor = Colors.Green;

    public SplitButtonPage()
    {
        this.InitializeComponent();

        myRichEditBox.Document.Selection.CharacterFormat.ForegroundColor = currentColor;
        myRichEditBox.Document.Selection.SetText(Microsoft.UI.Text.TextSetOptions.None,
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
            "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tempor commodo ullamcorper a lacus.");
    }

    private void GridView_ItemClick(object sender, ItemClickEventArgs e)
    {
        var rect = (Rectangle)e.ClickedItem;
        var color = ((SolidColorBrush)rect.Fill).Color;
        myRichEditBox.Document.Selection.CharacterFormat.ForegroundColor = color;
        CurrentColor.Background = new SolidColorBrush(color);

        myRichEditBox.Focus(Microsoft.UI.Xaml.FocusState.Keyboard);
        currentColor = color;

        // Delay required to circumvent GridView bug: https://github.com/microsoft/microsoft-ui-xaml/issues/6350
        Task.Delay(10).ContinueWith(_ => myColorButton.Flyout.Hide(), TaskScheduler.FromCurrentSynchronizationContext());
    }

    private void RevealColorButton_Click(object sender, RoutedEventArgs e)
    {
        myColorButtonReveal.Flyout.Hide();
    }

    private void myColorButton_Click(Microsoft.UI.Xaml.Controls.SplitButton sender, Microsoft.UI.Xaml.Controls.SplitButtonClickEventArgs args)
    {
        var border = (Border)sender.Content;
        var color = ((Microsoft.UI.Xaml.Media.SolidColorBrush)border.Background).Color;

        myRichEditBox.Document.Selection.CharacterFormat.ForegroundColor = color;
        currentColor = color;
    }

    private void MyRichEditBox_TextChanged(object sender, RoutedEventArgs e)
    {
        if (myRichEditBox.Document.Selection.CharacterFormat.ForegroundColor != currentColor)
        {
            myRichEditBox.Document.Selection.CharacterFormat.ForegroundColor = currentColor;
        }
    }
}

```

## 示例文件

### SplitButtonColorPicker.txt
```
--- header
A SplitButton controlling text color in a RichEditBox
--- xaml
<SplitButton x:Name="myColorButton" Click="myColorButton_Click">
    <Border x:Name="CurrentColor" Width="32" Height="32" Background="Green" CornerRadius="4,0,0,4"/>
    <SplitButton.Flyout>
        <Flyout Placement="Bottom">
            <!-- flyout content -->
        </Flyout>
    </SplitButton.Flyout>
</SplitButton>
```

### SplitButtonText.txt
```
--- header
A SplitButton with text
--- xaml
<SplitButton x:Name="myColorButton">
    Choose color
    <SplitButton.Flyout>
        <Flyout Placement="Bottom">
            <!-- flyout content -->
        </Flyout>
    </SplitButton.Flyout>
</SplitButton>
```


# ToggleSplitButton

## 主页面 XAML (ToggleSplitButtonPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.ToggleSplitButtonPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample
            x:Name="Example1"
            SampleDefinition="ToggleSplitButton\ToggleSplitButtonBulletList.txt"
            WebViewHeight="150">
            <ToggleSplitButton
                x:Name="myListButton"
                VerticalAlignment="Top"
                AutomationProperties.Name="Bullets"
                IsCheckedChanged="MyListButton_IsCheckedChanged">
                <SymbolIcon x:Name="mySymbolIcon" Symbol="List" />
                <ToggleSplitButton.Flyout>
                    <Flyout Placement="Bottom">
                        <StackPanel Orientation="Horizontal">
                            <StackPanel.Resources>
                                <Style TargetType="Button">
                                    <Setter Property="Padding" Value="4" />
                                    <Setter Property="MinWidth" Value="0" />
                                    <Setter Property="MinHeight" Value="0" />
                                    <Setter Property="Margin" Value="6" />
                                    <Setter Property="CornerRadius" Value="{StaticResource ControlCornerRadius}" />
                                </Style>
                            </StackPanel.Resources>
                            <Button AutomationProperties.Name="Bulleted list" Click="BulletButton_Click">
                                <SymbolIcon Symbol="List" />
                            </Button>
                            <Button AutomationProperties.Name="Roman numerals list" Click="BulletButton_Click">
                                <SymbolIcon Symbol="Bullets" />
                            </Button>
                        </StackPanel>
                    </Flyout>
                </ToggleSplitButton.Flyout>
            </ToggleSplitButton>
            <controls:ControlExample.Options>
                <RichEditBox
                    x:Name="myRichEditBox"
                    Width="240"
                    MinHeight="96"
                    AutomationProperties.Name="Text entry" />
            </controls:ControlExample.Options>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (ToggleSplitButtonPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Text;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Automation;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class ToggleSplitButtonPage : Page
{
    private MarkerType _type = MarkerType.Bullet;
    public ToggleSplitButtonPage()
    {
        this.InitializeComponent();
    }

    private void BulletButton_Click(object sender, RoutedEventArgs e)
    {
        Button clickedBullet = (Button)sender;
        SymbolIcon symbol = (SymbolIcon)clickedBullet.Content;

        if (symbol.Symbol == Symbol.List)
        {
            _type = MarkerType.Bullet;
            mySymbolIcon.Symbol = Symbol.List;
            myListButton.SetValue(AutomationProperties.NameProperty, "Bullets");
        }
        else if (symbol.Symbol == Symbol.Bullets)
        {
            _type = MarkerType.UppercaseRoman;
            mySymbolIcon.Symbol = Symbol.Bullets;
            myListButton.SetValue(AutomationProperties.NameProperty, "Roman Numerals");
        }
        myRichEditBox.Document.Selection.ParagraphFormat.ListType = _type;

        myListButton.IsChecked = true;
        myListButton.Flyout.Hide();
        myRichEditBox.Focus(FocusState.Keyboard);
    }

    private void MyListButton_IsCheckedChanged(Microsoft.UI.Xaml.Controls.ToggleSplitButton sender, Microsoft.UI.Xaml.Controls.ToggleSplitButtonIsCheckedChangedEventArgs args)
    {
        if (sender.IsChecked)
        {
            //add bulleted list
            myRichEditBox.Document.Selection.ParagraphFormat.ListType = _type;
        }
        else
        {
            //remove bulleted list
            myRichEditBox.Document.Selection.ParagraphFormat.ListType = MarkerType.None;
        }
    }
}

```

## 示例文件

### ToggleSplitButtonBulletList.txt
```
--- header
Using ToggleSplitButton to control bulleted list functionality in RichEditBox
--- xaml
<ToggleSplitButton x:Name="myListButton" VerticalAlignment="Top" Click="myListButton_Click">
    <SymbolIcon x:Name="mySymbolIcon" Symbol="List"/>
    <ToggleSplitButton.Flyout>
        <Flyout Placement="Bottom">
            <!-- flyout content -->
        </Flyout>
    </ToggleSplitButton.Flyout>
</ToggleSplitButton>
```


# CheckBox

## 主页面 XAML (CheckBoxPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.CheckBoxPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="CheckBox\CheckBoxTwoState.txt">
            <controls:ControlExample.Example>
                <StackPanel Orientation="Horizontal">
                    <!--  A two-state CheckBox.  -->
                    <CheckBox
                        AutomationProperties.Name="Two-state"
                        Checked="TwoState_Checked"
                        Content="Two-state CheckBox"
                        Unchecked="TwoState_Unchecked" />
                </StackPanel>
            </controls:ControlExample.Example>
            <controls:ControlExample.Output>
                <TextBlock x:Name="TwoStateOutput" AutomationProperties.AutomationId="Control1Output" />
            </controls:ControlExample.Output>
        </controls:ControlExample>
        <controls:ControlExample
            x:Name="Example2"
            SampleDefinition="CheckBox\CheckBoxThreeState.txt"
            RelativePanel.Below="Example1">
            <controls:ControlExample.Example>
                <StackPanel Orientation="Horizontal">
                    <CheckBox
                        AutomationProperties.Name="Three-state"
                        Checked="ThreeState_Checked"
                        Content="Three-state CheckBox"
                        Indeterminate="ThreeState_Indeterminate"
                        IsThreeState="True"
                        Unchecked="ThreeState_Unchecked" />
                </StackPanel>
            </controls:ControlExample.Example>
            <controls:ControlExample.Output>
                <TextBlock x:Name="ThreeStateOutput" AutomationProperties.AutomationId="Control2Output" />
            </controls:ControlExample.Output>
        </controls:ControlExample>
        <controls:ControlExample
            x:Name="Example3"
            SampleDefinition="CheckBox\CheckBoxSelectAll.txt"
            RelativePanel.Below="Example2">
            <controls:ControlExample.Example>
                <StackPanel>
                    <CheckBox
                        x:Name="OptionsAllCheckBox"
                        Checked="SelectAll_Checked"
                        Content="Select all"
                        Indeterminate="SelectAll_Indeterminate"
                        IsThreeState="True"
                        Unchecked="SelectAll_Unchecked" />
                    <CheckBox
                        x:Name="Option1CheckBox"
                        Margin="24,0,0,0"
                        Checked="Option_Checked"
                        Content="Option 1"
                        Unchecked="Option_Unchecked" />
                    <CheckBox
                        x:Name="Option2CheckBox"
                        Margin="24,0,0,0"
                        Checked="Option_Checked"
                        Content="Option 2"
                        IsChecked="True"
                        Unchecked="Option_Unchecked" />
                    <CheckBox
                        x:Name="Option3CheckBox"
                        Margin="24,0,0,0"
                        Checked="Option_Checked"
                        Content="Option 3"
                        Unchecked="Option_Unchecked" />
                </StackPanel>
            </controls:ControlExample.Example>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (CheckBoxPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class CheckBoxPage : Page
{
    public CheckBoxPage()
    {
        this.InitializeComponent();
        Loaded += CheckBoxPage_Loaded;
    }

    void CheckBoxPage_Loaded(object sender, RoutedEventArgs e)
    {
        SetCheckedState();
    }

    private void TwoState_Checked(object sender, RoutedEventArgs e)
    {
        TwoStateOutput.Text = "You checked the box.";
    }

    private void TwoState_Unchecked(object sender, RoutedEventArgs e)
    {
        TwoStateOutput.Text = "You unchecked the box.";
    }

    private void ThreeState_Checked(object sender, RoutedEventArgs e)
    {
        ThreeStateOutput.Text = "CheckBox is checked.";
    }

    private void ThreeState_Unchecked(object sender, RoutedEventArgs e)
    {
        ThreeStateOutput.Text = "CheckBox is unchecked.";
    }

    private void ThreeState_Indeterminate(object sender, RoutedEventArgs e)
    {
        ThreeStateOutput.Text = "CheckBox state is indeterminate.";
    }

    #region SelectAllMethods
    private void SelectAll_Checked(object sender, RoutedEventArgs e)
    {
        Option1CheckBox.IsChecked = Option2CheckBox.IsChecked = Option3CheckBox.IsChecked = true;
    }

    private void SelectAll_Unchecked(object sender, RoutedEventArgs e)
    {
        Option1CheckBox.IsChecked = Option2CheckBox.IsChecked = Option3CheckBox.IsChecked = false;
    }

    private void SelectAll_Indeterminate(object sender, RoutedEventArgs e)
    {
        // If the SelectAll box is checked (all options are selected),
        // clicking the box will change it to its indeterminate state.
        // Instead, we want to uncheck all the boxes,
        // so we do this programatically. The indeterminate state should
        // only be set programatically, not by the user.

        if (Option1CheckBox.IsChecked == true &&
            Option2CheckBox.IsChecked == true &&
            Option3CheckBox.IsChecked == true)
        {
            // This will cause SelectAll_Unchecked to be executed, so
            // we don't need to uncheck the other boxes here.
            OptionsAllCheckBox.IsChecked = false;
        }
    }

    private void SetCheckedState()
    {
        // Controls are null the first time this is called, so we just
        // need to perform a null check on any one of the controls.
        if (Option1CheckBox != null)
        {
            if (Option1CheckBox.IsChecked == true &&
                Option2CheckBox.IsChecked == true &&
                Option3CheckBox.IsChecked == true)
            {
                OptionsAllCheckBox.IsChecked = true;
            }
            else if (Option1CheckBox.IsChecked == false &&
                Option2CheckBox.IsChecked == false &&
                Option3CheckBox.IsChecked == false)
            {
                OptionsAllCheckBox.IsChecked = false;
            }
            else
            {
                // Set third state (indeterminate) by setting IsChecked to null.
                OptionsAllCheckBox.IsChecked = null;
            }
        }
    }

    private void Option_Checked(object sender, RoutedEventArgs e)
    {
        SetCheckedState();
    }

    private void Option_Unchecked(object sender, RoutedEventArgs e)
    {
        SetCheckedState();
    }
    #endregion
}

```

## 示例文件

### CheckBoxSelectAll.txt
```
--- header
Using a 3-state CheckBox.
--- xaml
<StackPanel>
    <CheckBox x:Name="OptionsAllCheckBox" Content="Select all" IsThreeState="True"
              Checked="SelectAll_Checked" Unchecked="SelectAll_Unchecked"
              Indeterminate="SelectAll_Indeterminate" />
    <CheckBox x:Name="Option1CheckBox" Content="Option 1" Margin="24,0,0,0" Checked="Option_Checked" Unchecked="Option_Unchecked" />
    <CheckBox x:Name="Option2CheckBox" Content="Option 2" Margin="24,0,0,0" Checked="Option_Checked" Unchecked="Option_Unchecked" IsChecked="True" />
    <CheckBox x:Name="Option3CheckBox" Content="Option 3" Margin="24,0,0,0" Checked="Option_Checked" Unchecked="Option_Unchecked" />
</StackPanel>
```

### CheckBoxThreeState.txt
```
--- header
A 3-state CheckBox.
--- xaml
<CheckBox Content="Three-state CheckBox"
          IsThreeState="True"
          Checked="ThreeState_Checked"
          Unchecked="ThreeState_Unchecked"
          Indeterminate="ThreeState_Indeterminate" />
```

### CheckBoxTwoState.txt
```
--- header
A 2-state CheckBox.
--- xaml
<CheckBox Content="Two-state CheckBox"
          Checked="TwoState_Checked"
          Unchecked="TwoState_Unchecked" />
```


# ColorPicker

## 主页面 XAML (ColorPickerPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.ColorPickerPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample
            x:Name="Example1"
            HorizontalContentAlignment="Left"
            SampleDefinition="ColorPicker\ColorPickerProperties.txt">

            <ColorPicker
                x:Name="colorPicker"
                IsAlphaEnabled="{x:Bind alpha.IsChecked.Value, Mode=OneWay}"
                IsAlphaSliderVisible="{x:Bind alphaSlider.IsChecked.Value, Mode=OneWay}"
                IsAlphaTextInputVisible="{x:Bind alphaTextInput.IsChecked.Value, Mode=OneWay}"
                IsColorChannelTextInputVisible="{x:Bind colorChannelInput.IsChecked.Value, Mode=OneWay}"
                IsColorSliderVisible="{x:Bind colorSlider.IsChecked.Value, Mode=OneWay}"
                IsHexInputVisible="{x:Bind hexInput.IsChecked.Value, Mode=OneWay}"
                IsMoreButtonVisible="{x:Bind moreBtn.IsChecked.Value, Mode=OneWay}" />

            <controls:ControlExample.Options>
                <StackPanel Width="250" Margin="0,-5,0,0">
                    <CheckBox
                        x:Name="moreBtn"
                        Content="IsMoreButtonVisible"
                        IsChecked="False" />
                    <CheckBox
                        x:Name="colorSlider"
                        Content="IsColorSliderVisible"
                        IsChecked="True" />
                    <CheckBox
                        x:Name="colorChannelInput"
                        Content="IsColorChannelTextInputVisible"
                        IsChecked="True" />
                    <CheckBox
                        x:Name="hexInput"
                        Content="IsHexInputVisible"
                        IsChecked="True" />
                    <CheckBox x:Name="alpha" Content="Alpha Enabled" />
                    <CheckBox
                        x:Name="alphaSlider"
                        Content="IsAlphaSliderVisible"
                        IsChecked="True"
                        IsEnabled="{x:Bind alpha.IsChecked.Value, Mode=OneWay}" />
                    <CheckBox
                        x:Name="alphaTextInput"
                        Content="IsAlphaTextInputVisible"
                        IsChecked="True"
                        IsEnabled="{x:Bind alpha.IsChecked.Value, Mode=OneWay}" />
                    <RadioButtons
                        x:Name="ColorSpectrumShapeRadioButtons"
                        Header="Colorspectrum shape"
                        SelectedIndex="0"
                        SelectionChanged="ColorSpectrumShapeRadioButtons_SelectionChanged">
                        <x:String>Box</x:String>
                        <x:String>Ring</x:String>
                    </RadioButtons>
                    <StackPanel Margin="0,12,0,0">
                        <TextBlock Text="ColorPicker applied on a Rectangle" />
                        <Rectangle
                            x:Name="previewRect"
                            Height="100"
                            Margin="0,12,0,0"
                            Stroke="{ThemeResource TextControlBorderBrush}"
                            StrokeThickness="1">
                            <Rectangle.Fill>
                                <SolidColorBrush Color="{x:Bind colorPicker.Color, Mode=OneWay}" />
                            </Rectangle.Fill>
                        </Rectangle>
                    </StackPanel>
                </StackPanel>
            </controls:ControlExample.Options>

            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="ColorSpectrumShape" Value="{x:Bind ColorSpectrumShapeRadioButtons.SelectedItem, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="IsMoreButtonVisible" Value="{x:Bind moreBtn.IsChecked, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="IsColorSliderVisible" Value="{x:Bind colorSlider.IsChecked, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="IsColorChannelTextInputVisible" Value="{x:Bind colorChannelInput.IsChecked, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="IsHexInputVisible" Value="{x:Bind hexInput.IsChecked, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="IsAlphaEnabled" Value="{x:Bind alpha.IsChecked, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="IsAlphaSliderVisible" Value="{x:Bind alphaSlider.IsChecked, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="IsAlphaTextInputVisible" Value="{x:Bind alphaTextInput.IsChecked, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (ColorPickerPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class ColorPickerPage : Page
{
    public ColorPickerPage()
    {
        this.InitializeComponent();
    }

    private void ColorSpectrumShapeRadioButtons_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        switch (ColorSpectrumShapeRadioButtons.SelectedItem)
        {
            case "Box":
                colorPicker.ColorSpectrumShape = Microsoft.UI.Xaml.Controls.ColorSpectrumShape.Box;
                break;
            default:
                colorPicker.ColorSpectrumShape = Microsoft.UI.Xaml.Controls.ColorSpectrumShape.Ring;
                break;
        }
    }
}

```

## 示例文件

### ColorPickerProperties.txt
```
--- header
ColorPicker Properties.
--- xaml
<ColorPicker
      ColorSpectrumShape="$(ColorSpectrumShape)"
      IsMoreButtonVisible="$(IsMoreButtonVisible)"
      IsColorSliderVisible="$(IsColorSliderVisible)"
      IsColorChannelTextInputVisible="$(IsColorChannelTextInputVisible)"
      IsHexInputVisible="$(IsHexInputVisible)"
      IsAlphaEnabled="$(IsAlphaEnabled)"
      IsAlphaSliderVisible="$(IsAlphaSliderVisible)"
      IsAlphaTextInputVisible="$(IsAlphaTextInputVisible)" />
```


# ComboBox

## 主页面 XAML (ComboBoxPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.ComboBoxPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:helper="using:WinUIGallery.Helpers"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample SampleDefinition="ComboBox\ComboBoxInline.txt">
            <controls:ControlExample.Example>
                <StackPanel>
                    <ComboBox
                        x:Name="Combo1"
                        Width="200"
                        Header="Colors"
                        PlaceholderText="Pick a color"
                        SelectionChanged="ColorComboBox_SelectionChanged">
                        <x:String>Blue</x:String>
                        <x:String>Green</x:String>
                        <x:String>Red</x:String>
                        <x:String>Yellow</x:String>
                    </ComboBox>
                    <Rectangle
                        x:Name="Control1Output"
                        Width="100"
                        Height="30"
                        Margin="0,8,0,0" />
                </StackPanel>
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="ComboBox\ComboBoxItemsSource.txt">
            <controls:ControlExample.Example>
                <StackPanel>
                    <ComboBox
                        x:Name="Combo2"
                        MinWidth="200"
                        Header="Font" 
                        SelectedIndex="2"
                        ItemsSource="{x:Bind helper:FontHelper.Fonts}">
                        <ComboBox.ItemTemplate>
                            <DataTemplate x:DataType="helper:FontItem">
                                <TextBlock Text="{x:Bind Name}"/>
                            </DataTemplate>
                        </ComboBox.ItemTemplate>
                    </ComboBox>
                    <TextBlock
                        x:Name="Control2Output"
                        FontFamily="{x:Bind ((helper:FontItem)Combo2.SelectedItem).Font, Mode=OneWay}"
                        Style="{StaticResource OutputTextBlockStyle}"
                        Text="You can set the font used for this text." />
                </StackPanel>
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="ComboBox\ComboBoxEditable.txt">
            <controls:ControlExample.Example>
                <StackPanel>
                    <ComboBox
                        x:Name="Combo3"
                        Width="200"
                        Header="Font Size"
                        IsEditable="True"
                        ItemsSource="{x:Bind FontSizes}"
                        Loaded="Combo3_Loaded" />
                    <TextBlock
                        x:Name="Control3Output"
                        FontFamily="Segoe UI"
                        FontSize="{x:Bind (x:Double)Combo3.SelectedValue, Mode=OneWay}"
                        Style="{StaticResource OutputTextBlockStyle}"
                        Text="You can set the font size used for this text." />
                </StackPanel>
            </controls:ControlExample.Example>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (ComboBoxPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media;
using System;
using System.Collections.Generic;
using Windows.Foundation.Metadata;

namespace WinUIGallery.ControlPages;

public sealed partial class ComboBoxPage : Page
{
    public List<double> FontSizes { get; } = new List<double>()
        {
            8,
            9,
            10,
            11,
            12,
            14,
            16,
            18,
            20,
            24,
            28,
            36,
            48,
            72
        };

    public ComboBoxPage()
    {
        this.InitializeComponent();
    }

    private void ColorComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        string? colorName = e.AddedItems[0].ToString();
        Windows.UI.Color color;
        switch (colorName)
        {
            case "Yellow":
                color = Colors.Yellow;
                break;
            case "Green":
                color = Colors.Green;
                break;
            case "Blue":
                color = Colors.Blue;
                break;
            case "Red":
                color = Colors.Red;
                break;
            default:
                throw new Exception($"Invalid argument: {colorName}");
        }
        Control1Output.Fill = new SolidColorBrush(color);
    }

    private void Combo3_Loaded(object sender, RoutedEventArgs e)
    {
        Combo3.SelectedIndex = 2;

        if ((ApiInformation.IsApiContractPresent("Windows.Foundation.UniversalApiContract", 7)))
        {
            Combo3.TextSubmitted += Combo3_TextSubmitted;
        }
    }

    private void Combo3_TextSubmitted(ComboBox sender, ComboBoxTextSubmittedEventArgs args)
    {
        bool isDouble = double.TryParse(sender.Text, out double newValue);

        // Set the selected item if:
        // - The value successfully parsed to double AND
        // - The value is in the list of sizes OR is a custom value between 8 and 100
        if (isDouble && (FontSizes.Contains(newValue) || (newValue < 100 && newValue > 8)))
        {
            // Update the SelectedItem to the new value. 
            sender.SelectedItem = newValue;
        }
        else
        {
            // If the item is invalid, reject it and revert the text. 
            sender.Text = sender.SelectedValue.ToString();

            var dialog = new ContentDialog();
            dialog.Content = "The font size must be a number between 8 and 100.";
            dialog.CloseButtonText = "Close";
            dialog.DefaultButton = ContentDialogButton.Close;
            dialog.XamlRoot = sender.XamlRoot;
            _ = dialog.ShowAsync();
        }

        // Mark the event as handled so the framework doesn’t update the selected item automatically. 
        args.Handled = true;
    }
}

```

## 示例文件

### ComboBoxEditable.txt
```
--- header
An editable ComboBox.
--- xaml
<ComboBox IsEditable="True" ItemsSource="{x:Bind FontSizes}" Width="200" TextSubmitted="Combo3_TextSubmitted"/>
```

### ComboBoxInline.txt
```
--- header
A ComboBox with items defined inline and its width set.
--- xaml
<ComboBox SelectionChanged="ColorComboBox_SelectionChanged" Header="Colors" PlaceholderText="Pick a color" Width="200">
    <x:String>Blue</x:String>
    <x:String>Green</x:String>
    <x:String>Red</x:String>
    <x:String>Yellow</x:String>
</ComboBox>
```

### ComboBoxItemsSource.txt
```
--- header
A ComboBox with its ItemsSource set.
--- xaml
<ComboBox ItemsSource="{x:Bind Fonts}" DisplayMemberPath="Item1" SelectedValuePath="Item2"
          Header="Font" Width="200" Loaded="Combo2_Loaded"/>
```


# RadioButton

## 主页面 XAML (RadioButtonPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.RadioButtonPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample SampleDefinition="RadioButton\RadioButtonGroup.txt">
            <StackPanel>
                <RadioButtons Header="Options:">
                    <RadioButton
                        AutomationProperties.AutomationId="Option1RadioButton"
                        Checked="RadioButton_Checked"
                        Content="Option 1" />
                    <RadioButton
                        AutomationProperties.AutomationId="Option2RadioButton"
                        Checked="RadioButton_Checked"
                        Content="Option 2" />
                    <RadioButton
                        AutomationProperties.AutomationId="Option3RadioButton"
                        Checked="RadioButton_Checked"
                        Content="Option 3" />                
                </RadioButtons>
            </StackPanel>
            <controls:ControlExample.Output>
                <TextBlock x:Name="Control1Output" Text="Select an option." />
            </controls:ControlExample.Output>
        </controls:ControlExample>
        <controls:ControlExample SampleDefinition="RadioButton\RadioButtonStrings.txt">
            <StackPanel>
                <RadioButtons x:Name="BackgroundRadioButtons"
                              Header="Background"
                              MaxColumns="3"
                              SelectedIndex="0"
                              SelectionChanged="BackgroundColor_SelectionChanged">
                    <x:String>Green</x:String>
                    <x:String>Yellow</x:String>
                    <x:String>White</x:String>
                </RadioButtons>
                <RadioButtons x:Name="BorderRadioButtons"
                              Header="Border"
                              MaxColumns="3"
                              SelectedIndex="1"
                              SelectionChanged="BorderBrush_SelectionChanged">
                    <x:String>Green</x:String>
                    <x:String>Yellow</x:String>
                    <x:String>White</x:String>
                </RadioButtons>
                <Border x:Name="ControlOutput"
                        Height="50"
                        Margin="0,10,0,10"
                        Background="#FFFFFFFF"
                        BorderBrush="#FFFFD700"
                        BorderThickness="10" />
            </StackPanel>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="BackgroundRadioButtonsSubstitution"
                                                     Value="{x:Bind BackgroundRadioButtons.SelectedIndex, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="BorderRadioButtonsSubstitution"
                                                     Value="{x:Bind BorderRadioButtons.SelectedIndex, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

    </StackPanel>
</Page>

```

## 主页面 C# (RadioButtonPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media;

namespace WinUIGallery.ControlPages;

public sealed partial class RadioButtonPage : Page
{
    public RadioButtonPage()
    {
        this.InitializeComponent();
    }

    private void RadioButton_Checked(object sender, RoutedEventArgs e)
    {
        Control1Output.Text = string.Format("You selected {0}", (sender as RadioButton)?.Content.ToString());
    }

    private void BackgroundColor_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (ControlOutput != null && sender is RadioButtons rb)
        {
            string? colorName = rb.SelectedItem as string;
            switch (colorName)
            {
                case "Yellow":
                    ControlOutput.Background = new SolidColorBrush(Colors.Yellow);
                    break;
                case "Green":
                    ControlOutput.Background = new SolidColorBrush(Colors.Green);
                    break;
                case "White":
                    ControlOutput.Background = new SolidColorBrush(Colors.White);
                    break;
            }
        }
    }

    private void BorderBrush_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (ControlOutput != null && sender is RadioButtons rb)
        {
            string? colorName = rb.SelectedItem as string;
            switch (colorName)
            {
                case "Yellow":
                    ControlOutput.BorderBrush = new SolidColorBrush(Colors.Gold);
                    break;
                case "Green":
                    ControlOutput.BorderBrush = new SolidColorBrush(Colors.DarkGreen);
                    break;
                case "White":
                    ControlOutput.BorderBrush = new SolidColorBrush(Colors.White);
                    break;
            }
        }
    }
}

```

## 示例文件

### RadioButtonGroup.txt
```
--- header
A group of RadioButton controls in a RadioButtons group.
--- xaml
<RadioButtons Header="Options:">
    <RadioButton Content="Option 1" Checked="RadioButton_Checked"/>
    <RadioButton Content="Option 2" Checked="RadioButton_Checked"/>
    <RadioButton Content="Option 3" Checked="RadioButton_Checked"/>
</RadioButtons>
```

### RadioButtonStrings.txt
```
--- header
Two RadioButtons controls with strings as options.
--- xaml
<RadioButtons x:Name="BackgroundRadioButtons" SelectedIndex="$(BackgroundRadioButtonsSubstitution)"  MaxColumns="3" Header="Background" SelectionChanged="BackgroundColor_SelectionChanged">
    <x:String>Green</x:String>
    <x:String>Yellow</x:String>
    <x:String>White</x:String>
</RadioButtons>
<RadioButtons x:Name="BorderRadioButtons" SelectedIndex="$(BorderRadioButtonsSubstitution)" MaxColumns="3" Header="Border" SelectionChanged="BorderBrush_SelectionChanged">
    <x:String>Green</x:String>
    <x:String>Yellow</x:String>
    <x:String>White</x:String>
</RadioButtons>

<Border x:Name="ControlOutput" BorderThickness="10" BorderBrush="#FFFFD700" Background="#FFFFFFFF"
        Height="50" Margin="0,10,0,10" />
--- c#
private void BackgroundColor_SelectionChanged(object sender, SelectionChangedEventArgs e)
{
    if (ControlOutput != null && sender is RadioButtons rb)
    {
        string colorName = rb.SelectedItem as string;
        switch (colorName)
        {
            case "Yellow":
                ControlOutput.Background = new SolidColorBrush(Colors.Yellow);
                break;
            case "Green":
                ControlOutput.Background = new SolidColorBrush(Colors.Green);
                break;
            case "White":
                ControlOutput.Background = new SolidColorBrush(Colors.White);
                break;
        }
    }
}

private void BorderBrush_SelectionChanged(object sender, SelectionChangedEventArgs e)
{
    if (ControlOutput != null && sender is RadioButtons rb)
    {
        string colorName = rb.SelectedItem as string;
        switch (colorName)
        {
            case "Yellow":
                ControlOutput.BorderBrush = new SolidColorBrush(Colors.Gold);
                break;
            case "Green":
                ControlOutput.BorderBrush = new SolidColorBrush(Colors.DarkGreen);
                break;
            case "White":
                ControlOutput.BorderBrush = new SolidColorBrush(Colors.White);
                break;
        }
    }
}
```


# RatingControl

## 主页面 XAML (RatingControlPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.RatingControlPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="RatingControl\RatingControlSimple.txt">

            <StackPanel VerticalAlignment="Top">
                <RatingControl
                    x:Name="RatingControl1"
                    HorizontalAlignment="Left"
                    AutomationProperties.Name="Simple RatingControl"
                    Caption="312 ratings"
                    IsClearEnabled="{x:Bind clearEnabledCheck.IsChecked.Value, Mode=OneWay}"
                    IsReadOnly="{x:Bind readOnlyCheck.IsChecked.Value, Mode=OneWay}"
                    ValueChanged="RatingControl1_ValueChanged" />
            </StackPanel>

            <controls:ControlExample.Output>
                <TextBlock FontWeight="Bold" Text="{x:Bind RatingControl1.Value, Mode=OneWay}" />
            </controls:ControlExample.Output>

            <controls:ControlExample.Options>
                <StackPanel Width="220">
                    <CheckBox x:Name="clearEnabledCheck" Content="IsClearEnabled" />
                    <TextBlock Text="Swipe left or click again to clear your rating." TextWrapping="WrapWholeWords" />
                    <CheckBox
                        x:Name="readOnlyCheck"
                        Margin="0,12,0,0"
                        Content="IsReadOnly" />
                </StackPanel>
            </controls:ControlExample.Options>

            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="IsClearEnabled" Value="{x:Bind clearEnabledCheck.IsChecked, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="IsReadOnly" Value="{x:Bind readOnlyCheck.IsChecked, Mode=OneWay}" />
                <controls:ControlExampleSubstitution
                    Key="Caption"
                    x:Name="SampleCodeCaption"
                    Value="{x:Bind RatingControl1.Caption, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample x:Name="Example2" SampleDefinition="RatingControl\RatingControlPlaceholder.txt">

            <RatingControl
                x:Name="RatingControl2"
                HorizontalAlignment="Left"
                VerticalAlignment="Top"
                AutomationProperties.Name="RatingControl with placeholder"
                PlaceholderValue="{x:Bind slider.Value, Mode=TwoWay}" />

            <controls:ControlExample.Options>
                <StackPanel Width="220">
                    <Slider
                        x:Name="slider"
                        Header="PlaceholderValue"
                        IsFocusEngagementEnabled="False"
                        Maximum="5"
                        Minimum="0"
                        SmallChange="0.5"
                        StepFrequency="0.5" />
                </StackPanel>
            </controls:ControlExample.Options>

            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="Slider" Value="{x:Bind slider.Value, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (RatingControlPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class RatingControlPage : Page
{
    public RatingControlPage()
    {
        this.InitializeComponent();
    }

    private void RatingControl1_ValueChanged(RatingControl sender, object args)
    {
        RatingControl1.Caption = "Your rating";
    }
}

```

## 示例文件

### RatingControlPlaceholder.txt
```
--- header
PlaceholderValue of RatingControl
--- xaml
<RatingControl AutomationProperties.Name="RatingControl with placeholder" PlaceholderValue="$(Slider)" />
```

### RatingControlSimple.txt
```
--- header
A simple RatingControl
--- xaml
<RatingControl AutomationProperties.Name="Simple RatingControl" IsClearEnabled="$(IsClearEnabled)"
    IsReadOnly="$(IsReadOnly)" Caption="$(Caption)"/>
```


# Slider

## 主页面 XAML (SliderPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.SliderPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <!--  SIMPLE SLIDER  -->
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="Slider\SliderSimple.txt">
            <StackPanel Orientation="Horizontal">
                <Slider
                    x:Name="Slider1"
                    Width="200"
                    AutomationProperties.Name="simple slider" />
            </StackPanel>
            <controls:ControlExample.Output>
                <TextBlock Text="{x:Bind Slider1.Value.ToString(), Mode=OneWay}" />
            </controls:ControlExample.Output>
        </controls:ControlExample>

        <!--  SLIDER WITH RANGE AND STEPS  -->
        <controls:ControlExample x:Name="Example2" SampleDefinition="Slider\SliderRange.txt">
            <controls:ControlExample.Options>
                <Grid>
                    <Grid.RowDefinitions>
                        <RowDefinition />
                        <RowDefinition />
                        <RowDefinition />
                        <RowDefinition />
                        <RowDefinition />
                    </Grid.RowDefinitions>
                    <Grid.ColumnDefinitions>
                        <ColumnDefinition Width="Auto" />
                        <ColumnDefinition Width="Auto" MinWidth="80" />
                    </Grid.ColumnDefinitions>

                    <TextBlock
                        x:Name="MinimumLabel"
                        Grid.Row="0"
                        Grid.Column="0"
                        Margin="0,0,0,0"
                        Text="Minimum:" />
                    <NumberBox
                        x:Name="MinimumValue"
                        Grid.Row="0"
                        Grid.Column="1"
                        Margin="10,-5,0,0"
                        AutomationProperties.AccessibilityView="Raw"
                        AutomationProperties.Name="Minimum"
                        SpinButtonPlacementMode="Compact"
                        Value="500" />

                    <TextBlock
                        x:Name="MaximumLabel"
                        Grid.Row="1"
                        Grid.Column="0"
                        Margin="0,7,0,0"
                        Text="Maximum:" />
                    <NumberBox
                        x:Name="MaximumValue"
                        Grid.Row="1"
                        Grid.Column="1"
                        Margin="10,5,0,0"
                        AutomationProperties.AccessibilityView="Raw"
                        AutomationProperties.Name="Maximum"
                        SpinButtonPlacementMode="Compact"
                        Value="1000" />

                    <TextBlock
                        x:Name="StepFrequencyLabel"
                        Grid.Row="2"
                        Grid.Column="0"
                        Margin="0,5,0,0"
                        Text="StepFrequency:" />
                    <NumberBox
                        x:Name="StepFrequencyValue"
                        Grid.Row="2"
                        Grid.Column="1"
                        Margin="10,5,0,0"
                        AutomationProperties.AccessibilityView="Raw"
                        AutomationProperties.Name="Step Frequency"
                        Minimum="1"
                        SpinButtonPlacementMode="Compact"
                        Value="10" />

                    <TextBlock
                        x:Name="SmallChangeLabel"
                        Grid.Row="3"
                        Grid.Column="0"
                        Margin="0,5,0,0"
                        Text="SmallChange:" />
                    <NumberBox
                        x:Name="SmallChangeValue"
                        Grid.Row="3"
                        Grid.Column="1"
                        Margin="10,5,0,0"
                        AutomationProperties.AccessibilityView="Raw"
                        AutomationProperties.Name="Small Change"
                        SpinButtonPlacementMode="Compact"
                        Value="10" />
                </Grid>
            </controls:ControlExample.Options>
            <controls:ControlExample.Example>
                <StackPanel
                    x:Name="Control2"
                    VerticalAlignment="Center"
                    Orientation="Horizontal">
                    <Slider
                        x:Name="Slider2"
                        Width="200"
                        Margin="0,0,10,0"
                        Header="Control header"
                        Maximum="{x:Bind MaximumValue.Value, Mode=OneWay}"
                        Minimum="{x:Bind MinimumValue.Value, Mode=OneWay}"
                        SmallChange="{x:Bind SmallChangeValue.Value, Mode=OneWay}"
                        StepFrequency="{x:Bind StepFrequencyValue.Value, Mode=OneWay}"
                        Value="800" />
                </StackPanel>
            </controls:ControlExample.Example>
            <controls:ControlExample.Output>
                <TextBlock Text="{x:Bind Slider2.Value.ToString(), Mode=OneWay}" />
            </controls:ControlExample.Output>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="MinimumValue" Value="{x:Bind MinimumValue.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="MaximumValue" Value="{x:Bind MaximumValue.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="StepFrequencyValue" Value="{x:Bind StepFrequencyValue.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="SmallChangeValue" Value="{x:Bind SmallChangeValue.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="Value" Value="{x:Bind Slider2.Value, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <!--  SLIDER WITH TICK MARKS  -->
        <controls:ControlExample x:Name="Example3" SampleDefinition="Slider\SliderTicks.txt">
            <StackPanel Orientation="Horizontal">
                <Slider
                    x:Name="Slider3"
                    Width="290"
                    AutomationProperties.Name="Slider with ticks"
                    TickFrequency="20"
                    TickPlacement="Outside" />
            </StackPanel>
            <controls:ControlExample.Output>
                <TextBlock Text="{x:Bind Slider3.Value.ToString(), Mode=OneWay}" />
            </controls:ControlExample.Output>
            <controls:ControlExample.Options>
                <StackPanel>
                    <RadioButtons
                        x:Name="SnapsToRadioButtons"
                        Header="Snaps to:"
                        SelectedIndex="0"
                        SelectionChanged="SnapsToRadioButtons_SelectionChanged">
                        <x:String>StepValues</x:String>
                        <x:String>Ticks</x:String>
                    </RadioButtons>
                </StackPanel>
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="SnapsTo" Value="{x:Bind SnapsToRadioButtons.SelectedItem, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <!--  VERTICAL SLIDER  -->
        <controls:ControlExample x:Name="Example4" SampleDefinition="Slider\SliderVertical.txt">
            <StackPanel Orientation="Horizontal">
                <Slider
                    x:Name="Slider4"
                    Width="100"
                    Height="100"
                    AutomationProperties.Name="vertical slider"
                    Maximum="50"
                    Minimum="-50"
                    Orientation="Vertical"
                    TickFrequency="10"
                    TickPlacement="Outside" />
            </StackPanel>
            <controls:ControlExample.Output>
                <TextBlock Text="{x:Bind Slider4.Value.ToString(), Mode=OneWay}" />
            </controls:ControlExample.Output>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (SliderPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Controls.Primitives;

namespace WinUIGallery.ControlPages;

public sealed partial class SliderPage : Page
{
    public SliderPage()
    {
        this.InitializeComponent();
    }

    private void SnapsToRadioButtons_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        switch (SnapsToRadioButtons.SelectedItem)
        {
            case "StepValues":
                Slider3.SnapsTo = SliderSnapsTo.StepValues;
                break;
            default:
                Slider3.SnapsTo = SliderSnapsTo.Ticks;
                break;
        }
    }
}

```

## 示例文件

### SliderRange.txt
```
--- header
A Slider with range and steps specified.
--- xaml
<Slider Width="200" Minimum="$(MinimumValue)" Maximum="$(MaximumValue)" StepFrequency="$(StepFrequencyValue)"
        SmallChange="$(SmallChangeValue)" Value="$(Value)" />
```

### SliderSimple.txt
```
--- header
A simple Slider.
--- xaml
<Slider AutomationProperties.Name="simple slider" Width="200"/>
```

### SliderTicks.txt
```
--- header
A Slider with tick marks.
--- xaml
<Slider
     AutomationProperties.Name="Slider with ticks"
     TickFrequency="20"
     TickPlacement="Outside"
     SnapsTo="$(SnapsTo)" />
```

### SliderVertical.txt
```
--- header
A vertical slider with range and tick marks specified.
--- xaml
<Slider AutomationProperties.Name="vertical slider" Width="100" Orientation="Vertical"
    TickFrequency="10" TickPlacement="Outside" Maximum="50" Minimum="-50"/>
```


# ToggleSwitch

## 主页面 XAML (ToggleSwitchPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.ToggleSwitchPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="ToggleSwitch\ToggleSwitchSimple.txt">
            <ToggleSwitch AutomationProperties.Name="simple ToggleSwitch" />
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="ToggleSwitch\ToggleSwitchCustom.txt">
            <StackPanel Orientation="Horizontal">
                <ToggleSwitch
                    x:Name="ToggleSwitch2"
                    Header="Toggle work"
                    IsOn="True"
                    OffContent="Do work"
                    OnContent="Working" />
                <ProgressRing Width="32" IsActive="{x:Bind ToggleSwitch2.IsOn, Mode=OneWay}" />
            </StackPanel>

            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution
                    Key="isOn"
                    IsEnabled="{x:Bind ToggleSwitch2.IsOn, Mode=OneWay}"
                    Value="True" />
                <controls:ControlExampleSubstitution
                    Key="isOff"
                    IsEnabled="{x:Bind ToggleSwitch2.IsOn.Equals(x:False), Mode=OneWay}"
                    Value="False" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (ToggleSwitchPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class ToggleSwitchPage : Page
{
    public ToggleSwitchPage()
    {
        this.InitializeComponent();
    }
}

```

## 示例文件

### ToggleSwitchCustom.txt
```
--- header
A ToggleSwitch with custom header and content.
--- xaml
<StackPanel Orientation="Horizontal">
    <ToggleSwitch Header="Toggle work" OffContent="Do work" OnContent="Working" IsOn="$(isOn)$(isOff)" />
    <ProgressRing IsActive="{x:Bind ToggleSwitch2.IsOn, Mode=OneWay}" Width="32"/>
</StackPanel>
```

### ToggleSwitchSimple.txt
```
--- header
A simple ToggleSwitch.
--- xaml
<ToggleSwitch AutomationProperties.Name="simple ToggleSwitch"/>
```



# 分组: Collections

---

# FlipView

## 主页面 XAML (FlipViewPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<pages:ItemsPageBase
    x:Class="WinUIGallery.ControlPages.FlipViewPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:models="using:WinUIGallery.Models"
    xmlns:pages="using:WinUIGallery.Pages">
    <StackPanel>
        <controls:ControlExample
            x:Name="Example1"
            ExampleHeight="Auto"
            SampleDefinition="FlipView\SimpleFlipviewItemsDeclared.txt">
            <controls:ControlExample.Example>
                <FlipView
                    Height="270"
                    MaxWidth="400"
                    AutomationProperties.AutomationControlType="List"
                    AutomationProperties.LocalizedControlType="list">
                    <Image AutomationProperties.Name="Cliff" Source="ms-appx:///Assets/SampleMedia/cliff.jpg" />
                    <Image AutomationProperties.Name="Grapes" Source="ms-appx:///Assets/SampleMedia/grapes.jpg" />
                    <Image AutomationProperties.Name="Rainier" Source="ms-appx:///Assets/SampleMedia/rainier.jpg" />
                    <Image AutomationProperties.Name="Sunset" Source="ms-appx:///Assets/SampleMedia/sunset.jpg" />
                    <Image AutomationProperties.Name="Valley" Source="ms-appx:///Assets/SampleMedia/valley.jpg" />
                </FlipView>
            </controls:ControlExample.Example>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example2" SampleDefinition="FlipView\FlipviewShowingBoundData.txt">
            <controls:ControlExample.Example>
                <FlipView
                    Height="180"
                    MaxWidth="400"
                    AutomationProperties.AutomationControlType="List"
                    AutomationProperties.LocalizedControlType="list"
                    BorderBrush="Black"
                    BorderThickness="1"
                    ItemsSource="{x:Bind Items, Mode=OneWay}">
                    <FlipView.ItemTemplate>
                        <DataTemplate x:DataType="models:ControlInfoDataItem">
                            <Grid>
                                <Grid.RowDefinitions>
                                    <RowDefinition Height="*" />
                                    <RowDefinition Height="Auto" />
                                </Grid.RowDefinitions>
                                <Image
                                    Width="36"
                                    VerticalAlignment="Center"
                                    Source="{x:Bind ImagePath}"
                                    Stretch="Uniform" />
                                <Border
                                    Grid.Row="1"
                                    Height="60"
                                    Background="#A5FFFFFF">
                                    <TextBlock
                                        x:Name="Control2Text"
                                        Padding="12,12"
                                        HorizontalAlignment="Center"
                                        Foreground="Black"
                                        Style="{StaticResource TitleTextBlockStyle}"
                                        Text="{x:Bind Title}" />
                                </Border>
                            </Grid>
                        </DataTemplate>
                    </FlipView.ItemTemplate>
                </FlipView>
            </controls:ControlExample.Example>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example3" SampleDefinition="FlipView\VerticalFlipview.txt">
            <controls:ControlExample.Example>
                <FlipView
                    Height="270"
                    MaxWidth="400"
                    AutomationProperties.AutomationControlType="List"
                    AutomationProperties.LocalizedControlType="list">
                    <Image AutomationProperties.Name="Cliff" Source="ms-appx:///Assets/SampleMedia/cliff.jpg" />
                    <Image AutomationProperties.Name="Grapes" Source="ms-appx:///Assets/SampleMedia/grapes.jpg" />
                    <Image AutomationProperties.Name="Rainier" Source="ms-appx:///Assets/SampleMedia/rainier.jpg" />
                    <Image AutomationProperties.Name="Sunset" Source="ms-appx:///Assets/SampleMedia/sunset.jpg" />
                    <Image AutomationProperties.Name="Valley" Source="ms-appx:///Assets/SampleMedia/valley.jpg" />
                    <FlipView.ItemsPanel>
                        <ItemsPanelTemplate>
                            <VirtualizingStackPanel Orientation="Vertical" />
                        </ItemsPanelTemplate>
                    </FlipView.ItemsPanel>
                </FlipView>
            </controls:ControlExample.Example>
        </controls:ControlExample>
    </StackPanel>
</pages:ItemsPageBase>

```

## 主页面 C# (FlipViewPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Navigation;
using System.Linq;
using WinUIGallery.Helpers;
using WinUIGallery.Pages;

namespace WinUIGallery.ControlPages;

public sealed partial class FlipViewPage : ItemsPageBase
{
    public FlipViewPage()
    {
        this.InitializeComponent();
    }

    protected override void OnNavigatedTo(NavigationEventArgs e)
    {
        base.OnNavigatedTo(e);

        Items = ControlInfoDataSource.Instance.Groups.Take(3).SelectMany(g => g.Items).ToList();
    }
}

```

## 示例文件

### FlipviewShowingBoundData.txt
```
--- header
A FlipView showing bound data with a data template.
--- xaml
<FlipView MaxWidth="400" Height="180" BorderBrush="Black" BorderThickness="1"
          AutomationProperties.AutomationControlType="List"
          AutomationProperties.LocalizedControlType="list"
          ItemsSource="{x:Bind Items, Mode=OneWay}">
    <FlipView.ItemTemplate>
        <DataTemplate x:DataType="data:ControlInfoDataItem">
            <Grid>
                <Image Height="120" Source="{x:Bind ImagePath}" Stretch="Uniform" VerticalAlignment="Top"/>
                <Border Background="#A5FFFFFF" Height="60" VerticalAlignment="Bottom">
                <TextBlock Text="{x:Bind Title}" Foreground="#CCFFFFFF" Padding="12,12" Style="{StaticResource TitleTextBlockStyle}" HorizontalAlignment="Center"/>
                </Border>
            </Grid>
        </DataTemplate>
    </FlipView.ItemTemplate>
</FlipView>
```

### SimpleFlipviewItemsDeclared.txt
```
--- header
A simple FlipView with items declared inline.
--- xaml
<FlipView MaxWidth="400" Height="270"
          AutomationProperties.AutomationControlType="List"
          AutomationProperties.LocalizedControlType="list">
    <Image Source="ms-appx:///Assets/SampleMedia/cliff.jpg" AutomationProperties.Name="Cliff"/>
    <Image Source="ms-appx:///Assets/SampleMedia/grapes.jpg" AutomationProperties.Name="Grapes"/>
    <Image Source="ms-appx:///Assets/SampleMedia/rainier.jpg" AutomationProperties.Name="Rainier"/>
    <Image Source="ms-appx:///Assets/SampleMedia/sunset.jpg" AutomationProperties.Name="Sunset"/>
    <Image Source="ms-appx:///Assets/SampleMedia/valley.jpg" AutomationProperties.Name="Valley"/>
</FlipView>
```

### VerticalFlipview.txt
```
--- header
Vertical FlipView
--- xaml
<FlipView MaxWidth="400" Height="270"
          AutomationProperties.AutomationControlType="List"
          AutomationProperties.LocalizedControlType="list">
    <Image Source="ms-appx:///Assets/SampleMedia/cliff.jpg" AutomationProperties.Name="Cliff"/>
    <Image Source="ms-appx:///Assets/SampleMedia/grapes.jpg" AutomationProperties.Name="Grapes"/>
    <Image Source="ms-appx:///Assets/SampleMedia/rainier.jpg" AutomationProperties.Name="Rainier"/>
    <Image Source="ms-appx:///Assets/SampleMedia/sunset.jpg" AutomationProperties.Name="Sunset"/>
    <Image Source="ms-appx:///Assets/SampleMedia/valley.jpg" AutomationProperties.Name="Valley"/>
        <FlipView.ItemsPanel >
            <ItemsPanelTemplate>
                <VirtualizingStackPanel Orientation="Vertical"/>
            </ItemsPanelTemplate>
        </FlipView.ItemsPanel>
<FlipView>
```


# GridView

## 主页面 XAML (GridViewPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<pages:ItemsPageBase
    x:Class="WinUIGallery.ControlPages.GridViewPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:local="using:WinUIGallery.ControlPages"
    xmlns:pages="using:WinUIGallery.Pages">

    <Page.Resources>
        <DataTemplate x:Key="ImageTemplate" x:DataType="local:CustomDataObject">
            <Image
                Width="190"
                Height="130"
                AutomationProperties.AccessibilityView="Raw"
                AutomationProperties.Name="{x:Bind Title}"
                Source="{x:Bind ImageLocation}"
                Stretch="UniformToFill" />
        </DataTemplate>

        <DataTemplate x:Key="IconTextTemplate" x:DataType="local:CustomDataObject">
            <RelativePanel
                Width="280"
                MinHeight="160"
                AutomationProperties.Name="{x:Bind Title}">
                <Image
                    x:Name="image"
                    Width="18"
                    Margin="0,4,0,0"
                    RelativePanel.AlignLeftWithPanel="True"
                    RelativePanel.AlignTopWithPanel="True"
                    Source="{x:Bind ImageLocation}"
                    Stretch="Uniform" />
                <TextBlock
                    x:Name="title"
                    Margin="8,0,0,0"
                    RelativePanel.AlignTopWithPanel="True"
                    RelativePanel.RightOf="image"
                    Style="{StaticResource BaseTextBlockStyle}"
                    Text="{x:Bind Title}" />
                <TextBlock
                    Margin="0,4,8,0"
                    RelativePanel.Below="title"
                    Style="{StaticResource CaptionTextBlockStyle}"
                    Text="{x:Bind Description}"
                    TextTrimming="WordEllipsis"
                    TextWrapping="Wrap" />
            </RelativePanel>
        </DataTemplate>

        <DataTemplate x:Key="ImageTextTemplate" x:DataType="local:CustomDataObject">
            <Grid Width="280" AutomationProperties.Name="{x:Bind Title}">
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="Auto" />
                    <ColumnDefinition Width="*" />
                </Grid.ColumnDefinitions>
                <Image
                    Height="100"
                    VerticalAlignment="Top"
                    Source="{x:Bind ImageLocation}"
                    Stretch="Fill" />
                <StackPanel Grid.Column="1" Margin="8,0,0,8">
                    <TextBlock
                        Margin="0,0,0,8"
                        Style="{ThemeResource SubtitleTextBlockStyle}"
                        Text="{x:Bind Title}" />
                    <StackPanel Orientation="Horizontal">
                        <TextBlock Style="{ThemeResource CaptionTextBlockStyle}" Text="{x:Bind Views}" />
                        <TextBlock Style="{ThemeResource CaptionTextBlockStyle}" Text=" Views " />
                    </StackPanel>
                    <StackPanel Orientation="Horizontal">
                        <TextBlock Style="{ThemeResource CaptionTextBlockStyle}" Text="{x:Bind Likes}" />
                        <TextBlock Style="{ThemeResource CaptionTextBlockStyle}" Text=" Likes" />
                    </StackPanel>
                </StackPanel>
            </Grid>
        </DataTemplate>

        <DataTemplate x:Key="TextTemplate" x:DataType="local:CustomDataObject">
            <StackPanel Width="240" Orientation="Horizontal">
                <TextBlock
                    Margin="8,0,0,0"
                    Style="{StaticResource TitleTextBlockStyle}"
                    Text="{x:Bind Title}" />
            </StackPanel>
        </DataTemplate>

        <DataTemplate x:Key="ImageOverlayTemplate" x:DataType="local:CustomDataObject">
            <Grid Width="100" AutomationProperties.Name="{x:Bind Title}">
                <Image Source="{x:Bind ImageLocation}" Stretch="UniformToFill" />
                <StackPanel
                    Height="40"
                    Padding="5,1,5,1"
                    VerticalAlignment="Bottom"
                    Background="{ThemeResource SystemControlBackgroundBaseMediumBrush}"
                    Opacity=".75"
                    Orientation="Vertical">
                    <TextBlock Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Text="{x:Bind Title}" />
                    <StackPanel Orientation="Horizontal">
                        <TextBlock
                            Foreground="{ThemeResource SystemControlForegroundAltHighBrush}"
                            Style="{ThemeResource CaptionTextBlockStyle}"
                            Text="{x:Bind Likes}" />
                        <TextBlock
                            Foreground="{ThemeResource SystemControlForegroundAltHighBrush}"
                            Style="{ThemeResource CaptionTextBlockStyle}"
                            Text=" Likes" />
                    </StackPanel>
                </StackPanel>
            </Grid>
        </DataTemplate>
    </Page.Resources>

    <StackPanel>
        <controls:ControlExample
            SampleDefinition="GridView\BasicGridviewSimpleDatatemplate.txt">
            <StackPanel>
                <TextBlock Margin="0,0,0,15">
                    This is a basic GridView that has the full source code below.<LineBreak />
                    Other samples on this page display only the additional markup needed to customize the specific GridView.</TextBlock>
                <GridView
                    x:Name="BasicGridView"
                    IsItemClickEnabled="True"
                    ItemClick="BasicGridView_ItemClick"
                    ItemTemplate="{StaticResource ImageTemplate}"
                    SelectionMode="Single" />
                <TextBlock x:Name="ClickOutput0" Style="{StaticResource OutputTextBlockStyle}" />
            </StackPanel>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="GridView\GridviewLayoutCustomization.txt">
            <StackPanel>
                <TextBlock Margin="0,0,0,15" TextWrapping="Wrap">
                    Use the options on the right to control different layout customizations to the GridView below.
                </TextBlock>
                <GridView x:Name="StyledGrid" ItemTemplate="{StaticResource ImageOverlayTemplate}">
                    <GridView.ItemContainerStyle>
                        <Style BasedOn="{StaticResource DefaultGridViewItemStyle}" TargetType="GridViewItem">
                            <Setter Property="Margin" Value="5" />
                        </Style>
                    </GridView.ItemContainerStyle>

                    <GridView.ItemsPanel>
                        <ItemsPanelTemplate>
                            <ItemsWrapGrid
                                x:Name="MaxItemsWrapGrid"
                                Loaded="StyledGrid_InitWrapGrid"
                                MaximumRowsOrColumns="3"
                                Orientation="Horizontal" />
                        </ItemsPanelTemplate>
                    </GridView.ItemsPanel>

                </GridView>
            </StackPanel>

            <controls:ControlExample.Options>
                <StackPanel>
                    <StackPanel.Resources>
                        <Style x:Key="DefaultNumberBoxStyle" TargetType="NumberBox">
                            <Setter Property="SpinButtonPlacementMode" Value="Inline" />
                            <Setter Property="SmallChange" Value="1" />
                            <Setter Property="HorizontalAlignment" Value="Stretch" />
                            <Setter Property="HorizontalContentAlignment" Value="Stretch" />
                            <Setter Property="MaxWidth" Value="250" />
                            <Setter Property="Margin" Value="0,0,0,16" />
                        </Style>
                    </StackPanel.Resources>

                    <NumberBox
                        x:Name="ColumnSpace"
                        AutomationProperties.Name="Space between columns"
                        Header="Space between columns"
                        Maximum="100"
                        Minimum="0"
                        Style="{ThemeResource DefaultNumberBoxStyle}"
                        ValueChanged="NumberBox_ValueChanged"
                        Value="5" />

                    <NumberBox
                        x:Name="RowSpace"
                        AutomationProperties.Name="Space between rows"
                        Header="Space between rows"
                        Maximum="100"
                        Minimum="0"
                        Style="{ThemeResource DefaultNumberBoxStyle}"
                        ValueChanged="NumberBox_ValueChanged"
                        Value="5" />

                    <NumberBox
                        x:Name="WrapItemCount"
                        AutomationProperties.Name="Maximum number of items before wrapping"
                        Header="Maximum number of items before wrapping"
                        Maximum="8"
                        Minimum="1"
                        Style="{ThemeResource DefaultNumberBoxStyle}"
                        ValueChanged="NumberBox_ValueChanged"
                        Value="3" />

                </StackPanel>
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="ColMargin" Value="{x:Bind ColumnSpace.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="RowMargin" Value="{x:Bind RowSpace.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="MaxItems" Value="{x:Bind WrapItemCount.Value, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="GridView\ContentInsideGridview.txt">
            <Grid>
                <Grid.RowDefinitions>
                    <RowDefinition />
                    <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>

                <GridView
                    x:Name="ContentGridView"
                    AllowDrop="{x:Bind DropCheckBox.IsChecked.Value, Mode=OneWay}"
                    CanDragItems="{x:Bind DragCheckBox.IsChecked.Value, Mode=OneWay}"
                    CanReorderItems="{x:Bind ReorderCheckBox.IsChecked.Value, Mode=OneWay}"
                    FlowDirection="LeftToRight"
                    IsItemClickEnabled="{x:Bind ItemClickCheckBox.IsChecked.Value, Mode=OneWay}"
                    ItemClick="ContentGridView_ItemClick"
                    ItemTemplate="{StaticResource ImageTemplate}"
                    SelectionChanged="ContentGridView_SelectionChanged" />

                <StackPanel Grid.Row="1">
                    <TextBlock x:Name="ClickOutput" Style="{StaticResource OutputTextBlockStyle}" />
                    <TextBlock x:Name="SelectionOutput" Style="{StaticResource OutputTextBlockStyle}" />
                </StackPanel>

            </Grid>
            <controls:ControlExample.Options>
                <StackPanel x:Name="Control2">
                    <RadioButtons Header="ItemTemplate">
                        <RadioButton
                            Checked="ItemTemplate_Checked"
                            Content="Image"
                            GroupName="Template"
                            IsChecked="True"
                            Tag="ImageTemplate" />
                        <RadioButton
                            Checked="ItemTemplate_Checked"
                            Content="Icon/Text"
                            GroupName="Template"
                            Tag="IconTextTemplate" />
                        <RadioButton
                            Checked="ItemTemplate_Checked"
                            Content="Image/Text"
                            GroupName="Template"
                            Tag="ImageTextTemplate" />
                        <RadioButton
                            Checked="ItemTemplate_Checked"
                            Content="Text"
                            GroupName="Template"
                            Tag="TextTemplate" />
                    </RadioButtons>
                    <StackPanel>
                        <ToggleButton
                            Margin="0,8,0,0"
                            Click="FlowDirectionCheckBox_Click"
                            Content="Reverse FlowDirection" />
                        <TextBlock Margin="0,18,0,10" Text="GridView Properties" />
                        <TextBlock
                            MaxWidth="150"
                            FontSize="13"
                            TextWrapping="Wrap">
                            In order to drag, drop, and reorder items within the GridView, make sure the last three boxes are checked below.<LineBreak /></TextBlock>
                        <TextBlock
                            MaxWidth="150"
                            FontSize="13"
                            TextWrapping="Wrap">
                            Turning on IsItemClickEnabled will allow the user to click on an item (and print output below the GridView), regardless of selection mode.<LineBreak /></TextBlock>
                        <CheckBox
                            x:Name="ItemClickCheckBox"
                            Click="ItemClickCheckBox_Click"
                            Content="IsItemClickEnabled" />
                        <CheckBox x:Name="DragCheckBox" Content="CanDragItems" />
                        <CheckBox x:Name="ReorderCheckBox" Content="CanReorderItems" />
                        <CheckBox x:Name="DropCheckBox" Content="AllowDrop" />
                        <ComboBox
                            Margin="0,12,0,0"
                            Header="SelectionMode"
                            SelectedIndex="1"
                            SelectionChanged="SelectionModeComboBox_SelectionChanged">
                            <x:String>None</x:String>
                            <x:String>Single</x:String>
                            <x:String>Multiple</x:String>
                            <x:String>Extended</x:String>
                        </ComboBox>
                    </StackPanel>
                </StackPanel>
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution
                    Key="ItemTemplate"
                    x:Name="itemTemplate"
                    Value="ImageTemplate" />
                <controls:ControlExampleSubstitution Key="IsItemClickEnabled" Value="{x:Bind ContentGridView.IsItemClickEnabled, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="CanDragItems" Value="{x:Bind ContentGridView.CanDragItems, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="CanDropItems" Value="{x:Bind ContentGridView.AllowDrop, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="CanReorderItems" Value="{x:Bind ContentGridView.CanReorderItems, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="SelectionMode" Value="{x:Bind ContentGridView.SelectionMode, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="FlowDirection" Value="{x:Bind ContentGridView.FlowDirection, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="DisplayDT" x:Name="DisplayDT" />

            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</pages:ItemsPageBase>

```

## 主页面 C# (GridViewPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Navigation;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using WinUIGallery.Pages;

namespace WinUIGallery.ControlPages;

public sealed partial class GridViewPage : ItemsPageBase
{
    ItemsWrapGrid? StyledGridIWG;

    public GridViewPage()
    {
        this.InitializeComponent();
        this.DataContext = this;
    }

    protected override void OnNavigatedTo(NavigationEventArgs e)
    {
        base.OnNavigatedTo(e);

        // Get data objects and place them into an ObservableCollection
        List<CustomDataObject> tempList = CustomDataObject.GetDataObjects();
        ObservableCollection<CustomDataObject> Items = new ObservableCollection<CustomDataObject>(tempList);
        ObservableCollection<CustomDataObject> Items2 = new ObservableCollection<CustomDataObject>(tempList);
        BasicGridView.ItemsSource = Items2;
        ContentGridView.ItemsSource = Items;
        StyledGrid.ItemsSource = Items;

        DisplayDT.Value = @"<!-- ImageTemplate: -->
<DataTemplate x:Key='ImageTemplate' x:DataType='local: CustomDataObject'>
    <Image Stretch = 'UniformToFill' Source = '{x:Bind ImageLocation}' 
           AutomationProperties.Name = '{x:Bind Title}' Width = '190' Height = '130' 
           AutomationProperties.AccessibilityView = 'Raw'/>
</DataTemplate> ";

    }

    private void ItemTemplate_Checked(object sender, RoutedEventArgs e)
    {
        object? tag = (sender as FrameworkElement)?.Tag;
        if (tag != null)
        {
            string? template = tag.ToString();
            ContentGridView.ItemTemplate = (DataTemplate)this.Resources[template];
            itemTemplate.Value = template;

            if (template == "ImageTemplate")
            {
                DisplayDT.Value = @"<!-- ImageTemplate: -->
<DataTemplate x:Key='ImageTemplate' x:DataType='local: CustomDataObject'>
    <Image Stretch = 'UniformToFill' Source = '{x:Bind ImageLocation}' 
           AutomationProperties.Name = '{x:Bind Title}' Width = '190' Height = '130' 
           AutomationProperties.AccessibilityView = 'Raw'/>
</DataTemplate> ";
            }

            else if (template == "IconTextTemplate")
            {
                DisplayDT.Value = @"<!-- IconTextTemplate: -->
<DataTemplate x:Key='IconTextTemplate' x:DataType='local:CustomDataObject'>
    <RelativePanel AutomationProperties.Name='{x:Bind Title}' Width='280' MinHeight='160'>
        <Image x:Name='image'
               Width='18'
               Margin='0,4,0,0'
               RelativePanel.AlignLeftWithPanel='True'
               RelativePanel.AlignTopWithPanel='True'
               Source='{x:Bind ImageLocation}'
               Stretch='Uniform' />
        <TextBlock x:Name='title' Style='{StaticResource BaseTextBlockStyle}' Margin='8,0,0,0' 
                   Text='{x:Bind Title}' RelativePanel.RightOf='image' RelativePanel.AlignTopWithPanel='True'/>
        <TextBlock Text='{x:Bind Description}' Style='{StaticResource CaptionTextBlockStyle}' 
                   TextWrapping='Wrap' Margin='0,4,8,0' RelativePanel.Below='title' TextTrimming='WordEllipsis'/>
    </RelativePanel>
</DataTemplate>";
            }

            else if (template == "ImageTextTemplate")
            {
                DisplayDT.Value = @"<!-- ImageTextTemplate: -->
<DataTemplate x: Key = 'ImageTextTemplate' x: DataType = 'local:CustomDataObject'>
    <Grid AutomationProperties.Name = '{x:Bind Title}' Width = '280'>
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width = 'Auto'/>
                <ColumnDefinition Width = '*'/>
        </Grid.ColumnDefinitions>
        <Image Source = '{x:Bind ImageLocation}' Height = '100' Stretch = 'Fill' VerticalAlignment = 'Top'/>
        <StackPanel Grid.Column = '1' Margin = '8,0,0,8'>
            <TextBlock Text = '{x:Bind Title}' Style = '{ThemeResource SubtitleTextBlockStyle}' Margin = '0,0,0,8'/>
            <StackPanel Orientation = 'Horizontal'>
                <TextBlock Text = '{x:Bind Views}' Style = '{ThemeResource CaptionTextBlockStyle}'/>
                    <TextBlock Text = ' Views ' Style = '{ThemeResource CaptionTextBlockStyle}'/>
            </StackPanel>
            <StackPanel Orientation = 'Horizontal'>
                    <TextBlock Text = '{x:Bind Likes}' Style = '{ThemeResource CaptionTextBlockStyle}'/> 
                    <TextBlock Text = ' Likes' Style = '{ThemeResource CaptionTextBlockStyle}'/>
            </StackPanel>
        </StackPanel>
     </Grid>
</DataTemplate>";
            }

            else
            {
                DisplayDT.Value = @"<!-- TextTemplate: -->
<DataTemplate x:Key='TextTemplate' x:DataType='local: CustomDataObject'>
    <StackPanel Width = '240' Orientation = 'Horizontal'>
        <TextBlock Style = '{StaticResource TitleTextBlockStyle}' Margin = '8,0,0,0' Text = '{x:Bind Title}'/>
            </StackPanel>
</DataTemplate>";
            }
        }
    }

    private void ContentGridView_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (sender is GridView gridView)
        {
            SelectionOutput.Text = string.Format("You have selected {0} item(s).", gridView.SelectedItems.Count);
        }
    }

    private void ContentGridView_ItemClick(object sender, ItemClickEventArgs e)
    {
        if (e.ClickedItem is not CustomDataObject clickedItem)
        {
            return;
        }

        ClickOutput.Text = "You clicked " + clickedItem.Title + ".";
    }

    private void BasicGridView_ItemClick(object sender, ItemClickEventArgs e)
    {
        if (e.ClickedItem is not CustomDataObject clickedItem)
        {
            return;
        }

        ClickOutput0.Text = "You clicked " + clickedItem.Title + ".";
    }

    private void ItemClickCheckBox_Click(object sender, RoutedEventArgs e)
    {
        ClickOutput.Text = string.Empty;
    }

    private void FlowDirectionCheckBox_Click(object sender, RoutedEventArgs e)
    {
        if (ContentGridView.FlowDirection == FlowDirection.LeftToRight)
        {
            ContentGridView.FlowDirection = FlowDirection.RightToLeft;
        }
        else
        {
            ContentGridView.FlowDirection = FlowDirection.LeftToRight;
        }
    }

    private void SelectionModeComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (ContentGridView != null)
        {
            string? colorName = e.AddedItems[0].ToString();
            switch (colorName)
            {
                case "None":
                    ContentGridView.SelectionMode = ListViewSelectionMode.None;
                    SelectionOutput.Text = string.Empty;
                    break;
                case "Single":
                    ContentGridView.SelectionMode = ListViewSelectionMode.Single;
                    break;
                case "Multiple":
                    ContentGridView.SelectionMode = ListViewSelectionMode.Multiple;
                    break;
                case "Extended":
                    ContentGridView.SelectionMode = ListViewSelectionMode.Extended;
                    break;
            }
        }
    }

    private void StyledGrid_InitWrapGrid(object sender, RoutedEventArgs e)
    {
        if (sender is not ItemsWrapGrid itemsWrapGrid)
        {
            return;
        }

        // Update ItemsWrapGrid object created on page load by assigning it to StyledGrid's ItemWrapGrid
        StyledGridIWG = itemsWrapGrid;

        // Now we can change StyledGrid's MaximumRowsorColumns property within its ItemsPanel>ItemsPanelTemplate>ItemsWrapGrid.
        StyledGridIWG.MaximumRowsOrColumns = 3;
    }


    private void NumberBox_ValueChanged(Microsoft.UI.Xaml.Controls.NumberBox sender, Microsoft.UI.Xaml.Controls.NumberBoxValueChangedEventArgs args)
    {
        if (StyledGridIWG == null) { return; }

        // Only update either max-row value or margins
        if (sender == WrapItemCount)
        {
            StyledGridIWG.MaximumRowsOrColumns = (int)WrapItemCount.Value;
            return;
        }

        int rowSpace = (int)RowSpace.Value;
        int columnSpace = (int)ColumnSpace.Value;
        for (int i = 0; i < StyledGrid.Items.Count; i++)
        {
            if (StyledGrid.ContainerFromIndex(i) is not GridViewItem item)
            {
                continue;
            }

            Thickness NewMargin = item.Margin;
            NewMargin.Left = columnSpace;
            NewMargin.Top = rowSpace;
            NewMargin.Right = columnSpace;
            NewMargin.Bottom = rowSpace;

            item.Margin = NewMargin;
        }
    }
}

```

## 示例文件

### BasicGridviewSimpleDatatemplate.txt
```
--- header
Basic GridView with Simple DataTemplate
--- xaml
<!-- XAML Code -->

<GridView
    x:Name="BasicGridView"
    ItemTemplate="{StaticResource ImageTemplate}"
    IsItemClickEnabled="True"
    ItemClick="BasicGridView_ItemClick"
    SelectionMode="Single"/>
                    
<DataTemplate x:Key="ImageTemplate" x:DataType="local:CustomDataObject">
     <Image Stretch="UniformToFill" Source="{x:Bind ImageLocation}" Width="190" Height="130"/>
</DataTemplate>
                    
<!-- In this example, the GridView's ItemTemplate property is bound to a data template (shown above)
called ImageTemplate, defined in the Page.Resources section of the XAML file. 
                    
The data template is defined to display an object of type CustomDataObject, which is created from a class
that's defined in the code-behind (see code below).
                    
The ItemsSource for the GridView is an ObservableCollection<CustomDataObject> called Items and
is defined in the C# code-behind. It is bound to the GridView's ItemsSource property in the code-behind.
                    
The IsItemClickEnabled property allows items to be clicked, and a function called BasicGridView_ItemClick 
is called when an item is clicked. This function is defined in the C# code-behind and simply outputs 
the title of the selected item into a TextBlock below the GridView. -->
--- c#
// C# Code

// CustomDataObject class definition: 
public class CustomDataObject
{
    public string Title { get; set; } = string.Empty;
    public string ImageLocation { get; set; } = string.Empty;
    public string Views { get; set; } = string.Empty;
    public string Likes { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public CustomDataObject()
    {
    }

	
    // ... Methods ...
}
```

### ContentInsideGridview.txt
```
--- header
Content inside of a GridView.
--- xaml
<!-- The GridView used for this sample is shown below, with all of the necessary added properties. -->
<GridView 
    x:Name="ContentGridView"
    ItemsSource="{x:Bind Items}"
    ItemTemplate="{StaticResource $(ItemTemplate)}"
    IsItemClickEnabled="$(IsItemClickEnabled)"
    CanDragItems="$(CanDragItems)"
    AllowDrop="$(CanDropItems)"
    CanReorderItems="$(CanReorderItems)"
    SelectionMode="$(SelectionMode)"
    SelectionChanged="ContentGridView_SelectionChanged"
    ItemClick="ContentGridView_ItemClick" 
    FlowDirection="$(FlowDirection)"/>

<!-- ContentGridView_SelectionChanged and ContentGridView_ItemClick are functions defined in the code-behind
to handle the events of when a selection changes on the GridView and when an item is clicked. -->
                    
<!-- The data template bound to this GridView's ItemTemplate property is based on which one you
select from the options on the right. The currently selected DataTemplate is: -->

$(DisplayDT)
```

### GridviewLayoutCustomization.txt
```
--- header
GridView with Layout Customization
--- xaml
<!-- The GridView used for this example is shown below. Setter properties are used to customize 
some parts of the GridViewItems (i.e. the margins). -->
<GridView
    x:Name="StyledGrid"
    ItemTemplate="{StaticResource ImageOverlayTemplate}">

    <GridView.ItemContainerStyle>
        <Style TargetType="GridViewItem" BasedOn="{StaticResource DefaultGridViewItemStyle}">
            <Setter Property="Margin" Value="$(ColMargin), $(RowMargin), $(ColMargin), $(RowMargin)"/>
        </Style>
    </GridView.ItemContainerStyle>
                    
    <!-- An extra property also needs to be added to the GridView's ItemsWrapGrid. 
    The following sets the maximum # of items to show before wrapping.-->
    <GridView.ItemsPanel>
        <ItemsPanelTemplate>
            <ItemsWrapGrid x:Name="MaxItemsWrapGrid" 
                           MaximumRowsOrColumns="$(MaxItems)" 
                           Orientation="Horizontal"/>
        </ItemsPanelTemplate>
    </GridView.ItemsPanel>                  
</GridView>      
                    
<!-- In this example, the GridView's ItemTemplate property is bound to a data template (shown below)
called ImageOverlayTemplate, defined in the Page.Resources section of the XAML file. 
                    
The data template is defined to display a CustomDataObject object (same type as in above sample). -->
                    
<DataTemplate x:Name="ImageOverlayTemplate" x:DataType="local:CustomDataObject">
    <Grid Width="100">
        <Image Source="{x:Bind ImageLocation}" Stretch="UniformToFill"/>
        <StackPanel Orientation="Vertical" Height="40" VerticalAlignment="Bottom" Padding="5,1,5,1" 
                    Background="LightGray" Opacity=".75">
            <TextBlock Text="{x:Bind Title}"/>
            <StackPanel Orientation="Horizontal">
                <TextBlock Text="{x:Bind Likes}" Style="{ThemeResource CaptionTextBlockStyle}" 
                           Foreground="{ThemeResource SystemControlPageTextBaseMediumBrush}"/>
                <TextBlock Text=" Likes" Style="{ThemeResource CaptionTextBlockStyle}" 
                           Foreground="{ThemeResource SystemControlPageTextBaseMediumBrush}"/>
            </StackPanel>
        </StackPanel>
    </Grid>
</DataTemplate>
```


# ItemsRepeater

## 主页面 XAML (ItemsRepeaterPage.xaml)
```xaml
<pages:ItemsPageBase
    x:Class="WinUIGallery.ControlPages.ItemsRepeaterPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:layouts="using:WinUIGallery.Layouts"
    xmlns:local="using:WinUIGallery.ControlPages"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:pages="using:WinUIGallery.Pages"
    mc:Ignorable="d">

    <Page.Resources>
        <DataTemplate x:Key="HorizontalBarTemplate" x:DataType="local:Bar">
            <Border Width="{x:Bind MaxLength}" Background="{ThemeResource SystemChromeLowColor}">
                <Rectangle
                    Width="{x:Bind Length}"
                    Height="24"
                    HorizontalAlignment="Left"
                    Fill="{ThemeResource SystemAccentColor}" />
            </Border>
        </DataTemplate>

        <DataTemplate x:Key="VerticalBarTemplate" x:DataType="local:Bar">
            <Border Height="{x:Bind MaxHeight}" Background="{ThemeResource SystemChromeLowColor}">
                <Rectangle
                    Width="48"
                    Height="{x:Bind Height}"
                    VerticalAlignment="Top"
                    Fill="{ThemeResource SystemAccentColor}" />
            </Border>
        </DataTemplate>

        <DataTemplate x:Key="CircularTemplate" x:DataType="local:Bar">
            <Grid>
                <Ellipse
                    Width="{x:Bind MaxDiameter}"
                    Height="{x:Bind MaxDiameter}"
                    HorizontalAlignment="Center"
                    VerticalAlignment="Center"
                    Fill="{ThemeResource SystemChromeLowColor}" />
                <Ellipse
                    Width="{x:Bind Diameter}"
                    Height="{x:Bind Diameter}"
                    HorizontalAlignment="Center"
                    VerticalAlignment="Center"
                    Fill="{ThemeResource SystemAccentColor}" />
            </Grid>
        </DataTemplate>

        <DataTemplate x:Key="NormalItemTemplate" x:DataType="x:Int32">
            <Border Background="{ThemeResource SystemControlBackgroundChromeMediumBrush}">
                <TextBlock
                    HorizontalAlignment="Center"
                    VerticalAlignment="Center"
                    Text="{x:Bind}" />
            </Border>
        </DataTemplate>

        <DataTemplate x:Key="AccentItemTemplate" x:DataType="x:Int32">
            <Border Background="{ThemeResource SystemControlBackgroundAccentBrush}">
                <TextBlock
                    HorizontalAlignment="Center"
                    VerticalAlignment="Center"
                    Foreground="{ThemeResource SystemControlForegroundChromeWhiteBrush}"
                    Text="{x:Bind}" />
            </Border>
        </DataTemplate>

        <DataTemplate x:Key="StringDataTemplate" x:DataType="x:String">
            <Grid Margin="10" Background="{ThemeResource SystemControlBackgroundAccentBrush}">
                <TextBlock
                    Padding="10"
                    HorizontalAlignment="Center"
                    VerticalAlignment="Center"
                    Foreground="{ThemeResource SystemControlForegroundChromeWhiteBrush}"
                    Text="{x:Bind}"
                    TextWrapping="Wrap" />
            </Grid>
        </DataTemplate>

        <DataTemplate x:Key="IntDataTemplate" x:DataType="x:Int32">
            <Grid Margin="10" Background="{ThemeResource SystemControlBackgroundChromeMediumBrush}">
                <TextBlock
                    Padding="10"
                    HorizontalAlignment="Center"
                    VerticalAlignment="Center"
                    Style="{StaticResource HeaderTextBlockStyle}"
                    Text="{x:Bind}" />
            </Grid>
        </DataTemplate>

        <DataTemplate x:Key="CategoryTemplate" x:DataType="local:NestedCategory">
            <StackPanel>
                <TextBlock
                    Padding="8"
                    Style="{StaticResource TitleTextBlockStyle}"
                    Text="{x:Bind CategoryName}" />
                <ItemsRepeater
                    x:Name="innerRepeater"
                    ItemTemplate="{StaticResource StringDataTemplate}"
                    ItemsSource="{x:Bind CategoryItems}">
                    <ItemsRepeater.Layout>
                        <StackLayout Orientation="Horizontal" />
                    </ItemsRepeater.Layout>
                </ItemsRepeater>
            </StackPanel>
        </DataTemplate>

        <StackLayout
            x:Name="VerticalStackLayout"
            Orientation="Vertical"
            Spacing="8" />
        <StackLayout
            x:Name="HorizontalStackLayout"
            Orientation="Horizontal"
            Spacing="8" />
        <UniformGridLayout
            x:Name="UniformGridLayout"
            MinColumnSpacing="8"
            MinRowSpacing="8" />

        <layouts:ActivityFeedLayout
            x:Key="MyFeedLayout"
            ColumnSpacing="12"
            MinItemSize="80, 108"
            RowSpacing="12" />
        <UniformGridLayout
            x:Key="UniformGridLayout2"
            MinColumnSpacing="12"
            MinItemHeight="108"
            MinItemWidth="108"
            MinRowSpacing="12" />

        <DataTemplate x:Key="RecipeTemplate" x:DataType="local:Recipe">
            <StackPanel
                Margin="5"
                Background="{ThemeResource SystemControlBackgroundBaseLowBrush}"
                BorderThickness="1">
                <StackPanel
                    Height="75"
                    Margin="8"
                    Background="{x:Bind Color}"
                    Opacity=".8">
                    <TextBlock
                        Padding="12"
                        FontSize="35"
                        Foreground="{ThemeResource SystemControlForegroundAltHighBrush}"
                        Text="{x:Bind Num.ToString()}"
                        TextAlignment="Center" />
                </StackPanel>
                <TextBlock
                    x:Name="recipeName"
                    Margin="15,0,10,0"
                    Style="{StaticResource TitleTextBlockStyle}"
                    Text="{x:Bind Name}"
                    TextWrapping="Wrap" />
                <TextBlock
                    Margin="15,0,15,15"
                    Style="{StaticResource BodyTextBlockStyle}"
                    Text="{x:Bind Ingredients}" />
            </StackPanel>
        </DataTemplate>

        <local:MyDataTemplateSelector
            x:Key="MyDataTemplateSelector"
            Accent="{StaticResource AccentItemTemplate}"
            Normal="{StaticResource NormalItemTemplate}" />

        <local:StringOrIntTemplateSelector
            x:Key="StringOrIntTemplateSelector"
            IntTemplate="{StaticResource IntDataTemplate}"
            StringTemplate="{StaticResource StringDataTemplate}" />
    </Page.Resources>

    <StackPanel>
        <controls:ControlExample SampleDefinition="ItemsRepeater\ItemsRepeaterBasicNonInteractiveItems.txt">
            <ScrollViewer
                MaxHeight="500"
                HorizontalScrollBarVisibility="Auto"
                HorizontalScrollMode="Auto"
                IsVerticalScrollChainingEnabled="False"
                VerticalScrollBarVisibility="Auto">
                <ItemsRepeater
                    x:Name="repeater"
                    ItemTemplate="{StaticResource HorizontalBarTemplate}"
                    ItemsSource="{x:Bind BarItems}"
                    Layout="{StaticResource VerticalStackLayout}" />
            </ScrollViewer>
            <controls:ControlExample.Options>
                <StackPanel Spacing="12">
                    <Button
                        x:Name="AddBtn"
                        MinWidth="150"
                        Click="AddBtn_Click"
                        Content="Add Item" />
                    <Button
                        x:Name="DeleteBtn"
                        MinWidth="150"
                        Click="DeleteBtn_Click"
                        Content="Remove Item" />

                    <RadioButtons Header="Layout" SelectionChanged="RadioBtn_Click">
                        <RadioButton
                            x:Name="VStackBtn"
                            Content="StackLayout - Vertical"
                            IsChecked="True"
                            Tag="VerticalStackLayout" />
                        <RadioButton
                            x:Name="HStackBtn"
                            Content="StackLayout - Horizontal"
                            Tag="HorizontalStackLayout" />
                        <RadioButton
                            x:Name="HGridBtn"
                            Content="UniformGridLayout"
                            Tag="UniformGridLayout" />
                    </RadioButtons>
                </StackPanel>
            </controls:ControlExample.Options>




            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution
                    Key="Layout"
                    x:Name="layout"
                    Value="VerticalStackLayout" />
                <controls:ControlExampleSubstitution
                    Key="ElementGenerator"
                    x:Name="elementGenerator"
                    Value="HorizontalBarTemplate" />
                <controls:ControlExampleSubstitution Key="SampleCodeLayout" x:Name="SampleCodeLayout" />
                <controls:ControlExampleSubstitution Key="SampleCodeDT" x:Name="SampleCodeDT" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample
            HorizontalContentAlignment="Stretch"
            SampleDefinition="ItemsRepeater\ItemsRepeaterVirtualizingScrollableListItems.txt">

            <!--
                ItemsRepeaterScrollHost enables ItemsRepeater to coordinate with ScrollViewer down-level.
                It's not needed on 17700+ builds.
            -->
            <ItemsRepeaterScrollHost>
                <ScrollViewer
                    x:Name="scrollViewer"
                    Height="400"
                    Padding="0,0,16,0"
                    IsVerticalScrollChainingEnabled="False">
                    <ItemsRepeater
                        x:Name="repeater2"
                        Margin="0,0,12,0"
                        ItemsSource="{x:Bind Numbers}"
                        HorizontalAlignment="Stretch"
                        ItemTemplate="{StaticResource MyDataTemplateSelector}"
                        Layout="{StaticResource MyFeedLayout}" />
                </ScrollViewer>
            </ItemsRepeaterScrollHost>

            <controls:ControlExample.Options>
                <StackPanel Spacing="12">
                    <RadioButtons SelectedIndex="1" SelectionChanged="LayoutBtn_SelectionChanged">
                        <RadioButton Content="Uniform grid" Tag="UniformGridLayout2" />
                        <RadioButton Content="Custom virtualizing layout" Tag="MyFeedLayout" />
                    </RadioButtons>
                </StackPanel>
            </controls:ControlExample.Options>

            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution
                    Key="Layout"
                    x:Name="layout2"
                    Value="MyFeedLayout" />
                <controls:ControlExampleSubstitution Key="ItemTemplate" Value="SimpleItemTemplate" />
                <controls:ControlExampleSubstitution Key="SampleCodeLayout2" x:Name="SampleCodeLayout2" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample
            SampleDefinition="ItemsRepeater\ItemsrepeaterMixedTypeCollection.txt">
            <StackPanel>
                <TextBlock Text="This is an ItemsRepeater that displays both integer and string items. It uses a DataTemplateSelector to choose the correct layout for each of its items." TextWrapping="Wrap" />
                <ItemsRepeater
                    x:Name="MixedTypeRepeater"
                    Margin="0,0,12,0"
                    HorizontalAlignment="Stretch"
                    ItemTemplate="{StaticResource StringOrIntTemplateSelector}">

                    <ItemsRepeater.Layout>
                        <UniformGridLayout MinItemHeight="200" MinItemWidth="200" />
                    </ItemsRepeater.Layout>
                </ItemsRepeater>
            </StackPanel>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="ItemsRepeater\LayingOutNestedItemsrepeaters.txt">
            <ScrollViewer HorizontalScrollBarVisibility="Auto" HorizontalScrollMode="Auto">
                <ItemsRepeater
                    x:Name="outerRepeater"
                    VerticalAlignment="Top"
                    ItemTemplate="{StaticResource CategoryTemplate}">
                    <ItemsRepeater.Layout>
                        <StackLayout Orientation="Vertical" />
                    </ItemsRepeater.Layout>
                </ItemsRepeater>
            </ScrollViewer>
        </controls:ControlExample>

        <controls:ControlExample
            SampleDefinition="ItemsRepeater\ItemsRepeaterAnimatedScrollingContentDisplay.txt">
            <Grid>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="1*" />
                    <ColumnDefinition Width="1*" />
                </Grid.ColumnDefinitions>

                <ScrollViewer
                    x:Name="Animated_ScrollViewer"
                    Grid.Column="0"
                    Width="250"
                    Height="175">
                    <ItemsRepeater
                        x:Name="animatedScrollRepeater"
                        GettingFocus="OnAnimatedScrollRepeaterGettingFocus"
                        KeyDown="OnAnimatedScrollRepeaterKeyDown">
                        <DataTemplate x:DataType="x:String">
                            <Button
                                HorizontalAlignment="Stretch"
                                Background="{x:Bind}"
                                Click="OnAnimatedItemClicked"
                                Content="{x:Bind}"
                                Foreground="{ThemeResource TextFillColorInverseBrush}"
                                GotFocus="OnAnimatedItemGotFocus" />
                        </DataTemplate>
                    </ItemsRepeater>
                </ScrollViewer>

                <Rectangle
                    x:Name="colorRectangle"
                    Grid.Column="1"
                    Width="150"
                    Height="150"
                    Margin="10,0,0,0"
                    AutomationProperties.Name="ColorRectangle"
                    Stroke="{ThemeResource SystemControlForegroundBaseHighBrush}" />
            </Grid>
        </controls:ControlExample>

        <controls:ControlExample
            SampleDefinition="ItemsRepeater\ItemsRepeaterVirtualizedContentHeavyLayout.txt">
            <Grid Height="600">
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="1*" />
                    <ColumnDefinition Width="1*" />
                </Grid.ColumnDefinitions>
                <ItemsRepeaterScrollHost x:Name="tracker" Grid.Column="0">
                    <ScrollViewer>
                        <ItemsRepeater x:Name="VariedImageSizeRepeater" ItemTemplate="{StaticResource RecipeTemplate}">
                            <ItemsRepeater.Layout>
                                <layouts:VariedImageSizeLayout Width="200" />
                            </ItemsRepeater.Layout>
                        </ItemsRepeater>
                    </ScrollViewer>
                </ItemsRepeaterScrollHost>

                <StackPanel Grid.Column="1" Margin="10,0,0,0">
                    <TextBox
                        x:Name="FilterRecipes"
                        Width="200"
                        Margin="0,0,0,20"
                        HorizontalAlignment="Left"
                        VerticalAlignment="Top"
                        Header="Filter by ingredient..."
                        TextChanged="FilterRecipes_FilterChanged" />
                    <TextBlock Margin="0,0,0,10" Text="Sort by number of ingredients" />
                    <Button
                        Margin="0,0,0,5"
                        Click="OnSortAscClick"
                        Content="Least to most" />
                    <Button Click="OnSortDesClick" Content="Most to least" />
                </StackPanel>
            </Grid>
        </controls:ControlExample>
    </StackPanel>
</pages:ItemsPageBase>

```

## 主页面 C# (ItemsRepeaterPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Automation;
using Microsoft.UI.Xaml.Automation.Peers;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Hosting;
using Microsoft.UI.Xaml.Input;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Linq;
using WinUIGallery.Helpers;
using WinUIGallery.Pages;

namespace WinUIGallery.ControlPages;

public sealed partial class ItemsRepeaterPage : ItemsPageBase
{
    private Random random = new Random();
    private int MaxLength = 425;

    public ObservableCollection<int> Numbers { get; } = new ObservableCollection<int>(Enumerable.Range(0, 500));
    public ObservableCollection<Bar>? BarItems;
    public MyItemsSource filteredRecipeData = new MyItemsSource([]);
    public List<Recipe> staticRecipeData = [];
    private bool IsSortDescending = false;

    private Button? LastSelectedColorButton;
    private int PreviouslyFocusedAnimatedScrollRepeaterIndex = -1;

    public ItemsRepeaterPage()
    {
        this.InitializeComponent();
        InitializeData();
    }

    public List<String> ColorList = new List<String>()
    {
            "Blue",
            "BlueViolet",
            "Crimson",
            "DarkCyan",
            "DarkGoldenrod",
            "DarkMagenta",
            "DarkOliveGreen",
            "DarkRed",
            "DarkSlateBlue",
            "DeepPink",
            "IndianRed",
            "MediumSlateBlue",
            "Maroon",
            "MidnightBlue",
            "Peru",
            "SaddleBrown",
            "SteelBlue",
            "OrangeRed",
            "Firebrick",
            "DarkKhaki"
    };
    private void InitializeData()
    {
        if (BarItems == null)
        {
            BarItems = new ObservableCollection<Bar>();
        }
        BarItems.Add(new Bar(300, this.MaxLength));
        BarItems.Add(new Bar(25, this.MaxLength));
        BarItems.Add(new Bar(175, this.MaxLength));

        List<object> basicData = new List<object>
        {
            64,
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            128,
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            256,
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            512,
            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            1024
        };
        MixedTypeRepeater.ItemsSource = basicData;

        List<NestedCategory> nestedCategories = new List<NestedCategory>
        {
            new NestedCategory("Fruits", GetFruits()),
            new NestedCategory("Vegetables", GetVegetables()),
            new NestedCategory("Grains", GetGrains()),
            new NestedCategory("Proteins", GetProteins())
        };


        outerRepeater.ItemsSource = nestedCategories;

        // Set sample code to display on page's initial load
        SampleCodeLayout.Value = @"<StackLayout x:Name=""VerticalStackLayout"" Orientation=""Vertical"" Spacing=""8""/>";

        SampleCodeDT.Value = @"<DataTemplate x:Key=""HorizontalBarTemplate"" x:DataType=""l:Bar"">
    <Border Background=""{ThemeResource SystemChromeLowColor}"" Width=""{x:Bind MaxLength}"" >
        <Rectangle Fill=""{ThemeResource SystemAccentColor}"" Width=""{x:Bind Length}"" 
                   Height=""24"" HorizontalAlignment=""Left""/> 
    </Border>
</DataTemplate>";

        SampleCodeLayout2.Value = @"<common:ActivityFeedLayout x:Key=""MyFeedLayout"" ColumnSpacing=""12""
                          RowSpacing=""12"" MinItemSize=""80, 108""/>";


        animatedScrollRepeater.ItemsSource = ColorList;

        animatedScrollRepeater.ElementPrepared += OnElementPrepared;

        // Initialize custom MyItemsSource object with new recipe data
        List<Recipe> RecipeList = GetRecipeList();
        filteredRecipeData.InitializeCollection(RecipeList);
        // Save a static copy to compare to while filtering
        staticRecipeData = RecipeList;
        VariedImageSizeRepeater.ItemsSource = filteredRecipeData;

    }

    private ObservableCollection<string> GetFruits()
    {
        return new ObservableCollection<string> { "Apricots", "Bananas", "Grapes", "Strawberries", "Watermelon", "Plums", "Blueberries" };
    }

    private ObservableCollection<string> GetVegetables()
    {
        return new ObservableCollection<string> { "Broccoli", "Spinach", "Sweet potato", "Cauliflower", "Onion", "Brussels sprouts", "Carrots" };
    }
    private ObservableCollection<string> GetGrains()
    {
        return new ObservableCollection<string> { "Rice", "Quinoa", "Pasta", "Bread", "Farro", "Oats", "Barley" };
    }
    private ObservableCollection<string> GetProteins()
    {
        return new ObservableCollection<string> { "Steak", "Chicken", "Tofu", "Salmon", "Pork", "Chickpeas", "Eggs" };
    }

    // ==========================================================================
    // Basic, non-interactive ItemsRepeater
    // ==========================================================================
    private void AddBtn_Click(object sender, RoutedEventArgs e)
    {
        BarItems?.Add(new Bar(random.Next(this.MaxLength), this.MaxLength));
        DeleteBtn.IsEnabled = true;
    }

    private void DeleteBtn_Click(object sender, RoutedEventArgs e)
    {
        if (BarItems?.Count > 0)
        {
            BarItems.RemoveAt(0);
            if (BarItems.Count == 0)
            {
                DeleteBtn.IsEnabled = false;
            }
        }
    }

    private void RadioBtn_Click(object sender, SelectionChangedEventArgs e)
    {
        if (((sender as RadioButtons)?.SelectedItem as FrameworkElement)?.Tag is not string layoutKey)
        {
            // No point in continuing if selected element is null
            return;
        }

        string itemTemplateKey = string.Empty;

        if (layoutKey.Equals(nameof(this.VerticalStackLayout))) // we used x:Name in the resources which both acts as the x:Key value and creates a member field by the same name
        {
            layout.Value = layoutKey;
            itemTemplateKey = "HorizontalBarTemplate";

            repeater.MaxWidth = MaxLength + 12;

            SampleCodeLayout.Value = @"<StackLayout x:Name=""VerticalStackLayout"" Orientation=""Vertical"" Spacing=""8""/>";
            SampleCodeDT.Value = @"<DataTemplate x:Key=""HorizontalBarTemplate"" x:DataType=""l:Bar"">
    <Border Background=""{ThemeResource SystemChromeLowColor}"" Width=""{x:Bind MaxLength}"" >
        <Rectangle Fill=""{ThemeResource SystemAccentColor}"" Width=""{x:Bind Length}""
                   Height=""24"" HorizontalAlignment=""Left""/> 
    </Border>
</DataTemplate>";
        }
        else if (layoutKey.Equals(nameof(this.HorizontalStackLayout)))
        {
            layout.Value = layoutKey;
            itemTemplateKey = "VerticalBarTemplate";

            repeater.MaxWidth = 6000;

            SampleCodeLayout.Value = @"<StackLayout x:Name=""HorizontalStackLayout"" Orientation=""Horizontal"" Spacing=""8""/> ";
            SampleCodeDT.Value = @"<DataTemplate x:Key=""VerticalBarTemplate"" x:DataType=""l:Bar"">
    <Border Background=""{ThemeResource SystemChromeLowColor}"" Height=""{x:Bind MaxHeight}"">
        <Rectangle Fill=""{ThemeResource SystemAccentColor}"" Height=""{x:Bind Height}"" 
                   Width=""48"" VerticalAlignment=""Top""/>
    </Border>
</DataTemplate>";
        }
        else if (layoutKey.Equals(nameof(this.UniformGridLayout)))
        {
            layout.Value = layoutKey;
            itemTemplateKey = "CircularTemplate";

            repeater.MaxWidth = 540;

            SampleCodeLayout.Value = @"<UniformGridLayout x:Name=""UniformGridLayout"" MinRowSpacing=""8"" MinColumnSpacing=""8""/>";
            SampleCodeDT.Value = @"<DataTemplate x:Key=""CircularTemplate"" x:DataType=""l:Bar"">
    <Grid>
        <Ellipse Fill=""{ThemeResource SystemChromeLowColor}"" Height=""{x:Bind MaxDiameter}"" 
                 Width=""{x:Bind MaxDiameter}"" VerticalAlignment=""Center"" HorizontalAlignment=""Center""/>
        <Ellipse Fill=""{ThemeResource SystemAccentColor}"" Height=""{x:Bind Diameter}"" 
                 Width=""{x:Bind Diameter}"" VerticalAlignment=""Center"" HorizontalAlignment=""Center""/>
    </Grid>
</DataTemplate>";
        }
        repeater.Layout = Resources[layoutKey] as Microsoft.UI.Xaml.Controls.VirtualizingLayout;
        repeater.ItemTemplate = Resources[itemTemplateKey] as DataTemplate;
        repeater.ItemsSource = BarItems;

        elementGenerator.Value = itemTemplateKey;
    }

    // ==========================================================================
    // Virtualizing, scrollable list of items laid out by ItemsRepeater
    // ==========================================================================
    private void LayoutBtn_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (((sender as RadioButtons)?.SelectedItem as RadioButton)?.Tag is string layoutKey)
        {
            repeater2.Layout = Resources[layoutKey] as Microsoft.UI.Xaml.Controls.VirtualizingLayout;

            layout2.Value = layoutKey;

            if (layoutKey == "UniformGridLayout2")
            {
                SampleCodeLayout2.Value = @"<UniformGridLayout x:Key=""UniformGridLayout2"" MinItemWidth=""108"" MinItemHeight=""108""
                       MinRowSpacing=""12"" MinColumnSpacing=""12""/>";
            }
            else if (layoutKey == "MyFeedLayout")
            {
                SampleCodeLayout2.Value = @"<common:ActivityFeedLayout x:Key=""MyFeedLayout"" ColumnSpacing=""12""
                              RowSpacing=""12"" MinItemSize=""80, 108""/>";
            }
        }
    }

    // ==========================================================================
    // Animated Scrolling ItemsRepeater with Content Sample
    // ==========================================================================

    private void OnAnimatedItemGotFocus(object sender, RoutedEventArgs e)
    {
        if (sender is not FrameworkElement item)
        {
            return;
        }

        // Store the last focused Index so we can land back on it when focus leaves
        // and comes back to the repeater.
        PreviouslyFocusedAnimatedScrollRepeaterIndex = animatedScrollRepeater.GetElementIndex(sender as UIElement);

        item.StartBringIntoView(new BringIntoViewOptions()
        {
            VerticalAlignmentRatio = 0.5,
            AnimationDesired = true,
        });
    }
    private void OnAnimatedScrollRepeaterGettingFocus(UIElement sender, GettingFocusEventArgs args)
    {
        // If we have a previously focused index and focus moving from outside the repeater to inside,
        // then we can pick the previously focused index and land on that item again.
        var lastFocus = args.OldFocusedElement as UIElement;
        if (PreviouslyFocusedAnimatedScrollRepeaterIndex != -1 &&
            lastFocus != null && animatedScrollRepeater.GetElementIndex(lastFocus) == -1)
        {
            var item = animatedScrollRepeater.TryGetElement(PreviouslyFocusedAnimatedScrollRepeaterIndex);
            args.NewFocusedElement = item;
        }
    }

    private void OnAnimatedItemClicked(object sender, RoutedEventArgs e)
    {
        if (sender is not Button senderBtn)
        {
            return;
        }

        // Update corresponding rectangle with selected color
        colorRectangle.Fill = senderBtn.Background;
        // announce visual change to automation
        UIHelper.AnnounceActionForAccessibility(senderBtn, $"Rectangle color set to {senderBtn.Content}", "RectangleChangedNotificationActivityId");
        SetUIANamesForSelectedEntry(senderBtn);
    }


    /* This function occurs each time an element is made ready for use.
     * This is necessary for virtualization. */
    private void OnElementPrepared(Microsoft.UI.Xaml.Controls.ItemsRepeater sender, Microsoft.UI.Xaml.Controls.ItemsRepeaterElementPreparedEventArgs args)
    {
        var item = ElementCompositionPreview.GetElementVisual(args.Element);
        var svVisual = ElementCompositionPreview.GetElementVisual(Animated_ScrollViewer);
        var scrollProperties = ElementCompositionPreview.GetScrollViewerManipulationPropertySet(Animated_ScrollViewer);

        var scaleExpresion = scrollProperties.Compositor.CreateExpressionAnimation();
        scaleExpresion.SetReferenceParameter("svVisual", svVisual);
        scaleExpresion.SetReferenceParameter("scrollProperties", scrollProperties);
        scaleExpresion.SetReferenceParameter("item", item);

        // Scale the item based on the distance of the item relative to the center of the viewport.
        scaleExpresion.Expression = "1 - abs((svVisual.Size.Y/2 - scrollProperties.Translation.Y) - (item.Offset.Y + item.Size.Y/2))*(.25/(svVisual.Size.Y/2))";

        // Animate the item to change size based on distance from center of viewpoint
        item.StartAnimation("Scale.X", scaleExpresion);
        item.StartAnimation("Scale.Y", scaleExpresion);
        var centerPointExpression = scrollProperties.Compositor.CreateExpressionAnimation();
        centerPointExpression.SetReferenceParameter("item", item);
        centerPointExpression.Expression = "Vector3(item.Size.X/2, item.Size.Y/2, 0)";
        item.StartAnimation("CenterPoint", centerPointExpression);
    }

    private void SetUIANamesForSelectedEntry(Button selectedItem)
    {
        if (LastSelectedColorButton != null && LastSelectedColorButton.Content is string content)
        {
            AutomationProperties.SetName(LastSelectedColorButton, content);
        }

        AutomationProperties.SetName(selectedItem, (string)selectedItem.Content + " , selected");
        LastSelectedColorButton = selectedItem;
    }


    // ==========================================================================
    // VariedImageSize Layout with Filtering/Sorting
    // ==========================================================================
    private List<Recipe> GetRecipeList()
    {
        // Initialize list of recipes for varied image size layout sample
        var rnd = new Random();
        List<Recipe> tempList = new List<Recipe>(
                                    Enumerable.Range(0, 1000).Select(k =>
                                        new Recipe
                                        {
                                            Num = k,
                                            Name = "Recipe " + k.ToString(),
                                            Color = ColorList[rnd.Next(0, 19)]
                                        }));

        foreach (Recipe rec in tempList)
        {
            // Add one food from each option into the recipe's ingredient list and ingredient string
            string fruitOption = GetFruits()[rnd.Next(0, 6)];
            string vegOption = GetVegetables()[rnd.Next(0, 6)];
            string grainOption = GetGrains()[rnd.Next(0, 6)];
            string proteinOption = GetProteins()[rnd.Next(0, 6)];
            rec.Ingredients = "\n" + fruitOption + "\n" + vegOption + "\n" + grainOption + "\n" + proteinOption;
            rec.IngList = new List<string>() { fruitOption, vegOption, grainOption, proteinOption };

            // Add extra ingredients so items have varied heights in the layout
            rec.RandomizeIngredients();
        }

        return tempList;
    }

    public void FilterRecipes_FilterChanged(object sender, RoutedEventArgs e)
    {
        UpdateSortAndFilter();
    }

    private void OnSortAscClick(object sender, RoutedEventArgs e)
    {
        if (IsSortDescending == true)
        {
            IsSortDescending = false;
            UpdateSortAndFilter();
        }
    }

    private void OnSortDesClick(object sender, RoutedEventArgs e)
    {
        if (!IsSortDescending == true)
        {
            IsSortDescending = true;
            UpdateSortAndFilter();
        }
    }

    private void UpdateSortAndFilter()
    {
        // Find all recipes that ingredients include what was typed into the filtering text box
        var filteredTypes = staticRecipeData.Where(i => i.Ingredients.Contains(FilterRecipes.Text, StringComparison.InvariantCultureIgnoreCase));
        // Sort the recipes by whichever sorting mode was last selected (least to most ingredients by default)
        var sortedFilteredTypes = IsSortDescending ?
            filteredTypes.OrderByDescending(i => i.IngList.Count()) :
            filteredTypes.OrderBy(i => i.IngList.Count());
        // Re-initialize MyItemsSource object with this newly filtered data
        filteredRecipeData.InitializeCollection(sortedFilteredTypes);

        var peer = FrameworkElementAutomationPeer.FromElement(VariedImageSizeRepeater);

        peer.RaiseNotificationEvent(AutomationNotificationKind.Other, AutomationNotificationProcessing.ImportantMostRecent, $"Filtered recipes, {sortedFilteredTypes.Count()} results.", "RecipesFilteredNotificationActivityId");
    }

    private void OnAnimatedScrollRepeaterKeyDown(object sender, KeyRoutedEventArgs e)
    {
        if (e.Handled != true)
        {
            var targetIndex = -1;
            if (e.Key == Windows.System.VirtualKey.Home)
            {
                targetIndex = PreviouslyFocusedAnimatedScrollRepeaterIndex != 0 ? 0 : -1;
            }
            else if (e.Key == Windows.System.VirtualKey.End)
            {
                targetIndex = PreviouslyFocusedAnimatedScrollRepeaterIndex != animatedScrollRepeater.ItemsSourceView.Count - 1 ?
                    animatedScrollRepeater.ItemsSourceView.Count - 1 : -1;
            }

            if (targetIndex != -1)
            {
                var element = animatedScrollRepeater.GetOrCreateElement(targetIndex);
                element.StartBringIntoView();
                (element as Control)?.Focus(FocusState.Programmatic);
                e.Handled = true;
            }
        }
    }
}

public class NestedCategory
{
    public string CategoryName { get; set; }
    public ObservableCollection<string> CategoryItems { get; set; }
    public NestedCategory(string catName, ObservableCollection<string> catItems)
    {
        CategoryName = catName;
        CategoryItems = catItems;
    }
}


public partial class MyDataTemplateSelector : DataTemplateSelector
{
    public DataTemplate? Normal { get; set; }
    public DataTemplate? Accent { get; set; }

    protected override DataTemplate? SelectTemplateCore(object item)
    {
        if ((int)item % 2 == 0)
        {
            return Normal;
        }
        else
        {
            return Accent;
        }
    }
}

public partial class StringOrIntTemplateSelector : DataTemplateSelector
{
    // Define the (currently empty) data templates to return
    // These will be "filled-in" in the XAML code.
    public DataTemplate? StringTemplate { get; set; }

    public DataTemplate? IntTemplate { get; set; }

    protected override DataTemplate? SelectTemplateCore(object item)
    {
        // Return the correct data template based on the item's type.
        if (item.GetType() == typeof(string))
        {
            return StringTemplate;
        }
        else if (item.GetType() == typeof(int))
        {
            return IntTemplate;
        }
        else
        {
            return null;
        }
    }
}

public class Bar
{
    public Bar(double length, int max)
    {
        Length = length;
        MaxLength = max;

        Height = length / 4;
        MaxHeight = max / 4;

        Diameter = length / 6;
        MaxDiameter = max / 6;
    }
    public double Length { get; set; }
    public int MaxLength { get; set; }

    public double Height { get; set; }
    public double MaxHeight { get; set; }

    public double Diameter { get; set; }
    public double MaxDiameter { get; set; }
}

public class Recipe
{
    public int Num { get; set; }
    public string Ingredients { get; set; } = string.Empty;
    public List<string> IngList { get; set; } = [];
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int NumIngredients
    {
        get
        {
            return IngList.Count();
        }
    }

    public void RandomizeIngredients()
    {
        // To give the items different heights, give recipes random numbers of random ingredients
        Random rndNum = new Random();
        Random rndIng = new Random();

        ObservableCollection<string> extras = new ObservableCollection<string>{
                                                     "Garlic",
                                                     "Lemon",
                                                     "Butter",
                                                     "Lime",
                                                     "Feta Cheese",
                                                     "Parmesan Cheese",
                                                     "Breadcrumbs"};
        for (int i = 0; i < rndNum.Next(0, 4); i++)
        {
            string newIng = extras[rndIng.Next(0, 6)];
            if (!IngList.Contains(newIng))
            {
                Ingredients += "\n" + newIng;
                IngList.Add(newIng);
            }
        }

    }
}

// Custom data source class that assigns elements unique IDs, making filtering easier
public partial class MyItemsSource : IList, IKeyIndexMapping, INotifyCollectionChanged
{
    private List<Recipe> inner = new List<Recipe>();

    public MyItemsSource(IEnumerable<Recipe> collection)
    {
        InitializeCollection(collection);
    }

    public void InitializeCollection(IEnumerable<Recipe> collection)
    {
        inner.Clear();
        if (collection != null)
        {
            inner.AddRange(collection);
        }

        CollectionChanged?.Invoke(this, new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Reset));
    }

    #region IReadOnlyList<T>
    public int Count => this.inner != null ? this.inner.Count : 0;

    public object? this[int index]
    {
        get
        {
            return inner[index] as Recipe;
        }

        set
        {
            if (value is not Recipe recipe)
            {
                throw new ArgumentException("Value must be of type Recipe.", nameof(value));
            }

            inner[index] = recipe;
        }
    }

    public IEnumerator<Recipe> GetEnumerator() => this.inner.GetEnumerator();

    #endregion

    #region INotifyCollectionChanged
    public event NotifyCollectionChangedEventHandler? CollectionChanged;

    #endregion

    #region IKeyIndexMapping
    public string KeyFromIndex(int index)
    {
        return inner[index].Num.ToString();
    }

    public int IndexFromKey(string key)
    {
        foreach (Recipe item in inner)
        {
            if (item.Num.ToString() == key)
            {
                return inner.IndexOf(item);
            }
        }
        return -1;
    }

    #endregion

    #region Unused List methods
    IEnumerator IEnumerable.GetEnumerator()
    {
        throw new NotImplementedException();
    }

    public int Add(object? value)
    {
        throw new NotImplementedException();
    }

    public void Clear()
    {
        throw new NotImplementedException();
    }

    public bool Contains(object? value)
    {
        throw new NotImplementedException();
    }

    public int IndexOf(object? value)
    {
        throw new NotImplementedException();
    }

    public void Insert(int index, object? value)
    {
        throw new NotImplementedException();
    }

    public void Remove(object? value)
    {
        throw new NotImplementedException();
    }

    public void RemoveAt(int index)
    {
        throw new NotImplementedException();
    }

    public void CopyTo(Array array, int index)
    {
        throw new NotImplementedException();
    }

    public bool IsFixedSize => throw new NotImplementedException();

    public bool IsReadOnly => throw new NotImplementedException();

    public bool IsSynchronized => throw new NotImplementedException();

    public object SyncRoot => throw new NotImplementedException();

    #endregion
}

```

## 示例文件

### ItemsRepeaterAnimatedScrollingContentDisplay.txt
```
--- header
Animated Scrolling and Content Display
--- xaml
<!-- XAML Code -->

<!-- The below code shows the XAML for the ItemsRepeater as well as the
color-changing rectangle besides it. -->

<Grid>
    <Grid.ColumnDefinitions>
        <ColumnDefinition Width="1*"/>
        <ColumnDefinition Width="1*"/>
    </Grid.ColumnDefinitions>

    <ScrollViewer x:Name="Animated_ScrollViewer" 
                    Grid.Column="0"
                    Height="175"
                    Width="250"
                    ViewChanging="Animated_ScrollViewer_ViewChanging">
        <ItemsRepeater x:Name="animatedScrollRepeater" >
            <ItemsRepeater.ItemTemplate>
                <DataTemplate x:DataType="x:String">
                    <Button Content="{x:Bind}"
                            Background="{x:Bind}"
                            Click="Animated_GotItem" 
                            GotFocus="Animated_GotItem" 
                            HorizontalAlignment="Stretch"
                            Foreground="{ThemeResource ButtonForeground}"/>
                </DataTemplate>
            </ItemsRepeater.ItemTemplate>
        </ItemsRepeater>
    </ScrollViewer>

    <Rectangle x:Name="colorRectangle"
                Grid.Column="1"
                Stroke="Black"
                Height="150"
                Width="150"
                Margin="10,0,0,0"/>
</Grid>
--- c#
// C# Code

// Initialization code

private double AnimatedBtnHeight;
private Microsoft.UI.Xaml.Thickness AnimatedBtnMargin;

private void InitializeData()
{

    IList<string> colors = new List<String>()
    {
        "Blue",
        "BlueViolet",
        "Crimson",
        "DarkCyan",
        "DarkGoldenrod",
        "DarkMagenta",
        "DarkOliveGreen",
        "DarkRed",
        "DarkSlateBlue",
        "DeepPink",
        "IndianRed",
        "MediumSlateBlue",
        "Maroon",
        "MidnightBlue",
        "Peru",
        "SaddleBrown",
        "SteelBlue",
        "OrangeRed",
        "Firebrick",
        "DarkKhaki"
    };

    animatedScrollRepeater.ItemsSource = colors;
    animatedScrollRepeater.ElementPrepared += OnElementPrepared;
}

// Animation code

private void Animated_GotItem(object sender, RoutedEventArgs e)
{
    if (sender is not Button senderBtn)
    {
        return;
    }

    // When the clicked item has been recieved, bring it to the middle of the viewport.
    senderBtn.StartBringIntoView(new BringIntoViewOptions()
    {
        VerticalAlignmentRatio = 0.5,
        AnimationDesired = true,
    });

    // Update corresponding rectangle with selected color
    colorRectangle.Fill = senderBtn.Background;
}

/* This function occurs each time an element is made ready for use.
* This is necessary for virtualization. */
private void OnElementPrepared(Microsoft.UI.Xaml.Controls.ItemsRepeater sender, 
                               Microsoft.UI.Xaml.Controls.ItemsRepeaterElementPreparedEventArgs args)
{
    var item = ElementCompositionPreview.GetElementVisual(args.Element);
    var svVisual = ElementCompositionPreview.GetElementVisual(Animated_ScrollViewer);
    var scrollProperties = ElementCompositionPreview.GetScrollViewerManipulationPropertySet(Animated_ScrollViewer);

    var scaleExpresion = scrollProperties.Compositor.CreateExpressionAnimation();
    scaleExpresion.SetReferenceParameter("svVisual", svVisual);
    scaleExpresion.SetReferenceParameter("scrollProperties", scrollProperties);
    scaleExpresion.SetReferenceParameter("item", item);

    // Scale the item based on the distance of the item relative to the center of the viewport.
    scaleExpresion.Expression = "1 - abs((svVisual.Size.Y/2 - scrollProperties.Translation.Y) 
                                   - (item.Offset.Y + item.Size.Y/2))*(.25/(svVisual.Size.Y/2))";

    // Animate the item based on its distance to the center of the viewport.
    item.StartAnimation("Scale.X", scaleExpresion);
    item.StartAnimation("Scale.Y", scaleExpresion);
    var centerPointExpression = scrollProperties.Compositor.CreateExpressionAnimation();
    centerPointExpression.SetReferenceParameter("item", item);
    centerPointExpression.Expression = "Vector3(item.Size.X/2, item.Size.Y/2, 0)";
    item.StartAnimation("CenterPoint", centerPointExpression);
}

/* This function identifies the item that's currently in the middle of the viewport,
and sets the rectangle to match its color. */
private void Animated_ScrollViewer_ViewChanging(object sender, ScrollViewerViewChangingEventArgs e)
{
     if (GetSelectedItemFromViewport() is not Button selectedItem)
     {
         return;
     }

     // Update corresponding rectangle with selected color
     colorRectangle.Fill = selectedItem.Background;
}

// The remainder of these functions are helper functions for the ViewChanging function:

// Find centerpoint of ScrollViewer
private double CenterPointOfViewportInExtent()
{
    return Animated_ScrollViewer.VerticalOffset + Animated_ScrollViewer.ViewportHeight / 2;
}

// Find index of the item that's at the center of the viewport
private int GetSelectedIndexFromViewport()
{
    int selectedItemIndex = (int)Math.Floor(CenterPointOfViewportInExtent() 
                              / ((double)AnimatedBtnMargin.Top + AnimatedBtnHeight));
    selectedItemIndex %= animatedScrollRepeater.ItemsSourceView.Count;
    return selectedItemIndex;
}

// Return item that's at the center of the viewport.
private object? GetSelectedItemFromViewport()
{
    var selectedIndex = GetSelectedIndexFromViewport();
    var selectedElement = animatedScrollRepeater.TryGetElement(selectedIndex) as Button;
    return selectedElement;
}
```

### ItemsRepeaterBasicNonInteractiveItems.txt
```
--- header
Basic, non-interactive items laid out by ItemsRepeater
--- xaml
<!-- The ItemsRepeater and ScrollViewer used: -->
<ScrollViewer HorizontalScrollBarVisibility="Auto" 
              HorizontalScrollMode="Auto" 
              IsVerticalScrollChainingEnabled="False"
              MaxHeight="500">
    <ItemsRepeater
               ItemsSource="{x:Bind BarItems}"
               Layout="{StaticResource $(Layout)}"
               ItemTemplate="{StaticResource $(ElementGenerator)}" />
</ScrollViewer>
                    
<!-- The Layout specifications used: -->
                    
$(SampleCodeLayout)     
                    
<!-- The DataTemplate used: $(ElementGenerator)-->
                    
$(SampleCodeDT)
--- c#
// The ItemsSource used is a list of custom-class Bar objects called BarItems

public class Bar
{
    public Bar(double length, int max)
    {
        Length = length;
        MaxLength = max;

        Height = length / 4;
        MaxHeight = max / 4;

        Diameter = length / 6;
        MaxDiameter = max / 6;
    }
    public double Length { get; set; }
    public int MaxLength { get; set; }

    public double Height { get; set; }
    public double MaxHeight { get; set; }

    public double Diameter { get; set; }
    public double MaxDiameter { get; set; }
}

public ObservableCollection<Bar> BarItems;
private int MaxLength = 425;

private void InitializeData()
{
    if (BarItems == null)
    {
        BarItems = new ObservableCollection<Bar>();
    }
    BarItems.Add(new Bar(300, this.MaxLength));
    BarItems.Add(new Bar(25, this.MaxLength));
    BarItems.Add(new Bar(175, this.MaxLength));
}
```

### ItemsRepeaterVirtualizedContentHeavyLayout.txt
```
--- header
Virtualized, Content-Heavy Layout with Filtering and Sorting
--- xaml
<!-- XAML Code: -->
<ItemsRepeaterScrollHost>
    <ScrollViewer>
        <ItemsRepeater x:Name="VariedImageSizeRepeater" 
			    ItemTemplate="{StaticResource RecipeTemplate}">
	    
           <!-- IMPORTANT: This ItemsRepeater uses a custom-created layout 
		called VariedImageSize Layout (referenced below).You can find 
  		the full source code for this layout in the file 
		VariedImageSizeLayout.cs in the WinUI Gallery repo. -->

            <ItemsRepeater.Layout>
                <common:VariedImageSizeLayout Width="200" />
            </ItemsRepeater.Layout>
        </ItemsRepeater>
    </ScrollViewer>
</ItemsRepeaterScrollHost>

<!-- DataTemplate used: -->
<!-- This repeater holds Recipe objects, which is a custom class defined in 
     the code-behind, and shown below. -->
<DataTemplate x:DataType="l:Recipe" x:Key="RecipeTemplate">
    <StackPanel BorderThickness="1" Background="LightGray" Margin="5">
        <StackPanel Background="{x:Bind Color}" Margin="8" Height="75" Opacity=".8">
            <TextBlock Text="{x:Bind Num.ToString()}" FontSize="35" TextAlignment="Center" 
                        Padding="12"  Foreground="{ThemeResource SystemControlForegroundAltHighBrush}"/>
        </StackPanel>
        <TextBlock 
            x:Name="recipeName" 
            Text="{x:Bind Name}"
            TextWrapping="Wrap"
            Margin="15,0,10,0" 
            Style="{StaticResource TitleTextBlockStyle}"/>
        <TextBlock Text="{x:Bind Ingredients}" Style="{StaticResource BodyTextBlockStyle}" Margin="15,0,15,15"/>
    </StackPanel>
</DataTemplate>
--- c#
// C# Code

// ==========================  Recipe class used for items ========================== 
public class Recipe
{
    public int Num { get; set; }
    public string Ingredients { get; set; } = string.Empty;
    public List<string> IngList { get; set; } = [];
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int numIngredients
    {
        get
        {
            return IngList.Count();
        }
    }

    public void RandomizeIngredients()
    {
        // To give the items different heights for visual variety, give recipes 
        // random numbers of random "extra" ingredients
        Random rndNum = new Random();
        Random rndIng = new Random();

        ObservableCollection<string> extras = new ObservableCollection<string>{
                                                        "Garlic",
                                                        "Lemon",
                                                        "Butter",
                                                        "Lime",
                                                        "Feta Cheese",
                                                        "Parmesan Cheese",
                                                        "Breadcrumbs"};
        for (int i =0; i < rndNum.Next(0,4); i++)
        {
            string newIng = extras[rndIng.Next(0, 6)];
            // If the ingredient is not already present in the recipe, add it
            if (!IngList.Contains(newIng))
            {
                Ingredients += "\n" + newIng;
                IngList.Add(newIng);
            }
        }

    }
}

// ==========================  Data source class ========================== 
/* To hold the recipe items, a data source class was created called MyItemsSource. The class
   inherits from IList and IKeyIndexMapping interfaces, basically creating a collection class 
   that can easily filter and sort its items. Important methods are shown below, but full source
   code can be found in WinUI Gallery repo. See the linked ItemsRepeater guidance documentation as
   well for a full tutorial on how to implement this type of class. */

public class MyItemsSource : IList, 
                             Microsoft.UI.Xaml.Controls.IKeyIndexMapping, 
                             INotifyCollectionChanged
{
    private List<Recipe> inner = new List<Recipe>();

    public MyItemsSource(IEnumerable<Recipe> collection)
    {
        InitializeCollection(collection);
    }

    public void InitializeCollection(IEnumerable<Recipe> collection)
    {
        inner.Clear();
        if (collection != null)
        {
            inner.AddRange(collection);  
        }

        if (CollectionChanged != null)
        {
            CollectionChanged?.Invoke(
                this, 
                new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Reset));
        }
    }

    //...

    public string KeyFromIndex(int index)
    {
        return inner[index].Num.ToString();
    }

    public int IndexFromKey(string key)
    {
        foreach (Recipe item in inner)
        {
            if (item.Num.ToString() == key)
            {
                return inner.IndexOf(item);
            }
        }
        return -1;
    }
    // ...

}

// ========================== Initialization code ==========================

public MyItemsSource filteredRecipeData = new MyItemsSource(null);
public List<Recipe> staticRecipeData;

private void InitializeData()
{
    // ...
    // Create a list of Recipe objects, initializing each of them with a random number,
    // correlating name, and random color to associate with it.
    var rnd = new Random();
    List<Recipe> tempList = new List<Recipe>(
                              Enumerable.Range(0, 1000).Select(k =>
                                new Recipe
                                  {
                                    Num = k,
                                    Name = "Recipe " + k.ToString(),
                                    Color = colors[k % 15 + 1]
                                }));

    // The lists fruits, vegetables, grains, and proteins were all populated with strings. 
    // This loop goes through each Recipe item and populates its ingredients list with one 
    // string from each list/category, then randomizes the ingredients list by adding extras.            
    foreach (Recipe rec in tempList)
    {
        string fruitOption = fruits[rnd.Next(0, 6)];
        string vegOption = vegetables[rnd.Next(0, 6)];
        string grainOption = grains[rnd.Next(0, 6)];
        string proteinOption = proteins[rnd.Next(0, 6)];
        rec.Ingredients = "\n" + fruitOption + "\n" + vegOption + "\n" + 
        grainOption + "\n" + proteinOption;
        rec.IngList = new List<string>() { fruitOption, vegOption, grainOption, proteinOption };
        rec.RandomizeIngredients();
    }

    // The custom MyItemsSource object, filteredRecipeData, is initialized.
    filteredRecipeData.InitializeCollection(tempList);
    // A static list of the original recipe data is saved to use for filtering.
    staticRecipeData = new List<Recipe>(tempList);
    // The ItemsSource is set for the ItemsRepeater created in the XAML file.
    VariedImageSizeRepeater.ItemsSource = filteredRecipeData;

    // ...
}

// ========================== Filtering, sorting, animating ========================== 
public void FilterRecipes_FilterChanged(object sender, RoutedEventArgs e)
{
    UpdateSortAndFilter();
}

private void OnSortAscClick(object sender, RoutedEventArgs e)
{
    if (IsSortDescending == true)
    {
        IsSortDescending = false;
        UpdateSortAndFilter();
    }
}

private void OnSortDesClick(object sender, RoutedEventArgs e)
{
    if (!IsSortDescending == true)
    {
        IsSortDescending = true;
        UpdateSortAndFilter();
    }
}

private void UpdateSortAndFilter()
{
    // This is a Linq query that fetches all Recipes containing the ingredient 
    // typed into the filter text box.
    var filteredTypes = staticRecipeData
        .Where(i => i.Ingredients.Contains(
            FilterRecipes.Text,
            StringComparison.InvariantCultureIgnoreCase));
    // After filtering, sort the collection    
    var sortedFilteredTypes = IsSortDescending ?
        filteredTypes.OrderByDescending(i => i.numIngredients) :
        filteredTypes.OrderBy(i => i.numIngredients);
    // Re-initialize the collection with this newly filtered data
    filteredRecipeData.InitializeCollection(sortedFilteredTypes);
}
```

### ItemsRepeaterVirtualizingScrollableListItems.txt
```
--- header
Virtualizing, scrollable list of items laid out by ItemsRepeater
--- xaml
<!-- XAML Code -->

<!-- The ItemsRepeater and ScrollViewer used: -->
<ScrollViewer x:Name="scrollViewer"
                Height="400"
                IsVerticalScrollChainingEnabled="False"
                Padding="0,0,16,0">
    <ItemsRepeater
            ItemsSource="{x:Bind NumberedItems}"
            Layout="{StaticResource $(Layout)}"
            ItemTemplate="{StaticResource $(ItemTemplate)}" />
<ScrollViewer/> 
                    
<!-- The Layout specifications used: -->
                    
$(SampleCodeLayout2)     
                    
<!-- The ItemTemplate is bound to a DataTemplateSelector called MyDataTemplateSelector. 
MyDataTemplateSelector is defined in the code-behind to return the Accent DataTemplate 
for odd-numbered-items, and returns the Normal DataTemplate for even-numbered-items 
(shown in C# code-behind section below). The two data templates and the XAML declaration
of MyDataTemplateSelector are below: -->

<MyDataTemplateSelector x:Key="MyDataTemplateSelector"
                            Normal="{StaticResource NormalItemTemplate}"
                            Accent="{StaticResource AccentItemTemplate}"/>    
                    
<DataTemplate x:Key="NormalItemTemplate" x:DataType="x:Int32">
    <Button HorizontalAlignment="Stretch" VerticalAlignment="Stretch" 
	    Background="{ThemeResource SystemChromeLowColor}">
        <TextBlock Text="{x:Bind}" />
    </Button>
</DataTemplate>

<DataTemplate x:Key="AccentItemTemplate" x:DataType="x:Int32">
    <Button HorizontalAlignment="Stretch" VerticalAlignment="Stretch" 
	    Background="{ThemeResource SystemAccentColor}">
        <TextBlock Text="{x:Bind}" />
    </Button>
</DataTemplate>
                    
<!-- The ItemsSource for this ItemsRepeater is a list of integers called NumberedItems.-->
                    
<!-- ActivityFeedLayout is a custom designed virtualizing layout that loads images only as you come 
accross them, defined in the code-behind. View the WinUI Gallery source code to see more
details about this custom layout. -->
--- c#
// C# Code-behind

public class MyDataTemplateSelector : DataTemplateSelector
{
    public DataTemplate? Normal { get; set; }
    public DataTemplate? Accent { get; set; }

    protected override DataTemplate? SelectTemplateCore(object item)
    {
        if ((int)item % 2 == 0)
        {
            return Normal;
        }
        else
        {
            return Accent;
        }
    }
}
```

### ItemsrepeaterMixedTypeCollection.txt
```
--- header
ItemsRepeater with mixed-type collection
--- xaml
<!-- XAML Code -->

<!-- This is the ItemsRepeater used in this example: -->
<ItemsRepeater x:Name="MixedTypeRepeater" 
               Margin="0,0,12,0"
               HorizontalAlignment="Stretch"
               ItemTemplate="{StaticResource StringOrIntTemplateSelector}">

    <ItemsRepeater.Layout>
        <UniformGridLayout MinItemWidth="200" MinItemHeight="200"/>
    </ItemsRepeater.Layout>
</ItemsRepeater>

<!-- The ItemsSource is bound in the C# code-behind to an ObservableCollection called 
StringsAndInts. StringsAndInts has both string objects and integer objects. The ItemTemplate
is a DataTemplateSelector called StringOrIntTemplateSelector, and is defined in the 
code-behind and shown in the C# code-behind section below. The layout is a simple 
UniformGridLayout where each item is a 200x200 square. -->
                        
<!-- StringOrIntTemplateSelector assesses the type of an item, and returns StringDataTemplate if 
the item is a string, and IntDataTemplate if the item is an integer. 
The XAML code directly below binds the DataTemplateSelector to those two data templates, and 
defines each of them: -->
                        
<StringOrIntTemplateSelector x:Key="StringOrIntTemplateSelector"
                             StringTemplate="{StaticResource StringDataTemplate}"
                             IntTemplate="{StaticResource IntDataTemplate}"/>         
                        
<DataTemplate x:Key="StringDataTemplate" x:DataType="x:String">
    <Grid Background="{ThemeResource SystemControlBackgroundAccentBrush}" Margin="10">
        <TextBlock Padding="10" Text="{x:Bind}" 
                   Foreground="{ThemeResource SystemControlForegroundChromeWhiteBrush}"
                   HorizontalAlignment="Center" TextWrapping="Wrap" 
                   VerticalAlignment="Center"/>
     </Grid>
</DataTemplate>

<DataTemplate x:Key="IntDataTemplate" x:DataType="x:Int32">
    <Grid Background="{ThemeResource SystemControlBackgroundChromeMediumBrush}" Margin="10">
        <TextBlock Padding="10" Text="{x:Bind}" 
                   Style="{StaticResource HeaderTextBlockStyle}"
                   HorizontalAlignment="Center" VerticalAlignment="Center"/>
    </Grid>
</DataTemplate>
--- c#
// C# code-behind

public class StringOrIntTemplateSelector : DataTemplateSelector
{
    // Define the (currently empty) data templates to return
    // These will be "filled-in" in the XAML code.
    public DataTemplate? StringTemplate { get; set; }

    public DataTemplate? IntTemplate { get; set; }

    protected override DataTemplate? SelectTemplateCore(object item)
    {
        // Return the correct data template based on the item's type.
        if (item.GetType() == typeof(String))
        {
            return StringTemplate;
        }
        else if (item.GetType() == typeof(int))
        {
            return IntTemplate;
        }
        else
        {
            return null;
        }
    }
}
```

### LayingOutNestedItemsrepeaters.txt
```
--- header
Laying out nested ItemsRepeaters
--- xaml
<!-- The nested ItemsRepeater experience is achieved by creating one ItemsRepeater (outerRepeater below) 
and creating another ItemsRepeater (innerRepeater below) inside the outer one's DataTemplate. Below is 
the outer ItemsRepeater definition and the DataTemplate it uses. -->
                    
<ScrollViewer HorizontalScrollMode="Auto" HorizontalScrollBarVisibility="Auto">
    <ItemsRepeater 
        x:Name="outerRepeater"
        VerticalAlignment="Top"
        ItemTemplate ="{StaticResource CategoryTemplate}">
        <ItemsRepeater.Layout>
           <StackLayout Orientation="Vertical" />
        </ItemsRepeater.Layout>
    </ItemsRepeater>
</ScrollViewer>
                    
<DataTemplate x:Key="CategoryTemplate" x:DataType="l:NestedCategory">
    <StackPanel>
        <TextBlock Text="{x:Bind CategoryName}" Padding="8" Style="{StaticResource TitleTextBlockStyle}"/>
        <ItemsRepeater x:Name="innerRepeater"
                            ItemsSource="{x:Bind CategoryItems}"
                            ItemTemplate="{StaticResource StringDataTemplateColor}">
            <ItemsRepeater.Layout>
                <StackLayout Orientation="Horizontal" />
            </ItemsRepeater.Layout>
        </ItemsRepeater>
    </StackPanel>
</DataTemplate>
                    
<!-- The DataTemplate shown above is bound to a custom-class type called NestedCategory, 
which is defined in the code-behind. NestedCategory objects have the following two attributes: 
a CategoryName (string), and a collection of strings called CategoryItems. -->
                    
<!-- The inner ItemsRepeater is bound to its own, separate DataTemplate called StringDataTemplateColor: -->
                    
<DataTemplate x:Key="StringDataTemplateColor" x:DataType="x:String">
    <Grid Background="{StaticResource SystemControlBackgroundAccentBrush}" Margin="10, 0, 10 10">
        <TextBlock Padding="10" Text="{x:Bind}" 
                   Foreground="{StaticResource SystemControlForegroundAltHighBrush}" 
                   HorizontalAlignment="Center" TextWrapping="Wrap" VerticalAlignment="Center"/>
    </Grid>
</DataTemplate>
```


# ItemsView

## 主页面 XAML (ItemsViewPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<pages:ItemsPageBase
    x:Class="WinUIGallery.ControlPages.ItemsViewPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:local="using:WinUIGallery.ControlPages"
    xmlns:pages="using:WinUIGallery.Pages">

    <pages:ItemsPageBase.Resources>
        <DataTemplate x:Key="ImageTemplate" x:DataType="local:CustomDataObject">
            <ItemContainer
                Width="200"
                Height="140"
                HorizontalAlignment="Left"
                AutomationProperties.Name="{x:Bind Title}">
                <Image
                    Margin="4"
                    HorizontalAlignment="Center"
                    VerticalAlignment="Center"
                    AutomationProperties.AccessibilityView="Raw"
                    Source="{x:Bind ImageLocation}"
                    Stretch="UniformToFill" />
            </ItemContainer>
        </DataTemplate>

        <DataTemplate x:Key="LinedFlowLayoutItemTemplate" x:DataType="local:CustomDataObject">
            <ItemContainer AutomationProperties.Name="{x:Bind Title}">
                <Grid>
                    <Image
                        MinWidth="70"
                        HorizontalAlignment="Center"
                        VerticalAlignment="Center"
                        Source="{x:Bind ImageLocation}"
                        Stretch="UniformToFill" />
                    <StackPanel
                        Height="40"
                        Padding="5,1,5,1"
                        VerticalAlignment="Bottom"
                        Background="{ThemeResource SystemControlBackgroundBaseMediumBrush}"
                        Opacity=".75"
                        Orientation="Vertical">
                        <TextBlock Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Text="{x:Bind Title}" />
                        <StackPanel Orientation="Horizontal">
                            <TextBlock
                                Foreground="{ThemeResource SystemControlForegroundAltHighBrush}"
                                Style="{ThemeResource CaptionTextBlockStyle}"
                                Text="{x:Bind Likes}" />
                            <TextBlock
                                Foreground="{ThemeResource SystemControlForegroundAltHighBrush}"
                                Style="{ThemeResource CaptionTextBlockStyle}"
                                Text=" Likes" />
                        </StackPanel>
                    </StackPanel>
                </Grid>
            </ItemContainer>
        </DataTemplate>

        <DataTemplate x:Key="StackLayoutItemTemplate" x:DataType="local:CustomDataObject">
            <ItemContainer AutomationProperties.Name="{x:Bind Title}">
                <RelativePanel
                    Width="480"
                    MinHeight="80"
                    MaxHeight="100">
                    <Image
                        x:Name="image"
                        Width="24"
                        Height="16"
                        Margin="0,4,0,0"
                        HorizontalAlignment="Center"
                        VerticalAlignment="Center"
                        RelativePanel.AlignLeftWithPanel="True"
                        RelativePanel.AlignTopWithPanel="True"
                        Source="{x:Bind ImageLocation}"
                        Stretch="UniformToFill" />
                    <TextBlock
                        x:Name="title"
                        Margin="8,0,0,0"
                        RelativePanel.AlignTopWithPanel="True"
                        RelativePanel.RightOf="image"
                        Style="{StaticResource BaseTextBlockStyle}"
                        Text="{x:Bind Title}" />
                    <TextBlock
                        Margin="0,4,8,4"
                        RelativePanel.Below="title"
                        Style="{StaticResource CaptionTextBlockStyle}"
                        Text="{x:Bind Description}"
                        TextTrimming="WordEllipsis"
                        TextWrapping="Wrap" />
                </RelativePanel>
            </ItemContainer>
        </DataTemplate>

        <DataTemplate x:Key="UniformGridLayoutItemTemplate" x:DataType="local:CustomDataObject">
            <ItemContainer AutomationProperties.Name="{x:Bind Title}">
                <Grid Width="150">
                    <Image
                        HorizontalAlignment="Center"
                        VerticalAlignment="Center"
                        Source="{x:Bind ImageLocation}"
                        Stretch="UniformToFill" />
                    <StackPanel
                        Height="40"
                        Padding="5,1,5,1"
                        VerticalAlignment="Bottom"
                        Background="{ThemeResource SystemControlBackgroundBaseMediumBrush}"
                        Opacity=".75"
                        Orientation="Vertical">
                        <TextBlock Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Text="{x:Bind Title}" />
                        <StackPanel Orientation="Horizontal">
                            <TextBlock
                                Foreground="{ThemeResource SystemControlForegroundAltHighBrush}"
                                Style="{ThemeResource CaptionTextBlockStyle}"
                                Text="{x:Bind Likes}" />
                            <TextBlock
                                Foreground="{ThemeResource SystemControlForegroundAltHighBrush}"
                                Style="{ThemeResource CaptionTextBlockStyle}"
                                Text=" Likes" />
                        </StackPanel>
                    </StackPanel>
                </Grid>
            </ItemContainer>
        </DataTemplate>
    </pages:ItemsPageBase.Resources>

    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="ItemsView\BasicItemsview.txt">
            <StackPanel>
                <TextBlock Margin="0,0,0,15">
                    This is a basic ItemsView which uses its default StackLayout layout and a simple ItemTemplate.<LineBreak />
                    Hit the Enter key, double-click or double-tap an item to invoke it.</TextBlock>
                <ItemsView
                    x:Name="BasicItemsView"
                    Width="220"
                    Height="400"
                    HorizontalAlignment="Left"
                    IsItemInvokedEnabled="True"
                    ItemInvoked="BasicItemsView_ItemInvoked"
                    ItemTemplate="{StaticResource ImageTemplate}" />
                <TextBlock x:Name="tblBasicInvokeOutput" Style="{StaticResource OutputTextBlockStyle}" />
            </StackPanel>

        </controls:ControlExample>

        <controls:ControlExample x:Name="Example2" SampleDefinition="ItemsView\ItemsviewSwappableLayouts.txt">
            <StackPanel>
                <TextBlock Margin="0,0,0,15" TextWrapping="Wrap">
                    Use the options on the right to control different layout customizations to the ItemsView below.
                </TextBlock>
                <ItemsView
                    x:Name="SwappableLayoutsItemsView"
                    Width="500"
                    Height="400"
                    HorizontalAlignment="Left"
                    ItemTemplate="{StaticResource LinedFlowLayoutItemTemplate}">
                    <ItemsView.Layout>
                        <LinedFlowLayout
                            ItemsStretch="Fill"
                            LineHeight="160"
                            LineSpacing="5"
                            MinItemSpacing="5" />
                    </ItemsView.Layout>
                </ItemsView>
            </StackPanel>

            <controls:ControlExample.Options>
                <StackPanel MinWidth="300">
                    <StackPanel.Resources>
                        <Style x:Key="DefaultNumberBoxStyle" TargetType="NumberBox">
                            <Setter Property="SpinButtonPlacementMode" Value="Inline" />
                            <Setter Property="SmallChange" Value="1" />
                            <Setter Property="HorizontalAlignment" Value="Stretch" />
                            <Setter Property="HorizontalContentAlignment" Value="Stretch" />
                            <Setter Property="MaxWidth" Value="250" />
                            <Setter Property="Margin" Value="0,0,0,16" />
                        </Style>
                    </StackPanel.Resources>

                    <RadioButtons FontWeight="SemiBold" Header="Layout">
                        <RadioButton
                            Checked="RbLayout_Checked"
                            Content="LinedFlowLayout"
                            FontWeight="Normal"
                            GroupName="ItemsViewLayouts"
                            IsChecked="True" />

                        <RadioButton
                            Checked="RbLayout_Checked"
                            Content="UniformGridLayout"
                            FontWeight="Normal"
                            GroupName="ItemsViewLayouts" />

                        <RadioButton
                            Checked="RbLayout_Checked"
                            Content="StackLayout"
                            FontWeight="Normal"
                            GroupName="ItemsViewLayouts" />
                    </RadioButtons>

                    <StackPanel x:Name="spLinedFlowLayoutOptions" MinHeight="300">
                        <TextBlock
                            Margin="0,15,0,10"
                            FontWeight="SemiBold"
                            Text="LinedFlowLayout settings" />

                        <NumberBox
                            x:Name="nbLineSpacing"
                            AutomationProperties.Name="Space between lines"
                            Header="Space between lines"
                            Maximum="100"
                            Minimum="0"
                            Style="{ThemeResource DefaultNumberBoxStyle}"
                            ValueChanged="NbLinedFlowLayoutOptions_ValueChanged"
                            Value="5" />

                        <NumberBox
                            x:Name="nbMinItemSpacing"
                            AutomationProperties.Name="Minimum space between items on a line"
                            Header="Minimum space between items on a line"
                            Maximum="100"
                            Minimum="0"
                            Style="{ThemeResource DefaultNumberBoxStyle}"
                            ValueChanged="NbLinedFlowLayoutOptions_ValueChanged"
                            Value="5" />

                        <RadioButtons Header="Line height">
                            <RadioButton
                                x:Name="rbSmallLineHeight"
                                Checked="RbLineHeight_Checked"
                                Content="Small"
                                GroupName="LinedFlowLayoutLineHeights" />

                            <RadioButton
                                x:Name="rbLargeLineHeight"
                                Checked="RbLineHeight_Checked"
                                Content="Large"
                                GroupName="LinedFlowLayoutLineHeights"
                                IsChecked="True" />
                        </RadioButtons>
                    </StackPanel>

                    <StackPanel
                        x:Name="spStackLayoutOptions"
                        MinHeight="300"
                        Visibility="Collapsed">
                        <TextBlock
                            Margin="0,15,0,10"
                            FontWeight="SemiBold"
                            Text="StackLayout settings" />

                        <NumberBox
                            x:Name="nbSpacing"
                            AutomationProperties.Name="Space between rows"
                            Header="Space between rows"
                            Maximum="100"
                            Minimum="0"
                            Style="{ThemeResource DefaultNumberBoxStyle}"
                            ValueChanged="NbStackLayoutOptions_ValueChanged"
                            Value="5" />
                    </StackPanel>

                    <StackPanel
                        x:Name="spUniformGridLayoutOptions"
                        MinHeight="300"
                        Visibility="Collapsed">
                        <TextBlock
                            Margin="0,15,0,10"
                            FontWeight="SemiBold"
                            Text="UniformGridLayout settings" />

                        <NumberBox
                            x:Name="nbMinColumnSpacing"
                            AutomationProperties.Name="Minimum space between columns"
                            Header="Minimum space between columns"
                            Maximum="100"
                            Minimum="0"
                            Style="{ThemeResource DefaultNumberBoxStyle}"
                            ValueChanged="NbUniformGridLayoutOptions_ValueChanged"
                            Value="5" />

                        <NumberBox
                            x:Name="nbMinRowSpacing"
                            AutomationProperties.Name="Minimum space between rows"
                            Header="Minimum space between rows"
                            Maximum="100"
                            Minimum="0"
                            Style="{ThemeResource DefaultNumberBoxStyle}"
                            ValueChanged="NbUniformGridLayoutOptions_ValueChanged"
                            Value="5" />

                        <NumberBox
                            x:Name="nbMaximumRowsOrColumns"
                            AutomationProperties.Name="Maximum number of items per row before wrapping"
                            Header="Maximum number of items per row before wrapping"
                            Maximum="8"
                            Minimum="1"
                            Style="{ThemeResource DefaultNumberBoxStyle}"
                            ValueChanged="NbUniformGridLayoutOptions_ValueChanged"
                            Value="3" />
                    </StackPanel>
                </StackPanel>
            </controls:ControlExample.Options>

        </controls:ControlExample>

        <controls:ControlExample x:Name="Example3" SampleDefinition="ItemsView\ItemsviewItemInvocationSelection.txt">
            <Grid RowDefinitions="Auto, *, Auto">
                <RichTextBlock Margin="0,0,0,15" TextWrapping="Wrap">
                    <Paragraph>You can enable four different selection modes on the right.</Paragraph>
                    <Paragraph>
                        <Bold>None</Bold>
                        disables selection all together.</Paragraph>
                    <Paragraph>
                        <Bold>Single</Bold>
                        allows for only one item to be selected in the collection.</Paragraph>
                    <Paragraph>
                        <Bold>Multiple</Bold>
                        causes checkboxes to appear within the items, so that multiple items can be chosen from the collection.</Paragraph>
                    <Paragraph>
                        <Bold>Extended</Bold>
                        allows the user to select multiple items by using Ctrl+Click to select the individual items they want, or Shift+Click to select a range of contiguous items.</Paragraph>
                </RichTextBlock>

                <ItemsView
                    x:Name="SwappableSelectionModesItemsView"
                    Grid.Row="1"
                    Width="500"
                    Height="400"
                    HorizontalAlignment="Left"
                    ItemInvoked="SwappableSelectionModesItemsView_ItemInvoked"
                    ItemTemplate="{StaticResource UniformGridLayoutItemTemplate}"
                    SelectionChanged="SwappableSelectionModesItemsView_SelectionChanged"
                    SelectionMode="Multiple">
                    <ItemsView.Layout>
                        <UniformGridLayout
                            MaximumRowsOrColumns="3"
                            MinColumnSpacing="5"
                            MinRowSpacing="5" />
                    </ItemsView.Layout>
                </ItemsView>

                <StackPanel Grid.Row="2">
                    <TextBlock x:Name="tblInvocationOutput" Style="{StaticResource OutputTextBlockStyle}" />
                    <TextBlock x:Name="tblSelectionOutput" Style="{StaticResource OutputTextBlockStyle}" />
                </StackPanel>
            </Grid>

            <controls:ControlExample.Options>
                <Grid
                    MinWidth="200"
                    ColumnDefinitions="Auto, *"
                    RowDefinitions="Auto, Auto">
                    <TextBlock
                        Margin="0,0,10,0"
                        VerticalAlignment="Center"
                        Text="SelectionMode" />

                    <ComboBox
                        x:Name="cmbSelectionMode"
                        Grid.Column="1"
                        HorizontalAlignment="Stretch"
                        AutomationProperties.Name="selection mode"
                        SelectedIndex="2"
                        SelectionChanged="CmbSelectionMode_SelectionChanged">
                        <ComboBoxItem>None</ComboBoxItem>
                        <ComboBoxItem>Single</ComboBoxItem>
                        <ComboBoxItem>Multiple</ComboBoxItem>
                        <ComboBoxItem>Extended</ComboBoxItem>
                    </ComboBox>

                    <TextBlock
                        Grid.Row="1"
                        Margin="0,0,10,0"
                        VerticalAlignment="Center"
                        Text="IsItemInvokedEnabled" />

                    <CheckBox
                        x:Name="chkIsItemInvokedEnabled"
                        Grid.Row="1"
                        Grid.Column="1"
                        AutomationProperties.Name="is item invocation enabled?"
                        Checked="ChkIsItemInvokedEnabled_IsCheckedChanged"
                        Unchecked="ChkIsItemInvokedEnabled_IsCheckedChanged" />
                </Grid>
            </controls:ControlExample.Options>


            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="SelectionMode" Value="{x:Bind ((ComboBoxItem)cmbSelectionMode.SelectedItem).Content, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="IsItemInvokedEnabled" Value="{x:Bind chkIsItemInvokedEnabled.IsChecked, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</pages:ItemsPageBase>

```

## 主页面 C# (ItemsViewPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using WinUIGallery.Pages;

namespace WinUIGallery.ControlPages;

public sealed partial class ItemsViewPage : ItemsPageBase
{
    private LinedFlowLayout? linedFlowLayout = null;
    private StackLayout? stackLayout = null;
    private UniformGridLayout? uniformGridLayout = null;

    private DataTemplate? linedFlowLayoutItemTemplate = null;
    private DataTemplate? stackLayoutItemTemplate = null;
    private DataTemplate? uniformGridLayoutItemTemplate = null;

    private bool applyLinedFlowLayoutLineHeightAsync = false;
    private bool applyLinedFlowLayoutOptionsAsync = false;

    public ItemsViewPage()
    {
        this.InitializeComponent();
        this.DataContext = this;
        this.Loaded += ItemsViewPage_Loaded;
    }

    private void ItemsViewPage_Loaded(object sender, RoutedEventArgs e)
    {
        this.Loaded -= ItemsViewPage_Loaded;

        if (SwappableLayoutsItemsView != null)
        {
            SwappableLayoutsItemsView.ScrollView.ViewChanged += SwappableLayoutsItemsViewScrollView_ViewChanged;

            linedFlowLayout = SwappableLayoutsItemsView.Layout as LinedFlowLayout;
            linedFlowLayoutItemTemplate = SwappableLayoutsItemsView.ItemTemplate as DataTemplate;
        }

        // Get data objects and place them into an ObservableCollection
        List<CustomDataObject> tempList = CustomDataObject.GetDataObjects(includeAllItems: true);
        ObservableCollection<CustomDataObject> Items = new ObservableCollection<CustomDataObject>(tempList);

        if (BasicItemsView != null)
        {
            BasicItemsView.ItemsSource = Items;
        }

        Task.Run(delegate ()
        {
            _ = DispatcherQueue.TryEnqueue(Microsoft.UI.Dispatching.DispatcherQueuePriority.Low, () =>
            {
                if (SwappableLayoutsItemsView != null)
                {
                    // Temporarily setting the items source asynchronously to avoid LinedFlowLayout bug.
                    SwappableLayoutsItemsView.ItemsSource = Items;
                }
            });
        });

        if (SwappableSelectionModesItemsView != null)
        {
            SwappableSelectionModesItemsView.ItemsSource = Items;
        }
    }

    // Example1
    private void BasicItemsView_ItemInvoked(ItemsView sender, ItemsViewItemInvokedEventArgs e)
    {
        if (e.InvokedItem is not CustomDataObject invokedItem)
        {
            return;
        }

        tblBasicInvokeOutput.Text = "You invoked " + invokedItem.Title + ".";
    }

    // Example2
    private void ApplyLinedFlowLayoutLineHeight()
    {
        if (linedFlowLayout != null && rbSmallLineHeight != null)
        {
            linedFlowLayout.LineHeight = rbSmallLineHeight.IsChecked is true ? 80 : 160;
        }
    }

    private void ApplyLinedFlowLayoutOptions()
    {
        if (linedFlowLayout != null && nbLineSpacing != null && nbMinItemSpacing != null)
        {
            linedFlowLayout.LineSpacing = nbLineSpacing.Value;
            linedFlowLayout.MinItemSpacing = nbMinItemSpacing.Value;
        }
    }

    private void RbLayout_Checked(object sender, RoutedEventArgs e)
    {
        if (sender is RadioButton rb && SwappableLayoutsItemsView != null)
        {
            switch (rb.Content.ToString())
            {
                case "LinedFlowLayout":
                    if (linedFlowLayout != null && linedFlowLayoutItemTemplate != null)
                    {
                        SwappableLayoutsItemsView.Layout = linedFlowLayout;
                        SwappableLayoutsItemsView.ItemTemplate = linedFlowLayoutItemTemplate;

                        spLinedFlowLayoutOptions.Visibility = Visibility.Visible;
                        spStackLayoutOptions.Visibility = Visibility.Collapsed;
                        spUniformGridLayoutOptions.Visibility = Visibility.Collapsed;
                    }
                    break;

                case "StackLayout":
                    if (stackLayout == null)
                    {
                        stackLayout = new StackLayout()
                        {
                            Spacing = 5
                        };
                    }

                    if (stackLayoutItemTemplate == null)
                    {
                        stackLayoutItemTemplate = Resources["StackLayoutItemTemplate"] as DataTemplate;
                    }

                    SwappableLayoutsItemsView.Layout = stackLayout;
                    SwappableLayoutsItemsView.ItemTemplate = stackLayoutItemTemplate;

                    spLinedFlowLayoutOptions.Visibility = Visibility.Collapsed;
                    spStackLayoutOptions.Visibility = Visibility.Visible;
                    spUniformGridLayoutOptions.Visibility = Visibility.Collapsed;
                    break;

                case "UniformGridLayout":
                    if (uniformGridLayout == null)
                    {
                        uniformGridLayout = new UniformGridLayout()
                        {
                            MinRowSpacing = 5,
                            MinColumnSpacing = 5,
                            MaximumRowsOrColumns = 3
                        };
                    }

                    if (uniformGridLayoutItemTemplate == null)
                    {
                        uniformGridLayoutItemTemplate = Resources["UniformGridLayoutItemTemplate"] as DataTemplate;
                    }

                    SwappableLayoutsItemsView.Layout = uniformGridLayout;
                    SwappableLayoutsItemsView.ItemTemplate = uniformGridLayoutItemTemplate;

                    spLinedFlowLayoutOptions.Visibility = Visibility.Collapsed;
                    spStackLayoutOptions.Visibility = Visibility.Collapsed;
                    spUniformGridLayoutOptions.Visibility = Visibility.Visible;
                    break;
            }
        }
    }

    private void RbLineHeight_Checked(object sender, RoutedEventArgs e)
    {
        if (SwappableLayoutsItemsView != null && SwappableLayoutsItemsView.ScrollView != null && SwappableLayoutsItemsView.ScrollView.VerticalOffset != 0)
        {
            SwappableLayoutsItemsView.ScrollView.ScrollTo(0, 0, new ScrollingScrollOptions(ScrollingAnimationMode.Disabled, ScrollingSnapPointsMode.Ignore));
            applyLinedFlowLayoutLineHeightAsync = true;
        }
        else
        {
            ApplyLinedFlowLayoutLineHeight();
        }
    }

    private void NbLinedFlowLayoutOptions_ValueChanged(NumberBox sender, NumberBoxValueChangedEventArgs e)
    {
        if (SwappableLayoutsItemsView != null && SwappableLayoutsItemsView.ScrollView != null && SwappableLayoutsItemsView.ScrollView.VerticalOffset != 0)
        {
            SwappableLayoutsItemsView.ScrollView.ScrollTo(0, 0, new ScrollingScrollOptions(ScrollingAnimationMode.Disabled, ScrollingSnapPointsMode.Ignore));
            applyLinedFlowLayoutOptionsAsync = true;
        }
        else
        {
            ApplyLinedFlowLayoutOptions();
        }
    }

    private void NbStackLayoutOptions_ValueChanged(NumberBox sender, NumberBoxValueChangedEventArgs e)
    {
        if (stackLayout != null)
        {
            stackLayout.Spacing = nbSpacing.Value;
        }
    }

    private void NbUniformGridLayoutOptions_ValueChanged(NumberBox sender, NumberBoxValueChangedEventArgs e)
    {
        if (uniformGridLayout != null)
        {
            uniformGridLayout.MinColumnSpacing = nbMinColumnSpacing.Value;
            uniformGridLayout.MinRowSpacing = nbMinRowSpacing.Value;
            uniformGridLayout.MaximumRowsOrColumns = (int)nbMaximumRowsOrColumns.Value;
        }
    }

    private void SwappableLayoutsItemsViewScrollView_ViewChanged(ScrollView sender, object args)
    {
        if (sender.VerticalOffset == 0 && (applyLinedFlowLayoutOptionsAsync || applyLinedFlowLayoutLineHeightAsync))
        {
            if (applyLinedFlowLayoutOptionsAsync)
            {
                applyLinedFlowLayoutOptionsAsync = false;
                ApplyLinedFlowLayoutOptions();
            }

            if (applyLinedFlowLayoutLineHeightAsync)
            {
                applyLinedFlowLayoutLineHeightAsync = false;
                ApplyLinedFlowLayoutLineHeight();
            }
        }
    }

    // Example3
    private void SwappableSelectionModesItemsView_ItemInvoked(ItemsView sender, ItemsViewItemInvokedEventArgs e)
    {
        if (e.InvokedItem is not CustomDataObject invokedItem)
        {
            return;
        }

        tblInvocationOutput.Text = "You invoked " + invokedItem.Title + ".";
    }

    private void SwappableSelectionModesItemsView_SelectionChanged(ItemsView sender, ItemsViewSelectionChangedEventArgs e)
    {
        if (SwappableSelectionModesItemsView != null)
        {
            tblSelectionOutput.Text = string.Format("You have selected {0} item(s).", SwappableSelectionModesItemsView.SelectedItems.Count);
        }
    }

    private void CmbSelectionMode_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (SwappableSelectionModesItemsView != null && sender is ComboBox cmb)
        {
            SwappableSelectionModesItemsView.SelectionMode = (ItemsViewSelectionMode)cmb.SelectedIndex;
        }
    }

    private void ChkIsItemInvokedEnabled_IsCheckedChanged(object sender, RoutedEventArgs e)
    {
        tblInvocationOutput.Text = string.Empty;

        if (SwappableSelectionModesItemsView != null && chkIsItemInvokedEnabled != null)
        {
            SwappableSelectionModesItemsView.IsItemInvokedEnabled = chkIsItemInvokedEnabled.IsChecked is true;
        }
    }
}

```

## 示例文件

### BasicItemsview.txt
```
--- header
Basic ItemsView
--- xaml
<DataTemplate x:Key="ImageTemplate" x:DataType="local:CustomDataObject">
    <ItemContainer HorizontalAlignment="Left" Width="200" Height="140" AutomationProperties.Name="{x:Bind Title}">
        <Image Stretch="UniformToFill" HorizontalAlignment="Center" VerticalAlignment="Center" Source="{x:Bind ImageLocation}" Margin="4" AutomationProperties.AccessibilityView="Raw"/>
    </ItemContainer>
</DataTemplate>

<ItemsView Width="220" Height="400" HorizontalAlignment="Left"
    ItemTemplate="{StaticResource ImageTemplate}" IsItemInvokedEnabled="True" ItemInvoked="BasicItemsView_ItemInvoked"/>
--- c#
private void BasicItemsView_ItemInvoked(ItemsView sender, ItemsViewItemInvokedEventArgs e)
{
    tblBasicInvokeOutput.Text = "You invoked " + (e.InvokedItem as CustomDataObject).Title + ".";
}
```

### ItemsviewItemInvocationSelection.txt
```
--- header
ItemsView item invocation and selection
--- xaml
<DataTemplate x:Key="UniformGridLayoutItemTemplate" x:DataType="local:CustomDataObject">
    <ItemContainer AutomationProperties.Name="{x:Bind Title}">
        <Grid Width="150">
            <Image Source="{x:Bind ImageLocation}" Stretch="UniformToFill" HorizontalAlignment="Center" VerticalAlignment="Center"/>
            <StackPanel Orientation="Vertical" Height="40" VerticalAlignment="Bottom" Padding="5,1,5,1" Background="{ThemeResource SystemControlBackgroundBaseMediumBrush}" Opacity=".75">
                <TextBlock Text="{x:Bind Title}" Foreground="{ThemeResource SystemControlForegroundAltHighBrush}"/>
                <StackPanel Orientation="Horizontal">
                    <TextBlock Text="{x:Bind Likes}" Style="{ThemeResource CaptionTextBlockStyle}" Foreground="{ThemeResource SystemControlForegroundAltHighBrush}"/>
                    <TextBlock Text=" Likes" Style="{ThemeResource CaptionTextBlockStyle}" Foreground="{ThemeResource SystemControlForegroundAltHighBrush}"/>
                </StackPanel>
            </StackPanel>
        </Grid>
    </ItemContainer>
</DataTemplate>

<ItemsView Width="500" Height="400" HorizontalAlignment="Left"
    SelectionMode="$(SelectionMode)"
    IsItemInvokedEnabled="$(IsItemInvokedEnabled)"
    ItemTemplate="{StaticResource UniformGridLayoutItemTemplate}"
    ItemInvoked="SwappableSelectionModesItemsView_ItemInvoked"
    SelectionChanged="SwappableSelectionModesItemsView_SelectionChanged">
    <ItemsView.Layout>
        <UniformGridLayout MinRowSpacing="5" MinColumnSpacing="5" MaximumRowsOrColumns="3"/>
    </ItemsView.Layout>
</ItemsView>
--- c#
private void SwappableSelectionModesItemsView_ItemInvoked(ItemsView sender, ItemsViewItemInvokedEventArgs e)
{
    tblInvocationOutput.Text = "You invoked " + (e.InvokedItem as CustomDataObject).Title + ".";
}

private void SwappableSelectionModesItemsView_SelectionChanged(ItemsView sender, ItemsViewSelectionChangedEventArgs e)
{
    tblSelectionOutput.Text = string.Format("You have selected {0} item(s).", SwappableSelectionModesItemsView.SelectedItems.Count);
}
```

### ItemsviewSwappableLayouts.txt
```
--- header
ItemsView with swappable layouts
--- xaml
<DataTemplate x:Key="LinedFlowLayoutItemTemplate" x:DataType="local:CustomDataObject">
    <ItemContainer AutomationProperties.Name="{x:Bind Title}">
        <Grid>
            <Image Source="{x:Bind ImageLocation}" Stretch="UniformToFill" HorizontalAlignment="Center" VerticalAlignment="Center" MinWidth="70"/>
            <StackPanel Orientation="Vertical" Height="40" VerticalAlignment="Bottom" Padding="5,1,5,1" Background="{ThemeResource SystemControlBackgroundBaseMediumBrush}" Opacity=".75">
                <TextBlock Text="{x:Bind Title}" Foreground="{ThemeResource SystemControlForegroundAltHighBrush}"/>
                <StackPanel Orientation="Horizontal">
                    <TextBlock Text="{x:Bind Likes}" Style="{ThemeResource CaptionTextBlockStyle}" Foreground="{ThemeResource SystemControlForegroundAltHighBrush}"/>
                    <TextBlock Text=" Likes" Style="{ThemeResource CaptionTextBlockStyle}" Foreground="{ThemeResource SystemControlForegroundAltHighBrush}"/>
                </StackPanel>
            </StackPanel>
        </Grid>
    </ItemContainer>
</DataTemplate>

<ItemsView Width="500" Height="400" HorizontalAlignment="Left"
    ItemTemplate="{StaticResource LinedFlowLayoutItemTemplate}">
    <ItemsView.Layout>
        <LinedFlowLayout ItemsStretch="Fill" LineHeight="160" LineSpacing="5" MinItemSpacing="5"/>
    </ItemsView.Layout>
</ItemsView>
```


# ListView

## 主页面 XAML (ListViewPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<pages:ItemsPageBase
    x:Class="WinUIGallery.ControlPages.ListViewPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:local="using:WinUIGallery.ControlPages"
    xmlns:models="using:WinUIGallery.Models"
    xmlns:pages="using:WinUIGallery.Pages">
    <Page.Resources>
        <DataTemplate x:Key="ImageTextListMailFolderTemplate" x:DataType="models:ControlInfoDataItem">
            <Grid Margin="0,12,0,12">
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="Auto" MinWidth="550" />
                </Grid.ColumnDefinitions>
                <TextBlock
                    Margin="0,12,0,0"
                    HorizontalAlignment="Left"
                    Text="{x:Bind Title}"
                    TextWrapping="Wrap" />
            </Grid>
        </DataTemplate>

        <!--
            Use a collection view source for content that presents itself as a list of items that can be grouped or sorted.  Otherwise, you can use x:Bind
            directly on the ListView's item source to for further optimization. Please see the WinUIGallery sample for an example of how to do this.
        -->
        <CollectionViewSource x:Name="ContactsCVS" IsSourceGrouped="True" />

        <!--  When using x:Bind, you need to set x:DataType  -->
        <DataTemplate x:Key="ContactListViewTemplate" x:DataType="local:Contact">
            <Grid>
                <Grid.RowDefinitions>
                    <RowDefinition Height="*" />
                    <RowDefinition Height="*" />
                </Grid.RowDefinitions>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="Auto" />
                    <ColumnDefinition Width="*" />
                </Grid.ColumnDefinitions>
                <Ellipse
                    x:Name="Ellipse"
                    Grid.RowSpan="2"
                    Width="32"
                    Height="32"
                    Margin="6"
                    HorizontalAlignment="Center"
                    VerticalAlignment="Center"
                    Fill="{ThemeResource ControlStrongFillColorDefaultBrush}" />
                <TextBlock
                    Grid.Column="1"
                    Margin="12,6,0,0"
                    x:Phase="1"
                    Style="{ThemeResource BaseTextBlockStyle}"
                    Text="{x:Bind Name}" />
                <TextBlock
                    Grid.Row="1"
                    Grid.Column="1"
                    Margin="12,0,0,6"
                    x:Phase="2"
                    Style="{ThemeResource BodyTextBlockStyle}"
                    Text="{x:Bind Company}" />
            </Grid>
        </DataTemplate>

        <DataTemplate x:Key="MessageViewTemplate" x:DataType="local:Message">
            <Grid
                Height="Auto"
                Margin="4"
                HorizontalAlignment="{x:Bind MsgAlignment}">
                <StackPanel
                    Width="350"
                    MinHeight="75"
                    Padding="10,0,0,10"
                    Background="{ThemeResource SystemColorHighlightColor}"
                    CornerRadius="{StaticResource ControlCornerRadius}">
                    <TextBlock
                        Padding="0,10,0,0"
                        FontSize="20"
                        Foreground="{ThemeResource SystemColorHighlightTextColor}"
                        Text="{x:Bind MsgText}" />
                    <TextBlock
                        Padding="0,0,0,10"
                        FontSize="15"
                        Foreground="{ThemeResource SystemColorHighlightTextColor}"
                        Text="{x:Bind MsgDateTime}" />
                </StackPanel>
            </Grid>
        </DataTemplate>

        <DataTemplate x:Key="BasicListViewTemplate" x:DataType="local:Contact">
            <TextBlock
                Margin="0,5,0,5"
                x:Phase="1"
                Text="{x:Bind Name}" />
        </DataTemplate>

    </Page.Resources>
    <StackPanel>

        <controls:ControlExample
            SampleDefinition="ListView\BasicListviewSimpleDatatemplate.txt">
            <StackPanel>
                <TextBlock
                    Margin="0,0,0,16"
                    Text="This is a basic ListView that has the full source code below. Other samples on this page display only the additional markup needed to customize a simple ListView like this one."
                    TextWrapping="Wrap" />
                <ListView
                    x:Name="BaseExample"
                    Width="350"
                    Height="400"
                    HorizontalAlignment="Left"
                    BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}"
                    BorderThickness="1"
                    ItemTemplate="{StaticResource BasicListViewTemplate}" />
            </StackPanel>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="ListView\ListviewSelectionSupport.txt">
            <StackPanel>
                <RichTextBlock Margin="0,0,0,15" TextWrapping="Wrap">
                    <Paragraph>You can enable four different selection modes on the right.</Paragraph>
                    <Paragraph>
                        <Bold>None</Bold>
                        disables selection all together.</Paragraph>
                    <Paragraph>
                        <Bold>Single</Bold>
                        allows for only one item to be selected in the list.</Paragraph>
                    <Paragraph>
                        <Bold>Multiple</Bold>
                        causes checkboxes to appear next to items, so that multiple items can be chosen from the list.</Paragraph>
                    <Paragraph>
                        <Bold>Extended</Bold>
                        allows the user to select multiple items by using Ctrl+Click to select the individual items they want, or Shift+Click to select a range of contiguous items.</Paragraph>
                </RichTextBlock>
                <ListView
                    x:Name="Control2"
                    Width="400"
                    Height="400"
                    HorizontalAlignment="Left"
                    BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}"
                    BorderThickness="1"
                    ItemTemplate="{StaticResource ContactListViewTemplate}" />
            </StackPanel>
            <controls:ControlExample.Options>
                <StackPanel>
                    <ComboBox
                        Margin="0,12,0,0"
                        Header="SelectionMode"
                        SelectedIndex="1"
                        SelectionChanged="SelectionModeComboBox_SelectionChanged">
                        <x:String>None</x:String>
                        <x:String>Single</x:String>
                        <x:String>Multiple</x:String>
                        <x:String>Extended</x:String>
                    </ComboBox>
                </StackPanel>
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="SelectionMode" Value="{x:Bind Control2.SelectionMode, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="ListView\ListviewsDragDropReordering.txt">
            <Grid>
                <Grid.RowDefinitions>
                    <RowDefinition Height="Auto" />
                    <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="1*" />
                    <ColumnDefinition Width="1*" />
                </Grid.ColumnDefinitions>
                <TextBlock Style="{StaticResource BodyTextBlockStyle}">
                    In these ListView controls, you can drag and drop within a list to reorder items, or drag and drop between lists to move items.
                </TextBlock>
                <ListView
                    x:Name="DragDropListView"
                    Grid.Row="1"
                    Grid.Column="0"
                    Height="400"
                    MinWidth="350"
                    Margin="12"
                    AllowDrop="True"
                    BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}"
                    BorderThickness="1"
                    CanDragItems="True"
                    CanReorderItems="True"
                    DragItemsStarting="ListView_DragItemsStarting"
                    DragOver="Source_DragOver"
                    Drop="ListView_Drop"
                    ItemTemplate="{StaticResource ContactListViewTemplate}"
                    SelectionMode="Single" />
                <ListView
                    x:Name="DragDropListView2"
                    Grid.Row="1"
                    Grid.Column="1"
                    Height="400"
                    MinWidth="350"
                    AllowDrop="True"
                    BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}"
                    BorderThickness="1"
                    CanDragItems="True"
                    CanReorderItems="True"
                    DragEnter="Target_DragEnter"
                    DragItemsStarting="ListView_DragItemsStarting"
                    DragOver="Target_DragOver"
                    Drop="ListView_Drop"
                    ItemTemplate="{StaticResource ContactListViewTemplate}"
                    SelectionMode="Single" />
            </Grid>

            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="SelectionMode" Value="{x:Bind Control2.SelectionMode, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample
            SampleDefinition="ListView\ListviewGroupedHeaders.txt">
            <StackPanel>
                <TextBlock Margin="0,0,0,15" TextWrapping="Wrap">
                    Switch the toggle on the right to enable sticky group headers, which makes the headers stay put at the top of the ListView while scrolling.
                </TextBlock>
                <ListView
                    x:Name="GroupedListViewCtrl"
                    Width="400"
                    Height="400"
                    HorizontalAlignment="Left"
                    BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}"
                    BorderThickness="1"
                    ItemTemplate="{StaticResource ContactListViewTemplate}"
                    ItemsSource="{x:Bind ContactsCVS.View, Mode=OneWay}"
                    SelectionMode="Single"
                    ShowsScrollingPlaceholders="True">
                    <ListView.ItemsPanel>
                        <ItemsPanelTemplate>
                            <ItemsStackPanel
                                x:Name="GroupedStackPanel"
                                AreStickyGroupHeadersEnabled="False"
                                Loaded="StackPanel_loaded" />
                        </ItemsPanelTemplate>
                    </ListView.ItemsPanel>

                    <ListView.GroupStyle>
                        <GroupStyle>
                            <GroupStyle.HeaderTemplate>
                                <DataTemplate x:DataType="local:GroupInfoList">
                                    <Border AutomationProperties.AccessibilityView="Raw">
                                        <TextBlock
                                            AutomationProperties.AccessibilityView="Raw"
                                            Style="{ThemeResource TitleTextBlockStyle}"
                                            Text="{x:Bind Key}" />
                                    </Border>
                                </DataTemplate>
                            </GroupStyle.HeaderTemplate>
                        </GroupStyle>
                    </ListView.GroupStyle>
                </ListView>
            </StackPanel>
            <controls:ControlExample.Options>
                <StackPanel>
                    <ToggleSwitch
                        x:Name="StickySwitch"
                        Header="Sticky Headers"
                        IsOn="False"
                        Toggled="ToggleSwitch_Toggled" />
                </StackPanel>
            </controls:ControlExample.Options>

            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="AreStickyGroupHeadersEnabled" Value="{x:Bind StickySwitch.IsOn, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample
            SampleDefinition="ListView\ListviewFiltering.txt">
            <ListView
                x:Name="FilteredListView"
                Width="400"
                Height="400"
                BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}"
                BorderThickness="1"
                ItemTemplate="{StaticResource ContactListViewTemplate}"
                SelectionMode="Single"
                ShowsScrollingPlaceholders="True" />

            <controls:ControlExample.Options>
                <StackPanel Width="200">
                    <TextBlock Margin="8,8,8,4" Style="{ThemeResource BaseTextBlockStyle}">Filter by...</TextBlock>
                    <TextBox
                        x:Name="FilterByFirstName"
                        Margin="8"
                        HorizontalAlignment="Stretch"
                        Header="First name"
                        TextChanged="OnFilterChanged" />
                    <TextBox
                        x:Name="FilterByLastName"
                        Margin="8"
                        HorizontalAlignment="Stretch"
                        Header="Last name"
                        TextChanged="OnFilterChanged" />
                    <TextBox
                        x:Name="FilterByCompany"
                        Margin="8"
                        HorizontalAlignment="Stretch"
                        Header="Company"
                        TextChanged="OnFilterChanged" />
                </StackPanel>
            </controls:ControlExample.Options>

        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="ListView\ListviewMessagingDataLogging.txt">
            <StackPanel>
                <TextBlock Margin="0,0,0,15" TextWrapping="Wrap">
                    This ListView is inverted to grow from the bottom up. It's a good way to display logs or messages, with most recent at the bottom.
                </TextBlock>
                <ListView
                    x:Name="InvertedListView"
                    Height="400"
                    BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}"
                    BorderThickness="1"
                    ItemTemplate="{StaticResource MessageViewTemplate}"
                    SelectionMode="None">

                    <ListView.ItemsPanel>
                        <ItemsPanelTemplate>
                            <ItemsStackPanel VerticalAlignment="Bottom" ItemsUpdatingScrollMode="KeepLastItemInView" />
                        </ItemsPanelTemplate>
                    </ListView.ItemsPanel>

                    <ListView.ItemContainerStyle>
                        <Style TargetType="ListViewItem">
                            <Setter Property="HorizontalContentAlignment" Value="Stretch" />
                        </Style>
                    </ListView.ItemContainerStyle>

                </ListView>
            </StackPanel>
            <controls:ControlExample.Options>
                <StackPanel HorizontalAlignment="Right">
                    <Button Margin="0,0,0,10" Click="{x:Bind AddItemToEnd}">Send Message</Button>
                    <Button Click="MessageReceived">Receive Message</Button>
                </StackPanel>
            </controls:ControlExample.Options>

        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="ListView\ListviewImages.txt">
            <ListView
                x:Name="Control4"
                Height="400"
                MinWidth="550"
                AllowDrop="True"
                BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}"
                BorderThickness="1"
                CanDrag="True"
                CanDragItems="True"
                CanReorderItems="True">
                <ListView.ItemTemplate>
                    <DataTemplate x:DataType="local:CustomDataObject">
                        <Grid Margin="0,12,0,12" AutomationProperties.Name="{x:Bind Title}">
                            <Grid.ColumnDefinitions>
                                <ColumnDefinition Width="Auto" MinWidth="150" />
                                <ColumnDefinition Width="*" />
                            </Grid.ColumnDefinitions>
                            <Image
                                MaxHeight="100"
                                Source="{x:Bind ImageLocation}"
                                Stretch="Fill" />

                            <StackPanel Grid.Column="1" Margin="12,0,0,0">
                                <TextBlock
                                    Margin="0,0,0,6"
                                    HorizontalAlignment="Left"
                                    FontSize="14"
                                    FontWeight="SemiBold"
                                    LineHeight="20"
                                    Style="{ThemeResource BaseTextBlockStyle}"
                                    Text="{x:Bind Title}" />
                                <TextBlock
                                    Width="350"
                                    MaxHeight="60"
                                    Margin="0,0,0,10"
                                    FontFamily="Segoe UI"
                                    FontWeight="Normal"
                                    IsTextTrimmedChanged="TextBlock_IsTextTrimmedChanged"
                                    Style="{ThemeResource BodyTextBlockStyle}"
                                    Text="{x:Bind Description}"
                                    TextTrimming="CharacterEllipsis"
                                    TextWrapping="Wrap" />
                                <StackPanel Orientation="Horizontal">
                                    <TextBlock
                                        Margin="0"
                                        Style="{ThemeResource CaptionTextBlockStyle}"
                                        Text="{x:Bind Views}" />
                                    <TextBlock Style="{ThemeResource CaptionTextBlockStyle}" Text=" Views " />
                                    <TextBlock Style="{ThemeResource CaptionTextBlockStyle}" Text=" &#x22C5; " />
                                    <TextBlock
                                        Margin="5,0,0,0"
                                        Style="{ThemeResource CaptionTextBlockStyle}"
                                        Text="{x:Bind Likes}" />
                                    <TextBlock Style="{ThemeResource CaptionTextBlockStyle}" Text=" Likes" />
                                </StackPanel>
                            </StackPanel>
                        </Grid>
                    </DataTemplate>
                </ListView.ItemTemplate>
            </ListView>

        </controls:ControlExample>


        <controls:ControlExample SampleDefinition="ListView\ListviewContextMenus.txt">
            <StackPanel>
                <TextBlock
                    Margin="0,0,0,15"
                    Text="This ListView allows users to right click to open a context menu. In this case, the context menu provides the option to delete an entry."
                    TextWrapping="Wrap" />
                <ListView
                    x:Name="ContextMenuList"
                    Width="400"
                    Height="400"
                    HorizontalAlignment="Left"
                    BorderThickness="1"
                    SelectionMode="Single"
                    ShowsScrollingPlaceholders="True">
                    <ListView.ItemTemplate>
                        <DataTemplate x:DataType="local:Contact">
                            <Grid>
                                <Grid.ContextFlyout>
                                    <MenuFlyout>
                                        <MenuFlyoutItem Click="ContactDeleteMenuItem_Click" Text="Delete" />
                                    </MenuFlyout>
                                </Grid.ContextFlyout>

                                <Grid.RowDefinitions>
                                    <RowDefinition Height="*" />
                                    <RowDefinition Height="*" />
                                </Grid.RowDefinitions>
                                <Grid.ColumnDefinitions>
                                    <ColumnDefinition Width="Auto" />
                                    <ColumnDefinition Width="*" />
                                </Grid.ColumnDefinitions>
                                <Ellipse
                                    x:Name="Ellipse"
                                    Grid.RowSpan="2"
                                    Width="32"
                                    Height="32"
                                    Margin="6"
                                    HorizontalAlignment="Center"
                                    VerticalAlignment="Center"
                                    Fill="{ThemeResource ControlStrongFillColorDefaultBrush}" />
                                <TextBlock
                                    Grid.Column="1"
                                    Margin="12,6,0,0"
                                    x:Phase="1"
                                    Style="{ThemeResource BaseTextBlockStyle}"
                                    Text="{x:Bind Name}" />
                                <TextBlock
                                    Grid.Row="1"
                                    Grid.Column="1"
                                    Margin="12,0,0,6"
                                    x:Phase="2"
                                    Style="{ThemeResource BodyTextBlockStyle}"
                                    Text="{x:Bind Company}" />
                            </Grid>
                        </DataTemplate>
                    </ListView.ItemTemplate>
                </ListView>
            </StackPanel>



        </controls:ControlExample>

    </StackPanel>
</pages:ItemsPageBase>

```

## 主页面 C# (ListViewPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Navigation;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using Windows.ApplicationModel.DataTransfer;
using WinUIGallery.Helpers;
using WinUIGallery.Pages;

namespace WinUIGallery.ControlPages;

public sealed partial class ListViewPage : ItemsPageBase
{
    ObservableCollection<Contact> contacts1 = new ObservableCollection<Contact>();
    ObservableCollection<Contact> contacts2 = new ObservableCollection<Contact>();
    ObservableCollection<Contact> contacts3 = new ObservableCollection<Contact>();
    ObservableCollection<Contact> contacts3Filtered = new ObservableCollection<Contact>();
    ObservableCollection<Contact> contacts4ContextMenu = new ObservableCollection<Contact>();

    ItemsStackPanel? stackPanelObj;

    int messageNumber;

    public ListViewPage()
    {
        this.InitializeComponent();
        // Add first item to inverted list so it's not empty
        AddItemToEnd();
        BaseExample.Loaded += BaseExample_Loaded;
    }

    private void BaseExample_Loaded(object sender, RoutedEventArgs e)
    {
        // Set focus so the first item of the listview has focus
        // instead of some item which is not visible on page load
        BaseExample.Focus(FocusState.Programmatic);
    }

    protected override async void OnNavigatedTo(NavigationEventArgs e)
    {
        Items = ControlInfoDataSource.Instance.Groups.Take(3).SelectMany(g => g.Items).ToList();
        BaseExample.ItemsSource = await Contact.GetContactsAsync();
        Control2.ItemsSource = await Contact.GetContactsAsync();
        contacts1 = await Contact.GetContactsAsync();

        DragDropListView.ItemsSource = contacts1;

        contacts2.Add(new Contact("John", "Doe", "ABC Printers"));
        contacts2.Add(new Contact("Jane", "Doe", "XYZ Refrigerators"));
        contacts2.Add(new Contact("Santa", "Claus", "North Pole Toy Factory Inc."));
        DragDropListView2.ItemsSource = contacts2;

        Control4.ItemsSource = WinUIGallery.ControlPages.CustomDataObject.GetDataObjects();
        ContactsCVS.Source = await Contact.GetContactsGroupedAsync();

        // Initialize list of contacts to be filtered
        contacts3 = await Contact.GetContactsAsync();
        contacts3Filtered = new ObservableCollection<Contact>(contacts3);

        // Initializze list of contacts for context menu sample
        contacts4ContextMenu = await Contact.GetContactsAsync();
        ContextMenuList.ItemsSource = contacts4ContextMenu;

        FilteredListView.ItemsSource = contacts3Filtered;
    }

    //===================================================================================================================
    // Selection Modes Example
    //===================================================================================================================
    private void SelectionModeComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (Control2 != null)
        {
            string? selectionMode = e.AddedItems[0].ToString();
            switch (selectionMode)
            {
                case "None":
                    Control2.SelectionMode = ListViewSelectionMode.None;
                    break;
                case "Single":
                    Control2.SelectionMode = ListViewSelectionMode.Single;
                    break;
                case "Multiple":
                    Control2.SelectionMode = ListViewSelectionMode.Multiple;
                    break;
                case "Extended":
                    Control2.SelectionMode = ListViewSelectionMode.Extended;
                    break;
            }
        }
    }

    //===================================================================================================================
    // Drag/Drop Example
    //===================================================================================================================

    private void ListView_DragItemsStarting(object sender, DragItemsStartingEventArgs e)
    {
        var contactsToMove = e.Items.OfType<Contact>().ToList();
        e.Data.Properties["contacts"] = contactsToMove;
        e.Data.RequestedOperation = DataPackageOperation.Move;
    }

    private void Target_DragOver(object sender, DragEventArgs e)
    {
        e.AcceptedOperation = DataPackageOperation.Move;
    }

    private void Source_DragOver(object sender, DragEventArgs e)
    {
        e.AcceptedOperation = DataPackageOperation.Move;
    }

    private void ListView_Drop(object sender, DragEventArgs e)
    {
        ListView target = (ListView)sender;

        if (e.DataView.Properties["contacts"] != null)
        {
            DragOperationDeferral def = e.GetDeferral();
            var contactsToMove = (List<Contact>)e.DataView.Properties["contacts"];

            foreach (var contactToMove in contactsToMove)
            {
                // Find the insertion index:
                Windows.Foundation.Point pos = e.GetPosition(target.ItemsPanelRoot);

                // If the target ListView has items in it, use the height of the first item
                //      to find the insertion index.
                int index = 0;
                if (target.Items.Count != 0)
                {
                    // Get a reference to the first item in the ListView
                    ListViewItem sampleItem = (ListViewItem)target.ContainerFromIndex(0);

                    // Adjust itemHeight for margins
                    double itemHeight = sampleItem.ActualHeight + sampleItem.Margin.Top + sampleItem.Margin.Bottom;

                    // Find index based on dividing number of items by height of each item
                    index = Math.Min(target.Items.Count - 1, (int)(pos.Y / itemHeight));

                    // Find the item being dropped on top of.
                    ListViewItem targetItem = (ListViewItem)target.ContainerFromIndex(index);

                    // If the drop position is more than half-way down the item being dropped on
                    //      top of, increment the insertion index so the dropped item is inserted
                    //      below instead of above the item being dropped on top of.
                    Windows.Foundation.Point positionInItem = e.GetPosition(targetItem);
                    if (positionInItem.Y > itemHeight / 2)
                    {
                        index++;
                    }

                    // Don't go out of bounds
                    index = Math.Min(target.Items.Count, index);
                }
                // Only other case is if the target ListView has no items (the dropped item will be
                //      the first). In that case, the insertion index will remain zero.

                // Find correct source list
                if (target.Name == "DragDropListView")
                {
                    // Find the ItemsSource for the target ListView and insert
                    contacts1.Insert(index, contactToMove);
                    //Go through source list and remove the items that are being moved
                    foreach (Contact contact in DragDropListView2.Items)
                    {
                        if (contact.FirstName == contactToMove.FirstName && contact.LastName == contactToMove.LastName && contact.Company == contactToMove.Company)
                        {
                            contacts2.Remove(contact);
                            break;
                        }
                    }
                }
                else if (target.Name == "DragDropListView2")
                {
                    contacts2.Insert(index, contactToMove);
                    foreach (Contact contact in DragDropListView.Items)
                    {
                        if (contact.FirstName == contactToMove.FirstName && contact.LastName == contactToMove.LastName && contact.Company == contactToMove.Company)
                        {
                            contacts1.Remove(contact);
                            break;
                        }
                    }
                }
            }

            e.AcceptedOperation = DataPackageOperation.Move;
            def.Complete();
        }
    }

    private void Target_DragEnter(object sender, DragEventArgs e)
    {
        // We don't want to show the Move icon
        e.DragUIOverride.IsGlyphVisible = false;
    }

    //===================================================================================================================
    // Grouped Headers Example
    //===================================================================================================================
    private void ToggleSwitch_Toggled(object sender, RoutedEventArgs e)
    {
        if (StickySwitch != null && stackPanelObj is not null)
        {
            if (StickySwitch.IsOn == true)
            {
                stackPanelObj.AreStickyGroupHeadersEnabled = true;
            }
            else
            {
                stackPanelObj.AreStickyGroupHeadersEnabled = false;
            }
        }
    }

    private void StackPanel_loaded(object sender, RoutedEventArgs e)
    {
        stackPanelObj = sender as ItemsStackPanel;
    }

    //===================================================================================================================
    // Filtered List Example
    //===================================================================================================================
    private void Remove_NonMatching(IEnumerable<Contact> filteredData)
    {
        for (int i = contacts3Filtered.Count - 1; i >= 0; i--)
        {
            var item = contacts3Filtered[i];
            // If contact is not in the filtered argument list, remove it from the ListView's source.
            if (!filteredData.Contains(item))
            {
                contacts3Filtered.Remove(item);
            }
        }
    }

    private void AddBack_Contacts(IEnumerable<Contact> filteredData)
    // When a user hits backspace, more contacts may need to be added back into the list
    {
        foreach (var item in filteredData)
        {
            // If item in filtered list is not currently in ListView's source collection, add it back in
            if (!contacts3Filtered.Contains(item))
            {
                contacts3Filtered.Add(item);
            }
        }
    }

    private void OnFilterChanged(object sender, TextChangedEventArgs args)
    {
        // Linq query that selects only items that return True after being passed through Filter function
        var filtered = contacts3.Where(contact => Filter(contact));
        Remove_NonMatching(filtered);
        AddBack_Contacts(filtered);

        UIHelper.AnnounceActionForAccessibility(FilteredListView, $"Found {filtered.Count()} contacts", "ContactListViewFilteredActivityId");
    }

    private bool Filter(Contact contact)
    {
        // When the text in any filter is changed, contact list is ran through all three filters to make sure
        // they can properly interact with each other (i.e. they can all be applied at the same time).

        return contact.FirstName.Contains(FilterByFirstName.Text, StringComparison.InvariantCultureIgnoreCase) &&
               contact.LastName.Contains(FilterByLastName.Text, StringComparison.InvariantCultureIgnoreCase) &&
               contact.Company.Contains(FilterByCompany.Text, StringComparison.InvariantCultureIgnoreCase);
    }

    //===================================================================================================================
    // Inverted List Example
    //===================================================================================================================

    private void AddItemToEnd()
    {
        InvertedListView.Items.Add(
            new Message("Message " + ++messageNumber, DateTime.Now, HorizontalAlignment.Right)
            );
    }

    private void MessageReceived(object sender, RoutedEventArgs e)
    {
        InvertedListView.Items.Add(
            new Message("Message " + ++messageNumber, DateTime.Now, HorizontalAlignment.Left)
            );
    }

    //===================================================================================================================
    // ListView with Images Sample
    //===================================================================================================================

    private void TextBlock_IsTextTrimmedChanged(TextBlock sender, IsTextTrimmedChangedEventArgs args)
    {
        var textBlock = sender as TextBlock;
        var text = textBlock.IsTextTrimmed ? textBlock.Text : string.Empty;

        ToolTipService.SetToolTip(textBlock, text);
    }


    //===================================================================================================================
    // ListView with context menu
    //===================================================================================================================

    private void ContactDeleteMenuItem_Click(object sender, RoutedEventArgs e)
    {
        if ((sender as FrameworkElement)?.DataContext is not Contact contact)
        {
            return;
        }

        contacts4ContextMenu.Remove(contact);
    }
}

public class Message
{
    public string MsgText { get; private set; }
    public DateTime MsgDateTime { get; private set; }
    public HorizontalAlignment MsgAlignment { get; set; }
    public Message(string text, DateTime dateTime, HorizontalAlignment align)
    {
        MsgText = text;
        MsgDateTime = dateTime;
        MsgAlignment = align;
    }

    public override string ToString()
    {
        return MsgDateTime.ToString() + " " + MsgText;
    }
}

public class Contact
{
    #region Properties
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string Company { get; private set; }
    public string Name => FirstName + " " + LastName;
    #endregion

    public Contact(string firstName, string lastName, string company)
    {
        FirstName = firstName;
        LastName = lastName;
        Company = company;
    }

    #region Public Methods
    public async static Task<ObservableCollection<Contact>> GetContactsAsync()
    {
        IList<string> lines = await FileLoader.LoadLines("Assets/SampleMedia/Contacts.txt");

        ObservableCollection<Contact> contacts = new ObservableCollection<Contact>();

        for (int i = 0; i < lines.Count - 2; i += 3)
        {
            contacts.Add(new Contact(lines[i], lines[i + 1], lines[i + 2]));
        }

        return contacts;
    }

    public static async Task<ObservableCollection<GroupInfoList>> GetContactsGroupedAsync()
    {
        var query = from item in await GetContactsAsync()
                    group item by item.LastName.Substring(0, 1).ToUpper() into g
                    orderby g.Key
                    select new GroupInfoList(g) { Key = g.Key };

        return new ObservableCollection<GroupInfoList>(query);
    }

    public override string ToString()
    {
        return $"{Name}, {Company}";
    }
    #endregion
}

public partial class GroupInfoList : List<object>
{
    public GroupInfoList(IEnumerable<object> items) : base(items)
    {
    }
    public object? Key { get; set; }

    public override string ToString()
    {
        return "Group " + Key?.ToString();
    }
}

```

## 示例文件

### BasicListviewSimpleDatatemplate.txt
```
--- header
Basic ListView with Simple DataTemplate
--- xaml
<!-- XAML Code -->

<ListView
    x:Name="BaseExample"
    ItemTemplate="{StaticResource ContactListViewTemplate}"
    BorderThickness="1"
    BorderBrush="{ThemeResource SystemControlForegroundBaseMediumLowBrush}"
    Width="350" 
    Height="400"
    HorizontalAlignment="Left"/>
                
<!-- In this example, the ListView's ItemTemplate property is bound to a data template (shown below)
called ContactListViewTemplate, defined in a Page.Resources section. -->
    
<DataTemplate x:Key="ContactListViewTemplate" x:DataType="local:Contact">
     <TextBlock Text="{x:Bind Name}" x:Phase="1" Margin="0,5,0,5"/>
</DataTemplate>
--- c#
// C# code-behind
                   
// The data template is defined to display a Contact object (class definition shown below), and the text 
// displayed is bound to the Contact object's Name attribute.

public class Contact
{
        public string FirstName { get; private set; } = string.Empty;
        public string LastName { get; private set; } = string.Empty;
        public string Company { get; private set; } = string.Empty;
        public string Name => FirstName + " " + LastName;

        public Contact(string firstName, string lastName, string company)
        {
            FirstName = firstName;
            LastName = lastName;
            Company = company;
        }                    
}
                    
// The ItemsSource for the ListView is generated by a method of the Contact class called 
// GetContactsAsync().This method pulls data from an internal data source and creates 
// Contact objects from that data. Those Contact objects are placed in a collection 
// which is returned from the GetContactsAsync() function.

BaseExample.ItemsSource = await Contact.GetContactsAsync();
```

### ListviewContextMenus.txt
```
--- header
ListView with context menus
--- xaml
<ListView
    ItemsSource="{x:Bind contacts, Mode=OneWay}"
    SelectionMode="Single"
    ShowsScrollingPlaceholders="True"
    Height="400"
    Width="400"
    BorderThickness="1"
    BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}"
    HorizontalAlignment="Left">
    <ListView.ItemTemplate>
        <DataTemplate x:DataType="local:Contact">
            <Grid>
                <Grid.ContextFlyout>
                    <MenuFlyout>
                        <MenuFlyoutItem Text="Delete" Click="ContactDeleteMenuItem_Click"/>
                    </MenuFlyout>
                </Grid.ContextFlyout>
             
                <Grid.RowDefinitions>
                    <RowDefinition Height="*"/>
                    <RowDefinition Height="*"/>
                </Grid.RowDefinitions>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="Auto"/>
                    <ColumnDefinition Width="*"/>
                </Grid.ColumnDefinitions>
                <Ellipse x:Name="Ellipse"
                    Grid.RowSpan="2"
                    Width ="32"
                    Height="32"
                    Margin="6"
                    VerticalAlignment="Center"
                    HorizontalAlignment="Center"
                    Fill="{ThemeResource ControlStrongFillColorDefaultBrush}"/>
                <TextBlock Grid.Column="1"
                    Text="{x:Bind Name}"
                    x:Phase="1"
                    Style="{ThemeResource BaseTextBlockStyle}"
                    Margin="12,6,0,0"/>
                <TextBlock Grid.Column="1"
                    Grid.Row="1"
                    Text="{x:Bind Company}"
                    x:Phase="2"
                    Style="{ThemeResource BodyTextBlockStyle}"
                    Margin="12,0,0,6"/>
            </Grid>
        </DataTemplate>
    </ListView.ItemTemplate>
</DataTemplate>
--- c#
ObservableCollection<Contact> contacts = new ObservableCollection<Contact>();

private void ContactDeleteMenuItem_Click(object sender, RoutedEventArgs e)
{
    var item = (sender as FrameworkElement).DataContext;
    var contact = item as Contact;
    contacts.Remove(contact);
}
```

### ListviewFiltering.txt
```
--- header
ListView with filtering
--- xaml
<!-- XAML Code -->

<!-- The ListView's ItemsSource is an ObservableCollection<Contact> that is defined and bound
in the code-behind, called contactsFiltered. This ListView uses the same DataTemplate as the
samples above it, called ContactListViewTemplate - you can see its definition above. -->

<ListView 
    x:Name="FilteredListView"
    ItemTemplate="{StaticResource ContactListViewTemplate}"
    SelectionMode="Single"
    ShowsScrollingPlaceholders="True"
    Height="400"
    Width="400"
    BorderThickness="1"
    BorderBrush="{ThemeResource SystemControlForegroundBaseMediumLowBrush}"/>

<!-- The textboxes used for filtering are shown below: -->
<StackPanel Width="200">
    <TextBlock Margin="8,8,8,4" Style="{ThemeResource BaseTextBlockStyle}">Filter by...</TextBlock>
    <TextBox x:Name="FilterByFirstName" Width="150" Header="First name" Margin="8"
	     HorizontalAlignment="Left" TextChanged="OnFilterChanged"/>
    <TextBox x:Name="FilterByLastName" Width="150" Header="Last name" Margin="8"
	     HorizontalAlignment="Left" TextChanged="OnFilterChanged"/>
    <TextBox x:Name="FilterByCompany" Width="150" Header="Company" Margin="8" 
	     HorizontalAlignment="Left" TextChanged="OnFilterChanged"/>
</StackPanel>
--- c#
// C# Code

// Make sure to add this to your declarations at the top for the filtering method:
using System.Linq;
// ...

// Define an ObservableCollection<Contact> object to serve as the ListView's
// ItemsSource. This collection will get updated after the filters are used:
ObservableCollection<Contact> contactsFiltered = new ObservableCollection<Contact>();

/* Populate contactsFiltered with all contact objects (in this case, contacts holds
all of our Contact objects so we copy them into contactsFiltered). Set this newly populated
collection as the ItemsSource for the ListView. */
contactsFiltered = new ObservableCollection<Contact>(allContacts);
FilteredListView.ItemsSource = contactsFiltered;


// Whenever text changes in any of the filtering text boxes, the following function is called:
private void OnFilterChanged(object sender, TextChangedEventArgs args)
{
    // This is a Linq query that selects only items that return True after being passed through
    // the Filter function, and adds all of those selected items to filtered.
    var filtered = allContacts.Where(contact => Filter(contact));
    Remove_NonMatching(filtered);
    AddBack_Contacts(filtered);
}

// The following functions are called inside OnFilterChanged:

/* When the text in any filter is changed, perform a check on each item in the original 
contact list to see if the item should be displayed, taking into account all three of the
filters currently applied. If the item passes all three checks for all three filters, 
the function returns true and the item is added to the filtered list above. */
private bool Filter(Contact contact)
{
    return contact.FirstName.Contains(FilterByFirstName.Text, StringComparison.InvariantCultureIgnoreCase) &&
            contact.LastName.Contains(FilterByLastName.Text, StringComparison.InvariantCultureIgnoreCase) &&
            contact.Company.Contains(FilterByCompany.Text, StringComparison.InvariantCultureIgnoreCase);
}

/* These functions go through the current list being displayed (contactsFiltered), and remove
any items not in the filtered collection (any items that don't belong), or add back any items 
from the original allContacts list that are now supposed to be displayed (i.e. when backspace is hit). */

private void Remove_NonMatching(IEnumerable<Contact> filteredData)
{
    for (int i = contactsFiltered.Count - 1; i >= 0; i--)
    {
        var item = contactsFiltered[i];
        // If contact is not in the filtered argument list, remove it from the ListView's source.
        if (!filteredData.Contains(item))
        {
            contactsFiltered.Remove(item);
        }
    }
}

private void AddBack_Contacts(IEnumerable<Contact> filteredData)
{
    foreach (var item in filteredData)
    {
        // If item in filtered list is not currently in ListView's source collection, add it back in
        if (!contactsFiltered.Contains(item))
        {
            contactsFiltered.Add(item);
        }
    }
}
```

### ListviewGroupedHeaders.txt
```
--- header
ListView with Grouped Headers
--- xaml
<!-- XAML Code -->

<!-- ListViews with grouped items must be bound to a CollectionViewSource, as shown below.
This CollectionViewSource is defined in the XAML below, but is bound to an ItemsSource in the C#
code-behind. See the C# code below for more details on how to create/bind to a grouped list. -->

<CollectionViewSource x:Name="ContactsCVS" IsSourceGrouped="True"/>
                          
<ListView ItemsSource="{x:Bind ContactsCVS.View, Mode=OneWay}">
    <ListView.ItemsPanel>
        <ItemsPanelTemplate>
            <ItemsStackPanel AreStickyGroupHeadersEnabled="$(AreStickyGroupHeadersEnabled)"/>
        </ItemsPanelTemplate>
    </ListView.ItemsPanel>
    <ListView.GroupStyle>
        <GroupStyle >
            <GroupStyle.HeaderTemplate>
                <DataTemplate x:DataType="local:GroupInfoList">
                    <Border AutomationProperties.AccessibilityView="Raw">
                        <TextBlock Text="{x:Bind Key}" Style="{ThemeResource TitleTextBlockStyle}" AutomationProperties.AccessibilityView="Raw"/>
                    </Border>
                </DataTemplate>
            </GroupStyle.HeaderTemplate>
        </GroupStyle>
    </ListView.GroupStyle>
</ListView>
                    
<!-- Data template used is same as above examples. -->
--- c#
// C# Code

// To create a collection of grouped items, create a query that groups
// an existing list, or returns a grouped collection from a database.
// The following method is used to create the ItemsSource for our CollectionViewSource:

public static async Task<ObservableCollection<GroupInfoList>> GetContactsGroupedAsync()
{
    // Grab Contact objects from pre-existing list (list is returned from function GetContactsAsync())
    var query = from item in await GetContactsAsync()

    // Group the items returned from the query, sort and select the ones you want to keep
    group item by item.LastName.Substring(0, 1).ToUpper() into g
    orderby g.Key

    // GroupInfoList is a simple custom class that has an IEnumerable type attribute, and
    // a key attribute. The IGrouping-typed variable g now holds the Contact objects, 
    // and these objects will be used to create a new GroupInfoList object.
    select new GroupInfoList(g) { Key = g.Key };
    
    return new ObservableCollection<GroupInfoList>(query);
}

// GroupInfoList class definition:
public class GroupInfoList : List<object>
{
    public GroupInfoList(IEnumerable<object> items) : base(items)
    {
    }

    public object Key { get; set; }

    public override string ToString()
    {
        return "Group " + Key.ToString();
    }
}

// Contact class definition:
public class Contact
{
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string Company { get; private set; } = string.Empty;
    public string Name => FirstName + " " + LastName;

    public Contact(string firstName, string lastName, string company)
    {
        FirstName = firstName;
        LastName = lastName;
        Company = company;
    }

    // ... Methods ...
}

ContactsCVS.Source = await Contact.GetContactsGroupedAsync();
```

### ListviewImages.txt
```
--- header
ListView with Images
--- xaml
<ListView x:Name="Control4"
     Height="400"
     MinWidth="550"
     BorderThickness="1"
     BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}">
                    
<!-- Data Template Used: -->
<!-- The data template is bound to a custom-created data type called CustomDataObject. -->
<!-- The full code for the class can be found in this page's source code, but its attributes are referenced/bound below. -->

<DataTemplate x:DataType="local:CustomDataObject">
    <Grid Margin="0,12,0,12" AutomationProperties.Name="{x:Bind Title}">
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="Auto" MinWidth="150"/>
            <ColumnDefinition Width="*" />
        </Grid.ColumnDefinitions>
        <Image Source="{x:Bind ImageLocation}" MaxHeight="100" Stretch="Fill"/>

        <StackPanel Margin="12,0,0,0" Grid.Column="1" >
            <TextBlock Text="{x:Bind Title}" FontSize="14" FontWeight="SemiBold" Style="{ThemeResource BaseTextBlockStyle}"
                        HorizontalAlignment="Left" Margin="0,0,0,6" LineHeight="20"/>
            <TextBlock Text="{x:Bind Description}" FontFamily="Segoe UI" FontWeight="Normal" Style="{ThemeResource BodyTextBlockStyle}"
                        TextTrimming="CharacterEllipsis" Width="350" MaxLines="1"/>
            <StackPanel Orientation="Horizontal">
                <TextBlock Text="{x:Bind Views}" HorizontalAlignment="Left" Style="{ThemeResource CaptionTextBlockStyle}" Margin="0,0,0,0"/>
                <TextBlock Text=" Views " HorizontalAlignment="Left" Style="{ThemeResource CaptionTextBlockStyle}"/>
                <TextBlock Text=" · " Style="{ThemeResource CaptionTextBlockStyle}" 
                            HorizontalAlignment="Left"/>
                <TextBlock Text="{x:Bind Likes}" HorizontalAlignment="Left" Style="{ThemeResource CaptionTextBlockStyle}" Margin="5,0,0,0"/>
                <TextBlock Text=" Likes" HorizontalAlignment="Left" Style="{ThemeResource CaptionTextBlockStyle}"/>
            </StackPanel>
        </StackPanel>
    </Grid>
</DataTemplate>
```

### ListviewMessagingDataLogging.txt
```
--- header
ListView for Messaging or Data Logging
--- xaml
<ListView x:Name="InvertedListView"
             ItemTemplate="{StaticResource MessageViewTemplate}">
                    
     <!-- The ItemsStackPanel must be edited to update the following two properties -->
     <!-- These properties allow the list to grow from the bottom -->
     <ListView.ItemsPanel>
         <ItemsPanelTemplate>
             <ItemsStackPanel ItemsUpdatingScrollMode="KeepLastItemInView" 
                              VerticalAlignment="Bottom"/>
         </ItemsPanelTemplate>
     </ListView.ItemsPanel>

     <!-- This setter property is created so ListViewItems correctly align to the left or right. -->
     <ListView.ItemContainerStyle>
         <Style TargetType="ListViewItem">
             <Setter Property="HorizontalContentAlignment" Value="Stretch"/>
         </Style>
     </ListView.ItemContainerStyle>
</ListView>

<!-- Data template used: -->
<!-- The data template is bound to a custom DataType called Message. -->
<!-- Each Message object has a color and alignment assigned to it based on whether it was 
sent or received, and those values are bound in the DataTemplate.-->
<DataTemplate x:Key="MessageViewTemplate" x:DataType="local:Message">
    <Grid Height="Auto" Margin="4" HorizontalAlignment="{x:Bind MsgAlignment}">
        <StackPanel MinHeight="75" Width="350" Padding="10, 0, 0, 10" Background="{ThemeResource SystemColorHighlightColor}" CornerRadius="{StaticResource ControlCornerRadius}">
            <TextBlock Text="{x:Bind MsgText}" Padding="0, 10, 0, 0" FontSize="20" Foreground="{ThemeResource SystemColorHighlightTextColor}"/>
            <TextBlock Text="{x:Bind MsgDateTime}" Padding="0, 0, 0, 10" FontSize="15" Foreground="{ThemeResource SystemColorHighlightTextColor}"/>
        </StackPanel>
    </Grid>
</DataTemplate>
```

### ListviewSelectionSupport.txt
```
--- header
ListView with Selection Support
--- xaml
<!-- To create this sample, add/change the following properties onto the code for the base example above: -->
                        
<ListView 
    SelectionMode="$(SelectionMode)" 
    ItemTemplate="{StaticResource ContactListViewTemplate}"/>
    
<!-- DataTemplate used: -->

<DataTemplate x:Key="ContactListViewTemplate" x:DataType="local:Contact">
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="*"/>
            <RowDefinition Height="*"/>
        </Grid.RowDefinitions>
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="Auto"/>
            <ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>
        <Ellipse x:Name="Ellipse"
                    Grid.RowSpan="2"
                    Width ="32"
                    Height="32"
                    Margin="6"
                    VerticalAlignment="Center"
                    HorizontalAlignment="Center"
                    Fill="{ThemeResource SystemControlBackgroundBaseMediumBrush}"/>
        <TextBlock Grid.Column="1"
                    Text="{x:Bind Name}"
                    x:Phase="1"
                    Style="{ThemeResource BaseTextBlockStyle}"
                    Margin="12,6,0,0"/>
        <TextBlock  Grid.Column="1"
                    Grid.Row="1"
                    Text="{x:Bind Company}"
                    x:Phase="2"
                    Style="{ThemeResource BodyTextBlockStyle}"
                    Margin="12,0,0,6"/>
    </Grid>
</DataTemplate>
```

### ListviewsDragDropReordering.txt
```
--- header
ListViews with Drag, Drop, and Reordering Support
--- xaml
<!-- Full code to implement dragging and dropping between lists can be found in the 
source code for the WinUI Gallery. -->

<!-- The following properties should be added to the ListView definitions to build this sample. -->
<ListView CanDragItems="True" CanReorderItems="True" AllowDrop="True"
    SelectionMode="Single" />
    
<!-- DataTemplate used is the same as the above sample. -->
```


# PullToRefresh

## 主页面 XAML (PullToRefreshPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.PullToRefreshPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">   
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="PullToRefresh\BasicPulltorefresh.txt">
            <controls:ControlExample.Example>
                <Grid>
                    <RefreshContainer
                        x:Name="rc"
                        HorizontalAlignment="Center"
                        VerticalAlignment="Center"
                        RefreshRequested="rc_RefreshRequested">
                        <ListView
                            x:Name="lv"
                            Height="200"
                            MinWidth="200"
                            BorderBrush="{ThemeResource TextControlBorderBrush}"
                            BorderThickness="1" />
                    </RefreshContainer>
                </Grid>
            </controls:ControlExample.Example>

        </controls:ControlExample>

        <controls:ControlExample x:Name="Example2" SampleDefinition="PullToRefresh\CustomIconPulltorefresh.txt">
            <controls:ControlExample.Example>
                <Grid x:Name="Ex2Grid">
                    <Grid.RowDefinitions>
                        <RowDefinition Height="Auto" />
                        <RowDefinition />
                    </Grid.RowDefinitions>
                </Grid>
            </controls:ControlExample.Example>

        </controls:ControlExample>

    </StackPanel>
</Page>

```

## 主页面 C# (PullToRefreshPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Composition;
using Microsoft.UI.Dispatching;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Hosting;
using Microsoft.UI.Xaml.Media;
using Microsoft.UI.Xaml.Media.Imaging;
using Microsoft.UI.Xaml.Navigation;
using System;
using System.Collections.ObjectModel;
using Windows.Foundation;
using Windows.Foundation.Metadata;
using Windows.UI.ViewManagement;
using WinUIGallery.Helpers;

namespace WinUIGallery.ControlPages;

public sealed partial class PullToRefreshPage : Page
{
    private ObservableCollection<string> items1 = new ObservableCollection<string>();
    private ObservableCollection<string> items2 = new ObservableCollection<string>();
    private DispatcherTimer timer1 = new DispatcherTimer();
    private DispatcherTimer timer2 = new DispatcherTimer();
    private Visual? visualizerContentVisual;
    private static RefreshContainer? rc2;
    private RefreshVisualizer? rv2;

    private int items1AddedCount = 0;
    private int items2AddedCount = 0;

    private Deferral? RefreshCompletionDeferral1
    {
        get;
        set;
    }
    private Deferral? RefreshCompletionDeferral2
    {
        get;
        set;
    }

    public PullToRefreshPage()
    {
        this.InitializeComponent();

        if (ApiInformation.IsApiContractPresent("Windows.Foundation.UniversalApiContract", 6))
        {
            rc2 = new RefreshContainer();
            rc2.RefreshRequested +=
                new TypedEventHandler<RefreshContainer, RefreshRequestedEventArgs>(rc2_RefreshRequested);

            rv2 = new RefreshVisualizer();
            rv2.RefreshStateChanged +=
                new TypedEventHandler<RefreshVisualizer, RefreshStateChangedEventArgs>(rv2_RefreshStateChanged);

            Image ptrImage = new Image();
            AccessibilitySettings accessibilitySettings = new AccessibilitySettings();
            // Checking light theme
            if ((ThemeHelper.RootTheme == ElementTheme.Light || Application.Current.RequestedTheme == ApplicationTheme.Light)
                && !accessibilitySettings.HighContrast)
            {
                ptrImage.Source = new BitmapImage(new Uri("ms-appx:///Assets/SampleMedia/SunBlack.png"));
            }
            // Checking high contrast theme
            else if (accessibilitySettings.HighContrast
                      && accessibilitySettings.HighContrastScheme.Equals("High Contrast Black"))
            {
                ptrImage.Source = new BitmapImage(new Uri("ms-appx:///Assets/SampleMedia/SunBlack.png"));
            }
            else
            {
                ptrImage.Source = new BitmapImage(new Uri("ms-appx:///Assets/SampleMedia/SunWhite.png"));

            }

            ptrImage.Width = 35;
            ptrImage.Height = 35;

            rv2.Content = ptrImage;
            rc2.Visualizer = rv2;

            ListView lv2 = new ListView
            {
                Width = 200,
                Height = 200,
                BorderThickness = new Thickness() { Left = 1, Top = 1, Right = 1, Bottom = 1 },
                HorizontalAlignment = HorizontalAlignment.Center,
                BorderBrush = (Brush)Application.Current.Resources["TextControlBorderBrush"]
            };


            rc2.Content = lv2;

            Ex2Grid.Children.Add(rc2);
            Grid.SetRow(rc2, 1);
            Grid.SetRow(lv2, 1);

            timer1.Interval = new TimeSpan(0, 0, 0, 0, 500);
            timer1.Tick += Timer1_Tick;

            timer2.Interval = new TimeSpan(0, 0, 0, 0, 800);
            timer2.Tick += Timer2_Tick;

            foreach (var c in @"AcrylicBrush ColorPicker NavigationView ParallaxView PersonPicture PullToRefreshPage RatingsControl RevealBrush TreeView".Split(' '))
                items1.Add(c);
            lv.ItemsSource = items1;

            foreach (var c in @"Mike Ben Barbra Claire Justin Shawn Drew Lili".Split(' '))
                items2.Add(c);
            lv2.ItemsSource = items2;

            this.Loaded += PullToRefreshPage_Loaded;
        }
    }

    private void PullToRefreshPage_Loaded(object sender, RoutedEventArgs e)
    {
        if (rv2 is null)
        {
            return;
        }

        visualizerContentVisual = ElementCompositionPreview.GetElementVisual(rv2.Content);
        this.Loaded -= PullToRefreshPage_Loaded;
    }

    private void Timer1_Tick(object? sender, object e)
    {
        DispatcherQueue disp = rc.DispatcherQueue;
        if (disp.HasThreadAccess)
        {
            Timer1_TickImpl();
        }
        else
        {
            disp.TryEnqueue(DispatcherQueuePriority.Normal, () =>
            {
                Timer1_TickImpl();
            });
        }
    }

    private void Timer2_Tick(object? sender, object e)
    {
        if (rc2 is null)
        {
            return;
        }

        DispatcherQueue disp = rc2.DispatcherQueue;
        if (disp.HasThreadAccess)
        {
            Timer2_TickImpl();
        }
        else
        {
            disp.TryEnqueue(DispatcherQueuePriority.Normal, () =>
            {
                Timer2_TickImpl();
            });
        }
    }

    private void Timer1_TickImpl()
    {
        items1.Insert(0, "NewControl " + items1AddedCount++);
        timer1.Stop();
        if (this.RefreshCompletionDeferral1 != null)
        {
            this.RefreshCompletionDeferral1.Complete();
            this.RefreshCompletionDeferral1.Dispose();
            this.RefreshCompletionDeferral1 = null;
        }
    }

    private void Timer2_TickImpl()
    {
        items2.Insert(0, "New Friend " + items2AddedCount++);
        timer2.Stop();
        if (this.RefreshCompletionDeferral2 != null)
        {
            this.RefreshCompletionDeferral2.Complete();
            this.RefreshCompletionDeferral2.Dispose();
            this.RefreshCompletionDeferral2 = null;
        }
    }

    protected override void OnNavigatedFrom(NavigationEventArgs e)
    {
        base.OnNavigatedFrom(e);
        timer1.Stop();
        timer2.Stop();
    }

    private void rc_RefreshRequested(RefreshContainer sender, RefreshRequestedEventArgs args)
    {
        this.RefreshCompletionDeferral1 = args.GetDeferral();
        //Do some work to show new content!
        timer1.Start();
    }
    private void rc2_RefreshRequested(RefreshContainer sender, RefreshRequestedEventArgs args)
    {
        this.RefreshCompletionDeferral2 = args.GetDeferral();
        //Do some work to show new content!
        timer2.Start();
    }

    private void rv2_RefreshStateChanged(RefreshVisualizer sender, RefreshStateChangedEventArgs args)
    {
        visualizerContentVisual?.StopAnimation("RotationAngle");
    }
}

```

## 示例文件

### BasicPulltorefresh.txt
```
--- header
Basic PullToRefresh
--- xaml
<RefreshContainer x:Name="rc" RefreshRequested="rc_RefreshRequested">
    <ListView x:Name="lv" Width="300" Height="300" BorderThickness="1" BorderBrush="Black"/>
</RefreshContainer>
--- c#
ObservableCollection<string> items = new ObservableCollection<string>();
listview.ItemsSource = items;

private void rc_RefreshRequested(RefreshContainer sender, RefreshRequestedEventArgs args)
{
    //Do some work to show new Content! Once the work is done, call RefreshCompletionDeferral.Complete()
    this.RefreshCompletionDeferral = args.GetDeferral();
    this.DoWork();
}

private void WorkCompleted()
{
    items.Insert(0, "NewControl");
    if (this.RefreshCompletionDeferral != null)
    {
        this.RefreshCompletionDeferral.Complete();
        this.RefreshCompletionDeferral.Dispose();
        this.RefreshCompletionDeferral = null;
    }
}
```

### CustomIconPulltorefresh.txt
```
--- header
Custom Icon PullToRefresh
--- xaml
<RefreshContainer x:Name="rc" RefreshRequested="rc_RefreshRequested">
    <RefreshContainer.Visualizer>
        <RefreshVisualizer RefreshStateChanged="rv2_RefreshStateChanged">
            <RefreshVisualizer.Content>
                <SymbolIcon Symbol="AddFriend"/>
            </RefreshVisualizer.Content>
        </RefreshVisualizer>
    </RefreshContainer.Visualizer>
    <ListView x:Name="lv" Width="300" Height="300" BorderThickness="1" BorderBrush="Black"/>
</RefreshContainer>
--- c#
ObservableCollection<string> items = new ObservableCollection<string>();
listview.ItemsSource = items;

private void rc_RefreshRequested(RefreshContainer sender, RefreshRequestedEventArgs args)
{
    //Do some work to show new Content! Once the work is done, call RefreshCompletionDeferral.Complete()
    this.RefreshCompletionDeferral = args.GetDeferral();
    this.DoWork();
}

private void WorkCompleted()
{
    items.Insert(0, "NewControl");
    if (this.RefreshCompletionDeferral != null)
    {
        this.RefreshCompletionDeferral.Complete();
        this.RefreshCompletionDeferral.Dispose();
        this.RefreshCompletionDeferral = null;
    }
}
private void rv2_RefreshStateChanged()
{
    var visualizerContentVisual = ElementCompositionPreview.GetElementVisual(rv2.Content);
    visualizerContentVisual.StopAnimation("RotationAngle");
}
```


# TreeView

## 主页面 XAML (TreeViewPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.TreeViewPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controlpages="using:WinUIGallery.ControlPages"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <Page.Resources>
        <DataTemplate x:Key="FolderTemplate" x:DataType="controlpages:ExplorerItem">
            <TreeViewItem
                AutomationProperties.Name="{x:Bind Name}"
                IsExpanded="True"
                ItemsSource="{x:Bind Children}">

                <StackPanel Orientation="Horizontal">
                    <Image Width="20" Source="ms-appx:///Assets/SampleMedia/folder.png" />
                    <TextBlock Margin="0,0,10,0" />
                    <TextBlock Text="{x:Bind Name}" />
                </StackPanel>
            </TreeViewItem>
        </DataTemplate>

        <DataTemplate x:Key="FileTemplate" x:DataType="controlpages:ExplorerItem">
            <TreeViewItem AutomationProperties.Name="{x:Bind Name}">
                <StackPanel Orientation="Horizontal">
                    <FontIcon Glyph="&#xE8A5;" />
                    <TextBlock Margin="0,0,10,0" />
                    <TextBlock Text="{x:Bind Name}" />
                </StackPanel>
            </TreeViewItem>
        </DataTemplate>

        <controlpages:ExplorerItemTemplateSelector
            x:Key="ExplorerItemTemplateSelector"
            FileTemplate="{StaticResource FileTemplate}"
            FolderTemplate="{StaticResource FolderTemplate}" />
    </Page.Resources>

    <StackPanel>
        <controls:ControlExample SampleDefinition="TreeView\SimpleTreeviewDragDrop.txt">
            <controls:ControlExample.Example>
                <Grid
                    Height="280"
                    BorderBrush="{ThemeResource TextControlBorderBrush}"
                    BorderThickness="1">
                    <TreeView
                        x:Name="sampleTreeView"
                        MinWidth="345"
                        MaxHeight="400"
                        Margin="0,12,0,0"
                        HorizontalAlignment="Center"
                        VerticalAlignment="Top"
                        AllowDrop="True"
                        CanDragItems="True" />
                </Grid>
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="TreeView\TreeviewMultiSelectionEnabled.txt">
            <controls:ControlExample.Example>
                <Grid
                    Height="280"
                    BorderBrush="{ThemeResource TextControlBorderBrush}"
                    BorderThickness="1">
                    <TreeView
                        x:Name="sampleTreeView2"
                        MinWidth="345"
                        MaxHeight="400"
                        Margin="0,12,0,0"
                        HorizontalAlignment="Center"
                        VerticalAlignment="Top"
                        SelectionMode="Multiple" />
                </Grid>
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample
            SampleDefinition="TreeView\TreeviewDatabindingItemsource.txt">
            <controls:ControlExample.Example>
                <Grid
                    Height="200"
                    BorderBrush="{ThemeResource TextControlBorderBrush}"
                    BorderThickness="1">
                    <TreeView
                        x:Name="TreeView1"
                        MinWidth="345"
                        MaxHeight="400"
                        Margin="0,12,0,0"
                        HorizontalAlignment="Center"
                        VerticalAlignment="Top"
                        ItemsSource="{x:Bind DataSource}">
                        <TreeView.ItemTemplate>
                            <DataTemplate x:DataType="controlpages:ExplorerItem">
                                <TreeViewItem
                                    Content="{x:Bind Name}"
                                    IsExpanded="True"
                                    ItemsSource="{x:Bind Children}" />
                            </DataTemplate>
                        </TreeView.ItemTemplate>
                    </TreeView>
                </Grid>
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample
            SampleDefinition="TreeView\TreeviewItemtemplateselector.txt">
            <controls:ControlExample.Example>
                <Grid
                    Height="200"
                    BorderBrush="{ThemeResource TextControlBorderBrush}"
                    BorderThickness="1">
                    <TreeView
                        x:Name="FileTree"
                        Grid.Column="2"
                        MinWidth="345"
                        MaxHeight="400"
                        Margin="0,12,0,0"
                        HorizontalAlignment="Center"
                        VerticalAlignment="Top"
                        ItemTemplateSelector="{StaticResource ExplorerItemTemplateSelector}"
                        ItemsSource="{x:Bind DataSource}" />
                </Grid>
            </controls:ControlExample.Example>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (TreeViewPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using System.Collections.ObjectModel;

namespace WinUIGallery.ControlPages;

public sealed partial class TreeViewPage : Page
{
    private ObservableCollection<ExplorerItem> DataSource;

    public TreeViewPage()
    {
        this.InitializeComponent();
        this.DataContext = this;
        DataSource = GetData();

        InitializeSampleTreeView(sampleTreeView);
        InitializeSampleTreeView(sampleTreeView2);
    }

    private void InitializeSampleTreeView(TreeView sampleTreeView)
    {
        TreeViewNode workFolder = new TreeViewNode() { Content = "Work Documents" };
        workFolder.IsExpanded = true;

        workFolder.Children.Add(new TreeViewNode() { Content = "XYZ Functional Spec" });
        workFolder.Children.Add(new TreeViewNode() { Content = "Feature Schedule" });

        TreeViewNode remodelFolder = new TreeViewNode() { Content = "Home Remodel" };
        remodelFolder.IsExpanded = true;

        remodelFolder.Children.Add(new TreeViewNode() { Content = "Contractor Contact Info" });
        remodelFolder.Children.Add(new TreeViewNode() { Content = "Paint Color Scheme" });

        TreeViewNode personalFolder = new TreeViewNode() { Content = "Personal Documents" };
        personalFolder.IsExpanded = true;
        personalFolder.Children.Add(remodelFolder);

        sampleTreeView.RootNodes.Add(workFolder);
        sampleTreeView.RootNodes.Add(personalFolder);
    }

    private ObservableCollection<ExplorerItem> GetData()
    {
        return new ObservableCollection<ExplorerItem>
        {
            new ExplorerItem
            {
                Name = "Documents",
                Type = ExplorerItem.ExplorerItemType.Folder,
                Children =
                {
                    new ExplorerItem { Name = "ProjectProposal", Type = ExplorerItem.ExplorerItemType.File },
                    new ExplorerItem { Name = "BudgetReport", Type = ExplorerItem.ExplorerItemType.File }
                }
            },
            new ExplorerItem
            {
                Name = "Projects",
                Type = ExplorerItem.ExplorerItemType.Folder,
                Children =
                {
                    new ExplorerItem { Name = "Project Plan", Type = ExplorerItem.ExplorerItemType.File }
                }
            }
        };
    }
}

public class ExplorerItem
{
    public enum ExplorerItemType
    {
        Folder,
        File,
    }

    public string Name { get; set; } = string.Empty;
    public ExplorerItemType Type { get; set; }
    public ObservableCollection<ExplorerItem> Children { get; set; } = new ObservableCollection<ExplorerItem>();
}

partial class ExplorerItemTemplateSelector : DataTemplateSelector
{
    public DataTemplate? FolderTemplate { get; set; }
    public DataTemplate? FileTemplate { get; set; }

    protected override DataTemplate? SelectTemplateCore(object item)
    {
        var explorerItem = (ExplorerItem)item;
        return explorerItem.Type == ExplorerItem.ExplorerItemType.Folder ? FolderTemplate : FileTemplate;
    }
}

```

## 示例文件

### SimpleTreeviewDragDrop.txt
```
--- header
A simple TreeView with drag and drop support
--- xaml
<TreeView x:Name="sampleTreeView" CanDragItems="True"  AllowDrop="True"/>
--- c#
private void InitializeSampleTreeView(TreeView sampleTreeView)
{
    // Create a root node with initial content and set it to be expanded.
    TreeViewNode workNode = new TreeViewNode() { Content = "Work Documents" };
    workNode.IsExpanded = true;

    // Add child nodes with content related to the root node.
    workNode.Children.Add(new TreeViewNode() { Content = "XYZ Functional Spec" });
    workNode.Children.Add(new TreeViewNode() { Content = "Feature Schedule" });

    // Create another node with initial content and set it to be expanded.
    TreeViewNode remodelNode = new TreeViewNode() { Content = "Home Remodel" };
    remodelNode.IsExpanded = true;

    // Add child nodes with specific content under this node.
    remodelNode.Children.Add(new TreeViewNode() { Content = "Contractor Contact Info" });
    remodelNode.Children.Add(new TreeViewNode() { Content = "Paint Color Scheme" });

    // Create a node with broader content that includes the previous node as a child.
    TreeViewNode personalNode = new TreeViewNode() { Content = "Personal Documents" };
    personalNode.IsExpanded = true;
    personalNode.Children.Add(remodelNode);

    // Add the main nodes to the TreeView's root.
    sampleTreeView.RootNodes.Add(workNode);
    sampleTreeView.RootNodes.Add(personalNode);
}
```

### TreeviewDatabindingItemsource.txt
```
--- header
A TreeView with DataBinding Using ItemSource
--- xaml
<TreeView ItemsSource="{x:Bind DataSource}">
   <TreeView.ItemTemplate>
      <DataTemplate x:DataType="local:ExplorerItem">
         <TreeViewItem ItemsSource="{x:Bind Children}" Content="{x:Bind Name}"/>
      </DataTemplate>
   </TreeView.ItemTemplate>
</TreeView>
--- c#
using System.Collections.ObjectModel;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace YourNamespace
{
    public sealed partial class YourPage : Page
    {
        // DataSource is the data collection that will be bound to the TreeView's ItemsSource.
        public ObservableCollection<ExplorerItem> DataSource { get; set; }

        public YourPage()
        {
            this.InitializeComponent();

            // Initialize the data source with sample data and set it as the context for data binding.
            DataSource = GetData();
            this.DataContext = this; // Bind the DataContext of the page to itself for XAML bindings.
        }

        // Method to provide sample data for the TreeView.
        private ObservableCollection<ExplorerItem> GetData()
        {
            return new ObservableCollection<ExplorerItem>
            {
                // Root folder with child files.
                new ExplorerItem
                {
                    Name = "Documents",
                    Type = ExplorerItem.ExplorerItemType.Folder,
                    Children =
                    {
                        new ExplorerItem
                        {
                            Name = "ProjectProposal",
                            Type = ExplorerItem.ExplorerItemType.File,
                        },
                        new ExplorerItem
                        {
                            Name = "BudgetReport",
                            Type = ExplorerItem.ExplorerItemType.File,
                        },
                    },
                },
                // Another root folder with one child file.
                new ExplorerItem
                {
                    Name = "Projects",
                    Type = ExplorerItem.ExplorerItemType.Folder,
                    Children =
                    {
                        new ExplorerItem
                        {
                            Name = "Project Plan",
                            Type = ExplorerItem.ExplorerItemType.File,
                        },
                    },
                },
            };
        }
    }

    // Class to represent items in the TreeView.
    public class ExplorerItem
    {
        // Enum to define the type of the item: Folder or File.
        public enum ExplorerItemType
        {
            Folder,
            File,
        }

        // Name of the item (displayed in the TreeView).
        public string Name { get; set; } = string.Empty;

        // Type of the item (Folder or File).
        public ExplorerItemType Type { get; set; }

        // Collection of child items. Used for nested nodes in the TreeView.
        public ObservableCollection<ExplorerItem> Children { get; set; } = new ObservableCollection<ExplorerItem>();
    }
}
```

### TreeviewItemtemplateselector.txt
```
--- header
A TreeView with ItemTemplateSelector
--- xaml
<Page ...
      xmlns:local="using:YourNamespace" >

    <Page.Resources>
        <!-- DataTemplate for folders -->
        <DataTemplate x:Key="FolderTemplate" x:DataType="local:ExplorerItem"> 
            <TreeViewItem AutomationProperties.Name="{x:Bind Name}"
                ItemsSource="{x:Bind Children}" IsExpanded="True">
                <StackPanel Orientation="Horizontal">
                    <Image Width="20" Source="../Assets/SampleMedia/folder.png"/>
                    <TextBlock Margin="0,0,10,0"/>
                    <TextBlock Text="{x:Bind Name}" />
                </StackPanel>
            </TreeViewItem>
        </DataTemplate>

        <!-- DataTemplate for files -->
        <DataTemplate x:Key="FileTemplate" x:DataType="local:ExplorerItem"> 
            <TreeViewItem AutomationProperties.Name="{x:Bind Name}">
                <StackPanel Orientation="Horizontal">
                    <FontIcon Glyph="&#xE8A5;" />
                    <TextBlock Margin="0,0,10,0"/>
                    <TextBlock Text="{x:Bind Name}"/>
                </StackPanel>
            </TreeViewItem>
        </DataTemplate>

        <!-- Template selector for ExplorerItem types -->
        <local:ExplorerItemTemplateSelector x:Key="ExplorerItemTemplateSelector"
            FolderTemplate="{StaticResource FolderTemplate}"
            FileTemplate="{StaticResource FileTemplate}" />
    </Page.Resources>

    <!-- TreeView bound to DataSource, using the ItemTemplateSelector -->
    <TreeView ItemsSource="{x:Bind DataSource}"
              ItemTemplateSelector="{StaticResource ExplorerItemTemplateSelector}" />
</Page>
--- c#
using System.Collections.ObjectModel;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace YourNamespace
{
    public sealed partial class YourPage : Page
    {
        public ObservableCollection<ExplorerItem> DataSource { get; set; }

        public YourPage()
        {
            this.InitializeComponent();
            DataSource = GetData();
            this.DataContext = this;
        }

        private ObservableCollection<ExplorerItem> GetData()
        {
            return new ObservableCollection<ExplorerItem>
            {
                new ExplorerItem
                {
                    Name = "Documents",
                    Type = ExplorerItem.ExplorerItemType.Folder,
                    Children =
                    {
                        new ExplorerItem
                        {
                            Name = "ProjectProposal",
                            Type = ExplorerItem.ExplorerItemType.File,
                        },
                        new ExplorerItem
                        {
                            Name = "BudgetReport",
                            Type = ExplorerItem.ExplorerItemType.File,
                        },
                    },
                },
                new ExplorerItem
                {
                    Name = "Projects",
                    Type = ExplorerItem.ExplorerItemType.Folder,
                    Children =
                    {
                        new ExplorerItem
                        {
                            Name = "Project Plan",
                            Type = ExplorerItem.ExplorerItemType.File,
                        },
                    },
                },
            };
        }
    }

    public class ExplorerItem
    {
        public enum ExplorerItemType
        {
            Folder,
            File,
        }

        public string Name { get; set; } = string.Empty;
        public ExplorerItemType Type { get; set; }
        public ObservableCollection<ExplorerItem> Children { get; set; } = new ObservableCollection<ExplorerItem>();
    }

    class ExplorerItemTemplateSelector : DataTemplateSelector
    {
        // Template to use for folder items in the TreeView.
        public DataTemplate? FolderTemplate { get; set; }

        // Template to use for file items in the TreeView.
        public DataTemplate? FileTemplate { get; set; }

        // Determines which template to use for each item in the TreeView based on its type.
        protected override DataTemplate? SelectTemplateCore(object item)
        {
            // Cast the item to the ExplorerItem type.
            var explorerItem = (ExplorerItem)item;

            // Return the appropriate template: FolderTemplate for folders, FileTemplate for files.
            return explorerItem.Type == ExplorerItem.ExplorerItemType.Folder
                ? FolderTemplate
                : FileTemplate;
        }
    }
}
```

### TreeviewMultiSelectionEnabled.txt
```
--- header
A TreeView with Multi-selection enabled
--- xaml
<TreeView x:Name="sampleTreeView" SelectionMode="Multiple" />
--- c#
private void InitializeSampleTreeView(TreeView sampleTreeView)
{
    // Create a root node with initial content and set it to be expanded.
    TreeViewNode workNode = new TreeViewNode() { Content = "Work Documents" };
    workNode.IsExpanded = true;

    // Add child nodes with content related to the root node.
    workNode.Children.Add(new TreeViewNode() { Content = "XYZ Functional Spec" });
    workNode.Children.Add(new TreeViewNode() { Content = "Feature Schedule" });

    // Create another node with initial content and set it to be expanded.
    TreeViewNode remodelNode = new TreeViewNode() { Content = "Home Remodel" };
    remodelNode.IsExpanded = true;

    // Add child nodes with specific content under this node.
    remodelNode.Children.Add(new TreeViewNode() { Content = "Contractor Contact Info" });
    remodelNode.Children.Add(new TreeViewNode() { Content = "Paint Color Scheme" });

    // Create a node with broader content that includes the previous node as a child.
    TreeViewNode personalNode = new TreeViewNode() { Content = "Personal Documents" };
    personalNode.IsExpanded = true;
    personalNode.Children.Add(remodelNode);

    // Add the main nodes to the TreeView's root.
    sampleTreeView.RootNodes.Add(workNode);
    sampleTreeView.RootNodes.Add(personalNode);
}
```



# 分组: Date & Time

---

# CalendarDatePicker

## 主页面 XAML (CalendarDatePickerPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.CalendarDatePickerPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="CalendarDatePicker\CalendardatepickerHeaderPlaceholderText.txt">
            <controls:ControlExample.Example>
                <CalendarDatePicker Header="Calendar" PlaceholderText="Pick a date" />
            </controls:ControlExample.Example>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (CalendarDatePickerPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class CalendarDatePickerPage : Page
{
    public CalendarDatePickerPage()
    {
        this.InitializeComponent();
    }
}

```

## 示例文件

### CalendardatepickerHeaderPlaceholderText.txt
```
--- header
CalendarDatePicker with a header and placeholder text.
--- xaml
<CalendarDatePicker PlaceholderText="Pick a date" Header="Calendar" />
```


# CalendarView

## 主页面 XAML (CalendarViewPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.CalendarViewPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" 
    xmlns:helper="using:WinUIGallery.Helpers"
    mc:Ignorable="d">

    <StackPanel>
        <controls:ControlExample x:Name="ExampleAccessories" SampleDefinition="CalendarView\BasicCalendarView.txt">

            <CalendarView
                x:Name="Control1"
                VerticalAlignment="Top"
                CalendarIdentifier="{x:Bind calendarIdentifier.SelectedValue, Mode=OneWay}"
                IsGroupLabelVisible="{x:Bind isGroupLabelVisible.IsChecked.Value, Mode=OneWay}"
                IsOutOfScopeEnabled="{x:Bind isOutOfScopeEnabled.IsChecked.Value, Mode=OneWay}"
                SelectionMode="Single" />

            <controls:ControlExample.Options>
                <StackPanel Margin="0,-5,0,0">
                    <CheckBox
                        x:Name="isGroupLabelVisible"
                        Content="IsGroupLabelVisible"
                        IsChecked="True" />
                    <CheckBox
                        x:Name="isOutOfScopeEnabled"
                        Content="IsOutOfScopeEnabled"
                        IsChecked="True" />
                    <ComboBox
                        x:Name="selectionMode"
                        Margin="0,10,0,0"
                        Header="SelectionMode"
                        SelectedValue="Single"
                        SelectionChanged="SelectionMode_SelectionChanged">
                        <x:String>None</x:String>
                        <x:String>Single</x:String>
                        <x:String>Multiple</x:String>
                    </ComboBox>

                    <ComboBox
                        x:Name="calendarIdentifier"
                        Width="220"
                        Margin="0,10,0,0"
                        Header="CalendarIdentifier" />

                    <ComboBox
                        x:Name="calendarLanguages"
                        Width="220"
                        Margin="0,10,0,0"
                        Header="Language"
                        ItemsSource="{x:Bind Languages, Mode=OneWay}"
                        SelectedIndex="0"
                        SelectionChanged="calendarLanguages_SelectionChanged">
                        <ComboBox.ItemTemplate>
                            <DataTemplate x:DataType="helper:Language">
                                <TextBlock Text="{x:Bind Name}"/>
                            </DataTemplate>
                        </ComboBox.ItemTemplate>
                    </ComboBox>

                </StackPanel>
            </controls:ControlExample.Options>

            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="SelectionMode" Value="{x:Bind selectionMode.SelectedValue, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="IsGroupLabelVisible" Value="{x:Bind isGroupLabelVisible.IsChecked.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="IsOutOfScopeEnabled" Value="{x:Bind isOutOfScopeEnabled.IsChecked.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="Language" Value="{x:Bind Control1.Language, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="CalendarIdentifier" Value="{x:Bind Control1.CalendarIdentifier, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (CalendarViewPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Windows.Globalization;
using WinUIGallery.Helpers;
using Language = WinUIGallery.Helpers.Language;

namespace WinUIGallery.ControlPages;

public sealed partial class CalendarViewPage : Page
{
    public ObservableCollection<Language> Languages { get; set; } = new(new LanguageList().Languages);
    public CalendarViewPage()
    {
        this.InitializeComponent();

        List<string> calendarIdentifiers = new List<string>()
        {
            CalendarIdentifiers.Gregorian,
            CalendarIdentifiers.Hebrew,
            CalendarIdentifiers.Hijri,
            CalendarIdentifiers.Japanese,
            CalendarIdentifiers.Julian,
            CalendarIdentifiers.Korean,
            CalendarIdentifiers.Persian,
            CalendarIdentifiers.Taiwan,
            CalendarIdentifiers.Thai,
            CalendarIdentifiers.UmAlQura,
        };

        calendarIdentifier.ItemsSource = calendarIdentifiers;
        calendarIdentifier.SelectedItem = CalendarIdentifiers.Gregorian;
    }

    private void SelectionMode_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (Enum.TryParse<CalendarViewSelectionMode>((sender as ComboBox)?.SelectedItem.ToString(), out CalendarViewSelectionMode selectionMode))
        {
            Control1.SelectionMode = selectionMode;
        }
    }

    private void calendarLanguages_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (calendarLanguages.SelectedItem is Language selectedLang &&
            Windows.Globalization.Language.IsWellFormed(selectedLang.Code))
        {
            Control1.Language = selectedLang.Code;
        }
    }
}

```

## 示例文件

### BasicCalendarView.txt
```
--- header
A basic calendar view.
--- xaml
<CalendarView 
    SelectionMode="$(SelectionMode)" 
    IsGroupLabelVisible="$(IsGroupLabelVisible)"
    IsOutOfScopeEnabled="$(IsOutOfScopeEnabled)"
    Language="$(Language)"
    CalendarIdentifier="$(CalendarIdentifier)" />
```


# DatePicker

## 主页面 XAML (DatePickerPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.DatePickerPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="DatePicker\SimpleDatepickerHeader.txt">
            <controls:ControlExample.Example>
                <DatePicker Header="Pick a date" />
            </controls:ControlExample.Example>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example2" SampleDefinition="DatePicker\DatepickerDayFormattedYear.txt">
            <controls:ControlExample.Example>
                <StackPanel Orientation="Horizontal">
                    <DatePicker
                        x:Name="Control2"
                        DayFormat="{}{day.integer} ({dayofweek.abbreviated})"
                        YearVisible="False" />
                    <TextBlock x:Name="Control2Output" Style="{StaticResource BodyTextBlockStyle}" />
                </StackPanel>
            </controls:ControlExample.Example>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (DatePickerPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Navigation;
using System;

namespace WinUIGallery.ControlPages;

public sealed partial class DatePickerPage : Page
{
    public DatePickerPage()
    {
        this.InitializeComponent();
    }

    protected override void OnNavigatedTo(NavigationEventArgs e)
    {
        // Set the default date to 2 months from the current date.
        Control2.Date = DateTimeOffset.Now.AddMonths(2);

        // Set the minimum year to the current year.
        Control2.MinYear = DateTimeOffset.Now;

        // Set the maximum year to 5 years in the future.
        Control2.MaxYear = DateTimeOffset.Now.AddYears(5);

    }
}

```

## 示例文件

### DatepickerDayFormattedYear.txt
```
--- header
A DatePicker with day formatted and year hidden.
--- xaml
<DatePicker DayFormat="{}{day.integer} ({dayofweek.abbreviated})" YearVisible="False" />
```

### SimpleDatepickerHeader.txt
```
--- header
A simple DatePicker with a header.
--- xaml
<DatePicker Header="Pick a date" />
```


# TimePicker

## 主页面 XAML (TimePickerPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.TimePickerPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:sys="using:System"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="TimePicker\SimpleTimepicker.txt">
            <TimePicker />
        </controls:ControlExample>
        <controls:ControlExample
            x:Name="Example2"
            SampleDefinition="TimePicker\TimepickerHeaderMinuteIncrements.txt"
            RelativePanel.Below="Example1">
            <TimePicker Header="Arrival time" MinuteIncrement="15"/>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example3" SampleDefinition="TimePicker\Timepicker24HourClock.txt">
            <TimePicker ClockIdentifier="24HourClock" Header="24 hour clock" SelectedTime="{x:Bind sys:DateTime.Now.TimeOfDay}"/>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (TimePickerPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class TimePickerPage : Page
{
    public TimePickerPage()
    {
        this.InitializeComponent();
    }
}

```

## 示例文件

### SimpleTimepicker.txt
```
--- header
A simple TimePicker.
--- xaml
<TimePicker/>
```

### Timepicker24HourClock.txt
```
--- header
A TimePicker using a 24-hour clock, initialized to current time.
--- xaml
<xmlns:sys="using:System">
                    
                    <TimePicker ClockIdentifier="24HourClock" Header="24 hour clock" SelectedTime="{x:Bind sys:DateTime.Now.TimeOfDay}" />
```

### TimepickerHeaderMinuteIncrements.txt
```
--- header
A TimePicker with a header and minute increments specified.
--- xaml
<TimePicker Header="Arrival time" MinuteIncrement="15" />
```



# 分组: Dialogs & Flyouts

---

# ContentDialog

## 主页面 XAML (ContentDialogPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.ContentDialogPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample
            x:Name="Example1"
            SampleDefinition="ContentDialog\BasicContentDialogContent.txt">
            <controls:ControlExample.Example>
                <StackPanel Orientation="Horizontal">
                    <Button
                        x:Name="ShowDialog"
                        Click="ShowDialog_Click"
                        Content="Show dialog" />
                    <TextBlock x:Name="DialogResult" Style="{StaticResource OutputTextBlockStyle}" />
                </StackPanel>
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample
            x:Name="Example2"
            SampleDefinition="ContentDialog\ContentDialogWithoutDefault.txt">
            <controls:ControlExample.Example>
                <StackPanel Orientation="Horizontal">
                    <Button
                        x:Name="ShowDialogNoDefault"
                        Click="ShowDialogNoDefault_Click"
                        Content="Show dialog without default button" />
                    <TextBlock x:Name="DialogResultNoDefault" Style="{StaticResource OutputTextBlockStyle}" />
                </StackPanel>
            </controls:ControlExample.Example>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (ContentDialogPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Automation.Peers;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media;
using System;

namespace WinUIGallery.ControlPages;

public sealed partial class ContentDialogPage : Page
{
    public ContentDialogPage()
    {
        this.InitializeComponent();
    }

    private void SetDialogResultText(TextBlock targetTextBlock, string text)
    {
        targetTextBlock.Text = text;
        var peer = FrameworkElementAutomationPeer.FromElement(targetTextBlock) ?? FrameworkElementAutomationPeer.CreatePeerForElement(targetTextBlock);
        peer?.RaiseAutomationEvent(AutomationEvents.LiveRegionChanged);
    }

    private async void ShowDialog_Click(object sender, RoutedEventArgs e)
    {
        ContentDialogExample dialog = new ContentDialogExample();

        // XamlRoot must be set in the case of a ContentDialog running in a Desktop app
        dialog.XamlRoot = this.XamlRoot;
        dialog.Style = Application.Current.Resources["DefaultContentDialogStyle"] as Style;
        dialog.Title = "Save your work?";
        dialog.PrimaryButtonText = "Save";
        dialog.SecondaryButtonText = "Don't Save";
        dialog.CloseButtonText = "Cancel";
        dialog.DefaultButton = ContentDialogButton.Primary;
        dialog.Content = new ContentDialogContent();

        if (sender is Button button &&
            VisualTreeHelper.GetParent(button) is StackPanel stackPanel)
        {
            dialog.RequestedTheme = stackPanel.ActualTheme;
        }

        var result = await dialog.ShowAsync();

        if (result == ContentDialogResult.Primary)
        {
            SetDialogResultText(DialogResult, "User saved their work");
        }
        else if (result == ContentDialogResult.Secondary)
        {
            SetDialogResultText(DialogResult, "User did not save their work");
        }
        else
        {
            SetDialogResultText(DialogResult, "User cancelled the dialog");
        }
    }

    private async void ShowDialogNoDefault_Click(object sender, RoutedEventArgs e)
    {
        ContentDialogExample dialog = new ContentDialogExample();

        // XamlRoot must be set in the case of a ContentDialog running in a Desktop app
        dialog.XamlRoot = this.XamlRoot;
        dialog.Style = Application.Current.Resources["DefaultContentDialogStyle"] as Style;
        dialog.Title = "Replace file?";
        dialog.PrimaryButtonText = "Replace";
        dialog.SecondaryButtonText = "Keep";
        dialog.CloseButtonText = "Cancel";
        dialog.DefaultButton = ContentDialogButton.None;
        dialog.Content = new ContentDialogContent();

        if (sender is Button button &&
            VisualTreeHelper.GetParent(button) is StackPanel stackPanel)
        {
            dialog.RequestedTheme = stackPanel.ActualTheme;
        }

        var result = await dialog.ShowAsync();

        if (result == ContentDialogResult.Primary)
        {
            SetDialogResultText(DialogResultNoDefault, "User replaced the file");
        }
        else if (result == ContentDialogResult.Secondary)
        {
            SetDialogResultText(DialogResultNoDefault, "User kept the file");
        }
        else
        {
            SetDialogResultText(DialogResultNoDefault, "User cancelled the dialog");
        }
    }
}

```

## 示例文件

### BasicContentDialogContent.txt
```
--- header
A basic content dialog with content.
--- xaml
<Page
    x:Class="WinUIGallery.ControlPages.ContentDialogContent"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">

    <StackPanel VerticalAlignment="Stretch" HorizontalAlignment="Stretch">
        <!-- Content body -->
        <TextBlock Text="Lorem ipsum dolor sit amet, adipisicing elit." TextWrapping="Wrap" />
        <CheckBox Content="Upload your content to the cloud."/>
    </StackPanel>

</Page>
--- c#
private async void ShowDialog_Click(object sender, RoutedEventArgs e)
{
    ContentDialog dialog = new ContentDialog();

    // XamlRoot must be set in the case of a ContentDialog running in a Desktop app
    dialog.XamlRoot = this.XamlRoot;
    dialog.Style = Application.Current.Resources["DefaultContentDialogStyle"] as Style;
    dialog.Title = "Save your work?";
    dialog.PrimaryButtonText = "Save";
    dialog.SecondaryButtonText = "Don't Save";
    dialog.CloseButtonText = "Cancel";
    dialog.DefaultButton = ContentDialogButton.Primary;
    dialog.Content = new ContentDialogContent();

    var result = await dialog.ShowAsync();
}
```

### ContentDialogWithoutDefault.txt
```
--- header
A content dialog without a default button.
--- xaml
<Page
    x:Class="WinUIGallery.ControlPages.ContentDialogContent"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">

    <StackPanel VerticalAlignment="Stretch" HorizontalAlignment="Stretch">
        <!-- Content body -->
        <TextBlock Text="Lorem ipsum dolor sit amet, adipisicing elit." TextWrapping="Wrap" />
        <CheckBox Content="Upload your content to the cloud."/>
    </StackPanel>

</Page>
--- c#
private async void ShowDialogNoDefault_Click(object sender, RoutedEventArgs e)
{
    ContentDialog dialog = new ContentDialog();

    // XamlRoot must be set in the case of a ContentDialog running in a Desktop app
    dialog.XamlRoot = this.XamlRoot;
    dialog.Title = "Replace file?";
    dialog.PrimaryButtonText = "Replace";
    dialog.SecondaryButtonText = "Keep";
    dialog.CloseButtonText = "Cancel";
    dialog.DefaultButton = ContentDialogButton.None;
    dialog.Content = new ContentDialogContent();

    var result = await dialog.ShowAsync();
}
```


# Flyout

## 主页面 XAML (FlyoutPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.FlyoutPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <Page.Resources>
        <Flyout x:Key="SharedFlyout">
            <StackPanel>
                <TextBlock Text="This Flyout is shared." />
            </StackPanel>
        </Flyout>
    </Page.Resources>
    <StackPanel>
        <controls:ControlExample SampleDefinition="Flyout\ButtonFlyout.txt">
            <controls:ControlExample.Example>
                <Button x:Name="Control1" Content="Empty cart">
                    <Button.Flyout>
                        <Flyout>
                            <StackPanel>
                                <TextBlock
                                    Margin="0,0,0,12"
                                    Style="{ThemeResource BaseTextBlockStyle}"
                                    Text="All items will be removed. Do you want to continue?" />
                                <Button Click="DeleteConfirmation_Click" Content="Yes, empty my cart" />
                            </StackPanel>
                        </Flyout>
                    </Button.Flyout>
                </Button>
            </controls:ControlExample.Example>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (FlyoutPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class FlyoutPage : Page
{
    public FlyoutPage()
    {
        this.InitializeComponent();
    }

    private void DeleteConfirmation_Click(object sender, RoutedEventArgs e)
    {
        if (this.Control1.Flyout is Flyout f)
        {
            f.Hide();
        }
    }
}

```

## 示例文件

### ButtonFlyout.txt
```
--- header
A button with a flyout
--- xaml
<Button Content="Empty cart">
    <Button.Flyout>
        <Flyout>
            <StackPanel>
                <TextBlock Style="{ThemeResource BaseTextBlockStyle}" Text="All items will be removed. Do you want to continue?" Margin="0,0,0,12" />
                <Button Click="DeleteConfirmation_Click" Content="Yes, empty my cart" />
            </StackPanel>
        </Flyout>
    </Button.Flyout>
</Button>
```


# Popup

## 主页面 XAML (PopupPage.xaml)
```xaml
<?xml version="1.0" encoding="utf-8" ?>
<Page
    x:Class="WinUIGallery.ControlPages.PopupPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <StackPanel>
        <controls:ControlExample SampleDefinition="Popup\PopupOffsetPositioning.txt">
            <controls:ControlExample.Example>
                <Grid
                    x:Name="Output"
                    HorizontalAlignment="Left"
                    VerticalAlignment="Top">
                    <Button Click="ShowPopupOffsetClicked" Content="Show Popup (using Offset)" />
                    <Popup
                        x:Name="StandardPopup"
                        Closed="PopupClosed"
                        HorizontalOffset="{x:Bind HorizontalOffset.Value, Mode=OneWay}"
                        IsLightDismissEnabled="{x:Bind IsLightDismissEnabledToggleSwitch.IsOn, Mode=OneWay}"
                        VerticalOffset="{x:Bind VerticalOffset.Value, Mode=OneWay}">
                        <Grid
                            MinWidth="240"
                            Padding="16"
                            Background="{ThemeResource AcrylicBackgroundFillColorDefaultBrush}"
                            BorderBrush="{ThemeResource SurfaceStrokeColorDefaultBrush}"
                            BorderThickness="1"
                            CornerRadius="{StaticResource OverlayCornerRadius}">
                            <StackPanel Spacing="8">
                                <TextBlock FontSize="16" Text="Simple Popup" />
                                <Button Click="ClosePopupClicked" Content="Close" />
                            </StackPanel>
                        </Grid>
                    </Popup>
                </Grid>
            </controls:ControlExample.Example>
            <controls:ControlExample.Options>
                <StackPanel Spacing="8">
                    <ToggleSwitch
                        x:Name="IsLightDismissEnabledToggleSwitch"
                        Header="IsLightDismissEnabled"
                        IsOn="True"
                        OffContent="False"
                        OnContent="True" />
                    <NumberBox
                        x:Name="VerticalOffset"
                        Header="VerticalOffset"
                        LargeChange="100"
                        Maximum="100"
                        Minimum="-100"
                        SmallChange="10"
                        SpinButtonPlacementMode="Inline"
                        Value="0" />
                    <NumberBox
                        x:Name="HorizontalOffset"
                        Header="HorizontalOffset"
                        LargeChange="100"
                        Maximum="500"
                        Minimum="-100"
                        SmallChange="10"
                        SpinButtonPlacementMode="Inline"
                        Value="200" />
                </StackPanel>
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="VerticalOffset" Value="{x:Bind VerticalOffset.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="HorizontalOffset" Value="{x:Bind HorizontalOffset.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="IsLightDismissEnabled" Value="{x:Bind IsLightDismissEnabledToggleSwitch.IsOn, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (PopupPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class PopupPage : Page
{
    public PopupPage()
    {
        this.InitializeComponent();
    }

    // Handles the Click event on the Button on the page and opens the Popup. 
    private void ShowPopupOffsetClicked(object sender, RoutedEventArgs e)
    {
        // open the Popup if it isn't open already 
        if (!StandardPopup.IsOpen) { StandardPopup.IsOpen = true; }
        IsLightDismissEnabledToggleSwitch.IsEnabled = false;
    }

    // Handles the Click event on the Button inside the Popup control and 
    // closes the Popup. 
    private void ClosePopupClicked(object sender, RoutedEventArgs e)
    {
        // if the Popup is open, then close it 
        if (StandardPopup.IsOpen) { StandardPopup.IsOpen = false; }
        IsLightDismissEnabledToggleSwitch.IsEnabled = true;
    }

    private void PopupClosed(object sender, object e)
    {
        IsLightDismissEnabledToggleSwitch.IsEnabled = true;
    }
}

```

## 示例文件

### PopupOffsetPositioning.txt
```
--- header
Popup with Offset Positioning
--- xaml
<Grid x:Name="Output" HorizontalAlignment="Left" VerticalAlignment="Top" >
    <Button Content="Show Popup (using Offset)" Click="ShowPopupOffsetClicked" />
    <Popup x:Name="StandardPopup" VerticalOffset="$(VerticalOffset)" HorizontalOffset="$(HorizontalOffset)" IsLightDismissEnabled="$(IsLightDismissEnabled)">
        <Border Padding="20" CornerRadius="{StaticResource OverlayCornerRadius}" Width="200" Height="160" BorderThickness="1" BorderBrush="{ThemeResource SurfaceStrokeColorDefaultBrush}"
                Background="{ThemeResource AcrylicBackgroundFillColorDefaultBrush}">
            <StackPanel HorizontalAlignment="Center" VerticalAlignment="Center" Spacing="8">
                <TextBlock Text="Simple Popup" FontSize="16" HorizontalAlignment="Center" />
                <Button Content="Close" Click="ClosePopupClicked" />
            </StackPanel>
        </Border>
    </Popup>
</Grid>
--- c#
// Handles the Click event on the Button on the page and opens the Popup. 
private void ShowPopupOffsetClicked(object sender, RoutedEventArgs e)
{
    // open the Popup if it isn't open already 
    if (!StandardPopup.IsOpen) { StandardPopup.IsOpen = true; }
}

// Handles the Click event on the Button inside the Popup control and closes the Popup. 
private void ClosePopupClicked(object sender, RoutedEventArgs e)
{
    // if the Popup is open, then close it 
    if (StandardPopup.IsOpen) { StandardPopup.IsOpen = false; }
}
```


# TeachingTip

## 主页面 XAML (TeachingTipPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.TeachingTipPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample
            SampleDefinition="TeachingTip\ShowTargetedTeachingtipButton.txt">
            <controls:ControlExample.Example>
                <Grid>
                    <Button
                        x:Name="TestButton1"
                        Click="TestButton1Click"
                        Content="Show TeachingTip" />
                    <TeachingTip
                        x:Name="TestButton1TeachingTip"
                        Title="This is the title"
                        Subtitle="And this is the subtitle"
                        Target="{x:Bind TestButton1}">
                        <TeachingTip.IconSource>
                            <SymbolIconSource Symbol="Refresh" />
                        </TeachingTip.IconSource>
                    </TeachingTip>
                </Grid>
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample
            SampleDefinition="TeachingTip\ShowNonTargetedTeachingtip.txt">
            <controls:ControlExample.Example>
                <Grid>
                    <Button Click="TestButton2Click" Content="Show TeachingTip" />
                    <TeachingTip
                        x:Name="TestButton2TeachingTip"
                        Title="This is the title"
                        ActionButtonContent="Action button"
                        CloseButtonContent="Close button"
                        IsLightDismissEnabled="True"
                        PlacementMargin="20"
                        PreferredPlacement="Auto"
                        Subtitle="And this is the subtitle" />
                </Grid>
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample
            SampleDefinition="TeachingTip\ShowTargetedTeachingtipHero.txt">
            <controls:ControlExample.Example>
                <Grid>
                    <Button
                        x:Name="TestButton3"
                        Click="TestButton3Click"
                        Content="Show TeachingTip" />
                    <TeachingTip
                        x:Name="TestButton3TeachingTip"
                        Title="This is the title"
                        PreferredPlacement="Bottom"
                        Subtitle="And this is the subtitle"
                        Target="{x:Bind TestButton3}">
                        <TeachingTip.HeroContent>
                            <Image AutomationProperties.Name="Sunset" Source="/Assets/SampleMedia/sunset.jpg" />
                        </TeachingTip.HeroContent>
                        <TeachingTip.Content>
                            <TextBlock
                                Margin="0,16,0,0"
                                Text="Description can go here"
                                TextWrapping="WrapWholeWords" />
                        </TeachingTip.Content>
                    </TeachingTip>
                </Grid>
            </controls:ControlExample.Example>
        </controls:ControlExample>

    </StackPanel>
</Page>

```

## 主页面 C# (TeachingTipPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class TeachingTipPage : Page
{
    public TeachingTipPage()
    {
        this.InitializeComponent();
    }

    private void TestButton1Click(object sender, RoutedEventArgs e)
    {
        TestButton1TeachingTip.IsOpen = true;
    }

    private void TestButton2Click(object sender, RoutedEventArgs e)
    {
        TestButton2TeachingTip.IsOpen = true;
    }

    private void TestButton3Click(object sender, RoutedEventArgs e)
    {
        TestButton3TeachingTip.IsOpen = true;
    }
}

```

## 示例文件

### ShowNonTargetedTeachingtip.txt
```
--- header
Show a non-targeted TeachingTip with buttons.
--- xaml
<Button
    Click="TestButton2Click"
    Content="Show TeachingTip" />
<TeachingTip
    x:Name="TestButton2TeachingTip"
    Title="This is the title"
    ActionButtonContent="Action button"
    CloseButtonContent="Close button"
    IsLightDismissEnabled="True"
    PlacementMargin="20"
    PreferredPlacement="Auto"
    Subtitle="And this is the subtitle" />
--- c#
private void TestButton2Click(object sender, RoutedEventArgs e)
{
    TestButton2TeachingTip.IsOpen = true;
}
```

### ShowTargetedTeachingtipButton.txt
```
--- header
Show a targeted TeachingTip on a button.
--- xaml
<Button
    x:Name="TestButton1"
    Click="TestButton1Click"
    Content="Show TeachingTip" />
<TeachingTip
    x:Name="TestButton1TeachingTip"
    Title="This is the title"
    Subtitle="And this is the subtitle"
    Target="{x:Bind TestButton1}">
    <TeachingTip.IconSource>
        <SymbolIconSource Symbol="Refresh" />
    </TeachingTip.IconSource>
</TeachingTip>
--- c#
private void TestButton1Click(object sender, RoutedEventArgs e)
{
    TestButton1TeachingTip.IsOpen = true;
}
```

### ShowTargetedTeachingtipHero.txt
```
--- header
Show a targeted TeachingTip with hero content on a button.
--- xaml
<Button
    x:Name="TestButton3"
    Click="TestButton3Click"
    Content="Show TeachingTip" />
<TeachingTip
    x:Name="TestButton3TeachingTip"
    Title="This is the title"
    PreferredPlacement="Bottom"
    Subtitle="And this is the subtitle"
    Target="{x:Bind TestButton3}">
    <TeachingTip.HeroContent>
        <Image
            AutomationProperties.Name="Sunset"
            Source="/Assets/SampleMedia/sunset.jpg" />
    </TeachingTip.HeroContent>
    <TeachingTip.Content>
        <TextBlock
            Margin="0,16,0,0"
            Text="Description can go here"
            TextWrapping="WrapWholeWords" />
    </TeachingTip.Content>
</TeachingTip>
--- c#
private void TestButton3Click(object sender, RoutedEventArgs e)
{
    TestButton3TeachingTip.IsOpen = true;
}
```



# 分组: Layout

---

# Border

## 主页面 XAML (BorderPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.BorderPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="Border\BorderAroundTextblock.txt">
            <Border
                x:Name="Control1"
                VerticalAlignment="Top"
                Background="#FFFFFFFF"
                BorderBrush="#FFFFD700"
                BorderThickness="2">
                <TextBlock
                    Margin="8,5"
                    FontSize="18"
                    Foreground="Black"
                    Text="Text inside a border" />
            </Border>

            <controls:ControlExample.Options>
                <StackPanel>
                    <Slider
                        x:Name="ThicknessSlider"
                        Header="BorderThickness"
                        IsFocusEngagementEnabled="False"
                        Maximum="10"
                        Minimum="0"
                        StepFrequency="1"
                        ValueChanged="ThicknessSlider_ValueChanged"
                        Value="2" />

                    <Grid>
                        <Grid.ColumnDefinitions>
                            <ColumnDefinition />
                            <ColumnDefinition />
                        </Grid.ColumnDefinitions>

                        <RadioButtons Header="Background">

                            <RadioButton
                                Checked="BGRadioButton_Checked"
                                Content="Green"
                                GroupName="BGColor" />

                            <RadioButton
                                Checked="BGRadioButton_Checked"
                                Content="Yellow"
                                GroupName="BGColor" />

                            <RadioButton
                                Checked="BGRadioButton_Checked"
                                Content="Blue"
                                GroupName="BGColor" />

                            <RadioButton
                                Checked="BGRadioButton_Checked"
                                Content="White"
                                GroupName="BGColor"
                                IsChecked="True" />
                        </RadioButtons>

                        <RadioButtons Grid.Column="1" Header="BorderBrush">

                            <RadioButton
                                Checked="RadioButton_Checked"
                                Content="Green"
                                GroupName="BorderBrush" />

                            <RadioButton
                                Checked="RadioButton_Checked"
                                Content="Yellow"
                                GroupName="BorderBrush"
                                IsChecked="True" />

                            <RadioButton
                                Checked="RadioButton_Checked"
                                Content="Blue"
                                GroupName="BorderBrush" />

                            <RadioButton
                                Checked="RadioButton_Checked"
                                Content="White"
                                GroupName="BorderBrush" />
                        </RadioButtons>
                    </Grid>
                </StackPanel>
            </controls:ControlExample.Options>

            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="BorderThickness" Value="{x:Bind Control1.BorderThickness.Top, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="BorderBrush" Value="{x:Bind ((SolidColorBrush)Control1.BorderBrush).Color, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="Background" Value="{x:Bind ((SolidColorBrush)Control1.Background).Color, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (BorderPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Controls.Primitives;
using Microsoft.UI.Xaml.Media;

namespace WinUIGallery.ControlPages;

public sealed partial class BorderPage : Page
{
    public BorderPage()
    {
        this.InitializeComponent();
    }

    private void ThicknessSlider_ValueChanged(object sender, RangeBaseValueChangedEventArgs e)
    {
        if (Control1 != null) Control1.BorderThickness = new Thickness(e.NewValue);
    }

    private void BGRadioButton_Checked(object sender, RoutedEventArgs e)
    {
        if (sender is RadioButton rb && Control1 != null)
        {
            string? colorName = rb.Content.ToString();
            switch (colorName)
            {
                case "Yellow":
                    Control1.Background = new SolidColorBrush(Colors.Yellow);
                    break;
                case "Green":
                    Control1.Background = new SolidColorBrush(Colors.Green);
                    break;
                case "Blue":
                    Control1.Background = new SolidColorBrush(Colors.Blue);
                    break;
                case "White":
                    Control1.Background = new SolidColorBrush(Colors.White);
                    break;
            }
        }
    }

    private void RadioButton_Checked(object sender, RoutedEventArgs e)
    {
        if (sender is RadioButton rb && Control1 != null)
        {
            string? colorName = rb.Content.ToString();
            switch (colorName)
            {
                case "Yellow":
                    Control1.BorderBrush = new SolidColorBrush(Colors.Gold);
                    break;
                case "Green":
                    Control1.BorderBrush = new SolidColorBrush(Colors.DarkGreen);
                    break;
                case "Blue":
                    Control1.BorderBrush = new SolidColorBrush(Colors.DarkBlue);
                    break;
                case "White":
                    Control1.BorderBrush = new SolidColorBrush(Colors.White);
                    break;
            }
        }
    }
}

```

## 示例文件

### BorderAroundTextblock.txt
```
--- header
A Border around a TextBlock.
--- xaml
<Border BorderThickness="$(BorderThickness)" BorderBrush="$(BorderBrush)" Background="$(Background)">
    <TextBlock Text="Text inside a border" FontSize="18" Foreground="Black" />
</Border>
```


# Canvas

## 主页面 XAML (CanvasPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.CanvasPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="Canvas\CanvasControl.txt">

            <Canvas
                x:Name="Control1"
                Width="140"
                Height="140"
                VerticalAlignment="Top"
                Background="Gray">
                <Canvas.Resources>
                    <Style TargetType="Rectangle">
                        <Setter Property="Height" Value="40" />
                        <Setter Property="Width" Value="40" />
                    </Style>
                </Canvas.Resources>
                <Rectangle
                    Canvas.Left="{x:Bind LeftSlider.Value, Mode=OneWay}"
                    Canvas.Top="{x:Bind TopSlider.Value, Mode=OneWay}"
                    Canvas.ZIndex="{x:Bind (x:Int32)ZSlider.Value, Mode=OneWay}"
                    Fill="Red" />
                <Rectangle
                    Canvas.Left="20"
                    Canvas.Top="20"
                    Canvas.ZIndex="1"
                    Fill="Blue" />
                <Rectangle
                    Canvas.Left="40"
                    Canvas.Top="40"
                    Canvas.ZIndex="2"
                    Fill="Green" />
                <Rectangle
                    Canvas.Left="60"
                    Canvas.Top="60"
                    Canvas.ZIndex="3"
                    Fill="Yellow" />
            </Canvas>

            <controls:ControlExample.Options>
                <StackPanel Orientation="Horizontal">
                    <Slider
                        x:Name="TopSlider"
                        Height="110"
                        VerticalAlignment="Top"
                        IsDirectionReversed="True"
                        Maximum="100"
                        Minimum="0"
                        Orientation="Vertical"
                        StepFrequency="1">
                        <Slider.Header>
                            <TextBlock Margin="0,0,0,10" Text="Canvas.Top" />
                        </Slider.Header>
                    </Slider>
                    <StackPanel Margin="16,0,0,0">
                        <Slider
                            x:Name="LeftSlider"
                            Width="100"
                            Header="Canvas.Left"
                            Maximum="100"
                            Minimum="0"
                            StepFrequency="1" />
                        <Slider
                            x:Name="ZSlider"
                            Width="100"
                            Header="Canvas.ZIndex"
                            Maximum="4"
                            Minimum="0"
                            StepFrequency="1" />
                    </StackPanel>
                </StackPanel>
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="Left" Value="{x:Bind LeftSlider.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="Top" Value="{x:Bind TopSlider.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="Z" Value="{x:Bind ZSlider.Value, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (CanvasPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class CanvasPage : Page
{
    public CanvasPage()
    {
        this.InitializeComponent();
    }
}

```

## 示例文件

### CanvasControl.txt
```
--- header
A Canvas control.
--- xaml
<Canvas Width="120" Height="120" Background="Gray">
    <Rectangle Fill="Red" Canvas.Left="$(Left)" Canvas.Top="$(Top)" Canvas.ZIndex="$(Z)" />
    <Rectangle Fill="Blue" Canvas.Left="20" Canvas.Top="20" Canvas.ZIndex="1" />
    <Rectangle Fill="Green" Canvas.Left="40" Canvas.Top="40" Canvas.ZIndex="2" />
    <Rectangle Fill="Yellow" Canvas.Left="60" Canvas.Top="60" Canvas.ZIndex="3" />
</Canvas>
```


# Expander

## 主页面 XAML (ExpanderPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.ExpanderPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="Expander\ExpanderTextHeaderContent.txt">
            <controls:ControlExample.Example>
                <Expander
                    x:Name="Expander1"
                    VerticalAlignment="Top"
                    Content="This is in the content"
                    ExpandDirection="Down"
                    Header="This text is in the header"
                    IsExpanded="False" />
            </controls:ControlExample.Example>
            <controls:ControlExample.Options>
                <StackPanel>
                    <ComboBox
                        x:Name="ExpandDirectionComboBox"
                        Header="ExpandDirection"
                        SelectedValue="Down"
                        SelectionChanged="ExpandDirectionComboBox_SelectionChanged">
                        <x:String>Down</x:String>
                        <x:String>Up</x:String>
                    </ComboBox>
                </StackPanel>
            </controls:ControlExample.Options>

            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="IsExpanded" Value="{x:Bind Expander1.IsExpanded, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="ExpandDirection" Value="{x:Bind ExpandDirectionComboBox.SelectedValue, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="VerticalAlignment" Value="{x:Bind Expander1.VerticalAlignment, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="Expander\ModifyingExpandersContentAlignment.txt">
            <controls:ControlExample.Example>
                <Expander
                    Width="500"
                    Padding="0"
                    HorizontalContentAlignment="Left">
                    <Expander.Header>
                        <TextBlock HorizontalAlignment="Center" Text="This text is centered" />
                    </Expander.Header>
                    <Expander.Content>
                        <TextBlock Margin="4" Text="And this text is left aligned" />
                    </Expander.Content>
                </Expander>
            </controls:ControlExample.Example>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (ExpanderPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class ExpanderPage : Page
{
    public ExpanderPage()
    {
        this.InitializeComponent();
    }

    private void ExpandDirectionComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        string? expandDirection = e.AddedItems[0].ToString();

        switch (expandDirection)
        {
            case "Down":
            default:
                Expander1.ExpandDirection = Microsoft.UI.Xaml.Controls.ExpandDirection.Down;
                Expander1.VerticalAlignment = Microsoft.UI.Xaml.VerticalAlignment.Top;
                break;

            case "Up":
                Expander1.ExpandDirection = Microsoft.UI.Xaml.Controls.ExpandDirection.Up;
                Expander1.VerticalAlignment = Microsoft.UI.Xaml.VerticalAlignment.Bottom;
                break;
        }
    }
}

```

## 示例文件

### ExpanderTextHeaderContent.txt
```
--- header
An Expander with text in the header and content areas
--- xaml
<Expander
     IsExpanded="$(IsExpanded)"
     ExpandDirection="$(ExpandDirection)"
     VerticalAlignment="$(VerticalAlignment)"
     Header="This text is in the header"
     Content="This is in the content"/>
```

### ModifyingExpandersContentAlignment.txt
```
--- header
Modifying Expanders content alignment
--- xaml
<Expander Width="500" HorizontalContentAlignment="Left" Padding="0">
    <Expander.Header>
        <ToggleButton Content="This ToggleButton is centered" HorizontalAlignment="Center"/>
    </Expander.Header>
    <Expander.Content>
        <Button Margin="4" Content="This Button is left aligned"/>
    </Expander.Content>
</Expander>
```


# Grid

## 主页面 XAML (GridPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.GridPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="Grid\3x3GridControl.txt">
            <Grid
                x:Name="Control1"
                Width="240"
                Height="160"
                Background="Gray"
                ColumnDefinitions="50, 50, 50"
                RowDefinitions="50, 50, 50"
                ColumnSpacing="{x:Bind (x:Int32)ColumnSpacingSlider.Value, Mode=OneWay}"
                RowSpacing="{x:Bind (x:Int32)RowSpacingSlider.Value, Mode=OneWay}">
                <Grid.Resources>
                    <Style TargetType="Rectangle">
                        <Setter Property="Height" Value="40" />
                        <Setter Property="Width" Value="40" />
                    </Style>
                </Grid.Resources>
                <Rectangle
                    x:Name="Rectangle1"
                    Grid.Column="{x:Bind (x:Int32)ColumnSlider.Value, Mode=OneWay}"
                    Grid.Row="{x:Bind (x:Int32)RowSlider.Value, Mode=OneWay}"
                    Width="50"
                    Height="50"
                    Fill="Red" />
                <Rectangle
                    Grid.Row="1"
                    Fill="Blue"
                    Width="50"
                    Height="50" />
                <Rectangle
                    Grid.Column="1"
                    Fill="Green"
                    Width="50"
                    Height="50" />
                <Rectangle
                    Grid.Column="1"
                    Grid.Row="1"
                    Fill="Yellow"
                    Width="50"
                    Height="50" />
            </Grid>

            <controls:ControlExample.Options>
                <Grid
                    ColumnDefinitions="Auto,Auto"
                    RowDefinitions="Auto,Auto,Auto,Auto"
                    ColumnSpacing="12"
                    RowSpacing="12">
                    <TextBlock
                        Grid.Column="0"
                        Grid.Row="0"
                        Text="Grid" />
                    <Slider
                        x:Name="ColumnSpacingSlider"
                        Grid.Column="0"
                        Grid.Row="1"
                        Margin="16,0,0,0"
                        Header="ColumnSpacing"
                        Maximum="16"
                        Minimum="0"
                        SnapsTo="Ticks"
                        StepFrequency="1"
                        TickFrequency="1"
                        Value="8" />
                    <Slider
                        x:Name="RowSpacingSlider"
                        Grid.Column="1"
                        Grid.Row="1"
                        Height="100"
                        VerticalAlignment="Top"
                        IsDirectionReversed="True"
                        Maximum="16"
                        Minimum="0"
                        Orientation="Vertical"
                        SnapsTo="Ticks"
                        StepFrequency="1"
                        TickFrequency="1"
                        Value="8">
                        <Slider.Header>
                            <TextBlock Margin="0,0,0,10" Text="RowSpacing" />
                        </Slider.Header>
                    </Slider>
                    <TextBlock
                        Grid.Column="0"
                        Grid.Row="2"
                        Text="Red block" />
                    <Slider
                        x:Name="ColumnSlider"
                        Grid.Column="0"
                        Grid.Row="3"
                        Margin="16,0,0,0"
                        Header="Grid.Column"
                        Maximum="2"
                        Minimum="0"
                        SnapsTo="Ticks"
                        StepFrequency="1"
                        TickFrequency="1" />
                    <Slider
                        x:Name="RowSlider"
                        Grid.Column="1"
                        Grid.Row="3"
                        Height="100"
                        VerticalAlignment="Top"
                        IsDirectionReversed="True"
                        Maximum="2"
                        Minimum="0"
                        Orientation="Vertical"
                        SnapsTo="Ticks"
                        StepFrequency="1"
                        TickFrequency="1">
                        <Slider.Header>
                            <TextBlock Margin="0,0,0,10" Text="Grid.Row" />
                        </Slider.Header>
                    </Slider>

                </Grid>
            </controls:ControlExample.Options>

            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="Column" Value="{x:Bind ColumnSlider.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="Row" Value="{x:Bind RowSlider.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="ColumnSpacing" Value="{x:Bind ColumnSpacingSlider.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="RowSpacing" Value="{x:Bind RowSpacingSlider.Value, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (GridPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class GridPage : Page
{
    public GridPage()
    {
        this.InitializeComponent();
    }
}

```

## 示例文件

### 3x3GridControl.txt
```
--- header
A 3x3 Grid control.
--- xaml
<Grid
    Width="240"
    Height="120"
    Background="Gray"
    ColumnDefinitions="50, 50, 50"
    RowDefinitions ="50, 50, 50"
    ColumnSpacing="$(ColumnSpacing)"
    RowSpacing="$(RowSpacing)">
    <Rectangle Fill="Red" Grid.Column="$(Column)" Grid.Row="$(Row)" />
    <Rectangle Fill="Blue" Grid.Row="1" />
    <Rectangle Fill="Green" Grid.Column="1" />
    <Rectangle Fill="Yellow" Grid.Column="1" Grid.Row="1" />
</Grid>
```


# RelativePanel

## 主页面 XAML (RelativePanelPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.RelativePanelPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <controls:ControlExample
        VerticalAlignment="Top"
        ExampleHeight="Auto"
        SampleDefinition="RelativePanel\RelativepanelControl.txt">
        <RelativePanel Width="300">
            <Rectangle
                x:Name="Rectangle1"
                Width="50"
                Height="50"
                Fill="Red" />
            <Rectangle
                x:Name="Rectangle2"
                Width="50"
                Height="50"
                Margin="8,0,0,0"
                Fill="Blue"
                RelativePanel.RightOf="Rectangle1" />
            <Rectangle
                x:Name="Rectangle3"
                Width="50"
                Height="50"
                Fill="Green"
                RelativePanel.AlignRightWithPanel="True" />
            <Rectangle
                x:Name="Rectangle4"
                Width="50"
                Height="50"
                Margin="0,8,0,0"
                Fill="Yellow"
                RelativePanel.AlignHorizontalCenterWith="Rectangle3"
                RelativePanel.Below="Rectangle3" />
        </RelativePanel>
    </controls:ControlExample>

</Page>

```

## 主页面 C# (RelativePanelPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class RelativePanelPage : Page
{
    public RelativePanelPage()
    {
        this.InitializeComponent();
    }
}

```

## 示例文件

### RelativepanelControl.txt
```
--- header
A RelativePanel control.
--- xaml
<RelativePanel  Width="300">
    <Rectangle x:Name="Rectangle1" Fill="Red" Height="50" Width="50"/>
    <Rectangle x:Name="Rectangle2" Fill="Blue" Height="50" Width="50" RelativePanel.RightOf="Rectangle1" Margin="8,0,0,0"/>
    <Rectangle x:Name="Rectangle3" Fill="Green" Height="50" Width="50" RelativePanel.AlignRightWithPanel="True"/>
    <Rectangle x:Name="Rectangle4" Fill="Yellow" Height="50" Width="50" RelativePanel.Below="Rectangle3" RelativePanel.AlignHorizontalCenterWith="Rectangle3" Margin="0,8,0,0"/>
</RelativePanel>
```


# SplitView

## 主页面 XAML (SplitViewPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.SplitViewPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controlPages="using:WinUIGallery.ControlPages"
    xmlns:controls="using:WinUIGallery.Controls">
    <Page.Resources>
        <DataTemplate
            x:Key="LeftIconNavLinkItemTemplate"
            x:DataType="controlPages:NavLink">
            <Grid
                Margin="2,0,0,0"
                AutomationProperties.Name="{x:Bind Label}">
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="Auto" />
                    <ColumnDefinition Width="*" />
                </Grid.ColumnDefinitions>
                <SymbolIcon
                    Grid.Column="0"
                    Symbol="{x:Bind Symbol}" />
                <TextBlock
                    Grid.Column="1"
                    Margin="24,0,0,0"
                    VerticalAlignment="Center"
                    Text="{x:Bind Label}" />
            </Grid>
        </DataTemplate>
        <DataTemplate
            x:Key="RightIconNavLinkItemTemplate"
            x:DataType="controlPages:NavLink">
            <Grid
                Margin="0,0,2,0"
                AutomationProperties.Name="{x:Bind Label}">
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="*" />
                    <ColumnDefinition Width="Auto" />
                </Grid.ColumnDefinitions>
                <TextBlock
                    Grid.Column="0"
                    Margin="0,0,24,0"
                    VerticalAlignment="Center"
                    Text="{x:Bind Label}" />
                <SymbolIcon
                    Grid.Column="1"
                    Symbol="{x:Bind Symbol}" />
            </Grid>
        </DataTemplate>
    </Page.Resources>

    <StackPanel>
        <controls:ControlExample SampleDefinition="SplitView\BasicSplitview.txt">

            <Grid Height="300" Width="400" VerticalAlignment="Top">
                <SplitView
                    x:Name="splitView"
                    CompactPaneLength="{x:Bind compactPaneLengthSlider.Value, Mode=OneWay}"
                    DisplayMode="CompactOverlay"
                    IsPaneOpen="{x:Bind togglePaneButton.IsChecked, Mode=TwoWay, Converter={StaticResource nullableBooleanToBooleanConverter}}"
                    MaxWidth="400"
                    IsTabStop="False"
                    OpenPaneLength="{x:Bind openPaneLengthSlider.Value, Mode=OneWay}"
                    PaneBackground="{ThemeResource SystemControlBackgroundChromeMediumLowBrush}">
                    <SplitView.Pane>
                        <Grid>
                            <Grid.RowDefinitions>
                                <RowDefinition Height="Auto" />
                                <RowDefinition Height="*" />
                                <RowDefinition Height="Auto" />
                            </Grid.RowDefinitions>
                            <TextBlock
                                x:Name="PaneHeader"
                                Margin="60,12,0,0"
                                Style="{StaticResource BaseTextBlockStyle}"
                                Text="PANE CONTENT" />
                            <ListView
                                x:Name="NavLinksList"
                                Grid.Row="1"
                                Margin="0,12,0,0"
                                VerticalAlignment="Stretch"
                                IsItemClickEnabled="True"
                                ItemClick="NavLinksList_ItemClick"
                                ItemsSource="{x:Bind NavLinks}"
                                SelectionMode="Single" />
                        </Grid>
                    </SplitView.Pane>
                    <Grid>
                        <Grid.RowDefinitions>
                            <RowDefinition Height="Auto" />
                            <RowDefinition Height="*" />
                        </Grid.RowDefinitions>
                        <TextBlock
                            Margin="12,12,0,0"
                            Style="{StaticResource BaseTextBlockStyle}"
                            Text="SPLITVIEW CONTENT" />
                        <TextBlock
                            x:Name="content"
                            Grid.Row="1"
                            Margin="12,12,0,0"
                            Style="{StaticResource BodyTextBlockStyle}" />
                    </Grid>
                </SplitView>
            </Grid>

            <controls:ControlExample.Options>
                <StackPanel>
                    <ToggleButton
                        x:Name="togglePaneButton"
                        Content="IsPaneOpen"
                        Checked="togglePaneButton_CheckedChanged"
                        Unchecked="togglePaneButton_CheckedChanged"
                        IsChecked="True" />

                    <ToggleSwitch
                        MinWidth="120"
                        Margin="0,12,0,0"
                        Header="Placement"
                        OffContent="Left"
                        OnContent="Right"
                        Toggled="PanePlacement_Toggled" />

                    <ComboBox
                        x:Name="displayModeCombobox"
                        Width="196"
                        Margin="0,4,0,0"
                        VerticalAlignment="Center"
                        Header="DisplayMode"
                        SelectedIndex="0"
                        SelectionChanged="displayModeCombobox_SelectionChanged">
                        <ComboBoxItem>Inline</ComboBoxItem>
                        <ComboBoxItem>CompactInline</ComboBoxItem>
                        <ComboBoxItem>Overlay</ComboBoxItem>
                        <ComboBoxItem>CompactOverlay</ComboBoxItem>
                    </ComboBox>

                    <ComboBox
                        x:Name="paneBackgroundCombobox"
                        Width="196"
                        Margin="0,12,0,0"
                        VerticalAlignment="Center"
                        Header="PaneBackground"
                        SelectedIndex="0"
                        SelectionChanged="paneBackgroundCombobox_SelectionChanged">
                        <ComboBoxItem Tag="{}{ThemeResource SystemControlBackgroundChromeMediumLowBrush}">SystemControlBackgroundChromeMediumLowBrush</ComboBoxItem>
                        <ComboBoxItem Tag="Red">Red</ComboBoxItem>
                        <ComboBoxItem Tag="Blue">Blue</ComboBoxItem>
                        <ComboBoxItem Tag="Green">Green</ComboBoxItem>
                    </ComboBox>

                    <Slider
                        x:Name="openPaneLengthSlider"
                        Width="196"
                        Margin="0,12,0,0"
                        Header="OpenPaneLength"
                        IsFocusEngagementEnabled="False"
                        Maximum="500"
                        Minimum="128"
                        SnapsTo="StepValues"
                        StepFrequency="8"
                        Value="256" />

                    <Slider
                        x:Name="compactPaneLengthSlider"
                        Width="196"
                        Header="CompactPaneLength"
                        IsFocusEngagementEnabled="False"
                        Maximum="128"
                        Minimum="24"
                        SnapsTo="StepValues"
                        StepFrequency="8"
                        Value="48" />
                </StackPanel>
            </controls:ControlExample.Options>

            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="PaneBackground" Value="{x:Bind ((ComboBoxItem)paneBackgroundCombobox.SelectedItem).Tag, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="IsPaneOpen" Value="{x:Bind splitView.IsPaneOpen, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="OpenPaneLength" Value="{x:Bind openPaneLengthSlider.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="CompactPaneLength" Value="{x:Bind compactPaneLengthSlider.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="DisplayMode" Value="{x:Bind splitView.DisplayMode, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
        <VisualStateManager.VisualStateGroups>
            <VisualStateGroup>
                <VisualState x:Name="SystemControlBackgroundChromeMediumLowBrush" />
                <VisualState x:Name="Red">
                    <VisualState.Setters>
                        <Setter Target="splitView.PaneBackground" Value="Red" />
                    </VisualState.Setters>
                </VisualState>
                <VisualState x:Name="Blue">
                    <VisualState.Setters>
                        <Setter Target="splitView.PaneBackground" Value="Blue" />
                    </VisualState.Setters>
                </VisualState>
                <VisualState x:Name="Green">
                    <VisualState.Setters>
                        <Setter Target="splitView.PaneBackground" Value="Green" />
                    </VisualState.Setters>
                </VisualState>
            </VisualStateGroup>
            <VisualStateGroup x:Name="NavLinkItemLayoutStates">
                <VisualState x:Name="LeftIconLayout">
                    <VisualState.Setters>
                        <Setter Target="NavLinksList.ItemTemplate" Value="{StaticResource LeftIconNavLinkItemTemplate}" />
                    </VisualState.Setters>
                </VisualState>
                <VisualState x:Name="RightIconLayout">
                    <VisualState.Setters>
                        <Setter Target="NavLinksList.ItemTemplate" Value="{StaticResource RightIconNavLinkItemTemplate}" />
                    </VisualState.Setters>
                </VisualState>
            </VisualStateGroup>
        </VisualStateManager.VisualStateGroups>
    </StackPanel>
</Page>

```

## 主页面 C# (SplitViewPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using System;
using System.Collections.ObjectModel;


namespace WinUIGallery.ControlPages;

public sealed partial class SplitViewPage : Page
{
    private ObservableCollection<NavLink> _navLinks = new ObservableCollection<NavLink>()
    {
        new NavLink() { Label = "People", Symbol = Symbol.People  },
        new NavLink() { Label = "Globe", Symbol = Symbol.Globe },
        new NavLink() { Label = "Message", Symbol = Symbol.Message },
        new NavLink() { Label = "Mail", Symbol = Symbol.Mail },
    };

    public ObservableCollection<NavLink> NavLinks
    {
        get { return _navLinks; }
    }

    public SplitViewPage()
    {
        this.InitializeComponent();
        this.Loaded += SplitViewPage_Loaded;
    }

    private void SplitViewPage_Loaded(object sender, RoutedEventArgs e)
    {
        UpdateNavLinkItemLayout();
    }

    private void NavLinksList_ItemClick(object sender, ItemClickEventArgs e)
    {
        if (e.ClickedItem is not NavLink navLink)
        {
            return;
        }

        content.Text = navLink.Label + " Page";
    }

    private void PanePlacement_Toggled(object sender, RoutedEventArgs e)
    {
        if ((sender as ToggleSwitch)?.IsOn is true)
        {
            splitView.PanePlacement = SplitViewPanePlacement.Right;
        }
        else
        {
            splitView.PanePlacement = SplitViewPanePlacement.Left;
        }

        UpdateNavLinkItemLayout();
    }

    private void UpdateNavLinkItemLayout()
    {
        if (splitView.PanePlacement == SplitViewPanePlacement.Right)
        {
            VisualStateManager.GoToState(this, "RightIconLayout", false);
        }
        else
        {
            VisualStateManager.GoToState(this, "LeftIconLayout", false);
        }
    }

    private void togglePaneButton_CheckedChanged(object sender, RoutedEventArgs e)
    {
        UpdateNavLinkItemLayout();
    }

    private void displayModeCombobox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if ((e.AddedItems[0] as ComboBoxItem)?.Content.ToString() is not string displayMode)
        {
            return;
        }

        splitView.DisplayMode = (SplitViewDisplayMode)Enum.Parse(typeof(SplitViewDisplayMode), displayMode);
    }

    private void paneBackgroundCombobox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if ((e.AddedItems[0] as ComboBoxItem)?.Content.ToString() is not string colorString)
        {
            return;
        }

        VisualStateManager.GoToState(this, colorString, false);
    }
}

public class NavLink
{
    public string Label { get; set; } = string.Empty;
    public Symbol Symbol { get; set; }
}

```

## 示例文件

### BasicSplitview.txt
```
--- header
A basic SplitView.
--- xaml
<SplitView x:Name="splitView" PaneBackground="$(PaneBackground)"
           IsPaneOpen="$(IsPaneOpen)" OpenPaneLength="$(OpenPaneLength)" CompactPaneLength="$(CompactPaneLength)" DisplayMode="$(DisplayMode)">
    <SplitView.Pane>
        <Grid>
            <Grid.RowDefinitions>
                <RowDefinition Height="Auto"/>
                <RowDefinition Height="*"/>
                <RowDefinition Height="Auto"/>
            </Grid.RowDefinitions>
            <TextBlock Text="PANE CONTENT" x:Name="PaneHeader" Margin="60,12,0,0" Style="{StaticResource BaseTextBlockStyle}"/>
            <ListView x:Name="NavLinksList" Margin="0,12,0,0" SelectionMode="Single" Grid.Row="1" VerticalAlignment="Stretch"
                    ItemClick="NavLinksList_ItemClick" IsItemClickEnabled="True"
                    ItemsSource="{x:Bind NavLinks}" ItemTemplate="{StaticResource NavLinkItemTemplate}"/>
        </Grid>
    </SplitView.Pane>
 
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
        </Grid.RowDefinitions>
        <TextBlock Text="SPLITVIEW CONTENT" Margin="12,12,0,0" Style="{StaticResource BaseTextBlockStyle}"/>
        <TextBlock x:Name="content" Grid.Row="1" Margin="12,12,0,0" Style="{StaticResource BodyTextBlockStyle}" />
    </Grid>
</SplitView>
```


# StackPanel

## 主页面 XAML (StackPanelPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.StackPanelPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    x:Name="pageRoot"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="StackPanel\StackpanelControl.txt">

            <StackPanel
                x:Name="Control1"
                Spacing="{x:Bind SpacingSlider.Value, Mode=OneWay}"
                VerticalAlignment="Top">
                <StackPanel.Resources>
                    <Style TargetType="Rectangle">
                        <Setter Property="Height" Value="40" />
                        <Setter Property="Width" Value="40" />
                    </Style>
                </StackPanel.Resources>
                <Rectangle Fill="Red" />
                <Rectangle Fill="Blue" />
                <Rectangle Fill="Green" />
                <Rectangle Fill="Yellow" />
            </StackPanel>

            <controls:ControlExample.Options>
                <StackPanel Spacing="12">
                    <RadioButtons
                        x:Name="OrientationGroup"
                        Header="Orientation"
                        SelectionChanged="OrientationGroup_SelectionChanged">
                        <RadioButton
                            Content="Horizontal"
                            Tag="Horizontal" />
                        <RadioButton
                            Content="Vertical"
                            IsChecked="True"
                            Tag="Vertical" />
                    </RadioButtons>
                    <Slider
                        x:Name="SpacingSlider"
                        Header="Spacing"
                        Maximum="16"
                        Minimum="0"
                        SnapsTo="Ticks"
                        StepFrequency="1"
                        TickFrequency="1"
                        Value="8" />
                </StackPanel>
            </controls:ControlExample.Options>

            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="Spacing" Value="{x:Bind Control1.Spacing, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="Orientation" Value="{x:Bind Control1.Orientation, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (StackPanelPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;
using System;

namespace WinUIGallery.ControlPages;

public sealed partial class StackPanelPage : Page
{
    public StackPanelPage()
    {
        this.InitializeComponent();
    }

    private void OrientationGroup_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if ((sender as RadioButtons)?.SelectedItem is not RadioButton selectedItem ||
            Enum.TryParse<Orientation>(selectedItem.Tag?.ToString(), out var orientation) is false ||
            Control1 is null)
        {
            return;
        }

        Control1.Orientation = orientation;
    }
}

```

## 示例文件

### StackpanelControl.txt
```
--- header
A StackPanel control.
--- xaml
<StackPanel
    Orientation="$(Orientation)"
    Spacing="$(Spacing)">
    <Rectangle Fill="Red"/>
    <Rectangle Fill="Blue"/>
    <Rectangle Fill="Green"/>
    <Rectangle Fill="Yellow"/>
</StackPanel>
```


# VariableSizedWrapGrid

## 主页面 XAML (VariableSizedWrapGridPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.VariableSizedWrapGridPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="VariableSizedWrapGrid\VariablesizedwrapgridControl.txt">

            <VariableSizedWrapGrid
                x:Name="Control1"
                Width="400"
                ItemHeight="44"
                ItemWidth="44"
                MaximumRowsOrColumns="3">
                <Rectangle Fill="Red" />
                <Rectangle
                    Height="80"
                    Fill="Blue"
                    VariableSizedWrapGrid.RowSpan="2" />
                <Rectangle
                    Width="80"
                    Fill="Green"
                    VariableSizedWrapGrid.ColumnSpan="2" />
                <Rectangle
                    Width="80"
                    Height="80"
                    Fill="Yellow"
                    VariableSizedWrapGrid.ColumnSpan="2"
                    VariableSizedWrapGrid.RowSpan="2" />
            </VariableSizedWrapGrid>

            <controls:ControlExample.Options>
                <RadioButtons
                    x:Name="OrientationGroup"
                    Header="Orientation"
                    SelectionChanged="OrientationGroup_SelectionChanged">
                    <RadioButton
                        Content="Horizontal"
                        Tag="Horizontal" />
                    <RadioButton
                        Content="Vertical"
                        IsChecked="True"
                        Tag="Vertical" />
                </RadioButtons>
            </controls:ControlExample.Options>

            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="Orientation" Value="{x:Bind Control1.Orientation, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (VariableSizedWrapGridPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;
using System;

namespace WinUIGallery.ControlPages;

public sealed partial class VariableSizedWrapGridPage : Page
{
    public VariableSizedWrapGridPage()
    {
        this.InitializeComponent();
    }

    private void OrientationGroup_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if ((sender as RadioButtons)?.SelectedItem is not RadioButton selectedItem ||
            Enum.TryParse<Orientation>(selectedItem.Tag?.ToString(), out var orientation) is false ||
            Control1 is null)
        {
            return;
        }

        Control1.Orientation = orientation;
    }
}

```

## 示例文件

### VariablesizedwrapgridControl.txt
```
--- header
A VariableSizedWrapGrid control.
--- xaml
<VariableSizedWrapGrid Orientation="$(Orientation)" MaximumRowsOrColumns="3" ItemHeight="44" ItemWidth="44">
    <Rectangle Fill="Red"/>
    <Rectangle Fill="Blue" Height="80" VariableSizedWrapGrid.RowSpan="2"/>
    <Rectangle Fill="Green" Width="80" VariableSizedWrapGrid.ColumnSpan="2"/>
    <Rectangle Fill="Yellow" Height="80" Width="80" VariableSizedWrapGrid.RowSpan="2" VariableSizedWrapGrid.ColumnSpan="2"/>
</VariableSizedWrapGrid>
```


# Viewbox

## 主页面 XAML (ViewboxPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.ViewboxPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="Viewbox\ContentInsideViewbox.txt">
            <Viewbox
                x:Name="Control1"
                Width="{x:Bind SizeSlider.Value, Mode=OneWay}"
                Height="{x:Bind SizeSlider.Value, Mode=OneWay}"
                VerticalAlignment="Top"
                StretchDirection="Both">
                <Border BorderBrush="Gray" BorderThickness="15">
                    <StackPanel Background="DarkGray">
                        <StackPanel Orientation="Horizontal">
                            <Rectangle
                                Width="40"
                                Height="10"
                                Fill="Blue" />
                            <Rectangle
                                Width="40"
                                Height="10"
                                Fill="Green" />
                            <Rectangle
                                Width="40"
                                Height="10"
                                Fill="Red" />
                            <Rectangle
                                Width="40"
                                Height="10"
                                Fill="Yellow" />
                        </StackPanel>
                        <Image Source="ms-appx:///Assets/SampleMedia/Slices.png" />
                        <TextBlock HorizontalAlignment="Center" Text="This is text." />
                    </StackPanel>
                </Border>
            </Viewbox>

            <controls:ControlExample.Options>
                <StackPanel Width="200">
                    <Slider
                        x:Name="SizeSlider"
                        Header="Width/Height"
                        Maximum="300"
                        Minimum="20"
                        Value="200" />

                    <RadioButtons
                        Header="Stretch"
                        SelectionChanged="Stretch_SelectionChanged">
                        <RadioButton
                            Content="None"
                            Tag="None" />
                        <RadioButton
                            Content="Fill"
                            Tag="Fill" />
                        <RadioButton
                            Content="Uniform"
                            IsChecked="True"
                            Tag="Uniform" />
                        <RadioButton
                            Content="UniformToFill"
                            Tag="UniformToFill" />
                    </RadioButtons>

                    <RadioButtons
                        Header="StretchDirection"
                        SelectionChanged="StretchDirection_SelectionChanged">
                        <RadioButton
                            Content="UpOnly"
                            GroupName="StretchDirection"
                            Tag="UpOnly" />
                        <RadioButton
                            Content="DownOnly"
                            GroupName="StretchDirection"
                            Tag="DownOnly" />
                        <RadioButton
                            Content="Both"
                            GroupName="StretchDirection"
                            IsChecked="True"
                            Tag="Both" />
                    </RadioButtons>
                </StackPanel>
            </controls:ControlExample.Options>

            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="Size" Value="{x:Bind SizeSlider.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="Stretch" Value="{x:Bind Control1.Stretch, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="StretchDirection" Value="{x:Bind Control1.StretchDirection, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (ViewboxPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media;
using System;

namespace WinUIGallery.ControlPages;

public sealed partial class ViewboxPage : Page
{
    public ViewboxPage()
    {
        this.InitializeComponent();
    }

    private void StretchDirectionButton_Checked(object sender, RoutedEventArgs e)
    {
        if (sender is RadioButton rb && Control1 != null)
        {
            string? direction = rb.Tag.ToString();
            switch (direction)
            {
                case "UpOnly":
                    Control1.StretchDirection = StretchDirection.UpOnly;
                    break;

                case "DownOnly":
                    Control1.StretchDirection = StretchDirection.DownOnly;
                    break;

                case "Both":
                    Control1.StretchDirection = StretchDirection.Both;
                    break;
            }
        }
    }

    private void StretchButton_Checked(object sender, RoutedEventArgs e)
    {
        if (sender is RadioButton rb && Control1 != null)
        {
            string? stretch = rb.Tag.ToString();
            switch (stretch)
            {
                case "None":
                    Control1.Stretch = Stretch.None;
                    break;

                case "Fill":
                    Control1.Stretch = Stretch.Fill;
                    break;

                case "Uniform":
                    Control1.Stretch = Stretch.Uniform;
                    break;

                case "UniformToFill":
                    Control1.Stretch = Stretch.UniformToFill;
                    break;
            }
        }
    }

    private void Stretch_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if ((sender as RadioButtons)?.SelectedItem is not RadioButton selectedItem ||
            Enum.TryParse<Stretch>(selectedItem.Tag?.ToString(), out var stretch) is false ||
            Control1 is null)
        {
            return;
        }

        Control1.Stretch = stretch;
    }

    private void StretchDirection_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if ((sender as RadioButtons)?.SelectedItem is not RadioButton selectedItem ||
            Enum.TryParse<StretchDirection>(selectedItem.Tag?.ToString(), out var stretchDirection) is false ||
            Control1 is null)
        {
            return;
        }

        Control1.StretchDirection = stretchDirection;
    }
}

```

## 示例文件

### ContentInsideViewbox.txt
```
--- header
Content inside of a Viewbox.
--- xaml
<Viewbox Height="$(Size)" Width="$(Size)" Stretch="$(Stretch)" StretchDirection="$(StretchDirection)">
    <Border BorderBrush="Gray" BorderThickness="15">
        <StackPanel Background="DarkGray">
            <StackPanel Orientation="Horizontal">
                <Rectangle Fill="Blue" Height="10" Width="40"/>
                <Rectangle Fill="Green" Height="10" Width="40"/>
                <Rectangle Fill="Red" Height="10" Width="40"/>
                <Rectangle Fill="Yellow" Height="10" Width="40"/>
            </StackPanel>
            <Image Source="ms-appx:///Assets/SampleMedia/Slices.png"/>
            <TextBlock Text="This is text." HorizontalAlignment="Center"/>
        </StackPanel>
    </Border>
</Viewbox>
```



# 分组: Menus & Toolbars

---

# AppBarButton

## 主页面 XAML (AppBarButtonPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.AppBarButtonPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="AppBarButton\AppbarbuttonSymbolIcon.txt">
            <StackPanel Orientation="Horizontal">
                <!--  App bar button with symbol icon.  -->
                <AppBarButton
                    x:Name="Button1"
                    Click="AppBarButton_Click"
                    Icon="Like"
                    Label="SymbolIcon" />
                <TextBlock
                    x:Name="Control1Output"
                    Margin="8,0,0,0"
                    VerticalAlignment="Center" />
            </StackPanel>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example2" SampleDefinition="AppBarButton\AppbarbuttonBitmapIcon.txt">
            <StackPanel Orientation="Horizontal">
                <!--  App bar button with bitmap icon.  -->
                <AppBarButton
                    x:Name="Button2"
                    Click="AppBarButton_Click"
                    Label="BitmapIcon">
                    <AppBarButton.Icon>
                        <BitmapIcon UriSource="ms-appx:///Assets/SampleMedia/Slices2.png" />
                    </AppBarButton.Icon>
                </AppBarButton>
                <TextBlock
                    x:Name="Control2Output"
                    Margin="8,0,0,0"
                    VerticalAlignment="Center" />
            </StackPanel>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example3" SampleDefinition="AppBarButton\AppbarbuttonFontIcon.txt">
            <StackPanel Orientation="Horizontal">
                <!--  App bar button with font icon.  -->
                <AppBarButton
                    x:Name="Button3"
                    Click="AppBarButton_Click"
                    Label="FontIcon">
                    <AppBarButton.Icon>
                        <FontIcon FontFamily="Candara" Glyph="&#x03A3;" />
                    </AppBarButton.Icon>
                </AppBarButton>
                <TextBlock
                    x:Name="Control3Output"
                    Margin="8,0,0,0"
                    VerticalAlignment="Center" />
            </StackPanel>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example4" SampleDefinition="AppBarButton\AppbarbuttonPathIcon.txt">
            <StackPanel Orientation="Horizontal">
                <!--  App bar button with path icon.  -->
                <AppBarButton
                    x:Name="Button4"
                    Click="AppBarButton_Click"
                    Label="PathIcon">
                    <AppBarButton.Content>
                        <Viewbox Stretch="Uniform">
                            <PathIcon Data="F1 M 20,20L 24,10L 24,24L 5,24" />
                        </Viewbox>
                    </AppBarButton.Content>
                </AppBarButton>
                <TextBlock
                    x:Name="Control4Output"
                    Margin="8,0,0,0"
                    VerticalAlignment="Center" />
            </StackPanel>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example5" SampleDefinition="AppBarButton\AppbarbuttonKeyboardaccelerator.txt">
            <StackPanel Orientation="Horizontal">
                <AppBarButton
                    x:Name="Button5"
                    Click="AppBarButton_Click"
                    Icon="Save"
                    Label="Save">
                    <AppBarButton.KeyboardAccelerators>
                        <KeyboardAccelerator Key="S" Modifiers="Control" />
                    </AppBarButton.KeyboardAccelerators>
                </AppBarButton>
                <TextBlock
                    x:Name="Control5Output"
                    Margin="8,0,0,0"
                    VerticalAlignment="Center" />
            </StackPanel>
        </controls:ControlExample>

        <controls:ControlExample x:Name="Example6" SampleDefinition="AppBarButton\AppbarbuttonOpensFlyoutContaining.txt">
            <StackPanel Orientation="Horizontal">
                <AppBarButton
                    AllowFocusOnInteraction="True"
                    Icon="Edit"
                    Label="Edit">
                    <AppBarButton.Flyout>
                        <Flyout>
                            <TextBox MinWidth="240" PlaceholderText="Input text here" />
                        </Flyout>
                    </AppBarButton.Flyout>
                </AppBarButton>
            </StackPanel>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (AppBarButtonPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using WinUIGallery.Helpers;

namespace WinUIGallery.ControlPages;

public sealed partial class AppBarButtonPage : Page
{
    public AppBarButtonPage()
    {
        this.InitializeComponent();
    }

    private void AppBarButton_Click(object sender, RoutedEventArgs e)
    {
        if (sender is Button b)
        {
            string name = b.Name;

            switch (name)
            {
                case "Button1":
                    Control1Output.Text = "You clicked: " + name;
                    UIHelper.AnnounceActionForAccessibility(Button1, Control1Output.Text, "AppBarButtonSuccessNotificationId");
                    break;
                case "Button2":
                    Control2Output.Text = "You clicked: " + name;
                    UIHelper.AnnounceActionForAccessibility(Button2, Control2Output.Text, "AppBarButtonSuccessNotificationId");
                    break;
                case "Button3":
                    Control3Output.Text = "You clicked: " + name;
                    UIHelper.AnnounceActionForAccessibility(Button3, Control3Output.Text, "AppBarButtonSuccessNotificationId");
                    break;
                case "Button4":
                    Control4Output.Text = "You clicked: " + name;
                    UIHelper.AnnounceActionForAccessibility(Button4, Control4Output.Text, "AppBarButtonSuccessNotificationId");
                    break;
                case "Button5":
                    Control5Output.Text = "You clicked: " + name;
                    UIHelper.AnnounceActionForAccessibility(Button5, Control5Output.Text, "AppBarButtonSuccessNotificationId");
                    break;
            }
        }
    }
}

```

## 示例文件

### AppbarbuttonBitmapIcon.txt
```
--- header
An AppBarButton with a bitmap icon.
--- xaml
<AppBarButton Label="BitmapIcon" Click="AppBarButton_Click">
    <AppBarButton.Icon>
        <BitmapIcon UriSource="ms-appx:///Assets/SampleMedia/Slices2.png"/>
    </AppBarButton.Icon>
</AppBarButton>
```

### AppbarbuttonFontIcon.txt
```
--- header
An AppBarButton with a font icon.
--- xaml
<AppBarButton Label="FontIcon" Click="AppBarButton_Click">
    <AppBarButton.Icon>
        <FontIcon FontFamily="Candara" Glyph="&#x03A3;"/>
    </AppBarButton.Icon>
</AppBarButton>
```

### AppbarbuttonKeyboardaccelerator.txt
```
--- header
An AppBarButton with a KeyboardAccelerator
--- xaml
<AppBarButton Icon="Save" Label="Save" Click="AppBarButton_Click">
    <AppBarButton.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="S"/>
    <AppBarButton.KeyboardAccelerators/>
</AppBarButton>
```

### AppbarbuttonOpensFlyoutContaining.txt
```
--- header
An AppBarButton that opens a Flyout containing an input control.
--- xaml
<AppBarButton AllowFocusOnInteraction="True" Icon="Edit" Label="Edit">
    <AppBarButton.Flyout>
        <Flyout/>
            <TextBox MinWidth="240" PlaceholderText="Input text here"/>
        <Flyout/>
    <AppBarButton.Flyout>
</AppBarButton>
```

### AppbarbuttonPathIcon.txt
```
--- header
An AppBarButton with a path icon.
--- xaml
<AppBarButton Label="PathIcon" Click="AppBarButton_Click">
    <AppBarButton.Content>
        <Viewbox Stretch="Uniform">
            <PathIcon Data="F1 M 20,20L 24,10L 24,24L 5,24"/>
        </Viewbox>
    </AppBarButton.Content>
</AppBarButton>
```

### AppbarbuttonSymbolIcon.txt
```
--- header
An AppBarButton with a symbol icon.
--- xaml
<AppBarButton Icon="Like" Label="SymbolIcon" Click="AppBarButton_Click"/>
```


# AppBarSeparator

## 主页面 XAML (AppBarSeparatorPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.AppBarSeparatorPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls">

    <StackPanel>
        <controls:ControlExample SampleDefinition="AppBarSeparator\AppbarbuttonsSeparatedAppbarseparators.txt">
            <controls:ControlExample.Example>
                <ScrollViewer
                    HorizontalScrollBarVisibility="Hidden"
                    HorizontalScrollMode="Auto"
                    VerticalScrollBarVisibility="Hidden"
                    VerticalScrollMode="Disabled">
                    <CommandBar x:Name="Control1">
                        <CommandBar.PrimaryCommands>
                            <AppBarButton Icon="AttachCamera" Label="Attach Camera" />
                            <AppBarSeparator />
                            <AppBarButton Icon="Like" Label="Like" />
                            <AppBarButton Icon="Dislike" Label="Dislike" />
                            <AppBarSeparator />
                            <AppBarButton Icon="Orientation" Label="Orientation" />
                        </CommandBar.PrimaryCommands>
                    </CommandBar>
                </ScrollViewer>
            </controls:ControlExample.Example>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (AppBarSeparatorPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class AppBarSeparatorPage : Page
{
    public AppBarSeparatorPage()
    {
        this.InitializeComponent();
    }
}

```

## 示例文件

### AppbarbuttonsSeparatedAppbarseparators.txt
```
--- header
AppBarButtons separated by AppBarSeparators.
--- xaml
<CommandBar>
    <CommandBar.PrimaryCommands>
        <AppBarButton Icon="AttachCamera" Label="Attach Camera"/>
        <AppBarSeparator />
        <AppBarButton Icon="Like" Label="Like"/>
        <AppBarButton Icon="Dislike" Label="Dislike"/>
        <AppBarSeparator />
        <AppBarButton Icon="Orientation" Label="Orientation"/>
    </CommandBar.PrimaryCommands>
</CommandBar>
```


# AppBarToggleButton

## 主页面 XAML (AppBarToggleButtonPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.AppBarToggleButtonPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="AppBarToggleButton\AppbartogglebuttonSymbolIcon.txt">
            <controls:ControlExample.Example>
                <StackPanel Orientation="Horizontal">
                    <!--  App bar button with symbol icon.  -->
                    <AppBarToggleButton
                        x:Name="Button1"
                        Click="AppBarButton_Click"
                        Icon="Shuffle"
                        Label="SymbolIcon" />
                    <TextBlock
                        x:Name="Control1Output"
                        Margin="8,0,0,0"
                        VerticalAlignment="Center" />
                </StackPanel>
            </controls:ControlExample.Example>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example2" SampleDefinition="AppBarToggleButton\AppbartogglebuttonBitmapIcon.txt">
            <controls:ControlExample.Example>
                <StackPanel Orientation="Horizontal">
                    <!--  App bar button with bitmap icon.  -->
                    <AppBarToggleButton
                        x:Name="Button2"
                        Click="AppBarButton_Click"
                        Label="BitmapIcon">
                        <AppBarToggleButton.Icon>
                            <BitmapIcon UriSource="ms-appx:///Assets/SampleMedia/Slices2.png" />
                        </AppBarToggleButton.Icon>
                    </AppBarToggleButton>
                    <TextBlock
                        x:Name="Control2Output"
                        Margin="8,0,0,0"
                        VerticalAlignment="Center" />
                </StackPanel>
            </controls:ControlExample.Example>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example3" SampleDefinition="AppBarToggleButton\AppbartogglebuttonFontIcon.txt">
            <controls:ControlExample.Example>
                <StackPanel Orientation="Horizontal">
                    <!--  App bar button with font icon.  -->
                    <AppBarToggleButton
                        x:Name="Button3"
                        Click="AppBarButton_Click"
                        Label="FontIcon">
                        <AppBarToggleButton.Icon>
                            <FontIcon FontFamily="Candara" Glyph="&#x03A3;" />
                        </AppBarToggleButton.Icon>
                    </AppBarToggleButton>
                    <TextBlock
                        x:Name="Control3Output"
                        Margin="8,0,0,0"
                        VerticalAlignment="Center" />
                </StackPanel>
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample x:Name="Example4" SampleDefinition="AppBarToggleButton\ThreeStateAppbartogglebuttonPath.txt">
            <controls:ControlExample.Example>
                <StackPanel Orientation="Horizontal">
                    <!--  App bar button with path icon.  -->
                    <AppBarToggleButton
                        x:Name="Button4"
                        Click="AppBarButton_Click"
                        IsThreeState="True"
                        Label="PathIcon">
                        <AppBarToggleButton.Content>
                            <Viewbox>
                                <PathIcon Data="F1 M 20,20L 24,10L 24,24L 5,24" />
                            </Viewbox>
                        </AppBarToggleButton.Content>
                    </AppBarToggleButton>
                    <TextBlock
                        x:Name="Control4Output"
                        Margin="8,0,0,0"
                        VerticalAlignment="Center" />
                </StackPanel>
            </controls:ControlExample.Example>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (AppBarToggleButtonPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class AppBarToggleButtonPage : Page
{
    public AppBarToggleButtonPage()
    {
        this.InitializeComponent();
    }

    private void AppBarButton_Click(object sender, RoutedEventArgs e)
    {
        if (sender is AppBarToggleButton b)
        {
            string name = b.Name;

            switch (name)
            {
                case "Button1":
                    Control1Output.Text = "IsChecked = " + b.IsChecked.ToString();
                    break;
                case "Button2":
                    Control2Output.Text = "IsChecked = " + b.IsChecked.ToString();
                    break;
                case "Button3":
                    Control3Output.Text = "IsChecked = " + b.IsChecked.ToString();
                    break;
                case "Button4":
                    Control4Output.Text = "IsChecked = " + b.IsChecked.ToString();
                    break;
            }
        }
    }
}

```

## 示例文件

### AppbartogglebuttonBitmapIcon.txt
```
--- header
An AppBarToggleButton with a bitmap icon.
--- xaml
<AppBarToggleButton Label="BitmapIcon" Click="AppBarButton_Click">
    <AppBarToggleButton.Icon>
        <BitmapIcon UriSource="ms-appx:///Assets/SampleMedia/Slices2.png"/>
    </AppBarToggleButton.Icon>
</AppBarToggleButton>
```

### AppbartogglebuttonFontIcon.txt
```
--- header
An AppBarToggleButton with a font icon.
--- xaml
<AppBarToggleButton Label="FontIcon" Click="AppBarButton_Click">
    <AppBarToggleButton.Icon>
        <FontIcon FontFamily="Candara" Glyph="&#x03A3;"/>
    </AppBarToggleButton.Icon>
</AppBarToggleButton>
```

### AppbartogglebuttonSymbolIcon.txt
```
--- header
An AppBarToggleButton with a symbol icon.
--- xaml
<AppBarToggleButton Icon="Shuffle" Label="SymbolIcon" Click="AppBarButton_Click"/>
```

### ThreeStateAppbartogglebuttonPath.txt
```
--- header
A three-state AppBarToggleButton with a path icon.
--- xaml
<AppBarToggleButton Label="PathIcon" Click="AppBarButton_Click" IsThreeState="True">
    <AppBarToggleButton.Icon>
        <PathIcon Data="F1 M 20,20L 24,10L 24,24L 5,24"/>
    </AppBarToggleButton.Icon>
</AppBarToggleButton>
```


# CommandBar

## 主页面 XAML (CommandBarPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.CommandBarPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <Page.Resources>
        <x:String x:Key="MultipleButtonsSecondaryCommands" xml:space="preserve">
        &lt;AppBarButton Icon="Add" Label="Button 1"&gt;
            &lt;AppBarButton.KeyboardAccelerators&gt;
                    &lt;KeyboardAccelerator Modifiers="Control" Key="N" /&gt;
            &lt;/AppBarButton.KeyboardAccelerators&gt;
        &lt;/AppBarButton&gt;
        &lt;AppBarButton Icon="Delete" Label="Button 2"&gt;
            &lt;AppBarButton.KeyboardAccelerators&gt;
                    &lt;KeyboardAccelerator Key="Delete" /&gt;
            &lt;/AppBarButton.KeyboardAccelerators&gt;
        &lt;/AppBarButton&gt;
        &lt;AppBarSeparator /&gt;
        &lt;AppBarButton Icon="FontDecrease" Label="Button 3"&gt;
            &lt;AppBarButton.KeyboardAccelerators&gt;
                    &lt;KeyboardAccelerator Modifiers="Control" Key="Subtract" /&gt;
            &lt;/AppBarButton.KeyboardAccelerators&gt;
        &lt;/AppBarButton&gt;
        &lt;AppBarButton Icon="FontIncrease" Label="Button 4"&gt;
            &lt;AppBarButton.KeyboardAccelerators&gt;
                    &lt;KeyboardAccelerator Modifiers="Control" Key="Add" /&gt;
            &lt;/AppBarButton.KeyboardAccelerators&gt;
        &lt;/AppBarButton&gt;</x:String>
    </Page.Resources>
    <StackPanel>
        <controls:ControlExample x:Name="Example3" SampleDefinition="CommandBar\CommandBarLabelsSide.txt">
            <StackPanel>
                <CommandBar
                    x:Name="PrimaryCommandBar"
                    DefaultLabelPosition="Right"
                    IsOpen="False">
                    <AppBarButton
                        x:Name="addButton"
                        Click="OnElementClicked"
                        Icon="Add"
                        Label="Add" />
                    <AppBarButton
                        x:Name="editButton"
                        Click="OnElementClicked"
                        Icon="Edit"
                        Label="Edit" />
                    <AppBarButton
                        x:Name="shareButton"
                        Click="OnElementClicked"
                        Icon="Share"
                        Label="Share" />
                    <CommandBar.SecondaryCommands>
                        <AppBarButton
                            x:Name="settingsButton"
                            Click="OnElementClicked"
                            Icon="Setting"
                            Label="Settings">
                            <AppBarButton.KeyboardAccelerators>
                                <KeyboardAccelerator Key="I" Modifiers="Control" />
                            </AppBarButton.KeyboardAccelerators>
                        </AppBarButton>
                    </CommandBar.SecondaryCommands>
                </CommandBar>
                <TextBlock x:Name="SelectedOptionText" Padding="0,8,0,0" />
            </StackPanel>
            <controls:ControlExample.Options>
                <StackPanel>
                    <TextBlock Text="Show or hide" />
                    <Button
                        Margin="0,12,0,0"
                        Click="OpenButton_Click"
                        Content="Open command bar" />
                    <Button
                        Margin="0,12,0,0"
                        Click="CloseButton_Click"
                        Content="Close command bar" />
                    <TextBlock Margin="0,16,0,0" Text="Modify content" />
                    <Button
                        Margin="0,12,0,0"
                        Click="AddSecondaryCommands_Click"
                        Content="Add secondary commands" />
                    <Button
                        Margin="0,12,0,0"
                        Click="RemoveSecondaryCommands_Click"
                        Content="Remove secondary commands" />
                </StackPanel>
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution
                    Key="IsOpen"
                    IsEnabled="True"
                    Value="{x:Bind PrimaryCommandBar.IsOpen, Mode=OneWay}" />
                <controls:ControlExampleSubstitution
                    Key="IsSticky"
                    IsEnabled="{x:Bind PrimaryCommandBar.IsSticky, Mode=OneWay}"
                    Value=" IsSticky=&quot;True&quot; " />
                <controls:ControlExampleSubstitution
                    Key="MultipleButtonsSecondaryCommands"
                    IsEnabled="{x:Bind MultipleButtons, Mode=OneWay}"
                    Value="{StaticResource MultipleButtonsSecondaryCommands}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (CommandBarPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Navigation;
using System.ComponentModel;

namespace WinUIGallery.ControlPages;

public sealed partial class CommandBarPage : Page, INotifyPropertyChanged
{
    private bool multipleButtons = false;

    public bool MultipleButtons
    {
        get
        {
            return multipleButtons;
        }
        set
        {
            multipleButtons = value;
            OnPropertyChanged("MultipleButtons");
        }
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    public void OnPropertyChanged(string PropertyName)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(PropertyName));
    }

    public CommandBarPage()
    {
        this.InitializeComponent();
        AddKeyboardAccelerators();
    }

    private void OpenButton_Click(object sender, RoutedEventArgs e)
    {
        PrimaryCommandBar.IsOpen = true;
        PrimaryCommandBar.IsSticky = true;
    }

    private void CloseButton_Click(object sender, RoutedEventArgs e)
    {
        PrimaryCommandBar.IsOpen = false;
        PrimaryCommandBar.IsSticky = false;
    }

    private void OnElementClicked(object sender, Microsoft.UI.Xaml.RoutedEventArgs e)
    {
        if (sender is not AppBarButton appBarButon)
        {
            return;
        }

        SelectedOptionText.Text = "You clicked: " + appBarButon.Label;
    }

    private void AddSecondaryCommands_Click(object sender, RoutedEventArgs e)
    {
        // Add compact button to the command bar. It provides functionality specific
        // to this page, and is removed when leaving the page.

        if (PrimaryCommandBar.SecondaryCommands.Count == 1)
        {
            var newButton = new AppBarButton();
            newButton.Icon = new SymbolIcon(Symbol.Add);
            newButton.Label = "Button 1";
            newButton.KeyboardAccelerators.Add(new Microsoft.UI.Xaml.Input.KeyboardAccelerator()
            {
                Key = Windows.System.VirtualKey.N,
                Modifiers = Windows.System.VirtualKeyModifiers.Control
            });
            PrimaryCommandBar.SecondaryCommands.Add(newButton);

            newButton = new AppBarButton
            {
                Icon = new SymbolIcon(Symbol.Delete),
                Label = "Button 2"
            };
            PrimaryCommandBar.SecondaryCommands.Add(newButton);
            newButton.KeyboardAccelerators.Add(new Microsoft.UI.Xaml.Input.KeyboardAccelerator()
            {
                Key = Windows.System.VirtualKey.Delete
            });
            PrimaryCommandBar.SecondaryCommands.Add(new AppBarSeparator());

            newButton = new AppBarButton();
            newButton.Icon = new SymbolIcon(Symbol.FontDecrease);
            newButton.Label = "Button 3";
            newButton.KeyboardAccelerators.Add(new Microsoft.UI.Xaml.Input.KeyboardAccelerator()
            {
                Key = Windows.System.VirtualKey.Subtract,
                Modifiers = Windows.System.VirtualKeyModifiers.Control
            });
            PrimaryCommandBar.SecondaryCommands.Add(newButton);

            newButton = new AppBarButton();
            newButton.Icon = new SymbolIcon(Symbol.FontIncrease);
            newButton.Label = "Button 4";
            newButton.KeyboardAccelerators.Add(new Microsoft.UI.Xaml.Input.KeyboardAccelerator()
            {
                Key = Windows.System.VirtualKey.Add,
                Modifiers = Windows.System.VirtualKeyModifiers.Control
            });
            PrimaryCommandBar.SecondaryCommands.Add(newButton);

        }
        MultipleButtons = true;
    }

    private void RemoveSecondaryCommands_Click(object sender, RoutedEventArgs e)
    {
        RemoveSecondaryCommands();
    }

    protected override void OnNavigatingFrom(NavigatingCancelEventArgs e)
    {
        RemoveSecondaryCommands();
        base.OnNavigatingFrom(e);
    }

    private void RemoveSecondaryCommands()
    {
        while (PrimaryCommandBar.SecondaryCommands.Count > 1)
        {
            PrimaryCommandBar.SecondaryCommands.RemoveAt(PrimaryCommandBar.SecondaryCommands.Count - 1);
        }
        MultipleButtons = false;
    }


    private void AddKeyboardAccelerators()
    {
        editButton.KeyboardAccelerators.Add(new Microsoft.UI.Xaml.Input.KeyboardAccelerator()
        {
            Key = Windows.System.VirtualKey.E,
            Modifiers = Windows.System.VirtualKeyModifiers.Control
        });

        shareButton.KeyboardAccelerators.Add(new Microsoft.UI.Xaml.Input.KeyboardAccelerator()
        {
            Key = Windows.System.VirtualKey.F4
        });

        addButton.KeyboardAccelerators.Add(new Microsoft.UI.Xaml.Input.KeyboardAccelerator()
        {
            Key = Windows.System.VirtualKey.A,
            Modifiers = Windows.System.VirtualKeyModifiers.Control
        });

    }

}

```

## 示例文件

### CommandBarLabelsSide.txt
```
--- header
A command bar with labels on the side free floating in a page
--- xaml
<CommandBar Background="Transparent" IsOpen="$(IsOpen)" DefaultLabelPosition="Right"$(IsSticky)>
    <AppBarButton Icon="Add" Label="Add"/>
    <AppBarButton Icon="Edit" Label="Edit"/>
    <AppBarButton Icon="Share" Label="Share"/>
    <CommandBar.SecondaryCommands>
        <AppBarButton Icon="Setting" Label="Settings">
            <AppBarButton.KeyboardAccelerators>
                    <KeyboardAccelerator Modifiers="Control" Key="I" />
            </AppBarButton.KeyboardAccelerators>
        </AppBarButton>$(MultipleButtonsSecondaryCommands)
    </CommandBar.SecondaryCommands>
</CommandBar>
```


# CommandBarFlyout

## 主页面 XAML (CommandBarFlyoutPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.CommandBarFlyoutPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <Page.Resources>
        <CommandBarFlyout x:Name="CommandBarFlyout1" Placement="Right">
            <AppBarButton
                Click="OnElementClicked"
                Icon="Share"
                Label="Share"
                ToolTipService.ToolTip="Share" />
            <AppBarButton
                Click="OnElementClicked"
                Icon="Save"
                Label="Save"
                ToolTipService.ToolTip="Save" />
            <AppBarButton
                Click="OnElementClicked"
                Icon="Delete"
                Label="Delete"
                ToolTipService.ToolTip="Delete" />
            <CommandBarFlyout.SecondaryCommands>
                <AppBarButton Click="OnElementClicked" Label="Resize" />
                <AppBarButton Click="OnElementClicked" Label="Move" />
            </CommandBarFlyout.SecondaryCommands>
        </CommandBarFlyout>
    </Page.Resources>

    <StackPanel>
        <controls:ControlExample
            SampleDefinition="CommandBarFlyout\CommandbarflyoutCommandsAppObject.txt">
            <StackPanel>
                <TextBlock Text="Click or right click the image to open a CommandBarFlyout" />
                <Button
                    x:Name="myImageButton"
                    Margin="0,12"
                    Padding="0"
                    AutomationProperties.Name="mountain"
                    Click="MyImageButton_Click"
                    ContextRequested="MyImageButton_ContextRequested">
                    <Image
                        x:Name="Image1"
                        Height="300"
                        Source="/Assets/SampleMedia/rainier.jpg" />
                </Button>
                <TextBlock x:Name="SelectedOptionText" Text="" />
            </StackPanel>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (CommandBarFlyoutPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Controls.Primitives;
using Microsoft.UI.Xaml.Input;
using Windows.Foundation.Metadata;

namespace WinUIGallery.ControlPages;

public sealed partial class CommandBarFlyoutPage : Page
{
    public CommandBarFlyoutPage()
    {
        this.InitializeComponent();
    }

    private void OnElementClicked(object sender, Microsoft.UI.Xaml.RoutedEventArgs e)
    {
        if (sender is not AppBarButton appBarButton)
        {
            return;
        }

        // Do custom logic
        SelectedOptionText.Text = "You clicked: " + appBarButton.Label;
    }

    private void ShowMenu(bool isTransient)
    {
        if (ApiInformation.IsApiContractPresent("Windows.Foundation.UniversalApiContract", 7))
        {
            FlyoutShowOptions myOption = new FlyoutShowOptions
            {
                ShowMode = isTransient ? FlyoutShowMode.Transient : FlyoutShowMode.Standard,
                Placement = FlyoutPlacementMode.RightEdgeAlignedTop
            };
            CommandBarFlyout1.ShowAt(Image1, myOption);
        }
        else
        {
            CommandBarFlyout1.ShowAt(Image1);
        }
    }

    private void MyImageButton_ContextRequested(Microsoft.UI.Xaml.UIElement sender, ContextRequestedEventArgs args)
    {
        // Show a context menu in standard mode
        // Focus will move to the menu
        ShowMenu(false);
    }

    private void MyImageButton_Click(object sender, Microsoft.UI.Xaml.RoutedEventArgs e)
    {
        // Show a context menu in transient mode
        // Focus will not move to the menu
        ShowMenu(true);
    }
}

```

## 示例文件

### CommandbarflyoutCommandsAppObject.txt
```
--- header
CommandBarFlyout for commands on an in-app object
--- xaml
<Page.Resources>
    <CommandBarFlyout Placement="Right" x:Name="CommandBarFlyout1">
        <AppBarButton Label="Share" Icon="Share" ToolTipService.ToolTip="Share" Click="OnElementClicked" />
        <AppBarButton Label="Save" Icon="Save" ToolTipService.ToolTip="Save" Click="OnElementClicked" />
        <AppBarButton Label="Delete" Icon="Delete" ToolTipService.ToolTip="Delete" Click="OnElementClicked" />
        <CommandBarFlyout.SecondaryCommands>
            <AppBarButton x:Name="ResizeButton1" Label="Resize" Click="OnElementClicked" />
            <AppBarButton x:Name="MoveButton1" Label="Move" Click="OnElementClicked" />
        </CommandBarFlyout.SecondaryCommands>
    </CommandBarFlyout>
</Page.Resources>

<Button x:Name="myImageButton" AutomationProperties.Name="mountain" Padding="0"
    Click="MyImageButton_Click" ContextRequested="MyImageButton_ContextRequested" >
    <Image x:Name="Image1" Height="300" Source="/Assets/SampleMedia/rainier.jpg"/>
</Button>
--- c#
private void ShowMenu(bool isTransient)
{
    FlyoutShowOptions myOption = new FlyoutShowOptions();
    myOption.ShowMode = isTransient ? FlyoutShowMode.Transient : FlyoutShowMode.Standard;
    CommandBarFlyout1.ShowAt(Image1, myOption);
}

private void MyImageButton_ContextRequested(Microsoft.UI.Xaml.UIElement sender, ContextRequestedEventArgs args)
{
    // Show a context menu in standard mode
    // Focus will move to the menu
    ShowMenu(false);
}

private void MyImageButton_Click(object sender, Microsoft.UI.Xaml.RoutedEventArgs e)
{
    // Show a context menu in transient mode
    // Focus will not move to the menu
    ShowMenu(true);
}
```


# MenuBar

## 主页面 XAML (MenuBarPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.MenuBarPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample SampleDefinition="MenuBar\SimpleMenubar.txt">
            <StackPanel>
                <TextBlock x:Name="SelectedOptionText" Text="" />
                <MenuBar x:Name="Example1">
                    <MenuBarItem Title="File">
                        <MenuFlyoutItem
                            x:Name="o1"
                            Click="OnElementClicked"
                            Text="New" />
                        <MenuFlyoutItem
                            x:Name="o2"
                            Click="OnElementClicked"
                            Text="Open" />
                        <MenuFlyoutItem
                            x:Name="o3"
                            Click="OnElementClicked"
                            Text="Save" />
                        <MenuFlyoutItem
                            x:Name="o4"
                            Click="OnElementClicked"
                            Text="Exit" />
                    </MenuBarItem>

                    <MenuBarItem Title="Edit">
                        <MenuFlyoutItem
                            x:Name="o5"
                            Click="OnElementClicked"
                            Text="Undo" />
                        <MenuFlyoutItem
                            x:Name="o6"
                            Click="OnElementClicked"
                            Text="Cut" />
                        <MenuFlyoutItem
                            x:Name="o7"
                            Click="OnElementClicked"
                            Text="Copy" />
                        <MenuFlyoutItem
                            x:Name="o8"
                            Click="OnElementClicked"
                            Text="Paste" />
                    </MenuBarItem>

                    <MenuBarItem Title="Help">
                        <MenuFlyoutItem
                            x:Name="o9"
                            Click="OnElementClicked"
                            Text="About" />
                    </MenuBarItem>
                </MenuBar>
            </StackPanel>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="MenuBar\MenubarKeyboardAccelerators.txt">
            <StackPanel>
                <TextBlock x:Name="SelectedOptionText1" Text="" />
                <MenuBar x:Name="Example2">
                    <MenuBarItem Title="File">
                        <MenuFlyoutItem
                            x:Name="t2"
                            Click="OnElementClicked"
                            Text="New">
                            <MenuFlyoutItem.KeyboardAccelerators>
                                <KeyboardAccelerator Key="N" Modifiers="Control" />
                            </MenuFlyoutItem.KeyboardAccelerators>
                        </MenuFlyoutItem>
                        <MenuFlyoutItem
                            x:Name="t1"
                            Click="OnElementClicked"
                            Text="Open">
                            <MenuFlyoutItem.KeyboardAccelerators>
                                <KeyboardAccelerator Key="O" Modifiers="Control" />
                            </MenuFlyoutItem.KeyboardAccelerators>
                        </MenuFlyoutItem>
                        <MenuFlyoutItem
                            x:Name="t3"
                            Click="OnElementClicked"
                            Text="Save">
                            <MenuFlyoutItem.KeyboardAccelerators>
                                <KeyboardAccelerator Key="S" Modifiers="Control" />
                            </MenuFlyoutItem.KeyboardAccelerators>
                        </MenuFlyoutItem>
                        <MenuFlyoutItem
                            x:Name="t4"
                            Click="OnElementClicked"
                            Text="Exit">
                            <MenuFlyoutItem.KeyboardAccelerators>
                                <KeyboardAccelerator Key="E" Modifiers="Control" />
                            </MenuFlyoutItem.KeyboardAccelerators>
                        </MenuFlyoutItem>
                    </MenuBarItem>

                    <MenuBarItem Title="Edit">
                        <MenuFlyoutItem
                            x:Name="t5"
                            Click="OnElementClicked"
                            Text="Undo">
                            <MenuFlyoutItem.KeyboardAccelerators>
                                <KeyboardAccelerator Key="Z" Modifiers="Control" />
                            </MenuFlyoutItem.KeyboardAccelerators>
                        </MenuFlyoutItem>
                        <MenuFlyoutItem
                            x:Name="t6"
                            Click="OnElementClicked"
                            Text="Cut">
                            <MenuFlyoutItem.KeyboardAccelerators>
                                <KeyboardAccelerator Key="X" Modifiers="Control" />
                            </MenuFlyoutItem.KeyboardAccelerators>
                        </MenuFlyoutItem>
                        <MenuFlyoutItem
                            x:Name="t7"
                            Click="OnElementClicked"
                            Text="Copy">
                            <MenuFlyoutItem.KeyboardAccelerators>
                                <KeyboardAccelerator Key="C" Modifiers="Control" />
                            </MenuFlyoutItem.KeyboardAccelerators>
                        </MenuFlyoutItem>
                        <MenuFlyoutItem
                            x:Name="t8"
                            Click="OnElementClicked"
                            Text="Paste">
                            <MenuFlyoutItem.KeyboardAccelerators>
                                <KeyboardAccelerator Key="V" Modifiers="Control" />
                            </MenuFlyoutItem.KeyboardAccelerators>
                        </MenuFlyoutItem>
                    </MenuBarItem>

                    <MenuBarItem Title="Help">
                        <MenuFlyoutItem
                            x:Name="t9"
                            Click="OnElementClicked"
                            Text="About">
                            <MenuFlyoutItem.KeyboardAccelerators>
                                <KeyboardAccelerator Key="I" Modifiers="Control" />
                            </MenuFlyoutItem.KeyboardAccelerators>
                        </MenuFlyoutItem>
                    </MenuBarItem>

                </MenuBar>
            </StackPanel>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="MenuBar\MenubarSubmenusSeparatorsRadio.txt">
            <StackPanel>
                <TextBlock x:Name="SelectedOptionText2" Text="" />
                <MenuBar x:Name="Example3">
                    <MenuBarItem Title="File">
                        <MenuFlyoutSubItem Text="New">
                            <MenuFlyoutItem
                                x:Name="z1"
                                Click="OnElementClicked"
                                Text="Plain Text Document" />
                            <MenuFlyoutItem
                                x:Name="z2"
                                Click="OnElementClicked"
                                Text="Rich Text Document" />
                            <MenuFlyoutItem
                                x:Name="z3"
                                Click="OnElementClicked"
                                Text="Other Formats" />
                        </MenuFlyoutSubItem>
                        <MenuFlyoutItem
                            x:Name="z4"
                            Click="OnElementClicked"
                            Text="Open" />
                        <MenuFlyoutItem
                            x:Name="z5"
                            Click="OnElementClicked"
                            Text="Save" />
                        <MenuFlyoutSeparator />
                        <MenuFlyoutItem
                            x:Name="z6"
                            Click="OnElementClicked"
                            Text="Exit" />
                    </MenuBarItem>

                    <MenuBarItem Title="Edit">
                        <MenuFlyoutItem
                            x:Name="z7"
                            Click="OnElementClicked"
                            Text="Undo" />
                        <MenuFlyoutItem
                            x:Name="z8"
                            Click="OnElementClicked"
                            Text="Cut" />
                        <MenuFlyoutItem
                            x:Name="z9"
                            Click="OnElementClicked"
                            Text="Copy" />
                        <MenuFlyoutItem
                            x:Name="z11"
                            Click="OnElementClicked"
                            Text="Paste" />
                    </MenuBarItem>

                    <MenuBarItem Title="View">
                        <MenuFlyoutItem
                            x:Name="z12"
                            Click="OnElementClicked"
                            Text="Output" />
                        <MenuFlyoutSeparator />
                        <RadioMenuFlyoutItem
                            x:Name="z13"
                            Click="OnElementClicked"
                            GroupName="OrientationGroup"
                            Text="Landscape" />
                        <RadioMenuFlyoutItem
                            x:Name="z14"
                            Click="OnElementClicked"
                            GroupName="OrientationGroup"
                            IsChecked="True"
                            Text="Portrait" />
                        <MenuFlyoutSeparator />
                        <RadioMenuFlyoutItem
                            x:Name="z15"
                            Click="OnElementClicked"
                            GroupName="SizeGroup"
                            Text="Small icons" />
                        <RadioMenuFlyoutItem
                            x:Name="z16"
                            Click="OnElementClicked"
                            GroupName="SizeGroup"
                            IsChecked="True"
                            Text="Medium icons" />
                        <RadioMenuFlyoutItem
                            x:Name="z17"
                            Click="OnElementClicked"
                            GroupName="SizeGroup"
                            Text="Large icons" />
                    </MenuBarItem>

                    <MenuBarItem Title="Help">
                        <MenuFlyoutItem
                            x:Name="z18"
                            Click="OnElementClicked"
                            Text="About" />
                    </MenuBarItem>
                </MenuBar>
            </StackPanel>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (MenuBarPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class MenuBarPage : Page
{
    public MenuBarPage()
    {
        this.InitializeComponent();
    }

    private void OnElementClicked(object sender, Microsoft.UI.Xaml.RoutedEventArgs e)
    {
        if (sender is not MenuFlyoutItem selectedFlyoutItem)
        {
            return;
        }

        string exampleNumber = selectedFlyoutItem.Name.Substring(0, 1);

        if (exampleNumber == "o")
        {
            SelectedOptionText.Text = "You clicked: " + selectedFlyoutItem.Text;
        }
        else if (exampleNumber == "t")
        {
            SelectedOptionText1.Text = "You clicked: " + selectedFlyoutItem.Text;
        }
        else if (exampleNumber == "z")
        {
            SelectedOptionText2.Text = "You clicked: " + selectedFlyoutItem.Text;
        }
    }
}

```

## 示例文件

### MenubarKeyboardAccelerators.txt
```
--- header
MenuBar with keyboard accelerators
--- xaml
<MenuBar>
  <MenuBarItem Title="File">
    <MenuFlyoutItem Text="New">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="N"/>
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
    <MenuFlyoutItem Text="Open...">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="O"/>
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
    <MenuFlyoutItem Text="Save">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="S"/>
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
    <MenuFlyoutItem Text="Exit">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="E"/>
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
  </MenuBarItem>

  <MenuBarItem Title="Edit">
    <MenuFlyoutItem Text="Undo">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="Z"/>
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
    <MenuFlyoutItem Text="Cut">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="X"/>
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
    <MenuFlyoutItem Text="Copy">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="C"/>
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
    <MenuFlyoutItem Text="Paste">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="V"/>
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
  </MenuBarItem>

  <MenuBarItem Title="Help">
    <MenuFlyoutItem Text="About">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="I"/>
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
  </MenuBarItem>
</MenuBar>
```

### MenubarSubmenusSeparatorsRadio.txt
```
--- header
MenuBar with submenus, separators, and radio items
--- xaml
<MenuBar>
    <MenuBarItem Title="File">
        <MenuFlyoutSubItem Text="New">
            <MenuFlyoutItem Text="Plain Text Document"/>
            <MenuFlyoutItem Text="Rich Text Document"/>
            <MenuFlyoutItem Text="Other Formats..."/>
        </MenuFlyoutSubItem>
        <MenuFlyoutItem Text="Open..."/>
        <MenuFlyoutItem Text="Save"/>
        <MenuFlyoutSeparator />
        <MenuFlyoutItem Text="Exit"/>
    </MenuBarItem>

    <MenuBarItem Title="Edit">
        <MenuFlyoutItem Text="Undo"/>
        <MenuFlyoutItem Text="Cut"/>
        <MenuFlyoutItem Text="Copy"/>
        <MenuFlyoutItem Text="Paste"/>
    </MenuBarItem>

    <MenuBarItem Title="View">
        <MenuFlyoutItem Text="Output"/>
        <MenuFlyoutSeparator/>
        <RadioMenuFlyoutItem Text="Landscape" GroupName="OrientationGroup"/>
        <RadioMenuFlyoutItem Text="Portrait" GroupName="OrientationGroup" IsChecked="True"/>
        <MenuFlyoutSeparator/>
        <RadioMenuFlyoutItem Text="Small icons" GroupName="SizeGroup"/>
        <RadioMenuFlyoutItem Text="Medium icons" IsChecked="True" GroupName="SizeGroup"/>
        <RadioMenuFlyoutItem Text="Large icons" GroupName="SizeGroup"/>
    </MenuBarItem>
                    
    <MenuBarItem Title="Help">
        <MenuFlyoutItem Text="About"/>
    </MenuBarItem>
</MenuBar>
```

### SimpleMenubar.txt
```
--- header
A simple MenuBar
--- xaml
<MenuBar>
    <MenuBarItem Title="File">
        <MenuFlyoutItem Text="New"/>
        <MenuFlyoutItem Text="Open..."/>
        <MenuFlyoutItem Text="Save"/>
        <MenuFlyoutItem Text="Exit"/>
    </MenuBarItem>

    <MenuBarItem Title="Edit">
        <MenuFlyoutItem Text="Undo"/>
        <MenuFlyoutItem Text="Cut"/>
        <MenuFlyoutItem Text="Copy"/>
        <MenuFlyoutItem Text="Paste"/>
    </MenuBarItem>

    <MenuBarItem Title="Help">
        <MenuFlyoutItem Text="About"/>
    </MenuBarItem>
</MenuBar>
```


# MenuFlyout

## 主页面 XAML (MenuFlyoutPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.MenuFlyoutPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="MenuFlyout\AppbarbuttonMenuflyout.txt">
            <StackPanel x:Name="Control1" Orientation="Horizontal">
                <AppBarButton
                    AutomationProperties.Name="Sort"
                    Icon="Sort"
                    IsCompact="True"
                    ToolTipService.ToolTip="Sort">
                    <Button.Flyout>
                        <MenuFlyout>
                            <MenuFlyoutItem
                                Click="MenuFlyoutItem_Click"
                                Tag="rating"
                                Text="By rating" />
                            <MenuFlyoutItem
                                Click="MenuFlyoutItem_Click"
                                Tag="match"
                                Text="By match" />
                            <MenuFlyoutItem
                                Click="MenuFlyoutItem_Click"
                                Tag="distance"
                                Text="By distance" />
                        </MenuFlyout>
                    </Button.Flyout>
                </AppBarButton>
                <TextBlock x:Name="Control1Output" Style="{StaticResource OutputTextBlockStyle}" />
            </StackPanel>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example2" SampleDefinition="MenuFlyout\MenuflyoutTogglemenuflyoutitemsMenuflyoutseparator.txt">
            <Button x:Name="Control2" Content="Options">
                <Button.Flyout>
                    <MenuFlyout>
                        <MenuFlyoutItem Text="Reset" />
                        <MenuFlyoutSeparator />
                        <ToggleMenuFlyoutItem
                            x:Name="RepeatToggleMenuFlyoutItem"
                            IsChecked="True"
                            Text="Repeat" />
                        <ToggleMenuFlyoutItem
                            x:Name="ShuffleToggleMenuFlyoutItem"
                            IsChecked="True"
                            Text="Shuffle" />
                    </MenuFlyout>
                </Button.Flyout>
            </Button>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="RepeatToggle" Value="{x:Bind RepeatToggleMenuFlyoutItem.IsChecked, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="ShuffleToggle" Value="{x:Bind ShuffleToggleMenuFlyoutItem.IsChecked, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example3" SampleDefinition="MenuFlyout\MenuflyoutCascadingMenus.txt">
            <Button x:Name="Control3" Content="File Options">
                <Button.Flyout>
                    <MenuFlyout>
                        <MenuFlyoutItem Text="Open" />
                        <MenuFlyoutSubItem Text="Send to">
                            <MenuFlyoutItem Text="Bluetooth" />
                            <MenuFlyoutItem Text="Desktop (shortcut)" />
                            <MenuFlyoutSubItem Text="Compressed file">
                                <MenuFlyoutItem Text="Compress and email" />
                                <MenuFlyoutItem Text="Compress to .7z" />
                                <MenuFlyoutItem Text="Compress to .zip" />
                            </MenuFlyoutSubItem>
                        </MenuFlyoutSubItem>
                    </MenuFlyout>
                </Button.Flyout>
            </Button>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example3b" SampleDefinition="MenuFlyout\MenuflyoutSplitmenuflyoutitems.txt">
            <StackPanel x:Name="Control3b" Orientation="Horizontal">
                <Button Content="File Options">
                    <Button.Flyout>
                        <MenuFlyout>
                            <SplitMenuFlyoutItem
                                x:Name="SaveSplitItem"
                                Click="SplitMenuFlyoutItem_Click"
                                Text="Save">
                                <SplitMenuFlyoutItem.Icon>
                                    <FontIcon Glyph="&#xE74E;" />
                                </SplitMenuFlyoutItem.Icon>
                                <MenuFlyoutItem Click="SplitMenuFlyoutItem_Click" Text="Save as .docx" />
                                <MenuFlyoutItem Click="SplitMenuFlyoutItem_Click" Text="Save as .pdf" />
                                <MenuFlyoutItem Click="SplitMenuFlyoutItem_Click" Text="Save as .txt" />
                            </SplitMenuFlyoutItem>
                            <SplitMenuFlyoutItem
                                Click="SplitMenuFlyoutItem_Click"
                                Icon="Share"
                                Text="Share">
                                <MenuFlyoutItem Click="SplitMenuFlyoutItem_Click" Text="Share via email" />
                                <MenuFlyoutItem Click="SplitMenuFlyoutItem_Click" Text="Share via link" />
                            </SplitMenuFlyoutItem>
                        </MenuFlyout>
                    </Button.Flyout>
                </Button>
                <TextBlock x:Name="Control3bOutput" Style="{StaticResource OutputTextBlockStyle}" />
            </StackPanel>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example4" SampleDefinition="MenuFlyout\MenuflyoutIcons.txt">
            <Button x:Name="Control4" Content="Edit Options">
                <Button.Flyout>
                    <MenuFlyout>
                        <MenuFlyoutItem Text="Share">
                            <MenuFlyoutItem.Icon>
                                <FontIcon Glyph="&#xE72D;" />
                            </MenuFlyoutItem.Icon>
                        </MenuFlyoutItem>
                        <MenuFlyoutItem Icon="Copy" Text="Copy" />
                        <MenuFlyoutItem Icon="Delete" Text="Delete" />
                        <MenuFlyoutSeparator />
                        <MenuFlyoutItem Text="Rename" />
                        <MenuFlyoutItem Text="Select" />
                    </MenuFlyout>
                </Button.Flyout>
            </Button>
        </controls:ControlExample>
        <controls:ControlExample
            x:Name="Example5"
            FontFamily="Segoe UI"
            SampleDefinition="MenuFlyout\MenuflyoutIconsKeyboardAccelerators.txt"
            Loaded="Example5_Loaded">
            <Button x:Name="Control5" Content="Edit Options">
                <Button.Flyout>
                    <MenuFlyout>
                        <MenuFlyoutItem Text="Share">
                            <MenuFlyoutItem.Icon>
                                <FontIcon Glyph="&#xE72D;" />
                            </MenuFlyoutItem.Icon>
                            <MenuFlyoutItem.KeyboardAccelerators>
                                <KeyboardAccelerator Key="S" Modifiers="Control" />
                            </MenuFlyoutItem.KeyboardAccelerators>
                        </MenuFlyoutItem>
                        <MenuFlyoutItem
                            FontFamily="Consolas"
                            Icon="Copy"
                            Text="Copy">
                            <MenuFlyoutItem.KeyboardAccelerators>
                                <KeyboardAccelerator Key="C" Modifiers="Control" />
                            </MenuFlyoutItem.KeyboardAccelerators>
                        </MenuFlyoutItem>
                        <MenuFlyoutItem
                            FontFamily="Segoe UI"
                            Icon="Delete"
                            Text="Delete">
                            <MenuFlyoutItem.KeyboardAccelerators>
                                <KeyboardAccelerator Key="Delete" />
                            </MenuFlyoutItem.KeyboardAccelerators>
                        </MenuFlyoutItem>
                        <MenuFlyoutSeparator />
                        <MenuFlyoutItem Text="Rename" />
                        <MenuFlyoutItem Text="Select" />
                    </MenuFlyout>
                </Button.Flyout>
            </Button>
        </controls:ControlExample>

        <controls:ControlExample x:Name="Example6" SampleDefinition="MenuFlyout\MenuflyoutRadiomenuflyoutitems.txt">
            <Button x:Name="Control6" Content="Options">
                <Button.Flyout>
                    <MenuFlyout>
                        <RadioMenuFlyoutItem GroupName="OrientationGroup" Text="Landscape" />
                        <RadioMenuFlyoutItem
                            GroupName="OrientationGroup"
                            IsChecked="True"
                            Text="Portrait" />
                        <MenuFlyoutSeparator />
                        <RadioMenuFlyoutItem GroupName="SizeGroup" Text="Small icons" />
                        <RadioMenuFlyoutItem
                            GroupName="SizeGroup"
                            IsChecked="True"
                            Text="Medium icons" />
                        <RadioMenuFlyoutItem GroupName="SizeGroup" Text="Large icons" />
                    </MenuFlyout>
                </Button.Flyout>
            </Button>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (MenuFlyoutPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class MenuFlyoutPage : Page
{
    public MenuFlyoutPage()
    {
        this.InitializeComponent();
    }

    private void MenuFlyoutItem_Click(object sender, RoutedEventArgs e)
    {
        if (sender is MenuFlyoutItem selectedItem)
        {
            string? sortOption = selectedItem.Tag.ToString();
            switch (sortOption)
            {
                case "rating":
                    //SortByRating();
                    break;
                case "match":
                    //SortByMatch();
                    break;
                case "distance":
                    //SortByDistance();
                    break;
            }
            Control1Output.Text = "Sort by: " + sortOption;
        }
    }

    private void Example5_Loaded(object sender, RoutedEventArgs e)
    {

    }

    private void SplitMenuFlyoutItem_Click(object sender, RoutedEventArgs e)
    {
        if (sender is MenuFlyoutItem selectedItem)
        {
            Control3bOutput.Text = "Clicked: " + selectedItem.Text;
        }
    }
}

```

## 示例文件

### AppbarbuttonMenuflyout.txt
```
--- header
An AppBarButton with a MenuFlyout.
--- xaml
<AppBarButton Icon="Sort" IsCompact="True" ToolTipService.ToolTip="Sort" AutomationProperties.Name="Sort">
    <AppBarButton.Flyout>
        <MenuFlyout>
            <MenuFlyoutItem Text="By rating" Click="MenuFlyoutItem_Click" Tag="rating"/>
            <MenuFlyoutItem Text="By match" Click="MenuFlyoutItem_Click" Tag="match"/>
            <MenuFlyoutItem Text="By distance" Click="MenuFlyoutItem_Click" Tag="distance"/>
        </MenuFlyout>
    </AppBarButton.Flyout>
</AppBarButton>
```

### MenuflyoutCascadingMenus.txt
```
--- header
A MenuFlyout with cascading menus.
--- xaml
<Button Content="File Options">
    <Button.Flyout>
        <MenuFlyout>
            <MenuFlyoutItem Text="Open"/>
            <MenuFlyoutSubItem Text="Send to">
                <MenuFlyoutItem Text="Bluetooth" />
                <MenuFlyoutItem Text="Desktop (shortcut)" />
                <MenuFlyoutSubItem Text="Compressed file">
                    <MenuFlyoutItem Text="Compress and email" />
                    <MenuFlyoutItem Text="Compress to .7z" />
                    <MenuFlyoutItem Text="Compress to .zip" />
                </MenuFlyoutSubItem>
            </MenuFlyoutSubItem>
        </MenuFlyout>
    </Button.Flyout>
</Button>
```

### MenuflyoutIcons.txt
```
--- header
A MenuFlyout with icons.
--- xaml
<Button Content="Edit Options">
    <Button.Flyout>
        <MenuFlyout>
            <MenuFlyoutItem Text="Share">
                <MenuFlyoutItem.Icon>
                    <FontIcon Glyph="&#xE72D;"/>
                </MenuFlyoutItem.Icon>
            </MenuFlyoutItem>
            <MenuFlyoutItem Text="Copy" Icon="Copy"/>
            <MenuFlyoutItem Text="Delete" Icon="Delete"/>
            <MenuFlyoutSeparator/>
            <MenuFlyoutItem Text="Rename"/>
            <MenuFlyoutItem Text="Select"/>
        </MenuFlyout>
    </Button.Flyout>
</Button>
```

### MenuflyoutIconsKeyboardAccelerators.txt
```
--- header
A MenuFlyout with icons and Keyboard Accelerators.
--- xaml
<Button Content="Edit Options">
    <Button.Flyout>
        <MenuFlyout>
            <MenuFlyoutItem Text="Share">
                <MenuFlyoutItem.Icon>
                    <FontIcon Glyph="&#xE72D;"/>
                </MenuFlyoutItem.Icon>
                <MenuFlyoutItem.KeyboardAccelerators>
                    <KeyboardAccelerator Key="S" Modifiers="Control"/>
                </MenuFlyoutItem.KeyboardAccelerators>
            </MenuFlyoutItem>
            <MenuFlyoutItem Text="Copy" Icon="Copy">
                <MenuFlyoutItem.KeyboardAccelerators>
                    <KeyboardAccelerator Key="C" Modifiers="Control"/>
                </MenuFlyoutItem.KeyboardAccelerators>
            </MenuFlyoutItem>
            <MenuFlyoutItem Text="Delete" Icon="Delete">
                <MenuFlyoutItem.KeyboardAccelerators>
                    <KeyboardAccelerator Key="Delete" />
                </MenuFlyoutItem.KeyboardAccelerators>
            </MenuFlyoutItem>
            <MenuFlyoutSeparator/>
            <MenuFlyoutItem Text="Rename"/>
            <MenuFlyoutItem Text="Select"/>
        </MenuFlyout>
    </Button.Flyout>
</Button>
```

### MenuflyoutRadiomenuflyoutitems.txt
```
--- header
A MenuFlyout with RadioMenuFlyoutItems
--- xaml
<Button Content="Options">
    <Button.Flyout>
        <MenuFlyout>
            <RadioMenuFlyoutItem Text="Landscape" GroupName="OrientationGroup"/>
            <RadioMenuFlyoutItem Text="Portrait" GroupName="OrientationGroup" IsChecked="True"/>
            <MenuFlyoutSeparator/>
            <RadioMenuFlyoutItem Text="Small icons" GroupName="SizeGroup"/>
            <RadioMenuFlyoutItem Text="Medium icons" IsChecked="True" GroupName="SizeGroup"/>
            <RadioMenuFlyoutItem Text="Large icons" GroupName="SizeGroup"/>
        </MenuFlyout>
    </Button.Flyout>
</Button>
```

### MenuflyoutSplitmenuflyoutitems.txt
```
--- header
A MenuFlyout with SplitMenuFlyoutItems.
--- xaml
<Button Content="File Options">
    <Button.Flyout>
        <MenuFlyout>
            <SplitMenuFlyoutItem Text="Save" Click="SplitMenuFlyoutItem_Click">
                <SplitMenuFlyoutItem.Icon>
                    <FontIcon Glyph="&#xE74E;"/>
                </SplitMenuFlyoutItem.Icon>
                <MenuFlyoutItem Text="Save as .docx" Click="SplitMenuFlyoutItem_Click"/>
                <MenuFlyoutItem Text="Save as .pdf" Click="SplitMenuFlyoutItem_Click"/>
                <MenuFlyoutItem Text="Save as .txt" Click="SplitMenuFlyoutItem_Click"/>
            </SplitMenuFlyoutItem>
            <SplitMenuFlyoutItem Text="Share" Icon="Share" Click="SplitMenuFlyoutItem_Click">
                <MenuFlyoutItem Text="Share via email" Click="SplitMenuFlyoutItem_Click"/>
                <MenuFlyoutItem Text="Share via link" Click="SplitMenuFlyoutItem_Click"/>
            </SplitMenuFlyoutItem>
        </MenuFlyout>
    </Button.Flyout>
</Button>
```

### MenuflyoutTogglemenuflyoutitemsMenuflyoutseparator.txt
```
--- header
A MenuFlyout with ToggleMenuFlyoutItems and MenuFlyoutSeparator.
--- xaml
<Button Content="Options">
    <Button.Flyout>
        <MenuFlyout>
            <MenuFlyoutItem Text="Reset"/>
            <MenuFlyoutSeparator/>
            <ToggleMenuFlyoutItem Text="Repeat" IsChecked="$(RepeatToggle)"/>
            <ToggleMenuFlyoutItem Text="Shuffle" IsChecked="$(ShuffleToggle)"/>
        </MenuFlyout>
    </Button.Flyout>
</Button>
```


# SwipeControl

## 主页面 XAML (SwipeControlPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.SwipeControlPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <StackPanel>
        <StackPanel.Resources>
            <Style TargetType="ListViewItem">
                <Setter Property="Padding" Value="0" />
            </Style>
        </StackPanel.Resources>

        <StackPanel>
            <controls:ControlExample x:Name="Example1" SampleDefinition="SwipeControl\SwipeControlSwipeRightRevealActions.txt">
                <controls:ControlExample.Example>
                    <Border>
                        <Border.Resources>
                            <FontIconSource x:Key="AcceptIcon" Glyph="&#xE8FB;" />
                            <FontIconSource x:Key="FlagIcon" Glyph="&#xE7C1;" />

                            <SwipeItems x:Key="left" Mode="Reveal">
                                <SwipeItem
                                    Background="{ThemeResource ButtonBackgroundThemeBrush}"
                                    Foreground="{ThemeResource AppBarItemForegroundThemeBrush}"
                                    IconSource="{StaticResource AcceptIcon}"
                                    Invoked="Accept_ItemInvoked"
                                    Text="Accept" />
                                <SwipeItem
                                    Background="{ThemeResource ButtonBackgroundThemeBrush}"
                                    Foreground="{ThemeResource AppBarItemForegroundThemeBrush}"
                                    IconSource="{StaticResource FlagIcon}"
                                    Invoked="Flag_ItemInvoked"
                                    Text="Flag" />
                            </SwipeItems>
                        </Border.Resources>
                        <SwipeControl
                            Width="500"
                            Height="68"
                            Margin="12"
                            BorderBrush="{ThemeResource ButtonBackground}"
                            BorderThickness="1"
                            LeftItems="{StaticResource left}">
                            <TextBlock
                                Margin="12"
                                HorizontalAlignment="Center"
                                VerticalAlignment="Center"
                                Text="Swipe Right" />
                        </SwipeControl>
                    </Border>
                </controls:ControlExample.Example>
            </controls:ControlExample>

            <controls:ControlExample x:Name="Example2" SampleDefinition="SwipeControl\SwipeControlSwipeLeftInvokeExecute.txt">
                <controls:ControlExample.Example>
                    <Border>
                        <Border.Resources>
                            <FontIconSource x:Key="ArchiveIcon" Glyph="&#xE7B8;" />
                            <SwipeItems x:Key="right" Mode="Execute">
                                <SwipeItem
                                    BehaviorOnInvoked="Close"
                                    IconSource="{StaticResource ArchiveIcon}"
                                    Invoked="DeleteOne_ItemInvoked"
                                    Text="Archive" />
                            </SwipeItems>
                        </Border.Resources>
                        <SwipeControl
                            Width="500"
                            Height="68"
                            Margin="12"
                            BorderBrush="{ThemeResource ButtonBackground}"
                            BorderThickness="1"
                            RightItems="{StaticResource right}">
                            <TextBlock
                                Margin="12"
                                HorizontalAlignment="Center"
                                VerticalAlignment="Center"
                                Text="Swipe Left" />
                        </SwipeControl>
                    </Border>
                </controls:ControlExample.Example>
            </controls:ControlExample>

            <controls:ControlExample x:Name="Example3" SampleDefinition="SwipeControl\SwipeControlCustomSwipeListview.txt">
                <controls:ControlExample.Example>
                    <ListView
                        x:Name="lv"
                        Width="800"
                        Height="300"
                        MinWidth="200"
                        Margin="12">
                        <ListView.Resources>
                            <FontIconSource x:Key="ReplyAllIcon" Glyph="&#xE8C2;" />
                            <FontIconSource x:Key="ReadIcon" Glyph="&#xE8C3;" />
                            <FontIconSource x:Key="DeleteIcon" Glyph="&#xE74D;" />

                            <SwipeItems x:Key="left" Mode="Reveal">
                                <SwipeItem
                                    Background="#FF3e6fa7"
                                    Foreground="White"
                                    IconSource="{StaticResource ReplyAllIcon}"
                                    Text="Reply All" />
                                <SwipeItem
                                    Background="#FFff9501"
                                    Foreground="White"
                                    IconSource="{StaticResource ReadIcon}"
                                    Text="Open" />
                            </SwipeItems>
                            <SwipeItems x:Key="right" Mode="Execute">
                                <SwipeItem
                                    Background="Red"
                                    IconSource="{StaticResource DeleteIcon}"
                                    Invoked="DeleteItem_ItemInvoked"
                                    Text="Delete" />
                            </SwipeItems>
                        </ListView.Resources>

                        <ListView.ItemTemplate>
                            <DataTemplate>
                                <SwipeControl
                                    Height="68"
                                    MinWidth="200"
                                    BorderBrush="{ThemeResource ButtonBackground}"
                                    BorderThickness="0,1,0,0"
                                    LeftItems="{StaticResource left}"
                                    RightItems="{StaticResource right}">
                                    <TextBlock
                                        Margin="12"
                                        HorizontalAlignment="Stretch"
                                        VerticalAlignment="Center"
                                        FontSize="24"
                                        Text="{Binding}" />
                                </SwipeControl>
                            </DataTemplate>
                        </ListView.ItemTemplate>
                    </ListView>
                </controls:ControlExample.Example>
            </controls:ControlExample>

            <controls:ControlExample x:Name="Example4" SampleDefinition="SwipeControl\SwipeControlGradientBackground.txt">
                <controls:ControlExample.Example>
                    <Border>
                        <Border.Resources>
                            <FontIconSource x:Key="LockIcon" Glyph="&#xE72E;" />
                            <LinearGradientBrush x:Key="PurpleGradient" StartPoint="0,0.5" EndPoint="1,0.5">
                                <GradientStop Offset="0.0" Color="#ff8990f9" />
                                <GradientStop Offset="0.5" Color="#ff5b66fb" />
                                <GradientStop Offset="1.0" Color="#ff5c1df4" />
                            </LinearGradientBrush>
                            <SwipeItems x:Key="right" Mode="Execute">
                                <SwipeItem
                                    Background="{StaticResource PurpleGradient}"
                                    BehaviorOnInvoked="Close"
                                    IconSource="{StaticResource LockIcon}"
                                    Text="Lock" />
                            </SwipeItems>
                        </Border.Resources>
                        <SwipeControl
                            Width="500"
                            Height="68"
                            Margin="12"
                            BorderBrush="{ThemeResource ButtonBackground}"
                            BorderThickness="1"
                            RightItems="{StaticResource right}">
                            <TextBlock
                                Margin="12"
                                HorizontalAlignment="Center"
                                VerticalAlignment="Center"
                                Text="Swipe Left" />
                        </SwipeControl>
                    </Border>
                </controls:ControlExample.Example>
            </controls:ControlExample>

            <controls:ControlExample x:Name="Example5" SampleDefinition="SwipeControl\SwipeControlCustomIcons.txt">
                <controls:ControlExample.Example>
                    <Border>
                        <Border.Resources>
                            <SwipeItems x:Key="left" Mode="Reveal">
                                <SwipeItem
                                    Background="{ThemeResource ButtonBackgroundThemeBrush}"
                                    Foreground="{ThemeResource AppBarItemForegroundThemeBrush}"
                                    Text="Coffee">
                                    <SwipeItem.IconSource>
                                        <BitmapIconSource UriSource="ms-appx:///Assets/SampleMedia/CoffeeCup.png" />
                                    </SwipeItem.IconSource>
                                </SwipeItem>
                            </SwipeItems>
                        </Border.Resources>
                        <SwipeControl
                            Width="500"
                            Height="68"
                            Margin="12"
                            BorderBrush="{ThemeResource ButtonBackground}"
                            BorderThickness="1"
                            LeftItems="{StaticResource left}">
                            <TextBlock
                                Margin="12"
                                HorizontalAlignment="Center"
                                VerticalAlignment="Center"
                                Text="Swipe Right" />
                        </SwipeControl>
                    </Border>
                </controls:ControlExample.Example>
            </controls:ControlExample>

        </StackPanel>

    </StackPanel>
</Page>

```

## 主页面 C# (SwipeControlPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;
using System.Collections.ObjectModel;

namespace WinUIGallery.ControlPages;

public sealed partial class SwipeControlPage : Page
{
    private bool isArchived = false;

    private bool isFlagged = false;
    private bool isAccepted = false;

    public SwipeControlPage()
    {
        this.InitializeComponent();
        var source = @"Swipe Item 1,Swipe Item 2,Swipe Item 3,Swipe Item 4".Split(',');
        foreach (var item in source)
            items.Add(item);
        lv.ItemsSource = items;
    }

    ObservableCollection<object> items = new ObservableCollection<object>();

    private void DeleteOne_ItemInvoked(SwipeItem sender, SwipeItemInvokedEventArgs args)
    {
        isArchived = !isArchived;

        if (isArchived)
        {
            ((TextBlock)args.SwipeControl.Content).Text = "Archived - Swipe Left";
        }
        else
        {
            ((TextBlock)args.SwipeControl.Content).Text = "Swipe Left";
        }
    }

    private void DeleteItem_ItemInvoked(SwipeItem sender, SwipeItemInvokedEventArgs args)
    {
        items.Remove(args.SwipeControl.DataContext);
    }

    private void Accept_ItemInvoked(SwipeItem sender, SwipeItemInvokedEventArgs args)
    {
        isAccepted = !isAccepted;
        CheckAcceptFlagBool(args.SwipeControl);

        if (isAccepted)
        {
            FontIconSource cancelIcon = new FontIconSource() { Glyph = "\ue711" };
            sender.IconSource = cancelIcon;
            sender.Text = "Cancel";
        }
        else
        {
            FontIconSource acceptIcon = new FontIconSource() { Glyph = "\ue10B" };
            sender.IconSource = acceptIcon;
            sender.Text = "Accept";
        }
    }

    private void Flag_ItemInvoked(SwipeItem sender, SwipeItemInvokedEventArgs args)
    {
        isFlagged = !isFlagged;
        CheckAcceptFlagBool(args.SwipeControl);

        if (isFlagged)
        {
            FontIconSource filledFlagIcon = new FontIconSource() { Glyph = "\ueB4B" };
            sender.IconSource = filledFlagIcon;
            sender.Text = "Unmark";
        }
        else
        {
            FontIconSource flagIcon = new FontIconSource() { Glyph = "\ue129" };
            sender.IconSource = flagIcon;
            sender.Text = "Flag";
        }
    }

    private void CheckAcceptFlagBool(SwipeControl swipeCtrl)
    {
        if (isAccepted && !isFlagged)
        {
            ((TextBlock)swipeCtrl.Content).Text = "Swipe Right - Accepted";
        }
        else if (isAccepted && isFlagged)
        {
            ((TextBlock)swipeCtrl.Content).Text = "Swipe Right - Accepted & Flagged";
        }
        else if (!isAccepted && isFlagged)
        {
            ((TextBlock)swipeCtrl.Content).Text = "Swipe Right - Flagged";
        }
        else
        {
            ((TextBlock)swipeCtrl.Content).Text = "Swipe Right";
        }
    }
}

```

## 示例文件

### SwipeControlCustomIcons.txt
```
--- header
Custom icons
--- xaml
<Border>
    <Border.Resources>
        <SwipeItems x:Key="left" Mode="Reveal">
            <SwipeItem Text="Coffee">
                <SwipeItem.IconSource>
                    <BitmapIconSource UriSource="ms-appx:///Assets/SampleMedia/CoffeeCup.png"/>
                <SwipeItem.IconSource/>
            <SwipeItem/>
        </SwipeItems>
    </Border.Resources>
    <SwipeControl BorderThickness="1"
        LeftItems="{StaticResource left}" BorderBrush="{ThemeResource ButtonBackground}"
        Width="300" Margin="12" Height="68">
            <TextBlock Text="Swipe Right" Margin="12"
                       HorizontalAlignment="Center" VerticalAlignment="Center"/>
    </SwipeControl>
</Border>
```

### SwipeControlCustomSwipeListview.txt
```
--- header
Custom Swipe in a ListView
--- xaml
<ListView x:Name="lv" Width="400" Height="300" Margin="12">
    <ListView.Resources>
        <FontIconSource x:Key="ReplyAllIcon" Glyph="&#xE8C2;"/>
        <FontIconSource x:Key="ReadIcon" Glyph="&#xE8C3;"/>
        <FontIconSource x:Key="DeleteIcon" Glyph="&#xE74D;"/>

        <SwipeItems x:Key="left" Mode="Reveal">
            <SwipeItem Text="Reply All" IconSource="{StaticResource ReplyAllIcon}"
                       Background="#FF3e6fa7" Foreground="White"/>
            <SwipeItem Text="Open" IconSource="{StaticResource ReadIcon}"
                       Background="#FFff9501" Foreground="White"/>
        </SwipeItems>
        <SwipeItems x:Key="right" Mode="Execute">
            <SwipeItem Text="Delete" IconSource="{StaticResource DeleteIcon}"
                       Background="#FFF4B183" Invoked="DeleteItem_ItemInvoked"/>
        </SwipeItems>
    </ListView.Resources>

    <ListView.ItemTemplate>
        <DataTemplate>
            <SwipeControl BorderThickness="0,1,0,0" BorderBrush="{ThemeResource ButtonBackground}" Height="68"
                       Width="800" MinWidth="200" LeftItems="{StaticResource left}"
                          RightItems="{StaticResource right}">
                <TextBlock Text="{Binding}" FontSize="24" Margin="12"
                           HorizontalAlignment="Stretch" VerticalAlignment="Center"/>
            </SwipeControl>
        </DataTemplate>
    </ListView.ItemTemplate>
</ListView>
```

### SwipeControlGradientBackground.txt
```
--- header
Gradient Background
--- xaml
<Border>
    <Border.Resources>
        <FontIconSource x:Key="LockIcon" Glyph="&#xE72E;"/>
        <LinearGradientBrush x:Key="PurpleGradient" StartPoint="0,0.5" EndPoint="1,0.5">
            <GradientStop Color="#ff8990f9" Offset="0.0"/>
            <GradientStop Color="#ff5b66fb" Offset="0.5"/>
            <GradientStop Color="#ff5c1df4" Offset="1.0"/>
        <LinearGradientBrush/>
        <SwipeItems x:Key="right" Mode="Execute">
            <SwipeItem Text="Lock" Background="{StaticResource PurpleGradient}" 
                       BehaviorOnInvoked="Close" IconSource="{StaticResource LockIcon}"/>
        </SwipeItems>
    </Border.Resources>
    <SwipeControl BorderThickness="1" BorderBrush="{ThemeResource ButtonBackground}"
        RightItems="{StaticResource right}"
        Width="500" Margin="12" Height="68">
        <TextBlock Text="Swipe Left" Margin="12"
                   HorizontalAlignment="Center" VerticalAlignment="Center"/>
    </SwipeControl>
</Border>
```

### SwipeControlSwipeLeftInvokeExecute.txt
```
--- header
Swipe left to invoke an execute
--- xaml
<Border>
    <Border.Resources>
        <FontIconSource x:Key="DeleteIcon" Glyph="&#xE74D;"/>
        <SwipeItems x:Key="right" Mode="Execute">
            <SwipeItem Text="Archive" IconSource="{StaticResource ArchiveIcon}"
                       BehaviorOnInvoked="Close" Invoked="DeleteOne_ItemInvoked"/>
        </SwipeItems>
    </Border.Resources>
    <SwipeControl BorderThickness="1" BorderBrush="{ThemeResource ButtonBackground}"
        RightItems="{StaticResource right}"
        Width="300" Margin="12" Height="68">
        <TextBlock Text="Swipe Left" Margin="12"
                   HorizontalAlignment="Center" VerticalAlignment="Center"/>
    </SwipeControl>
</Border>
```

### SwipeControlSwipeRightRevealActions.txt
```
--- header
Swipe right to reveal actions
--- xaml
<Border>
    <Border.Resources>
        <FontIconSource x:Key="AcceptIcon" Glyph="&#xE8FB;"/>
        <FontIconSource x:Key="FlagIcon" Glyph="&#xE7C1;"/>

        <SwipeItems x:Key="left" Mode="Reveal">
            <SwipeItem Text="Accept" IconSource="{StaticResource AcceptIcon}" Invoked="Accept_ItemInvoked"/>
            <SwipeItem Text="Flag" IconSource="{StaticResource FlagIcon}" Invoked="Flag_ItemInvoked"/>
        </SwipeItems>
    </Border.Resources>
    <SwipeControl BorderThickness="1"
        LeftItems="{StaticResource left}" BorderBrush="{ThemeResource ButtonBackground}"
        Width="300" Margin="12" Height="68">
            <TextBlock Text="Swipe Right" Margin="12"
                       HorizontalAlignment="Center" VerticalAlignment="Center"/>
    </SwipeControl>
</Border>
```


# StandardUICommand

## 主页面 XAML (StandardUICommandPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.StandardUICommandPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:local="using:WinUIGallery.ControlPages"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <Page.Resources>
        <Style
            x:Key="HorizontalSwipe"
            BasedOn="{StaticResource DefaultListViewItemStyle}"
            TargetType="ListViewItem">
            <Setter Property="Height" Value="60" />
            <Setter Property="Padding" Value="0" />
            <Setter Property="HorizontalContentAlignment" Value="Stretch" />
            <Setter Property="VerticalContentAlignment" Value="Stretch" />
            <Setter Property="BorderThickness" Value="0" />
        </Style>
    </Page.Resources>

    <StackPanel>
        <controls:ControlExample
            HorizontalContentAlignment="Stretch"
            SampleDefinition="StandardUICommand\StandardUICommandExposingCommandMultipleControls.txt"
            Loaded="ControlExample_Loaded">
            <Grid x:Name="rootGrid">
                <Grid.RowDefinitions>
                    <RowDefinition Height="Auto" />
                    <RowDefinition Height="Auto" />
                    <RowDefinition Height="*" />
                </Grid.RowDefinitions>

                <TextBlock Margin="0,0,0,12" TextWrapping="Wrap">
                    StandardUICommand allows the sharing of the UX associated with a command.
                    In this instance we are using a StandardUICommand to quickly place
                    the delete command in multiple controls. The StandardUICommand contains the icon, label,
                    keyboard shortcut, and a description.
                </TextBlock>

                <MenuBar Grid.Row="1">
                    <MenuBarItem Title="File">
                        <MenuFlyoutItem Text="New" />
                        <MenuFlyoutItem Text="Open..." />
                        <MenuFlyoutItem Text="Save" />
                        <MenuFlyoutItem Text="Exit" />
                    </MenuBarItem>

                    <MenuBarItem Title="Edit">
                        <MenuFlyoutItem x:Name="DeleteFlyoutItem" />
                    </MenuBarItem>

                    <MenuBarItem Title="Help">
                        <MenuFlyoutItem Text="About" />
                    </MenuBarItem>
                </MenuBar>

                <ListView
                    x:Name="ListViewRight"
                    Grid.Row="2"
                    Height="500"
                    ContainerContentChanging="ListViewRight_ContainerContentChanging"
                    IsItemClickEnabled="True"
                    ItemContainerStyle="{StaticResource HorizontalSwipe}"
                    Loaded="ListView_Loaded"
                    SelectionMode="Single">
                    <ListView.ItemTemplate>
                        <DataTemplate x:DataType="local:ListItemData">
                            <UserControl PointerEntered="ListViewSwipeContainer_PointerEntered" PointerExited="ListViewSwipeContainer_PointerExited">
                                <Grid AutomationProperties.Name="{x:Bind Text}">
                                    <SwipeControl x:Name="ListViewSwipeContainer">
                                        <SwipeControl.RightItems>
                                            <SwipeItems Mode="Execute">
                                                <SwipeItem
                                                    x:Name="DeleteSwipeItem"
                                                    Background="Red"
                                                    Command="{x:Bind Command}"
                                                    CommandParameter="{x:Bind Text}" />
                                            </SwipeItems>
                                        </SwipeControl.RightItems>
                                        <Grid VerticalAlignment="Center">
                                            <TextBlock
                                                Margin="10"
                                                HorizontalAlignment="Left"
                                                VerticalAlignment="Center"
                                                FontSize="18"
                                                Text="{x:Bind Text}" />
                                            <AppBarButton
                                                x:Name="HoverButton"
                                                HorizontalAlignment="Right"
                                                Command="{x:Bind Command}"
                                                CommandParameter="{x:Bind Text}"
                                                IsTabStop="False"
                                                Visibility="Collapsed" />
                                        </Grid>
                                    </SwipeControl>
                                    <VisualStateManager.VisualStateGroups>
                                        <VisualStateGroup x:Name="HoveringStates">
                                            <VisualState x:Name="HoverButtonsHidden" />
                                            <VisualState x:Name="HoverButtonsShown">
                                                <VisualState.Setters>
                                                    <Setter Target="HoverButton.Visibility" Value="Visible" />
                                                </VisualState.Setters>
                                            </VisualState>
                                        </VisualStateGroup>
                                    </VisualStateManager.VisualStateGroups>
                                </Grid>
                            </UserControl>
                        </DataTemplate>
                    </ListView.ItemTemplate>
                </ListView>
            </Grid>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (StandardUICommandPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Input;
using System.Collections.ObjectModel;
using Windows.Foundation.Metadata;
using ICommand = System.Windows.Input.ICommand;

namespace WinUIGallery.ControlPages;

public class ListItemData
{
    public string Text { get; set; } = string.Empty;
    public ICommand? Command { get; set; }

    public override string ToString()
    {
        return Text;
    }
}

public sealed partial class StandardUICommandPage : Page
{
    ObservableCollection<ListItemData> collection = new ObservableCollection<ListItemData>();

    public StandardUICommandPage()
    {
        this.InitializeComponent();
    }

    private void DeleteCommand_ExecuteRequested(XamlUICommand sender, ExecuteRequestedEventArgs args)
    {
        if (args.Parameter != null)
        {
            foreach (var i in collection)
            {
                if (i.Text == (args.Parameter as string))
                {
                    collection.Remove(i);
                    return;
                }
            }
        }
        if (ListViewRight.SelectedIndex != -1)
        {
            collection.RemoveAt(ListViewRight.SelectedIndex);
        }
    }

    private void ListView_Loaded(object sender, RoutedEventArgs e)
    {
        var listView = (ListView)sender;
        listView.ItemsSource = collection;
    }

    private void ListViewSwipeContainer_PointerEntered(object sender, PointerRoutedEventArgs e)
    {
        if (e.Pointer.PointerDeviceType == Microsoft.UI.Input.PointerDeviceType.Mouse || e.Pointer.PointerDeviceType == Microsoft.UI.Input.PointerDeviceType.Pen)
        {
            VisualStateManager.GoToState(sender as Control, "HoverButtonsShown", true);
        }
    }

    private void ListViewSwipeContainer_PointerExited(object sender, PointerRoutedEventArgs e)
    {
        VisualStateManager.GoToState(sender as Control, "HoverButtonsHidden", true);
    }

    private void ControlExample_Loaded(object sender, RoutedEventArgs e)
    {
        if (ApiInformation.IsApiContractPresent("Windows.Foundation.UniversalApiContract", 7))
        {
            var deleteCommand = new StandardUICommand(StandardUICommandKind.Delete);
            deleteCommand.ExecuteRequested += DeleteCommand_ExecuteRequested;

            DeleteFlyoutItem.Command = deleteCommand;

            for (var i = 0; i < 15; i++)
            {
                collection.Add(new ListItemData { Text = "List item " + i.ToString(), Command = deleteCommand });
            }
        }
        else
        {
            for (var i = 0; i < 15; i++)
            {
                collection.Add(new ListItemData { Text = "List item " + i.ToString(), Command = null });
            }
        }
    }

    private void ListViewRight_ContainerContentChanging(ListViewBase sender, ContainerContentChangingEventArgs args)
    {
        MenuFlyout flyout = new MenuFlyout();
        ListItemData data = (ListItemData)args.Item;
        MenuFlyoutItem item = new MenuFlyoutItem() { Command = data.Command };
        flyout.Opened += delegate (object? element, object e)
        {
            if ((element as MenuFlyout)?.Target is not ListViewItem elementToHighlight)
            {
                return;
            }

            elementToHighlight.IsSelected = true;
        };
        flyout.Items.Add(item);
        args.ItemContainer.ContextFlyout = flyout;
    }
}

```

## 示例文件

### StandardUICommandExposingCommandMultipleControls.txt
```
--- header
Exposing a command in multiple controls using StandardUICommand
--- xaml
<SwipeItem x:Name="DeleteSwipeItem" Background="Red" Command="{x:Bind Command}" CommandParameter="{x:Bind Text}" />

<AppBarButton x:Name="HoverButton" IsTabStop="False" HorizontalAlignment="Right" Visibility="Collapsed" 
 Command="{x:Bind Command}" CommandParameter="{x:Bind Text}" />
--- c#
private void ControlExample_Loaded(object sender, RoutedEventArgs e)
{
    var deleteCommand = new StandardUICommand(StandardUICommandKind.Delete);
    deleteCommand.ExecuteRequested += DeleteCommand_ExecuteRequested;

    DeleteFlyoutItem.Command = deleteCommand;

    for (var i = 0; i < 15; i++)
    {
        collection.Add(new ListItemData { Text = "List item " + i.ToString(), Command = deleteCommand });
    }
}

private void ListViewRight_ContainerContentChanging(ListViewBase sender, ContainerContentChangingEventArgs args)
{
    MenuFlyout flyout = new MenuFlyout();
    ListItemData data = (ListItemData)args.Item;
    MenuFlyoutItem item = new MenuFlyoutItem() { Command = data.Command};
    flyout.Items.Add(item);
    args.ItemContainer.ContextFlyout = flyout;
}
```


# XamlUICommand

## 主页面 XAML (XamlUICommandPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.XamlUICommandPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <Page.Resources>
        <Style
            x:Key="HorizontalSwipe"
            BasedOn="{StaticResource ListViewItemRevealStyle}"
            TargetType="ListViewItem">
            <Setter Property="Height" Value="60" />
            <Setter Property="Padding" Value="0" />
            <Setter Property="HorizontalContentAlignment" Value="Stretch" />
            <Setter Property="VerticalContentAlignment" Value="Stretch" />
            <Setter Property="BorderThickness" Value="0" />
        </Style>
        <XamlUICommand
            x:Name="CustomXamlUICommand"
            Description="This is a custom command"
            ExecuteRequested="CustomXamlUICommand_ExecuteRequested"
            Label="Custom XamlUICommand">
            <XamlUICommand.IconSource>
                <SymbolIconSource Symbol="Favorite" />
            </XamlUICommand.IconSource>
            <XamlUICommand.KeyboardAccelerators>
                <KeyboardAccelerator Key="D" Modifiers="Control" />
            </XamlUICommand.KeyboardAccelerators>
        </XamlUICommand>
    </Page.Resources>

    <StackPanel>
        <controls:ControlExample
            HorizontalContentAlignment="Stretch"
            SampleDefinition="XamlUICommand\CreatingReusableCommandXamluicommand.txt">
            <Grid x:Name="rootGrid">
                <Grid.RowDefinitions>
                    <RowDefinition Height="Auto" />
                    <RowDefinition Height="Auto" />
                    <RowDefinition Height="*" />
                </Grid.RowDefinitions>

                <TextBlock Margin="0,0,0,12" TextWrapping="Wrap">
                    XamlUICommand allows the sharing of the UX associated with a command.
                    In this instance we create a simple Custom Command with a label, icon, shortcut, and description.
                    It's defined as a resource and could be used in many controls, like this AppBarButton.
                    The button (and other controls) automatically gets all these UI properties, without the need to define the properties again.
                </TextBlock>

                <RelativePanel Grid.Row="1">
                    <AppBarButton x:Name="CustomButton" Command="{StaticResource CustomXamlUICommand}" />
                    <TextBlock
                        x:Name="XamlUICommandOutput"
                        Margin="8,0,0,0"
                        FontFamily="Global User Interface"
                        RelativePanel.AlignVerticalCenterWith="CustomButton"
                        RelativePanel.RightOf="CustomButton" />
                </RelativePanel>

            </Grid>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (XamlUICommandPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Input;
using WinUIGallery.Helpers;

namespace WinUIGallery.ControlPages;

public sealed partial class XamlUICommandPage : Page
{
    public XamlUICommandPage()
    {
        this.InitializeComponent();
    }

    private void CustomXamlUICommand_ExecuteRequested(XamlUICommand sender, ExecuteRequestedEventArgs args)
    {
        XamlUICommandOutput.Text = "You fired the custom command";
        UIHelper.AnnounceActionForAccessibility(CustomButton, "Activated custom XAML UI Command", "CustomXamlUICommandNotificationActivityId");
    }
}

```

## 示例文件

### CreatingReusableCommandXamluicommand.txt
```
--- header
Creating a reusable command with XamlUICommand
--- xaml
<Page.Resources>
    <XamlUICommand x:Name="CustomXamlUICommand" ExecuteRequested="CustomXamlUICommand_ExecuteRequested" 
	Description="This is a custom command" Label="Custom Command">
        <XamlUICommand.IconSource>
            <SymbolIconSource Symbol="Favorite" />
        </XamlUICommand.IconSource>
        <XamlUICommand.KeyboardAccelerators>
            <KeyboardAccelerator Key="D" Modifiers="Control"/>
        </XamlUICommand.KeyboardAccelerators>
    </XamlUICommand>
</Page.Resources>

<RelativePanel Grid.Row="1">
    <AppBarButton x:Name="CustomButton" Command="{StaticResource CustomXamlUICommand}"/>
    <TextBlock x:Name="XamlUICommandOutput" Margin="8,0,0,0" FontFamily="Global User Interface" 
                RelativePanel.RightOf="CustomButton" RelativePanel.AlignVerticalCenterWith="CustomButton" />
</RelativePanel>
--- c#
private void CustomXamlUICommand_ExecuteRequested(XamlUICommand sender, ExecuteRequestedEventArgs args)
{
    XamlUICommandOutput.Text = "You fired the custom command";
}
```



# 分组: Navigation

---

# BreadcrumbBar

## 主页面 XAML (BreadcrumbBarPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.BreadcrumbBarPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:l="using:WinUIGallery.ControlPages"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="BreadcrumbBar\BreadcrumbbarControl.txt">
            <controls:ControlExample.Example>
                <BreadcrumbBar x:Name="BreadcrumbBar1" ItemsSource="{x:Bind FoldersString}"/>
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample x:Name="Example2" SampleDefinition="BreadcrumbBar\BreadcrumbbarControlCustomDatatemplate.txt">
            <controls:ControlExample.Example>
                <BreadcrumbBar x:Name="BreadcrumbBar2" ItemsSource="{x:Bind Folders, Mode=OneWay}">
                    <BreadcrumbBar.ItemTemplate>
                        <DataTemplate x:DataType="l:Folder">
                            <BreadcrumbBarItem>
                                <BreadcrumbBarItem.ContentTemplate>
                                    <DataTemplate x:DataType="l:Folder">
                                        <TextBlock Text="{x:Bind Name}" AutomationProperties.Name="{x:Bind Name}"/>
                                    </DataTemplate>
                                </BreadcrumbBarItem.ContentTemplate>
                            </BreadcrumbBarItem>
                        </DataTemplate>
                    </BreadcrumbBar.ItemTemplate>
                </BreadcrumbBar>
            </controls:ControlExample.Example>

            <controls:ControlExample.Options>
                <Button
                    x:Name="ResetSampleBtn"
                    Click="ResetSampleButton_Click"
                    Content="Reset sample" />
            </controls:ControlExample.Options>

        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (BreadcrumbBarPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using WinUIGallery.Helpers;

namespace WinUIGallery.ControlPages;

public sealed partial class BreadcrumbBarPage : Page
{
    // We use a separate _defaultFolders list to preserve the original folder structure,
    // because BreadcrumbBar2.ItemsSource is bound directly to the Folders collection.
    // When a breadcrumb item is clicked, items are removed directly from Folders,
    // which means we lose access to the full original list.
    private readonly List<Folder> _defaultFolders = new()
    {
        new Folder { Name = "Home" },
        new Folder { Name = "Folder1" },
        new Folder { Name = "Folder2" },
        new Folder { Name = "Folder3" },
    };

    public ObservableCollection<Folder> Folders { get; } = new();

    public readonly string[] FoldersString = new string[] { "Home", "Documents", "Design", "Northwind", "Images", "Folder1", "Folder2", "Folder3" };
    public BreadcrumbBarPage()
    {
        this.InitializeComponent();

        BreadcrumbBar2.ItemClicked += BreadcrumbBar2_ItemClicked;
        Folders.Clear();
        foreach (var folder in _defaultFolders)
            Folders.Add(folder);
    }

    private void BreadcrumbBar2_ItemClicked(BreadcrumbBar sender, BreadcrumbBarItemClickedEventArgs args)
    {
        if (BreadcrumbBar2.ItemsSource is not ObservableCollection<Folder> items)
        {
            return;
        }

        for (int i = items.Count - 1; i >= args.Index + 1; i--)
        {
            items.RemoveAt(i);
        }
    }

    private void ResetSampleButton_Click(object sender, Microsoft.UI.Xaml.RoutedEventArgs e)
    {
        // To restore the BreadcrumbBar to its initial state, we compare Folders (the live collection)
        // with _defaultFolders (the original state), and add back any missing items.
        // This ensures reset works even after user navigation modifies the ItemsSource.
        if (BreadcrumbBar2.ItemsSource is not ObservableCollection<Folder> items)
        {
            return;
        }

        foreach (var folder in _defaultFolders)
        {
            if (!items.Contains(folder))
            {
                items.Add(folder);
            }
        }


        // Announce reset success notifiication.
        UIHelper.AnnounceActionForAccessibility(ResetSampleBtn, "BreadcrumbBar sample reset successful.", "BreadCrumbBarSampleResetNotificationId");
    }
}

public class Folder
{
    public string Name { get; set; } = string.Empty;
}

```

## 示例文件

### BreadcrumbbarControl.txt
```
--- header
A BreadcrumbBar control
--- xaml
<BreadcrumbBar x:Name="BreadcrumbBar1"/>
--- c#
BreadcrumbBar1.ItemsSource = new string[] { "Home", "Documents", "Design", "Northwind", "Images", "Folder1", "Folder2", "Folder3" };
```

### BreadcrumbbarControlCustomDatatemplate.txt
```
--- header
BreadCrumbBar Control with Custom DataTemplate
--- xaml
<BreadcrumbBar x:Name="BreadcrumbBar2">
    <BreadcrumbBar.ItemTemplate>
        <DataTemplate x:DataType="l:Folder">
            <BreadcrumbBarItem Content="{Binding}" AutomationProperties.Name="{Binding Name}">
                <BreadcrumbBarItem.ContentTemplate>
                    <DataTemplate>
                        <TextBlock Text="{Binding Name}" />
                    </DataTemplate>
                </BreadcrumbBarItem.ContentTemplate>
            </BreadcrumbBarItem>
        </DataTemplate>
    </BreadcrumbBar.ItemTemplate>
</BreadcrumbBar>
--- c#
public class Folder
{
    public string Name { get; set; }
}

BreadcrumbBar2.ItemsSource = new ObservableCollection<Folder>{
        new Folder { Name = "Home"},
        new Folder { Name = "Folder1" },
        new Folder { Name = "Folder2" },
        new Folder { Name = "Folder3" },
};
BreadcrumbBar2.ItemClicked += BreadcrumbBar2_ItemClicked;

private void BreadcrumbBar2_ItemClicked(BreadcrumbBar sender, BreadcrumbBarItemClickedEventArgs args)
{
    var items = BreadcrumbBar2.ItemsSource as ObservableCollection<Folder>;
    for (int i = items.Count - 1; i >= args.Index + 1; i--)
    {
        items.RemoveAt(i);
    }
}
```


# NavigationView

## 主页面 XAML (NavigationViewPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.NavigationViewPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:converters="using:WinUIGallery.Converters"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:models="using:WinUIGallery.Models"
    mc:Ignorable="d">

    <Page.Resources>
        <converters:MenuItemTemplateSelector x:Key="selector">
            <converters:MenuItemTemplateSelector.ItemTemplate>
                <DataTemplate x:DataType="models:Category">
                    <NavigationViewItem Content="{x:Bind Name}" ToolTipService.ToolTip="{x:Bind Tooltip}">
                        <NavigationViewItem.Icon>
                            <SymbolIcon Symbol="{x:Bind Glyph}" />
                        </NavigationViewItem.Icon>
                    </NavigationViewItem>
                </DataTemplate>
            </converters:MenuItemTemplateSelector.ItemTemplate>
        </converters:MenuItemTemplateSelector>
    </Page.Resources>

    <StackPanel>
        <!--  Example on how to override NavView acrylic  -->
        <StackPanel.Resources>
            <ResourceDictionary>
                <ResourceDictionary.ThemeDictionaries>
                    <ResourceDictionary x:Key="Light">
                        <SolidColorBrush x:Key="myBrush" Color="{StaticResource SystemBaseHighColor}" />
                        <AcrylicBrush
                            x:Key="NavigationViewExpandedPaneBackground"
                            FallbackColor="#F2F2F2"
                            TintColor="White"
                            TintOpacity="0.8" />
                    </ResourceDictionary>
                    <ResourceDictionary x:Key="Dark">
                        <SolidColorBrush x:Key="myBrush" Color="{StaticResource SystemBaseHighColor}" />
                        <AcrylicBrush
                            x:Key="NavigationViewExpandedPaneBackground"
                            FallbackColor="#1F1F1F"
                            TintColor="#1F1F1F"
                            TintOpacity="0.8" />
                    </ResourceDictionary>
                    <ResourceDictionary x:Key="HighContrast">
                        <SolidColorBrush x:Key="myBrush" Color="{ThemeResource SystemColorButtonFaceColor}" />
                    </ResourceDictionary>
                </ResourceDictionary.ThemeDictionaries>
            </ResourceDictionary>
        </StackPanel.Resources>

        <controls:ControlExample
            VerticalAlignment="Top"
            HorizontalContentAlignment="Stretch"
            SampleDefinition="NavigationView\NavigationviewDefaultPanedisplaymode.txt"
            WebViewHeight="250">
            <Grid>
                <Grid.RowDefinitions>
                    <RowDefinition Height="Auto" />
                    <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>

                <TextBlock
                    Margin="0,0,0,12"
                    Text="If you have five or more equally important navigation categories that should prominently appear on larger window widths, consider using a left navigation pane."
                    TextWrapping="WrapWholeWords" />

                <NavigationView
                    x:Name="nvSample5"
                    Grid.Row="1"
                    Height="460"
                    Header="This is Header Text"
                    IsTabStop="False"
                    PaneDisplayMode="Auto"
                    SelectionChanged="NavigationView_SelectionChanged5">
                    <NavigationView.MenuItems>
                        <NavigationViewItem
                            Content="Menu Item1"
                            Icon="Play"
                            Tag="SamplePage1" />
                        <NavigationViewItem
                            Content="Menu Item2"
                            Icon="Save"
                            Tag="SamplePage2" />
                        <NavigationViewItem
                            Content="Menu Item3"
                            Icon="Refresh"
                            Tag="SamplePage3" />
                        <NavigationViewItem
                            Content="Menu Item4"
                            Icon="Download"
                            Tag="SamplePage4" />
                    </NavigationView.MenuItems>
                    <Frame x:Name="contentFrame5" Margin="0,0,0,0" />
                </NavigationView>
            </Grid>
        </controls:ControlExample>

        <controls:ControlExample
            VerticalAlignment="Top"
            HorizontalContentAlignment="Stretch"
            SampleDefinition="NavigationView\NavigationviewPanedisplaymodeTop.txt"
            WebViewHeight="200">
            <Grid>
                <Grid.RowDefinitions>
                    <RowDefinition Height="Auto" />
                    <RowDefinition />
                </Grid.RowDefinitions>

                <TextBlock
                    Margin="0,0,0,12"
                    Text="If you have equally important navigation categories that should be de-emphasized relative to the content of your app, consider using a top navigation pane."
                    TextWrapping="WrapWholeWords" />

                <NavigationView
                    x:Name="nvSample6"
                    Grid.Row="1"
                    Height="460"
                    Header="This is Header Text"
                    IsTabStop="False"
                    PaneDisplayMode="Top"
                    SelectionChanged="NavigationView_SelectionChanged6">
                    <NavigationView.MenuItems>
                        <NavigationViewItem Content="Menu Item1" Tag="SamplePage1" />
                        <NavigationViewItem Content="Menu Item2" Tag="SamplePage2" />
                        <NavigationViewItem Content="Menu Item3" Tag="SamplePage3" />
                        <NavigationViewItem Content="Menu Item4" Tag="SamplePage3" />
                    </NavigationView.MenuItems>

                    <Frame x:Name="contentFrame6" />
                </NavigationView>
            </Grid>
        </controls:ControlExample>

        <controls:ControlExample
            VerticalAlignment="Top"
            HorizontalContentAlignment="Stretch"
            SampleDefinition="NavigationView\NavigationviewSwitchesPaneOrientation.txt"
            WebViewHeight="450">
            <Grid x:Name="InnerGrid">
                <Grid.RowDefinitions>
                    <RowDefinition Height="Auto" />
                    <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>

                <TextBlock
                    Margin="0,0,0,12"
                    Text="If you have equally important navigation categories and limited app content space, consider using a top navigation pane on larger window widths and a minimal left navigation pane on smaller window widths."
                    TextWrapping="WrapWholeWords" />

                <NavigationView
                    x:Name="nvSample2"
                    Grid.Row="1"
                    Height="460"
                    IsTabStop="False"
                    PaneDisplayMode="Auto"
                    SelectionChanged="NavigationView_SelectionChanged2">
                    <NavigationView.MenuItems>
                        <NavigationViewItem Content="Menu Item1" Tag="SamplePage1" />
                        <NavigationViewItem Content="Menu Item2" Tag="SamplePage2" />
                        <NavigationViewItem Content="Menu Item3" Tag="SamplePage3" />
                        <NavigationViewItem Content="Menu Item4" Tag="SamplePage4" />
                    </NavigationView.MenuItems>

                    <NavigationView.Content>
                        <Frame x:Name="contentFrame2" />
                    </NavigationView.Content>
                </NavigationView>
            </Grid>
        </controls:ControlExample>

        <controls:ControlExample
            VerticalAlignment="Top"
            HorizontalContentAlignment="Stretch"
            SampleDefinition="NavigationView\NavigationViewTyingSelectionFocusTabs.txt"
            WebViewHeight="800">
            <Grid>
                <Grid.RowDefinitions>
                    <RowDefinition Height="Auto" />
                    <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>

                <TextBlock
                    Margin="0,0,0,12"
                    Text="For the tabs pattern, ensure that you unify selection and focus by setting the SelectionFollowsFocus property to Enabled. If using a Frame to swap out content, then navigating between items shouldn't be recorded into the Frame's navigation stack. Please see the C# in the sample below to understand how to do this."
                    TextWrapping="WrapWholeWords" />

                <NavigationView
                    x:Name="nvSample7"
                    Grid.Row="1"
                    Height="460"
                    IsBackButtonVisible="Collapsed"
                    IsTabStop="False"
                    PaneDisplayMode="Top"
                    SelectionChanged="NavigationView_SelectionChanged7"
                    SelectionFollowsFocus="Enabled">
                    <NavigationView.MenuItems>
                        <NavigationViewItem Content="Item1" Tag="SamplePage1" />
                        <NavigationViewItem Content="Item2" Tag="SamplePage2" />
                        <NavigationViewItem Content="Item3" Tag="SamplePage3" />
                        <NavigationViewItem Content="Item4" Tag="SamplePage4" />
                    </NavigationView.MenuItems>
                    <Frame x:Name="contentFrame7" />
                </NavigationView>
            </Grid>
        </controls:ControlExample>

        <controls:ControlExample
            VerticalAlignment="Top"
            HorizontalContentAlignment="Stretch"
            SampleDefinition="NavigationView\NavigationViewDataBinding.txt"
            WebViewHeight="950">
            <Grid>
                <Grid.RowDefinitions>
                    <RowDefinition />
                    <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>

                <TextBlock
                    Margin="0,0,0,12"
                    Text="When data binding, use the MenuItemsSource property to bind to an observable collection of items, and do not set the MenuItems property. In addition, set the MenuItemTemplate property and use a NavigationViewItem as the data template. If you wish to bind to the header content as well, use data template selectors via the MenuItemTemplateSelector property. "
                    TextWrapping="WrapWholeWords" />

                <NavigationView
                    x:Name="nvSample4"
                    Grid.Row="2"
                    Height="460"
                    IsTabStop="False"
                    MenuItemTemplateSelector="{StaticResource selector}"
                    MenuItemsSource="{x:Bind Categories, Mode=OneWay}"
                    SelectionChanged="NavigationView_SelectionChanged4">
                    <StackPanel>
                        <Frame x:Name="contentFrame4" Margin="0,0,0,0" />
                    </StackPanel>
                </NavigationView>
            </Grid>
        </controls:ControlExample>

        <controls:ControlExample
            VerticalAlignment="Top"
            HorizontalContentAlignment="Stretch"
            SampleDefinition="NavigationView\NavigationviewFooterMenuItems.txt">
            <controls:ControlExample.Options>
                <StackPanel>
                    <RadioButtons Header="Pane position:" SelectedIndex="0">
                        <RadioButton
                            x:Name="nvSample9Left"
                            Checked="panePositionLeft_Checked"
                            Content="Left mode" />
                        <RadioButton
                            x:Name="nvSample9Top"
                            Checked="panePositionTop_Checked"
                            Content="Top mode" />
                    </RadioButtons>
                </StackPanel>
            </controls:ControlExample.Options>
            <Grid>
                <Grid.RowDefinitions>
                    <RowDefinition />
                    <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>

                <TextBlock
                    Margin="0,0,0,12"
                    Text="You can add clickable menu items to the footer of your NavigationView that participate in the same selection model as items in the main menu. In Top PaneDisplayMode, these items will appear aligned to the right of the NavigationView. In Left PaneDisplayMode, these items will appear aligned to the bottom of the NavigationView. "
                    TextWrapping="WrapWholeWords" />

                <NavigationView
                    x:Name="nvSample9"
                    Grid.Row="1"
                    Height="460"
                    Header="This is Header Text"
                    IsSettingsVisible="False"
                    IsTabStop="False"
                    PaneDisplayMode="Left"
                    SelectionChanged="NavigationView_SelectionChanged9">
                    <NavigationView.MenuItems>
                        <NavigationViewItem
                            Content="Browse"
                            Icon="Library"
                            Tag="SamplePage1" />
                        <NavigationViewItem
                            Content="Track an Order"
                            Icon="Map"
                            Tag="SamplePage2" />
                        <NavigationViewItem
                            Content="Order History"
                            Icon="Tag"
                            Tag="SamplePage3" />
                    </NavigationView.MenuItems>
                    <NavigationView.FooterMenuItems>
                        <NavigationViewItem
                            Content="Account"
                            Icon="Contact"
                            Tag="SamplePage4" />
                        <NavigationViewItem
                            Content="Your Cart"
                            Icon="Shop"
                            Tag="SamplePage5" />
                        <NavigationViewItem
                            Content="Help"
                            Icon="Help"
                            Tag="SamplePage5" />
                    </NavigationView.FooterMenuItems>
                    <Frame x:Name="contentFrame9" Margin="0,0,0,0" />
                </NavigationView>
            </Grid>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="PaneDisplay" Value="{x:Bind nvSample9.PaneDisplayMode, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample
            VerticalAlignment="Top"
            HorizontalContentAlignment="Stretch"
            SampleDefinition="NavigationView\HierarchicalNavigationview.txt">
            <controls:ControlExample.Options>
                <StackPanel>
                    <TextBlock Margin="0,12,0,0" Text="PanePosition:" />
                    <RadioButton
                        x:Name="nvSample8Left"
                        Checked="panePositionLeft_Checked"
                        Content="Left mode"
                        GroupName="hierachicalGroup"
                        IsChecked="True" />
                    <RadioButton
                        x:Name="nvSample8Top"
                        Checked="panePositionTop_Checked"
                        Content="Top mode"
                        GroupName="hierachicalGroup" />
                    <RadioButton
                        x:Name="nvSample8LeftCompact"
                        Checked="panePositionLeftCompact_Checked"
                        Content="LeftCompact mode"
                        GroupName="hierachicalGroup" />
                </StackPanel>
            </controls:ControlExample.Options>
            <Grid>
                <Grid.RowDefinitions>
                    <RowDefinition Height="Auto" />
                    <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>

                <TextBlock
                    Grid.Row="0"
                    Margin="0,0,0,12"
                    TextWrapping="WrapWholeWords" />
                <RichTextBlock Margin="0,0,0,15" TextWrapping="Wrap">
                    <Paragraph>
                        NavigationView supports hierarchy in Left, LeftCompact, and Top display modes.<LineBreak />
                    </Paragraph>
                    <Paragraph>
                        In the example below, the "Account" tab navigates to its own page while "Document options" only opens up its subtree of items. This is done by setting the SelectsOnInvoked property to false on the Document options NavigationView Item.<LineBreak />
                    </Paragraph>
                    <Paragraph>
                        In both Top and Left modes, clicking the arrows on NavigationViewItems will expand or collapse the subtree. Clicking or tapping elsewhere on the NavigationViewItem will collapse or expand the subtree.<LineBreak />
                    </Paragraph>
                    <Paragraph>
                        Switch between the three pane display modes on the right.
                    </Paragraph>
                </RichTextBlock>
                <NavigationView
                    x:Name="nvSample8"
                    Grid.Row="1"
                    Height="460"
                    IsTabStop="False"
                    PaneDisplayMode="Left"
                    SelectionChanged="NavigationView_SelectionChanged8">
                    <NavigationView.MenuItems>
                        <NavigationViewItem
                            Content="Home"
                            Icon="Home"
                            Tag="SamplePage1"
                            ToolTipService.ToolTip="Home" />
                        <NavigationViewItem
                            Content="Account"
                            Icon="Contact"
                            Tag="SamplePage2"
                            ToolTipService.ToolTip="Account">
                            <NavigationViewItem.MenuItems>
                                <NavigationViewItem
                                    Content="Mail"
                                    Icon="Mail"
                                    Tag="SamplePage3"
                                    ToolTipService.ToolTip="Mail" />
                                <NavigationViewItem
                                    Content="Calendar"
                                    Icon="Calendar"
                                    Tag="SamplePage4"
                                    ToolTipService.ToolTip="Calendar" />
                            </NavigationViewItem.MenuItems>
                        </NavigationViewItem>
                        <NavigationViewItem
                            Content="Document options"
                            Icon="Page2"
                            SelectsOnInvoked="False"
                            ToolTipService.ToolTip="Document options">
                            <NavigationViewItem.MenuItems>
                                <NavigationViewItem
                                    Content="Create new"
                                    Icon="NewFolder"
                                    Tag="SamplePage5"
                                    ToolTipService.ToolTip="Create new" />
                                <NavigationViewItem
                                    Content="Upload file"
                                    Icon="OpenLocal"
                                    Tag="SamplePage6"
                                    ToolTipService.ToolTip="Upload file" />
                            </NavigationViewItem.MenuItems>
                        </NavigationViewItem>
                    </NavigationView.MenuItems>
                    <Frame x:Name="contentFrame8" />
                </NavigationView>
            </Grid>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="PaneDisplay" Value="{x:Bind nvSample8.PaneDisplayMode, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample
            VerticalAlignment="Top"
            HorizontalContentAlignment="Stretch"
            SampleDefinition="NavigationView\NavigationViewApiAction.txt"
            WebViewHeight="250">
            <controls:ControlExample.Options>
                <StackPanel>
                    <CheckBox
                        x:Name="settingsCheck"
                        Click="settingsCheck_Click"
                        Content="Settings item visible"
                        IsChecked="True" />
                    <CheckBox
                        x:Name="visibleCheck"
                        Click="visibleCheck_Click"
                        Content="Back button visible"
                        IsChecked="True" />
                    <CheckBox
                        x:Name="enableCheck"
                        Click="enableCheck_Click"
                        Content="Back button enabled"
                        IsChecked="False" />
                    <CheckBox
                        x:Name="autoSuggestCheck"
                        Click="autoSuggestCheck_Click"
                        Content="AutoSuggestBox visible"
                        IsChecked="True" />

                    <TextBlock Margin="0,12,0,0" Text="Header:" />
                    <TextBox
                        x:Name="headerText"
                        AutomationProperties.Name="Header property"
                        Text="Header" />
                    <CheckBox
                        x:Name="headerCheck"
                        Click="headerCheck_Click"
                        Content="Always show header"
                        IsChecked="True" />
                    <TextBlock Margin="0,12,0,0" Text="PaneTitle:" />
                    <TextBox
                        x:Name="paneText"
                        AutomationProperties.Name="PaneTitle property"
                        Text="Pane Title" />
                    <CheckBox
                        x:Name="panemc_Check"
                        Click="panemc_Check_Click"
                        Content="PaneCustomContent visible"
                        IsChecked="False" />
                    <CheckBox
                        x:Name="paneFooterCheck"
                        Click="paneFooterCheck_Click"
                        Content="PaneFooter visible"
                        IsChecked="False" />

                    <TextBlock Margin="0,12,0,0" Text="PanePosition:" />
                    <RadioButton
                        x:Name="nvSampleLeft"
                        Checked="panePositionLeft_Checked"
                        Content="Left"
                        IsChecked="True" />
                    <RadioButton
                        x:Name="nvSampleTop"
                        Margin="0,0,0,12"
                        Checked="panePositionTop_Checked"
                        Content="Top" />

                    <CheckBox
                        x:Name="sffCheck"
                        Click="sffCheck_Click"
                        Content="Keyboard SelectionFollowsFocus"
                        IsChecked="False" />
                    <CheckBox
                        x:Name="suppressselectionCheck_Checked"
                        Click="suppressselectionCheck_Checked_Click"
                        Content="Selection of Menu Item2 suppressed"
                        IsChecked="False" />

                </StackPanel>

            </controls:ControlExample.Options>
            <NavigationView
                x:Name="nvSample"
                Height="540"
                Margin="0,12,0,0"
                ExpandedModeThresholdWidth="500"
                Header="{Binding ElementName=headerText, Path=Text, Mode=TwoWay}"
                IsTabStop="False"
                PaneDisplayMode="Left"
                PaneTitle="{Binding ElementName=paneText, Path=Text, Mode=TwoWay}"
                SelectionChanged="NavigationView_SelectionChanged">
                <NavigationView.MenuItems>
                    <NavigationViewItem
                        x:Name="SamplePage1Item"
                        Content="Menu Item1"
                        Tag="SamplePage1">
                        <NavigationViewItem.Icon>
                            <SymbolIcon Symbol="Play" />
                        </NavigationViewItem.Icon>
                    </NavigationViewItem>
                    <NavigationViewItemHeader Content="Actions" />
                    <NavigationViewItem
                        x:Name="SamplePage2Item"
                        Content="Menu Item2"
                        SelectsOnInvoked="True"
                        Tag="SamplePage2">
                        <NavigationViewItem.Icon>
                            <SymbolIcon Symbol="Save" />
                        </NavigationViewItem.Icon>
                    </NavigationViewItem>
                    <NavigationViewItem
                        x:Name="SamplePage3Item"
                        Content="Menu Item3"
                        Tag="SamplePage3">
                        <NavigationViewItem.Icon>
                            <SymbolIcon Symbol="Refresh" />
                        </NavigationViewItem.Icon>
                    </NavigationViewItem>
                </NavigationView.MenuItems>

                <NavigationView.PaneCustomContent>
                    <HyperlinkButton
                        x:Name="PaneHyperlink"
                        Margin="12,0"
                        Content="More info"
                        Visibility="Collapsed" />
                </NavigationView.PaneCustomContent>

                <NavigationView.AutoSuggestBox>
                    <AutoSuggestBox AutomationProperties.Name="Search" QueryIcon="Find" />
                </NavigationView.AutoSuggestBox>

                <NavigationView.PaneFooter>
                    <StackPanel
                        x:Name="FooterStackPanel"
                        Orientation="Vertical"
                        Visibility="Collapsed">
                        <NavigationViewItem AutomationProperties.Name="download" Icon="Download" />
                        <NavigationViewItem AutomationProperties.Name="favorite" Icon="Favorite" />
                    </StackPanel>
                </NavigationView.PaneFooter>

                <Frame x:Name="contentFrame" />
            </NavigationView>

            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="SettingsVis" Value="{x:Bind settingsCheck.IsChecked, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="BackButtonVis" Value="{x:Bind nvSample.IsBackButtonVisible, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="BackButtonEn" Value="{x:Bind enableCheck.IsChecked, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="HeaderText" Value="{x:Bind headerText.Text, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="ShowHeader" Value="{x:Bind headerCheck.IsChecked, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="PaneTitleText" Value="{x:Bind paneText.Text, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="PaneCustomContentVis" Value="{x:Bind PaneHyperlink.Visibility, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="PaneFooterVis" Value="{x:Bind FooterStackPanel.Visibility, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="PaneDisplayMode" Value="{x:Bind nvSample.PaneDisplayMode, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="SelectionFollowsFocus" Value="{x:Bind nvSample.SelectionFollowsFocus, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="SelectsOnInvoked" Value="{x:Bind SamplePage2Item.SelectsOnInvoked, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="NavViewASB" x:Name="navViewASB" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
        <!--  For the top nav collapsing to left hamburger sample  -->
        <VisualStateManager.VisualStateGroups>
            <VisualStateGroup>
                <VisualState>
                    <VisualState.StateTriggers>
                        <AdaptiveTrigger MinWindowWidth="{x:Bind nvSample2.CompactModeThresholdWidth}" />
                    </VisualState.StateTriggers>

                    <VisualState.Setters>
                        <Setter Target="nvSample2.PaneDisplayMode" Value="Top" />
                    </VisualState.Setters>
                </VisualState>
            </VisualStateGroup>
        </VisualStateManager.VisualStateGroups>
    </StackPanel>
</Page>

```

## 主页面 C# (NavigationViewPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Automation;
using Microsoft.UI.Xaml.Controls;
using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using Windows.System;
using WinUIGallery.Helpers;
using WinUIGallery.Models;
using WinUIGallery.SamplePages;

namespace WinUIGallery.ControlPages;

public sealed partial class NavigationViewPage : Page
{
    public static bool CameFromToggle = false;

    public static bool CameFromGridChange = false;

    public VirtualKey ArrowKey;

    public ObservableCollection<CategoryBase> Categories { get; set; }

    public NavigationViewPage()
    {
        this.InitializeComponent();

        nvSample2.SelectedItem = nvSample2.MenuItems.OfType<Microsoft.UI.Xaml.Controls.NavigationViewItem>().First();
        nvSample5.SelectedItem = nvSample5.MenuItems.OfType<Microsoft.UI.Xaml.Controls.NavigationViewItem>().First();
        nvSample6.SelectedItem = nvSample6.MenuItems.OfType<Microsoft.UI.Xaml.Controls.NavigationViewItem>().First();
        nvSample7.SelectedItem = nvSample7.MenuItems.OfType<Microsoft.UI.Xaml.Controls.NavigationViewItem>().First();
        nvSample8.SelectedItem = nvSample8.MenuItems.OfType<Microsoft.UI.Xaml.Controls.NavigationViewItem>().First();
        nvSample9.SelectedItem = nvSample9.MenuItems.OfType<Microsoft.UI.Xaml.Controls.NavigationViewItem>().First();

        Categories = new ObservableCollection<CategoryBase>();
        Category firstCategory = new Category { Name = "Category 1", Glyph = Symbol.Home, Tooltip = "This is category 1" };
        Categories.Add(firstCategory);
        Categories.Add(new Category { Name = "Category 2", Glyph = Symbol.Keyboard, Tooltip = "This is category 2" });
        Categories.Add(new Category { Name = "Category 3", Glyph = Symbol.Library, Tooltip = "This is category 3" });
        Categories.Add(new Category { Name = "Category 4", Glyph = Symbol.Mail, Tooltip = "This is category 4" });
        nvSample4.SelectedItem = firstCategory;

        setASBSubstitutionString();

        // Fixes #218
        nvSample2.UpdateLayout();
    }

    public Microsoft.UI.Xaml.Controls.NavigationViewPaneDisplayMode ChoosePanePosition(bool toggleOn)
    {
        if (toggleOn)
        {
            return Microsoft.UI.Xaml.Controls.NavigationViewPaneDisplayMode.Left;
        }
        else
        {
            return Microsoft.UI.Xaml.Controls.NavigationViewPaneDisplayMode.Top;
        }
    }

    private void NavigationView_SelectionChanged(Microsoft.UI.Xaml.Controls.NavigationView sender, Microsoft.UI.Xaml.Controls.NavigationViewSelectionChangedEventArgs args)
    {
        if (args.IsSettingsSelected)
        {
            contentFrame.Navigate(typeof(SampleSettingsPage));
        }
        else
        {
            var selectedItem = (Microsoft.UI.Xaml.Controls.NavigationViewItem)args.SelectedItem;
            if (selectedItem != null)
            {
                string selectedItemTag = ((string)selectedItem.Tag);
                sender.Header = "Sample Page " + selectedItemTag.Substring(selectedItemTag.Length - 1);
                string pageName = "WinUIGallery.SamplePages." + selectedItemTag;
                SamplesNavigationPageMappings.PageDictionary.TryGetValue(pageName, out Type? pageType);
                contentFrame.Navigate(pageType);
            }
        }
    }

    private void NavigationView_SelectionChanged2(Microsoft.UI.Xaml.Controls.NavigationView sender, Microsoft.UI.Xaml.Controls.NavigationViewSelectionChangedEventArgs args)
    {
        if (!CameFromGridChange)
        {
            if (args.IsSettingsSelected)
            {
                contentFrame2.Navigate(typeof(SampleSettingsPage));
            }
            else
            {
                var selectedItem = (Microsoft.UI.Xaml.Controls.NavigationViewItem)args.SelectedItem;
                string selectedItemTag = ((string)selectedItem.Tag);
                string pageName = "WinUIGallery.SamplePages." + selectedItemTag;
                SamplesNavigationPageMappings.PageDictionary.TryGetValue(pageName, out Type? pageType);
                contentFrame2.Navigate(pageType);
            }
        }

        CameFromGridChange = false;
    }

    private void NavigationView_SelectionChanged4(Microsoft.UI.Xaml.Controls.NavigationView sender, Microsoft.UI.Xaml.Controls.NavigationViewSelectionChangedEventArgs args)
    {
        if (args.IsSettingsSelected)
        {
            contentFrame4.Navigate(typeof(SampleSettingsPage));
        }
        else
        {
            Debug.WriteLine("Before hitting sample page 1");

            var selectedItem = (Category)args.SelectedItem;
            string selectedItemTag = selectedItem.Name;
            sender.Header = "Sample Page " + selectedItemTag.Substring(selectedItemTag.Length - 1);
            string pageName = "WinUIGallery.SamplePages." + "SamplePage1";
            SamplesNavigationPageMappings.PageDictionary.TryGetValue(pageName, out Type? pageType);
            contentFrame4.Navigate(pageType);
        }
    }


    private void NavigationView_SelectionChanged5(Microsoft.UI.Xaml.Controls.NavigationView sender, Microsoft.UI.Xaml.Controls.NavigationViewSelectionChangedEventArgs args)
    {
        if (args.IsSettingsSelected)
        {
            contentFrame5.Navigate(typeof(SampleSettingsPage));
        }
        else
        {
            var selectedItem = (Microsoft.UI.Xaml.Controls.NavigationViewItem)args.SelectedItem;
            string selectedItemTag = ((string)selectedItem.Tag);
            sender.Header = "Sample Page " + selectedItemTag.Substring(selectedItemTag.Length - 1);
            string pageName = "WinUIGallery.SamplePages." + selectedItemTag;
            SamplesNavigationPageMappings.PageDictionary.TryGetValue(pageName, out Type? pageType);
            contentFrame5.Navigate(pageType);
        }
    }
    private void NavigationView_SelectionChanged6(Microsoft.UI.Xaml.Controls.NavigationView sender, Microsoft.UI.Xaml.Controls.NavigationViewSelectionChangedEventArgs args)
    {
        if (args.IsSettingsSelected)
        {
            contentFrame6.Navigate(typeof(SampleSettingsPage));
        }
        else
        {
            var selectedItem = (Microsoft.UI.Xaml.Controls.NavigationViewItem)args.SelectedItem;
            string pageName = "WinUIGallery.SamplePages." + ((string)selectedItem.Tag);
            SamplesNavigationPageMappings.PageDictionary.TryGetValue(pageName, out Type? pageType);
            contentFrame6.Navigate(pageType);
        }
    }

    private void NavigationView_SelectionChanged7(Microsoft.UI.Xaml.Controls.NavigationView sender, Microsoft.UI.Xaml.Controls.NavigationViewSelectionChangedEventArgs args)
    {
        if (args.IsSettingsSelected)
        {
            contentFrame7.Navigate(typeof(SampleSettingsPage));
        }
        else
        {
            var selectedItem = (Microsoft.UI.Xaml.Controls.NavigationViewItem)args.SelectedItem;
            string pageName = "WinUIGallery.SamplePages." + ((string)selectedItem.Tag);
            SamplesNavigationPageMappings.PageDictionary.TryGetValue(pageName, out Type? pageType);

            contentFrame7.Navigate(pageType, null, args.RecommendedNavigationTransitionInfo);
        }
    }

    private void NavigationView_SelectionChanged8(Microsoft.UI.Xaml.Controls.NavigationView sender, Microsoft.UI.Xaml.Controls.NavigationViewSelectionChangedEventArgs args)
    {
        /* NOTE: for this function to work, every NavigationView must follow the same naming convention: nvSample# (i.e. nvSample3),
        and every corresponding content frame must follow the same naming convention: contentFrame# (i.e. contentFrame3) */

        // Get the sample number
        string sampleNum = (sender.Name).Substring(8);
        Debug.Print("num: " + sampleNum + "\n");

        if (args.IsSettingsSelected)
        {
            contentFrame8.Navigate(typeof(SampleSettingsPage));
        }
        else
        {
            var selectedItem = (Microsoft.UI.Xaml.Controls.NavigationViewItem)args.SelectedItem;
            string selectedItemTag = ((string)selectedItem.Tag);
            sender.Header = "Sample Page " + selectedItemTag.Substring(selectedItemTag.Length - 1);
            string pageName = "WinUIGallery.SamplePages." + selectedItemTag;
            SamplesNavigationPageMappings.PageDictionary.TryGetValue(pageName, out Type? pageType);
            contentFrame8.Navigate(pageType);
        }
    }

    private void NavigationView_SelectionChanged9(Microsoft.UI.Xaml.Controls.NavigationView sender, Microsoft.UI.Xaml.Controls.NavigationViewSelectionChangedEventArgs args)
    {
        var selectedItem = (Microsoft.UI.Xaml.Controls.NavigationViewItem)args.SelectedItem;
        string pageName = "WinUIGallery.SamplePages." + ((string)selectedItem.Tag);
        SamplesNavigationPageMappings.PageDictionary.TryGetValue(pageName, out Type? pageType);

        contentFrame9.Navigate(pageType, null, args.RecommendedNavigationTransitionInfo);
    }

    private void headerCheck_Click(object sender, RoutedEventArgs e)
    {
        nvSample.AlwaysShowHeader = (sender as CheckBox)?.IsChecked == true ? true : false;
    }

    private void settingsCheck_Click(object sender, RoutedEventArgs e)
    {
        nvSample.IsSettingsVisible = (sender as CheckBox)?.IsChecked == true ? true : false;
    }

    private void visibleCheck_Click(object sender, RoutedEventArgs e)
    {
        if ((sender as CheckBox)?.IsChecked == true)
        {
            nvSample.IsBackButtonVisible = Microsoft.UI.Xaml.Controls.NavigationViewBackButtonVisible.Visible;
        }
        else
        {
            nvSample.IsBackButtonVisible = Microsoft.UI.Xaml.Controls.NavigationViewBackButtonVisible.Collapsed;
        }
    }

    private void enableCheck_Click(object sender, RoutedEventArgs e)
    {
        nvSample.IsBackEnabled = (sender as CheckBox)?.IsChecked == true ? true : false;
    }

    private void autoSuggestCheck_Click(object sender, RoutedEventArgs e)
    {
        if ((sender as CheckBox)?.IsChecked == true)
        {
            AutoSuggestBox asb = new AutoSuggestBox() { QueryIcon = new SymbolIcon(Symbol.Find) };
            asb.SetValue(AutomationProperties.NameProperty, "search");
            nvSample.AutoSuggestBox = asb;

            setASBSubstitutionString();
        }
        else
        {
            nvSample.AutoSuggestBox = null;
            navViewASB.Value = null;
        }
    }

    private void setASBSubstitutionString()
    {
        navViewASB.Value = "\r\n    <NavigationView.AutoSuggestBox> \r\n        <AutoSuggestBox QueryIcon=\"Find\" AutomationProperties.Name=\"Search\" /> \r\n    <" + "/" + "NavigationView.AutoSuggestBox> \r\n";
    }

    private void panemc_Check_Click(object sender, RoutedEventArgs e)
    {
        if ((sender as CheckBox)?.IsChecked == true)
        {
            PaneHyperlink.Visibility = Visibility.Visible;
        }
        else
        {
            PaneHyperlink.Visibility = Visibility.Collapsed;
        }
    }

    private void paneFooterCheck_Click(object sender, RoutedEventArgs e)
    {
        if ((sender as CheckBox)?.IsChecked == true)
        {
            FooterStackPanel.Visibility = Visibility.Visible;
        }
        else
        {
            FooterStackPanel.Visibility = Visibility.Collapsed;
        }
    }

    private void panePositionLeft_Checked(object sender, RoutedEventArgs e)
    {
        if ((sender as RadioButton)?.IsChecked == true)
        {
            if ((sender as RadioButton)?.Name == "nvSampleLeft" && nvSample != null)
            {
                nvSample.PaneDisplayMode = Microsoft.UI.Xaml.Controls.NavigationViewPaneDisplayMode.Left;
                nvSample.IsPaneOpen = true;
                FooterStackPanel.Orientation = Orientation.Vertical;
            }
            else if ((sender as RadioButton)?.Name == "nvSample8Left" && nvSample8 != null)
            {
                nvSample8.PaneDisplayMode = Microsoft.UI.Xaml.Controls.NavigationViewPaneDisplayMode.Left;
                nvSample8.IsPaneOpen = true;
            }
            else if ((sender as RadioButton)?.Name == "nvSample9Left" && nvSample9 != null)
            {
                nvSample9.PaneDisplayMode = Microsoft.UI.Xaml.Controls.NavigationViewPaneDisplayMode.Left;
                nvSample9.IsPaneOpen = true;
            }
        }
    }


    private void panePositionTop_Checked(object sender, RoutedEventArgs e)
    {
        if ((sender as RadioButton)?.IsChecked == true)
        {
            if ((sender as RadioButton)?.Name == "nvSampleTop" && nvSample != null)
            {
                nvSample.PaneDisplayMode = Microsoft.UI.Xaml.Controls.NavigationViewPaneDisplayMode.Top;
                nvSample.IsPaneOpen = false;
                FooterStackPanel.Orientation = Orientation.Horizontal;
            }
            else if ((sender as RadioButton)?.Name == "nvSample8Top" && nvSample8 != null)
            {
                nvSample8.PaneDisplayMode = Microsoft.UI.Xaml.Controls.NavigationViewPaneDisplayMode.Top;
                nvSample8.IsPaneOpen = false;
            }
            else if ((sender as RadioButton)?.Name == "nvSample9Top" && nvSample9 != null)
            {
                nvSample9.PaneDisplayMode = Microsoft.UI.Xaml.Controls.NavigationViewPaneDisplayMode.Top;
                nvSample9.IsPaneOpen = false;
            }
        }
    }

    private void panePositionLeftCompact_Checked(object sender, RoutedEventArgs e)
    {
        if ((sender as RadioButton)?.IsChecked == true)
        {
            if ((sender as RadioButton)?.Name == "nvSample8LeftCompact" && nvSample8 != null)
            {
                nvSample8.PaneDisplayMode = Microsoft.UI.Xaml.Controls.NavigationViewPaneDisplayMode.LeftCompact;
                nvSample8.IsPaneOpen = false;
            }
        }
    }

    private void sffCheck_Click(object sender, RoutedEventArgs e)
    {
        if ((sender as CheckBox)?.IsChecked == true)
        {
            nvSample.SelectionFollowsFocus = Microsoft.UI.Xaml.Controls.NavigationViewSelectionFollowsFocus.Enabled;
        }
        else
        {
            nvSample.SelectionFollowsFocus = Microsoft.UI.Xaml.Controls.NavigationViewSelectionFollowsFocus.Disabled;
        }
    }

    private void suppressselectionCheck_Checked_Click(object sender, RoutedEventArgs e)
    {
        SamplePage2Item.SelectsOnInvoked = (sender as CheckBox)?.IsChecked == true ? false : true;
    }
}

```

## 示例文件

### HierarchicalNavigationview.txt
```
--- header
Hierarchical NavigationView
--- xaml
<NavigationView x:Name="nvSample8" Grid.Row="1" Height="460"
                        PaneDisplayMode="$(PaneDisplay)" 
                        IsTabStop="False" 
                        SelectionChanged="NavigationView_SelectionChanged8">
    <NavigationView.MenuItems>
        <NavigationViewItem Content="Home" Icon="Home" ToolTipService.ToolTip="Home" Tag="SamplePage1"/>
        <NavigationViewItem Content="Account" Icon="Contact" ToolTipService.ToolTip="Account" Tag="SamplePage2">
            <NavigationViewItem.MenuItems>
                <NavigationViewItem Content="Mail" Icon="Mail" ToolTipService.ToolTip="Mail" Tag="SamplePage3"/>
                <NavigationViewItem Content="Calendar" Icon="Calendar" ToolTipService.ToolTip="Calendar" Tag="SamplePage4"/>
            </NavigationViewItem.MenuItems>
        </NavigationViewItem>
        <NavigationViewItem Content="Document options" Icon="Page2" ToolTipService.ToolTip="Document options" SelectsOnInvoked="False">
            <NavigationViewItem.MenuItems>
                <NavigationViewItem Content="Create new" Icon="NewFolder" ToolTipService.ToolTip="Create new" Tag="SamplePage5"/>
                <NavigationViewItem Content="Upload file" Icon="OpenLocal" ToolTipService.ToolTip="Upload file" Tag="SamplePage6"/>
            </NavigationViewItem.MenuItems>
        </NavigationViewItem>
    </NavigationView.MenuItems>
    <Frame x:Name="contentFrame8" />
</NavigationView>
```

### NavigationViewApiAction.txt
```
--- header
API in action
--- xaml
<NavigationView x:Name="nvSample"
    IsSettingsVisible="$(SettingsVis)"
    IsBackButtonVisible="$(BackButtonVis)"
    IsBackEnabled="$(BackButtonEn)"
    SelectionChanged="NavigationView_SelectionChanged"
    Header="$(HeaderText)"
    AlwaysShowHeader="$(ShowHeader)"
    PaneTitle="$(PaneTitleText)"
    PaneDisplayMode="$(PaneDisplayMode)" 
    ExpandedModeThresholdWidth="500"
    SelectionFollowsFocus="$(SelectionFollowsFocus)"
    IsTabStop="False">
                    
    <NavigationView.MenuItems>
        <NavigationViewItem Content="Menu Item1" Tag="SamplePage1" x:Name="SamplePage1Item">
            <NavigationViewItem.Icon>
                <SymbolIcon Symbol="Play" />
            </NavigationViewItem.Icon>
        </NavigationViewItem>
        <NavigationViewItemHeader Content="Actions"/>
        <NavigationViewItem Content="Menu Item2" Tag="SamplePage2" x:Name="SamplePage2Item" SelectsOnInvoked="$(SelectsOnInvoked)">
            <NavigationViewItem.Icon>
                <SymbolIcon Symbol="Save" />
            </NavigationViewItem.Icon>
        </NavigationViewItem>
        <NavigationViewItem Content="Menu Item3" Tag="SamplePage3" x:Name="SamplePage3Item">
            <NavigationViewItem.Icon>
                <SymbolIcon Symbol="Refresh" />
            </NavigationViewItem.Icon>
        </NavigationViewItem>
    </NavigationView.MenuItems>
                    
    <NavigationView.PaneCustomContent>
        <HyperlinkButton x:Name="PaneHyperlink" Content="More info" Margin="12,0" Visibility="$(PaneCustomContentVis)" />
    </NavigationView.PaneCustomContent>
    $(NavViewASB)
    <NavigationView.PaneFooter>
        <StackPanel x:Name="FooterStackPanel" Orientation="Vertical" Visibility="$(PaneFooterVis)">
            <NavigationViewItem Icon="Download" AutomationProperties.Name="download" />
            <NavigationViewItem Icon="Favorite" AutomationProperties.Name="favorite" />
        </StackPanel>
    </NavigationView.PaneFooter>

    <Frame x:Name="contentFrame" />
</NavigationView>
```

### NavigationViewDataBinding.txt
```
--- header
Data binding
--- xaml
<NavigationView x:Name="nvSample" 
                MenuItemTemplateSelector="{StaticResource selector}" 
                MenuItemsSource="{x:Bind Categories, Mode=OneWay}" />
 
<local:MenuItemTemplateSelector x:Key="selector"> 
    <local:MenuItemTemplateSelector.ItemTemplate> 
        <DataTemplate x:DataType="local:Category" > 
            <NavigationViewItem Content="{x:Bind Name}" ToolTipService.ToolTip="{x:Bind Tooltip}"> 
                <NavigationViewItem.Icon> 
                    <SymbolIcon Symbol="{x:Bind Glyph}" /> 
                </NavigationViewItem.Icon> 
            </NavigationViewItem>
        </DataTemplate> 
    </local:MenuItemTemplateSelector.ItemTemplate > 
</local:MenuItemTemplateSelector>
--- c#
//C# code behind
Categories = new ObservableCollection<CategoryBase>(); 
Categories.Add(new Category { Name = "Category 1", Glyph = Symbol.Home, Tooltip = "This is category 1" }); 
Categories.Add(new Category { Name = "Category 2", Glyph = Symbol.Keyboard, Tooltip = "This is category 2" }); 
Categories.Add(new Category { Name = "Category 3", Glyph = Symbol.Library, Tooltip = "This is category 3" }); 
Categories.Add(new Category { Name = "Category 4", Glyph = Symbol.Mail, Tooltip = "This is category 4" }); 

public class CategoryBase { } 

public class Category : CategoryBase
{
    public string Name { get; set; } = string.Empty;
    public string Tooltip { get; set; } = string.Empty;
    public Symbol Glyph { get; set; }
}

public class Separator : CategoryBase { }

public class Header : CategoryBase
{
    public string Name { get; set; }
}

[ContentProperty(Name = "ItemTemplate")]
class MenuItemTemplateSelector : DataTemplateSelector
{
    public DataTemplate? ItemTemplate { get; set; }

    protected override DataTemplate? SelectTemplateCore(object item)
    {
        return item is Separator ? SeparatorTemplate : item is Header ? HeaderTemplate : ItemTemplate;
    }
}
```

### NavigationViewTyingSelectionFocusTabs.txt
```
--- header
Tying selection and focus - Tabs
--- xaml
<NavigationView x:Name="nvSample" PaneDisplayMode="Top" 
    SelectionFollowsFocus="Enabled" IsBackButtonVisible="Collapsed">
    <NavigationView.MenuItems>
        <NavigationViewItem Icon="Play" Content="Item1" x:Name="SamplePage1Item" />
        <NavigationViewItem Icon="Save" Content="Item2" x:Name="SamplePage2Item" />
        <NavigationViewItem Icon="Refresh" Content="Item3" x:Name="SamplePage3Item" />
        <NavigationViewItem Icon="Download" Content="Item4" x:Name="SamplePage4Item" />
    </NavigationView.MenuItems>
    <Frame x:Name="contentFrame"/>
</NavigationView>
--- c#
//C# code behind
private void NavView_ItemInvoked(NavigationView sender, NavigationViewItemInvokedEventArgs args)
{
    FrameNavigationOptions navOptions = new FrameNavigationOptions();
    navOptions.TransitionInfoOverride = args.RecommendedNavigationTransitionInfo;
    if (sender.PaneDisplayMode == NavigationViewPaneDisplayMode.Top)
    {
        navOptions.IsNavigationStackEnabled = False;
    }
    Type pageType;
    if (args.InvokedItem == SamplePage1Item) 
    {
        pageType = typeof(SamplePage1);
    }
    else if (args.InvokedItem == SamplePage2Item) 
    {
        pageType = typeof(SamplePage2);
    }
    else if (args.InvokedItem == SamplePage3Item) 
    {
        pageType = typeof(SamplePage3);
    }
    else if (args.InvokedItem == SamplePage4Item) 
    {
        pageType = typeof(SamplePage4);
    }
    ContentFrame.NavigateToType(pageType, null, navOptions);
}
```

### NavigationviewDefaultPanedisplaymode.txt
```
--- header
NavigationView with default PaneDisplayMode
--- xaml
<NavigationView x:Name="nvSample">
    <NavigationView.MenuItems>
        <NavigationViewItem Icon="Play" Content="Menu Item1" Tag="SamplePage1" />
        <NavigationViewItem Icon="Save" Content="Menu Item2" Tag="SamplePage2" />
        <NavigationViewItem Icon="Refresh" Content="Menu Item3" Tag="SamplePage3" />
        <NavigationViewItem Icon="Download" Content="Menu Item4" Tag="SamplePage4" />
    </NavigationView.MenuItems>
    <Frame x:Name="contentFrame"/>
</NavigationView>
```

### NavigationviewFooterMenuItems.txt
```
--- header
NavigationView with Footer Menu Items
--- xaml
<NavigationView x:Name="nvSample9" 
                            Header="This is Header Text" 
                            PaneDisplayMode="$(PaneDisplay)" 
                            SelectionChanged="NavigationView_SelectionChanged9"
                            IsSettingsVisible="False">
        <NavigationView.MenuItems>
            <NavigationViewItem Content="Browse" Tag="SamplePage1" Icon="Library" />
            <NavigationViewItem Content="Track an Order" Tag="SamplePage2" Icon="Map" />
            <NavigationViewItem Content="Order History" Tag="SamplePage3" Icon="Tag" />
        </NavigationView.MenuItems>
        <NavigationView.FooterMenuItems>
            <NavigationViewItem Content="Account" Tag="SamplePage4" Icon="Contact" />
            <NavigationViewItem Content="Your Cart" Tag="SamplePage5" Icon="Shop" />
            <NavigationViewItem Content="Help" Tag="SamplePage5" Icon="Help" />
        </NavigationView.FooterMenuItems>
    <Frame x:Name="contentFrame9" />
</NavigationView>
```

### NavigationviewPanedisplaymodeTop.txt
```
--- header
NavigationView with PaneDisplayMode set to Top
--- xaml
<NavigationView x:Name="nvSample" Header="This is Header Text" PaneDisplayMode="Top">
    <NavigationView.MenuItems>
        <NavigationViewItem  Content="Menu Item1" Tag="SamplePage1" />
        <NavigationViewItem  Content="Menu Item2" Tag="SamplePage2" />
        <NavigationViewItem  Content="Menu Item3" Tag="SamplePage3" />
        <NavigationViewItem  Content="Menu Item4" Tag="SamplePage4" />
    </NavigationView.MenuItems>
    <Frame x:Name="contentFrame"/>
</NavigationView>
```

### NavigationviewSwitchesPaneOrientation.txt
```
--- header
NavigationView that switches pane orientation based on window width
--- xaml
<!-- Put the following VisualStateGroup(s) inside the first component of your Page -->
<VisualStateManager.VisualStateGroups>
    <VisualStateGroup>
        <VisualState>
            <VisualState.StateTriggers>
                <AdaptiveTrigger MinWindowWidth="{x:Bind nvSample.CompactModeThresholdWidth}" />
            </VisualState.StateTriggers>
            <VisualState.Setters>
                <Setter Target="nvSample.PaneDisplayMode" Value="Top" />
            </VisualState.Setters>
        </VisualState>
    </VisualStateGroup>
</VisualStateManager.VisualStateGroups >

<NavigationView x:Name="nvSample">
    <NavigationView.MenuItems>
        <NavigationViewItem Content="Menu Item1" Tag="SamplePage1" />
        <NavigationViewItem Content="Menu Item2" Tag="SamplePage2" />
        <NavigationViewItem Content="Menu Item3" Tag="SamplePage3" />
        <NavigationViewItem Content="Menu Item4" Tag="SamplePage4" />
    </NavigationView.MenuItems>
    <Frame x:Name="contentFrame"/>
</NavigationView>
```


# Pivot

## 主页面 XAML (PivotPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.PivotPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample
            x:Name="Example1"
            Margin="0,0,24,0"
            SampleDefinition="Pivot\BasicPivot.txt">
            <Pivot Title="EMAIL" MinHeight="400">
                <PivotItem Header="All">
                    <TextBlock Text="all emails go here." />
                </PivotItem>
                <PivotItem Header="Unread">
                    <TextBlock Text="unread emails go here." />
                </PivotItem>
                <PivotItem Header="Flagged">
                    <TextBlock Text="flagged emails go here." />
                </PivotItem>
                <PivotItem Header="Urgent">
                    <TextBlock Text="urgent emails go here." />
                </PivotItem>
            </Pivot>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (PivotPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class PivotPage : Page
{
    public PivotPage()
    {
        this.InitializeComponent();
    }
}

```

## 示例文件

### BasicPivot.txt
```
--- header
A basic pivot.
--- xaml
<Pivot Title="EMAIL">
    <PivotItem Header="All">
        <TextBlock Text="all emails go here." />
    </PivotItem>
    <PivotItem Header="Unread">
        <TextBlock Text="unread emails go here." />
    </PivotItem>
    <PivotItem Header="Flagged">
        <TextBlock Text="flagged emails go here." />
    </PivotItem>
    <PivotItem Header="Urgent">
        <TextBlock Text="urgent emails go here." />
    </PivotItem>
</Pivot>
```


# SelectorBar

## 主页面 XAML (SelectorBarPage.xaml)
```xaml
<?xml version="1.0" encoding="utf-8" ?>
<Page
    x:Class="WinUIGallery.ControlPages.SelectorBarPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:media="using:Microsoft.UI.Xaml.Media"
    mc:Ignorable="d">

    <Page.Resources>
        <DataTemplate x:Key="ColorsTemplate" x:DataType="media:SolidColorBrush">
            <ItemContainer
                Width="112"
                Height="82"
                Margin="4"
                Background="{x:Bind}" />
        </DataTemplate>
    </Page.Resources>

    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="SelectorBar\BasicSelectorbar.txt">
            <SelectorBar x:Name="SelectorBar1">
                <SelectorBarItem
                    x:Name="SelectorBarItemRecent"
                    Icon="Clock"
                    Text="Recent" />
                <SelectorBarItem
                    x:Name="SelectorBarItemShared"
                    Icon="Share"
                    Text="Shared" />
                <SelectorBarItem
                    x:Name="SelectorBarItemFavorites"
                    Icon="Favorite"
                    Text="Favorites" />
            </SelectorBar>
        </controls:ControlExample>

        <controls:ControlExample x:Name="Example2" SampleDefinition="SelectorBar\SelectorbarFrameSlideTransitions.txt">
            <StackPanel>
                <SelectorBar x:Name="SelectorBar2" SelectionChanged="SelectorBar2_SelectionChanged">
                    <SelectorBarItem
                        x:Name="SelectorBarItemPage1"
                        IsSelected="True"
                        Text="Page1" />
                    <SelectorBarItem x:Name="SelectorBarItemPage2" Text="Page2" />
                    <SelectorBarItem x:Name="SelectorBarItemPage3" Text="Page3" />
                    <SelectorBarItem x:Name="SelectorBarItemPage4" Text="Page4" />
                    <SelectorBarItem x:Name="SelectorBarItemPage5" Text="Page5" />
                </SelectorBar>

                <Frame x:Name="ContentFrame" IsNavigationStackEnabled="False" />
            </StackPanel>


        </controls:ControlExample>

        <controls:ControlExample x:Name="Example3" SampleDefinition="SelectorBar\SelectorbarDisplayingDifferentCollections.txt">
            <StackPanel>
                <SelectorBar x:Name="SelectorBar3" SelectionChanged="SelectorBar3_SelectionChanged">
                    <SelectorBarItem
                        x:Name="SelectorBarItemPink"
                        IsSelected="True"
                        Text="Pink" />
                    <SelectorBarItem x:Name="SelectorBarItemPlum" Text="Plum" />
                    <SelectorBarItem x:Name="SelectorBarItemPowderBlue" Text="PowderBlue" />
                </SelectorBar>

                <ItemsView x:Name="ItemsView3" ItemTemplate="{StaticResource ColorsTemplate}">
                    <ItemsView.Layout>
                        <StackLayout Orientation="Horizontal" />
                    </ItemsView.Layout>
                </ItemsView>
            </StackPanel>


        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (SelectorBarPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media;
using Microsoft.UI.Xaml.Media.Animation;
using System.Collections.ObjectModel;
using WinUIGallery.SamplePages;

namespace WinUIGallery.ControlPages;


public sealed partial class SelectorBarPage : Page
{
    int previousSelectedIndex = 0;

    public ObservableCollection<SolidColorBrush> PinkColorCollection = new ObservableCollection<SolidColorBrush>();
    public ObservableCollection<SolidColorBrush> PlumColorCollection = new ObservableCollection<SolidColorBrush>();
    public ObservableCollection<SolidColorBrush> PowderBlueColorCollection = new ObservableCollection<SolidColorBrush>();

    public SelectorBarPage()
    {
        this.InitializeComponent();

        PopulateColorCollections();
    }

    private void SelectorBar2_SelectionChanged(SelectorBar sender, SelectorBarSelectionChangedEventArgs args)
    {
        SelectorBarItem selectedItem = sender.SelectedItem;
        int currentSelectedIndex = sender.Items.IndexOf(selectedItem);
        System.Type pageType;

        switch (currentSelectedIndex)
        {
            case 0:
                pageType = typeof(SamplePage1);
                break;
            case 1:
                pageType = typeof(SamplePage2);
                break;
            case 2:
                pageType = typeof(SamplePage3);
                break;
            case 3:
                pageType = typeof(SamplePage4);
                break;
            default:
                pageType = typeof(SamplePage5);
                break;
        }

        var slideNavigationTransitionEffect = currentSelectedIndex - previousSelectedIndex > 0 ? SlideNavigationTransitionEffect.FromRight : SlideNavigationTransitionEffect.FromLeft;

        ContentFrame.Navigate(pageType, null, new SlideNavigationTransitionInfo() { Effect = slideNavigationTransitionEffect });

        previousSelectedIndex = currentSelectedIndex;
    }

    private void SelectorBar3_SelectionChanged(SelectorBar sender, SelectorBarSelectionChangedEventArgs args)
    {
        if (sender.SelectedItem == SelectorBarItemPink)
        {
            ItemsView3.ItemsSource = PinkColorCollection;
        }
        else if (sender.SelectedItem == SelectorBarItemPlum)
        {
            ItemsView3.ItemsSource = PlumColorCollection;
        }
        else
        {
            ItemsView3.ItemsSource = PowderBlueColorCollection;
        }
    }

    private void PopulateColorCollections()
    {
        SolidColorBrush solidColorBrush = new SolidColorBrush(Microsoft.UI.Colors.Pink);

        for (int colorInstance = 0; colorInstance < 5; colorInstance++)
        {
            this.PinkColorCollection.Add(solidColorBrush);
        }

        solidColorBrush = new SolidColorBrush(Microsoft.UI.Colors.Plum);

        for (int colorInstance = 0; colorInstance < 7; colorInstance++)
        {
            this.PlumColorCollection.Add(solidColorBrush);
        }

        solidColorBrush = new SolidColorBrush(Microsoft.UI.Colors.PowderBlue);

        for (int colorInstance = 0; colorInstance < 4; colorInstance++)
        {
            this.PowderBlueColorCollection.Add(solidColorBrush);
        }
    }
}

```

## 示例文件

### BasicSelectorbar.txt
```
--- header
A Basic SelectorBar
--- xaml
<SelectorBar x:Name="SelectorBar1">
    <SelectorBarItem x:Name="SelectorBarItemRecent" Text="Recent" Icon="Clock" />
    <SelectorBarItem x:Name="SelectorBarItemShared" Text="Shared" Icon="Share" />
    <SelectorBarItem x:Name="SelectorBarItemFavorites" Text="Favorites" Icon="Favorite" />
</SelectorBar>
```

### SelectorbarDisplayingDifferentCollections.txt
```
--- header
SelectorBar Displaying Different Collections Using ItemsView
--- xaml
<SelectorBar x:Name="SelectorBar3" SelectionChanged="SelectorBar3_SelectionChanged" >
    <SelectorBarItem x:Name="SelectorBarItemPink" Text="Pink" IsSelected="True" />
    <SelectorBarItem x:Name="SelectorBarItemPlum" Text="Plum" />
    <SelectorBarItem x:Name="SelectorBarItemPowderBlue" Text="PowderBlue" />
</SelectorBar>

<ItemsView x:Name="ItemsView3" ItemTemplate="{StaticResource ColorsTemplate}" />
    <ItemsView.Layout>
        <UniformGridLayout />
    </ItemsView.Layout>
</ItemsView/>
--- c#
private void SelectorBar3_SelectionChanged(SelectorBar sender, SelectorBarSelectionChangedEventArgs args)
{
    if (sender.SelectedItem == SelectorBarItemPink)
    {
        ItemsView3.ItemsSource = PinkColorCollection;
    }
    else if (sender.SelectedItem == SelectorBarItemPlum)
    {
        ItemsView3.ItemsSource = PlumColorCollection;
    }
    else
    {
        ItemsView3.ItemsSource = PowderBlueColorCollection;
    }
}
```

### SelectorbarFrameSlideTransitions.txt
```
--- header
SelectorBar with Frame Slide Transitions
--- xaml
<SelectorBar x:Name="SelectorBar2" SelectionChanged="SelectorBar2_SelectionChanged">
    <SelectorBarItem x:Name="SelectorBarItemPage1" Text="Page1" IsSelected="True" />
    <SelectorBarItem x:Name="SelectorBarItemPage2" Text="Page2" />
    <SelectorBarItem x:Name="SelectorBarItemPage3" Text="Page3" />
    <SelectorBarItem x:Name="SelectorBarItemPage4" Text="Page4" />
    <SelectorBarItem x:Name="SelectorBarItemPage5" Text="Page5" />
</SelectorBar>

<Frame x:Name="ContentFrame" IsNavigationStackEnabled="False" />
--- c#
private void SelectorBar2_SelectionChanged(SelectorBar sender, SelectorBarSelectionChangedEventArgs args)
        {
            SelectorBarItem selectedItem = sender.SelectedItem;
            int currentSelectedIndex = sender.Items.IndexOf(selectedItem);
            System.Type pageType;

            switch (currentSelectedIndex)
            {
                case 0:
                    pageType = typeof(SamplePage1);
                    break;
                case 1:
                    pageType = typeof(SamplePage2);
                    break;
                case 2:
                    pageType = typeof(SamplePage3);
                    break;
                case 3:
                    pageType = typeof(SamplePage4);
                    break;
                default:
                    pageType = typeof(SamplePage5);
                    break;
            }

            var slideNavigationTransitionEffect = currentSelectedIndex - previousSelectedIndex > 0 ? SlideNavigationTransitionEffect.FromRight : SlideNavigationTransitionEffect.FromLeft;

            ContentFrame.Navigate(pageType, null, new SlideNavigationTransitionInfo() { Effect = slideNavigationTransitionEffect });

            previousSelectedIndex = currentSelectedIndex;
        }
```


# TabView

## 主页面 XAML (TabViewPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.TabViewPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:local="using:WinUIGallery.ControlPages"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:samplepages="using:WinUIGallery.SamplePages"
    mc:Ignorable="d">
    <Page.Resources>
        <MenuFlyout x:Name="TabViewContextMenu" Opening="TabViewContextMenu_Opening" />
    </Page.Resources>

    <StackPanel>
        <controls:ControlExample SampleDefinition="TabView\TabviewSupportAddingClosing.txt">
            <controls:ControlExample.Example>
                <TabView
                    x:Name="TabView1"
                    MinHeight="475"
                    Margin="-12"
                    AddTabButtonClick="TabView_AddButtonClick"
                    Loaded="TabView_Loaded"
                    SelectedIndex="0"
                    TabCloseRequested="TabView_TabCloseRequested" />
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="TabView\TabviewTabviewitemsDefinedMarkup.txt">
            <controls:ControlExample.Example>
                <TabView
                    MinHeight="475"
                    Margin="-12"
                    AddTabButtonClick="TabView_AddButtonClick"
                    SelectedIndex="0"
                    TabCloseRequested="TabView_TabCloseRequested">
                    <TabView.TabItems>
                        <TabViewItem Header="Document 0" ContextFlyout="{x:Bind TabViewContextMenu}">
                            <TabViewItem.IconSource>
                                <SymbolIconSource Symbol="Placeholder" />
                            </TabViewItem.IconSource>
                            <samplepages:SamplePage1 />
                        </TabViewItem>
                        <TabViewItem Header="Document 1" ContextFlyout="{x:Bind TabViewContextMenu}">
                            <TabViewItem.IconSource>
                                <SymbolIconSource Symbol="Placeholder" />
                            </TabViewItem.IconSource>
                            <samplepages:SamplePage2 />
                        </TabViewItem>
                        <TabViewItem Header="Document 2" ContextFlyout="{x:Bind TabViewContextMenu}">
                            <TabViewItem.IconSource>
                                <SymbolIconSource Symbol="Placeholder" />
                            </TabViewItem.IconSource>
                            <samplepages:SamplePage3 />
                        </TabViewItem>
                    </TabView.TabItems>
                </TabView>
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="TabView\TabviewBoundCollectionMydata.txt">
            <controls:ControlExample.Example>
                <TabView
                    x:Name="TabViewItemsSourceSample"
                    MinHeight="475"
                    Margin="-12"
                    AddTabButtonClick="TabViewItemsSourceSample_AddTabButtonClick"
                    SelectedIndex="0"
                    TabCloseRequested="TabViewItemsSourceSample_TabCloseRequested"
                    TabItemsSource="{x:Bind myDatas, Mode=OneWay}">
                    <TabView.TabItemTemplate>
                        <DataTemplate x:DataType="local:MyData">
                            <TabViewItem
                                Content="{x:Bind DataContent}"
                                Header="{x:Bind DataHeader}"
                                IconSource="{x:Bind DataIconSource}" />
                        </DataTemplate>
                    </TabView.TabItemTemplate>
                </TabView>
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="TabView\TabviewKeyboardingSupport.txt">
            <controls:ControlExample.Example>
                <StackPanel>
                    <TextBlock
                        Margin="0,0,0,0"
                        Text="- Ctrl+T opens a new tab"
                        TextWrapping="WrapWholeWords" />
                    <TextBlock
                        Margin="0,0,0,0"
                        Text="- Ctrl+W closes the selected tab"
                        TextWrapping="WrapWholeWords" />
                    <TextBlock
                        Margin="0,0,0,0"
                        Text="- Ctrl+1 to Ctrl+8 selects that number tab"
                        TextWrapping="WrapWholeWords" />
                    <TextBlock
                        Margin="0,0,0,24"
                        Text="- Ctrl+9 selects the last tab (regardless of the number of tabs)"
                        TextWrapping="WrapWholeWords" />

                    <TabView
                        x:Name="TabView2"
                        MinHeight="475"
                        Margin="-12"
                        AddTabButtonClick="TabView_AddButtonClick"
                        Loaded="TabView_Loaded"
                        SelectedIndex="0"
                        TabCloseRequested="TabView_TabCloseRequested">
                        <TabView.KeyboardAccelerators>
                            <KeyboardAccelerator
                                Key="T"
                                Invoked="NewTabKeyboardAccelerator_Invoked"
                                Modifiers="Control" />
                            <KeyboardAccelerator
                                Key="W"
                                Invoked="CloseSelectedTabKeyboardAccelerator_Invoked"
                                Modifiers="Control" />
                            <KeyboardAccelerator
                                Key="Number1"
                                Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked"
                                Modifiers="Control" />
                            <KeyboardAccelerator
                                Key="Number2"
                                Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked"
                                Modifiers="Control" />
                            <KeyboardAccelerator
                                Key="Number3"
                                Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked"
                                Modifiers="Control" />
                            <KeyboardAccelerator
                                Key="Number4"
                                Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked"
                                Modifiers="Control" />
                            <KeyboardAccelerator
                                Key="Number5"
                                Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked"
                                Modifiers="Control" />
                            <KeyboardAccelerator
                                Key="Number6"
                                Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked"
                                Modifiers="Control" />
                            <KeyboardAccelerator
                                Key="Number7"
                                Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked"
                                Modifiers="Control" />
                            <KeyboardAccelerator
                                Key="Number8"
                                Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked"
                                Modifiers="Control" />
                            <KeyboardAccelerator
                                Key="Number9"
                                Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked"
                                Modifiers="Control" />
                        </TabView.KeyboardAccelerators>
                    </TabView>
                </StackPanel>
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="TabView\TabViewYouPutCustomContent.txt">
            <controls:ControlExample.Example>
                <StackPanel>
                    <TextBlock
                        Margin="0,0,0,12"
                        Text="You can put any content in the TabStripHeader and TabStripFooter areas"
                        TextWrapping="WrapWholeWords" />
                    <TextBlock
                        Margin="0,0,0,12"
                        Text="If your TabView is used inside the app's titlebar area, use the TabStripFooter to specify a custom drag region"
                        TextWrapping="WrapWholeWords" />
                    <TextBlock
                        Margin="0,0,0,24"
                        Text="See TabViewWindowingSamplePage.xaml and *.cs files to see the complete code"
                        TextWrapping="WrapWholeWords" />

                    <TabView
                        BringIntoViewRequested="TabView_BringIntoViewRequested"
                        MinHeight="475"
                        Margin="-12"
                        AddTabButtonClick="TabView_AddButtonClick"
                        Loaded="TabView_Loaded"
                        SelectedIndex="0"
                        TabCloseRequested="TabView_TabCloseRequested"
                        TabWidthMode="SizeToContent">
                        <TabView.TabStripHeader>
                            <TextBlock
                                Margin="8,6"
                                VerticalAlignment="Center"
                                Style="{ThemeResource BaseTextBlockStyle}"
                                Text="TabStripHeader Content" />
                        </TabView.TabStripHeader>
                        <TabView.TabStripFooter>
                            <TextBlock
                                Margin="6"
                                HorizontalAlignment="Right"
                                VerticalAlignment="Center"
                                Style="{ThemeResource BaseTextBlockStyle}"
                                Text="TabStripFooter Content" />
                        </TabView.TabStripFooter>
                    </TabView>
                </StackPanel>
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="TabView\TabViewTabWidthsEitherBe.txt">
            <controls:ControlExample.Example>
                <TabView
                    x:Name="TabView3"
                    BringIntoViewRequested="TabView_BringIntoViewRequested"
                    MinHeight="475"
                    Margin="-12"
                    IsAddTabButtonVisible="False"
                    SelectedIndex="0"
                    TabWidthMode="SizeToContent">
                    <TabView.TabItems>
                        <TabViewItem Header="Home" IsClosable="False" ContextFlyout="{x:Bind TabViewContextMenu}">
                            <TabViewItem.IconSource>
                                <SymbolIconSource Symbol="Home" />
                            </TabViewItem.IconSource>
                            <samplepages:SamplePage1 />
                        </TabViewItem>
                        <TabViewItem Header="Tab 2 Has Longer Text" IsClosable="False" ContextFlyout="{x:Bind TabViewContextMenu}">
                            <TabViewItem.IconSource>
                                <SymbolIconSource Symbol="MusicInfo" />
                            </TabViewItem.IconSource>
                            <samplepages:SamplePage2 />
                        </TabViewItem>
                        <TabViewItem Header="Third Tab" IsClosable="False" ContextFlyout="{x:Bind TabViewContextMenu}">
                            <TabViewItem.IconSource>
                                <SymbolIconSource Symbol="Placeholder" />
                            </TabViewItem.IconSource>
                            <samplepages:SamplePage3 />
                        </TabViewItem>
                    </TabView.TabItems>
                </TabView>
            </controls:ControlExample.Example>
            <controls:ControlExample.Options>
                <ComboBox
                    Width="150"
                    Header="TabWidthBehavior"
                    SelectedIndex="0"
                    SelectionChanged="TabWidthBehaviorComboBox_SelectionChanged">
                    <ComboBoxItem Content="SizeToContent" />
                    <ComboBoxItem Content="Equal" />
                    <ComboBoxItem Content="Compact" />
                </ComboBox>
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="TabWidthMode" Value="{x:Bind TabView3.TabWidthMode, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="TabView\TabViewCloseButtonBePersistent.txt">
            <controls:ControlExample.Example>
                <TabView
                    x:Name="TabView4"
                    MinHeight="475"
                    Margin="-12"
                    IsAddTabButtonVisible="False"
                    SelectedIndex="0">
                    <TabView.TabItems>
                        <TabViewItem Header="Home" ContextFlyout="{x:Bind TabViewContextMenu}">
                            <TabViewItem.IconSource>
                                <SymbolIconSource Symbol="Home" />
                            </TabViewItem.IconSource>
                            <samplepages:SamplePage1 />
                        </TabViewItem>
                        <TabViewItem Header="Tab 2 Has Longer Text" ContextFlyout="{x:Bind TabViewContextMenu}">
                            <TabViewItem.IconSource>
                                <SymbolIconSource Symbol="MusicInfo" />
                            </TabViewItem.IconSource>
                            <samplepages:SamplePage2 />
                        </TabViewItem>
                        <TabViewItem Header="Third Tab" ContextFlyout="{x:Bind TabViewContextMenu}">
                            <TabViewItem.IconSource>
                                <SymbolIconSource Symbol="Placeholder"/>
                            </TabViewItem.IconSource>
                            <samplepages:SamplePage3 />
                        </TabViewItem>
                    </TabView.TabItems>
                </TabView>
            </controls:ControlExample.Example>
            <controls:ControlExample.Options>
                <ComboBox
                    Width="150"
                    Header="TabViewItem CloseButtonOverlayMode"
                    SelectedIndex="1"
                    SelectionChanged="TabCloseButtonOverlayModeComboBox_SelectionChanged">
                    <ComboBoxItem Content="Auto" />
                    <ComboBoxItem Content="Always" />
                    <ComboBoxItem Content="OnHover" />
                </ComboBox>
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="CloseButtonOverlayMode" Value="{x:Bind TabView4.CloseButtonOverlayMode, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="TabView\TabviewColorTabIcons.txt">
            <controls:ControlExample.Example>
                <StackPanel>
                    <TextBlock
                        Margin="0,0,0,12"
                        Text="Use BitmapIcon.ShowAsMonochrome=&quot;False&quot; to display full color icons in the TabViewItem"
                        TextWrapping="WrapWholeWords" />

                    <TabView
                        BringIntoViewRequested="TabView_BringIntoViewRequested"
                        MinWidth="490"
                        IsAddTabButtonVisible="False"
                        SelectedIndex="0"
                        TabWidthMode="SizeToContent">
                        <TabView.TabItems>
                            <TabViewItem Header="CMD Prompt" IsClosable="False" ContextFlyout="{x:Bind TabViewContextMenu}">
                                <TabViewItem.IconSource>
                                    <BitmapIconSource ShowAsMonochrome="False" UriSource="ms-appx:///Assets/SampleMedia/cmd.png" />
                                </TabViewItem.IconSource>
                            </TabViewItem>
                            <TabViewItem Header="PowerShell" IsClosable="False" ContextFlyout="{x:Bind TabViewContextMenu}">
                                <TabViewItem.IconSource>
                                    <BitmapIconSource ShowAsMonochrome="False" UriSource="ms-appx:///Assets/SampleMedia/powershell.png" />
                                </TabViewItem.IconSource>
                            </TabViewItem>
                            <TabViewItem Header="Windows Subsystem for Linux" IsClosable="False" ContextFlyout="{x:Bind TabViewContextMenu}">
                                <TabViewItem.IconSource>
                                    <BitmapIconSource ShowAsMonochrome="False" UriSource="ms-appx:///Assets/SampleMedia/linux.png" />
                                </TabViewItem.IconSource>
                            </TabViewItem>
                        </TabView.TabItems>
                    </TabView>
                </StackPanel>
            </controls:ControlExample.Example>

        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="TabView\TabviewAccentColoredTabstrip.txt">
            <controls:ControlExample.Example>
                <TabView
                    MinHeight="475"
                    Margin="-12"
                    AddTabButtonClick="TabView_AddButtonClick"
                    Loaded="TabView_Loaded"
                    SelectedIndex="0"
                    TabCloseRequested="TabView_TabCloseRequested">
                    <TabView.Resources>
                        <ResourceDictionary>
                            <ResourceDictionary.ThemeDictionaries>
                                <ResourceDictionary x:Key="Light">
                                    <SolidColorBrush x:Key="TabViewBackground" Color="{ThemeResource SystemAccentColorLight2}" />
                                </ResourceDictionary>
                                <ResourceDictionary x:Key="Dark">
                                    <SolidColorBrush x:Key="TabViewBackground" Color="{ThemeResource SystemAccentColorDark2}" />
                                </ResourceDictionary>
                            </ResourceDictionary.ThemeDictionaries>
                        </ResourceDictionary>
                    </TabView.Resources>
                </TabView>
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample x:Name="LaunchExample" SampleDefinition="TabView\CompleteTabviewWindowingSample.txt">
            <controls:ControlExample.Example>
                <Button Click="TabViewWindowingButton_Click" Content="Click here to launch the sample" />
            </controls:ControlExample.Example>
        </controls:ControlExample>

    </StackPanel>
</Page>

```

## 主页面 C# (TabViewPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Input;
using System.Collections.ObjectModel;
using WinUIGallery.Helpers;
using WinUIGallery.SamplePages;

namespace WinUIGallery.ControlPages;

public class MyData
{
    public string DataHeader { get; set; } = string.Empty;
    public required IconSource DataIconSource { get; set; }
    public required object DataContent { get; set; }
}

public sealed partial class TabViewPage : Page
{
    ObservableCollection<MyData>? myDatas;

    public TabViewPage()
    {
        this.InitializeComponent();

        // Launching isn't supported yet on Desktop
        // Blocked on Task 27517663: DCPP Preview 2 Bug: Dragging in TabView windowing sample causes app to crash
        //this.LaunchExample.Visibility = Visibility.Collapsed;

        InitializeDataBindingSampleData();
    }

    #region SharedTabViewLogic
    private void TabView_Loaded(object sender, RoutedEventArgs e)
    {
        for (int i = 0; i < 3; i++)
        {
            (sender as TabView)?.TabItems.Add(CreateNewTab(i));
        }
    }

    private void TabView_BringIntoViewRequested(UIElement sender, BringIntoViewRequestedEventArgs args)
    {
        // The TabView control is firing this event when TabWidthMode is set to `SizeToContent` or `Compact`.
        // This will work around an auto-scroll issue when the page is loaded.
        args.Handled = true;
    }

    private void TabView_AddButtonClick(TabView sender, object args)
    {
        sender.TabItems.Add(CreateNewTab(sender.TabItems.Count));
    }

    private void TabView_TabCloseRequested(TabView sender, TabViewTabCloseRequestedEventArgs args)
    {
        sender.TabItems.Remove(args.Tab);
    }

    private TabViewItem CreateNewTab(int index)
    {
        TabViewItem newItem = new TabViewItem
        {
            Header = $"Document {index}",
            IconSource = new Microsoft.UI.Xaml.Controls.SymbolIconSource() { Symbol = Symbol.Document },
            ContextFlyout = TabViewContextMenu
        };

        // The content of the tab is often a frame that contains a page, though it could be any UIElement.
        Frame frame = new Frame();

        switch (index % 3)
        {
            case 0:
                frame.Navigate(typeof(SamplePage1));
                break;
            case 1:
                frame.Navigate(typeof(SamplePage2));
                break;
            case 2:
                frame.Navigate(typeof(SamplePage3));
                break;
        }

        newItem.Content = frame;

        return newItem;
    }
    #endregion

    #region ItemsSourceSample
    private void InitializeDataBindingSampleData()
    {
        myDatas = new ObservableCollection<MyData>();

        for (int index = 0; index < 3; index++)
        {
            myDatas.Add(CreateNewMyData(index));
        }
    }

    private MyData CreateNewMyData(int index)
    {
        Frame frame = new Frame();

        switch (index % 3)
        {
            case 0:
                frame.Navigate(typeof(SamplePage1));
                break;
            case 1:
                frame.Navigate(typeof(SamplePage2));
                break;
            case 2:
                frame.Navigate(typeof(SamplePage3));
                break;
        }

        var newData = new MyData
        {
            DataHeader = $"MyData Doc {index}",
            DataIconSource = new Microsoft.UI.Xaml.Controls.SymbolIconSource() { Symbol = Symbol.Placeholder },
            DataContent = frame,
        };

        return newData;
    }

    private void TabViewItemsSourceSample_AddTabButtonClick(TabView sender, object args)
    {
        // Add a new MyData item to the collection. TabView automatically generates a TabViewItem.
        myDatas?.Add(CreateNewMyData(myDatas.Count));
    }

    private void TabViewItemsSourceSample_TabCloseRequested(TabView sender, TabViewTabCloseRequestedEventArgs args)
    {
        if (args.Item is not MyData myData)
        {
            return;
        }

        // Remove the requested MyData object from the collection.
        myDatas?.Remove(myData);
    }
    #endregion

    #region KeyboardAcceleratorSample
    private void NewTabKeyboardAccelerator_Invoked(KeyboardAccelerator sender, KeyboardAcceleratorInvokedEventArgs args)
    {
        var senderTabView = args.Element as TabView;
        senderTabView?.TabItems.Add(CreateNewTab(senderTabView.TabItems.Count));

        args.Handled = true;
    }

    private void CloseSelectedTabKeyboardAccelerator_Invoked(KeyboardAccelerator sender, KeyboardAcceleratorInvokedEventArgs args)
    {
        if (args.Element is not TabView invokedTabView)
        {
            return;
        }

        // Only close the selected tab if it is closeable
        if ((invokedTabView.SelectedItem as TabViewItem)?.IsClosable is true)
        {
            invokedTabView.TabItems.Remove(invokedTabView.SelectedItem);
        }

        args.Handled = true;
    }

    private void NavigateToNumberedTabKeyboardAccelerator_Invoked(KeyboardAccelerator sender, KeyboardAcceleratorInvokedEventArgs args)
    {
        if (args.Element is not TabView invokedTabView)
        {
            return;
        }

        int tabToSelect = 0;

        switch (sender.Key)
        {
            case Windows.System.VirtualKey.Number1:
                tabToSelect = 0;
                break;
            case Windows.System.VirtualKey.Number2:
                tabToSelect = 1;
                break;
            case Windows.System.VirtualKey.Number3:
                tabToSelect = 2;
                break;
            case Windows.System.VirtualKey.Number4:
                tabToSelect = 3;
                break;
            case Windows.System.VirtualKey.Number5:
                tabToSelect = 4;
                break;
            case Windows.System.VirtualKey.Number6:
                tabToSelect = 5;
                break;
            case Windows.System.VirtualKey.Number7:
                tabToSelect = 6;
                break;
            case Windows.System.VirtualKey.Number8:
                tabToSelect = 7;
                break;
            case Windows.System.VirtualKey.Number9:
                // Select the last tab
                tabToSelect = invokedTabView.TabItems.Count - 1;
                break;
        }

        // Only select the tab if it is in the list
        if (tabToSelect < invokedTabView.TabItems.Count)
        {
            invokedTabView.SelectedIndex = tabToSelect;
        }

        args.Handled = true;
    }
    #endregion

    private void TabWidthBehaviorComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        string? widthModeString = (e.AddedItems[0] as ComboBoxItem)?.Content.ToString();
        TabViewWidthMode widthMode = TabViewWidthMode.Equal;
        switch (widthModeString)
        {
            case "Equal":
                widthMode = TabViewWidthMode.Equal;
                break;
            case "SizeToContent":
                widthMode = TabViewWidthMode.SizeToContent;
                break;
            case "Compact":
                widthMode = TabViewWidthMode.Compact;
                break;
        }
        TabView3.TabWidthMode = widthMode;
    }

    private void TabCloseButtonOverlayModeComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        string? overlayModeString = (e.AddedItems[0] as ComboBoxItem)?.Content.ToString();
        TabViewCloseButtonOverlayMode overlayMode = TabViewCloseButtonOverlayMode.Auto;
        switch (overlayModeString)
        {
            case "Auto":
                overlayMode = TabViewCloseButtonOverlayMode.Auto;
                break;
            case "OnHover":
                overlayMode = TabViewCloseButtonOverlayMode.OnPointerOver;
                break;
            case "Always":
                overlayMode = TabViewCloseButtonOverlayMode.Always;
                break;
        }
        TabView4.CloseButtonOverlayMode = overlayMode;
    }

    private void TabViewWindowingButton_Click(object sender, Microsoft.UI.Xaml.RoutedEventArgs e)
    {
        var tabViewSample = new TabViewWindowingSamplePage();

        var newWindow = WindowHelper.CreateWindow();
        newWindow.ExtendsContentIntoTitleBar = true;
        newWindow.Content = tabViewSample;
        newWindow.AppWindow.SetIcon("Assets/Tiles/GalleryIcon.ico");
        tabViewSample.LoadDemoData();

        newWindow.Activate();
    }

    private void TabViewContextMenu_Opening(object sender, object e)
    {
        var menuFlyout = (MenuFlyout)sender;
        TabViewHelper.PopulateTabViewContextMenu(menuFlyout);
        // If the context menu ended up with no items at all, then we'll prevent it from being shown.
        if (menuFlyout.Items.Count == 0)
        {
            menuFlyout.Hide();
        }
    }
}

```

## 示例文件

### CompleteTabviewWindowingSample.txt
```
--- header
Complete TabView windowing sample
--- xaml
Check out the TabViewWindowingSamplePage.xaml and *.cs files to see the complete code.
```

### TabViewCloseButtonBePersistent.txt
```
--- header
The close button can be persistent or only visible on hover
--- xaml
<TabView CloseButtonOverlayMode="$(CloseButtonOverlayMode)" />
```

### TabViewTabWidthsEitherBe.txt
```
--- header
Tab widths can either be equally sized, sized to the content of the tab, or sized to only show the icon when unselected
--- xaml
<TabView TabWidthMode="$(TabWidthMode)" />
```

### TabViewYouPutCustomContent.txt
```
--- header
You can put custom content in TabStripHeader and TabStripFooter
--- xaml
<TabView>
    <TabView.TabStripHeader>
        <TextBlock Text="TabStripHeader Content" VerticalAlignment="Center" Margin="8,6" Style="{ThemeResource BaseTextBlockStyle}" />
    </TabView.TabStripHeader>
    <TabView.TabStripFooter>
        <TextBlock Text="TabStripFooter Content" VerticalAlignment="Center" HorizontalAlignment="Right" Margin="6" Style="{ThemeResource BaseTextBlockStyle}" />
    </TabView.TabStripFooter>
</TabView>
```

### TabviewAccentColoredTabstrip.txt
```
--- header
A TabView with accent colored TabStrip background
--- xaml
<TabView>
    <TabView.Resources>
        <ResourceDictionary>
            <ResourceDictionary.ThemeDictionaries>
                <ResourceDictionary x:Key="Light">
                    <SolidColorBrush x:Key="TabViewBackground" Color="{ThemeResource SystemAccentColorLight2}"/>
                </ResourceDictionary>
                <ResourceDictionary x:Key="Dark">
                    <SolidColorBrush x:Key="TabViewBackground" Color="{ThemeResource SystemAccentColorDark2}"/>
                </ResourceDictionary>
            </ResourceDictionary.ThemeDictionaries>
        </ResourceDictionary>
    </TabView.Resources>
</TabView>
```

### TabviewBoundCollectionMydata.txt
```
--- header
A TabView bound to a collection of MyData objects
--- xaml
<TabView TabItemsSource="{x:Bind myDatas, Mode=OneWay}" AddTabButtonClick="TabViewItemsSourceSample_AddTabButtonClick" TabCloseRequested="TabViewItemsSourceSample_TabCloseRequested" />
```

### TabviewColorTabIcons.txt
```
--- header
TabView with color tab icons
--- xaml
<TabView>
    <TabView.TabItems>
        <TabViewItem Header="CMD Prompt">
            <TabViewItem.IconSource>
                <BitmapIconSource UriSource="/Assets/SampleMedia/cmd.png" ShowAsMonochrome="False" />
            </TabViewItem.IconSource>
        </TabViewItem>
        <TabViewItem Header="PowerShell">
            <TabViewItem.IconSource>
                <BitmapIconSource UriSource="/Assets/SampleMedia/powershell.png" ShowAsMonochrome="False" />
            </TabViewItem.IconSource>
        </TabViewItem>
        <TabViewItem Header="Windows Subsystem for Linux">
            <TabViewItem.IconSource>
                <BitmapIconSource UriSource="/Assets/SampleMedia/linux.png" ShowAsMonochrome="False" />
            </TabViewItem.IconSource>
        </TabViewItem>
    </TabView.TabItems>
</TabView>
```

### TabviewKeyboardingSupport.txt
```
--- header
A TabView with keyboarding support
--- xaml
<TabView AddTabButtonClick="TabView_AddButtonClick" TabCloseRequested="TabView_TabCloseRequested" Loaded="TabView_Loaded">
    <TabView.KeyboardAccelerators>
        <KeyboardAccelerator Key="T" Modifiers="Control" Invoked="NewTabKeyboardAccelerator_Invoked" />
        <KeyboardAccelerator Key="W" Modifiers="Control" Invoked="CloseSelectedTabKeyboardAccelerator_Invoked" />
        <KeyboardAccelerator Key="Number1" Modifiers="Control" Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked" />
        <KeyboardAccelerator Key="Number2" Modifiers="Control" Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked" />
        <KeyboardAccelerator Key="Number3" Modifiers="Control" Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked" />
        <KeyboardAccelerator Key="Number4" Modifiers="Control" Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked" />
        <KeyboardAccelerator Key="Number5" Modifiers="Control" Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked" />
        <KeyboardAccelerator Key="Number6" Modifiers="Control" Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked" />
        <KeyboardAccelerator Key="Number7" Modifiers="Control" Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked" />
        <KeyboardAccelerator Key="Number8" Modifiers="Control" Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked" />
        <KeyboardAccelerator Key="Number9" Modifiers="Control" Invoked="NavigateToNumberedTabKeyboardAccelerator_Invoked" />
    </TabView.KeyboardAccelerators>
</TabView>
--- c#
private void NewTabKeyboardAccelerator_Invoked(KeyboardAccelerator sender, KeyboardAcceleratorInvokedEventArgs args)
{
    if (ars.Element is not TabView senderTabView)
    {
        return;
    }

    senderTabView.TabItems.Add(CreateNewTab(senderTabView.TabItems.Count));

    args.Handled = true;
}

private void CloseSelectedTabKeyboardAccelerator_Invoked(KeyboardAccelerator sender, KeyboardAcceleratorInvokedEventArgs args)
{
    if (args.Element is not TabView invokedTabView)
    {
        return;
    }

    // Only close the selected tab if it is closeable
    if ((invokedTabView.SelectedItem as TabViewItem)?.IsClosable is true)
    {
        invokedTabView.TabItems.Remove(invokedTabView.SelectedItem);
    }

    args.Handled = true;
}

private void NavigateToNumberedTabKeyboardAccelerator_Invoked(KeyboardAccelerator sender, KeyboardAcceleratorInvokedEventArgs args)
{
    if (args.Element is not TabView invokedTabView)
    {
        return;
    }

    int tabToSelect = 0;

    switch (sender.Key)
    {
        case Windows.System.VirtualKey.Number1:
            tabToSelect = 0;
            break;
        case Windows.System.VirtualKey.Number2:
            tabToSelect = 1;
            break;
        case Windows.System.VirtualKey.Number3:
            tabToSelect = 2;
            break;
        case Windows.System.VirtualKey.Number4:
            tabToSelect = 3;
            break;
        case Windows.System.VirtualKey.Number5:
            tabToSelect = 4;
            break;
        case Windows.System.VirtualKey.Number6:
            tabToSelect = 5;
            break;
        case Windows.System.VirtualKey.Number7:
            tabToSelect = 6;
            break;
        case Windows.System.VirtualKey.Number8:
            tabToSelect = 7;
            break;
        case Windows.System.VirtualKey.Number9:
            // Select the last tab
            tabToSelect = invokedTabView.TabItems.Count - 1;
            break;
    }

    // Only select the tab if it is in the list
    if (tabToSelect < invokedTabView.TabItems.Count)
    {
        invokedTabView.SelectedIndex = tabToSelect;
    }

    args.Handled = true;
}
```

### TabviewSupportAddingClosing.txt
```
--- header
A TabView with support for adding, closing, and rearranging tabs
--- xaml
<TabView AddTabButtonClick="TabView_AddButtonClick" TabCloseRequested="TabView_TabCloseRequested" Loaded="TabView_Loaded" />
--- c#
private void TabView_Loaded(object sender, RoutedEventArgs e)
{
    for (int i = 0; i < 3; i++)
    {
        (sender as TabView)?.TabItems.Add(CreateNewTab(i));
    }
}

private void TabView_AddButtonClick(TabView sender, object args)
{
    sender.TabItems.Add(CreateNewTab(sender.TabItems.Count));
}

private void TabView_TabCloseRequested(TabView sender, TabViewTabCloseRequestedEventArgs args)
{
    sender.TabItems.Remove(args.Tab);
}

private TabViewItem CreateNewTab(int index)
{
    TabViewItem newItem = new TabViewItem();

    newItem.Header = $"Document {index}";
    newItem.IconSource = new Microsoft.UI.Xaml.Controls.SymbolIconSource() { Symbol = Symbol.Document };

    // The content of the tab is often a frame that contains a page, though it could be any UIElement.
    Frame frame = new Frame();

    switch (index % 3)
    {
        case 0:
            frame.Navigate(typeof(SamplePage1));
            break;
        case 1:
            frame.Navigate(typeof(SamplePage2));
            break;
        case 2:
            frame.Navigate(typeof(SamplePage3));
            break;
    }

    newItem.Content = frame;

    return newItem;
}
```

### TabviewTabviewitemsDefinedMarkup.txt
```
--- header
A TabView with TabViewItems defined in markup
--- xaml
<TabView AddTabButtonClick="TabView_AddButtonClick" TabCloseRequested="TabView_TabCloseRequested">
    <TabView.TabItems>
        <TabViewItem Header="Document 0">
            <TabViewItem.IconSource>
                <SymbolIconSource Symbol="Placeholder" />
            </TabViewItem.IconSource>
            <samplepages:SamplePage1 />
        </TabViewItem>
        <TabViewItem Header="Document 1">
            <TabViewItem.IconSource>
                <SymbolIconSource Symbol="Placeholder" />
            </TabViewItem.IconSource>
            <samplepages:SamplePage2 />
        </TabViewItem>
        <TabViewItem Header="Document 2">
            <TabViewItem.IconSource>
                <SymbolIconSource Symbol="Placeholder" />
            </TabViewItem.IconSource>
            <samplepages:SamplePage3 />
        </TabViewItem>
    </TabView.TabItems>
</TabView>
```



# 分组: Scrolling

---

# AnnotatedScrollBar

## 主页面 XAML (AnnotatedScrollBarPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.AnnotatedScrollBarPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:media="using:Microsoft.UI.Xaml.Media">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="AnnotatedScrollBar\AnnotatedscrollbarLinkedScrollview.txt">
            <Grid ColumnDefinitions="*, Auto">
                <ScrollView
                    x:Name="scrollView"
                    MaxWidth="800"
                    MaxHeight="500"
                    Background="LightGray"
                    VerticalScrollBarVisibility="Hidden">
                    <ItemsRepeater
                        x:Name="itemsRepeater"
                        Margin="2"
                        ItemsSource="{x:Bind ColorCollection}"
                        SizeChanged="ItemsRepeater_SizeChanged">
                        <ItemsRepeater.Layout>
                            <UniformGridLayout />
                        </ItemsRepeater.Layout>
                        <ItemsRepeater.ItemTemplate>
                            <DataTemplate x:DataType="media:SolidColorBrush">
                                <Grid
                                    Width="112"
                                    Height="82"
                                    Margin="4"
                                    Background="{x:Bind}"
                                    CornerRadius="4" />
                            </DataTemplate>
                        </ItemsRepeater.ItemTemplate>
                    </ItemsRepeater>
                </ScrollView>

                <AnnotatedScrollBar
                    x:Name="annotatedScrollBar"
                    Grid.Column="1"
                    MaxHeight="500"
                    Margin="4,0,48,0"
                    HorizontalAlignment="Right"
                    DetailLabelRequested="AnnotatedScrollBar_DetailLabelRequested" />
            </Grid>

            <controls:ControlExample.Options>
                <Grid MinWidth="200" RowDefinitions="Auto, Auto">

                    <TextBlock VerticalAlignment="Center" Text="Changing the AnnotatedScrollBar height refreshes its Labels layout." />

                    <Slider
                        Grid.Row="1"
                        Margin="0,10,0,0"
                        Header="AnnotatedScrollBar maximum height:"
                        Maximum="500"
                        Minimum="100"
                        ValueChanged="AnnotatedScrollBarMaxHeightSlider_ValueChanged"
                        Value="500" />
                </Grid>
            </controls:ControlExample.Options>

        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (AnnotatedScrollBarPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Controls.Primitives;
using Microsoft.UI.Xaml.Media;
using System;
using System.Collections.ObjectModel;

namespace WinUIGallery.ControlPages;

public sealed partial class AnnotatedScrollBarPage : Page
{
    // Define the number of items present in each section of the source collection.
    private const int AzureCount = 32;
    private const int CrimsonCount = 50;
    private const int CyanCount = 8;
    private const int FuchsiaCount = 70;
    private const int GoldCount = 90;

    // Each item is sized 120x90 in the ItemsRepeater.
    private const int ItemWidth = 120;
    private const int ItemHeight = 90;

    // ItemsRepeater's ItemsSource.
    public ObservableCollection<SolidColorBrush> ColorCollection = new ObservableCollection<SolidColorBrush>();

    public AnnotatedScrollBarPage()
    {
        this.InitializeComponent();
        this.DataContext = this;
        this.Loaded += AnnotatedScrollBarPage_Loaded;

        PopulateColorCollection();
    }

    private void AnnotatedScrollBarPage_Loaded(object sender, Microsoft.UI.Xaml.RoutedEventArgs e)
    {
        // Connect the ScrollView and AnnotatedScrollBar controls. The AnnotatedScrollBar provides
        // an IScrollController implementation, while the ScrollView consumes it.
        scrollView.ScrollPresenter.VerticalScrollController = annotatedScrollBar.ScrollController;
    }

    private void AnnotatedScrollBar_DetailLabelRequested(object sender, AnnotatedScrollBarDetailLabelRequestedEventArgs e)
    {
        // Provide a string as the tooltip content when hovering the mouse over the AnnotatedScrollBar's vertical rail. The string simply
        // represents the color of the last item in the row computed from AnnotatedScrollBarDetailLabelRequestedEventArgs.ScrollOffset.
        e.Content = GetOffsetLabel(e.ScrollOffset);
    }

    private void ItemsRepeater_SizeChanged(object sender, Microsoft.UI.Xaml.SizeChangedEventArgs e)
    {
        // When the ItemsRepeater is resized, its items layout may change and thus require an update of
        // the AnnotatedScrollBar label positions.
        PopulateLabelCollection();
    }

    private void AnnotatedScrollBarMaxHeightSlider_ValueChanged(object sender, RangeBaseValueChangedEventArgs e)
    {
        if (sender is Slider slider &&
            annotatedScrollBar != null)
        {
            // Changing the height of the AnnotatedScrollBar to illustrate how labels
            // are hidden to avoid collisions when the available room shrinks too much.
            annotatedScrollBar.MaxHeight = slider.Value;
        }
    }

    private void PopulateColorCollection()
    {
        SolidColorBrush solidColorBrush = new SolidColorBrush(Microsoft.UI.Colors.Azure);

        for (int colorInstance = 0; colorInstance < AzureCount; colorInstance++)
        {
            this.ColorCollection.Add(solidColorBrush);
        }

        solidColorBrush = new SolidColorBrush(Microsoft.UI.Colors.Crimson);

        for (int colorInstance = 0; colorInstance < CrimsonCount; colorInstance++)
        {
            this.ColorCollection.Add(solidColorBrush);
        }

        solidColorBrush = new SolidColorBrush(Microsoft.UI.Colors.Cyan);

        for (int colorInstance = 0; colorInstance < CyanCount; colorInstance++)
        {
            this.ColorCollection.Add(solidColorBrush);
        }

        solidColorBrush = new SolidColorBrush(Microsoft.UI.Colors.Fuchsia);

        for (int colorInstance = 0; colorInstance < FuchsiaCount; colorInstance++)
        {
            this.ColorCollection.Add(solidColorBrush);
        }

        solidColorBrush = new SolidColorBrush(Microsoft.UI.Colors.Gold);

        for (int colorInstance = 0; colorInstance < GoldCount; colorInstance++)
        {
            this.ColorCollection.Add(solidColorBrush);
        }
    }

    private void PopulateLabelCollection()
    {
        if (annotatedScrollBar != null)
        {
            // Get rid of the labels that may have been defined earlier.
            annotatedScrollBar.Labels.Clear();

            // A new label is associated with the first item of each color section.
            // The offset value of a label is function of the row that item belongs to.
            annotatedScrollBar.Labels.Add(new AnnotatedScrollBarLabel("Azure", GetOffsetOfItem(0)));
            annotatedScrollBar.Labels.Add(new AnnotatedScrollBarLabel("Crimson", GetOffsetOfItem(AzureCount)));
            annotatedScrollBar.Labels.Add(new AnnotatedScrollBarLabel("Cyan", GetOffsetOfItem(AzureCount + CrimsonCount)));
            annotatedScrollBar.Labels.Add(new AnnotatedScrollBarLabel("Fuchsia", GetOffsetOfItem(AzureCount + CrimsonCount + CyanCount)));
            annotatedScrollBar.Labels.Add(new AnnotatedScrollBarLabel("Gold", GetOffsetOfItem(AzureCount + CrimsonCount + CyanCount + FuchsiaCount)));
        }
    }

    private string GetOffsetLabel(double offset)
    {
        if (offset <= GetOffsetOfItem(AzureCount - 1))
        {
            return GetItemColor(AzureCount - 1);
        }
        else if (offset <= GetOffsetOfItem(AzureCount + CrimsonCount - 1))
        {
            return GetItemColor(AzureCount + CrimsonCount - 1);
        }
        else if (offset <= GetOffsetOfItem(AzureCount + CrimsonCount + CyanCount - 1))
        {
            return GetItemColor(AzureCount + CrimsonCount + CyanCount - 1);
        }
        else if (offset <= GetOffsetOfItem(AzureCount + CrimsonCount + CyanCount + FuchsiaCount - 1))
        {
            return GetItemColor(AzureCount + CrimsonCount + CyanCount + FuchsiaCount - 1);
        }
        else
        {
            return GetItemColor(AzureCount + CrimsonCount + CyanCount + FuchsiaCount);
        }
    }

    private int GetOffsetOfItem(int itemIndex)
    {
        return ItemHeight * (itemIndex / GetItemsPerRow());
    }

    private string GetItemColor(int itemIndex)
    {
        if (itemIndex < AzureCount)
        {
            return "Azure";
        }
        else if (itemIndex < AzureCount + CrimsonCount)
        {
            return "Crimson";
        }
        else if (itemIndex < AzureCount + CrimsonCount + CyanCount)
        {
            return "Cyan";
        }
        else if (itemIndex < AzureCount + CrimsonCount + CyanCount + FuchsiaCount)
        {
            return "Fuchsia";
        }
        else
        {
            return "Gold";
        }
    }

    private int GetItemsPerRow()
    {
        return (itemsRepeater == null || itemsRepeater.ActualWidth == 0) ? 1 : (int)Math.Max(itemsRepeater.ActualWidth / ItemWidth, 1);
    }
}

```

## 示例文件

### AnnotatedscrollbarLinkedScrollview.txt
```
--- header
AnnotatedScrollBar linked to a ScrollView.
--- xaml
<ScrollView x:Name="scrollView"
    Background="LightGray" MaxWidth="800" MaxHeight="500"
    VerticalScrollBarVisibility="Hidden">
    <!-- ... -->
</ScrollView>
                
<AnnotatedScrollBar x:Name="annotatedScrollBar"
    Margin="4,0,48,0" MaxHeight="500"
    HorizontalAlignment="Right"
    DetailLabelRequested="AnnotatedScrollBar_DetailLabelRequested"/>
--- c#
private void AnnotatedScrollBarPage_Loaded(object sender, Microsoft.UI.Xaml.RoutedEventArgs e)
{
    scrollView.ScrollPresenter.VerticalScrollController = annotatedScrollBar.ScrollController;
}
```


# PipsPager

## 主页面 XAML (PipsPagerPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.PipsPagerPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="PipsPager\PipspagerIntegratedFlipview.txt">
            <controls:ControlExample.Example>
                <StackPanel>
                    <FlipView
                        x:Name="Gallery"
                        Height="270"
                        MaxWidth="400"
                        AutomationProperties.AutomationControlType="List"
                        AutomationProperties.LocalizedControlType="list"
                        ItemsSource="{x:Bind Pictures}">
                        <FlipView.ItemTemplate>
                            <DataTemplate x:DataType="x:String">
                                <Image Source="{x:Bind Mode=OneTime}" />
                            </DataTemplate>
                        </FlipView.ItemTemplate>
                    </FlipView>
                    <PipsPager
                        x:Name="FlipViewPipsPager"
                        Margin="0,12,0,0"
                        HorizontalAlignment="Center"
                        NumberOfPages="{x:Bind Pictures.Count}"
                        SelectedPageIndex="{x:Bind Path=Gallery.SelectedIndex, Mode=TwoWay}" />
                </StackPanel>
            </controls:ControlExample.Example>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example2" SampleDefinition="PipsPager\PipspagerOptionsChangeOrientation.txt">
            <controls:ControlExample.Example>
                <PipsPager
                    x:Name="TestPipsPager2"
                    NumberOfPages="10"
                    SelectedIndexChanged="TestPipsPager2_SelectedIndexChanged" />
            </controls:ControlExample.Example>
            <controls:ControlExample.Options>
                <StackPanel>
                    <ComboBox
                        x:Name="OrientationComboBox"
                        Header="Orientation"
                        SelectedValue="Horizontal"
                        SelectionChanged="OrientationComboBox_SelectionChanged">
                        <x:String>Horizontal</x:String>
                        <x:String>Vertical</x:String>
                    </ComboBox>
                    <ComboBox
                        x:Name="PrevButtonComboBox"
                        Header="Previous Button Visibility"
                        SelectedValue="Visible"
                        SelectionChanged="PrevButtonComboBox_SelectionChanged">
                        <x:String>Visible</x:String>
                        <x:String>VisibleOnPointerOver</x:String>
                        <x:String>Collapsed</x:String>
                    </ComboBox>
                    <ComboBox
                        x:Name="NextButtonComboBox"
                        Header="Next Button Visibility"
                        SelectedValue="Visible"
                        SelectionChanged="NextButtonComboBox_SelectionChanged">
                        <x:String>Visible</x:String>
                        <x:String>VisibleOnPointerOver</x:String>
                        <x:String>Collapsed</x:String>
                    </ComboBox>
                </StackPanel>
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="Orientation" Value="{x:Bind OrientationComboBox.SelectedValue, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="PrevButton" Value="{x:Bind PrevButtonComboBox.SelectedValue, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="NextButton" Value="{x:Bind NextButtonComboBox.SelectedValue, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (PipsPagerPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;
using System.Collections.Generic;
using WinUIGallery.Helpers;

namespace WinUIGallery.ControlPages;

public sealed partial class PipsPagerPage : Page
{
    private const string PipsPagerPageChangeNotificationId = "PipsPagerPageChangeNotificationId";

    public List<string> Pictures = new List<string>()
    {
        "ms-appx:///Assets/SampleMedia/LandscapeImage1.jpg",
        "ms-appx:///Assets/SampleMedia/LandscapeImage2.jpg",
        "ms-appx:///Assets/SampleMedia/LandscapeImage3.jpg",
        "ms-appx:///Assets/SampleMedia/LandscapeImage4.jpg",
        "ms-appx:///Assets/SampleMedia/LandscapeImage5.jpg",
        "ms-appx:///Assets/SampleMedia/LandscapeImage6.jpg",
        "ms-appx:///Assets/SampleMedia/LandscapeImage7.jpg",
        "ms-appx:///Assets/SampleMedia/LandscapeImage8.jpg",
    };
    public PipsPagerPage()
    {
        this.InitializeComponent();
    }

    private void TestPipsPager2_SelectedIndexChanged(PipsPager sender, PipsPagerSelectedIndexChangedEventArgs args)
    {
        int pageNumber = sender.SelectedPageIndex + 1; // Convert 0-based index to 1-based page number
        int totalPages = sender.NumberOfPages;
        string announcement = $"Page {pageNumber} of {totalPages} selected";
        UIHelper.AnnounceActionForAccessibility(sender, announcement, PipsPagerPageChangeNotificationId);
    }

    private void OrientationComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        string? orientation = e.AddedItems[0].ToString();

        switch (orientation)
        {
            case "Vertical":
                TestPipsPager2.Orientation = Orientation.Vertical;
                break;

            case "Horizontal":
            default:
                TestPipsPager2.Orientation = Orientation.Horizontal;
                break;
        }
    }

    private void PrevButtonComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        string? prevButtonVisibility = e.AddedItems[0].ToString();

        switch (prevButtonVisibility)
        {
            case "Visible":
                TestPipsPager2.PreviousButtonVisibility = PipsPagerButtonVisibility.Visible;
                break;

            case "VisibleOnPointerOver":
                TestPipsPager2.PreviousButtonVisibility = PipsPagerButtonVisibility.VisibleOnPointerOver;
                break;

            case "Collapsed":
            default:
                TestPipsPager2.PreviousButtonVisibility = PipsPagerButtonVisibility.Collapsed;
                break;
        }
    }

    private void NextButtonComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        string? nextButtonVisibility = e.AddedItems[0].ToString();

        switch (nextButtonVisibility)
        {
            case "Visible":
                TestPipsPager2.NextButtonVisibility = PipsPagerButtonVisibility.Visible;
                break;

            case "VisibleOnPointerOver":
                TestPipsPager2.NextButtonVisibility = PipsPagerButtonVisibility.VisibleOnPointerOver;
                break;

            case "Collapsed":
            default:
                TestPipsPager2.NextButtonVisibility = PipsPagerButtonVisibility.Collapsed;
                break;
        }
    }
}

```

## 示例文件

### PipspagerIntegratedFlipview.txt
```
--- header
PipsPager integrated with a FlipView
--- xaml
<StackPanel>
    <FlipView x:Name="Gallery" MaxWidth="400" Height="270" ItemsSource="{x:Bind Pictures}">
        <FlipView.ItemTemplate>
            <DataTemplate x:DataType="x:String">
                <Image Source="{x:Bind Mode=OneTime}" />
            </DataTemplate>
        </FlipView.ItemTemplate>
    </FlipView>
    <PipsPager x:Name="FlipViewPipsPager"
        HorizontalAlignment="Center"
        Margin="0, 12, 0, 0"
        NumberOfPages="{x:Bind Pictures.Count}"
        SelectedPageIndex="{x:Bind Path=Gallery.SelectedIndex, Mode=TwoWay}" />
</StackPanel>
```

### PipspagerOptionsChangeOrientation.txt
```
--- header
PipsPager with options to change its orientation and button visibility.
--- xaml
<PipsPager
    Orientation="$(Orientation)"
    PreviousButtonVisibility="$(PrevButton)"
    NextButtonVisibility="$(NextButton)" />
```


# ScrollView

## 主页面 XAML (ScrollViewPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.ScrollViewPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="ScrollView\ContentInsideScrollview.txt">
            <StackPanel Spacing="16">
                <TextBlock
                    Text="This ScrollView allows horizontal and vertical scrolling, as well as zooming. Change the settings on the right to alter those capabilities or the built-in scrollbars' visibility."
                    TextWrapping="Wrap" />

                <ScrollView
                    x:Name="scrollView1"
                    Width="400"
                    Height="266"
                    HorizontalAlignment="Left"
                    VerticalAlignment="Top"
                    ContentOrientation="None"
                    IsTabStop="True"
                    ZoomMode="Enabled">
                    <Image
                        HorizontalAlignment="Center"
                        VerticalAlignment="Center"
                        AutomationProperties.Name="cliff"
                        Source="ms-appx:///Assets/SampleMedia/cliff.jpg"
                        Stretch="Uniform" />
                </ScrollView>
            </StackPanel>

            <controls:ControlExample.Options>
                <Grid
                    MinWidth="200"
                    ColumnDefinitions="Auto, *"
                    ColumnSpacing="12"
                    RowDefinitions="Auto, Auto, Auto, Auto, Auto, Auto, Auto, Auto"
                    RowSpacing="16">

                    <TextBlock VerticalAlignment="Center" Text="ZoomMode" />

                    <ComboBox
                        x:Name="cmbZoomMode"
                        Grid.Column="1"
                        HorizontalAlignment="Stretch"
                        AutomationProperties.Name="zoom mode"
                        SelectedIndex="0"
                        SelectionChanged="CmbZoomMode_SelectionChanged">
                        <ComboBoxItem>Enabled</ComboBoxItem>
                        <ComboBoxItem>Disabled</ComboBoxItem>
                    </ComboBox>

                    <TextBlock
                        Grid.Row="1"
                        VerticalAlignment="Center"
                        Text="ZoomFactor" />

                    <NumberBox
                        x:Name="nbZoomFactor"
                        Grid.Row="1"
                        Grid.Column="1"
                        AutomationProperties.Name="zoom factor"
                        LargeChange="10"
                        Maximum="10"
                        Minimum="0.1"
                        SmallChange="1"
                        SpinButtonPlacementMode="Inline"
                        ValueChanged="NbZoomFactor_ValueChanged"
                        Value="4" />

                    <TextBlock
                        Grid.Row="2"
                        Grid.ColumnSpan="2"
                        HorizontalAlignment="Center"
                        Text="ScrollMode" />

                    <TextBlock
                        Grid.Row="3"
                        VerticalAlignment="Center"
                        Text="Horizontal" />

                    <ComboBox
                        x:Name="cmbHorizontalScrollMode"
                        Grid.Row="3"
                        Grid.Column="1"
                        HorizontalAlignment="Stretch"
                        AutomationProperties.Name="horizontal scroll mode"
                        SelectedIndex="2"
                        SelectionChanged="CmbHorizontalScrollMode_SelectionChanged">
                        <ComboBoxItem>Enabled</ComboBoxItem>
                        <ComboBoxItem>Disabled</ComboBoxItem>
                        <ComboBoxItem>Auto</ComboBoxItem>
                    </ComboBox>

                    <TextBlock
                        Grid.Row="4"
                        VerticalAlignment="Center"
                        Text="Vertical" />

                    <ComboBox
                        x:Name="cmbVerticalScrollMode"
                        Grid.Row="4"
                        Grid.Column="1"
                        HorizontalAlignment="Stretch"
                        AutomationProperties.Name="vertical scroll mode"
                        SelectedIndex="2"
                        SelectionChanged="CmbVerticalScrollMode_SelectionChanged">
                        <ComboBoxItem>Enabled</ComboBoxItem>
                        <ComboBoxItem>Disabled</ComboBoxItem>
                        <ComboBoxItem>Auto</ComboBoxItem>
                    </ComboBox>

                    <TextBlock
                        Grid.Row="5"
                        Grid.ColumnSpan="2"
                        HorizontalAlignment="Center"
                        Text="ScrollbarVisibility" />

                    <TextBlock
                        Grid.Row="6"
                        VerticalAlignment="Center"
                        Text="Horizontal" />

                    <ComboBox
                        x:Name="cmbHorizontalScrollBarVisibility"
                        Grid.Row="6"
                        Grid.Column="1"
                        HorizontalAlignment="Stretch"
                        AutomationProperties.Name="horizontal scroll bar visibility"
                        SelectedIndex="0"
                        SelectionChanged="CmbHorizontalScrollBarVisibility_SelectionChanged">
                        <ComboBoxItem>Auto</ComboBoxItem>
                        <ComboBoxItem>Visible</ComboBoxItem>
                        <ComboBoxItem>Hidden</ComboBoxItem>
                    </ComboBox>

                    <TextBlock
                        Grid.Row="7"
                        VerticalAlignment="Center"
                        Text="Vertical" />

                    <ComboBox
                        x:Name="cmbVerticalScrollBarVisibility"
                        Grid.Row="7"
                        Grid.Column="1"
                        HorizontalAlignment="Stretch"
                        AutomationProperties.Name="vertical scroll bar visibility"
                        SelectedIndex="0"
                        SelectionChanged="CmbVerticalScrollBarVisibility_SelectionChanged">
                        <ComboBoxItem>Auto</ComboBoxItem>
                        <ComboBoxItem>Visible</ComboBoxItem>
                        <ComboBoxItem>Hidden</ComboBoxItem>
                    </ComboBox>
                </Grid>
            </controls:ControlExample.Options>


            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="ZoomMode" Value="{x:Bind ((ComboBoxItem)cmbZoomMode.SelectedItem).Content, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="HorizontalScrollMode" Value="{x:Bind ((ComboBoxItem)cmbHorizontalScrollMode.SelectedItem).Content, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="HorizontalScrollBarVisibility" Value="{x:Bind ((ComboBoxItem)cmbHorizontalScrollBarVisibility.SelectedItem).Content, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="VerticalScrollMode" Value="{x:Bind ((ComboBoxItem)cmbVerticalScrollMode.SelectedItem).Content, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="VerticalScrollBarVisibility" Value="{x:Bind ((ComboBoxItem)cmbVerticalScrollBarVisibility.SelectedItem).Content, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample x:Name="Example2" SampleDefinition="ScrollView\ScrollViewConstantVelocityScrolling.txt">
            <StackPanel Spacing="16">
                <TextBlock
                    Text="Set the vertical velocity to a value greater than 30 to scroll down, or a value smaller than -30 to scroll up at a constant speed."
                    TextWrapping="Wrap" />

                <ScrollView
                    x:Name="scrollView2"
                    Width="400"
                    Height="300"
                    HorizontalAlignment="Left"
                    VerticalAlignment="Top"
                    IsTabStop="True">
                    <StackPanel>
                        <Image
                            AutomationProperties.Name="grapes"
                            Source="ms-appx:///Assets/SampleMedia/grapes.jpg"
                            Stretch="Uniform" />
                        <Image
                            AutomationProperties.Name="rainier"
                            Source="ms-appx:///Assets/SampleMedia/rainier.jpg"
                            Stretch="Uniform" />
                        <Image
                            AutomationProperties.Name="sunset"
                            Source="ms-appx:///Assets/SampleMedia/sunset.jpg"
                            Stretch="Uniform" />
                        <Image
                            AutomationProperties.Name="treetops"
                            Source="ms-appx:///Assets/SampleMedia/treetops.jpg"
                            Stretch="Uniform" />
                        <Image
                            AutomationProperties.Name="valley"
                            Source="ms-appx:///Assets/SampleMedia/valley.jpg"
                            Stretch="Uniform" />
                        <Image
                            AutomationProperties.Name="cliff"
                            Source="ms-appx:///Assets/SampleMedia/cliff.jpg"
                            Stretch="Uniform" />
                    </StackPanel>
                </ScrollView>
            </StackPanel>

            <controls:ControlExample.Options>
                <Grid
                    MinWidth="200"
                    ColumnDefinitions="Auto, *"
                    ColumnSpacing="12"
                    RowDefinitions="Auto"
                    RowSpacing="16">
                    <TextBlock VerticalAlignment="Center" Text="Vertical velocity" />

                    <NumberBox
                        x:Name="nbVerticalVelocity"
                        Grid.Column="1"
                        AutomationProperties.Name="vertical velocity"
                        LargeChange="30"
                        Maximum="200"
                        Minimum="-200"
                        SmallChange="10"
                        SpinButtonPlacementMode="Inline"
                        ValueChanged="NbVerticalVelocity_ValueChanged"
                        Value="30" />
                </Grid>
            </controls:ControlExample.Options>

        </controls:ControlExample>

        <controls:ControlExample x:Name="Example3" SampleDefinition="ScrollView\ScrollViewProgrammaticScrollCustomAnimation.txt">
            <StackPanel Spacing="16">
                <TextBlock
                    Text="Pick an animation type and its duration and then click the button on the right to launch a programmatic scroll."
                    TextWrapping="Wrap" />

                <ScrollView
                    x:Name="scrollView3"
                    Width="400"
                    Height="300"
                    HorizontalAlignment="Left"
                    VerticalAlignment="Top"
                    IsTabStop="True"
                    ScrollAnimationStarting="ScrollView_ScrollAnimationStarting">
                    <StackPanel>
                        <Image
                            AutomationProperties.Name="leaves"
                            Source="ms-appx:///Assets/SampleMedia/LandscapeImage1.jpg"
                            Stretch="Uniform" />
                        <Image
                            AutomationProperties.Name="carousel"
                            Source="ms-appx:///Assets/SampleMedia/LandscapeImage2.jpg"
                            Stretch="Uniform" />
                        <Image
                            AutomationProperties.Name="bicycles"
                            Source="ms-appx:///Assets/SampleMedia/LandscapeImage3.jpg"
                            Stretch="Uniform" />
                        <Image
                            AutomationProperties.Name="pond"
                            Source="ms-appx:///Assets/SampleMedia/LandscapeImage4.jpg"
                            Stretch="Uniform" />
                        <Image
                            AutomationProperties.Name="marina"
                            Source="ms-appx:///Assets/SampleMedia/LandscapeImage5.jpg"
                            Stretch="Uniform" />
                        <Image
                            AutomationProperties.Name="beach"
                            Source="ms-appx:///Assets/SampleMedia/LandscapeImage6.jpg"
                            Stretch="Uniform" />
                        <Image
                            AutomationProperties.Name="rampart"
                            Source="ms-appx:///Assets/SampleMedia/LandscapeImage7.jpg"
                            Stretch="Uniform" />
                        <Image
                            AutomationProperties.Name="mountain"
                            Source="ms-appx:///Assets/SampleMedia/LandscapeImage8.jpg"
                            Stretch="Uniform" />
                    </StackPanel>
                </ScrollView>
            </StackPanel>

            <controls:ControlExample.Options>
                <Grid
                    MinWidth="320"
                    ColumnDefinitions="Auto,*"
                    ColumnSpacing="12"
                    RowDefinitions="Auto, Auto, Auto"
                    RowSpacing="16">
                    <TextBlock VerticalAlignment="Center" Text="Scroll with animation" />

                    <ComboBox
                        x:Name="cmbVerticalAnimation"
                        Grid.Column="1"
                        HorizontalAlignment="Stretch"
                        AutomationProperties.Name="vertical animation options"
                        SelectedIndex="0"
                        SelectionChanged="cmbVerticalAnimation_SelectionChanged">
                        <ComboBoxItem>Default</ComboBoxItem>
                        <ComboBoxItem>Accordion</ComboBoxItem>
                        <ComboBoxItem>Teleportation</ComboBoxItem>
                    </ComboBox>

                    <TextBlock
                        Grid.Row="1"
                        VerticalAlignment="Center"
                        Text="Animation duration (msec)" />

                    <NumberBox
                        x:Name="nbAnimationDuration"
                        Grid.Row="1"
                        Grid.Column="1"
                        AutomationProperties.Name="animation duration"
                        LargeChange="1000"
                        Maximum="5000"
                        Minimum="1000"
                        SmallChange="500"
                        SpinButtonPlacementMode="Inline"
                        ValueChanged="nbAnimationDuration_ValueChanged"
                        Value="1500" />

                    <Button
                        x:Name="btnScrollWithAnimation"
                        Grid.Row="2"
                        Grid.ColumnSpan="2"
                        HorizontalAlignment="Stretch"
                        AutomationProperties.Name="scroll with animation"
                        Click="BtnScrollWithAnimation_Click"
                        Content="Scroll with animation" />
                </Grid>
            </controls:ControlExample.Options>

        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (ScrollViewPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Composition;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using System;
using System.Collections.Generic;
using System.IO;
using System.Numerics;
using Windows.Globalization.NumberFormatting;
using WinUIGallery.Helpers;

namespace WinUIGallery.ControlPages;

public sealed partial class ScrollViewPage : Page
{
    // Cache for storing Example3 C# sample code content
    private readonly Dictionary<string, string> _example3CodeCache = new();

    public ScrollViewPage()
    {
        this.InitializeComponent();

        this.Loaded += ScrollViewPage_Loaded;
    }

    // Example1
    private void ScrollViewPage_Loaded(object sender, RoutedEventArgs e)
    {
        scrollView1.ZoomTo(4.0f, null, new ScrollingZoomOptions(ScrollingAnimationMode.Enabled, ScrollingSnapPointsMode.Ignore));

        IncrementNumberRounder rounder = new IncrementNumberRounder
        {
            Increment = 0.1,
            RoundingAlgorithm = RoundingAlgorithm.RoundHalfUp
        };

        DecimalFormatter formatter = new DecimalFormatter
        {
            IntegerDigits = 2,
            FractionDigits = 1,
            NumberRounder = rounder
        };
        nbZoomFactor.NumberFormatter = formatter;

        this.Loaded -= ScrollViewPage_Loaded;
    }

    private void CmbZoomMode_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (scrollView1 != null)
        {
            if (sender is ComboBox cmb)
            {
                scrollView1.ZoomMode = (ScrollingZoomMode)cmb.SelectedIndex;
            }
        }
    }

    private void NbZoomFactor_ValueChanged(NumberBox sender, NumberBoxValueChangedEventArgs e)
    {
        if (scrollView1 != null)
        {
            scrollView1.ZoomTo((float)e.NewValue, null);
        }
    }

    private void CmbHorizontalScrollMode_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (scrollView1 != null)
        {
            if (sender is ComboBox cmb)
            {
                scrollView1.HorizontalScrollMode = (ScrollingScrollMode)cmb.SelectedIndex;
            }
        }
    }

    private void CmbHorizontalScrollBarVisibility_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (scrollView1 != null)
        {
            if (sender is ComboBox cmb)
            {
                scrollView1.HorizontalScrollBarVisibility = (ScrollingScrollBarVisibility)cmb.SelectedIndex;
            }
        }
    }

    private void CmbVerticalScrollMode_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (scrollView1 != null)
        {
            if (sender is ComboBox cmb)
            {
                scrollView1.VerticalScrollMode = (ScrollingScrollMode)cmb.SelectedIndex;
            }
        }
    }

    private void CmbVerticalScrollBarVisibility_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (scrollView1 != null)
        {
            if (sender is ComboBox cmb)
            {
                scrollView1.VerticalScrollBarVisibility = (ScrollingScrollBarVisibility)cmb.SelectedIndex;
            }
        }
    }

    // Example2
    private void NbVerticalVelocity_ValueChanged(NumberBox sender, NumberBoxValueChangedEventArgs e)
    {
        if (double.IsNaN(e.OldValue))
        {
            return;
        }

        if (scrollView2 != null)
        {
            // Cancel previous constant scroll velocity
            scrollView2.ScrollBy(
                0, 0,
                new ScrollingScrollOptions(ScrollingAnimationMode.Disabled, ScrollingSnapPointsMode.Ignore));

            float verticalConstantVelocity = (float)nbVerticalVelocity.Value;

            if (e.NewValue <= 30.0 && e.NewValue >= -30)
            {
                // Only value smaller than -30 or greater than 30 trigger a scroll
                if (e.NewValue < e.OldValue)
                {
                    if (scrollView2.VerticalOffset == 0)
                    {
                        verticalConstantVelocity = 30;
                    }
                    else
                    {
                        verticalConstantVelocity = -30;
                    }
                }
                else
                {
                    if (scrollView2.VerticalOffset == scrollView2.ScrollableHeight)
                    {
                        verticalConstantVelocity = -30;
                    }
                    else
                    {
                        verticalConstantVelocity = 30;
                    }
                }
            }
            else if (e.NewValue < 30.0 && scrollView2.VerticalOffset == 0)
            {
                verticalConstantVelocity = 30;
            }
            else if (e.NewValue > 30.0 && scrollView2.VerticalOffset == scrollView2.ScrollableHeight)
            {
                verticalConstantVelocity = -30;
            }

            nbVerticalVelocity.Value = verticalConstantVelocity;

            scrollView2.AddScrollVelocity(
                new Vector2(0f, verticalConstantVelocity),
                new Vector2() /*empty inertia decay rate for a constant velocity*/);
        }
    }

    // Example3
    private void BtnScrollWithAnimation_Click(object sender, RoutedEventArgs e)
    {
        if (scrollView3 != null)
        {
            scrollView3.ScrollTo(scrollView3.HorizontalOffset, GetTargetVerticalOffset(), new ScrollingScrollOptions(ScrollingAnimationMode.Enabled, ScrollingSnapPointsMode.Ignore));
        }
    }

    private void ScrollView_ScrollAnimationStarting(ScrollView sender, ScrollingScrollAnimationStartingEventArgs e)
    {
        Vector3KeyFrameAnimation? stockKeyFrameAnimation = e.Animation as Vector3KeyFrameAnimation;

        if (stockKeyFrameAnimation != null)
        {
            if (cmbVerticalAnimation.SelectedIndex == 0)
            {
                stockKeyFrameAnimation.Duration = TimeSpan.FromMilliseconds(nbAnimationDuration.Value);
            }
            else
            {
                double targetVerticalOffset = GetTargetVerticalOffset();
                float targetVerticalPosition = (float)targetVerticalOffset;
                Vector3KeyFrameAnimation customKeyFrameAnimation = stockKeyFrameAnimation.Compositor.CreateVector3KeyFrameAnimation();

                if (cmbVerticalAnimation.SelectedIndex == 1)
                {
                    // Accordion case
                    float deltaVerticalPosition = 0.1f * (float)(targetVerticalOffset - scrollView3.VerticalOffset);

                    for (int step = 0; step < 3; step++)
                    {
                        customKeyFrameAnimation.InsertKeyFrame(
                            1.0f - (0.4f / (float)Math.Pow(2, step)),
                            new Vector3((float)scrollView3.HorizontalOffset, targetVerticalPosition + deltaVerticalPosition, 0.0f));
                        deltaVerticalPosition /= -2.0f;
                    }

                    customKeyFrameAnimation.InsertKeyFrame(1.0f, new Vector3((float)scrollView3.HorizontalOffset, targetVerticalPosition, 0.0f));
                }
                else
                {
                    // Teleportation case
                    float deltaVerticalPosition = (float)(targetVerticalOffset - scrollView3.VerticalOffset);

                    CubicBezierEasingFunction cubicBezierStart = stockKeyFrameAnimation.Compositor.CreateCubicBezierEasingFunction(
                        new Vector2(1.0f, 0.0f),
                        new Vector2(1.0f, 0.0f));

                    StepEasingFunction step = stockKeyFrameAnimation.Compositor.CreateStepEasingFunction(1);

                    CubicBezierEasingFunction cubicBezierEnd = stockKeyFrameAnimation.Compositor.CreateCubicBezierEasingFunction(
                        new Vector2(0.0f, 1.0f),
                        new Vector2(0.0f, 1.0f));

                    customKeyFrameAnimation.InsertKeyFrame(
                        0.499999f,
                        new Vector3((float)scrollView3.HorizontalOffset, targetVerticalPosition - 0.9f * deltaVerticalPosition, 0.0f),
                        cubicBezierStart);
                    customKeyFrameAnimation.InsertKeyFrame(
                        0.5f,
                        new Vector3((float)scrollView3.HorizontalOffset, targetVerticalPosition - 0.1f * deltaVerticalPosition, 0.0f),
                        step);
                    customKeyFrameAnimation.InsertKeyFrame(
                        1.0f,
                        new Vector3((float)scrollView3.HorizontalOffset, targetVerticalPosition, 0.0f),
                        cubicBezierEnd);
                }

                customKeyFrameAnimation.Duration = TimeSpan.FromMilliseconds(nbAnimationDuration.Value);
                e.Animation = customKeyFrameAnimation;
            }
        }
    }

    private double GetTargetVerticalOffset()
    {
        if (scrollView3.VerticalOffset > scrollView3.ScrollableHeight / 2.0)
        {
            return scrollView3.ScrollableHeight / 5.0;
        }
        else
        {
            return 4.0 * scrollView3.ScrollableHeight / 5.0;
        }
    }

    private void cmbVerticalAnimation_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        UpdateExample3Content();
    }

    private void nbAnimationDuration_ValueChanged(NumberBox sender, NumberBoxValueChangedEventArgs args)
    {
        UpdateExample3Content();
    }

    private void UpdateExample3Content()
    {
        string? sampleCodeFileName = null;

        switch (cmbVerticalAnimation.SelectedIndex)
        {
            case 0:
                sampleCodeFileName = "ScrollViewSample3_DefaultAnimation_cs";
                break;
            case 1:
                sampleCodeFileName = "ScrollViewSample3_AccordionAnimation_cs";
                break;
            case 2:
                sampleCodeFileName = "ScrollViewSample3_TeleportationAnimation_cs";
                break;
            default:
                sampleCodeFileName = null;
                break;
        }

        if (sampleCodeFileName != null)
        {
            Example3.CSharp = GetExample3CodeContent(sampleCodeFileName);

            if (nbAnimationDuration != null)
            {
                Example3.CSharp = Example3.CSharp.Replace("nbAnimationDuration.Value", nbAnimationDuration.Value.ToString());
            }
        }
    }

    // Method to get sample code content (with caching)
    private string GetExample3CodeContent(string sampleCodeFileName)
    {
        if (!_example3CodeCache.TryGetValue(sampleCodeFileName, out var content))
        {
            string folderPath = AppContext.BaseDirectory;
            if (NativeMethods.IsAppPackaged)
            {
                folderPath = Windows.ApplicationModel.Package.Current.InstalledLocation.Path;
            }
            string filePath = Path.Combine(folderPath, "Samples", "SampleCode", "ScrollView", $"{sampleCodeFileName}.txt");
            if (File.Exists(filePath))
            {
                content = File.ReadAllText(filePath);
                _example3CodeCache[sampleCodeFileName] = content; // Cache the content
            }
        }
        return content ?? string.Empty;
    }
}

```

## 示例文件

### ContentInsideScrollview.txt
```
--- header
Content inside of a ScrollView.
--- xaml
<ScrollView Height="266" Width="400" ContentOrientation="None"
    ZoomMode="$(ZoomMode)" IsTabStop="True"
    VerticalAlignment="Top" HorizontalAlignment="Left"
    HorizontalScrollMode="$(HorizontalScrollMode)" HorizontalScrollBarVisibility="$(HorizontalScrollBarVisibility)"
    VerticalScrollMode="$(VerticalScrollMode)" VerticalScrollBarVisibility="$(VerticalScrollBarVisibility)">
    <Image Source="ms-appx:///Assets/SampleMedia/cliff.jpg" AutomationProperties.Name="cliff" Stretch="None"
        HorizontalAlignment="Center" VerticalAlignment="Center"/>
</ScrollView>
```

### ScrollViewConstantVelocityScrolling.txt
```
--- header
Constant velocity scrolling.
--- xaml
<ScrollView Height="300" Width="400" IsTabStop="True"
    VerticalAlignment="Top" HorizontalAlignment="Left">
    <Image Source="ms-appx:///Assets/SampleMedia/grapes.jpg" Stretch="Uniform" AutomationProperties.Name="grapes"/>
    <Image Source="ms-appx:///Assets/SampleMedia/rainier.jpg" Stretch="Uniform" AutomationProperties.Name="rainier"/>
    <Image Source="ms-appx:///Assets/SampleMedia/sunset.jpg" Stretch="Uniform" AutomationProperties.Name="sunset"/>
    <Image Source="ms-appx:///Assets/SampleMedia/treetops.jpg" Stretch="Uniform" AutomationProperties.Name="treetops"/>
    <Image Source="ms-appx:///Assets/SampleMedia/valley.jpg" Stretch="Uniform" AutomationProperties.Name="valley"/>
    <Image Source="ms-appx:///Assets/SampleMedia/cliff.jpg" Stretch="Uniform" AutomationProperties.Name="cliff"/>
</ScrollView>
```

### ScrollViewProgrammaticScrollCustomAnimation.txt
```
--- header
Programmatic scroll with custom animation.
--- xaml
<ScrollView Height="300" Width="400" IsTabStop="True"
    ScrollAnimationStarting="ScrollView_ScrollAnimationStarting"
    VerticalAlignment="Top" HorizontalAlignment="Left">
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage1.jpg" Stretch="Uniform" AutomationProperties.Name="leaves"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage2.jpg" Stretch="Uniform" AutomationProperties.Name="carousel"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage3.jpg" Stretch="Uniform" AutomationProperties.Name="bicycles"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage4.jpg" Stretch="Uniform" AutomationProperties.Name="pond"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage5.jpg" Stretch="Uniform" AutomationProperties.Name="marina"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage6.jpg" Stretch="Uniform" AutomationProperties.Name="beach"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage7.jpg" Stretch="Uniform" AutomationProperties.Name="rampart"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage8.jpg" Stretch="Uniform" AutomationProperties.Name="mountain"/>
</ScrollView>
```


# ScrollViewer

## 主页面 XAML (ScrollViewerPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.ScrollViewerPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="ScrollViewer\ContentInsideScrollviewer.txt">

            <!--
                There's a known issue with zooming where we get into a layout cycle if we specify a height but not a width.
                As a workaround for now, set an explicit height/width to match the natural size of the image.
            -->
            <ScrollViewer
                x:Name="ScrollViewerControl"
                Width="400"
                Height="266"
                HorizontalAlignment="Left"
                VerticalAlignment="Top"
                IsTabStop="True"
                IsVerticalScrollChainingEnabled="True"
                ViewChanged="ScrollViewerControl_ViewChanged"
                ZoomMode="Enabled">
                <Image
                    HorizontalAlignment="Left"
                    VerticalAlignment="Top"
                    AutomationProperties.Name="cliff"
                    Source="ms-appx:///Assets/SampleMedia/cliff.jpg"
                    Stretch="None" />
            </ScrollViewer>

            <controls:ControlExample.Options>
                <Grid
                    MinWidth="200"
                    ColumnDefinitions="Auto, *"
                    RowDefinitions="Auto, Auto, Auto, Auto, Auto, Auto, Auto, Auto">

                    <TextBlock
                        Margin="0,0,10,0"
                        VerticalAlignment="Center"
                        Text="ZoomMode" />

                    <ComboBox
                        x:Name="zoomCombo"
                        Grid.Column="1"
                        HorizontalAlignment="Stretch"
                        AutomationProperties.Name="zoom mode"
                        SelectedIndex="1"
                        SelectionChanged="ZoomModeComboBox_SelectionChanged">
                        <ComboBoxItem>Disabled</ComboBoxItem>
                        <ComboBoxItem>Enabled</ComboBoxItem>
                    </ComboBox>

                    <Slider
                        x:Name="ZoomSlider"
                        Grid.Row="1"
                        Grid.ColumnSpan="2"
                        Margin="0,10,0,0"
                        Header="Zoom"
                        IsEnabled="True"
                        Maximum="{x:Bind ScrollViewerControl.MaxZoomFactor, Mode=OneWay}"
                        Minimum="{x:Bind ScrollViewerControl.MinZoomFactor, Mode=OneWay}"
                        ValueChanged="ZoomSlider_ValueChanged"
                        Value="4" />

                    <TextBlock
                        Grid.Row="2"
                        Grid.ColumnSpan="2"
                        Margin="0,12"
                        HorizontalAlignment="Center"
                        Text="ScrollMode" />

                    <TextBlock
                        Grid.Row="3"
                        Margin="0,0,10,0"
                        VerticalAlignment="Center"
                        Text="Horizontal" />

                    <ComboBox
                        x:Name="hsmCombo"
                        Grid.Row="3"
                        Grid.Column="1"
                        HorizontalAlignment="Stretch"
                        AutomationProperties.Name="horizontal scroll mode"
                        SelectedIndex="1"
                        SelectionChanged="hsmCombo_SelectionChanged">
                        <ComboBoxItem>Disabled</ComboBoxItem>
                        <ComboBoxItem>Enabled</ComboBoxItem>
                        <ComboBoxItem>Auto</ComboBoxItem>
                    </ComboBox>

                    <TextBlock
                        Grid.Row="4"
                        Margin="0,8,10,0"
                        VerticalAlignment="Center"
                        Text="Vertical" />

                    <ComboBox
                        x:Name="vsmCombo"
                        Grid.Row="4"
                        Grid.Column="1"
                        Margin="0,8,0,0"
                        HorizontalAlignment="Stretch"
                        AutomationProperties.Name="vertical scroll mode"
                        SelectedIndex="1"
                        SelectionChanged="vsmCombo_SelectionChanged">
                        <ComboBoxItem>Disabled</ComboBoxItem>
                        <ComboBoxItem>Enabled</ComboBoxItem>
                        <ComboBoxItem>Auto</ComboBoxItem>
                    </ComboBox>

                    <TextBlock
                        Grid.Row="5"
                        Grid.ColumnSpan="2"
                        Margin="0,20,0,12"
                        HorizontalAlignment="Center"
                        Text="ScrollbarVisibility" />

                    <TextBlock
                        Grid.Row="6"
                        Margin="0,0,10,0"
                        VerticalAlignment="Center"
                        Text="Horizontal" />

                    <ComboBox
                        x:Name="hsbvCombo"
                        Grid.Row="6"
                        Grid.Column="1"
                        HorizontalAlignment="Stretch"
                        AutomationProperties.Name="horizontal scroll bar visibility"
                        SelectedIndex="1"
                        SelectionChanged="hsbvCombo_SelectionChanged">
                        <ComboBoxItem>Disabled</ComboBoxItem>
                        <ComboBoxItem>Auto</ComboBoxItem>
                        <ComboBoxItem>Hidden</ComboBoxItem>
                        <ComboBoxItem>Visible</ComboBoxItem>
                    </ComboBox>

                    <TextBlock
                        Grid.Row="7"
                        Margin="0,8,10,0"
                        VerticalAlignment="Center"
                        Text="Vertical" />

                    <ComboBox
                        x:Name="vsbvCombo"
                        Grid.Row="7"
                        Grid.Column="1"
                        Margin="0,8,0,0"
                        HorizontalAlignment="Stretch"
                        AutomationProperties.Name="vertical scroll bar visibility"
                        SelectedIndex="1"
                        SelectionChanged="vsbvCombo_SelectionChanged">
                        <ComboBoxItem>Disabled</ComboBoxItem>
                        <ComboBoxItem>Auto</ComboBoxItem>
                        <ComboBoxItem>Hidden</ComboBoxItem>
                        <ComboBoxItem>Visible</ComboBoxItem>
                    </ComboBox>
                </Grid>
            </controls:ControlExample.Options>


            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="ZoomMode" Value="{x:Bind ((ComboBoxItem)zoomCombo.SelectedItem).Content, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="HorizontalScrollMode" Value="{x:Bind ((ComboBoxItem)hsmCombo.SelectedItem).Content, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="HorizontalScrollBarVisibility" Value="{x:Bind ((ComboBoxItem)hsbvCombo.SelectedItem).Content, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="VerticalScrollMode" Value="{x:Bind ((ComboBoxItem)vsmCombo.SelectedItem).Content, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="VerticalScrollBarVisibility" Value="{x:Bind ((ComboBoxItem)vsbvCombo.SelectedItem).Content, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (ScrollViewerPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Controls.Primitives;
using Microsoft.UI.Xaml.Input;

namespace WinUIGallery.ControlPages;

public sealed partial class ScrollViewerPage : Page
{
    public ScrollViewerPage()
    {
        this.InitializeComponent();
        ScrollViewerControl.ZoomToFactor(4.0f);
    }

    private void ZoomModeComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (ScrollViewerControl != null && ZoomSlider != null)
        {
            if (sender is ComboBox cb)
            {
                ScrollViewerControl.ZoomMode = (ZoomMode)cb.SelectedIndex;
                ZoomSlider.IsEnabled = cb.SelectedIndex == 1;

                if (!ZoomSlider.IsEnabled)
                {
                    ScrollViewerControl.ZoomToFactor(2.0f);
                }
            }
        }
    }

    private void ZoomSlider_ValueChanged(object sender, RangeBaseValueChangedEventArgs e)
    {
        if (ScrollViewerControl != null)
        {
            ScrollViewerControl.ChangeView(null, null, (float)e.NewValue);
        }
    }

    private void hsmCombo_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (ScrollViewerControl != null)
        {
            if (sender is ComboBox cb)
            {
                ScrollViewerControl.HorizontalScrollMode = (ScrollMode)cb.SelectedIndex;
            }
        }
    }

    private void hsbvCombo_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (ScrollViewerControl != null)
        {
            if (sender is ComboBox cb)
            {
                ScrollViewerControl.HorizontalScrollBarVisibility = (ScrollBarVisibility)cb.SelectedIndex;
            }
        }
    }

    private void vsmCombo_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (ScrollViewerControl != null)
        {
            if (sender is ComboBox cb)
            {
                ScrollViewerControl.VerticalScrollMode = (ScrollMode)cb.SelectedIndex;
            }
        }
    }

    private void vsbvCombo_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (ScrollViewerControl != null)
        {
            if (sender is ComboBox cb)
            {
                ScrollViewerControl.VerticalScrollBarVisibility = (ScrollBarVisibility)cb.SelectedIndex;
            }
        }
    }

    private void ScrollViewerControl_ManipulationCompleted(object sender, ManipulationCompletedRoutedEventArgs e)
    {
        ZoomSlider.Value = ScrollViewerControl.ZoomFactor;
    }

    private void ScrollViewerControl_ViewChanged(object sender, ScrollViewerViewChangedEventArgs e)
    {
        if (!e.IsIntermediate)
        {
            ZoomSlider.Value = ScrollViewerControl.ZoomFactor;
        }
    }
}

```

## 示例文件

### ContentInsideScrollviewer.txt
```
--- header
Content inside of a ScrollViewer.
--- xaml
<ScrollViewer Height="266" Width="400" ZoomMode="$(ZoomMode)"
            IsTabStop="True" IsVerticalScrollChainingEnabled="True"
            HorizontalAlignment="Left" VerticalAlignment="Top"
            ViewChanged="ScrollViewerControl_ViewChanged"
            HorizontalScrollMode="$(HorizontalScrollMode)" HorizontalScrollBarVisibility="$(HorizontalScrollBarVisibility)"
            VerticalScrollMode="$(VerticalScrollMode)" VerticalScrollBarVisibility="$(VerticalScrollBarVisibility)">
    <Image Source="ms-appx:///Assets/SampleMedia/cliff.jpg" AutomationProperties.Name="cliff" Stretch="None"
           HorizontalAlignment="Left" VerticalAlignment="Top"/>
</ScrollViewer>
```


# SemanticZoom

## 主页面 XAML (SemanticZoomPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.SemanticZoomPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:models="using:WinUIGallery.Models"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:wuxdata="using:Microsoft.UI.Xaml.Data"
    mc:Ignorable="d">
    <Page.Resources>
        <CollectionViewSource
            x:Name="cvsGroups"
            d:Source="{Binding Groups, Source={d:DesignData Source=/SampleSupport/Data/ControlInfoData.json, Type=models:ControlInfoDataSource}}"
            IsSourceGrouped="True"
            ItemsPath="Items"
            Source="{x:Bind Groups}" />

        <DataTemplate x:Key="ZoomedInTemplate" x:DataType="models:ControlInfoDataItem">
            <StackPanel MinWidth="200" Margin="12,6,12,6">
                <TextBlock Style="{StaticResource BaseTextBlockStyle}" Text="{x:Bind Title}" />
                <TextBlock
                    Width="300"
                    HorizontalAlignment="Left"
                    Style="{StaticResource BodyTextBlockStyle}"
                    Text="{x:Bind Subtitle}"
                    TextWrapping="Wrap" />
            </StackPanel>
        </DataTemplate>

        <DataTemplate x:Key="ZoomedInGroupHeaderTemplate" x:DataType="models:ControlInfoDataGroup">
            <TextBlock
                Foreground="{ThemeResource ApplicationForegroundThemeBrush}"
                Style="{StaticResource SubtitleTextBlockStyle}"
                Text="{x:Bind Title}" />
        </DataTemplate>

        <DataTemplate x:Key="ZoomedOutTemplate" x:DataType="wuxdata:ICollectionViewGroup">
            <TextBlock
                Style="{StaticResource SubtitleTextBlockStyle}"
                Text="{x:Bind ((models:ControlInfoDataGroup)Group).Title}"
                TextWrapping="Wrap" />
        </DataTemplate>
    </Page.Resources>

    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="SemanticZoom\SimpleSemanticzoom.txt">
            <SemanticZoom x:Name="Control1" Height="500">
                <SemanticZoom.ZoomedInView>
                    <GridView
                        GotFocus="List_GotFocus"
                        ItemTemplate="{StaticResource ZoomedInTemplate}"
                        ItemsSource="{x:Bind cvsGroups.View}"
                        ScrollViewer.IsHorizontalScrollChainingEnabled="False"
                        SelectionMode="None">
                        <GridView.GroupStyle>
                            <GroupStyle HeaderTemplate="{StaticResource ZoomedInGroupHeaderTemplate}" />
                        </GridView.GroupStyle>
                    </GridView>
                </SemanticZoom.ZoomedInView>

                <SemanticZoom.ZoomedOutView>
                    <ListView
                        GotFocus="List_GotFocus"
                        ItemTemplate="{StaticResource ZoomedOutTemplate}"
                        ItemsSource="{x:Bind cvsGroups.View.CollectionGroups}"
                        SelectionMode="None" />
                </SemanticZoom.ZoomedOutView>
            </SemanticZoom>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (SemanticZoomPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Navigation;
using System.Collections.Generic;
using WinUIGallery.Helpers;
using WinUIGallery.Models;

namespace WinUIGallery.ControlPages;

public sealed partial class SemanticZoomPage : Page
{
    private IEnumerable<ControlInfoDataGroup>? _groups;

    public SemanticZoomPage()
    {
        this.InitializeComponent();
    }

    public IEnumerable<ControlInfoDataGroup>? Groups
    {
        get { return this._groups; }
    }

    protected override void OnNavigatedTo(NavigationEventArgs e)
    {
        base.OnNavigatedTo(e);

        _groups = ControlInfoDataSource.Instance.Groups;
    }

    private void List_GotFocus(object sender, RoutedEventArgs e)
    {
        Control1.StartBringIntoView();
    }
}

```

## 示例文件

### SimpleSemanticzoom.txt
```
--- header
A simple SemanticZoom
--- xaml
<SemanticZoom Height="500">
    <SemanticZoom.ZoomedInView>
        <GridView ItemsSource="{x:Bind cvsGroups.View}" SelectionMode="None"
                  ItemTemplate="{StaticResource ZoomedInTemplate}">
            <GridView.GroupStyle>
                <GroupStyle HeaderTemplate="{StaticResource ZoomedInGroupHeaderTemplate}" />
            </GridView.GroupStyle>
        </GridView>
    </SemanticZoom.ZoomedInView>

    <SemanticZoom.ZoomedOutView>
        <ListView ItemsSource="{x:Bind cvsGroups.View.CollectionGroups}" HorizontalAlignment="Stretch"
                  SelectionMode="None" ItemTemplate="{StaticResource ZoomedOutTemplate}" />
    </SemanticZoom.ZoomedOutView>
</SemanticZoom>
```



# 分组: Status & Info

---

# InfoBadge

## 主页面 XAML (InfoBadgePage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.InfoBadgePage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <StackPanel>
        <controls:ControlExample
            x:Name="Example1"
            HorizontalContentAlignment="Stretch"
            SampleDefinition="InfoBadge\InfobadgeEmbeddedNavigationview.txt">
            <controls:ControlExample.Example>
                <Grid>
                    <Grid.RowDefinitions>
                        <RowDefinition Height="Auto" />
                    </Grid.RowDefinitions>

                    <NavigationView
                        x:Name="nvSample1"
                        Height="300"
                        PaneDisplayMode="Left">
                        <NavigationView.MenuItems>
                            <NavigationViewItem Content="Home" Icon="Home" />
                            <NavigationViewItem Content="Account" Icon="Contact" />
                            <NavigationViewItem
                                x:Name="InboxPage"
                                AutomationProperties.Name="Inbox, 5 notifications"
                                Content="Inbox"
                                Icon="Mail">
                                <NavigationViewItem.InfoBadge>
                                    <InfoBadge
                                        x:Name="infoBadge1"
                                        Opacity="{x:Bind InfoBadgeOpacity, Mode=OneWay}"
                                        Value="5" />
                                </NavigationViewItem.InfoBadge>
                            </NavigationViewItem>
                        </NavigationView.MenuItems>
                        <Frame x:Name="contentFrame" />
                    </NavigationView>
                </Grid>

            </controls:ControlExample.Example>
            <controls:ControlExample.Options>
                <StackPanel Width="160">
                    <ToggleSwitch
                        x:Name="ToggleInfoBadgeOpacity"
                        Header="InfoBadge Opacity"
                        IsOn="True"
                        Toggled="ToggleInfoBadgeOpacity_Toggled" />
                    <ComboBox
                        x:Name="NavigationViewDisplayMode"
                        Header="Display Mode"
                        SelectedValue="LeftExpanded"
                        SelectionChanged="NavigationViewDisplayMode_SelectionChanged">
                        <x:String>LeftExpanded</x:String>
                        <x:String>LeftCompact</x:String>
                        <x:String>Top</x:String>
                    </ComboBox>
                </StackPanel>
            </controls:ControlExample.Options>

        </controls:ControlExample>

        <controls:ControlExample
            x:Name="Example2"
            HorizontalContentAlignment="Stretch"
            SampleDefinition="InfoBadge\DifferentInfobadgeStyles.txt">
            <controls:ControlExample.Example>
                <StackPanel
                    HorizontalAlignment="Center"
                    Spacing="20"
                    Orientation="Horizontal">
                    <InfoBadge
                        x:Name="infoBadge2"
                        HorizontalAlignment="Right"
                        Style="{StaticResource AttentionIconInfoBadgeStyle}" />
                    <InfoBadge
                        x:Name="infoBadge3"
                        HorizontalAlignment="Right"
                        Style="{StaticResource AttentionValueInfoBadgeStyle}"
                        Value="10" />
                    <InfoBadge
                        x:Name="infoBadge4"
                        VerticalAlignment="Center"
                        Style="{StaticResource AttentionDotInfoBadgeStyle}" />
                </StackPanel>

            </controls:ControlExample.Example>
            <controls:ControlExample.Options>
                <StackPanel Width="160">
                    <ComboBox
                        x:Name="InfoBadgeStyleComboBox"
                        Header="Styles"
                        SelectedValue="Attention"
                        SelectionChanged="InfoBadgeStyleComboBox_SelectionChanged">
                        <x:String>Attention</x:String>
                        <x:String>Informational</x:String>
                        <x:String>Success</x:String>
                        <x:String>Critical</x:String>
                    </ComboBox>
                </StackPanel>
            </controls:ControlExample.Options>


            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="Style" Value="{x:Bind InfoBadgeStyleComboBox.SelectedValue, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample
            x:Name="Example3"
            HorizontalContentAlignment="Stretch"
            SampleDefinition="InfoBadge\PlacingInfobadgeInsideAnother.txt">
            <controls:ControlExample.Example>
                <Button
                    x:Name="Example3Button"
                    Width="200"
                    Height="60"
                    Padding="0"
                    HorizontalAlignment="Center"
                    HorizontalContentAlignment="Stretch"
                    VerticalContentAlignment="Stretch"
                    AutomationProperties.Name="Example3Button"
                    ToolTipService.ToolTip="Refresh required">
                    <Grid
                        Width="Auto"
                        Height="Auto"
                        HorizontalAlignment="Stretch"
                        VerticalAlignment="Stretch">
                        <SymbolIcon HorizontalAlignment="Center" Symbol="Sync" />
                        <InfoBadge
                            HorizontalAlignment="Right"
                            VerticalAlignment="Top"
                            Background="#C42B1C">
                            <InfoBadge.IconSource>
                                <FontIconSource FontFamily="{StaticResource SymbolThemeFontFamily}" Glyph="&#xF13C;" />
                            </InfoBadge.IconSource>
                        </InfoBadge>
                    </Grid>
                </Button>

            </controls:ControlExample.Example>


            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="Style" Value="{x:Bind InfoBadgeStyleComboBox.SelectedValue, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample
            x:Name="Example4"
            HorizontalContentAlignment="Stretch"
            SampleDefinition="InfoBadge\InfobadgeDynamicValue.txt">
            <controls:ControlExample.Example>
                <InfoBadge x:Name="DynamicInfoBadge" HorizontalAlignment="Center" />
            </controls:ControlExample.Example>

            <controls:ControlExample.Options>
                <StackPanel Width="160">
                    <NumberBox
                        x:Name="ValueNumberBox"
                        Header="InfoBadge Value"
                        Minimum="-1"
                        SpinButtonPlacementMode="Inline"
                        ValueChanged="ValueNumberBox_ValueChanged"
                        Value="1" />
                </StackPanel>
            </controls:ControlExample.Options>

        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (InfoBadgePage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using WinUIGallery.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class InfoBadgePage : Page
{
    public InfoBadgePage()
    {
        this.InitializeComponent();
    }
    public double InfoBadgeOpacity
    {
        get { return (double)GetValue(InfoBadgeOpacityProperty); }
        set { SetValue(InfoBadgeOpacityProperty, value); }
    }

    public static readonly DependencyProperty InfoBadgeOpacityProperty =
        DependencyProperty.Register("ShadowOpacity", typeof(double), typeof(PageHeader), new PropertyMetadata(0.0));

    public void NavigationViewDisplayMode_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        string? paneDisplayMode = e.AddedItems[0].ToString();

        switch (paneDisplayMode)
        {
            case "LeftExpanded":
                nvSample1.PaneDisplayMode = Microsoft.UI.Xaml.Controls.NavigationViewPaneDisplayMode.Left;
                nvSample1.IsPaneOpen = true;
                break;

            case "LeftCompact":
                nvSample1.PaneDisplayMode = Microsoft.UI.Xaml.Controls.NavigationViewPaneDisplayMode.LeftCompact;
                nvSample1.IsPaneOpen = false;
                break;

            case "Top":
                nvSample1.PaneDisplayMode = Microsoft.UI.Xaml.Controls.NavigationViewPaneDisplayMode.Top;
                nvSample1.IsPaneOpen = true;
                break;
        }
    }

    private void ToggleInfoBadgeOpacity_Toggled(object sender, RoutedEventArgs e)
    {
        InfoBadgeOpacity = (InfoBadgeOpacity == 0.0) ? 1.0 : 0.0;
    }

    public void InfoBadgeStyleComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        string? infoBadgeStyle = e.AddedItems[0].ToString();

        switch (infoBadgeStyle)
        {
            case "Attention":
                infoBadge2.Style = Application.Current.Resources["AttentionIconInfoBadgeStyle"] as Style;
                infoBadge3.Style = Application.Current.Resources["AttentionValueInfoBadgeStyle"] as Style;
                infoBadge4.Style = Application.Current.Resources["AttentionDotInfoBadgeStyle"] as Style;
                break;

            case "Informational":
                infoBadge2.Style = Application.Current.Resources["InformationalIconInfoBadgeStyle"] as Style;
                infoBadge3.Style = Application.Current.Resources["InformationalValueInfoBadgeStyle"] as Style;
                infoBadge4.Style = Application.Current.Resources["InformationalDotInfoBadgeStyle"] as Style;
                break;

            case "Success":
                infoBadge2.Style = Application.Current.Resources["SuccessIconInfoBadgeStyle"] as Style;
                infoBadge3.Style = Application.Current.Resources["SuccessValueInfoBadgeStyle"] as Style;
                infoBadge4.Style = Application.Current.Resources["SuccessDotInfoBadgeStyle"] as Style;
                break;

            case "Critical":
                infoBadge2.Style = Application.Current.Resources["CriticalIconInfoBadgeStyle"] as Style;
                infoBadge3.Style = Application.Current.Resources["CriticalValueInfoBadgeStyle"] as Style;
                infoBadge4.Style = Application.Current.Resources["CriticalDotInfoBadgeStyle"] as Style;
                break;
        }
    }

    private void ValueNumberBox_ValueChanged(Microsoft.UI.Xaml.Controls.NumberBox sender, Microsoft.UI.Xaml.Controls.NumberBoxValueChangedEventArgs args)
    {
        if ((int)args.NewValue >= -1)
        {
            DynamicInfoBadge.Value = (int)args.NewValue;
        }
    }
}

```

## 示例文件

### DifferentInfobadgeStyles.txt
```
--- header
Different InfoBadge Styles
--- xaml
<StackPanel Orientation="Horizontal" Spacing="20" HorizontalAlignment="Center"/>
    <InfoBadge x:Name="infoBadge2" Style="{StaticResource $(Style)IconInfoBadgeStyle}" HorizontalAlignment="Right"/>
    <InfoBadge x:Name="infoBadge3" Style="{StaticResource $(Style)ValueInfoBadgeStyle}" HorizontalAlignment="Right" Value="10" />
    <InfoBadge x:Name="infoBadge4" Style="{StaticResource $(Style)DotInfoBadgeStyle}" VerticalAlignment="Center"/>
</StackPanel>
```

### InfobadgeDynamicValue.txt
```
--- header
InfoBadge with Dynamic Value
--- xaml
<InfoBadge Value="{Binding ElementName=ValueNumberBox, Path=Value, Mode=TwoWay}" />
<NumberBox x:Name="ValueNumberBox" Header="InfoBadge Value" Value="1" Minimum="-1"
    SpinButtonPlacementMode="Inline" ValueChanged="ValueNumberBox_ValueChanged" />
--- c#
private void ValueNumberBox_ValueChanged(Microsoft.UI.Xaml.Controls.NumberBox sender, Microsoft.UI.Xaml.Controls.NumberBoxValueChangedEventArgs args)
{
    if((int)args.NewValue >= -1)
    {
        DynamicInfoBadge.Value = (int)args.NewValue;
    }
}
```

### InfobadgeEmbeddedNavigationview.txt
```
--- header
InfoBadge embedded in NavigationView 
--- xaml
<NavigationViewItem x:Name="InboxPage" Content="Inbox" Icon="Mail" AutomationProperties.Name="Inbox, 5 notifications">
    <NavigationViewItem.InfoBadge>
        <InfoBadge x:Name="infoBadge1" Value="5" Opacity="{x:Bind InfoBadgeOpacity, Mode=OneWay}"/>
    </NavigationViewItem.InfoBadge>
</NavigationViewItem>
```

### PlacingInfobadgeInsideAnother.txt
```
--- header
Placing an InfoBadge Inside Another Control
--- xaml
<Button Padding="0" Width="200" Height="60" ToolTipService.ToolTip="Refresh required"
        HorizontalAlignment="Center" HorizontalContentAlignment="Stretch" VerticalContentAlignment="Stretch">
    <Grid HorizontalAlignment="Stretch" VerticalAlignment="Stretch" Width="Auto" Height="Auto">
        <SymbolIcon Symbol="Sync" HorizontalAlignment="Center"/>
        <InfoBadge Background="#C42B1C" HorizontalAlignment="Right" VerticalAlignment="Top">
            <InfoBadge.IconSource>
                <FontIconSource FontFamily="{StaticResource SymbolThemeFontFamily}" Glyph="&#xF13C;" />
            </InfoBadge.IconSource>
        </InfoBadge>
    </Grid>
</Button>
```


# InfoBar

## 主页面 XAML (InfoBarPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.InfoBarPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="InfoBar\ClosableInfobarOptionsChange.txt">
            <controls:ControlExample.Example>
                <InfoBar
                    x:Name="TestInfoBar1"
                    Title="Title"
                    IsOpen="True"
                    Message="Essential app message for your users to be informed of, acknowledge, or take action on."
                    Severity="Informational" />

            </controls:ControlExample.Example>
            <controls:ControlExample.Options>
                <StackPanel Width="150">
                    <CheckBox
                        x:Name="IsOpenCheckBox1"
                        Content="Is Open"
                        IsChecked="{x:Bind TestInfoBar1.IsOpen, Mode=TwoWay}" />
                    <ComboBox
                        x:Name="SeverityComboBox"
                        HorizontalAlignment="Stretch"
                        Header="Severity"
                        SelectedValue="Informational"
                        SelectionChanged="SeverityComboBox_SelectionChanged">
                        <x:String>Informational</x:String>
                        <x:String>Success</x:String>
                        <x:String>Warning</x:String>
                        <x:String>Error</x:String>
                    </ComboBox>
                </StackPanel>
            </controls:ControlExample.Options>

            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="Severity" Value="{x:Bind SeverityComboBox.SelectedValue, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="IsOpen" Value="{x:Bind IsOpenCheckBox1.IsChecked.Value, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example2" SampleDefinition="InfoBar\ClosableInfobarLongShort.txt">
            <controls:ControlExample.Example>
                <InfoBar
                    x:Name="TestInfoBar2"
                    Title="Title"
                    IsOpen="True" />
            </controls:ControlExample.Example>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="IsOpen" Value="{x:Bind IsOpenCheckBox2.IsChecked.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution
                    Key="DisplayMessage"
                    x:Name="DisplayMessage"
                    Value="" />
                <controls:ControlExampleSubstitution
                    Key="DisplayButton"
                    x:Name="DisplayButton"
                    Value="" />
            </controls:ControlExample.Substitutions>
            <controls:ControlExample.Options>
                <StackPanel Width="150">
                    <CheckBox
                        x:Name="IsOpenCheckBox2"
                        Content="Is Open"
                        IsChecked="{x:Bind TestInfoBar2.IsOpen, Mode=TwoWay}" />
                    <ComboBox
                        x:Name="MessageComboBox"
                        HorizontalAlignment="Stretch"
                        Header="Message Length"
                        SelectedIndex="1"
                        SelectionChanged="MessageComboBox_SelectionChanged">
                        <ComboBoxItem Content="Short" />
                        <ComboBoxItem Content="Long" />
                    </ComboBox>
                    <ComboBox
                        x:Name="ActionButtonComboBox"
                        HorizontalAlignment="Stretch"
                        Header="Action Button"
                        SelectedIndex="0"
                        SelectionChanged="ActionButtonComboBox_SelectionChanged">
                        <ComboBoxItem Content="None" />
                        <ComboBoxItem Content="Button" />
                        <ComboBoxItem Content="Hyperlink" />
                    </ComboBox>
                </StackPanel>
            </controls:ControlExample.Options>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example3" SampleDefinition="InfoBar\ClosableInfobarOptionsDisplay.txt">
            <controls:ControlExample.Example>
                <InfoBar
                    x:Name="TestInfoBar3"
                    Title="Title"
                    IsClosable="True"
                    IsIconVisible="True"
                    IsOpen="True"
                    Message="Essential app message for your users to be informed of, acknowledge, or take action on." />
            </controls:ControlExample.Example>
            <controls:ControlExample.Options>
                <StackPanel Width="150">
                    <CheckBox
                        x:Name="IsOpenCheckBox3"
                        Content="Is Open"
                        IsChecked="{x:Bind TestInfoBar3.IsOpen, Mode=TwoWay}" />
                    <CheckBox
                        x:Name="IsIconVisibleCheckBox"
                        Content="Is Icon Visible"
                        IsChecked="{x:Bind TestInfoBar3.IsIconVisible, Mode=TwoWay}" />
                    <CheckBox
                        x:Name="IsClosableCheckBox"
                        Content="Is Closable"
                        IsChecked="{x:Bind TestInfoBar3.IsClosable, Mode=TwoWay}" />
                </StackPanel>
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="IsOpen" Value="{x:Bind IsOpenCheckBox3.IsChecked.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="IsIconVisible" Value="{x:Bind IsIconVisibleCheckBox.IsChecked.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="IsClosable" Value="{x:Bind IsClosableCheckBox.IsChecked.Value, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (InfoBarPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Navigation;
using System;

namespace WinUIGallery.ControlPages;

public sealed partial class InfoBarPage : Page
{
    public InfoBarPage()
    {
        this.InitializeComponent();
    }

    protected override void OnNavigatedTo(NavigationEventArgs e)
    {
        DisplayMessage.Value = "A long essential app message...";
        DisplayButton.Value = string.Empty;
    }

    private void SeverityComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        string? severityName = e.AddedItems[0].ToString();

        switch (severityName)
        {
            case "Error":
                TestInfoBar1.Severity = InfoBarSeverity.Error;
                break;

            case "Warning":
                TestInfoBar1.Severity = InfoBarSeverity.Warning;
                break;

            case "Success":
                TestInfoBar1.Severity = InfoBarSeverity.Success;
                break;

            case "Informational":
            default:
                TestInfoBar1.Severity = InfoBarSeverity.Informational;
                break;
        }
    }

    private void MessageComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (TestInfoBar2 == null) return;

        if (MessageComboBox.SelectedIndex == 0) // short
        {
            string shortMessage = "A short essential app message.";
            TestInfoBar2.Message = shortMessage;
            DisplayMessage.Value = shortMessage;
        }
        else if (MessageComboBox.SelectedIndex == 1) //long
        {
            TestInfoBar2.Message = @"A long essential app message for your users to be informed of, acknowledge, or take action on. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dapibus dolor vitae justo rutrum, ut lobortis nibh mattis. Aenean id elit commodo, semper felis nec.";
            DisplayMessage.Value = "A long essential app message...";
        }
    }

    private void ActionButtonComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (TestInfoBar2 == null) return;

        if (ActionButtonComboBox.SelectedIndex == 0) // none
        {
            TestInfoBar2.ActionButton = null;
            DisplayButton.Value = string.Empty;
        }
        else if (ActionButtonComboBox.SelectedIndex == 1) // button
        {
            var button = new Button();
            button.Content = "Action";
            TestInfoBar2.ActionButton = button;
            DisplayButton.Value = @"<InfoBar.ActionButton>
            <Button Content=""Action"" Click=""InfoBarButton_Click"" />
    </InfoBar.ActionButton> ";

        }
        else if (ActionButtonComboBox.SelectedIndex == 2) // hyperlink
        {
            var link = new HyperlinkButton();
            link.NavigateUri = new Uri("http://www.microsoft.com/");
            link.Content = "Informational link";
            TestInfoBar2.ActionButton = link;
            DisplayButton.Value = @"<InfoBar.ActionButton>
            <HyperlinkButton Content=""Informational link"" NavigateUri=""https://www.example.com"" />
    </InfoBar.ActionButton>";
        }
    }
}

```

## 示例文件

### ClosableInfobarLongShort.txt
```
--- header
A closable InfoBar with a long or short message and various buttons
--- xaml
<InfoBar 
    IsOpen="$(IsOpen)"
    Title="Title"
    Message="$(DisplayMessage)" >
    $(DisplayButton)
</InfoBar>
```

### ClosableInfobarOptionsChange.txt
```
--- header
A closable InfoBar with options to change its Severity.
--- xaml
<InfoBar 
    IsOpen="$(IsOpen)"
    Severity="$(Severity)"
    Title="Title"
    Message="Essential app message for your users to be informed of, acknowledge, or take action on." />
```

### ClosableInfobarOptionsDisplay.txt
```
--- header
A closable InfoBar with options to display the close button and icon
--- xaml
<InfoBar 
    IsOpen="$(IsOpen)"
    IsIconVisible="$(IsIconVisible)"                    
    IsClosable="$(IsClosable)"
    Title="Title"
    Message="Essential app message for your users to be informed of, acknowledge, or take action on." />
```


# ProgressBar

## 主页面 XAML (ProgressBarPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.ProgressBarPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="ProgressBar\IndeterminateProgressBar.txt">

            <ProgressBar
                Width="130"
                Margin="10,10,0,0"
                VerticalAlignment="Top"
                IsIndeterminate="True"
                ShowError="{x:Bind ErrorRB.IsChecked.Value, Mode=OneWay}"
                ShowPaused="{x:Bind PausedRB.IsChecked.Value, Mode=OneWay}" />

            <controls:ControlExample.Options>
                <RadioButtons Header="Progress state">
                    <RadioButton
                        x:Name="RunningRB"
                        Content="Running"
                        IsChecked="True" />
                    <RadioButton x:Name="PausedRB" Content="Paused" />
                    <RadioButton x:Name="ErrorRB" Content="Error" />
                </RadioButtons>
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="ShowPaused" Value="{x:Bind PausedRB.IsChecked, Mode=OneWay}" />
                <controls:ControlExampleSubstitution Key="ShowError" Value="{x:Bind ErrorRB.IsChecked, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="ProgressBar\DeterminateProgressBar.txt">
            <StackPanel x:Name="Control2" Orientation="Horizontal">
                <ProgressBar
                    x:Name="ProgressBar2"
                    Width="130"
                    AutomationProperties.Name="Determinate ProgressBar example" />
                <TextBlock
                    x:Name="Control2Output"
                    Width="60"
                    Style="{ThemeResource OutputTextBlockStyle}"
                    TextAlignment="Center" />
                <TextBlock
                    x:Name="ProgressLabel"
                    Margin="0,0,10,0"
                    VerticalAlignment="Center"
                    Text="Progress" />
                <NumberBox
                    x:Name="ProgressValue"
                    AutomationProperties.LabeledBy="{Binding ElementName=ProgressLabel}"
                    AutomationProperties.Name="NumberBox controlling ProgressBar2 value"
                    Maximum="100"
                    Minimum="0"
                    SpinButtonPlacementMode="Inline"
                    ValueChanged="ProgressValue_ValueChanged"
                    Value="0" />
            </StackPanel>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="DeterminateProgressValue" Value="{x:Bind ProgressBar2.Value, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (ProgressBarPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class ProgressBarPage : Page
{
    public ProgressBarPage()
    {
        this.InitializeComponent();
    }

    private void ProgressValue_ValueChanged(Microsoft.UI.Xaml.Controls.NumberBox sender, Microsoft.UI.Xaml.Controls.NumberBoxValueChangedEventArgs args)
    {
        // Value might be NaN, which is not valid as value, thus we need to handle changes ourselves

        if (!double.IsNaN(sender.Value))
        {
            ProgressBar2.Value = sender.Value;
        }
        else
        {
            sender.Value = 0;
        }
    }
}

```

## 示例文件

### DeterminateProgressBar.txt
```
--- header
A determinate progress bar.
--- xaml
<ProgressBar Width="130" Value="$(DeterminateProgressValue)" />
```

### IndeterminateProgressBar.txt
```
--- header
An indeterminate progress bar.
--- xaml
<ProgressBar Width="130" IsIndeterminate="True" ShowPaused="$(ShowPaused)" ShowError="$(ShowError)" />
```


# ProgressRing

## 主页面 XAML (ProgressRingPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.ProgressRingPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>

        <!--  INDETERMINATE PROGRESS RING  -->
        <controls:ControlExample SampleDefinition="ProgressRing\IndeterminateProgressRing.txt">
            <ProgressRing
                x:Name="ProgressRing1"
                Width="60"
                Height="60"
                Margin="10,10,0,0"
                VerticalAlignment="Top"
                AutomationProperties.Name="Progress image"
                IsActive="{x:Bind ProgressToggle.IsOn, Mode=OneWay}" />
            <controls:ControlExample.Options>
                <StackPanel>
                    <ToggleSwitch
                        x:Name="ProgressToggle"
                        AutomationProperties.Name="Progress Options"
                        Header="Progress Options"
                        IsOn="True"
                        OffContent="Do work"
                        OnContent="Working" />
                    <ComboBox
                        x:Name="BackgroundComboBox1"
                        Width="200"
                        Header="Background color"
                        PlaceholderText="Pick a color"
                        SelectionChanged="Background_SelectionChanged">
                        <x:String>Transparent</x:String>
                        <x:String>LightGray</x:String>
                    </ComboBox>
                </StackPanel>
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="IsActive" Value="{x:Bind ProgressToggle.IsOn, Mode=OneWay}" />
                <controls:ControlExampleSubstitution
                    Key="Background"
                    x:Name="RevealBackgroundProperty1"
                    Value="Background=&quot;LightGray&quot;" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <!--  DETERMINATE PROGRESS RING  -->
        <controls:ControlExample SampleDefinition="ProgressRing\DeterminateProgressRing.txt">
            <StackPanel x:Name="Control2" Orientation="Horizontal">
                <ProgressRing
                    x:Name="ProgressRing2"
                    Width="60"
                    Height="60"
                    Margin="0,0,60,0"
                    AutomationProperties.Name="Progress image"
                    IsIndeterminate="False" />
                <NumberBox
                    x:Name="ProgressValue"
                    MinWidth="120"
                    VerticalAlignment="Center"
                    AutomationProperties.Name="Progress amount"
                    Header="Progress"
                    Maximum="100"
                    Minimum="0"
                    SpinButtonPlacementMode="Inline"
                    ValueChanged="ProgressValue_ValueChanged"
                    Value="0" />
            </StackPanel>
            <controls:ControlExample.Options>
                <StackPanel>
                    <ComboBox
                        x:Name="BackgroundComboBox2"
                        Width="200"
                        Header="Background color"
                        PlaceholderText="Pick a color"
                        SelectionChanged="Background_SelectionChanged">
                        <x:String>Transparent</x:String>
                        <x:String>LightGray</x:String>
                    </ComboBox>
                </StackPanel>
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="DeterminateProgressValue" Value="{x:Bind ProgressRing2.Value, Mode=OneWay}" />
                <controls:ControlExampleSubstitution
                    Key="Background"
                    x:Name="RevealBackgroundProperty2"
                    Value="Background=&quot;LightGray&quot;" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (ProgressRingPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media;
using System;

namespace WinUIGallery.ControlPages;

public sealed partial class ProgressRingPage : Page
{
    public ProgressRingPage()
    {
        this.InitializeComponent();
    }

    private void ProgressValue_ValueChanged(Microsoft.UI.Xaml.Controls.NumberBox sender, Microsoft.UI.Xaml.Controls.NumberBoxValueChangedEventArgs args)
    {
        if (!double.IsNaN(sender.Value))
        {
            ProgressRing2.Value = sender.Value;
        }
        else
        {
            sender.Value = 0;
        }
    }

    private void Background_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        var progressRing = (ComboBox)sender == BackgroundComboBox1 ? ProgressRing1 : ProgressRing2;
        var revealBackgroundProperty = (ComboBox)sender == BackgroundComboBox1 ? RevealBackgroundProperty1 : RevealBackgroundProperty2;
        string? colorName = e.AddedItems[0].ToString();
        bool showBackgroundProperty = false;
        switch (colorName)
        {
            case "Transparent":
                progressRing.Background = new SolidColorBrush(Colors.Transparent);
                break;
            case "LightGray":
                progressRing.Background = new SolidColorBrush(Colors.LightGray);
                showBackgroundProperty = true;
                break;

            default:
                throw new Exception($"Invalid argument: {colorName}");
        }
        revealBackgroundProperty.IsEnabled = showBackgroundProperty;
    }
}

```

## 示例文件

### DeterminateProgressRing.txt
```
--- header
A determinate progress ring.
--- xaml
<ProgressRing Width="60" Height="60" Value="$(DeterminateProgressValue)"
              IsIndeterminate="False"
              $(Background)/>
```

### IndeterminateProgressRing.txt
```
--- header
An indeterminate progress ring.
--- xaml
<ProgressRing IsActive="$(IsActive)" $(Background)/>
```


# ToolTip

## 主页面 XAML (ToolTipPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.ToolTipPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="ToolTip\ButtonSimpleTooltip.txt">
            <controls:ControlExample.Example>
                <Button Content="Button with a simple ToolTip." ToolTipService.ToolTip="Simple ToolTip" />
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="ToolTip\TextblockOffsetTooltip.txt">
            <controls:ControlExample.Example>
                <TextBlock Text="TextBlock with an offset ToolTip.">
                    <ToolTipService.ToolTip>
                        <ToolTip Content="Offset ToolTip." VerticalOffset="-80" />
                    </ToolTipService.ToolTip>
                </TextBlock>
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="ToolTip\ImageTooltipPlacementrect.txt">
            <controls:ControlExample.Example>
                <Image
                    x:Name="textBoxToPlace"
                    Width="400"
                    Height="266"
                    Source="/Assets/SampleMedia/cliff.jpg">
                    <ToolTipService.ToolTip>
                        <ToolTip
                            PlacementRect="0,0,400,266"
                            AutomationProperties.FullDescription="Non-occluding tooltip"
                            Content="Non-occluding ToolTip."
                            Placement="Right" />
                    </ToolTipService.ToolTip>
                </Image>
            </controls:ControlExample.Example>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (ToolTipPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class ToolTipPage : Page
{
    public ToolTipPage()
    {
        this.InitializeComponent();
    }

}

```

## 示例文件

### ButtonSimpleTooltip.txt
```
--- header
A button with a simple ToolTip.
--- xaml
<Button Content="Button with a simple ToolTip." ToolTipService.ToolTip="Simple ToolTip"/>
```

### ImageTooltipPlacementrect.txt
```
--- header
An Image with a ToolTip using PlacementRect.
--- xaml
<Image Source="/Assets/SampleMedia/cliff.jpg" Width="400" Height="266">
    <ToolTipService.ToolTip>
        <ToolTip Content="Non-occluding ToolTip." PlacementRect="0,0,400,266"/>
    </ToolTipService.ToolTip>
</Image>
```

### TextblockOffsetTooltip.txt
```
--- header
A TextBlock with an offset ToolTip.
--- xaml
<TextBlock Text="TextBlock with an offset ToolTip.">
    <ToolTipService.ToolTip>
        <ToolTip Content="Offset ToolTip." VerticalOffset="-80"/>
    </ToolTipService.ToolTip>
</TextBlock>
```



# 分组: Text

---

# AutoSuggestBox

## 主页面 XAML (AutoSuggestBoxPage.xaml)
```xaml
<Page
    x:Class="WinUIGallery.ControlPages.AutoSuggestBoxPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    x:Name="pageRoot"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="AutoSuggestBox\BasicAutosuggestBox.txt">
            <StackPanel Orientation="Horizontal">
                <AutoSuggestBox
                    x:Name="Control1"
                    Width="300"
                    AutomationProperties.Name="Basic AutoSuggestBox"
                    SuggestionChosen="AutoSuggestBox_SuggestionChosen"
                    TextChanged="AutoSuggestBox_TextChanged" />
                <TextBlock
                    x:Name="SuggestionOutput"
                    FontFamily="Global User Interface"
                    Style="{StaticResource OutputTextBlockStyle}" />
            </StackPanel>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example2" SampleDefinition="AutoSuggestBox\AutosuggestboxProvidesSearchboxExperience.txt">
            <Grid>
                <Grid.RowDefinitions>
                    <RowDefinition Height="Auto" />
                    <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>
                <AutoSuggestBox
                    x:Name="Control2"
                    Width="300"
                    HorizontalAlignment="Left"
                    PlaceholderText="Type a control name"
                    QueryIcon="Find"
                    QuerySubmitted="Control2_QuerySubmitted"
                    SuggestionChosen="Control2_SuggestionChosen"
                    TextChanged="Control2_TextChanged" />
                <RelativePanel
                    x:Name="ControlDetails"
                    Grid.Row="1"
                    Margin="0,8,0,0"
                    HorizontalAlignment="Left"
                    Visibility="Collapsed">
                    <Image x:Name="ControlImage" Height="75" />
                    <TextBlock
                        x:Name="ControlTitle"
                        Margin="8,0,0,0"
                        RelativePanel.RightOf="ControlImage"
                        Style="{StaticResource BaseTextBlockStyle}" />
                    <TextBlock
                        x:Name="ControlSubtitle"
                        Margin="8,0,0,0"
                        RelativePanel.AlignLeftWith="ControlTitle"
                        RelativePanel.Below="ControlTitle"
                        TextWrapping="WrapWholeWords" />
                </RelativePanel>
            </Grid>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (AutoSuggestBoxPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media.Imaging;
using System;
using System.Collections.Generic;
using System.Linq;
using WinUIGallery.Helpers;
using WinUIGallery.Models;

namespace WinUIGallery.ControlPages;

public sealed partial class AutoSuggestBoxPage : Page
{
    private List<string> Cats = new List<string>()
    {
        "Abyssinian",
        "Aegean",
        "American Bobtail",
        "American Curl",
        "American Ringtail",
        "American Shorthair",
        "American Wirehair",
        "Aphrodite Giant",
        "Arabian Mau",
        "Asian cat",
        "Asian Semi-longhair",
        "Australian Mist",
        "Balinese",
        "Bambino",
        "Bengal",
        "Birman",
        "Brazilian Shorthair",
        "British Longhair",
        "British Shorthair",
        "Burmese",
        "Burmilla",
        "California Spangled",
        "Chantilly-Tiffany",
        "Chartreux",
        "Chausie",
        "Colorpoint Shorthair",
        "Cornish Rex",
        "Cymric",
        "Cyprus",
        "Devon Rex",
        "Donskoy",
        "Dragon Li",
        "Dwelf",
        "Egyptian Mau",
        "European Shorthair",
        "Exotic Shorthair",
        "Foldex",
        "German Rex",
        "Havana Brown",
        "Highlander",
        "Himalayan",
        "Japanese Bobtail",
        "Javanese",
        "Kanaani",
        "Khao Manee",
        "Kinkalow",
        "Korat",
        "Korean Bobtail",
        "Korn Ja",
        "Kurilian Bobtail",
        "Lambkin",
        "LaPerm",
        "Lykoi",
        "Maine Coon",
        "Manx",
        "Mekong Bobtail",
        "Minskin",
        "Napoleon",
        "Munchkin",
        "Nebelung",
        "Norwegian Forest Cat",
        "Ocicat",
        "Ojos Azules",
        "Oregon Rex",
        "Persian (modern)",
        "Persian (traditional)",
        "Peterbald",
        "Pixie-bob",
        "Ragamuffin",
        "Ragdoll",
        "Raas",
        "Russian Blue",
        "Russian White",
        "Sam Sawet",
        "Savannah",
        "Scottish Fold",
        "Selkirk Rex",
        "Serengeti",
        "Serrade Petit",
        "Siamese",
        "Siberian or´Siberian Forest Cat",
        "Singapura",
        "Snowshoe",
        "Sokoke",
        "Somali",
        "Sphynx",
        "Suphalak",
        "Thai",
        "Thai Lilac",
        "Tonkinese",
        "Toyger",
        "Turkish Angora",
        "Turkish Van",
        "Turkish Vankedisi",
        "Ukrainian Levkoy",
        "Wila Krungthep",
        "York Chocolate"
    };

    public AutoSuggestBoxPage()
    {
        this.InitializeComponent();
    }

    private void AutoSuggestBox_TextChanged(AutoSuggestBox sender, AutoSuggestBoxTextChangedEventArgs args)
    {
        // Since selecting an item will also change the text,
        // only listen to changes caused by user entering text.
        if (args.Reason == AutoSuggestionBoxTextChangeReason.UserInput)
        {
            var suitableItems = new List<string>();
            var splitText = sender.Text.ToLower().Split(" ");
            foreach (var cat in Cats)
            {
                var found = splitText.All((key) =>
                {
                    return cat.ToLower().Contains(key);
                });
                if (found)
                {
                    suitableItems.Add(cat);
                }
            }
            if (suitableItems.Count == 0)
            {
                suitableItems.Add("No results found");
            }
            sender.ItemsSource = suitableItems;
        }
    }

    private void AutoSuggestBox_SuggestionChosen(AutoSuggestBox sender, AutoSuggestBoxSuggestionChosenEventArgs args)
    {
        SuggestionOutput.Text = args.SelectedItem.ToString();
    }

    /// <summary>
    /// This event gets fired anytime the text in the TextBox gets updated.
    /// It is recommended to check the reason for the text changing by checking against args.Reason
    /// </summary>
    /// <param name="sender">The AutoSuggestBox whose text got changed.</param>
    /// <param name="args">The event arguments.</param>
    private void Control2_TextChanged(AutoSuggestBox sender, AutoSuggestBoxTextChangedEventArgs args)
    {
        //We only want to get results when it was a user typing,
        //otherwise we assume the value got filled in by TextMemberPath
        //or the handler for SuggestionChosen
        if (args.Reason == AutoSuggestionBoxTextChangeReason.UserInput)
        {
            var suggestions = SearchControls(sender.Text);

            if (suggestions.Count > 0)
                sender.ItemsSource = suggestions;
            else
                sender.ItemsSource = new string[] { "No results found" };
        }
    }

    /// <summary>
    /// This event gets fired when:
    ///     * a user presses Enter while focus is in the TextBox
    ///     * a user clicks or tabs to and invokes the query button (defined using the QueryIcon API)
    ///     * a user presses selects (clicks/taps/presses Enter) a suggestion
    /// </summary>
    /// <param name="sender">The AutoSuggestBox that fired the event.</param>
    /// <param name="args">The args contain the QueryText, which is the text in the TextBox,
    /// and also ChosenSuggestion, which is only non-null when a user selects an item in the list.</param>
    private void Control2_QuerySubmitted(AutoSuggestBox sender, AutoSuggestBoxQuerySubmittedEventArgs args)
    {
        if (args.ChosenSuggestion is ControlInfoDataItem chosenSuggestion)
        {
            //User selected an item, take an action
            SelectControl(chosenSuggestion);
        }
        else if (!string.IsNullOrEmpty(args.QueryText))
        {
            //Do a fuzzy search based on the text
            var suggestions = SearchControls(sender.Text);
            if (suggestions.FirstOrDefault() is ControlInfoDataItem firstItem)
            {
                SelectControl(firstItem);
            }
        }
    }

    /// <summary>
    /// This event gets fired as the user keys through the list, or taps on a suggestion.
    /// This allows you to change the text in the TextBox to reflect the item in the list.
    /// Alternatively you can use TextMemberPath.
    /// </summary>
    /// <param name="sender">The AutoSuggestBox that fired the event.</param>
    /// <param name="args">The args contain SelectedItem, which contains the data item of the item that is currently highlighted.</param>
    private void Control2_SuggestionChosen(AutoSuggestBox sender, AutoSuggestBoxSuggestionChosenEventArgs args)
    {
        //Don't autocomplete the TextBox when we are showing "no results"
        if (args.SelectedItem is ControlInfoDataItem control)
        {
            sender.Text = control.Title;
        }
    }

    /// <summary>
    /// This
    /// </summary>
    /// <param name="contact"></param>
    private void SelectControl(ControlInfoDataItem control)
    {
        if (control != null)
        {
            ControlDetails.Visibility = Visibility.Visible;


            BitmapImage? image = control.ImagePath == null ? null : new BitmapImage(new Uri(control.ImagePath));
            ControlImage.Source = image;

            ControlTitle.Text = control.Title;
            ControlSubtitle.Text = control.Subtitle;
        }
    }

    private List<ControlInfoDataItem> SearchControls(string query)
    {
        var suggestions = new List<ControlInfoDataItem>();

        var querySplit = query.Split(" ");
        foreach (var group in ControlInfoDataSource.Instance.Groups)
        {
            var matchingItems = group.Items.Where(
                item =>
                {
                    // Idea: check for every word entered (separated by space) if it is in the name,  
                    // e.g. for query "split button" the only result should "SplitButton" since its the only query to contain "split" and "button" 
                    // If any of the sub tokens is not in the string, we ignore the item. So the search gets more precise with more words 
                    bool flag = item.IncludedInBuild;
                    foreach (string queryToken in querySplit)
                    {
                        // Check if token is not in string 
                        if (item.Title.IndexOf(queryToken, StringComparison.CurrentCultureIgnoreCase) < 0)
                        {
                            // Token is not in string, so we ignore this item. 
                            flag = false;
                        }
                    }
                    return flag;
                });
            foreach (var item in matchingItems)
            {
                suggestions.Add(item);
            }
        }
        return suggestions.OrderByDescending(i => i.Title.StartsWith(query, StringComparison.CurrentCultureIgnoreCase)).ThenBy(i => i.Title).ToList();
    }
}

```

## 示例文件

### AutosuggestboxProvidesSearchboxExperience.txt
```
--- header
An AutoSuggestBox that provides a SearchBox experience
--- xaml
<AutoSuggestBox PlaceholderText="Type a control name"
        TextChanged="Control2_TextChanged"
        QueryIcon="Find"
        QuerySubmitted="Control2_QuerySubmitted"
        SuggestionChosen="Control2_SuggestionChosen"/>
```

### BasicAutosuggestBox.txt
```
--- header
A basic autosuggest box.
--- xaml
<AutoSuggestBox TextChanged="AutoSuggestBox_TextChanged"
                SuggestionChosen="AutoSuggestBox_SuggestionChosen"
                Width="300" AutomationProperties.Name="Basic AutoSuggestBox"/>
--- c#
// List of cats
private List<string> Cats = new List<string>()
{
    "Abyssinian",
    "Aegean",
    "American Bobtail",
    ...
};

// Handle text change and present suitable items
private void AutoSuggestBox_TextChanged(AutoSuggestBox sender, AutoSuggestBoxTextChangedEventArgs args)
{
    // Since selecting an item will also change the text,
    // only listen to changes caused by user entering text.
    if(args.Reason == AutoSuggestionBoxTextChangeReason.UserInput)
    {
        var suitableItems = new List<string>();
        var splitText = sender.Text.ToLower().Split(" ");
        foreach(var cat in Cats)
        {
            var found = splitText.All((key)=>
            {
                return cat.ToLower().Contains(key);
            });
            if(found)
            {
                suitableItems.Add(cat);
            }
        }
        if(suitableItems.Count == 0)
        {
            suitableItems.Add("No results found");
        }
        sender.ItemsSource = suitableItems;
    }
}

// Handle user selecting an item, in our case just output the selected item.
private void AutoSuggestBox_SuggestionChosen(AutoSuggestBox sender, AutoSuggestBoxSuggestionChosenEventArgs args)
{
    SuggestionOutput.Text = args.SelectedItem.ToString();
}
```


# NumberBox

## 主页面 XAML (NumberBoxPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.NumberBoxPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <StackPanel>
        <controls:ControlExample SampleDefinition="NumberBox\NumberboxEvaluatesExpressions.txt">
            <controls:ControlExample.Example>
                <NumberBox
                    AcceptsExpression="True"
                    Header="Enter an expression:"
                    PlaceholderText="1 + 2^2"
                    Value="NaN" />
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="NumberBox\NumberboxSpinButton.txt">
            <controls:ControlExample.Example>
                <NumberBox
                    x:Name="NumberBoxSpinButtonPlacementExample"
                    VerticalAlignment="Top"
                    AutomationProperties.Name="NumberBox with spin button"
                    Header="Enter an integer:"
                    LargeChange="100"
                    SmallChange="10"
                    SpinButtonPlacementMode="Compact"
                    Value="10" />
            </controls:ControlExample.Example>
            <controls:ControlExample.Options>
                <RadioButtons
                    x:Name="SpinButtonPlacementGroup"
                    Header="SpinButton placement"
                    SelectedIndex="0"
                    SelectionChanged="SpinButtonPlacementGroup_SelectionChanged">
                    <x:String>Inline</x:String>
                    <x:String>Compact</x:String>
                </RadioButtons>
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="SpinButtonPlacementMode" Value="{x:Bind SpinButtonPlacementGroup.SelectedItem, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>

        <controls:ControlExample
            SampleDefinition="NumberBox\FormattedNumberboxRoundsNearest.txt">
            <controls:ControlExample.Example>
                <NumberBox
                    x:Name="FormattedNumberBox"
                    Header="Enter a dollar amount:"
                    PlaceholderText="0.00" />
            </controls:ControlExample.Example>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (NumberBoxPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;
using Windows.Globalization.NumberFormatting;

namespace WinUIGallery.ControlPages;

public sealed partial class NumberBoxPage : Page
{
    public NumberBoxPage()
    {
        this.InitializeComponent();
        SetNumberBoxNumberFormatter();
    }

    private void SetNumberBoxNumberFormatter()
    {
        IncrementNumberRounder rounder = new IncrementNumberRounder
        {
            Increment = 0.25,
            RoundingAlgorithm = RoundingAlgorithm.RoundHalfUp
        };

        DecimalFormatter formatter = new DecimalFormatter
        {
            IntegerDigits = 1,
            FractionDigits = 2,
            NumberRounder = rounder
        };
        FormattedNumberBox.NumberFormatter = formatter;
    }

    private void SpinButtonPlacementGroup_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (sender is RadioButtons radioButtons)
        {
            switch (radioButtons.SelectedIndex)
            {
                case 0:
                    NumberBoxSpinButtonPlacementExample.SpinButtonPlacementMode = NumberBoxSpinButtonPlacementMode.Inline;
                    break;
                case 1:
                    NumberBoxSpinButtonPlacementExample.SpinButtonPlacementMode = NumberBoxSpinButtonPlacementMode.Compact;
                    break;
            }
        }
    }
}

```

## 示例文件

### FormattedNumberboxRoundsNearest.txt
```
--- header
A formatted NumberBox that rounds to the nearest 0.25.
--- xaml
<NumberBox x:Name="FormattedNumberBox" Header="Enter an dollar amount:" PlaceholderText="0.00" />
--- c#
private void SetNumberBoxNumberFormatter()
{
    IncrementNumberRounder rounder = new IncrementNumberRounder();
    rounder.Increment = 0.25;
    rounder.RoundingAlgorithm = RoundingAlgorithm.RoundHalfUp;

    DecimalFormatter formatter = new DecimalFormatter();
    formatter.IntegerDigits = 1;
    formatter.FractionDigits = 2;
    formatter.NumberRounder = rounder;
    FormattedNumberBox.NumberFormatter = formatter;
}
```

### NumberboxEvaluatesExpressions.txt
```
--- header
A NumberBox that evaluates expressions.
--- xaml
<NumberBox Header="Enter an expression:" Value="NaN" PlaceholderText="1 + 2^2" AcceptsExpression="True" />
```

### NumberboxSpinButton.txt
```
--- header
A NumberBox with a spin button.
--- xaml
<NumberBox
    x:Name="NumberBoxSpinButtonPlacementExample"
    Header="Enter an integer:" 
    Value="1" 
    SpinButtonPlacementMode="$(SpinButtonPlacementMode)"
    SmallChange="10"
    LargeChange="100" />
```


# PasswordBox

## 主页面 XAML (PasswordBoxPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.PasswordBoxPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="PasswordBox\SimplePasswordbox.txt">
            <StackPanel>
                <PasswordBox
                    Width="300"
                    AutomationProperties.Name="Simple PasswordBox"
                    PasswordChanged="PasswordBox_PasswordChanged" />
                <TextBlock
                    x:Name="Control1Output"
                    FontFamily="Global User Interface"
                    Style="{StaticResource OutputTextBlockStyle}"
                    Visibility="Collapsed" />
            </StackPanel>
        </controls:ControlExample>

        <controls:ControlExample x:Name="Example2" SampleDefinition="PasswordBox\PasswordboxHeaderPlaceholderText.txt">
            <PasswordBox
                Width="300"
                Header="Password"
                PasswordChar="#"
                PlaceholderText="Enter your password" />
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="PasswordBox\PasswordboxRevealMode.txt">
            <StackPanel Orientation="Horizontal">
                <PasswordBox
                    Name="passworBoxWithRevealmode"
                    Width="250"
                    Margin="0,0,8,0"
                    AutomationProperties.Name="Sample password box"
                    PasswordRevealMode="Hidden" />
                <CheckBox
                    Name="revealModeCheckBox"
                    Checked="RevealModeCheckbox_Changed"
                    Content="Show password"
                    IsChecked="False"
                    Unchecked="RevealModeCheckbox_Changed" />
            </StackPanel>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (PasswordBoxPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class PasswordBoxPage : Page
{
    public PasswordBoxPage()
    {
        this.InitializeComponent();
    }

    private void PasswordBox_PasswordChanged(object sender, RoutedEventArgs e)
    {
        if (sender is PasswordBox pb)
        {
            if (string.IsNullOrEmpty(pb.Password) || pb.Password == "Password")
            {
                Control1Output.Visibility = Visibility.Visible;
                Control1Output.Text = "'Password' is not allowed.";
                pb.Password = string.Empty;
            }
            else
            {
                Control1Output.Text = string.Empty;
                Control1Output.Visibility = Visibility.Collapsed;
            }
        }
    }

    private void RevealModeCheckbox_Changed(object sender, RoutedEventArgs e)
    {
        if (revealModeCheckBox.IsChecked == true)
        {
            passworBoxWithRevealmode.PasswordRevealMode = PasswordRevealMode.Visible;
        }
        else
        {
            passworBoxWithRevealmode.PasswordRevealMode = PasswordRevealMode.Hidden;
        }
    }
}

```

## 示例文件

### PasswordboxHeaderPlaceholderText.txt
```
--- header
A PasswordBox with header, placeholder text and custom character.
--- xaml
<PasswordBox Width="300" Header="Password" PlaceholderText="Enter your password" PasswordChar="#" />
```

### PasswordboxRevealMode.txt
```
--- header
A PasswordBox with reveal mode.
--- xaml
<PasswordBox Name="passworBoxWithRevealmode" Width="250" Margin="0,0,8,0"
    PasswordRevealMode="Hidden" AutomationProperties.Name="Sample password box"/>
<CheckBox Name="revealModeCheckBox" Content="Show password" IsChecked="False"
    Checked="RevealModeCheckbox_Changed" Unchecked="RevealModeCheckbox_Changed"/>
--- c#
private void RevealModeCheckbox_Changed(object sender, RoutedEventArgs e)
{
    if (revealModeCheckBox.IsChecked == true)
    {
        passworBoxWithRevealmode.PasswordRevealMode = PasswordRevealMode.Visible;
    }
    else
    {
        passworBoxWithRevealmode.PasswordRevealMode = PasswordRevealMode.Hidden;
    }
}
```

### SimplePasswordbox.txt
```
--- header
A simple PasswordBox.
--- xaml
<PasswordBox Width="300" AutomationProperties.Name="Simple PasswordBox"/>
```


# RichEditBox

## 主页面 XAML (RichEditBoxPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.RichEditBoxPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <StackPanel>

        <controls:ControlExample VerticalAlignment="Top"
                                 HorizontalContentAlignment="Stretch"
                                 SampleDefinition="RichEditBox\SimpleTextEditorRicheditbox.txt">
            <RichEditBox AutomationProperties.Name="simple text editor" />
        </controls:ControlExample>

        <controls:ControlExample
                                 SampleDefinition="RichEditBox\CustomizingRicheditboxCommandbarflyoutAdding.txt">
            <RichEditBox x:Name="REBCustom"
                         Width="800"
                         Height="200"
                         AutomationProperties.Name="editor with custom menu"
                         Loaded="REBCustom_Loaded"
                         Unloaded="REBCustom_Unloaded" />

        </controls:ControlExample>

        <controls:ControlExample VerticalAlignment="Top"
                                 HorizontalContentAlignment="Stretch"
                                 SampleDefinition="RichEditBox\CustomEditorRicheditbox.txt">
            <RelativePanel Margin="0,0,0,20"
                           HorizontalAlignment="Stretch">
                <RelativePanel.Resources>
                    <ResourceDictionary>
                        <Style TargetType="Button">
                            <Setter Property="BorderThickness"
                                    Value="0" />
                            <Setter Property="Background"
                                    Value="Transparent" />
                            <Setter Property="Margin"
                                    Value="0,0,8,0" />
                        </Style>

                        <ResourceDictionary.ThemeDictionaries>
                            <ResourceDictionary x:Key="HighContrast">
                                <StaticResource x:Key="ButtonBackgroundPointerOver"
                                                ResourceKey="SystemColorHighlightColor" />
                            </ResourceDictionary>
                        </ResourceDictionary.ThemeDictionaries>
                    </ResourceDictionary>
                </RelativePanel.Resources>
                <Button x:Name="openFileButton"
                        AutomationProperties.Name="Open file"
                        Click="OpenButton_Click"
                        ToolTipService.ToolTip="Open file">
                    <Button.Content>
                        <FontIcon Glyph="&#xE8E5;" />
                    </Button.Content>
                </Button>
                <Button AutomationProperties.Name="Save file"
                        Click="SaveButton_Click"
                        RelativePanel.RightOf="openFileButton"
                        ToolTipService.ToolTip="Save file">
                    <Button.Content>
                        <FontIcon Glyph="&#xE74E;" />
                    </Button.Content>
                </Button>
                <Button AutomationProperties.Name="Bold"
                        Click="BoldButton_Click"
                        RelativePanel.LeftOf="italicButton"
                        ToolTipService.ToolTip="Bold">
                    <Button.Content>
                        <FontIcon Glyph="&#xE8DD;" />
                    </Button.Content>
                </Button>
                <Button x:Name="italicButton"
                        AutomationProperties.Name="Italic"
                        Click="ItalicButton_Click"
                        RelativePanel.LeftOf="fontColorButton"
                        ToolTipService.ToolTip="Italic">
                    <Button.Content>
                        <FontIcon Glyph="&#xE8DB;" />
                    </Button.Content>
                </Button>

                <DropDownButton x:Name="fontColorButton"
                                AutomationProperties.Name="Font color"
                                Background="Transparent"
                                BorderThickness="0"
                                RelativePanel.AlignRightWithPanel="True"
                                ToolTipService.ToolTip="Font color">
                    <SymbolIcon Symbol="FontColor" />
                    <DropDownButton.Flyout>
                        <Flyout Placement="Bottom">
                            <VariableSizedWrapGrid MaximumRowsOrColumns="3"
                                                   Orientation="Horizontal">
                                <VariableSizedWrapGrid.Resources>
                                    <Style TargetType="Rectangle">
                                        <Setter Property="Width"
                                                Value="32" />
                                        <Setter Property="Height"
                                                Value="32" />
                                    </Style>
                                    <Style TargetType="Button">
                                        <Setter Property="Padding"
                                                Value="0" />
                                        <Setter Property="MinWidth"
                                                Value="0" />
                                        <Setter Property="MinHeight"
                                                Value="0" />
                                        <Setter Property="Margin"
                                                Value="6" />
                                    </Style>
                                </VariableSizedWrapGrid.Resources>
                                <Button AutomationProperties.Name="Red"
                                        Click="ColorButton_Click">
                                    <Button.Content>
                                        <Rectangle Fill="Red" />
                                    </Button.Content>
                                </Button>
                                <Button AutomationProperties.Name="Orange"
                                        Click="ColorButton_Click">
                                    <Button.Content>
                                        <Rectangle Fill="Orange" />
                                    </Button.Content>
                                </Button>
                                <Button AutomationProperties.Name="Yellow"
                                        Click="ColorButton_Click">
                                    <Button.Content>
                                        <Rectangle Fill="Yellow" />
                                    </Button.Content>
                                </Button>
                                <Button AutomationProperties.Name="Green"
                                        Click="ColorButton_Click">
                                    <Button.Content>
                                        <Rectangle Fill="Green" />
                                    </Button.Content>
                                </Button>
                                <Button AutomationProperties.Name="Blue"
                                        Click="ColorButton_Click">
                                    <Button.Content>
                                        <Rectangle Fill="Blue" />
                                    </Button.Content>
                                </Button>
                                <Button AutomationProperties.Name="Indigo"
                                        Click="ColorButton_Click">
                                    <Button.Content>
                                        <Rectangle Fill="Indigo" />
                                    </Button.Content>
                                </Button>
                                <Button AutomationProperties.Name="Violet"
                                        Click="ColorButton_Click">
                                    <Button.Content>
                                        <Rectangle Fill="Violet" />
                                    </Button.Content>
                                </Button>
                                <Button AutomationProperties.Name="Gray"
                                        Click="ColorButton_Click">
                                    <Button.Content>
                                        <Rectangle Fill="Gray" />
                                    </Button.Content>
                                </Button>
                            </VariableSizedWrapGrid>
                        </Flyout>
                    </DropDownButton.Flyout>
                </DropDownButton>

                <RichEditBox x:Name="editor"
                             Height="200"
                             MinWidth="300"
                             AutomationProperties.Name="Custom editor"
                             GotFocus="Editor_GotFocus"
                             RelativePanel.AlignLeftWithPanel="True"
                             RelativePanel.AlignRightWithPanel="True"
                             RelativePanel.Below="openFileButton"
                             TextChanged="Editor_TextChanged" />
                <StackPanel Margin="0,10,0,0"
                            Orientation="Horizontal"
                            RelativePanel.AlignLeftWith="editor"
                            RelativePanel.Below="editor">
                    <TextBlock x:Name="findBoxLabel"
                               Margin="0,0,0,4"
                               VerticalAlignment="Center"
                               Text="Find:" />
                    <TextBox x:Name="findBox"
                             Width="224"
                             Margin="10,0,0,0"
                             GotFocus="{x:Bind FindBoxHighlightMatches}"
                             LostFocus="{x:Bind FindBoxRemoveHighlights}"
                             PlaceholderText="Enter search text"
                             TextChanged="{x:Bind FindBoxHighlightMatches}" />
                </StackPanel>
            </RelativePanel>
        </controls:ControlExample>

        <controls:ControlExample x:Name="MathModeExample"
                                 SampleDefinition="RichEditBox\RichEditBoxMath.txt">
            <controls:ControlExample.Resources>
                <Style x:Key="ItemStyle1"
                       TargetType="Grid">
                    <Setter Property="Background"
                            Value="{ThemeResource CardBackgroundFillColorDefaultBrush}" />
                </Style>
                <Style x:Key="ItemStyle2"
                       TargetType="Grid">
                    <Setter Property="Background"
                            Value="{ThemeResource CardBackgroundFillColorSecondaryBrush}" />
                </Style>
            </controls:ControlExample.Resources>
            <controls:ControlExample.Example>
                <StackPanel Spacing="8">
                    <RichTextBlock>
                        <Paragraph Margin="0,0,0,4">
                            Math mode enables users to have input automatically recognized and converted to math expressions while being received.
                        </Paragraph>
                        <Paragraph Margin="0,0,0,4">
                            It uses
                            <Hyperlink NavigateUri="https://www.unicode.org/notes/tn28/">Unicode Nearly Plain-Text Encoding of Mathematics</Hyperlink>, which allows mathematical notation to be represented in a linear format and automatically converted into proper math equations.
                        </Paragraph>
                        <Paragraph Margin="0,0,0,4">
                            For example, "4^2" is converted to "4&#x00b2;", and "\pi" is converted to "&#x03c0;".
                        </Paragraph>
                        <Paragraph>
                            Enabling math mode in a RichEditBox automatically switches the input font to Cambria Math. Additionally, toggling math mode clears any existing content and undo stack.
                        </Paragraph>
                    </RichTextBlock>
                    <RichEditBox x:Name="MathEditor"
                                 Height="80"
                                 Width="724"
                                 FontSize="16"
                                 HorizontalAlignment="Left" />
                </StackPanel>
            </controls:ControlExample.Example>
        </controls:ControlExample>
        <controls:ControlExample SampleDefinition="RichEditBox\WorkingMathmlRicheditbox.txt"
                                 HorizontalContentAlignment="Stretch">
            <controls:ControlExample.Example>
                <StackPanel Spacing="16">
                    <RichTextBlock>
                        <Paragraph Margin="0,0,0,4">
                            The
                            <Run FontWeight="SemiBold">SetMathML</Run> method takes a
                            <Hyperlink NavigateUri="https://www.w3.org/Math/">MathML</Hyperlink>
                            string and displays the equation in the
                            <Run FontWeight="SemiBold">RichEditBox</Run> .  
                            It replaces any existing equation with the new one.
                        </Paragraph>

                        <Paragraph Margin="0,0,0,4">
                            The
                            <Run FontWeight="SemiBold">GetMathML</Run> method retrieves the MathML string of the 
                            equation from the
                            <Run FontWeight="SemiBold">RichEditBox</Run> . However, it only works if the 
                            equation is in a single line. If the text spans multiple lines, it returns 
                            an empty string, but the equation will still be rendered correctly.
                        </Paragraph>

                        <Paragraph Margin="0,0,0,4">
                            Setting the math mode in the
                            <Run FontWeight="SemiBold">RichEditBox</Run> is necessary 
                            to use these methods. it can be enabled using
                            <Run FontFamily="Consolas">SetMathMode(RichEditMathMode.MathOnly)</Run> .
                        </Paragraph>

                        <Paragraph>
                            <Run FontWeight="SemiBold">SetMathML</Run> and
                            <Run FontWeight="SemiBold">GetMathML</Run>
                            can be used to restore and save equations.
                        </Paragraph>
                    </RichTextBlock>

                    <RichEditBox x:Name="mathEditor2"
                                 FontSize="16"
                                 Height="80"
                                 Width="724"
                                 HorizontalAlignment="Left"
                                 TextChanged="mathEditor2_TextChanged" />
                    <TextBlock FontWeight="SemiBold"
                               Text="MathML Code"
                               Margin="0,0,0,-8" />
                    <ScrollViewer MaxHeight="450"
                                  HorizontalScrollMode="Disabled"
                                  VerticalScrollMode="Auto"
                                  Background="{ThemeResource CardBackgroundFillColorDefaultBrush}"
                                  CornerRadius="4"
                                  HorizontalAlignment="Stretch"
                                  Padding="0,8,8,0">
                        <controls:SampleCodePresenter x:Name="MathmlPresenter"
                                                      SampleType="XAML">
                            <controls:SampleCodePresenter.Code>
                                <x:String xml:space="preserve">
&lt;!-- No MathML content --&gt;
                                </x:String>
                            </controls:SampleCodePresenter.Code>
                        </controls:SampleCodePresenter>
                    </ScrollViewer>
                </StackPanel>
            </controls:ControlExample.Example>
            <controls:ControlExample.Options>
                <StackPanel>
                    <Button x:Name="SetMathmlFormulaBtn"
                            Click="SetMathmlFormulaBtn_Click"
                            Content="Set sample formula"
                            Style="{StaticResource AccentButtonStyle}"/>
                </StackPanel>
            </controls:ControlExample.Options>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (RichEditBoxPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Text;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Input;
using Microsoft.UI.Xaml.Media;
using Microsoft.Windows.Storage.Pickers;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Xml.Linq;
using Windows.Foundation.Metadata;
using Windows.Storage;
using Windows.Storage.Provider;
using Windows.Storage.Streams;

namespace WinUIGallery.ControlPages;

public sealed partial class RichEditBoxPage : Page
{
    private Windows.UI.Color currentColor = Microsoft.UI.Colors.Green;

    public RichEditBoxPage()
    {
        this.InitializeComponent();

        MathEditor.TextDocument.SetMathMode(RichEditMathMode.MathOnly);
        mathEditor2.TextDocument.SetMathMode(RichEditMathMode.MathOnly);
    }

    private void Menu_Opening(object? sender, object e)
    {
        CommandBarFlyout? myFlyout = sender as CommandBarFlyout;
        if (myFlyout != null && myFlyout.Target == REBCustom)
        {
            AppBarButton myButton = new AppBarButton
            {
                Command = new StandardUICommand(StandardUICommandKind.Share)
            };
            myFlyout.PrimaryCommands.Add(myButton);
        }
        else
        {
            CommandBarFlyout? muxFlyout = sender as CommandBarFlyout;
            if (muxFlyout != null && muxFlyout.Target == REBCustom)
            {
                AppBarButton myButton = new AppBarButton
                {
                    Command = new StandardUICommand(StandardUICommandKind.Share)
                };
                muxFlyout.PrimaryCommands.Add(myButton);
            }
        }

    }

    private async void OpenButton_Click(object sender, RoutedEventArgs e)
    {
        if (sender is Button button)
        {
            // Create the picker using the AppWindowId from the element
            var picker = new FileOpenPicker(button.XamlRoot.ContentIslandEnvironment.AppWindowId)
            {
                SuggestedStartLocation = PickerLocationId.DocumentsLibrary
            };

            // Add file type filters
            picker.FileTypeFilter.Add(".rtf");

            // Show picker
            PickFileResult result = await picker.PickSingleFileAsync();

            if (result != null)
            {
                // Open with StorageFile (needed for RichEditBox)
                StorageFile file = await StorageFile.GetFileFromPathAsync(result.Path);

                using IRandomAccessStream randAccStream =
                    await file.OpenAsync(FileAccessMode.Read);

                // Load file into the RichEditBox
                editor.Document.LoadFromStream(TextSetOptions.FormatRtf, randAccStream);
            }
        }
    }

    private async void SaveButton_Click(object sender, RoutedEventArgs e)
    {
        if (sender is Button button)
        {
            // Create the picker with AppWindowId
            var savePicker = new FileSavePicker(button.XamlRoot.ContentIslandEnvironment.AppWindowId)
            {
                SuggestedStartLocation = PickerLocationId.DocumentsLibrary,
                SuggestedFileName = "New Document"
            };

            // Dropdown of file types the user can save the file as
            savePicker.FileTypeChoices.Add("Rich Text", new List<string>() { ".rtf" });

            // Show picker
            PickFileResult result = await savePicker.PickSaveFileAsync();

            if (result != null)
            {
                // Convert PickSaveFileResult to StorageFile
                StorageFile file = await StorageFile.GetFileFromPathAsync(result.Path);

                // Prevent updates to the remote version of the file until complete
                CachedFileManager.DeferUpdates(file);

                // Write content into the file
                using IRandomAccessStream randAccStream =
                    await file.OpenAsync(FileAccessMode.ReadWrite);

                editor.Document.SaveToStream(TextGetOptions.FormatRtf, randAccStream);

                // Finalize file updates
                FileUpdateStatus status = await CachedFileManager.CompleteUpdatesAsync(file);

                if (status != FileUpdateStatus.Complete)
                {
                    var errorBox = new Windows.UI.Popups.MessageDialog(
                        $"File {file.Name} couldn't be saved.");
                    await errorBox.ShowAsync();
                }
            }
        }
    }

    private void BoldButton_Click(object sender, RoutedEventArgs e)
    {
        editor.Document.Selection.CharacterFormat.Bold = FormatEffect.Toggle;
    }

    private void ItalicButton_Click(object sender, RoutedEventArgs e)
    {
        editor.Document.Selection.CharacterFormat.Italic = FormatEffect.Toggle;
    }

    private void ColorButton_Click(object sender, RoutedEventArgs e)
    {
        // Extract the color of the button that was clicked.
        Button clickedColor = (Button)sender;
        var rectangle = (Microsoft.UI.Xaml.Shapes.Rectangle)clickedColor.Content;
        var color = ((Microsoft.UI.Xaml.Media.SolidColorBrush)rectangle.Fill).Color;

        editor.Document.Selection.CharacterFormat.ForegroundColor = color;

        fontColorButton.Flyout.Hide();
        editor.Focus(Microsoft.UI.Xaml.FocusState.Keyboard);
        currentColor = color;
    }

    private void FindBoxHighlightMatches()
    {
        FindBoxRemoveHighlights();

        Windows.UI.Color highlightBackgroundColor = (Windows.UI.Color)App.Current.Resources["SystemColorHighlightColor"];
        Windows.UI.Color highlightForegroundColor = (Windows.UI.Color)App.Current.Resources["SystemColorHighlightTextColor"];

        string textToFind = findBox.Text;
        if (textToFind != null)
        {
            ITextRange searchRange = editor.Document.GetRange(0, 0);
            while (searchRange.FindText(textToFind, TextConstants.MaxUnitCount, FindOptions.None) > 0)
            {
                searchRange.CharacterFormat.BackgroundColor = highlightBackgroundColor;
                searchRange.CharacterFormat.ForegroundColor = highlightForegroundColor;
            }
        }
    }

    private void FindBoxRemoveHighlights()
    {
        if (editor.Background is not SolidColorBrush defaultBackground ||
            editor.Foreground is not SolidColorBrush defaultForeground)
        {
            return;
        }

        ITextRange documentRange = editor.Document.GetRange(0, TextConstants.MaxUnitCount);
        documentRange.CharacterFormat.BackgroundColor = defaultBackground.Color;
        documentRange.CharacterFormat.ForegroundColor = defaultForeground.Color;
    }

    private void Editor_GotFocus(object sender, RoutedEventArgs e)
    {
        editor.Document.GetText(TextGetOptions.UseCrlf, out _);

        // reset colors to correct defaults for Focused state
        ITextRange documentRange = editor.Document.GetRange(0, TextConstants.MaxUnitCount);
        SolidColorBrush background = (SolidColorBrush)App.Current.Resources["TextControlBackgroundFocused"];

        if (background != null)
        {
            documentRange.CharacterFormat.BackgroundColor = background.Color;
        }
    }

    private void REBCustom_Loaded(object sender, RoutedEventArgs e)
    {
        // Prior to UniversalApiContract 7, RichEditBox did not have a default ContextFlyout set.
        if (ApiInformation.IsApiContractPresent("Windows.Foundation.UniversalApiContract", 7))
        {
            // customize the menu that opens on text selection
            REBCustom.SelectionFlyout.Opening += Menu_Opening;

            // also customize the context menu to match selection menu
            REBCustom.ContextFlyout.Opening += Menu_Opening;
        }
    }

    private void REBCustom_Unloaded(object sender, RoutedEventArgs e)
    {
        // Prior to UniversalApiContract 7, RichEditBox did not have a default ContextFlyout set.
        if (ApiInformation.IsApiContractPresent("Windows.Foundation.UniversalApiContract", 7))
        {
            REBCustom.SelectionFlyout.Opening -= Menu_Opening;
            REBCustom.ContextFlyout.Opening -= Menu_Opening;
        }
    }

    private void Editor_TextChanged(object sender, RoutedEventArgs e)
    {
        if (editor.Document.Selection.CharacterFormat.ForegroundColor != currentColor)
        {
            editor.Document.Selection.CharacterFormat.ForegroundColor = currentColor;
        }
    }

    private void mathEditor2_TextChanged(object sender, RoutedEventArgs e)
    {
        string extractedMathML;
        mathEditor2.Document.GetMathML(out extractedMathML);
        if (!string.IsNullOrEmpty(extractedMathML))
        {
            MathmlPresenter.Code = FormatMathML(extractedMathML);
        }
        else
        {
            MathmlPresenter.Code = "<!-- No MathML content -->";
        }
    }

    private void SetMathmlFormulaBtn_Click(object sender, RoutedEventArgs e)
    {
        string formulaMathML =
            "<mml:math xmlns:mml=\"http://www.w3.org/1998/Math/MathML\" display=\"block\">\r\n" +
            "  <mml:mi mathcolor=\"#000000\">x</mml:mi>\r\n" +
            "  <mml:mo mathcolor=\"#000000\">\u2208</mml:mo>\r\n" +
            "  <mml:mi mathcolor=\"#000000\">P</mml:mi>\r\n" +
            "  <mml:mfenced>\r\n" +
            "    <mml:mrow>\r\n" +
            "      <mml:mi mathcolor=\"#000000\">A</mml:mi>\r\n" +
            "    </mml:mrow>\r\n" +
            "  </mml:mfenced>\r\n" +
            "  <mml:mo mathcolor=\"#000000\">\u2194</mml:mo>\r\n" +
            "  <mml:mi mathcolor=\"#000000\">x</mml:mi>\r\n" +
            "  <mml:mo mathcolor=\"#000000\">\u2286</mml:mo>\r\n" +
            "  <mml:mi mathcolor=\"#000000\">A</mml:mi>\r\n" +
            "</mml:math>";

        if (mathEditor2.ActualTheme == ElementTheme.Dark)
        {
            mathEditor2.Document.SetMathML(formulaMathML.Replace("mathcolor=\"#000000\"", "mathcolor=\"#FFFFFF\""));
        }
        else
        {
            mathEditor2.Document.SetMathML(formulaMathML.Replace("mathcolor=\"#FFFFFF\"", "mathcolor=\"#000000\""));
        }
    }

    private static string FormatMathML(string mathML)
    {
        try
        {
            XDocument doc = XDocument.Parse(mathML);
            return doc.ToString(); // This automatically formats with proper indentation
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Error formatting MathML: {ex.Message}");
            return mathML; // Return the original in case of an error
        }
    }
}

```

## 示例文件

### CustomEditorRicheditbox.txt
```
--- header
A custom editor with RichEditBox.
--- xaml
<RelativePanel Margin="0,0,0,20" HorizontalAlignment="Stretch">
    <RelativePanel.Resources>
        <Style TargetType="Button">
            <Setter Property="BorderThickness" Value="0" />
            <Setter Property="Background" Value="Transparent"/>
            <Setter Property="Margin" Value="0,0,8,0" />
        </Style>
    </RelativePanel.Resources>
    <Button x:Name="openFileButton" Click="OpenButton_Click" AutomationProperties.Name="Open file" ToolTipService.ToolTip="Open file">
        <Button.Content>
            <FontIcon Glyph="&#xE8E5;"/>
        </Button.Content>
    </Button>
    <Button Click="SaveButton_Click" AutomationProperties.Name="Save file" ToolTipService.ToolTip="Save file" 
            RelativePanel.RightOf="openFileButton">
        <Button.Content>
            <FontIcon Glyph="&#xE74E;"/>
        </Button.Content>
    </Button>
    <Button AutomationProperties.Name="Bold" ToolTipService.ToolTip="Bold" Click="BoldButton_Click" 
            RelativePanel.LeftOf="italicButton" >
        <Button.Content>
            <FontIcon Glyph="&#xE8DD;"/>
        </Button.Content>
    </Button>
    <Button x:Name="italicButton" Click="ItalicButton_Click" AutomationProperties.Name="Italic" ToolTipService.ToolTip="Italic" 
            RelativePanel.LeftOf="fontColorButton">
        <Button.Content>
            <FontIcon Glyph="&#xE8DB;"/>
        </Button.Content>
    </Button>

    <DropDownButton x:Name="fontColorButton" AutomationProperties.Name="Font color"
                                BorderThickness="0" ToolTipService.ToolTip="Font color"
                                Background="Transparent" 
                                RelativePanel.AlignRightWithPanel="True">
        <SymbolIcon Symbol="FontColor"/>
        <DropDownButton.Flyout>
            <Flyout Placement="Bottom">
                <VariableSizedWrapGrid Orientation="Horizontal" MaximumRowsOrColumns="3">
                    <VariableSizedWrapGrid.Resources>
                        <Style TargetType="Rectangle">
                            <Setter Property="Width" Value="32"/>
                            <Setter Property="Height" Value="32"/>
                        </Style>
                        <Style TargetType="Button">
                            <Setter Property="Padding" Value="0"/>
                            <Setter Property="MinWidth" Value="0"/>
                            <Setter Property="MinHeight" Value="0"/>
                            <Setter Property="Margin" Value="6"/>
                        </Style>
                    </VariableSizedWrapGrid.Resources>
                    <Button Click="ColorButton_Click" AutomationProperties.Name="Red">
                        <Button.Content>
                            <Rectangle Fill="Red"/>
                        </Button.Content>
                    </Button>
                    <Button Click="ColorButton_Click" AutomationProperties.Name="Orange">
                        <Button.Content>
                            <Rectangle Fill="Orange"/>
                        </Button.Content>
                    </Button>
                    <Button Click="ColorButton_Click" AutomationProperties.Name="Yellow">
                        <Button.Content>
                            <Rectangle Fill="Yellow"/>
                        </Button.Content>
                    </Button>
                    <Button Click="ColorButton_Click" AutomationProperties.Name="Green">
                        <Button.Content>
                            <Rectangle Fill="Green"/>
                        </Button.Content>
                    </Button>
                    <Button Click="ColorButton_Click" AutomationProperties.Name="Blue">
                        <Button.Content>
                            <Rectangle Fill="Blue"/>
                        </Button.Content>
                    </Button>
                    <Button Click="ColorButton_Click" AutomationProperties.Name="Indigo">
                        <Button.Content>
                            <Rectangle Fill="Indigo"/>
                        </Button.Content>
                    </Button>
                    <Button Click="ColorButton_Click" AutomationProperties.Name="Violet">
                        <Button.Content>
                            <Rectangle Fill="Violet"/>
                        </Button.Content>
                    </Button>
                    <Button Click="ColorButton_Click" AutomationProperties.Name="Gray">
                        <Button.Content>
                            <Rectangle Fill="Gray"/>
                        </Button.Content>
                    </Button>
                </VariableSizedWrapGrid>
            </Flyout>
        </DropDownButton.Flyout>
    </DropDownButton>

    <RichEditBox x:Name="editor" Height="200" AutomationProperties.Name="Custom editor"
                    RelativePanel.Below="openFileButton" 
                    RelativePanel.AlignLeftWithPanel="True" 
                    RelativePanel.AlignRightWithPanel="True" 
                    TextChanged="Editor_TextChanged"
                    GotFocus="Editor_GotFocus"/>
    <StackPanel Orientation="Horizontal" 
                RelativePanel.Below="editor" 
                RelativePanel.AlignLeftWith="editor" 
                Margin="0,10,0,0">
        <TextBlock x:Name="findBoxLabel" Text="Find:" Height="20"/>
        <TextBox x:Name="findBox" Width="150" PlaceholderText="Enter search text" Margin="10,0,0,0"
                TextChanged="{x:Bind FindBoxHighlightMatches}" 
                GotFocus="{x:Bind FindBoxHighlightMatches}" 
                LostFocus="{x:Bind FindBoxRemoveHighlights}"/>
    </StackPanel>
</RelativePanel>
--- c#
private async void OpenButton_Click(object sender, RoutedEventArgs e)
{
    if (sender is Button button)
    {
        // Create the picker using the AppWindowId from the element
        var picker = new FileOpenPicker(button.XamlRoot.ContentIslandEnvironment.AppWindowId)
        {
            SuggestedStartLocation = PickerLocationId.DocumentsLibrary
        };

        // Add file type filters
        picker.FileTypeFilter.Add(".rtf");

        // Show picker
        PickFileResult result = await picker.PickSingleFileAsync();

        if (result != null)
        {
            // Open with StorageFile (needed for RichEditBox)
            StorageFile file = await StorageFile.GetFileFromPathAsync(result.Path);

            using IRandomAccessStream randAccStream =
                await file.OpenAsync(FileAccessMode.Read);

            // Load file into the RichEditBox
            editor.Document.LoadFromStream(TextSetOptions.FormatRtf, randAccStream);
        }
    }
}

private async void SaveButton_Click(object sender, RoutedEventArgs e)
{
    if (sender is Button button)
    {
        // Create the picker with AppWindowId
        var savePicker = new FileSavePicker(button.XamlRoot.ContentIslandEnvironment.AppWindowId)
        {
            SuggestedStartLocation = PickerLocationId.DocumentsLibrary,
            SuggestedFileName = "New Document"
        };

        // Dropdown of file types the user can save the file as
        savePicker.FileTypeChoices.Add("Rich Text", new List<string>() { ".rtf" });

        // Show picker
        PickFileResult result = await savePicker.PickSaveFileAsync();

        if (result != null)
        {
            // Convert PickSaveFileResult to StorageFile
            StorageFile file = await StorageFile.GetFileFromPathAsync(result.Path);

            // Prevent updates to the remote version of the file until complete
            CachedFileManager.DeferUpdates(file);

            // Write content into the file
            using IRandomAccessStream randAccStream =
                await file.OpenAsync(FileAccessMode.ReadWrite);

            editor.Document.SaveToStream(TextGetOptions.FormatRtf, randAccStream);

            // Finalize file updates
            FileUpdateStatus status = await CachedFileManager.CompleteUpdatesAsync(file);

            if (status != FileUpdateStatus.Complete)
            {
                var errorBox = new Windows.UI.Popups.MessageDialog(
                    $"File {file.Name} couldn't be saved.");
                await errorBox.ShowAsync();
            }
        }
    }
}

private void BoldButton_Click(object sender, RoutedEventArgs e)
{
    editor.Document.Selection.CharacterFormat.Bold = FormatEffect.Toggle;
}

private void ItalicButton_Click(object sender, RoutedEventArgs e)
{
    editor.Document.Selection.CharacterFormat.Italic = FormatEffect.Toggle;
}

private void ColorButton_Click(object sender, RoutedEventArgs e)
{
    // Extract the color of the button that was clicked.
    Button clickedColor = (Button)sender;
    var rectangle = (Microsoft.UI.Xaml.Shapes.Rectangle)clickedColor.Content;
    var color = ((Microsoft.UI.Xaml.Media.SolidColorBrush)rectangle.Fill).Color;

    editor.Document.Selection.CharacterFormat.ForegroundColor = color;

    fontColorButton.Flyout.Hide();
    editor.Focus(Microsoft.UI.Xaml.FocusState.Keyboard);
}

private void FindBoxHighlightMatches()
{
    FindBoxRemoveHighlights();

    Color highlightBackgroundColor = (Color)App.Current.Resources["SystemColorHighlightColor"];
    Color highlightForegroundColor = (Color)App.Current.Resources["SystemColorHighlightTextColor"];

    string textToFind = findBox.Text;
    if (textToFind != null)
    {
        ITextRange searchRange = editor.Document.GetRange(0, 0);
        while (searchRange.FindText(textToFind, TextConstants.MaxUnitCount, FindOptions.None) > 0)
        {
            searchRange.CharacterFormat.BackgroundColor = highlightBackgroundColor;
            searchRange.CharacterFormat.ForegroundColor = highlightForegroundColor;
        }
    }
}

private void FindBoxRemoveHighlights()
{
    if (editor.Background is not SolidColorBrush defaultBackground ||
        editor.Foreground is not SolidColorBrush defaultForeground)
    {
        return;
    }

    ITextRange documentRange = editor.Document.GetRange(0, TextConstants.MaxUnitCount);

    documentRange.CharacterFormat.BackgroundColor = defaultBackground.Color;
    documentRange.CharacterFormat.ForegroundColor = defaultForeground.Color;
}

private void Editor_GotFocus(object sender, RoutedEventArgs e)
{
    editor.Document.GetText(TextGetOptions.UseCrlf, out _);
            
    // reset colors to correct defaults for Focused state
    ITextRange documentRange = editor.Document.GetRange(0, TextConstants.MaxUnitCount);
    SolidColorBrush background = (SolidColorBrush)App.Current.Resources["TextControlBackgroundFocused"];

    if (background != null)
    {
        documentRange.CharacterFormat.BackgroundColor = background.Color;
    }
}

private void Editor_TextChanged(object sender, RoutedEventArgs e)
{
    editor.Document.Selection.CharacterFormat.ForegroundColor = currentColor;
}
```

### CustomizingRicheditboxCommandbarflyoutAdding.txt
```
--- header
Customizing RichEditBox's CommandBarFlyout - Adding 'Share'
--- xaml
<RichEditBox x:Name="REBCustom" 
    AutomationProperties.Name="editor with custom menu"
    Width="800" Height="200" 
    Loaded="REBCustom_Loaded" 
    Unloaded="REBCustom_Unloaded"/>
--- c#
private void Menu_Opening(object sender, object e)
{
    if (sender is not CommandBarFlyout myFlyout)
    {
        return;
    }

    if (myFlyout.Target == REBCustom)
    {
        AppBarButton myButton = new AppBarButton();
        myButton.Command = new StandardUICommand(StandardUICommandKind.Share);
        myFlyout.PrimaryCommands.Add(myButton);
    }
}

private void REBCustom_Loaded(object sender, RoutedEventArgs e)
{
    REBCustom.SelectionFlyout.Opening += Menu_Opening;
    REBCustom.ContextFlyout.Opening += Menu_Opening;
}

private void REBCustom_Unloaded(object sender, RoutedEventArgs e)
{
    REBCustom.SelectionFlyout.Opening -= Menu_Opening;
    REBCustom.ContextFlyout.Opening -= Menu_Opening;
}
```

### RichEditBoxMath.txt
```
--- header
Rich edit box in math mode
--- xaml
<RichEditBox x:Name="mathEditor" FontSize="16" />
--- c#
mathEditor.TextDocument.SetMathMode(RichEditMathMode.MathOnly);
```

### SimpleTextEditorRicheditbox.txt
```
--- header
A simple text editor using RichEditBox.
--- xaml
<RichEditBox x:Name="editor" AutomationProperties.Name="simple text editor"/>
```

### WorkingMathmlRicheditbox.txt
```
--- header
Working with MathML in RichEditBox
--- xaml
<RichEditBox x:Name="mathEditor2" FontSize="16" />
--- c#
mathEditor2.TextDocument.SetMathMode(RichEditMathMode.MathOnly);

private void mathEditor2_TextChanged(object sender, RoutedEventArgs e)
{
    // Extracts the MathML content from the RichEditBox
    string extractedMathML;
    mathEditor2.Document.GetMathML(out extractedMathML);
    
    // If MathML content is available, format and display it in the MathML presenter
    if (!string.IsNullOrEmpty(extractedMathML))
    {
        MathmlPresenter.Code = MathModeHelper.FormatMathML(extractedMathML);
    }
    else
    {
        // If no MathML content exists, display a placeholder comment
        MathmlPresenter.Code = "<!-- No MathML content -->";
    }
}

private void SetMathmlFormulaBtn_Click(object sender, RoutedEventArgs e)
{
    // Defines a formula in MathML format
    string formulaMathML =
        "<mml:math xmlns:mml=\"http://www.w3.org/1998/Math/MathML\" display=\"block\">\r\n" +
        "  <mml:mi mathcolor=\"#000000\">x</mml:mi>\r\n" +
        "  <mml:mo mathcolor=\"#000000\">\u2208</mml:mo>\r\n" +
        "  <mml:mi mathcolor=\"#000000\">P</mml:mi>\r\n" +
        "  <mml:mfenced>\r\n" +
        "    <mml:mrow>\r\n" +
        "      <mml:mi mathcolor=\"#000000\">A</mml:mi>\r\n" +
        "    </mml:mrow>\r\n" +
        "  </mml:mfenced>\r\n" +
        "  <mml:mo mathcolor=\"#000000\">\u2194</mml:mo>\r\n" +
        "  <mml:mi mathcolor=\"#000000\">x</mml:mi>\r\n" +
        "  <mml:mo mathcolor=\"#000000\">\u2286</mml:mo>\r\n" +
        "  <mml:mi mathcolor=\"#000000\">A</mml:mi>\r\n" +
        "</mml:math>";

    // Adjusts text color based on the current app theme
    if(mathEditor2.ActualTheme == ElementTheme.Dark)
    {
        // If in dark mode, set text color to white
        mathEditor2.Document.SetMathML(formulaMathML.Replace("mathcolor=\"#000000\"", "mathcolor=\"#FFFFFF\""));
    }
    else
    {
        // If in light mode, set text color to black
        mathEditor2.Document.SetMathML(formulaMathML.Replace("mathcolor=\"#FFFFFF\"", "mathcolor=\"#000000\""));
    }
}
```


# RichTextBlock

## 主页面 XAML (RichTextBlockPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.RichTextBlockPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="RichTextBlock\SimpleRichtextblock.txt">
            <controls:ControlExample.Example>
                <RichTextBlock>
                    <Paragraph>I am a RichTextBlock.</Paragraph>
                </RichTextBlock>
            </controls:ControlExample.Example>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example2" SampleDefinition="RichTextBlock\RichtextblockCustomSelectionHighlight.txt">
            <controls:ControlExample.Example>
                <RichTextBlock SelectionHighlightColor="Green">
                    <Paragraph>
                        RichTextBlock provides a rich text display container that supports<Run FontStyle="Italic" FontWeight="Bold">formatted text</Run>
                        , <Hyperlink NavigateUri="https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.Documents.Hyperlink">hyperlinks</Hyperlink>
                        , inline images, and other rich content.</Paragraph>
                    <Paragraph>RichTextBlock also supports a built-in overflow model.</Paragraph>
                </RichTextBlock>
            </controls:ControlExample.Example>
        </controls:ControlExample>
        <controls:ControlExample
            x:Name="Example3"
            HorizontalContentAlignment="Stretch"
            SampleDefinition="RichTextBlock\RichtextblockOverflow.txt">
            <controls:ControlExample.Example>
                <Grid Height="300">
                    <Grid.ColumnDefinitions>
                        <ColumnDefinition />
                        <ColumnDefinition />
                        <ColumnDefinition />
                    </Grid.ColumnDefinitions>
                    <RichTextBlock
                        Grid.Column="0"
                        Margin="12,0"
                        OverflowContentTarget="{x:Bind firstOverflowContainer}"
                        TextAlignment="Justify">
                        <Paragraph>Linked text containers allow text which does not fit in one element to overflow into a different element on the page. Creative use of linked text containers enables basic multicolumn support and other advanced page layouts.</Paragraph>
                        <Paragraph>
                            Duis sed nulla metus, id hendrerit velit. Curabitur dolor purus, bibendum eu cursus lacinia, interdum vel augue. Aenean euismod eros et sapien vehicula dictum. Duis ullamcorper, turpis nec feugiat tincidunt, dui erat luctus risus, aliquam accumsan lacus est vel quam. Nunc lacus massa, varius eget accumsan id, congue sed orci. Duis dignissim hendrerit egestas. Proin ut turpis magna, sit amet porta erat. Nunc semper metus nec magna imperdiet nec vestibulum dui fringilla. Sed sed ante libero, nec porttitor mi. Ut luctus, neque vitae placerat egestas, urna leo auctor magna, sit amet ultricies ipsum felis quis sapien. Proin eleifend varius dui, at vestibulum nunc consectetur nec. Mauris nulla elit, ultrices a sodales non, aliquam ac est. Quisque sit amet risus nulla. Quisque vestibulum posuere velit, vitae vestibulum eros scelerisque sit amet. In in risus est, at laoreet dolor. Nullam aliquet pellentesque convallis. Ut vel tincidunt nulla. Mauris auctor tincidunt auctor.
                            Aenean orci ante, vulputate ac sagittis sit amet, consequat at mi. Morbi elementum purus consectetur nisi adipiscing vitae blandit sapien placerat. Aliquam adipiscing tortor non sem lobortis consectetur mattis felis rhoncus. Nunc eu nunc rhoncus arcu sollicitudin ultrices. In vulputate eros in mauris aliquam id dignissim nisl laoreet.
                        </Paragraph>
                    </RichTextBlock>
                    <RichTextBlockOverflow
                        x:Name="firstOverflowContainer"
                        Grid.Column="1"
                        Margin="12,0"
                        AutomationProperties.Name="firstOverflowContainer"
                        OverflowContentTarget="{x:Bind secondOverflowContainer}" />
                    <RichTextBlockOverflow
                        x:Name="secondOverflowContainer"
                        Grid.Column="2"
                        Margin="12,0"
                        AutomationProperties.Name="secondOverflowContainer" />
                </Grid>
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample SampleDefinition="RichTextBlock\RichtextblockCustomTexthighlighting.txt">
            <controls:ControlExample.Example>
                <RichTextBlock x:Name="TextHighlightingRichTextBlock">
                    <Paragraph>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
                    </Paragraph>
                </RichTextBlock>
            </controls:ControlExample.Example>
            <controls:ControlExample.Options>
                <StackPanel>
                    <ComboBox Header="Text highlighting color" SelectionChanged="HighlightColorCombobox_SelectionChanged">
                        <ComboBoxItem Content="Yellow" IsSelected="True" />
                        <ComboBoxItem Content="Red" />
                        <ComboBoxItem Content="Blue" />
                    </ComboBox>
                </StackPanel>
            </controls:ControlExample.Options>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (RichTextBlockPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Documents;
using Microsoft.UI.Xaml.Media;

namespace WinUIGallery.ControlPages;

public sealed partial class RichTextBlockPage : Page
{
    public RichTextBlockPage()
    {
        this.InitializeComponent();
    }


    private void HighlightColorCombobox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        // Get color to use
        var selectedItem = (sender as ComboBox)?.SelectedItem as ComboBoxItem;
        var color = Colors.Yellow;
        switch (selectedItem?.Content as string)
        {
            case "Yellow":
                color = Colors.Yellow;
                break;
            case "Red":
                color = Colors.Red;
                break;
            case "Blue":
                color = Colors.Blue;
                break;
        }

        // Get text range and highlighter
        TextRange textRange = new TextRange()
        {
            StartIndex = 28,
            Length = 11
        };
        TextHighlighter highlighter = new TextHighlighter()
        {
            Background = new SolidColorBrush(color),
            Ranges = { textRange }
        };

        // Switch texthighlighter
        TextHighlightingRichTextBlock.TextHighlighters.Clear();
        TextHighlightingRichTextBlock.TextHighlighters.Add(highlighter);
    }
}

```

## 示例文件

### RichtextblockCustomSelectionHighlight.txt
```
--- header
A RichTextBlock with a custom selection highlight color.
--- xaml
<RichTextBlock SelectionHighlightColor="Green">
    <Paragraph>RichTextBlock provides a rich text display container that supports
        <Run FontStyle="Italic" FontWeight="Bold">formatted text</Run>,
        <Hyperlink NavigateUri="https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.Documents.Hyperlink">hyperlinks</Hyperlink>, inline images, and other rich content.</Paragraph>
    <Paragraph>RichTextBlock also supports a built-in overflow model.</Paragraph>
</RichTextBlock>
```

### RichtextblockCustomTexthighlighting.txt
```
--- header
RichTextBlock with custom TextHighlighting
--- xaml
<RichTextBlock x:Name="TextHighlightingRichTextBlock">
    <Paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
    </Paragraph>
</RichTextBlock>
--- c#
private void HighlightColorCombobox_SelectionChanged(object sender, SelectionChangedEventArgs e)
{
    // Get color to use
    var selectedItem = (sender as ComboBox).SelectedItem as ComboBoxItem;
    var color = Colors.Yellow;
    switch (selectedItem.Content as string)
    {
        case "Yellow":
            color = Colors.Yellow;
            break;
        case "Red":
            color = Colors.Red;
            break;
        case "Blue":
            color = Colors.Blue;
            break;
    }

    // Get text range and highlighter
    TextRange textRange = new TextRange()
    {
        StartIndex = 28,
        Length = 11
    };
    TextHighlighter highlighter = new TextHighlighter()
    {
        Background = new SolidColorBrush(color),
        Ranges = { textRange }
    };

    // Switch texthighlighter
    TextHighlightingRichTextBlock.TextHighlighters.Clear();
    TextHighlightingRichTextBlock.TextHighlighters.Add(highlighter);
}
```

### RichtextblockOverflow.txt
```
--- header
A RichTextBlock with overflow.
--- xaml
<Grid>
    <Grid.ColumnDefinitions>
        <ColumnDefinition/>
        <ColumnDefinition/>
        <ColumnDefinition/>
    <Grid.ColumnDefinitions>
    <RichTextBlock Grid.Column="0" OverflowContentTarget="{x:Bind firstOverflowContainer}" TextAlignment="Justify" Margin="12,0">
        <Paragraph>
            Linked text containers allow text which does not fit in one element to overflow into a different element on the page.
            Creative use of linked text containers enables basic multicolumn support and other advanced page layouts.
        </Paragraph>
    <!-- Additional content not shown. -->
    </RichTextBlock>
    <RichTextBlockOverflow x:Name="firstOverflowContainer" OverflowContentTarget="{x:Bind secondOverflowContainer}" Grid.Column="1" Margin="12,0"/>
    <RichTextBlockOverflow x:Name="secondOverflowContainer" Grid.Column="2" Margin="12,0"/>
</Grid>
```

### SimpleRichtextblock.txt
```
--- header
A simple RichTextBlock.
--- xaml
<RichTextBlock>
    <Paragraph>I am a RichTextBlock.</Paragraph>
</RichTextBlock>
```


# TextBlock

## 主页面 XAML (TextBlockPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.TextBlockPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <Page.Resources>
        <Style x:Key="CustomTextBlockStyle" TargetType="TextBlock">
            <Setter Property="FontFamily" Value="Comic Sans MS" />
            <Setter Property="FontStyle" Value="Italic" />
        </Style>
    </Page.Resources>
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="TextBlock\SimpleTextblock.txt">
            <controls:ControlExample.Example>
                <TextBlock Text="I am a TextBlock." />
            </controls:ControlExample.Example>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example2" SampleDefinition="TextBlock\TextblockStyleApplied.txt">
            <controls:ControlExample.Example>
                <TextBlock Style="{StaticResource CustomTextBlockStyle}" Text="I am a styled TextBlock." />
            </controls:ControlExample.Example>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example3" SampleDefinition="TextBlock\TextblockVariousProperties.txt">
            <controls:ControlExample.Example>
                <TextBlock
                    CharacterSpacing="200"
                    FontFamily="Arial"
                    FontSize="24"
                    FontStyle="Italic"
                    Foreground="CornflowerBlue"
                    Text="I am super excited to be here!"
                    TextWrapping="WrapWholeWords" />
            </controls:ControlExample.Example>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example4" SampleDefinition="TextBlock\TextblockInlineTextElements.txt">
            <controls:ControlExample.Example>
                <TextBlock>
                    <Run FontFamily="Times New Roman" Foreground="DarkGray">Text in a TextBlock doesn't have to be a simple string.</Run>
                    <LineBreak />
                    <Span>
                        Text can be <Bold>bold</Bold>, <Italic>italic</Italic>, or <Underline>underlined</Underline>.
                    </Span>
                </TextBlock>
            </controls:ControlExample.Example>
        </controls:ControlExample>

        <controls:ControlExample x:Name="Example5" SampleDefinition="TextBlock\SelectableTextblock.txt">
            <controls:ControlExample.Example>
                <TextBlock
                    IsTextSelectionEnabled="{x:Bind SelectionEnabledSwitch.IsOn, Mode=OneWay}"
                    SelectionHighlightColor="DarkOrange"
                    Text="I am a selectable TextBlock with custom SelectionHighlightColor." />
            </controls:ControlExample.Example>

            <controls:ControlExample.Options>
                <ToggleSwitch x:Name="SelectionEnabledSwitch" Header="IsTextSelectionEnabled" />
            </controls:ControlExample.Options>
            <controls:ControlExample.Substitutions>
                <controls:ControlExampleSubstitution Key="IsTextSelectionEnabled" Value="{x:Bind SelectionEnabledSwitch.IsOn, Mode=OneWay}" />
            </controls:ControlExample.Substitutions>
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (TextBlockPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class TextBlockPage : Page
{
    public TextBlockPage()
    {
        this.InitializeComponent();
    }
}

```

## 示例文件

### SelectableTextblock.txt
```
--- header
A selectable TextBlock
--- xaml
<TextBlock IsTextSelectionEnabled="$(IsTextSelectionEnabled)"
           Text="I am a selectable TextBlock with custom SelectionHighlightColor."
           SelectionHighlightColor="DarkOrange">
```

### SimpleTextblock.txt
```
--- header
A simple TextBlock.
--- xaml
<TextBlock Text="I am a TextBlock"/>
```

### TextblockInlineTextElements.txt
```
--- header
A TextBlock with inline text elements.
--- xaml
<TextBlock>
    <Run FontFamily="Times New Roman" Foreground="DarkGray">Text in a TextBlock doesn't have to be a simple string.</Run>
    <LineBreak />
    <Span>
        Text can be <Bold>bold</Bold>, <Italic>italic</Italic>, or <Underline>underlined</Underline>.
    </Span>
</TextBlock>
```

### TextblockStyleApplied.txt
```
--- header
A TextBlock with a style applied.
--- xaml
<Page.Resources>
    <Style TargetType="TextBlock" x:Key="CustomTextBlockStyle">
        <Setter Property="FontFamily" Value="Comic Sans MS"/>
        <Setter Property="FontStyle" Value="Italic"/>
    </Style>
<Page.Resources>

<TextBlock Text="I am a styled TextBlock" Style="{StaticResource CustomTextBlockStyle}"/>
```

### TextblockVariousProperties.txt
```
--- header
A TextBlock with various properties set.
--- xaml
<TextBlock Text="I am super excited to be here!" FontFamily="Arial"
    FontSize="24" FontStyle="Italic" TextWrapping="WrapWholeWords"
    CharacterSpacing="200" Foreground="CornflowerBlue" />
```


# TextBox

## 主页面 XAML (TextBoxPage.xaml)
```xaml
<!--
    //*********************************************************
    //
    // Copyright (c) Microsoft. All rights reserved.
    // THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
    // ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
    // IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
    // PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
    //
    //*********************************************************
-->
<Page
    x:Class="WinUIGallery.ControlPages.TextBoxPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:controls="using:WinUIGallery.Controls"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <StackPanel>
        <controls:ControlExample x:Name="Example1" SampleDefinition="TextBox\SimpleTextbox.txt">
            <TextBox AutomationProperties.Name="simple TextBox" />
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example2" SampleDefinition="TextBox\TextboxHeaderPlaceholderText.txt">
            <controls:ControlExample.Example>
                <TextBox Header="Enter your name:" PlaceholderText="Name" />
            </controls:ControlExample.Example>
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example3" SampleDefinition="TextBox\ReadOnlyTextboxVarious.txt">
            <TextBox
                AutomationProperties.Name="customized TextBox"
                CharacterSpacing="200"
                FontFamily="Arial"
                FontSize="24"
                FontStyle="Italic"
                Foreground="#5178BE"
                IsReadOnly="True"
                Text="I am super excited to be here!" />
        </controls:ControlExample>
        <controls:ControlExample x:Name="Example4" SampleDefinition="TextBox\MultiLineTextboxSpell.txt">
            <TextBox
                MinWidth="400"
                AcceptsReturn="True"
                AutomationProperties.Name="multi-line TextBox"
                IsSpellCheckEnabled="True"
                SelectionHighlightColor="Green"
                TextWrapping="Wrap" />
        </controls:ControlExample>
    </StackPanel>
</Page>

```

## 主页面 C# (TextBoxPage.xaml.cs)
```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class TextBoxPage : Page
{
    public TextBoxPage()
    {
        this.InitializeComponent();
    }
}

```

## 示例文件

### MultiLineTextboxSpell.txt
```
--- header
A multi-line TextBox with spell checking and custom selection highlight color.
--- xaml
<TextBox AutomationProperties.Name="multi-line TextBox"
    TextWrapping="Wrap" AcceptsReturn="True" IsSpellCheckEnabled="True"
    SelectionHighlightColor="Green" MinWidth="400" />
```

### ReadOnlyTextboxVarious.txt
```
--- header
A read-only TextBox with various properties set.
--- xaml
<TextBox Text="I am super excited to be here!"
    AutomationProperties.Name="customized TextBox" IsReadOnly="True"
    FontFamily="Arial" FontSize="24" FontStyle="Italic"
    CharacterSpacing="200" Foreground="#5178BE" />
```

### SimpleTextbox.txt
```
--- header
A simple TextBox.
--- xaml
<TextBox AutomationProperties.Name="simple TextBox"/>
```

### TextboxHeaderPlaceholderText.txt
```
--- header
A TextBox with a header and placeholder text.
--- xaml
<TextBox Header="Enter your name:" PlaceholderText="Name" />
```

