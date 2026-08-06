import{$ as e,D as t,H as n,K as r,L as ee,N as i,S as a,_ as o,h as s,n as c,v as l}from"./WinScrollViewer-Cel0kV6s.js";import{n as u,t as te}from"./WinToggleButton-Dj-8G30B.js";import{t as d}from"./WinControlExample-CxPQLLlF.js";import{t as f}from"./WinSlider-DtUDtZWn.js";import{t as p}from"./WinToggleSwitch-c4gwv61a.js";var m={class:`gallery-item-page`},h={class:`gallery-page-content`},g={class:`page-header`},_={class:`page-actions`},v={class:`icon`},y={width:`320`,height:`200`,style:{background:`transparent`}},ne=[`x1`,`y1`,`x2`,`y2`,`stroke-width`],re={style:{position:`relative`,width:`320px`,height:`170px`}},ie={width:`320`,height:`170`,style:{position:`absolute`,top:`20px`,left:`0`}},b=[`stroke-width`],x={key:0,x:`0`,y:`140`,"font-size":`12`,fill:`var(--text-primary)`},ae={key:1,x:`50`,y:`40`,"font-size":`12`,fill:`var(--text-primary)`},S={key:2,x:`200`,y:`40`,"font-size":`12`,fill:`var(--text-primary)`},C={key:3,x:`240`,y:`140`,"font-size":`12`,fill:`var(--text-primary)`},w={style:{position:`relative`,width:`320px`,height:`200px`}},T={width:`420`,height:`200`,style:{position:`absolute`,top:`20px`,left:`0`}},E=[`stroke-width`],D={key:0,x:`0`,y:`130`,"font-size":`12`,fill:`var(--text-primary)`},O={key:1,x:`40`,y:`75`,"font-size":`12`,fill:`var(--text-primary)`},k={key:2,x:`280`,y:`175`,"font-size":`12`,fill:`var(--text-primary)`},A={key:3,x:`360`,y:`60`,"font-size":`12`,fill:`var(--text-primary)`},j={key:4,x:`170`,y:`60`,"font-size":`12`,fill:`var(--text-primary)`},M={style:{width:`200px`,height:`170px`}},N={width:`200`,height:`150`},P={id:`compositeShape`},F=[`rx`,`ry`],I=`<script setup>
import { ref } from 'vue';

const lineX1 = ref(0);
const lineY1 = ref(0);
const lineX2 = ref(200);
const lineY2 = ref(0);
const lineThickness = ref(5);
<\/script>`,oe=`<script setup>
import { ref } from 'vue';

const showPolylinePoints = ref(false);
const polylineThickness = ref(2);
<\/script>`,L=`<script setup>
import { ref } from 'vue';

const showPathPoints = ref(false);
const pathThickness = ref(2);
<\/script>`,R=`<script setup>
import { ref } from 'vue';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const ellipseRadiusX = ref(30);
const ellipseRadiusY = ref(30);
<\/script>`,z=c({__name:`LinePage`,setup(c){let z=r(`system`),B=r(!1),V=()=>{let e=[`system`,`light`,`dark`];z.value=e[(e.indexOf(z.value)+1)%e.length]},H=()=>{B.value=!B.value},U=r(0),W=r(0),G=r(200),K=r(0),q=r(5),J=r(!1),Y=r(2),X=r(!1),Z=r(2),Q=r(30),$=r(30),se=`<svg width="320" height="200">
  <line
    x1="${U.value}"
    y1="${W.value}"
    x2="${G.value}"
    y2="${K.value}"
    stroke-width="${q.value}"
    stroke="SteelBlue"
    transform="translate(0, 50)" />
</svg>`,ce=`<svg width="320" height="170">
  <polyline
    points="10,100 60,40 200,40 250,100"
    fill="none"
    stroke="black"
    :stroke-width="${Y.value}" />
</svg>`,le=`<svg width="420" height="200">
  <path
    d="M 10,100 C 100,25 300,250 400,75 H 200"
    fill="none"
    stroke="DarkGoldenRod"
    :stroke-width="${Z.value}" />
</svg>`,ue=`<svg width="200" height="150">
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
</svg>`;return(r,c)=>{let z=ee(`WinScrollViewer`);return i(),l(`div`,m,[a(z,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[s(`div`,h,[s(`div`,g,[c[12]||=s(`div`,{class:`page-title-section`},[s(`h1`,{class:`page-title`},`Line`),s(`p`,{class:`page-description`},` Line, Polyline, Path, and GeometryGroup allow you to draw shapes and curves on the screen. `)],-1),s(`div`,_,[a(u,t({class:`header-action`},{"tooltipservice.tooltip":`Toggle theme`},{onClick:V}),{default:n(()=>[...c[11]||=[s(`span`,{class:`icon`},``,-1)]]),_:1},16),a(te,t({IsChecked:B.value,class:`header-action`},{"tooltipservice.tooltip":B.value?`Remove from favorites`:`Add to favorites`},{"onUpdate:IsChecked":H}),{default:n(()=>[s(`span`,v,e(B.value?``:``),1)]),_:1},16,[`IsChecked`])])]),a(d,{headerText:`Line`,templateCode:se,vueCode:I},{example:n(()=>[(i(),l(`svg`,y,[s(`line`,{x1:U.value,y1:W.value,x2:G.value,y2:K.value,"stroke-width":q.value,stroke:`SteelBlue`,transform:`translate(0, 50)`},null,8,ne)]))]),options:n(()=>[a(f,{modelValue:U.value,"onUpdate:modelValue":c[0]||=e=>U.value=e,header:`Start point X`,minimum:0,maximum:100,stepFrequency:.5},null,8,[`modelValue`]),a(f,{modelValue:W.value,"onUpdate:modelValue":c[1]||=e=>W.value=e,header:`Start point Y`,minimum:0,maximum:100,stepFrequency:.5},null,8,[`modelValue`]),a(f,{modelValue:G.value,"onUpdate:modelValue":c[2]||=e=>G.value=e,header:`End point X`,minimum:200,maximum:300,stepFrequency:.5},null,8,[`modelValue`]),a(f,{modelValue:K.value,"onUpdate:modelValue":c[3]||=e=>K.value=e,header:`End point Y`,minimum:0,maximum:100,stepFrequency:.5},null,8,[`modelValue`]),a(f,{modelValue:q.value,"onUpdate:modelValue":c[4]||=e=>q.value=e,header:`Stroke Thickness`,minimum:5,maximum:10,stepFrequency:.5},null,8,[`modelValue`])]),_:1}),a(d,{headerText:`Polyline`,templateCode:ce,vueCode:oe},{example:n(()=>[s(`div`,re,[c[13]||=s(`p`,{style:{margin:`0 0 10px 0`,color:`var(--text-primary)`}},` Draws a series of connected straight lines. `,-1),(i(),l(`svg`,ie,[s(`polyline`,{points:`10,100 60,40 200,40 250,100`,fill:`none`,stroke:`black`,"stroke-width":Y.value},null,8,b),J.value?(i(),l(`text`,x,`Point #1: (10,100)`)):o(``,!0),J.value?(i(),l(`text`,ae,`Point #2: (60,40)`)):o(``,!0),J.value?(i(),l(`text`,S,`Point #3: (200,40)`)):o(``,!0),J.value?(i(),l(`text`,C,`Point #4: (250,100)`)):o(``,!0)]))]),a(p,{modelValue:J.value,"onUpdate:modelValue":c[5]||=e=>J.value=e,header:`Show points`},null,8,[`modelValue`]),a(f,{modelValue:Y.value,"onUpdate:modelValue":c[6]||=e=>Y.value=e,header:`Stroke Thickness`,minimum:2,maximum:10,stepFrequency:.5},null,8,[`modelValue`])]),_:1}),a(d,{headerText:`Path`,templateCode:le,vueCode:L},{example:n(()=>[s(`div`,w,[c[14]||=s(`p`,{style:{margin:`0 0 10px 0`,color:`var(--text-primary)`}},` Draws a series of connected lines and curves. `,-1),(i(),l(`svg`,T,[s(`path`,{d:`M 10,100 C 100,25 300,250 400,75 H 200`,fill:`none`,stroke:`DarkGoldenRod`,"stroke-width":Z.value},null,8,E),X.value?(i(),l(`text`,D,`Point #1: (10,100)`)):o(``,!0),X.value?(i(),l(`text`,O,`Point #2: (100,25)`)):o(``,!0),X.value?(i(),l(`text`,k,`Point #3: (300,250)`)):o(``,!0),X.value?(i(),l(`text`,A,`Point #4: (400,75)`)):o(``,!0),X.value?(i(),l(`text`,j,`Point #5: (200,75)`)):o(``,!0)]))]),a(p,{modelValue:X.value,"onUpdate:modelValue":c[7]||=e=>X.value=e,header:`Show points`},null,8,[`modelValue`]),a(f,{modelValue:Z.value,"onUpdate:modelValue":c[8]||=e=>Z.value=e,header:`Stroke Thickness`,minimum:2,maximum:10,stepFrequency:.5},null,8,[`modelValue`])]),_:1}),a(d,{headerText:`GeometryGroup`,templateCode:ue,vueCode:R},{example:n(()=>[s(`div`,M,[c[18]||=s(`p`,{style:{margin:`0 0 15px 0`,color:`var(--text-primary)`}},` Composite geometry objects can be created using a GeometryGroup. `,-1),(i(),l(`svg`,N,[s(`defs`,null,[s(`g`,P,[c[15]||=s(`line`,{x1:`10`,y1:`10`,x2:`50`,y2:`30`,stroke:`black`,"stroke-width":`4`},null,-1),s(`ellipse`,{cx:`40`,cy:`70`,rx:Q.value,ry:$.value,fill:`#CCCCFF`,stroke:`black`,"stroke-width":`4`},null,8,F),c[16]||=s(`rect`,{x:`30`,y:`55`,width:`100`,height:`30`,fill:`#CCCCFF`,stroke:`black`,"stroke-width":`4`},null,-1)])]),c[17]||=s(`use`,{href:`#compositeShape`},null,-1)]))]),a(f,{modelValue:Q.value,"onUpdate:modelValue":c[9]||=e=>Q.value=e,header:`RadiusX`,minimum:30,maximum:40,stepFrequency:.5},null,8,[`modelValue`]),a(f,{modelValue:$.value,"onUpdate:modelValue":c[10]||=e=>$.value=e,header:`RadiusY`,minimum:30,maximum:50,stepFrequency:.5},null,8,[`modelValue`])]),_:1})])]),_:1})])}}},[[`__scopeId`,`data-v-3a27351f`]]);export{z as default};