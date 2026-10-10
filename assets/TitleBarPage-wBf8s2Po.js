import{Ai as e,Bi as t,Cn as n,En as r,Ji as i,Mn as a,Or as o,Yi as s,Zr as c,_i as l,a as u,at as d,bi as f,bn as p,ci as m,d as h,dr as ee,fr as te,gi as g,hi as _,ki as v,mt as ne,o as re,p as ie,t as ae,u as y,ui as b,ut as oe,wi as x}from"./ScrollViewer-CHNE18MA.js";import{t as S}from"./Button-DO0TiUOq.js";import{i as C}from"./IconSource-DFNvw2PD.js";import{d as w,f as T,l as E,n as D,o as O,u as k}from"./mountSystemBackdropsWindow-DrQgm9qB.js";import{t as se}from"./TextBox-DVeqZNbk.js";import{t as ce}from"./AutoSuggestBox-mJKsbX8M.js";import{t as le}from"./StackPanel-C60XOD66.js";import{t as ue}from"./ToggleButton-ZsjZg8Nu.js";import{i as A,n as j,t as M}from"./TitleBarWindow-WKOPy1pe.js";import{i as N}from"./systemBackdropHostAdapter-U7zYQ21_.js";import{t as P}from"./PersonPicture-B1tfbbWi.js";import{t as F}from"./ControlExample-BKyw2NwY.js";import{t as I}from"./ToggleSwitch-CSSaPMZA.js";import{t as L}from"./RichTextBlock-BsOcFqwR.js";import{t as R}from"./pageState-Djrh7EdY.js";var z=(e,t,n,r)=>{let i=D(e,t,{Kind:n,locale:r,allowedBackdrops:[]});if(i)return i;let a=c(n===`TitleBarDragRegions`?j:M,{handle:t});a.component(`x:Double`,o),a.provide(h,y(r,{"en-US":k,"zh-CN":E}));let s=new AbortController,l=!1,u=!1,d,f={},p=()=>{l||(l=!0,s.abort(),f.Stop?.(),u&&a.unmount(),d?.())};return f.Stop=t.Subscribe(e=>{e.Status===`Closed`&&p()}),l&&f.Stop(),T(t.TitleBarHost,{ExtendsContentIntoTitleBar:!0,PreferredHeightOption:`Tall`},s.signal).then(()=>{l||t.State.Status===`Closed`||(d=O(e,t.TitleBarHost),a.mount(e),u=!0)}).catch(n=>{l||(e.ownerDocument.defaultView?.console.error(n),p(),t.Close().catch(t=>e.ownerDocument.defaultView?.console.error(t)))}),p},B=`--- header
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
</TitleBar>`,V=`--- header
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
`,H=`--- header
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
  this.SetTitleBar(titleBar); // Set the custom title bar`,U=l({__name:`TitleBarPage`,setup(t,{expose:a}){a();let o=l({name:`HorizontalAlignment`,__xamlPrimitive:`HorizontalAlignment`,setup:()=>()=>null}),c=ie(),{t:h}=c,g=f(`currentPage`),{isFavoriteState:_,pageTheme:v,toggleTheme:y,toggleFavorite:b}=R(g?.value||`titlebar`),T=m(()=>({title:h(`text.titlebar`),toggleTheme:h(`gallery.page-header.toggle-theme`),favorite:h(_.value?`gallery.remove-favorite`:`gallery.add-favorite`),customizationIntro:h(`sample.titlebar.customization-intro`),appWindowTitleBar:h(`sample.titlebar.app-window-title-bar`),sampleSuffix:h(`sample.titlebar.sample-suffix`),configurationHeader:h(`sample.titlebar.configuration-header`),dragHeader:h(`sample.titlebar.drag-header`),endToEndHeader:h(`sample.titlebar.end-to-end-header`),search:h(`sample.titlebar.search`),titleOption:h(`sample.titlebar.title-option`),subtitleOption:h(`sample.titlebar.subtitle-option`),defaultTitle:h(`sample.titlebar.default-title`),defaultSubtitle:h(`sample.titlebar.default-subtitle`),backButtonOption:h(`sample.titlebar.back-button-option`),paneToggleOption:h(`sample.titlebar.pane-toggle-option`),dragDescription:h(`sample.titlebar.drag-description`),endToEndDescription:h(`sample.titlebar.end-to-end-description`),showWindow:h(`sample.systembackdrops.show-window`)})),E=m(()=>_.value?``:``),D=s({}),O=(e,t)=>e.match(RegExp(`(?:^|\\r?\\n)--- `+t+`\\r?\\n([\\s\\S]*?)(?=\\r?\\n--- |$)`))?.[1]?.trim()??``,k=O(B,`xaml`),j=O(V,`xaml`),M=O(V,`c#`),U=O(H,`xaml`),W=O(H,`c#`),G=i(``),K=i(``),q=new Set;x(()=>{q.forEach(e=>e()),q.clear()});let J=async e=>{let t=e===`TitleBarDragRegions`?G:K;try{let n=(await N({title:h(e===`TitleBarDragRegions`?`sample.titlebar.drag-window-title`:`sample.titlebar.end-window-title`),width:1e3,height:700,theme:`Default`,backdrop:{Type:`Mica`,Kind:`Base`},mountContent:(t,n)=>z(t,n,e,c.locale)})).Subscribe(e=>{t.value=h(e.Status===`Closed`?`sample.systembackdrops.closed`:e.Reason===`NativeBackdropUnavailable`?`sample.titlebar.browser-host-unavailable`:`sample.systembackdrops.window-opened`)});q.add(n)}catch(e){t.value=h(e.Code===`PopupBlocked`?`sample.systembackdrops.popup-blocked`:`sample.systembackdrops.window-failed`)}},Y=()=>J(`TitleBarDragRegions`),X=()=>J(`TitleBarEndToEnd`),Z=()=>{A(window,v.value,document.getElementById(`app`)??void 0)},Q=()=>{window.open(`https://github.com/microsoft/WinUI-Gallery/tree/main/WinUIGallery/Samples/AppWindowTitleBar`,`_blank`,`noopener`)};e(ee,D),e(te,{Labels:T,favoriteGlyph:E,isFavoriteState:_,pageTheme:v,toggleTheme:y,toggleFavorite:b,configurationXaml:k,dragXaml:j,dragCSharp:M,endToEndXaml:U,endToEndCSharp:W,dragOutput:G,endToEndOutput:K,CreateTitleBarDragRegionsWindowClick:Y,CreateTitleBarWindowClick:X,TitleBar_LayoutUpdated:Z,Hyperlink_Click:Q});let $={HorizontalAlignment:o,i18n:c,t:h,currentPage:g,isFavoriteState:_,pageTheme:v,toggleTheme:y,toggleFavorite:b,Labels:T,favoriteGlyph:E,names:D,section:O,configurationXaml:k,dragXaml:j,dragCSharp:M,endToEndXaml:U,endToEndCSharp:W,dragOutput:G,endToEndOutput:K,subscriptions:q,openSample:J,CreateTitleBarDragRegionsWindowClick:Y,CreateTitleBarWindowClick:X,TitleBar_LayoutUpdated:Z,Hyperlink_Click:Q,AutoSuggestBox:ce,Button:S,ControlExample:F,FontIcon:u,Grid:r,Page:n,PersonPicture:P,RichTextBlock:L,ScrollViewer:ae,StackPanel:le,TextBlock:re,TextBox:se,TitleBar:w,ToggleButton:ue,ToggleSwitch:I,get ImageIconSource(){return C},get Hyperlink(){return d},get Paragraph(){return oe},get Run(){return ne},get ControlExampleSubstitution(){return p}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function W(e,n,r,i,a,o){return v(),b(i.Page,null,{default:t(()=>[g(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollMode:`Auto`,VerticalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Disabled`,HorizontalScrollBarVisibility:`Disabled`},{default:t(()=>[g(i.StackPanel,{class:`gallery-item-page`},{default:t(()=>[g(i.StackPanel,{class:`page-heading`},{default:t(()=>[g(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.title, Mode=OneWay}`}),g(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:t(()=>[g(i.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind Labels.toggleTheme, Mode=OneWay}`},{default:t(()=>[g(i.FontIcon,{Glyph:``})]),_:1}),g(i.ToggleButton,{class:`header-action`,Click:`toggleFavorite`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.favorite, Mode=OneWay}`},{default:t(()=>[g(i.FontIcon,{Glyph:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),g(i.StackPanel,{class:`gallery-page-content`,Margin:`0,12,0,0`},{default:t(()=>[g(i.RichTextBlock,null,{default:t(()=>[g(i.Paragraph,null,{default:t(()=>[g(i.Run,{Text:`{x:Bind Labels.customizationIntro, Mode=OneWay}`}),g(i.Hyperlink,{Click:`Hyperlink_Click`},{default:t(()=>[g(i.Run,{Text:`{x:Bind Labels.appWindowTitleBar, Mode=OneWay}`})]),_:1}),g(i.Run,{Text:`{x:Bind Labels.sampleSuffix, Mode=OneWay}`})]),_:1})]),_:1}),g(i.ControlExample,{HorizontalContentAlignment:`Stretch`,HeaderText:`{x:Bind Labels.configurationHeader, Mode=OneWay}`,SampleDefinition:`TitleBar\\TitlebarConfiguration.txt`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind configurationXaml, Mode=OneWay}`},{default:t(()=>[g(i.ControlExample.Example,null,{default:t(()=>[g(i.Grid,{HorizontalAlignment:`Stretch`,VerticalAlignment:`Center`,Background:`{ThemeResource CardBackgroundFillColorDefaultBrush}`,BorderBrush:`{ThemeResource SurfaceStrokeColorDefaultBrush}`,BorderThickness:`1`,CornerRadius:`{StaticResource OverlayCornerRadius}`},{default:t(()=>[g(i.TitleBar,{"x:Name":`TitleBarControl`,Title:`{Binding ElementName=TitleBox, Path=Text, Mode=OneWay}`,Subtitle:`{Binding ElementName=SubtitleBox, Path=Text, Mode=OneWay}`,IsBackButtonVisible:`{Binding ElementName=BackButtonToggle, Path=IsOn, Mode=OneWay}`,IsPaneToggleButtonVisible:`{Binding ElementName=PaneToggle, Path=IsOn, Mode=OneWay}`,LayoutUpdated:`TitleBar_LayoutUpdated`},{default:t(()=>[g(i.TitleBar.Resources,null,{default:t(()=>[g(i.HorizontalAlignment,{"x:Key":`TitleBarContentHorizontalAlignment`},{default:t(()=>[...n[0]||=[_(`Stretch`,-1)]]),_:1})]),_:1}),g(i.TitleBar.IconSource,null,{default:t(()=>[g(i.ImageIconSource,{ImageSource:`https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/Tiles/GalleryIcon.ico`})]),_:1}),g(i.TitleBar.RightHeader,null,{default:t(()=>[g(i.PersonPicture,{Width:`30`,Height:`30`,Initials:`JD`})]),_:1}),g(i.TitleBar.Content,null,{default:t(()=>[g(i.AutoSuggestBox,{MaxWidth:`580`,HorizontalAlignment:`Stretch`,VerticalAlignment:`Center`,PlaceholderText:`{x:Bind Labels.search, Mode=OneWay}`,QueryIcon:`Find`})]),_:1})]),_:1})]),_:1})]),_:1}),g(i.ControlExample.Output),g(i.ControlExample.Options,null,{default:t(()=>[g(i.StackPanel,{Width:`240`,Orientation:`Vertical`,Spacing:`12`},{default:t(()=>[g(i.TextBox,{"x:Name":`TitleBox`,Header:`{x:Bind Labels.titleOption, Mode=OneWay}`,Text:`{x:Bind Labels.defaultTitle, Mode=OneWay}`}),g(i.TextBox,{"x:Name":`SubtitleBox`,Header:`{x:Bind Labels.subtitleOption, Mode=OneWay}`,Text:`{x:Bind Labels.defaultSubtitle, Mode=OneWay}`}),g(i.ToggleSwitch,{"x:Name":`BackButtonToggle`,Header:`{x:Bind Labels.backButtonOption, Mode=OneWay}`,IsOn:`False`}),g(i.ToggleSwitch,{"x:Name":`PaneToggle`,Header:`{x:Bind Labels.paneToggleOption, Mode=OneWay}`,IsOn:`False`})]),_:1})]),_:1}),g(i.ControlExample.Substitutions,null,{default:t(()=>[g(i.ControlExampleSubstitution,{Key:`Title`,Value:`{x:Bind TitleBox.Text, Mode=OneWay}`}),g(i.ControlExampleSubstitution,{Key:`Subtitle`,Value:`{x:Bind SubtitleBox.Text, Mode=OneWay}`}),g(i.ControlExampleSubstitution,{Key:`BackButtonVisibility`,Value:`{x:Bind BackButtonToggle.IsOn, Mode=OneWay}`}),g(i.ControlExampleSubstitution,{Key:`PaneToggleVisibility`,Value:`{x:Bind PaneToggle.IsOn, Mode=OneWay}`})]),_:1})]),_:1}),g(i.ControlExample,{HorizontalContentAlignment:`Stretch`,HeaderText:`{x:Bind Labels.dragHeader, Mode=OneWay}`,SampleDefinition:`TitleBar\\TitlebarDragRegions.txt`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind dragXaml, Mode=OneWay}`,CSharp:`{x:Bind dragCSharp, Mode=OneWay}`},{default:t(()=>[g(i.ControlExample.Example,null,{default:t(()=>[g(i.StackPanel,{MaxWidth:`560`,Orientation:`Vertical`,Spacing:`12`},{default:t(()=>[g(i.TextBlock,{HorizontalAlignment:`Center`,TextAlignment:`Center`,TextWrapping:`WrapWholeWords`,Text:`{x:Bind Labels.dragDescription, Mode=OneWay}`}),g(i.Button,{HorizontalAlignment:`Center`,Click:`CreateTitleBarDragRegionsWindowClick`,Content:`{x:Bind Labels.showWindow, Mode=OneWay}`,Style:`{StaticResource AccentButtonStyle}`})]),_:1})]),_:1}),g(i.ControlExample.Output,null,{default:t(()=>[g(i.TextBlock,{Text:`{x:Bind dragOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),g(i.ControlExample.Options)]),_:1}),g(i.ControlExample,{HorizontalContentAlignment:`Stretch`,HeaderText:`{x:Bind Labels.endToEndHeader, Mode=OneWay}`,SampleDefinition:`TitleBar\\EndEndTitlebarSample.txt`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind endToEndXaml, Mode=OneWay}`,CSharp:`{x:Bind endToEndCSharp, Mode=OneWay}`},{default:t(()=>[g(i.ControlExample.Example,null,{default:t(()=>[g(i.StackPanel,{MaxWidth:`560`,Orientation:`Vertical`,Spacing:`12`},{default:t(()=>[g(i.TextBlock,{HorizontalAlignment:`Center`,TextAlignment:`Center`,TextWrapping:`WrapWholeWords`,Text:`{x:Bind Labels.endToEndDescription, Mode=OneWay}`}),g(i.Button,{HorizontalAlignment:`Center`,Click:`CreateTitleBarWindowClick`,Content:`{x:Bind Labels.showWindow, Mode=OneWay}`,Style:`{StaticResource AccentButtonStyle}`})]),_:1})]),_:1}),g(i.ControlExample.Output,null,{default:t(()=>[g(i.TextBlock,{Text:`{x:Bind endToEndOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),g(i.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var G=a(U,[[`render`,W],[`__scopeId`,`data-v-875fabf4`],[`__file`,`TitleBarPage.vue`]]);export{G as default};