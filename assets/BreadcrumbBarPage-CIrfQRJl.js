import{D as e,E as t,H as n,K as r,N as i,O as a,S as o,X as s,g as c,h as l,m as u,n as d,t as f}from"./WinScrollViewer-DPrZnleG.js";import{t as p}from"./WinTextBlock-CeUskDRc.js";import{a as m}from"./i18n-DA-FIA7C.js";import{c as h,i as g,r as _,s as v}from"./index-CMPZyTwE.js";import{t as y}from"./WinControlExample-C0uhK7Jb.js";import{t as b}from"./pageState-Mr-1-Xo1.js";var x={class:`gallery-item-page`},S={class:`page-heading`},C={class:`page-header-actions`},w={class:`gallery-page-content`},T=d({__name:`BreadcrumbBarPage`,setup(d){let{t:T}=m(),E=t(`currentPage`),{isFavoriteState:D,pageTheme:O,toggleTheme:k,toggleFavorite:A}=b(u(()=>E?.value||`breadcrumbbar`).value),j=[{Name:T(`sample.breadcrumbbar.home`)},{Name:T(`sample.breadcrumbbar.folder-1`)},{Name:T(`sample.breadcrumbbar.folder-2`)},{Name:T(`sample.breadcrumbbar.folder-3`)}],M=r([]),N=r(``),P=[T(`sample.breadcrumbbar.home`),T(`sample.breadcrumbbar.documents`),T(`sample.breadcrumbbar.design`),T(`sample.breadcrumbbar.northwind`),T(`sample.breadcrumbbar.images`),T(`sample.breadcrumbbar.folder-1`),T(`sample.breadcrumbbar.folder-2`),T(`sample.breadcrumbbar.folder-3`)];for(let e of j)M.value.push(e);let F=(e,t)=>{let n=e.ItemsSource;for(let e=n.length-1;e>=t.Index+1;--e)n.splice(e,1)},I=()=>{let e=M.value;for(let t of j)e.includes(t)||e.push(t);N.value=``,a(()=>{N.value=T(`sample.breadcrumbbar.reset-success`)})},L=`<WinBreadcrumbBar :ItemsSource="FoldersString" />

<script setup>
const FoldersString = ${JSON.stringify(P,null,2)};
<\/script>`,R=`<WinBreadcrumbBar
  :ItemsSource="Folders"
  @ItemClicked="BreadcrumbBar2_ItemClicked">
  <template #ItemTemplate="{ Item }">
    <WinTextBlock
      :Text="Item.Name"
      v-bind="{ 'AutomationProperties.Name': Item.Name }" />
  </template>
</WinBreadcrumbBar>

<script setup>
import { ref } from 'vue';

const Folders = ref(${JSON.stringify(j,null,2)});

const BreadcrumbBar2_ItemClicked = (sender, args) => {
  const items = sender.ItemsSource;
  for (let Index = items.length - 1; Index >= args.Index + 1; Index -= 1) {
    items.splice(Index, 1);
  }
};
<\/script>`;return(t,r)=>(i(),c(f,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[l(`div`,x,[l(`div`,S,[o(p,{class:`page-header`,Text:t.$t(`text.breadcrumbbar`)},null,8,[`Text`]),o(p,{class:`page-description`,Text:t.$t(`text.breadcrumbbar-description`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),l(`div`,C,[o(h,{class:`header-action`,onClick:s(k)},{default:n(()=>[o(p,{class:`icon`,Text:``})]),_:1},8,[`onClick`]),o(_,{IsChecked:s(D),class:`header-action`,"onUpdate:IsChecked":s(A)},{default:n(()=>[o(p,{class:`icon`,Text:s(D)?``:``},null,8,[`Text`])]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),l(`div`,w,[o(g,null,{default:n(()=>[o(y,{class:`basic-input-example-theme`,theme:s(O),vue:L,headerText:t.$t(`sample.breadcrumbbar.control`)},{example:n(()=>[o(v,{ItemsSource:P})]),_:1},8,[`theme`,`headerText`]),o(y,{class:`basic-input-example-theme`,theme:s(O),vue:R,headerText:t.$t(`sample.breadcrumbbar.custom-data-template`)},{example:n(()=>[o(v,{ItemsSource:M.value,onItemClicked:F},{ItemTemplate:n(({Item:t})=>[o(p,e({Text:t.Name,"aria-label":t.Name},{"AutomationProperties.Name":t.Name}),null,16,[`Text`,`aria-label`])]),_:1},8,[`ItemsSource`])]),options:n(()=>[o(h,{onClick:I},{default:n(()=>[o(p,{Text:t.$t(`sample.breadcrumbbar.reset-sample`)},null,8,[`Text`])]),_:1}),o(p,{class:`accessibility-announcement`,Text:N.value,"aria-live":`polite`,"AutomationProperties.LiveSetting":`Polite`},null,8,[`Text`])]),_:1},8,[`theme`,`headerText`])]),_:1})])])]),_:1}))}},[[`__scopeId`,`data-v-ad24291e`]]);export{T as default};