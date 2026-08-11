import{$ as e,E as t,H as n,K as r,N as i,S as a,X as o,g as s,h as c,m as l,n as u,t as d}from"./WinScrollViewer-DPrZnleG.js";import{t as f}from"./WinTextBlock-CeUskDRc.js";import{a as p}from"./i18n-DA-FIA7C.js";import{c as m,r as h}from"./index-CMPZyTwE.js";import{t as g}from"./WinControlExample-C0uhK7Jb.js";import{t as _}from"./pageState-Mr-1-Xo1.js";import{t as v}from"./WinMenuBar-BtloTbLJ.js";var y={class:`gallery-item-page`},b={class:`page-heading`},x={class:`page-header-actions`},S={class:`icon`},C={class:`gallery-page-content`},w={class:`sample-stack`},T={class:`sample-stack`},E={class:`sample-stack`},D=`<WinMenuBar>
  <WinMenuBarItem Title="File">
    <WinMenuFlyoutItem Text="New" />
    <WinMenuFlyoutItem Text="Open..." />
    <WinMenuFlyoutItem Text="Save" />
    <WinMenuFlyoutItem Text="Exit" />
  </WinMenuBarItem>
  <WinMenuBarItem Title="Edit">
    <WinMenuFlyoutItem Text="Undo" />
    <WinMenuFlyoutItem Text="Cut" />
    <WinMenuFlyoutItem Text="Copy" />
    <WinMenuFlyoutItem Text="Paste" />
  </WinMenuBarItem>
  <WinMenuBarItem Title="Help">
    <WinMenuFlyoutItem Text="About" />
  </WinMenuBarItem>
</WinMenuBar>`,O=`<WinMenuBar>
  <WinMenuBarItem Title="File">
    <WinMenuFlyoutItem Text="New">
      <WinMenuFlyoutItem.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="N" Modifiers="Control" />
      </WinMenuFlyoutItem.KeyboardAccelerators>
    </WinMenuFlyoutItem>
    <WinMenuFlyoutItem Text="Open...">
      <WinMenuFlyoutItem.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="O" Modifiers="Control" />
      </WinMenuFlyoutItem.KeyboardAccelerators>
    </WinMenuFlyoutItem>
    <WinMenuFlyoutItem Text="Save">
      <WinMenuFlyoutItem.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="S" Modifiers="Control" />
      </WinMenuFlyoutItem.KeyboardAccelerators>
    </WinMenuFlyoutItem>
    <WinMenuFlyoutItem Text="Exit">
      <WinMenuFlyoutItem.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="E" Modifiers="Control" />
      </WinMenuFlyoutItem.KeyboardAccelerators>
    </WinMenuFlyoutItem>
  </WinMenuBarItem>
  <WinMenuBarItem Title="Edit">
    <WinMenuFlyoutItem Text="Undo">
      <WinMenuFlyoutItem.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="Z" Modifiers="Control" />
      </WinMenuFlyoutItem.KeyboardAccelerators>
    </WinMenuFlyoutItem>
    <WinMenuFlyoutItem Text="Cut">
      <WinMenuFlyoutItem.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="X" Modifiers="Control" />
      </WinMenuFlyoutItem.KeyboardAccelerators>
    </WinMenuFlyoutItem>
    <WinMenuFlyoutItem Text="Copy">
      <WinMenuFlyoutItem.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="C" Modifiers="Control" />
      </WinMenuFlyoutItem.KeyboardAccelerators>
    </WinMenuFlyoutItem>
    <WinMenuFlyoutItem Text="Paste">
      <WinMenuFlyoutItem.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="V" Modifiers="Control" />
      </WinMenuFlyoutItem.KeyboardAccelerators>
    </WinMenuFlyoutItem>
  </WinMenuBarItem>
  <WinMenuBarItem Title="Help">
    <WinMenuFlyoutItem Text="About">
      <WinMenuFlyoutItem.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="I" Modifiers="Control" />
      </WinMenuFlyoutItem.KeyboardAccelerators>
    </WinMenuFlyoutItem>
  </WinMenuBarItem>
</WinMenuBar>`,k=`<WinMenuBar>
  <WinMenuBarItem Title="File">
    <WinMenuFlyoutSubItem Text="New">
      <WinMenuFlyoutItem Text="Plain Text Document" />
      <WinMenuFlyoutItem Text="Rich Text Document" />
      <WinMenuFlyoutItem Text="Other Formats..." />
    </WinMenuFlyoutSubItem>
    <WinMenuFlyoutItem Text="Open..." />
    <WinMenuFlyoutItem Text="Save" />
    <WinMenuFlyoutSeparator />
    <WinMenuFlyoutItem Text="Exit" />
  </WinMenuBarItem>
  <WinMenuBarItem Title="Edit">
    <WinMenuFlyoutItem Text="Undo" />
    <WinMenuFlyoutItem Text="Cut" />
    <WinMenuFlyoutItem Text="Copy" />
    <WinMenuFlyoutItem Text="Paste" />
  </WinMenuBarItem>
  <WinMenuBarItem Title="View">
    <WinMenuFlyoutItem Text="Output" />
    <WinMenuFlyoutSeparator />
    <WinRadioMenuFlyoutItem Text="Landscape" GroupName="OrientationGroup" />
    <WinRadioMenuFlyoutItem Text="Portrait" GroupName="OrientationGroup" IsChecked="True" />
    <WinMenuFlyoutSeparator />
    <WinRadioMenuFlyoutItem Text="Small icons" GroupName="SizeGroup" />
    <WinRadioMenuFlyoutItem Text="Medium icons" GroupName="SizeGroup" IsChecked="True" />
    <WinRadioMenuFlyoutItem Text="Large icons" GroupName="SizeGroup" />
  </WinMenuBarItem>
  <WinMenuBarItem Title="Help">
    <WinMenuFlyoutItem Text="About" />
  </WinMenuBarItem>
</WinMenuBar>`,A=u({__name:`MenuBarPage`,setup(u){let{t:A}=p(),j=t(`currentPage`),{isFavoriteState:M,pageTheme:N,toggleTheme:P,toggleFavorite:F}=_(l(()=>j?.value||`menubar`).value),I=r(``),L=r(``),R=r(``),z=e=>A(`sample.you-clicked`,{name:e.Text}),B=[{Title:A(`text.file`),Items:[{Text:A(`sample.standarduicommand.new`)},{Text:A(`sample.standarduicommand.open`)},{Text:A(`text.save`)},{Text:A(`sample.standarduicommand.exit`)}]},{Title:A(`text.edit`),Items:[{Text:A(`sample.menubar.undo`)},{Text:A(`sample.menubar.cut`)},{Text:A(`sample.copy`)},{Text:A(`sample.menubar.paste`)}]},{Title:A(`text.help`),Items:[{Text:A(`text.about`)}]}],V=[{Title:A(`text.file`),Items:[{Text:A(`sample.standarduicommand.new`),KeyboardAccelerators:[{Key:`N`,Modifiers:[`Control`]}]},{Text:A(`sample.open`),KeyboardAccelerators:[{Key:`O`,Modifiers:[`Control`]}]},{Text:A(`text.save`),KeyboardAccelerators:[{Key:`S`,Modifiers:[`Control`]}]},{Text:A(`sample.standarduicommand.exit`),KeyboardAccelerators:[{Key:`E`,Modifiers:[`Control`]}]}]},{Title:A(`text.edit`),Items:[{Text:A(`sample.menubar.undo`),KeyboardAccelerators:[{Key:`Z`,Modifiers:[`Control`]}]},{Text:A(`sample.menubar.cut`),KeyboardAccelerators:[{Key:`X`,Modifiers:[`Control`]}]},{Text:A(`sample.copy`),KeyboardAccelerators:[{Key:`C`,Modifiers:[`Control`]}]},{Text:A(`sample.menubar.paste`),KeyboardAccelerators:[{Key:`V`,Modifiers:[`Control`]}]}]},{Title:A(`text.help`),Items:[{Text:A(`text.about`),KeyboardAccelerators:[{Key:`I`,Modifiers:[`Control`]}]}]}],H=r([{Title:A(`text.file`),Items:[{Kind:`MenuFlyoutSubItem`,Text:A(`sample.standarduicommand.new`),Items:[{Text:A(`sample.menubar.plain-text`)},{Text:A(`sample.menubar.rich-text`)},{Text:A(`sample.menubar.other-formats`)}]},{Text:A(`sample.open`)},{Text:A(`text.save`)},{Kind:`MenuFlyoutSeparator`},{Text:A(`sample.standarduicommand.exit`)}]},{Title:A(`text.edit`),Items:[{Text:A(`sample.menubar.undo`)},{Text:A(`sample.menubar.cut`)},{Text:A(`sample.copy`)},{Text:A(`sample.menubar.paste`)}]},{Title:A(`text.view`),Items:[{Text:A(`sample.menubar.output`)},{Kind:`MenuFlyoutSeparator`},{Kind:`RadioMenuFlyoutItem`,Text:A(`sample.landscape`),GroupName:`OrientationGroup`,IsChecked:!1},{Kind:`RadioMenuFlyoutItem`,Text:A(`sample.portrait`),GroupName:`OrientationGroup`,IsChecked:!0},{Kind:`MenuFlyoutSeparator`},{Kind:`RadioMenuFlyoutItem`,Text:A(`sample.small-icons`),GroupName:`SizeGroup`,IsChecked:!1},{Kind:`RadioMenuFlyoutItem`,Text:A(`sample.medium-icons`),GroupName:`SizeGroup`,IsChecked:!0},{Kind:`RadioMenuFlyoutItem`,Text:A(`sample.large-icons`),GroupName:`SizeGroup`,IsChecked:!1}]},{Title:A(`text.help`),Items:[{Text:A(`text.about`)}]}]);return(t,r)=>(i(),s(d,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[c(`div`,y,[c(`div`,b,[a(f,{class:`page-header`,Text:t.$t(`text.menubar`)},null,8,[`Text`]),a(f,{class:`page-description`,Text:t.$t(`text.the-menubar-simplifies-the-creation-of-basic-men`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),c(`div`,x,[a(m,{class:`header-action`,onClick:o(P)},{default:n(()=>[...r[3]||=[c(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),a(h,{IsChecked:o(M),class:`header-action`,"onUpdate:IsChecked":o(F)},{default:n(()=>[c(`span`,S,e(o(M)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),c(`div`,C,[a(g,{class:`basic-input-example-theme`,headerText:t.$t(`text.a-simple-menubar`),theme:o(N),vue:D},{example:n(()=>[c(`div`,w,[a(f,{Text:I.value,TextWrapping:`WrapWholeWords`},null,8,[`Text`]),a(v,{Items:o(B),Theme:o(N),onItemClick:r[0]||=e=>I.value=z(e.Item)},null,8,[`Items`,`Theme`])])]),_:1},8,[`headerText`,`theme`]),a(g,{class:`basic-input-example-theme`,headerText:t.$t(`sample.menubar.keyboard`),theme:o(N),vue:O},{example:n(()=>[c(`div`,T,[a(f,{Text:L.value,TextWrapping:`WrapWholeWords`},null,8,[`Text`]),a(v,{Items:V,Theme:o(N),onItemClick:r[1]||=e=>L.value=z(e.Item)},null,8,[`Theme`])])]),_:1},8,[`headerText`,`theme`]),a(g,{class:`basic-input-example-theme`,headerText:t.$t(`sample.menubar.submenus`),theme:o(N),vue:k},{example:n(()=>[c(`div`,E,[a(f,{Text:R.value,TextWrapping:`WrapWholeWords`},null,8,[`Text`]),a(v,{Items:H.value,Theme:o(N),onItemClick:r[2]||=e=>R.value=z(e.Item)},null,8,[`Items`,`Theme`])])]),_:1},8,[`headerText`,`theme`])])])]),_:1}))}},[[`__scopeId`,`data-v-5ceff796`]]);export{A as default};