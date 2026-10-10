import{Cr as e,Dn as t,Fi as n,I as r,Kr as i,Lt as a,Q as o,Sn as s,Ti as c,Ui as l,Wi as u,Wt as d,Z as f,a as p,ai as m,di as h,et as ee,fi as g,hi as te,jn as ne,o as re,or as ie,ri as _,sr as v,t as y,ui as b,wi as x,yi as ae}from"./ScrollViewer-PoO_ma9Z.js";import{t as oe}from"./TextBox-CUDHzHNn.js";import{t as se}from"./AutoSuggestBox-uUClJKWZ.js";import{t as ce}from"./Button-DjU0urmJ.js";import{i as le}from"./IconSource-IYGKN-7g.js";import{t as S}from"./StackPanel-CT7pl8zy.js";import{t as C}from"./PersonPicture-U39A_QFS.js";import{t as ue}from"./RichTextBlock-BmiMaFGI.js";import{i as w}from"./systemBackdropHostAdapter-U7zYQ21_.js";import{d as T,f as E,l as D,n as O,o as k,u as A}from"./mountSystemBackdropsWindow-Bw_4dLq2.js";import{t as j}from"./ToggleButton-DwmhXZge.js";import{t as M}from"./ToggleSwitch-BEoVatRz.js";import{i as N,n as P,t as F}from"./TitleBarWindow-UpdU_SjF.js";import{a as I,t as L}from"./ControlExample-C1ahTZEr.js";import{t as R}from"./pageState-BN3kXI7L.js";var z=(t,n,r,a)=>{let s=O(t,n,{Kind:r,locale:a,allowedBackdrops:[]});if(s)return s;let c=i(r===`TitleBarDragRegions`?P:F,{handle:n});c.component(`x:Double`,e),c.provide(o,f(a,{"en-US":A,"zh-CN":D}));let l=new AbortController,u=!1,d=!1,p,m={},h=()=>{u||(u=!0,l.abort(),m.Stop?.(),d&&c.unmount(),p?.())};return m.Stop=n.Subscribe(e=>{e.Status===`Closed`&&h()}),u&&m.Stop(),E(n.TitleBarHost,{ExtendsContentIntoTitleBar:!0,PreferredHeightOption:`Tall`},l.signal).then(()=>{u||n.State.Status===`Closed`||(p=k(t,n.TitleBarHost),c.mount(t),d=!0)}).catch(e=>{u||(t.ownerDocument.defaultView?.console.error(e),h(),n.Close().catch(e=>t.ownerDocument.defaultView?.console.error(e)))}),h},B=`--- header
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
  this.SetTitleBar(titleBar); // Set the custom title bar`,U=g({__name:`TitleBarPage`,setup(e,{expose:n}){n();let i=g({name:`HorizontalAlignment`,__xamlPrimitive:`HorizontalAlignment`,setup:()=>()=>null}),o=ee(),{t:d}=o,f=te(`currentPage`),{isFavoriteState:m,pageTheme:h,toggleTheme:b,toggleFavorite:x}=R(f?.value||`titlebar`),E=_(()=>({title:d(`text.titlebar`),toggleTheme:d(`gallery.page-header.toggle-theme`),favorite:d(m.value?`gallery.remove-favorite`:`gallery.add-favorite`),customizationIntro:d(`sample.titlebar.customization-intro`),appWindowTitleBar:d(`sample.titlebar.app-window-title-bar`),sampleSuffix:d(`sample.titlebar.sample-suffix`),configurationHeader:d(`sample.titlebar.configuration-header`),dragHeader:d(`sample.titlebar.drag-header`),endToEndHeader:d(`sample.titlebar.end-to-end-header`),search:d(`sample.titlebar.search`),titleOption:d(`sample.titlebar.title-option`),subtitleOption:d(`sample.titlebar.subtitle-option`),defaultTitle:d(`sample.titlebar.default-title`),defaultSubtitle:d(`sample.titlebar.default-subtitle`),backButtonOption:d(`sample.titlebar.back-button-option`),paneToggleOption:d(`sample.titlebar.pane-toggle-option`),dragDescription:d(`sample.titlebar.drag-description`),endToEndDescription:d(`sample.titlebar.end-to-end-description`),showWindow:d(`sample.systembackdrops.show-window`)})),D=_(()=>m.value?``:``),O=u({}),k=(e,t)=>e.match(RegExp(`(?:^|\\r?\\n)--- `+t+`\\r?\\n([\\s\\S]*?)(?=\\r?\\n--- |$)`))?.[1]?.trim()??``,A=k(B,`xaml`),P=k(V,`xaml`),F=k(V,`c#`),U=k(H,`xaml`),W=k(H,`c#`),G=l(``),K=l(``),q=new Set;ae(()=>{q.forEach(e=>e()),q.clear()});let J=async e=>{let t=e===`TitleBarDragRegions`?G:K;try{let n=(await w({title:d(e===`TitleBarDragRegions`?`sample.titlebar.drag-window-title`:`sample.titlebar.end-window-title`),width:1e3,height:700,theme:`Default`,backdrop:{Type:`Mica`,Kind:`Base`},mountContent:(t,n)=>z(t,n,e,o.locale)})).Subscribe(e=>{t.value=d(e.Status===`Closed`?`sample.systembackdrops.closed`:e.Reason===`NativeBackdropUnavailable`?`sample.titlebar.browser-host-unavailable`:`sample.systembackdrops.window-opened`)});q.add(n)}catch(e){t.value=d(e.Code===`PopupBlocked`?`sample.systembackdrops.popup-blocked`:`sample.systembackdrops.window-failed`)}},Y=()=>J(`TitleBarDragRegions`),X=()=>J(`TitleBarEndToEnd`),Z=()=>{N(window,h.value,document.getElementById(`app`)??void 0)},Q=()=>{window.open(`https://github.com/microsoft/WinUI-Gallery/tree/main/WinUIGallery/Samples/AppWindowTitleBar`,`_blank`,`noopener`)};c(ie,O),c(v,{Labels:E,favoriteGlyph:D,isFavoriteState:m,pageTheme:h,toggleTheme:b,toggleFavorite:x,configurationXaml:A,dragXaml:P,dragCSharp:F,endToEndXaml:U,endToEndCSharp:W,dragOutput:G,endToEndOutput:K,CreateTitleBarDragRegionsWindowClick:Y,CreateTitleBarWindowClick:X,TitleBar_LayoutUpdated:Z,Hyperlink_Click:Q});let $={HorizontalAlignment:i,i18n:o,t:d,currentPage:f,isFavoriteState:m,pageTheme:h,toggleTheme:b,toggleFavorite:x,Labels:E,favoriteGlyph:D,names:O,section:k,configurationXaml:A,dragXaml:P,dragCSharp:F,endToEndXaml:U,endToEndCSharp:W,dragOutput:G,endToEndOutput:K,subscriptions:q,openSample:J,CreateTitleBarDragRegionsWindowClick:Y,CreateTitleBarWindowClick:X,TitleBar_LayoutUpdated:Z,Hyperlink_Click:Q,AutoSuggestBox:se,Button:ce,ControlExample:L,FontIcon:p,Grid:a,Page:r,PersonPicture:C,RichTextBlock:ue,ScrollViewer:y,StackPanel:S,TextBlock:re,TextBox:oe,TitleBar:T,ToggleButton:j,ToggleSwitch:M,get ImageIconSource(){return le},get Hyperlink(){return s},get Paragraph(){return t},get Run(){return ne},get ControlExampleSubstitution(){return I}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function W(e,t,r,i,a,o){return x(),m(i.Page,null,{default:n(()=>[h(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollMode:`Auto`,VerticalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Disabled`,HorizontalScrollBarVisibility:`Disabled`},{default:n(()=>[h(i.StackPanel,{class:`gallery-item-page`},{default:n(()=>[h(i.StackPanel,{class:`page-heading`},{default:n(()=>[h(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.title, Mode=OneWay}`}),h(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:n(()=>[h(i.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind Labels.toggleTheme, Mode=OneWay}`},{default:n(()=>[h(i.FontIcon,{Glyph:``})]),_:1}),h(i.ToggleButton,{class:`header-action`,Click:`toggleFavorite`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.favorite, Mode=OneWay}`},{default:n(()=>[h(i.FontIcon,{Glyph:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),h(i.StackPanel,{class:`gallery-page-content`,Margin:`0,12,0,0`},{default:n(()=>[h(i.RichTextBlock,null,{default:n(()=>[h(i.Paragraph,null,{default:n(()=>[h(i.Run,{Text:`{x:Bind Labels.customizationIntro, Mode=OneWay}`}),h(i.Hyperlink,{Click:`Hyperlink_Click`},{default:n(()=>[h(i.Run,{Text:`{x:Bind Labels.appWindowTitleBar, Mode=OneWay}`})]),_:1}),h(i.Run,{Text:`{x:Bind Labels.sampleSuffix, Mode=OneWay}`})]),_:1})]),_:1}),h(i.ControlExample,{HorizontalContentAlignment:`Stretch`,HeaderText:`{x:Bind Labels.configurationHeader, Mode=OneWay}`,SampleDefinition:`TitleBar\\TitlebarConfiguration.txt`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind configurationXaml, Mode=OneWay}`},{default:n(()=>[h(i.ControlExample.Example,null,{default:n(()=>[h(i.Grid,{HorizontalAlignment:`Stretch`,VerticalAlignment:`Center`,Background:`{ThemeResource CardBackgroundFillColorDefaultBrush}`,BorderBrush:`{ThemeResource SurfaceStrokeColorDefaultBrush}`,BorderThickness:`1`,CornerRadius:`{StaticResource OverlayCornerRadius}`},{default:n(()=>[h(i.TitleBar,{"x:Name":`TitleBarControl`,Title:`{Binding ElementName=TitleBox, Path=Text, Mode=OneWay}`,Subtitle:`{Binding ElementName=SubtitleBox, Path=Text, Mode=OneWay}`,IsBackButtonVisible:`{Binding ElementName=BackButtonToggle, Path=IsOn, Mode=OneWay}`,IsPaneToggleButtonVisible:`{Binding ElementName=PaneToggle, Path=IsOn, Mode=OneWay}`,LayoutUpdated:`TitleBar_LayoutUpdated`},{default:n(()=>[h(i.TitleBar.Resources,null,{default:n(()=>[h(i.HorizontalAlignment,{"x:Key":`TitleBarContentHorizontalAlignment`},{default:n(()=>[...t[0]||=[b(`Stretch`,-1)]]),_:1})]),_:1}),h(i.TitleBar.IconSource,null,{default:n(()=>[h(i.ImageIconSource,{ImageSource:`https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/Tiles/GalleryIcon.ico`})]),_:1}),h(i.TitleBar.RightHeader,null,{default:n(()=>[h(i.PersonPicture,{Width:`30`,Height:`30`,Initials:`JD`})]),_:1}),h(i.TitleBar.Content,null,{default:n(()=>[h(i.AutoSuggestBox,{MaxWidth:`580`,HorizontalAlignment:`Stretch`,VerticalAlignment:`Center`,PlaceholderText:`{x:Bind Labels.search, Mode=OneWay}`,QueryIcon:`Find`})]),_:1})]),_:1})]),_:1})]),_:1}),h(i.ControlExample.Output),h(i.ControlExample.Options,null,{default:n(()=>[h(i.StackPanel,{Width:`240`,Orientation:`Vertical`,Spacing:`12`},{default:n(()=>[h(i.TextBox,{"x:Name":`TitleBox`,Header:`{x:Bind Labels.titleOption, Mode=OneWay}`,Text:`{x:Bind Labels.defaultTitle, Mode=OneWay}`}),h(i.TextBox,{"x:Name":`SubtitleBox`,Header:`{x:Bind Labels.subtitleOption, Mode=OneWay}`,Text:`{x:Bind Labels.defaultSubtitle, Mode=OneWay}`}),h(i.ToggleSwitch,{"x:Name":`BackButtonToggle`,Header:`{x:Bind Labels.backButtonOption, Mode=OneWay}`,IsOn:`False`}),h(i.ToggleSwitch,{"x:Name":`PaneToggle`,Header:`{x:Bind Labels.paneToggleOption, Mode=OneWay}`,IsOn:`False`})]),_:1})]),_:1}),h(i.ControlExample.Substitutions,null,{default:n(()=>[h(i.ControlExampleSubstitution,{Key:`Title`,Value:`{x:Bind TitleBox.Text, Mode=OneWay}`}),h(i.ControlExampleSubstitution,{Key:`Subtitle`,Value:`{x:Bind SubtitleBox.Text, Mode=OneWay}`}),h(i.ControlExampleSubstitution,{Key:`BackButtonVisibility`,Value:`{x:Bind BackButtonToggle.IsOn, Mode=OneWay}`}),h(i.ControlExampleSubstitution,{Key:`PaneToggleVisibility`,Value:`{x:Bind PaneToggle.IsOn, Mode=OneWay}`})]),_:1})]),_:1}),h(i.ControlExample,{HorizontalContentAlignment:`Stretch`,HeaderText:`{x:Bind Labels.dragHeader, Mode=OneWay}`,SampleDefinition:`TitleBar\\TitlebarDragRegions.txt`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind dragXaml, Mode=OneWay}`,CSharp:`{x:Bind dragCSharp, Mode=OneWay}`},{default:n(()=>[h(i.ControlExample.Example,null,{default:n(()=>[h(i.StackPanel,{MaxWidth:`560`,Orientation:`Vertical`,Spacing:`12`},{default:n(()=>[h(i.TextBlock,{HorizontalAlignment:`Center`,TextAlignment:`Center`,TextWrapping:`WrapWholeWords`,Text:`{x:Bind Labels.dragDescription, Mode=OneWay}`}),h(i.Button,{HorizontalAlignment:`Center`,Click:`CreateTitleBarDragRegionsWindowClick`,Content:`{x:Bind Labels.showWindow, Mode=OneWay}`,Style:`{StaticResource AccentButtonStyle}`})]),_:1})]),_:1}),h(i.ControlExample.Output,null,{default:n(()=>[h(i.TextBlock,{Text:`{x:Bind dragOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),h(i.ControlExample.Options)]),_:1}),h(i.ControlExample,{HorizontalContentAlignment:`Stretch`,HeaderText:`{x:Bind Labels.endToEndHeader, Mode=OneWay}`,SampleDefinition:`TitleBar\\EndEndTitlebarSample.txt`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind endToEndXaml, Mode=OneWay}`,CSharp:`{x:Bind endToEndCSharp, Mode=OneWay}`},{default:n(()=>[h(i.ControlExample.Example,null,{default:n(()=>[h(i.StackPanel,{MaxWidth:`560`,Orientation:`Vertical`,Spacing:`12`},{default:n(()=>[h(i.TextBlock,{HorizontalAlignment:`Center`,TextAlignment:`Center`,TextWrapping:`WrapWholeWords`,Text:`{x:Bind Labels.endToEndDescription, Mode=OneWay}`}),h(i.Button,{HorizontalAlignment:`Center`,Click:`CreateTitleBarWindowClick`,Content:`{x:Bind Labels.showWindow, Mode=OneWay}`,Style:`{StaticResource AccentButtonStyle}`})]),_:1})]),_:1}),h(i.ControlExample.Output,null,{default:n(()=>[h(i.TextBlock,{Text:`{x:Bind endToEndOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),h(i.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var G=d(U,[[`render`,W],[`__scopeId`,`data-v-875fabf4`],[`__file`,`TitleBarPage.vue`]]);export{G as default};