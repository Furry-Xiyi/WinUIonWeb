import{Ei as e,Gi as t,Li as n,Wt as r,Xi as i,_i as a,a as o,ai as s,et as c,fi as l,li as u,oi as d,pi as f,t as p}from"./ScrollViewer-BWDA_C78.js";import{t as m}from"./Button-BNDPNdYJ.js";import{t as h}from"./ToggleButton-HP5wmrvH.js";import{t as g}from"./ControlExample-CzGyf8u0.js";import{t as _}from"./pageState-CcJibQcm.js";var v=`<StackPanel Spacing="8">
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
</style>`,x={__name:`StylePage`,setup(e,{expose:n}){n();let r=a(`currentPage`),l=s(()=>r?.value||`xamlstyles`),{pageTheme:u,isFavoriteState:d,toggleTheme:f,toggleFavorite:x}=_(l.value),{t:S}=c(),C={currentPage:r,pageKey:l,pageTheme:u,isFavorite:d,toggleTheme:f,toggleFavorite:x,t:S,DefaultButtonLabel:s(()=>S(`ButtonMigration_DefaultButton`)),StyledButtonLabel:s(()=>S(`ButtonMigration_StyledButton`)),OverriddenButtonLabel:s(()=>S(`ButtonMigration_OverriddenButton`)),example1Template:v,example2Template:y,example2Vue:b,ButtonContent1:s(()=>i(d)?``:``),FontIcon:o,ButtonContentComputed:s,ButtonContentUnref:i,ref:t,computed:s,inject:a,ControlExample:g,Button:m,ToggleButton:h,get createPageState(){return _},get useI18n(){return c},ScrollViewer:p};return Object.defineProperty(C,"__isScriptSetup",{enumerable:!1,value:!0}),C}},S={class:`gallery-item-page`},C={class:`gallery-page-content`},w={class:`page-header`},T={class:`header-actions`},E={class:`example-layout`};function D(t,r,i,a,o,s){return e(),u(`div`,S,[f(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[d(`div`,C,[d(`div`,w,[r[0]||=d(`div`,{class:`header-content`},[d(`h1`,{class:`page-title`},`Style`),d(`p`,{class:`page-description`},` Styles are reusable collections of property settings that define the appearance and behavior of controls. `)],-1),d(`div`,T,[f(a.Button,{class:`header-action`,Click:`toggleTheme`},{default:n(()=>[f(a.FontIcon,{class:`icon`,Glyph:``})]),_:1}),f(a.ToggleButton,{IsChecked:`{x:Bind isFavorite, Mode=OneWay}`,class:`header-action`,Click:`toggleFavorite`},{default:n(()=>[f(a.FontIcon,{class:`icon`,Glyph:`{x:Bind ButtonContent1, Mode=OneWay}`})]),_:1})])]),r[2]||=d(`div`,{class:`page-intro`},[d(`p`,{class:`intro-text`},` The definition of styles is similar to other resources: app-level, page-level, control-level. `),d(`ul`,{class:`intro-list`},[d(`li`,null,[d(`strong`,null,`Styles`),l(` are reusable collections of property settings for a specific control type.`)]),d(`li`,null,[l(`A `),d(`strong`,null,`keyed style`),l(` is used for explicit application, while an `),d(`strong`,null,`implicit style`),l(` is used for automatic application to all controls of a type.`)]),d(`li`,null,`Styles improve maintainability, consistency, and reduce repetition in XAML code.`)])],-1),f(a.ControlExample,{theme:a.pageTheme,headerText:`Creating and applying a style`,Xaml:`{x:Bind example1Template}`},{example:n(()=>[d(`div`,E,[f(a.Button,{Content:`{x:Bind DefaultButtonLabel, Mode=OneWay}`}),f(a.Button,{Background:`{ThemeResource AccentFillColorDefaultBrush}`,MinWidth:`200`,Content:`{x:Bind StyledButtonLabel, Mode=OneWay}`}),f(a.Button,{Background:`{ThemeResource SystemFillColorCriticalBrush}`,MinWidth:`200`,Content:`{x:Bind OverriddenButtonLabel, Mode=OneWay}`})])]),_:1},8,[`theme`]),f(a.ControlExample,{theme:a.pageTheme,headerText:`Style without a key (implicit style)`,templateCode:a.example2Template,vueCode:a.example2Vue},{example:n(()=>[...r[1]||=[d(`div`,{class:`implicit-style-demo`},[d(`p`,{class:`styled-text`},`This style is applied automatically!`),d(`p`,{class:`styled-text`},`No need to set a key.`)],-1)]]),_:1},8,[`theme`])])]),_:1})])}var O=r(x,[[`render`,D],[`__scopeId`,`data-v-e67118aa`],[`__file`,`StylePage.vue`]]);export{O as default};