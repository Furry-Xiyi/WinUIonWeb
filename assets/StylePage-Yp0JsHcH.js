import{$i as e,Bi as t,Mn as n,a as r,bi as i,ci as a,fi as o,gi as s,hi as c,ki as l,li as u,p as d,t as f}from"./ScrollViewer-B43ymvAj.js";import{t as p}from"./Button-B49t7g4C.js";import{t as m}from"./ToggleButton-DDZy2gVz.js";import{t as h}from"./ControlExample-Ddvmn5_c.js";import{t as g}from"./pageState-BQHW0me4.js";var _={class:`gallery-item-page`},v={class:`gallery-page-content`},y={class:`page-header`},b={class:`header-actions`},x={class:`example-layout`},S=`<StackPanel>
    <StackPanel.Resources>
        <Style TargetType="TextBlock">
            <Setter Property="FontSize" Value="16" />
            <Setter Property="FontFamily" Value="Consolas" />
            <Setter Property="FontWeight" Value="Bold" />
        </Style>
    </StackPanel.Resources>

    <TextBlock Text="This style is applied automatically!" />
    <TextBlock Text="No need to set a key." />
</StackPanel>`,C=`<template>
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
</style>`,w=n({__name:`StylePage`,setup(n){let w=i(`currentPage`),{pageTheme:T,isFavoriteState:E,toggleTheme:D,toggleFavorite:O}=g(a(()=>w?.value||`xamlstyles`).value),{t:k}=d();return a(()=>k(`ButtonMigration_DefaultButton`)),a(()=>k(`ButtonMigration_StyledButton`)),a(()=>k(`ButtonMigration_OverriddenButton`)),a(()=>e(E)?``:``),(n,i)=>(l(),o(`div`,_,[s(f,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[u(`div`,v,[u(`div`,y,[i[0]||=u(`div`,{class:`header-content`},[u(`h1`,{class:`page-title`},`Style`),u(`p`,{class:`page-description`},` Styles are reusable collections of property settings that define the appearance and behavior of controls. `)],-1),u(`div`,b,[s(p,{class:`header-action`,Click:`toggleTheme`},{default:t(()=>[s(r,{class:`icon`,Glyph:``})]),_:1}),s(m,{IsChecked:`{x:Bind isFavorite, Mode=OneWay}`,class:`header-action`,Click:`toggleFavorite`},{default:t(()=>[s(r,{class:`icon`,Glyph:`{x:Bind ButtonContent1, Mode=OneWay}`})]),_:1})])]),i[2]||=u(`div`,{class:`page-intro`},[u(`p`,{class:`intro-text`},` The definition of styles is similar to other resources: app-level, page-level, control-level. `),u(`ul`,{class:`intro-list`},[u(`li`,null,[u(`strong`,null,`Styles`),c(` are reusable collections of property settings for a specific control type.`)]),u(`li`,null,[c(`A `),u(`strong`,null,`keyed style`),c(` is used for explicit application, while an `),u(`strong`,null,`implicit style`),c(` is used for automatic application to all controls of a type.`)]),u(`li`,null,`Styles improve maintainability, consistency, and reduce repetition in XAML code.`)])],-1),s(h,{theme:e(T),headerText:`Creating and applying a style`,Xaml:`{x:Bind example1Template}`},{example:t(()=>[u(`div`,x,[s(p,{Content:`{x:Bind DefaultButtonLabel, Mode=OneWay}`}),s(p,{Background:`{ThemeResource AccentFillColorDefaultBrush}`,MinWidth:`200`,Content:`{x:Bind StyledButtonLabel, Mode=OneWay}`}),s(p,{Background:`{ThemeResource SystemFillColorCriticalBrush}`,MinWidth:`200`,Content:`{x:Bind OverriddenButtonLabel, Mode=OneWay}`})])]),_:1},8,[`theme`]),s(h,{theme:e(T),headerText:`Style without a key (implicit style)`,templateCode:S,vueCode:C},{example:t(()=>[...i[1]||=[u(`div`,{class:`implicit-style-demo`},[u(`p`,{class:`styled-text`},`This style is applied automatically!`),u(`p`,{class:`styled-text`},`No need to set a key.`)],-1)]]),_:1},8,[`theme`])])]),_:1})]))}},[[`__scopeId`,`data-v-e67118aa`]]);export{w as default};