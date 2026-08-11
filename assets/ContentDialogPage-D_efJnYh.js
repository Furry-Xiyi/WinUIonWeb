import{$ as e,C as t,E as n,H as r,K as i,N as a,S as o,T as s,X as c,g as l,h as u,m as d,n as f,t as p}from"./WinScrollViewer-DPrZnleG.js";import{t as m}from"./WinTextBlock-CeUskDRc.js";import{a as h}from"./i18n-DA-FIA7C.js";import{c as g,r as _}from"./index-CMPZyTwE.js";import{t as v}from"./WinControlExample-C0uhK7Jb.js";import{t as y}from"./pageState-Mr-1-Xo1.js";import{t as b}from"./WinCheckBox-8atnwBHb.js";import{t as x}from"./WinContentDialog-COkJSEa9.js";var S={class:`gallery-item-page`},C={class:`page-heading`},w={class:`page-header-actions`},T={class:`icon`},E={class:`gallery-page-content`},D={class:`sample-row`},O={class:`sample-row`},k=f({__name:`ContentDialogPage`,setup(f){let{t:k}=h(),A=n(`currentPage`),{isFavoriteState:j,pageTheme:M,toggleTheme:N,toggleFavorite:P}=y(d(()=>A?.value||`contentdialog`).value),F=i(!1),I=i(!1),L=i(``),R=i(``),z=t({setup(){return()=>s(`div`,{class:`dialog-content-stack`},[s(m,{Text:k(`sample.contentdialog.body`),FontSize:14,FontWeight:400,TextWrapping:`WrapWholeWords`}),s(b,null,{default:()=>s(m,{Text:k(`sample.contentdialog.upload`),FontSize:14,FontWeight:400})})])}}),B=d(()=>`<WinButton @Click="showDialog = true">
  <WinTextBlock Text="${k(`text.show-dialog`)}" />
</WinButton>
<WinContentDialog
  v-model:IsOpen="showDialog"
  Title="${k(`sample.contentdialog.save-title`)}"
  PrimaryButtonText="${k(`sample.contentdialog.save`)}"
  SecondaryButtonText="${k(`sample.contentdialog.dont-save`)}"
  CloseButtonText="${k(`sample.contentdialog.cancel`)}"
  DefaultButton="Primary">
  <WinTextBlock Text="${k(`sample.contentdialog.body`)}" TextWrapping="WrapWholeWords" />
  <WinCheckBox>
    <WinTextBlock Text="${k(`sample.contentdialog.upload`)}" />
  </WinCheckBox>
</WinContentDialog>`),V=d(()=>`<WinButton @Click="showDialogNoDefault = true">
  <WinTextBlock Text="${k(`sample.contentdialog.show-no-default`)}" />
</WinButton>
<WinContentDialog
  v-model:IsOpen="showDialogNoDefault"
  Title="${k(`sample.contentdialog.replace-title`)}"
  PrimaryButtonText="${k(`sample.contentdialog.save`)}"
  SecondaryButtonText="${k(`sample.contentdialog.dont-save`)}"
  CloseButtonText="${k(`sample.contentdialog.cancel`)}"
  DefaultButton="None">
  <WinTextBlock Text="${k(`sample.contentdialog.body`)}" TextWrapping="WrapWholeWords" />
  <WinCheckBox>
    <WinTextBlock Text="${k(`sample.contentdialog.upload`)}" />
  </WinCheckBox>
</WinContentDialog>`);return(t,n)=>(a(),l(p,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:r(()=>[u(`div`,S,[u(`div`,C,[o(m,{class:`page-header`,Text:t.$t(`text.contentdialog`)},null,8,[`Text`]),o(m,{class:`page-description`,Text:t.$t(`text.use-a-contentdialog-to-show-relevant-information`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),u(`div`,w,[o(g,{class:`header-action`,onClick:c(N)},{default:r(()=>[...n[10]||=[u(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),o(_,{IsChecked:c(j),class:`header-action`,"onUpdate:IsChecked":c(P)},{default:r(()=>[u(`span`,T,e(c(j)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),u(`div`,E,[o(v,{class:`basic-input-example-theme`,headerText:t.$t(`text.a-basic-content-dialog-with-content`),theme:c(M),vue:B.value},{example:r(()=>[u(`div`,D,[o(g,{onClick:n[0]||=e=>F.value=!0},{default:r(()=>[o(m,{Text:t.$t(`text.show-dialog`)},null,8,[`Text`])]),_:1}),o(m,{class:`output-text`,Text:L.value},null,8,[`Text`])])]),_:1},8,[`headerText`,`theme`,`vue`]),o(v,{class:`basic-input-example-theme`,headerText:t.$t(`sample.contentdialog.no-default`),theme:c(M),vue:V.value},{example:r(()=>[u(`div`,O,[o(g,{onClick:n[1]||=e=>I.value=!0},{default:r(()=>[o(m,{Text:t.$t(`sample.contentdialog.show-no-default`)},null,8,[`Text`])]),_:1}),o(m,{class:`output-text`,Text:R.value},null,8,[`Text`])])]),_:1},8,[`headerText`,`theme`,`vue`]),o(x,{IsOpen:F.value,"onUpdate:IsOpen":n[2]||=e=>F.value=e,Theme:c(M),Title:t.$t(`sample.contentdialog.save-title`),PrimaryButtonText:t.$t(`sample.contentdialog.save`),SecondaryButtonText:t.$t(`sample.contentdialog.dont-save`),CloseButtonText:t.$t(`sample.contentdialog.cancel`),DefaultButton:`Primary`,onPrimaryButtonClick:n[3]||=e=>L.value=t.$t(`sample.contentdialog.saved`),onSecondaryButtonClick:n[4]||=e=>L.value=t.$t(`sample.contentdialog.not-saved`),onCloseButtonClick:n[5]||=e=>L.value=t.$t(`sample.contentdialog.cancelled`)},{default:r(()=>[o(c(z))]),_:1},8,[`IsOpen`,`Theme`,`Title`,`PrimaryButtonText`,`SecondaryButtonText`,`CloseButtonText`]),o(x,{IsOpen:I.value,"onUpdate:IsOpen":n[6]||=e=>I.value=e,Theme:c(M),Title:t.$t(`sample.contentdialog.replace-title`),PrimaryButtonText:t.$t(`sample.contentdialog.save`),SecondaryButtonText:t.$t(`sample.contentdialog.dont-save`),CloseButtonText:t.$t(`sample.contentdialog.cancel`),DefaultButton:`None`,onPrimaryButtonClick:n[7]||=e=>R.value=t.$t(`sample.contentdialog.saved`),onSecondaryButtonClick:n[8]||=e=>R.value=t.$t(`sample.contentdialog.not-saved`),onCloseButtonClick:n[9]||=e=>R.value=t.$t(`sample.contentdialog.cancelled`)},{default:r(()=>[o(c(z))]),_:1},8,[`IsOpen`,`Theme`,`Title`,`PrimaryButtonText`,`SecondaryButtonText`,`CloseButtonText`])])])]),_:1}))}},[[`__scopeId`,`data-v-af806c77`]]);export{k as default};