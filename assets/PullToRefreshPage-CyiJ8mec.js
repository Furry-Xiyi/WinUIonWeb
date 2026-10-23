import{Ei as e,Gi as t,I as n,Li as r,Lt as i,Nt as a,Wt as o,_i as s,a as c,ai as l,et as u,mi as d,o as f,pi as p,si as m,t as h,xi as g}from"./ScrollViewer-BWDA_C78.js";import{t as _}from"./Button-BNDPNdYJ.js";import{o as ee}from"./ItemsView-CDH66l7e.js";import{t as te}from"./StackPanel-sg_Bd5oB.js";import{t as ne}from"./ListView-DiQ0PqAw.js";import{n as v,t as y}from"./RefreshContainer-BqZZxXND.js";import{t as b}from"./ToggleButton-HP5wmrvH.js";import{t as x}from"./ControlExample-CzGyf8u0.js";import{t as S}from"./pageState-CcJibQcm.js";var C=`--- header
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
`,T=d({__name:`PullToRefreshPage`,setup(e,{expose:r}){r();let{t:o}=u(),d=s(`currentPage`,null),{isFavoriteState:p,pageTheme:m,toggleTheme:T,toggleFavorite:E}=S(d?.value||`pulltorefresh`),D=l(()=>o(`text.pulltorefresh`)),O=l(()=>o(`text.a-container-that-allows-users-to-refresh-content`)),re=l(()=>o(`sample.pulltorefresh.basic`)),k=l(()=>o(`sample.pulltorefresh.custom-icon`)),A=l(()=>o(`gallery.page-header.toggle-theme`)),j=l(()=>o(`gallery.page-header.favorite`)),M=l(()=>p.value?``:``),N=l(()=>o(`sample.pulltorefresh.gesture-description`)),P=l(()=>o(`sample.pulltorefresh.request-refresh`)),F=[`acrylicbrush`,`colorpicker`,`navigationview`,`parallaxview`,`personpicture`,`pulltorefreshpage`,`ratingscontrol`,`revealbrush`,`treeview`],I=[`mike`,`ben`,`barbra`,`claire`,`justin`,`shawn`,`drew`,`lili`],L=t(F.map(e=>o(`sample.pulltorefresh.control.${e}`))),R=t(I.map(e=>o(`sample.pulltorefresh.friend.${e}`))),z=t(0),B=t(0),V=t(!1),H=t(!1),U=t(`Idle`),W=l(()=>!V.value),G=l(()=>!H.value),K=l(()=>o(`sample.pulltorefresh.refresh-count`,{count:z.value})),q=l(()=>o(`sample.pulltorefresh.sync-count`,{count:B.value})),J=l(()=>o(V.value?`sample.pulltorefresh.refreshing`:`sample.pulltorefresh.ready`)),Y=l(()=>o(H.value?`sample.pulltorefresh.refreshing`:`sample.pulltorefresh.ready`)),ie=l(()=>o(`sample.pulltorefresh.state-value`,{state:o(`sample.pulltorefresh.state.${U.value.toLowerCase()}`)})),X=new Map,Z=(e,t,n,r,i,a)=>{let s=e.GetDeferral();r.value=!0;let c=window.setTimeout(()=>{X.delete(c);try{t.value.unshift(o(i,{count:n.value})),n.value+=1}finally{r.value=!1,s.Complete()}},a);X.set(c,s)},ae=(e,t)=>Z(t,L,z,V,`sample.pulltorefresh.new-control`,500),oe=(e,t)=>Z(t,R,B,H,`sample.pulltorefresh.new-friend`,800),se=(e,t)=>{U.value=t.NewState};g(()=>{for(let[e,t]of X)window.clearTimeout(e),t.Complete();X.clear()});let Q=(e,t)=>e.split(`--- ${t}`)[1]?.split(/\r?\n--- /)[0]?.trim()??``,$={t:o,currentPage:d,isFavoriteState:p,pageTheme:m,toggleTheme:T,toggleFavorite:E,pageTitle:D,pageDescription:O,basicHeader:re,customHeader:k,themeButtonLabel:A,favoriteButtonLabel:j,favoriteGlyph:M,gestureDescription:N,refreshButtonLabel:P,controlKeys:F,friendKeys:I,items1:L,items2:R,completed1:z,completed2:B,refreshing1:V,refreshing2:H,visualizerState:U,canRefreshBasic:W,canRefreshCustom:G,refreshCountText:K,syncCountText:q,basicStatus:J,customStatus:Y,visualizerStateText:ie,pending:X,runRefresh:Z,rc_RefreshRequested:ae,rc2_RefreshRequested:oe,rv2_RefreshStateChanged:se,sourcePart:Q,basicXaml:Q(C,`xaml`),basicCSharp:Q(C,`c#`),customXaml:Q(w,`xaml`),customCSharp:Q(w,`c#`),Button:_,ControlExample:x,FontIcon:c,Grid:i,ListView:ne,Page:n,RefreshContainer:y,RefreshVisualizer:v,RowDefinition:ee,ScrollViewer:h,StackPanel:te,SymbolIcon:a,TextBlock:f,ToggleButton:b};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function E(t,n,i,a,o,s){return e(),m(a.Page,null,{default:r(()=>[p(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:r(()=>[p(a.StackPanel,{class:`gallery-item-page`},{default:r(()=>[p(a.StackPanel,{class:`page-heading`},{default:r(()=>[p(a.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),p(a.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(a.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:r(()=>[p(a.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind themeButtonLabel, Mode=OneWay}`},{default:r(()=>[p(a.FontIcon,{Glyph:``})]),_:1}),p(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind favoriteButtonLabel, Mode=OneWay}`},{default:r(()=>[p(a.FontIcon,{Glyph:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),p(a.StackPanel,{class:`gallery-page-content`},{default:r(()=>[p(a.ControlExample,{"x:Name":`Example1`,HeaderText:`{x:Bind basicHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind basicXaml}`,CSharp:`{x:Bind basicCSharp}`},{default:r(()=>[p(a.ControlExample.Example,null,{default:r(()=>[p(a.Grid,null,{default:r(()=>[p(a.RefreshContainer,{"x:Name":`rc`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,RefreshRequested:`rc_RefreshRequested`},{default:r(()=>[p(a.ListView,{"x:Name":`lv`,Height:`200`,MinWidth:`200`,ItemsSource:`{x:Bind items1, Mode=OneWay}`,BorderBrush:`{ThemeResource TextControlBorderBrush}`,BorderThickness:`1`})]),_:1})]),_:1})]),_:1}),p(a.ControlExample.Output,null,{default:r(()=>[p(a.StackPanel,{Spacing:`8`},{default:r(()=>[p(a.TextBlock,{Text:`{x:Bind basicStatus, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(a.TextBlock,{Text:`{x:Bind refreshCountText, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),p(a.ControlExample.Options,null,{default:r(()=>[p(a.StackPanel,{Spacing:`12`},{default:r(()=>[p(a.TextBlock,{Text:`{x:Bind gestureDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(a.Button,{Content:`{x:Bind refreshButtonLabel, Mode=OneWay}`,Click:`rc.RequestRefresh`,IsEnabled:`{x:Bind canRefreshBasic, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),p(a.ControlExample,{"x:Name":`Example2`,HeaderText:`{x:Bind customHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind customXaml}`,CSharp:`{x:Bind customCSharp}`},{default:r(()=>[p(a.ControlExample.Example,null,{default:r(()=>[p(a.Grid,{"x:Name":`Ex2Grid`},{default:r(()=>[p(a.Grid.RowDefinitions,null,{default:r(()=>[p(a.RowDefinition,{Height:`Auto`}),p(a.RowDefinition)]),_:1}),p(a.RefreshContainer,{"x:Name":`rc2`,"Grid.Row":`1`,RefreshRequested:`rc2_RefreshRequested`},{default:r(()=>[p(a.RefreshContainer.Visualizer,null,{default:r(()=>[p(a.RefreshVisualizer,{"x:Name":`rv2`,RefreshStateChanged:`rv2_RefreshStateChanged`},{default:r(()=>[p(a.RefreshVisualizer.Content,null,{default:r(()=>[p(a.SymbolIcon,{Symbol:`AddFriend`})]),_:1})]),_:1})]),_:1}),p(a.ListView,{"x:Name":`lv2`,"Grid.Row":`1`,Width:`200`,Height:`200`,HorizontalAlignment:`Center`,ItemsSource:`{x:Bind items2, Mode=OneWay}`,BorderBrush:`{ThemeResource TextControlBorderBrush}`,BorderThickness:`1`})]),_:1})]),_:1})]),_:1}),p(a.ControlExample.Output,null,{default:r(()=>[p(a.StackPanel,{Spacing:`8`},{default:r(()=>[p(a.TextBlock,{Text:`{x:Bind customStatus, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(a.TextBlock,{Text:`{x:Bind syncCountText, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(a.TextBlock,{Text:`{x:Bind visualizerStateText, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),p(a.ControlExample.Options,null,{default:r(()=>[p(a.StackPanel,{Spacing:`12`},{default:r(()=>[p(a.TextBlock,{Text:`{x:Bind gestureDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(a.Button,{Content:`{x:Bind refreshButtonLabel, Mode=OneWay}`,Click:`rc2.RequestRefresh`,IsEnabled:`{x:Bind canRefreshCustom, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var D=o(T,[[`render`,E],[`__scopeId`,`data-v-8d5e77cc`],[`__file`,`PullToRefreshPage.vue`]]);export{D as default};