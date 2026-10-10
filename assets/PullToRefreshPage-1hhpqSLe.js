import{Fi as e,I as t,Lt as n,Nt as r,Ui as i,Wt as a,a as o,ai as s,di as c,et as l,fi as u,hi as d,o as f,ri as p,t as m,wi as h,yi as g}from"./ScrollViewer-PoO_ma9Z.js";import{t as _}from"./Button-DjU0urmJ.js";import{o as ee}from"./ItemsView-FqZP_Xt-.js";import{t as te}from"./StackPanel-CT7pl8zy.js";import{t as ne}from"./ListView-D3xyFzBM.js";import{n as v,t as y}from"./RefreshContainer-ZM6R-27A.js";import{t as b}from"./ToggleButton-DwmhXZge.js";import{t as x}from"./ControlExample-C1ahTZEr.js";import{t as S}from"./pageState-BN3kXI7L.js";var C=`--- header
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
`,T=u({__name:`PullToRefreshPage`,setup(e,{expose:a}){a();let{t:s}=l(),c=d(`currentPage`,null),{isFavoriteState:u,pageTheme:h,toggleTheme:T,toggleFavorite:E}=S(c?.value||`pulltorefresh`),D=p(()=>s(`text.pulltorefresh`)),re=p(()=>s(`text.a-container-that-allows-users-to-refresh-content`)),O=p(()=>s(`sample.pulltorefresh.basic`)),k=p(()=>s(`sample.pulltorefresh.custom-icon`)),A=p(()=>s(`gallery.page-header.toggle-theme`)),j=p(()=>s(`gallery.page-header.favorite`)),M=p(()=>u.value?``:``),N=p(()=>s(`sample.pulltorefresh.gesture-description`)),P=p(()=>s(`sample.pulltorefresh.request-refresh`)),F=[`acrylicbrush`,`colorpicker`,`navigationview`,`parallaxview`,`personpicture`,`pulltorefreshpage`,`ratingscontrol`,`revealbrush`,`treeview`],I=[`mike`,`ben`,`barbra`,`claire`,`justin`,`shawn`,`drew`,`lili`],L=i(F.map(e=>s(`sample.pulltorefresh.control.${e}`))),R=i(I.map(e=>s(`sample.pulltorefresh.friend.${e}`))),z=i(0),B=i(0),V=i(!1),H=i(!1),U=i(`Idle`),W=p(()=>!V.value),G=p(()=>!H.value),K=p(()=>s(`sample.pulltorefresh.refresh-count`,{count:z.value})),q=p(()=>s(`sample.pulltorefresh.sync-count`,{count:B.value})),J=p(()=>s(V.value?`sample.pulltorefresh.refreshing`:`sample.pulltorefresh.ready`)),Y=p(()=>s(H.value?`sample.pulltorefresh.refreshing`:`sample.pulltorefresh.ready`)),ie=p(()=>s(`sample.pulltorefresh.state-value`,{state:s(`sample.pulltorefresh.state.${U.value.toLowerCase()}`)})),X=new Map,Z=(e,t,n,r,i,a)=>{let o=e.GetDeferral();r.value=!0;let c=window.setTimeout(()=>{X.delete(c);try{t.value.unshift(s(i,{count:n.value})),n.value+=1}finally{r.value=!1,o.Complete()}},a);X.set(c,o)},ae=(e,t)=>Z(t,L,z,V,`sample.pulltorefresh.new-control`,500),oe=(e,t)=>Z(t,R,B,H,`sample.pulltorefresh.new-friend`,800),se=(e,t)=>{U.value=t.NewState};g(()=>{for(let[e,t]of X)window.clearTimeout(e),t.Complete();X.clear()});let Q=(e,t)=>e.split(`--- ${t}`)[1]?.split(/\r?\n--- /)[0]?.trim()??``,$={t:s,currentPage:c,isFavoriteState:u,pageTheme:h,toggleTheme:T,toggleFavorite:E,pageTitle:D,pageDescription:re,basicHeader:O,customHeader:k,themeButtonLabel:A,favoriteButtonLabel:j,favoriteGlyph:M,gestureDescription:N,refreshButtonLabel:P,controlKeys:F,friendKeys:I,items1:L,items2:R,completed1:z,completed2:B,refreshing1:V,refreshing2:H,visualizerState:U,canRefreshBasic:W,canRefreshCustom:G,refreshCountText:K,syncCountText:q,basicStatus:J,customStatus:Y,visualizerStateText:ie,pending:X,runRefresh:Z,rc_RefreshRequested:ae,rc2_RefreshRequested:oe,rv2_RefreshStateChanged:se,sourcePart:Q,basicXaml:Q(C,`xaml`),basicCSharp:Q(C,`c#`),customXaml:Q(w,`xaml`),customCSharp:Q(w,`c#`),Button:_,ControlExample:x,FontIcon:o,Grid:n,ListView:ne,Page:t,RefreshContainer:y,RefreshVisualizer:v,RowDefinition:ee,ScrollViewer:m,StackPanel:te,SymbolIcon:r,TextBlock:f,ToggleButton:b};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function E(t,n,r,i,a,o){return h(),s(i.Page,null,{default:e(()=>[c(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[c(i.StackPanel,{class:`gallery-item-page`},{default:e(()=>[c(i.StackPanel,{class:`page-heading`},{default:e(()=>[c(i.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),c(i.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),c(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:e(()=>[c(i.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind themeButtonLabel, Mode=OneWay}`},{default:e(()=>[c(i.FontIcon,{Glyph:``})]),_:1}),c(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind favoriteButtonLabel, Mode=OneWay}`},{default:e(()=>[c(i.FontIcon,{Glyph:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),c(i.StackPanel,{class:`gallery-page-content`},{default:e(()=>[c(i.ControlExample,{"x:Name":`Example1`,HeaderText:`{x:Bind basicHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind basicXaml}`,CSharp:`{x:Bind basicCSharp}`},{default:e(()=>[c(i.ControlExample.Example,null,{default:e(()=>[c(i.Grid,null,{default:e(()=>[c(i.RefreshContainer,{"x:Name":`rc`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,RefreshRequested:`rc_RefreshRequested`},{default:e(()=>[c(i.ListView,{"x:Name":`lv`,Height:`200`,MinWidth:`200`,ItemsSource:`{x:Bind items1, Mode=OneWay}`,BorderBrush:`{ThemeResource TextControlBorderBrush}`,BorderThickness:`1`})]),_:1})]),_:1})]),_:1}),c(i.ControlExample.Output,null,{default:e(()=>[c(i.StackPanel,{Spacing:`8`},{default:e(()=>[c(i.TextBlock,{Text:`{x:Bind basicStatus, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),c(i.TextBlock,{Text:`{x:Bind refreshCountText, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),c(i.ControlExample.Options,null,{default:e(()=>[c(i.StackPanel,{Spacing:`12`},{default:e(()=>[c(i.TextBlock,{Text:`{x:Bind gestureDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),c(i.Button,{Content:`{x:Bind refreshButtonLabel, Mode=OneWay}`,Click:`rc.RequestRefresh`,IsEnabled:`{x:Bind canRefreshBasic, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),c(i.ControlExample,{"x:Name":`Example2`,HeaderText:`{x:Bind customHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind customXaml}`,CSharp:`{x:Bind customCSharp}`},{default:e(()=>[c(i.ControlExample.Example,null,{default:e(()=>[c(i.Grid,{"x:Name":`Ex2Grid`},{default:e(()=>[c(i.Grid.RowDefinitions,null,{default:e(()=>[c(i.RowDefinition,{Height:`Auto`}),c(i.RowDefinition)]),_:1}),c(i.RefreshContainer,{"x:Name":`rc2`,"Grid.Row":`1`,RefreshRequested:`rc2_RefreshRequested`},{default:e(()=>[c(i.RefreshContainer.Visualizer,null,{default:e(()=>[c(i.RefreshVisualizer,{"x:Name":`rv2`,RefreshStateChanged:`rv2_RefreshStateChanged`},{default:e(()=>[c(i.RefreshVisualizer.Content,null,{default:e(()=>[c(i.SymbolIcon,{Symbol:`AddFriend`})]),_:1})]),_:1})]),_:1}),c(i.ListView,{"x:Name":`lv2`,"Grid.Row":`1`,Width:`200`,Height:`200`,HorizontalAlignment:`Center`,ItemsSource:`{x:Bind items2, Mode=OneWay}`,BorderBrush:`{ThemeResource TextControlBorderBrush}`,BorderThickness:`1`})]),_:1})]),_:1})]),_:1}),c(i.ControlExample.Output,null,{default:e(()=>[c(i.StackPanel,{Spacing:`8`},{default:e(()=>[c(i.TextBlock,{Text:`{x:Bind customStatus, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),c(i.TextBlock,{Text:`{x:Bind syncCountText, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),c(i.TextBlock,{Text:`{x:Bind visualizerStateText, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),c(i.ControlExample.Options,null,{default:e(()=>[c(i.StackPanel,{Spacing:`12`},{default:e(()=>[c(i.TextBlock,{Text:`{x:Bind gestureDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),c(i.Button,{Content:`{x:Bind refreshButtonLabel, Mode=OneWay}`,Click:`rc2.RequestRefresh`,IsEnabled:`{x:Bind canRefreshCustom, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var D=a(T,[[`render`,E],[`__scopeId`,`data-v-8d5e77cc`],[`__file`,`PullToRefreshPage.vue`]]);export{D as default};