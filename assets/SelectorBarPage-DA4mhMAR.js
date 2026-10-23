import{Ci as e,Di as t,Ei as n,I as r,Ki as i,Li as a,O as o,Wt as s,_i as c,ai as l,bi as u,et as d,mi as f,o as p,pi as m,si as h,sr as g,t as _,x as v}from"./ScrollViewer-BWDA_C78.js";import{t as y}from"./Button-BNDPNdYJ.js";import{t as b}from"./ItemsView-CDH66l7e.js";import{t as x}from"./Frame-2q8ABBP1.js";import{t as S}from"./ItemContainer-BINO5YdA.js";import{t as C}from"./StackPanel-sg_Bd5oB.js";import{s as w}from"./navigationTransitionInfo-urBlCpyK.js";import{n as T,t as E}from"./SelectorBar-BM2l-jXf.js";import{t as D}from"./ToggleButton-HP5wmrvH.js";import{t as O}from"./ControlExample-CzGyf8u0.js";import{t as k}from"./pageState-CcJibQcm.js";import{n as A,t as j}from"./SamplePage2-IEsWPsTg.js";import{n as M,r as N,t as P}from"./SamplePage5-B3MPLRRH.js";var F=`--- header
A Basic SelectorBar
--- xaml
<SelectorBar x:Name="SelectorBar1">
    <SelectorBarItem x:Name="SelectorBarItemRecent" Text="Recent" Icon="Clock" />
    <SelectorBarItem x:Name="SelectorBarItemShared" Text="Shared" Icon="Share" />
    <SelectorBarItem x:Name="SelectorBarItemFavorites" Text="Favorites" Icon="Favorite" />
</SelectorBar>`,I=`--- header
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
        }`,L=`--- header
SelectorBar Displaying Different Collections Using ItemsView
--- xaml
<SelectorBar x:Name="SelectorBar3" SelectionChanged="SelectorBar3_SelectionChanged" >
    <SelectorBarItem x:Name="SelectorBarItemPink" Text="Pink" IsSelected="True" />
    <SelectorBarItem x:Name="SelectorBarItemPlum" Text="Plum" />
    <SelectorBarItem x:Name="SelectorBarItemPowderBlue" Text="PowderBlue" />
</SelectorBar>

<ItemsView x:Name="ItemsView3" ItemTemplate="{StaticResource ColorsTemplate}">
    <ItemsView.Layout>
        <StackLayout Orientation="Horizontal" />
    </ItemsView.Layout>
</ItemsView>
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
`,R=f({name:`SelectorBarPage`,__name:`SelectorBarPage`,setup(n,{expose:a}){a();let{t:s}=d(),f=c(`currentPage`,null),{isFavoriteState:m,pageTheme:h,toggleTheme:R,toggleFavorite:z}=k(f?.value||`selectorbar`),B=i({});t(g,B);let V=l(()=>({Title:s(`text.selectorbar`),Description:s(`text.selectorbar-description`),ToggleTheme:s(`gallery.page-header.toggle-theme`),Favorite:s(`gallery.page-header.favorite`),BasicHeader:s(`sample.selectorbar.basic`),FrameHeader:s(`sample.selectorbar.frame-slide-transitions`),CollectionsHeader:s(`sample.selectorbar.collections`),Recent:s(`text.recent`),Shared:s(`text.shared`),Favorites:s(`text.favorites`),Page1:s(`sample.selectorbar.page-1`),Page2:s(`sample.selectorbar.page-2`),Page3:s(`sample.selectorbar.page-3`),Page4:s(`sample.selectorbar.page-4`),Page5:s(`sample.selectorbar.page-5`),Pink:s(`sample.selectorbar.pink`),Plum:s(`sample.selectorbar.plum`),PowderBlue:s(`sample.selectorbar.powder-blue`)})),H=l(()=>m.value?``:``),U=Array.from({length:5},()=>`Pink`),W=Array.from({length:7},()=>`Plum`),G=Array.from({length:4},()=>`PowderBlue`),K=[A,j,N,M,P],q=0,J=0,Y=0,X=e=>{let t=e.Items.indexOf(e.SelectedItem);if(t<0)return;let n=K[t];if(!n)return;let r=t-q>0?`FromRight`:`FromLeft`,i=++J,a=()=>{i===J&&B.ContentFrame?.Navigate(n,null,w(r))&&(q=t)};B.ContentFrame?a():u(a)},Z=e=>{if(!e.SelectedItem)return;let t=e.SelectedItem,n=++Y,r=()=>{if(n!==Y)return;let e=B.ItemsView3;e&&(t===B.SelectorBarItemPink?e.ItemsSource=U:t===B.SelectorBarItemPlum?e.ItemsSource=W:e.ItemsSource=G)};B.ItemsView3?r():u(r)};e(()=>{let e=B.ContentFrame,t=B.SelectorBar2;t&&e&&!e.CurrentSourcePageType&&X(t);let n=B.SelectorBar3;n&&Z(n)});let Q=(e,t)=>e.match(RegExp(`(?:^|\\r?\\n)--- `+t+`\\r?\\n([\\s\\S]*?)(?=\\r?\\n--- |$)`))?.[1].trim()??``,$={t:s,currentPage:f,isFavoriteState:m,pageTheme:h,toggleTheme:R,toggleFavorite:z,namescope:B,Labels:V,FavoriteGlyph:H,PinkColorCollection:U,PlumColorCollection:W,PowderBlueColorCollection:G,SamplePages:K,get previousSelectedIndex(){return q},set previousSelectedIndex(e){q=e},get navigationRequest(){return J},set navigationRequest(e){J=e},get collectionRequest(){return Y},set collectionRequest(e){Y=e},SelectorBar2_SelectionChanged:X,SelectorBar3_SelectionChanged:Z,sampleSection:Q,BasicXaml:Q(F,`xaml`),FrameXaml:Q(I,`xaml`),FrameCSharp:Q(I,`c#`),CollectionsXaml:Q(L,`xaml`),CollectionsCSharp:Q(L,`c#`),Button:y,ControlExample:O,Frame:x,ItemContainer:S,ItemsView:b,Page:r,ScrollViewer:_,SelectorBar:E,SelectorBarItem:T,StackPanel:C,TextBlock:p,ToggleButton:D,get DataTemplate(){return v},get StackLayout(){return o}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function z(e,t,r,i,o,s){return n(),h(i.Page,null,{default:a(()=>[m(i.Page.Resources,null,{default:a(()=>[m(i.DataTemplate,{"x:Key":`ColorsTemplate`,"x:DataType":`media:SolidColorBrush`},{default:a(()=>[m(i.ItemContainer,{Width:`112`,Height:`82`,Margin:`4`,Background:`{x:Bind}`})]),_:1})]),_:1}),m(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:a(()=>[m(i.StackPanel,{class:`gallery-item-page`},{default:a(()=>[m(i.StackPanel,{class:`page-heading`},{default:a(()=>[m(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`}),m(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),m(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:a(()=>[m(i.Button,{class:`header-action`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,Click:`toggleTheme`},{default:a(()=>[m(i.TextBlock,{class:`icon`,Text:``,FontFamily:`{ThemeResource SymbolThemeFontFamily}`})]),_:1}),m(i.ToggleButton,{class:`header-action`,"AutomationProperties.Name":`{x:Bind Labels.Favorite, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.Favorite, Mode=OneWay}`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`},{default:a(()=>[m(i.TextBlock,{class:`icon`,Text:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontFamily:`{ThemeResource SymbolThemeFontFamily}`})]),_:1})]),_:1})]),_:1}),m(i.StackPanel,{class:`gallery-page-content`},{default:a(()=>[m(i.ControlExample,{"x:Name":`Example1`,SampleDefinition:`SelectorBar\\BasicSelectorbar.txt`,HeaderText:`{x:Bind Labels.BasicHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind BasicXaml, Mode=OneWay}`},{default:a(()=>[m(i.ControlExample.Example,null,{default:a(()=>[m(i.SelectorBar,{"x:Name":`SelectorBar1`},{default:a(()=>[m(i.SelectorBarItem,{"x:Name":`SelectorBarItemRecent`,Icon:`Clock`,Text:`{x:Bind Labels.Recent, Mode=OneWay}`}),m(i.SelectorBarItem,{"x:Name":`SelectorBarItemShared`,Icon:`Share`,Text:`{x:Bind Labels.Shared, Mode=OneWay}`}),m(i.SelectorBarItem,{"x:Name":`SelectorBarItemFavorites`,Icon:`Favorite`,Text:`{x:Bind Labels.Favorites, Mode=OneWay}`})]),_:1})]),_:1}),m(i.ControlExample.Output),m(i.ControlExample.Options)]),_:1}),m(i.ControlExample,{"x:Name":`Example2`,SampleDefinition:`SelectorBar\\SelectorbarFrameSlideTransitions.txt`,HeaderText:`{x:Bind Labels.FrameHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind FrameXaml, Mode=OneWay}`,CSharp:`{x:Bind FrameCSharp, Mode=OneWay}`},{default:a(()=>[m(i.ControlExample.Example,null,{default:a(()=>[m(i.StackPanel,{class:`selectorbar-sample-stack`},{default:a(()=>[m(i.SelectorBar,{"x:Name":`SelectorBar2`,SelectionChanged:`SelectorBar2_SelectionChanged`},{default:a(()=>[m(i.SelectorBarItem,{"x:Name":`SelectorBarItemPage1`,IsSelected:`True`,Text:`{x:Bind Labels.Page1, Mode=OneWay}`}),m(i.SelectorBarItem,{"x:Name":`SelectorBarItemPage2`,Text:`{x:Bind Labels.Page2, Mode=OneWay}`}),m(i.SelectorBarItem,{"x:Name":`SelectorBarItemPage3`,Text:`{x:Bind Labels.Page3, Mode=OneWay}`}),m(i.SelectorBarItem,{"x:Name":`SelectorBarItemPage4`,Text:`{x:Bind Labels.Page4, Mode=OneWay}`}),m(i.SelectorBarItem,{"x:Name":`SelectorBarItemPage5`,Text:`{x:Bind Labels.Page5, Mode=OneWay}`})]),_:1}),m(i.Frame,{"x:Name":`ContentFrame`,class:`selectorbar-content-frame`,IsNavigationStackEnabled:`False`})]),_:1})]),_:1}),m(i.ControlExample.Output),m(i.ControlExample.Options)]),_:1}),m(i.ControlExample,{"x:Name":`Example3`,SampleDefinition:`SelectorBar\\SelectorbarDisplayingDifferentCollections.txt`,HeaderText:`{x:Bind Labels.CollectionsHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind CollectionsXaml, Mode=OneWay}`,CSharp:`{x:Bind CollectionsCSharp, Mode=OneWay}`},{default:a(()=>[m(i.ControlExample.Example,null,{default:a(()=>[m(i.StackPanel,{class:`selectorbar-sample-stack`},{default:a(()=>[m(i.SelectorBar,{"x:Name":`SelectorBar3`,SelectionChanged:`SelectorBar3_SelectionChanged`},{default:a(()=>[m(i.SelectorBarItem,{"x:Name":`SelectorBarItemPink`,IsSelected:`True`,Text:`{x:Bind Labels.Pink, Mode=OneWay}`}),m(i.SelectorBarItem,{"x:Name":`SelectorBarItemPlum`,Text:`{x:Bind Labels.Plum, Mode=OneWay}`}),m(i.SelectorBarItem,{"x:Name":`SelectorBarItemPowderBlue`,Text:`{x:Bind Labels.PowderBlue, Mode=OneWay}`})]),_:1}),m(i.ItemsView,{"x:Name":`ItemsView3`,class:`selectorbar-colors-view`,ItemTemplate:`{StaticResource ColorsTemplate}`},{default:a(()=>[m(i.ItemsView.Layout,null,{default:a(()=>[m(i.StackLayout,{Orientation:`Horizontal`})]),_:1})]),_:1})]),_:1})]),_:1}),m(i.ControlExample.Output),m(i.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var B=s(R,[[`render`,z],[`__scopeId`,`data-v-d3479e82`],[`__file`,`SelectorBarPage.vue`]]);export{B as default};