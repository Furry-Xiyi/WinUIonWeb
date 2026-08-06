import{$ as e,H as t,K as n,L as r,N as i,S as a,Z as o,h as s,m as c,n as l,t as u,v as d,x as f}from"./WinScrollViewer-Cel0kV6s.js";import{n as p,t as m}from"./WinToggleButton-Dj-8G30B.js";import{t as h}from"./WinControlExample-CxPQLLlF.js";var g={class:`gallery-item-page`},_={class:`gallery-page-content`},v={class:`page-header`},y={class:`page-actions`},b={class:`icon`},x={class:`description-block`},S={class:`custom-theme-demo`},C={class:`theme-label`},w={class:`theme-image`},T=[`src`],E=`<!-- App.xaml -->
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
</Page>`,D=`// Retrieve application-level resource
var primaryColor = (Windows.UI.Color)Application.Current.Resources["PrimaryColor"];

// Retrieve page-level resource
var highlightBrush = (SolidColorBrush)this.Resources["HighlightBrush"];

// Retrieve control-level resources
var headerFontSize = (double)newGrid.Resources["HeaderFontSize"];
var welcomeMessage = (string)newGrid.Resources["Description"];`,O=`<StackPanel>
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
</StackPanel>`,k=`// In Vue, theme resources are handled via CSS variables
// that automatically update when the theme changes

// Static approach (doesn't update)
const staticColor = '#EEEEEE'; // Fixed at initialization

// Theme-aware approach (updates automatically)
const themeColor = 'var(--card-bg-default)'; // Updates with theme`,A=`<Grid>
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
</Grid>`,j=`// Define theme-specific resources in Vue
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
</div>`,M=l({__name:`ResourcesPage`,setup(l){let M=n((()=>{let e=document.documentElement;return e.classList.contains(`theme-dark`)||e.getAttribute(`data-theme`)===`dark`?!0:e.classList.contains(`theme-light`)||e.getAttribute(`data-theme`)===`light`?!1:window.matchMedia?.(`(prefers-color-scheme: dark)`).matches??!1})()),N=n(!1),P=()=>{M.value=!M.value;let e=M.value?`dark`:`light`;document.documentElement.classList.remove(`theme-light`,`theme-dark`),document.documentElement.classList.add(`theme-${e}`),document.documentElement.setAttribute(`data-theme`,e)},F=()=>{N.value=!N.value},I=c(()=>M.value?`https://via.placeholder.com/600x200/333333/EEEEEE?text=Dark+Theme+Image`:`https://via.placeholder.com/600x200/EEEEEE/333333?text=Light+Theme+Image`);return(n,c)=>{let l=r(`RouterLink`);return i(),d(`div`,g,[a(u,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[s(`div`,_,[s(`div`,v,[c[1]||=s(`h1`,{class:`page-title`},`Resources`,-1),s(`div`,y,[a(p,{onClick:P,class:`header-action`},{default:t(()=>[...c[0]||=[s(`span`,{class:`icon`},``,-1)]]),_:1}),a(m,{IsChecked:N.value,class:`header-action`,"onUpdate:IsChecked":F},{default:t(()=>[s(`span`,b,e(N.value?``:``),1)]),_:1},8,[`IsChecked`])])]),c[8]||=s(`div`,{class:`section-header`},[s(`h2`,{class:`section-title`},`Creating and using XAML resources`)],-1),c[9]||=s(`div`,{class:`description-block`},[s(`p`,null,[f(` XAML Resources are defined using the `),s(`code`,null,`ResourceDictionary`),f(` element. The important parts are `),s(`strong`,null,`the resource's key`),f(` (a unique identifier) and `),s(`strong`,null,`the value`),f(` (like a color or brush). `)])],-1),c[10]||=s(`div`,{class:`description-block`},[s(`ul`,{class:`feature-list`},[s(`li`,null,[s(`strong`,null,`App-level:`),f(` Resources are defined globally, accessible throughout the application.`)]),s(`li`,null,[s(`strong`,null,`Page-level:`),f(` Resources are defined specific to a particular page.`)]),s(`li`,null,[s(`strong`,null,`Control-level:`),f(` Resources are defined local to a specific control, such as a Button or Grid.`)])])],-1),c[11]||=s(`div`,{class:`description-block`},[s(`p`,null,[s(`strong`,null,`Tips`)]),s(`ul`,{class:`feature-list`},[s(`li`,null,[s(`strong`,null,`Naming:`),f(` descriptive keys should always be used for resources to make them easier to identify.`)]),s(`li`,null,[s(`strong`,null,`Scope:`),f(` Resources should be defined at the narrowest scope possible to improve maintainability.`)]),s(`li`,null,[s(`strong`,null,`Access:`),f(),s(`code`,null,`{StaticResource Key}`),f(` is used in XAML for most cases, and `),s(`code`,null,`Resources["Key"]`),f(` is used in C# for runtime access.`)])])],-1),a(h,{headerText:`Resource hierarchy example`,templateCode:E,vueCode:D},{example:t(()=>[...c[2]||=[s(`div`,{class:`resource-demo primary-bg`},[s(`div`,{class:`resource-text white-text large-text`},`Using application-level resources`),s(`div`,{class:`resource-demo highlight-bg`},[s(`div`,{class:`resource-text white-text medium-text`},`Using page-level resources`),s(`div`,{class:`resource-demo`},[s(`div`,{class:`resource-demo control-bg`},[s(`div`,{class:`resource-text white-text small-text`},`Using control-level resources`)])])])],-1)]]),_:1}),c[12]||=s(`div`,{class:`section-header`,style:{"margin-top":`32px`}},[s(`h2`,{class:`section-title`},`Theme resources`)],-1),s(`div`,x,[s(`p`,null,[c[4]||=f(` WinUI 3 includes built-in theme resources for commonly used colors. See all brushes on the `,-1),a(l,{to:`/colors`,class:`hyperlink`},{default:t(()=>[...c[3]||=[f(`Color page`,-1)]]),_:1}),c[5]||=f(`. `,-1)])]),c[13]||=s(`div`,{class:`description-block`},[s(`ul`,{class:`feature-list`},[s(`li`,null,[s(`strong`,null,`ThemeResource`),f(` is used for dynamic theme-based updates.`)]),s(`li`,null,[s(`strong`,null,`ThemeDictionaries`),f(` are defined to provide different values for light and dark themes.`)]),s(`li`,null,`A fallback value should always be provided to ensure compatibility with undefined themes.`)])],-1),a(h,{headerText:`StaticResource versus ThemeResource`,templateCode:O,vueCode:k},{example:t(()=>[...c[6]||=[s(`div`,{class:`theme-comparison`},[s(`p`,{class:`instruction-text`},`Toggle the theme using the theme switch button in the top right corner.`),s(`div`,{class:`static-resource-demo`},[s(`div`,{class:`demo-text`},` StaticResource uses the value defined when the app starts and does not update when the theme changes. `)]),s(`div`,{class:`theme-resource-demo`},[s(`div`,{class:`demo-text`},` ThemeResource adapts automatically to the current theme. If the app switches from light to dark, the color defined by ThemeResource changes. `)])],-1)]]),_:1}),a(h,{headerText:`Define a new theme resource`,templateCode:A,vueCode:j},{example:t(()=>[s(`div`,S,[c[7]||=s(`p`,{class:`instruction-text`},`Toggle the theme using the theme switch button in the top right corner.`,-1),s(`div`,{class:o([`themed-container`,{"dark-themed":M.value}])},[s(`div`,C,e(M.value?`Dark theme`:`Light theme`),1),s(`div`,w,[s(`img`,{src:I.value,alt:`Theme illustration`,class:`responsive-image`},null,8,T)])],2)])]),_:1})])]),_:1})])}}},[[`__scopeId`,`data-v-862a1d61`]]);export{M as default};