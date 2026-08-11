import{$ as e,A as t,E as n,H as r,K as i,N as a,Q as o,S as s,X as c,h as l,m as u,n as d,t as f,v as p}from"./WinScrollViewer-DPrZnleG.js";import{c as m,r as h}from"./index-CMPZyTwE.js";import{t as g}from"./WinControlExample-C0uhK7Jb.js";import{t as _}from"./WinSlider-DiJySnAI.js";import{t as v}from"./pageState-Mr-1-Xo1.js";var y={class:`gallery-item-page`},b={style:{position:`relative`},class:`page-heading`},x={class:`page-header-actions`},S={class:`icon`},C={class:`gallery-page-content`},w={class:`shadow-container`},T=`<div class="shadow-container">
  <div class="shadow-receiver"></div>
  <div
    class="shadow-caster"
    :style="{
      transform: \`translateZ(\${zTranslation}px)\`,
      boxShadow: computedShadow
    }">
  </div>
</div>

<WinSlider
  v-model="zTranslation"
  header="Z-translation"
  :min="0"
  :max="64"
  :stepFrequency="1"
/>`,E=`import { ref, computed } from 'vue';

const zTranslation = ref(32);

const computedShadow = computed(() => {
  const depth = zTranslation.value;
  const blur = Math.max(8, depth * 0.5);
  const offsetY = Math.max(4, depth * 0.3);
  const opacity = Math.min(0.26, 0.13 + (depth / 64) * 0.13);

  return \`0 \${offsetY}px \${blur}px 0px rgba(0, 0, 0, \${opacity})\`;
});`,D=d({__name:`ThemeShadowPage`,setup(d){let D=n(`currentPage`),{pageTheme:O,isFavoriteState:k,toggleTheme:A,toggleFavorite:j}=v(u(()=>D?.value||`themeshadow`).value),M=i(32),N=i(null),P=i(null),F=u(()=>{let e=M.value,t=Math.max(8,e*.5);return`0 ${Math.max(4,e*.3)}px ${t}px 0px rgba(0, 0, 0, ${Math.min(.26,.13+e/64*.13)})`});return t(()=>{N.value&&P.value}),(t,n)=>(a(),p(`div`,y,[l(`div`,b,[n[2]||=l(`h1`,{class:`page-header`},`ThemeShadow`,-1),n[3]||=l(`p`,{class:`page-description`},` ThemeShadow is a pre-configured shadow effect that can be applied to any XAML element to draw appropriate shadows based on x, y, z coordinates. `,-1),l(`div`,x,[s(m,{class:`header-action`,onClick:c(A)},{default:r(()=>[...n[1]||=[l(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),s(h,{class:`header-action`,IsChecked:c(k),"onUpdate:IsChecked":c(j)},{default:r(()=>[l(`span`,S,e(c(k)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),s(f,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:r(()=>[l(`div`,C,[s(g,{headerText:`ThemeShadow applied to a Border`,theme:c(O),exampleHeight:`320px`,templateCode:T,vueCode:E},{example:r(()=>[l(`div`,w,[l(`div`,{ref_key:`shadowReceiver`,ref:N,class:`shadow-receiver`},null,512),l(`div`,{ref_key:`shadowCaster`,ref:P,class:`shadow-caster`,style:o({transform:`translateZ(${M.value}px)`,boxShadow:F.value})},null,4)])]),options:r(()=>[s(_,{modelValue:M.value,"onUpdate:modelValue":n[0]||=e=>M.value=e,header:`Z-translation`,min:0,max:64,stepFrequency:1,style:{width:`200px`}},null,8,[`modelValue`])]),_:1},8,[`theme`])])]),_:1})]))}},[[`__scopeId`,`data-v-1b2a4ba2`]]);export{D as default};