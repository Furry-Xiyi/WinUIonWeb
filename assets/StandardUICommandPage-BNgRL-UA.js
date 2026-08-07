import{$ as e,E as t,F as n,H as r,K as i,N as a,Q as o,S as s,X as c,Z as l,_ as u,d,g as f,h as p,l as m,m as h,n as g,t as _,v,x as y}from"./WinScrollViewer-DPrZnleG.js";import{c as b,r as x}from"./index-DuMWfULz.js";import{t as S}from"./WinControlExample-B6GJQZPH.js";import{t as C}from"./pageState-Mr-1-Xo1.js";var ee={class:`gallery-item-page`},te={style:{position:`relative`},class:`page-heading`},ne={class:`page-header-actions`},re={class:`icon`},ie={class:`gallery-page-content`},ae={class:`example-container`},w={class:`menu-bar`},T={class:`menu-bar-item`},E={key:0,class:`menu-flyout`},D={class:`menu-bar-item`},O={key:0,class:`menu-flyout`},k={class:`menu-bar-item`},A={key:0,class:`menu-flyout`},j={class:`list-view`},M=[`onClick`,`onContextmenu`,`onMouseenter`],N={class:`list-item-text`},P=`<div class="menu-bar">
  <div class="menu-bar-item">
    <button class="menu-button">Edit</button>
    <div class="menu-flyout">
      <div class="menu-item" @click="executeDeleteCommand()">
        <span class="icon">&#xE74D;</span>
        Delete
      </div>
    </div>
  </div>
</div>

<div class="list-view">
  <div
    v-for="(item, index) in listItems"
    :key="index"
    class="list-item"
    @contextmenu.prevent="showContextMenu($event, index)"
    @mouseenter="hoveredIndex = index"
    @mouseleave="hoveredIndex = -1">
    <span>{{ item }}</span>
    <WinButton v-if="hoveredIndex === index"
      @click.stop="executeDeleteCommand(item)">
      <span class="icon">&#xE74D;</span>
    </WinButton>
  </div>
</div>`,F=`const listItems = ref([]);
for (let i = 0; i < 15; i++) {
  listItems.value.push(\`List item \${i}\`);
}

const selectedIndex = ref(-1);
const hoveredIndex = ref(-1);

const executeDeleteCommand = (item) => {
  if (item) {
    const index = listItems.value.indexOf(item);
    if (index !== -1) {
      listItems.value.splice(index, 1);
    }
  } else if (selectedIndex.value !== -1) {
    listItems.value.splice(selectedIndex.value, 1);
    selectedIndex.value = -1;
  }
};

const showContextMenu = (event, index) => {
  selectedIndex.value = index;
  // Show context menu with delete option
};`,I=g({__name:`StandardUICommandPage`,setup(g){let I=t(`currentPage`),{isFavoriteState:L,pageTheme:R,toggleTheme:oe,toggleFavorite:z}=C(h(()=>I?.value||`standarduicommand`).value),B=i([]),V=i(-1),H=i(-1);for(let e=0;e<15;e++)B.value.push(`List item ${e}`);let U=i(!1),W=i(!1),G=i(!1),K=()=>{U.value=!U.value,W.value=!1,G.value=!1},q=()=>{W.value=!W.value,U.value=!1,G.value=!1},se=()=>{G.value=!G.value,U.value=!1,W.value=!1},J=i(!1),Y=i(0),X=i(0),Z=i(``),ce=(e,t)=>{V.value=t,Z.value=B.value[t],Y.value=e.clientX,X.value=e.clientY,J.value=!0},Q=()=>{J.value=!1},$=e=>{if(e){let t=B.value.indexOf(e);t!==-1&&B.value.splice(t,1)}else V.value!==-1&&(B.value.splice(V.value,1),V.value=-1);W.value=!1,Q()};return(t,i)=>(a(),v(`div`,ee,[p(`div`,te,[i[4]||=p(`h1`,{class:`page-header`},`StandardUICommand`,-1),i[5]||=p(`p`,{class:`page-description`},` StandardUICommand allows the sharing of the UX associated with a command across multiple controls. It provides a consistent icon, label, keyboard shortcut, and description for common commands like Delete, Copy, Paste, etc. `,-1),p(`div`,ne,[s(b,{class:`header-action`,onClick:c(oe)},{default:r(()=>[...i[3]||=[p(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),s(x,{class:`header-action`,IsChecked:c(L),"onUpdate:IsChecked":c(z)},{default:r(()=>[p(`span`,re,e(c(L)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),s(_,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:r(()=>[p(`div`,ie,[s(S,{headerText:`Exposing a command in multiple controls using StandardUICommand`,theme:c(R),templateCode:P,vueCode:F},{example:r(()=>[p(`div`,ae,[i[11]||=p(`div`,{class:`description-text`},` StandardUICommand allows the sharing of the UX associated with a command. In this instance we are using a StandardUICommand to quickly place the delete command in multiple controls. The StandardUICommand contains the icon, label, keyboard shortcut, and a description. `,-1),p(`div`,w,[p(`div`,T,[p(`button`,{class:`menu-button`,onClick:K},`File`),U.value?(a(),v(`div`,E,[...i[6]||=[p(`div`,{class:`menu-item`},`New`,-1),p(`div`,{class:`menu-item`},`Open...`,-1),p(`div`,{class:`menu-item`},`Save`,-1),p(`div`,{class:`menu-item`},`Exit`,-1)]])):u(``,!0)]),p(`div`,D,[p(`button`,{class:`menu-button`,onClick:q},`Edit`),W.value?(a(),v(`div`,O,[p(`div`,{class:`menu-item`,onClick:i[0]||=e=>$()},[...i[7]||=[p(`span`,{class:`icon`},``,-1),y(` Delete `,-1),p(`span`,{class:`accelerator`},`Delete`,-1)]])])):u(``,!0)]),p(`div`,k,[p(`button`,{class:`menu-button`,onClick:se},`Help`),G.value?(a(),v(`div`,A,[...i[8]||=[p(`div`,{class:`menu-item`},`About`,-1)]])):u(``,!0)])]),p(`div`,j,[(a(!0),v(d,null,n(B.value,(t,n)=>(a(),v(`div`,{key:n,class:l([`list-item`,{selected:V.value===n}]),onClick:e=>V.value=n,onContextmenu:m(e=>ce(e,n),[`prevent`]),onMouseenter:e=>H.value=n,onMouseleave:i[1]||=e=>H.value=-1},[p(`span`,N,e(t),1),H.value===n?(a(),f(b,{key:0,class:`hover-delete-button`,onClick:m(e=>$(t),[`stop`])},{default:r(()=>[...i[9]||=[p(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`])):u(``,!0)],42,M))),128))]),J.value?(a(),v(`div`,{key:0,class:`context-menu`,style:o({left:Y.value+`px`,top:X.value+`px`}),onClick:Q},[p(`div`,{class:`menu-item`,onClick:i[2]||=e=>$(Z.value)},[...i[10]||=[p(`span`,{class:`icon`},``,-1),y(` Delete `,-1),p(`span`,{class:`accelerator`},`Delete`,-1)]])],4)):u(``,!0)])]),_:1},8,[`theme`])])]),_:1})]))}},[[`__scopeId`,`data-v-c275e720`]]);export{I as default};