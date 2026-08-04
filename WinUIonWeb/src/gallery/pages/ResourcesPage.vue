<template>
  <div class="gallery-item-page">
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <!-- Page Header -->
            <div class="page-header">
              <h1 class="page-title">Resources</h1>
              <div class="page-actions">
                <WinButton @Click="toggleTheme" class="header-action">
                  <span class="icon">&#xE793;</span>
                </WinButton>
                <WinToggleButton :IsChecked="isFavorite" class="header-action" @update:IsChecked="toggleFavorite">
                  <span class="icon">{{ isFavorite ? '&#xE735;' : '&#xE734;' }}</span>
                </WinToggleButton>
              </div>
            </div>

            <!-- Introduction Section -->
            <div class="section-header">
              <h2 class="section-title">Creating and using XAML resources</h2>
            </div>

            <div class="description-block">
              <p>
                XAML Resources are defined using the <code>ResourceDictionary</code> element. The important parts are
                <strong>the resource's key</strong> (a unique identifier) and <strong>the value</strong> (like a color or brush).
              </p>
            </div>

            <div class="description-block">
              <ul class="feature-list">
                <li><strong>App-level:</strong> Resources are defined globally, accessible throughout the application.</li>
                <li><strong>Page-level:</strong> Resources are defined specific to a particular page.</li>
                <li><strong>Control-level:</strong> Resources are defined local to a specific control, such as a Button or Grid.</li>
              </ul>
            </div>

            <div class="description-block">
              <p><strong>Tips</strong></p>
              <ul class="feature-list">
                <li><strong>Naming:</strong> descriptive keys should always be used for resources to make them easier to identify.</li>
                <li><strong>Scope:</strong> Resources should be defined at the narrowest scope possible to improve maintainability.</li>
                <li><strong>Access:</strong> <code>{StaticResource Key}</code> is used in XAML for most cases, and <code>Resources["Key"]</code> is used in C# for runtime access.</li>
              </ul>
            </div>

            <!-- Example 1: Resource Hierarchy -->
            <WinControlExample
              headerText="Resource hierarchy example"
              :templateCode="example1Template"
              :vueCode="example1Vue">
              <template #example>
                <!-- Application-level resource (simulated with inline style) -->
                <div class="resource-demo primary-bg">
                  <div class="resource-text white-text large-text">Using application-level resources</div>

                  <!-- Page-level resource -->
                  <div class="resource-demo highlight-bg">
                    <div class="resource-text white-text medium-text">Using page-level resources</div>

                    <!-- Control-level resource -->
                    <div class="resource-demo">
                      <div class="resource-demo control-bg">
                        <div class="resource-text white-text small-text">Using control-level resources</div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </WinControlExample>

            <!-- Theme Resources Section -->
            <div class="section-header" style="margin-top: 32px;">
              <h2 class="section-title">Theme resources</h2>
            </div>

            <div class="description-block">
              <p>
                WinUI 3 includes built-in theme resources for commonly used colors. See all brushes on the
                <a href="#/colors" class="hyperlink">Color page</a>.
              </p>
            </div>

            <div class="description-block">
              <ul class="feature-list">
                <li><strong>ThemeResource</strong> is used for dynamic theme-based updates.</li>
                <li><strong>ThemeDictionaries</strong> are defined to provide different values for light and dark themes.</li>
                <li>A fallback value should always be provided to ensure compatibility with undefined themes.</li>
              </ul>
            </div>

            <!-- Example 2: StaticResource vs ThemeResource -->
            <WinControlExample
              headerText="StaticResource versus ThemeResource"
              :templateCode="example2Template"
              :vueCode="example2Vue">
              <template #example>
                <div class="theme-comparison">
                  <p class="instruction-text">Toggle the theme using the theme switch button in the top right corner.</p>

                  <div class="static-resource-demo">
                    <div class="demo-text">
                      StaticResource uses the value defined when the app starts and does not update when the theme changes.
                    </div>
                  </div>

                  <div class="theme-resource-demo">
                    <div class="demo-text">
                      ThemeResource adapts automatically to the current theme. If the app switches from light to dark, the color defined by ThemeResource changes.
                    </div>
                  </div>
                </div>
              </template>
            </WinControlExample>

            <!-- Example 3: Define Custom Theme Resources -->
            <WinControlExample
              headerText="Define a new theme resource"
              :templateCode="example3Template"
              :vueCode="example3Vue">
              <template #example>
                <div class="custom-theme-demo">
                  <p class="instruction-text">Toggle the theme using the theme switch button in the top right corner.</p>

                  <div class="themed-container" :class="{ 'dark-themed': isDarkTheme }">
                    <div class="theme-label">{{ isDarkTheme ? 'Dark theme' : 'Light theme' }}</div>
                    <div class="theme-image">
                      <img :src="themeImageUrl" alt="Theme illustration" class="responsive-image" />
                    </div>
                  </div>
                </div>
              </template>
            </WinControlExample>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const getRootIsDarkTheme = () => {
  const root = document.documentElement;
  if (root.classList.contains('theme-dark') || root.getAttribute('data-theme') === 'dark') return true;
  if (root.classList.contains('theme-light') || root.getAttribute('data-theme') === 'light') return false;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
};

const isDarkTheme = ref(getRootIsDarkTheme());
const isFavorite = ref(false);

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  const nextTheme = isDarkTheme.value ? 'dark' : 'light';
  document.documentElement.classList.remove('theme-light', 'theme-dark');
  document.documentElement.classList.add(`theme-${nextTheme}`);
  document.documentElement.setAttribute('data-theme', nextTheme);
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
};

const themeImageUrl = computed(() => {
  return isDarkTheme.value
    ? 'https://via.placeholder.com/600x200/333333/EEEEEE?text=Dark+Theme+Image'
    : 'https://via.placeholder.com/600x200/EEEEEE/333333?text=Light+Theme+Image';
});

// Code examples
const example1Template = `<!-- App.xaml -->
<Application>
    <Application.Resources>
        <!-- Define an application-wide color resource -->
        <Color x:Key="PrimaryColor">#0078D4</Color>
    </Application.Resources>
</Application>

<!-- YourPage.xaml -->
<Page>
    <Page.Resources>
        <!-- Define page-level solid color brushes -->
        <SolidColorBrush x:Key="HighlightBrush" Color="#A94DC1" />
        <SolidColorBrush x:Key="FontColor" Color="White" />
    </Page.Resources>

    <!-- StackPanel using the application-level resource 'PrimaryColor' -->
    <StackPanel Background="{StaticResource PrimaryColor}" Padding="8">
        <TextBlock Text="Using application-level resources" Foreground="White" FontSize="24" />

        <!-- StackPanel using the page-level resource 'HighlightBrush' -->
        <StackPanel Background="{StaticResource HighlightBrush}" Padding="8" Margin="8">
            <TextBlock Text="Using page-level resources" Foreground="{StaticResource FontColor}" FontSize="18" />

            <!-- StackPanel with control-level resources defined within its own Resources -->
            <StackPanel Padding="8" Margin="8">
                <StackPanel.Resources>
                    <!-- Define control-level resources -->
                    <Color x:Key="BackgroundColor">#E2241A</Color>
                    <x:String x:Key="Description">Using control-level resources</x:String>
                </StackPanel.Resources>
                <Grid Background="{StaticResource BackgroundColor}" Padding="8">
                    <TextBlock Text="{StaticResource Description}" Foreground="White"/>
                </Grid>
            </StackPanel>
        </StackPanel>
    </StackPanel>
</Page>`;

const example1Vue = `// Retrieve application-level resource
var primaryColor = (Windows.UI.Color)Application.Current.Resources["PrimaryColor"];

// Retrieve page-level resource
var highlightBrush = (SolidColorBrush)this.Resources["HighlightBrush"];

// Retrieve control-level resources
var headerFontSize = (double)newGrid.Resources["HeaderFontSize"];
var welcomeMessage = (string)newGrid.Resources["Description"];`;

const example2Template = `<StackPanel>
    <Grid Background="{StaticResource SolidBackgroundFillColorBaseBrush}">
        <TextBlock
            Text="StaticResource uses the value defined when the app starts and does not update when the theme changes."
            Foreground="{StaticResource TextFillColorPrimaryBrush}"
            FontSize="16"
            TextWrapping="Wrap"/>
    </Grid>

    <Grid Background="{ThemeResource SolidBackgroundFillColorBaseBrush}">
        <TextBlock
            Text="ThemeResource adapts automatically to the current theme. If the app switches from Light to Dark, the color defined by ThemeResource changes."
            Foreground="{ThemeResource TextFillColorPrimaryBrush}"
            FontSize="16"
            TextWrapping="Wrap"/>
    </Grid>
</StackPanel>`;

const example2Vue = `// In Vue, theme resources are handled via CSS variables
// that automatically update when the theme changes

// Static approach (doesn't update)
const staticColor = '#EEEEEE'; // Fixed at initialization

// Theme-aware approach (updates automatically)
const themeColor = 'var(--card-bg-default)'; // Updates with theme`;

const example3Template = `<Grid>
    <Grid.Resources>
        <ResourceDictionary>
            <ResourceDictionary.ThemeDictionaries>
                <ResourceDictionary x:Key="Default">
                    <SolidColorBrush x:Key="BackgroundBrush" Color="#EEE" />
                    <SolidColorBrush x:Key="TextBrush" Color="#333" />
                    <x:String x:Key="ThemeString">Light theme</x:String>
                    <ImageSource x:Key="ImageSource">ms-appx:///Assets/SampleMedia/Light_Image.png</ImageSource>
                </ResourceDictionary>
                <ResourceDictionary x:Key="Dark">
                    <SolidColorBrush x:Key="BackgroundBrush" Color="#333" />
                    <SolidColorBrush x:Key="TextBrush" Color="#EEE" />
                    <x:String x:Key="ThemeString">Dark theme</x:String>
                    <ImageSource x:Key="ImageSource">ms-appx:///Assets/SampleMedia/Dark_Image.png</ImageSource>
                </ResourceDictionary>
            </ResourceDictionary.ThemeDictionaries>
        </ResourceDictionary>
    </Grid.Resources>
    <StackPanel
        MaxWidth="700"
        Padding="8"
        HorizontalAlignment="Center"
        VerticalAlignment="Center"
        Background="{ThemeResource BackgroundBrush}">
        <TextBlock
            Foreground="{ThemeResource TextBrush}"
            Style="{StaticResource SubtitleTextBlockStyle}"
            Text="{ThemeResource ThemeString}" />
        <Image Source="{ThemeResource ImageSource}" />
    </StackPanel>
</Grid>`;

const example3Vue = `// Define theme-specific resources in Vue
const themeResources = computed(() => {
  return isDarkTheme.value ? {
    backgroundColor: '#333',
    textColor: '#EEE',
    themeLabel: 'Dark theme',
    imageUrl: '/assets/dark_image.png'
  } : {
    backgroundColor: '#EEE',
    textColor: '#333',
    themeLabel: 'Light theme',
    imageUrl: '/assets/light_image.png'
  };
});

// Use in template
<div :style="{
  background: themeResources.backgroundColor,
  color: themeResources.textColor
}">
  {{ themeResources.themeLabel }}
</div>`;
</script>

<style scoped>
.page-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.page-actions {
  display: flex;
  gap: 4px;
}

.icon {
  font-size: 18px;
}

.section-header {
  margin-top: 32px;
  margin-bottom: 12px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.description-block {
  margin-bottom: 16px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.description-block p {
  margin: 0 0 12px 0;
}

.description-block code {
  font-family: 'Consolas', 'Courier New', monospace;
  background: var(--card-bg-secondary);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
}

.description-block strong {
  font-weight: 600;
  color: var(--text-primary);
}

.feature-list {
  margin: 8px 0;
  padding-left: 24px;
}

.feature-list li {
  margin-bottom: 8px;
}

.hyperlink {
  color: var(--accent-default);
  text-decoration: none;
  cursor: pointer;
}

.hyperlink:hover {
  text-decoration: underline;
}

/* Example 1: Resource Hierarchy */
.resource-demo {
  padding: 12px;
  border-radius: 8px;
  margin: 8px;
}

.resource-demo:first-child {
  margin: 0;
}

.primary-bg {
  background: #0078D4;
}

.highlight-bg {
  background: #A94DC1;
}

.control-bg {
  background: #E2241A;
  padding: 12px;
  border-radius: 8px;
}

.resource-text {
  margin: 0;
}

.white-text {
  color: white;
}

.large-text {
  font-size: 24px;
  margin-bottom: 8px;
}

.medium-text {
  font-size: 18px;
  margin-bottom: 8px;
}

.small-text {
  font-size: 14px;
}

/* Example 2: Theme Comparison */
.theme-comparison {
  width: 100%;
}

.instruction-text {
  margin-bottom: 16px;
  color: var(--text-secondary);
}

.static-resource-demo,
.theme-resource-demo {
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.static-resource-demo {
  background: #EEEEEE;
}

.static-resource-demo .demo-text {
  color: #333333;
}

.theme-resource-demo {
  background: var(--card-bg-default);
}

.theme-resource-demo .demo-text {
  color: var(--text-primary);
}

.demo-text {
  font-size: 16px;
  line-height: 1.5;
}

/* Example 3: Custom Theme Resources */
.custom-theme-demo {
  width: 100%;
}

.themed-container {
  max-width: 700px;
  padding: 16px;
  margin: 0 auto;
  border-radius: 8px;
  background: #EEEEEE;
  transition: background-color 0.3s ease;
}

.themed-container.dark-themed {
  background: #333333;
}

.theme-label {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333333;
}

.themed-container.dark-themed .theme-label {
  color: #EEEEEE;
}

.theme-image {
  border-radius: 8px;
  overflow: hidden;
}

.responsive-image {
  width: 100%;
  height: auto;
  display: block;
}

@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .section-title {
    font-size: 18px;
  }
}
</style>
