import{$i as e,Bi as t,Mn as n,Ni as r,a as i,bi as a,ci as o,ea as s,fi as c,gi as l,hi as u,ki as d,li as f,na as p,t as m}from"./ScrollViewer-DXAtwYnH.js";import{t as h}from"./Button-1Ztf3pH0.js";import{t as g}from"./ToggleButton-D0RGNdIP.js";import{t as _}from"./ControlExample-BX-yRpiQ.js";import{t as v}from"./pageState-cPponcIo.js";var y={class:`gallery-item-page`},b={class:`gallery-page-content`},x={class:`page-header`},S={class:`page-actions`},C={class:`description-block`},w={class:`custom-theme-demo`},T={class:`theme-label`},E={class:`theme-image`},D=[`src`],O=`<!-- App.xaml -->
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
</Page>`,k=`// Retrieve application-level resource
var primaryColor = (Windows.UI.Color)Application.Current.Resources["PrimaryColor"];

// Retrieve page-level resource
var highlightBrush = (SolidColorBrush)this.Resources["HighlightBrush"];

// Retrieve control-level resources
var headerFontSize = (double)newGrid.Resources["HeaderFontSize"];
var welcomeMessage = (string)newGrid.Resources["Description"];`,A=`<StackPanel>
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
</StackPanel>`,j=`// In Vue, theme resources are handled via CSS variables
// that automatically update when the theme changes

// Static approach (doesn't update)
const staticColor = '#EEEEEE'; // Fixed at initialization

// Theme-aware approach (updates automatically)
const themeColor = 'var(--card-bg-default)'; // Updates with theme`,M=`<Grid>
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
</Grid>`,N=`// Define theme-specific resources in Vue
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
</div>`,P=n({__name:`ResourcesPage`,setup(n){let P=a(`currentPage`),{pageTheme:F,isFavoriteState:I,toggleTheme:L,toggleFavorite:R}=v(o(()=>P?.value||`xamlresources`).value),z=o(()=>F.value===`dark`),B=o(()=>z.value?`https://via.placeholder.com/600x200/333333/EEEEEE?text=Dark+Theme+Image`:`https://via.placeholder.com/600x200/EEEEEE/333333?text=Light+Theme+Image`);return o(()=>e(I)?``:``),(n,a)=>{let o=r(`RouterLink`);return d(),c(`div`,y,[l(m,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[f(`div`,b,[f(`div`,x,[a[0]||=f(`h1`,{class:`page-title`},`Resources`,-1),f(`div`,S,[l(h,{Click:`toggleTheme`,class:`header-action`},{default:t(()=>[l(i,{class:`icon`,Glyph:``})]),_:1}),l(g,{IsChecked:`{x:Bind isFavorite, Mode=OneWay}`,class:`header-action`,Click:`toggleFavorite`},{default:t(()=>[l(i,{class:`icon`,Glyph:`{x:Bind ButtonContent1, Mode=OneWay}`})]),_:1})])]),a[7]||=f(`div`,{class:`section-header`},[f(`h2`,{class:`section-title`},`Creating and using XAML resources`)],-1),a[8]||=f(`div`,{class:`description-block`},[f(`p`,null,[u(` XAML Resources are defined using the `),f(`code`,null,`ResourceDictionary`),u(` element. The important parts are `),f(`strong`,null,`the resource's key`),u(` (a unique identifier) and `),f(`strong`,null,`the value`),u(` (like a color or brush). `)])],-1),a[9]||=f(`div`,{class:`description-block`},[f(`ul`,{class:`feature-list`},[f(`li`,null,[f(`strong`,null,`App-level:`),u(` Resources are defined globally, accessible throughout the application.`)]),f(`li`,null,[f(`strong`,null,`Page-level:`),u(` Resources are defined specific to a particular page.`)]),f(`li`,null,[f(`strong`,null,`Control-level:`),u(` Resources are defined local to a specific control, such as a Button or Grid.`)])])],-1),a[10]||=f(`div`,{class:`description-block`},[f(`p`,null,[f(`strong`,null,`Tips`)]),f(`ul`,{class:`feature-list`},[f(`li`,null,[f(`strong`,null,`Naming:`),u(` descriptive keys should always be used for resources to make them easier to identify.`)]),f(`li`,null,[f(`strong`,null,`Scope:`),u(` Resources should be defined at the narrowest scope possible to improve maintainability.`)]),f(`li`,null,[f(`strong`,null,`Access:`),u(),f(`code`,null,`{StaticResource Key}`),u(` is used in XAML for most cases, and `),f(`code`,null,`Resources["Key"]`),u(` is used in C# for runtime access.`)])])],-1),l(_,{theme:e(F),headerText:`Resource hierarchy example`,templateCode:O,vueCode:k},{example:t(()=>[...a[1]||=[f(`div`,{class:`resource-demo primary-bg`},[f(`div`,{class:`resource-text white-text large-text`},`Using application-level resources`),f(`div`,{class:`resource-demo highlight-bg`},[f(`div`,{class:`resource-text white-text medium-text`},`Using page-level resources`),f(`div`,{class:`resource-demo`},[f(`div`,{class:`resource-demo control-bg`},[f(`div`,{class:`resource-text white-text small-text`},`Using control-level resources`)])])])],-1)]]),_:1},8,[`theme`]),a[11]||=f(`div`,{class:`section-header`,style:{"margin-top":`32px`}},[f(`h2`,{class:`section-title`},`Theme resources`)],-1),f(`div`,C,[f(`p`,null,[a[3]||=u(` WinUI 3 includes built-in theme resources for commonly used colors. See all brushes on the `,-1),l(o,{to:`/colors`,class:`hyperlink`},{default:t(()=>[...a[2]||=[u(`Color page`,-1)]]),_:1}),a[4]||=u(`. `,-1)])]),a[12]||=f(`div`,{class:`description-block`},[f(`ul`,{class:`feature-list`},[f(`li`,null,[f(`strong`,null,`ThemeResource`),u(` is used for dynamic theme-based updates.`)]),f(`li`,null,[f(`strong`,null,`ThemeDictionaries`),u(` are defined to provide different values for light and dark themes.`)]),f(`li`,null,`A fallback value should always be provided to ensure compatibility with undefined themes.`)])],-1),l(_,{theme:e(F),headerText:`StaticResource versus ThemeResource`,templateCode:A,vueCode:j},{example:t(()=>[...a[5]||=[f(`div`,{class:`theme-comparison`},[f(`p`,{class:`instruction-text`},`Toggle the theme using the theme switch button in the top right corner.`),f(`div`,{class:`static-resource-demo`},[f(`div`,{class:`demo-text`},` StaticResource uses the value defined when the app starts and does not update when the theme changes. `)]),f(`div`,{class:`theme-resource-demo`},[f(`div`,{class:`demo-text`},` ThemeResource adapts automatically to the current theme. If the app switches from light to dark, the color defined by ThemeResource changes. `)])],-1)]]),_:1},8,[`theme`]),l(_,{theme:e(F),headerText:`Define a new theme resource`,templateCode:M,vueCode:N},{example:t(()=>[f(`div`,w,[a[6]||=f(`p`,{class:`instruction-text`},`Toggle the theme using the theme switch button in the top right corner.`,-1),f(`div`,{class:s([`themed-container`,{"dark-themed":z.value}])},[f(`div`,T,p(z.value?`Dark theme`:`Light theme`),1),f(`div`,E,[f(`img`,{src:B.value,alt:`Theme illustration`,class:`responsive-image`},null,8,D)])],2)])]),_:1},8,[`theme`])])]),_:1})])}}},[[`__scopeId`,`data-v-4f18ea1c`]]);export{P as default};