import{$ as e,D as t,E as n,H as r,K as i,L as ee,N as a,S as o,X as s,_ as c,h as l,m as u,n as d,v as f}from"./WinScrollViewer-DPrZnleG.js";import{c as p,r as m}from"./index-tSMy-Rvo.js";import{t as h}from"./WinControlExample-Bhk8EOgV.js";import{t as g}from"./WinSlider-4mmPed_E.js";import{t as _}from"./pageState-Mr-1-Xo1.js";import{t as v}from"./WinToggleSwitch-VLOrEm02.js";var te={class:`gallery-item-page`},ne={class:`gallery-page-content`},re={class:`page-header`},ie={class:`page-actions`},ae={class:`icon`},oe={width:`320`,height:`200`,style:{background:`transparent`}},se=[`x1`,`y1`,`x2`,`y2`,`stroke-width`],ce={style:{position:`relative`,width:`320px`,height:`170px`}},le={width:`320`,height:`170`,style:{position:`absolute`,top:`20px`,left:`0`}},y=[`stroke-width`],b={key:0,x:`0`,y:`140`,"font-size":`12`,fill:`var(--text-primary)`},x={key:1,x:`50`,y:`40`,"font-size":`12`,fill:`var(--text-primary)`},S={key:2,x:`200`,y:`40`,"font-size":`12`,fill:`var(--text-primary)`},C={key:3,x:`240`,y:`140`,"font-size":`12`,fill:`var(--text-primary)`},w={style:{position:`relative`,width:`320px`,height:`200px`}},T={width:`420`,height:`200`,style:{position:`absolute`,top:`20px`,left:`0`}},E=[`stroke-width`],D={key:0,x:`0`,y:`130`,"font-size":`12`,fill:`var(--text-primary)`},O={key:1,x:`40`,y:`75`,"font-size":`12`,fill:`var(--text-primary)`},k={key:2,x:`280`,y:`175`,"font-size":`12`,fill:`var(--text-primary)`},A={key:3,x:`360`,y:`60`,"font-size":`12`,fill:`var(--text-primary)`},j={key:4,x:`170`,y:`60`,"font-size":`12`,fill:`var(--text-primary)`},M={style:{width:`200px`,height:`170px`}},N={width:`200`,height:`150`},P={id:`compositeShape`},F=[`rx`,`ry`],I=`<script setup>
import { ref } from 'vue';

const lineX1 = ref(0);
const lineY1 = ref(0);
const lineX2 = ref(200);
const lineY2 = ref(0);
const lineThickness = ref(5);
<\/script>`,L=`<script setup>
import { ref } from 'vue';

const showPolylinePoints = ref(false);
const polylineThickness = ref(2);
<\/script>`,ue=`<script setup>
import { ref } from 'vue';

const showPathPoints = ref(false);
const pathThickness = ref(2);
<\/script>`,R=`<script setup>
import { ref } from 'vue';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const ellipseRadiusX = ref(30);
const ellipseRadiusY = ref(30);
<\/script>`,z=d({__name:`LinePage`,setup(d){let z=n(`currentPage`),{pageTheme:de,isFavoriteState:B,toggleTheme:V,toggleFavorite:H}=_(u(()=>z?.value||`line`).value),U=i(0),W=i(0),G=i(200),K=i(0),q=i(5),J=i(!1),Y=i(2),X=i(!1),Z=i(2),Q=i(30),$=i(30),fe=`<svg width="320" height="200">
  <line
    x1="${U.value}"
    y1="${W.value}"
    x2="${G.value}"
    y2="${K.value}"
    stroke-width="${q.value}"
    stroke="SteelBlue"
    transform="translate(0, 50)" />
</svg>`,pe=`<svg width="320" height="170">
  <polyline
    points="10,100 60,40 200,40 250,100"
    fill="none"
    stroke="black"
    :stroke-width="${Y.value}" />
</svg>`,me=`<svg width="420" height="200">
  <path
    d="M 10,100 C 100,25 300,250 400,75 H 200"
    fill="none"
    stroke="DarkGoldenRod"
    :stroke-width="${Z.value}" />
</svg>`,he=`<svg width="200" height="150">
  <defs>
    <g id="compositeShape">
      <line x1="10" y1="10" x2="50" y2="30" stroke="black" stroke-width="4" />
      <ellipse
        cx="40"
        cy="70"
        :rx="${Q.value}"
        :ry="${$.value}"
        fill="#CCCCFF"
        stroke="black"
        stroke-width="4" />
      <rect x="30" y="55" width="100" height="30" fill="#CCCCFF" stroke="black" stroke-width="4" />
    </g>
  </defs>
  <use href="#compositeShape" />
</svg>`;return(n,i)=>{let u=ee(`WinScrollViewer`);return a(),f(`div`,te,[o(u,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:r(()=>[l(`div`,ne,[l(`div`,re,[i[12]||=l(`div`,{class:`page-title-section`},[l(`h1`,{class:`page-title`},`Line`),l(`p`,{class:`page-description`},` Line, Polyline, Path, and GeometryGroup allow you to draw shapes and curves on the screen. `)],-1),l(`div`,ie,[o(p,t({class:`header-action`},{"tooltipservice.tooltip":`Toggle theme`},{onClick:s(V)}),{default:r(()=>[...i[11]||=[l(`span`,{class:`icon`},``,-1)]]),_:1},16,[`onClick`]),o(m,t({IsChecked:s(B),class:`header-action`},{"tooltipservice.tooltip":s(B)?`Remove from favorites`:`Add to favorites`},{"onUpdate:IsChecked":s(H)}),{default:r(()=>[l(`span`,ae,e(s(B)?``:``),1)]),_:1},16,[`IsChecked`,`onUpdate:IsChecked`])])]),o(h,{headerText:`Line`,templateCode:fe,vueCode:I},{example:r(()=>[(a(),f(`svg`,oe,[l(`line`,{x1:U.value,y1:W.value,x2:G.value,y2:K.value,"stroke-width":q.value,stroke:`SteelBlue`,transform:`translate(0, 50)`},null,8,se)]))]),options:r(()=>[o(g,{modelValue:U.value,"onUpdate:modelValue":i[0]||=e=>U.value=e,header:`Start point X`,minimum:0,maximum:100,stepFrequency:.5},null,8,[`modelValue`]),o(g,{modelValue:W.value,"onUpdate:modelValue":i[1]||=e=>W.value=e,header:`Start point Y`,minimum:0,maximum:100,stepFrequency:.5},null,8,[`modelValue`]),o(g,{modelValue:G.value,"onUpdate:modelValue":i[2]||=e=>G.value=e,header:`End point X`,minimum:200,maximum:300,stepFrequency:.5},null,8,[`modelValue`]),o(g,{modelValue:K.value,"onUpdate:modelValue":i[3]||=e=>K.value=e,header:`End point Y`,minimum:0,maximum:100,stepFrequency:.5},null,8,[`modelValue`]),o(g,{modelValue:q.value,"onUpdate:modelValue":i[4]||=e=>q.value=e,header:`Stroke Thickness`,minimum:5,maximum:10,stepFrequency:.5},null,8,[`modelValue`])]),_:1}),o(h,{headerText:`Polyline`,templateCode:pe,vueCode:L},{example:r(()=>[l(`div`,ce,[i[13]||=l(`p`,{style:{margin:`0 0 10px 0`,color:`var(--text-primary)`}},` Draws a series of connected straight lines. `,-1),(a(),f(`svg`,le,[l(`polyline`,{points:`10,100 60,40 200,40 250,100`,fill:`none`,stroke:`black`,"stroke-width":Y.value},null,8,y),J.value?(a(),f(`text`,b,`Point #1: (10,100)`)):c(``,!0),J.value?(a(),f(`text`,x,`Point #2: (60,40)`)):c(``,!0),J.value?(a(),f(`text`,S,`Point #3: (200,40)`)):c(``,!0),J.value?(a(),f(`text`,C,`Point #4: (250,100)`)):c(``,!0)]))]),o(v,{modelValue:J.value,"onUpdate:modelValue":i[5]||=e=>J.value=e,header:`Show points`},null,8,[`modelValue`]),o(g,{modelValue:Y.value,"onUpdate:modelValue":i[6]||=e=>Y.value=e,header:`Stroke Thickness`,minimum:2,maximum:10,stepFrequency:.5},null,8,[`modelValue`])]),_:1}),o(h,{headerText:`Path`,templateCode:me,vueCode:ue},{example:r(()=>[l(`div`,w,[i[14]||=l(`p`,{style:{margin:`0 0 10px 0`,color:`var(--text-primary)`}},` Draws a series of connected lines and curves. `,-1),(a(),f(`svg`,T,[l(`path`,{d:`M 10,100 C 100,25 300,250 400,75 H 200`,fill:`none`,stroke:`DarkGoldenRod`,"stroke-width":Z.value},null,8,E),X.value?(a(),f(`text`,D,`Point #1: (10,100)`)):c(``,!0),X.value?(a(),f(`text`,O,`Point #2: (100,25)`)):c(``,!0),X.value?(a(),f(`text`,k,`Point #3: (300,250)`)):c(``,!0),X.value?(a(),f(`text`,A,`Point #4: (400,75)`)):c(``,!0),X.value?(a(),f(`text`,j,`Point #5: (200,75)`)):c(``,!0)]))]),o(v,{modelValue:X.value,"onUpdate:modelValue":i[7]||=e=>X.value=e,header:`Show points`},null,8,[`modelValue`]),o(g,{modelValue:Z.value,"onUpdate:modelValue":i[8]||=e=>Z.value=e,header:`Stroke Thickness`,minimum:2,maximum:10,stepFrequency:.5},null,8,[`modelValue`])]),_:1}),o(h,{headerText:`GeometryGroup`,templateCode:he,vueCode:R},{example:r(()=>[l(`div`,M,[i[18]||=l(`p`,{style:{margin:`0 0 15px 0`,color:`var(--text-primary)`}},` Composite geometry objects can be created using a GeometryGroup. `,-1),(a(),f(`svg`,N,[l(`defs`,null,[l(`g`,P,[i[15]||=l(`line`,{x1:`10`,y1:`10`,x2:`50`,y2:`30`,stroke:`black`,"stroke-width":`4`},null,-1),l(`ellipse`,{cx:`40`,cy:`70`,rx:Q.value,ry:$.value,fill:`#CCCCFF`,stroke:`black`,"stroke-width":`4`},null,8,F),i[16]||=l(`rect`,{x:`30`,y:`55`,width:`100`,height:`30`,fill:`#CCCCFF`,stroke:`black`,"stroke-width":`4`},null,-1)])]),i[17]||=l(`use`,{href:`#compositeShape`},null,-1)]))]),o(g,{modelValue:Q.value,"onUpdate:modelValue":i[9]||=e=>Q.value=e,header:`RadiusX`,minimum:30,maximum:40,stepFrequency:.5},null,8,[`modelValue`]),o(g,{modelValue:$.value,"onUpdate:modelValue":i[10]||=e=>$.value=e,header:`RadiusY`,minimum:30,maximum:50,stepFrequency:.5},null,8,[`modelValue`])]),_:1})])]),_:1})])}}},[[`__scopeId`,`data-v-22d6c37a`]]);export{z as default};