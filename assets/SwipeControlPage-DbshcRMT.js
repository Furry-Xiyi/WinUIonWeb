import{$ as e,E as t,H as n,K as r,N as i,S as a,X as o,h as s,m as c,n as l,t as u,v as d}from"./WinScrollViewer-DPrZnleG.js";import{c as f,r as p}from"./index-C9zDjg90.js";import{t as m}from"./WinControlExample-D5UB47BQ.js";import{t as h}from"./pageState-Mr-1-Xo1.js";import{t as g}from"./WinListView-BN9mqaEj.js";var _={class:`gallery-item-page`},v={style:{position:`relative`},class:`page-heading`},y={class:`page-header-actions`},b={class:`icon`},x={class:`gallery-page-content`},S={class:`output-text`},C={class:`output-text`},w={class:`swipe-placeholder`,style:{height:`68px`,width:`100%`}},T={class:`placeholder-content`},E={style:{"font-size":`24px`}},D=`<WinSwipeControl
  :leftItems="leftRevealItems"
  width="500"
  height="68">
  <template #content>
    <div style="text-align: center; padding: 12px;">
      Swipe Right
    </div>
  </template>
</WinSwipeControl>`,O=`const leftRevealItems = ref([
  {
    text: 'Accept',
    icon: '\\uE8FB',
    background: 'var(--button-background)',
    foreground: 'var(--text-primary)',
    onInvoked: () => console.log('Accept invoked')
  },
  {
    text: 'Flag',
    icon: '\\uE7C1',
    background: 'var(--button-background)',
    foreground: 'var(--text-primary)',
    onInvoked: () => console.log('Flag invoked')
  }
]);`,k=`<WinSwipeControl
  :rightItems="rightExecuteItems"
  width="500"
  height="68">
  <template #content>
    <div style="text-align: center; padding: 12px;">
      Swipe Left
    </div>
  </template>
</WinSwipeControl>`,A=`const rightExecuteItems = ref([
  {
    text: 'Archive',
    icon: '\\uE7B8',
    mode: 'Execute',
    behaviorOnInvoked: 'Close',
    onInvoked: () => console.log('Archive invoked')
  }
]);`,j=`<WinListView :items="listItems">
  <template #item="{ item }">
    <WinSwipeControl
      :leftItems="leftRevealItems"
      :rightItems="rightDeleteItems"
      height="68">
      <template #content>
        <div style="padding: 12px; font-size: 24px;">
          {{ item }}
        </div>
      </template>
    </WinSwipeControl>
  </template>
</WinListView>`,M=`const listItems = ref([
  'Adriana Giorgi',
  'Amelia Bruno',
  'Blake McMillan-Katsu'
]);

const leftRevealItems = ref([
  { text: 'Reply All', icon: '\\uE8C2', background: '#3e6fa7', foreground: 'white' },
  { text: 'Open', icon: '\\uE8C3', background: '#ff9501', foreground: 'white' }
]);

const rightDeleteItems = ref([
  {
    text: 'Delete',
    icon: '\\uE74D',
    background: 'red',
    mode: 'Execute',
    onInvoked: (item) => {
      const index = listItems.value.indexOf(item);
      if (index > -1) listItems.value.splice(index, 1);
    }
  }
]);`,N=`<WinSwipeControl
  :rightItems="gradientItems"
  width="500"
  height="68">
  <template #content>
    <div style="text-align: center; padding: 12px;">
      Swipe Left
    </div>
  </template>
</WinSwipeControl>`,P=`const gradientItems = ref([
  {
    text: 'Lock',
    icon: '\\uE72E',
    background: 'linear-gradient(90deg, #ff8990f9 0%, #ff5b66fb 50%, #ff5c1df4 100%)',
    mode: 'Execute',
    behaviorOnInvoked: 'Close'
  }
]);`,F=`<WinSwipeControl
  :leftItems="customIconItems"
  width="500"
  height="68">
  <template #content>
    <div style="text-align: center; padding: 12px;">
      Swipe Right
    </div>
  </template>
</WinSwipeControl>`,I=`const customIconItems = ref([
  {
    text: 'Coffee',
    iconSource: '/assets/CoffeeCup.png', // BitmapIconSource
    background: 'var(--button-background)',
    foreground: 'var(--text-primary)'
  }
]);`,L=l({__name:`SwipeControlPage`,setup(l){let L=t(`currentPage`),{isFavoriteState:R,pageTheme:z,toggleTheme:B,toggleFavorite:V}=h(c(()=>L?.value||`swipecontrol`).value),H=r(`Swipe right to reveal Accept and Flag actions`),U=r(`Swipe left to execute Archive action`),W=r([`Adriana Giorgi`,`Amelia Bruno`,`Blake McMillan-Katsu`,`Brandi Porter`,`Bruce Wayne`,`Clark Kent`]);return(t,r)=>(i(),d(`div`,_,[s(`div`,v,[r[1]||=s(`h1`,{class:`page-header`},`SwipeControl`,-1),r[2]||=s(`p`,{class:`page-description`},` The SwipeControl provides a touch-optimized context menu. It wraps around list items or other content, and allows the user to reveal actions by swiping left or right. `,-1),s(`div`,y,[a(f,{class:`header-action`,onClick:o(B)},{default:n(()=>[...r[0]||=[s(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),a(p,{class:`header-action`,IsChecked:o(R),"onUpdate:IsChecked":o(V)},{default:n(()=>[s(`span`,b,e(o(R)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),a(u,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[s(`div`,x,[a(m,{headerText:`Swipe Right to Reveal Actions`,theme:o(z),templateCode:D,vueCode:O},{example:n(()=>[...r[3]||=[s(`div`,{class:`swipe-placeholder`},[s(`div`,{class:`placeholder-content`},[s(`p`,{style:{margin:`0`}},`⚠️ WinSwipeControl component needs to be created`),s(`p`,{style:{margin:`4px 0 0 0`,"font-size":`12px`,color:`var(--text-secondary)`}},` Should support: leftItems (Reveal mode), Accept and Flag actions `)])],-1)]]),options:n(()=>[s(`p`,S,e(H.value),1)]),_:1},8,[`theme`]),a(m,{headerText:`Swipe Left to Execute Action`,theme:o(z),templateCode:k,vueCode:A},{example:n(()=>[r[4]||=s(`div`,{class:`swipe-placeholder`},[s(`div`,{class:`placeholder-content`},[s(`p`,{style:{margin:`0`}},`⚠️ WinSwipeControl component needs to be created`),s(`p`,{style:{margin:`4px 0 0 0`,"font-size":`12px`,color:`var(--text-secondary)`}},` Should support: rightItems (Execute mode), Archive action `)])],-1),s(`p`,C,e(U.value),1)]),_:1},8,[`theme`]),a(m,{headerText:`Custom Swipe in ListView`,theme:o(z),templateCode:j,vueCode:M},{example:n(()=>[a(g,{items:W.value,style:{width:`800px`,"max-width":`100%`,height:`300px`,"min-width":`200px`}},{item:n(({item:t})=>[s(`div`,w,[s(`div`,T,[s(`span`,E,e(t),1),r[5]||=s(`span`,{style:{"font-size":`11px`,color:`var(--text-secondary)`,"margin-left":`8px`}},` (Swipe actions: Reply All, Open, Delete) `,-1)])])]),_:1},8,[`items`])]),_:1},8,[`theme`]),a(m,{headerText:`Gradient Background Swipe`,theme:o(z),templateCode:N,vueCode:P},{example:n(()=>[...r[6]||=[s(`div`,{class:`swipe-placeholder`},[s(`div`,{class:`placeholder-content`},[s(`p`,{style:{margin:`0`}},`⚠️ WinSwipeControl component needs to be created`),s(`p`,{style:{margin:`4px 0 0 0`,"font-size":`12px`,color:`var(--text-secondary)`}},` Should support: rightItems with gradient background (Execute mode), Lock action `)])],-1)]]),_:1},8,[`theme`]),a(m,{headerText:`Custom Icons`,theme:o(z),templateCode:F,vueCode:I},{example:n(()=>[...r[7]||=[s(`div`,{class:`swipe-placeholder`},[s(`div`,{class:`placeholder-content`},[s(`p`,{style:{margin:`0`}},`⚠️ WinSwipeControl component needs to be created`),s(`p`,{style:{margin:`4px 0 0 0`,"font-size":`12px`,color:`var(--text-secondary)`}},` Should support: leftItems with custom bitmap icons (Coffee icon) `)])],-1)]]),_:1},8,[`theme`])])]),_:1})]))}},[[`__scopeId`,`data-v-5799973c`]]);export{L as default};