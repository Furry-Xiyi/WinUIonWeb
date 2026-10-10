import{Ai as e,Bi as t,Cn as n,Ji as r,Mn as i,Ni as a,Wi as o,Xi as s,Yi as c,_i as l,bi as u,ci as d,dr as f,gi as p,ki as ee,o as m,p as h,qi as g,t as _,ui as v,wi as y,yi as b}from"./ScrollViewer-DXAtwYnH.js";import{t as x}from"./Button-1Ztf3pH0.js";import{t as S}from"./Frame-B7FJ061Y.js";import{t as C}from"./StackPanel-DGz4UnE4.js";import"./MenuFlyoutItems-CR9hagyh.js";import{t as w}from"./ComboBox-yrHI7YvG.js";import{t as T}from"./ControlExample-BX-yRpiQ.js";import{d as E,f as te,i as ne,l as re,m as D,o as ie,p as O,t as k,u as A}from"./tabViewWindowStatus-Bzzv8Bpb.js";import{t as j}from"./MenuFlyout-DeJfSyub.js";import{t as M}from"./pageState-cPponcIo.js";var N=`--- header
Complete TabView windowing sample
--- xaml
<Page
    x:Class="WinUIGallery.SamplePages.TabViewWindowingSamplePage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:local="using:WinUIGallery.SamplePages"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    Background="{ThemeResource ApplicationPageBackgroundThemeBrush}"
    mc:Ignorable="d">

    <Grid HorizontalAlignment="Stretch" VerticalAlignment="Stretch">
        <TabView
            x:Name="Tabs"
            VerticalAlignment="Stretch"
            AddTabButtonClick="Tabs_AddTabButtonClick"
            CanTearOutTabs="True"
            ExternalTornOutTabsDropped="Tabs_ExternalTornOutTabsDropped"
            ExternalTornOutTabsDropping="Tabs_ExternalTornOutTabsDropping"
            TabCloseRequested="Tabs_TabCloseRequested"
            TabTearOutRequested="Tabs_TabTearOutRequested"
            TabTearOutWindowRequested="Tabs_TabTearOutWindowRequested">
            <TabView.TabStripHeader>
                <Grid x:Name="ShellTitleBarInset" Background="Transparent" />
            </TabView.TabStripHeader>
            <TabView.TabStripFooter>
                <Grid x:Name="CustomDragRegion" Background="Transparent" />
            </TabView.TabStripFooter>
        </TabView>
    </Grid>
</Page>
--- c#
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media;
using System.Linq;
using WinUIGallery.Helpers;

namespace WinUIGallery.SamplePages;

public sealed partial class TabViewWindowingSamplePage : Page
{
    private Window? tabTearOutWindow = null;

    public TabViewWindowingSamplePage()
    {
        this.InitializeComponent();

        Loaded += TabViewWindowingSamplePage_Loaded;
    }

    private void TabViewWindowingSamplePage_Loaded(object sender, RoutedEventArgs e)
    {
        if (WindowHelper.GetWindowForElement(this) is not Window currentWindow)
        {
            return;
        }

        currentWindow.ExtendsContentIntoTitleBar = true;
        currentWindow.SetTitleBar(CustomDragRegion);
        CustomDragRegion.MinWidth = 188;

        // Set minimum window size using OverlappedPresenter (requires XamlRoot, so must be done after Loaded).
        WindowHelper.SetWindowMinSize(currentWindow, 500, 300);
    }

    public void LoadDemoData()
    {
        // Main Window -- add some default items
        for (int i = 0; i < 3; i++)
        {
            Tabs.TabItems.Add(new TabViewItem() { IconSource = new Microsoft.UI.Xaml.Controls.SymbolIconSource() { Symbol = Symbol.Placeholder }, Header = $"Item {i}", Content = new TabContentSampleControl() { DataContext = $"Page {i}" } });
        }

        Tabs.SelectedIndex = 0;
    }

    public void AddTabToTabs(TabViewItem tab)
    {
        Tabs.TabItems.Add(tab);
    }

    private void Tabs_TabTearOutWindowRequested(TabView sender, TabViewTabTearOutWindowRequestedEventArgs args)
    {
        var newPage = new TabViewWindowingSamplePage();

        tabTearOutWindow = WindowHelper.CreateWindow();
        tabTearOutWindow.ExtendsContentIntoTitleBar = true;
        tabTearOutWindow.Content = newPage;
        tabTearOutWindow.AppWindow.SetIcon("Assets/Tiles/GalleryIcon.ico");

        args.NewWindowId = tabTearOutWindow.AppWindow.Id;
    }

    private void Tabs_TabTearOutRequested(TabView sender, TabViewTabTearOutRequestedEventArgs args)
    {
        if (tabTearOutWindow == null)
        {
            return;
        }

        var newPage = (TabViewWindowingSamplePage)tabTearOutWindow.Content;

        foreach (TabViewItem tab in args.Tabs.Cast<TabViewItem>())
        {
            GetParentTabView(tab)?.TabItems.Remove(tab);
            newPage.AddTabToTabs(tab);
        }

        // Clear the reference now that the tear-out is complete to avoid stale references
        // if multiple tear-outs happen in sequence.
        tabTearOutWindow = null;

        // Close the source window if all tabs have been torn out.
        CloseWindowIfEmpty(sender);
    }

    private void Tabs_ExternalTornOutTabsDropping(TabView sender, TabViewExternalTornOutTabsDroppingEventArgs args)
    {
        args.AllowDrop = true;
    }

    private void Tabs_ExternalTornOutTabsDropped(TabView sender, TabViewExternalTornOutTabsDroppedEventArgs args)
    {
        int position = 0;

        foreach (TabViewItem tab in args.Tabs.Cast<TabViewItem>())
        {
            // Find the source TabView before removing the tab, so we can check if it's empty afterwards.
            TabView? sourceTabView = GetParentTabView(tab);
            sourceTabView?.TabItems.Remove(tab);
            sender.TabItems.Insert(args.DropIndex + position, tab);
            position++;

            // Close the source window if all its tabs have been moved to this window.
            if (sourceTabView != null && sourceTabView.TabItems.Count == 0)
            {
                CloseWindowIfEmpty(sourceTabView);
            }
        }
    }

    private TabView? GetParentTabView(TabViewItem tab)
    {
        DependencyObject current = tab;

        while (current != null)
        {
            if (current is TabView tabView)
            {
                return tabView;
            }

            current = VisualTreeHelper.GetParent(current);
        }

        return null;
    }

    private void CloseWindowIfEmpty(TabView tabView)
    {
        if (tabView.TabItems.Count == 0)
        {
            // Find the window containing this TabView and close it.
            // Walk up from the TabView to find a Page, then use it to locate the window.
            DependencyObject current = tabView;
            while (current != null)
            {
                if (current is Page page)
                {
                    WindowHelper.GetWindowForElement(page)?.Close();
                    return;
                }

                current = VisualTreeHelper.GetParent(current);
            }
        }
    }

    private TabViewItem CreateNewTVI(string header, string dataContext)
    {
        var newTab = new TabViewItem()
        {
            IconSource = new SymbolIconSource()
            {
                Symbol = Symbol.Placeholder
            },
            Header = header,
            Content = new TabContentSampleControl()
            {
                DataContext = dataContext
            }
        };

        return newTab;
    }

    private void Tabs_AddTabButtonClick(TabView sender, object args)
    {
        var tab = CreateNewTVI("New Item", "New Item");
        sender.TabItems.Add(tab);
    }

    private void Tabs_TabCloseRequested(TabView sender, TabViewTabCloseRequestedEventArgs args)
    {
        sender.TabItems.Remove(args.Tab);
        CloseWindowIfEmpty(sender);
    }
}
`,P=`--- header
The close button can be persistent or only visible on hover
--- xaml
<TabView CloseButtonOverlayMode="$(CloseButtonOverlayMode)" />
`,F=`--- header
Tab widths can either be equally sized, sized to the content of the tab, or sized to only show the icon when unselected
--- xaml
<TabView TabWidthMode="$(TabWidthMode)" />
`,I=`--- header
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
`,L=`--- header
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
`,R=`--- header
A TabView bound to a collection of MyData objects
--- xaml
<TabView TabItemsSource="{x:Bind myDatas, Mode=OneWay}"
         AddTabButtonClick="TabViewItemsSourceSample_AddTabButtonClick"
         TabCloseRequested="TabViewItemsSourceSample_TabCloseRequested">
    <TabView.TabItemTemplate>
        <DataTemplate x:DataType="local:MyData">
            <TabViewItem Content="{x:Bind DataContent}"
                         Header="{x:Bind DataHeader}"
                         IconSource="{x:Bind DataIconSource}" />
        </DataTemplate>
    </TabView.TabItemTemplate>
</TabView>
--- c#
public class MyData
{
    public string DataHeader { get; set; } = string.Empty;
    public required IconSource DataIconSource { get; set; }
    public required object DataContent { get; set; }
}

private ObservableCollection<MyData> myDatas = new();

private void TabViewItemsSourceSample_AddTabButtonClick(TabView sender, object args)
{
    myDatas.Add(CreateNewMyData(myDatas.Count));
}

private void TabViewItemsSourceSample_TabCloseRequested(TabView sender, TabViewTabCloseRequestedEventArgs args)
{
    if (args.Item is MyData myData)
    {
        myDatas.Remove(myData);
    }
}
`,z=`--- header
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
`,B=`--- header
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
    if (args.Element is not TabView senderTabView)
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
`,V=`--- header
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
`,H=`--- header
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
`,U=i(l({__name:`TabViewPage`,setup(i){let l=Object.assign({"../samples/TabView/CompleteTabviewWindowingSample.txt":N,"../samples/TabView/TabViewCloseButtonBePersistent.txt":P,"../samples/TabView/TabViewTabWidthsEitherBe.txt":F,"../samples/TabView/TabViewYouPutCustomContent.txt":I,"../samples/TabView/TabviewAccentColoredTabstrip.txt":L,"../samples/TabView/TabviewBoundCollectionMydata.txt":R,"../samples/TabView/TabviewColorTabIcons.txt":z,"../samples/TabView/TabviewKeyboardingSupport.txt":B,"../samples/TabView/TabviewSupportAddingClosing.txt":V,"../samples/TabView/TabviewTabviewitemsDefinedMarkup.txt":H}),U=e=>{let t=l[`../samples/TabView/${e}`]??``,n={},r=``;for(let e of t.split(/\r?\n/)){let t=/^---\s+(.+?)\s*$/.exec(e);t?(r=t[1].toLowerCase(),n[r]=[]):r&&n[r].push(e)}return{xaml:(n.xaml??[]).join(`
`).trim(),cSharp:(n[`c#`]??[]).join(`
`).trim()}};U(`TabviewSupportAddingClosing.txt`),U(`TabviewTabviewitemsDefinedMarkup.txt`),U(`TabviewBoundCollectionMydata.txt`),U(`TabviewKeyboardingSupport.txt`),U(`TabViewYouPutCustomContent.txt`),U(`TabViewTabWidthsEitherBe.txt`),U(`TabViewCloseButtonBePersistent.txt`),U(`TabviewColorTabIcons.txt`),U(`TabviewAccentColoredTabstrip.txt`),U(`CompleteTabviewWindowingSample.txt`);let{t:W,locale:G}=h();d(()=>W(`TextControls.Control.TabView`));let{pageTheme:K}=M(u(`currentPage`)?.value||`tabview`),q=c({});e(f,q),d(()=>q.TabViewContextMenu),d(()=>q.TabView3),d(()=>q.TabView4);let J={AddingHeader:`adding-header`,MarkupHeader:`markup-header`,BindingHeader:`binding-header`,KeyboardHeader:`keyboard-header`,CustomHeader:`custom-header`,WidthHeader:`width-header`,CloseHeader:`close-header`,ColorHeader:`color-header`,AccentHeader:`accent-header`,WindowHeader:`window-header`,KeyboardNew:`keyboard-new`,KeyboardClose:`keyboard-close`,KeyboardNumber:`keyboard-number`,KeyboardLast:`keyboard-last`,CustomDescription:`custom-description`,CustomDragRegion:`custom-drag-region`,WindowSourceDescription:`window-source-description`,StripHeader:`strip-header`,StripFooter:`strip-footer`,Home:`home`,LongTab:`long-tab`,ThirdTab:`third-tab`,WidthOptionHeader:`width-option-header`,CloseOptionHeader:`close-option-header`,SizeToContent:`size-to-content`,Equal:`equal`,Compact:`compact`,Auto:`auto`,Always:`always`,OnHover:`on-hover`,ColorDescription:`color-description`,CommandPrompt:`command-prompt`,PowerShell:`powershell`,Linux:`linux`,Launch:`launch`};d(()=>({...Object.fromEntries(Object.entries(J).map(([e,t])=>[e,W(`sample.tabview.${t}`)])),Document0:W(`sample.tabview.document`,{index:0}),Document1:W(`sample.tabview.document`,{index:1}),Document2:W(`sample.tabview.document`,{index:2})})),g({});let Y=[O,te,E],ae=e=>o(b(S,{Content:o(b(Y[e%Y.length]))})),oe=e=>o({DataHeader:W(`sample.tabview.mydata-document`,{index:e}),DataIconSource:{Symbol:`Placeholder`},DataContent:ae(e)});c(Array.from({length:3},(e,t)=>oe(t)));let X=u(A,null),se=u(ie,null),Z=!X||se?ne({BaseUrl:new URL(`/WinUIonWeb/`,window.location.href).href,Locale:()=>G,Theme:()=>K.value===`dark`?`Dark`:`Light`}):null;Z?.Adapter??X??re();let Q=s(Z?.Capabilities??null),ce=Z?.Subscribe(e=>{Q.value=e});d(()=>k(Q.value,W,!0));let le=r(!1);d(()=>!le.value),r(``);let $=new AbortController;return y(()=>{$.abort(),ce?.(),Z&&Z.Dispose()}),(e,r)=>{let i=a(`SymbolIconSource`),o=a(`TabViewItem.IconSource`),s=a(`samplepages:SamplePage1`),c=a(`TabViewItem`),l=a(`samplepages:SamplePage2`),u=a(`samplepages:SamplePage3`),d=a(`DataTemplate`),f=a(`KeyboardAccelerator`),h=a(`ComboBoxItem`),g=a(`ControlExampleSubstitution`),y=a(`BitmapIconSource`),b=a(`SolidColorBrush`),S=a(`ResourceDictionary`),E=a(`ResourceDictionary.ThemeDictionaries`);return ee(),v(n,null,{default:t(()=>[p(n.Resources,null,{default:t(()=>[p(j,{"x:Name":`TabViewContextMenu`,Opening:`TabViewContextMenu_Opening`})]),_:1}),p(_,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[p(C,{class:`gallery-item-page`},{default:t(()=>[p(m,{MaxWidth:`1064`,HorizontalAlignment:`Left`,Margin:`0,4,24,0`,Style:`{ThemeResource BodyTextBlockStyle}`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(C,{class:`gallery-page-content`,HorizontalAlignment:`Stretch`},{default:t(()=>[p(T,{SampleDefinition:`TabView\\TabviewSupportAddingClosing.txt`,HeaderText:`{x:Bind Text.AddingHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Adding.xaml, Mode=OneWay}`,CSharp:`{x:Bind Samples.Adding.cSharp, Mode=OneWay}`},{default:t(()=>[p(T.Example,null,{default:t(()=>[p(D,{"x:Name":`TabView1`,MinHeight:`475`,Margin:`-12`,AddTabButtonClick:`TabView_AddButtonClick`,Loaded:`TabView_Loaded`,SelectedIndex:`0`,TabCloseRequested:`TabView_TabCloseRequested`,SelectionChanged:`TabView_Changed`,TabItemsChanged:`TabView_Changed`})]),_:1}),p(T.Output,null,{default:t(()=>[p(m,{Text:`{x:Bind Outputs.TabView1, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),p(T.Options)]),_:1}),p(T,{SampleDefinition:`TabView\\TabviewTabviewitemsDefinedMarkup.txt`,HeaderText:`{x:Bind Text.MarkupHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Markup.xaml, Mode=OneWay}`,CSharp:`{x:Bind Samples.Adding.cSharp, Mode=OneWay}`},{default:t(()=>[p(T.Example,null,{default:t(()=>[p(D,{"x:Name":`MarkupTabs`,MinHeight:`475`,Margin:`-12`,AddTabButtonClick:`TabView_AddButtonClick`,Loaded:`TabView_Changed`,SelectedIndex:`0`,TabCloseRequested:`TabView_TabCloseRequested`,SelectionChanged:`TabView_Changed`,TabItemsChanged:`TabView_Changed`},{default:t(()=>[p(D.TabItems,null,{default:t(()=>[p(c,{Header:`{x:Bind Text.Document0, Mode=OneWay}`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:t(()=>[p(o,null,{default:t(()=>[p(i,{Symbol:`Placeholder`})]),_:1}),p(s)]),_:1}),p(c,{Header:`{x:Bind Text.Document1, Mode=OneWay}`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:t(()=>[p(o,null,{default:t(()=>[p(i,{Symbol:`Placeholder`})]),_:1}),p(l)]),_:1}),p(c,{Header:`{x:Bind Text.Document2, Mode=OneWay}`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:t(()=>[p(o,null,{default:t(()=>[p(i,{Symbol:`Placeholder`})]),_:1}),p(u)]),_:1})]),_:1})]),_:1})]),_:1}),p(T.Output,null,{default:t(()=>[p(m,{Text:`{x:Bind Outputs.MarkupTabs, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),p(T.Options)]),_:1}),p(T,{SampleDefinition:`TabView\\TabviewBoundCollectionMydata.txt`,HeaderText:`{x:Bind Text.BindingHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Binding.xaml, Mode=OneWay}`,CSharp:`{x:Bind Samples.Binding.cSharp, Mode=OneWay}`},{default:t(()=>[p(T.Example,null,{default:t(()=>[p(D,{"x:Name":`TabViewItemsSourceSample`,MinHeight:`475`,Margin:`-12`,AddTabButtonClick:`TabViewItemsSourceSample_AddTabButtonClick`,Loaded:`TabView_Changed`,SelectedIndex:`0`,TabCloseRequested:`TabViewItemsSourceSample_TabCloseRequested`,TabItemsSource:`{x:Bind myDatas, Mode=OneWay}`,SelectionChanged:`TabView_Changed`,TabItemsChanged:`TabView_Changed`},{default:t(()=>[p(D.TabItemTemplate,null,{default:t(()=>[p(d,{"x:DataType":`local:MyData`},{default:t(()=>[p(c,{Content:`{x:Bind DataContent}`,Header:`{x:Bind DataHeader}`,IconSource:`{x:Bind DataIconSource}`})]),_:1})]),_:1})]),_:1})]),_:1}),p(T.Output,null,{default:t(()=>[p(m,{Text:`{x:Bind Outputs.TabViewItemsSourceSample, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),p(T.Options)]),_:1}),p(T,{SampleDefinition:`TabView\\TabviewKeyboardingSupport.txt`,HeaderText:`{x:Bind Text.KeyboardHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Keyboard.xaml, Mode=OneWay}`,CSharp:`{x:Bind Samples.Keyboard.cSharp, Mode=OneWay}`},{default:t(()=>[p(T.Example,null,{default:t(()=>[p(C,null,{default:t(()=>[p(m,{Margin:`0,0,0,0`,Text:`{x:Bind Text.KeyboardNew, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(m,{Margin:`0,0,0,0`,Text:`{x:Bind Text.KeyboardClose, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(m,{Margin:`0,0,0,0`,Text:`{x:Bind Text.KeyboardNumber, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(m,{Margin:`0,0,0,24`,Text:`{x:Bind Text.KeyboardLast, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(D,{"x:Name":`TabView2`,MinHeight:`475`,Margin:`-12`,AddTabButtonClick:`TabView_AddButtonClick`,Loaded:`TabView_Loaded`,SelectedIndex:`0`,TabCloseRequested:`TabView_TabCloseRequested`,SelectionChanged:`TabView_Changed`,TabItemsChanged:`TabView_Changed`},{default:t(()=>[p(D.KeyboardAccelerators,null,{default:t(()=>[p(f,{Key:`T`,Invoked:`NewTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),p(f,{Key:`W`,Invoked:`CloseSelectedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),p(f,{Key:`Number1`,Invoked:`NavigateToNumberedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),p(f,{Key:`Number2`,Invoked:`NavigateToNumberedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),p(f,{Key:`Number3`,Invoked:`NavigateToNumberedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),p(f,{Key:`Number4`,Invoked:`NavigateToNumberedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),p(f,{Key:`Number5`,Invoked:`NavigateToNumberedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),p(f,{Key:`Number6`,Invoked:`NavigateToNumberedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),p(f,{Key:`Number7`,Invoked:`NavigateToNumberedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),p(f,{Key:`Number8`,Invoked:`NavigateToNumberedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),p(f,{Key:`Number9`,Invoked:`NavigateToNumberedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`})]),_:1})]),_:1})]),_:1})]),_:1}),p(T.Output,null,{default:t(()=>[p(m,{Text:`{x:Bind Outputs.TabView2, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),p(T.Options)]),_:1}),p(T,{SampleDefinition:`TabView\\TabViewYouPutCustomContent.txt`,HeaderText:`{x:Bind Text.CustomHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Custom.xaml, Mode=OneWay}`,CSharp:`{x:Bind Samples.Adding.cSharp, Mode=OneWay}`},{default:t(()=>[p(T.Example,null,{default:t(()=>[p(C,null,{default:t(()=>[p(m,{Margin:`0,0,0,12`,Text:`{x:Bind Text.CustomDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(m,{Margin:`0,0,0,12`,Text:`{x:Bind Text.CustomDragRegion, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(m,{Margin:`0,0,0,24`,Text:`{x:Bind Text.WindowSourceDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(D,{"x:Name":`CustomTabs`,BringIntoViewRequested:`TabView_BringIntoViewRequested`,MinHeight:`475`,Margin:`-12`,AddTabButtonClick:`TabView_AddButtonClick`,Loaded:`TabView_Loaded`,SelectedIndex:`0`,TabCloseRequested:`TabView_TabCloseRequested`,TabWidthMode:`SizeToContent`,SelectionChanged:`TabView_Changed`,TabItemsChanged:`TabView_Changed`},{default:t(()=>[p(D.TabStripHeader,null,{default:t(()=>[p(m,{Margin:`8,6`,VerticalAlignment:`Center`,Style:`{ThemeResource BaseTextBlockStyle}`,Text:`{x:Bind Text.StripHeader, Mode=OneWay}`})]),_:1}),p(D.TabStripFooter,null,{default:t(()=>[p(m,{Margin:`6`,HorizontalAlignment:`Right`,VerticalAlignment:`Center`,Style:`{ThemeResource BaseTextBlockStyle}`,Text:`{x:Bind Text.StripFooter, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),p(T.Output,null,{default:t(()=>[p(m,{Text:`{x:Bind Outputs.CustomTabs, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),p(T.Options)]),_:1}),p(T,{SampleDefinition:`TabView\\TabViewTabWidthsEitherBe.txt`,HeaderText:`{x:Bind Text.WidthHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Width.xaml, Mode=OneWay}`},{default:t(()=>[p(T.Example,null,{default:t(()=>[p(D,{"x:Name":`TabView3`,BringIntoViewRequested:`TabView_BringIntoViewRequested`,MinHeight:`475`,Margin:`-12`,IsAddTabButtonVisible:`False`,Loaded:`TabView_Changed`,SelectedIndex:`0`,TabWidthMode:`SizeToContent`,SelectionChanged:`TabView_Changed`,TabItemsChanged:`TabView_Changed`},{default:t(()=>[p(D.TabItems,null,{default:t(()=>[p(c,{Header:`{x:Bind Text.Home, Mode=OneWay}`,IsClosable:`False`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:t(()=>[p(o,null,{default:t(()=>[p(i,{Symbol:`Home`})]),_:1}),p(s)]),_:1}),p(c,{Header:`{x:Bind Text.LongTab, Mode=OneWay}`,IsClosable:`False`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:t(()=>[p(o,null,{default:t(()=>[p(i,{Symbol:`MusicInfo`})]),_:1}),p(l)]),_:1}),p(c,{Header:`{x:Bind Text.ThirdTab, Mode=OneWay}`,IsClosable:`False`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:t(()=>[p(o,null,{default:t(()=>[p(i,{Symbol:`Placeholder`})]),_:1}),p(u)]),_:1})]),_:1})]),_:1})]),_:1}),p(T.Output,null,{default:t(()=>[p(m,{Text:`{x:Bind Outputs.TabView3, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),p(T.Options,null,{default:t(()=>[p(w,{Width:`150`,Header:`{x:Bind Text.WidthOptionHeader, Mode=OneWay}`,SelectedIndex:`0`,SelectionChanged:`TabWidthBehaviorComboBox_SelectionChanged`},{default:t(()=>[p(h,{Content:`{x:Bind Text.SizeToContent, Mode=OneWay}`}),p(h,{Content:`{x:Bind Text.Equal, Mode=OneWay}`}),p(h,{Content:`{x:Bind Text.Compact, Mode=OneWay}`})]),_:1})]),_:1}),p(T.Substitutions,null,{default:t(()=>[p(g,{Key:`TabWidthMode`,Value:`{x:Bind TabView3.TabWidthMode, Mode=OneWay}`})]),_:1})]),_:1}),p(T,{SampleDefinition:`TabView\\TabViewCloseButtonBePersistent.txt`,HeaderText:`{x:Bind Text.CloseHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Close.xaml, Mode=OneWay}`},{default:t(()=>[p(T.Example,null,{default:t(()=>[p(D,{"x:Name":`TabView4`,MinHeight:`475`,Margin:`-12`,IsAddTabButtonVisible:`False`,CloseButtonOverlayMode:`Always`,Loaded:`TabView_Changed`,SelectedIndex:`0`,TabCloseRequested:`TabView_TabCloseRequested`,SelectionChanged:`TabView_Changed`,TabItemsChanged:`TabView_Changed`},{default:t(()=>[p(D.TabItems,null,{default:t(()=>[p(c,{Header:`{x:Bind Text.Home, Mode=OneWay}`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:t(()=>[p(o,null,{default:t(()=>[p(i,{Symbol:`Home`})]),_:1}),p(s)]),_:1}),p(c,{Header:`{x:Bind Text.LongTab, Mode=OneWay}`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:t(()=>[p(o,null,{default:t(()=>[p(i,{Symbol:`MusicInfo`})]),_:1}),p(l)]),_:1}),p(c,{Header:`{x:Bind Text.ThirdTab, Mode=OneWay}`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:t(()=>[p(o,null,{default:t(()=>[p(i,{Symbol:`Placeholder`})]),_:1}),p(u)]),_:1})]),_:1})]),_:1})]),_:1}),p(T.Output,null,{default:t(()=>[p(m,{Text:`{x:Bind Outputs.TabView4, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),p(T.Options,null,{default:t(()=>[p(w,{Width:`150`,Header:`{x:Bind Text.CloseOptionHeader, Mode=OneWay}`,SelectedIndex:`1`,SelectionChanged:`TabCloseButtonOverlayModeComboBox_SelectionChanged`},{default:t(()=>[p(h,{Content:`{x:Bind Text.Auto, Mode=OneWay}`}),p(h,{Content:`{x:Bind Text.Always, Mode=OneWay}`}),p(h,{Content:`{x:Bind Text.OnHover, Mode=OneWay}`})]),_:1})]),_:1}),p(T.Substitutions,null,{default:t(()=>[p(g,{Key:`CloseButtonOverlayMode`,Value:`{x:Bind TabView4.CloseButtonOverlayMode, Mode=OneWay}`})]),_:1})]),_:1}),p(T,{SampleDefinition:`TabView\\TabviewColorTabIcons.txt`,HeaderText:`{x:Bind Text.ColorHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Color.xaml, Mode=OneWay}`},{default:t(()=>[p(T.Example,null,{default:t(()=>[p(C,null,{default:t(()=>[p(m,{Margin:`0,0,0,12`,Text:`{x:Bind Text.ColorDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(D,{"x:Name":`ColorTabs`,BringIntoViewRequested:`TabView_BringIntoViewRequested`,MinWidth:`490`,IsAddTabButtonVisible:`False`,Loaded:`TabView_Changed`,SelectedIndex:`0`,TabWidthMode:`SizeToContent`,SelectionChanged:`TabView_Changed`,TabItemsChanged:`TabView_Changed`},{default:t(()=>[p(D.TabItems,null,{default:t(()=>[p(c,{Header:`{x:Bind Text.CommandPrompt, Mode=OneWay}`,IsClosable:`False`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:t(()=>[p(o,null,{default:t(()=>[p(y,{ShowAsMonochrome:`False`,UriSource:`https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/SampleMedia/cmd.png`})]),_:1})]),_:1}),p(c,{Header:`{x:Bind Text.PowerShell, Mode=OneWay}`,IsClosable:`False`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:t(()=>[p(o,null,{default:t(()=>[p(y,{ShowAsMonochrome:`False`,UriSource:`https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/SampleMedia/powershell.png`})]),_:1})]),_:1}),p(c,{Header:`{x:Bind Text.Linux, Mode=OneWay}`,IsClosable:`False`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:t(()=>[p(o,null,{default:t(()=>[p(y,{ShowAsMonochrome:`False`,UriSource:`https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/SampleMedia/linux.png`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),p(T.Output,null,{default:t(()=>[p(m,{Text:`{x:Bind Outputs.ColorTabs, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),p(T.Options)]),_:1}),p(T,{SampleDefinition:`TabView\\TabviewAccentColoredTabstrip.txt`,HeaderText:`{x:Bind Text.AccentHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Accent.xaml, Mode=OneWay}`,CSharp:`{x:Bind Samples.Adding.cSharp, Mode=OneWay}`},{default:t(()=>[p(T.Example,null,{default:t(()=>[p(D,{"x:Name":`AccentTabs`,MinHeight:`475`,Margin:`-12`,AddTabButtonClick:`TabView_AddButtonClick`,Loaded:`TabView_Loaded`,SelectedIndex:`0`,TabCloseRequested:`TabView_TabCloseRequested`,SelectionChanged:`TabView_Changed`,TabItemsChanged:`TabView_Changed`},{default:t(()=>[p(D.Resources,null,{default:t(()=>[p(S,null,{default:t(()=>[p(E,null,{default:t(()=>[p(S,{"x:Key":`Light`},{default:t(()=>[p(b,{"x:Key":`TabViewBackground`,Color:`{ThemeResource SystemAccentColorLight2}`})]),_:1}),p(S,{"x:Key":`Dark`},{default:t(()=>[p(b,{"x:Key":`TabViewBackground`,Color:`{ThemeResource SystemAccentColorDark2}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),p(T.Output,null,{default:t(()=>[p(m,{Text:`{x:Bind Outputs.AccentTabs, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),p(T.Options)]),_:1}),p(T,{"x:Name":`LaunchExample`,SampleDefinition:`TabView\\CompleteTabviewWindowingSample.txt`,HeaderText:`{x:Bind Text.WindowHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Window.xaml, Mode=OneWay}`,CSharp:`{x:Bind Samples.Window.cSharp, Mode=OneWay}`},{default:t(()=>[p(T.Example,null,{default:t(()=>[p(x,{Click:`TabViewWindowingButton_Click`,Content:`{x:Bind Text.Launch, Mode=OneWay}`,IsEnabled:`{x:Bind CanLaunch, Mode=OneWay}`})]),_:1}),p(T.Output,null,{default:t(()=>[p(C,{Spacing:`8`},{default:t(()=>[p(m,{Text:`{x:Bind windowCapabilityOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(m,{Text:`{x:Bind windowOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),p(T.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}}}),[[`__scopeId`,`data-v-96c6eea3`]]);export{U as default};