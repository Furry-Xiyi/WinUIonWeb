import{Cn as e,Di as t,Ei as n,Gi as r,I as i,Jr as a,Ki as o,Li as s,Lt as c,Mn as l,On as u,Q as d,Tr as f,Wt as p,Z as m,_i as h,a as ee,ai as g,cr as _,et as te,fi as v,mi as y,o as ne,pi as b,si as x,sr as re,t as ie,xi as ae}from"./ScrollViewer-BWDA_C78.js";import{t as oe}from"./TextBox-nJJxRp_z.js";import{t as S}from"./AutoSuggestBox-DK-_XpP5.js";import{t as C}from"./Button-BNDPNdYJ.js";import{t as se}from"./ComboBox-c_LaT8fC.js";import{t as ce}from"./inlineControlProperties-CBoqGJWv.js";import{i as le}from"./IconSource-DSXv8-vT.js";import{t as ue}from"./StackPanel-sg_Bd5oB.js";import{t as de}from"./PersonPicture-BrRaRj4M.js";import{t as fe}from"./RichTextBlock-BCLxH7DW.js";import{i as pe}from"./systemBackdropHostAdapter-CEQZ7CSN.js";import{d as me,f as w,l as T,n as E,o as D,u as O}from"./mountSystemBackdropsWindow-BRyMRQOX.js";import{t as k}from"./ToggleButton-HP5wmrvH.js";import{t as A}from"./ToggleSwitch-DmoyCBpS.js";import{i as j,n as M,t as N}from"./TitleBarWindow-BKvASiJH.js";import{a as P,t as F}from"./ControlExample-CzGyf8u0.js";import{t as I}from"./pageState-CcJibQcm.js";var L=(e,t,n,r)=>{let i=E(e,t,{Kind:n,locale:r,allowedBackdrops:[]});if(i)return i;let o=a(n===`TitleBarDragRegions`?M:N,{handle:t});o.component(`x:Double`,f),o.provide(d,m(r,{"en-US":O,"zh-CN":T}));let s=new AbortController,c=!1,l=!1,u,p={},h=()=>{c||(c=!0,s.abort(),p.Stop?.(),l&&o.unmount(),u?.())};return p.Stop=t.Subscribe(e=>{e.Status===`Closed`&&h()}),c&&p.Stop(),w(t.TitleBarHost,{ExtendsContentIntoTitleBar:!0,PreferredHeightOption:`Tall`},s.signal).then(()=>{c||t.State.Status===`Closed`||(u=D(e,t.TitleBarHost),o.mount(e),l=!0)}).catch(n=>{c||(e.ownerDocument.defaultView?.console.error(n),h(),t.Close().catch(t=>e.ownerDocument.defaultView?.console.error(t)))}),h},R=`--- header
TitleBar configuration
--- xaml
<TitleBar
    PreferredHeightOption="Tall"
    Title="$(Title)"
    Subtitle="$(Subtitle)"
    IsBackButtonVisible="$(BackButtonVisibility)"
    IsPaneToggleButtonVisible="$(PaneToggleVisibility)"
    IsCaptionButtonsVisible="$(CaptionButtonsVisibility)"
    CaptionButtonsFramework="$(CaptionButtonsFramework)"
    CaptionButtonRequested="TitleBar_CaptionButtonRequested">
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
</TitleBar>
`,z=`--- header
TitleBar drag regions
--- xaml
<!-- Starting with WindowsAppSDK 2.1, TitleBar walks TitleBar.Content,
     auto-excludes interactive controls from the drag region, and lets
     non-interactive visuals (and empty space) remain draggable.

     Use TitleBar.IsDragRegion to override the framework decision:
       True   -> always draggable
       False  -> always clickable
       unset  -> framework decides (default) -->
<TitleBar x:Name="titleBar" PreferredHeightOption="Tall" Title="Drag regions">
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
`,B=`--- header
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
        PreferredHeightOption="Tall"
        BackRequested="TitleBar_BackRequested"
        IsBackButtonVisible="{x:Bind navFrame.CanGoBack, Mode=OneWay}"
        IsPaneToggleButtonVisible="True"
        IsPaneOpen="{x:Bind navView.IsPaneOpen, Mode=OneWay}"
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
  this.SetTitleBar(titleBar); // Set the custom title bar
`,V=y({__name:`TitleBarPage`,setup(n,{expose:a}){a();let s=y({name:`HorizontalAlignment`,__xamlPrimitive:`HorizontalAlignment`,setup:()=>()=>null}),d=te(),{t:f}=d,p=h(`currentPage`),{isFavoriteState:m,pageTheme:v,toggleTheme:b,toggleFavorite:x}=I(p?.value||`titlebar`),w=g(()=>({title:f(`text.titlebar`),toggleTheme:f(`gallery.page-header.toggle-theme`),favorite:f(m.value?`gallery.remove-favorite`:`gallery.add-favorite`),customizationIntro:f(`sample.titlebar.customization-intro`),appWindowTitleBar:f(`sample.titlebar.app-window-title-bar`),sampleSuffix:f(`sample.titlebar.sample-suffix`),configurationHeader:f(`sample.titlebar.configuration-header`),dragHeader:f(`sample.titlebar.drag-header`),endToEndHeader:f(`sample.titlebar.end-to-end-header`),search:f(`sample.titlebar.search`),titleOption:f(`sample.titlebar.title-option`),subtitleOption:f(`sample.titlebar.subtitle-option`),defaultTitle:f(`sample.titlebar.default-title`),defaultSubtitle:f(`sample.titlebar.default-subtitle`),backButtonOption:f(`sample.titlebar.back-button-option`),paneToggleOption:f(`sample.titlebar.pane-toggle-option`),captionButtonsOption:f(`sample.titlebar.caption-buttons-option`),captionFrameworkOption:f(`sample.titlebar.caption-framework-option`),captionFrameworkManual:f(`sample.titlebar.caption-framework-manual`),captionFrameworkTauri:f(`sample.titlebar.caption-framework-tauri`),captionFrameworkElectron:f(`sample.titlebar.caption-framework-electron`),dragDescription:f(`sample.titlebar.drag-description`),endToEndDescription:f(`sample.titlebar.end-to-end-description`),showWindow:f(`sample.systembackdrops.show-window`)})),T=g(()=>m.value?``:``),E=o({}),D=(e,t)=>e.match(RegExp(`(?:^|\\r?\\n)--- `+t+`\\r?\\n([\\s\\S]*?)(?=\\r?\\n--- |$)`))?.[1]?.trim()??``,O=D(R,`xaml`),M=D(z,`xaml`),N=D(z,`c#`),V=D(B,`xaml`),H=D(B,`c#`),U=r(``),W=r(``),G=r(f(`sample.titlebar.caption-buttons-manual`)),K=new Set;ae(()=>{K.forEach(e=>e()),K.clear()});let q=async e=>{let t=e===`TitleBarDragRegions`?U:W;try{let n=(await pe({title:f(e===`TitleBarDragRegions`?`sample.titlebar.drag-window-title`:`sample.titlebar.end-window-title`),width:1e3,height:700,theme:`Default`,backdrop:{Type:`Mica`,Kind:`Base`},mountContent:(t,n)=>L(t,n,e,d.locale)})).Subscribe(e=>{t.value=f(e.Status===`Closed`?`sample.systembackdrops.closed`:e.Reason===`NativeBackdropUnavailable`?`sample.titlebar.browser-host-unavailable`:`sample.systembackdrops.window-opened`)});K.add(n)}catch(e){t.value=f(e.Code===`PopupBlocked`?`sample.systembackdrops.popup-blocked`:`sample.systembackdrops.window-failed`)}},J=()=>q(`TitleBarDragRegions`),Y=()=>q(`TitleBarEndToEnd`),X=e=>{G.value=f(`sample.titlebar.caption-buttons-requested`,{button:e})},Z=()=>{j(window,v.value,document.getElementById(`app`)??void 0)},Q=()=>{window.open(`https://github.com/microsoft/WinUI-Gallery/tree/main/WinUIGallery/Samples/AppWindowTitleBar`,`_blank`,`noopener`)};t(re,E),t(_,{Labels:w,favoriteGlyph:T,isFavoriteState:m,pageTheme:v,toggleTheme:b,toggleFavorite:x,configurationXaml:O,dragXaml:M,dragCSharp:N,endToEndXaml:V,endToEndCSharp:H,dragOutput:U,endToEndOutput:W,captionButtonOutput:G,CreateTitleBarDragRegionsWindowClick:J,CreateTitleBarWindowClick:Y,TitleBar_LayoutUpdated:Z,TitleBar_CaptionButtonRequested:X,Hyperlink_Click:Q});let $={HorizontalAlignment:s,i18n:d,t:f,currentPage:p,isFavoriteState:m,pageTheme:v,toggleTheme:b,toggleFavorite:x,Labels:w,favoriteGlyph:T,names:E,section:D,configurationXaml:O,dragXaml:M,dragCSharp:N,endToEndXaml:V,endToEndCSharp:H,dragOutput:U,endToEndOutput:W,captionButtonOutput:G,subscriptions:K,openSample:q,CreateTitleBarDragRegionsWindowClick:J,CreateTitleBarWindowClick:Y,TitleBar_CaptionButtonRequested:X,TitleBar_LayoutUpdated:Z,Hyperlink_Click:Q,AutoSuggestBox:S,Button:C,ComboBox:se,ControlExample:F,FontIcon:ee,Grid:c,Page:i,PersonPicture:de,RichTextBlock:fe,ScrollViewer:ie,StackPanel:ue,TextBlock:ne,TextBox:oe,TitleBar:me,ToggleButton:k,ToggleSwitch:A,get ComboBoxItem(){return ce},get ImageIconSource(){return le},get Hyperlink(){return e},get Paragraph(){return u},get Run(){return l},get ControlExampleSubstitution(){return P}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function H(e,t,r,i,a,o){return n(),x(i.Page,null,{default:s(()=>[b(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollMode:`Auto`,VerticalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Disabled`,HorizontalScrollBarVisibility:`Disabled`},{default:s(()=>[b(i.StackPanel,{class:`gallery-item-page`},{default:s(()=>[b(i.StackPanel,{class:`page-heading`},{default:s(()=>[b(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.title, Mode=OneWay}`}),b(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:s(()=>[b(i.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind Labels.toggleTheme, Mode=OneWay}`},{default:s(()=>[b(i.FontIcon,{Glyph:``})]),_:1}),b(i.ToggleButton,{class:`header-action`,Click:`toggleFavorite`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.favorite, Mode=OneWay}`},{default:s(()=>[b(i.FontIcon,{Glyph:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),b(i.StackPanel,{class:`gallery-page-content`,Margin:`0,12,0,0`},{default:s(()=>[b(i.RichTextBlock,null,{default:s(()=>[b(i.Paragraph,null,{default:s(()=>[b(i.Run,{Text:`{x:Bind Labels.customizationIntro, Mode=OneWay}`}),b(i.Hyperlink,{Click:`Hyperlink_Click`},{default:s(()=>[b(i.Run,{Text:`{x:Bind Labels.appWindowTitleBar, Mode=OneWay}`})]),_:1}),b(i.Run,{Text:`{x:Bind Labels.sampleSuffix, Mode=OneWay}`})]),_:1})]),_:1}),b(i.ControlExample,{class:`titlebar-configuration-example`,HorizontalContentAlignment:`Stretch`,HeaderText:`{x:Bind Labels.configurationHeader, Mode=OneWay}`,SampleDefinition:`TitleBar\\TitlebarConfiguration.txt`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind configurationXaml, Mode=OneWay}`},{default:s(()=>[b(i.ControlExample.Example,null,{default:s(()=>[b(i.Grid,{class:`titlebar-sample-card`,Width:`100%`,MinWidth:`0`,HorizontalAlignment:`Stretch`,VerticalAlignment:`Center`,Background:`{ThemeResource CardBackgroundFillColorDefaultBrush}`,BorderBrush:`{ThemeResource SurfaceStrokeColorDefaultBrush}`,BorderThickness:`1`,CornerRadius:`{StaticResource OverlayCornerRadius}`},{default:s(()=>[b(i.TitleBar,{"x:Name":`TitleBarControl`,Width:`100%`,MinWidth:`0`,HorizontalAlignment:`Stretch`,PreferredHeightOption:`Tall`,Title:`{Binding ElementName=TitleBox, Path=Text, Mode=OneWay}`,Subtitle:`{Binding ElementName=SubtitleBox, Path=Text, Mode=OneWay}`,IsBackButtonVisible:`{Binding ElementName=BackButtonToggle, Path=IsOn, Mode=OneWay}`,IsPaneToggleButtonVisible:`{Binding ElementName=PaneToggle, Path=IsOn, Mode=OneWay}`,IsCaptionButtonsVisible:`{Binding ElementName=CaptionButtonsToggle, Path=IsOn, Mode=OneWay}`,CaptionButtonsFramework:`{Binding ElementName=CaptionFramework, Path=SelectedValue, Mode=OneWay}`,CaptionButtonRequested:`TitleBar_CaptionButtonRequested`,LayoutUpdated:`TitleBar_LayoutUpdated`},{default:s(()=>[b(i.TitleBar.Resources,null,{default:s(()=>[b(i.HorizontalAlignment,{"x:Key":`TitleBarContentHorizontalAlignment`},{default:s(()=>[...t[0]||=[v(`Stretch`,-1)]]),_:1})]),_:1}),b(i.TitleBar.IconSource,null,{default:s(()=>[b(i.ImageIconSource,{ImageSource:`https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/Tiles/GalleryIcon.ico`})]),_:1}),b(i.TitleBar.RightHeader,null,{default:s(()=>[b(i.PersonPicture,{Width:`30`,Height:`30`,Initials:`JD`})]),_:1}),b(i.TitleBar.Content,null,{default:s(()=>[b(i.AutoSuggestBox,{MaxWidth:`580`,HorizontalAlignment:`Stretch`,VerticalAlignment:`Center`,PlaceholderText:`{x:Bind Labels.search, Mode=OneWay}`,QueryIcon:`Find`})]),_:1})]),_:1})]),_:1})]),_:1}),b(i.ControlExample.Output,null,{default:s(()=>[b(i.TextBlock,{Text:`{x:Bind captionButtonOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),b(i.ControlExample.Options,null,{default:s(()=>[b(i.StackPanel,{Width:`240`,Orientation:`Vertical`,Spacing:`12`},{default:s(()=>[b(i.TextBox,{"x:Name":`TitleBox`,Header:`{x:Bind Labels.titleOption, Mode=OneWay}`,Text:`{x:Bind Labels.defaultTitle, Mode=OneWay}`}),b(i.TextBox,{"x:Name":`SubtitleBox`,Header:`{x:Bind Labels.subtitleOption, Mode=OneWay}`,Text:`{x:Bind Labels.defaultSubtitle, Mode=OneWay}`}),b(i.ToggleSwitch,{"x:Name":`BackButtonToggle`,Header:`{x:Bind Labels.backButtonOption, Mode=OneWay}`,IsOn:`False`}),b(i.ToggleSwitch,{"x:Name":`PaneToggle`,Header:`{x:Bind Labels.paneToggleOption, Mode=OneWay}`,IsOn:`False`}),b(i.ToggleSwitch,{"x:Name":`CaptionButtonsToggle`,Header:`{x:Bind Labels.captionButtonsOption, Mode=OneWay}`,IsOn:`False`}),b(i.ComboBox,{"x:Name":`CaptionFramework`,Header:`{x:Bind Labels.captionFrameworkOption, Mode=OneWay}`,SelectedIndex:`0`,SelectedValuePath:`Tag`,IsEnabled:`{Binding ElementName=CaptionButtonsToggle, Path=IsOn, Mode=OneWay}`},{default:s(()=>[b(i.ComboBoxItem,{Content:`{x:Bind Labels.captionFrameworkManual, Mode=OneWay}`,Tag:``}),b(i.ComboBoxItem,{Content:`{x:Bind Labels.captionFrameworkTauri, Mode=OneWay}`,Tag:`Tauri`}),b(i.ComboBoxItem,{Content:`{x:Bind Labels.captionFrameworkElectron, Mode=OneWay}`,Tag:`Electron`})]),_:1})]),_:1})]),_:1}),b(i.ControlExample.Substitutions,null,{default:s(()=>[b(i.ControlExampleSubstitution,{Key:`Title`,Value:`{x:Bind TitleBox.Text, Mode=OneWay}`}),b(i.ControlExampleSubstitution,{Key:`Subtitle`,Value:`{x:Bind SubtitleBox.Text, Mode=OneWay}`}),b(i.ControlExampleSubstitution,{Key:`BackButtonVisibility`,Value:`{x:Bind BackButtonToggle.IsOn, Mode=OneWay}`}),b(i.ControlExampleSubstitution,{Key:`PaneToggleVisibility`,Value:`{x:Bind PaneToggle.IsOn, Mode=OneWay}`}),b(i.ControlExampleSubstitution,{Key:`CaptionButtonsVisibility`,Value:`{x:Bind CaptionButtonsToggle.IsOn, Mode=OneWay}`}),b(i.ControlExampleSubstitution,{Key:`CaptionButtonsFramework`,Value:`{x:Bind CaptionFramework.SelectedValue, Mode=OneWay}`})]),_:1})]),_:1}),b(i.ControlExample,{HorizontalContentAlignment:`Stretch`,HeaderText:`{x:Bind Labels.dragHeader, Mode=OneWay}`,SampleDefinition:`TitleBar\\TitlebarDragRegions.txt`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind dragXaml, Mode=OneWay}`,CSharp:`{x:Bind dragCSharp, Mode=OneWay}`},{default:s(()=>[b(i.ControlExample.Example,null,{default:s(()=>[b(i.StackPanel,{MaxWidth:`560`,Orientation:`Vertical`,Spacing:`12`},{default:s(()=>[b(i.TextBlock,{HorizontalAlignment:`Center`,TextAlignment:`Center`,TextWrapping:`WrapWholeWords`,Text:`{x:Bind Labels.dragDescription, Mode=OneWay}`}),b(i.Button,{HorizontalAlignment:`Center`,Click:`CreateTitleBarDragRegionsWindowClick`,Content:`{x:Bind Labels.showWindow, Mode=OneWay}`,Style:`{StaticResource AccentButtonStyle}`})]),_:1})]),_:1}),b(i.ControlExample.Output,null,{default:s(()=>[b(i.TextBlock,{Text:`{x:Bind dragOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),b(i.ControlExample.Options)]),_:1}),b(i.ControlExample,{HorizontalContentAlignment:`Stretch`,HeaderText:`{x:Bind Labels.endToEndHeader, Mode=OneWay}`,SampleDefinition:`TitleBar\\EndEndTitlebarSample.txt`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind endToEndXaml, Mode=OneWay}`,CSharp:`{x:Bind endToEndCSharp, Mode=OneWay}`},{default:s(()=>[b(i.ControlExample.Example,null,{default:s(()=>[b(i.StackPanel,{MaxWidth:`560`,Orientation:`Vertical`,Spacing:`12`},{default:s(()=>[b(i.TextBlock,{HorizontalAlignment:`Center`,TextAlignment:`Center`,TextWrapping:`WrapWholeWords`,Text:`{x:Bind Labels.endToEndDescription, Mode=OneWay}`}),b(i.Button,{HorizontalAlignment:`Center`,Click:`CreateTitleBarWindowClick`,Content:`{x:Bind Labels.showWindow, Mode=OneWay}`,Style:`{StaticResource AccentButtonStyle}`})]),_:1})]),_:1}),b(i.ControlExample.Output,null,{default:s(()=>[b(i.TextBlock,{Text:`{x:Bind endToEndOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),b(i.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var U=p(V,[[`render`,H],[`__scopeId`,`data-v-512d568f`],[`__file`,`TitleBarPage.vue`]]);export{U as default};