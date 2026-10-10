import{$ as e,Ai as t,Bi as n,Cn as r,Ei as i,En as a,Ji as o,Mn as s,Ni as c,Yi as l,bi as u,ci as d,dr as f,gi as p,ki as m,o as ee,p as h,t as g,ui as _}from"./ScrollViewer-CHNE18MA.js";import{t as v}from"./Button-DO0TiUOq.js";import{t as y}from"./StackPanel-C60XOD66.js";import{t as b}from"./ToggleButton-ZsjZg8Nu.js";import{t as te}from"./ComboBox-CjdqaKdN.js";import{t as ne}from"./inlineControlProperties-k1PUSjJA.js";import{t as re}from"./Slider-8IBh_tz8.js";import{t as ie}from"./ControlExample-BKyw2NwY.js";import{t as ae}from"./ToggleSwitch-CSSaPMZA.js";import{t as oe}from"./SplitView-CXVCOBQ0.js";import{t as x}from"./pageState-Djrh7EdY.js";import{t as S}from"./ListView-CsUAm8Ur.js";var C=`--- header
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
`,T={__name:`SplitViewPage`,setup(n,{expose:s}){s();let{t:c}=h(),p=u(`currentPage`),m=d(()=>p?.value||`splitview`),{isFavoriteState:_,pageTheme:T,toggleTheme:E,toggleFavorite:D}=x(m.value),O=l({});t(f,O);let k=d(()=>c(`text.splitview`)),A=d(()=>c(`text.a-container-with-two-views-one-view-for-the-main`)),j=d(()=>c(`text.a-basic-splitview`)),M=d(()=>c(`gallery.page-header.toggle-theme`)),N=d(()=>c(`gallery.page-header.favorite`)),P=d(()=>_.value?``:``),F=d(()=>c(`sample.splitview.pane-content`)),I=d(()=>c(`sample.splitview.splitview-content`)),L=d(()=>c(`sample.splitview.is-pane-open`)),R=d(()=>c(`sample.splitview.placement`)),z=d(()=>c(`sample.splitview.left`)),B=d(()=>c(`sample.splitview.right`)),V=d(()=>c(`sample.splitview.display-mode`)),se=d(()=>c(`sample.splitview.pane-background`)),H=d(()=>c(`sample.splitview.open-pane-length`)),U=d(()=>c(`sample.splitview.compact-pane-length`)),W=d(()=>c(`sample.splitview.inline`)),G=d(()=>c(`sample.splitview.compact-inline`)),K=d(()=>c(`sample.splitview.overlay`)),ce=d(()=>c(`sample.splitview.compact-overlay`)),le=d(()=>c(`sample.splitview.theme-background`)),ue=d(()=>c(`sample.splitview.red`)),de=d(()=>c(`sample.splitview.blue`)),fe=d(()=>c(`sample.splitview.green`)),q=d(()=>[{Label:c(`sample.splitview.people`),Symbol:`People`},{Label:c(`sample.splitview.globe`),Symbol:`Globe`},{Label:c(`sample.splitview.message`),Symbol:`Message`},{Label:c(`sample.splitview.mail`),Symbol:`Mail`}]),J=o(``),pe=d(()=>{let e=q.value.find(e=>e.Symbol===J.value);return e?c(`sample.splitview.navigation-page`,{page:e.Label}):``}),me=(e,t)=>{let n=t?.ClickedItem;n?.Symbol&&(J.value=n.Symbol)},he=(e,t)=>{let n=t?.AddedItems?.[0];n?.Symbol&&(J.value=n.Symbol)},Y=()=>{O.NavLinksList&&(O.NavLinksList.ItemTemplate=O.splitView?.PanePlacement===`Right`?`{StaticResource RightIconNavLinkItemTemplate}`:`{StaticResource LeftIconNavLinkItemTemplate}`)},ge=(e,t=e)=>{O.splitView&&(O.splitView.PanePlacement=t?.IsOn??e?.IsOn?`Right`:`Left`,Y())},X=()=>Y(),Z=e=>{let t=e?.SelectedItem;O.splitView&&[`Inline`,`CompactInline`,`Overlay`,`CompactOverlay`].includes(t?.Tag)&&(O.splitView.DisplayMode=t.Tag)},_e=e=>{let t=e?.SelectedItem;!O.splitView||typeof t?.Tag!=`string`||(O.splitView.PaneBackground=t.Tag.replace(/^\{\}/,``))};i(()=>{Z(O.displayModeCombobox),Y()});let Q=e=>String(e).replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`),$={t:c,currentPage:p,pageKey:m,isFavoriteState:_,pageTheme:T,toggleTheme:E,toggleFavorite:D,namescope:O,pageTitle:k,pageDescription:A,sampleHeader:j,themeButtonName:M,favoriteButtonName:N,favoriteGlyph:P,paneContentLabel:F,splitViewContentLabel:I,isPaneOpenLabel:L,placementLabel:R,leftLabel:z,rightLabel:B,displayModeLabel:V,paneBackgroundLabel:se,openPaneLengthLabel:H,compactPaneLengthLabel:U,inlineLabel:W,compactInlineLabel:G,overlayLabel:K,compactOverlayLabel:ce,themeBackgroundLabel:le,redLabel:ue,blueLabel:de,greenLabel:fe,NavLinks:q,selectedNavSymbol:J,selectedContent:pe,NavLinksList_ItemClick:me,NavLinksList_SelectionChanged:he,UpdateNavLinkItemLayout:Y,PanePlacement_Toggled:ge,togglePaneButton_CheckedChanged:X,displayModeCombobox_SelectionChanged:Z,paneBackgroundCombobox_SelectionChanged:_e,escapeXaml:Q,splitViewXaml:d(()=>{let e=O.paneBackgroundCombobox?.SelectedItem?.Tag,t={PaneBackground:typeof e==`string`?e.replace(/^\{\}/,``):`{ThemeResource SystemControlBackgroundChromeMediumLowBrush}`,IsPaneOpen:O.splitView?.IsPaneOpen===!1?`False`:`True`,OpenPaneLength:O.openPaneLengthSlider?.Value??256,CompactPaneLength:O.compactPaneLengthSlider?.Value??48,DisplayMode:O.splitView?.DisplayMode??`Inline`},n=O.splitView?.PanePlacement===`Right`?`RightIconNavLinkItemTemplate`:`LeftIconNavLinkItemTemplate`;return`--- header
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
</SplitView>`.split(/--- xaml\s*\r?\n/)[1]?.trim().replace(/\$\((\w+)\)/g,(e,n)=>Q(t[n]??``)).replace(`Text="PANE CONTENT"`,`Text="${Q(F.value)}"`).replace(`Text="SPLITVIEW CONTENT"`,`Text="${Q(I.value)}"`).replace(`StaticResource NavLinkItemTemplate`,`StaticResource ${n}`)??``}),computed:d,inject:u,onMounted:i,provide:t,ref:o,shallowReactive:l,Button:v,ComboBox:te,get ComboBoxItem(){return ne},ControlExample:ie,Grid:a,ListView:S,Page:r,ScrollViewer:g,Slider:re,SplitView:oe,StackPanel:y,SymbolIcon:e,TextBlock:ee,ToggleButton:b,ToggleSwitch:ae,get useI18n(){return h},get xamlNameScopeKey(){return f},get createPageState(){return x},get basicSplitViewSample(){return C},get splitViewCSharp(){return w}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}};function E(e,t,r,i,a,o){let s=c(`ColumnDefinition`),l=c(`DataTemplate`),u=c(`RowDefinition`);return m(),_(i.Page,{"xmlns:controlPages":`using:WinUIGallery.ControlPages`},{default:n(()=>[p(i.Page.Resources,null,{default:n(()=>[p(l,{"x:Key":`LeftIconNavLinkItemTemplate`,"x:DataType":`controlPages:NavLink`},{default:n(()=>[p(i.Grid,{Margin:`2,0,0,0`,"AutomationProperties.Name":`{x:Bind Label}`},{default:n(()=>[p(i.Grid.ColumnDefinitions,null,{default:n(()=>[p(s,{Width:`Auto`}),p(s,{Width:`*`})]),_:1}),p(i.SymbolIcon,{"Grid.Column":`0`,Symbol:`{x:Bind Symbol}`}),p(i.TextBlock,{"Grid.Column":`1`,Margin:`24,0,0,0`,VerticalAlignment:`Center`,Text:`{x:Bind Label}`})]),_:1})]),_:1}),p(l,{"x:Key":`RightIconNavLinkItemTemplate`,"x:DataType":`controlPages:NavLink`},{default:n(()=>[p(i.Grid,{Margin:`0,0,2,0`,"AutomationProperties.Name":`{x:Bind Label}`},{default:n(()=>[p(i.Grid.ColumnDefinitions,null,{default:n(()=>[p(s,{Width:`*`}),p(s,{Width:`Auto`})]),_:1}),p(i.TextBlock,{"Grid.Column":`0`,Margin:`0,0,24,0`,VerticalAlignment:`Center`,Text:`{x:Bind Label}`}),p(i.SymbolIcon,{"Grid.Column":`1`,Symbol:`{x:Bind Symbol}`})]),_:1})]),_:1})]),_:1}),p(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[p(i.StackPanel,{class:`gallery-item-page`},{default:n(()=>[p(i.StackPanel,{class:`page-heading`},{default:n(()=>[p(i.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),p(i.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:n(()=>[p(i.Button,{class:`header-action`,"AutomationProperties.Name":`{x:Bind themeButtonName, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind themeButtonName, Mode=OneWay}`,Click:`toggleTheme`},{default:n(()=>[p(i.TextBlock,{class:`icon`,Text:``})]),_:1}),p(i.ToggleButton,{class:`header-action`,"AutomationProperties.Name":`{x:Bind favoriteButtonName, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind favoriteButtonName, Mode=OneWay}`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`},{default:n(()=>[p(i.TextBlock,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),p(i.StackPanel,{class:`gallery-page-content`},{default:n(()=>[p(i.ControlExample,{class:`splitview-example`,"x:Name":`Example1`,SampleDefinition:`SplitView\\BasicSplitview.txt`,HeaderText:`{x:Bind sampleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind splitViewXaml, Mode=OneWay}`,CSharp:`{x:Bind splitViewCSharp, Mode=OneWay}`},{default:n(()=>[p(i.ControlExample.Example,null,{default:n(()=>[p(i.Grid,{class:`split-view-sample-host`,Height:`300`,Width:`400`,VerticalAlignment:`Top`},{default:n(()=>[p(i.SplitView,{"x:Name":`splitView`,CompactPaneLength:`{x:Bind compactPaneLengthSlider.Value, Mode=OneWay}`,DisplayMode:`CompactOverlay`,IsPaneOpen:`{x:Bind togglePaneButton.IsChecked, Mode=TwoWay, Converter={StaticResource nullableBooleanToBooleanConverter}}`,IsTabStop:`False`,MaxWidth:`400`,OpenPaneLength:`{x:Bind openPaneLengthSlider.Value, Mode=OneWay}`,PaneBackground:`{ThemeResource SystemControlBackgroundChromeMediumLowBrush}`},{default:n(()=>[p(i.SplitView.Pane,null,{default:n(()=>[p(i.Grid,{class:`split-pane-layout`},{default:n(()=>[p(i.Grid.RowDefinitions,null,{default:n(()=>[p(u,{Height:`Auto`}),p(u,{Height:`*`}),p(u,{Height:`Auto`})]),_:1}),p(i.TextBlock,{"x:Name":`PaneHeader`,Margin:`60,12,0,0`,Style:`{StaticResource BaseTextBlockStyle}`,Text:`{x:Bind paneContentLabel, Mode=OneWay}`}),p(i.ListView,{"x:Name":`NavLinksList`,class:`nav-links-list`,"Grid.Row":`1`,Margin:`0,12,0,0`,VerticalAlignment:`Stretch`,IsItemClickEnabled:`True`,ItemClick:`NavLinksList_ItemClick`,ItemsSource:`{x:Bind NavLinks, Mode=OneWay}`,ItemTemplate:`{StaticResource LeftIconNavLinkItemTemplate}`,SelectionChanged:`NavLinksList_SelectionChanged`,SelectionMode:`Single`})]),_:1})]),_:1}),p(i.SplitView.Content,null,{default:n(()=>[p(i.Grid,{class:`split-content-layout`},{default:n(()=>[p(i.Grid.RowDefinitions,null,{default:n(()=>[p(u,{Height:`Auto`}),p(u,{Height:`*`})]),_:1}),p(i.TextBlock,{Margin:`12,12,0,0`,Style:`{StaticResource BaseTextBlockStyle}`,Text:`{x:Bind splitViewContentLabel, Mode=OneWay}`}),p(i.TextBlock,{"x:Name":`content`,"Grid.Row":`1`,Margin:`12,12,0,0`,Style:`{StaticResource BodyTextBlockStyle}`,Text:`{x:Bind selectedContent, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),p(i.ControlExample.Output,null,{default:n(()=>[p(i.TextBlock,{class:`splitview-output`,Text:`{x:Bind selectedContent, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),p(i.ControlExample.Options,null,{default:n(()=>[p(i.StackPanel,{class:`split-options`},{default:n(()=>[p(i.ToggleButton,{"x:Name":`togglePaneButton`,Content:`{x:Bind isPaneOpenLabel, Mode=OneWay}`,Checked:`togglePaneButton_CheckedChanged`,Unchecked:`togglePaneButton_CheckedChanged`,IsChecked:`True`}),p(i.ToggleSwitch,{MinWidth:`120`,Margin:`0,12,0,0`,Header:`{x:Bind placementLabel, Mode=OneWay}`,OffContent:`{x:Bind leftLabel, Mode=OneWay}`,OnContent:`{x:Bind rightLabel, Mode=OneWay}`,Toggled:`PanePlacement_Toggled`}),p(i.ComboBox,{"x:Name":`displayModeCombobox`,Width:`196`,Margin:`0,4,0,0`,VerticalAlignment:`Center`,Header:`{x:Bind displayModeLabel, Mode=OneWay}`,SelectedIndex:`0`,SelectionChanged:`displayModeCombobox_SelectionChanged`},{default:n(()=>[p(i.ComboBoxItem,{Content:`{x:Bind inlineLabel, Mode=OneWay}`,Tag:`Inline`}),p(i.ComboBoxItem,{Content:`{x:Bind compactInlineLabel, Mode=OneWay}`,Tag:`CompactInline`}),p(i.ComboBoxItem,{Content:`{x:Bind overlayLabel, Mode=OneWay}`,Tag:`Overlay`}),p(i.ComboBoxItem,{Content:`{x:Bind compactOverlayLabel, Mode=OneWay}`,Tag:`CompactOverlay`})]),_:1}),p(i.ComboBox,{"x:Name":`paneBackgroundCombobox`,Width:`196`,Margin:`0,12,0,0`,VerticalAlignment:`Center`,Header:`{x:Bind paneBackgroundLabel, Mode=OneWay}`,SelectedIndex:`0`,SelectionChanged:`paneBackgroundCombobox_SelectionChanged`},{default:n(()=>[p(i.ComboBoxItem,{Content:`{x:Bind themeBackgroundLabel, Mode=OneWay}`,Tag:`{}{ThemeResource SystemControlBackgroundChromeMediumLowBrush}`}),p(i.ComboBoxItem,{Content:`{x:Bind redLabel, Mode=OneWay}`,Tag:`Red`}),p(i.ComboBoxItem,{Content:`{x:Bind blueLabel, Mode=OneWay}`,Tag:`Blue`}),p(i.ComboBoxItem,{Content:`{x:Bind greenLabel, Mode=OneWay}`,Tag:`Green`})]),_:1}),p(i.Slider,{"x:Name":`openPaneLengthSlider`,Width:`196`,Margin:`0,12,0,0`,Header:`{x:Bind openPaneLengthLabel, Mode=OneWay}`,IsFocusEngagementEnabled:`False`,Maximum:`500`,Minimum:`128`,SnapsTo:`StepValues`,StepFrequency:`8`,Value:`256`}),p(i.Slider,{"x:Name":`compactPaneLengthSlider`,Width:`196`,Header:`{x:Bind compactPaneLengthLabel, Mode=OneWay}`,IsFocusEngagementEnabled:`False`,Maximum:`128`,Minimum:`24`,SnapsTo:`StepValues`,StepFrequency:`8`,Value:`48`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var D=s(T,[[`render`,E],[`__scopeId`,`data-v-8f37536b`],[`__file`,`SplitViewPage.vue`]]);export{D as default};