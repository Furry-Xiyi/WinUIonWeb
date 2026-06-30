<template>
  <div class="page-container">
    <!-- 页面标题区 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">System Backdrops (Mica/Acrylic)</h1>
        <p class="page-description">
          System backdrops provide a material effect for window backgrounds, including Mica (opaque, wallpaper-tinted) and Desktop Acrylic (semi-transparent, blurred).
        </p>
      </div>
      <div class="header-actions">
        <button class="icon-button theme-toggle" @click="toggleTheme" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <svg v-if="isDark" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 11c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3zm0 1c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zM8 0a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2A.5.5 0 018 0zm0 13a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2A.5.5 0 018 13zm8-5a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2a.5.5 0 01.5.5zM3 8a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2A.5.5 0 013 8zm9.743-5.157a.5.5 0 010 .707l-1.414 1.414a.5.5 0 11-.707-.707l1.414-1.414a.5.5 0 01.707 0zM5.379 11.621a.5.5 0 010 .707l-1.414 1.414a.5.5 0 11-.707-.707l1.414-1.414a.5.5 0 01.707 0zm7.242 0l1.414 1.414a.5.5 0 01-.707.707l-1.414-1.414a.5.5 0 01.707-.707zM4.672 4.964L3.258 3.55a.5.5 0 11.707-.707l1.414 1.414a.5.5 0 11-.707.707z"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 .278a.768.768 0 01.08.858 7.208 7.208 0 00-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 01.81.316.733.733 0 01-.031.893A8.349 8.349 0 018.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 016 .278z"/>
          </svg>
        </button>
        <button class="icon-button favorite-button" @click="toggleFavorite" :class="{ active: isFavorite }" title="Add to favorites">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 示例 1: Backdrop Types -->
    <WinControlExample
      headerText="Backdrop types"
      :xamlCode="example1XamlCode"
      :csharpCode="example1CSharpCode"
    >
      <template #example>
        <div class="backdrop-info">
          <p class="info-text">
            A window can use one of the following system backdrops:<br />
            <strong>1. Mica</strong> — An opaque material that samples the desktop wallpaper once to tint the window background. Best for main app windows.<br />
            <strong>2. Mica Alt</strong> — A variant of Mica with stronger tinting. Recommended for apps with a tabbed title bar.<br />
            <strong>3. Desktop Acrylic (Base)</strong> — A semi-transparent material that shows a blurred view of the content behind the window.<br />
            <strong>4. Desktop Acrylic (Thin)</strong> — A lighter variant of Desktop Acrylic with more transparency.<br /><br />
            <strong>Mica vs. Acrylic:</strong> Mica is opaque and renders the desktop wallpaper within the window background.
            Desktop Acrylic is semi-transparent and reveals a blurred view of what is behind the window in real-time.
            Mica is more performant because it captures the wallpaper only once, while Acrylic updates continuously.<br /><br />
            There are three backdrop types in the API:<br />
            • <strong>SystemBackdrop</strong> — The base class of every backdrop type.<br />
            • <strong>MicaBackdrop</strong> — Applies the Mica material. Set the Kind property to switch between Base and Alt.<br />
            • <strong>DesktopAcrylicBackdrop</strong> — Applies the Desktop Acrylic material (Base type only).<br /><br />
            All Mica variants require Windows 11 build 22000 or later. In-app acrylic (AcrylicBrush) is a separate XAML brush used within UI elements, not a window backdrop.
          </p>
          <WinButton Content="Show window" style="margin-top: 10px" @click="showBuiltInWindow" />
        </div>
      </template>
    </WinControlExample>

    <!-- 示例 2: MicaController -->
    <WinControlExample
      headerText="MicaController"
      :csharpCode="example2CSharpCode"
    >
      <template #example>
        <div class="backdrop-info">
          <p class="info-text">
            MicaController provides a customizable way to apply the Mica material. You can modify: FallbackColor, Kind, LuminosityOpacity, TintColor, and TintOpacity.<br /><br />
            There are 2 kinds of Mica:<br />
            <strong>1. Base</strong> — The default, lighter appearance.<br />
            <strong>2. Alt</strong> — A darker appearance with stronger tinting of the desktop wallpaper.
          </p>
          <WinButton Content="Show window" style="margin-top: 10px" @click="showCustomMicaWindow" />
        </div>
      </template>
    </WinControlExample>

    <!-- 示例 3: DesktopAcrylicController -->
    <WinControlExample
      headerText="DesktopAcrylicController"
      :csharpCode="example3CSharpCode"
    >
      <template #example>
        <div class="backdrop-info">
          <p class="info-text">
            DesktopAcrylicController provides a customizable way to apply the Desktop Acrylic material. It supports the same customization properties as MicaController.<br /><br />
            There are 2 kinds of Desktop Acrylic:<br />
            <strong>1. Base</strong> — The default, darker appearance with less transparency.<br />
            <strong>2. Thin</strong> — A lighter appearance with more transparency.<br /><br />
            Note: DesktopAcrylicBackdrop always uses the Base kind. To use the Thin kind, you must use DesktopAcrylicController directly.
          </p>
          <WinButton Content="Show window" style="margin-top: 10px" @click="showCustomDesktopAcrylicWindow" />
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WinControlExample from '../components/WinControlExample.vue'
import WinButton from '../components/WinButton.vue'

const isDark = ref(false)
const isFavorite = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const showBuiltInWindow = () => {
  alert('This would open a new window with built-in system backdrop (requires native window support)')
}

const showCustomMicaWindow = () => {
  alert('This would open a new window with custom MicaController (requires native window support)')
}

const showCustomDesktopAcrylicWindow = () => {
  alert('This would open a new window with custom DesktopAcrylicController (requires native window support)')
}

// Example 1: Backdrop types
const example1XamlCode = `<!-- Mica -->
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
</Window.SystemBackdrop>`

const example1CSharpCode = `bool TrySetMicaBackdrop(bool useMicaAlt)
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
}`

// Example 2: MicaController
const example2CSharpCode = `using System.Runtime.InteropServices;
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
}`

// Example 3: DesktopAcrylicController
const example3CSharpCode = `using System.Runtime.InteropServices;
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
}`
</script>

<style scoped>
.page-container {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--divider-stroke-default);
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.icon-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.icon-button:hover {
  background: var(--subtle-fill-secondary);
  color: var(--text-primary);
}

.icon-button.active {
  color: #e81123;
}

.backdrop-info {
  display: flex;
  flex-direction: column;
}

.info-text {
  margin: 0;
  line-height: 1.6;
  color: var(--text-primary);
  white-space: pre-wrap;
}

.info-text strong {
  font-weight: 600;
}
</style>
