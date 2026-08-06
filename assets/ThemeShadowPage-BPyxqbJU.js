import{$ as e,A as t,H as n,K as r,N as i,Q as a,S as o,h as s,m as c,n as l,t as u,v as d}from"./WinScrollViewer-Cel0kV6s.js";import{n as f,t as p}from"./WinToggleButton-Dj-8G30B.js";import{t as m}from"./WinControlExample-CxPQLLlF.js";import{t as h}from"./WinSlider-DtUDtZWn.js";var g={class:`gallery-item-page`},_={style:{position:`relative`},class:`page-heading`},v={class:`page-header-actions`},y={class:`icon`},b={class:`gallery-page-content`},x={class:`shadow-container`},S=`<div class="shadow-container">
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
/>`,C=`import { ref, computed } from 'vue';

const zTranslation = ref(32);

const computedShadow = computed(() => {
  const depth = zTranslation.value;
  const blur = Math.max(8, depth * 0.5);
  const offsetY = Math.max(4, depth * 0.3);
  const opacity = Math.min(0.26, 0.13 + (depth / 64) * 0.13);

  return \`0 \${offsetY}px \${blur}px 0px rgba(0, 0, 0, \${opacity})\`;
});`,w=l({__name:`ThemeShadowPage`,setup(l){let w=r(`system`),T=()=>{let e=[`system`,`light`,`dark`];w.value=e[(e.indexOf(w.value)+1)%e.length]},E=r(!1),D=e=>{console.log(`Favorite toggled:`,e)},O=r(32),k=r(null),A=r(null),j=c(()=>{let e=O.value,t=Math.max(8,e*.5);return`0 ${Math.max(4,e*.3)}px ${t}px 0px rgba(0, 0, 0, ${Math.min(.26,.13+e/64*.13)})`});return t(()=>{k.value&&A.value}),(t,r)=>(i(),d(`div`,g,[s(`div`,_,[r[2]||=s(`h1`,{class:`page-header`},`ThemeShadow`,-1),r[3]||=s(`p`,{class:`page-description`},` ThemeShadow is a pre-configured shadow effect that can be applied to any XAML element to draw appropriate shadows based on x, y, z coordinates. `,-1),s(`div`,v,[o(f,{class:`header-action`,onClick:T},{default:n(()=>[...r[1]||=[s(`span`,{class:`icon`},``,-1)]]),_:1}),o(p,{class:`header-action`,IsChecked:E.value,"onUpdate:IsChecked":D},{default:n(()=>[s(`span`,y,e(E.value?``:``),1)]),_:1},8,[`IsChecked`])])]),o(u,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[s(`div`,b,[o(m,{headerText:`ThemeShadow applied to a Border`,theme:w.value,exampleHeight:`320px`,templateCode:S,vueCode:C},{example:n(()=>[s(`div`,x,[s(`div`,{ref_key:`shadowReceiver`,ref:k,class:`shadow-receiver`},null,512),s(`div`,{ref_key:`shadowCaster`,ref:A,class:`shadow-caster`,style:a({transform:`translateZ(${O.value}px)`,boxShadow:j.value})},null,4)])]),options:n(()=>[o(h,{modelValue:O.value,"onUpdate:modelValue":r[0]||=e=>O.value=e,header:`Z-translation`,min:0,max:64,stepFrequency:1,style:{width:`200px`}},null,8,[`modelValue`])]),_:1},8,[`theme`])])]),_:1})]))}},[[`__scopeId`,`data-v-2aef1d35`]]);export{w as default};