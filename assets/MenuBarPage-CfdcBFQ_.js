import{$ as e,A as t,E as n,F as r,H as i,K as a,N as o,O as s,S as c,V as l,X as u,Z as d,d as f,g as p,h as m,j as h,m as g,n as _,t as v,v as y}from"./WinScrollViewer-DPrZnleG.js";import{n as b,t as x}from"./WinTextBlock-CoHJuwfG.js";import{r as S}from"./i18n-BZ_M1PVV.js";import{c as C,r as w}from"./index-Cqm_GBbO.js";import{t as T}from"./WinControlExample-CN4kntk4.js";import{t as E}from"./pageState-Mr-1-Xo1.js";var D=[`aria-label`],O=[`aria-expanded`,`aria-disabled`,`disabled`,`tabindex`,`onPointerenter`,`onPointerdown`,`onKeydown`,`onFocus`],k=_({__name:`WinMenuBar`,props:{Items:{type:Array,required:!0},AutomationPropertiesName:{type:String,default:`Menu`},Theme:{type:String,default:``}},emits:[`ItemClick`],setup(e,{emit:n}){let i=e,u=n,p=a(null),_=a(null),v=a(0),S=a(null),C=a(!1),w=a(!1),T=a(null),E=a(200),k=null,A=g(()=>i.Items),j=g(()=>_.value===null?null:A.value[_.value]),M=e=>e?.IsEnabled===!1,N=e=>{let t=p.value?.querySelectorAll(`.win-menu-bar-button`)[e];if(!t)return;let n=t.getBoundingClientRect();T.value=n,E.value=Math.max(n.width,200)},P=async e=>{let t=A.value[e];if(!t||M(t)||!t.Items?.length)return;let n=_.value;_.value=e,v.value=e,L(),await s(),(n!==e||!T.value)&&N(e)},F=()=>{_.value=null,S.value=null,L()},I=()=>{L(),k=window.setTimeout(()=>{!C.value&&!w.value&&S.value===null&&F()},180)},L=()=>{k&&=(window.clearTimeout(k),null)},R=()=>{C.value=!0,L()},z=()=>{C.value=!1,I()},B=()=>{w.value=!0,L()},V=()=>{w.value=!1,I()},H=e=>{L(),_.value!==null&&P(e)},U=e=>{S.value=e,L(),_.value===null||_.value!==e?P(e):N(e)},W=e=>{if(!e?.GroupName||!j.value)return;let t=n=>{n.forEach(n=>{n.GroupName===e.GroupName&&(n.IsChecked=n===e),n.Items&&t(n.Items)})};t(j.value.Items)},G=e=>{M(e)||(W(e),u(`ItemClick`,{Item:e}),F())},K=e=>{let t=A.value.length,n=v.value;do n=(n+e+t)%t;while(M(A.value[n])&&n!==v.value);v.value=n,p.value?.querySelectorAll(`.win-menu-bar-button`)[n]?.focus(),_.value!==null&&P(n)},q=(e,t)=>{e.key===`ArrowRight`?(e.preventDefault(),K(1)):e.key===`ArrowLeft`?(e.preventDefault(),K(-1)):e.key===`ArrowDown`||e.key===`Enter`||e.key===` `?(e.preventDefault(),P(t)):e.key===`Escape`&&(e.preventDefault(),F())},J=e=>e?.KeyboardAccelerators?.[0]??null,Y=e=>{_.value===null&&A.value.forEach(t=>{t.Items?.forEach(t=>{let n=J(t);if(!n)return;let{Key:r,Modifiers:i=[]}=n;e.key.toUpperCase()===String(r).toUpperCase()&&i.includes(`Control`)===e.ctrlKey&&i.includes(`Shift`)===e.shiftKey&&i.includes(`Alt`)===e.altKey&&(e.preventDefault(),u(`ItemClick`,{Item:t}))})})},X=e=>{if(_.value===null)return;let t=e.target;p.value?.contains(t)||t instanceof Element&&t.closest(`.win-menu-flyout-wrap`)||F()};return l(_,e=>{e!==null&&s(()=>N(e))}),t(()=>{document.addEventListener(`keydown`,Y),document.addEventListener(`pointerdown`,X,!0)}),h(()=>{document.removeEventListener(`keydown`,Y),document.removeEventListener(`pointerdown`,X,!0),L()}),(t,n)=>(o(),y(f,null,[m(`nav`,{ref_key:`menuBarRef`,ref:p,class:`win-menu-bar`,role:`menubar`,"aria-label":e.AutomationPropertiesName,onPointerenter:R,onPointerleave:z},[(o(!0),y(f,null,r(A.value,(e,t)=>(o(),y(`div`,{key:t,class:d([`win-menu-bar-item`,{"is-open":_.value===t,"is-disabled":M(e)}]),role:`none`},[m(`button`,{class:`win-menu-bar-button`,type:`button`,role:`menuitem`,"aria-haspopup":!0,"aria-expanded":_.value===t,"aria-disabled":M(e),disabled:M(e),tabindex:v.value===t?0:-1,onPointerenter:e=>H(t),onPointerdown:e=>U(t),onPointerup:n[0]||=e=>S.value=null,onKeydown:e=>q(e,t),onFocus:e=>v.value=t},[c(x,{Text:e.Title},null,8,[`Text`])],40,O)],2))),128))],40,D),c(b,{Open:_.value!==null,AnchorRect:T.value,Items:j.value?.Items||[],MinWidth:E.value,Theme:e.Theme,Gap:0,OverlayInputPassThroughElement:``,Placement:`BottomEdgeAlignedLeft`,onClose:F,onSelect:G,onPointerEnter:B,onPointerLeave:V},null,8,[`Open`,`AnchorRect`,`Items`,`MinWidth`,`Theme`])],64))}},[[`__scopeId`,`data-v-439a94c2`]]),A={class:`gallery-item-page`},j={class:`page-heading`},M={class:`page-header-actions`},N={class:`icon`},P={class:`gallery-page-content`},F={class:`sample-stack`},I={class:`sample-stack`},L={class:`sample-stack`},R=`<WinMenuBar :Items="[
  {
    Title: 'File',
    Items: [
      { Text: 'New' },
      { Text: 'Open...' },
      { Text: 'Save' },
      { Text: 'Exit' }
    ]
  },
  {
    Title: 'Edit',
    Items: [
      { Text: 'Undo' },
      { Text: 'Cut' },
      { Text: 'Copy' },
      { Text: 'Paste' }
    ]
  },
  {
    Title: 'Help',
    Items: [
      { Text: 'About' }
    ]
  }
]" />`,z=`<WinMenuBar :Items="[
  {
    Title: 'File',
    Items: [
      {
        Text: 'New',
        KeyboardAccelerators: [{ Key: 'N', Modifiers: ['Control'] }]
      },
      {
        Text: 'Open',
        KeyboardAccelerators: [{ Key: 'O', Modifiers: ['Control'] }]
      }
    ]
  }
]" />`,B=`<WinMenuBar :Items="[
  {
    Title: 'File',
    Items: [
      {
        Kind: 'MenuFlyoutSubItem',
        Text: 'New',
        Items: [
          { Text: 'Plain Text Document' },
          { Text: 'Rich Text Document' },
          { Text: 'Other Formats' }
        ]
      },
      { Text: 'Open' },
      { Text: 'Save' },
      { Kind: 'MenuFlyoutSeparator' },
      { Text: 'Exit' }
    ]
  },
  {
    Title: 'View',
    Items: [
      { Text: 'Output' },
      { Kind: 'MenuFlyoutSeparator' },
      { Text: 'Landscape', GroupName: 'OrientationGroup' },
      { Text: 'Portrait', GroupName: 'OrientationGroup', IsChecked: true }
    ]
  }
]" />`,V=_({__name:`MenuBarPage`,setup(t){let{t:r}=S(),s=n(`currentPage`),{isFavoriteState:l,pageTheme:d,toggleTheme:f,toggleFavorite:h}=E(g(()=>s?.value||`menubar`).value),_=a(`You clicked:`),y=a(`You clicked:`),b=a(`You clicked:`),D=[{Title:r(`text.file`),Items:[{Text:`New`},{Text:`Open...`},{Text:`Save`},{Text:`Exit`}]},{Title:r(`text.edit`),Items:[{Text:`Undo`},{Text:`Cut`},{Text:`Copy`},{Text:`Paste`}]},{Title:r(`text.help`),Items:[{Text:`About`}]}],O=[{Title:r(`text.file`),Items:[{Text:`New`,KeyboardAccelerators:[{Key:`N`,Modifiers:[`Control`]}]},{Text:`Open`,KeyboardAccelerators:[{Key:`O`,Modifiers:[`Control`]}]},{Text:`Save`,KeyboardAccelerators:[{Key:`S`,Modifiers:[`Control`]}]},{Text:`Exit`,KeyboardAccelerators:[{Key:`E`,Modifiers:[`Control`]}]}]},{Title:r(`text.edit`),Items:[{Text:`Undo`,KeyboardAccelerators:[{Key:`Z`,Modifiers:[`Control`]}]},{Text:`Cut`,KeyboardAccelerators:[{Key:`X`,Modifiers:[`Control`]}]},{Text:`Copy`,KeyboardAccelerators:[{Key:`C`,Modifiers:[`Control`]}]},{Text:`Paste`,KeyboardAccelerators:[{Key:`V`,Modifiers:[`Control`]}]}]},{Title:r(`text.help`),Items:[{Text:`About`,KeyboardAccelerators:[{Key:`I`,Modifiers:[`Control`]}]}]}],V=a([{Title:r(`text.file`),Items:[{Kind:`MenuFlyoutSubItem`,Text:`New`,Items:[{Text:`Plain Text Document`},{Text:`Rich Text Document`},{Text:`Other Formats`}]},{Text:`Open`},{Text:`Save`},{Kind:`MenuFlyoutSeparator`},{Text:`Exit`}]},{Title:r(`text.edit`),Items:[{Text:`Undo`},{Text:`Cut`},{Text:`Copy`},{Text:`Paste`}]},{Title:r(`text.view`),Items:[{Text:`Output`},{Kind:`MenuFlyoutSeparator`},{Text:`Landscape`,GroupName:`orientation`,IsChecked:!1},{Text:`Portrait`,GroupName:`orientation`,IsChecked:!0},{Kind:`MenuFlyoutSeparator`},{Text:`Small icons`,GroupName:`size`,IsChecked:!1},{Text:`Medium icons`,GroupName:`size`,IsChecked:!0},{Text:`Large icons`,GroupName:`size`,IsChecked:!1}]},{Title:r(`text.help`),Items:[{Text:`About`}]}]);return(t,n)=>(o(),p(v,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:i(()=>[m(`div`,A,[m(`div`,j,[c(x,{class:`page-header`,Text:t.$t(`text.menubar`)},null,8,[`Text`]),c(x,{class:`page-description`,Text:t.$t(`text.the-menubar-simplifies-the-creation-of-basic-men`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),m(`div`,M,[c(C,{class:`header-action`,onClick:u(f)},{default:i(()=>[...n[3]||=[m(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),c(w,{IsChecked:u(l),class:`header-action`,"onUpdate:IsChecked":u(h)},{default:i(()=>[m(`span`,N,e(u(l)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),m(`div`,P,[c(T,{class:`basic-input-example-theme`,headerText:t.$t(`text.a-simple-menubar`),theme:u(d),vue:R},{example:i(()=>[m(`div`,F,[c(k,{Items:u(D),Theme:u(d),onItemClick:n[0]||=e=>_.value=`You clicked: ${e.Item.Text}`},null,8,[`Items`,`Theme`])])]),options:i(()=>[c(x,{Text:_.value,TextWrapping:`WrapWholeWords`},null,8,[`Text`])]),_:1},8,[`headerText`,`theme`]),c(T,{class:`basic-input-example-theme`,headerText:`A MenuBar with keyboard accelerators`,theme:u(d),vue:z},{example:i(()=>[m(`div`,I,[c(k,{Items:O,Theme:u(d),onItemClick:n[1]||=e=>y.value=`You clicked: ${e.Item.Text}`},null,8,[`Theme`])])]),options:i(()=>[c(x,{Text:y.value,TextWrapping:`WrapWholeWords`},null,8,[`Text`])]),_:1},8,[`theme`]),c(T,{class:`basic-input-example-theme`,headerText:`A MenuBar with submenus, separators, and radio menu items`,theme:u(d),vue:B},{example:i(()=>[m(`div`,L,[c(k,{Items:V.value,Theme:u(d),onItemClick:n[2]||=e=>b.value=`You clicked: ${e.Item.Text}`},null,8,[`Items`,`Theme`])])]),options:i(()=>[c(x,{Text:b.value,TextWrapping:`WrapWholeWords`},null,8,[`Text`])]),_:1},8,[`theme`])])])]),_:1}))}},[[`__scopeId`,`data-v-7d955eeb`]]);export{V as default};