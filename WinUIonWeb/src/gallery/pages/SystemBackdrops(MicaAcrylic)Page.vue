<template>
  <div class="gallery-item-page">
    <div class="page-heading">
          <WinTextBlock class="page-header" Text="System Backdrops (Mica/Acrylic)" />
          <WinTextBlock
            class="page-description"
            Text="System backdrops provide material effects for window backgrounds, including Mica and Desktop Acrylic."
            TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <WinControlExample
              headerText="Backdrop types"
              :theme="pageTheme"
              :xaml="backdropTypesXaml"
              :cSharp="backdropTypesCSharp">
              <template #example>
                <div class="backdrop-info">
                  <WinTextBlock TextWrapping="WrapWholeWords">
                    A window can use one of the following system backdrops:<br>
                    <strong>1. Mica</strong> - An opaque material that samples the desktop wallpaper once to tint the window background. Best for main app windows.<br>
                    <strong>2. Mica Alt</strong> - A variant of Mica with stronger tinting. Recommended for apps with a tabbed title bar.<br>
                    <strong>3. Desktop Acrylic (Base)</strong> - A semi-transparent material that shows a blurred view of the content behind the window.<br>
                    <strong>4. Desktop Acrylic (Thin)</strong> - A lighter variant of Desktop Acrylic with more transparency.<br><br>
                    <strong>Mica vs. Acrylic:</strong> Mica is opaque and renders the desktop wallpaper within the window background.
                    Desktop Acrylic is semi-transparent and reveals a blurred view of what is behind the window in real time.
                    Mica is more performant because it captures the wallpaper only once, while Acrylic updates continuously.<br><br>
                    There are three backdrop types in the API:<br>
                    <strong>SystemBackdrop</strong> - The base class of every backdrop type.<br>
                    <strong>MicaBackdrop</strong> - Applies the Mica material. Set the Kind property to switch between Base and Alt.<br>
                    <strong>DesktopAcrylicBackdrop</strong> - Applies the Desktop Acrylic material (Base type only).<br><br>
                    All Mica variants require Windows 11 build 22000 or later. In-app acrylic (AcrylicBrush) is a separate XAML brush used within UI elements, not a window backdrop.
                  </WinTextBlock>
                  <WinButton Content="Show window" />
                </div>
              </template>
            </WinControlExample>

            <WinControlExample
              headerText="MicaController"
              :theme="pageTheme"
              :cSharp="micaControllerCSharp">
              <template #example>
                <div class="backdrop-info">
                  <WinTextBlock TextWrapping="WrapWholeWords">
                    MicaController provides a customizable way to apply the Mica material. You can modify: FallbackColor, Kind, LuminosityOpacity, TintColor, and TintOpacity.<br><br>
                    There are 2 kinds of Mica:<br>
                    <strong>1. Base</strong> - The default, lighter appearance.<br>
                    <strong>2. Alt</strong> - A darker appearance with stronger tinting of the desktop wallpaper.
                  </WinTextBlock>
                  <WinButton Content="Show window" />
                </div>
              </template>
            </WinControlExample>

            <WinControlExample
              headerText="DesktopAcrylicController"
              :theme="pageTheme"
              :cSharp="desktopAcrylicControllerCSharp">
              <template #example>
                <div class="backdrop-info">
                  <WinTextBlock TextWrapping="WrapWholeWords">
                    DesktopAcrylicController provides a customizable way to apply the Desktop Acrylic material. It supports the same customization properties as MicaController.<br><br>
                    There are 2 kinds of Desktop Acrylic:<br>
                    <strong>1. Base</strong> - The default, darker appearance with less transparency.<br>
                    <strong>2. Thin</strong> - A lighter appearance with more transparency.<br><br>
                    Note: DesktopAcrylicBackdrop always uses the Base kind. To use the Thin kind, you must use DesktopAcrylicController directly.
                  </WinTextBlock>
                  <WinButton Content="Show window" />
                </div>
              </template>
            </WinControlExample>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => {
  if (typeof currentPage === 'string') return currentPage;
  return currentPage?.value || 'systembackdrops';
});
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const backdropTypesXaml = `<!-- Mica -->
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
</Window.SystemBackdrop>`;

const backdropTypesCSharp = `bool TrySetMicaBackdrop(bool useMicaAlt)
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
}`;

const micaControllerCSharp = `using System.Runtime.InteropServices;
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
}`;

const desktopAcrylicControllerCSharp = `using System.Runtime.InteropServices;
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
}`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.backdrop-info { display: flex; flex-direction: column; gap: 10px; max-width: 760px; }
.backdrop-info :deep(.win-btn) { align-self: flex-start; }
</style>
