import{$ as e,E as t,G as n,H as r,K as i,N as a,S as o,X as s,g as c,h as l,m as u,n as d,t as f}from"./WinScrollViewer-DPrZnleG.js";import{n as p,t as m}from"./WinTextBlock-I131m2WL.js";import{r as h}from"./i18n-BZ_M1PVV.js";import{c as g,r as ee}from"./index-CAmvXKNF.js";import{t as _}from"./WinControlExample-eEWhdnpp.js";import{t as v}from"./pageState-Mr-1-Xo1.js";import{t as y}from"./WinAppBarButton-6JX2k-28.js";var b={class:`gallery-item-page`},x={class:`page-heading`},S={class:`page-header-actions`},C={class:`icon`},w={class:`gallery-page-content`},T={class:`sample-row`},E={class:`sample-row`},D=`<WinAppBarButton Icon="Sort" Label="Sort" IsCompact ToolTipService.ToolTip="Sort">
  <MenuFlyout>
    <MenuFlyoutItem Text="By rating" />
    <MenuFlyoutItem Text="By match" />
    <MenuFlyoutItem Text="By distance" />
  </MenuFlyout>
</WinAppBarButton>`,O=`<WinButton>
  <WinTextBlock Text="Options" />
</WinButton>
<WinMenuFlyout :Items="[
  { Text: 'Reset' },
  { Kind: 'MenuFlyoutSeparator' },
  { Kind: 'ToggleMenuFlyoutItem', Text: 'Repeat', IsChecked: true },
  { Kind: 'ToggleMenuFlyoutItem', Text: 'Shuffle', IsChecked: true }
]" />`,k=`<WinButton>
  <WinTextBlock Text="File Options" />
</WinButton>
<WinMenuFlyout :Items="[
  { Text: 'Open' },
  { Kind: 'MenuFlyoutSubItem', Text: 'Send to', Items: [
    { Text: 'Bluetooth' },
    { Text: 'Desktop (shortcut)' },
    { Kind: 'MenuFlyoutSubItem', Text: 'Compressed file', Items: [
      { Text: 'Compress and email' },
      { Text: 'Compress to .7z' },
      { Text: 'Compress to .zip' }
    ]}
  ]}
]" />`,A=`<WinMenuFlyout :Items="[
  { Kind: 'SplitMenuFlyoutItem', Text: 'Save', Icon: '\\uE74E', Items: [
    { Text: 'Save as .docx' },
    { Text: 'Save as .pdf' },
    { Text: 'Save as .txt' }
  ]},
  { Kind: 'SplitMenuFlyoutItem', Text: 'Share', Icon: '\\uE72D', Items: [
    { Text: 'Share via email' },
    { Text: 'Share via link' }
  ]}
]" />`,j=`<WinMenuFlyout :Items="[
  { Text: 'Share', Icon: '\\uE72D' },
  { Text: 'Copy', Icon: '\\uE8C8' },
  { Text: 'Delete', Icon: '\\uE74D' },
  { Kind: 'MenuFlyoutSeparator' },
  { Text: 'Rename' },
  { Text: 'Select' }
]" />`,M=`<WinMenuFlyout :Items="[
  { Text: 'Share', Icon: '\\uE72D', KeyboardAcceleratorTextOverride: 'Ctrl+S' },
  { Text: 'Copy', Icon: '\\uE8C8', KeyboardAcceleratorTextOverride: 'Ctrl+C' },
  { Text: 'Delete', Icon: '\\uE74D', KeyboardAcceleratorTextOverride: 'Delete' }
]" />`,N=`<WinMenuFlyout :Items="[
  { Kind: 'RadioMenuFlyoutItem', GroupName: 'OrientationGroup', Text: 'Landscape' },
  { Kind: 'RadioMenuFlyoutItem', GroupName: 'OrientationGroup', Text: 'Portrait', IsChecked: true },
  { Kind: 'MenuFlyoutSeparator' },
  { Kind: 'RadioMenuFlyoutItem', GroupName: 'SizeGroup', Text: 'Small icons' },
  { Kind: 'RadioMenuFlyoutItem', GroupName: 'SizeGroup', Text: 'Medium icons', IsChecked: true },
  { Kind: 'RadioMenuFlyoutItem', GroupName: 'SizeGroup', Text: 'Large icons' }
]" />`,P=d({__name:`MenuFlyoutPage`,setup(d){let{t:P}=h(),F=t(`currentPage`),{isFavoriteState:I,pageTheme:L,toggleTheme:R,toggleFavorite:z}=v(u(()=>F?.value||`menuflyout`).value),B=()=>n({open:!1,anchor:null}),V=B(),H=B(),U=B(),W=B(),G=B(),K=B(),q=B(),J=[V,H,U,W,G,K,q],Y=i(``),X=i(``),Z=(e,t)=>{J.forEach(e=>{e!==t&&(e.open=!1)}),t.anchor=e.currentTarget.getBoundingClientRect(),t.open=!t.open},Q=n([{Text:P(`sample.by-rating`),Tag:`rating`},{Text:P(`sample.by-match`),Tag:`match`},{Text:P(`sample.by-distance`),Tag:`distance`}]),$=n([{Text:P(`sample.reset`)},{Kind:`MenuFlyoutSeparator`},{Kind:`ToggleMenuFlyoutItem`,Text:P(`sample.repeat`),IsChecked:!0},{Kind:`ToggleMenuFlyoutItem`,Text:P(`sample.shuffle`),IsChecked:!0}]),te=n([{Text:P(`sample.open`)},{Kind:`MenuFlyoutSubItem`,Text:P(`sample.send-to`),Items:[{Text:P(`sample.bluetooth`)},{Text:P(`sample.desktop-shortcut`)},{Kind:`MenuFlyoutSubItem`,Text:P(`sample.compressed-file`),Items:[{Text:P(`sample.compress-email`)},{Text:P(`sample.compress-7z`)},{Text:P(`sample.compress-zip`)}]}]}]),ne=n([{Kind:`SplitMenuFlyoutItem`,Text:P(`sample.save`),Icon:``,Items:[{Text:P(`sample.save-docx`)},{Text:P(`sample.save-pdf`)},{Text:P(`sample.save-txt`)}]},{Kind:`SplitMenuFlyoutItem`,Text:P(`sample.share`),Icon:``,Items:[{Text:P(`sample.share-email`)},{Text:P(`sample.share-link`)}]}]),re=n([{Text:P(`sample.share`),Icon:``},{Text:P(`sample.copy`),Icon:``},{Text:P(`sample.delete`),Icon:``},{Kind:`MenuFlyoutSeparator`},{Text:P(`sample.rename`)},{Text:P(`sample.select`)}]),ie=n([{Text:P(`sample.share`),Icon:``,KeyboardAccelerators:[{Key:`S`,Modifiers:[`Control`]}],KeyboardAcceleratorTextOverride:`Ctrl+S`},{Text:P(`sample.copy`),Icon:``,KeyboardAccelerators:[{Key:`C`,Modifiers:[`Control`]}],KeyboardAcceleratorTextOverride:`Ctrl+C`},{Text:P(`sample.delete`),Icon:``,KeyboardAccelerators:[{Key:`Delete`}],KeyboardAcceleratorTextOverride:`Delete`},{Kind:`MenuFlyoutSeparator`},{Text:P(`sample.rename`)},{Text:P(`sample.select`)}]),ae=n([{Kind:`RadioMenuFlyoutItem`,GroupName:`OrientationGroup`,Text:P(`sample.landscape`)},{Kind:`RadioMenuFlyoutItem`,GroupName:`OrientationGroup`,Text:P(`sample.portrait`),IsChecked:!0},{Kind:`MenuFlyoutSeparator`},{Kind:`RadioMenuFlyoutItem`,GroupName:`SizeGroup`,Text:P(`sample.small-icons`)},{Kind:`RadioMenuFlyoutItem`,GroupName:`SizeGroup`,Text:P(`sample.medium-icons`),IsChecked:!0},{Kind:`RadioMenuFlyoutItem`,GroupName:`SizeGroup`,Text:P(`sample.large-icons`)}]),oe=e=>{Y.value=P(`sample.sort-by`,{value:e.Tag}),V.open=!1},se=e=>{X.value=P(`sample.clicked`,{value:e.Text}),W.open=!1};return(t,n)=>(a(),c(f,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:r(()=>[l(`div`,b,[l(`div`,x,[o(m,{class:`page-header`,Text:t.$t(`text.menuflyout`)},null,8,[`Text`]),o(m,{class:`page-description`,Text:t.$t(`text.a-menuflyout-displays-a-lightweight-menu-of-comm`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),l(`div`,S,[o(g,{class:`header-action`,onClick:s(R)},{default:r(()=>[...n[14]||=[l(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),o(ee,{IsChecked:s(I),class:`header-action`,"onUpdate:IsChecked":s(z)},{default:r(()=>[l(`span`,C,e(s(I)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),l(`div`,w,[o(_,{class:`basic-input-example-theme`,headerText:t.$t(`text.a-menuflyout-attached-to-an-appbarbutton`),theme:s(L),vue:D},{example:r(()=>[l(`div`,T,[o(y,{icon:`Sort`,label:t.$t(`sample.sort`),isCompact:!0,ariaLabel:t.$t(`sample.sort`),onClick:n[0]||=e=>Z(e,s(V))},null,8,[`label`,`ariaLabel`]),o(m,{class:`output-text`,Text:Y.value},null,8,[`Text`])])]),_:1},8,[`headerText`,`theme`]),o(_,{class:`basic-input-example-theme`,headerText:t.$t(`sample.menuflyout.toggle-items`),theme:s(L),vue:O},{example:r(()=>[o(g,{onClick:n[1]||=e=>Z(e,s(H))},{default:r(()=>[o(m,{Text:t.$t(`sample.options`)},null,8,[`Text`])]),_:1})]),_:1},8,[`headerText`,`theme`]),o(_,{class:`basic-input-example-theme`,headerText:t.$t(`sample.menuflyout.cascading`),theme:s(L),vue:k},{example:r(()=>[o(g,{onClick:n[2]||=e=>Z(e,s(U))},{default:r(()=>[o(m,{Text:t.$t(`sample.file-options`)},null,8,[`Text`])]),_:1})]),_:1},8,[`headerText`,`theme`]),o(_,{class:`basic-input-example-theme`,headerText:t.$t(`sample.menuflyout.split-items`),theme:s(L),vue:A},{example:r(()=>[l(`div`,E,[o(g,{onClick:n[3]||=e=>Z(e,s(W))},{default:r(()=>[o(m,{Text:t.$t(`sample.file-options`)},null,8,[`Text`])]),_:1}),o(m,{class:`output-text`,Text:X.value},null,8,[`Text`])])]),_:1},8,[`headerText`,`theme`]),o(_,{class:`basic-input-example-theme`,headerText:t.$t(`sample.menuflyout.icons`),theme:s(L),vue:j},{example:r(()=>[o(g,{onClick:n[4]||=e=>Z(e,s(G))},{default:r(()=>[o(m,{Text:t.$t(`sample.edit-options`)},null,8,[`Text`])]),_:1})]),_:1},8,[`headerText`,`theme`]),o(_,{class:`basic-input-example-theme`,headerText:t.$t(`sample.menuflyout.keyboard`),theme:s(L),vue:M},{example:r(()=>[o(g,{onClick:n[5]||=e=>Z(e,s(K))},{default:r(()=>[o(m,{Text:t.$t(`sample.edit-options`)},null,8,[`Text`])]),_:1})]),_:1},8,[`headerText`,`theme`]),o(_,{class:`basic-input-example-theme`,headerText:t.$t(`sample.menuflyout.radio`),theme:s(L),vue:N},{example:r(()=>[o(g,{onClick:n[6]||=e=>Z(e,s(q))},{default:r(()=>[o(m,{Text:t.$t(`sample.options`)},null,8,[`Text`])]),_:1})]),_:1},8,[`headerText`,`theme`]),o(p,{Open:s(V).open,AnchorRect:s(V).anchor,Items:Q,Theme:s(L),onClose:n[7]||=e=>s(V).open=!1,onSelect:oe},null,8,[`Open`,`AnchorRect`,`Items`,`Theme`]),o(p,{Open:s(H).open,AnchorRect:s(H).anchor,Items:$,Theme:s(L),onClose:n[8]||=e=>s(H).open=!1},null,8,[`Open`,`AnchorRect`,`Items`,`Theme`]),o(p,{Open:s(U).open,AnchorRect:s(U).anchor,Items:te,Theme:s(L),onClose:n[9]||=e=>s(U).open=!1},null,8,[`Open`,`AnchorRect`,`Items`,`Theme`]),o(p,{Open:s(W).open,AnchorRect:s(W).anchor,Items:ne,Theme:s(L),onClose:n[10]||=e=>s(W).open=!1,onSelect:se},null,8,[`Open`,`AnchorRect`,`Items`,`Theme`]),o(p,{Open:s(G).open,AnchorRect:s(G).anchor,Items:re,Theme:s(L),onClose:n[11]||=e=>s(G).open=!1},null,8,[`Open`,`AnchorRect`,`Items`,`Theme`]),o(p,{Open:s(K).open,AnchorRect:s(K).anchor,Items:ie,Theme:s(L),onClose:n[12]||=e=>s(K).open=!1},null,8,[`Open`,`AnchorRect`,`Items`,`Theme`]),o(p,{Open:s(q).open,AnchorRect:s(q).anchor,Items:ae,Theme:s(L),onClose:n[13]||=e=>s(q).open=!1},null,8,[`Open`,`AnchorRect`,`Items`,`Theme`])])])]),_:1}))}},[[`__scopeId`,`data-v-dc2fde6e`]]);export{P as default};