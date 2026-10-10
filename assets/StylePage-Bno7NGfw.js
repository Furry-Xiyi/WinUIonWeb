import{Fi as e,Ji as t,Ui as n,Wt as r,a as i,di as a,et as o,hi as s,ii as c,ri as l,si as u,t as d,ui as f,wi as p}from"./ScrollViewer-PoO_ma9Z.js";import{t as m}from"./Button-DjU0urmJ.js";import{t as h}from"./ToggleButton-DwmhXZge.js";import{t as g}from"./ControlExample-C1ahTZEr.js";import{t as _}from"./pageState-BN3kXI7L.js";var v=`<StackPanel Spacing="8">
    <StackPanel.Resources>
        <Style x:Key="CustomButtonStyle" TargetType="Button" BasedOn="{StaticResource ButtonRevealStyle}">
            <Setter Property="Background" Value="{ThemeResource AccentAcrylicBackgroundFillColorDefaultBrush}" />
            <Setter Property="MinWidth" Value="200" />
        </Style>
    </StackPanel.Resources>
    <Button Content="Default button" />
    <Button Content="Styled button" Style="{StaticResource CustomButtonStyle}" />
    <Button Content="Styled button (overridden)" Style="{StaticResource CustomButtonStyle}"
            Background="{ThemeResource SystemFillColorCriticalBackgroundBrush}" />
</StackPanel>`,y=`<StackPanel>
    <StackPanel.Resources>
        <Style TargetType="TextBlock">
            <Setter Property="FontSize" Value="16" />
            <Setter Property="FontFamily" Value="Consolas" />
            <Setter Property="FontWeight" Value="Bold" />
        </Style>
    </StackPanel.Resources>

    <TextBlock Text="This style is applied automatically!" />
    <TextBlock Text="No need to set a key." />
</StackPanel>`,b=`<template>
  <div class="implicit-style-demo">
    <p class="styled-text">This style is applied automatically!</p>
    <p class="styled-text">No need to set a key.</p>
  </div>
</template>

<style scoped>
.styled-text {
  font-size: 16px;
  font-family: 'Consolas', monospace;
  font-weight: bold;
}
</style>`,x={__name:`StylePage`,setup(e,{expose:r}){r();let a=s(`currentPage`),c=l(()=>a?.value||`xamlstyles`),{pageTheme:u,isFavoriteState:f,toggleTheme:p,toggleFavorite:x}=_(c.value),{t:S}=o(),C={currentPage:a,pageKey:c,pageTheme:u,isFavorite:f,toggleTheme:p,toggleFavorite:x,t:S,DefaultButtonLabel:l(()=>S(`ButtonMigration_DefaultButton`)),StyledButtonLabel:l(()=>S(`ButtonMigration_StyledButton`)),OverriddenButtonLabel:l(()=>S(`ButtonMigration_OverriddenButton`)),example1Template:v,example2Template:y,example2Vue:b,ButtonContent1:l(()=>t(f)?``:``),FontIcon:i,ButtonContentComputed:l,ButtonContentUnref:t,ref:n,computed:l,inject:s,ControlExample:g,Button:m,ToggleButton:h,get createPageState(){return _},get useI18n(){return o},ScrollViewer:d};return Object.defineProperty(C,"__isScriptSetup",{enumerable:!1,value:!0}),C}},S={class:`gallery-item-page`},C={class:`gallery-page-content`},w={class:`page-header`},T={class:`header-actions`},E={class:`example-layout`};function D(t,n,r,i,o,s){return p(),u(`div`,S,[a(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[c(`div`,C,[c(`div`,w,[n[0]||=c(`div`,{class:`header-content`},[c(`h1`,{class:`page-title`},`Style`),c(`p`,{class:`page-description`},` Styles are reusable collections of property settings that define the appearance and behavior of controls. `)],-1),c(`div`,T,[a(i.Button,{class:`header-action`,Click:`toggleTheme`},{default:e(()=>[a(i.FontIcon,{class:`icon`,Glyph:``})]),_:1}),a(i.ToggleButton,{IsChecked:`{x:Bind isFavorite, Mode=OneWay}`,class:`header-action`,Click:`toggleFavorite`},{default:e(()=>[a(i.FontIcon,{class:`icon`,Glyph:`{x:Bind ButtonContent1, Mode=OneWay}`})]),_:1})])]),n[2]||=c(`div`,{class:`page-intro`},[c(`p`,{class:`intro-text`},` The definition of styles is similar to other resources: app-level, page-level, control-level. `),c(`ul`,{class:`intro-list`},[c(`li`,null,[c(`strong`,null,`Styles`),f(` are reusable collections of property settings for a specific control type.`)]),c(`li`,null,[f(`A `),c(`strong`,null,`keyed style`),f(` is used for explicit application, while an `),c(`strong`,null,`implicit style`),f(` is used for automatic application to all controls of a type.`)]),c(`li`,null,`Styles improve maintainability, consistency, and reduce repetition in XAML code.`)])],-1),a(i.ControlExample,{theme:i.pageTheme,headerText:`Creating and applying a style`,Xaml:`{x:Bind example1Template}`},{example:e(()=>[c(`div`,E,[a(i.Button,{Content:`{x:Bind DefaultButtonLabel, Mode=OneWay}`}),a(i.Button,{Background:`{ThemeResource AccentFillColorDefaultBrush}`,MinWidth:`200`,Content:`{x:Bind StyledButtonLabel, Mode=OneWay}`}),a(i.Button,{Background:`{ThemeResource SystemFillColorCriticalBrush}`,MinWidth:`200`,Content:`{x:Bind OverriddenButtonLabel, Mode=OneWay}`})])]),_:1},8,[`theme`]),a(i.ControlExample,{theme:i.pageTheme,headerText:`Style without a key (implicit style)`,templateCode:i.example2Template,vueCode:i.example2Vue},{example:e(()=>[...n[1]||=[c(`div`,{class:`implicit-style-demo`},[c(`p`,{class:`styled-text`},`This style is applied automatically!`),c(`p`,{class:`styled-text`},`No need to set a key.`)],-1)]]),_:1},8,[`theme`])])]),_:1})])}var O=r(x,[[`render`,D],[`__scopeId`,`data-v-e67118aa`],[`__file`,`StylePage.vue`]]);export{O as default};