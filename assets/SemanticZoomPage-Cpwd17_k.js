import{Fi as e,I as t,Wt as n,a as r,ai as i,di as a,et as o,fi as s,hi as c,l,o as u,ri as d,t as f,wi as p,x as m}from"./ScrollViewer-PoO_ma9Z.js";import{t as h}from"./Button-DjU0urmJ.js";import{t as g}from"./GridView-BZFBsHA0.js";import{t as _}from"./StackPanel-CT7pl8zy.js";import{t as v}from"./ListView-D3xyFzBM.js";import{t as y}from"./SemanticZoom-DWCrJfsl.js";import{t as b}from"./ToggleButton-DwmhXZge.js";import{t as x}from"./CollectionViewSource-DdhiEyLl.js";import{t as S}from"./ControlExample-C1ahTZEr.js";import{t as C}from"./pageState-BN3kXI7L.js";import{t as w}from"./ControlInfoGroups-DCQADezn.js";var T=`// Copyright (c) Microsoft Corporation. All rights reserved.
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
`,E=s({__name:`SemanticZoomPage`,setup(e,{expose:n}){n();let{t:i}=o(),a=c(`currentPage`),{pageTheme:s,isFavoriteState:p,toggleTheme:E,toggleFavorite:D}=C(a?.value||`semanticzoom`),O={t:i,currentPage:a,pageTheme:s,isFavoriteState:p,toggleTheme:E,toggleFavorite:D,pageTitle:d(()=>i(`text.semanticzoom`)),pageDescription:d(()=>i(`text.semanticzoom-description`)),sampleHeader:d(()=>i(`sample.semanticzoom.simple`)),themeLabel:d(()=>i(`gallery.page-header.toggle-theme`)),favoriteLabel:d(()=>i(`gallery.page-header.favorite`)),favoriteGlyph:d(()=>p.value?``:``),Groups:d(()=>w.map(e=>({UniqueId:e.UniqueId,Title:i(e.TitleKey),Items:e.Items.map(e=>({UniqueId:e.UniqueId,Title:i(e.TitleKey),Subtitle:i(e.SubtitleKey)}))}))),sampleXaml:`--- header
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
</SemanticZoom>`.split(`--- xaml`)[1]?.trim()??``,sampleCSharp:T,List_GotFocus:e=>e?.SemanticZoomOwner?.StartBringIntoView?.(),Button:h,get CollectionViewSource(){return x},ControlExample:S,FontIcon:r,GridView:g,ListView:v,Page:t,ScrollViewer:f,SemanticZoom:y,StackPanel:_,TextBlock:u,ToggleButton:b,get GroupStyle(){return l},get DataTemplate(){return m}};return Object.defineProperty(O,"__isScriptSetup",{enumerable:!1,value:!0}),O}});function D(t,n,r,o,s,c){return p(),i(o.Page,null,{default:e(()=>[a(o.Page.Resources,null,{default:e(()=>[a(o.CollectionViewSource,{"x:Name":`cvsGroups`,IsSourceGrouped:`True`,ItemsPath:`Items`,Source:`{x:Bind Groups, Mode=OneWay}`}),a(o.DataTemplate,{"x:Key":`ZoomedInTemplate`,"x:DataType":`models:ControlInfoDataItem`},{default:e(()=>[a(o.StackPanel,{MinWidth:`200`,Margin:`12,6,12,6`},{default:e(()=>[a(o.TextBlock,{Style:`{StaticResource BaseTextBlockStyle}`,Text:`{x:Bind Title}`}),a(o.TextBlock,{Width:`300`,HorizontalAlignment:`Left`,Style:`{StaticResource BodyTextBlockStyle}`,Text:`{x:Bind Subtitle}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),a(o.DataTemplate,{"x:Key":`ZoomedInGroupHeaderTemplate`,"x:DataType":`models:ControlInfoDataGroup`},{default:e(()=>[a(o.TextBlock,{Foreground:`{ThemeResource ApplicationForegroundThemeBrush}`,Style:`{StaticResource SubtitleTextBlockStyle}`,Text:`{x:Bind Title}`})]),_:1}),a(o.DataTemplate,{"x:Key":`ZoomedOutTemplate`,"x:DataType":`wuxdata:ICollectionViewGroup`},{default:e(()=>[a(o.TextBlock,{Style:`{StaticResource SubtitleTextBlockStyle}`,Text:`{x:Bind ((models:ControlInfoDataGroup)Group).Title}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),a(o.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[a(o.StackPanel,{class:`gallery-item-page`},{default:e(()=>[a(o.StackPanel,{class:`page-heading`},{default:e(()=>[a(o.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),a(o.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),a(o.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:e(()=>[a(o.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind themeLabel, Mode=OneWay}`},{default:e(()=>[a(o.FontIcon,{Glyph:``})]),_:1}),a(o.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind favoriteLabel, Mode=OneWay}`},{default:e(()=>[a(o.FontIcon,{Glyph:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),a(o.StackPanel,{class:`gallery-page-content`},{default:e(()=>[a(o.ControlExample,{"x:Name":`Example1`,HeaderText:`{x:Bind sampleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind sampleXaml}`,CSharp:`{x:Bind sampleCSharp}`},{default:e(()=>[a(o.ControlExample.Example,null,{default:e(()=>[a(o.SemanticZoom,{"x:Name":`Control1`,Height:`500`},{default:e(()=>[a(o.SemanticZoom.ZoomedInView,null,{default:e(()=>[a(o.GridView,{GotFocus:`List_GotFocus`,ItemTemplate:`{StaticResource ZoomedInTemplate}`,ItemsSource:`{x:Bind cvsGroups.View, Mode=OneWay}`,"ScrollViewer.IsHorizontalScrollChainingEnabled":`False`,SelectionMode:`None`},{default:e(()=>[a(o.GridView.GroupStyle,null,{default:e(()=>[a(o.GroupStyle,{HeaderTemplate:`{StaticResource ZoomedInGroupHeaderTemplate}`})]),_:1})]),_:1})]),_:1}),a(o.SemanticZoom.ZoomedOutView,null,{default:e(()=>[a(o.ListView,{GotFocus:`List_GotFocus`,ItemTemplate:`{StaticResource ZoomedOutTemplate}`,ItemsSource:`{x:Bind cvsGroups.View.CollectionGroups, Mode=OneWay}`,SelectionMode:`None`})]),_:1})]),_:1})]),_:1}),a(o.ControlExample.Output),a(o.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var O=n(E,[[`render`,D],[`__scopeId`,`data-v-00522a5c`],[`__file`,`SemanticZoomPage.vue`]]);export{O as default};