import{$ as e,E as t,H as n,K as r,N as i,Q as a,S as o,X as s,h as c,m as l,n as u,t as d,v as f,x as p}from"./WinScrollViewer-DPrZnleG.js";import{c as m,r as h}from"./index-CMPZyTwE.js";import{t as g}from"./WinControlExample-C0uhK7Jb.js";import{t as _}from"./WinComboBox-D5zM9OdY.js";import{t as v}from"./pageState-Mr-1-Xo1.js";import{t as y}from"./WinAnimatedVisualPlayer-BqP_czCH.js";var b={class:`gallery-item-page`},x={style:{position:`relative`},class:`page-heading`},S={class:`page-header-actions`},C={class:`icon`},w={class:`gallery-page-content`},T={style:{display:`flex`,"flex-direction":`column`,gap:`16px`,"align-items":`flex-start`}},E={style:{display:`flex`,"flex-direction":`column`,gap:`8px`}},D={style:{display:`flex`,"flex-direction":`column`,gap:`16px`}},O={style:{padding:`12px`,border:`1px solid var(--ctrl-border-rest)`,"border-radius":`8px`,background:`var(--card-bg-secondary)`}},k={style:{width:`32px`,height:`32px`,display:`flex`,"align-items":`center`,"justify-content":`center`}},A=`<WinButton @mouseenter="onButtonPointerEntered"
  @mouseleave="onButtonPointerExited"
  style="width: 75px;">
  <AnimatedIcon x:Name="SearchAnimatedIcon">
    <AnimatedIcon.Source>
      <animatedvisuals:AnimatedFindVisualSource/>
    </AnimatedIcon.Source>
    <AnimatedIcon.FallbackIconSource>
      <SymbolIconSource Symbol="Find"/>
    </AnimatedIcon.FallbackIconSource>
  </AnimatedIcon>
</WinButton>`,j=`const isAnimationPlaying = ref(false);

const onButtonPointerEntered = () => {
  // Set AnimatedIcon state to "PointerOver"
  isAnimationPlaying.value = true;
};

const onButtonPointerExited = () => {
  // Set AnimatedIcon state to "Normal"
  isAnimationPlaying.value = false;
};`,M=`<NavigationView>
  <NavigationView.MenuItems>
    <NavigationViewItem Content="Game Settings">
      <NavigationViewItem.Icon>
        <AnimatedIcon x:Name='AnimatedIcon'>
          <AnimatedIcon.Source>
            <animatedvisuals:AnimatedSettingsVisualSource/>
          </AnimatedIcon.Source>
          <AnimatedIcon.FallbackIconSource>
            <FontIconSource Glyph="&#xE713;"/>
          </AnimatedIcon.FallbackIconSource>
        </AnimatedIcon>
      </NavigationViewItem.Icon>
    </NavigationViewItem>
  </NavigationView.MenuItems>
</NavigationView>`,N=`// NavigationViewItem automatically manages AnimatedIcon states
// based on user interactions (hover, selection, etc.)

const isNavAnimationPlaying = ref(false);

const onNavItemEnter = () => {
  isNavAnimationPlaying.value = true;
};

const onNavItemLeave = () => {
  isNavAnimationPlaying.value = false;
};`,P=u({__name:`AnimatedIconPage`,setup(u){let P=t(`currentPage`),{isFavoriteState:F,pageTheme:I,toggleTheme:L,toggleFavorite:R}=v(l(()=>P?.value||`animatedicon`).value),z=r(!1),B=r(!1),V=r(4),H=[{label:`AnimatedBackVisualSource`},{label:`AnimatedChevronDownSmallVisualSource`},{label:`AnimatedChevronRightDownSmallVisualSource`},{label:`AnimatedChevronUpDownSmallVisualSource`},{label:`AnimatedFindVisualSource`},{label:`AnimatedGlobalNavigationButtonVisualSource`},{label:`AnimatedSettingsVisualSource`}],U=()=>{z.value=!0,B.value=!1},W=()=>{z.value=!1},G=r(!1),K=r(!1),q=()=>{G.value=!0,K.value=!0},J=()=>{G.value=!1,K.value=!1};return(t,r)=>(i(),f(`div`,b,[c(`div`,x,[r[2]||=c(`h1`,{class:`page-header`},`AnimatedIcon`,-1),r[3]||=c(`p`,{class:`page-description`},` AnimatedIcon is a control that displays an animated icon. These icons are created using Adobe AfterEffects and translated into Microsoft.UI.Composition objects using Lottie-Windows. The control automatically manages the animation state based on user interactions like pointer hover. `,-1),c(`div`,S,[o(m,{class:`header-action`,onClick:s(L)},{default:n(()=>[...r[1]||=[c(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),o(h,{class:`header-action`,IsChecked:s(F),"onUpdate:IsChecked":s(R)},{default:n(()=>[c(`span`,C,e(s(F)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),o(d,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[c(`div`,w,[o(g,{headerText:`Adding AnimatedIcon to a button`,theme:s(I),templateCode:A,vueCode:j},{example:n(()=>[c(`div`,T,[r[4]||=c(`p`,{style:{margin:`0`,"font-size":`14px`,color:`var(--text-secondary)`,"max-width":`500px`}},[p(` The following example is a button that the user hovers over to trigger the animation. The AnimatedIcon consumes the animation created using Adobe AfterEffects and translated into Microsoft.UI.Composition objects using `),c(`a`,{href:`https://aka.ms/lottie`,style:{color:`var(--accent-base)`}},`Lottie-Windows`),p(`. `)],-1),o(m,{onMouseenter:U,onMouseleave:W,style:{width:`75px`,height:`40px`}},{default:n(()=>[o(y,{playing:z.value,reversed:B.value,duration:800},null,8,[`playing`,`reversed`])]),_:1})])]),options:n(()=>[c(`div`,E,[r[5]||=c(`label`,{style:{"font-size":`12px`,color:`var(--text-secondary)`}},`Kind`,-1),o(_,{SelectedIndex:V.value,"onUpdate:SelectedIndex":r[0]||=e=>V.value=e,ItemsSource:H,DisplayMemberPath:`label`,style:{"min-width":`240px`}},null,8,[`SelectedIndex`])])]),_:1},8,[`theme`]),o(g,{headerText:`Adding AnimatedIcon to a NavigationView`,theme:s(I),templateCode:M,vueCode:N},{example:n(()=>[c(`div`,D,[r[7]||=c(`p`,{style:{margin:`0`,"font-size":`14px`,color:`var(--text-secondary)`,"max-width":`500px`}},` If you set an AnimatedIcon as the value of the Icon property, the NavigationViewItem will set the states of the AnimatedIcon for you, according to the states of the control. For this example, this shows a custom animation that was generated by the LottieGen tool. `,-1),c(`div`,O,[c(`div`,{style:a([{display:`flex`,"align-items":`center`,gap:`12px`,padding:`8px`,cursor:`pointer`,"border-radius":`4px`,transition:`background 0.1s`},{background:G.value?`var(--ctrl-fill-subtle)`:`transparent`}]),onMouseenter:q,onMouseleave:J},[c(`div`,k,[o(y,{playing:K.value,reversed:!1,duration:600},null,8,[`playing`])]),r[6]||=c(`span`,{style:{"font-size":`14px`,color:`var(--text-primary)`}},`Game Settings`,-1)],36)])])]),_:1},8,[`theme`])])]),_:1})]))}},[[`__scopeId`,`data-v-17736234`]]);export{P as default};