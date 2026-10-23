import{Di as e,Dn as t,Ei as n,Gi as r,I as i,Ki as a,Li as o,Mn as s,Wt as c,_i as l,a as u,ai as d,cr as f,et as p,mi as m,o as h,pi as g,si as _,sr as v,t as y,xi as b}from"./ScrollViewer-BWDA_C78.js";import{t as x}from"./Button-BNDPNdYJ.js";import{t as S}from"./StackPanel-sg_Bd5oB.js";import{i as C}from"./systemBackdropHostAdapter-CEQZ7CSN.js";import{t as w}from"./mountSystemBackdropsWindow-BRyMRQOX.js";import{t as T}from"./ToggleButton-HP5wmrvH.js";import{t as E}from"./ControlExample-CzGyf8u0.js";import{t as D}from"./pageState-CcJibQcm.js";var O=`--- header
Backdrop types
--- xaml
<!-- Mica -->
<Window.SystemBackdrop>
    <MicaBackdrop/>
</Window.SystemBackdrop>
                    
<!-- Mica Alt -->
<Window.SystemBackdrop>
    <MicaBackdrop Kind="BaseAlt"/>
</Window.SystemBackdrop>

<!-- Acrylic -->
<Window.SystemBackdrop>
    <DesktopAcrylicBackdrop/>
</Window.SystemBackdrop>
--- c#
bool TrySetMicaBackdrop(bool useMicaAlt)
{
    if (SystemBackdrops.MicaController.IsSupported())
    {
        MicaBackdrop micaBackdrop = new MicaBackdrop();
        micaBackdrop.Kind = useMicaAlt ? MicaKind.BaseAlt : MicaKind.Base;
        SystemBackdrop = micaBackdrop;

        return true; // Succeeded.
    }

    return false; // Mica is not supported on this system.
}

bool TrySetDesktopAcrylicBackdrop()
{
    if (DesktopAcrylicController.IsSupported())
    {
        DesktopAcrylicBackdrop DesktopAcrylicBackdrop = new DesktopAcrylicBackdrop();
        SystemBackdrop = DesktopAcrylicBackdrop;

        return true; // Succeeded.
    }

    return false; // DesktopAcrylic is not supported on this system.
}
`,k=`--- header
MicaController
--- c#
using System.Runtime.InteropServices;
using WinRT;
using Microsoft.UI.Composition;
using Microsoft.UI.Composition.SystemBackdrops;

MicaController micaController;
SystemBackdropConfiguration configurationSource;

bool TrySetMicaBackdrop(bool useMicaAlt)
{
    if (MicaController.IsSupported())
    {
        DispatcherQueue.EnsureSystemDispatcherQueue();

        // Hooking up the policy object
        configurationSource = new SystemBackdropConfiguration();
        Activated += Window_Activated;
        Closed += Window_Closed;
        ((FrameworkElement)Content).ActualThemeChanged += Window_ThemeChanged;

        // Initial configuration state.
        configurationSource.IsInputActive = true;
        SetConfigurationSourceTheme();

        micaController = new MicaController();
        micaController.Kind = useMicaAlt ? MicaKind.BaseAlt : MicaKind.Base;

        // Enable the system backdrop.
        micaController.AddSystemBackdropTarget(this.As<ICompositionSupportsSystemBackdrop>());
        micaController.SetSystemBackdropConfiguration(configurationSource);
        return true; // Succeeded.
    }

    return false; // Mica is not supported on this system.
}

private void Window_Activated(object sender, WindowActivatedEventArgs args)
{
    configurationSource.IsInputActive = args.WindowActivationState != WindowActivationState.Deactivated;
}

private void Window_Closed(object sender, WindowEventArgs args)
{
    // Make sure any Mica/Acrylic controller is disposed
    if (micaController != null)
    {
        micaController.Dispose();
        micaController = null;
    }
    this.Activated -= Window_Activated;
    configurationSource = null;
}

private void Window_ThemeChanged(FrameworkElement sender, object args)
{
    if (configurationSource != null)
    {
        SetConfigurationSourceTheme();
    }
}

private void SetConfigurationSourceTheme()
{
    switch (((FrameworkElement)Content).ActualTheme)
    {
        case ElementTheme.Dark:    configurationSource.Theme = SystemBackdropTheme.Dark; break;
        case ElementTheme.Light:   configurationSource.Theme = SystemBackdropTheme.Light; break;
        case ElementTheme.Default: configurationSource.Theme = SystemBackdropTheme.Default; break;
    }
}`,A=`--- header
DesktopAcrylicController
--- c#
using System.Runtime.InteropServices;
using WinRT;
using Microsoft.UI.Composition;
using Microsoft.UI.Composition.SystemBackdrops;

SystemBackdrops.DesktopAcrylicController acrylicController;
SystemBackdrops.SystemBackdropConfiguration configurationSource;

bool TrySetAcrylicBackdrop(bool useAcrylicThin)
{
    if (DesktopAcrylicController.IsSupported())
    {
        DispatcherQueue.EnsureSystemDispatcherQueue();

        // Hooking up the policy object
        configurationSource = new SystemBackdropConfiguration();
        Activated += Window_Activated;
        Closed += Window_Closed;
        ((FrameworkElement)Content).ActualThemeChanged += Window_ThemeChanged;

        // Initial configuration state.
        configurationSource.IsInputActive = true;
        SetConfigurationSourceTheme();

        acrylicController = new DesktopAcrylicController();
        acrylicController.Kind = useAcrylicThin ? DesktopAcrylicKind.Thin : DesktopAcrylicKind.Base;

        // Enable the system backdrop.
        acrylicController.AddSystemBackdropTarget(As<ICompositionSupportsSystemBackdrop>());
        acrylicController.SetSystemBackdropConfiguration(configurationSource);
        return true; // Succeeded.
    }

    return false; // Acrylic is not supported on this system.
}

private void Window_Activated(object sender, WindowActivatedEventArgs args)
{
    configurationSource.IsInputActive = args.WindowActivationState != WindowActivationState.Deactivated;
}

private void Window_Closed(object sender, WindowEventArgs args)
{
    // Make sure any Mica/Acrylic controller is disposed
    if (acrylicController != null)
    {
        acrylicController.Dispose();
        acrylicController = null;
    }
    Activated -= Window_Activated;
    configurationSource = null;
}

private void Window_ThemeChanged(FrameworkElement sender, object args)
{
    if (configurationSource != null)
    {
        SetConfigurationSourceTheme();
    }
}

private void SetConfigurationSourceTheme()
{
    switch (((FrameworkElement)this.Content).ActualTheme)
    {
        case ElementTheme.Dark:    configurationSource.Theme = SystemBackdropTheme.Dark; break;
        case ElementTheme.Light:   configurationSource.Theme = SystemBackdropTheme.Light; break;
        case ElementTheme.Default: configurationSource.Theme = SystemBackdropTheme.Default; break;
    }
}`,j=m({__name:`SystemBackdrops(MicaAcrylic)Page`,setup(n,{expose:o}){o();let c=l(`currentPage`),{isFavoriteState:m,pageTheme:g,toggleTheme:_,toggleFavorite:j}=D(c?.value||`systembackdrops`),M=p(),{t:N}=M,P=d(()=>({title:N(`catalog.item.systembackdrops.title`),description:N(`catalog.item.systembackdrops.subtitle`),toggleTheme:N(`gallery.page-header.toggle-theme`),typesHeader:N(`sample.systembackdrops.types-header`),micaHeader:N(`sample.systembackdrops.mica-header`),acrylicHeader:N(`sample.systembackdrops.acrylic-header`),showWindow:N(`sample.systembackdrops.show-window`),typesIntro:N(`sample.systembackdrops.types-intro`),micaName:N(`sample.systembackdrops.mica-name`),micaDescription:N(`sample.systembackdrops.mica-description`),micaAltName:N(`sample.systembackdrops.mica-alt-name`),micaAltDescription:N(`sample.systembackdrops.mica-alt-description`),acrylicName:N(`sample.systembackdrops.acrylic-name`),acrylicDescription:N(`sample.systembackdrops.acrylic-description`),acrylicThinName:N(`sample.systembackdrops.acrylic-thin-name`),acrylicThinDescription:N(`sample.systembackdrops.acrylic-thin-description`),comparisonTitle:N(`sample.systembackdrops.comparison-title`),comparisonDescription:N(`sample.systembackdrops.comparison-description`),apiIntro:N(`sample.systembackdrops.api-intro`),apiSystemName:N(`sample.systembackdrops.api-system-name`),apiSystemDescription:N(`sample.systembackdrops.api-system-description`),apiMicaName:N(`sample.systembackdrops.api-mica-name`),apiMicaDescription:N(`sample.systembackdrops.api-mica-description`),apiAcrylicName:N(`sample.systembackdrops.api-acrylic-name`),apiAcrylicDescription:N(`sample.systembackdrops.api-acrylic-description`),requirements:N(`sample.systembackdrops.requirements`),micaControllerDescription:N(`sample.systembackdrops.mica-controller-description`),micaKindsIntro:N(`sample.systembackdrops.mica-kinds-intro`),micaBaseName:N(`sample.systembackdrops.mica-base-name`),micaBaseDescription:N(`sample.systembackdrops.mica-base-description`),micaControllerAltName:N(`sample.systembackdrops.mica-controller-alt-name`),micaControllerAltDescription:N(`sample.systembackdrops.mica-controller-alt-description`),acrylicControllerDescription:N(`sample.systembackdrops.acrylic-controller-description`),acrylicKindsIntro:N(`sample.systembackdrops.acrylic-kinds-intro`),acrylicBaseName:N(`sample.systembackdrops.acrylic-base-name`),acrylicBaseDescription:N(`sample.systembackdrops.acrylic-base-description`),acrylicControllerThinName:N(`sample.systembackdrops.acrylic-controller-thin-name`),acrylicControllerThinDescription:N(`sample.systembackdrops.acrylic-controller-thin-description`),acrylicControllerNote:N(`sample.systembackdrops.acrylic-controller-note`)})),F=d(()=>N(m.value?`gallery.remove-favorite`:`gallery.add-favorite`)),I=d(()=>m.value?``:``),L=r(``),R=r(``),z=r(``),B=new Set;b(()=>{B.forEach(e=>e()),B.clear()});let V=(e,t)=>e.match(RegExp(`(?:^|\\r?\\n)--- `+t+`\\r?\\n([\\s\\S]*?)(?=\\r?\\n--- |$)`))?.[1]?.trim()??``,H=V(O,`xaml`),U=V(O,`c#`),W=V(k,`c#`),G=V(A,`c#`),K=e=>e.Status===`Closed`?N(`sample.systembackdrops.closed`):e.Status===`HighContrast`?N(`sample.systembackdrops.high-contrast`):e.Status===`Fallback`?N(e.Reason===`Inactive`?`sample.systembackdrops.inactive`:e.Reason===`MaterialUnsupported`?`sample.systembackdrops.effect-unavailable`:e.Reason===`TransparencyDisabled`?`sample.systembackdrops.transparency-disabled`:e.Reason===`EnergySaver`?`sample.systembackdrops.energy-saver`:e.Reason===`HostError`?`sample.systembackdrops.operation-failed`:`sample.systembackdrops.native-unavailable`):N(`sample.systembackdrops.applied`,{backdrop:N(`sample.systembackdrops.backdrop.${e.AppliedBackdrop?.Type===`DesktopAcrylic`?e.AppliedBackdrop.Kind===`Thin`?`acrylic-thin`:`acrylic`:e.AppliedBackdrop?.Kind===`BaseAlt`?`mica-alt`:e.AppliedBackdrop?`mica`:`none`}`)}),q=async e=>{let t=e===`builtIn`?L:e===`mica`?R:z,n=e===`builtIn`?[`Mica`,`MicaAlt`,`Acrylic`,`None`]:e===`mica`?[`Mica`,`MicaAlt`,`None`]:[`Acrylic`,`AcrylicThin`,`None`];try{let r=await C({title:N(`sample.systembackdrops.window-title`),width:640,height:480,theme:`Default`,backdrop:e===`acrylic`?{Type:`DesktopAcrylic`,Kind:`Base`}:{Type:`Mica`,Kind:`Base`},mountContent:(e,t)=>w(e,t,n,M.locale)}),i;i=r.Subscribe(e=>{t.value=K(e),e.Status===`Closed`&&i&&(i(),B.delete(i))}),r.State.Status!==`Closed`&&B.add(i)}catch(e){let n=e?.Code;t.value=N(n===`PopupBlocked`?`sample.systembackdrops.popup-blocked`:n===`HostUnavailable`?`sample.systembackdrops.window-unavailable`:`sample.systembackdrops.window-failed`)}},J=()=>q(`builtIn`),Y=()=>q(`mica`),X=()=>q(`acrylic`);e(v,a({})),e(f,{Labels:P,FavoriteLabel:F,FavoriteGlyph:I,isFavoriteState:m,pageTheme:g,toggleTheme:_,toggleFavorite:j,backdropTypesXaml:H,backdropTypesCSharp:U,micaControllerCSharp:W,desktopAcrylicControllerCSharp:G,BuiltInOutput:L,MicaOutput:R,AcrylicOutput:z,createBuiltInWindow_Click:J,createCustomMicaWindow_Click:Y,createCustomDesktopAcrylicWindow_Click:X});let Z={currentPage:c,isFavoriteState:m,pageTheme:g,toggleTheme:_,toggleFavorite:j,i18n:M,t:N,Labels:P,FavoriteLabel:F,FavoriteGlyph:I,BuiltInOutput:L,MicaOutput:R,AcrylicOutput:z,outputSubscriptions:B,sampleSection:V,backdropTypesXaml:H,backdropTypesCSharp:U,micaControllerCSharp:W,desktopAcrylicControllerCSharp:G,outputForState:K,openSample:q,createBuiltInWindow_Click:J,createCustomMicaWindow_Click:Y,createCustomDesktopAcrylicWindow_Click:X,Button:x,ControlExample:E,FontIcon:u,Page:i,ScrollViewer:y,StackPanel:S,TextBlock:h,ToggleButton:T,get Run(){return s},get LineBreak(){return t}};return Object.defineProperty(Z,"__isScriptSetup",{enumerable:!1,value:!0}),Z}});function M(e,t,r,i,a,s){return n(),_(i.Page,null,{default:o(()=>[g(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`,HorizontalScrollBarVisibility:`Disabled`,HorizontalScrollMode:`Disabled`},{default:o(()=>[g(i.StackPanel,{class:`gallery-item-page`},{default:o(()=>[g(i.StackPanel,{class:`page-heading`},{default:o(()=>[g(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.title, Mode=OneWay}`}),g(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),g(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:o(()=>[g(i.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind Labels.toggleTheme, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.toggleTheme, Mode=OneWay}`},{default:o(()=>[g(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),g(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:o(()=>[g(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),g(i.StackPanel,{class:`gallery-page-content`},{default:o(()=>[g(i.ControlExample,{SampleDefinition:`SystemBackdrops\\SystemBackdropsBackdropTypes.txt`,HeaderText:`{x:Bind Labels.typesHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind backdropTypesXaml, Mode=OneWay}`,CSharp:`{x:Bind backdropTypesCSharp, Mode=OneWay}`},{default:o(()=>[g(i.ControlExample.Example,null,{default:o(()=>[g(i.StackPanel,{class:`system-backdrop-example`},{default:o(()=>[g(i.TextBlock,{TextWrapping:`WrapWholeWords`},{default:o(()=>[g(i.Run,{Text:`{x:Bind Labels.typesIntro, Mode=OneWay}`}),g(i.LineBreak),g(i.Run,{FontWeight:`Bold`,Text:`{x:Bind Labels.micaName, Mode=OneWay}`}),g(i.Run,{Text:`{x:Bind Labels.micaDescription, Mode=OneWay}`}),g(i.LineBreak),g(i.Run,{FontWeight:`Bold`,Text:`{x:Bind Labels.micaAltName, Mode=OneWay}`}),g(i.Run,{Text:`{x:Bind Labels.micaAltDescription, Mode=OneWay}`}),g(i.LineBreak),g(i.Run,{FontWeight:`Bold`,Text:`{x:Bind Labels.acrylicName, Mode=OneWay}`}),g(i.Run,{Text:`{x:Bind Labels.acrylicDescription, Mode=OneWay}`}),g(i.LineBreak),g(i.Run,{FontWeight:`Bold`,Text:`{x:Bind Labels.acrylicThinName, Mode=OneWay}`}),g(i.Run,{Text:`{x:Bind Labels.acrylicThinDescription, Mode=OneWay}`}),g(i.LineBreak),g(i.LineBreak),g(i.Run,{FontWeight:`Bold`,Text:`{x:Bind Labels.comparisonTitle, Mode=OneWay}`}),g(i.Run,{Text:`{x:Bind Labels.comparisonDescription, Mode=OneWay}`}),g(i.LineBreak),g(i.LineBreak),g(i.Run,{Text:`{x:Bind Labels.apiIntro, Mode=OneWay}`}),g(i.LineBreak),g(i.Run,{FontWeight:`Bold`,Text:`{x:Bind Labels.apiSystemName, Mode=OneWay}`}),g(i.Run,{Text:`{x:Bind Labels.apiSystemDescription, Mode=OneWay}`}),g(i.LineBreak),g(i.Run,{FontWeight:`Bold`,Text:`{x:Bind Labels.apiMicaName, Mode=OneWay}`}),g(i.Run,{Text:`{x:Bind Labels.apiMicaDescription, Mode=OneWay}`}),g(i.LineBreak),g(i.Run,{FontWeight:`Bold`,Text:`{x:Bind Labels.apiAcrylicName, Mode=OneWay}`}),g(i.Run,{Text:`{x:Bind Labels.apiAcrylicDescription, Mode=OneWay}`}),g(i.LineBreak),g(i.LineBreak),g(i.Run,{Text:`{x:Bind Labels.requirements, Mode=OneWay}`})]),_:1}),g(i.Button,{Margin:`0,10,0,0`,HorizontalAlignment:`Left`,Click:`createBuiltInWindow_Click`,Content:`{x:Bind Labels.showWindow, Mode=OneWay}`})]),_:1})]),_:1}),g(i.ControlExample.Output,null,{default:o(()=>[g(i.TextBlock,{Text:`{x:Bind BuiltInOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),g(i.ControlExample.Options)]),_:1}),g(i.ControlExample,{SampleDefinition:`SystemBackdrops\\SystemBackdropsMicacontroller.txt`,HeaderText:`{x:Bind Labels.micaHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,CSharp:`{x:Bind micaControllerCSharp, Mode=OneWay}`},{default:o(()=>[g(i.ControlExample.Example,null,{default:o(()=>[g(i.StackPanel,{class:`system-backdrop-example`},{default:o(()=>[g(i.TextBlock,{TextWrapping:`WrapWholeWords`},{default:o(()=>[g(i.Run,{Text:`{x:Bind Labels.micaControllerDescription, Mode=OneWay}`}),g(i.LineBreak),g(i.LineBreak),g(i.Run,{Text:`{x:Bind Labels.micaKindsIntro, Mode=OneWay}`}),g(i.LineBreak),g(i.Run,{FontWeight:`Bold`,Text:`{x:Bind Labels.micaBaseName, Mode=OneWay}`}),g(i.Run,{Text:`{x:Bind Labels.micaBaseDescription, Mode=OneWay}`}),g(i.LineBreak),g(i.Run,{FontWeight:`Bold`,Text:`{x:Bind Labels.micaControllerAltName, Mode=OneWay}`}),g(i.Run,{Text:`{x:Bind Labels.micaControllerAltDescription, Mode=OneWay}`}),g(i.LineBreak)]),_:1}),g(i.Button,{Margin:`0,10,0,0`,HorizontalAlignment:`Left`,Click:`createCustomMicaWindow_Click`,Content:`{x:Bind Labels.showWindow, Mode=OneWay}`})]),_:1})]),_:1}),g(i.ControlExample.Output,null,{default:o(()=>[g(i.TextBlock,{Text:`{x:Bind MicaOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),g(i.ControlExample.Options)]),_:1}),g(i.ControlExample,{SampleDefinition:`SystemBackdrops\\SystemBackdropsDesktopacryliccontroller.txt`,HeaderText:`{x:Bind Labels.acrylicHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,CSharp:`{x:Bind desktopAcrylicControllerCSharp, Mode=OneWay}`},{default:o(()=>[g(i.ControlExample.Example,null,{default:o(()=>[g(i.StackPanel,{class:`system-backdrop-example`},{default:o(()=>[g(i.TextBlock,{TextWrapping:`WrapWholeWords`},{default:o(()=>[g(i.Run,{Text:`{x:Bind Labels.acrylicControllerDescription, Mode=OneWay}`}),g(i.LineBreak),g(i.LineBreak),g(i.Run,{Text:`{x:Bind Labels.acrylicKindsIntro, Mode=OneWay}`}),g(i.LineBreak),g(i.Run,{FontWeight:`Bold`,Text:`{x:Bind Labels.acrylicBaseName, Mode=OneWay}`}),g(i.Run,{Text:`{x:Bind Labels.acrylicBaseDescription, Mode=OneWay}`}),g(i.LineBreak),g(i.Run,{FontWeight:`Bold`,Text:`{x:Bind Labels.acrylicControllerThinName, Mode=OneWay}`}),g(i.Run,{Text:`{x:Bind Labels.acrylicControllerThinDescription, Mode=OneWay}`}),g(i.LineBreak),g(i.LineBreak),g(i.Run,{Text:`{x:Bind Labels.acrylicControllerNote, Mode=OneWay}`})]),_:1}),g(i.Button,{Margin:`0,10,0,0`,HorizontalAlignment:`Left`,Click:`createCustomDesktopAcrylicWindow_Click`,Content:`{x:Bind Labels.showWindow, Mode=OneWay}`})]),_:1})]),_:1}),g(i.ControlExample.Output,null,{default:o(()=>[g(i.TextBlock,{Text:`{x:Bind AcrylicOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),g(i.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var N=c(j,[[`render`,M],[`__scopeId`,`data-v-124c5e40`],[`__file`,`SystemBackdrops(MicaAcrylic)Page.vue`]]);export{N as default};