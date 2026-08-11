import{$ as e,D as t,E as n,H as r,K as i,L as a,N as o,S as s,U as c,X as l,Z as u,h as d,m as f,n as p,o as m,v as h}from"./WinScrollViewer-DPrZnleG.js";import{c as g,f as _,r as v}from"./index-CMPZyTwE.js";import{t as y}from"./WinControlExample-C0uhK7Jb.js";import{t as b}from"./pageState-Mr-1-Xo1.js";import{t as x}from"./WinPasswordBox-B8cIxhvW.js";import{t as S}from"./WinDatePicker--1ZUf2zN.js";var C={class:`gallery-item-page`},w={class:`gallery-page-content`},T={class:`page-header`},E={class:`header-actions`},D={class:`icon`},O={class:`demo-form`},k={class:`demo-header`},A={class:`options-group`},j={class:`radio-group`},M={class:`radio-option`},N={class:`radio-option`},P=`<div class="sizing-demo" :class="{ 'compact-mode': isCompact }">
  <div class="demo-form">
    <p class="demo-header">{{ isCompact ? 'Compact Size' : 'Standard Size' }}</p>
    <WinTextBox
      v-model:Text="firstName"
      Header="First Name:"
      PlaceholderText="Enter first name" />
    <WinTextBox
      v-model:Text="lastName"
      Header="Last Name:"
      PlaceholderText="Enter last name" />
    <WinPasswordBox
      v-model="password"
      Header="Password:"
      placeholder="Enter password" />
    <WinPasswordBox
      v-model="confirmPassword"
      Header="Confirm Password:"
      placeholder="Confirm password" />
    <WinDatePicker
      v-model:Date="chosenDate"
      Header="Pick a date" />
  </div>
</div>`,F=`import { ref, computed } from 'vue';
import WinTextBox from '../../components/WinTextBox.vue';
import WinPasswordBox from '../../components/WinPasswordBox.vue';
import WinDatePicker from '../../components/WinDatePicker.vue';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const sizingMode = ref('standard');
const isCompact = computed(() => sizingMode.value === 'compact');

const firstName = ref('');
const lastName = ref('');
const password = ref('');
const confirmPassword = ref('');
const chosenDate = ref(new Date());`,I=p({__name:`CompactSizingPage`,setup(p){let I=n(`currentPage`),{pageTheme:L,isFavoriteState:R,toggleTheme:z,toggleFavorite:B}=b(f(()=>I?.value||`compactsizing`).value),V=i(`standard`),H=f(()=>V.value===`compact`),U=i(``),W=i(``),G=i(``),K=i(``),q=i(new Date),J=()=>{};return(n,i)=>{let f=a(`WinScrollViewer`);return o(),h(`div`,C,[s(f,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:r(()=>[d(`div`,w,[d(`div`,T,[i[8]||=d(`div`,{class:`header-content`},[d(`h1`,{class:`page-title`},`Compact Sizing`),d(`p`,{class:`page-description`},` Controls can be displayed in a more compact density to enable more content to be shown in limited space. `)],-1),d(`div`,E,[s(g,t({class:`header-action`},{"tooltipservice.tooltip":`Switch to ${l(L)===`light`?`dark`:`light`} theme`},{onClick:l(z)}),{default:r(()=>[...i[7]||=[d(`span`,{class:`icon`},``,-1)]]),_:1},16,[`onClick`]),s(v,t({IsChecked:l(R),class:`header-action`},{"tooltipservice.tooltip":l(R)?`Remove from favorites`:`Add to favorites`},{"onUpdate:IsChecked":l(B)}),{default:r(()=>[d(`span`,D,e(l(R)?``:``),1)]),_:1},16,[`IsChecked`,`onUpdate:IsChecked`])])]),i[12]||=d(`div`,{class:`supported-controls`},[d(`p`,{class:`controls-title`},[d(`strong`,null,`Controls that support compact styling:`)]),d(`ul`,{class:`controls-list`},[d(`li`,null,`ListView`),d(`li`,null,`TextBox`),d(`li`,null,`PasswordBox`),d(`li`,null,`AutoSuggestBox`),d(`li`,null,`ComboBox`),d(`li`,null,`DatePicker`),d(`li`,null,`TimePicker`),d(`li`,null,`TreeView`),d(`li`,null,`NavigationView`),d(`li`,null,`MenuBar`)])],-1),s(y,{theme:l(L),headerText:`Compact Sizing for controls`,templateCode:P,vueCode:F},{example:r(()=>[d(`div`,{class:u([`sizing-demo`,{"compact-mode":H.value}])},[d(`div`,O,[d(`p`,k,e(H.value?`Compact Size`:`Standard Size`),1),s(_,{Text:U.value,"onUpdate:Text":i[0]||=e=>U.value=e,Header:`First Name:`,PlaceholderText:`Enter first name`},null,8,[`Text`]),s(_,{Text:W.value,"onUpdate:Text":i[1]||=e=>W.value=e,Header:`Last Name:`,PlaceholderText:`Enter last name`},null,8,[`Text`]),s(x,{modelValue:G.value,"onUpdate:modelValue":i[2]||=e=>G.value=e,Header:`Password:`,placeholder:`Enter password`},null,8,[`modelValue`]),s(x,{modelValue:K.value,"onUpdate:modelValue":i[3]||=e=>K.value=e,Header:`Confirm Password:`,placeholder:`Confirm password`},null,8,[`modelValue`]),s(S,{Date:q.value,"onUpdate:Date":i[4]||=e=>q.value=e,Header:`Pick a date`},null,8,[`Date`])])],2)]),options:r(()=>[d(`div`,A,[i[11]||=d(`p`,{class:`options-header`},`Fluent Standard and Compact Sizing`,-1),d(`div`,j,[d(`label`,M,[c(d(`input`,{type:`radio`,name:`sizing`,value:`standard`,"onUpdate:modelValue":i[5]||=e=>V.value=e,onChange:J},null,544),[[m,V.value]]),i[9]||=d(`span`,null,`Standard`,-1)]),d(`label`,N,[c(d(`input`,{type:`radio`,name:`sizing`,value:`compact`,"onUpdate:modelValue":i[6]||=e=>V.value=e,onChange:J},null,544),[[m,V.value]]),i[10]||=d(`span`,null,`Compact`,-1)])])])]),_:1},8,[`theme`])])]),_:1})])}}},[[`__scopeId`,`data-v-a3f6d358`]]);export{I as default};