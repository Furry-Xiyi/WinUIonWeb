import{$ as e,D as t,E as n,F as r,H as i,I as a,K as o,N as s,S as c,U as l,V as u,X as d,Z as f,_ as p,d as m,g as h,h as g,m as _,n as v,r as y,s as b,t as x,v as S,x as C}from"./WinScrollViewer-Cel0kV6s.js";import{r as w}from"./i18n-DnD06S2j.js";import{n as T,t as E}from"./WinToggleButton-Dj-8G30B.js";import{t as D}from"./WinControlExample-CxPQLLlF.js";import{t as O}from"./pageState-gpY_Fsb6.js";import{t as k}from"./WinCheckBox-Cu7z4tu7.js";import{t as A}from"./WinGridView-C_CW68vi.js";import{t as j}from"./WinListView-cN9ZCsqL.js";var M=[`aria-label`],N=v({__name:`WinSemanticZoom`,props:{isZoomedInViewActive:{type:Boolean,default:!0},IsZoomedInViewActive:{type:Boolean,default:void 0},canChangeViews:{type:Boolean,default:!0},CanChangeViews:{type:Boolean,default:void 0},isZoomOutButtonEnabled:{type:Boolean,default:!0},IsZoomOutButtonEnabled:{type:Boolean,default:void 0}},emits:[`update:isZoomedInViewActive`,`update:IsZoomedInViewActive`,`viewChangeStarted`,`ViewChangeStarted`,`viewChangeCompleted`,`ViewChangeCompleted`],setup(e,{emit:n}){let{t:r}=w(),m=e,h=n,v=o(null),C=o(!1),T=_(()=>m.IsZoomedInViewActive??m.isZoomedInViewActive),E=_(()=>m.CanChangeViews??m.canChangeViews),D=_(()=>m.IsZoomOutButtonEnabled??m.isZoomOutButtonEnabled),O=()=>{if(!E.value||C.value)return;let e=!T.value,t={sourceIsZoomedInView:T.value,targetIsZoomedInView:e};h(`viewChangeStarted`,t),h(`ViewChangeStarted`,t),C.value=!0,h(`update:isZoomedInViewActive`,e),h(`update:IsZoomedInViewActive`,e),setTimeout(()=>{C.value=!1;let t={sourceIsZoomedInView:!e,targetIsZoomedInView:e};h(`viewChangeCompleted`,t),h(`ViewChangeCompleted`,t)},300)},k=e=>{e.detail===2&&E.value&&O()},A=()=>{E.value&&!C.value&&O()},j=e=>{e.ctrlKey&&E.value&&!C.value&&(e.preventDefault(),(e.deltaY<0&&!T.value||e.deltaY>0&&T.value)&&O())},N=0,P=e=>{e.touches.length===2&&(N=I(e.touches))},F=e=>{if(e.touches.length===2&&E.value&&!C.value){let t=I(e.touches),n=t-N;(n>30&&!T.value||n<-30&&T.value)&&(e.preventDefault(),O(),N=t)}},I=e=>{let t=e[0].clientX-e[1].clientX,n=e[0].clientY-e[1].clientY;return Math.sqrt(t*t+n*n)};return u(v,e=>{e&&(e.addEventListener(`touchstart`,P,{passive:!0}),e.addEventListener(`touchmove`,F,{passive:!1}))},{immediate:!0}),(e,n)=>(s(),S(`div`,{class:f([`win-semantic-zoom`,{"zoomed-out":!T.value}]),ref_key:`containerRef`,ref:v},[D.value&&T.value&&E.value?(s(),S(`button`,t({key:0,class:`zoom-out-button`,onClick:O,"aria-label":d(r)(`text.switch-to-zoomed-out-view`)},{"tooltipservice.tooltip":d(r)(`text.switch-to-zoomed-out-view`)}),[...n[0]||=[g(`svg`,{width:`16`,height:`16`,viewBox:`0 0 16 16`,fill:`currentColor`},[g(`path`,{d:`M2 2h5v1H3v4H2V2zm7 0h5v5h-1V3H9V2zM2 14h5v-1H3v-4H2v5zm12 0h-5v-1h4v-4h1v5z`})],-1)]],16,M)):p(``,!0),c(y,{name:`zoom-fade`},{default:i(()=>[l(c(x,{class:`zoom-view zoomed-in-view`,VerticalScrollMode:`Auto`,VerticalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,HorizontalScrollBarVisibility:`Auto`,onClick:k,onWheel:j},{default:i(()=>[a(e.$slots,`zoomedInView`,{},void 0,!0)]),_:3},512),[[b,T.value]])]),_:3}),c(y,{name:`zoom-fade`},{default:i(()=>[l(c(x,{class:`zoom-view zoomed-out-view`,VerticalScrollMode:`Auto`,VerticalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,HorizontalScrollBarVisibility:`Auto`,onClick:A},{default:i(()=>[a(e.$slots,`zoomedOutView`,{},void 0,!0)]),_:3},512),[[b,!T.value]])]),_:3})],2))}},[[`__scopeId`,`data-v-35de1cc5`]]),P={class:`gallery-item-page`},F={style:{position:`relative`},class:`page-heading`},I={class:`page-header-actions`},L={class:`icon`},R={class:`gallery-page-content`},z={style:{padding:`16px`,height:`100%`}},B={class:`group-header`},V={class:`grid-item-card`},H={class:`item-title`},U={class:`item-subtitle`},W={style:{padding:`24px`,height:`100%`}},G={class:`group-item`},K={class:`group-title`},q={class:`group-count`},J={class:`output-text`},Y={class:`options-container`},X=`<WinSemanticZoom
  v-model:isZoomedInViewActive="isZoomedIn"
  :canChangeViews="canChangeViews"
  :isZoomOutButtonEnabled="true"
  @viewChangeStarted="onViewChangeStarted"
  @viewChangeCompleted="onViewChangeCompleted"
  style="height: 500px;">

  <template #zoomedInView>
    <div v-for="group in groupedData" :key="group.title">
      <h3>{{ group.title }}</h3>
      <WinGridView
        :items="group.items"
        :selectionMode="'None'"
        :isItemClickEnabled="true">
        <template #item="{ item }">
          <div>{{ item.title }}</div>
        </template>
      </WinGridView>
    </div>
  </template>

  <template #zoomedOutView>
    <WinListView
      :items="groupHeaders"
      :selectionMode="'None'"
      :isItemClickEnabled="true">
      <template #item="{ item }">
        <div>{{ item.title }}</div>
      </template>
    </WinListView>
  </template>
</WinSemanticZoom>`,Z=`const isZoomedIn = ref(true);
const canChangeViews = ref(true);

const groupedData = ref([
  {
    title: 'Basic Input',
    items: [
      { id: 1, title: 'Button', subtitle: 'A control that responds' },
      { id: 2, title: 'CheckBox', subtitle: 'A control for selecting' }
    ]
  },
  {
    title: 'Collections',
    items: [
      { id: 3, title: 'ListView', subtitle: 'A control for displaying' },
      { id: 4, title: 'GridView', subtitle: 'A control for items' }
    ]
  }
]);

const groupHeaders = computed(() => {
  return groupedData.value.map(group => ({
    title: group.title,
    count: group.items.length
  }));
});

const onViewChangeStarted = (event) => {
  console.log(event.targetIsZoomedInView ? 'Zooming in...' : 'Zooming out...');
};

const onViewChangeCompleted = (event) => {
  console.log(event.targetIsZoomedInView ? 'Zoomed in' : 'Zoomed out');
};`,Q=v({__name:`SemanticZoomPage`,setup(t){let a=n(`currentPage`),{isFavoriteState:l,pageTheme:u,toggleTheme:f,toggleFavorite:p}=O(_(()=>a?.value||`semanticzoom`).value),v=o(!0),y=o(!0),b=o(`SemanticZoom is in zoomed-in view`),w=o([{title:`Basic Input`,items:[{id:1,title:`Button`,subtitle:`A control that responds to user input`},{id:2,title:`CheckBox`,subtitle:`A control for selecting options`},{id:3,title:`RadioButton`,subtitle:`A control for exclusive selection`},{id:4,title:`Slider`,subtitle:`A control for selecting a value from a range`}]},{title:`Collections`,items:[{id:5,title:`ListView`,subtitle:`A control for displaying a collection`},{id:6,title:`GridView`,subtitle:`A control for displaying items in a grid`},{id:7,title:`TreeView`,subtitle:`A control for displaying hierarchical data`},{id:8,title:`FlipView`,subtitle:`A control for flipping through items`}]},{title:`Text`,items:[{id:9,title:`TextBlock`,subtitle:`A lightweight control for displaying text`},{id:10,title:`TextBox`,subtitle:`A control for entering text`},{id:11,title:`RichEditBox`,subtitle:`A control for rich text editing`},{id:12,title:`PasswordBox`,subtitle:`A control for password entry`}]},{title:`Navigation`,items:[{id:13,title:`NavigationView`,subtitle:`A control for app navigation`},{id:14,title:`Pivot`,subtitle:`A control for quick navigation`},{id:15,title:`TabView`,subtitle:`A control for tabbed content`},{id:16,title:`BreadcrumbBar`,subtitle:`A control for hierarchical navigation`}]},{title:`Media`,items:[{id:17,title:`Image`,subtitle:`A control for displaying images`},{id:18,title:`MediaPlayerElement`,subtitle:`A control for playing media`},{id:19,title:`WebView`,subtitle:`A control for displaying web content`},{id:20,title:`MapControl`,subtitle:`A control for displaying maps`}]}]),M=_(()=>w.value.map(e=>({title:e.title,count:e.items.length}))),Q=e=>{b.value=e.targetIsZoomedInView?`Zooming in...`:`Zooming out...`},$=e=>{b.value=e.targetIsZoomedInView?`SemanticZoom is in zoomed-in view`:`SemanticZoom is in zoomed-out view`},ee=e=>{b.value=`Clicked: ${e.title}`},te=e=>{v.value=!0,b.value=`Navigating to ${e.title} section`};return(t,n)=>(s(),h(x,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:i(()=>[g(`div`,P,[g(`div`,F,[n[3]||=g(`h1`,{class:`page-header`},`SemanticZoom`,-1),n[4]||=g(`p`,{class:`page-description`},` The SemanticZoom control lets the user zoom between two different semantic views of the same content. One view is the main view of the content. The second view is a way to quickly navigate that content. For example, when viewing an address book, the user could zoom out to quickly jump to a letter, and zoom in to see the names associated with that letter. `,-1),g(`div`,I,[c(T,{class:`header-action`,onClick:d(f)},{default:i(()=>[...n[2]||=[g(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),c(E,{class:`header-action`,IsChecked:d(l),"onUpdate:IsChecked":d(p)},{default:i(()=>[g(`span`,L,e(d(l)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),g(`div`,R,[c(D,{headerText:`A simple SemanticZoom`,theme:d(u),templateCode:X,vueCode:Z},{example:i(()=>[c(N,{isZoomedInViewActive:v.value,"onUpdate:isZoomedInViewActive":n[0]||=e=>v.value=e,canChangeViews:y.value,isZoomOutButtonEnabled:!0,onViewChangeStarted:Q,onViewChangeCompleted:$,style:{height:`500px`,border:`1px solid var(--stroke-divider)`,"border-radius":`8px`}},{zoomedInView:i(()=>[g(`div`,z,[(s(!0),S(m,null,r(w.value,(t,n)=>(s(),S(`div`,{key:n,style:{"margin-bottom":`24px`}},[g(`h3`,B,e(t.title),1),c(A,{items:t.items,selectionMode:`None`,isItemClickEnabled:!0,onItemClick:ee},{item:i(({item:t})=>[g(`div`,V,[g(`div`,H,e(t.title),1),g(`div`,U,e(t.subtitle),1)])]),_:1},8,[`items`])]))),128))])]),zoomedOutView:i(()=>[g(`div`,W,[c(j,{items:M.value,selectionMode:`None`,isItemClickEnabled:!0,onItemClick:te},{item:i(({item:t})=>[g(`div`,G,[n[5]||=g(`span`,{class:`group-icon`},``,-1),g(`span`,K,e(t.title),1),g(`span`,q,e(t.count)+` items`,1)])]),_:1},8,[`items`])])]),_:1},8,[`isZoomedInViewActive`,`canChangeViews`])]),options:i(()=>[g(`p`,J,e(b.value),1),g(`div`,Y,[c(k,{modelValue:y.value,"onUpdate:modelValue":n[1]||=e=>y.value=e},{default:i(()=>[...n[6]||=[C(` Can change views `,-1)]]),_:1},8,[`modelValue`])])]),_:1},8,[`theme`])])])]),_:1}))}},[[`__scopeId`,`data-v-9baeb568`]]);export{Q as default};