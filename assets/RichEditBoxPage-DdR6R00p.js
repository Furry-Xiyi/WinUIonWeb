import{$ as e,D as t,E as n,F as r,H as i,K as a,N as o,Q as s,S as c,X as l,d as u,g as d,h as f,m as p,n as m,t as h,v as g}from"./WinScrollViewer-DPrZnleG.js";import{t as _}from"./WinTextBlock-CeUskDRc.js";import{a as v}from"./i18n-DA-FIA7C.js";import{c as y,f as b,r as x}from"./index-CMPZyTwE.js";import{t as S}from"./WinControlExample-C0uhK7Jb.js";import{t as C}from"./pageState-Mr-1-Xo1.js";import{t as w}from"./WinFlyout-D6vU-XiH.js";import{t as T}from"./WinRichEditBox-JSTVdNxQ.js";var E={class:`gallery-item-page`},ee={style:{position:`relative`},class:`page-heading`},te={class:`page-header-actions`},D={class:`icon`},O={class:`gallery-page-content`},k={class:`official-custom-editor`},A={class:`official-toolbar`},j={class:`toolbar-start`},M={class:`toolbar-end`},N={class:`font-color-flyout`},P=[`aria-label`,`onClick`],F={class:`official-find-row`},I={class:`stack-example`},L={class:`stack-example`},R={class:`mathml-output-pre`},z=m({__name:`RichEditBoxPage`,setup(m){let{t:z}=v(),B=n(`currentPage`),{isFavoriteState:V,pageTheme:H,toggleTheme:ne,toggleFavorite:U}=C(p(()=>B?.value||`richeditbox`).value),W=a(``),G=a(``),K=a(``),q=a(``),J=a(``),Y=a(`<!-- ${z(`sample.richeditbox.no-mathml`)} -->`),X=a(null),Z=a(null),re=p(()=>[{value:`Red`,label:z(`text.red`)},{value:`Orange`,label:z(`sample.orange`)},{value:`Yellow`,label:z(`text.yellow`)},{value:`Green`,label:z(`text.green`)},{value:`Blue`,label:z(`text.blue`)},{value:`Indigo`,label:z(`sample.indigo`)},{value:`Violet`,label:z(`sample.violet`)},{value:`Gray`,label:z(`sample.gray`)}]),ie=p(()=>[{Label:z(`sample.richeditbox.share-command`),Icon:`Share`,"ToolTipService.ToolTip":z(`sample.richeditbox.share-command`),Click:ae}]),Q=e=>{console.log(`${e} clicked`)},ae=()=>{console.log(z(`sample.richeditbox.share-clicked`))},oe=e=>{X.value?.execCommand(`foreColor`,e),Z.value?.hide?.()},$=()=>{let e=J.value;Y.value=e.trim()?`<!-- ${z(`sample.richeditbox.web-preview`)} -->\n${e}`:`<!-- ${z(`sample.richeditbox.no-mathml`)} -->`},se=()=>{J.value=`x ∈ P(A) ↔ x ⊆ A`,Y.value=`<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mi>x</mi>
  <mo>∈</mo>
  <mi>P</mi>
  <mfenced><mi>A</mi></mfenced>
  <mo>↔</mo>
  <mi>x</mi>
  <mo>⊆</mo>
  <mi>A</mi>
</math>`},ce=p(()=>`<WinRichEditBox
  v-model:Text="simpleText"
  PlaceholderText="${z(`text.enter-rich-text`)}" />`),le=p(()=>`<WinRichEditBox
  :PrimaryCommands="customFlyoutPrimaryCommands"
  :Width="800"
  :Height="200" />`),ue=p(()=>`<div class="official-custom-editor">
  <div class="official-toolbar">
    <div class="toolbar-start">
      <WinButton class="toolbar-icon-button" @click="openFile"><span class="icon">&#xE8E5;</span></WinButton>
      <WinButton class="toolbar-icon-button" @click="saveFile"><span class="icon">&#xE74E;</span></WinButton>
    </div>
    <div class="toolbar-end">
      <WinButton class="toolbar-icon-button" @click="editor?.execCommand('bold')"><span class="icon">&#xE8DD;</span></WinButton>
      <WinButton class="toolbar-icon-button" @click="editor?.execCommand('italic')"><span class="icon">&#xE8DB;</span></WinButton>
      <WinFlyout ref="fontColorFlyout" Placement="Bottom" :Theme="pageTheme">
        <template #trigger>
          <WinButton class="toolbar-icon-button" @click="fontColorFlyout?.toggle()"><span class="icon">&#xE790;</span></WinButton>
        </template>
        <div class="font-color-flyout">
          <button v-for="color in colors" :key="color.value" class="color-menu-button" @click="applyEditorColor(color.value)">
            <span class="color-swatch" :style="{ background: color.value }"></span>
          </button>
        </div>
      </WinFlyout>
    </div>
  </div>
  <WinRichEditBox ref="editor" v-model:Html="customHtml" :Height="200" />
  <WinTextBox v-model:Text="findText" PlaceholderText="${z(`sample.richeditbox.search-placeholder`)}" />
</div>`),de=p(()=>`<WinRichEditBox
  v-model:Text="mathText"
  PlaceholderText="${z(`sample.richeditbox.math-placeholder`)}"
  :ShowFormattingCommands="false"
  :Width="724"
  :Height="80" />`),fe=p(()=>`<WinRichEditBox
  v-model:Text="mathmlText"
  :ShowFormattingCommands="false"
  :Height="80"
  @TextChanged="updateMathmlOutput" />
<pre>{{ mathmlOutput }}</pre>
<WinButton @click="setSampleFormula">
  <WinTextBlock Text="${z(`sample.richeditbox.set-sample-formula`)}" />
</WinButton>`);return(n,a)=>(o(),d(h,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:i(()=>[f(`div`,E,[f(`div`,ee,[c(_,{class:`page-header`,Text:n.$t(`text.richeditbox`)},null,8,[`Text`]),c(_,{class:`page-description`,Text:n.$t(`text.the-richeditbox-control-lets-a-user-enter-format`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),f(`div`,te,[c(y,t({class:`header-action`},{"tooltipservice.tooltip":n.$t(`sample.navigationview.change-theme`)},{onClick:l(ne)}),{default:i(()=>[...a[10]||=[f(`span`,{class:`icon`},``,-1)]]),_:1},16,[`onClick`]),c(x,t({class:`header-action`,IsChecked:l(V)},{"tooltipservice.tooltip":l(V)?n.$t(`sample.navigationview.remove-favorite`):n.$t(`sample.navigationview.add-favorite`)},{"onUpdate:IsChecked":l(U)}),{default:i(()=>[f(`span`,D,e(l(V)?``:``),1)]),_:1},16,[`IsChecked`,`onUpdate:IsChecked`])])]),f(`div`,O,[c(S,{class:`basic-input-example-theme`,theme:l(H),HorizontalContentAlignment:`Stretch`,vue:ce.value,headerText:n.$t(`text.a-simple-text-editor`)},{example:i(()=>[c(T,{Text:W.value,"onUpdate:Text":a[0]||=e=>W.value=e,PlaceholderText:n.$t(`text.enter-rich-text`)},null,8,[`Text`,`PlaceholderText`])]),_:1},8,[`theme`,`vue`,`headerText`]),c(S,{class:`basic-input-example-theme`,theme:l(H),vue:le.value,headerText:n.$t(`sample.richeditbox.custom-command-flyout`)},{example:i(()=>[c(T,{PrimaryCommands:ie.value,Width:800,Height:200},null,8,[`PrimaryCommands`])]),_:1},8,[`theme`,`vue`,`headerText`]),c(S,{class:`basic-input-example-theme`,theme:l(H),HorizontalContentAlignment:`Stretch`,vue:ue.value,headerText:n.$t(`sample.richeditbox.custom-formatting-editor`)},{example:i(()=>[f(`div`,k,[f(`div`,A,[f(`div`,j,[c(y,t({class:`toolbar-icon-button`,onClick:a[1]||=e=>Q(n.$t(`sample.richeditbox.open-file`))},{"tooltipservice.tooltip":n.$t(`sample.richeditbox.open-file`)}),{default:i(()=>[...a[11]||=[f(`span`,{class:`icon`},``,-1)]]),_:1},16),c(y,t({class:`toolbar-icon-button`,onClick:a[2]||=e=>Q(n.$t(`sample.richeditbox.save-file`))},{"tooltipservice.tooltip":n.$t(`sample.richeditbox.save-file`)}),{default:i(()=>[...a[12]||=[f(`span`,{class:`icon`},``,-1)]]),_:1},16)]),f(`div`,M,[c(y,t({class:`toolbar-icon-button`,onClick:a[3]||=e=>X.value?.execCommand(`bold`)},{"tooltipservice.tooltip":n.$t(`sample.richeditbox.bold`)}),{default:i(()=>[...a[13]||=[f(`span`,{class:`icon`},``,-1)]]),_:1},16),c(y,t({class:`toolbar-icon-button`,onClick:a[4]||=e=>X.value?.execCommand(`italic`)},{"tooltipservice.tooltip":n.$t(`sample.richeditbox.italic`)}),{default:i(()=>[...a[14]||=[f(`span`,{class:`icon`},``,-1)]]),_:1},16),c(w,{ref_key:`fontColorFlyout`,ref:Z,Placement:`Bottom`,Theme:l(H)},{trigger:i(()=>[c(y,t({class:`toolbar-icon-button`,onClick:a[5]||=e=>Z.value?.toggle()},{"tooltipservice.tooltip":n.$t(`sample.richeditbox.font-color`)}),{default:i(()=>[...a[15]||=[f(`span`,{class:`icon`},``,-1)]]),_:1},16)]),default:i(()=>[f(`div`,N,[(o(!0),g(u,null,r(re.value,e=>(o(),g(`button`,t({key:e.value,class:`color-menu-button`,"aria-label":e.label},{ref_for:!0},{"tooltipservice.tooltip":e.label},{onClick:t=>oe(e.value)}),[f(`span`,{class:`color-swatch`,style:s({background:e.value})},null,4)],16,P))),128))])]),_:1},8,[`Theme`])])]),c(T,{ref_key:`customEditor`,ref:X,Html:G.value,"onUpdate:Html":a[6]||=e=>G.value=e,ShowFormattingCommands:!1,Height:200},null,8,[`Html`]),f(`div`,F,[c(_,{Text:n.$t(`sample.richeditbox.find-label`)},null,8,[`Text`]),c(b,{Text:K.value,"onUpdate:Text":a[7]||=e=>K.value=e,PlaceholderText:n.$t(`sample.richeditbox.search-placeholder`),style:{width:`224px`}},null,8,[`Text`,`PlaceholderText`])])])]),_:1},8,[`theme`,`vue`,`headerText`]),c(S,{class:`basic-input-example-theme`,theme:l(H),vue:de.value,headerText:n.$t(`sample.richeditbox.math-mode`)},{example:i(()=>[f(`div`,I,[c(_,{class:`note-text`,Text:n.$t(`sample.richeditbox.math-note`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),c(_,{class:`note-text`,Text:n.$t(`sample.richeditbox.math-example`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),c(T,{Text:q.value,"onUpdate:Text":a[8]||=e=>q.value=e,PlaceholderText:n.$t(`sample.richeditbox.math-placeholder`),ShowFormattingCommands:!1,Width:724,Height:80},null,8,[`Text`,`PlaceholderText`])])]),_:1},8,[`theme`,`vue`,`headerText`]),c(S,{class:`basic-input-example-theme`,theme:l(H),HorizontalContentAlignment:`Stretch`,vue:fe.value,headerText:n.$t(`sample.richeditbox.mathml`)},{example:i(()=>[f(`div`,L,[c(_,{class:`note-text`,Text:n.$t(`sample.richeditbox.mathml-set-note`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),c(_,{class:`note-text`,Text:n.$t(`sample.richeditbox.mathml-get-note`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),c(T,{Text:J.value,"onUpdate:Text":a[9]||=e=>J.value=e,ShowFormattingCommands:!1,Height:80,onTextChanged:$},null,8,[`Text`]),c(_,{class:`mathml-title`,Text:n.$t(`sample.richeditbox.mathml-code`)},null,8,[`Text`]),c(h,{class:`mathml-output`,VerticalScrollMode:`Auto`,VerticalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,HorizontalScrollBarVisibility:`Auto`},{default:i(()=>[f(`pre`,R,e(Y.value),1)]),_:1})])]),options:i(()=>[c(y,{onClick:se},{default:i(()=>[c(_,{Text:n.$t(`sample.richeditbox.set-sample-formula`)},null,8,[`Text`])]),_:1})]),_:1},8,[`theme`,`vue`,`headerText`])])])]),_:1}))}},[[`__scopeId`,`data-v-7371bf02`]]);export{z as default};