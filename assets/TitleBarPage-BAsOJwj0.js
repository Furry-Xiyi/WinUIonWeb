import{$i as e,Ai as t,Bi as n,Cn as r,En as i,Ji as a,Mn as o,Or as s,Yi as c,Zr as l,_i as u,a as d,at as f,bi as p,bn as m,ci as h,d as g,dr as _,fr as ee,gi as v,hi as y,ki as b,mt as x,o as S,p as C,t as te,u as w,ui as T,ut as E,wi as ne}from"./ScrollViewer-DXAtwYnH.js";import{t as D}from"./Button-1Ztf3pH0.js";import{i as re}from"./IconSource-vA8_hfVj.js";import{d as O,f as k,l as A,n as j,o as M,u as N}from"./mountSystemBackdropsWindow-D9rJ-R9r.js";import{t as P}from"./TextBox-Ty-JbKyj.js";import{t as ie}from"./AutoSuggestBox-Dsm9JkAY.js";import{t as F}from"./StackPanel-DGz4UnE4.js";import{t as ae}from"./ToggleButton-D0RGNdIP.js";import{i as I,n as L,t as R}from"./TitleBarWindow-CRUEaDx3.js";import{i as z}from"./systemBackdropHostAdapter-U7zYQ21_.js";import{t as B}from"./PersonPicture-BZuoMCiM.js";import{t as V}from"./ControlExample-BX-yRpiQ.js";import{t as H}from"./ToggleSwitch-Bx9LVqfh.js";import{t as U}from"./RichTextBlock-BNyCuSHm.js";import{t as W}from"./pageState-cPponcIo.js";var G=(e,t,n,r)=>{let i=j(e,t,{Kind:n,locale:r,allowedBackdrops:[]});if(i)return i;let a=l(n===`TitleBarDragRegions`?L:R,{handle:t});a.component(`x:Double`,s),a.provide(g,w(r,{"en-US":N,"zh-CN":A}));let o=new AbortController,c=!1,u=!1,d,f={},p=()=>{c||(c=!0,o.abort(),f.Stop?.(),u&&a.unmount(),d?.())};return f.Stop=t.Subscribe(e=>{e.Status===`Closed`&&p()}),c&&f.Stop(),k(t.TitleBarHost,{ExtendsContentIntoTitleBar:!0,PreferredHeightOption:`Tall`},o.signal).then(()=>{c||t.State.Status===`Closed`||(d=M(e,t.TitleBarHost),a.mount(e),u=!0)}).catch(n=>{c||(e.ownerDocument.defaultView?.console.error(n),p(),t.Close().catch(t=>e.ownerDocument.defaultView?.console.error(t)))}),p},K=`--- header
TitleBar configuration
--- xaml
<TitleBar
    Title="$(Title)"
    Subtitle="$(Subtitle)"
    IsBackButtonVisible="$(BackButtonVisibility)"
    IsPaneToggleButtonVisible="$(PaneToggleVisibility)">
    <TitleBar.Resources>
        <!-- TitleBar.Content uses Center alignment by default. Override to
             Stretch so the AutoSuggestBox grows with the title bar. -->
        <HorizontalAlignment x:Key="TitleBarContentHorizontalAlignment">Stretch</HorizontalAlignment>
    </TitleBar.Resources>
    <TitleBar.IconSource>
        <ImageIconSource ImageSource="/Assets/Tiles/GalleryIcon.ico" />
    </TitleBar.IconSource>
    <TitleBar.Content>
        <AutoSuggestBox
            MaxWidth="580"
            HorizontalAlignment="Stretch"
            VerticalAlignment="Center"
            PlaceholderText="Search..."
            QueryIcon="Find" />
    </TitleBar.Content>
    <TitleBar.RightHeader>
        <PersonPicture
            Width="30"
            Height="30"
            Initials="JD" />
    </TitleBar.RightHeader>
</TitleBar>`,q=`--- header
TitleBar drag regions
--- xaml
<!-- Starting with WindowsAppSDK 2.1, TitleBar walks TitleBar.Content,
     auto-excludes interactive controls from the drag region, and lets
     non-interactive visuals (and empty space) remain draggable.

     Use TitleBar.IsDragRegion to override the framework decision:
       True   -> always draggable
       False  -> always clickable
       unset  -> framework decides (default) -->
<TitleBar x:Name="titleBar" Title="Drag regions">
    <TitleBar.Resources>
        <!-- TitleBar.Content uses Center alignment by default, so a child
             with HorizontalAlignment=Stretch will not actually grow.
             Override to Stretch to let the search box fill the content area. -->
        <HorizontalAlignment x:Key="TitleBarContentHorizontalAlignment">Stretch</HorizontalAlignment>
    </TitleBar.Resources>
    <TitleBar.Content>
        <Grid ColumnSpacing="8" HorizontalAlignment="Stretch">
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="*" />
                <ColumnDefinition Width="Auto" />
            </Grid.ColumnDefinitions>
            <!-- Interactive: auto-excluded from drag. -->
            <AutoSuggestBox
                MaxWidth="580"
                HorizontalAlignment="Stretch"
                VerticalAlignment="Center"
                PlaceholderText="Search..."
                QueryIcon="Find" />
            <!-- Interactive Button. Drag behavior is overridden via
                 TitleBar.IsDragRegion in code-behind. -->
            <Button
                x:Name="StatusBadge"
                Grid.Column="1"
                VerticalAlignment="Center"
                Click="StatusBadge_Click"
                Content="Status"
                Style="{StaticResource AccentButtonStyle}" />
        </Grid>
    </TitleBar.Content>
</TitleBar>
--- c#
// Set TitleBar.IsDragRegion at runtime.
TitleBar.SetIsDragRegion(StatusBadge, true);   // always draggable
TitleBar.SetIsDragRegion(StatusBadge, false);  // always clickable
StatusBadge.ClearValue(TitleBar.IsDragRegionProperty); // back to default

// After adding or removing elements in TitleBar.Content dynamically,
// ask the framework to recompute drag regions.
titleBar.RecomputeDragRegions();
`,J=`--- header
End to end TitleBar sample
--- xaml
<Grid>
    <Grid.RowDefinitions>
        <RowDefinition Height="Auto" />
        <!--  TitleBar  -->
        <RowDefinition Height="*" />
        <!--  NavigationView  -->
    </Grid.RowDefinitions>

    <TitleBar
        x:Name="titleBar"
        BackRequested="TitleBar_BackRequested"
        IsBackButtonVisible="{x:Bind navFrame.CanGoBack, Mode=OneWay}"
        IsPaneToggleButtonVisible="True"
        PaneToggleRequested="TitleBar_PaneToggleRequested" />

    <NavigationView
        x:Name="navView"
        Grid.Row="1"
        IsBackButtonVisible="Collapsed"
        IsPaneToggleButtonVisible="False">
        <NavigationView.MenuItems... />
        <Frame x:Name="navFrame" />
    </NavigationView>
</Grid>
--- c#
this.ExtendsContentIntoTitleBar = true; // Extend the content into the title bar and hide the default titlebar
  this.SetTitleBar(titleBar); // Set the custom title bar`,Y=o(u({__name:`TitleBarPage`,setup(o){let s=u({name:`HorizontalAlignment`,__xamlPrimitive:`HorizontalAlignment`,setup:()=>()=>null}),l=C(),{t:g}=l,{isFavoriteState:w,pageTheme:k,toggleTheme:A,toggleFavorite:j}=W(p(`currentPage`)?.value||`titlebar`),M=h(()=>({title:g(`text.titlebar`),toggleTheme:g(`gallery.page-header.toggle-theme`),favorite:g(w.value?`gallery.remove-favorite`:`gallery.add-favorite`),customizationIntro:g(`sample.titlebar.customization-intro`),appWindowTitleBar:g(`sample.titlebar.app-window-title-bar`),sampleSuffix:g(`sample.titlebar.sample-suffix`),configurationHeader:g(`sample.titlebar.configuration-header`),dragHeader:g(`sample.titlebar.drag-header`),endToEndHeader:g(`sample.titlebar.end-to-end-header`),search:g(`sample.titlebar.search`),titleOption:g(`sample.titlebar.title-option`),subtitleOption:g(`sample.titlebar.subtitle-option`),defaultTitle:g(`sample.titlebar.default-title`),defaultSubtitle:g(`sample.titlebar.default-subtitle`),backButtonOption:g(`sample.titlebar.back-button-option`),paneToggleOption:g(`sample.titlebar.pane-toggle-option`),dragDescription:g(`sample.titlebar.drag-description`),endToEndDescription:g(`sample.titlebar.end-to-end-description`),showWindow:g(`sample.systembackdrops.show-window`)})),N=h(()=>w.value?``:``),L=c({}),R=(e,t)=>e.match(RegExp(`(?:^|\\r?\\n)--- `+t+`\\r?\\n([\\s\\S]*?)(?=\\r?\\n--- |$)`))?.[1]?.trim()??``,Y=R(K,`xaml`),oe=R(q,`xaml`),se=R(q,`c#`),ce=R(J,`xaml`),le=R(J,`c#`),X=a(``),Z=a(``),Q=new Set;ne(()=>{Q.forEach(e=>e()),Q.clear()});let $=async e=>{let t=e===`TitleBarDragRegions`?X:Z;try{let n=(await z({title:g(e===`TitleBarDragRegions`?`sample.titlebar.drag-window-title`:`sample.titlebar.end-window-title`),width:1e3,height:700,theme:`Default`,backdrop:{Type:`Mica`,Kind:`Base`},mountContent:(t,n)=>G(t,n,e,l.locale)})).Subscribe(e=>{t.value=g(e.Status===`Closed`?`sample.systembackdrops.closed`:e.Reason===`NativeBackdropUnavailable`?`sample.titlebar.browser-host-unavailable`:`sample.systembackdrops.window-opened`)});Q.add(n)}catch(e){t.value=g(e.Code===`PopupBlocked`?`sample.systembackdrops.popup-blocked`:`sample.systembackdrops.window-failed`)}};return t(_,L),t(ee,{Labels:M,favoriteGlyph:N,isFavoriteState:w,pageTheme:k,toggleTheme:A,toggleFavorite:j,configurationXaml:Y,dragXaml:oe,dragCSharp:se,endToEndXaml:ce,endToEndCSharp:le,dragOutput:X,endToEndOutput:Z,CreateTitleBarDragRegionsWindowClick:()=>$(`TitleBarDragRegions`),CreateTitleBarWindowClick:()=>$(`TitleBarEndToEnd`),TitleBar_LayoutUpdated:()=>{I(window,k.value,document.getElementById(`app`)??void 0)},Hyperlink_Click:()=>{window.open(`https://github.com/microsoft/WinUI-Gallery/tree/main/WinUIGallery/Samples/AppWindowTitleBar`,`_blank`,`noopener`)}}),(t,a)=>(b(),T(r,null,{default:n(()=>[v(te,{class:`gallery-page-scroll`,VerticalScrollMode:`Auto`,VerticalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Disabled`,HorizontalScrollBarVisibility:`Disabled`},{default:n(()=>[v(F,{class:`gallery-item-page`},{default:n(()=>[v(F,{class:`page-heading`},{default:n(()=>[v(S,{class:`page-header`,Text:`{x:Bind Labels.title, Mode=OneWay}`}),v(F,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:n(()=>[v(D,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind Labels.toggleTheme, Mode=OneWay}`},{default:n(()=>[v(d,{Glyph:``})]),_:1}),v(ae,{class:`header-action`,Click:`toggleFavorite`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.favorite, Mode=OneWay}`},{default:n(()=>[v(d,{Glyph:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),v(F,{class:`gallery-page-content`,Margin:`0,12,0,0`},{default:n(()=>[v(U,null,{default:n(()=>[v(e(E),null,{default:n(()=>[v(e(x),{Text:`{x:Bind Labels.customizationIntro, Mode=OneWay}`}),v(e(f),{Click:`Hyperlink_Click`},{default:n(()=>[v(e(x),{Text:`{x:Bind Labels.appWindowTitleBar, Mode=OneWay}`})]),_:1}),v(e(x),{Text:`{x:Bind Labels.sampleSuffix, Mode=OneWay}`})]),_:1})]),_:1}),v(V,{HorizontalContentAlignment:`Stretch`,HeaderText:`{x:Bind Labels.configurationHeader, Mode=OneWay}`,SampleDefinition:`TitleBar\\TitlebarConfiguration.txt`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind configurationXaml, Mode=OneWay}`},{default:n(()=>[v(V.Example,null,{default:n(()=>[v(i,{HorizontalAlignment:`Stretch`,VerticalAlignment:`Center`,Background:`{ThemeResource CardBackgroundFillColorDefaultBrush}`,BorderBrush:`{ThemeResource SurfaceStrokeColorDefaultBrush}`,BorderThickness:`1`,CornerRadius:`{StaticResource OverlayCornerRadius}`},{default:n(()=>[v(O,{"x:Name":`TitleBarControl`,Title:`{Binding ElementName=TitleBox, Path=Text, Mode=OneWay}`,Subtitle:`{Binding ElementName=SubtitleBox, Path=Text, Mode=OneWay}`,IsBackButtonVisible:`{Binding ElementName=BackButtonToggle, Path=IsOn, Mode=OneWay}`,IsPaneToggleButtonVisible:`{Binding ElementName=PaneToggle, Path=IsOn, Mode=OneWay}`,LayoutUpdated:`TitleBar_LayoutUpdated`},{default:n(()=>[v(O.Resources,null,{default:n(()=>[v(e(s),{"x:Key":`TitleBarContentHorizontalAlignment`},{default:n(()=>[...a[0]||=[y(`Stretch`,-1)]]),_:1})]),_:1}),v(O.IconSource,null,{default:n(()=>[v(e(re),{ImageSource:`https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/Tiles/GalleryIcon.ico`})]),_:1}),v(O.RightHeader,null,{default:n(()=>[v(B,{Width:`30`,Height:`30`,Initials:`JD`})]),_:1}),v(O.Content,null,{default:n(()=>[v(ie,{MaxWidth:`580`,HorizontalAlignment:`Stretch`,VerticalAlignment:`Center`,PlaceholderText:`{x:Bind Labels.search, Mode=OneWay}`,QueryIcon:`Find`})]),_:1})]),_:1})]),_:1})]),_:1}),v(V.Output),v(V.Options,null,{default:n(()=>[v(F,{Width:`240`,Orientation:`Vertical`,Spacing:`12`},{default:n(()=>[v(P,{"x:Name":`TitleBox`,Header:`{x:Bind Labels.titleOption, Mode=OneWay}`,Text:`{x:Bind Labels.defaultTitle, Mode=OneWay}`}),v(P,{"x:Name":`SubtitleBox`,Header:`{x:Bind Labels.subtitleOption, Mode=OneWay}`,Text:`{x:Bind Labels.defaultSubtitle, Mode=OneWay}`}),v(H,{"x:Name":`BackButtonToggle`,Header:`{x:Bind Labels.backButtonOption, Mode=OneWay}`,IsOn:`False`}),v(H,{"x:Name":`PaneToggle`,Header:`{x:Bind Labels.paneToggleOption, Mode=OneWay}`,IsOn:`False`})]),_:1})]),_:1}),v(V.Substitutions,null,{default:n(()=>[v(e(m),{Key:`Title`,Value:`{x:Bind TitleBox.Text, Mode=OneWay}`}),v(e(m),{Key:`Subtitle`,Value:`{x:Bind SubtitleBox.Text, Mode=OneWay}`}),v(e(m),{Key:`BackButtonVisibility`,Value:`{x:Bind BackButtonToggle.IsOn, Mode=OneWay}`}),v(e(m),{Key:`PaneToggleVisibility`,Value:`{x:Bind PaneToggle.IsOn, Mode=OneWay}`})]),_:1})]),_:1}),v(V,{HorizontalContentAlignment:`Stretch`,HeaderText:`{x:Bind Labels.dragHeader, Mode=OneWay}`,SampleDefinition:`TitleBar\\TitlebarDragRegions.txt`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind dragXaml, Mode=OneWay}`,CSharp:`{x:Bind dragCSharp, Mode=OneWay}`},{default:n(()=>[v(V.Example,null,{default:n(()=>[v(F,{MaxWidth:`560`,Orientation:`Vertical`,Spacing:`12`},{default:n(()=>[v(S,{HorizontalAlignment:`Center`,TextAlignment:`Center`,TextWrapping:`WrapWholeWords`,Text:`{x:Bind Labels.dragDescription, Mode=OneWay}`}),v(D,{HorizontalAlignment:`Center`,Click:`CreateTitleBarDragRegionsWindowClick`,Content:`{x:Bind Labels.showWindow, Mode=OneWay}`,Style:`{StaticResource AccentButtonStyle}`})]),_:1})]),_:1}),v(V.Output,null,{default:n(()=>[v(S,{Text:`{x:Bind dragOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),v(V.Options)]),_:1}),v(V,{HorizontalContentAlignment:`Stretch`,HeaderText:`{x:Bind Labels.endToEndHeader, Mode=OneWay}`,SampleDefinition:`TitleBar\\EndEndTitlebarSample.txt`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind endToEndXaml, Mode=OneWay}`,CSharp:`{x:Bind endToEndCSharp, Mode=OneWay}`},{default:n(()=>[v(V.Example,null,{default:n(()=>[v(F,{MaxWidth:`560`,Orientation:`Vertical`,Spacing:`12`},{default:n(()=>[v(S,{HorizontalAlignment:`Center`,TextAlignment:`Center`,TextWrapping:`WrapWholeWords`,Text:`{x:Bind Labels.endToEndDescription, Mode=OneWay}`}),v(D,{HorizontalAlignment:`Center`,Click:`CreateTitleBarWindowClick`,Content:`{x:Bind Labels.showWindow, Mode=OneWay}`,Style:`{StaticResource AccentButtonStyle}`})]),_:1})]),_:1}),v(V.Output,null,{default:n(()=>[v(S,{Text:`{x:Bind endToEndOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),v(V.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}}),[[`__scopeId`,`data-v-875fabf4`]]);export{Y as default};