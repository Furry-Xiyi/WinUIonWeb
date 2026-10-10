import{Fi as e,Gi as t,Hi as n,I as r,Oi as i,Ti as a,Ui as o,Wi as s,Wt as c,ai as l,di as u,et as d,fi as f,hi as p,mi as m,o as h,or as g,ri as _,t as v,vi as y,wi as b,yi as x,zi as S}from"./ScrollViewer-PoO_ma9Z.js";import{t as C}from"./Button-DjU0urmJ.js";import{t as w}from"./ComboBox-UT72V9ez.js";import{t as ee}from"./Frame-BU_Qa9Wf.js";import{t as te}from"./StackPanel-CT7pl8zy.js";import{n as T}from"./MenuFlyoutItems-CdFb5Edx.js";import{t as ne}from"./MenuFlyout-BmClHGXs.js";import{c as re,d as ie,f as ae,g as oe,h as se,m as ce,n as le,o as ue,p as de,r as fe,t as pe,u as me}from"./tabViewWindowStatus-D-Mts0Le.js";import{t as he}from"./ControlExample-C1ahTZEr.js";import{t as ge}from"./pageState-BN3kXI7L.js";var _e=`--- header
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
`,ve=`--- header
The close button can be persistent or only visible on hover
--- xaml
<TabView CloseButtonOverlayMode="$(CloseButtonOverlayMode)" />
`,ye=`--- header
Tab widths can either be equally sized, sized to the content of the tab, or sized to only show the icon when unselected
--- xaml
<TabView TabWidthMode="$(TabWidthMode)" />
`,be=`--- header
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
`,xe=`--- header
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
`,Se=`--- header
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
`,Ce=`--- header
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
`,we=`--- header
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
`,Te=`--- header
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
`,Ee=`--- header
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
`,E=f({__name:`TabViewPage`,setup(e,{expose:i}){i();let c=Object.assign({"../samples/TabView/CompleteTabviewWindowingSample.txt":_e,"../samples/TabView/TabViewCloseButtonBePersistent.txt":ve,"../samples/TabView/TabViewTabWidthsEitherBe.txt":ye,"../samples/TabView/TabViewYouPutCustomContent.txt":be,"../samples/TabView/TabviewAccentColoredTabstrip.txt":xe,"../samples/TabView/TabviewBoundCollectionMydata.txt":Se,"../samples/TabView/TabviewColorTabIcons.txt":Ce,"../samples/TabView/TabviewKeyboardingSupport.txt":we,"../samples/TabView/TabviewSupportAddingClosing.txt":Te,"../samples/TabView/TabviewTabviewitemsDefinedMarkup.txt":Ee}),l=e=>{let t=c[`../samples/TabView/${e}`]??``,n={},r=``;for(let e of t.split(/\r?\n/)){let t=/^---\s+(.+?)\s*$/.exec(e);t?(r=t[1].toLowerCase(),n[r]=[]):r&&n[r].push(e)}return{xaml:(n.xaml??[]).join(`
`).trim(),cSharp:(n[`c#`]??[]).join(`
`).trim()}},u={Adding:l(`TabviewSupportAddingClosing.txt`),Markup:l(`TabviewTabviewitemsDefinedMarkup.txt`),Binding:l(`TabviewBoundCollectionMydata.txt`),Keyboard:l(`TabviewKeyboardingSupport.txt`),Custom:l(`TabViewYouPutCustomContent.txt`),Width:l(`TabViewTabWidthsEitherBe.txt`),Close:l(`TabViewCloseButtonBePersistent.txt`),Color:l(`TabviewColorTabIcons.txt`),Accent:l(`TabviewAccentColoredTabstrip.txt`),Window:l(`CompleteTabviewWindowingSample.txt`)},{t:f,locale:b}=d(),E=_(()=>f(`TextControls.Control.TabView`)),D=p(`currentPage`),{pageTheme:O}=ge(D?.value||`tabview`),k=s({});a(g,k);let A=_(()=>k.TabViewContextMenu),j=_(()=>k.TabView3),M=_(()=>k.TabView4),N={AddingHeader:`adding-header`,MarkupHeader:`markup-header`,BindingHeader:`binding-header`,KeyboardHeader:`keyboard-header`,CustomHeader:`custom-header`,WidthHeader:`width-header`,CloseHeader:`close-header`,ColorHeader:`color-header`,AccentHeader:`accent-header`,WindowHeader:`window-header`,KeyboardNew:`keyboard-new`,KeyboardClose:`keyboard-close`,KeyboardNumber:`keyboard-number`,KeyboardLast:`keyboard-last`,CustomDescription:`custom-description`,CustomDragRegion:`custom-drag-region`,WindowSourceDescription:`window-source-description`,StripHeader:`strip-header`,StripFooter:`strip-footer`,Home:`home`,LongTab:`long-tab`,ThirdTab:`third-tab`,WidthOptionHeader:`width-option-header`,CloseOptionHeader:`close-option-header`,SizeToContent:`size-to-content`,Equal:`equal`,Compact:`compact`,Auto:`auto`,Always:`always`,OnHover:`on-hover`,ColorDescription:`color-description`,CommandPrompt:`command-prompt`,PowerShell:`powershell`,Linux:`linux`,Launch:`launch`},De=_(()=>({...Object.fromEntries(Object.entries(N).map(([e,t])=>[e,f(`sample.tabview.${t}`)])),Document0:f(`sample.tabview.document`,{index:0}),Document1:f(`sample.tabview.document`,{index:1}),Document2:f(`sample.tabview.document`,{index:2})})),P=n({}),F=[se,ce,de],I=e=>S(m(ee,{Content:S(m(F[e%F.length]))})),L=e=>S({Header:f(`sample.tabview.document`,{index:e}),IconSource:{Symbol:`Document`},ContextFlyout:A.value,Content:I(e),IsClosable:!0}),R=e=>S({DataHeader:f(`sample.tabview.mydata-document`,{index:e}),DataIconSource:{Symbol:`Placeholder`},DataContent:I(e)}),z=s(Array.from({length:3},(e,t)=>R(t))),B=e=>Object.keys(k).find(t=>{let n=k[t];return n===e||n?.TabItems===e.TabItems});function V(e){y(()=>{if(!e?.TabItems)return;let t=B(e);if(!t)return;let n=e.SelectedItem,r=n?.Header??n?.DataHeader??e.ContainerFromItem?.(n)?.Header??f(`sample.tabview.none`);P[t]=f(`sample.tabview.selection-output`,{count:e.TabItems.Count,index:e.SelectedIndex,header:String(r)})})}async function Oe(e){if(e.TabItems.Count===0)for(let t=0;t<3;t++)e.TabItems.Add(L(t));await y(),V(e)}function H(e){e.TabItems.Add(L(e.TabItems.Count)),V(e)}function ke(e,t){e.TabItems.Remove(t.Tab),V(e)}function Ae(e,t){t.Handled=!0}function je(e){z.push(R(z.length)),y(()=>V(e))}function Me(e,t){let n=z.indexOf(t.Item);n!==-1&&z.splice(n,1),y(()=>V(e))}function Ne(e,t){H(t.Element),t.Handled=!0}function Pe(e,t){t.Element.SelectedItem?.IsClosable!==!1&&t.Element.TabItems.Remove(t.Element.SelectedItem),V(t.Element),t.Handled=!0}function Fe(e,t){let n=Number(e.Key.replace(`Number`,``)),r=n===9?t.Element.TabItems.Count-1:n-1;r>=0&&r<t.Element.TabItems.Count&&(t.Element.SelectedIndex=r),V(t.Element),t.Handled=!0}function Ie(e){let t=j.value;t&&(t.TabWidthMode=[`SizeToContent`,`Equal`,`Compact`][e.SelectedIndex]??`SizeToContent`,V(t))}function Le(e){let t=M.value;t&&(t.CloseButtonOverlayMode=[`Auto`,`Always`,`OnPointerOver`][e.SelectedIndex]??`Always`,V(t))}function U(e){e.Items.Clear();let t=e.Target,n=t?.TabViewItem??t,r=n?.TabView??n?.ParentTabView??Object.values(k).find(e=>{let t=e;return!!t?.TabItems&&Array.from({length:t.TabItems.Count},(e,n)=>t.TabItems.GetAt(n)).some(e=>e===n||t.ContainerFromItem?.(e)===n)});if(!r){e.Hide();return}let i=r.TabItemsSource??Array.from({length:r.TabItems.Count},(e,t)=>r.TabItems.GetAt(t)),a=i.findIndex(e=>e===n?.Item||e===n||r.ContainerFromItem?.(e)===n);if(a===-1){e.Hide();return}let o=e=>{let t=i[a];r.TabItemsSource?(r.TabItemsSource.splice(a,1),r.TabItemsSource.splice(a+e,0,t)):(r.TabItems.RemoveAt(a),r.TabItems.Insert(a+e,t)),r.SelectedIndex=a+e,V(r)};a>0&&e.Items.Add(m(T,{Text:f(`sample.tabview.move-left`),onClick:()=>o(-1)})),a<i.length-1&&e.Items.Add(m(T,{Text:f(`sample.tabview.move-right`),onClick:()=>o(1)})),i.length<2&&e.Hide()}let W=p(ae,null),G=p(re,null),K=!W||G?ue({BaseUrl:new URL(`/WinUIonWeb/`,window.location.href).href,Locale:()=>b,Theme:()=>O.value===`dark`?`Dark`:`Light`}):null,q=K?.Adapter??W??ie(),J=t(K?.Capabilities??null),Y=K?.Subscribe(e=>{J.value=e}),Re=_(()=>pe(J.value,f,!0)),X=o(!1),ze=_(()=>!X.value),Z=o(``),Q=new AbortController;x(()=>{Q.abort(),Y?.(),K&&K.Dispose()});async function Be(){if(X.value)return;X.value=!0;let e=t(Array.from({length:3},(e,t)=>({Id:`tabview-${crypto.randomUUID()}`,Header:f(`sample.tabview.window-item`,{index:t}),Title:f(`sample.tabview.window-page`,{index:t}),IsOn:!1,Icon:`Placeholder`}))),n=me({Read:()=>e.value,Write:t=>{e.value=[...t]}});try{let t=await q.OpenWindow({Source:n,Items:e.value,Tabs:e.value,Signal:Q.signal});Z.value=t.Status===`Accepted`?f(`sample.tabview.window-connected`,{count:t.Items.length,mode:le(J.value?.LastWindowDisplayMode??null,f)}):fe(t,J.value,f)}catch{Z.value=f(`sample.tabview.window-failed`)}finally{X.value=!1}}let $={definitions:c,parseSample:l,Samples:u,t:f,locale:b,pageDescription:E,currentPage:D,pageTheme:O,names:k,TabViewContextMenu:A,TabView3:j,TabView4:M,textKeys:N,Text:De,Outputs:P,pages:F,CreatePageContent:I,CreateNewTab:L,CreateNewMyData:R,myDatas:z,OutputName:B,TabView_Changed:V,TabView_Loaded:Oe,TabView_AddButtonClick:H,TabView_TabCloseRequested:ke,TabView_BringIntoViewRequested:Ae,TabViewItemsSourceSample_AddTabButtonClick:je,TabViewItemsSourceSample_TabCloseRequested:Me,NewTabKeyboardAccelerator_Invoked:Ne,CloseSelectedTabKeyboardAccelerator_Invoked:Pe,NavigateToNumberedTabKeyboardAccelerator_Invoked:Fe,TabWidthBehaviorComboBox_SelectionChanged:Ie,TabCloseButtonOverlayModeComboBox_SelectionChanged:Le,TabViewContextMenu_Opening:U,suppliedAdapter:W,suppliedPwaHost:G,pwaHost:K,hostAdapter:q,hostCapabilities:J,releaseHostSubscription:Y,windowCapabilityOutput:Re,launching:X,CanLaunch:ze,windowOutput:Z,abortController:Q,TabViewWindowingButton_Click:Be,Button:C,ComboBox:w,ControlExample:he,MenuFlyout:ne,Page:r,ScrollViewer:v,StackPanel:te,TabView:oe,TextBlock:h};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function D(t,n,r,a,o,s){let c=i(`SymbolIconSource`),d=i(`TabViewItem.IconSource`),f=i(`samplepages:SamplePage1`),p=i(`TabViewItem`),m=i(`samplepages:SamplePage2`),h=i(`samplepages:SamplePage3`),g=i(`DataTemplate`),_=i(`KeyboardAccelerator`),v=i(`ComboBoxItem`),y=i(`ControlExampleSubstitution`),x=i(`BitmapIconSource`),S=i(`SolidColorBrush`),C=i(`ResourceDictionary`),w=i(`ResourceDictionary.ThemeDictionaries`);return b(),l(a.Page,null,{default:e(()=>[u(a.Page.Resources,null,{default:e(()=>[u(a.MenuFlyout,{"x:Name":`TabViewContextMenu`,Opening:`TabViewContextMenu_Opening`})]),_:1}),u(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[u(a.StackPanel,{class:`gallery-item-page`},{default:e(()=>[u(a.TextBlock,{MaxWidth:`1064`,HorizontalAlignment:`Left`,Margin:`0,4,24,0`,Style:`{ThemeResource BodyTextBlockStyle}`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(a.StackPanel,{class:`gallery-page-content`,HorizontalAlignment:`Stretch`},{default:e(()=>[u(a.ControlExample,{SampleDefinition:`TabView\\TabviewSupportAddingClosing.txt`,HeaderText:`{x:Bind Text.AddingHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Adding.xaml, Mode=OneWay}`,CSharp:`{x:Bind Samples.Adding.cSharp, Mode=OneWay}`},{default:e(()=>[u(a.ControlExample.Example,null,{default:e(()=>[u(a.TabView,{"x:Name":`TabView1`,MinHeight:`475`,Margin:`-12`,AddTabButtonClick:`TabView_AddButtonClick`,Loaded:`TabView_Loaded`,SelectedIndex:`0`,TabCloseRequested:`TabView_TabCloseRequested`,SelectionChanged:`TabView_Changed`,TabItemsChanged:`TabView_Changed`})]),_:1}),u(a.ControlExample.Output,null,{default:e(()=>[u(a.TextBlock,{Text:`{x:Bind Outputs.TabView1, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),u(a.ControlExample.Options)]),_:1}),u(a.ControlExample,{SampleDefinition:`TabView\\TabviewTabviewitemsDefinedMarkup.txt`,HeaderText:`{x:Bind Text.MarkupHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Markup.xaml, Mode=OneWay}`,CSharp:`{x:Bind Samples.Adding.cSharp, Mode=OneWay}`},{default:e(()=>[u(a.ControlExample.Example,null,{default:e(()=>[u(a.TabView,{"x:Name":`MarkupTabs`,MinHeight:`475`,Margin:`-12`,AddTabButtonClick:`TabView_AddButtonClick`,Loaded:`TabView_Changed`,SelectedIndex:`0`,TabCloseRequested:`TabView_TabCloseRequested`,SelectionChanged:`TabView_Changed`,TabItemsChanged:`TabView_Changed`},{default:e(()=>[u(a.TabView.TabItems,null,{default:e(()=>[u(p,{Header:`{x:Bind Text.Document0, Mode=OneWay}`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:e(()=>[u(d,null,{default:e(()=>[u(c,{Symbol:`Placeholder`})]),_:1}),u(f)]),_:1}),u(p,{Header:`{x:Bind Text.Document1, Mode=OneWay}`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:e(()=>[u(d,null,{default:e(()=>[u(c,{Symbol:`Placeholder`})]),_:1}),u(m)]),_:1}),u(p,{Header:`{x:Bind Text.Document2, Mode=OneWay}`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:e(()=>[u(d,null,{default:e(()=>[u(c,{Symbol:`Placeholder`})]),_:1}),u(h)]),_:1})]),_:1})]),_:1})]),_:1}),u(a.ControlExample.Output,null,{default:e(()=>[u(a.TextBlock,{Text:`{x:Bind Outputs.MarkupTabs, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),u(a.ControlExample.Options)]),_:1}),u(a.ControlExample,{SampleDefinition:`TabView\\TabviewBoundCollectionMydata.txt`,HeaderText:`{x:Bind Text.BindingHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Binding.xaml, Mode=OneWay}`,CSharp:`{x:Bind Samples.Binding.cSharp, Mode=OneWay}`},{default:e(()=>[u(a.ControlExample.Example,null,{default:e(()=>[u(a.TabView,{"x:Name":`TabViewItemsSourceSample`,MinHeight:`475`,Margin:`-12`,AddTabButtonClick:`TabViewItemsSourceSample_AddTabButtonClick`,Loaded:`TabView_Changed`,SelectedIndex:`0`,TabCloseRequested:`TabViewItemsSourceSample_TabCloseRequested`,TabItemsSource:`{x:Bind myDatas, Mode=OneWay}`,SelectionChanged:`TabView_Changed`,TabItemsChanged:`TabView_Changed`},{default:e(()=>[u(a.TabView.TabItemTemplate,null,{default:e(()=>[u(g,{"x:DataType":`local:MyData`},{default:e(()=>[u(p,{Content:`{x:Bind DataContent}`,Header:`{x:Bind DataHeader}`,IconSource:`{x:Bind DataIconSource}`})]),_:1})]),_:1})]),_:1})]),_:1}),u(a.ControlExample.Output,null,{default:e(()=>[u(a.TextBlock,{Text:`{x:Bind Outputs.TabViewItemsSourceSample, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),u(a.ControlExample.Options)]),_:1}),u(a.ControlExample,{SampleDefinition:`TabView\\TabviewKeyboardingSupport.txt`,HeaderText:`{x:Bind Text.KeyboardHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Keyboard.xaml, Mode=OneWay}`,CSharp:`{x:Bind Samples.Keyboard.cSharp, Mode=OneWay}`},{default:e(()=>[u(a.ControlExample.Example,null,{default:e(()=>[u(a.StackPanel,null,{default:e(()=>[u(a.TextBlock,{Margin:`0,0,0,0`,Text:`{x:Bind Text.KeyboardNew, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(a.TextBlock,{Margin:`0,0,0,0`,Text:`{x:Bind Text.KeyboardClose, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(a.TextBlock,{Margin:`0,0,0,0`,Text:`{x:Bind Text.KeyboardNumber, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(a.TextBlock,{Margin:`0,0,0,24`,Text:`{x:Bind Text.KeyboardLast, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(a.TabView,{"x:Name":`TabView2`,MinHeight:`475`,Margin:`-12`,AddTabButtonClick:`TabView_AddButtonClick`,Loaded:`TabView_Loaded`,SelectedIndex:`0`,TabCloseRequested:`TabView_TabCloseRequested`,SelectionChanged:`TabView_Changed`,TabItemsChanged:`TabView_Changed`},{default:e(()=>[u(a.TabView.KeyboardAccelerators,null,{default:e(()=>[u(_,{Key:`T`,Invoked:`NewTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),u(_,{Key:`W`,Invoked:`CloseSelectedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),u(_,{Key:`Number1`,Invoked:`NavigateToNumberedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),u(_,{Key:`Number2`,Invoked:`NavigateToNumberedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),u(_,{Key:`Number3`,Invoked:`NavigateToNumberedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),u(_,{Key:`Number4`,Invoked:`NavigateToNumberedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),u(_,{Key:`Number5`,Invoked:`NavigateToNumberedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),u(_,{Key:`Number6`,Invoked:`NavigateToNumberedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),u(_,{Key:`Number7`,Invoked:`NavigateToNumberedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),u(_,{Key:`Number8`,Invoked:`NavigateToNumberedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`}),u(_,{Key:`Number9`,Invoked:`NavigateToNumberedTabKeyboardAccelerator_Invoked`,Modifiers:`Control`})]),_:1})]),_:1})]),_:1})]),_:1}),u(a.ControlExample.Output,null,{default:e(()=>[u(a.TextBlock,{Text:`{x:Bind Outputs.TabView2, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),u(a.ControlExample.Options)]),_:1}),u(a.ControlExample,{SampleDefinition:`TabView\\TabViewYouPutCustomContent.txt`,HeaderText:`{x:Bind Text.CustomHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Custom.xaml, Mode=OneWay}`,CSharp:`{x:Bind Samples.Adding.cSharp, Mode=OneWay}`},{default:e(()=>[u(a.ControlExample.Example,null,{default:e(()=>[u(a.StackPanel,null,{default:e(()=>[u(a.TextBlock,{Margin:`0,0,0,12`,Text:`{x:Bind Text.CustomDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(a.TextBlock,{Margin:`0,0,0,12`,Text:`{x:Bind Text.CustomDragRegion, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(a.TextBlock,{Margin:`0,0,0,24`,Text:`{x:Bind Text.WindowSourceDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(a.TabView,{"x:Name":`CustomTabs`,BringIntoViewRequested:`TabView_BringIntoViewRequested`,MinHeight:`475`,Margin:`-12`,AddTabButtonClick:`TabView_AddButtonClick`,Loaded:`TabView_Loaded`,SelectedIndex:`0`,TabCloseRequested:`TabView_TabCloseRequested`,TabWidthMode:`SizeToContent`,SelectionChanged:`TabView_Changed`,TabItemsChanged:`TabView_Changed`},{default:e(()=>[u(a.TabView.TabStripHeader,null,{default:e(()=>[u(a.TextBlock,{Margin:`8,6`,VerticalAlignment:`Center`,Style:`{ThemeResource BaseTextBlockStyle}`,Text:`{x:Bind Text.StripHeader, Mode=OneWay}`})]),_:1}),u(a.TabView.TabStripFooter,null,{default:e(()=>[u(a.TextBlock,{Margin:`6`,HorizontalAlignment:`Right`,VerticalAlignment:`Center`,Style:`{ThemeResource BaseTextBlockStyle}`,Text:`{x:Bind Text.StripFooter, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),u(a.ControlExample.Output,null,{default:e(()=>[u(a.TextBlock,{Text:`{x:Bind Outputs.CustomTabs, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),u(a.ControlExample.Options)]),_:1}),u(a.ControlExample,{SampleDefinition:`TabView\\TabViewTabWidthsEitherBe.txt`,HeaderText:`{x:Bind Text.WidthHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Width.xaml, Mode=OneWay}`},{default:e(()=>[u(a.ControlExample.Example,null,{default:e(()=>[u(a.TabView,{"x:Name":`TabView3`,BringIntoViewRequested:`TabView_BringIntoViewRequested`,MinHeight:`475`,Margin:`-12`,IsAddTabButtonVisible:`False`,Loaded:`TabView_Changed`,SelectedIndex:`0`,TabWidthMode:`SizeToContent`,SelectionChanged:`TabView_Changed`,TabItemsChanged:`TabView_Changed`},{default:e(()=>[u(a.TabView.TabItems,null,{default:e(()=>[u(p,{Header:`{x:Bind Text.Home, Mode=OneWay}`,IsClosable:`False`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:e(()=>[u(d,null,{default:e(()=>[u(c,{Symbol:`Home`})]),_:1}),u(f)]),_:1}),u(p,{Header:`{x:Bind Text.LongTab, Mode=OneWay}`,IsClosable:`False`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:e(()=>[u(d,null,{default:e(()=>[u(c,{Symbol:`MusicInfo`})]),_:1}),u(m)]),_:1}),u(p,{Header:`{x:Bind Text.ThirdTab, Mode=OneWay}`,IsClosable:`False`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:e(()=>[u(d,null,{default:e(()=>[u(c,{Symbol:`Placeholder`})]),_:1}),u(h)]),_:1})]),_:1})]),_:1})]),_:1}),u(a.ControlExample.Output,null,{default:e(()=>[u(a.TextBlock,{Text:`{x:Bind Outputs.TabView3, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),u(a.ControlExample.Options,null,{default:e(()=>[u(a.ComboBox,{Width:`150`,Header:`{x:Bind Text.WidthOptionHeader, Mode=OneWay}`,SelectedIndex:`0`,SelectionChanged:`TabWidthBehaviorComboBox_SelectionChanged`},{default:e(()=>[u(v,{Content:`{x:Bind Text.SizeToContent, Mode=OneWay}`}),u(v,{Content:`{x:Bind Text.Equal, Mode=OneWay}`}),u(v,{Content:`{x:Bind Text.Compact, Mode=OneWay}`})]),_:1})]),_:1}),u(a.ControlExample.Substitutions,null,{default:e(()=>[u(y,{Key:`TabWidthMode`,Value:`{x:Bind TabView3.TabWidthMode, Mode=OneWay}`})]),_:1})]),_:1}),u(a.ControlExample,{SampleDefinition:`TabView\\TabViewCloseButtonBePersistent.txt`,HeaderText:`{x:Bind Text.CloseHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Close.xaml, Mode=OneWay}`},{default:e(()=>[u(a.ControlExample.Example,null,{default:e(()=>[u(a.TabView,{"x:Name":`TabView4`,MinHeight:`475`,Margin:`-12`,IsAddTabButtonVisible:`False`,CloseButtonOverlayMode:`Always`,Loaded:`TabView_Changed`,SelectedIndex:`0`,TabCloseRequested:`TabView_TabCloseRequested`,SelectionChanged:`TabView_Changed`,TabItemsChanged:`TabView_Changed`},{default:e(()=>[u(a.TabView.TabItems,null,{default:e(()=>[u(p,{Header:`{x:Bind Text.Home, Mode=OneWay}`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:e(()=>[u(d,null,{default:e(()=>[u(c,{Symbol:`Home`})]),_:1}),u(f)]),_:1}),u(p,{Header:`{x:Bind Text.LongTab, Mode=OneWay}`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:e(()=>[u(d,null,{default:e(()=>[u(c,{Symbol:`MusicInfo`})]),_:1}),u(m)]),_:1}),u(p,{Header:`{x:Bind Text.ThirdTab, Mode=OneWay}`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:e(()=>[u(d,null,{default:e(()=>[u(c,{Symbol:`Placeholder`})]),_:1}),u(h)]),_:1})]),_:1})]),_:1})]),_:1}),u(a.ControlExample.Output,null,{default:e(()=>[u(a.TextBlock,{Text:`{x:Bind Outputs.TabView4, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),u(a.ControlExample.Options,null,{default:e(()=>[u(a.ComboBox,{Width:`150`,Header:`{x:Bind Text.CloseOptionHeader, Mode=OneWay}`,SelectedIndex:`1`,SelectionChanged:`TabCloseButtonOverlayModeComboBox_SelectionChanged`},{default:e(()=>[u(v,{Content:`{x:Bind Text.Auto, Mode=OneWay}`}),u(v,{Content:`{x:Bind Text.Always, Mode=OneWay}`}),u(v,{Content:`{x:Bind Text.OnHover, Mode=OneWay}`})]),_:1})]),_:1}),u(a.ControlExample.Substitutions,null,{default:e(()=>[u(y,{Key:`CloseButtonOverlayMode`,Value:`{x:Bind TabView4.CloseButtonOverlayMode, Mode=OneWay}`})]),_:1})]),_:1}),u(a.ControlExample,{SampleDefinition:`TabView\\TabviewColorTabIcons.txt`,HeaderText:`{x:Bind Text.ColorHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Color.xaml, Mode=OneWay}`},{default:e(()=>[u(a.ControlExample.Example,null,{default:e(()=>[u(a.StackPanel,null,{default:e(()=>[u(a.TextBlock,{Margin:`0,0,0,12`,Text:`{x:Bind Text.ColorDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(a.TabView,{"x:Name":`ColorTabs`,BringIntoViewRequested:`TabView_BringIntoViewRequested`,MinWidth:`490`,IsAddTabButtonVisible:`False`,Loaded:`TabView_Changed`,SelectedIndex:`0`,TabWidthMode:`SizeToContent`,SelectionChanged:`TabView_Changed`,TabItemsChanged:`TabView_Changed`},{default:e(()=>[u(a.TabView.TabItems,null,{default:e(()=>[u(p,{Header:`{x:Bind Text.CommandPrompt, Mode=OneWay}`,IsClosable:`False`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:e(()=>[u(d,null,{default:e(()=>[u(x,{ShowAsMonochrome:`False`,UriSource:`https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/SampleMedia/cmd.png`})]),_:1})]),_:1}),u(p,{Header:`{x:Bind Text.PowerShell, Mode=OneWay}`,IsClosable:`False`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:e(()=>[u(d,null,{default:e(()=>[u(x,{ShowAsMonochrome:`False`,UriSource:`https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/SampleMedia/powershell.png`})]),_:1})]),_:1}),u(p,{Header:`{x:Bind Text.Linux, Mode=OneWay}`,IsClosable:`False`,ContextFlyout:`{x:Bind TabViewContextMenu}`},{default:e(()=>[u(d,null,{default:e(()=>[u(x,{ShowAsMonochrome:`False`,UriSource:`https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/SampleMedia/linux.png`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),u(a.ControlExample.Output,null,{default:e(()=>[u(a.TextBlock,{Text:`{x:Bind Outputs.ColorTabs, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),u(a.ControlExample.Options)]),_:1}),u(a.ControlExample,{SampleDefinition:`TabView\\TabviewAccentColoredTabstrip.txt`,HeaderText:`{x:Bind Text.AccentHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Accent.xaml, Mode=OneWay}`,CSharp:`{x:Bind Samples.Adding.cSharp, Mode=OneWay}`},{default:e(()=>[u(a.ControlExample.Example,null,{default:e(()=>[u(a.TabView,{"x:Name":`AccentTabs`,MinHeight:`475`,Margin:`-12`,AddTabButtonClick:`TabView_AddButtonClick`,Loaded:`TabView_Loaded`,SelectedIndex:`0`,TabCloseRequested:`TabView_TabCloseRequested`,SelectionChanged:`TabView_Changed`,TabItemsChanged:`TabView_Changed`},{default:e(()=>[u(a.TabView.Resources,null,{default:e(()=>[u(C,null,{default:e(()=>[u(w,null,{default:e(()=>[u(C,{"x:Key":`Light`},{default:e(()=>[u(S,{"x:Key":`TabViewBackground`,Color:`{ThemeResource SystemAccentColorLight2}`})]),_:1}),u(C,{"x:Key":`Dark`},{default:e(()=>[u(S,{"x:Key":`TabViewBackground`,Color:`{ThemeResource SystemAccentColorDark2}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),u(a.ControlExample.Output,null,{default:e(()=>[u(a.TextBlock,{Text:`{x:Bind Outputs.AccentTabs, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),u(a.ControlExample.Options)]),_:1}),u(a.ControlExample,{"x:Name":`LaunchExample`,SampleDefinition:`TabView\\CompleteTabviewWindowingSample.txt`,HeaderText:`{x:Bind Text.WindowHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Samples.Window.xaml, Mode=OneWay}`,CSharp:`{x:Bind Samples.Window.cSharp, Mode=OneWay}`},{default:e(()=>[u(a.ControlExample.Example,null,{default:e(()=>[u(a.Button,{Click:`TabViewWindowingButton_Click`,Content:`{x:Bind Text.Launch, Mode=OneWay}`,IsEnabled:`{x:Bind CanLaunch, Mode=OneWay}`})]),_:1}),u(a.ControlExample.Output,null,{default:e(()=>[u(a.StackPanel,{Spacing:`8`},{default:e(()=>[u(a.TextBlock,{Text:`{x:Bind windowCapabilityOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(a.TextBlock,{Text:`{x:Bind windowOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),u(a.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var O=c(E,[[`render`,D],[`__scopeId`,`data-v-96c6eea3`],[`__file`,`TabViewPage.vue`]]);export{O as default};