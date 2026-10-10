import{$i as e,Bi as t,Ji as n,Mn as r,Ni as i,a,bi as o,ci as s,ea as c,fi as l,gi as u,hi as d,ki as f,li as p,na as m,t as h}from"./ScrollViewer-CHNE18MA.js";import{t as g}from"./Button-DO0TiUOq.js";import{t as _}from"./ToggleButton-ZsjZg8Nu.js";import{t as v}from"./ControlExample-BKyw2NwY.js";import{t as y}from"./pageState-Djrh7EdY.js";var b=`<!-- App.xaml -->
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
</div>`,E={__name:`ResourcesPage`,setup(t,{expose:r}){r();let i=()=>{let e=document.documentElement;return e.classList.contains(`theme-dark`)||e.getAttribute(`data-theme`)===`dark`?!0:e.classList.contains(`theme-light`)||e.getAttribute(`data-theme`)===`light`?!1:window.matchMedia?.(`(prefers-color-scheme: dark)`).matches??!1},c=o(`currentPage`),l=s(()=>c?.value||`xamlresources`),{pageTheme:u,isFavoriteState:d,toggleTheme:f,toggleFavorite:p}=y(l.value),m=s(()=>u.value===`dark`),E={getRootIsDarkTheme:i,currentPage:c,pageKey:l,pageTheme:u,isFavorite:d,toggleTheme:f,toggleFavorite:p,isDarkTheme:m,themeImageUrl:s(()=>m.value?`https://via.placeholder.com/600x200/333333/EEEEEE?text=Dark+Theme+Image`:`https://via.placeholder.com/600x200/EEEEEE/333333?text=Light+Theme+Image`),example1Template:b,example1Vue:x,example2Template:S,example2Vue:C,example3Template:w,example3Vue:T,ButtonContent1:s(()=>e(d)?``:``),FontIcon:a,ButtonContentComputed:s,ButtonContentUnref:e,ref:n,computed:s,inject:o,ControlExample:v,Button:g,ToggleButton:_,get createPageState(){return y},ScrollViewer:h};return Object.defineProperty(E,"__isScriptSetup",{enumerable:!1,value:!0}),E}},D={class:`gallery-item-page`},O={class:`gallery-page-content`},k={class:`page-header`},A={class:`page-actions`},j={class:`description-block`},M={class:`custom-theme-demo`},N={class:`theme-label`},P={class:`theme-image`},F=[`src`];function I(e,n,r,a,o,s){let h=i(`RouterLink`);return f(),l(`div`,D,[u(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[p(`div`,O,[p(`div`,k,[n[0]||=p(`h1`,{class:`page-title`},`Resources`,-1),p(`div`,A,[u(a.Button,{Click:`toggleTheme`,class:`header-action`},{default:t(()=>[u(a.FontIcon,{class:`icon`,Glyph:``})]),_:1}),u(a.ToggleButton,{IsChecked:`{x:Bind isFavorite, Mode=OneWay}`,class:`header-action`,Click:`toggleFavorite`},{default:t(()=>[u(a.FontIcon,{class:`icon`,Glyph:`{x:Bind ButtonContent1, Mode=OneWay}`})]),_:1})])]),n[7]||=p(`div`,{class:`section-header`},[p(`h2`,{class:`section-title`},`Creating and using XAML resources`)],-1),n[8]||=p(`div`,{class:`description-block`},[p(`p`,null,[d(` XAML Resources are defined using the `),p(`code`,null,`ResourceDictionary`),d(` element. The important parts are `),p(`strong`,null,`the resource's key`),d(` (a unique identifier) and `),p(`strong`,null,`the value`),d(` (like a color or brush). `)])],-1),n[9]||=p(`div`,{class:`description-block`},[p(`ul`,{class:`feature-list`},[p(`li`,null,[p(`strong`,null,`App-level:`),d(` Resources are defined globally, accessible throughout the application.`)]),p(`li`,null,[p(`strong`,null,`Page-level:`),d(` Resources are defined specific to a particular page.`)]),p(`li`,null,[p(`strong`,null,`Control-level:`),d(` Resources are defined local to a specific control, such as a Button or Grid.`)])])],-1),n[10]||=p(`div`,{class:`description-block`},[p(`p`,null,[p(`strong`,null,`Tips`)]),p(`ul`,{class:`feature-list`},[p(`li`,null,[p(`strong`,null,`Naming:`),d(` descriptive keys should always be used for resources to make them easier to identify.`)]),p(`li`,null,[p(`strong`,null,`Scope:`),d(` Resources should be defined at the narrowest scope possible to improve maintainability.`)]),p(`li`,null,[p(`strong`,null,`Access:`),d(),p(`code`,null,`{StaticResource Key}`),d(` is used in XAML for most cases, and `),p(`code`,null,`Resources["Key"]`),d(` is used in C# for runtime access.`)])])],-1),u(a.ControlExample,{theme:a.pageTheme,headerText:`Resource hierarchy example`,templateCode:a.example1Template,vueCode:a.example1Vue},{example:t(()=>[...n[1]||=[p(`div`,{class:`resource-demo primary-bg`},[p(`div`,{class:`resource-text white-text large-text`},`Using application-level resources`),p(`div`,{class:`resource-demo highlight-bg`},[p(`div`,{class:`resource-text white-text medium-text`},`Using page-level resources`),p(`div`,{class:`resource-demo`},[p(`div`,{class:`resource-demo control-bg`},[p(`div`,{class:`resource-text white-text small-text`},`Using control-level resources`)])])])],-1)]]),_:1},8,[`theme`]),n[11]||=p(`div`,{class:`section-header`,style:{"margin-top":`32px`}},[p(`h2`,{class:`section-title`},`Theme resources`)],-1),p(`div`,j,[p(`p`,null,[n[3]||=d(` WinUI 3 includes built-in theme resources for commonly used colors. See all brushes on the `,-1),u(h,{to:`/colors`,class:`hyperlink`},{default:t(()=>[...n[2]||=[d(`Color page`,-1)]]),_:1}),n[4]||=d(`. `,-1)])]),n[12]||=p(`div`,{class:`description-block`},[p(`ul`,{class:`feature-list`},[p(`li`,null,[p(`strong`,null,`ThemeResource`),d(` is used for dynamic theme-based updates.`)]),p(`li`,null,[p(`strong`,null,`ThemeDictionaries`),d(` are defined to provide different values for light and dark themes.`)]),p(`li`,null,`A fallback value should always be provided to ensure compatibility with undefined themes.`)])],-1),u(a.ControlExample,{theme:a.pageTheme,headerText:`StaticResource versus ThemeResource`,templateCode:a.example2Template,vueCode:a.example2Vue},{example:t(()=>[...n[5]||=[p(`div`,{class:`theme-comparison`},[p(`p`,{class:`instruction-text`},`Toggle the theme using the theme switch button in the top right corner.`),p(`div`,{class:`static-resource-demo`},[p(`div`,{class:`demo-text`},` StaticResource uses the value defined when the app starts and does not update when the theme changes. `)]),p(`div`,{class:`theme-resource-demo`},[p(`div`,{class:`demo-text`},` ThemeResource adapts automatically to the current theme. If the app switches from light to dark, the color defined by ThemeResource changes. `)])],-1)]]),_:1},8,[`theme`]),u(a.ControlExample,{theme:a.pageTheme,headerText:`Define a new theme resource`,templateCode:a.example3Template,vueCode:a.example3Vue},{example:t(()=>[p(`div`,M,[n[6]||=p(`p`,{class:`instruction-text`},`Toggle the theme using the theme switch button in the top right corner.`,-1),p(`div`,{class:c([`themed-container`,{"dark-themed":a.isDarkTheme}])},[p(`div`,N,m(a.isDarkTheme?`Dark theme`:`Light theme`),1),p(`div`,P,[p(`img`,{src:a.themeImageUrl,alt:`Theme illustration`,class:`responsive-image`},null,8,F)])],2)])]),_:1},8,[`theme`])])]),_:1})])}var L=r(E,[[`render`,I],[`__scopeId`,`data-v-4f18ea1c`],[`__file`,`ResourcesPage.vue`]]);export{L as default};