import{Fi as e,I as t,Lt as n,Nt as r,Oi as i,Ti as a,Ui as o,Wi as s,Wt as c,ai as l,di as u,et as d,hi as f,o as p,or as m,ri as h,t as ee,wi as g,xi as _}from"./ScrollViewer-PoO_ma9Z.js";import{t as v}from"./Button-DjU0urmJ.js";import{t as y}from"./ComboBox-UT72V9ez.js";import{t as b}from"./inlineControlProperties-DcOtwrbn.js";import{t as x}from"./StackPanel-CT7pl8zy.js";import{t as te}from"./ListView-D3xyFzBM.js";import{t as ne}from"./Slider-DAa-nQWm.js";import{t as re}from"./SplitView-DbZ1OLpC.js";import{t as ie}from"./ToggleButton-DwmhXZge.js";import{t as ae}from"./ToggleSwitch-BEoVatRz.js";import{t as oe}from"./ControlExample-C1ahTZEr.js";import{t as S}from"./pageState-BN3kXI7L.js";var C=`--- header
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
`,T={__name:`SplitViewPage`,setup(e,{expose:i}){i();let{t:c}=d(),l=f(`currentPage`),u=h(()=>l?.value||`splitview`),{isFavoriteState:g,pageTheme:T,toggleTheme:E,toggleFavorite:D}=S(u.value),O=s({});a(m,O);let k=h(()=>c(`text.splitview`)),A=h(()=>c(`text.a-container-with-two-views-one-view-for-the-main`)),j=h(()=>c(`text.a-basic-splitview`)),M=h(()=>c(`gallery.page-header.toggle-theme`)),N=h(()=>c(`gallery.page-header.favorite`)),P=h(()=>g.value?``:``),F=h(()=>c(`sample.splitview.pane-content`)),I=h(()=>c(`sample.splitview.splitview-content`)),L=h(()=>c(`sample.splitview.is-pane-open`)),R=h(()=>c(`sample.splitview.placement`)),z=h(()=>c(`sample.splitview.left`)),B=h(()=>c(`sample.splitview.right`)),V=h(()=>c(`sample.splitview.display-mode`)),H=h(()=>c(`sample.splitview.pane-background`)),se=h(()=>c(`sample.splitview.open-pane-length`)),U=h(()=>c(`sample.splitview.compact-pane-length`)),W=h(()=>c(`sample.splitview.inline`)),G=h(()=>c(`sample.splitview.compact-inline`)),K=h(()=>c(`sample.splitview.overlay`)),ce=h(()=>c(`sample.splitview.compact-overlay`)),le=h(()=>c(`sample.splitview.theme-background`)),ue=h(()=>c(`sample.splitview.red`)),de=h(()=>c(`sample.splitview.blue`)),fe=h(()=>c(`sample.splitview.green`)),q=h(()=>[{Label:c(`sample.splitview.people`),Symbol:`People`},{Label:c(`sample.splitview.globe`),Symbol:`Globe`},{Label:c(`sample.splitview.message`),Symbol:`Message`},{Label:c(`sample.splitview.mail`),Symbol:`Mail`}]),J=o(``),pe=h(()=>{let e=q.value.find(e=>e.Symbol===J.value);return e?c(`sample.splitview.navigation-page`,{page:e.Label}):``}),me=(e,t)=>{let n=t?.ClickedItem;n?.Symbol&&(J.value=n.Symbol)},he=(e,t)=>{let n=t?.AddedItems?.[0];n?.Symbol&&(J.value=n.Symbol)},Y=()=>{O.NavLinksList&&(O.NavLinksList.ItemTemplate=O.splitView?.PanePlacement===`Right`?`{StaticResource RightIconNavLinkItemTemplate}`:`{StaticResource LeftIconNavLinkItemTemplate}`)},ge=(e,t=e)=>{O.splitView&&(O.splitView.PanePlacement=t?.IsOn??e?.IsOn?`Right`:`Left`,Y())},X=()=>Y(),Z=e=>{let t=e?.SelectedItem;O.splitView&&[`Inline`,`CompactInline`,`Overlay`,`CompactOverlay`].includes(t?.Tag)&&(O.splitView.DisplayMode=t.Tag)},_e=e=>{let t=e?.SelectedItem;!O.splitView||typeof t?.Tag!=`string`||(O.splitView.PaneBackground=t.Tag.replace(/^\{\}/,``))};_(()=>{Z(O.displayModeCombobox),Y()});let Q=e=>String(e).replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`),$={t:c,currentPage:l,pageKey:u,isFavoriteState:g,pageTheme:T,toggleTheme:E,toggleFavorite:D,namescope:O,pageTitle:k,pageDescription:A,sampleHeader:j,themeButtonName:M,favoriteButtonName:N,favoriteGlyph:P,paneContentLabel:F,splitViewContentLabel:I,isPaneOpenLabel:L,placementLabel:R,leftLabel:z,rightLabel:B,displayModeLabel:V,paneBackgroundLabel:H,openPaneLengthLabel:se,compactPaneLengthLabel:U,inlineLabel:W,compactInlineLabel:G,overlayLabel:K,compactOverlayLabel:ce,themeBackgroundLabel:le,redLabel:ue,blueLabel:de,greenLabel:fe,NavLinks:q,selectedNavSymbol:J,selectedContent:pe,NavLinksList_ItemClick:me,NavLinksList_SelectionChanged:he,UpdateNavLinkItemLayout:Y,PanePlacement_Toggled:ge,togglePaneButton_CheckedChanged:X,displayModeCombobox_SelectionChanged:Z,paneBackgroundCombobox_SelectionChanged:_e,escapeXaml:Q,splitViewXaml:h(()=>{let e=O.paneBackgroundCombobox?.SelectedItem?.Tag,t={PaneBackground:typeof e==`string`?e.replace(/^\{\}/,``):`{ThemeResource SystemControlBackgroundChromeMediumLowBrush}`,IsPaneOpen:O.splitView?.IsPaneOpen===!1?`False`:`True`,OpenPaneLength:O.openPaneLengthSlider?.Value??256,CompactPaneLength:O.compactPaneLengthSlider?.Value??48,DisplayMode:O.splitView?.DisplayMode??`Inline`},n=O.splitView?.PanePlacement===`Right`?`RightIconNavLinkItemTemplate`:`LeftIconNavLinkItemTemplate`;return`--- header
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
</SplitView>`.split(/--- xaml\s*\r?\n/)[1]?.trim().replace(/\$\((\w+)\)/g,(e,n)=>Q(t[n]??``)).replace(`Text="PANE CONTENT"`,`Text="${Q(F.value)}"`).replace(`Text="SPLITVIEW CONTENT"`,`Text="${Q(I.value)}"`).replace(`StaticResource NavLinkItemTemplate`,`StaticResource ${n}`)??``}),computed:h,inject:f,onMounted:_,provide:a,ref:o,shallowReactive:s,Button:v,ComboBox:y,get ComboBoxItem(){return b},ControlExample:oe,Grid:n,ListView:te,Page:t,ScrollViewer:ee,Slider:ne,SplitView:re,StackPanel:x,SymbolIcon:r,TextBlock:p,ToggleButton:ie,ToggleSwitch:ae,get useI18n(){return d},get xamlNameScopeKey(){return m},get createPageState(){return S},get basicSplitViewSample(){return C},get splitViewCSharp(){return w}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}};function E(t,n,r,a,o,s){let c=i(`ColumnDefinition`),d=i(`DataTemplate`),f=i(`RowDefinition`);return g(),l(a.Page,{"xmlns:controlPages":`using:WinUIGallery.ControlPages`},{default:e(()=>[u(a.Page.Resources,null,{default:e(()=>[u(d,{"x:Key":`LeftIconNavLinkItemTemplate`,"x:DataType":`controlPages:NavLink`},{default:e(()=>[u(a.Grid,{Margin:`2,0,0,0`,"AutomationProperties.Name":`{x:Bind Label}`},{default:e(()=>[u(a.Grid.ColumnDefinitions,null,{default:e(()=>[u(c,{Width:`Auto`}),u(c,{Width:`*`})]),_:1}),u(a.SymbolIcon,{"Grid.Column":`0`,Symbol:`{x:Bind Symbol}`}),u(a.TextBlock,{"Grid.Column":`1`,Margin:`24,0,0,0`,VerticalAlignment:`Center`,Text:`{x:Bind Label}`})]),_:1})]),_:1}),u(d,{"x:Key":`RightIconNavLinkItemTemplate`,"x:DataType":`controlPages:NavLink`},{default:e(()=>[u(a.Grid,{Margin:`0,0,2,0`,"AutomationProperties.Name":`{x:Bind Label}`},{default:e(()=>[u(a.Grid.ColumnDefinitions,null,{default:e(()=>[u(c,{Width:`*`}),u(c,{Width:`Auto`})]),_:1}),u(a.TextBlock,{"Grid.Column":`0`,Margin:`0,0,24,0`,VerticalAlignment:`Center`,Text:`{x:Bind Label}`}),u(a.SymbolIcon,{"Grid.Column":`1`,Symbol:`{x:Bind Symbol}`})]),_:1})]),_:1})]),_:1}),u(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[u(a.StackPanel,{class:`gallery-item-page`},{default:e(()=>[u(a.StackPanel,{class:`page-heading`},{default:e(()=>[u(a.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),u(a.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(a.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:e(()=>[u(a.Button,{class:`header-action`,"AutomationProperties.Name":`{x:Bind themeButtonName, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind themeButtonName, Mode=OneWay}`,Click:`toggleTheme`},{default:e(()=>[u(a.TextBlock,{class:`icon`,Text:``})]),_:1}),u(a.ToggleButton,{class:`header-action`,"AutomationProperties.Name":`{x:Bind favoriteButtonName, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind favoriteButtonName, Mode=OneWay}`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`},{default:e(()=>[u(a.TextBlock,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),u(a.StackPanel,{class:`gallery-page-content`},{default:e(()=>[u(a.ControlExample,{class:`splitview-example`,"x:Name":`Example1`,SampleDefinition:`SplitView\\BasicSplitview.txt`,HeaderText:`{x:Bind sampleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind splitViewXaml, Mode=OneWay}`,CSharp:`{x:Bind splitViewCSharp, Mode=OneWay}`},{default:e(()=>[u(a.ControlExample.Example,null,{default:e(()=>[u(a.Grid,{class:`split-view-sample-host`,Height:`300`,Width:`400`,VerticalAlignment:`Top`},{default:e(()=>[u(a.SplitView,{"x:Name":`splitView`,CompactPaneLength:`{x:Bind compactPaneLengthSlider.Value, Mode=OneWay}`,DisplayMode:`CompactOverlay`,IsPaneOpen:`{x:Bind togglePaneButton.IsChecked, Mode=TwoWay, Converter={StaticResource nullableBooleanToBooleanConverter}}`,IsTabStop:`False`,MaxWidth:`400`,OpenPaneLength:`{x:Bind openPaneLengthSlider.Value, Mode=OneWay}`,PaneBackground:`{ThemeResource SystemControlBackgroundChromeMediumLowBrush}`},{default:e(()=>[u(a.SplitView.Pane,null,{default:e(()=>[u(a.Grid,{class:`split-pane-layout`},{default:e(()=>[u(a.Grid.RowDefinitions,null,{default:e(()=>[u(f,{Height:`Auto`}),u(f,{Height:`*`}),u(f,{Height:`Auto`})]),_:1}),u(a.TextBlock,{"x:Name":`PaneHeader`,Margin:`60,12,0,0`,Style:`{StaticResource BaseTextBlockStyle}`,Text:`{x:Bind paneContentLabel, Mode=OneWay}`}),u(a.ListView,{"x:Name":`NavLinksList`,class:`nav-links-list`,"Grid.Row":`1`,Margin:`0,12,0,0`,VerticalAlignment:`Stretch`,IsItemClickEnabled:`True`,ItemClick:`NavLinksList_ItemClick`,ItemsSource:`{x:Bind NavLinks, Mode=OneWay}`,ItemTemplate:`{StaticResource LeftIconNavLinkItemTemplate}`,SelectionChanged:`NavLinksList_SelectionChanged`,SelectionMode:`Single`})]),_:1})]),_:1}),u(a.SplitView.Content,null,{default:e(()=>[u(a.Grid,{class:`split-content-layout`},{default:e(()=>[u(a.Grid.RowDefinitions,null,{default:e(()=>[u(f,{Height:`Auto`}),u(f,{Height:`*`})]),_:1}),u(a.TextBlock,{Margin:`12,12,0,0`,Style:`{StaticResource BaseTextBlockStyle}`,Text:`{x:Bind splitViewContentLabel, Mode=OneWay}`}),u(a.TextBlock,{"x:Name":`content`,"Grid.Row":`1`,Margin:`12,12,0,0`,Style:`{StaticResource BodyTextBlockStyle}`,Text:`{x:Bind selectedContent, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),u(a.ControlExample.Output,null,{default:e(()=>[u(a.TextBlock,{class:`splitview-output`,Text:`{x:Bind selectedContent, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),u(a.ControlExample.Options,null,{default:e(()=>[u(a.StackPanel,{class:`split-options`},{default:e(()=>[u(a.ToggleButton,{"x:Name":`togglePaneButton`,Content:`{x:Bind isPaneOpenLabel, Mode=OneWay}`,Checked:`togglePaneButton_CheckedChanged`,Unchecked:`togglePaneButton_CheckedChanged`,IsChecked:`True`}),u(a.ToggleSwitch,{MinWidth:`120`,Margin:`0,12,0,0`,Header:`{x:Bind placementLabel, Mode=OneWay}`,OffContent:`{x:Bind leftLabel, Mode=OneWay}`,OnContent:`{x:Bind rightLabel, Mode=OneWay}`,Toggled:`PanePlacement_Toggled`}),u(a.ComboBox,{"x:Name":`displayModeCombobox`,Width:`196`,Margin:`0,4,0,0`,VerticalAlignment:`Center`,Header:`{x:Bind displayModeLabel, Mode=OneWay}`,SelectedIndex:`0`,SelectionChanged:`displayModeCombobox_SelectionChanged`},{default:e(()=>[u(a.ComboBoxItem,{Content:`{x:Bind inlineLabel, Mode=OneWay}`,Tag:`Inline`}),u(a.ComboBoxItem,{Content:`{x:Bind compactInlineLabel, Mode=OneWay}`,Tag:`CompactInline`}),u(a.ComboBoxItem,{Content:`{x:Bind overlayLabel, Mode=OneWay}`,Tag:`Overlay`}),u(a.ComboBoxItem,{Content:`{x:Bind compactOverlayLabel, Mode=OneWay}`,Tag:`CompactOverlay`})]),_:1}),u(a.ComboBox,{"x:Name":`paneBackgroundCombobox`,Width:`196`,Margin:`0,12,0,0`,VerticalAlignment:`Center`,Header:`{x:Bind paneBackgroundLabel, Mode=OneWay}`,SelectedIndex:`0`,SelectionChanged:`paneBackgroundCombobox_SelectionChanged`},{default:e(()=>[u(a.ComboBoxItem,{Content:`{x:Bind themeBackgroundLabel, Mode=OneWay}`,Tag:`{}{ThemeResource SystemControlBackgroundChromeMediumLowBrush}`}),u(a.ComboBoxItem,{Content:`{x:Bind redLabel, Mode=OneWay}`,Tag:`Red`}),u(a.ComboBoxItem,{Content:`{x:Bind blueLabel, Mode=OneWay}`,Tag:`Blue`}),u(a.ComboBoxItem,{Content:`{x:Bind greenLabel, Mode=OneWay}`,Tag:`Green`})]),_:1}),u(a.Slider,{"x:Name":`openPaneLengthSlider`,Width:`196`,Margin:`0,12,0,0`,Header:`{x:Bind openPaneLengthLabel, Mode=OneWay}`,IsFocusEngagementEnabled:`False`,Maximum:`500`,Minimum:`128`,SnapsTo:`StepValues`,StepFrequency:`8`,Value:`256`}),u(a.Slider,{"x:Name":`compactPaneLengthSlider`,Width:`196`,Header:`{x:Bind compactPaneLengthLabel, Mode=OneWay}`,IsFocusEngagementEnabled:`False`,Maximum:`128`,Minimum:`24`,SnapsTo:`StepValues`,StepFrequency:`8`,Value:`48`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var D=c(T,[[`render`,E],[`__scopeId`,`data-v-8f37536b`],[`__file`,`SplitViewPage.vue`]]);export{D as default};