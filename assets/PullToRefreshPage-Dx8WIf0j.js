import{$ as e,Bi as t,Cn as n,En as r,Ji as i,Mn as a,_i as o,a as s,bi as c,ci as l,gi as u,ki as d,o as f,p,t as m,ui as h,wi as g}from"./ScrollViewer-DXAtwYnH.js";import{t as _}from"./Button-1Ztf3pH0.js";import{o as v}from"./ItemsView-CNbp9FUM.js";import{t as y}from"./StackPanel-DGz4UnE4.js";import{t as b}from"./ToggleButton-D0RGNdIP.js";import{t as x}from"./ControlExample-BX-yRpiQ.js";import{n as S,t as C}from"./RefreshContainer-CoSKlJGt.js";import{t as w}from"./pageState-cPponcIo.js";import{t as T}from"./ListView-I0PBDHkd.js";var E=`--- header
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
}`,D=`--- header
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
`,O=a(o({__name:`PullToRefreshPage`,setup(a){let{t:o}=p(),{isFavoriteState:O,pageTheme:k,toggleTheme:A,toggleFavorite:j}=w(c(`currentPage`,null)?.value||`pulltorefresh`);l(()=>o(`text.pulltorefresh`)),l(()=>o(`text.a-container-that-allows-users-to-refresh-content`)),l(()=>o(`sample.pulltorefresh.basic`)),l(()=>o(`sample.pulltorefresh.custom-icon`)),l(()=>o(`gallery.page-header.toggle-theme`)),l(()=>o(`gallery.page-header.favorite`)),l(()=>O.value?``:``),l(()=>o(`sample.pulltorefresh.gesture-description`)),l(()=>o(`sample.pulltorefresh.request-refresh`)),i([`acrylicbrush`,`colorpicker`,`navigationview`,`parallaxview`,`personpicture`,`pulltorefreshpage`,`ratingscontrol`,`revealbrush`,`treeview`].map(e=>o(`sample.pulltorefresh.control.${e}`))),i([`mike`,`ben`,`barbra`,`claire`,`justin`,`shawn`,`drew`,`lili`].map(e=>o(`sample.pulltorefresh.friend.${e}`)));let M=i(0),N=i(0),P=i(!1),F=i(!1),I=i(`Idle`);l(()=>!P.value),l(()=>!F.value),l(()=>o(`sample.pulltorefresh.refresh-count`,{count:M.value})),l(()=>o(`sample.pulltorefresh.sync-count`,{count:N.value})),l(()=>o(P.value?`sample.pulltorefresh.refreshing`:`sample.pulltorefresh.ready`)),l(()=>o(F.value?`sample.pulltorefresh.refreshing`:`sample.pulltorefresh.ready`)),l(()=>o(`sample.pulltorefresh.state-value`,{state:o(`sample.pulltorefresh.state.${I.value.toLowerCase()}`)}));let L=new Map;g(()=>{for(let[e,t]of L)window.clearTimeout(e),t.Complete();L.clear()});let R=(e,t)=>e.split(`--- ${t}`)[1]?.split(/\r?\n--- /)[0]?.trim()??``;return R(E,`xaml`),R(E,`c#`),R(D,`xaml`),R(D,`c#`),(i,a)=>(d(),h(n,null,{default:t(()=>[u(m,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[u(y,{class:`gallery-item-page`},{default:t(()=>[u(y,{class:`page-heading`},{default:t(()=>[u(f,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),u(f,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(y,{class:`page-header-actions`,Orientation:`Horizontal`},{default:t(()=>[u(_,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind themeButtonLabel, Mode=OneWay}`},{default:t(()=>[u(s,{Glyph:``})]),_:1}),u(b,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind favoriteButtonLabel, Mode=OneWay}`},{default:t(()=>[u(s,{Glyph:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),u(y,{class:`gallery-page-content`},{default:t(()=>[u(x,{"x:Name":`Example1`,HeaderText:`{x:Bind basicHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind basicXaml}`,CSharp:`{x:Bind basicCSharp}`},{default:t(()=>[u(x.Example,null,{default:t(()=>[u(r,null,{default:t(()=>[u(C,{"x:Name":`rc`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,RefreshRequested:`rc_RefreshRequested`},{default:t(()=>[u(T,{"x:Name":`lv`,Height:`200`,MinWidth:`200`,ItemsSource:`{x:Bind items1, Mode=OneWay}`,BorderBrush:`{ThemeResource TextControlBorderBrush}`,BorderThickness:`1`})]),_:1})]),_:1})]),_:1}),u(x.Output,null,{default:t(()=>[u(y,{Spacing:`8`},{default:t(()=>[u(f,{Text:`{x:Bind basicStatus, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(f,{Text:`{x:Bind refreshCountText, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),u(x.Options,null,{default:t(()=>[u(y,{Spacing:`12`},{default:t(()=>[u(f,{Text:`{x:Bind gestureDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(_,{Content:`{x:Bind refreshButtonLabel, Mode=OneWay}`,Click:`rc.RequestRefresh`,IsEnabled:`{x:Bind canRefreshBasic, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),u(x,{"x:Name":`Example2`,HeaderText:`{x:Bind customHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind customXaml}`,CSharp:`{x:Bind customCSharp}`},{default:t(()=>[u(x.Example,null,{default:t(()=>[u(r,{"x:Name":`Ex2Grid`},{default:t(()=>[u(r.RowDefinitions,null,{default:t(()=>[u(v,{Height:`Auto`}),u(v)]),_:1}),u(C,{"x:Name":`rc2`,"Grid.Row":`1`,RefreshRequested:`rc2_RefreshRequested`},{default:t(()=>[u(C.Visualizer,null,{default:t(()=>[u(S,{"x:Name":`rv2`,RefreshStateChanged:`rv2_RefreshStateChanged`},{default:t(()=>[u(S.Content,null,{default:t(()=>[u(e,{Symbol:`AddFriend`})]),_:1})]),_:1})]),_:1}),u(T,{"x:Name":`lv2`,"Grid.Row":`1`,Width:`200`,Height:`200`,HorizontalAlignment:`Center`,ItemsSource:`{x:Bind items2, Mode=OneWay}`,BorderBrush:`{ThemeResource TextControlBorderBrush}`,BorderThickness:`1`})]),_:1})]),_:1})]),_:1}),u(x.Output,null,{default:t(()=>[u(y,{Spacing:`8`},{default:t(()=>[u(f,{Text:`{x:Bind customStatus, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(f,{Text:`{x:Bind syncCountText, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(f,{Text:`{x:Bind visualizerStateText, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),u(x.Options,null,{default:t(()=>[u(y,{Spacing:`12`},{default:t(()=>[u(f,{Text:`{x:Bind gestureDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(_,{Content:`{x:Bind refreshButtonLabel, Mode=OneWay}`,Click:`rc2.RequestRefresh`,IsEnabled:`{x:Bind canRefreshCustom, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}}),[[`__scopeId`,`data-v-8d5e77cc`]]);export{O as default};