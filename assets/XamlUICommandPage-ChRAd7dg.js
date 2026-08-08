import{$ as e,E as t,H as n,K as r,N as i,S as a,X as o,h as s,m as c,n as l,t as u,v as d}from"./WinScrollViewer-DPrZnleG.js";import{c as f,r as p}from"./index-ZFKB9X7r.js";import{t as m}from"./WinControlExample-Bw7FJK3B.js";import{t as h}from"./pageState-Mr-1-Xo1.js";import{t as g}from"./WinAppBarButton-6JX2k-28.js";var _={class:`gallery-item-page`},v={style:{position:`relative`},class:`page-heading`},y={class:`page-header-actions`},b={class:`icon`},x={class:`gallery-page-content`},S={style:{display:`flex`,"flex-direction":`column`,gap:`12px`}},C={style:{display:`flex`,"align-items":`center`,gap:`8px`}},w={class:`output-text`},T=`This is a custom command (Ctrl+D)`,E=`<div style="display: flex; align-items: center; gap: 8px;">
  <WinAppBarButton
    icon="Favorite"
    label="Custom XamlUICommand"
    tooltip="This is a custom command (Ctrl+D)"
    @click="executeCustomCommand"
  />
  <p>{{ commandOutput }}</p>
</div>`,D=`const commandOutput = ref('');

const executeCustomCommand = () => {
  commandOutput.value = 'You fired the custom command';
};

// In a real WinUI app, XamlUICommand would be defined as:
// <XamlUICommand x:Name="CustomCommand"
//   Label="Custom XamlUICommand"
//   Description="This is a custom command"
//   ExecuteRequested="ExecuteHandler">
//   <XamlUICommand.IconSource>
//     <SymbolIconSource Symbol="Favorite" />
//   </XamlUICommand.IconSource>
//   <XamlUICommand.KeyboardAccelerators>
//     <KeyboardAccelerator Key="D" Modifiers="Control"/>
//   </XamlUICommand.KeyboardAccelerators>
// </XamlUICommand>`,O=l({__name:`XamlUICommandPage`,setup(l){let O=t(`currentPage`),{isFavoriteState:k,pageTheme:A,toggleTheme:j,toggleFavorite:M}=h(c(()=>O?.value||`xamluicommand`).value),N=r(``),P=()=>{N.value=`You fired the custom command`};return(t,r)=>(i(),d(`div`,_,[s(`div`,v,[r[1]||=s(`h1`,{class:`page-header`},`XamlUICommand`,-1),r[2]||=s(`p`,{class:`page-description`},` XamlUICommand allows the sharing of the UX associated with a command. Define a command once with label, icon, keyboard accelerators, and description, then use it across multiple controls without repeating those properties. `,-1),s(`div`,y,[a(f,{class:`header-action`,onClick:o(j)},{default:n(()=>[...r[0]||=[s(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),a(p,{class:`header-action`,IsChecked:o(k),"onUpdate:IsChecked":o(M)},{default:n(()=>[s(`span`,b,e(o(k)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),a(u,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[s(`div`,x,[a(m,{headerText:`Creating a reusable command with XamlUICommand`,theme:o(A),templateCode:E,vueCode:D},{example:n(()=>[s(`div`,S,[r[3]||=s(`p`,{style:{margin:`0`,color:`var(--text-secondary)`,"font-size":`14px`,"line-height":`1.5`}},` XamlUICommand allows the sharing of the UX associated with a command. In this instance we create a simple Custom Command with a label, icon, shortcut, and description. It's defined as a resource and could be used in many controls, like this AppBarButton. The button (and other controls) automatically gets all these UI properties, without the need to define the properties again. `,-1),s(`div`,C,[a(g,{icon:`Favorite`,label:`Custom XamlUICommand`,tooltip:T,onClick:P}),s(`p`,w,e(N.value),1)])])]),_:1},8,[`theme`])])]),_:1})]))}},[[`__scopeId`,`data-v-34e37c82`]]);export{O as default};