import{Bi as e,Cn as t,Mn as n,Wt as r,_i as i,a,bi as o,ci as s,gi as c,ki as l,nn as u,o as d,p as f,t as p,ui as m}from"./ScrollViewer-CHNE18MA.js";import{t as h}from"./Button-DO0TiUOq.js";import{t as g}from"./StackPanel-C60XOD66.js";import{t as _}from"./ToggleButton-ZsjZg8Nu.js";import{t as v}from"./ControlExample-BKyw2NwY.js";import{t as y}from"./CollectionViewSource-ztLSLQia.js";import{t as b}from"./SemanticZoom-DXBfKLnR.js";import{t as x}from"./pageState-Djrh7EdY.js";import{t as S}from"./GridView-3JjGgSZX.js";import{t as C}from"./ListView-CsUAm8Ur.js";import{t as w}from"./ControlInfoGroups-DCQADezn.js";var T=`// Copyright (c) Microsoft Corporation. All rights reserved.
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
`,E=i({__name:`SemanticZoomPage`,setup(e,{expose:n}){n();let{t:i}=f(),c=o(`currentPage`),{pageTheme:l,isFavoriteState:m,toggleTheme:E,toggleFavorite:D}=x(c?.value||`semanticzoom`),O={t:i,currentPage:c,pageTheme:l,isFavoriteState:m,toggleTheme:E,toggleFavorite:D,pageTitle:s(()=>i(`text.semanticzoom`)),pageDescription:s(()=>i(`text.semanticzoom-description`)),sampleHeader:s(()=>i(`sample.semanticzoom.simple`)),themeLabel:s(()=>i(`gallery.page-header.toggle-theme`)),favoriteLabel:s(()=>i(`gallery.page-header.favorite`)),favoriteGlyph:s(()=>m.value?``:``),Groups:s(()=>w.map(e=>({UniqueId:e.UniqueId,Title:i(e.TitleKey),Items:e.Items.map(e=>({UniqueId:e.UniqueId,Title:i(e.TitleKey),Subtitle:i(e.SubtitleKey)}))}))),sampleXaml:`--- header
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
</SemanticZoom>`.split(`--- xaml`)[1]?.trim()??``,sampleCSharp:T,List_GotFocus:e=>e?.SemanticZoomOwner?.StartBringIntoView?.(),Button:h,get CollectionViewSource(){return y},ControlExample:v,FontIcon:a,GridView:S,ListView:C,Page:t,ScrollViewer:p,SemanticZoom:b,StackPanel:g,TextBlock:d,ToggleButton:_,get GroupStyle(){return r},get DataTemplate(){return u}};return Object.defineProperty(O,"__isScriptSetup",{enumerable:!1,value:!0}),O}});function D(t,n,r,i,a,o){return l(),m(i.Page,null,{default:e(()=>[c(i.Page.Resources,null,{default:e(()=>[c(i.CollectionViewSource,{"x:Name":`cvsGroups`,IsSourceGrouped:`True`,ItemsPath:`Items`,Source:`{x:Bind Groups, Mode=OneWay}`}),c(i.DataTemplate,{"x:Key":`ZoomedInTemplate`,"x:DataType":`models:ControlInfoDataItem`},{default:e(()=>[c(i.StackPanel,{MinWidth:`200`,Margin:`12,6,12,6`},{default:e(()=>[c(i.TextBlock,{Style:`{StaticResource BaseTextBlockStyle}`,Text:`{x:Bind Title}`}),c(i.TextBlock,{Width:`300`,HorizontalAlignment:`Left`,Style:`{StaticResource BodyTextBlockStyle}`,Text:`{x:Bind Subtitle}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),c(i.DataTemplate,{"x:Key":`ZoomedInGroupHeaderTemplate`,"x:DataType":`models:ControlInfoDataGroup`},{default:e(()=>[c(i.TextBlock,{Foreground:`{ThemeResource ApplicationForegroundThemeBrush}`,Style:`{StaticResource SubtitleTextBlockStyle}`,Text:`{x:Bind Title}`})]),_:1}),c(i.DataTemplate,{"x:Key":`ZoomedOutTemplate`,"x:DataType":`wuxdata:ICollectionViewGroup`},{default:e(()=>[c(i.TextBlock,{Style:`{StaticResource SubtitleTextBlockStyle}`,Text:`{x:Bind ((models:ControlInfoDataGroup)Group).Title}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),c(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[c(i.StackPanel,{class:`gallery-item-page`},{default:e(()=>[c(i.StackPanel,{class:`page-heading`},{default:e(()=>[c(i.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),c(i.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),c(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:e(()=>[c(i.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind themeLabel, Mode=OneWay}`},{default:e(()=>[c(i.FontIcon,{Glyph:``})]),_:1}),c(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind favoriteLabel, Mode=OneWay}`},{default:e(()=>[c(i.FontIcon,{Glyph:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),c(i.StackPanel,{class:`gallery-page-content`},{default:e(()=>[c(i.ControlExample,{"x:Name":`Example1`,HeaderText:`{x:Bind sampleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind sampleXaml}`,CSharp:`{x:Bind sampleCSharp}`},{default:e(()=>[c(i.ControlExample.Example,null,{default:e(()=>[c(i.SemanticZoom,{"x:Name":`Control1`,Height:`500`},{default:e(()=>[c(i.SemanticZoom.ZoomedInView,null,{default:e(()=>[c(i.GridView,{GotFocus:`List_GotFocus`,ItemTemplate:`{StaticResource ZoomedInTemplate}`,ItemsSource:`{x:Bind cvsGroups.View, Mode=OneWay}`,"ScrollViewer.IsHorizontalScrollChainingEnabled":`False`,SelectionMode:`None`},{default:e(()=>[c(i.GridView.GroupStyle,null,{default:e(()=>[c(i.GroupStyle,{HeaderTemplate:`{StaticResource ZoomedInGroupHeaderTemplate}`})]),_:1})]),_:1})]),_:1}),c(i.SemanticZoom.ZoomedOutView,null,{default:e(()=>[c(i.ListView,{GotFocus:`List_GotFocus`,ItemTemplate:`{StaticResource ZoomedOutTemplate}`,ItemsSource:`{x:Bind cvsGroups.View.CollectionGroups, Mode=OneWay}`,SelectionMode:`None`})]),_:1})]),_:1})]),_:1}),c(i.ControlExample.Output),c(i.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var O=n(E,[[`render`,D],[`__scopeId`,`data-v-00522a5c`],[`__file`,`SemanticZoomPage.vue`]]);export{O as default};