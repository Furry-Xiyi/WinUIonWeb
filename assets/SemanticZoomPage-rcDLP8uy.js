import{Ei as e,I as t,Li as n,Wt as r,_i as i,a,ai as o,et as s,l as c,mi as l,o as u,pi as d,si as f,t as p,x as m}from"./ScrollViewer-BWDA_C78.js";import{t as h}from"./Button-BNDPNdYJ.js";import{t as g}from"./GridView-bN2cIfZT.js";import{t as _}from"./StackPanel-sg_Bd5oB.js";import{t as v}from"./ListView-DiQ0PqAw.js";import{t as y}from"./SemanticZoom-CbpFlpPn.js";import{t as b}from"./ToggleButton-HP5wmrvH.js";import{t as x}from"./CollectionViewSource-D7zEzpul.js";import{t as S}from"./ControlExample-CzGyf8u0.js";import{t as C}from"./pageState-CcJibQcm.js";import{t as w}from"./ControlInfoGroups-DCQADezn.js";var T=`// Copyright (c) Microsoft Corporation. All rights reserved.
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
`,E=l({__name:`SemanticZoomPage`,setup(e,{expose:n}){n();let{t:r}=s(),l=i(`currentPage`),{pageTheme:d,isFavoriteState:f,toggleTheme:E,toggleFavorite:D}=C(l?.value||`semanticzoom`),O={t:r,currentPage:l,pageTheme:d,isFavoriteState:f,toggleTheme:E,toggleFavorite:D,pageTitle:o(()=>r(`text.semanticzoom`)),pageDescription:o(()=>r(`text.semanticzoom-description`)),sampleHeader:o(()=>r(`sample.semanticzoom.simple`)),themeLabel:o(()=>r(`gallery.page-header.toggle-theme`)),favoriteLabel:o(()=>r(`gallery.page-header.favorite`)),favoriteGlyph:o(()=>f.value?``:``),Groups:o(()=>w.map(e=>({UniqueId:e.UniqueId,Title:r(e.TitleKey),Items:e.Items.map(e=>({UniqueId:e.UniqueId,Title:r(e.TitleKey),Subtitle:r(e.SubtitleKey)}))}))),sampleXaml:`--- header
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
</SemanticZoom>`.split(`--- xaml`)[1]?.trim()??``,sampleCSharp:T,List_GotFocus:e=>e?.SemanticZoomOwner?.StartBringIntoView?.(),Button:h,get CollectionViewSource(){return x},ControlExample:S,FontIcon:a,GridView:g,ListView:v,Page:t,ScrollViewer:p,SemanticZoom:y,StackPanel:_,TextBlock:u,ToggleButton:b,get GroupStyle(){return c},get DataTemplate(){return m}};return Object.defineProperty(O,"__isScriptSetup",{enumerable:!1,value:!0}),O}});function D(t,r,i,a,o,s){return e(),f(a.Page,null,{default:n(()=>[d(a.Page.Resources,null,{default:n(()=>[d(a.CollectionViewSource,{"x:Name":`cvsGroups`,IsSourceGrouped:`True`,ItemsPath:`Items`,Source:`{x:Bind Groups, Mode=OneWay}`}),d(a.DataTemplate,{"x:Key":`ZoomedInTemplate`,"x:DataType":`models:ControlInfoDataItem`},{default:n(()=>[d(a.StackPanel,{MinWidth:`200`,Margin:`12,6,12,6`},{default:n(()=>[d(a.TextBlock,{Style:`{StaticResource BaseTextBlockStyle}`,Text:`{x:Bind Title}`}),d(a.TextBlock,{Width:`300`,HorizontalAlignment:`Left`,Style:`{StaticResource BodyTextBlockStyle}`,Text:`{x:Bind Subtitle}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),d(a.DataTemplate,{"x:Key":`ZoomedInGroupHeaderTemplate`,"x:DataType":`models:ControlInfoDataGroup`},{default:n(()=>[d(a.TextBlock,{Foreground:`{ThemeResource ApplicationForegroundThemeBrush}`,Style:`{StaticResource SubtitleTextBlockStyle}`,Text:`{x:Bind Title}`})]),_:1}),d(a.DataTemplate,{"x:Key":`ZoomedOutTemplate`,"x:DataType":`wuxdata:ICollectionViewGroup`},{default:n(()=>[d(a.TextBlock,{Style:`{StaticResource SubtitleTextBlockStyle}`,Text:`{x:Bind ((models:ControlInfoDataGroup)Group).Title}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),d(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[d(a.StackPanel,{class:`gallery-item-page`},{default:n(()=>[d(a.StackPanel,{class:`page-heading`},{default:n(()=>[d(a.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),d(a.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),d(a.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:n(()=>[d(a.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind themeLabel, Mode=OneWay}`},{default:n(()=>[d(a.FontIcon,{Glyph:``})]),_:1}),d(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind favoriteLabel, Mode=OneWay}`},{default:n(()=>[d(a.FontIcon,{Glyph:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),d(a.StackPanel,{class:`gallery-page-content`},{default:n(()=>[d(a.ControlExample,{"x:Name":`Example1`,HeaderText:`{x:Bind sampleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind sampleXaml}`,CSharp:`{x:Bind sampleCSharp}`},{default:n(()=>[d(a.ControlExample.Example,null,{default:n(()=>[d(a.SemanticZoom,{"x:Name":`Control1`,Height:`500`},{default:n(()=>[d(a.SemanticZoom.ZoomedInView,null,{default:n(()=>[d(a.GridView,{GotFocus:`List_GotFocus`,ItemTemplate:`{StaticResource ZoomedInTemplate}`,ItemsSource:`{x:Bind cvsGroups.View, Mode=OneWay}`,"ScrollViewer.IsHorizontalScrollChainingEnabled":`False`,SelectionMode:`None`},{default:n(()=>[d(a.GridView.GroupStyle,null,{default:n(()=>[d(a.GroupStyle,{HeaderTemplate:`{StaticResource ZoomedInGroupHeaderTemplate}`})]),_:1})]),_:1})]),_:1}),d(a.SemanticZoom.ZoomedOutView,null,{default:n(()=>[d(a.ListView,{GotFocus:`List_GotFocus`,ItemTemplate:`{StaticResource ZoomedOutTemplate}`,ItemsSource:`{x:Bind cvsGroups.View.CollectionGroups, Mode=OneWay}`,SelectionMode:`None`})]),_:1})]),_:1})]),_:1}),d(a.ControlExample.Output),d(a.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var O=r(E,[[`render`,D],[`__scopeId`,`data-v-00522a5c`],[`__file`,`SemanticZoomPage.vue`]]);export{O as default};