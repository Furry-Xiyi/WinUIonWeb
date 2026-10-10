import{$ as e,Bi as t,Cn as n,En as r,Ji as i,Mn as a,_i as o,a as s,bi as c,ci as l,gi as u,ki as d,o as f,p,t as m,ui as h,wi as g}from"./ScrollViewer-CHNE18MA.js";import{t as _}from"./Button-DO0TiUOq.js";import{o as ee}from"./ItemsView-DXNouDjp.js";import{t as v}from"./StackPanel-C60XOD66.js";import{t as te}from"./ToggleButton-ZsjZg8Nu.js";import{t as ne}from"./ControlExample-BKyw2NwY.js";import{n as y,t as b}from"./RefreshContainer-Ch-PXAtj.js";import{t as x}from"./pageState-Djrh7EdY.js";import{t as S}from"./ListView-CsUAm8Ur.js";var C=`--- header
Basic PullToRefresh
--- xaml
<RefreshContainer x:Name="rc" RefreshRequested="rc_RefreshRequested">
    <ListView x:Name="lv" Width="300" Height="300" BorderThickness="1" BorderBrush="Black"/>
</RefreshContainer>
--- c#
ObservableCollection<string> items = new ObservableCollection<string>();
listview.ItemsSource = items;

private void rc_RefreshRequested(RefreshContainer sender, RefreshRequestedEventArgs args)
{
    //Do some work to show new Content! Once the work is done, call RefreshCompletionDeferral.Complete()
    this.RefreshCompletionDeferral = args.GetDeferral();
    this.DoWork();
}

private void WorkCompleted()
{
    items.Insert(0, "NewControl");
    if (this.RefreshCompletionDeferral != null)
    {
        this.RefreshCompletionDeferral.Complete();
        this.RefreshCompletionDeferral.Dispose();
        this.RefreshCompletionDeferral = null;
    }
}`,w=`--- header
Custom Icon PullToRefresh
--- xaml
<RefreshContainer x:Name="rc" RefreshRequested="rc_RefreshRequested">
    <RefreshContainer.Visualizer>
        <RefreshVisualizer>
            <RefreshVisualizer.Content>
                <SymbolIcon Symbol="AddFriend"/>
            </RefreshVisualizer.Content>
        </RefreshVisualizer>
    </RefreshContainer.Visualizer>
    <ListView x:Name="lv" Width="300" Height="300" BorderThickness="1" BorderBrush="Black"/>
</RefreshContainer>
--- c#
ObservableCollection<string> items = new ObservableCollection<string>();
listview.ItemsSource = items;

private void rc_RefreshRequested(RefreshContainer sender, RefreshRequestedEventArgs args)
{
    //Do some work to show new Content! Once the work is done, call RefreshCompletionDeferral.Complete()
    this.RefreshCompletionDeferral = args.GetDeferral();
    this.DoWork();
}

private void WorkCompleted()
{
    items.Insert(0, "NewControl");
    if (this.RefreshCompletionDeferral != null)
    {
        this.RefreshCompletionDeferral.Complete();
        this.RefreshCompletionDeferral.Dispose();
        this.RefreshCompletionDeferral = null;
    }
}
`,T=o({__name:`PullToRefreshPage`,setup(t,{expose:a}){a();let{t:o}=p(),u=c(`currentPage`,null),{isFavoriteState:d,pageTheme:h,toggleTheme:T,toggleFavorite:E}=x(u?.value||`pulltorefresh`),D=l(()=>o(`text.pulltorefresh`)),O=l(()=>o(`text.a-container-that-allows-users-to-refresh-content`)),re=l(()=>o(`sample.pulltorefresh.basic`)),k=l(()=>o(`sample.pulltorefresh.custom-icon`)),A=l(()=>o(`gallery.page-header.toggle-theme`)),j=l(()=>o(`gallery.page-header.favorite`)),M=l(()=>d.value?``:``),N=l(()=>o(`sample.pulltorefresh.gesture-description`)),P=l(()=>o(`sample.pulltorefresh.request-refresh`)),F=[`acrylicbrush`,`colorpicker`,`navigationview`,`parallaxview`,`personpicture`,`pulltorefreshpage`,`ratingscontrol`,`revealbrush`,`treeview`],I=[`mike`,`ben`,`barbra`,`claire`,`justin`,`shawn`,`drew`,`lili`],L=i(F.map(e=>o(`sample.pulltorefresh.control.${e}`))),R=i(I.map(e=>o(`sample.pulltorefresh.friend.${e}`))),z=i(0),B=i(0),V=i(!1),H=i(!1),U=i(`Idle`),W=l(()=>!V.value),G=l(()=>!H.value),K=l(()=>o(`sample.pulltorefresh.refresh-count`,{count:z.value})),q=l(()=>o(`sample.pulltorefresh.sync-count`,{count:B.value})),J=l(()=>o(V.value?`sample.pulltorefresh.refreshing`:`sample.pulltorefresh.ready`)),Y=l(()=>o(H.value?`sample.pulltorefresh.refreshing`:`sample.pulltorefresh.ready`)),ie=l(()=>o(`sample.pulltorefresh.state-value`,{state:o(`sample.pulltorefresh.state.${U.value.toLowerCase()}`)})),X=new Map,Z=(e,t,n,r,i,a)=>{let s=e.GetDeferral();r.value=!0;let c=window.setTimeout(()=>{X.delete(c);try{t.value.unshift(o(i,{count:n.value})),n.value+=1}finally{r.value=!1,s.Complete()}},a);X.set(c,s)},ae=(e,t)=>Z(t,L,z,V,`sample.pulltorefresh.new-control`,500),oe=(e,t)=>Z(t,R,B,H,`sample.pulltorefresh.new-friend`,800),se=(e,t)=>{U.value=t.NewState};g(()=>{for(let[e,t]of X)window.clearTimeout(e),t.Complete();X.clear()});let Q=(e,t)=>e.split(`--- ${t}`)[1]?.split(/\r?\n--- /)[0]?.trim()??``,$={t:o,currentPage:u,isFavoriteState:d,pageTheme:h,toggleTheme:T,toggleFavorite:E,pageTitle:D,pageDescription:O,basicHeader:re,customHeader:k,themeButtonLabel:A,favoriteButtonLabel:j,favoriteGlyph:M,gestureDescription:N,refreshButtonLabel:P,controlKeys:F,friendKeys:I,items1:L,items2:R,completed1:z,completed2:B,refreshing1:V,refreshing2:H,visualizerState:U,canRefreshBasic:W,canRefreshCustom:G,refreshCountText:K,syncCountText:q,basicStatus:J,customStatus:Y,visualizerStateText:ie,pending:X,runRefresh:Z,rc_RefreshRequested:ae,rc2_RefreshRequested:oe,rv2_RefreshStateChanged:se,sourcePart:Q,basicXaml:Q(C,`xaml`),basicCSharp:Q(C,`c#`),customXaml:Q(w,`xaml`),customCSharp:Q(w,`c#`),Button:_,ControlExample:ne,FontIcon:s,Grid:r,ListView:S,Page:n,RefreshContainer:b,RefreshVisualizer:y,RowDefinition:ee,ScrollViewer:m,StackPanel:v,SymbolIcon:e,TextBlock:f,ToggleButton:te};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function E(e,n,r,i,a,o){return d(),h(i.Page,null,{default:t(()=>[u(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[u(i.StackPanel,{class:`gallery-item-page`},{default:t(()=>[u(i.StackPanel,{class:`page-heading`},{default:t(()=>[u(i.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),u(i.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:t(()=>[u(i.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind themeButtonLabel, Mode=OneWay}`},{default:t(()=>[u(i.FontIcon,{Glyph:``})]),_:1}),u(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind favoriteButtonLabel, Mode=OneWay}`},{default:t(()=>[u(i.FontIcon,{Glyph:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),u(i.StackPanel,{class:`gallery-page-content`},{default:t(()=>[u(i.ControlExample,{"x:Name":`Example1`,HeaderText:`{x:Bind basicHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind basicXaml}`,CSharp:`{x:Bind basicCSharp}`},{default:t(()=>[u(i.ControlExample.Example,null,{default:t(()=>[u(i.Grid,null,{default:t(()=>[u(i.RefreshContainer,{"x:Name":`rc`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,RefreshRequested:`rc_RefreshRequested`},{default:t(()=>[u(i.ListView,{"x:Name":`lv`,Height:`200`,MinWidth:`200`,ItemsSource:`{x:Bind items1, Mode=OneWay}`,BorderBrush:`{ThemeResource TextControlBorderBrush}`,BorderThickness:`1`})]),_:1})]),_:1})]),_:1}),u(i.ControlExample.Output,null,{default:t(()=>[u(i.StackPanel,{Spacing:`8`},{default:t(()=>[u(i.TextBlock,{Text:`{x:Bind basicStatus, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(i.TextBlock,{Text:`{x:Bind refreshCountText, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),u(i.ControlExample.Options,null,{default:t(()=>[u(i.StackPanel,{Spacing:`12`},{default:t(()=>[u(i.TextBlock,{Text:`{x:Bind gestureDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(i.Button,{Content:`{x:Bind refreshButtonLabel, Mode=OneWay}`,Click:`rc.RequestRefresh`,IsEnabled:`{x:Bind canRefreshBasic, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),u(i.ControlExample,{"x:Name":`Example2`,HeaderText:`{x:Bind customHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind customXaml}`,CSharp:`{x:Bind customCSharp}`},{default:t(()=>[u(i.ControlExample.Example,null,{default:t(()=>[u(i.Grid,{"x:Name":`Ex2Grid`},{default:t(()=>[u(i.Grid.RowDefinitions,null,{default:t(()=>[u(i.RowDefinition,{Height:`Auto`}),u(i.RowDefinition)]),_:1}),u(i.RefreshContainer,{"x:Name":`rc2`,"Grid.Row":`1`,RefreshRequested:`rc2_RefreshRequested`},{default:t(()=>[u(i.RefreshContainer.Visualizer,null,{default:t(()=>[u(i.RefreshVisualizer,{"x:Name":`rv2`,RefreshStateChanged:`rv2_RefreshStateChanged`},{default:t(()=>[u(i.RefreshVisualizer.Content,null,{default:t(()=>[u(i.SymbolIcon,{Symbol:`AddFriend`})]),_:1})]),_:1})]),_:1}),u(i.ListView,{"x:Name":`lv2`,"Grid.Row":`1`,Width:`200`,Height:`200`,HorizontalAlignment:`Center`,ItemsSource:`{x:Bind items2, Mode=OneWay}`,BorderBrush:`{ThemeResource TextControlBorderBrush}`,BorderThickness:`1`})]),_:1})]),_:1})]),_:1}),u(i.ControlExample.Output,null,{default:t(()=>[u(i.StackPanel,{Spacing:`8`},{default:t(()=>[u(i.TextBlock,{Text:`{x:Bind customStatus, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(i.TextBlock,{Text:`{x:Bind syncCountText, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(i.TextBlock,{Text:`{x:Bind visualizerStateText, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),u(i.ControlExample.Options,null,{default:t(()=>[u(i.StackPanel,{Spacing:`12`},{default:t(()=>[u(i.TextBlock,{Text:`{x:Bind gestureDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(i.Button,{Content:`{x:Bind refreshButtonLabel, Mode=OneWay}`,Click:`rc2.RequestRefresh`,IsEnabled:`{x:Bind canRefreshCustom, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var D=a(T,[[`render`,E],[`__scopeId`,`data-v-8d5e77cc`],[`__file`,`PullToRefreshPage.vue`]]);export{D as default};