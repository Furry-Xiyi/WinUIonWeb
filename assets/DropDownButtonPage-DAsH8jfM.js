import{$ as e,E as t,H as n,N as r,S as i,X as a,g as o,h as s,m as c,n as l,t as u}from"./WinScrollViewer-DPrZnleG.js";import{t as d}from"./WinTextBlock-CeUskDRc.js";import{a as f}from"./i18n-DA-FIA7C.js";import{c as p,o as m,r as h}from"./index-CMPZyTwE.js";import{t as g}from"./WinControlExample-C0uhK7Jb.js";import{t as _}from"./pageState-Mr-1-Xo1.js";var v={class:`gallery-item-page`},y={class:`page-heading`},b={class:`page-header-actions`},x={class:`icon`},S={class:`gallery-page-content`},C=`<WinDropDownButton Content="Email" :Flyout="{
  Placement: 'BottomEdgeAlignedLeft',
  Items: [
    { Text: 'Send' },
    { Text: 'Reply' },
    { Text: 'Reply All' }
  ]
}" />`,w=`<WinDropDownButton AutomationProperties.Name="Email" :Flyout="{
  Placement: 'BottomEdgeAlignedLeft',
  Items: [
    { Text: 'Send', Icon: '\\uE725' },
    { Text: 'Reply', Icon: '\\uE8CA' },
    { Text: 'Reply All', Icon: '\\uE8C2' }
  ]
}">
  <span class="icon">&#xE715;</span>
</WinDropDownButton>`,T=l({__name:`DropDownButtonPage`,setup(l){let{t:T}=f(),E=t(`currentPage`),{isFavoriteState:D,pageTheme:O,toggleTheme:k,toggleFavorite:A}=_(c(()=>E?.value||`dropdownbutton`).value),j={Placement:`BottomEdgeAlignedLeft`,Items:[{Text:T(`text.send`)},{Text:T(`text.reply`)},{Text:T(`text.reply-all`)}]},M={Placement:`BottomEdgeAlignedLeft`,Items:[{Text:T(`text.send`),Icon:``},{Text:T(`text.reply`),Icon:``},{Text:T(`text.reply-all`),Icon:``}]};return(t,c)=>(r(),o(u,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[s(`div`,v,[s(`div`,y,[i(d,{class:`page-header`,Text:t.$t(`text.dropdownbutton`)},null,8,[`Text`]),i(d,{class:`page-description`,Text:t.$t(`text.a-dropdownbutton-is-a-button-that-displays-a-che`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),s(`div`,b,[i(p,{class:`header-action`,onClick:a(k)},{default:n(()=>[...c[0]||=[s(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),i(h,{IsChecked:a(D),class:`header-action`,"onUpdate:IsChecked":a(A)},{default:n(()=>[s(`span`,x,e(a(D)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),s(`div`,S,[i(g,{class:`basic-input-example-theme`,theme:a(O),vue:C,headerText:t.$t(`sample.dropdown.simple`)},{example:n(()=>[i(m,{Content:t.$t(`text.email`),Flyout:j},null,8,[`Content`])]),_:1},8,[`theme`,`headerText`]),i(g,{class:`basic-input-example-theme`,theme:a(O),vue:w,headerText:t.$t(`sample.dropdown.icons`)},{example:n(()=>[i(m,{"AutomationProperties.Name":`Email`,Flyout:M},{default:n(()=>[...c[1]||=[s(`span`,{class:`icon`},``,-1)]]),_:1})]),_:1},8,[`theme`,`headerText`])])])]),_:1}))}},[[`__scopeId`,`data-v-9b865ad4`]]);export{T as default};