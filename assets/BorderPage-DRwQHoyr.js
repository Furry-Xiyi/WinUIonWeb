import{$ as e,E as t,H as n,K as r,N as i,Q as a,S as o,X as s,g as c,h as l,m as u,n as d,t as f,x as p}from"./WinScrollViewer-DPrZnleG.js";import{c as m,r as h}from"./index-CMPZyTwE.js";import{t as g}from"./WinControlExample-C0uhK7Jb.js";import{t as _}from"./WinSlider-DiJySnAI.js";import{t as v}from"./pageState-Mr-1-Xo1.js";import{t as y}from"./WinRadioButton-DE2lRBbQ.js";var b={class:`gallery-item-page`},x={style:{position:`relative`},class:`page-heading`},S={class:`page-header-actions`},C={class:`icon`},w={class:`gallery-page-content`},T={style:{display:`flex`,"flex-direction":`column`,gap:`16px`}},E={style:{display:`grid`,"grid-template-columns":`1fr 1fr`,gap:`16px`}},D={style:{display:`flex`,"flex-direction":`column`,gap:`4px`}},O={style:{display:`flex`,"flex-direction":`column`,gap:`4px`}},k=`const borderThickness = ref(2);
const selectedBackground = ref('White');
const selectedBorderBrush = ref('Yellow');

const backgroundColor = computed(() => {
  const colors = {
    'Green': '#00FF00',
    'Yellow': '#FFFF00',
    'Blue': '#0000FF',
    'White': '#FFFFFF'
  };
  return colors[selectedBackground.value];
});

const borderBrushColor = computed(() => {
  const colors = {
    'Green': '#006400',
    'Yellow': '#FFD700',
    'Blue': '#00008B',
    'White': '#FFFFFF'
  };
  return colors[selectedBorderBrush.value];
});`,A=d({__name:`BorderPage`,setup(d){let A=t(`currentPage`),{isFavoriteState:j,pageTheme:M,toggleTheme:N,toggleFavorite:P}=v(u(()=>A?.value||`border`).value),F=r(2),I=r(`White`),L=r(`Yellow`),R=u(()=>({Green:`#00FF00`,Yellow:`#FFFF00`,Blue:`#0000FF`,White:`#FFFFFF`})[I.value]||`#FFFFFF`),z=u(()=>({Green:`#006400`,Yellow:`#FFD700`,Blue:`#00008B`,White:`#FFFFFF`})[L.value]||`#FFD700`),B=`<Border
  BorderThickness="${u(()=>F.value)}"
  BorderBrush="${u(()=>z.value)}"
  Background="${u(()=>R.value)}">
  <TextBlock Text="Text inside a border" FontSize="18" Foreground="Black" />
</Border>`;return(t,r)=>(i(),c(f,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[l(`div`,b,[l(`div`,x,[r[10]||=l(`h1`,{class:`page-header`},`Border`,-1),r[11]||=l(`p`,{class:`page-description`},` A Border is a container control that draws a border, background, or both, around another object. `,-1),l(`div`,S,[o(m,{class:`header-action`,onClick:s(N)},{default:n(()=>[...r[9]||=[l(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),o(h,{class:`header-action`,IsChecked:s(j),"onUpdate:IsChecked":s(P)},{default:n(()=>[l(`span`,C,e(s(j)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),l(`div`,w,[o(g,{headerText:`A Border around a TextBlock.`,theme:s(M),templateCode:B,vueCode:k},{example:n(()=>[l(`div`,{style:a({display:`inline-block`,verticalAlign:`top`,border:`${F.value}px solid ${z.value}`,background:R.value,padding:`8px 5px`})},[...r[12]||=[l(`span`,{style:{"font-size":`18px`,color:`black`}},`Text inside a border`,-1)]],4)]),options:n(()=>[l(`div`,T,[o(_,{modelValue:F.value,"onUpdate:modelValue":r[0]||=e=>F.value=e,header:`BorderThickness`,minimum:0,maximum:10,stepFrequency:1},null,8,[`modelValue`]),l(`div`,E,[l(`div`,null,[r[17]||=l(`p`,{style:{margin:`0 0 8px 0`,"font-size":`14px`,"font-weight":`600`}},`Background`,-1),l(`div`,D,[o(y,{modelValue:I.value,"onUpdate:modelValue":r[1]||=e=>I.value=e,value:`Green`,name:`bgColor`},{default:n(()=>[...r[13]||=[p(` Green `,-1)]]),_:1},8,[`modelValue`]),o(y,{modelValue:I.value,"onUpdate:modelValue":r[2]||=e=>I.value=e,value:`Yellow`,name:`bgColor`},{default:n(()=>[...r[14]||=[p(` Yellow `,-1)]]),_:1},8,[`modelValue`]),o(y,{modelValue:I.value,"onUpdate:modelValue":r[3]||=e=>I.value=e,value:`Blue`,name:`bgColor`},{default:n(()=>[...r[15]||=[p(` Blue `,-1)]]),_:1},8,[`modelValue`]),o(y,{modelValue:I.value,"onUpdate:modelValue":r[4]||=e=>I.value=e,value:`White`,name:`bgColor`},{default:n(()=>[...r[16]||=[p(` White `,-1)]]),_:1},8,[`modelValue`])])]),l(`div`,null,[r[22]||=l(`p`,{style:{margin:`0 0 8px 0`,"font-size":`14px`,"font-weight":`600`}},`BorderBrush`,-1),l(`div`,O,[o(y,{modelValue:L.value,"onUpdate:modelValue":r[5]||=e=>L.value=e,value:`Green`,name:`borderBrush`},{default:n(()=>[...r[18]||=[p(` Green `,-1)]]),_:1},8,[`modelValue`]),o(y,{modelValue:L.value,"onUpdate:modelValue":r[6]||=e=>L.value=e,value:`Yellow`,name:`borderBrush`},{default:n(()=>[...r[19]||=[p(` Yellow `,-1)]]),_:1},8,[`modelValue`]),o(y,{modelValue:L.value,"onUpdate:modelValue":r[7]||=e=>L.value=e,value:`Blue`,name:`borderBrush`},{default:n(()=>[...r[20]||=[p(` Blue `,-1)]]),_:1},8,[`modelValue`]),o(y,{modelValue:L.value,"onUpdate:modelValue":r[8]||=e=>L.value=e,value:`White`,name:`borderBrush`},{default:n(()=>[...r[21]||=[p(` White `,-1)]]),_:1},8,[`modelValue`])])])])])]),_:1},8,[`theme`])])])]),_:1}))}},[[`__scopeId`,`data-v-f54cd0fe`]]);export{A as default};