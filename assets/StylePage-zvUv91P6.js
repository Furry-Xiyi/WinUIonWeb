import{$i as e,Bi as t,Ji as n,Mn as r,a as i,bi as a,ci as o,fi as s,gi as c,hi as l,ki as u,li as d,p as f,t as p}from"./ScrollViewer-CHNE18MA.js";import{t as m}from"./Button-DO0TiUOq.js";import{t as h}from"./ToggleButton-ZsjZg8Nu.js";import{t as g}from"./ControlExample-BKyw2NwY.js";import{t as _}from"./pageState-Djrh7EdY.js";var v=`<StackPanel Spacing="8">
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
</style>`,x={__name:`StylePage`,setup(t,{expose:r}){r();let s=a(`currentPage`),c=o(()=>s?.value||`xamlstyles`),{pageTheme:l,isFavoriteState:u,toggleTheme:d,toggleFavorite:x}=_(c.value),{t:S}=f(),C={currentPage:s,pageKey:c,pageTheme:l,isFavorite:u,toggleTheme:d,toggleFavorite:x,t:S,DefaultButtonLabel:o(()=>S(`ButtonMigration_DefaultButton`)),StyledButtonLabel:o(()=>S(`ButtonMigration_StyledButton`)),OverriddenButtonLabel:o(()=>S(`ButtonMigration_OverriddenButton`)),example1Template:v,example2Template:y,example2Vue:b,ButtonContent1:o(()=>e(u)?``:``),FontIcon:i,ButtonContentComputed:o,ButtonContentUnref:e,ref:n,computed:o,inject:a,ControlExample:g,Button:m,ToggleButton:h,get createPageState(){return _},get useI18n(){return f},ScrollViewer:p};return Object.defineProperty(C,"__isScriptSetup",{enumerable:!1,value:!0}),C}},S={class:`gallery-item-page`},C={class:`gallery-page-content`},w={class:`page-header`},T={class:`header-actions`},E={class:`example-layout`};function D(e,n,r,i,a,o){return u(),s(`div`,S,[c(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[d(`div`,C,[d(`div`,w,[n[0]||=d(`div`,{class:`header-content`},[d(`h1`,{class:`page-title`},`Style`),d(`p`,{class:`page-description`},` Styles are reusable collections of property settings that define the appearance and behavior of controls. `)],-1),d(`div`,T,[c(i.Button,{class:`header-action`,Click:`toggleTheme`},{default:t(()=>[c(i.FontIcon,{class:`icon`,Glyph:``})]),_:1}),c(i.ToggleButton,{IsChecked:`{x:Bind isFavorite, Mode=OneWay}`,class:`header-action`,Click:`toggleFavorite`},{default:t(()=>[c(i.FontIcon,{class:`icon`,Glyph:`{x:Bind ButtonContent1, Mode=OneWay}`})]),_:1})])]),n[2]||=d(`div`,{class:`page-intro`},[d(`p`,{class:`intro-text`},` The definition of styles is similar to other resources: app-level, page-level, control-level. `),d(`ul`,{class:`intro-list`},[d(`li`,null,[d(`strong`,null,`Styles`),l(` are reusable collections of property settings for a specific control type.`)]),d(`li`,null,[l(`A `),d(`strong`,null,`keyed style`),l(` is used for explicit application, while an `),d(`strong`,null,`implicit style`),l(` is used for automatic application to all controls of a type.`)]),d(`li`,null,`Styles improve maintainability, consistency, and reduce repetition in XAML code.`)])],-1),c(i.ControlExample,{theme:i.pageTheme,headerText:`Creating and applying a style`,Xaml:`{x:Bind example1Template}`},{example:t(()=>[d(`div`,E,[c(i.Button,{Content:`{x:Bind DefaultButtonLabel, Mode=OneWay}`}),c(i.Button,{Background:`{ThemeResource AccentFillColorDefaultBrush}`,MinWidth:`200`,Content:`{x:Bind StyledButtonLabel, Mode=OneWay}`}),c(i.Button,{Background:`{ThemeResource SystemFillColorCriticalBrush}`,MinWidth:`200`,Content:`{x:Bind OverriddenButtonLabel, Mode=OneWay}`})])]),_:1},8,[`theme`]),c(i.ControlExample,{theme:i.pageTheme,headerText:`Style without a key (implicit style)`,templateCode:i.example2Template,vueCode:i.example2Vue},{example:t(()=>[...n[1]||=[d(`div`,{class:`implicit-style-demo`},[d(`p`,{class:`styled-text`},`This style is applied automatically!`),d(`p`,{class:`styled-text`},`No need to set a key.`)],-1)]]),_:1},8,[`theme`])])]),_:1})])}var O=r(x,[[`render`,D],[`__scopeId`,`data-v-e67118aa`],[`__file`,`StylePage.vue`]]);export{O as default};