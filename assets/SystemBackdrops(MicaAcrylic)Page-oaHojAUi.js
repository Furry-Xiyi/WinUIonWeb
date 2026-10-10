import{$i as e,Ai as t,Bi as n,Cn as r,Ji as i,Mn as a,Yi as o,_i as s,a as c,bi as l,ci as u,dr as d,fr as f,gi as p,ki as m,lt as h,mt as g,o as _,p as v,t as y,ui as b,wi as x}from"./ScrollViewer-DXAtwYnH.js";import{t as S}from"./Button-1Ztf3pH0.js";import{t as C}from"./mountSystemBackdropsWindow-D9rJ-R9r.js";import{t as w}from"./StackPanel-DGz4UnE4.js";import{t as T}from"./ToggleButton-D0RGNdIP.js";import{i as E}from"./systemBackdropHostAdapter-U7zYQ21_.js";import{t as D}from"./ControlExample-BX-yRpiQ.js";import{t as O}from"./pageState-cPponcIo.js";var k=`--- header
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
`,A=`--- header
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
}`,j=`--- header
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
}`,M=a(s({__name:`SystemBackdrops(MicaAcrylic)Page`,setup(a){let{isFavoriteState:s,pageTheme:M,toggleTheme:N,toggleFavorite:P}=O(l(`currentPage`)?.value||`systembackdrops`),F=v(),{t:I}=F,L=u(()=>({title:I(`catalog.item.systembackdrops.title`),description:I(`catalog.item.systembackdrops.subtitle`),toggleTheme:I(`gallery.page-header.toggle-theme`),typesHeader:I(`sample.systembackdrops.types-header`),micaHeader:I(`sample.systembackdrops.mica-header`),acrylicHeader:I(`sample.systembackdrops.acrylic-header`),showWindow:I(`sample.systembackdrops.show-window`),typesIntro:I(`sample.systembackdrops.types-intro`),micaName:I(`sample.systembackdrops.mica-name`),micaDescription:I(`sample.systembackdrops.mica-description`),micaAltName:I(`sample.systembackdrops.mica-alt-name`),micaAltDescription:I(`sample.systembackdrops.mica-alt-description`),acrylicName:I(`sample.systembackdrops.acrylic-name`),acrylicDescription:I(`sample.systembackdrops.acrylic-description`),acrylicThinName:I(`sample.systembackdrops.acrylic-thin-name`),acrylicThinDescription:I(`sample.systembackdrops.acrylic-thin-description`),comparisonTitle:I(`sample.systembackdrops.comparison-title`),comparisonDescription:I(`sample.systembackdrops.comparison-description`),apiIntro:I(`sample.systembackdrops.api-intro`),apiSystemName:I(`sample.systembackdrops.api-system-name`),apiSystemDescription:I(`sample.systembackdrops.api-system-description`),apiMicaName:I(`sample.systembackdrops.api-mica-name`),apiMicaDescription:I(`sample.systembackdrops.api-mica-description`),apiAcrylicName:I(`sample.systembackdrops.api-acrylic-name`),apiAcrylicDescription:I(`sample.systembackdrops.api-acrylic-description`),requirements:I(`sample.systembackdrops.requirements`),micaControllerDescription:I(`sample.systembackdrops.mica-controller-description`),micaKindsIntro:I(`sample.systembackdrops.mica-kinds-intro`),micaBaseName:I(`sample.systembackdrops.mica-base-name`),micaBaseDescription:I(`sample.systembackdrops.mica-base-description`),micaControllerAltName:I(`sample.systembackdrops.mica-controller-alt-name`),micaControllerAltDescription:I(`sample.systembackdrops.mica-controller-alt-description`),acrylicControllerDescription:I(`sample.systembackdrops.acrylic-controller-description`),acrylicKindsIntro:I(`sample.systembackdrops.acrylic-kinds-intro`),acrylicBaseName:I(`sample.systembackdrops.acrylic-base-name`),acrylicBaseDescription:I(`sample.systembackdrops.acrylic-base-description`),acrylicControllerThinName:I(`sample.systembackdrops.acrylic-controller-thin-name`),acrylicControllerThinDescription:I(`sample.systembackdrops.acrylic-controller-thin-description`),acrylicControllerNote:I(`sample.systembackdrops.acrylic-controller-note`)})),R=u(()=>I(s.value?`gallery.remove-favorite`:`gallery.add-favorite`)),z=u(()=>s.value?``:``),B=i(``),V=i(``),H=i(``),U=new Set;x(()=>{U.forEach(e=>e()),U.clear()});let W=(e,t)=>e.match(RegExp(`(?:^|\\r?\\n)--- `+t+`\\r?\\n([\\s\\S]*?)(?=\\r?\\n--- |$)`))?.[1]?.trim()??``,G=W(k,`xaml`),K=W(k,`c#`),q=W(A,`c#`),J=W(j,`c#`),Y=e=>e.Status===`Closed`?I(`sample.systembackdrops.closed`):e.Status===`HighContrast`?I(`sample.systembackdrops.high-contrast`):e.Status===`Fallback`?I(e.Reason===`Inactive`?`sample.systembackdrops.inactive`:e.Reason===`MaterialUnsupported`?`sample.systembackdrops.effect-unavailable`:e.Reason===`TransparencyDisabled`?`sample.systembackdrops.transparency-disabled`:e.Reason===`EnergySaver`?`sample.systembackdrops.energy-saver`:e.Reason===`HostError`?`sample.systembackdrops.operation-failed`:`sample.systembackdrops.native-unavailable`):I(`sample.systembackdrops.applied`,{backdrop:I(`sample.systembackdrops.backdrop.${e.AppliedBackdrop?.Type===`DesktopAcrylic`?e.AppliedBackdrop.Kind===`Thin`?`acrylic-thin`:`acrylic`:e.AppliedBackdrop?.Kind===`BaseAlt`?`mica-alt`:e.AppliedBackdrop?`mica`:`none`}`)}),X=async e=>{let t=e===`builtIn`?B:e===`mica`?V:H,n=e===`builtIn`?[`Mica`,`MicaAlt`,`Acrylic`,`None`]:e===`mica`?[`Mica`,`MicaAlt`,`None`]:[`Acrylic`,`AcrylicThin`,`None`];try{let r=await E({title:I(`sample.systembackdrops.window-title`),width:640,height:480,theme:`Default`,backdrop:e===`acrylic`?{Type:`DesktopAcrylic`,Kind:`Base`}:{Type:`Mica`,Kind:`Base`},mountContent:(e,t)=>C(e,t,n,F.locale)}),i;i=r.Subscribe(e=>{t.value=Y(e),e.Status===`Closed`&&i&&(i(),U.delete(i))}),r.State.Status!==`Closed`&&U.add(i)}catch(e){let n=e?.Code;t.value=I(n===`PopupBlocked`?`sample.systembackdrops.popup-blocked`:n===`HostUnavailable`?`sample.systembackdrops.window-unavailable`:`sample.systembackdrops.window-failed`)}};return t(d,o({})),t(f,{Labels:L,FavoriteLabel:R,FavoriteGlyph:z,isFavoriteState:s,pageTheme:M,toggleTheme:N,toggleFavorite:P,backdropTypesXaml:G,backdropTypesCSharp:K,micaControllerCSharp:q,desktopAcrylicControllerCSharp:J,BuiltInOutput:B,MicaOutput:V,AcrylicOutput:H,createBuiltInWindow_Click:()=>X(`builtIn`),createCustomMicaWindow_Click:()=>X(`mica`),createCustomDesktopAcrylicWindow_Click:()=>X(`acrylic`)}),(t,i)=>(m(),b(r,null,{default:n(()=>[p(y,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`,HorizontalScrollBarVisibility:`Disabled`,HorizontalScrollMode:`Disabled`},{default:n(()=>[p(w,{class:`gallery-item-page`},{default:n(()=>[p(w,{class:`page-heading`},{default:n(()=>[p(_,{class:`page-header`,Text:`{x:Bind Labels.title, Mode=OneWay}`}),p(_,{class:`page-description`,Text:`{x:Bind Labels.description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(w,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:n(()=>[p(S,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind Labels.toggleTheme, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.toggleTheme, Mode=OneWay}`},{default:n(()=>[p(c,{Glyph:``,FontSize:`16`})]),_:1}),p(T,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:n(()=>[p(c,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),p(w,{class:`gallery-page-content`},{default:n(()=>[p(D,{SampleDefinition:`SystemBackdrops\\SystemBackdropsBackdropTypes.txt`,HeaderText:`{x:Bind Labels.typesHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind backdropTypesXaml, Mode=OneWay}`,CSharp:`{x:Bind backdropTypesCSharp, Mode=OneWay}`},{default:n(()=>[p(D.Example,null,{default:n(()=>[p(w,{class:`system-backdrop-example`},{default:n(()=>[p(_,{TextWrapping:`WrapWholeWords`},{default:n(()=>[p(e(g),{Text:`{x:Bind Labels.typesIntro, Mode=OneWay}`}),p(e(h)),p(e(g),{FontWeight:`Bold`,Text:`{x:Bind Labels.micaName, Mode=OneWay}`}),p(e(g),{Text:`{x:Bind Labels.micaDescription, Mode=OneWay}`}),p(e(h)),p(e(g),{FontWeight:`Bold`,Text:`{x:Bind Labels.micaAltName, Mode=OneWay}`}),p(e(g),{Text:`{x:Bind Labels.micaAltDescription, Mode=OneWay}`}),p(e(h)),p(e(g),{FontWeight:`Bold`,Text:`{x:Bind Labels.acrylicName, Mode=OneWay}`}),p(e(g),{Text:`{x:Bind Labels.acrylicDescription, Mode=OneWay}`}),p(e(h)),p(e(g),{FontWeight:`Bold`,Text:`{x:Bind Labels.acrylicThinName, Mode=OneWay}`}),p(e(g),{Text:`{x:Bind Labels.acrylicThinDescription, Mode=OneWay}`}),p(e(h)),p(e(h)),p(e(g),{FontWeight:`Bold`,Text:`{x:Bind Labels.comparisonTitle, Mode=OneWay}`}),p(e(g),{Text:`{x:Bind Labels.comparisonDescription, Mode=OneWay}`}),p(e(h)),p(e(h)),p(e(g),{Text:`{x:Bind Labels.apiIntro, Mode=OneWay}`}),p(e(h)),p(e(g),{FontWeight:`Bold`,Text:`{x:Bind Labels.apiSystemName, Mode=OneWay}`}),p(e(g),{Text:`{x:Bind Labels.apiSystemDescription, Mode=OneWay}`}),p(e(h)),p(e(g),{FontWeight:`Bold`,Text:`{x:Bind Labels.apiMicaName, Mode=OneWay}`}),p(e(g),{Text:`{x:Bind Labels.apiMicaDescription, Mode=OneWay}`}),p(e(h)),p(e(g),{FontWeight:`Bold`,Text:`{x:Bind Labels.apiAcrylicName, Mode=OneWay}`}),p(e(g),{Text:`{x:Bind Labels.apiAcrylicDescription, Mode=OneWay}`}),p(e(h)),p(e(h)),p(e(g),{Text:`{x:Bind Labels.requirements, Mode=OneWay}`})]),_:1}),p(S,{Margin:`0,10,0,0`,HorizontalAlignment:`Left`,Click:`createBuiltInWindow_Click`,Content:`{x:Bind Labels.showWindow, Mode=OneWay}`})]),_:1})]),_:1}),p(D.Output,null,{default:n(()=>[p(_,{Text:`{x:Bind BuiltInOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),p(D.Options)]),_:1}),p(D,{SampleDefinition:`SystemBackdrops\\SystemBackdropsMicacontroller.txt`,HeaderText:`{x:Bind Labels.micaHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,CSharp:`{x:Bind micaControllerCSharp, Mode=OneWay}`},{default:n(()=>[p(D.Example,null,{default:n(()=>[p(w,{class:`system-backdrop-example`},{default:n(()=>[p(_,{TextWrapping:`WrapWholeWords`},{default:n(()=>[p(e(g),{Text:`{x:Bind Labels.micaControllerDescription, Mode=OneWay}`}),p(e(h)),p(e(h)),p(e(g),{Text:`{x:Bind Labels.micaKindsIntro, Mode=OneWay}`}),p(e(h)),p(e(g),{FontWeight:`Bold`,Text:`{x:Bind Labels.micaBaseName, Mode=OneWay}`}),p(e(g),{Text:`{x:Bind Labels.micaBaseDescription, Mode=OneWay}`}),p(e(h)),p(e(g),{FontWeight:`Bold`,Text:`{x:Bind Labels.micaControllerAltName, Mode=OneWay}`}),p(e(g),{Text:`{x:Bind Labels.micaControllerAltDescription, Mode=OneWay}`}),p(e(h))]),_:1}),p(S,{Margin:`0,10,0,0`,HorizontalAlignment:`Left`,Click:`createCustomMicaWindow_Click`,Content:`{x:Bind Labels.showWindow, Mode=OneWay}`})]),_:1})]),_:1}),p(D.Output,null,{default:n(()=>[p(_,{Text:`{x:Bind MicaOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),p(D.Options)]),_:1}),p(D,{SampleDefinition:`SystemBackdrops\\SystemBackdropsDesktopacryliccontroller.txt`,HeaderText:`{x:Bind Labels.acrylicHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,CSharp:`{x:Bind desktopAcrylicControllerCSharp, Mode=OneWay}`},{default:n(()=>[p(D.Example,null,{default:n(()=>[p(w,{class:`system-backdrop-example`},{default:n(()=>[p(_,{TextWrapping:`WrapWholeWords`},{default:n(()=>[p(e(g),{Text:`{x:Bind Labels.acrylicControllerDescription, Mode=OneWay}`}),p(e(h)),p(e(h)),p(e(g),{Text:`{x:Bind Labels.acrylicKindsIntro, Mode=OneWay}`}),p(e(h)),p(e(g),{FontWeight:`Bold`,Text:`{x:Bind Labels.acrylicBaseName, Mode=OneWay}`}),p(e(g),{Text:`{x:Bind Labels.acrylicBaseDescription, Mode=OneWay}`}),p(e(h)),p(e(g),{FontWeight:`Bold`,Text:`{x:Bind Labels.acrylicControllerThinName, Mode=OneWay}`}),p(e(g),{Text:`{x:Bind Labels.acrylicControllerThinDescription, Mode=OneWay}`}),p(e(h)),p(e(h)),p(e(g),{Text:`{x:Bind Labels.acrylicControllerNote, Mode=OneWay}`})]),_:1}),p(S,{Margin:`0,10,0,0`,HorizontalAlignment:`Left`,Click:`createCustomDesktopAcrylicWindow_Click`,Content:`{x:Bind Labels.showWindow, Mode=OneWay}`})]),_:1})]),_:1}),p(D.Output,null,{default:n(()=>[p(_,{Text:`{x:Bind AcrylicOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),p(D.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}}),[[`__scopeId`,`data-v-124c5e40`]]);export{M as default};