import{$ as e,E as t,H as n,L as r,N as i,S as a,X as o,Z as s,h as c,m as l,n as u,t as d,v as f,x as p}from"./WinScrollViewer-DPrZnleG.js";import{c as m,r as h}from"./index-CMPZyTwE.js";import{t as g}from"./WinControlExample-C0uhK7Jb.js";import{t as _}from"./pageState-Mr-1-Xo1.js";var v={class:`gallery-item-page`},y={class:`gallery-page-content`},b={class:`page-header`},x={class:`page-actions`},S={class:`icon`},C={class:`description-block`},w={class:`custom-theme-demo`},T={class:`theme-label`},E={class:`theme-image`},D=[`src`],O=`<!-- App.xaml -->
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
</div>`,P=u({__name:`ResourcesPage`,setup(u){let P=t(`currentPage`),{pageTheme:F,isFavoriteState:I,toggleTheme:L,toggleFavorite:R}=_(l(()=>P?.value||`xamlresources`).value),z=l(()=>F.value===`dark`),B=l(()=>z.value?`https://via.placeholder.com/600x200/333333/EEEEEE?text=Dark+Theme+Image`:`https://via.placeholder.com/600x200/EEEEEE/333333?text=Light+Theme+Image`);return(t,l)=>{let u=r(`RouterLink`);return i(),f(`div`,v,[a(d,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[c(`div`,y,[c(`div`,b,[l[1]||=c(`h1`,{class:`page-title`},`Resources`,-1),c(`div`,x,[a(m,{onClick:o(L),class:`header-action`},{default:n(()=>[...l[0]||=[c(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),a(h,{IsChecked:o(I),class:`header-action`,"onUpdate:IsChecked":o(R)},{default:n(()=>[c(`span`,S,e(o(I)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),l[8]||=c(`div`,{class:`section-header`},[c(`h2`,{class:`section-title`},`Creating and using XAML resources`)],-1),l[9]||=c(`div`,{class:`description-block`},[c(`p`,null,[p(` XAML Resources are defined using the `),c(`code`,null,`ResourceDictionary`),p(` element. The important parts are `),c(`strong`,null,`the resource's key`),p(` (a unique identifier) and `),c(`strong`,null,`the value`),p(` (like a color or brush). `)])],-1),l[10]||=c(`div`,{class:`description-block`},[c(`ul`,{class:`feature-list`},[c(`li`,null,[c(`strong`,null,`App-level:`),p(` Resources are defined globally, accessible throughout the application.`)]),c(`li`,null,[c(`strong`,null,`Page-level:`),p(` Resources are defined specific to a particular page.`)]),c(`li`,null,[c(`strong`,null,`Control-level:`),p(` Resources are defined local to a specific control, such as a Button or Grid.`)])])],-1),l[11]||=c(`div`,{class:`description-block`},[c(`p`,null,[c(`strong`,null,`Tips`)]),c(`ul`,{class:`feature-list`},[c(`li`,null,[c(`strong`,null,`Naming:`),p(` descriptive keys should always be used for resources to make them easier to identify.`)]),c(`li`,null,[c(`strong`,null,`Scope:`),p(` Resources should be defined at the narrowest scope possible to improve maintainability.`)]),c(`li`,null,[c(`strong`,null,`Access:`),p(),c(`code`,null,`{StaticResource Key}`),p(` is used in XAML for most cases, and `),c(`code`,null,`Resources["Key"]`),p(` is used in C# for runtime access.`)])])],-1),a(g,{theme:o(F),headerText:`Resource hierarchy example`,templateCode:O,vueCode:k},{example:n(()=>[...l[2]||=[c(`div`,{class:`resource-demo primary-bg`},[c(`div`,{class:`resource-text white-text large-text`},`Using application-level resources`),c(`div`,{class:`resource-demo highlight-bg`},[c(`div`,{class:`resource-text white-text medium-text`},`Using page-level resources`),c(`div`,{class:`resource-demo`},[c(`div`,{class:`resource-demo control-bg`},[c(`div`,{class:`resource-text white-text small-text`},`Using control-level resources`)])])])],-1)]]),_:1},8,[`theme`]),l[12]||=c(`div`,{class:`section-header`,style:{"margin-top":`32px`}},[c(`h2`,{class:`section-title`},`Theme resources`)],-1),c(`div`,C,[c(`p`,null,[l[4]||=p(` WinUI 3 includes built-in theme resources for commonly used colors. See all brushes on the `,-1),a(u,{to:`/colors`,class:`hyperlink`},{default:n(()=>[...l[3]||=[p(`Color page`,-1)]]),_:1}),l[5]||=p(`. `,-1)])]),l[13]||=c(`div`,{class:`description-block`},[c(`ul`,{class:`feature-list`},[c(`li`,null,[c(`strong`,null,`ThemeResource`),p(` is used for dynamic theme-based updates.`)]),c(`li`,null,[c(`strong`,null,`ThemeDictionaries`),p(` are defined to provide different values for light and dark themes.`)]),c(`li`,null,`A fallback value should always be provided to ensure compatibility with undefined themes.`)])],-1),a(g,{theme:o(F),headerText:`StaticResource versus ThemeResource`,templateCode:A,vueCode:j},{example:n(()=>[...l[6]||=[c(`div`,{class:`theme-comparison`},[c(`p`,{class:`instruction-text`},`Toggle the theme using the theme switch button in the top right corner.`),c(`div`,{class:`static-resource-demo`},[c(`div`,{class:`demo-text`},` StaticResource uses the value defined when the app starts and does not update when the theme changes. `)]),c(`div`,{class:`theme-resource-demo`},[c(`div`,{class:`demo-text`},` ThemeResource adapts automatically to the current theme. If the app switches from light to dark, the color defined by ThemeResource changes. `)])],-1)]]),_:1},8,[`theme`]),a(g,{theme:o(F),headerText:`Define a new theme resource`,templateCode:M,vueCode:N},{example:n(()=>[c(`div`,w,[l[7]||=c(`p`,{class:`instruction-text`},`Toggle the theme using the theme switch button in the top right corner.`,-1),c(`div`,{class:s([`themed-container`,{"dark-themed":z.value}])},[c(`div`,T,e(z.value?`Dark theme`:`Light theme`),1),c(`div`,E,[c(`img`,{src:B.value,alt:`Theme illustration`,class:`responsive-image`},null,8,D)])],2)])]),_:1},8,[`theme`])])]),_:1})])}}},[[`__scopeId`,`data-v-d80aa038`]]);export{P as default};