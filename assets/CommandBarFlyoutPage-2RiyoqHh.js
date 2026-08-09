import{$ as e,E as t,H as n,K as r,N as i,S as a,X as o,g as s,h as c,l,m as u,n as d,t as f}from"./WinScrollViewer-DPrZnleG.js";import{t as p}from"./WinTextBlock-CoHJuwfG.js";import{r as m}from"./i18n-BZ_M1PVV.js";import{c as h,r as g}from"./index-C9zDjg90.js";import{t as _}from"./WinControlExample-D5UB47BQ.js";import{t as v}from"./pageState-Mr-1-Xo1.js";import{t as y}from"./WinCommandBarFlyout-C2WMsKQQ.js";var b={class:`gallery-item-page`},x={class:`page-heading`},S={class:`page-header-actions`},C={class:`icon`},w={class:`gallery-page-content`},T={class:`commandbarflyout-stack`},E=[`aria-label`],D=[`alt`],O=`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/rainier.jpg`,k=`<Page.Resources>
    <CommandBarFlyout Placement="Right" x:Name="CommandBarFlyout1">
        <AppBarButton Label="Share" Icon="Share" ToolTipService.ToolTip="Share" Click="OnElementClicked" />
        <AppBarButton Label="Save" Icon="Save" ToolTipService.ToolTip="Save" Click="OnElementClicked" />
        <AppBarButton Label="Delete" Icon="Delete" ToolTipService.ToolTip="Delete" Click="OnElementClicked" />
        <CommandBarFlyout.SecondaryCommands>
            <AppBarButton x:Name="ResizeButton1" Label="Resize" Click="OnElementClicked" />
            <AppBarButton x:Name="MoveButton1" Label="Move" Click="OnElementClicked" />
        </CommandBarFlyout.SecondaryCommands>
    </CommandBarFlyout>
</Page.Resources>

<Button x:Name="myImageButton" AutomationProperties.Name="mountain" Padding="0"
    Click="MyImageButton_Click" ContextRequested="MyImageButton_ContextRequested" >
    <Image x:Name="Image1" Height="300" Source="/Assets/SampleMedia/rainier.jpg"/>
</Button>`,A=d({__name:`CommandBarFlyoutPage`,setup(d){let{t:A}=m(),j=t(`currentPage`),{isFavoriteState:M,pageTheme:N,toggleTheme:P,toggleFavorite:F}=v(u(()=>j?.value||`commandbarflyout`).value),I=r(null),L=r(null),R=r(null),z=r(``),B=u(()=>[{Label:A(`sample.share`),Icon:`Share`,"ToolTipService.ToolTip":A(`sample.share`),Click:H},{Label:A(`sample.save`),Icon:`Save`,"ToolTipService.ToolTip":A(`sample.save`),Click:H},{Label:A(`sample.delete`),Icon:`Delete`,"ToolTipService.ToolTip":A(`sample.delete`),Click:H}]),V=u(()=>[{Name:`ResizeButton1`,Label:A(`sample.resize`),Click:H},{Name:`MoveButton1`,Label:A(`sample.move`),Click:H}]),H=e=>{z.value=A(`sample.you-clicked`,{name:e.Label})},U=e=>{let t=L.value??R.value;t&&I.value?.showAt(t,{ShowMode:e?`Transient`:`Standard`,Placement:`RightEdgeAlignedTop`})},W=()=>{U(!1)},G=()=>{U(!0)},K=`<WinCommandBarFlyout
  :PrimaryCommands="[
    { Label: 'Share', Icon: 'Share', 'ToolTipService.ToolTip': 'Share', Click: onElementClicked },
    { Label: 'Save', Icon: 'Save', 'ToolTipService.ToolTip': 'Save', Click: onElementClicked },
    { Label: 'Delete', Icon: 'Delete', 'ToolTipService.ToolTip': 'Delete', Click: onElementClicked }
  ]"
  :SecondaryCommands="[
    { Name: 'ResizeButton1', Label: 'Resize', Click: onElementClicked },
    { Name: 'MoveButton1', Label: 'Move', Click: onElementClicked }
  ]"
  Placement="Right"
  :ShowPrimaryLabels="true" />

<button @click="showMenu(true)" @contextmenu.prevent="showMenu(false)">
  <img src="${O}" height="300" />
</button>`;return(t,r)=>(i(),s(f,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[c(`div`,b,[c(`div`,x,[a(p,{class:`page-header`,Text:t.$t(`text.commandbarflyout`)},null,8,[`Text`]),a(p,{class:`page-description`,Text:t.$t(`text.the-commandbarflyout-lets-you-provide-users-with`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),c(`div`,S,[a(h,{class:`header-action`,onClick:o(P)},{default:n(()=>[...r[0]||=[c(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),a(g,{IsChecked:o(M),class:`header-action`,"onUpdate:IsChecked":o(F)},{default:n(()=>[c(`span`,C,e(o(M)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),c(`div`,w,[a(_,{class:`basic-input-example-theme`,headerText:t.$t(`sample.commandbarflyout.object`),theme:o(N),vue:K,xaml:k},{example:n(()=>[c(`div`,T,[a(p,{Text:t.$t(`sample.commandbarflyout.open-hint`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),c(`button`,{ref_key:`myImageButton`,ref:R,class:`image-button`,type:`button`,"aria-label":t.$t(`sample.mountain`),onClick:G,onContextmenu:l(W,[`prevent`])},[c(`img`,{ref_key:`image1`,ref:L,class:`sample-image`,src:O,alt:t.$t(`sample.mountain`)},null,8,D)],40,E),a(p,{Text:z.value},null,8,[`Text`])])]),_:1},8,[`headerText`,`theme`]),a(y,{ref_key:`commandBarFlyout1`,ref:I,PrimaryCommands:B.value,SecondaryCommands:V.value,Placement:`Right`,ShowPrimaryLabels:!0,Theme:o(N)},null,8,[`PrimaryCommands`,`SecondaryCommands`,`Theme`])])])]),_:1}))}},[[`__scopeId`,`data-v-1e8776e2`]]);export{A as default};