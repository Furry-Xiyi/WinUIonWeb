import{$ as e,D as t,E as n,G as r,H as i,K as a,N as o,S as s,X as c,g as l,h as u,m as d,n as f,t as ee}from"./WinScrollViewer-DPrZnleG.js";import{n as p,t as m}from"./WinTextBlock-CeUskDRc.js";import{a as h}from"./i18n-DA-FIA7C.js";import{c as g,r as _}from"./index-CMPZyTwE.js";import{t as v}from"./WinControlExample-C0uhK7Jb.js";import{t as y}from"./pageState-Mr-1-Xo1.js";import{t as b}from"./WinAppBarButton-BYDM3nok.js";var x={class:`gallery-item-page`},S={class:`page-heading`},C={class:`page-header-actions`},w={class:`icon`},T={class:`gallery-page-content`},E={class:`sample-row`},D={class:`sample-row`},O=`<WinAppBarButton
  Icon="Sort"
  IsCompact="True"
  ToolTipService.ToolTip="Sort"
  AutomationProperties.Name="Sort">
  <WinAppBarButton.Flyout>
    <WinMenuFlyout>
      <WinMenuFlyoutItem Text="By rating" Tag="rating" Click="MenuFlyoutItem_Click" />
      <WinMenuFlyoutItem Text="By match" Tag="match" Click="MenuFlyoutItem_Click" />
      <WinMenuFlyoutItem Text="By distance" Tag="distance" Click="MenuFlyoutItem_Click" />
    </WinMenuFlyout>
  </WinAppBarButton.Flyout>
</WinAppBarButton>`,k=`<WinButton Content="Options" Click="Control2_Click">
  <WinButton.Flyout>
    <WinMenuFlyout>
      <WinMenuFlyoutItem Text="Reset" />
      <WinMenuFlyoutSeparator />
      <WinToggleMenuFlyoutItem Text="Repeat" IsChecked="True" />
      <WinToggleMenuFlyoutItem Text="Shuffle" IsChecked="True" />
    </WinMenuFlyout>
  </WinButton.Flyout>
</WinButton>`,A=`<WinButton Content="File Options" Click="Control3_Click">
  <WinButton.Flyout>
    <WinMenuFlyout>
      <WinMenuFlyoutItem Text="Open" />
      <WinMenuFlyoutSubItem Text="Send to">
        <WinMenuFlyoutItem Text="Bluetooth" />
        <WinMenuFlyoutItem Text="Desktop (shortcut)" />
        <WinMenuFlyoutSubItem Text="Compressed file">
          <WinMenuFlyoutItem Text="Compress and email" />
          <WinMenuFlyoutItem Text="Compress to .7z" />
          <WinMenuFlyoutItem Text="Compress to .zip" />
        </WinMenuFlyoutSubItem>
      </WinMenuFlyoutSubItem>
    </WinMenuFlyout>
  </WinButton.Flyout>
</WinButton>`,j=`<WinButton Content="File Options" Click="Control3b_Click">
  <WinButton.Flyout>
    <WinMenuFlyout>
      <WinSplitMenuFlyoutItem Text="Save" Icon="Save" Click="SplitMenuFlyoutItem_Click">
        <WinMenuFlyoutItem Text="Save as .docx" Click="SplitMenuFlyoutItem_Click" />
        <WinMenuFlyoutItem Text="Save as .pdf" Click="SplitMenuFlyoutItem_Click" />
        <WinMenuFlyoutItem Text="Save as .txt" Click="SplitMenuFlyoutItem_Click" />
      </WinSplitMenuFlyoutItem>
      <WinSplitMenuFlyoutItem Text="Share" Icon="Share" Click="SplitMenuFlyoutItem_Click">
        <WinMenuFlyoutItem Text="Share via email" Click="SplitMenuFlyoutItem_Click" />
        <WinMenuFlyoutItem Text="Share via link" Click="SplitMenuFlyoutItem_Click" />
      </WinSplitMenuFlyoutItem>
    </WinMenuFlyout>
  </WinButton.Flyout>
</WinButton>`,M=`<WinButton Content="Edit Options" Click="Control4_Click">
  <WinButton.Flyout>
    <WinMenuFlyout>
      <WinMenuFlyoutItem Text="Share" Icon="Share" />
      <WinMenuFlyoutItem Text="Copy" Icon="Copy" />
      <WinMenuFlyoutItem Text="Delete" Icon="Delete" />
      <WinMenuFlyoutSeparator />
      <WinMenuFlyoutItem Text="Rename" />
      <WinMenuFlyoutItem Text="Select" />
    </WinMenuFlyout>
  </WinButton.Flyout>
</WinButton>`,N=`<WinButton Content="Edit Options" Click="Control5_Click">
  <WinButton.Flyout>
    <WinMenuFlyout>
      <WinMenuFlyoutItem Text="Share" Icon="Share">
        <WinMenuFlyoutItem.KeyboardAccelerators>
          <WinKeyboardAccelerator Key="S" Modifiers="Control" />
        </WinMenuFlyoutItem.KeyboardAccelerators>
      </WinMenuFlyoutItem>
      <WinMenuFlyoutItem Text="Copy" Icon="Copy" FontFamily="Consolas">
        <WinMenuFlyoutItem.KeyboardAccelerators>
          <WinKeyboardAccelerator Key="C" Modifiers="Control" />
        </WinMenuFlyoutItem.KeyboardAccelerators>
      </WinMenuFlyoutItem>
      <WinMenuFlyoutItem Text="Delete" Icon="Delete" FontFamily="Segoe UI">
        <WinMenuFlyoutItem.KeyboardAccelerators>
          <WinKeyboardAccelerator Key="Delete" />
        </WinMenuFlyoutItem.KeyboardAccelerators>
      </WinMenuFlyoutItem>
      <WinMenuFlyoutSeparator />
      <WinMenuFlyoutItem Text="Rename" />
      <WinMenuFlyoutItem Text="Select" />
    </WinMenuFlyout>
  </WinButton.Flyout>
</WinButton>`,P=`<WinButton Content="Options" Click="Control6_Click">
  <WinButton.Flyout>
    <WinMenuFlyout>
      <WinRadioMenuFlyoutItem GroupName="OrientationGroup" Text="Landscape" />
      <WinRadioMenuFlyoutItem GroupName="OrientationGroup" IsChecked="True" Text="Portrait" />
      <WinMenuFlyoutSeparator />
      <WinRadioMenuFlyoutItem GroupName="SizeGroup" Text="Small icons" />
      <WinRadioMenuFlyoutItem GroupName="SizeGroup" IsChecked="True" Text="Medium icons" />
      <WinRadioMenuFlyoutItem GroupName="SizeGroup" Text="Large icons" />
    </WinMenuFlyout>
  </WinButton.Flyout>
</WinButton>`,F=f({__name:`MenuFlyoutPage`,setup(f){let{t:F}=h(),I=n(`currentPage`),{isFavoriteState:L,pageTheme:R,toggleTheme:z,toggleFavorite:B}=y(d(()=>I?.value||`menuflyout`).value),V=()=>r({open:!1,anchor:null}),H=V(),U=V(),W=V(),G=V(),K=V(),q=V(),J=[H,U,W,G,K,q],Y=a(``),X=a(``),Z=(e,t)=>{J.forEach(e=>{e!==t&&(e.open=!1)}),t.anchor=e.currentTarget.getBoundingClientRect(),t.open=!t.open},Q=r([{Text:F(`sample.by-rating`),Tag:`rating`},{Text:F(`sample.by-match`),Tag:`match`},{Text:F(`sample.by-distance`),Tag:`distance`}]),$=d(()=>({Items:Q,Theme:R.value})),te=r([{Text:F(`sample.reset`)},{Kind:`MenuFlyoutSeparator`},{Kind:`ToggleMenuFlyoutItem`,Text:F(`sample.repeat`),IsChecked:!0},{Kind:`ToggleMenuFlyoutItem`,Text:F(`sample.shuffle`),IsChecked:!0}]),ne=r([{Text:F(`sample.open`)},{Kind:`MenuFlyoutSubItem`,Text:F(`sample.send-to`),Items:[{Text:F(`sample.bluetooth`)},{Text:F(`sample.desktop-shortcut`)},{Kind:`MenuFlyoutSubItem`,Text:F(`sample.compressed-file`),Items:[{Text:F(`sample.compress-email`)},{Text:F(`sample.compress-7z`)},{Text:F(`sample.compress-zip`)}]}]}]),re=r([{Kind:`SplitMenuFlyoutItem`,Text:F(`sample.save`),Icon:``,Items:[{Text:F(`sample.save-docx`)},{Text:F(`sample.save-pdf`)},{Text:F(`sample.save-txt`)}]},{Kind:`SplitMenuFlyoutItem`,Text:F(`sample.share`),Icon:``,Items:[{Text:F(`sample.share-email`)},{Text:F(`sample.share-link`)}]}]),ie=r([{Text:F(`sample.share`),Icon:``},{Text:F(`sample.copy`),Icon:``},{Text:F(`sample.delete`),Icon:``},{Kind:`MenuFlyoutSeparator`},{Text:F(`sample.rename`)},{Text:F(`sample.select`)}]),ae=r([{Text:F(`sample.share`),Icon:``,KeyboardAccelerators:[{Key:`S`,Modifiers:[`Control`]}],KeyboardAcceleratorTextOverride:`Ctrl+S`},{Text:F(`sample.copy`),Icon:``,KeyboardAccelerators:[{Key:`C`,Modifiers:[`Control`]}],KeyboardAcceleratorTextOverride:`Ctrl+C`},{Text:F(`sample.delete`),Icon:``,KeyboardAccelerators:[{Key:`Delete`}],KeyboardAcceleratorTextOverride:`Delete`},{Kind:`MenuFlyoutSeparator`},{Text:F(`sample.rename`)},{Text:F(`sample.select`)}]),oe=r([{Kind:`RadioMenuFlyoutItem`,GroupName:`OrientationGroup`,Text:F(`sample.landscape`)},{Kind:`RadioMenuFlyoutItem`,GroupName:`OrientationGroup`,Text:F(`sample.portrait`),IsChecked:!0},{Kind:`MenuFlyoutSeparator`},{Kind:`RadioMenuFlyoutItem`,GroupName:`SizeGroup`,Text:F(`sample.small-icons`)},{Kind:`RadioMenuFlyoutItem`,GroupName:`SizeGroup`,Text:F(`sample.medium-icons`),IsChecked:!0},{Kind:`RadioMenuFlyoutItem`,GroupName:`SizeGroup`,Text:F(`sample.large-icons`)}]),se=e=>{Y.value=F(`sample.sort-by`,{value:e.Tag})},ce=e=>{X.value=F(`sample.clicked`,{value:e.Text}),W.open=!1};return(n,r)=>(o(),l(ee,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:i(()=>[u(`div`,x,[u(`div`,S,[s(m,{class:`page-header`,Text:n.$t(`text.menuflyout`)},null,8,[`Text`]),s(m,{class:`page-description`,Text:n.$t(`text.a-menuflyout-displays-a-lightweight-menu-of-comm`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),u(`div`,C,[s(g,{class:`header-action`,onClick:c(z)},{default:i(()=>[...r[12]||=[u(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),s(_,{IsChecked:c(L),class:`header-action`,"onUpdate:IsChecked":c(B)},{default:i(()=>[u(`span`,w,e(c(L)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),u(`div`,T,[s(v,{class:`basic-input-example-theme`,headerText:n.$t(`text.a-menuflyout-attached-to-an-appbarbutton`),theme:c(R),vue:O},{example:i(()=>[u(`div`,E,[s(b,t({Icon:`Sort`,IsCompact:!0},{"ToolTipService.ToolTip":n.$t(`sample.sort`),"AutomationProperties.Name":n.$t(`sample.sort`)},{Flyout:$.value,onSelect:se}),null,16,[`Flyout`]),s(m,{class:`output-text`,Text:Y.value},null,8,[`Text`])])]),_:1},8,[`headerText`,`theme`]),s(v,{class:`basic-input-example-theme`,headerText:n.$t(`sample.menuflyout.toggle-items`),theme:c(R),vue:k},{example:i(()=>[s(g,{onClick:r[0]||=e=>Z(e,c(H))},{default:i(()=>[s(m,{Text:n.$t(`sample.options`)},null,8,[`Text`])]),_:1}),s(p,{Open:c(H).open,AnchorRect:c(H).anchor,Items:te,Theme:c(R),onClose:r[1]||=e=>c(H).open=!1},null,8,[`Open`,`AnchorRect`,`Items`,`Theme`])]),_:1},8,[`headerText`,`theme`]),s(v,{class:`basic-input-example-theme`,headerText:n.$t(`sample.menuflyout.cascading`),theme:c(R),vue:A},{example:i(()=>[s(g,{onClick:r[2]||=e=>Z(e,c(U))},{default:i(()=>[s(m,{Text:n.$t(`sample.file-options`)},null,8,[`Text`])]),_:1}),s(p,{Open:c(U).open,AnchorRect:c(U).anchor,Items:ne,Theme:c(R),onClose:r[3]||=e=>c(U).open=!1},null,8,[`Open`,`AnchorRect`,`Items`,`Theme`])]),_:1},8,[`headerText`,`theme`]),s(v,{class:`basic-input-example-theme`,headerText:n.$t(`sample.menuflyout.split-items`),theme:c(R),vue:j},{example:i(()=>[u(`div`,D,[s(g,{onClick:r[4]||=e=>Z(e,c(W))},{default:i(()=>[s(m,{Text:n.$t(`sample.file-options`)},null,8,[`Text`])]),_:1}),s(m,{class:`output-text`,Text:X.value},null,8,[`Text`])]),s(p,{Open:c(W).open,AnchorRect:c(W).anchor,Items:re,Theme:c(R),onClose:r[5]||=e=>c(W).open=!1,onSelect:ce},null,8,[`Open`,`AnchorRect`,`Items`,`Theme`])]),_:1},8,[`headerText`,`theme`]),s(v,{class:`basic-input-example-theme`,headerText:n.$t(`sample.menuflyout.icons`),theme:c(R),vue:M},{example:i(()=>[s(g,{onClick:r[6]||=e=>Z(e,c(G))},{default:i(()=>[s(m,{Text:n.$t(`sample.edit-options`)},null,8,[`Text`])]),_:1}),s(p,{Open:c(G).open,AnchorRect:c(G).anchor,Items:ie,Theme:c(R),onClose:r[7]||=e=>c(G).open=!1},null,8,[`Open`,`AnchorRect`,`Items`,`Theme`])]),_:1},8,[`headerText`,`theme`]),s(v,{class:`basic-input-example-theme`,headerText:n.$t(`sample.menuflyout.keyboard`),theme:c(R),vue:N},{example:i(()=>[s(g,{onClick:r[8]||=e=>Z(e,c(K))},{default:i(()=>[s(m,{Text:n.$t(`sample.edit-options`)},null,8,[`Text`])]),_:1}),s(p,{Open:c(K).open,AnchorRect:c(K).anchor,Items:ae,Theme:c(R),onClose:r[9]||=e=>c(K).open=!1},null,8,[`Open`,`AnchorRect`,`Items`,`Theme`])]),_:1},8,[`headerText`,`theme`]),s(v,{class:`basic-input-example-theme`,headerText:n.$t(`sample.menuflyout.radio`),theme:c(R),vue:P},{example:i(()=>[s(g,{onClick:r[10]||=e=>Z(e,c(q))},{default:i(()=>[s(m,{Text:n.$t(`sample.options`)},null,8,[`Text`])]),_:1}),s(p,{Open:c(q).open,AnchorRect:c(q).anchor,Items:oe,Theme:c(R),onClose:r[11]||=e=>c(q).open=!1},null,8,[`Open`,`AnchorRect`,`Items`,`Theme`])]),_:1},8,[`headerText`,`theme`])])])]),_:1}))}},[[`__scopeId`,`data-v-f3766107`]]);export{F as default};