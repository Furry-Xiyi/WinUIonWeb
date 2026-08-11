import{$ as e,E as t,H as n,N as r,S as i,X as a,h as o,m as s,n as c,t as l,v as u,x as d}from"./WinScrollViewer-DPrZnleG.js";import{t as f}from"./WinTextBlock-CeUskDRc.js";import{c as p,r as m}from"./index-CMPZyTwE.js";import{t as h}from"./WinControlExample-C0uhK7Jb.js";import{t as g}from"./pageState-Mr-1-Xo1.js";var _={class:`gallery-item-page`},v={class:`page-heading`},y={class:`page-header-actions`},b={class:`icon`},x={class:`gallery-page-content`},S={class:`backdrop-info`},C={class:`backdrop-info`},w={class:`backdrop-info`},T=`<!-- Mica -->
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
</Window.SystemBackdrop>`,E=`bool TrySetMicaBackdrop(bool useMicaAlt)
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
}`,D=`using System.Runtime.InteropServices;
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
}`,O=`using System.Runtime.InteropServices;
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
}`,k=c({__name:`SystemBackdrops(MicaAcrylic)Page`,setup(c){let k=t(`currentPage`),{isFavoriteState:A,pageTheme:j,toggleTheme:M,toggleFavorite:N}=g(s(()=>typeof k==`string`?k:k?.value||`systembackdrops`).value);return(t,s)=>(r(),u(`div`,_,[o(`div`,v,[i(f,{class:`page-header`,Text:`System Backdrops (Mica/Acrylic)`}),i(f,{class:`page-description`,Text:`System backdrops provide material effects for window backgrounds, including Mica and Desktop Acrylic.`,TextWrapping:`WrapWholeWords`}),o(`div`,y,[i(p,{class:`header-action`,onClick:a(M)},{default:n(()=>[...s[0]||=[o(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),i(m,{IsChecked:a(A),class:`header-action`,"onUpdate:IsChecked":a(N)},{default:n(()=>[o(`span`,b,e(a(A)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),i(l,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[o(`div`,x,[i(h,{headerText:`Backdrop types`,theme:a(j),xaml:T,cSharp:E},{example:n(()=>[o(`div`,S,[i(f,{TextWrapping:`WrapWholeWords`},{default:n(()=>[...s[1]||=[d(` A window can use one of the following system backdrops:`,-1),o(`br`,null,null,-1),o(`strong`,null,`1. Mica`,-1),d(` - An opaque material that samples the desktop wallpaper once to tint the window background. Best for main app windows.`,-1),o(`br`,null,null,-1),o(`strong`,null,`2. Mica Alt`,-1),d(` - A variant of Mica with stronger tinting. Recommended for apps with a tabbed title bar.`,-1),o(`br`,null,null,-1),o(`strong`,null,`3. Desktop Acrylic (Base)`,-1),d(` - A semi-transparent material that shows a blurred view of the content behind the window.`,-1),o(`br`,null,null,-1),o(`strong`,null,`4. Desktop Acrylic (Thin)`,-1),d(` - A lighter variant of Desktop Acrylic with more transparency.`,-1),o(`br`,null,null,-1),o(`br`,null,null,-1),o(`strong`,null,`Mica vs. Acrylic:`,-1),d(` Mica is opaque and renders the desktop wallpaper within the window background. Desktop Acrylic is semi-transparent and reveals a blurred view of what is behind the window in real time. Mica is more performant because it captures the wallpaper only once, while Acrylic updates continuously.`,-1),o(`br`,null,null,-1),o(`br`,null,null,-1),d(` There are three backdrop types in the API:`,-1),o(`br`,null,null,-1),o(`strong`,null,`SystemBackdrop`,-1),d(` - The base class of every backdrop type.`,-1),o(`br`,null,null,-1),o(`strong`,null,`MicaBackdrop`,-1),d(` - Applies the Mica material. Set the Kind property to switch between Base and Alt.`,-1),o(`br`,null,null,-1),o(`strong`,null,`DesktopAcrylicBackdrop`,-1),d(` - Applies the Desktop Acrylic material (Base type only).`,-1),o(`br`,null,null,-1),o(`br`,null,null,-1),d(` All Mica variants require Windows 11 build 22000 or later. In-app acrylic (AcrylicBrush) is a separate XAML brush used within UI elements, not a window backdrop. `,-1)]]),_:1}),i(p,{Content:`Show window`})])]),_:1},8,[`theme`]),i(h,{headerText:`MicaController`,theme:a(j),cSharp:D},{example:n(()=>[o(`div`,C,[i(f,{TextWrapping:`WrapWholeWords`},{default:n(()=>[...s[2]||=[d(` MicaController provides a customizable way to apply the Mica material. You can modify: FallbackColor, Kind, LuminosityOpacity, TintColor, and TintOpacity.`,-1),o(`br`,null,null,-1),o(`br`,null,null,-1),d(` There are 2 kinds of Mica:`,-1),o(`br`,null,null,-1),o(`strong`,null,`1. Base`,-1),d(` - The default, lighter appearance.`,-1),o(`br`,null,null,-1),o(`strong`,null,`2. Alt`,-1),d(` - A darker appearance with stronger tinting of the desktop wallpaper. `,-1)]]),_:1}),i(p,{Content:`Show window`})])]),_:1},8,[`theme`]),i(h,{headerText:`DesktopAcrylicController`,theme:a(j),cSharp:O},{example:n(()=>[o(`div`,w,[i(f,{TextWrapping:`WrapWholeWords`},{default:n(()=>[...s[3]||=[d(` DesktopAcrylicController provides a customizable way to apply the Desktop Acrylic material. It supports the same customization properties as MicaController.`,-1),o(`br`,null,null,-1),o(`br`,null,null,-1),d(` There are 2 kinds of Desktop Acrylic:`,-1),o(`br`,null,null,-1),o(`strong`,null,`1. Base`,-1),d(` - The default, darker appearance with less transparency.`,-1),o(`br`,null,null,-1),o(`strong`,null,`2. Thin`,-1),d(` - A lighter appearance with more transparency.`,-1),o(`br`,null,null,-1),o(`br`,null,null,-1),d(` Note: DesktopAcrylicBackdrop always uses the Base kind. To use the Thin kind, you must use DesktopAcrylicController directly. `,-1)]]),_:1}),i(p,{Content:`Show window`})])]),_:1},8,[`theme`])])]),_:1})]))}},[[`__scopeId`,`data-v-66a800f4`]]);export{k as default};