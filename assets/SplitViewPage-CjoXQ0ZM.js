import{Ai as e,Ci as t,Di as n,Ei as r,Gi as i,I as a,Ki as o,Li as s,Lt as c,Nt as l,Wt as u,_i as d,ai as f,et as p,o as ee,pi as m,si as h,sr as g,t as _}from"./ScrollViewer-BWDA_C78.js";import{t as v}from"./Button-BNDPNdYJ.js";import{t as y}from"./ComboBox-c_LaT8fC.js";import{t as b}from"./inlineControlProperties-CBoqGJWv.js";import{t as x}from"./StackPanel-sg_Bd5oB.js";import{t as te}from"./ListView-DiQ0PqAw.js";import{t as ne}from"./Slider-C94Ax_X5.js";import{t as re}from"./SplitView-CCUXyALT.js";import{t as ie}from"./ToggleButton-HP5wmrvH.js";import{t as ae}from"./ToggleSwitch-DmoyCBpS.js";import{t as oe}from"./ControlExample-CzGyf8u0.js";import{t as S}from"./pageState-CcJibQcm.js";var C=`--- header
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
</SplitView>`,w=`// Copyright (c) Microsoft Corporation. All rights reserved.
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
`,T={__name:`SplitViewPage`,setup(e,{expose:r}){r();let{t:s}=p(),u=d(`currentPage`),m=f(()=>u?.value||`splitview`),{isFavoriteState:h,pageTheme:T,toggleTheme:E,toggleFavorite:D}=S(m.value),O=o({});n(g,O);let k=f(()=>s(`text.splitview`)),A=f(()=>s(`text.a-container-with-two-views-one-view-for-the-main`)),j=f(()=>s(`text.a-basic-splitview`)),M=f(()=>s(`gallery.page-header.toggle-theme`)),N=f(()=>s(`gallery.page-header.favorite`)),P=f(()=>h.value?``:``),F=f(()=>s(`sample.splitview.pane-content`)),I=f(()=>s(`sample.splitview.splitview-content`)),L=f(()=>s(`sample.splitview.is-pane-open`)),R=f(()=>s(`sample.splitview.placement`)),z=f(()=>s(`sample.splitview.left`)),B=f(()=>s(`sample.splitview.right`)),V=f(()=>s(`sample.splitview.display-mode`)),H=f(()=>s(`sample.splitview.pane-background`)),se=f(()=>s(`sample.splitview.open-pane-length`)),U=f(()=>s(`sample.splitview.compact-pane-length`)),W=f(()=>s(`sample.splitview.inline`)),G=f(()=>s(`sample.splitview.compact-inline`)),K=f(()=>s(`sample.splitview.overlay`)),ce=f(()=>s(`sample.splitview.compact-overlay`)),le=f(()=>s(`sample.splitview.theme-background`)),ue=f(()=>s(`sample.splitview.red`)),de=f(()=>s(`sample.splitview.blue`)),fe=f(()=>s(`sample.splitview.green`)),q=f(()=>[{Label:s(`sample.splitview.people`),Symbol:`People`},{Label:s(`sample.splitview.globe`),Symbol:`Globe`},{Label:s(`sample.splitview.message`),Symbol:`Message`},{Label:s(`sample.splitview.mail`),Symbol:`Mail`}]),J=i(``),pe=f(()=>{let e=q.value.find(e=>e.Symbol===J.value);return e?s(`sample.splitview.navigation-page`,{page:e.Label}):``}),me=(e,t)=>{let n=t?.ClickedItem;n?.Symbol&&(J.value=n.Symbol)},he=(e,t)=>{let n=t?.AddedItems?.[0];n?.Symbol&&(J.value=n.Symbol)},Y=()=>{O.NavLinksList&&(O.NavLinksList.ItemTemplate=O.splitView?.PanePlacement===`Right`?`{StaticResource RightIconNavLinkItemTemplate}`:`{StaticResource LeftIconNavLinkItemTemplate}`)},ge=(e,t=e)=>{O.splitView&&(O.splitView.PanePlacement=t?.IsOn??e?.IsOn?`Right`:`Left`,Y())},X=()=>Y(),Z=e=>{let t=e?.SelectedItem;O.splitView&&[`Inline`,`CompactInline`,`Overlay`,`CompactOverlay`].includes(t?.Tag)&&(O.splitView.DisplayMode=t.Tag)},_e=e=>{let t=e?.SelectedItem;!O.splitView||typeof t?.Tag!=`string`||(O.splitView.PaneBackground=t.Tag.replace(/^\{\}/,``))};t(()=>{Z(O.displayModeCombobox),Y()});let Q=e=>String(e).replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`),$={t:s,currentPage:u,pageKey:m,isFavoriteState:h,pageTheme:T,toggleTheme:E,toggleFavorite:D,namescope:O,pageTitle:k,pageDescription:A,sampleHeader:j,themeButtonName:M,favoriteButtonName:N,favoriteGlyph:P,paneContentLabel:F,splitViewContentLabel:I,isPaneOpenLabel:L,placementLabel:R,leftLabel:z,rightLabel:B,displayModeLabel:V,paneBackgroundLabel:H,openPaneLengthLabel:se,compactPaneLengthLabel:U,inlineLabel:W,compactInlineLabel:G,overlayLabel:K,compactOverlayLabel:ce,themeBackgroundLabel:le,redLabel:ue,blueLabel:de,greenLabel:fe,NavLinks:q,selectedNavSymbol:J,selectedContent:pe,NavLinksList_ItemClick:me,NavLinksList_SelectionChanged:he,UpdateNavLinkItemLayout:Y,PanePlacement_Toggled:ge,togglePaneButton_CheckedChanged:X,displayModeCombobox_SelectionChanged:Z,paneBackgroundCombobox_SelectionChanged:_e,escapeXaml:Q,splitViewXaml:f(()=>{let e=O.paneBackgroundCombobox?.SelectedItem?.Tag,t={PaneBackground:typeof e==`string`?e.replace(/^\{\}/,``):`{ThemeResource SystemControlBackgroundChromeMediumLowBrush}`,IsPaneOpen:O.splitView?.IsPaneOpen===!1?`False`:`True`,OpenPaneLength:O.openPaneLengthSlider?.Value??256,CompactPaneLength:O.compactPaneLengthSlider?.Value??48,DisplayMode:O.splitView?.DisplayMode??`Inline`},n=O.splitView?.PanePlacement===`Right`?`RightIconNavLinkItemTemplate`:`LeftIconNavLinkItemTemplate`;return`--- header
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
</SplitView>`.split(/--- xaml\s*\r?\n/)[1]?.trim().replace(/\$\((\w+)\)/g,(e,n)=>Q(t[n]??``)).replace(`Text="PANE CONTENT"`,`Text="${Q(F.value)}"`).replace(`Text="SPLITVIEW CONTENT"`,`Text="${Q(I.value)}"`).replace(`StaticResource NavLinkItemTemplate`,`StaticResource ${n}`)??``}),computed:f,inject:d,onMounted:t,provide:n,ref:i,shallowReactive:o,Button:v,ComboBox:y,get ComboBoxItem(){return b},ControlExample:oe,Grid:c,ListView:te,Page:a,ScrollViewer:_,Slider:ne,SplitView:re,StackPanel:x,SymbolIcon:l,TextBlock:ee,ToggleButton:ie,ToggleSwitch:ae,get useI18n(){return p},get xamlNameScopeKey(){return g},get createPageState(){return S},get basicSplitViewSample(){return C},get splitViewCSharp(){return w}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}};function E(t,n,i,a,o,c){let l=e(`ColumnDefinition`),u=e(`DataTemplate`),d=e(`RowDefinition`);return r(),h(a.Page,{"xmlns:controlPages":`using:WinUIGallery.ControlPages`},{default:s(()=>[m(a.Page.Resources,null,{default:s(()=>[m(u,{"x:Key":`LeftIconNavLinkItemTemplate`,"x:DataType":`controlPages:NavLink`},{default:s(()=>[m(a.Grid,{Margin:`2,0,0,0`,"AutomationProperties.Name":`{x:Bind Label}`},{default:s(()=>[m(a.Grid.ColumnDefinitions,null,{default:s(()=>[m(l,{Width:`Auto`}),m(l,{Width:`*`})]),_:1}),m(a.SymbolIcon,{"Grid.Column":`0`,Symbol:`{x:Bind Symbol}`}),m(a.TextBlock,{"Grid.Column":`1`,Margin:`24,0,0,0`,VerticalAlignment:`Center`,Text:`{x:Bind Label}`})]),_:1})]),_:1}),m(u,{"x:Key":`RightIconNavLinkItemTemplate`,"x:DataType":`controlPages:NavLink`},{default:s(()=>[m(a.Grid,{Margin:`0,0,2,0`,"AutomationProperties.Name":`{x:Bind Label}`},{default:s(()=>[m(a.Grid.ColumnDefinitions,null,{default:s(()=>[m(l,{Width:`*`}),m(l,{Width:`Auto`})]),_:1}),m(a.TextBlock,{"Grid.Column":`0`,Margin:`0,0,24,0`,VerticalAlignment:`Center`,Text:`{x:Bind Label}`}),m(a.SymbolIcon,{"Grid.Column":`1`,Symbol:`{x:Bind Symbol}`})]),_:1})]),_:1})]),_:1}),m(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:s(()=>[m(a.StackPanel,{class:`gallery-item-page`},{default:s(()=>[m(a.StackPanel,{class:`page-heading`},{default:s(()=>[m(a.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),m(a.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),m(a.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:s(()=>[m(a.Button,{class:`header-action`,"AutomationProperties.Name":`{x:Bind themeButtonName, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind themeButtonName, Mode=OneWay}`,Click:`toggleTheme`},{default:s(()=>[m(a.TextBlock,{class:`icon`,Text:``})]),_:1}),m(a.ToggleButton,{class:`header-action`,"AutomationProperties.Name":`{x:Bind favoriteButtonName, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind favoriteButtonName, Mode=OneWay}`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`},{default:s(()=>[m(a.TextBlock,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),m(a.StackPanel,{class:`gallery-page-content`},{default:s(()=>[m(a.ControlExample,{class:`splitview-example`,"x:Name":`Example1`,SampleDefinition:`SplitView\\BasicSplitview.txt`,HeaderText:`{x:Bind sampleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind splitViewXaml, Mode=OneWay}`,CSharp:`{x:Bind splitViewCSharp, Mode=OneWay}`},{default:s(()=>[m(a.ControlExample.Example,null,{default:s(()=>[m(a.Grid,{class:`split-view-sample-host`,Height:`300`,Width:`400`,VerticalAlignment:`Top`},{default:s(()=>[m(a.SplitView,{"x:Name":`splitView`,CompactPaneLength:`{x:Bind compactPaneLengthSlider.Value, Mode=OneWay}`,DisplayMode:`CompactOverlay`,IsPaneOpen:`{x:Bind togglePaneButton.IsChecked, Mode=TwoWay, Converter={StaticResource nullableBooleanToBooleanConverter}}`,IsTabStop:`False`,MaxWidth:`400`,OpenPaneLength:`{x:Bind openPaneLengthSlider.Value, Mode=OneWay}`,PaneBackground:`{ThemeResource SystemControlBackgroundChromeMediumLowBrush}`},{default:s(()=>[m(a.SplitView.Pane,null,{default:s(()=>[m(a.Grid,{class:`split-pane-layout`},{default:s(()=>[m(a.Grid.RowDefinitions,null,{default:s(()=>[m(d,{Height:`Auto`}),m(d,{Height:`*`}),m(d,{Height:`Auto`})]),_:1}),m(a.TextBlock,{"x:Name":`PaneHeader`,Margin:`60,12,0,0`,Style:`{StaticResource BaseTextBlockStyle}`,Text:`{x:Bind paneContentLabel, Mode=OneWay}`}),m(a.ListView,{"x:Name":`NavLinksList`,class:`nav-links-list`,"Grid.Row":`1`,Margin:`0,12,0,0`,VerticalAlignment:`Stretch`,IsItemClickEnabled:`True`,ItemClick:`NavLinksList_ItemClick`,ItemsSource:`{x:Bind NavLinks, Mode=OneWay}`,ItemTemplate:`{StaticResource LeftIconNavLinkItemTemplate}`,SelectionChanged:`NavLinksList_SelectionChanged`,SelectionMode:`Single`})]),_:1})]),_:1}),m(a.SplitView.Content,null,{default:s(()=>[m(a.Grid,{class:`split-content-layout`},{default:s(()=>[m(a.Grid.RowDefinitions,null,{default:s(()=>[m(d,{Height:`Auto`}),m(d,{Height:`*`})]),_:1}),m(a.TextBlock,{Margin:`12,12,0,0`,Style:`{StaticResource BaseTextBlockStyle}`,Text:`{x:Bind splitViewContentLabel, Mode=OneWay}`}),m(a.TextBlock,{"x:Name":`content`,"Grid.Row":`1`,Margin:`12,12,0,0`,Style:`{StaticResource BodyTextBlockStyle}`,Text:`{x:Bind selectedContent, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),m(a.ControlExample.Output,null,{default:s(()=>[m(a.TextBlock,{class:`splitview-output`,Text:`{x:Bind selectedContent, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),m(a.ControlExample.Options,null,{default:s(()=>[m(a.StackPanel,{class:`split-options`},{default:s(()=>[m(a.ToggleButton,{"x:Name":`togglePaneButton`,Content:`{x:Bind isPaneOpenLabel, Mode=OneWay}`,Checked:`togglePaneButton_CheckedChanged`,Unchecked:`togglePaneButton_CheckedChanged`,IsChecked:`True`}),m(a.ToggleSwitch,{MinWidth:`120`,Margin:`0,12,0,0`,Header:`{x:Bind placementLabel, Mode=OneWay}`,OffContent:`{x:Bind leftLabel, Mode=OneWay}`,OnContent:`{x:Bind rightLabel, Mode=OneWay}`,Toggled:`PanePlacement_Toggled`}),m(a.ComboBox,{"x:Name":`displayModeCombobox`,Width:`196`,Margin:`0,4,0,0`,VerticalAlignment:`Center`,Header:`{x:Bind displayModeLabel, Mode=OneWay}`,SelectedIndex:`0`,SelectionChanged:`displayModeCombobox_SelectionChanged`},{default:s(()=>[m(a.ComboBoxItem,{Content:`{x:Bind inlineLabel, Mode=OneWay}`,Tag:`Inline`}),m(a.ComboBoxItem,{Content:`{x:Bind compactInlineLabel, Mode=OneWay}`,Tag:`CompactInline`}),m(a.ComboBoxItem,{Content:`{x:Bind overlayLabel, Mode=OneWay}`,Tag:`Overlay`}),m(a.ComboBoxItem,{Content:`{x:Bind compactOverlayLabel, Mode=OneWay}`,Tag:`CompactOverlay`})]),_:1}),m(a.ComboBox,{"x:Name":`paneBackgroundCombobox`,Width:`196`,Margin:`0,12,0,0`,VerticalAlignment:`Center`,Header:`{x:Bind paneBackgroundLabel, Mode=OneWay}`,SelectedIndex:`0`,SelectionChanged:`paneBackgroundCombobox_SelectionChanged`},{default:s(()=>[m(a.ComboBoxItem,{Content:`{x:Bind themeBackgroundLabel, Mode=OneWay}`,Tag:`{}{ThemeResource SystemControlBackgroundChromeMediumLowBrush}`}),m(a.ComboBoxItem,{Content:`{x:Bind redLabel, Mode=OneWay}`,Tag:`Red`}),m(a.ComboBoxItem,{Content:`{x:Bind blueLabel, Mode=OneWay}`,Tag:`Blue`}),m(a.ComboBoxItem,{Content:`{x:Bind greenLabel, Mode=OneWay}`,Tag:`Green`})]),_:1}),m(a.Slider,{"x:Name":`openPaneLengthSlider`,Width:`196`,Margin:`0,12,0,0`,Header:`{x:Bind openPaneLengthLabel, Mode=OneWay}`,IsFocusEngagementEnabled:`False`,Maximum:`500`,Minimum:`128`,SnapsTo:`StepValues`,StepFrequency:`8`,Value:`256`}),m(a.Slider,{"x:Name":`compactPaneLengthSlider`,Width:`196`,Header:`{x:Bind compactPaneLengthLabel, Mode=OneWay}`,IsFocusEngagementEnabled:`False`,Maximum:`128`,Minimum:`24`,SnapsTo:`StepValues`,StepFrequency:`8`,Value:`48`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var D=u(T,[[`render`,E],[`__scopeId`,`data-v-8f37536b`],[`__file`,`SplitViewPage.vue`]]);export{D as default};