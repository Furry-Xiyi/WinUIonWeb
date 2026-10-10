import{Fi as e,Ji as t,Oi as n,Ui as r,Wt as i,Yi as a,Zi as o,a as s,di as c,hi as l,ii as u,ri as d,si as f,t as p,ui as m,wi as h}from"./ScrollViewer-PoO_ma9Z.js";import{t as g}from"./Button-DjU0urmJ.js";import{t as _}from"./ToggleButton-DwmhXZge.js";import{t as v}from"./ControlExample-C1ahTZEr.js";import{t as y}from"./pageState-BN3kXI7L.js";var b=`<!-- App.xaml -->
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
</Page>`,x=`// Retrieve application-level resource
var primaryColor = (Windows.UI.Color)Application.Current.Resources["PrimaryColor"];

// Retrieve page-level resource
var highlightBrush = (SolidColorBrush)this.Resources["HighlightBrush"];

// Retrieve control-level resources
var headerFontSize = (double)newGrid.Resources["HeaderFontSize"];
var welcomeMessage = (string)newGrid.Resources["Description"];`,S=`<StackPanel>
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
</StackPanel>`,C=`// In Vue, theme resources are handled via CSS variables
// that automatically update when the theme changes

// Static approach (doesn't update)
const staticColor = '#EEEEEE'; // Fixed at initialization

// Theme-aware approach (updates automatically)
const themeColor = 'var(--card-bg-default)'; // Updates with theme`,w=`<Grid>
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
</Grid>`,T=`// Define theme-specific resources in Vue
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
</div>`,E={__name:`ResourcesPage`,setup(e,{expose:n}){n();let i=()=>{let e=document.documentElement;return e.classList.contains(`theme-dark`)||e.getAttribute(`data-theme`)===`dark`?!0:e.classList.contains(`theme-light`)||e.getAttribute(`data-theme`)===`light`?!1:window.matchMedia?.(`(prefers-color-scheme: dark)`).matches??!1},a=l(`currentPage`),o=d(()=>a?.value||`xamlresources`),{pageTheme:c,isFavoriteState:u,toggleTheme:f,toggleFavorite:m}=y(o.value),h=d(()=>c.value===`dark`),E={getRootIsDarkTheme:i,currentPage:a,pageKey:o,pageTheme:c,isFavorite:u,toggleTheme:f,toggleFavorite:m,isDarkTheme:h,themeImageUrl:d(()=>h.value?`https://via.placeholder.com/600x200/333333/EEEEEE?text=Dark+Theme+Image`:`https://via.placeholder.com/600x200/EEEEEE/333333?text=Light+Theme+Image`),example1Template:b,example1Vue:x,example2Template:S,example2Vue:C,example3Template:w,example3Vue:T,ButtonContent1:d(()=>t(u)?``:``),FontIcon:s,ButtonContentComputed:d,ButtonContentUnref:t,ref:r,computed:d,inject:l,ControlExample:v,Button:g,ToggleButton:_,get createPageState(){return y},ScrollViewer:p};return Object.defineProperty(E,"__isScriptSetup",{enumerable:!1,value:!0}),E}},D={class:`gallery-item-page`},O={class:`gallery-page-content`},k={class:`page-header`},A={class:`page-actions`},j={class:`description-block`},M={class:`custom-theme-demo`},N={class:`theme-label`},P={class:`theme-image`},F=[`src`];function I(t,r,i,s,l,d){let p=n(`RouterLink`);return h(),f(`div`,D,[c(s.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[u(`div`,O,[u(`div`,k,[r[0]||=u(`h1`,{class:`page-title`},`Resources`,-1),u(`div`,A,[c(s.Button,{Click:`toggleTheme`,class:`header-action`},{default:e(()=>[c(s.FontIcon,{class:`icon`,Glyph:``})]),_:1}),c(s.ToggleButton,{IsChecked:`{x:Bind isFavorite, Mode=OneWay}`,class:`header-action`,Click:`toggleFavorite`},{default:e(()=>[c(s.FontIcon,{class:`icon`,Glyph:`{x:Bind ButtonContent1, Mode=OneWay}`})]),_:1})])]),r[7]||=u(`div`,{class:`section-header`},[u(`h2`,{class:`section-title`},`Creating and using XAML resources`)],-1),r[8]||=u(`div`,{class:`description-block`},[u(`p`,null,[m(` XAML Resources are defined using the `),u(`code`,null,`ResourceDictionary`),m(` element. The important parts are `),u(`strong`,null,`the resource's key`),m(` (a unique identifier) and `),u(`strong`,null,`the value`),m(` (like a color or brush). `)])],-1),r[9]||=u(`div`,{class:`description-block`},[u(`ul`,{class:`feature-list`},[u(`li`,null,[u(`strong`,null,`App-level:`),m(` Resources are defined globally, accessible throughout the application.`)]),u(`li`,null,[u(`strong`,null,`Page-level:`),m(` Resources are defined specific to a particular page.`)]),u(`li`,null,[u(`strong`,null,`Control-level:`),m(` Resources are defined local to a specific control, such as a Button or Grid.`)])])],-1),r[10]||=u(`div`,{class:`description-block`},[u(`p`,null,[u(`strong`,null,`Tips`)]),u(`ul`,{class:`feature-list`},[u(`li`,null,[u(`strong`,null,`Naming:`),m(` descriptive keys should always be used for resources to make them easier to identify.`)]),u(`li`,null,[u(`strong`,null,`Scope:`),m(` Resources should be defined at the narrowest scope possible to improve maintainability.`)]),u(`li`,null,[u(`strong`,null,`Access:`),m(),u(`code`,null,`{StaticResource Key}`),m(` is used in XAML for most cases, and `),u(`code`,null,`Resources["Key"]`),m(` is used in C# for runtime access.`)])])],-1),c(s.ControlExample,{theme:s.pageTheme,headerText:`Resource hierarchy example`,templateCode:s.example1Template,vueCode:s.example1Vue},{example:e(()=>[...r[1]||=[u(`div`,{class:`resource-demo primary-bg`},[u(`div`,{class:`resource-text white-text large-text`},`Using application-level resources`),u(`div`,{class:`resource-demo highlight-bg`},[u(`div`,{class:`resource-text white-text medium-text`},`Using page-level resources`),u(`div`,{class:`resource-demo`},[u(`div`,{class:`resource-demo control-bg`},[u(`div`,{class:`resource-text white-text small-text`},`Using control-level resources`)])])])],-1)]]),_:1},8,[`theme`]),r[11]||=u(`div`,{class:`section-header`,style:{"margin-top":`32px`}},[u(`h2`,{class:`section-title`},`Theme resources`)],-1),u(`div`,j,[u(`p`,null,[r[3]||=m(` WinUI 3 includes built-in theme resources for commonly used colors. See all brushes on the `,-1),c(p,{to:`/colors`,class:`hyperlink`},{default:e(()=>[...r[2]||=[m(`Color page`,-1)]]),_:1}),r[4]||=m(`. `,-1)])]),r[12]||=u(`div`,{class:`description-block`},[u(`ul`,{class:`feature-list`},[u(`li`,null,[u(`strong`,null,`ThemeResource`),m(` is used for dynamic theme-based updates.`)]),u(`li`,null,[u(`strong`,null,`ThemeDictionaries`),m(` are defined to provide different values for light and dark themes.`)]),u(`li`,null,`A fallback value should always be provided to ensure compatibility with undefined themes.`)])],-1),c(s.ControlExample,{theme:s.pageTheme,headerText:`StaticResource versus ThemeResource`,templateCode:s.example2Template,vueCode:s.example2Vue},{example:e(()=>[...r[5]||=[u(`div`,{class:`theme-comparison`},[u(`p`,{class:`instruction-text`},`Toggle the theme using the theme switch button in the top right corner.`),u(`div`,{class:`static-resource-demo`},[u(`div`,{class:`demo-text`},` StaticResource uses the value defined when the app starts and does not update when the theme changes. `)]),u(`div`,{class:`theme-resource-demo`},[u(`div`,{class:`demo-text`},` ThemeResource adapts automatically to the current theme. If the app switches from light to dark, the color defined by ThemeResource changes. `)])],-1)]]),_:1},8,[`theme`]),c(s.ControlExample,{theme:s.pageTheme,headerText:`Define a new theme resource`,templateCode:s.example3Template,vueCode:s.example3Vue},{example:e(()=>[u(`div`,M,[r[6]||=u(`p`,{class:`instruction-text`},`Toggle the theme using the theme switch button in the top right corner.`,-1),u(`div`,{class:a([`themed-container`,{"dark-themed":s.isDarkTheme}])},[u(`div`,N,o(s.isDarkTheme?`Dark theme`:`Light theme`),1),u(`div`,P,[u(`img`,{src:s.themeImageUrl,alt:`Theme illustration`,class:`responsive-image`},null,8,F)])],2)])]),_:1},8,[`theme`])])]),_:1})])}var L=i(E,[[`render`,I],[`__scopeId`,`data-v-4f18ea1c`],[`__file`,`ResourcesPage.vue`]]);export{L as default};