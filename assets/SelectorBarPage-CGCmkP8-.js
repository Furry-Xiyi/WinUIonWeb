import{$i as e,Ai as t,Bi as n,Ci as r,Cn as i,Ei as a,Mn as o,Yi as s,_i as c,bi as l,ci as u,dr as d,gi as f,ki as p,ln as m,nn as h,o as g,p as _,t as v,ui as y}from"./ScrollViewer-DXAtwYnH.js";import{t as b}from"./Button-1Ztf3pH0.js";import{t as x}from"./ItemsView-CNbp9FUM.js";import{s as S}from"./navigationTransitionInfo-urBlCpyK.js";import{t as C}from"./Frame-B7FJ061Y.js";import{t as w}from"./StackPanel-DGz4UnE4.js";import{t as T}from"./ToggleButton-D0RGNdIP.js";import{n as E,t as D}from"./SelectorBar-CT3OXlVB.js";import{t as O}from"./ControlExample-BX-yRpiQ.js";import{t as k}from"./ItemContainer-C-lPNoip.js";import{t as A}from"./pageState-cPponcIo.js";import{n as j,t as M}from"./SamplePage2-CJ_BzDrt.js";import{n as N,r as P,t as F}from"./SamplePage5-BdWylTaz.js";var I=`--- header
A Basic SelectorBar
--- xaml
<SelectorBar x:Name="SelectorBar1">
    <SelectorBarItem x:Name="SelectorBarItemRecent" Text="Recent" Icon="Clock" />
    <SelectorBarItem x:Name="SelectorBarItemShared" Text="Shared" Icon="Share" />
    <SelectorBarItem x:Name="SelectorBarItemFavorites" Text="Favorites" Icon="Favorite" />
</SelectorBar>`,L=`--- header
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
        }`,R=`--- header
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
`,z=o(c({name:`SelectorBarPage`,__name:`SelectorBarPage`,setup(o){let{t:c}=_(),{isFavoriteState:z,pageTheme:B,toggleTheme:V,toggleFavorite:H}=A(l(`currentPage`,null)?.value||`selectorbar`),U=s({});t(d,U),u(()=>({Title:c(`text.selectorbar`),Description:c(`text.selectorbar-description`),ToggleTheme:c(`gallery.page-header.toggle-theme`),Favorite:c(`gallery.page-header.favorite`),BasicHeader:c(`sample.selectorbar.basic`),FrameHeader:c(`sample.selectorbar.frame-slide-transitions`),CollectionsHeader:c(`sample.selectorbar.collections`),Recent:c(`text.recent`),Shared:c(`text.shared`),Favorites:c(`text.favorites`),Page1:c(`sample.selectorbar.page-1`),Page2:c(`sample.selectorbar.page-2`),Page3:c(`sample.selectorbar.page-3`),Page4:c(`sample.selectorbar.page-4`),Page5:c(`sample.selectorbar.page-5`),Pink:c(`sample.selectorbar.pink`),Plum:c(`sample.selectorbar.plum`),PowderBlue:c(`sample.selectorbar.powder-blue`)})),u(()=>z.value?``:``);let W=Array.from({length:5},()=>`Pink`),G=Array.from({length:7},()=>`Plum`),K=Array.from({length:4},()=>`PowderBlue`),q=[j,M,P,N,F],J=0,Y=0,X=0,Z=e=>{let t=e.Items.indexOf(e.SelectedItem);if(t<0)return;let n=q[t];if(!n)return;let i=t-J>0?`FromRight`:`FromLeft`,a=++Y,o=()=>{a===Y&&U.ContentFrame?.Navigate(n,null,S(i))&&(J=t)};U.ContentFrame?o():r(o)},Q=e=>{if(!e.SelectedItem)return;let t=e.SelectedItem,n=++X,i=()=>{if(n!==X)return;let e=U.ItemsView3;e&&(t===U.SelectorBarItemPink?e.ItemsSource=W:t===U.SelectorBarItemPlum?e.ItemsSource=G:e.ItemsSource=K)};U.ItemsView3?i():r(i)};a(()=>{let e=U.ContentFrame,t=U.SelectorBar2;t&&e&&!e.CurrentSourcePageType&&Z(t);let n=U.SelectorBar3;n&&Q(n)});let $=(e,t)=>e.match(RegExp(`(?:^|\\r?\\n)--- `+t+`\\r?\\n([\\s\\S]*?)(?=\\r?\\n--- |$)`))?.[1].trim()??``;return $(I,`xaml`),$(L,`xaml`),$(L,`c#`),$(R,`xaml`),$(R,`c#`),(t,r)=>(p(),y(i,null,{default:n(()=>[f(i.Resources,null,{default:n(()=>[f(e(h),{"x:Key":`ColorsTemplate`,"x:DataType":`media:SolidColorBrush`},{default:n(()=>[f(k,{Width:`112`,Height:`82`,Margin:`4`,Background:`{x:Bind}`})]),_:1})]),_:1}),f(v,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[f(w,{class:`gallery-item-page`},{default:n(()=>[f(w,{class:`page-heading`},{default:n(()=>[f(g,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`}),f(g,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),f(w,{class:`page-header-actions`,Orientation:`Horizontal`},{default:n(()=>[f(b,{class:`header-action`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,Click:`toggleTheme`},{default:n(()=>[f(g,{class:`icon`,Text:``,FontFamily:`{ThemeResource SymbolThemeFontFamily}`})]),_:1}),f(T,{class:`header-action`,"AutomationProperties.Name":`{x:Bind Labels.Favorite, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.Favorite, Mode=OneWay}`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`},{default:n(()=>[f(g,{class:`icon`,Text:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontFamily:`{ThemeResource SymbolThemeFontFamily}`})]),_:1})]),_:1})]),_:1}),f(w,{class:`gallery-page-content`},{default:n(()=>[f(O,{"x:Name":`Example1`,SampleDefinition:`SelectorBar\\BasicSelectorbar.txt`,HeaderText:`{x:Bind Labels.BasicHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind BasicXaml, Mode=OneWay}`},{default:n(()=>[f(O.Example,null,{default:n(()=>[f(D,{"x:Name":`SelectorBar1`},{default:n(()=>[f(E,{"x:Name":`SelectorBarItemRecent`,Icon:`Clock`,Text:`{x:Bind Labels.Recent, Mode=OneWay}`}),f(E,{"x:Name":`SelectorBarItemShared`,Icon:`Share`,Text:`{x:Bind Labels.Shared, Mode=OneWay}`}),f(E,{"x:Name":`SelectorBarItemFavorites`,Icon:`Favorite`,Text:`{x:Bind Labels.Favorites, Mode=OneWay}`})]),_:1})]),_:1}),f(O.Output),f(O.Options)]),_:1}),f(O,{"x:Name":`Example2`,SampleDefinition:`SelectorBar\\SelectorbarFrameSlideTransitions.txt`,HeaderText:`{x:Bind Labels.FrameHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind FrameXaml, Mode=OneWay}`,CSharp:`{x:Bind FrameCSharp, Mode=OneWay}`},{default:n(()=>[f(O.Example,null,{default:n(()=>[f(w,{class:`selectorbar-sample-stack`},{default:n(()=>[f(D,{"x:Name":`SelectorBar2`,SelectionChanged:`SelectorBar2_SelectionChanged`},{default:n(()=>[f(E,{"x:Name":`SelectorBarItemPage1`,IsSelected:`True`,Text:`{x:Bind Labels.Page1, Mode=OneWay}`}),f(E,{"x:Name":`SelectorBarItemPage2`,Text:`{x:Bind Labels.Page2, Mode=OneWay}`}),f(E,{"x:Name":`SelectorBarItemPage3`,Text:`{x:Bind Labels.Page3, Mode=OneWay}`}),f(E,{"x:Name":`SelectorBarItemPage4`,Text:`{x:Bind Labels.Page4, Mode=OneWay}`}),f(E,{"x:Name":`SelectorBarItemPage5`,Text:`{x:Bind Labels.Page5, Mode=OneWay}`})]),_:1}),f(C,{"x:Name":`ContentFrame`,class:`selectorbar-content-frame`,IsNavigationStackEnabled:`False`})]),_:1})]),_:1}),f(O.Output),f(O.Options)]),_:1}),f(O,{"x:Name":`Example3`,SampleDefinition:`SelectorBar\\SelectorbarDisplayingDifferentCollections.txt`,HeaderText:`{x:Bind Labels.CollectionsHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind CollectionsXaml, Mode=OneWay}`,CSharp:`{x:Bind CollectionsCSharp, Mode=OneWay}`},{default:n(()=>[f(O.Example,null,{default:n(()=>[f(w,{class:`selectorbar-sample-stack`},{default:n(()=>[f(D,{"x:Name":`SelectorBar3`,SelectionChanged:`SelectorBar3_SelectionChanged`},{default:n(()=>[f(E,{"x:Name":`SelectorBarItemPink`,IsSelected:`True`,Text:`{x:Bind Labels.Pink, Mode=OneWay}`}),f(E,{"x:Name":`SelectorBarItemPlum`,Text:`{x:Bind Labels.Plum, Mode=OneWay}`}),f(E,{"x:Name":`SelectorBarItemPowderBlue`,Text:`{x:Bind Labels.PowderBlue, Mode=OneWay}`})]),_:1}),f(x,{"x:Name":`ItemsView3`,class:`selectorbar-colors-view`,ItemTemplate:`{StaticResource ColorsTemplate}`},{default:n(()=>[f(x.Layout,null,{default:n(()=>[f(e(m),{Orientation:`Horizontal`})]),_:1})]),_:1})]),_:1})]),_:1}),f(O.Output),f(O.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}}),[[`__scopeId`,`data-v-d3479e82`]]);export{z as default};