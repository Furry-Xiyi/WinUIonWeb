import{$ as e,E as t,H as n,N as r,S as i,X as a,Z as o,h as s,m as c,n as l,t as u,v as d,x as f}from"./WinScrollViewer-DPrZnleG.js";import{c as p,r as m}from"./index-CMPZyTwE.js";import{t as h}from"./WinControlExample-C0uhK7Jb.js";import{t as g}from"./pageState-Mr-1-Xo1.js";var _={class:`gallery-item-page`},v={class:`gallery-page-content`},y={class:`page-header`},b={class:`header-actions`},x={class:`icon`},S={class:`example-layout`},C=`<StackPanel Spacing="8">
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
</StackPanel>`,w=`<template>
  <div class="example-layout">
    <WinButton>Default button</WinButton>
    <WinButton :class="'styled-button'">Styled button</WinButton>
    <WinButton :class="'styled-button override-bg'">Styled button (overridden)</WinButton>
  </div>
</template>

<style scoped>
.styled-button {
  background: var(--accent-default);
  min-width: 200px;
}

.override-bg {
  background: var(--system-fill-critical);
}
</style>`,T=`<StackPanel>
    <StackPanel.Resources>
        <Style TargetType="TextBlock">
            <Setter Property="FontSize" Value="16" />
            <Setter Property="FontFamily" Value="Consolas" />
            <Setter Property="FontWeight" Value="Bold" />
        </Style>
    </StackPanel.Resources>

    <TextBlock Text="This style is applied automatically!" />
    <TextBlock Text="No need to set a key." />
</StackPanel>`,E=`<template>
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
</style>`,D=l({__name:`StylePage`,setup(l){let D=t(`currentPage`),{pageTheme:O,isFavoriteState:k,toggleTheme:A,toggleFavorite:j}=g(c(()=>D?.value||`xamlstyles`).value);return(t,c)=>(r(),d(`div`,_,[i(u,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[s(`div`,v,[s(`div`,y,[c[1]||=s(`div`,{class:`header-content`},[s(`h1`,{class:`page-title`},`Style`),s(`p`,{class:`page-description`},` Styles are reusable collections of property settings that define the appearance and behavior of controls. `)],-1),s(`div`,b,[i(p,{class:`header-action`,onClick:a(A)},{default:n(()=>[...c[0]||=[s(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),i(m,{IsChecked:a(k),class:`header-action`,"onUpdate:IsChecked":a(j)},{default:n(()=>[s(`span`,x,e(a(k)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),c[6]||=s(`div`,{class:`page-intro`},[s(`p`,{class:`intro-text`},` The definition of styles is similar to other resources: app-level, page-level, control-level. `),s(`ul`,{class:`intro-list`},[s(`li`,null,[s(`strong`,null,`Styles`),f(` are reusable collections of property settings for a specific control type.`)]),s(`li`,null,[f(`A `),s(`strong`,null,`keyed style`),f(` is used for explicit application, while an `),s(`strong`,null,`implicit style`),f(` is used for automatic application to all controls of a type.`)]),s(`li`,null,`Styles improve maintainability, consistency, and reduce repetition in XAML code.`)])],-1),i(h,{theme:a(O),headerText:`Creating and applying a style`,templateCode:C,vueCode:w},{example:n(()=>[s(`div`,S,[i(p,null,{default:n(()=>[...c[2]||=[f(`Default button`,-1)]]),_:1}),i(p,{class:o(`styled-button`)},{default:n(()=>[...c[3]||=[f(`Styled button`,-1)]]),_:1}),i(p,{class:o(`styled-button override-bg`)},{default:n(()=>[...c[4]||=[f(`Styled button (overridden)`,-1)]]),_:1})])]),_:1},8,[`theme`]),i(h,{theme:a(O),headerText:`Style without a key (implicit style)`,templateCode:T,vueCode:E},{example:n(()=>[...c[5]||=[s(`div`,{class:`implicit-style-demo`},[s(`p`,{class:`styled-text`},`This style is applied automatically!`),s(`p`,{class:`styled-text`},`No need to set a key.`)],-1)]]),_:1},8,[`theme`])])]),_:1})]))}},[[`__scopeId`,`data-v-aa28abb6`]]);export{D as default};