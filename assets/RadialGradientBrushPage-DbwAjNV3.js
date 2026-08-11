import{$ as e,E as t,H as n,K as r,N as i,Q as a,S as o,V as s,X as c,h as l,m as u,n as d,t as f,v as p}from"./WinScrollViewer-DPrZnleG.js";import{c as m,r as h}from"./index-CMPZyTwE.js";import{t as g}from"./WinControlExample-C0uhK7Jb.js";import{t as _}from"./WinSlider-DiJySnAI.js";import{t as v}from"./WinComboBox-D5zM9OdY.js";import{t as y}from"./pageState-Mr-1-Xo1.js";var b={class:`gallery-item-page`},x={style:{position:`relative`},class:`page-heading`},S={class:`page-header-actions`},C={class:`icon`},w={class:`gallery-page-content`},T={class:`gradient-container`},E={class:`options-grid`},D=`const mappingMode = ref('RelativeToBoundingBox');
const centerX = ref(0.25);
const centerY = ref(0.25);
const radiusX = ref(0.5);
const radiusY = ref(0.5);
const originX = ref(0.5);
const originY = ref(0.25);
const spreadMethod = ref('Pad');

const gradientStyle = computed(() => {
  const cx = centerX.value * 100;
  const cy = centerY.value * 100;
  const rx = radiusX.value * 100;
  const ry = radiusY.value * 100;

  return {
    background: \`radial-gradient(
      ellipse \${rx}% \${ry}% at \${cx}% \${cy}%,
      yellow 0%, blue 100%
    )\`
  };
});`,O=d({__name:`RadialGradientBrushPage`,setup(d){let O=t(`currentPage`),{isFavoriteState:k,pageTheme:A,toggleTheme:j,toggleFavorite:M}=y(u(()=>O?.value||`radialgradientbrush`).value),N=r(`RelativeToBoundingBox`),P=r(.25),F=r(.25),I=r(.5),L=r(.5),R=r(.5),z=r(.25),B=r(`Pad`),V=[{label:`RelativeToBoundingBox`,value:`RelativeToBoundingBox`},{label:`Absolute`,value:`Absolute`}],H=[{label:`Pad`,value:`Pad`},{label:`Reflect`,value:`Reflect`},{label:`Repeat`,value:`Repeat`}],U=u(()=>N.value===`Absolute`?200:1),W=u(()=>N.value===`Absolute`?4:.02),G=u(()=>N.value===`Absolute`?10:.05);s(N,e=>{e===`Absolute`?(P.value=100,F.value=100,I.value=100,L.value=100,R.value=100,z.value=100):(P.value=.5,F.value=.5,I.value=.5,L.value=.5,R.value=.5,z.value=.5)});let K=u(()=>{let e=N.value===`RelativeToBoundingBox`,t,n,r,i;e?(t=P.value*100,n=F.value*100,r=I.value*100,i=L.value*100,R.value*100,z.value*100):(t=P.value,n=F.value,r=I.value,i=L.value,R.value,z.value);let a=e?`%`:`px`;return{background:`radial-gradient(ellipse ${r}${a} ${i}${a} at ${t}${a} ${n}${a}, yellow 0%, blue 100%)`}}),q=u(()=>{let e=N.value===`RelativeToBoundingBox`,t=e?P.value.toFixed(2):Math.round(P.value),n=e?F.value.toFixed(2):Math.round(F.value),r=e?I.value.toFixed(2):Math.round(I.value),i=e?L.value.toFixed(2):Math.round(L.value),a=e?R.value.toFixed(2):Math.round(R.value),o=e?z.value.toFixed(2):Math.round(z.value);return`<Rectangle Width="200" Height="200">
  <Rectangle.Fill>
    <media:RadialGradientBrush
      MappingMode="${N.value}"
      Center="${t},${n}"
      RadiusX="${r}"
      RadiusY="${i}"
      GradientOrigin="${a},${o}"
      SpreadMethod="${B.value}">
      <GradientStop Color="Yellow" Offset="0.0" />
      <GradientStop Color="Blue" Offset="1" />
    </media:RadialGradientBrush>
  </Rectangle.Fill>
</Rectangle>`});return(t,r)=>(i(),p(`div`,b,[l(`div`,x,[r[9]||=l(`h1`,{class:`page-header`},`RadialGradientBrush`,-1),r[10]||=l(`p`,{class:`page-description`},` Paints an area with a radial gradient. A center point defines the origin of the gradient, and an ellipse defines the outer bounds of the gradient. `,-1),l(`div`,S,[o(m,{class:`header-action`,onClick:c(j)},{default:n(()=>[...r[8]||=[l(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),o(h,{class:`header-action`,IsChecked:c(k),"onUpdate:IsChecked":c(M)},{default:n(()=>[l(`span`,C,e(c(k)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),o(f,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[l(`div`,w,[o(g,{headerText:`RadialGradientBrush Sample`,theme:c(A),templateCode:q.value,vueCode:D},{example:n(()=>[l(`div`,T,[l(`div`,{class:`gradient-rectangle`,style:a(K.value)},null,4)])]),options:n(()=>[l(`div`,E,[o(v,{SelectedValue:N.value,"onUpdate:SelectedValue":r[0]||=e=>N.value=e,Header:`MappingMode`,ItemsSource:V,DisplayMemberPath:`label`,SelectedValuePath:`value`,style:{"grid-column":`span 2`}},null,8,[`SelectedValue`]),o(_,{modelValue:P.value,"onUpdate:modelValue":r[1]||=e=>P.value=e,header:`Center.X`,minimum:0,maximum:U.value,stepFrequency:W.value,smallChange:G.value},null,8,[`modelValue`,`maximum`,`stepFrequency`,`smallChange`]),o(_,{modelValue:F.value,"onUpdate:modelValue":r[2]||=e=>F.value=e,header:`Center.Y`,minimum:0,maximum:U.value,stepFrequency:W.value,smallChange:G.value},null,8,[`modelValue`,`maximum`,`stepFrequency`,`smallChange`]),o(_,{modelValue:I.value,"onUpdate:modelValue":r[3]||=e=>I.value=e,header:`RadiusX`,minimum:0,maximum:U.value,stepFrequency:W.value,smallChange:G.value},null,8,[`modelValue`,`maximum`,`stepFrequency`,`smallChange`]),o(_,{modelValue:L.value,"onUpdate:modelValue":r[4]||=e=>L.value=e,header:`RadiusY`,minimum:0,maximum:U.value,stepFrequency:W.value,smallChange:G.value},null,8,[`modelValue`,`maximum`,`stepFrequency`,`smallChange`]),o(_,{modelValue:R.value,"onUpdate:modelValue":r[5]||=e=>R.value=e,header:`GradientOrigin.X`,minimum:0,maximum:U.value,stepFrequency:W.value,smallChange:G.value},null,8,[`modelValue`,`maximum`,`stepFrequency`,`smallChange`]),o(_,{modelValue:z.value,"onUpdate:modelValue":r[6]||=e=>z.value=e,header:`GradientOrigin.Y`,minimum:0,maximum:U.value,stepFrequency:W.value,smallChange:G.value},null,8,[`modelValue`,`maximum`,`stepFrequency`,`smallChange`]),o(v,{SelectedValue:B.value,"onUpdate:SelectedValue":r[7]||=e=>B.value=e,Header:`SpreadMethod`,ItemsSource:H,DisplayMemberPath:`label`,SelectedValuePath:`value`,style:{"grid-column":`span 2`,"margin-top":`10px`}},null,8,[`SelectedValue`])])]),_:1},8,[`theme`,`templateCode`])])]),_:1})]))}},[[`__scopeId`,`data-v-2fa1ce98`]]);export{O as default};