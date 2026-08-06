import{$ as e,H as t,K as n,N as r,S as i,Z as a,h as o,n as s,t as c,v as l,x as u}from"./WinScrollViewer-Cel0kV6s.js";import{n as d,t as f}from"./WinToggleButton-Dj-8G30B.js";import{t as p}from"./WinControlExample-CxPQLLlF.js";var m={class:`gallery-item-page`},h={class:`gallery-page-content`},g={class:`page-header`},_={class:`header-actions`},v={class:`icon`},y={class:`example-layout`},b=`<StackPanel Spacing="8">
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
</StackPanel>`,x=`<template>
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
</style>`,S=`<StackPanel>
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
</style>`,w=s({__name:`StylePage`,setup(s){let w=n(!1),T=()=>{let e=document.documentElement,t=e.classList.contains(`theme-light`)||e.getAttribute(`data-theme`)===`light`?`dark`:`light`;e.classList.remove(`theme-light`,`theme-dark`),e.classList.add(`theme-${t}`),e.setAttribute(`data-theme`,t)},E=()=>{w.value=!w.value};return(n,s)=>(r(),l(`div`,m,[i(c,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[o(`div`,h,[o(`div`,g,[s[1]||=o(`div`,{class:`header-content`},[o(`h1`,{class:`page-title`},`Style`),o(`p`,{class:`page-description`},` Styles are reusable collections of property settings that define the appearance and behavior of controls. `)],-1),o(`div`,_,[i(d,{class:`header-action`,onClick:T},{default:t(()=>[...s[0]||=[o(`span`,{class:`icon`},``,-1)]]),_:1}),i(f,{IsChecked:w.value,class:`header-action`,"onUpdate:IsChecked":E},{default:t(()=>[o(`span`,v,e(w.value?``:``),1)]),_:1},8,[`IsChecked`])])]),s[6]||=o(`div`,{class:`page-intro`},[o(`p`,{class:`intro-text`},` The definition of styles is similar to other resources: app-level, page-level, control-level. `),o(`ul`,{class:`intro-list`},[o(`li`,null,[o(`strong`,null,`Styles`),u(` are reusable collections of property settings for a specific control type.`)]),o(`li`,null,[u(`A `),o(`strong`,null,`keyed style`),u(` is used for explicit application, while an `),o(`strong`,null,`implicit style`),u(` is used for automatic application to all controls of a type.`)]),o(`li`,null,`Styles improve maintainability, consistency, and reduce repetition in XAML code.`)])],-1),i(p,{headerText:`Creating and applying a style`,templateCode:b,vueCode:x},{example:t(()=>[o(`div`,y,[i(d,null,{default:t(()=>[...s[2]||=[u(`Default button`,-1)]]),_:1}),i(d,{class:a(`styled-button`)},{default:t(()=>[...s[3]||=[u(`Styled button`,-1)]]),_:1}),i(d,{class:a(`styled-button override-bg`)},{default:t(()=>[...s[4]||=[u(`Styled button (overridden)`,-1)]]),_:1})])]),_:1}),i(p,{headerText:`Style without a key (implicit style)`,templateCode:S,vueCode:C},{example:t(()=>[...s[5]||=[o(`div`,{class:`implicit-style-demo`},[o(`p`,{class:`styled-text`},`This style is applied automatically!`),o(`p`,{class:`styled-text`},`No need to set a key.`)],-1)]]),_:1})])]),_:1})]))}},[[`__scopeId`,`data-v-eeb6922b`]]);export{w as default};