import{$ as e,D as t,H as n,K as r,L as i,N as a,S as o,U as s,Z as c,h as l,m as u,n as d,o as f,v as p}from"./WinScrollViewer-Cel0kV6s.js";import{a as m}from"./index-BYjt0VYv.js";import{n as h,t as g}from"./WinToggleButton-Dj-8G30B.js";import{t as _}from"./WinControlExample-CxPQLLlF.js";import{t as v}from"./WinPasswordBox-CFINiSTv.js";import{t as y}from"./WinDatePicker-B7kYDr8j.js";var b={class:`gallery-item-page`},x={class:`gallery-page-content`},S={class:`page-header`},C={class:`header-actions`},w={class:`icon`},T={class:`demo-form`},E={class:`demo-header`},D={class:`options-group`},O={class:`radio-group`},k={class:`radio-option`},A={class:`radio-option`},j=`<div class="sizing-demo" :class="{ 'compact-mode': isCompact }">
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
</div>`,M=`import { ref, computed } from 'vue';
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
const chosenDate = ref(new Date());`,N=d({__name:`CompactSizingPage`,setup(d){let N=r(`light`),P=r(!1),F=r(`standard`),I=u(()=>F.value===`compact`),L=r(``),R=r(``),z=r(``),B=r(``),V=r(new Date),H=()=>{N.value=N.value===`light`?`dark`:`light`},U=()=>{P.value=!P.value},W=()=>{};return(r,u)=>{let d=i(`WinScrollViewer`);return a(),p(`div`,b,[o(d,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[l(`div`,x,[l(`div`,S,[u[8]||=l(`div`,{class:`header-content`},[l(`h1`,{class:`page-title`},`Compact Sizing`),l(`p`,{class:`page-description`},` Controls can be displayed in a more compact density to enable more content to be shown in limited space. `)],-1),l(`div`,C,[o(h,t({class:`header-action`},{"tooltipservice.tooltip":`Switch to ${N.value===`light`?`dark`:`light`} theme`},{onClick:H}),{default:n(()=>[...u[7]||=[l(`span`,{class:`icon`},``,-1)]]),_:1},16),o(g,t({IsChecked:P.value,class:`header-action`},{"tooltipservice.tooltip":P.value?`Remove from favorites`:`Add to favorites`},{"onUpdate:IsChecked":U}),{default:n(()=>[l(`span`,w,e(P.value?``:``),1)]),_:1},16,[`IsChecked`])])]),u[12]||=l(`div`,{class:`supported-controls`},[l(`p`,{class:`controls-title`},[l(`strong`,null,`Controls that support compact styling:`)]),l(`ul`,{class:`controls-list`},[l(`li`,null,`ListView`),l(`li`,null,`TextBox`),l(`li`,null,`PasswordBox`),l(`li`,null,`AutoSuggestBox`),l(`li`,null,`ComboBox`),l(`li`,null,`DatePicker`),l(`li`,null,`TimePicker`),l(`li`,null,`TreeView`),l(`li`,null,`NavigationView`),l(`li`,null,`MenuBar`)])],-1),o(_,{headerText:`Compact Sizing for controls`,templateCode:j,vueCode:M},{example:n(()=>[l(`div`,{class:c([`sizing-demo`,{"compact-mode":I.value}])},[l(`div`,T,[l(`p`,E,e(I.value?`Compact Size`:`Standard Size`),1),o(m,{Text:L.value,"onUpdate:Text":u[0]||=e=>L.value=e,Header:`First Name:`,PlaceholderText:`Enter first name`},null,8,[`Text`]),o(m,{Text:R.value,"onUpdate:Text":u[1]||=e=>R.value=e,Header:`Last Name:`,PlaceholderText:`Enter last name`},null,8,[`Text`]),o(v,{modelValue:z.value,"onUpdate:modelValue":u[2]||=e=>z.value=e,Header:`Password:`,placeholder:`Enter password`},null,8,[`modelValue`]),o(v,{modelValue:B.value,"onUpdate:modelValue":u[3]||=e=>B.value=e,Header:`Confirm Password:`,placeholder:`Confirm password`},null,8,[`modelValue`]),o(y,{Date:V.value,"onUpdate:Date":u[4]||=e=>V.value=e,Header:`Pick a date`},null,8,[`Date`])])],2)]),options:n(()=>[l(`div`,D,[u[11]||=l(`p`,{class:`options-header`},`Fluent Standard and Compact Sizing`,-1),l(`div`,O,[l(`label`,k,[s(l(`input`,{type:`radio`,name:`sizing`,value:`standard`,"onUpdate:modelValue":u[5]||=e=>F.value=e,onChange:W},null,544),[[f,F.value]]),u[9]||=l(`span`,null,`Standard`,-1)]),l(`label`,A,[s(l(`input`,{type:`radio`,name:`sizing`,value:`compact`,"onUpdate:modelValue":u[6]||=e=>F.value=e,onChange:W},null,544),[[f,F.value]]),u[10]||=l(`span`,null,`Compact`,-1)])])])]),_:1})])]),_:1})])}}},[[`__scopeId`,`data-v-687967d3`]]);export{N as default};